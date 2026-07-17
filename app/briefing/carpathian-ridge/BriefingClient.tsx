'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { ROUTES, WAYPOINTS } from './briefing-data';

const CarpathianRidgeMap = dynamic(() => import('@/components/CarpathianRidgeMap'), { ssr: false });

interface DayInfo {
  day: 1 | 2 | 3;
  title: string;
  distance: string;
  maxAltitude: string;
  base: string;
  description: string;
  gpxFile: string;
}

const DAYS: DayInfo[] = [
  {
    day: 1,
    title: 'Into the Forest',
    distance: '~142 km',
    maxAltitude: '~1,410 m',
    base: 'Sibiu',
    description:
      "A loop from Sibiu through the forest country to the west. The terrain sharpens section by section. Lunch point mid-route, five fuel opportunities along the way. The day calibrates the group. Ride it accordingly.",
    gpxFile: 'trax-carpathian-ridge-day1.gpx',
  },
  {
    day: 2,
    title: 'The Ridge',
    distance: '~260 km',
    maxAltitude: '~2,120 m',
    base: 'Sibiu → Ranca',
    description:
      "The long day. South through the Cindrel and Șureanu high country, above the treeline, finishing at the cabana in Ranca. The second half runs long stretches without fuel. Start full, ride smooth, protect your energy. This day is won in the first two hours by the pace you refuse to set.",
    gpxFile: 'trax-carpathian-ridge-day2.gpx',
  },
  {
    day: 3,
    title: 'The Way Down',
    distance: '~165 km',
    maxAltitude: '~2,120 m',
    base: 'Ranca → Sibiu',
    description:
      "You start high, above two thousand meters, with yesterday in your arms and legs. The route works back toward Sibiu through long descents and rolling terrain. Same work, less in the tank. Stay patient. The loop closes where it started.",
    gpxFile: 'trax-carpathian-ridge-day3.gpx',
  },
];

const BIKE_REQUIREMENTS = [
  'serviced and inspected before the start, no known issues',
  'off-road tires in good condition, suitable for rock and loose terrain',
  'engine and hand guards',
  'tubeless repair kit or spare tubes, and the tools to use them',
  'tow strap',
  'charged phone, offline maps, GPX loaded before Day 1',
];

const GEAR_REQUIREMENTS = [
  'full protective gear, no exceptions',
  'layered clothing, alpine weather changes fast above 1,800 m',
  'rain gear, regardless of forecast',
  'hydration system',
  'basic personal first aid',
];

const GROUP_RULES = [
  'the terrain leads, the plan adapts',
  "ride your own pace inside the group's rhythm",
  'no one rides sweep alone, no one gets left behind',
  'route decisions are made by the lead, for the whole group',
  'signal problems early, small ones become big ones at altitude',
  'some moments stay off camera',
];

