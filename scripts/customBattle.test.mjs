import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const customBattleModeSource = readFileSync(path.join(projectRoot, 'src/components/CustomBattleMode.jsx'), 'utf8');
const gameCanvasSource = readFileSync(path.join(projectRoot, 'src/components/GameCanvas.jsx'), 'utf8');
const hubScreenSource = readFileSync(path.join(projectRoot, 'src/components/HubScreen.jsx'), 'utf8');
const engineRpgSource = readFileSync(path.join(projectRoot, 'src/game/engineRpg.js'), 'utf8');
const engineTacticsSource = readFileSync(path.join(projectRoot, 'src/game/engineTactics.js'), 'utf8');
const indexCssSource = readFileSync(path.join(projectRoot, 'src/index.css'), 'utf8');
let vite;
let customBattle;
let fighterModule;
let rpgModule;
let tacticsModule;
let smashModule;

const particles = { add() {} };
const noop = () => {};
const makeHero = (id = 'hero', speed = 8) => ({
  id,
  name: id,
  universe: 'Nexus de Convergence',
  category: 'custom-test',
  primaryColor: '#39c5bb',
  secondaryColor: '#ffea00',
  weaponType: 'melee',
  stats: { hp: 180, atk: 18, def: 9, spd: speed },
  simple: { name: 'Test Strike', dmg: 1 },
  secondary: { name: 'Test Burst', dmg: 1.3, cd: 3 },
  defense: { name: 'Test Guard', reduce: 0.4, dur: 1 },
  special: { name: 'Test Rupture', dmg: 1.8 }
});
const makeThreat = (id = 'threat', speed = 12) => ({
  id,
  name: id,
  universe: 'Nexus de Convergence',
  hp: 160,
  atk: 16,
  def: 7,
  spd: speed,
  color: '#e74c3c',
  weapon: 'melee'
});
const makeEnemyData = (roster) => ({
  monsters: roster.filter(entry => !entry.isBoss),
  bosses: roster.filter(entry => entry.isBoss),
  worldBoss: roster.find(entry => entry.isWorldBoss) || null,
  customRoster: roster
});
const makeStage = (mode, opponentControl = 'p2') => ({
  id: 990001,
  name: `Custom ${mode} Test`,
  universe: 'Nexus de Convergence',
  mode,
  customBattle: {
    opponentControl,
    singleRoster: true
  }
});
const makeFighterCosmetics = () => ({
  npcAssist: {
    id: 'npc-assist:test',
    kind: 'npcAssist',
    name: { fr: 'Assist test', en: 'Test assist' },
    color: '#39c5bb',
    style: 'medic',
    effect: { damage: 14, guardDamage: 22, healRatio: 0.05 }
  },
  koEffect: {
    id: 'ko-effect:test',
    kind: 'koEffect',
    name: { fr: 'K.O. test', en: 'Test K.O.' },
    color: '#ff5a36',
    style: 'shards',
    visual: { pattern: 'shards', durationMs: 900, intensity: 0.8 }
  },
  introPose: {
    id: 'intro-pose:test',
    kind: 'introPose',
    name: { fr: 'Introduction test', en: 'Test introduction' },
    color: '#39c5bb',
    style: 'breach',
    animation: { key: 'intro-breach', durationMs: 1500 }
  },
  victoryPose: {
    id: 'victory-pose:test',
    kind: 'victoryPose',
    name: { fr: 'Victoire test', en: 'Test victory' },
    color: '#ffea00',
    style: 'duel',
    animation: { key: 'victory-duel', durationMs: 1800 }
  }
});

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  [
    customBattle,
    fighterModule,
    rpgModule,
    tacticsModule,
    smashModule
  ] = await Promise.all([
    vite.ssrLoadModule('/src/game/customBattle.js?custom-battle-tests'),
    vite.ssrLoadModule('/src/game/engineFighter.js?custom-battle-tests'),
    vite.ssrLoadModule('/src/game/engineRpg.js?custom-battle-tests'),
    vite.ssrLoadModule('/src/game/engineTactics.js?custom-battle-tests'),
    vite.ssrLoadModule('/src/game/engineSmash.js?custom-battle-tests')
  ]);
});

after(async () => {
  await vite?.close();
});

const makeTacticsLineEngine = (simpleAction) => {
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [{ ...makeHero('tactics-line-hero', 80), simple: simpleAction }],
    makeEnemyData([
      makeThreat('tactics-line-front', 1),
      makeThreat('tactics-line-back', 1)
    ]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );
  const hero = engine.heroes[0];
  hero.gridX = 0;
  hero.gridY = 2;
  engine.enemies[0].gridX = 1;
  engine.enemies[0].gridY = 2;
  engine.enemies[1].gridX = 2;
  engine.enemies[1].gridY = 2;
  engine.obstacles = [];
  engine.tiles = [];
  engine.actionPhase = 'action';
  engine.selectedAction = 'simple';
  engine.selectedActionExplicit = true;
  engine.calculateAttackRange();
  return engine;
};

