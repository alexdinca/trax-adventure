import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { WhatWeCreate } from './components/WhatWeCreate';
import { Who } from './components/Who';
import { Ethos } from './components/Ethos';
import { Collective } from './components/Collective';
import { Footer } from './components/Footer';
import { Spacer } from './components/ui/Container';
import { Logo } from './components/ui/Logo';
import { Navigation } from './components/Navigation';
import { Experiences } from './components/Experiences';
import { DobrogeaCalling } from './components/DobrogeaCalling';

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Simple scrollToTop on navigation change
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch(currentView) {
      case 'experiences':
        return <Experiences onNavigate={handleNavigate} />;
      case 'dobrogea':
        return <DobrogeaCalling />;
      case 'contact':
      case 'home':
      default:
        // Handle contact scrolling side-effect
        if (currentView === 'contact') {
          setTimeout(() => {
            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }

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
            </main>
        );
    }
  };
  
  return (
    <div className="bg-trax-black min-h-screen w-full selection:bg-trax-red selection:text-trax-white relative">
      {/* Global Background Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
          <img 
              src="/src/assets/trax-tyre-mark.png" 
              alt="" 
              className="w-[90vw] md:w-[1000px] object-contain max-h-[80vh]"
          />
      </div>
      {/* Fixed Header Logo */}
      <div 
        className="fixed top-8 left-6 md:left-12 z-50 mix-blend-difference cursor-pointer"
        onClick={() => handleNavigate('home')}
      >
          <Logo />
      </div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {renderContent()}
      </div>

      <div id="footer" className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;