import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { aftermathLines, experiences, participations, windowFor } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. Every running, newest first, with its cast size, how many
 * lines came back, and where its window currently stands.
 */
export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const rows = await db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      name: experiences.name,
      year: experiences.year,
      finishedAt: experiences.finishedAt,
      autoExpire: experiences.autoExpire,
      lines: sql<number>`count(distinct ${aftermathLines.id})::int`,
      cast: sql<number>`count(distinct ${participations.id})::int`,
    })
    .from(experiences)
    .leftJoin(aftermathLines, eq(aftermathLines.experienceId, experiences.id))
    .leftJoin(participations, eq(participations.experienceId, experiences.id))
    .groupBy(experiences.id)
    .orderBy(desc(experiences.finishedAt));

  return NextResponse.json({
    experiences: rows.map((r) => {
      const w = windowFor(r);
      return {
        ...r,
        state: w.state,
        opensAt: w.opensAt.toISOString(),
        closesAt: w.closesAt ? w.closesAt.toISOString() : null,
      };
    }),
  });
}

export async function DELETE(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(experiences).where(eq(experiences.id, id));
  return NextResponse.json({ ok: true });
}
