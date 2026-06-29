// Super Smash Bros Mêlée Mode Engine with Synergies & Status Effects
import { drawPixelSprite, drawPixelEnemy, drawBoss } from './renderer';
import { SYNERGIES_DB } from './heroes';

export class EngineSmash {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    
    // Map base heroes
    this.heroes = heroes.map((h, index) => ({
      ...h,
      x: 100 + index * 30,
      y: 200,
      vx: 0,
      vy: 0,
      state: 'idle',
      stateTimer: 0,
      cooldown: 0,
      specialCharge: 0,
      maxHp: h.stats.hp,
      currentHp: h.stats.hp,
      isLeader: index === 0,
      facing: 1,
      targetY: 200,
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

    // Setup wave of enemies
    this.enemiesData = enemiesData;
    this.enemies = [];
    this.wave = 1;
    this.maxWaves = 4;
    this.gameOver = false;
    this.victoryTimer = 0;
    this.activeHeroId = this.heroes[0].id;
    this.groundY = 240;
    this.platforms = [
      { x1: 50, x2: width - 50, y: this.groundY },
      { x1: 200, x2: 400, y: 150 },
      { x1: width - 400, x2: width - 200, y: 150 }
    ];
  }

  getActiveHero() {
    return this.heroes.find(h => h.id === this.activeHeroId) || this.heroes[0];
  }

  setActiveHero(id) {
    const next = this.heroes.find(h => h.id === id);
    if (next && next.currentHp > 0) {
      this.heroes.forEach(h => h.isLeader = false);
      next.isLeader = true;
      this.activeHeroId = id;
      this.playSfx('jump');
    }
  }

  spawnEnemy() {
    if (this.gameOver) return;
    const waveType = this.wave;

    let template;
    let isBoss = false;

    if (waveType === 1) {
      template = this.enemiesData.monsters[0];
    } else if (waveType === 2) {
      template = this.enemiesData.monsters[1] || this.enemiesData.monsters[0];
    } else if (waveType === 3) {
      template = this.enemiesData.monsters[2] || this.enemiesData.monsters[0];
    } else {
      isBoss = true;
      template = this.enemiesData.worldBoss || this.enemiesData.bosses[0];
    }

    this.enemies.push({
      ...template,
      x: this.width - 70 - Math.random() * 50,
      y: 100,
      vx: 0, vy: 0,
      state: 'idle',
      stateTimer: 0,
      maxHp: template.hp || 90,
      currentHp: template.hp || 90,
      isBoss: isBoss,
      facing: -1,
      cooldown: isBoss ? 110 : 80 + Math.random() * 40,
      statusEffects: { infected: 0, glitched: 0, radiated: 0 }
    });

    this.playSfx('portal');
    this.particles.add(this.width - 100, this.groundY - 10, 0, 0, '#9b59b6', 15, 45, 'portal');
  }

  triggerAbility(hero, abilityType) {
    if (hero.currentHp <= 0 || hero.state === 'dead' || this.gameOver) return;

    if (abilityType === 'simple') {
      hero.state = 'attack';
      hero.stateTimer = 15;
      this.playSfx(hero.weaponType === 'gun' || hero.weaponType === 'chainsaw' ? 'shoot' : 'slash');
      
      const range = 70;
      const reachX = hero.x + hero.facing * range;
      
      this.enemies.forEach(e => {
        if (e.currentHp > 0 && Math.abs(e.y - hero.y) < 30 && ((hero.facing === 1 && e.x > hero.x && e.x < reachX) || (hero.facing === -1 && e.x < hero.x && e.x > reachX))) {
          let status = null;
          if (hero.id === 'leon') status = 'infected';
          this.applyDamage(hero, e, hero.stats.atk * hero.simple.dmg, 10, status);
        }
      });
      hero.specialCharge = Math.min(100, hero.specialCharge + 10);

    } else if (abilityType === 'secondary') {
      if (hero.cooldown > 0) return;
      hero.state = 'attack';
      hero.stateTimer = 20;
      hero.cooldown = hero.secondary.cd * 60;
      this.playSfx('shoot');

      const projX = hero.x + hero.facing * 15;
      const projY = hero.y - 4;
      const projVx = hero.facing * 8;
      
      this.particles.add(projX, projY, projVx, 0, hero.secondaryColor || '#fff', 6, 60, 'laser_line');

      let hitSomething = false;
      this.enemies.forEach(e => {
        if (e.currentHp > 0 && Math.abs(e.y - hero.y) < 35 && ((hero.facing === 1 && e.x > hero.x) || (hero.facing === -1 && e.x < hero.x))) {
          const dist = Math.abs(e.x - hero.x);
          if (dist < 300 && !hitSomething) {
            this.applyDamage(hero, e, hero.stats.atk * hero.secondary.dmg, 20);
            hitSomething = true;
          }
        }
      });
      hero.specialCharge = Math.min(100, hero.specialCharge + 15);

    } else if (abilityType === 'defense') {
      hero.state = 'defense';
      hero.stateTimer = hero.defense.dur * 60;
      this.playSfx('shield');
      this.particles.add(hero.x, hero.y - 6, 0, 0, hero.secondaryColor || '#00ffff', 4, 15, 'spark');

    } else if (abilityType === 'special') {
      if (hero.specialCharge < 100) return;
      hero.specialCharge = 0;
      hero.state = 'attack';
      hero.stateTimer = 40;
      this.playSfx('special');

      this.particles.add(this.width/2, this.height/2, 0, 0, hero.primaryColor, 300, 30, 'glitch');
      this.particles.add(hero.x - 30, hero.y - 50, 0, -0.5, '#f1c40f', 16, 80, 'text', `!!! ${hero.special.name.toUpperCase()} !!!`);

      this.enemies.forEach(e => {
        if (e.currentHp > 0) {
          let status = null;
          if (hero.id === 'neo') status = 'glitched';
          this.applyDamage(hero, e, hero.stats.atk * hero.special.dmg, 45, status);
        }
      });
    }
  }

  triggerCombatEvent(effect) {
    if (this.gameOver) return;
    this.playSfx('special');
    this.particles.add(this.width/2, this.height/2, 0, 0, '#ffffff', 300, 35, 'glitch');

    switch (effect) {
      case 'hammer_strike':
      case 'redeemer_blast':
      case 'fatman_nuke':
      case 'spell_avada':
      case 'orbital_laser':
      case 'digivolve_warp': {
        const dmg = effect === 'redeemer_blast' ? 350 : effect === 'digivolve_warp' ? 280 : (effect === 'fatman_nuke' || effect === 'orbital_laser') ? 250 : effect === 'spell_avada' ? 200 : 160;
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            let status = null;
            if (effect === 'orbital_laser') status = 'glitched';
            this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#f1c40f' }, e, dmg, 25, status);
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
            e.vx = 22;
            e.vy = -5;
            e.state = 'hit';
            e.stateTimer = 180;
            this.applyDamage({ x: 0, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#3498db' }, e, dmg, 20);
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
              this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#2ecc71' }, e, enemyDmg, 15);
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
            e.vx = 0;
            e.state = 'hit';
            e.stateTimer = duration;
            this.particles.add(e.x, e.y - 15, 0, 0, '#00ff00', 8, 15, 'spark');
            if (effect === 'marker_insanity') {
              this.applyDamage({ x: e.x - 40, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#8e44ad' }, e, 120, 0);
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
            this.particles.add(h.x, h.y - 10, 0, 0, '#ffeb3b', 8, 15, 'spark');
          }
        });
        break;
      }
      case 'circus_glitch': {
        this.enemies.forEach(e => {
          if (e.currentHp > 0 && e.statusEffects) {
            e.statusEffects.glitched = 360;
            this.applyDamage({ x: e.x - 30, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, e, 100, 0);
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
          this.applyDamage({ x: strongest.x - 30, y: strongest.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, strongest, dmg, 0);
        }
        break;
      }
      default: {
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            this.applyDamage({ x: e.x - 30, y: e.y, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#ffeb3b' }, e, 120, 10);
          }
        });
      }
    }
  }


  applyDamage(attacker, defender, baseDmg, knockbackForce = 10, statusEffect = null) {
    if (defender.state === 'defense') {
      baseDmg *= (1 - defender.defense.reduce);
    }
    const variance = (Math.random() * 0.2) + 0.9;
    const finalDmg = Math.round(baseDmg * variance);
    
    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);
    
    const dir = attacker.x < defender.x ? 1 : -1;
    defender.vx = dir * knockbackForce;
    defender.vy = -3;
    
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

    this.particles.add(defender.x, defender.y - 20, (Math.random()-0.5)*2, -2, defender.isBoss ? '#f1c40f' : '#e74c3c', 14, 45, 'text', `${finalDmg}`);
    for (let i = 0; i < 5; i++) {
      this.particles.add(defender.x, defender.y - 10, (Math.random()-0.5)*6, (Math.random()-0.5)*6, '#ff9900', 4, 30, 'spark');
    }

    if (defender.currentHp <= 0) {
      defender.state = 'dead';
      defender.stateTimer = 60;
      this.playSfx('defeat');
    } else {
      this.playSfx('hit');
    }
  }

  update(keysPressed) {
    if (this.gameOver) {
      this.victoryTimer++;
      if (this.victoryTimer > 120) {
        const alive = this.heroes.some(h => h.currentHp > 0);
        this.onComplete(alive ? 'victory' : 'defeat');
      }
      return;
    }

    const heroesAlive = this.heroes.some(h => h.currentHp > 0);
    const enemiesAlive = this.enemies.some(e => e.currentHp > 0 || e.stateTimer > 0);

    if (!heroesAlive && !this.gameOver) {
      this.gameOver = true;
      this.victoryTimer = 0;
      this.playSfx('defeat');
    } else if (!enemiesAlive && !this.gameOver) {
      if (this.wave < this.maxWaves) {
        this.wave++;
        this.enemies = [];
        if (this.wave < this.maxWaves) {
          this.spawnEnemy();
          this.spawnEnemy();
        } else {
          this.spawnEnemy();
        }
      } else {
        this.gameOver = true;
        this.victoryTimer = 0;
        this.playSfx('victory');
      }
    }

    const activeHero = this.getActiveHero();

    if (activeHero && activeHero.currentHp > 0 && activeHero.state !== 'defense' && !this.gameOver) {
      // Glitched status halves move speed
      let speed = activeHero.statusEffects?.glitched > 0 ? 2 : 4;
      activeHero.vx = 0;
      if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) {
        activeHero.vx = -speed;
        activeHero.facing = -1;
        activeHero.state = 'run';
      } else if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) {
        activeHero.vx = speed;
        activeHero.facing = 1;
        activeHero.state = 'run';
      } else if (activeHero.state === 'run') {
        activeHero.state = 'idle';
      }

      if ((keysPressed['ArrowUp'] || keysPressed['Space'] || keysPressed['w'] || keysPressed['W']) && this.isOnGround(activeHero)) {
        activeHero.vy = -7.5;
        this.playSfx('jump');
      }
    }

    this.heroes.forEach(h => {
      if (h.currentHp <= 0) {
        h.state = 'dead';
        h.vx = 0;
        h.vy += 0.25;
        this.applyPhysics(h);
        return;
      }

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

      // Glitched particles
      if (h.statusEffects?.glitched > 0) {
        h.statusEffects.glitched--;
        if (h.statusEffects.glitched % 12 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*15, h.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      // Radiated particles
      if (h.statusEffects?.radiated > 0) {
        h.statusEffects.radiated--;
        if (h.statusEffects.radiated % 40 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*12, h.y - 12 + (Math.random()-0.5)*12, 0, -0.5, '#e67e22', 4, 25, 'spark');
        }
      }

      if (!h.isLeader && h.state !== 'hit' && h.state !== 'defense' && h.state !== 'attack' && !this.gameOver) {
        const distToLeader = activeHero.x - h.x;
        if (Math.abs(distToLeader) > 80) {
          h.vx = Math.sign(distToLeader) * 2.5;
          h.facing = Math.sign(distToLeader);
          h.state = 'run';
        } else {
          h.vx = 0;
          h.state = 'idle';
        }

        if (Math.abs(distToLeader) > 50 && this.isOnGround(h) && Math.random() < 0.02) {
          h.vy = -6;
        }

        const nearestEnemy = this.getNearestEnemy(h);
        if (nearestEnemy && Math.abs(nearestEnemy.x - h.x) < 80 && Math.abs(nearestEnemy.y - h.y) < 30) {
          h.facing = nearestEnemy.x > h.x ? 1 : -1;
          this.triggerAbility(h, 'simple');
        }
      }

      h.vy += 0.25;
      this.applyPhysics(h);
    });

    this.enemies.forEach(e => {
      if (e.currentHp <= 0) {
        if (e.stateTimer > 0) e.stateTimer--;
        e.vx = 0;
        e.vy += 0.25;
        this.applyPhysics(e);
        return;
      }

      if (e.stateTimer > 0) {
        e.stateTimer--;
        if (e.stateTimer === 0) e.state = 'idle';
      }

      // Infection DoT
      if (e.statusEffects?.infected > 0) {
        e.statusEffects.infected--;
        if (e.statusEffects.infected % 60 === 0) {
          e.currentHp = Math.max(1, e.currentHp - 3);
          this.particles.add(e.x, e.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      // Glitched particles
      if (e.statusEffects?.glitched > 0) {
        e.statusEffects.glitched--;
        if (e.statusEffects.glitched % 12 === 0) {
          this.particles.add(e.x + (Math.random()-0.5)*15, e.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      const target = this.getClosestHero(e);
      if (target && e.state !== 'hit' && !this.gameOver) {
        const dx = target.x - e.x;
        e.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) > 55) {
          let speed = e.isBoss ? 1.5 : 2.0;
          if (e.statusEffects?.glitched > 0) speed *= 0.5; // slow down if glitched

          e.vx = Math.sign(dx) * speed;
          e.state = 'run';
        } else {
          e.vx = 0;
          e.state = 'idle';
          
          e.cooldown--;
          if (e.cooldown <= 0) {
            e.state = 'attack';
            e.stateTimer = 20;
            e.cooldown = e.isBoss ? 100 : 80;

            this.playSfx(e.weapon === 'gun' || e.weapon === 'laser' ? 'shoot' : 'slash');

            if (Math.abs(target.x - e.x) < 70 && Math.abs(target.y - e.y) < 30) {
              // Boss special status effects
              let status = null;
              if (e.name.includes('Nemesis')) status = 'infected';
              if (e.name.includes('Smith')) status = 'glitched';
              if (e.name.includes('Deathclaw') || e.name.includes('Cyberdemon')) status = 'radiated';

              this.applyDamage(e, target, e.atk, 12, status);
            }
          }
        }
      } else {
        e.vx = 0;
      }

      e.vy += 0.25;
      this.applyPhysics(e);
    });
  }

  isOnGround(char) {
    for (let p of this.platforms) {
      if (char.x >= p.x1 && char.x <= p.x2) {
        if (char.y + char.vy >= p.y - 1 && char.y <= p.y + 3) return p;
      }
    }
    return null;
  }

  applyPhysics(char) {
    char.x += char.vx;
    char.y += char.vy;

    if (char.state === 'hit') char.vx *= 0.85;

    const plat = this.isOnGround(char);
    if (plat && char.vy >= 0) {
      char.y = plat.y;
      char.vy = 0;
    }

    if (char.x < 20) char.x = 20;
    if (char.x > this.width - 20) char.x = this.width - 20;
    
    if (char.y > this.height) {
      char.currentHp = 0;
      char.state = 'dead';
      char.stateTimer = 0;
      this.playSfx('defeat');
    }
  }

  getClosestHero(enemy) {
    let closest = null;
    let minDist = 99999;
    this.heroes.forEach(h => {
      if (h.currentHp > 0) {
        const dist = Math.abs(h.x - enemy.x);
        if (dist < minDist) {
          minDist = dist;
          closest = h;
        }
      }
    });
    return closest;
  }

  getNearestEnemy(hero) {
    let closest = null;
    let minDist = 99999;
    this.enemies.forEach(e => {
      if (e.currentHp > 0) {
        const dist = Math.abs(e.x - hero.x);
        if (dist < minDist) {
          minDist = dist;
          closest = e;
        }
      }
    });
    return closest;
  }

  draw(ctx, animTime) {
    ctx.strokeStyle = '#39c5bb';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#39c5bb';
    ctx.shadowBlur = 6;
    
    this.platforms.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y);
      ctx.lineTo(p.x2, p.y);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    this.enemies.forEach(e => {
      if (e.isBoss) {
        drawBoss(ctx, e.x, e.y, e, animTime);
      } else {
        drawPixelEnemy(ctx, e.x, e.y, e, animTime, e.facing);
      }

      if (e.currentHp > 0) {
        const barWidth = e.isBoss ? 80 : 30;
        const barHeight = e.isBoss ? 6 : 4;
        const xOffset = e.isBoss ? -40 : -15;
        const yOffset = e.isBoss ? -60 : -32;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x + xOffset, e.y + yOffset, barWidth, barHeight);

        const pct = e.currentHp / e.maxHp;
        ctx.fillStyle = e.isBoss ? '#f1c40f' : '#e74c3c';
        ctx.fillRect(e.x + xOffset, e.y + yOffset, barWidth * pct, barHeight);
      }
    });

    this.heroes.forEach(h => {
      drawPixelSprite(ctx, h.x, h.y, h, animTime, h.facing);

      if (h.id === this.activeHeroId && h.currentHp > 0) {
        ctx.fillStyle = '#39c5bb';
        ctx.beginPath();
        const pt = Math.sin(animTime * 0.1) * 3;
        ctx.moveTo(h.x, h.y - 36 + pt);
        ctx.lineTo(h.x - 5, h.y - 44 + pt);
        ctx.lineTo(h.x + 5, h.y - 44 + pt);
        ctx.fill();
      }

      if (h.currentHp > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(h.x - 15, h.y - 32, 30, 4);

        const pct = h.currentHp / h.maxHp;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(h.x - 15, h.y - 32, 30 * pct, 4);
      }
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`WAVE: ${this.wave}/${this.maxWaves}`, 20, 30);
  }
}
