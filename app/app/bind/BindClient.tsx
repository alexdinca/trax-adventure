'use client';

import { useEffect, useState } from 'react';
import { Mark, Block } from '@/components/app/primitives';

/**
 * Redeeming an invite (BRD ID-02).
 *
 * The JWT arrives in the URL fragment, which browsers never send to a server.
 * It is read here, POSTed in a body, and the fragment is cleared with
 * replaceState before anything else runs — so it is never in the address bar
 * long enough to be shared, and never in a Referer, an access log or Aptabase.
 *
 * There is no button. A rider tapping a link from WhatsApp has already made
 * the decision this screen would be asking them to confirm.
 */

type State = 'working' | 'done' | 'spent' | 'expired' | 'invalid';

/**
 * Whatever the service worker cached for whoever held this device before.
 *
 * CacheStorage is keyed by origin and URL, and nothing in the cache name or the
 * entry key names a rider — so a cached /app/ledger is simply "the Record", and
 * the stale-first fetch handler would hand the incoming rider the outgoing
 * one's name, standing and verbatim Aftermath lines before any revalidation ran.
 *
 * Binding is the one moment we know the device changed hands, so it is the
 * right place to empty it. Cheap, and it runs before the navigation that would
 * read from it.
 */
async function clearAnyPreviousRider() {
  try {
    if ('caches' in window) {
      for (const key of await caches.keys()) await caches.delete(key);
    }
    const regs = await navigator.serviceWorker?.getRegistrations?.();
    for (const r of regs ?? []) await r.unregister();
  } catch {
    /* a device that cannot clear its cache still gets the right server render */
  }
}

export function BindClient() {
  const [state, setState] = useState<State>('working');

  useEffect(() => {
    const token = window.location.hash.replace(/^#/, '').trim();

    // Clear it first, unconditionally. If the request fails, the rider asks for
    // a new link — leaving a live credential in the address bar to save that
    // round trip is the wrong trade.
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (!token) {
      setState('invalid');
      return;
    }

    let live = true;
    fetch('/api/app/bind', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!live) return;
        if (res.ok) {
          setState('done');
          await clearAnyPreviousRider();
          // A full navigation rather than a router push: the session cookie was
          // set by that response, and the Record is server-rendered from it.
          window.location.replace('/app/ledger');
          return;
        }
        setState(res.status === 409 ? 'spent' : res.status === 410 ? 'expired' : 'invalid');
      })
      .catch(() => live && setState('invalid'));

    return () => {
      live = false;
    };
  }, []);

  const shell = (children: React.ReactNode) => (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[42rem]">{children}</div>
    </div>
  );

  if (state === 'working' || state === 'done') return shell(null);

  const said =
    state === 'spent'
      ? 'This link has already been used. If it was not you, tell Alex.'
      : state === 'expired'
        ? 'This link has expired. Ask Alex for another.'
        : 'This link does not open anything.';

  return shell(
    <>
      <Mark>Ledger</Mark>
      <Block space="md">
        <p className="font-body text-trax-white/70 text-base leading-[1.7]">{said}</p>
      </Block>
    </>
  );
}
