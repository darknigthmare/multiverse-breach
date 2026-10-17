// Battle-local projectile simulation. No timer, save state, prototype mutation,
// target reacquisition or bonus impact on return. Pixel rules are Nexus tuning.
const living = a => !!a && Number.isFinite(a.currentHp) && a.currentHp > 0
  && a.state !== 'dead' && a.nonCombat !== true && a.combatEnabled !== false
  && a.combatEligible !== false && !a.nonCombatTrial;
const positioned = a => Number.isFinite(a?.x) && Number.isFinite(a?.y);
const center = a => ({ x: a.x, y: a.y - 18 });
const runtimeId = a => a?.battleId || a?.runtimeId || a?.id || null;
export const DISC_RULES = Object.freeze({ speed: 9, returnSpeed: 12, hitRadius: 20, catchRadius: 14, lifetime: 150, maxActive: 32 });

// Segment/circle entry time, not just a point sample: fast discs and moving
// targets cannot tunnel through each other between two simulation ticks.
export function discContactTime(from, to, point, radius) {
  if (![from?.x, from?.y, to?.x, to?.y, point?.x, point?.y, radius].every(Number.isFinite) || radius < 0) return null;
  const x = from.x - point.x, y = from.y - point.y;
  const dx = to.x - from.x, dy = to.y - from.y;
  const c = x * x + y * y - radius * radius;
  if (c <= 0) return 0;
  const a = dx * dx + dy * dy;
  if (a === 0) return null;
  const b = 2 * (x * dx + y * dy), discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const t = (-b - Math.sqrt(discriminant)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}
const railContact = (from, to, p) => {
  if (p?.passThrough === true || ![p?.x1, p?.x2, p?.y].every(Number.isFinite) || p.x2 < p.x1 || to.y === from.y) return null;
  const t = (p.y - from.y) / (to.y - from.y);
  const x = from.x + (to.x - from.x) * t;
  return t > 0 && t <= 1 && x >= p.x1 && x <= p.x2 ? t : null;
};

export function createSignatureReturningDiscs(engine, { sideOf, enemiesOf, validAction }) {
  const flights = new Map();
  let serial = 0;
  const ownerValid = p => living(p.owner) && positioned(p.owner) && sideOf(p.owner) === p.side
    && validAction(p.owner, p.action, p.key);
  const targetValid = p => living(p.target) && positioned(p.target) && enemiesOf(p.owner).includes(p.target);
  const prune = () => {
    if (engine.disposed || engine.gameOver) { flights.clear(); return; }
    for (const [owner, p] of flights) if (!ownerValid(p)) flights.delete(owner);
  };
  const has = owner => { prune(); return flights.has(owner); };
  // Observe KO at the damage boundary, before a caller can revive the same
  // object during this tick. Neither owner nor target can inherit the old hit.
  const onKnockout = actor => {
    flights.delete(actor);
    for (const p of flights.values()) if (p.target === actor) p.phase = 'return';
  };
  const launch = (owner, target, definition, damage) => {
    prune();
    if (engine.paused || engine.disposed || engine.gameOver || definition?.projectile !== 'returning-disc'
      || !living(owner) || !positioned(owner) || !sideOf(owner) || !living(target) || !positioned(target)
      || !enemiesOf(owner).includes(target) || !Number.isFinite(damage) || damage <= 0
      || !Number.isFinite(definition.range) || definition.range <= 0
      || !validAction(owner, owner.special, definition.key) || flights.has(owner) || flights.size >= DISC_RULES.maxActive) return false;
    const from = center(owner), aim = center(target), distance = Math.hypot(aim.x - from.x, aim.y - from.y);
    if (distance > definition.range) return false;
    const dx = distance ? (aim.x - from.x) / distance : owner.facing === -1 ? -1 : 1;
    const dy = distance ? (aim.y - from.y) / distance : 0;
    flights.set(owner, { serial: ++serial, key: definition.key, owner, target, action: owner.special,
      side: sideOf(owner), x: from.x, y: from.y, dx, dy, distance: 0,
      limit: Math.min(definition.range, Math.max(30, distance + 25)), previousTarget: aim,
      age: 0, phase: 'outbound', hit: false, damage, color: definition.color || '#f0c58c' });
    return true;
  };
  const advance = () => {
    prune();
    if (engine.paused || engine.isTargetingPaused?.() || engine.isMatchInputLocked?.()) return;
    // Snapshot: a damage callback may remove or add a flight re-entrantly.
    const pending = Array.from(flights.entries());
    for (const [owner, p] of pending) {
      if (flights.get(owner) !== p) continue;
      if (++p.age > DISC_RULES.lifetime) { flights.delete(owner); continue; }
      const from = { x: p.x, y: p.y };
      if (p.phase === 'outbound' && !targetValid(p)) p.phase = 'return';
      if (p.phase === 'return') {
        const home = center(owner), distance = Math.hypot(home.x - p.x, home.y - p.y);
        if (distance <= DISC_RULES.catchRadius + DISC_RULES.returnSpeed) { flights.delete(owner); continue; }
        p.x += (home.x - p.x) / distance * DISC_RULES.returnSpeed;
        p.y += (home.y - p.y) / distance * DISC_RULES.returnSpeed;
        continue;
      }
      const step = Math.min(DISC_RULES.speed, p.limit - p.distance);
      const to = { x: p.x + p.dx * step, y: p.y + p.dy * step };
      const now = center(p.target), previous = p.previousTarget;
      const hitAt = discContactTime({ x: from.x - previous.x, y: from.y - previous.y },
        { x: to.x - now.x, y: to.y - now.y }, { x: 0, y: 0 }, DISC_RULES.hitRadius);
      const rails = (engine.platforms || []).map(rail => railContact(from, to, rail)).filter(t => t !== null);
      const blockedAt = rails.length ? Math.min(...rails) : null;
      const contact = blockedAt !== null && (hitAt === null || blockedAt <= hitAt) ? blockedAt : hitAt;
      p.x = from.x + (to.x - from.x) * (contact ?? 1);
      p.y = from.y + (to.y - from.y) * (contact ?? 1);
      p.distance += step * (contact ?? 1); p.previousTarget = now;
      if (blockedAt !== null && (hitAt === null || blockedAt <= hitAt)) p.phase = 'return';
      else if (hitAt !== null && !p.hit) {
        // Mark before dispatch: re-entrant damage callbacks cannot hit twice.
        p.hit = true; p.phase = 'return';
        engine.applyDamage(owner, p.target, p.damage, 8);
        engine.playSfx?.('hit');
        prune();
      } else if (p.distance >= p.limit) p.phase = 'return';
    }
  };
  const snapshot = () => {
    prune();
    return [...flights.values()].map(p => ({ serial: p.serial, ownerId: runtimeId(p.owner), targetId: runtimeId(p.target),
      sourceKey: p.key, x: p.x, y: p.y, age: p.age, phase: p.phase, hit: p.hit }));
  };
  const draw = ctx => {
    prune(); if (!ctx || !flights.size) return;
    ctx.save();
    try {
      ctx.lineWidth = 2;
      for (const p of flights.values()) {
        ctx.strokeStyle = p.color; ctx.fillStyle = '#26232c';
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 10, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.x - 6, p.y); ctx.lineTo(p.x + 6, p.y); ctx.stroke();
      }
    } finally { ctx.restore(); }
  };
  return { launch, advance, has, snapshot, draw, onKnockout, release: owner => flights.delete(owner), dispose: () => flights.clear() };
}
