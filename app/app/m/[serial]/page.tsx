import { eq } from 'drizzle-orm';
import { Mark, Rule, Block } from '@/components/app/primitives';
import { db } from '@/lib/app/db';
import { artifacts, experiences } from '@/lib/app/db/schema';
import { normalizeSerial } from '@/lib/app/serial';
import { LookupClient } from '../LookupClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * One object, looked up by a stranger (BRD LG-09).
 *
 * Server-rendered, so it works with JavaScript off and survives being pasted
 * into a message. It reads no cookie and takes no session: the answer is
 * identical whether the person asking is the owner, a buyer being offered one
 * second-hand, or nobody in particular.
 *
 * The five public columns are named in the select. Never a name, never a rider
 * id, never who handed it over.
 */
export default async function ProvenancePage({ params }: { params: { serial: string } }) {
  const serial = normalizeSerial(decodeURIComponent(params.serial));

  const row = serial
    ? (
        await db
          .select({
            serial: artifacts.serial,
            tier: artifacts.tier,
            year: artifacts.year,
            issuedAt: artifacts.issuedAt,
            status: artifacts.status,
            experience: experiences.name,
          })
          .from(artifacts)
          .leftJoin(experiences, eq(artifacts.experienceId, experiences.id))
          .where(eq(artifacts.serial, serial))
          .limit(1)
      )[0]
    : undefined;

  return (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[36rem]">
        <Mark>Provenance</Mark>

        {row ? (
          <>
            <Block space="lg">
              {/* The serial at full width, in mono. It is the object's name. */}
              <p className="font-mono text-trax-white text-2xl md:text-4xl uppercase break-all">
                {row.serial}
              </p>
            </Block>

            <Block space="lg">
              <Rule />
              <Line label="Tier" value={row.tier} />
              <Line label="Year" value={String(row.year)} />
              {row.experience && <Line label="Experience" value={row.experience} />}
              <Line
                label="Issued"
                value={row.issuedAt.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              />
              <Line label="Status" value={row.status === 'held' ? 'Held' : 'Reported lost'} />
            </Block>

            <Block space="lg">
              <Mark className="text-trax-white/70">Issued never sold</Mark>
            </Block>
          </>
        ) : (
          <Block space="lg">
            <p className="font-body text-trax-white/70 text-base leading-[1.7]">
              No object carries that serial.
            </p>
          </Block>
        )}

        <Block space="xl">
          <LookupClient initial={row ? '' : (serial ?? '')} />
        </Block>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-6 py-4">
        <Mark className="text-trax-grey/60">{label}</Mark>
        <Mark className="text-trax-white text-right">{value}</Mark>
      </div>
      <Rule />
    </>
  );
}
