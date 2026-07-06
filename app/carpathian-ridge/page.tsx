import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Carpathian Ridge — TRAX',
  description: 'Three days of sustained mountain riding in the Romanian Carpathians. Technical terrain, no support, experienced riders only. An endurance, not an escape.',
  alternates: { canonical: 'https://ridetrax.eu/carpathian-ridge' },
  openGraph: {
    title: 'Carpathian Ridge — TRAX',
    description: 'Three days of sustained mountain riding in the Romanian Carpathians. Technical terrain, no support, experienced riders only. An endurance, not an escape.',
    url: 'https://ridetrax.eu/carpathian-ridge',
    images: [{ url: '/assets/carpathian-ridge/IMG_6451.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/carpathian-ridge/IMG_6451.jpg'],
  },
};

export default function CarpathianRidgePage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/carpathian-ridge/IMG_6451.jpg"
            alt="Loaded KTM adventure motorcycle on a ridge above a mountain lake in the Carpathians"
            fill
            className="object-cover object-bottom trax-image"
            sizes="100vw"
            priority
          />
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

        {/* 01 — Why the Carpathians */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Character</MonoLabel>
            <SubHeadline>Why the Carpathians</SubHeadline>
            <Image src="/assets/carpathian-ridge/IMG_6440.jpg" alt="Cockpit point of view riding a rocky ridgeline trail" width={600} height={750} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="mb-6">The Carpathians don&apos;t impress loudly. <span className="text-trax-red font-medium">They wear you down.</span></Body>
            <Body className="mb-6">Long forest climbs. Narrow ridgelines. Rocky descents that punish impatience. Weather that changes the rules mid-day.</Body>
            <Body className="mb-6">These are the same trails that hosted the <span className="text-trax-red font-medium">KTM Europe Adventure Rally</span> in 2025. Not because they are friendly. Because they are honest.</Body>
            <Body>Here, skill matters. <span className="text-trax-red font-medium">Judgment matters more.</span></Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 02 — What This Is */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Experience</MonoLabel>
          <SubHeadline>What This Is</SubHeadline>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { title: 'Sustained Mountain Riding', body: 'Not one hard section. Three days of consistency. Forest and alpine trails, long technical climbs, changing grip and altitude. Fatigue is part of the design.' },
              { title: 'Tested Limits', body: "Physical fatigue, mental load, decisions made under pressure. You don't conquer this terrain. You adapt to it." },
              { title: 'Shared Responsibility', body: "The mountains don't allow shortcuts. We ride as a group, manage risk together, finish together. Strength here isn't loud. It's reliable." },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-trax-white/5 p-6 md:p-8">
                <h4 className="font-sans text-trax-red text-lg mb-3">{pillar.title}</h4>
                <Body className="text-trax-white/80">{pillar.body}</Body>
              </div>
            ))}
          </div>

          <Spacer size="lg" />

          <div className="bg-trax-white/5 p-8 md:p-12 max-w-2xl">
            <SubHeadline className="text-trax-red">What This Is Not</SubHeadline>
            <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
              {['Not a race', 'Not a guided tour', 'Not a training camp', 'Not a place to learn the basics'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 03 — Three Days */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Flow</MonoLabel>
          <SubHeadline>Three Days</SubHeadline>
          <Spacer size="lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Image src="/assets/carpathian-ridge/IMG_6411.jpg" alt="Loaded adventure motorcycle on winding gravel through the hills" width={600} height={800} className="w-full h-[600px] object-cover trax-image opacity-90" />
            <div className="flex flex-col gap-[1px] bg-trax-white/10">
              {[
                { day: 1, title: 'Into the Forest', body: 'The group forms in the Sibiu area and the mountains start immediately. Forest roads first, then the terrain sharpens. The day ends back in Sibiu. A real bed, because tomorrow asks for everything.' },
                { day: 2, title: 'The Ridge', body: 'The long day. The group moves south through the high country toward Ranca, climbing into alpine terrain where the trees stop and the exposure starts. You arrive at the cabana tired in a way a day ride never makes you. That was the intention.' },
                { day: 3, title: 'The Way Down', body: "The mountains don't get easier on the last day. You do the same work with less in the tank, and that is the actual test. By afternoon the trails release you back to asphalt, and everyone rides home carrying the same three days." },
              ].map(({ day, title, body }) => (
                <div key={day} className="bg-trax-black p-6 md:p-8">
                  <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-trax-white/10">
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-trax-red">Day {day}</span>
                    <span className="font-sans text-trax-white text-lg font-medium">{title}</span>
                  </div>
                  <Body className="text-trax-white/70 text-sm md:text-base">{body}</Body>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 04 — Recovery Is Part of the Design */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Nights</MonoLabel>
          <SubHeadline>Recovery Is Part of the Design</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">Two nights, two roofs. Sibiu, then a cabana in Ranca.</Body>
          <Body className="mb-6">This is not comfort. <span className="text-trax-red font-medium">It&apos;s arithmetic.</span> Three days of technical mountain riding require real recovery, and the terrain takes everything a camp would have asked of you.</Body>
          <Body>Evenings are quiet. Stories are short. <span className="text-trax-red font-medium">Sleep is earned.</span></Body>
        </div>

        <Spacer size="lg" />

        {/* 05 — Who This Is For */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Filter</MonoLabel>
          <SubHeadline>Who This Is For</SubHeadline>
          <Body className="mb-6">Carpathian Ridge is not a first TRAX experience.</Body>
          <Body className="mb-6">It requires experienced maxitrail and enduro riders who:</Body>
          <ul className="space-y-4 font-body text-trax-white/80 mt-6 max-w-2xl">
            {['are comfortable riding tired', 'can manage a heavy bike in technical terrain', 'respect mountain conditions and changing weather', 'understand group discipline'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-trax-grey text-sm">There is no support crew, no chase vehicle, no luggage transfer. You, your bike, and your judgment. <span className="text-trax-red">Access is reviewed, not sold.</span></p>
        </div>

        <Spacer size="lg" />

        {/* 06 — The Details */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">When &amp; Where</MonoLabel>
          <SubHeadline>The Details</SubHeadline>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { label: 'Duration', value: '3 Days / 2 Nights', sub: '28th – 30th August 2026' },
              { label: 'Base', value: 'Sibiu → Ranca', sub: 'Cabana nights, mountain days' },
              { label: 'Terrain', value: 'Forest & Alpine', sub: 'Technical, sustained' },
              { label: 'Support', value: 'None', sub: 'You and your bike' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase">{item.label}</p>
                <Body className="text-lg">{item.value}</Body>
                <p className="font-sans text-trax-grey text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <Spacer size="xl" />

        {/* 07 — The Invitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
            <Image src="/assets/carpathian-ridge/IMG_6444.jpg" alt="Loaded adventure motorcycle at the top of the ridge with mountain ranges to the horizon" width={600} height={750} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="text-xl md:text-2xl leading-relaxed mb-6">Carpathian Ridge runs with a small group. The mountains set the limit, not the marketing.</Body>
            <Body className="mb-8">If this resonates, you&apos;ll know it.</Body>
            <WhatsAppCTA label="Request Access" source="carpathian_ridge_page" eventName="access_request_click" href={whatsappLink('Salut,\nVreau să mă alătur experienței Carpathian Ridge.\nÎmi dai te rog mai multe detalii?')} />
          </div>
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#CarpathianRidge · #OnTRAX</p>
        </div>
      </Container>
    </div>
  );
}
