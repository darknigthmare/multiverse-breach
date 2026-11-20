import { clearSourceMechanicsWave17 } from './combat/sourceMechanicsWave17.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from './combat/combatSourceDefinitionsWave17.js';
import { isJadeGyrodiskProfileWave17, projectJadeGyrodiskOriginWave17 } from './combat/jadeGyrodiskActionWave17.js';
import { isSourceKittenWave17 } from './combat/sourceMechanicsWave17.js';
import { isJadeInformationProfileWave17, revealPhotographicEvidenceWave17, drawPhotographicEvidenceWave17 } from './combat/sourceMechanicsWave17.js';
import { canUseOkarunAllOutWave17, consumeOkarunAllOutWave17, isOkarunAllOutProfileWave17 } from './combat/sourceMechanicsWave17.js';
import { usesConfirmedSummonContactWave17, projectNativeSummonEffectOriginWave17 } from './combat/rosterSummonChoreographyWave17.js';
import { isSourceBubbleCaptureProfileWave17, isSourceBubbleCaptureTargetEligibleWave17 } from './combat/sourceBubbleCaptureWave17.js';
import { armBubbleCaptureWave17, isBubbleActorImmobilizedWave17, drawBubbleCapturesWave17 } from './combat/sourceMechanicsWave17.js';
import { isMelodyWave17, isMediGunProfileWave17, isUberProfileWave17, startMediGunBeamWave17, stopMediGunBeamWave17, findChargedMedicWave17, activateUberChargeWave17, hasStockUberProtectionWave17, advanceSourceMechanicsWave17, drawMediGunBeamsWave17, sourceCellWave17, resolveGoldenLuteStepWave17 } from './combat/sourceMechanicsWave17.js';
import { getSourceHitSequenceWave16, allocateSourceSequenceDamageWave16 } from './combat/combatHitSequenceWave16.js';
import { projectSourceBladeContactWave16, intersectsSourceBladeHurtboxWave16 } from './combat/combatBladeContactWave16.js';
import { canBeginSourceProtectionWave16, hasSourceProtectionProfileWave16, armSourceProtectionWave16, interceptSourceProtectionHitWave16, advanceSourceCombatStatusesWave16, noteSourceDamageWave16, drawSourceCombatStatusWave16, beginSourceControlWave16 as legacybeginSourceControlWave16, canSourceControlTargetWave16 as legacycanSourceControlTargetWave16, getPossessedBodyWave16, getPossessedSligActionWave16, releaseSourcePossessionWave16, isSourceImmobilizedWave16 as legacyisSourceImmobilizedWave16, getSourceRuntimeViewWave16, projectSourceSligMuzzleWave16, clearSourceCombatStatusesWave16 } from './combat/sourceCombatRuntimeWave16.js';
import { isSourceControlProfileWave16 as legacyisSourceControlProfileWave16, advanceSourceControlWave16 } from './combat/combatControlWave16.js';
import { preloadSourceProtectionEntityAssetsWave16 } from './combat/sourceProtectionEntityCatalogWave16.js';
import { projectNativeSummonEffectOriginWave16, usesConfirmedSummonContactWave16 } from './combat/rosterSummonChoreographyWave16.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from './combat/combatSourceDefinitionsWave16.js';
import { isValHealingBurstProfile, healingBurstWithinRange } from './combat/combatHealingBurstWave15.js';
import { usesConfirmedSummonContactWave15 } from './combat/rosterSummonChoreographyWave15';
import { usesConfirmedSummonContactWave14 } from './combat/rosterSummonChoreographyWave14';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 } from './combat/combatSourceDefinitionsWave14';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from './combat/combatSourceDefinitionsWave15';
import { drawCombatControl, isPhaselockProfile, isPhaselockTargetEligible } from './combat/combatControlWave15';
import { usesConfirmedSummonContactWave12 } from './combat/rosterSummonChoreographyWave12';
import { usesConfirmedSummonContactWave13 } from './combat/rosterSummonChoreographyWave13';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12 } from './combat/combatSourceDefinitionsWave12';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 } from './combat/combatSourceDefinitionsWave13';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 } from './combat/combatSourceDefinitionsWave11';
import { usesConfirmedSummonContactWave11 } from './combat/rosterSummonChoreographyWave11';
// Final Fantasy Record Keeper ATB RPG Engine with Synergies & Status Effects
import { captureRpgActionCommitment } from './rpgActionCommitment.js';
import { RPG_ACTION_ATB_COST } from './rpgActionEconomy.js';
import { drawPixelSprite, drawPixelEnemy, drawBoss, drawCosmeticAtlasFrame, preloadSpriteSheetSrcs } from './renderer';
import { combatBuffSource } from './combat/characterFormState';
import { absorbBattleItemDamage, previewBattleItemDamage } from './battleItemShield';
import { SYNERGIES_DB } from './heroes';
import { resolveArchetypeCombatStats } from './combatStatPreparation';
import { cleanseRpgStatuses, getRpgCleansableStatuses, getRpgReviveHp } from './rpgSupport.js';
import { applyCombatHealing, getCombatHealingAmount } from './combatHealing.js';
import { grantCombatEventBuff, tickCombatEventBuffs, getCombatEventDamageMultiplier, getCombatEventSpeedMultiplier } from './combatEventBuffs.js';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import { calculateRpgDamage, getRpgActionProfile, getRpgEligibleTargets, resolveRpgTargets, rpgUnitId } from './rpgTargeting';
import { resolveCombatAbility, resolveCombatHeroSpriteActor, resolveUniverseSummon } from './combatIdentity';
import { getCombatEntityFrame } from './combat/entityAssets';
import { drawSummonChoreographyEffects, getSummonChoreographyState, resolveSummonChoreography } from './combat/summonChoreography';
import { drawCharacterSuperVisuals, getCharacterSuperVisualState, supportsConfirmedCharacterSuperContact } from './combat/characterSuperVisuals';
import { getSummonAnimationFrame, resolveSummonAnimationAsset } from './combat/summonAnimationCatalog';
import { usesConfirmedSummonContactWave9 } from './combat/rosterSummonChoreographyWave9';
import { usesConfirmedSummonContactWave10 } from './combat/rosterSummonChoreographyWave10';

const beginSourceControlWave16 = (actor,target,profile,options) => isSourceBubbleCaptureProfileWave17(profile) ? armBubbleCaptureWave17(actor,target,profile,options) : legacybeginSourceControlWave16(actor,target,profile,options);
const canSourceControlTargetWave16 = (actor,target,profile,options) => isSourceBubbleCaptureProfileWave17(profile) ? actor?.currentHp>0 && actor!==target && isSourceBubbleCaptureTargetEligibleWave17(profile,target) && Math.hypot(target.x-actor.x,target.y-actor.y)<=profile.range : legacycanSourceControlTargetWave16(actor,target,profile,options);
const isSourceControlProfileWave16 = profile => isSourceBubbleCaptureProfileWave17(profile) || legacyisSourceControlProfileWave16(profile);
const isSourceImmobilizedWave16 = actor => isSourceKittenWave17(actor) || isBubbleActorImmobilizedWave17(actor) || legacyisSourceImmobilizedWave16(actor);
import { emitCanonHeroAttackEffect, resolveCanonHeroAttackEffect } from './canonHeroAttackEffects.js';
import { RAAM_ENCOUNTER_RULES, createRaamEncounter, getRaamBoss, getRaamLightPosition, isHeroInRaamLight, isRaamShieldActive, getRaamEnemyAction, startRaamKryll, tickRaamEncounter, getRaamEncounterSnapshot } from './canonRaamEncounter.js';
import { getBlackPearlSourceAmmunition } from './canonBlackPearlSourceKits.js';
import { PIRATES_CURSE_RULES, createPiratesCurseEncounter, getPiratesBarbossa, getPiratesCurseNextCommand, getPiratesCurseEncounterSnapshot, isPiratesCursedCombatant, isPiratesCurseProtected, bindPiratesJackCurse, isPiratesCursedHero, repairPiratesCursedHeroes } from './canonPiratesCurseEncounter.js';

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
const recordSummonEffect = (contacts, target, { x, y } = target) => contacts?.push({ id: rpgUnitId(target), x, y });
const sourceDamageImmuneWave16 = actor => actor.sourceProtectionWave16?.active
  && actor.sourceProtectionWave16.kind==='mugman-super-art-ii' && actor.sourceProtectionWave16.remaining>0;

