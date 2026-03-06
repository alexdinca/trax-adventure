import type { Metadata } from 'next';
import { CalendarClient } from '@/components/CalendarClient';

export const metadata: Metadata = {
  title: 'Calendar 2026 — TRAX',
  description: 'TRAX experiences and collective events for 2026. Romania adventure riding calendar.',
  alternates: { canonical: 'https://ridetrax.eu/calendar' },
  openGraph: {
    title: 'Calendar 2026 — TRAX',
    description: 'TRAX experiences and collective events for 2026.',
    url: 'https://ridetrax.eu/calendar',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
