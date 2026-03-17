'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './briefing.module.css';
import { DAY_STATS, DAY_COLORS, ELEVATION_DATA } from './briefing-data';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

// ── Types ────────────────────────────────────────────────────────────────────

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

interface MindsetBar {
  label: string;
  width: string;
  left: string;
  right: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const TARGET_DATE = new Date('2026-05-01T06:00:00+03:00');

const MINDSET_BARS: MindsetBar[] = [
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
      { id: 'helmet',     name: 'Helmet — off-road or ADV rated',             note: 'Full face. No exceptions.',                              essential: true },
      { id: 'jacket',     name: 'Riding jacket — armoured, vented',           note: 'Mornings can be cold. Afternoons warm. Layer accordingly.', essential: true },
      { id: 'trousers',   name: 'Riding trousers — armoured',                                                                                   essential: true },
      { id: 'boots',      name: 'Boots — ankle protection, off-road grip',    note: 'Road boots will work. Off-road boots are better.',         essential: true },
      { id: 'gloves',     name: 'Gloves — at least one pair, off-road preferred',                                                               essential: true },
      { id: 'rain_layer', name: 'Rain layer — packable',                      note: 'Dobrogea weather changes without announcement.' },
    ],
  },
  {
    title: 'Bike Essentials',
    items: [
      { id: 'full_tank',      name: 'Full tank at departure',                    note: 'Know your range. Some sections are far from fuel.',           essential: true },
      { id: 'tyre_pressure',  name: 'Tyre pressure — checked and correct',       note: "Off-road terrain may require lower pressures. Know your bike's spec.", essential: true },
      { id: 'tool_kit',       name: 'Basic tool kit — tyre plugs, levers, multi-tool' },
      { id: 'compressor',     name: 'Mini compressor or CO₂ cartridges' },
      { id: 'phone_mount',    name: 'Phone mount and offline maps loaded',        note: 'Signal will drop. Plan accordingly.' },
    ],
  },
  {
    title: 'Personal & Camp',
    items: [
      { id: 'cash',           name: 'Cash — Romanian lei',               note: 'Not all stops accept card. Fuel, food, accommodation.', essential: true },
      { id: 'documents',      name: 'ID / insurance / vehicle documents',                                                                essential: true },
      { id: 'sleeping_layer', name: 'Sleeping layer — fleece or light down jacket', note: 'May nights in Dobrogea cool quickly after sundown.' },
      { id: 'sunscreen',      name: 'Sunscreen + lip balm',              note: 'Open terrain, sustained exposure. Not optional.' },
      { id: 'water',          name: 'Water — minimum 1.5L on bike at all times' },
      { id: 'headlamp',       name: 'Headlamp / flashlight' },
      { id: 'power_bank',     name: 'Charging cable + power bank' },
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

// ── Sub-components ────────────────────────────────────────────────────────────

function ElevationChart({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const W = 800, H = 80, pad4 = 4;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const pts = data.map((e, i) => {
    const x = pad4 + (i / (data.length - 1)) * (W - 2 * pad4);
    const y = H - pad4 - ((e - mn) / ((mx - mn) || 1)) * (H - 2 * pad4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePts = pts.join(' ');
  const fillPts = [...pts, `${W - pad4},${H - pad4}`, `${pad4},${H - pad4}`].join(' ');
  return (
    <svg viewBox="0 0 800 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
      <polygon points={fillPts} fill={`${color}33`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

interface SectionProps {
  num: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  noPadLeft?: boolean;
}

function Section({ num, title, open, onToggle, children, noPadLeft }: SectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={onToggle}>
        <div className={styles.sectionMeta}>
          <span className={styles.sectionNum}>{num}</span>
          <span className={styles.sectionTitle}>{title}</span>
        </div>
        <div
          className={styles.sectionToggle}
          style={open ? { borderColor: '#C04A30', color: '#C04A30', transform: 'rotate(45deg)' } : {}}
        >
          +
        </div>
      </div>
      <div className={styles.sectionBody} style={{ maxHeight: open ? '3000px' : '0' }}>
        <div className={styles.sectionInner} style={noPadLeft ? { paddingLeft: 0 } : {}}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BriefingClient() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['s1', 's1b']));
  const [activeDay, setActiveDay] = useState(1);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [barsAnimated, setBarsAnimated] = useState(false);

  // Mount + countdown
  useEffect(() => {
    setMounted(true);
    const update = () => setCountdown(getTimeLeft(TARGET_DATE));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Animate mindset bars after short delay
  useEffect(() => {
    const t = setTimeout(() => setBarsAnimated(true), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleSection = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
  const currentElevColor = activeDay === 0 ? '#d43220' : DAY_COLORS[activeDay];
  const currentElevData = activeDay === 0 ? [] : ELEVATION_DATA[activeDay];

  const dayBtnClass = (d: number) => {
    const base = styles.dayBtn;
    if (activeDay !== d) return base;
    if (d === 1) return `${base} ${styles.dayBtnD1}`;
    if (d === 2) return `${base} ${styles.dayBtnD2}`;
    if (d === 3) return `${base} ${styles.dayBtnD3}`;
    return `${base} ${styles.dayBtnAll}`;
  };

  return (
    <div className={styles.page}>
      {/* Access Bar */}
      <div className={styles.accessBar}>
        <span>TRAX Briefing Pack · Confirmed Riders Only</span>
        <span>#DobrogeaCalling · <span className={styles.accessName}>You&apos;re In.</span></span>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>TRAX Experience · Briefing Pack · 2026</div>
        <h1 className={styles.heroH1}>
          Dobrogea<span className={styles.heroH1Span}>Calling.</span>
        </h1>
        <p className={styles.heroSub}>
          This is not a route guide. It&apos;s what you need to know before the first engine starts.
        </p>

        {/* Countdown */}
        <div className={styles.countdown}>
          <div className={styles.countBlock}>
            <span className={styles.countNum}>{mounted ? pad(countdown.d) : '--'}</span>
            <span className={styles.countLabel}>Days</span>
          </div>
          <div className={styles.countSep}>:</div>
          <div className={styles.countBlock}>
            <span className={styles.countNum}>{mounted ? pad(countdown.h) : '--'}</span>
            <span className={styles.countLabel}>Hours</span>
          </div>
          <div className={styles.countSep}>:</div>
          <div className={styles.countBlock}>
            <span className={styles.countNum}>{mounted ? pad(countdown.m) : '--'}</span>
            <span className={styles.countLabel}>Mins</span>
          </div>
          <div className={styles.countSep}>:</div>
          <div className={styles.countBlock}>
            <span className={styles.countNum}>{mounted ? pad(countdown.s) : '--'}</span>
            <span className={styles.countLabel}>Secs</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.quickStats}>
          <div className={styles.stat}><span className={styles.statVal}>3</span><span className={styles.statKey}>Days</span></div>
          <div className={styles.stat}><span className={styles.statVal}>650km</span><span className={styles.statKey}>Distance</span></div>
          <div className={styles.stat}><span className={styles.statVal}>~12</span><span className={styles.statKey}>Landmarks</span></div>
        </div>
      </div>

      {/* Sections */}
      <div className={styles.main}>

        {/* 01 — Terrain & Route */}
        <Section num="01" title="Terrain & Route" open={openSections.has('s1')} onToggle={() => toggleSection('s1')}>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>The Landscape</div>
            <p>Dobrogea is Romania&apos;s oldest geological formation. It doesn&apos;t perform for you. There are no dramatic peaks, no obvious spectacle. What it offers instead is space — wide, horizontal, and deeply quiet.</p>
            <p>Expect long sightlines, open gravel plateaus, ancient limestone ridges, and stretches where the only sound is wind and engine. That absence of noise is deliberate. It&apos;s where the experience actually begins.</p>
          </div>
          <div className={styles.callout}>
            <p>&ldquo;Dobrogea is not dramatic at first glance. And that&apos;s exactly why it works.&rdquo;</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>What the Terrain Asks of You</div>
            <div className={styles.tags}>
              {['Gravel roads', 'Forgotten tracks', 'Open field crossings'].map((t) => (
                <span key={t} className={`${styles.tag} ${styles.tagEmber}`}>{t}</span>
              ))}
              {['Long sightlines', 'Limestone plateaus', 'Sand sections', 'Light technical'].map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
            <p style={{ marginTop: '1rem' }}>
              This is not a technical riding challenge. The difficulty in Dobrogea is navigational, physical, and rhythmic — sustained effort over distance, not hard sections. Consistent pace, good navigation habits, and fuel awareness matter more than skill level here.
            </p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>Route Philosophy</div>
            <p>Routes are flexible. Weather, terrain condition, and group energy determine how each day unfolds. There is a plan. It is not a contract. The terrain decides — we adapt.</p>
            <p>There will be moments with no signal. Some sections are documented. Some are not. If you need a precise GPX loaded in advance, that instinct is worth examining before you arrive.</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>Starting Point</div>
            <p>Bucharest. Start and end point. Exact briefing location shared with confirmed riders 5 days before departure. Arrive with a full tank and a ready bike. Morning start.</p>
          </div>
        </Section>

        {/* 01b — Route Map */}
        <Section num="01b" title="Route Map" open={openSections.has('s1b')} onToggle={() => toggleSection('s1b')} noPadLeft>
          {/* Day toggles */}
          <div className={styles.dayToggles}>
            <button className={dayBtnClass(1)} onClick={() => setActiveDay(1)}>Day 1 · 306km</button>
            <button className={dayBtnClass(2)} onClick={() => setActiveDay(2)}>Day 2 · 218km</button>
            <button className={dayBtnClass(3)} onClick={() => setActiveDay(3)}>Day 3 · 242km</button>
            <button className={dayBtnClass(0)} onClick={() => setActiveDay(0)}>All Days</button>
          </div>

          {/* Day stats */}
          <div className={styles.dayStatsRow}>
            <div className={styles.dayStat}>
              <span className={styles.dayStatVal}>{currentStats.dist}</span>
              <span className={styles.dayStatKey}>Distance</span>
            </div>
            <div className={styles.dayStat}>
              <span className={styles.dayStatVal}>{currentStats.gain}</span>
              <span className={styles.dayStatKey}>Elevation Gain</span>
            </div>
            <div className={styles.dayStat}>
              <span className={styles.dayStatVal}>{currentStats.max}</span>
              <span className={styles.dayStatKey}>Max Elevation</span>
            </div>
          </div>

          {/* Map */}
          <div className={styles.mapWrap}>
            <LeafletMap activeDay={activeDay} />
          </div>

          {/* Elevation profile */}
          <div className={styles.elevWrap}>
            <div className={styles.elevLabel}>Elevation Profile</div>
            {currentElevData.length > 0
              ? <ElevationChart data={currentElevData} color={currentElevColor} />
              : <div style={{ height: 80, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--bone-dim)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Select a single day to view profile</span>
                </div>
            }
          </div>
        </Section>

        {/* 02 — Mental Prep */}
        <Section num="02" title="Mental Prep" open={openSections.has('s2')} onToggle={() => toggleSection('s2')}>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>Where You Need to Be</div>
            <p>Three days in Dobrogea won&apos;t break you physically. What it does is slow you down enough to notice things — about the terrain, about the group, and about yourself. That&apos;s worth preparing for.</p>
            <p>The experience is designed to create friction. Not as a test. As a reset. Some of that will feel uncomfortable. That discomfort is the point.</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>Calibration</div>
            <div className={styles.mindsetItems}>
              {MINDSET_BARS.map((bar) => (
                <div key={bar.label}>
                  <div className={styles.mindsetHeader}>
                    <span className={styles.mindsetLabel}>{bar.label}</span>
                  </div>
                  <div className={styles.mindsetBarWrap}>
                    <div
                      className={styles.mindsetBarFill}
                      style={{ width: barsAnimated ? bar.width : '0%' }}
                    />
                  </div>
                  <div className={styles.mindsetPoles}>
                    <span className={styles.pole}>{bar.left}</span>
                    <span className={styles.pole}>{bar.right}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.callout}>
            <p>If you arrive with an agenda, the terrain will dismantle it. That&apos;s not a problem to solve. It&apos;s the experience working correctly.</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>What to Leave at Home</div>
            <div className={styles.rulesList}>
              {[
                ['✕', 'The need to be impressive.', 'Nobody is watching. The group will respect you more for steady, reliable riding than for anything loud.'],
                ['✕', 'Rigid plans.', 'You will have a sense of the route. Conditions will revise it. This is not a failure. It\'s the terrain doing its job.'],
                ['✕', 'Constant documentation mode.', 'Phones mostly away. Some moments are intentionally undocumented. What you remember without a camera is often what actually matters.'],
                ['✕', 'The pace of your regular week.', "Dobrogea doesn't reward urgency. Settle in early and let the horizon work on you."],
              ].map(([num, strong, rest]) => (
                <div key={strong} className={styles.ruleItem}>
                  <span className={styles.ruleNum}>{num}</span>
                  <span className={styles.ruleText}><strong>{strong}</strong> {rest}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 03 — Gear & Packing */}
        <Section num="03" title="Gear & Packing" open={openSections.has('s3')} onToggle={() => toggleSection('s3')}>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>The Principle</div>
            <p>Pack for three days of real riding in variable conditions. Not for a camping expedition. Not for a hotel stay. Three days on the bike, evenings outdoors, practical simplicity.</p>
            <p>If you&apos;re questioning whether you need it — you don&apos;t. Excess weight is honest feedback in Dobrogea.</p>
          </div>

          {/* Progress */}
          <div className={styles.gearProgress}>
            <span className={styles.progressText}>
              Packed: <span className={styles.progressCount}>{checkedCount}</span> / {TOTAL_CHECKABLE} items
            </span>
            <div className={styles.progressBarWrap}>
              <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
            </div>
            <span className={styles.progressText}>{progressPct}%</span>
          </div>

          {/* Checklist */}
          <div className={styles.checklist}>
            {CHECK_GROUPS.map((group) => (
              <React.Fragment key={group.title}>
                <div className={styles.checkGroupTitle}>{group.title}</div>
                {group.items.map((item) => {
                  const isChecked = checked.has(item.id);
                  const cls = [
                    styles.checkItem,
                    item.essential ? styles.checkItemEssential : '',
                    isChecked ? styles.checkItemChecked : '',
                    group.disabled ? styles.checkItemDisabled : '',
                  ].filter(Boolean).join(' ');
                  return (
                    <div
                      key={item.id}
                      className={cls}
                      onClick={group.disabled ? undefined : () => toggleCheck(item.id)}
                    >
                      <div className={styles.checkBox}>
                        <div className={styles.checkTick} />
                      </div>
                      <div className={styles.checkText}>
                        <div className={styles.checkName}>{item.name}</div>
                        {item.note && <div className={styles.checkNote}>{item.note}</div>}
                      </div>
                      {item.essential && <span className={styles.essentialLabel}>Essential</span>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </Section>

        {/* 04 — Group Culture */}
        <Section num="04" title="Group Culture" open={openSections.has('s4')} onToggle={() => toggleSection('s4')}>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>How TRAX Moves</div>
            <p>There is no guide, no sweep, no instructor. Everyone is responsible for themselves and accountable to the group. Those two things are not in conflict — they define how we ride.</p>
            <p>Ego doesn&apos;t survive long out here. Not because anyone polices it. Because the terrain makes it irrelevant.</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>The Rules</div>
            <div className={styles.rulesList}>
              {[
                ['01', 'We wait.', 'Faster riders wait at junctions. We arrive as a group or we\'re not doing it right. Speed is not the currency here.'],
                ['02', 'We signal problems early.', 'If something is wrong — mechanically, physically, mentally — you say it. The group adjusts. Silence is the only thing that creates real problems.'],
                ['03', "We don't perform for cameras.", 'Film what you genuinely want to remember. Don\'t stage it. Don\'t position for the shot. If something real happens, you\'ll know.'],
                ['04', 'We leave terrain as we found it.', 'No shortcuts through private land. No fires without permission. No trace that says "a group was here."'],
                ['05', 'Evenings are not programmed.', 'No schedule after sundown. Food, fire, conversation — whatever comes naturally. If the group goes quiet, let it go quiet. That\'s part of it too.'],
                ['06', 'What happens on TRAX stays on TRAX.', "Stories told around the fire belong to the people who were there. Share your experience — not other people's moments."],
              ].map(([num, strong, rest]) => (
                <div key={num} className={styles.ruleItem}>
                  <span className={styles.ruleNum}>{num}</span>
                  <span className={styles.ruleText}><strong>{strong}</strong> {rest}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.callout}>
            <p>You were confirmed because your attitude aligned. That alignment is what keeps the Collective worth belonging to. Protect it.</p>
          </div>
          <div className={styles.contentBlock}>
            <div className={styles.blockTitle}>Your Artifact</div>
            <p>Every confirmed rider receives the Dobrogea Calling rally jacket — designed specifically for this terrain, this year, this group. It is not sold separately. It is not available after the fact. It exists only because you showed up.</p>
            <p>It will be distributed at the closing of the experience. Not before.</p>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <div className={styles.briefFooter}>
        <div className={styles.footerBrand}>TRAX</div>
        <div className={styles.footerCopy}>
          Dobrogea Calling · May 1–3, 2026<br />
          Confirmed access · Do not share or distribute
        </div>
      </div>
    </div>
  );
}
