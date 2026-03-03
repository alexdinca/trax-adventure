'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAptabase } from '@aptabase/react';

export const Navigation: React.FC = () => {
  const { trackEvent } = useAptabase();
  const pathname = usePathname();

  const handleJoinClick = () => {
    trackEvent('join_navigation_click', {
      source: 'navigation_menu',
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const links = [
    { label: 'Experiences', path: '/experiences' },
    { label: 'Field Notes', path: '/field-notes' },
    { label: 'Manifesto', path: '/manifesto' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-8 right-6 md:right-12 z-50 mix-blend-difference">
      <ul className="flex flex-col md:flex-row gap-2 md:gap-8 text-right">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`
                font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-300
                ${isActive(link.path) ? 'text-trax-red' : 'text-trax-white hover:text-trax-red'}
              `}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleJoinClick}
            aria-label="Join the TRAX collective"
            className="font-mono text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 text-trax-white hover:text-trax-red"
          >
            Join
          </button>
        </li>
      </ul>
    </nav>
  );
};