test('hero resonance belongs to Arsenal and keeps shared hero cross-links', () => {
  const nexusGroup = hubScreenSource.slice(
    hubScreenSource.indexOf("id: 'nexus'"),
    hubScreenSource.indexOf("id: 'portal'")
  );
  const arsenalGroup = hubScreenSource.slice(
    hubScreenSource.indexOf("id: 'arsenal'"),
    hubScreenSource.indexOf("id: 'archives'")
  );

  assert.equal(nexusGroup.includes("id: 'roster'"), false);
  assert.equal(arsenalGroup.includes("id: 'roster'"), true);
  assert.equal((hubScreenSource.match(/\{ id: 'roster', label:/g) || []).length, 1);
  assert.match(hubScreenSource, /openHeroArsenal\(hero\.id, 'roster'\)/);
  assert.match(hubScreenSource, /openHeroArsenal\(selectedHero\.id, 'inventory'\)/);
  assert.match(hubScreenSource, /openHeroArsenal\(selectedHero\.id, 'party'\)/);
});

test('Custom Battle and Mosaic City use the dedicated session contract', () => {
  assert.match(hubScreenSource, /startDedicatedGame\('custom'\)/);
  assert.match(hubScreenSource, /tab\.id === 'mosaicHub'/);
  assert.match(hubScreenSource, /startDedicatedGame\('nexus'\)/);
  assert.match(hubScreenSource, /sessionExitRequest=\{sessionExitRequests\.custom\}/);
  assert.match(hubScreenSource, /sessionExitRequest=\{sessionExitRequests\.nexus\}/);
  assert.match(customBattleModeSource, /onSessionStart\?\.\(\)/);
  assert.match(customBattleModeSource, /onSessionStart=\{beginDedicatedSession\}/);
  assert.match(customBattleModeSource, /onSessionEnd\?\.\(\{ reason: 'abandoned' \}\)/);
  assert.match(hubScreenSource, /nexusLandingTab[\s\S]*tab\.id === 'anchorProfile'/);
});

test('Mosaic City freezes its loop and only leaves through controlled transitions', () => {
  const mosaicCitySource = hubScreenSource.slice(
    hubScreenSource.indexOf('function MosaicCityHub'),
    hubScreenSource.indexOf('function ExtinctionRoyale')
  );

  assert.match(mosaicCitySource, /sessionPausedRef = useRef\(sessionPaused\)/);
  assert.match(mosaicCitySource, /if \(sessionPausedRef\.current\) \{\s*rafId = window\.requestAnimationFrame\(loop\)/);
  assert.match(mosaicCitySource, /if \(sessionPausedRef\.current\) return;\s*const state = stateRef\.current/);
  assert.match(mosaicCitySource, /onSessionEnd\?\.\(\{ reason: 'abandoned' \}\)/);
  assert.match(hubScreenSource, /finishNexusSession\(\{ reason: 'transition' \}\);\s*setActiveTab\('missions'\)/);
  assert.match(hubScreenSource, /finishNexusSession\(\{ reason: 'transition' \}\);\s*setActiveTab\('codex'\)/);
});

test('dedicated custom runtime freezes input and hides its direct setup exit', () => {
  assert.match(gameCanvasSource, /sessionPausedRef = useRef\(sessionPaused\)/);
  assert.match(gameCanvasSource, /engineRef\.current\?\.setPaused\?\.\(sessionPaused\)/);
  assert.match(gameCanvasSource, /if \(sessionPausedRef\.current\) \{\s*frameId = requestAnimationFrame\(tick\)/);
  assert.match(gameCanvasSource, /\{!dedicatedSession && \(\s*<button\s*onClick=\{\(\) => onBattleEnd\('quit'\)\}/);
  assert.match(customBattleModeSource, /sessionPaused=\{sessionPaused\}/);
  assert.match(customBattleModeSource, /dedicatedSession=\{dedicatedSession\}/);
  assert.match(engineRpgSource, /if \(this\.paused\) \{[\s\S]*runWhenResumed\(\)/);
  assert.match(engineTacticsSource, /if \(this\.paused\) \{[\s\S]*runWhenResumed\(\)/);
  assert.match(indexCssSource, /@media \(max-width: 900px\) \{[\s\S]*\.hub-screen\.is-dedicated-game \.mosaic-rpg-panel \{[\s\S]*grid-template-columns: 1fr/);
});

test('RPG and Tactics scheduled actions wait until the dedicated pause resumes', async () => {
  for (const EngineClass of [rpgModule.EngineRpg, tacticsModule.EngineTactics]) {
    const schedulerHost = {
      disposed: false,
      paused: true,
      timers: new Set()
    };
    let callbackRan = false;

    EngineClass.prototype.schedule.call(schedulerHost, () => {
      callbackRan = true;
    }, 10);
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(callbackRan, false);

    EngineClass.prototype.setPaused.call(schedulerHost, false);
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(callbackRan, true);
    schedulerHost.timers.forEach(timer => clearTimeout(timer));
  }
});

test('custom battle preset keeps unique bounded teams and valid rules', () => {
  const normalized = customBattle.normalizeCustomBattlePreset({
    mode: 'Tactics',
    opponentControl: 'p2',
    playerTeamIds: ['a', 'a', 'b', 'c', 'd'],
    opponentTeamIds: ['e', 'e'],
    enemyIds: ['x', 'x', 'y'],
    difficulty: 'training',
    items: false,
    hazards: false,
    skipPreMatchInTraining: true
  }, {
    allowedHeroIds: ['a', 'b', 'c', 'd', 'e'],
    allowedEnemyIds: ['x', 'y']
  });

  assert.deepEqual(normalized.playerTeamIds, ['a', 'b', 'c']);
  assert.deepEqual(normalized.opponentTeamIds, ['e']);
  assert.deepEqual(normalized.enemyIds, ['x', 'y']);
  assert.equal(normalized.mode, 'Tactics');
  assert.equal(normalized.opponentControl, 'p2');
  assert.equal(normalized.difficulty, 'standard');
  assert.equal(normalized.items, false);
  assert.equal(normalized.hazards, false);
  assert.equal(normalized.stageVariant, 'lore');
  assert.equal(normalized.stageEventIntensity, 'off', 'legacy hazards=false did not migrate to P5 Off');
  assert.equal(normalized.stageTopologyId, 'auto');
  assert.equal(normalized.skipPreMatchInTraining, false);

  const smash = customBattle.normalizeCustomBattlePreset({
    mode: 'Smash',
    opponentControl: 'cpu',
    hazards: false,
    stageEventIntensity: 'full'
  });
  assert.equal(smash.hazards, true, 'hidden legacy hazard toggle still disabled Smash P5');
  assert.equal(smash.stageEventIntensity, 'full');
});

test('enemy catalog filters hidden universes and disabled enemy assets', () => {
  const fullCatalog = customBattle.buildCustomEnemyCatalog();
  assert.ok(fullCatalog.length > 1000);
  const nexusEntry = fullCatalog.find(entry => entry.universe === 'Nexus de Convergence');
  assert.ok(nexusEntry);

  const filtered = customBattle.buildCustomEnemyCatalog({
    hiddenUniverses: ['Halo'],
    disabledEnemyIds: [`${nexusEntry.universe}::${nexusEntry.name}`]
  });
  assert.equal(filtered.some(entry => entry.universe === 'Halo'), false);
  assert.equal(filtered.some(entry => entry.id === nexusEntry.id), false);
});

test('custom enemy roster resolves exact selected monster, boss, and world boss', () => {
  const catalog = customBattle.buildCustomEnemyCatalog();
  const selected = [
    customBattle.makeCustomEnemyId('Halo', 'monster', 'Covenant Grunt'),
    customBattle.makeCustomEnemyId('Halo', 'boss', 'Prophet of Regret'),
    customBattle.makeCustomEnemyId('Halo', 'worldBoss', 'Covenant Scarab Mech')
  ];
  const enemyData = customBattle.buildCustomEnemyData(selected, catalog);

  assert.deepEqual(enemyData.selectedEnemyIds, selected);
  assert.equal(enemyData.customRoster[0].name, 'Covenant Grunt');
  assert.equal(enemyData.bosses[0].name, 'Prophet of Regret');
  assert.equal(enemyData.worldBoss.name, 'Covenant Scarab Mech');
});

test('runtime custom stage carries selected content and never grants campaign currency', () => {
  const preset = customBattle.normalizeCustomBattlePreset({
    mode: 'Smash',
    opponentControl: 'p2',
    playerTeamIds: ['player_anchor'],
    enemyIds: ['threat'],
    difficulty: 'expert'
  });
  const enemyData = {
    monsters: [{ name: 'Threat', hp: 100, atk: 10, spd: 5 }],
    bosses: [{ name: 'Threat', hp: 100, atk: 10, spd: 5 }],
    customRoster: [{ name: 'Threat', hp: 100, atk: 10, spd: 5 }]
  };
  const archive = { id: 'archive:test', universe: 'Spider', image: '/stage.webp' };
  const battleMusic = { id: 'battle:test', musicStage: { mode: 'Fighter', modeVariant: 'combat' } };
  const cosmetics = { introPose: { id: 'intro:test' } };
  const stage = customBattle.buildCustomRuntimeStage({
    preset,
    archive,
    enemyData,
    battleMusic,
    cosmetics,
    nonce: 7
  });

  assert.equal(stage.mode, 'Smash');
  assert.equal(stage.universe, 'Spider');
  assert.equal(stage.goldPrize, 0);
  assert.equal(stage.shardPrize, 0);
  assert.equal(stage.tokenPrize, 0);
  assert.equal(stage.customBattle.opponentControl, 'p2');
  assert.equal(stage.customBattle.enemyData, enemyData);
  assert.equal(stage.customBattle.battleMusic.musicStage.mode, 'Smash');
  assert.equal(stage.customBattle.battleMusic.musicStage.modeVariant, 'melee');
  assert.equal(stage.customBattle.cosmetics.introPose.id, 'intro:test');
});

test('Fighter P2 controls the cpu side without running opponent AI', () => {
  const engine = new fighterModule.EngineFighter(
    960,
    540,
    [makeHero('fighter-p1')],
    [makeHero('fighter-p2')],
    particles,
    noop,
    noop,
    { opponentControl: 'p2' }
  );
  engine.countdown = 0;
  let aiCalls = 0;
  engine.updateAi = () => { aiCalls += 1; };

  const player = engine.getActive('player');
  const opponent = engine.getActive('cpu');
  const initialX = opponent.x;
  engine.setSideInput('cpu', { left: true });
  engine.update(0.034);
  assert.ok(opponent.x < initialX, 'P2 input did not move the opponent');
  assert.equal(aiCalls, 0, 'opponent AI ran during a local P2 match');

  player.x = 400;
  opponent.x = 450;
  player.vx = 0;
  opponent.vx = 0;
  engine.setSideInput('cpu', {});
  const initialHp = player.currentHp;
  assert.equal(engine.triggerSideAction('cpu', 'light'), true);
  for (let frame = 0; frame < 12; frame += 1) engine.update(0.034);
  assert.ok(player.currentHp < initialHp, 'P2 attack did not damage P1');
  assert.equal(aiCalls, 0);
});

test('Fighter consumes cosmetic events and keeps P2 assists independent', () => {
  const cosmetics = makeFighterCosmetics();
  const engine = new fighterModule.EngineFighter(
    960,
    540,
    [makeHero('cosmetic-p1')],
    [makeHero('cosmetic-p2')],
    particles,
    noop,
    noop,
    { opponentControl: 'p2', cosmetics }
  );
  const intro = engine.getSnapshot().cosmeticEvents.intro;
  assert.equal(intro.active, true);
  assert.equal(intro.playerId, cosmetics.introPose.id);
  assert.equal(intro.opponentId, cosmetics.introPose.id);

  engine.countdown = 0;
  const player = engine.getActive('player');
  const opponent = engine.getActive('cpu');
  player.x = 400;
  opponent.x = 450;
  player.currentHp -= 50;
  engine.assists.player.charge = 100;
  engine.assists.cpu.charge = 100;
  const playerHp = player.currentHp;
  const opponentHp = opponent.currentHp;

  assert.equal(engine.triggerAssist('player'), true);
  assert.ok(player.currentHp > playerHp, 'P1 assist did not apply its bounded heal');
  assert.ok(opponent.currentHp < opponentHp, 'P1 assist did not damage P2');
  let snapshot = engine.getSnapshot();
  assert.equal(snapshot.assists.player.used, true);
  assert.equal(snapshot.assists.opponent.used, false);
  assert.equal(snapshot.cosmeticEvents.assistId, cosmetics.npcAssist.id);

  player.action = null;
  player.hitstun = 0;
  opponent.action = null;
  opponent.hitstun = 0;
  opponent.invulnerable = 0;
  player.invulnerable = 0;
  const hpBeforeP2Assist = player.currentHp;
  assert.equal(engine.triggerAssist('cpu'), true);
  assert.ok(player.currentHp < hpBeforeP2Assist, 'P2 assist did not damage P1');
  snapshot = engine.getSnapshot();
  assert.equal(snapshot.assists.opponent.used, true);

  player.action = null;
  opponent.currentHp = 1;
  opponent.invulnerable = 0;
  engine.applyHit(player, opponent, {
    type: 'heavy',
    base: 1000,
    guardDamage: 20,
    knockback: 250
  });
  assert.equal(engine.getSnapshot().cosmeticEvents.koEffectId, cosmetics.koEffect.id);

  engine.finish('victory');
  const summary = engine.getSummary();
  assert.equal(summary.winnerSide, 'player');
  assert.equal(summary.victoryPose.id, cosmetics.victoryPose.id);
  assert.equal(engine.getSnapshot().cosmeticEvents.victoryPoseId, cosmetics.victoryPose.id);
});

test('Fighter CPU spends the same flat assist loadout when ready', () => {
  const engine = new fighterModule.EngineFighter(
    960,
    540,
    [makeHero('assist-p1')],
    [makeHero('assist-cpu')],
    particles,
    noop,
    noop,
    { opponentControl: 'cpu', cosmetics: makeFighterCosmetics() }
  );
  engine.countdown = 0;
  const player = engine.getActive('player');
  const cpu = engine.getActive('cpu');
  player.x = 400;
  cpu.x = 450;
  engine.assists.cpu.charge = 100;
  const initialHp = player.currentHp;

  engine.updateAi(0.034);
  assert.equal(engine.assists.cpu.used, true);
  assert.ok(player.currentHp < initialHp, 'CPU assist did not apply the same combat effect');
  assert.equal(engine.triggerAssist('cpu'), false, 'manual input bypassed CPU ownership');
});

test('RPG P2 waits at full ATB and attacks only after a manual command', () => {
  const threat = makeThreat('rpg-p2', 20);
  const engine = new rpgModule.EngineRpg(
    760,
    360,
    [makeHero('rpg-p1')],
    makeEnemyData([threat]),
    particles,
    noop,
    noop,
    makeStage('RPG')
  );

  try {
    const enemy = engine.enemies[0];
    const hero = engine.heroes[0];
    enemy.atb = 100;
    enemy.state = 'idle';
    engine.enemyGlobalRecovery = 0;
    const initialHp = hero.currentHp;

    for (let frame = 0; frame < 5; frame += 1) engine.update();
    assert.equal(hero.currentHp, initialHp, 'P2 opponent attacked automatically');
    assert.equal(enemy.atb, 100);
    assert.equal(enemy.state, 'idle');

    assert.equal(engine.triggerEnemyAbility(enemy, 'simple'), true);
    assert.equal(enemy.atb, 0);
    assert.equal(enemy.state, 'attack');
    assert.equal(engine.enemyActionLock, true);
  } finally {
    engine.dispose();
    assert.equal(engine.timers.size, 0);
  }
});

test('Tactics gives the first fast enemy P2 a move and a targeted action', () => {
  const threat = makeThreat('tactics-p2', 60);
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('tactics-p1', 1)],
    makeEnemyData([threat]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    assert.equal(engine.activeUnitType, 'enemy');
    assert.equal(engine.actionPhase, 'move');
    const enemy = engine.activeUnit;
    const hero = engine.heroes[0];
    enemy.gridX = Math.min(engine.cols - 1, hero.gridX + 1);
    enemy.gridY = hero.gridY;
    engine.calculateMovementRange();

    const move = engine.handleCellClick(enemy.gridX, enemy.gridY);
    assert.deepEqual(
      { handled: move.handled, type: move.type },
      { handled: true, type: 'move' }
    );
    assert.equal(engine.actionPhase, 'action');
    assert.equal(engine.selectAction('simple'), true);
    const initialHp = hero.currentHp;
    const action = engine.handleCellClick(hero.gridX, hero.gridY);
    assert.equal(action.handled, true);
    assert.equal(action.type, 'action');
    assert.equal(action.target.unit, hero);
    assert.ok(hero.currentHp < initialHp);
  } finally {
    engine.dispose();
    assert.equal(engine.timers.size, 0);
  }
});

test('Tactics simple melee lines stop on the first character', () => {
  const engine = makeTacticsLineEngine({
    name: 'Directional Test Strike',
    type: 'melee',
    dmg: 1,
    tacticsProfile: { delivery: 'melee', shape: 'directional', range: 3 }
  });

  try {
    const [front, back] = engine.enemies;
    assert.equal(engine.getAttackProfile(engine.heroes[0], 'simple').maxTargets, 1);
    assert.equal(engine.attackRange.some(cell => cell.x === back.gridX && cell.y === back.gridY), false);
    const backHp = back.currentHp;
    const action = engine.handleCellClick(front.gridX, front.gridY);
    assert.equal(action.handled, true);
    assert.ok(front.currentHp < front.maxHp);
    assert.equal(back.currentHp, backHp);
  } finally {
    engine.dispose();
  }
});

test('Tactics ranged lines can select behind a unit but stay single-target', () => {
  const engine = makeTacticsLineEngine({
    name: 'Ranged Directional Test',
    type: 'bullet',
    dmg: 1,
    targeting: { delivery: 'ranged', shape: 'directional', range: 3 }
  });

  try {
    const [front, back] = engine.enemies;
    assert.equal(engine.attackRange.some(cell => cell.x === back.gridX && cell.y === back.gridY), true);
    const frontHp = front.currentHp;
    const action = engine.handleCellClick(back.gridX, back.gridY);
    assert.equal(action.handled, true);
    assert.equal(front.currentHp, frontHp);
    assert.ok(back.currentHp < back.maxHp);
  } finally {
    engine.dispose();
  }
});

test('Tactics powerful piercing lines can hit two aligned characters', () => {
  const engine = makeTacticsLineEngine({
    name: 'Piercing Test Strike',
    type: 'melee',
    dmg: 1,
    attackProfile: {
      delivery: 'melee',
      shape: 'line',
      range: 3,
      powerful: true,
      maxTargets: 2
    }
  });

  try {
    const [front, back] = engine.enemies;
    assert.equal(engine.attackRange.some(cell => cell.x === back.gridX && cell.y === back.gridY), true);
    const action = engine.handleCellClick(back.gridX, back.gridY);
    assert.equal(action.handled, true);
    assert.ok(front.currentHp < front.maxHp);
    assert.ok(back.currentHp < back.maxHp);
  } finally {
    engine.dispose();
  }
});

test('Tactics attack toggle returns to movement without refunding spent AP', () => {
  const engine = makeTacticsLineEngine({
    name: 'Cancelable Test Strike',
    type: 'melee',
    dmg: 1,
    tacticsProfile: { delivery: 'melee', shape: 'directional', range: 3 }
  });

  try {
    engine.movementBudget = 2;
    engine.movementSpent = 1;
    assert.equal(engine.selectAction('simple'), true);
    assert.equal(engine.actionPhase, 'move');
    assert.equal(engine.selectedAction, null);
    assert.ok(engine.movementRange.every(cell => (cell.cost || 0) <= 1));
  } finally {
    engine.dispose();
  }
});

test('Tactics camera pan and zoom preserve grid hit-testing', () => {
  const engine = makeTacticsLineEngine({
    name: 'Camera Test Strike',
    type: 'melee',
    dmg: 1
  });

  try {
    engine.panCameraBy(73, 41);
    engine.zoomCameraAt(1.4, 380, 210);
    const screen = engine.gridToScreen(2, 2);
    assert.deepEqual(engine.screenToGrid(screen.x, screen.y), { x: 2, y: 2 });
    assert.ok(engine.getCameraState().zoom > 1);
  } finally {
    engine.dispose();
  }
});

test('RPG anchors every custom combatant on the perspective floor', () => {
  const heroes = [
    makeHero('rpg-floor-a'),
    makeHero('rpg-floor-b'),
    makeHero('rpg-floor-c')
  ];
  const roster = [
    { ...makeThreat('rpg-floor-enemy-a'), anchor: { x: 0.91, y: 0.08 } },
    { ...makeThreat('rpg-floor-enemy-b'), isBoss: true, anchor: { x: 0.78, y: 0.22 } },
    { ...makeThreat('rpg-floor-enemy-c'), anchor: { x: 0.84, y: 0.34 } }
  ];
  const engine = new rpgModule.EngineRpg(
    760,
    360,
    heroes,
    makeEnemyData(roster),
    particles,
    noop,
    noop,
    makeStage('RPG', 'cpu')
  );

  try {
    const floorThreshold = engine.height * (engine.getFloorHorizon() + 0.08);
    [...engine.heroes, ...engine.enemies].forEach(unit => {
      assert.ok(unit.homeY >= floorThreshold, `${unit.name} spawned above the RPG floor`);
      assert.equal(unit.y, unit.homeY);
    });
    assert.ok(engine.heroes[0].homeY < engine.heroes[1].homeY);
    assert.ok(engine.heroes[1].homeY < engine.heroes[2].homeY);
    assert.ok(engine.enemies[0].homeY >= engine.height * 0.66);
    assert.equal(engine.enemies[0].homeX, Math.round(engine.width * 0.91));
  } finally {
    engine.dispose();
  }
});

test('RPG and Tactics keep source hero stats immutable across synergy runtime copies', () => {
  for (const [mode, EngineClass, height] of [
    ['RPG', rpgModule.EngineRpg, 360],
    ['Tactics', tacticsModule.EngineTactics, 420]
  ]) {
    const heroes = [
      { ...makeHero(`${mode}-stats-a`), category: 'slayer' },
      { ...makeHero(`${mode}-stats-b`), category: 'slayer' }
    ];
    const originalStats = heroes.map(hero => ({ ...hero.stats }));
    const engine = new EngineClass(
      760,
      height,
      heroes,
      makeEnemyData([makeThreat(`${mode}-stats-enemy`)]),
      particles,
      noop,
      noop,
      makeStage(mode, 'cpu')
    );

    try {
      assert.deepEqual(heroes.map(hero => hero.stats), originalStats);
      assert.ok(engine.heroes.every(hero => hero.stats !== heroes.find(source => source.id === hero.id)?.stats));
      assert.ok(engine.heroes.every(hero => hero.stats.atk > originalStats[0].atk));
    } finally {
      engine.dispose();
    }
  }
});

test('Tactics projects a widening floor board and round-trips every cell after camera changes', () => {
  const engine = makeTacticsLineEngine({
    name: 'Perspective Board Test',
    type: 'melee',
    dmg: 1
  });

  try {
    const board = engine.getBoardPolygon();
    const topWidth = board[1].x - board[0].x;
    const bottomWidth = board[2].x - board[3].x;
    assert.ok(bottomWidth > topWidth * 1.25);
    assert.ok(engine.gridStartY >= engine.height * 0.3);
    assert.ok(engine.getCellBounds(2, engine.rows - 1).width > engine.getCellBounds(2, 0).width);
    assert.ok(engine.getUnitRenderScale(engine.rows - 1) > engine.getUnitRenderScale(0));

    const assertRoundTrips = () => {
      for (let row = 0; row < engine.rows; row += 1) {
        for (let col = 0; col < engine.cols; col += 1) {
          const screen = engine.gridToScreen(col, row);
          assert.deepEqual(engine.screenToGrid(screen.x, screen.y), { x: col, y: row });
        }
      }
    };
    assertRoundTrips();
    engine.panCameraBy(61, 27);
    engine.zoomCameraAt(1.35, 380, 210);
    assertRoundTrips();

    engine.syncActorsToCamera();
    [...engine.heroes, ...engine.enemies].forEach(unit => {
      assert.deepEqual(
        { x: unit.x, y: unit.y },
        engine.getUnitScreenPosition(unit.gridX, unit.gridY)
      );
    });
  } finally {
    engine.dispose();
  }
});

test('Tactics profiles expose diagonal, multi-axis and area footprints', () => {
  const engine = makeTacticsLineEngine({
    name: 'Profile Shape Test',
    type: 'melee',
    dmg: 1
  });

  try {
    const hero = engine.heroes[0];
    hero.gridX = 3;
    hero.gridY = 2;
    hero.secondary = {
      name: 'Three Axis Test',
      dmg: 1,
      tacticsProfile: {
        targeting: { shape: 'multiAxis', range: 2, axes: 3, powerful: true }
      }
    };
    hero.special = {
      name: 'Area Test',
      type: 'magic_aoe',
      dmg: 2,
      tacticsProfile: { shape: 'area', range: 4, areaRadius: 1 }
    };
    const multiAxis = engine.getAttackImpactCells(hero, { gridX: 5, gridY: 2 }, 'secondary');
    assert.ok(multiAxis.some(cell => cell.x === 5 && cell.y === 2));
    assert.ok(multiAxis.some(cell => cell.x === 4 && cell.y === 1));
    assert.ok(multiAxis.some(cell => cell.x === 4 && cell.y === 3));
    assert.equal(
      engine.canAttackCell(
        hero,
        { gridX: 5, gridY: 3 },
        engine.getAttackProfile(hero, 'secondary')
      ),
      false,
      'off-axis target was accepted even though no multi-axis ray crossed it'
    );
    const area = engine.getAttackImpactCells(hero, { gridX: 5, gridY: 2 }, 'special');
    assert.equal(area.length, 9);
    assert.equal(
      engine.isCellInAttackPattern(
        hero,
        { gridX: 5, gridY: 4 },
        { shape: 'directional', directions: 8, minRange: 1 }
      ),
      true
    );
  } finally {
    engine.dispose();
  }
});

test('Tactics finite area attacks prioritize the valid clicked target deterministically', () => {
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [{
      ...makeHero('finite-area-hero', 80),
      secondary: {
        name: 'Finite Blast',
        type: 'explosive',
        dmg: 1.3,
        cd: 3,
        tacticsProfile: {
          delivery: 'ranged',
          shape: 'area',
          range: 4,
          areaRadius: 1,
          maxTargets: 2
        }
      }
    }],
    makeEnemyData([
      makeThreat('finite-area-clicked', 1),
      makeThreat('finite-area-upper', 1),
      makeThreat('finite-area-left', 1)
    ]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const [clicked, upper, left] = engine.enemies;
    hero.gridX = 0;
    hero.gridY = 2;
    clicked.gridX = 3;
    clicked.gridY = 2;
    upper.gridX = 3;
    upper.gridY = 1;
    left.gridX = 2;
    left.gridY = 2;
    engine.obstacles = [];
    engine.tiles = [];

    const targets = engine.getAttackTargets(
      hero,
      { gridX: clicked.gridX, gridY: clicked.gridY },
      'secondary',
      'hero'
    );
    assert.deepEqual(
      targets.map(entry => entry.unit.id),
      [clicked.id, upper.id],
      'clicked target was dropped or remaining AoE targets were unstable'
    );
    assert.equal(targets.some(entry => entry.unit === left), false);
  } finally {
    engine.dispose();
  }
});

test('Tactics finite target budgets remove unreachable fringe cells from enemy threats', () => {
  const finiteAreaCaster = {
    ...makeThreat('finite-threat-caster', 1),
    weapon: 'rocket',
    simple: {
      name: 'Single Victim Blast',
      type: 'explosive',
      dmg: 1,
      tacticsProfile: {
        delivery: 'ranged',
        shape: 'area',
        range: 1,
        areaRadius: 1,
        maxTargets: 1
      }
    }
  };
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('finite-threat-north', 80), makeHero('finite-threat-west', 70)],
    makeEnemyData([finiteAreaCaster]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const [north, west] = engine.heroes;
    const enemy = engine.enemies[0];
    enemy.gridX = 3;
    enemy.gridY = 2;
    north.gridX = 3;
    north.gridY = 1;
    west.gridX = 2;
    west.gridY = 2;
    engine.obstacles = [];
    engine.tiles = [];

    const threatMap = engine.getEnemyThreatMap();
    assert.equal(threatMap.has('3,1'), true);
    assert.equal(threatMap.has('2,2'), true);
    assert.equal(
      threatMap.has('2,1'),
      false,
      'empty fringe stayed threatened although every covering anchor had spent maxTargets'
    );
  } finally {
    engine.dispose();
  }
});

test('Tactics directional footprints honor minRange before exposing ray cells', () => {
  const engine = makeTacticsLineEngine({
    name: 'Minimum Range Pike',
    type: 'melee',
    dmg: 1,
    tacticsProfile: {
      delivery: 'melee',
      shape: 'directional',
      range: 3,
      minRange: 2
    }
  });

  try {
    const hero = engine.heroes[0];
    hero.gridX = 3;
    hero.gridY = 2;
    engine.enemies[0].gridX = 0;
    engine.enemies[0].gridY = 0;
    engine.enemies[1].gridX = 0;
    engine.enemies[1].gridY = 1;
    let footprint = engine.getAttackImpactCells(hero, { gridX: 6, gridY: 2 }, 'simple');
    assert.equal(footprint.some(cell => cell.x === 4 && cell.y === 2), false);
    assert.equal(footprint.some(cell => cell.x === 5 && cell.y === 2), true);
    assert.equal(footprint.some(cell => cell.x === 6 && cell.y === 2), true);

    engine.enemies[0].gridX = 4;
    engine.enemies[0].gridY = 2;
    footprint = engine.getAttackImpactCells(hero, { gridX: 6, gridY: 2 }, 'simple');
    assert.equal(
      footprint.some(cell => cell.x >= 5 && cell.y === 2),
      false,
      'a blocker inside minRange did not stop the ray'
    );
  } finally {
    engine.dispose();
  }
});

test('Tactics even cone and multi-axis counts normalize to symmetric aimed footprints', () => {
  const engine = makeTacticsLineEngine({
    name: 'Symmetry Harness',
    type: 'melee',
    dmg: 1
  });

  try {
    const hero = engine.heroes[0];
    hero.gridX = 3;
    hero.gridY = 2;
    engine.enemies[0].gridX = 0;
    engine.enemies[0].gridY = 0;
    engine.enemies[1].gridX = 0;
    engine.enemies[1].gridY = 1;
    hero.secondary = {
      name: 'Even Multi Axis',
      type: 'magic',
      dmg: 1,
      cd: 3,
      tacticsProfile: {
        delivery: 'ranged',
        shape: 'multiAxis',
        range: 2,
        axes: 2
      }
    };
    hero.special = {
      name: 'Even Cone',
      type: 'flame',
      dmg: 1,
      tacticsProfile: {
        delivery: 'ranged',
        shape: 'cone',
        range: 2,
        axes: 2
      }
    };

    ['secondary', 'special'].forEach(actionType => {
      const profile = engine.getAttackProfile(hero, actionType);
      const footprint = engine.getAttackImpactCells(
        hero,
        { gridX: 5, gridY: 2 },
        actionType
      );
      assert.equal(profile.axes, 3, `${actionType} did not normalize to an odd ray contract`);
      assert.equal(footprint.some(cell => cell.x === 4 && cell.y === 2), true);
      assert.equal(footprint.some(cell => cell.x === 4 && cell.y === 1), true);
      assert.equal(footprint.some(cell => cell.x === 4 && cell.y === 3), true);
    });
  } finally {
    engine.dispose();
  }
});

test('Tactics hero AI resolves an area target on the attack fringe through a splash anchor', () => {
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [{
      ...makeHero('hero-ai-area', 80),
      secondary: {
        name: 'AI Fringe Blast',
        type: 'explosive',
        dmg: 1.3,
        cd: 3,
        tacticsProfile: {
          delivery: 'ranged',
          shape: 'area',
          range: 2,
          areaRadius: 1
        }
      }
    }],
    makeEnemyData([makeThreat('hero-ai-area-target', 1)]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const enemy = engine.enemies[0];
    hero.gridX = 2;
    hero.gridY = 2;
    enemy.gridX = 5;
    enemy.gridY = 2;
    engine.obstacles = [];
    engine.tiles = [];
    engine.activeUnit = hero;
    engine.activeUnitType = 'hero';
    engine.movementRange = [{ x: hero.gridX, y: hero.gridY, cost: 0 }];
    engine.endActiveTurn = noop;
    const scheduled = [];
    engine.schedule = callback => {
      scheduled.push(callback);
      return null;
    };
    let usedAnchor = null;
    const applyProfiledAttack = engine.applyProfiledAttack.bind(engine);
    engine.applyProfiledAttack = (attacker, anchor, ...args) => {
      usedAnchor = { gridX: anchor.gridX, gridY: anchor.gridY };
      return applyProfiledAttack(attacker, anchor, ...args);
    };

    const initialHp = enemy.currentHp;
    engine.runHeroAI();
    assert.equal(scheduled.length, 1);
    scheduled.shift()();
    assert.deepEqual(usedAnchor, { gridX: 4, gridY: 2 });
    assert.ok(enemy.currentHp < initialHp, 'hero AI did not hit the AoE fringe target');
  } finally {
    engine.dispose();
  }
});

test('Tactics hero AI accepts only targets resolved by a cardinal directional profile', () => {
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [{
      ...makeHero('hero-ai-directional', 80),
      secondary: {
        name: 'AI Cardinal Shot',
        type: 'bullet',
        dmg: 1.3,
        cd: 3,
        tacticsProfile: {
          delivery: 'ranged',
          shape: 'directional',
          directions: 4,
          range: 3
        }
      }
    }],
    makeEnemyData([makeThreat('hero-ai-directional-target', 1)]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const enemy = engine.enemies[0];
    hero.gridX = 2;
    hero.gridY = 2;
    enemy.gridX = 4;
    enemy.gridY = 3;
    engine.obstacles = [];
    engine.tiles = [];
    engine.activeUnit = hero;
    engine.activeUnitType = 'hero';
    engine.movementRange = [{ x: hero.gridX, y: hero.gridY, cost: 0 }];
    engine.endActiveTurn = noop;
    const scheduled = [];
    engine.schedule = callback => {
      scheduled.push(callback);
      return null;
    };

    const initialHp = enemy.currentHp;
    engine.runHeroAI();
    scheduled.shift()();
    assert.equal(enemy.currentHp, initialHp, 'hero AI attacked an off-axis target');

    enemy.gridX = 4;
    enemy.gridY = 2;
    engine.activeUnit = hero;
    engine.activeUnitType = 'hero';
    scheduled.length = 0;
    engine.runHeroAI();
    scheduled.shift()();
    assert.ok(enemy.currentHp < initialHp, 'hero AI skipped the aligned directional target');
  } finally {
    engine.dispose();
  }
});

test('Tactics enemy threat maps include complete overlapping area footprints', () => {
  const areaCaster = {
    ...makeThreat('area-caster', 1),
    weapon: 'rocket',
    simple: {
      name: 'Blast Zone',
      type: 'explosive',
      dmg: 1,
      tacticsProfile: {
        delivery: 'ranged',
        shape: 'area',
        range: 2,
        areaRadius: 1
      }
    }
  };
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('area-threat-target', 80)],
    makeEnemyData([areaCaster]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const enemy = engine.enemies[0];
    hero.gridX = 6;
    hero.gridY = 2;
    enemy.gridX = 3;
    enemy.gridY = 2;
    engine.obstacles = [];
    engine.tiles = [];
    engine.hazardsDisabled = true;
    const threatMap = engine.getEnemyThreatMap();
    assert.equal(threatMap.has('6,2'), true, 'AoE edge outside center range was not threatened');
    assert.equal(threatMap.get('4,2')?.count, 1, 'overlapping anchors counted one enemy more than once');
    assert.equal(engine.enemyThreatCells.get(enemy)?.has('6,2'), true);

    const scheduled = [];
    engine.activeUnit = enemy;
    engine.activeUnitType = 'enemy';
    engine.getReachableCells = () => [{ x: enemy.gridX, y: enemy.gridY, cost: 0 }];
    engine.schedule = callback => {
      scheduled.push(callback);
      return null;
    };
    const initialHp = hero.currentHp;
    engine.runEnemyAI();
    scheduled.shift()();
    assert.ok(hero.currentHp < initialHp, 'AI did not place an empty-cell AoE on its fringe');
  } finally {
    engine.dispose();
  }
});

test('Tactics enemy threats and AI respect directional attack profiles', () => {
  const directionalGunner = {
    ...makeThreat('directional-gunner', 1),
    weapon: 'gun',
    simple: {
      name: 'Cardinal Rail Shot',
      type: 'bullet',
      dmg: 1,
      tacticsProfile: {
        delivery: 'ranged',
        shape: 'directional',
        directions: 4,
        range: 3
      }
    }
  };
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('directional-target', 80)],
    makeEnemyData([directionalGunner]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const enemy = engine.enemies[0];
    hero.gridX = 0;
    hero.gridY = 0;
    enemy.gridX = 1;
    enemy.gridY = 1;
    engine.obstacles = [];
    engine.tiles = [];
    engine.hazardsDisabled = true;

    const threatMap = engine.getEnemyThreatMap();
    assert.equal(threatMap.has('0,0'), false, 'off-axis cell was incorrectly threatened');
    assert.equal(threatMap.has('1,0'), true, 'aligned cell was missing from the threat map');

    const scheduled = [];
    engine.activeUnit = enemy;
    engine.activeUnitType = 'enemy';
    engine.getReachableCells = () => [{ x: enemy.gridX, y: enemy.gridY, cost: 0 }];
    engine.schedule = callback => {
      scheduled.push(callback);
      return null;
    };

    const initialHp = hero.currentHp;
    engine.runEnemyAI();
    scheduled.shift()();
    assert.equal(hero.currentHp, initialHp, 'AI fired a cardinal attack diagonally');

    scheduled.length = 0;
    hero.gridY = 1;
    engine.activeUnit = enemy;
    engine.activeUnitType = 'enemy';
    engine.runEnemyAI();
    scheduled.shift()();
    assert.ok(hero.currentHp < initialHp, 'AI did not fire once the target was aligned');
  } finally {
    engine.dispose();
  }
});

test('Tactics mirrors P2 pickups and keeps unknown effects neutral', () => {
  const engine = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('pickup-p1', 1)],
    makeEnemyData([makeThreat('pickup-p2', 60)]),
    particles,
    noop,
    noop,
    makeStage('Tactics')
  );

  try {
    const hero = engine.heroes[0];
    const enemy = engine.enemies[0];
    hero.currentHp = 120;
    enemy.currentHp = 70;
    enemy.gridX = Math.min(engine.cols - 1, hero.gridX + 1);
    enemy.gridY = hero.gridY;

    const pickup = {
      pickupId: 'p2-mirrored-pickup',
      tier: 'pickup',
      gridX: enemy.gridX,
      gridY: enemy.gridY,
      color: '#ff8a50',
      effect: { heal: 36, damage: 24 }
    };
    const heroHpBefore = hero.currentHp;
    const enemyHpBefore = enemy.currentHp;
    assert.equal(engine.applyTacticalBattleItem(pickup, 'test', 'enemy'), true);
    assert.ok(enemy.currentHp > enemyHpBefore, 'P2 pickup did not heal the P2 side');
    assert.ok(hero.currentHp < heroHpBefore, 'P2 pickup did not damage the P1 side');

    const heroHpAfterMirror = hero.currentHp;
    const enemyHpAfterMirror = enemy.currentHp;
    assert.equal(engine.applyTacticalBattleItem({
      ...pickup,
      pickupId: 'p2-unknown-pickup',
      effect: { unsupportedStatus: 'future-effect' }
    }, 'test', 'enemy'), true);
    assert.equal(hero.currentHp, heroHpAfterMirror, 'unknown P2 effect changed P1 health');
    assert.equal(enemy.currentHp, enemyHpAfterMirror, 'unknown P2 effect changed P2 health');
  } finally {
    engine.dispose();
    assert.equal(engine.timers.size, 0);
  }
});

test('Smash P2 moves and lands a manual opponent attack', () => {
  const stage = makeStage('Smash');
  stage.customBattle.difficulty = 'training';
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('smash-p1')],
    makeEnemyData([makeThreat('smash-p2')]),
    particles,
    noop,
    noop,
    stage
  );
  assert.equal(engine.skipPreMatch(), true, 'training could not skip PRE_MATCH_LOCK');
  const hero = engine.getActiveHero();
  const opponent = engine.getActiveOpponent();
  const initialX = opponent.x;

  engine.update({}, { left: true });
  assert.ok(opponent.x < initialX, 'P2 input did not move the Smash opponent');

  opponent.x = hero.x + 40;
  opponent.y = hero.y;
  opponent.vx = 0;
  opponent.vy = 0;
  opponent.facing = -1;
  opponent.state = 'idle';
  const initialHp = hero.currentHp;
  assert.equal(engine.triggerOpponentAbility('simple'), true);
  assert.ok(hero.currentHp < initialHp, 'P2 attack did not damage P1');
});

test('Smash semantic P4 charge resolves one hit and one mastery metric', () => {
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('player_anchor')],
    makeEnemyData([makeThreat('p4-charge-target')]),
    particles,
    noop,
    noop,
    makeStage('Smash')
  );
  const hero = engine.getActiveHero();
  const opponent = engine.getActiveOpponent();
  const baselineY = engine.arena.groundY;
  hero.x = 240;
  hero.y = baselineY;
  hero.facing = 1;
  opponent.x = 290;
  opponent.y = baselineY;
  opponent.facing = -1;

  assert.equal(hero.state, 'intro');
  assert.equal(engine.beginChargedMeleeAttack('player'), false, 'intro accepted a combat action');
  const introHeroHp = hero.currentHp;
  const introOpponentHp = opponent.currentHp;
  assert.equal(engine.triggerOpponentAbility('simple'), false, 'legacy P2 action bypassed the intro');
  engine.triggerAbility(hero, 'simple');
  assert.equal(engine.triggerCombatEvent('hammer_strike'), false, 'combat item bypassed the intro lock');
  assert.equal(hero.state, 'intro', 'legacy P1 action interrupted the intro');
  assert.equal(hero.currentHp, introHeroHp);
  assert.equal(opponent.currentHp, introOpponentHp);
  assert.equal(engine.itemTriggers, 0, 'combat item was consumed during the intro');
  for (let frame = 0; frame < 20; frame++) engine.update({ right: true }, { left: true });
  assert.equal(hero.x, 240, 'P1 moved before the intro completed');
  assert.equal(opponent.x, 290, 'P2 moved before the intro completed');
  for (let frame = 0; frame < 160; frame++) engine.update({}, {});
  assert.equal(engine.getPreMatchState('fr').locked, false, 'PRE_MATCH_LOCK did not last exactly 180 ticks');
  assert.equal(hero.state, 'idle');
  assert.equal(engine.triggerCombatEvent('heal_squad'), true, 'combat item did not report a successful activation');
  assert.equal(engine.itemTriggers, 1, 'successful combat item was not consumed exactly once');

  assert.equal(engine.beginChargedMeleeAttack('player'), true);
  for (let frame = 0; frame < 100; frame++) engine.update({}, {});
  assert.equal(hero.charging, true);
  assert.equal(engine.releaseChargedMeleeAttack('player'), true);

  const initialHp = opponent.currentHp;
  for (let frame = 0; frame < 40; frame++) engine.update({}, {});
  assert.ok(opponent.currentHp < initialHp, 'semantic charged attack did not damage P2');
  assert.equal(hero.meleeMetrics.chargedHits, 1, 'charged hit metric was missed or counted twice');

  opponent.currentHp = 0;
  engine.update({}, {});
  assert.equal(hero.state, 'victory', 'Player Anchor victory pose was not latched');
});

