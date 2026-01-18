import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  src?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', src = '/trax-logo.png' }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback text version that matches the brand font if image is missing
  if (imgError) {
    return (
      <span className={`font-sans font-bold text-2xl tracking-[0.2em] text-trax-white select-none cursor-default ${className}`}>
        TRAX
      </span>
    );
  }

  return (
    <img 
      src={src} 
      alt="TRAX" 
      className={`h-8 md:h-10 w-auto object-contain transition-opacity duration-300 ${className}`}
      onError={() => setImgError(true)}
    />
  );
};