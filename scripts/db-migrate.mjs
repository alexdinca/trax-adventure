// Apply the generated SQL migrations to Neon over the HTTP driver.
//
// drizzle-kit push wants a WebSocket connection, which the serverless driver
// does not provide in Node without extra deps. The HTTP driver is the same one
// the app uses at runtime, so this keeps the dependency surface identical.
//
// Run: node scripts/db-migrate.mjs

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';

function loadEnv(key) {
  if (process.env[key]) return process.env[key];
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (m && m[1] === key) return m[2].trim().replace(/^["']|["']$/g, '');
  }
  throw new Error(`${key} not found`);
}

const sql = neon(loadEnv('DATABASE_URL'));
const dir = 'lib/app/db/migrations';

const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

for (const file of files) {
  const body = readFileSync(path.join(dir, file), 'utf8');
  // drizzle separates statements with its own marker
  const statements = body
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean);

  process.stdout.write(`${file}: ${statements.length} statements\n`);
  for (const stmt of statements) {
    try {
      await sql.query(stmt);
    } catch (err) {
      const msg = String(err.message ?? err);
      // Re-running a migration should be harmless.
      if (/already exists/i.test(msg)) {
        process.stdout.write('  · already there, skipped\n');
        continue;
      }
      process.stdout.write(`  ! ${msg}\n`);
      process.exit(1);
    }
  }
}

const tables = await sql`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name
`;
process.stdout.write(`\ntables now present: ${tables.map((t) => t.table_name).join(', ')}\n`);
