// FF Tactics / Metal Slug Tactics Grid Battle Engine with Obstacles & Synergies
import { drawPixelSprite, drawPixelEnemy, drawBoss } from './renderer';
import { SYNERGIES_DB } from './heroes';

export class EngineTactics {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;

    this.rows = 5;
    this.cols = 8;
    this.cellW = 60;
    this.cellH = 45;
    this.gridStartX = 60;
    this.gridStartY = 60;

    // Convert heroes
    this.heroes = heroes.map((h, idx) => ({
      ...h,
      gridX: 0,
      gridY: idx + 1,
      x: 0, y: 0,
      state: 'idle',
      stateTimer: 0,
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
    this.enemies = [];
    this.isBossStage = !!enemiesData.bosses || !!enemiesData.worldBoss;
    this.initBoard();

    // Spawning Destructible Obstacles
    this.obstacles = [
      { id: 'b1', name: 'COG Cover', hp: 80, maxHp: 80, gridX: 4, gridY: 1, type: 'barrier', color: '#4a4e52' },
      { id: 'b2', name: 'COG Cover', hp: 80, maxHp: 80, gridX: 4, gridY: 3, type: 'barrier', color: '#4a4e52' },
      { id: 'bar1', name: 'Naquadah Barrel', hp: 30, maxHp: 30, gridX: 3, gridY: 2, type: 'barrel', color: '#00ff00' },
      { id: 'bar2', name: 'Naquadah Barrel', hp: 30, maxHp: 30, gridX: 4, gridY: 2, type: 'barrel', color: '#00ff00' }
    ];

    this.turnQueue = [];
    this.activeUnit = null;
    this.actionPhase = 'move';
    this.selectedAction = null;
    this.movementRange = [];
    this.attackRange = [];

    this.gameOver = false;
    this.victoryTimer = 0;
    this.autoBattle = false;
    this.isFinalBoss = false;
    this.finalBossRoundCount = 0;

    this.rebuildTurnQueue();
    this.startTurn();
  }

  initBoard() {
    const monstersList = this.enemiesData.monsters;
    const bossesList = this.enemiesData.bosses;
    const worldBoss = this.enemiesData.worldBoss;

    // 1. Spawning 3 monsters on grid column 5
    for (let i = 0; i < 3; i++) {
      const template = monstersList[i] || monstersList[0];
      this.enemies.push({
        ...template,
        gridX: 5,
        gridY: i + 1,
        x: 0, y: 0,
        state: 'idle',
        stateTimer: 0,
        maxHp: template.hp || 90,
        currentHp: template.hp || 90,
        facing: -1,
        isBoss: false,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      });
    }

    // 2. Spawning 2 bosses on grid column 6
    for (let i = 0; i < 2; i++) {
      const template = bossesList[i] || bossesList[0];
      this.enemies.push({
        ...template,
        gridX: 6,
        gridY: i * 2 + 1,
        x: 0, y: 0,
        state: 'idle',
        stateTimer: 0,
        maxHp: template.hp || 450,
        currentHp: template.hp || 450,
        facing: -1,
        isBoss: true,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      });
    }

    // 3. Spawning 1 World Boss at (7, 2)
    if (worldBoss) {
      this.enemies.push({
        ...worldBoss,
        gridX: 7,
        gridY: 2,
        x: 0, y: 0,
        state: 'idle',
        stateTimer: 0,
        maxHp: worldBoss.hp || 1200,
        currentHp: worldBoss.hp || 1200,
        facing: -1,
        isBoss: true,
        statusEffects: { infected: 0, glitched: 0, radiated: 0 }
      });
    }
  }

  rebuildTurnQueue() {
    const units = [
      ...this.heroes.filter(h => h.currentHp > 0).map(h => ({ unit: h, type: 'hero' })),
      ...this.enemies.filter(e => e.currentHp > 0).map(e => ({ unit: e, type: 'enemy' }))
    ];
    units.sort((a, b) => b.unit.stats ? b.unit.stats.spd - a.unit.stats.spd : b.unit.atk - a.unit.atk);
    this.turnQueue = units;
  }

  startTurn() {
    if (this.turnQueue.length === 0) {
      this.rebuildTurnQueue();
      if (this.isFinalBoss) {
        this.finalBossRoundCount++;
        if (this.finalBossRoundCount >= 3) {
          this.finalBossRoundCount = 0;
          this.triggerFinalBossRandomEvent();
        }
      }
    }
    this.turnQueue = this.turnQueue.filter(t => t.unit.currentHp > 0);
    if (this.turnQueue.length === 0) return;

    const next = this.turnQueue.shift();
    this.activeUnit = next.unit;
    this.activeUnitType = next.type;

    if (this.activeUnitType === 'hero') {
      this.actionPhase = 'move';
      this.selectedAction = null;
      this.calculateMovementRange();
      if (this.autoBattle) {
        setTimeout(() => this.runHeroAI(), 600);
      }
    } else {
      this.actionPhase = 'enemy_ai';
      setTimeout(() => this.runEnemyAI(), 600);
    }
  }

  calculateMovementRange() {
    const unit = this.activeUnit;
    // Glitched status halves movement range to 1 cell
    const range = unit.statusEffects?.glitched > 0 ? 1 : 2;
    this.movementRange = [];
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const dist = Math.abs(unit.gridX - c) + Math.abs(unit.gridY - r);
        if (dist <= range && !this.isCellOccupied(c, r, unit)) {
          this.movementRange.push({ x: c, y: r });
        }
      }
    }
    this.movementRange.push({ x: unit.gridX, y: unit.gridY });
  }

