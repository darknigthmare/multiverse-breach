import assert from 'node:assert/strict';
import test from 'node:test';
import { getExpandedStages, EXPANDED_UNIVERSES } from '../src/game/expandedUniverses.js';
import { EngineNonCombatTrial } from '../src/game/nonCombatTrial.js';
import { WAVE6_NON_COMBAT_OBJECTIVES, authoredWave6NonCombatStage } from '../src/game/wave6NonCombatObjectives.js';

const stages = getExpandedStages();
const expected = new Map([
  [34480, ['Deliver all three messenger bags.', 'collect']],
  [34481, ['Open the vertical route and reach the exit.', 'escape']],
  [34510, ['Open the hidden passages.', 'switches']],
  [34511, ['Place the artifacts, then reach the exit.', 'escape']],
  [34540, ['Complete the slalom course.', 'escape']],
  [34541, ['Stay behind cover without attacking.', 'survive']],
  [34550, ['Solve the court protocol puzzle.', 'switches']],
  [34551, ['Match the luggage to the guest rooms.', 'collect']],
  [34560, ['Activate the mechanisms in the correct order.', 'switches']],
  [34561, ['Follow the markers without being detected.', 'escape']]
]);
const engineFor = (id, width = 640, height = 360) => {
  const stage = stages.find(candidate => candidate.id === id);
  return new EngineNonCombatTrial(width, height, [{ id: 'runner', stats: { hp: 100 } }], stage.finalePolicy, { add() {} }, () => {}, () => {}, stage);
};

test('exactly ten stage objectives override heuristic language and boss-index routing', () => {
  assert.equal(Object.keys(WAVE6_NON_COMBAT_OBJECTIVES).length, 10);
  assert.equal(EXPANDED_UNIVERSES.flatMap(universe => universe.stageVariants || []).filter(stage => stage.stageObjectiveOverride).length, 10);
  assert.deepEqual(authoredWave6NonCombatStage('Untouched route', 'objectif original'), {
    name: 'Untouched route', nonCombat: true, objective: 'objectif original'
  });
  for (const [id, [english, type]] of expected) {
    const stage = stages.find(candidate => candidate.id === id);
    assert.ok(stage, String(id));
    assert.equal(stage.finalePolicy.objective.en, english, String(id));
    assert.notEqual(stage.finalePolicy.objective.fr, english, String(id));
    assert.deepEqual(stage.nonCombatTrial.objective, stage.finalePolicy.objective, String(id));
    assert.equal(stage.nonCombatTrial.type, type, String(id));
    assert.equal(stage.mode, 'Smash', String(id));
    assert.equal(stage.bossName, null, String(id));
    assert.deepEqual(stage.enemyRoster, [], String(id));
    assert.equal(stage.nonCombatTrial.objects.some(object => object.kind === 'target' || 'hp' in object || 'atk' in object), false);
  }
  const court = stages.find(stage => stage.id === 34550);
  assert.equal(court.finalePolicy.name, 'Le salon de 1695');
  assert.doesNotMatch(JSON.stringify(court.finalePolicy.objective), /Imperial|La Grande Histoire/);
});

test('delivery and luggage routes require three pickup/destination pairs, not shooting', () => {
  for (const id of [34480, 34551]) {
    const engine = engineFor(id);
    assert.equal(engine.objects.filter(object => object.kind === 'collectible').length, 3);
    assert.equal(engine.objects.filter(object => object.kind === 'checkpoint').length, 3);
    for (let index = 0; index < engine.objects.length; index += 2) {
      const pickup = engine.objects[index];
      const destination = engine.objects[index + 1];
      assert.equal(engine.isObjectLocked(destination), true);
      assert.equal(engine.applyObjectProgress(destination), false);
      assert.equal(engine.applyObjectProgress(pickup), true);
      assert.equal(engine.isObjectLocked(destination), false);
      assert.equal(engine.applyObjectProgress(destination), true);
    }
    assert.equal(engine.gameOver, true);
    assert.equal(engine.objectiveProgress, engine.objectiveTarget);
  }
});

