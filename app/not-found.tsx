import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/Typography';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container className="text-center">
        <MonoLabel className="mb-8 block text-trax-grey/50">404</MonoLabel>
        <p className="font-sans text-2xl md:text-4xl text-trax-white mb-12 tracking-trax-wide">
          This trail doesn't exist. But others do.
        </p>
        <Link
          href="/experiences"
          className="font-mono text-sm uppercase tracking-widest text-trax-red hover:text-trax-white transition-colors duration-300 border-b border-trax-red/40 hover:border-trax-white pb-1"
        >
          Experiences →
        </Link>
      </Container>
    </div>
  );
}
