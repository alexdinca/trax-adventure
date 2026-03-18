'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAptabase } from '@aptabase/react';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, MonoLabel } from '@/components/ui/Typography';

type EventType = 'trax' | 'collective' | 'radar';

interface CalendarEvent {
  date: string;
  startDate: string;
  endDate?: string;
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

const calendar: MonthGroup[] = [
  {
    month: 'March',
    events: [
      { date: '21 Mar', startDate: '2026-03-21', name: 'RAMS Fun Ride', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://www.facebook.com/events/2382350788899928' },
      { date: '28–29 Mar', startDate: '2026-03-28', endDate: '2026-03-29', name: 'MX CB/CNIR et. I', location: 'Oltenia Racing Park, Balș', type: 'collective', href: 'https://www.facebook.com/events/1071308521695584' },
    ],
  },
  {
    month: 'April',
    events: [
      { date: '18–19 Apr', startDate: '2026-04-18', endDate: '2026-04-19', name: 'Mixed Terrain Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 1' },
    ],
  },
  {
    month: 'May',
    events: [
      { date: '1–3 May', startDate: '2026-05-01', endDate: '2026-05-03', name: 'Dobrogea Calling', location: 'Dobrogea, Romania', type: 'trax', href: '/dobrogea-calling' },
      { date: '8–10 May', startDate: '2026-05-08', endDate: '2026-05-10', name: 'MotoRide Expo', location: 'Motor Park', type: 'radar', href: 'https://fb.me/e/3rtJMLVM8', note: 'Ride tests from all major motorcycle distributors' },
      { date: '9–10 May', startDate: '2026-05-09', endDate: '2026-05-10', name: 'Adventure Riders Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '14–17 May', startDate: '2026-05-14', endDate: '2026-05-17', name: 'Trails Adventure Camp', location: 'Vatra Dornei, Romania', type: 'radar', href: 'https://www.facebook.com/events/1944537056152121' },
      { date: '17 May', startDate: '2026-05-17', name: "Distinguished Gentleman's Ride", location: 'Bucharest', type: 'collective', href: 'https://www.gentlemansride.com/rides/romania/bucharest' },
      { date: '21–24 May', startDate: '2026-05-21', endDate: '2026-05-24', name: 'Treasure Hunt Țara Călățelului, ediția 3', location: 'Sâncraiu, Cluj', type: 'radar', href: 'https://fb.me/e/edxx6q1Us' },
      { date: '22 May', startDate: '2026-05-22', name: 'Moto24 Adventure Camp – Ride & Social 2026', location: 'Hotel TTS Covasna', type: 'radar', href: 'https://fb.me/e/5DIoTJCr7' },
      { date: '29 May', startDate: '2026-05-29', name: 'Pîr - Pîr - Poc, ediția 2026', location: 'Corbu', type: 'radar', href: 'https://www.facebook.com/events/1606159840719049' },
    ],
  },
  {
    month: 'June',
    events: [
      { date: '4–7 Jun', startDate: '2026-06-04', endDate: '2026-06-07', name: 'Roadbook Experience 2026', type: 'radar', href: 'https://fb.me/e/5zpeollje' },
      { date: '6–7 Jun', startDate: '2026-06-06', endDate: '2026-06-07', name: 'MX — CE 65/85/W · CB IV · CNIR et. IV', location: 'Ciolpani', type: 'collective', note: 'Campionat European, Campionat Balcanic & Campionat Național de MX', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '10–14 Jun', startDate: '2026-06-10', endDate: '2026-06-14', name: 'Roadbook Adventure Challenge', location: 'Munții Apuseni', type: 'collective', href: 'https://fb.me/e/483N1XZPm' },
      { date: '26–28 Jun', startDate: '2026-06-26', endDate: '2026-06-28', name: 'BMW GS Challenge', location: 'Merei Racing Park', type: 'collective', href: 'https://rideinromania.com/gschallenge/index.html' },
      { date: '27–28 Jun', startDate: '2026-06-27', endDate: '2026-06-28', name: 'Enduro Trail Adventure Challenge', location: 'Apuseni, Cluj', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 2' },
    ],
  },
  {
    month: 'July',
    events: [
      { date: '10–18 Jul', startDate: '2026-07-10', endDate: '2026-07-18', name: 'RoRallyMarathon', location: 'Râmnicu Sărat, Romania', type: 'radar', href: 'https://www.facebook.com/RoRallyMarathon' },
      { date: '28 Jul – 1 Aug', startDate: '2026-07-28', endDate: '2026-08-01', name: 'Red Bull Romaniacs', location: 'Sibiu', type: 'radar', href: 'https://www.redbullromaniacs.com/' },
    ],
  },
  {
    month: 'August',
    events: [
      { date: '1–2 Aug', startDate: '2026-08-01', endDate: '2026-08-02', name: 'Aristhrottle', location: 'Iași', type: 'radar', href: 'https://www.aristhrottle.ro/evenimente/' },
      { date: '5–10 Aug', startDate: '2026-08-05', endDate: '2026-08-10', name: 'Dusty Lizard', location: 'Apuseni', type: 'radar', href: 'https://moskomoto.eu/products/dusty-lizard-campout-romania' },
      { date: '14–16 Aug', startDate: '2026-08-14', endDate: '2026-08-16', name: 'Out There', location: 'Romania', type: 'trax', href: '/out-there' },
      { date: '28–30 Aug', startDate: '2026-08-28', endDate: '2026-08-30', name: 'Carpathian Ridge', location: 'Carpathians, Romania', type: 'trax', href: '/carpathian-ridge' },
    ],
  },
  {
    month: 'September',
    events: [
      { date: '5–6 Sep', startDate: '2026-09-05', endDate: '2026-09-06', name: 'Hard Adventure Challenge', location: 'Cheile Grădiștei, Brașov', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 3' },
      { date: '26–27 Sep', startDate: '2026-09-26', endDate: '2026-09-27', name: 'MT Teams Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 4' },
    ],
  },
  {
    month: 'October',
    events: [
      { date: '9–11 Oct', startDate: '2026-10-09', endDate: '2026-10-11', name: 'Campionatul Național de Motocross — Etapă', location: 'TCS Racing Park, Bucharest', type: 'collective', note: 'Etapă din Campionatul Național de Motocross, sezonul 2026', href: 'https://tcsracingpark.ro/calendar/#' },
    ],
  },
  {
    month: 'November',
    events: [
      { date: '14 Nov', startDate: '2026-11-14', name: 'The Ground', location: 'TCS Racing Park, Bucharest', type: 'trax', href: '/the-ground' },
    ],
  },
];

// --- Calendar utilities ---

function toICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

function nextDayICS(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function generateICS(event: CalendarEvent): void {
  const start = toICSDate(event.startDate);
  const end = nextDayICS(event.endDate ?? event.startDate);
  const url = event.href
    ? event.href.startsWith('http') ? event.href : `https://ridetrax.eu${event.href}`
    : 'https://ridetrax.eu/calendar';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TRAX//Calendar//EN',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${event.name}`,
  ];
  if (event.location) lines.push(`LOCATION:${event.location}`);
  lines.push(`URL:${url}`);
  if (event.note) lines.push(`DESCRIPTION:${event.note}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  // On iOS Safari, omitting download lets the browser hand off to Calendar directly.
  // On other platforms, set download to trigger a file save.
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isIOS) {
    a.download = `${event.name.replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_')}.ics`;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

function googleCalendarUrl(event: CalendarEvent): string {
  const start = toICSDate(event.startDate);
  const end = nextDayICS(event.endDate ?? event.startDate);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${start}/${end}`,
  });
  if (event.location) params.set('location', event.location);
  if (event.note) params.set('details', event.note);
  return `https://calendar.google.com/calendar/render?${params}`;
}

// --- Components ---

function AddToCalendar({ event }: { event: CalendarEvent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAptabase();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-trax-white/30 hover:text-trax-white/70 transition-all px-2 py-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
        title="Add to calendar"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="1" y="2" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 5h12" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M7 8v3M5.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span className="hidden sm:inline">Save</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-[#111] border border-trax-white/15 min-w-[160px] py-1">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { trackEvent('calendar_save_google', { name: event.name, type: event.type }); setOpen(false); }}
            className="block px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-trax-white/70 hover:text-trax-white hover:bg-trax-white/5 transition-colors"
          >
            Google Calendar
          </a>
          <button
            onClick={() => { trackEvent('calendar_save_ics', { name: event.name, type: event.type }); generateICS(event); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-trax-white/70 hover:text-trax-white hover:bg-trax-white/5 transition-colors"
          >
            Apple / ICS
            <span className="block normal-case tracking-normal text-trax-white/30 text-[10px] mt-0.5">Safari on iOS recommended</span>
          </button>
        </div>
      )}
    </div>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  const { trackEvent } = useAptabase();
  const isTrax = event.type === 'trax';
  const isCollective = event.type === 'collective';
  const handleClick = () => trackEvent('calendar_event_click', { name: event.name, type: event.type, date: event.startDate });

  const borderClass = isTrax
    ? 'border-l-trax-red hover:bg-trax-red/5'
    : 'border-l-trax-white/40 hover:border-l-trax-white/70';

  const nameClass = isTrax
    ? 'text-trax-white group-hover:text-trax-red'
    : 'text-trax-white group-hover:text-trax-white';

  const linkClass = 'flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8';

  const content = (
    <>
      {/* Date */}
      <div className="flex-shrink-0 sm:w-44">
        <span className="font-mono text-sm text-trax-white/80 uppercase tracking-widest">
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
          <p className="font-mono text-xs text-trax-grey/75 uppercase tracking-widest mt-1">
            {event.location}
          </p>
        )}
        {event.note && (
          <p className="font-body text-sm text-trax-grey/70 italic mt-1">{event.note}</p>
        )}
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        {isTrax ? (
          <span className="inline-block font-mono text-[15px] uppercase tracking-widest text-trax-red border border-trax-red/60 px-3 py-1">
            TRAX Experience
          </span>
        ) : isCollective ? (
          <span className="inline-block font-mono text-[15px] uppercase tracking-widest text-trax-white border border-trax-white/50 px-3 py-1">
            TRAX Will Join
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div
      className={`
        group flex items-center gap-2
        py-6 border-b border-trax-grey/10 border-l-2 pl-6
        transition-all duration-300
        ${borderClass}
      `}
    >
      {event.href ? (
        event.href.startsWith('http') ? (
          <a href={event.href} target="_blank" rel="noopener noreferrer" className={linkClass} onClick={handleClick}>
            {content}
          </a>
        ) : (
          <Link href={event.href} className={linkClass} onClick={handleClick}>
            {content}
          </Link>
        )
      ) : (
        <div className={linkClass}>
          {content}
        </div>
      )}
      <AddToCalendar event={event} />
    </div>
  );
}

function ListView() {
  return (
    <div className="space-y-16">
      {calendar.map((group) => (
        <div key={group.month}>
          <div className="flex items-center gap-6 mb-1">
            <h2 className="font-sans text-3xl md:text-4xl font-medium text-trax-white/40 select-none w-44 flex-shrink-0">
              {group.month}
            </h2>
            <div className="flex-1 h-[1px] bg-trax-grey/25" />
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


export function CalendarClient() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <Container>
        <MonoLabel className="mb-8 block">2026 Season</MonoLabel>
        <Headline className="mb-6 max-w-3xl">Where the Collective Will Be</Headline>
        <p className="font-body text-trax-white/70 text-lg max-w-2xl mb-10 leading-relaxed">
          The season is not only about what we build —<br />
          but also about where we show up.
        </p>

        <div className="space-y-6 mb-10 max-w-2xl">
          <div>
            <p className="font-mono text-sm text-trax-red uppercase tracking-widest mb-1">TRAX Experience</p>
            <p className="font-body text-trax-white/70 leading-relaxed">Experiences designed and led by TRAX.<br />Small groups. Intentional terrain. Shared effort.</p>
          </div>
          <div>
            <p className="font-mono text-sm text-trax-white uppercase tracking-widest mb-1">TRAX Will Join</p>
            <p className="font-body text-trax-white/70 leading-relaxed">Events organized by others where members of the TRAX collective ride alongside — as participants, observers, and culture carriers.</p>
          </div>
        </div>

        <Spacer size="lg" />

        <ListView />

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
