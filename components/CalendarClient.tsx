'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, MonoLabel } from '@/components/ui/Typography';

type EventType = 'trax' | 'collective' | 'radar';

interface CalendarEvent {
  date: string;
  name: string;
  location?: string;
  type: EventType;
  href?: string;
  note?: string;
}

interface MonthGroup {
  month: string;
  events: CalendarEvent[];
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const calendar: MonthGroup[] = [
  {
    month: 'March',
    events: [
      { date: '21 Mar', name: 'RAMS Fun Ride', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
    ],
  },
  {
    month: 'April',
    events: [
      { date: '18–19 Apr', name: 'Mixed Terrain Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 1' },
    ],
  },
  {
    month: 'May',
    events: [
      { date: '1–3 May', name: 'Dobrogea Calling', location: 'Dobrogea, Romania', type: 'trax', href: '/dobrogea-calling' },
      { date: '8–10 May', name: 'MotoRide Expo', location: 'Motor Park', type: 'collective', href: 'https://fb.me/e/3rtJMLVM8', note: 'Ride tests from all major motorcycle distributors' },
      { date: '9–10 May', name: 'Adventure Riders Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
    ],
  },
  {
    month: 'June',
    events: [
      { date: '4–7 Jun', name: 'Roadbook Experience 2026', type: 'radar', href: 'https://fb.me/e/5zpeollje' },
      { date: '6–7 Jun', name: 'MX — CE 65/85/W · CB IV · CNIR et. IV', location: 'Ciolpani', type: 'collective', note: 'Campionat European, Campionat Balcanic & Campionat Național de MX', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '10–14 Jun', name: 'Roadbook Adventure Challenge', location: 'Munții Apuseni', type: 'collective', href: 'https://fb.me/e/483N1XZPm' },
      { date: '26–28 Jun', name: 'BMW GS Challenge', location: 'Merei Racing Park', type: 'collective', href: 'https://rideinromania.com/gschallenge/index.html' },
      { date: '27–28 Jun', name: 'Enduro Trail Adventure Challenge', location: 'Apuseni, Cluj', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 2' },
    ],
  },
  {
    month: 'July',
    events: [
      { date: '28 Jul – 1 Aug', name: 'Red Bull Romaniacs', location: 'Sibiu', type: 'radar', href: 'https://www.redbullromaniacs.com/' },
    ],
  },
  {
    month: 'August',
    events: [
      { date: '1–2 Aug', name: 'Aristhrottle', type: 'radar' },
      { date: '5–10 Aug', name: 'Dusty Lizard', type: 'radar', href: 'https://moskomoto.eu/products/dusty-lizard-campout-romania' },
      { date: '14–16 Aug', name: 'Out There', location: 'Romania', type: 'trax', href: '/out-there' },
      { date: '28–30 Aug', name: 'Carpathian Ridge', location: 'Carpathians, Romania', type: 'trax', href: '/carpathian-ridge' },
    ],
  },
  {
    month: 'September',
    events: [
      { date: '5–6 Sep', name: 'Hard Adventure Challenge', location: 'Cheile Grădiștei, Brașov', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 3' },
      { date: '26–27 Sep', name: 'MT Teams Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 4' },
    ],
  },
  {
    month: 'October',
    events: [
      { date: '9–11 Oct', name: 'Campionatul Național de Motocross — Etapă', location: 'TCS Racing Park, Bucharest', type: 'collective', note: 'Etapă din Campionatul Național de Motocross, sezonul 2026', href: 'https://tcsracingpark.ro/calendar/#' },
    ],
  },
  {
    month: 'November',
    events: [
      { date: '14 Nov', name: 'The Ground', location: 'TCS Racing Park, Bucharest', type: 'trax', href: '/the-ground' },
    ],
  },
];

// Extract the first day number from a date string
function getStartDay(dateStr: string): number {
  const m = dateStr.match(/\d+/);
  return m ? parseInt(m[0]) : 1;
}

// Extract the last day number within the given month
function getEndDay(dateStr: string, monthName: string): number {
  const idx = MONTH_NAMES.indexOf(monthName);
  const daysInMonth = new Date(2026, idx + 1, 0).getDate();
  // Cross-month span e.g. "28 Jul – 1 Aug" — cap at month end
  if (dateStr.includes(' – ')) return daysInMonth;
  // Same-month range e.g. "18–19 Apr"
  const rangeMatch = dateStr.match(/\d+[–-](\d+)/);
  if (rangeMatch) return parseInt(rangeMatch[1]);
  return getStartDay(dateStr);
}

function EventLink({ event, children }: { event: CalendarEvent; children: React.ReactNode }) {
  if (!event.href) return <>{children}</>;
  if (event.href.startsWith('http')) {
    return <a href={event.href} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <Link href={event.href}>{children}</Link>;
}

// ─── LIST VIEW ────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: CalendarEvent }) {
  const isTrax = event.type === 'trax';
  const isRadar = event.type === 'radar';

  const borderClass = isTrax
    ? 'border-l-trax-red hover:bg-trax-red/5'
    : isRadar
    ? 'border-l-trax-grey/25 hover:border-l-trax-grey/50'
    : 'border-l-trax-grey/50 hover:border-l-trax-white/40';

  const rowOpacity = isRadar ? 'opacity-60 hover:opacity-85 transition-opacity' : '';

  const nameClass = isTrax
    ? 'text-trax-white group-hover:text-trax-red'
    : isRadar
    ? 'text-trax-white/60 group-hover:text-trax-white/80'
    : 'text-trax-white group-hover:text-trax-white';

  const inner = (
    <div
      className={`
        group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8
        py-6 border-b border-trax-grey/10 border-l-2 pl-6
        transition-all duration-300
        ${borderClass} ${rowOpacity}
        ${event.href ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Date */}
      <div className="flex-shrink-0 sm:w-44">
        <span className="font-mono text-sm text-trax-white/60 uppercase tracking-widest">
          {event.date}
        </span>
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className={`font-sans text-xl font-medium leading-snug mb-1 transition-colors duration-200 ${nameClass}`}>
          {event.name}
          {event.href && (
            <span className="ml-3 text-trax-red font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
          )}
        </p>
        {event.location && (
          <p className="font-mono text-xs text-trax-grey/50 uppercase tracking-widest mt-1">
            {event.location}
          </p>
        )}
        {event.note && (
          <p className="font-body text-sm text-trax-grey/50 italic mt-1">{event.note}</p>
        )}
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        {isTrax ? (
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-trax-red border border-trax-red/40 px-2 py-1">
            TRAX Experience
          </span>
        ) : isRadar ? (
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-trax-grey/40 border border-trax-grey/15 px-2 py-1">
            On the Radar
          </span>
        ) : (
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-trax-grey/70 border border-trax-grey/30 px-2 py-1">
            Collective Joins
          </span>
        )}
      </div>
    </div>
  );

  return <EventLink event={event}>{inner}</EventLink>;
}

function ListView() {
  return (
    <div className="space-y-16">
      {calendar.map((group) => (
        <div key={group.month}>
          <div className="flex items-center gap-6 mb-1">
            <h2 className="font-sans text-3xl md:text-4xl font-medium text-trax-white/20 select-none w-44 flex-shrink-0">
              {group.month}
            </h2>
            <div className="flex-1 h-[1px] bg-trax-grey/10" />
          </div>
          <div>
            {group.events.map((event, idx) => (
              <EventRow key={idx} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GRID VIEW ────────────────────────────────────────────────────────────────

function EventChip({ event, monthName }: { event: CalendarEvent; monthName: string }) {
  const endDay = getEndDay(event.date, monthName);
  const startDay = getStartDay(event.date);
  const span = endDay - startDay + 1;

  const chipClass =
    event.type === 'trax'
      ? 'bg-trax-red/20 text-trax-red border-l-2 border-trax-red'
      : event.type === 'radar'
      ? 'bg-trax-grey/5 text-trax-grey/40 border-l border-trax-grey/20'
      : 'bg-trax-white/8 text-trax-white/70 border-l border-trax-grey/35';

  const label = event.name.split(/\s+/).slice(0, 3).join(' ');

  const chip = (
    <div
      className={`mt-[3px] px-1 py-[2px] text-[9px] font-mono truncate leading-tight rounded-[1px] ${chipClass} hover:opacity-80 transition-opacity`}
      title={event.name}
    >
      {label}
      {span > 1 && <span className="opacity-60 ml-1">+{span - 1}d</span>}
    </div>
  );

  return <EventLink event={event}>{chip}</EventLink>;
}

function MonthGrid({ group }: { group: MonthGroup }) {
  const monthIndex = MONTH_NAMES.indexOf(group.month);
  const firstDayJs = new Date(2026, monthIndex, 1).getDay(); // 0=Sun
  const firstDayMon = (firstDayJs + 6) % 7; // 0=Mon
  const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  for (const event of group.events) {
    const startDay = getStartDay(event.date);
    if (!eventsByDay[startDay]) eventsByDay[startDay] = [];
    eventsByDay[startDay].push(event);
  }

  return (
    <div className="border border-trax-grey/15 p-4 md:p-5">
      <h3 className="font-mono text-xs uppercase tracking-widest text-trax-white/40 mb-4">
        {group.month} 2026
      </h3>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-trax-grey/25 uppercase tracking-wider pb-2">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayMon }).map((_, i) => (
          <div key={`e-${i}`} className="min-h-[44px]" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const events = eventsByDay[day] ?? [];
          const hasEvents = events.length > 0;

          return (
            <div
              key={day}
              className={`min-h-[44px] p-[3px] border-t border-trax-grey/8 ${hasEvents ? 'border-t-trax-grey/20' : ''}`}
            >
              <span
                className={`block font-mono text-[11px] leading-none mb-[2px] ${
                  hasEvents ? 'text-trax-white/80' : 'text-trax-grey/20'
                }`}
              >
                {day}
              </span>
              {events.map((event, idx) => (
                <EventChip key={idx} event={event} monthName={group.month} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GridView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {calendar.map((group) => (
        <MonthGrid key={group.month} group={group} />
      ))}
    </div>
  );
}

// ─── LEGEND ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-3">
        <span className="w-4 h-[2px] bg-trax-red" />
        <span className="font-mono text-xs text-trax-red uppercase tracking-widest">TRAX Experience</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-4 h-[2px] bg-trax-grey/50" />
        <span className="font-mono text-xs text-trax-grey/70 uppercase tracking-widest">Collective Joins</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-4 h-[2px] bg-trax-grey/20" />
        <span className="font-mono text-xs text-trax-grey/40 uppercase tracking-widest">On the Radar</span>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function CalendarClient() {
  const [view, setView] = useState<'list' | 'grid'>('list');

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Container>
        <MonoLabel className="mb-8 block">2026 Season</MonoLabel>
        <Headline className="mb-4 max-w-3xl">Where the Collective Will Be</Headline>
        <p className="font-body text-trax-grey text-lg max-w-2xl mb-8 leading-relaxed">
          Three kinds of entries. TRAX experiences are designed and led by TRAX.
          Collective events are where we ride alongside — as participants, observers, and culture carriers.
          On the Radar events are worth knowing about, but the Collective won't be there.
        </p>

        {/* View toggle + legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-2">
          <Legend />
          <div className="flex border border-trax-grey/20 w-fit">
            <button
              onClick={() => setView('list')}
              className={`font-mono text-xs uppercase tracking-widest px-5 py-2 transition-colors duration-200 ${
                view === 'list'
                  ? 'bg-trax-white text-trax-black'
                  : 'text-trax-grey/60 hover:text-trax-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('grid')}
              className={`font-mono text-xs uppercase tracking-widest px-5 py-2 transition-colors duration-200 border-l border-trax-grey/20 ${
                view === 'grid'
                  ? 'bg-trax-white text-trax-black'
                  : 'text-trax-grey/60 hover:text-trax-white'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        <Spacer size="lg" />

        {view === 'list' ? <ListView /> : <GridView />}

        <Spacer size="xl" />

        <div className="border-t border-trax-grey/20 pt-12">
          <p className="font-mono text-xs text-trax-grey/40 uppercase tracking-widest max-w-lg leading-relaxed">
            External events are not organized by TRAX. Dates subject to change.
            TRAX experiences require access request.
          </p>
        </div>
      </Container>
    </div>
  );
}
