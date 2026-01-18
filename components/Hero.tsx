import React from 'react';
import { Container } from './ui/Container';
import { MonoLabel } from './ui/Typography';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center">
      {/* Background with slight overlay */}
      <div className="absolute inset-0 z-0">
         <img 
            /* Replace this src with your local file: e.g., "/images/hero-bg.jpg" */
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" 
            alt="Snowy mountain terrain" 
            className="w-full h-full object-cover trax-image opacity-40"
          />
         <div className="absolute inset-0 bg-trax-black/80 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-b from-trax-black/50 via-transparent to-trax-black" />
      </div>

      <Container className="relative z-10">
        <div className="mb-8">
            <h1 className="font-sans text-trax-white text-4xl md:text-6xl lg:text-7xl font-semibold tracking-trax-wide leading-[1.1] max-w-4xl">
            Real adventure doesn’t entertain <br />
            <span className="text-trax-red opacity-90">It transforms</span>
          </h1>
        </div>

        <div className="max-w-xl mt-12 space-y-6">
          <p className="font-body text-lg md:text-xl text-trax-white leading-relaxed">
            TRAX designs real-world adventure experiences where uncertainty, effort and shared challenging terrain bring people back to what actually matters.
          </p>
          
          <div className="pt-8">
            <MonoLabel>Est. 2025 — Romania</MonoLabel>
          </div>
        </div>
      </Container>
    </div>
  );
};