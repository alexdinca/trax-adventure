'use client';
import { useAptabase } from '@aptabase/react';
import { Button } from './ui/Button';

interface WhatsAppCTAProps {
  label: string;
  source: string;
  eventName?: string;
  url?: string;
}

const DEFAULT_URL = 'https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD';

export function WhatsAppCTA({ label, source, eventName = 'join_button_click', url = DEFAULT_URL }: WhatsAppCTAProps) {
  const { trackEvent } = useAptabase();

  const handleClick = () => {
    trackEvent(eventName, { source, url, timestamp: new Date().toISOString() });
    window.open(url, '_blank');
  };

  return <Button onClick={handleClick}>{label}</Button>;
}
