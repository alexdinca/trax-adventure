'use client';
import { useAptabase } from '@aptabase/react';
import { Body, MonoLabel } from './ui/Typography';
import { BUTTON_CLASSES } from './ui/Button';
import { whatsappLink } from '@/lib/whatsapp';

const WHATSAPP_HREF = whatsappLink('Salut,\nVreau să mă alătur experienței din Dobrogea.\nÎmi dai te rog mai multe detalii?');

export function DobrogeaCallingCTA() {
  const { trackEvent } = useAptabase();

  const handleClick = () => {
    trackEvent('join_button_click', { source: 'dobrogea_calling_page', url: WHATSAPP_HREF, timestamp: new Date().toISOString() });
  };

  return (
    <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
      <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
      <p className="font-body text-xl md:text-2xl text-trax-white mb-8">There is no public booking button.</p>
      <Body className="mx-auto mb-8">If this experience resonates, you'll feel it. If it doesn't, that's fine.</Body>
      <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" onClick={handleClick} className={`${BUTTON_CLASSES} mb-4`}>Answer the Calling</a>
    </div>
  );
}
