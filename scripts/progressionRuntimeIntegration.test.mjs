import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  FACTION_RULES,
  applyFactionBonuses,
  resolveUniverseFactionIds
} from '../src/game/factionProgression.js';
import {
  SPECIAL_EVENTS,
  buildSpecialEventStage,
  getActiveSpecialEvents,
  getSpecialEventRewardById
} from '../src/game/specialEvents.js';

const read = relativePath => readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const appSource = read('../src/App.jsx');
const gameCanvasSource = read('../src/components/GameCanvas.jsx');
const hubSource = read('../src/components/HubScreen.jsx');

const BASE_RULE_TEAMS = Object.freeze({
  sci_fi: ['Halo', 'Stargate'],
  horror: ['Resident Evil', 'Silent Hill'],
  cyber: ['The Matrix', 'Portal'],
  arcane: ['Harry Potter', 'Yu-Gi-Oh'],
  tactical: ['Metal Gear', 'Payday'],
  apocalypse: ['Mad Max', 'Fallout']
});

test('real combat consumes all 22 faction contracts and saved reputation passives', () => {
  assert.equal(FACTION_RULES.length, 22);
  assert.match(gameCanvasSource, /FACTION_RULES, applyFactionBonuses/);
  assert.doesNotMatch(gameCanvasSource, /const FACTION_RULES = \[/);
  assert.match(gameCanvasSource, /reputationProgress = \{\}/);
  assert.match(appSource, /reputationProgress=\{activityProgress\.reputationProgress\}/);

  const baseStats = { hp: 100, atk: 100, def: 100, spd: 100 };
  for (const rule of FACTION_RULES) {
    const teamUniverses = rule.base ? BASE_RULE_TEAMS[rule.id] : ['Nexus de Convergence', 'Halo'];
    const heroUniverse = teamUniverses[0];
    const stage = rule.base ? { universe: heroUniverse } : { universe: heroUniverse, arcId: rule.arcIds[0] };
    const result = applyFactionBonuses(baseStats, {
      teamUniverses,
      heroUniverse,
      stage,
      reputationProgress: {}
    });
    assert.ok(result.activeRules.some(activeRule => activeRule.id === rule.id), `inactive runtime faction rule: ${rule.id}`);
    assert.ok(result.stats[rule.stat] > baseStats[rule.stat], `missing runtime stat effect: ${rule.id}`);
  }

  const withoutReputation = applyFactionBonuses(baseStats, {
    teamUniverses: ['Halo', 'Stargate'],
    heroUniverse: 'Halo',
    stage: { universe: 'Halo' },
    reputationProgress: {}
  }).stats;
  const withReputation = applyFactionBonuses(baseStats, {
    teamUniverses: ['Halo', 'Stargate'],
    heroUniverse: 'Halo',
    stage: { universe: 'Halo' },
    reputationProgress: {
      nexus_alliance: { xp: 1100 },
      archivists: { xp: 1100 },
      free_fractures: { xp: 1100 },
      broken_throne: { xp: 1100 },
      erased: { xp: 1100 }
    }
  }).stats;
  assert.ok(Object.keys(baseStats).some(stat => withReputation[stat] > withoutReputation[stat]));
});

test('unclassified universes do not activate a narrative faction rule by fallback', () => {
  assert.deepEqual(resolveUniverseFactionIds('Dino Crisis'), []);
  assert.deepEqual(resolveUniverseFactionIds('Half-Life'), []);
  const result = applyFactionBonuses({ hp: 100, atk: 100, def: 100, spd: 100 }, {
    teamUniverses: ['Dino Crisis', 'Half-Life'],
    heroUniverse: 'Dino Crisis',
    stage: { universe: 'Dino Crisis' },
    reputationProgress: {}
  });
  assert.deepEqual(result.activeRules, []);
  assert.deepEqual(result.stats, { hp: 100, atk: 100, def: 100, spd: 100 });
});

test('every seasonal reward resolves to a mechanical item rendered by Hub inventory', () => {
  const rewardIds = SPECIAL_EVENTS.map(event => event.stage.rewardItemId);
  assert.equal(new Set(rewardIds).size, 3);
  rewardIds.forEach(rewardId => {
    const reward = getSpecialEventRewardById(rewardId);
    assert.ok(reward, `missing seasonal reward catalog entry: ${rewardId}`);
    assert.equal(reward.rewardOnly, true);
    assert.ok(Object.values(reward.boost).some(value => Number(value) > 0));
  });
  assert.match(hubSource, /getSpecialEventRewardById\(baseId\)/);
  assert.match(hubSource, /visibleGearItems\.map/);
  assert.match(gameCanvasSource, /getSpecialEventRewardById\(baseGearId\)/);
});

test('season selection and launch share the titleDayKey-derived date at boundaries', () => {
  assert.doesNotMatch(appSource, /getActiveSpecialEvents\(new Date\(\)\)/);
  assert.doesNotMatch(appSource, /buildSpecialEventStage\(event, new Date\(\)\)/);
  assert.match(appSource, /getProgressKeys\(titleEventDate\)/);
  assert.match(appSource, /getActiveSpecialEvents\(titleEventDate\)/);
  assert.match(appSource, /buildSpecialEventStage\(event, titleEventDate\)/);

  const titleEventDate = new Date(Date.UTC(2026, 9, 24, 12));
  const activeEvent = getActiveSpecialEvents(titleEventDate).find(event => event.id === 'thousand_portals');
  assert.ok(activeEvent);
  assert.equal(buildSpecialEventStage(activeEvent, titleEventDate).missionDeployment.allowed, true);

  const previousTitleDay = new Date(Date.UTC(2026, 9, 23, 12));
  assert.equal(getActiveSpecialEvents(previousTitleDay).some(event => event.id === 'thousand_portals'), false);
});

test('save migration removes the legacy kart key only after the integrated save is written', () => {
  const loadSaveSource = appSource.slice(
    appSource.indexOf('const loadSave ='),
    appSource.indexOf('const saveGame =')
  );
  assert.doesNotMatch(loadSaveSource, /removeItem\(LEGACY_KART_CAREER_KEY\)/);
  const saveGameSource = appSource.slice(
    appSource.indexOf('const saveGame ='),
    appSource.indexOf('const appendUnique =')
  );
  const mainSaveWrite = saveGameSource.indexOf('localStorage.setItem(SAVE_KEY');
  const legacyRemoval = saveGameSource.indexOf('localStorage.removeItem(LEGACY_KART_CAREER_KEY)');
  assert.ok(mainSaveWrite >= 0);
  assert.ok(legacyRemoval > mainSaveWrite);
  assert.match(saveGameSource, /payload\?\.portalCollection\?\.raceCareer/);
});

test('seasonal mission narrative consumes its authored intro, outro and defeat fallback', () => {
  const narrativeSource = appSource.slice(
    appSource.indexOf('const getMissionNarrative ='),
    appSource.indexOf('function MissionNarrativeScreen')
  );
  assert.match(narrativeSource, /if \(stage\.specialEventId\)/);
  assert.match(narrativeSource, /stage\.intro/);
  assert.match(narrativeSource, /stage\.outro/);
  assert.match(narrativeSource, /without granting the seasonal reward/);
});
