import React from 'react';

/**
 * The /app primitive set.
 *
 * These four components are the only things permitted to draw a control or a
 * boundary inside /app. Raw HTML controls are forbidden in this subtree
 * (BRD DS-05) because platform chrome — focus rings, rounded fields, system
 * switches — makes a document read as an interface, and a document is
 * something you believe rather than operate.
 */

type Div = React.HTMLAttributes<HTMLDivElement>;

/* ── Mark ────────────────────────────────────────────────────────────────
   The instrument reporting. Mono, uppercase, letter-spacing normal.
   Used for serials, dates, rung, window state, labels. Never for prose,
   and never for a rider's own words. (BRD §9.1) */

export function Mark({
  children,
  className = '',
  ...rest
}: Div & { children: React.ReactNode }) {
  return (
    <span
      className={`trax-mark font-mono text-[11px] md:text-xs uppercase text-trax-grey ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}

/* ── Rule ────────────────────────────────────────────────────────────────
   A 1px hairline. Carries all pacing, together with whitespace. Images are
   never used as rhythm inside /app (BRD DS-06). */

export function Rule({
  className = '',
  tone = 'faint',
}: {
  className?: string;
  tone?: 'faint' | 'solid' | 'ember';
}) {
  const color =
    tone === 'ember'
      ? 'bg-trax-red'
      : tone === 'solid'
        ? 'bg-trax-white/40'
        : 'bg-trax-white/10';
  return <div className={`h-px w-full ${color} ${className}`} aria-hidden="true" />;
}

/* ── Block ───────────────────────────────────────────────────────────────
   A vertical unit of the document. The only spacing vocabulary in /app,
   so rhythm stays consistent without anyone inventing margins. */

const SPACE = {
  sm: 'mt-6',
  md: 'mt-12',
  lg: 'mt-24',
  xl: 'mt-40',
} as const;

export function Block({
  children,
  space = 'md',
  className = '',
  ...rest
}: Div & { children: React.ReactNode; space?: keyof typeof SPACE }) {
  return (
    <div className={`${SPACE[space]} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────
   A dashed rule, not a box. Placeholders are lowercase and conversational
   ("a city", never "City"). Focus is shown by the rule going solid and bone.
   (BRD DS-04) */

type FieldProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string;
};

export const Field = React.forwardRef<HTMLTextAreaElement, FieldProps>(
  function Field({ className = '', rows = 3, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`trax-field font-body text-base md:text-lg leading-[1.7] text-trax-white w-full
                    border-b border-dashed border-trax-white/25 pb-2
                    placeholder:text-trax-grey/50 ${className}`}
        {...rest}
      />
    );
  }
);

/* ── Prose ───────────────────────────────────────────────────────────────
   TRAX speaking. The display register. */

export function Say({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-sans font-medium text-trax-white text-xl md:text-2xl leading-[1.35] ${className}`}
    >
      {children}
    </p>
  );
}

/* ── Quote ───────────────────────────────────────────────────────────────
   The rider's own words. Sentence case, unstyled, and the most legible text
   in the product. Never restyled, never set in the display face. (DS-01, DS-07) */

export function Quote({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-body text-trax-white text-lg leading-[1.7] ${className}`}>
      {children}
    </p>
  );
}
