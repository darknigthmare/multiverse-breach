import { drawCosmeticAtlasFrame, drawPixelSprite } from './renderer';
import { combatBuffSource } from './combat/characterFormState';
import { drawCharacterSuperVisuals, getCharacterSuperVisualState } from './combat/characterSuperVisuals';
import { supportsTrackedCharacterSuperVisual } from './combat/characterSuperVisuals';
import { supportsConfirmedCharacterSuperContact } from './combat/characterSuperVisuals.js';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import { drawRecentUniverseTextureCover } from './recentUniverseTextureAssets';
import { resolveFighterTagEntry } from './fighterTagPlacement.js';
import { resolveMeleeSuper, resolveCombatAbility, resolveCombatPresentation } from './combatIdentity.js';
import { resolvePresentationScript, samplePresentationScript, sampleCatastropheMotion, getCatastropheBeamGeometry } from './combat/presentationCatalog.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const faceOpponent = (fighter, target) => {
  const dx = target?.x - fighter?.x;
  if (Number.isFinite(dx) && dx !== 0) fighter.facing = Math.sign(dx);
};
const rgba = (hex, alpha) => {
  const value = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex.slice(1) : '39c5bb';
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
};

const DIFFICULTY = {
  training: { reaction: 0.42, aggression: 0.48, guardChance: 0.24, damage: 0.9 },
  standard: { reaction: 0.27, aggression: 0.67, guardChance: 0.42, damage: 1 },
  expert: { reaction: 0.16, aggression: 0.82, guardChance: 0.62, damage: 1.12 }
};

const FIGHTER_COSMETIC_KEYS = Object.freeze([
  'npcAssist',
  'koEffect',
  'introPose',
  'victoryPose'
]);

const isRecord = value => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const pickFighterCosmetics = (source = {}) => Object.fromEntries(
  FIGHTER_COSMETIC_KEYS.map(key => [key, isRecord(source?.[key]) ? source[key] : null])
);

// A flat loadout applies fairly to both camps. Advanced callers can provide
// { player, opponent }, { player, cpu }, or { player, p2 } to override a side.
export const resolveFighterCosmetics = (cosmetics = {}) => {
  const source = isRecord(cosmetics) ? cosmetics : {};
  const playerSource = isRecord(source.player) ? source.player : source;
  const opponentKey = ['opponent', 'cpu', 'p2'].find(
    key => Object.prototype.hasOwnProperty.call(source, key)
  );
  const opponentSource = opponentKey
    ? (isRecord(source[opponentKey]) ? source[opponentKey] : {})
    : playerSource;
  return {
    player: pickFighterCosmetics(playerSource),
    cpu: pickFighterCosmetics(opponentSource)
  };
};

const getCosmeticName = (entry, fallback = '') => (
  entry?.name?.fr
  || entry?.name?.en
  || entry?.name
  || fallback
);

const finiteOr = (value, fallback) => (
  Number.isFinite(Number(value)) ? Number(value) : fallback
);

const isRangedHero = (hero) => /gun|rifle|shotgun|card|magic|staff|bow|laser|ray|bullet|projectile|microphone|blaster/i.test([
  hero.weaponType,
  hero.simple?.type,
  hero.secondary?.type
].filter(Boolean).join(' '));

const createFighter = (hero, side, index, width, groundY) => {
  const stats = hero.stats || { hp: 120, atk: 12, def: 8, spd: 6 };
  const maxHp = Math.round(clamp(150 + stats.hp * 0.8, 220, 430));
  return {
    ...hero,
    runtimeId: `${side}-${index}-${hero.id}`,
    side,
    index,
    x: side === 'player' ? width * 0.27 : width * 0.73,
    y: groundY,
    vx: 0,
    vy: 0,
    facing: side === 'player' ? 1 : -1,
    state: 'idle',
    maxHp,
    currentHp: maxHp,
    meter: 0,
    guard: 100,
    guarding: false,
    crouching: false,
    hitstun: 0,
    guardBreak: 0,
    invulnerable: 0,
    action: null,
    comboStep: 0,
    comboWindow: 0,
    lastHitAt: -10,
    koDelay: 0,
    superBuffSeconds: 0,
    superBuffMultiplier: 1,
    superGuardSeconds: 0,
    superGuardReduce: 0,
    abilityCooldowns: { simple: 0, secondary: 0, defense: 0 },
    guardReduction: 0.8,
    ranged: isRangedHero(hero),
    moveSpeed: clamp(180 + stats.spd * 7, 205, 290),
    attackPower: clamp(8 + stats.atk * 0.78, 15, 36),
    defensePower: clamp(stats.def || 7, 4, 28)
  };
};

export class EngineFighter {
  constructor(width, height, playerHeroes, cpuHeroes, particles, playSfx, onComplete, options = {}) {
    this.width = width;
    this.height = height;
    this.groundY = Math.round(height * 0.82);
    this.universe = options.universe || 'Nexus de Convergence';
    this.levelProfile = options.levelProfile || getRecentUniverseLevelProfile(this.universe);
    this.opponentControl = options.opponentControl === 'p2' ? 'p2' : 'cpu';
    this.fieldSuper = options.fieldSupers?.player || options.fieldSuper || null;
    this.opponentFieldSuper = options.fieldSupers?.opponent || options.opponentFieldSuper || null;
    this.cosmetics = resolveFighterCosmetics(options.cosmetics);
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    this.difficultyId = DIFFICULTY[options.difficulty] ? options.difficulty : 'standard';
    this.difficulty = DIFFICULTY[this.difficultyId];
    this.teams = {
      player: {
        fighters: playerHeroes.slice(0, 3).map((hero, index) => createFighter(hero, 'player', index, width, this.groundY)),
        activeIndex: 0,
        tagCooldown: 0
      },
      cpu: {
        fighters: cpuHeroes.slice(0, 3).map((hero, index) => createFighter(hero, 'cpu', index, width, this.groundY)),
        activeIndex: 0,
        tagCooldown: 0
      }
    };
    this.inputs = { player: {}, cpu: {} };
    this.playerInput = this.inputs.player;
    this.projectiles = [];
    this.projectileVisualImpacts = [];
    this.elapsed = 0;
    this.timer = 99;
    this.countdown = 3.2;
    this.roundNumber = 1;
    this.roundsToWin = clamp(Math.floor(finiteOr(options.roundsToWin, 2)), 1, 3);
    this.roundWins = { player: 0, cpu: 0 };
    this.roundHistory = [];
    this.roundTransition = null;
    this.presentationQueue = [];
    this.presentation = null;
    this.combatDuration = 0;
    this.disposed = false;
    this.finished = false;
    this.completionReported = false;
    this.completionDelay = 0;
    this.result = null;
    this.announcement = 'PREPARE';
    this.announcementTimer = 1.2;
    this.hitStop = 0;
    this.aiThink = 0;
    this.aiMove = 0;
    this.aiGuardTimer = 0;
    this.fieldSuperCharge = this.fieldSuper ? 20 : 0;
    this.fieldSuperUsed = false;
    this.opponentFieldSuperCharge = this.opponentFieldSuper ? 20 : 0;
    this.opponentFieldSuperUsed = false;
    this.fieldSuperFlash = 0;
    this.fieldSuperFlashColor = this.fieldSuper?.color || '#ffea00';
    this.assists = {
      player: {
        assist: this.cosmetics.player.npcAssist,
        charge: this.cosmetics.player.npcAssist ? 40 : 0,
        used: false
      },
      cpu: {
        assist: this.cosmetics.cpu.npcAssist,
        charge: this.cosmetics.cpu.npcAssist ? 40 : 0,
        used: false
      }
    };
    const introDurationMs = Math.max(
      finiteOr(
        this.cosmetics.player.introPose?.animation?.durationMs,
        this.cosmetics.player.introPose ? 1500 : 0
      ),
      finiteOr(
        this.cosmetics.cpu.introPose?.animation?.durationMs,
        this.cosmetics.cpu.introPose ? 1500 : 0
      )
    );
    this.introPoseDuration = introDurationMs > 0
      ? clamp(introDurationMs / 1000, 1, 2.8)
      : 0;
    this.introPoseTimer = this.introPoseDuration;
    this.characterIntros = ['player', 'cpu'].map(side => {
      const fighter = this.getActive(side);
      const identity = resolveCombatPresentation(fighter, 'intro');
      return { side, identity, script: identity.presentationScript || resolvePresentationScript(fighter, 'intro') };
    });
    this.characterIntroDuration = Math.max(...this.characterIntros.map(entry => entry.identity.duration), this.introPoseDuration, 0.8);
    this.countdown += this.characterIntroDuration;
    this.assistEvent = null;
    this.koEffectEvent = null;
    this.victoryPoseEvent = null;
    this.winnerSide = null;
    this.stats = {
      player: { damage: 0, taken: 0, kos: 0, tags: 0, maxCombo: 0, currentCombo: 0, comboTimer: 0 },
      cpu: { damage: 0, taken: 0, kos: 0, tags: 0, maxCombo: 0, currentCombo: 0, comboTimer: 0 }
    };
  }

  setInput(input = {}) {
    this.setSideInput('player', input);
  }

  setSideInput(side, input = {}) {
    const resolvedSide = side === 'cpu' || side === 'opponent' ? 'cpu' : 'player';
    this.inputs[resolvedSide] = input || {};
    if (resolvedSide === 'player') this.playerInput = this.inputs.player;
  }

  getTeam(side) {
    return this.teams[side];
  }

  getActive(side) {
    const team = this.getTeam(side);
    return team.fighters[team.activeIndex] || team.fighters[0];
  }

  getOpponent(side) {
    return this.getActive(side === 'player' ? 'cpu' : 'player');
  }

  triggerPlayerAction(action, index = null) {
    return this.triggerSideAction('player', action, index);
  }

  triggerSideAction(side, action, index = null) {
    const resolvedSide = side === 'cpu' || side === 'opponent' ? 'cpu' : 'player';
    if (resolvedSide === 'cpu' && this.opponentControl !== 'p2') return false;
    if (action === 'tag') return this.requestTag(resolvedSide, index);
    if (action === 'jump') return this.tryJump(this.getActive(resolvedSide));
    return this.tryAction(resolvedSide, action);
  }

  getFieldSuperState(side) {
    if (side === 'cpu' || side === 'opponent') {
      return {
        super: this.opponentFieldSuper,
        charge: this.opponentFieldSuperCharge,
        used: this.opponentFieldSuperUsed
      };
    }
    return {
      super: this.fieldSuper,
      charge: this.fieldSuperCharge,
      used: this.fieldSuperUsed
    };
  }

  setFieldSuperState(side, { charge, used }) {
    if (side === 'cpu' || side === 'opponent') {
      if (charge !== undefined) this.opponentFieldSuperCharge = charge;
      if (used !== undefined) this.opponentFieldSuperUsed = used;
      return;
    }
    if (charge !== undefined) this.fieldSuperCharge = charge;
    if (used !== undefined) this.fieldSuperUsed = used;
  }

  triggerFieldSuper(side = 'player') {
    const resolvedSide = side === 'cpu' || side === 'opponent' ? 'cpu' : 'player';
    if (resolvedSide === 'cpu' && this.opponentControl !== 'p2') return false;
    const state = this.getFieldSuperState(resolvedSide);
    const attacker = this.getActive(resolvedSide);
    const target = this.getOpponent(resolvedSide);
    if (
      !state.super
      || state.used
      || state.charge < 100
      || !this.canAct(attacker)
      || !target
      || target.currentHp <= 0
    ) return false;

    const effect = state.super.effect || {};
    faceOpponent(attacker, target);
    this.setFieldSuperState(resolvedSide, { used: true, charge: 0 });
    this.fieldSuperFlash = 1.25;
    this.fieldSuperFlashColor = state.super.color || '#ffea00';
    this.announcement = state.super.name?.fr
      || state.super.name?.en
      || 'SUPER DE TERRAIN';
    this.announcementTimer = 1.45;
    this.playSfx('portal');
    this.playSfx('special');
    this.spawnBurst(this.width / 2, this.groundY - 90, state.super.color || '#ffea00', 42);

    this.getTeam(resolvedSide).fighters.forEach(fighter => {
      if (fighter.currentHp <= 0) return;
      fighter.currentHp = Math.min(
        fighter.maxHp,
        fighter.currentHp + fighter.maxHp * (effect.healRatio || 0)
      );
      fighter.invulnerable = Math.max(fighter.invulnerable, 0.42);
    });

    this.applyHit(attacker, target, {
      type: 'super',
      base: effect.damage || 36,
      guardDamage: effect.guardDamage || 70,
      knockback: effect.knockback || 360
    });
    return true;
  }

