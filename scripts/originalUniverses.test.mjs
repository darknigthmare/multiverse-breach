import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  ORIGINAL_CAMPAIGN_UNIVERSES,
  ORIGINAL_UNIVERSE_DEFINITIONS,
  ORIGINAL_UNIVERSE_WAVE,
  ORIGINAL_WORLD_BOOSTERS,
  ORIGINAL_WORLD_CUSTOM_UNLOCKABLES,
  ORIGINAL_WORLD_ITEM_CATALOG
} from '../src/game/originalUniverseWave.js';

const EXPECTED_TOTALS = Object.freeze({
  universes: 20,
  heroes: 60,
  enemies: 100,
  bosses: 60,
  worldBosses: 20,
  gear: 60,
  battleItems: 100,
  stages: 60,
  narrativeArcs: 20
});

const EXPECTED_THREAT_ID_DIGESTS = Object.freeze({
  enemies: '39b274142b0db8a6e7dcea8f5bd64fa19e1e1f5a6e55d09ffcdaea6750fb99ff',
  bosses: '39dfa4dd217ac1dfb5f37606865c476a809a29ecc3512a45005d784e4f60a855',
  worldBosses: 'a0af97692c63c668d5381617419d188a9d0555de40d77d6d76262b3ff583524a'
});

const REQUIRED_HERO_KIT_MODES = Object.freeze(['RPG', 'Smash', 'Tactics']);
const REQUIRED_HERO_ANIMATION_MODES = Object.freeze([
  ...REQUIRED_HERO_KIT_MODES,
  'FPS',
  'Kart'
]);
const ASSET_PATH_PATTERN = /^\/.+\.(?:avif|gif|jpe?g|ogg|png|svg|webp|wav)$/i;

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

const assertMeaningful = (value, label) => {
  if (typeof value === 'string') {
    assertText(value, label);
    return;
  }

  if (Array.isArray(value)) {
    assert.ok(value.length > 0, `${label} must not be empty`);
    return;
  }

  if (value && typeof value === 'object') {
    assert.ok(Object.keys(value).length > 0, `${label} must not be empty`);
    return;
  }

  assert.ok(
    typeof value === 'number' ? Number.isFinite(value) : value !== null && value !== undefined,
    `${label} must contain production data`
  );
};

const assertNamed = (entry, label) => {
  const name = entry?.name ?? entry?.nameLocalized ?? entry?.label ?? entry?.title;

  if (typeof name === 'string') {
    assertText(name, `${label}.name`);
    return;
  }

  assertRecord(name, `${label}.name`);
  const localizedName = name.fr ?? name.en;
  assertText(localizedName, `${label}.name.fr|en`);
};

const assertUnique = (values, label) => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const entryId = entry => entry?.id ?? entry?.rewardId ?? entry?.sourceId;

const universeName = entry => (
  typeof entry === 'string'
    ? entry
    : entry?.universe ?? entry?.name ?? entry?.key
);

const getMappedEntries = (catalog, definition, label) => {
  assertRecord(catalog, label);
  const entries = catalog[definition.universe] ?? catalog[definition.key];
  assert.ok(Array.isArray(entries), `${label} is missing ${definition.universe}`);
  return entries;
};

const digestIds = entries => createHash('sha256')
  .update(entries.map(entryId).sort().join('\n'))
  .digest('hex');

const assertSection = (record, aliases, label, { allowEmpty = false } = {}) => {
  const key = aliases.find(alias => Object.hasOwn(record, alias));
  assert.ok(key, `${label} is missing ${aliases.join('|')}`);
  if (!allowEmpty) assertMeaningful(record[key], `${label}.${key}`);
  return record[key];
};

const coveredModes = value => {
  if (Array.isArray(value)) {
    return value.map(entry => (
      typeof entry === 'string' ? entry : entry?.mode
    )).filter(Boolean);
  }

  if (value && typeof value === 'object') return Object.keys(value);
  return [];
};

const assertAllModes = (value, modes, label) => {
  const normalized = new Set(coveredModes(value).map(mode => mode.toLowerCase()));
  modes.forEach(mode => {
    assert.ok(normalized.has(mode.toLowerCase()), `${label} is missing ${mode}`);
  });
};

const assertAssetPath = (value, label) => {
  assertText(value, label);
  assert.match(value, ASSET_PATH_PATTERN, `${label} must be a public asset path`);
};

