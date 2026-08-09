import { redirect } from 'next/navigation';
import { Mark, Rule, Block, Quote } from '@/components/app/primitives';
import { currentRiderId } from '@/lib/app/session';
import { recordFor, type Entry } from '@/lib/app/ledger';
import { RUNGS } from '@/lib/app/ladder';
import { LedgerClient } from './LedgerClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The Record is a document about Romanian terrain. Dating it in the server's
 *  UTC would put a 01:00 Bucharest finish on the previous day. */
const RECORD_TZ = 'Europe/Bucharest';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  // Linked here and nowhere else in /app, so Chrome never raises its own
  // install UI on Threshold. The offer is made once, in our words (LG-11).
  manifest: '/app/manifest.webmanifest',
};

/**
 * The Record.
 *
 * Server-rendered from the session cookie, which reaches this route because the
 * cookie is scoped Path=/app and this page is under it. Neon sits in the path
 * that blocks first paint, which BRD §10.2 warns about — the answer is the
 * service worker, which serves the last rendered copy of this page immediately
 * and revalidates behind it. On a cold first visit there is nothing cached to
 * serve anyway, so nothing is lost.
 *
 * State A is never rendered here. A rider with no record does not get an empty
 * Ledger; the app is Threshold for them (BRD §4).
 */
export default async function LedgerPage() {
  const riderId = await currentRiderId();
  if (!riderId) redirect('/app/threshold');

  const record = await recordFor(riderId);
  if (!record) redirect('/app/threshold');

  // State A, for somebody who happens to hold a session.
  //
  // Being admitted to the Collective is not the same as having a record. BRD §4
  // is explicit: Radar and Collective see Threshold and no Ledger is rendered,
  // and empty states are never rendered at all. A bound rider with nothing in
  // their Record therefore gets Threshold, not a column of hairlines.
  //
  // An open window counts as something. A rider can finish on Saturday and be
  // asked for their two lines on Sunday, before the founder has sat down to
  // write the finish into the console.
  if (record.entries.length === 0 && !record.open) redirect('/app/threshold');

  return (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[42rem]">
        {/* ── The Standing Line ──────────────────────────────────────────
            Name and one word. Nothing else has ever belonged here and
            nothing else ever will (LG-01, LG-02, IA-02). */}
        <div className="flex items-baseline gap-3">
          <Mark className="text-trax-white">{record.name}</Mark>
          <Mark className="text-trax-grey/50">/</Mark>
          <Mark className="text-trax-white">{record.rung}</Mark>
        </div>

        {/* ── The Open Window ────────────────────────────────────────────
            Conditional, roughly eighteen days a year, and the only filled
            control in the product. It sits directly above the Record so
            that when it closes, the entry carrying those same words takes
            its place in the same screen position (AF-13). */}
        {record.open && (
          <Block space="lg">
            <Rule tone="ember" />
            <div className="pt-6">
              <Mark className="block text-trax-white/70">
                {record.open.experience} · {record.open.year}
              </Mark>
              <p className="font-sans font-medium text-trax-white text-xl md:text-2xl leading-[1.35] mt-4">
                {record.open.answered ? 'Still open, if you want to change it.' : 'Two things, while it is still close.'}
              </p>
              <a
                href={record.open.href}
                className="trax-filled inline-block mt-6 px-8 py-4 font-mono text-xs uppercase"
              >
                {record.open.answered ? 'Read it back' : 'Write them'}
              </a>
            </div>
          </Block>
        )}

        {/* ── The Record ─────────────────────────────────────────────────
            One column, reverse chronological, interleaved by date. */}
        <Block space="xl">
          <Rule />
          {record.entries.map((e) => (
            <RecordEntry key={e.id} entry={e} />
          ))}
        </Block>

        {/* ── The ladder ─────────────────────────────────────────────────
            Shown in full with the unreached simply unfilled (LG-03). It is
            four words on one line and it stays four words on one line: the
            moment it grows an arrow or a count it becomes the progress
            indicator LG-02 forbids. */}
        <Block space="xl">
          <Mark className="text-trax-grey/40">
            {RUNGS.map((r, i) => (
              <span key={r} className={r === record.rung ? 'text-trax-white' : undefined}>
                {i > 0 && <span className="text-trax-grey/25"> · </span>}
                {r}
              </span>
            ))}
          </Mark>
        </Block>

        {/* ── The Colophon ───────────────────────────────────────────────
            A printed imprint, not a nav bar (IA-02). */}
        <Block space="lg">
          <Rule />
          <div className="pt-6 flex flex-col gap-3">
            <a href="/app/m">
              <Mark className="text-trax-grey/60">Provenance</Mark>
            </a>
            <a href="/app/threshold">
              <Mark className="text-trax-grey/60">Threshold</Mark>
            </a>
            <a href="/manifesto">
              <Mark className="text-trax-grey/60">About</Mark>
            </a>
          </div>
        </Block>

        {/* The deploy's own id, so the service worker's cache name turns over
            with every release rather than serving a months-old shell (§10.2). */}
        <LedgerClient
          hasFinished={record.hasFinished}
          build={process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'dev'}
        />
      </div>
    </div>
  );
}

/* ── One dated entry ─────────────────────────────────────────────────────── */

function RecordEntry({ entry }: { entry: Entry }) {
  // Rendered in Romanian time rather than the server's UTC. A ride that
  // finished at 01:00 in Bucharest is not dated to the previous day because
  // Vercel happens to run in London.
  const date = new Date(entry.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: RECORD_TZ,
  });

  return (
    // The full timestamp, not a UTC-sliced date: the anniversary check reads
    // this in the rider's own zone, and slicing here would decide the day in
    // the wrong one.
    <div id={entry.id} data-date={entry.date}>
      <div className="py-8">
        <Mark className="block text-trax-grey/60">{date}</Mark>

        {entry.kind === 'blank' ? (
          // Deliberately holds nothing (LG-07). The one mono line says so and
          // then stops; an explanation here would be the documentation the
          // absence exists to refuse.
          <Mark className="block mt-3 text-trax-grey/40">Not recorded, by choice</Mark>
        ) : entry.kind === 'artifact' ? (
          <a href={entry.href} className="block mt-3">
            <Mark className="block text-trax-white text-sm md:text-base">{entry.serial}</Mark>
            <Mark className="block mt-2 text-trax-grey/60">{entry.mark}</Mark>
          </a>
        ) : entry.kind === 'note' ? (
          <a href={entry.href} className="block mt-3">
            <span className="font-sans text-trax-white text-lg">{entry.title}</span>
            <Mark className="block mt-2 text-trax-grey/60">{entry.mark}</Mark>
          </a>
        ) : (
          <>
            <div className="mt-3">
              <span className="font-sans text-trax-white text-xl md:text-2xl">{entry.title}</span>
              <Mark className="block mt-2 text-trax-grey/60">{entry.mark}</Mark>
            </div>
            {/* The rider's own words, in the rider's register. Never restyled,
                never set in the display face (LG-06, DS-01, DS-07). */}
            {(entry.took || entry.gave) && (
              <div className="mt-6 space-y-4">
                {entry.took && <Quote>{entry.took}</Quote>}
                {entry.gave && <Quote>{entry.gave}</Quote>}
              </div>
            )}
          </>
        )}
      </div>
      <Rule />
    </div>
  );
}
