import { Mark, Block } from '@/components/app/primitives';
import { LookupClient } from './LookupClient';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Provenance.
 *
 * Works logged out, requires no identity, and is the only /app route that may
 * be linked from the marketing site. Not indexed even so: /app is noindex in
 * full (DI-04), and being linkable is not the same as being crawled.
 */
export default function LookupPage() {
  return (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[36rem]">
        <Mark>Provenance</Mark>
        <Block space="lg">
          <LookupClient />
        </Block>
        <Block space="lg">
          <Mark className="text-trax-grey/50">Issued never sold</Mark>
        </Block>
      </div>
    </div>
  );
}
