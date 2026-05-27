import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, type CalendarEvent, type EventType } from '@/lib/calendar-data';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const typeFilter = searchParams.get('type') as EventType | null;
  const fromFilter = searchParams.get('from');

  let events: CalendarEvent[] = getAllEvents();

  if (typeFilter && ['trax', 'collective', 'radar'].includes(typeFilter)) {
    events = events.filter((e) => e.type === typeFilter);
  }

  if (fromFilter) {
    events = events.filter((e) => e.startDate >= fromFilter);
  }

  const payload = events.map((e) => ({
    name: e.name,
    type: e.type,
    date: e.date,
    startDate: e.startDate,
    endDate: e.endDate ?? null,
    location: e.location ?? null,
    url: e.href
      ? e.href.startsWith('http') ? e.href : `https://ridetrax.eu${e.href}`
      : null,
    note: e.note ?? null,
  }));

  return NextResponse.json(
    { season: 2026, count: payload.length, events: payload },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
