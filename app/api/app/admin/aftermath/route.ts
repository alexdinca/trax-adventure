import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import {
  aftermathLines,
  experiences,
  participations,
  riders,
  windowFor,
} from '@/lib/app/db/schema';
import { isFounder, mintAftermathToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only.
 *
 * GET  ?key=…&slug=out-there   mint one link per PARTICIPANT, ready to send
 * POST ?key=…                  create or update a running
 * PUT  ?key=…                  toggle the seven-day close on or off
 *
 * Links are minted for the cast of a running, never for the whole roster.
 */

export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, slug))
    .limit(1);
  if (!experience) {
    return NextResponse.json({ error: `no running with slug ${slug}` }, { status: 404 });
  }

  const w = windowFor(experience);

  // Only the cast. A rider who did not ride this one never gets a link.
  const cast = await db
    .select({ id: riders.id, name: riders.name, phone: riders.phone })
    .from(participations)
    .innerJoin(riders, eq(participations.riderId, riders.id))
    .where(eq(participations.experienceId, experience.id));

  const links = await Promise.all(
    cast.map(async (r) => ({
      riderId: r.id,
      rider: r.name,
      phone: r.phone,
      url: `https://ridetrax.eu/app/aftermath/${await mintAftermathToken({
        riderId: r.id,
        experienceId: experience.id,
      })}`,
    }))
  );

  return NextResponse.json({
    experience: experience.name,
    opensAt: w.opensAt.toISOString(),
    closesAt: w.closesAt ? w.closesAt.toISOString() : null,
    autoExpire: experience.autoExpire,
    state: w.state,
    count: links.length,
    links,
  });
}

/** Toggle the seven-day close, or correct a running's finish time. */
export async function PUT(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    autoExpire?: boolean;
    finishedAt?: string;
  } | null;
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.autoExpire === 'boolean') patch.autoExpire = body.autoExpire;
  if (body.finishedAt) {
    const d = new Date(body.finishedAt);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: 'finishedAt is not a date' }, { status: 400 });
    }
    patch.finishedAt = d;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing to change' }, { status: 400 });
  }

  const [row] = await db
    .update(experiences)
    .set(patch)
    .where(eq(experiences.slug, body.slug))
    .returning();
  if (!row) return NextResponse.json({ error: 'no such running' }, { status: 404 });

  const w = windowFor(row);
  return NextResponse.json({
    ok: true,
    experience: row,
    state: w.state,
    closesAt: w.closesAt ? w.closesAt.toISOString() : null,
  });
}

export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    year?: number;
    finishedAt?: string;
  } | null;

  if (!body?.slug || !body.name || !body.year || !body.finishedAt) {
    return NextResponse.json(
      { error: 'slug, name, year and finishedAt are required' },
      { status: 400 }
    );
  }

  const finishedAt = new Date(body.finishedAt);
  if (Number.isNaN(finishedAt.getTime())) {
    return NextResponse.json({ error: 'finishedAt is not a date' }, { status: 400 });
  }

  const [row] = await db
    .insert(experiences)
    .values({ slug: body.slug, name: body.name, year: body.year, finishedAt })
    .onConflictDoUpdate({
      target: experiences.slug,
      // Deliberately does not touch autoExpire: re-saving a running must not
      // silently slam a window the founder opened on purpose.
      set: { name: body.name, year: body.year, finishedAt },
    })
    .returning();

  return NextResponse.json({ ok: true, experience: row });
}

/** Toggle which lines the founder is using, for the compile step. */
export async function PATCH(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    id?: number;
    selected?: boolean;
  } | null;
  if (typeof body?.id !== 'number' || typeof body.selected !== 'boolean') {
    return NextResponse.json({ error: 'id and selected required' }, { status: 400 });
  }

  await db
    .update(aftermathLines)
    .set({ selected: body.selected })
    .where(eq(aftermathLines.id, body.id));

  return NextResponse.json({ ok: true });
}
