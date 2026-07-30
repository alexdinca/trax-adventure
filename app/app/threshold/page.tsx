import type { Metadata } from 'next';
import { ThresholdClient } from './ThresholdClient';

export const metadata: Metadata = {
  title: 'Threshold',
  robots: { index: false, follow: false, nocache: true },
};

export default function ThresholdPage() {
  return <ThresholdClient />;
}
