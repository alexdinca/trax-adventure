'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAptabase } from '@aptabase/react';
import { Container, Spacer } from './ui/Container';
import { Headline, MonoLabel } from './ui/Typography';

export function ExperiencesClient() {
  const { trackEvent } = useAptabase();

  useEffect(() => {
    trackEvent('experiences_page_visit', { timestamp: new Date().toISOString() });
  }, [trackEvent]);

  const handleExperienceClick = (experienceName: string) => {
    trackEvent('experience_card_click', {
      experience: experienceName,
      source: 'experiences_page',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <Container>
        <MonoLabel className="mb-8 block">The Index</MonoLabel>
        <Headline className="mb-12 max-w-3xl">
          TRAX designs experiences, not itineraries.{' '}
          <span className="text-trax-grey block mt-2">These are the current open conditions.</span>
        </Headline>

        <Spacer size="md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dobrogea Calling — active */}
          <Link
            href="/dobrogea-calling"
            onClick={() => handleExperienceClick('dobrogea_calling')}
            className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red hover:bg-trax-red/5 block"
          >
            <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
              <Image
                src="/assets/dobrogea.jpg"
                alt="Dobrogea"
                width={700}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image"
              />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-sans text-2xl md:text-3xl text-trax-white group-hover:text-trax-red transition-colors">Dobrogea Calling</h3>
              <MonoLabel>RO</MonoLabel>
            </div>
            <p className="font-body text-trax-grey text-xs mb-2">1st – 3rd May</p>
            <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors mb-6">
              650km across Dobrogea. Ancient terrain, quiet effort, shared discovery. No tour guides, no performance metrics.
            </p>
            <span className="font-mono text-xs text-trax-red uppercase tracking-widest group-hover:text-trax-white transition-colors">See details →</span>
          </Link>

          {/* Out There — locked */}
          <LockedCard title="Out There" date="14th – 16th August" description="Self-supported off-road riding and remote camping. Ride remote, camp without infrastructure, live intentionally off the bike." />

          {/* Carpathian Ridge — locked */}
          <LockedCard title="Carpathian Ridge" date="28th – 30th August" description="Three days of sustained mountain riding in the Carpathians. Fatigue as design. Technical terrain. Honest mountains." />

          {/* The Ground — locked */}
          <LockedCard title="The Ground" date="14th November" description="One year since the first TRAX gathering. A return to where it began. Open training day at TCS Racing Park." />

          {/* The Long Way In — locked */}
          <LockedCard title="The Long Way In" date="5 Days / Advanced" description="1370km across ACT Romania. Maramureș to Transfăgărășan. 45% off-road. Self-supported. No shortcuts." />

          <div>
            <MonoLabel>Archive / Future</MonoLabel>
            <p className="font-sans text-trax-grey mt-4">More conditions loading...</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

function LockedCard({ title, date, description }: { title: string; date: string; description: string }) {
  return (
    <div className="group cursor-not-allowed border border-trax-grey/20 p-8 transition-all duration-500 opacity-50 block">
      <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
        <Image
          src="/assets/trax landscape.png"
          alt={title}
          width={700}
          height={400}
          className="w-full h-full object-cover trax-image"
        />
      </div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-sans text-2xl md:text-3xl text-trax-white">{title}</h3>
        <MonoLabel>RO</MonoLabel>
      </div>
      <p className="font-body text-trax-grey text-xs mb-2">{date}</p>
      <p className="font-body text-trax-grey mb-6">{description}</p>
      <span className="font-mono text-xs text-trax-grey uppercase tracking-widest">Loading details...</span>
    </div>
  );
}
