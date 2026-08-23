import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'About TRAX · Who we are',
  description:
    'TRAX is an off-road motorcycle collective founded in Romania in 2025. Terrain-led experiences, participation by readiness, artifacts earned rather than sold.',
  alternates: { canonical: 'https://ridetrax.eu/about' },
  openGraph: {
    type: 'website',
    title: 'About TRAX · Who we are',
    description:
      'An off-road motorcycle collective founded in Romania in 2025. Terrain-led experiences, participation by readiness.',
    url: 'https://ridetrax.eu/about',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512 }],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24">
      <Container>
        <Spacer size="lg" />
        <MonoLabel className="mb-6 block">About</MonoLabel>
        <Headline className="mb-8 max-w-3xl">
          A collective, <span className="text-trax-red">not a tour operator.</span>
        </Headline>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <SubHeadline>What TRAX is</SubHeadline>
            <Body className="mb-6">
              TRAX is an off-road motorcycle collective founded in Romania in 2025. It designs and
              leads multi-day, terrain-led experiences across the country — from the limestone
              plateaus of Dobrogea to the high ridges of the Carpathians.
            </Body>
            <Body className="mb-6">
              It is not a travel agency, a tour operator, a training school, or a content business.
              Nothing on this site is a product for sale. There is no checkout, no pricing page and
              no seat count, because participation is requested from a person and granted by a
              person.
            </Body>
            <Body>
              TRAX runs two divisions. <span className="text-trax-red font-medium">TRAX ADV</span>{' '}
              covers the curated multi-day off-road experiences.{' '}
              <span className="text-trax-red font-medium">TRAX MX</span> covers competition-oriented
              riding and skill development for riders who enjoy the competitive side without being
              full-time athletes.
            </Body>
          </div>

          <div>
            <SubHeadline>How participation works</SubHeadline>
            <Body className="mb-6">
              Entry to the collective is by mindset alignment rather than by payment or popularity.
              Standing is earned by participation and is recorded privately. Rank is never
              purchasable, and access is never sold.
            </Body>
            <Body className="mb-6">
              The five experiences form an order rather than a menu. The Ground, Out There, Dobrogea
              Calling, Carpathian Ridge and The Long Way In each ask something different, and they
              are meant to be taken in sequence. A rider who has not reached a tier is not below it.
              That tier is simply later.
            </Body>
            <Body>
              Objects issued at the end of an experience are earned, dated and serialised. They are
              never priced and never sold. Anyone can verify one at{' '}
              <Link href="/app/m" className="text-trax-red hover:text-trax-white transition-colors">
                the provenance lookup
              </Link>
              , which returns the object and never a person&apos;s name.
            </Body>
          </div>
        </div>

        <Spacer size="lg" />

        <div className="border-t border-trax-grey/20 pt-16">
          <SubHeadline>Where we operate</SubHeadline>
          <Body className="mb-6 max-w-3xl">
            All experiences run in Romania. The collective is based in Bucharest, and routes run
            east to the Danube delta and Dobrogea, north and west into the Carpathians, and along
            the ACT Romania route from Maramureș to the Transfăgărășan.
          </Body>
          <Body className="max-w-3xl">
            Season dates are published on the{' '}
            <Link href="/calendar" className="text-trax-red hover:text-trax-white transition-colors">
              calendar
            </Link>
            , and each experience has its own page under{' '}
            <Link
              href="/experiences"
              className="text-trax-red hover:text-trax-white transition-colors"
            >
              experiences
            </Link>
            . To reach a human, see{' '}
            <Link href="/contact" className="text-trax-red hover:text-trax-white transition-colors">
              contact
            </Link>
            .
          </Body>
        </div>
      </Container>
    </div>
  );
}
