import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { getEnemySpriteSheetSrc } from '../src/game/spriteAssets.js';

let vite;
let EngineTactics;
let ENEMIES_DB;
let enemyDataModule;
let resolveStageEnemyData;
const engines = [];
before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null }
  });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  enemyDataModule = await vite.ssrLoadModule('/src/game/enemies.js');
  ({ ENEMIES_DB } = enemyDataModule);
  ({ resolveStageEnemyData } = await vite.ssrLoadModule('/src/game/stageEnemyResolver.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });

test('a mixed-universe actor retains the original body after its runtime universe and label change', () => {
  const enemy = { ...ENEMIES_DB.Portal.monsters[0], universe: 'Portal' };
  const source = getEnemySpriteSheetSrc(enemy);
  const runtime = {
    ...preserveEnemySpriteIdentity(enemy),
    universe: 'Halo',
    name: `${enemy.name} Echo 7`
  };
  assert.equal(runtime.universe, 'Halo');
  assert.equal(runtime.sourceUniverse, 'Portal');
  assert.equal(getEnemySpriteSheetSrc(runtime), source);
  assert.notEqual(source, getEnemySpriteSheetSrc({ ...enemy, universe: 'Halo' }));
});

test('an arc boss label preserves the original world-boss art and gameplay fields', () => {
  const boss = { ...ENEMIES_DB.Halo.worldBoss, universe: 'Halo' };
  const expected = getEnemySpriteSheetSrc(boss);
  const before = structuredClone(boss);
  const runtime = { ...preserveEnemySpriteIdentity(boss), name: 'Scarab a Chevrons' };
  assert.equal(getEnemySpriteSheetSrc(runtime), expected);
  assert.equal(runtime.name, 'Scarab a Chevrons');
  for (const key of ['id', 'hp', 'atk', 'def', 'spd', 'weapon', 'special']) assert.deepEqual(runtime[key], boss[key], key);
  assert.deepEqual(boss, before);
});

test('explicit source sheets and source universes survive further translations without new aliases', () => {
  const enemy = { name: 'Original Actor', universe: 'Runtime Universe', sourceUniverse: 'Original Universe', spriteSource: '/sprites/generated/heroes/nexus-de-convergence/arca-marrow-complete/arca-marrow-universal-v1.png', spriteFilter: 'grayscale(1)', hp: 112 };
  const once = preserveEnemySpriteIdentity(enemy, 'Fallback Universe');
  const twice = preserveEnemySpriteIdentity({ ...once, universe: 'Another Universe', name: 'Original Actor Echo 999' });
  assert.equal(twice.sourceUniverse, 'Original Universe');
  assert.equal(twice.spriteSource, enemy.spriteSource);
  assert.equal(twice.spriteFilter, enemy.spriteFilter);
  assert.equal(twice.hp, enemy.hp);
  assert.deepEqual(preserveEnemySpriteIdentity(once), once);
});

test('templates without a universe use the stage context rather than creating an unknown path', () => {
  const enemy = { name: 'Elite Sangheili', hp: 125 };
  const before = structuredClone(enemy);
  const bound = preserveEnemySpriteIdentity(enemy, 'Halo');
  assert.equal(bound.sourceUniverse, 'Halo');
  assert.equal(bound.spriteSource, '/sprites/generated/bosses/halo/elite-sangheili.png');
  assert.deepEqual(enemy, before);
  for (const absent of [null, undefined, {}]) assert.equal(preserveEnemySpriteIdentity(absent), absent);
});

// Exercise the actual data projection inside the component without mounting
// React or triggering game state, timers, audio, network or save operations.
const getActualCanvasEnemyData = stage => {
  const source = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
  const start = source.indexOf('  const getEnemiesData = () => {');
  const end = source.indexOf('  const flattenEnemiesData =', start);
  assert.ok(start >= 0 && end > start, 'GameCanvas enemy-data projection boundaries');
  const dependencies = {
    stage,
    battleConfig: null,
    disabledEnemySet: new Set(),
    getEnemyAdminKey: (universe, enemy) => `${universe}::${enemy?.name || 'unknown'}`,
    ...Object.fromEntries(['getMonstersForUniverse', 'getBossesForUniverse', 'getWorldBossForUniverse', 'getFinalePolicyForUniverse', 'getFinalGameBoss'].map(key => [key, enemyDataModule[key]])),
    resolveStageEnemyData,
    preserveEnemySpriteIdentity
  };
  return new Function(...Object.keys(dependencies), `${source.slice(start, end)}\nreturn getEnemiesData();`)(...Object.values(dependencies));
};

test('actual GameCanvas fusion preserves Portal art while retaining primary-universe scaling and labels', () => {
  const stage = { universe: 'The Matrix', sourceUniverses: ['The Matrix', 'Portal'], bossName: 'Chamber 404 Gate', modifier: { enemyAtk: 1.4, enemySpd: 0.6, bossHp: 1.7 } };
  const result = getActualCanvasEnemyData(stage);
  const source = ENEMIES_DB.Portal.monsters[0];
  const runtime = result.monsters.find(enemy => enemy.name === source.name);
  assert.ok(runtime);
  assert.equal(runtime.universe, 'The Matrix');
  assert.equal(runtime.sourceUniverse, 'Portal');
  assert.equal(runtime.spriteSource, getEnemySpriteSheetSrc({ ...source, universe: 'Portal' }));
  assert.equal(runtime.atk, Math.round(source.atk * stage.modifier.enemyAtk));
  assert.equal(runtime.spd, Math.round(source.spd * stage.modifier.enemySpd));
  assert.equal(runtime.hp, source.hp);
  const boss = ENEMIES_DB['The Matrix'].worldBoss;
  assert.equal(result.worldBoss.name, stage.bossName);
  assert.equal(result.worldBoss.spriteSource, getEnemySpriteSheetSrc({ ...boss, universe: stage.universe }));
  assert.equal(result.worldBoss.hp, Math.round(Math.round((boss.hp || 1000) * 1.18) * stage.modifier.bossHp));
  assert.equal(result.worldBoss.atk, Math.round(Math.round((boss.atk || 20) * 1.12) * stage.modifier.enemyAtk));
});

test('actual GameCanvas ordinary stage and final Matrix mission retain their exact catalog sheets', () => {
  for (const stage of [{ universe: 'Portal' }, { universe: 'Ignored Title', finalGameBoss: true }]) {
    const result = getActualCanvasEnemyData(stage);
    const sourceUniverse = stage.finalGameBoss ? 'Matrix' : stage.universe;
    for (const enemy of [...result.monsters, ...result.bosses, ...(result.worldBoss ? [result.worldBoss] : [])]) {
      assert.equal(enemy.sourceUniverse, sourceUniverse);
      assert.equal(enemy.spriteSource, getEnemySpriteSheetSrc({ ...enemy, spriteSource: undefined, universe: sourceUniverse }));
      assert.equal(enemy.universe, sourceUniverse);
    }
  }
});

const makeEngine = template => {
  const hero = { id: 'sprite-identity-test', name: 'Sprite Test', universe: 'Halo', category: 'test', stats: { hp: 180, atk: 18, def: 9, spd: 15 }, simple: { name: 'Strike', dmg: 1 }, secondary: { name: 'Shot', dmg: 1.3, cd: 3 }, defense: { name: 'Guard', reduce: 0.4, dur: 1 }, special: { name: 'Burst', dmg: 1.8 } };
  const engine = new EngineTactics(960, 540, [hero], { monsters: [template], bosses: [], customRoster: [template] }, { add() {} }, () => {}, () => {}, { universe: 'Halo', difficulty: 'Hard', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(engine);
  // Provide real open cells, then let the engine create and place the actors.
  engine.battlefield = { ...engine.battlefield, monsterSpawns: [{ x: 6, y: 0 }, { x: 6, y: 4 }] };
  engine.tiles = [];
  engine.obstacles = [];
  engine.enemies.forEach(enemy => { enemy.currentHp = 0; });
  return engine;
};

test('actual Tactics reinforcement spawning reuses a cross-universe source through multiple Echo labels', () => {
  const source = { ...ENEMIES_DB.Portal.monsters[0], universe: 'Portal', id: 'original-id' };
  const runtimeTemplate = { ...source, universe: 'Halo', sourceUniverse: 'Portal' };
  const before = structuredClone(runtimeTemplate);
  const engine = makeEngine(runtimeTemplate);
  engine.spawnTacticsReinforcement();
  engine.spawnTacticsReinforcement();
  assert.equal(engine.reinforcementsCalled, 2);
  const echoes = engine.enemies.filter(enemy => enemy.reinforcement);
  assert.equal(echoes.length, 2);
  for (const [index, echo] of echoes.entries()) {
    assert.equal(echo.name, `${source.name} Echo ${index + 1}`);
    assert.equal(echo.id, 'original-id');
    assert.equal(echo.universe, 'Halo');
    assert.equal(echo.sourceUniverse, 'Portal');
    assert.equal(getEnemySpriteSheetSrc(echo), getEnemySpriteSheetSrc(source));
    assert.equal(echo.maxHp, Math.round((source.hp || 90) * (0.68 + engine.missionProfile.pressure * 0.08)));
    assert.equal(echo.currentHp, echo.maxHp);
    assert.equal(echo.atk, source.atk);
    assert.equal(echo.reinforcement, true);
    assert.ok(engine.turnQueue.some(turn => turn.unit === echo));
  }
  assert.deepEqual(runtimeTemplate, before);
});

test('actual Tactics reinforcement retains an explicit sprite source and its visual filter', () => {
  const template = { name: 'Clone Sentinel', universe: 'Halo', hp: 120, atk: 15, def: 5, spd: 2, spriteSource: '/sprites/generated/heroes/nexus-de-convergence/arca-marrow-complete/arca-marrow-universal-v1.png', spriteFilter: 'grayscale(1)' };
  const engine = makeEngine(template);
  engine.spawnTacticsReinforcement();
  const echo = engine.enemies.find(enemy => enemy.reinforcement);
  assert.ok(echo);
  assert.equal(echo.spriteSource, template.spriteSource);
  assert.equal(echo.spriteFilter, template.spriteFilter);
  assert.equal(echo.sourceUniverse, 'Halo');
  assert.equal(echo.name, 'Clone Sentinel Echo 1');
});
