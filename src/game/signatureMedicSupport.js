// Per-battle stock-Medi-Gun support. Never mutate saves, shared definitions or
// unrelated guard/buff fields. This is NOT Kritzkrieg, Quick-Fix or Vaccinator.
const alive = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0
  && actor.state !== 'dead' && actor.nonCombat !== true && actor.combatEnabled !== false
  && actor.combatEligible !== false && !actor.nonCombatTrial;
const positioned = actor => Number.isFinite(actor?.x) && Number.isFinite(actor?.y);
const id = actor => actor?.battleId || actor?.runtimeId || actor?.id;
const sourceId = actor => actor?.sourceId || actor?.id;
const universe = actor => actor?.sourceUniverse || actor?.universe;
export const STOCK_UBER_TICKS = 480;

export function createSignatureMedicSupport(engine, mode) {
  const links = new Map();
  const sideOf = actor => engine.heroes?.includes(actor) ? 'player' : engine.enemies?.includes(actor) ? 'enemy' : null;
  const validCaster = link => !engine.disposed && !engine.gameOver && alive(link.caster)
    && sideOf(link.caster) === link.side && link.caster.special === link.action
    && sourceId(link.caster) === link.sourceId && universe(link.caster) === link.universe
    && link.remaining > 0 && (!link.caster.medigunType || link.caster.medigunType === 'stock');
  const validPatient = link => alive(link.patient) && sideOf(link.patient) === link.side
    && positioned(link.patient) && positioned(link.caster)
    && Math.hypot(link.patient.x - link.caster.x, link.patient.y - link.caster.y) <= link.range;
  const prune = () => {
    for (const [caster, link] of links) {
      if (!validCaster(link)) links.delete(caster);
      else if (link.patient !== caster && !validPatient(link)) link.patient = null;
    }
  };
  const canLink = (caster, patient, definition) => definition?.protection === 'stock-uber'
    && definition.key === 'team_fortress_2_medic' && caster?.special?.sourceSignatureKey === definition.key
    && sourceId(caster) === definition.actorId && universe(caster) === definition.universe
    && alive(caster) && !!sideOf(caster) && alive(patient) && sideOf(patient) === sideOf(caster)
    && positioned(caster) && positioned(patient) && Number.isFinite(definition.range) && definition.range > 0
    && (!caster.medigunType || caster.medigunType === 'stock')
    && Math.hypot(patient.x - caster.x, patient.y - caster.y) <= definition.range;
  const grant = (caster, patient, definition) => {
    prune();
    if (engine.disposed || engine.gameOver || engine.paused || !canLink(caster, patient, definition) || links.has(caster)) return false;
    links.set(caster, { caster, patient, side: sideOf(caster), action: caster.special, sourceId: sourceId(caster), universe: universe(caster),
      remaining: STOCK_UBER_TICKS, range: definition.range, color: caster.secondaryColor || '#70d7ff' });
    return true;
  };
  const active = caster => { prune(); return links.has(caster); };
  const protects = (actor, ignoreCaster = null) => {
    prune();
    if (!alive(actor) || !sideOf(actor)) return false;
    return [...links.values()].some(link => link.caster !== ignoreCaster && (link.caster === actor || link.patient === actor));
  };
  const release = caster => links.delete(caster);
  const advance = () => {
    prune();
    if (engine.paused || engine.isTargetingPaused?.() || engine.isMatchInputLocked?.()) return;
    for (const link of links.values()) link.remaining--;
    prune();
  };
  const blockHit = (attacker, defender, damage, knockback = 10) => {
    if (!Number.isFinite(damage) || damage <= 0 || !protects(defender)) return false;
    // World damage and scripted hazards remain authoritative. No immunity to
    // falls, telefrags, direct HP edits or unknown environmental attackers.
    if (!sideOf(attacker) || attacker === defender) return false;
    if (mode === 'Smash' && positioned(attacker) && positioned(defender)
      && Number.isFinite(knockback) && knockback > 0) {
      // Stock invulnerability does not provide knockback immunity. Preserve the
      // native game's weight factors without calling its damaging side effects.
      const terrain = engine.arena?.tags?.includes('wide') ? 1.12 : engine.arena?.tags?.includes('pit') ? 0.88 : 1;
      defender.vx = (attacker.x < defender.x ? 1 : -1) * knockback * (defender.isBoss ? 0.55 : 1) * terrain;
      defender.vy = Math.min(Number.isFinite(defender.vy) ? defender.vy : 0, -2.5 - Math.min(5, knockback * 0.08));
    }
    engine.playSfx?.('shield');
    return true;
  };
  const snapshot = () => {
    prune();
    return [...links.values()].map(link => ({ casterId: id(link.caster), patientId: id(link.patient),
      casterName: link.caster.name, patientName: link.patient?.name || null, ticks: link.remaining, duration: STOCK_UBER_TICKS }));
  };
  const draw = ctx => {
    prune();
    if (!ctx || !links.size) return;
    ctx.save();
    try {
      ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 2;
      for (const link of links.values()) {
        ctx.strokeStyle = link.color; ctx.fillStyle = link.color;
        if (link.patient && link.patient !== link.caster) {
          ctx.beginPath(); ctx.moveTo(link.caster.x, link.caster.y - 16);
          ctx.lineTo(link.patient.x, link.patient.y - 16); ctx.stroke();
        }
        for (const actor of new Set([link.caster, link.patient].filter(Boolean))) {
          if (!positioned(actor)) continue;
          ctx.beginPath(); ctx.arc(actor.x, actor.y - 19, 28, 0, Math.PI * 2); ctx.stroke();
          ctx.fillText(`UBER ${(link.remaining / 60).toFixed(1)}s`, actor.x, actor.y - 53);
        }
      }
    } finally { ctx.restore(); }
  };
  return { canLink, grant, active, protects, release, advance, blockHit, snapshot, draw, dispose: () => links.clear() };
}
