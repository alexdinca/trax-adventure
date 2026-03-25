import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { DobrogeaCallingCTA } from '@/components/DobrogeaCallingCTA';

export const metadata: Metadata = {
  title: 'Dobrogea Calling — TRAX Adventure',
  description: '766km exploration of ancient Dobrogean terrain. 3 days of shared effort across quiet wilderness, no tour guides, no performance metrics. An exploration, not an event.',
  alternates: { canonical: 'https://ridetrax.eu/dobrogea-calling' },
  openGraph: {
    title: 'Dobrogea Calling — TRAX',
    description: 'Join a 766km adventure across ancient Romanian terrain. 3 days, 12 points of interest, shared discovery.',
    url: 'https://ridetrax.eu/dobrogea-calling',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Dobrogea Calling',
  description: '766km exploration of ancient Dobrogean terrain. 3 days of shared effort across quiet wilderness. No tour guides, no performance metrics. An exploration, not an event.',
  startDate: '2026-05-01',
  endDate: '2026-05-03',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: { '@type': 'Place', name: 'Dobrogea, Romania', address: { '@type': 'PostalAddress', addressCountry: 'RO', addressRegion: 'Dobrogea' } },
  organizer: { '@type': 'Organization', name: 'TRAX', url: 'https://ridetrax.eu' },
  image: 'https://ridetrax.eu/android-chrome-512x512.png',
  url: 'https://ridetrax.eu/dobrogea-calling',
};

export default function DobrogeaCallingPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/dobrogea.jpg" alt="Dobrogea landscapes" fill className="object-cover trax-image opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · Romania</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">Dobrogea Calling</h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">An exploration, not an event.</p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* Why Dobrogea */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Landscape</MonoLabel>
            <SubHeadline>Why Dobrogea</SubHeadline>
            <Image src="/assets/dobrogeav.jpg" alt="Dobrogea landscape" width={600} height={600} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="text-xl md:text-2xl leading-relaxed">
              Dobrogea Calling is a <span className="text-trax-red font-medium">TRAX experience</span> built around open terrain, quiet effort and shared discovery.
            </Body>
            <Spacer size="sm" />
            <Body><span className="text-trax-red font-medium">This is not a tour.</span> It's an invitation to move through one of Romania's oldest landscapes with no performance, no rush, and no spectators.</Body>
            <Spacer size="sm" />
            <Body className="mb-6">Dobrogea is not dramatic at first glance. <span className="text-trax-red font-medium">And that's exactly why it works.</span></Body>
            <Body className="mb-6">Wide horizons. Ancient ground. Wind instead of noise.</Body>
            <Body>Here, there is nowhere to hide behind speed or skill. Only <span className="text-trax-red font-medium">rhythm, navigation,</span> and how you show up for the group.</Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* What Is / What Is Not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-trax-grey/20 pt-16">
          <div>
            <SubHeadline className="text-trax-white">What This Experience Is</SubHeadline>
            <div className="space-y-12 mt-8">
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Terrain-Led Exploration</h4>
                <Body>Routes are flexible. Conditions decide. The terrain leads — we adapt. Expect dirt roads, forgotten tracks, open fields, and long lines of sight.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Shared Effort</h4>
                <Body>No racing. No hierarchy. We ride together. We stop together. We solve things together.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Presence Over Performance</h4>
                <Body>Phones stay mostly away. Moments aren't staged. If something is filmed, it's because it happened — not because it was planned.</Body>
              </div>
            </div>
          </div>
          <div className="bg-trax-white/5 p-8 md:p-12 h-fit">
            <SubHeadline className="text-trax-red">What This Is Not</SubHeadline>
            <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
              {['Not a competition', 'Not a training camp', 'Not a guided tour', 'Definitely not a retreat'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> {item}</li>
              ))}
            </ul>
            <p className="mt-8 font-body text-trax-white opacity-60 italic">If you're looking for comfort, this isn't it.</p>
          </div>
        </div>

        <Spacer size="lg" />

        {/* Who & Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <MonoLabel className="mb-4 block">The Filter</MonoLabel>
            <SubHeadline>Who This Is For</SubHeadline>
            <ul className="space-y-4 font-body text-trax-white/80 mt-6">
              {['are comfortable with uncertainty', 'value silence and space', 'understand group rhythm', 'don\'t need validation to enjoy effort'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-trax-grey text-sm">Skill matters less than <span className="text-trax-red">attitude</span>.</p>
          </div>
          <div className="md:col-span-2 md:pl-12 border-l border-trax-grey/20">
            <MonoLabel className="mb-4 block">The Flow</MonoLabel>
            <SubHeadline>The Rhythm</SubHeadline>
            <div className="space-y-8 mt-8">
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Days</h4>
                <Body>Shaped by light, weather, terrain, and group energy. There is a plan. But it's not rigid.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Evenings</h4>
                <Body>Slow. Quiet. Stories come out naturally. Food, fire, and the kind of conversation that only happens when there's nowhere else to be.</Body>
              </div>
            </div>
          </div>
        </div>

        <Spacer size="xl" />

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-trax-grey/20 pt-16 items-start">
          <div>
            <MonoLabel className="mb-4 block">When & Where</MonoLabel>
            <SubHeadline>The Details</SubHeadline>
            <Body className="text-trax-grey mt-6 mb-8">Three days across Dobrogea. No shortcuts. All terrain.</Body>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: 'Duration', value: '3 days', sub: 'May 1st – 3rd 2026' },
                { label: 'Location', value: 'Bucharest', sub: 'Start & End Point' },
                { label: 'Distance', value: '766km', sub: 'Off-Road Exploration' },
                { label: 'Points of Interest', value: '~12', sub: 'Ancient Landmarks' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="font-sans text-trax-red text-sm tracking-widest uppercase">{item.label}</p>
                  <Body className="text-lg">{item.value}</Body>
                  <p className="font-sans text-trax-grey text-xs">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Image src="/assets/iacob.jpg" alt="Dobrogea explorer" width={600} height={700} className="w-full h-full object-cover trax-image opacity-90" />
          </div>
        </div>

        <Spacer size="xl" />

        {/* Invitation */}
        <DobrogeaCallingCTA />

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#DobrogeaCalling</p>
        </div>
      </Container>
    </div>
  );
}
