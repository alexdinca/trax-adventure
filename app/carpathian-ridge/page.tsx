import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';

export const metadata: Metadata = {
  title: 'Carpathian Ridge — TRAX Adventure',
  description: 'Three days of sustained mountain riding in the Carpathians. Technical terrain, fatigue as design, honest mountains. A test of skill and endurance.',
  alternates: { canonical: 'https://ridetrax.eu/carpathian-ridge' },
  openGraph: {
    title: 'Carpathian Ridge — TRAX',
    description: 'Challenge yourself with sustained mountain riding across technical Carpathian terrain.',
    url: 'https://ridetrax.eu/carpathian-ridge',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Carpathian Ridge',
  description: 'Three days of sustained technical mountain riding in the Romanian Carpathians. Fatigue as design. Honest mountains.',
  startDate: '2026-08-28',
  endDate: '2026-08-30',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: { '@type': 'Place', name: 'Carpathian Mountains, Sibiu area, Romania', address: { '@type': 'PostalAddress', addressCountry: 'RO', addressRegion: 'Sibiu' } },
  organizer: { '@type': 'Organization', name: 'TRAX', url: 'https://ridetrax.eu' },
  image: 'https://ridetrax.eu/android-chrome-512x512.png',
  url: 'https://ridetrax.eu/carpathian-ridge',
};

export default function CarpathianRidgePage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/trax landscape.png" alt="Carpathian landscapes" fill className="object-cover trax-image opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · Romania</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">Carpathian Ridge</h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">An endurance, not an escape.</p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <MonoLabel className="mb-6 block">Where the mountains decide</MonoLabel>
            <Body className="text-xl md:text-2xl leading-relaxed">
              <span className="text-trax-red font-medium">Carpathian Ridge</span> is a TRAX experience set high in the Romanian Carpathians — built around <span className="text-trax-red font-medium">sustained effort</span>, <span className="text-trax-red font-medium">technical terrain</span>, and the quiet pressure that only mountains apply.
            </Body>
          </div>
          <div>
            <Spacer size="sm" />
            <Body className="mb-6">This is not a showcase. It's a commitment.</Body>
            <Body className="text-trax-grey text-sm">28th – 30th of August · Sibiu area, Romania</Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* Why */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start border-t border-trax-grey/20 pt-16 mb-16">
          <div>
            <MonoLabel className="mb-4 block">The Character</MonoLabel>
            <SubHeadline>Why the Carpathians</SubHeadline>
          </div>
          <div>
            <Body className="mb-6">The Carpathians don't impress loudly.<span className="text-trax-red font-medium"> They wear you down.</span></Body>
            <Body className="mb-6"><span className="text-trax-red font-medium">Long forest climbs.</span> <span className="text-trax-red font-medium">Narrow ridgelines.</span> Trails that punish impatience. Weather that changes the rules.</Body>
            <Body className="mb-6">These are the same mountains and trails that hosted the <span className="text-trax-red">KTM Europe Adventure Rally 2025</span> — not because they are friendly, but because they are honest.</Body>
            <Body>Here, skill matters.<span className="text-trax-red font-medium"> So does judgment.</span></Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* What Is / What Is Not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-trax-grey/20 pt-16">
          <div>
            <SubHeadline className="text-trax-white">What This Experience Is</SubHeadline>
            <div className="space-y-12 mt-8">
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Sustained Mountain Riding</h4>
                <Body>This is not about one hard section. It's about <span className="text-trax-red font-medium">three days of consistency.</span> Expect forest and alpine trails, long technical climbs, rocky descents, and changing grip and altitude. Pace is deliberate. Fatigue is part of the design.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Tested Limits</h4>
                <Body>Carpathian Ridge is where riders meet physical fatigue, mental load, and decision-making under pressure. You don't conquer this terrain. You adapt to it.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Shared Responsibility</h4>
                <Body>The mountains don't allow shortcuts. We ride as a group. We manage risk together. We finish together. Strength here isn't loud. It's reliable.</Body>
              </div>
            </div>
          </div>
          <div className="bg-trax-white/5 p-8 md:p-12 h-fit">
            <SubHeadline className="text-trax-grey">What This Is Not</SubHeadline>
            <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
              {['Not a race', 'Not a guided tour', 'Not a training camp', 'Not an endurance contest'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> {item}</li>
              ))}
            </ul>
            <p className="mt-8 font-body text-trax-white opacity-60 italic">This is not about proving something to others.</p>
          </div>
        </div>

        <Spacer size="lg" />

        {/* Who & Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <MonoLabel className="mb-4 block">The Filter</MonoLabel>
            <SubHeadline>Who This Is For</SubHeadline>
            <ul className="space-y-4 font-body text-trax-white/80 mt-6">
              {['are comfortable riding tired', 'can manage their bike in technical terrain', 'respect mountain conditions', 'understand group discipline'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-trax-grey text-sm">This experience assumes <span className="text-trax-red">solid off-road competence.</span> Mindset matters more than speed.</p>
          </div>
          <div className="md:col-span-2 md:pl-12 border-l border-trax-grey/20">
            <MonoLabel className="mb-4 block">The Flow</MonoLabel>
            <SubHeadline>The Rhythm</SubHeadline>
            <div className="space-y-8 mt-8">
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Days</h4>
                <Body>Start early. Terrain sets the pace. Plans exist — but mountains revise them.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Evenings</h4>
                <Body>Quiet. Recovery matters. Stories are short. Sleep is earned.</Body>
              </div>
            </div>
          </div>
        </div>

        <Spacer size="xl" />

        <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
          <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
          <p className="font-body text-xl md:text-2xl text-trax-white mb-8">This experience is intentionally limited.</p>
          <Body className="mx-auto mb-8">There is no public booking flow. No promises beyond the terrain itself.</Body>
          <WhatsAppCTA label="Ridge out" source="carpathian_ridge_page" />
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#CarpathianRidge</p>
        </div>
      </Container>
    </div>
  );
}
