import registry from './generatedStageAssets.json';

const MODE_ALIASES = Object.freeze({
  Combat: 'Combat',
  Fighter: 'Combat',
  Melee: 'Melee',
  Smash: 'Melee',
  RPG: 'RPG',
  Tactics: 'Tactics'
});

const imageCache = new Map();

const getModeEntry = (universe, mode) => {
  const normalizedMode = MODE_ALIASES[mode];
  if (!universe || !normalizedMode) return null;
  return registry.byProfile?.[universe]?.[normalizedMode] || null;
};

const getImageEntry = (src) => {
  if (!src || typeof Image === 'undefined') return null;
  const cached = imageCache.get(src);
  if (cached) return cached;

  const image = new Image();
  const entry = { image, status: 'loading' };
  image.decoding = 'async';
  image.onload = () => { entry.status = 'ready'; };
  image.onerror = () => { entry.status = 'error'; };
  image.src = src;
  if (image.complete && image.naturalWidth > 0) entry.status = 'ready';
  imageCache.set(src, entry);
  return entry;
};

export const getGeneratedStageBackdropSrc = (universe, mode) => (
  getModeEntry(universe, mode)?.assetPath || null
);

export const getGeneratedStageCompanionSrc = (universe, mode, kind) => {
  const entry = getModeEntry(universe, mode);
  if (!entry) return null;
  if (kind === 'backdrop') return entry.backdropPath || entry.assetPath || null;
  if (kind === 'platforms') return entry.platformTexturePath || null;
  if (kind === 'tiles') return entry.tileTexturePath || null;
  return entry.assetPath || null;
};

export const getGeneratedStageTexturePattern = (ctx, universe, mode, kind, repetition = 'repeat') => {
  if (!ctx?.createPattern) return null;
  const src = getGeneratedStageCompanionSrc(universe, mode, kind);
  const entry = getImageEntry(src);
  if (!entry || entry.status !== 'ready' || !entry.image.naturalWidth) return null;
  return ctx.createPattern(entry.image, repetition);
};

export const drawGeneratedStageTextureCover = (
  ctx,
  universe,
  mode,
  x,
  y,
  width,
  height,
  alpha = 1,
  fit = 'cover',
) => {
  const src = getGeneratedStageBackdropSrc(universe, mode);
  const entry = getImageEntry(src);
  if (!entry || entry.status !== 'ready' || !entry.image.naturalWidth || !entry.image.naturalHeight) return false;

  const sourceRatio = entry.image.naturalWidth / entry.image.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = entry.image.naturalWidth;
  let sh = entry.image.naturalHeight;

  if (fit !== 'stretch') {
    if (sourceRatio > targetRatio) {
      sw = entry.image.naturalHeight * targetRatio;
      sx = (entry.image.naturalWidth - sw) / 2;
    } else if (sourceRatio < targetRatio) {
      sh = entry.image.naturalWidth / targetRatio;
      sy = (entry.image.naturalHeight - sh) / 2;
    }
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, sx, sy, sw, sh, x, y, width, height);
  ctx.restore();
  return true;
};

export const GENERATED_STAGE_ASSET_COUNTS = Object.freeze({ ...(registry.counts || {}) });
