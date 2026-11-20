import { registerSourceNativeRendererWave16 } from './combat/sourceNativeRendererWave16.js';
import { getDisciplineSpriteSources } from './disciplineSprites.js';
// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/renderer.js';
import * as dlcHalo from '../../DLC/Halo/data/renderer.js';
import * as dlcAlien from '../../DLC/Alien/data/renderer.js';
import * as dlcPredator from '../../DLC/Predator/data/renderer.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/renderer.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/renderer.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/renderer.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/renderer.js';
import * as dlcStargate from '../../DLC/Stargate/data/renderer.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/renderer.js';
import * as dlcPortal from '../../DLC/Portal/data/renderer.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/renderer.js';
import * as dlcPayday from '../../DLC/Payday/data/renderer.js';
import * as dlcVocaloid from '../../DLC/Vocaloid/data/renderer.js';
import * as dlcYuGiOh from '../../DLC/YuGiOh/data/renderer.js';
import * as dlcGuiltyGear from '../../DLC/GuiltyGear/data/renderer.js';
import * as dlcBlazBlue from '../../DLC/BlazBlue/data/renderer.js';
import * as dlcSlenderMan from '../../DLC/SlenderMan/data/renderer.js';
import * as dlcChucky from '../../DLC/Chucky/data/renderer.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/renderer.js';
import * as dlcMassEffect from '../../DLC/MassEffect/data/renderer.js';
import * as dlcFallout from '../../DLC/Fallout/data/renderer.js';
import * as dlcDoom from '../../DLC/Doom/data/renderer.js';
import * as dlcUnreal from '../../DLC/Unreal/data/renderer.js';
import * as dlcHarryPotter from '../../DLC/HarryPotter/data/renderer.js';
import * as dlcStarWars from '../../DLC/StarWars/data/renderer.js';
import * as dlcLeCinquiemeElement from '../../DLC/LeCinquiemeElement/data/renderer.js';
import * as dlcScaryMovie from '../../DLC/ScaryMovie/data/renderer.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/renderer.js';
import * as dlcRickMorty from '../../DLC/RickMorty/data/renderer.js';
import * as dlcDigitalCircus from '../../DLC/DigitalCircus/data/renderer.js';
import * as dlcDigimon from '../../DLC/Digimon/data/renderer.js';
import * as dlcSaw from '../../DLC/Saw/data/renderer.js';
import * as dlcRosarioVampire from '../../DLC/RosarioVampire/data/renderer.js';
import * as dlcNegima from '../../DLC/Negima/data/renderer.js';
import * as dlcGhostInTheShell from '../../DLC/GhostInTheShell/data/renderer.js';
import * as dlcMadMax from '../../DLC/MadMax/data/renderer.js';
import * as dlcDiscworld from '../../DLC/Discworld/data/renderer.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/renderer.js';
import * as dlcAlien3 from '../../DLC/Alien3/data/renderer.js';
import * as dlcAlienCovenant from '../../DLC/AlienCovenant/data/renderer.js';
import * as dlcThePredator from '../../DLC/ThePredator/data/renderer.js';
import * as dlcPredatorBadlands from '../../DLC/PredatorBadlands/data/renderer.js';
import * as dlcDungeonMeshi from '../../DLC/DungeonMeshi/data/renderer.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/renderer.js';
import * as dlcTheBatmanWhoLaughs from '../../DLC/TheBatmanWhoLaughs/data/renderer.js';
import * as dlcPrometheus from '../../DLC/Prometheus/data/renderer.js';
import * as dlcAlienResurrection from '../../DLC/AlienResurrection/data/renderer.js';
import * as dlcPredators from '../../DLC/Predators/data/renderer.js';
import * as dlcPredatorKillerOfKillers from '../../DLC/PredatorKillerOfKillers/data/renderer.js';
import * as dlcAlienVsPredator from '../../DLC/AlienVsPredator/data/renderer.js';
import * as dlcNoob from '../../DLC/Noob/data/renderer.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/renderer.js';
import * as dlcDaftPunk from '../../DLC/DaftPunk/data/renderer.js';
import * as dlcJokerNew52 from '../../DLC/JokerNew52/data/renderer.js';
import * as dlcAliens from '../../DLC/Aliens/data/renderer.js';
import * as dlcAlienRomulus from '../../DLC/AlienRomulus/data/renderer.js';
import * as dlcPredator2 from '../../DLC/Predator2/data/renderer.js';
import * as dlcPrey from '../../DLC/Prey/data/renderer.js';
import * as dlcAliensVsPredatorRequiem from '../../DLC/AliensVsPredatorRequiem/data/renderer.js';
import * as dlcRammstein from '../../DLC/Rammstein/data/renderer.js';
import * as dlcRobZombie from '../../DLC/RobZombie/data/renderer.js';
import * as dlcOliverTree from '../../DLC/OliverTree/data/renderer.js';

import { drawWardrobeEffect } from './wardrobeEffects.js';
import { drawFallbackEnergyBlades } from './energyBladeFallback.js';
import { getQuarantinedCanonSprite } from './runtimeSpriteQuarantine.js';
import { getReviewedDcP0Bust } from './historicalDcP0SpriteQuarantine.js';
import { getStarfireFighterCastCenter, getStarfireFighterCastFrame } from './combat/starfireFighterCast.js';
import { drawPachakutiFallback } from './pachakutiWorldBossArt.js';
import { drawTwelveBellJudgesMotion } from './twelveBellJudgesMotion.js';
import { drawOriginalStaticBossMotion } from './originalStaticBossMotion.js';

// Pixel Art Renderer and Particle System for Multiverse Breach

import { EXPANDED_DECOR_THEMES } from './expandedUniverses';
import { FEATURED_BACKDROPS } from './featuredUniversePacks';
import { getGeneratedStageBackdropSrc } from './generatedStageAssets';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import { drawRecentUniverseTextureCover } from './recentUniverseTextureAssets';
import { renderStageAtmosphere } from './melee/stageAtmosphere';
import { getCharacterAnimationFrame, resolveCharacterAnimationAsset } from './combat/characterAnimationCatalog';
import { getSourceRuntimeViewWave16 } from './combat/sourceCombatRuntimeWave16.js';
import { getSourceNativeSupportViewWave17 } from './combat/sourceMechanicsWave17.js';
import { drawSourceCaptureEnemyWave17 } from './combat/sourceCaptureEnemyCatalogWave17.js';
import { getJadeGyrodiskActionFrameWave17 } from './combat/jadeGyrodiskActionWave17.js';
import { registerNativeProjectileRegionRendererWave17 } from './combat/nativeProjectileRegionWave17.js';
import { sampleCharacterSuperMotion } from './combat/characterSuperVisuals';
import { resolveCombatHeroSpriteActor } from './combatIdentity.js';
import { getCharacterFormFrame } from './combat/characterFormState';
import { resolveCharacterFormAsset } from './combat/characterFormCatalog';
import { drawP0CanonParticle } from './canonP0ParticleRenderer.js';
import {
  getEnemySpriteSheetSources,
  getHeroMeleeAnimationFrame,
  getHeroMeleeSpriteSheetSrcs,
  getHeroSpriteSheetSources,
  getReviewedQuarantinedHeroSprite,
  getItemSpriteSrc,
  getSpriteFrameForLayout,
  getSpriteSheetLayout,
  MIRELLE_COMPLETE_SPRITES
} from './spriteAssets';

const spriteSheetCache = new Map();

const getCachedSpriteSheet = (src) => {
  if (!src || typeof Image === 'undefined') return null;
  const cached = spriteSheetCache.get(src);
  if (cached) return cached;

  const image = new Image();
  const entry = {
    image,
    status: 'loading',
    pendingDraws: new Map()
  };
  image.onload = () => {
    entry.status = 'ready';
    const callbacks = Array.from(entry.pendingDraws.values());
    entry.pendingDraws.clear();
    const runCallbacks = () => callbacks.forEach(redraw => redraw());
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(runCallbacks);
    } else {
      runCallbacks();
    }
  };
  image.onerror = () => {
    entry.status = 'error';
    const callbacks = Array.from(entry.pendingDraws.values());
    entry.pendingDraws.clear();
    callbacks.forEach(redraw => redraw());
  };
  image.src = src;
  if (image.complete && image.naturalWidth > 0) {
    entry.status = 'ready';
  }
  spriteSheetCache.set(src, entry);
  return entry;
};

const getFirstAvailableSpriteSheet = sources => {
  const candidates = Array.isArray(sources) ? sources : [sources];
  for (const src of candidates) {
    const entry = getCachedSpriteSheet(src);
    if (entry && entry.status !== 'error') return entry;
  }
  return null;
};

const queueSpriteSheetRedraw = (entry, ctx, draw) => {
  if (!entry?.pendingDraws || !ctx?.canvas) return;
  entry.pendingDraws.set(ctx.canvas, () => {
    if (typeof document !== 'undefined' && ctx.canvas && !ctx.canvas.isConnected) return;
    draw();
  });
};

export const preloadSpriteSheetSrcs = (srcs = []) => {
  srcs.forEach(src => getCachedSpriteSheet(src));
};

export const preloadMeleeSpriteSheetSrcs = characterOrId => {
  const srcs = getHeroMeleeSpriteSheetSrcs(characterOrId);
  preloadSpriteSheetSrcs(srcs);
  return srcs;
};