test('the vertical route, artifacts, court protocol and traps respect their full order', () => {
  for (const id of [34481, 34511, 34550, 34560]) {
    const engine = engineFor(id);
    assert.equal(engine.trial.orderedObjects, true);
    assert.equal(engine.applyObjectProgress(engine.objects.at(-1)), false, `${id}: finale cannot skip the puzzle`);
    for (const object of engine.objects) assert.equal(engine.applyObjectProgress(object), true, `${id}/${object.id}`);
    assert.equal(engine.gameOver, true, String(id));
  }
  const artifacts = engineFor(34511);
  assert.equal(artifacts.objects.filter(object => object.id.startsWith('artifact-')).length, 3);
  assert.equal(artifacts.objects.at(-1).kind, 'extraction');
});

test('hidden passages use mechanisms and the slalom uses ordered neutral gates', () => {
  const passages = engineFor(34510);
  assert.equal(passages.objects.every(object => object.kind === 'switch'), true);
  const slalom = engineFor(34540);
  assert.equal(slalom.objects.every(object => object.kind === 'checkpoint'), true);
  assert.equal(slalom.isObjectLocked(slalom.objects[1]), true);
  for (const object of slalom.objects) assert.equal(slalom.applyObjectProgress(object), true);
  assert.equal(slalom.gameOver, true);
});

test('cover and quiet pursuit reject every attack entrypoint but allow defense and jumping', () => {
  for (const id of [34541, 34561]) {
    const engine = engineFor(id);
    assert.equal(engine.triggerMeleeAction('player', 'AttackLight'), false);
    assert.equal(engine.triggerMeleeAction('player', 'LedgeAttack'), false);
    assert.equal(engine.triggerMeleeAction('player', 'Special'), false);
    for (const action of ['simple', 'secondary', 'special']) assert.equal(engine.triggerAbility('player', action), false);
    assert.equal(engine.beginChargedMeleeAttack(), false);
    assert.equal(engine.releaseChargedMeleeAttack(), false);
    assert.equal(engine.triggerAbility('player', 'defense'), true);
    assert.equal(engine.triggerMeleeAction('player', 'Jump'), true);
    assert.equal(engine.objectiveProgress, 0);
  }
});

test('quiet pursuit detects an unguarded runner, throttles repeat detection and allows quiet completion', () => {
  const engine = engineFor(34561);
  const marker = engine.objects[0];
  assert.equal(engine.applyObjectProgress(marker), false);
  assert.equal(engine.mistakes, 1);
  assert.equal(engine.applyObjectProgress(marker), false);
  assert.equal(engine.mistakes, 1);
  assert.equal(engine.setMeleeShield('player', true), true);
  for (const object of engine.objects) assert.equal(engine.applyObjectProgress(object), true);
  assert.equal(engine.gameOver, true);
  const detected = engineFor(34561);
  for (let index = 0; index < detected.trial.mistakeLimit; index++) {
    detected.elapsedFrames = index * 60;
    assert.equal(detected.applyObjectProgress(detected.objects[0]), false);
  }
  assert.equal(detected.gameOver, true);
  assert.equal(detected.objectiveProgress, 0);
});

test('the survival objective needs time spent in actual cover, never attack progress', () => {
  for (const [width, height] of [[640, 360], [1040, 460]]) {
    const engine = engineFor(34541, width, height);
    const hero = engine.getActiveHero();
    const results = [];
    engine.onComplete = result => results.push(result);
    assert.equal(engine.objects.length, 1);
    assert.equal(engine.trial.requiredParticipationRatio, 0.9);
    for (let frame = 0; frame < engine.trial.durationFrames; frame++) {
      const dx = engine.objects[0].x - hero.x;
      assert.equal(engine.triggerAbility('player', 'special'), false);
      engine.update({ right: dx > 1.4, left: dx < -1.4 });
    }
    assert.deepEqual(results, ['victory'], `${width}: cover must be reachable without teleporting`);
    assert.ok(engine.participationFrames >= engine.requiredParticipationFrames);
    assert.equal(engine.elapsedFrames, engine.trial.durationFrames);
    assert.equal(engine.objectiveProgress, engine.objectiveTarget);
  }
  const idle = engineFor(34541, 1040, 460);
  const results = [];
  idle.onComplete = result => results.push(result);
  for (let frame = 0; frame < idle.trial.durationFrames && !idle.gameOver; frame++) idle.update({});
  assert.deepEqual(results, ['defeat'], 'staying at spawn outside the cover must not win');
  assert.equal(idle.participationFrames, 0);
});

