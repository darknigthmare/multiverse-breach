import assert from 'node:assert/strict';
import test from 'node:test';

import { CANON_ROSTER_WAVE_PART_G } from '../src/game/canonRosterWavePartG.js';
import { CANON_ROSTER_WAVE_PART_H } from '../src/game/canonRosterWavePartH.js';
import { CANON_ROSTER_WAVE_PART_I } from '../src/game/canonRosterWavePartI.js';
import { CANON_ROSTER_WAVE_PART_J } from '../src/game/canonRosterWavePartJ.js';
import { CANON_ROSTER_WAVE_PART_K } from '../src/game/canonRosterWavePartK.js';
import { CANON_ROSTER_WAVE_PART_L } from '../src/game/canonRosterWavePartL.js';
import { CANON_ROSTER_WAVE_PART_M } from '../src/game/canonRosterWavePartM.js';

const NEW_BATCH = Object.freeze([
  ...CANON_ROSTER_WAVE_PART_G,
  ...CANON_ROSTER_WAVE_PART_H,
  ...CANON_ROSTER_WAVE_PART_I,
  ...CANON_ROSTER_WAVE_PART_J,
  ...CANON_ROSTER_WAVE_PART_K,
  ...CANON_ROSTER_WAVE_PART_L,
  ...CANON_ROSTER_WAVE_PART_M
]);

const EXPECTED = Object.freeze([
  'Crypt of the NecroDancer', 'Subverse — Safe Galactic Rebellion', "No Man's Sky", 'Team Fortress 2',
  'Natural Selection 2', 'Nemesis — Awaken Realms', 'Unreal Tournament 2004', 'Angels Fall First',
  'Counter-Strike', 'Beat Banger — Safe Rhythm Studio', 'Doom Sweeper — Safe Apocalypse',
  'Stellar Dream — Safe Colony Mission', 'Absolver: Downfall', 'Agony', 'Atomic Heart', 'BioShock',
  'Bendy and the Ink Machine', 'Putt-Putt', 'Borderlands 2', 'BRINK', 'Brütal Legend',
  'Buckshot Roulette', 'Choo-Choo Charles', 'Crysis', 'Cuphead', 'Daikatana', 'Dark Souls',
  'Dead Rising', 'Deponia', 'Deus Ex', 'Devil May Cry', 'The Backrooms — Kane Pixels', 'Evolve',
  'E.Y.E: Divine Cybermancy', 'F.E.A.R.', 'Finding Frankie', 'Freddi Fish', 'GTFO', 'HAWKEN',
  'Haydee — Safe Adaptation', 'Hellblade: Senua’s Sacrifice', 'Hello Neighbor',
  'HITMAN — World of Assassination', 'Tom Clancy’s Splinter Cell', 'Super Meat Boy', 'BIT.TRIP',
  'Interstellar Marines', 'Jet Set Radio', 'Killer Instinct', 'Killing Floor 2', 'Lost Planet 2',
  'Magicka', 'Max Payne 2', 'Metal Slug', "Mirror's Edge", 'Oddworld', 'Overgrowth', 'Palworld',
  'Phantasmagoria', 'Sam & Max', 'Postal', 'PUBG', 'La Petite Histoire de France', 'Halloween',
  'Red Faction', 'Remember Me', 'R.E.P.O.', 'Wolfenstein', 'Rock of Ages', 'Serious Sam',
  'Skullgirls', 'The Forest', 'Spy Fox', 'Squirrel with a Gun', 'Starship Troopers', 'SUPERHOT',
  'The Ball', 'The Binding of Isaac: Rebirth', 'The Darkness', 'The Surge', 'Turok',
  'Wallace & Gromit', 'Worms', 'The Amazing Patate Show', 'Elfen Lied', 'Hazbin Hotel',
  'Helluva Boss', 'Murder Drones', 'Gushing over Magical Girls — Safe Adult Reinterpretation',
  'Peepoodo — Safe Educational Adaptation', 'Les Kassos', 'Marvel Zombies — MCU Animation',
  'Stranger Things', 'Invincible', 'Wakfu', 'Oggy et les Cafards', 'Les Zinzins de l’espace',
  'The Texas Chain Saw Massacre', 'Friday the 13th', 'A Nightmare on Elm Street', 'The Truman Show',
  'Torbahead'
]);

const characters = pack => [pack.hero, ...pack.allies];
const threats = pack => [...pack.monsters, ...pack.bosses, pack.worldBoss];
const flatten = value => JSON.stringify(value).toLowerCase();

