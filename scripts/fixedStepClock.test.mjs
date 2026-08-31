import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFixedStepClock } from '../src/game/fixedStepClock.js';

const simulate = (refreshRate, speed = 1) => {
  const clock = createFixedStepClock();
  let steps = clock.advance(0, { speed });
  for (let frame = 1; frame <= refreshRate * 10; frame += 1) {
    steps += clock.advance(frame * 1000 / refreshRate, { speed });
  }
  return steps;
};

test('combat advances equally on 30, 60, 120 and 144 Hz displays', () => {
  for (const rate of [30, 60, 120, 144]) {
    assert.equal(simulate(rate), 600, `${rate} Hz`);
    assert.equal(simulate(rate, 2), 1200, `${rate} Hz at double speed`);
  }
});

test('pause and background suspension never produce catch-up attacks', () => {
  const clock = createFixedStepClock();
  assert.equal(clock.advance(0), 0);
  assert.equal(clock.advance(20), 1);
  assert.equal(clock.advance(500, { paused: true }), 0);
  assert.equal(clock.advance(520), 1);
  assert.equal(clock.advance(10000), 0);
  assert.equal(clock.advance(10020), 1);
  clock.reset();
  assert.equal(clock.advance(50000), 0);
});

test('invalid time, clock rollback and lag remain bounded', () => {
  const clock = createFixedStepClock();
  assert.equal(clock.advance(NaN), 0);
  assert.equal(clock.advance(100), 0);
  assert.equal(clock.advance(50), 0);
  assert.equal(clock.advance(550, { speed: 2 }), 12);
  assert.equal(clock.advance(550), 0);
});

const componentSource = name => readFileSync(new URL(`../src/components/${name}.jsx`, import.meta.url), 'utf8');
const runComponentTransition = (body, environment) => new Function(...Object.keys(environment), body)(...Object.values(environment));
const transitionEnvironment = clock => ({
  simulationClockRef: { current: clock }, sessionPausedRef: { current: false }, sessionPaused: false,
  document: { hidden: false }, engineRef: { current: { setPaused() {} } },
  inputRef: { current: {} }, keysRef: { current: {} }, keyPulseRef: { current: {} },
  tacticsCameraPointerRef: { current: {} }, suppressTacticsClickRef: { current: false },
  clearMeleeControls() {}, clearMeleeInput() {}, clearInputs() {}
});

for (const component of ['GameCanvas', 'FighterMode', 'RaceMode']) {
  test(`${component} visibility transitions discard hidden time even when no RAF runs`, () => {
    const source = componentSource(component);
    const handler = source.match(/const (?:handleVisibilityChange|onVisibilityChange) = \(\) => \{([\s\S]*?)\n    \};/);
    assert.ok(handler, 'missing visibility handler');
    assert.match(source, /simulationClockRef\.current = simulationClock/);
    assert.match(source, /if \(simulationClockRef\.current === simulationClock\) simulationClockRef\.current = null/);
    for (const speed of [1, 2]) {
      const clock = createFixedStepClock();
      const environment = transitionEnvironment(clock);
      clock.advance(0, { speed });
      clock.advance(20, { speed });
      // No advance({paused:true}) occurs: browsers normally suppress hidden RAF.
      environment.document.hidden = true;
      runComponentTransition(handler[1], environment);
      environment.document.hidden = false;
      runComponentTransition(handler[1], environment);
      const impactTicksRemaining = 6;
      assert.equal(impactTicksRemaining - clock.advance(520, { speed }), impactTicksRemaining, 'pending hit fired on resume');
      assert.equal(clock.advance(540, { speed }), speed);
    }
  });

  test(`${component} shell pause and resume reset elapsed time without reconstructing the engine`, () => {
    const source = componentSource(component);
    const effect = source.match(/useEffect\(\(\) => \{\s*(sessionPausedRef\.current = sessionPaused;[\s\S]*?)\}, \[sessionPaused\]\);/);
    assert.ok(effect, 'missing shell pause effect');
    const clock = createFixedStepClock();
    const environment = transitionEnvironment(clock);
    const sameEngine = environment.engineRef.current;
    clock.advance(0);
    clock.advance(20);
    environment.sessionPaused = true;
    runComponentTransition(effect[1], environment);
    environment.sessionPaused = false;
    runComponentTransition(effect[1], environment);
    assert.equal(environment.engineRef.current, sameEngine);
    assert.equal(clock.advance(520), 0);
    assert.equal(clock.advance(540), 1);
  });
}

test('RPG targeting wait transitions also reset the clock independently of the shell pause', () => {
  const source = componentSource('GameCanvas');
  assert.match(source, /const rpgTargetingPaused = Boolean\(rpgTargeting && rpgTargetingWait\)/);
  const effect = source.match(/useEffect\(\(\) => \{\s*(simulationClockRef\.current\?\.reset\(\);)\s*\}, \[rpgTargetingPaused\]\);/);
  assert.ok(effect);
  const clock = createFixedStepClock();
  clock.advance(0);
  clock.advance(20);
  runComponentTransition(effect[1], transitionEnvironment(clock));
  assert.equal(clock.advance(520), 0);
});
