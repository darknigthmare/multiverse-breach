// Source-specific protections. Engines own clocks, costs, collision acceptance
// and the physical counter attack; this module only returns immutable decisions.
export const MUGMAN_INVULNERABILITY_SECONDS = 4.85;
export const WAVE16_PROTECTION_KIND = Object.freeze({
  invulnerability: 'mugman-super-art-ii', shieldPal: 'shield-pal-one-hit', counter: 'yukikaze'
});
const identities = Object.freeze({
  'mugman-super-art-ii': ['cuphead_mugman', 'Cuphead'],
  'shield-pal-one-hit': ['cuphead_ms_chalice', 'Cuphead'],
  yukikaze: ['hakumen_bb', 'BlazBlue']
});
const aliases = Object.freeze({ invulnerability: 'mugman-super-art-ii', 'shield-pal': 'shield-pal-one-hit', counter: 'yukikaze' });
const value = (profile, key) => profile?.[key] ?? profile?.targeting?.[key];
const sourceId = actor => actor?.sourceHeroId ?? actor?.sourceId ?? actor?.heroId ?? actor?.id;
const runtimeId = actor => actor?.battleId ?? actor?.runtimeId ?? actor?.id;
const living = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0 && actor.state !== 'dead';
const canonicalKind = kind => aliases[kind] || kind;
const inferKind = profile => value(profile, 'invulnerabilityKind') || value(profile, 'shieldKind') || value(profile, 'counterKind');
const zeroDamageGuard = profile => value(profile, 'effect') === 'guard'
  && value(profile, 'delivery') === 'support' && value(profile, 'shape') === 'single'
  && Number(profile?.multiplier ?? profile?.dmg) === 0;

export function isWave16ProtectionProfile(profile, kind = inferKind(profile)) {
  kind = canonicalKind(kind);
  const identity = identities[kind];
  if (!identity || !zeroDamageGuard(profile) || value(profile, 'targetSide') !== 'self') return false;
  if (profile.sourceHeroId !== identity[0] || profile.universe !== identity[1]) return false;
  if (kind === 'mugman-super-art-ii') return value(profile, 'invulnerabilityKind') === kind;
  if (kind === 'shield-pal-one-hit') return value(profile, 'shieldKind') === kind && value(profile, 'shieldHits') === 1;
  return value(profile, 'counterKind') === kind && value(profile, 'counterRequiresIncomingContact') === true;
}

export function createWave16Protection(actor, profile, {
  kind = inferKind(profile), target = actor, performer = profile?.performer,
  relay = false, duration, existingState = null
} = {}) {
  kind = canonicalKind(kind);
  if (!identities[kind] || !living(actor) || target !== actor || !runtimeId(actor)) return null;
  if (existingState?.active && existingState.kind === kind && existingState.ownerRuntimeId === runtimeId(actor)) return null;
  if (relay) {
    // The transfer is an explicit crossover adaptation, never Mugman's source
    // ability gaining an arbitrary allied/group target through its name.
    if (kind !== 'mugman-super-art-ii' || sourceId(actor) !== 'cuphead_cuphead' || actor.universe !== 'Cuphead'
      || profile?.sourceHeroId !== 'cuphead_cuphead' || profile.universe !== 'Cuphead'
      || profile.kind !== 'reinforcement' || !zeroDamageGuard(profile)
      || !['self', 'ally'].includes(value(profile, 'targetSide'))
      || sourceId(performer) !== 'cuphead_mugman' || performer?.universe !== 'Cuphead'
      || value(profile, 'invulnerabilityKind') !== kind) return null;
  } else if (!isWave16ProtectionProfile(profile, kind)
    || sourceId(actor) !== identities[kind][0] || actor.universe !== identities[kind][1]) return null;

  let seconds = null, charges = null, counterMultiplier = null;
  if (kind === 'mugman-super-art-ii') {
    seconds = MUGMAN_INVULNERABILITY_SECONDS;
    const declared = value(profile, 'invulnerabilityDuration') ?? value(profile, 'duration');
    if ((duration !== undefined && duration !== seconds) || (declared !== undefined && declared !== seconds)) return null;
  } else if (kind === 'shield-pal-one-hit') {
    // Shield Pal persists until the next damaging hit; it is not a short guard
    // timer and cannot stack several living shields from repeated casts.
    charges = 1;
  } else {
    seconds = duration ?? value(profile, 'counterWindowDuration');
    counterMultiplier = value(profile, 'counterMultiplier');
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 3
      || !Number.isFinite(counterMultiplier) || counterMultiplier <= 0 || counterMultiplier > 16) return null;
  }
  return Object.freeze({ kind, active: true, sourceHeroId: identities[kind][0], universe: identities[kind][1],
    sourceRuntimeId: runtimeId(actor), ownerRuntimeId: runtimeId(actor),
    duration: seconds, remaining: seconds, charges, counterMultiplier, relay: !!relay });
}

export function advanceWave16Protection(state, seconds, { paused = false, ownerAlive = true } = {}) {
  if (!state || !state.active) return state;
  if (!ownerAlive) return Object.freeze({ ...state, active: false, remaining: 0, charges: 0, endedBy: 'owner-dead' });
  if (paused || state.kind === 'shield-pal-one-hit' || !Number.isFinite(seconds) || seconds <= 0) return state;
  const remaining = Math.max(0, state.remaining - seconds);
  return Object.freeze({ ...state, remaining, active: remaining > 0, ...(remaining > 0 ? {} : { endedBy: 'expired' }) });
}

export function resolveWave16ProtectedHit(state, hit) {
  const unchanged = () => ({ state, blocked: false, consumed: false, counter: null });
  if (!state?.active || !identities[state.kind] || (state.remaining !== null && !(state.remaining > 0))) return unchanged();
  if (hit?.accepted !== true || hit.hostile !== true || hit.targetRuntimeId !== state.ownerRuntimeId
    || hit.attackerRuntimeId === state.ownerRuntimeId || !Number.isFinite(hit.damage) || hit.damage <= 0
    || hit.alreadyBlocked || hit.immune || hit.ownerAlive === false) return unchanged();
  if (state.kind === 'mugman-super-art-ii') return { state, blocked: true, consumed: false, counter: null };
  if (state.kind === 'shield-pal-one-hit') {
    if (state.charges !== 1) return unchanged();
    return { state: Object.freeze({ ...state, active: false, charges: 0, endedBy: 'damaging-hit' }), blocked: true, consumed: true, counter: null };
  }
  const kind = String(hit.attackKind || hit.type || hit.delivery || '').toLowerCase();
  if (hit.unblockable || hit.isThrow || hit.isGrab || /throw|grab/.test(kind)
    || !['melee', 'projectile', 'beam', 'area'].includes(hit.delivery)) return unchanged();
  const projectile = hit.delivery === 'projectile' || hit.delivery === 'beam';
  const counter = hit.attackerRuntimeId && hit.attackerAlive !== false ? Object.freeze({
    sourceRuntimeId: state.ownerRuntimeId, targetRuntimeId: hit.attackerRuntimeId,
    multiplier: state.counterMultiplier, capturedDelivery: hit.delivery,
    projectileOwnerLocked: false, captureWasProjectile: projectile,
    requiresPhysicalContact: true, canEvade: true, teleport: false, damageApplied: false
  }) : null;
  return { state: Object.freeze({ ...state, active: false, remaining: 0, endedBy: 'counter-capture' }),
    blocked: true, consumed: true, counter };
}
