import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { findBattlePickupSource, normalizeBattlePickupDefinition, resolveBattlePickupSemantics, withBattlePickupEffectNotice } from '../src/game/battlePickupSemantics.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
let battleItems;
let heroes;
let originalUniverses;
before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  battleItems = await vite.ssrLoadModule('/src/game/battleItems.js?pickup-semantics-tests');
  heroes = await vite.ssrLoadModule('/src/game/heroes.js');
  originalUniverses = await vite.ssrLoadModule('/src/game/originalUniverseWave.js');
});
after(async () => { await vite?.close(); });

const resolve = (universe, name, extra = {}) => resolveBattlePickupSemantics({ universe, name: { en: name }, ...extra });
const pickup = (universe, name) => {
  const item = battleItems.getBattleItemsForUniverse(universe).find(entry => entry.tier === 'pickup' && entry.name.en === name);
  assert.ok(item, `${universe} missing authored pickup ${name}`);
  return item;
};

test('green herb and Silent Hill health drink heal without offensive side effects', () => {
  for (const [universe, name] of [['Resident Evil', 'Compact Green Herb'], ['Silent Hill', 'Health Drink'], ['Dino Crisis', 'SORT Hemostatic Patch']]) {
    const item = pickup(universe, name);
    assert.equal(item.role, 'defense');
    assert.ok(item.effect.heal > 0);
    assert.equal(item.effect.damage, undefined);
    assert.equal(item.effectSource, 'identity');
  }
});

test('Halo bubble and MJOLNIR cell provide real shield metadata, never healing or attack', () => {
  for (const name of ['Deployable Bubble Shield', 'MJOLNIR Shield Cell']) {
    const item = pickup('Halo', name);
    assert.equal(item.role, 'defense');
    assert.ok(item.effect.shield > 0);
    assert.equal(item.effect.heal, undefined);
    assert.equal(item.effect.damage, undefined);
  }
});

test('Naquadah cell recharges while Ancient Drone, plasma grenade and incendiary rounds attack', () => {
  const cell = pickup('Stargate', 'Naquadah Cell');
  assert.equal(cell.role, 'tempo');
  assert.deepEqual(cell.effect, { charge: 32 });
  for (const [universe, name] of [['Stargate', 'Ancient Drone'], ['Halo', 'Covenant Plasma Grenade'], ['Resident Evil', 'Umbrella Incendiary Rounds']]) {
    const item = pickup(universe, name);
    assert.equal(item.role, 'offense');
    assert.ok(item.effect.damage > 0);
    assert.equal(item.effect.heal, undefined);
    assert.equal(item.effect.shield, undefined);
  }
});

test('tuple permutations never change identity-based effects', () => {
  const definitions = [
    ['Herbe verte compacte', 'Compact Green Herb', 'soin'],
    ['Grenade flash R.P.D.', 'R.P.D. Flash Grenade', 'flash'],
    ['Munitions incendiaires Umbrella', 'Umbrella Incendiary Rounds', 'offense']
  ];
  const project = tuples => Object.fromEntries(tuples.map(tuple => {
    const item = normalizeBattlePickupDefinition(tuple);
    return [item.name.en, resolveBattlePickupSemantics({ ...item, universe: 'Resident Evil' })];
  }));
  assert.deepEqual(project(definitions), project([...definitions].reverse()));
  assert.deepEqual(project(definitions), project([definitions[1], definitions[2], definitions[0]]));
});

test('relic association uses exact identity or authored source id, never array position', () => {
  const loreItems = [
    { id: 'radio', name: { fr: 'Radio', en: 'Radio' }, effect: { shield: 4 } },
    { id: 'health', name: { fr: 'Ampoule de soin', en: 'Health Drink' }, effect: { heal: 8 } }
  ];
  const item = normalizeBattlePickupDefinition(['Ampoule de soin', 'Health Drink', 'Soin']);
  assert.equal(findBattlePickupSource(item, loreItems).id, 'health');
  assert.equal(findBattlePickupSource(item, [...loreItems].reverse()).id, 'health');
  assert.equal(findBattlePickupSource({ name: { en: 'Unknown' } }, loreItems), null);
  assert.equal(findBattlePickupSource({ ...item, sourceItemId: 'radio' }, loreItems).id, 'radio');
  assert.equal(findBattlePickupSource({ ...item, sourceItemId: 'missing' }, loreItems), null);
  assert.equal(pickup('Silent Hill', 'Health Drink').sourceItemId, undefined, 'do not borrow the unrelated pocket radio art');
});

test('authored metadata outranks identity rules and survives without mutation', () => {
  const authored = normalizeBattlePickupDefinition(['Herbe verte compacte', 'Compact Green Herb', 'Explicit variant', { role: 'defense', effect: { heal: 77, shield: 6 } }]);
  const copy = structuredClone(authored);
  const projected = resolveBattlePickupSemantics({ ...authored, universe: 'Resident Evil' });
  assert.deepEqual(projected.effect, { heal: 77, shield: 6 });
  assert.equal(projected.effectSource, 'authored-effect');
  projected.effect.heal = 1;
  assert.deepEqual(authored, copy);
  assert.deepEqual(resolve('Unknown', 'Authored tempo tool', { role: 'tempo' }).effect, { charge: 28 });
  assert.equal(resolve('Unknown', 'Authored shield tool', { effect: { shield: 7 } }).role, 'defense');
});

