import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAptabase } from '@aptabase/react';
import { useSEO } from '../hooks/useSEO';
import { Container, Spacer } from './ui/Container';
import { Headline, Body, MonoLabel } from './ui/Typography';

export const Experiences: React.FC = () => {
  const { trackEvent } = useAptabase();

  useSEO({
    title: 'Experiences — TRAX',
    description: 'Explore three curated adventure motorcycling experiences. Dobrogea Calling, Carpathian Ridge, and The Ground. Real adventure in unexplored terrain.',
  });

  // Track when user visits Experiences page
  useEffect(() => {
    trackEvent('experiences_page_visit', {
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const handleExperienceClick = (experienceName: string) => {
    trackEvent('experience_entry_click', {
      experience: experienceName,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <Container>
        <MonoLabel className="mb-8 block">The Index</MonoLabel>
        <Headline className="mb-12 max-w-3xl">
          TRAX designs experiences, not itineraries. 
          <span className="text-trax-grey block mt-2">These are the current open conditions.</span>
        </Headline>

        <Spacer size="md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Card - Dobrogea */}
            <Link 
                to="/dobrogea"
                onClick={() => handleExperienceClick('dobrogea')}
                className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red/50 hover:bg-trax-white/5 block"
            >
                <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
                    <img 
                        src="/assets/dobrogea.jpg" 
                        alt="Dobrogea"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image opacity-70 group-hover:opacity-100"
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
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                    View Experience
                </span>
            </Link>

            {/* Experience Card - Carpathian Ridge */}
            <Link 
                to="/carpathian"
                onClick={() => handleExperienceClick('carpathian')}
                className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red/50 hover:bg-trax-white/5 block"
            >
                <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
                    <img 
                        src="/assets/trax landscape.png" 
                        alt="Carpathian Ridge"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image opacity-70 group-hover:opacity-100"
                    />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-sans text-2xl md:text-3xl text-trax-white group-hover:text-trax-red transition-colors">Carpathian Ridge</h3>
                    <MonoLabel>RO</MonoLabel>
                </div>
                <p className="font-body text-trax-grey text-xs mb-2">28th – 30th August</p>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors mb-6">
                    Three days of sustained mountain riding in the Carpathians. Fatigue as design. Technical terrain. Honest mountains.
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                    View Experience
                </span>
            </Link>

            {/* Experience Card - The Ground */}
            <Link 
                to="/ground"
                onClick={() => handleExperienceClick('ground')}
                className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red/50 hover:bg-trax-white/5 block"
            >
                <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
                    <img 
                        src="/assets/trax landscape.png" 
                        alt="The Ground"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image opacity-70 group-hover:opacity-100"
                    />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-sans text-2xl md:text-3xl text-trax-white group-hover:text-trax-red transition-colors">The Ground</h3>
                    <MonoLabel>Romania</MonoLabel>
                </div>
                <p className="font-body text-trax-grey text-xs mb-2">14th November</p>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors mb-6">
                    One year since the first TRAX gathering. A return to where it began. Open training day at TCS Racing Park.
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                    View Experience
                </span>
            </Link>

            {/* Experience Card - The Long Way In */}
            <Link 
                to="/long-way-in"
                onClick={() => handleExperienceClick('long_way_in')}
                className="group cursor-pointer border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red/50 hover:bg-trax-white/5 block"
            >
                <div className="aspect-video w-full overflow-hidden mb-8 bg-trax-grey/10">
                    <img 
                        src="/assets/trax landscape.png" 
                        alt="The Long Way In"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 trax-image opacity-70 group-hover:opacity-100"
                    />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-sans text-2xl md:text-3xl text-trax-white group-hover:text-trax-red transition-colors">The Long Way In</h3>
                    <MonoLabel>RO</MonoLabel>
                </div>
                <p className="font-body text-trax-grey text-xs mb-2">5 Days / Advanced</p>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors mb-6">
                    1370km across ACT Romania. Maramureș to Transfăgărășan. 45% off-road. Self-supported. No shortcuts.
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                    View Experience
                </span>
            </Link>

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