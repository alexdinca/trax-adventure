/**
 * The ladder (trax_bible_v_2, §The Collective).
 *
 * Its own module, with no imports, because both the Record and the console
 * render it and neither should be dragging drizzle's pg-core into a client
 * bundle to find out what the four words are.
 *
 * Order matters for display and for nothing else. Nothing in this codebase
 * compares two rungs or computes a distance between them: standing is recorded,
 * never derived (LG-13), and the app does not know what "next" means (LG-02).
 */
export const RUNGS = ['Radar', 'Collective', 'Rider', 'Finisher'] as const;

export type Rung = (typeof RUNGS)[number];
