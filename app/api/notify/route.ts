import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notify
 *
 * Called post-deploy (e.g. from a GitHub Action or Vercel deploy webhook)
 * to send a notification to a configured Discord webhook.
 *
 * Required env vars:
 *   NOTIFY_SECRET         — shared secret, must match the `x-notify-secret` header
 *   DISCORD_WEBHOOK_URL   — full Discord webhook URL
 *
 * Vercel deploy webhook payload shape (subset used here):
 *   { type, payload: { url, name, meta: { githubCommitMessage, githubCommitAuthorName } } }
 */

interface VercelDeployPayload {
  type?: string;
  payload?: {
    url?: string;
    name?: string;
    meta?: {
      githubCommitMessage?: string;
      githubCommitAuthorName?: string;
    };
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.NOTIFY_SECRET;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!secret || !webhookUrl) {
    return NextResponse.json({ error: 'Notifications not configured' }, { status: 503 });
  }

  const incomingSecret = req.headers.get('x-notify-secret');
  if (incomingSecret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: VercelDeployPayload = {};
  try {
    body = await req.json();
  } catch {
    // body is optional — a bare POST still triggers a generic notification
  }

  const deployUrl = body.payload?.url ? `https://${body.payload.url}` : 'https://ridetrax.eu';
  const commitMsg = body.payload?.meta?.githubCommitMessage ?? 'No commit message';
  const author = body.payload?.meta?.githubCommitAuthorName ?? 'unknown';
  const projectName = body.payload?.name ?? 'trax-nextjs';

  const discordPayload = {
    embeds: [
      {
        title: `New deploy — ${projectName}`,
        url: deployUrl,
        color: 0xcc2222,
        fields: [
          { name: 'Commit', value: commitMsg, inline: false },
          { name: 'Author', value: author, inline: true },
          { name: 'URL', value: deployUrl, inline: true },
        ],
        footer: { text: 'TRAX deploy notification' },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const discordRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload),
  });

  if (!discordRes.ok) {
    return NextResponse.json({ error: 'Discord webhook failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
