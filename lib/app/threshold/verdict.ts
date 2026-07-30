/**
 * Threshold — the verdict engine.
 *
 * Deterministic. No model, no network, no randomness (BRD TH-06). It runs in
 * under a millisecond, which is why there is no loading state anywhere near it:
 * narrating a computation that is not happening is a lie the rider can feel.
 *
 * It never shows its work. No score, no band, no percentage, no per-item
 * feedback (BRD P2/TH-07). It names at most two specific things and one tier.
 */

import {
  type Answer,
  type Statement,
  type TierId,
  statementsFor,
  tierById,
} from './statements';

export type Answers = Record<string, Answer>;

export interface Verdict {
  /** Whether the tier is within the rider now. */
  within: boolean;
  /** The tier that was asked about. */
  tier: TierId;
  /** At most two, most consequential first. Empty when `within` is true. */
  gaps: string[];
  /** Where to go instead. Null when `within`, or when already at the foot. */
  send: TierId | null;
  /** The verdict paragraph, assembled from founder-written fragments. */
  paragraph: string;
  /** Plain-text summary the rider may carry into WhatsApp, after reading it. */
  summary: string;
}

/** How far short a single answer falls, scaled by how much it matters here. */
function deficit(s: Statement, tier: TierId, a: Answer | undefined): number {
  const w = s.weight[tier] ?? 0;
  if (a === 'strong') return 0;
  if (a === 'partial') return w * 0.5;
  return w; // 'none', or unanswered
}

/**
 * The Ground has no filter, by doctrine: foundation, closed circuit, no
 * ranking, for anyone who respects fundamentals. A readiness test that gates
 * the entry rung would contradict the ladder it is built to serve.
 */
const UNGATED: TierId[] = ['the-ground'];

/** A single 'never' on something this heavy is disqualifying on its own. */
const HARD_STOP_WEIGHT = 3;

/**
 * Below this, the shortfall is real and the group absorbs it. Never is the
 * ordinary condition (Bible v2, The Nevers), so this is deliberately generous:
 * a rider may arrive with several unspent nevers and still belong here, as
 * long as none of them is one the group would pay for.
 */
const TOLERANCE = 3.0;

export function evaluate(tier: TierId, answers: Answers): Verdict {
  const t = tierById(tier);

  if (UNGATED.includes(tier)) {
    return {
      within: true,
      tier,
      gaps: [],
      send: null,
      paragraph: OPEN_GROUND,
      summary: `Threshold · ${t.name}\nThis one is open. Nothing to clear.`,
    };
  }

  const relevant = statementsFor(tier);

  const scored = relevant
    .map((s) => ({ s, d: deficit(s, tier, answers[s.id]) }))
    .filter((x) => x.d > 0)
    .sort((a, b) => b.d - a.d);

  const total = scored.reduce((sum, x) => sum + x.d, 0);

  const hardStop = scored.some(
    (x) => (x.s.weight[tier] ?? 0) >= HARD_STOP_WEIGHT && answers[x.s.id] !== 'partial' && x.d > 0
  );

  const within = !hardStop && total <= TOLERANCE;

  if (within) {
    const paragraph = total === 0 ? CLEAN(t.name) : NEARLY(t.name);
    return {
      within: true,
      tier,
      gaps: [],
      send: null,
      paragraph,
      summary: `Threshold · ${t.name}\nWithin.`,
    };
  }

  const gaps = scored.slice(0, 2).map((x) => x.s.gap);
  const send = t.below;
  const sendName = send ? tierById(send).name : null;

  return {
    within: false,
    tier,
    gaps,
    send,
    paragraph: NOT_YET(t.name, gaps, sendName),
    summary:
      `Threshold · ${t.name}\nNot yet. Two things: ${gaps.join('; ')}.` +
      (sendName ? `\nStarting at ${sendName}.` : ''),
  };
}

/* ── The corpus ───────────────────────────────────────────────────────────
   Founder-written. Short declaratives, second person, present tense. No
   hedging, no "you may find that", no exclamation marks. Names actions,
   never character: a gap is finite and repairable, an essence claim is not.

   DRAFT — Alex to revise. This is the moat and it should read as one person,
   not as a system. Nothing here is generated at runtime.
   ─────────────────────────────────────────────────────────────────────── */

const OPEN_GROUND = [
  'The Ground has no gate. That is the point of it.',
  'One day, closed circuit, no ranking, nobody counting. It is where you find out what you actually do under your own weight.',
  'Bring the whole list. This is the rung that takes the first one off it.',
].join('\n\n');

const CLEAN = (tier: string) =>
  [
    `${tier} is within you.`,
    'Nothing you marked stands in the way. That is not a promise about the day; the terrain has agreed to nothing. It means the nevers you are still carrying are not the ones this ground asks about.',
    'You will find new ones out there. That is what it is for.',
    'Ask for a place, and say what you are least sure of when you do.',
  ].join('\n\n');

const NEARLY = (tier: string) =>
  [
    `${tier} is within you.`,
    'One or two things you have done once rather than often. The terrain will find them. It will not stop you, and it will not stop the group.',
    'Ask for a place, and say what you are least sure of when you do.',
  ].join('\n\n');

const NOT_YET = (tier: string, gaps: string[], send: string | null) => {
  const named =
    gaps.length === 2
      ? `Two nevers are in the way. First, ${gaps[0]}. Second, ${gaps[1]}.`
      : `One never is in the way: ${gaps[0]}.`;

  const two = gaps.length === 2;

  const notAboutYou = two
    ? 'Neither is about who you are.'
    : 'That is not about who you are.';

  const onward = send
    ? `${send} is the rung built to take exactly ${two ? 'these two' : 'this'}. Not a consolation, and not a smaller version of ${tier}. It is where ${two ? 'they stop being nevers' : 'it stops being a never'}.`
    : `Spend ${two ? 'them' : 'it'}, then come back to this page.`;

  return [
    `${tier}, not yet.`,
    named,
    `${notAboutYou} Everyone starts with a list of things they have not done. The only question is where each one gets spent.`,
    onward,
    `Take ${two ? 'them' : 'it'} with you. That is what you are going there to do.`,
  ].join('\n\n');
};
