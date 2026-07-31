'use client';

import { useEffect, useState } from 'react';
import { Mark, Rule, Block, Field } from '@/components/app/primitives';

/**
 * Aftermath.
 *
 * Two prompts, nothing else on the page. No other rider's words, no response
 * count, no preview of what happens next (BRD AF-06). Consent is explicit and
 * defaults to private (AF-08).
 *
 * This is the one surface in the whole product permitted a filled button,
 * because it has a real deadline the rider agreed to (BRD P5).
 */

type State =
  | { state: 'loading' }
  | { state: 'early'; opensAt: string }
  | { state: 'closed' }
  | { state: 'invalid' }
  | {
      state: 'open';
      /** Null when the seven-day close is switched off. */
      closesAt: string | null;
      daysSince: number;
      experience: { name: string; year: number };
      lines: { took: string; gave: string; mayPublish: boolean } | null;
    };

export function AftermathClient({ token }: { token: string }) {
  const [data, setData] = useState<State>({ state: 'loading' });
  const [took, setTook] = useState('');
  const [gave, setGave] = useState('');
  const [mayPublish, setMayPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(`/api/app/aftermath/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (!live) return;
        setData(d);
        if (d.state === 'open' && d.lines) {
          setTook(d.lines.took ?? '');
          setGave(d.lines.gave ?? '');
          setMayPublish(Boolean(d.lines.mayPublish));
          setSaved(true);
        }
      })
      .catch(() => live && setData({ state: 'invalid' }));
    return () => {
      live = false;
    };
  }, [token]);

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/app/aftermath/${token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ took, gave, mayPublish }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const shell = (children: React.ReactNode) => (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[42rem]">{children}</div>
    </div>
  );

  if (data.state === 'loading') return shell(null);

  if (data.state === 'early') {
    return shell(
      <>
        <Mark>Aftermath</Mark>
        <Block space="md">
          <p className="font-sans font-medium text-trax-white text-2xl md:text-3xl leading-[1.3]">
            Not yet.
          </p>
        </Block>
        <Block space="sm">
          <p className="font-body text-trax-white/80 text-base md:text-lg leading-[1.7]">
            This opens a day after the finish. Sleep first. What you still
            remember tomorrow is the part worth writing down.
          </p>
        </Block>
      </>
    );
  }

  if (data.state === 'closed') {
    return shell(
      <>
        <Mark>Aftermath</Mark>
        <Block space="md">
          <p className="font-sans font-medium text-trax-white text-2xl md:text-3xl leading-[1.3]">
            This one has closed.
          </p>
        </Block>
        <Block space="sm">
          <p className="font-body text-trax-white/80 text-base md:text-lg leading-[1.7]">
            Seven days was the window. What did not get written down stays where
            it happened, which is not the worst outcome.
          </p>
        </Block>
      </>
    );
  }

  if (data.state === 'invalid') {
    return shell(
      <>
        <Mark>Aftermath</Mark>
        <Block space="md">
          <p className="font-body text-trax-white/70 text-base leading-[1.7]">
            This link does not open anything.
          </p>
        </Block>
      </>
    );
  }

  const daysLeft = data.closesAt
    ? Math.max(0, Math.ceil((new Date(data.closesAt).getTime() - Date.now()) / (24 * 3600e3)))
    : null;

  // A collection can be opened long after the finish. Saying "while it is
  // still close" three months later would be a lie the rider can check.
  const late = data.daysSince > 21;

  return shell(
    <>
      <Mark>
        {data.experience.name} · {data.experience.year}
      </Mark>

      <Block space="md">
        <p className="font-sans font-medium text-trax-white text-2xl md:text-3xl leading-[1.3]">
          {late ? 'Two things, late but not too late.' : 'Two things, while it is still close.'}
        </p>
      </Block>

      <Block space="sm">
        <p className="font-body text-trax-white/75 text-base leading-[1.7]">
          Nobody else&apos;s answers are here, and yours are not shown to anyone
          until you say they can be. Write it the way you would say it.
        </p>
      </Block>

      {/* Why a rider should bother. The ritual only works if the point of it
          is obvious at the moment of writing. */}
      <Block space="lg" className="border-l border-trax-white/15 pl-5 space-y-4">
        <Mark className="block">Why this exists</Mark>
        {late ? (
          <>
            <p className="font-body text-trax-white/70 text-sm md:text-base leading-[1.7]">
              This one is being asked late. Months late. The detail has already
              gone and nobody is pretending otherwise.
            </p>
            <p className="font-body text-trax-white/70 text-sm md:text-base leading-[1.7]">
              What is left after this long is the part that was always going to
              last, which makes it the more honest answer, not the weaker one.
              Write what you still carry.
            </p>
          </>
        ) : (
          <>
            <p className="font-body text-trax-white/70 text-sm md:text-base leading-[1.7]">
              The detail is already going. In a week you will have the summary,
              and in a year you will have whatever you wrote down. This is the
              part of the experience that lasts, and it is the only part you can
              still change.
            </p>
            <p className="font-body text-trax-white/70 text-sm md:text-base leading-[1.7]">
              It is also the only record TRAX keeps of what happened out there,
              in the words of the people it happened to. Not the photographs.
              These.
            </p>
          </>
        )}
        <p className="font-body text-trax-white/70 text-sm md:text-base leading-[1.7]">
          Two lines. Nobody is marking them. Write them badly if badly is what
          is true.
        </p>
      </Block>

      <Block space="lg">
        <p className="font-sans font-medium text-trax-white text-lg md:text-xl mb-4">
          What the terrain took.
        </p>
        <Field
          tone="ember"
          value={took}
          onChange={(e) => {
            setTook(e.target.value);
            setSaved(false);
          }}
          rows={4}
          aria-label="What the terrain took"
        />
      </Block>

      <Block space="lg">
        <p className="font-sans font-medium text-trax-white text-lg md:text-xl mb-4">
          What it gave.
        </p>
        <Field
          tone="ember"
          value={gave}
          onChange={(e) => {
            setGave(e.target.value);
            setSaved(false);
          }}
          rows={4}
          aria-label="What it gave"
        />
      </Block>

      {/* Consent, as an actual checkbox, and separate from saving. Private is
          the default and stays the default until the rider says otherwise. */}
      <Block space="lg">
        <Rule />
        <button
          type="button"
          role="checkbox"
          aria-checked={mayPublish}
          onClick={() => {
            setMayPublish((v) => !v);
            setSaved(false);
          }}
          className="w-full text-left py-5 flex gap-4 items-start"
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 w-[18px] h-[18px] shrink-0 border flex items-center justify-center ${
              mayPublish ? 'border-trax-white bg-trax-white' : 'border-trax-white/40'
            }`}
          >
            {mayPublish && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                <path
                  d="M1 4.5L4 7.5L10 1.5"
                  stroke="#0E0F11"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
            )}
          </span>
          <span>
            <span className="block font-body text-base leading-[1.5] text-trax-white">
              TRAX may quote these in a Field Note.
            </span>
            <span className="block font-body text-sm text-trax-grey mt-1.5">
              {mayPublish
                ? 'Under your first name. Nothing else, and never the whole thing.'
                : 'Leave it unticked and these stay between you and Alex.'}
            </span>
          </span>
        </button>
        <Rule />
      </Block>

      <Block space="lg" className="flex items-center gap-6 flex-wrap">
        <button
          onClick={submit}
          disabled={saving || (!took.trim() && !gave.trim())}
          className="trax-filled px-8 py-4 font-mono text-xs uppercase tracking-normal"
        >
          {saving ? 'Saving' : 'Save'}
        </button>
        {saved && !saving && (
          <Mark className="text-trax-white/70">
            Saved{mayPublish ? '' : ', and private'}
          </Mark>
        )}
      </Block>

      <Block space="md">
        <Mark className="text-trax-grey/60">
          {saved ? 'You can change it while this stays open. ' : ''}
          {daysLeft === null
            ? 'Open until Alex closes it'
            : daysLeft === 0
              ? 'Closes today'
              : daysLeft === 1
                ? 'One day left'
                : `${daysLeft} days left`}
        </Mark>
      </Block>
    </>
  );
}
