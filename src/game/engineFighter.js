import { drawPixelSprite } from './renderer';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';
import { drawRecentUniverseTextureCover } from './recentUniverseTextureAssets';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const rgba = (hex, alpha) => {
  const value = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex.slice(1) : '39c5bb';
  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}, ${alpha})`;
};

const DIFFICULTY = {
  training: { reaction: 0.42, aggression: 0.48, guardChance: 0.24, damage: 0.9 },
  standard: { reaction: 0.27, aggression: 0.67, guardChance: 0.42, damage: 1 },
  expert: { reaction: 0.16, aggression: 0.82, guardChance: 0.62, damage: 1.12 }
};

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
    this.playerInput = {};
    this.projectiles = [];
    this.elapsed = 0;
    this.timer = 99;
    this.countdown = 3.2;
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
    this.stats = {
      player: { damage: 0, taken: 0, kos: 0, tags: 0, maxCombo: 0, currentCombo: 0, comboTimer: 0 },
      cpu: { damage: 0, taken: 0, kos: 0, tags: 0, maxCombo: 0, currentCombo: 0, comboTimer: 0 }
    };
  }

  setInput(input = {}) {
    this.playerInput = input;
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
    if (action === 'tag') return this.requestTag('player', index);
    if (action === 'jump') return this.tryJump(this.getActive('player'));
    return this.tryAction('player', action);
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
      super: { duration: 0.92, hitAt: 0.45, base: 43, range: this.width, guardDamage: 42, knockback: 330, meterCost: 100 }
    };
    const spec = specs[type];
    if (!spec || fighter.meter < (spec.meterCost || 0)) return false;

    if (type === 'light') {
      fighter.comboStep = fighter.comboWindow > 0 ? (fighter.comboStep % 3) + 1 : 1;
      fighter.comboWindow = 0.68;
      spec.base += (fighter.comboStep - 1) * 2.2;
      spec.knockback += (fighter.comboStep - 1) * 28;
    } else {
      fighter.comboStep = 0;
      fighter.comboWindow = 0;
    }

    fighter.meter = Math.max(0, fighter.meter - (spec.meterCost || 0));
    fighter.guarding = false;
    fighter.state = 'attack';
    fighter.action = { ...spec, type, elapsed: 0, resolved: false };
    this.playSfx(type === 'light' ? 'slash' : type === 'heavy' ? 'hit' : 'special');
    if (type === 'super') {
      this.announcement = fighter.special?.name || 'RUPTURE ULTIME';
      this.announcementTimer = 1.1;
      this.spawnBurst(fighter.x, fighter.y - 60, fighter.secondaryColor || fighter.primaryColor || '#ffea00', 28);
    }
    return true;
  }

  requestTag(side, index, forced = false) {
    const team = this.getTeam(side);
    const active = this.getActive(side);
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
    next.x = clamp(active.x + (side === 'player' ? -34 : 34), 78, this.width - 78);
    next.y = this.groundY;
    next.vx = side === 'player' ? 150 : -150;
    next.vy = -90;
    next.facing = side === 'player' ? 1 : -1;
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
    if (this.completionReported) return;
    this.elapsed += step;

    if (this.finished) {
      this.completionDelay -= step;
      if (this.completionDelay <= 0 && !this.completionReported) {
        this.completionReported = true;
        this.onComplete(this.result, this.getSummary());
      }
      return;
    }

    if (this.countdown > 0) {
      const before = Math.ceil(this.countdown);
      this.countdown = Math.max(0, this.countdown - step);
      const after = Math.ceil(this.countdown);
      if (after !== before) this.playSfx(after > 0 ? 'click' : 'special');
      if (this.countdown === 0) {
        this.announcement = 'IMPACT';
        this.announcementTimer = 0.9;
      }
      this.updatePassive(step);
      return;
    }

    if (this.hitStop > 0) {
      this.hitStop -= step;
      return;
    }

    this.timer = Math.max(0, this.timer - step);
    if (this.timer <= 0) {
      this.finishByTime();
      return;
    }

    this.updatePassive(step);
    this.updatePlayer(step);
    this.updateAi(step);
    this.updateActions(step);
    this.updateProjectiles(step);
    this.resolveSpacing();
    this.resolveKnockouts(step);
  }

  updatePassive(dt) {
    if (this.announcementTimer > 0) this.announcementTimer -= dt;
    Object.entries(this.teams).forEach(([side, team]) => {
      team.tagCooldown = Math.max(0, team.tagCooldown - dt);
      team.fighters.forEach((fighter, index) => {
        fighter.hitstun = Math.max(0, fighter.hitstun - dt);
        fighter.guardBreak = Math.max(0, fighter.guardBreak - dt);
        fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
        fighter.comboWindow = Math.max(0, fighter.comboWindow - dt);
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
    const fighter = this.getActive('player');
    const target = this.getActive('cpu');
    if (!fighter || fighter.currentHp <= 0) return;
    const grounded = fighter.y >= this.groundY - 2;
    const canInput = this.canAct(fighter);
    const guard = Boolean(this.playerInput.guard) && canInput && grounded;
    const crouch = Boolean(this.playerInput.down) && canInput && grounded && !guard;
    fighter.guarding = guard;
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
    const direction = (this.playerInput.right ? 1 : 0) - (this.playerInput.left ? 1 : 0);
    this.moveFighter(fighter, target, direction, dt);
  }

  updateAi(dt) {
    const fighter = this.getActive('cpu');
    const target = this.getActive('player');
    if (!fighter || fighter.currentHp <= 0 || !target) return;
    const distance = Math.abs(target.x - fighter.x);
    this.aiThink -= dt;
    this.aiGuardTimer = Math.max(0, this.aiGuardTimer - dt);

    if (this.canAct(fighter) && target.action && distance < 118 && Math.random() < this.difficulty.guardChance * dt * 8) {
      this.aiGuardTimer = 0.24 + Math.random() * 0.24;
    }
    fighter.guarding = this.aiGuardTimer > 0 && this.canAct(fighter) && fighter.y >= this.groundY - 2;
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
    fighter.facing = target.x >= fighter.x ? 1 : -1;
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
        if (action.type === 'special' && fighter.ranged) {
          this.spawnProjectile(fighter, action);
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

  spawnProjectile(fighter, action) {
    const color = fighter.secondaryColor || fighter.weaponColor || '#39c5bb';
    this.projectiles.push({
      side: fighter.side,
      owner: fighter,
      x: fighter.x + fighter.facing * 58,
      y: fighter.y - 64,
      vx: fighter.facing * 520,
      radius: action.type === 'super' ? 22 : 13,
      life: 1.25,
      action: { ...action, range: 34 },
      color
    });
    this.particles.add(fighter.x, fighter.y - 62, fighter.facing * 5, 0, color, 6, 34, 'laser_line');
  }

  updateProjectiles(dt) {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      projectile.x += projectile.vx * dt;
      projectile.life -= dt;
      const target = this.getOpponent(projectile.side);
      const targetCenterY = target?.y - (target?.crouching ? 32 : 56);
      const targetHalfHeight = target?.crouching ? 28 : 66;
      if (
        target
        && target.currentHp > 0
        && Math.abs(projectile.x - target.x) < projectile.radius + 32
        && Math.abs(projectile.y - targetCenterY) < targetHalfHeight
      ) {
        this.applyHit(projectile.owner, target, projectile.action, true);
        this.projectiles.splice(index, 1);
      } else if (projectile.life <= 0 || projectile.x < -40 || projectile.x > this.width + 40) {
        this.projectiles.splice(index, 1);
      }
    }
  }

  attemptHit(attacker, target, action) {
    if (!target || target.currentHp <= 0 || target.invulnerable > 0) return false;
    const inFront = attacker.facing > 0 ? target.x >= attacker.x : target.x <= attacker.x;
    const closeY = Math.abs(target.y - attacker.y) < 92;
    if (!inFront || !closeY || Math.abs(target.x - attacker.x) > action.range) return false;
    this.applyHit(attacker, target, action, false);
    return true;
  }

  applyHit(attacker, target, action, projectile = false) {
    if (target.invulnerable > 0 || target.currentHp <= 0) return;
    const facingAttacker = target.facing === Math.sign(attacker.x - target.x);
    const blocked = target.guarding && facingAttacker && target.guardBreak <= 0;
    const attackScale = attacker.attackPower / 18;
    const defenseScale = 1 - clamp(target.defensePower * 0.012, 0.05, 0.28);
    const cpuScale = attacker.side === 'cpu' ? this.difficulty.damage : 1;
    let damage = Math.max(3, action.base * attackScale * defenseScale * cpuScale);

    if (blocked) {
      damage *= 0.2;
      target.guard = Math.max(0, target.guard - action.guardDamage);
      target.vx = attacker.facing * action.knockback * 0.26;
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
      target.hitstun = action.type === 'super' ? 0.78 : action.type === 'heavy' ? 0.42 : 0.24;
      target.state = 'hit';
      target.vx = attacker.facing * action.knockback;
      target.vy = action.type === 'super' ? -235 : action.type === 'heavy' ? -130 : -60;
      this.playSfx(projectile ? 'shoot' : 'hit');
      this.spawnBurst(target.x, target.y - 60, attacker.secondaryColor || '#ff5a36', action.type === 'super' ? 26 : 12);
      this.hitStop = action.type === 'super' ? 0.1 : action.type === 'heavy' ? 0.055 : 0.025;
    }

    damage = Math.round(damage * 10) / 10;
    target.currentHp = Math.max(0, target.currentHp - damage);
    attacker.meter = clamp(attacker.meter + damage * (blocked ? 0.42 : 0.82), 0, 100);
    target.meter = clamp(target.meter + damage * 0.55, 0, 100);
    this.stats[attacker.side].damage += damage;
    this.stats[target.side].taken += damage;
    this.stats[attacker.side].currentCombo += 1;
    this.stats[attacker.side].comboTimer = 0.82;
    this.stats[attacker.side].maxCombo = Math.max(this.stats[attacker.side].maxCombo, this.stats[attacker.side].currentCombo);
    this.particles.add(target.x - 14, target.y - 100, 0, -1.1, blocked ? '#7df9ff' : '#ffffff', 5, 38, 'text', blocked ? 'GUARD' : `${Math.round(damage)}`);

    if (target.currentHp <= 0) {
      target.state = 'dead';
      target.koDelay = 0.9;
      target.vx = attacker.facing * Math.max(action.knockback, 250);
      target.vy = -210;
      this.stats[attacker.side].kos += 1;
      this.announcement = 'K.O.';
      this.announcementTimer = 1;
      this.playSfx('defeat');
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
    if (!player.action) player.facing = cpu.x >= player.x ? 1 : -1;
    if (!cpu.action) cpu.facing = player.x >= cpu.x ? 1 : -1;
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
      } else if (!this.finished) {
        this.finish(side === 'cpu' ? 'victory' : 'defeat');
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
    this.finish(playerRatio >= cpuRatio ? 'victory' : 'defeat', true);
  }

  finish(result, timeout = false) {
    this.finished = true;
    this.result = result;
    this.completionDelay = 1.05;
    this.announcement = timeout ? (result === 'victory' ? 'TEMPS - AVANTAGE' : 'TEMPS - REPLI') : result === 'victory' ? 'VICTOIRE' : 'DEFAITE';
    this.announcementTimer = 4;
    this.playSfx(result === 'victory' ? 'victory' : 'defeat');
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
      duration: Math.round((99 - this.timer) * 10) / 10,
      remainingTime: Math.ceil(this.timer),
      damageDealt: Math.round(playerStats.damage),
      damageTaken: Math.round(playerStats.taken),
      knockouts: playerStats.kos,
      tags: playerStats.tags,
      maxCombo: playerStats.maxCombo,
      survivingFighters: this.getTeam('player').fighters.filter(fighter => fighter.currentHp > 0).length,
      rewards: this.result === 'victory'
        ? { gold: 45 + playerStats.kos * 12, shards: 15 + ({ S: 12, A: 8, B: 5, C: 2 }[grade] || 0), seasonXp: 28 + playerStats.kos * 5 }
        : { gold: 0, shards: 0, seasonXp: 8 }
    };
  }

  getSnapshot() {
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
          active: fighter.index === team.activeIndex,
          ko: fighter.currentHp <= 0
        }))
      };
    };
    return {
      phase: this.finished ? this.result : this.countdown > 0 ? 'countdown' : 'running',
      timer: Math.ceil(this.timer),
      countdown: Math.ceil(this.countdown),
      announcement: this.announcementTimer > 0 ? this.announcement : '',
      player: serializeTeam('player'),
      cpu: serializeTeam('cpu'),
      combo: this.stats.player.currentCombo,
      maxCombo: this.stats.player.maxCombo
    };
  }

  draw(ctx, animTime) {
    this.drawArena(ctx, animTime);
    this.projectiles.forEach(projectile => this.drawProjectile(ctx, projectile));
    const player = this.getActive('player');
    const cpu = this.getActive('cpu');
    [player, cpu].filter(Boolean).forEach(fighter => {
      this.drawShadow(ctx, fighter);
      ctx.save();
      if (fighter.invulnerable > 0 && Math.floor(this.elapsed * 20) % 2 === 0) ctx.globalAlpha = 0.45;
      drawPixelSprite(ctx, fighter.x, fighter.y, fighter, animTime, fighter.facing, 142, 'melee');
      ctx.restore();
    });
    this.drawHud(ctx);
    if (this.announcementTimer > 0) this.drawAnnouncement(ctx);
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
    this.drawTeamPips(ctx, 'player', 28, 105, false);
    this.drawTeamPips(ctx, 'cpu', this.width - 28, 105, true);
    if (this.stats.player.currentCombo > 1) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffea00';
      ctx.font = 'bold 20px "Share Tech Mono", monospace';
      ctx.fillText(`${this.stats.player.currentCombo} IMPACTS`, 34, 158);
    }
    ctx.restore();
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
    ctx.fillText(this.countdown > 0 ? String(Math.ceil(this.countdown)) : this.announcement, this.width / 2, this.height * 0.38);
    ctx.restore();
  }
}