test('Smash P5 PRE_MATCH_LOCK freezes every gameplay clock without Player Anchor', () => {
  const stage = makeStage('Smash');
  stage.universe = 'Camera Cafe';
  stage.customBattle.difficulty = 'standard';
  stage.customBattle.stageVariant = 'lore';
  stage.customBattle.stageEventIntensity = 'full';
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('p5-lock-hero')],
    makeEnemyData([makeThreat('p5-lock-opponent')]),
    particles,
    noop,
    noop,
    stage
  );
  const hero = engine.getActiveHero();
  const opponent = engine.getActiveOpponent();
  engine.stageEventRuntime.nextDelayMs = 0;
  const initial = {
    heroX: hero.x,
    opponentX: opponent.x,
    heroHp: hero.currentHp,
    opponentHp: opponent.currentHp
  };

  assert.notEqual(hero.id, 'player_anchor', 'test accidentally uses Player Anchor');
  assert.equal(hero.state, 'intro', 'P5 did not author an intro state for every fighter');
  assert.equal(engine.setActiveHero(hero.id), false, 'fighter selection bypassed PRE_MATCH_LOCK');
  for (let frame = 0; frame < 179; frame++) engine.update({ right: true }, { left: true });
  assert.equal(engine.isPreMatchLocked(), true, 'PRE_MATCH_LOCK released before tick 180');
  engine.update({ right: true }, { left: true });

  assert.equal(engine.isPreMatchLocked(), false);
  assert.equal(engine.stageEventRuntime.elapsedMs, 0, 'stage event advanced during PRE_MATCH_LOCK');
  assert.equal(engine.mobilePlatformElapsedMs, 0, 'mobile platform advanced during PRE_MATCH_LOCK');
  assert.equal(engine.hazardTick, 0, 'legacy hazard advanced during PRE_MATCH_LOCK');
  assert.equal(engine.objectiveTick, 0, 'objective advanced during PRE_MATCH_LOCK');
  assert.deepEqual({
    heroX: hero.x,
    opponentX: opponent.x,
    heroHp: hero.currentHp,
    opponentHp: opponent.currentHp
  }, initial);

  engine.update({}, {});
  assert.ok(engine.stageEventRuntime.elapsedMs > 0, 'P5 event clock did not start after unlock');
  assert.ok(engine.mobilePlatformElapsedMs > 0, 'mobile platform clock did not start after unlock');
  const releaseCueMs = engine.preMatchReleaseCueMs;
  assert.equal(engine.syncPreMatchFromServer(3000), true);
  assert.equal(engine.preMatchReleaseCueMs, releaseCueMs, 'repeated terminal server packet restarted BREACH overlay');
});

