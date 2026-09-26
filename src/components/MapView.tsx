import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { LngLatLike } from 'maplibre-gl'
import type { Feature } from 'geojson'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Day, Leg, Place } from '../data/types'
import { MODE_COLOR, KIND_LABEL } from '../data/style'
import { photoUrl } from '../data/photos'

interface Props {
  days: Day[]
  places: Record<string, Place>
  routes: Record<string, [number, number][]>
  day: Day | null
  hovered: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onPickDay: (n: number) => void
}

type Coord = [number, number]

// Vite cannot follow MapLibre's runtime worker lookup, so hand it the bundled worker
maplibregl.setWorkerUrl(workerUrl)

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
        properties: { mode: leg.mode, active: active ? 1 : 0, color: MODE_COLOR[leg.mode] },
        geometry: { type: 'LineString', coordinates: legLine(leg, `${d.n}-${i}`, places, routes) },
      })
    })
  }
  return { type: 'FeatureCollection' as const, features }
}

export default function MapView(props: Props) {
  const { days, places, routes, day, hovered, selected, onHover, onSelect, onPickDay } = props
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<Map<string, { m: maplibregl.Marker; el: HTMLElement }>>(new Map())
  const ready = useRef(false)
  const pending = useRef<(() => void) | null>(null)
  const cb = useRef({ onHover, onSelect, onPickDay })
  useEffect(() => {
    cb.current = { onHover, onSelect, onPickDay }
  }, [onHover, onSelect, onPickDay])

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
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right')
    m.on('load', () => {
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
      ready.current = true
      pending.current?.()
      pending.current = null
    })
    map.current = m
    return () => {
      m.remove()
      map.current = null
      ready.current = false
    }
  }, [])

  // Routes, markers and camera follow the selected tab
  useEffect(() => {
    const m = map.current
    if (!m) return
    const apply = () => {
      ;(m.getSource('routes') as maplibregl.GeoJSONSource).setData(buildRoutes(days, day, places, routes))

      markers.current.forEach(({ m: mk }) => mk.remove())
      markers.current.clear()


      const pins: { id: string; label: string; place: Place; dayN?: number; time?: string }[] = []
      if (day) {
        const seen = new Set<string>()
        let i = 0
        for (const s of day.stops) {
          if (seen.has(s.place)) continue
          seen.add(s.place)
          i += 1
          pins.push({ id: s.place, label: String(i), place: places[s.place], time: s.time })
        }
      } else {
        const seen = new Map<string, number[]>()
        for (const d of days) {
          const id = d.sleep ?? d.stops[d.stops.length - 1].place
          seen.set(id, [...(seen.get(id) ?? []), d.n])
        }
        seen.forEach((ns, id) => {
          const label = ns.join('·')
          pins.push({ id, label, place: places[id], dayN: ns[0] })
        })
      }

      const bounds = new maplibregl.LngLatBounds()
      for (const p of pins) {
        const el = document.createElement('button')
        el.className = `pin kind-${p.place.kind}${day ? '' : ' pin-night'}`
        el.setAttribute('aria-label', `${p.place.en} ${p.place.ja}`)
        const img = p.place.photo ? `<img src="${photoUrl(p.place.photo, 160)}" alt="" loading="lazy">` : ''
        el.innerHTML = `
          <span class="pin-ring">${img}</span>
          <span class="pin-num">${p.label}</span>
          <span class="pin-tip">
            ${p.place.photo ? `<img src="${photoUrl(p.place.photo, 480)}" alt="">` : ''}
            <span class="pin-tip-body">
              <span class="pin-tip-kind">${day ? (p.time ? p.time + ' · ' : '') + KIND_LABEL[p.place.kind] : (p.label.includes('·') ? 'Nights ' : 'Night ') + p.label.replace(/·/g, ', ')}</span>
              <span class="pin-tip-ja" lang="ja">${p.place.ja}</span>
              <span class="pin-tip-en">${p.place.en}</span>
              ${day ? '' : `<span class="pin-tip-hint">Open day ${p.dayN}</span>`}
            </span>
          </span>`
        el.addEventListener('mouseenter', () => {
          // Show the preview under the pin when there is no room above it
          el.classList.toggle('tip-below', el.getBoundingClientRect().top < 330)
          cb.current.onHover(p.id)
        })
        el.addEventListener('mouseleave', () => cb.current.onHover(null))
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
      // Keep the route clear of the floating board and the photo strip
      const narrow = window.innerWidth < 760
      const board = document.querySelector('.board')?.getBoundingClientRect()
      const strip = document.querySelector('.strip')?.getBoundingClientRect()
      const bottom = strip ? window.innerHeight - strip.top + 10 : 230
      const padding = narrow
        ? { top: (board?.bottom ?? 300) + 30, bottom, left: 40, right: 40 }
        : { top: 110, bottom, left: (board?.right ?? 420) + 50, right: 80 }
      m.fitBounds(bounds, {
        padding,
        maxZoom: 14,
        pitch: day ? 40 : 0,
        bearing: 0,
        duration: 1600,
        essential: true,
      })
    }
    if (ready.current) apply()
    else pending.current = apply
  }, [day, days, places, routes])

  // Hover and selection highlight on markers
  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      el.classList.toggle('is-hot', id === hovered)
      if (id === hovered) el.classList.toggle('tip-below', el.getBoundingClientRect().top < 330)
      el.classList.toggle('is-selected', id === selected)
    })
  }, [hovered, selected, day])

  // Fly to a selected place
  useEffect(() => {
    const m = map.current
    if (!m || !selected || !ready.current) return
    const p = places[selected]
    if (!p) return
    const narrow = window.innerWidth < 760
    m.easeTo({
      center: [p.lon, p.lat],
      zoom: Math.max(m.getZoom(), p.kind === 'fuji' || p.kind === 'ski' ? 12.5 : 15),
      pitch: 45,
      padding: narrow ? { top: 80, bottom: 380, left: 0, right: 0 } : { top: 80, bottom: 220, left: 440, right: 460 },
      duration: 1400,
    })
  }, [selected, places])

  return <div ref={box} className="map" />
}

