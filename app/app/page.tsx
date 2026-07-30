import { redirect } from 'next/navigation';

/**
 * /app entry.
 *
 * BRD §4: the app has two states. Without a record, the app *is* Threshold.
 * With a record, it opens into the Ledger. Until the Ledger ships (Phase 3)
 * there is only State A, so this resolves straight to Threshold.
 *
 * Empty states are never rendered (BRD §4).
 */
export default function AppIndex() {
  redirect('/app/threshold');
}
