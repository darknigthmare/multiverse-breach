import test from 'node:test';
import assert from 'node:assert/strict';
import { applyBoosterRotationReroll, getPersonalPortalRotation, ROTATION_REROLL_GOLD_COST } from '../src/game/portalRotationReroll.js';
import { BOOSTER_ROTATION_WINDOW_MS } from '../src/game/portalBoosterCatalog.js';

const universes = Array.from({ length: 23 }, (_, index) => `Universe ${index}`);
const save = { gold: 5000, breachShards: 420, unlockedHeroes: ['anchor'], hiddenUniverses: ['Universe 22'], portalStats: { duplicateStreak: 5, pulls: 27, history: [{ id: 'old' }] }, portalCollection: { compass: 'preserved' } };
const request = { requestId: 'once', universes, expectedCycle: 2, now: BOOSTER_ROTATION_WINDOW_MS * 2 + 1200 };

test('reroll replaces only temporary selection and costs exactly the displayed gold', () => {
  const before = structuredClone(save);
  const result = applyBoosterRotationReroll(save, request);
  assert.equal(result.applied, true);
  assert.deepEqual(save, before, 'input save must not mutate');
  assert.equal(result.save.gold, save.gold - ROTATION_REROLL_GOLD_COST);
  const personal = getPersonalPortalRotation(universes.filter(u => !save.hiddenUniverses.includes(u)), request.now, result.save.portalStats);
  assert.equal(new Set(personal.universes).size, 8);
  assert.equal(personal.universes.includes('Universe 22'), false);
  assert.equal(personal.nextRotationAt, BOOSTER_ROTATION_WINDOW_MS * 3);
  assert.equal(result.save.breachShards, save.breachShards);
  assert.deepEqual(result.save.portalCollection, save.portalCollection);
  assert.deepEqual(result.save.portalStats.history, save.portalStats.history);
  assert.equal(result.save.portalStats.duplicateStreak, 5);
  assert.equal(result.save.portalStats.pulls, 27);
});

test('same confirmation after double click or reload never debits again', () => {
  const first = applyBoosterRotationReroll(save, request);
  const reloaded = JSON.parse(JSON.stringify(first.save));
  const replay = applyBoosterRotationReroll(reloaded, request);
  assert.equal(replay.applied, false);
  assert.equal(replay.reason, 'already-applied');
  assert.equal(replay.save.gold, first.save.gold);
});

test('unaffordable, obsolete, invalid or no-op requests preserve every resource', () => {
  for (const [state, options, reason] of [
    [{ ...save, gold: 0 }, request, 'insufficient-gold'],
    [save, { ...request, expectedCycle: 1 }, 'stale-cycle'],
    [save, { ...request, requestId: '' }, 'invalid-request'],
    [save, { ...request, universes: universes.slice(0, 8) }, 'not-enough-universes']
  ]) {
    const result = applyBoosterRotationReroll(state, options);
    assert.equal(result.reason, reason); assert.equal(result.save, state);
  }
});

test('personal rotation expires at the ordinary daily boundary', () => {
  const result = applyBoosterRotationReroll(save, request);
  const tomorrow = getPersonalPortalRotation(universes, 3 * BOOSTER_ROTATION_WINDOW_MS, result.save.portalStats);
  assert.equal(tomorrow.personal, undefined);
  assert.equal(tomorrow.cycle, 3);
});
