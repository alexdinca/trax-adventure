import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/app/db';
import { experiences, participations, riders, windowFor } from '@/lib/app/db/schema';
import { isFounder, mintAftermathToken } from '@/lib/app/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Founder only. Send each rider on a running their own Aftermath link.
 *
 * Doctrine (BRD NT-05 to NT-10): delivery is automated, authorship is not.
 * The message body is an approved WhatsApp template written once by the
 * founder; what this does is put the right unique link in the right person's
 * hand. Sending rider A's token to rider B would be a privacy incident, so the
 * link is minted per recipient inside the same loop that addresses them.
 *
 * The template must be WhatsApp Utility category, never Marketing.
 */

function client() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

/** E.164, digits only, as Twilio wants it. */
function waAddress(phone: string): string {
  return `whatsapp:+${phone.replace(/[^0-9]/g, '')}`;
}

/**
 * Diagnostic. Reports what is configured and what the template expects, so
 * the variable mapping can be checked before anything is sent to a human.
 */
export async function GET(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const config = {
    accountSid: Boolean(process.env.TWILIO_ACCOUNT_SID),
    authToken: Boolean(process.env.TWILIO_AUTH_TOKEN),
    from: process.env.TWILIO_WHATSAPP_FROM ?? null,
    contentSid: process.env.AFTERMATH_CONTENT_SID ?? null,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID ?? null,
  };

  const c = client();
  if (!c || !config.contentSid) {
    return NextResponse.json({ config, template: null });
  }

  try {
    const content = await c.content.v1.contents(config.contentSid).fetch();
    return NextResponse.json({
      config,
      template: {
        friendlyName: content.friendlyName,
        language: content.language,
        variables: content.variables,
        types: Object.keys(content.types ?? {}),
        body:
          (content.types as Record<string, { body?: string }> | undefined)?.[
            'twilio/text'
          ]?.body ?? null,
      },
    });
  } catch (err) {
    const e = err as { code?: number; message?: string; status?: number };
    return NextResponse.json({
      config,
      template: null,
      error: { code: e.code, message: e.message, status: e.status },
    });
  }
}

interface Result {
  rider: string;
  phone: string | null;
  status: 'sent' | 'skipped' | 'failed';
  sid?: string;
  reason?: string;
  code?: number;
}

export async function POST(req: Request) {
  if (!isFounder(req)) return NextResponse.json({ error: 'no' }, { status: 404 });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    dryRun?: boolean;
  } | null;
  if (!body?.slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const c = client();
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const contentSid = process.env.AFTERMATH_CONTENT_SID;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!c || !from || !contentSid) {
    return NextResponse.json(
      { error: 'twilio is not configured', need: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_FROM', 'AFTERMATH_CONTENT_SID'] },
      { status: 500 }
    );
  }

  const [experience] = await db
    .select()
    .from(experiences)
    .where(eq(experiences.slug, body.slug))
    .limit(1);
  if (!experience) return NextResponse.json({ error: 'no such running' }, { status: 404 });

  const w = windowFor(experience);

  const cast = await db
    .select({ id: riders.id, name: riders.name, phone: riders.phone })
    .from(participations)
    .innerJoin(riders, eq(participations.riderId, riders.id))
    .where(eq(participations.experienceId, experience.id));

  if (cast.length === 0) {
    return NextResponse.json({ error: 'nobody is marked as having ridden this one' }, { status: 400 });
  }

  const results: Result[] = [];

  for (const rider of cast) {
    if (!rider.phone) {
      results.push({ rider: rider.name, phone: null, status: 'skipped', reason: 'no phone' });
      continue;
    }

    // Minted inside the loop, against this rider, so a link can never be
    // addressed to the wrong person.
    const url = `https://ridetrax.eu/app/aftermath/${await mintAftermathToken({
      riderId: rider.id,
      experienceId: experience.id,
    })}`;

    if (body.dryRun) {
      results.push({ rider: rider.name, phone: rider.phone, status: 'sent', sid: 'dry-run' });
      continue;
    }

    try {
      const payload: Record<string, unknown> = {
        to: waAddress(rider.phone),
        contentSid,
        contentVariables: JSON.stringify({
          '1': rider.name.trim().split(/\s+/)[0],
          '2': experience.name,
          '3': url,
        }),
      };
      if (messagingServiceSid) payload.messagingServiceSid = messagingServiceSid;
      else payload.from = from.startsWith('whatsapp:') ? from : waAddress(from);

      const msg = await c.messages.create(payload as never);
      results.push({ rider: rider.name, phone: rider.phone, status: 'sent', sid: msg.sid });
    } catch (err) {
      const e = err as { code?: number; message?: string; status?: number };
      results.push({
        rider: rider.name,
        phone: rider.phone,
        status: 'failed',
        code: e.code,
        // 63016: freeform outside the 24h window, i.e. the template was not used
        // 21656: the content template is invalid or not approved
        // 63028: too many recipients / rate limited
        reason: e.message,
      });
    }

    // Gentle on Twilio, and on WhatsApp's per-number pacing.
    await new Promise((r) => setTimeout(r, 350));
  }

  const sent = results.filter((r) => r.status === 'sent').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return NextResponse.json({
    ok: failed === 0,
    experience: experience.name,
    windowState: w.state,
    dryRun: Boolean(body.dryRun),
    sent,
    failed,
    skipped: results.filter((r) => r.status === 'skipped').length,
    results,
  });
}
