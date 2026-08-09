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

/* ── Binding a device to a rider (BRD ID-02) ───────────────────────────────
   Two different tokens, and the difference matters. The invite is a one-time
   claim that travels over WhatsApp and dies on redemption; the session is what
   the device keeps afterwards. Separating them means a forwarded invite link is
   spent rather than shared, and a stolen session cannot be replayed into a new
   binding. */

const INVITE_LIFE = '14d';
/** Two years. An app opened four times a year must not log itself out. */
const SESSION_LIFE = '730d';

export interface InviteClaims extends JWTPayload {
  sub: string;
  jti: string;
  purpose: 'bind';
}

/**
 * Mint one invite. The jti is the row in `invites`; this only signs it.
 *
 * The caller writes the row first and passes the same jti in, so a signature
 * that verifies but has no matching row is always a forgery attempt rather
 * than a race.
 */
export async function mintInviteToken(opts: {
  riderId: number;
  jti: string;
}): Promise<string> {
  return new SignJWT({ purpose: 'bind' })
    .setProtectedHeader({ alg: 'HS256', kid: 'v1' })
    .setIssuer(ISSUER)
    .setSubject(String(opts.riderId))
    .setJti(opts.jti)
    .setIssuedAt()
    .setExpirationTime(INVITE_LIFE)
    .sign(secret());
}

export type InviteIdentity = { ok: true; riderId: number; jti: string } | { ok: false };

export async function readInviteToken(token: string): Promise<InviteIdentity> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    const claims = payload as InviteClaims;
    if (claims.purpose !== 'bind') return { ok: false };
    const riderId = Number(claims.sub);
    if (!riderId || !claims.jti) return { ok: false };
    return { ok: true, riderId, jti: claims.jti };
  } catch {
    return { ok: false };
  }
}

export interface SessionClaims extends JWTPayload {
  sub: string;
  purpose: 'session';
}

export async function mintSessionToken(riderId: number): Promise<string> {
  return new SignJWT({ purpose: 'session' })
    .setProtectedHeader({ alg: 'HS256', kid: 'v1' })
    .setIssuer(ISSUER)
    .setSubject(String(riderId))
    .setIssuedAt()
    .setExpirationTime(SESSION_LIFE)
    .sign(secret());
}

/** Verify a session cookie. Returns the rider id, or null for anything else. */
export async function readSessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    const claims = payload as SessionClaims;
    if (claims.purpose !== 'session') return null;
    const riderId = Number(claims.sub);
    return riderId || null;
  } catch {
    return null;
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
