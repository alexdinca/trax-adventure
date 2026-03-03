import type { Metadata } from 'next';
import { ExperiencesClient } from '@/components/ExperiencesClient';

export const metadata: Metadata = {
  title: 'TRAX Experiences — A progression system, not a menu',
  description: 'Five levels. Each with a role. Each earned. From The Ground to The Long Way In.',
  alternates: { canonical: 'https://ridetrax.eu/experiences' },
  openGraph: {
    title: 'TRAX Experiences — A progression system, not a menu',
    description: 'Five levels. Each with a role. Each earned.',
    url: 'https://ridetrax.eu/experiences',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

export default function ExperiencesPage() {
  return <ExperiencesClient />;
}
