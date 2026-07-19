// Rebuilds app/briefing/out-there/briefing-data.ts from the EDITED rider GPX
// (public/assets/gpx/trax-out-there-day{1,2,3}.gpx), which now carry elevation on
// all three days and connect at their endpoints (Day1 end = Day2 start = Cheia,
// Day2 end = Day3 start = Panorama Vidra).
//
// This does NOT rewrite the GPX files. It only re-bakes the map/elevation data.
// Day 3 is reversed into riding direction (Camp 2 -> Talmaciu), which is how the
// rider GPX stores it in reverse.
//
// Run with: node scripts/rebuild-out-there-map-data.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GPX_DIR = path.join(ROOT, 'public', 'assets', 'gpx');
const DATA_OUT_FILE = path.join(ROOT, 'app', 'briefing', 'out-there', 'briefing-data.ts');

const ELEVATION_SAMPLES = 200;

// Fixed real-world places, snapped onto the route so markers sit on the line.
const PANORAMA_VIDRA = { lat: 45.3899539, lon: 23.6823074 };
const CIUNGETU = { lat: 45.3867655, lon: 23.9519173 };

// One distinct, legible colour per day for the overlaid map.
const DAY_COLORS = { 1: '#C04A30', 2: '#E8E2D4', 3: '#8FB0C4' };

// ── GPX + geo helpers ───────────────────────────────────────────────────────
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

