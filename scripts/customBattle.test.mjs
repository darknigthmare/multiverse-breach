import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
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

test('custom battle preset keeps unique bounded teams and valid rules', () => {
  const normalized = customBattle.normalizeCustomBattlePreset({
    mode: 'Tactics',
    opponentControl: 'p2',
    playerTeamIds: ['a', 'a', 'b', 'c', 'd'],
    opponentTeamIds: ['e', 'e'],
    enemyIds: ['x', 'x', 'y'],
    difficulty: 'impossible',
    items: false,
    hazards: false
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
  const engine = new smashModule.EngineSmash(
    760,
    420,
    [makeHero('smash-p1')],
    makeEnemyData([makeThreat('smash-p2')]),
    particles,
    noop,
    noop,
    makeStage('Smash')
  );
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
