import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canLaunchPreparedMission,
  getPreparedMissionCompletionScreen,
  getPreparedMissionLaunchScreen,
  isArcReplayProgressionBypassed,
  isFirstClearMissionVictory,
  isFreeMissionReplay,
  shouldGrantFirstClearMissionReward
} from '../src/game/missions/missionReplayPolicy.js';

test('an invalid prepared deployment cannot bypass the App guard', () => {
  assert.equal(canLaunchPreparedMission({ missionDeployment: { allowed: false } }), false);
  assert.equal(canLaunchPreparedMission({ missionDeployment: { allowed: true } }), true);
  assert.equal(canLaunchPreparedMission({}), true);
});

test('free replay goes straight to battle and returns straight to the Hub', () => {
  const replayStage = { missionDeployment: { allowed: true, replayFree: true } };
  assert.equal(isFreeMissionReplay(replayStage), true);
  assert.equal(getPreparedMissionLaunchScreen(replayStage), 'battle');
  assert.equal(getPreparedMissionCompletionScreen(replayStage), 'hub');

  const firstClearStage = { missionDeployment: { allowed: true, replayFree: false } };
  assert.equal(getPreparedMissionLaunchScreen(firstClearStage), 'missionIntro');
  assert.equal(getPreparedMissionCompletionScreen(firstClearStage), 'missionOutro');
});

test('special mission rewards are granted only on first clear', () => {
  assert.equal(shouldGrantFirstClearMissionReward(true, 'arc_trace'), true);
  assert.equal(shouldGrantFirstClearMissionReward(false, 'arc_trace'), false);
  assert.equal(shouldGrantFirstClearMissionReward(true, ''), false);
});

test('legacy completed arcs bypass newly projected phase progression', () => {
  const legacyFinal = {
    id: 40_000,
    arcId: 'legacy_universe_arc',
    previousArcStageId: 46_000,
    universeArc: { id: 'legacy_universe_arc', universes: ['A', 'B'] },
    requiredTeam: { type: 'sources', sourceUniverses: ['A', 'B'], freeReplayAfterArc: true }
  };
  assert.equal(isArcReplayProgressionBypassed(legacyFinal, {
    completedArcIds: ['legacy_universe_arc']
  }), true);
  assert.equal(isArcReplayProgressionBypassed(legacyFinal), false);
});

test('free replay victories never regain first-clear bonuses', () => {
  const replayStage = {
    id: 46_000,
    missionDeployment: { allowed: true, replayFree: true }
  };
  assert.equal(isFirstClearMissionVictory('victory', replayStage, []), false);
  assert.equal(isFirstClearMissionVictory('victory', {
    id: 46_000,
    missionDeployment: { allowed: true, replayFree: false }
  }, []), true);
});

test('optional trials never inflate campaign first-clear progression', () => {
  assert.equal(isFirstClearMissionVictory('victory', {
    id: 810_000_001,
    optionalTrial: true,
    countsTowardCampaign: false
  }, []), false);
});
