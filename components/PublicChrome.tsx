'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/ui/Logo';

export function PublicChrome() {
  const pathname = usePathname();
  if (pathname.startsWith('/briefing')) return null;

  return (
    <>
      <div className="fixed top-8 left-6 md:left-12 z-50 mix-blend-difference">
        <Logo />
      </div>
      <div className="relative z-50">
        <Navigation />
      </div>
    </>
  );
}

export function PublicFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/briefing')) return null;

  return (
    <div className="relative z-10">
      <Footer />
    </div>
  );
}
