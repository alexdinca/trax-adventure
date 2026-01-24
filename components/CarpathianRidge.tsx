import React from 'react';
import { Container, Spacer } from './ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from './ui/Typography';

export const CarpathianRidge: React.FC = () => {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/trax landscape.png" 
            alt="Carpathian landscapes" 
            className="w-full h-full object-cover trax-image opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · Romania</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Carpathian Ridge
          </h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">
            Coming soon.
          </p>
        </Container>
      </div>

      <Container>
        <Divider />

        <div className="text-center max-w-2xl mx-auto py-24">
          <Body className="text-xl text-trax-grey">
            Details and registration opening soon.
          </Body>
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>

      </Container>
    </div>
  );
};
