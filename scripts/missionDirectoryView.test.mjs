import assert from 'node:assert/strict';
import test from 'node:test';
import { getMissionDirectoryView, getMissionDirectoryBlockReason } from '../src/game/missionDirectoryView.js';

const stages = Array.from({ length: 30 }, (_, index) => ({ id: index + 1, name: `Mission ${index + 1}`, universe: 'Univers témoin', mode: 'RPG', bossName: 'Veilleur' }));
stages[29] = { ...stages[29], displayName: { fr: 'Crête de l’Aube Noyée', en: 'Ridge of the Drowned Dawn' }, sourceUniverses: ['Thalassa Mnémonique'] };
const input = { stages, completedStages: [1], isStageUnlocked: stage => stage.id <= 20,
  getMissionDeployment: stage => ({ allowed: stage.id <= 10, message: { fr: 'Cellule source requise', en: 'Source squad required' } }) };

test('pagination bounds the displayed catalogue while preserving source order, objects and complete search', () => {
  const before = JSON.stringify(stages), first = getMissionDirectoryView(input), last = getMissionDirectoryView({ ...input, page: 3 });
  assert.deepEqual(first.items.map(row => row.stage.id), Array.from({ length: 12 }, (_, index) => index + 1));
  assert.equal(first.items[0].stage, stages[0]);
  assert.deepEqual(last.items.map(row => row.stage.id), [25, 26, 27, 28, 29, 30]);
  assert.deepEqual([last.first, last.last, last.pageCount, last.total], [25, 30, 3, 30]);
  assert.equal(JSON.stringify(stages), before);
});

test('later-page missions remain searchable by accent-free French, English, universe, ID and boss', () => {
  for (const query of ['CRETE AUBE', 'drowned dawn', 'thalassa mnemonique', '30']) {
    const result = getMissionDirectoryView({ ...input, query, page: 99 });
    assert.deepEqual(result.items.map(row => row.stage.id), [30], query);
    assert.equal(result.page, 1);
  }
  assert.equal(getMissionDirectoryView({ ...input, query: 'Veilleur' }).total, 30);
});

test('all status counts and predicates keep the supplied deployment and progression decisions', () => {
  assert.deepEqual(getMissionDirectoryView(input).counts, { all: 30, available: 9, completed: 1, composition: 10, locked: 10 });
  for (const [statusFilter, ids] of [['available', [2,3,4,5,6,7,8,9,10]], ['completed', [1]],
    ['composition', [11,12,13,14,15,16,17,18,19,20]], ['locked', [21,22,23,24,25,26,27,28,29,30]]]) {
    assert.deepEqual(getMissionDirectoryView({ ...input, statusFilter }).items.map(row => row.stage.id), ids);
  }
  const blocked = getMissionDirectoryView({ ...input, query: '30' }).items[0];
  assert.equal(blocked.unlocked, false); assert.equal(blocked.canDeploy, false);
});

test('completed but inaccessible missions keep both historical completion and the deployment lock', () => {
  const result = getMissionDirectoryView({ ...input, completedStages: [30], query: '30' });
  assert.equal(result.items[0].status, 'completed');
  assert.equal(result.items[0].canDeploy, false);
  assert.equal(result.counts.completed, 1); assert.equal(result.counts.locked, 10);
});

test('blocking reasons use the real localized resolver message, with explicit safe fallback', () => {
  const row = getMissionDirectoryView({ ...input, query: '20' }).items[0];
  assert.equal(getMissionDirectoryBlockReason(row, 'en'), 'Source squad required');
  assert.equal(getMissionDirectoryBlockReason(row, 'fr'), 'Cellule source requise');
  assert.equal(getMissionDirectoryBlockReason({ ...row, canDeploy: true }, 'fr'), '');
  assert.match(getMissionDirectoryBlockReason({ ...row, deployment: {}, unlocked: false }, 'en'), /still sealed/);
  assert.match(getMissionDirectoryBlockReason({ ...row, deployment: {}, unlocked: true }, 'fr'), /cellule compatible/);
});

test('empty results, shrinking sources and absent optional deployment resolver remain safe', () => {
  const empty = getMissionDirectoryView({ ...input, query: 'no such coordinate', page: 30 });
  assert.deepEqual([empty.items.length, empty.total, empty.first, empty.last, empty.page], [0,0,0,0,1]);
  const small = getMissionDirectoryView({ ...input, stages: stages.slice(0, 2), getMissionDeployment: undefined, page: 30 });
  assert.equal(small.page, 1); assert.equal(small.items[1].canDeploy, true);
});
