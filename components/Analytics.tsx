'use client';
import { usePathname } from 'next/navigation';
import { useAptabase } from '@aptabase/react';
import { useEffect, useRef } from 'react';
import { getSessionId, nextEventIndex, getDeviceTier, getReferrer } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const { trackEvent } = useAptabase();
  // Capture referrer once on mount before navigation overwrites it
  const referrerRef = useRef<string>('');

  useEffect(() => {
    referrerRef.current = getReferrer();
  }, []);

  useEffect(() => {
    const view = pathname === '/' ? 'home' : pathname.slice(1);
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
