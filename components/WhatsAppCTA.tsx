'use client';
import { useAptabase } from '@aptabase/react';
import { BUTTON_CLASSES } from './ui/Button';

interface WhatsAppCTAProps {
  label: string;
  source: string;
  href: string;
  eventName?: string;
}

export function WhatsAppCTA({ label, source, href, eventName = 'join_button_click' }: WhatsAppCTAProps) {
  const { trackEvent } = useAptabase();

  const handleClick = () => {
    trackEvent(eventName, { source, url: href, timestamp: new Date().toISOString() });
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} className={BUTTON_CLASSES}>
      {label}
    </a>
  );
}
