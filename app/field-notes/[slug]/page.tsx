import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getFieldNote, getAllFieldNoteSlugs } from '@/lib/field-notes';
import { Container } from '@/components/ui/Container';
import { MonoLabel, Divider } from '@/components/ui/Typography';
import Link from 'next/link';

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllFieldNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const note = getFieldNote(params.slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `https://ridetrax.eu/field-notes/${params.slug}` },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      url: `https://ridetrax.eu/field-notes/${params.slug}`,
    },
  };
}

export default function FieldNotePage({ params }: Params) {
  const note = getFieldNote(params.slug);
  if (!note) notFound();

  return (
    <div className="min-h-screen animate-fade-in pb-24 pt-32">
      <Container className="max-w-[800px]">
        {/* Back link */}
        <Link
          href="/field-notes"
          className="font-mono text-xs uppercase tracking-widest text-trax-grey hover:text-trax-white transition-colors duration-300 mb-12 block"
        >
          ← Field Notes
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex gap-6 items-center mb-6">
            <MonoLabel className="text-trax-red">{note.location}</MonoLabel>
            <span className="text-trax-grey/30">·</span>
            <MonoLabel className="text-trax-grey/60">{note.date}</MonoLabel>
          </div>
          <h1 className="font-sans text-3xl md:text-5xl text-trax-white font-medium tracking-trax-wide leading-tight">
            {note.title}
          </h1>
        </div>

        <Divider />

        {/* MDX content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-p:font-body prose-p:text-trax-white/80 prose-p:leading-[1.8]
          prose-headings:font-sans prose-headings:text-trax-white prose-headings:tracking-trax-wide
          prose-strong:text-trax-red prose-strong:font-medium
          prose-a:text-trax-red prose-a:no-underline hover:prose-a:text-trax-white
          prose-hr:border-trax-grey/20
          mt-12"
        >
          <MDXRemote source={note.content} />
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-trax-grey/20">
          <Link
            href="/field-notes"
            className="font-mono text-xs uppercase tracking-widest text-trax-grey hover:text-trax-red transition-colors duration-300"
          >
            ← All dispatches
          </Link>
        </div>
      </Container>
    </div>
  );
}
