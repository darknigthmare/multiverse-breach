/** Film-referenced exterior mask icon; aiming and projectile logic stay separate. */
export const PREY_BONE_MASK_FRONT_ART = Object.freeze({
  id: 'prey-feral-bone-mask-front-20261113',
  stageId: 50106,
  sourceSceneId: 'prey_1719_naru_feral_bog',
  universe: 'Prey',
  mode: 'Tactics',
  incarnation: 'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
  actorId: 'naru_prey',
  kind: 'prop-exterior-icon',
  path: '/sprites/source-scenes/prey-2022/feral-bone-mask-front-20261113.png',
  sourcePath: 'DLC/Prey/assets/sprites/source-scenes/prey-2022/feral-bone-mask-front-20261113.png',
  width: 256,
  height: 256,
  columns: 1,
  rows: 1,
  frameCount: 1,
  sourceScope: 'Outward-facing bone mask panel only; no interior, straps, launcher or lasers',
  fullEquipmentArtworkComplete: false,
  animationArtworkComplete: false,
  visualFidelityApproved: false,
  provenancePath: 'docs/assets/p0-p1-continuation-2026-11-13/bone-mask/prop-manifest.json'
});

let maskImage;

export function getSourceSceneBoneMaskArt(scene, role = 'ground') {
  const d = scene?.definition, actor = scene?.actor, art = PREY_BONE_MASK_FRONT_ART;
  if (!d || !(scene.done instanceof Set) || d.customBattle || d.isCustomBattle || d.isCustom
    || d.forceBaseArena || d.dlcSuppressedArena || actor?.id !== art.actorId || actor.universe !== art.universe
    || d.id !== art.stageId || d.sourceSceneId !== art.sourceSceneId || d.universe !== art.universe
    || d.mode !== art.mode || d.material !== 'prey' || d.incarnation !== art.incarnation) return null;
  const taken = scene.done.has('take_mask'), mounted = scene.done.has('set_mask');
  // The scene's flintlock beat does not qualify a separate mask lying on the
  // ground while the existing Feral sprite still wears it. Keep that location
  // as a command objective; this physical icon starts only after take_mask.
  if (role === 'ground') return null;
  if (role === 'carried') return taken && !mounted ? art : null;
  if (role === 'mounted') return taken && mounted ? art : null;
  return null;
}

/** A small prop or carried-item badge; no grasp, rotation or firing animation implied. */
export function drawSourceSceneBoneMask(ctx, scene, at, role = 'ground') {
  const art = getSourceSceneBoneMaskArt(scene, role);
  if (!art || typeof Image === 'undefined' || !Number.isFinite(at?.x) || !Number.isFinite(at?.y)) return false;
  if (!maskImage) {
    const image = new Image();
    maskImage = { image, status: 'loading' };
    const valid = () => image.naturalWidth === art.width && image.naturalHeight === art.height;
    image.decoding = 'async';
    image.onload = () => { maskImage.status = valid() ? 'ready' : 'error'; };
    image.onerror = () => { maskImage.status = 'error'; };
    image.src = art.path;
    if (image.complete && valid()) maskImage.status = 'ready';
  }
  if (maskImage.status !== 'ready') return false;
  const size = role === 'carried' ? 24 : 32;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(maskImage.image, at.x - size / 2, at.y - size, size, size);
  ctx.restore();
  return true;
}
