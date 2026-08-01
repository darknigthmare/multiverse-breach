import assert from 'node:assert/strict';
import test from 'node:test';

import {
  deriveCompletedArcIds,
  getArcReplayDescriptor,
  migrateArcReplayProgress,
  migrateArcReplayState,
  normalizeArcDefinitions
} from '../src/game/missions/arcReplayMigration.js';

const RAW_ARCS = [
  { id: 'leon_personal', stageId: 9_201 },
  { id: 'survival_trio', stageId: 41_002 },
  {
    id: 'original_world',
    stages: [
      { runtimeStageId: 51_001 },
      { runtimeStageId: 51_002 },
      { runtimeStageId: 51_003 }
    ]
  },
  {
    id: 'branching_arc',
    finalStageIds: [61_003, 61_004]
  }
];

test('an empty or legacy save gains both replay arrays without mutation', () => {
  const save = { saveVersion: 8, completedStages: [], inventory: ['claimed_reward'] };
  const snapshot = structuredClone(save);
  const migrated = migrateArcReplayState(save, RAW_ARCS);
  assert.deepEqual(migrated.completedArcIds, []);
  assert.deepEqual(migrated.arcReplayUnlockedIds, []);
  assert.deepEqual(migrated.inventory, ['claimed_reward']);
  assert.deepEqual(save, snapshot);
  assert.notEqual(migrated, save);
});
test('raw character, trio, and fusion-style stageId arcs migrate from completedStages', () => {
  const migrated = migrateArcReplayState({
    completedStages: ['9201', 41_002]
  }, RAW_ARCS);
  assert.deepEqual(migrated.completedArcIds, ['leon_personal', 'survival_trio']);
  assert.deepEqual(migrated.arcReplayUnlockedIds, ['leon_personal', 'survival_trio']);
});
test('a staged arc is completed only by its final stage, not an intermediate stage', () => {
  assert.deepEqual(deriveCompletedArcIds([51_001, 51_002], RAW_ARCS), []);
  assert.deepEqual(deriveCompletedArcIds([51_003], RAW_ARCS), ['original_world']);
  assert.deepEqual(getArcReplayDescriptor(RAW_ARCS[2]), {
    arcId: 'original_world',
    finalStageIds: [51_003]
  });
});

test('explicit alternative final IDs unlock the same arc when either route is complete', () => {
  assert.deepEqual(deriveCompletedArcIds([61_003], RAW_ARCS), ['branching_arc']);
  assert.deepEqual(deriveCompletedArcIds(['61004'], RAW_ARCS), ['branching_arc']);
  assert.deepEqual(getArcReplayDescriptor(RAW_ARCS[3]), {
    arcId: 'branching_arc',
    finalStageIds: [61_003, 61_004]
  });
});

test('marked boss/final stages are preferred to catalog position', () => {
  const arc = {
    id: 'marked_final',
    stages: [
      { id: 71_001 },
      { id: 71_002, bossStage: true },
      { id: 71_003 }
    ]
  };
  assert.deepEqual(getArcReplayDescriptor(arc), {
    arcId: 'marked_final',
    finalStageIds: [71_002]
  });
  assert.deepEqual(deriveCompletedArcIds([71_003], [arc]), []);
  assert.deepEqual(deriveCompletedArcIds([71_002], [arc]), ['marked_final']);
});

test('projected Hub stages use their explicit runtime ID and nested arc identity', () => {
  const projected = [
    {
      id: 40_007,
      universeArc: { id: 'halo_arc', universes: ['Halo'] }
    },
    {
      id: 9_001,
      fusionMission: { id: 'ring_and_gate', universes: ['Halo', 'Stargate'] }
    }
  ];
  assert.deepEqual(getArcReplayDescriptor(projected[0]), {
    arcId: 'halo_arc',
    finalStageIds: [40_007]
  });
  assert.deepEqual(deriveCompletedArcIds([40_007, 9_001], projected), [
    'halo_arc',
    'ring_and_gate'
  ]);
});

