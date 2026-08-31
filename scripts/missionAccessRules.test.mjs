import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MISSION_ACCESS_REASON_CODES,
  REQUIRED_TEAM_TYPES,
  autoComposeMissionTeam,
  deriveRequiredTeam,
  evaluateMissionAccess,
  getMissionArcId
} from '../src/game/missions/missionAccessRules.js';

const HEROES = [
  { id: 'player_anchor', name: { fr: 'L Ancre', en: 'The Anchor' }, universe: 'Nexus de Convergence' },
  { id: 'masterchief', name: 'Master Chief', universe: 'Halo' },
  { id: 'arbiter', name: 'The Arbiter', universe: 'Halo' },
  { id: 'cortana', name: 'Cortana', universe: 'Halo' },
  { id: 'johnson', name: 'Avery Johnson', universe: 'Halo' },
  { id: 'oneill', name: "Jack O'Neill", universe: 'Stargate' },
  { id: 'sam_carter', name: 'Samantha Carter', universe: 'Stargate' },
  { id: 'ripley', name: 'Ellen Ripley', universe: 'Alien' },
  { id: 'leon', name: 'Leon S. Kennedy', universe: 'Resident Evil' },
  { id: 'chell', name: 'Chell', universe: 'Portal' },
  { id: 'spectator', name: 'Spectator', universe: 'Test', playable: false }
];

const owned = HEROES.filter(hero => hero.playable !== false).map(hero => hero.id);

const reasonCodes = result => result.reasons.map(reason => reason.code);

test('derives the four required-team rule types without mutating source metadata', () => {
  const characterStage = {
    characterArc: { id: 'leon_personal', heroId: 'leon' }
  };
  const characterSnapshot = structuredClone(characterStage);
  assert.deepEqual(deriveRequiredTeam(characterStage), {
    type: REQUIRED_TEAM_TYPES.CHARACTER,
    heroId: 'leon',
    allowAnchor: false,
    firstClearOnly: true,
    freeReplayAfterArc: true,
    arcId: 'leon_personal'
  });
  assert.deepEqual(characterStage, characterSnapshot);

  assert.deepEqual(deriveRequiredTeam({
    trioArc: { id: 'survival_trio', heroIds: ['ripley', 'leon', 'chell'] }
  }), {
    type: REQUIRED_TEAM_TYPES.EXACT,
    heroIds: ['ripley', 'leon', 'chell'],
    firstClearOnly: true,
    freeReplayAfterArc: true,
    arcId: 'survival_trio'
  });

  assert.deepEqual(deriveRequiredTeam({
    universeArc: { id: 'halo_arc', universes: ['Halo'], allowAnchor: true }
  }, { heroDb: HEROES }), {
    type: REQUIRED_TEAM_TYPES.UNIVERSE,
    universe: 'Halo',
    minCount: 3,
    allowAnchor: true,
    firstClearOnly: true,
    freeReplayAfterArc: true,
    arcId: 'halo_arc'
  });

  assert.deepEqual(deriveRequiredTeam({
    universeArc: { id: 'alliance_arc', universes: ['Halo', 'Stargate'] }
  }), {
    type: REQUIRED_TEAM_TYPES.SOURCES,
    sourceUniverses: ['Halo', 'Stargate'],
    allowAnchor: false,
    firstClearOnly: true,
    freeReplayAfterArc: true,
    arcId: 'alliance_arc'
  });
});

test('derives fusion/source rules and does not manufacture missing metadata', () => {
  const stage = {
    sourceUniverses: ['Halo', 'Stargate', 'Halo'],
    fusionMission: { id: 'ring_and_gate' }
  };
  assert.equal(getMissionArcId(stage), 'ring_and_gate');
  assert.deepEqual(deriveRequiredTeam(stage), {
    type: REQUIRED_TEAM_TYPES.SOURCES,
    sourceUniverses: ['Halo', 'Stargate'],
    allowAnchor: false,
    firstClearOnly: true,
    freeReplayAfterArc: true,
    arcId: 'ring_and_gate'
  });
  assert.equal(deriveRequiredTeam({ id: 123, universe: 'Halo' }), null);
  assert.equal(deriveRequiredTeam({ universeArc: { id: 'unknown', universes: [] } }), null);
});

test('an explicit requiredTeam is authoritative and policy flags are normalized', () => {
  const stage = {
    arcId: 'manual_arc',
    requiredTeam: {
      type: 'universe',
      universe: 'Halo',
      minCount: 2,
      allowAnchor: true,
      firstClearOnly: false,
      freeReplayAfterArc: false
    },
    characterArc: { id: 'ignored', heroId: 'leon' }
  };
  assert.deepEqual(deriveRequiredTeam(stage, { heroDb: HEROES }), {
    type: 'universe',
    universe: 'Halo',
    minCount: 2,
    allowAnchor: true,
    firstClearOnly: false,
    freeReplayAfterArc: false,
    arcId: 'manual_arc'
  });
});

