import { drawSourceNativeAtlasWave16 as drawCosmeticAtlasFrame, preloadSourceNativeSheetsWave16 as preloadSpriteSheetSrcs } from './sourceNativeRendererWave16.js';
import { getFoxDevilNativeFrameWave16, projectFoxDevilMouthWave16 } from './rosterSummonChoreographyWave16.js';
import { getProjectilePresentationWave16 } from './projectilePresentationWave16.js';
import { NATIVE_SUPER_DEFINITIONS_WAVE16 as definitions, supportsNativeSuperWave16, supportsTrackedProjectileVisualWave16 } from './nativeSuperAdmissionWave16.js';
export { supportsNativeSuperWave16, supportsTrackedProjectileVisualWave16 } from './nativeSuperAdmissionWave16.js';
import { getCharacterAnimationFrame, getCharacterActionAnimationAssetsWave16 } from './characterAnimationCatalog.js';
import { getSourceHitSequenceWave16 } from './combatHitSequenceWave16.js';
import partA from './nativeSuperAnchorsWave16PartA.generated.json' with { type: 'json' };
import partB from './nativeSuperAnchorsWave16PartB.generated.json' with { type: 'json' };
import partC from './nativeSuperAnchorsWave16PartC.generated.json' with { type: 'json' };

const anchors = { ...partA, ...partB, ...partC };
const unit = value => Math.max(0, Math.min(1, Number(value) || 0));
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
// No movement is inferred from a military role or from a power's name. The
// selected native poses contain the bracing, recoil and casting gestures.
export const sampleNativeSuperMotionWave16 = () => ({ x: 0, y: 0 });

export function projectNativeSuperAnchorWave16(actor, progress, impactProgress, height) {
  const phase = actor?.presentationPhase === 'fatality' ? 'fatality' : 'super';
  const frame = getCharacterAnimationFrame(actor, { phase, progress, impactProgress });
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  if (!frame) return null;
  const column = Number.isInteger(actor.presentationFrame?.col)
    ? Math.max(0, Math.min(3, actor.presentationFrame.col)) : frame.col;
  const anchor = anchors[id]?.[phase]?.[column];
  if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) return null;
  const renderScale = Math.max(0.5, Math.min(id === 'bt_7274_tf2' ? 8 : 3, Number(frame.asset.normalization?.rows?.[frame.row]?.renderScale) || 1));
  const scale = height / frame.asset.frameHeight * renderScale;
  const facing = actor.action?.facing < 0 || (!actor.action && actor.facing < 0) ? -1 : 1;
  return { x: number(actor.x, 0) + (anchor.x - frame.asset.frameWidth / 2) * scale * facing,
    y: number(actor.y, 0) + (anchor.y - (frame.asset.normalization?.baseline || 244)) * scale,
    phase, col: column, nativePoint: { ...anchor }, renderScale };
}

