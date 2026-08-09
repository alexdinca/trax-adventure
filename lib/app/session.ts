import { cookies } from 'next/headers';
import { readSessionToken } from './tokens';

/**
 * The rider's session cookie.
 *
 * `Path=/app` is the whole point (BRD ID-02a): the cookie is never attached to
 * a request for the marketing site, so a shared laptop that browses ridetrax.eu
 * carries no rider identity on those requests. It also means anything that
 * needs to READ the session must live under /app — which is why the rider's own
 * data endpoint is /app/api/me rather than /api/app/me. The same path rule
 * governs the service worker's scope, so the two constraints agree.
 *
 * Setting the cookie is unaffected: /api/app/bind can issue a Path=/app cookie
 * from anywhere, because Set-Cookie chooses its own path.
 */

export const SESSION_COOKIE = 'trax_app';

const TWO_YEARS = 60 * 60 * 24 * 730;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/app',
    maxAge: TWO_YEARS,
  };
}

/**
 * Who is reading this page, if anyone.
 *
 * Returns a rider id, never a rider. Callers fetch the row themselves so that
 * a page which only needs to know "is there a session" never touches Neon
 * (BRD §10.2: no database call in a path that blocks first paint).
 */
export async function currentRiderId(): Promise<number | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token);
}

/** For route handlers reading the raw Request rather than next/headers. */
export async function riderFromRequest(req: Request): Promise<number | null> {
  const header = req.headers.get('cookie');
  if (!header) return null;
  const match = header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return readSessionToken(decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)));
}
