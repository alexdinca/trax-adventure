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
      closesAt: string;
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

  const closes = new Date(data.closesAt);
  const daysLeft = Math.max(
    0,
    Math.ceil((closes.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  );

  return shell(
    <>
      <Mark>
        {data.experience.name} · {data.experience.year}
      </Mark>

      <Block space="md">
        <p className="font-sans font-medium text-trax-white text-2xl md:text-3xl leading-[1.3]">
          Two things, while it is still close.
        </p>
      </Block>

      <Block space="sm">
        <p className="font-body text-trax-white/75 text-base leading-[1.7]">
          Nobody else&apos;s answers are here, and yours are not shown to anyone
          until you say they can be. Write it the way you would say it.
        </p>
      </Block>

      <Block space="lg">
        <Rule tone="ember" />
        <p className="font-sans font-medium text-trax-white text-lg md:text-xl mt-5 mb-4">
          What the terrain took.
        </p>
        <Field
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
        <Rule tone="ember" />
        <p className="font-sans font-medium text-trax-white text-lg md:text-xl mt-5 mb-4">
          What it gave.
        </p>
        <Field
          value={gave}
          onChange={(e) => {
            setGave(e.target.value);
            setSaved(false);
          }}
          rows={4}
          aria-label="What it gave"
        />
      </Block>

      {/* Consent. Private by default; publishing is the rider's decision. */}
      <Block space="lg">
        <Rule />
        <button
          onClick={() => {
            setMayPublish((v) => !v);
            setSaved(false);
          }}
          className="w-full text-left py-5"
          aria-pressed={mayPublish}
        >
          <span className="font-body text-base leading-[1.6] text-trax-white">
            {mayPublish ? '— ' : '   '}
            TRAX may use these words in a Field Note.
          </span>
          <span className="block font-body text-sm text-trax-grey mt-2">
            {mayPublish
              ? 'Attributed to your first name. Nothing else.'
              : 'Left off, these stay between you and Alex.'}
          </span>
        </button>
        <Rule />
      </Block>

      <Block space="lg">
        <button
          onClick={submit}
          disabled={saving || (!took.trim() && !gave.trim())}
          className="trax-filled px-8 py-4 font-mono text-xs uppercase tracking-normal"
        >
          {saving ? 'Leaving it' : saved ? 'Left' : 'Leave it'}
        </button>
      </Block>

      <Block space="md">
        <Mark className="text-trax-grey/60">
          {saved ? 'Saved. You can change it until the window closes. ' : ''}
          {daysLeft === 0
            ? 'Closes today'
            : daysLeft === 1
              ? 'One day left'
              : `${daysLeft} days left`}
        </Mark>
      </Block>
    </>
  );
}
