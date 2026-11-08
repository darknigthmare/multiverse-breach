/** Explicit FPS adaptations of the twelve Nexus source kits. No art/canon approval.
 * State belongs to one run and one owner; pure simulation, no timers or save writes.
 */
import { canDamageExtinctionDirectiveEnemy } from './extinctionFieldDirectives.js';
export const EXTINCTION_SIGNATURE_IDS = Object.freeze([
  'player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova',
  'arca_marrow', 'arca_sable', 'arca_loom', 'arca_tessera', 'arca_quillon',
  'arca_nadir', 'arca_elyra', 'arca_oryn'
]);
export const EXTINCTION_SIGNATURE_SLOTS = Object.freeze(['simple', 'secondary', 'defense', 'special']);
const finite = (n, fallback = 0) => Number.isFinite(Number(n)) ? Number(n) : fallback;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
const copy = value => value && typeof value === 'object' ? { ...value } : value;
const text = (v, lang) => typeof v === 'string' ? v : v?.[lang] || v?.fr || v?.en || '';
const MOVEMENT_DISTANCE = Object.freeze({ dash: 2.4, teleport: 3 });
const SUPPORT_RADIUS = 8;
const MINE_REACH = Object.freeze({ kind: 'placement', value: 2, effectRadius: 2.5 });
/** A.R.C.A. pickup tuning. The personal kit keeps its source action and resource.
 * Pellets are deterministic rays; energy and rockets collide after travelling.
 */
export const EXTINCTION_PICKUP_BALLISTICS = Object.freeze({
  shotgun: Object.freeze({ range: 9, pellets: 7, radius: 0.08 }),
  plasma: Object.freeze({ range: 24, speed: 0.6, radius: 0.16, splash: 0 }),
  rocket: Object.freeze({ range: 24, speed: 0.3, radius: 0.22, splash: 2.2 })
});
/** Effective reach for UI/catalogs without rewriting the historical authored
 * action objects. Self effects have no target; movement is not attack range.
 */
export function getExtinctionActionReach(action) {
  const kind = action?.kind;
  if (Object.hasOwn(MOVEMENT_DISTANCE, kind)) return { kind: 'movement', value: MOVEMENT_DISTANCE[kind] };
  if (['heal', 'guard', 'buff', 'support', 'barricade', 'drone'].includes(kind)) return { kind: 'self', value: 0 };
  if (kind === 'return_probe') return { kind: 'anchor', value: 0 };
  if (kind === 'mine') return { ...MINE_REACH };
  if (['summon', 'reflection'].includes(kind)) return { kind: 'support-radius', value: SUPPORT_RADIUS };
  return { kind: ['pulse', 'control_pulse'].includes(kind) ? 'radius'
    : ['melee', 'sweep', 'counter'].includes(kind) ? 'contact' : 'aim', value: Math.max(0, finite(action?.range)) };
}
const delivery = {
  bullet: 'hitscan', projectile: 'projectile', rocket: 'projectile',
  melee: 'melee', beam: 'beam', beam_aoe: 'beam', nexus_aoe: 'pulse',
  heal: 'heal', shield: 'guard', dash: 'dash', dodge: 'dash', buff: 'buff', summon: 'support'
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
    if (hero.id === 'arca_tessera' && slot === 'secondary') kind = 'reflection';
    if (hero.id === 'arca_nadir' && slot === 'secondary') kind = 'return_probe';
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
    casts: { simple: 0, secondary: 0, defense: 0, special: 0 },
    ...(profile?.heroId === 'arca_tessera' ? { reflection: null } : {}),
    ...(profile?.heroId === 'arca_nadir' ? { returnProbe: null, returns: 0 } : {}),
    ...(profile?.ultimateCharge?.kind === 'evasion' ? { successfulEvasions: 0, lastEvasionChargeTick: -1 } : {}),
    ...(Object.values(profile?.actions || {}).some(action => action.kind === 'summon') ? { summon: null } : {}) };
}
const valid = state => state?.phase === 'running' && state.protocols?.profile
  && state.protocols.ownerId === state.heroId && state.protocols.runId === state.runId;
const currentSupport = (support, state) => support && support.life > 0
  && support.ownerId === state.heroId && support.runId === state.runId
  && Number.isFinite(support.wx) && Number.isFinite(support.wy);
