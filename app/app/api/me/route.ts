import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { riders } from '@/lib/app/db/schema';
import { recordFor } from '@/lib/app/ledger';
import { SESSION_COOKIE, riderFromRequest } from '@/lib/app/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The rider's own record, and their right to delete it.
 *
 * This lives under /app rather than /api/app for two reasons that happen to
 * agree. The session cookie is scoped Path=/app, so it is simply not sent to
 * /api/app/*. And a service worker scoped /app/ cannot intercept a request
 * outside its scope, which would make LG-10 — the whole record readable in
 * airplane mode — impossible to satisfy.
 */

export async function GET(req: Request) {
  const riderId = await riderFromRequest(req);
  if (!riderId) return NextResponse.json({ error: 'no' }, { status: 404 });

  const record = await recordFor(riderId);
  if (!record) return NextResponse.json({ error: 'no' }, { status: 404 });

  return NextResponse.json(record, {
    // The service worker keeps its own copy; nothing in between should.
    headers: { 'cache-control': 'no-store, private' },
  });
}

/**
 * Unbind and erase (BRD ID-04).
 *
 * The rider row goes, and every table that references it cascades: their lines,
 * their participations, their completions, their blanks, their invites.
 * Artifacts do not. That reference clears to null instead, because the object
 * exists in the world and a stranger can still look up its provenance — a
 * lookup that has never returned a name (LG-09). Deleting the row would erase
 * the object's history, which is not what was asked for and not the rider's to
 * take.
 */
export async function DELETE(req: Request) {
  const riderId = await riderFromRequest(req);
  if (!riderId) return NextResponse.json({ error: 'no' }, { status: 404 });

  await db.delete(riders).where(eq(riders.id, riderId));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/app',
    maxAge: 0,
  });
  return res;
}
