import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { aftermathLines, experiences, riders } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. Compile the selected lines into a Field Note draft.
 *
 * Returns the .mdx as text, front matter filled and lines already placed, with
 * published set to false. The founder saves it into content/field-notes/ and
 * writes the note around it. He never retypes a rider's sentence (BRD AF-12).
 *
 * Only lines whose author allowed publication are ever included (AF-08), and a
 * rider who wrote nothing does not appear at all (AF-09).
 */

export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  const all = url.searchParams.get('all') === '1';
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);
  if (!experience) return NextResponse.json({ error: 'no such experience' }, { status: 404 });

  const rows = await db
    .select({
      id: aftermathLines.id,
      took: aftermathLines.took,
      gave: aftermathLines.gave,
      mayPublish: aftermathLines.mayPublish,
      selected: aftermathLines.selected,
      rider: riders.name,
    })
    .from(aftermathLines)
    .innerJoin(riders, eq(aftermathLines.riderId, riders.id))
    .where(eq(aftermathLines.experienceId, experience.id));

  const usable = rows
    .filter((r) => r.mayPublish)
    .filter((r) => all || r.selected)
    .filter((r) => r.took.trim() || r.gave.trim());

  const firstName = (n: string) => n.trim().split(/\s+/)[0];

  const body = usable
    .map((r) => {
      const parts: string[] = [];
      if (r.took.trim()) parts.push(r.took.trim());
      if (r.gave.trim()) parts.push(r.gave.trim());
      return `> ${parts.join('\n>\n> ')}\n>\n> — ${firstName(r.rider)}`;
    })
    .join('\n\n');

  const date = experience.finishedAt.toISOString().slice(0, 10);
  const noteSlug = `${slug}-${experience.year}-aftermath`;

  const mdx = `---
title: ""
location: "${experience.name}"
date: "${date}"
excerpt: ""
published: false
---

<!-- Write the note here. The lines below are the riders' own words,
     collected within seven days of the finish. Do not edit them. -->

${body || '<!-- No lines were cleared for publication. -->'}
`;

  return new NextResponse(mdx, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'content-disposition': `attachment; filename="${noteSlug}.mdx"`,
    },
  });
}

/** Everything written for one experience, for the founder to read and choose. */
export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, body.slug))
    .limit(1);
  if (!experience) return NextResponse.json({ error: 'no such experience' }, { status: 404 });

  const rows = await db
    .select({
      id: aftermathLines.id,
      rider: riders.name,
      took: aftermathLines.took,
      gave: aftermathLines.gave,
      mayPublish: aftermathLines.mayPublish,
      selected: aftermathLines.selected,
      submittedAt: aftermathLines.submittedAt,
    })
    .from(aftermathLines)
    .innerJoin(riders, eq(aftermathLines.riderId, riders.id))
    .where(eq(aftermathLines.experienceId, experience.id));

  return NextResponse.json({ experience: experience.name, count: rows.length, rows });
}
