// Opt-in enemy control. Other support/status effects keep their own rules.
import { isPhaselockProfile, isPhaselockTargetEligible, drawCombatControl } from './combat/combatControlWave15.js';
import { WAVE_16_REVIEWED_IDS } from './combat/cohortWave16.js';
import { faceGridUnitToward } from './tacticalFacing.js';
import { getTerrainNeighbors } from './tacticsTerrain.js';
import { resolveCombatAbility } from './combatIdentity.js';
import { isSourceControlTargetEligibleWave16, advanceSourceControlWave16 } from './combat/combatControlWave16.js';
import { advanceWave16Protection } from './combat/combatProtectionWave16.js';
import { hasSourceProtectionProfileWave16, canBeginSourceProtectionWave16, armSourceProtectionWave16,
  interceptSourceProtectionHitWave16, advanceSourceCombatStatusesWave16, beginSourceControlWave16, clearSourceCombatStatusesWave16,
  getPossessedBodyWave16, releaseSourcePossessionWave16, sourceEffectiveSideWave16,
  sourceRuntimeIdWave16, sourceHeroIdWave16, getPossessedSligActionWave16, isSourceImmobilizedWave16,
  drawSourceCombatStatusWave16, projectSourceSligMuzzleWave16 } from './combat/sourceCombatRuntimeWave16.js';
import { getSourceHitSequenceWave16, takeDueSourceHitsWave16 } from './combat/combatHitSequenceWave16.js';
export const isTacticsPhaselockProfile = isPhaselockProfile;

export const isTacticsUnitControlled = unit => unit?.currentHp > 0
  && unit.tacticsControl?.kind === 'phaselock'
  && (unit.tacticsControl.remainingTurns > 0 || unit.tacticsControl.releasePending === true);

export const isTacticsPhaselockTargetEligible = unit => isPhaselockTargetEligible(unit) && !isTacticsUnitControlled(unit);

// A static, simulation-owned bind marker surrounds the real sprite at its
// actual support. It neither creates a pose nor changes surface occupancy.
export function drawTacticsPhaselock(ctx, unit, height) {
  drawSourceCombatStatusWave16(ctx, unit, height);
  if (!isTacticsUnitControlled(unit)) return false;
  return drawCombatControl(ctx, { ...unit, combatControl: { kind: 'phaselock', remaining: 1, duration: 1 } }, height);
}

const reviewedWave16 = new Set(WAVE_16_REVIEWED_IDS);
const living = unit => unit?.currentHp > 0;
export const isTacticsSourceActorWave16 = unit => reviewedWave16.has(sourceHeroIdWave16(unit))
  || !!getPossessedSligActionWave16(unit);
export const isTacticsSourceControlledWave16 = unit => isSourceImmobilizedWave16(unit)
  || unit?.tacticsSourceStunTicksWave16 > 0;

// Keep typed semantic fields before the old name/weapon inference. Distances
// are explicitly converted from source-action pixels to grid units here.
export function getTacticsSourceProfileWave16(unit, slot) {
  if (!isTacticsSourceActorWave16(unit)) return null;
  const raw = getPossessedSligActionWave16(unit, slot === 'enemy' ? 'simple' : slot);
  const p = raw ? { ...raw.targeting, sourceHeroId: 'oddworld_slig', universe: 'Oddworld',
    name: raw.name, multiplier: raw.dmg, duration: raw.animationDuration, hitAt: raw.hitAt, sourceAbility: raw }
    : resolveCombatAbility(unit, slot === 'enemy' ? 'simple' : slot);
  if (!p) return null;
  const melee = p.delivery === 'melee', range = p.targetSide === 'self' ? 0
    : Math.max(1, Math.min(melee ? 3 : 8, Math.ceil((p.range || (melee ? 85 : 480)) / (melee ? 100 : 140))));
  return { ...p, actionType: slot, range, minRange: p.targetSide === 'self' || p.targetSide === 'ally' ? 0 : 1,
    areaRadius: Math.min(range, Math.max(0, Math.ceil((p.areaRadius || 0) / 140))),
    axes: 3, directions: 8, pierceUnits: false, pierceObstacles: false, pierceTerrain: false,
    blocksOnUnits: p.effect === 'damage' && melee, requiresLineOfSight: p.targetSide !== 'self',
    maxTargets: p.maxTargets || (p.shape === 'single' ? 1 : 8) };
}

