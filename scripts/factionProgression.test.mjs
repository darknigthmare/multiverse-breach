import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FACTION_RULES,
  REPUTATION_TRACKS,
  applyFactionBonuses,
  awardMissionReputation,
  getReputationRank,
  getReputationResourceMultiplier,
  normalizeReputationProgress,
  resolveMissionFactionIds,
  resolveUniverseFactionIds
} from '../src/game/factionProgression.js';

test('all 22 exposed faction labels own a unique mechanical contract', () => {
  assert.equal(FACTION_RULES.length, 22);
  assert.equal(new Set(FACTION_RULES.map(rule => rule.id)).size, 22);
  FACTION_RULES.forEach(rule => {
    assert.ok(['hp', 'atk', 'def', 'spd'].includes(rule.stat), `${rule.id} stat`);
    assert.ok(rule.multiplier > 1, `${rule.id} multiplier`);
    assert.equal(rule.minMembers, 2);
    assert.ok(REPUTATION_TRACKS.some(track => track.id === rule.reputationId), `${rule.id} reputation`);
  });
});

test('the five reputation tracks gain ranks and apply real passive bonuses', () => {
  assert.equal(REPUTATION_TRACKS.length, 5);
  const normalized = normalizeReputationProgress({ archivists: { xp: 350 } });
  assert.equal(getReputationRank('archivists', normalized), 2);
  assert.equal(getReputationResourceMultiplier('shards', normalized), 1.04);
  assert.deepEqual(Object.keys(normalized).sort(), REPUTATION_TRACKS.map(track => track.id).sort());
});

test('base and narrative faction rules resolve and modify combat stats', () => {
  assert.deepEqual(resolveMissionFactionIds(null), []);
  const nullStageBonuses = applyFactionBonuses(
    { hp: 100, atk: 50, def: 40, spd: 30 },
    { heroUniverse: 'Nexus de Convergence', teamUniverses: [], stage: null }
  );
  assert.deepEqual(nullStageBonuses.activeRules, []);
  assert.ok(resolveUniverseFactionIds('Halo').includes('sci_fi'));
  const stage = {
    universe: 'Halo',
    arcId: 'frontline_sci_fi',
    sourceUniverses: ['Halo', 'Stargate']
  };
  const factionIds = resolveMissionFactionIds(stage);
  assert.ok(factionIds.includes('sci_fi'));
  assert.ok(factionIds.includes('nexus_alliance'));

  const result = applyFactionBonuses({ hp: 100, atk: 50, def: 40, spd: 30 }, {
    heroUniverse: 'Halo',
    teamUniverses: ['Halo', 'Stargate'],
    stage,
    reputationProgress: { nexus_alliance: { xp: 650 } }
  });
  assert.ok(result.stats.hp > 100);
  assert.ok(result.activeRules.some(rule => rule.id === 'sci_fi'));
  assert.ok(result.activeRules.some(rule => rule.id === 'nexus_alliance'));
});

test('mission outcomes award deterministic, migrated reputation xp', () => {
  const stage = { universe: 'Predator', arcId: 'xeno_yautja_war', specialEventId: 'yautja_hunt' };
  const victory = awardMissionReputation({}, stage, { victory: true, firstClear: true });
  const defeat = awardMissionReputation(victory, stage, { victory: false });
  assert.equal(victory.free_fractures.xp, 26);
  assert.equal(defeat.free_fractures.xp, 29);
  const nullStageVictory = awardMissionReputation({}, null, { victory: true });
  assert.equal(nullStageVictory.nexus_alliance.xp, 12);

  const unclassifiedVictory = awardMissionReputation(
    {},
    { universe: 'Dino Crisis' },
    { victory: true }
  );
  assert.equal(unclassifiedVictory.nexus_alliance.xp, 12);
  assert.equal(unclassifiedVictory.archivists.xp, 0);
});
