'use client';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const BUTTON_CLASSES = `
  border border-trax-grey
  text-trax-white
  font-body
  px-8 py-3
  bg-transparent
  transition-colors duration-300
  hover:border-trax-red hover:text-trax-red
  focus:outline-none
`;

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => (
  <button onClick={onClick} className={`${BUTTON_CLASSES} ${className}`}>
    {children}
  </button>
);
