import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { riders } from '@/lib/app/db/schema';
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

export async function DELETE(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(riders).where(eq(riders.id, id));
  return NextResponse.json({ ok: true });
}
