import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * The database client.
 *
 * Neon over HTTP rather than TCP, because serverless functions cannot hold a
 * persistent connection pool. Neon's free tier suspends compute when idle, so
 * the first query after a quiet spell can take a second or two: never put a
 * call to this in a path that blocks first paint (BRD §10.2).
 *
 * Created lazily. Next.js evaluates route modules during `next build`, where
 * DATABASE_URL is deliberately absent, so connecting at import time would fail
 * every build. Nothing here touches the network until a query actually runs.
 */

let client: NeonHttpDatabase<typeof schema> | null = null;

function connect(): NeonHttpDatabase<typeof schema> {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  client = drizzle(neon(url), { schema });
  return client;
}

/** Proxy so call sites can use `db.select()` while connection stays deferred. */
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(connect(), prop, receiver);
  },
});

export { schema };
