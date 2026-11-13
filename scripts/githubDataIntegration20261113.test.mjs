import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { resolveCombatAbility } = await import('../src/game/combatIdentity.js');
const { prefersCurrentCanonCombatKit, resolveSelectedCombatSource } = await import('../src/game/combat/sourceKitPriority.js');
const { prepareSourceSignature } = await import('../src/game/signatureSourceKits.js');
const { historicalWave13Actor } = await import('./combatCanonicalEditionFixtures.mjs');
const { CANON_ROSTER_WAVE_PART_G } = await import('../src/game/canonRosterWavePartG.js');

const read = path => readFileSync(new URL('../' + path, import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fixtureBytes = read('scripts/fixtures/githubStarWarsRaw2333c2c0.json');
const fixture = JSON.parse(fixtureBytes);
const oldMasterBytes = read('scripts/fixtures/masterCanonicalRaw3036cd02.json');
const oldMaster = JSON.parse(oldMasterBytes);
const oldPlanBytes = read('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json');
const oldPlan = JSON.parse(oldPlanBytes);
const slots = ['simple', 'secondary', 'defense', 'special'];
const get = id => HEROES_DB.find(actor => actor.id === id && actor.universe === 'Star Wars');
const ids = ['ahsoka_padawan', 'ahsoka', 'ahsoka_adult', 'aayla_secura', 'darth_maul', 'darth_revan', 'darth_talon'];

test('latest GitHub source factories have an independent exact fixture; historical sources remain pinned', () => {
  assert.equal(sha(fixtureBytes), '089937eb9a918a458cc717066585543be5aa80efdc5bd8be9222fd7cb3c78b89');
  assert.equal(fixture.sourceCommit, '2333c2c0c524414c6c7ab84ca86d7e3e40c187ac');
  assert.equal(fixture.source1to1Verified, false);
  assert.deepEqual(fixture.actors.map(actor => actor.id), ids);
  for (const [path, digest] of Object.entries(fixture.sourceFiles)) assert.equal(sha(read(path)), digest, path);
  assert.equal(sha(oldMasterBytes), 'c061ed857028374d6fe331d32558ed6a10072ea92b1ec2fb1d812e69690eec1e');
  assert.equal(oldMaster.sourceCommit, '3036cd021edfe544534a09df5c401eb024808b39');
  assert.equal(sha(oldPlanBytes), 'c2c5072ee64c0a8570b1d3229c2644b6f61ff0e2c6f7cc203e821f315326388f');
});

test('all seven real runtime actors retain the exact current DLC source fields including saber geometry', () => {
  for (const expected of fixture.actors) {
    const actor = get(expected.id);
    assert.ok(actor, expected.id);
    for (const [field, value] of Object.entries(expected)) assert.deepEqual(actor[field], value, expected.id + '.' + field);
  }
  assert.equal(get('ahsoka_adult').weaponType, 'dual_lightsaber');
  assert.equal(get('darth_maul').weaponType, 'double_lightsaber');
  assert.deepEqual(get('darth_maul').bodyProsthetics, ['Mandalorian-Issue Humanoid Cybernetic Legs']);
});

test('current source actions survive combat resolution and side-prefixed aliases without acquiring a W13 incarnation', () => {
  for (const expected of fixture.actors) {
    const actor = get(expected.id);
    for (const candidate of [actor, { ...actor, id: 'opponent:' + actor.id, sourceHeroId: actor.id, sourceUniverse: actor.universe }]) {
      assert.equal(prefersCurrentCanonCombatKit(candidate), true, expected.id);
      for (const slot of slots) {
        assert.equal(resolveSelectedCombatSource(candidate, slot), null, expected.id + '/' + slot);
        const ability = resolveCombatAbility(candidate, slot);
        assert.equal(ability.name, expected[slot].name, expected.id + '/' + slot);
        assert.equal(ability.sourceAbility.type, expected[slot].type, expected.id + '/' + slot);
        assert.equal(ability.provenance.sourceWork, expected.incarnation);
        assert.equal(ability.provenance.source1to1Verified, false);
      }
    }
  }
});

test('a shared name, foreign source identity, mixed equipment or altered action does not gain the current edition gate', () => {
  for (const expected of fixture.actors) {
    const actor = get(expected.id);
    const mutations = [
      { ...actor, id: 'unregistered:' + actor.id },
      { ...actor, universe: 'Foreign continuity' },
      { ...actor, sourceUniverse: 'Foreign continuity' },
      { ...actor, incarnation: actor.incarnation + ' alternative edition' },
      { ...actor, weaponType: 'gun' },
      { ...actor, equipment: [...actor.equipment, 'Foreign weapon'] },
      { ...actor, simple: { ...actor.simple, name: 'Unreviewed replacement' } },
      { ...actor, defense: { ...actor.defense, type: 'laser' } },
      { ...actor, special: { ...actor.special, name: 'Unreviewed signature' } }
    ];
    for (const mutated of mutations) assert.equal(prefersCurrentCanonCombatKit(mutated), false, expected.id);
  }
});

test('real battle-local signature preparation preserves current basic actions and the same source edition', () => {
  const signatureIds = ['ahsoka_padawan', 'ahsoka', 'ahsoka_adult', 'aayla_secura', 'darth_maul'];
  for (const id of signatureIds) {
    const actor = structuredClone(get(id));
    const before = structuredClone(actor);
    const signature = prepareSourceSignature(actor);
    assert.ok(signature, id);
    assert.equal(actor.special.sourceSignatureKey, id);
    assert.equal(actor.special.name, signature.name);
    assert.equal(prefersCurrentCanonCombatKit(actor), true, id);
    for (const slot of ['simple', 'secondary', 'defense']) {
      assert.deepEqual(actor[slot], before[slot], id + '/' + slot);
      assert.equal(resolveCombatAbility(actor, slot).name, before[slot].name, id + '/' + slot);
    }
    assert.equal(resolveCombatAbility(actor, 'special').name, signature.name);
    assert.equal(actor.incarnation, before.incarnation);
    assert.deepEqual(actor.equipment, before.equipment);
  }
});

test('the independently frozen W13 actors keep their own actions instead of inheriting the latest source equipment', () => {
  for (const id of ['ahsoka_adult', 'aayla_secura', 'darth_revan', 'darth_maul']) {
    const row = oldPlan.heroes.find(entry => entry.hero.id === id);
    assert.ok(row, id);
    // The old strict helper still validates the exact 3036 Maul actor before
    // projecting the already frozen Naboo authoring version.
    const legacy = id === 'darth_maul'
      ? historicalWave13Actor(oldMaster.actors.find(actor => actor.id === id), row.hero, row.source)
      : { ...structuredClone(row.hero), weaponType: row.source.weaponType, incarnation: row.source.sourceWork };
    assert.equal(prefersCurrentCanonCombatKit(legacy), false, id);
    for (const slot of slots) {
      const selected = resolveSelectedCombatSource(legacy, slot);
      assert.equal(selected?.sourceWave, 13, id + '/' + slot);
      assert.equal(selected.source.sourceWork, row.source.sourceWork);
    }
    assert.equal(resolveCombatAbility(legacy, 'special').name, row.source.name);
    assert.notEqual(legacy.incarnation, get(id).incarnation, id);
  }
});

test('the DLC facade retains Aria’s dagger and the exact nonoffensive capture NPC alongside the installed roster', () => {
  const crypt = CANON_ROSTER_WAVE_PART_G.find(pack => pack.key === 'crypt_necrodancer');
  const aria = crypt.allies.find(actor => actor[0] === 'crypt_necrodancer_aria')?.[3];
  assert.ok(aria);
  assert.equal(aria.weapon, 'Dagger Beat');
  assert.equal(aria.weaponType, 'melee');
  assert.match(aria.visualAnchor, /small basic dagger; no lute/);
  const kittens = ENEMIES_DB['Tail Concerto'].monsters.filter(actor => actor.id === 'tail_concerto_red_vest_kitten');
  assert.equal(kittens.length, 1);
  assert.equal(kittens[0].atk, 0);
  assert.equal(kittens[0].bubbleCaptureEligible, true);
  assert.equal(kittens[0].sourceNonOffensiveWave17, true);
  const slig = ENEMIES_DB.Oddworld.monsters.find(actor => actor.id === 'oddworld_slig');
  assert.equal(slig.possessionEligible, true);
  assert.equal(slig.species, 'slig');
});
