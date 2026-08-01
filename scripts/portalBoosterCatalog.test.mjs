import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BOOSTER_ART_BY_PACK_ID,
  BOOSTER_ROTATION_SIZE,
  BOOSTER_ROTATION_WINDOW_MS,
  DEFAULT_OC_BOOSTER_ID,
  PERMANENT_OC_BOOSTERS,
  getPortalBoosterPackArt,
  getPortalBoosterRotation
} from '../src/game/portalBoosterCatalog.js';
import {
  OC_BOOSTER_CONTENT_UPDATES,
  OC_BOOSTER_UPDATE_UNLOCKABLES,
  getOcBoosterContentUpdate
} from '../src/game/ocBoosterContentUpdates.js';
import {
  STANDALONE_OC_BOOSTER_CONTENT_UPDATES,
  STANDALONE_OC_BOOSTER_UPDATE_UNLOCKABLES
} from '../src/game/standaloneOcBoosterContentUpdates.js';

const universes = Array.from({ length: 12 }, (_, index) => `Thread ${index + 1}`);

test('rotation exposes a unique temporary selection and a precise deadline', () => {
  const now = BOOSTER_ROTATION_WINDOW_MS * 10 + 1_234;
  const rotation = getPortalBoosterRotation(universes, now);

  assert.equal(rotation.universes.length, BOOSTER_ROTATION_SIZE);
  assert.equal(new Set(rotation.universes).size, BOOSTER_ROTATION_SIZE);
  assert.ok(rotation.universes.every(universe => universes.includes(universe)));
  assert.equal(rotation.remainingMs, BOOSTER_ROTATION_WINDOW_MS - 1_234);
  assert.equal(rotation.nextRotationAt, BOOSTER_ROTATION_WINDOW_MS * 11);
});

test('the next cycle advances the temporary booster selection', () => {
  const first = getPortalBoosterRotation(universes, BOOSTER_ROTATION_WINDOW_MS * 3);
  const second = getPortalBoosterRotation(universes, BOOSTER_ROTATION_WINDOW_MS * 4);

  assert.notDeepEqual(first.universes, second.universes);
});

test('rotation tolerates duplicate, short and empty catalogues', () => {
  const short = getPortalBoosterRotation(['Alien', 'Alien', 'Stargate'], 0);
  const empty = getPortalBoosterRotation([], 0);

  assert.deepEqual(short.universes, ['Alien', 'Stargate']);
  assert.deepEqual(empty.universes, []);
  assert.equal(empty.remainingMs, BOOSTER_ROTATION_WINDOW_MS);
});

test('five permanent OC editions have unique art and targeted pools', () => {
  assert.equal(PERMANENT_OC_BOOSTERS.length, 5);
  assert.equal(DEFAULT_OC_BOOSTER_ID, PERMANENT_OC_BOOSTERS[0].id);
  assert.equal(
    new Set(PERMANENT_OC_BOOSTERS.map(pack => pack.id)).size,
    PERMANENT_OC_BOOSTERS.length
  );
  assert.equal(
    new Set(PERMANENT_OC_BOOSTERS.map(pack => pack.art)).size,
    PERMANENT_OC_BOOSTERS.length
  );
  assert.equal(
    new Set(PERMANENT_OC_BOOSTERS.map(pack => pack.heroIds.join('|'))).size,
    PERMANENT_OC_BOOSTERS.length
  );

  PERMANENT_OC_BOOSTERS.forEach(pack => {
    assert.equal(pack.universe, 'Nexus de Convergence');
    assert.equal(pack.priceTier, 'targeted');
    assert.equal(pack.guaranteeNonHeroRare, true);
    assert.ok(pack.heroIds.length >= 2);
    assert.ok(pack.art.startsWith('/boosters/oc-'));
    assert.ok(pack.art.endsWith('.webp'));
    assert.equal(getPortalBoosterPackArt(pack.id), pack.art);
    assert.equal(BOOSTER_ART_BY_PACK_ID[pack.id], pack.art);
  });
});

