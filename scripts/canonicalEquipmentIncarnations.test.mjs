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
  assert.deepEqual(maul.equipment, ['Double-Bladed Red Lightsaber (The Clone Wars S7)', 'Mandalorian-Issue Humanoid Cybernetic Legs']);
  assert.equal(maul.referenceUrl, 'https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide');
  assert.ok(maul.referenceUrls.includes('https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice'));
  assert.equal(maul.equipmentEvidenceStatus, sourced);
  assert.ok(!(maul.sourceProps || []).some(value => /Darksaber/i.test(value)));
  assert.ok(!maul.equipment.some(item => /Single-Bladed|Darksaber|Command Seal/i.test(item)));
});

test('Timeline separates non-playable chronology from equipped in-game labels', () => {
  const identities = new Set();
  assert.equal(chronology.length, 25);
  for (const row of chronology) {
    assert.ok(!identities.has(row.id), row.id); identities.add(row.id);
    assert.ok(['ACTIVE', 'REFERENCE_ONLY', 'EXCLUDED_UNVERIFIED'].includes(row.implementation));
    assert.equal(row.visual, 'NON_VALIDEE_1A1');
    assert.match(row.sourceUrl, /^https:\/\/(?:www\.starwars\.com|crls\.501st\.com|www\.swtor\.com)\//);
    const gameActor = get(row.actorId);
    assert.ok(gameActor, row.actorId);
    if (row.implementation === 'ACTIVE') assert.ok(gameActor.equipment.includes(row.item), row.id);
    else assert.ok(!gameActor.equipment.includes(row.item), row.id);
  }
  assert.equal(chronology.filter(row=>row.implementation === 'ACTIVE').length, 10);
  assert.equal(chronology.filter(row=>row.implementation === 'REFERENCE_ONLY').length, 12);
  assert.equal(chronology.filter(row=>row.implementation === 'EXCLUDED_UNVERIFIED').length, 3);
  assert.equal(chronology.find(row=>row.id==='SW-MAUL-DARK')?.kind,'ARME_SCENE_HISTORIQUE');
});

test('Published CSV has a single exact reproducible source and required evidence for all rows', () => {
  const file=new URL('../docs/excel/equipment-incarnation-matrix-2026-11-01.csv',import.meta.url);
  assert.equal(readFileSync(file,'utf8'), buildTimelineCsv());
  for (const row of chronology) { assert.ok(row.evidence.length>20);assert.ok(row.constraint.length>20); }
});

test('Maul prosthetic editions and Aayla’s restricted kit stay separate', () => {
  const maul=get('darth_maul'), aayla=get('aayla_secura');
  assert.equal(maul.equipment[1], 'Mandalorian-Issue Humanoid Cybernetic Legs');
  assert.ok(maul.referenceUrls.includes('https://www.starwars.com/news/star-wars-maul-shadow-lord-leg-list'));
  assert.match(maul.visualAnchor, /not Lotho Minor spider legs/);
  assert.deepEqual(aayla.equipment, ['Blue Lightsaber']);
  assert.equal(aayla.equipmentEvidenceStatus,'ARME_ATTESTEE_MODELE_ET_VISUEL_A_VALIDER');
  assert.equal(aayla.referenceUrl,'https://www.starwars.com/databank/aayla-secura');
  for(const key of ['SW-MAUL-SPIDER','SW-MAUL-TALZIN','SW-AAYLA-BRACER','SW-AAYLA-COMLINK']) {
    const entry=chronology.find(v=>v.id===key);assert.ok(entry);
    assert.notEqual(entry.implementation,'ACTIVE');
  }
});

test('Revan single red Sith preset never silently inherits LEGO dual red-and-purple equipment', () => {
  const revan=get('darth_revan');
  assert.equal(revan.weaponType, 'lightsaber');
  assert.equal(revan.weaponColor, '#ff4242');
  assert.deepEqual(revan.equipment, ['Red Lightsaber']);
  assert.match(revan.incarnation,/Knights of the Old Republic I - masked/);
  assert.equal(revan.canonStatus,'legends');
  assert.ok(revan.costumeParts.some(label=>/Mask/.test(label)));
  assert.equal(revan.secondary.name,'Force Reversal');
  assert.equal(revan.equipmentEvidenceStatus,'KOTOR1_VARIANTE_SITH_REFERENCE_COSTUME_VISUEL_NON_CERTIFIE');
  assert.ok(revan.referenceUrls.some(u=>u.includes('lego-rebuild-the-galaxy')));
  assert.equal(revan.referenceUrl,'https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii');
  assert.match(revan.visualAnchor,/NOT the SWTOR flat-chin mask/);
  assert.equal(chronology.find(row=>row.id==='SW-REVAN-KOTORII-DUAL')?.implementation,'REFERENCE_ONLY');
  assert.equal(chronology.find(row=>row.id==='SW-REVAN-SWTOR-FALLEN')?.implementation,'REFERENCE_ONLY');
  assert.equal(chronology.find(row=>row.id==='SW-REVAN-LEGO').implementation,'REFERENCE_ONLY');
  assert.ok(!revan.equipment.some(item=>/Purple|LEGO|Mask/.test(item)));
});

test('Talon ritual tattoos are anatomy and separate protective plates stay actual equipment', () => {
  const talon=get('darth_talon');
  assert.equal(talon.weaponType,'lightsaber');
  assert.deepEqual(talon.equipment,['Red Lightsaber','Forearm and Bicep Armor','Leg Armor']);
  assert.ok(talon.bodyMarkings.some(label=>/Black Sith Ritual Tattoos/.test(label)));
  assert.ok(talon.costumeParts.includes('Armored Bandeau'));
  assert.ok(!talon.equipment.some(label=>/Tattoos|One Sith Armor|Bandeau/.test(label)));
  assert.equal(talon.canonStatus,'legends');
  assert.equal(talon.referenceUrl,'https://crls.501st.com/tfe/darth-talon');
  assert.match(talon.equipmentSource,/NOT a Lucasfilm certificate/);
  assert.equal(talon.equipmentEvidenceStatus,'LEGENDS_COSTUME_501ST_APPROUVEE_SPRITE_NON_VERIFIE');
  assert.equal(chronology.find(row=>row.id==='SW-TALON-GENERIC').implementation,'EXCLUDED_UNVERIFIED');
});

test('All scoped primary and additional source URLs remain secure official links', () => {
  for (const id of ['ahsoka_padawan','ahsoka','ahsoka_adult','darth_maul']) {
    const actor=get(id);
    for (const link of [actor.referenceUrl,...(actor.referenceUrls||[])]) {
      const u=new URL(link);assert.equal(u.protocol,'https:');assert.equal(u.hostname,'www.starwars.com');
    }
  }
});