test('the twenty-world wave exposes the complete original-content contract', () => {
  const measuredTotals = {
    universes: ORIGINAL_UNIVERSE_DEFINITIONS.length,
    heroes: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.heroes).length,
    enemies: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.enemies).length,
    bosses: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.bosses).length,
    worldBosses: ORIGINAL_UNIVERSE_DEFINITIONS.filter(entry => entry.worldBoss).length,
    gear: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.gear).length,
    battleItems: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.battleItems).length,
    stages: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.stages).length,
    narrativeArcs: ORIGINAL_UNIVERSE_DEFINITIONS.filter(entry => entry.narrativeArc).length
  };

  assert.deepEqual(measuredTotals, EXPECTED_TOTALS);
  assert.equal(ORIGINAL_UNIVERSE_WAVE.length, EXPECTED_TOTALS.universes);
  assert.equal(ORIGINAL_WORLD_BOOSTERS.length, EXPECTED_TOTALS.universes);
  assert.equal(ORIGINAL_CAMPAIGN_UNIVERSES.length, EXPECTED_TOTALS.universes);
  assert.equal(Object.keys(ORIGINAL_WORLD_CUSTOM_UNLOCKABLES).length, EXPECTED_TOTALS.universes);
  assert.equal(ORIGINAL_WORLD_ITEM_CATALOG.length, EXPECTED_TOTALS.universes * 12);

  const definitionNames = ORIGINAL_UNIVERSE_DEFINITIONS.map(entry => entry.universe).sort();
  assert.deepEqual(
    ORIGINAL_UNIVERSE_WAVE.map(entry => entry.universe).sort(),
    definitionNames
  );
  assert.deepEqual(
    ORIGINAL_CAMPAIGN_UNIVERSES.map(universeName).sort(),
    definitionNames
  );

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    assertText(definition.key, 'definition.key');
    assertText(definition.universe, `${definition.key}.universe`);
    assert.equal(definition.sourceType, 'original', `${definition.key} must stay original`);
    assert.equal(definition.isOriginal, true, `${definition.key} must stay marked original`);
  });
});

test('enemy, boss and world-boss IDs remain present, unique and stable', () => {
  const threatsByKind = {
    enemies: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.enemies),
    bosses: ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(entry => entry.bosses),
    worldBosses: ORIGINAL_UNIVERSE_DEFINITIONS.map(entry => entry.worldBoss)
  };

  Object.entries(threatsByKind).forEach(([kind, threats]) => {
    const ids = threats.map(entryId);

    threats.forEach((threat, index) => {
      assertText(entryId(threat), `${kind}[${index}].id`);
      assert.match(entryId(threat), /^[a-z0-9][a-z0-9_.:-]*$/i, `${kind}[${index}] has an unstable ID`);
    });
    assertUnique(ids, `${kind} IDs`);
    assert.equal(
      digestIds(threats),
      EXPECTED_THREAT_ID_DIGESTS[kind],
      `${kind} IDs changed from the frozen original-universe manifest`
    );
  });
});

