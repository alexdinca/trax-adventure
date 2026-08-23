import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Privacy · TRAX',
  description:
    'What TRAX collects, why, and how to have it deleted. Privacy-friendly analytics, no advertising trackers, no data sold. Romania, GDPR.',
  alternates: { canonical: 'https://ridetrax.eu/privacy' },
  openGraph: {
    type: 'website',
    title: 'Privacy · TRAX',
    description: 'What TRAX collects, why, and how to have it deleted. GDPR, Romania.',
    url: 'https://ridetrax.eu/privacy',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-trax-grey/20 pt-12 mt-12">
      <SubHeadline>{title}</SubHeadline>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24">
      <Container>
        <Spacer size="lg" />
        <MonoLabel className="mb-6 block">Privacy</MonoLabel>
        <Headline className="mb-8 max-w-3xl">
          Little is collected. <span className="text-trax-red">None of it is sold.</span>
        </Headline>

        <Divider />

        <Body className="max-w-3xl">
          TRAX operates from Romania and this site is subject to the GDPR. What follows describes
          what is actually collected by this website and by the rider-facing app at{' '}
          <span className="font-mono text-trax-white">/app</span>, why it is held, and how to have
          it removed.
        </Body>

        <div className="max-w-3xl">
          <Section title="Browsing this website">
            <Body className="mb-6">
              Page views are recorded with Aptabase, a privacy-friendly analytics service that does
              not use cookies and does not build a profile of a visitor across sites. What is
              recorded is which page was opened, an anonymous per-session identifier, a coarse
              device class and the referring site. No advertising trackers, remarketing pixels or
              social media trackers run on this site.
            </Body>
            <Body className="mb-6">
              Errors are reported to Sentry so that faults can be found and fixed. An error report
              can include the page being viewed and technical details of the failure.
            </Body>
            <Body>
              The site is hosted on Vercel, which keeps short-lived server access logs containing
              IP addresses, as any web server does. TRAX does not use these logs for analytics.
            </Body>
          </Section>

          <Section title="The rider app">
            <Body className="mb-6">
              The app at <span className="font-mono text-trax-white">/app</span> is for riders
              admitted to the collective. It holds a rider&apos;s name, their phone number, their
              standing, which experiences they took part in and completed, any objects issued to
              them, and the two sentences they choose to write after an experience.
            </Body>
            <Body className="mb-6">
              There are no accounts and no passwords. A rider&apos;s device is bound by a one-time
              link sent over WhatsApp, and the session is held in a cookie scoped to{' '}
              <span className="font-mono text-trax-white">/app</span> so that it is never sent with
              a request for the rest of this website.
            </Body>
            <Body className="mb-6">
              A rider&apos;s own written lines are private by default. They are published only where
              that rider has explicitly ticked the box allowing it, and then only under a first
              name. Nothing a rider writes is shown to another rider.
            </Body>
            <Body>
              The Threshold self-assessment is answered entirely on the device. Nothing typed into
              it reaches a server, and no analytics event is recorded anywhere inside it.
            </Body>
          </Section>

          <Section title="Messages">
            <Body>
              Links to the app are delivered over WhatsApp using Twilio. The message contains the
              rider&apos;s own single-use link and nothing else. TRAX does not send marketing
              messages, newsletters or scheduled broadcasts, and there is no push notification
              capability anywhere in the product.
            </Body>
          </Section>

          <Section title="Public provenance">
            <Body>
              The serial lookup at{' '}
              <Link href="/app/m" className="text-trax-red hover:text-trax-white transition-colors">
                /app/m
              </Link>{' '}
              is public and requires no identity. It returns the tier, year, issue date and status
              of an object, and never returns a name or any other personal data.
            </Body>
          </Section>

          <Section title="Your rights, and how to use them">
            <Body className="mb-6">
              Under the GDPR you may ask for a copy of the personal data held about you, ask for it
              to be corrected, or ask for it to be erased. A rider using the app can erase their own
              record directly: the option sits at the bottom of their record and removes their rows
              from the database and their data from the device.
            </Body>
            <Body className="mb-6">
              For anything else, message the WhatsApp number on the{' '}
              <Link href="/contact" className="text-trax-red hover:text-trax-white transition-colors">
                contact
              </Link>{' '}
              page and say what you want done. Requests are handled by a person.
            </Body>
            <Body>
              Data is kept for as long as it is useful to the collective&apos;s own record and no
              longer. Nothing held by TRAX is sold, rented, or shared with advertisers.
            </Body>
          </Section>
        </div>
      </Container>
    </div>
  );
}
