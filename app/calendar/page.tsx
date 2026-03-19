import type { Metadata } from 'next';
import { CalendarClient } from '@/components/CalendarClient';

export const metadata: Metadata = {
  title: 'Calendar 2026',
  description: 'All TRAX off-road motorcycle experiences and collective events in 2026. Dates, types, and availability for enduro rides, multi-day terrain experiences, and collective rides across Romania — Dobrogea, Carpathians, and beyond.',
  alternates: { canonical: 'https://ridetrax.eu/calendar' },
  openGraph: {
    title: 'Calendar 2026 — TRAX',
    description: 'All TRAX off-road motorcycle experiences and collective events in 2026. Dates, types, and availability for rides across Romania — Dobrogea, Carpathians, and beyond.',
    url: 'https://ridetrax.eu/calendar',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
