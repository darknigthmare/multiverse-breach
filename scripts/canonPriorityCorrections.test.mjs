import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createServer } from 'vite';

import { getHeroById } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';
import { getEnemySpriteSheetSrc, getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { readStaticStages } from './riftDossierStaticStages.mjs';

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

test('the Gears train finale selects RAAM and only original-game Locust, without mixing the Pendulum Wars', () => {
  const stage = CANON_PRIORITY_STAGES.lightmassTrain;
  const selected = resolve(stage);
  assert.match(stage.incarnation, /Gears of War \(2006\).*train/);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Locust Drone', 'Theron Guard']);
  assert.deepEqual(selected.bosses.map(enemy => enemy.name), ['General RAAM']);
  assert.equal(selected.worldBoss, null);
  assert.equal(selected.bosses[0].weapon, 'gun');
  assert.match(selected.bosses[0].equipment.join(' '), /Troika.*Kryll/);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.bosses[0], universe: stage.universe }), '/sprites/generated/bosses/gears-of-war/general-raam.png');
});

test('Metropolis locks the Halo 2 Scarab and excludes Halo CE/Halo 3 and unrelated hostile factions', () => {
  const stage = CANON_PRIORITY_STAGES.metropolisScarab;
  const selected = resolve(stage);
  assert.match(stage.incarnation, /Halo 2 \(2004\).*Metropolis/);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Covenant Grunt', 'Jackal Sniper', 'Elite Minor']);
  assert.deepEqual(selected.bosses, []);
  assert.equal(selected.worldBoss.name, 'Covenant Scarab Mech');
  assert.equal(selected.worldBoss.canonicalName, 'Protos-pattern Scarab');
  assert.match(stage.gameplayAdaptation, /Board.*catwalk.*crew/);
  assert.match(stage.gameplayAdaptation, /hull is invulnerable/);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.worldBoss, universe: stage.universe }), '/sprites/generated/bosses/halo/covenant-scarab-mech.png');
});

test('LV-426 selects the 1986 Queen and warriors, without a Predalien or later franchise enemies', () => {
  const stage = CANON_PRIORITY_STAGES.hadleysQueen;
  const selected = resolve(stage);
  assert.equal(stage.universe, 'Alien', 'the historical save and sprite universe key remains stable');
  assert.match(stage.incarnation, /Aliens \(1986\).*LV-426/);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Warrior Xenomorph', 'Skittering Facehugger', 'Egg Chamber Sac']);
  assert.deepEqual(selected.bosses.map(enemy => enemy.name), ['Alien Queen']);
  assert.equal(selected.worldBoss, null);
  assert.equal(selected.bosses[0].special, 'Inner Jaw Lunge');
  assert.doesNotMatch(selected.bosses[0].equipment.join(' '), /spit|acid/i);
  assert.match(stage.gameplayAdaptation, /Rescue Newt.*evacuation.*living carrier/);
  assert.match(stage.gameplayAdaptation, /Queen damage is nonlethal/);
  assert.match(stage.gameplayAdaptation, /Sulaco.*separate and unimplemented/);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.bosses[0], universe: stage.universe }), '/sprites/generated/bosses/alien/alien-queen.png');
});

test('the original Half-Life finale selects Nihilanth and enslaved Vortigaunts instead of Combine or Race X', () => {
  const stage = CANON_PRIORITY_STAGES.xenNihilanth;
  const selected = resolve(stage);
  assert.match(stage.incarnation, /Half-Life \(1998\).*Nihilanth/);
  assert.deepEqual(selected.monsters.map(enemy => enemy.name), ['Vortigaunt Shock Trooper']);
  assert.deepEqual(selected.bosses.map(enemy => enemy.name), ['Alien Nihilanth Core']);
  assert.equal(selected.bosses[0].canonicalName, 'Nihilanth');
  assert.equal(selected.bosses[0].special, 'Teleportation Orb');
  assert.equal(selected.worldBoss, null);
  assert.match(stage.gameplayAdaptation, /Destroy three healing crystals.*brain/);
  assert.match(stage.gameplayAdaptation, /teleport rooms.*remain unimplemented/);
  assert.equal(getEnemySpriteSheetSrc({ ...selected.bosses[0], universe: stage.universe }), '/sprites/generated/bosses/half-life/alien-nihilanth-core.png');
});

