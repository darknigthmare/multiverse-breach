// Shared engine format and bounded numerical defaults. Callers must choose
// each action identity and effect explicitly from the character's source role.
export const action = (name, type, dmg, effect, delivery, shape, range, extra = {}) => ({
  name, type, dmg, animationDuration: 0.55, hitAt: 0.2,
  targeting: { effect, delivery, shape, range, targetSide: effect === 'damage' ? 'enemy' : 'ally', ...extra }
});
export const hit = (name, dmg = 1, options = {}) => action(name, 'melee', dmg, 'damage', 'melee', 'single', 85, options);
export const shot = (name, dmg = 1.2, options = {}) => action(name, 'projectile', dmg, 'damage', 'projectile', 'single', 480, options);
export const beam = (name, dmg = 1.6, options = {}) => action(name, 'beam', dmg, 'damage', 'beam', 'line', 520, { lineWidth: 32, ...options });
export const area = (name, dmg = 1.6, options = {}) => action(name, 'area', dmg, 'damage', 'area', 'area', 380, { areaRadius: 85, ...options });
export const buff = (name, options = {}) => action(name, 'buff', 0, 'buff', 'support', 'group', 760, { duration: 3, buffMultiplier: 1.12, ...options });
export const guard = (name, options = {}) => action(name, 'guard', 0, 'guard', 'support', 'group', 760, { duration: 2, reduce: 0.3, ...options });
export const heal = (name, options = {}) => ({ ...action(name, 'heal', 0, 'heal', 'support', 'single', 760, { healRatio: 0.15, ...options }), cd: 8 });
export const cleanse = (name, options = {}) => action(name, 'cleanse', 0, 'cleanse', 'support', 'group', 760, { cleanses: true, ...options });
export const defend = (name, reduce = 0.45, options = {}) => ({
  ...action(name, 'guard', 0, 'guard', 'support', 'single', 1, { targetSide: 'self', duration: 1.2, reduce, ...options }),
  reduce, dur: options.duration ?? 1.2
});
