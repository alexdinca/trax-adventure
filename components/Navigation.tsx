import React from 'react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const links = [
    { id: 'home', label: 'Manifesto' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'contact', label: 'Join' },
  ];

  return (
    <nav className="fixed top-8 right-6 md:right-12 z-50 mix-blend-difference">
      <ul className="flex flex-col md:flex-row gap-2 md:gap-8 text-right">
        {links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => onNavigate(link.id)}
              className={`
                font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-300
                ${currentView === link.id ? 'text-trax-red' : 'text-trax-white hover:text-trax-red'}
              `}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};