  calculateAttackRange() {
    const unit = this.activeUnit;
    this.attackRange = [];
    if (!this.selectedAction) return;

    let range = 1;
    if (this.selectedAction === 'secondary') range = 3;
    if (this.selectedAction === 'special') range = 5;
    if (this.selectedAction === 'defense') {
      this.attackRange.push({ x: unit.gridX, y: unit.gridY });
      return;
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const dist = Math.abs(unit.gridX - c) + Math.abs(unit.gridY - r);
        if (dist <= range) {
          this.attackRange.push({ x: c, y: r });
        }
      }
    }
  }

  isCellOccupied(c, r, ignoreUnit) {
    const heroOccupies = this.heroes.some(h => h.currentHp > 0 && h !== ignoreUnit && h.gridX === c && h.gridY === r);
    const enemyOccupies = this.enemies.some(e => e.currentHp > 0 && e !== ignoreUnit && e.gridX === c && e.gridY === r);
    const obstacleOccupies = this.obstacles.some(o => o.hp > 0 && o.gridX === c && o.gridY === r);
    return heroOccupies || enemyOccupies || obstacleOccupies;
  }

  getUnitAtCell(c, r) {
    const hero = this.heroes.find(h => h.currentHp > 0 && h.gridX === c && h.gridY === r);
    if (hero) return { unit: hero, type: 'hero' };
    const enemy = this.enemies.find(e => e.currentHp > 0 && e.gridX === c && e.gridY === r);
    if (enemy) return { unit: enemy, type: 'enemy' };
    const obstacle = this.obstacles.find(o => o.hp > 0 && o.gridX === c && o.gridY === r);
    if (obstacle) return { unit: obstacle, type: 'obstacle' };
    return null;
  }

  handleCellClick(c, r) {
    if (this.gameOver || this.activeUnitType !== 'hero') return;

    if (this.actionPhase === 'move') {
      const inRange = this.movementRange.some(cell => cell.x === c && cell.y === r);
      if (inRange) {
        this.activeUnit.gridX = c;
        this.activeUnit.gridY = r;
        this.playSfx('jump');
        
        this.actionPhase = 'action';
        this.selectedAction = 'simple';
        this.calculateAttackRange();
      }
    } else if (this.actionPhase === 'action') {
      const inRange = this.attackRange.some(cell => cell.x === c && cell.y === r);
      if (!inRange) return;

      const target = this.getUnitAtCell(c, r);

      if (this.selectedAction === 'defense') {
        this.activeUnit.state = 'defense';
        this.activeUnit.stateTimer = this.activeUnit.defense.dur * 60;
        this.playSfx('shield');
        this.endActiveTurn();
        return;
      }

      if (target) {
        const hero = this.activeUnit;
        const defender = target.unit;

        // Can attack enemies OR obstacles
        if (target.type === 'enemy' || target.type === 'obstacle') {
          if (this.selectedAction === 'simple') {
            hero.state = 'attack';
            hero.stateTimer = 25;
            this.playSfx(hero.weaponType === 'gun' || hero.weaponType === 'laser' ? 'shoot' : 'slash');
            
            // Apply Status Effect chances: Resident Evil inflicts infected, Matrix glitches
            let status = null;
            if (hero.id === 'leon') status = 'infected';
            if (hero.id === 'neo') status = 'glitched';

            this.applyDamage(hero, defender, hero.stats.atk * hero.simple.dmg, status);
            hero.specialCharge = Math.min(100, hero.specialCharge + 15);
            this.endActiveTurn();

          } else if (this.selectedAction === 'secondary') {
            if (hero.cooldown > 0) return;
            hero.state = 'attack';
            hero.stateTimer = 25;
            hero.cooldown = hero.secondary.cd * 60;
            this.playSfx('shoot');
            
            this.applyDamage(hero, defender, hero.stats.atk * hero.secondary.dmg);
            hero.specialCharge = Math.min(100, hero.specialCharge + 25);
            this.endActiveTurn();

          } else if (this.selectedAction === 'special') {
            if (hero.specialCharge < 100) return;
            hero.specialCharge = 0;
            hero.state = 'attack';
            hero.stateTimer = 35;
            this.playSfx('special');

            this.particles.add(
              this.gridStartX + c * this.cellW + this.cellW/2,
              this.gridStartY + r * this.cellH + this.cellH/2,
              0, 0, hero.primaryColor, 120, 30, 'glitch'
            );

            this.applyDamage(hero, defender, hero.stats.atk * hero.special.dmg);
            this.endActiveTurn();
          }
        }
      }
    }
  }

  endActiveTurn() {
    this.actionPhase = 'end';
    this.selectedAction = null;
    this.movementRange = [];
    this.attackRange = [];
    setTimeout(() => this.startTurn(), 600);
  }

  runEnemyAI() {
    if (this.gameOver || this.activeUnit.currentHp <= 0) {
      this.startTurn();
      return;
    }

    const enemy = this.activeUnit;

    let closestHero = null;
    let minDist = 999;
    this.heroes.forEach(h => {
      if (h.currentHp > 0) {
        const d = Math.abs(h.gridX - enemy.gridX) + Math.abs(h.gridY - enemy.gridY);
        if (d < minDist) {
          minDist = d;
          closestHero = h;
        }
      }
    });

    if (!closestHero) {
      this.endActiveTurn();
      return;
    }

    let bestX = enemy.gridX;
    let bestY = enemy.gridY;
    let bestDist = minDist;

    // Movement speed halved if glitched
    const maxMoveRange = enemy.statusEffects?.glitched > 0 ? 1 : 2;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const moveDist = Math.abs(enemy.gridX - c) + Math.abs(enemy.gridY - r);
        if (moveDist <= maxMoveRange && !this.isCellOccupied(c, r, enemy)) {
          const targetDist = Math.abs(closestHero.gridX - c) + Math.abs(closestHero.gridY - r);
          if (targetDist < bestDist) {
            bestDist = targetDist;
            bestX = c;
            bestY = r;
          }
        }
      }
    }

    enemy.gridX = bestX;
    enemy.gridY = bestY;
    this.playSfx('jump');

    const attackDist = Math.abs(closestHero.gridX - enemy.gridX) + Math.abs(closestHero.gridY - enemy.gridY);
    const rangeLimit = enemy.isBoss ? 2 : 1;

    setTimeout(() => {
      if (attackDist <= rangeLimit && closestHero.currentHp > 0) {
        enemy.state = 'attack';
        enemy.stateTimer = 20;
        this.playSfx(enemy.weapon === 'gun' || enemy.weapon === 'laser' ? 'shoot' : 'slash');

        // Chance to inflict status effects by bosses
        let status = null;
        if (enemy.name.includes('Nemesis')) status = 'infected';
        if (enemy.name.includes('Smith')) status = 'glitched';
        if (enemy.name.includes('Deathclaw') || enemy.name.includes('Cyberdemon')) status = 'radiated';

        this.applyDamage(enemy, closestHero, enemy.atk, status);
      }
      this.endActiveTurn();
    }, 400);
  }

  runHeroAI() {
    if (this.gameOver || this.activeUnit.currentHp <= 0 || this.activeUnitType !== 'hero') return;

    const hero = this.activeUnit;

    // 1. Find closest enemy
    let closestEnemy = null;
    let minDist = 999;
    this.enemies.forEach(e => {
      if (e.currentHp > 0) {
        const d = Math.abs(e.gridX - hero.gridX) + Math.abs(e.gridY - hero.gridY);
        if (d < minDist) {
          minDist = d;
          closestEnemy = e;
        }
      }
    });

    if (!closestEnemy) {
      this.endActiveTurn();
      return;
    }

    // 2. Choose best movement cell
    let bestMoveCell = { x: hero.gridX, y: hero.gridY };
    let bestMoveDist = minDist;

    this.movementRange.forEach(cell => {
      const d = Math.abs(closestEnemy.gridX - cell.x) + Math.abs(closestEnemy.gridY - cell.y);
      if (d < bestMoveDist) {
        bestMoveDist = d;
        bestMoveCell = cell;
      }
    });

    // Move there
    hero.gridX = bestMoveCell.x;
    hero.gridY = bestMoveCell.y;
    this.playSfx('jump');

    this.actionPhase = 'action';

    // 3. Choose action
    let chosenAction = 'simple';
    if (hero.specialCharge >= 100) {
      chosenAction = 'special';
    } else if (hero.cooldown <= 0) {
      chosenAction = 'secondary';
    }

    this.selectedAction = chosenAction;
    this.calculateAttackRange();

    // 4. Find target
    let target = null;
    let targetDist = 999;

    this.enemies.forEach(e => {
      if (e.currentHp > 0) {
        const inRange = this.attackRange.some(cell => cell.x === e.gridX && cell.y === e.gridY);
        if (inRange) {
          const d = Math.abs(e.gridX - hero.gridX) + Math.abs(e.gridY - hero.gridY);
          if (d < targetDist) {
            targetDist = d;
            target = e;
          }
        }
      }
    });

    // Check obstacles if no enemies in range
    if (!target) {
      this.obstacles.forEach(o => {
        if (o.hp > 0 && o.type === 'barrel') {
          const inRange = this.attackRange.some(cell => cell.x === o.gridX && cell.y === o.gridY);
          if (inRange) {
            target = o;
          }
        }
      });
    }

    // 5. Execute action after a delay
    setTimeout(() => {
      if (target) {
        hero.state = 'attack';
        hero.stateTimer = 25;

        let status = null;
        if (hero.id === 'leon') status = 'infected';
        if (hero.id === 'neo') status = 'glitched';

        if (chosenAction === 'simple') {
          this.playSfx(hero.weaponType === 'gun' || hero.weaponType === 'laser' ? 'shoot' : 'slash');
          this.applyDamage(hero, target, hero.stats.atk * hero.simple.dmg, status);
          hero.specialCharge = Math.min(100, hero.specialCharge + 15);
        } else if (chosenAction === 'secondary') {
          hero.cooldown = hero.secondary.cd * 60;
          this.playSfx('shoot');
          this.applyDamage(hero, target, hero.stats.atk * hero.secondary.dmg, status);
          hero.specialCharge = Math.min(100, hero.specialCharge + 25);
        } else if (chosenAction === 'special') {
          hero.specialCharge = 0;
          this.playSfx('special');
          this.applyDamage(hero, target, hero.stats.atk * hero.special.dmg, status);
        }
      }
      this.endActiveTurn();
    }, 500);
  }

  applyDamage(attacker, defender, baseDmg, statusEffect = null) {
    if (defender.type === 'barrier' || defender.type === 'barrel') {
      // Destructible obstacle damage
      defender.hp = Math.max(0, defender.hp - Math.round(baseDmg));
      this.playSfx('hit');

      const targetPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
      const targetPxY = this.gridStartY + defender.gridY * this.cellH + 10;
      this.particles.add(targetPxX, targetPxY - 20, 0, -1.5, '#7f8c8d', 12, 35, 'text', `${Math.round(baseDmg)}`);

      if (defender.hp <= 0) {
        this.playSfx('defeat');
        // Trigger Naquadah barrel explosion
        if (defender.type === 'barrel') {
          this.triggerBarrelExplosion(defender.gridX, defender.gridY);
        }
      }
      return;
    }

    if (defender.state === 'defense') {
      // Tech shield absorbs damage
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
        const defPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
        const defPxY = this.gridStartY + defender.gridY * this.cellH + 10;
        this.particles.add(defPxX, defPxY - 45, 0, -1.2, '#3498db', 11, 50, 'text', 'DEF DOWN');
      }
    }

    const variance = (Math.random() * 0.2) + 0.9;
    const finalDmg = Math.round(baseDmg * variance);

    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);

    // Nanite lifesteal
    if (attacker && attacker.talent === 'lifedrain' && attacker.currentHp > 0 && attacker.gridX !== undefined) {
      const heal = Math.round(finalDmg * 0.10);
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
      const atkPxX = this.gridStartX + attacker.gridX * this.cellW + this.cellW / 2;
      const atkPxY = this.gridStartY + attacker.gridY * this.cellH + 10;
      this.particles.add(atkPxX, atkPxY - 20, 0, -1, '#2ecc71', 11, 40, 'text', `+${heal} HP`);
    }

    if (defender.state !== 'defense') {
      defender.state = 'hit';
      defender.stateTimer = 15;
    }

    // Apply status effect
    if (statusEffect && defender.currentHp > 0 && defender.statusEffects) {
      defender.statusEffects[statusEffect] = 300; // lasts 5 seconds (300 frames)
      const label = statusEffect === 'infected' ? 'INFECTED' : statusEffect === 'glitched' ? 'GLITCHED' : 'RADIATED';
      const color = statusEffect === 'infected' ? '#2ecc71' : statusEffect === 'glitched' ? '#00ff00' : '#e67e22';
      
      const targetPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
      const targetPxY = this.gridStartY + defender.gridY * this.cellH + 10;
      this.particles.add(targetPxX, targetPxY - 35, 0, -1, color, 12, 60, 'text', label);
    }

    const targetPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
    const targetPxY = this.gridStartY + defender.gridY * this.cellH + 10;

    this.particles.add(targetPxX, targetPxY - 20, (Math.random()-0.5)*2, -1.5, defender.isBoss ? '#f1c40f' : '#e74c3c', 14, 45, 'text', `${finalDmg}`);
    for (let i = 0; i < 5; i++) {
      this.particles.add(targetPxX, targetPxY - 10, (Math.random()-0.5)*5, (Math.random()-0.5)*5, '#ff4500', 4, 25, 'spark');
    }

    if (defender.currentHp <= 0) {
      defender.state = 'dead';
      defender.stateTimer = 999;
      this.playSfx('defeat');
    } else {
      this.playSfx('hit');
    }
  }

  triggerBarrelExplosion(bgX, bgY) {
    const centerPxX = this.gridStartX + bgX * this.cellW + this.cellW / 2;
    const centerPxY = this.gridStartY + bgY * this.cellH + this.cellH / 2;

    this.particles.add(centerPxX, centerPxY, 0, 0, '#ff4500', 100, 30, 'glitch');
    this.playSfx('special');

    // Apply 100 damage to adjacent units
    const adjacent = [
      ...this.heroes.filter(h => h.currentHp > 0),
      ...this.enemies.filter(e => e.currentHp > 0)
    ];

    adjacent.forEach(unit => {
      const dist = Math.abs(unit.gridX - bgX) + Math.abs(unit.gridY - bgY);
      if (dist <= 1.5) { // orthog and diagonal
        this.applyDamage({ gridX: bgX, gridY: bgY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, unit, 100);
      }
    });

    // Damage other obstacles in range
    this.obstacles.forEach(o => {
      if (o.hp > 0 && o.gridX !== bgX && o.gridY !== bgY) {
        const dist = Math.abs(o.gridX - bgX) + Math.abs(o.gridY - bgY);
        if (dist <= 1.5) {
          o.hp = Math.max(0, o.hp - 100);
          if (o.hp <= 0 && o.type === 'barrel') {
            // Chain reaction explosion!
            setTimeout(() => this.triggerBarrelExplosion(o.gridX, o.gridY), 200);
          }
        }
      }
    });
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

  // Active Combat Event Item trigger
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
            this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#f1c40f' }, e, dmg, status);
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
            e.gridX = Math.min(7, e.gridX + 2);
            this.applyDamage({ gridX: 0, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#3498db' }, e, dmg);
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
            
            const targetPxX = this.gridStartX + h.gridX * this.cellW + this.cellW / 2;
            const targetPxY = this.gridStartY + h.gridY * this.cellH + 10;
            this.particles.add(targetPxX, targetPxY - 20, 0, -1, '#2ecc71', 12, 45, 'text', `+${heal}`);
          }
        });
        if (effect === 'meeseeks_swarm' || effect === 'vampire_fury') {
          const enemyDmg = effect === 'vampire_fury' ? 200 : 150;
          this.enemies.forEach(e => {
            if (e.currentHp > 0) {
              this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#2ecc71' }, e, enemyDmg);
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
            const targetPxX = this.gridStartX + e.gridX * this.cellW + this.cellW / 2;
            const targetPxY = this.gridStartY + e.gridY * this.cellH + 10;
            this.particles.add(targetPxX, targetPxY - 15, 0, 0, '#00ff00', 8, 15, 'spark');
            if (effect === 'marker_insanity') {
              this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#8e44ad' }, e, 120);
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
      case 'circus_glitch': {
        this.enemies.forEach(e => {
          if (e.currentHp > 0 && e.statusEffects) {
            e.statusEffects.glitched = 360;
            this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, e, 100);
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
          this.applyDamage({ gridX: strongest.gridX - 1, gridY: strongest.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, strongest, dmg);
        }
        break;
      }
      default: {
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            this.applyDamage({ gridX: e.gridX - 1, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#ffeb3b' }, e, 120);
          }
        });
      }
    }
  }
  update() {
    if (this.gameOver) {
      this.victoryTimer++;
      if (this.victoryTimer > 120) {
        const alive = this.heroes.some(h => h.currentHp > 0);
        this.onComplete(alive ? 'victory' : 'defeat');
      }
      return;
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
      this.gameOver = true;
      this.victoryTimer = 0;
      this.playSfx('victory');
      return;
    }

    // Process Status Effects & timers for heroes
    this.heroes.forEach(h => {
      const targetX = this.gridStartX + h.gridX * this.cellW + this.cellW / 2;
      const targetY = this.gridStartY + h.gridY * this.cellH + 18;
      h.x += (targetX - h.x) * 0.2;
      h.y += (targetY - h.y) * 0.2;

      if (h.currentHp <= 0) return;

      if (h.cooldown > 0) h.cooldown--;
      if (h.stateTimer > 0) {
        h.stateTimer--;
        if (h.stateTimer === 0 && h.state !== 'dead') h.state = 'idle';
      }

      // Infection DoT ticks
      if (h.statusEffects?.infected > 0) {
        h.statusEffects.infected--;
        if (h.statusEffects.infected % 60 === 0) {
          h.currentHp = Math.max(1, h.currentHp - 3); // DoT deals 3 damage per second, caps at 1 HP
          this.particles.add(h.x, h.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      if (h.statusEffects?.glitched > 0) {
        h.statusEffects.glitched--;
        if (h.statusEffects.glitched % 10 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*15, h.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      if (h.statusEffects?.radiated > 0) {
        h.statusEffects.radiated--;
        if (h.statusEffects.radiated % 40 === 0) {
          this.particles.add(h.x + (Math.random()-0.5)*12, h.y - 12 + (Math.random()-0.5)*12, 0, -0.5, '#e67e22', 4, 25, 'spark');
        }
      }
    });

    // Process Status Effects & timers for enemies
    this.enemies.forEach(e => {
      const targetX = this.gridStartX + e.gridX * this.cellW + this.cellW / 2;
      const targetY = this.gridStartY + e.gridY * this.cellH + 18;
      e.x += (targetX - e.x) * 0.2;
      e.y += (targetY - e.y) * 0.2;

      if (e.currentHp <= 0) return;

      if (e.stateTimer > 0) {
        e.stateTimer--;
        if (e.stateTimer === 0 && e.state !== 'dead') e.state = 'idle';
      }

      if (e.statusEffects?.infected > 0) {
        e.statusEffects.infected--;
        if (e.statusEffects.infected % 60 === 0) {
          e.currentHp = Math.max(1, e.currentHp - 3);
          this.particles.add(e.x, e.y - 12, (Math.random()-0.5)*2, -1, '#2ecc71', 4, 20, 'spark');
        }
      }

      if (e.statusEffects?.glitched > 0) {
        e.statusEffects.glitched--;
        if (e.statusEffects.glitched % 10 === 0) {
          this.particles.add(e.x + (Math.random()-0.5)*15, e.y - 10 + (Math.random()-0.5)*15, 0, 0, '#00ff00', 4, 15, 'glitch');
        }
      }

      if (e.statusEffects?.radiated > 0) {
        e.statusEffects.radiated--;
      }
    });
  }

  draw(ctx, animTime) {
    // 1. Draw Grid board
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 1;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cellX = this.gridStartX + c * this.cellW;
        const cellY = this.gridStartY + r * this.cellH;
        
        ctx.fillStyle = 'rgba(10, 20, 40, 0.4)';
        ctx.fillRect(cellX, cellY, this.cellW, this.cellH);
        ctx.strokeRect(cellX, cellY, this.cellW, this.cellH);

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = '8px monospace';
        ctx.fillText(`${String.fromCharCode(65 + c)}${r + 1}`, cellX + 4, cellY + 12);
      }
    }

    // 2. Draw Obstacles
    this.obstacles.forEach(o => {
      if (o.hp <= 0) return;
      const ox = this.gridStartX + o.gridX * this.cellW;
      const oy = this.gridStartY + o.gridY * this.cellH;

      ctx.fillStyle = o.color;
      ctx.fillRect(ox + 6, oy + 6, this.cellW - 12, this.cellH - 12);
      
      // Draw grid details/lines on obstacles to look like barriers
      ctx.strokeStyle = '#111';
      ctx.strokeRect(ox + 6, oy + 6, this.cellW - 12, this.cellH - 12);

      if (o.type === 'barrel') {
        // draw a toxic nuclear symbol or band
        ctx.fillStyle = '#111';
        ctx.fillRect(ox + 6, oy + 18, this.cellW - 12, 8);
      }

      // Draw obstacle HP bar
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(ox + 10, oy + 2, this.cellW - 20, 3);
      const hpPct = o.hp / o.maxHp;
      ctx.fillStyle = o.type === 'barrel' ? '#00ff00' : '#7f8c8d';
      ctx.fillRect(ox + 10, oy + 2, (this.cellW - 20) * hpPct, 3);
    });

    if (this.actionPhase === 'move' && this.activeUnitType === 'hero') {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      this.movementRange.forEach(cell => {
        const cx = this.gridStartX + cell.x * this.cellW;
        const cy = this.gridStartY + cell.y * this.cellH;
        ctx.fillRect(cx, cy, this.cellW, this.cellH);
        ctx.strokeRect(cx, cy, this.cellW, this.cellH);
      });
    }

    if (this.actionPhase === 'action' && this.activeUnitType === 'hero') {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.18)';
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      this.attackRange.forEach(cell => {
        const cx = this.gridStartX + cell.x * this.cellW;
        const cy = this.gridStartY + cell.y * this.cellH;
        ctx.fillRect(cx, cy, this.cellW, this.cellH);
        ctx.strokeRect(cx, cy, this.cellW, this.cellH);
      });
    }

    this.enemies.forEach(e => {
      if (e.isBoss) {
        drawBoss(ctx, e.x, e.y, e, animTime);
      } else {
        drawPixelEnemy(ctx, e.x, e.y, e, animTime, -1);
      }

      if (e.currentHp > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - 15, e.y - 32, 30, 3);
        const hpPct = e.currentHp / e.maxHp;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(e.x - 15, e.y - 32, 30 * hpPct, 3);
      }
    });

    this.heroes.forEach(h => {
      drawPixelSprite(ctx, h.x, h.y, h, animTime, 1);

      if (h === this.activeUnit && h.currentHp > 0) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        const pt = Math.sin(animTime * 0.1) * 3;
        ctx.moveTo(h.x, h.y - 36 + pt);
        ctx.lineTo(h.x - 5, h.y - 44 + pt);
        ctx.lineTo(h.x + 5, h.y - 44 + pt);
        ctx.fill();
      }

      if (h.currentHp > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(h.x - 15, h.y - 32, 30, 3);
        const hpPct = h.currentHp / h.maxHp;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(h.x - 15, h.y - 32, 30 * hpPct, 3);
      }
    });

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(this.width - 220, 10, 210, 35);
    ctx.strokeStyle = '#2980b9';
    ctx.strokeRect(this.width - 220, 10, 210, 35);
    
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('TURN ORDER:', this.width - 210, 22);

    let qStr = this.turnQueue.slice(0, 3).map(q => q.unit.name.split(' ')[0]).join(' > ');
    ctx.fillStyle = '#00ffff';
    ctx.fillText(qStr || 'END', this.width - 210, 37);
  }
}
