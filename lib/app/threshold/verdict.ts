/**
 * Threshold — the forecast.
 *
 * This does not decide whether a rider is allowed. Access is requested from a
 * human and granted by one; that has not changed and should not. What this
 * does is read a rider's list of nevers and report which of them the chosen
 * experience is going to take off it, and how to arrive ready.
 *
 * Bible v2, The Nevers: never is the ordinary condition, and the ladder is the
 * order nevers get spent in. A tool built on that doctrine cannot hand a rider
 * their nevers back as a refusal. It tells them what they are going to collect.
 *
 * Deterministic. No model, no network, no randomness (BRD TH-06).
 */

import {
  type Answer,
  type Statement,
  type TierId,
  statementsFor,
  tierById,
} from './statements';

export type Answers = Record<string, Answer>;

export interface Taking {
  /** The never, stated as what the terrain will hand you. */
  willBe: string;
  /** How to arrive ready. */
  prepare: string;
  /** Nobody can carry this one for you. Worth arriving prepared for. */
  heavy: boolean;
  /** Marked "done once, badly" rather than never. */
  again: boolean;
}

export interface Forecast {
  tier: TierId;
  /** What this experience will take off the list, heaviest first. */
  takes: Taking[];
  /** How many of the things it asks for the rider already carries. */
  carried: number;
  /** The rider already carries everything. This one has nothing new. */
  nothingNew: boolean;
  headline: string;
  closing: string;
  /** Plain text the rider may carry into WhatsApp, after reading it. */
  summary: string;
}

/** The Ground asks nothing of anyone, by doctrine. */
const UNGATED: TierId[] = ['the-ground'];

/** How many to actually report. Beyond this it stops being useful. */
const MAX_TAKES = 4;

const COUNT = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

export function forecast(tier: TierId, answers: Answers): Forecast {
  const t = tierById(tier);

  if (UNGATED.includes(tier)) {
    return {
      tier,
      takes: [],
      carried: 0,
      nothingNew: false,
      headline: 'The Ground has no gate. That is the point of it.',
      closing: [
        'One day, closed circuit, no ranking, nobody counting. It is where you find out what you actually do under your own weight.',
        'Bring the whole list. This is the rung that takes the first one off it.',
      ].join('\n\n'),
      summary: `Threshold · ${t.name}\nComing to take the first one off the list.`,
    };
  }

  const relevant = statementsFor(tier);

  const unspent = relevant
    .map((s) => ({ s, a: answers[s.id], w: s.weight[tier] ?? 0 }))
    .filter((x) => x.a !== 'strong')
    .sort((a, b) => b.w - a.w);

  const carried = relevant.length - unspent.length;

  if (unspent.length === 0) {
    return {
      tier,
      takes: [],
      carried,
      nothingNew: true,
      headline: `${t.name} has nothing new for you.`,
      closing: [
        'Everything it asks, you already carry. That is not a compliment. It is a mismatch, and it is worth saying plainly.',
        'Look further up the ladder. Or come anyway, and be one of the people the rest of the group leans on. Both are useful. Only one of them is for you.',
      ].join('\n\n'),
      summary: `Threshold · ${t.name}\nNothing new here. Asking about what is above it.`,
    };
  }

  const takes: Taking[] = unspent.slice(0, MAX_TAKES).map(({ s, a, w }) => ({
    willBe: s.willBe,
    prepare: s.prepare,
    heavy: w >= 3,
    again: a === 'partial',
  }));

  const n = takes.length;
  const headline = `${t.name} will take ${COUNT[n] ?? n} of these off your list.`;

  const closingLines: string[] = [];
  if (carried > 0) {
    closingLines.push('The rest of what it asks, you already carry.');
  }
  closingLines.push('Come with the list. That is what it is for.');

  return {
    tier,
    takes,
    carried,
    nothingNew: false,
    headline,
    closing: closingLines.join('\n\n'),
    summary:
      `Threshold · ${t.name}\n` +
      `What this would take off my list:\n` +
      takes.map((x) => `- ${x.willBe}`).join('\n'),
  };
}