test('Smash P5 damage respects telegraph, safe zone and no-auto-KO contract', () => {
  const stage = makeStage('Smash');
  stage.universe = 'Alien';
  stage.customBattle.difficulty = 'training';
  stage.customBattle.stageVariant = 'lore';
  stage.customBattle.stageEventIntensity = 'full';
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('p5-alien-target')],
    makeEnemyData([makeThreat('p5-alien-safe')]),
    particles,
    noop,
    noop,
    stage
  );
  assert.equal(engine.skipPreMatch(), true);
  engine.stageEventRuntime.nextDelayMs = 0;
  engine.updateStageFlow();
  assert.equal(engine.stageEventSnapshot.phase, 'telegraph');

  const hero = engine.getActiveHero();
  const opponent = engine.getActiveOpponent();
  const zone = engine.stageEventSnapshot.targetZone;
  hero.x = ((zone.x1 + zone.x2) / 2) * engine.width;
  opponent.x = zone.x1 > 0
    ? zone.x1 * engine.width / 2
    : ((zone.x2 + 1) / 2) * engine.width;
  hero.currentHp = 2;
  const opponentHp = opponent.currentHp;
  engine.updateStageFlow();
  assert.equal(hero.currentHp, 2, 'damage landed during the warning window');

  engine.stageEventRuntime.phaseElapsedMs = engine.stageEventRuntime.activeDefinition.telegraphMs - (1000 / 60);
  engine.updateStageFlow();
  assert.equal(engine.stageEventSnapshot.phase, 'active');
  assert.equal(hero.currentHp, 1, 'environmental event either missed or auto-KOd the target');
  assert.equal(opponent.currentHp, opponentHp, 'actor in the announced safe zone was damaged');
  assert.equal(engine.hazardHits, 1);
  assert.equal(engine.getCombatSummary().stageEventOccurrences['predalien-inner-jaw'], 1);
});

