import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * Signed links.
 *
 * There are no accounts anywhere in /app (BRD ID-01). A rider's authority to
 * open a surface is carried by a link the founder sent them, and nothing else.
 *
 * The Aftermath window is enforced HERE, on the server, by nbf and exp inside
 * a signed token. The device clock is never consulted: timezone drift alone
 * would open the instrument early for somebody (BRD AF-02).
 */

const secret = () => {
  const s = process.env.APP_TOKEN_SECRET;
  if (!s) throw new Error('APP_TOKEN_SECRET is not set');
  return new TextEncoder().encode(s);
};

const ISSUER = 'ridetrax.eu';

export interface AftermathClaims extends JWTPayload {
  /** rider id */
  sub: string;
  /** experience id */
  exp_id: number;
  purpose: 'aftermath';
}

/** Two years. A backstop against an ancient link, not the Aftermath window. */
const MAX_LIFE = '730d';

/**
 * Mint one rider's link for one running.
 *
 * The token carries identity only: which rider, which running. It deliberately
 * does NOT carry the window. A window baked into a signed link cannot be moved
 * afterwards, and the founder needs to open a collection months late and close
 * it when he decides it is done. The window is derived from the running in the
 * database on every request instead (see windowFor in db/schema).
 */
export async function mintAftermathToken(opts: {
  riderId: number;
  experienceId: number;
}): Promise<string> {
  return new SignJWT({ exp_id: opts.experienceId, purpose: 'aftermath' })
    .setProtectedHeader({ alg: 'HS256', kid: 'v1' })
    .setIssuer(ISSUER)
    .setSubject(String(opts.riderId))
    .setIssuedAt()
    .setExpirationTime(MAX_LIFE)
    .sign(secret());
}

export type Identity =
  | { ok: true; riderId: number; experienceId: number }
  | { ok: false };

/** Verify a link and report who it belongs to. Says nothing about the window. */
export async function readAftermathToken(token: string): Promise<Identity> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    const claims = payload as AftermathClaims;
    if (claims.purpose !== 'aftermath') return { ok: false };
    const riderId = Number(claims.sub);
    const experienceId = Number(claims.exp_id);
    if (!riderId || !experienceId) return { ok: false };
    return { ok: true, riderId, experienceId };
  } catch {
    return { ok: false };
  }
}

/** The founder-only guard, reusing the shared-secret pattern already shipped. */
export function isFounder(request: Request): boolean {
  const key = process.env.APP_ADMIN_KEY;
  if (!key) return false;
  const url = new URL(request.url);
  const supplied = url.searchParams.get('key') ?? request.headers.get('x-admin-key');
  return supplied === key;
}
