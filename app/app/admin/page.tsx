import type { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const metadata: Metadata = {
  title: 'Console',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminClient />;
}
