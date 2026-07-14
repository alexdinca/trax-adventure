'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { ROUTES, WAYPOINTS, DAY3_ELEVATION } from './briefing-data';

const OutThereMap = dynamic(() => import('@/components/OutThereMap'), { ssr: false });

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

const TARGET_DATE = new Date('2026-08-14T07:00:00+03:00');

interface DayInfo {
  day: 1 | 2 | 3;
  title: string;
  stats: { val: string; key: string }[];
  paragraphs: string[];
  gpxFile: string;
  gpxNote?: string;
}

const DAYS: DayInfo[] = [
  {
    day: 1,
    title: 'The Ride In',
    stats: [
      { val: '~212 km', key: 'Distance' },
      { val: 'Mostly asphalt', key: 'Surface' },
      { val: 'Cabana Cheia', key: 'Camp 1' },
    ],
    paragraphs: [
      'Bucharest fades in the mirrors. The day is a transfer, but not a throwaway: two hundred kilometers on a loaded bike is where your packing gets its first honest review. Anything that moves, rattles, or digs into your leg will announce itself long before the mountains do.',
      'By late afternoon the road tilts up into the Cheia valley. Dinner is cooked at Cabana Cheia — sit down, eat well, it is the last meal someone else makes for you until Day 3. The first camp goes up next to the cabana. Tents up before dark. The first night teaches you what you forgot to pack, while the fix is still cheap.',
    ],
    gpxFile: 'trax-out-there-day1.gpx',
  },
  {
    day: 2,
    title: 'Up There',
    stats: [
      { val: '~126 km', key: 'Distance' },
      { val: 'Mountain trail', key: 'Terrain' },
      { val: 'Panorama Vidra · ~1,850 m', key: 'Camp 2' },
    ],
    paragraphs: [
      'Coffee, then the camp folds back onto the bike. The track picks up about six kilometers above the camp — from the cabana there is one valley road and it goes up; follow it until the line starts. From there the route goes straight into the mountains and stays there — a full day of trail through the Căpățânii and Latoriței high country, climbs and loose surfaces that get a full vote on how your bike is packed.',
      'Midday you drop into the Latorița valley for lunch and supplies in Ciungetu. Buy what you need for the night and the next morning. This is the last resupply before the wild camp — after Ciungetu, everything you eat and drink comes off the bike.',
      'Then the climb starts. The Strategica — the old military road — works its way up above the treeline, and by evening you reach the belvedere: Panorama Vidra, with the whole lake below you. Camp two sits at the top of the wilderness, around 1,850 meters. Away from roads, signal and noise. This is the night the experience is named after.',
    ],
    gpxFile: 'trax-out-there-day2.gpx',
    gpxNote: 'The track starts ~6 km above the camp. Follow the valley road uphill from the cabana until it begins.',
  },
  {
    day: 3,
    title: 'The Way Back',
    stats: [
      { val: '~93 km', key: 'Trail · −2,370 m' },
      { val: '~247 km', key: 'Road Home' },
      { val: 'Bucharest', key: 'Finish' },
    ],
    paragraphs: [
      'No alarm. Slow coffee, cold hands. The morning finishes what the Strategica started, with a detour onto the Transalpina before the long way down — ninety kilometers of trail losing almost two thousand four hundred meters, down the Lotru country into Tălmaciu. Descents ask different questions than climbs. Loaded, they ask them louder.',
      'In Tălmaciu the trail becomes asphalt. The road home runs down the Olt valley, then cuts away from the main road through Perișani and the Poiana tunnel toward the Topolog valley. The food stop is earned by then: Hobbitland — La Taverna Berarului, in Șuici. From there, Curtea de Argeș, and Bucharest returns by evening.',
      "The ride back always feels different. That's the point.",
    ],
    gpxFile: 'trax-out-there-day3.gpx',
    gpxNote: 'GPX runs in riding direction — Camp 2 to Tălmaciu, downhill.',
  },
];

const BIKE_REQUIREMENTS = [
  'serviced and inspected before the start, no known issues',
  'off-road tires in good condition, suitable for rock and loose terrain',
  'engine and hand guards',
  'soft luggage mounted solid — nothing swinging, nothing held by hope',
  'tubeless repair kit or spare tubes, and the tools to use them',
  'tow strap',
  'charged phone, offline maps, all three GPX files loaded before Day 1',
];