export class EngineRpg {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete, stage = {}) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    this.stage = stage;
    this.raamEncounter = createRaamEncounter(stage);
    this.piratesCurseEncounter = createPiratesCurseEncounter(stage);
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
    this.activeSummon = null;
    this.sourceRpgControlTargetsWave16 = new Set();
    this.actorActions = new Map();
    this.actorLifetimes = new WeakMap();
    this.enemyActionOwner = null;

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
        summonUsed: false,
        maxHp: h.stats.hp,
        currentHp: h.stats.hp,
        facing: 1,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      };
    });
    this.heroes.forEach(hero => {
      this.fitCombatantToArena(hero);
      const ammunition = getBlackPearlSourceAmmunition(hero);
      if (ammunition) hero.sourceAmmoRemaining = ammunition.maxShots;
    });
    if (this.raamEncounter) this.heroes.forEach(hero => {
      hero.raamInitialHomeX = hero.homeX;
      hero.raamInitialHomeY = hero.homeY;
      hero.raamLightCover = false;
    });

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
    this.maxWaves = this.singleRoster || this.piratesCurseEncounter ? 1 : enemiesData.worldBoss ? 3 : 2;
    this.isBossStage = this.singleRoster
      ? enemiesData.customRoster.some(enemy => enemy.isBoss || enemy.isWorldBoss)
      : (enemiesData.bosses?.length || 0) > 0 || !!enemiesData.worldBoss;
    this.isFinalBoss = false;
    this.finalBossChaosTimer = 0;
    
    this.spawnWave();
    preloadSourceProtectionEntityAssetsWave16([...this.heroes,...this.enemies]);
    this.enemies.forEach(actor => {
      const ammunition = getBlackPearlSourceAmmunition(actor);
      if (ammunition) actor.sourceAmmoRemaining = ammunition.maxShots;
    });

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

  getRpgSourceRenderHeightWave16(unit){
    if(unit.isBoss)return this.getCombatantBounds(unit).height;
    const humanoid=unit.sourceEnemyId!=='oddworld_slig'&&(this.heroes.includes(unit)||resolveCombatHeroSpriteActor(unit));
    return(humanoid?72:68)*this.getDepthScale(unit.y);
  }

  getRpgSourceHurtboxWave16(unit){
    const id=unit.sourceHeroId||unit.sourceId||unit.id;
    const source=COMBAT_SOURCE_DEFINITIONS_WAVE16[id]||COMBAT_SOURCE_DEFINITIONS_WAVE15[id]
      ||COMBAT_SOURCE_DEFINITIONS_WAVE14[id]||COMBAT_SOURCE_DEFINITIONS_WAVE13[id]||COMBAT_SOURCE_DEFINITIONS_WAVE12[id]||COMBAT_SOURCE_DEFINITIONS_WAVE11[id];
    // The shared Melee body rectangle is30x58 at72px, scaled to this actual
    // RPG render height and documented stature. It excludes bars and weapons.
    const stature=source?.universe===unit.universe&&source.bodyHeight>0?source.bodyHeight/190:1;
    const scale=this.getRpgSourceRenderHeightWave16(unit)/72*stature,width=30*scale,height=58*scale;
    return{left:unit.x-width/2,right:unit.x+width/2,top:unit.y-height,bottom:unit.y,width,height};
  }

  advanceRpgSourceBladeApproachWave16(){
    const actors=[...this.heroes,...this.enemies];
    for(const actor of actors){
      const sequence=actor.rpgSourceSequence,approach=sequence?.sourceBladeApproachWave16;
      if(!approach||approach.complete||approach.cancelled)continue;
      const target=actors.find(unit=>rpgUnitId(unit)===approach.targetId);
      if(!target||target.currentHp<=0||actor.currentHp<=0||actor.rpgActionVersion!==sequence.actionVersion
        ||isSourceImmobilizedWave16(actor)||actor.rpgControlTicks>0||Math.hypot(target.x-approach.startX,target.y-approach.startY)>190){
        approach.cancelled=true;sequence.cancelled=true;actor.rpgSourceSequence=null;actor.actionPending=false;
        if(this.enemies.includes(actor))this.enemyActionLock=false;
        continue;
      }
      const distance=Math.min(200/60,Math.max(0,approach.maxDistance-approach.travelled));
      if(distance<=0){approach.complete=true;continue;}
      const bounds=this.getCombatantBounds(actor),next=clamp(actor.x+approach.facing*distance,bounds.halfWidth+8,this.width-bounds.halfWidth-8);
      const box=this.getRpgSourceHurtboxWave16(actor),delta=next-actor.x;
      const sweep={left:Math.min(box.left,box.left+delta),right:Math.max(box.right,box.right+delta),top:box.top,bottom:box.bottom};
      const blocked=actors.some(other=>other!==actor&&other.currentHp>0&&(()=>{const body=this.getRpgSourceHurtboxWave16(other);return sweep.right>body.left&&sweep.left<body.right&&sweep.bottom>body.top&&sweep.top<body.bottom;})());
      if(blocked){approach.complete=true;approach.blockedByBody=true;continue;}
      actor.x=next;approach.travelled+=Math.abs(delta);
      if(Math.abs(delta)<distance-1e-8){approach.complete=true;approach.blockedByBoundary=true;}
    }
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

  scheduleAction(callback, delay, actor = null, onCancel = null) {
    if (this.disposed || this.gameOver || typeof callback !== 'function' || !Number.isFinite(delay) || delay < 0) return null;
    const action = { callback, ticks: Math.max(1, Math.ceil(delay * 60 / 1000)), actor, onCancel, cancelled: false,
      actorLifetime: actor ? this.actorLifetimes.get(actor) || 0 : null };
    this.actionQueue.push(action);
    if (actor) this.actorActions.set(actor, action);
    return action;
  }

  cancelActorActions(actor) {
    if (!actor || typeof actor !== 'object') return;
    // Invalidate incoming effects synchronously, even when this actor had no
    // queued action of its own. A same-tick revival cannot hide the old life.
    this.actorLifetimes.set(actor, (this.actorLifetimes.get(actor) || 0) + 1);
    actor.rpgActionVersion = (actor.rpgActionVersion || 0) + 1;
    if (actor.rpgSourceSequence) actor.rpgSourceSequence.cancelled = true;
    actor.rpgSourceSequence = null;
    actor.rpgGyrodiskActionWave17 = null;
    actor.sourceRpgLuteMoveWave17 = null;
    clearSourceMechanicsWave17([actor], 'action-cancelled');
    const owned = new Set(this.actionQueue.filter(action => action.actor === actor));
    const current = this.actorActions.get(actor);
    if (current) owned.add(current);
    for (const action of owned) {
      // The current record may already be in this tick's due batch.
      action.cancelled = true;
      action.onCancel?.();
    }
    this.actorActions.delete(actor);
    this.actionQueue = this.actionQueue.filter(action => action.actor !== actor);
    actor.actionPending = false;
    if (this.enemyActionOwner === actor) {
      this.enemyActionOwner = null;
      this.enemyActionLock = false;
    }
    this.returnToFormation(actor);
  }

  clearPendingActions() {
    const actors = new Set([...this.actorActions.keys(), ...this.actionQueue.map(action => action.actor).filter(Boolean)]);
    for (const actor of actors) this.cancelActorActions(actor);
    this.actionQueue = [];
    this.enemyActionOwner = null;
    this.enemyActionLock = false;
  }

  advanceActions() {
    if (this.disposed || this.paused || this.gameOver || this.isTargetingPaused()) return;
    const due = [];
    this.actionQueue = this.actionQueue.filter(action => {
      action.ticks--;
      if (action.ticks > 0) return true;
      due.push(action);
      return false;
    });
    due.forEach(action => {
      if (action.cancelled || this.disposed || this.gameOver) return;
      if (action.actor) {
        if ((this.actorLifetimes.get(action.actor) || 0) !== action.actorLifetime) return;
        if ((!this.heroes.includes(action.actor) && !this.enemies.includes(action.actor))
          || !Number.isFinite(action.actor.currentHp) || action.actor.currentHp <= 0 || action.actor.state === 'dead') {
          this.cancelActorActions(action.actor);
          return;
        }
        if (this.actorActions.get(action.actor) === action) this.actorActions.delete(action.actor);
      }
      action.callback();
      // Each queued callback observes source immortality before the next one.
      // Restitution disables this repair immediately, unlike the enemy finale lock.
      repairPiratesCursedHeroes(this.piratesCurseEncounter, this.heroes);
    });
  }

  dispose() {
    clearSourceMechanicsWave17([...this.heroes,...this.enemies],'dispose');
    this.disposed = true;
    this.finishSummon();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.enemyActionLock = false;
    this.targeting = null;
    this.clearPendingActions();
    clearSourceCombatStatusesWave16([...new Set([...this.heroes,...this.enemies,...this.sourceRpgControlTargetsWave16])],'dispose');
    this.sourceRpgControlTargetsWave16.clear();
  }

  spawnWave() {
    this.enemies.forEach(enemy => this.cancelActorActions(enemy));
    this.enemies = [];
    const w = this.wave;

    if (this.piratesCurseEncounter) {
      // An immortal crew cannot be an HP-gated preliminary wave. The actual
      // curse ritual and Barbossa duel share one condensed cavern encounter.
      const pirate = this.enemiesData.monsters.find(enemy => enemy.name === 'Cursed Aztec Pirate');
      const barbossa = this.enemiesData.bosses.find(enemy => (enemy.canonicalName || enemy.name) === 'Hector Barbossa');
      [pirate, pirate, barbossa].filter(Boolean).forEach((template, index) => {
        const isBoss = template === barbossa;
        const position = this.resolveFloorPosition(
          isBoss ? this.levelProfile?.rpg?.bossLanes?.[0] : this.levelProfile?.rpg?.enemyLanes?.[index],
          isBoss ? { x: 0.86, y: 0.87 } : RPG_FLOOR_LANES.enemies[index],
          template.anchor
        );
        const id = `enemy:pirates:${index}:${template.id || template.name}`;
        this.enemies.push({
          ...template, battleId: id, runtimeId: id,
          x: position.x, y: position.y, homeX: position.x, homeY: position.y,
          state: 'idle', stateTimer: 0, atb: Math.random() * 15,
          cooldown: 0, specialCharge: 0,
          defense: template.defense || { reduce: 0.42, dur: 1.2 },
          maxHp: template.hp, currentHp: template.hp,
          facing: -1, isBoss,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        });
      });
      if (barbossa) this.playSfx('portal');
    } else if (this.singleRoster) {
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
          summonUsed: false,
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
          summonUsed: false,
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
          summonUsed: false,
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
        summonUsed: false,
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
    if (actorOrId && typeof actorOrId === 'object') {
      if (team.includes(actorOrId)) return actorOrId;
      return team.some(owner => owner.currentHp > 0 && owner.state !== 'dead'
        && getPossessedBodyWave16(owner, [...this.heroes, ...this.enemies]) === actorOrId) ? actorOrId : null;
    }
    return team.find(unit => [rpgUnitId(unit), unit.id, unit.name].includes(actorOrId)) || null;
  }

  getRpgPossessionCommandState(side = 'player') {
    const team = side === 'enemy' ? this.enemies : this.heroes, actors = [...this.heroes, ...this.enemies];
    const controller = team.find(owner => owner.currentHp > 0 && owner.state !== 'dead' && getPossessedBodyWave16(owner, actors));
    const body = controller && getPossessedBodyWave16(controller, actors);
    if (!body) return null;
    return { side, controllerId:rpgUnitId(controller), controllerName:controller.name, bodyId:rpgUnitId(body), bodyName:body.name,
      actionName:getPossessedSligActionWave16(body)?.name, atb:body.atb, remaining:body.sourceControlWave16.remaining,
      ready:!this.targeting && this.canUseAction(body, 'simple', side), initialCostAlreadyPaid:true };
  }

  getRpgInvocationControlSourceWave16(actor, profile) {
    if (profile?.abilityType !== 'summon' || !isSourceControlProfileWave16(profile)) return null;
    // Resolve the actual catalog command again. A free sourceHeroId field may
    // never authorize another character's control or change the caller's body.
    const descriptor = resolveUniverseSummon(actor), declared = profile.summon;
    const performer = descriptor?.performer;
    if (descriptor?.kind !== 'reinforcement' || descriptor.performerRole !== 'reinforcement'
      || !performer || descriptor.sourceHeroId !== performer.id || descriptor.action?.sourceHeroId !== performer.id
      || performer.universe !== actor.universe || descriptor.universe !== actor.universe
      || profile.sourceHeroId !== performer.id || profile.action?.sourceHeroId !== performer.id || profile.name !== descriptor.action.name
      || declared?.kind !== 'reinforcement' || declared.performerRole !== 'reinforcement'
      || declared?.performer?.id !== performer.id || declared.sourceHeroId !== performer.id
      || declared.performer.universe !== performer.universe || declared.action?.sourceHeroId !== performer.id
      || declared.action?.name !== descriptor.action.name || declared.universe !== descriptor.universe) return null;
    return { ...actor, id: performer.id, sourceHeroId: performer.id, sourceId: performer.id,
      battleId: rpgUnitId(actor), runtimeId: rpgUnitId(actor), universe: performer.universe };
  }

  beginRpgInvocationControlWave16(actor, target, profile, channelCompleted) {
    const source = this.getRpgInvocationControlSourceWave16(actor, profile);
    if (!source || !canSourceControlTargetWave16(source, target, profile)
      || !beginSourceControlWave16(source, target, profile, { hostile: true, channelCompleted })) return false;
    const sourceInvocationWave16 = Object.freeze({ callerId: rpgUnitId(actor),
      callerHeroId: actor.sourceHeroId || actor.sourceId || actor.id,
      performerId: source.sourceHeroId, universe: source.universe,
      actionName: profile.name, kind: profile.controlKind });
    target.sourceControlWave16 = Object.freeze({ ...target.sourceControlWave16, sourceInvocationWave16 });
    target.sourceControlProfileRpgWave16 = profile;
    this.sourceRpgControlTargetsWave16.add(target);
    return true;
  }

  beginPossessedTargeting(controllerId, side = 'player') {
    const owner = this.resolveActor(controllerId, side), body = owner && getPossessedBodyWave16(owner, [...this.heroes, ...this.enemies]);
    return body && owner.currentHp > 0 && owner.state !== 'dead' ? this.beginTargeting(body, 'simple', side) : false;
  }

  releaseRpgPossession(controllerId, side = 'player') {
    if (this.paused || this.disposed || this.gameOver) return false;
    const owner = this.resolveActor(controllerId, side), actors = [...this.heroes, ...this.enemies];
    const body = owner && getPossessedBodyWave16(owner, actors);
    if (!body || !releaseSourcePossessionWave16(owner, actors)) return false;
    body.rpgPossessedRifleActionWave16 = null;
    this.sourceRpgControlTargetsWave16.delete(body);
    owner.sourceRpgPossessionCastWave16=null;owner.rpgSpecialVisual=null;owner.actionPending=false;
    if(owner.currentHp>0)owner.state='idle';
    if(body.currentHp>0)body.state='idle';
    if(this.enemies.includes(owner))this.enemyActionLock=false;
    if (this.targeting?.actor === body) this.targeting = null;
    return true;
  }

  executeRpgGoldenLuteMovementWave17(context, target) {
    const { actor, abilityType, side } = context;
    const from = sourceCellWave17(actor), goal = sourceCellWave17(target);
    if (!from || !goal) return false;
    const actors = [...this.heroes, ...this.enemies];
    const cells = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => ({ x: from.x + dx, y: from.y + dy, z: from.z, dx, dy }));
    const next = cells.filter(cell => actor.x + cell.dx * 64 >= 20 && actor.x + cell.dx * 64 <= this.width - 20
      && actor.y + cell.dy * 64 >= this.height * .45 && actor.y + cell.dy * 64 <= this.height - 12
      && !actors.some(unit => unit !== actor && unit.currentHp > 0
        && sourceCellWave17(unit)?.x === cell.x && sourceCellWave17(unit)?.y === cell.y))
      .sort((a, b) => (Math.abs(a.x - goal.x) + Math.abs(a.y - goal.y)) - (Math.abs(b.x - goal.x) + Math.abs(b.y - goal.y)))[0];
    if (!next) return false;
    const opponents = side === 'enemy' ? this.heroes : this.enemies;
    const commitment = captureRpgActionCommitment(this, context, opponents);
    actor.sourceLuteCellWave17 = from;
    actor.sourceRpgLuteMoveWave17 = { x: actor.x, y: actor.y, dx: next.dx * 64, dy: next.dy * 64,
      from, to: { x: next.x, y: next.y, z: next.z }, commitment, tick: 0, duration: 18 };
    actor.atb = 0; actor.actionPending = true; actor.state = 'run';
    if (abilityType === 'special') actor.specialCharge = 0;
    else if (abilityType === 'secondary') actor.cooldown = Math.round((context.profile.action.cd ?? 3) * 60);
    if (side === 'enemy') { this.enemyActionLock = true; this.enemyActionOwner = actor; }
    return true;
  }

  advanceRpgGoldenLuteMovementWave17() {
    const actors = [...this.heroes, ...this.enemies];
    for (const actor of actors) {
      const move = actor.sourceRpgLuteMoveWave17;
      if (!move) continue;
      if (!move.commitment.casterValid() || actor.currentHp <= 0 || actor.rpgControlTicks > 0 || isSourceImmobilizedWave16(actor)) {
        actor.sourceRpgLuteMoveWave17 = null; actor.actionPending = false;
        actor.sourceLuteCellWave17 = sourceCellWave17(actor);
        if (this.enemies.includes(actor)) { this.enemyActionLock = false; this.enemyActionOwner = null; }
        continue;
      }
      move.tick++;
      const progress = Math.min(1, move.tick / move.duration);
      actor.x = move.x + move.dx * progress; actor.y = move.y + move.dy * progress;
      // Cell observation must not release a hit halfway through this real step.
      actor.sourceLuteCellWave17 = sourceCellWave17(actor);
      if (progress < 1) continue;
      const occupied = actors.some(unit => unit !== actor && unit.currentHp > 0
        && sourceCellWave17(unit)?.x === move.to.x && sourceCellWave17(unit)?.y === move.to.y);
      if (occupied) { actor.x = move.x; actor.y = move.y; actor.sourceLuteCellWave17 = move.from; }
      const sequence = (actor.sourceLuteStepSequenceWave17 || 0) + 1;
      actor.sourceLuteStepSequenceWave17 = sequence;
      const contacts = resolveGoldenLuteStepWave17(actor, move.from, move.to,
        actors.filter(unit => move.commitment.accepts(unit)).map(unit => ({ actor: unit, cell: sourceCellWave17(unit), hostile: true })),
        { accepted: !occupied, sequence });
      for (const contact of contacts) this.applyDamage(actor, contact.actor, actor.stats?.atk || actor.atk || 8, null,
        { sourceGoldenLuteContactWave17: contact, delivery: 'melee' });
      actor.sourceLuteLastStepWave17 = { from: move.from, to: move.to,
        contacts: contacts.map(({ actor: _, ...contact }) => contact), sequence };
      actor.sourceRpgLuteMoveWave17 = null; actor.actionPending = false; actor.state = 'idle';
      if (this.enemies.includes(actor)) { this.enemyActionLock = false; this.enemyActionOwner = null; }
    }
  }

  getActionContext(actor, abilityType, side = 'player') {
    let allies = side === 'enemy' ? this.enemies : this.heroes;
    let opponents = side === 'enemy' ? this.heroes : this.enemies;
    if (getPossessedSligActionWave16(actor, abilityType)) {
      // Input ownership redirects the real rifle while the body's stored camp
      // and roster membership remain intact.
      opponents = (this.heroes.includes(actor) ? this.heroes : this.enemies).filter(unit => unit !== actor);
      allies = [...allies, actor];
    }
    const encounterAction = side === 'enemy' && actor === getRaamBoss(this.raamEncounter, this.enemies)
      ? getRaamEnemyAction(abilityType) : null;
    const profile = getRpgActionProfile(encounterAction ? { ...actor, [abilityType]: encounterAction } : actor, abilityType, side, this);
    const eligibleTargets = getRpgEligibleTargets({ actor, profile, allies, opponents });
    return { actor, abilityType, side, profile, eligibleTargets };
  }

  getRpgOkarunSourceActorWave17(actor,profile,side) {
    if(!isOkarunAllOutProfileWave17(profile)||profile.summon?.performer?.id!=='oken_dandadan')return actor;
    const team=side==='enemy'?this.enemies:this.heroes;
    const existing=team.find(unit=>(unit.sourceHeroId||unit.sourceId||unit.id)==='oken_dandadan'&&unit.universe==='Dandadan');
    if(existing)return existing;
    // Off-party reinforcement resource only: it is never inserted as a party
    // actor, NPC or extra rendered body, and previews do not mutate counters.
    return {...profile.summon.performer,currentHp:1,state:'idle',sourceOkarunResourceOnlyWave17:true,
      sourceOkarunAllOutUsesWave17:this.sourceOkarunSummonUsesWave17?.[side]||0};
  }

  canUseAction(actor, abilityType, side = 'player') {
    if(isSourceKittenWave17(actor))return false;
    if (!['player', 'enemy'].includes(side) || !this.resolveActor(actor, side) || this.disposed || this.paused || this.gameOver || !Number.isFinite(actor.currentHp) || actor.currentHp <= 0 || !Number.isFinite(actor.atb)
      || this.activeSummon || actor.rpgControlTicks > 0 || isSourceImmobilizedWave16(actor)
      || actor.state !== 'idle' || actor.actionPending || actor.atb < RPG_ACTION_ATB_COST) return false;
    const actors = [...this.heroes, ...this.enemies], state = actor.sourceControlWave16;
    if (state?.active && state.kind === 'possession') {
      const owner = actors.find(unit => rpgUnitId(unit) === state.sourceRuntimeId);
      const ownerTeam = side === 'enemy' ? this.enemies : this.heroes;
      if (state.phase !== 'active' || abilityType !== 'simple' || !ownerTeam.includes(owner)
        || owner.currentHp <= 0 || owner.state === 'dead') return false;
    }
    if (actors.some(body => body.sourceControlWave16?.active && body.sourceControlWave16.kind === 'possession'
      && body.sourceControlWave16.sourceRuntimeId === rpgUnitId(actor))) return false;
    if (side === 'enemy' && this.enemyActionLock) return false;
    if(actor.sourceProtectionWave16?.active&&actor.sourceProtectionWave16.kind==='yukikaze')return false;
    if (abilityType === 'secondary' && (!Number.isFinite(actor.cooldown) || actor.cooldown > 0)) return false;
    if (getBlackPearlSourceAmmunition(actor, abilityType)
      && (actor.sourceAmmoRemaining <= 0 || this.piratesCurseEncounter?.curseActive)) return false;
    if (abilityType === 'special' && (!Number.isFinite(actor.specialCharge) || actor.specialCharge < 100)) return false;
    if (abilityType === 'summon' && (actor.summonUsed || actor.specialCharge < 100)) return false;
    const profile = this.getActionContext(actor, abilityType, side).profile;
    if (!profile || !Number.isFinite(profile.multiplier)) return false;
    const cooldown = profile.action.cd ?? 3;
    if (abilityType === 'secondary' && (!Number.isFinite(cooldown) || cooldown < 0)) return false;
    if(!canUseOkarunAllOutWave17(this.getRpgOkarunSourceActorWave17(actor,profile,side),profile))return false;
    if (isUberProfileWave17(profile) && !findChargedMedicWave17(actor, side === 'enemy' ? this.enemies : this.heroes)) return false;
    return !!profile && canBeginSourceProtectionWave16(actor, profile);
  }

  getSummonState(actorOrId, side = 'player') {
    const actor = this.resolveActor(actorOrId, side);
    const descriptor = actor ? resolveUniverseSummon(actor) : null;
    const context = descriptor ? this.getActionContext(actor, 'summon', side) : null;
    const hasTargets = Boolean(context?.eligibleTargets.length);
    const ready = Boolean(descriptor && !this.targeting && hasTargets && this.canUseAction(actor, 'summon', side));
    return {
      available: Boolean(descriptor), ready,
      actorId: rpgUnitId(actor), side,
      id: descriptor?.id || null, name: descriptor?.name || null,
      entityName: descriptor?.entityName || null,
      actionName: descriptor?.action?.name || null,
      universe: descriptor?.universe || actor?.universe || null,
      kind: descriptor?.kind || null,
      entityAssetId: descriptor?.entityRender?.asset?.id || null,
      used: Boolean(actor?.summonUsed),
      atb: actor?.atb || 0, charge: actor?.specialCharge || 0,
      cost: { atb: 100, charge: 100 },
      assetMissing: descriptor?.entityRender?.assetMissing === true || descriptor?.provenance?.entityAssetMissing === true,
      reason: !descriptor ? 'unavailable' : actor.summonUsed ? 'used'
        : this.disposed || this.gameOver ? 'battle-ended'
          : this.paused ? 'paused' : this.activeSummon ? 'scene-playing'
            : this.targeting ? 'targeting' : actor.currentHp <= 0 ? 'actor-dead'
              : actor.atb < 100 ? 'atb' : actor.specialCharge < 100 ? 'charge'
                : !hasTargets ? 'no-eligible-target' : !ready ? 'busy' : null
    };
  }

  summon(actorOrId, side = 'player') {
    return this.beginTargeting(actorOrId, 'summon', side);
  }

  getSummonSceneState() {
    const scene = this.activeSummon;
    if (!scene) return null;
    const choreography = getSummonChoreographyState(scene, this);
    const entityAnimationFrame = getSummonAnimationFrame(scene, choreography);
    return {
      active: true,
      actorId: rpgUnitId(scene.actor), side: scene.side,
      name: scene.descriptor.name, entityName: scene.descriptor.entityName,
      actionName: scene.profile.name, kind: scene.descriptor.kind,
      universe: scene.descriptor.universe, color: scene.color,
      tick: scene.tick, durationTicks: scene.durationTicks, impactTick: scene.impactTick,
      impacted: scene.impacted,
      phase: choreography?.phase || (scene.tick < scene.impactTick * 0.6 ? 'arrival'
        : scene.tick <= scene.impactTick + 18 ? 'action' : 'departure'),
      targetIds: scene.targets.map(rpgUnitId),
      performerId: scene.descriptor.performer?.id || null,
      entityAssetId: scene.descriptor.entityRender?.asset?.id || null,
      entityAnimationAssetId: entityAnimationFrame?.assetId || null,
      entityAnimationFrame,
      entityFrame: scene.descriptor.entityRender?.asset
        ? choreography ? { index: choreography.poseIndex, phase: ['arrival', 'preparation', 'impact', 'return'][choreography.poseIndex] } : getCombatEntityFrame(scene)
        : null,
      choreography,
      assetMissing: scene.descriptor.entityRender?.assetMissing === true || scene.descriptor.provenance?.entityAssetMissing === true
    };
  }

  getSummonCaption() {
    return this.activeSummon?.caption ?? null;
  }

  isSummonSceneActive() {
    return Boolean(this.activeSummon);
  }

  chooseDefaultTargets(context) {
    const { profile, eligibleTargets } = context;
    if (!profile || !eligibleTargets.length || profile.shape === 'group') return [];
    const sorted = [...eligibleTargets];
    if (profile.effect === 'heal') {
      // Prioritize allies who can actually receive healing. Radiation limits
      // recoverable HP to half of max HP until the status is removed.
      const recoverable = unit => {
        const maxHp = Number.isFinite(unit.maxHp) ? Math.max(0, unit.maxHp) : 0;
        const cap = unit.statusEffects?.radiated > 0 ? maxHp * 0.5 : maxHp;
        return Math.max(0, cap - (Number.isFinite(unit.currentHp) ? unit.currentHp : 0));
      };
      sorted.sort((a, b) => recoverable(b) - recoverable(a));
    }
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
    if (!profile || !this.resolveActor(actor, side)) {
      this.targeting = null;
      return null;
    }
    const damageSource = this.getRpgDamageSource(actor, profile);
    const amount = (actor.stats?.atk ?? actor.atk ?? 8) * profile.multiplier;
    const damageMultiplier = (actor.rpgBuffTicks > 0 ? actor.rpgBuffMultiplier : 1) * getCombatEventDamageMultiplier(actor);
    const estimates = resolved.targets.map(unit => {
      const raam = getRaamBoss(this.raamEncounter, this.enemies);
      if (profile.effect === 'damage' && (isPiratesCurseProtected(this.piratesCurseEncounter, unit, this.enemies)
        || isPiratesCursedHero(this.piratesCurseEncounter, unit, this.heroes))) {
        return { id: rpgUnitId(unit), effect: profile.effect, amount: 0, min: 0, max: 0,
          blockedByAztecCurse: this.piratesCurseEncounter.curseActive,
          blockedBySourceFinale: this.piratesCurseEncounter.sourceShotFired };
      }
      if (profile.effect === 'damage' && unit === raam && isRaamShieldActive(this.raamEncounter, raam)) {
        return { id: rpgUnitId(unit), effect: profile.effect, amount: 0, min: 0, max: 0, blockedByKryll: true };
      }
      let value = amount;
      const coverMultiplier = actor === raam && profile.action.encounterKind === 'troika' && isHeroInRaamLight(unit, this.width)
        ? RAAM_ENCOUNTER_RULES.troikaCoverMultiplier : 1;
      const previewDamage = amount * damageMultiplier * coverMultiplier;
      if (profile.effect === 'damage') value = calculateRpgDamage(unit, previewDamage, 1, true, damageSource);
      else if (profile.effect === 'heal') {
        value = getCombatHealingAmount(unit, profile.healRatio ? unit.maxHp * profile.healRatio : amount);
      } else if (profile.effect === 'revive') value = getRpgReviveHp(unit, profile.reviveRatio);
      else value = 0;
      return { id: rpgUnitId(unit), effect: profile.effect, cleansedStatuses: getRpgCleansableStatuses(unit, profile.cleanses), amount: Math.round(value), min: profile.effect === 'damage' ? calculateRpgDamage(unit, previewDamage, 0.9, true, damageSource) : Math.round(value), max: profile.effect === 'damage' ? calculateRpgDamage(unit, previewDamage, 1.1, true, damageSource) : Math.round(value) };
    });
    return {
      side, actorId: rpgUnitId(actor), actorName: actor.name, abilityType,
      abilityName: profile.name, profile,
      summon: abilityType === 'summon' ? this.getSummonState(actor, side) : null,
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
    const aliases = { attack: 'simple', basic: 'simple', simple: 'simple', strong: 'secondary', heavy: 'secondary', secondary: 'secondary', special: 'special', summon: 'summon', guard: 'defense', defense: 'defense' };
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
    const gained = applyCombatHealing(target, amount);
    if (gained > 0) this.particles.add(target.x, target.y - 20, 0, -1, '#2ecc71', 12, 45, 'text', '+' + gained);
    return gained;
  }

  getRpgDamageSource(actor, profile) {
    const source = profile.summon?.performer;
    if (!source) return actor;
    // Invocation power and its preview use the caller's current combat stats,
    // while the action keeps the partner's identity and archetype.
    return {
      ...source, stats: actor.stats || { atk: actor.atk }, x: actor.x, y: actor.y,
      rpgBuffTicks: actor.rpgBuffTicks, rpgBuffMultiplier: actor.rpgBuffMultiplier
    };
  }

  applyRpgImpact(actor, profile, targets, color, abilityType, commitment = null) {
    if (commitment && !commitment.casterValid()) return;
    const gyroProfileWave17=isJadeGyrodiskProfileWave17(resolveCombatAbility(actor,abilityType));
    if(gyroProfileWave17&&!this.heroes.includes(actor)&&!this.enemies.includes(actor)){actor.rpgGyrodiskActionWave17=null;actor.actionPending=false;return;}
    if (this.disposed || this.gameOver || actor.currentHp <= 0 || actor.rpgControlTicks > 0 || isSourceImmobilizedWave16(actor)) return;
    const source = this.getRpgDamageSource(actor, profile);
    const summon = abilityType === 'summon' && this.activeSummon?.actor === actor ? this.activeSummon : null;
    for (const target of targets) {
      if (commitment && (!commitment.casterValid() || !commitment.accepts(target))) continue;
      if(gyroProfileWave17&&!this.heroes.includes(target)&&!this.enemies.includes(target))continue;
      let sourceBladeContact = null;
      if (!this.heroes.includes(target) && !this.enemies.includes(target)) continue;
      // Actor-centred Typhoon contact rechecks the same accepted target objects
      // at impact. Movement cannot extend its real radius or acquire a victim.
      if (profile.delivery === 'radial' && Math.hypot(target.x - actor.x, target.y - actor.y) > Math.min(profile.range, profile.areaRadius) + .001) continue;
      if(profile.sequenceParent&&getSourceHitSequenceWave16(profile)){
        // RPG selection permits the authored melee approach. Each timed W16
        // contact still uses its actual source range after that approach.
        const physicalRange=Number(profile.action?.targeting?.range);
        if(!Number.isFinite(physicalRange)||physicalRange<=0||Math.hypot(target.x-actor.x,target.y-actor.y)>physicalRange+.001)continue;
        if(profile.sourceHeroId==='kirito_sao'){
          const sequence=getSourceHitSequenceWave16(profile),elapsed=sequence.times[profile.sequenceIndex];
          const blade=projectSourceBladeContactWave16(actor,profile,elapsed,this.getRpgSourceRenderHeightWave16(actor));
          const hurtbox=this.getRpgSourceHurtboxWave16(target),overlap=intersectsSourceBladeHurtboxWave16(blade,hurtbox);
          sourceBladeContact={index:profile.sequenceIndex,targetId:rpgUnitId(target),blade,hurtbox,physicalOverlap:overlap,acceptedDamage:false};
          (profile.sequenceParent.sourceBladeContactsWave16||=[]).push(sourceBladeContact);
          if(!overlap)continue;
        }
      }
      const amount = (actor.stats?.atk ?? actor.atk ?? 8) * profile.multiplier;
      if(actor.rpgGyrodiskActionWave17){const origin=projectJadeGyrodiskOriginWave17(actor,actor.rpgGyrodiskActionWave17,72*this.getDepthScale(actor.y));if(origin){actor.sourceGyrodiskLastReleaseWave17=origin;const dx=target.x-origin.x,dy=target.y-20-origin.y,length=Math.max(1,Math.hypot(dx,dy));this.particles.add(origin.x,origin.y,dx/length*8,dy/length*8,'#b6e9dc',5,Math.max(1,Math.ceil(length/8)),'circle');}}
      if (profile.effect === 'revive') {
        const revivedHp = getRpgReviveHp(target, profile.reviveRatio);
        if (!revivedHp) continue;
        this.cancelActorActions(target);
        target.rpgControlTicks = 0; target.rpgControlSource = null;
        target.currentHp = revivedHp;
        target.state = 'idle';
        target.stateTimer = 0;
        target.atb = 0;
        target.statusEffects = { infected: 0, glitched: 0, radiated: 0 };
        this.returnToFormation(target);
        this.particles.add(target.x, target.y - 20, 0, -1, '#2ecc71', 12, 45, 'text', 'REVIVE');
      } else if (target.currentHp <= 0) continue;
      else if (profile.effect === 'heal') {
        if (isMediGunProfileWave17(profile)) { startMediGunBeamWave17(actor,target,{allied:this.heroes.includes(actor) === this.heroes.includes(target),range:220}); continue; }
        if (isValHealingBurstProfile(profile) && !healingBurstWithinRange(actor, target, profile)) continue;
        const gained = this.applyHealing(target, profile.healRatio ? target.maxHp * profile.healRatio : amount);
        if (gained > 0) recordSummonEffect(summon?.effectContacts, target);
      }
      else if (isJadeInformationProfileWave17(profile)) {revealPhotographicEvidenceWave17(actor,target,profile,{hostile:this.heroes.includes(actor)!==this.heroes.includes(target)});continue;}
      else if (profile.effect === 'buff') {
        target.rpgBuffSource = combatBuffSource(actor, profile, abilityType);
        target.rpgBuffTicks = Math.round(profile.duration * 60);
        target.rpgBuffMultiplier = profile.buffMultiplier;
        this.particles.add(target.x, target.y - 20, 0, -1, color, 12, 45, 'text', 'ATK UP');
      } else if (profile.effect === 'guard') {
        if (isUberProfileWave17(profile)) { activateUberChargeWave17(target, this.heroes.includes(target) ? this.heroes : this.enemies); continue; }
        if (hasSourceProtectionProfileWave16(profile)) {
          armSourceProtectionWave16(actor, profile, target);
          continue;
        }
        target.rpgGuardTicks = Math.round(profile.duration * 60);
        target.rpgGuardReduce = profile.guardReduce;
        if (target.rpgGuardTicks > 0 && target.rpgGuardReduce > 0) recordSummonEffect(summon?.effectContacts, target);
        this.particles.add(target.x, target.y - 20, 0, -1, color, 12, 45, 'text', 'GUARD');
      } else if (profile.effect === 'control') {
        if (isSourceControlProfileWave16(profile)) {
          const opponents = this.heroes.includes(actor) ? this.enemies : this.heroes;
          if (!opponents.includes(target) || Math.hypot(target.x-actor.x,target.y-actor.y)>profile.range+.001) continue;
          if (profile.controlKind === 'possession') {
            // The real chant started at confirmation. An interrupted, released
            // or invalidated channel must never be restarted by its old callback.
            if (!target.sourceControlWave16?.active || target.sourceControlWave16.phase !== 'active' || target.sourceControlWave16.kind !== 'possession'
              || target.sourceControlWave16.sourceRuntimeId !== rpgUnitId(actor)) continue;
          } else {
            const accepted = abilityType === 'summon'
              ? this.beginRpgInvocationControlWave16(actor, target, profile, true)
              : beginSourceControlWave16(actor,target,profile,{hostile:true,channelCompleted:true});
            if (!accepted) continue;
            this.sourceRpgControlTargetsWave16.add(target);
          }
          if (this.targeting?.actor === target) this.targeting = null;
          if (this.enemies.includes(target)) this.enemyActionLock = false;
          this.particles.add(target.x,target.y-20,0,-.4,color,12,45,'text',profile.controlKind==='possession'?'POSSESSION':'PARALYZER');
          continue;
        }
        // Phaselock restrains one accepted enemy. It never grants guard, deals
        // damage, acquires a substitute victim or extends its casting range.
        const opponents = this.heroes.includes(actor) ? this.enemies : this.heroes;
        if (!isPhaselockProfile(profile) || !isPhaselockTargetEligible(target) || target.rpgControlTicks > 0
          || !opponents.includes(target)
          || Math.hypot(target.x - actor.x, target.y - actor.y) > profile.range + .001) continue;
        const interrupted = target.actionPending;
        target.rpgActionVersion = (target.rpgActionVersion || 0) + 1;
        target.actionPending = false;
        target.rpgControlTicks = Math.max(target.rpgControlTicks || 0, Math.round(profile.controlDuration * 60));
        target.rpgControlDurationTicks = target.rpgControlTicks;
        target.rpgControlSource = { kind: 'phaselock', sourceId: rpgUnitId(actor), sourceHeroId: actor.sourceHeroId || actor.sourceId || actor.id };
        target.state = 'hit'; target.stateTimer = 0;
        target.rpgSpecialVisual = null; target.rpgSpecialDurationTicks = 0;
        if (interrupted && this.enemies.includes(target)) {
          this.enemyActionLock = false;
          this.enemyGlobalRecovery = Math.max(this.enemyGlobalRecovery || 0, 12);
        }
        if (this.targeting?.actor === target) this.targeting = null;
        if (actor.rpgSpecialVisual) actor.rpgSpecialVisual.visualConfirmedContact = { confirmed: true, x: target.x, y: target.y };
        this.particles.add(target.x, target.y - 20, 0, -0.4, '#aa80ff', 12, 45, 'text', 'PHASELOCK');
      } else if (profile.effect === 'damage') {
        if (profile.action?.sourceSligRifle) {
          if (!getPossessedSligActionWave16(actor) || Math.hypot(target.x-actor.x,target.y-actor.y)>profile.range+.001
            || !(this.heroes.includes(actor)?this.heroes:this.enemies).includes(target) || target===actor) continue;
          const muzzle=projectSourceSligMuzzleWave16(actor,68*this.getDepthScale(actor.y),2);
          if (!muzzle?.emits) continue;
          const dx=target.x-muzzle.x,dy=target.y-35-muzzle.y,length=Math.max(1,Math.hypot(dx,dy));
          this.particles.add(muzzle.x,muzzle.y,dx/length*8,dy/length*8,'#ffd78c',2,Math.max(8,Math.ceil(length/8)),'laser_line');
          actor.rpgPossessedRifleLastReleaseWave16={...muzzle,targetId:rpgUnitId(target),visualOnly:true};
        }
        const visual = abilityType === 'special' && actor.rpgSpecialVisual;
        const summonVisual = Array.isArray(summon?.visualContacts) ? summon : null;
        const contact = (visual && supportsConfirmedCharacterSuperContact(visual.profile)) || summonVisual || summon?.effectContacts
          ? { hp: target.currentHp, x: target.x, y: target.y } : null;
        let status = profile.action.statusEffect || profile.action.rpgProfile?.statusEffect || null;
        if (abilityType !== 'summon') {
          if (source.name?.includes('Nemesis')) status = 'infected';
          if (!['neo', 'agent_smith'].includes(source.sourceHeroId || source.sourceId || source.id) && source.name?.includes('Smith')) status = 'glitched';
          if (/Deathclaw|Cyberdemon/.test(source.name || '')) status = 'radiated';
        }
        const beforeDamage = target.currentHp;
        if (profile.action.encounterKind !== 'kryll') this.applyDamage(source, target, amount, status, {
          kind: profile.action.encounterKind, nonlethal: profile.nonlethal === true,
          delivery: profile.action?.targeting?.delivery || profile.delivery,
          ...(profile.sequenceParent ? { sequenceParent: profile.sequenceParent, sequenceFraction: profile.sequenceFraction } : {})
        });
        if(sourceBladeContact)sourceBladeContact.acceptedDamage=target.currentHp<beforeDamage;
        if (visual && contact && target.currentHp < contact.hp && !visual.visualConfirmedContact) {
          // Preserve the first accepted hit, even when an earlier area target
          // was dead/protected or this victim is moved/KO'd after impact.
          visual.visualConfirmedContact = { confirmed: true, x: contact.x, y: contact.y,
            ...(profile.delivery === 'radial' ? { origin: { x: actor.x, y: actor.y } } : {}) };
        }
        if (summonVisual && contact && target.currentHp < contact.hp) {
          // W9 native weapon contact follows an accepted hit, at its original
          // location. An item shield, removed victim or later KO creates none.
          summonVisual.visualContacts.push({ id: rpgUnitId(target), x: contact.x, y: contact.y });
        }
        if (contact && target.currentHp < contact.hp) recordSummonEffect(summon?.effectContacts, target, contact);
      }
      if (target.currentHp > 0) cleanseRpgStatuses(target, profile.cleanses);
    }
  }

  advanceRpgControl(actor) {
    if(isBubbleActorImmobilizedWave17(actor))return true;
    if (actor.sourceControlWave16?.active || [...this.heroes,...this.enemies].some(body => body.sourceControlWave16?.active
      && body.sourceControlWave16.kind==='possession' && body.sourceControlWave16.sourceRuntimeId===rpgUnitId(actor))) return true;
    if (!(actor.rpgControlTicks > 0)) return false;
    actor.rpgControlTicks--;
    actor.stateTimer = 0;
    if (actor.rpgControlTicks > 0) actor.state = 'hit';
    else {
      actor.rpgControlSource = null;
      actor.state = actor.currentHp > 0 ? 'idle' : 'dead';
      this.returnToFormation(actor);
    }
    return true;
  }

  executeSummon(context, targets, anchor, commitment) {
    const { actor, side, profile } = context;
    const descriptor = profile.summon;
    if (!descriptor || this.activeSummon) return false;
    const sourceMedicWave17=isUberProfileWave17(profile)?findChargedMedicWave17(actor,side==='enemy'?this.enemies:this.heroes):null;
    if(isUberProfileWave17(profile)&&!sourceMedicWave17)return false;
    if (descriptor.entityRender?.asset?.sheet) preloadSpriteSheetSrcs([descriptor.entityRender.asset.sheet]);
    const nativeAnimation = resolveSummonAnimationAsset(descriptor);
    if (nativeAnimation) preloadSpriteSheetSrcs([nativeAnimation.sheet]);
    const durationTicks = Math.max(30, Math.round((Number(descriptor.duration) || 3) * 60));
    const impactTick = clamp(Math.round((Number(descriptor.impactAt) || 1.5) * 60), 1, durationTicks - 12);
    if (isSourceControlProfileWave16(profile) && profile.controlKind === 'possession'
      && !this.beginRpgInvocationControlWave16(actor, anchor, profile, false)) return false;
    const okarunSourceActorWave17=this.getRpgOkarunSourceActorWave17(actor,profile,side);
    if(!consumeOkarunAllOutWave17(okarunSourceActorWave17,profile))return false;
    if(okarunSourceActorWave17.sourceOkarunResourceOnlyWave17)(this.sourceOkarunSummonUsesWave17||={})[side]=okarunSourceActorWave17.sourceOkarunAllOutUsesWave17;
    actor.atb = 0;
    actor.specialCharge = 0;
    actor.summonUsed = true;
    actor.actionPending = true;
    actor.state = 'special';
    actor.stateTimer = durationTicks;
    this.faceTarget(actor, anchor);
    if (side === 'enemy') {
      this.selectedEnemyId = rpgUnitId(actor);
      this.enemyActionLock = true;
    }
    const color = descriptor.color || profile.action.color || actor.secondaryColor || actor.color || '#39c5bb';
    const choreography = resolveSummonChoreography(descriptor);
    this.activeSummon = { descriptor, actor, side, profile, targets, anchor, commitment, color, choreography, tick: 0, durationTicks, impactTick, impacted: false,
      caption: { kind: descriptor.kind, entityName: descriptor.entityName || descriptor.name, actionName: profile.name },
      ...(choreography?.confirmedEffect ? { effectContacts: [] } : {}),
      ...((usesConfirmedSummonContactWave9(nativeAnimation) || usesConfirmedSummonContactWave10(nativeAnimation) || usesConfirmedSummonContactWave11(nativeAnimation) || usesConfirmedSummonContactWave12(nativeAnimation) || usesConfirmedSummonContactWave13(nativeAnimation) || usesConfirmedSummonContactWave14(nativeAnimation) || usesConfirmedSummonContactWave15(nativeAnimation) || usesConfirmedSummonContactWave16(nativeAnimation) || usesConfirmedSummonContactWave17(nativeAnimation)) ? { visualContacts: [] } : {}) };
    if(sourceMedicWave17)this.activeSummon.sourceMedicWave17=sourceMedicWave17;
    if(profile.action?.targeting?.sourceGoldenLuteWave17===true){
      this.activeSummon.sourceLuteCommitmentWave17 = captureRpgActionCommitment(this, context, side === 'enemy' ? this.heroes : this.enemies);
      const targetCell=sourceCellWave17(anchor),dx=side==='enemy'?-1:1;
      const from={x:targetCell.x-dx*2,y:targetCell.y,z:0},to={x:from.x+dx,y:from.y,z:0};
      const fromWorld={x:anchor.x-dx*128,y:anchor.y};
      this.activeSummon.sourceLuteActorWave17={...descriptor.performer,id:'wave17-lute:'+rpgUnitId(actor),sourceHeroId:descriptor.performer.id,currentHp:1,state:'run',x:fromWorld.x,y:fromWorld.y};
      this.activeSummon.sourceLuteStepWave17={from,to,fromWorld,dx:dx*64,accepted:false};
    }
    this.playSfx(descriptor.kind === 'reinforcement' ? 'confirm' : 'portal');
    return true;
  }

  finishSummon() {
    const scene = this.activeSummon;
    if (!scene) return;
    this.activeSummon = null;
    const { actor, anchor, side } = scene;
    actor.actionPending = false;
    actor.state = actor.currentHp > 0 ? 'idle' : 'dead';
    actor.stateTimer = 0;
    this.returnToFormation(actor, anchor);
    if (side === 'enemy') {
      this.enemyActionLock = false;
      this.enemyGlobalRecovery = actor.isBoss ? 85 : 110;
    }
  }

  advanceSummon() {
    const scene = this.activeSummon;
    if (!scene) return;
    if (this.disposed || this.gameOver || !scene.commitment?.casterValid() || scene.actor.currentHp <= 0
      || (!this.heroes.includes(scene.actor) && !this.enemies.includes(scene.actor))) {
      this.finishSummon();
      return;
    }
    if (!scene.impacted && (!this.heroes.some(unit => unit.currentHp > 0) || !this.enemies.some(unit => unit.currentHp > 0))) {
      this.finishSummon();
      return;
    }
    scene.tick++;
    if(scene.sourceMedicWave17&&!findChargedMedicWave17(scene.actor,scene.side==='enemy'?this.enemies:this.heroes)&&!scene.impacted){this.finishSummon();return;}
    if(scene.sourceLuteActorWave17){const step=scene.sourceLuteStepWave17,body=scene.sourceLuteActorWave17;
      const progress=Math.max(0,Math.min(1,(scene.tick-(scene.impactTick-24))/24));
      body.x=step.fromWorld.x+step.dx*progress;body.y=step.fromWorld.y;
      if(!step.resolved&&progress===1){
        step.resolved=true;
        const actors=[...this.heroes,...this.enemies],opponents=scene.side==='enemy'?this.heroes:this.enemies;
        const occupied=actors.some(unit=>unit.currentHp>0&&[step.from,step.to].some(cell=>sourceCellWave17(unit)?.x===cell.x&&sourceCellWave17(unit)?.y===cell.y));
        step.accepted=!occupied;
        const contacts=resolveGoldenLuteStepWave17(body,step.from,step.to,opponents.filter(unit=>scene.sourceLuteCommitmentWave17.accepts(unit)).map(unit=>({actor:unit,cell:sourceCellWave17(unit),hostile:true})),{accepted:step.accepted,sequence:1});
        step.contacts=contacts.map(({actor:_,...contact})=>contact);
        for(const contact of contacts){const before=contact.actor.currentHp;this.applyDamage(body,contact.actor,(scene.actor.stats?.atk||8)*scene.profile.multiplier,null,{sourceGoldenLuteContactWave17:contact,delivery:'melee'});
          if(contact.actor.currentHp<before)scene.visualContacts.push({id:rpgUnitId(contact.actor),x:contact.actor.x,y:contact.actor.y});}
      }
    }
    const controlled = scene.anchor?.sourceControlWave16;
    if (scene.profile.controlKind === 'possession' && controlled?.active
      && controlled.sourceInvocationWave16?.callerId === rpgUnitId(scene.actor)
      && controlled.phase === 'channeling') {
      // The summoned Abe actually chants during his scene. Once the chant is
      // complete, the ordinary cinematic pause preserves the full command time.
      scene.anchor.sourceControlWave16 = advanceSourceControlWave16(controlled, 1 / 60,
        { sourceAlive: scene.actor.currentHp > 0, targetAlive: scene.anchor.currentHp > 0 });
    }
    if (!scene.impacted && scene.tick >= scene.impactTick) {
      // Mark before impact: repeated update/render calls cannot replay damage.
      scene.impacted = true;
      if (scene.effectContacts) scene.effectRouteTargets = scene.targets.map(target => ({ id: rpgUnitId(target), x: target.x, y: target.y }));
      this.playSfx(scene.profile.effect === 'damage' ? 'special' : 'shield');
      if(!scene.sourceLuteActorWave17)this.applyRpgImpact(scene.actor, scene.profile, scene.targets, scene.color, 'summon', scene.commitment);
      if (!scene.choreography) scene.targets.filter(target => target.currentHp > 0).forEach(target => {
        this.particles.add(target.x, target.y - 20, 0, -0.3, scene.color, 18, 30, 'spark');
      });
    }
    // After a finishing blow, the scene still owns the impact and return.
    // The normal wave/result handling resumes after the performer leaves.
    if (scene.tick >= scene.durationTicks) this.finishSummon();
  }

  canUsePiratesCurseAction(hero = this.getSelectedHero()) {
    return !!getPiratesBarbossa(this.piratesCurseEncounter, this.enemies)
      && !!getPiratesCurseNextCommand(this.piratesCurseEncounter)
      && this.heroes.includes(hero) && !this.disposed && !this.paused && !this.gameOver && !this.targeting && !this.activeSummon
      && hero.currentHp > 0 && hero.state === 'idle' && !hero.actionPending && hero.atb >= 100;
  }

  getPiratesCurseEncounterState() {
    return getPiratesCurseEncounterSnapshot(this.piratesCurseEncounter, this.enemies, this.canUsePiratesCurseAction(), this.heroes);
  }

  triggerPiratesCurseAction(command, heroOrId = this.getSelectedHero()) {
    const hero = this.resolveActor(heroOrId, 'player');
    const encounter = this.piratesCurseEncounter;
    if (!this.canUsePiratesCurseAction(hero) || command !== getPiratesCurseNextCommand(encounter)) return false;
    encounter.commandPending = command;
    encounter.ritualPending = command === 'restore-chest';
    hero.atb = 0;
    hero.state = 'special';
    hero.stateTimer = 30;
    hero.actionPending = true;
    this.playSfx('confirm');
    this.scheduleAction(() => {
      if (!this.gameOver && hero.currentHp > 0) {
        if (command === 'collect-final-coins') {
          encounter.finalCoinsCollected = true;
          bindPiratesJackCurse(encounter, this.heroes);
        }
        else if (command === 'coordinate-will') {
          // These are the source NPCs' payments; the selected hero is only
          // coordinating them. Elizabeth or an arbitrary donor cannot replace Will.
          encounter.willBloodReady = true;
          encounter.jackBloodReady = true;
        } else if (command === 'restore-chest') {
          const boss = getPiratesBarbossa(encounter, this.enemies);
          encounter.sourceShotFired = true;
          this.heroes.forEach(actor => {
            if (isPiratesCursedHero(encounter, actor, this.heroes)) actor.sourceAmmoRemaining = 0;
          });
          this.playSfx('shoot');
          encounter.returnedPieces = PIRATES_CURSE_RULES.totalPieces;
          encounter.curseActive = false;
          // Will drops the paid medallions as Jack fires. No prior crossover
          // hit is stored or retrospectively credited as the final source shot.
          this.scheduleAction(() => {
            if (!this.gameOver && !encounter.curseActive && encounter.returnedPieces === PIRATES_CURSE_RULES.totalPieces
              && boss?.currentHp > 0 && this.enemies.includes(boss)) {
              boss.currentHp = 0;
              boss.state = 'dead';
              boss.stateTimer = 999;
              this.cancelActorActions(boss);
              encounter.sourceShotResolved = true;
              this.playSfx('defeat');
            } else if (!encounter.curseActive && boss?.currentHp === 0) encounter.sourceShotResolved = true;
          }, 16);
          this.particles.add(this.width * 0.45, this.height * 0.51, 0, -0.5, '#efcc76', 12, 80, 'text', 'CURSE LIFTED');
        }
      }
      encounter.commandPending = null;
      encounter.ritualPending = false;
      hero.actionPending = false;
      this.returnToFormation(hero);
    }, PIRATES_CURSE_RULES.commandImpactTicks * 1000 / 60, hero, () => {
      encounter.commandPending = null;
      encounter.ritualPending = false;
    });
    return true;
  }

  canUseRaamEncounterAction(hero = this.getSelectedHero()) {
    return !!getRaamBoss(this.raamEncounter, this.enemies) && this.heroes.includes(hero)
      && !this.disposed && !this.paused && !this.gameOver && !this.targeting && !this.activeSummon
      && hero.currentHp > 0 && hero.state === 'idle' && !hero.actionPending && hero.atb >= 100;
  }

  getRaamEncounterState() {
    return getRaamEncounterSnapshot(this.raamEncounter, getRaamBoss(this.raamEncounter, this.enemies),
      this.heroes, this.width, this.canUseRaamEncounterAction());
  }

  triggerRaamEncounterAction(command, heroOrId = this.getSelectedHero()) {
    const hero = this.resolveActor(heroOrId, 'player');
    if (!this.canUseRaamEncounterAction(hero)) return false;
    const boss = getRaamBoss(this.raamEncounter, this.enemies);
    if (command === 'frag') {
      if (this.raamEncounter.grenadesRemaining <= 0) return false;
      this.raamEncounter.grenadesRemaining--;
      hero.atb = 0;
      hero.state = 'attack';
      hero.stateTimer = 30;
      hero.actionPending = true;
      this.faceTarget(hero, boss);
      this.particles.add(hero.x, hero.y - 25, (boss.x - hero.x) / 18, (boss.y - hero.y) / 18, '#6d7b45', 7, 18, 'spark');
      this.scheduleAction(() => {
        if (!this.gameOver && hero.currentHp > 0 && this.enemies.includes(boss) && boss.currentHp > 0) {
          this.raamEncounter.exposureTicks = RAAM_ENCOUNTER_RULES.grenadeExposureTicks;
          this.applyDamage(hero, boss, RAAM_ENCOUNTER_RULES.grenadeDamage, null, { kind: 'frag' });
          this.particles.add(boss.x, boss.y - 38, 0, -0.5, '#ffcc66', 12, 65, 'text', 'KRYLL DISPERSED');
          this.playSfx('explosion');
        }
        hero.actionPending = false;
        this.returnToFormation(hero, boss);
      }, 300, hero);
      return true;
    }
    if (!['take-light-cover', 'leave-light-cover'].includes(command)) return false;
    const useLight = command === 'take-light-cover';
    if (hero.raamLightCover === useLight) return false;
    hero.raamLightCover = useLight;
    const position = useLight ? getRaamLightPosition(hero, this.width)
      : { x: hero.raamInitialHomeX, y: hero.raamInitialHomeY };
    hero.x = position.x;
    hero.y = position.y;
    this.fitCombatantToArena(hero);
    hero.atb = 0;
    hero.state = 'defense';
    hero.stateTimer = 20;
    this.particles.add(hero.x, hero.y - 30, 0, -0.5, useLight ? '#ffe493' : '#b1b9c4', 10, 45, 'text', useLight ? 'LIT COVER' : 'OPEN');
    return true;
  }

  // GameCanvas pickups/events must route through this gate instead of directly
  // subtracting HP: a crossover explosion does not count as a source frag.
  applyEncounterDamage(target, amount, context = {}) {
    if (isPiratesCursedHero(this.piratesCurseEncounter, target, this.heroes)) return true;
    if (isPiratesCursedCombatant(this.piratesCurseEncounter, target, this.enemies)) {
      if (this.disposed || this.paused || this.gameOver || target.currentHp <= 0 || !Number.isFinite(amount) || amount <= 0) return true;
      if (isPiratesCurseProtected(this.piratesCurseEncounter, target, this.enemies)) {
        this.particles.add(target.x, target.y - 55, 0, -0.5, '#efcc76', 10, 35, 'text', this.piratesCurseEncounter.curseActive ? 'AZTEC CURSE' : 'FINAL SHOT');
      } else if (!context.directDamage) this.applyDamage(context.attacker || null, target, amount, null, context);
      else {
        let damage = context.absorbBattleItemShield ? absorbBattleItemDamage(target, amount) : amount;
        if (context.nonlethal) damage = Math.min(damage, Math.max(0, target.currentHp - 1));
        target.currentHp = Math.max(0, target.currentHp - damage);
        if (target.currentHp <= 0) {
          target.state = 'dead';
          target.stateTimer = 999;
          this.cancelActorActions(target);
          this.playSfx('defeat');
        }
      }
      return true;
    }
    if (!this.raamEncounter || !target || !this.enemies.includes(target) || !target.isBoss
      || (target.canonicalName || target.name) !== 'General RAAM') return false;
    if (this.disposed || this.paused || this.gameOver || target.currentHp <= 0 || !Number.isFinite(amount) || amount <= 0) return true;
    if (!context.directDamage) this.applyDamage(context.attacker || null, target, amount, null, context);
    else if (isRaamShieldActive(this.raamEncounter, target)) {
      this.particles.add(target.x, target.y - 55, 0, -0.5, '#bcc6d0', 10, 35, 'text', 'KRYLL SHIELD');
    } else {
      let damage = context.absorbBattleItemShield ? absorbBattleItemDamage(target, amount) : amount;
      if (context.nonlethal) damage = Math.min(damage, Math.max(0, target.currentHp - 1));
      target.currentHp = Math.max(0, target.currentHp - damage);
      if (target.currentHp <= 0) {
        target.state = 'dead';
        target.stateTimer = 999;
        this.cancelActorActions(target);
        this.playSfx('defeat');
      }
    }
    return true;
  }

  executeRpgAction(context, selectedTargetIds) {
    const { actor, abilityType, side } = context || {};
    if (!this.canUseAction(actor, abilityType, side)) return false;
    // Contexts from AI/previews may outlive another impact. Recompute before
    // spending resources, while still freezing confirmed identities below.
    context = this.getActionContext(actor, abilityType, side);
    const { profile } = context;
    const resolved = resolveRpgTargets({ ...context, selectedTargetIds });
    if (!resolved.valid) return false;
    // Freeze object identities before moving the caster or scheduling impacts.
    // An impact never acquires a new target if one of these actors dies.
    const targets = [...resolved.targets];
    const commitment = captureRpgActionCommitment(this, context, targets);
    const anchor = resolved.anchor;
    if (abilityType === 'summon') return this.executeSummon(context, targets, anchor, commitment);
    if (isMelodyWave17(actor) && (profile.action?.targeting?.sourceGoldenLuteWave17 === true||profile.action?.sourceGoldenLuteWave17===true)) return this.executeRpgGoldenLuteMovementWave17(context, anchor);
    if (actor.sourceMediGunWave17?.connected && !isMediGunProfileWave17(profile)) stopMediGunBeamWave17(actor,'another-command');
    if (profile.controlKind === 'possession') {
      if (!canSourceControlTargetWave16(actor,anchor,profile)
        || !beginSourceControlWave16(actor,anchor,profile,{hostile:true,channelCompleted:false})) return false;
      anchor.sourceControlProfileRpgWave16=profile;
      this.sourceRpgControlTargetsWave16.add(anchor);
    }
    if(!consumeOkarunAllOutWave17(actor,profile))return false;
    const actionVersion = (actor.rpgActionVersion || 0) + 1;
    actor.rpgActionVersion = actionVersion;
    if(profile.controlKind==='possession')actor.sourceRpgPossessionCastWave16={actionVersion,targetId:rpgUnitId(anchor)};
    if (getBlackPearlSourceAmmunition(actor, abilityType)) actor.sourceAmmoRemaining--;
    const encounterKind = profile.action.encounterKind;
    if (encounterKind) {
      this.raamEncounter.attackCount++;
      if (encounterKind === 'kryll') startRaamKryll(this.raamEncounter, anchor);
    }
    if (profile.effect === 'damage') actor.focusTargetId = rpgUnitId(anchor);
    actor.atb = 0;
    if (side === 'enemy') this.selectedEnemyId = rpgUnitId(actor);
    if (abilityType === 'secondary') actor.cooldown = Math.round((profile.action.cd ?? 3) * 60);
    if (abilityType === 'special') actor.specialCharge = 0;
    else actor.specialCharge = Math.min(100, actor.specialCharge + (abilityType === 'secondary' ? 20 : abilityType === 'defense' ? 15 : 12));

    if (abilityType === 'defense') {
      const duration = Math.max(1 / 60, Number(profile.action.dur ?? profile.action.duration ?? profile.duration) || 1.2);
      actor.state = profile.effect === 'guard' ? 'defense' : 'attack';
      actor.stateTimer = Math.max(1, Math.round(duration * 60));
      actor.rpgSpecialDurationTicks = 0;
      actor.rpgSpecialVisual = null;
      if (profile.effect === 'guard') {
        // Damage reduction reads this runtime stance. The catalog action stays
        // untouched, and an old guard value cannot override the authored one.
        actor.defense = { ...profile.action, reduce: profile.guardReduce, dur: duration };
      }
      this.applyRpgImpact(actor, profile, targets, profile.action.color || actor.secondaryColor || actor.color || '#39c5bb', 'defense');
      this.playSfx(profile.effect === 'damage' ? 'slash' : 'shield');
      return true;
    }

    actor.actionPending = true;
    if (side === 'enemy') { this.enemyActionLock = true; this.enemyActionOwner = actor; }
    const sourceId = actor.sourceHeroId || actor.sourceId || actor.id;
    const sourceSupport = profile.effect !== 'damage'
      && (COMBAT_SOURCE_DEFINITIONS_WAVE11[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE12[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE13[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE14[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE15[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE16[sourceId]?.universe === actor.universe
        || COMBAT_SOURCE_DEFINITIONS_WAVE17[sourceId]?.universe === actor.universe);
    actor.state = abilityType === 'special' ? 'special' : sourceSupport ? 'support' : 'attack';
    const authoredTiming = (profile.action?.sourceSligRifle || resolveCombatAbility(actor, abilityType)?.provenance.identityAuthored)
      && Number.isFinite(profile.action.animationDuration) && Number.isFinite(profile.action.hitAt)
      && profile.action.hitAt > 0 && profile.action.hitAt < profile.action.animationDuration;
    const durationTicks = authoredTiming ? Math.max(1, Math.round(profile.action.animationDuration * 60)) : abilityType === 'special' ? 45 : 35;
    const impactDelay = authoredTiming ? profile.action.hitAt * 1000 : profile.delivery === 'melee' ? 200 : 300;
    actor.stateTimer = durationTicks;
    actor.rpgSpecialDurationTicks = abilityType === 'special' ? durationTicks : 0;
    actor.rpgSpecialImpactProgress = abilityType === 'special' ? Math.ceil(impactDelay * 60 / 1000) / durationTicks : 0;
    this.faceTarget(actor, anchor);
    const meleeContact = profile.delivery === 'melee' && profile.effect === 'damage';
    // Edge clearance can force the approach onto the opposite side. Capture
    // the visual direction only after the real placement has resolved it.
    if (meleeContact) this.positionForMelee(actor, anchor);
    const visualProfile = abilityType === 'special' ? resolveCombatAbility(actor, 'special') : null;
    const visualAction = { elapsed: 0, duration: durationTicks / 60, hitAt: Math.ceil(impactDelay * 60 / 1000) / 60, facing: actor.facing };
    if (profile.action?.sourceSligRifle) actor.rpgPossessedRifleActionWave16={...visualAction,elapsedTicks:0,sourceSligRifle:true};
    const jadeGyroIdentityWave17=resolveCombatAbility(actor,abilityType);if(isJadeGyrodiskProfileWave17(jadeGyroIdentityWave17)){actor.rpgGyrodiskActionWave17={...visualAction,identity:jadeGyroIdentityWave17,elapsedTicks:0,actionVersion};(this.sourceRpgGyrodiskActorsWave17||=new Set()).add(actor);}
    actor.rpgSpecialVisual = getCharacterSuperVisualState({ actor, profile: visualProfile, action: visualAction, target: anchor })
      ? { profile: visualProfile, target: { x: anchor.x, y: anchor.y }, facing: actor.facing } : null;
    const color = profile.action.color || actor.secondaryColor || actor.color || '#ff9900';
    const canonEffect = profile.effect === 'damage' ? resolveCanonHeroAttackEffect(actor, profile.action) : null;
    if (encounterKind === 'kryll') {
      this.playSfx('slash');
      for (let index = 0; index < 8; index++) {
        this.particles.add(actor.x, actor.y - 35, (anchor.x - actor.x) / 50, (anchor.y - actor.y) / 50 + (index - 4) * 0.1, '#50545c', 5, 60, 'spark');
      }
      this.particles.add(actor.x, actor.y - 65, 0, -0.5, '#ffd77e', 12, 65, 'text', 'KRYLL AWAY');
    } else if (meleeContact) {
      this.playSfx(canonEffect?.sfx || 'slash');
      if (canonEffect) targets.forEach(target => emitCanonHeroAttackEffect(this.particles, actor, target, profile.action));
    } else {
      this.playSfx(canonEffect?.sfx || (profile.effect === 'damage' ? 'shoot' : 'shield'));
      // Source-curated support actions use their pose and accepted status feedback.
      // A radio order, analysis or protection must not launch a generic laser at an ally.
      if (!actor.rpgGyrodiskActionWave17 && !profile.action?.sourceSligRifle && !actor.rpgSpecialVisual && !sourceSupport && !['radial', 'control'].includes(profile.delivery)) targets.forEach(target => {
        if (!emitCanonHeroAttackEffect(this.particles, actor, target, profile.action)) this.emitTargetedProjectile(actor, target, color);
      });
    }
    if (abilityType === 'special') {
      if (!canonEffect) this.playSfx('special');
      this.particles.add(actor.x, actor.y - 40, 0, -0.4, color, 16, 90, 'text', profile.name.toUpperCase() + '!');
    }

    const sourceSequence = getSourceHitSequenceWave16(profile);
    if (sourceSequence) {
      const sequence = { sourceHeroId: profile.sourceHeroId, actionVersion,
        targetIds: targets.map(rpgUnitId), cancelled: false, releases: [] };
      actor.rpgSourceSequence = sequence;
      if(profile.sourceHeroId==='kirito_sao'){
        const own=this.getRpgSourceHurtboxWave16(actor),other=this.getRpgSourceHurtboxWave16(anchor);
        sequence.sourceBladeApproachWave16={targetId:rpgUnitId(anchor),startX:actor.x,startY:actor.y,facing:actor.facing,
          maxDistance:Math.min(80,Math.max(0,Math.abs(anchor.x-actor.x)-(own.width+other.width)/2-4)),travelled:0,complete:false,cancelled:false};
      }
      actor.rpgLastSourceSequenceWave16=sequence;
      for (const [index, seconds] of sourceSequence.times.entries()) this.scheduleAction(() => {
        if(!this.heroes.includes(actor)&&!this.enemies.includes(actor)){
          sequence.cancelled=true;actor.rpgSourceSequence=null;actor.actionPending=false;
          if(side==='enemy')this.enemyActionLock=false;
          return;
        }
        if (!commitment.casterValid() || sequence.cancelled || this.disposed || this.gameOver || actor.currentHp <= 0
          || actor.rpgActionVersion !== actionVersion || actor.rpgControlTicks > 0) return;
        const accepted = targets.filter(target => commitment.accepts(target) && target.currentHp > 0
          && sequence.targetIds.includes(rpgUnitId(target))
          && (this.heroes.includes(target) || this.enemies.includes(target)));
        sequence.releases.push({ index, seconds, targetIds: accepted.map(rpgUnitId) });
        this.applyRpgImpact(actor, { ...profile, sequenceParent: sequence,
          sequenceFraction: 1 / sourceSequence.hitCount, sequenceIndex: index }, accepted, color, abilityType, commitment);
      }, seconds * 1000, actor);
      this.scheduleAction(() => {
        if (actor.rpgSourceSequence !== sequence || actor.rpgActionVersion !== actionVersion) return;
        actor.rpgSourceSequence = null; actor.actionPending = false;
        this.returnToFormation(actor, anchor);
        if (profile.postSequenceStunDuration > 0 && actor.currentHp > 0) {
          actor.state = 'hit'; actor.stateTimer = Math.max(actor.stateTimer, Math.round(profile.postSequenceStunDuration * 60));
        }
        if (side === 'enemy') { this.enemyActionLock = false; this.enemyGlobalRecovery = actor.isBoss ? 85 : 110; }
        const nextReady = this.heroes.find(unit => unit.currentHp > 0 && unit.atb >= 100 && !unit.actionPending);
        if (nextReady) this.selectedHeroId = nextReady.id;
      }, sourceSequence.duration * 1000, actor);
      return true;
    }

    this.scheduleAction(() => {
      // A Phaselock invalidates a pending cast permanently. Letting its old
      // callback resume after release would create a delayed unearned attack.
      if (actor.rpgActionVersion !== actionVersion || actor.rpgControlTicks > 0) return;
      this.applyRpgImpact(actor, profile, targets, color, abilityType, commitment);
      this.returnToFormation(actor, anchor);
      actor.actionPending = false;
      if (side === 'enemy') {
        this.enemyActionLock = false;
        this.enemyActionOwner = null;
        this.enemyGlobalRecovery = actor.isBoss ? 85 : 110;
      }
      const nextReady = this.heroes.find(unit => unit.currentHp > 0 && unit.atb >= 100 && !unit.actionPending);
      if (nextReady) this.selectedHeroId = nextReady.id;
    }, impactDelay, actor);
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
    if (this.disposed || this.paused || this.gameOver || this.activeSummon || typeof effect !== 'string' || !effect.trim()) return false;
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
            this.applyHealing(h, heal);
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
      case 'iris_invuln': {
        const duration = 240;
        this.heroes.forEach(h => {
          if (h.currentHp > 0) {
            h.state = 'defense';
            h.stateTimer = duration;
          }
        });
        break;
      }
      case 'quad_damage':
      case 'magia_erebea': {
        this.heroes.forEach(hero => grantCombatEventBuff(hero, effect));
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
    return true;
  }
  applyDamage(attacker, defender, baseDmg, statusEffect = null, sourceOptions = {}) {
    if (this.disposed || this.paused || this.gameOver || !defender || !Number.isFinite(defender.currentHp) || defender.currentHp <= 0 || !Number.isFinite(baseDmg) || baseDmg < 0) return 0;
    if (isPiratesCurseProtected(this.piratesCurseEncounter, defender, this.enemies)
      || isPiratesCursedHero(this.piratesCurseEncounter, defender, this.heroes)) {
      this.particles.add(defender.x, defender.y - 55, 0, -0.5, '#efcc76', 10, 35, 'text', this.piratesCurseEncounter.curseActive ? 'AZTEC CURSE' : 'FINAL SHOT');
      return 0;
    }
    const raam = getRaamBoss(this.raamEncounter, this.enemies);
    if (defender === raam && isRaamShieldActive(this.raamEncounter, raam)) {
      this.particles.add(defender.x, defender.y - 55, 0, -0.5, '#bcc6d0', 10, 35, 'text', 'KRYLL SHIELD');
      return 0;
    }
    if (raam && attacker === raam && isHeroInRaamLight(defender, this.width)) {
      if (sourceOptions.kind === 'kryll') return 0;
      if (sourceOptions.kind === 'troika') baseDmg *= RAAM_ENCOUNTER_RULES.troikaCoverMultiplier;
    }
    if(isSourceKittenWave17(attacker))return 0;
    if (isMelodyWave17(attacker) && !sourceOptions.sourceGoldenLuteContactWave17) return 0;
    if (hasStockUberProtectionWave17(defender, [...this.heroes, ...this.enemies], (a,b) => this.heroes.includes(a) === this.heroes.includes(b))) return 0;
    if (sourceDamageImmuneWave16(defender) && interceptSourceProtectionHitWave16(defender, attacker, baseDmg, {
      delivery: sourceOptions.delivery || 'melee', hostile: attacker !== defender,
      onCounter: counter => this.beginRpgSourceCounterWave16(defender, attacker, counter)
    })) return 0;
    
    // Prepare attacker talents. A blocked source hit must not mutate defense.
    let defenseDown = false;
    if (attacker && attacker.talent) {
      if (attacker.talent === 'reality_warp' && Math.random() < 0.20) {
        statusEffect = 'glitched';
      }
      if (attacker.talent === 'incendiary' && Math.random() < 0.25) {
        statusEffect = 'radiated';
      }
      if (attacker.talent === 'suppressing_fire') {
        defenseDown = true;
      }
    }

    const variance = (Math.random() * 0.2) + 0.9;
    const buff = (attacker?.rpgBuffTicks > 0 ? attacker.rpgBuffMultiplier : 1) * getCombatEventDamageMultiplier(attacker);
    const damageTarget = !defenseDown ? defender : defender.stats
      ? { ...defender, stats:{...defender.stats,def:Math.round((defender.stats.def||0)*.8)} }
      : { ...defender, def:Math.round((defender.def||0)*.8) };
    const potentialDmg = calculateRpgDamage(damageTarget, baseDmg * buff, variance, false, attacker);
    const splitDmg = sourceOptions.sequenceParent
      ? allocateSourceSequenceDamageWave16(sourceOptions.sequenceParent, rpgUnitId(defender), potentialDmg,
        potentialDmg * sourceOptions.sequenceFraction) : potentialDmg;
    if(interceptSourceProtectionHitWave16(defender,attacker,previewBattleItemDamage(defender,splitDmg),{
      delivery:sourceOptions.delivery||'melee',hostile:attacker!==defender,
      onCounter:counter=>this.beginRpgSourceCounterWave16(defender,attacker,counter)
    }))return 0;
    if(defenseDown){
      if(defender.stats)defender.stats.def=damageTarget.stats.def;else defender.def=damageTarget.def;
      this.particles.add(defender.x,defender.y-45,0,-1.2,'#3498db',11,50,'text','DEF DOWN');
    }
    const mitigatedDmg = absorbBattleItemDamage(defender, splitDmg);
    const finalDmg = sourceOptions.nonlethal ? Math.min(mitigatedDmg, Math.max(0, defender.currentHp - 1)) : mitigatedDmg;
    const dealtDamage = Math.min(defender.currentHp, finalDmg);

    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);
    if (dealtDamage > 0) noteSourceDamageWave16(defender);
    if(dealtDamage>0&&defender.rpgGyrodiskActionWave17){defender.rpgGyrodiskActionWave17=null;defender.rpgActionVersion=(defender.rpgActionVersion||0)+1;defender.actionPending=false;if(this.enemies.includes(defender))this.enemyActionLock=false;}
    if (dealtDamage > 0 && defender.rpgSourceSequence) {
      defender.rpgSourceSequence.cancelled = true; defender.rpgSourceSequence = null;
      defender.rpgActionVersion = (defender.rpgActionVersion || 0) + 1; defender.actionPending = false;
      if (this.enemies.includes(defender)) { this.enemyActionLock = false; this.enemyGlobalRecovery = Math.max(this.enemyGlobalRecovery, 12); }
    }

    // Nanite lifesteal
    if (attacker && attacker.talent === 'lifedrain' && attacker.currentHp > 0) {
      this.applyHealing(attacker, Math.round(dealtDamage * 0.10));
    }

    if (defender.state !== 'defense') {
      const hitDuration = defender.state === 'hit' ? defender.stateTimer : 0;
      defender.state = 'hit';
      defender.stateTimer = Math.max(hitDuration || 0, 15);
    }

    if (statusEffect && defender.currentHp > 0 && defender.statusEffects) {
      defender.statusEffects[statusEffect] = Math.max(Number(defender.statusEffects[statusEffect]) || 0, 300);
      const label = statusEffect === 'infected' ? 'INFECTED' : statusEffect === 'glitched' ? 'GLITCHED' : 'RADIATED';
      const color = statusEffect === 'infected' ? '#2ecc71' : statusEffect === 'glitched' ? '#00ff00' : '#e67e22';
      this.particles.add(defender.x, defender.y - 35, 0, -1, color, 12, 60, 'text', label);
    }

    this.particles.add(defender.x, defender.y - 20, (Math.random()-0.5)*2, -1.5, defender.isBoss ? '#f1c40f' : '#e74c3c', 14, 45, 'text', `${finalDmg}`);
    for (let i = 0; i < 5; i++) {
      this.particles.add(defender.x, defender.y - 10, (Math.random()-0.5)*5, (Math.random()-0.5)*5, '#ff9900', 4, 25, 'spark');
    }

    if (defender.currentHp <= 0) {
      defender.rpgControlTicks = 0; defender.rpgControlSource = null;
      defender.state = 'dead';
      defender.stateTimer = 999;
      this.cancelActorActions(defender);
      this.playSfx('defeat');
    } else {
      this.playSfx('hit');
    }
    return dealtDamage;
  }

  beginRpgSourceCounterWave16(actor, target, counter) {
    const actors = [...this.heroes, ...this.enemies];
    if (!actors.includes(actor) || !actors.includes(target) || actor.currentHp <= 0 || target.currentHp <= 0
      || this.heroes.includes(actor) === this.heroes.includes(target)) return false;
    const commitment = captureRpgActionCommitment(this, this.getActionContext(actor, 'special', this.heroes.includes(actor) ? 'player' : 'enemy'), [target]);
    const version = (actor.rpgActionVersion || 0) + 1;
    actor.rpgActionVersion = version; actor.actionPending = true;
    const profile = { ...resolveCombatAbility(actor, 'special'), counterTriggered: true,
      effect: 'damage', delivery: 'melee', targetSide: 'enemy', multiplier: counter.multiplier || 4.8 };
    const direction = Math.sign(target.x - actor.x) || actor.facing || 1;
    const distance = Math.min(140, Math.max(0, Math.abs(target.x - actor.x) - 48));
    actor.facing = direction; actor.state = 'special'; actor.stateTimer = 48;
    actor.rpgSpecialDurationTicks = 48; actor.rpgSpecialImpactProgress = .35 / .8;
    actor.rpgSpecialVisual = { profile, target: { x: target.x, y: target.y }, facing: direction };
    // A projectile catch grants no lock on its owner. Only this bounded dash
    // advances Hakumen; the attacker can move, die or leave contact before .35s.
    for (let step = 1; step <= 6; step++) this.scheduleAction(() => {
      if (!commitment.casterValid() || actor.currentHp <= 0 || actor.rpgActionVersion !== version || this.gameOver) return;
      actor.x = clamp(actor.x + direction * distance / 6, 16, this.width - 16);
    }, step * 40);
    this.scheduleAction(() => {
      if (!commitment.casterValid() || !commitment.accepts(target) || actor.currentHp <= 0 || target.currentHp <= 0 || actor.rpgActionVersion !== version || this.gameOver
        || ![...this.heroes,...this.enemies].includes(actor) || ![...this.heroes,...this.enemies].includes(target)
        || Math.hypot(target.x - actor.x, target.y - actor.y) > 190) return;
      const before = target.currentHp;
      this.applyDamage(actor, target, (actor.stats?.atk ?? actor.atk ?? 8) * profile.multiplier, null, { delivery: 'melee' });
      if (target.currentHp < before && actor.rpgSpecialVisual) actor.rpgSpecialVisual.visualConfirmedContact = {
        confirmed: true, x: target.x, y: target.y
      };
    }, 350);
    this.scheduleAction(() => {
      if (actor.rpgActionVersion !== version) return;
      actor.actionPending = false; this.returnToFormation(actor);
      if (this.enemies.includes(actor)) { this.enemyActionLock = false; this.enemyGlobalRecovery = 12; }
    }, 800);
    return true;
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
      clearSourceCombatStatusesWave16([...new Set([...this.heroes,...this.enemies,...this.sourceRpgControlTargetsWave16])],'battle-over');
      this.sourceRpgControlTargetsWave16.clear();
      this.finishSummon();
      this.actionQueue = [];
      this.targeting = null;
      this.victoryTimer++;
      if (this.victoryTimer > 120 && !this.completionReported) {
        this.completionReported = true;
        const alive = this.heroes.some(h => h.currentHp > 0);
        this.onComplete(alive ? 'victory' : 'defeat');
      }
      return;
    }

    // Repair only coin-bound source Jack before delayed callbacks inspect HP.
    repairPiratesCursedHeroes(this.piratesCurseEncounter, this.heroes);
    if(!this.activeSummon)this.advanceRpgGoldenLuteMovementWave17();
    advanceSourceMechanicsWave17(this, [this.heroes, this.enemies], this.activeSummon ? 0 : 1 / 60, {});
    const gyroWorldWave17=[...this.heroes,...this.enemies];
    for(const unit of this.sourceRpgGyrodiskActorsWave17||[]){const action=unit.rpgGyrodiskActionWave17;
      if(!gyroWorldWave17.includes(unit)){unit.rpgGyrodiskActionWave17=null;unit.rpgActionVersion=(unit.rpgActionVersion||0)+1;unit.actionPending=false;this.sourceRpgGyrodiskActorsWave17.delete(unit);continue;}
      if(!action){this.sourceRpgGyrodiskActorsWave17.delete(unit);continue;}if(this.activeSummon)continue;
      action.elapsed=++action.elapsedTicks/60;
      if(action.elapsed>=action.duration||unit.currentHp<=0||unit.rpgActionVersion!==action.actionVersion||isSourceImmobilizedWave16(unit)){unit.rpgGyrodiskActionWave17=null;this.sourceRpgGyrodiskActorsWave17.delete(unit);}
    }
    const currentSourceActors=[...this.heroes,...this.enemies];
    const sourceActors=[...new Set([...currentSourceActors,...this.sourceRpgControlTargetsWave16])];
    const priorControls=new Map(sourceActors.map(actor=>[actor,actor.sourceControlWave16]));
    for(const target of sourceActors){
      const state=target.sourceControlWave16,profile=target.sourceControlProfileRpgWave16;
      if(!state?.active)continue;
      if(!currentSourceActors.includes(target)){
        target.sourceControlWave16=advanceSourceControlWave16(state,0,{released:true});continue;
      }
      const owner=currentSourceActors.find(actor=>rpgUnitId(actor)===state.sourceRuntimeId);
      if(state.sourceInvocationWave16){
        const source=owner&&this.getRpgInvocationControlSourceWave16(owner,profile),contract=state.sourceInvocationWave16;
        if(!owner||owner.currentHp<=0||!source||contract.callerId!==rpgUnitId(owner)
          ||contract.callerHeroId!==(owner.sourceHeroId||owner.sourceId||owner.id)
          ||contract.performerId!==source.sourceHeroId||contract.universe!==source.universe
          ||contract.actionName!==profile.name||contract.kind!==profile.controlKind){
          target.sourceControlWave16=advanceSourceControlWave16(state,0,{released:true});continue;
        }
      }
      if(state.kind!=='possession'||!profile)continue;
      if(!owner||owner.rpgControlTicks>0||isSourceImmobilizedWave16(owner)||this.heroes.includes(owner)===this.heroes.includes(target)
        ||Math.hypot(owner.x-target.x,owner.y-target.y)>profile.range+.001
        ||target.sourceEnemyId!=='oddworld_slig'||target.species!=='slig'||target.possessionEligible!==true){
        target.sourceControlWave16=advanceSourceControlWave16(state,0,{released:true});
      }
    }
    advanceSourceCombatStatusesWave16(sourceActors, 1 / 60, { paused: !!this.activeSummon });
    for(const actor of sourceActors){
      const old=priorControls.get(actor),state=actor.sourceControlWave16;
      if(old?.active&&state&&!state.active){
        if(old.kind==='possession'&&this.targeting?.actor===actor)this.targeting=null;
        this.sourceRpgControlTargetsWave16.delete(actor);
        actor.rpgPossessedRifleActionWave16=null;actor.sourceControlProfileRpgWave16=null;
        actor.rpgActionVersion=(actor.rpgActionVersion||0)+1;actor.actionPending=false;
        if(actor.currentHp>0)actor.state='idle';
        const owner=sourceActors.find(unit=>rpgUnitId(unit)===old.sourceRuntimeId);
        if(owner?.sourceRpgPossessionCastWave16){
          owner.rpgActionVersion=(owner.rpgActionVersion||0)+1;owner.actionPending=false;
          owner.sourceRpgPossessionCastWave16=null;owner.rpgSpecialVisual=null;
          if(owner.currentHp>0)owner.state='idle';
          if(this.enemies.includes(owner))this.enemyActionLock=false;
        }
      }
      if(actor.rpgPossessedRifleActionWave16){
        actor.rpgPossessedRifleActionWave16.elapsedTicks++;
        actor.rpgPossessedRifleActionWave16.elapsed=actor.rpgPossessedRifleActionWave16.elapsedTicks/60;
        if(actor.rpgPossessedRifleActionWave16.elapsed>=actor.rpgPossessedRifleActionWave16.duration)actor.rpgPossessedRifleActionWave16=null;
      }
    }

    // The arrival, impact and return all use simulation ticks. Pause, a hidden
    // tab and a target selector freeze the same clock, with no wall-time task.
    if (this.activeSummon) {
      this.advanceSummon();
      return;
    }

    this.advanceRpgSourceBladeApproachWave16();
    this.advanceActions();
    [...this.heroes, ...this.enemies].forEach(tickCombatEventBuffs);
    // Repair legacy/event HP writes before wave/victory checks. A body falling
    // during the curse or the source finale is not a mortal crew death. The
    // one resolved source shot is the explicit exception for Barbossa.
    if (this.piratesCurseEncounter?.curseActive || this.piratesCurseEncounter?.sourceShotFired) {
      const sourceBoss = getPiratesBarbossa(this.piratesCurseEncounter, this.enemies);
      this.enemies.forEach(enemy => {
        if (isPiratesCursedCombatant(this.piratesCurseEncounter, enemy, this.enemies) && enemy.currentHp <= 0
          && !(enemy === sourceBoss && this.piratesCurseEncounter.sourceShotResolved)) {
          enemy.currentHp = enemy.maxHp;
          enemy.state = 'idle';
          enemy.stateTimer = 0;
        }
      });
    }
    const raam = getRaamBoss(this.raamEncounter, this.enemies);
    if (raam) {
      const swarmTarget = tickRaamEncounter(this.raamEncounter, this.heroes);
      if (swarmTarget) this.applyDamage(raam, swarmTarget, raam.atk * RAAM_ENCOUNTER_RULES.swarmDamageMultiplier, null, { kind: 'kryll' });
    }

    if (this.isFinalBoss) {
      this.finalBossChaosTimer++;
      if (this.finalBossChaosTimer >= 480) { // 8 seconds
        this.finalBossChaosTimer = 0;
        this.triggerFinalBossRandomEvent();
      }
    }

    const heroesAlive = this.heroes.some(h => h.currentHp > 0);
    const piratesBoss = getPiratesBarbossa(this.piratesCurseEncounter, this.enemies);
    const piratesDuelComplete = !!this.piratesCurseEncounter && !this.piratesCurseEncounter.curseActive
      && this.piratesCurseEncounter.returnedPieces === PIRATES_CURSE_RULES.totalPieces
      && this.piratesCurseEncounter.willBloodReady && this.piratesCurseEncounter.jackBloodReady
      && this.piratesCurseEncounter.sourceShotResolved && piratesBoss?.currentHp === 0;
    // The source duel ends with Barbossa's death. The remaining crew become
    // mortal; they are not an additional kill quota or falsely killed here.
    const enemiesAlive = this.piratesCurseEncounter ? !piratesDuelComplete : this.enemies.some(e => e.currentHp > 0);

    if (!heroesAlive) {
      this.gameOver = true;
      this.clearPendingActions();
      this.targeting = null;
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
        this.clearPendingActions();
        this.targeting = null;
        this.victoryTimer = 0;
        this.playSfx('victory');
      }
      return;
    }

    // Update heroes (ATB and status effects)
    this.heroes.forEach(h => {
      if (h.currentHp <= 0) return;
      const controlled = this.advanceRpgControl(h);

      if (h.cooldown > 0) h.cooldown--;
      if (h.rpgBuffTicks > 0) h.rpgBuffTicks--;
      if (h.rpgBuffSource && !h.rpgBuffTicks) h.rpgBuffSource = null;
      if (h.rpgGuardTicks > 0) h.rpgGuardTicks--;
      if (h.stateTimer > 0) {
        h.stateTimer--;
        if (h.stateTimer === 0) h.state = 'idle';
      }

      // Infection DoT
      if (h.statusEffects?.infected > 0) {
        h.statusEffects.infected--;
        if (h.statusEffects.infected % 60 === 0 && !sourceDamageImmuneWave16(h)) {
          if (!isPiratesCursedHero(this.piratesCurseEncounter, h, this.heroes)) h.currentHp = Math.max(1, h.currentHp - 3);
          this.particles.add(h.x, h.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      // Glitched (ATB charge rate halved)
      let atbRate = h.stats.spd * getCombatEventSpeedMultiplier(h) * 0.05 + 0.15;
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

      if (!controlled && h.state === 'idle' && !h.actionPending) {
        if (h.atb < 100) {
          h.atb = Math.min(100, h.atb + atbRate);
        }
        if (this.autoBattle && h.atb >= 100 && !h.actionPending) {
          if (this.piratesCurseEncounter?.curseActive) {
            const command = getPiratesCurseNextCommand(this.piratesCurseEncounter);
            if (command) this.triggerPiratesCurseAction(command, h);
            // Hold a ready turn until the current source-assistant step lands.
          } else if (raam && !h.raamLightCover) this.triggerRaamEncounterAction('take-light-cover', h);
          else if (raam && isRaamShieldActive(this.raamEncounter, raam)) {
            if (this.raamEncounter.grenadesRemaining > 0) this.triggerRaamEncounterAction('frag', h);
            // Hold ATB for the next actual swarm attack if ammunition is empty.
          } else ['summon', 'special', 'secondary', 'simple'].some(type => this.triggerAbility(h, type));
        }
        if (!h.actionPending) this.faceTarget(h, this.getFacingTarget(h));
      }
      if(h.sourceControlWave16?.active&&h.sourceControlWave16.kind==='possession'&&h.sourceControlWave16.phase==='active'
        &&h.state==='idle'&&!h.actionPending)h.atb=Math.min(100,h.atb+atbRate);
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
      const controlled = this.advanceRpgControl(e);
      if (e.stateTimer > 0) {
        e.stateTimer--;
        if (e.stateTimer === 0) {
          e.state = 'idle';
          if (!e.actionPending) this.returnToFormation(e);
        }
      }
      if (e.cooldown > 0) e.cooldown--;
      if (e.rpgBuffTicks > 0) e.rpgBuffTicks--;
      if (e.rpgBuffSource && !e.rpgBuffTicks) e.rpgBuffSource = null;
      if (e.rpgGuardTicks > 0) e.rpgGuardTicks--;

      // Infection DoT
      if (e.statusEffects?.infected > 0) {
        e.statusEffects.infected--;
        if (e.statusEffects.infected % 60 === 0 && !sourceDamageImmuneWave16(e)) {
          if ((e !== raam || !isRaamShieldActive(this.raamEncounter, raam))
            && !isPiratesCurseProtected(this.piratesCurseEncounter, e, this.enemies)) e.currentHp = Math.max(1, e.currentHp - 3);
          this.particles.add(e.x, e.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      // Glitched (ATB charge rate halved)
      let atbRate = (e.spd || e.atk || 8) * getCombatEventSpeedMultiplier(e) * 0.035 + 0.08;
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

      if (!controlled && !this.enemyActionLock && this.enemyGlobalRecovery <= 0 && e.state === 'idle' && e.atb < 100) {
        e.atb = Math.min(100, e.atb + atbRate);
      }
      if(e.sourceControlWave16?.active&&e.sourceControlWave16.kind==='possession'&&e.sourceControlWave16.phase==='active'
        &&e.state==='idle'&&!e.actionPending)e.atb=Math.min(100,e.atb+atbRate);

      if (!controlled && e.state === 'idle' && !e.actionPending) this.faceTarget(e, this.getFacingTarget(e));
      if (!controlled && this.opponentControl === 'cpu' && !this.enemyActionLock && this.enemyGlobalRecovery <= 0 && e.atb >= 100 && e.state === 'idle') {
        const abilityTypes = e === raam
          ? [this.raamEncounter.attackCount % 2 === 1 && this.raamEncounter.swarmTicks <= 0 ? 'secondary' : 'simple']
          : ['summon', 'special', 'secondary', 'simple'];
        for (const abilityType of abilityTypes) {
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

  getRpgPresentationActor(actor) {
    actor=getSourceRuntimeViewWave16(actor);
    if(actor.sourceHeldPossessionViewWave16)return actor;
    const luteMove = actor.sourceRpgLuteMoveWave17;
    if (isMelodyWave17(actor) && luteMove && actor.actionPending && actor.state === 'run' && actor.currentHp > 0) {
      return { ...actor, animationClockSource: actor.animationClockSource || actor,
        presentationPhase: 'super', presentationProgress: clamp(luteMove.tick / luteMove.duration, 0, 1),
        presentationImpactProgress: .5 };
    }
    if(actor.sourceProtectionEntityWave16?.active&&actor.sourceProtectionEntityWave16.absorbedOnce
      &&(actor.sourceHeroId||actor.sourceId||actor.id)==='cuphead_ms_chalice')return actor;
    if (actor.state !== 'special' || this.activeSummon || !(actor.rpgSpecialDurationTicks > 0)) return actor;
    const duration = actor.rpgSpecialDurationTicks;
    return {
      ...actor,
      animationClockSource: actor.animationClockSource || actor,
      presentationPhase: 'super',
      // A decisive hit freezes simulation before the actor's next timer tick.
      // Show its grounded recovery pose instead of a frozen pre-impact leap;
      // pending actions, damage and the simulation clock remain stopped.
      presentationProgress: this.gameOver ? 1 : clamp((duration - Math.max(0, actor.stateTimer || 0)) / duration, 0, 1),
      presentationImpactProgress: actor.rpgSpecialImpactProgress || 0.5
    };
  }

  drawRpgCharacterSuperEffects(ctx) {
    if (this.activeSummon) return;
    [...this.heroes, ...this.enemies].forEach(actor => {
      if (actor.currentHp <= 0 || actor.state !== 'special' || !actor.rpgSpecialVisual || !(actor.rpgSpecialDurationTicks > 0)) return;
      const view = this.getRpgPresentationActor(actor);
      const visual = actor.rpgSpecialVisual;
      const action = {
        elapsed: view.presentationProgress * actor.rpgSpecialDurationTicks / 60,
        duration: actor.rpgSpecialDurationTicks / 60,
        hitAt: actor.rpgSpecialImpactProgress * actor.rpgSpecialDurationTicks / 60,
        facing: visual.facing
      };
      ctx.save();
      ctx.globalAlpha = Math.sin(Math.PI * view.presentationProgress) * 0.8;
      const contactVisual = supportsConfirmedCharacterSuperContact(visual.profile)
        ? visual.visualConfirmedContact || { confirmed: false } : null;
      drawCharacterSuperVisuals(ctx, getCharacterSuperVisualState({ actor, profile: visual.profile, action, target: visual.target, contactVisual, height: 72 * this.getDepthScale(actor.y) }));
      ctx.restore();
    });
  }

  drawRpgControl(ctx, actor, height, lift) {
    if (!(actor.rpgControlTicks > 0) || actor.currentHp <= 0) return false;
    // Lift only the presentation: formation coordinates, depth and casting
    // distances retain their physical ground position throughout the hold.
    return drawCombatControl(ctx, { ...actor, y: actor.y - lift, combatControl: {
      kind: 'phaselock', remaining: actor.rpgControlTicks / 60,
      duration: actor.rpgControlDurationTicks / 60
    } }, height);
  }

  drawRpgHero(ctx, h, animTime) {
    if(this.activeSummon?.sourceMedicWave17===h)return;
    const scale = this.getDepthScale(h.y);
    const lift = h.rpgControlTicks > 0 ? 16 * scale : 0;
    if(h.sourceEnemyId==='oddworld_slig'&&h.universe==='Oddworld')drawPixelEnemy(ctx,h.x,h.y-lift,this.getRpgPresentationActor(h),animTime,h.facing,68*scale);
    else drawPixelSprite(ctx, h.x, h.y - lift, this.getRpgPresentationActor(h), animTime, h.facing, 72 * scale, 'rpg');
    this.drawRpgControl(ctx, h, 72 * scale, lift);
    drawSourceCombatStatusWave16(ctx, h, 72 * scale);

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
    if(this.activeSummon?.sourceMedicWave17===e)return;
    const scale = this.getDepthScale(e.y);
    const lift = e.rpgControlTicks > 0 ? 16 * scale : 0;
    const heroSpriteActor = resolveCombatHeroSpriteActor(e);
    if (heroSpriteActor) {
      heroSpriteActor.animationClockSource = e;
      drawPixelSprite(ctx, e.x, e.y - lift, this.getRpgPresentationActor(heroSpriteActor), animTime, e.facing, 72 * scale, 'rpg');
    } else if (e.isBoss) {
      drawBoss(ctx, e.x, e.y - lift, this.getRpgPresentationActor(e), animTime, e.facing);
    } else {
      drawPixelEnemy(ctx, e.x, e.y - lift, this.getRpgPresentationActor(e), animTime, e.facing, 68 * scale);
    }
    this.drawRpgControl(ctx, e, (heroSpriteActor ? 72 : 68) * scale, lift);
    drawSourceCombatStatusWave16(ctx, e, (heroSpriteActor ? 72 : 68) * scale);

    if (e.currentHp > 0) {
      if (isPiratesCurseProtected(this.piratesCurseEncounter, e, this.enemies)) {
        ctx.save();
        ctx.fillStyle = '#efcc76';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(this.piratesCurseEncounter.curseActive ? 'CURSED' : 'FINAL SHOT', e.x, e.y - this.getCombatantBounds(e).height - 15);
        ctx.restore();
      }
      if (e === getRaamBoss(this.raamEncounter, this.enemies)) {
        ctx.save();
        const shielded = isRaamShieldActive(this.raamEncounter, e);
        if (shielded) {
          ctx.fillStyle = '#404651';
          for (let index = 0; index < 12; index++) {
            const angle = animTime * 0.04 + index * Math.PI / 6;
            const x = e.x + Math.cos(angle) * 44;
            const y = e.y - 52 + Math.sin(angle) * 37;
            ctx.beginPath();
            ctx.moveTo(x - 6, y - 3);
            ctx.lineTo(x, y + 3);
            ctx.lineTo(x + 6, y - 3);
            ctx.fill();
          }
        }
        ctx.fillStyle = shielded ? '#d0d6df' : '#ffdc83';
        ctx.font = '9px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(shielded ? 'KRYLL SHIELD' : 'EXPOSED', e.x, e.y - e.renderHeight - 15);
        ctx.restore();
      }
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

  drawSummonScene(ctx, lang = 'fr', showCaption = true) {
    const scene = this.activeSummon;
    if (!scene) return;
    const { descriptor, tick, durationTicks, impactTick, color } = scene;
    const choreography = getSummonChoreographyState(scene, this);
    const arrivalTicks = choreography?.arrivalEndTick || Math.max(1, Math.round(impactTick * 0.6));
    const exitStart = choreography?.returnStartTick || Math.min(durationTicks - 12, impactTick + 18);
    const arrival = clamp(tick / arrivalTicks, 0, 1);
    const departure = clamp((tick - exitStart) / Math.max(1, durationTicks - exitStart), 0, 1);
    const side = scene.side === 'enemy' ? -1 : 1;
    const centerX = this.width * (side > 0 ? 0.42 : 0.58);
    const entranceX = side > 0 ? -90 : this.width + 90;
    const x = choreography?.performer.x ?? entranceX + (centerX - entranceX) * (1 - (1 - arrival) ** 3) + side * departure * this.width * 0.7;
    const y = choreography?.performer.y ?? clamp(scene.actor.homeY, this.height * 0.68, this.height * 0.85);
    const alpha = choreography?.performer.alpha ?? Math.min(arrival * 2, 1) * (1 - departure);
    ctx.save();
    ctx.fillStyle = 'rgba(3,8,18,0.70)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 42, this.width, 2);
    ctx.fillRect(0, this.height - 40, this.width, 2);
    if (showCaption) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px "Press Start 2P"';
      const commandLabel = descriptor.kind === 'reinforcement'
        ? (lang === 'fr' ? 'RENFORT' : 'REINFORCEMENT') : (lang === 'fr' ? 'INVOCATION' : 'SUMMON');
      ctx.fillText(`${commandLabel} · ${descriptor.entityName || descriptor.name}`, this.width / 2, 26, this.width - 24);
      ctx.fillStyle = color;
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(scene.profile.name, this.width / 2, this.height - 17, this.width - 24);
    }

    const nativeAsset = resolveSummonAnimationAsset(descriptor);
    const nativeFrame = getSummonAnimationFrame(scene, choreography);
    const effectChoreography = projectNativeSummonEffectOriginWave17(projectNativeSummonEffectOriginWave16(choreography, nativeAsset, nativeFrame),nativeAsset,nativeFrame);
    const nativeMegaflare = nativeAsset?.id === 'ff7-bahamut-megaflare';
    let nativeDrawn = false;
    let entityDrawn = false;
    drawSummonChoreographyEffects(ctx, effectChoreography, 'behind', { nativeMegaflare });
    ctx.save();
    ctx.globalAlpha = alpha;
    const performer = descriptor.performer;
    const entityAsset = descriptor.entityRender?.asset;
    const drawRosterPerformer = () => drawPixelSprite(ctx, x, y, {
      ...performer,
      state: tick < arrivalTicks || departure > 0 ? 'run' : 'special',
      stateTimer: Math.max(0, impactTick - tick),
      facing: side
    }, tick, side, Math.min(132, this.height * 0.32), 'rpg');
    if (entityAsset || nativeAsset) {
      const size = choreography?.performer.size || Math.min(228, this.height * 0.5);
      const frameIndex = choreography?.poseIndex ?? getCombatEntityFrame(scene).index;
      ctx.save();
      ctx.translate(x, y);
      if (choreography?.performer.rotation) ctx.rotate(choreography.performer.rotation);
      const nativeBaseline = Number(nativeAsset?.normalization?.baseline) || 244;
      nativeDrawn = nativeFrame && drawCosmeticAtlasFrame(ctx, { ...nativeAsset, row: nativeFrame.row, frames: 4 }, nativeFrame.col,
        0, size / 2 - nativeBaseline / nativeAsset.frameHeight * size, size * nativeAsset.frameWidth / nativeAsset.frameHeight, size,
        { facing: side, glowColor: color, glowBlur: nativeAsset?.sheet?.startsWith('/sprites/generated/summon-animations-wave17/') ? 0 : 8, redrawWhenReady: false });
      if (!nativeDrawn && entityAsset) entityDrawn = drawCosmeticAtlasFrame(ctx, entityAsset, frameIndex,
        0, -size / 2, size, size,
        { facing: side, glowColor: color, glowBlur: 8, redrawWhenReady: false });
      ctx.restore();
    }
    if (!nativeDrawn && !entityDrawn && performer && !entityAsset
      && (nativeAsset ? descriptor.performerRole === 'reinforcement' : descriptor.performerRole !== 'caller')) {
      // Use the existing partner identity and its registered sprite renderer.
      drawRosterPerformer();
    } else if (!nativeDrawn && !entityDrawn) {
      // A missing or pending atlas uses the existing abstract manifestation.
      // Only an explicitly roster-backed performer may draw a character body.
      const style = descriptor.entityRender?.style || 'energy';
      const pulse = 1 + Math.sin(tick * 0.16) * 0.12;
      ctx.translate(x, y - 58);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 4;
      if (style === 'ice') {
        for (let index = 0; index < 6; index++) {
          const angle = Math.PI * index / 3;
          const cx = Math.cos(angle) * 28 * pulse;
          const cy = Math.sin(angle) * 28 * pulse;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 28); ctx.lineTo(cx + 11, cy); ctx.lineTo(cx, cy + 22); ctx.lineTo(cx - 11, cy); ctx.closePath();
          ctx.stroke();
        }
      } else if (style === 'fire') {
        for (let index = 0; index < 5; index++) {
          const fx = (index - 2) * 18;
          const height = (45 + Math.sin(tick * 0.2 + index) * 15) * pulse;
          ctx.beginPath();
          ctx.moveTo(fx - 14, 32); ctx.quadraticCurveTo(fx - 22, -8, fx + 5, -height);
          ctx.quadraticCurveTo(fx + 6, -10, fx + 16, 32); ctx.closePath(); ctx.fill();
        }
      } else {
        for (let index = 0; index < 3; index++) {
          ctx.beginPath(); ctx.ellipse(0, 0, (26 + index * 13) * pulse, 50 - index * 9, tick * 0.025 + index, 0, Math.PI * 2); ctx.stroke();
        }
      }
    }
    ctx.restore();
    if(nativeDrawn&&scene.sourceMedicWave17&&nativeFrame?.phase==='attack'&&scene.sourceMedicWave17.sourceMediGunWave17?.connected){
      // The existing ally remains the channel owner. Its native RPG nozzle,
      // measured in this exact attack cell, connects to the actual patient.
      const patient=scene.actor,origin=effectChoreography.origin;
      ctx.save();ctx.strokeStyle=scene.sourceMedicWave17.sourceMediGunWave17.uberRemaining>0?'#ffb57c':'#e85245';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(patient.x,patient.y-72*this.getDepthScale(patient.y)*.38);ctx.stroke();ctx.restore();
    }
    drawSummonChoreographyEffects(ctx, effectChoreography, 'front', { nativeMegaflare: nativeMegaflare && !!nativeDrawn });
    ctx.restore();
  }

  draw(ctx, animTime, lang = 'fr', { showSummonCaption = true } = {}) {
    drawPhotographicEvidenceWave17(ctx,[...this.heroes,...this.enemies]);
    drawBubbleCapturesWave17(ctx,[...this.heroes,...this.enemies]);
    drawMediGunBeamsWave17(ctx,[...this.heroes,...this.enemies],{height:unit=>72*this.getDepthScale(unit.y),exclude:this.activeSummon?.sourceMedicWave17});
    if (this.piratesCurseEncounter) {
      // This is an objective marker, not a source-faithful rendered prop.
      const x = this.width * 0.45;
      const y = this.height * 0.51;
      ctx.save();
      ctx.fillStyle = '#685542';
      ctx.fillRect(x - 18, y - 10, 36, 19);
      ctx.strokeStyle = '#efcc76';
      ctx.strokeRect(x - 18, y - 10, 36, 19);
      ctx.fillStyle = '#efcc76';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(`AZTEC ${this.piratesCurseEncounter.returnedPieces}/${PIRATES_CURSE_RULES.totalPieces}`, x, y - 18);
      ctx.restore();
    }
    if (getRaamBoss(this.raamEncounter, this.enemies)) {
      ctx.save();
      this.heroes.filter(hero => hero.currentHp > 0).forEach(hero => {
        const light = getRaamLightPosition(hero, this.width);
        ctx.fillStyle = 'rgba(255,226,130,0.22)';
        ctx.strokeStyle = '#ffe08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(light.x, light.y - 4, Math.max(18, this.width * 0.055), 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
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

    this.drawRpgCharacterSuperEffects(ctx);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(`WAVE: ${this.wave}/${this.maxWaves}`, 20, 22);
    this.drawSummonScene(ctx, lang, showSummonCaption);
  }
}
