import { drawSourceProtectionEntityWave16 } from './sourceProtectionEntityCatalogWave16.js';
import { createProtectionEntityVisualWave16, absorbProtectionEntityVisualWave16, advanceProtectionEntityVisualWave16 } from './protectionEntityRuntimeWave16.js';
import enemyAnchors from './sourceEnemyAnchorsWave16.generated.json' with { type: 'json' };
import { createWave16Protection, advanceWave16Protection, resolveWave16ProtectedHit } from './combatProtectionWave16.js';
import { isSourceControlProfileWave16, isSourceControlTargetEligibleWave16,
  createSourceControlWave16, advanceSourceControlWave16 } from './combatControlWave16.js';

export const sourceRuntimeIdWave16 = actor => actor?.battleId || actor?.runtimeId || actor?.id;
export const sourceHeroIdWave16 = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;
const alive = actor => actor?.currentHp > 0;
const protectionKind = profile => profile?.invulnerabilityKind || profile?.shieldKind || profile?.counterKind;

function protectionProfile(actor, profile) {
  // RPG describes self-selection as delivery:self; the source action still
  // declares support, which is the strict protection admission contract.
  if (profile?.delivery === 'self' && profile.targetSide === 'self'
    && profile.action?.targeting?.delivery === 'support') profile = { ...profile, delivery: 'support' };
  const summon = profile?.summon;
  if (summon?.kind === 'reinforcement' && summon.performer?.id === 'cuphead_mugman'
    && sourceHeroIdWave16(actor) === 'cuphead_cuphead') return {
    profile: { ...profile, sourceHeroId: 'cuphead_cuphead', kind: 'reinforcement' }, relay: true,
    performer: summon.performer
  };
  return { profile, relay: false, performer: null };
}

export function hasSourceProtectionProfileWave16(profile) { return !!protectionKind(profile); }
export function canBeginSourceProtectionWave16(actor, profile) {
  if (!hasSourceProtectionProfileWave16(profile)) return true;
  const normalized = protectionProfile(actor, profile);
  return !!createWave16Protection(actor, normalized.profile, { target: actor, relay: normalized.relay,
    performer: normalized.performer, existingState: actor.sourceProtectionWave16 });
}
export function armSourceProtectionWave16(actor, profile, target = actor) {
  if (!hasSourceProtectionProfileWave16(profile) || target !== actor) return false;
  const normalized = protectionProfile(actor, profile);
  const state = createWave16Protection(actor, normalized.profile, { target, relay: normalized.relay,
    performer: normalized.performer, existingState: actor.sourceProtectionWave16 });
  if (!state) return false;
  actor.sourceProtectionWave16 = state;
  if (state.kind === 'shield-pal-one-hit') actor.sourceProtectionEntityWave16 = createProtectionEntityVisualWave16(actor, state);
  return true;
}

export function interceptSourceProtectionHitWave16(target, attacker, damage, {
  delivery = 'melee', hostile = true, accepted = true, attackKind = '', isThrow = false,
  isGrab = false, unblockable = false, onCounter = null
} = {}) {
  if (!target?.sourceProtectionWave16?.active) return false;
  const result = resolveWave16ProtectedHit(target.sourceProtectionWave16, {
    accepted, hostile, damage, targetRuntimeId: sourceRuntimeIdWave16(target),
    attackerRuntimeId: sourceRuntimeIdWave16(attacker), attackerAlive: alive(attacker),
    delivery, attackKind, isThrow, isGrab, unblockable, ownerAlive: alive(target)
  });
  target.sourceProtectionWave16 = result.state;
  if (result.blocked && result.consumed && result.state?.kind === 'shield-pal-one-hit')
    target.sourceProtectionEntityWave16 = absorbProtectionEntityVisualWave16(target.sourceProtectionEntityWave16);
  if (result.counter && typeof onCounter === 'function') onCounter(result.counter);
  return result.blocked;
}

// A damage-over-time tick is not a new Shield Pal contact. A positive physical
// stage contact may consume that one charge; environmental damage cannot invent
// a Yukikaze counter against an ownerless arena.
export function interceptSourceEnvironmentalHitWave16(actor, damage, { kind = 'environment', contact = false } = {}) {
  const state = actor?.sourceProtectionWave16;
  if (!state?.active || state.kind !== 'mugman-super-art-ii' && !(contact && state.kind === 'shield-pal-one-hit')) return false;
  return interceptSourceProtectionHitWave16(actor, { runtimeId: 'source-environment:' + kind, currentHp: 0 }, damage,
    { delivery: 'area', attackKind: kind, hostile: true, accepted: true });
}

