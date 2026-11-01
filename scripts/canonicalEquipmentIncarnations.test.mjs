import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS as expansions,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES as overrides
} from '../src/game/solarOppositesSirenStarWarsPack.js';
import { STAR_WARS_EQUIPMENT_CHRONOLOGY as chronology } from '../src/game/starWarsEquipmentChronology.js';
import { buildTimelineCsv } from './exportCanonicalEquipmentChronology.mjs';

const starWars = expansions['Star Wars'];
const get = id => [...starWars, ...Object.values(overrides)].find(actor => actor.id === id);
const sourced = 'SOURCE_OFFICIELLE_INCARNATION_VERROUILLEE_VALIDATION_VISUELLE_REQUISE';

test('Ahsoka equipment is locked to three playable source periods', () => {
  const early = get('ahsoka_padawan'), siege = get('ahsoka'), rebels = get('ahsoka_adult');
  assert.deepEqual(early.equipment, ['Green Lightsaber']);
  assert.deepEqual(siege.equipment, ['Twin Blue Lightsabers']);
  assert.deepEqual(rebels.equipment, ['Twin White Lightsabers']);
  assert.match(early.incarnation, /early Padawan/);
  assert.match(siege.incarnation, /Season 7, Siege of Mandalore/);
  assert.match(rebels.incarnation, /Rebels - Fulcrum/);
  for (const actor of [early, siege, rebels]) {
    assert.equal(actor.equipmentEvidenceStatus, sourced);
    assert.match(actor.referenceUrl, /^https:\/\/www\.starwars\.com\//);
    assert.equal(actor.canonStatus, 'canon');
    assert.equal(actor.equipment.length, 1);
  }
  const unsupported = ['Padawan Comlink','Clone Wars Field Bracers','Fulcrum Frequency','Fulcrum Archive','T-6 Shuttle Beacon'];
  for (const actor of [early, siege, rebels])
    for (const entry of unsupported) assert.ok(!actor.equipment.includes(entry), entry);
});

test('Maul S7E10 uses a double-bladed weapon; the older half-saber and Darksaber are not the duel kit', () => {
  const maul = get('darth_maul');
  assert.equal(maul.weaponType, 'double_lightsaber');
  assert.equal(maul.simple.name, 'Mandalore Twin-Blade Assault');
  assert.equal(maul.incarnation, 'The Clone Wars - Season 7, Siege of Mandalore (The Phantom Apprentice)');
  assert.deepEqual(maul.equipment, ['Double-Bladed Red Lightsaber (The Clone Wars S7)', 'Cybernetic Legs']);
  assert.equal(maul.referenceUrl, 'https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide');
  assert.ok(maul.referenceUrls.includes('https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice'));
  assert.equal(maul.equipmentEvidenceStatus, sourced);
  assert.ok(!(maul.sourceProps || []).some(value => /Darksaber/i.test(value)));
  assert.ok(!maul.equipment.some(item => /Single-Bladed|Darksaber|Command Seal/i.test(item)));
});

test('Timeline separates non-playable chronology from equipped in-game labels', () => {
  const identities = new Set();
  assert.equal(chronology.length, 8);
  for (const row of chronology) {
    assert.ok(!identities.has(row.id), row.id); identities.add(row.id);
    assert.ok(['ACTIVE', 'REFERENCE_ONLY'].includes(row.implementation));
    assert.equal(row.visual, 'NON_VALIDEE_1A1');
    assert.match(row.sourceUrl, /^https:\/\/www\.starwars\.com\//);
    const gameActor = get(row.actorId);
    assert.ok(gameActor, row.actorId);
    if (row.implementation === 'ACTIVE') assert.ok(gameActor.equipment.includes(row.item), row.id);
    else assert.ok(!gameActor.equipment.includes(row.item), row.id);
  }
  assert.equal(chronology.filter(row=>row.implementation === 'ACTIVE').length, 5);
  assert.equal(chronology.filter(row=>row.implementation === 'REFERENCE_ONLY').length, 3);
  assert.equal(chronology.find(row=>row.id==='SW-MAUL-DARK')?.kind,'ARME_SCENE_HISTORIQUE');
});

test('Published CSV has a single exact reproducible source and required evidence for all rows', () => {
  const file=new URL('../docs/excel/equipment-incarnation-matrix-2026-11-01.csv',import.meta.url);
  assert.equal(readFileSync(file,'utf8'), buildTimelineCsv());
  for (const row of chronology) { assert.ok(row.evidence.length>20);assert.ok(row.constraint.length>20); }
});

test('All scoped primary and additional source URLs remain secure official links', () => {
  for (const id of ['ahsoka_padawan','ahsoka','ahsoka_adult','darth_maul']) {
    const actor=get(id);
    for (const link of [actor.referenceUrl,...(actor.referenceUrls||[])]) {
      const u=new URL(link);assert.equal(u.protocol,'https:');assert.equal(u.hostname,'www.starwars.com');
    }
  }
});