test('named collections and maps normalize in deterministic supplied order', () => {
  const collections = {
    characterArcs: [{ id: 'character_a', stageId: 81_001 }],
    trioArcs: [{ id: 'trio_a', stageId: 81_002 }],
    universeArcs: [{ id: 'universe_a', finalStageId: 81_003 }],
    fusionMissions: [{ id: 'fusion_a', bossStageId: 81_004 }]
  };
  assert.deepEqual(
    normalizeArcDefinitions(collections).map(arc => arc.id),
    ['character_a', 'trio_a', 'universe_a', 'fusion_a']
  );
  assert.deepEqual(
    deriveCompletedArcIds([81_001, 81_002, 81_003, 81_004], collections),
    ['character_a', 'trio_a', 'universe_a', 'fusion_a']
  );

  const mapped = {
    first: { id: 'mapped_a', stageId: 82_001 },
    second: { id: 'mapped_b', stageId: 82_002 }
  };
  assert.deepEqual(
    normalizeArcDefinitions(mapped).map(arc => arc.id),
    ['mapped_a', 'mapped_b']
  );
});

test('existing IDs are preserved, de-duplicated, and completed arcs always unlock replay', () => {
  const migrated = migrateArcReplayState({
    completedStages: [9_201],
    completedArcIds: ['legacy_arc', 'legacy_arc'],
    arcReplayUnlockedIds: ['replay_only', 'legacy_arc', 'replay_only']
  }, RAW_ARCS);
  assert.deepEqual(migrated.completedArcIds, ['legacy_arc', 'leon_personal']);
  assert.deepEqual(migrated.arcReplayUnlockedIds, [
    'replay_only',
    'legacy_arc',
    'leon_personal'
  ]);
});

test('migration is idempotent for empty, partial, and fully completed saves', () => {
  const saves = [
    { completedStages: [] },
    { completedStages: [9_201, 51_002] },
    { completedStages: [9_201, 41_002, 51_003, 61_004] }
  ];
  for (const save of saves) {
    const once = migrateArcReplayState(save, RAW_ARCS);
    const twice = migrateArcReplayState(once, RAW_ARCS);
    assert.deepEqual(twice, once);
  }
});

test('migration never rewrites completed stages, rewards, inventory, or unrelated state', () => {
  const save = {
    completedStages: [9_201],
    claimedRewards: ['char_leon_reward'],
    inventory: ['char_leon_reward'],
    gold: 123,
    nested: { untouched: true }
  };
  const migrated = migrateArcReplayState(save, RAW_ARCS);
  assert.deepEqual(migrated.completedStages, save.completedStages);
  assert.deepEqual(migrated.claimedRewards, save.claimedRewards);
  assert.deepEqual(migrated.inventory, save.inventory);
  assert.equal(migrated.gold, 123);
  assert.equal(migrated.nested, save.nested);
});

test('arcs with no explicit final ID are skipped rather than assigned an index ID', () => {
  const arcs = [
    { id: 'no_final', title: 'No final metadata' },
    { id: 'empty_stages', stages: [] },
    { title: 'No identity', stageId: 91_001 }
  ];
  assert.deepEqual(normalizeArcDefinitions(arcs), [arcs[1]]);
  assert.equal(getArcReplayDescriptor(arcs[0]), null);
  assert.equal(getArcReplayDescriptor(arcs[1]), null);
  assert.equal(getArcReplayDescriptor(arcs[2]), null);
  assert.deepEqual(deriveCompletedArcIds([0, 1, 91_001], arcs), []);
});

test('the compatibility migration export is the same pure implementation', () => {
  assert.equal(migrateArcReplayProgress, migrateArcReplayState);
  assert.deepEqual(
    migrateArcReplayProgress({ completedStages: [41_002] }, RAW_ARCS),
    migrateArcReplayState({ completedStages: [41_002] }, RAW_ARCS)
  );
});
