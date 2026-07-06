// One-off processing script for the Carpathian Ridge briefing.
//
// Reads the raw AR25 rally GPX exports (private, kept outside public/) and produces:
//   1. Cleaned, rider-facing GPX files (public/assets/gpx/trax-carpathian-ridge-day{1,2,3}.gpx)
//      containing only the main numbered segments (in ride order) + the "Easy" alternate
//      for every forked section + the day's waypoints. Hard/EXTREME variants and the
//      lunchpoint bailout/transfer tracks are excluded.
//   2. app/briefing/carpathian-ridge/briefing-data.ts — baked [lat, lon] route arrays and
//      waypoint metadata for the Leaflet map, decimated for payload size while always
//      keeping segment endpoints so forked sections connect without gaps or overlaps.
//
// Run with: node scripts/clean-carpathian-ridge-gpx.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SOURCE_DIR = path.join(ROOT, 'scripts', 'gpx-source', 'carpathian-ridge');
const GPX_OUT_DIR = path.join(ROOT, 'public', 'assets', 'gpx');
const DATA_OUT_FILE = path.join(ROOT, 'app', 'briefing', 'carpathian-ridge', 'briefing-data.ts');

const DAYS = [
  { day: 1, source: 'day1.gpx', output: 'trax-carpathian-ridge-day1.gpx' },
  { day: 2, source: 'day2.gpx', output: 'trax-carpathian-ridge-day2.gpx' },
  { day: 3, source: 'day3.gpx', output: 'trax-carpathian-ridge-day3.gpx' },
];

// Points closer together than this stride are thinned for the in-browser map data only.
// The downloadable GPX always keeps full-resolution trkpts. Segment endpoints are never
// dropped, so forked "Easy" alternates still connect exactly to their neighbors.
const MAP_DECIMATION_STRIDE = 3;

function extractBlocks(xml, tagName) {
  const regex = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, 'g');
  const blocks = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    blocks.push({ text: match[0], index: match.index });
  }
  return blocks;
}

function getName(block) {
  const m = block.match(/<name>([^<]*)<\/name>/);
  return m ? m[1].trim() : '';
}

function getLatLon(openTag) {
  const m = openTag.match(/lat="([^"]+)"\s+lon="([^"]+)"/);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2])];
}

// Bailout/transfer tracks are named like "1 Lunchpoint - Hotel AR25" — a bare day number
// (no section decimal) followed by "Lunchpoint". Main numbered segments are always
// "<day>.<section> ..." (e.g. "1.13 Back to Hotel AR25") and must be kept.
function isBailoutTrack(name) {
  return /^\d+\s+Lunchpoint/i.test(name);
}

function isHardOrExtreme(name) {
  return /Hard|EXTREME/.test(name);
}

function getSortKey(name) {
  const m = name.match(/^(\d+)\.(\d+)/);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : null;
}

function classifyWaypoint(name) {
  const n = name.toLowerCase();
  if (n.includes('fuel')) return 'fuel';
  if (n.includes('lunch')) return 'lunch';
  if (n.includes('start')) return 'start';
  if (n.includes('finish')) return 'finish';
  return 'poi';
}

