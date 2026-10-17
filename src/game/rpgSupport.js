// Pure support rules shared by target eligibility, preview and impact.
const NEGATIVE_STATUSES = Object.freeze(['infected', 'glitched', 'radiated']);

export function getRpgCleansableStatuses(target, cleanses) {
  const requested = cleanses === true ? NEGATIVE_STATUSES
    : Array.isArray(cleanses) ? cleanses : typeof cleanses === 'string' ? [cleanses] : [];
  return NEGATIVE_STATUSES.filter(status => requested.includes(status)
    && Number.isFinite(target?.statusEffects?.[status]) && target.statusEffects[status] > 0);
}

export function cleanseRpgStatuses(target, cleanses) {
  const statuses = getRpgCleansableStatuses(target, cleanses);
  statuses.forEach(status => { target.statusEffects[status] = 0; });
  return statuses.length;
}

export function getRpgReviveHp(target, ratio) {
  if (!target || !Number.isFinite(target.currentHp) || target.currentHp > 0
    || !Number.isFinite(target.maxHp) || target.maxHp <= 0
    || !Number.isFinite(ratio) || ratio <= 0) return 0;
  return Math.min(target.maxHp, Math.max(1, Math.round(target.maxHp * Math.min(1, ratio))));
}
