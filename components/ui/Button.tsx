import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        border border-trax-grey 
        text-trax-white 
        font-body 
        px-8 py-3 
        bg-transparent 
        transition-colors duration-300 
        hover:border-trax-red hover:text-trax-red
        focus:outline-none
        ${className}
      `}
    >
      {children}
    </button>
  );
};