/** A bounded companion portrait; this is not a full-body actor or animation. */
export const SARII_PORTRAIT_ART = Object.freeze({
  id: 'prey-sarii-companion-portrait-20261113',
  stageId: 50106,
  sourceSceneId: 'prey_1719_naru_feral_bog',
  universe: 'Prey',
  mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
  propId: 'sarii',
  kind: 'companion-portrait',
  path: '/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png',
  width: 256,
  height: 256,
  columns: 1,
  rows: 1,
  frameCount: 1,
  sourceScope: 'Official film still: head, ears, neck and upper chest only',
  fullBodyArtworkComplete: false,
  animationArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/sarii/portrait-manifest.json'
});

const images = new Map();

export function getSourceSceneCompanionPortraitArt(scene, propId = 'sarii') {
  const definition = scene?.definition;
  if (!definition || propId !== SARII_PORTRAIT_ART.propId
    || definition.customBattle || definition.isCustomBattle || definition.isCustom
    || definition.forceBaseArena || definition.dlcSuppressedArena) return null;
  return Number(definition.id) === SARII_PORTRAIT_ART.stageId
    && definition.sourceSceneId === SARII_PORTRAIT_ART.sourceSceneId
    && definition.universe === SARII_PORTRAIT_ART.universe
    && definition.mode === SARII_PORTRAIT_ART.mode
    && definition.incarnation === SARII_PORTRAIT_ART.incarnation ? SARII_PORTRAIT_ART : null;
}

/** Draw a portrait badge above the companion's actual cell; false keeps fallback. */
export function drawSariiPortrait(ctx, scene, at) {
  const art = getSourceSceneCompanionPortraitArt(scene);
  if (!art || typeof Image === 'undefined'
    || !Number.isFinite(at?.x) || !Number.isFinite(at?.y)) return false;
  let entry = images.get(art.path);
  if (!entry) {
    const image = new Image();
    entry = { image, status: 'loading' };
    const validDimensions = () => image.naturalWidth === art.width && image.naturalHeight === art.height;
    image.decoding = 'async';
    image.onload = () => { entry.status = validDimensions() ? 'ready' : 'error'; };
    image.onerror = () => { entry.status = 'error'; };
    image.src = art.path;
    if (image.complete && validDimensions()) entry.status = 'ready';
    images.set(art.path, entry);
  }
  if (entry.status !== 'ready') return false;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#19291f';
  ctx.fillRect(at.x - 18, at.y - 46, 36, 36);
  ctx.strokeStyle = '#c8ac82';
  ctx.lineWidth = 1;
  ctx.strokeRect(at.x - 18, at.y - 46, 36, 36);
  ctx.drawImage(entry.image, at.x - 16, at.y - 44, 32, 32);
  ctx.fillStyle = '#c8ac82';
  ctx.beginPath();
  ctx.moveTo(at.x - 4, at.y - 9);
  ctx.lineTo(at.x + 4, at.y - 9);
  ctx.lineTo(at.x, at.y - 4);
  ctx.fill();
  ctx.restore();
  return true;
}