test('base access remains authoritative for ownership, level, and clear checks', () => {
  const stage = { characterArc: { id: 'leon_personal', heroId: 'leon' } };
  const message = { fr: 'Leon doit atteindre le niveau 5.', en: 'Leon must reach level 5.' };
  const result = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['leon'],
    completedArcIds: ['leon_personal'],
    baseAccess: {
      unlocked: false,
      reasons: [{ code: 'heroLevel', heroId: 'leon', requiredLevel: 5 }],
      missing: [{ type: 'level', heroId: 'leon', requiredLevel: 5 }],
      message
    }
  });
  assert.equal(result.allowed, false);
  assert.equal(result.replayFree, false);
  assert.equal(result.reasons[0].code, 'heroLevel');
  assert.deepEqual(result.missing, [{ type: 'level', heroId: 'leon', requiredLevel: 5 }]);
  assert.deepEqual(result.message, message);
});

test('a required character in reserve is refused and reported precisely', () => {
  const stage = {
    characterArc: { id: 'leon_personal', heroId: 'leon', allowAnchor: true }
  };
  const result = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    ownedHeroIds: owned,
    activeTeam: ['player_anchor', 'masterchief']
  });
  assert.equal(result.allowed, false);
  assert.equal(result.canonicalTeamRequired, true);
  assert.deepEqual(reasonCodes(result), [MISSION_ACCESS_REASON_CODES.ACTIVE_HERO_REQUIRED]);
  assert.equal(result.missing[0].status, 'reserve');
  assert.equal(result.missing[0].heroId, 'leon');
  assert.ok(result.suggestedTeam.includes('leon'));
  assert.ok(result.suggestedTeam.includes('player_anchor'));
  assert.match(result.message.fr, /Leon S\. Kennedy doit être dans la Cellule active/);

  const active = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['player_anchor', 'leon']
  });
  assert.equal(active.allowed, true);
  assert.deepEqual(active.reasons, []);
});

test('a trio accepts any order but requires exactly its three signatures', () => {
  const stage = {
    trioArc: {
      id: 'survival_trio',
      heroIds: ['ripley', 'leon', 'chell']
    }
  };
  const valid = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['chell', 'ripley', 'leon']
  });
  assert.equal(valid.allowed, true);

  const invalid = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    ownedHeroIds: owned,
    activeTeam: ['ripley', 'leon', 'player_anchor']
  });
  assert.equal(invalid.allowed, false);
  assert.deepEqual(reasonCodes(invalid), [
    MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INCOMPLETE,
    MISSION_ACCESS_REASON_CODES.EXACT_TEAM_FOREIGN
  ]);
  assert.deepEqual(invalid.missing.map(entry => entry.heroId), ['chell']);
  assert.deepEqual(invalid.suggestedTeam, ['ripley', 'leon', 'chell']);
  assert.match(invalid.message.en, /Incomplete trio: Chell is missing/);
});

test('oversized or malformed exact teams are blocked structurally', () => {
  const oversized = evaluateMissionAccess({
    requiredTeam: { type: 'exact', heroIds: ['ripley', 'leon', 'chell'] }
  }, {
    heroDb: HEROES,
    activeTeam: ['ripley', 'leon', 'chell', 'player_anchor']
  });
  assert.ok(reasonCodes(oversized).includes(MISSION_ACCESS_REASON_CODES.TEAM_SIZE_EXCEEDED));
  assert.ok(reasonCodes(oversized).includes(MISSION_ACCESS_REASON_CODES.EXACT_TEAM_FOREIGN));

  const malformed = evaluateMissionAccess({
    requiredTeam: { type: 'exact', heroIds: ['ripley', 'leon'] }
  }, {
    heroDb: HEROES,
    activeTeam: ['ripley', 'leon']
  });
  assert.equal(malformed.allowed, false);
  assert.ok(reasonCodes(malformed).includes(MISSION_ACCESS_REASON_CODES.EXACT_TEAM_INVALID));

  const reserved = autoComposeMissionTeam({
    requiredTeam: {
      type: 'exact',
      heroIds: ['ripley', 'leon', 'chell'],
      excludedHeroIds: ['leon']
    }
  }, {
    heroDb: HEROES,
    activeTeam: ['ripley', 'chell'],
    ownedHeroIds: owned
  });
  assert.equal(reserved.composed, false);
  assert.equal(reserved.team.includes('leon'), false);
  assert.deepEqual(reserved.missing, [{ type: 'reservedHero', heroId: 'leon' }]);
});

