import assert from 'node:assert/strict';
import test from 'node:test';

import { CANON_ROSTER_WAVE_PART_D } from '../src/game/canonRosterWavePartD.js';
import { CANON_ROSTER_WAVE_PART_E } from '../src/game/canonRosterWavePartE.js';
import { CANON_ROSTER_WAVE_PART_F } from '../src/game/canonRosterWavePartF.js';

const EXPANSION_WAVE = Object.freeze([
  ...CANON_ROSTER_WAVE_PART_D,
  ...CANON_ROSTER_WAVE_PART_E,
  ...CANON_ROSTER_WAVE_PART_F
]);

const EXPECTED_UNIVERSES = Object.freeze([
  'Sanctum',
  'Goat Simulator',
  'Quake',
  'Like a Dragon',
  'Italian Brainrot',
  'Legacy of Kain',
  'Prey (2006)',
  'Beyond Good & Evil',
  'Metal: Hellsinger',
  'Dead by Daylight',
  "Dante's Inferno",
  'Shadow Man',
  'Croc: Legend of the Gobbos',
  'Gex',
  'Spyro',
  'Rayman',
  'NieR',
  'Discipline: The Record of a Crusade',
  'Bible Black',
  'Hotline Miami',
  'Warhammer 40,000: Space Marine',
  'Back to the Future',
  'Terminator',
  'RoboCop',
  'The Walking Dead — Telltale',
  'Horizon Zero Dawn',
  'Soldier of Fortune',
  'Extreme Ghostbusters',
  'Heart of Darkness',
  'Rival Schools',
  'MediEvil',
  'Jersey Devil',
  "Goemon's Great Adventure",
  'MDK',
  'Tail Concerto',
  'Redneck Rampage',
  'Hexen',
  'Duke Nukem',
  'Marathon'
]);

const characters = pack => [pack.hero, ...pack.allies];
const threats = pack => [...pack.monsters, ...pack.bosses, pack.worldBoss];
const byUniverse = universe => {
  const pack = EXPANSION_WAVE.find(candidate => candidate.universe === universe);
  assert.ok(pack, `${universe} pack`);
  return pack;
};

test('waves D, E and F expose the exact thirty-nine requested universes', () => {
  assert.equal(CANON_ROSTER_WAVE_PART_D.length, 13);
  assert.equal(CANON_ROSTER_WAVE_PART_E.length, 13);
  assert.equal(CANON_ROSTER_WAVE_PART_F.length, 13);
  assert.deepEqual(EXPANSION_WAVE.map(pack => pack.universe), EXPECTED_UNIVERSES);
  assert.equal(new Set(EXPANSION_WAVE.map(pack => pack.key)).size, 39);
});

test('every expansion pack keeps the complete 3/3/3/1 stage, gear and event contract', () => {
  for (const pack of EXPANSION_WAVE) {
    assert.equal(characters(pack).length, 3, `${pack.universe} characters`);
    assert.equal(pack.monsters.length, 3, `${pack.universe} enemies`);
    assert.equal(pack.bosses.length, 3, `${pack.universe} bosses`);
    assert.ok(pack.worldBoss, `${pack.universe} world boss`);
    assert.equal(pack.gear.length, 3, `${pack.universe} gear`);
    assert.ok(pack.event, `${pack.universe} event`);
    assert.ok(pack.stage, `${pack.universe} primary stage`);
    assert.ok(pack.stageVariants.length >= 2, `${pack.universe} stage variants`);
    assert.match(pack.referenceUrl, /^https:\/\//, `${pack.universe} primary reference`);
    assert.ok(pack.referenceUrls.every(url => /^https:\/\//.test(url)), `${pack.universe} references`);
  }
});

test('all authored noncombat entities are objective-only and never disguised fighters', () => {
  for (const pack of EXPANSION_WAVE) {
    for (const character of characters(pack)) {
      const metadata = character[3];
      if (metadata.nonCombat !== true) continue;
      for (const forbidden of ['weapon', 'stats', 'simple', 'secondary', 'defense', 'special']) {
        assert.equal(forbidden in metadata, false, `${pack.universe}/${character[1]} ${forbidden}`);
      }
      assert.ok(metadata.entityType, `${pack.universe}/${character[1]} entity type`);
      assert.ok(metadata.objective, `${pack.universe}/${character[1]} objective`);
      assert.ok(metadata.victoryCondition, `${pack.universe}/${character[1]} victory condition`);
    }

    for (const threat of threats(pack)) {
      if (threat.nonCombat !== true) continue;
      for (const forbidden of ['weapon', 'stats', 'moves', 'phases', 'special']) {
        assert.equal(forbidden in threat, false, `${pack.universe}/${threat.name} ${forbidden}`);
      }
      assert.ok(threat.objective, `${pack.universe}/${threat.name} objective`);
      assert.ok(threat.objectiveFr, `${pack.universe}/${threat.name} French objective`);
      assert.ok(threat.victoryCondition, `${pack.universe}/${threat.name} victory condition`);
    }
  }
});

test('the two adult-source packs remain strictly nonsexual nonviolent trials', () => {
  for (const universe of ['Discipline: The Record of a Crusade', 'Bible Black']) {
    const pack = byUniverse(universe);
    assert.ok(characters(pack).every(character => character[3].nonCombat === true));
    assert.ok(threats(pack).every(threat => threat.nonCombat === true));
    assert.match(pack.canonStatus.toLowerCase(), /non-sexual|nonsexual/);
    assert.match(pack.canonProfile.adaptationRule, /no person is ever an enemy|no person is attacked/i);
  }
});

test('ambiguous titles lock the researched continuity instead of importing namesakes', () => {
  const prey = byUniverse('Prey (2006)');
  const preyRoster = [...characters(prey).map(value => value[1]), ...threats(prey).map(value => value.name)].join(' ');
  assert.match(prey.continuity, /2006/);
  assert.doesNotMatch(preyRoster, /Morgan Yu|Talos I|Mimic/i);

  const redneck = byUniverse('Redneck Rampage');
  const redneckRoster = [...characters(redneck).map(value => value[1]), ...threats(redneck).map(value => value.name)].join(' ');
  assert.ok(redneck.aliases.includes('Hillbilly Rampage'));
  assert.match(redneckRoster, /Leonard/);
  assert.match(redneckRoster, /Bubba/);
  assert.match(redneckRoster, /Bessie/);
  assert.doesNotMatch(redneckRoster, /George|Lizzie|Ralph|Scumlabs/i);

  const brainrot = byUniverse('Italian Brainrot');
  assert.match(brainrot.canonStatus, /non-canon/i);
  assert.match(brainrot.canonProfile.adaptationRule, /never as a licensed franchise canon/i);
  assert.ok(characters(brainrot).every(character => character[3].nonCombat === true));
  assert.ok(threats(brainrot).every(threat => threat.nonCombat === true));
});
