'use client';
import { usePathname } from 'next/navigation';
import { useAptabase } from '@aptabase/react';
import { useEffect } from 'react';

export function Analytics() {
  const pathname = usePathname();
  const { trackEvent } = useAptabase();

  useEffect(() => {
    const view = pathname === '/' ? 'home' : pathname.slice(1);
    trackEvent('page_visit', { view, timestamp: new Date().toISOString() });
  }, [pathname, trackEvent]);

  return null;
}
