import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllFieldNotes } from '@/lib/field-notes';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, MonoLabel } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Field Notes',
  description: 'Writing from TRAX riders. Dispatches from the terrain — accounts of rides, places, and what stays after the experience.',
  alternates: { canonical: 'https://ridetrax.eu/field-notes' },
  openGraph: {
    title: 'Field Notes — TRAX',
    description: 'Writing from TRAX riders. Dispatches from the terrain — accounts of rides, places, and what stays after the experience.',
    url: 'https://ridetrax.eu/field-notes',
  },
};

export default function FieldNotesPage() {
  const notes = getAllFieldNotes();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Container>
        <MonoLabel className="mb-8 block">Field Notes</MonoLabel>
        <Headline className="mb-6 max-w-2xl">Dispatches from the Terrain</Headline>
        <p className="font-body text-trax-white/70 text-lg max-w-xl mb-16 leading-relaxed">
          Not reports. Not recaps.<br />
          What stays after the ride.
        </p>

        <div className="divide-y divide-trax-grey/15">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/field-notes/${note.slug}`}
              className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12 py-8 hover:bg-trax-white/[0.02] -mx-6 px-6 transition-colors duration-300"
            >
              <div className="flex-shrink-0 sm:w-36">
                <span className="font-mono text-xs text-trax-grey/60 uppercase tracking-widest">
                  {note.date}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-sans text-xl md:text-2xl font-medium text-trax-white group-hover:text-trax-red transition-colors duration-200 leading-snug mb-2">
                  {note.title}
                  <span className="ml-3 text-trax-red font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h2>
                <p className="font-body text-trax-white/50 text-sm leading-relaxed mb-2">
                  {note.excerpt}
                </p>
                {note.location && (
                  <span className="font-mono text-xs text-trax-grey/50 uppercase tracking-widest">
                    {note.location}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <Spacer size="xl" />
      </Container>
    </div>
  );
}
