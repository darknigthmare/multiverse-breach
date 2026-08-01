import {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST
} from './portalVisualManifest.js';

const normalizeLookupKey = (value) => String(value || '')
  .trim()
  .toLocaleLowerCase('en-US');

export const PORTAL_VISUALS_BY_UNIVERSE = Object.freeze(Object.fromEntries(
  PORTAL_VISUAL_MANIFEST.map(visual => [visual.universe, visual])
));

const PORTAL_VISUAL_LOOKUP = new Map();
PORTAL_VISUAL_MANIFEST.forEach((visual) => {
  PORTAL_VISUAL_LOOKUP.set(normalizeLookupKey(visual.universe), visual);
  PORTAL_VISUAL_LOOKUP.set(normalizeLookupKey(visual.slug), visual);
});

const PORTAL_FRAME_BY_PHASE = Object.freeze({
  sealed: 0,
  charging: 1,
  cutting: 2,
  opening: 2,
  revealing: 3,
  complete: 3
});

const RESOLVED_PORTAL_VISUALS = new Map(PORTAL_VISUAL_MANIFEST.map(visual => [
  visual,
  Object.freeze({ ...visual, isFallback: false })
]));

export const getPortalVisual = (universe) => (
  PORTAL_VISUAL_LOOKUP.get(normalizeLookupKey(universe)) || null
);

export const resolvePortalVisual = (universe) => {
  const visual = getPortalVisual(universe);
  if (visual) return RESOLVED_PORTAL_VISUALS.get(visual);

  return Object.freeze({
    ...PORTAL_FALLBACK_VISUAL,
    isFallback: true,
    requestedUniverse: String(universe || '').trim()
  });
};

export const getPortalFrameForPhase = (phase) => (
  PORTAL_FRAME_BY_PHASE[normalizeLookupKey(phase)] ?? PORTAL_FRAME_BY_PHASE.sealed
);

export {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST
};