const GROUP_RULES = [
  'the terrain leads, the plan adapts',
  "ride your own pace inside the group's rhythm",
  'no one rides sweep alone, no one gets left behind',
  'route decisions are made by the lead, for the whole group',
  'signal problems early, small ones become big ones at altitude',
  'camp goes up before dark, and leaves no trace behind',
  'phones stay away at the camps — the nights are undocumented',
];

const CHECK_GROUPS: CheckGroup[] = [
  {
    title: 'Riding Gear',
    items: [
      { id: 'helmet', name: 'Helmet — off-road or ADV rated', note: 'Full face preferred.', essential: true },
      { id: 'goggles', name: 'Goggles and visor cleaner', essential: true },
      { id: 'jacket', name: 'Riding jacket — armoured, vented', note: 'Mornings at 1,850 m are cold in August. Layer accordingly.', essential: true },
      { id: 'trousers', name: 'Riding trousers — armoured', note: 'Knee braces preferred.', essential: true },
      { id: 'boots', name: 'Enduro/MX boots', essential: true },
      { id: 'gloves', name: 'Gloves — two pairs: off-road and waterproof', essential: true },
      { id: 'rain_layer', name: 'Rain layer — packable', note: 'Mountain weather changes without announcement. Above the treeline it changes faster.', essential: true },
      { id: 'socks', name: 'MX socks — plus a dry spare pair, kept dry' },
    ],
  },
  {
    title: 'Sleep System',
    items: [
      { id: 'tent', name: 'Tent or bivy — compact, storm-worthy', note: 'Camp 2 is exposed. It must hold in wind.', essential: true },
      { id: 'sleeping_bag', name: 'Sleeping bag — comfort rated around 0–5°C', note: 'August at 1,850 m drops to single digits. Cold nights are remembered longer than heavy panniers.', essential: true },
      { id: 'mat', name: 'Insulated sleeping mat', essential: true },
      { id: 'headlamp', name: 'Headlamp + spare batteries', essential: true },
      { id: 'camp_layer', name: 'Warm camp layer — down jacket, beanie, camp gloves', note: 'The engine stops. The cold does not.', essential: true },
    ],
  },
  {
    title: 'Food & Water',
    items: [
      { id: 'water', name: 'Water capacity — minimum 2L on the bike', note: 'More in heat. Streams exist on route; your capacity should not depend on them.', essential: true },
      { id: 'filter', name: 'Water filter or purification tablets' },
      { id: 'food', name: 'Food for Camp 2 — dinner plus two breakfasts', note: 'Bought or topped up in Ciungetu. Simple, calorie-dense, no cooler required.', essential: true },
      { id: 'stove', name: 'Compact stove and lighter', note: 'Shared within the group is fine. Coordinate in the chat.' },
      { id: 'trash', name: 'Trash bag — everything you carry in, you carry out', essential: true },
    ],
  },
  {
    title: 'Bike Essentials',
    items: [
      { id: 'full_tank', name: 'Full tank at departure', note: 'No fuel between Cheia and Tălmaciu — roughly 220 km of mountain riding. 250 km of real-world, loaded autonomy minimum.', essential: true },
      { id: 'tyre_pressure', name: 'Tyre pressure — checked and correct', note: "Off-road terrain may require lower pressures. Know your bike's spec.", essential: true },
      { id: 'tool_kit', name: 'Basic tool kit specific to your bike — tyre plugs, levers, multi-tool', essential: true },
      { id: 'compressor', name: 'Mini compressor or CO₂ cartridges' },
      { id: 'straps', name: 'Luggage straps checked — plus one spare strap', note: 'The climb will find the loose one.', essential: true },
      { id: 'phone_mount', name: 'Phone mount and offline maps loaded', note: 'Signal disappears on Day 2 and stays gone until the descent.' },
    ],
  },
  {
    title: 'Personal',
    items: [
      { id: 'cash', name: 'Cash — Romanian lei', note: 'Cabana, village shop, taverna. Cards are optimistic out there.', essential: true },
      { id: 'documents', name: 'ID / insurance / vehicle documents', essential: true },
      { id: 'first_aid', name: 'Basic personal first aid', essential: true },
      { id: 'toiletries', name: 'Toiletries — travel sized' },
      { id: 'power_bank', name: 'Power bank and charging cable', note: 'Two nights, zero sockets.' },
    ],
  },
  {
    title: 'Leave Behind',
    disabled: true,
    items: [
      { id: 'leave_luggage', name: 'The second bag', note: 'If you need a second bag, reconsider the first bag. Excess becomes obvious on the first climb.' },
      { id: 'leave_comfort', name: 'The expectation of comfort', note: 'Comfort is negotiable. That was the deal.' },
      { id: 'leave_signal', name: 'The need for signal at all times', note: 'Camp 2 has none. On purpose.' },
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

function RequirementList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <div key={item} className="flex gap-4 px-5 py-4 bg-trax-white/5">
          <span className="text-trax-red font-mono text-sm mt-0.5 flex-shrink-0">·</span>
          <p className="font-body text-trax-white/80 text-sm leading-relaxed">{item}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BriefingClient() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = localStorage.getItem('trax-ot-packing');
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    setMounted(true);
    const update = () => setCountdown(getTimeLeft(TARGET_DATE));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('trax-ot-packing', JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const checkedCount = checked.size;
  const progressPct = Math.round((checkedCount / TOTAL_CHECKABLE) * 100);

  const countBlocks = [
    { val: mounted ? pad(countdown.d) : '--', label: 'Days' },
    { val: mounted ? pad(countdown.h) : '--', label: 'Hours' },
    { val: mounted ? pad(countdown.m) : '--', label: 'Mins' },
    { val: mounted ? pad(countdown.s) : '--', label: 'Secs' },
  ];

  return (
    <div className="min-h-screen animate-fade-in pt-16 pb-24">

      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-trax-black/95 border-b border-trax-white/10 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-sm">
        <a href="/" className="font-sans font-bold tracking-[0.2em] uppercase text-trax-white text-sm hover:text-trax-red transition-colors duration-150">TRAX</a>
        <MonoLabel>Briefing Pack</MonoLabel>
      </div>

      {/* Fixed bottom access bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-trax-black/95 border-t border-trax-white/10 px-6 md:px-12 py-3 flex items-center justify-between backdrop-blur-sm">
        <MonoLabel>TRAX Briefing Pack · Confirmed Riders Only</MonoLabel>
        <MonoLabel><span className="text-trax-red">#OutThere</span> · You&apos;re In.</MonoLabel>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/out-there/dji_fly_20251023_170554_0034_1761241329870_timed.jpg"
            alt="Loaded rally motorcycle and rider at a high viewpoint above a mountain reservoir"
            fill
            className="object-cover trax-image opacity-50"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-trax-black/30 to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">TRAX Briefing · Access Granted</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Out There
          </h1>
          <p className="font-body text-trax-white/70 text-xl md:text-2xl font-light italic mb-4">
            14th – 16th August 2026 · Bucharest → the wilderness → Bucharest
          </p>
          <p className="font-mono text-xs tracking-widest uppercase text-trax-red/80 mb-8">
            This briefing is for confirmed riders. Do not share the link.
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
            { label: 'Duration', value: '3 Days', sub: '2 nights, both wild' },
            { label: 'Distance', value: '~680 km', sub: '~220 km of it mountain trail' },
            { label: 'High Camp', value: '~1,850 m', sub: 'Panorama Vidra, above Lacul Vidra' },
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <p className="font-sans text-trax-red text-sm tracking-widest uppercase">{s.label}</p>
              <p className="font-sans text-trax-white text-2xl md:text-3xl font-medium">{s.value}</p>
              <p className="font-sans text-trax-grey text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 01 — The Word */}
        <div className="border-t border-trax-grey/20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <MonoLabel className="mb-6 block">01 · The Word</MonoLabel>
              <SubHeadline>Read This First</SubHeadline>
              <Spacer size="sm" />
              <Body className="mb-6">
                Out There is self-supported. Everything you need for three days comes on the bike: shelter, sleep, food for the high camp. There is no van, no base, no backup plan parked nearby. The group is the support.
              </Body>
              <Body className="mb-6">
                Both nights are wild camps. The second one sits at around 1,850 meters, above the treeline, off the grid. <span className="text-trax-red font-medium">Between Cheia on Day 2 and Tălmaciu on Day 3 there is no fuel and no shop except Ciungetu.</span> The mountains do not improvise well. You prepare, or you carry the consequence.
              </Body>
              <Body>
                Read everything below. Then read it again the night before.
              </Body>
            </div>
            <Image
              src="/assets/out-there/briefing/IMG_6444.jpg"
              alt="Loaded KTM rally motorcycle parked on a gravel ridge track in the high Carpathians"
              width={600}
              height={800}
              className="w-full h-[500px] md:h-[600px] object-cover trax-image opacity-90"
            />
          </div>
        </div>

        <Spacer size="lg" />

        {/* 02 — The Route */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">02 · The Route</MonoLabel>
          <SubHeadline className="mb-8">Three Days</SubHeadline>

          <div className="flex flex-col gap-20">
            {DAYS.map((d) => (
              <div key={d.day}>
                <div className="flex items-baseline justify-between mb-4">
                  <h4 className="font-sans text-trax-white text-2xl font-medium">Day {d.day} · {d.title}</h4>
                </div>

                <div className="grid grid-cols-3 gap-[1px] bg-trax-white/10 mb-6">
                  {d.stats.map((s) => (
                    <div key={s.key} className="bg-trax-black p-4 text-center">
                      <span className="font-sans text-lg md:text-2xl font-medium text-trax-white block leading-none">{s.val}</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-trax-grey block mt-1">{s.key}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-[380px] md:h-[460px] relative border border-trax-white/10 mb-6 bg-[#111]">
                  <OutThereMap route={ROUTES[d.day]} waypoints={WAYPOINTS[d.day]} />
                </div>

                {d.day === 3 && (
                  <div className="mb-6">
                    <MonoLabel className="mb-2 block">Trail Elevation · Riding Direction · Camp 2 → Tălmaciu</MonoLabel>
                    <ElevationChart data={DAY3_ELEVATION} color="#C04A30" />
                    <div className="flex justify-between mt-1">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-trax-grey">~1,850 m · Camp 2</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-trax-grey">~380 m · Tălmaciu</span>
                    </div>
                  </div>
                )}

                {d.paragraphs.map((p) => (
                  <Body key={p.slice(0, 32)} className="mb-6">{p}</Body>
                ))}

                <a
                  href={`/assets/gpx/${d.gpxFile}`}
                  download
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2.5 bg-trax-white/5 border border-trax-white/15 text-trax-grey hover:text-trax-white hover:border-trax-white/30 transition-all duration-200"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 1v7M3 5.5l3 3 3-3M1 10h10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download Day {d.day} GPX
                </a>
                {d.gpxNote && (
                  <p className="font-mono text-[10px] tracking-widest uppercase text-trax-grey/60 mt-3">{d.gpxNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Spacer size="lg" />

        {/* 03 — Route Logic */}
        <div className="border-t border-trax-grey/20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <MonoLabel className="mb-6 block">03 · Route Logic</MonoLabel>
              <SubHeadline>The Line We Ride</SubHeadline>
              <Spacer size="sm" />
              <Body className="mb-6">
                The route on these maps is the route. It was measured, fueled, and planned as a whole. Ride it as one.
              </Body>
              <Body className="mb-6">
                The days end where the camps are, not where the odometer says. If weather or the group needs it, the lead shortens, reroutes, or drops altitude. The Strategica and the Transalpina both have bailout lines down into the valleys — nobody freelances onto or off the mountain alone.
              </Body>
              <Body>
                Above the treeline the weather owns the schedule. An afternoon storm at 1,800 meters is not an inconvenience, it is a route decision. Expect the plan to bend. It is built to.
              </Body>
            </div>
            <Image
              src="/assets/out-there/briefing/IMG_6440.jpg"
              alt="Rider's view over the handlebars on a rocky ridge trail winding through the high country"
              width={600}
              height={800}
              className="w-full h-[500px] md:h-[600px] object-cover trax-image opacity-90"
            />
          </div>
        </div>

        <Spacer size="lg" />

        {/* 04 — Fuel, Food & Water */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">04 · Fuel, Food &amp; Water</MonoLabel>
          <SubHeadline>Range and Resupply</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            Leave Bucharest with a full tank and top up on the Day 1 approach, before the Cheia valley. <span className="text-trax-red font-medium">From there, assume no fuel until Tălmaciu on Day 3 — roughly 220 kilometers of loaded, technical mountain riding.</span> Minimum 250 km of real-world autonomy, calculated for trail consumption, not highway figures.
          </Body>
          <Body className="mb-6">
            Food follows the same logic. Dinner on Day 1 is cooked at Cabana Cheia. Lunch and resupply on Day 2 is in Ciungetu — the last shop before the high camp. Everything after that comes off the bike until the taverna in Șuici on Day 3.
          </Body>
          <Body>
            Water: two liters minimum on the bike at all times, more in heat. There are streams on the route — treat them as a bonus, not a plan. A filter or tablets earn their weight.
          </Body>
        </div>

        <Spacer size="lg" />

        {/* 05 — The Camps */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">05 · The Camps</MonoLabel>
          <SubHeadline>Where We Sleep</SubHeadline>
          <Spacer size="sm" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-8">
            {[
              {
                night: 'Night 1 — Friday',
                where: 'Cheia valley, by the cabana',
                type: 'Wild camp · dinner at Cabana Cheia',
                note: 'The soft opening. A cooked meal at the table, then the tent. Use it to sort your system while the stakes are low.',
              },
              {
                night: 'Night 2 — Saturday',
                where: 'Panorama Vidra · the belvedere · ~1,850 m',
                type: 'Wild camp · fully self-supported',
                note: 'Exposed, high, and silent, with Lacul Vidra far below. No facilities, no signal, no light but yours. Anchor everything — the wind up there does not knock first.',
              },
            ].map((row) => (
              <div key={row.night} className="flex flex-col gap-2 px-5 py-5 bg-trax-white/5">
                <span className="font-mono text-[11px] text-trax-red font-bold">{row.night}</span>
                <p className="font-body text-trax-white/90 text-sm font-medium">{row.where}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-trax-grey">{row.type}</p>
                <p className="font-body text-trax-grey text-xs leading-relaxed">{row.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <Body className="mb-6">
                Both camps are wild and both camps disappear behind us. Everything carried in gets carried out. Fires only if the lead calls it safe and legal — and August in the mountains often means no.
              </Body>
              <Body className="mb-6">
                August at 1,850 meters drops to single digits after sundown. The night is cold, long, and exactly what you came for. Your sleep system is not the place you save weight.
              </Body>
              <div className="bg-trax-white/5 p-8">
                <p className="font-body text-trax-white/80 italic leading-relaxed">
                  Phones stay away. Cameras stay down. The nights are intentionally undocumented — what you remember without a camera is what you actually keep.
                </p>
              </div>
            </div>
            <Image
              src="/assets/out-there/briefing/IMG_6451.jpg"
              alt="Loaded motorcycle at the belvedere above Lacul Vidra — the Camp 2 view"
              width={600}
              height={800}
              className="w-full h-[500px] md:h-[600px] object-cover trax-image opacity-90"
            />
          </div>
        </div>

        <Spacer size="lg" />

        {/* 06 — The Machine */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">06 · The Machine</MonoLabel>
          <SubHeadline className="mb-8">Bike Requirements</SubHeadline>
          <RequirementList items={BIKE_REQUIREMENTS} />
          <p className="font-body text-trax-white/80 text-sm italic mt-6">
            A loaded bike multiplies every doubt. If something on your machine has a question mark, answer it before Bucharest.
          </p>
        </div>

        <Spacer size="lg" />

        {/* 07 — The Rider: packing checklist */}
        <div className="border-t border-trax-grey/20 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-16 items-start">

            {/* Left — intro + checklist */}
            <div>
              <MonoLabel className="mb-6 block">07 · The Rider</MonoLabel>
              <SubHeadline>Pack Light. Pack Right.</SubHeadline>
              <Spacer size="sm" />
              <Body>
                This is the packing list you were promised. It fits in one soft luggage setup and a small backpack. It is not a suggestion of options — it is close to the whole inventory.
              </Body>
              <Spacer size="sm" />
              <Body>
                <span className="text-trax-red font-medium">If you&apos;re questioning whether you need it, you don&apos;t.</span> Excess becomes obvious on the first climb.
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
                <p className="font-body text-trax-red text-sm italic">You&apos;re ready. Now go weigh it.</p>
              )}
            </div>

          </div>
        </div>

        <Spacer size="lg" />

        {/* 08 — The Rules */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">08 · The Rules</MonoLabel>
          <SubHeadline className="mb-8">How the Group Rides</SubHeadline>
          <RequirementList items={GROUP_RULES} />
          <p className="font-body text-trax-white/80 text-sm italic mt-6">
            The mountains reward the group that behaves like one.
          </p>
        </div>

        <Spacer size="lg" />

        {/* 09 — Contact */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">09 · Contact</MonoLabel>
          <SubHeadline>If Something Goes Wrong</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            Emergency number in Romania: 112. Mountain rescue: Salvamont, 0725 826 668.
          </Body>
          <Body>
            Trip contact: confirmed in the group chat before departure. Save it before Day 1 — there is no coverage at the second camp, and none for most of Day 2. Someone at home should know the plan and the return time.
          </Body>
        </div>

        <Spacer size="xl" />

        <div className="text-center opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">Out There · Briefing v1.0 · For confirmed riders only</p>
        </div>
      </Container>
    </div>
  );
}
