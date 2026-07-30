/**
 * Threshold — the statement set.
 *
 * These are not survey questions. Each one is a sentence the rider makes about
 * themselves, and the answer changes a clause inside that sentence rather than
 * filling a field (BRD TH-03). Self-assessment framed as self-description is
 * the only framing under which an honest "never" is comfortable to give.
 *
 * Terrain items are anchored to ground TRAX actually rides. Readiness items
 * cover the half nobody asks about, which is what actually ends trips.
 */

export type TierId =
  | 'the-ground'
  | 'out-there'
  | 'dobrogea-calling'
  | 'carpathian-ridge'
  | 'long-way-in';

export interface Tier {
  id: TierId;
  name: string;
  /** The ladder position. Order matters and must not be flattened. */
  rung: number;
  /** One line, in TRAX voice, shown when the rider is choosing. */
  character: string;
  /** Where a rider is sent when this tier is not yet within them. */
  below: TierId | null;
}

export const TIERS: Tier[] = [
  {
    id: 'the-ground',
    name: 'The Ground',
    rung: 1,
    character: 'One day, closed circuit. Fundamentals, no ranking.',
    below: null,
  },
  {
    id: 'out-there',
    name: 'Out There',
    rung: 2,
    character: 'Three days, two nights. The first time you sleep out there.',
    below: 'the-ground',
  },
  {
    id: 'dobrogea-calling',
    name: 'Dobrogea Calling',
    rung: 3,
    character: 'Three days, 650km. Wide, open, ancient ground.',
    below: 'the-ground',
  },
  {
    id: 'carpathian-ridge',
    name: 'Carpathian Ridge',
    rung: 4,
    character: 'Three days of mountain. Technical, and tired.',
    below: 'out-there',
  },
  {
    id: 'long-way-in',
    name: 'The Long Way In',
    rung: 5,
    character: 'Five days, 1370km, north to south. Self-supported.',
    below: 'carpathian-ridge',
  },
];

export const tierById = (id: TierId): Tier => TIERS.find((t) => t.id === id)!;

/** Three states, in place, in the sentence. */
export type Answer = 'strong' | 'partial' | 'none';

export type Domain = 'terrain' | 'readiness';

export interface Statement {
  id: string;
  domain: Domain;
  /** The sentence, minus its final clause. */
  lead: string;
  /**
   * The clause that changes when the rider taps. Terrain items distinguish
   * control from survival, which is the whole point: the question is control
   * and fatigue, not completion.
   */
  clause: Record<Answer, string>;
  /**
   * Weight per tier. Absent means the statement does not bear on that tier.
   * 3 = this is what breaks people here. 2 = expected. 1 = helps.
   */
  weight: Partial<Record<TierId, 1 | 2 | 3>>;
  /** Second person, names an action, never character (BRD P3). */
  gap: string;
}

const TERRAIN: Record<Answer, string> = {
  strong: 'I have done this, in control.',
  partial: 'I have done this, and survived it.',
  none: 'I have never done this.',
};

const READINESS: Record<Answer, string> = {
  strong: 'I have done this.',
  partial: 'I have done this once, badly.',
  none: 'I have never done this.',
};

