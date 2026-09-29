/**
 * Search any place in Japan by name (English or Japanese) with OpenStreetMap data:
 * Photon (komoot) for the search, Nominatim for the place details, Wikipedia for a text and a photo.
 * All three are free and need no key; they ask for light use, so the search waits for a pause in the typing.
 */

export interface Found {
  /** "N123" / "W456" / "R789": the OpenStreetMap object */
  key: string
  name: string
  lat: number
  lon: number
  /** "Restaurant", "Train station" ... */
  kind: string
  /** "Koto, Tokyo" */
  area: string
}

export interface FoundDetails {
  nameEn?: string
  nameJa?: string
  address?: string
  hours?: string
  phone?: string
  website?: string
  cuisine?: string
  wiki?: { title: string; text: string; image?: string; url: string }
}

// Japan and its islands: results outside it are not useful for this trip
const JAPAN_BBOX = '122.9,24.0,146.0,45.6'

/** "fast_food" → "Fast food" */
const label = (v?: string) => (v ? (v.charAt(0).toUpperCase() + v.slice(1)).replace(/_/g, ' ') : 'Place')

const KIND: Record<string, string> = {
  'railway:station': 'Train station',
  'railway:halt': 'Train station',
  'public_transport:station': 'Station',
  'tourism:attraction': 'Sight',
  'amenity:place_of_worship': 'Temple or shrine',
  'leisure:park': 'Park',
  'shop:mall': 'Shopping mall',
  'shop:department_store': 'Department store',
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] }
  properties: {
    osm_type: 'N' | 'W' | 'R'
    osm_id: number
    osm_key?: string
    osm_value?: string
    name?: string
    street?: string
    district?: string
    locality?: string
    city?: string
    county?: string
    state?: string
  }
}

/** Places whose name matches, nearest to "near" first when it is given */
export async function searchPlaces(q: string, near: [number, number] | null, signal?: AbortSignal): Promise<Found[]> {
  const bias = near ? `&lon=${near[0]}&lat=${near[1]}` : ''
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lang=en&bbox=${JAPAN_BBOX}${bias}`
  const r = await fetch(url, { signal })
  if (!r.ok) throw new Error(`Search failed (${r.status})`)
  const data = (await r.json()) as { features: PhotonFeature[] }
  const seen = new Set<string>()
  const out: Found[] = []
  for (const f of data.features) {
    const p = f.properties
    // Signboards, traffic lights, crossings and bus stops carry place names too, but are not places to go to
    if (!p.name || p.osm_key === 'information' || p.osm_key === 'highway') continue
    // A station has many parts (stop positions, platforms): keep only the station itself
    if (['stop', 'stop_position', 'platform', 'subway_entrance'].includes(p.osm_value ?? '')) continue
    const key = `${p.osm_type}${p.osm_id}`
    if (seen.has(key)) continue
    seen.add(key)
    const area = [p.district ?? p.locality, p.city ?? p.county, p.state].filter((x, i, a) => x && a.indexOf(x) === i).join(', ')
    out.push({
      key,
      name: p.name,
      lon: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      kind: KIND[`${p.osm_key}:${p.osm_value}`] ?? label(p.osm_value),
      area,
    })
  }
  return out
}

interface NominatimPlace {
  display_name?: string
  extratags?: Record<string, string>
  namedetails?: Record<string, string>
}

/** Opening hours, phone, website and a Wikipedia summary, as far as OpenStreetMap has them */
export async function detailsOf(f: Found, signal?: AbortSignal): Promise<FoundDetails> {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/lookup?osm_ids=${f.key}&format=jsonv2&extratags=1&namedetails=1&accept-language=en`,
    { signal },
  )
  const list = r.ok ? ((await r.json()) as NominatimPlace[]) : []
  const p = list[0] ?? {}
  const t = p.extratags ?? {}
  const n = p.namedetails ?? {}
  const out: FoundDetails = {
    nameEn: n['name:en'],
    nameJa: n['name:ja'] ?? (/[぀-ヿ一-龯]/.test(n.name ?? '') ? n.name : undefined),
    address: p.display_name?.split(', ').slice(0, 5).join(', '),
    hours: t.opening_hours,
    phone: t.phone ?? t['contact:phone'],
    website: t.website ?? t['contact:website'] ?? t.url,
    cuisine: t.cuisine?.split(';').map(label).join(', '),
  }
  try {
    out.wiki = await wikiOf(t.wikipedia, t.wikidata, signal)
  } catch {
    // No Wikipedia text: the other details are still useful
  }
  return out
}

/** English Wikipedia first, then Japanese */
async function wikiOf(wikipedia?: string, wikidata?: string, signal?: AbortSignal): Promise<FoundDetails['wiki']> {
  let page: { lang: string; title: string } | null = null
  if (wikidata) {
    const r = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidata}&props=sitelinks&sitefilter=enwiki|jawiki&format=json&origin=*`,
      { signal },
    )
    const d = (await r.json()) as { entities?: Record<string, { sitelinks?: Record<string, { title: string }> }> }
    const links = d.entities?.[wikidata]?.sitelinks ?? {}
    if (links.enwiki) page = { lang: 'en', title: links.enwiki.title }
    else if (links.jawiki) page = { lang: 'ja', title: links.jawiki.title }
  }
  if (!page && wikipedia) {
    const m = /^([a-z]{2}):(.+)$/.exec(wikipedia)
    if (m) page = { lang: m[1], title: m[2] }
  }
  if (!page) return undefined
  const r = await fetch(`https://${page.lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`, { signal })
  if (!r.ok) return undefined
  const s = (await r.json()) as { title: string; extract?: string; thumbnail?: { source: string }; content_urls?: { desktop?: { page?: string } } }
  if (!s.extract) return undefined
  return { title: s.title, text: s.extract, image: s.thumbnail?.source, url: s.content_urls?.desktop?.page ?? '' }
}

/** Directions and map links for a found place */
export function foundLinks(f: Found) {
  const name = encodeURIComponent(f.name)
  return {
    apple: `https://maps.apple.com/?daddr=${f.lat},${f.lon}&q=${name}`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lon}`,
    osm: `https://www.openstreetmap.org/${{ N: 'node', W: 'way', R: 'relation' }[f.key[0] as 'N' | 'W' | 'R']}/${f.key.slice(1)}`,
  }
}