function cleanLabel(name) {
  let label = name
    .replace(/\s*AR\s?25\s*$/i, '')
    .replace(/^Day\s?\d+\s*/i, '')
    .trim();
  label = label.replace(/(\D)(\d+)$/, '$1 $2');
  label = label.replace(/Lunchpoint/i, 'Lunch Point');
  return label;
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

function processDay({ day, source, output }) {
  const srcPath = path.join(SOURCE_DIR, source);
  const xml = readFileSync(srcPath, 'utf-8');

  const wptBlocks = extractBlocks(xml, 'wpt');
  const trkBlocks = extractBlocks(xml, 'trk');

  const keptTracks = [];
  for (const block of trkBlocks) {
    const name = getName(block.text);
    if (isBailoutTrack(name) || isHardOrExtreme(name)) continue;
    const sortKey = getSortKey(name);
    if (!sortKey) {
      throw new Error(`Day ${day}: kept track "${name}" has no parseable "<day>.<section>" number`);
    }
    keptTracks.push({ name, text: block.text, sortKey });
  }
  keptTracks.sort((a, b) => (a.sortKey[0] - b.sortKey[0]) || (a.sortKey[1] - b.sortKey[1]));

  // ── Cleaned, full-resolution GPX for download ──────────────────────────────
  const firstElementIndex = Math.min(
    ...[...wptBlocks, ...trkBlocks].map((b) => b.index).filter((i) => i >= 0)
  );
  const header = xml.slice(0, firstElementIndex).replace(/\s*$/, '\n');
  const wptXml = wptBlocks.map((b) => '  ' + b.text.trim()).join('\n\n');
  const trkXml = keptTracks.map((t) => '  ' + t.text.trim()).join('\n\n');
  const cleanedGpx = `${header}\n${wptXml}\n\n${trkXml}\n</gpx>\n`;

  mkdirSync(GPX_OUT_DIR, { recursive: true });
  writeFileSync(path.join(GPX_OUT_DIR, output), cleanedGpx, 'utf-8');

  // ── Baked route + waypoints for the Leaflet map ─────────────────────────────
  let routePoints = [];
  for (const track of keptTracks) {
    const ptOpenTags = track.text.match(/<trkpt\b[^>]*>/g) || [];
    const pts = ptOpenTags.map(getLatLon).filter(Boolean);
    routePoints = routePoints.concat(decimate(pts, MAP_DECIMATION_STRIDE));
  }

  const waypoints = wptBlocks.map((b) => {
    const name = getName(b.text);
    const openTag = b.text.match(/<wpt\b[^>]*>/)[0];
    const position = getLatLon(openTag);
    return { name, label: cleanLabel(name), type: classifyWaypoint(name), position };
  });

  return {
    day,
    trackCount: keptTracks.length,
    trackNames: keptTracks.map((t) => t.name),
    pointCount: routePoints.length,
    routePoints,
    waypoints,
  };
}

function formatLatLngArray(points) {
  const rows = [];
  for (let i = 0; i < points.length; i += 8) {
    rows.push(
      '  ' + points.slice(i, i + 8).map(([lat, lon]) => `[${lat},${lon}]`).join(',') + ','
    );
  }
  return rows.join('\n');
}

function formatWaypoints(waypoints) {
  return waypoints
    .map(
      (w) =>
        `  { position: [${w.position[0]}, ${w.position[1]}], label: ${JSON.stringify(w.label)}, type: ${JSON.stringify(w.type)} },`
    )
    .join('\n');
}

const results = DAYS.map(processDay);

const dataModule = `// Generated by scripts/clean-carpathian-ridge-gpx.mjs — do not hand-edit.
// Regenerate by re-running the script against the source GPX files.

export type LatLng = [number, number];

export type WaypointType = 'fuel' | 'lunch' | 'start' | 'finish' | 'poi';

export interface RouteWaypoint {
  position: LatLng;
  label: string;
  type: WaypointType;
}

${results
  .map(
    (r) => `export const ROUTE_DAY${r.day}: LatLng[] = [\n${formatLatLngArray(r.routePoints)}\n];`
  )
  .join('\n\n')}

${results
  .map(
    (r) => `export const WAYPOINTS_DAY${r.day}: RouteWaypoint[] = [\n${formatWaypoints(r.waypoints)}\n];`
  )
  .join('\n\n')}

export const ROUTES: Record<number, LatLng[]> = { 1: ROUTE_DAY1, 2: ROUTE_DAY2, 3: ROUTE_DAY3 };
export const WAYPOINTS: Record<number, RouteWaypoint[]> = { 1: WAYPOINTS_DAY1, 2: WAYPOINTS_DAY2, 3: WAYPOINTS_DAY3 };
`;

mkdirSync(path.dirname(DATA_OUT_FILE), { recursive: true });
writeFileSync(DATA_OUT_FILE, dataModule, 'utf-8');

for (const r of results) {
  console.log(`Day ${r.day}: kept ${r.trackCount} track segments, ${r.pointCount} map points, ${r.waypoints.length} waypoints`);
  console.log(`  segments: ${r.trackNames.join(' | ')}`);
}
console.log(`\nWrote cleaned GPX files to ${path.relative(ROOT, GPX_OUT_DIR)}`);
console.log(`Wrote map data to ${path.relative(ROOT, DATA_OUT_FILE)}`);