test('Smash P5 Competitive Full disables authored events and legacy hazards', () => {
  const stage = makeStage('Smash');
  stage.universe = 'Alien';
  stage.customBattle.difficulty = 'training';
  stage.customBattle.stageVariant = 'competitive';
  stage.customBattle.stageEventIntensity = 'full';
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('p5-competitive-hero')],
    makeEnemyData([makeThreat('p5-competitive-opponent')]),
    particles,
    noop,
    noop,
    stage
  );
  const hero = engine.getActiveHero();
  const opponent = engine.getActiveOpponent();
  const heroHp = hero.currentHp;
  const opponentHp = opponent.currentHp;

  assert.ok(engine.arena.hazards.length > 0, 'Alien pilot did not use a native hazard arena');
  assert.equal(engine.arena.requestedEventIntensity, 'full');
  assert.equal(engine.arena.eventIntensity, 'off');
  assert.equal(engine.hazardsDisabled, true);
  assert.equal(engine.skipPreMatch(), true);
  for (let frame = 0; frame < 300; frame++) engine.update({}, {});

  assert.equal(engine.hazardTick, 0);
  assert.equal(engine.stageEventRuntime.phase, 'disabled');
  assert.equal(engine.stageEventRuntime.elapsedMs, 0);
  assert.deepEqual(engine.stageEventRuntime.occurrences, {});
  assert.equal(hero.currentHp, heroHp);
  assert.equal(opponent.currentHp, opponentHp);
});

