import { eq } from 'drizzle-orm';
import { db } from './db';
import {
  aftermathLines,
  artifacts,
  blanks,
  completions,
  experiences,
  participations,
  riders,
  windowFor,
} from './db/schema';
import { mintAftermathToken } from './tokens';

/**
 * One rider's record, assembled.
 *
 * The Record is a single reverse-chronological column interleaved by date, not
 * grouped by type (BRD LG-07, IA-02). So this produces a flat list of dated
 * entries and sorts it once. Anything that wants to render experiences together
 * would be re-introducing the grouping the requirement exists to prevent.
 *
 * A rider's own Aftermath lines are carried inside the experience entry they
 * describe rather than floating on the day they were typed. A late collection
 * can be answered months afterwards, and dating those words to the day of the
 * keystroke would put a sentence about Dobrogea above an event that happened
 * after it.
 */

export interface Entry {
  /** Stable across renders, so the anniversary scroll can address one. */
  id: string;
  /** ISO. The only thing the Record sorts on. */
  date: string;
  kind: 'experience' | 'artifact' | 'note' | 'blank';
  title?: string;
  /** Mono sub-line: the tier, the serial, the status. Never prose. */
  mark?: string;
  /** The rider's own words, verbatim and unstyled (LG-06). */
  took?: string;
  gave?: string;
  serial?: string;
  href?: string;
}

export interface OpenWindow {
  experience: string;
  year: number;
  /** Null when the founder has switched the seven-day close off. */
  closesAt: string | null;
  /** The rider's own signed link, minted per request. */
  href: string;
  /** Whether they have already written something into it. */
  answered: boolean;
}

/** Named Ledger, not Record: shadowing TypeScript's built-in Record<K,V> in
 *  every file that imports this would be a small trap set for later. */
export interface Ledger {
  name: string;
  rung: string;
  /** Reverse chronological. */
  entries: Entry[];
  /** Present only during a live window — roughly eighteen days a year. */
  open: OpenWindow | null;
  /** Whether this rider has finished anything, which gates the install offer. */
  hasFinished: boolean;
  /** ISO, so a cached snapshot can say how old it is rather than pretend. */
  generatedAt: string;
}

const iso = (d: Date) => d.toISOString();

export async function recordFor(riderId: number): Promise<Ledger | null> {
  const [rider] = await db
    .select({ name: riders.name, rung: riders.rung })
    .from(riders)
    .where(eq(riders.id, riderId))
    .limit(1);
  if (!rider) return null;

  const [done, held, unrecorded, written, rode] = await Promise.all([
    db
      .select({
        id: completions.id,
        completedAt: completions.completedAt,
        name: experiences.name,
        year: experiences.year,
        slug: experiences.slug,
        experienceId: experiences.id,
        noteSlug: experiences.noteSlug,
      })
      .from(completions)
      .innerJoin(experiences, eq(completions.experienceId, experiences.id))
      .where(eq(completions.riderId, riderId)),

    db.select().from(artifacts).where(eq(artifacts.riderId, riderId)),

    db.select().from(blanks).where(eq(blanks.riderId, riderId)),

    db
      .select({
        experienceId: aftermathLines.experienceId,
        took: aftermathLines.took,
        gave: aftermathLines.gave,
        selected: aftermathLines.selected,
        mayPublish: aftermathLines.mayPublish,
      })
      .from(aftermathLines)
      .where(eq(aftermathLines.riderId, riderId)),

    db
      .select({
        experience: experiences,
      })
      .from(participations)
      .innerJoin(experiences, eq(participations.experienceId, experiences.id))
      .where(eq(participations.riderId, riderId)),
  ]);

  const linesFor = new Map(written.map((l) => [l.experienceId, l]));

  const entries: Entry[] = [];

  for (const c of done) {
    const mine = linesFor.get(c.experienceId);
    entries.push({
      id: `experience-${c.id}`,
      date: iso(c.completedAt),
      kind: 'experience',
      title: c.name,
      mark: String(c.year),
      took: mine?.took?.trim() || undefined,
      gave: mine?.gave?.trim() || undefined,
    });

    // The note their own words were used in — only if their line was actually
    // chosen, and only if they cleared it for publication in the first place.
    if (c.noteSlug && mine?.selected && mine.mayPublish) {
      entries.push({
        id: `note-${c.experienceId}`,
        // Dated to the running rather than to publication: the note is part of
        // that experience's entry in a rider's life, not a separate event.
        date: iso(c.completedAt),
        kind: 'note',
        title: c.name,
        mark: 'Field Note',
        href: `/field-notes/${c.noteSlug}`,
      });
    }
  }

  for (const a of held) {
    entries.push({
      id: `artifact-${a.serial}`,
      date: iso(a.issuedAt),
      kind: 'artifact',
      mark: a.status === 'held' ? a.tier : `${a.tier} · ${a.status}`,
      serial: a.serial,
      href: `/app/a/${a.serial}`,
    });
  }

  for (const b of unrecorded) {
    entries.push({ id: `blank-${b.id}`, date: iso(b.occurredAt), kind: 'blank' });
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // The Open Window. Conditional, and absent for most of the year.
  let open: OpenWindow | null = null;
  for (const { experience } of rode) {
    const w = windowFor(experience);
    if (w.state !== 'open') continue;
    open = {
      experience: experience.name,
      year: experience.year,
      closesAt: w.closesAt ? iso(w.closesAt) : null,
      href: `/app/aftermath/${await mintAftermathToken({
        riderId,
        experienceId: experience.id,
      })}`,
      answered: Boolean(linesFor.get(experience.id)),
    };
    break;
  }

  return {
    name: rider.name,
    rung: rider.rung,
    entries,
    open,
    hasFinished: done.length > 0,
    generatedAt: iso(new Date()),
  };
}
