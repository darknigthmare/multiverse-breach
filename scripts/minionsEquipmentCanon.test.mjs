import assert from 'node:assert/strict';
import test from 'node:test';

import { EQUIP_ITEMS_DB, getItemsForUniverse } from '../src/game/heroes.js';
import { EXPANDED_GEAR, EXPANDED_UNIVERSE_SIGNATURES } from '../src/game/expandedUniverses.js';
import { getItemSpriteSrc } from '../src/game/spriteAssets.js';

test('the Minions item is one identified Freeze Ray instead of a Freeze Ray / Fart Gun hybrid', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'minions_fart_gun');
  assert.equal(item.canonicalItemId, 'gru_freeze_ray_minions_2015');
  assert.equal(item.canonicalName, 'Freeze Ray');
  assert.equal(item.sourceOwner, 'Young Gru');
  assert.match(item.incarnation, /Minions \(2015\).*London/);
  assert.match(item.name.en, /Freeze Ray/);
  assert.doesNotMatch(`${item.name.en} ${item.name.fr}`, /fart|pet/iu);
  assert.equal(EQUIP_ITEMS_DB.filter(entry => entry.id === item.id).length, 1);
  assert.equal(EXPANDED_GEAR.find(entry => entry.id === item.id).canonicalItemId, item.canonicalItemId);
});

test('the equipment still uses the saved ID, old sprite path, price and passive stat bonuses', () => {
  const item = EQUIP_ITEMS_DB.find(entry => entry.id === 'minions_fart_gun');
  assert.equal(item.id, 'minions_fart_gun');
  assert.equal(getItemSpriteSrc(item), '/sprites/generated/items/minions/minions-fart-gun.png');
  assert.equal(item.cost, 100);
  assert.deepEqual(item.boost, { atk: 8, spd: 1 });
  assert.equal(item.gameplayPolicy.runtimeEffect, 'stat-boost-only');
  assert.equal(item.gameplayPolicy.hasRuntimeFreeze, false);
  assert.equal(item.effect, undefined);
  assert.match(item.desc.en, /passive.*does not trigger freezing/);
  assert.equal(item.visualReviewStatus, 'pending');
});

test('the Minions lore signature and equipment names agree while the other saved equipment remains unchanged', () => {
  const items = getItemsForUniverse('Minions');
  assert.deepEqual(items.map(item => item.id), ['minions_fart_gun', 'minions_crown', 'minions_banana']);
  assert.deepEqual(EXPANDED_UNIVERSE_SIGNATURES.Minions.gearNames, items.map(item => item.name));
  assert.deepEqual(items[1].name, { en: 'Stolen Royal Crown', fr: 'Couronne royale volee' });
  assert.deepEqual(items[1].boost, { def: 6, hp: 45 });
  assert.deepEqual(items[2].name, { en: 'Emergency Banana', fr: 'Banane d urgence' });
  assert.deepEqual(items[2].boost, { hp: 70, atk: 4 });
});