test('Smash P5 dynamic topologies move riders deterministically and transform safely', () => {
  const makeMobileEngine = id => {
    const stage = makeStage('Smash');
    stage.universe = 'Camera Cafe';
    stage.customBattle.difficulty = 'training';
    stage.customBattle.stageVariant = 'lore';
    stage.customBattle.stageEventIntensity = 'full';
    const engine = new smashModule.EngineSmash(
      760,
      420,
      [makeHero(`p5-mobile-${id}`)],
      makeEnemyData([makeThreat(`p5-mobile-opponent-${id}`)]),
      particles,
      noop,
      noop,
      stage
    );
    assert.equal(engine.skipPreMatch(), true);
    return engine;
  };
  const first = makeMobileEngine('a');
  const second = makeMobileEngine('b');
  const firstPlatform = first.platforms.find(entry => entry.motion?.axis === 'x');
  const secondPlatform = second.platforms.find(entry => entry.topologyPlatformId === firstPlatform.topologyPlatformId);
  const firstHero = first.getActiveHero();
  const secondHero = second.getActiveHero();
  [
    [firstHero, firstPlatform],
    [secondHero, secondPlatform]
  ].forEach(([hero, platformData]) => {
    hero.x = (platformData.x1 + platformData.x2) / 2;
    hero.y = platformData.y;
    hero.vy = 0;
  });
  const oldPlatformX = firstPlatform.x1;
  const oldHeroX = firstHero.x;
  first.updateStageFlow();
  second.updateStageFlow();
  const platformDx = firstPlatform.x1 - oldPlatformX;

  assert.notEqual(platformDx, 0, 'mobile rail did not advance');
  assert.ok(Math.abs((firstHero.x - oldHeroX) - platformDx) < 1e-9, 'platform did not carry its rider');
  assert.equal(firstPlatform.x1, secondPlatform.x1, 'identical mobile clocks diverged');
  assert.equal(firstPlatform.y, secondPlatform.y, 'identical mobile rails diverged vertically');

  const transformStage = makeStage('Smash');
  transformStage.customBattle.difficulty = 'training';
  transformStage.customBattle.stageVariant = 'lore';
  transformStage.customBattle.stageEventIntensity = 'full';
  transformStage.customBattle.stageTopologyId = 'TRANSFORMING_EVENT';
  const transform = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('p5-transform-hero')],
    makeEnemyData([makeThreat('p5-transform-opponent')]),
    particles,
    noop,
    noop,
    transformStage
  );
  assert.equal(transform.skipPreMatch(), true);
  const support = transform.platforms.find(entry => entry.kind !== 'main');
  const transformHero = transform.getActiveHero();
  transformHero.x = (support.x1 + support.x2) / 2;
  transformHero.y = support.y;
  transformHero.vy = 0;
  const hpBefore = transformHero.currentHp;
  const xBefore = transformHero.x;
  const yBefore = transformHero.y;
  const layoutBefore = JSON.stringify(transform.platforms);

  assert.equal(transform.applyTelegraphedLayout(1), true);
  assert.notEqual(JSON.stringify(transform.platforms), layoutBefore);
  assert.ok(transformHero.vy <= -2.2, 'rider was not safely released from a disappearing support');
  assert.equal(transformHero.currentHp, hpBefore);
  assert.equal(transformHero.x, xBefore, 'layout transformation teleported the fighter horizontally');
  assert.equal(transformHero.y, yBefore, 'layout transformation teleported the fighter vertically');
  assert.ok(transform.platforms.some(entry => entry.kind === 'main' && entry.passThrough === false));
});

