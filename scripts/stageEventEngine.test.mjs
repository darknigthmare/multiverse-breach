import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAuthoritativeStageEventSnapshot,
  createPreMatchLock,
  createStageEventRuntime,
  getPreMatchSnapshot,
  getStageEventDefinitions,
  getStageEventSnapshot,
  PRE_MATCH_LOCK_DURATION_MS,
  PRE_MATCH_STATES,
  restoreStageEventRuntime,
  serializeStageEventRuntime,
  skipPreMatchLock,
  STAGE_EVENT_DEFINITIONS,
  STAGE_EVENT_PHASES,
  tickPreMatchLock,
  tickStageEventRuntime,
  validateStageEventDefinition
} from '../src/game/melee/stageEventEngine.js';
import {
  resolveStageTopologyProfile,
  STAGE_EVENT_INTENSITIES,
  STAGE_TOPOLOGY_IDS,
  STAGE_VARIANTS
} from '../src/game/melee/stageTopologyCatalog.js';

const makePilotStage = (overrides = {}) => ({
  id: 'p5-alien-pilot',
  name: 'Hive pressure test',
  universe: 'Alien',
  stageVariant: STAGE_VARIANTS.lore,
  stageEventIntensity: STAGE_EVENT_INTENSITIES.full,
  ...overrides
});

const runForTicks = (runtime, ticks) => {
  const emissions = [];
  for (let tick = 0; tick < ticks; tick += 1) {
    emissions.push(...tickStageEventRuntime(runtime));
  }
  return emissions;
};

test('every authored event has a major telegraph, safe zones and bilingual counterplay', () => {
  Object.values(STAGE_EVENT_DEFINITIONS).flat().forEach(definition => {
    assert.deepEqual(validateStageEventDefinition(definition), [], definition.id);
    assert.ok(definition.telegraphMs >= 1000 && definition.telegraphMs <= 2500);
    assert.ok(definition.safeZones.length > 0);
    assert.ok(definition.counterplay.fr);
    assert.ok(definition.counterplay.en);
  });
});

test('same seed reproduces the exact event sequence independently of Math.random', () => {
  const stage = makePilotStage();
  const profile = resolveStageTopologyProfile(stage, 'hive_corridor');
  const first = createStageEventRuntime({ stage, arena: { id: 'hive_corridor' }, profile, seed: 'fixed-replay' });
  for (let index = 0; index < 100; index += 1) Math.random();
  const second = createStageEventRuntime({ stage, arena: { id: 'hive_corridor' }, profile, seed: 'fixed-replay' });

  runForTicks(first, 2400);
  for (let index = 0; index < 100; index += 1) Math.random();
  runForTicks(second, 2400);
  assert.deepEqual(first.sequence, second.sequence);
  assert.ok(first.sequence.length >= 4, 'replay did not exercise two lifecycle emissions');
});

test('different seeds produce a different but valid deterministic schedule', () => {
  const stage = makePilotStage();
  const profile = resolveStageTopologyProfile(stage, 'hive_corridor');
  const first = createStageEventRuntime({ stage, arena: { id: 'hive_corridor' }, profile, seed: 'route-a' });
  const second = createStageEventRuntime({ stage, arena: { id: 'hive_corridor' }, profile, seed: 'route-b' });
  runForTicks(first, 1800);
  runForTicks(second, 1800);
  assert.notDeepEqual(first.sequence, second.sequence);
  assert.ok(first.sequence.every(entry => ['telegraph', 'activate'].includes(entry.type)));
  assert.ok(second.sequence.every(entry => ['telegraph', 'activate'].includes(entry.type)));
});

test('authoritative StageEvent snapshots restore mid-telegraph and reject stale revisions', () => {
  const stage = makePilotStage();
  const profile = resolveStageTopologyProfile(stage, 'hive_corridor');
  const source = createStageEventRuntime({ stage, profile, seed: 'mp-stage-snapshot' });
  while (source.phase !== STAGE_EVENT_PHASES.telegraph) tickStageEventRuntime(source, 50);
  tickStageEventRuntime(source, 320);
  const serialized = serializeStageEventRuntime(source, { serverTick: 812, revision: 7 });
  const restored = restoreStageEventRuntime(serialized, { stage, profile });

  assert.ok(restored);
  assert.equal(restored.networkRevision, 7);
  assert.equal(restored.networkServerTick, 812);
  assert.deepEqual(getStageEventSnapshot(restored), getStageEventSnapshot({
    ...source,
    networkRevision: 7,
    networkServerTick: 812
  }));

  const sourceEmissions = [];
  const restoredEmissions = [];
  const deltas = Array.from({ length: 420 }, (_, index) => [16, 33, 50, 80][index % 4]);
  deltas.forEach(deltaMs => {
    sourceEmissions.push(...tickStageEventRuntime(source, deltaMs));
    restoredEmissions.push(...tickStageEventRuntime(restored, deltaMs));
  });
  assert.deepEqual(restoredEmissions, sourceEmissions);

  const newest = serializeStageEventRuntime(source, { serverTick: 1200, revision: 8 });
  assert.equal(applyAuthoritativeStageEventSnapshot(restored, newest), true);
  assert.equal(applyAuthoritativeStageEventSnapshot(restored, serialized), false, 'stale revision overwrote server state');
});

