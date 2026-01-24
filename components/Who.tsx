import React from 'react';
import { Container } from './ui/Container';
import { Body, SubHeadline, MonoLabel } from './ui/Typography';

export const Who: React.FC = () => {
  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-24">
      {/* For */}
      <div>
        <MonoLabel className="block mb-6">The Filters</MonoLabel>
        <SubHeadline className="text-3xl mb-8">Who TRAX Is For</SubHeadline>
        
        <ul className="space-y-6">
            {[              
                "understand that discomfort reveals character",
                "don’t need medals to validate effort",
                "value presence over performance",
                "want stories they don’t have to exaggerate"
            ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                    <span className="text-trax-red mr-4 font-mono text-sm mt-1">0{idx + 1}</span>
                    <p className="font-body text-trax-white text-lg">{item}</p>
                </li>
            ))}
        </ul>

        <p className="mt-12 font-sans text-trax-grey italic">
            If you’re looking for guarantees, itineraries or applause — this isn’t it.
        </p>
      </div>

      {/* Not For */}
      <div className="relative group p-12 border border-trax-grey/20 bg-gradient-to-b from-trax-white/5 to-transparent transition-colors duration-500 hover:border-trax-red/40">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-trax-red/20 group-hover:border-trax-red/60 transition-colors duration-500" />
        
        <SubHeadline className="text-3xl mb-8 text-trax-white group-hover:text-trax-red transition-colors duration-300">Who We Are Not</SubHeadline>
        
        <div className="space-y-6 font-sans text-xl text-trax-white">
            <div className="flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-8 h-[1px] bg-trax-red"></span>
                <p>We are not a tour operator</p>
            </div>
            <div className="flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                <span className="w-8 h-[1px] bg-trax-red"></span>
                <p>We are not a training school</p>
            </div>
            <div className="flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                <span className="w-8 h-[1px] bg-trax-red"></span>
                <p>We are not an influencer brand</p>
            </div>
        </div>

        <div className="mt-12 pt-12 border-t border-trax-grey/20">
             <p className="font-body text-trax-white text-xl leading-relaxed">
                TRAX is a platform for <span className="text-trax-red font-medium">modern exploration culture.</span>
             </p>
        </div>
      </div>
    </Container>
  );
};