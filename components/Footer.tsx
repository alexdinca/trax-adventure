import React from 'react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { MonoLabel, Headline } from './ui/Typography';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-trax-black pt-32 pb-12 border-t border-trax-grey/10">
      <Container className="text-center mb-32">
        <MonoLabel className="mb-8 block">Next Steps</MonoLabel>
        <Headline className="mb-8">How to Join</Headline>
        
        <p className="font-body text-trax-white/80 text-xl max-w-lg mx-auto mb-12">
            There is no funnel. No promises. Only an invitation. <br />
            If this resonates, you’ll know.
        </p>

        <Button 
          className="mb-16"
          onClick={() => window.open('https://chat.whatsapp.com/IYnaKYKJsS2DgMljmyMRWD', '_blank')}
        >
          Join when ready
        </Button>

        {/* Social Media Links */}
        <div className="flex justify-center items-center gap-6 md:gap-10 mb-16">
            <a href="#" className="text-trax-grey hover:text-trax-red transition-colors duration-300 font-mono text-xs md:text-sm uppercase tracking-widest">
                Instagram
            </a>
            <span className="text-trax-grey/20 select-none">/</span>
            <a href="#" className="text-trax-grey hover:text-trax-red transition-colors duration-300 font-mono text-xs md:text-sm uppercase tracking-widest">
                Facebook
            </a>
            <span className="text-trax-grey/20 select-none">/</span>
            <a href="#" className="text-trax-grey hover:text-trax-red transition-colors duration-300 font-mono text-xs md:text-sm uppercase tracking-widest">
                YouTube
            </a>
        </div>

        <p className="text-trax-grey font-sans text-2xl tracking-widest opacity-50">#OnTRAX</p>
      </Container>

      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-trax-grey/20 pt-8">
            <div className="mb-6 md:mb-0">
                 <h1 className="font-sans text-2xl font-bold tracking-widest text-trax-white">TRAX</h1>
                 <MonoLabel className="mt-2 block text-[10px]">© 2025</MonoLabel>
            </div>
            
            <div className="text-right">
                <p className="font-sans text-trax-white text-sm md:text-base tracking-trax-wide">
                    Real terrain. Shared effort. Earned stories.
                </p>
            </div>
        </div>
      </Container>
    </footer>
  );
};