export const drawCosmeticAtlasFrame = (
  ctx,
  atlas,
  frameIndex,
  x,
  y,
  width,
  height,
  {
    alpha = 1,
    facing = 1,
    glowColor = '#39c5bb',
    glowBlur = 18,
    redrawWhenReady = true
  } = {}
) => {
  const src = atlas?.sheet || atlas?.image;
  const entry = getCachedSpriteSheet(src);
  if (!entry || entry.status === 'error') return false;
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    if (redrawWhenReady) queueSpriteSheetRedraw(entry, ctx, () => {
      drawCosmeticAtlasFrame(
        ctx,
        atlas,
        frameIndex,
        x,
        y,
        width,
        height,
        { alpha, facing, glowColor, glowBlur, redrawWhenReady }
      );
    });
    return false;
  }

  const columns = Math.max(1, Math.floor(Number(atlas.columns) || 1));
  const rows = Math.max(1, Math.floor(Number(atlas.rows) || 1));
  const frames = Math.max(1, Math.min(columns, Math.floor(Number(atlas.frames) || columns)));
  const column = Math.max(0, Math.min(frames - 1, Math.floor(Number(frameIndex) || 0)));
  const row = Math.max(0, Math.min(rows - 1, Math.floor(Number(atlas.row) || 0)));
  const sourceWidth = entry.image.naturalWidth / columns;
  const sourceHeight = entry.image.naturalHeight / rows;
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  ctx.save();
  ctx.globalAlpha *= Math.max(0, Math.min(1, Number(alpha) || 0));
  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = Math.max(0, Number(glowBlur) || 0);
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(facing < 0 ? -1 : 1, 1);
  ctx.drawImage(
    entry.image,
    column * sourceWidth,
    row * sourceHeight,
    sourceWidth,
    sourceHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );
  ctx.restore();
  return true;
};

export function isStarfireFighterCastAtlasReady(asset) {
  const entry = getCachedSpriteSheet(asset?.sheet);
  return entry?.status === 'ready' && entry.image.complete
    && entry.image.naturalWidth === asset.width && entry.image.naturalHeight === asset.height;
}

export function drawStarfireFighterCast(ctx, fighter, height, reducedMotion) {
  const frame = getStarfireFighterCastFrame(fighter, reducedMotion);
  if (!frame || !isStarfireFighterCastAtlasReady(frame.asset)) return false;
  const { asset, col, row, clipAtSourceX } = frame;
  const facing = fighter.action.facing;
  const centerY = getStarfireFighterCastCenter(asset, fighter.y, height);
  const scale = height / asset.frameHeight;
  const width = asset.frameWidth * scale;
  ctx.save();
  if (clipAtSourceX) {
    const bodyWidth = clipAtSourceX * scale;
    const left = Math.round(fighter.x) + (facing < 0 ? width / 2 - bodyWidth : -width / 2);
    ctx.beginPath();
    ctx.rect(left, Math.round(centerY) - height / 2, bodyWidth, height);
    ctx.clip();
  }
  const drawn = drawCosmeticAtlasFrame(ctx, { ...asset, row }, col, fighter.x, centerY, width, height,
    { facing, glowBlur: 0, redrawWhenReady: false });
  ctx.restore();
  return drawn;
}

export const drawItemIcon = (ctx, x, y, item, animTime, targetSize = 36) => {
  const entry = getCachedSpriteSheet(getItemSpriteSrc(item));
  if (!entry || entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    return false;
  }

  const pulse = 1 + Math.sin(animTime * 0.08 + x) * 0.08;
  const size = targetSize * pulse;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, -size / 2, -size / 2, size, size);
  ctx.restore();
  return true;
};