test('the deduplicated new batch exposes exactly 102 canon packs in requested order', () => {
  assert.equal(NEW_BATCH.length, 102);
  assert.deepEqual(NEW_BATCH.map(pack => pack.universe), EXPECTED);
  assert.equal(new Set(NEW_BATCH.map(pack => pack.key)).size, 102);
  assert.equal(new Set(NEW_BATCH.map(pack => pack.universe)).size, 102);
});

test('every new pack keeps the complete 3/3/3/1 content contract', () => {
  for (const pack of NEW_BATCH) {
    assert.equal(characters(pack).length, 3, `${pack.universe}: heroes`);
    assert.equal(pack.monsters.length, 3, `${pack.universe}: enemies`);
    assert.equal(pack.bosses.length, 3, `${pack.universe}: bosses`);
    assert.ok(pack.worldBoss, `${pack.universe}: world boss`);
    assert.equal(pack.gear.length, 3, `${pack.universe}: gear`);
    assert.equal(1 + pack.stageVariants.length, 3, `${pack.universe}: stages`);
    assert.ok(pack.event, `${pack.universe}: event`);
    assert.match(pack.referenceUrl, /^https:\/\//, `${pack.universe}: reference`);
    assert.ok(pack.referenceUrls.every(url => /^https:\/\//.test(url)), `${pack.universe}: references`);
  }
});

test('non-combat entities are objective-only and never disguised fighters', () => {
  for (const pack of NEW_BATCH) {
    for (const hero of characters(pack)) {
      const metadata = hero[3];
      if (metadata.nonCombat !== true) continue;
      for (const forbidden of ['weapon', 'stats', 'simple', 'secondary', 'defense', 'special']) {
        assert.equal(forbidden in metadata, false, `${pack.universe}/${hero[1]}: ${forbidden}`);
      }
      assert.ok(metadata.objective);
      assert.ok(metadata.objectiveFr);
      assert.ok(metadata.victoryCondition);
    }
    for (const threat of threats(pack)) {
      if (threat.nonCombat !== true) continue;
      for (const forbidden of ['weapon', 'stats', 'moves', 'phases', 'special']) {
        assert.equal(forbidden in threat, false, `${pack.universe}/${threat.name}: ${forbidden}`);
      }
      assert.ok(threat.objective);
      assert.ok(threat.objectiveFr);
      assert.ok(threat.victoryCondition);
    }
  }
});

test('sensitive-source adaptations encode the project safety locks', () => {
  const byUniverse = universe => NEW_BATCH.find(pack => pack.universe === universe);
  for (const universe of [
    'Subverse — Safe Galactic Rebellion', 'Beat Banger — Safe Rhythm Studio',
    'Doom Sweeper — Safe Apocalypse', 'Stellar Dream — Safe Colony Mission',
    'Haydee — Safe Adaptation', 'Gushing over Magical Girls — Safe Adult Reinterpretation',
    'Peepoodo — Safe Educational Adaptation'
  ]) {
    const pack = byUniverse(universe);
    assert.ok(pack, universe);
    assert.match(flatten(pack.canonProfile), /safe|adult|fully clothed|nonsexual|non-sexual|no sex|no nudity|nonsexualized|non-sexualized/i, universe);
  }

  assert.match(flatten(byUniverse('F.E.A.R.').canonProfile), /child.*never|never.*child/i);
  assert.match(flatten(byUniverse('BioShock').canonProfile), /little sister.*never|never.*little sister/i);
  assert.match(flatten(byUniverse('Torbahead').canonProfile), /public.*persona|persona.*public/i);
  assert.match(flatten(byUniverse('Torbahead').canonProfile), /identity|private/i);
});

test('ambiguous continuities are locked and duplicate requests stay outside this batch', () => {
  const names = NEW_BATCH.map(pack => pack.universe);
  for (const existing of ['Unreal Tournament', 'Goat Simulator', 'Dead by Daylight', 'The Walking Dead — Telltale']) {
    assert.equal(names.includes(existing), false, `${existing} must reuse the existing canon pack`);
  }
  assert.equal(names.filter(name => name === 'Halloween').length, 1);
  assert.equal(names.filter(name => name === 'La Petite Histoire de France').length, 1);
  assert.match(NEW_BATCH.find(pack => pack.universe === "Mirror's Edge").continuity, /2008|original/i);
  assert.match(NEW_BATCH.find(pack => pack.universe === 'Starship Troopers').continuity, /1997/);
  assert.match(NEW_BATCH.find(pack => pack.universe === 'The Forest').continuity, /first|premier/i);
});
