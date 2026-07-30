import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { aftermathLines, experiences, riders } from '@/lib/app/db/schema';
import { isFounder, mintAftermathToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOURS = 60 * 60 * 1000;

/**
 * Founder only.
 *
 * GET  ?key=…&slug=out-there   mint one link per rider, ready to send
 * POST ?key=…                  create or update an experience running
 *
 * The links are minted here and sent by hand over WhatsApp. That message is
 * the ritual and it stays a human act (BRD AF-11, NT-02).
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
    return NextResponse.json({ error: `no experience with slug ${slug}` }, { status: 404 });
  }

  const opensAt = new Date(experience.finishedAt.getTime() + 24 * HOURS);
  const closesAt = new Date(experience.finishedAt.getTime() + 7 * 24 * HOURS);

  const all = await db.select().from(riders);

  const links = await Promise.all(
    all.map(async (r) => ({
      rider: r.name,
      phone: r.phone,
      url: `https://ridetrax.eu/app/aftermath/${await mintAftermathToken({
        riderId: r.id,
        experienceId: experience.id,
        opensAt,
        closesAt,
      })}`,
    }))
  );

  return NextResponse.json({
    experience: experience.name,
    opensAt: opensAt.toISOString(),
    closesAt: closesAt.toISOString(),
    count: links.length,
    links,
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
