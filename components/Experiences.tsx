import React from 'react';
import { Container, Spacer } from './ui/Container';
import { Headline, Body, MonoLabel } from './ui/Typography';

interface ExperiencesProps {
  onNavigate: (view: string) => void;
}

export const Experiences: React.FC<ExperiencesProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <Container>
        <MonoLabel className="mb-8 block">The Index</MonoLabel>
        <Headline className="mb-12 max-w-3xl">
          TRAX designs environments, not itineraries. 
          <span className="text-trax-grey block mt-2">These are the current open conditions.</span>
        </Headline>

        <Spacer size="md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Card */}
            <div 
                onClick={() => onNavigate('dobrogea')}
                className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red/50 hover:bg-trax-white/5"
            >
                <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
                    <img 
                        src="/src/assets/dobrogea.jpg" 
                        alt="Dobrogea"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image opacity-70 group-hover:opacity-100"
                    />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-sans text-2xl md:text-3xl text-trax-white group-hover:text-trax-red transition-colors">Dobrogea Calling</h3>
                    <MonoLabel>RO</MonoLabel>
                </div>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors mb-6">
                    An exploration of ancient ground. Wide horizons, wind, and silent effort.
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                    View Experience
                </span>
            </div>

            {/* Placeholder for future */}
             <div className="border border-trax-grey/10 p-8 flex flex-col justify-center items-center opacity-50 select-none">
                <MonoLabel>Archive / Future</MonoLabel>
                <p className="font-sans text-trax-grey mt-4">More conditions loading...</p>
            </div>
        </div>
      </Container>
    </div>
  );
};