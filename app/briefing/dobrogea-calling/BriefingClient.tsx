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
      { id: 'googles',     name: 'Googles and visor cleaner',                                                 essential: true },
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
      { id: 'cash',           name: 'Cash — Romanian lei',                          note: 'Not all stops accept card. Fuel, food, local bribes.', essential: true },
      { id: 'documents',      name: 'ID / insurance / vehicle documents',                                                                          essential: true },
      { id: 'toiletries',      name: 'Personal care toiletries',                                                                          essential: true },
      { id: 'sleeping_layer', name: 'Sleeping layer — fleece or light down jacket', note: 'May nights in Dobrogea cool quickly after sundown.' },
      { id: 'evening_clothes', name: 'Evening clothes — casual and presentable',    note: 'We may walk the Casino Constanța waterfront or sit down for dinner. Nothing fancy, but not riding gear.',  essential: true },
      
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
  const [checked, setChecked] = useState<Set<string>>(new Set());
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
    if (d === 1) return { background: 'rgba(180,40,20,0.15)', borderColor: '#b42814', color: '#e05040' };
    if (d === 2) return { background: 'rgba(192,130,30,0.12)', borderColor: '#8a6010', color: '#d4a040' };
    if (d === 3) return { background: 'rgba(40,100,160,0.12)', borderColor: '#185fa5', color: '#5a9cd5' };
    return { background: 'rgba(180,40,20,0.15)', borderColor: '#b42814', color: '#e05040' };
  };

  const countBlocks = [
    { val: mounted ? pad(countdown.d) : '--', label: 'Days' },
    { val: mounted ? pad(countdown.h) : '--', label: 'Hours' },
    { val: mounted ? pad(countdown.m) : '--', label: 'Mins' },
    { val: mounted ? pad(countdown.s) : '--', label: 'Secs' },
  ];

  return (
    <div className="min-h-screen animate-fade-in pb-24">

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
            { label: 'Distance',  value: '650km',   sub: 'Mixed terrain, all off-road' },
            { label: 'Landmarks', value: '~12',     sub: 'Points of interest' },
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
              { d: 1, label: 'Day 1 · 306km' },
              { d: 2, label: 'Day 2 · 218km' },
              { d: 3, label: 'Day 3 · 242km' },
              { d: 0, label: 'All Days' },
            ].map(({ d, label }) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
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
            <LeafletMap activeDay={activeDay} />
          </div>

          {/* Elevation profile */}
          <div>
            <MonoLabel className="mb-2 block">Elevation Profile</MonoLabel>
            {currentElevData.length > 0
              ? <ElevationChart data={currentElevData} color={currentElevColor} />
              : <div className="h-20 flex items-center">
                  <MonoLabel>Select a single day to view profile</MonoLabel>
                </div>
            }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-12">
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
            </div>

            {/* Progress */}
            <div className="bg-trax-white/5 p-8 h-fit">
              <MonoLabel className="mb-4 block">Packing Progress</MonoLabel>
              <div className="flex items-center gap-4 mb-3">
                <span className="font-body text-trax-grey text-sm whitespace-nowrap">
                  <span className="text-trax-red font-medium">{checkedCount}</span> / {TOTAL_CHECKABLE} items packed
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
                          'flex items-start gap-4 px-4 py-3 bg-trax-white/5 transition-all duration-150',
                          item.essential && !group.disabled ? 'border-l-2 border-trax-red' : 'border-l-2 border-transparent',
                          isChecked ? 'opacity-40' : '',
                          group.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-trax-white/[0.08]',
                        ].filter(Boolean).join(' ')}
                      >
                        <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-trax-red/20 border-trax-red' : 'border-trax-grey/40'}`}>
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
            <Spacer size="sm" />

            <h4 className="font-sans text-trax-red text-lg mb-6">The Rules</h4>
            <div className="space-y-1">
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
          </div>

          <div>
            <div className="bg-trax-white/5 p-8 md:p-12 mb-8">
              <p className="font-body text-xl text-trax-white/80 italic leading-relaxed">
                You were confirmed because your attitude aligned. That alignment is what keeps the Collective worth belonging to. Protect it.
              </p>
            </div>

            <h4 className="font-sans text-trax-red text-lg mb-4">Your Artifact</h4>
            <Body>
              Every confirmed rider receives the Dobrogea Calling rally jacket — designed specifically for this terrain, this year, this group. It is not sold separately. It is not available after the fact. It exists only because you showed up.
            </Body>
            <Spacer size="sm" />
            <Body className="text-trax-grey">
              It will be distributed at the closing of the experience. Not before.
            </Body>
          </div>
        </div>

        <Spacer size="xl" />

        <div className="text-center opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#DobrogeaCalling · Confirmed access only · Do not share or distribute</p>
        </div>
      </Container>
    </div>
  );
}
