import React from 'react';
import { Link } from 'react-router-dom';
import { useAptabase } from '@aptabase/react';

interface NavigationProps {
  currentView: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView }) => {
  const { trackEvent } = useAptabase();

  const handleJoinClick = () => {
    trackEvent('join_navigation_click', {
      source: 'navigation_menu',
      timestamp: new Date().toISOString()
    });
    // Scroll to footer
    setTimeout(() => {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const links = [
    { id: 'home', label: 'Manifesto', path: '/' },
    { id: 'experiences', label: 'Experiences', path: '/experiences' },
    { id: 'contact', label: 'Join', isContact: true },
  ];

  return (
    <nav className="fixed top-8 right-6 md:right-12 z-50 mix-blend-difference">
      <ul className="flex flex-col md:flex-row gap-2 md:gap-8 text-right">
        {links.map((link) => (
          <li key={link.id}>
            {link.isContact ? (
              <button
                onClick={handleJoinClick}
                className={`
                  font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-300
                  ${currentView === link.id ? 'text-trax-red' : 'text-trax-white hover:text-trax-red'}
                `}
              >
                {link.label}
              </button>
            ) : (
              <Link
                to={link.path}
                className={`
                  font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-300
                  ${currentView === link.id ? 'text-trax-red' : 'text-trax-white hover:text-trax-red'}
                `}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};