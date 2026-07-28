import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const OC_IMAGE_V2_PATTERN = /^\/images\/oc-worlds\/v2\/[a-z0-9_-]+\/.+\.png$/;
const OC_BOOSTER_V2_PATTERN = /^\/boosters\/original-worlds\/v2\/[a-z0-9_-]+\.png$/;

let vite;
let originalUniverseModule;
let expandedUniverseModule;
let battleItemModule;
let universeUnlockableModule;
let narrativeModule;
let portalBoosterModule;
let dlcModule;
let heroModule;
let enemyModule;

const assertText = (value, label) => {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
};

const assertRecord = (value, label) => {
  assert.ok(
    value && typeof value === 'object' && !Array.isArray(value),
    `${label} must be an object`
  );
};

const assertFiniteStat = (value, label) => {
  assert.equal(typeof value, 'number', `${label} must be numeric`);
  assert.ok(Number.isFinite(value) && value > 0, `${label} must be positive`);
};

const assertUnique = (values, label) => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const sorted = values => [...values].sort((left, right) => (
  String(left).localeCompare(String(right))
));

const manifestFieldsArePreserved = (projected, manifestEntry, label) => {
  Object.entries(manifestEntry).forEach(([key, expected]) => {
    assert.deepEqual(projected[key], expected, `${label}.${key} differs from the manifest`);
  });
};

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });

  [
    originalUniverseModule,
    expandedUniverseModule,
    battleItemModule,
    universeUnlockableModule,
    narrativeModule,
    portalBoosterModule,
    dlcModule,
    heroModule,
    enemyModule
  ] = await Promise.all([
    vite.ssrLoadModule('/src/game/originalUniverseWave.js'),
    vite.ssrLoadModule('/src/game/expandedUniverses.js'),
    vite.ssrLoadModule('/src/game/battleItems.js'),
    vite.ssrLoadModule('/src/game/universeUnlockables.js'),
    vite.ssrLoadModule('/src/game/narrativeSystems.js'),
    vite.ssrLoadModule('/src/game/portalBoosterCatalog.js'),
    vite.ssrLoadModule('/src/game/dlcConfig.js'),
    vite.ssrLoadModule('/src/game/heroes.js'),
    vite.ssrLoadModule('/src/game/enemies.js')
  ]);
});

after(async () => {
  await vite?.close();
});

test('expanded universe registry exposes all 20 worlds and their 60 runtime stages', () => {
  const universeNames = originalUniverseModule.ORIGINAL_CAMPAIGN_UNIVERSES;
  const registeredWorlds = expandedUniverseModule.EXPANDED_UNIVERSES.filter(world => (
    universeNames.includes(world.universe)
  ));
  const registeredStages = expandedUniverseModule.getExpandedStages().filter(stage => (
    universeNames.includes(stage.universe)
  ));

  assert.equal(registeredWorlds.length, 20);
  assert.equal(registeredStages.length, 60);
  assertUnique(registeredWorlds.map(world => world.universe), 'registered original worlds');
  assertUnique(registeredStages.map(stage => stage.id), 'registered original runtime stage IDs');
  assertUnique(
    registeredStages.map(stage => stage.contentStageId),
    'registered original contentStageIds'
  );

  originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const world = registeredWorlds.find(candidate => candidate.universe === definition.universe);
    const stages = registeredStages.filter(stage => stage.universe === definition.universe);
    const expectedRuntimeIds = definition.stages.map(stage => stage.runtimeStageId);
    const expectedContentIds = definition.stages.map(stage => stage.id);

    assert.ok(world, `${definition.universe} is missing from EXPANDED_UNIVERSES`);
    assert.equal(world.sourceType, 'original');
    assert.equal(world.isOriginal, true);
    assert.equal(world.originalContent, true);
    assert.equal(world.campaignDependency, 'originalCampaign');
    assert.equal(stages.length, 3, `${definition.universe} must register three stages`);
    assert.deepEqual(stages.map(stage => stage.id), expectedRuntimeIds);
    assert.deepEqual(stages.map(stage => stage.contentStageId), expectedContentIds);

    stages.forEach((stage, stageIndex) => {
      const manifestStage = definition.stages[stageIndex];
      assert.equal(stage.campaignDependency, 'originalCampaign');
      assert.equal(stage.originalContent, true);
      assert.equal(stage.contentOrigin, 'oc');
      assert.equal(stage.dlcStage, undefined);
      assert.equal(stage.ocDlc, undefined);
      assert.equal(stage.numberedAct, false);
      assert.equal(
        stage.previousStageId,
        stageIndex === 0 ? null : expectedRuntimeIds[stageIndex - 1]
      );
      assert.equal(stage.stageArt, manifestStage.stageArt);
      assert.match(stage.stageArt, OC_IMAGE_V2_PATTERN);
    });
  });
});

