'use client';
import { useAptabase } from '@aptabase/react';
import { Container } from './ui/Container';
import { Body, MonoLabel } from './ui/Typography';
import { Button } from './ui/Button';

export function DobrogeaCallingCTA() {
  const { trackEvent } = useAptabase();

  const handleJoinClick = () => {
    const url = 'https://wa.me/40721766484?text=Salut%2C%0AVreau%20s%C4%83%20m%C4%83%20al%C4%83tur%20experien%C8%9Bei%20din%20Dobrogea.%0A%C3%8Emi%20dai%20te%20rog%20mai%20multe%20detalii%3F';
    trackEvent('join_button_click', { source: 'dobrogea_calling_page', url, timestamp: new Date().toISOString() });
    window.open(url, '_blank');
  };

  return (
    <div className="text-center max-w-2xl mx-auto border border-trax-grey/30 p-12">
      <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
      <p className="font-body text-xl md:text-2xl text-trax-white mb-8">There is no public booking button.</p>
      <Body className="mx-auto mb-8">If this experience resonates, you'll feel it. If it doesn't, that's fine.</Body>
      <Button onClick={handleJoinClick} className="mb-4">Answer the Calling</Button>
    </div>
  );
}
