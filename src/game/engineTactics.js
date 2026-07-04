// FF Tactics / Metal Slug Tactics Grid Battle Engine with Obstacles & Synergies
import { drawPixelSprite, drawPixelEnemy, drawBoss } from './renderer';
import { SYNERGIES_DB } from './heroes';
import { getTacticsBattlefield, getTacticsMissionProfile } from './tacticsBattlefields';

export class EngineTactics {
  constructor(width, height, heroes, enemiesData, particles, playSfx, onComplete, stage = {}) {
    this.width = width;
    this.height = height;
    this.particles = particles;
    this.playSfx = playSfx;
    this.onComplete = onComplete;
    this.stage = stage;
    this.battlefield = getTacticsBattlefield(stage);
    this.missionProfile = getTacticsMissionProfile(stage, this.battlefield);
    this.objective = this.battlefield.objective || 'rout';
    this.objectiveTarget = this.battlefield.objectiveTarget || 1;
    this.objectiveProgress = 0;
    this.objectiveEvents = 0;
    this.extractedHeroIds = new Set();
    this.turnsElapsed = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;
    this.reinforcementsCalled = 0;
    this.hazardPulses = 0;
    this.tacticalItemsUsed = 0;
    this.tacticalItemImpact = 0;

    this.rows = this.battlefield.rows || 5;
    this.cols = this.battlefield.cols || 8;
    this.cellW = Math.min(66, Math.floor((this.width - 140) / this.cols));
    this.cellH = Math.min(48, Math.floor((this.height - 170) / this.rows));
    this.gridStartX = Math.round((this.width - this.cols * this.cellW) / 2);
    this.gridStartY = 60;
    this.tiles = this.battlefield.tiles || [];

    // Convert heroes
    this.heroes = heroes.map((h, idx) => ({
      ...h,
      gridX: this.battlefield.heroSpawns?.[idx]?.x ?? 0,
      gridY: this.battlefield.heroSpawns?.[idx]?.y ?? idx + 1,
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
    this.obstacles = (this.battlefield.obstacles || []).map(item => ({ ...item }));

    this.turnQueue = [];
    this.activeUnit = null;
    this.actionPhase = 'move';
    this.selectedAction = null;
    this.movementRange = [];
    this.attackRange = [];

    this.gameOver = false;
    this.battleResult = null;
    this.completionReported = false;
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

    const monsterSpawns = this.battlefield.monsterSpawns || [{ x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }];
    const bossSpawns = this.battlefield.bossSpawns || [{ x: 6, y: 1 }, { x: 6, y: 3 }];
    const worldBossSpawn = this.battlefield.worldBossSpawn || { x: this.cols - 1, y: Math.floor(this.rows / 2) };

    // 1. Spawning monsters from the active battlefield profile
    for (let i = 0; i < 3; i++) {
      const template = monstersList[i] || monstersList[0];
      const spawn = monsterSpawns[i] || monsterSpawns[monsterSpawns.length - 1] || { x: this.cols - 3, y: i + 1 };
      this.enemies.push({
        ...template,
        gridX: spawn.x,
        gridY: spawn.y,
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

    // 2. Spawning bosses from the active battlefield profile
    for (let i = 0; i < 2; i++) {
      const template = bossesList[i] || bossesList[0];
      const spawn = bossSpawns[i] || bossSpawns[bossSpawns.length - 1] || { x: this.cols - 2, y: i * 2 + 1 };
      this.enemies.push({
        ...template,
        gridX: spawn.x,
        gridY: spawn.y,
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

    // 3. Spawning 1 World Boss at the battlefield command point
    if (worldBoss) {
      this.enemies.push({
        ...worldBoss,
        gridX: worldBossSpawn.x,
        gridY: worldBossSpawn.y,
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
    const getSpeed = (entry) => entry.unit.stats?.spd ?? entry.unit.spd ?? 1;
    units.sort((a, b) => getSpeed(b) - getSpeed(a));
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
    this.applyStartTileEffect(this.activeUnit);

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
    this.movementRange = this.getReachableCells(unit, range);
  }

  getReachableCells(unit, range) {
    const visited = new Set([`${unit.gridX},${unit.gridY}`]);
    const queue = [{ x: unit.gridX, y: unit.gridY, dist: 0 }];
    const cells = [{ x: unit.gridX, y: unit.gridY, cost: 0 }];

    while (queue.length > 0) {
      const cell = queue.shift();
      if (cell.dist >= range) continue;

      [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 }
      ].forEach(next => {
        const key = `${next.x},${next.y}`;
        if (visited.has(key) || !this.isInsideGrid(next.x, next.y)) return;
        if (this.isCellOccupied(next.x, next.y, unit)) return;

        visited.add(key);
        const reachable = { x: next.x, y: next.y, dist: cell.dist + 1 };
        cells.push({ x: reachable.x, y: reachable.y, cost: reachable.dist });
        queue.push(reachable);
      });
    }

    return cells;
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
        if (dist <= range && this.hasLineOfSight(unit, { gridX: c, gridY: r }, this.selectedAction)) {
          this.attackRange.push({ x: c, y: r });
        }
      }
    }
  }

  getActionRange(actionType, unit = this.activeUnit) {
    if (!unit || actionType === 'defense') return 0;
    if (actionType === 'secondary') return 3;
    if (actionType === 'special') return 5;
    return unit.isBoss ? 2 : 1;
  }

  getActionBaseDamage(attacker, actionType) {
    if (!attacker) return 0;
    if (actionType === 'secondary') return attacker.stats?.atk * attacker.secondary?.dmg;
    if (actionType === 'special') return attacker.stats?.atk * attacker.special?.dmg;
    return attacker.stats?.atk * (attacker.simple?.dmg || 1) || attacker.atk || 0;
  }

  hasLineOfSight(from, to, _actionType = 'simple') {
    if (!from || !to) return false;
    const sx = from.gridX;
    const sy = from.gridY;
    const tx = to.gridX;
    const ty = to.gridY;
    if (sx === tx && sy === ty) return true;

    const dist = Math.abs(sx - tx) + Math.abs(sy - ty);
    if (dist <= 1) return true;

    const steps = Math.max(Math.abs(tx - sx), Math.abs(ty - sy)) * 2;
    const checked = new Set();

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const cx = Math.round(sx + (tx - sx) * t);
      const cy = Math.round(sy + (ty - sy) * t);
      const key = `${cx},${cy}`;
      if (checked.has(key)) continue;
      checked.add(key);
      if ((cx === sx && cy === sy) || (cx === tx && cy === ty)) continue;

      const blockingObstacle = this.obstacles.some(o => o.hp > 0 && o.gridX === cx && o.gridY === cy);
      if (blockingObstacle || this.isBlockedTile(cx, cy)) return false;
    }

    return true;
  }

  getCoverReduction(attacker, defender, actionType = 'simple') {
    if (!attacker || !defender || defender.type === 'barrier' || defender.type === 'barrel') return 0;
    if (attacker.gridX === undefined || defender.gridX === undefined) return 0;
    if (actionType === 'special') return 0.15;

    const dist = Math.abs(attacker.gridX - defender.gridX) + Math.abs(attacker.gridY - defender.gridY);
    if (dist <= 1) return 0;

    const adjacentBarriers = this.obstacles.filter(o => {
      if (o.hp <= 0 || o.type !== 'barrier') return false;
      const barrierDist = Math.abs(o.gridX - defender.gridX) + Math.abs(o.gridY - defender.gridY);
      if (barrierDist !== 1) return false;
      const attackerToBarrier = Math.abs(attacker.gridX - o.gridX) + Math.abs(attacker.gridY - o.gridY);
      return attackerToBarrier < dist || o.gridX === defender.gridX || o.gridY === defender.gridY;
    });

    const defenderTile = this.getTileAt(defender.gridX, defender.gridY);
    const tileCover = defenderTile?.type === 'heavyCover' ? 0.35 : defenderTile?.type === 'lightCover' ? 0.2 : 0;
    const heightCover = defenderTile?.type === 'high' && attacker.gridY > defender.gridY ? 0.12 : 0;
    return Math.max(adjacentBarriers.length > 0 ? 0.35 : 0, tileCover, heightCover);
  }

  applyStartTileEffect(unit) {
    if (!unit || unit.currentHp <= 0) return;
    const tile = this.getTileAt(unit.gridX, unit.gridY);
    if (!tile) return;
    const px = this.gridStartX + unit.gridX * this.cellW + this.cellW / 2;
    const py = this.gridStartY + unit.gridY * this.cellH + 12;
    if (tile.type === 'hazard') {
      unit.currentHp = Math.max(unit.isBoss ? 1 : 0, unit.currentHp - 6);
      this.particles.add(px, py - 18, 0, -1, '#ff5b5b', 10, 40, 'text', 'DANGER');
    }
    if (tile.type === 'heal' && this.heroes.includes(unit)) {
      unit.currentHp = Math.min(unit.maxHp, unit.currentHp + 8);
      this.particles.add(px, py - 18, 0, -1, '#2ecc71', 10, 40, 'text', '+HP');
    }
  }

  getDamagePreview(attacker, defender, actionType = 'simple') {
    let damage = this.getActionBaseDamage(attacker, actionType);
    if (!damage) return { damage: 0, cover: 0, defense: 0 };
    if (defender?.state === 'defense' && defender.defense) {
      damage *= (1 - defender.defense.reduce);
    }
    const cover = this.getCoverReduction(attacker, defender, actionType);
    damage *= (1 - cover);
    const defense = defender?.stats?.def ? Math.min(0.3, defender.stats.def / 100) : 0;
    damage *= (1 - defense);
    return { damage: Math.max(1, Math.round(damage)), cover, defense };
  }

  getEnemyThreatMap() {
    const threatMap = new Map();
    this.enemies.forEach(enemy => {
      if (enemy.currentHp <= 0) return;
      const range = this.getActionRange('enemy', enemy);
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const dist = Math.abs(enemy.gridX - c) + Math.abs(enemy.gridY - r);
          if (dist <= range && this.hasLineOfSight(enemy, { gridX: c, gridY: r }, 'enemy')) {
            const key = `${c},${r}`;
            const current = threatMap.get(key) || { x: c, y: r, count: 0 };
            current.count += 1;
            threatMap.set(key, current);
          }
        }
      }
    });
    return threatMap;
  }

  isInsideGrid(c, r) {
    return c >= 0 && c < this.cols && r >= 0 && r < this.rows;
  }

  getTileAt(c, r) {
    return this.tiles.find(tile => tile.x === c && tile.y === r) || null;
  }

  isBlockedTile(c, r) {
    return this.getTileAt(c, r)?.type === 'blocked';
  }

  isCellOccupied(c, r, ignoreUnit) {
    const heroOccupies = this.heroes.some(h => h.currentHp > 0 && h !== ignoreUnit && h.gridX === c && h.gridY === r);
    const enemyOccupies = this.enemies.some(e => e.currentHp > 0 && e !== ignoreUnit && e.gridX === c && e.gridY === r);
    const obstacleOccupies = this.obstacles.some(o => o.hp > 0 && o.gridX === c && o.gridY === r);
    return heroOccupies || enemyOccupies || obstacleOccupies || this.isBlockedTile(c, r);
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
    if (this.gameOver || this.activeUnitType !== 'hero') return { handled: false, reason: 'inactive' };

    if (this.actionPhase === 'move') {
      const inRange = this.movementRange.some(cell => cell.x === c && cell.y === r);
      const sameCell = this.activeUnit.gridX === c && this.activeUnit.gridY === r;
      if (!inRange || (!sameCell && this.isCellOccupied(c, r, this.activeUnit))) {
        return { handled: false, reason: 'blocked' };
      }

      this.activeUnit.gridX = c;
      this.activeUnit.gridY = r;
      this.playSfx('jump');
      
      this.actionPhase = 'action';
      this.selectedAction = 'simple';
      this.calculateAttackRange();
      return { handled: true, type: 'move', unit: this.activeUnit, x: c, y: r };
    } else if (this.actionPhase === 'action') {
      const inRange = this.attackRange.some(cell => cell.x === c && cell.y === r);
      if (!inRange) return { handled: false, reason: 'out-of-range' };

      const target = this.getUnitAtCell(c, r);

      if (this.selectedAction === 'defense') {
        this.activeUnit.state = 'defense';
        this.activeUnit.stateTimer = this.activeUnit.defense.dur * 60;
        this.playSfx('shield');
        this.endActiveTurn();
        return { handled: true, type: 'defense', unit: this.activeUnit };
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

            this.applyDamage(hero, defender, hero.stats.atk * hero.simple.dmg, status, { actionType: 'simple' });
            hero.specialCharge = Math.min(100, hero.specialCharge + 15);
            this.endActiveTurn();
            return { handled: true, type: 'action', action: 'simple', target };

          } else if (this.selectedAction === 'secondary') {
            if (hero.cooldown > 0) return { handled: false, reason: 'cooldown' };
            hero.state = 'attack';
            hero.stateTimer = 25;
            hero.cooldown = hero.secondary.cd * 60;
            this.playSfx('shoot');
            
            this.applyDamage(hero, defender, hero.stats.atk * hero.secondary.dmg, null, { actionType: 'secondary' });
            hero.specialCharge = Math.min(100, hero.specialCharge + 25);
            this.endActiveTurn();
            return { handled: true, type: 'action', action: 'secondary', target };

          } else if (this.selectedAction === 'special') {
            if (hero.specialCharge < 100) return { handled: false, reason: 'charge' };
            hero.specialCharge = 0;
            hero.state = 'attack';
            hero.stateTimer = 35;
            this.playSfx('special');

            this.particles.add(
              this.gridStartX + c * this.cellW + this.cellW/2,
              this.gridStartY + r * this.cellH + this.cellH/2,
              0, 0, hero.primaryColor, 120, 30, 'glitch'
            );

            this.applyDamage(hero, defender, hero.stats.atk * hero.special.dmg, null, { actionType: 'special' });
            this.endActiveTurn();
            return { handled: true, type: 'action', action: 'special', target };
          }
        }
      }
    }

    return { handled: false, reason: 'empty-action' };
  }

  endActiveTurn() {
    this.turnsElapsed++;
    this.updateTacticsObjective();
    this.applyTacticsMissionPressure();
    this.actionPhase = 'end';
    this.selectedAction = null;
    this.movementRange = [];
    this.attackRange = [];
    if (this.gameOver) return;
    setTimeout(() => this.startTurn(), 600);
  }

  updateTacticsObjective() {
    if (this.gameOver) return;
    const aliveHeroes = this.heroes.filter(h => h.currentHp > 0);
    if (aliveHeroes.length === 0) {
      this.completeBattle('defeat');
      return;
    }

    if (this.objective === 'control') {
      const objectiveTiles = this.tiles.filter(tile => tile.type === 'objective');
      const heldTiles = objectiveTiles.filter(tile => {
        const heroOnTile = aliveHeroes.some(hero => hero.gridX === tile.x && hero.gridY === tile.y);
        const enemyOnTile = this.enemies.some(enemy => enemy.currentHp > 0 && enemy.gridX === tile.x && enemy.gridY === tile.y);
        return heroOnTile && !enemyOnTile;
      });
      if (heldTiles.length > 0) {
        this.objectiveProgress = Math.min(this.objectiveTarget, this.objectiveProgress + heldTiles.length);
        this.objectiveEvents++;
        this.particles.add(this.width / 2, 42, 0, -1, '#ffeb3b', 11, 38, 'text', 'ANCRAGE');
      }
      if (this.objectiveProgress >= this.objectiveTarget) this.completeBattle('victory');
      return;
    }

    if (this.objective === 'extract') {
      const extractionZone = this.battlefield.extractionZone || [];
      aliveHeroes.forEach(hero => {
        const inZone = extractionZone.some(cell => cell.x === hero.gridX && cell.y === hero.gridY);
        if (inZone && !this.extractedHeroIds.has(hero.id)) {
          this.extractedHeroIds.add(hero.id);
          this.objectiveEvents++;
          this.particles.add(hero.x, hero.y - 34, 0, -1, '#39c5bb', 11, 40, 'text', 'EXTRACTION');
        }
      });
      this.objectiveProgress = this.extractedHeroIds.size;
      if (this.objectiveProgress >= this.objectiveTarget) this.completeBattle('victory');
      return;
    }

    if (this.objective === 'disable') {
      const disabled = this.obstacles.filter(item => item.type === 'objective' && item.hp <= 0).length;
      this.objectiveProgress = disabled;
      if (this.objectiveProgress >= this.objectiveTarget) this.completeBattle('victory');
      return;
    }

    if (this.objective === 'commander') {
      const defeatedBosses = this.enemies.filter(enemy => enemy.isBoss && enemy.currentHp <= 0).length;
      this.objectiveProgress = defeatedBosses;
      if (this.objectiveProgress >= this.objectiveTarget) this.completeBattle('victory');
      return;
    }

    if (this.objective === 'survive') {
      this.objectiveProgress = Math.min(this.objectiveTarget, this.turnsElapsed);
      if (this.objectiveProgress >= this.objectiveTarget) this.completeBattle('victory');
    }
  }

  completeBattle(result) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.battleResult = result;
    this.victoryTimer = 0;
    this.playSfx(result === 'victory' ? 'victory' : 'defeat');
  }

  applyTacticsMissionPressure() {
    if (this.gameOver || this.turnsElapsed <= 0) return;
    const { reinforcementEvery, hazardPulseEvery } = this.missionProfile;
    if (reinforcementEvery > 0 && this.turnsElapsed % reinforcementEvery === 0) {
      this.spawnTacticsReinforcement();
    }
    if (hazardPulseEvery > 0 && this.turnsElapsed % hazardPulseEvery === 0) {
      this.applyHazardPulse();
    }
  }

  findOpenTacticsSpawn(spawns = []) {
    return spawns.find(spawn => this.isInsideGrid(spawn.x, spawn.y) && !this.isCellOccupied(spawn.x, spawn.y, null));
  }

  spawnTacticsReinforcement() {
    const monstersList = this.enemiesData.monsters || [];
    const template = monstersList[this.reinforcementsCalled % Math.max(1, monstersList.length)] || monstersList[0];
    if (!template) return;
    const spawn = this.findOpenTacticsSpawn([
      ...(this.battlefield.monsterSpawns || []),
      ...(this.battlefield.bossSpawns || [])
    ]);
    if (!spawn) return;
    const pressureScale = 0.68 + this.missionProfile.pressure * 0.08;
    const reinforcement = {
      ...template,
      name: `${template.name} Echo ${this.reinforcementsCalled + 1}`,
      gridX: spawn.x,
      gridY: spawn.y,
      x: this.gridStartX + spawn.x * this.cellW + this.cellW / 2,
      y: this.gridStartY + spawn.y * this.cellH + 18,
      state: 'idle',
      stateTimer: 0,
      maxHp: Math.round((template.hp || 90) * pressureScale),
      currentHp: Math.round((template.hp || 90) * pressureScale),
      facing: -1,
      isBoss: false,
      statusEffects: { infected: 0, glitched: 0, radiated: 0 },
      reinforcement: true
    };
    this.enemies.push(reinforcement);
    this.turnQueue.push({ unit: reinforcement, type: 'enemy' });
    this.reinforcementsCalled++;
    this.particles.add(reinforcement.x, reinforcement.y - 34, 0, -1, '#ff8a50', 11, 45, 'text', 'RENFORT');
  }

  applyHazardPulse() {
    const hazardTiles = this.tiles.filter(tile => tile.type === 'hazard');
    if (!hazardTiles.length) return;
    const radius = this.missionProfile.hazardRadius || 0;
    const units = [
      ...this.heroes.filter(unit => unit.currentHp > 0),
      ...this.enemies.filter(unit => unit.currentHp > 0)
    ];
    hazardTiles.forEach(tile => {
      const px = this.gridStartX + tile.x * this.cellW + this.cellW / 2;
      const py = this.gridStartY + tile.y * this.cellH + this.cellH / 2;
      this.particles.add(px, py - 18, 0, -1, '#ff5b5b', 10, 42, 'text', 'SURTENSION');
      units.forEach(unit => {
        const dist = Math.abs(unit.gridX - tile.x) + Math.abs(unit.gridY - tile.y);
        if (dist <= radius) {
          unit.currentHp = Math.max(unit.isBoss ? 1 : 0, unit.currentHp - (8 + this.missionProfile.pressure * 2));
          const ux = this.gridStartX + unit.gridX * this.cellW + this.cellW / 2;
          const uy = this.gridStartY + unit.gridY * this.cellH + 18;
          this.particles.add(ux, uy - 28, 0, -1, '#ff5b5b', 10, 38, 'text', 'PULSE');
        }
      });
    });
    this.hazardPulses++;
  }

  applyTacticalBattleItem(pickup) {
    if (!pickup || this.gameOver) return false;
    const tier = pickup.tier || 'pickup';
    const effect = pickup.effect || {};
    const color = pickup.color || '#39c5bb';
    const triggerX = pickup.gridX ?? this.activeUnit?.gridX ?? 0;
    const triggerY = pickup.gridY ?? this.activeUnit?.gridY ?? 0;
    this.tacticalItemsUsed++;

    if (tier === 'ultimate') {
      const damage = Math.max(effect.ultimateDamage || 180, 160);
      this.enemies.forEach(enemy => {
        if (enemy.currentHp > 0) {
          this.applyDamage({ gridX: triggerX, gridY: triggerY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: color }, enemy, damage, null, { ignoreCover: true });
          this.tacticalItemImpact += damage;
        }
      });
      this.particles.add(this.width / 2, this.gridStartY - 14, 0, -1, color, 14, 52, 'text', 'CARTE ULTIME');
      return true;
    }

    if (tier === 'summon') {
      const target = this.enemies
        .filter(enemy => enemy.currentHp > 0)
        .sort((a, b) => b.currentHp - a.currentHp)[0];
      if (target) {
        const damage = Math.max(effect.summonDamage || 120, 90);
        this.applyDamage({ gridX: triggerX, gridY: triggerY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: color }, target, damage, 'glitched', { ignoreCover: true });
        this.tacticalItemImpact += damage;
        this.particles.add(target.x, target.y - 44, 0, -1, color, 12, 44, 'text', 'ASSIST');
      }
      const reinforcementBudget = this.missionProfile.reinforcementEvery > 0 ? -1 : 0;
      this.reinforcementsCalled = Math.max(0, this.reinforcementsCalled + reinforcementBudget);
      return true;
    }

    const heal = Math.max(effect.heal || effect.shield || 45, 35);
    const damage = Math.max(effect.damage || 55, 45);
    this.heroes.forEach(hero => {
      if (hero.currentHp <= 0) return;
      const dist = Math.abs(hero.gridX - triggerX) + Math.abs(hero.gridY - triggerY);
      if (dist <= 2) {
        hero.currentHp = Math.min(hero.maxHp, hero.currentHp + heal);
        hero.specialCharge = Math.min(100, (hero.specialCharge || 0) + 12);
        this.tacticalItemImpact += heal;
        this.particles.add(hero.x, hero.y - 28, 0, -1, color, 10, 38, 'text', '+TACT');
      }
    });
    this.enemies.forEach(enemy => {
      if (enemy.currentHp <= 0) return;
      const dist = Math.abs(enemy.gridX - triggerX) + Math.abs(enemy.gridY - triggerY);
      if (dist <= 1) {
        this.applyDamage({ gridX: triggerX, gridY: triggerY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: color }, enemy, damage, null, { ignoreCover: true });
        this.tacticalItemImpact += damage;
      }
    });
    this.particles.add(this.gridStartX + triggerX * this.cellW + this.cellW / 2, this.gridStartY + triggerY * this.cellH, 0, -1, color, 10, 42, 'text', 'RESSOURCE');
    return true;
  }

  getObjectiveFocusCells(unitType = 'hero') {
    if (this.objective === 'extract') return this.battlefield.extractionZone || [];
    if (this.objective === 'control') return this.tiles.filter(tile => tile.type === 'objective').map(tile => ({ x: tile.x, y: tile.y }));
    if (this.objective === 'disable') {
      return this.obstacles.filter(item => item.type === 'objective' && item.hp > 0).map(item => ({ x: item.gridX, y: item.gridY, unit: item }));
    }
    if (this.objective === 'commander') {
      return this.enemies.filter(enemy => enemy.isBoss && enemy.currentHp > 0).map(enemy => ({ x: enemy.gridX, y: enemy.gridY, unit: enemy }));
    }
    if (this.objective === 'survive' && unitType === 'hero') {
      return this.tiles.filter(tile => ['heal', 'heavyCover', 'lightCover', 'high'].includes(tile.type)).map(tile => ({ x: tile.x, y: tile.y }));
    }
    return [];
  }

  getClosestObjectiveCell(unit, unitType = 'hero') {
    const cells = this.getObjectiveFocusCells(unitType);
    if (!cells.length) return null;
    return cells.reduce((best, cell) => {
      const dist = Math.abs(unit.gridX - cell.x) + Math.abs(unit.gridY - cell.y);
      return !best || dist < best.dist ? { ...cell, dist } : best;
    }, null);
  }

  scoreObjectiveMove(unit, cell, objectiveCell, threatMap, unitType = 'hero') {
    const tile = this.getTileAt(cell.x, cell.y);
    const threat = threatMap.get(`${cell.x},${cell.y}`)?.count || 0;
    const objectiveDist = objectiveCell ? Math.abs(objectiveCell.x - cell.x) + Math.abs(objectiveCell.y - cell.y) : 0;
    let score = -objectiveDist * 6 - threat * (unitType === 'hero' ? 5 : 2);
    if (tile?.type === 'high') score += unitType === 'hero' ? 4 : 2;
    if (tile?.type === 'heavyCover') score += unitType === 'hero' ? 5 : 1;
    if (tile?.type === 'lightCover') score += unitType === 'hero' ? 3 : 1;
    if (tile?.type === 'heal' && unitType === 'hero' && unit.currentHp < unit.maxHp) score += 7;
    if (tile?.type === 'hazard') score -= unitType === 'hero' ? 8 : 3;
    if (this.objective === 'control' && tile?.type === 'objective') score += unitType === 'hero' ? 10 : 8;
    if (this.objective === 'extract' && (this.battlefield.extractionZone || []).some(zone => zone.x === cell.x && zone.y === cell.y)) score += unitType === 'hero' ? 12 : 7;
    return score;
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

    const objectiveCell = ['control', 'extract'].includes(this.objective)
      ? this.getClosestObjectiveCell(enemy, 'enemy')
      : null;
    const pressureTarget = objectiveCell || closestHero;
    let bestX = enemy.gridX;
    let bestY = enemy.gridY;
    let bestScore = -999;

    // Movement speed halved if glitched
    const maxMoveRange = enemy.statusEffects?.glitched > 0 ? 1 : 2;
    const emptyThreatMap = new Map();

    this.getReachableCells(enemy, maxMoveRange).forEach(cell => {
      const targetDist = Math.abs(pressureTarget.x - cell.x) + Math.abs(pressureTarget.y - cell.y);
      const hasShot = targetDist <= (enemy.isBoss ? 2 : 1) && this.hasLineOfSight({ ...enemy, gridX: cell.x, gridY: cell.y }, closestHero, 'enemy');
      const objectiveScore = objectiveCell ? this.scoreObjectiveMove(enemy, cell, objectiveCell, emptyThreatMap, 'enemy') : -targetDist * 4;
      const score = objectiveScore + (hasShot ? 12 : 0);
      if (score > bestScore) {
        bestScore = score;
        bestX = cell.x;
        bestY = cell.y;
      }
    });

    enemy.gridX = bestX;
    enemy.gridY = bestY;
    this.playSfx('jump');

    const attackDist = Math.abs(closestHero.gridX - enemy.gridX) + Math.abs(closestHero.gridY - enemy.gridY);
    const rangeLimit = enemy.isBoss ? 2 : 1;

    setTimeout(() => {
      if (attackDist <= rangeLimit && closestHero.currentHp > 0 && this.hasLineOfSight(enemy, closestHero, 'enemy')) {
        enemy.state = 'attack';
        enemy.stateTimer = 20;
        this.playSfx(enemy.weapon === 'gun' || enemy.weapon === 'laser' ? 'shoot' : 'slash');

        // Chance to inflict status effects by bosses
        let status = null;
        if (enemy.name.includes('Nemesis')) status = 'infected';
        if (enemy.name.includes('Smith')) status = 'glitched';
        if (enemy.name.includes('Deathclaw') || enemy.name.includes('Cyberdemon')) status = 'radiated';

        this.applyDamage(enemy, closestHero, enemy.atk, status, { actionType: 'enemy' });
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
    let bestMoveScore = -999;
    const objectiveCell = this.getClosestObjectiveCell(hero, 'hero');
    const threatMap = this.getEnemyThreatMap();

    this.movementRange.forEach(cell => {
      const d = Math.abs(closestEnemy.gridX - cell.x) + Math.abs(closestEnemy.gridY - cell.y);
      const hasShot = d <= this.getActionRange('secondary', hero) && this.hasLineOfSight({ ...hero, gridX: cell.x, gridY: cell.y }, closestEnemy, 'secondary');
      const objectiveScore = objectiveCell ? this.scoreObjectiveMove(hero, cell, objectiveCell, threatMap, 'hero') : -d * 4;
      const score = objectiveScore + (hasShot ? 10 : 0);
      if (score > bestMoveScore) {
        bestMoveScore = score;
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

    const findTargetIn = (candidates) => candidates.forEach(e => {
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
    const preferredEnemies = this.objective === 'commander'
      ? this.enemies.filter(e => e.isBoss)
      : this.enemies;
    findTargetIn(preferredEnemies);
    if (!target && preferredEnemies !== this.enemies) findTargetIn(this.enemies);

    // Check obstacles if no enemies in range
    if (!target) {
      this.obstacles.forEach(o => {
        if (o.hp > 0 && (o.type === 'barrel' || o.type === 'objective')) {
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
          this.applyDamage(hero, target, hero.stats.atk * hero.simple.dmg, status, { actionType: 'simple' });
          hero.specialCharge = Math.min(100, hero.specialCharge + 15);
        } else if (chosenAction === 'secondary') {
          hero.cooldown = hero.secondary.cd * 60;
          this.playSfx('shoot');
          this.applyDamage(hero, target, hero.stats.atk * hero.secondary.dmg, status, { actionType: 'secondary' });
          hero.specialCharge = Math.min(100, hero.specialCharge + 25);
        } else if (chosenAction === 'special') {
          hero.specialCharge = 0;
          this.playSfx('special');
          this.applyDamage(hero, target, hero.stats.atk * hero.special.dmg, status, { actionType: 'special' });
        }
      }
      this.endActiveTurn();
    }, 500);
  }

  applyDamage(attacker, defender, baseDmg, statusEffect = null, options = {}) {
    if (defender.type === 'barrier' || defender.type === 'barrel' || defender.type === 'objective') {
      // Destructible obstacle damage
      const wasAlive = defender.hp > 0;
      defender.hp = Math.max(0, defender.hp - Math.round(baseDmg));
      this.playSfx('hit');

      const targetPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
      const targetPxY = this.gridStartY + defender.gridY * this.cellH + 10;
      this.particles.add(targetPxX, targetPxY - 20, 0, -1.5, '#7f8c8d', 12, 35, 'text', `${Math.round(baseDmg)}`);

      if (wasAlive && defender.hp <= 0) {
        this.playSfx('defeat');
        this.updateTacticsObjective();
        // Trigger Naquadah barrel explosion
        if (defender.type === 'barrel') {
          this.triggerBarrelExplosion(defender.gridX, defender.gridY);
        }
      }
      return;
    }

    if (defender.state === 'defense' && defender.defense) {
      // Tech shield absorbs damage
      baseDmg *= (1 - defender.defense.reduce);
    }

    const coverReduction = options.ignoreCover ? 0 : this.getCoverReduction(attacker, defender, options.actionType || 'simple');
    if (coverReduction > 0) {
      baseDmg *= (1 - coverReduction);
      const coverPxX = this.gridStartX + defender.gridX * this.cellW + this.cellW / 2;
      const coverPxY = this.gridStartY + defender.gridY * this.cellH + 10;
      this.particles.add(coverPxX, coverPxY - 48, 0, -1, '#4fc3f7', 10, 42, 'text', `COVER -${Math.round(coverReduction * 100)}%`);
    }

    const defenseReduction = defender.stats?.def ? Math.min(0.3, defender.stats.def / 100) : 0;
    if (defenseReduction > 0) {
      baseDmg *= (1 - defenseReduction);
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

    const defenderWasAlive = defender.currentHp > 0;
    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);
    if (this.heroes.includes(attacker) && this.enemies.includes(defender)) this.damageDealt += finalDmg;
    if (this.enemies.includes(attacker) && this.heroes.includes(defender)) this.damageTaken += finalDmg;

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
      if (defenderWasAlive) {
        this.playSfx('defeat');
        this.updateTacticsObjective();
      }
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
        this.applyDamage({ gridX: bgX, gridY: bgY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, unit, 100, null, { ignoreCover: true });
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
            this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#f1c40f' }, e, dmg, status, { ignoreCover: true });
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
            this.applyDamage({ gridX: 0, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#3498db' }, e, dmg, null, { ignoreCover: true });
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
              this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#2ecc71' }, e, enemyDmg, null, { ignoreCover: true });
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
              this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#8e44ad' }, e, 120, null, { ignoreCover: true });
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
            this.applyDamage({ gridX: e.gridX, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, e, 100, null, { ignoreCover: true });
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
          this.applyDamage({ gridX: strongest.gridX - 1, gridY: strongest.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#00ff00' }, strongest, dmg, null, { ignoreCover: true });
        }
        break;
      }
      default: {
        this.enemies.forEach(e => {
          if (e.currentHp > 0) {
            this.applyDamage({ gridX: e.gridX - 1, gridY: e.gridY, stats: { atk: 1 }, simple: { dmg: 1 }, primaryColor: '#ffeb3b' }, e, 120, null, { ignoreCover: true });
          }
        });
      }
    }
  }
  update() {
    if (this.gameOver) {
      this.victoryTimer++;
      if (this.victoryTimer > 120 && !this.completionReported) {
        this.completionReported = true;
        this.onComplete(this.battleResult || 'defeat', this.getCombatSummary());
      }
      return;
    }

    const heroesAlive = this.heroes.some(h => h.currentHp > 0);
    const enemiesAlive = this.enemies.some(e => e.currentHp > 0);

    if (!heroesAlive) {
      this.completeBattle('defeat');
      return;
    }
    if (!enemiesAlive) {
      this.objectiveProgress = this.objectiveTarget;
      this.completeBattle('victory');
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
        
        const tile = this.getTileAt(c, r);
        ctx.fillStyle = this.getTileFill(tile);
        ctx.fillRect(cellX, cellY, this.cellW, this.cellH);
        ctx.strokeRect(cellX, cellY, this.cellW, this.cellH);

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = '8px monospace';
        ctx.fillText(`${String.fromCharCode(65 + c)}${r + 1}`, cellX + 4, cellY + 12);
        if (tile?.type && tile.type !== 'normal') {
          ctx.fillStyle = this.getTileLabelColor(tile);
          ctx.font = '7px "Press Start 2P"';
          ctx.fillText(this.getTileLabel(tile), cellX + 8, cellY + this.cellH - 10);
        }
      }
    }

    this.drawTacticsObjectiveZones(ctx, animTime);

    const threatMap = this.getEnemyThreatMap();
    threatMap.forEach(cell => {
      const tx = this.gridStartX + cell.x * this.cellW;
      const ty = this.gridStartY + cell.y * this.cellH;
      ctx.fillStyle = cell.count > 1 ? 'rgba(255, 92, 47, 0.24)' : 'rgba(255, 92, 47, 0.14)';
      ctx.fillRect(tx + 2, ty + 2, this.cellW - 4, this.cellH - 4);
      ctx.fillStyle = '#ff8a50';
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText(cell.count > 1 ? `x${cell.count}` : '!', tx + this.cellW - 18, ty + 13);
    });

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
      } else if (o.type === 'objective') {
        ctx.fillStyle = '#ffeb3b';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('LOCK', ox + 10, oy + 27);
      } else {
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('COV', ox + 14, oy + 27);
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
        if (cell.cost > 0) {
          ctx.fillStyle = '#b8ffd2';
          ctx.font = '9px "Press Start 2P"';
          ctx.fillText(`${cell.cost} AP`, cx + 12, cy + this.cellH - 10);
        }
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

        const target = this.getUnitAtCell(cell.x, cell.y);
        if (target && (target.type === 'enemy' || target.type === 'obstacle')) {
          const preview = this.getDamagePreview(this.activeUnit, target.unit, this.selectedAction);
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px "Press Start 2P"';
          ctx.fillText(`-${preview.damage}`, cx + 8, cy + this.cellH - 11);
          if (preview.cover > 0) {
            ctx.fillStyle = '#4fc3f7';
            ctx.font = '7px "Press Start 2P"';
            ctx.fillText('COVER', cx + 8, cy + 24);
          }
        }
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

        const enemyRange = this.getActionRange('enemy', e);
        const threatensHero = this.heroes.some(h => {
          if (h.currentHp <= 0) return false;
          const dist = Math.abs(e.gridX - h.gridX) + Math.abs(e.gridY - h.gridY);
          return dist <= enemyRange && this.hasLineOfSight(e, h, 'enemy');
        });
        if (threatensHero) {
          ctx.fillStyle = '#ff8a50';
          ctx.font = '12px "Press Start 2P"';
          ctx.fillText('!', e.x - 4, e.y - 42);
        }
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

    ctx.fillStyle = 'rgba(0,0,0,0.68)';
    ctx.fillRect(this.width - 245, 10, 235, 55);
    ctx.strokeStyle = '#2980b9';
    ctx.strokeRect(this.width - 245, 10, 235, 55);
    
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('ACTIVE:', this.width - 235, 22);

    const activeLabel = this.activeUnit ? this.activeUnit.name.split(' ')[0] : 'NONE';
    ctx.fillStyle = this.activeUnitType === 'hero' ? '#2ecc71' : '#ff8a50';
    ctx.fillText(activeLabel.toUpperCase().slice(0, 14), this.width - 170, 22);

    ctx.fillStyle = '#fff';
    ctx.fillText('NEXT:', this.width - 235, 40);

    let qStr = this.turnQueue.slice(0, 4).map(q => `${q.type === 'hero' ? 'H' : 'E'}:${q.unit.name.split(' ')[0]}`).join(' > ');
    ctx.fillStyle = '#00ffff';
    ctx.fillText((qStr || 'END').slice(0, 32), this.width - 235, 56);

    ctx.fillStyle = this.getBattlefieldAccent();
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText((this.battlefield.label?.fr || this.battlefield.id).toUpperCase().slice(0, 32), 20, 22);

    this.drawTacticsObjectiveHud(ctx);
  }

  drawTacticsObjectiveZones(ctx, animTime) {
    const pulse = 0.18 + Math.sin(animTime * 0.08) * 0.06;
    const drawCellMarker = (cell, color, label) => {
      const x = this.gridStartX + cell.x * this.cellW;
      const y = this.gridStartY + cell.y * this.cellH;
      ctx.fillStyle = color.replace('ALPHA', pulse.toFixed(2));
      ctx.fillRect(x + 3, y + 3, this.cellW - 6, this.cellH - 6);
      ctx.strokeStyle = color.replace('ALPHA', '0.7');
      ctx.strokeRect(x + 5, y + 5, this.cellW - 10, this.cellH - 10);
      ctx.fillStyle = '#fff';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText(label, x + 10, y + 24);
    };

    if (this.objective === 'extract') {
      (this.battlefield.extractionZone || []).forEach(cell => drawCellMarker(cell, 'rgba(57,197,187,ALPHA)', 'EXT'));
    }
    if (this.objective === 'control') {
      this.tiles.filter(tile => tile.type === 'objective').forEach(cell => drawCellMarker(cell, 'rgba(255,235,59,ALPHA)', 'HOLD'));
    }
  }

  drawTacticsObjectiveHud(ctx) {
    const pct = Math.min(1, this.objectiveProgress / Math.max(1, this.objectiveTarget));
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(18, 32, 315, 62);
    ctx.strokeStyle = this.getBattlefieldAccent();
    ctx.strokeRect(18, 32, 315, 62);
    ctx.fillStyle = '#dff';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText(this.getObjectiveText('fr').toUpperCase().slice(0, 44), 28, 48);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(28, 60, 248, 8);
    ctx.fillStyle = this.getBattlefieldAccent();
    ctx.fillRect(28, 60, 248 * pct, 8);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${this.objectiveProgress}/${this.objectiveTarget}`, 284, 68);
    ctx.fillStyle = this.getBattlefieldAccent();
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText((this.missionProfile.label?.fr || this.missionProfile.tier).toUpperCase().slice(0, 38), 28, 86);
  }

  getObjectiveText(lang = 'fr') {
    const lines = {
      rout: {
        fr: 'Directive: neutraliser la cellule hostile',
        en: 'Directive: neutralize the hostile cell'
      },
      control: {
        fr: 'Directive: tenir les points d ancrage',
        en: 'Directive: hold the anchor points'
      },
      extract: {
        fr: 'Directive: extraire deux agents lisibles',
        en: 'Directive: extract two readable agents'
      },
      disable: {
        fr: 'Directive: desactiver les verrous de faille',
        en: 'Directive: disable the breach locks'
      },
      commander: {
        fr: 'Directive: abattre le commandement local',
        en: 'Directive: break local command'
      },
      survive: {
        fr: 'Directive: survivre a la fenetre de stabilisation',
        en: 'Directive: survive the stabilization window'
      }
    };
    return (lines[this.objective] || lines.rout)[lang] || (lines[this.objective] || lines.rout).fr;
  }

  getCombatSummary() {
    const objectivePct = Math.round(Math.min(1, this.objectiveProgress / Math.max(1, this.objectiveTarget)) * 100);
    const defeatedEnemies = this.enemies.filter(enemy => enemy.currentHp <= 0).length;
    const survivingHeroes = this.heroes.filter(hero => hero.currentHp > 0).length;
    const score = Math.max(0, Math.round(
      objectivePct * 8
      + defeatedEnemies * 45
      + survivingHeroes * 70
      + this.damageDealt * 0.2
      - this.damageTaken * 0.12
      - this.turnsElapsed * 3
    ));
    const grade = score >= 900 ? 'S' : score >= 700 ? 'A' : score >= 500 ? 'B' : score >= 300 ? 'C' : 'D';
    return {
      mode: 'Tactics',
      battlefieldId: this.battlefield.id,
      battlefieldLabel: this.battlefield.label,
      objective: this.objective,
      objectiveText: {
        fr: this.getObjectiveText('fr'),
        en: this.getObjectiveText('en')
      },
      objectivePct,
      objectiveProgress: this.objectiveProgress,
      objectiveTarget: this.objectiveTarget,
      missionProfile: this.missionProfile,
      reinforcementsCalled: this.reinforcementsCalled,
      hazardPulses: this.hazardPulses,
      tacticalItemsUsed: this.tacticalItemsUsed,
      tacticalItemImpact: Math.round(this.tacticalItemImpact),
      turnsElapsed: this.turnsElapsed,
      defeatedEnemies,
      survivingHeroes,
      damageDealt: Math.round(this.damageDealt),
      damageTaken: Math.round(this.damageTaken),
      grade,
      score
    };
  }

  getTileFill(tile) {
    if (!tile) return 'rgba(10, 20, 40, 0.4)';
    if (tile.type === 'blocked') return 'rgba(12, 12, 16, 0.86)';
    if (tile.type === 'high') return 'rgba(74, 144, 226, 0.28)';
    if (tile.type === 'lightCover') return 'rgba(79, 195, 247, 0.16)';
    if (tile.type === 'heavyCover') return 'rgba(79, 195, 247, 0.28)';
    if (tile.type === 'hazard') return 'rgba(255, 91, 91, 0.24)';
    if (tile.type === 'heal') return 'rgba(46, 204, 113, 0.2)';
    if (tile.type === 'objective') return 'rgba(255, 235, 59, 0.20)';
    return 'rgba(10, 20, 40, 0.4)';
  }

  getTileLabel(tile) {
    if (tile.type === 'blocked') return 'BLOC';
    if (tile.type === 'high') return 'HIGH';
    if (tile.type === 'lightCover') return 'COV';
    if (tile.type === 'heavyCover') return 'COV+';
    if (tile.type === 'hazard') return 'RISK';
    if (tile.type === 'heal') return 'MED';
    if (tile.type === 'objective') return 'OBJ';
    return '';
  }

  getTileLabelColor(tile) {
    if (tile.type === 'hazard') return '#ff8a50';
    if (tile.type === 'heal') return '#2ecc71';
    if (tile.type === 'objective') return '#ffeb3b';
    if (tile.type === 'high') return '#8fb3ff';
    return '#4fc3f7';
  }

  getBattlefieldAccent() {
    if (this.battlefield.tags?.includes('horror')) return '#d72f2f';
    if (this.battlefield.tags?.includes('cyber')) return '#39c5bb';
    if (this.battlefield.tags?.includes('war')) return '#ff9f43';
    if (this.battlefield.tags?.includes('bossArena')) return '#f1c40f';
    return '#4fc3f7';
  }
}
