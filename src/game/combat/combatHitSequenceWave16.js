// Source-selected sequences. The counts are not inferred from a weapon/name.
// Kirito16 and Liberate7 are source counts; BT14 is a declared engine sampling
// of continuous fire. Their schedules remain documented engine timings.
const selections = Object.freeze({
  kirito_sao: Object.freeze({ universe: 'Sword Art Online', kind: 'starburst-stream', hitCount: 16 }),
  aya_brea: Object.freeze({ universe: 'Parasite Eve', kind: 'liberate', hitCount: 7 }),
  bt_7274_tf2: Object.freeze({ universe: 'Titanfall 2', kind: 'automatic-core', hitCount: 14 })
});
const finite = value => Number.isFinite(Number(value));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function getSourceHitSequenceWave16(profile) {
  const selected = selections[profile?.sourceHeroId];
  const action = profile?.sourceAbility || profile?.action;
  const raw = profile?.hitSequence || action?.targeting?.hitSequence || action?.hitSequence;
  if (!selected || profile.universe !== selected.universe || profile.effect !== 'damage'
    || !raw || raw.kind !== selected.kind || Number(raw.hitCount) !== selected.hitCount) return null;
  const duration = Number(action?.animationDuration ?? profile.duration);
  const firstAt = Number(raw.firstAt), lastAt = Number(raw.lastAt);
  if (![duration, firstAt, lastAt].every(finite) || duration <= 0 || duration > 8
    || firstAt <= 0 || lastAt <= firstAt || lastAt >= duration) return null;
  const interval = (lastAt - firstAt) / (selected.hitCount - 1);
  const requestedWindow = typeof raw.releaseWindow === 'object'
    ? Number(raw.releaseWindow.end) - Number(raw.releaseWindow.start) : Number(raw.releaseWindow);
  const releaseWindow = clamp(finite(requestedWindow) && requestedWindow > 0 ? requestedWindow : interval * .45,
    Math.min(1 / 120, interval), interval);
  return Object.freeze({ kind: selected.kind, hitCount: selected.hitCount, duration, firstAt, lastAt, interval,
    releaseWindow, recoveryAfter: clamp(Number(raw.nativeRecoveryAfter) || lastAt + releaseWindow, lastAt, duration),
    countIsEngineSampling: selected.kind === 'automatic-core',
    times: Object.freeze(Array.from({ length: selected.hitCount }, (_, index) => firstAt + index * interval)) });
}

// Mark each due release before returning it, so a coarse simulation step or a
// repeated callback cannot emit a hit twice. The engine still owns accepted
// targets, collision, HP, costs and interruption; this pure schedule grants none.
export function takeDueSourceHitsWave16(action, profile, elapsed = action?.elapsed) {
  const sequence = getSourceHitSequenceWave16(profile);
  if (!sequence || !action || action.sequenceCancelled || !finite(elapsed)) return [];
  const cursor = Math.max(0, Math.min(sequence.hitCount, Math.floor(Number(action.sequenceCursor) || 0)));
  const due = [];
  for (let index = cursor; index < sequence.hitCount && sequence.times[index] <= Number(elapsed) + 1e-9; index++) {
    action.sequenceCursor = index + 1;
    due.push({ index, time: sequence.times[index], count: sequence.hitCount, fraction: 1 / sequence.hitCount,
      final: index === sequence.hitCount - 1 });
  }
  return due;
}

export function sourceSequenceColumnWave16(profile, elapsed) {
  const sequence = getSourceHitSequenceWave16(profile);
  if (!sequence || !finite(elapsed)) return null;
  const time = Math.max(0, Number(elapsed));
  if (time < sequence.firstAt * .55) return 0;
  if (time < sequence.firstAt) return 1;
  if (time >= sequence.recoveryAfter) return 3;
  const index = clamp(Math.floor((time - sequence.firstAt + 1e-9) / sequence.interval), 0, sequence.hitCount - 1);
  return time - sequence.times[index] <= sequence.releaseWindow + 1e-9 ? 2 : 1;
}

export function sequenceTargetStillAcceptedWave16(action, targets, idOf) {
  if (!Array.isArray(action?.sequenceTargetIds)) return targets;
  const accepted = new Set(action.sequenceTargetIds);
  return targets.filter(target => target?.currentHp > 0 && accepted.has(idOf(target)));
}

// Split a bounded move after per-hit defenses, rather than applying a minimum
// damage once for every fragment. Fractional rounding is carried between hits;
// changing a target's guard cannot enlarge the first accepted total budget.
export function allocateSourceSequenceDamageWave16(action, targetId, potentialTotal, requestedPortion, precision = 1) {
  if (!action || typeof targetId !== 'string' || !targetId || !finite(potentialTotal)
    || !finite(requestedPortion) || potentialTotal < 0 || requestedPortion < 0) return 0;
  precision = finite(precision) && Number(precision) > 0 ? Number(precision) : 1;
  action.sequenceDamageBudgets ||= Object.create(null);
  const bucket = action.sequenceDamageBudgets[targetId] ||= {
    limit: Math.floor(Number(potentialTotal) * precision + 1e-9) / precision, spent: 0, carry: 0
  };
  bucket.carry += Number(requestedPortion);
  const rounded = Math.floor(bucket.carry * precision + 1e-9) / precision;
  const damage = Math.max(0, Math.min(bucket.limit - bucket.spent, rounded));
  bucket.carry -= damage; bucket.spent += damage;
  return damage;
}
