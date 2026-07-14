// Processing script for the Out There briefing.
//
// Reads the source GPX exports in public/assets/gpx (Out-There-{1,2,3}.gpx) and produces:
//   1. Cleaned, rider-facing GPX files (public/assets/gpx/trax-out-there-day{1,2,3}.gpx):
//      junk exporter waypoints stripped, named TRAX tracks, curated waypoints (camps,
//      resupply, fuel) injected. Day 3 is reversed into riding direction (camp → Tălmaciu) —
//      the source TET file is recorded the other way.
//   2. app/briefing/out-there/briefing-data.ts — decimated [lat, lon] route arrays, curated
//      waypoints and the Day 3 elevation profile (riding direction) for the Leaflet map.
//
// Note: the Day 2 track starts ~6 km up the valley road from the Camp 1 / Cabana Cheia area.
// That connector is deliberate — riders follow the single valley road until the track starts.
//
// Run with: node scripts/build-out-there-briefing-data.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const GPX_DIR = path.join(ROOT, 'public', 'assets', 'gpx');
const DATA_OUT_FILE = path.join(ROOT, 'app', 'briefing', 'out-there', 'briefing-data.ts');

const ELEVATION_SAMPLES = 200;

// Camp 2 is Panorama Vidra (Google Maps place), the belvedere above Lacul Vidra. The Day 2
// track passes ~35 m from it and then continues to the Transalpina ridge — that tail is
// ridden on Day 3 morning, so the camp marker sits mid-track, not at the end.
const PANORAMA_VIDRA = { lat: 45.3899539, lon: 23.6823074 };

// Ciungetu village center per OSM/Nominatim; the route passes ~120 m from it.
const CIUNGETU = { lat: 45.3867655, lon: 23.9519173 };

// Fuel stations along the route (OSM/Overpass-verified). Filled per day below.
// type 'fuel' renders as a labeled marker on the map and a <wpt> in the rider GPX.
const FUEL_DAY1 = [];
const FUEL_DAY3 = [];

// ── GPX helpers ────────────────────────────────────────────────────────────────

function parseTrackpoints(xml) {
  const points = [];
  const regex = /<trkpt\b[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"[^>]*>([\s\S]*?)<\/trkpt>|<trkpt\b[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"[^>]*\/>/g;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    const lat = parseFloat(m[1] ?? m[4]);
    const lon = parseFloat(m[2] ?? m[5]);
    let ele = null;
    if (m[3]) {
      const em = m[3].match(/<ele>([^<]+)<\/ele>/);
      if (em) ele = parseFloat(em[1]);
    }
    points.push({ lat, lon, ele });
  }
  return points;
}

function haversine(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function totalDistanceKm(points) {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversine(points[i - 1], points[i]);
  return d / 1000;
}

function decimate(points, stride) {
  if (points.length <= 2) return points;
  const kept = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    if (i % stride === 0) kept.push(points[i]);
  }
  kept.push(points[points.length - 1]);
  return kept;
}