test('event lifecycle has no activation before the exact telegraph boundary', () => {
  const stage = makePilotStage();
  const runtime = createStageEventRuntime({
    stage,
    arena: { id: 'hive_corridor' },
    profile: resolveStageTopologyProfile(stage, 'hive_corridor'),
    seed: 'boundary'
  });
  const initialDelay = runtime.nextDelayMs;
  assert.deepEqual(tickStageEventRuntime(runtime, initialDelay - 1), []);
  const telegraph = tickStageEventRuntime(runtime, 1);
  assert.equal(telegraph.length, 1);
  assert.equal(telegraph[0].type, 'telegraph');
  assert.equal(runtime.phase, STAGE_EVENT_PHASES.telegraph);

  const definition = runtime.activeDefinition;
  assert.deepEqual(tickStageEventRuntime(runtime, definition.telegraphMs - 1), []);
  const activation = tickStageEventRuntime(runtime, 1);
  assert.equal(activation.length, 1);
  assert.equal(activation[0].type, 'activate');
  assert.equal(runtime.phase, STAGE_EVENT_PHASES.active);
});

test('Off and Competitive remain silent while Light is a subset of Full', () => {
  const offStage = makePilotStage({ stageEventIntensity: STAGE_EVENT_INTENSITIES.off });
  const competitiveStage = makePilotStage({
    stageVariant: STAGE_VARIANTS.competitive,
    stageEventIntensity: STAGE_EVENT_INTENSITIES.full
  });
  const transformingStage = makePilotStage({
    universe: 'Nexus de Convergence',
    meleeTopologyId: STAGE_TOPOLOGY_IDS.transformingEvent
  });
  const lightProfile = resolveStageTopologyProfile({
    ...transformingStage,
    stageEventIntensity: STAGE_EVENT_INTENSITIES.light
  }, 'absurd_party');
  const fullProfile = resolveStageTopologyProfile(transformingStage, 'absurd_party');

  const offRuntime = createStageEventRuntime({ stage: offStage, profile: resolveStageTopologyProfile(offStage, 'hive_corridor') });
  const competitiveRuntime = createStageEventRuntime({ stage: competitiveStage, profile: resolveStageTopologyProfile(competitiveStage, 'hive_corridor') });
  assert.equal(offRuntime.phase, STAGE_EVENT_PHASES.disabled);
  assert.equal(competitiveRuntime.phase, STAGE_EVENT_PHASES.disabled);
  assert.deepEqual(runForTicks(offRuntime, 3600), []);
  assert.deepEqual(runForTicks(competitiveRuntime, 3600), []);
  assert.ok(getStageEventDefinitions(lightProfile).length <= getStageEventDefinitions(fullProfile).length);
  assert.equal(getStageEventDefinitions(lightProfile)[0].effect, 'layout', 'Light transforming topology never transforms');

  const legacyDisabledStage = makePilotStage({ disableHazards: true });
  const legacyDisabledRuntime = createStageEventRuntime({
    stage: legacyDisabledStage,
    profile: resolveStageTopologyProfile(legacyDisabledStage, 'hive_corridor')
  });
  assert.equal(legacyDisabledRuntime.phase, STAGE_EVENT_PHASES.disabled);
});

