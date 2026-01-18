import React from 'react';

export interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export interface TextProps {
  children: React.ReactNode;
  className?: string;
}