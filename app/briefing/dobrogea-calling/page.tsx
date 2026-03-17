import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BriefingClient } from './BriefingClient';

export const metadata: Metadata = {
  title: 'Dobrogea Calling — Briefing',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: { token?: string | string[] };
}

export default function BriefingPage({ searchParams }: Props) {
  const token = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;
  const validToken = process.env.BRIEFING_TOKEN;

  if (!validToken || token !== validToken) {
    notFound();
  }

  return <BriefingClient />;
}
