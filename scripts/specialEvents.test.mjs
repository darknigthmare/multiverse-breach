import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SPECIAL_EVENTS,
  buildSpecialEventStage,
  formatSpecialEventWindow,
  getActiveSpecialEvents,
  getSpecialEventWindow,
  isSpecialEventActive,
  recordSpecialEventResult
} from '../src/game/specialEvents.js';

test('the three seasonal events expose deterministic annual windows and playable stages', () => {
  assert.equal(SPECIAL_EVENTS.length, 3);
  assert.equal(new Set(SPECIAL_EVENTS.map(event => event.stage.stageId)).size, 3);
  SPECIAL_EVENTS.forEach(event => {
    assert.ok(event.schedule.start.month >= 1 && event.schedule.start.month <= 12);
    assert.ok(event.stage.mode);
    assert.ok(event.stage.bossName);
    assert.ok(event.stage.rewardItemId);
  });
});

test('Yautja Hunt is active inside its window and closed outside it', () => {
  const event = SPECIAL_EVENTS.find(candidate => candidate.id === 'yautja_hunt');
  assert.equal(isSpecialEventActive(event, new Date('2026-08-22T12:00:00Z')), true);
  assert.equal(isSpecialEventActive(event, new Date('2026-09-01T00:00:00Z')), false);
  assert.deepEqual(getActiveSpecialEvents(new Date('2026-08-22T12:00:00Z')).map(item => item.id), ['yautja_hunt']);
  assert.equal(formatSpecialEventWindow(event, 'fr', 2026), '15 août - 31 août');
});

test('a stage carries a season-specific completion id and deployment lock', () => {
  const event = SPECIAL_EVENTS.find(candidate => candidate.id === 'zone_404_week');
  const activeStage = buildSpecialEventStage(event, new Date('2026-04-02T12:00:00Z'));
  const closedStage = buildSpecialEventStage(event, new Date('2026-05-02T12:00:00Z'));
  assert.equal(activeStage.id, 'special:zone_404_week:2026');
  assert.equal(activeStage.missionDeployment.allowed, true);
  assert.equal(closedStage.missionDeployment.allowed, false);
  assert.equal(getSpecialEventWindow(event, 2026).seasonKey, 'zone_404_week:2026');
});

test('season progress records attempts, victories, first clear and best grade', () => {
  const event = SPECIAL_EVENTS.find(candidate => candidate.id === 'thousand_portals');
  const stage = buildSpecialEventStage(event, new Date('2026-10-30T12:00:00Z'));
  const defeated = recordSpecialEventResult({}, stage, { result: 'defeat', grade: 'C', at: '2026-10-30T12:00:00.000Z' });
  const cleared = recordSpecialEventResult(defeated, stage, { result: 'victory', grade: 'A', at: '2026-10-31T12:00:00.000Z' });
  assert.deepEqual(cleared['thousand_portals:2026'], {
    attempts: 2,
    victories: 1,
    firstClearedAt: '2026-10-31T12:00:00.000Z',
    bestGrade: 'A'
  });
});
