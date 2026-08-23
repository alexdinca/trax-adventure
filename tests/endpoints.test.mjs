import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';

/**
 * The public contract, checked over real HTTP.
 *
 * Runs against BASE_URL (default http://localhost:3000). Point it at
 * production to verify a deploy:
 *
 *   BASE_URL=https://ridetrax.eu node --test tests/endpoints.test.mjs
 *
 * If nothing is listening, every test skips rather than fails — a missing
 * server is not a broken contract, and `npm test` should stay useful without
 * one running.
 */

const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
let reachable = false;

before(async () => {
  try {
    const res = await fetch(BASE, { redirect: 'manual' });
    reachable = res.status < 500;
  } catch {
    reachable = false;
  }
  if (!reachable) console.log(`\n  (skipping: nothing answering at ${BASE})\n`);
});

const get = (path, init) => fetch(`${BASE}${path}`, { redirect: 'manual', ...init });
const md = (path) => get(path, { headers: { accept: 'text/markdown' } });

function needsServer(t) {
  if (!reachable) {
    t.skip('no server');
    return true;
  }
  return false;
}

describe('agent-friendly 404s', () => {
  test('a nonexistent path answers 404, not 200', async (t) => {
    if (needsServer(t)) return;
    const res = await get('/this-path-does-not-exist-9f3a');
    assert.equal(res.status, 404);
  });

  test('the html 404 offers somewhere to go next', async (t) => {
    if (needsServer(t)) return;
    const body = await (await get('/this-path-does-not-exist-9f3a')).text();
    assert.match(body, /sitemap\.xml/, 'should point at the sitemap');
    assert.match(body, /llms\.txt/, 'should point at llms.txt');
  });

  test('the markdown 404 is markdown, with recovery links', async (t) => {
    if (needsServer(t)) return;
    const res = await md('/this-path-does-not-exist-9f3a');
    assert.equal(res.status, 404);
    assert.match(res.headers.get('content-type') ?? '', /text\/markdown/);
    const body = await res.text();
    assert.match(body, /^# 404/m);
    assert.match(body, /llms\.txt/);
    assert.match(body, /sitemap\.xml/);
  });
});

describe('markdown content negotiation (acceptmarkdown.com)', () => {
  const pages = ['/', '/experiences', '/calendar', '/manifesto', '/about', '/contact', '/privacy'];

  for (const path of pages) {
    test(`${path} serves markdown on request`, async (t) => {
      if (needsServer(t)) return;
      const res = await md(path);
      assert.equal(res.status, 200, `${path} should be 200`);
      assert.match(
        res.headers.get('content-type') ?? '',
        /text\/markdown; ?charset=utf-8/,
        `${path} content-type`
      );
      const body = await res.text();
      assert.match(body, /^#\s/m, `${path} should open with a markdown heading`);
      assert.ok(body.length > 200, `${path} markdown should have substance`);
    });
  }

  /**
   * `Accept` must be a token of its own. Matching /accept/i would pass on
   * `Accept-Encoding`, which Next adds by itself and which says nothing about
   * markdown negotiation — that false positive hid a real miss once already.
   */
  const varyHasAccept = (vary) =>
    vary
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .includes('accept');

  test('Vary includes Accept on the markdown response', async (t) => {
    if (needsServer(t)) return;
    const vary = (await md('/experiences')).headers.get('vary') ?? '';
    assert.ok(varyHasAccept(vary), `Vary was "${vary}"`);
  });

  /**
   * Next assembles its own Vary for the router cache on page responses and
   * overwrites anything middleware or next.config adds. On production the
   * header is applied by Vercel's edge (vercel.json), which runs after the
   * function — so this can only be verified against a deployed origin.
   */
  test('Vary includes Accept on the html response', async (t) => {
    if (needsServer(t)) return;
    if (new URL(BASE).hostname === 'localhost') {
      t.skip('applied by the Vercel edge; run with BASE_URL=https://ridetrax.eu');
      return;
    }
    const vary = (await get('/experiences')).headers.get('vary') ?? '';
    assert.ok(varyHasAccept(vary), `Vary was "${vary}"`);
  });

  test('the html response keeps Next’s own RSC Vary tokens', async (t) => {
    if (needsServer(t)) return;
    // Adding Accept must not cost the router-cache correctness headers.
    const vary = ((await get('/experiences')).headers.get('vary') ?? '').toLowerCase();
    assert.match(vary, /rsc/, `Vary was "${vary}"`);
    assert.match(vary, /next-router-state-tree/, `Vary was "${vary}"`);
  });

  test('html is still the default for browsers', async (t) => {
    if (needsServer(t)) return;
    const res = await get('/experiences', {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    assert.match(res.headers.get('content-type') ?? '', /text\/html/);
  });

  test('q-value precedence is honoured', async (t) => {
    if (needsServer(t)) return;
    const mdWins = await get('/experiences', {
      headers: { accept: 'text/html;q=0.4, text/markdown;q=0.9' },
    });
    assert.match(mdWins.headers.get('content-type') ?? '', /text\/markdown/);

    const htmlWins = await get('/experiences', {
      headers: { accept: 'text/html;q=0.9, text/markdown;q=0.4' },
    });
    assert.match(htmlWins.headers.get('content-type') ?? '', /text\/html/);
  });

  test('unsupported types are refused with 406', async (t) => {
    if (needsServer(t)) return;
    const res = await get('/experiences', { headers: { accept: 'application/vnd.made-up' } });
    assert.equal(res.status, 406);
    assert.match((res.headers.get('vary') ?? '').toLowerCase(), /accept/);
  });

  test('negotiation never touches the rider app or the json api', async (t) => {
    if (needsServer(t)) return;
    const app = await md('/app/threshold');
    assert.ok(
      !/text\/markdown/.test(app.headers.get('content-type') ?? ''),
      '/app must not be markdown-negotiated'
    );
    const api = await md('/api/experiences');
    assert.match(api.headers.get('content-type') ?? '', /application\/json/);
  });
});

describe('trust anchor pages', () => {
  for (const path of ['/about', '/contact', '/privacy']) {
    test(`${path} exists and has real content`, async (t) => {
      if (needsServer(t)) return;
      const res = await get(path);
      assert.equal(res.status, 200);
      const text = (await res.text()).replace(/<[^>]+>/g, ' ');
      assert.ok(
        text.length > 500,
        `${path} should carry more than 500 characters of text, had ${text.length}`
      );
    });
  }

  test('the sitemap lists them', async (t) => {
    if (needsServer(t)) return;
    const xml = await (await get('/sitemap.xml')).text();
    for (const path of ['/about', '/contact', '/privacy']) {
      assert.match(xml, new RegExp(path.replace('/', '\\/')), `sitemap should list ${path}`);
    }
  });
});

describe('metadata completeness', () => {
  test('the home page carries all four entity signals', async (t) => {
    if (needsServer(t)) return;
    const html = await (await get('/')).text();
    assert.match(html, /<html[^>]+lang="/i, 'html lang');
    assert.match(html, /rel="canonical"/i, 'canonical');
    assert.match(html, /property="og:image"/i, 'og:image');
    assert.match(html, /property="og:type"/i, 'og:type');
  });
});

describe('organization schema', () => {
  test('includes contactPoint and address', async (t) => {
    if (needsServer(t)) return;
    const html = await (await get('/')).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    const org = blocks
      .map((m) => {
        try {
          return JSON.parse(m[1]);
        } catch {
          return null;
        }
      })
      .find((j) => j && j['@type'] === 'Organization');

    assert.ok(org, 'Organization JSON-LD should be present');
    assert.ok(org.address, 'address');
    assert.equal(org.address['@type'], 'PostalAddress');
    assert.ok(org.address.addressCountry, 'address.addressCountry');
    const contact = Array.isArray(org.contactPoint) ? org.contactPoint[0] : org.contactPoint;
    assert.ok(contact, 'contactPoint');
    assert.equal(contact['@type'], 'ContactPoint');
    assert.ok(contact.contactType, 'contactPoint.contactType');
    assert.ok(contact.telephone || contact.email, 'contactPoint needs a phone or an email');
  });
});

describe('agent instruction file', () => {
  test('llms.txt carries when-to-use guidance', async (t) => {
    if (needsServer(t)) return;
    const res = await get('/llms.txt');
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.match(body, /##\s*When to use this site/i);
    assert.match(body, /Do not use this site for/i);
    assert.match(body, /How to call this site/i);
    assert.match(body, /Accept: text\/markdown/);
  });
});

describe('nothing was broken on the way', () => {
  test('the marketing pages still render html', async (t) => {
    if (needsServer(t)) return;
    for (const path of ['/', '/experiences', '/calendar', '/out-there']) {
      const res = await get(path);
      assert.equal(res.status, 200, `${path} status`);
      assert.match(res.headers.get('content-type') ?? '', /text\/html/, `${path} type`);
    }
  });

  test('the json api is unchanged', async (t) => {
    if (needsServer(t)) return;
    const j = await (await get('/api/experiences')).json();
    assert.ok(Array.isArray(j.experiences) && j.experiences.length === 5);
  });

  test('/app is still noindex and still routes strangers to Threshold', async (t) => {
    if (needsServer(t)) return;
    const res = await get('/app');
    assert.ok([307, 308].includes(res.status), `expected a redirect, got ${res.status}`);
    assert.match(res.headers.get('location') ?? '', /\/app\/threshold/);
  });

  test('robots still disallows /app', async (t) => {
    if (needsServer(t)) return;
    const body = await (await get('/robots.txt')).text();
    assert.match(body, /Disallow: \/app/);
  });
});
