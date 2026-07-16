import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Spacer } from '@/components/ui/Container';
import { SubHeadline, Body, MonoLabel, Divider } from '@/components/ui/Typography';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'The Ground · TRAX',
  description: "TRAX's foundation experience. An open training day at TCS Racing Park. Fundamentals, shared practice, honest effort. Next session: 14 November 2026.",
  alternates: { canonical: 'https://ridetrax.eu/the-ground' },
  openGraph: {
    title: 'The Ground · TRAX',
    description: "TRAX's foundation experience. An open training day at TCS Racing Park. Fundamentals, shared practice, honest effort. Next session: 14 November 2026.",
    url: 'https://ridetrax.eu/the-ground',
    images: [{ url: '/assets/the-ground/IMG_3217.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/the-ground/IMG_3217.jpg'],
  },
};

export default function TheGroundPage() {
  return (
    <div className="min-h-screen animate-fade-in pb-24 relative">
      {/* Hero */}
      <div className="relative w-full h-[70vh] flex flex-col justify-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/the-ground/IMG_3217.jpg"
            alt="Rider cornering a motorcycle in golden light at TCS Racing Park"
            fill
            className="object-cover trax-image"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trax-black via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <MonoLabel className="mb-4 block">A TRAX Experience · TCS Racing Park</MonoLabel>
          <h1 className="font-sans text-trax-white text-5xl md:text-7xl font-medium tracking-trax-wide leading-none mb-4">The Ground</h1>
          <p className="font-body text-trax-white/80 text-xl md:text-2xl font-light italic">Where TRAX began. Where everything starts.</p>
        </Container>
      </div>

      <Container>
        <Divider />

        {/* 01 — Why The Ground */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Reference</MonoLabel>
            <SubHeadline>Why The Ground</SubHeadline>
            <Image src="/assets/the-ground/track.jpg" alt="Foggy training track lined with tire barriers" width={600} height={800} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="mb-6">Every collective needs a reference point. <span className="text-trax-red font-medium">Not a peak. Not a highlight.</span> A place you can always return to.</Body>
            <Body className="mb-6">TCS Racing Park is that place for TRAX. Controlled terrain where fundamentals are exposed, habits surface, and improvement is honest.</Body>
            <Body className="mb-6"><span className="text-trax-red font-medium">No scenery to hide behind.</span> Just you, the bike, and repetition.</Body>
            <Body>Every TRAX experience assumes what gets built here. <span className="text-trax-red font-medium">This is where the progression starts.</span></Body>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 02 — What This Is */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Experience</MonoLabel>
          <SubHeadline>What This Is</SubHeadline>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { title: 'Open Training Day', body: 'A free-flow training environment. You decide what you work on, how hard you push, when you arrive, and when you leave. No schedule. No pressure. Just time on the bike.' },
              { title: 'Shared Practice', body: "Some ride. Some rest. Some talk. Everyone belongs. Advice is exchanged naturally. Progress happens quietly. This is not instruction. It's collective learning." },
              { title: 'Grounded Effort', body: "Conditions won't be perfect. They never are. Grip varies. Lines change. That's the point. You adapt. You stay loose. You learn." },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-trax-white/5 p-6 md:p-8">
                <h4 className="font-sans text-trax-red text-lg mb-3">{pillar.title}</h4>
                <Body className="text-trax-white/80">{pillar.body}</Body>
              </div>
            ))}
          </div>

          <Spacer size="lg" />

          <div className="bg-trax-white/5 p-8 md:p-12 max-w-2xl">
            <SubHeadline className="text-trax-red">What This Is Not</SubHeadline>
            <ul className="space-y-4 font-sans text-trax-grey text-lg mt-8">
              {['Not a competition', 'Not a class', 'Not a show', 'Not a performance'].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="w-1 h-1 bg-trax-red rounded-full"></span> {item}</li>
              ))}
            </ul>
            <p className="mt-8 font-body text-trax-white opacity-60 italic">There is nothing to win here.</p>
          </div>
        </div>

        <Spacer size="lg" />

        {/* 03 — One Year On */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Return</MonoLabel>
          <SubHeadline>One Year On</SubHeadline>
          <Spacer size="md" />
          <Body className="text-xl md:text-2xl leading-relaxed mb-6">The next Ground falls on <span className="text-trax-red font-medium">14 November 2026.</span> One year since the first TRAX gathering, back on the terrain where the idea stopped being a thought and became movement.</Body>
          <Body>We don&apos;t go back to celebrate. <span className="text-trax-red font-medium">We go back to practice.</span></Body>
        </div>

        <Spacer size="lg" />

        {/* 04 — The Details */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">Practical Frame</MonoLabel>
          <SubHeadline>The Details</SubHeadline>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { label: 'Date', value: '14 November 2026', sub: 'The next session' },
              { label: 'Location', value: 'TCS Racing Park', sub: 'Gorgota, Romania' },
              { label: 'Arrival', value: 'Free Flow', sub: 'Come and leave when it suits you' },
              { label: 'Access', value: 'Circuit Fee', sub: 'Confirmed closer to the date' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="font-sans text-trax-red text-sm tracking-widest uppercase">{item.label}</p>
                <Body className="text-lg">{item.value}</Body>
                <p className="font-sans text-trax-grey text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-trax-grey text-sm">Declaration signed at reception upon arrival. Food and drinks available at the Food Court.</p>
        </div>

        <Spacer size="lg" />

        {/* 05 — What to Bring */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">Essentials</MonoLabel>
          <SubHeadline>What to Bring</SubHeadline>
          <ul className="space-y-3 font-body text-trax-white/80 mt-6 max-w-2xl">
            {['layered riding gear', 'patience', 'curiosity'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 bg-trax-red rounded-full mt-2 flex-shrink-0"></span><span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-trax-grey text-sm">Weather decides how the day unfolds. Prepare accordingly.</p>
        </div>

        <Spacer size="lg" />

        {/* 06 — Who This Is For */}
        <div className="border-t border-trax-grey/20 pt-16">
          <MonoLabel className="mb-6 block">The Filter</MonoLabel>
          <SubHeadline>Who This Is For</SubHeadline>
          <Spacer size="md" />
          <Body className="mb-6">The Ground is for anyone who values <span className="text-trax-red font-medium">practice over spectacle</span>, understands that <span className="text-trax-red font-medium">fundamentals matter</span>, and enjoys riding simply for the sake of riding.</Body>
          <Body>Skill level is irrelevant. <span className="text-trax-red font-medium">Attitude is not.</span></Body>
        </div>

        <Spacer size="xl" />

        {/* 07 — The Invitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <MonoLabel className="mb-6 block">The Invitation</MonoLabel>
            <Image src="/assets/the-ground/IMG_2823.jpg" alt="Muddy rider after a training session at TCS Racing Park" width={600} height={800} className="w-full h-[600px] object-cover trax-image opacity-90" />
          </div>
          <div>
            <Spacer size="md" />
            <Body className="text-xl md:text-2xl leading-relaxed mb-6">This is not an anniversary party. It&apos;s a return.</Body>
            <Body className="mb-8">No funnel. No promises. Only an invitation. If this resonates, you&apos;ll know.</Body>
            <WhatsAppCTA label="Show Up" source="the_ground_page" href={whatsappLink('Salut,\nVreau să particip la The Ground pe 14 noiembrie.\nÎmi dai te rog mai multe detalii?')} />
          </div>
        </div>

        <div className="text-center mt-24 opacity-40">
          <p className="font-sans text-sm tracking-widest text-trax-white">#OnTRAX</p>
        </div>
      </Container>
    </div>
  );
}