test('Smash objective defeat preserves its result and advances the authored pose', () => {
  let completion = null;
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('player_anchor')],
    makeEnemyData([makeThreat('objective-threat')]),
    particles,
    noop,
    (result, summary) => { completion = { result, summary }; },
    makeStage('Smash', 'cpu')
  );
  const hero = engine.getActiveHero();

  for (let frame = 0; frame < 30; frame++) engine.update({}, {});
  engine.arena.objective = 'protect';
  engine.objectiveProgress = 0;
  engine.objectiveTarget = 1;
  engine.artifactHp = 0;
  engine.updateObjectiveBattleState();

  assert.equal(engine.gameOver, true);
  assert.equal(engine.meleeOutcomeResult, 'defeat');
  assert.equal(hero.state, 'defeat');
  const initialElapsed = hero.stateElapsed;
  for (let frame = 0; frame < 121; frame++) engine.update({}, {});
  assert.ok(hero.stateElapsed > initialElapsed, 'defeat animation remained frozen on its first frame');
  assert.equal(completion?.result, 'defeat');
  assert.equal(completion?.summary.result, 'defeat');
});

test('singleRoster CPU modes spawn each selected threat exactly once', () => {
  const roster = [
    makeThreat('selected-alpha', 30),
    { ...makeThreat('selected-beta', 25), isBoss: true }
  ];
  const enemyData = makeEnemyData(roster);
  const rpg = new rpgModule.EngineRpg(
    760,
    360,
    [makeHero('cpu-rpg-p1')],
    enemyData,
    particles,
    noop,
    noop,
    makeStage('RPG', 'cpu')
  );
  const tactics = new tacticsModule.EngineTactics(
    760,
    420,
    [makeHero('cpu-tactics-p1', 1)],
    enemyData,
    particles,
    noop,
    noop,
    makeStage('Tactics', 'cpu')
  );

  try {
    const smash = new smashModule.EngineSmash(
      760,
      420,
      [makeHero('cpu-smash-p1')],
      enemyData,
      particles,
      noop,
      noop,
      makeStage('Smash', 'cpu')
    );
    const expectedNames = roster.map(entry => entry.name);
    assert.deepEqual(rpg.enemies.map(entry => entry.name), expectedNames);
    assert.deepEqual(tactics.enemies.map(entry => entry.name), expectedNames);
    assert.deepEqual(smash.enemies.map(entry => entry.name), expectedNames);
    assert.equal(new Set(smash.enemies.map(entry => entry.sourceId)).size, roster.length);
  } finally {
    rpg.dispose();
    tactics.dispose();
    assert.equal(rpg.timers.size, 0);
    assert.equal(tactics.timers.size, 0);
  }
});
