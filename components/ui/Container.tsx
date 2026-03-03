import React from 'react';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export const Container: React.FC<SectionProps> = ({ children, className = '', id }) => (
  <section id={id} className={`w-full px-6 md:px-12 max-w-[1200px] mx-auto ${className}`}>
    {children}
  </section>
);

export const Spacer: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const heights = { sm: 'h-16', md: 'h-32', lg: 'h-48', xl: 'h-64' };
  return <div className={`w-full ${heights[size]}`} />;
};
