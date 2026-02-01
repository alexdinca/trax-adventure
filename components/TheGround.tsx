import React from 'react';
import { useAptabase } from '@aptabase/react';
import { useSEO } from '../hooks/useSEO';
import { Container, Spacer } from './ui/Container';
import { Button } from './ui/Button';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from './ui/Typography';

export const TheGround: React.FC = () => {
  const { trackEvent } = useAptabase();

  useSEO({
    title: 'The Ground — TRAX Anniversary',
    description: 'One year since TRAX began. An open training day at TCS Racing Park. Shared practice, learning, and community. 100 RON. November 14.',
    ogTitle: 'The Ground — TRAX',
    ogDescription: 'Join TRAX for its one-year anniversary. Open training day with shared practice and honest effort.',
    ogImage: 'https://ridetrax.eu/apple-touch-icon.png',
  });

  const handleJoinClick = () => {
    trackEvent('join_button_click', {
      source: 'the_ground_page',
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
            src="/assets/trax landscape.png" 
            alt="The Ground landscapes" 
            className="w-full h-full object-cover trax-image opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            The Ground
          </h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">
            Where TRAX began.
          </p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <MonoLabel className="mb-6 block">Where TRAX began</MonoLabel>
            <Body className="text-xl md:text-2xl leading-relaxed">
              <span className="text-trax-red font-medium">The Ground</span> marks one year since the first TRAX gathering — a return to the place where the idea stopped being a thought and became <span className="text-trax-red font-medium">movement.</span>
            </Body>
          </div>
          <div>
            <Spacer size="sm" />
            <Body className="mb-6">
              On <span className="text-trax-red font-medium">14 November 2026</span>, we go back to <span className="text-trax-red font-medium">TCS Racing Park</span> not to celebrate, but to practice.
            </Body>
            <Body className="mb-6">
              To ride.
              To train.
              To share the space.
            </Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* Why Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start border-t border-trax-grey/20 pt-16 mb-16">
          <div>
            <MonoLabel className="mb-4 block">The Reference</MonoLabel>
            <SubHeadline>Why The Ground</SubHeadline>
          </div>
          <div>
            <Body className="mb-6">
              Every collective needs a reference point.
            </Body>
            <Body className="mb-6">
              <span className="text-trax-red font-medium">Not a peak.</span> <span className="text-trax-red font-medium">Not a highlight.</span>
            </Body>
            <Body className="mb-6">
              A place you can always return to.
            </Body>
            <Body className="mb-6">
              TCS Racing Park is that place for TRAX — controlled terrain where fundamentals are exposed, habits surface, and improvement is honest.
            </Body>
            <Body>
              <span className="text-trax-red font-medium">No scenery to hide behind.</span> Just you, the bike, and repetition.
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
                <h4 className="font-sans text-trax-red text-lg mb-2">Open Training Day</h4>
                <Body>This is a <span className="text-trax-red font-medium">free-flow training environment.</span> You decide what you work on, how hard you push, when you arrive, and when you leave. No schedule. No pressure. Just time on the bike.</Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Shared Practice</h4>
                <Body>Some ride. Some rest. Some talk. Everyone belongs. Advice is exchanged naturally. Progress happens quietly. This is not instruction. It's <span className="text-trax-red font-medium">collective learning.</span></Body>
              </div>
              <div>
                <h4 className="font-sans text-trax-red text-lg mb-2">Grounded Effort</h4>
                <Body>Conditions won't be perfect. They never are in November. Grip varies. Lines change. That's the point. You adapt. You stay loose. You learn.</Body>
              </div>
            </div>
          </div>

          <div className="bg-trax-white/5 p-8 md:p-12 h-fit">
            <SubHeadline className="text-trax-grey">What This Is Not</SubHeadline>
            <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
              <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a competition</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a class</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a show</li>
              <li className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> Not a performance</li>
            </ul>
            <p className="mt-8 font-body text-trax-white opacity-60 italic">
              There is nothing to win here.
            </p>
          </div>
        </div>

        <Spacer size="lg" />

        {/* Practical Frame */}
        <div className="border border-trax-grey/20 p-8 md:p-12 mb-16">
          <SubHeadline className="text-trax-white mb-8">Practical Frame</SubHeadline>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Date</p>
                <Body>14 November 2026</Body>
              </div>
              <div className="mb-8">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Location</p>
                <Body>TCS Racing Park · Romania</Body>
              </div>
              <div>
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Access</p>
                <Body>Circuit access fee: 100 RON / motorcycle (paid on-site)</Body>
              </div>
            </div>
            <div>
              <div className="mb-8">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Arrival</p>
                <Body>Come and leave when it suits you</Body>
              </div>
              <div className="mb-8">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Formalities</p>
                <Body>Declaration signed at reception upon arrival</Body>
              </div>
              <div>
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase mb-2">Facilities</p>
                <Body>Food & drinks available at the Food Court</Body>
              </div>
            </div>
          </div>
        </div>

        <Spacer size="lg" />

        {/* What to Bring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-trax-grey/20 pt-16 mb-16">
          <div>
            <MonoLabel className="mb-4 block">Essentials</MonoLabel>
            <SubHeadline>What to Bring</SubHeadline>
            <ul className="space-y-3 font-body text-trax-white/80 mt-6">
              <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>layered riding gear</span></li>
              <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>patience</span></li>
              <li className="flex items-start gap-3"><span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>curiosity</span></li>
            </ul>
            <p className="mt-6 text-trax-grey text-sm">Weather decides how the day unfolds. Prepare accordingly.</p>
          </div>
          
          <div className="md:col-span-2 md:pl-12 border-l border-trax-grey/20">
            <MonoLabel className="mb-4 block">The Filter</MonoLabel>
            <SubHeadline>Who This Is For</SubHeadline>
            <Body className="mt-6">
              The Ground is for anyone who values <span className="text-trax-red font-medium">practice over spectacle</span>, understands that <span className="text-trax-red font-medium">fundamentals matter</span>, and enjoys riding simply for the sake of riding.
            </Body>
            <p className="mt-6 text-trax-grey text-sm">Skill level is irrelevant. <span className="text-trax-red">Attitude is not.</span></p>
          </div>
        </div>

        <Spacer size="xl" />

        {/* The Invitation */}
        <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
          <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
          <p className="font-body text-xl md:text-2xl text-trax-white mb-8">
            This is not an anniversary party.
          </p>
          <Body className="mx-auto mb-8">
            It's a return. If TRAX means something to you, you'll understand why this day matters.
          </Body>
          <Button 
            onClick={handleJoinClick}
            className="mb-4"
          >
            Show up
          </Button>
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>

      </Container>
    </div>
  );
};
