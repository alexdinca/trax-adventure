import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { RUNGS, riders } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. The roster.
 *
 * Admission stays a human decision made in WhatsApp; this only records who was
 * admitted, so links can be minted for them. Rung is recorded but never shown
 * as a ranking or a count (BRD LG-01, LG-02).
 */

export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });
  const all = await db.select().from(riders);
  return NextResponse.json({ count: all.length, riders: all });
}

export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as
    | { name?: string; phone?: string; rung?: string }
    | { riders?: { name: string; phone?: string; rung?: string }[] }
    | null;
  if (!body) return NextResponse.json({ error: 'bad body' }, { status: 400 });

  const incoming =
    'riders' in body && Array.isArray(body.riders)
      ? body.riders
      : 'name' in body && body.name
        ? [body as { name: string; phone?: string; rung?: string }]
        : [];

  if (incoming.length === 0) {
    return NextResponse.json({ error: 'name, or riders[], required' }, { status: 400 });
  }

  const created = [];
  for (const r of incoming) {
    if (!r.name?.trim()) continue;
    const [row] = await db
      .insert(riders)
      .values({
        name: r.name.trim(),
        phone: r.phone?.trim() || null,
        rung: r.rung?.trim() || 'Collective',
      })
      .returning();
    created.push(row);
  }

  return NextResponse.json({ ok: true, created });
}

/**
 * Move a rider's standing, or correct their number.
 *
 * Standing is set here by hand and nowhere else. LG-13: the app never mints
 * it — no rule in this codebase promotes anybody because a row appeared. The
 * founder's spreadsheet remains the source of truth and this records what it
 * already says.
 */
export async function PATCH(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    id?: number;
    rung?: string;
    name?: string;
    phone?: string;
  } | null;
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body?.rung === 'string') {
    if (!(RUNGS as readonly string[]).includes(body.rung)) {
      return NextResponse.json({ error: `rung must be one of ${RUNGS.join(', ')}` }, { status: 400 });
    }
    patch.rung = body.rung;
  }
  if (typeof body?.name === 'string' && body.name.trim()) patch.name = body.name.trim();
  if (typeof body?.phone === 'string') patch.phone = body.phone.trim() || null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing to change' }, { status: 400 });
  }

  const [row] = await db.update(riders).set(patch).where(eq(riders.id, id)).returning();
  if (!row) return NextResponse.json({ error: 'no such rider' }, { status: 404 });
  return NextResponse.json({ ok: true, rider: row });
}

export async function DELETE(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(riders).where(eq(riders.id, id));
  return NextResponse.json({ ok: true });
}
