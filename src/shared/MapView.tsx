import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { LngLatLike } from 'maplibre-gl'
import type { Feature } from 'geojson'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Day, Leg, Place } from '../data/types'
import { MODE_COLOR, KIND_ICON, KIND_LABEL } from '../data/style'
import { mealOf } from '../data/timeline'
import { iconHtml } from './icons'
import { pickHtml } from './pickHtml'
import { pickOf } from '../data/picks'
import { photoUrl } from '../data/photos'

interface Props {
  days: Day[]
  places: Record<string, Place>
  routes: Record<string, [number, number][]>
  day: Day | null
  hovered: string | null
  selected: string | null
  /** "day-leg" key of the travel block under the mouse, e.g. "4-2" */
  hotLeg: string | null
  /** A travel block that was clicked: the map moves to show its route (t makes a second click move again) */
  focusLeg: { key: string; t: number } | null
  /** Place under the mouse in the timeline: ring only, no popup */
  lit: string | null
  onHover?: (id: string | null) => void
  onSelect: (id: string) => void
  onPickDay: (n: number) => void
  /** A route line was tapped ("day-leg" key) */
  onLeg?: (key: string) => void
  /** Space to keep clear of the panels on top of the map, in px */
  frame: () => Pad
  /** Where a selected place goes, in px from the centre of the map */
  placeOffset: () => [number, number]
  /** Change it to frame the whole day (or trip) again */
  refit?: number
  /** Changed to fly to the selected place again */
  reselect?: number
  /** Desktop: a preview card over a pin under the mouse, and the zoom buttons */
  hoverTips?: boolean
  /** A searched place, not in the plan: its own pin, and the map flies there */
  found?: { key: string; name: string; lat: number; lon: number } | null
}

export type Pad = { top: number; bottom: number; left: number; right: number }

type Coord = [number, number]

// Vite cannot follow MapLibre's runtime worker lookup, so hand it the bundled worker.
// Through the free ngrok link, a plain worker request from iOS Safari gets ngrok's HTML warning page, not the script:
// the map then draws no routes. So fetch the script with the header that skips the warning, and run it from a blob.
let workerDone = false
const workerReady: Promise<void> = fetch(workerUrl, { headers: { 'ngrok-skip-browser-warning': '1' } })
  .then((r) => {
    if (!r.ok || (r.headers.get('content-type') ?? '').includes('html')) throw new Error('worker script not loaded')
    return r.blob()
  })
  .then((b) => maplibregl.setWorkerUrl(URL.createObjectURL(new Blob([b], { type: 'text/javascript' }))))
  .catch(() => maplibregl.setWorkerUrl(workerUrl))
  .then(() => {
    workerDone = true
  })

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services'

function arc(a: Coord, b: Coord): Coord[] {
  // Curved line for flights so they read as air travel, not a road
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const c: Coord = [mx - dy * 0.18, my + dx * 0.18]
  const pts: Coord[] = []
  for (let t = 0; t <= 1.0001; t += 0.04) {
    const u = 1 - t
    pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]])
  }
  return pts
}

function legLine(leg: Leg, key: string, places: Record<string, Place>, routes: Props['routes']): Coord[] {
  const a = places[leg.from]
  const b = places[leg.to]
  const pa: Coord = [a.lon, a.lat]
  const pb: Coord = [b.lon, b.lat]
  if (leg.mode === 'flight') return arc(pa, pb)
  return routes[key] ?? [pa, pb]
}

function buildRoutes(days: Day[], day: Day | null, places: Record<string, Place>, routes: Props['routes']) {
  const features: Feature[] = []
  for (const d of days) {
    d.legs.forEach((leg, i) => {
      if (!places[leg.from] || !places[leg.to]) return
      const active = !day || d.n === day.n
      features.push({
        type: 'Feature',
        properties: { key: `${d.n}-${i}`, mode: leg.mode, active: active ? 1 : 0, color: MODE_COLOR[leg.mode] },
        geometry: { type: 'LineString', coordinates: legLine(leg, `${d.n}-${i}`, places, routes) },
      })
    })
  }
  return { type: 'FeatureCollection' as const, features }
}

/**
 * How long a flight takes: longer for a longer trip, 1.2–3.5 s.
 * Not maxDuration: MapLibre does not cap a flight that is too long, it sets its time to 0 and the camera jumps.
 */
function flyTime(m: maplibregl.Map, to: [number, number]) {
  const km = m.getCenter().distanceTo(new maplibregl.LngLat(to[0], to[1])) / 1000
  return Math.min(3500, 1200 + 450 * Math.log2(1 + km))
}

