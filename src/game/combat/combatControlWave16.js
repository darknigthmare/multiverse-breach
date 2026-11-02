// Typed source controls. No actor, faction, HP, position or input is mutated
// here. Engines resolve the channel, proxy actual inputs and preserve gravity.
const identities = Object.freeze({ possession: ['oddworld_abe_possession', 'Oddworld'],
  paralyzer: ['akane_tsunemori', 'Psycho-Pass'] });
const value = (profile, key) => profile?.[key] ?? profile?.targeting?.[key];
const sourceId = actor => actor?.sourceHeroId ?? actor?.sourceId ?? actor?.heroId ?? actor?.id;
const runtimeId = actor => actor?.battleId ?? actor?.runtimeId ?? actor?.id;
const living = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0 && actor.state !== 'dead';
const positive = number => Number.isFinite(number) && number > 0;
const kindOf = profile => value(profile, 'controlKind');
const authorizationOf = profile => profile?.controlAuthorization ?? value(profile, 'authorization');

export function isSourceControlProfileWave16(profile) {
  const kind = kindOf(profile), identity = identities[kind];
  if (!identity || profile.sourceHeroId !== identity[0] || profile.universe !== identity[1]
    || value(profile, 'effect') !== 'control' || value(profile, 'delivery') !== 'control'
    || value(profile, 'targetSide') !== 'enemy' || value(profile, 'shape') !== 'single'
    || Number(profile.multiplier ?? profile.dmg) !== 0 || value(profile, 'maxTargets') !== 1) return false;
  return kind !== 'paralyzer' || (authorizationOf(profile) === 'sibyl-s1e21-exception'
    && value(profile, 'requiresExplicitTargetEligibility') === true);
}

export function isSourceControlTargetEligibleWave16(profile, target) {
  if (!isSourceControlProfileWave16(profile) || !living(target) || target.isBoss || target.isWorldBoss
    || target.controlImmune || target.invulnerable > 0 || target.rpgControlTicks > 0
    || target.sourceProtectionWave16?.active && target.sourceProtectionWave16.kind === 'mugman-super-art-ii'
    || target.sourceControlWave16?.active || target.combatControl?.remaining > 0) return false;
  if (kindOf(profile) === 'paralyzer') return target.paralyzerEligible === true;
  const enemyId = target.sourceEnemyId ?? target.enemyId ?? target.sourceId ?? target.sourceHeroId ?? target.id;
  return enemyId === 'oddworld_slig' && target.universe === 'Oddworld'
    && target.species === 'slig' && target.possessionEligible === true;
}

const proxy = state => Object.freeze({ controllerRuntimeId: state.sourceRuntimeId,
  bodyRuntimeId: state.targetRuntimeId, originalSide: state.originalSide,
  canMove: true, canAttack: true, changesFaction: false });
const activate = state => Object.freeze({ ...state, phase: 'active', channelRemaining: 0,
  immobilize: state.kind === 'paralyzer', lift: 0,
  inputProxy: state.kind === 'possession' ? proxy(state) : null });

export function createSourceControlWave16(source, target, profile, {
  sourceRuntimeId = runtimeId(source), targetRuntimeId = runtimeId(target),
  hostile = false, channelCompleted = false
} = {}) {
  if (!living(source) || source === target || hostile !== true
    || !isSourceControlTargetEligibleWave16(profile, target)) return null;
  const kind = kindOf(profile), identity = identities[kind];
  if (sourceId(source) !== identity[0] || source.universe !== identity[1]
    || typeof sourceRuntimeId !== 'string' || typeof targetRuntimeId !== 'string'
    || !sourceRuntimeId || !targetRuntimeId || sourceRuntimeId === targetRuntimeId) return null;
  const duration = profile.controlDuration ?? value(profile, 'duration');
  const channelDuration = kind === 'possession'
    ? profile.controlChannelDuration ?? value(profile, 'channelDuration') : 0;
  if (!positive(duration) || duration > 8 || !Number.isFinite(channelDuration)
    || channelDuration < 0 || channelDuration > 4) return null;
  const state = { kind, active: true, sourceHeroId: identity[0], universe: identity[1],
    sourceRuntimeId, controllerRuntimeId: sourceRuntimeId, targetRuntimeId,
    duration, remaining: duration, channelDuration,
    channelRemaining: channelCompleted ? 0 : channelDuration,
    originalSide: target.side ?? target.team ?? null,
    phase: !channelCompleted && channelDuration > 0 ? 'channeling' : 'active',
    immobilize: false, lift: 0, inputProxy: null,
    authorization: kind === 'paralyzer' ? authorizationOf(profile) : null };
  return state.phase === 'active' ? activate(state) : Object.freeze(state);
}

export function advanceSourceControlWave16(state, seconds, {
  paused = false, sourceAlive = true, targetAlive = true,
  sourceInterrupted = false, released = false
} = {}) {
  if (!state?.active || !identities[state.kind]) return state;
  const end = reason => Object.freeze({ ...state, active: false, phase: 'ended', remaining: 0,
    channelRemaining: 0, inputProxy: null, immobilize: false, lift: 0, endedBy: reason });
  if (!targetAlive) return end('target-dead');
  if (released) return end('released');
  if (state.kind === 'possession' && (!sourceAlive || sourceInterrupted)) return end(!sourceAlive ? 'source-dead' : 'channel-interrupted');
  if (paused || !Number.isFinite(seconds) || seconds <= 0) return state;
  let next = state, elapsed = seconds;
  if (state.phase === 'channeling') {
    const channelRemaining = Math.max(0, state.channelRemaining - elapsed);
    if (channelRemaining > 0) return Object.freeze({ ...state, channelRemaining });
    elapsed = Math.max(0, elapsed - state.channelRemaining);
    next = activate(state);
  }
  const remaining = Math.max(0, next.remaining - elapsed);
  return remaining > 0 ? Object.freeze({ ...next, remaining }) : end('expired');
}
