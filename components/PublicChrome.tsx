'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/ui/Logo';

/** Surfaces that render without any marketing chrome. */
const BARE = ['/briefing', '/app'];
const isBare = (pathname: string) => BARE.some((p) => pathname.startsWith(p));

export function PublicChrome() {
  const pathname = usePathname();
  if (isBare(pathname)) return null;

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
  if (isBare(pathname)) return null;

  return (
    <div className="relative z-10">
      <Footer />
    </div>
  );
}

/**
 * The site-wide tyre-mark watermark. Suppressed inside /app, where the ground
 * must be plain near-black (BRD DS-06: no imagery as pacing furniture).
 * Left in place on /briefing so those pages are unchanged.
 */
export function BackgroundMark() {
  const pathname = usePathname();
  if (pathname.startsWith('/app')) return null;

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/trax-tyre-mark.png"
        alt=""
        className="w-[90vw] md:w-[1000px] object-contain max-h-[80vh]"
      />
    </div>
  );
}
