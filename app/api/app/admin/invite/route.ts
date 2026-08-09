import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { invites, riders } from '@/lib/app/db/schema';
import { isFounder, mintInviteToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

/**
 * Founder only. Mint a rider's bind link (BRD ID-02).
 *
 * The JWT goes in the URL fragment, which browsers never send to a server, so
 * it cannot land in Vercel's access logs or a Referer header on the way to the
 * rider's phone.
 *
 * Minting again for the same rider is allowed and expected — a link gets lost,
 * a phone gets replaced. Each mint is its own single-use row, so the old link
 * keeps working until someone spends it and the new one is not a replacement
 * for it. Nothing here revokes anything: unbinding is the rider's to do (ID-04).
 */

export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const riderId = Number(new URL(req.url).searchParams.get('riderId'));
  if (!riderId) return NextResponse.json({ error: 'riderId required' }, { status: 400 });

  const rows = await db
    .select({
      jti: invites.jti,
      expiresAt: invites.expiresAt,
      redeemedAt: invites.redeemedAt,
      createdAt: invites.createdAt,
    })
    .from(invites)
    .where(eq(invites.riderId, riderId))
    .orderBy(desc(invites.createdAt));

  return NextResponse.json({ invites: rows });
}

export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { riderId?: number } | null;
  const riderId = Number(body?.riderId);
  if (!riderId) return NextResponse.json({ error: 'riderId required' }, { status: 400 });

  const [rider] = await db
    .select({ id: riders.id, name: riders.name, phone: riders.phone })
    .from(riders)
    .where(eq(riders.id, riderId))
    .limit(1);
  if (!rider) return NextResponse.json({ error: 'no such rider' }, { status: 404 });

  // The row first, then the signature over it. A token that verifies but has
  // no row is then always a forgery rather than a race we lost.
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + FOURTEEN_DAYS);
  await db.insert(invites).values({ jti, riderId, purpose: 'bind', expiresAt });

  const token = await mintInviteToken({ riderId, jti });

  return NextResponse.json({
    ok: true,
    rider: rider.name,
    phone: rider.phone,
    expiresAt: expiresAt.toISOString(),
    url: `https://ridetrax.eu/app/bind#${token}`,
  });
}
