import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFieldNote, getAllFieldNoteSlugs } from '@/lib/field-notes';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/Typography';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFieldNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) return {};
  return {
    title: `${note.title} — TRAX Field Notes`,
    description: note.excerpt,
    alternates: { canonical: `https://ridetrax.eu/field-notes/${slug}` },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      url: `https://ridetrax.eu/field-notes/${slug}`,
    },
  };
}

export default async function FieldNotePage({ params }: Props) {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) notFound();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Container>
        <div className="max-w-2xl mx-auto">
          <Link
            href="/field-notes"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-trax-grey/50 hover:text-trax-white transition-colors duration-200 mb-12"
          >
            ← Field Notes
          </Link>

          <div className="mb-10">
            <MonoLabel className="block mb-4">{note.date} · {note.location}</MonoLabel>
            <h1 className="font-sans font-medium text-3xl md:text-4xl lg:text-5xl text-trax-white leading-tight tracking-trax-wide mb-6">
              {note.title}
            </h1>
            <p className="font-body text-trax-white/60 text-lg italic leading-relaxed">
              {note.excerpt}
            </p>
          </div>

          <div className="w-12 h-[1px] bg-trax-red mb-12" />

          <div className="font-body text-trax-white/80 text-lg leading-[1.85] space-y-6 whitespace-pre-line">
            {note.content.trim()}
          </div>
        </div>
      </Container>
    </div>
  );
}
