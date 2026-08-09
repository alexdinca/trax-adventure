/**
 * Artifact serials.
 *
 * `DC-MMXXVI-014`: which experience, the year of that running in Roman
 * numerals, and the issue number. The founding year on the wordmark is always
 * MMXXV, but a dated artifact carries the year of its own experience instead
 * (trax_bible_v_2, §Object Taxonomy).
 *
 * The serial is stamped on a physical object, so this module has to be
 * forgiving on the way in and strict on the way out. A rider reading a number
 * off a jacket label at a petrol station types it in whatever case and spacing
 * they manage; what gets stored and displayed is one canonical form.
 */

/** Experience slug → the letters on the object. */
export const SERIAL_PREFIX: Record<string, string> = {
  'dobrogea-calling': 'DC',
  'carpathian-ridge': 'CR',
  'out-there': 'OT',
  'the-ground': 'TG',
  'long-way-in': 'LWI',
};

const NUMERALS: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(year: number): string {
  let n = Math.floor(year);
  if (!Number.isFinite(n) || n < 1 || n > 3999) return '';
  let out = '';
  for (const [value, symbol] of NUMERALS) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

const VALUE: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/**
 * Roman → number, and zero for anything that is not a well-formed numeral.
 *
 * Round-tripping through toRoman is the check: it rejects IIII and XXXX, which
 * a loose subtractive parser would happily accept and which would let two
 * different strings name the same object.
 */
export function fromRoman(roman: string): number {
  const s = roman.toUpperCase();
  if (!s || !/^[IVXLCDM]+$/.test(s)) return 0;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const here = VALUE[s[i]];
    const next = VALUE[s[i + 1]] ?? 0;
    total += here < next ? -here : here;
  }
  return toRoman(total) === s ? total : 0;
}

export interface Serial {
  /** DC, CR, OT, TG, LWI — uppercase letters, no length assumption. */
  prefix: string;
  year: number;
  /** The issue number, as a number. Rendered zero-padded to three. */
  number: number;
  /** The canonical string: DC-MMXXVI-014. */
  canonical: string;
}

export function formatSerial(prefix: string, year: number, number: number): string {
  return `${prefix.toUpperCase()}-${toRoman(year)}-${String(number).padStart(3, '0')}`;
}

/**
 * Parse whatever was typed. Returns null rather than guessing.
 *
 * Accepts `dc mmxxvi 14`, `DC/MMXXVI/014`, `DCMMXXVI014` and the canonical
 * form. Rejects an unknown-shaped serial outright: a lookup that half-works is
 * worse than one that says it does not recognise the number.
 */
export function parseSerial(input: string): Serial | null {
  const raw = (input ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!raw) return null;

  // Letters, then a Roman year, then digits. The year and the prefix are both
  // letters, so the split is anchored on the trailing digits and on the fact
  // that a year always starts with M for any date this brand will ever stamp.
  const m = raw.match(/^([A-Z]+?)(M[IVXLCDM]*)(\d{1,4})$/);
  if (!m) return null;

  const [, prefix, roman, digits] = m;
  const year = fromRoman(roman);
  const number = Number(digits);
  if (!year || !number) return null;
  if (year < 2025 || year > 2100) return null;

  return { prefix, year, number, canonical: formatSerial(prefix, year, number) };
}

/** The canonical string, or null. The only thing that may reach the database. */
export function normalizeSerial(input: string): string | null {
  return parseSerial(input)?.canonical ?? null;
}

/** What the input mask shows before anything is typed. */
export const SERIAL_PLACEHOLDER = 'DC-MMXXVI-___';
