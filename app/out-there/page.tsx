import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';

export const metadata: Metadata = {
  title: 'Out There — TRAX Experience',
  description: 'A two-day, one-night self-supported off-road adventure. Ride remote terrain, camp without infrastructure, live intentionally off the bike.',
  alternates: { canonical: 'https://ridetrax.eu/out-there' },
  openGraph: {
    title: 'Out There — TRAX',
    description: 'Two days, one night. Self-supported camping adventure. Remote terrain. No excess.',
    url: 'https://ridetrax.eu/out-there',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

export default function OutTherePage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/trax landscape.png" alt="Remote camping with motorcycles" fill className="object-cover trax-image opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · 14th – 16th August</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">Out There</h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">Carry what matters. Leave the rest behind.</p>
        </Container>
      </div>

      <Container>
        <Spacer size="lg" />
        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Idea</MonoLabel>
          <SubHeadline>Why Out There Exists</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            Adventure riding doesn't end when the engine stops. <span className="text-trax-red font-medium">One night away from comfort changes everything.</span>
          </Body>
          <Body>Out There teaches you to live off the bike — briefly, intentionally, and without excess. Sharpened judgment. Reset priorities. A different way of riding.</Body>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Structure</MonoLabel>
          <SubHeadline>Two Days, One Night</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">Self-supported. Remote. Minimal. Designed to fit real life.</Body>
          <Body>You pack your essentials, ride off-road to a remote camp, spend one night without infrastructure, and return the next day under your own power.</Body>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Flow</MonoLabel>
          <SubHeadline>How It Unfolds</SubHeadline>
          <Spacer size="lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h3 className="font-sans text-trax-red text-2xl font-medium mb-8">Day 1 — Going Out</h3>
              <ul className="space-y-4 font-body text-trax-white/80">
                {['Meet point briefing and gear check', 'Off-road riding away from civilization', 'Natural regrouping, shared navigation', 'Arrival at remote camp', 'Tent setup and simple shared dinner'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-trax-red text-2xl font-medium mb-8">Day 2 — Coming Back</h3>
              <ul className="space-y-4 font-body text-trax-white/80">
                {['Early wake-up with natural light', 'Coffee, silence, slow start', 'Pack down and leave no trace', 'Off-road return route', 'Closing acknowledgment before dispersal'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Evening</MonoLabel>
          <SubHeadline>One Fire. One Night.</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">Evenings are quiet by design.</Body>
          <Body className="mb-6">No schedules. No entertainment. No forced interaction. Just food, warmth, and the reality of being out there.</Body>
          <Body className="text-trax-grey">Phones stay away. Cameras stay down. Some moments are intentionally undocumented.</Body>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Riding</MonoLabel>
          <SubHeadline>Chosen for Flow, Not Speed</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">Routes prioritize forest roads, gravel, and light technical sections — enough to challenge without overwhelming.</Body>
          <Body>This is not about distance or difficulty. It's about riding loaded bikes smoothly, managing fatigue, and staying aware as conditions change.</Body>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Filter</MonoLabel>
          <SubHeadline>Who This Is For</SubHeadline>
          <Spacer size="lg" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-8">Riders curious about ADV life. Those new to camping off the bike. People seeking simplicity. Anyone who values presence over performance.</Body>
          <Body className="text-trax-grey">Skill matters less than mindset. Access is granted based on readiness, not experience level alone.</Body>
        </section>

        <Divider />

        <section className="mb-24">
          <MonoLabel className="mb-6 block">Your Responsibility</MonoLabel>
          <SubHeadline>Pack Light. Pack Right.</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">You are responsible for your own gear, shelter, and essentials.</Body>
          <Body>A detailed packing checklist is provided after access is granted. Overpacking is discouraged. Excess becomes obvious quickly.</Body>
        </section>

        <Spacer size="xl" />

        <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
          <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
          <p className="font-body text-xl md:text-2xl text-trax-white mb-8">Out There runs with a small group to preserve safety, silence, and flow.</p>
          <Body className="mx-auto mb-8">If this resonates, you'll know it.</Body>
          <WhatsAppCTA label="Request Access" source="out_there_page" eventName="access_request_click" />
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>
      </Container>
    </div>
  );
}
