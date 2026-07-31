'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mark, Rule, Block } from '@/components/app/primitives';

/**
 * The founder console. One operator, one screen.
 *
 * Deliberately plain. This is the back of the house, so it reports state and
 * gets out of the way. It holds no rider-facing copy and never publishes
 * anything on its own.
 *
 * The key lives in sessionStorage, so it is gone when the tab closes and it
 * never sits in the URL where it could be shared or logged.
 */

const KEY_STORE = 'trax-admin-key';

type Rider = { id: number; name: string; phone: string | null; rung: string };
type Exp = {
  id: number;
  slug: string;
  name: string;
  year: number;
  finishedAt: string;
  lines: number;
};
type Link = { rider: string; phone: string | null; url: string };
type Line = {
  id: number;
  rider: string;
  took: string;
  gave: string;
  mayPublish: boolean;
  selected: boolean;
  submittedAt: string;
};

const DEFAULT_MESSAGE =
  'Aftermath is open. Two questions, seven days, nobody else sees your answers unless you say so.';

export function AdminClient() {
  const [key, setKey] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const k = sessionStorage.getItem(KEY_STORE);
      if (k) setKey(k);
    } catch {
      /* private mode */
    }
  }, []);

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(`/api/app/admin/${path}`, {
        ...init,
        headers: {
          'content-type': 'application/json',
          'x-admin-key': key ?? '',
          ...(init?.headers ?? {}),
        },
      });
      if (res.status === 404) throw new Error('unauthorised');
      return res;
    },
    [key]
  );

  if (!key) {
    return (
      <Shell>
        <Mark>Console</Mark>
        <Block space="md">
          <p className="font-sans font-medium text-trax-white text-xl">Key.</p>
        </Block>
        <Block space="sm">
          <input
            type="password"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !typed.trim()) return;
              sessionStorage.setItem(KEY_STORE, typed.trim());
              setKey(typed.trim());
            }}
            className="trax-field font-mono text-base text-trax-white w-full border-b border-dashed border-trax-white/25 pb-2"
            placeholder="paste it"
            autoFocus
          />
        </Block>
        {err && (
          <Block space="sm">
            <Mark className="text-trax-red">{err}</Mark>
          </Block>
        )}
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-baseline justify-between">
        <Mark>Console</Mark>
        <button
          onClick={() => {
            sessionStorage.removeItem(KEY_STORE);
            setKey(null);
            setTyped('');
          }}
        >
          <Mark className="text-trax-grey/50">forget key</Mark>
        </button>
      </div>
      <Experiences api={api} onError={setErr} />
      <Roster api={api} onError={setErr} />
      {err && (
        <Block space="md">
          <Mark className="text-trax-red">{err}</Mark>
        </Block>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] px-6 md:px-12 py-16">
      <div className="mx-auto w-full max-w-[52rem]">{children}</div>
    </div>
  );
}

type Api = (path: string, init?: RequestInit) => Promise<Response>;

/* ── Experiences, links, and what came back ─────────────────────────────── */

