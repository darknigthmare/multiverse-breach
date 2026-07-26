// Final Fantasy Record Keeper ATB RPG Engine with Synergies & Status Effects
import { drawPixelSprite, drawPixelEnemy, drawBoss } from './renderer';
import { SYNERGIES_DB } from './heroes';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';

export class EngineRpg {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete, stage = {}) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    this.stage = stage;
    this.levelProfile = getRecentUniverseLevelProfile(stage.universe);

    const heroPosition = (idx) => {
      const lane = this.levelProfile?.rpg?.heroLanes?.[idx];
      return lane
        ? { x: Math.round(width * lane.x), y: Math.round(height * lane.y) }
        : { x: 70 + idx * 45, y: 90 + idx * 55 };
    };

    this.heroes = heroes.map((h, idx) => ({
      ...h,
      x: heroPosition(idx).x,
      y: heroPosition(idx).y,
      homeX: heroPosition(idx).x,
      homeY: heroPosition(idx).y,
      state: 'idle',
      stateTimer: 0,
      atb: Math.random() * 20,
      cooldown: 0,
      specialCharge: 0,
      maxHp: h.stats.hp,
      currentHp: h.stats.hp,
      facing: 1,
      statusEffects: { infected: 0, glitched: 0, radiated: 0 }
    }));

    // Calculate Synergy Sets
    const categoriesCount = this.heroes.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {});
    
    this.activeSynergies = SYNERGIES_DB.filter(syn => (categoriesCount[syn.category] || 0) >= 2);
    this.activeSynergies.forEach(syn => {
      this.heroes.forEach(h => {
        if (syn.multiplier.hp) {
          h.maxHp = Math.round(h.maxHp * syn.multiplier.hp);
          h.currentHp = h.maxHp;
        }
        if (syn.multiplier.atk) h.stats.atk = Math.round(h.stats.atk * syn.multiplier.atk);
        if (syn.multiplier.def) h.stats.def = Math.round(h.stats.def * syn.multiplier.def);
        if (syn.multiplier.spd) h.stats.spd = Math.round(h.stats.spd * syn.multiplier.spd);
      });
    });

    this.enemiesData = enemiesData;
    this.finalePolicy = enemiesData.finalePolicy || null;
    this.enemies = [];
    this.wave = 1;
    this.maxWaves = enemiesData.worldBoss ? 3 : 2;
    this.isBossStage = (enemiesData.bosses?.length || 0) > 0 || !!enemiesData.worldBoss;
    this.isFinalBoss = false;
    this.finalBossChaosTimer = 0;
    
    this.spawnWave();

    this.selectedHeroId = this.heroes[0].id;
    this.gameOver = false;
    this.victoryTimer = 0;
    this.completionReported = false;
    this.autoBattle = false;
    this.enemyActionLock = false;
    this.enemyGlobalRecovery = 70;
  }

  spawnWave() {
    this.enemies = [];
    const w = this.wave;

    if (w === 1) {
      // Spawn 3 standard monsters aligned diagonally
      const templates = this.enemiesData.monsters;
      for (let i = 0; i < 3; i++) {
        const t = templates[i] || templates[0];
        const lane = this.levelProfile?.rpg?.enemyLanes?.[i];
        const homeX = lane ? Math.round(this.width * lane.x) : this.width - 200 + i * 45;
        const homeY = lane ? Math.round(this.height * lane.y) : 90 + i * 55;
        this.enemies.push({
          ...t,
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          state: 'idle',
          stateTimer: 0,
          atb: Math.random() * 30,
          maxHp: t.hp || 90,
          currentHp: t.hp || 90,
          facing: -1,
          isBoss: false,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        });
      }
    } else if (w === 2) {
      // Spawn 2 Bosses aligned diagonally
      const templates = this.enemiesData.bosses;
      for (let i = 0; i < 2; i++) {
        const t = templates[i] || templates[0];
        const lane = this.levelProfile?.rpg?.bossLanes?.[i];
        const homeX = lane ? Math.round(this.width * lane.x) : this.width - 170 + i * 50;
        const homeY = lane ? Math.round(this.height * lane.y) : 110 + i * 80;
        this.enemies.push({
          ...t,
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          state: 'idle',
          stateTimer: 0,
          atb: Math.random() * 15,
          maxHp: t.hp || 450,
          currentHp: t.hp || 450,
          facing: -1,
          isBoss: true,
          statusEffects: { infected: 0, glitched: 0, radiated: 0 }
        });
      }
      this.playSfx('portal');
    } else if (w === 3) {
      // Spawn 1 Giant World Boss
      const t = this.enemiesData.worldBoss;
      if (!t) return;
      const lane = this.levelProfile?.rpg?.worldBoss;
      const anchor = t.anchor;
      const homeX = Number.isFinite(anchor?.x)
        ? Math.round(this.width * anchor.x)
        : lane
          ? Math.round(this.width * lane.x)
          : this.width - 140;
      const homeY = Number.isFinite(anchor?.y)
        ? Math.round(this.height * anchor.y)
        : lane
          ? Math.round(this.height * lane.y)
          : 140;
      this.enemies.push({
        ...t,
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        state: 'idle',
        stateTimer: 0,
        atb: 0,
        maxHp: t.hp || 1200,
        currentHp: t.hp || 1200,
        facing: -1,
        isBoss: true,
        isWorldBoss: true,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      });
      this.playSfx('portal');
    }
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

  triggerAbility(hero, abilityType) {
    if (hero.currentHp <= 0 || hero.state === 'dead' || hero.atb < 100 || this.gameOver) return;

    const target = this.getRandomAliveEnemy();
    if (!target) return;

    hero.atb = 0;
    if (target.x !== hero.x) hero.facing = target.x > hero.x ? 1 : -1;

    if (abilityType === 'simple') {
      hero.state = 'attack';
      hero.stateTimer = 30;
      hero.x = target.x - 50;
      hero.y = target.y;

      this.playSfx(hero.weaponType === 'gun' || hero.weaponType === 'laser' ? 'shoot' : 'slash');

      setTimeout(() => {
        if (target.currentHp > 0) {
          // Status effect chances: Leon infects
          let status = null;
          if (hero.id === 'leon') status = 'infected';
          this.applyDamage(hero, target, hero.stats.atk * hero.simple.dmg, status);
        }
        hero.x = hero.homeX;
        hero.y = hero.homeY;
      }, 200);

      hero.specialCharge = Math.min(100, hero.specialCharge + 12);

    } else if (abilityType === 'secondary') {
      if (hero.cooldown > 0) return;
      hero.state = 'attack';
      hero.stateTimer = 30;
      hero.cooldown = hero.secondary.cd * 60;

      this.playSfx('shoot');
      this.particles.add(hero.x + 15, hero.y - 4, 8, 0, hero.secondaryColor || '#ff9900', 6, 40, 'laser_line');

      setTimeout(() => {
        if (target.currentHp > 0) {
          this.applyDamage(hero, target, hero.stats.atk * hero.secondary.dmg);
        }
      }, 300);

      hero.specialCharge = Math.min(100, hero.specialCharge + 20);

    } else if (abilityType === 'defense') {
      hero.state = 'defense';
      hero.stateTimer = hero.defense.dur * 60;
      this.playSfx('shield');
      this.particles.add(hero.x, hero.y - 6, 0, 0, hero.secondaryColor || '#00ffff', 4, 15, 'spark');

    } else if (abilityType === 'special') {
      if (hero.specialCharge < 100) return;
      hero.specialCharge = 0;
      hero.state = 'special';
      hero.stateTimer = 45;
      
      this.playSfx('special');
      this.particles.add(this.width/2, this.height/2, 0, 0, hero.primaryColor, 300, 35, 'glitch');
      this.particles.add(hero.x - 10, hero.y - 40, 0, -0.4, '#f1c40f', 16, 90, 'text', `${hero.special.name.toUpperCase()}!`);

      this.enemies.forEach(e => {
        if (e.currentHp > 0) {
          setTimeout(() => {
            // Special glitch effect by Neo
            let status = null;
            if (hero.id === 'neo') status = 'glitched';
            this.applyDamage(hero, e, hero.stats.atk * hero.special.dmg, status);
          }, 250);
        }
      });
    }

    setTimeout(() => {
      const nextReady = this.heroes.find(h => h.currentHp > 0 && h.atb >= 100);
      if (nextReady) this.selectedHeroId = nextReady.id;
    }, 400);
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
    if (defender.state === 'defense') {
      baseDmg *= (1 - defender.defense.reduce);
    }
    
    // Apply attacker talent modifications
    if (attacker && attacker.talent) {
      if (attacker.talent === 'reality_warp' && Math.random() < 0.20) {
        statusEffect = 'glitched';
      }
      if (attacker.talent === 'incendiary' && Math.random() < 0.25) {
        statusEffect = 'radiated';
      }
      if (attacker.talent === 'suppressing_fire' && defender.stats) {
        defender.stats.def = Math.round(defender.stats.def * 0.8);
        this.particles.add(defender.x, defender.y - 45, 0, -1.2, '#3498db', 11, 50, 'text', 'DEF DOWN');
      }
    }

    const variance = (Math.random() * 0.2) + 0.9;
    const finalDmg = Math.round(baseDmg * variance);

    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);

    // Nanite lifesteal
    if (attacker && attacker.talent === 'lifedrain' && attacker.currentHp > 0) {
      const heal = Math.round(finalDmg * 0.10);
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
      this.particles.add(attacker.x, attacker.y - 20, 0, -1, '#2ecc71', 11, 40, 'text', `+${heal} HP`);
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
    if (this.gameOver) {
      this.victoryTimer++;
      if (this.victoryTimer > 120 && !this.completionReported) {
        this.completionReported = true;
        const alive = this.heroes.some(h => h.currentHp > 0);
        this.onComplete(alive ? 'victory' : 'defeat');
      }
      return;
    }

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
      if (this.wave < this.maxWaves) {
        this.wave++;
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

      if (h.state === 'idle') {
        if (h.atb < 100) {
          h.atb = Math.min(100, h.atb + atbRate);
        }
        if (this.autoBattle && h.atb >= 100) {
          if (h.specialCharge >= 100) {
            this.triggerAbility(h, 'special');
          } else if (h.cooldown <= 0) {
            this.triggerAbility(h, 'secondary');
          } else {
            this.triggerAbility(h, 'simple');
          }
        }
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
          e.x = e.homeX;
          e.y = e.homeY;
        }
      }

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

      if (!this.enemyActionLock && this.enemyGlobalRecovery <= 0 && e.atb >= 100 && e.state === 'idle') {
        const target = this.getRandomAliveHero();
        if (target) {
          this.enemyActionLock = true;
          e.atb = 0;
          e.state = 'attack';
          e.stateTimer = 40;
          if (target.x !== e.x) e.facing = target.x > e.x ? 1 : -1;
          e.x = target.x + 50;
          e.y = target.y;

          this.playSfx(e.weapon === 'gun' || e.weapon === 'laser' ? 'shoot' : 'slash');

          setTimeout(() => {
            if (target.currentHp > 0) {
              // Bosses can inflict status effects
              let status = null;
              if (e.name.includes('Nemesis')) status = 'infected';
              if (e.name.includes('Smith')) status = 'glitched';
              if (e.name.includes('Deathclaw') || e.name.includes('Cyberdemon')) status = 'radiated';

              this.applyDamage(e, target, e.atk, status);
            }
            this.enemyActionLock = false;
            this.enemyGlobalRecovery = e.isBoss ? 85 : 110;
          }, 200);
        }
      }
    });
  }

  draw(ctx, animTime) {
    this.heroes.forEach(h => {
      drawPixelSprite(ctx, h.x, h.y, h, animTime, h.facing, 72, 'rpg');

      if (h.id === this.selectedHeroId && h.currentHp > 0) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(h.x - 18, h.y - 30, 36, 42);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('ACTIVE', h.x - 20, h.y - 36);
      }

      if (h.currentHp > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(h.x - 20, h.y + 18, 40, 3);
        const hpPct = h.currentHp / h.maxHp;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(h.x - 20, h.y + 18, 40 * hpPct, 3);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(h.x - 20, h.y + 23, 40, 3);
        const atbPct = h.atb / 100;
        ctx.fillStyle = h.atb >= 100 ? '#f1c40f' : '#3498db';
        ctx.fillRect(h.x - 20, h.y + 23, 40 * atbPct, 3);
      }
    });

    this.enemies.forEach(e => {
      if (e.isBoss) {
        drawBoss(ctx, e.x, e.y, e, animTime, e.facing);
      } else {
        drawPixelEnemy(ctx, e.x, e.y, e, animTime, e.facing);
      }

      if (e.currentHp > 0) {
        const width = e.isBoss ? 70 : 36;
        const xOffset = e.isBoss ? -35 : -18;
        const yOffset = e.isBoss ? 40 : 18;

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
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(`WAVE: ${this.wave}/${this.maxWaves}`, 20, 22);
  }
}
