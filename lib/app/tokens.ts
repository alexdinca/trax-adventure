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

/**
 * Mint one rider's link for one experience.
 *
 * @param opensAt  finish + 24h. Before this the page will not resolve.
 * @param closesAt finish + 7 days. After this it stops accepting writes.
 */
export async function mintAftermathToken(opts: {
  riderId: number;
  experienceId: number;
  opensAt: Date;
  closesAt: Date;
}): Promise<string> {
  return new SignJWT({ exp_id: opts.experienceId, purpose: 'aftermath' })
    .setProtectedHeader({ alg: 'HS256', kid: 'v1' })
    .setIssuer(ISSUER)
    .setSubject(String(opts.riderId))
    .setIssuedAt()
    .setNotBefore(opts.opensAt)
    .setExpirationTime(opts.closesAt)
    .sign(secret());
}

export type WindowState =
  | { state: 'open'; riderId: number; experienceId: number; closesAt: Date }
  | { state: 'early'; opensAt: Date }
  | { state: 'closed' }
  | { state: 'invalid' };

/**
 * Verify a token and report where we are in its window.
 *
 * jose throws distinct errors for "not yet valid" and "expired", which is
 * exactly the distinction the rider-facing copy needs: one is a door that has
 * not opened, the other is a door that has closed.
 */
export async function readAftermathToken(token: string): Promise<WindowState> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
    const claims = payload as AftermathClaims;
    if (claims.purpose !== 'aftermath') return { state: 'invalid' };
    return {
      state: 'open',
      riderId: Number(claims.sub),
      experienceId: Number(claims.exp_id),
      closesAt: new Date((claims.exp ?? 0) * 1000),
    };
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
      // Distinguish "too early" from a malformed claim by decoding without
      // verifying time. The signature has already been checked by this point
      // only in the expired case, so decode defensively.
      const nbf = readClaimUnsafe(token, 'nbf');
      if (nbf && nbf * 1000 > Date.now()) return { state: 'early', opensAt: new Date(nbf * 1000) };
      return { state: 'invalid' };
    }
    if (code === 'ERR_JWT_EXPIRED') return { state: 'closed' };
    return { state: 'invalid' };
  }
}

/**
 * Read one numeric claim from an unverified token, for the sole purpose of
 * telling a rider when their window opens. Never used for authorisation.
 */
function readClaimUnsafe(token: string, claim: string): number | null {
  try {
    const part = token.split('.')[1];
    const json = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
    const v = json?.[claim];
    return typeof v === 'number' ? v : null;
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
