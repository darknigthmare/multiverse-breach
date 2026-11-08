/** Code-native first-person delivery diagrams, not character or weapon artwork.
 * Read the current held action only. Never infer anatomy, grant equipment, or
 * advance animation from wall time: pause and replay use the simulation state.
 */
const PRIMARY_STYLES = Object.freeze({
  hitscan: 'ballistic', scatter: 'scatter', volley: 'scatter',
  melee: 'contact', sweep: 'contact', counter: 'contact',
  projectile: 'projectile', beam: 'beam', cone: 'cone', control: 'control',
  focus: 'focus', dash: 'movement', teleport: 'movement'
});
const PICKUP_STYLES = Object.freeze({ shotgun: 'scatter', rocket: 'launcher', plasma: 'plasma' });
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));

/** Internal `pistol` means the personal kit, including contact/movement kits.
 * A stale/foreign protocol must never supply its shape, colour or animation.
 * Secondary casts retain their existing world VFX; they do not replace the
 * held equipment or cause a false primary muzzle flash here.
 */
export function getExtinctionSchematicView(state = {}, fallbackColor = '#39c5bb') {
  const weapon = state.weapon || {}, type = weapon.type || 'pistol', p = state.protocols;
  const current = Boolean(state.heroId) && state.runId != null
    && p?.ownerId === state.heroId && p.runId === state.runId && p.profile?.heroId === state.heroId;
  const action = type === 'pistol' && current ? p.profile.actions?.simple : null;
  const pickupStyle = Object.hasOwn(PICKUP_STYLES, type) ? PICKUP_STYLES[type] : null;
  const source = action ? 'personal' : pickupStyle ? 'pickup' : 'unbound';
  const style = action ? (Object.hasOwn(PRIMARY_STYLES, action.kind) ? PRIMARY_STYLES[action.kind] : 'neutral')
    : pickupStyle || 'neutral';
  const resource = source === 'unbound' ? 'none' : source === 'pickup' ? 'ammo'
    : action.resource || (action.kind === 'melee' ? 'cooldown' : 'ammo');
  const maxAmmo = Math.max(0, finite(weapon.maxAmmo, finite(state.maxAmmo)));
  const ammo = Math.max(0, finite(weapon.ammo, finite(state.ammo)));
  const shotAge = Number.isFinite(state.lastFireTime) && Number.isFinite(state.t)
    ? state.t - state.lastFireTime : -1;
  const totalCooldown = action ? Math.max(1, finite(action.cooldown, 1)) : Math.max(1, finite(weapon.fireRate, 1) * 18);
  const cooldown = action ? Math.max(0, finite(p.cooldowns?.simple))
    : source === 'pickup' && shotAge >= 0 ? Math.max(0, totalCooldown - shotAge) : 0;
  // Eight ticks of primary recoil within the protocol's real 20-tick action
  // window. The rest of recovery reads its actual remaining cooldown.
  const activation = action ? (p.activeSlot === 'simple' ? clamp((finite(p.activeFrames) - 12) / 8) : 0)
    : source === 'pickup' && finite(state.muzzle) > 0 && shotAge >= 0 ? clamp(1 - shotAge / 12) : 0;
  const reload = resource === 'ammo' ? Math.max(0, finite(state.reloadPulse)) : 0;
  const readyFraction = reload > 0 ? clamp(1 - reload / 36) : clamp(1 - cooldown / totalCooldown);
  const phase = reload > 0 ? 'reload' : activation > 0 ? 'attack' : cooldown > 0 ? 'recovery'
    : resource === 'ammo' && ammo <= 0 ? 'empty' : 'idle';
  return {
    source, ownerId: source === 'personal' ? state.heroId : '', weaponType: type,
    kind: action?.kind || (source === 'pickup' ? type : 'none'), style,
    color: (action?.color || (source === 'pickup' ? weapon.color : '') || fallbackColor),
    phase, activation: phase === 'attack' ? activation : 0, cooldown, reload, readyFraction,
    resource, resourceFraction: resource === 'ammo' ? (maxAmmo > 0 ? clamp(ammo / maxAmmo) : 0) : readyFraction,
    artwork: false, morphologyInferred: false
  };
}

/** The complete diagram, recoil and status strip fit below the central reticle.
 * Coordinates inside the envelope use a 160×140 reference space.
 */
