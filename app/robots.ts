import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /app is the rider-facing product: Threshold, Aftermath, the Ledger.
      // It is never indexed, by any agent (BRD DI-04).
      { userAgent: '*', allow: '/', disallow: '/app' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: 'https://ridetrax.eu/sitemap.xml',
  };
}
