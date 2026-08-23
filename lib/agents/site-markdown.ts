import { experiences } from '../experiences-data';
import { calendar } from '../calendar-data';

/**
 * The markdown representation of a marketing route.
 *
 * Generated from the same data the HTML renders from, never hand-copied, so
 * the two cannot drift. A postponed running says postponed in both, and a
 * calendar entry cannot be current in one representation and stale in the other.
 *
 * Pure by design — the file-backed routes (/field-notes) pass their content in,
 * so this module has no fs dependency and can be unit-tested directly.
 */

const BASE = 'https://ridetrax.eu';

export interface MarkdownDoc {
  status: 200 | 404;
  body: string;
}

export interface FieldNoteSummary {
  slug: string;
  title: string;
  date: string;
  location: string;
  excerpt: string;
}

/** Where an agent should look next. Repeated on every 404 (audit item 1). */
export const RECOVERY = `## Where to look next

- [llms.txt](${BASE}/llms.txt) — what TRAX is, when to use it, and the machine-readable endpoints
- [Sitemap](${BASE}/sitemap.xml) — every public URL
- [Experiences](${BASE}/experiences) — the five tiers
- [Calendar](${BASE}/calendar) — the 2026 season
- [Contact](${BASE}/contact) — how to reach a human

### JSON endpoints

- \`GET ${BASE}/api/experiences\`
- \`GET ${BASE}/api/calendar\`
- \`GET ${BASE}/api/field-notes\`
`;

function notFound(pathname: string): MarkdownDoc {
  return {
    status: 404,
    body: `# 404 — Not Found

\`${pathname}\` does not exist on ridetrax.eu.

Nothing is served at this path, and no page has moved here. If you followed a
link, the link is wrong rather than temporarily broken.

${RECOVERY}`,
  };
}

function home(): MarkdownDoc {
  return {
    status: 200,
    body: `# TRAX — Terrain Leads

> A culture of intentional progression, built around terrain, presence, and
> earned stories. Romania.

TRAX is an off-road motorcycle collective based in Romania. It runs terrain-led
multi-day experiences and selects participants on readiness rather than
interest. It is not a tour operator, a travel agency, or a booking platform.

## What an agent should know first

- Experiences are **requested, never purchased**. There is no checkout, no
  pricing page, and no availability count to report.
- Admission to the collective is by mindset alignment, decided by a human.
- The five experiences form an **order**, not a menu. A rider is not "below" a
  tier they have not reached; that tier is simply later.

## Sections

- [Experiences](${BASE}/experiences) — the five tiers
- [Calendar](${BASE}/calendar) — the 2026 season
- [Manifesto](${BASE}/manifesto) — the beliefs the collective is built on
- [Field Notes](${BASE}/field-notes) — riders' own accounts
- [About](${BASE}/about) · [Contact](${BASE}/contact) · [Privacy](${BASE}/privacy)

${RECOVERY}`,
  };
}

function experienceList(): MarkdownDoc {
  const rows = experiences
    .map((e) => {
      const when = e.status === 'postponed' ? 'Postponed · to be rescheduled' : e.dates;
      return `### ${e.name}

- **When:** ${when}
- **Duration:** ${e.duration}
- **Level:** ${e.level}
- **Location:** ${e.location}
- **Status:** ${e.status}
${e.distanceKm ? `- **Distance:** ${e.distanceKm} km\n` : ''}- **URL:** ${BASE}${e.href}

${e.longDescription}`;
    })
    .join('\n\n');

  return {
    status: 200,
    body: `# TRAX Experiences

A progression system, not a menu. Five experiences, each with a role, each
earned. Access is requested from a human — there is no booking flow.

${rows}

## Machine-readable

\`GET ${BASE}/api/experiences\` returns the same data as JSON.

${RECOVERY}`,
  };
}

function experienceDetail(slug: string): MarkdownDoc | null {
  const e = experiences.find((x) => x.href === `/${slug}` || x.slug === slug);
  if (!e) return null;

  const when = e.status === 'postponed' ? 'Postponed · to be rescheduled' : e.dates;

  return {
    status: 200,
    body: `# ${e.name}

- **When:** ${when}
- **Duration:** ${e.duration}
- **Level:** ${e.level}
- **Location:** ${e.location}, ${e.country}
- **Status:** ${e.status}
${e.distanceKm ? `- **Distance:** ${e.distanceKm} km\n` : ''}
${e.longDescription}

## How to take part

Access is requested, not purchased. There is no price, no booking form and no
seat count. A request is made over WhatsApp and answered by a person.

- [All experiences](${BASE}/experiences)
- [Calendar](${BASE}/calendar)
- [Contact](${BASE}/contact)
`,
  };
}

