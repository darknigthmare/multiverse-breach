import { discContactTime } from './signatureReturningDisc.js';

// Four independently steered, battle-local Wraithverge spirits. This is a
// bounded Nexus adaptation, not a port of Hexen's mana or repeated touch damage.
export const SPIRIT_RULES = Object.freeze({ count: 4, speed: 8, rpgSpeed: 14,
  turn: 0.16, radius: 14, emergence: 6, lifetime: 240, maxGroups: 16, maxTargets: 8, tail: 7 });
const living = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0
  && actor.state !== 'dead' && actor.nonCombat !== true && actor.combatEnabled !== false
  && actor.combatEligible !== false && !actor.nonCombatTrial;
const positioned = actor => Number.isFinite(actor?.x) && Number.isFinite(actor?.y);
const center = actor => ({ x: actor.x, y: actor.y - 18 });
const idOf = actor => actor?.battleId || actor?.runtimeId || actor?.id || null;
const turnToward = (heading, desired) => heading + Math.max(-SPIRIT_RULES.turn,
  Math.min(SPIRIT_RULES.turn, Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading))));

export function createSignatureSpiritSwarm(engine, { mode, sideOf, enemiesOf, validAction }) {
  const groups = new Map();
  let serial = 0, disposed = false;
  const ownerValid = group => living(group.owner) && positioned(group.owner)
    && sideOf(group.owner) === group.side && validAction(group.owner, group.action, group.key);
  const targetValid = (group, spirit) => living(spirit.target) && positioned(spirit.target)
    && enemiesOf(group.owner).includes(spirit.target);
  const prune = () => {
    if (disposed || engine.disposed || engine.gameOver) { groups.clear(); return; }
    for (const [owner, group] of groups) {
      if (!ownerValid(group)) { groups.delete(owner); continue; }
      group.spirits = group.spirits.filter(spirit => targetValid(group, spirit));
      if (!group.spirits.length) groups.delete(owner);
    }
  };
  const blocked = () => disposed || engine.disposed || engine.gameOver || engine.paused
    || engine.isTargetingPaused?.() || engine.isMatchInputLocked?.();
  const has = owner => { prune(); return groups.has(owner); };
  const canLaunch = owner => { prune(); return !blocked() && !groups.has(owner) && groups.size < SPIRIT_RULES.maxGroups; };
  const launch = (owner, targets, definition, totalDamage) => {
    if (!canLaunch(owner) || !['RPG', 'Smash'].includes(mode) || !living(owner) || !positioned(owner)
      || !sideOf(owner) || definition?.summonAgent !== 'wraithverge-spirit' || definition.hits !== SPIRIT_RULES.count
      || !validAction(owner, owner.special, definition.key) || !Number.isFinite(totalDamage) || totalDamage <= 0
      || !Array.isArray(targets) || !targets.length || targets.length > SPIRIT_RULES.maxTargets || new Set(targets).size !== targets.length
      || targets.some(target => !living(target) || !positioned(target) || !enemiesOf(owner).includes(target))) return false;
    const origin = center(owner);
    const group = { owner, side: sideOf(owner), key: definition.key, action: owner.special, spirits: [],
      color: definition.color || '#d0b8ff', damage: totalDamage / SPIRIT_RULES.count };
    for (let index = 0; index < SPIRIT_RULES.count; index++) {
      const target = targets[index % targets.length], aim = center(target);
      group.spirits.push({ serial: ++serial, target, age: 0, x: origin.x, y: origin.y,
        heading: Math.atan2(aim.y - origin.y, aim.x - origin.x) + (index - 1.5) * 0.35,
        previousTarget: aim, trail: [] });
    }
    groups.set(owner, group);
    return true;
  };
  // Observe KO before a caller can revive the same object in this simulation tick.
  const onKnockout = actor => {
    groups.delete(actor);
    for (const [owner, group] of groups) {
      group.spirits = group.spirits.filter(spirit => spirit.target !== actor);
      if (!group.spirits.length) groups.delete(owner);
    }
  };
  const advance = () => {
    prune(); if (blocked()) return;
    for (const [owner, group] of [...groups]) {
      for (const spirit of [...group.spirits]) {
        if (groups.get(owner) !== group || !group.spirits.includes(spirit)) continue;
        if (!ownerValid(group) || !targetValid(group, spirit)) { prune(); continue; }
        const remove = () => {
          group.spirits = group.spirits.filter(item => item !== spirit);
          if (!group.spirits.length && groups.get(owner) === group) groups.delete(owner);
        };
        if (++spirit.age > SPIRIT_RULES.lifetime) { remove(); continue; }
        const aim = center(spirit.target);
        if (spirit.age <= SPIRIT_RULES.emergence) { spirit.previousTarget = aim; continue; }
        const from = { x: spirit.x, y: spirit.y };
        spirit.heading = turnToward(spirit.heading, Math.atan2(aim.y - from.y, aim.x - from.x));
        const speed = mode === 'RPG' ? SPIRIT_RULES.rpgSpeed : SPIRIT_RULES.speed;
        const to = { x: from.x + Math.cos(spirit.heading) * speed, y: from.y + Math.sin(spirit.heading) * speed };
        const previous = spirit.previousTarget;
        const contact = discContactTime({ x: from.x - previous.x, y: from.y - previous.y },
          { x: to.x - aim.x, y: to.y - aim.y }, { x: 0, y: 0 }, SPIRIT_RULES.radius);
        spirit.trail.push(from); if (spirit.trail.length > SPIRIT_RULES.tail) spirit.trail.shift();
        spirit.x = from.x + (to.x - from.x) * (contact ?? 1);
        spirit.y = from.y + (to.y - from.y) * (contact ?? 1);
        spirit.previousTarget = aim;
        // Holy spirits intentionally traverse platforms; unlike a Smart Disc,
        // they are not solid missiles. No new target is acquired after launch.
        if (contact !== null) {
          remove(); // Mark before dispatch, including recursive damage callbacks.
          engine.applyDamage(owner, spirit.target, group.damage, ...(mode === 'Smash' ? [0] : []));
          engine.playSfx?.('hit'); prune();
        }
      }
    }
  };
  const snapshot = () => {
    prune(); return [...groups.values()].flatMap(group => group.spirits.map(spirit => ({
      serial: spirit.serial, ownerId: idOf(group.owner), targetId: idOf(spirit.target), sourceKey: group.key,
      x: spirit.x, y: spirit.y, age: spirit.age, remaining: SPIRIT_RULES.lifetime - spirit.age,
      phase: spirit.age <= SPIRIT_RULES.emergence ? 'emerging' : 'seeking', heading: spirit.heading
    })));
  };
  const draw = (ctx, { reducedMotion = false } = {}) => {
    if (!ctx || disposed || engine.disposed || engine.gameOver || !groups.size) return;
    ctx.save();
    try {
      for (const group of groups.values()) for (const spirit of group.spirits) {
        ctx.strokeStyle = group.color; ctx.fillStyle = group.color; ctx.lineWidth = 3;
        if (!reducedMotion && spirit.trail.length) {
          ctx.globalAlpha = 0.45; ctx.beginPath();
          spirit.trail.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
          ctx.lineTo(spirit.x, spirit.y); ctx.stroke();
        }
        ctx.globalAlpha = spirit.age <= SPIRIT_RULES.emergence ? 0.4 : 0.85;
        ctx.beginPath(); ctx.arc(spirit.x, spirit.y, 6, 0, Math.PI * 2); ctx.fill();
      }
    } finally { ctx.restore(); }
  };
  return { launch, canLaunch, advance, has, snapshot, draw, onKnockout,
    dispose: () => { disposed = true; groups.clear(); } };
}
