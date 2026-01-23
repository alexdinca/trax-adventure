import React from 'react';
import { Container } from './ui/Container';
import { MonoLabel } from './ui/Typography';

export const Ethos: React.FC = () => {
  const values = [
    { first: "Terrain", last: "trophies" },
    { first: "Presence", last: "performance" },
    { first: "Trust", last: "ego" },
    { first: "Experience", last: "exposure" }
  ];

  return (
    <Container>
      <div className="flex flex-col items-center">
        <MonoLabel className="mb-12 md:mb-20 block text-center">The Ethos</MonoLabel>
        
        {/* Centered block, but left-aligned text for structure */}
        <div className="flex flex-col items-start space-y-2 md:space-y-6">
          {values.map((val, idx) => (
              <h3 key={idx} className="font-sans text-3xl md:text-5xl lg:text-6xl tracking-tight leading-snug cursor-default select-none transition-opacity duration-300 hover:opacity-100">
                  <span className="text-trax-white font-medium">{val.first}</span>
                  <span className="text-trax-red px-3 md:px-5 font-normal">over</span>
                  <span className="text-trax-grey font-normal">{val.last}</span>
              </h3>
          ))}
        </div>

        <p className="mt-20 text-trax-grey font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-center">
          These are not slogans. They are filters.
        </p>
      </div>
    </Container>
  );
};