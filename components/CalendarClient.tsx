'use client';
import React from 'react';
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

const calendar: MonthGroup[] = [
  {
    month: 'March',
    events: [
      { date: '21 Mar', name: 'RAMS Fun Ride', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '28–29 Mar', name: 'MX CB/CNIR et. I', location: 'Oltenia Racing Park, Balș', type: 'radar' },
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
      { date: '8–10 May', name: 'MotoRide Expo', location: 'Motor Park', type: 'radar', href: 'https://fb.me/e/3rtJMLVM8', note: 'Ride tests from all major motorcycle distributors' },
      { date: '9–10 May', name: 'Adventure Riders Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '17 May', name: 'Distinguished Gentleman\'s Ride', location: 'Bucharest', type: 'collective', href: 'https://www.gentlemansride.com/rides/romania/bucharest' },
      { date: '29 May', name: 'Pîr - Pîr - Poc, ediția 2026', location: 'Corbu', type: 'radar', href: 'https://www.facebook.com/events/1606159840719049' },
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
      { date: '1–2 Aug', name: 'Aristhrottle', location: 'Iași', type: 'radar', href: 'https://www.aristhrottle.ro/evenimente/' },
      { date: '5–10 Aug', name: 'Dusty Lizard', location: 'Apuseni', type: 'radar', href: 'https://moskomoto.eu/products/dusty-lizard-campout-romania' },
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

function EventLink({ event, children }: { event: CalendarEvent; children: React.ReactNode }) {
  if (!event.href) return <>{children}</>;
  if (event.href.startsWith('http')) {
    return <a href={event.href} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <Link href={event.href}>{children}</Link>;
}

function EventRow({ event }: { event: CalendarEvent }) {
  const isTrax = event.type === 'trax';
  const isCollective = event.type === 'collective';

  const borderClass = isTrax
    ? 'border-l-trax-red hover:bg-trax-red/5'
    : 'border-l-trax-white/40 hover:border-l-trax-white/70';

  const nameClass = isTrax
    ? 'text-trax-white group-hover:text-trax-red'
    : 'text-trax-white group-hover:text-trax-white';

  const inner = (
    <div
      className={`
        group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8
        py-6 border-b border-trax-grey/10 border-l-2 pl-6
        transition-all duration-300
        ${borderClass}
        ${event.href ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
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