const drawQuarantinedCombatantBust = (ctx, x, y, width, height) => {
  // A neutral, deliberately anonymous locator replaces known-inaccurate
  // character art. The original PNG remains archived for an admin art review.
  const centerX = x + width / 2;
  const centerY = y + height * 0.38;
  const radius = Math.max(3, Math.min(width, height) * 0.13);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = '#15252d';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#526974';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(centerX - radius * 1.5, centerY + radius, radius * 3, height * 0.4);
  ctx.fillStyle = '#f6d18c';
  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(8, Math.min(11, Math.round(height / 9)))}px monospace`;
  ctx.fillText('ART PENDING', centerX, y + height - 7, Math.max(1, width - 6));
  ctx.restore();
  return true;
};

export const drawCombatantBust = (ctx, x, y, width, height, entity, kind = 'hero') => {
  const quarantine = kind === 'hero' ? getQuarantinedCanonSprite(entity) : null;
  const reviewedSprite = quarantine ? getReviewedQuarantinedHeroSprite(entity) : null;
  const reviewedBust = getReviewedDcP0Bust(entity, quarantine);
  if (quarantine && !reviewedSprite && !reviewedBust) {
    return drawQuarantinedCombatantBust(ctx, x, y, width, height);
  }
  const sources = reviewedBust ? [reviewedBust.sheet] : kind === 'hero'
    ? getHeroSpriteSheetSources(entity, 'tactics')
    : getEnemySpriteSheetSources(entity);
  const entry = getFirstAvailableSpriteSheet(sources);
  if (!entry) return reviewedBust ? drawQuarantinedCombatantBust(ctx, x, y, width, height) : false;
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => {
      drawCombatantBust(ctx, x, y, width, height, entity, kind);
    });
    return reviewedBust ? drawQuarantinedCombatantBust(ctx, x, y, width, height) : false;
  }
  if (reviewedBust && (entry.image.naturalWidth !== reviewedBust.width || entry.image.naturalHeight !== reviewedBust.height)) {
    return drawQuarantinedCombatantBust(ctx, x, y, width, height);
  }

  const layout = entity.sourceSpriteLayoutWave16 || getSpriteSheetLayout(entry.image.currentSrc || entry.image.src);
  const frameWidth = entry.image.naturalWidth / layout.columns;
  const frameHeight = entry.image.naturalHeight / layout.rows;
  const frame = getSpriteFrameForLayout('idle', 0, layout);
  const trim = frame.trim || {};
  const reviewedPortrait = reviewedBust?.crop || reviewedSprite?.portrait;
  const sourceX = reviewedBust?.crop.x ?? (frame.col * frameWidth + (reviewedPortrait?.x ?? trim.left ?? 0));
  const sourceY = reviewedBust?.crop.y ?? (frame.row * frameHeight + (reviewedPortrait?.y ?? trim.top ?? 0));
  const sourceW = reviewedPortrait?.width ?? Math.max(1, frameWidth - (trim.left || 0) - (trim.right || 0));
  const trimmedH = Math.max(1, frameHeight - (trim.top || 0) - (trim.bottom || 0));
  const sourceH = reviewedPortrait?.height ?? Math.max(1, layout.fullBodyPortrait ? trimmedH : trimmedH * 0.68);
  const scale = reviewedPortrait || layout.fullBodyPortrait
    ? Math.min(width / sourceW, height / sourceH)
    : Math.max(width / sourceW, height / sourceH);
  const drawW = sourceW * scale;
  const drawH = sourceH * scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.scale(entity?.facing || (kind === 'hero' ? 1 : -1), 1);
  ctx.imageSmoothingEnabled = reviewedBust?.smooth === true;
  ctx.drawImage(
    entry.image,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    -drawW / 2,
    -drawH / 2,
    drawW,
    drawH
  );
  ctx.restore();
  return true;
};

const drawMirelleItemVfx = (ctx, x, y, entity, animTime, facing, targetHeight, context, redrawWhenResolved) => {
  if (entity?.id !== 'arca_mirelle' || !['attack', 'defense', 'hit'].includes(entity.state)) return;
  const entry = getCachedSpriteSheet(MIRELLE_COMPLETE_SPRITES.itemsVfx);
  if (!entry || entry.status === 'error') return;
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => redrawWhenResolved?.());
    return;
  }
  const frameMap = {
    attack: { row: 1, colBase: 0, width: 0.82, alpha: 0.72 },
    defense: { row: 3, colBase: 0, width: 0.7, alpha: 0.64 },
    hit: { row: 4, colBase: 0, width: 0.76, alpha: 0.78 }
  };
  const spec = frameMap[entity.state];
  const columns = 4;
  const rows = 7;
  const frameW = entry.image.naturalWidth / columns;
  const frameH = entry.image.naturalHeight / rows;
  const col = (spec.colBase + Math.floor(animTime / 8)) % columns;
  const drawH = targetHeight * (context === 'nexus' ? 0.64 : 0.54);
  const drawW = drawH * spec.width;
  ctx.save();
  ctx.globalAlpha = spec.alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x + facing * targetHeight * 0.22, y - targetHeight * 0.52);
  ctx.scale(facing, 1);
  ctx.drawImage(entry.image, col * frameW, spec.row * frameH, frameW, frameH, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
};

const preloadedMeleeCharacters = new Set();
const meleeAnimationClocks = new WeakMap();

const getMeleeElapsedMs = (entity, animTime) => {
  if (entity?.stateElapsed != null) {
    const stateElapsed = Number(entity.stateElapsed);
    if (Number.isFinite(stateElapsed)) return Math.max(0, stateElapsed) * 1000;
  }

  const timelineFrame = Math.max(0, Number(animTime) || 0);
  if (!entity || typeof entity !== 'object') return timelineFrame * (1000 / 60);
  // RPG opponents and super views are fresh cosmetic projections. Their
  // animation clock belongs to the stable combat actor, not to each new view.
  const clockSource = entity.animationClockSource && typeof entity.animationClockSource === 'object' ? entity.animationClockSource : entity;
  const stateToken = `${entity.state || 'idle'}:${entity.stateNonce || 0}`;
  const clock = meleeAnimationClocks.get(clockSource);
  if (!clock || clock.stateToken !== stateToken || timelineFrame < clock.startedAt) {
    meleeAnimationClocks.set(clockSource, { stateToken, startedAt: timelineFrame });
    return 0;
  }
  return (timelineFrame - clock.startedAt) * (1000 / 60);
};

const getTrimValue = (trim, side) => Math.max(0, Number(trim?.[side]) || 0);
const getAnchorValue = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const drawMeleeManifestSpriteSheet = (
  ctx,
  x,
  y,
  entity,
  animTime,
  facing,
  targetHeight,
  redrawWhenResolved
) => {
  const frame = getHeroMeleeAnimationFrame(entity, getMeleeElapsedMs(entity, animTime));
  if (!frame?.manifest || !frame.animation?.sheet) return 'missing';

  const { manifest } = frame;
  if (typeof Image !== 'undefined' && !preloadedMeleeCharacters.has(manifest.characterId)) {
    preloadMeleeSpriteSheetSrcs(entity);
    preloadedMeleeCharacters.add(manifest.characterId);
  }

  const entry = getCachedSpriteSheet(frame.animation.sheet);
  if (!entry || entry.status === 'error') return 'missing';
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => redrawWhenResolved?.());
    return 'loading';
  }

  const cellWidth = Math.max(1, Number(manifest.cellWidth) || 1);
  const cellHeight = Math.max(1, Number(manifest.cellHeight) || 1);
  const trim = frame.trim || {};
  const trimLeft = getTrimValue(trim, 'left');
  const trimRight = getTrimValue(trim, 'right');
  const trimTop = getTrimValue(trim, 'top');
  const trimBottom = getTrimValue(trim, 'bottom');
  const sourceX = frame.col * cellWidth + trimLeft;
  const sourceY = frame.row * cellHeight + trimTop;
  const sourceW = Math.max(1, cellWidth - trimLeft - trimRight);
  const sourceH = Math.max(1, cellHeight - trimTop - trimBottom);
  const renderScale = Math.max(0.5, Math.min(3, Number(frame.animation.renderScale) || 1));
  const scale = targetHeight / cellHeight * renderScale;
  const drawW = sourceW * scale;
  const drawH = sourceH * scale;
  const anchorX = getAnchorValue(frame.anchor?.x, 0.5) * cellWidth - trimLeft;
  const anchorY = getAnchorValue(frame.anchor?.y, frame.anchor?.baseline === 'ledgeGrip' ? 0.72 : 0.94) * cellHeight - trimTop;
  const visualLedge = entity.ledge || (entity.state === 'ledgeClimb' ? entity.meleeLedgeVisual : null);
  const gripping = frame.anchor?.attachToLedge && visualLedge?.platform;
  const effectiveFacing = gripping ? visualLedge.side === 'left' ? 1 : -1 : facing;
  const flipX = manifest.facingMode === 'flip' && effectiveFacing < 0 ? -1 : 1;
  const originX = gripping ? visualLedge.side === 'left' ? visualLedge.platform.x1 : visualLedge.platform.x2 : x;
  const originY = gripping ? visualLedge.platform.y : y;

  ctx.save();
  ctx.translate(originX, originY);
  ctx.scale(flipX, 1);
  ctx.filter = entity?.spriteFilter || 'none';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    entry.image,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    -anchorX * scale,
    -anchorY * scale,
    drawW,
    drawH
  );
  ctx.restore();
  return 'drawn';
};

/** World rectangle of the generated hero sheet already selected for drawing.
 * This only reads the cache: an unseen/loading first candidate must not cause a
 * load or expose a later fallback. Procedural art and effects have separate bounds. */
export const getGeneratedSpriteBounds = (x, y, entity, animTime, targetHeight = 72, context = 'auto') => {
  if (typeof Image === 'undefined' || ![x, y, targetHeight].every(Number.isFinite) || targetHeight <= 0) return null;
  let entry = null;
  for (const src of getHeroSpriteSheetSources(entity, context)) {
    const candidate = spriteSheetCache.get(src);
    if (!candidate) return null;
    if (candidate.status === 'error') continue;
    entry = candidate;
    break;
  }
  if (!entry || entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) return null;

  const layout = getSpriteSheetLayout(entry.image.currentSrc || entry.image.src);
  const frame = getSpriteFrameForLayout(entity.state, animTime, layout);
  const trim = frame.trim || {};
  const sourceW = Math.max(1, entry.image.naturalWidth / layout.columns - (trim.left || 0) - (trim.right || 0));
  const sourceH = Math.max(1, entry.image.naturalHeight / layout.rows - (trim.top || 0) - (trim.bottom || 0));
  const scale = targetHeight / sourceH;
  const width = sourceW * scale;
  return { x: x - width / 2, y: y - targetHeight + 24 * scale, width, height: targetHeight };
};

const drawGeneratedSpriteSheet = (ctx, x, y, entity, animTime, facing, targetHeight, srcGetter, redrawWhenResolved, context = 'auto') => {
  const entry = getFirstAvailableSpriteSheet(srcGetter(entity, context));
  if (!entry) return 'missing';
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => {
      redrawWhenResolved?.();
    });
    return 'loading';
  }

  const spriteSource = entry.image.currentSrc || entry.image.src;
  const layout = entity.sourceSpriteLayoutWave16 || getSpriteSheetLayout(spriteSource);
  const frameWidth = entry.image.naturalWidth / layout.columns;
  const frameHeight = entry.image.naturalHeight / layout.rows;
  const frame = getSpriteFrameForLayout(entity.state, context === 'melee' ? getMeleeElapsedMs(entity, animTime) * 60 / 1000 : animTime, layout);
  const pose = entity.presentationFrame;
  const matchesPoseSheet = !pose?.sheet || (pose.columns === layout.columns && pose.rows === layout.rows
    && new URL(spriteSource, 'https://sprite.invalid').pathname === pose.sheet);
  if (matchesPoseSheet && Number.isFinite(pose?.row) && Number.isFinite(pose?.col)) {
    // Blocked native artwork may explicitly reuse an older harmless pose.
    // Preserve that declared row/column instead of exposing an unrelated prop.
    if (!layout.adaptedLegacyFallback) frame.row = Math.max(0, Math.min(layout.rows - 1, Math.floor(pose.row)));
    if (!Number.isInteger(layout.fixedColumn) && !layout.columnsByRow?.[frame.row]?.length) {
      frame.col = Math.max(0, Math.min(layout.columns - 1, Math.floor(pose.col)));
    }
    frame.trim = layout?.trimByState?.[entity.state] || layout?.trimByRow?.[frame.row] || layout?.trim || null;
  }
  const trim = frame.trim || {};
  const sourceX = frame.col * frameWidth + (trim.left || 0);
  const sourceY = frame.row * frameHeight + (trim.top || 0);
  const sourceW = Math.max(1, frameWidth - (trim.left || 0) - (trim.right || 0));
  const sourceH = Math.max(1, frameHeight - (trim.top || 0) - (trim.bottom || 0));
  const statureScale = Math.max(0.5, Math.min(layout.sourceBtRenderScaleLimitWave16 || layout.sourceHakumenRenderScaleLimitWave16 || 3, Number(layout.renderScaleByRow?.[frame.row]) || 1));
  const scale = targetHeight / sourceH * statureScale;
  const drawW = sourceW * scale;
  const drawH = sourceH * scale;
  const baseline = Number.isFinite(layout.baseline) ? layout.baseline - (trim.top || 0) : sourceH - 24;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.filter = entity?.spriteFilter || 'none';
  ctx.imageSmoothingEnabled = false;
  if (sourceX !== 0 || sourceY !== 0 || sourceW !== entry.image.naturalWidth || sourceH !== entry.image.naturalHeight
    || !(drawTwelveBellJudgesMotion(ctx, entity, entry.image, animTime, -drawW / 2, -baseline * scale, drawW, drawH)
      || drawOriginalStaticBossMotion(ctx, entity, entry.image, animTime, -drawW / 2, -baseline * scale, drawW, drawH))) {
    ctx.drawImage(entry.image, sourceX, sourceY, sourceW, sourceH, -drawW / 2, -baseline * scale, drawW, drawH);
  }
  ctx.restore();
  drawMirelleItemVfx(ctx, x, y, entity, animTime, facing, targetHeight, context, redrawWhenResolved);
  return 'drawn';
};

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  add(x, y, vx, vy, color, size, life, type = 'spark', text = '') {
    this.particles.push({
      x, y, vx, vy, color, size, maxLife: life, life, type, text,
      alpha: 1
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.type === 'text') {
        p.vy *= 0.96; // slow down vertical rise
      } else if (p.type === 'gravity') {
        p.vy += 0.2; // apply gravity
      }

      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      if (drawP0CanonParticle(ctx, p)) return;
      if (p.type === 'text') {
        ctx.font = 'bold 12px "Share Tech Mono", monospace';
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === 'laser_line') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 10, p.y + p.vy * 10);
        ctx.stroke();
      } else if (p.type === 'banana') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(3, p.size / 3);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x - p.size / 2, p.y - p.size / 3);
        ctx.quadraticCurveTo(p.x, p.y + p.size / 2, p.x + p.size / 2, p.y - p.size / 3);
        ctx.stroke();
        ctx.lineCap = 'butt';
      } else if (p.type === 'music') {
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px monospace`;
        ctx.fillText('♫', p.x, p.y);
      } else if (p.type === 'glitch') {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size * (Math.random() + 0.5), p.size * (Math.random() + 0.5));
      } else {
        // Star or square spark
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }
    });
    ctx.restore();
  }
}

const drawDedicatedCharacterAnimation = (ctx, x, y, character, animTime, facing, targetHeight) => {
  const primaryAsset = resolveCharacterAnimationAsset(character);
  if (!primaryAsset) return false;
  const formAsset = resolveCharacterFormAsset(character);
  if (formAsset) getCachedSpriteSheet(formAsset.sheet);
  const frame = getCharacterAnimationFrame(character, { elapsedSeconds: getMeleeElapsedMs(character, animTime) / 1000 });
  const asset = frame?.asset || primaryAsset;
  const entry = getCachedSpriteSheet(asset.sheet);
  if (!frame || entry?.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth <= 0) return false;
  const sourceWidth = entry.image.naturalWidth / asset.columns;
  const sourceHeight = entry.image.naturalHeight / asset.rows;
  // Large weapons and effects may require smaller source normalization.
  // Restore measured body stature around the feet while drawing the full cell.
  const sourceBt = asset.heroId === 'bt_7274_tf2' && asset.sheet.includes('wave16-part-b');
  const statureScale = Math.max(0.5, Math.min(sourceBt ? 8 : 3, Number(asset.normalization?.rows?.[frame.row]?.renderScale) || 1));
  const scale = targetHeight / sourceHeight * statureScale;
  const baseline = Number(asset.normalization?.baseline) || sourceHeight * 0.953125;
  const motion = sampleCharacterSuperMotion({ heroId: asset.heroId, universe: asset.universe, phase: frame.phase, progress: frame.progress, impactProgress: frame.impactProgress, height: targetHeight });
  ctx.save();
  ctx.translate(x + motion.x * facing, y + motion.y);
  ctx.scale(facing < 0 ? -1 : 1, 1);
  ctx.filter = character.spriteFilter || 'none';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, frame.col * sourceWidth, frame.row * sourceHeight, sourceWidth, sourceHeight,
    -sourceWidth * scale / 2, -baseline * scale, sourceWidth * scale, sourceHeight * scale);
  ctx.restore();
  return true;
};

