import { NextResponse } from 'next/server';
import { experiences } from '@/lib/experiences-data';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const payload = experiences.map((e) => ({
    slug: e.slug,
    name: e.name,
    level: e.level,
    status: e.status,
    location: e.location,
    country: e.country,
    dates: e.dates,
    startDate: e.startDate ?? null,
    endDate: e.endDate ?? null,
    duration: e.duration,
    distanceKm: e.distanceKm ?? null,
    offRoadPercent: e.offRoadPercent ?? null,
    description: e.description,
    url: `https://ridetrax.eu${e.href}`,
  }));

  return NextResponse.json(
    { count: payload.length, experiences: payload },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