function RequirementList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <div key={item} className="flex gap-4 px-5 py-4 bg-trax-white/5">
          <span className="text-trax-red font-mono text-sm mt-0.5 flex-shrink-0">·</span>
          <p className="font-body text-trax-white/80 text-sm leading-relaxed">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function BriefingClient() {
  return (
    <div className="min-h-screen animate-fade-in pt-16 pb-24">

      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-trax-black/95 border-b border-trax-white/10 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-sm">
        <a href="/" className="font-sans font-bold tracking-[0.2em] uppercase text-trax-white text-sm hover:text-trax-red transition-colors duration-150">TRAX</a>
        <MonoLabel>Briefing Pack</MonoLabel>
      </div>

      {/* Fixed bottom access bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-trax-black/95 border-t border-trax-white/10 px-6 md:px-12 py-3 flex items-center justify-between backdrop-blur-sm">
        <MonoLabel>TRAX Briefing Pack · Confirmed Riders Only</MonoLabel>
        <MonoLabel><span className="text-trax-red">#CarpathianRidge</span></MonoLabel>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/carpathian-ridge/IMG_6451.jpg"
            alt="Loaded KTM adventure motorcycle on a ridge above a mountain lake in the Carpathians"
            fill
            className="object-cover object-bottom trax-image opacity-50"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-trax-black/30 to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">TRAX Briefing · Access Granted</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">
            Carpathian Ridge
          </h1>
          <p className="font-body text-trax-white/70 text-xl md:text-2xl font-light italic mb-4">
            28th – 30th August 2026 · Sibiu → Ranca → Sibiu
          </p>
          <p className="font-mono text-xs tracking-widest uppercase text-trax-red/80">
            This briefing is for confirmed riders. Do not share the link.
          </p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* 01 — The Word */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">01 · The Word</MonoLabel>
          <SubHeadline>Read This First</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            You are riding the trails that hosted the KTM Europe Adventure Rally in 2025. Three days, roughly 570 kilometers, up to 2,120 meters of altitude.
          </Body>
          <Body className="mb-6">
            There is no support crew. The group is the support. Every decision you make on the trail is made for everyone behind you.
          </Body>
          <Body>
            Read everything below. Then read it again the night before.
          </Body>
        </div>

        <Spacer size="lg" />

        {/* 02 — The Route */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">02 · The Route</MonoLabel>
          <SubHeadline className="mb-8">Three Days</SubHeadline>

          <div className="flex flex-col gap-20">
            {DAYS.map((d) => (
              <div key={d.day}>
                <div className="flex items-baseline justify-between mb-4">
                  <h4 className="font-sans text-trax-white text-2xl font-medium">Day {d.day} · {d.title}</h4>
                </div>

                <div className="grid grid-cols-3 gap-[1px] bg-trax-white/10 mb-6">
                  {[
                    { val: d.distance, key: 'Distance' },
                    { val: d.maxAltitude, key: 'Max Altitude' },
                    { val: d.base, key: 'Base' },
                  ].map((s) => (
                    <div key={s.key} className="bg-trax-black p-4 text-center">
                      <span className="font-sans text-lg md:text-2xl font-medium text-trax-white block leading-none">{s.val}</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-trax-grey block mt-1">{s.key}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-[380px] md:h-[460px] relative border border-trax-white/10 mb-6 bg-[#111]">
                  <CarpathianRidgeMap route={ROUTES[d.day]} waypoints={WAYPOINTS[d.day]} />
                </div>

                <Body className="mb-6">{d.description}</Body>

                <a
                  href={`/assets/gpx/${d.gpxFile}`}
                  download
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2.5 bg-trax-white/5 border border-trax-white/15 text-trax-grey hover:text-trax-white hover:border-trax-white/30 transition-all duration-200"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 1v7M3 5.5l3 3 3-3M1 10h10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download Day {d.day} GPX
                </a>
              </div>
            ))}
          </div>
        </div>

        <Spacer size="lg" />

        {/* 03 — Route Logic */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">03 · Route Logic</MonoLabel>
          <SubHeadline>The Line We Ride</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            The route on these maps is the route. It was measured, fueled, and planned as a whole. Ride it as one.
          </Body>
          <Body>
            Some sections have harder variants. They are not published here. If terrain, weather, and the group allow it, they are offered on the day, by the lead, to the whole group. Nobody freelances onto a harder line alone.
          </Body>
        </div>

        <Spacer size="lg" />

        {/* 04 — Fuel & Food */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">04 · Fuel &amp; Food</MonoLabel>
          <SubHeadline>Range and Refuel</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            Fuel stations are marked on each map. Day 2 includes long high sections with no fuel access. Minimum 250 km of real-world autonomy is recommended, calculated for loaded, technical riding, not highway consumption.
          </Body>
          <Body>
            Lunch points are marked on Days 1 and 2. Carry water for a full day regardless. Two liters minimum, more in heat.
          </Body>
        </div>

        <Spacer size="lg" />

        {/* 05 — The Machine */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">05 · The Machine</MonoLabel>
          <SubHeadline className="mb-8">Bike Requirements</SubHeadline>
          <RequirementList items={BIKE_REQUIREMENTS} />
          <p className="font-body text-trax-white/80 text-sm italic mt-6">
            If your bike has a doubt, resolve it before Sibiu. The mountains do not host repairs.
          </p>
        </div>

        <Spacer size="lg" />

        {/* 06 — The Rider */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">06 · The Rider</MonoLabel>
          <SubHeadline className="mb-8">Gear Requirements</SubHeadline>
          <RequirementList items={GEAR_REQUIREMENTS} />
          <p className="font-body text-trax-white/80 text-sm italic mt-6">
            Pack for the mountain you might get, not the one in the forecast.
          </p>
        </div>

        <Spacer size="lg" />

        {/* 07 — The Nights */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">07 · The Nights</MonoLabel>
          <SubHeadline>Where We Sleep</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            Night 1: Sibiu. Details confirmed in the group chat.
            <br />
            Night 2: Cabana in Ranca. Details confirmed in the group chat.
          </Body>
          <Body>
            Evenings are for food, bike checks, and sleep. The route the next day assumes you got all three.
          </Body>
        </div>

        <Spacer size="lg" />

        {/* 08 — The Rules */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">08 · The Rules</MonoLabel>
          <SubHeadline className="mb-8">How the Group Rides</SubHeadline>
          <RequirementList items={GROUP_RULES} />
          <p className="font-body text-trax-white/80 text-sm italic mt-6">
            The mountains reward the group that behaves like one.
          </p>
        </div>

        <Spacer size="lg" />

        {/* 09 — Contact */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">09 · Contact</MonoLabel>
          <SubHeadline>If Something Goes Wrong</SubHeadline>
          <Spacer size="sm" />
          <Body className="mb-6">
            Emergency number in Romania: 112.
          </Body>
          <Body>
            Trip contact: confirmed in the group chat before departure. Save it before Day 1, coverage above the treeline is not guaranteed.
          </Body>
        </div>

        <Spacer size="xl" />

        <div className="text-center opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">Carpathian Ridge · Briefing v1.0 · For confirmed riders only</p>
        </div>
      </Container>
    </div>
  );
}
