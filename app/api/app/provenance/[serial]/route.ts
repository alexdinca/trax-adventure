import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { artifacts, experiences } from '@/lib/app/db/schema';
import { normalizeSerial } from '@/lib/app/serial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public provenance (BRD LG-09).
 *
 * No identity, no session, no cookie read. It answers a stranger holding a
 * second-hand jacket, and the answer never contains a name — not the owner's,
 * not a previous owner's, not the founder's.
 *
 * The select list below is the enforcement. It names the five public columns
 * rather than selecting the row and deleting fields afterwards, so a column
 * added to `artifacts` later cannot leak by default.
 */

export async function GET(_req: Request, { params }: { params: { serial: string } }) {
  const serial = normalizeSerial(params.serial);
  if (!serial) return NextResponse.json({ found: false }, { status: 404 });

  const [row] = await db
    .select({
      serial: artifacts.serial,
      tier: artifacts.tier,
      year: artifacts.year,
      issuedAt: artifacts.issuedAt,
      status: artifacts.status,
      experience: experiences.name,
    })
    .from(artifacts)
    .leftJoin(experiences, eq(artifacts.experienceId, experiences.id))
    .where(eq(artifacts.serial, serial))
    .limit(1);

  if (!row) return NextResponse.json({ found: false }, { status: 404 });

  return NextResponse.json({
    found: true,
    serial: row.serial,
    tier: row.tier,
    year: row.year,
    issuedAt: row.issuedAt.toISOString().slice(0, 10),
    status: row.status,
    experience: row.experience,
    terms: 'issued never sold',
  });
}
