import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { Mark, Rule, Block } from '@/components/app/primitives';
import { db } from '@/lib/app/db';
import { artifacts, experiences } from '@/lib/app/db/schema';
import { currentRiderId } from '@/lib/app/session';
import { normalizeSerial } from '@/lib/app/serial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The Artifact page (BRD LG-08).
 *
 * One photograph, the serial at full width in mono, issue date, tier, and who
 * handed it over. No share, no export, no wallet pass — an object whose whole
 * claim is that it was earned does not get a button for broadcasting it.
 *
 * The owner's own view. Anyone else asking about this serial gets the public
 * provenance page, which never returns a name. The query is filtered on rider
 * id rather than checked afterwards, so somebody else's serial reads as a
 * serial that does not exist here.
 */
export default async function ArtifactPage({ params }: { params: { serial: string } }) {
  const riderId = await currentRiderId();
  if (!riderId) redirect('/app/m');

  const serial = normalizeSerial(decodeURIComponent(params.serial));
  if (!serial) redirect('/app/m');

  const [row] = await db
    .select({
      serial: artifacts.serial,
      tier: artifacts.tier,
      year: artifacts.year,
      issuedAt: artifacts.issuedAt,
      status: artifacts.status,
      handedBy: artifacts.handedBy,
      photo: artifacts.photo,
      experience: experiences.name,
    })
    .from(artifacts)
    .leftJoin(experiences, eq(artifacts.experienceId, experiences.id))
    .where(and(eq(artifacts.serial, serial), eq(artifacts.riderId, riderId)))
    .limit(1);

  if (!row) redirect(`/app/m/${serial}`);

  return (
    <div className="min-h-[100svh] px-6 md:px-12 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[42rem]">
        <a href="/app/ledger">
          <Mark className="text-trax-grey/50">The Record</Mark>
        </a>

        {row.photo && (
          <Block space="lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.photo}
              alt=""
              className="trax-image w-full h-auto"
              loading="lazy"
              decoding="async"
            />
          </Block>
        )}

        <Block space="lg">
          <p className="font-mono text-trax-white text-2xl md:text-4xl uppercase break-all">
            {row.serial}
          </p>
        </Block>

        <Block space="lg">
          <Rule />
          <Line label="Tier" value={row.tier} />
          {row.experience && <Line label="Experience" value={row.experience} />}
          <Line
            label="Issued"
            value={row.issuedAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          />
          {row.handedBy && <Line label="Handed over by" value={row.handedBy} />}
          <Line label="Status" value={row.status === 'held' ? 'Held' : 'Reported lost'} />
        </Block>

        <Block space="lg">
          <Mark className="text-trax-grey/50">Issued never sold</Mark>
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
