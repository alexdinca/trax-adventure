/*
 * The Ledger's service worker (BRD LG-10).
 *
 * Hand-written and small on purpose: next-pwa is unmaintained against the App
 * Router, and forty lines of cache logic is not worth a dependency that decides
 * things on your behalf.
 *
 * It exists for exactly one reason — a rider at altitude with no signal can
 * read their whole record. It has no push handler and never will (NT-01). The
 * cache is a convenience; the server is always the record (P8).
 *
 * The version comes from the query string the page registers with, so a deploy
 * produces a new cache name and the old one is dropped on activate. Riders open
 * this four times a year; running a months-old shell is the default failure
 * mode unless something forces the turnover.
 */

const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = `trax-app-${VERSION}`;

/** Only these. Aftermath windows and provenance lookups are never cached. */
const PRECACHE = ['/app/ledger', '/app/api/me'];

/** How long a rider waits for the truth before being shown the last copy. */
const DEADLINE = 2500;
const TIMED_OUT = Symbol('deadline');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        // Deliberately not addAll: that rejects the whole install if one URL
        // fails, and an install that never completes means no offline record
        // at all. Each is also checked for a redirect first — an unbound
        // request for /app/ledger answers 307 to Threshold, and caching what
        // came back would put the wrong page under the right key.
        Promise.all(
          PRECACHE.map((url) =>
            fetch(url, { credentials: 'same-origin' })
              .then((res) => {
                if (res.ok && !res.redirected) return cache.put(url, res);
              })
              .catch(() => {})
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const mine = url.pathname === '/app/ledger' || url.pathname === '/app/api/me';
  if (!mine) return;

  // Network first, but on a deadline.
  //
  // Serving the cache unconditionally would be simpler and would be wrong: an
  // Aftermath window opens on a fixed morning, and a rider who opens the Record
  // that day would be shown yesterday's render with no window in it. The
  // network is asked first so what they read is true.
  //
  // The deadline is what BRD §10.2 is really asking for. Neon suspends its
  // compute when idle and the first request after a quiet spell can take
  // seconds; past DEADLINE the cached copy paints and the live response lands
  // in the cache for next time. Offline, the fetch fails at once and the cache
  // answers with no wait at all.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);

      const live = fetch(request)
        .then(async (res) => {
          if (res.ok && !res.redirected) {
            await cache.put(request, res.clone());
          } else if (res.redirected || res.status === 404) {
            // The session is gone — erased, or unbound on another device. Drop
            // the copy rather than keep serving a record that is no longer
            // anybody's. A redirected response also cannot legally be served
            // for a navigation out of the cache.
            await cache.delete(request);
          }
          return res;
        })
        .catch(() => null);

      if (!cached) {
        return (
          (await live) ||
          new Response('', { status: 504, statusText: 'offline, and nothing cached yet' })
        );
      }

      const raced = await Promise.race([
        live,
        new Promise((resolve) => setTimeout(() => resolve(TIMED_OUT), DEADLINE)),
      ]);

      if (raced && raced !== TIMED_OUT) return raced;

      // Either the network is slow or it is gone. Paint what we have, and let
      // the request finish so the cache is right next time.
      event.waitUntil(live);
      return cached;
    })
  );
});
