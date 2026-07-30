import { readFileSync } from 'node:fs';
import type { Config } from 'drizzle-kit';

/**
 * drizzle-kit runs outside Next.js, so it does not pick up .env.local on its
 * own. Load it here rather than adding a dependency for one variable.
 */
function envLocal(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (m && m[1] === key) return m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no local env file; rely on the process environment */
  }
  return undefined;
}

export default {
  schema: './lib/app/db/schema.ts',
  out: './lib/app/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: envLocal('DATABASE_URL')!,
  },
} satisfies Config;