function Experiences({ api, onError }: { api: Api; onError: (e: string) => void }) {
  const [list, setList] = useState<Exp[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ slug: '', name: '', year: '2026', finishedAt: '' });

  const load = useCallback(async () => {
    try {
      const r = await api('experiences');
      const d = await r.json();
      setList(d.experiences ?? []);
    } catch (e) {
      onError(String((e as Error).message));
    }
  }, [api, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function select(slug: string) {
    if (open === slug) {
      setOpen(null);
      return;
    }
    setOpen(slug);
    setLinks([]);
    setLines([]);
    const [l, s] = await Promise.all([
      api(`aftermath?slug=${slug}`).then((r) => r.json()),
      api('compile', { method: 'POST', body: JSON.stringify({ slug }) }).then((r) => r.json()),
    ]);
    setLinks(l.links ?? []);
    setLines(s.rows ?? []);
  }

  async function toggle(id: number, selected: boolean) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, selected } : l)));
    await api('aftermath', { method: 'PATCH', body: JSON.stringify({ id, selected }) });
  }

  return (
    <>
      <Block space="lg">
        <div className="flex items-baseline justify-between">
          <Mark>Runnings</Mark>
          <button onClick={() => setAdding((v) => !v)}>
            <Mark className="text-trax-white/70">{adding ? 'cancel' : '+ add'}</Mark>
          </button>
        </div>
      </Block>

      {adding && (
        <Block space="sm" className="space-y-3 border-l border-trax-white/15 pl-4">
          {(['slug', 'name', 'year'] as const).map((f) => (
            <input
              key={f}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              placeholder={f === 'slug' ? 'out-there' : f}
              className="trax-field font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
            />
          ))}
          <div>
            <Mark className="block mb-2 text-trax-grey/60">Finished</Mark>
            <input
              type="datetime-local"
              value={form.finishedAt}
              onChange={(e) => setForm({ ...form, finishedAt: e.target.value })}
              // Tapping anywhere in the field opens the calendar, rather than
              // only the small indicator. Matters most on a phone.
              onClick={(e) => {
                const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                try {
                  el.showPicker?.();
                } catch {
                  /* older browsers fall back to the indicator */
                }
              }}
              className="trax-field font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-1"
            />
          </div>
          <Mark className="block text-trax-grey/60">
            when the riders got home. the window opens 24h later and dies on day seven
          </Mark>
          {form.finishedAt && (
            <Mark className="block text-trax-white/70">
              {(() => {
                const f = new Date(form.finishedAt);
                if (Number.isNaN(f.getTime())) return null;
                const d = (n: number) => new Date(f.getTime() + n * 3600e3).toLocaleString();
                return `opens ${d(24)} · closes ${d(24 * 7)}`;
              })()}
            </Mark>
          )}
          <button
            onClick={async () => {
              await api('aftermath', {
                method: 'POST',
                body: JSON.stringify({
                  slug: form.slug.trim(),
                  name: form.name.trim(),
                  year: Number(form.year),
                  finishedAt: new Date(form.finishedAt).toISOString(),
                }),
              });
              setAdding(false);
              setForm({ slug: '', name: '', year: '2026', finishedAt: '' });
              void load();
            }}
            className="trax-filled px-5 py-2.5 font-mono text-[11px] uppercase"
          >
            save
          </button>
        </Block>
      )}

      <Block space="sm">
        <Rule />
        {list.length === 0 && (
          <div className="py-5">
            <Mark className="text-trax-grey/50">none yet</Mark>
          </div>
        )}
        {list.map((e) => {
          const finished = new Date(e.finishedAt);
          const opens = new Date(finished.getTime() + 24 * 3600e3);
          const closes = new Date(finished.getTime() + 7 * 24 * 3600e3);
          const now = Date.now();
          const state =
            now < opens.getTime() ? 'opens ' + opens.toLocaleDateString()
            : now > closes.getTime() ? 'closed'
            : 'open, until ' + closes.toLocaleDateString();
          return (
            <div key={e.id}>
              <button onClick={() => void select(e.slug)} className="w-full text-left py-4">
                <span className="font-sans text-trax-white text-lg">
                  {e.name} <span className="text-trax-grey">{e.year}</span>
                </span>
                <span className="block mt-1">
                  <Mark className="text-trax-grey/70">
                    {state} · {e.lines} {e.lines === 1 ? 'line' : 'lines'} in
                  </Mark>
                </span>
              </button>

              {open === e.slug && (
                <div className="pb-8 pl-4 border-l border-trax-white/15">
                  <Mark className="block mb-3">Send</Mark>
                  <textarea
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    rows={2}
                    className="trax-field font-body text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-2 mb-4"
                    aria-label="Message"
                  />
                  {links.length === 0 && (
                    <Mark className="text-trax-grey/50">no riders on the roster</Mark>
                  )}
                  <div className="space-y-2">
                    {links.map((l) => {
                      const text = `${message}\n\n${l.url}`;
                      const wa = l.phone
                        ? `https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
                        : null;
                      return (
                        <div key={l.rider} className="flex items-center justify-between gap-4 py-1">
                          <span className="font-body text-sm text-trax-white/85">{l.rider}</span>
                          <span className="flex gap-4 shrink-0">
                            <button onClick={() => navigator.clipboard?.writeText(text)}>
                              <Mark className="text-trax-white/60">copy</Mark>
                            </button>
                            {wa && (
                              <a href={wa} target="_blank" rel="noopener noreferrer">
                                <Mark className="text-trax-red">whatsapp</Mark>
                              </a>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {lines.length > 0 && (
                    <>
                      <Block space="md">
                        <Mark>What came back</Mark>
                      </Block>
                      <div className="space-y-5 mt-3">
                        {lines.map((l) => (
                          <div key={l.id} className="border-l border-trax-white/10 pl-4">
                            <Mark className="block text-trax-white/70">
                              {l.rider}
                              {!l.mayPublish && (
                                <span className="text-trax-red"> · private</span>
                              )}
                            </Mark>
                            {l.took && (
                              <p className="font-body text-sm text-trax-white/85 mt-2">{l.took}</p>
                            )}
                            {l.gave && (
                              <p className="font-body text-sm text-trax-white/85 mt-1">{l.gave}</p>
                            )}
                            {l.mayPublish && (
                              <button
                                onClick={() => void toggle(l.id, !l.selected)}
                                className="mt-2"
                                aria-pressed={l.selected}
                              >
                                <Mark
                                  className={l.selected ? 'text-trax-white' : 'text-trax-grey/50'}
                                >
                                  {l.selected ? '— using this' : 'use this'}
                                </Mark>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Block space="md">
                        <a
                          href={`/api/app/admin/compile?slug=${e.slug}&key=${encodeURIComponent(
                            sessionStorage.getItem(KEY_STORE) ?? ''
                          )}`}
                          className="trax-filled inline-block px-5 py-2.5 font-mono text-[11px] uppercase"
                        >
                          download the draft
                        </a>
                      </Block>
                    </>
                  )}
                </div>
              )}
              <Rule />
            </div>
          );
        })}
      </Block>
    </>
  );
}

/* ── Roster ─────────────────────────────────────────────────────────────── */

function Roster({ api, onError }: { api: Api; onError: (e: string) => void }) {
  const [list, setList] = useState<Rider[]>([]);
  const [bulk, setBulk] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api('riders');
      const d = await r.json();
      setList(d.riders ?? []);
    } catch (e) {
      onError(String((e as Error).message));
    }
  }, [api, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    const riders = bulk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [name, phone] = l.split(',').map((s) => s?.trim());
        return { name, phone: phone || undefined };
      })
      .filter((r) => r.name);
    if (riders.length === 0) return;
    await api('riders', { method: 'POST', body: JSON.stringify({ riders }) });
    setBulk('');
    setAdding(false);
    void load();
  }

  return (
    <>
      <Block space="xl">
        <div className="flex items-baseline justify-between">
          <Mark>Roster · {list.length}</Mark>
          <button onClick={() => setAdding((v) => !v)}>
            <Mark className="text-trax-white/70">{adding ? 'cancel' : '+ add'}</Mark>
          </button>
        </div>
      </Block>

      {adding && (
        <Block space="sm" className="border-l border-trax-white/15 pl-4">
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={5}
            placeholder={'one per line\nAndrei Marin, +40721000000'}
            className="trax-field font-mono text-sm text-trax-white w-full border-b border-dashed border-trax-white/25 pb-2"
          />
          <Mark className="block mt-2 text-trax-grey/60">
            name, then phone. phone is optional but without it there is no whatsapp link
          </Mark>
          <button
            onClick={() => void save()}
            className="trax-filled mt-4 px-5 py-2.5 font-mono text-[11px] uppercase"
          >
            add
          </button>
        </Block>
      )}

      <Block space="sm">
        <Rule />
        {list.map((r) => (
          <div key={r.id}>
            <div className="flex items-center justify-between py-3">
              <span className="font-body text-trax-white/85">
                {r.name}{' '}
                <span className="font-mono text-[11px] uppercase text-trax-grey/60">{r.rung}</span>
              </span>
              <button
                onClick={async () => {
                  await api(`riders?id=${r.id}`, { method: 'DELETE' });
                  void load();
                }}
              >
                <Mark className="text-trax-grey/40">remove</Mark>
              </button>
            </div>
            <Rule />
          </div>
        ))}
      </Block>
    </>
  );
}
