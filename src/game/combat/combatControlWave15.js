// Maya's base Phaselock is a finite enemy bind. It never deals damage or grants
// protection. Explicit identity admission prevents unrelated support moves from
// acquiring this mechanic through a shared label or type.
export const isPhaselockProfile = profile => profile?.sourceHeroId === 'borderlands_2_maya_phaselock'
  && profile.universe === 'Borderlands 2' && profile.effect === 'control'
  && profile.delivery === 'control' && profile.controlKind === 'phaselock'
  && profile.targetSide === 'enemy' && profile.shape === 'single'
  && Number(profile.multiplier) === 0;
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
export const isCombatControlled = target => target?.currentHp > 0 && target?.combatControl?.kind === 'phaselock'
  && finite(target.combatControl.remaining) > 0;
export const isPhaselockTargetEligible = target => !!target && target.currentHp > 0
  && target.state !== 'dead' && !target.isBoss && !target.controlImmune
  && !(target.invulnerable > 0)
  && !(target.sourceProtectionWave16?.active && target.sourceProtectionWave16.kind === 'mugman-super-art-ii')
  && !isCombatControlled(target);

const segmentIntersectsBox = (a, b, box) => {
  let near = 0, far = 1;
  const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - box.left], [dx, box.right - a.x], [-dy, a.y - box.top], [dy, box.bottom - a.y]]) {
    if (Math.abs(p) < 1e-9) { if (q < 0) return false; }
    else if (p < 0) near = Math.max(near, q / p);
    else far = Math.min(far, q / p);
    if (near > far) return false;
  }
  return far > .01 && near < .99;
};
export function canPhaselockTarget(source, target, profile, { platforms = [], renderHeight = 72 } = {}) {
  if (!isPhaselockProfile(profile) || !source || source.currentHp <= 0 || !isPhaselockTargetEligible(target) || source === target) return false;
  if (![source.x, source.y, target.x, target.y].every(Number.isFinite)) return false;
  if (Math.hypot(target.x - source.x, target.y - source.y) > Math.max(1, finite(profile.range, 480))) return false;
  const a = { x: source.x, y: source.y - renderHeight * .42 };
  const b = { x: target.x, y: target.y - renderHeight * .42 };
  return !platforms.some(platform => {
    if (platform.lineOfSightTransparent || platform.transparent) return false;
    const left = finite(platform.x1, finite(platform.x)), right = finite(platform.x2, left + finite(platform.width));
    const top = finite(platform.y, NaN), bottom = top + Math.max(2, finite(platform.thickness, 12));
    return right > left && Number.isFinite(top) && segmentIntersectsBox(a, b, { left, right, top, bottom });
  });
}
export function holdCombatControl(target) {
  if (!isCombatControlled(target)) return false;
  const control = target.combatControl;
  target.x = control.x; target.y = control.y - control.lift;
  target.vx = 0; target.vy = 0; target.action = null; target.queuedMeleeAction = null;
  target.charging = false; target.chargeHoldSeconds = 0; target.guarding = false;
  target.crouching = false; target.fastFallHeld = false; target.ledge = null;
  target.state = 'hit';
  return true;
}
export function applyPhaselockControl(target, profile, source, { lift = 44 } = {}) {
  if (!isPhaselockProfile(profile) || !isPhaselockTargetEligible(target) || !source || source.currentHp <= 0) return false;
  const duration = Math.max(.1, Math.min(8, finite(profile.controlDuration, 2.4)));
  target.combatControl = { kind: 'phaselock', remaining: duration, duration,
    sourceHeroId: profile.sourceHeroId, sourceRuntimeId: source.battleId || source.runtimeId || source.id,
    x: target.x, y: target.y, lift: Math.max(0, Math.min(96, finite(lift, 44))) };
  holdCombatControl(target);
  return true;
}
export function tickCombatControl(target, dt) {
  if (!target?.combatControl || target.combatControl.kind !== 'phaselock') return false;
  const control = target.combatControl;
  if (target.currentHp <= 0) { target.combatControl = null; return false; }
  control.remaining = Math.max(0, control.remaining - Math.max(0, finite(dt)));
  if (control.remaining <= 0) {
    // Release at the held position. Normal physics handles the fall and landing;
    // no teleport changes terrain occupancy or creates landing damage.
    target.combatControl = null; target.vx = 0; target.vy = 0;
    if (!target.action && ['hit', 'support'].includes(target.state)) target.state = 'idle';
    return false;
  }
  holdCombatControl(target); return true;
}
export function drawCombatControl(ctx, target, height = 72) {
  if (!ctx || !isCombatControlled(target)) return false;
  const control = target.combatControl, elapsed = control.duration - control.remaining;
  const radius = height * .36, centerY = target.y - height * .45;
  ctx.save(); ctx.strokeStyle = '#b782ff'; ctx.lineWidth = Math.max(1, height / 56);
  ctx.globalAlpha *= .62 + Math.sin(elapsed * 9) * .12;
  ctx.beginPath(); ctx.ellipse(target.x, centerY, radius, height * .58, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(target.x, centerY, radius, height * .14, elapsed * .7, 0, Math.PI * 2); ctx.stroke();
  ctx.restore(); return true;
}
