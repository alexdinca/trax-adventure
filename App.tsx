import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAptabase } from '@aptabase/react';
import { useSEO } from './hooks/useSEO';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { WhatWeCreate } from './components/WhatWeCreate';
import { Who } from './components/Who';
import { Ethos } from './components/Ethos';
import { Collective } from './components/Collective';
import { ExperiencesPreview } from './components/ExperiencesPreview';
import { Footer } from './components/Footer';
import { Spacer } from './components/ui/Container';
import { Logo } from './components/ui/Logo';
import { Navigation } from './components/Navigation';
import { Experiences } from './components/Experiences';
import { DobrogeaCalling } from './components/DobrogeaCalling';
import { CarpathianRidge } from './components/CarpathianRidge';
import { TheGround } from './components/TheGround';
import { TheLongWayIn } from './components/TheLongWayIn';
import { Analytics } from '@vercel/analytics/react';


// Layout component that wraps all pages
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { trackEvent } = useAptabase();

  // Get current view from pathname
  const getCurrentView = () => {
    const path = location.pathname.slice(1) || 'home';
    return path;
  };

  useEffect(() => {
    trackEvent('page_visit', {
      view: getCurrentView(),
      timestamp: new Date().toISOString()
    });
    window.scrollTo(0, 0);
  }, [location.pathname, trackEvent]);

  return (
    <div className="bg-trax-black min-h-screen w-full selection:bg-trax-red selection:text-trax-white relative">
      {/* Global Background Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
        <img 
          src="/assets/trax-tyre-mark.png" 
          alt="" 
          className="w-[90vw] md:w-[1000px] object-contain max-h-[80vh]"
        />
      </div>

      {/* Fixed Header Logo */}
      <div 
        className="fixed top-8 left-6 md:left-12 z-50 mix-blend-difference cursor-pointer"
      >
        <a href="/">
          <Logo />
        </a>
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navigation currentView={getCurrentView()} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
        <Analytics />
        
      </div>

      <div id="footer" className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

// Home page component
const HomePage: React.FC = () => {
  useSEO({
    title: 'TRAX — Real Adventure',
    description: 'TRAX designs curated adventure motorcycling experiences in unexplored terrain. Terrain-led exploration, shared effort, and honest discovery.',
  });

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
      <ExperiencesPreview />
      <Spacer size="xl" />
    </main>
  );
};

function App() {
  const { trackEvent } = useAptabase();

  // Track initial page load
  useEffect(() => {
    trackEvent('app_initialized', {
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/dobrogea" element={<DobrogeaCalling />} />
          <Route path="/carpathian" element={<CarpathianRidge />} />
          <Route path="/ground" element={<TheGround />} />
          <Route path="/long-way-in" element={<TheLongWayIn />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


export default App;