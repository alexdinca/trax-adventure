import type { Metadata } from 'next';
import { ExperiencesClient } from '@/components/ExperiencesClient';
import { experiences } from '@/lib/experiences-data';

export const metadata: Metadata = {
  title: 'TRAX Experiences · A progression system, not a menu',
  description: 'Five levels. Each with a role. Each earned. From The Ground to The Long Way In.',
  alternates: { canonical: 'https://ridetrax.eu/experiences' },
  openGraph: {
    title: 'TRAX Experiences · A progression system, not a menu',
    description: 'Five levels. Each with a role. Each earned.',
    url: 'https://ridetrax.eu/experiences',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

const experiencesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'TRAX Off-Road Motorcycle Experiences · Romania',
  description: 'Five terrain-led motorcycle experiences across Romania. Each level earned, not purchased.',
  url: 'https://ridetrax.eu/experiences',
  numberOfItems: experiences.length,
  itemListElement: experiences.map((e, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'TouristTrip',
      name: e.name,
      description: e.description,
      url: `https://ridetrax.eu${e.href}`,
      touristType: 'Off-road motorcycle rider',
      itinerary: {
        '@type': 'ItemList',
        name: e.name,
        numberOfItems: 1,
      },
      provider: { '@type': 'Organization', name: 'TRAX', url: 'https://ridetrax.eu' },
      ...(e.startDate ? { startDate: e.startDate } : {}),
      ...(e.endDate ? { endDate: e.endDate } : {}),
      location: { '@type': 'Place', name: e.location, address: { '@type': 'PostalAddress', addressCountry: 'RO' } },
    },
  })),
};

export default function ExperiencesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experiencesSchema) }}
      />
      <ExperiencesClient />
    </>
  );
}
