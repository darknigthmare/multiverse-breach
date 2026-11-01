import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS as expansions,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES as overrides
} from '../src/game/solarOppositesSirenStarWarsPack.js';

const wars = expansions['Star Wars'];
const get = id => [...wars, ...Object.values(overrides)].find(actor => actor.id === id);
const locked = 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE';

test('Ahsoka’s three periods have distinct, sourced and non-interchangeable carried sabers', () => {
  const young = get('ahsoka_padawan'), siege = get('ahsoka'), adult = get('ahsoka_adult');
  assert.deepEqual(young.equipment, ['Green Lightsaber']);
  assert.deepEqual(siege.equipment, ['Twin Blue Lightsabers']);
  assert.deepEqual(adult.equipment, ['Twin White Lightsabers']);
  assert.match(young.incarnation, /early Padawan/);
  assert.match(siege.incarnation, /Siege of Mandalore/);
  assert.match(adult.incarnation, /Rebels - Fulcrum/);
  for (const actor of [young, siege, adult]) {
    assert.equal(actor.equipmentEvidenceStatus, locked);
    assert.ok(actor.referenceUrl.startsWith('https://www.starwars.com/'));
    assert.equal(actor.equipment.length, 1);
    assert.equal(actor.canonStatus, 'canon');
  }
  const unverified = ['Padawan Comlink','Clone Wars Field Bracers','Fulcrum Frequency','Fulcrum Archive','T-6 Shuttle Beacon'];
  for (const actor of [young,siege,adult]) for (const item of unverified) assert.ok(!actor.equipment.includes(item), item);
});

test('Mandalore Maul does not inherit Phantom Menace twin-bladed starting kit', () => {
  const maul = get('darth_maul');
  assert.equal(maul.weaponType, 'lightsaber');
  assert.equal(maul.simple.name, 'Surviving Half-Saber Strike');
  assert.ok(maul.equipment.includes('Surviving Single-Bladed Red Lightsaber'));
  assert.ok(!maul.equipment.some(item => /Double-Bladed|Command Seal/.test(item)));
  assert.ok(maul.equipment.includes('Cybernetic Legs'));
  assert.equal(maul.equipmentEvidenceStatus, locked);
  assert.match(maul.sourceProps.join(' '), /Darksaber.*scene-specific/);
  assert.ok(!maul.equipment.some(item => /Darksaber/.test(item)));
  assert.ok(maul.referenceUrls.includes('https://www.starwars.com/databank/darksaber'));
  assert.equal(maul.referenceUrl, 'https://www.starwars.com/databank/darth-mauls-lightsaber');
});

test('All scoped source references use secure official URLs', () => {
  for (const id of ['ahsoka_padawan','ahsoka','ahsoka_adult','darth_maul']) {
    const actor=get(id);
    const links=[actor.referenceUrl,...(actor.referenceUrls||[])];
    for(const link of links){const url=new URL(link);assert.equal(url.protocol,'https:');assert.equal(url.hostname,'www.starwars.com');}
  }
});