export function getExtinctionProtocolStatus(state, slot) {
  const p = state?.protocols, action = p?.profile?.actions?.[slot];
  if (!valid(state) || !action) return 'unavailable';
  if (state.paused) return 'paused';
  // Recall is the second half of one cast, not a new probe or a cooldown reset.
  if (action.kind === 'return_probe' && currentSupport(p.returnProbe, state)) return 'ready';
  if (p.cooldowns[slot] > 0) return 'cooldown';
  if (slot === 'special' && p.charge < 100) return 'charge';
  if (slot === 'simple' && state.weapon?.type && state.weapon.type !== 'pistol') return 'pickup';
  if (slot === 'simple' && action.kind !== 'melee' && action.resource !== 'cooldown') {
    if (state.reloadPulse > 0) return 'reload';
    if ((state.weapon?.ammo ?? state.ammo ?? 0) < 1) return 'ammo';
  }
  return 'ready';
}
export function getExtinctionProtocolBrief(action, lang = 'fr') {
  const copy = {
    control: { fr: 'Effet de contrôle : ralentit la cible visée sans lui infliger de dégâts. Les applications réussies chargent l’ultime.', en: 'Control effect: slows the aimed target without damage. Successful applications charge the ultimate.' },
    control_pulse: { fr: 'Contrôle de zone : ralentit les menaces proches pendant la durée de la technique.', en: 'Area control: slows nearby threats for the technique duration.' },
    summon: { fr: 'Pose une balise de soutien : elle reste au point de lancement et attaque les menaces à moins de huit unités.', en: 'Place a support beacon: it stays at the cast point and attacks threats within eight units.' },
    support: { fr: 'Entraide : récupère des PV et réduit brièvement les dégâts reçus. La simulation solo applique le soutien au personnage contrôlé.', en: 'Support: restores health and briefly reduces incoming damage. Solo simulation applies the support to the controlled character.' },
    focus: { fr: 'Technique ciblée : vise une menace devant toi à moins de huit unités.', en: 'Targeted technique: aim at a threat in front of you within eight units.' },
    reflection: {
      fr: 'F pose un reflet pour 5 secondes actives. Il vise les menaces proches de sa position ; un seul reflet peut agir.',
      en: 'F places a reflection for 5 active seconds. It targets threats near its position; only one reflection can act.'
    },
    return_probe: {
      fr: 'F pose une sonde à ta position. Pendant 6 secondes actives, F permet un retour unique à ce point, sans restaurer santé ni munitions.',
      en: 'F places a probe at your position. For 6 active seconds, F allows one return to that point, without restoring health or ammunition.'
    }
  };
  return copy[action?.kind]?.[lang === 'fr' ? 'fr' : 'en'] || '';
}

