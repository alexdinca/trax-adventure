'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAptabase } from '@aptabase/react';

export const Navigation: React.FC = () => {
  const { trackEvent } = useAptabase();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleJoinClick = () => {
    setMenuOpen(false);
    trackEvent('join_navigation_click', {
      source: 'navigation_menu',
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Experiences', path: '/experiences' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Field Notes', path: '/field-notes' },
    { label: 'Manifesto', path: '/manifesto' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-8 right-6 md:right-12 z-50">
      {/* Desktop: horizontal links */}
      <ul className="hidden md:flex flex-row gap-8 mix-blend-difference">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`
                font-mono text-sm uppercase tracking-widest transition-colors duration-300
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
            className="font-mono text-sm uppercase tracking-widest transition-colors duration-300 text-trax-white hover:text-trax-red"
          >
            Join
          </button>
        </li>
      </ul>

      {/* Mobile: burger button */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 mix-blend-difference"
        >
          <span
            className={`block w-6 h-0.5 bg-trax-white transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-trax-white transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-trax-white transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-12 right-0 bg-trax-black border border-trax-white/20 py-4 px-6 min-w-40">
            <ul className="flex flex-col gap-4 text-right">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      font-mono text-xs uppercase tracking-widest transition-colors duration-300
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
                  className="font-mono text-xs uppercase tracking-widest transition-colors duration-300 text-trax-white hover:text-trax-red"
                >
                  Join
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
