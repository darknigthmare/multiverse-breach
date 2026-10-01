import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createServer } from 'vite';

import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { getEnemySpriteSheetSrc, getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';

const heroKit = hero => JSON.stringify([
  hero.equipment, hero.simple, hero.secondary, hero.defense, hero.special
]);

test('Ripley 1979 and Ripley 1986 keep separate source equipment and saved hero IDs', () => {
  const nostromo = getHeroById('ripley');
  const sulaco = getHeroById('ripley_aliens');
  assert.equal(nostromo.universe, 'Alien');
  assert.equal(sulaco.universe, 'Aliens');
  assert.match(nostromo.incarnation, /1979.*Nostromo/);
  assert.match(sulaco.incarnation, /1986.*Sulaco/);
  assert.doesNotMatch(heroKit(nostromo), /pulse|M41A|M240|loader|M94/i);
  assert.match(heroKit(nostromo), /Flamethrower/);
  assert.match(nostromo.special.name, /Narcissus Harpoon/);
  assert.equal(nostromo.defense.type, 'dodge');
  assert.match(heroKit(sulaco), /M41A/);
  assert.match(heroKit(sulaco), /M240/);
  assert.match(sulaco.special.name, /Power Loader/);
  assert.equal(getHeroSpriteSheetSrc(nostromo), '/sprites/generated/heroes/alien/ripley.png');
  assert.equal(getHeroSpriteSheetSrc(sulaco), '/sprites/generated/heroes/aliens/ripley-aliens.png');
});

test('the 1987 Jungle Hunter excludes later Predator weapons while preserving predator identity', () => {
  const hunter = getHeroById('predator');
  assert.equal(hunter.name, 'Jungle Hunter');
  assert.match(hunter.incarnation, /1987/);
  assert.doesNotMatch(heroKit(hunter), /disc|combi.?stick/i);
  assert.match(hunter.simple.name, /Wristblade/);
  assert.equal(hunter.secondary.type, 'plasma');
  assert.equal(getHeroSpriteSheetSrc(hunter), '/sprites/generated/heroes/predator/predator.png');
});

test('the final Freeman runtime override stays in Half-Life 2 instead of restoring the gluon gun', () => {
  const freeman = getHeroById('freeman');
  assert.match(freeman.incarnation, /Half-Life 2.*Mark V/);
  assert.doesNotMatch(heroKit(freeman), /gluon|long.?jump|Mark IV/i);
  assert.equal(freeman.special.name, 'Overcharged Gravity Gun');
  assert.match(freeman.secondary.name, /Gravity Gun/);
  assert.equal(getHeroSpriteSheetSrc(freeman), '/sprites/generated/heroes/half-life/freeman.png');
});

const resolve = stage => resolveStageEnemyData({
  stage,
  ...ENEMIES_DB[stage.universe]
});

test('Shadow Moses selects the existing REX boss and Genome Soldiers and suppresses MGS2/MGS4 threats', () => {
  const stage = CANON_PRIORITY_STAGES.shadowMoses;
  const selected = resolve(stage);
  assert.equal(stage.id, 12);
  assert.match(stage.incarnation, /Metal Gear Solid \(1998\)/);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Genome Soldier Patrol']);
  assert.deepEqual(selected.bosses.map(enemy => enemy.name), ['Metal Gear REX Shadow']);
  assert.equal(selected.bosses[0].canonicalName, 'Metal Gear REX');
  assert.equal(selected.bosses[0].hp, 720);
  assert.equal(selected.worldBoss, null);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.bosses[0], universe: stage.universe }), '/sprites/generated/bosses/metal-gear/metal-gear-rex-shadow.png');
});

test('the New Vegas finale uses Lanius at the Legate camp without spawning Liberty Prime', () => {
  const stage = CANON_PRIORITY_STAGES.legatesCamp;
  const selected = resolve(stage);
  assert.equal(stage.id, 22);
  assert.match(stage.name, /Hoover Dam.*Legate Camp/);
  assert.deepEqual(selected.bosses.map(enemy => enemy.name), ['Legate Lanius General']);
  assert.equal(selected.bosses[0].canonicalName, 'Legate Lanius');
  assert.equal(selected.bosses[0].weapon, 'greatsword');
  assert.equal(selected.worldBoss, null);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Nexus Residue']);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.bosses[0], universe: stage.universe }), '/sprites/generated/bosses/fallout/legate-lanius-general.png');
});

test('actual battle engines spawn REX and Lanius and require REX defeat for the Hangar victory', async () => {
  const vite = await createServer({
    appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }
  });
  const engines = [];
  try {
    const { EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?canon-priority-tests');
    const { EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?canon-priority-tests');
    const hero = getHeroById('arca_mirelle');
    const particles = { add() {} };
    const noop = () => {};
    const stage = CANON_PRIORITY_STAGES.shadowMoses;
    const tactics = new EngineTactics(960, 540, [hero], resolve(stage), particles, noop, noop, stage);
    engines.push(tactics);
    assert.equal(tactics.objective, 'commander');
    assert.equal(tactics.objectiveTarget, 1);
    assert.deepEqual(tactics.enemies.filter(enemy => enemy.isBoss).map(enemy => enemy.name), ['Metal Gear REX Shadow']);
    for (const enemy of tactics.enemies.filter(enemy => !enemy.isBoss)) enemy.currentHp = 0;
    tactics.updateTacticsObjective(true);
    assert.equal(tactics.gameOver, false, 'clearing soldiers cannot win while REX survives');
    tactics.turnsElapsed = 100;
    tactics.updateTacticsObjective(true);
    assert.equal(tactics.gameOver, false, 'waiting or controlling the hangar cannot bypass REX');
    tactics.enemies.find(enemy => enemy.isBoss).currentHp = 0;
    tactics.updateTacticsObjective(true);
    assert.equal(tactics.gameOver, true);
    assert.equal(tactics.objectiveProgress, 1);

    const falloutStage = CANON_PRIORITY_STAGES.legatesCamp;
    const smash = new EngineSmash(960, 540, [hero], resolve(falloutStage), particles, noop, noop, falloutStage);
    engines.push(smash);
    assert.equal(smash.arena.objective, 'boss');
    smash.wave = smash.maxWaves;
    smash.spawnEnemy();
    assert.deepEqual(smash.enemies.filter(enemy => enemy.isBoss).map(enemy => enemy.name), ['Legate Lanius General']);
  } finally {
    for (const engine of engines) engine.dispose?.();
    await vite.close();
  }
});

test('the Hub uses the tested shared stages and corrected data does not certify existing art', async () => {
  const source = await readFile(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /import \{ CANON_PRIORITY_STAGES \} from '\.\.\/game\/canonPriorityStages\.js'/);
  assert.match(source, /CANON_PRIORITY_STAGES\.shadowMoses,/);
  assert.match(source, /CANON_PRIORITY_STAGES\.legatesCamp,/);
  const entries = [
    ...['ripley', 'ripley_aliens', 'predator', 'freeman'].map(getHeroById),
    ...Object.values(CANON_PRIORITY_STAGES)
  ];
  for (const entry of entries) {
    assert.equal(entry.visualReviewStatus, 'pending', entry.id);
    assert.match(entry.referenceUrl, /^https:\/\//, entry.id);
    assert.ok(entry.visualAnchor, entry.id);
  }
});
