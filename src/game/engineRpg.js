// Final Fantasy Record Keeper ATB RPG Engine with Synergies & Status Effects
import { drawPixelSprite, drawPixelEnemy, drawBoss } from './renderer';
import { absorbBattleItemDamage } from './battleItemShield';
import { SYNERGIES_DB } from './heroes';
import { resolveArchetypeCombatStats } from './combatStatPreparation';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import { calculateRpgDamage, getRpgActionProfile, getRpgEligibleTargets, resolveRpgTargets, rpgUnitId } from './rpgTargeting';

const RPG_FLOOR_LANES = Object.freeze({
  heroes: Object.freeze([
    Object.freeze({ x: 0.14, y: 0.66 }),
    Object.freeze({ x: 0.20, y: 0.78 }),
    Object.freeze({ x: 0.26, y: 0.89 })
  ]),
  enemies: Object.freeze([
    Object.freeze({ x: 0.74, y: 0.66 }),
    Object.freeze({ x: 0.80, y: 0.78 }),
    Object.freeze({ x: 0.86, y: 0.89 })
  ]),
  bosses: Object.freeze([
    Object.freeze({ x: 0.75, y: 0.72 }),
    Object.freeze({ x: 0.84, y: 0.86 })
  ]),
  worldBoss: Object.freeze({ x: 0.80, y: 0.78 })
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class EngineRpg {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete, stage = {}) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    this.stage = stage;
    this.levelProfile = getRecentUniverseLevelProfile(stage.universe);
    this.opponentControl = stage.customBattle?.opponentControl === 'p2' ? 'p2' : 'cpu';
    this.singleRoster = stage.customBattle?.singleRoster === true
      && Array.isArray(enemiesData.customRoster);
    this.exclusiveEnemyRoster = stage.enemyRosterExclusive === true && !this.singleRoster;
    this.disposed = false;
    this.paused = false;
    this.timers = new Set();
    this.targeting = null;
    this.targetingWait = true;
    this.actionQueue = [];

    const heroPosition = (idx) => {
      const lane = this.levelProfile?.rpg?.heroLanes?.[idx];
      return this.resolveFloorPosition(lane, RPG_FLOOR_LANES.heroes[idx] || RPG_FLOOR_LANES.heroes.at(-1));
    };

    this.heroes = heroes.map((h, idx) => {
      const position = heroPosition(idx);
      return {
        ...h,
        battleId: `hero:${idx}:${h.id}`,
        runtimeId: `hero:${idx}:${h.id}`,
        stats: { ...h.stats },
        x: position.x,
        y: position.y,
        homeX: position.x,
        homeY: position.y,
        state: 'idle',
        stateTimer: 0,
        atb: Math.random() * 20,
        cooldown: 0,
        specialCharge: 0,
        maxHp: h.stats.hp,
        currentHp: h.stats.hp,
        facing: 1,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      };
    });
    this.heroes.forEach(hero => this.fitCombatantToArena(hero));

    // Calculate Synergy Sets
    const categoriesCount = this.heroes.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {});
    
    this.activeSynergies = SYNERGIES_DB.filter(syn => (categoriesCount[syn.category] || 0) >= 2);
    this.heroes.forEach(hero => {
      hero.stats = resolveArchetypeCombatStats(hero, this.activeSynergies);
      hero.maxHp = hero.stats.hp;
      hero.currentHp = hero.maxHp;
      hero.archetypeSynergiesPrepared = true;
    });

    this.enemiesData = enemiesData;
    this.finalePolicy = enemiesData.finalePolicy || null;
    this.enemies = [];
    this.wave = 1;
    this.maxWaves = this.singleRoster ? 1 : enemiesData.worldBoss ? 3 : 2;
    this.isBossStage = this.singleRoster
      ? enemiesData.customRoster.some(enemy => enemy.isBoss || enemy.isWorldBoss)
      : (enemiesData.bosses?.length || 0) > 0 || !!enemiesData.worldBoss;
    this.isFinalBoss = false;
    this.finalBossChaosTimer = 0;
    
    this.spawnWave();

    this.selectedHeroId = this.heroes[0].id;
    this.selectedEnemyId = this.enemies[0]?.battleId || this.enemies[0]?.id || null;
    this.gameOver = false;
    this.victoryTimer = 0;
    this.completionReported = false;
    this.autoBattle = false;
    this.enemyActionLock = false;
    this.enemyGlobalRecovery = 70;
  }

  getFloorHorizon() {
    return clamp(this.levelProfile?.rpg?.horizon ?? 0.52, 0.42, 0.68);
  }

  resolveFloorPosition(lane, fallback, authoredAnchor = null) {
    const authoredX = Number.isFinite(authoredAnchor?.x) ? authoredAnchor.x : null;
    const authoredY = Number.isFinite(authoredAnchor?.y) ? authoredAnchor.y : null;
    const baseline = lane || fallback;
    const normalizedX = clamp(authoredX ?? baseline.x, 0.05, 0.95);
    // Authored boss anchors describe composition, but a combatant's feet must
    // never sit above the perspective floor used by the active RPG lane.
    const normalizedY = clamp(
      Math.max(authoredY ?? baseline.y, baseline.y, this.getFloorHorizon() + 0.08),
      0.54,
      0.94
    );
    return {
      x: Math.round(this.width * normalizedX),
      y: Math.round(this.height * normalizedY)
    };
  }

  getDepthScale(y) {
    const floorSpan = Math.max(1, this.height * (0.96 - this.getFloorHorizon()));
    const depth = clamp((y - this.height * this.getFloorHorizon()) / floorSpan, 0, 1);
    return 0.84 + depth * 0.22;
  }

  getCombatantBounds(unit) {
    const scale = this.getDepthScale(unit.y);
    const height = unit.isBoss
      ? Math.min(Math.max(96, unit.authoredRenderHeight || unit.renderHeight || 126), this.height * 0.48, this.width * 0.32)
      : (this.heroes?.includes(unit) ? 72 : 68) * scale;
    // Reserve the square sprite-frame envelope and the HP/ATB below the feet.
    return { halfWidth: height * 0.65, top: height + 8, bottom: (unit.isBoss ? 48 : 30) * scale, height };
  }

  fitCombatantToArena(unit, { home = true } = {}) {
    if (unit.isBoss) unit.authoredRenderHeight ??= unit.renderHeight || 126;
    const bounds = this.getCombatantBounds(unit);
    unit.x = clamp(unit.x, bounds.halfWidth + 8, this.width - bounds.halfWidth - 8);
    unit.y = clamp(unit.y, Math.max(bounds.top, this.height * (this.getFloorHorizon() + 0.08)), this.height - bounds.bottom - 8);
    if (unit.isBoss) unit.renderHeight = bounds.height;
    if (home) {
      unit.homeX = unit.x;
      unit.homeY = unit.y;
    }
  }

  faceTarget(actor, target) {
    if (actor && target && Math.abs(target.x - actor.x) > 0.5) actor.facing = target.x > actor.x ? 1 : -1;
  }

  getFacingTarget(actor) {
    const opponents = this.heroes.includes(actor) ? this.enemies : this.heroes;
    return opponents.find(unit => unit.currentHp > 0 && rpgUnitId(unit) === actor.focusTargetId)
      || opponents.filter(unit => unit.currentHp > 0).sort((a, b) => Math.abs(a.x - actor.x) - Math.abs(b.x - actor.x))[0];
  }

  returnToFormation(actor, preferredTarget = null) {
    actor.x = actor.homeX;
    actor.y = actor.homeY;
    const opponents = this.heroes.includes(actor) ? this.enemies : this.heroes;
    const target = preferredTarget?.currentHp > 0 ? preferredTarget
      : opponents.filter(unit => unit.currentHp > 0).sort((a, b) => Math.abs(a.x - actor.x) - Math.abs(b.x - actor.x))[0];
    this.faceTarget(actor, target);
  }

  positionForMelee(actor, target) {
    const actorBounds = this.getCombatantBounds(actor);
    const targetBounds = this.getCombatantBounds(target);
    const gap = actorBounds.halfWidth + targetBounds.halfWidth + 8;
    const approaches = [target.x - gap, target.x + gap]
      .filter(x => x >= actorBounds.halfWidth + 8 && x <= this.width - actorBounds.halfWidth - 8)
      .sort((a, b) => Math.abs(a - actor.x) - Math.abs(b - actor.x));
    actor.x = approaches[0] ?? actor.x;
    actor.y = target.y;
    this.fitCombatantToArena(actor, { home: false });
    // Resolve after placement so a changed approach side still faces the victim.
    this.faceTarget(actor, target);
  }

  schedule(callback, delay) {
    if (this.disposed) return null;
    const runWhenResumed = () => {
      if (this.disposed) return;
      if (this.paused || this.isTargetingPaused?.()) {
        const retryTimer = setTimeout(() => {
          this.timers.delete(retryTimer);
          runWhenResumed();
        }, 50);
        this.timers.add(retryTimer);
        return;
      }
      callback();
    };
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      runWhenResumed();
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  setPaused(paused) {
    this.paused = Boolean(paused);
  }

  scheduleAction(callback, delay) {
    this.actionQueue.push({ callback, ticks: Math.max(1, Math.ceil(delay * 60 / 1000)) });
  }

  advanceActions() {
    const due = [];
    this.actionQueue = this.actionQueue.filter(action => {
      action.ticks--;
      if (action.ticks > 0) return true;
      due.push(action);
      return false;
    });
    due.forEach(action => action.callback());
  }

  dispose() {
    this.disposed = true;
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.enemyActionLock = false;
    this.targeting = null;
    this.actionQueue = [];
  }

  spawnWave() {
    this.enemies = [];
    const w = this.wave;

    if (this.singleRoster) {
      this.enemies = this.enemiesData.customRoster.slice(0, 3).map((template, index) => {
        const isWorldBoss = template.isWorldBoss === true;
        const isBoss = template.isBoss === true || isWorldBoss;
        const lane = isWorldBoss
          ? this.levelProfile?.rpg?.worldBoss
          : isBoss
            ? this.levelProfile?.rpg?.bossLanes?.[index]
            : this.levelProfile?.rpg?.enemyLanes?.[index];
        const anchor = template.anchor;
        const position = this.resolveFloorPosition(
          lane,
          isWorldBoss
            ? RPG_FLOOR_LANES.worldBoss
            : isBoss
              ? RPG_FLOOR_LANES.bosses[index] || RPG_FLOOR_LANES.bosses.at(-1)
              : RPG_FLOOR_LANES.enemies[index] || RPG_FLOOR_LANES.enemies.at(-1),
          anchor
        );
        const homeX = position.x;
        const homeY = position.y;
        const runtimeId = `enemy:custom:${index}:${template.id || template.name}`;
        return {
          ...template,
          battleId: runtimeId,
          runtimeId,
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          state: 'idle',
          stateTimer: 0,
          atb: Math.random() * (isBoss ? 15 : 30),
          cooldown: 0,
          specialCharge: 0,
          defense: template.defense || { reduce: 0.42, dur: 1.2 },
          maxHp: template.hp || template.stats?.hp || (isBoss ? 450 : 90),
          currentHp: template.hp || template.stats?.hp || (isBoss ? 450 : 90),
          facing: -1,
          isBoss,
          isWorldBoss,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        };
      });
      if (this.enemies.some(enemy => enemy.isBoss)) this.playSfx('portal');
    } else if (w === 1) {
      // Spawn 3 standard monsters aligned diagonally
      const templates = this.enemiesData.monsters;
      for (let i = 0; i < 3; i++) {
        const t = templates[i] || templates[0];
        const lane = this.levelProfile?.rpg?.enemyLanes?.[i];
        const position = this.resolveFloorPosition(lane, RPG_FLOOR_LANES.enemies[i] || RPG_FLOOR_LANES.enemies.at(-1));
        const homeX = position.x;
        const homeY = position.y;
        this.enemies.push({
          ...t,
          battleId: `enemy:${w}:${i}:${t.id || t.name}`,
          runtimeId: `enemy:${w}:${i}:${t.id || t.name}`,
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          state: 'idle',
          stateTimer: 0,
          atb: Math.random() * 30,
          cooldown: 0,
          specialCharge: 0,
          defense: t.defense || { reduce: 0.42, dur: 1.2 },
          maxHp: t.hp || 90,
          currentHp: t.hp || 90,
          facing: -1,
          isBoss: false,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        });
      }
    } else if (w === 2) {
      // Exclusive campaign rosters contain one canonical boss; regular stages
      // retain the classic two-boss formation.
      const templates = this.enemiesData.bosses;
      const bossCount = this.exclusiveEnemyRoster ? templates.length : 2;
      for (let i = 0; i < bossCount; i++) {
        const t = templates[i] || templates[0];
        const lane = this.levelProfile?.rpg?.bossLanes?.[i];
        const position = this.resolveFloorPosition(
          lane,
          RPG_FLOOR_LANES.bosses[i] || RPG_FLOOR_LANES.bosses.at(-1),
          t.anchor
        );
        const homeX = position.x;
        const homeY = position.y;
        this.enemies.push({
          ...t,
          battleId: `enemy:${w}:${i}:${t.id || t.name}`,
          runtimeId: `enemy:${w}:${i}:${t.id || t.name}`,
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          state: 'idle',
          stateTimer: 0,
          atb: Math.random() * 15,
          cooldown: 0,
          specialCharge: 0,
          defense: t.defense || { reduce: 0.42, dur: 1.2 },
          maxHp: t.hp || 450,
          currentHp: t.hp || 450,
          facing: -1,
          isBoss: true,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        });
      }
      if (bossCount > 0) this.playSfx('portal');
    } else if (w === 3) {
      // Spawn 1 Giant World Boss
      const t = this.enemiesData.worldBoss;
      if (!t) return;
      const lane = this.levelProfile?.rpg?.worldBoss;
      const position = this.resolveFloorPosition(lane, RPG_FLOOR_LANES.worldBoss, t.anchor);
      const homeX = position.x;
      const homeY = position.y;
      this.enemies.push({
        ...t,
        battleId: `enemy:${w}:0:${t.id || t.name}`,
        runtimeId: `enemy:${w}:0:${t.id || t.name}`,
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        state: 'idle',
        stateTimer: 0,
        atb: 0,
        cooldown: 0,
        specialCharge: 0,
        defense: t.defense || { reduce: 0.42, dur: 1.2 },
        maxHp: t.hp || 1200,
        currentHp: t.hp || 1200,
        facing: -1,
        isBoss: true,
        isWorldBoss: true,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      });
      this.playSfx('portal');
    }
    this.enemies.forEach(enemy => {
      if (enemy.stats) enemy.stats = { ...enemy.stats };
      this.fitCombatantToArena(enemy);
    });
    const selected = this.enemies.find(enemy => (
      enemy.currentHp > 0
      && (
        enemy.runtimeId === this.selectedEnemyId
        || enemy.battleId === this.selectedEnemyId
        || enemy.id === this.selectedEnemyId
        || enemy.name === this.selectedEnemyId
      )
    )) || this.enemies.find(enemy => enemy.currentHp > 0);
    this.selectedEnemyId = selected?.battleId || selected?.id || null;
  }

  getSelectedHero() {
    return this.heroes.find(h => h.id === this.selectedHeroId) || this.heroes[0];
  }

  selectHero(id) {
    const hero = this.heroes.find(h => h.id === id);
    if (hero && hero.currentHp > 0) {
      this.selectedHeroId = id;
    }
  }

  getSelectedEnemy() {
    return this.enemies.find(enemy => (
      enemy.currentHp > 0
      && (enemy.battleId === this.selectedEnemyId || enemy.id === this.selectedEnemyId)
    )) || this.enemies.find(enemy => enemy.currentHp > 0) || null;
  }

  selectEnemy(id) {
    const enemy = this.enemies.find(candidate => (
      candidate.currentHp > 0
      && (
        candidate.runtimeId === id
        || candidate.battleId === id
        || candidate.id === id
        || candidate.name === id
      )
    ));
    if (!enemy) return false;
    this.selectedEnemyId = enemy.battleId || enemy.id;
    return true;
  }

  resolveActor(actorOrId, side = 'player') {
    const team = side === 'enemy' ? this.enemies : this.heroes;
    if (actorOrId && typeof actorOrId === 'object') return team.includes(actorOrId) ? actorOrId : null;
    return team.find(unit => [rpgUnitId(unit), unit.id, unit.name].includes(actorOrId)) || null;
  }

  getActionContext(actor, abilityType, side = 'player') {
    const allies = side === 'enemy' ? this.enemies : this.heroes;
    const opponents = side === 'enemy' ? this.heroes : this.enemies;
    const profile = getRpgActionProfile(actor, abilityType, side, this);
    const eligibleTargets = getRpgEligibleTargets({ actor, profile, allies, opponents });
    return { actor, abilityType, side, profile, eligibleTargets };
  }

  canUseAction(actor, abilityType, side = 'player') {
    if (!this.resolveActor(actor, side) || this.disposed || this.paused || this.gameOver || actor.currentHp <= 0
      || actor.state !== 'idle' || actor.actionPending || actor.atb < 100) return false;
    if (side === 'enemy' && this.enemyActionLock) return false;
    if (abilityType === 'secondary' && actor.cooldown > 0) return false;
    if (abilityType === 'special' && actor.specialCharge < 100) return false;
    return !!getRpgActionProfile(actor, abilityType, side, this);
  }

  chooseDefaultTargets(context) {
    const { profile, eligibleTargets } = context;
    if (!profile || !eligibleTargets.length || profile.shape === 'group') return [];
    const sorted = [...eligibleTargets];
    if (profile.effect === 'heal') sorted.sort((a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp);
    return sorted.slice(0, profile.shape === 'multi' ? profile.maxTargets : 1).map(rpgUnitId);
  }

  // Manual selection never spends ATB, cooldown or charge. Both simulation and
  // delayed impacts wait until confirmation/cancel, including P2 targeting.
  beginTargeting(actorOrId, abilityType, side = 'player') {
    if (this.targeting) return false;
    if (side !== 'player' && side !== 'enemy') return false;
    if (side === 'enemy' && this.opponentControl !== 'p2') return false;
    const actor = this.resolveActor(actorOrId, side);
    if (!this.canUseAction(actor, abilityType, side)) return false;
    const context = this.getActionContext(actor, abilityType, side);
    if (!context.eligibleTargets.length) return false;
    if (abilityType === 'defense') return this.executeRpgAction(context, [rpgUnitId(actor)]);
    this.targeting = {
      actor, abilityType, side,
      selectedTargetIds: this.chooseDefaultTargets(context)
    };
    return true;
  }

  previewTargets(targetIds = this.targeting?.selectedTargetIds) {
    if (!this.targeting) return null;
    const { actor, abilityType, side } = this.targeting;
    const context = this.getActionContext(actor, abilityType, side);
    const selectedTargetIds = Array.isArray(targetIds) ? [...targetIds] : [];
    const resolved = resolveRpgTargets({ ...context, selectedTargetIds });
    const profile = context.profile;
    const amount = (actor.stats?.atk ?? actor.atk ?? 8) * profile.multiplier;
    const estimates = resolved.targets.map(unit => {
      let value = amount;
      if (profile.effect === 'damage') value = calculateRpgDamage(unit, amount * (actor.rpgBuffTicks > 0 ? actor.rpgBuffMultiplier : 1), 1, true, actor);
      else if (profile.effect === 'heal') {
        const cap = unit.statusEffects?.radiated > 0 ? unit.maxHp * 0.5 : unit.maxHp;
        value = Math.max(0, Math.min(cap - unit.currentHp, profile.healRatio ? unit.maxHp * profile.healRatio : amount));
      } else if (profile.effect === 'revive') value = unit.maxHp * profile.reviveRatio;
      else value = 0;
      return { id: rpgUnitId(unit), effect: profile.effect, amount: Math.round(value), min: profile.effect === 'damage' ? calculateRpgDamage(unit, amount * (actor.rpgBuffTicks > 0 ? actor.rpgBuffMultiplier : 1), 0.9, true, actor) : Math.round(value), max: profile.effect === 'damage' ? calculateRpgDamage(unit, amount * (actor.rpgBuffTicks > 0 ? actor.rpgBuffMultiplier : 1), 1.1, true, actor) : Math.round(value) };
    });
    return {
      side, actorId: rpgUnitId(actor), actorName: actor.name, abilityType,
      abilityName: profile.name, profile,
      effect: profile.effect, delivery: profile.delivery, shape: profile.shape, maxTargets: profile.maxTargets,
      eligibleTargets: context.eligibleTargets.map(unit => ({
        id: rpgUnitId(unit), name: unit.name, x: unit.x, y: unit.y,
        hp: unit.currentHp, maxHp: unit.maxHp,
        side: this.heroes.includes(unit) ? 'player' : 'enemy',
        dead: unit.currentHp <= 0
      })),
      selectedTargetIds,
      previewTargetIds: resolved.targets.map(rpgUnitId),
      estimates, estimate: estimates,
      valid: resolved.valid && this.canUseAction(actor, abilityType, side),
      reason: resolved.reason
    };
  }

  getTargetingState() {
    return this.previewTargets();
  }

  isTargetingPaused() {
    return !!this.targeting && this.targetingWait;
  }

  setTargetingWait(wait) {
    this.targetingWait = Boolean(wait);
  }

  selectTarget(id, { toggle = true } = {}) {
    if (!this.targeting) return false;
    const context = this.getActionContext(this.targeting.actor, this.targeting.abilityType, this.targeting.side);
    if (!context.eligibleTargets.some(unit => rpgUnitId(unit) === id)) return false;
    if (context.profile.shape === 'group') return true;
    if (context.profile.shape !== 'multi') this.targeting.selectedTargetIds = [id];
    else {
      const ids = this.targeting.selectedTargetIds;
      if (ids.includes(id)) {
        if (toggle) this.targeting.selectedTargetIds = ids.filter(entry => entry !== id);
      } else if (ids.length < context.profile.maxTargets) this.targeting.selectedTargetIds = [...ids, id];
      else return false;
    }
    return true;
  }

  cancelTargeting() {
    if (!this.targeting) return false;
    this.targeting = null;
    return true;
  }

  confirmTargeting() {
    if (!this.targeting) return false;
    const { actor, abilityType, side, selectedTargetIds } = this.targeting;
    const context = this.getActionContext(actor, abilityType, side);
    if (!this.canUseAction(actor, abilityType, side)) return false;
    // The resolver is exactly the one used by preview; invalidated/dead targets
    // are rejected rather than replaced with a random survivor.
    if (!resolveRpgTargets({ ...context, selectedTargetIds }).valid) return false;
    this.targeting = null;
    return this.executeRpgAction(context, selectedTargetIds);
  }

  triggerEnemyAbility(enemyOrType = 'simple', maybeType = null, selectedTargetIds = null) {
    if (this.opponentControl !== 'p2' || this.targeting) return false;
    const aliases = { attack: 'simple', basic: 'simple', simple: 'simple', strong: 'secondary', heavy: 'secondary', secondary: 'secondary', special: 'special', guard: 'defense', defense: 'defense' };
    let enemy = this.resolveActor(enemyOrType, 'enemy');
    const abilityType = aliases[maybeType || (enemy ? 'simple' : enemyOrType)] || 'simple';
    enemy ||= this.getSelectedEnemy();
    if (!this.canUseAction(enemy, abilityType, 'enemy')) return false;
    const context = this.getActionContext(enemy, abilityType, 'enemy');
    return this.executeRpgAction(context, selectedTargetIds || this.chooseDefaultTargets(context));
  }

  triggerAbility(hero, abilityType, selectedTargetIds = null) {
    if (this.targeting || !this.canUseAction(hero, abilityType, 'player')) return false;
    const context = this.getActionContext(hero, abilityType, 'player');
    return this.executeRpgAction(context, selectedTargetIds || this.chooseDefaultTargets(context));
  }

  emitTargetedProjectile(actor, target, color) {
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / distance;
    const uy = dy / distance;
    this.particles.add(actor.x + ux * 15, actor.y - 12 + uy * 15, ux * 8, uy * 8, color, 6, Math.max(12, Math.ceil(distance / 8)), 'laser_line');
  }

  applyHealing(target, amount) {
    if (target.currentHp <= 0) return 0;
    const cap = target.statusEffects?.radiated > 0 ? target.maxHp * 0.5 : target.maxHp;
    const gained = Math.max(0, Math.min(cap - target.currentHp, Math.round(amount)));
    target.currentHp += gained;
    if (gained > 0) this.particles.add(target.x, target.y - 20, 0, -1, '#2ecc71', 12, 45, 'text', '+' + gained);
    return gained;
  }

  executeRpgAction(context, selectedTargetIds) {
    const { actor, abilityType, side, profile } = context;
    if (!this.canUseAction(actor, abilityType, side)) return false;
    const resolved = resolveRpgTargets({ ...context, selectedTargetIds });
    if (!resolved.valid) return false;
    // Freeze object identities before moving the caster or scheduling impacts.
    // An impact never acquires a new target if one of these actors dies.
    const targets = [...resolved.targets];
    const anchor = resolved.anchor;
    if (profile.effect === 'damage') actor.focusTargetId = rpgUnitId(anchor);
    actor.atb = 0;
    if (side === 'enemy') this.selectedEnemyId = rpgUnitId(actor);
    if (abilityType === 'secondary') actor.cooldown = Math.round((profile.action.cd ?? 3) * 60);
    if (abilityType === 'special') actor.specialCharge = 0;
    else actor.specialCharge = Math.min(100, actor.specialCharge + (abilityType === 'secondary' ? 20 : abilityType === 'defense' ? 15 : 12));

    if (abilityType === 'defense') {
      actor.state = 'defense';
      actor.stateTimer = Math.max(1, Math.round((actor.defense?.dur || 1.2) * 60));
      if (actor.defense?.type === 'heal') this.applyHealing(actor, (actor.stats?.atk ?? actor.atk ?? 8) * 1.2);
      this.playSfx('shield');
      this.particles.add(actor.x, actor.y - 8, 0, 0, actor.secondaryColor || actor.color || '#39c5bb', 6, 24, 'spark');
      return true;
    }

    actor.actionPending = true;
    if (side === 'enemy') this.enemyActionLock = true;
    actor.state = abilityType === 'special' ? 'special' : 'attack';
    actor.stateTimer = abilityType === 'special' ? 45 : 35;
    this.faceTarget(actor, anchor);
    const color = profile.action.color || actor.secondaryColor || actor.color || '#ff9900';
    if (profile.delivery === 'melee' && profile.effect === 'damage') {
      this.positionForMelee(actor, anchor);
      this.playSfx('slash');
    } else {
      this.playSfx(profile.effect === 'damage' ? 'shoot' : 'shield');
      targets.forEach(target => this.emitTargetedProjectile(actor, target, color));
    }
    if (abilityType === 'special') {
      this.playSfx('special');
      this.particles.add(actor.x, actor.y - 40, 0, -0.4, color, 16, 90, 'text', profile.name.toUpperCase() + '!');
    }

    this.scheduleAction(() => {
      if (!this.gameOver && actor.currentHp > 0) {
        for (const target of targets) {
          const isStillPresent = this.heroes.includes(target) || this.enemies.includes(target);
          if (!isStillPresent) continue;
          const amount = (actor.stats?.atk ?? actor.atk ?? 8) * profile.multiplier;
          if (profile.effect === 'revive') {
            if (target.currentHp > 0) continue;
            target.currentHp = Math.max(1, Math.round(target.maxHp * profile.reviveRatio));
            target.state = 'idle';
            target.stateTimer = 0;
            target.atb = 0;
            target.statusEffects = { infected: 0, glitched: 0, radiated: 0 };
            this.returnToFormation(target);
            this.particles.add(target.x, target.y - 20, 0, -1, '#2ecc71', 12, 45, 'text', 'REVIVE');
          } else if (target.currentHp <= 0) continue;
          else if (profile.effect === 'heal') this.applyHealing(target, profile.healRatio ? target.maxHp * profile.healRatio : amount);
          else if (profile.effect === 'buff') {
            target.rpgBuffTicks = Math.round(profile.duration * 60);
            target.rpgBuffMultiplier = profile.buffMultiplier;
            this.particles.add(target.x, target.y - 20, 0, -1, color, 12, 45, 'text', 'ATK UP');
          } else if (profile.effect === 'guard') {
            target.rpgGuardTicks = Math.round(profile.duration * 60);
            target.rpgGuardReduce = profile.guardReduce;
            this.particles.add(target.x, target.y - 20, 0, -1, color, 12, 45, 'text', 'GUARD');
          } else if (profile.effect === 'damage') {
            let status = null;
            if (actor.id === 'leon' || actor.name?.includes('Nemesis')) status = 'infected';
            if ((actor.id === 'neo' && abilityType === 'special') || actor.name?.includes('Smith')) status = 'glitched';
            if (/Deathclaw|Cyberdemon/.test(actor.name || '')) status = 'radiated';
            this.applyDamage(actor, target, amount, status);
          }
          if (profile.cleanses && target.currentHp > 0) target.statusEffects = { infected: 0, glitched: 0, radiated: 0 };
        }
      }
      this.returnToFormation(actor, anchor);
      actor.actionPending = false;
      if (side === 'enemy') {
        this.enemyActionLock = false;
        this.enemyGlobalRecovery = actor.isBoss ? 85 : 110;
      }
      const nextReady = this.heroes.find(unit => unit.currentHp > 0 && unit.atb >= 100 && !unit.actionPending);
      if (nextReady) this.selectedHeroId = nextReady.id;
    }, profile.delivery === 'melee' ? 200 : 300);
    return true;
  }

  triggerFinalBossRandomEvent() {
    const effects = [
      'hammer_strike', 'warthog_run', 'facehugger_stun', 'self_destruct',
      'heal_squad', 'blind_fog', 'raptor_stampede', 'freeze_matrix',
      'iris_invuln', 'spawn_snarks', 'companion_shield', 'chaff_scrambler',
      'drill_drop', 'concert_buff', 'swords_block', 'fire_wave',
      'azure_drain', 'static_stun', 'jack_box_trap', 'chain_bind',
      'mako_drop', 'fatman_nuke', 'quad_damage', 'redeemer_blast',
      'spell_avada', 'orbital_laser', 'divine_light', 'wassup_high',
      'marker_insanity', 'meeseeks_swarm', 'circus_glitch', 'digivolve_warp',
      'trap_snap', 'vampire_fury', 'magia_erebea', 'tachikoma_strike', 'interceptor_ram'
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    this.triggerCombatEvent(randomEffect);
    this.particles.add(this.width / 2, this.height / 2 - 50, 0, -1, '#ff3333', 180, 45, 'text', `BREACH INSTABILITY: ${randomEffect.toUpperCase()}`);
  }

  triggerCombatEvent(effect) {
    if (this.gameOver) return;
    this.playSfx('special');
    this.particles.add(this.width/2, this.height/2, 0, 0, '#ffffff', 300, 30, 'glitch');

    switch (effect) {
      case 'hammer_strike':
      case 'redeemer_blast':
      case 'fatman_nuke':
      case 'spell_avada':
      case 'orbital_laser':
      case 'digivolve_warp': {
        const dmg = effect === 'redeemer_blast' ? 350 : effect === 'digivolve_warp' ? 280 : (effect === 'fatman_nuke' || effect === 'orbital_laser') ? 250 : effect === 'spell_avada' ? 200 : 150;
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            let status = null;
            if (effect === 'orbital_laser') status = 'glitched';
            this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#f1c40f' }, e, dmg, status);
          }
        });
        break;
      }
      case 'warthog_run':
      case 'raptor_stampede':
      case 'mako_drop':
      case 'interceptor_ram': {
        const dmg = (effect === 'mako_drop' || effect === 'interceptor_ram') ? 220 : 120;
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            e.state = 'hit';
            e.stateTimer = 180;
            this.applyDamage({ x: 0, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#3498db' }, e, dmg);
          }
        });
        break;
      }
      case 'heal_squad':
      case 'concert_buff':
      case 'divine_light':
      case 'meeseeks_swarm':
      case 'vampire_fury': {
        const heal = effect === 'divine_light' ? 200 : effect === 'heal_squad' ? 150 : effect === 'vampire_fury' ? 100 : 80;
        this.heroes.forEach(h => {
          if (h.currentHp > 0) {
            const cap = h.statusEffects?.radiated > 0 ? h.maxHp * 0.5 : h.maxHp;
            h.currentHp = Math.min(cap, h.currentHp + heal);
            this.particles.add(h.x, h.y - 20, 0, -1, '#2ecc71', 12, 45, 'text', `+${heal}`);
          }
        });
        if (effect === 'meeseeks_swarm' || effect === 'vampire_fury') {
          const enemyDmg = effect === 'vampire_fury' ? 200 : 150;
          this.enemies.forEach(e => {
            if (e.currentHp > 0) {
              this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#2ecc71' }, e, enemyDmg);
            }
          });
        }
        break;
      }
      case 'freeze_matrix':
      case 'swords_block':
      case 'static_stun':
      case 'wassup_high':
      case 'marker_insanity':
      case 'tachikoma_strike':
      case 'blind_fog': {
        const duration = effect === 'swords_block' || effect === 'wassup_high' ? 360 : 240;
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            e.state = 'hit';
            e.stateTimer = duration;
            this.particles.add(e.x, e.y - 15, 0, 0, '#00ff00', 8, 15, 'spark');
            if (effect === 'marker_insanity') {
              this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#8e44ad' }, e, 120);
            }
          }
        });
        break;
      }
      case 'iris_invuln':
      case 'quad_damage':
      case 'magia_erebea': {
        const duration = effect === 'quad_damage' || effect === 'magia_erebea' ? 600 : 240;
        this.heroes.forEach(h => {
          if (h.currentHp > 0) {
            h.state = 'defense';
            h.stateTimer = duration;
          }
        });
        break;
      }
      case 'circus_glitch':
      case 'parody_rule_shift': {
        this.enemies.forEach(e => {
          if (e.currentHp > 0 && e.statusEffects) {
            e.statusEffects.glitched = 360;
            this.applyDamage({ x: e.x - 30, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, e, 100);
          }
        });
        break;
      }
      case 'facehugger_stun':
      case 'trap_snap': {
        let strongest = null;
        let maxHp = 0;
        this.enemies.forEach(e => {
          if (e.currentHp > maxHp) {
            maxHp = e.currentHp;
            strongest = e;
          }
        });
        if (strongest) {
          strongest.state = 'hit';
          strongest.stateTimer = 300;
          const dmg = effect === 'trap_snap' ? 250 : 50;
          this.applyDamage({ x: strongest.x - 30, y: strongest.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, strongest, dmg);
        }
        break;
      }
      default: {
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            this.applyDamage({ x: e.x - 30, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#ffeb3b' }, e, 120);
          }
        });
      }
    }
  }
  applyDamage(attacker, defender, baseDmg, statusEffect = null) {
    if (!defender || defender.currentHp <= 0 || !Number.isFinite(baseDmg)) return 0;
    
    // Apply attacker talent modifications
    if (attacker && attacker.talent) {
      if (attacker.talent === 'reality_warp' && Math.random() < 0.20) {
        statusEffect = 'glitched';
      }
      if (attacker.talent === 'incendiary' && Math.random() < 0.25) {
        statusEffect = 'radiated';
      }
      if (attacker.talent === 'suppressing_fire') {
        if (defender.stats) defender.stats.def = Math.round((defender.stats.def || 0) * 0.8);
        else defender.def = Math.round((defender.def || 0) * 0.8);
        this.particles.add(defender.x, defender.y - 45, 0, -1.2, '#3498db', 11, 50, 'text', 'DEF DOWN');
      }
    }

    const variance = (Math.random() * 0.2) + 0.9;
    const buff = attacker?.rpgBuffTicks > 0 ? attacker.rpgBuffMultiplier : 1;
    const finalDmg = absorbBattleItemDamage(defender, calculateRpgDamage(defender, baseDmg * buff, variance, false, attacker));
    const dealtDamage = Math.min(defender.currentHp, finalDmg);

    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);

    // Nanite lifesteal
    if (attacker && attacker.talent === 'lifedrain' && attacker.currentHp > 0) {
      this.applyHealing(attacker, Math.round(dealtDamage * 0.10));
    }

    if (defender.state !== 'defense') {
      defender.state = 'hit';
      defender.stateTimer = 15;
    }

    if (statusEffect && defender.currentHp > 0 && defender.statusEffects) {
      defender.statusEffects[statusEffect] = 300;
      const label = statusEffect === 'infected' ? 'INFECTED' : statusEffect === 'glitched' ? 'GLITCHED' : 'RADIATED';
      const color = statusEffect === 'infected' ? '#2ecc71' : statusEffect === 'glitched' ? '#00ff00' : '#e67e22';
      this.particles.add(defender.x, defender.y - 35, 0, -1, color, 12, 60, 'text', label);
    }

    this.particles.add(defender.x, defender.y - 20, (Math.random()-0.5)*2, -1.5, defender.isBoss ? '#f1c40f' : '#e74c3c', 14, 45, 'text', `${finalDmg}`);
    for (let i = 0; i < 5; i++) {
      this.particles.add(defender.x, defender.y - 10, (Math.random()-0.5)*5, (Math.random()-0.5)*5, '#ff9900', 4, 25, 'spark');
    }

    if (defender.currentHp <= 0) {
      defender.state = 'dead';
      defender.stateTimer = 999;
      this.playSfx('defeat');
    } else {
      this.playSfx('hit');
    }
    return dealtDamage;
  }

  getRandomAliveEnemy() {
    const alive = this.enemies.filter(e => e.currentHp > 0);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  getRandomAliveHero() {
    const alive = this.heroes.filter(h => h.currentHp > 0);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }

  update() {
    if (this.disposed || this.paused || this.isTargetingPaused()) return;
    if (this.gameOver) {
      this.victoryTimer++;
      if (this.victoryTimer > 120 && !this.completionReported) {
        this.completionReported = true;
        const alive = this.heroes.some(h => h.currentHp > 0);
        this.onComplete(alive ? 'victory' : 'defeat');
      }
      return;
    }

    this.advanceActions();

    if (this.isFinalBoss) {
      this.finalBossChaosTimer++;
      if (this.finalBossChaosTimer >= 480) { // 8 seconds
        this.finalBossChaosTimer = 0;
        this.triggerFinalBossRandomEvent();
      }
    }

    const heroesAlive = this.heroes.some(h => h.currentHp > 0);
    const enemiesAlive = this.enemies.some(e => e.currentHp > 0);

    if (!heroesAlive) {
      this.gameOver = true;
      this.victoryTimer = 0;
      this.playSfx('defeat');
      return;
    }
    if (!enemiesAlive) {
      // Wave cleared
      const nextWave = this.wave + 1;
      const missingExclusiveWorldBossWave = this.exclusiveEnemyRoster
        && nextWave === 3
        && !this.enemiesData.worldBoss;
      if (this.wave < this.maxWaves && !missingExclusiveWorldBossWave) {
        this.wave = nextWave;
        this.enemyActionLock = false;
        this.enemyGlobalRecovery = 90;
        this.spawnWave();
      } else {
        this.gameOver = true;
        this.victoryTimer = 0;
        this.playSfx('victory');
      }
      return;
    }

    // Update heroes (ATB and status effects)
    this.heroes.forEach(h => {
      if (h.currentHp <= 0) return;

      if (h.cooldown > 0) h.cooldown--;
      if (h.rpgBuffTicks > 0) h.rpgBuffTicks--;
      if (h.rpgGuardTicks > 0) h.rpgGuardTicks--;
      if (h.stateTimer > 0) {
        h.stateTimer--;
        if (h.stateTimer === 0) h.state = 'idle';
      }

      // Infection DoT
      if (h.statusEffects?.infected > 0) {
        h.statusEffects.infected--;
        if (h.statusEffects.infected % 60 === 0) {
          h.currentHp = Math.max(1, h.currentHp - 3);
          this.particles.add(h.x, h.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      // Glitched (ATB charge rate halved)
      let atbRate = h.stats.spd * 0.05 + 0.15;
      if (h.statusEffects?.glitched > 0) {
        h.statusEffects.glitched--;
        atbRate *= 0.5;
        if (h.statusEffects.glitched % 12 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*15, h.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      // Radiated
      if (h.statusEffects?.radiated > 0) {
        h.statusEffects.radiated--;
        if (h.statusEffects.radiated % 40 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*12, h.y - 12 + (Math.random()-0.5)*12, 0, -0.5, '#e67e22', 4, 25, 'spark');
        }
      }

      if (h.state === 'idle' && !h.actionPending) {
        if (h.atb < 100) {
          h.atb = Math.min(100, h.atb + atbRate);
        }
        if (this.autoBattle && h.atb >= 100 && !h.actionPending) {
          ['special', 'secondary', 'simple'].some(type => this.triggerAbility(h, type));
        }
        if (!h.actionPending) this.faceTarget(h, this.getFacingTarget(h));
      }
    });

    const activeSelected = this.getSelectedHero();
    if (!activeSelected || activeSelected.currentHp <= 0 || activeSelected.atb < 100) {
      const firstReady = this.heroes.find(h => h.currentHp > 0 && h.atb >= 100);
      if (firstReady) this.selectedHeroId = firstReady.id;
    }

    // Update enemies
    if (this.enemyGlobalRecovery > 0) this.enemyGlobalRecovery--;
    this.enemies.forEach(e => {
      if (e.currentHp <= 0) return;
      if (e.stateTimer > 0) {
        e.stateTimer--;
        if (e.stateTimer === 0) {
          e.state = 'idle';
          if (!e.actionPending) this.returnToFormation(e);
        }
      }
      if (e.cooldown > 0) e.cooldown--;
      if (e.rpgBuffTicks > 0) e.rpgBuffTicks--;
      if (e.rpgGuardTicks > 0) e.rpgGuardTicks--;

      // Infection DoT
      if (e.statusEffects?.infected > 0) {
        e.statusEffects.infected--;
        if (e.statusEffects.infected % 60 === 0) {
          e.currentHp = Math.max(1, e.currentHp - 3);
          this.particles.add(e.x, e.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      // Glitched (ATB charge rate halved)
      let atbRate = (e.spd || e.atk || 8) * 0.035 + 0.08;
      if (e.statusEffects?.glitched > 0) {
        e.statusEffects.glitched--;
        atbRate *= 0.5;
        if (e.statusEffects.glitched % 12 === 0) {
          this.particles.add(e.x + (Math.random()-0.5)*15, e.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      if (e.statusEffects?.radiated > 0) {
        e.statusEffects.radiated--;
      }

      if (!this.enemyActionLock && this.enemyGlobalRecovery <= 0 && e.state === 'idle' && e.atb < 100) {
        e.atb = Math.min(100, e.atb + atbRate);
      }

      if (e.state === 'idle' && !e.actionPending) this.faceTarget(e, this.getFacingTarget(e));
      if (this.opponentControl === 'cpu' && !this.enemyActionLock && this.enemyGlobalRecovery <= 0 && e.atb >= 100 && e.state === 'idle') {
        for (const abilityType of ['special', 'secondary', 'simple']) {
          if (!this.canUseAction(e, abilityType, 'enemy')) continue;
          const context = this.getActionContext(e, abilityType, 'enemy');
          if (this.executeRpgAction(context, this.chooseDefaultTargets(context))) break;
        }
      }
    });
    const selectedEnemy = this.enemies.find(enemy => (
      enemy.currentHp > 0
      && (
        enemy.runtimeId === this.selectedEnemyId
        || enemy.battleId === this.selectedEnemyId
        || enemy.id === this.selectedEnemyId
        || enemy.name === this.selectedEnemyId
      )
    ));
    if (!selectedEnemy) {
      const nextAlive = this.enemies.find(enemy => enemy.currentHp > 0);
      this.selectedEnemyId = nextAlive?.battleId || nextAlive?.id || null;
    }
  }

  drawRpgHero(ctx, h, animTime) {
    const scale = this.getDepthScale(h.y);
    drawPixelSprite(ctx, h.x, h.y, h, animTime, h.facing, 72 * scale, 'rpg');

    if (h.id === this.selectedHeroId && h.currentHp > 0) {
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = Math.max(1, scale);
      ctx.strokeRect(h.x - 18 * scale, h.y - 30 * scale, 36 * scale, 42 * scale);

      ctx.fillStyle = '#00ffff';
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText('ACTIVE', h.x - 20 * scale, h.y - 36 * scale);
    }

    if (h.currentHp > 0) {
      const barWidth = 40 * scale;
      const barX = h.x - barWidth / 2;
      const barY = h.y + 18 * scale;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(barX, barY, barWidth, 3);
      const hpPct = h.currentHp / h.maxHp;
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(barX, barY, barWidth * hpPct, 3);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(barX, barY + 5, barWidth, 3);
      const atbPct = h.atb / 100;
      ctx.fillStyle = h.atb >= 100 ? '#f1c40f' : '#3498db';
      ctx.fillRect(barX, barY + 5, barWidth * atbPct, 3);
    }
  }

  drawRpgEnemy(ctx, e, animTime) {
    const scale = this.getDepthScale(e.y);
    if (e.isBoss) {
      drawBoss(ctx, e.x, e.y, e, animTime, e.facing);
    } else {
      drawPixelEnemy(ctx, e.x, e.y, e, animTime, e.facing, 68 * scale);
    }

    if (e.currentHp > 0) {
      const width = (e.isBoss ? 70 : 36) * scale;
      const xOffset = -width / 2;
      const yOffset = (e.isBoss ? 40 : 18) * scale;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(e.x + xOffset, e.y + yOffset, width, 3);
      const hpPct = e.currentHp / e.maxHp;
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(e.x + xOffset, e.y + yOffset, width * hpPct, 3);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(e.x + xOffset, e.y + yOffset + 4, width, 2);
      const atbPct = e.atb / 100;
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(e.x + xOffset, e.y + yOffset + 4, width * atbPct, 2);
    }
  }

  draw(ctx, animTime) {
    // A shared depth pass prevents a far enemy from painting over a combatant
    // whose feet are lower on the perspective floor.
    [
      ...this.heroes.map(unit => ({ unit, type: 'hero' })),
      ...this.enemies.map(unit => ({ unit, type: 'enemy' }))
    ]
      .sort((a, b) => a.unit.y - b.unit.y || a.unit.x - b.unit.x)
      .forEach(entry => {
        if (entry.type === 'hero') this.drawRpgHero(ctx, entry.unit, animTime);
        else this.drawRpgEnemy(ctx, entry.unit, animTime);
      });

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(`WAVE: ${this.wave}/${this.maxWaves}`, 20, 22);
  }
}
