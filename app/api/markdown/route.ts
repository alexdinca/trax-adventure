import { NextResponse } from 'next/server';
import { fieldNoteDoc, markdownFor, notFoundDoc } from '@/lib/agents/site-markdown';
import { getAllFieldNotes, getFieldNote } from '@/lib/field-notes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The markdown representation of any marketing route.
 *
 * Only ever reached by an internal rewrite from middleware.ts, when a client
 * asked for `text/markdown`. The visible URL stays the page's own, which is
 * the whole point of negotiating rather than publishing a parallel .md tree.
 *
 * Field notes are resolved here rather than in lib/agents/site-markdown because
 * they are read off disk, and keeping fs out of that module lets it be unit
 * tested without a filesystem.
 */
/** Kept in step with middleware.ts, which sets it on the rewrite. */
const MD_PATH_HEADER = 'x-trax-md-path';

export async function GET(req: Request) {
  // The header is authoritative. The query parameter is only a manual escape
  // hatch for testing this route directly; a request that arrives with neither
  // is not a page request and must not be answered with the home page.
  const path =
    req.headers.get(MD_PATH_HEADER) ?? new URL(req.url).searchParams.get('path') ?? '';

  if (!path.startsWith('/')) {
    return new NextResponse(notFoundDoc('/').body, {
      status: 404,
      headers: { 'content-type': 'text/markdown; charset=utf-8', vary: 'Accept' },
    });
  }

  const doc = (() => {
    if (path === '/field-notes' || path === '/field-notes/') {
      return markdownFor('/field-notes', getAllFieldNotes());
    }

    if (path.startsWith('/field-notes/')) {
      const slug = path.slice('/field-notes/'.length).replace(/\/+$/, '');
      const note = getFieldNote(slug);
      // An unpublished draft is not a page. It answers 404 in HTML and must
      // answer 404 here too, or markdown becomes a way to read drafts early.
      if (!note || !note.published) return notFoundDoc(path);
      return fieldNoteDoc({ ...note, slug });
    }

    return markdownFor(path);
  })();

  return new NextResponse(doc.body, {
    status: doc.status,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      // Repeated here because this response can be cached on its own.
      vary: 'Accept',
      'x-robots-tag': 'noindex',
    },
  });
}