test('heroes runtime registry contains the 60 rich original heroes', () => {
  const universeNames = originalUniverseModule.ORIGINAL_CAMPAIGN_UNIVERSES;
  const manifestHeroes = originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => (
    world.heroes
  ));
  const runtimeHeroes = heroModule.HEROES_DB.filter(hero => (
    universeNames.includes(hero.universe)
  ));

  assert.equal(runtimeHeroes.length, 60);
  assert.deepEqual(sorted(runtimeHeroes.map(hero => hero.id)), sorted(manifestHeroes.map(hero => hero.id)));
  assertUnique(runtimeHeroes.map(hero => hero.id), 'runtime original hero IDs');

  runtimeHeroes.forEach(hero => {
    const manifestHero = manifestHeroes.find(candidate => candidate.id === hero.id);
    const label = `HEROES_DB.${hero.id}`;

    assert.ok(manifestHero, `${label} does not resolve to a manifest hero`);
    assert.strictEqual(heroModule.getHeroById(hero.id), hero);
    assertText(hero.name, `${label}.name`);
    assertRecord(hero.stats, `${label}.stats`);
    ['hp', 'atk', 'def', 'spd'].forEach(stat => assertFiniteStat(hero.stats[stat], `${label}.stats.${stat}`));
    ['simple', 'secondary', 'defense', 'special'].forEach(move => {
      assertRecord(hero[move], `${label}.${move}`);
      assertText(hero[move].name, `${label}.${move}.name`);
    });
    assertRecord(hero.production, `${label}.production`);
    assertRecord(hero.production.modeKits, `${label}.production.modeKits`);
    assert.ok(Object.keys(hero.production.modeKits).length >= 3);
    assert.ok(Object.keys(hero.production.animations).length >= 5);
    assert.ok(Object.keys(hero.production.hitboxes).length >= 4);
    assert.equal(hero.portrait, manifestHero.portrait);
    assert.equal(hero.production.audiovisual.portrait, manifestHero.portrait);
    assert.match(hero.portrait, OC_IMAGE_V2_PATTERN);
  });
});

