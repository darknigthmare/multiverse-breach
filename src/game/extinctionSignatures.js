/** Explicit FPS adaptations of the seven Nexus source kits. No art/canon approval.
 * State belongs to one run and one owner; pure simulation, no timers or save writes.
 */
export const EXTINCTION_SIGNATURE_IDS = Object.freeze([
  'player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova',
  'arca_marrow', 'arca_sable', 'arca_loom'
]);
export const EXTINCTION_SIGNATURE_SLOTS = Object.freeze(['simple', 'secondary', 'defense', 'special']);
const finite = (n, fallback = 0) => Number.isFinite(Number(n)) ? Number(n) : fallback;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
const copy = value => value && typeof value === 'object' ? { ...value } : value;
const text = (v, lang) => typeof v === 'string' ? v : v?.[lang] || v?.fr || v?.en || '';
const delivery = {
  bullet: 'hitscan', projectile: 'projectile', rocket: 'projectile',
  melee: 'melee', beam: 'beam', beam_aoe: 'beam', nexus_aoe: 'pulse',
  heal: 'heal', shield: 'guard', dash: 'dash', buff: 'buff', summon: 'support'
};
export function getExtinctionSignature(hero) {
  if (!EXTINCTION_SIGNATURE_IDS.includes(hero?.id) || hero.nonCombat || hero.category === 'trial') return null;
  const actions = {};
  for (const slot of EXTINCTION_SIGNATURE_SLOTS) {
    const source = hero[slot];
    if (!source || !delivery[source.type]) continue;
    let kind = delivery[source.type];
    // These named actions are not arbitrary gun shots or borrowed characters.
    if (hero.id === 'arca_mirelle' && slot === 'simple') kind = 'projectile';
    if (hero.id === 'arca_sable' && slot === 'secondary') kind = 'mine';
    if (hero.id === 'arca_bastion' && slot === 'secondary') kind = 'barricade';
    if (hero.id === 'arca_loom' && slot === 'secondary') kind = 'drone';
    const cooldown = slot === 'simple' ? (kind === 'melee' ? 26 : 20)
      : slot === 'defense' ? Math.max(360, Math.round(finite(source.dur, 2) * 60) + 60)
        : Math.round(clamp(finite(source.cd ?? source.cooldown, slot === 'special' ? 12 : 7), 1, 60) * 60);
    actions[slot] = Object.freeze({ slot, name: copy(source.name), sourceType: source.type,
      kind, cooldown, duration: Math.round(clamp(finite(source.dur, 2), 0.2, 10) * 60),
      reduction: clamp(finite(source.reduce, 0.6), 0, 0.95),
      damage: Math.round(28 * clamp(finite(source.dmg, 1), 0.1, 8)),
      range: kind === 'melee' ? (slot === 'simple' ? 2.3 : 3.2) : kind === 'pulse' ? 8 : 24,
      color: source.color || hero.secondaryColor || hero.primaryColor || '#39c5bb' });
  }
  return Object.freeze({ heroId: hero.id, actions: Object.freeze(actions), status: 'RUNTIME_ADAPTED_ART_PENDING' });
}
export function createExtinctionProtocolState(profile, runId) {
  return { ownerId: profile?.heroId || '', runId, profile, charge: 0, cooldowns: {},
    guard: 0, reduction: 0, buff: 0, barricade: 0, drone: 0,
    projectiles: [], effects: [], sequence: 0, activeSlot: null, activeFrames: 0,
    casts: { simple: 0, secondary: 0, defense: 0, special: 0 } };
}
const valid = state => state?.phase === 'running' && state.protocols?.profile
  && state.protocols.ownerId === state.heroId && state.protocols.runId === state.runId;