export function getExtinctionSchematicPlacement(width, height, state = {}) {
  if (![width, height].every(n => Number.isFinite(n) && n > 0)) return null;
  const scale = Math.min(182 / 160, width * 0.56 / 160, 148 / 140, height * 0.38 / 140);
  const w = 160 * scale, h = 140 * scale;
  const sway = clamp(-finite(state.turnVel) * 430 + finite(state.vx) * 85, -w * 0.14, w * 0.14);
  return { x: clamp((width - w) / 2 + sway, 0, width - w),
    y: height - h - Math.min(4, height * 0.02), w, h, scale };
}

function line(ctx, points, close = false) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  if (close) ctx.closePath();
}

function stroke(ctx, color, fill = false) {
  if (fill) { ctx.fillStyle = '#10232f'; ctx.fill(); }
  // A light under-stroke keeps even source colours such as #202020 legible.
  ctx.strokeStyle = 'rgba(225,246,255,0.65)'; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = 1.7; ctx.stroke();
}

function circle(ctx, x, y, radius, color, fill = false) {
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); stroke(ctx, color, fill);
}

function diagram(ctx, view) {
  const { style, color, activation } = view;
  if (style === 'ballistic' || style === 'scatter') {
    const wide = style === 'scatter', half = wide ? 34 : 21;
    line(ctx, [[80 - half, 113], [80 - half, 68], [80 - half + 9, 54],
      [80 - half + 9, 39], [80 + half - 9, 39], [80 + half - 9, 54],
      [80 + half, 68], [80 + half, 113]], true); stroke(ctx, color, true);
    line(ctx, [[80 - half + 7, 76], [80 + half - 7, 76], [80 + half - 7, 86], [80 - half + 7, 86]], true);
    stroke(ctx, color);
    if (wide) {
      for (const dx of [-27, 0, 27]) {
        line(ctx, [[80 + dx * 0.4, 31], [80 + dx, activation > 0 ? 10 : 22]]); stroke(ctx, color);
      }
    } else {
      line(ctx, [[80, 47], [80, 59], [74, 64], [86, 64]]); stroke(ctx, color);
      if (activation > 0) {
        line(ctx, [[80, 33], [80, 12], [75, 20], [85, 20]]); stroke(ctx, color);
      }
    }
  } else if (style === 'launcher') {
    line(ctx, [[45, 111], [45, 50], [56, 32], [104, 32], [115, 50], [115, 111]], true); stroke(ctx, color, true);
    line(ctx, [[56, 54], [65, 42], [95, 42], [104, 54], [95, 66], [65, 66]], true); stroke(ctx, color);
    line(ctx, [[60, 81], [60, 102], [100, 102], [100, 81]]); stroke(ctx, color);
    if (activation > 0) {
      line(ctx, [[73, 27], [80, 13], [87, 27]], true); stroke(ctx, color, true);
    }
  } else if (style === 'plasma') {
    line(ctx, [[57, 111], [57, 88], [68, 77], [92, 77], [103, 88], [103, 111]], true); stroke(ctx, color, true);
    circle(ctx, 80, 53, 25, color); circle(ctx, 80, 53, 12 + activation * 5, color);
    for (const x of [65, 80, 95]) circle(ctx, x, 98, 2, color);
    if (activation > 0) circle(ctx, 80, 15, 4, color, true);
  } else if (style === 'contact') {
    ctx.beginPath(); ctx.moveTo(35, 96); ctx.bezierCurveTo(51, 40, 89, 20, 126, 23); stroke(ctx, color);
    ctx.beginPath(); ctx.moveTo(51, 110); ctx.bezierCurveTo(65, 62, 105, 41, 131, 42); stroke(ctx, color);
    line(ctx, [[38, 74], [53, 78], [50, 92]]); stroke(ctx, color);
    if (activation > 0) {
      line(ctx, [[117, 18], [123, 9], [125, 19], [135, 20], [126, 26]], false); stroke(ctx, color);
    }
  } else if (style === 'projectile') {
    line(ctx, [[57, 106], [66, 83], [94, 83], [103, 106]]); stroke(ctx, color);
    line(ctx, [[80, 35], [98, 55], [80, 75], [62, 55]], true); stroke(ctx, color, true);
    line(ctx, [[71, 99], [80, 90], [89, 99]]); stroke(ctx, color);
    circle(ctx, 80, 18 + (1 - activation) * 7, activation > 0 ? 5 : 3, color, true);
  } else if (style === 'beam') {
    line(ctx, [[60, 108], [60, 85], [80, 74], [100, 85], [100, 108]], true); stroke(ctx, color);
    for (const dx of [-11, 0, 11]) {
      line(ctx, [[80 + dx, 65], [80 + dx, dx === 0 ? 15 : 27]]); stroke(ctx, color);
    }
    line(ctx, [[56, 47], [56, 34], [62, 34]]); stroke(ctx, color);
    line(ctx, [[104, 47], [104, 34], [98, 34]]); stroke(ctx, color);
    if (activation > 0) { circle(ctx, 80, 18, 5 + activation * 3, color); }
  } else if (style === 'cone') {
    line(ctx, [[35, 35], [80, 106], [125, 35]]); stroke(ctx, color);
    for (const radius of [53, 83]) {
      ctx.beginPath(); ctx.arc(80, 105, radius, Math.PI * 1.32, Math.PI * 1.68); stroke(ctx, color);
    }
    line(ctx, [[80, 88], [80, activation > 0 ? 24 : 55]]); stroke(ctx, color);
  } else if (style === 'control') {
    for (const [x, y, sx, sy] of [[46, 28, 1, 1], [114, 28, -1, 1], [46, 96, 1, -1], [114, 96, -1, -1]]) {
      line(ctx, [[x, y + sy * 17], [x, y], [x + sx * 17, y]]); stroke(ctx, color);
    }
    line(ctx, [[67, 49], [93, 49], [93, 75], [67, 75]], true); stroke(ctx, color);
    line(ctx, [[73, 62], [87, 62]]); stroke(ctx, color);
    line(ctx, [[80, 55], [80, 69]]); stroke(ctx, color);
    if (activation > 0) {
      line(ctx, [[55, 36 + (1 - activation) * 51], [105, 36 + (1 - activation) * 51]]); stroke(ctx, color);
    }
  } else if (style === 'focus') {
    line(ctx, [[80, 19], [117, 59], [80, 99], [43, 59]], true); stroke(ctx, color);
    line(ctx, [[80, 43], [94, 59], [80, 75], [66, 59]], true); stroke(ctx, color, activation > 0);
    for (const points of [[[31, 59], [50, 59]], [[129, 59], [110, 59]], [[80, 8], [80, 29]], [[80, 111], [80, 89]]]) {
      line(ctx, points); stroke(ctx, color);
    }
    if (activation > 0) circle(ctx, 80, 59, 5, color, true);
  } else if (style === 'movement') {
    for (const [y, half] of [[45, 25], [79, 37], [109, 37]]) {
      line(ctx, [[80 - half, y], [80, y - 24], [80 + half, y]]); stroke(ctx, color);
    }
    if (activation > 0) {
      line(ctx, [[35, 91], [35, 68]]); stroke(ctx, color);
      line(ctx, [[125, 91], [125, 68]]); stroke(ctx, color);
    }
  } else {
    // No personal identity is implied when its protocol cannot be resolved.
    line(ctx, [[52, 79], [52, 43], [80, 27], [108, 43], [108, 79], [80, 95]], true); stroke(ctx, color);
    line(ctx, [[63, 78], [97, 44]]); stroke(ctx, color);
  }
}