test('enemy runtime registry contains 100 enemies, 60 bosses and 20 rich world bosses', () => {
  let enemyCount = 0;
  let bossCount = 0;
  let worldBossCount = 0;

  originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const projected = expandedUniverseModule.EXPANDED_ENEMIES_DB[definition.universe];
    const runtime = enemyModule.ENEMIES_DB[definition.universe];
    const label = `ENEMIES_DB.${definition.universe}`;

    assert.ok(projected, `${definition.universe} is missing from EXPANDED_ENEMIES_DB`);
    assert.strictEqual(runtime, projected, `${definition.universe} did not reach ENEMIES_DB`);
    assert.strictEqual(enemyModule.getMonstersForUniverse(definition.universe), runtime.monsters);
    assert.strictEqual(enemyModule.getBossesForUniverse(definition.universe), runtime.bosses);
    assert.strictEqual(enemyModule.getWorldBossForUniverse(definition.universe), runtime.worldBoss);
    assert.equal(runtime.monsters.length, 5, `${label}.monsters has an invalid volume`);
    assert.equal(runtime.bosses.length, 3, `${label}.bosses has an invalid volume`);
    assert.ok(runtime.worldBoss, `${label}.worldBoss is missing`);

    assert.deepEqual(
      runtime.monsters.map(enemy => enemy.id),
      definition.enemies.map(enemy => enemy.id)
    );
    assert.deepEqual(
      runtime.bosses.map(boss => boss.id),
      definition.bosses.map(boss => boss.id)
    );
    assert.equal(runtime.worldBoss.id, definition.worldBoss.id);

    runtime.monsters.forEach((enemy, enemyIndex) => {
      assertText(enemy.name, `${label}.monster.name`);
      ['hp', 'atk', 'spd'].forEach(stat => assertFiniteStat(enemy[stat], `${label}.${enemy.id}.${stat}`));
      assertRecord(enemy.production?.stateMachine, `${label}.${enemy.id}.production.stateMachine`);
      assert.ok(Object.keys(enemy.production.stateMachine.states).length >= 5);
      assert.equal(enemy.portrait, definition.enemies[enemyIndex].portrait);
      assert.match(enemy.portrait, OC_IMAGE_V2_PATTERN);
    });
    runtime.bosses.forEach((boss, bossIndex) => {
      assertText(boss.name, `${label}.boss.name`);
      ['hp', 'atk', 'spd'].forEach(stat => assertFiniteStat(boss[stat], `${label}.${boss.id}.${stat}`));
      assert.ok(boss.production?.phases.length >= 3, `${label}.${boss.id} has no rich phase script`);
      assert.equal(boss.portrait, definition.bosses[bossIndex].portrait);
      assert.match(boss.portrait, OC_IMAGE_V2_PATTERN);
    });
    ['hp', 'atk', 'spd'].forEach(stat => {
      assertFiniteStat(runtime.worldBoss[stat], `${label}.${runtime.worldBoss.id}.${stat}`);
    });
    assert.ok(
      runtime.worldBoss.production?.phases.length >= 4,
      `${label}.${runtime.worldBoss.id} has no world-boss phase script`
    );
    assert.equal(runtime.worldBoss.portrait, definition.worldBoss.portrait);
    assert.match(runtime.worldBoss.portrait, OC_IMAGE_V2_PATTERN);

    enemyCount += runtime.monsters.length;
    bossCount += runtime.bosses.length;
    worldBossCount += 1;
  });

  assert.deepEqual(
    { enemies: enemyCount, bosses: bossCount, worldBosses: worldBossCount },
    { enemies: 100, bosses: 60, worldBosses: 20 }
  );
});

test('battle-item projection preserves the five manifest items for every world', () => {
  originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const projectedItems = battleItemModule.BATTLE_ITEMS_BY_UNIVERSE[definition.universe];
    const getterItems = battleItemModule.getBattleItemsForUniverse(definition.universe);

    assert.strictEqual(getterItems, projectedItems);
    assert.equal(projectedItems.length, 5, `${definition.universe} must expose five battle items`);
    assert.deepEqual(
      projectedItems.map(item => item.id),
      definition.battleItems.map(item => item.id)
    );

    projectedItems.forEach((item, itemIndex) => {
      const label = `${definition.universe}.battleItems[${itemIndex}]`;
      manifestFieldsArePreserved(item, definition.battleItems[itemIndex], label);
      assert.equal(item.icon, definition.audiovisual.itemIcons[item.id]);
      assert.match(item.icon, OC_IMAGE_V2_PATTERN);
      assert.equal(item.sourceType, 'original');
      assert.equal(item.originalContent, true);
      assert.equal(item.contentOrigin, 'oc');
    });
  });
});

test('all 11 unlockables per world resolve through the functional runtime catalogues', () => {
  originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const manifestUnlockables = definition.universeUnlockables;
    const runtimeUnlockables = universeUnlockableModule.getUniverseUnlockables(definition.universe);
    const kinds = Object.keys(manifestUnlockables);

    assert.ok(runtimeUnlockables, `${definition.universe} has no runtime unlockables`);
    assert.equal(kinds.length, 11);
    assert.deepEqual(Object.keys(runtimeUnlockables), kinds);

    kinds.forEach(kind => {
      const runtime = runtimeUnlockables[kind];
      const manifest = manifestUnlockables[kind];
      const label = `${definition.universe}.unlockables.${kind}`;

      assert.equal(runtime.id, manifest.id);
      assert.equal(runtime.kind, kind);
      assert.equal(runtime.universe, definition.universe);
      assertText(runtime.name?.fr, `${label}.name.fr`);
      assertText(runtime.name?.en, `${label}.name.en`);
      assertText(runtime.desc?.fr, `${label}.desc.fr`);
      assertText(runtime.desc?.en, `${label}.desc.en`);
      assert.strictEqual(
        universeUnlockableModule.getUnlockableById(kind, runtime.id),
        runtime,
        `${label} is not resolvable by ID`
      );
    });

    assertRecord(runtimeUnlockables.fieldSuper.effect, `${definition.universe}.fieldSuper.effect`);
    assertRecord(runtimeUnlockables.npcAssist.effect, `${definition.universe}.npcAssist.effect`);
    assertRecord(runtimeUnlockables.battleMusic.musicStage, `${definition.universe}.battleMusic.musicStage`);
    assertRecord(runtimeUnlockables.stageMusic.musicStage, `${definition.universe}.stageMusic.musicStage`);
    assertText(runtimeUnlockables.battleMusic.state, `${definition.universe}.battleMusic.state`);
    assertText(runtimeUnlockables.stageMusic.state, `${definition.universe}.stageMusic.state`);
  });
});