export const isSourceImmobilizedWave16 = actor => !!actor?.sourceControlWave16?.active
  && actor.sourceControlWave16.immobilize === true;

export function getPossessedBodyWave16(source, actors) {
  const id = sourceRuntimeIdWave16(source);
  return actors.find(actor => alive(actor) && actor.sourceControlWave16?.active
    && actor.sourceControlWave16.kind === 'possession' && actor.sourceControlWave16.phase === 'active'
    && actor.sourceControlWave16.sourceRuntimeId === id) || null;
}

export function releaseSourcePossessionWave16(source, actors) {
  const body = getPossessedBodyWave16(source, actors);
  if (!body) return false;
  body.sourceControlWave16 = advanceSourceControlWave16(body.sourceControlWave16, 0, { released: true });
  body.action = null; body.actionPending = false; body.vx = 0;
  body.rpgActionVersion = (body.rpgActionVersion || 0) + 1;
  source.sourcePossessionBodyWave16 = null;
  return true;
}

export function sourceEffectiveSideWave16(actor, actors, sideOf) {
  const state = actor?.sourceControlWave16;
  if (state?.active && state.kind === 'possession' && state.phase === 'active') {
    const owner = actors.find(unit => sourceRuntimeIdWave16(unit) === state.sourceRuntimeId);
    if (alive(owner)) return sideOf(owner);
  }
  return sideOf(actor);
}

export function beginSourceControlWave16(source, target, profile, { hostile = true, channelCompleted = true } = {}) {
  if (!isSourceControlProfileWave16(profile) || !isSourceControlTargetEligibleWave16(profile, target)) return false;
  const state = createSourceControlWave16(source, target, profile, { hostile, channelCompleted });
  if (!state) return false;
  target.sourceControlWave16 = state;
  target.sourceControlOwnerDamageVersionWave16 = source.sourceDamageVersionWave16 || 0;
  target.sourceControlOwnerHpWave16 = source.currentHp;
  target.action = null; target.queuedMeleeAction = null; target.actionPending = false;
  target.rpgActionVersion = (target.rpgActionVersion || 0) + 1;
  if (state.kind === 'paralyzer') {
    // Paralysis stops intentional movement; ordinary gravity still applies.
    target.vx = 0; target.charging = false; target.guarding = false;
    target.state = 'hit'; target.stateTimer = 0;
  }
  return true;
}

export function noteSourceDamageWave16(actor) {
  if (sourceHeroIdWave16(actor) === 'oddworld_abe_possession')
    actor.sourceDamageVersionWave16 = (actor.sourceDamageVersionWave16 || 0) + 1;
}

export function advanceSourceCombatStatusesWave16(actors, seconds, { paused = false, visualSeconds = seconds } = {}) {
  for (const actor of actors) {
    if (actor.sourceProtectionEntityWave16) actor.sourceProtectionEntityWave16 = advanceProtectionEntityVisualWave16(
      actor.sourceProtectionEntityWave16, visualSeconds, { paused, ownerAlive: alive(actor),
        shieldActive: actor.sourceProtectionWave16?.active === true && actor.sourceProtectionWave16.kind === 'shield-pal-one-hit',
        casterAnimating: !!actor.action || !!actor.sourceTacticsActionWave16
          || actor.state === 'special' && actor.rpgSpecialDurationTicks > 0 && actor.stateTimer > 0 });
    if (actor.sourceProtectionWave16) actor.sourceProtectionWave16 = advanceWave16Protection(actor.sourceProtectionWave16,
      seconds, { paused, ownerAlive: alive(actor) });
    const state = actor.sourceControlWave16;
    if (!state) continue;
    const source = actors.find(unit => sourceRuntimeIdWave16(unit) === state.sourceRuntimeId);
    actor.sourceControlWave16 = advanceSourceControlWave16(state, seconds, {
      paused, sourceAlive: alive(source), targetAlive: alive(actor),
      sourceInterrupted: !source || source.rpgControlTicks > 0 || source.combatControl?.remaining > 0
        || isSourceImmobilizedWave16(source) || source.currentHp < (actor.sourceControlOwnerHpWave16 ?? source.currentHp)
        || (source.sourceDamageVersionWave16 || 0) !== actor.sourceControlOwnerDamageVersionWave16
    });
    if (source) actor.sourceControlOwnerHpWave16 = source.currentHp;
    if (isSourceImmobilizedWave16(actor)) {
      actor.vx = 0; actor.action = null; actor.actionPending = false;
      actor.charging = false; actor.guarding = false; actor.state = 'hit'; actor.stateTimer = 0;
    } else if (!actor.sourceControlWave16.active && state.active && actor.currentHp > 0 && actor.state === 'hit') actor.state = 'idle';
  }
  for (const source of actors) {
    if (sourceHeroIdWave16(source) !== 'oddworld_abe_possession') continue;
    source.sourcePossessionBodyWave16 = getPossessedBodyWave16(source, actors);
    if (source.sourcePossessionBodyWave16) {
      source.vx = 0; source.charging = false; source.guarding = false;
    }
  }
}

