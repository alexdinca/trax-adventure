export const runtime = 'nodejs';
export const dynamic = 'force-static';

/**
 * The Ledger's own manifest (BRD DI-03).
 *
 * Separate from /site.webmanifest, and scoped to /app so that installing the
 * Record never installs the marketing site. The distinct `id` is what stops
 * Android treating the two as the same app and silently replacing one with the
 * other on the home screen.
 *
 * It is linked from the Ledger page alone, not from the /app layout. A manifest
 * present on Threshold would let Chrome raise its own install UI at a stranger,
 * which is exactly the offer LG-11 says is made once, here, after a first
 * finish, in our own words.
 */
export function GET() {
  return Response.json(
    {
      id: '/app',
      name: 'TRAX — The Record',
      short_name: 'TRAX',
      scope: '/app/',
      start_url: '/app/ledger',
      display: 'standalone',
      theme_color: '#0E0F11',
      background_color: '#0E0F11',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    { headers: { 'content-type': 'application/manifest+json' } }
  );
}
