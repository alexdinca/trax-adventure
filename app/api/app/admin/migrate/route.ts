import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { BOOTSTRAP_SQL } from '@/lib/app/db/bootstrap';
import { isFounder } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Founder only. Create the tables.
 *
 * This exists because Vercel marks integration-created variables as sensitive,
 * so DATABASE_URL cannot be pulled to a laptop to run a migration from there.
 * Running it here, once, from inside the deployment, is the honest way.
 *
 * Every statement is idempotent. Calling this twice does nothing the second
 * time. It never drops or alters anything that holds data.
 */
export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });

  const sql = neon(url);
  const done: string[] = [];

  for (const statement of BOOTSTRAP_SQL) {
    try {
      await sql.query(statement);
      done.push(statement.trim().split('\n')[0].slice(0, 60));
    } catch (err) {
      return NextResponse.json(
        { error: String((err as Error).message), failedOn: statement.slice(0, 120), done },
        { status: 500 }
      );
    }
  }

  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name
  `;

  return NextResponse.json({
    ok: true,
    applied: done.length,
    tables: tables.map((t: Record<string, unknown>) => t.table_name),
  });
}
