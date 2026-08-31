import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        // The show-and-tell deck is a single static file in /public. This is
        // only so the URL reads as a path rather than a filename.
        source: '/show-and-tell',
        destination: '/show-and-tell.html',
      },
    ];
  },
  async headers() {
    return [
      {
        // Every page can be served as HTML or as Markdown depending on Accept
        // (see middleware.ts), so a cache keyed without Accept would hand an
        // agent the HTML variant, or a browser the Markdown one, depending on
        // which landed in the cache first.
        //
        // Declared here rather than in middleware: a header appended to
        // NextResponse.next() is overwritten by the Vary that Next assembles
        // for its own router cache. This emits a second Vary field instead,
        // which HTTP treats as equivalent to a comma-joined list, so the RSC
        // tokens survive intact.
        source: '/:path*',
        headers: [{ key: 'Vary', value: 'Accept' }],
      },
    ];
  },
};

const withMDXConfig = withMDX(nextConfig);

export default withSentryConfig(withMDXConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  telemetry: false,
  webpack: {
    automaticVercelMonitors: false,
  },
});
