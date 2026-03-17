import type { Metadata } from 'next';
import { CopyLinkButton } from '@/components/CopyLinkButton';

export const metadata: Metadata = {
  title: 'The TRAX Manifesto',
  description: 'We don\'t chase destinations. We chase presence. The TRAX Manifesto.',
  alternates: { canonical: 'https://ridetrax.eu/manifesto' },
  openGraph: {
    title: 'The TRAX Manifesto',
    description: 'We don\'t chase destinations. We chase presence.',
    url: 'https://ridetrax.eu/manifesto',
  },
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8 md:space-y-12">
          <p className="font-sans font-semibold text-2xl md:text-4xl lg:text-5xl tracking-[0.12em] text-trax-white leading-[1.3]">
            WE DON'T CHASE DESTINATIONS.
            <br />
            WE CHASE PRESENCE.
          </p>

          <p className="font-sans font-light text-lg md:text-2xl lg:text-3xl tracking-[0.08em] text-trax-white/80 leading-[1.6]">
            WE BELIEVE COMFORT DULLS INSTINCT,
            <br />
            AND UNCERTAINTY REVEALS CHARACTER.
          </p>

          <p className="font-sans font-light text-lg md:text-2xl lg:text-3xl tracking-[0.08em] text-trax-white/80 leading-[1.6]">
            WE RIDE WHERE MAPS BECOME SUGGESTIONS,
            <br />
            WHERE EFFORT IS SHARED,
            <br />
            AND EGO DOESN'T SURVIVE LONG.
          </p>

          <p className="font-sans font-semibold text-xl md:text-3xl lg:text-4xl tracking-[0.1em] text-trax-white leading-[1.4]">
            TRAX EXISTS FOR THOSE WHO DON'T NEED APPLAUSE.
            <br />
            JUST TRUTH, TERRAIN AND REAL CONNECTION.
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-trax-grey/60">
            — TRAX, MMXX
          </p>
        </div>

        <div className="mt-12">
          <CopyLinkButton />
        </div>
      </div>
    </div>
  );
}
