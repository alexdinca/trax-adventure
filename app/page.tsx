import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Spacer } from '@/components/ui/Container';
import { Headline, SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { ExperiencesPreviewClient } from '@/components/ExperiencesPreviewClient';

export const metadata: Metadata = {
  title: 'TRAX — Terrain Leads.',
  description: 'A culture of intentional progression, built around terrain, presence and earned stories. Romania.',
  alternates: { canonical: 'https://ridetrax.eu' },
  openGraph: {
    title: 'TRAX — Terrain Leads.',
    description: 'A culture of intentional progression, built around terrain, presence and earned stories. Romania.',
    url: 'https://ridetrax.eu',
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Spacer size="xl" />
      <WhatWeCreate />
      <Spacer size="xl" />
      <Who />
      <Spacer size="xl" />
      <Ethos />
      <Spacer size="xl" />
      <Collective />
      <Spacer size="xl" />
      <ExperiencesPreviewClient />
      <Spacer size="xl" />
    </main>
  );
}

function Hero() {
  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.jpg"
          alt="Snowy mountain terrain"
          fill
          priority
          className="object-cover trax-image opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-trax-black/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-trax-black/50 via-transparent to-trax-black" />
      </div>

      <Container className="relative z-10">
        <div className="mb-8">
          <h1 className="font-sans text-trax-white text-4xl md:text-6xl lg:text-7xl font-semibold tracking-trax-wide leading-[1.1] max-w-4xl">
            Real adventure doesn't entertain <br />
            <span className="text-trax-red opacity-90">It transforms</span>
          </h1>
        </div>

        <div className="max-w-xl mt-12 space-y-6">
          <p className="font-body text-lg md:text-xl text-trax-white leading-relaxed">
            TRAX designs real-world adventure experiences where uncertainty, effort and shared challenging terrain bring people back to what actually matters.
          </p>
          <div className="pt-8">
            <MonoLabel>Est. 2025 — Romania</MonoLabel>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Manifesto() {
  return (
    <Container className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
      <div className="md:col-span-7 md:pl-12 pt-12 md:pt-0">
        <MonoLabel>The Purpose</MonoLabel>
        <SubHeadline className="text-trax-red">Why TRAX Exists</SubHeadline>
        <Headline className="mb-12">We don't sell trips. We create conditions.</Headline>
        <div className="space-y-7">
          <Body>Conditions where comfort disappears, plans change and people rediscover presence, trust and themselves.</Body>
          <Body>Modern life removed friction — and with it, meaning. Adventure became content. Routes replaced exploration. Comfort disguised itself as courage.</Body>
          <Body>TRAX exists to reintroduce friction on purpose. Not to escape life — but to return to it sharper, calmer and more real.</Body>
          <Body>TRAX exists to bring people back to themselves through shared effort, uncertainty and real terrain.</Body>
        </div>
      </div>

      <div className="md:col-span-5">
        <div className="mt-5 md:mt-24">
          <Image
            src="/assets/conditions.jpg"
            alt="Rider looking at landscape"
            width={600}
            height={800}
            className="w-full h-auto object-cover opacity-90 trax-image"
          />
        </div>
      </div>
    </Container>
  );
}

interface FeatureItemProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

function FeatureItem({ title, children, subtitle }: FeatureItemProps) {
  return (
    <div className="border-l border-trax-grey/30 pl-8 py-2">
      <SubHeadline className="mb-4 text-trax-red">{title}</SubHeadline>
      <Body className="mb-6">{children as string}</Body>
      {subtitle && <p className="font-sans text-trax-white italic opacity-80">{subtitle}</p>}
    </div>
  );
}

function WhatWeCreate() {
  return (
    <div className="relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <MonoLabel className="mb-8 block">Our Output</MonoLabel>
            <h2 className="font-sans text-4xl md:text-5xl text-trax-white mb-12">
              What <span className="text-trax-red">We Create</span>
            </h2>
            <Image
              src="/assets/experiences.jpg"
              alt="Climbing terrain"
              width={700}
              height={600}
              className="w-full h-[600px] object-cover trax-image opacity-90"
            />
          </div>

          <div className="flex flex-col justify-center space-y-16 lg:pt-24">
            <FeatureItem title="Experiences, Not Trips" subtitle="You don't consume it. You earn it.">
              No fixed outcomes. No guaranteed comfort. Each TRAX experience is designed around terrain, conditions and the people who show up.
            </FeatureItem>
            <FeatureItem title="Shared Effort" subtitle="Ego doesn't survive long here.">
              We move together. We solve together. We slow down for the group.
            </FeatureItem>
            <FeatureItem title="Earned Stories" subtitle="If there's a story, it's because something real happened.">
              Nothing staged. Nothing optimized for views.
            </FeatureItem>
            <Divider />
          </div>
        </div>
      </Container>
    </div>
  );
}

function Who() {
  const forItems = [
    'understand that discomfort reveals character',
    'don\'t need medals to validate effort',
    'value presence over performance',
    'want stories they don\'t have to exaggerate',
  ];

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-24">
      <div>
        <MonoLabel className="block mb-6">The Filters</MonoLabel>
        <SubHeadline className="text-3xl mb-8">Who TRAX Is For</SubHeadline>
        <ul className="space-y-6">
          {forItems.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-trax-red mr-4 font-mono text-sm mt-1">0{idx + 1}</span>
              <p className="font-body text-trax-white text-lg">{item}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 font-sans text-trax-grey italic">
          If you're looking for guarantees, itineraries or applause — this isn't it.
        </p>
      </div>

      <div className="relative group p-12 border border-trax-grey/20 bg-gradient-to-b from-trax-white/5 to-transparent transition-colors duration-500 hover:border-trax-red/40">
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-trax-red/20 group-hover:border-trax-red/60 transition-colors duration-500" />
        <SubHeadline className="text-3xl mb-8 text-trax-white group-hover:text-trax-red transition-colors duration-300">Who We Are Not</SubHeadline>
        <div className="space-y-6 font-sans text-xl text-trax-white">
          {['We are not a tour operator', 'We are not a training school', 'We are not an influencer brand'].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : ''}`}>
              <span className="w-8 h-[1px] bg-trax-red"></span>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-12 border-t border-trax-grey/20">
          <p className="font-body text-trax-white text-xl leading-relaxed">
            TRAX is a platform for <span className="text-trax-red font-medium">modern exploration culture.</span>
          </p>
        </div>
      </div>
    </Container>
  );
}

function Ethos() {
  const values = [
    { first: 'Terrain', last: 'trophies' },
    { first: 'Presence', last: 'performance' },
    { first: 'Trust', last: 'ego' },
    { first: 'Experience', last: 'exposure' },
  ];

  return (
    <Container>
      <div className="flex flex-col items-center">
        <MonoLabel className="mb-12 md:mb-20 block text-center">The Ethos</MonoLabel>
        <div className="flex flex-col items-start space-y-2 md:space-y-6">
          {values.map((val, idx) => (
            <h3 key={idx} className="font-sans text-3xl md:text-5xl lg:text-6xl tracking-tight leading-snug cursor-default select-none transition-opacity duration-300 hover:opacity-100">
              <span className="text-trax-white font-medium">{val.first}</span>
              <span className="text-trax-red px-3 md:px-5 font-normal">over</span>
              <span className="text-trax-grey font-normal">{val.last}</span>
            </h3>
          ))}
        </div>
        <p className="mt-20 text-trax-grey font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-center">
          These are not slogans. They are filters.
        </p>
      </div>
    </Container>
  );
}

function Collective() {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-trax-grey/20 pt-24">
        <div className="md:col-span-6">
          <MonoLabel className="block mb-6">Community</MonoLabel>
          <SubHeadline className="text-3xl">The Collective</SubHeadline>
          <Body className="mb-6">TRAX is not built around an audience. It's built around a collective.</Body>
          <Body className="mb-6">Riders, explorers and individuals who show up fully for the terrain, for each other and for themselves.</Body>
          <p className="font-sans text-xl text-trax-white mt-8">Earn the story. Share the effort. Leave changed.</p>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <MonoLabel className="block mb-6">Founder</MonoLabel>
          <div className="flex gap-6 mb-8">
            <Image
              src="/assets/alex.jpg"
              alt="Portrait detail"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full opacity-80 object-cover"
            />
            <div>
              <p className="font-sans text-trax-white">@AlexOnTRAX</p>
              <MonoLabel>Adventure Rider</MonoLabel>
            </div>
          </div>
          <Body className="mb-6">Alex builds TRAX as a response to the dilution of adventure.</Body>
          <Body className="mb-6">An adventure rider and experience architect, he designs environments where people are tested and connection forms naturally.</Body>
          <p className="font-sans text-trax-grey italic">TRAX is not his image. It's his answer.</p>
        </div>
      </div>
    </Container>
  );
}
