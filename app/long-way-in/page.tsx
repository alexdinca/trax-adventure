import type { Metadata } from 'next';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';

export const metadata: Metadata = {
  title: 'The Long Way In — TRAX Adventure',
  description: 'Five days across ACT Romania. 1370km from Maramureș to the Transfăgărășan. Advanced adventure riding through tarmac, gravel, forest roads. Self-supported, group-limited, experience-filtered.',
  alternates: { canonical: 'https://ridetrax.eu/long-way-in' },
  openGraph: {
    title: 'The Long Way In — TRAX',
    description: 'Join a five-day traversal of Romania\'s backbone. No shortcuts. No rush. No performance.',
    url: 'https://ridetrax.eu/long-way-in',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
};

export default function LongWayInPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero */}
      <div className="pt-32 pb-20 md:pb-32">
        <Container>
          <div className="flex flex-col gap-6">
            <MonoLabel className="text-trax-red">FIVE DAYS. ONE COUNTRY.</MonoLabel>
            <Headline className="text-5xl md:text-6xl leading-tight">The Long Way In</Headline>
            <SubHeadline className="text-2xl md:text-3xl text-trax-grey max-w-3xl">A five-day TRAX experience across ACT Romania</SubHeadline>
            <Body className="text-lg text-trax-grey max-w-2xl mt-4">Five days. One country. No shortcuts.</Body>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <WhatsAppCTA label="Request Access" source="the_long_way_in_page" />
            </div>
          </div>
        </Container>
      </div>

      <Spacer size="lg" />

      {/* Purpose */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
          <div className="md:col-span-7">
            <SubHeadline className="text-trax-red mb-6">The Purpose</SubHeadline>
            <Headline className="mb-8">This Is Not About Crossing Romania</Headline>
            <Body className="text-lg space-y-6">
              <p>ACT Romania already maps the land. TRAX maps the experience.</p>
              <p>The Long Way In is a deliberate five-day traversal of Romania's backbone — from Maramureș to the high ridges of the Southern Carpathians. It is designed to slow you down, stretch your endurance, and let the country work on you.</p>
              <p>No shortcuts. No rush. No performance.</p>
            </Body>
          </div>
          <div className="md:col-span-5 flex items-center">
            <div className="w-full aspect-square bg-trax-grey/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-trax-grey">
                <div className="text-sm">Route Visualization</div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Journey Overview */}
      <Container>
        <Headline className="mb-12">From the North, Into the Spine</Headline>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-center justify-center">
            <div className="w-full aspect-[1/2] bg-trax-grey/10 rounded-lg flex items-center justify-center">
              <div className="text-center text-trax-grey">
                <div className="text-sm">Route Map</div>
                <div className="text-xs mt-2">North → South</div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Duration', value: '5 days' },
              { label: 'Distance', value: '~1370 km' },
              { label: 'Terrain', value: 'Tarmac, gravel, forest roads, rocks, mud' },
              { label: 'Off-Road', value: '~45% (conditions dependent)' },
              { label: 'Level', value: 'Advanced' },
              { label: 'Accommodation', value: 'Small hotels & guesthouses (camping optional)' },
            ].map((item) => (
              <div key={item.label}>
                <MonoLabel className="text-trax-red">{item.label}</MonoLabel>
                <Body className="text-xl mt-2">{item.value}</Body>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Daily Rhythm */}
      <Container>
        <Headline className="mb-12">How the Days Flow</Headline>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Morning', text: 'Quiet starts. Route context. Weather and terrain notes. Coffee before noise.' },
            { label: 'Riding', text: 'Ride your rhythm. Regroup naturally. No racing, no pressure, no hierarchy.' },
            { label: 'Evening', text: 'Food, stories, rest. Phones down when it matters. Some moments stay undocumented.' },
          ].map((item) => (
            <div key={item.label}>
              <SubHeadline className="text-trax-red mb-4">{item.label}</SubHeadline>
              <Body className="text-lg leading-relaxed">{item.text}</Body>
            </div>
          ))}
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* ACT Romania */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">ACT Romania, Interpreted by TRAX</Headline>
          <Body className="text-lg space-y-6 mb-8">
            <p>This experience follows the official ACT Romania track, newly scouted and refined to preserve its spirit.</p>
            <p>From wooden churches in Maramureș to painted monasteries in Bucovina, through Transylvania's farmland and citadels, across Apuseni's quiet ridges and into the high drama of Transalpina and Transfăgărășan — the route culminates where effort meets perspective.</p>
          </Body>
          <div className="border-l-2 border-trax-red pl-6 py-4">
            <MonoLabel className="text-sm text-trax-grey">Note</MonoLabel>
            <Body className="text-sm text-trax-grey mt-2">Riders must respect all local regulations and border areas. No off-track riding.</Body>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Filter */}
      <Container>
        <Headline className="mb-12">This Experience Has a Filter</Headline>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <SubHeadline className="text-trax-grey mb-6">This Is Not For</SubHeadline>
            <ul className="space-y-4">
              {['First-time off-road riders', 'Content-first mindsets', 'Those in a hurry', 'Riders looking for hand-holding'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-trax-red mt-1">•</span>
                  <Body className="text-lg">{item}</Body>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubHeadline className="text-trax-red mb-6">This Is For</SubHeadline>
            <ul className="space-y-4">
              {['Experienced adventure riders', 'People comfortable with discomfort', 'Riders who value depth over highlights', 'Those ready for five demanding days'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-trax-red mt-1">•</span>
                  <Body className="text-lg">{item}</Body>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Group Culture */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">How We Ride Together</Headline>
          <Body className="text-lg space-y-6">
            <p>Group size is intentionally limited.</p>
            <p>Everyone rides their own bike. Everyone carries their own responsibility. Once the helmet is on, everyone is equal.</p>
            <p>Ego stays behind. Presence comes first.</p>
          </Body>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Logistics */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">Good to Know</Headline>
          <ul className="space-y-4">
            {[
              { label: 'Start', value: 'Northern Romania (Maramureș area)' },
              { label: 'Finish', value: 'Transfăgărășan (Bâlea area)' },
              { label: 'Bikes', value: 'Adventure / dual-sport, properly equipped' },
              { label: 'Language', value: 'Romanian / English' },
              { label: 'Support', value: 'Self-supported riding with TRAX coordination' },
            ].map((item) => (
              <li key={item.label} className="flex flex-col sm:flex-row sm:gap-6">
                <MonoLabel className="text-trax-red flex-shrink-0">{item.label}</MonoLabel>
                <Body className="text-lg">{item.value}</Body>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />
      <Spacer size="lg" />

      {/* Access */}
      <Container>
        <div className="max-w-3xl">
          <Headline className="mb-8">Request Access</Headline>
          <Body className="text-lg space-y-6 mb-8">
            <p>The Long Way In is not a mass experience.</p>
            <p>Participation is limited to preserve pace, safety, and group dynamic. Access is granted based on experience and alignment — not speed or status.</p>
          </Body>
          <WhatsAppCTA label="Request Access" source="the_long_way_in_page" />
        </div>
      </Container>

      <Spacer size="lg" />
      <Divider />

      <Container>
        <div className="text-center py-20">
          <Body className="text-lg text-trax-grey italic max-w-2xl mx-auto">
            You won't remember every kilometer.
            <br />
            But you'll remember who you were when you finished.
          </Body>
          <MonoLabel className="text-trax-red mt-6">#OnTRAX</MonoLabel>
        </div>
      </Container>
    </div>
  );
}