  getCosmetics(side) {
    return side === 'cpu' || side === 'opponent'
      ? this.cosmetics.cpu
      : this.cosmetics.player;
  }

  getAssistState(side) {
    return side === 'cpu' || side === 'opponent'
      ? this.assists.cpu
      : this.assists.player;
  }

  triggerNpcAssist(side = 'player') {
    return this.triggerAssist(side);
  }

  triggerAssist(side = 'player') {
    const resolvedSide = side === 'cpu' || side === 'opponent' ? 'cpu' : 'player';
    if (resolvedSide === 'cpu' && this.opponentControl !== 'p2') return false;
    return this.activateAssist(resolvedSide);
  }

  activateAssist(side) {
    const state = this.getAssistState(side);
    const attacker = this.getActive(side);
    const target = this.getOpponent(side);
    if (
      !state.assist
      || state.used
      || state.charge < 100
      || !this.canAct(attacker)
      || !target
      || target.currentHp <= 0
      || target.invulnerable > 0
    ) return false;

    const effect = state.assist.effect || {};
    const color = state.assist.color || attacker.secondaryColor || '#39c5bb';
    const healRatio = clamp(finiteOr(effect.healRatio, 0.04), 0, 0.08);
    faceOpponent(attacker, target);
    state.used = true;
    state.charge = 0;
    attacker.guarding = false;
    attacker.state = 'attack';
    attacker.action = {
      type: 'assist',
      duration: 0.46,
      hitAt: 0,
      base: 0,
      range: this.width,
      guardDamage: 0,
      knockback: 0,
      elapsed: 0,
      resolved: true
    };
    this.assistEvent = {
      side,
      assist: state.assist,
      x: target.x,
      y: target.y - 58,
      duration: 1.05,
      remaining: 1.05
    };
    this.announcement = getCosmeticName(state.assist, 'ASSIST A.R.C.A.');
    this.announcementTimer = 1.15;
    this.playSfx('portal');
    this.playSfx('special');
    this.spawnBurst(target.x, target.y - 58, color, 24);

    this.getTeam(side).fighters.forEach(fighter => {
      if (fighter.currentHp <= 0) return;
      fighter.currentHp = Math.min(
        fighter.maxHp,
        fighter.currentHp + fighter.maxHp * healRatio
      );
    });

    this.applyHit(attacker, target, {
      type: 'assist',
      base: clamp(finiteOr(effect.damage, 14), 8, 24),
      guardDamage: clamp(finiteOr(effect.guardDamage, 22), 10, 36),
      knockback: 175,
      ignoreDifficulty: true
    });
    return true;
  }

  triggerKoCosmetic(side, x, y) {
    const effect = this.getCosmetics(side).koEffect;
    if (!effect) return;
    const duration = clamp(
      finiteOr(effect.visual?.durationMs, 900) / 1000,
      0.55,
      1.8
    );
    this.koEffectEvent = {
      side,
      effect,
      x,
      y,
      duration,
      remaining: duration
    };
    this.spawnBurst(x, y, effect.color || '#ffea00', 30);
  }

  tryJump(fighter) {
    if (!this.canAct(fighter) || fighter.y < this.groundY - 2) return false;
    fighter.vy = -470;
    fighter.state = 'run';
    this.playSfx('jump');
    return true;
  }

  canAct(fighter) {
    return Boolean(
      fighter
      && fighter.currentHp > 0
      && !fighter.action
      && fighter.hitstun <= 0
      && fighter.guardBreak <= 0
      && !this.finished
      && !this.disposed
      && !this.roundTransition
      && !this.presentation
      && this.countdown <= 0
    );
  }

