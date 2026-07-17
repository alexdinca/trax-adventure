import type { Metadata } from 'next';
import { CalendarClient } from '@/components/CalendarClient';
import { getAllEvents } from '@/lib/calendar-data';

export const metadata: Metadata = {
  title: 'Calendar 2026',
  description: 'All TRAX off-road motorcycle experiences and collective events in 2026. Dates, types, and access for enduro rides, multi-day terrain experiences, and collective rides across Romania, Dobrogea, Carpathians, and beyond.',
  alternates: { canonical: 'https://ridetrax.eu/calendar' },
  openGraph: {
    title: 'Calendar 2026 · TRAX',
    description: 'All TRAX off-road motorcycle experiences and collective events in 2026. Dates, types, and access for rides across Romania, Dobrogea, Carpathians, and beyond.',
    url: 'https://ridetrax.eu/calendar',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

function buildCalendarSchema() {
  const events = getAllEvents();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TRAX 2026 Calendar: Off-Road Motorcycle Events Romania',
    description: 'All TRAX experiences, collective rides, and radar events for the 2026 season.',
    url: 'https://ridetrax.eu/calendar',
    numberOfItems: events.length,
    itemListElement: events.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SportsEvent',
        name: e.name,
        startDate: e.startDate,
        ...(e.endDate ? { endDate: e.endDate } : {}),
        ...(e.location ? { location: { '@type': 'Place', name: e.location } } : {}),
        url: e.href
          ? e.href.startsWith('http') ? e.href : `https://ridetrax.eu${e.href}`
          : 'https://ridetrax.eu/calendar',
        ...(e.type === 'trax' ? {
          organizer: { '@type': 'Organization', name: 'TRAX', url: 'https://ridetrax.eu' },
        } : {}),
        sport: 'Motorcycle off-road / Enduro',
        eventStatus: 'https://schema.org/EventScheduled',
      },
    })),
  };
}

export default function CalendarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCalendarSchema()) }}
      />
      <CalendarClient />
    </>
  );
}
