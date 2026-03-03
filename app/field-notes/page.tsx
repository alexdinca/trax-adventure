import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllFieldNotes } from '@/lib/field-notes';
import { Container } from '@/components/ui/Container';
import { Headline, MonoLabel } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Field Notes — TRAX Dispatches',
  description: 'Short. Honest. From the terrain. Stories that don\'t perform — they just exist.',
  alternates: { canonical: 'https://ridetrax.eu/field-notes' },
  openGraph: {
    title: 'Field Notes — TRAX Dispatches',
    description: 'Short. Honest. From the terrain.',
    url: 'https://ridetrax.eu/field-notes',
  },
};

export default function FieldNotesPage() {
  const notes = getAllFieldNotes();

  return (
    <div className="min-h-screen animate-fade-in pb-24 pt-32">
      <Container>
        <MonoLabel className="mb-8 block">From the terrain</MonoLabel>
        <Headline className="mb-16 max-w-2xl">
          Field Notes
          <span className="text-trax-grey block mt-2 text-2xl md:text-3xl font-normal">Dispatches from TRAX.</span>
        </Headline>

        {notes.length === 0 ? (
          <p className="font-body text-trax-grey text-lg">No dispatches yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notes.map((note) => (
              <Link
                key={note.slug}
                href={`/field-notes/${note.slug}`}
                className="group border border-trax-grey/20 p-8 transition-all duration-500 hover:border-trax-red hover:bg-trax-red/5 block"
              >
                <div className="flex justify-between items-start mb-4">
                  <MonoLabel className="text-trax-red text-xs">{note.location}</MonoLabel>
                  <MonoLabel className="text-trax-grey/60 text-xs">{note.date}</MonoLabel>
                </div>
                <h2 className="font-sans text-xl md:text-2xl text-trax-white group-hover:text-trax-red transition-colors mb-4">
                  {note.title}
                </h2>
                <p className="font-body text-trax-grey group-hover:text-trax-white transition-colors text-sm leading-relaxed">
                  {note.excerpt}
                </p>
                <span className="font-mono text-xs text-trax-red uppercase tracking-widest group-hover:text-trax-white transition-colors inline-block mt-6">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
