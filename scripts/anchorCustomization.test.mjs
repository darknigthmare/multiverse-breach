import test from 'node:test';
import assert from 'node:assert/strict';
import { equipAnchorUnlock } from '../src/game/anchorCustomization.js';

test('moving customization keeps saved ownership, loadouts and gameplay support separate', () => {
  const collection = { profileTitles: ['title'], npcAssists: ['medic'], hudThemes: [{ id: 'hud' }], customLoadout: { npcAssist: 'medic', portalEffect: 'portal' }, cards: { existing: 2 } };
  const next = equipAnchorUnlock(collection, 'profileTitle', 'title');
  assert.equal(next.customLoadout.profileTitle, 'title');
  assert.equal(next.customLoadout.npcAssist, 'medic');
  assert.equal(next.customLoadout.portalEffect, 'portal');
  assert.equal(collection.customLoadout.profileTitle, undefined);
  assert.deepEqual(next.cards, collection.cards);
  assert.equal(equipAnchorUnlock(collection, 'profileTitle', 'unowned'), collection);
  assert.equal(equipAnchorUnlock(collection, 'weapon', 'anything'), collection);
  assert.equal(equipAnchorUnlock(collection, 'hud', 'unowned'), collection);
  assert.equal(equipAnchorUnlock(collection, 'hud', 'hud').activeHudTheme, 'hud');
  assert.equal(equipAnchorUnlock(collection, 'npcAssist', '').customLoadout.npcAssist, null);
});
