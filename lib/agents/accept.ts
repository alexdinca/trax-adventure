/**
 * Accept-header content negotiation, per acceptmarkdown.com.
 *
 * The four conformance points that spec asks for:
 *   1. serve markdown for `Accept: text/markdown`
 *   2. set `Vary: Accept`
 *   3. reject unsupported types with 406
 *   4. honour q-value precedence
 *
 * (2) is applied in middleware.ts; (1), (3) and (4) are decided here.
 *
 * Deliberately dependency-free so it can be unit-tested on its own and run
 * inside the edge middleware runtime without pulling anything in.
 */

export type Representation = 'markdown' | 'html' | 'unacceptable';

/** Media types we can actually produce for a marketing route. */
const MARKDOWN_TYPES = ['text/markdown', 'text/x-markdown'];
const HTML_TYPE = 'text/html';

interface Range {
  type: string;
  subtype: string;
  q: number;
}

/**
 * Parse an Accept header into media ranges.
 *
 * Malformed parameters are skipped rather than thrown on: a bad Accept is the
 * client's problem and must never turn into a 500 on ours. A q that will not
 * parse falls back to 1, which is what RFC 9110 says an absent q means.
 */
export function parseAccept(header: string | null | undefined): Range[] {
  if (!header) return [];

  const ranges: Range[] = [];
  for (const part of header.split(',')) {
    const [rawType, ...params] = part.trim().split(';');
    const slash = rawType.indexOf('/');
    if (slash < 0) continue;

    const type = rawType.slice(0, slash).trim().toLowerCase();
    const subtype = rawType.slice(slash + 1).trim().toLowerCase();
    if (!type || !subtype) continue;

    let q = 1;
    for (const p of params) {
      const eq = p.indexOf('=');
      if (eq < 0) continue;
      if (p.slice(0, eq).trim().toLowerCase() !== 'q') continue;
      const parsed = Number.parseFloat(p.slice(eq + 1).trim());
      if (Number.isFinite(parsed)) q = Math.min(Math.max(parsed, 0), 1);
    }

    ranges.push({ type, subtype, q });
  }
  return ranges;
}

/**
 * The best q this Accept header gives a concrete media type.
 *
 * RFC 9110 precedence: an exact `type/subtype` beats `type/*`, which beats
 * `*​/*`. Only the most specific match counts, so `text/html;q=0,*​/*` scores
 * html at 0 rather than at 1.
 */
export function qualityFor(ranges: Range[], mediaType: string): number {
  const slash = mediaType.indexOf('/');
  const type = mediaType.slice(0, slash);
  const subtype = mediaType.slice(slash + 1);

  let best = -1;
  let bestSpecificity = -1;

  for (const r of ranges) {
    let specificity: number;
    if (r.type === type && r.subtype === subtype) specificity = 3;
    else if (r.type === type && r.subtype === '*') specificity = 2;
    else if (r.type === '*' && r.subtype === '*') specificity = 1;
    else continue;

    if (specificity > bestSpecificity) {
      bestSpecificity = specificity;
      best = r.q;
    }
  }

  return best < 0 ? 0 : best;
}

/**
 * Which representation to serve.
 *
 * HTML wins ties on purpose. A browser sending
 * `text/html,application/xhtml+xml,*​/*;q=0.8` must keep getting the page, and
 * an agent that genuinely wants markdown says so by giving it a higher q — or
 * by asking for `text/markdown` alone, which scores 1 against html's 0.
 *
 * No Accept header at all is treated as "no preference", not as a refusal.
 * Plenty of scripted clients send none, and 406-ing them would be hostile.
 */
export function negotiate(header: string | null | undefined): Representation {
  const ranges = parseAccept(header);
  if (ranges.length === 0) return 'html';

  const markdown = Math.max(...MARKDOWN_TYPES.map((t) => qualityFor(ranges, t)));
  const html = qualityFor(ranges, HTML_TYPE);

  if (markdown > html) return 'markdown';
  if (html > 0) return 'html';
  if (markdown > 0) return 'markdown';
  return 'unacceptable';
}
