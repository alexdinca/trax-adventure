import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';

export const metadata: Metadata = {
  title: 'Out There — TRAX',
  description: 'Three days, two nights. A self-supported off-road ride from Bucharest to a camp at the top of the wilderness. Carry what matters. Leave the rest behind.',
  alternates: { canonical: 'https://ridetrax.eu/out-there' },
  openGraph: {
    title: 'Out There — TRAX',
    description: 'Three days, two nights. A self-supported off-road ride from Bucharest to a camp at the top of the wilderness. Carry what matters. Leave the rest behind.',
    url: 'https://ridetrax.eu/out-there',
    images: [{ url: '/assets/out-there/bliss-there.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/out-there/bliss-there.jpg'],
  },
};

export default function OutTherePage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/out-there/bliss-there.jpg" alt="Loaded adventure motorcycle on a remote Romanian trail" fill className="object-cover trax-image opacity-50" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · Romania</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">Out There</h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">Carry what matters. Leave the rest behind.</p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* 01 — Why Out There Exists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Threshold</MonoLabel>
            <SubHeadline>Why Out There Exists</SubHeadline>
            <Image src="/assets/out-there/out-there.jpg" alt="Aerial view of a rider on a valley road" width={600} height={750} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="text-xl md:text-2xl leading-relaxed mb-6">
              Every rider reaches a point where day rides stop being enough. Not because the riding got boring. <span className="text-trax-red font-medium">Because coming home started feeling too easy.</span>
            </Body>
            <Body className="mb-6">Out There is the first threshold. Three days, two nights. You leave Bucharest with everything you need strapped to the bike, and for one weekend, <span className="text-trax-red font-medium">home is wherever you stop.</span></Body>
            <Body>You don&apos;t need much. <span className="text-trax-red font-medium">Comfort is negotiable.</span></Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 02 — What This Is */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Experience</MonoLabel>
          <SubHeadline>What This Is</SubHeadline>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { title: 'Self-Supported', body: "Everything you need comes on the bike. Everything you don't stays home. Packing is the first test, and it starts before the engine does." },
              { title: 'The Moving Camp', body: 'No base camp. No returning to the same spot. Each night you sleep somewhere new, and each morning the camp folds back onto the bike.' },
              { title: 'Loaded Riding', body: 'Forest roads, gravel, light technical sections. Enough to challenge a loaded bike without overwhelming the rider on it.' },
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
              {['Not a camping course', 'Not a survival test', 'Not a guided tour', 'Not glamping. Not even close.'].map((item) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-trax-white/10">
            {[
              { day: 1, title: 'The Ride In', body: 'Bucharest fades behind you. Asphalt turns to gravel, gravel turns to trail. You arrive with daylight to spare. Tents up. Fire lit. The first night teaches you what you forgot to pack.' },
              { day: 2, title: 'Up There', body: 'Morning coffee, then the camp disappears into the bags. A full day of trails, and by evening you climb. The second camp sits at the top of the wilderness. Away from roads, signal and noise. This is the night the experience is named after.' },
              { day: 3, title: 'The Way Back', body: "No alarm. Slow coffee, cold hands. Some easy exploration on the descent, nothing that fights you. Then the trail becomes gravel, the gravel becomes asphalt, and Bucharest returns. The ride back always feels different. That's the point." },
            ].map(({ day, title, body }) => (
              <div key={day} className="bg-trax-black p-6 md:p-8">
                <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-trax-white/10">
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-trax-red">Day {day}</span>
                </div>
                <h4 className="font-sans text-trax-white text-xl font-medium mb-4">{title}</h4>
                <Body className="text-trax-white/70 text-sm md:text-base">{body}</Body>
              </div>
            ))}
          </div>
        </div>

        <Spacer size="lg" />

        {/* 04 — Intentionally Undocumented */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start border-t border-trax-grey/20 pt-16">
          <div>
            <MonoLabel className="mb-6 block">The Night</MonoLabel>
            <SubHeadline>Intentionally Undocumented</SubHeadline>
            <Image src="/assets/out-there/on-there.jpg" alt="Loaded motorcycle in a high meadow at evening" width={600} height={800} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="mb-6">Both camps are wild. No infrastructure, no facilities, no backup plan parked nearby.</Body>
            <Body className="mb-6">Phones stay away. Cameras stay down. <span className="text-trax-red font-medium">The nights are intentionally undocumented.</span></Body>
            <div className="bg-trax-white/5 p-8">
              <p className="font-body text-trax-white/80 italic leading-relaxed">What you remember without a camera is what you actually keep.</p>
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 05 — Who This Is For */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Filter</MonoLabel>
          <SubHeadline>Who This Is For</SubHeadline>
          <ul className="space-y-4 font-body text-trax-white/80 mt-6 max-w-2xl">
            {['are curious about life off the bike', 'want their first nights in wild terrain done right', 'value simplicity over equipment', 'can carry their own weight, literally'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-trax-grey text-sm">Skill matters less than <span className="text-trax-red">readiness</span>. Access is granted on mindset, not experience level alone.</p>
        </div>

        <Spacer size="lg" />

        {/* 06 — Pack Light. Pack Right. */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">Your Responsibility</MonoLabel>
          <SubHeadline>Pack Light. Pack Right.</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">Your shelter, your gear, your essentials. A detailed packing list is provided after access is granted.</Body>
          <Body><span className="text-trax-red font-medium">If you&apos;re questioning whether you need it, you don&apos;t.</span> Excess becomes obvious on the first climb.</Body>
        </div>

        <Spacer size="lg" />

        {/* 07 — The Details */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">When &amp; Where</MonoLabel>
          <SubHeadline>The Details</SubHeadline>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { label: 'Duration', value: '3 Days / 2 Nights', sub: '14th – 16th August 2026' },
              { label: 'Route', value: 'Bucharest & Back', sub: 'Self-supported, loaded' },
              { label: 'Terrain', value: 'Forest & Gravel', sub: 'Light technical' },
              { label: 'Camps', value: 'Two, Wild', sub: 'The second one, up there' },
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

        {/* 08 — The Invitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
            <Image src="/assets/out-there/up-there.jpg" alt="Rider standing above a lake" width={600} height={750} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="text-xl md:text-2xl leading-relaxed mb-6">Out There runs with a small group to protect safety, silence and flow.</Body>
            <Body className="mb-8">If this resonates, you&apos;ll know it.</Body>
            <WhatsAppCTA label="Request Access" source="out_there_page" eventName="access_request_click" />
          </div>
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>
      </Container>
    </div>
  );
}
