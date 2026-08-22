import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_KART_CAREER,
  applyRaceResult,
  migrateLegacyKartCareer,
  normalizeKartCareer
} from '../src/game/kartCareer.js';

test('legacy kart career migrates inside the save-v9 portal collection', () => {
  const migrated = migrateLegacyKartCareer({
    saveVersion: 9,
    portalCollection: { karts: ['kart:test'] }
  }, {
    xp: 91,
    fragments: 8,
    garageParts: 12,
    upgrades: { engine: 2 },
    bestTimes: { atrium: 74.25 },
    completedObjectives: { atrium: true }
  });

  assert.deepEqual(migrated.portalCollection.karts, ['kart:test']);
  assert.equal(migrated.portalCollection.raceCareer.xp, 91);
  assert.equal(migrated.portalCollection.raceCareer.upgrades.engine, 2);
  assert.equal(migrated.portalCollection.raceCareer.bestTimes.atrium, 74.25);
  assert.equal(migrated.portalCollection.raceCareer.completedObjectives.atrium, true);
});

test('integrated career wins over stale legacy storage and is normalized', () => {
  const migrated = migrateLegacyKartCareer({
    portalCollection: {
      raceCareer: { xp: 25, garageParts: -8, upgrades: { engine: 99 } }
    }
  }, { xp: 999 });

  assert.equal(migrated.portalCollection.raceCareer.xp, 25);
  assert.equal(migrated.portalCollection.raceCareer.garageParts, 0);
  assert.equal(migrated.portalCollection.raceCareer.upgrades.engine, 5);
});

test('race results preserve the best time and accumulate rewards once', () => {
  const first = applyRaceResult(DEFAULT_KART_CAREER, {
    trackId: 'atrium',
    time: 80,
    objectiveComplete: true,
    rewards: { xp: 40, fragments: 3, garageParts: 5 }
  });
  const second = applyRaceResult(first, {
    trackId: 'atrium',
    time: 84,
    objectiveComplete: false,
    rewards: { xp: 10, fragments: 1, garageParts: 2 }
  });

  assert.equal(second.xp, 50);
  assert.equal(second.fragments, 4);
  assert.equal(second.garageParts, 7);
  assert.equal(second.bestTimes.atrium, 80);
  assert.equal(second.completedObjectives.atrium, true);
  assert.deepEqual(normalizeKartCareer(null), normalizeKartCareer(DEFAULT_KART_CAREER));
});
