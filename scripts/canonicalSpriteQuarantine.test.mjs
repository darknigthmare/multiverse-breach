import assert from 'node:assert/strict';
import test from 'node:test';
import { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } from '../src/game/canonicalSpriteQuarantine.js';

for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
  test(`${id}: combat projections retain the exact source-art rejection`, () => {
    const hero = { id, universe: record.universe, incarnation: record.incarnation };
    for (const alias of ['sourceHeroId', 'sourceId']) {
      const projection = { ...hero, id: `combat:${id}:2`, [alias]: id };
      const before = JSON.stringify(projection);
      assert.equal(getQuarantinedCanonSprite(projection), record);
      assert.equal(JSON.stringify(projection), before, 'the view is never mutated');
      assert.equal(getQuarantinedCanonSprite({ ...projection, incarnation: 'a future reviewed edition' }), null);
      assert.equal(getQuarantinedCanonSprite({ ...projection, universe: 'Other universe' }), null);
      const unspecified = { ...projection };
      delete unspecified.incarnation;
      assert.equal(getQuarantinedCanonSprite(unspecified), null, 'a free alias cannot supply source-version evidence');
    }
    assert.equal(getQuarantinedCanonSprite({ ...hero, sourceHeroId: 'custom_actor' }), record,
      'a cosmetic alias cannot re-enable an already quarantined canonical actor');
  });
}

test('quarantine aliases follow the sprite resolver precedence and reject malformed identities', () => {
  const record = QUARANTINED_CANON_SPRITES.ahsoka;
  const projection = { id: 'combat:2', universe: record.universe, incarnation: record.incarnation };
  assert.equal(getQuarantinedCanonSprite({ ...projection, sourceHeroId: 'custom_actor', sourceId: 'ahsoka' }), null);
  assert.equal(getQuarantinedCanonSprite({ ...projection, sourceHeroId: '', sourceId: 'ahsoka' }), record);
  for (const sourceHeroId of [true, {}, ['ahsoka']]) {
    assert.equal(getQuarantinedCanonSprite({ ...projection, sourceHeroId, sourceId: 'ahsoka' }), null);
  }
  for (const id of ['__proto__', 'constructor', 'toString']) {
    assert.equal(getQuarantinedCanonSprite({ id, universe: 'Star Wars' }), null);
    assert.equal(getQuarantinedCanonSprite({ ...projection, sourceHeroId: id }), null);
  }
  for (const id of [undefined, null, '', 3, {}]) {
    assert.equal(getQuarantinedCanonSprite({ ...projection, id, sourceHeroId: 'ahsoka' }), null);
  }
});
