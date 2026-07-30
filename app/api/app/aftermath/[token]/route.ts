import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { aftermathLines, experiences } from '@/lib/app/db/schema';
import { readAftermathToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The rider's own window. GET reads its state, POST writes their two lines.
 *
 * The window is enforced on both verbs, from the signed token, on the server.
 * Nothing here trusts the client (BRD AF-02).
 */

async function resolve(token: string) {
  const w = await readAftermathToken(token);
  if (w.state !== 'open') return { window: w, experience: null };
  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, w.experienceId))
    .limit(1);
  return { window: w, experience: experience ?? null };
}

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const { window: w, experience } = await resolve(params.token);

  if (w.state === 'early') {
    return NextResponse.json({ state: 'early', opensAt: w.opensAt.toISOString() });
  }
  if (w.state === 'closed') return NextResponse.json({ state: 'closed' });
  if (w.state === 'invalid' || !experience) {
    return NextResponse.json({ state: 'invalid' }, { status: 404 });
  }

  const [existing] = await db
    .select()
    .from(aftermathLines)
    .where(
      and(
        eq(aftermathLines.riderId, w.riderId),
        eq(aftermathLines.experienceId, w.experienceId)
      )
    )
    .limit(1);

  return NextResponse.json({
    state: 'open',
    closesAt: w.closesAt.toISOString(),
    experience: { name: experience.name, year: experience.year },
    lines: existing
      ? { took: existing.took, gave: existing.gave, mayPublish: existing.mayPublish }
      : null,
  });
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { window: w, experience } = await resolve(params.token);

  if (w.state === 'early') {
    return NextResponse.json({ error: 'not open yet' }, { status: 403 });
  }
  if (w.state === 'closed') {
    return NextResponse.json({ error: 'window closed' }, { status: 410 });
  }
  if (w.state === 'invalid' || !experience) {
    return NextResponse.json({ error: 'invalid' }, { status: 404 });
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
    .values({
      riderId: w.riderId,
      experienceId: w.experienceId,
      took,
      gave,
      mayPublish,
    })
    .onConflictDoUpdate({
      target: [aftermathLines.riderId, aftermathLines.experienceId],
      set: { took, gave, mayPublish, updatedAt: new Date() },
    });

  return NextResponse.json({ ok: true });
}