// Simulation-owned actions use the same real command, range, surfaces and AP
// for both controllers. No wall-clock callback applies a source hit.
export class TacticsSourceRuntimeWave16 {
  constructor(engine) { this.engine = engine; this.action = null; this.proxy = null; this.events = []; }
  get actors() { return [...this.engine.heroes, ...this.engine.enemies]; }
  storedSide = unit => this.engine.heroes.includes(unit) ? 'hero' : this.engine.enemies.includes(unit) ? 'enemy' : 'escort';
  side(unit) { return sourceEffectiveSideWave16(unit, this.actors, this.storedSide); }
  owns(unit) { return isTacticsSourceActorWave16(unit); }
  profile(unit, slot) { return getTacticsSourceProfileWave16(unit, slot); }
  record(event, target = null, accepted = true) {
    const entry = { tick: this.engine.sourceSimulationTickWave16 || 0, event, targetId: sourceRuntimeIdWave16(target) || null, accepted };
    this.events.push(entry); if (this.events.length > 1000) this.events.shift();
  }
  resolution(actor, target, slot) {
    const e = this.engine, profile = e.getAttackProfile(actor, slot), side = this.side(actor._tacticsSourceUnit || actor);
    const result = { profile, validTypes: profile.targetSide === 'enemy' ? [side === 'hero' ? 'enemy' : 'hero'] : [side], impactCells: [], clickedUnit: null, candidates: [] };
    if (!living(actor) || !target) return result;
    const tx = target.gridX ?? target.x, ty = target.gridY ?? target.y;
    const supports = profile.effect !== 'damage' && profile.effect !== 'control';
    const impact = supports || profile.shape === 'single' ? null : e.getAttackImpactCells(actor, target, slot);
    const pool = [...this.actors, ...(e.escortUnit ? [e.escortUnit] : [])];
    for (const unit of pool) {
      if (profile.effect === 'revive' ? living(unit) : !living(unit)) continue;
      const own = this.side(unit) === side || this.side(unit) === 'escort' && side === 'hero';
      if (profile.targetSide === 'enemy' ? own : !own) continue;
      if (profile.targetSide === 'self' && unit !== (actor._tacticsSourceUnit || actor) || profile.excludeSelf && unit === actor) continue;
      if (profile.effect === 'control' && !isSourceControlTargetEligibleWave16(profile, unit)) continue;
      const clicked = unit.gridX === tx && unit.gridY === ty && (!target.surfaceId || unit.surfaceId === target.surfaceId);
      if (profile.shape === 'single' && !clicked) continue;
      if (!supports && profile.shape !== 'single' && !impact?.some(c => e.unitOccupiesCell(unit, c.x, c.y, c.surfaceId))) continue;
      if (!e.canAttackCell(actor, unit, profile)) continue;
      if (profile.effect === 'heal' && !(unit.currentHp < unit.maxHp * (unit.statusEffects?.radiated > 0 ? .5 : 1))) continue;
      const cell = { x: unit.gridX, y: unit.gridY, gridX: unit.gridX, gridY: unit.gridY, surfaceId: unit.surfaceId };
      const entry = { unit, type: this.side(unit), cell, order: result.candidates.length };
      result.candidates.push(entry); result.impactCells.push(cell); if (clicked) result.clickedUnit = unit;
    }
    result.candidates = e.orderAttackTargetCandidates(actor, target, profile, result.candidates, result.clickedUnit).slice(0, profile.maxTargets);
    return result;
  }
  command(x, y, surfaceId) {
    const e = this.engine, actor = e.activeUnit;
    if (!this.owns(actor) || e.actionPhase !== 'action') return null;
    return this.begin(actor, { gridX: x, gridY: y, surfaceId }, e.selectedAction);
  }
  begin(actor, target, slot) {
    const e = this.engine, profile = e.getAttackProfile(actor, slot);
    const fail = reason => ({ handled: false, reason });
    if (getPossessedSligActionWave16(actor) && !['simple', 'enemy'].includes(slot)) return fail('possessed-body-only-real-rifle');
    if (target?.currentHp !== undefined && !this.actors.includes(target)) return fail('removed-target');
    if (e.paused || e.disposed || e.gameOver || this.action || actor !== e.activeUnit
      || !living(actor) || e.isTacticsControlled(actor) || actor.terrainMotion) return fail('inactive');
    if (slot === 'secondary' && actor.cooldown > 0) return fail('cooldown');
    if (slot === 'special' && !(actor.specialCharge >= 100)) return fail('charge');
    if (!canBeginSourceProtectionWave16(actor, profile)) return fail('protection-already-active');
    const targets = this.resolution(actor, target, slot).candidates;
    if (!targets.length) return fail('no-valid-target');
    const sequence = getSourceHitSequenceWave16(profile), duration = sequence?.duration || Math.max(.15, profile.duration || profile.sourceAbility?.animationDuration || .55);
    this.action = { actor, actorType: this.side(actor), slot, profile, sourceProfile: resolveCombatAbility(actor, slot === 'enemy' ? 'simple' : slot) || profile, target, targets,
      sequenceTargetIds: targets.map(t => sourceRuntimeIdWave16(t.unit)), elapsed: 0, duration,
      hitAt: profile.hitAt ?? duration * .45, damageVersion: actor.sourceDamageVersionWave16 || 0,
      hpAtStart: actor.currentHp, released: false, sequenceCursor: 0 };
    actor.sourceTacticsActionWave16 = this.action;
    if (getPossessedSligActionWave16(actor)) actor.rpgPossessedRifleActionWave16 = { elapsed: 0, duration, hitAt: this.action.hitAt };
    if (slot === 'special') actor.specialCharge = 0;
    else actor.specialCharge = Math.min(100, (actor.specialCharge || 0) + (slot === 'defense' ? 10 : slot === 'secondary' ? 25 : 15));
    if (slot === 'secondary') actor.cooldown = (profile.sourceAbility?.cd || actor.secondary?.cd || 3) * 60;
    faceGridUnitToward(actor, target);
    actor.state = slot === 'special' ? 'special' : profile.effect === 'damage' ? 'attack' : slot === 'defense' ? 'defense' : 'idle';
    actor.stateTimer = Math.ceil(duration * 60); actor.tacticsPresentationTicks = actor.stateTimer;
    e.actionPhase = 'source-action'; e.movementRange = []; e.attackRange = [];
    e.playSfx(profile.effect === 'damage' ? slot === 'special' ? 'special' : 'shoot' : 'shield');
    this.record('begin:' + slot, actor);
    return { handled: true, type: 'action', action: slot, targets, target: targets[0] };
  }
  accepted(action) {
    return action.targets.filter(({ unit }) => this.actors.includes(unit)
      && (action.profile.effect === 'revive' ? !living(unit) : living(unit))
      && this.resolution(action.actor, unit, action.slot).candidates.some(t => t.unit === unit));
  }
  impact(action, portion = null) {
    const e = this.engine, { actor, profile, slot } = action, targets = this.accepted(action);
    for (const { unit } of targets) {
      if (profile.effect === 'control') {
        if (!beginSourceControlWave16(actor, unit, profile, { hostile: this.side(actor) !== this.side(unit), channelCompleted: true })) continue;
        unit.tacticsSourceControlTurnsWave16 = 1;
        unit.sourceControlWave16 = Object.freeze({ ...unit.sourceControlWave16, originalSide: this.storedSide(unit), inputProxy: unit.sourceControlWave16.inputProxy ? Object.freeze({ ...unit.sourceControlWave16.inputProxy, originalSide: this.storedSide(unit) }) : null });
        if (unit.terrainMotion) {
          const support = e.verticalTerrain?.surface(unit.terrainRenderPosition?.surfaceId || unit.surfaceId);
          if (support) Object.assign(unit, { gridX: support.x, gridY: support.y, gridZ: support.z, surfaceId: support.id });
          delete unit.terrainMotion; delete unit.terrainRenderPosition; e.syncActorsToCamera();
        }
        if (profile.controlKind === 'possession') actor.sourcePossessionBodyWave16 = unit;
        this.record('control:' + profile.controlKind, unit); continue;
      }
      if (hasSourceProtectionProfileWave16(profile)) {
        const armed = armSourceProtectionWave16(actor, profile, unit); this.record('protection', unit, armed); continue;
      }
      if (profile.effect === 'damage') {
        const sourceRifle = !!getPossessedSligActionWave16(actor);
        if (sourceRifle) { actor.rpgPossessedRifleActionWave16 = { elapsed: action.elapsed, duration: action.duration, hitAt: action.hitAt }; const muzzle = projectSourceSligMuzzleWave16(actor, (this.storedSide(actor) === 'enemy' ? 68 : 72) * e.getUnitRenderScale(actor.gridY), 2); if (muzzle) e.particles.add(muzzle.x, muzzle.y, actor.facing * 3, 0, '#fff3ac', 3, 8, 'spark'); }
        const damage = e.getActionBaseDamage(actor, slot);
        const hpBefore = unit.currentHp;
        e.applyDamage(actor, unit, damage, profile.statusEffect || null, { actionType: slot, committedSourceSideWave16: action.actorType, sourceSequenceWave16: portion ? { action, fraction: portion.fraction } : null });
        if (unit.currentHp < hpBefore) action.visualConfirmedContact = { confirmed: true, x: unit.x, y: unit.y, targetRuntimeId: sourceRuntimeIdWave16(unit) };
        this.record(portion ? 'hit:' + portion.index : 'hit', unit); continue;
      }
      const ticks = Math.max(1, Math.round((profile.effectDuration || profile.sourceAbility?.targeting?.duration || 2) * 60));
      if (profile.effect === 'heal') unit.currentHp = Math.min(unit.maxHp * (unit.statusEffects?.radiated > 0 ? .5 : 1), unit.currentHp + Math.round(unit.maxHp * (profile.healRatio || .15)));
      if (profile.effect === 'revive') { unit.currentHp = Math.max(1, Math.round(unit.maxHp * (profile.reviveRatio || .3))); unit.state = 'idle'; }
      if (profile.effect === 'guard') { unit.tacticsGuardTicks = ticks; unit.tacticsGuardReduce = profile.guardReduce ?? .3; }
      if (profile.effect === 'buff') { unit.tacticsBuffTicks = ticks; unit.tacticsBuffMultiplier = profile.buffMultiplier || 1.12; }
      if (profile.effect === 'cleanse' || profile.cleanses) for (const key of Object.keys(unit.statusEffects || {})) unit.statusEffects[key] = 0;
      this.record('support:' + profile.effect, unit);
    }
  }
  finish(cancelled = false) {
    const a = this.action; if (!a) return;
    this.record(cancelled ? 'interrupted' : 'recovery-complete', a.actor, !cancelled);
    delete a.actor.sourceTacticsActionWave16; delete a.actor.rpgPossessedRifleActionWave16;
    this.action = null;
    const body = !cancelled && getPossessedBodyWave16(a.actor, this.actors);
    if (body) {
      this.proxy = { owner: a.actor, body, side: a.actorType };
      this.engine.turnQueue = this.engine.turnQueue.filter(entry => entry.unit !== body);
      this.engine.activeUnit = body; this.engine.activeUnitType = a.actorType;
      this.engine.actionPhase = 'move'; this.engine.selectedAction = null;
      this.engine.calculateMovementRange(); this.record('proxy-ready', body); return;
    }
    const postStun = a.profile.postSequenceStunDuration || a.profile.sourceAbility?.postSequenceStunDuration || 0;
    if (!cancelled && postStun > 0) a.actor.tacticsSourceStunTicksWave16 = Math.ceil(postStun * 60);
    this.engine.endActiveTurn();
  }
  endTurn() {
    if (this.action || this.engine.paused && this.owns(this.engine.activeUnit)) return false;
    if (this.proxy) {
      releaseSourcePossessionWave16(this.proxy.owner, this.actors);
      const proxy = this.proxy; this.record('proxy-turn-ended', proxy.body); this.proxy = null;
      if (this.engine.activeUnit === proxy.body) { this.engine.activeUnit = proxy.owner; this.engine.activeUnitType = proxy.side; }
    }
    return true;
  }
  beforeTurn() {
    for (const unit of this.actors) if (unit.tacticsSourceControlReleasePendingWave16) {
      unit.sourceControlWave16 = advanceSourceControlWave16(unit.sourceControlWave16, 0, { released: true });
      delete unit.tacticsSourceControlReleasePendingWave16; if (unit.state === 'hit' && !(unit.stateTimer > 0)) unit.state = 'idle';
    }
    this.checkStatuses(0);
  }
  releaseAll(reason = 'battle-end') {
    clearSourceCombatStatusesWave16(this.actors, reason);
    for (const source of this.actors) releaseSourcePossessionWave16(source, this.actors);
    if (this.action) { delete this.action.actor.sourceTacticsActionWave16; delete this.action.actor.rpgPossessedRifleActionWave16; this.action = null; }
    this.proxy = null; this.stunnedTurn = null;
  }
  skipControlledTurn(unit) {
    if (!isSourceImmobilizedWave16(unit) && unit?.tacticsSourceStunTicksWave16 > 0) {
      this.stunnedTurn = unit; this.engine.actionPhase = 'source-stun'; this.engine.movementRange = []; this.engine.attackRange = []; return true;
    }
    if (!isSourceImmobilizedWave16(unit)) return false;
    unit.tacticsSourceControlReleasePendingWave16 = true;
    unit.tacticsSourceControlTurnsWave16 = 0;
    this.record('controlled-target-turn-consumed', unit); this.engine.endActiveTurn(); return true;
  }
  checkStatuses(dt) {
    // Tactics control duration is one actual target/proxy turn. Protection
    // windows still use simulation seconds and pause with the engine.
    advanceSourceCombatStatusesWave16(this.actors, 0, { paused: false, visualSeconds: dt });
    for (const unit of this.actors) {
      if (unit.sourceProtectionWave16) unit.sourceProtectionWave16 = advanceWave16Protection(unit.sourceProtectionWave16, dt, { ownerAlive: living(unit) });
      if (unit.tacticsSourceStunTicksWave16 > 0 && dt > 0) unit.tacticsSourceStunTicksWave16--;
      for (const key of ['tacticsGuardTicks', 'tacticsBuffTicks']) if (unit[key] > 0 && dt > 0 && !this.engine.verticalTerrain) unit[key]--;
    }
    if (this.proxy && !getPossessedBodyWave16(this.proxy.owner, this.actors)) {
      const proxy = this.proxy; this.proxy = null;
      if (this.engine.activeUnit === proxy.body) { this.engine.activeUnit = proxy.owner; this.engine.activeUnitType = proxy.side; }
      if (this.action?.actor === proxy.body) { delete proxy.body.sourceTacticsActionWave16; this.action = null; }
      this.record('proxy-released', proxy.body); this.engine.endActiveTurn();
    }
  }
  tick() {
    const e = this.engine; if (e.paused || e.disposed || e.gameOver) return;
    e.sourceSimulationTickWave16 = (e.sourceSimulationTickWave16 || 0) + 1;
    this.checkStatuses(1 / 60);
    const a = this.action;
    if (a) {
      if (!living(a.actor) || !this.actors.includes(a.actor) || a.actor.currentHp < a.hpAtStart
        || e.isTacticsControlled(a.actor) || (a.actor.sourceDamageVersionWave16 || 0) !== a.damageVersion) { a.sequenceCancelled = true; this.finish(true); }
      else {
        a.elapsed += 1 / 60;
        if (a.actor.rpgPossessedRifleActionWave16) a.actor.rpgPossessedRifleActionWave16.elapsed = a.elapsed;
        const sequence = getSourceHitSequenceWave16(a.profile);
        if (sequence) for (const portion of takeDueSourceHitsWave16(a, a.profile, a.elapsed)) this.impact(a, portion);
        else if (!a.released && a.elapsed + 1e-9 >= a.hitAt) { a.released = true; this.impact(a); }
        if (a.elapsed + 1e-9 >= a.duration) this.finish(false);
      }
    }
    if (this.stunnedTurn && !(this.stunnedTurn.tacticsSourceStunTicksWave16 > 0)) {
      const unit = this.stunnedTurn; this.stunnedTurn = null;
      if (e.activeUnit === unit && living(unit)) { e.actionPhase = 'move'; e.movementBudget = unit.statusEffects?.glitched > 0 ? 1 : 2; e.movementSpent = 0; e.calculateMovementRange(); if (e.activeUnitType === 'hero' ? e.autoBattle : e.opponentControl !== 'p2') this.ai(); }
    }
    this.tickCounters();
  }
  intercept(target, attacker, damage, options = {}) {
    return interceptSourceProtectionHitWave16(target, attacker, damage, {
      hostile: this.side(target) !== (options.committedSourceSideWave16 || this.side(attacker)), accepted: true,
      delivery: options.sourceDeliveryWave16 || ({ ranged: 'projectile', radial: 'area' })[this.engine.getAttackProfile(attacker, options.actionType || 'simple').delivery] || this.engine.getAttackProfile(attacker, options.actionType || 'simple').delivery,
      attackKind: this.engine.getActionDefinition(attacker, options.actionType || 'simple')?.type,
      isThrow: options.isThrow, isGrab: options.isGrab, unblockable: options.unblockable,
      onCounter: counter => { target.tacticsSourceCounterWave16 = { ...counter, elapsed: 0, movedPixels: 0, started: false }; target.state = 'special'; target.stateTimer = 30; faceGridUnitToward(target, attacker); this.record('counter-captured', attacker); }
    });
  }
  tickCounters() {
    const e = this.engine;
    for (const unit of this.actors) {
      const counter = unit.tacticsSourceCounterWave16; if (!counter) continue;
      const target = this.actors.find(actor => sourceRuntimeIdWave16(actor) === counter.targetRuntimeId);
      if (!living(unit) || !living(target) || this.side(unit) === this.side(target) || e.isTacticsControlled(unit)) { delete unit.tacticsSourceCounterWave16; continue; }
      counter.elapsed += 1 / 60;
      if (unit.terrainMotion) continue;
      const profile = { delivery: 'melee', shape: 'single', range: 1.9, minRange: 0, maxVerticalRange: .75, requiresLineOfSight: true };
      const distance = e.getAttackDistance(unit, target, profile);
      if (!counter.started) {
        counter.started = true;
        if (distance > 1.9) {
          const walkCells = e.verticalTerrain ? getTerrainNeighbors(e.terrain, unit, e.verticalTerrain.pathOptions(unit)).filter(c => c.kind === 'walk') : e.getReachableCells(unit, 1);
          const next = walkCells.filter(c => c.cost > 0 && c.cost <= 1 && Math.abs(c.x - unit.gridX) + Math.abs(c.y - unit.gridY) === 1 && Math.abs((c.z ?? unit.gridZ ?? 0) - (unit.gridZ || 0)) <= .1)
            .sort((a, b) => Math.hypot(a.x - target.gridX, a.y - target.gridY) - Math.hypot(b.x - target.gridX, b.y - target.gridY))[0];
          if (next) {
            const projected = e.getUnitScreenPosition(next.x, next.y, next.surfaceId);
            counter.movedPixels = Math.hypot(projected.x - unit.x, projected.y - unit.y) / Math.max(.01, e.cameraZoom || 1);
            if (counter.movedPixels > 140) { this.record('counter-dash-cap', unit, false); delete unit.tacticsSourceCounterWave16; continue; }
            if (e.verticalTerrain) { e.verticalTerrain.move(unit, next.surfaceId, () => {}); continue; }
            counter.flatMotion = { fromX: unit.x, fromY: unit.y, destination: next, elapsed: 0 };
          }
        }
      }
      if (counter.flatMotion) {
        const motion = counter.flatMotion; motion.elapsed += 1 / 60;
        const destination = e.getUnitScreenPosition(motion.destination.x, motion.destination.y), progress = Math.min(1, motion.elapsed / .2);
        unit.x = motion.fromX + (destination.x - motion.fromX) * progress; unit.y = motion.fromY + (destination.y - motion.fromY) * progress;
        if (progress < 1) continue;
        unit.gridX = motion.destination.x; unit.gridY = motion.destination.y; delete counter.flatMotion;
      }
      if (counter.elapsed < .2) continue;
      const accepted = e.getAttackDistance(unit, target, profile) <= 1.9 && e.hasLineOfSight(unit, target, profile);
      if (accepted) e.applyDamage(unit, target, (unit.stats?.atk || unit.atk || 0) * counter.multiplier, null, { actionType: 'simple', sourceCounterReplay: true });
      this.record('counter-physical-contact', target, accepted); delete unit.tacticsSourceCounterWave16;
    }
  }
  ai() {
    const e = this.engine, actor = e.activeUnit; if (!this.owns(actor)) return false;
    if (e.paused || e.disposed || e.gameOver || !living(actor)) return true;
    if (this.action || e.isTacticsControlled(actor)) return true;
    const slot = actor.specialCharge >= 100 ? 'special' : actor.cooldown <= 0 ? 'secondary' : 'simple';
    const p = e.getAttackProfile(actor, slot), side = this.side(actor);
    const targets = this.actors.filter(unit => p.targetSide === 'self' ? unit === actor : p.targetSide === 'enemy' ? this.side(unit) !== side : this.side(unit) === side);
    const cast = () => {
      if (e.activeUnit !== actor || !living(actor) || e.isTacticsControlled(actor)) return;
      e.actionPhase = 'action'; e.selectedAction = slot;
      const target = targets.find(unit => this.resolution(actor, unit, slot).candidates.length);
      if (target && this.begin(actor, target, slot).handled) return;
      e.endActiveTurn();
    };
    const target = targets.find(unit => this.resolution(actor, unit, slot).candidates.length);
    if (target) { cast(); return true; }
    const goal = targets.find(unit => unit !== actor && living(unit));
    const best = goal && e.getReachableCells(actor, Math.max(0, e.movementBudget - e.movementSpent))
      .sort((a, b) => Math.hypot(a.x - goal.gridX, a.y - goal.gridY) - Math.hypot(b.x - goal.gridX, b.y - goal.gridY))[0];
    if (best && e.verticalTerrain) { e.movementSpent += best.cost; e.actionPhase = 'moving'; e.verticalTerrain.move(actor, best.surfaceId, cast); }
    else { if (best) { actor.gridX = best.x; actor.gridY = best.y; e.movementSpent += best.cost || 0; e.syncActorsToCamera(); } cast(); }
    return true;
  }
  drawActor(unit) {
    const action = unit.sourceTacticsActionWave16;
    if (!action || action.slot !== 'special') return unit;
    return { ...unit, action: { identity: action.sourceProfile, duration: action.duration, elapsed: action.elapsed, hitAt: action.hitAt, facing: unit.facing }, presentationPhase: 'super', presentationProgress: Math.max(0, Math.min(1, action.elapsed / action.duration)), presentationImpactProgress: action.hitAt / action.duration };
  }
}
