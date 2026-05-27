const SESSION_KEY = 'trax_session_id';
const EVENT_INDEX_KEY = 'trax_event_index';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function nextEventIndex(): number {
  if (typeof window === 'undefined') return 0;
  const current = parseInt(sessionStorage.getItem(EVENT_INDEX_KEY) ?? '0', 10);
  const next = current + 1;
  sessionStorage.setItem(EVENT_INDEX_KEY, String(next));
  return next;
}

export function getDeviceTier(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

export function getReferrer(): string {
  if (typeof document === 'undefined') return '';
  try {
    const ref = document.referrer;
    if (!ref) return '';
    return new URL(ref).hostname;
  } catch {
    return '';
  }
}

export interface SessionContext {
  sessionId: string;
  eventIndex: number;
  device: 'mobile' | 'desktop';
  referrer: string;
}

export function getSessionContext(): SessionContext {
  return {
    sessionId: getSessionId(),
    eventIndex: nextEventIndex(),
    device: getDeviceTier(),
    referrer: getReferrer(),
  };
}
