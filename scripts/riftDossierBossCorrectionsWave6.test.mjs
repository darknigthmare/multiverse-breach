import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const entries = JSON.parse(read('docs/rift-dossiers/catalog.json')).entrees;
const find = id => entries.find(entry => entry.id === id);

for (const [id, name, boss, slug] of [
  [34430, 'Ultratech Industries', 'Eyedol', 'ultratech-industries'],
  [34431, 'Astral Plane', 'Gargos', 'astral-plane'],
  [34440, 'Biotics Lab', 'Matriarch', 'biotics-lab']
]) test(`${id} preserves identity while replacing universe-wide anchors with a single researched scene`, () => {
  const entry = find(id);
  assert.equal(entry.nom.en, name);
  assert.equal(entry.boss, boss);
  assert.equal(entry.mode, 'RPG');
  assert.equal(entry.cheminCibleDedie, `/images/rift-dossiers/openai/expanded/stage-${id}-${slug}-v1.webp`);
  assert.equal(entry.politiqueReferences, 'authoritative-public');
  assert.equal(entry.ancragesVisuels.length, 2);
  assert.deepEqual(entry.referenceUrls, entry.bossReferenceUrls);
  assert.ok(entry.referenceUrls.length >= 2);
  for (const url of entry.referenceUrls) assert.match(url, /^https:\/\/(www\.ultra-combo\.com|store\.steampowered\.com|killingfloor2\.com)\//);
  for (const pattern of [/One coherent location ONLY/, /left party deployment area empty/, /32-bit era pixel art/, /Landscape 16:9/, /orthographic side-on 2\.5D RPG/, /No readable text/, /Official references:/]) assert.match(entry.promptOpenAI, pattern);
});

test('Eyedol follows the explicitly locked 2013 reboot, split skull and blunt war-club', () => {
  assert.match(read('src/game/canonRosterWavePartJ.js'), /continuity:'Reboot Xbox 2013\.'/);
  const prompt = find(34430).promptOpenAI;
  for (const pattern of [/SINGLE skull split vertically/, /one eye per half/, /WAR-CLUB/, /No axe/, /no two intact heads on separate necks/, /not a claim that Eyedol has this canonical home stage/, /no Fulgore, no ARIA, no Gargos/]) assert.match(prompt, pattern);
});

test('Gargos has an isolated dimensional stage, not Tiger Lair or an Ultratech montage', () => {
  const entry = find(34431);
  assert.ok(entry.referenceUrls.includes('https://www.ultra-combo.com/characters/gargos/'));
  for (const pattern of [/horned gargoyle/, /batlike membranous wings/, /long tail/, /ASTRAL PLANE/, /Shadow Energy/, /Absolutely no Tiger Lair/, /Ultratech factory/, /only Gargos occupies/]) assert.match(entry.promptOpenAI, pattern);
  assert.doesNotMatch(entry.ancragesVisuels.join(' '), /Tiger Lair|Ultratech/);
});

test('Matriarch is the armored biotech mech phase inside Biotics Lab, not a fantasy queen', () => {
  const entry = find(34440);
  for (const pattern of [/Rachel Clamely/, /MECH SUIT/, /mechanical grappling claw arm/, /plasma-cannon arm/, /back-mounted electrical apparatus/, /No horned demon queen/, /Do not depict her later unarmored mutation/, /cloning chamber/, /no Burning Paris/, /not a claim about the canonical Objective-mode finale/]) assert.match(entry.promptOpenAI, pattern);
  assert.doesNotMatch(entry.ancragesVisuels.join(' '), /Patriarch|Hans Volter|King Fleshpound/);
});

test('the already corrected SARA prompt remains byte-for-byte stable', () => {
  assert.equal(createHash('sha256').update(find(34421).promptOpenAI).digest('hex'), 'c1f7fb72474372f200384c73d2362ce677a470be8a8e65f338317e937dd5488f');
});