/** End-of-run cleanup also covers support anchors, never casts or rewards. */
export function clearExtinctionProtocolEffects(state) {
  const p = state?.protocols;
  if (!p) return;
  p.projectiles = []; p.effects = [];
  if (Object.hasOwn(p, 'reflection')) p.reflection = null;
  if (Object.hasOwn(p, 'returnProbe')) p.returnProbe = null;
  if (Object.hasOwn(p, 'summon')) p.summon = null;
  for (const enemy of state.enemies || []) if (enemy.protocolControl?.runId === state.runId
    && enemy.protocolControl?.ownerId === state.heroId) delete enemy.protocolControl;
}
/** Every damage path calls this; a champion stays protected until drones die. */
export function damageExtinctionEnemy(state, enemy, damage, onKill, chargeGain = 0) {
  if (state?.phase !== 'running' || state.paused || !enemy || enemy.hp <= 0 || !state.enemies.includes(enemy)) return 0;
  if (!canDamageExtinctionDirectiveEnemy(state, enemy)) {
    state.statusText = state.lang === 'en' ? 'Core masked: aim and mark with T before attacking.' : 'Noyau masqué : vise et marque avec T avant d’attaquer.';
    return 0;
  }
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
/** Read-only selection shared by the attack and its aiming feedback. */
export function getExtinctionAimCandidates(state, range, cone = 0.3) {
  const sin = Math.sin(state.angle || 0), cos = Math.cos(state.angle || 0);
  return state.enemies.filter(e => e.hp > 0).map(enemy => {
    const dx = enemy.wx - state.px, dy = enemy.wy - state.py;
    const z = dx * sin + dy * cos, x = dx * cos - dy * sin;
    return { enemy, dist: Math.hypot(dx, dy), aim: Math.abs(x) / Math.max(z, 0.01), z };
  }).filter(e => e.dist <= range && e.z > 0 && e.aim <= cone).sort((a, b) => a.dist - b.dist);
}
export function getExtinctionActionAimCone(action) {
  if (['melee', 'sweep', 'counter'].includes(action?.kind)) return 0.85;
  if (['scatter', 'volley', 'cone'].includes(action?.kind)) return 0.55;
  return action?.kind === 'control' ? 0.3 : 0.24;
}

/** The actual seven pellet paths, before damage; reading them never fires. */
export function getExtinctionPickupSpreadHits(state) {
  const weapon = state?.weapon, tuning = EXTINCTION_PICKUP_BALLISTICS[weapon?.type];
  if (weapon?.type !== 'shotgun' || !tuning) return [];
  const hits = new Map(), spread = clamp(finite(weapon.spread, 0.28), 0, 0.6);
  for (let pellet = 0; pellet < tuning.pellets; pellet++) {
    const angle = state.angle + (pellet / (tuning.pellets - 1) * 2 - 1) * spread;
    const bx = state.px + Math.sin(angle) * tuning.range, by = state.py + Math.cos(angle) * tuning.range;
    let nearest = null, first = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.hp <= 0 || ![enemy.wx, enemy.wy].every(Number.isFinite)) continue;
      const hit = extinctionSegmentHit(state.px, state.py, bx, by, enemy.wx, enemy.wy,
        tuning.radius + 0.28 * (enemy.size || 1));
      if (hit !== null && hit < first) { nearest = enemy; first = hit; }
    }
    if (nearest) hits.set(nearest, (hits.get(nearest) || 0) + 1);
  }
  return [...hits].map(([enemy, pellets]) => ({ enemy, pellets }));
}
function effect(state, kind, action, wx = state.px, wy = state.py) {
  const p = state.protocols;
  p.effects.push({ kind, color: action.color, wx, wy, screenSpace: !['impact', 'explosion'].includes(kind),
    ...(kind === 'explosion' ? { effectRadius: action.splash || 0 } : {}), life: 20, maxLife: 20 });
  if (p.effects.length > 24) p.effects.shift();
}

export function getExtinctionPickupBrief(type, lang = 'fr') {
  const brief = {
    shotgun: {
      fr: 'Fusil à pompe : gerbe de sept plombs, jusqu’à neuf unités. Chaque trajectoire s’arrête sur sa première menace ; rapproche-toi pour concentrer la gerbe.',
      en: 'Shotgun: seven pellets, up to nine units. Each path stops on its first threat; move closer to concentrate the spread.'
    },
    plasma: {
      fr: 'Plasma : projectile rapide, jusqu’à vingt-quatre unités. Anticipe le mouvement de la cible ; les dégâts arrivent au contact.',
      en: 'Plasma: a fast projectile, up to twenty-four units. Lead moving targets; damage arrives on contact.'
    },
    rocket: {
      fr: 'Lance-roquettes : projectile puis explosion au contact, jusqu’à vingt-quatre unités. L’explosion atteint les menaces à moins de 2,2 unités ; le bouclier et le marquage du Champion restent requis.',
      en: 'Rocket launcher: a travelling projectile that explodes on contact, up to twenty-four units. The blast reaches threats within 2.2 units; Champion shielding and marking still apply.'
    }
  };
  return brief[type]?.[lang === 'fr' ? 'fr' : 'en'] || '';
}

/** One discharge is one damage event. Resolve protected cores before their
 * drones so a single blast cannot bypass a shield by array iteration order.
 * Credit at most eight charge, regardless of pellet count or splash victims.
 */