const drawCharacterForm = (ctx, x, y, character, animTime, facing, targetHeight, redraw) => {
  const frame = getCharacterFormFrame(character, { elapsedSeconds: getMeleeElapsedMs(character, animTime) / 1000 });
  if (!frame) return 'missing';
  const asset = resolveCharacterFormAsset(character, frame.id);
  const entry = asset && getCachedSpriteSheet(asset.sheet);
  if (!entry || entry.status === 'error') return 'missing';
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth <= 0) {
    queueSpriteSheetRedraw(entry, ctx, redraw);
    return 'loading';
  }
  const width = entry.image.naturalWidth / asset.columns, height = entry.image.naturalHeight / asset.rows;
  const scale = targetHeight / height, baseline = Number(asset.normalization?.baseline) || height * 0.953125;
  ctx.save(); ctx.translate(x, y); ctx.scale(facing < 0 ? -1 : 1, 1);
  ctx.filter = character.spriteFilter || 'none'; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, frame.col * width, frame.row * height, width, height, -width * scale / 2, -baseline * scale, width * scale, height * scale);
  ctx.restore();
  return 'drawn';
};

const drawJadeGyrodiskSpriteWave17 = (ctx, x, y, character, animTime, facing, targetHeight, context) => {
  const action = character?.action || character?.rpgGyrodiskActionWave17 || character?.tacticsGyrodiskActionWave17;
  const frame = getJadeGyrodiskActionFrameWave17(character, action);
  if (!frame) return false;
  const entry = getCachedSpriteSheet(frame.asset.sheet);
  if (!entry || entry.status === 'error') return false;
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth <= 0) {
    queueSpriteSheetRedraw(entry, ctx, () => drawPixelSprite(ctx, x, y, character, animTime, facing, targetHeight, context));
    return true;
  }
  const sourceWidth = entry.image.naturalWidth / frame.asset.columns;
  const sourceHeight = entry.image.naturalHeight / frame.asset.rows;
  const scale = targetHeight / sourceHeight * Math.max(.5, Math.min(3, frame.renderScale));
  const baseline = frame.asset.normalization?.baseline || 244;
  ctx.save(); ctx.translate(x, y); ctx.scale(facing < 0 ? -1 : 1, 1);
  ctx.filter = character.spriteFilter || 'none'; ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, frame.col * sourceWidth, frame.row * sourceHeight, sourceWidth, sourceHeight,
    -sourceWidth * scale / 2, -baseline * scale, sourceWidth * scale, sourceHeight * scale);
  ctx.restore();
  return true;
};

export const drawPixelSprite = (ctx, x, y, character, animTime, facing = 1, targetHeight = 72, context = 'auto') => {
  character = getSourceNativeSupportViewWave17(getSourceRuntimeViewWave16(character));
  if (character.sourceMedicBeamPoseWave17) facing = character.facing;
  if (drawSourceCaptureEnemyWave17(ctx, x, y, character, animTime, facing, targetHeight)) return;
  drawWardrobeEffect(ctx, x, y, character, targetHeight);
  const quarantinedArt = getQuarantinedCanonSprite(character);
  // A validated delivered costume owns its body and fallback sources. Ground
  // effects and legacy palette choices still retain the native action artwork.
  const selectedCostume = getDisciplineSpriteSources(character).length > 0;
  if (!selectedCostume && !quarantinedArt) {
    if (drawJadeGyrodiskSpriteWave17(ctx, x, y, character, animTime, facing, targetHeight, context)) return;
    if (character?.sourceEnemyId === 'oddworld_slig' && character.universe === 'Oddworld') {
      drawPixelEnemy(ctx, x, y, character, animTime, facing, targetHeight);
      return;
    }
    if (drawCharacterForm(ctx, x, y, character, animTime, facing, targetHeight,
      () => drawPixelSprite(ctx, x, y, character, animTime, facing, targetHeight, context)) !== 'missing') return;
    const explicitPresentation = character.presentationPhase || character.action?.superProfile || character.action?.type === 'super';
    const hasCoreMeleeAnimation = context === 'melee' && getHeroMeleeAnimationFrame(character, getMeleeElapsedMs(character, animTime));
    if ((!hasCoreMeleeAnimation || explicitPresentation) && drawDedicatedCharacterAnimation(ctx, x, y, character, animTime, facing, targetHeight)) return;
    if (context === 'melee') {
      const meleeManifestStatus = drawMeleeManifestSpriteSheet(ctx, x, y, character, animTime, facing, targetHeight, () => {
        drawPixelSprite(ctx, x, y, character, animTime, facing, targetHeight, context);
      });
      if (meleeManifestStatus !== 'missing') return;
    }
  }

  // Suppress the display of specifically inspected incorrect sheets while
  // preserving their asset records, authoring history and gameplay identities.
  const generatedStatus = quarantinedArt && !getReviewedQuarantinedHeroSprite(character) ? 'missing' : drawGeneratedSpriteSheet(ctx, x, y, character, animTime, facing, targetHeight, getHeroSpriteSheetSources, () => {
    drawPixelSprite(ctx, x, y, character, animTime, facing, targetHeight, context);
  }, context);
  if (generatedStatus !== 'missing') {
    return;
  }
  if (quarantinedArt?.actorId) {
    const size = targetHeight * 0.75;
    drawQuarantinedCombatantBust(ctx, x - size / 2, y - size, size, size);
    return;
  }

  const { primaryColor, secondaryColor, weaponType, weaponColor, id, state } = character;
  const scaleFactor = targetHeight / 72;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scaleFactor, scaleFactor);

  // Apply visual effect based on state
  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isDefending = state === 'defense';
  let isAttacking = state === 'attack' || state === 'special';

  if (isDead) {
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-20, 10); // shift down on ground
  }

  // Animation offsets
  let bounce = 0;
  let legSwing = 0;
  let armSwing = 0;

  if (state === 'run') {
    bounce = Math.sin(animTime * 0.2) * 2;
    legSwing = Math.sin(animTime * 0.2) * 5;
    armSwing = -Math.sin(animTime * 0.2) * 6;
  } else if (state === 'idle') {
    bounce = Math.sin(animTime * 0.05) * 1;
  }

  // Draw Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Legs (Left & Right)
  ctx.fillStyle = primaryColor;
  if (isDead) {
    ctx.fillRect(-6, 8, 4, 8);
    ctx.fillRect(2, 8, 4, 8);
  } else {
    // Leg 1
    ctx.fillRect(-6, 6 + bounce, 4, 10 + legSwing);
    // Leg 2
    ctx.fillRect(2, 6 + bounce, 4, 10 - legSwing);
  }

  // Draw Torso/Body
  ctx.fillStyle = primaryColor;
  ctx.fillRect(-8, -12 + bounce, 16, 18);

  // Draw Backpack/HEV unit/details depending on character ID
  if (id === 'masterchief') {
    // Spartan Green backpack
    ctx.fillStyle = '#1c3b12';
    ctx.fillRect(-11, -10 + bounce, 3, 12);
  } else if (id === 'freeman') {
    // Orange neck collar/HEV pack
    ctx.fillStyle = '#e65c00';
    ctx.fillRect(-10, -11 + bounce, 2, 8);
  } else if (id === 'shepard') {
    // Tech strip on chest
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(-6, -8 + bounce, 12, 2);
  } else if (id === 'miku') {
    // Vocaloid tie
    ctx.fillStyle = '#e0007a';
    ctx.fillRect(-1, -6 + bounce, 2, 8);
  }

  // Draw Head / Helmet
  if (id === 'pyramidhead') {
    // Huge red metal pyramid instead of head
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(-10, -12 + bounce);
    ctx.lineTo(10, -12 + bounce);
    ctx.lineTo(-4, -34 + bounce);
    ctx.closePath();
    ctx.fill();
    // Metal rust lines
    ctx.fillStyle = '#3a0202';
    ctx.fillRect(-2, -22 + bounce, 4, 8);
  } else {
    // Standard Head
    ctx.fillStyle = (id === 'miku') ? '#ffe0bd' : (id === 'neo') ? '#ffe0bd' : primaryColor;
    ctx.fillRect(-6, -24 + bounce, 12, 12);

    // Visors / Hair / Helmets
    if (id === 'masterchief') {
      // Golden orange visor
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(1, -21 + bounce, 5, 3);
      // Helmet line
      ctx.fillStyle = '#1e3c14';
      ctx.fillRect(-6, -25 + bounce, 12, 2);
    } else if (id === 'freeman') {
      // Black glasses and beard
      ctx.fillStyle = '#331a00';
      ctx.fillRect(1, -21 + bounce, 5, 2); // glasses
      ctx.fillRect(-2, -15 + bounce, 8, 3); // goatee
    } else if (id === 'miku') {
      // Miku twin tails
      ctx.fillStyle = primaryColor;
      // Left tail
      ctx.fillRect(-12, -24 + bounce, 5, 22 + Math.sin(animTime * 0.1) * 3);
      // Right tail
      ctx.fillRect(7, -24 + bounce, 5, 22 - Math.sin(animTime * 0.1) * 3);
      // Hair ties
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(-9, -25 + bounce, 3, 2);
      ctx.fillRect(6, -25 + bounce, 3, 2);
    } else if (id === 'valtweller') {
      // Yellow Vault Boy hair
      ctx.fillStyle = primaryColor;
      ctx.fillRect(-7, -26 + bounce, 14, 3);
      ctx.fillRect(-2, -23 + bounce, 9, 3);
    } else if (id === 'marcus') {
      // Dark grey bandana
      ctx.fillStyle = '#111111';
      ctx.fillRect(-7, -25 + bounce, 14, 3);
    } else if (id === 'snake') {
      // Grey bandana with ribbon extending back
      ctx.fillStyle = '#111111';
      ctx.fillRect(-7, -23 + bounce, 14, 2);
      ctx.fillRect(-10, -22 + bounce, 4, 2); // bandana tail
    } else if (id === 'neo') {
      // Sunglasses
      ctx.fillStyle = '#000';
      ctx.fillRect(0, -21 + bounce, 6, 2);
      // Short black hair
      ctx.fillStyle = '#111';
      ctx.fillRect(-7, -26 + bounce, 14, 3);
    } else if (id === 'dallas') {
      // White clown mask with red/blue stripes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -23 + bounce, 5, 10);
      ctx.fillStyle = '#d91e1e';
      ctx.fillRect(2, -22 + bounce, 2, 2);
    } else if (id === 'yugi') {
      // Spiky violet/yellow hair
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(-10, -28 + bounce, 20, 4);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-7, -24 + bounce, 2, 6);
      ctx.fillRect(5, -24 + bounce, 2, 6);
    }
  }

  // Draw Arm holding weapon
  ctx.fillStyle = primaryColor;
  let armX = -2;
  let armY = -4 + bounce;

  if (isAttacking) {
    // Lunge arm forward
    ctx.fillRect(armX + 4, armY - 2, 10, 4);
    drawWeapon(ctx, armX + 12, armY, weaponType, weaponColor, animTime);
  } else {
    // Idle/moving swing
    ctx.save();
    ctx.translate(armX, armY);
    ctx.rotate(armSwing * Math.PI / 180);
    ctx.fillRect(0, 0, 8, 4);
    drawWeapon(ctx, 6, 2, weaponType, weaponColor, animTime);
    ctx.restore();
  }

  // Defending overlay shield bubble
  if (isDefending) {
    ctx.strokeStyle = (id === 'masterchief') ? 'rgba(0, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.fillStyle = (id === 'masterchief') ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -6, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Hit red flash
  if (isHit) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.fillRect(-10, -28, 20, 40);
  }

  ctx.restore();
  if (quarantinedArt && targetHeight >= 44) {
    ctx.save();
    ctx.fillStyle = '#f6d18c';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ART PENDING', x, y - targetHeight * 0.72);
    ctx.restore();
  }
};

