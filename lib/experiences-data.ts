export interface Experience {
  slug: string;
  name: string;
  location: string;
  country: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  description: string;
  longDescription: string;
  image: string;
  href: string;
  duration: string;
  distanceKm?: number;
  offRoadPercent?: number;
  level: 'intro' | 'intermediate' | 'advanced' | 'expert' | 'multiday';
  status: 'active' | 'upcoming' | 'tbd';
}

export const experiences: Experience[] = [
  {
    slug: 'dobrogea-calling',
    name: 'Dobrogea Calling',
    location: 'Dobrogea, Romania',
    country: 'RO',
    dates: '1st – 3rd May 2026',
    startDate: '2026-05-01',
    endDate: '2026-05-03',
    description: '650km across Dobrogea. Ancient terrain, quiet effort, shared discovery. No tour guides, no performance metrics.',
    longDescription: 'Three days through the oldest terrain in Romania. Dobrogea sits east of everything, between the Danube and the Black Sea, shaped by centuries of wind and water. TRAX navigates it without shortcuts — flat limestone plateaus, gorges, river deltas, and long gravel roads that end at places you don\'t find on tourist maps.',
    image: '/assets/dobrogea.jpg',
    href: '/dobrogea-calling',
    duration: '3 days',
    distanceKm: 650,
    level: 'intermediate',
    status: 'active',
  },
  {
    slug: 'out-there',
    name: 'Out There',
    location: 'Romania',
    country: 'RO',
    dates: '14th – 16th August 2026',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    description: 'Self-supported off-road riding and remote camping. Ride remote, camp without infrastructure, live intentionally off the bike.',
    longDescription: 'A three-day self-supported expedition into remote terrain. No hotels, no support vehicles, no pre-arranged stops. Riders carry what they need. Camp where it makes sense. The experience is built around the gap between what you brought and what the terrain asks for.',
    image: '/assets/trax landscape.png',
    href: '/out-there',
    duration: '3 days',
    level: 'advanced',
    status: 'active',
  },
  {
    slug: 'carpathian-ridge',
    name: 'Carpathian Ridge',
    location: 'Carpathians, Romania',
    country: 'RO',
    dates: '28th – 30th August 2026',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    description: 'Three days of sustained mountain riding in the Carpathians. Fatigue as design. Technical terrain. Honest mountains.',
    longDescription: 'The Carpathians don\'t reward speed. They reward patience, line choice, and a willingness to be genuinely uncomfortable. This three-day experience follows high-altitude ridge trails with long technical sections, significant elevation, and no flat recovery days.',
    image: '/assets/trax landscape.png',
    href: '/carpathian-ridge',
    duration: '3 days',
    level: 'advanced',
    status: 'active',
  },
  {
    slug: 'the-ground',
    name: 'The Ground',
    location: 'TCS Racing Park, Bucharest',
    country: 'RO',
    dates: '14th November 2026',
    startDate: '2026-11-14',
    description: 'One year since the first TRAX gathering. A return to where it began. Open training day at TCS Racing Park.',
    longDescription: 'The Ground is where the TRAX collective started — a training day at TCS Racing Park in Bucharest. Not a competition. Not a race. A shared day of learning, technical practice, and connection with the same people who show up when the terrain gets difficult.',
    image: '/assets/trax landscape.png',
    href: '/the-ground',
    duration: '1 day',
    level: 'intro',
    status: 'active',
  },
  {
    slug: 'long-way-in',
    name: 'The Long Way In',
    location: 'ACT Romania — Maramureș to Transfăgărășan',
    country: 'RO',
    dates: 'TBD',
    description: '1370km across ACT Romania. Maramureș to Transfăgărășan. 45% off-road. Self-supported. No shortcuts.',
    longDescription: 'The longest TRAX experience. Five days of sustained riding across the ACT Romania route — Adventure Crossing Transylvania. From Maramureș in the north to the Transfăgărășan in the south. 45% off-road. Self-supported with minimal logistics. This is for riders who have earned it.',
    image: '/assets/trax landscape.png',
    href: '/long-way-in',
    duration: '5 days',
    distanceKm: 1370,
    offRoadPercent: 45,
    level: 'expert',
    status: 'upcoming',
  },
];

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

export function getActiveExperiences(): Experience[] {
  return experiences.filter((e) => e.status === 'active');
}
