/** Scene-specific generated layers. These never replace tactical terrain/collision. */
const PREY_FOREST_ART = Object.freeze({
  id: 'prey-2022-forest-duel-background-20261113',
  stageId: 50106,
  sourceSceneId: 'prey_1719_naru_feral_bog',
  universe: 'Prey',
  mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
  path: '/backgrounds/source-scenes/prey-2022-forest-duel-tactics-20261113.png',
  sourcePath: 'DLC/Prey/assets/backgrounds/source-scenes/prey-2022-forest-duel-tactics-20261113.png',
  width: 960,
  height: 540,
  sourceScope: 'Official film stills: forest materials and nocturnal lighting only',
  geometryStatus: 'adapted-camera-not-film-geography',
  bogArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/scenes/prey-forest-manifest.json'
});

const JUNGLE_RIVER_ART = Object.freeze({
  id: 'predator-jungle-background-20261113',
  stageId: 50104,
  sourceSceneId: 'predator_1987_jungle_finale',
  universe: 'Predator',
  mode: 'Tactics',
  incarnation: 'Predator (1987) — Dutch / Jungle Hunter final confrontation',
  path: '/backgrounds/source-scenes/predator-1987-riverbank-tactics-20261113.png',
  sourcePath: 'DLC/Predator/assets/backgrounds/source-scenes/predator-1987-riverbank-tactics-20261113.png',
  width: 960, height: 540,
  sourceScope: 'Official film still: nocturnal riverbank rocks, water and tropical vegetation only',
  geometryStatus: 'adapted-camera-not-film-geography',
  trapArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/scenes/predator-jungle-manifest.json'
});

const LOST_TRIBE_SHIP_ART = Object.freeze({
  id: 'predator2-ship-background-20261113',
  stageId: 50105,
  sourceSceneId: 'predator_2_lost_tribe_ship_1990',
  universe: 'Predator',
  mode: 'Tactics',
  incarnation: 'Predator 2 (1990) — Los Angeles subterranean Lost Tribe ship / trophy chamber',
  path: '/backgrounds/source-scenes/predator2-1990-ship-chamber-tactics-20261113.png',
  sourcePath: 'DLC/Predator/assets/backgrounds/source-scenes/predator2-1990-ship-chamber-tactics-20261113.png',
  width: 960, height: 540,
  sourceScope: 'Film frame: bronze wall relief, amber light and low orange haze only',
  geometryStatus: 'adapted-camera-not-film-geography',
  trophyArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/scenes/predator2-ship-manifest.json'
});

const BACKDROPS = Object.freeze([PREY_FOREST_ART, JUNGLE_RIVER_ART, LOST_TRIBE_SHIP_ART]);

const images = new Map();

export function getSourceSceneBackdropArt(scene) {
  if (!scene || scene.customBattle || scene.isCustomBattle || scene.isCustom
    || scene.forceBaseArena || scene.dlcSuppressedArena) return null;
  return BACKDROPS.find(art => Number(scene.id) === art.stageId
    && scene.sourceSceneId === art.sourceSceneId
    && scene.universe === art.universe
    && scene.mode === art.mode
    && scene.incarnation === art.incarnation) || null;
}

export function drawSourceSceneBackdropArt(ctx, scene, width, height) {
  const art = getSourceSceneBackdropArt(scene);
  if (!art || typeof Image === 'undefined' || !(width > 0 && height > 0)) return false;
  let entry = images.get(art.path);
  if (!entry) {
    const image = new Image();
    entry = { image, status: 'loading' };
    image.decoding = 'async';
    image.onload = () => { entry.status = 'ready'; };
    image.onerror = () => { entry.status = 'error'; };
    image.src = art.path;
    if (image.complete && image.naturalWidth > 0) entry.status = 'ready';
    images.set(art.path, entry);
  }
  if (entry.status !== 'ready' || !entry.image.naturalWidth || !entry.image.naturalHeight) return false;
  const scale = Math.max(width / entry.image.naturalWidth, height / entry.image.naturalHeight);
  const sw = width / scale, sh = height / scale;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.image, (entry.image.naturalWidth - sw) / 2,
    (entry.image.naturalHeight - sh) / 2, sw, sh, 0, 0, width, height);
  ctx.restore();
  return true;
}
