import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { aftermathLines, experiences } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Founder only. Every running, newest first, with how many lines came back. */
export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const rows = await db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      name: experiences.name,
      year: experiences.year,
      finishedAt: experiences.finishedAt,
      lines: sql<number>`count(${aftermathLines.id})::int`,
    })
    .from(experiences)
    .leftJoin(aftermathLines, eq(aftermathLines.experienceId, experiences.id))
    .groupBy(experiences.id)
    .orderBy(desc(experiences.finishedAt));

  return NextResponse.json({ experiences: rows });
}

export async function DELETE(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(experiences).where(eq(experiences.id, id));
  return NextResponse.json({ ok: true });
}