test('universe rules enforce minCount and reject every foreign signature', () => {
  const stage = {
    arcId: 'halo_arc',
    requiredTeam: { type: 'universe', universe: 'Halo', minCount: 3 }
  };
  const short = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['masterchief', 'arbiter']
  });
  assert.equal(short.allowed, false);
  assert.equal(short.missing[0].missingCount, 1);
  assert.match(short.message.fr, /3 signatures Halo.*2\/3/);

  const foreign = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['masterchief', 'arbiter', 'leon']
  });
  assert.deepEqual(reasonCodes(foreign), [
    MISSION_ACCESS_REASON_CODES.UNIVERSE_COUNT_REQUIRED,
    MISSION_ACCESS_REASON_CODES.UNIVERSE_FOREIGN_HERO
  ]);

  const valid = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['cortana', 'masterchief', 'arbiter']
  });
  assert.equal(valid.allowed, true);
});

test('the Anchor is accepted only by an explicit universe rule and never counts as its signature', () => {
  const oneHeroDb = [
    HEROES.find(hero => hero.id === 'player_anchor'),
    { id: 'solo', name: 'Solo', universe: 'Solo World' }
  ];
  const allowed = evaluateMissionAccess({
    universeArc: {
      id: 'solo_arc',
      universes: ['Solo World'],
      allowAnchor: true
    }
  }, {
    heroDb: oneHeroDb,
    activeTeam: ['player_anchor', 'solo']
  });
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.requiredTeam.minCount, 1);

  const forbidden = evaluateMissionAccess({
    requiredTeam: { type: 'universe', universe: 'Solo World', minCount: 1 }
  }, {
    heroDb: oneHeroDb,
    activeTeam: ['player_anchor', 'solo']
  });
  assert.equal(forbidden.allowed, false);
  assert.deepEqual(reasonCodes(forbidden), [MISSION_ACCESS_REASON_CODES.UNIVERSE_FOREIGN_HERO]);
});

test('universe evaluation blocks rather than inventing a roster when none is known', () => {
  const result = evaluateMissionAccess({
    requiredTeam: { type: 'universe', universe: 'Uncatalogued' }
  }, {
    heroDb: HEROES,
    activeTeam: []
  });
  assert.equal(result.allowed, false);
  assert.ok(reasonCodes(result).includes(MISSION_ACCESS_REASON_CODES.UNIVERSE_ROSTER_UNAVAILABLE));
});

test('source rules require one active hero per source and permit unrelated allies', () => {
  const stage = {
    fusionMission: { id: 'ring_and_gate', universes: ['Halo', 'Stargate'] }
  };
  const valid = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['masterchief', 'oneill', 'leon']
  });
  assert.equal(valid.allowed, true);

  const missing = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['masterchief', 'leon', 'player_anchor'],
    ownedHeroIds: owned
  });
  assert.equal(missing.allowed, false);
  assert.deepEqual(reasonCodes(missing), [MISSION_ACCESS_REASON_CODES.SOURCE_UNIVERSE_REQUIRED]);
  assert.deepEqual(missing.missing, [{ type: 'sourceUniverse', universe: 'Stargate' }]);
  assert.ok(missing.suggestedTeam.includes('masterchief'));
  assert.ok(missing.suggestedTeam.includes('oneill'));
  assert.match(missing.message.fr, /signature de Stargate/);
});

test('source rules ignore under-level representatives and auto-compose eligible reserves', () => {
  const stage = {
    arcId: 'levelled_sources',
    requiredTeam: { type: 'sources', sourceUniverses: ['Halo', 'Stargate'] }
  };
  const result = evaluateMissionAccess(stage, {
    heroDb: HEROES,
    activeTeam: ['masterchief', 'oneill', 'leon'],
    ownedHeroIds: owned,
    eligibleHeroIds: ['masterchief', 'sam_carter', 'leon']
  });

  assert.equal(result.allowed, false);
  assert.deepEqual(reasonCodes(result), [MISSION_ACCESS_REASON_CODES.SOURCE_UNIVERSE_REQUIRED]);
  assert.deepEqual(result.missing, [{ type: 'sourceUniverse', universe: 'Stargate' }]);
  assert.equal(result.canAutoCompose, true);
  assert.ok(result.suggestedTeam.includes('sam_carter'));
  assert.equal(result.suggestedTeam.indexOf('sam_carter') < result.suggestedTeam.indexOf('oneill'), true);
});

