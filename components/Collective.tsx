import React from 'react';
import { Container } from './ui/Container';
import { Body, SubHeadline, MonoLabel } from './ui/Typography';

export const Collective: React.FC = () => {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-trax-grey/20 pt-24">
        
        {/* Collective */}
        <div className="md:col-span-6">
          <MonoLabel className="block mb-6">Community</MonoLabel>
          <SubHeadline className="text-3xl">The Collective</SubHeadline>
          <Body className="mb-6">
            TRAX is not built around an audience. It’s built around a collective.
          </Body>
          <Body className="mb-6">
             Riders, explorers and individuals who show up fully — for the terrain and for each other.
          </Body>
          <p className="font-sans text-xl text-trax-white mt-8">
            Earn the story. Share the effort. Leave changed.
          </p>
        </div>

        {/* Founder */}
        <div className="md:col-span-5 md:col-start-8">
          <MonoLabel className="block mb-6">Origins</MonoLabel>
          <SubHeadline className="text-3xl">The Founder</SubHeadline>
          <div className="flex gap-6 mb-8">
             <img 
                /* Replace with your local file */
                src="https://images.unsplash.com/photo-1544377317-154df2c58a36?q=80&w=200&auto=format&fit=crop" 
                alt="Portrait detail" 
                className="w-16 h-16 rounded-full grayscale opacity-80 object-cover"
             />
             <div>
                 <p className="font-sans text-trax-white">Alex</p>
                 <MonoLabel>Experience Architect</MonoLabel>
             </div>
          </div>
          <Body className="mb-6">
            Alex builds TRAX as a response to the dilution of adventure.
          </Body>
          <Body className="mb-6">
            An adventure rider and experience architect, he designs environments where people are tested quietly — not loudly — and connection forms naturally.
          </Body>
          <p className="font-sans text-trax-grey italic">
            TRAX is not his image. It’s his answer.
          </p>
        </div>

      </div>
    </Container>
  );
};