const drawWeapon = (ctx, x, y, type, color, animTime) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  switch (type) {
    case 'lightsaber':
    case 'dual_lightsaber':
    case 'double_lightsaber':
      // Only when no generated sprite can be displayed. No claims of 1:1 sprite fidelity.
      drawFallbackEnergyBlades(ctx, type, color);
      break;
    case 'gun':
      // Gun barrel & handle
      ctx.fillRect(0, -2, 8, 3);
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, 2, 4);
      break;
    case 'chainsaw':
      // Lancer rifle with red chainsaw blade below it
      ctx.fillRect(0, -2, 9, 3);
      ctx.fillStyle = '#d32f2f'; // spinning blade
      ctx.fillRect(1, 1, 8, 2 + Math.sin(animTime * 0.8) * 0.5);
      break;
    case 'crowbar':
      // Curved red crowbar
      ctx.fillRect(0, -5, 2, 8);
      ctx.fillRect(0, -6, 4, 2);
      break;
    case 'greatsword':
      // Large heavy sword angled up
      ctx.rotate(-Math.PI / 4);
      ctx.fillRect(0, -2, 3, 4); // hilt
      ctx.fillStyle = '#a9a9a9';
      ctx.fillRect(3, -1, 16, 2); // blade
      break;
    case 'leek':
      // Vocaloid green/white leek
      ctx.rotate(-Math.PI / 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -1, 4, 2); // white base
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(4, -1, 10, 2); // green body
      break;
    case 'cards':
      // Small card deck
      ctx.fillRect(0, -3, 4, 6);
      ctx.fillStyle = '#2980b9';
      ctx.fillRect(1, -2, 2, 4);
      break;
    case 'flashlight':
      // Heavy torch
      ctx.fillRect(0, -2, 5, 3);
      ctx.fillStyle = '#fff799';
      // Draw light cone
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(5, -1);
      ctx.lineTo(25, -8);
      ctx.lineTo(25, 6);
      ctx.closePath();
      ctx.fill();
      break;
    case 'puzzlebox':
      // Gold Laminate cube
      ctx.fillRect(0, -3, 5, 5);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(1, -2, 3, 3);
      break;
    case 'doomblade':
      // Arm blade
      ctx.rotate(Math.PI / 8);
      ctx.fillRect(0, -1, 10, 2);
      ctx.fillStyle = '#ff3300'; // energy edge
      ctx.fillRect(2, 0, 8, 1);
      break;
    case 'baseballbat':
      // Wood color bat
      ctx.rotate(-Math.PI / 5);
      ctx.fillStyle = '#d7a15c';
      ctx.fillRect(0, -1, 3, 2);
      ctx.fillRect(3, -2, 10, 3);
      break;
    case 'wristblade':
      // Dual predator claws
      ctx.fillRect(0, -2, 7, 1);
      ctx.fillRect(0, 1, 7, 1);
      break;
    case 'portalgun':
      // Portal gun with colored glow
      ctx.fillRect(0, -2, 6, 4);
      ctx.fillStyle = '#3498db'; // portal light
      ctx.fillRect(3, -1, 2, 2);
      break;
  }

  ctx.restore();
};

const drawOriginForgeThreat = (ctx, x, y, enemy, animTime, facing, targetHeight = 68) => {
  const isForgeMatrix = enemy?.visualStyle === 'origin_forge_matrix';
  if (!isForgeMatrix) return false;

  const state = enemy.state || 'idle';
  const pulse = Math.sin(animTime * 0.12);
  const attacking = state === 'attack' || state === 'special';
  const hit = state === 'hit';
  const dead = state === 'dead';

  ctx.save();
  ctx.translate(x, y);
  const scaleFactor = targetHeight / 68;
  ctx.scale(facing * 1.35 * scaleFactor, 1.35 * scaleFactor);
  ctx.imageSmoothingEnabled = false;

  if (isForgeMatrix) {
    const hover = dead ? 12 : pulse * 3;
    ctx.globalAlpha = dead ? 0.55 : 1;
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 17, dead ? 18 : 13, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, -12 + hover);
    ctx.rotate(dead ? 0.7 : animTime * 0.018);
    ctx.strokeStyle = '#d9b86b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.rotate(Math.PI / 2 + animTime * 0.011);
    ctx.strokeStyle = '#59636a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -12 + hover);
    ctx.fillStyle = hit ? '#ffffff' : '#7df9ff';
    ctx.shadowColor = '#7df9ff';
    ctx.shadowBlur = 7 + pulse * 2;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff5b6e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-2, -10);
    ctx.lineTo(3, -2);
    ctx.lineTo(-1, 8);
    ctx.stroke();
    if (attacking && !dead) {
      ctx.fillStyle = 'rgba(125,249,255,0.72)';
      ctx.fillRect(9, -3, 28 + Math.max(0, pulse) * 12, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, -1, 34, 2);
    }
    ctx.restore();
    ctx.restore();
    return true;
  }

};

export const drawPixelEnemy = (ctx, x, y, enemy, animTime, facing = -1, targetHeight = 68, context = 'auto') => {
  enemy = getSourceRuntimeViewWave16(enemy);
  if (drawSourceCaptureEnemyWave17(ctx, x, y, enemy, animTime, facing, targetHeight)) return;
  if (drawOriginForgeThreat(ctx, x, y, enemy, animTime, facing, targetHeight)) return;
  // Custom opposing squads retain their real hero identity. The shared hero
  // renderer selects dedicated presentation cells before that hero's base PNG.
  const heroActor = resolveCombatHeroSpriteActor(enemy);
  if (heroActor) {
    drawPixelSprite(ctx, x, y, heroActor, animTime, facing, targetHeight, context);
    return;
  }
  const generatedStatus = drawGeneratedSpriteSheet(ctx, x, y, enemy, animTime, facing, targetHeight, getEnemySpriteSheetSources, () => {
    drawPixelEnemy(ctx, x, y, enemy, animTime, facing, targetHeight, context);
  }, context);
  if (generatedStatus !== 'missing') {
    return;
  }
  if (drawPachakutiFallback(ctx, x, y, enemy, targetHeight, facing)) return;

  const { name, color, state } = enemy;
  const scaleFactor = targetHeight / 68;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scaleFactor, scaleFactor);

  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isAttacking = state === 'attack' || state === 'special';

  if (isDead) {
    ctx.rotate(Math.PI / 2);
    ctx.translate(-20, -10);
  }

  let bounce = Math.sin(animTime * 0.08) * 1.5;
  let legSwing = state === 'run' ? Math.sin(animTime * 0.25) * 5 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Legs
  ctx.fillStyle = '#222';
  ctx.fillRect(-5, 6 + bounce, 4, 10 + legSwing);
  ctx.fillRect(1, 6 + bounce, 4, 10 - legSwing);

  // Draw Torso
  ctx.fillStyle = color;
  ctx.fillRect(-8, -12 + bounce, 16, 18);

  // Draw Head
  ctx.fillStyle = color;
  ctx.fillRect(-6, -24 + bounce, 12, 12);

  // Visor / details based on name
  if (name.includes('Xenomorph')) {
    // Elongated head, glowing drool
    ctx.fillRect(-12, -24 + bounce, 6, 10);
    ctx.fillStyle = '#1a5f7a';
    ctx.fillRect(-10, -20 + bounce, 2, 2);
  } else if (name.includes('Grunt')) {
    // Big methane tank on back
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(-12, -14 + bounce, 5, 14);
  } else if (name.includes('Zombie')) {
    // Red expose brain / rags
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-3, -25 + bounce, 6, 3);
  } else if (name.includes('Agent')) {
    // Suit and glasses
    ctx.fillStyle = '#ffffff'; // shirt
    ctx.fillRect(-2, -12 + bounce, 4, 6);
    ctx.fillStyle = '#111111'; // tie
    ctx.fillRect(-1, -8 + bounce, 2, 4);
    ctx.fillStyle = '#111'; // glasses
    ctx.fillRect(1, -21 + bounce, 5, 2);
  } else if (name.includes('Turret')) {
    // Portal white/black sleek tripod turret (this is drawn differently!)
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing * scaleFactor, scaleFactor);
    if (isDead) {
      ctx.rotate(Math.PI / 2);
      ctx.translate(-20, -10);
    }
    // Tripod legs
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-8, 16);
    ctx.moveTo(0, 0); ctx.lineTo(8, 16);
    ctx.stroke();
    // Body egg
    ctx.fillStyle = '#ececec';
    ctx.fillRect(-6, -18, 12, 20);
    ctx.fillStyle = '#ff0000'; // Red eye
    ctx.fillRect(2, -12, 3, 3);
    ctx.restore();
    return;
  }

  // Enemy weapon/arm
  ctx.fillStyle = color;
  if (isAttacking) {
    ctx.fillRect(2, -3 + bounce, 10, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(12, -5 + bounce, 4, 6);
  } else {
    ctx.fillRect(2, -1 + bounce, 6, 4);
  }

  if (isHit) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(-10, -26, 20, 40);
  }

  ctx.restore();
};

