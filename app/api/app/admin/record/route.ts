import { NextResponse } from 'next/server';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { artifacts, blanks, completions, experiences } from '@/lib/app/db/schema';
import { isFounder } from '@/lib/app/tokens';
import { SERIAL_PREFIX, formatSerial, normalizeSerial } from '@/lib/app/serial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. What one rider's Record is made of.
 *
 * LG-13: the app never mints standing. Everything here is the founder writing
 * down what already happened in the world — a finish, an object handed over, a
 * moment deliberately left undocumented. There is no rule in this file that
 * derives one fact from another.
 */

type Body = {
  what?: 'completion' | 'artifact' | 'blank';
  riderId?: number;
  // completion
  experienceId?: number;
  completedAt?: string;
  // artifact
  serial?: string;
  prefix?: string;
  number?: number;
  tier?: string;
  year?: number;
  issuedAt?: string;
  status?: string;
  handedBy?: string;
  photo?: string;
  // blank
  occurredAt?: string;
};

function date(value: unknown): Date | null {
  if (typeof value !== 'string' || !value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const riderId = Number(new URL(req.url).searchParams.get('riderId'));
  if (!riderId) return NextResponse.json({ error: 'riderId required' }, { status: 400 });

  const [done, held, unrecorded, all] = await Promise.all([
    db
      .select({
        id: completions.id,
        experienceId: completions.experienceId,
        completedAt: completions.completedAt,
        name: experiences.name,
        year: experiences.year,
      })
      .from(completions)
      .innerJoin(experiences, eq(completions.experienceId, experiences.id))
      .where(eq(completions.riderId, riderId))
      .orderBy(desc(completions.completedAt)),

    db
      .select()
      .from(artifacts)
      .where(eq(artifacts.riderId, riderId))
      .orderBy(desc(artifacts.issuedAt)),

    db
      .select()
      .from(blanks)
      .where(eq(blanks.riderId, riderId))
      .orderBy(desc(blanks.occurredAt)),

    db
      .select({
        id: experiences.id,
        slug: experiences.slug,
        name: experiences.name,
        year: experiences.year,
        finishedAt: experiences.finishedAt,
      })
      .from(experiences)
      .orderBy(asc(experiences.finishedAt)),
  ]);

  return NextResponse.json({
    completions: done,
    artifacts: held,
    blanks: unrecorded,
    experiences: all,
    /** So the console can offer the right letters without hardcoding them. */
    prefixes: SERIAL_PREFIX,
  });
}

export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const riderId = Number(body?.riderId);
  if (!body || !riderId) return NextResponse.json({ error: 'riderId required' }, { status: 400 });

  if (body.what === 'completion') {
    const experienceId = Number(body.experienceId);
    if (!experienceId) {
      return NextResponse.json({ error: 'experienceId required' }, { status: 400 });
    }

    // Default to the day the running finished. It is right almost always, and
    // the console can override it for the rider who turned back and came again.
    let completedAt = date(body.completedAt);
    if (!completedAt) {
      const [e] = await db
        .select({ finishedAt: experiences.finishedAt })
        .from(experiences)
        .where(eq(experiences.id, experienceId))
        .limit(1);
      if (!e) return NextResponse.json({ error: 'no such running' }, { status: 404 });
      completedAt = e.finishedAt;
    }

    const [row] = await db
      .insert(completions)
      .values({ riderId, experienceId, completedAt })
      .onConflictDoUpdate({
        target: [completions.riderId, completions.experienceId],
        set: { completedAt },
      })
      .returning();
    return NextResponse.json({ ok: true, completion: row });
  }

  if (body.what === 'artifact') {
    const issuedAt = date(body.issuedAt);
    if (!issuedAt) return NextResponse.json({ error: 'issuedAt required' }, { status: 400 });

    const year = Number(body.year);
    if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 });

    // Either the serial as it is stamped, or the pieces to build it from.
    // Both go through the same parser, so a serial assembled from parts cannot
    // reach the database in a shape the provenance lookup would refuse.
    const serial = body.serial
      ? normalizeSerial(body.serial)
      : body.prefix && body.number
        ? normalizeSerial(formatSerial(body.prefix, year, Number(body.number)))
        : null;
    if (!serial) {
      return NextResponse.json(
        { error: 'serial not recognised — expected DC-MMXXVI-014' },
        { status: 400 }
      );
    }

    const status = body.status === 'lost' ? 'lost' : 'held';

    const [row] = await db
      .insert(artifacts)
      .values({
        serial,
        riderId,
        experienceId: body.experienceId ? Number(body.experienceId) : null,
        tier: body.tier?.trim() || 'Rider',
        year,
        issuedAt,
        status,
        handedBy: body.handedBy?.trim() || null,
        photo: body.photo?.trim() || null,
      })
      .onConflictDoUpdate({
        target: artifacts.serial,
        set: {
          riderId,
          experienceId: body.experienceId ? Number(body.experienceId) : null,
          tier: body.tier?.trim() || 'Rider',
          year,
          issuedAt,
          status,
          handedBy: body.handedBy?.trim() || null,
          photo: body.photo?.trim() || null,
        },
      })
      .returning();
    return NextResponse.json({ ok: true, artifact: row });
  }

  if (body.what === 'blank') {
    const occurredAt = date(body.occurredAt);
    if (!occurredAt) return NextResponse.json({ error: 'occurredAt required' }, { status: 400 });
    const [row] = await db.insert(blanks).values({ riderId, occurredAt }).returning();
    return NextResponse.json({ ok: true, blank: row });
  }

  return NextResponse.json({ error: 'what must be completion, artifact or blank' }, { status: 400 });
}

export async function DELETE(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const url = new URL(req.url);
  const what = url.searchParams.get('what');
  const id = Number(url.searchParams.get('id'));
  const serial = url.searchParams.get('serial');
  const riderId = Number(url.searchParams.get('riderId'));

  if (what === 'completion' && id) {
    await db.delete(completions).where(eq(completions.id, id));
    return NextResponse.json({ ok: true });
  }
  if (what === 'blank' && id) {
    await db.delete(blanks).where(eq(blanks.id, id));
    return NextResponse.json({ ok: true });
  }
  if (what === 'artifact' && serial && riderId) {
    // Scoped to the rider so a mistyped serial in the console cannot reach into
    // somebody else's object.
    const canonical = normalizeSerial(serial);
    if (!canonical) return NextResponse.json({ error: 'serial not recognised' }, { status: 400 });
    await db
      .delete(artifacts)
      .where(and(eq(artifacts.serial, canonical), eq(artifacts.riderId, riderId)));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'what and id required' }, { status: 400 });
}
