import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact TRAX · Reach a person',
  description:
    'How to reach TRAX: WhatsApp for access requests and questions, plus Instagram, YouTube and Facebook. Requests are answered by a person, not a booking system.',
  alternates: { canonical: 'https://ridetrax.eu/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact TRAX · Reach a person',
    description: 'WhatsApp, Instagram, YouTube and Facebook. Answered by a person, not a system.',
    url: 'https://ridetrax.eu/contact',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24">
      <Container>
        <Spacer size="lg" />
        <MonoLabel className="mb-6 block">Contact</MonoLabel>
        <Headline className="mb-8 max-w-3xl">
          Answered by a person, <span className="text-trax-red">not a system.</span>
        </Headline>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <SubHeadline>WhatsApp</SubHeadline>
            <Body className="mb-6">
              WhatsApp is the primary channel and the fastest way to reach TRAX. Access requests,
              questions about terrain or bike suitability, and anything about a running are all
              handled there.
            </Body>
            <Body className="mb-6">
              <span className="font-mono text-trax-white">+40 721 766 484</span>
            </Body>
            <Body className="mb-8">
              There is no booking system behind this number and no automated reply. A request is
              read and answered by a person, usually within a day or two. Please say which
              experience you are asking about and what you currently ride.
            </Body>
            <WhatsAppCTA
              label="Message TRAX"
              source="contact_page"
              eventName="contact_whatsapp_click"
              href={whatsappLink('Salut,\nAm o întrebare despre TRAX.')}
            />
          </div>

          <div>
            <SubHeadline>Elsewhere</SubHeadline>
            <Body className="mb-6">
              The channels below carry the same information. None of them is monitored as closely
              as WhatsApp, so anything time-sensitive should go there.
            </Body>
            <ul className="space-y-4">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/ridetrax' },
                { label: 'YouTube', href: 'https://www.youtube.com/@ridetrax' },
                { label: 'Facebook', href: 'https://www.facebook.com/share/1DeGDZW2sc/' },
              ].map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm uppercase tracking-widest text-trax-red hover:text-trax-white transition-colors border-b border-trax-red/40 hover:border-trax-white pb-1"
                  >
                    {c.label} →
                  </a>
                </li>
              ))}
            </ul>

            <Spacer size="md" />

            <SubHeadline>Where TRAX is</SubHeadline>
            <Body>
              Bucharest, Romania. Experiences run across the country; there is no shop, showroom or
              office open to visitors.
            </Body>
          </div>
        </div>

        <Spacer size="lg" />

        <div className="border-t border-trax-grey/20 pt-16">
          <SubHeadline>Before you write</SubHeadline>
          <Body className="mb-6 max-w-3xl">
            Two things are worth knowing, because they are the most common questions and the answers
            do not change. Experiences are not sold, so there is no price to quote and no deposit to
            take. And spots are not held on a first-come basis — a running is filled by readiness
            for that terrain, which is a judgement made by a person after a conversation.
          </Body>
          <Body className="max-w-3xl">
            For what each experience asks of a rider, read its page under{' '}
            <Link
              href="/experiences"
              className="text-trax-red hover:text-trax-white transition-colors"
            >
              experiences
            </Link>
            . For dates, see the{' '}
            <Link href="/calendar" className="text-trax-red hover:text-trax-white transition-colors">
              calendar
            </Link>
            . For how personal data is handled, see{' '}
            <Link href="/privacy" className="text-trax-red hover:text-trax-white transition-colors">
              privacy
            </Link>
            .
          </Body>
        </div>
      </Container>
    </div>
  );
}
