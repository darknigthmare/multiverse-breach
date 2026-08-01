import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildTitleRotationRoster,
  buildUnlockedAttractCards,
  buildUnlockedAttractStages,
  getLocalDayKey
} from '../src/game/titlePresentation.js';

const heroes = [
  { id: 'anchor', name: 'Anchor', universe: 'Nexus' },
  { id: 'freeman', name: 'Gordon Freeman', universe: 'Half-Life' },
  { id: 'chief', name: 'Master Chief', universe: 'Halo' },
  { id: 'ripley', name: 'Ellen Ripley', universe: 'Alien' }
];

test('title rotation exposes only owned, visible, enabled universes', () => {
  const roster = buildTitleRotationRoster({
    unlockedHeroIds: ['anchor', 'freeman', 'chief', 'ripley', 'locked-id'],
    heroes,
    hiddenUniverses: ['Alien'],
    disabledHeroIds: ['chief'],
    dayKey: '2026-08-01'
  });
  assert.deepEqual(new Set(roster.map(entry => entry.universe)), new Set(['Nexus', 'Half-Life']));
  assert.equal(roster.some(entry => entry.universe === 'Alien' || entry.universe === 'Halo'), false);
});

test('title rotation is deterministic, bounded and groups owned heroes', () => {
  const input = {
    unlockedHeroIds: ['freeman', 'anchor', 'chief'],
    heroes,
    dayKey: '2026-08-01',
    maxItems: 2
  };
  assert.deepEqual(buildTitleRotationRoster(input), buildTitleRotationRoster(input));
  assert.equal(buildTitleRotationRoster(input).length, 2);
});

test('attract cards never leak history entries that are not still owned', () => {
  const cards = {
    owned: { copies: 2 },
    hidden: { copies: 1 },
    zero: { copies: 0 }
  };
  const history = [
    { cardId: 'missing', name: 'Locked card' },
    { cardId: 'owned', name: 'Owned card', universe: 'Nexus', rarity: 'rare' },
    { cardId: 'owned', name: 'Duplicate history row' },
    { cardId: 'hidden', name: 'Hidden DLC card', universe: 'Alien' },
    { cardId: 'zero', name: 'Zero-copy card' }
  ];
  assert.deepEqual(buildUnlockedAttractCards({ history, cards, hiddenUniverses: ['Alien'] }), [{
    id: 'owned',
    name: 'Owned card',
    universe: 'Nexus',
    rarityLabel: 'rare'
  }]);
});

test('attract stages expose only completed victories or explicit unlocked fallbacks', () => {
  const stages = buildUnlockedAttractStages({
    completedStageIds: [10],
    journal: [
      { stageId: 10, result: 'victory', title: 'Anomalous Materials Lab', universe: 'Half-Life', mode: 'Smash' },
      { stageId: 11, result: 'victory', title: 'Locked Aperture stage', universe: 'Portal' },
      { stageId: 10, result: 'defeat', title: 'Duplicate defeat', universe: 'Half-Life' }
    ],
    unlockedFallbackStages: [
      { stageId: 90000, title: 'Anchor Calibration', universe: 'Nexus de Convergence', mode: 'RPG' }
    ]
  });
  assert.deepEqual(stages.map(stage => stage.stageId), [10, 90000]);
});

test('attract stages exclude disabled stages and any hidden source universe', () => {
  const stages = buildUnlockedAttractStages({
    completedStageIds: [10, 20],
    journal: [
      { stageId: 10, result: 'victory', universe: 'Half-Life' },
      { stageId: 20, result: 'victory', universe: 'Halo', source: 'Halo / Alien' }
    ],
    hiddenUniverses: ['Alien'],
    disabledStageIds: [10]
  });
  assert.deepEqual(stages, []);
});

test('local title day key uses calendar components and rejects invalid values', () => {
  assert.equal(getLocalDayKey(new Date(2026, 7, 1, 23, 59)), '2026-08-01');
  assert.equal(getLocalDayKey('not-a-date'), '');
});
