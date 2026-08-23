import { test } from 'node:test';
import assert from 'node:assert/strict';
import { negotiate, parseAccept, qualityFor } from '../lib/agents/accept.ts';

/**
 * Conformance point 4 of acceptmarkdown.com: honour q-value precedence.
 * This is the only piece of the negotiation with real logic in it, so it is
 * the piece worth testing away from a server.
 */

test('parseAccept reads types and q-values', () => {
  assert.deepEqual(parseAccept('text/markdown'), [
    { type: 'text', subtype: 'markdown', q: 1 },
  ]);
  assert.deepEqual(parseAccept('text/html;q=0.5, text/markdown;q=0.9'), [
    { type: 'text', subtype: 'html', q: 0.5 },
    { type: 'text', subtype: 'markdown', q: 0.9 },
  ]);
});

test('parseAccept survives junk rather than throwing', () => {
  assert.deepEqual(parseAccept(null), []);
  assert.deepEqual(parseAccept(''), []);
  assert.deepEqual(parseAccept('garbage'), []);
  // A q that will not parse falls back to 1, per RFC 9110's default.
  assert.equal(parseAccept('text/html;q=banana')[0].q, 1);
  // Out-of-range q values are clamped, not rejected.
  assert.equal(parseAccept('text/html;q=9')[0].q, 1);
  assert.equal(parseAccept('text/html;q=-3')[0].q, 0);
});

test('qualityFor prefers the most specific matching range', () => {
  // An explicit zero on the exact type beats a permissive wildcard.
  const ranges = parseAccept('text/html;q=0, */*');
  assert.equal(qualityFor(ranges, 'text/html'), 0);
  assert.equal(qualityFor(ranges, 'application/json'), 1);

  const wild = parseAccept('text/*;q=0.4, */*;q=0.1');
  assert.equal(qualityFor(wild, 'text/markdown'), 0.4);
  assert.equal(qualityFor(wild, 'image/png'), 0.1);
});

test('markdown is served only when it outranks html', () => {
  assert.equal(negotiate('text/markdown'), 'markdown');
  assert.equal(negotiate('text/x-markdown'), 'markdown');
  assert.equal(negotiate('text/markdown;q=0.9, text/html;q=0.8'), 'markdown');
  assert.equal(negotiate('text/markdown, text/html;q=0.5'), 'markdown');
});

test('browsers keep getting html', () => {
  // The Accept header Chrome actually sends.
  assert.equal(
    negotiate(
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    ),
    'html'
  );
  assert.equal(negotiate('*/*'), 'html');
  assert.equal(negotiate(null), 'html', 'no Accept header must not be a refusal');
  assert.equal(negotiate(''), 'html');
});

test('html wins ties, because html is the default representation', () => {
  assert.equal(negotiate('text/html, text/markdown'), 'html');
  assert.equal(negotiate('text/html;q=0.7, text/markdown;q=0.7'), 'html');
});

test('markdown still wins when html is explicitly refused', () => {
  assert.equal(negotiate('text/html;q=0, text/markdown;q=0.2'), 'markdown');
});

test('406 only when nothing we can produce is acceptable', () => {
  assert.equal(negotiate('application/json'), 'unacceptable');
  assert.equal(negotiate('image/png'), 'unacceptable');
  assert.equal(negotiate('text/html;q=0, text/markdown;q=0'), 'unacceptable');
  // A wildcard rescues it — the client said anything will do.
  assert.equal(negotiate('application/json, */*;q=0.1'), 'html');
});