export const STATEMENTS: Statement[] = [
  // ── Terrain ──────────────────────────────────────────────────────────────
  {
    id: 'sand',
    domain: 'terrain',
    lead: 'Deep sand, an hour of it, standing on the pegs.',
    clause: TERRAIN,
    weight: { 'dobrogea-calling': 3, 'long-way-in': 2 },
    gap: 'you have not ridden deep sand for an hour standing',
  },
  {
    id: 'rocky-climb',
    domain: 'terrain',
    lead: 'A rutted forestry climb on loose rock, with no run-up.',
    clause: TERRAIN,
    weight: { 'out-there': 3, 'carpathian-ridge': 3, 'long-way-in': 2 },
    gap: 'you have not climbed loose rock without a run-up',
  },
  {
    id: 'wet-clay',
    domain: 'terrain',
    lead: 'Wet clay on a descent, with the back end stepping out.',
    clause: TERRAIN,
    weight: { 'carpathian-ridge': 3, 'out-there': 2, 'long-way-in': 2 },
    gap: 'you have not held a descent on wet clay',
  },
  {
    id: 'water-crossing',
    domain: 'terrain',
    lead: 'A water crossing deeper than your boot, bottom unknown.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'long-way-in': 2 },
    gap: 'you have not crossed water you could not see the bottom of',
  },
  {
    id: 'loaded-technical',
    domain: 'terrain',
    lead: 'Technical ground with the bike fully loaded.',
    clause: TERRAIN,
    weight: { 'out-there': 3, 'carpathian-ridge': 2, 'long-way-in': 3 },
    gap: 'you have not ridden technical ground with the bike loaded',
  },
  {
    id: 'altitude-trail',
    domain: 'terrain',
    lead: 'A full day of mountain trail, most of it above the treeline.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 3, 'long-way-in': 2 },
    gap: 'you have not spent a full day on trail above the treeline',
  },
  {
    id: 'long-descent',
    domain: 'terrain',
    lead: 'A long technical descent, loaded, with the brakes going away.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 3, 'long-way-in': 2 },
    gap: 'you have not taken a long loaded descent with the brakes fading',
  },
  {
    id: 'gravel-distance',
    domain: 'terrain',
    lead: 'Two hundred kilometres of gravel and dirt road in one day.',
    clause: TERRAIN,
    weight: { 'dobrogea-calling': 3, 'long-way-in': 3, 'out-there': 1 },
    gap: 'you have not put two hundred kilometres of gravel behind you in a day',
  },
  {
    id: 'navigation',
    domain: 'terrain',
    lead: 'Navigating by GPX alone, no signal, nobody ahead to follow.',
    clause: TERRAIN,
    weight: { 'dobrogea-calling': 3, 'long-way-in': 3, 'out-there': 2 },
    gap: 'you have not navigated by GPX with nobody ahead of you',
  },
  {
    id: 'fuel-range',
    domain: 'terrain',
    lead: 'Planning fuel across 250km with nothing open in between.',
    clause: TERRAIN,
    weight: { 'out-there': 3, 'dobrogea-calling': 2, 'long-way-in': 3 },
    gap: 'you have not planned fuel across 250km with nothing in between',
  },
  {
    id: 'pick-up',
    domain: 'terrain',
    lead: 'Picking the bike up, loaded, alone, on a slope.',
    clause: TERRAIN,
    weight: { 'out-there': 3, 'carpathian-ridge': 2, 'long-way-in': 3 },
    gap: 'you have not picked the bike up loaded and alone',
  },
  {
    id: 'group-pace',
    domain: 'terrain',
    lead: 'Riding your own pace inside a group that is faster than you.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'dobrogea-calling': 2, 'long-way-in': 2 },
    gap: 'you have not held your own pace inside a faster group',
  },

  // ── Readiness — the half nobody asks about ───────────────────────────────
  {
    id: 'cold-wet-night',
    domain: 'readiness',
    lead: 'Slept outside, cold and wet, at altitude.',
    clause: READINESS,
    weight: { 'out-there': 3, 'long-way-in': 2 },
    gap: 'you have not slept out cold and wet at altitude',
  },
  {
    id: 'loaded-full-day',
    domain: 'readiness',
    lead: 'A full day in the saddle with the bike loaded.',
    clause: READINESS,
    weight: { 'out-there': 3, 'dobrogea-calling': 2, 'long-way-in': 3 },
    gap: 'you have not ridden a full day with the bike loaded',
  },
  {
    id: 'no-signal',
    domain: 'readiness',
    lead: 'Eight hours with no signal and no way to call anyone.',
    clause: READINESS,
    weight: { 'out-there': 3, 'long-way-in': 2, 'carpathian-ridge': 1 },
    gap: 'you have not gone eight hours without signal',
  },
  {
    id: 'pack-light',
    domain: 'readiness',
    lead: 'Packed three days into soft luggage and nothing else.',
    clause: READINESS,
    weight: { 'out-there': 3, 'long-way-in': 3 },
    gap: 'you have not packed three days into soft luggage',
  },
  {
    id: 'camp-dark',
    domain: 'readiness',
    lead: 'Made camp in the dark, in wind, already finished.',
    clause: READINESS,
    weight: { 'out-there': 3, 'long-way-in': 2 },
    gap: 'you have not made camp in the dark when you were already done',
  },
  {
    id: 'self-repair',
    domain: 'readiness',
    lead: 'Fixed a puncture on the trail with what you were carrying.',
    clause: READINESS,
    weight: { 'out-there': 2, 'dobrogea-calling': 2, 'long-way-in': 3 },
    gap: 'you have not fixed a puncture with what you carry',
  },
  {
    id: 'consecutive-days',
    domain: 'readiness',
    lead: 'Three days of riding, back to back, no rest day.',
    clause: READINESS,
    weight: { 'dobrogea-calling': 2, 'carpathian-ridge': 3, 'out-there': 2 },
    gap: 'you have not ridden three days back to back',
  },
  {
    id: 'five-days',
    domain: 'readiness',
    lead: 'Five days, loaded, self-supported, no going home early.',
    clause: READINESS,
    weight: { 'long-way-in': 3 },
    gap: 'you have not ridden five self-supported days',
  },
  {
    id: 'cook-carry',
    domain: 'readiness',
    lead: 'Carried and cooked your own food for a night out.',
    clause: READINESS,
    weight: { 'out-there': 2, 'long-way-in': 2 },
    gap: 'you have not carried and cooked your own food for a night',
  },
  {
    id: 'slow-down',
    domain: 'readiness',
    lead: 'Been the slowest in the group, and said so.',
    clause: READINESS,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'long-way-in': 2, 'dobrogea-calling': 2 },
    gap: 'you have not been the slowest and said so out loud',
  },
];

/** Statements that bear on a tier, heaviest first. */
export function statementsFor(tier: TierId): Statement[] {
  return STATEMENTS.filter((s) => s.weight[tier] !== undefined).sort(
    (a, b) => (b.weight[tier] ?? 0) - (a.weight[tier] ?? 0)
  );
}
