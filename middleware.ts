import { NextResponse, type NextRequest } from 'next/server';
import { negotiate } from './lib/agents/accept';

/**
 * Content negotiation for agents (acceptmarkdown.com).
 *
 * An agent asking for `text/markdown` gets markdown at the same URL the HTML
 * lives at — no `.md` suffix, no separate docs domain. Everything else is
 * passed through untouched.
 *
 * `Vary: Accept` is APPENDED rather than set. Next.js puts its own
 * `rsc, next-router-state-tree, next-router-prefetch` on these responses and
 * the client router depends on it; overwriting that to satisfy an audit would
 * break prefetching to fix a header.
 */

/** Carries the requested path across the internal rewrite. */
export const MD_PATH_HEADER = 'x-trax-md-path';

/** The rider product, the JSON API, and anything with a file extension. */
function isOutOfScope(pathname: string): boolean {
  if (pathname === '/app' || pathname.startsWith('/app/')) return true;
  if (pathname === '/api' || pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  // A dot in the last segment means a static file: robots.txt, sitemap.xml,
  // llms.txt, images. Those already have correct content types.
  return pathname.split('/').pop()?.includes('.') ?? false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isOutOfScope(pathname)) return NextResponse.next();

  const wanted = negotiate(request.headers.get('accept'));

  if (wanted === 'unacceptable') {
    return new NextResponse(
      `# 406 — Not Acceptable\n\nThis URL can be served as \`text/html\` or \`text/markdown\`.\nSee https://ridetrax.eu/llms.txt\n`,
      {
        status: 406,
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          vary: 'Accept',
        },
      }
    );
  }

  if (wanted === 'markdown') {
    const url = request.nextUrl.clone();
    url.pathname = '/api/markdown';

    // The original path travels as a request header, not a query parameter.
    // A rewritten route handler does not reliably see search params added by
    // middleware — it read them as absent and answered every unknown path with
    // the home page at 200, which is precisely the "every path exists" failure
    // this whole change exists to remove. Headers survive the rewrite.
    const headers = new Headers(request.headers);
    headers.set(MD_PATH_HEADER, pathname);

    const res = NextResponse.rewrite(url, { request: { headers } });
    res.headers.append('Vary', 'Accept');
    return res;
  }

  const res = NextResponse.next();
  res.headers.append('Vary', 'Accept');
  return res;
}

export const config = {
  // Everything except Next's own static output. The finer exclusions are made
  // in isOutOfScope, where they can be read.
  matcher: ['/((?!_next/static|_next/image).*)'],
};
