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
