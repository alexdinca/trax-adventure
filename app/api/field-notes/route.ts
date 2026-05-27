import { NextResponse } from 'next/server';
import { getAllFieldNotes } from '@/lib/field-notes';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const notes = getAllFieldNotes();

  const payload = notes.map((n) => ({
    slug: n.slug,
    title: n.title,
    date: n.date,
    location: n.location || null,
    excerpt: n.excerpt,
    url: `https://ridetrax.eu/field-notes/${n.slug}`,
  }));

  return NextResponse.json(
    { count: payload.length, fieldNotes: payload },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
