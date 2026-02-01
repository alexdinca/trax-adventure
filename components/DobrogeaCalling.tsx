import React from 'react';
import { useAptabase } from '@aptabase/react';
import { useSEO } from '../hooks/useSEO';
import { Container, Spacer } from './ui/Container';
import { Button } from './ui/Button';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from './ui/Typography';

export const DobrogeaCalling: React.FC = () => {
  const { trackEvent } = useAptabase();

  useSEO({
    title: 'Dobrogea Calling — TRAX Adventure',
    description: '650km exploration of ancient Dobrogean terrain. 3 days of shared effort across quiet wilderness, no tour guides, no performance metrics. An exploration, not an event.',
    ogTitle: 'Dobrogea Calling — TRAX',
    ogDescription: 'Join a 650km adventure across ancient Romanian terrain. 3 days, 12 points of interest, shared discovery.',
    ogImage: 'https://ridetrax.eu/apple-touch-icon.png',
  });

  const handleJoinClick = () => {
    trackEvent('join_button_click', {
      source: 'dobrogea_calling_page',
      url: 'https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD',
      timestamp: new Date().toISOString()
    });
    window.open('https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD', '_blank');
  };
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/dobrogea.jpg" 
            alt="Dobrogea landscapes" 
            className="w-full h-full object-cover trax-image opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · Romania</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Dobrogea Calling
          </h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">
            An exploration, not an event.
          </p>
        </Container>
      </div>

      <Container>
        

        <Divider />

        {/* Why */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
                <MonoLabel className="mb-6 block">The Landscape</MonoLabel>
                <SubHeadline>Why Dobrogea</SubHeadline>
                <img                     
                    src="/assets/dobrogeav.jpg" 
                    
                    className="w-full h-[600px] object-cover trax-image opacity-90"
                />
            </div>
            <div>
                <Spacer size="md" />
                <Body className="text-xl md:text-2xl leading-relaxed">
                    Dobrogea Calling is a <span className="text-trax-red font-medium">TRAX experience</span> built around open terrain, quiet effort and shared discovery.
                </Body>
                <Spacer size="sm" />
                <Body>
                    <span className="text-trax-red font-medium">This is not a tour.</span> It's an invitation to move through one of Romania's oldest landscapes with no performance, no rush, and no spectators.
                </Body>
                <Spacer size="sm" />
                <Body className="mb-6">
                    Dobrogea is not dramatic at first glance. <span className="text-trax-red font-medium">And that's exactly why it works.</span>
                </Body>
                <Body className="mb-6">
                    Wide horizons. Ancient ground. Wind instead of noise.
                </Body>
                <Body>
                    Here, there is nowhere to hide behind speed or skill. Only <span className="text-trax-red font-medium">rhythm, navigation,</span> and how you show up for the group.
                </Body>
            </div>
        </div>

        <Spacer size="lg" />

        {/* What Is / What Is Not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-trax-grey/20 pt-16">
            <div>
                <SubHeadline className="text-trax-white">What This Experience Is</SubHeadline>
                
                <div className="space-y-12 mt-8">
                    <div>
                        <h4 className="font-sans text-trax-red text-lg mb-2">Terrain-Led Exploration</h4>
                        <Body>Routes are flexible. Conditions decide. The terrain leads — we adapt. Expect dirt roads, forgotten tracks, open fields, and long lines of sight.</Body>
                    </div>
                    <div>
                        <h4 className="font-sans text-trax-red text-lg mb-2">Shared Effort</h4>
                        <Body>No racing. No hierarchy. We ride together. We stop together. We solve things together.</Body>
                    </div>
                    <div>
                        <h4 className="font-sans text-trax-red text-lg mb-2">Presence Over Performance</h4>
                        <Body>Phones stay mostly away. Moments aren’t staged. If something is filmed, it’s because it happened — not because it was planned.</Body>
                    </div>
                </div>
            </div>

            <div className="bg-trax-white/5 p-8 md:p-12 h-fit">
                <SubHeadline className="text-trax-grey text-trax-red">What This Is Not</SubHeadline>
                <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
                    <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a competition</li>
                    <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a training camp</li>
                    <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a guided tour</li>                    
                    <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Definetly not a retreat</li>                
                </ul>
                <p className="mt-8 font-body text-trax-white opacity-60 italic">
                    If you’re looking for comfort or guarantees, this isn’t it.
                </p>
            </div>
        </div>

        <Spacer size="lg" />

        {/* Who & Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
                 <MonoLabel className="mb-4 block">The Filter</MonoLabel>
                 <SubHeadline>Who This Is For</SubHeadline>
                 <ul className="space-y-4 font-body text-trax-white/80 mt-6">
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>are comfortable with uncertainty</span></li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>value silence and space</span></li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>understand group rhythm</span></li>
                    <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>don't need validation to enjoy effort</span></li>
                 </ul>
                 <p className="mt-6 text-trax-grey text-sm">Skill matters less than <span className="text-trax-red">attitude</span>.</p>
            </div>
            
            <div className="md:col-span-2 md:pl-12 border-l border-trax-grey/20">
                <MonoLabel className="mb-4 block">The Flow</MonoLabel>
                <SubHeadline>The Rhythm</SubHeadline>
                <div className="space-y-8 mt-8">
                    <div>
                        <h4 className="font-sans text-trax-red text-lg mb-2">Days</h4>
                        <Body>Shaped by light, weather, terrain, and group energy. There is a plan. But it's not rigid.</Body>
                    </div>
                    <div>
                        <h4 className="font-sans text-trax-red text-lg mb-2">Evenings</h4>
                        <Body>Slow. Quiet. Stories come out naturally. Food, fire, and the kind of conversation that only happens when there's nowhere else to be.</Body>
                    </div>
                </div>
            </div>
        </div>

        <Spacer size="xl" />
        {/* The Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-trax-grey/20 pt-16 items-start">            
            <div>
                <MonoLabel className="mb-4 block">When & Where</MonoLabel>
                <SubHeadline>The Details</SubHeadline>
                <Body className="text-trax-grey mt-6 mb-8">
                    Three days across Dobrogea. No shortcuts. All terrain.
                </Body>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <p className="font-sans text-trax-red text-sm tracking-widest uppercase">Duration</p>
                        <Body className="text-lg">3 days</Body>
                        <p className="font-sans text-trax-grey text-xs">May 1st – 3rd 2026</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-sans text-trax-red text-sm tracking-widest uppercase">Location</p>
                        <Body className="text-lg">Bucharest</Body>
                        <p className="font-sans text-trax-grey text-xs">Start & End Point</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-sans text-trax-red text-sm tracking-widest uppercase">Distance</p>
                        <Body className="text-lg">650km</Body>
                        <p className="font-sans text-trax-grey text-xs">Off-Road Exploration</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-sans text-trax-red text-sm tracking-widest uppercase">Points of Interest</p>
                        <Body className="text-lg">~12</Body>
                        <p className="font-sans text-trax-grey text-xs">Ancient Landmarks</p>
                    </div>
                </div>
            </div>
            <div>
                <img
                    src="/assets/iacob.jpg"
                    alt="Dobrogea explorer"
                    className="w-full h-full object-cover trax-image opacity-90"
                />
            </div>
        </div>

        <Spacer size="xl" />
        {/* The Invitation */}
        <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
            <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
            <p className="font-body text-xl md:text-2xl text-trax-white mb-8">
                There is no public booking button.
            </p>
            <Body className="mx-auto mb-8">
                If this experience resonates, you’ll feel it. If it doesn’t, that’s fine.
            </Body>
            <Button 
                onClick={handleJoinClick}
                className="mb-4"
            >
                Answer the Calling
            </Button>
        </div>

        <div className="text-center mt-24 opacity-40">
            <p className="font-sans text-sm tracking-widest text-trax-white">#DobrogeaCalling</p>
        </div>

      </Container>
    </div>
  );
};