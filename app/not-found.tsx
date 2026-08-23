import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/Typography';

/**
 * Returned with a real HTTP 404 by Next.
 *
 * The recovery links are here for people and for agents alike: something that
 * followed a dead link needs somewhere to go next, and a 404 that offers only
 * a dead end forces a crawler to guess. An agent asking for `text/markdown`
 * gets the same recovery list as markdown instead (see middleware.ts).
 */
const ELSEWHERE = [
  { href: '/experiences', label: 'Experiences' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container className="text-center">
        <MonoLabel className="mb-8 block text-trax-grey/50">404</MonoLabel>
        <p className="font-sans text-2xl md:text-4xl text-trax-white mb-12 tracking-trax-wide">
          This trail doesn&apos;t exist. But others do.
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
          {ELSEWHERE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-sm uppercase tracking-widest text-trax-red hover:text-trax-white transition-colors duration-300 border-b border-trax-red/40 hover:border-trax-white pb-1"
            >
              {l.label} →
            </Link>
          ))}
        </div>

        {/* Machine-readable indexes, stated plainly so a crawler that lands
            here can recover without guessing at conventional paths. */}
        <p className="font-mono text-[11px] uppercase tracking-widest text-trax-grey/50">
          <a href="/sitemap.xml" className="hover:text-trax-white transition-colors">
            sitemap.xml
          </a>
          <span className="mx-3">·</span>
          <a href="/llms.txt" className="hover:text-trax-white transition-colors">
            llms.txt
          </a>
        </p>
      </Container>
    </div>
  );
}
