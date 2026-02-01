import React from 'react';
import { useAptabase } from '@aptabase/react';
import { useSEO } from '../hooks/useSEO';
import { Container, Spacer } from './ui/Container';
import { Button } from './ui/Button';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from './ui/Typography';

export const TheLongWayIn: React.FC = () => {
  const { trackEvent } = useAptabase();

  useSEO({
    title: 'The Long Way In — TRAX Adventure',
    description: 'Five days across ACT Romania. 1370km from Maramureș to the Transfăgărășan. Advanced adventure riding through tarmac, gravel, forest roads. Self-supported, group-limited, experience-filtered.',
    ogTitle: 'The Long Way In — TRAX',
    ogDescription: 'Join a five-day traversal of Romania\'s backbone. No shortcuts. No rush. No performance.',
    ogImage: 'https://ridetrax.eu/assets/trax%20landscape.png',
  });

  const handleJoinClick = () => {
    trackEvent('join_button_click', {
      source: 'the_long_way_in_page',
      url: 'https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD',
      timestamp: new Date().toISOString()
    });
    window.open('https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD', '_blank');
  };

  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero Section */}
      <div className="pt-32 pb-20 md:pb-32">
        <Container>
          <div className="flex flex-col gap-6">
            <MonoLabel className="text-trax-red">FIVE DAYS. ONE COUNTRY.</MonoLabel>
            <Headline className="text-5xl md:text-6xl leading-tight">
              The Long Way In
            </Headline>
            <SubHeadline className="text-2xl md:text-3xl text-trax-grey max-w-3xl">
              A five-day TRAX experience across ACT Romania
            </SubHeadline>
            <Body className="text-lg text-trax-grey max-w-2xl mt-4">
              Five days. One country. No shortcuts.
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={handleJoinClick}>Request Access</Button>
              <button className="px-6 py-3 border border-trax-red text-trax-red hover:bg-trax-red/5 transition-colors font-medium">
                View Route Overview
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Spacer size="lg" />

      {/* Why This Exists */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
          <div className="md:col-span-7">
            <SubHeadline className="text-trax-red mb-6">The Purpose</SubHeadline>
            <Headline className="mb-8">
              This Is Not About Crossing Romania
            </Headline>
            <Body className="text-lg space-y-6">
              <p>
                ACT Romania already maps the land. TRAX maps the experience.
              </p>
              <p>
                The Long Way In is a deliberate five-day traversal of Romania's backbone — from Maramureș to the high ridges of the Southern Carpathians. It is designed to slow you down, stretch your endurance, and let the country work on you.
              </p>
              <p>
                No shortcuts. No rush. No performance.
              </p>
            </Body>
          </div>
          <div className="md:col-span-5 flex items-center">
            <div className="w-full aspect-square bg-trax-grey/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-trax-grey">
                <div className="text-sm">Route Visualization</div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* The Journey Overview */}
      <Container>
        <Headline className="mb-12">From the North, Into the Spine</Headline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Route Graphic */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-[1/2] bg-trax-grey/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-trax-grey">
                <div className="text-sm">Route Map</div>
                <div className="text-xs mt-2">North → South</div>
              </div>
            </div>
          </div>

          {/* Key Facts */}
          <div className="space-y-6">
            <div>
              <MonoLabel className="text-trax-red">Duration</MonoLabel>
              <Body className="text-xl mt-2">5 days</Body>
            </div>
            <div>
              <MonoLabel className="text-trax-red">Distance</MonoLabel>
              <Body className="text-xl mt-2">~1370 km</Body>
            </div>
            <div>
              <MonoLabel className="text-trax-red">Terrain</MonoLabel>
              <Body className="text-lg mt-2">Tarmac, gravel, forest roads, rocks, mud</Body>
            </div>
            <div>
              <MonoLabel className="text-trax-red">Off-Road</MonoLabel>
              <Body className="text-xl mt-2">~45% (conditions dependent)</Body>
            </div>
            <div>
              <MonoLabel className="text-trax-red">Level</MonoLabel>
              <Body className="text-xl mt-2">Advanced</Body>
            </div>
            <div>
              <MonoLabel className="text-trax-red">Accommodation</MonoLabel>
              <Body className="text-lg mt-2">Small hotels & guesthouses (camping optional)</Body>
            </div>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Daily Rhythm */}
      <Container>
        <Headline className="mb-12">How the Days Flow</Headline>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <SubHeadline className="text-trax-red mb-4">Morning</SubHeadline>
            <Body className="text-lg leading-relaxed">
              Quiet starts. Route context. Weather and terrain notes. Coffee before noise.
            </Body>
          </div>
          <div>
            <SubHeadline className="text-trax-red mb-4">Riding</SubHeadline>
            <Body className="text-lg leading-relaxed">
              Ride your rhythm. Regroup naturally. No racing, no pressure, no hierarchy.
            </Body>
          </div>
          <div>
            <SubHeadline className="text-trax-red mb-4">Evening</SubHeadline>
            <Body className="text-lg leading-relaxed">
              Food, stories, rest. Phones down when it matters. Some moments stay undocumented.
            </Body>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* The Route — ACT Context */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">ACT Romania, Interpreted by TRAX</Headline>
          <Body className="text-lg space-y-6 mb-8">
            <p>
              This experience follows the official ACT Romania track, newly scouted and refined to preserve its spirit.
            </p>
            <p>
              From wooden churches in Maramureș to painted monasteries in Bucovina, through Transylvania's farmland and citadels, across Apuseni's quiet ridges and into the high drama of Transalpina and Transfăgărășan — the route culminates where effort meets perspective.
            </p>
          </Body>
          <div className="border-l-2 border-trax-red pl-6 py-4">
            <MonoLabel className="text-sm text-trax-grey">Note</MonoLabel>
            <Body className="text-sm text-trax-grey mt-2">
              Riders must respect all local regulations and border areas. No off-track riding.
            </Body>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Who This Is For */}
      <Container>
        <Headline className="mb-12">This Experience Has a Filter</Headline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <SubHeadline className="text-trax-grey mb-6">This Is Not For</SubHeadline>
            <ul className="space-y-4">
              {['First-time off-road riders', 'Content-first mindsets', 'Those in a hurry', 'Riders looking for hand-holding'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-trax-red mt-1">•</span>
                  <Body className="text-lg">{item}</Body>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubHeadline className="text-trax-red mb-6">This Is For</SubHeadline>
            <ul className="space-y-4">
              {['Experienced adventure riders', 'People comfortable with discomfort', 'Riders who value depth over highlights', 'Those ready for five demanding days'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-trax-red mt-1">•</span>
                  <Body className="text-lg">{item}</Body>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Group & Culture */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">How We Ride Together</Headline>
          <Body className="text-lg space-y-6">
            <p>
              Group size is intentionally limited.
            </p>
            <p>
              Everyone rides their own bike. Everyone carries their own responsibility. Once the helmet is on, everyone is equal.
            </p>
            <p>
              Ego stays behind. Presence comes first.
            </p>
          </Body>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* The Rider Kit */}
      <Container>
        <Headline className="mb-12">What You Carry With You</Headline>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {[
            'Event-specific riding layer',
            'Abstract route strip (north → south)',
            'Field notebook (one page per day)',
            'Low-key event mark',
            'Final-day artifact (earned, not given)'
          ].map((item, idx) => (
            <div key={idx} className="border border-trax-grey/20 rounded-lg p-6 flex items-center justify-center text-center">
              <Body className="text-lg">{item}</Body>
            </div>
          ))}
        </div>
        <div className="border-l-2 border-trax-red pl-6 py-4">
          <MonoLabel className="text-sm text-trax-grey">Note</MonoLabel>
          <Body className="text-sm text-trax-grey mt-2">
            The final item is handed out only at the end of Day 5.
          </Body>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Logistics */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">Good to Know</Headline>
          <ul className="space-y-4">
            {[
              { label: 'Start', value: 'Northern Romania (Maramureș area)' },
              { label: 'Finish', value: 'Transfăgărășan (Bâlea area)' },
              { label: 'Bikes', value: 'Adventure / dual-sport, properly equipped' },
              { label: 'Language', value: 'Romanian / English' },
              { label: 'Support', value: 'Self-supported riding with TRAX coordination' }
            ].map((item, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:gap-6">
                <MonoLabel className="text-trax-red flex-shrink-0">{item.label}</MonoLabel>
                <Body className="text-lg">{item.value}</Body>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Access / Call to Action */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">Request Access</Headline>
          <Body className="text-lg space-y-6 mb-8">
            <p>
              The Long Way In is not a mass experience.
            </p>
            <p>
              Participation is limited to preserve pace, safety, and group dynamic. Access is granted based on experience and alignment — not speed or status.
            </p>
          </Body>
          <Button onClick={handleJoinClick}>Request Access</Button>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />

      {/* Footer Line */}
      <Container>
        <div className="text-center py-20">
          <Body className="text-lg text-trax-grey italic max-w-2xl mx-auto">
            You won't remember every kilometer.
            <br />
            But you'll remember who you were when you finished.
          </Body>
          <MonoLabel className="text-trax-red mt-6">#OnTRAX</MonoLabel>
        </div>
      </Container>
    </div>
  );
};
