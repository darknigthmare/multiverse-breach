/**
 * Share the applied display choice with Canvas presentation. Keep one live
 * MediaQueryList per presentation, rather than creating one on every frame.
 * The root dataset also reflects session-only settings when storage is blocked.
 */
export function createReducedMotionReader({
  view = globalThis.window,
  root = globalThis.document?.documentElement
} = {}) {
  const systemPreference = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
  return () => root?.dataset?.gameMotion === 'reduced' || systemPreference?.matches === true;
}