function calendarDoc(): MarkdownDoc {
  const months = calendar
    .map((group) => {
      const events = group.events
        .map((ev) => {
          const bits = [
            ev.postponed ? '~~' + ev.date + '~~ **Postponed**' : `**${ev.date}**`,
            ev.name,
          ];
          if (ev.location) bits.push(`_${ev.location}_`);
          bits.push(`(${ev.type})`);
          if (ev.note) bits.push(`— ${ev.note}`);
          return `- ${bits.join(' · ')}`;
        })
        .join('\n');
      return `### ${group.month}\n\n${events}`;
    })
    .join('\n\n');

  return {
    status: 200,
    body: `# TRAX Calendar 2026

Every TRAX experience, plus the Romanian off-road events the collective tracks.

**Event types**

- \`trax\` — designed and led by TRAX
- \`collective\` — organised by others, attended by TRAX riders as a group
- \`radar\` — worth tracking, not officially attended

${months}

## Machine-readable

\`GET ${BASE}/api/calendar\` — filterable with \`?type=trax|collective|radar\`
and \`?from=YYYY-MM-DD\`.

${RECOVERY}`,
  };
}

function fieldNoteIndex(notes: FieldNoteSummary[]): MarkdownDoc {
  const list = notes.length
    ? notes
        .map(
          (n) =>
            `- [${n.title}](${BASE}/field-notes/${n.slug}) — ${n.date}${n.location ? ` · ${n.location}` : ''}\n  ${n.excerpt}`
        )
        .join('\n')
    : '_No published field notes yet._';

  return {
    status: 200,
    body: `# Field Notes

Writing from TRAX riders. Accounts of rides, terrain, and what stays after the
experience. These are personal reflections, not marketing copy.

${list}

## Machine-readable

\`GET ${BASE}/api/field-notes\`

${RECOVERY}`,
  };
}