export function getExtinctionProtocolStatus(state, slot) {
  const p = state?.protocols, action = p?.profile?.actions?.[slot];
  if (!valid(state) || !action) return 'unavailable';
  if (state.paused) return 'paused';
  if (p.cooldowns[slot] > 0) return 'cooldown';
  if (slot === 'special' && p.charge < 100) return 'charge';
  if (slot === 'simple' && state.weapon?.type && state.weapon.type !== 'pistol') return 'pickup';
  if (slot === 'simple' && action.kind !== 'melee') {
    if (state.reloadPulse > 0) return 'reload';
    if ((state.weapon?.ammo ?? state.ammo ?? 0) < 1) return 'ammo';
  }
  return 'ready';
}
/** Every damage path calls this; a champion stays protected until drones die. */
export function damageExtinctionEnemy(state, enemy, damage, onKill, chargeGain = 0) {
  if (state?.phase !== 'running' || state.paused || !enemy || enemy.hp <= 0 || !state.enemies.includes(enemy)) return 0;
  if (enemy.shieldActive) {
    if (state.enemies.some(e => e.kind === 'Drone Protecteur' && e.hp > 0)) return 0;
    enemy.shieldActive = false;
  }
  const dealt = Math.min(enemy.hp, Math.max(0, finite(damage)));
  if (!dealt) return 0;
  enemy.hp = Math.max(0, enemy.hp - dealt);
  state.hitMarkerTimer = 6;
  if (valid(state)) state.protocols.charge = clamp(state.protocols.charge + chargeGain, 0, 100);
  if (enemy.hp <= 0 && !enemy.counted) {
    enemy.counted = true; state.kills = (state.kills || 0) + 1;
    if (state.heroCategory === 'horror') state.hp = Math.min(state.maxHp, state.hp + 8);
    onKill?.(enemy, state);
  }
  return dealt;
}
const distance = (a, b) => Math.hypot(a.wx - b.wx, a.wy - b.wy);
function candidates(state, range, cone = 0.3) {
  const sin = Math.sin(state.angle || 0), cos = Math.cos(state.angle || 0);
  return state.enemies.filter(e => e.hp > 0).map(enemy => {
    const dx = enemy.wx - state.px, dy = enemy.wy - state.py;
    const z = dx * sin + dy * cos, x = dx * cos - dy * sin;
    return { enemy, dist: Math.hypot(dx, dy), aim: Math.abs(x) / Math.max(z, 0.01), z };
  }).filter(e => e.dist <= range && e.z > 0 && e.aim <= cone).sort((a, b) => a.dist - b.dist);
}
function effect(state, kind, action, wx = state.px, wy = state.py) {
  const p = state.protocols;
  p.effects.push({ kind, color: action.color, wx, wy, screenSpace: kind !== 'impact', life: 20, maxLife: 20 });
  if (p.effects.length > 24) p.effects.shift();
}
export function activateExtinctionProtocol(state, slot, { onKill, lang = 'fr' } = {}) {
  const status = getExtinctionProtocolStatus(state, slot);
  if (status !== 'ready') return { activated: false, reason: status };
  const p = state.protocols, a = p.profile.actions[slot];
  if (slot === 'special') p.charge -= 100;
  if (slot === 'simple' && a.kind !== 'melee') {
    state.ammo = Math.max(0, (state.weapon?.ammo ?? state.ammo) - 1);
    if (state.weapon) state.weapon.ammo = state.ammo;
  }
  p.cooldowns[slot] = a.cooldown; p.casts[slot] += 1; p.activeSlot = slot; p.activeFrames = 20;
  const damage = Math.round(a.damage * (p.buff > 0 ? 1.15 : 1));
  const hit = target => damageExtinctionEnemy(state, target, damage, onKill, slot === 'special' ? 0 : 8);
  if (['hitscan', 'melee', 'beam'].includes(a.kind)) {
    const targets = candidates(state, a.range, a.kind === 'melee' ? 0.85 : 0.24);
    for (const { enemy } of (a.kind === 'beam' ? targets : targets.slice(0, 1))) {
      if (hit(enemy)) effect(state, 'impact', a, enemy.wx, enemy.wy);
    }
    if (a.kind !== 'melee') state.muzzle = 12;
    effect(state, a.kind, a);
  } else if (a.kind === 'projectile' || a.kind === 'mine') {
    const mine = a.kind === 'mine';
    const offset = mine ? 2 : 0.18;
    p.projectiles.push({ id: ++p.sequence, ownerId: p.ownerId, runId: p.runId, slot,
      kind: mine ? 'mine' : a.sourceType === 'rocket' ? 'rocket' : 'bolt',
      wx: clamp(state.px + Math.sin(state.angle) * offset, -7.5, 7.5),
      wy: clamp(state.py + Math.cos(state.angle) * offset, -1.4, 28),
      vx: Math.sin(state.angle) * 0.3, vy: Math.cos(state.angle) * 0.3,
      life: mine ? 480 : Math.ceil(a.range / 0.3) + 1, age: 0, radius: mine ? 1.25 : 0.22,
      splash: mine ? 2.5 : a.sourceType === 'rocket' ? 2.2 : 0, damage, color: a.color });
    if (p.projectiles.length > 24) p.projectiles.shift();
    if (!mine) state.muzzle = 12;
  } else if (a.kind === 'pulse') {
    for (const enemy of state.enemies) if (distance(enemy, { wx: state.px, wy: state.py }) <= a.range) hit(enemy);
    effect(state, 'pulse', a);
  } else if (a.kind === 'heal') {
    state.hp = Math.min(state.maxHp, state.hp + (slot === 'special' ? 65 : 28));
    effect(state, 'heal', a);
  } else if (a.kind === 'guard') {
    p.guard = a.duration; p.reduction = a.reduction; effect(state, 'guard', a);
  } else if (a.kind === 'dash') {
    state.px = clamp(state.px + Math.sin(state.angle) * 2.4, -7.5, 7.5);
    state.py = clamp(state.py + Math.cos(state.angle) * 2.4, -1.4, 28);
    p.guard = a.duration; p.reduction = a.reduction; effect(state, 'dash', a);
  } else if (a.kind === 'buff') {
    p.buff = 240; effect(state, 'buff', a);
  } else if (a.kind === 'barricade') {
    p.barricade = 300; effect(state, 'guard', a);
  } else if (a.kind === 'drone') {
    p.drone = 360; effect(state, 'drone', a);
  }
  state.statusText = text(a.name, lang);
  return { activated: true, action: a, damage };
}
/** Continuous segment/circle hit prevents a fast bolt skipping a close target. */
export function extinctionSegmentHit(ax, ay, bx, by, cx, cy, radius) {
  const dx = bx - ax, dy = by - ay, fx = ax - cx, fy = ay - cy;
  const c = fx * fx + fy * fy - radius * radius;
  if (c <= 0) return 0;
  const aa = dx * dx + dy * dy;
  if (!aa) return null;
  const b = 2 * (fx * dx + fy * dy), disc = b * b - 4 * aa * c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * aa);
  return t >= 0 && t <= 1 ? t : null;
}
export function tickExtinctionProtocols(state, onKill) {
  if (!valid(state) || state.paused) return;
  const p = state.protocols;
  for (const slot of EXTINCTION_SIGNATURE_SLOTS) p.cooldowns[slot] = Math.max(0, (p.cooldowns[slot] || 0) - 1);
  for (const key of ['guard', 'buff', 'barricade', 'drone', 'activeFrames']) p[key] = Math.max(0, p[key] - 1);
  if (p.drone > 0 && p.drone % 60 === 0) state.hp = Math.min(state.maxHp, state.hp + 5);
  p.effects = p.effects.filter(e => --e.life > 0);
  p.projectiles = p.projectiles.filter(shot => {
    if (shot.ownerId !== state.heroId || shot.runId !== state.runId || --shot.life <= 0) return false;
    shot.age += 1;
    const ox = shot.wx, oy = shot.wy;
    if (shot.kind !== 'mine') { shot.wx += shot.vx; shot.wy += shot.vy; }
    let nearest = null, first = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.hp <= 0 || (shot.kind === 'mine' && shot.age < 30)) continue;
      const t = extinctionSegmentHit(ox, oy, shot.wx, shot.wy, enemy.wx, enemy.wy,
        shot.radius + 0.28 * (enemy.size || 1));
      if (t !== null && t < first) { nearest = enemy; first = t; }
    }
    if (!nearest) return Math.abs(shot.wx) < 30 && shot.wy > -30 && shot.wy < 60;
    shot.wx = ox + (shot.wx - ox) * first; shot.wy = oy + (shot.wy - oy) * first;
    for (const enemy of state.enemies) if (enemy === nearest || (shot.splash && distance(enemy, shot) <= shot.splash)) {
      damageExtinctionEnemy(state, enemy, shot.damage, onKill, shot.slot === 'special' ? 0 : 8);
    }
    effect(state, 'impact', shot, shot.wx, shot.wy);
    return false;
  });
}
export function mitigateExtinctionProtocolDamage(state, amount) {
  const p = state?.protocols, damage = Math.max(0, finite(amount));
  if (!valid(state)) return damage;
  const reduction = Math.max(p.guard > 0 ? p.reduction : 0, p.barricade > 0 ? 0.4 : 0);
  return damage * (1 - reduction);
}
/** Procedural combat feedback only: no claim of authored character animation. */
export function drawExtinctionProtocols(ctx, state, width, height, projectWorld, projectileArt = null) {
  const p = state?.protocols;
  if (!p || !valid(state)) return;
  ctx.save();
  for (const shot of [...p.projectiles, ...p.effects]) {
    if (shot.screenSpace) {
      const progress = 1 - shot.life / shot.maxLife;
      ctx.globalAlpha = Math.max(0, 0.6 * (1 - progress));
      ctx.strokeStyle = shot.color; ctx.lineWidth = 2;
      ctx.beginPath();
      if (shot.kind === 'melee') ctx.arc(width / 2, height * 0.64, width * (0.08 + progress * 0.12), Math.PI * 1.1, Math.PI * 1.9);
      else if (shot.kind === 'beam' || shot.kind === 'hitscan') {
        ctx.moveTo(width * 0.64, height * 0.9); ctx.lineTo(width / 2, height * 0.53);
      } else ctx.arc(width / 2, height * 0.53, 14 + progress * Math.min(width, height) * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      continue;
    }
    const projection = projectWorld(shot, state);
    if (projection.camZ <= 0.2 || Math.abs(projection.aim) > 1.6) continue;
    const x = width / 2 + projection.aim * width * 0.62;
    const y = height * 0.55 + (shot.kind === 'mine' ? 115 : 15) / projection.camZ;
    const radius = clamp((shot.kind === 'impact' ? 36 : 15) / projection.camZ, 2, 32);
    ctx.globalAlpha = shot.life && shot.maxLife ? shot.life / shot.maxLife : 0.9;
    ctx.strokeStyle = shot.color; ctx.fillStyle = shot.color; ctx.lineWidth = 2;
    const image = projectileArt?.image;
    if (shot.kind === 'bolt' && shot.ownerId === projectileArt?.ownerId && image?.complete
      && image.naturalWidth > 0 && image.naturalHeight > 0) {
      const h = radius * 2, w = h * image.naturalWidth / image.naturalHeight;
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, x - w / 2, y - h / 2, w, h);
      continue;
    }
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (shot.kind === 'mine' || shot.kind === 'impact') ctx.stroke(); else ctx.fill();
  }
  if (p.guard > 0 || p.barricade > 0) {
    ctx.globalAlpha = 0.35; ctx.strokeStyle = '#39c5bb'; ctx.lineWidth = 5;
    ctx.strokeRect(5, 5, width - 10, height - 10);
  }
  ctx.restore();
}
