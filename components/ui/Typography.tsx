import React from 'react';
import { TextProps } from '../../types';

export const Headline: React.FC<TextProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`font-sans font-medium text-3xl md:text-4xl lg:text-5xl tracking-trax-wide text-trax-white leading-tight ${className}`}>
      {children}
    </h2>
  );
};

export const SubHeadline: React.FC<TextProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`font-sans font-medium text-xl md:text-2xl tracking-trax-wide text-trax-white mb-6 ${className}`}>
      {children}
    </h3>
  );
};

export const Body: React.FC<TextProps> = ({ children, className = '' }) => {
  return (
    <p className={`font-body font-normal text-trax-white/90 text-base md:text-lg leading-[1.7] md:leading-[1.8] max-w-2xl ${className}`}>
      {children}
    </p>
  );
};

export const MonoLabel: React.FC<TextProps> = ({ children, className = '' }) => {
  return (
    <span className={`font-mono text-xs md:text-sm text-trax-grey uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
};

export const Divider: React.FC = () => {
  return (
    <div className="w-12 h-[1px] bg-trax-red my-12" />
  );
};