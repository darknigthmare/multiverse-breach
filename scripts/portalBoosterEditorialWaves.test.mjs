import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PORTAL_EDITORIAL_WAVE_ID,
  createUniverseBoosterEditorialWave,
  resolvePortalBoosterEditorialWave
} from '../src/game/portalBoosterEditorialWaves.js';

const UNIVERSE = 'Audit Universe';
const candidate = (id, kind, universe = UNIVERSE) => ({
  id,
  kind,
  universe,
  rarity: { id: kind === 'fieldSuper' ? 'anomaly' : 'rare' }
});

const pool = [
  candidate('hero:alpha', 'hero'),
  candidate('hero:beta', 'hero'),
  candidate('equipment:relic', 'equipment'),
  candidate('event:signal', 'event'),
  candidate('hud:audit', 'hud'),
  candidate('profile-title:audit', 'profileTitle'),
  candidate('field-super:audit', 'fieldSuper'),
  candidate('npc-assist:audit', 'npcAssist'),
  candidate('battle-music:audit', 'battleMusic'),
  candidate('victory-pose:audit', 'victoryPose'),
  candidate('foreign:card', 'hero', 'Foreign Universe')
];

test('editorial waves deterministically select five existing exclusive cards', () => {
  const forward = createUniverseBoosterEditorialWave({
    packId: `universe:${UNIVERSE}`,
    universe: UNIVERSE,
    candidates: pool
  });
  const reversed = createUniverseBoosterEditorialWave({
    packId: `universe:${UNIVERSE}`,
    universe: UNIVERSE,
    candidates: [...pool].reverse()
  });

  assert.equal(forward.id, PORTAL_EDITORIAL_WAVE_ID);
  assert.equal(forward.type, 'editorial-wave');
  assert.deepEqual(forward.featuredCardIds, reversed.featuredCardIds);
  assert.deepEqual(forward.newCardIds, forward.featuredCardIds);
  assert.equal(forward.featuredCardIds.length, 5);
  assert.equal(new Set(forward.featuredCardIds).size, 5);
  assert.ok(forward.featuredCardIds.every(id => (
    pool.some(entry => entry.id === id && entry.universe === UNIVERSE)
  )));
  assert.ok(!forward.featuredCardIds.includes('foreign:card'));
  assert.ok(Object.isFrozen(forward));
  assert.ok(Object.isFrozen(forward.featuredCardIds));
});

test('editorial waves preserve the five complementary reward lanes', () => {
  const wave = createUniverseBoosterEditorialWave({
    packId: `universe:${UNIVERSE}`,
    universe: UNIVERSE,
    candidates: pool
  });
  const selectedKinds = wave.featuredCardIds.map(
    id => pool.find(entry => entry.id === id).kind
  );

  assert.ok(selectedKinds.includes('hero'));
  assert.ok(selectedKinds.some(kind => ['equipment', 'event', 'skin', 'kart'].includes(kind)));
  assert.ok(selectedKinds.some(kind => ['archive', 'hud', 'portalEffect', 'profileBanner', 'profileTitle'].includes(kind)));
  assert.ok(selectedKinds.some(kind => ['fieldSuper', 'npcAssist', 'koEffect'].includes(kind)));
  assert.ok(selectedKinds.some(kind => ['battleMusic', 'stageMusic', 'introPose', 'victoryPose'].includes(kind)));
});

test('authored updates take priority and undersized pools are not fabricated', () => {
  const authoredUpdate = Object.freeze({ id: 'authored-wave' });
  assert.equal(resolvePortalBoosterEditorialWave({
    packId: `universe:${UNIVERSE}`,
    universe: UNIVERSE,
    candidates: pool,
    authoredUpdate
  }), authoredUpdate);

  assert.equal(createUniverseBoosterEditorialWave({
    packId: `universe:${UNIVERSE}`,
    universe: UNIVERSE,
    candidates: pool.slice(0, 4)
  }), null);
});
