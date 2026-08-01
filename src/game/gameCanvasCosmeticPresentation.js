export const GAME_CANVAS_COSMETIC_PRESENTATION_MODES = Object.freeze([
  'RPG',
  'Tactics',
  'Smash'
]);

const PRESENTATION_ATLAS_KEYS = Object.freeze({
  intro: 'animation',
  ko: 'visual',
  victory: 'animation'
});

const PRESENTATION_DURATION_FALLBACKS = Object.freeze({
  intro: 1500,
  ko: 900,
  victory: 1800
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const supportsGameCanvasCosmeticPresentation = mode => (
  GAME_CANVAS_COSMETIC_PRESENTATION_MODES.includes(mode)
);

export const getGameCanvasCosmeticAtlas = (type, cosmetic) => {
  const atlasKey = PRESENTATION_ATLAS_KEYS[type];
  if (!atlasKey) return null;
  const atlas = cosmetic?.[atlasKey];
  return atlas?.sheet ? atlas : null;
};

export const getGameCanvasCosmeticDurationMs = (type, cosmetic) => {
  const atlasKey = PRESENTATION_ATLAS_KEYS[type];
  const fallback = PRESENTATION_DURATION_FALLBACKS[type] || 1200;
  const requestedDuration = Number(cosmetic?.[atlasKey]?.durationMs);
  return Number.isFinite(requestedDuration)
    ? clamp(requestedDuration, 500, 5000)
    : fallback;
};

export const getGameCanvasCosmeticFrame = (atlas, elapsedMs, durationMs) => {
  const columns = Math.max(1, Math.floor(Number(atlas?.columns) || 1));
  const frames = Math.max(
    1,
    Math.min(columns, Math.floor(Number(atlas?.frames) || columns))
  );
  const safeDuration = Math.max(1, Number(durationMs) || 1);
  const progress = clamp((Number(elapsedMs) || 0) / safeDuration, 0, 1);
  return Math.min(frames - 1, Math.floor(progress * frames));
};

export const getGameCanvasCosmeticFacing = (type, side) => (
  type !== 'ko' && side === 'opponent' ? -1 : 1
);
