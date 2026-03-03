import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'About TRAX — Who Is TRAX',
  description: 'TRAX doesn\'t sell experiences. It creates conditions. A culture of intentional progression in adventure riding, built in Romania.',
  alternates: { canonical: 'https://ridetrax.eu/about' },
  openGraph: {
    title: 'About TRAX',
    description: 'TRAX doesn\'t sell experiences. It creates conditions.',
    url: 'https://ridetrax.eu/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 pt-32">
      <Container>
        <MonoLabel className="mb-8 block">Who we are</MonoLabel>
        <Headline className="mb-16 max-w-3xl">TRAX doesn't sell experiences. It creates conditions.</Headline>

        <div className="max-w-2xl mb-16">
          <Body className="text-xl leading-relaxed">
            TRAX is a culture of intentional progression, built around terrain, presence and earned stories. We are not a tour operator. We are not a riding school. We are not an influencer brand. We are a collective of explorers who believe that uncertainty reveals character — and that shared effort creates real connection.
          </Body>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-16">
          <div>
            <SubHeadline className="text-trax-red mb-8">What we are not</SubHeadline>
            <ul className="space-y-5 font-sans text-trax-white text-lg">
              {[
                'Not a tour operator',
                'Not a riding school',
                'Not an influencer brand',
                'No guarantees or fixed itineraries',
                'No spectacle for cameras',
              ].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-trax-red flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SubHeadline className="text-trax-white mb-8">What we protect</SubHeadline>
            <ul className="space-y-5 font-body text-trax-white/80 text-lg">
              {[
                'Space for authentic presence',
                'Group pace over individual performance',
                'The moments that aren\'t filmed',
                'Quality over quantity of participants',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider />

        <div className="max-w-xl">
          <p className="font-body text-xl text-trax-white/80 leading-relaxed mb-8">
            If you feel this is your place — write to us.
          </p>
          <a
            href="mailto:hello@ridetrax.eu"
            className="font-mono text-sm uppercase tracking-widest text-trax-red hover:text-trax-white transition-colors duration-300 border-b border-trax-red/40 hover:border-trax-white pb-1"
          >
            hello@ridetrax.eu
          </a>
        </div>
      </Container>
    </div>
  );
}