  tryAction(side, type) {
    const fighter = this.getActive(side);
    if (!this.canAct(fighter)) return false;

    const specs = {
      light: { duration: 0.28, hitAt: 0.11, base: 9.5, range: 78, guardDamage: 9, knockback: 105 },
      heavy: { duration: 0.5, hitAt: 0.23, base: 17, range: 96, guardDamage: 19, knockback: 205 },
      special: { duration: 0.64, hitAt: 0.28, base: 23, range: fighter.ranged ? 430 : 132, guardDamage: 24, knockback: 245, meterCost: 30 },
      super: this.getPersonalSuperSpec(fighter)
    };
    const spec = this.getAuthoredActionSpec(fighter, type, specs[type]) || specs[type];
    if (!spec || fighter.meter < (spec.meterCost || 0) || (spec.cooldownSlot && fighter.abilityCooldowns[spec.cooldownSlot] > 0)) return false;
    // Input may arrive between physics frames after the fighters crossed.
    // Aim once on commitment; an ongoing swing never turns to track a dodge.
    faceOpponent(fighter, this.getOpponent(side));

    if (type === 'light' && (!spec.effect || spec.effect === 'damage')) {
      fighter.comboStep = fighter.comboWindow > 0 ? (fighter.comboStep % 3) + 1 : 1;
      fighter.comboWindow = 0.68;
      spec.base += (fighter.comboStep - 1) * 2.2;
      spec.knockback += (fighter.comboStep - 1) * 28;
    } else {
      fighter.comboStep = 0;
      fighter.comboWindow = 0;
    }

    fighter.meter = Math.max(0, fighter.meter - (spec.meterCost || 0));
    if (spec.cooldownSlot) fighter.abilityCooldowns[spec.cooldownSlot] = spec.cooldown;
    fighter.guarding = false;
    fighter.state = spec.effect && spec.effect !== 'damage' ? 'support' : 'attack';
    fighter.action = { ...spec, type, facing: fighter.facing, elapsed: 0, resolved: false };
    if (type === 'super' && ['lunafreya_ff15', 'rebecca_chambers'].includes(spec.identity?.sourceHeroId)) {
      const allies = this.getSupportSuperTargets(fighter, fighter.action);
      const target = [...allies].sort((a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp)[0];
      fighter.action.visualSupportTargetId = target?.id || fighter.id;
    }
    if (type === 'super' && spec.delivery === 'projectile'
      && ['sazh_ff13', 'prompto_ff15', 'irvine_ff8'].includes(spec.identity?.sourceHeroId)) {
      const opponent = this.getOpponent(side);
      fighter.action.visualAimDistance = Math.min(spec.range,
        Math.max(58, ((opponent?.x ?? fighter.x + fighter.facing * spec.range) - fighter.x) * fighter.facing));
    }
    this.playSfx(spec.effect && spec.effect !== 'damage' ? 'signal' : type === 'light' ? 'slash' : type === 'heavy' ? 'hit' : 'special');
    if (spec.authoredAbility) {
      this.announcement = spec.identity.name;
      this.announcementTimer = 0.8;
    }
    if (type === 'super') {
      this.announcement = spec.identity.name;
      this.announcementTimer = 1.1;
      this.spawnBurst(fighter.x, fighter.y - 60, fighter.secondaryColor || fighter.primaryColor || '#ffea00', 28);
    }
    return true;
  }

  getAuthoredActionSpec(fighter, type, fallback) {
    const slot = type === 'light' ? 'simple' : type === 'heavy' || type === 'special' ? 'secondary' : type === 'defense' ? 'defense' : null;
    if (!slot) return null;
    const identity = resolveCombatAbility(fighter, slot);
    if (!identity?.provenance.identityAuthored) return null;
    const cooldown = Math.max(0, finiteOr(identity.sourceAbility.cd, identity.effect === 'damage' ? 0 : Math.max(0.8, identity.effectDuration)));
    return {
      ...(fallback || { guardDamage: 0, knockback: 0, meterCost: 0 }),
      identity,
      authoredAbility: true,
      duration: identity.duration,
      hitAt: identity.hitAt,
      base: identity.effect === 'damage' ? (fallback?.base || 9.5) * identity.multiplier : 0,
      range: identity.range,
      delivery: identity.delivery,
      effect: identity.effect,
      color: identity.color,
      healRatio: identity.healRatio,
      guardReduce: identity.guardReduce,
      buffMultiplier: identity.buffMultiplier,
      reviveRatio: identity.reviveRatio,
      cleanses: identity.cleanses,
      effectDuration: identity.effectDuration,
      targetSide: identity.targetSide,
      excludeSelf: identity.excludeSelf,
      shape: identity.shape,
      maxTargets: identity.maxTargets,
      cooldownSlot: slot,
      cooldown
    };
  }

  updateGuarding(side, requested, grounded) {
    const fighter = this.getActive(side);
    if (!fighter) return false;
    const profile = resolveCombatAbility(fighter, 'defense');
    const authored = profile?.provenance.identityAuthored;
    fighter.guardReduction = authored ? clamp(profile.guardReduce, 0, 0.95) : 0.8;
    const canGuard = requested && grounded && this.canAct(fighter);
    if (authored && !(profile.effect === 'guard' && profile.targetSide === 'self')) {
      fighter.guarding = false;
      if (canGuard && profile.effect !== 'damage') this.tryAction(side, 'defense');
      return false;
    }
    fighter.guarding = Boolean(canGuard);
    return fighter.guarding;
  }

  getPersonalSuperSpec(fighter) {
    const identity = resolveMeleeSuper(fighter);
    if (!identity) return null;
    return {
      identity,
      duration: identity.duration,
      hitAt: identity.hitAt,
      base: 23 * identity.multiplier,
      range: identity.range,
      guardDamage: 42,
      knockback: 330,
      meterCost: identity.meterCost,
      delivery: identity.delivery,
      effect: identity.effect,
      color: identity.color,
      healRatio: identity.healRatio,
      guardReduce: identity.guardReduce,
      buffMultiplier: identity.buffMultiplier,
      reviveRatio: identity.reviveRatio,
      cleanses: identity.cleanses,
      effectDuration: identity.effectDuration,
      targetSide: identity.targetSide,
      excludeSelf: identity.excludeSelf,
      shape: identity.shape,
      maxTargets: identity.maxTargets
    };
  }

  requestTag(side, index, forced = false) {
    const team = this.getTeam(side);
    const active = this.getActive(side);
    const opponent = this.getOpponent(side);
    const nextIndex = Number(index);
    const next = team.fighters[nextIndex];
    if (
      !next
      || nextIndex === team.activeIndex
      || next.currentHp <= 0
      || (!forced && (team.tagCooldown > 0 || !this.canAct(active)))
    ) return false;

    active.action = null;
    active.guarding = false;
    if (active.currentHp > 0) active.state = 'idle';
    // Le remplacant entre derriere son partenaire par rapport a l'adversaire.
    // Une direction fixe par camp le faisait parfois apparaitre face au bord
    // de l'ecran apres un croisement des deux combattants.
    const tagEntry = resolveFighterTagEntry({
      activeX: active.x,
      opponentX: opponent?.x,
      side,
      width: this.width
    });
    next.x = tagEntry.x;
    next.y = this.groundY;
    next.vx = tagEntry.vx;
    next.vy = -90;
    next.facing = tagEntry.facing;
    next.state = 'run';
    next.invulnerable = forced ? 0.75 : 0.48;
    team.activeIndex = nextIndex;
    team.tagCooldown = forced ? 1.5 : 5.5;
    this.stats[side].tags += forced ? 0 : 1;
    this.announcement = forced ? 'NEXT SIGNATURE' : 'RESONANCE TAG';
    this.announcementTimer = 0.75;
    this.playSfx('portal');
    this.spawnBurst(next.x, next.y - 44, next.secondaryColor || '#39c5bb', 20);
    return true;
  }

  spawnBurst(x, y, color, count = 12) {
    for (let index = 0; index < count; index++) {
      const angle = (Math.PI * 2 * index) / count;
      const speed = 1.4 + (index % 4) * 0.45;
      this.particles.add(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4 + (index % 3), 28, 'spark');
    }
  }

  update(dt) {
    const step = clamp(dt || 0, 0, 0.034);
    if (this.completionReported || this.disposed) return;
    this.elapsed += step;
    this.updateCosmeticTimers(step);

    if (this.finished) {
      if (this.presentation) {
        this.updatePresentation(step);
        return;
      }
      this.completionDelay -= step;
      if (this.completionDelay <= 0 && !this.completionReported) {
        this.completionReported = true;
        this.onComplete(this.result, this.getSummary());
      }
      return;
    }

    if (this.roundTransition) {
      this.updatePresentation(step);
      if (!this.presentation) this.resetForNextRound();
      return;
    }

    if (this.countdown > 0) {
      const wasIntro = this.countdown > 3.2;
      const before = Math.ceil(this.countdown);
      this.countdown = Math.max(0, this.countdown - step);
      const after = Math.ceil(this.countdown);
      if (!wasIntro && after !== before) this.playSfx(after > 0 ? 'click' : 'special');
      if (this.countdown === 0) {
        this.announcement = 'IMPACT';
        this.announcementTimer = 0.9;
      }
      if (!wasIntro) this.updatePassive(step);
      return;
    }

    if (this.hitStop > 0) {
      this.hitStop -= step;
      return;
    }

    this.timer = Math.max(0, this.timer - step);
    this.combatDuration += step;
    if (this.timer <= 0) {
      this.finishByTime();
      return;
    }

    this.updatePassive(step);
    this.updatePlayer(step);
    if (this.opponentControl === 'p2') this.updateControlledSide('cpu', step);
    else this.updateAi(step);
    this.updateActions(step);
    this.updateProjectiles(step);
    this.resolveSpacing();
    this.resolveKnockouts(step);
  }

  updateCosmeticTimers(dt) {
    this.introPoseTimer = Math.max(0, this.introPoseTimer - dt);
    ['assistEvent', 'koEffectEvent', 'victoryPoseEvent'].forEach(eventKey => {
      const event = this[eventKey];
      if (!event) return;
      event.remaining = Math.max(0, event.remaining - dt);
      if (event.remaining <= 0 && eventKey !== 'victoryPoseEvent') {
        this[eventKey] = null;
      }
    });
  }

  updatePassive(dt) {
    if (this.announcementTimer > 0) this.announcementTimer -= dt;
    if (this.fieldSuperFlash > 0) this.fieldSuperFlash = Math.max(0, this.fieldSuperFlash - dt);
    if (this.countdown <= 0) {
      ['player', 'cpu'].forEach(side => {
        const state = this.getFieldSuperState(side);
        if (!state.super || state.used) return;
        this.setFieldSuperState(side, {
          charge: clamp(state.charge + dt * 1.8, 0, 100)
        });
      });
      ['player', 'cpu'].forEach(side => {
        const state = this.getAssistState(side);
        if (!state.assist || state.used) return;
        state.charge = clamp(state.charge + dt * 2.4, 0, 100);
      });
    }
    Object.entries(this.teams).forEach(([side, team]) => {
      team.tagCooldown = Math.max(0, team.tagCooldown - dt);
      team.fighters.forEach((fighter, index) => {
        fighter.hitstun = Math.max(0, fighter.hitstun - dt);
        fighter.guardBreak = Math.max(0, fighter.guardBreak - dt);
        fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
        fighter.comboWindow = Math.max(0, fighter.comboWindow - dt);
        fighter.superBuffSeconds = Math.max(0, (fighter.superBuffSeconds || 0) - dt);
        if (fighter.superBuffSource && fighter.superBuffSeconds === 0) fighter.superBuffSource = null;
        fighter.superGuardSeconds = Math.max(0, (fighter.superGuardSeconds || 0) - dt);
        Object.keys(fighter.abilityCooldowns).forEach(slot => {
          fighter.abilityCooldowns[slot] = Math.max(0, fighter.abilityCooldowns[slot] - dt);
        });
        if (fighter.currentHp > 0 && index !== team.activeIndex) {
          fighter.currentHp = Math.min(fighter.maxHp, fighter.currentHp + fighter.maxHp * 0.0045 * dt);
          fighter.guard = Math.min(100, fighter.guard + 18 * dt);
        } else if (!fighter.guarding) {
          fighter.guard = Math.min(100, fighter.guard + 10 * dt);
        }
        if (fighter.guardBreak > 0 || fighter.hitstun > 0) fighter.state = 'hit';
        if (fighter.currentHp <= 0) fighter.state = 'dead';
        if (fighter.action) return;
        if (fighter.currentHp > 0 && fighter.hitstun <= 0 && fighter.guardBreak <= 0 && !fighter.guarding && Math.abs(fighter.vx) < 5 && fighter.y >= this.groundY - 1) {
          fighter.state = 'idle';
        }
        if (side === 'cpu' && index !== team.activeIndex) fighter.facing = -1;
      });
    });
    Object.values(this.stats).forEach(stat => {
      stat.comboTimer = Math.max(0, stat.comboTimer - dt);
      if (stat.comboTimer === 0) stat.currentCombo = 0;
    });
  }

  updatePlayer(dt) {
    this.updateControlledSide('player', dt);
  }

  updateControlledSide(side, dt) {
    const fighter = this.getActive(side);
    const target = this.getOpponent(side);
    const input = this.inputs[side] || {};
    if (!fighter || fighter.currentHp <= 0) return;
    const grounded = fighter.y >= this.groundY - 2;
    const canInput = this.canAct(fighter);
    if (canInput) faceOpponent(fighter, target);
    const guard = this.updateGuarding(side, Boolean(input.guard), grounded);
    const crouch = Boolean(input.down) && canInput && grounded && !guard;
    fighter.crouching = crouch;
    if (guard) {
      fighter.state = 'defense';
      fighter.vx = lerp(fighter.vx, 0, clamp(dt * 16, 0, 1));
      return;
    }
    if (crouch) {
      fighter.state = 'defense';
      fighter.vx = lerp(fighter.vx, 0, clamp(dt * 18, 0, 1));
      return;
    }
    const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.moveFighter(fighter, target, direction, dt);
  }

  updateAi(dt) {
    const fighter = this.getActive('cpu');
    const target = this.getActive('player');
    if (!fighter || fighter.currentHp <= 0 || !target) return;
    if (this.canAct(fighter)) faceOpponent(fighter, target);
    if (this.activateAssist('cpu')) return;
    const distance = Math.abs(target.x - fighter.x);
    this.aiThink -= dt;
    this.aiGuardTimer = Math.max(0, this.aiGuardTimer - dt);

    if (this.canAct(fighter) && target.action && distance < 118 && Math.random() < this.difficulty.guardChance * dt * 8) {
      this.aiGuardTimer = 0.24 + Math.random() * 0.24;
    }
    this.updateGuarding('cpu', this.aiGuardTimer > 0, fighter.y >= this.groundY - 2);
    fighter.crouching = false;

    if (this.aiThink <= 0 && this.canAct(fighter)) {
      this.aiThink = this.difficulty.reaction * (0.75 + Math.random() * 0.7);
      const team = this.getTeam('cpu');
      const healthierBench = team.fighters.find(candidate => candidate.index !== team.activeIndex && candidate.currentHp > fighter.currentHp * 1.45);
      if (fighter.currentHp / fighter.maxHp < 0.3 && healthierBench && team.tagCooldown <= 0 && Math.random() < 0.7) {
        this.requestTag('cpu', healthierBench.index);
        return;
      }
      if (fighter.meter >= 100 && Math.random() < this.difficulty.aggression * 0.5) {
        this.tryAction('cpu', 'super');
      } else if (fighter.meter >= 30 && distance > 112 && Math.random() < 0.56) {
        this.tryAction('cpu', 'special');
      } else if (distance < 100 && Math.random() < this.difficulty.aggression) {
        this.tryAction('cpu', Math.random() < 0.64 ? 'light' : 'heavy');
      } else if (distance > 92) {
        this.aiMove = Math.sign(target.x - fighter.x);
      } else {
        this.aiMove = Math.random() < 0.28 ? -Math.sign(target.x - fighter.x) : 0;
      }
    }

    if (fighter.guarding) {
      fighter.state = 'defense';
      fighter.vx = lerp(fighter.vx, 0, clamp(dt * 16, 0, 1));
    } else {
      this.moveFighter(fighter, target, this.aiMove, dt);
    }
  }

  moveFighter(fighter, target, direction, dt) {
    if (!this.canAct(fighter) || fighter.y < this.groundY - 2) {
      this.applyPhysics(fighter, dt);
      return;
    }
    faceOpponent(fighter, target);
    fighter.vx = lerp(fighter.vx, direction * fighter.moveSpeed, clamp(dt * 18, 0, 1));
    if (direction) fighter.state = 'run';
    this.applyPhysics(fighter, dt);
  }

  applyPhysics(fighter, dt) {
    fighter.vy += 1250 * dt;
    fighter.x = clamp(fighter.x + fighter.vx * dt, 66, this.width - 66);
    fighter.y += fighter.vy * dt;
    fighter.vx *= Math.pow(0.82, dt * 60);
    if (fighter.y >= this.groundY) {
      fighter.y = this.groundY;
      fighter.vy = 0;
    }
  }

  updateActions(dt) {
    ['player', 'cpu'].forEach(side => {
      const fighter = this.getActive(side);
      const target = this.getOpponent(side);
      if (!fighter?.action || fighter.currentHp <= 0) return;
      fighter.action.elapsed += dt;
      const action = fighter.action;
      if (!action.resolved && action.elapsed >= action.hitAt) {
        action.resolved = true;
        if (action.effect && action.effect !== 'damage') {
          this.resolveSupportSuper(fighter, action);
        } else if ((action.authoredAbility || action.type === 'super') ? action.delivery === 'projectile' : action.type === 'special' && fighter.ranged) {
          this.spawnProjectile(fighter, action);
        } else if ((action.authoredAbility || action.type === 'super') && action.delivery === 'area') {
          if (target && Math.abs(target.x - fighter.x) <= action.range && Math.abs(target.y - fighter.y) < 150) this.applyHit(fighter, target, action);
        } else {
          this.attemptHit(fighter, target, action);
        }
      }
      if (action.elapsed >= action.duration) {
        fighter.action = null;
        if (fighter.currentHp > 0 && fighter.hitstun <= 0) fighter.state = fighter.guarding ? 'defense' : 'idle';
      }
    });
  }

  getSupportSuperTargets(fighter, action) {
    const effect = action.effect;
    const targetSide = action.targetSide === 'enemy' ? (fighter.side === 'player' ? 'cpu' : 'player') : fighter.side;
    const candidates = action.targetSide === 'self' ? [fighter] : this.getTeam(targetSide).fighters;
    const eligible = candidates.filter(member => !(action.excludeSelf && member === fighter) && (effect === 'revive' ? member.currentHp <= 0 : member.currentHp > 0));
    return ['group', 'multi', 'area'].includes(action.shape)
      ? eligible.slice(0, action.maxTargets || eligible.length)
      : eligible.sort((a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp).slice(0, 1);
  }

  resolveSupportSuper(fighter, action) {
    const effect = action.effect;
    const targets = this.getSupportSuperTargets(fighter, action);
    targets.forEach(target => {
      if (effect === 'heal') target.currentHp = Math.min(target.maxHp, target.currentHp + target.maxHp * clamp(finiteOr(action.healRatio, 0.3), 0, 0.6));
      if (effect === 'guard') {
        target.guard = 100;
        target.guardBreak = 0;
        target.superGuardSeconds = action.effectDuration;
        target.superGuardReduce = clamp(finiteOr(action.guardReduce, 0.35), 0, 0.7);
      }
      if (effect === 'buff') {
        target.superBuffSource = combatBuffSource(fighter, action.identity);
        target.superBuffSeconds = action.effectDuration;
        target.superBuffMultiplier = clamp(finiteOr(action.buffMultiplier, 1.3), 1, 1.7);
      }
      if (effect === 'cleanse' || action.cleanses) {
        target.hitstun = 0;
        target.guardBreak = 0;
        target.guard = 100;
        target.invulnerable = Math.max(target.invulnerable, 0.65);
      }
      if (effect === 'revive') {
        target.currentHp = target.maxHp * clamp(finiteOr(action.reviveRatio, 0.35), 0.1, 0.6);
        target.koDelay = 0;
        target.state = 'idle';
      }
    });
    this.spawnBurst(fighter.x, fighter.y - 60, action.color, 24);
  }

  spawnProjectile(fighter, action) {
    const color = action.color || fighter.secondaryColor || fighter.weaponColor || '#39c5bb';
    const direction = action.facing ?? fighter.facing;
    const nativeVisual = action.type === 'super' && supportsTrackedCharacterSuperVisual(action.identity);
    const radius = action.type === 'super' ? 22 : 13;
    const target = nativeVisual ? this.getOpponent(fighter.side) : null;
    const visual = nativeVisual ? getCharacterSuperVisualState({ actor: fighter, profile: action.identity, action, target, height: 142 }) : null;
    // W9/W10 weapons launch from their measured native barrel; earlier
    // projectile families retain their existing origin and lifetime.
    const nativeMuzzle = ['native-wave9', 'native-wave10', 'native-wave11'].includes(visual?.family) && visual.nativeMuzzleActive ? visual.origin : null;
    const origin = nativeMuzzle || { x: fighter.x + direction * 58, y: fighter.y - 64 };
    const originDistance = (origin.x - fighter.x) * direction;
    this.projectiles.push({
      side: fighter.side,
      owner: fighter,
      originX: fighter.x,
      maxRange: action.type === 'super' || action.authoredAbility ? action.range : null,
      x: origin.x,
      y: origin.y,
      vx: direction * 520,
      radius,
      ...(nativeVisual ? { visualElapsed: 0, visualOriginX: origin.x,
        visualFlightDistance: Math.max(1, Math.min(action.range, ((target?.x ?? fighter.x + direction * action.range) - fighter.x) * direction) - originDistance - radius - 32) } : {}),
      life: action.type === 'super' || action.authoredAbility ? Math.max(0, action.range - originDistance) / 520 : 1.25,
      action: { ...action, range: 34 },
      color
    });
    this.particles.add(nativeMuzzle ? origin.x : fighter.x, nativeMuzzle ? origin.y : fighter.y - 62, direction * 5, 0, color, 6, 34, 'laser_line');
  }

  updateProjectiles(dt) {
    this.projectileVisualImpacts = this.projectileVisualImpacts.filter(impact => {
      impact.elapsed += Math.max(0, dt);
      return impact.elapsed < impact.duration;
    });
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      if (projectile.visualElapsed != null) projectile.visualElapsed += Math.max(0, Math.min(dt, projectile.life));
      projectile.x += projectile.vx * Math.min(dt, Math.max(0, projectile.life));
      projectile.life -= dt;
      const target = this.getOpponent(projectile.side);
      const targetCenterY = target?.y - (target?.crouching ? 32 : 56);
      const targetHalfHeight = target?.crouching ? 28 : 66;
      if (
        target
        && target.currentHp > 0
        && (!projectile.maxRange || Math.abs(target.x - projectile.originX) <= projectile.maxRange)
        && Math.abs(projectile.x - target.x) < projectile.radius + 32
        && Math.abs(projectile.y - targetCenterY) < targetHalfHeight
      ) {
        const beforeHp = target.currentHp;
        const impactX = target.x;
        this.applyHit(projectile.owner, target, projectile.action, true, Math.sign(projectile.vx));
        if (projectile.visualElapsed != null && target.currentHp < beforeHp) this.projectileVisualImpacts.push({
          owner: projectile.owner, action: projectile.action, x: impactX, y: targetCenterY,
          elapsed: 0, duration: 0.24
        });
        this.projectiles.splice(index, 1);
      } else if (projectile.life <= 0 || projectile.x < -40 || projectile.x > this.width + 40) {
        this.projectiles.splice(index, 1);
      }
    }
  }

  attemptHit(attacker, target, action) {
    if (!target || target.currentHp <= 0 || target.invulnerable > 0) return false;
    const direction = action.facing ?? attacker.facing;
    const inFront = direction > 0 ? target.x >= attacker.x : target.x <= attacker.x;
    const closeY = Math.abs(target.y - attacker.y) < 92;
    if (!inFront || !closeY || Math.abs(target.x - attacker.x) > action.range) return false;
    this.applyHit(attacker, target, action, false, direction);
    return true;
  }

  applyHit(attacker, target, action, projectile = false, impactDirection = null) {
    if (this.finished || this.roundTransition || this.disposed || target.invulnerable > 0 || target.currentHp <= 0) return;
    // A travelling projectile keeps its own incoming direction even after its
    // owner turns, jumps across the target, or tags out before impact.
    const hitDirection = impactDirection || Math.sign(target.x - attacker.x) || action.facing || attacker.facing;
    const facingAttacker = target.facing === -hitDirection;
    const blocked = target.guarding && facingAttacker && target.guardBreak <= 0;
    const attackScale = attacker.attackPower / 18;
    const defenseScale = 1 - clamp(target.defensePower * 0.012, 0.05, 0.28);
    const cpuScale = (
      attacker.side === 'cpu'
      && this.opponentControl === 'cpu'
      && !action.ignoreDifficulty
    )
      ? this.difficulty.damage
      : 1;
    const buffScale = attacker.superBuffSeconds > 0 ? attacker.superBuffMultiplier : 1;
    const guardScale = target.superGuardSeconds > 0 ? 1 - target.superGuardReduce : 1;
    let damage = Math.max(3, action.base * attackScale * defenseScale * cpuScale * buffScale * guardScale);

    if (blocked) {
      damage *= 1 - clamp(finiteOr(target.guardReduction, 0.8), 0, 0.95);
      target.guard = Math.max(0, target.guard - action.guardDamage);
      target.vx = hitDirection * action.knockback * 0.26;
      this.playSfx('shield');
      this.spawnBurst(target.x, target.y - 58, '#7df9ff', 8);
      if (target.guard <= 0) {
        target.guardBreak = 1.15;
        target.guarding = false;
        target.state = 'hit';
        this.announcement = 'GARDE BRISEE';
        this.announcementTimer = 0.7;
        this.playSfx('special');
      }
    } else {
      target.guarding = false;
      target.crouching = false;
      target.action = null;
      target.hitstun = action.type === 'super'
        ? 0.78
        : action.type === 'heavy'
          ? 0.42
          : action.type === 'assist'
            ? 0.34
            : 0.24;
      target.state = 'hit';
      target.vx = hitDirection * action.knockback;
      target.vy = action.type === 'super' ? -235 : action.type === 'heavy' ? -130 : -60;
      this.playSfx(projectile ? 'shoot' : 'hit');
      this.spawnBurst(target.x, target.y - 60, attacker.secondaryColor || '#ff5a36', action.type === 'super' ? 26 : 12);
      this.hitStop = action.type === 'super' ? 0.1 : action.type === 'heavy' ? 0.055 : 0.025;
    }

    damage = Math.round(damage * 10) / 10;
    target.currentHp = Math.max(0, target.currentHp - damage);
    if (!projectile && damage > 0 && action.type === 'super' && supportsConfirmedCharacterSuperContact(action.identity)
      && !action.visualConfirmedContact) {
      // Cosmetic contact follows this accepted hit, including its original
      // location after a KO or knockback. Drawing never selects another victim.
      action.visualConfirmedContact = { confirmed: true, x: target.x, y: target.y };
    }
    attacker.meter = clamp(attacker.meter + damage * (blocked ? 0.42 : 0.82), 0, 100);
    target.meter = clamp(target.meter + damage * 0.55, 0, 100);
    this.stats[attacker.side].damage += damage;
    this.stats[target.side].taken += damage;
    const attackerFieldState = this.getFieldSuperState(attacker.side);
    if (attackerFieldState.super && !attackerFieldState.used) {
      this.setFieldSuperState(attacker.side, {
        charge: clamp(attackerFieldState.charge + damage * 0.3, 0, 100)
      });
    }
    const targetFieldState = this.getFieldSuperState(target.side);
    if (targetFieldState.super && !targetFieldState.used) {
      this.setFieldSuperState(target.side, {
        charge: clamp(targetFieldState.charge + damage * 0.65, 0, 100)
      });
    }
    const attackerAssistState = this.getAssistState(attacker.side);
    if (attackerAssistState.assist && !attackerAssistState.used) {
      attackerAssistState.charge = clamp(
        attackerAssistState.charge + damage * 0.45,
        0,
        100
      );
    }
    const targetAssistState = this.getAssistState(target.side);
    if (targetAssistState.assist && !targetAssistState.used) {
      targetAssistState.charge = clamp(
        targetAssistState.charge + damage * 0.72,
        0,
        100
      );
    }
    this.stats[attacker.side].currentCombo += 1;
    this.stats[attacker.side].comboTimer = 0.82;
    this.stats[attacker.side].maxCombo = Math.max(this.stats[attacker.side].maxCombo, this.stats[attacker.side].currentCombo);
    this.particles.add(target.x - 14, target.y - 100, 0, -1.1, blocked ? '#7df9ff' : '#ffffff', 5, 38, 'text', blocked ? 'GUARD' : `${Math.round(damage)}`);

    if (target.currentHp <= 0) {
      target.state = 'dead';
      target.koDelay = 0.9;
      target.vx = hitDirection * Math.max(action.knockback, 250);
      target.vy = -210;
      this.stats[attacker.side].kos += 1;
      this.announcement = 'K.O.';
      this.announcementTimer = 1;
      this.playSfx('defeat');
      this.triggerKoCosmetic(attacker.side, target.x, target.y - 58);
    }
  }

  resolveSpacing() {
    const player = this.getActive('player');
    const cpu = this.getActive('cpu');
    if (!player || !cpu || player.currentHp <= 0 || cpu.currentHp <= 0) return;
    const delta = cpu.x - player.x;
    const minDistance = 62;
    if (Math.abs(delta) < minDistance && Math.abs(player.y - cpu.y) < 82) {
      const push = (minDistance - Math.abs(delta)) * 0.5;
      const sign = delta === 0 ? 1 : Math.sign(delta);
      player.x = clamp(player.x - push * sign, 66, this.width - 66);
      cpu.x = clamp(cpu.x + push * sign, 66, this.width - 66);
    }
    if (this.canAct(player)) faceOpponent(player, cpu);
    if (this.canAct(cpu)) faceOpponent(cpu, player);
  }

  resolveKnockouts(dt) {
    ['player', 'cpu'].forEach(side => {
      const fighter = this.getActive(side);
      if (!fighter || fighter.currentHp > 0 || fighter.koDelay <= 0) return;
      fighter.koDelay -= dt;
      this.applyPhysics(fighter, dt);
      if (fighter.koDelay > 0) return;
      const team = this.getTeam(side);
      const next = team.fighters.find(candidate => candidate.currentHp > 0);
      if (next) {
        this.requestTag(side, next.index, true);
      } else if (!this.finished && !this.roundTransition) {
        this.endRound(side === 'cpu' ? 'victory' : 'defeat');
      }
    });
  }

  getTeamHealthRatio(side) {
    const team = this.getTeam(side).fighters;
    const max = team.reduce((total, fighter) => total + fighter.maxHp, 0) || 1;
    return team.reduce((total, fighter) => total + fighter.currentHp, 0) / max;
  }

  finishByTime() {
    const playerRatio = this.getTeamHealthRatio('player');
    const cpuRatio = this.getTeamHealthRatio('cpu');
    this.endRound(playerRatio >= cpuRatio ? 'victory' : 'defeat', true);
  }

  freezeCombat() {
    this.projectiles = [];
    this.projectileVisualImpacts = [];
    this.hitStop = 0;
    this.aiMove = 0;
    this.aiThink = 0;
    this.aiGuardTimer = 0;
    this.inputs = { player: {}, cpu: {} };
    this.playerInput = this.inputs.player;
    Object.values(this.teams).forEach(team => team.fighters.forEach(fighter => {
      fighter.action = null;
      fighter.vx = 0;
      fighter.vy = 0;
      fighter.guarding = false;
      fighter.crouching = false;
      fighter.y = this.groundY;
    }));
  }

  queuePresentation(phase, winnerSide = null) {
    const sides = phase === 'fatality' ? [winnerSide] : ['player', 'cpu'];
    const entries = sides.map(side => {
      const actorPhase = phase === 'roundResult'
        ? (side === winnerSide ? 'roundVictory' : 'roundDefeat')
        : phase === 'victory'
          ? (side === winnerSide ? 'victory' : 'defeat')
          : phase;
      const fighter = this.getActive(side);
      const identity = resolveCombatPresentation(fighter, actorPhase);
      return { side, actorPhase, identity, script: identity.presentationScript || resolvePresentationScript(fighter, actorPhase) };
    });
    const duration = Math.max(0.6, ...entries.map(entry => entry.identity.duration));
    this.presentationQueue.push({ phase, entries, duration, remaining: duration });
  }

  updatePresentation(dt) {
    if (!this.presentation) return;
    this.presentation.remaining = Math.max(0, this.presentation.remaining - dt);
    if (this.presentation.remaining <= 0) this.presentation = this.presentationQueue.shift() || null;
  }

  endRound(result, timeout = false) {
    if (this.finished || this.roundTransition || this.disposed) return false;
    const winnerSide = result === 'victory' ? 'player' : 'cpu';
    this.roundWins[winnerSide] += 1;
    this.roundHistory.push({
      round: this.roundNumber,
      winnerSide,
      timeout,
      remainingTime: this.timer,
      fieldSuperUsed: this.fieldSuperUsed,
      opponentFieldSuperUsed: this.opponentFieldSuperUsed,
      assistUsed: this.assists.player.used,
      opponentAssistUsed: this.assists.cpu.used
    });
    this.freezeCombat();
    if (this.roundWins[winnerSide] >= this.roundsToWin) {
      this.finish(result, timeout);
    } else {
      this.roundTransition = { winnerSide, result, timeout };
      this.announcement = `MANCHE ${this.roundNumber} — ${winnerSide === 'player' ? 'J1' : 'J2'} GAGNE`;
      this.announcementTimer = 6;
      this.queuePresentation('roundResult', winnerSide);
      this.presentation = this.presentationQueue.shift();
      this.playSfx('victory');
    }
    return true;
  }

  resetForNextRound() {
    // Every round starts with full life/guard and empty personal meter.
    // Field supers and assists receive their initial charge and one use again.
    this.roundNumber += 1;
    this.projectileVisualImpacts = [];
    Object.entries(this.teams).forEach(([side, team]) => {
      team.fighters = team.fighters.map((fighter, index) => createFighter(fighter, side, index, this.width, this.groundY));
      team.activeIndex = 0;
      team.tagCooldown = 0;
      this.stats[side].currentCombo = 0;
      this.stats[side].comboTimer = 0;
      const field = this.getFieldSuperState(side);
      this.setFieldSuperState(side, { charge: field.super ? 20 : 0, used: false });
      const assist = this.getAssistState(side);
      assist.charge = assist.assist ? 40 : 0;
      assist.used = false;
    });
    this.roundTransition = null;
    this.presentation = null;
    this.timer = 99;
    this.countdown = 3.2;
    this.introPoseTimer = 0;
    this.assistEvent = null;
    this.koEffectEvent = null;
    this.fieldSuperFlash = 0;
    this.announcement = `MANCHE ${this.roundNumber}`;
    this.announcementTimer = 3.2;
  }

  finish(result, timeout = false) {
    if (this.finished || this.disposed) return false;
    this.freezeCombat();
    this.finished = true;
    this.result = result;
    this.winnerSide = result === 'victory' ? 'player' : 'cpu';
    this.completionDelay = 0.2;
    this.announcement = timeout ? (result === 'victory' ? 'TEMPS - AVANTAGE' : 'TEMPS - REPLI') : result === 'victory' ? 'VICTOIRE' : 'DEFAITE';
    this.announcementTimer = 4;
    this.presentationQueue = [];
    if (!timeout) this.queuePresentation('fatality', this.winnerSide);
    this.queuePresentation('victory', this.winnerSide);
    this.queuePresentation('outro', this.winnerSide);
    this.presentation = this.presentationQueue.shift();
    const victoryPose = this.getCosmetics(this.winnerSide).victoryPose;
    if (victoryPose) {
      const duration = clamp(
        finiteOr(victoryPose.animation?.durationMs, 1800) / 1000,
        1,
        3.2
      );
      const winner = this.getActive(this.winnerSide);
      this.victoryPoseEvent = {
        side: this.winnerSide,
        pose: victoryPose,
        fighterName: winner?.name || winner?.id || '',
        duration,
        remaining: duration
      };
    }
    this.playSfx(result === 'victory' ? 'victory' : 'defeat');
    return true;
  }

  dispose() {
    this.disposed = true;
    this.freezeCombat();
    this.presentation = null;
    this.presentationQueue = [];
    this.onComplete = () => {};
  }

  getSummary() {
    const playerStats = this.stats.player;
    const healthRatio = this.getTeamHealthRatio('player');
    const score = Math.max(0, Math.round(
      playerStats.damage * 8
      + playerStats.kos * 900
      + playerStats.tags * 120
      + playerStats.maxCombo * 95
      + healthRatio * 1200
      + this.timer * 12
      - playerStats.taken * 3
    ));
    const grade = score >= 5200 ? 'S' : score >= 3800 ? 'A' : score >= 2500 ? 'B' : 'C';
    return {
      mode: 'Fighter',
      result: this.result,
      grade,
      score,
      duration: Math.round(this.combatDuration * 10) / 10,
      roundNumber: this.roundNumber,
      roundsToWin: this.roundsToWin,
      roundWins: { ...this.roundWins },
      rounds: this.roundHistory.map(round => ({ ...round })),
      resourcePolicy: 'Chaque manche : PV et garde restaurés ; jauge personnelle à 0 ; super de terrain à 20 %, assist à 40 %, un nouvel usage par manche.',
      presentationFidelity: 'Adaptation en sprites et effets procéduraux des capacités du personnage ; cinématiques non certifiées 1:1.',
      remainingTime: Math.ceil(this.timer),
      damageDealt: Math.round(playerStats.damage),
      damageTaken: Math.round(playerStats.taken),
      knockouts: playerStats.kos,
      tags: playerStats.tags,
      maxCombo: playerStats.maxCombo,
      fieldSuperUsed: this.fieldSuperUsed || this.roundHistory.some(round => round.fieldSuperUsed),
      opponentFieldSuperUsed: this.opponentFieldSuperUsed || this.roundHistory.some(round => round.opponentFieldSuperUsed),
      assistUsed: this.assists.player.used || this.roundHistory.some(round => round.assistUsed),
      opponentAssistUsed: this.assists.cpu.used || this.roundHistory.some(round => round.opponentAssistUsed),
      opponentControl: this.opponentControl,
      winnerSide: this.winnerSide,
      victoryPose: this.getCosmetics(
        this.winnerSide || (this.result === 'victory' ? 'player' : 'cpu')
      ).victoryPose,
      survivingFighters: this.getTeam('player').fighters.filter(fighter => fighter.currentHp > 0).length,
      rewards: !this.finished
        ? { gold: 0, shards: 0, seasonXp: 0 }
        : this.result === 'victory'
        ? { gold: 45 + playerStats.kos * 12, shards: 15 + ({ S: 12, A: 8, B: 5, C: 2 }[grade] || 0), seasonXp: 28 + playerStats.kos * 5 }
        : { gold: 0, shards: 0, seasonXp: 8 }
    };
  }

  getSnapshot() {
    const presentation = this.getCurrentPresentation();
    const serializeTeam = side => {
      const team = this.getTeam(side);
      return {
        activeIndex: team.activeIndex,
        tagCooldown: team.tagCooldown,
        fighters: team.fighters.map(fighter => ({
          id: fighter.id,
          name: fighter.name,
          currentHp: fighter.currentHp,
          maxHp: fighter.maxHp,
          meter: fighter.meter,
          guard: fighter.guard,
          personalSuper: resolveMeleeSuper(fighter),
          abilityCooldowns: { ...fighter.abilityCooldowns },
          activeAbility: fighter.action?.identity || null,
          active: fighter.index === team.activeIndex,
          ko: fighter.currentHp <= 0
        }))
      };
    };
    const serializeAssist = side => {
      const state = this.getAssistState(side);
      return {
        id: state.assist?.id || null,
        charge: state.charge,
        used: state.used,
        ready: Boolean(state.assist && !state.used && state.charge >= 100)
      };
    };
    return {
      phase: presentation?.phase || (this.finished ? this.result : this.countdown > 0 ? 'countdown' : 'running'),
      matchResult: this.result,
      roundNumber: this.roundNumber,
      roundsToWin: this.roundsToWin,
      roundWins: { ...this.roundWins },
      roundResult: this.roundTransition ? { ...this.roundTransition } : null,
      presentation: presentation ? {
        phase: presentation.phase,
        duration: presentation.duration,
        remaining: presentation.remaining,
        entries: presentation.entries.map(entry => ({
          side: entry.side,
          actorPhase: entry.actorPhase,
          identity: entry.identity,
          script: entry.script ? {
            id: entry.script.id,
            name: entry.script.name,
            sourceAction: entry.script.sourceAction,
            sourceReference: entry.script.sourceReference,
            missingAssets: [...entry.script.missingAssets],
            provenance: { ...entry.script.provenance },
            sample: samplePresentationScript(entry.script, presentation.duration - presentation.remaining)
          } : null,
          fighterId: this.getActive(entry.side)?.id,
          fighterName: this.getActive(entry.side)?.name,
          universe: this.getActive(entry.side)?.universe
        }))
      } : null,
      timer: Math.ceil(this.timer),
      countdown: Math.ceil(this.countdown),
      announcement: this.announcementTimer > 0 ? this.announcement : '',
      player: serializeTeam('player'),
      cpu: serializeTeam('cpu'),
      combo: this.stats.player.currentCombo,
      maxCombo: this.stats.player.maxCombo,
      fieldSuperCharge: this.fieldSuperCharge,
      fieldSuperUsed: this.fieldSuperUsed,
      fieldSuperId: this.fieldSuper?.id || null,
      opponentFieldSuperCharge: this.opponentFieldSuperCharge,
      opponentFieldSuperUsed: this.opponentFieldSuperUsed,
      opponentFieldSuperId: this.opponentFieldSuper?.id || null,
      assistCharge: this.assists.player.charge,
      assistUsed: this.assists.player.used,
      assistId: this.assists.player.assist?.id || null,
      opponentAssistCharge: this.assists.cpu.charge,
      opponentAssistUsed: this.assists.cpu.used,
      opponentAssistId: this.assists.cpu.assist?.id || null,
      opponentControl: this.opponentControl,
      fieldSupers: {
        player: {
          charge: this.fieldSuperCharge,
          used: this.fieldSuperUsed,
          id: this.fieldSuper?.id || null
        },
        opponent: {
          charge: this.opponentFieldSuperCharge,
          used: this.opponentFieldSuperUsed,
          id: this.opponentFieldSuper?.id || null
        }
      },
      assists: {
        player: serializeAssist('player'),
        opponent: serializeAssist('cpu')
      },
      cosmeticEvents: {
        intro: {
          active: this.introPoseTimer > 0,
          remaining: this.introPoseTimer,
          playerId: this.cosmetics.player.introPose?.id || null,
          opponentId: this.cosmetics.cpu.introPose?.id || null
        },
        assistId: this.assistEvent?.assist?.id || null,
        koEffectId: this.koEffectEvent?.effect?.id || null,
        victoryPoseId: this.victoryPoseEvent?.pose?.id || null
      }
    };
  }

  getCurrentPresentation() {
    if (this.presentation) return this.presentation;
    if (!this.finished && !this.roundTransition && this.countdown > 3.2) {
      return {
        phase: 'intro',
        entries: this.characterIntros.map(entry => ({ ...entry, actorPhase: 'intro' })),
        duration: this.characterIntroDuration,
        remaining: this.countdown - 3.2
      };
    }
    return null;
  }

  draw(ctx, animTime) {
    this.drawArena(ctx, animTime);
    if (this.getCurrentPresentation()) {
      this.drawHud(ctx);
      this.drawCharacterPresentation(ctx, animTime);
      if (this.introPoseTimer > 0) this.drawIntroPoses(ctx);
      if (this.victoryPoseEvent && this.presentation?.phase === 'victory') this.drawVictoryPose(ctx);
      return;
    }
    this.projectiles.forEach(projectile => this.drawProjectile(ctx, projectile));
    this.projectileVisualImpacts.forEach(impact => this.drawProjectileImpact(ctx, impact));
    const player = this.getActive('player');
    const cpu = this.getActive('cpu');
    [player, cpu].filter(Boolean).forEach(fighter => {
      this.drawShadow(ctx, fighter);
      ctx.save();
      if (fighter.invulnerable > 0 && Math.floor(this.elapsed * 20) % 2 === 0) ctx.globalAlpha = 0.45;
      const catastrophe = this.getCatastropheSuperVisual(fighter);
      const sprite = catastrophe ? { ...fighter, presentationPhase: 'super', presentationProgress: catastrophe.actionProgress } : fighter;
      drawPixelSprite(ctx, catastrophe?.x ?? fighter.x, catastrophe?.feetY ?? fighter.y, sprite, animTime, catastrophe ? (fighter.action.facing ?? fighter.facing) : fighter.facing, 142, 'melee');
      ctx.restore();
    });
    if (this.fieldSuperFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(this.fieldSuperFlash * 0.38, 0, 0.42);
      ctx.fillStyle = this.fieldSuperFlashColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
    if (this.assistEvent) this.drawAssistEffect(ctx);
    if (this.koEffectEvent) this.drawKoEffect(ctx);
    this.drawHud(ctx);
    if (this.introPoseTimer > 0) this.drawIntroPoses(ctx);
    if (this.announcementTimer > 0) this.drawAnnouncement(ctx);
    if (this.victoryPoseEvent && this.presentation?.phase === 'victory') this.drawVictoryPose(ctx);
    ['player', 'cpu'].forEach(side => {
      const fighter = this.getActive(side);
      if (fighter?.action && (fighter.action.type === 'super' || fighter.action.authoredAbility)) this.drawPersonalSuper(ctx, fighter);
    });
  }

  getCatastropheSuperVisual(fighter) {
    const action = fighter?.action;
    const identity = action?.identity;
    if (action?.type !== 'super' || identity?.sourceHeroId !== 'barret_ff7' || identity.universe !== 'Final Fantasy VII') return null;
    const impactProgress = action.hitAt / action.duration;
    const landingProgress = Math.min(0.95, impactProgress + (1 - impactProgress) * 0.65);
    const motion = sampleCatastropheMotion(action.elapsed / action.duration, impactProgress, landingProgress);
    const facing = action.facing ?? fighter.facing;
    const scale = 142 / 208;
    const x = fighter.x + motion.x * facing * scale;
    const feetY = fighter.y + motion.y * scale;
    return {
      x, feetY, actionProgress: motion.actionProgress,
      geometry: getCatastropheBeamGeometry({ x, feetY, groundY: fighter.y, facing, reach: Math.min(action.range, this.width * 0.4), progress: motion.progress, scale })
    };
  }

  drawCatastropheEffect(ctx, geometry, color) {
    if (!geometry.charging && !geometry.firing) return;
    const { muzzle, target, scale } = geometry;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.4);
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(muzzle.x, muzzle.y, (8 + geometry.charge * 16) * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (geometry.firing) {
      // Stroke the full diagonal to the ground, rather than rotating a
      // horizontal rectangle. Its endpoint stays below the airborne muzzle.
      ctx.globalAlpha *= 0.7 + Math.sin(geometry.fireProgress * Math.PI) * 0.3;
      ctx.lineWidth = 32 * scale;
      ctx.beginPath();
      ctx.moveTo(muzzle.x, muzzle.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8 * scale;
      ctx.beginPath();
      ctx.moveTo(muzzle.x, muzzle.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.fillStyle = rgba(color, 0.3);
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.ellipse(target.x, target.y, (30 + geometry.fireProgress * 36) * scale, (8 + geometry.fireProgress * 8) * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPersonalSuper(ctx, fighter) {
    const action = fighter.action;
    const catastrophe = this.getCatastropheSuperVisual(fighter);
    if (catastrophe) {
      this.drawCatastropheEffect(ctx, catastrophe.geometry, action.color);
      return;
    }
    let visualTarget = this.getOpponent(fighter.side);
    if (action.visualSupportTargetId) visualTarget = this.getTeam(fighter.side).fighters.find(member => member.id === action.visualSupportTargetId) || fighter;
    else if (Number.isFinite(action.visualAimDistance)) visualTarget = {
      x: fighter.x + (action.facing < 0 ? -1 : 1) * action.visualAimDistance, y: fighter.y
    };
    const projectileVisual = action.type === 'super' && supportsTrackedCharacterSuperVisual(action.identity) ? { phase: 'launch' } : null;
    const contactVisual = supportsConfirmedCharacterSuperContact(action.identity) ? action.visualConfirmedContact || { confirmed: false } : null;
    if (drawCharacterSuperVisuals(ctx, getCharacterSuperVisualState({ actor: fighter, profile: action.identity, action, target: visualTarget, height: 142, projectileVisual, contactVisual }))) return;
    const progress = clamp(action.elapsed / action.duration, 0, 1);
    const color = action.color;
    const direction = action.facing ?? fighter.facing;
    ctx.save();
    ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.75;
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.18);
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    const y = fighter.y - 62;
    if (action.delivery === 'beam') {
      const reach = Math.min(action.range, this.width);
      ctx.fillRect(fighter.x, y - 14, direction * reach * progress, 28);
      ctx.beginPath();
      ctx.moveTo(fighter.x, y);
      ctx.lineTo(fighter.x + direction * reach * progress, y);
      ctx.stroke();
    } else if (action.delivery === 'melee') {
      const radius = Math.min(action.range, 170);
      ctx.beginPath();
      ctx.arc(fighter.x, y, radius, direction > 0 ? -1.2 : Math.PI - 1.2, direction > 0 ? 1.2 : Math.PI + 1.2);
      ctx.stroke();
    } else {
      const radius = action.delivery === 'area' ? Math.min(action.range, 330) * progress : 38 + 42 * progress;
      ctx.beginPath();
      ctx.ellipse(fighter.x, y, radius, radius * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  drawCharacterPresentation(ctx, animTime) {
    const presentation = this.getCurrentPresentation();
    const progress = clamp(1 - presentation.remaining / presentation.duration, 0, 1);
    const finalScene = presentation.phase === 'fatality';
    const phases = { intro: 'INTRO', roundResult: `MANCHE ${this.roundNumber}`, fatality: 'FINALE', victory: 'RÉSULTAT DU MATCH', outro: 'OUTRO' };
    ctx.save();
    ctx.fillStyle = finalScene ? 'rgba(0,0,8,0.82)' : 'rgba(0,0,8,0.72)';
    ctx.fillRect(0, this.height * 0.28, this.width, this.height * 0.61);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Share Tech Mono", monospace';
    ctx.fillText(`${phases[presentation.phase]} · ${this.roundWins.player} – ${this.roundWins.cpu}`, this.width / 2, this.height * 0.34);
    presentation.entries.forEach(({ side, actorPhase, identity, script }) => {
      const fighter = this.getActive(side);
      if (!fighter) return;
      const anchorX = finalScene ? this.width / 2 : side === 'player' ? this.width * 0.25 : this.width * 0.75;
      const sample = script ? samplePresentationScript(script, presentation.duration - presentation.remaining) : null;
      const facing = side === 'player' ? 1 : -1;
      const entranceOffset = actorPhase === 'intro' ? (side === 'player' ? -1 : 1) * 60 * (1 - progress) : 0;
      const exitOffset = actorPhase === 'outro' ? (side === 'player' ? -1 : 1) * 100 * progress : 0;
      const x = anchorX + (sample ? sample.x * facing : entranceOffset + exitOffset);
      const losing = actorPhase === 'roundDefeat' || actorPhase === 'defeat';
      const state = finalScene ? 'special' : losing ? 'hit' : actorPhase === 'intro' || actorPhase === 'outro' ? 'run' : 'idle';
      const lift = losing ? 0 : Math.sin(progress * Math.PI) * (finalScene ? 18 : 5);
      const feetY = this.height * 0.66 + (sample ? sample.y : -lift);
      ctx.shadowColor = identity.color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = rgba(identity.color, 0.2);
      ctx.beginPath();
      ctx.ellipse(x, this.height * 0.66, 100 + progress * 25, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      const presentationFighter = {
        ...fighter,
        id: sample?.asset.actorId || fighter.id,
        state: sample?.poseState || state,
        stateElapsed: sample?.stateElapsed ?? presentation.duration - presentation.remaining,
        presentationPhase: actorPhase,
        presentationProgress: sample?.progress ?? progress,
        presentationFrame: sample ? { row: sample.asset.row, col: sample.asset.col } : null
      };
      ctx.save();
      ctx.globalAlpha *= sample?.opacity ?? 1;
      if (sample) this.drawScriptedPresentationEffect(ctx, sample, identity, x, feetY, facing, actorPhase);
      drawPixelSprite(ctx, x, feetY, presentationFighter, animTime, facing * (sample?.facing || 1), (finalScene ? 208 : 176) * (sample?.scale || 1), 'melee');
      ctx.restore();
      if (finalScene && !sample) {
        const spec = this.getPersonalSuperSpec(fighter);
        if (spec) this.drawPersonalSuper(ctx, {
          ...fighter,
          x,
          y: feetY,
          action: { ...spec, facing: side === 'player' ? 1 : -1, elapsed: progress * spec.duration }
        });
      }
      ctx.fillStyle = identity.color;
      ctx.font = 'bold 15px "Share Tech Mono", monospace';
      ctx.fillText(String(fighter.name || fighter.id), anchorX, this.height * 0.7, this.width * 0.45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px "Share Tech Mono", monospace';
      ctx.fillText(script?.name || identity.name, anchorX, this.height * 0.75, this.width * 0.44);
      ctx.fillStyle = '#b8c9d0';
      ctx.font = '11px "Share Tech Mono", monospace';
      ctx.fillText(`${fighter.universe} · ${identity.sourceAbility?.name || ''}`, anchorX, this.height * 0.8, this.width * 0.44);
    });
    ctx.restore();
  }

  drawScriptedPresentationEffect(ctx, sample, identity, x, feetY, facing, phase = 'fatality') {
    if (!sample.effect.active || sample.effect.kind === 'none') return;
    const kind = sample.effect.kind;
    const characterVisual = getCharacterSuperVisualState({
        actor: { x, y: feetY, sourceHeroId: identity.sourceHeroId, universe: identity.provenance?.sourceUniverse,
          presentationPhase: phase, presentationProgress: sample.progress, presentationFrame: { row: sample.asset.row, col: sample.asset.col } },
        profile: { sourceHeroId: identity.sourceHeroId, universe: identity.provenance?.sourceUniverse, name: identity.sourceAbility?.name, color: identity.color },
        action: { duration: 1, hitAt: 0.5, elapsed: sample.progress, facing },
        target: { x: x + facing * this.width * 0.3, y: feetY - sample.y },
        height: 208, applyMotion: false
      });
    if (drawCharacterSuperVisuals(ctx, characterVisual)) return;
    if (kind === 'catastrophe') {
      this.drawCatastropheEffect(ctx, getCatastropheBeamGeometry({
        x, feetY, groundY: feetY - sample.y, facing, reach: this.width * 0.4, progress: sample.progress
      }), identity.color);
      return;
    }
    const p = sample.effect.progress;
    const color = identity.color;
    const y = feetY - 82;
    const pulse = Math.sin(Math.PI * p);
    const handX = x + facing * 52;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.22);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 3;
    ctx.globalAlpha *= clamp(pulse * 1.5, 0, 1);
    const circle = (cx, cy, radius) => {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.1, radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };
    const beamKinds = ['kamehameha', 'final-flash', 'special-beam-cannon', 'all-creation', 'spartan-laser', 'railgun'];
    if (beamKinds.includes(kind)) {
      const narrow = kind === 'spartan-laser' || kind === 'railgun' || kind === 'special-beam-cannon';
      const charge = clamp(p / 0.45, 0, 1);
      circle(handX, y, 8 + charge * (narrow ? 12 : 25));
      if (p > 0.45) {
        const length = this.width * 0.4 * clamp((p - 0.45) * 6, 0, 1);
        const thickness = narrow ? 10 : kind === 'final-flash' ? 42 : 30;
        ctx.fillStyle = rgba(color, 0.5);
        ctx.fillRect(handX, y - thickness / 2, facing * length, thickness);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = narrow ? 2 : 6;
        ctx.beginPath();
        ctx.moveTo(handX, y);
        ctx.lineTo(handX + facing * length, y);
        ctx.stroke();
        if (kind === 'special-beam-cannon') {
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let t = 0; t <= 1; t += 0.025) {
            const px = handX + facing * length * t;
            const py = y + Math.sin(t * 30 - p * 12) * 17;
            if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
    } else if (['rasengan', 'vanishing-rasengan', 'rasenshuriken'].includes(kind)) {
      const thrown = kind === 'rasenshuriken';
      const orbX = handX + (thrown ? facing * Math.max(0, p - 0.5) * 470 : 0);
      if (kind === 'vanishing-rasengan' && p > 0.65) ctx.globalAlpha *= Math.max(0, 1 - (p - 0.65) * 5);
      const radius = thrown ? 27 : 23;
      circle(orbX, y, radius);
      for (let index = 0; index < 4; index += 1) {
        ctx.beginPath();
        ctx.ellipse(orbX, y, radius * 0.95, radius * 0.3, p * 9 + index * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (thrown) {
        for (let index = 0; index < 4; index += 1) {
          const angle = p * 12 + index * Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(orbX + Math.cos(angle) * 15, y + Math.sin(angle) * 15);
          ctx.lineTo(orbX + Math.cos(angle) * 63, y + Math.sin(angle) * 63);
          ctx.stroke();
        }
      }
    } else if (['chidori', 'ride-lightning', 'snake-lightning', 'indra-arrow'].includes(kind)) {
      const length = kind === 'snake-lightning' || kind === 'indra-arrow' ? this.width * 0.35 * p : 85;
      ctx.beginPath();
      for (let index = 0; index <= 16; index += 1) {
        const px = handX + facing * length * index / 16;
        const py = y + (kind === 'snake-lightning' ? Math.sin(index * 0.7 + p * 8) * 23 : ((index % 2) * 2 - 1) * (8 + Math.sin(index + p * 12) * 9));
        if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      if (kind === 'indra-arrow') {
        const end = handX + facing * length;
        ctx.beginPath();
        ctx.moveTo(end - facing * 22, y - 15);
        ctx.lineTo(end, y);
        ctx.lineTo(end - facing * 22, y + 15);
        ctx.stroke();
      }
    } else if (['multi-slash', 'gunblade-slash', 'energy-sword', 'dagger-cross', 'heavy-blade', 'spear-dive'].includes(kind)) {
      const count = kind === 'multi-slash' || kind === 'gunblade-slash' ? 7 : kind === 'dagger-cross' ? 2 : 1;
      for (let index = 0; index < count; index += 1) {
        const local = clamp(p * count - index, 0, 1);
        if (local <= 0 || local >= 1) continue;
        ctx.globalAlpha = Math.sin(local * Math.PI);
        const cx = x + facing * (75 + (index % 3) * 35);
        const cy = y - (index % 2) * 30;
        const direction = index % 2 ? -1 : 1;
        ctx.lineWidth = kind === 'heavy-blade' ? 10 : kind === 'energy-sword' ? 7 : 4;
        ctx.beginPath();
        ctx.moveTo(cx - facing * 55, cy - direction * 65);
        ctx.lineTo(cx + facing * 55, cy + direction * 65);
        ctx.stroke();
      }
    } else if (['gospel', 'oracle-light', 'dark-petals', 'first-aid', 'suture-threads'].includes(kind)) {
      if (kind === 'first-aid') {
        // A medical cross and a quiet pulse, without an attacking beam.
        ctx.fillStyle = rgba(color, 0.75);
        ctx.fillRect(x - 5, y - 30, 10, 45);
        ctx.fillRect(x - 22, y - 13, 44, 10);
      } else if (kind === 'suture-threads') {
        for (let index = 0; index < 6; index += 1) {
          ctx.beginPath();
          ctx.moveTo(x - 80, y - 40 + index * 16);
          ctx.quadraticCurveTo(x, y - 60 + Math.sin(p * 5 + index) * 45, x + 80, y - 40 + index * 16);
          ctx.stroke();
        }
      } else {
        for (let index = 0; index < 10; index += 1) {
          const angle = index * Math.PI * 0.2 + p * 1.7;
          const radius = 50 + 30 * p;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * 40 - p * 30;
          ctx.beginPath();
          ctx.ellipse(px, py, 4, 11, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = rgba(color, kind === 'dark-petals' ? 0.09 : 0.16);
        ctx.fillRect(x - 60, feetY - 190, 120, 190);
      }
    } else if (kind === 'bfg-orb' || kind === 'rocket-launcher') {
      const projectileX = handX + facing * Math.max(0, p - 0.3) * 430;
      if (kind === 'bfg-orb') {
        circle(projectileX, y, 22 + 10 * p);
        for (let index = 0; index < 5; index += 1) {
          const angle = index * Math.PI * 0.4 + p;
          ctx.beginPath();
          ctx.moveTo(projectileX, y);
          ctx.lineTo(projectileX + Math.cos(angle) * 90, y + Math.sin(angle) * 70);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#d8d6c9';
        ctx.fillRect(projectileX - 16, y - 5, 32, 10);
        ctx.strokeStyle = '#ff9e43';
        ctx.beginPath();
        ctx.moveTo(projectileX - facing * 18, y);
        ctx.lineTo(projectileX - facing * 75, y);
        ctx.stroke();
      }
    } else if (kind === 'kamui') {
      for (let index = 0; index < 4; index += 1) {
        ctx.beginPath();
        ctx.ellipse(handX + facing * 70, y, 12 + index * 14, 18 + index * 17, p * 5 + index * 0.2, 0, Math.PI * 1.6);
        ctx.stroke();
      }
    } else if (kind === 'armiger') {
      for (let index = 0; index < 7; index += 1) {
        const angle = index * Math.PI * 2 / 7 + p * 2;
        const cx = x + Math.cos(angle) * 100;
        const cy = y + Math.sin(angle) * 75;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 25);
        ctx.lineTo(cx + Math.cos(angle) * 16, cy - 25);
        ctx.stroke();
      }
    } else if (kind === 'cosmo-stars' || kind === 'pulsar' || kind === 'wishing-star') {
      for (let index = 0; index < 9; index += 1) {
        const angle = index * Math.PI * 2 / 9;
        const radius = 35 + p * 115;
        circle(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius * 0.6, kind === 'pulsar' ? 7 : 3);
      }
    } else if (kind === 'nexus-grid' || kind === 'convergence-lock') {
      for (let index = 0; index < 4; index += 1) {
        const size = 35 + index * 22 + p * 12;
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      }
    } else if (kind === 'fist-impact' || kind === 'tyrant-flame') {
      const impact = clamp((p - 0.35) / 0.65, 0, 1);
      if (kind === 'tyrant-flame') {
        for (let index = 0; index < 8; index += 1) {
          ctx.beginPath();
          ctx.moveTo(handX + facing * index * 9, y + 25);
          ctx.quadraticCurveTo(handX + facing * index * 12, y - 80 * pulse, handX + facing * (index * 9 + 7), y + 25);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.ellipse(handX + facing * 35, feetY - 4, 15 + impact * 95, 8 + impact * 25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // Explicit non-attacking auras: ki preparation, limit preparation and
      // a basic clone smoke cue while the missing form remains declared.
      ctx.beginPath();
      ctx.ellipse(x, y, 55 + pulse * 15, 95 + pulse * 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawAssistEffect(ctx) {
    const event = this.assistEvent;
    const progress = clamp(1 - event.remaining / event.duration, 0, 1);
    const color = event.assist.color || '#39c5bb';
    const radius = 28 + progress * 115;
    ctx.save();
    ctx.globalAlpha = clamp(1 - progress * 0.72, 0.18, 1);
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.13);
    ctx.lineWidth = 5 - progress * 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(event.x, event.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    const style = event.assist.style || 'vanguard';
    const spokes = style === 'scout' ? 8 : style === 'breaker' ? 6 : 4;
    for (let index = 0; index < spokes; index += 1) {
      const angle = (Math.PI * 2 * index) / spokes + progress * 1.2;
      ctx.beginPath();
      ctx.moveTo(event.x + Math.cos(angle) * radius * 0.35, event.y + Math.sin(angle) * radius * 0.35);
      ctx.lineTo(event.x + Math.cos(angle) * radius, event.y + Math.sin(angle) * radius);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawKoEffect(ctx) {
    const event = this.koEffectEvent;
    const progress = clamp(1 - event.remaining / event.duration, 0, 1);
    const color = event.effect.color || '#ffea00';
    const pattern = event.effect.visual?.pattern || event.effect.style || 'rift';
    const intensity = clamp(finiteOr(event.effect.visual?.intensity, 0.8), 0.2, 1.4);
    const atlas = event.effect.visual;
    const atlasFrame = Math.min(
      Math.max(1, Math.floor(finiteOr(atlas?.frames, 4))) - 1,
      Math.floor(progress * Math.max(1, Math.floor(finiteOr(atlas?.frames, 4))))
    );
    const atlasDrawn = drawCosmeticAtlasFrame(
      ctx,
      atlas,
      atlasFrame,
      event.x,
      event.y,
      330,
      330,
      {
        alpha: clamp((1 - progress * 0.72) * intensity, 0, 1),
        glowColor: color,
        glowBlur: 30
      }
    );
    if (atlasDrawn) return;

    ctx.save();
    ctx.globalAlpha = clamp((1 - progress) * intensity, 0, 1);
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.2);
    ctx.shadowColor = color;
    ctx.shadowBlur = 26;
    ctx.lineWidth = 3;
    if (pattern === 'scanline') {
      for (let index = -4; index <= 4; index += 1) {
        const y = event.y + index * 15 + progress * 34;
        ctx.fillRect(0, y, this.width, 3 + (index % 2 === 0 ? 2 : 0));
      }
    } else if (pattern === 'shards') {
      for (let index = 0; index < 12; index += 1) {
        const angle = (Math.PI * 2 * index) / 12;
        const inner = 22 + progress * 55;
        const outer = 78 + progress * 145;
        ctx.beginPath();
        ctx.moveTo(event.x + Math.cos(angle - 0.08) * inner, event.y + Math.sin(angle - 0.08) * inner);
        ctx.lineTo(event.x + Math.cos(angle) * outer, event.y + Math.sin(angle) * outer);
        ctx.lineTo(event.x + Math.cos(angle + 0.08) * inner, event.y + Math.sin(angle + 0.08) * inner);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      const radius = pattern === 'sigil'
        ? 58 + progress * 70
        : 105 - progress * 78;
      ctx.beginPath();
      ctx.arc(event.x, event.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(event.x, event.y, radius * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      if (pattern === 'sigil') {
        ctx.strokeRect(event.x - radius * 0.48, event.y - radius * 0.48, radius * 0.96, radius * 0.96);
      } else {
        ctx.fillRect(event.x - 4, event.y - radius, 8, radius * 2);
      }
    }
    ctx.restore();
  }

  drawIntroPoses(ctx) {
    const poses = [
      { side: 'player', pose: this.cosmetics.player.introPose },
      { side: 'cpu', pose: this.cosmetics.cpu.introPose }
    ].filter(entry => entry.pose);
    if (!poses.length || this.introPoseDuration <= 0) return;
    const progress = clamp(1 - this.introPoseTimer / this.introPoseDuration, 0, 1);
    const fade = clamp(Math.min(progress * 5, (1 - progress) * 7), 0, 1);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = 'rgba(0,0,8,0.48)';
    ctx.fillRect(0, this.height * 0.56, this.width, 108);
    poses.forEach(({ side, pose }) => {
      const x = side === 'player' ? this.width * 0.25 : this.width * 0.75;
      const color = pose.color || (side === 'player' ? '#39c5bb' : '#ff5a36');
      const frames = Math.max(1, Math.floor(finiteOr(pose.animation?.frames, 4)));
      const frame = Math.min(frames - 1, Math.floor(progress * frames));
      const poseDrawn = drawCosmeticAtlasFrame(
        ctx,
        pose.animation,
        frame,
        x,
        this.height * 0.64,
        178,
        178,
        {
          alpha: fade,
          facing: side === 'player' ? 1 : -1,
          glowColor: color,
          glowBlur: 24
        }
      );
      if (!poseDrawn) {
        this.drawPoseGlyph(ctx, x, this.height * 0.66, 48, pose.style || pose.animation?.key, color, progress);
      }
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 15px "Share Tech Mono", monospace';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fillText(getCosmeticName(pose, side === 'player' ? 'POSE J1' : 'POSE J2'), x, this.height * 0.73);
    });
    ctx.restore();
  }

  drawPoseGlyph(ctx, x, y, radius, style, color, progress) {
    const normalizedStyle = String(style || 'ready').replace(/^intro-|^victory-/, '');
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = rgba(color, 0.12);
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.translate(x, y);
    ctx.rotate((progress - 0.5) * (normalizedStyle === 'breach' ? 0.9 : 0.24));
    if (normalizedStyle === 'duel') {
      ctx.beginPath();
      ctx.moveTo(-radius, radius * 0.65);
      ctx.lineTo(radius, -radius * 0.65);
      ctx.moveTo(-radius, -radius * 0.65);
      ctx.lineTo(radius, radius * 0.65);
      ctx.stroke();
    } else if (normalizedStyle === 'echo') {
      [1, 0.72, 0.44].forEach(scale => {
        ctx.beginPath();
        ctx.arc(0, 0, radius * scale, -Math.PI * 0.8, Math.PI * 0.8);
        ctx.stroke();
      });
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (normalizedStyle === 'breach') {
        for (let index = 0; index < 6; index += 1) {
          const angle = (Math.PI * 2 * index) / 6;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4);
          ctx.lineTo(Math.cos(angle + 0.18) * radius * 1.25, Math.sin(angle + 0.18) * radius * 1.25);
          ctx.stroke();
        }
      } else {
        ctx.strokeRect(-radius * 0.5, -radius * 0.5, radius, radius);
      }
    }
    ctx.restore();
  }

  drawVictoryPose(ctx) {
    const event = this.victoryPoseEvent;
    const elapsed = event.duration - event.remaining;
    const progress = clamp(elapsed / Math.max(event.duration, 0.01), 0, 1);
    const color = event.pose.color || '#ffea00';
    const x = event.side === 'player' ? this.width * 0.28 : this.width * 0.72;
    ctx.save();
    const veil = ctx.createLinearGradient(0, this.height * 0.48, 0, this.height);
    veil.addColorStop(0, 'rgba(0,0,8,0)');
    veil.addColorStop(0.2, 'rgba(0,0,8,0.78)');
    veil.addColorStop(1, rgba(color, 0.24));
    ctx.fillStyle = veil;
    ctx.fillRect(0, this.height * 0.48, this.width, this.height * 0.52);
    const frames = Math.max(1, Math.floor(finiteOr(event.pose.animation?.frames, 4)));
    const frame = Math.min(frames - 1, Math.floor(progress * frames));
    const poseDrawn = drawCosmeticAtlasFrame(
      ctx,
      event.pose.animation,
      frame,
      x,
      this.height * 0.69,
      248,
      248,
      {
        alpha: clamp(Math.min(progress * 4, (1 - progress) * 5), 0.25, 1),
        facing: event.side === 'player' ? 1 : -1,
        glowColor: color,
        glowBlur: 30
      }
    );
    if (!poseDrawn) {
      this.drawPoseGlyph(ctx, x, this.height * 0.7, 72, event.pose.style || event.pose.animation?.key, color, progress);
    }
    ctx.textAlign = event.side === 'player' ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.font = 'bold 24px "Share Tech Mono", monospace';
    const textX = event.side === 'player' ? this.width * 0.44 : this.width * 0.56;
    ctx.fillText(getCosmeticName(event.pose, 'POSE DE VICTOIRE'), textX, this.height * 0.66);
    ctx.fillStyle = color;
    ctx.font = 'bold 14px "Share Tech Mono", monospace';
    ctx.fillText(String(event.fighterName || '').toUpperCase(), textX, this.height * 0.73);
    ctx.restore();
  }

  drawArena(ctx, animTime) {
    ctx.save();
    const material = this.levelProfile?.material;
    const edge = material?.edge || '#39c5bb';
    const detail = material?.detail || '#8dffea';
    const shadow = material?.shadow || '#020207';
    const floorY = this.groundY + 12;
    const floor = ctx.createLinearGradient(0, floorY, 0, this.height);
    floor.addColorStop(0, rgba(edge, 0.42));
    floor.addColorStop(0.08, material ? rgba(material.base, 0.9) : 'rgba(10, 12, 20, 0.88)');
    floor.addColorStop(1, rgba(shadow, 0.98));
    ctx.fillStyle = floor;
    ctx.fillRect(0, floorY, this.width, this.height - floorY);
    drawRecentUniverseTextureCover(ctx, this.universe, 'Combat', 0, floorY, this.width, this.height - floorY, 0.82);
    ctx.strokeStyle = rgba(edge, 0.66);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.width, floorY);
    ctx.stroke();
    ctx.strokeStyle = rgba(detail, 0.13);
    ctx.lineWidth = 1;
    for (let x = -120; x < this.width + 120; x += 80) {
      ctx.beginPath();
      ctx.moveTo(this.width / 2 + (x - this.width / 2) * 0.38, floorY);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = floorY + 32; y < this.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    if (material) {
      ctx.fillStyle = rgba(material.mid, 0.22);
      ctx.strokeStyle = rgba(material.detail, 0.2);
      if (['wood', 'miniature'].includes(material.pattern)) {
        for (let y = floorY + 16; y < this.height; y += 24) ctx.fillRect(0, y, this.width, 3);
      } else if (['organic', 'roots', 'infernal'].includes(material.pattern)) {
        for (let x = 16; x < this.width; x += 88) {
          ctx.beginPath();
          ctx.moveTo(x, this.height);
          ctx.quadraticCurveTo(x + 28, floorY + 32, x + 62, floorY);
          ctx.stroke();
        }
      } else if (['stone', 'alchemy', 'dungeon', 'moss', 'wetStone', 'ninja'].includes(material.pattern)) {
        for (let y = floorY + 18; y < this.height; y += 28) {
          const offset = Math.round((y / 28) % 2) * 22;
          for (let x = -offset; x < this.width; x += 44) ctx.strokeRect(x, y, 38, 16);
        }
      } else {
        for (let x = 24; x < this.width; x += 72) {
          ctx.fillRect(x, floorY + 18 + (x % 3) * 11, 18, 3);
        }
      }
    }
    const pulse = 0.45 + Math.sin(animTime * 0.04) * 0.18;
    ctx.fillStyle = rgba(material?.danger || '#ff4500', pulse * 0.12);
    ctx.fillRect(this.width / 2 - 2, 122, 4, floorY - 122);
    ctx.restore();
  }

  drawShadow(ctx, fighter) {
    if (fighter.y < this.groundY - 8) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.beginPath();
    ctx.ellipse(fighter.x, this.groundY + 4, 48, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawProjectile(ctx, projectile) {
    if (projectile.visualElapsed != null && drawCharacterSuperVisuals(ctx, getCharacterSuperVisualState({
      actor: projectile.owner, profile: projectile.action.identity, action: projectile.action, height: 142,
      projectileVisual: { phase: 'flight', x: projectile.x, y: projectile.y, elapsed: projectile.visualElapsed,
        travelProgress: Math.abs(projectile.x - projectile.visualOriginX) / projectile.visualFlightDistance }
    }))) return;
    ctx.save();
    ctx.fillStyle = projectile.color;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.fillRect(projectile.x - Math.sign(projectile.vx) * 70, projectile.y - 4, Math.sign(projectile.vx) * 70, 8);
    ctx.restore();
  }

  drawProjectileImpact(ctx, impact) {
    drawCharacterSuperVisuals(ctx, getCharacterSuperVisualState({
      actor: impact.owner, profile: impact.action.identity, action: impact.action, height: 142,
      projectileVisual: { phase: 'impact', x: impact.x, y: impact.y, elapsed: impact.elapsed, duration: impact.duration }
    }));
  }

  drawHud(ctx) {
    const player = this.getActive('player');
    const cpu = this.getActive('cpu');
    if (!player || !cpu) return;
    ctx.save();
    ctx.textBaseline = 'middle';
    this.drawFighterBar(ctx, player, 28, 26, 344, false);
    this.drawFighterBar(ctx, cpu, this.width - 372, 26, 344, true);
    ctx.fillStyle = 'rgba(2,2,8,0.9)';
    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 2;
    ctx.fillRect(this.width / 2 - 38, 22, 76, 54);
    ctx.strokeRect(this.width / 2 - 38, 22, 76, 54);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "Share Tech Mono", monospace';
    ctx.fillText(String(Math.ceil(this.timer)).padStart(2, '0'), this.width / 2, 49);
    ctx.font = 'bold 11px "Share Tech Mono", monospace';
    ctx.fillText(`M${this.roundNumber} · ${this.roundWins.player}–${this.roundWins.cpu}`, this.width / 2, 91);
    this.drawTeamPips(ctx, 'player', 28, 105, false);
    this.drawTeamPips(ctx, 'cpu', this.width - 28, 105, true);
    this.drawAssistIndicator(ctx, 'player', 28, 137, false);
    this.drawAssistIndicator(ctx, 'cpu', this.width - 28, 137, true);
    if (this.stats.player.currentCombo > 1) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffea00';
      ctx.font = 'bold 20px "Share Tech Mono", monospace';
      ctx.fillText(`${this.stats.player.currentCombo} IMPACTS`, 34, 158);
    }
    ctx.restore();
  }

  drawAssistIndicator(ctx, side, x, y, reverse) {
    const state = this.getAssistState(side);
    if (!state.assist) return;
    const color = state.assist.color || '#39c5bb';
    const width = 122;
    const left = reverse ? x - width : x;
    ctx.fillStyle = 'rgba(0,0,6,0.75)';
    ctx.strokeStyle = rgba(color, 0.7);
    ctx.lineWidth = 1;
    ctx.fillRect(left, y, width, 17);
    ctx.strokeRect(left, y, width, 17);
    ctx.fillStyle = color;
    const fillWidth = state.used ? 0 : (width - 4) * clamp(state.charge / 100, 0, 1);
    ctx.fillRect(reverse ? left + width - 2 - fillWidth : left + 2, y + 2, fillWidth, 13);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = reverse ? 'right' : 'left';
    ctx.font = 'bold 9px "Share Tech Mono", monospace';
    const status = state.used
      ? 'ASSIST USED'
      : state.charge >= 100
        ? 'ASSIST READY'
        : `ASSIST ${Math.floor(state.charge)}%`;
    ctx.fillText(status, reverse ? left + width - 5 : left + 5, y + 9);
  }

  drawFighterBar(ctx, fighter, x, y, width, reverse) {
    const hpPct = clamp(fighter.currentHp / fighter.maxHp, 0, 1);
    const guardPct = clamp(fighter.guard / 100, 0, 1);
    const meterPct = clamp(fighter.meter / 100, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.strokeStyle = fighter.secondaryColor || '#39c5bb';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, width, 67);
    ctx.strokeRect(x, y, width, 67);
    ctx.fillStyle = '#f5f7ff';
    ctx.textAlign = reverse ? 'right' : 'left';
    ctx.font = 'bold 13px "Share Tech Mono", monospace';
    ctx.fillText(String(fighter.name || fighter.id).slice(0, 28), reverse ? x + width - 10 : x + 10, y + 14);
    const barX = x + 10;
    const barW = width - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(barX, y + 25, barW, 17);
    ctx.fillStyle = hpPct > 0.28 ? '#39c56b' : '#ff4c4c';
    const hpW = barW * hpPct;
    ctx.fillRect(reverse ? barX + barW - hpW : barX, y + 25, hpW, 17);
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.fillRect(barX, y + 47, barW, 5);
    ctx.fillStyle = '#7df9ff';
    const guardW = barW * guardPct;
    ctx.fillRect(reverse ? barX + barW - guardW : barX, y + 47, guardW, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.fillRect(barX, y + 56, barW, 5);
    ctx.fillStyle = '#ffea00';
    const meterW = barW * meterPct;
    ctx.fillRect(reverse ? barX + barW - meterW : barX, y + 56, meterW, 5);
  }

  drawTeamPips(ctx, side, startX, y, reverse) {
    const team = this.getTeam(side);
    team.fighters.forEach((fighter, index) => {
      const offset = index * 96 * (reverse ? -1 : 1);
      const x = startX + offset;
      ctx.fillStyle = fighter.currentHp <= 0 ? '#3a3036' : index === team.activeIndex ? '#ffea00' : '#39c5bb';
      ctx.fillRect(reverse ? x - 88 : x, y, 88, 6);
      ctx.fillStyle = '#b8c9d0';
      ctx.textAlign = reverse ? 'right' : 'left';
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.fillText(fighter.currentHp <= 0 ? 'KO' : String(fighter.name || '').slice(0, 12), reverse ? x : x, y + 15);
    });
  }

  drawAnnouncement(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px "Share Tech Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff4500';
    ctx.shadowBlur = 18;
    ctx.fillText(this.countdown > 0 ? String(Math.ceil(this.countdown)) : this.announcement, this.width / 2, this.height * 0.38, this.width * 0.92);
    ctx.restore();
  }
}