test('unsupported narrative controls and ambiguous mixed-use items are explicitly neutral', () => {
  for (const [universe, name] of [['Silent Hill', 'Static Radio'], ['Silent Hill', 'Marked South Vale Map'], ['Resident Evil', 'R.P.D. Flash Grenade'], ['Dino Crisis', 'Third Energy Key Plug'], ['Half-Life', 'Lambda Crate']]) {
    const item = pickup(universe, name);
    assert.equal(item.role, 'neutral');
    assert.deepEqual(item.effect, {});
    assert.match(item.desc.fr, /Effet de combat neutre/);
    assert.match(item.desc.en, /Neutral combat effect/);
  }
  assert.equal(resolve('Unknown', 'Mysterious Token').role, 'neutral');
  assert.equal(resolve('Unknown', 'Healing Grenade', { desc: 'Heals allies or deals damage to enemies.' }).role, 'neutral');
  assert.equal(resolve('Unknown', 'Charm', { desc: 'Ne soigne pas les blessures.' }).role, 'neutral');
});

test('controlled fallback is disclosed, identity-based and does not infer effects from equip stat boosts', () => {
  const source = { universe: 'Unknown', name: { fr: 'Kit de soin Yautja' }, boost: { atk: 40 } };
  const result = resolveBattlePickupSemantics(source);
  assert.equal(result.role, 'defense');
  assert.ok(result.effect.heal > 0);
  assert.equal(result.effect.damage, undefined);
  assert.equal(result.effectSource, 'inferred');
  assert.match(withBattlePickupEffectNotice({ fr: 'Source exacte', en: 'Exact source' }, result.effectNotice).fr, /^Source exacte Adaptation de combat deduite/);
  assert.equal(resolve('Unknown', 'Unidentified Relic', { boost: { atk: 500, hp: 500 } }).role, 'neutral');
});

test('generated fallback archetypes explicitly name their role and keep stable ids', () => {
  const unknown = battleItems.getBattleItemsForUniverse('Test Unregistered World');
  const items = unknown.filter(entry => entry.tier === 'pickup');
  assert.deepEqual(items.map(item => item.role), ['offense', 'defense', 'tempo']);
  assert.deepEqual(items.map(item => item.id), ['test_unregistered_world_field_relic', 'test_unregistered_world_survival_cache', 'test_unregistered_world_tempo_core']);
  assert.match(items[0].name.en, /Impact Relic/);
  assert.match(items[1].name.en, /Anchor Cache/);
  assert.match(items[2].name.en, /Cadence Core/);
  assert.ok(items.every(item => item.effectSource === 'authored-effect'));
});

test('source identity links in generated pickups point to the same named prop', () => {
  for (const item of battleItems.BATTLE_ITEM_CATALOG.filter(item => item.tier === 'pickup' && item.sourceItemId && item.effectSource)) {
    const source = heroes.EQUIP_ITEMS_DB.find(entry => entry.id === item.sourceItemId);
    assert.ok(source, `${item.id} has a missing source ${item.sourceItemId}`);
    const names = new Set(Object.values(source.name || {}));
    assert.ok(Object.values(item.name || {}).some(name => names.has(name)), `${item.id} borrowed unrelated source art`);
  }
});

test('authored original-world items and summon/ultimate effects are unchanged', () => {
  for (const world of originalUniverses.ORIGINAL_UNIVERSE_DEFINITIONS) {
    const projected = battleItems.getBattleItemsForUniverse(world.universe);
    for (const source of world.battleItems) {
      const actual = projected.find(item => item.id === source.id);
      assert.deepEqual(actual.effect, source.effect);
      assert.equal(actual.role, source.role);
      assert.deepEqual(actual.name, source.name);
    }
  }
  for (const universe of ['Resident Evil', 'Halo', 'Silent Hill', 'Stargate']) {
    const items = battleItems.getBattleItemsForUniverse(universe);
    assert.deepEqual(items.find(item => item.tier === 'summon').effect, { summonDamage: 76, charge: 12 });
    assert.deepEqual(items.find(item => item.tier === 'ultimate').effect, { ultimateDamage: 145, charge: 18 });
  }
});

test('runtime pickup builders no longer rotate role or effect arrays by index', () => {
  const source = readFileSync(path.join(root, 'src/game/battleItems.js'), 'utf8');
  assert.doesNotMatch(source, /index\s*%\s*3/);
  assert.doesNotMatch(source, /override\.pickups\.map\(\(\[fr, en, effectText\]/);
  assert.match(source, /findBattlePickupSource\(authored, loreItems\)/);
  assert.match(source, /templates\[templateRole\]/);
});

test('neutral props remain in the archive but never enter usable battle pools', () => {
  const neutral = pickup('Silent Hill', 'Static Radio');
  assert.deepEqual(neutral.effect, {});
  const pool = battleItems.getBattleItemPoolForStage({ universe: 'Silent Hill', sourceUniverses: ['Resident Evil', 'Stargate'] });
  assert.equal(pool.some(item => item.id === neutral.id), false);
  assert.ok(pool.some(item => item.name.en === 'Health Drink'));
  assert.ok(pool.some(item => item.name.en === 'Ancient Drone'));
  assert.ok(pool.every(item => ['damage', 'summonDamage', 'ultimateDamage', 'heal', 'shield', 'charge'].some(key => Number(item.effect?.[key]) > 0)));
  assert.deepEqual(battleItems.getBattleItemPoolForStage(null), []);
});
