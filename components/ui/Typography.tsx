import React from 'react';
import { TextProps } from '../../types';

// Helper to check if a specific text color override is present
const hasColorOverride = (className: string) => {
  // We check for 'text-trax-' to detect brand colors, or generic 'text-' colors if needed.
  // This is a simple heuristic to avoid conflicts.
  return className.includes('text-trax-') || className.includes('text-white') || className.includes('text-black');
};

export const Headline: React.FC<TextProps> = ({ children, className = '' }) => {
  const defaultColor = hasColorOverride(className) ? '' : 'text-trax-white';
  
  return (
    <h2 className={`font-sans font-medium text-3xl md:text-4xl lg:text-5xl tracking-trax-wide leading-tight ${defaultColor} ${className}`}>
      {children}
    </h2>
  );
};

export const SubHeadline: React.FC<TextProps> = ({ children, className = '' }) => {
  const defaultColor = hasColorOverride(className) ? '' : 'text-trax-white';

  return (
    <h3 className={`font-sans font-medium text-xl md:text-2xl tracking-trax-wide mb-6 ${defaultColor} ${className}`}>
      {children}
    </h3>
  );
};

export const Body: React.FC<TextProps> = ({ children, className = '' }) => {
  // Body has a specific opacity default, so we handle it carefully
  const defaultColor = hasColorOverride(className) ? '' : 'text-trax-white/90';

  return (
    <p className={`font-body font-normal text-base md:text-lg leading-[1.7] md:leading-[1.8] max-w-2xl ${defaultColor} ${className}`}>
      {children}
    </p>
  );
};

export const MonoLabel: React.FC<TextProps> = ({ children, className = '' }) => {
  const defaultColor = hasColorOverride(className) ? '' : 'text-trax-grey';

  return (
    <span className={`font-mono text-xs md:text-sm uppercase tracking-widest ${defaultColor} ${className}`}>
      {children}
    </span>
  );
};

export const Divider: React.FC = () => {
  return (
    <div className="w-12 h-[1px] bg-trax-red my-12" />
  );
};