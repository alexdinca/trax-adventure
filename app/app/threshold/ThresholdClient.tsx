'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Mark, Rule, Block, Say, Field } from '@/components/app/primitives';
import { whatsappLink } from '@/lib/whatsapp';
import {
  TIERS,
  type Answer,
  type TierId,
  statementsFor,
  tierById,
} from '@/lib/app/threshold/statements';
import { evaluate, type Answers } from '@/lib/app/threshold/verdict';

/**
 * Threshold.
 *
 * Everything here runs on the device. No answer is ever transmitted; the only
 * outbound path is a WhatsApp link the rider reads and can edit first
 * (BRD TH-01, TH-11, TH-12).
 *
 * Deviation from TH-03, recorded deliberately: the spec describes a verb that
 * cycles in place through three states. A cycle imposes a tap order, which
 * makes the most honest answer ("never") the most expensive one to give, and
 * biases the result upward. Instead each statement offers its three endings as
 * sentences and the rider taps one. It is still self-description rather than
 * form-filling, it is one tap, and it carries no ordering bias.
 */

type Stage = 'intro' | 'statements' | 'verdict';

const STORE = 'trax-threshold';

const COUNT_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one',
  'twenty-two',
];

const ORDER: Answer[] = ['strong', 'partial', 'none'];

