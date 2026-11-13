/** Source-scoped HUD art. The portrait never replaces Naru's full-body sheet. */
export const NARU_PREY_PORTRAIT_ART = Object.freeze({
  id: 'prey-naru-black-eye-paint-portrait-20261113',
  stageId: 50106,
  sourceSceneId: 'prey_1719_naru_feral_bog',
  universe: 'Prey',
  mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
  actorId: 'naru_prey',
  kind: 'actor-portrait',
  path: '/sprites/source-scenes/prey-2022/naru-portrait-20261113.png',
  sourcePath: 'DLC/Prey/assets/sprites/source-scenes/prey-2022/naru-portrait-20261113.png',
  width: 256,
  height: 256,
  columns: 1,
  rows: 1,
  frameCount: 1,
  sourceScope: 'Official film stills: face, hair, black eye-band paint and visible shoulders only',
  fullBodyArtworkComplete: false,
  animationArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/naru/portrait-manifest.json'
});

let portrait;

export function getSourceSceneNaruPortraitArt(scene) {
  const d = scene?.definition, actor = scene?.actor, art = NARU_PREY_PORTRAIT_ART;
  if (!d || d.customBattle || d.isCustomBattle || d.isCustom || d.forceBaseArena
    || d.dlcSuppressedArena || actor?.id !== art.actorId || actor.universe !== art.universe) return null;
  return d.id === art.stageId && d.sourceSceneId === art.sourceSceneId
    && d.universe === art.universe && d.mode === art.mode && d.material === 'prey'
    && d.incarnation === art.incarnation ? art : null;
}

/** Explicit HUD rectangle only; never draws the portrait as a walking body. */
export function drawSourceSceneNaruPortrait(ctx, scene, x, y, size = 64) {
  const art = getSourceSceneNaruPortraitArt(scene);
  if (!art || typeof Image === 'undefined' || ![x, y, size].every(Number.isFinite) || size <= 0) return false;
  if (!portrait) {
    const image = new Image();
    portrait = { image, status: 'loading' };
    const valid = () => image.naturalWidth === art.width && image.naturalHeight === art.height;
    image.decoding = 'async';
    image.onload = () => { portrait.status = valid() ? 'ready' : 'error'; };
    image.onerror = () => { portrait.status = 'error'; };
    image.src = art.path;
    if (image.complete && valid()) portrait.status = 'ready';
  }
  if (portrait.status !== 'ready') return false;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(portrait.image, x, y, size, size);
  ctx.restore();
  return true;
}