test('layout transformations advertise the real main-line counterplay without a fake damage third', () => {
  const stage = makePilotStage({
    universe: 'Nexus de Convergence',
    meleeTopologyId: STAGE_TOPOLOGY_IDS.transformingEvent,
    stageEventIntensity: STAGE_EVENT_INTENSITIES.full
  });
  const runtime = createStageEventRuntime({
    stage,
    profile: resolveStageTopologyProfile(stage, 'absurd_party'),
    seed: 'layout-counterplay'
  });
  runtime.definitions = runtime.definitions.filter(definition => definition.effect === 'layout');
  runtime.nextDelayMs = 0;
  tickStageEventRuntime(runtime, 1);
  const snapshot = getStageEventSnapshot(runtime);
  assert.equal(snapshot.phase, STAGE_EVENT_PHASES.telegraph);
  assert.equal(snapshot.targetZone, null);
  assert.deepEqual(snapshot.safeZones, ['main-line']);
});

test('maxOccurrences is finite and stops the runtime after authored events complete', () => {
  const stage = makePilotStage();
  const runtime = createStageEventRuntime({
    stage,
    profile: resolveStageTopologyProfile(stage, 'hive_corridor'),
    seed: 'finite'
  });
  runForTicks(runtime, 6000);
  assert.equal(runtime.occurrences['predalien-inner-jaw'], 2);
  assert.equal(runtime.phase, STAGE_EVENT_PHASES.disabled);
});

test('PRE_MATCH_LOCK follows localized 3-second cues and unlocks once', () => {
  const stage = makePilotStage();
  const lock = createPreMatchLock({ stage });
  assert.equal(lock.state, PRE_MATCH_STATES.locked);
  assert.equal(getPreMatchSnapshot(lock, stage, 'fr').cueId, 'coordinates');
  tickPreMatchLock(lock, 1000);
  assert.equal(getPreMatchSnapshot(lock, stage, 'en').cueId, '3');
  tickPreMatchLock(lock, 700);
  assert.equal(getPreMatchSnapshot(lock, stage, 'fr').cueId, '2');
  tickPreMatchLock(lock, 700);
  assert.equal(getPreMatchSnapshot(lock, stage, 'fr').cueId, '1');
  tickPreMatchLock(lock, 600);
  assert.equal(lock.elapsedMs, PRE_MATCH_LOCK_DURATION_MS);
  assert.equal(lock.state, PRE_MATCH_STATES.active);
  assert.equal(getPreMatchSnapshot(lock, stage, 'en').cue, 'BREACH!');
  assert.equal(tickPreMatchLock(lock, 1000), false);
  assert.equal(lock.elapsedMs, PRE_MATCH_LOCK_DURATION_MS);
});

test('pre-match skip is training-only and server elapsed time is authoritative', () => {
  const standard = createPreMatchLock({ stage: makePilotStage() });
  const trainingStage = makePilotStage({ customBattle: { difficulty: 'training' } });
  const training = createPreMatchLock({ stage: trainingStage });
  assert.equal(skipPreMatchLock(standard), false);
  assert.equal(skipPreMatchLock(training), true);
  assert.equal(training.state, PRE_MATCH_STATES.active);

  const clientA = createPreMatchLock({ stage: makePilotStage() });
  const clientB = createPreMatchLock({ stage: makePilotStage() });
  tickPreMatchLock(clientA, 16, 2400);
  tickPreMatchLock(clientB, 33, 2400);
  assert.deepEqual(clientA, clientB);
  tickPreMatchLock(clientA, 16, 3000);
  tickPreMatchLock(clientB, 33, 3000);
  assert.equal(clientA.state, PRE_MATCH_STATES.active);
  assert.equal(clientB.state, PRE_MATCH_STATES.active);
  tickPreMatchLock(clientA, 16, 1200);
  assert.equal(clientA.elapsedMs, 1200, 'authoritative server clock could not rewind an advanced client');
  assert.equal(clientA.state, PRE_MATCH_STATES.locked);
});

test('PRE_MATCH_LOCK uses elapsed milliseconds rather than assuming a display refresh rate', () => {
  const highRefresh = createPreMatchLock({ stage: makePilotStage() });
  const lowRefresh = createPreMatchLock({ stage: makePilotStage() });
  for (let frame = 0; frame < 360; frame++) tickPreMatchLock(highRefresh, 1000 / 120);
  for (let frame = 0; frame < 90; frame++) tickPreMatchLock(lowRefresh, 1000 / 30);
  assert.equal(highRefresh.state, PRE_MATCH_STATES.active);
  assert.equal(lowRefresh.state, PRE_MATCH_STATES.active);
  assert.equal(highRefresh.elapsedMs, PRE_MATCH_LOCK_DURATION_MS);
  assert.equal(lowRefresh.elapsedMs, PRE_MATCH_LOCK_DURATION_MS);
});
