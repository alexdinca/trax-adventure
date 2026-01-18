import React from 'react';
import { Container } from './ui/Container';
import { Body, Divider, SubHeadline, MonoLabel } from './ui/Typography';

interface FeatureItemProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, children, subtitle }) => (
  <div className="border-l border-trax-grey/30 pl-8 py-2">
    <SubHeadline className="mb-4">{title}</SubHeadline>
    <Body className="mb-6">{children}</Body>
    {subtitle && <p className="font-sans text-trax-white italic opacity-80">{subtitle}</p>}
  </div>
);

export const WhatWeCreate: React.FC = () => {
  return (
    <div className="relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
                 <MonoLabel className="mb-8 block">Our Output</MonoLabel>
                 <h2 className="font-sans text-4xl md:text-5xl text-trax-white mb-12">What We Create</h2>
                 <img 
                    /* Replace with your local file */
                    src="https://images.unsplash.com/photo-1522673322055-3221443666b6?q=80&w=1200&auto=format&fit=crop" 
                    alt="Climbing terrain" 
                    className="w-full h-[600px] object-cover trax-image opacity-80"
                />
            </div>
            
            <div className="flex flex-col justify-center space-y-16 lg:pt-24">
                <FeatureItem title="Experiences, Not Trips" subtitle="You don’t consume it. You earn it.">
                    No fixed outcomes. No guaranteed comfort. Each TRAX experience is designed around terrain, conditions and the people who show up.
                </FeatureItem>

                <FeatureItem title="Shared Effort" subtitle="Ego doesn’t survive long here.">
                    We move together. We solve together. We slow down for the group.
                </FeatureItem>

                <FeatureItem title="Earned Stories" subtitle="If there’s a story, it’s because something real happened.">
                    Nothing staged. Nothing optimized for views.
                </FeatureItem>
                
                <Divider />
            </div>
        </div>
      </Container>
    </div>
  );
};