export function getPossessedSligActionWave16(actor, slot = 'simple') {
  if (slot !== 'simple' || actor?.sourceControlWave16?.kind !== 'possession'
    || !actor.sourceControlWave16.active || actor.sourceControlWave16.phase !== 'active'
    || (actor.sourceEnemyId || actor.sourceId || actor.id) !== 'oddworld_slig' || actor.universe !== 'Oddworld') return null;
  return { name: 'Tir du fusil du Slig possédé', type: 'projectile', dmg: 1,
    animationDuration: .55, hitAt: .24, sourceHeroId: 'oddworld_slig', targeting: {
      effect: 'damage', delivery: 'projectile', targetSide: 'enemy', shape: 'single', range: 480, maxTargets: 1
    }, provenance: { sourceWork: 'Oddworld: Abe’s Oddysee (1997)',
      sourceReference: 'The already-rendered Slig retains its real rifle; possession redirects its actual input, not its stored faction.',
      source1to1Verified: false, gameplayAdaptation: true } };
}

export function getSourceRuntimeViewWave16(actor) {
  if (!actor) return actor;
  if (actor.sourceProtectionWave16?.active && actor.sourceProtectionWave16.kind === 'mugman-super-art-ii'
    && actor.sourceProtectionWave16.ownerRuntimeId === sourceRuntimeIdWave16(actor)
    && actor.universe === 'Cuphead' && ['cuphead_mugman', 'cuphead_cuphead'].includes(sourceHeroIdWave16(actor))
    && !actor.sourceMugmanProtectionVisualWave16) actor = { ...actor, sourceMugmanProtectionVisualWave16: true,
      spriteFilter: (actor.spriteFilter && actor.spriteFilter !== 'none' ? actor.spriteFilter + ' ' : '') + 'opacity(0.58) brightness(1.35)',
      protectionPresentationAdaptationWave16: 'Translucency of the current animated body; no new source ghost asset or official frame is claimed.' };
  if (actor.sourceProtectionWave16?.active && actor.sourceProtectionWave16.kind === 'yukikaze'
    && sourceHeroIdWave16(actor) === 'hakumen_bb' && !actor.action && !actor.sourceTacticsActionWave16) actor = {
      ...actor, presentationPhase: 'super', presentationProgress: .3, presentationImpactProgress: .41
    };
  if (actor.sourceProtectionEntityWave16?.active && actor.sourceProtectionEntityWave16.absorbedOnce
    && sourceHeroIdWave16(actor) === 'cuphead_ms_chalice' && (actor.action || actor.sourceTacticsActionWave16 || actor.state === 'special')) actor = {
      ...actor, presentationPhase: 'super', presentationProgress: .3, presentationImpactProgress: .41
    };
  if (actor.sourcePossessionBodyWave16 && !actor.sourceTacticsActionWave16 && !actor.action
    && !(actor.state === 'special' && actor.rpgSpecialDurationTicks > 0 && actor.stateTimer > 0)
    && sourceHeroIdWave16(actor) === 'oddworld_abe_possession') return {
    ...actor, sourceHeldPossessionViewWave16: true, presentationPhase: 'super', presentationProgress: .35, presentationImpactProgress: .5
  };
  if (actor.sourceEnemyId !== 'oddworld_slig' || actor.universe !== 'Oddworld') return actor;
  const action = actor.action?.sourceSligRifle ? actor.action : actor.rpgPossessedRifleActionWave16;
  let presentationFrame = actor.presentationFrame;
  if (action) {
    const duration = action.duration || .55, elapsed = action.elapsed || 0, hitAt = action.hitAt || .24;
    const col = elapsed < hitAt * .55 ? 0 : elapsed < hitAt ? 1 : elapsed < duration * .8 ? 2 : 3;
    presentationFrame = { row: 1, col };
  }
  return { ...actor, spriteSource: '/sprites/generated/bosses/oddworld/slig.png',
    ...(presentationFrame ? { presentationFrame } : {}),
    sourceSpriteLayoutWave16: { columns: 4, rows: 4, baseline: 244,
      rowByState: { idle: 0, run: 0, walk: 0, attack: 1, special: 1, support: 0,
        hit: 2, hurt: 2, hitStun: 2, defense: 3, dead: 3, defeat: 3 } } };
}