function snapToRoute(points, target, label) {
  let best = null;
  let bestDist = Infinity;
  for (const p of points) {
    const d = haversine(p, target);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  console.log(`  snap "${label}": ${Math.round(bestDist)} m off route`);
  return [best.lat, best.lon];
}

function smoothElevations(points, windowSize = 5) {
  const eles = points.map((p) => (p.ele == null ? 0 : p.ele));
  const half = Math.floor(windowSize / 2);
  return eles.map((_, i) => {
    const slice = eles.slice(Math.max(0, i - half), Math.min(eles.length, i + half + 1));
    return slice.reduce((s, e) => s + e, 0) / slice.length;
  });
}

function elevationStats(points) {
  const smooth = smoothElevations(points);
  let gain = 0, loss = 0, last = smooth[0];
  for (const e of smooth) {
    const delta = e - last;
    if (Math.abs(delta) >= 2) {
      if (delta > 0) gain += delta; else loss -= delta;
      last = e;
    }
  }
  return { gain: Math.round(gain), loss: Math.round(loss), min: Math.round(Math.min(...smooth)), max: Math.round(Math.max(...smooth)) };
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

// ── Read + process each day ──────────────────────────────────────────────────
function load(name) {
  return parseTrackpoints(readFileSync(path.join(GPX_DIR, name), 'utf-8'));
}

console.log('Day 1: trax-out-there-day1.gpx');
const day1Points = load('trax-out-there-day1.gpx');
const day1Route = decimate(day1Points, 6);
const day1Waypoints = [
  { position: [day1Points[0].lat, day1Points[0].lon], label: 'Bucharest', type: 'start' },
  { position: [day1Points[day1Points.length - 1].lat, day1Points[day1Points.length - 1].lon], label: 'Cabana Cheia', type: 'camp' },
];

console.log('Day 2: trax-out-there-day2.gpx');
const day2Points = load('trax-out-there-day2.gpx');
const day2Route = decimate(day2Points, 6);
const day2Waypoints = [
  { position: [day2Points[0].lat, day2Points[0].lon], label: 'Track Start', type: 'start' },
  { position: snapToRoute(day2Points, CIUNGETU, 'Ciungetu'), label: 'Ciungetu', type: 'lunch' },
  { position: snapToRoute(day2Points, PANORAMA_VIDRA, 'Panorama Vidra'), label: 'Panorama Vidra', type: 'camp' },
];

console.log('Day 3: trax-out-there-day3.gpx (reversing into riding direction)');
const day3Points = [...load('trax-out-there-day3.gpx')].reverse();
const day3Route = decimate(day3Points, 2);
const day3Waypoints = [
  { position: [day3Points[0].lat, day3Points[0].lon], label: 'Camp 2', type: 'camp' },
  { position: [day3Points[day3Points.length - 1].lat, day3Points[day3Points.length - 1].lon], label: 'Tălmaciu', type: 'finish' },
];

const days = [
  { n: 1, points: day1Points, route: day1Route, waypoints: day1Waypoints },
  { n: 2, points: day2Points, route: day2Route, waypoints: day2Waypoints },
  { n: 3, points: day3Points, route: day3Route, waypoints: day3Waypoints },
];

const distanceKm = {};
const elevStats = {};
const elevations = {};
for (const d of days) {
  distanceKm[d.n] = Math.round(totalDistanceKm(d.points));
  elevStats[d.n] = elevationStats(d.points);
  elevations[d.n] = sampleElevationProfile(d.points, ELEVATION_SAMPLES);
  console.log(`  Day ${d.n}: ${d.points.length} pts -> ${d.route.length} map pts, ${distanceKm[d.n]} km, +${elevStats[d.n].gain}/-${elevStats[d.n].loss} m, ${elevStats[d.n].min}-${elevStats[d.n].max} m`);
}

// ── Emit module ──────────────────────────────────────────────────────────────
function fmtRoute(points) {
  const rows = [];
  for (let i = 0; i < points.length; i += 8) {
    rows.push('  ' + points.slice(i, i + 8).map((p) => `[${p.lat},${p.lon}]`).join(',') + ',');
  }
  return rows.join('\n');
}
function fmtWaypoints(wpts) {
  return wpts.map((w) => `  { position: [${w.position[0]}, ${w.position[1]}], label: ${JSON.stringify(w.label)}, type: ${JSON.stringify(w.type)} },`).join('\n');
}
function fmtStats(s) {
  return `{ gain: ${s.gain}, loss: ${s.loss}, min: ${s.min}, max: ${s.max} }`;
}

const dataModule = `// Generated by scripts/rebuild-out-there-map-data.mjs — do not hand-edit.
// Baked from the edited rider GPX in public/assets/gpx/trax-out-there-day{1,2,3}.gpx.
// Day 3 route and elevation are in riding direction (Camp 2 -> Tălmaciu), the reverse
// of how the rider GPX stores it. Regenerate: node scripts/rebuild-out-there-map-data.mjs

export type LatLng = [number, number];

export type WaypointType = 'fuel' | 'lunch' | 'camp' | 'start' | 'finish' | 'poi';

export interface RouteWaypoint {
  position: LatLng;
  label: string;
  type: WaypointType;
}

export interface ElevStats {
  gain: number;
  loss: number;
  min: number;
  max: number;
}

export const ROUTE_DAY1: LatLng[] = [
${fmtRoute(day1Route)}
];

export const ROUTE_DAY2: LatLng[] = [
${fmtRoute(day2Route)}
];

export const ROUTE_DAY3: LatLng[] = [
${fmtRoute(day3Route)}
];

export const WAYPOINTS_DAY1: RouteWaypoint[] = [
${fmtWaypoints(day1Waypoints)}
];

export const WAYPOINTS_DAY2: RouteWaypoint[] = [
${fmtWaypoints(day2Waypoints)}
];

export const WAYPOINTS_DAY3: RouteWaypoint[] = [
${fmtWaypoints(day3Waypoints)}
];

export const DAY1_ELEVATION: number[] = [${elevations[1].join(', ')}];
export const DAY2_ELEVATION: number[] = [${elevations[2].join(', ')}];
export const DAY3_ELEVATION: number[] = [${elevations[3].join(', ')}];

export const ROUTES: Record<number, LatLng[]> = { 1: ROUTE_DAY1, 2: ROUTE_DAY2, 3: ROUTE_DAY3 };
export const WAYPOINTS: Record<number, RouteWaypoint[]> = { 1: WAYPOINTS_DAY1, 2: WAYPOINTS_DAY2, 3: WAYPOINTS_DAY3 };
export const ELEVATIONS: Record<number, number[]> = { 1: DAY1_ELEVATION, 2: DAY2_ELEVATION, 3: DAY3_ELEVATION };
export const DAY_COLORS: Record<number, string> = { 1: '${DAY_COLORS[1]}', 2: '${DAY_COLORS[2]}', 3: '${DAY_COLORS[3]}' };
export const DISTANCE_KM: Record<number, number> = { 1: ${distanceKm[1]}, 2: ${distanceKm[2]}, 3: ${distanceKm[3]} };
export const ELEV_STATS: Record<number, ElevStats> = { 1: ${fmtStats(elevStats[1])}, 2: ${fmtStats(elevStats[2])}, 3: ${fmtStats(elevStats[3])} };
`;

mkdirSync(path.dirname(DATA_OUT_FILE), { recursive: true });
writeFileSync(DATA_OUT_FILE, dataModule, 'utf-8');
console.log(`\nWrote ${path.relative(ROOT, DATA_OUT_FILE)}`);