export const drawBoss = (ctx, x, y, boss, animTime, facing = -1, context = 'auto') => {
  const requestedScale = Number(boss?.tacticsRenderScale);
  const renderScale = Number.isFinite(requestedScale) && requestedScale > 0 ? requestedScale : 1;
  const targetHeight = Math.max(96, Math.min(620, boss.renderHeight || 126)) * renderScale;
  const generatedStatus = drawGeneratedSpriteSheet(ctx, x, y, boss, animTime, facing, targetHeight, getEnemySpriteSheetSources, () => {
    drawBoss(ctx, x, y, boss, animTime, facing, context);
  }, context);
  if (generatedStatus !== 'missing') {
    return;
  }
  if (drawPachakutiFallback(ctx, x, y, boss, targetHeight, facing)) return;

  const { name, color, state } = boss;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * renderScale, renderScale);

  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isAttacking = state === 'attack' || state === 'special';

  if (isDead) {
    ctx.rotate(Math.PI / 2);
    ctx.translate(-40, -20);
  }

  let bounce = Math.sin(animTime * 0.05) * 4;
  let legSwing = state === 'run' ? Math.sin(animTime * 0.15) * 8 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Boss is twice the size of a normal character!
  // Draw legs
  ctx.fillStyle = '#111';
  ctx.fillRect(-12, 12 + bounce, 8, 20 + legSwing);
  ctx.fillRect(4, 12 + bounce, 8, 20 - legSwing);

  // Draw torso
  ctx.fillStyle = color;
  ctx.fillRect(-20, -24 + bounce, 40, 36);

  // Draw head
  ctx.fillStyle = color;
  ctx.fillRect(-15, -48 + bounce, 30, 24);

  // Custom details per boss
  if (name.includes('REX')) {
    // Railgun barrel & radar dish
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(-35, -40 + bounce, 25, 8); // railgun
    ctx.beginPath();
    ctx.arc(20, -36 + bounce, 12, 0, Math.PI * 2); // dish
    ctx.fill();
  } else if (name.includes('Tyrannosaurus')) {
    // Dinosaur jaws & eyes
    ctx.fillStyle = '#c0392b'; // mouth open red
    ctx.fillRect(10, -36 + bounce, 15, 8);
    ctx.fillStyle = '#ffeb3b'; // yellow eye
    ctx.fillRect(4, -44 + bounce, 4, 4);
  } else if (name.includes('Sovereign')) {
    // Reaper mechanical tentacles
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-10, 10 + bounce);
    ctx.quadraticCurveTo(-30, 20, -20, 40);
    ctx.moveTo(10, 10 + bounce);
    ctx.quadraticCurveTo(30, 20, 20, 40);
    ctx.stroke();
  } else if (name.includes('Cyberdemon')) {
    // Arm rocket launcher & horns
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(15, -16 + bounce, 16, 10); // Arm rocket
    ctx.fillStyle = '#cca43b'; // Horns
    ctx.fillRect(-18, -54 + bounce, 6, 8);
    ctx.fillRect(12, -54 + bounce, 6, 8);
  } else if (name.includes('GLaDOS')) {
    // Hanging robotic eye
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(renderScale, renderScale);
    // Draw ceiling support beam
    ctx.fillStyle = '#444';
    ctx.fillRect(-8, -120, 16, 80);
    // Arm pivots
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(20, -10 + Math.sin(animTime * 0.05) * 5);
    ctx.lineTo(0, 20 + Math.cos(animTime * 0.05) * 5);
    ctx.stroke();
    // Hanging pod
    ctx.fillStyle = '#ececec';
    ctx.fillRect(-12, 10 + Math.cos(animTime * 0.05) * 5, 24, 24);
    ctx.fillStyle = '#ffb300'; // Yellow core eye
    ctx.beginPath();
    ctx.arc(0, 22 + Math.cos(animTime * 0.05) * 5, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Arm/Weapons
  ctx.fillStyle = color;
  if (isAttacking) {
    ctx.fillRect(15, -10 + bounce, 20, 8);
  } else {
    ctx.fillRect(15, -4 + bounce, 12, 8);
  }

  if (isHit) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(-22, -50, 44, 82);
  }

  ctx.restore();
};

const DECOR_THEMES = {
  'Gears of War': dlcGearsOfWar.createDecorThemes(),
  'Halo': dlcHalo.createDecorThemes(),
  'Alien': dlcAlien.createDecorThemes(),
  'Predator': dlcPredator.createDecorThemes(),
  'Resident Evil': dlcResidentEvil.createDecorThemes(),
  'Silent Hill': dlcSilentHill.createDecorThemes(),
  'Dino Crisis': dlcDinoCrisis.createDecorThemes(),
  'The Matrix': dlcTheMatrix.createDecorThemes(),
  'Stargate': dlcStargate.createDecorThemes(),
  'Half-Life': dlcHalfLife.createDecorThemes(),
  'Portal': dlcPortal.createDecorThemes(),
  'Metal Gear': dlcMetalGear.createDecorThemes(),
  'Payday': dlcPayday.createDecorThemes(),
  'Vocaloid': dlcVocaloid.createDecorThemes(),
  'Yu-Gi-Oh': dlcYuGiOh.createDecorThemes(),
  'Guilty Gear': dlcGuiltyGear.createDecorThemes(),
  'BlazBlue': dlcBlazBlue.createDecorThemes(),
  'Slender Man': dlcSlenderMan.createDecorThemes(),
  'Chucky': dlcChucky.createDecorThemes(),
  'Hellraiser': dlcHellraiser.createDecorThemes(),
  'Mass Effect': dlcMassEffect.createDecorThemes(),
  'Fallout': dlcFallout.createDecorThemes(),
  'Doom': dlcDoom.createDecorThemes(),
  'Unreal': dlcUnreal.createDecorThemes(),
  'Harry Potter': dlcHarryPotter.createDecorThemes(),
  'Star Wars': dlcStarWars.createDecorThemes(),
  'Le Cinquième Element': dlcLeCinquiemeElement.createDecorThemes(),
  'Scary Movie': dlcScaryMovie.createDecorThemes(),
  'Dead Space': dlcDeadSpace.createDecorThemes(),
  'Rick & Morty': dlcRickMorty.createDecorThemes(),
  'Digital Circus': dlcDigitalCircus.createDecorThemes(),
  'Digimon': dlcDigimon.createDecorThemes(),
  'Saw': dlcSaw.createDecorThemes(),
  'Rosario + Vampire': dlcRosarioVampire.createDecorThemes(),
  'Negima': dlcNegima.createDecorThemes(),
  'Ghost in the Shell': dlcGhostInTheShell.createDecorThemes(),
  'Mad Max': dlcMadMax.createDecorThemes(),
  Matrix: { sky: ['#061706', '#000300'], floor: 'rgba(50, 255, 98, 0.12)', grid: 'rgba(50, 255, 98, 0.45)', motif: 'singularity', accent: '#32ff62' }
};

Object.assign(DECOR_THEMES, EXPANDED_DECOR_THEMES);

