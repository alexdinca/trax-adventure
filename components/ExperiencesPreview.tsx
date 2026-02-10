import React from 'react';
import { Link } from 'react-router-dom';
import { useAptabase } from '@aptabase/react';
import { Container, Spacer } from './ui/Container';
import { Headline, Body, MonoLabel } from './ui/Typography';

export const ExperiencesPreview: React.FC = () => {
  const { trackEvent } = useAptabase();

  const handleExperienceClick = (experienceName: string) => {
    trackEvent('experience_card_click', {
      experience: experienceName,
      source: 'experiences_preview',
      timestamp: new Date().toISOString()
    });
  };

  const handleViewAllClick = () => {
    trackEvent('view_all_experiences_click', {
      source: 'experiences_preview',
      timestamp: new Date().toISOString()
    });
  };

  const experiences = [
    {
      name: 'Dobrogea Calling',
      date: '1st – 3rd May',
      location: 'RO',
      description: '650km across ancient terrain',
      route: '/dobrogea-calling',
      isComingSoon: false
    },
    {
      name: 'Out There',
      date: '14th – 16th August',
      location: 'RO',
      description: 'Self-supported remote camping adventure',
      route: '/out-there',
      isComingSoon: false
    },
    {
      name: 'Carpathian Ridge',
      date: '28th – 30th August',
      location: 'RO',
      description: 'Technical mountain riding',
      route: '/carpathian-ridge',
      isComingSoon: false
    },
    {
      name: 'The Ground',
      date: '14th November',
      location: 'RO',
      description: 'One year anniversary gathering',
      route: '/the-ground',
      isComingSoon: false
    },
    {
      name: 'The Long Way In',
      date: '5 Days / Advanced',
      location: 'RO',
      description: '1370km across ACT Romania',
      route: '/long-way-in',
      isComingSoon: false
    }
  ];

  return (
    <Container>
      <div className="border-t border-trax-grey/20 pt-24">
        <div className="mb-12">
          <MonoLabel className="mb-6 block">Open Conditions</MonoLabel>
          <Headline className="mb-6 max-w-2xl">
            Real <span className="text-trax-red">Adventures</span> await
          </Headline>
          <Body className="max-w-2xl mb-12">
            TRAX designs curated experiences in unexplored terrain. Terrain-led exploration, shared effort, and honest discovery.
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {experiences.map((exp) => 
            exp.isComingSoon ? (
              <div
                key={exp.route}
                className="border border-trax-grey/20 p-6 transition-all duration-500 opacity-50 cursor-not-allowed"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-sans text-lg text-trax-white">
                    {exp.name}
                  </h3>
                  <MonoLabel className="text-xs">{exp.location}</MonoLabel>
                </div>
                <p className="font-mono text-xs text-trax-grey mb-3 uppercase tracking-widest">{exp.date}</p>
                <p className="font-body text-trax-grey text-sm mb-6">
                  {exp.description}
                </p>
                <span className="font-mono text-xs text-trax-grey uppercase tracking-widest">
                  Loading details...
                </span>
              </div>
            ) : (
              <Link
                key={exp.route}
                to={exp.route}
                onClick={() => handleExperienceClick(exp.name.toLowerCase().replace(/ /g, '_'))}
                className="group border border-trax-grey/20 p-6 transition-all duration-500 hover:border-trax-red hover:bg-trax-red/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-sans text-lg text-trax-white group-hover:text-trax-red transition-colors">
                    {exp.name}
                  </h3>
                  <MonoLabel className="text-xs">{exp.location}</MonoLabel>
                </div>
                <p className="font-mono text-xs text-trax-grey mb-3 uppercase tracking-widest">{exp.date}</p>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors text-sm">
                  {exp.description}
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest group-hover:text-trax-white transition-colors inline-block mt-4">
                  Explore →
                </span>
              </Link>
            )
          )}
        </div>

        <Link
          to="/experiences"
          onClick={handleViewAllClick}
          className="inline-flex items-center gap-2 font-mono text-sm text-trax-white border-b border-trax-white/30 hover:border-trax-red hover:text-trax-red transition-colors pb-1"
        >
          View all experiences
          <span>→</span>
        </Link>
      </div>
    </Container>
  );
};
