import React from 'react';
import { useAptabase } from '@aptabase/react';
import { useSEO } from '../hooks/useSEO';
import { Container, Spacer } from './ui/Container';
import { Button } from './ui/Button';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from './ui/Typography';
import { generateFAQSchema } from '../utils/geoOptimization';

export const OutThere: React.FC = () => {
  const { trackEvent } = useAptabase();

  useSEO({
    title: 'Out There — TRAX Experience',
    description: 'A two-day, one-night self-supported off-road adventure. Ride remote terrain, camp without infrastructure, live intentionally off the bike. For riders ready to carry responsibility.',
    ogTitle: 'Out There — TRAX',
    ogDescription: 'Two days, one night. Self-supported camping adventure. Remote terrain. No excess.',
    ogImage: 'https://ridetrax.eu/android-chrome-512x512.png',
    keywords: [
      'adventure camping',
      'off-road motorcycling',
      'self-supported riding',
      'remote camping adventure',
      'two-day motorcycle experience',
      'bivouac camping',
      'minimal adventure travel'
    ],
    author: 'TRAX',
    structuredData: generateFAQSchema([
      {
        question: 'What is Out There by TRAX?',
        answer: 'Out There is a two-day, one-night self-supported off-road adventure experience. Riders pack their essentials on their bikes, ride off-road to a remote camp location, camp overnight without infrastructure, and return the next day under their own power.'
      },
      {
        question: 'What should I bring to Out There?',
        answer: 'You are responsible for your own gear, shelter, and essentials including tent, sleeping bag, and camping supplies. A detailed packing checklist is provided after access is granted. Minimal packing is encouraged as excess becomes obvious quickly.'
      },
      {
        question: 'What terrain will we ride?',
        answer: 'Routes prioritize forest roads, gravel, and light technical sections chosen for flow rather than speed. This is not about distance or difficulty, but about riding loaded bikes smoothly and staying aware as conditions change.'
      },
      {
        question: 'Is this suitable for beginners?',
        answer: 'Out There is not based on experience level alone, but on mindset and readiness. It is designed for riders curious about ADV life, those new to camping off the bike, and people seeking simplicity. Skill matters less than attitude.'
      }
    ])
  });

  const handleAccessClick = () => {
    trackEvent('access_request_click', {
      source: 'out_there_page',
      timestamp: new Date().toISOString()
    });
    window.open('https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD', '_blank');
  };

  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/trax landscape.png" 
            alt="Remote camping with motorcycles" 
            className="w-full h-full object-cover trax-image opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · 14th – 16th August</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Out There
          </h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">
            Carry what matters. Leave the rest behind.
          </p>
        </Container>
      </div>

      <Container>
        <Spacer size="lg" />
        <Divider />

        {/* Why This Exists */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Idea</MonoLabel>
          <SubHeadline>Why Out There Exists</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            Adventure riding doesn't end when the engine stops. <span className="text-trax-red font-medium">One night away from comfort changes everything.</span>
          </Body>
          <Body>
            Out There teaches you to live off the bike — briefly, intentionally, and without excess. Sharpened judgment. Reset priorities. A different way of riding.
          </Body>
        </section>

        <Divider />

        {/* The Structure */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Structure</MonoLabel>
          <SubHeadline>Two Days, One Night</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            Self-supported. Remote. Minimal. Designed to fit real life.
          </Body>
          <Body>
            You pack your essentials, ride off-road to a remote camp, spend one night without infrastructure, and return the next day under your own power.
          </Body>
        </section>

        <Divider />

        {/* Experience Structure */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Flow</MonoLabel>
          <SubHeadline>How It Unfolds</SubHeadline>
          <Spacer size="lg" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h3 className="font-sans text-trax-red text-2xl font-medium mb-8">Day 1 — Going Out</h3>
              <ul className="space-y-4 font-body text-trax-white/80">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Meet point briefing and gear check</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Off-road riding away from civilization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Natural regrouping, shared navigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Arrival at remote camp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Tent setup and simple shared dinner</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-trax-red text-2xl font-medium mb-8">Day 2 — Coming Back</h3>
              <ul className="space-y-4 font-body text-trax-white/80">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Early wake-up with natural light</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Coffee, silence, slow start</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Pack down and leave no trace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Off-road return route</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>Closing acknowledgment before dispersal</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Divider />

        {/* Camp Life */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Evening</MonoLabel>
          <SubHeadline>One Fire. One Night.</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            Evenings are quiet by design.
          </Body>
          <Body className="mb-6">
            No schedules. No entertainment. No forced interaction. Just food, warmth, and the reality of being out there.
          </Body>
          <Body className="text-trax-grey">
            Phones stay away. Cameras stay down. Some moments are intentionally undocumented.
          </Body>
        </section>

        <Divider />

        {/* Terrain & Riding */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Riding</MonoLabel>
          <SubHeadline>Chosen for Flow, Not Speed</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            Routes prioritize forest roads, gravel, and light technical sections — enough to challenge without overwhelming.
          </Body>
          <Body>
            This is not about distance or difficulty. It's about riding loaded bikes smoothly, managing fatigue, and staying aware as conditions change.
          </Body>
        </section>

        <Divider />

        {/* Who This Is For */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">The Filter</MonoLabel>
          <SubHeadline>Who This Is For</SubHeadline>
          <Spacer size="lg" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-8">
            Riders curious about ADV life. Those new to camping off the bike. People seeking simplicity. Anyone who values presence over performance.
          </Body>
          <Body className="text-trax-grey">
            Skill matters less than mindset. Access is granted based on readiness, not experience level alone.
          </Body>
        </section>

        <Divider />

        {/* What You Bring */}
        <section className="mb-24">
          <MonoLabel className="mb-6 block">Your Responsibility</MonoLabel>
          <SubHeadline>Pack Light. Pack Right.</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">
            You are responsible for your own gear, shelter, and essentials.
          </Body>
          <Body>
            A detailed packing checklist is provided after access is granted. Overpacking is discouraged. Excess becomes obvious quickly.
          </Body>
        </section>

        <Spacer size="xl" />
        {/* The Invitation */}
        <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
            <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
            <p className="font-body text-xl md:text-2xl text-trax-white mb-8">
                Out There runs with a small group to preserve safety, silence, and flow.
            </p>
            <Body className="mx-auto mb-8">
                If this resonates, you'll know it.
            </Body>
            <Button 
                onClick={handleAccessClick}
                className="mb-4"
            >
                Request Access
            </Button>
        </div>

        <div className="text-center mt-24 opacity-40">
            <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>

      </Container>
    </div>
  );
};