test('the upper Shard passage is reachable by jumping, without attacking a checkpoint', () => {
  for (const [width, height] of [[640, 360], [1040, 460]]) {
    const engine = engineFor(34481, width, height);
    const hero = engine.getActiveHero();
    const lowerSwitch = engine.objects[0];
    const checkpoint = engine.objects[1];
    for (let frame = 0; frame < 600 && !checkpoint.completed; frame++) {
      const target = lowerSwitch.completed ? checkpoint : lowerSwitch;
      const dx = target.x - hero.x;
      engine.update({
        right: dx > 1.4,
        left: dx < -1.4,
        jump: lowerSwitch.completed && Math.abs(dx) <= 2.8 && hero.y >= engine.groundY - 1
      });
      if (!lowerSwitch.completed && Math.abs(lowerSwitch.x - hero.x) <= 2.8) {
        assert.equal(engine.triggerMeleeAction('player', 'AttackLight'), true);
      }
    }
    assert.equal(checkpoint.completed, true, `${width}: jumping must reach the upper passage`);
    assert.equal(engine.successfulInteractions, 2);
    assert.equal(engine.mistakes, 0);
    assert.equal(engine.gameOver, false);
  }
});

test('automated quiet pursuit guards and completes through actual frame updates', () => {
  for (const [width, height] of [[640, 360], [1040, 460]]) {
    const engine = engineFor(34561, width, height);
    const results = [];
    engine.onComplete = result => results.push(result);
    engine.autoBattle = true;
    for (let frame = 0; frame < engine.trial.timeLimitFrames && !engine.gameOver; frame++) engine.update({});
    assert.deepEqual(results, ['victory'], String(width));
    assert.equal(engine.mistakes, 0);
    assert.equal(engine.objects.every(object => object.completed), true);
    assert.equal(engine.getActiveHero().guardHeld, true);
  }
});

test('automated cover traversal cannot substitute interactions for survival time', () => {
  for (const [width, height] of [[640, 360], [1040, 460]]) {
    const engine = engineFor(34541, width, height);
    const results = [];
    engine.onComplete = result => results.push(result);
    engine.autoBattle = true;
    for (let frame = 0; frame < engine.trial.durationFrames && !engine.gameOver; frame++) engine.update({});
    assert.deepEqual(results, ['victory'], String(width));
    assert.equal(engine.elapsedFrames, 900);
    assert.ok(engine.participationFrames >= engine.requiredParticipationFrames);
    assert.equal(engine.successfulInteractions, 0);
  }
});

test('all ten authored routes finish with ordinary movement at both canvas resolutions', () => {
  const automaticKinds = new Set(['collectible', 'evidence', 'checkpoint', 'extraction']);
  for (const [width, height] of [[640, 360], [1040, 460]]) {
    for (const id of expected.keys()) {
      const engine = engineFor(id, width, height);
      const hero = engine.getActiveHero();
      const results = [];
      engine.onComplete = result => results.push(result);
      for (let frame = 0; frame < engine.trial.timeLimitFrames && !engine.gameOver; frame++) {
        const next = engine.objects.filter(object => !object.completed && !engine.isObjectLocked(object))
          .sort((left, right) => left.order - right.order)[0];
        if (!next) break;
        const dx = next.x - hero.x;
        engine.update({
          right: dx > 1.4,
          left: dx < -1.4,
          guard: Boolean(next.requiresGuard),
          jump: automaticKinds.has(next.kind) && Math.abs(dx) < 25 && hero.y >= engine.groundY - 1
        });
        // Operate mechanisms through the same input as a player; contact
        // objects must complete through movement, never direct progress calls.
        if (!automaticKinds.has(next.kind) && next.kind !== 'safety-zone' && !next.completed
          && Math.abs(next.x - hero.x) <= 2.8 && Math.hypot(next.x - hero.x, next.y - hero.y) <= 76) {
          engine.triggerMeleeAction('player', 'AttackLight');
        }
      }
      assert.deepEqual(results, ['victory'], `${id} at ${width}x${height}`);
      assert.equal(engine.mistakes, 0, `${id} at ${width}x${height}`);
    }
  }
});