test('each narrative arc owns exactly three ordered, production-ready stages', () => {
  const globalStageIds = [];

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const label = definition.key;
    const stageIds = definition.stages.map(entryId);

    assert.equal(definition.stages.length, 3, `${label} must contain three stages`);
    assertRecord(definition.narrativeArc, `${label}.narrativeArc`);
    assert.deepEqual(
      definition.narrativeArc.stageIds,
      stageIds,
      `${label}.narrativeArc.stageIds must preserve the playable order`
    );
    globalStageIds.push(...stageIds);

    definition.stages.forEach((stage, stageIndex) => {
      const stageLabel = `${label}.stages[${stageIndex}]`;
      assertText(entryId(stage), `${stageLabel}.id`);
      assertRecord(stage.production, `${stageLabel}.production`);
      assert.match(
        String(stage.production.layoutVersion),
        /^2(?:\.|$)/,
        `${stageLabel}.production.layoutVersion must describe production v2`
      );
      assertRecord(stage.production.layout, `${stageLabel}.production.layout`);

      const layout = stage.production.layout;
      assert.match(
        layout.type,
        /^(?:rpg-arena|smash-arena|tactics-grid)$/,
        `${stageLabel}.layout.type is unsupported`
      );
      assertRecord(layout.common, `${stageLabel}.layout.common`);
      [
        [['heroSpawns'], 'hero spawns'],
        [['enemySpawns'], 'enemy spawns'],
        [['bossSpawn'], 'boss spawn'],
        [['lightCover'], 'light cover'],
        [['heavyCover'], 'heavy cover'],
        [['destructibles'], 'destructibles'],
        [['cameraBounds'], 'camera bounds'],
        [['deathZones'], 'death zones'],
        [['checkpoints'], 'checkpoints'],
        [['itemPlacements'], 'item placements'],
        [['phaseTransitions'], 'phase transitions'],
        [['traps'], 'trap behaviour']
      ].forEach(([aliases, sectionLabel]) => {
        assertSection(layout.common, aliases, `${stageLabel}.layout.common (${sectionLabel})`);
      });

      if (layout.type === 'tactics-grid') {
        assertSection(layout, ['grid'], `${stageLabel}.layout (tactics grid coordinates)`);
        assertSection(layout, ['heroSpawnCells'], `${stageLabel}.layout (hero spawn cells)`);
        assertSection(layout, ['enemySpawnCells'], `${stageLabel}.layout (enemy spawn cells)`);
        assertSection(layout, ['bossSpawnCell'], `${stageLabel}.layout (boss spawn cell)`);
      } else if (layout.type === 'smash-arena') {
        assertSection(layout, ['platforms'], `${stageLabel}.layout (platform positions)`);
        assertSection(layout, ['blastBounds'], `${stageLabel}.layout (blast bounds)`);
      } else {
        assertSection(layout, ['lanes'], `${stageLabel}.layout (RPG lanes)`);
        assertSection(layout, ['turnAnchors'], `${stageLabel}.layout (turn anchors)`);
      }
    });
  });

  assertUnique(globalStageIds, 'stage IDs');
});

test('every hero has supported-mode kits, five-mode animations, talents and final hitboxes', () => {
  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    definition.heroes.forEach(hero => {
      const label = `${definition.key}.hero.${entryId(hero)}`;
      assertText(entryId(hero), `${label}.id`);
      assertRecord(hero.production, `${label}.production`);
      assertRecord(hero.production.modeKits, `${label}.production.modeKits`);
      assertAllModes(
        hero.production.modeKits,
        REQUIRED_HERO_KIT_MODES,
        `${label}.production.modeKits`
      );
      REQUIRED_HERO_KIT_MODES.forEach(mode => {
        const key = Object.keys(hero.production.modeKits)
          .find(candidate => candidate.toLowerCase() === mode.toLowerCase());
        assertMeaningful(hero.production.modeKits[key], `${label}.production.modeKits.${key}`);
      });
      assertMeaningful(hero.production.talentTree, `${label}.production.talentTree`);
      assertMeaningful(hero.production.animations, `${label}.production.animations`);
      assertAllModes(
        hero.production.animations,
        REQUIRED_HERO_ANIMATION_MODES,
        `${label}.production.animations`
      );
      assertMeaningful(hero.production.hitboxes, `${label}.production.hitboxes`);
    });
  });
});

test('all enemies expose a complete deterministic combat state machine', () => {
  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    definition.enemies.forEach(enemy => {
      const label = `${definition.key}.enemy.${entryId(enemy)}.production`;
      assertRecord(enemy.production, label);
      assertRecord(enemy.production.stateMachine, `${label}.stateMachine`);
      assertText(enemy.production.stateMachine.initial, `${label}.stateMachine.initial`);
      assertMeaningful(enemy.production.stateMachine.states, `${label}.stateMachine.states`);

      [
        [['detectionDistance'], 'detection distances'],
        [['targetPriorities', 'targetPriority'], 'targeting priorities'],
        [['cooldownsMs', 'cooldowns'], 'cooldowns'],
        [['telegraph', 'visualTelegraphs'], 'visual telegraphs'],
        [['resistances'], 'resistances'],
        [['weaknesses'], 'weaknesses'],
        [['groupBehavior', 'groupBehaviors'], 'group behaviour'],
        [['difficultyVariants'], 'difficulty variants']
      ].forEach(([aliases, sectionLabel]) => {
        assertSection(enemy.production, aliases, `${label} (${sectionLabel})`);
      });
    });
  });
});