/** Routes whose markdown is written rather than generated from a data file. */
const STATIC_DOCS: Record<string, () => MarkdownDoc> = {
  '/manifesto': () => ({
    status: 200,
    body: `# Manifesto

TRAX exists to document, enable and protect what happens behind the finish
line, where success is no longer loud and meaning is no longer obvious.

## What TRAX believes

- The real race starts after the finish line.
- Suffering without reflection is wasted.
- Presence is more valuable than documentation.
- Access should be filtered by mindset, not popularity.
- Artifacts must be earned, never sold.

## What TRAX refuses

TRAX refuses to chase scale, to perform urgency, to sell meaning, to decorate
pain, and to be everywhere. Beside each refusal sits a commitment: to go deep
with few, to keep a steady heartbeat, to issue meaning only to those who earned
it, to document aftermath honestly, and to be reliable in the one place it
chooses to be.

Full text: ${BASE}/manifesto

${RECOVERY}`,
  }),

  '/about': () => ({
    status: 200,
    body: `# About TRAX

TRAX is an off-road motorcycle collective founded in Romania in 2025. It designs
and leads multi-day, terrain-led experiences across the country — from the
limestone plateaus of Dobrogea to the high ridges of the Carpathians.

It is **not** a travel agency, a tour operator, a training school or a content
business. Nothing on the site is for sale: there is no checkout, no pricing page
and no seat count, because participation is requested from a person and granted
by a person.

## Divisions

- **TRAX ADV** — curated multi-day off-road experiences.
- **TRAX MX** — competition-oriented riding and skill development, for riders
  who enjoy the competitive side without being full-time athletes.

## How participation works

Entry is by mindset alignment rather than payment or popularity. Standing is
earned by participation and recorded privately. Rank is never purchasable.

The five experiences are an order, not a menu. A rider who has not reached a
tier is not below it — that tier is simply later.

Objects issued at the end of an experience are earned, dated and serialised.
They are never priced and never sold. Anyone can verify one at ${BASE}/app/m,
which returns the object and never a person's name.

## Where

Romania. The collective is based in Bucharest; routes run east to the Danube
delta and Dobrogea, north and west into the Carpathians, and along the ACT
Romania route from Maramureș to the Transfăgărășan.

${RECOVERY}`,
  }),

  '/contact': () => ({
    status: 200,
    body: `# Contact TRAX

Requests are read and answered by a person. There is no booking system and no
automated reply.

## WhatsApp — the primary channel

**+40 721 766 484**

Access requests, questions about terrain or bike suitability, and anything about
a running are all handled here. Say which experience you are asking about and
what you currently ride.

## Elsewhere

- Instagram — https://www.instagram.com/ridetrax
- YouTube — https://www.youtube.com/@ridetrax
- Facebook — https://www.facebook.com/share/1DeGDZW2sc/

None is monitored as closely as WhatsApp.

## Where TRAX is

Bucharest, Romania. Experiences run across the country. There is no shop,
showroom or office open to visitors.

## Two things that do not change

- Experiences are not sold. There is no price to quote and no deposit to take.
- Spots are not first-come. A running is filled by readiness for that terrain,
  judged by a person after a conversation.

${RECOVERY}`,
  }),

  '/privacy': () => ({
    status: 200,
    body: `# Privacy

TRAX operates from Romania and this site is subject to the GDPR.

## Browsing this website

Page views are recorded with Aptabase — privacy-friendly, cookie-free, and no
cross-site profile. Recorded: which page was opened, an anonymous per-session
identifier, a coarse device class, and the referring site. There are no
advertising trackers, remarketing pixels or social trackers on this site.

Errors are reported to Sentry so faults can be fixed. Hosting is Vercel, which
keeps short-lived server access logs containing IP addresses, as any web server
does; those are not used for analytics.

## The rider app (/app)

Holds a rider's name, phone number, standing, which experiences they took part
in and completed, objects issued to them, and the two sentences they choose to
write afterwards.

No accounts and no passwords. A device is bound by a one-time link sent over
WhatsApp, and the session cookie is scoped to \`/app\` so it is never sent with a
request for the rest of the site.

A rider's written lines are private by default, published only where that rider
explicitly allowed it, and then only under a first name. Nothing a rider writes
is shown to another rider. The Threshold self-assessment is answered entirely on
the device — nothing typed into it reaches a server.

## Messages

App links are delivered over WhatsApp via Twilio and contain only the rider's own
single-use link. No marketing messages, no newsletters, no scheduled broadcasts,
and no push notification capability anywhere in the product.

## Public provenance

The serial lookup at ${BASE}/app/m requires no identity. It returns tier, year,
issue date and status, and never a name or any other personal data.

## Your rights

Under the GDPR you may request a copy of your personal data, its correction, or
its erasure. A rider using the app can erase their own record directly from the
bottom of their record. For anything else, message the WhatsApp number on
${BASE}/contact. Requests are handled by a person.

Nothing held by TRAX is sold, rented or shared with advertisers.

${RECOVERY}`,
  }),
};

/**
 * Resolve a marketing path to markdown.
 *
 * Returns a 404 document rather than null for unknown paths, so the caller
 * always has a body to send and an agent always gets somewhere to go next.
 */
export function markdownFor(pathname: string, notes: FieldNoteSummary[] = []): MarkdownDoc {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (path === '' || path === '/') return home();
  if (path === '/experiences') return experienceList();
  if (path === '/calendar') return calendarDoc();
  if (path === '/field-notes') return fieldNoteIndex(notes);

  const staticDoc = STATIC_DOCS[path];
  if (staticDoc) return staticDoc();

  const slug = path.slice(1);
  if (!slug.includes('/')) {
    const detail = experienceDetail(slug);
    if (detail) return detail;
  }

  return notFound(pathname);
}

/** Exposed so the route handler can answer /field-notes/<slug> with real prose. */
export function fieldNoteDoc(note: {
  title: string;
  date: string;
  location: string;
  excerpt: string;
  content: string;
  slug: string;
}): MarkdownDoc {
  return {
    status: 200,
    body: `# ${note.title}

- **Date:** ${note.date}
${note.location ? `- **Location:** ${note.location}\n` : ''}- **URL:** ${BASE}/field-notes/${note.slug}

${note.excerpt ? `> ${note.excerpt}\n\n` : ''}${note.content.trim()}

---

A TRAX Field Note. Riders' own words, published with their consent.
[All field notes](${BASE}/field-notes)
`,
  };
}

export { notFound as notFoundDoc };
