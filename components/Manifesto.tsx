import React from 'react';
import { Container } from './ui/Container';
import { Body, Headline, MonoLabel, SubHeadline } from './ui/Typography';

export const Manifesto: React.FC = () => {
  return (
    <Container className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
      <div className="md:col-span-4">
        <MonoLabel>The Purpose</MonoLabel>
        <div className="mt-4 md:mt-24">
             <img 
                /* Replace with your local file */
                src="/assets/conditions.jpg" 
                alt="Rider looking at landscape" 
                className="w-full h-auto object-cover opacity-90 trax-image hidden md:block"
            />
            <MonoLabel className="block mt-2 text-right">01 — Context</MonoLabel>
        </div>
      </div>
      
      <div className="md:col-span-8 md:pl-12 pt-12 md:pt-0">
        <SubHeadline className="text-trax-red">Why TRAX Exists</SubHeadline>
        
        <Headline className="mb-12">
          We don’t sell trips. We create conditions.
        </Headline>

        <div className="space-y-8">
            <Body>
                Conditions where comfort disappears, plans change and people rediscover presence, trust and themselves.
            </Body>
            
            <Body>
                Modern life removed friction — and with it, meaning. Adventure became content. Routes replaced exploration. Comfort disguised itself as courage.
            </Body>

            <Body>
                TRAX exists to reintroduce friction on purpose. Not to escape life — but to return to it sharper, calmer and more real.
            </Body>

            <Body>
                TRAX exists to bring people back to themselves through shared effort, uncertainty and real terrain.
            </Body>
        </div>
      </div>
    </Container>
  );
};