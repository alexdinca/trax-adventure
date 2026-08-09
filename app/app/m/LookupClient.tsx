'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mark } from '@/components/app/primitives';
import { SERIAL_PLACEHOLDER, normalizeSerial } from '@/lib/app/serial';

/**
 * One dashed-rule mono input (BRD LG-09).
 *
 * It is forgiving about what gets typed — the number is being read off a label
 * on a jacket, often badly lit — and strict about what it looks up. Anything it
 * cannot parse is rejected here rather than sent to the server to be told no.
 */
export function LookupClient({ initial = '' }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [bad, setBad] = useState(false);

  function look() {
    const serial = normalizeSerial(value);
    if (!serial) {
      setBad(true);
      return;
    }
    router.push(`/app/m/${serial}`);
  }

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (bad) setBad(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') look();
        }}
        placeholder={SERIAL_PLACEHOLDER}
        aria-label="Serial"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className="trax-field font-mono text-lg md:text-xl uppercase text-trax-white w-full
                   border-b border-dashed border-trax-white/25 pb-2
                   placeholder:text-trax-grey/40"
      />
      {bad && (
        
        <Mark className="block mt-4 text-trax-red">That is not a serial we issue.</Mark>
      )}
    </div>
  );
}