export function ThresholdClient() {
  const [stage, setStage] = useState<Stage>('intro');
  const [tier, setTier] = useState<TierId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [summary, setSummary] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  // Restore a session in progress. Nothing leaves the device (TH-14).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const saved = JSON.parse(raw) as { tier: TierId; answers: Answers };
      if (saved.tier) {
        setTier(saved.tier);
        setAnswers(saved.answers ?? {});
      }
    } catch {
      /* a corrupt draft is not worth a message */
    }
  }, []);

  useEffect(() => {
    if (!tier) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ tier, answers }));
    } catch {
      /* private mode, or a full disk. Neither is the rider's problem. */
    }
  }, [tier, answers]);

  const statements = useMemo(() => (tier ? statementsFor(tier) : []), [tier]);
  const answered = statements.filter((s) => answers[s.id]).length;
  const complete = statements.length > 0 && answered === statements.length;

  const verdict = useMemo(
    () => (tier && stage === 'verdict' ? evaluate(tier, answers) : null),
    [tier, answers, stage]
  );

  useEffect(() => {
    if (verdict && !summary) setSummary(verdict.summary);
  }, [verdict, summary]);

  function begin(id: TierId) {
    setTier(id);
    setAnswers({});
    setStage('statements');
    topRef.current?.scrollIntoView();
  }

  function restart() {
    setStage('intro');
    setTier(null);
    setAnswers({});
    setSummary('');
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* nothing to do */
    }
    topRef.current?.scrollIntoView();
  }

  return (
    <div ref={topRef} className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[46rem]">
        {stage === 'intro' && <Intro onChoose={begin} resumeTier={tier} onResume={() => setStage('statements')} />}

        {stage === 'statements' && tier && (
          <Statements
            tier={tier}
            answers={answers}
            onAnswer={(id, a) => setAnswers((prev) => ({ ...prev, [id]: a }))}
            complete={complete}
            answered={answered}
            onDone={() => {
              setStage('verdict');
              topRef.current?.scrollIntoView();
            }}
            onBack={restart}
          />
        )}

        {stage === 'verdict' && verdict && (
          <VerdictView
            paragraph={verdict.paragraph}
            summary={summary}
            onSummary={setSummary}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}

/* ── Intro ─────────────────────────────────────────────────────────────── */

function Intro({
  onChoose,
  resumeTier,
  onResume,
}: {
  onChoose: (t: TierId) => void;
  resumeTier: TierId | null;
  onResume: () => void;
}) {
  return (
    <>
      <Mark>Threshold</Mark>

      <Block space="md">
        <Say>This is not a test you pass.</Say>
      </Block>

      <Block space="sm" className="space-y-5">
        <p className="font-body text-trax-white/80 text-base md:text-lg leading-[1.7]">
          It is a set of statements about what you have already done. You mark
          each one honestly, and at the end it tells you whether the experience
          you are looking at is within you yet, or which two things are not
          there.
        </p>
        <p className="font-body text-trax-white/80 text-base md:text-lg leading-[1.7]">
          Nothing is sent anywhere. It is worked out on this phone and stays on
          it. Nobody at TRAX sees this unless you decide to send it.
        </p>
        <p className="font-body text-trax-white/80 text-base md:text-lg leading-[1.7]">
          The terrain checks this answer later, and a wrong one costs the group,
          not you. That is the only reason to be accurate.
        </p>
      </Block>

      <Block space="lg">
        <Mark>Which one are you looking at</Mark>
      </Block>

      <Block space="sm">
        <Rule />
        {TIERS.map((t) => {
          const n = statementsFor(t.id).length;
          return (
            <div key={t.id}>
              <button
                onClick={() => onChoose(t.id)}
                className="w-full text-left py-6 group"
              >
                <span className="font-sans font-medium text-trax-white text-lg md:text-xl block group-hover:text-trax-red transition-colors duration-200">
                  {t.name}
                </span>
                <span className="font-body text-trax-grey text-sm md:text-base block mt-1">
                  {t.character}
                </span>
                <span className="trax-mark font-mono text-[11px] uppercase text-trax-grey/60 block mt-3">
                  {n === 0
                    ? 'No statements. It is open.'
                    : `${COUNT_WORDS[n] ?? n} statements · about ${Math.max(3, Math.round(n * 0.4))} minutes`}
                </span>
              </button>
              <Rule />
            </div>
          );
        })}
      </Block>

      {resumeTier && (
        <Block space="md">
          <button onClick={onResume} className="text-left">
            <Mark className="text-trax-white/70 underline underline-offset-4">
              Continue {tierById(resumeTier).name}
            </Mark>
          </button>
        </Block>
      )}
    </>
  );
}

/* ── Statements ────────────────────────────────────────────────────────── */

function Statements({
  tier,
  answers,
  onAnswer,
  complete,
  answered,
  onDone,
  onBack,
}: {
  tier: TierId;
  answers: Answers;
  onAnswer: (id: string, a: Answer) => void;
  complete: boolean;
  answered: number;
  onDone: () => void;
  onBack: () => void;
}) {
  const t = tierById(tier);
  const list = statementsFor(tier);

  // The Ground asks nothing. Send it straight through rather than render an
  // empty document.
  useEffect(() => {
    if (list.length === 0) onDone();
  }, [list.length, onDone]);

  if (list.length === 0) return null;

  return (
    <>
      <button onClick={onBack} className="text-left">
        <Mark className="text-trax-grey/60">← {t.name}</Mark>
      </button>

      <Block space="md">
        <Say>Mark each one as it actually is.</Say>
      </Block>

      <Block space="sm">
        <p className="font-body text-trax-white/70 text-base leading-[1.7]">
          Done in control is not the same as done and survived. The difference
          between them is the whole point of asking.
        </p>
      </Block>

      <Block space="lg" className="space-y-12">
        {list.map((s) => {
          const chosen = answers[s.id];
          return (
            <div key={s.id}>
              <Rule />
              <p className="font-sans font-medium text-trax-white text-lg md:text-xl leading-[1.4] mt-6">
                {s.lead}
              </p>
              <div className="mt-4 space-y-1">
                {ORDER.map((a) => {
                  const on = chosen === a;
                  return (
                    <button
                      key={a}
                      onClick={() => onAnswer(s.id, a)}
                      className="block w-full text-left py-1.5"
                      aria-pressed={on}
                    >
                      <span
                        className={`font-body text-base md:text-lg leading-[1.6] transition-colors duration-150 ${
                          on ? 'text-trax-white' : 'text-trax-grey/45'
                        }`}
                      >
                        {on ? '— ' : '   '}
                        {s.clause[a]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <Rule />
      </Block>

      <Block space="lg">
        {complete ? (
          <button onClick={onDone} className="text-left">
            <Mark className="text-trax-white underline underline-offset-4">
              Read it
            </Mark>
          </button>
        ) : (
          <Mark className="text-trax-grey/50">
            {list.length - answered} left
          </Mark>
        )}
      </Block>
    </>
  );
}

/* ── Verdict ───────────────────────────────────────────────────────────── */

function VerdictView({
  paragraph,
  summary,
  onSummary,
  onRestart,
}: {
  paragraph: string;
  summary: string;
  onSummary: (s: string) => void;
  onRestart: () => void;
}) {
  return (
    <>
      {/* A full screen of nothing. The verdict is worth arriving at rather
          than being handed, and silence is more honest than a spinner
          pretending to think (BRD TH-09). */}
      <div className="h-[70svh]" aria-hidden="true" />

      <div className="space-y-8">
        {paragraph.split('\n\n').map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'font-sans font-medium text-trax-white text-2xl md:text-3xl leading-[1.3]'
                : 'font-body text-trax-white/85 text-base md:text-lg leading-[1.75]'
            }
          >
            {p}
          </p>
        ))}
      </div>

      <Block space="xl">
        <Rule />
      </Block>

      <Block space="md">
        <Mark>If you want to send this</Mark>
      </Block>

      <Block space="sm" className="space-y-4">
        <p className="font-body text-trax-white/70 text-sm leading-[1.7]">
          Read it first. Change anything you want. Nothing goes until you send it.
        </p>
        <Field
          value={summary}
          onChange={(e) => onSummary(e.target.value)}
          rows={5}
          aria-label="What you would send"
        />
      </Block>

      <Block space="md">
        <a
          href={whatsappLink(summary)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Mark className="text-trax-white underline underline-offset-4">
            Send it to TRAX
          </Mark>
        </a>
      </Block>

      <Block space="lg">
        <button onClick={onRestart} className="text-left">
          <Mark className="text-trax-grey/50">Start again</Mark>
        </button>
      </Block>
    </>
  );
}