export const OPENAI_BACKDROPS = {
  RPG: {
    'Gears of War': dlcGearsOfWar.createOpenaiBackdropsRpg(),
    Predator: dlcPredator.createOpenaiBackdropsRpg(),
    'Silent Hill': dlcSilentHill.createOpenaiBackdropsRpg(),
    Stargate: dlcStargate.createOpenaiBackdropsRpg(),
    Portal: dlcPortal.createOpenaiBackdropsRpg(),
    BlazBlue: dlcBlazBlue.createOpenaiBackdropsRpg(),
    Hellraiser: dlcHellraiser.createOpenaiBackdropsRpg(),
    Doom: dlcDoom.createOpenaiBackdropsRpg(),
    'Harry Potter': dlcHarryPotter.createOpenaiBackdropsRpg(),
    'Scary Movie': dlcScaryMovie.createOpenaiBackdropsRpg(),
    Vocaloid: dlcVocaloid.createOpenaiBackdropsRpg(),
    'Digital Circus': dlcDigitalCircus.createOpenaiBackdropsRpg(),
    'Rosario + Vampire': dlcRosarioVampire.createOpenaiBackdropsRpg(),
    'Mad Max': dlcMadMax.createOpenaiBackdropsRpg(),
    Discworld: dlcDiscworld.createOpenaiBackdropsRpg(),
    Kaamelott: dlcKaamelott.createOpenaiBackdropsRpg(),
    'Alien 3': dlcAlien3.createOpenaiBackdropsRpg(),
    'Alien: Covenant': dlcAlienCovenant.createOpenaiBackdropsRpg(),
    'The Predator': dlcThePredator.createOpenaiBackdropsRpg(),
    'Predator: Badlands': dlcPredatorBadlands.createOpenaiBackdropsRpg(),
    'Dungeon Meshi': dlcDungeonMeshi.createOpenaiBackdropsRpg(),
    'Hazbin Hotel': dlcHazbinHotel.createOpenaiBackdropsRpg(),
    Matrix: '/backgrounds/matrix-rpg-openai.png'
  },
  Tactics: {
    Halo: dlcHalo.createOpenaiBackdropsTactics(),
    'Resident Evil': dlcResidentEvil.createOpenaiBackdropsTactics(),
    'The Matrix': dlcTheMatrix.createOpenaiBackdropsTactics(),
    'Metal Gear': dlcMetalGear.createOpenaiBackdropsTactics(),
    'Yu-Gi-Oh': dlcYuGiOh.createOpenaiBackdropsTactics(),
    'Mass Effect': dlcMassEffect.createOpenaiBackdropsTactics(),
    'Le Cinquième Element': dlcLeCinquiemeElement.createOpenaiBackdropsTactics(),
    'Dead Space': dlcDeadSpace.createOpenaiBackdropsTactics(),
    Digimon: dlcDigimon.createOpenaiBackdropsTactics(),
    Negima: dlcNegima.createOpenaiBackdropsTactics(),
    'Slender Man': dlcSlenderMan.createOpenaiBackdropsTactics(),
    Unreal: dlcUnreal.createOpenaiBackdropsTactics(),
    'The Batman Who Laughs': dlcTheBatmanWhoLaughs.createOpenaiBackdropsTactics(),
    Prometheus: dlcPrometheus.createOpenaiBackdropsTactics(),
    'Alien Resurrection': dlcAlienResurrection.createOpenaiBackdropsTactics(),
    Predators: dlcPredators.createOpenaiBackdropsTactics(),
    'Predator: Killer of Killers': dlcPredatorKillerOfKillers.createOpenaiBackdropsTactics(),
    'Alien vs Predator': dlcAlienVsPredator.createOpenaiBackdropsTactics(),
    Noob: dlcNoob.createOpenaiBackdropsTactics(),
    'System of a Down': dlcSystemOfADown.createOpenaiBackdropsTactics(),
    'Daft Punk': dlcDaftPunk.createOpenaiBackdropsTactics()
  },
  Smash: {
    Alien: dlcAlien.createOpenaiBackdropsSmash(),
    'Dino Crisis': dlcDinoCrisis.createOpenaiBackdropsSmash(),
    'Half-Life': dlcHalfLife.createOpenaiBackdropsSmash(),
    Payday: dlcPayday.createOpenaiBackdropsSmash(),
    Vocaloid: dlcVocaloid.createOpenaiBackdropsSmash(),
    'Guilty Gear': dlcGuiltyGear.createOpenaiBackdropsSmash(),
    'Slender Man': dlcSlenderMan.createOpenaiBackdropsSmash(),
    Chucky: dlcChucky.createOpenaiBackdropsSmash(),
    Fallout: dlcFallout.createOpenaiBackdropsSmash(),
    Unreal: dlcUnreal.createOpenaiBackdropsSmash(),
    'Star Wars': dlcStarWars.createOpenaiBackdropsSmash(),
    'Rick & Morty': dlcRickMorty.createOpenaiBackdropsSmash(),
    Saw: dlcSaw.createOpenaiBackdropsSmash(),
    'Ghost in the Shell': dlcGhostInTheShell.createOpenaiBackdropsSmash(),
    'Joker New 52': dlcJokerNew52.createOpenaiBackdropsSmash(),
    Aliens: dlcAliens.createOpenaiBackdropsSmash(),
    'Alien: Romulus': dlcAlienRomulus.createOpenaiBackdropsSmash(),
    'Predator 2': dlcPredator2.createOpenaiBackdropsSmash(),
    Prey: dlcPrey.createOpenaiBackdropsSmash(),
    'Aliens vs Predator: Requiem': dlcAliensVsPredatorRequiem.createOpenaiBackdropsSmash(),
    Rammstein: dlcRammstein.createOpenaiBackdropsSmash(),
    'Rob Zombie': dlcRobZombie.createOpenaiBackdropsSmash(),
    'Oliver Tree': dlcOliverTree.createOpenaiBackdropsSmash()
  }
};

Object.entries(FEATURED_BACKDROPS).forEach(([universe, modes]) => {
  Object.entries(modes).forEach(([mode, src]) => {
    OPENAI_BACKDROPS[mode][universe] = src;
  });
});

const backdropCache = new Map();

const getTheme = (universe) => DECOR_THEMES[universe] || {
  sky: ['#0c071d', '#030209'],
  floor: 'rgba(57, 197, 187, 0.08)',
  grid: 'rgba(57, 197, 187, 0.25)',
  motif: 'rift',
  accent: '#39c5bb'
};

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getOpenAiBackdrop(src) {
  if (!src || typeof Image === 'undefined') return null;

  let img = backdropCache.get(src);
  if (!img) {
    img = new Image();
    img.decoding = 'async';
    img.src = src;
    backdropCache.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

export function getOpenAiBackdropSrc(universe, mode) {
  const generated = getGeneratedStageBackdropSrc(universe, mode);
  if (generated) return generated;
  if (mode === 'Combat' || mode === 'Fighter') {
    return OPENAI_BACKDROPS.Combat?.[universe]
      || OPENAI_BACKDROPS.Smash?.[universe]
      || OPENAI_BACKDROPS.RPG?.[universe]
      || null;
  }
  return OPENAI_BACKDROPS[mode]?.[universe] || null;
}

function drawOpenAiBackdrop(ctx, src, width, height) {
  const img = getOpenAiBackdrop(src);
  if (!img) return false;

  const sourceRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (sourceRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  return true;
}

function drawStageFloor(ctx, width, height, mode, theme, levelProfile = null) {
  const material = levelProfile?.material || null;
  const universe = levelProfile?.universe || null;
  if (mode === 'RPG') {
    const horizon = levelProfile?.rpg?.horizon || 0.46;
    ctx.fillStyle = material ? withAlpha(material.base, 0.62) : theme.floor;
    ctx.beginPath();
    ctx.moveTo(0, height * horizon);
    ctx.lineTo(width, height * 0.72);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    if (universe) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * horizon);
      ctx.lineTo(width, height * 0.72);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.clip();
      drawRecentUniverseTextureCover(ctx, universe, 'RPG', 0, height * horizon, width, height * (1 - horizon), 0.76);
      ctx.restore();
    }

    ctx.strokeStyle = material ? withAlpha(material.edge, 0.7) : theme.grid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height * horizon);
    ctx.lineTo(width, height * 0.72);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let xOffset = -width; xOffset < width * 2; xOffset += 80) {
      ctx.beginPath();
      ctx.moveTo(xOffset, height);
      ctx.lineTo(xOffset + width * 0.6, height * (horizon - 0.06));
      ctx.stroke();
    }

    if (material) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * horizon);
      ctx.lineTo(width, height * 0.72);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = withAlpha(material.detail, 0.2);
      ctx.fillStyle = withAlpha(material.mid, 0.2);
      if (['wood', 'miniature'].includes(material.pattern)) {
        for (let y = height * horizon + 12; y < height; y += 22) ctx.fillRect(0, y, width, 3);
      } else if (['circuit', 'glass', 'armor', 'alloy', 'hangar', 'steel', 'prison', 'lab'].includes(material.pattern)) {
        for (let x = 12; x < width; x += 54) {
          ctx.strokeRect(x, height * horizon + ((x / 54) % 2) * 18, 34, 22);
        }
      } else if (['organic', 'roots', 'infernal'].includes(material.pattern)) {
        ctx.lineWidth = 3;
        for (let x = -40; x < width + 80; x += 84) {
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.quadraticCurveTo(x + 34, height * 0.7, x + 72, height * horizon);
          ctx.stroke();
        }
      } else {
        for (let y = height * horizon + 18; y < height; y += 30) {
          const offset = Math.round((y / 30) % 2) * 24;
          for (let x = -offset; x < width; x += 48) ctx.strokeRect(x, y, 42, 18);
        }
      }
      ctx.restore();
    }
    return;
  }

  if (mode === 'Tactics') {
    ctx.fillStyle = material ? withAlpha(material.shadow, 0.42) : 'rgba(4,8,14,0.38)';
    ctx.fillRect(width * 0.055, height * 0.12, width * 0.89, height * 0.68);
    return;
  }

  if (mode === 'Combat' || mode === 'Fighter') {
    const horizonY = height * (levelProfile?.combat?.horizon || 0.69);
    const floor = ctx.createLinearGradient(0, horizonY, 0, height);
    floor.addColorStop(0, material ? withAlpha(material.edge, 0.34) : theme.floor);
    floor.addColorStop(0.12, material ? withAlpha(material.base, 0.78) : 'rgba(10,12,20,0.8)');
    floor.addColorStop(1, material ? withAlpha(material.shadow, 0.96) : 'rgba(2,2,7,0.96)');
    ctx.fillStyle = floor;
    ctx.fillRect(0, horizonY, width, height - horizonY);
    if (universe) {
      drawRecentUniverseTextureCover(ctx, universe, 'Combat', 0, horizonY, width, height - horizonY, 0.72);
    }
    return;
  }

  // Smash platforms are drawn by EngineSmash from the real collision geometry.
  // The background only keeps the lower void, avoiding a second decorative platform set.
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, height - 20, width, 20);
}

function drawStars(ctx, width, height, theme, count = 32) {
  ctx.fillStyle = withAlpha(theme.accent, 0.45);
  for (let i = 0; i < count; i++) {
    const x = (i * 73) % width;
    const y = (i * 41) % Math.max(1, height * 0.58);
    const size = i % 5 === 0 ? 2 : 1;
    ctx.fillRect(x, y, size, size);
  }
}

