import type { ReactNode } from 'react';
import { Barlow_Condensed, Barlow } from 'next/font/google';

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-bc',
});

const barlow = Barlow({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-bw',
});

export default function BriefingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable}`}>
      {children}
    </div>
  );
}
