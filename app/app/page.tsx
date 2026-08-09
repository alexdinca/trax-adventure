import { redirect } from 'next/navigation';
import { currentRiderId } from '@/lib/app/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * /app entry.
 *
 * BRD §4: the app has two states. Without a record, the app *is* Threshold.
 * With one, it opens directly into the Record. There is no tab bar and no
 * chooser between them, because they are not peers (IA-01).
 *
 * Only the cookie is read here, never the database. A rider whose row has since
 * been deleted lands on the Ledger and is bounced to Threshold from there,
 * which costs one redirect in a case that should not happen, and keeps Neon out
 * of the path that decides what the app even is.
 *
 * Empty states are never rendered (BRD §4).
 */
export default async function AppIndex() {
  const riderId = await currentRiderId();
  redirect(riderId ? '/app/ledger' : '/app/threshold');
}
