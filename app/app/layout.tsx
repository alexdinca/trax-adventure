import type { Metadata } from 'next';

/**
 * /app — the rider-facing product.
 *
 * No marketing chrome: PublicChrome, PublicFooter and the tyre-mark watermark
 * all suppress themselves on this path (components/PublicChrome.tsx).
 * Never indexed (BRD DI-04).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // No background colour here: the body already carries near-black, and an
    // opaque layer would paint over the tyre-mark watermark sitting behind it.
    <div className="trax-app min-h-[100svh]">
      {children}
    </div>
  );
}
