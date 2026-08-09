import { NextResponse } from 'next/server';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { invites, riders } from '@/lib/app/db/schema';
import { mintSessionToken, readInviteToken } from '@/lib/app/tokens';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/app/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Redeem an invite, and bind this device to a rider (BRD ID-02).
 *
 * The token arrives in the POST body, having been read out of the URL fragment
 * by the client. It never appears in a URL this handler sees, so it cannot land
 * in Vercel's access log or a Referer header.
 *
 * Redemption is a conditional UPDATE guarded on redeemed_at being null, and the
 * decision is made from its row count. Reading the row and then writing it
 * would let two phones opening the same forwarded link both find it unspent.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 400 });

  const id = await readInviteToken(token);
  if (!id.ok) return NextResponse.json({ error: 'no' }, { status: 404 });

  const now = new Date();

  // Single-use, atomically. An invite that is already spent, or whose row has
  // outlived the signature's own fourteen days, updates nothing.
  const [claimed] = await db
    .update(invites)
    .set({ redeemedAt: now })
    .where(
      and(
        eq(invites.jti, id.jti),
        eq(invites.riderId, id.riderId),
        isNull(invites.redeemedAt),
        gt(invites.expiresAt, now)
      )
    )
    .returning({ jti: invites.jti });

  if (!claimed) {
    // Nothing was consumed, so it costs nothing to say which of the two it is.
    // "This link has already been used" and "this link has expired" send a
    // rider to different places, and guessing wrong wastes a WhatsApp round trip.
    const [row] = await db
      .select({ redeemedAt: invites.redeemedAt })
      .from(invites)
      .where(eq(invites.jti, id.jti))
      .limit(1);
    if (row?.redeemedAt) return NextResponse.json({ error: 'spent' }, { status: 409 });
    return NextResponse.json({ error: 'expired' }, { status: 410 });
  }

  const [rider] = await db
    .select({ name: riders.name, rung: riders.rung })
    .from(riders)
    .where(eq(riders.id, id.riderId))
    .limit(1);
  if (!rider) return NextResponse.json({ error: 'no' }, { status: 404 });

  const session = await mintSessionToken(id.riderId);
  const res = NextResponse.json({ ok: true, name: rider.name, rung: rider.rung });
  res.cookies.set(SESSION_COOKIE, session, sessionCookieOptions());
  return res;
}
