import { REQUESTED_UNIVERSE_WAVE } from './requestedUniverseWave.js';

const MODE_QUADRANTS = Object.freeze({
  Combat: { x: 0, y: 0, width: 0.5, height: 0.5 },
  Melee: { x: 0.5, y: 0, width: 0.5, height: 0.5 },
  RPG: { x: 0, y: 0.5, width: 0.5, height: 0.5 },
  Tactics: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
});

const MODE_PATTERN_SIZE = Object.freeze({
  Combat: [320, 160],
  Melee: [192, 64],
  RPG: [320, 192],
  Tactics: [128, 128]
});

const FULL_TEXTURE_REGION = Object.freeze({ x: 0, y: 0, width: 1, height: 1 });

export const RECENT_UNIVERSE_TEXTURE_ASSETS = Object.freeze(Object.fromEntries(
  REQUESTED_UNIVERSE_WAVE.map(entry => [entry.universe, Object.freeze({
    key: entry.key,
    universe: entry.universe,
    src: `/textures/recent-universes/${entry.key}-openai-atlas.webp`,
    tacticsSrc: `/textures/recent-universes/${entry.key}-openai-tactics-3q.webp`,
    quadrants: MODE_QUADRANTS
  })])
));

const atlasCache = new Map();
const modeCanvasCache = new Map();

const normalizeMode = mode => {
  if (mode === 'Smash' || mode === 'Melee') return 'Melee';
  if (mode === 'Combat' || mode === 'Fighter') return 'Combat';
  if (mode === 'Tactics') return 'Tactics';
  return 'RPG';
};

const getAtlasEntry = (universe, mode) => {
  const asset = RECENT_UNIVERSE_TEXTURE_ASSETS[universe];
  if (!asset || typeof Image === 'undefined') return null;
  const src = mode === 'Tactics' ? asset.tacticsSrc : asset.src;
  const cached = atlasCache.get(src);
  if (cached) return cached;

  const image = new Image();
  const entry = { image, status: 'loading', asset, src };
  image.decoding = 'async';
  image.onload = () => {
    entry.status = 'ready';
  };
  image.onerror = () => {
    entry.status = 'error';
  };
  image.src = src;
  if (image.complete && image.naturalWidth > 0) entry.status = 'ready';
  atlasCache.set(src, entry);
  return entry;
};

export const getRecentUniverseTextureRegion = (universe, mode) => {
  const normalizedMode = normalizeMode(mode);
  const entry = getAtlasEntry(universe, normalizedMode);
  if (!entry || entry.status !== 'ready' || !entry.image.naturalWidth || !entry.image.naturalHeight) return null;
  const quadrant = normalizedMode === 'Tactics' ? FULL_TEXTURE_REGION : MODE_QUADRANTS[normalizedMode];
  return {
    image: entry.image,
    src: entry.src,
    mode: normalizedMode,
    sx: Math.round(entry.image.naturalWidth * quadrant.x),
    sy: Math.round(entry.image.naturalHeight * quadrant.y),
    sw: Math.round(entry.image.naturalWidth * quadrant.width),
    sh: Math.round(entry.image.naturalHeight * quadrant.height)
  };
};

const makeModeCanvas = (universe, mode) => {
  const region = getRecentUniverseTextureRegion(universe, mode);
  if (!region || (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined')) return null;
  const cacheKey = `${region.src}:${region.mode}`;
  const cached = modeCanvasCache.get(cacheKey);
  if (cached) return cached;

  const [width, height] = MODE_PATTERN_SIZE[region.mode];
  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.imageSmoothingEnabled = false;
  context.drawImage(region.image, region.sx, region.sy, region.sw, region.sh, 0, 0, width, height);
  modeCanvasCache.set(cacheKey, canvas);
  return canvas;
};

export const getRecentUniverseTexturePattern = (ctx, universe, mode, repetition = 'repeat') => {
  if (!ctx?.createPattern) return null;
  const canvas = makeModeCanvas(universe, mode);
  return canvas ? ctx.createPattern(canvas, repetition) : null;
};

export const drawRecentUniverseTextureCover = (
  ctx,
  universe,
  mode,
  x,
  y,
  width,
  height,
  alpha = 1,
  fit = 'cover'
) => {
  const region = getRecentUniverseTextureRegion(universe, mode);
  if (!region || width <= 0 || height <= 0) return false;

  let { sx, sy, sw, sh } = region;
  if (fit === 'cover') {
    const sourceRatio = sw / sh;
    const targetRatio = width / height;
    if (sourceRatio > targetRatio) {
      const cropWidth = sh * targetRatio;
      sx += (sw - cropWidth) / 2;
      sw = cropWidth;
    } else if (sourceRatio < targetRatio) {
      const cropHeight = sw / targetRatio;
      sy += (sh - cropHeight) / 2;
      sh = cropHeight;
    }
  }

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(region.image, sx, sy, sw, sh, x, y, width, height);
  ctx.restore();
  return true;
};
