'use client';
import { useState } from 'react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-xs uppercase tracking-widest text-trax-grey/50 hover:text-trax-grey transition-colors duration-300"
    >
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}