test('every permanent OC edition exposes an exclusive frozen content update', () => {
  const globalCardIds = new Set();
  const updateSignatures = new Set();

  assert.equal(Object.keys(OC_BOOSTER_CONTENT_UPDATES).length, 5);
  assert.ok(Object.isFrozen(OC_BOOSTER_CONTENT_UPDATES));
  assert.ok(Object.isFrozen(OC_BOOSTER_UPDATE_UNLOCKABLES));

  PERMANENT_OC_BOOSTERS.forEach(pack => {
    const update = getOcBoosterContentUpdate(pack.id);
    const cardIds = update.cards.map(card => card.id);
    const signature = cardIds.join('|');

    assert.equal(pack.contentUpdate.version, '1.1');
    assert.equal(pack.contentUpdate.releasedAt, '2026-07-27');
    assert.equal(pack.contentUpdate.waveId, 'oc-wave-01');
    assert.equal(update, OC_BOOSTER_CONTENT_UPDATES[pack.id]);
    assert.equal(update.cards.length, 5);
    assert.deepEqual(pack.contentUpdate.newCardIds, cardIds);
    assert.equal(new Set(cardIds).size, cardIds.length);
    assert.ok(Object.isFrozen(pack.contentUpdate));
    assert.ok(Object.isFrozen(pack.contentUpdate.newCardIds));
    assert.ok(Object.isFrozen(update));
    assert.ok(Object.isFrozen(update.cards));
    assert.match(update.releasedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(update.summary.fr);
    assert.ok(update.summary.en);
    assert.ok(cardIds.includes(pack.chaseRewardId));
    assert.ok(new Set(update.cards.map(card => card.kind)).size >= 3);
    assert.ok(update.cards.some(card => ['rare', 'epic', 'anomaly'].includes(card.rarityId)));
    assert.equal(update.cards.filter(card => card.rarityId === 'anomaly').length, 1);
    assert.equal(
      update.cards.find(card => card.id === pack.chaseRewardId)?.rarityId,
      'anomaly'
    );
    assert.ok(!updateSignatures.has(signature));
    updateSignatures.add(signature);

    update.cards.forEach(card => {
      assert.equal(card.rewardId, card.id);
      assert.equal(card.universe, 'Nexus de Convergence');
      assert.ok(Object.isFrozen(card));
      assert.ok(!globalCardIds.has(card.id));
      globalCardIds.add(card.id);
      if (pack.rewardKinds) {
        assert.ok(pack.rewardKinds.includes(card.kind));
      }
    });
  });

  assert.equal(globalCardIds.size, 25);
  assert.equal(
    Object.keys(OC_BOOSTER_UPDATE_UNLOCKABLES).length,
    [...globalCardIds].filter(id => !id.startsWith('archive:') && !id.startsWith('hud:')).length
  );
  assert.equal(getOcBoosterContentUpdate('multi'), null);
  assert.equal(getOcBoosterContentUpdate('universe:Nexus de Convergence'), null);
});

test('the three standalone OC boosters expose their first exclusive content wave', () => {
  const updates = Object.values(STANDALONE_OC_BOOSTER_CONTENT_UPDATES);
  const globalCardIds = new Set();

  assert.equal(updates.length, 3);
  assert.ok(Object.isFrozen(STANDALONE_OC_BOOSTER_CONTENT_UPDATES));
  assert.ok(Object.isFrozen(STANDALONE_OC_BOOSTER_UPDATE_UNLOCKABLES));

  updates.forEach(update => {
    assert.equal(getOcBoosterContentUpdate(update.packId), update);
    assert.equal(update.version, '1.1');
    assert.equal(update.releasedAt, '2026-08-01');
    assert.equal(update.waveId, 'oc-standalone-wave-01');
    assert.equal(update.cards.length, 5);
    assert.deepEqual(update.newCardIds, update.cards.map(card => card.id));
    assert.equal(new Set(update.cards.map(card => card.kind)).size, 5);
    assert.equal(update.cards.filter(card => card.rarityId === 'anomaly').length, 1);
    assert.equal(
      update.cards.find(card => card.id === update.chaseRewardId)?.rarityId,
      'anomaly'
    );
    assert.ok(Object.isFrozen(update));
    assert.ok(Object.isFrozen(update.cards));

    update.cards.forEach(card => {
      assert.equal(card.universe, update.universe);
      assert.ok(!globalCardIds.has(card.id));
      globalCardIds.add(card.id);
    });
  });

  assert.equal(globalCardIds.size, 15);
  assert.equal(Object.keys(STANDALONE_OC_BOOSTER_UPDATE_UNLOCKABLES).length, 12);
});
