import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/**
 * The /app data model.
 *
 * Deliberately small. Phase 2 needs only riders, experiences and the lines
 * they write afterwards. Phase 3 adds completions and artifacts on top of the
 * same two anchor tables.
 *
 * The founder's spreadsheet stays the source of truth for who completed what
 * (BRD LG-13). This holds what riders write, which has no other home.
 */

export const riders = pgTable('riders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  /** E.164, the number they are already reachable on. Optional. */
  phone: text('phone'),
  /** Radar | Collective | Rider | Finisher. Rendered as one word (LG-01). */
  rung: text('rung').notNull().default('Collective'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  /** Matches the slug used across the site: out-there, dobrogea-calling, ... */
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  /** Year of this running. An experience repeats; a running does not. */
  year: integer('year').notNull(),
  /** When the riders got home. The Aftermath window is measured from here. */
  finishedAt: timestamp('finished_at', { withTimezone: true }).notNull(),
  /**
   * Whether the seven-day close applies.
   *
   * On by default, because the deadline is part of why the ritual works.
   * Turned off, the window stays open with no end, which is how a running
   * that finished months ago can still be collected. Turned back on, the
   * links expire the moment it is saved, since finish + 7 days is by then
   * in the past. That is the intended way to close a late collection.
   *
   * The twenty-four hour delay before opening is not affected. Sleep first
   * applies whatever else is true.
   */
  autoExpire: boolean('auto_expire').notNull().default(true),
});

/**
 * Who actually rode a given running.
 *
 * The roster is everyone admitted to the Collective. Participation is a
 * different fact, and conflating them means a rider who skipped Dobrogea gets
 * asked what Dobrogea took from them.
 */
export const participations = pgTable(
  'participations',
  {
    id: serial('id').primaryKey(),
    riderId: integer('rider_id')
      .notNull()
      .references(() => riders.id, { onDelete: 'cascade' }),
    experienceId: integer('experience_id')
      .notNull()
      .references(() => experiences.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    once: uniqueIndex('participation_once').on(t.riderId, t.experienceId),
  })
);

/**
 * One rider's two sentences about one experience.
 *
 * Write-once by design, editable only while the window is open. Consent is
 * explicit and per-submission: a rider's words are private unless they say
 * otherwise, and publishing is their decision rather than the founder's
 * (BRD AF-08).
 */
export const aftermathLines = pgTable(
  'aftermath_lines',
  {
    id: serial('id').primaryKey(),
    riderId: integer('rider_id')
      .notNull()
      .references(() => riders.id, { onDelete: 'cascade' }),
    experienceId: integer('experience_id')
      .notNull()
      .references(() => experiences.id, { onDelete: 'cascade' }),
    /** What the terrain took. */
    took: text('took').notNull().default(''),
    /** What it gave. */
    gave: text('gave').notNull().default(''),
    /** May the founder use these words in a Field Note. Defaults to no. */
    mayPublish: boolean('may_publish').notNull().default(false),
    /** Chosen by the founder for the note. Never visible to the rider. */
    selected: boolean('selected').notNull().default(false),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    /** One set of lines per rider per experience. */
    oneEach: uniqueIndex('aftermath_one_each').on(t.riderId, t.experienceId),
  })
);

export type Rider = typeof riders.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type AftermathLine = typeof aftermathLines.$inferSelect;
export type Participation = typeof participations.$inferSelect;

const HOUR = 60 * 60 * 1000;

export interface Window {
  opensAt: Date;
  /** Null when the seven-day close is switched off. */
  closesAt: Date | null;
  state: 'early' | 'open' | 'closed';
}

/**
 * The window, derived from the running rather than baked into a link.
 *
 * Deriving it here means the founder can move it after links are already in
 * riders' hands: a collection can be opened months late, and closed the moment
 * he decides it is done.
 */
export function windowFor(e: Pick<Experience, 'finishedAt' | 'autoExpire'>, now = new Date()): Window {
  const opensAt = new Date(e.finishedAt.getTime() + 24 * HOUR);
  const closesAt = e.autoExpire ? new Date(e.finishedAt.getTime() + 7 * 24 * HOUR) : null;
  const state =
    now < opensAt ? 'early' : closesAt && now > closesAt ? 'closed' : 'open';
  return { opensAt, closesAt, state };
}