test('20 narrative arcs resolve their three content and runtime stage IDs', () => {
  const universeNames = originalUniverseModule.ORIGINAL_CAMPAIGN_UNIVERSES;
  const runtimeStages = expandedUniverseModule.getExpandedStages();
  const originalArcs = narrativeModule.UNIVERSE_NARRATIVE_ARCS.filter(arc => (
    arc.sourceType === 'original' && arc.originalContent === true
  ));

  assert.equal(originalArcs.length, 20);
  assertUnique(originalArcs.map(arc => arc.id), 'original narrative arc IDs');

  originalArcs.forEach(arc => {
    assert.equal(arc.universes.length, 1, `${arc.id} must belong to one world`);
    assert.ok(universeNames.includes(arc.universes[0]), `${arc.id} points outside originalCampaign`);
    assert.equal(arc.stages.length, 3, `${arc.id} must link three stages`);

    const definition = originalUniverseModule.ORIGINAL_UNIVERSE_DEFINITIONS.find(world => (
      world.universe === arc.universes[0]
    ));
    const stages = runtimeStages.filter(stage => stage.universe === definition.universe);

    assert.deepEqual(arc.stageIds, definition.stages.map(stage => stage.id));
    assert.deepEqual(arc.stages.map(stage => stage.id), stages.map(stage => stage.contentStageId));
    assert.deepEqual(arc.stages.map(stage => stage.runtimeStageId), stages.map(stage => stage.id));
  });
});

test('20 world boosters stay separate from five Nexus editions and resolve their art', () => {
  const worldBoosters = portalBoosterModule.ORIGINAL_WORLD_BOOSTERS;
  const nexusBoosters = portalBoosterModule.PERMANENT_OC_BOOSTERS;
  const nexusIds = new Set(nexusBoosters.map(booster => booster.id));

  assert.equal(worldBoosters.length, 20);
  assert.equal(nexusBoosters.length, 5);
  assert.ok(nexusBoosters.every(booster => booster.universe === 'Nexus de Convergence'));
  assertUnique(worldBoosters.map(booster => booster.id), 'original world booster IDs');
  assertUnique(worldBoosters.map(booster => booster.art), 'original world booster art');

  worldBoosters.forEach(booster => {
    assert.ok(!nexusIds.has(booster.id), `${booster.id} collides with a permanent Nexus edition`);
    assert.ok(
      originalUniverseModule.ORIGINAL_CAMPAIGN_UNIVERSES.includes(booster.universe),
      `${booster.id} targets a non-original world`
    );
    assert.equal(portalBoosterModule.getPortalBoosterArt(booster.universe), booster.art);
    assert.equal(portalBoosterModule.getPortalBoosterPackArt(booster.id), booster.art);
    assertText(booster.art, `${booster.id}.art`);
    assert.match(booster.art, OC_BOOSTER_V2_PATTERN);
  });
});

test('originalCampaign worlds are visible and excluded from DLC classification', () => {
  const originalUniverses = dlcModule.ORIGINAL_CAMPAIGN_UNIVERSES;
  const defaultHidden = new Set(dlcModule.DEFAULT_HIDDEN_UNIVERSES);
  const dlcUniverses = new Set(dlcModule.getDlcUniverseKeys());

  assert.equal(originalUniverses.length, 20);
  originalUniverses.forEach(universe => {
    assert.equal(dlcModule.isOriginalCampaignUniverse(universe), true);
    assert.equal(dlcModule.isBaseGameUniverse(universe), false);
    assert.equal(defaultHidden.has(universe), false, `${universe} must be visible by default`);
    assert.equal(dlcUniverses.has(universe), false, `${universe} must not be classified as DLC`);
  });
});
