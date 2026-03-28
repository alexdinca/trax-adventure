'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { DAY_STATS, DAY_COLORS, ELEVATION_DATA } from './briefing-data';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckItem {
  id: string;
  name: string;
  note?: string;
  essential?: boolean;
}

interface CheckGroup {
  title: string;
  items: CheckItem[];
  disabled?: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TARGET_DATE = new Date('2026-05-01T06:00:00+03:00');

const MINDSET_BARS = [
  { label: 'Speed',       width: '18%',  left: 'Not the goal',    right: 'Leave it at home' },
  { label: 'Rhythm',      width: '88%',  left: 'Inconsistent',    right: 'This is everything' },
  { label: 'Presence',    width: '95%',  left: 'Distracted',      right: "What we're after" },
  { label: 'Ego',         width: '5%',   left: 'Checked in',      right: "Doesn't belong here" },
  { label: 'Flexibility', width: '82%',  left: 'Rigid',           right: 'Plans will change' },
];

const CHECK_GROUPS: CheckGroup[] = [
  {
    title: 'Riding Gear',
    items: [
      { id: 'helmet',     name: 'Helmet — off-road or ADV rated',                note: 'Full face preferred.',                                 essential: true },
      { id: 'goggles',     name: 'Goggles and visor cleaner',                                                 essential: true },
      { id: 'jacket',     name: 'Riding jacket — armoured, vented',              note: 'Mornings cold. Afternoons warm. Layer accordingly.',        essential: true },
      { id: 'trousers',   name: 'Riding trousers — armoured',                    note: 'Knee braces preferred.',                                      essential: true },
      { id: 'boots',      name: 'Enduro/MX Boots',                 essential: true },
      { id: 'gloves',     name: 'Gloves — two pairs: off-road and waterproof',        note: 'Off-road for the trail, waterproof for when the sky decides otherwise.',  essential: true },
      { id: 'rain_layer', name: 'Rain layer — packable',                         note: 'Dobrogea weather changes without announcement.', essential: true },
      { id: 'socks',     name: 'MX socks',                                       note: 'Significantly increases riding comfort.'                            },
    ],
  },
  {
    title: 'Bike Essentials',
    items: [
      { id: 'full_tank',     name: 'Full tank at departure',                    note: 'Know your range. Some sections are far from fuel.',                        essential: true },
      { id: 'tyre_pressure', name: 'Tyre pressure — checked and correct',       note: "Off-road terrain may require lower pressures. Know your bike's spec.",     essential: true },
      { id: 'tool_kit',      name: 'Basic tool kit specific to your bike — tyre plugs, levers, multi-tool', essential: true },
      { id: 'compressor',    name: 'Mini compressor or CO₂ cartridges' },
      { id: 'phone_mount',   name: 'Phone mount and offline maps loaded',        note: 'Signal will drop. Plan accordingly.' },
    ],
  },
  {
    title: 'Personal & Camp',
    items: [
      { id: 'cash',           name: 'Cash — Romanian lei',                          note: 'Not all stops accept card. Fuel, food, emergencies.', essential: true },
      { id: 'documents',      name: 'ID / insurance / vehicle documents',                                                                          essential: true },
      { id: 'toiletries',      name: 'Personal care toiletries',                                                                          essential: true },
      { id: 'sleeping_layer', name: 'Warm layer for evenings — fleece or light down jacket', note: 'May nights in Dobrogea cool quickly after sundown.' },
      { id: 'sleepwear',      name: 'Sleepwear' },
      { id: 'evening_clothes', name: 'Evening clothes',  note: 'Something casual to sit down for dinner.',  essential: true },
      
      { id: 'water',          name: 'Water — minimum 1.5L on bike at all times' },
      
      { id: 'power_bank',     name: 'Phone charging cable' },
    ],
  },
  {
    title: 'Leave Behind',
    disabled: true,
    items: [
      { id: 'leave_luggage', name: 'Unnecessary luggage',              note: "If you need a second bag, reconsider the first bag." },
      { id: 'leave_agenda',  name: 'Agenda',                           note: "It won't survive the first day." },
      { id: 'leave_signal',  name: 'The need for signal at all times', note: 'Some of the best moments happen where coverage ends.' },
    ],
  },
];

const TOTAL_CHECKABLE = CHECK_GROUPS.filter((g) => !g.disabled).reduce((sum, g) => sum + g.items.length, 0);

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ── Elevation chart ───────────────────────────────────────────────────────────

function ElevationChart({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const W = 800, H = 80, p = 4;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const pts = data.map((e, i) => {
    const x = p + (i / (data.length - 1)) * (W - 2 * p);
    const y = H - p - ((e - mn) / ((mx - mn) || 1)) * (H - 2 * p);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePts = pts.join(' ');
  const fillPts = [...pts, `${W - p},${H - p}`, `${p},${H - p}`].join(' ');
  return (
    <svg viewBox="0 0 800 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
      <polygon points={fillPts} fill={`${color}33`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BriefingClient() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [activeDay, setActiveDay] = useState(1);
  const [fitKey, setFitKey] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = localStorage.getItem('trax-dc-packing');
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
    } catch { return new Set(); }
  });
  const [barsAnimated, setBarsAnimated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setCountdown(getTimeLeft(TARGET_DATE));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setBarsAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('trax-dc-packing', JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const checkedCount = checked.size;
  const progressPct = Math.round((checkedCount / TOTAL_CHECKABLE) * 100);
  const currentStats = DAY_STATS[activeDay];
  const currentElevColor = activeDay === 0 ? '#E03030' : DAY_COLORS[activeDay];
  const currentElevData = activeDay === 0 ? [] : ELEVATION_DATA[activeDay];

  const dayBtnStyle = (d: number): React.CSSProperties => {
    if (activeDay !== d) return {};
    if (d === 1) return { background: 'rgba(40,100,160,0.12)', borderColor:  '#185fa5', color: '#5a9cd5' };
    if (d === 2) return { background: 'rgba(192,130,30,0.12)', borderColor: '#8a6010', color: '#d4a040' };
    if (d === 3) return { background: 'rgba(180,40,20,0.15)', borderColor: '#b42814', color: '#e05040' };
    return { background: 'rgba(180,40,20,0.15)', borderColor: '#b42814', color: '#e05040' };
  };

  const countBlocks = [
    { val: mounted ? pad(countdown.d) : '--', label: 'Days' },
    { val: mounted ? pad(countdown.h) : '--', label: 'Hours' },
    { val: mounted ? pad(countdown.m) : '--', label: 'Mins' },
    { val: mounted ? pad(countdown.s) : '--', label: 'Secs' },
  ];

  return (
    <div className="min-h-screen animate-fade-in pt-16 pb-24">

      {/* Briefing Header */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-trax-black/95 border-b border-trax-white/10 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-sm">
        <a href="/" className="font-sans font-bold tracking-[0.2em] uppercase text-trax-white text-sm hover:text-trax-red transition-colors duration-150">TRAX</a>
        <MonoLabel>Briefing Pack</MonoLabel>
      </div>

      {/* Access Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-trax-black/95 border-t border-trax-white/10 px-6 md:px-12 py-3 flex items-center justify-between backdrop-blur-sm">
        <MonoLabel>TRAX Briefing Pack · Confirmed Riders Only</MonoLabel>
        <MonoLabel><span className="text-trax-red">#DobrogeaCalling</span> · You&apos;re In.</MonoLabel>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/dobrogea.jpg"
            alt="Dobrogea landscapes"
            fill
            className="object-cover trax-image opacity-50"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-trax-black/30 to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">TRAX Experience · Briefing Pack · 2026</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Dobrogea Calling
          </h1>
          <p className="font-body text-trax-white/70 text-xl md:text-2xl font-light italic mb-8">
            This is not a route guide. It&apos;s what you need to know before the first engine starts.
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-0.5">
            {countBlocks.map((block, i, arr) => (
              <React.Fragment key={block.label}>
                <div className="bg-trax-white/10 border border-trax-white/10 backdrop-blur-sm p-3 md:p-4 text-center min-w-[68px] md:min-w-[80px]">
                  <span className="font-sans text-2xl md:text-3xl font-medium text-trax-white leading-none block">{block.val}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-trax-white/50 mt-1 block">{block.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-trax-red text-xl px-1 leading-none">:</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Duration',  value: '3 Days',  sub: 'May 1st – 3rd, 2026' },
            { label: 'Distance',  value: '~640km',  sub: 'Mixed terrain, off-road focus' },
            { label: 'Landmarks', value: '38',      sub: 'Points of interest' },
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <p className="font-sans text-trax-red text-sm tracking-widest uppercase">{s.label}</p>
              <p className="font-sans text-trax-white text-2xl md:text-3xl font-medium">{s.value}</p>
              <p className="font-sans text-trax-grey text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── 01 — Terrain & Route ─────────────────────────────────────────── */}
        <div className="border-t border-trax-grey/20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <MonoLabel className="mb-6 block">01 — Terrain &amp; Route</MonoLabel>
              <SubHeadline>The Landscape</SubHeadline>
              <Spacer size="sm" />
              <Body>
                Dobrogea is Romania&apos;s oldest geological formation. It doesn&apos;t perform for you. There are no dramatic peaks, no obvious spectacle. What it offers instead is space — wide, horizontal, and deeply quiet.
              </Body>
              <Spacer size="sm" />
              <Body>
                Expect long sightlines, open gravel plateaus, ancient limestone ridges, and stretches where the only sound is wind and engine. That absence of noise is deliberate. <span className="text-trax-red font-medium">It&apos;s where the experience actually begins.</span>
              </Body>
              <Spacer size="sm" />
              <Body>
                This is not a technical riding challenge. The difficulty in Dobrogea is navigational, physical, and rhythmic — <span className="text-trax-red font-medium">sustained effort over distance, not hard sections.</span> Consistent pace, good navigation habits, and fuel awareness matter more than skill level here.
              </Body>
            </div>

            <div>
              <div className="bg-trax-white/5 p-8 mb-8">
                <p className="font-body text-xl text-trax-white/80 italic leading-relaxed">
                  &ldquo;Dobrogea is not dramatic at first glance. And that&apos;s exactly why it works.&rdquo;
                </p>
              </div>

              <h4 className="font-sans text-trax-red text-lg mb-4">What the Terrain Asks of You</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Gravel roads', 'Forgotten tracks', 'Open field crossings'].map((t) => (
                  <span key={t} className="font-mono text-[11px] tracking-[0.1em] uppercase text-trax-red border border-trax-red/40 px-2.5 py-1">{t}</span>
                ))}
                {['Long sightlines', 'Limestone plateaus', 'Sand sections', 'Light technical'].map((t) => (
                  <span key={t} className="font-mono text-[11px] tracking-[0.1em] uppercase text-trax-grey border border-trax-grey/30 px-2.5 py-1">{t}</span>
                ))}
              </div>

              <h4 className="font-sans text-trax-red text-lg mb-3">Route Philosophy</h4>
              <Body>
                Routes are flexible. Weather, terrain condition, and group energy determine how each day unfolds. There is a plan. It is not a contract. <span className="text-trax-red font-medium">The terrain decides — we adapt.</span>
              </Body>
              <Spacer size="sm" />
              <Body>Starting point: <span className="text-trax-white font-medium">Bucharest.</span> Exact location shared 5 days before departure. Arrive with a full tank and a ready bike.</Body>
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* ── Route Map ─────────────────────────────────────────────────────── */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">01b — Route Map</MonoLabel>
          <SubHeadline className="mb-8">Three Days Across Dobrogea</SubHeadline>

          {/* Day toggles */}
          <div className="flex gap-0.5 mb-4 flex-wrap">
            {[
              { d: 1, label: 'Day 1 · 254km' },
              { d: 2, label: 'Day 2 · 186km' },
              { d: 3, label: 'Day 3 · 200km' },
              { d: 0, label: 'All Days' },
            ].map(({ d, label }) => (
              <button
                key={d}
                onClick={() => { setActiveDay(d); setFitKey((k) => k + 1); }}
                className="font-mono text-[12px] tracking-[0.12em] uppercase px-4 py-2.5 bg-trax-white/5 border border-trax-white/15 text-trax-grey cursor-pointer transition-all duration-200 flex-1 text-center hover:text-trax-white hover:border-trax-white/30"
                style={dayBtnStyle(d)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Day stats */}
          <div className="grid grid-cols-3 gap-[1px] bg-trax-white/10 mb-6">
            {[
              { val: currentStats.dist, key: 'Distance' },
              { val: currentStats.gain, key: 'Elevation Gain' },
              { val: currentStats.max,  key: 'Max Elevation' },
            ].map((s) => (
              <div key={s.key} className="bg-trax-black p-4 text-center">
                <span className="font-sans text-xl md:text-2xl font-medium text-trax-white block leading-none">{s.val}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-trax-grey block mt-1">{s.key}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="w-full h-[420px] md:h-[520px] relative border border-trax-white/10 mb-4 bg-[#111]">
            <LeafletMap activeDay={activeDay} fitKey={fitKey} />
          </div>

          {/* Day narrative */}
          {activeDay > 0 && (() => {
            const narratives: Record<number, { title: string; lines: string[] }> = {
              1: {
                title: 'The Long Open',
                lines: [
                  'The longest day by distance — 254 km across southern Dobrogea. Flat, wide, and relentless. The terrain gives you almost nothing to react to, which is the point.',
                  'Ancient quarries and mouflon reserves near the Bulgarian border. Ottoman fountains in villages with no signal. Roman ruins at Adamclisi. Then the limestone plateau opens up and doesn\'t close for hours. Gravel roads, forgotten tracks, long sightlines with almost no shade.',
                  'Fuel management starts here. The rhythm you build today carries the rest of the experience.',
                ],
              },
              2: {
                title: 'Into the Gorges',
                lines: [
                  'Shorter distance, different character. 186 km through the heart of Dobrogea — the Casimcea valley, the gorges at Gura Dobrogei, the caves and medieval ruins that most people drive past on the highway without knowing.',
                  'The landscape sharpens. Limestone walls rise. The route swings east toward the coast — Cape Doloșman, the peonies at Enisala, the fortress on the hill where the Danube Delta begins to appear on the horizon.',
                  'This is the pivot day. The group either finds its pace here or it doesn\'t.',
                ],
              },
              3: {
                title: 'The Old Mountains',
                lines: [
                  '200 km through northern Dobrogea and into the Măcin range — the oldest mountains in Romania, worn down to ridges and granite. The landscape changes completely.',
                  'Babadag forest. Abandoned quarries. Wind farms on bare hills. Then the terrain lifts — Troesmis fortress overlooking the Danube, Lacul Iacobdeal carved into rock, and the Dobrogean Sphinx waiting at the top of Pricopan. The 350 m max elevation sounds modest. The terrain around it does not feel modest.',
                  'The group arrives together or not at all.',
                ],
              },
            };
            const n = narratives[activeDay];
            return (
              <div className="mt-6 border-t border-trax-white/10 pt-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="md:w-48">
                  <MonoLabel className="mb-1 block">Day {activeDay} — Character</MonoLabel>
                  <p className="font-sans text-trax-white text-base font-medium">{n.title}</p>
                </div>
                <div className="space-y-2">
                  {n.lines.map((line, i) => (
                    <Body key={i}>{line}</Body>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Elevation profile */}
          <div className="mt-6">
            <MonoLabel className="mb-2 block">Elevation Profile</MonoLabel>
            {currentElevData.length > 0
              ? <ElevationChart data={currentElevData} color={currentElevColor} />
              : <div className="h-20 flex items-center">
                  <MonoLabel>Select a single day to view profile</MonoLabel>
                </div>
            }
          </div>

          {/* GPX Downloads */}
          <div className="mt-8 border-t border-trax-white/10 pt-6">
            <MonoLabel className="mb-4 block">Download GPX</MonoLabel>
            <div className="flex flex-wrap gap-2">
              {[
                { day: 1, label: 'Day 1 — The Long Open',    file: 'TRAX_Dobrogea_Calling_Day1_SingleTrack.gpx' },
                { day: 2, label: 'Day 2 — Into the Gorges',  file: 'TRAX_Dobrogea_Calling_Day2_SingleTrack.gpx' },
                { day: 3, label: 'Day 3 — The Old Mountains', file: 'TRAX_Dobrogea_Calling_Day3_SingleTrack.gpx' },
              ].map(({ day, label, file }) => (
                <a
                  key={day}
                  href={`/assets/gpx/${file}`}
                  download
                  className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2.5 bg-trax-white/5 border border-trax-white/15 text-trax-grey hover:text-trax-white hover:border-trax-white/30 transition-all duration-200 flex items-center gap-2"
                  style={activeDay === day ? { borderColor: DAY_COLORS[day] + '80', color: DAY_COLORS[day] } : {}}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 1v7M3 5.5l3 3 3-3M1 10h10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* ── 01c — Accommodation ───────────────────────────────────────────── */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">01c — Accommodation</MonoLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-10">
            <div>
              <SubHeadline>Where You Sleep</SubHeadline>
              <Spacer size="sm" />
              <Body>
                Three days of riding, two nights of proper accommodation. You leave Bucharest Friday morning and return late Sunday evening. Exact locations confirmed 5 days before departure.
              </Body>
            </div>
            <Body>
              Food in the evenings is handled as a group. Local, simple, enough. There is no catering operation — there is a group that eats together.
            </Body>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {[
              { night: 'Night 1 — Friday', where: 'Dobrogea — south', type: 'Guesthouse', note: 'After the long plateau day. Rest is non-negotiable.' },
              { night: 'Night 2 — Saturday', where: 'Enisala surroundings', type: 'Guesthouse', note: 'Near the fortress, near the Delta. The landscape shifts from riding to stillness. Last night together.' },
            ].map((row) => (
              <div key={row.night} className="flex flex-col gap-2 px-5 py-5 bg-trax-white/5">
                <span className="font-mono text-[11px] text-trax-red font-bold">{row.night}</span>
                <p className="font-body text-trax-white/90 text-sm font-medium">{row.where}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-trax-grey">{row.type}</p>
                <p className="font-body text-trax-grey text-xs leading-relaxed">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-trax-grey/40 pt-4">Exact locations confirmed 5 days before departure</p>
        </div>

        <Spacer size="lg" />

        {/* ── 01d — What You'll Pass ────────────────────────────────────────── */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">01d — What You&apos;ll Pass</MonoLabel>
          <SubHeadline className="mb-3">What You&apos;ll Pass</SubHeadline>
          <Body className="mb-10 text-trax-grey/60">Not all of these are stops. Some are detours. Some you&apos;ll just see from the trail. All of them are real.</Body>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-trax-white/10">
            {([
              {
                day: 1 as const,
                title: 'The Long Open',
                landmarks: [
                  'Canaraua Fetei-Băneasa Quarry',
                  'Canaraua Fetii',
                  'Rezervație de Mufloni',
                  'Old Water Station',
                  'Peștera — Wind Turbines',
                  'Monumentul Tropaeum Traiani',
                  'Archaeological Museum of Adamclisi',
                  'Cișmeaua turcească Zorile',
                  'Pereții calcaroși de la Petroșani',
                  'Geamia turcească Fântâna Mare',
                  'Fortificația Romano-Bizantină Plopeni',
                  'NirSum — Pitstop',
                  'The Monument of Youth',
                  'View Point Murfatlar',
                ],
              },
              {
                day: 2 as const,
                title: 'Into the Gorges',
                landmarks: [
                  'Career Nicolae Bălcescu',
                  'La Adam Cave',
                  'The Medieval City of Ester',
                  "Dobrogea's Mouth Natural Reservation",
                  'Podul Casimcei',
                  'Grota Haiducilor Camena',
                  'Cape Doloșman',
                  'Bujorii de la Enisala',
                  'The Enisala Fortress',
                ],
              },
              {
                day: 3 as const,
                title: 'The Old Mountains',
                landmarks: [
                  'The Ancient Town of Ibida',
                  'The Stone Quarry Fântâna Mare',
                  'Fântâna Mare Lilac Nature Preserve',
                  'Poiana cu Bujori',
                  'Yellow Bench',
                  'Bașchioi Quarry',
                  'Codrul Tăcut',
                  'Monumentul parașutistelor',
                  'The Fortress of Flowers',
                  'Sfinxul Dobrogean',
                  'Cetatea de Vest',
                  'The Fortress of Troesmis',
                  'Lacul Iacobdeal',
                  'Cerna Wind Farm',
                  'Colina Doihia',
                ],
              },
            ] as const).map(({ day, title, landmarks }) => (
              <div key={day} className="bg-trax-black p-6 md:p-8">
                <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-trax-white/10">
                  <span
                    className="font-mono text-[11px] tracking-[0.12em] uppercase"
                    style={{ color: DAY_COLORS[day] }}
                  >
                    Day {day} — {title}
                  </span>
                  <span className="font-mono text-[11px] text-trax-grey/40">{landmarks.length}</span>
                </div>
                <div className="flex flex-col">
                  {landmarks.map((name) => (
                    <span
                      key={name}
                      className="font-body text-[13px] text-trax-grey/70 py-1.5 border-b border-trax-white/[0.04] last:border-b-0 leading-snug"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Spacer size="lg" />

        {/* ── 02 — Mental Prep ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-trax-grey/20 pt-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">02 — Mental Prep</MonoLabel>
            <SubHeadline>Where You Need to Be</SubHeadline>
            <Spacer size="sm" />
            <Body>
              Three days in Dobrogea won&apos;t break you physically. What it does is slow you down enough to notice things — about the terrain, about the group, and about yourself.
            </Body>
            <Spacer size="sm" />
            <Body>
              The experience is designed to create friction. Not as a test. As a reset. <span className="text-trax-red font-medium">Some of that will feel uncomfortable. That discomfort is the point.</span>
            </Body>

            <Spacer size="sm" />
            <h4 className="font-sans text-trax-red text-lg mb-6">What to Leave at Home</h4>
            <div className="space-y-1">
              {[
                ['The need to be impressive.', "Nobody is watching. The group will respect you more for steady, reliable riding than for anything loud."],
                ['Rigid plans.', "You will have a sense of the route. Conditions will revise it. This is not a failure. It's the terrain doing its job."],
                ['Constant documentation mode.', "Phones mostly away. Some moments are intentionally undocumented. What you remember without a camera is often what actually matters."],
                ['The pace of your regular week.', "Dobrogea doesn't reward urgency. Settle in early and let the horizon work on you."],
              ].map(([strong, rest]) => (
                <div key={String(strong)} className="flex gap-4 px-5 py-4 bg-trax-white/5">
                  <span className="text-trax-red font-sans font-medium text-sm mt-0.5 flex-shrink-0">✕</span>
                  <p className="font-body text-trax-white/80 text-sm leading-relaxed">
                    <strong className="text-trax-white font-medium">{strong}</strong> {rest}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-trax-white/5 p-8 mb-8">
              <p className="font-body text-trax-white/80 italic">
                If you arrive with an agenda, the terrain will dismantle it. That&apos;s not a problem to solve. It&apos;s the experience working correctly.
              </p>
            </div>

            <h4 className="font-sans text-trax-red text-lg mb-6">Calibration</h4>
            <div className="space-y-6">
              {MINDSET_BARS.map((bar) => (
                <div key={bar.label}>
                  <span className="font-mono text-[12px] tracking-widest uppercase text-trax-white block mb-2">{bar.label}</span>
                  <div className="h-[2px] bg-trax-white/10 relative">
                    <div
                      className="h-full bg-trax-red transition-[width] duration-1000 ease-out"
                      style={{ width: barsAnimated ? bar.width : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="font-body text-[11px] text-trax-grey italic">{bar.left}</span>
                    <span className="font-body text-[11px] text-trax-grey italic">{bar.right}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* ── 03 — Gear & Packing ───────────────────────────────────────────── */}
        <div className="border-t border-trax-grey/20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-16 items-start">

            {/* Left — intro + checklist */}
            <div>
              <MonoLabel className="mb-6 block">03 — Gear &amp; Packing</MonoLabel>
              <SubHeadline>The Principle</SubHeadline>
              <Spacer size="sm" />
              <Body>
                Pack for three days of real riding in variable conditions. Not for a camping expedition. Not for a hotel stay. Three days on the bike, evenings outdoors, practical simplicity.
              </Body>
              <Spacer size="sm" />
              <Body>
                <span className="text-trax-red font-medium">If you&apos;re questioning whether you need it — you don&apos;t.</span> Excess weight is honest feedback in Dobrogea.
              </Body>

              <Spacer size="md" />

              {/* Checklist */}
              <div className="space-y-0">
                {CHECK_GROUPS.map((group) => (
                  <React.Fragment key={group.title}>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-trax-grey pt-6 pb-3 flex items-center gap-3 border-t border-trax-grey/20">
                      {group.title}
                      {group.disabled && <span className="text-trax-red/60 normal-case tracking-normal text-[10px]">— don&apos;t bring</span>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((item) => {
                        const isChecked = checked.has(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={group.disabled ? undefined : () => toggleCheck(item.id)}
                            className={[
                              'flex items-start gap-4 px-4 py-3 bg-trax-white/5 transition-all duration-150 active:scale-[0.995] active:bg-trax-white/[0.12]',
                              item.essential && !group.disabled ? 'border-l-2 border-trax-red' : 'border-l-2 border-transparent',
                              isChecked ? 'opacity-40' : '',
                              group.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-trax-white/[0.08]',
                            ].filter(Boolean).join(' ')}
                          >
                            <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-trax-red/20 border-trax-red scale-110' : 'border-trax-grey/40 scale-100'}`}>
                              <div className={`w-2 h-[5px] border-l-[1.5px] border-b-[1.5px] border-trax-red -rotate-45 translate-x-[1px] -translate-y-[1px] transition-opacity duration-200 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-body text-[14px] text-trax-white/90 leading-snug">{item.name}</div>
                              {item.note && <div className="font-body text-[12px] text-trax-grey mt-0.5">{item.note}</div>}
                            </div>
                            {item.essential && !group.disabled && (
                              <span className="font-mono text-[10px] tracking-widest uppercase text-trax-red flex-shrink-0 self-start pt-0.5">Essential</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right — sticky progress */}
            <div className="hidden md:block sticky top-[45vh] -translate-y-1/2 bg-trax-white/5 p-8 h-fit">
              <MonoLabel className="mb-4 block">Packing Progress</MonoLabel>
              <div className="flex items-center gap-4 mb-3">
                <span className="font-body text-trax-grey text-sm whitespace-nowrap">
                  <span className="text-trax-red font-medium">{checkedCount}</span> / {TOTAL_CHECKABLE}
                </span>
                <div className="flex-1 h-[2px] bg-trax-white/10">
                  <div className="h-full bg-trax-red transition-[width] duration-300 ease-out" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="font-mono text-[12px] text-trax-grey whitespace-nowrap">{progressPct}%</span>
              </div>
              {progressPct === 100 && (
                <p className="font-body text-trax-red text-sm italic">You&apos;re ready.</p>
              )}
            </div>

          </div>
        </div>

        <Spacer size="lg" />

        {/* ── 04 — Group Culture ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-trax-grey/20 pt-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">04 — Group Culture</MonoLabel>
            <SubHeadline>How TRAX Moves</SubHeadline>
            <Spacer size="sm" />
            <Body>
              There is no guide, no sweep, no instructor. Everyone is responsible for themselves and accountable to the group. Those two things are not in conflict — they define how we ride.
            </Body>
            <Spacer size="sm" />
            <Body>
              Ego doesn&apos;t survive long out here. Not because anyone polices it. <span className="text-trax-red font-medium">Because the terrain makes it irrelevant.</span>
            </Body>
          </div>

          <div>
            <div className="bg-trax-white/5 p-8 md:p-12 mb-8">
              <p className="font-body text-xl text-trax-white/80 italic leading-relaxed">
                You were confirmed because your attitude aligned. That alignment is what keeps the Collective worth belonging to. Protect it.
              </p>
            </div>

            <h4 className="font-sans text-trax-red text-lg mb-4">Your Artifact</h4>
            <Body>
              In TRAX, artifacts are not merchandise. They are not available for purchase, not offered as incentives, and not given without corresponding effort. Every artifact is tied to a specific experience — earned by the riders who were there, in that terrain, in that year.
            </Body>
            <Body className="mt-4">
              Each TRAX experience carries its own artifact. Different material. Different form. Same principle: if you weren't there, it doesn't exist for you.
            </Body>
            <Body className="mt-4">
              The Dobrogea Calling artifact is a rally jacket — designed specifically for this terrain, this year, this group. It is not sold separately. It is not available after the fact. It exists only because you answered the Calling.
            </Body>
            <Body className="mt-4">
              What you carry out of a TRAX experience should remind you of what it cost — not what it's worth.
            </Body>
          </div>
        </div>

        <Spacer size="lg" />

        <h4 className="font-sans text-trax-red text-lg mb-6">The Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {[
            ['01', 'We wait.', "Faster riders wait at junctions. We arrive as a group or we're not doing it right."],
            ['02', 'We signal problems early.', 'If something is wrong — mechanically, physically, mentally — you say it. Silence is the only thing that creates real problems.'],
            ['03', "We don't perform for cameras.", "Phones mostly away. If something real happens, you'll know."],
            ['04', 'We leave terrain as we found it.', 'No shortcuts through private land. No fires without permission. No trace.'],
            ['05', 'Evenings are not programmed.', "Food, fire, conversation — whatever comes naturally. If the group goes quiet, let it go quiet."],
            ['06', 'What happens on TRAX stays on TRAX.', "Share your experience — not other people's moments."],
          ].map(([num, strong, rest]) => (
            <div key={num} className="flex gap-4 px-5 py-4 bg-trax-white/5">
              <span className="font-mono text-[11px] text-trax-red font-bold min-w-[24px] pt-0.5">{num}</span>
              <p className="font-body text-trax-white/80 text-sm leading-relaxed">
                <strong className="text-trax-white font-medium">{strong}</strong> {rest}
              </p>
            </div>
          ))}
        </div>

        <Spacer size="xl" />

        <div className="text-center opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#DobrogeaCalling · Confirmed access only · Do not share or distribute</p>
        </div>
      </Container>
    </div>
  );
}
