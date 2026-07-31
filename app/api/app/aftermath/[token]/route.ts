import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import {
  aftermathLines,
  experiences,
  participations,
  windowFor,
} from '@/lib/app/db/schema';
import { readAftermathToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The rider's own window. GET reads its state, POST writes their two lines.
 *
 * The token proves identity. The window is derived from the running, in the
 * database, on every request, so the founder can open a late collection or
 * close a finished one after links are already in riders' hands. Both verbs
 * check it. Nothing here trusts the client (BRD AF-02).
 */

async function resolve(token: string) {
  const id = await readAftermathToken(token);
  if (!id.ok) return null;

  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, id.experienceId))
    .limit(1);
  if (!experience) return null;

  // A link only works for someone recorded as having ridden this running.
  const [rode] = await db
    .select({ id: participations.id })
    .from(participations)
    .where(
      and(
        eq(participations.riderId, id.riderId),
        eq(participations.experienceId, id.experienceId)
      )
    )
    .limit(1);
  if (!rode) return null;

  return { riderId: id.riderId, experience, window: windowFor(experience) };
}

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const r = await resolve(params.token);
  if (!r) return NextResponse.json({ state: 'invalid' }, { status: 404 });

  const { window: w, experience } = r;

  if (w.state === 'early') {
    return NextResponse.json({ state: 'early', opensAt: w.opensAt.toISOString() });
  }
  if (w.state === 'closed') return NextResponse.json({ state: 'closed' });

  const [existing] = await db
    .select()
    .from(aftermathLines)
    .where(
      and(
        eq(aftermathLines.riderId, r.riderId),
        eq(aftermathLines.experienceId, experience.id)
      )
    )
    .limit(1);

  // How long ago it finished, so the page can be honest about a late window
  // instead of pretending the ride was yesterday.
  const daysSince = Math.floor(
    (Date.now() - experience.finishedAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return NextResponse.json({
    state: 'open',
    closesAt: w.closesAt ? w.closesAt.toISOString() : null,
    daysSince,
    experience: { name: experience.name, year: experience.year },
    lines: existing
      ? { took: existing.took, gave: existing.gave, mayPublish: existing.mayPublish }
      : null,
  });
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const r = await resolve(params.token);
  if (!r) return NextResponse.json({ error: 'invalid' }, { status: 404 });

  const { window: w, experience } = r;
  if (w.state === 'early') {
    return NextResponse.json({ error: 'not open yet' }, { status: 403 });
  }
  if (w.state === 'closed') {
    return NextResponse.json({ error: 'window closed' }, { status: 410 });
  }

  const body = (await req.json().catch(() => null)) as {
    took?: unknown;
    gave?: unknown;
    mayPublish?: unknown;
  } | null;
  if (!body) return NextResponse.json({ error: 'bad body' }, { status: 400 });

  const clean = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 2000) : '');
  const took = clean(body.took);
  const gave = clean(body.gave);
  const mayPublish = body.mayPublish === true;

  if (!took && !gave) {
    return NextResponse.json({ error: 'nothing written' }, { status: 400 });
  }

  await db
    .insert(aftermathLines)
    .values({ riderId: r.riderId, experienceId: experience.id, took, gave, mayPublish })
    .onConflictDoUpdate({
      target: [aftermathLines.riderId, aftermathLines.experienceId],
      set: { took, gave, mayPublish, updatedAt: new Date() },
    });

  return NextResponse.json({ ok: true });
}
