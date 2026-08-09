'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mark, Block } from '@/components/app/primitives';
import { RUNGS } from '@/lib/app/ladder';
import { formatSerial } from '@/lib/app/serial';

/**
 * One rider's Record, from the back of the house.
 *
 * Everything on this screen is the founder writing down something that already
 * happened. Nothing is derived: ticking a finish does not promote anybody, and
 * issuing an object does not tick a finish. LG-13 says the app never mints
 * standing, and the way to keep that true is to give it no rule that could.
 */

type Api = (path: string, init?: RequestInit) => Promise<Response>;

type Exp = { id: number; slug: string; name: string; year: number; finishedAt: string };
type Completion = {
  id: number;
  experienceId: number;
  completedAt: string;
  name: string;
  year: number;
};
type Artifact = {
  serial: string;
  experienceId: number | null;
  tier: string;
  year: number;
  issuedAt: string;
  status: string;
  handedBy: string | null;
  photo: string | null;
};
type Blank = { id: number; occurredAt: string };
type Invite = {
  jti: string;
  expiresAt: string;
  redeemedAt: string | null;
  createdAt: string;
};

const day = (iso: string) => iso.slice(0, 10);
const shown = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export function RecordEditor({
  api,
  riderId,
  rung,
  onRung,
}: {
  api: Api;
  riderId: number;
  rung: string;
  onRung: (rung: string) => void;
}) {
  const [exps, setExps] = useState<Exp[]>([]);
  const [done, setDone] = useState<Completion[]>([]);
  const [held, setHeld] = useState<Artifact[]>([]);
  const [gaps, setGaps] = useState<Blank[]>([]);
  const [prefixes, setPrefixes] = useState<Record<string, string>>({});
  const [invites, setInvites] = useState<Invite[]>([]);
  const [minted, setMinted] = useState<{ url: string; phone: string | null } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [r, i] = await Promise.all([
      api(`record?riderId=${riderId}`).then((x) => x.json()),
      api(`invite?riderId=${riderId}`).then((x) => x.json()),
    ]);
    setExps(r.experiences ?? []);
    setDone(r.completions ?? []);
    setHeld(r.artifacts ?? []);
    setGaps(r.blanks ?? []);
    setPrefixes(r.prefixes ?? {});
    setInvites(i.invites ?? []);
  }, [api, riderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const finished = new Set(done.map((d) => d.experienceId));

  async function toggleFinish(e: Exp) {
    setBusy(true);
    try {
      const existing = done.find((d) => d.experienceId === e.id);
      if (existing) {
        await api(`record?what=completion&id=${existing.id}`, { method: 'DELETE' });
      } else {
        await api('record', {
          method: 'POST',
          body: JSON.stringify({ what: 'completion', riderId, experienceId: e.id }),
        });
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pl-4 border-l border-trax-white/15 pb-8">
      {/* ── Standing ─────────────────────────────────────────────────── */}
      <Mark className="block mb-3">Standing</Mark>
      <div className="flex flex-wrap gap-4">
        {RUNGS.map((r) => (
          <button
            key={r}
            onClick={async () => {
              await api('riders', {
                method: 'PATCH',
                body: JSON.stringify({ id: riderId, rung: r }),
              });
              onRung(r);
            }}
          >
            <Mark className={r === rung ? 'text-trax-white' : 'text-trax-grey/40'}>{r}</Mark>
          </button>
        ))}
      </div>
      <Mark className="block mt-3 text-trax-grey/50">
        set by hand. finishing something never moves this on its own
      </Mark>

      {/* ── Finishes ─────────────────────────────────────────────────── */}
      <Block space="md">
        <Mark className="block mb-3">Finished</Mark>
        {exps.length === 0 && <Mark className="text-trax-grey/50">no runnings yet</Mark>}
        <div className="space-y-1">
          {exps.map((e) => (
            <button
              key={e.id}
              type="button"
              role="checkbox"
              aria-checked={finished.has(e.id)}
              disabled={busy}
              onClick={() => void toggleFinish(e)}
              className="flex gap-3 items-center text-left w-full py-1"
            >
              <Tick on={finished.has(e.id)} />
              <span className="font-body text-sm text-trax-white/85">
                {e.name} <span className="text-trax-grey">{e.year}</span>
              </span>
            </button>
          ))}
        </div>
      </Block>

      {/* ── Artifacts ────────────────────────────────────────────────── */}
      <Block space="md">
        <Mark className="block mb-3">Artifacts</Mark>
        {held.map((a) => (
          <div key={a.serial} className="flex items-center justify-between gap-4 py-2">
            <span className="font-mono text-[11px] uppercase text-trax-white/85">
              {a.serial}
              <span className="text-trax-grey">
                {' '}
                · {a.tier} · {shown(a.issuedAt)}
                {a.status !== 'held' ? ` · ${a.status}` : ''}
              </span>
            </span>
            <button
              onClick={async () => {
                if (!confirm(`Remove ${a.serial} from this rider?`)) return;
                await api(`record?what=artifact&serial=${a.serial}&riderId=${riderId}`, {
                  method: 'DELETE',
                });
                await load();
              }}
            >
              <Mark className="text-trax-grey/40">remove</Mark>
            </button>
          </div>
        ))}
        <IssueArtifact
          api={api}
          riderId={riderId}
          exps={exps}
          prefixes={prefixes}
          onDone={load}
        />
      </Block>

      {/* ── Blanks ───────────────────────────────────────────────────── */}
      <Block space="md">
        <Mark className="block mb-3">Not recorded</Mark>
        {gaps.map((b) => (
          <div key={b.id} className="flex items-center justify-between gap-4 py-2">
            <Mark className="text-trax-white/70">{shown(b.occurredAt)}</Mark>
            <button
              onClick={async () => {
                await api(`record?what=blank&id=${b.id}`, { method: 'DELETE' });
                await load();
              }}
            >
              <Mark className="text-trax-grey/40">remove</Mark>
            </button>
          </div>
        ))}
        <AddBlank api={api} riderId={riderId} onDone={load} />
        <Mark className="block mt-2 text-trax-grey/50">
          a dated entry holding nothing. it takes a date and refuses a description on purpose
        </Mark>
      </Block>

      {/* ── The bind link ────────────────────────────────────────────── */}
      <Block space="md">
        <Mark className="block mb-3">Ledger link</Mark>
        {invites.length > 0 && (
          <Mark className="block mb-3 text-trax-grey/60">
            {invites.filter((i) => i.redeemedAt).length} used ·{' '}
            {invites.filter((i) => !i.redeemedAt && new Date(i.expiresAt) > new Date()).length} live
          </Mark>
        )}
        <button
          onClick={async () => {
            const r = await api('invite', {
              method: 'POST',
              body: JSON.stringify({ riderId }),
            }).then((x) => x.json());
            if (r.url) setMinted({ url: r.url, phone: r.phone ?? null });
            await load();
          }}
          className="px-4 py-2 border border-trax-white/25 font-mono text-[11px] uppercase text-trax-white/80"
        >
          mint a link
        </button>

        {minted && (
          <div className="mt-3 flex gap-4 items-center flex-wrap">
            <button onClick={() => navigator.clipboard?.writeText(minted.url)}>
              <Mark className="text-trax-white/60">copy</Mark>
            </button>
            {minted.phone && (
              <a
                href={`https://wa.me/${minted.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  minted.url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mark className="text-trax-red">whatsapp</Mark>
              </a>
            )}
            <Mark className="text-trax-grey/50">single use · fourteen days</Mark>
          </div>
        )}
      </Block>
    </div>
  );
}

function Tick({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`w-4 h-4 shrink-0 border flex items-center justify-center ${
        on ? 'border-trax-white bg-trax-white' : 'border-trax-white/40'
      }`}
    >
      {on && (
        <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1.5" stroke="#0E0F11" strokeWidth="2" />
        </svg>
      )}
    </span>
  );
}

/* ── Issuing an object ───────────────────────────────────────────────────── */

function IssueArtifact({
  api,
  riderId,
  exps,
  prefixes,
  onDone,
}: {
  api: Api;
  riderId: number;
  exps: Exp[];
  prefixes: Record<string, string>;
  onDone: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    experienceId: '',
    number: '',
    tier: 'Rider',
    issuedAt: '',
    handedBy: 'Alex',
    photo: '',
  });

  const chosen = exps.find((e) => String(e.id) === form.experienceId);
  const prefix = chosen ? (prefixes[chosen.slug] ?? '') : '';
  const preview =
    prefix && chosen && form.number
      ? formatSerial(prefix, chosen.year, Number(form.number))
      : null;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2">
        <Mark className="text-trax-white/70">+ issue one</Mark>
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 border-l border-trax-white/10 pl-4">
      <select
        value={form.experienceId}
        onChange={(e) => setForm({ ...form, experienceId: e.target.value })}
        className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
      >
        <option value="">which running</option>
        {exps.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name} {e.year}
          </option>
        ))}
      </select>

      <input
        value={form.number}
        onChange={(e) => setForm({ ...form, number: e.target.value.replace(/[^0-9]/g, '') })}
        placeholder="issue number, e.g. 14"
        inputMode="numeric"
        className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
      />

      {preview && <Mark className="block text-trax-white/70">{preview}</Mark>}
      {!preview && chosen && !prefix && (
        // A running whose slug has no letters assigned cannot be stamped.
        // Guessing would mint a serial that does not match the object.
        <Mark className="block text-trax-red">
          no serial letters for {chosen.slug} — add them in lib/app/serial.ts
        </Mark>
      )}
      {!preview && (!chosen || prefix) && (
        <Mark className="block text-trax-grey/50">
          the serial is built from the running and the number
        </Mark>
      )}

      <input
        value={form.tier}
        onChange={(e) => setForm({ ...form, tier: e.target.value })}
        placeholder="tier"
        className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
      />

      <div>
        <Mark className="block mb-2 text-trax-grey/60">Issued</Mark>
        <input
          type="date"
          value={form.issuedAt}
          onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
          onClick={(e) => {
            const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
            try {
              el.showPicker?.();
            } catch {
              /* older browsers fall back to the indicator */
            }
          }}
          className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
        />
      </div>

      <input
        value={form.handedBy}
        onChange={(e) => setForm({ ...form, handedBy: e.target.value })}
        placeholder="handed over by"
        className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
      />

      <input
        value={form.photo}
        onChange={(e) => setForm({ ...form, photo: e.target.value })}
        placeholder="/assets/… one photograph"
        className="font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
      />

      {err && <Mark className="block text-trax-red">{err}</Mark>}

      <div className="flex gap-4 items-center">
        <button
          onClick={async () => {
            setErr(null);
            if (!chosen || !form.number || !form.issuedAt) {
              setErr('running, number and date are all needed');
              return;
            }
            if (!prefix) {
              setErr(`no serial letters are assigned to ${chosen.slug}`);
              return;
            }
            const res = await api('record', {
              method: 'POST',
              body: JSON.stringify({
                what: 'artifact',
                riderId,
                experienceId: chosen.id,
                prefix,
                number: Number(form.number),
                year: chosen.year,
                tier: form.tier,
                issuedAt: new Date(form.issuedAt).toISOString(),
                handedBy: form.handedBy,
                photo: form.photo,
              }),
            });
            const d = await res.json();
            if (!res.ok) {
              setErr(d.error ?? 'it did not save');
              return;
            }
            setOpen(false);
            setForm({ ...form, number: '', photo: '' });
            await onDone();
          }}
          className="trax-filled px-5 py-2.5 font-mono text-[11px] uppercase"
        >
          issue
        </button>
        <button onClick={() => setOpen(false)}>
          <Mark className="text-trax-grey/50">cancel</Mark>
        </button>
      </div>
    </div>
  );
}

/* ── A moment left undocumented ──────────────────────────────────────────── */

function AddBlank({
  api,
  riderId,
  onDone,
}: {
  api: Api;
  riderId: number;
  onDone: () => Promise<void>;
}) {
  const [when, setWhen] = useState('');

  return (
    <div className="flex gap-4 items-center mt-2 flex-wrap">
      <input
        type="date"
        value={when}
        onChange={(e) => setWhen(e.target.value)}
        onClick={(e) => {
          const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
          try {
            el.showPicker?.();
          } catch {
            /* older browsers fall back to the indicator */
          }
        }}
        className="font-mono text-sm text-trax-white border-b border-dashed border-trax-white/25 pb-1"
      />
      <button
        disabled={!when}
        onClick={async () => {
          await api('record', {
            method: 'POST',
            body: JSON.stringify({
              what: 'blank',
              riderId,
              occurredAt: new Date(when).toISOString(),
            }),
          });
          setWhen('');
          await onDone();
        }}
      >
        <Mark className={when ? 'text-trax-white/70' : 'text-trax-grey/30'}>+ add</Mark>
      </button>
    </div>
  );
}