function drawMotif(ctx, theme, width, height, time) {
  const accent = theme.accent;
  const soft = withAlpha(accent, 0.22);
  const bright = withAlpha(accent, 0.5);

  ctx.save();
  ctx.strokeStyle = soft;
  ctx.fillStyle = soft;
  ctx.lineWidth = 3;

  switch (theme.motif) {
    case 'ringworld':
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(width / 2, -height * 1.45, width * 2, 0.1, 0.5);
      ctx.stroke();
      break;
    case 'stargate':
      ctx.strokeStyle = withAlpha('#7c8794', 0.55);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.34, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = withAlpha(accent, 0.45);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.34, 52 + Math.sin(time * 0.03) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = bright;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        ctx.fillRect(width / 2 + Math.cos(a) * 76 - 3, height * 0.34 + Math.sin(a) * 76 - 3, 6, 6);
      }
      break;
    case 'code':
    case 'cybercity':
      ctx.fillStyle = bright;
      ctx.font = '10px monospace';
      for (let i = 10; i < width; i += 58) {
        const fallY = (time * 2 + i * 7) % (height - 25);
        ctx.fillText(theme.motif === 'code' ? '01' : 'SYS', i, fallY);
        ctx.fillText(theme.motif === 'code' ? '10' : 'NET', i, fallY - 20);
      }
      break;
    case 'hive':
    case 'shipdeck':
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      for (let x = 40; x < width; x += 92) ctx.fillRect(x, 0, 24, height);
      ctx.fillStyle = bright;
      ctx.fillRect(80, 28, 42, 24);
      ctx.fillRect(width - 130, 42, 48, 18);
      break;
    case 'jungle':
    case 'forest':
    case 'worldtree':
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      for (let x = 0; x < width; x += 70) {
        const top = height - 120 - ((x * 13) % 70);
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x + 24, top);
        ctx.lineTo(x + 52, height);
        ctx.fill();
      }
      if (theme.motif === 'worldtree') {
        ctx.strokeStyle = bright;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(width / 2, height);
        ctx.lineTo(width / 2, height * 0.18);
        ctx.stroke();
      }
      break;
    case 'biohazard':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(width / 2 + Math.cos(i * 2.1) * 28, 95 + Math.sin(i * 2.1) * 18, 32, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'fogtown':
      ctx.fillStyle = 'rgba(210,210,190,0.08)';
      for (let y = 50; y < height; y += 45) ctx.fillRect(0, y + Math.sin(time * 0.01 + y) * 8, width, 12);
      break;
    case 'facility':
    case 'lab':
    case 'testchamber':
      ctx.strokeStyle = soft;
      for (let x = 50; x < width; x += 110) {
        ctx.strokeRect(x, 36, 70, 88);
        ctx.fillStyle = withAlpha(accent, 0.22);
        ctx.fillRect(x + 10, 50, 50, 10);
      }
      break;
    case 'stealthbase':
    case 'vault':
      ctx.strokeStyle = bright;
      ctx.strokeRect(width / 2 - 95, 48, 190, 92);
      ctx.beginPath();
      ctx.arc(width / 2, 94, 34, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'concert':
      ctx.strokeStyle = bright;
      for (let x = 70; x < width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 25);
        ctx.lineTo(x - 40, height * 0.55);
        ctx.stroke();
      }
      break;
    case 'duelarena':
    case 'arcanecity':
    case 'castle':
    case 'academy':
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      for (let x = 40; x < width; x += 120) {
        ctx.fillRect(x, 75, 50, height);
        ctx.fillRect(x + 12, 50, 26, 25);
      }
      break;
    case 'gearstage':
      ctx.strokeStyle = bright;
      for (let x = 80; x < width; x += 150) {
        ctx.beginPath();
        ctx.arc(x, 100, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(x - 5, 58, 10, 84);
      }
      break;
    case 'toyfactory':
    case 'hauntedset':
      ctx.strokeStyle = bright;
      for (let x = 70; x < width; x += 130) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.sin(time * 0.02 + x) * 20, 120);
        ctx.stroke();
      }
      break;
    case 'labyrinth':
    case 'traproom':
      ctx.strokeStyle = bright;
      for (let x = 30; x < width; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 120);
        ctx.lineTo(x + 36, 150);
        ctx.stroke();
      }
      break;
    case 'citadel':
    case 'cruise':
      drawStars(ctx, width, height, theme, 38);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.moveTo(width / 2, 35);
      ctx.lineTo(width / 2 - 160, 180);
      ctx.lineTo(width / 2 + 160, 180);
      ctx.closePath();
      ctx.fill();
      break;
    case 'wasteland':
    case 'desert':
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width * 0.16, height - 75);
      ctx.lineTo(width * 0.32, height - 45);
      ctx.lineTo(width * 0.58, height - 95);
      ctx.lineTo(width, height - 70);
      ctx.lineTo(width, height);
      ctx.fill();
      break;
    case 'hellgate':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 45, 72);
      ctx.lineTo(width / 2 + 45, 72);
      ctx.lineTo(width / 2, 145);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'tournament':
      ctx.strokeStyle = bright;
      ctx.strokeRect(width / 2 - 120, 58, 240, 95);
      ctx.fillStyle = soft;
      ctx.fillRect(width / 2 - 8, 58, 16, 95);
      break;
    case 'trench':
      drawStars(ctx, width, height, theme, 45);
      ctx.fillStyle = 'rgba(120,130,150,0.18)';
      ctx.fillRect(0, height * 0.54, width, 35);
      for (let x = 0; x < width; x += 80) ctx.fillRect(x, height * 0.5, 42, 70);
      break;
    case 'portalgarage':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.35, 62 + Math.sin(time * 0.04) * 5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'circus':
      ctx.fillStyle = soft;
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 40, height * 0.42);
        ctx.lineTo(x + 80, 0);
        ctx.fill();
      }
      break;
    case 'digitalfield':
      ctx.strokeStyle = bright;
      for (let x = 20; x < width; x += 80) {
        ctx.strokeRect(x, 40 + (x % 3) * 18, 42, 28);
      }
      break;
    case 'singularity':
      ctx.strokeStyle = bright;
      for (let r = 30; r < 150; r += 26) {
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.34, r + Math.sin(time * 0.03 + r) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    default:
      ctx.strokeStyle = bright;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 90, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

export function drawUniverseBackground(ctx, universe, width, height, mode, options = {}) {
  const levelProfile = getRecentUniverseLevelProfile(universe);
  // The battle shell supplies simulation time: pausing or hiding a tab also
  // freezes the scenery, and re-entering cannot jump a wall-clock animation.
  const elapsedSeconds = Math.max(0, Number(options.elapsedSeconds) || 0);
  const time = options.reducedMotion ? 0 : elapsedSeconds * 30;
  const backdropPath = getOpenAiBackdropSrc(universe, mode);
  const drewBackdrop = drawOpenAiBackdrop(ctx, backdropPath, width, height);
  const atmosphere = {
    stage: { ...options.stage, universe, mode }, width, height, elapsedSeconds,
    reducedMotion: Boolean(options.reducedMotion), backdropPath: drewBackdrop ? backdropPath : null
  };
  if (drewBackdrop) {
    if (levelProfile && ['RPG', 'Tactics', 'Combat', 'Fighter'].includes(mode)) {
      drawStageFloor(ctx, width, height, mode, getTheme(universe), levelProfile);
    }
    renderStageAtmosphere(ctx, atmosphere);
    return true;
  }

  const theme = getTheme(universe);

  ctx.save();

  const grad = ctx.createRadialGradient(width / 2, height * 0.35, 40, width / 2, height / 2, width * 0.85);
  grad.addColorStop(0, theme.sky[0]);
  grad.addColorStop(1, theme.sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  drawMotif(ctx, theme, width, height, time);
  drawStageFloor(ctx, width, height, mode, theme, levelProfile);

  ctx.restore();
  renderStageAtmosphere(ctx, atmosphere);
  return false;
}

export function drawSynergyOverlay(ctx, activeSynergies, width, height, animTime) {
  if (!activeSynergies || activeSynergies.length === 0) return;

  ctx.save();
  activeSynergies.forEach(syn => {
    if (syn === 'hacker') {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
      ctx.font = '10px Courier New';
      for (let x = 10; x < width; x += 40) {
        const yOffset = (animTime * 120 + x * 3) % (height + 100);
        ctx.fillText('01101001011', x, yOffset - 40);
        ctx.fillText('10101100110', x, yOffset);
      }
    }
    if (syn === 'horror') {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.05)';
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(animTime * 0.5 + i * 2) * 0.4 + 0.5) * width;
        const y = height - ((animTime * 40 + i * 80) % height);
        ctx.beginPath();
        ctx.arc(x, y, 35 + i * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (syn === 'tactical') {
      ctx.strokeStyle = 'rgba(57, 197, 187, 0.08)';
      ctx.lineWidth = 2;
      const pulse = Math.abs(Math.sin(animTime * 2)) * 0.3 + 0.7;
      ctx.beginPath();
      for (let size = 30; size < 120; size += 40) {
        drawHex(ctx, width * 0.1, height * 0.8, size * pulse);
        drawHex(ctx, width * 0.9, height * 0.8, size * pulse);
      }
      ctx.stroke();
    }
    if (syn === 'slayer') {
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.15)';
      ctx.lineWidth = 1.5;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const seed = Math.floor(animTime * 2 + i);
        const x1 = (Math.sin(seed) * 0.5 + 0.5) * width;
        const y1 = (Math.cos(seed) * 0.5 + 0.5) * height;
        const x2 = x1 + Math.sin(seed * 1.5) * 80;
        const y2 = y1 + Math.cos(seed * 1.5) * 80;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    if (syn === 'marine') {
      ctx.strokeStyle = 'rgba(230, 126, 34, 0.06)';
      ctx.lineWidth = 3;
      const radius = (animTime * 60) % 250;
      ctx.beginPath();
      ctx.arc(width * 0.25, height * 0.6, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawHex(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const hx = x + Math.cos(angle) * size;
    const hy = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
}

// The W16 visual catalog stays pure when imported by Node audits/tests.
registerSourceNativeRendererWave16({ drawCosmeticAtlasFrame, preloadSpriteSheetSrcs });
registerNativeProjectileRegionRendererWave17((ctx, region, x, y, scale, facing) => {
  const { rect } = region, entry = getCachedSpriteSheet(region.sheet);
  if (!entry || entry.status !== 'ready' || !entry.image.complete) return false;
  if (![rect.left, rect.top, rect.width, rect.height, x, y].every(Number.isFinite)
    || rect.left < 0 || rect.top < 0 || rect.width <= 0 || rect.height <= 0
    || rect.left + rect.width > entry.image.naturalWidth || rect.top + rect.height > entry.image.naturalHeight) return false;
  ctx.save(); ctx.translate(x, y); ctx.scale(facing < 0 ? -1 : 1, 1); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, rect.left, rect.top, rect.width, rect.height,
    -rect.width * scale / 2, -rect.height * scale / 2, rect.width * scale, rect.height * scale);
  ctx.restore();
  return true;
});