test('every boss and world boss owns a complete multi-phase production script', () => {
  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const bosses = [...definition.bosses, definition.worldBoss];

    bosses.forEach(boss => {
      const label = `${definition.key}.boss.${entryId(boss)}`;
      assertRecord(boss.production, `${label}.production`);
      assert.ok(
        Array.isArray(boss.production.phases) && boss.production.phases.length >= 3,
        `${label}.production.phases must contain at least three phases`
      );

      boss.production.phases.forEach((phase, phaseIndex) => {
        const phaseLabel = `${label}.production.phases[${phaseIndex}]`;
        assertRecord(phase, phaseLabel);
        assertText(phase.id, `${phaseLabel}.id`);
        assertSection(phase, ['hpThreshold', 'hpRange', 'threshold'], phaseLabel);
        assertSection(phase, ['attacks', 'attackOrder'], phaseLabel);
        assertSection(phase, ['vulnerabilityWindow', 'vulnerability'], phaseLabel);
        assertSection(phase, ['summon', 'summons'], phaseLabel, { allowEmpty: true });
        assertSection(phase, ['transition'], phaseLabel);
      });
      assertMeaningful(boss.production.rage, `${label}.production.rage`);
      assertMeaningful(
        boss.production.performanceRewards,
        `${label}.production.performanceRewards`
      );
      assertMeaningful(boss.production.modeAdaptations, `${label}.production.modeAdaptations`);
    });
  });
});

test('living worlds and expanded item catalogues contain production-depth material', () => {
  const globallyOwnedItemIds = [];

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const label = `${definition.key}.livingWorld`;
    assertRecord(definition.livingWorld, label);

    assert.ok(definition.livingWorld.locations.length >= 4, `${label}.locations is incomplete`);
    assert.ok(
      new Set(definition.livingWorld.locations.map(location => location.type)).has('village'),
      `${label}.locations must include a secondary village`
    );
    assertRecord(definition.livingWorld.population, `${label}.population`);
    ['inhabitants', 'neutralCreatures', 'supportNpcs', 'leaders'].forEach(section => {
      assertSection(definition.livingWorld.population, [section], `${label}.population`);
    });
    assertRecord(definition.livingWorld.society, `${label}.society`);
    [
      'minorFactions',
      'beliefs',
      'professions',
      'resources',
      'economy',
      'architecture',
      'food',
      'vehicles'
    ].forEach(section => {
      assertSection(definition.livingWorld.society, [section], `${label}.society`);
    });
    assertRecord(definition.livingWorld.ecology, `${label}.ecology`);
    ['flora', 'fauna', 'threats'].forEach(section => {
      assertSection(definition.livingWorld.ecology, [section], `${label}.ecology`);
    });
    ['dialogues', 'sideQuests', 'randomEvents', 'codexEntries', 'heroRelationships']
      .forEach(section => {
        assertSection(definition.livingWorld, [section], label);
      });

    assert.equal(
      definition.worldItems.length,
      12,
      `${definition.key}.worldItems must cover all twelve expanded item archetypes`
    );
    const mappedItems = ORIGINAL_WORLD_ITEM_CATALOG.filter(item => (
      item.universe === definition.universe
    ));
    assert.deepEqual(
      mappedItems.map(entryId),
      definition.worldItems.map(entryId),
      `${definition.key} item-catalog export is out of sync`
    );

    definition.worldItems.forEach((item, index) => {
      assertText(entryId(item), `${definition.key}.worldItems[${index}].id`);
      assertNamed(item, `${definition.key}.worldItems[${index}]`);
      globallyOwnedItemIds.push(entryId(item));
    });
    assertUnique(definition.worldItems.map(entryId), `${definition.key} world item IDs`);
  });

  assertUnique(globallyOwnedItemIds, 'world item IDs across universes');
});