// Simulation owns targets, costs, collision and time. This pure projection
// receives accepted contact from the engines; it cannot create a hit or enemy.
export function getNativeSuperVisualStateWave16({ actor, profile, action, target, height = 72, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave16(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const sourceDefinition = definitions[profile.sourceHeroId];
  const definition = profile.counterTriggered ? [...sourceDefinition.slice(0, 3), 'damage', 'melee', sourceDefinition[5]] : sourceDefinition;
  const controlling = definition[3] === 'control', supportive = definition[3] !== 'damage' && !controlling;
  const duration = Math.max(0.01, number(action.duration, 1.1));
  const elapsed = Math.max(0, number(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, number(action.hitAt, duration * 0.5)));
  const progress = unit(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  // Admission above identifies the selected gameplay profile. Native artwork
  // remains a separate fact; rejected/missing art cannot acquire painted VFX.
  const nativeArtworkAvailable = !!getCharacterAnimationFrame({ ...actor, action: { ...action, identity: profile } }, {
    phase: actor.presentationPhase === 'fatality' ? 'fatality' : 'super', progress, impactProgress
  });
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, number(height, 72)));
  const range = Math.max(1, Math.min(10000, number(profile.range, 640)));
  const radialOrigin = profile.delivery === 'radial' && contactVisual?.confirmed === true ? contactVisual.origin : null;
  const ground = { x: number(radialOrigin?.x, number(actor.x, 0)), y: number(radialOrigin?.y, number(actor.y, 0)) };
  const tx = number(target?.x, ground.x + facing * Math.min(range, 240)), ty = number(target?.y, ground.y);
  const forward = (tx - ground.x) * facing;
  const confirmed = !supportive && contactVisual?.confirmed === true && Number.isFinite(contactVisual.x) && Number.isFinite(contactVisual.y);
  const point = supportive ? { ...ground } : confirmed ? { x: contactVisual.x, y: contactVisual.y }
    : { x: ground.x + facing * (forward > 0 ? Math.min(range, forward) : range), y: ty };
  const anchor = projectNativeSuperAnchorWave16({ ...actor, action: { ...action, facing, identity: profile } }, progress, impactProgress, height);
  const origin = anchor ? { x: anchor.x, y: anchor.y } : { x: ground.x, y: ground.y - height * 0.45 };
  const tracked = supportsTrackedProjectileVisualWave16(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: number(projectileVisual.x, origin.x), y: number(projectileVisual.y, origin.y),
      travelProgress: unit(projectileVisual.travelProgress), elapsed: Math.max(0, number(projectileVisual.elapsed, 0)),
      duration: Math.max(0.001, number(projectileVisual.duration, 0.24)) } : null;
  let sourceEntity = null;
  if (profile.sourceHeroId === 'aki_hayakawa') {
    const phase = elapsed < hitAt * .55 ? 'arrival' : elapsed < hitAt ? 'preparation'
      : elapsed < hitAt + (duration - hitAt) * .65 ? 'attack' : 'recovery';
    const col = phase === 'arrival' ? Math.min(3, Math.floor(progress / (impactProgress * .55) * 4))
      : phase === 'preparation' ? Math.min(3, Math.floor((progress - impactProgress * .55) / (impactProgress * .45) * 4))
        : phase === 'attack' ? Math.min(3, 2 + Math.floor((elapsed - hitAt) / Math.max(.01, (duration - hitAt) * .65) * 2))
          : Math.min(3, Math.floor((progress - (impactProgress + (1 - impactProgress) * .65)) / Math.max(.01, (1 - impactProgress) * .35) * 4));
    const native = getFoxDevilNativeFrameWave16({ phase, column: col });
    const size = height * 2.4, mouth = projectFoxDevilMouthWave16({ phase: 'attack', column: 2, x: 0, y: 0, facing, size });
    if (native && mouth) {
      const contact = { x: point.x, y: point.y - height * .42 };
      const x = contact.x - mouth.x, y = contact.y - mouth.y;
      sourceEntity = { ...native, phase, column: col, x, y, size, facing,
        mouth: projectFoxDevilMouthWave16({ phase, column: col, x, y, facing, size }),
        accepted: confirmed, target: contact, nativeEntityRequired: true };
    }
  }
  return { family: 'native-wave16', heroId: profile.sourceHeroId, name: profile.name, kind: definition[2], effect: definition[3], weaponType: definition[5],
    supportive, controlling, projectilePresentation: getProjectilePresentationWave16(definition[2]), delivery: definition[4], progress, impactProgress, release: elapsed >= hitAt, releaseProgress: unit((elapsed - hitAt) / Math.max(0.001, duration - hitAt)),
    hitSequence: getSourceHitSequenceWave16(profile),
    facing, height, range, color: profile.color || '#d2e6ff', ground, motion: { x: 0, y: 0 }, origin, target: point,
    ...(sourceEntity ? { sourceEntity } : {}),
    nativeArtworkAvailable, nativeMuzzleActive: nativeArtworkAvailable && !!anchor && anchor.col === 2, nativeAnchor: anchor,
    contactEligible: !supportive && (contactVisual !== null ? confirmed : !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96),
    ...(contactVisual !== null ? { contactVisual: confirmed ? { confirmed: true, ...point } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

export function drawNativeSuperVisualsWave16(ctx, state) {
  if (!state) return false;
  if (state.sourceEntity) {
    const entity = state.sourceEntity, asset = entity.asset;
    ctx.save(); ctx.translate(entity.x, entity.y);
    drawCosmeticAtlasFrame(ctx, { ...asset, row: entity.frame.row }, entity.frame.col,
      0, entity.size / 2 - (asset.normalization?.baseline || 244) / asset.frameHeight * entity.size,
      asset.frameWidth / asset.frameHeight * entity.size, entity.size, { facing: entity.facing });
    ctx.restore();
  }
  if (!state.nativeArtworkAvailable) return true;
  const { kind, ground, origin, target, height: h, facing, progress: p, release, releaseProgress: q } = state;
  const s = h / 72, center = { x: target.x, y: target.y - h * 0.42 };
  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const ring = (x, y, radius, flatten = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, radius), Math.max(0.01, radius * flatten), 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.globalAlpha *= 0.82; ctx.lineWidth = 2 * s; ctx.strokeStyle = state.color;
  const contact = () => { if (release && state.contactEligible) ring(center.x, center.y, (5 + 17 * q) * s); };
  // Finite shot feedback follows the engine-owned projectile. It draws no gun,
  // limb, creature, portal or new hit. Conventional rifles and handguns retain finite shot feedback.
  const shot = (x, y) => {
    const visual = state.projectilePresentation;
    ctx.strokeStyle = visual.color;
    if (visual.shape === 'arrow') {
      line({ x: x - facing * 9 * s, y }, { x: x + facing * 4 * s, y });
    } else if (visual.shape === 'orb') ring(x, y, 3 * s);
    else if (visual.shape === 'crystal') {
      ctx.beginPath(); ctx.moveTo(x, y - 4 * s); ctx.lineTo(x + 3 * s, y);
      ctx.lineTo(x, y + 4 * s); ctx.lineTo(x - 3 * s, y); ctx.closePath(); ctx.stroke();
    } else if (visual.shape === 'spark') {
      ctx.beginPath(); ctx.moveTo(x - facing * 6 * s, y + 2 * s); ctx.lineTo(x, y - 2 * s);
      ctx.lineTo(x + facing * 4 * s, y + s); ctx.stroke();
    } else if (visual.shape === 'rocket-marker') {
      line({ x: x - facing * 8 * s, y }, { x: x + facing * 4 * s, y });
      ring(x, y, 2 * s);
    } else line({ x: x - facing * 6 * s, y }, { x: x + facing * 5 * s, y });
  };
  if (state.controlling) {
    // Persistent suspension belongs to the controlled target's simulation state.
    // This short cast marker only acknowledges an accepted enemy bind.
    if (release && state.contactEligible) { ctx.strokeStyle = kind === 'dominator-paralyzer' ? '#79c6ff' : '#79d9ed'; contact(); }
  } else if (state.supportive) {
    // A small ground UI marker accompanies actual native gestures. It creates
    // no magical links, equipment, vehicle, shields or physiological powers.
    ctx.globalAlpha *= release ? 1 - q * 0.6 : 0.3 + p;
    ctx.strokeStyle = kind === 'maintenance' ? '#8fc2cf' : '#bbd3a0';
    ring(ground.x, ground.y - 2 * s, (11 + p * 5) * s, 0.23);
  } else if (state.delivery === 'radial') {
    // Actor-centred effects receive only accepted local contact feedback.
    // A role or weapon name cannot manufacture a remote impact.
    if (release && state.contactEligible) { ring(ground.x, ground.y - h * .35, (7 + 20 * q) * s); contact(); }
  } else if (state.delivery === 'melee') {
    // Native physical strike poses perform the action.
    // Canvas supplies only feedback for a hit accepted by the engine.
    contact();
  } else if (state.delivery === 'beam') {
    // The selected source beam starts at its measured emitter and reaches only
    // an accepted contact. A missed cast creates no remote impact.
    if (release && state.contactEligible && state.nativeMuzzleActive && q <= .42) {
      ctx.strokeStyle = state.projectilePresentation.color;
      ctx.lineWidth = (kind === 'cup-head-beam' ? 8 : 3) * s;
      line(origin, center);
    }
    contact();
  } else if (state.delivery === 'area') {
    contact();
  } else if (state.projectileVisual) {
    const v = state.projectileVisual;
    if (v.phase === 'launch' && state.nativeMuzzleActive && p <= state.impactProgress + 0.1) ring(origin.x, origin.y, (2 + p * 3) * s);
    else if (v.phase === 'flight') {
      shot(v.x, v.y);
    } else if (v.phase === 'impact') ring(v.x, v.y, (4 + 17 * unit(v.elapsed / v.duration)) * s);
  } else {
    // RPG/Melee resolve accepted contact at hitAt, when native column2 releases.
    // Their aiming pose cannot launch a cosmetic projectile before that clock.
    // The native release supplies the muzzle gesture; only accepted contact gets
    // feedback here. Actual physical Fighter flights use the tracked branch.
    contact();
  }
  ctx.restore(); return true;
}

export function preloadNativeSuperAssetsWave16(actors = []) {
  if (actors.some(actor => (actor.sourceHeroId || actor.sourceId || actor.id) === 'kirito_sao'
    && actor.universe === 'Sword Art Online')) preloadSpriteSheetSrcs(getCharacterActionAnimationAssetsWave16().map(asset => asset.sheet));
  if (actors.some(actor => (actor.sourceHeroId || actor.sourceId || actor.id) === 'aki_hayakawa'
    && actor.universe === 'Chainsaw Man')) {
    const asset = getFoxDevilNativeFrameWave16()?.asset;
    if (asset) preloadSpriteSheetSrcs([asset.sheet]);
  }
}
