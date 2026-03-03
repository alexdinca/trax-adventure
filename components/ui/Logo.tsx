import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Link href="/" className={`font-sans font-bold text-2xl tracking-[0.2em] text-trax-white select-none ${className}`}>
    TRAX
  </Link>
);
