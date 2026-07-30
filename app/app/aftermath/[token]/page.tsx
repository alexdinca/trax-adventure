import type { Metadata } from 'next';
import { AftermathClient } from './AftermathClient';

export const metadata: Metadata = {
  title: 'Aftermath',
  robots: { index: false, follow: false, nocache: true },
};

export default function AftermathPage({ params }: { params: { token: string } }) {
  return <AftermathClient token={params.token} />;
}