test('completedArcIds and arcReplayUnlockedIds grant free replay with any team', () => {
  const stage = {
    trioArc: { id: 'survival_trio', heroIds: ['ripley', 'leon', 'chell'] }
  };
  for (const replayState of [
    { completedArcIds: ['survival_trio'] },
    { arcReplayUnlockedIds: ['survival_trio'] }
  ]) {
    const result = evaluateMissionAccess(stage, {
      heroDb: HEROES,
      activeTeam: ['player_anchor', 'masterchief', 'oneill'],
      ...replayState
    });
    assert.equal(result.allowed, true);
    assert.equal(result.replayFree, true);
    assert.equal(result.canonicalTeamRequired, false);
    assert.deepEqual(result.reasons, []);
    assert.deepEqual(result.missing, []);
    assert.match(result.message.fr, /ARC TERMINÉ/);
  }

  const disabled = evaluateMissionAccess({
    arcId: 'manual',
    requiredTeam: {
      type: 'character',
      heroId: 'leon',
      freeReplayAfterArc: false
    }
  }, {
    heroDb: HEROES,
    activeTeam: ['player_anchor'],
    completedArcIds: ['manual']
  });
  assert.equal(disabled.allowed, false);
  assert.equal(disabled.replayFree, false);
});

test('missions without a canonical rule remain available after base access', () => {
  const result = evaluateMissionAccess({ id: 12, universe: 'Halo' }, {
    heroDb: HEROES,
    activeTeam: ['player_anchor'],
    baseAccess: true
  });
  assert.equal(result.allowed, true);
  assert.equal(result.requiredTeam, null);
  assert.deepEqual(result.reasons, []);
  assert.deepEqual(result.message, { fr: 'Mission disponible.', en: 'Mission available.' });
});

test('auto-compose is deterministic and preserves an explicitly allowed Anchor', () => {
  const universeStage = {
    universeArc: {
      id: 'solo_arc',
      universes: ['Solo World'],
      allowAnchor: true
    }
  };
  const heroDb = [
    HEROES.find(hero => hero.id === 'player_anchor'),
    { id: 'solo', name: 'Solo', universe: 'Solo World' }
  ];
  const context = {
    heroDb,
    ownedHeroIds: ['player_anchor', 'solo'],
    activeTeam: ['player_anchor']
  };
  const first = autoComposeMissionTeam(universeStage, context);
  const second = autoComposeMissionTeam(universeStage, context);
  assert.deepEqual(first, second);
  assert.equal(first.composed, true);
  assert.equal(first.preservedAnchor, true);
  assert.deepEqual(first.team, ['player_anchor', 'solo']);

  const sources = autoComposeMissionTeam({
    arcId: 'sources',
    requiredTeam: {
      type: 'sources',
      sourceUniverses: ['Halo', 'Stargate'],
      allowAnchor: true
    }
  }, {
    heroDb: HEROES,
    ownedHeroIds: owned,
    activeTeam: ['player_anchor', 'leon']
  });
  assert.equal(sources.composed, true);
  assert.equal(sources.preservedAnchor, true);
  assert.deepEqual(sources.team, ['player_anchor', 'arbiter', 'oneill']);
});

test('auto-compose reports impossible ownership and Anchor-capacity conflicts', () => {
  const exact = autoComposeMissionTeam({
    requiredTeam: { type: 'exact', heroIds: ['ripley', 'leon', 'chell'] }
  }, {
    heroDb: HEROES,
    ownedHeroIds: ['ripley'],
    activeTeam: ['ripley']
  });
  assert.equal(exact.composed, false);
  assert.deepEqual(exact.missing.map(entry => entry.heroId), ['leon', 'chell']);

  const capacityConflict = autoComposeMissionTeam({
    requiredTeam: {
      type: 'sources',
      sourceUniverses: ['Halo', 'Stargate', 'Alien'],
      allowAnchor: true
    }
  }, {
    heroDb: HEROES,
    ownedHeroIds: owned,
    activeTeam: ['player_anchor']
  });
  assert.equal(capacityConflict.composed, false);
  assert.equal(capacityConflict.preservedAnchor, true);
  assert.deepEqual(capacityConflict.team, ['player_anchor', 'arbiter', 'oneill']);
  assert.deepEqual(capacityConflict.missing, [{ type: 'sourceUniverse', universe: 'Alien' }]);
});

test('character auto-compose replaces a non-Anchor slot when the Anchor is allowed', () => {
  const result = autoComposeMissionTeam({
    arcId: 'leon_personal',
    requiredTeam: {
      type: 'character',
      heroId: 'leon',
      allowAnchor: true
    }
  }, {
    heroDb: HEROES,
    ownedHeroIds: owned,
    activeTeam: ['player_anchor', 'masterchief', 'oneill']
  });
  assert.equal(result.composed, true);
  assert.equal(result.preservedAnchor, true);
  assert.deepEqual(result.team, ['player_anchor', 'masterchief', 'leon']);
});