/** Keep what the map shows clear of the panels on top of it */
function framePadding(m: maplibregl.Map, want: Pad) {
  const padding = { ...want }
  // Padding larger than the map makes MapLibre skip the move; keep at least 80 px of map visible
  const W = m.getContainer().clientWidth
  const H = m.getContainer().clientHeight
  const fit = (a: number, b: number, room: number) => {
    const over = a + b - (room - 80)
    return over > 0 ? [Math.max(0, a - over / 2), Math.max(0, b - over / 2)] : [a, b]
  }
  ;[padding.top, padding.bottom] = fit(padding.top, padding.bottom, H)
  ;[padding.left, padding.right] = fit(padding.left, padding.right, W)
  return padding
}

/** Waits for the map worker, then shows the map */
export default function MapView(props: Props) {
  const [ok, setOk] = useState(workerDone)
  useEffect(() => {
    if (!ok) workerReady.then(() => setOk(true))
  }, [ok])
  return ok ? <MapInner {...props} /> : <div className="map" />
}

function MapInner(props: Props) {
  const { days, places, routes, day, hovered, selected, hotLeg, focusLeg, lit, refit = 0, reselect = 0, hoverTips = false, found = null } = props
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<Map<string, { m: maplibregl.Marker; el: HTMLElement }>>(new Map())
  const ready = useRef(false)
  const pending = useRef<(() => void) | null>(null)
  // The latest callbacks and frame, for listeners that MapLibre keeps from the first render
  const cb = useRef(props)
  useEffect(() => {
    cb.current = props
  })

  useEffect(() => {
    if (!box.current) return
    const m = new maplibregl.Map({
      container: box.current,
      style: {
        version: 8,
        sources: {
          sat: {
            type: 'raster',
            tiles: [`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`],
            tileSize: 256,
            maxzoom: 19,
            attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          },
          ref: {
            type: 'raster',
            tiles: [`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`],
            tileSize: 256,
            maxzoom: 19,
          },
          dem: {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 14,
            attribution: 'Terrain: Mapzen, AWS Open Data',
          },
        },
        sky: {
          'sky-color': '#16324d',
          'horizon-color': '#9fb6c9',
          'fog-color': '#6f8597',
          'sky-horizon-blend': 0.6,
          'horizon-fog-blend': 0.7,
          'fog-ground-blend': 0.85,
          'atmosphere-blend': 0.6,
        },
        layers: [
          { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': -0.15, 'raster-contrast': 0.05 } },
          { id: 'ref', type: 'raster', source: 'ref', paint: { 'raster-opacity': 0.55 } },
        ],
      },
      center: [140.2, 38.6],
      zoom: 4.6,
      maxPitch: 70,
      attributionControl: { compact: true },
    })
    if (hoverTips) m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right')
    // A tab that was hidden (display: none) has a map of size 0; draw it again when it shows
    const ro = new ResizeObserver(() => m.resize())
    ro.observe(box.current)
    // Place names are flat images: when the map tilts they stretch and blur, so show them only on a flat map
    m.on('pitch', () => {
      if (m.getLayer('ref')) m.setLayoutProperty('ref', 'visibility', m.getPitch() > 20 ? 'none' : 'visible')
    })
    m.on('load', () => {
      // The credits start open and cover pins in the lower right; keep them behind the (i) button
      box.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
      m.setTerrain({ source: 'dem', exaggeration: 1.25 })
      m.addSource('routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      m.addLayer({
        id: 'routes-casing',
        type: 'line',
        source: 'routes',
        filter: ['all', ['==', ['get', 'active'], 1], ['!=', ['get', 'mode'], 'flight']],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#07111c', 'line-width': 7, 'line-opacity': 0.55 },
      })
      m.addLayer({
        id: 'routes-dim',
        type: 'line',
        source: 'routes',
        filter: ['==', ['get', 'active'], 0],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 2, 'line-opacity': 0.35 },
      })
      m.addLayer({
        id: 'routes-line',
        type: 'line',
        source: 'routes',
        filter: ['all', ['==', ['get', 'active'], 1], ['!', ['in', ['get', 'mode'], ['literal', ['flight', 'walk']]]]],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 4 },
      })
      m.addLayer({
        id: 'routes-dashed',
        type: 'line',
        source: 'routes',
        filter: ['all', ['==', ['get', 'active'], 1], ['in', ['get', 'mode'], ['literal', ['flight', 'walk']]]],
        layout: { 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-dasharray': [1, 2] },
      })
      // Wide and clear, so a finger can tap a thin line
      m.addLayer({
        id: 'routes-hit',
        type: 'line',
        source: 'routes',
        filter: ['==', ['get', 'active'], 1],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#000000', 'line-width': 24, 'line-opacity': 0 },
      })
      // The route of the travel block under the mouse in the timeline: a white glow, then the line on top
      m.addLayer({
        id: 'routes-hot-glow',
        type: 'line',
        source: 'routes',
        filter: ['==', ['get', 'key'], ''],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 12, 'line-opacity': 0.9, 'line-blur': 2 },
      })
      m.addLayer({
        id: 'routes-hot',
        type: 'line',
        source: 'routes',
        filter: ['==', ['get', 'key'], ''],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 6 },
      })
      ready.current = true
      pending.current?.()
      pending.current = null
    })
    // Tap a route line: its travel steps
    const tapLeg = (e: maplibregl.MapLayerMouseEvent) => {
      const key = e.features?.[0]?.properties?.key
      if (key && cb.current.onLeg) cb.current.onLeg(String(key))
    }
    m.on('click', 'routes-hit', tapLeg)
    m.on('mouseenter', 'routes-hit', () => cb.current.onLeg && (m.getCanvas().style.cursor = 'pointer'))
    m.on('mouseleave', 'routes-hit', () => (m.getCanvas().style.cursor = ''))
    map.current = m
    return () => {
      ro.disconnect()
      m.remove()
      map.current = null
      ready.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Three looks only: other days faded, the selected day normal, the hovered leg highlighted
  useEffect(() => {
    const m = map.current
    if (!m || !ready.current) return
    // One travel part ("4-2") or several in a row ("4-1,4-2")
    const keys = (hotLeg ?? '').split(',').filter(Boolean)
    const filter: maplibregl.FilterSpecification = ['in', ['get', 'key'], ['literal', keys]]
    m.setFilter('routes-hot-glow', filter)
    m.setFilter('routes-hot', filter)
  }, [hotLeg])

  // Routes, markers and camera follow the selected tab
  useEffect(() => {
    const m = map.current
    if (!m) return
    const apply = () => {
      ;(m.getSource('routes') as maplibregl.GeoJSONSource).setData(buildRoutes(days, day, places, routes))

      markers.current.forEach(({ m: mk }) => mk.remove())
      markers.current.clear()


      const pins: { id: string; label: string; place: Place; dayN?: number; time?: string; what?: string }[] = []
      if (day) {
        const seen = new Set<string>()
        let i = 0
        for (const s of day.stops) {
          if (seen.has(s.place)) continue
          seen.add(s.place)
          i += 1
          pins.push({ id: s.place, label: String(i), place: places[s.place], time: s.time, what: mealOf(s) ?? undefined })
        }
      } else {
        const seen = new Map<string, number[]>()
        const home = new Set<number>()
        for (const d of days) {
          const id = d.sleep ?? d.stops[d.stops.length - 1].place
          // A day with no hotel ends at the airport: that pin is the way home, not a night
          if (!d.sleep) home.add(d.n)
          seen.set(id, [...(seen.get(id) ?? []), d.n])
        }
        // "9·10·11" becomes "9–11" so the label stays short on crowded spots
        const short = (ns: number[]) =>
          ns.every((n, k) => k === 0 || n === ns[k - 1] + 1) && ns.length > 2 ? `${ns[0]}–${ns[ns.length - 1]}` : ns.join('·')
        seen.forEach((ns, id) => {
          const nights = ns.filter((n) => !home.has(n))
          const what = nights.length
            ? `${nights.length > 1 ? 'Nights' : 'Night'} ${short(nights).replace(/·/g, ', ')}${nights.length < ns.length ? ', then home' : ''}`
            : `Day ${ns.join(', ')}: fly home`
          pins.push({ id, label: short(ns), place: places[id], dayN: ns[0], what })
        })
      }

      const bounds = new maplibregl.LngLatBounds()
      for (const p of pins) {
        const el = document.createElement('button')
        el.className = `pin kind-${p.place.kind}${day ? '' : ' pin-night'}`
        el.setAttribute('aria-label', `${p.place.en} ${p.place.ja}`)
        const img = p.place.photo
          ? `<img src="${photoUrl(p.place.photo, 160)}" alt="" loading="lazy">`
          : iconHtml(KIND_ICON[p.place.kind], 20)
        el.innerHTML = `
          <span class="pin-ring">${img}</span>
          <span class="pin-num">${p.label}</span>
          ${hoverTips ? `<span class="pin-tip">
            ${p.place.photo ? `<img src="${photoUrl(p.place.photo, 480)}" alt="">` : ''}
            <span class="pin-tip-body">
              <span class="pin-tip-kind">${day ? (p.time ? p.time + ' · ' : '') + (p.what ?? KIND_LABEL[p.place.kind]) : p.what}</span>
              <span class="pin-tip-ja" lang="ja">${p.place.ja}</span>
              <span class="pin-tip-en">${p.place.en}</span>
              ${day ? pickHtml(pickOf(p.id)) : ''}
              ${day ? '' : `<span class="pin-tip-hint">Open day ${p.dayN}</span>`}
            </span>
          </span>` : ''}`
        el.addEventListener('mouseenter', () => {
          // Show the preview under the pin when there is no room above it
          el.classList.toggle('tip-below', el.getBoundingClientRect().top < 330)
          cb.current.onHover?.(p.id)
        })
        el.addEventListener('mouseleave', () => cb.current.onHover?.(null))
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          if (p.dayN) cb.current.onPickDay(p.dayN)
          else cb.current.onSelect(p.id)
        })
        const mk = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([p.place.lon, p.place.lat]).addTo(m)
        markers.current.set(p.id, { m: mk, el })
        bounds.extend([p.place.lon, p.place.lat])
      }
      if (day) {
        day.legs.forEach((leg, i) => {
          if (leg.mode === 'flight') return
          for (const c of legLine(leg, `${day.n}-${i}`, places, routes)) bounds.extend(c as LngLatLike)
        })
      }
      m.fitBounds(bounds, {
        padding: framePadding(m, cb.current.frame()),
        maxZoom: 14,
        pitch: day ? 40 : 0,
        bearing: 0,
        duration: 1600,
        essential: true,
      })
    }
    if (ready.current) apply()
    else pending.current = apply
  }, [day, days, places, routes, refit])

  // Hover and selection highlight on markers
  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      el.classList.toggle('is-hot', id === hovered)
      if (id === hovered) el.classList.toggle('tip-below', el.getBoundingClientRect().top < 330)
      el.classList.toggle('is-selected', id === selected)
      el.classList.toggle('is-lit', id === lit)
    })
  }, [hovered, selected, lit, day])

  // Show the whole route of a clicked travel block
  useEffect(() => {
    const m = map.current
    if (!m || !focusLeg || !ready.current) return
    const bounds = new maplibregl.LngLatBounds()
    for (const key of focusLeg.key.split(',')) {
      const [n, i] = key.split('-').map(Number)
      const leg = days.find((d) => d.n === n)?.legs[i]
      if (!leg || !places[leg.from] || !places[leg.to]) continue
      for (const c of legLine(leg, key, places, routes)) bounds.extend(c as LngLatLike)
    }
    if (bounds.isEmpty()) return
    const cam = m.cameraForBounds(bounds, { padding: framePadding(m, cb.current.frame()), maxZoom: 16 })
    // Flat: the camera is worked out for a flat map; a tilt would push the far end of the route out of the frame
    if (cam) m.flyTo({ ...cam, pitch: 0, bearing: 0, curve: 1.6, duration: flyTime(m, bounds.getCenter().toArray() as [number, number]), essential: true })
  }, [focusLeg, days, places, routes])

  // Fly to a selected place
  useEffect(() => {
    const m = map.current
    if (!m || !selected || !ready.current) return
    const p = places[selected]
    if (!p) return
    // flyTo zooms out until both places are in view, then zooms in, on one smooth arc
    m.flyTo({
      center: [p.lon, p.lat],
      // Not closer than 15: closer satellite tiles load slowly and stay blurry on mobile data
      zoom: Math.min(15, Math.max(m.getZoom(), p.kind === 'fuji' || p.kind === 'ski' ? 12.5 : 15)),
      pitch: 45,
      // Centre the place in the free space between the panels. An offset, not a padding:
      // MapLibre keeps a padding and adds it to the next fitBounds, which then cannot fit and does not move.
      offset: cb.current.placeOffset(),
      curve: 1.6,
      duration: flyTime(m, [p.lon, p.lat]),
      essential: true,
    })
  }, [selected, places, reselect])

  // A searched place: a red pin, and the map flies to it
  const foundPin = useRef<maplibregl.Marker | null>(null)
  useEffect(() => {
    const m = map.current
    foundPin.current?.remove()
    foundPin.current = null
    if (!m || !found || !ready.current) return
    const el = document.createElement('div')
    el.className = 'pin-found'
    el.setAttribute('aria-label', found.name)
    el.innerHTML = `<span class="pin-found-dot"></span><span class="pin-found-name"></span>`
    el.querySelector('.pin-found-name')!.textContent = found.name
    foundPin.current = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([found.lon, found.lat]).addTo(m)
    m.flyTo({
      center: [found.lon, found.lat],
      zoom: Math.min(16, Math.max(m.getZoom(), 15)),
      pitch: 0,
      offset: cb.current.placeOffset(),
      curve: 1.6,
      duration: flyTime(m, [found.lon, found.lat]),
      essential: true,
    })
  }, [found])

  return <div ref={box} className="map" />
}

