import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getSourceHitSequenceWave16, takeDueSourceHitsWave16, sourceSequenceColumnWave16,
  sequenceTargetStillAcceptedWave16, allocateSourceSequenceDamageWave16 } from '../src/game/combat/combatHitSequenceWave16.js';

const profile = (id = 'kirito_sao') => ({ sourceHeroId: id, universe: 'Sword Art Online', effect: 'damage',
  duration: 3.5, sourceAbility: { animationDuration: 3.5, targeting: { hitSequence: {
    kind: 'starburst-stream', hitCount: 16, firstAt: .8, lastAt: 3.05, releaseWindow: .09
  } } } });

test('a coarse update emits all sixteen releases exactly once and retains a bounded total fraction', () => {
  const action = {}, p = profile();
  assert.deepEqual(takeDueSourceHitsWave16(action, p, .79), []);
  const first = takeDueSourceHitsWave16(action, p, 1.1), rest = takeDueSourceHitsWave16(action, p, 3.5);
  const all = [...first, ...rest];
  assert.equal(all.length, 16); assert.equal(new Set(all.map(hit => hit.index)).size, 16);
  assert.equal(all[0].time, .8); assert.equal(all.at(-1).time, 3.05);
  assert.equal(all.reduce((sum, hit) => sum + hit.fraction, 0), 1);
  assert.deepEqual(takeDueSourceHitsWave16(action, p, 9), []);
});

test('source admission rejects aliases, a foreign universe, wrong count and support actions', () => {
  for (const altered of [{ sourceHeroId: 'unlisted' }, { universe: 'Unrelated' }, { effect: 'buff' }])
    assert.equal(getSourceHitSequenceWave16({ ...profile(), ...altered }), null);
  const wrong = profile(); wrong.sourceAbility.targeting.hitSequence.hitCount = 15;
  assert.equal(getSourceHitSequenceWave16(wrong), null);
});

test('the native release column occurs only on real scheduled releases and recovery follows the last', () => {
  const p = profile();
  assert.equal(sourceSequenceColumnWave16(p, .1), 0);
  assert.equal(sourceSequenceColumnWave16(p, .7), 1);
  assert.equal(sourceSequenceColumnWave16(p, .8), 2);
  assert.equal(sourceSequenceColumnWave16(p, .92), 1);
  assert.equal(sourceSequenceColumnWave16(p, .95), 2);
  assert.equal(sourceSequenceColumnWave16(p, 3.2), 3);
});

test('cancellation and removed/dead targets cannot grant delayed releases or substitute victims', () => {
  const action = { sequenceCancelled: true, sequenceTargetIds: ['accepted'] }, p = profile();
  assert.deepEqual(takeDueSourceHitsWave16(action, p, 3.5), []);
  const accepted = { id: 'accepted', currentHp: 4 }, replacement = { id: 'replacement', currentHp: 40 };
  assert.deepEqual(sequenceTargetStillAcceptedWave16(action, [accepted, replacement], unit => unit.id), [accepted]);
  accepted.currentHp = 0;
  assert.deepEqual(sequenceTargetStillAcceptedWave16(action, [accepted, replacement], unit => unit.id), []);
});

test('damage fragments retain the accepted total budget and carry their rounding instead of multiplying minimum damage', () => {
  const action = {};
  const damage = Array.from({ length: 16 }, () => allocateSourceSequenceDamageWave16(action, 'target', 23, 23 / 16));
  assert.equal(damage.reduce((sum, value) => sum + value, 0), 23);
  assert.equal(allocateSourceSequenceDamageWave16(action, 'target', 23000, 23000), 0, 'later stats cannot enlarge an accepted budget');
  assert.equal(allocateSourceSequenceDamageWave16(action, 'other', 7, 7), 7, 'different accepted targets have independent bounded totals');
});