export function drawExtinctionSchematicView(ctx, state, width, height, color) {
  const placement = getExtinctionSchematicPlacement(width, height, state);
  if (!placement) return null;
  const view = getExtinctionSchematicView(state, color);
  ctx.save();
  ctx.translate(placement.x, placement.y); ctx.scale(placement.scale, placement.scale);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = view.phase === 'empty' ? 0.45 : 0.9;
  ctx.save();
  const dip = view.phase === 'reload' ? (1 - view.readyFraction) * 8 : view.activation * 5;
  ctx.translate(0, dip); diagram(ctx, view); ctx.restore();
  // One meaning throughout: readiness. Exact ammunition remains in the HUD;
  // the strip never jumps from a recovered cooldown to a partial ammo count.
  // An empty magazine starts empty; only a real reload shows reload progress.
  line(ctx, [[44, 127], [116, 127]]); ctx.strokeStyle = 'rgba(225,246,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
  if (view.source !== 'unbound') {
    const fraction = view.phase === 'empty' ? 0 : view.readyFraction;
    if (fraction > 0) { line(ctx, [[44, 127], [44 + 72 * fraction, 127]]); stroke(ctx, view.color); }
    if (view.phase === 'empty') { line(ctx, [[77, 123], [83, 131], [80, 127], [77, 131], [83, 123]]); stroke(ctx, view.color); }
  }
  ctx.restore();
  return { view, placement };
}
