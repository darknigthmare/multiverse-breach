// A separate, read-only visual lifecycle follows the one-hit Shield Pal state.
// It cannot block a hit, spend a resource or add another protection charge.
const phases = Object.freeze({ arrival: .4, guard: .56, absorb: .4, departure: .4 });
const runtimeId = actor => actor?.battleId || actor?.runtimeId || actor?.id;
const sourceId = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;
export const SOURCE_PROTECTION_ENTITY_TIMINGS_WAVE16 = phases;
export function createProtectionEntityVisualWave16(actor, protection) {
  if (sourceId(actor) !== 'cuphead_ms_chalice' || actor.universe !== 'Cuphead'
    || !protection?.active || protection.kind !== 'shield-pal-one-hit'
    || protection.ownerRuntimeId !== runtimeId(actor) || protection.charges !== 1) return null;
  return Object.freeze({ assetId: 'shield-pal-wave16', ownerRuntimeId: runtimeId(actor), active: true,
    phase: 'arrival', phaseElapsed: 0, totalElapsed: 0, absorbedOnce: false, awaitingCasterRecovery: true,
    absorptionCount: 0, timingsAreEngineAdaptation: true, newNativePosesClaimed: false });
}
export function absorbProtectionEntityVisualWave16(state) {
  if (!state?.active || state.absorbedOnce || !['arrival', 'guard'].includes(state.phase)) return state;
  return Object.freeze({ ...state, phase: 'absorb', phaseElapsed: 0, absorbedOnce: true, awaitingCasterRecovery: false,
    absorptionCount: 1 });
}
export function advanceProtectionEntityVisualWave16(state, seconds, { paused = false, ownerAlive = true, shieldActive = true, casterAnimating = false } = {}) {
  if (!state?.active) return state;
  if (!ownerAlive) return Object.freeze({ ...state, active: false, phase: 'complete', endedBy: 'owner-dead' });
  if (paused || !Number.isFinite(seconds) || seconds <= 0) return state;
  if (state.awaitingCasterRecovery && casterAnimating) return state;
  state = state.awaitingCasterRecovery ? { ...state, awaitingCasterRecovery: false } : state;
  let phase = state.phase, elapsed = state.phaseElapsed + seconds;
  if (!shieldActive && ['arrival', 'guard'].includes(phase)) { phase = 'departure'; elapsed = 0; }
  // Carry a coarse simulation step through finite visual phases without
  // replaying an absorption or keeping a destroyed shield alive.
  for (let transition = 0; transition < 4; transition++) {
    if (phase === 'guard') { elapsed %= phases.guard; break; }
    if (elapsed < phases[phase]) break;
    elapsed -= phases[phase];
    phase = phase === 'arrival' ? 'guard' : phase === 'absorb' ? 'departure' : 'complete';
    if (phase === 'complete') return Object.freeze({ ...state, phase, phaseElapsed: 0,
      totalElapsed: state.totalElapsed + seconds, active: false, endedBy: 'departure-complete' });
  }
  return Object.freeze({ ...state, phase, phaseElapsed: elapsed, totalElapsed: state.totalElapsed + seconds });
}
export function sampleProtectionEntityVisualWave16(state) {
  if (!state?.active || !Object.hasOwn(phases, state.phase)) return null;
  const row = ['arrival', 'guard', 'absorb', 'departure'].indexOf(state.phase);
  const column = Math.max(0, Math.min(3, Math.floor(state.phaseElapsed / phases[state.phase] * 4 + 1e-8)));
  return Object.freeze({ assetId: state.assetId, phase: state.phase, row, col: column,
    index: row * 4 + column, ownerRuntimeId: state.ownerRuntimeId,
    absorptionCount: state.absorptionCount, visualOnly: true, source1to1Verified: false });
}
