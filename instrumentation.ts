/**
 * Sentry, on the server and at the edge.
 *
 * `@sentry/nextjs` exposes a namespace, not a default export. Destructuring
 * `default` off it yields undefined, and `Sentry.init` then throws — which is
 * why this hook has been failing silently on the server, and why it took the
 * whole site down the moment a middleware made the edge branch run per request.
 *
 * Both runtimes get the same config, so it is built once.
 */
const config = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
};

export async function register() {
  const runtime = process.env.NEXT_RUNTIME;
  if (runtime !== 'nodejs' && runtime !== 'edge') return;

  // A monitoring failure must never be able to fail a request. Before this
  // guard, one bad import in here returned a 500 for every page on the site.
  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init(config);
  } catch (err) {
    console.error('[instrumentation] Sentry did not start:', err);
  }
}