// Snap a curated coordinate onto the nearest route point so markers sit on the line.
function snapToRoute(points, target, label) {
  let best = null;
  let bestDist = Infinity;
  for (const p of points) {
    const d = haversine(p, target);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  console.log(`  snap "${label}": ${Math.round(bestDist)} m off route → [${best.lat.toFixed(5)}, ${best.lon.toFixed(5)}]`);
  if (bestDist > 2000) {
    console.warn(`  WARNING: "${label}" snapped more than 2 km — check the source coordinate.`);
  }
  return [best.lat, best.lon];
}

function smoothElevations(points, windowSize = 5) {
  const eles = points.map((p) => p.ele);
  const half = Math.floor(windowSize / 2);
  return eles.map((_, i) => {
    const slice = eles.slice(Math.max(0, i - half), Math.min(eles.length, i + half + 1));
    return slice.reduce((s, e) => s + e, 0) / slice.length;
  });
}

function elevationStats(points) {
  const smooth = smoothElevations(points);
  let gain = 0;
  let loss = 0;
  let last = smooth[0];
  for (const e of smooth) {
    const delta = e - last;
    if (Math.abs(delta) >= 2) {
      if (delta > 0) gain += delta;
      else loss -= delta;
      last = e;
    }
  }
  return {
    gain: Math.round(gain),
    loss: Math.round(loss),
    min: Math.round(Math.min(...smooth)),
    max: Math.round(Math.max(...smooth)),
  };
}

function sampleElevationProfile(points, samples) {
  const smooth = smoothElevations(points);
  const out = [];
  for (let i = 0; i < samples; i++) {
    const idx = Math.round((i / (samples - 1)) * (smooth.length - 1));
    out.push(Math.round(smooth[idx]));
  }
  return out;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Write a clean rider-facing GPX: TRAX-named track, curated waypoints only.
function writeRiderGpx(filename, trackName, points, waypoints) {
  const wptXml = waypoints
    .map((w) => `  <wpt lat="${w.position[0]}" lon="${w.position[1]}">\n    <name>${escapeXml(w.label)}</name>\n  </wpt>`)
    .join('\n');
  const trkptXml = points
    .map((p) =>
      p.ele != null
        ? `      <trkpt lat="${p.lat}" lon="${p.lon}"><ele>${p.ele}</ele></trkpt>`
        : `      <trkpt lat="${p.lat}" lon="${p.lon}"/>`
    )
    .join('\n');
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TRAX — ridetrax.eu" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(trackName)}</name>
  </metadata>
${wptXml}
  <trk>
    <name>${escapeXml(trackName)}</name>
    <trkseg>
${trkptXml}
    </trkseg>
  </trk>
</gpx>
`;
  writeFileSync(path.join(GPX_DIR, filename), gpx, 'utf-8');
  console.log(`  wrote ${filename} (${points.length} trkpts, ${waypoints.length} wpts)`);
}

// ── Day 1 · Bucharest → Cabana Cheia (road transfer, no elevation data) ────────
console.log('Day 1: Out-There-1.gpx');
const day1Points = parseTrackpoints(readFileSync(path.join(GPX_DIR, 'Out-There-1.gpx'), 'utf-8'));
const day1Route = decimate(day1Points, 6);
const day1Waypoints = [
  { position: [day1Points[0].lat, day1Points[0].lon], label: 'Bucharest — Start', type: 'start' },
  ...FUEL_DAY1,
  { position: [day1Points[day1Points.length - 1].lat, day1Points[day1Points.length - 1].lon], label: 'Cabana Cheia — Dinner & Camp 1', type: 'camp' },
];
console.log(`  ${day1Points.length} pts → ${day1Route.length} map pts, ${totalDistanceKm(day1Points).toFixed(1)} km`);
writeRiderGpx('trax-out-there-day1.gpx', 'TRAX Out There · Day 1 · The Ride In', day1Points, day1Waypoints);

// ── Day 2 · Cheia → Ciungetu → Panorama Vidra (no elevation data) ──────────────
console.log('Day 2: Out-There-2.gpx');
const day2Points = parseTrackpoints(readFileSync(path.join(GPX_DIR, 'Out-There-2.gpx'), 'utf-8'));
const day2Route = decimate(day2Points, 6);
const day2Waypoints = [
  { position: [day2Points[0].lat, day2Points[0].lon], label: 'Track Start — 6 km up the valley road from camp', type: 'start' },
  { position: snapToRoute(day2Points, CIUNGETU, 'Ciungetu'), label: 'Ciungetu — Lunch & Supplies', type: 'lunch' },
  { position: snapToRoute(day2Points, PANORAMA_VIDRA, 'Panorama Vidra'), label: 'Panorama Vidra — Camp 2', type: 'camp' },
];
console.log(`  ${day2Points.length} pts → ${day2Route.length} map pts, ${totalDistanceKm(day2Points).toFixed(1)} km`);
writeRiderGpx('trax-out-there-day2.gpx', 'TRAX Out There · Day 2 · Up There', day2Points, day2Waypoints);

// ── Day 3 · Camp → Strategica finish → Transalpina → Tălmaciu (reversed TET) ───
console.log('Day 3: Out-There-3.gpx (reversing into riding direction)');
const day3Recorded = parseTrackpoints(readFileSync(path.join(GPX_DIR, 'Out-There-3.gpx'), 'utf-8'));
const day3Points = [...day3Recorded].reverse();
const day3Route = decimate(day3Points, 1);
const day3Stats = elevationStats(day3Points);
const day3Profile = sampleElevationProfile(day3Points, ELEVATION_SAMPLES);
const day3Waypoints = [
  { position: [day3Points[0].lat, day3Points[0].lon], label: 'Camp 2 — Panorama Vidra', type: 'camp' },
  ...FUEL_DAY3,
  { position: [day3Points[day3Points.length - 1].lat, day3Points[day3Points.length - 1].lon], label: 'Tălmaciu — Trail Ends', type: 'finish' },
];
console.log(`  ${day3Points.length} pts → ${day3Route.length} map pts, ${totalDistanceKm(day3Points).toFixed(1)} km`);
console.log(`  riding direction: -${day3Stats.loss} m / +${day3Stats.gain} m, ${day3Stats.min}–${day3Stats.max} m`);
writeRiderGpx('trax-out-there-day3.gpx', 'TRAX Out There · Day 3 · The Way Back', day3Points, day3Waypoints);

// ── Emit module ────────────────────────────────────────────────────────────────
function formatLatLngArray(points) {
  const rows = [];
  for (let i = 0; i < points.length; i += 8) {
    rows.push('  ' + points.slice(i, i + 8).map((p) => `[${p.lat},${p.lon}]`).join(',') + ',');
  }
  return rows.join('\n');
}

function formatWaypoints(waypoints) {
  return waypoints
    .map((w) => `  { position: [${w.position[0]}, ${w.position[1]}], label: ${JSON.stringify(w.label)}, type: ${JSON.stringify(w.type)} },`)
    .join('\n');
}

const dataModule = `// Generated by scripts/build-out-there-briefing-data.mjs — do not hand-edit.
// Regenerate by re-running the script against public/assets/gpx/Out-There-{1,2,3}.gpx.
// Day 3 route and elevation are baked in riding direction (camp → Tălmaciu), which is
// the reverse of the recorded source GPX.

export type LatLng = [number, number];

export type WaypointType = 'fuel' | 'lunch' | 'camp' | 'start' | 'finish' | 'poi';

export interface RouteWaypoint {
  position: LatLng;
  label: string;
  type: WaypointType;
}

export const ROUTE_DAY1: LatLng[] = [
${formatLatLngArray(day1Route)}
];

export const ROUTE_DAY2: LatLng[] = [
${formatLatLngArray(day2Route)}
];

export const ROUTE_DAY3: LatLng[] = [
${formatLatLngArray(day3Route)}
];

export const WAYPOINTS_DAY1: RouteWaypoint[] = [
${formatWaypoints(day1Waypoints)}
];

export const WAYPOINTS_DAY2: RouteWaypoint[] = [
${formatWaypoints(day2Waypoints)}
];

export const WAYPOINTS_DAY3: RouteWaypoint[] = [
${formatWaypoints(day3Waypoints)}
];

// Day 3 trail elevation, riding direction, ${ELEVATION_SAMPLES} samples.
export const DAY3_ELEVATION: number[] = [
  ${day3Profile.join(', ')},
];

export const ROUTES: Record<number, LatLng[]> = { 1: ROUTE_DAY1, 2: ROUTE_DAY2, 3: ROUTE_DAY3 };
export const WAYPOINTS: Record<number, RouteWaypoint[]> = { 1: WAYPOINTS_DAY1, 2: WAYPOINTS_DAY2, 3: WAYPOINTS_DAY3 };
`;

mkdirSync(path.dirname(DATA_OUT_FILE), { recursive: true });
writeFileSync(DATA_OUT_FILE, dataModule, 'utf-8');
console.log(`\nWrote map data to ${path.relative(ROOT, DATA_OUT_FILE)}`);
