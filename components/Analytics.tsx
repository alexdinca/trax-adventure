'use client';
import { usePathname } from 'next/navigation';
import { useAptabase } from '@aptabase/react';
import { useEffect, useRef } from 'react';
import { getSessionId, nextEventIndex, getDeviceTier, getReferrer } from '@/lib/analytics';

/**
 * What Aptabase is allowed to be told.
 *
 * Inside /app a path segment is not a page name — it is a credential or an
 * identity. /app/aftermath/<jwt> carries a signed token that opens a rider's
 * window for two years; /app/m/<serial> and /app/a/<serial> carry an object's
 * serial. Reporting the raw pathname would put all three into a third party's
 * database, which no amount of "page-open only" makes acceptable.
 *
 * So /app reports the module and stops. Public routes keep their slug, because
 * knowing which Field Note was read is the entire point of measuring them and
 * a slug there identifies an article, not a person.
 */
function reportedView(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/app/')) return pathname.split('/').slice(1, 3).join('/');
  return pathname.slice(1);
}

export function Analytics() {
  const pathname = usePathname();
  const { trackEvent } = useAptabase();
  // Capture referrer once on mount before navigation overwrites it
  const referrerRef = useRef<string>('');

  useEffect(() => {
    referrerRef.current = getReferrer();
  }, []);

  useEffect(() => {
    // Threshold is an honest private inventory of what a rider cannot do.
    // Nothing about it is measured, not even a screen view (BRD TH-12).
    if (pathname.startsWith('/app/threshold')) return;

    const view = reportedView(pathname);
    trackEvent('page_visit', {
      view,
      sessionId: getSessionId(),
      eventIndex: nextEventIndex(),
      device: getDeviceTier(),
      referrer: referrerRef.current,
      timestamp: new Date().toISOString(),
    });
  }, [pathname, trackEvent]);

  return null;
}