test('each targeted booster resolves at least 24 real candidates and 11 named unlockables', () => {
  const boosterByUniverse = new Map(ORIGINAL_WORLD_BOOSTERS.map(booster => [
    booster.universe,
    booster
  ]));
  const globalUnlockableIds = [];

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const customUnlockables = getMappedEntries(
      ORIGINAL_WORLD_CUSTOM_UNLOCKABLES,
      definition,
      'ORIGINAL_WORLD_CUSTOM_UNLOCKABLES'
    );
    const unlockables = definition.universeUnlockables;

    assertRecord(unlockables, `${definition.key}.universeUnlockables`);
    const unlockableEntries = Object.values(unlockables);
    assert.equal(
      unlockableEntries.length,
      11,
      `${definition.key} must expose 11 universe unlockables`
    );
    unlockableEntries.forEach((unlockable, index) => {
      assertText(entryId(unlockable), `${definition.key}.universeUnlockables[${index}].id`);
      assertNamed(unlockable, `${definition.key}.universeUnlockables[${index}]`);
      globalUnlockableIds.push(entryId(unlockable));
    });
    assertUnique(unlockableEntries.map(entryId), `${definition.key} universe unlockable IDs`);

    assert.equal(
      customUnlockables.length,
      14,
      `${definition.key} must aggregate 3 custom and 11 generated unlockables`
    );
    const customIds = new Set(customUnlockables.map(entryId));
    unlockableEntries.forEach(unlockable => {
      assert.ok(
        customIds.has(entryId(unlockable)),
        `${entryId(unlockable)} is missing from ORIGINAL_WORLD_CUSTOM_UNLOCKABLES`
      );
    });

    const booster = boosterByUniverse.get(definition.universe) ?? definition.booster;
    assert.ok(booster, `${definition.key} is missing its targeted booster export`);
    assert.equal(definition.booster.id, booster.id);
    assert.ok(
      Array.isArray(definition.booster.candidatePool)
        && definition.booster.candidatePool.length >= 24,
      `${definition.key}.booster.candidatePool must contain at least 24 candidates`
    );

    const realContentIds = new Set([
      ...definition.heroes,
      ...definition.gear,
      ...definition.battleItems,
      ...(definition.skins ?? []),
      ...definition.worldItems,
      ...customUnlockables
    ].map(entryId));
    const candidateIds = definition.booster.candidatePool.map(entryId);

    definition.booster.candidatePool.forEach((candidate, index) => {
      const candidateLabel = `${definition.key}.booster.candidatePool[${index}]`;
      assertRecord(candidate, candidateLabel);
      assertText(entryId(candidate), `${candidateLabel}.id`);
      assertRecord(candidate.data, `${candidateLabel}.data`);
      assertNamed(candidate.data, `${candidateLabel}.data`);
      assert.ok(
        realContentIds.has(entryId(candidate)),
        `${candidateLabel} does not resolve to real universe content`
      );
    });
    assertUnique(candidateIds, `${definition.key} booster candidate IDs`);
  });

  assertUnique(globalUnlockableIds, 'universe unlockable IDs across universes');
});

test('audiovisual paths are complete, linked and unique within each asset category', () => {
  const pathsByCategory = {
    boosterArt: [],
    backdrop: [],
    stageCards: [],
    heroPortraits: [],
    threatPortraits: [],
    itemIcons: []
  };

  ORIGINAL_UNIVERSE_DEFINITIONS.forEach(definition => {
    const label = `${definition.key}.audiovisual`;
    assertRecord(definition.audiovisual, label);
    assert.equal(definition.booster.art, definition.audiovisual.boosterArt);
    assert.equal(definition.booster.backdrop, definition.audiovisual.backdrop);

    assertAssetPath(definition.audiovisual.boosterArt, `${label}.boosterArt`);
    assertAssetPath(definition.audiovisual.backdrop, `${label}.backdrop`);
    pathsByCategory.boosterArt.push(definition.audiovisual.boosterArt);
    pathsByCategory.backdrop.push(definition.audiovisual.backdrop);

    [
      ['stageCards', 3],
      ['heroPortraits', 3],
      ['threatPortraits', 9],
      ['itemIcons', 8]
    ].forEach(([category, expectedLength]) => {
      const paths = Object.values(definition.audiovisual[category]);
      assert.equal(paths.length, expectedLength, `${label}.${category} has an invalid volume`);
      paths.forEach((path, index) => {
        assertAssetPath(path, `${label}.${category}[${index}]`);
        pathsByCategory[category].push(path);
      });
    });

    definition.stages.forEach(stage => {
      assert.equal(
        stage.stageArt,
        definition.audiovisual.stageCards[stage.stageKey || stage.id],
        `${stage.id}.stageArt is out of sync`
      );
    });
    definition.heroes.forEach(hero => {
      assert.equal(
        hero.portrait,
        definition.audiovisual.heroPortraits[hero.id],
        `${hero.id}.portrait is out of sync`
      );
    });
    [...definition.enemies, ...definition.bosses, definition.worldBoss].forEach(threat => {
      assert.equal(
        threat.portrait,
        definition.audiovisual.threatPortraits[threat.name],
        `${threat.id}.portrait is out of sync`
      );
    });
  });

  Object.entries(pathsByCategory).forEach(([category, paths]) => {
    assertUnique(paths, `${category} paths`);
  });
});
