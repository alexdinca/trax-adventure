'use client';

import { useEffect, useState } from 'react';
import { Mark, Rule, Block } from '@/components/app/primitives';

/**
 * The three things on this surface that genuinely need a browser: the offline
 * cache, the install offer, and erasure.
 *
 * Everything a rider reads is server-rendered above this. Nothing here fetches,
 * polls, or re-renders the Record.
 */

const OFFERED = 'trax-install-offered';

type Prompt = Event & { prompt: () => Promise<void> };

export function LedgerClient({
  hasFinished,
  build,
}: {
  hasFinished: boolean;
  build: string;
}) {
  const [offer, setOffer] = useState<'no' | 'android' | 'ios'>('no');
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [erasing, setErasing] = useState(false);
  const [eraseFailed, setEraseFailed] = useState(false);

  /* ── The offline cache (LG-10) ──────────────────────────────────────── */
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // The build id rides in the query string: a new deploy is a new script URL,
    // which is what makes the browser fetch it and retire the old cache.
    navigator.serviceWorker
      .register(`/app-sw.js?v=${encodeURIComponent(build)}`, { scope: '/app/' })
      .catch(() => {
        // A blocked or unsupported service worker costs offline reading and
        // nothing else. The server is always the record (BRD P8).
      });
  }, [build]);

  /* ── The install offer (LG-11, DI-03) ───────────────────────────────────
     Once, on this surface only, only after a first finish, as one mono line.
     Never a browser banner. */
  useEffect(() => {
    if (!hasFinished) return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    try {
      if (localStorage.getItem(OFFERED)) return;
    } catch {
      return; // private mode: no way to honour "once", so do not offer at all
    }

    // LG-11 says offered once, not shown until dismissed. The flag is written
    // when the line is put in front of the rider, so ignoring it retires it the
    // same as tapping it does. This matters most on iOS, where the line is not
    // even actionable — there is no programmatic install — so a rider who reads
    // it and scrolls on would otherwise be shown it on every open forever.
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as Prompt);
      setOffer('android');
      remember();
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS never fires that event, so the offer there is a sentence describing
    // where the button is.
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      setOffer('ios');
      remember();
    }

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, [hasFinished]);

  function remember() {
    try {
      localStorage.setItem(OFFERED, '1');
    } catch {
      /* nothing to remember it with */
    }
  }

  /* ── The anniversary (LG-12) ────────────────────────────────────────────
     Open it a year to the day after something happened and it opens there
     instead of at the top. Silently: no animation, no marker, no message. */
  useEffect(() => {
    if (window.location.hash) return;

    // Both sides read in the rider's own zone. Comparing a UTC-sliced date
    // against local month and day is wrong by a day for anyone east of
    // Greenwich, which is everyone this is for.
    const now = new Date();

    const match = Array.from(
      document.querySelectorAll<HTMLElement>('[data-date]')
    ).find((el) => {
      const d = new Date(el.dataset.date ?? '');
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate() &&
        d.getFullYear() !== now.getFullYear()
      );
    });

    match?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
  }, []);

  /* ── Erasure (ID-04) ────────────────────────────────────────────────── */
  async function erase() {
    if (
      !confirm(
        'This deletes your record from the server and unbinds this device. Your own words go too. It cannot be undone.'
      )
    )
      return;

    setErasing(true);
    setEraseFailed(false);

    // Nothing local is touched until the server confirms. Wiping the device and
    // landing on Threshold after a failed request would tell a rider their
    // record was deleted while every row is still there — the worst outcome a
    // deletion feature has available to it.
    let gone = false;
    try {
      const res = await fetch('/app/api/me', { method: 'DELETE' });
      // 404 means no rider is bound to this cookie, so unbinding here is right.
      gone = res.ok || res.status === 404;
    } catch {
      gone = false;
    }

    if (!gone) {
      setErasing(false);
      setEraseFailed(true);
      return;
    }

    try {
      localStorage.removeItem(OFFERED);
      if ('caches' in window) {
        for (const k of await caches.keys()) await caches.delete(k);
      }
      const regs = await navigator.serviceWorker?.getRegistrations?.();
      for (const r of regs ?? []) await r.unregister();
    } catch {
      /* the server row is already gone; local leftovers are cosmetic */
    }
    window.location.replace('/app/threshold');
  }

  return (
    <>
      {offer !== 'no' && (
        <Block space="lg">
          <button
            onClick={() => {
              setOffer('no');
              if (offer === 'android' && prompt) void prompt.prompt();
            }}
            className="text-left"
          >
            <Mark className="text-trax-white/70">
              {offer === 'ios'
                ? 'Share → Add to Home Screen keeps this readable with no signal'
                : 'Keep this on the home screen, readable with no signal'}
            </Mark>
          </button>
        </Block>
      )}

      <Block space="xl">
        <Rule />
        <button onClick={() => void erase()} disabled={erasing} className="mt-6 text-left">
          <Mark className="text-trax-grey/30">
            {erasing ? 'Erasing' : 'Erase this record and unbind'}
          </Mark>
        </button>
        {eraseFailed && (
          <Mark className="block mt-3 text-trax-red">
            Nothing was deleted. Your record is still here. Try again.
          </Mark>
        )}
      </Block>
    </>
  );
}
