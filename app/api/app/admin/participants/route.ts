import { NextResponse } from 'next/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { experiences, participations, riders } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. Who rode a given running.
 *
 * Separate from the roster on purpose. The roster is everyone admitted; this
 * is the cast of one running, and only the cast ever gets a link.
 */

async function experienceBySlug(slug: string) {
  const [e] = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  return e ?? null;
}

/** The whole roster, each marked with whether they rode this one. */
export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const experience = await experienceBySlug(slug);
  if (!experience) return NextResponse.json({ error: 'no such running' }, { status: 404 });

  const roster = await db.select().from(riders);
  const rode = await db
    .select({ riderId: participations.riderId })
    .from(participations)
    .where(eq(participations.experienceId, experience.id));

  const set = new Set(rode.map((r) => r.riderId));

  return NextResponse.json({
    experience: experience.name,
    riders: roster.map((r) => ({ ...r, rode: set.has(r.id) })),
    count: set.size,
  });
}

/** Replace the cast wholesale. The console sends the full list it is showing. */
export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    riderIds?: number[];
  } | null;
  if (!body?.slug || !Array.isArray(body.riderIds)) {
    return NextResponse.json({ error: 'slug and riderIds required' }, { status: 400 });
  }

  const experience = await experienceBySlug(body.slug);
  if (!experience) return NextResponse.json({ error: 'no such running' }, { status: 404 });

  const wanted = Array.from(new Set(body.riderIds.filter((n) => Number.isInteger(n))));

  // Drop anyone no longer listed. Their lines survive: removing someone from
  // the cast is a bookkeeping correction, not a reason to delete what they
  // wrote. If it was a real mistake, the lines can be removed deliberately.
  if (wanted.length === 0) {
    await db.delete(participations).where(eq(participations.experienceId, experience.id));
  } else {
    const existing = await db
      .select({ riderId: participations.riderId })
      .from(participations)
      .where(eq(participations.experienceId, experience.id));
    const stale = existing.map((e) => e.riderId).filter((id) => !wanted.includes(id));
    if (stale.length > 0) {
      await db
        .delete(participations)
        .where(
          and(
            eq(participations.experienceId, experience.id),
            inArray(participations.riderId, stale)
          )
        );
    }
    await db
      .insert(participations)
      .values(wanted.map((riderId) => ({ riderId, experienceId: experience.id })))
      .onConflictDoNothing();
  }

  return NextResponse.json({ ok: true, count: wanted.length });
}