function applyExtinctionPickupHits(state, shot, hits, onKill) {
  const dronesAlive = state.enemies.some(enemy => enemy.kind === 'Drone Protecteur' && enemy.hp > 0);
  const protectedFirst = entry => entry.enemy.shieldActive && dronesAlive ? 0 : 1;
  const ordered = [...hits].sort((a, b) => protectedFirst(a) - protectedFirst(b));
  let damage = 0, hitCount = 0, blocked = false, masked = false;
  for (const { enemy, damage: amount } of ordered) {
    if (!canDamageExtinctionDirectiveEnemy(state, enemy)) masked = true;
    const dealt = damageExtinctionEnemy(state, enemy, amount, onKill);
    if (dealt > 0) {
      damage += dealt; hitCount += 1;
      effect(state, 'impact', shot, enemy.wx, enemy.wy);
    } else if (enemy.hp > 0) blocked = true;
  }
  if (damage > 0) {
    state.protocols.charge = clamp(state.protocols.charge + 8, 0, 100);
    state.screenShake = Math.max(finite(state.screenShake), Math.min(12, 5.5 + shot.damage / 34 * 1.5));
    state.statusText = state.lang === 'en'
      ? `Confirmed hit: ${hitCount} ${hitCount === 1 ? 'threat' : 'threats'}.`
      : `Impact confirmé : ${hitCount} ${hitCount === 1 ? 'menace' : 'menaces'}.`;
  } else if (blocked) {
    state.hitMarkerTimer = 0;
    state.statusText = masked
      ? (state.lang === 'en' ? 'Core masked: aim and mark with T before attacking.' : 'Noyau masqué : vise et marque avec T avant d’attaquer.')
      : (state.lang === 'en' ? 'Core protected: destroy its drones first.' : 'Noyau protégé : détruis d’abord ses drones.');
  }
  return { damage, hitCount, blocked };
}