export function drawSourceCombatStatusWave16(ctx, actor, height = 72) {
  const control = actor?.sourceControlWave16, protection = actor?.sourceProtectionWave16;
  if (!ctx || !alive(actor)) return false;
  const entityDrawn = drawSourceProtectionEntityWave16(ctx, actor, height);
  if (!control?.active && (!protection?.active || protection.kind === 'shield-pal-one-hit' && entityDrawn)) return entityDrawn;
  ctx.save(); ctx.globalAlpha *= .75; ctx.lineWidth = Math.max(1, height / 60);
  ctx.strokeStyle = control?.active ? control.kind === 'paralyzer' ? '#79c9ff' : '#69deba' : '#ffe89b';
  ctx.beginPath(); ctx.ellipse(actor.x, actor.y - height * .46, height * .28, height * .52, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore(); return true;
}

export function projectSourceSligMuzzleWave16(actor, height = 72, column = 2) {
  if (actor?.sourceEnemyId !== 'oddworld_slig' || actor.universe !== 'Oddworld') return null;
  const data = enemyAnchors.enemies.oddworld_slig;
  const anchor = data.points.find(point => point.col === column && point.row === data.attackRow);
  if (!anchor) return null;
  const facing = actor.action?.facing || actor.facing || 1, scale = height / 256;
  return { x: actor.x + (anchor.x - 128) * scale * (facing < 0 ? -1 : 1),
    y: actor.y + (anchor.y - 244) * scale, nativePoint: { ...anchor },
    emits: anchor.emits === true, historicalArtworkReused: true };
}

export function canSourceControlTargetWave16(source, target, profile, { platforms = [], height = 72 } = {}) {
  if (!alive(source) || source === target || !isSourceControlProfileWave16(profile)
    || !isSourceControlTargetEligibleWave16(profile, target)
    || ![source.x, source.y, target.x, target.y].every(Number.isFinite)
    || Math.hypot(target.x - source.x, target.y - source.y) > profile.range + .001) return false;
  const a = { x: source.x, y: source.y - height * .42 }, b = { x: target.x, y: target.y - height * .42 };
  return !platforms.some(platform => {
    if (platform.lineOfSightTransparent || platform.transparent) return false;
    const left = Number(platform.x1 ?? platform.x), right = Number(platform.x2 ?? left + platform.width);
    const top = Number(platform.y), bottom = top + Math.max(2, Number(platform.thickness) || 12);
    if (![left, right, top, bottom].every(Number.isFinite) || right <= left) return false;
    const dx = b.x - a.x, dy = b.y - a.y;
    let near = 0, far = 1;
    for (const [p, q] of [[-dx, a.x - left], [dx, right - a.x], [-dy, a.y - top], [dy, bottom - a.y]]) {
      if (Math.abs(p) < 1e-9) { if (q < 0) return false; }
      else if (p < 0) near = Math.max(near, q / p);
      else far = Math.min(far, q / p);
      if (near > far) return false;
    }
    return far > .01 && near < .99;
  });
}

export function clearSourceCombatStatusesWave16(actors, reason = 'scene-exit') {
  for (const actor of actors) {
    if (actor.sourceControlWave16?.active) actor.sourceControlWave16 = advanceSourceControlWave16(actor.sourceControlWave16, 0, { released: true });
    if (actor.sourceProtectionWave16?.active) actor.sourceProtectionWave16 = Object.freeze({ ...actor.sourceProtectionWave16,
      active: false, charges: 0, remaining: 0, endedBy: reason });
    if (actor.sourceProtectionEntityWave16?.active) actor.sourceProtectionEntityWave16 = Object.freeze({ ...actor.sourceProtectionEntityWave16,
      active: false, phase: 'complete', phaseElapsed: 0, endedBy: reason });
    if (actor.sourcePossessionBodyWave16) actor.sourcePossessionBodyWave16 = null;
    if (actor.rpgPossessedRifleActionWave16) actor.rpgPossessedRifleActionWave16 = null;
  }
}