test('the four repaired static missions preserve saved IDs, modes, rewards and the complete registry', async () => {
  const contracts = [
    [CANON_PRIORITY_STAGES.lightmassTrain, 1, 'RPG', 40, 15],
    [CANON_PRIORITY_STAGES.metropolisScarab, 2, 'Tactics', 40, 15],
    [CANON_PRIORITY_STAGES.hadleysQueen, 3, 'Smash', 45, 15],
    [CANON_PRIORITY_STAGES.xenNihilanth, 10, 'Smash', 75, 25]
  ];
  const source = await readFile(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  const stages = readStaticStages(source);
  for (const [stage, id, mode, gold, shards] of contracts) {
    assert.equal(stage.id, id);
    assert.equal(stage.mode, mode);
    assert.equal(stage.goldPrize, gold);
    assert.equal(stage.shardPrize, shards);
    assert.deepEqual(stages.find(entry => entry.id === id), stage);
    assert.equal(stage.visualReviewStatus, 'pending');
  }
  assert.equal(stages.length, 39);
});

test('the actual RPG and Tactics engines require RAAM and the boarded Scarab to be defeated', async () => {
  const vite = await createServer({
    appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }
  });
  const engines = [];
  try {
    const { EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js?canon-mission-followup');
    const { EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js?canon-mission-followup');
    const hero = getHeroById('arca_mirelle');
    const particles = { add() {} };
    const noop = () => {};
    const trainStage = CANON_PRIORITY_STAGES.lightmassTrain;
    const rpg = new EngineRpg(960, 540, [hero], resolve(trainStage), particles, noop, noop, trainStage);
    engines.push(rpg);
    rpg.enemies.forEach(enemy => { enemy.currentHp = 0; });
    rpg.update();
    assert.equal(rpg.wave, 2);
    assert.deepEqual(rpg.enemies.map(enemy => enemy.name), ['General RAAM']);
    assert.equal(rpg.gameOver, false, 'clearing Locust cannot skip RAAM');
    rpg.update();
    assert.equal(rpg.gameOver, false, 'a living RAAM prevents victory');
    rpg.enemies[0].currentHp = 0;
    rpg.update();
    assert.equal(rpg.gameOver, true);

    const scarabStage = CANON_PRIORITY_STAGES.metropolisScarab;
    const tactics = new EngineTactics(960, 540, [hero], resolve(scarabStage), particles, noop, noop, scarabStage);
    engines.push(tactics);
    assert.equal(tactics.battlefield.id, 'metropolis_scarab_deck');
    assert.equal(tactics.objective, 'scarab_boarding');
    assert.equal(tactics.objectiveTarget, 3);
    assert.deepEqual(tactics.enemies.filter(enemy => enemy.isBoss).map(enemy => enemy.name), ['Covenant Scarab Mech']);
    tactics.enemies.filter(enemy => !enemy.isBoss).forEach(enemy => { enemy.currentHp = 0; });
    tactics.turnsElapsed = 100;
    tactics.updateTacticsObjective(true);
    assert.equal(tactics.gameOver, false, 'crew defeat and waiting cannot bypass boarding');
    const hull = tactics.scarabEncounter.hull;
    tactics.applyDamage(tactics.heroes[0], hull, 999999);
    assert.equal(hull.currentHp, hull.maxHp, 'the Halo 2 hull is invulnerable');
    // The dedicated mechanics suite covers traversal by normal cell input.
    Object.assign(tactics.heroes[0], {
      gridX: tactics.scarabEncounter.boardingCell.x,
      gridY: tactics.scarabEncounter.boardingCell.y
    });
    tactics.updateTacticsObjective(true);
    assert.equal(tactics.gameOver, true);
    assert.equal(tactics.battleResult, 'victory');
  } finally {
    for (const engine of engines) engine.dispose?.();
    await vite.close();
  }
});

test('the actual Smash wave flow requires Newt evacuation in the hive and the exposed brain in Xen', async () => {
  const vite = await createServer({
    appType: 'custom', logLevel: 'silent', server: { middlewareMode: true }
  });
  const engines = [];
  try {
    const { EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?canon-mission-followup');
    const hero = getHeroById('arca_mirelle');
    const particles = { add() {} };
    const noop = () => {};
    for (const stage of [CANON_PRIORITY_STAGES.hadleysQueen, CANON_PRIORITY_STAGES.xenNihilanth]) {
      const engine = new EngineSmash(960, 540, [hero], resolve(stage), particles, noop, noop, stage);
      engines.push(engine);
      engine.syncPreMatchFromServer(3000);
      engine.completeMeleeIntros();
      Object.assign(engine.heroes[0], { maxHp: 50000, currentHp: 50000 });
      assert.equal(engine.arena.id, stage.smashArenaId);
      assert.equal(engine.arena.objective, stage.id === 3 ? 'rescue_escape' : 'boss');
      while (engine.wave < engine.maxWaves) {
        engine.enemies.forEach(enemy => { enemy.currentHp = 0; enemy.stateTimer = 0; enemy.state = 'dead'; });
        engine.update();
        assert.equal(engine.gameOver, false, `regular waves cannot win stage ${stage.id}`);
      }
      assert.deepEqual(engine.enemies.map(enemy => enemy.name), [stage.bossName]);
      assert.equal(engine.enemies[0].isBoss, true);
      assert.equal(engine.arena.theme.material, stage.id === 3 ? 'hive' : 'arcane');
      engine.objectiveTick = 100000;
      engine.updateArenaObjective();
      engine.updateObjectiveBattleState();
      assert.equal(engine.gameOver, false, `time cannot win stage ${stage.id} while its boss lives`);
      if (stage.id === 10) {
        const encounter = engine.nihilanthEncounter;
        for (const crystal of encounter.crystals) engine.applyEncounterDamage(crystal, 10000);
        engine.applyDamage(engine.heroes[0], encounter.boss, 100000, 0);
        assert.equal(encounter.boss.currentHp, 1, 'body hits cannot deliver the lethal blow');
        for (let tick = 0; tick < 240; tick++) engine.update();
        assert.equal(encounter.headOpen, true);
        engine.applyDamage(engine.heroes[0], encounter.brain, 100000, 0);
        assert.equal(encounter.weakpointHits, 1);
        for (let tick = 0; tick < 61; tick++) engine.update();
      } else {
        const encounter = engine.aliensRescueEncounter;
        assert.equal(engine.applyEncounterDamage(encounter.queen, 100000, { directDamage: true }), true);
        assert.equal(encounter.queen.currentHp, 1, 'hive damage cannot kill the Queen');
        engine.update();
        assert.equal(engine.gameOver, false, 'repelling the Queen does not rescue Newt');
        assert.equal(engine.objectiveProgress, 0);
        // Dedicated rescue tests cover traversal through normal movement input.
        Object.assign(engine.heroes[0], { x: encounter.rescuePoint.x, y: encounter.rescuePoint.y, state: 'idle' });
        assert.equal(engine.triggerAliensRescueAction('rescue-newt', engine.heroes[0]), true);
        assert.equal(engine.objectiveProgress, 1);
        assert.equal(engine.gameOver, false, 'freeing Newt still requires evacuation');
        Object.assign(engine.heroes[0], { x: encounter.exitPoint.x, y: encounter.exitPoint.y, state: 'idle' });
        assert.equal(engine.triggerAliensRescueAction('evacuate', engine.heroes[0]), true);
        assert.equal(encounter.queen.currentHp, 1, 'the source mission ends with the Queen alive');
      }
      engine.update();
      assert.equal(engine.gameOver, true);
      assert.equal(engine.meleeOutcomeResult, 'victory');
    }
  } finally {
    engines.forEach(engine => engine.dispose?.());
    await vite.close();
  }
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
