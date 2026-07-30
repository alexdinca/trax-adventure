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
   *
   * Weight is NOT how hard the thing is. It is how much the group pays if you
   * arrive without it, which is the only question the ladder actually asks
   * (Bible v2, The Nevers: "a never spent in the wrong place is spent on the
   * group, not on you").
   *
   *   3 — nobody can carry this for you. Unspent here, it costs the group a
   *       real risk. This is what routes a rider down a rung.
   *   2 — the group absorbs it, but everyone feels it. Slower days, longer
   *       stops, someone waiting in the cold.
   *   1 — yours alone to feel. It will teach you something and cost nobody.
   *
   * Worked example, because it is the one that got this wrong first time:
   * picking up a loaded bike alone is weight 1 on every group experience.
   * On a TRAX ride nobody does it alone. Six people lift it and the day
   * continues. It is weight 1 on The Long Way In too, for the same reason.
   * Compare a loaded technical descent, which is weight 3 on Carpathian
   * Ridge: no one can ride it for you, and the group cannot absorb it.
   */
  weight: Partial<Record<TierId, 1 | 2 | 3>>;
  /** Second person, names an action, never character (BRD P3). */
  gap: string;
  /**
   * The same never, stated as the thing the experience will hand you. This is
   * what Threshold actually reports: not what you lack, but what you are
   * going there to collect.
   */
  willBe: string;
  /** How to arrive ready for it. Practical, specific, no encouragement. */
  prepare: string;
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
    weight: { 'dobrogea-calling': 2, 'long-way-in': 1 },
    gap: 'you have not ridden deep sand for an hour standing',
    willBe: 'a long hour of deep sand, standing',
    prepare: 'Drop your pressures and look far ahead. The bike wants to swim. Let it, weight back, and stay on the throttle.',
  },
  {
    id: 'rocky-climb',
    domain: 'terrain',
    lead: 'A rutted forestry climb on loose rock, with no run-up.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'long-way-in': 2 },
    gap: 'you have not climbed loose rock without a run-up',
    willBe: 'a loose rocky climb taken from a standstill',
    prepare: 'Pick the line before you stop, not after. Momentum you did not build at the bottom cannot be found halfway up.',
  },
  {
    id: 'wet-clay',
    domain: 'terrain',
    lead: 'Wet clay on a descent, with the back end stepping out.',
    clause: TERRAIN,
    weight: { 'carpathian-ridge': 2, 'out-there': 2, 'long-way-in': 2 },
    gap: 'you have not held a descent on wet clay',
    willBe: 'a descent on wet clay with the back stepping out',
    prepare: 'Off the front brake, feet up, and let it move under you. Clay punishes tension more than it punishes speed.',
  },
  {
    id: 'water-crossing',
    domain: 'terrain',
    lead: 'A water crossing deeper than your boot, bottom unknown.',
    clause: TERRAIN,
    weight: { 'out-there': 1, 'carpathian-ridge': 1, 'long-way-in': 1 },
    gap: 'you have not crossed water you could not see the bottom of',
    willBe: 'a crossing where you cannot see the bottom',
    prepare: 'Walk it first. Someone always does, and it is never wasted time.',
  },
  {
    id: 'loaded-technical',
    domain: 'terrain',
    lead: 'Technical ground with the bike fully loaded.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 3, 'long-way-in': 2 },
    gap: 'you have not ridden technical ground with the bike loaded',
    willBe: 'technical ground with everything you own on the bike',
    prepare: 'Ride the loaded bike before the trip, not on it. Weight changes where it turns and how long it takes to stop.',
  },
  {
    id: 'altitude-trail',
    domain: 'terrain',
    lead: 'A full day of mountain trail, most of it above the treeline.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'long-way-in': 1 },
    gap: 'you have not spent a full day on trail above the treeline',
    willBe: 'a full day above the treeline',
    prepare: 'Weather up there changes without asking. Carry the layer you are sure you will not need.',
  },
  {
    id: 'long-descent',
    domain: 'terrain',
    lead: 'A long technical descent, loaded, with the brakes going away.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 3, 'long-way-in': 2 },
    gap: 'you have not taken a long loaded descent with the brakes fading',
    willBe: 'a long loaded descent with the brakes going soft',
    prepare: 'Use the engine, alternate the brakes, and stop before you need to. Fade arrives quietly and leaves late.',
  },
  {
    id: 'gravel-distance',
    domain: 'terrain',
    lead: 'Two hundred kilometres of gravel and dirt road in one day.',
    clause: TERRAIN,
    weight: { 'dobrogea-calling': 3, 'long-way-in': 2, 'out-there': 1 },
    gap: 'you have not put two hundred kilometres of gravel behind you in a day',
    willBe: 'two hundred kilometres of gravel between breakfast and dinner',
    prepare: 'The problem is not the ground, it is hour five. Eat before you are hungry and drink before you are thirsty.',
  },
  {
    id: 'navigation',
    domain: 'terrain',
    lead: 'Navigating by GPX alone, no signal, nobody ahead to follow.',
    clause: TERRAIN,
    weight: { 'dobrogea-calling': 2, 'long-way-in': 2, 'out-there': 1 },
    gap: 'you have not navigated by GPX with nobody ahead of you',
    willBe: 'a day where the route is yours to find',
    prepare: 'Load the GPX on two devices and know how to read it moving. Learning the app at a junction costs the group daylight.',
  },
  {
    id: 'fuel-range',
    domain: 'terrain',
    lead: 'Planning fuel across 250km with nothing open in between.',
    clause: TERRAIN,
    weight: { 'out-there': 1, 'dobrogea-calling': 2, 'long-way-in': 2 },
    gap: 'you have not planned fuel across 250km with nothing in between',
    willBe: 'a stretch with nothing open for 250 kilometres',
    prepare: 'Know your real loaded off-road range, not the brochure figure. Fill when you can, not when you must.',
  },
  {
    id: 'pick-up',
    domain: 'terrain',
    lead: 'Picking the bike up, loaded, alone, on a slope.',
    clause: TERRAIN,
    weight: { 'out-there': 1, 'carpathian-ridge': 1, 'long-way-in': 1 },
    gap: 'you have not picked the bike up loaded and alone',
    willBe: 'the bike on its side, loaded',
    prepare: 'Learn the technique anyway. On a TRAX ride hands arrive inside a minute, but knowing it changes how you ride.',
  },
  {
    id: 'group-pace',
    domain: 'terrain',
    lead: 'Riding your own pace inside a group that is faster than you.',
    clause: TERRAIN,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'dobrogea-calling': 2, 'long-way-in': 2 },
    gap: 'you have not held your own pace inside a faster group',
    willBe: 'a group moving faster than you would alone',
    prepare: 'Ride your pace. The group slows for the group, and nobody remembers afterwards who was quick.',
  },

  // ── Readiness — the half nobody asks about ───────────────────────────────
  {
    id: 'cold-wet-night',
    domain: 'readiness',
    lead: 'Slept outside, cold and wet, at altitude.',
    clause: READINESS,
    weight: { 'out-there': 3, 'long-way-in': 2 },
    gap: 'you have not slept out cold and wet at altitude',
    willBe: 'your first night out, cold, at altitude',
    prepare: 'A bag rated to around 0 to 5°C, an insulated mat, and a dry layer you never ride in. Cold nights are remembered longer than heavy panniers.',
  },
  {
    id: 'loaded-full-day',
    domain: 'readiness',
    lead: 'A full day in the saddle with the bike loaded.',
    clause: READINESS,
    weight: { 'out-there': 2, 'dobrogea-calling': 2, 'long-way-in': 3 },
    gap: 'you have not ridden a full day with the bike loaded',
    willBe: 'a full day in the saddle with the bike loaded',
    prepare: 'Set the bike up for your height before you go. Bar position and lever angle decide how you feel at hour seven.',
  },
  {
    id: 'no-signal',
    domain: 'readiness',
    lead: 'Eight hours with no signal and no way to call anyone.',
    clause: READINESS,
    weight: { 'out-there': 1, 'long-way-in': 1, 'carpathian-ridge': 1 },
    gap: 'you have not gone eight hours without signal',
    willBe: 'a long stretch with no signal and no way to call',
    prepare: 'Tell someone at home the plan and the return time. Then let the phone be dead weight.',
  },
  {
    id: 'pack-light',
    domain: 'readiness',
    lead: 'Packed three days into soft luggage and nothing else.',
    clause: READINESS,
    weight: { 'out-there': 2, 'long-way-in': 2 },
    gap: 'you have not packed three days into soft luggage',
    willBe: 'three days carried in soft luggage',
    prepare: 'Lay it all out, then take away a third. If you are asking whether you need it, you do not.',
  },
  {
    id: 'camp-dark',
    domain: 'readiness',
    lead: 'Made camp in the dark, in wind, already finished.',
    clause: READINESS,
    weight: { 'out-there': 2, 'long-way-in': 1 },
    gap: 'you have not made camp in the dark when you were already done',
    willBe: 'putting a tent up in the dark with nothing left',
    prepare: 'Pitch it once at home, at night, in the cold. The first time should not be the real time.',
  },
  {
    id: 'self-repair',
    domain: 'readiness',
    lead: 'Fixed a puncture on the trail with what you were carrying.',
    clause: READINESS,
    weight: { 'out-there': 1, 'dobrogea-calling': 1, 'long-way-in': 3 },
    gap: 'you have not fixed a puncture with what you carry',
    willBe: 'a repair on the trail with what you carry',
    prepare: 'Practise a plug and a tube change in the garage. Reading the instructions in the rain is not the same thing.',
  },
  {
    id: 'consecutive-days',
    domain: 'readiness',
    lead: 'Three days of riding, back to back, no rest day.',
    clause: READINESS,
    weight: { 'dobrogea-calling': 2, 'carpathian-ridge': 2, 'out-there': 1 },
    gap: 'you have not ridden three days back to back',
    willBe: 'three days back to back with no rest day',
    prepare: 'Day two is the one. Sleep properly on night one and eat more than you want to.',
  },
  {
    id: 'five-days',
    domain: 'readiness',
    lead: 'Five days, loaded, self-supported, no going home early.',
    clause: READINESS,
    weight: { 'long-way-in': 3 },
    gap: 'you have not ridden five self-supported days',
    willBe: 'five days out, loaded, with no going home early',
    prepare: 'The body settles around day three. Getting there is a matter of pacing days one and two.',
  },
  {
    id: 'cook-carry',
    domain: 'readiness',
    lead: 'Carried and cooked your own food for a night out.',
    clause: READINESS,
    weight: { 'out-there': 1, 'long-way-in': 1 },
    gap: 'you have not carried and cooked your own food for a night',
    willBe: 'carrying and cooking your own food for the night',
    prepare: 'Simple, calorie-dense, nothing that needs a cooler. Stoves get shared, so coordinate before you buy one.',
  },
  {
    id: 'slow-down',
    domain: 'readiness',
    lead: 'Been the slowest in the group, and said so.',
    clause: READINESS,
    weight: { 'out-there': 2, 'carpathian-ridge': 2, 'long-way-in': 2, 'dobrogea-calling': 2 },
    gap: 'you have not been the slowest and said so out loud',
    willBe: 'being the slowest, and saying so',
    prepare: 'Say it early. Every rider here has been that person, and the day works better when it is spoken.',
  },
];

/** Statements that bear on a tier, heaviest first. */
export function statementsFor(tier: TierId): Statement[] {
  return STATEMENTS.filter((s) => s.weight[tier] !== undefined).sort(
    (a, b) => (b.weight[tier] ?? 0) - (a.weight[tier] ?? 0)
  );
}
