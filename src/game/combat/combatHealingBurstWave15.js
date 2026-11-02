// Val's Healing Burst restores nearby allies and herself. It is distinct from
// the Medgun's aimed ally tether, and never acquires an offensive projectile.
export const isValHealingBurstProfile = profile => profile?.sourceHeroId === 'evolve_val'
  && profile.universe === 'Evolve' && profile.effect === 'heal'
  && profile.delivery === 'support' && profile.shape === 'group'
  && profile.targetSide === 'ally' && profile.excludeSelf !== true
  && Number(profile.multiplier) === 0;
export const isHealingBurstProfile = isValHealingBurstProfile;
export const healingBurstWithinRange = (source, target, profile) => {
  if (!isValHealingBurstProfile(profile) || !source || !target || target.currentHp <= 0) return false;
  const declared = Number(profile.range);
  const range = Math.min(220, Number.isFinite(declared) && declared > 0 ? declared : 220);
  return [source.x, source.y, target.x, target.y].every(Number.isFinite)
    && Math.hypot(target.x - source.x, target.y - source.y) <= range + .001;
};
