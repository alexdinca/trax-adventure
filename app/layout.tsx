import type { Metadata, Viewport } from 'next';
import { AptabaseProvider } from '@aptabase/react';
import { Analytics } from '@/components/Analytics';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/ui/Logo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ridetrax.eu'),
  title: {
    default: 'TRAX — Terrain Leads.',
    template: '%s — TRAX',
  },
  description: 'A culture of intentional progression, built around terrain, presence and earned stories. Romania.',
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://ridetrax.eu',
    siteName: 'TRAX',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/android-chrome-512x512.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0E0F11',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TRAX',
  url: 'https://ridetrax.eu',
  logo: 'https://ridetrax.eu/android-chrome-512x512.png',
  description: 'A culture of intentional progression, built around terrain, presence and earned stories. Romania.',
  sameAs: [
    'https://www.instagram.com/ridetrax',
    'https://www.youtube.com/@ridetrax',
    'https://www.facebook.com/share/1DeGDZW2sc/',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Romania',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-trax-black min-h-screen w-full selection:bg-trax-red selection:text-trax-white relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <AptabaseProvider appKey={process.env.NEXT_PUBLIC_APTABASE_KEY!}>
          {/* Global background watermark */}
          <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/trax-tyre-mark.png"
              alt=""
              className="w-[90vw] md:w-[1000px] object-contain max-h-[80vh]"
            />
          </div>

          {/* Fixed header logo */}
          <div className="fixed top-8 left-6 md:left-12 z-50 mix-blend-difference">
            <Logo />
          </div>

          {/* Navigation */}
          <div className="relative z-50">
            <Navigation />
          </div>

          {/* Analytics — fires page_visit on every route change */}
          <Analytics />

          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <Footer />
          </div>
        </AptabaseProvider>
      </body>
    </html>
  );
}