/** Shared by mouse, keyboard and touch through ExtinctionRoyale.fire. */
export function fireExtinctionPickupWeapon(state, { onKill, damageMultiplier = 1, lang = 'fr' } = {}) {
  const weapon = state?.weapon, tuning = EXTINCTION_PICKUP_BALLISTICS[weapon?.type];
  const refusal = reason => ({ fired: false, reason, damage: 0 });
  if (!tuning || !valid(state) || state.protocols.profile.heroId !== state.heroId || state.hp <= 0 || !Number.isSafeInteger(state.t) || state.t < 0
    || ![state.px, state.py, state.angle].every(Number.isFinite)) return refusal('unavailable');
  if (state.paused) return refusal('paused');
  if (state.reloadPulse > 0) return refusal('reload');
  const cooldown = Math.max(1, finite(weapon.fireRate, 1) * 18);
  if (Number.isFinite(state.lastFireTime) && state.t - state.lastFireTime < cooldown) return refusal('cooldown');
  if (!Number.isFinite(weapon.ammo) || weapon.ammo < 1) {
    state.statusText = lang === 'fr' ? 'Chargeur vide: recharge avec R.' : 'Magazine empty: reload with R.';
    return refusal('ammo');
  }
  state.lang = lang;
  weapon.ammo -= 1; state.ammo = weapon.ammo;
  state.lastFireTime = state.t; state.muzzle = 36;
  const rawDamage = 34 * Math.max(0, finite(damageMultiplier, 1)) * Math.max(0, finite(weapon.dmgMult, 1));
  const damage = Math.round(rawDamage);
  const shot = { source: 'pickup', weaponType: weapon.type, ownerId: state.heroId, runId: state.runId,
    slot: 'pickup', color: weapon.color || '#39c5bb', damage, radius: tuning.radius };
  if (weapon.type === 'shotgun') {
    const contacts = getExtinctionPickupSpreadHits(state).map(({ enemy, pellets }) => ({ enemy,
      damage: Math.round(damage * pellets / tuning.pellets
        * (state.heroCategory === 'slayer' && distance(enemy, { wx: state.px, wy: state.py }) < 2.2 ? 1.45 : 1)) }));
    const result = applyExtinctionPickupHits(state, shot, contacts, onKill);
    effect(state, 'scatter', shot);
    if (!contacts.length) state.statusText = lang === 'fr' ? 'Aucune menace dans la gerbe.' : 'No threat in the spread.';
    return { fired: true, reason: result.blocked && !result.damage ? 'blocked' : result.damage ? 'impact' : 'miss',
      weaponType: weapon.type, pellets: tuning.pellets, ...result };
  }
  const p = state.protocols;
  p.projectiles.push({ ...shot, id: ++p.sequence, kind: weapon.type,
    closeDamage: state.heroCategory === 'slayer' ? Math.round(rawDamage * 1.45) : damage,
    wx: state.px, wy: state.py, vx: Math.sin(state.angle) * tuning.speed, vy: Math.cos(state.angle) * tuning.speed,
    remainingRange: tuning.range, life: Math.ceil(tuning.range / tuning.speed) + 1,
    age: 0, splash: tuning.splash });
  if (p.projectiles.length > 24) p.projectiles.shift();
  state.statusText = weapon.type === 'rocket'
    ? (lang === 'fr' ? 'Roquette en vol.' : 'Rocket in flight.')
    : (lang === 'fr' ? 'Plasma en vol.' : 'Plasma in flight.');
  return { fired: true, reason: 'launched', weaponType: weapon.type, damage: 0 };
}
function creditUsefulExtinctionEvasion(state, start) {
  const p = state.protocols, rule = p.profile.ultimateCharge;
  if (rule?.kind !== 'evasion' || !valid(state) || state.paused || state.hp <= 0
    || !Number.isSafeInteger(state.t) || state.t < 0 || p.lastEvasionChargeTick === state.t
    || ![start.wx, start.wy, state.px, state.py].every(Number.isFinite)
    || Math.hypot(state.px - start.wx, state.py - start.wy) < rule.minimumTravel) return;
  const threats = state.enemies.filter(enemy => enemy.hp > 0 && enemy.dmg > 0
    && Number.isFinite(enemy.wx) && Number.isFinite(enemy.wy));
  if (!threats.length) return;
  const before = Math.min(...threats.map(enemy => distance(enemy, start)));
  const after = Math.min(...threats.map(enemy => distance(enemy, { wx: state.px, wy: state.py })));
  if (before > rule.threatRange || after - before < rule.minimumSeparationGain || p.charge >= 100) return;
  p.charge = clamp(p.charge + rule.gain, 0, 100);
  p.successfulEvasions += 1; p.lastEvasionChargeTick = state.t;
}
export function activateExtinctionProtocol(state, slot, { onKill, lang = 'fr' } = {}) {
  const status = getExtinctionProtocolStatus(state, slot);
  if (status !== 'ready') return { activated: false, reason: status };
  const p = state.protocols, a = p.profile.actions[slot];
  if (a.kind === 'return_probe' && currentSupport(p.returnProbe, state)) {
    state.px = clamp(p.returnProbe.wx, -7.5, 7.5);
    state.py = clamp(p.returnProbe.wy, -1.4, 28);
    state.vx = 0; state.vy = 0;
    p.returnProbe = null; p.returns += 1;
    p.activeSlot = slot; p.activeFrames = 20;
    effect(state, 'return', a);
    state.statusText = lang === 'fr' ? 'Sonde de Retour : position retrouvée.' : 'Return Probe: position recovered.';
    return { activated: true, reason: 'returned', action: a, damage: 0 };
  }
  if (slot === 'special') p.charge -= 100;
  if (slot === 'simple' && a.kind !== 'melee' && a.resource !== 'cooldown') {
    state.ammo = Math.max(0, (state.weapon?.ammo ?? state.ammo) - 1);
    if (state.weapon) state.weapon.ammo = state.ammo;
  }
  p.cooldowns[slot] = a.cooldown; p.casts[slot] += 1; p.activeSlot = slot; p.activeFrames = 20;
  const damage = Math.round(a.damage * (p.buff > 0 ? 1.15 : 1));
  const hit = target => damageExtinctionEnemy(state, target, damage, onKill, slot === 'special' ? 0 : 8);
  if (['hitscan', 'melee', 'beam', 'sweep', 'scatter', 'volley', 'cone', 'focus', 'counter'].includes(a.kind)) {
    const wide = ['sweep', 'scatter', 'volley', 'cone'].includes(a.kind);
    const contact = ['melee', 'sweep', 'counter'].includes(a.kind);
    const targets = getExtinctionAimCandidates(state, a.range, getExtinctionActionAimCone(a));
    for (const { enemy } of (a.kind === 'beam' || wide ? targets : targets.slice(0, 1))) {
      if (hit(enemy)) effect(state, 'impact', a, enemy.wx, enemy.wy);
    }
    if (a.kind === 'counter') { p.guard = Math.min(90, a.duration); p.reduction = a.reduction; }
    if (!contact) state.muzzle = 12;
    effect(state, contact ? 'melee' : a.kind, a);
  } else if (a.kind === 'projectile' || a.kind === 'mine') {
    const mine = a.kind === 'mine';
    const reach = mine ? getExtinctionActionReach(a) : null;
    const offset = mine ? reach.value : 0.18;
    p.projectiles.push({ id: ++p.sequence, ownerId: p.ownerId, runId: p.runId, slot,
      kind: mine ? 'mine' : a.sourceType === 'rocket' || a.sourceType === 'cannon_aoe' ? 'rocket' : 'bolt',
      wx: clamp(state.px + Math.sin(state.angle) * offset, -7.5, 7.5),
      wy: clamp(state.py + Math.cos(state.angle) * offset, -1.4, 28),
      vx: Math.sin(state.angle) * 0.3, vy: Math.cos(state.angle) * 0.3,
      life: mine ? 480 : Math.ceil(a.range / 0.3) + 1, age: 0, radius: mine ? 1.25 : 0.22,
      splash: mine ? reach.effectRadius : a.splash ?? (a.sourceType === 'rocket' ? 2.2 : 0), damage, color: a.color });
    if (p.projectiles.length > 24) p.projectiles.shift();
    if (!mine) state.muzzle = 12;
  } else if (a.kind === 'pulse') {
    for (const enemy of state.enemies) if (distance(enemy, { wx: state.px, wy: state.py }) <= a.range) hit(enemy);
    effect(state, 'pulse', a);
  } else if (a.kind === 'control' || a.kind === 'control_pulse') {
    const targets = a.kind === 'control_pulse'
      ? state.enemies.filter(enemy => enemy.hp > 0 && distance(enemy, { wx: state.px, wy: state.py }) <= a.range)
      : getExtinctionAimCandidates(state, a.range, getExtinctionActionAimCone(a)).slice(0, 1).map(entry => entry.enemy);
    for (const enemy of targets) {
      enemy.protocolControl = { ownerId: state.heroId, runId: state.runId, life: a.duration, slow: 0.45 };
      effect(state, 'impact', a, enemy.wx, enemy.wy);
    }
    if (targets.length && slot !== 'special') p.charge = clamp(p.charge + 8, 0, 100);
    effect(state, 'control', a);
  } else if (a.kind === 'heal') {
    state.hp = Math.min(state.maxHp, state.hp + (slot === 'special' ? 65 : 28));
    effect(state, 'heal', a);
  } else if (a.kind === 'guard') {
    p.guard = a.duration; p.reduction = a.reduction; effect(state, 'guard', a);
  } else if (a.kind === 'dash' || a.kind === 'teleport') {
    const start = { wx: state.px, wy: state.py };
    const distance = getExtinctionActionReach(a).value;
    state.px = clamp(state.px + Math.sin(state.angle) * distance, -7.5, 7.5);
    state.py = clamp(state.py + Math.cos(state.angle) * distance, -1.4, 28);
    if (slot === 'simple') creditUsefulExtinctionEvasion(state, start);
    p.guard = a.duration; p.reduction = a.reduction; effect(state, 'dash', a);
  } else if (a.kind === 'buff') {
    p.buff = 240; effect(state, 'buff', a);
  } else if (a.kind === 'barricade') {
    p.barricade = 300; effect(state, 'guard', a);
  } else if (a.kind === 'drone') {
    p.drone = 360; effect(state, 'drone', a);
  } else if (a.kind === 'support') {
    state.hp = Math.min(state.maxHp, state.hp + (slot === 'special' ? 45 : 18));
    p.reduction = Math.max(p.guard > 0 ? p.reduction : 0, 0.3); p.guard = a.duration; effect(state, 'heal', a);
  } else if (a.kind === 'summon') {
    p.summon = { ownerId: p.ownerId, runId: p.runId, wx: state.px, wy: state.py,
      life: Math.max(180, a.duration), age: 0, range: getExtinctionActionReach(a).value, damage: Math.round(damage * 0.45),
      color: a.color, slot };
    effect(state, 'summon', a);
  } else if (a.kind === 'reflection') {
    p.reflection = { ownerId: p.ownerId, runId: p.runId, wx: state.px, wy: state.py,
      life: 300, age: 0, range: getExtinctionActionReach(a).value, damage, color: a.color };
    effect(state, 'reflection', a);
  } else if (a.kind === 'return_probe') {
    p.returnProbe = { ownerId: p.ownerId, runId: p.runId, wx: state.px, wy: state.py,
      life: 360, color: a.color };
    effect(state, 'return', a);
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
  for (const enemy of state.enemies) {
    const control = enemy.protocolControl;
    if (control && (control.ownerId !== state.heroId || control.runId !== state.runId || --control.life <= 0)) delete enemy.protocolControl;
  }
  if (p.drone > 0 && p.drone % 60 === 0) state.hp = Math.min(state.maxHp, state.hp + 5);
  if (p.returnProbe && (!currentSupport(p.returnProbe, state) || --p.returnProbe.life <= 0)) p.returnProbe = null;
  if (p.reflection) {
    const support = p.reflection;
    if (!currentSupport(support, state) || --support.life <= 0) p.reflection = null;
    else if (++support.age % 60 === 0) {
      const target = state.enemies.filter(enemy => enemy.hp > 0
        && Number.isFinite(enemy.wx) && Number.isFinite(enemy.wy)
        && distance(enemy, support) <= support.range)
        .sort((a, b) => distance(a, support) - distance(b, support))[0];
      if (target) {
        // Same central damage path as every other action: shields and kills
        // retain their existing rules. Damage is delayed until this active tick.
        const dealt = damageExtinctionEnemy(state, target, support.damage, onKill, 8);
        if (dealt) effect(state, 'impact', support, target.wx, target.wy);
      }
    }
  }
  if (p.summon) {
    const support = p.summon;
    if (!currentSupport(support, state) || --support.life <= 0) p.summon = null;
    else if (++support.age % 60 === 0) {
      const target = state.enemies.filter(enemy => enemy.hp > 0 && distance(enemy, support) <= support.range)
        .sort((a, b) => distance(a, support) - distance(b, support))[0];
      if (target && damageExtinctionEnemy(state, target, support.damage, onKill, support.slot === 'special' ? 0 : 4)) {
        effect(state, 'impact', support, target.wx, target.wy);
      }
    }
  }
  p.effects = p.effects.filter(e => --e.life > 0);
  p.projectiles = p.projectiles.filter(shot => {
    if (shot.ownerId !== state.heroId || shot.runId !== state.runId || --shot.life <= 0) return false;
    shot.age += 1;
    const ox = shot.wx, oy = shot.wy;
    if (shot.kind !== 'mine') {
      const speed = Math.hypot(shot.vx, shot.vy);
      const step = shot.source === 'pickup' ? Math.min(speed, Math.max(0, finite(shot.remainingRange))) : speed;
      if (shot.source === 'pickup' && (!Number.isFinite(speed) || speed <= 0 || step <= 0)) return false;
      shot.wx += shot.vx * (speed ? step / speed : 0);
      shot.wy += shot.vy * (speed ? step / speed : 0);
      if (shot.source === 'pickup') shot.remainingRange = Math.max(0, shot.remainingRange - step);
    }
    let nearest = null, first = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.hp <= 0 || (shot.kind === 'mine' && shot.age < 30)) continue;
      const t = extinctionSegmentHit(ox, oy, shot.wx, shot.wy, enemy.wx, enemy.wy,
        shot.radius + 0.28 * (enemy.size || 1));
      if (t !== null && t < first) { nearest = enemy; first = t; }
    }
    if (!nearest) return (shot.source !== 'pickup' || shot.remainingRange > 0.000001)
      && Math.abs(shot.wx) < 30 && shot.wy > -30 && shot.wy < 60;
    shot.wx = ox + (shot.wx - ox) * first; shot.wy = oy + (shot.wy - oy) * first;
    if (shot.source === 'pickup') {
      const hits = state.enemies.filter(enemy => enemy.hp > 0
        && (enemy === nearest || (shot.splash > 0 && distance(enemy, shot) <= shot.splash)))
        .map(enemy => {
          // A Slayer's close-range damage applies when contact actually occurs,
          // including blast victims. Movement during flight can change proximity.
          const damage = distance(enemy, { wx: state.px, wy: state.py }) < 2.2
            ? finite(shot.closeDamage, shot.damage) : shot.damage;
          return { enemy, damage: enemy === nearest ? damage
            : Math.round(damage * (1 - 0.65 * distance(enemy, shot) / shot.splash)) };
        });
      applyExtinctionPickupHits(state, shot, hits, onKill);
      // The blast is a physical impact, including against a protected core.
      // Its visual ring does not claim successful damage or ultimate charge.
      if (shot.splash > 0) effect(state, 'explosion', shot, shot.wx, shot.wy);
      return false;
    }
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
export function getExtinctionProtocolSpeedFactor(state, enemy) {
  const control = enemy?.protocolControl;
  return valid(state) && control?.life > 0 && control.ownerId === state.heroId && control.runId === state.runId
    ? control.slow : 1;
}
/** Procedural combat feedback only: no claim of authored character animation. */
export function drawExtinctionProtocols(ctx, state, width, height, projectWorld, projectileArt = null) {
  const p = state?.protocols;
  if (!p || !valid(state)) return;
  ctx.save();
  for (const [kind, support] of [['reflection', p.reflection], ['probe', p.returnProbe], ['summon', p.summon]]) {
    if (!currentSupport(support, state)) continue;
    const projection = projectWorld(support, state);
    if (projection.camZ <= 0.2 || Math.abs(projection.aim) > 1.6) continue;
    const x = width / 2 + projection.aim * width * 0.78;
    const y = height * 0.55 + 115 / projection.camZ;
    const radius = clamp(28 / projection.camZ, 4, 30);
    ctx.globalAlpha = 0.65; ctx.strokeStyle = support.color; ctx.lineWidth = 2;
    ctx.beginPath();
    if (kind === 'reflection') {
      ctx.moveTo(x, y - radius * 2); ctx.lineTo(x + radius, y - radius);
      ctx.lineTo(x, y); ctx.lineTo(x - radius, y - radius); ctx.closePath();
    } else {
      ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.moveTo(x, y - radius * 1.6); ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
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
    const x = width / 2 + projection.aim * width * 0.78;
    const y = height * 0.55 + (shot.kind === 'mine' ? 115 : 15) / projection.camZ;
    const progress = shot.maxLife ? 1 - shot.life / shot.maxLife : 0;
    const radius = shot.kind === 'explosion'
      ? clamp(shot.effectRadius * 44 * (0.2 + progress * 0.8) / projection.camZ, 2, 90)
      : clamp((shot.kind === 'impact' ? 36 : 15) / projection.camZ, 2, 32);
    ctx.globalAlpha = shot.life && shot.maxLife ? shot.life / shot.maxLife : 0.9;
    ctx.strokeStyle = shot.color; ctx.fillStyle = shot.color; ctx.lineWidth = 2;
    const image = projectileArt?.image;
    if (shot.source !== 'pickup' && shot.kind === 'bolt' && shot.ownerId === projectileArt?.ownerId && image?.complete
      && image.naturalWidth > 0 && image.naturalHeight > 0) {
      const h = radius * 2, w = h * image.naturalWidth / image.naturalHeight;
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, x - w / 2, y - h / 2, w, h);
      continue;
    }
    if (shot.source === 'pickup' && shot.kind === 'rocket') {
      ctx.beginPath(); ctx.moveTo(x, y - radius * 1.7); ctx.lineTo(x + radius * 0.65, y);
      ctx.lineTo(x, y + radius * 0.6); ctx.lineTo(x - radius * 0.65, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#ffe49d'; ctx.beginPath(); ctx.moveTo(x, y + radius * 0.6);
      ctx.lineTo(x, y + radius * 2); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (['mine', 'impact', 'explosion'].includes(shot.kind)) ctx.stroke(); else ctx.fill();
      if (shot.source === 'pickup' && shot.kind === 'plasma') {
        ctx.strokeStyle = '#d4f8ff'; ctx.beginPath(); ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }
  if (p.guard > 0 || p.barricade > 0) {
    ctx.globalAlpha = 0.35; ctx.strokeStyle = '#39c5bb'; ctx.lineWidth = 5;
    ctx.strokeRect(5, 5, width - 10, height - 10);
  }
  ctx.restore();
}
