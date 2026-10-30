import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createFixedStepClock } from '../src/game/fixedStepClock.js';
import { createSceneInputs, emptySceneAim } from '../src/game/sceneInputs.js';

const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const extinction = hub.slice(hub.indexOf('function ExtinctionRoyale('));
const between = (source, first, last) => {
  const start = source.indexOf(first);
  const end = source.indexOf(last, start + first.length);
  assert.ok(start >= 0 && end > start, `Missing component boundaries: ${first} / ${last}`);
  return source.slice(start + first.length, end);
};
const pauseEffects = between(extinction,
  '// Le menu pause du shell dedie gele la simulation et relache les mouvements.',
  '// Une sortie du mode n\'est acceptee qu\'apres la confirmation du menu pause.');
const shellEffect = between(pauseEffects, 'useEffect(() => {', '}, [sessionPaused]);');
const intelEffect = between(pauseEffects.slice(pauseEffects.indexOf('}, [sessionPaused]);') + '}, [sessionPaused]);'.length),
  'useEffect(() => {', '}, [intelOpen]);');
const clockInitialization = 'const clock = createFixedStepClock();' + between(extinction,
  'const clock = createFixedStepClock();', 'const renderFrame = (timestamp = performance.now()) => {');
// Execute the actual frame admission and fixed-step simulation. Canvas drawing
// is excluded, just as in extinctionTiming.test.mjs; no simulation is copied.
const simulationFrame = between(extinction,
  'const renderFrame = (timestamp = performance.now()) => {', '      ctx.save();');
const clockCleanup = between(extinction.slice(extinction.indexOf('const onClockVisibilityChange = () => clock.reset();')),
  'return () => {', '\n    };');

const makeState = () => ({
  phase: 'running', t: 0, hp: 100, armor: 0, wave: 1, zone: 1,
  muzzle: 12, reloadPulse: 18, dash: 30, scan: 0, turret: 0,
  skillCooldown: 180, hitMarkerTimer: 8, screenShake: 6,
  px: 0, py: 0, vx: 0, vy: 0, angle: 0, turnVel: 0,
  moveKeys: {}, loot: [],
  glitchZones: [{ wx: 0, wy: 0, r: 2.2, timer: 3 }],
  enemies: [{ kind: 'Traqueur', wx: 30, wy: 30, hp: 100, maxHp: 100, dmg: 0, speed: 0 }]
});

const makeHarness = () => {
  const state = makeState();
  const environment = {
    createFixedStepClock,
    simulationClockRef: { current: null },
    sessionPausedRef: { current: false },
    sessionPaused: false,
    intelOpen: false,
    intelRef: { current: false },
    document: { hidden: false, removeEventListener() {} },
    window: { requestAnimationFrame() { return 1; }, cancelAnimationFrame() {} },
    stateRef: { current: state },
    sceneInputsRef: { current: createSceneInputs(['forward', 'back', 'strafeLeft', 'strafeRight', 'turnLeft', 'turnRight']) },
    aimPointerRef: { current: emptySceneAim() },
    emptySceneAim,
    runMode: 'extraction',
    lang: 'en',
    selectedHero: { stats: { spd: 6 }, category: 'marine' },
    EXTINCTION_BEACON_TARGET: 3,
    EXTINCTION_INFESTATION_TARGET_FRAMES: 60 * 60,
    sound: { playSfx() {} },
    setRunSnapshot() {},
    buildRunSnapshot() { return {}; },
    buildEnemies() { return []; },
    buildLoot() { return []; },
    triggerEnemyDrop() {},
    projectWorld(enemy, current) { return { dist: Math.hypot(enemy.wx - current.px, enemy.wy - current.py) }; },
    finishRun(result) { state.phase = 'ended'; state.result = result; }
  };
  const execute = body => new Function(...Object.keys(environment), body)(...Object.values(environment));
  const setPause = (kind, value) => {
    if (kind === 'shell') {
      environment.sessionPaused = value;
      execute(shellEffect);
    } else {
      environment.intelOpen = value;
      // The real component updates intelRef during render before its effect.
      environment.intelRef.current = value;
      execute(intelEffect);
    }
  };
  const mountRenderer = () => execute(`
    ${clockInitialization}
    let rafId = 0;
    const loop = () => {};
    const onClockVisibilityChange = () => clock.reset();
    return {
      frame(timestamp) { ${simulationFrame} },
      dispose() { ${clockCleanup} }
    };
  `);
  return { state, setPause, mountRenderer };
};

const warmUp = (harness, renderer) => {
  renderer.frame(0);
  renderer.frame(20);
  assert.equal(harness.state.t, 1);
  assert.equal(harness.state.skillCooldown, 179);
};

const assertResume = (harness, renderer, timestamp, snapshot) => {
  renderer.frame(timestamp);
  assert.deepEqual(harness.state, snapshot, 'Resume must not consume paused time, damage, zone or cooldowns');
  renderer.frame(timestamp + 20);
  assert.equal(harness.state.t, snapshot.t + 1, 'Normal fixed-step simulation must resume after its new baseline');
  assert.equal(harness.state.skillCooldown, snapshot.skillCooldown - 1);
};

test('Extinction pause effects are safe before the first renderer mounts', () => {
  const harness = makeHarness();
  harness.setPause('shell', false);
  harness.setPause('intel', false);
  const renderer = harness.mountRenderer();
  const snapshot = structuredClone(harness.state);
  renderer.frame(500);
  assert.deepEqual(harness.state, snapshot);
  renderer.frame(520);
  assert.equal(harness.state.t, 1);
  renderer.dispose();
});

for (const kind of ['shell', 'intel']) {
  test(`Extinction ${kind} pause and resume discard elapsed time without a paused animation frame`, () => {
    const harness = makeHarness();
    const renderer = harness.mountRenderer();
    warmUp(harness, renderer);
    const snapshot = structuredClone(harness.state);
    harness.setPause(kind, true);
    // Browsers need not execute a RAF between these two real effect bodies.
    harness.setPause(kind, false);
    assertResume(harness, renderer, 520, snapshot);
    renderer.dispose();
  });
}

for (const firstClosed of ['shell', 'intel']) {
  test(`Extinction overlapping pauses stay frozen when ${firstClosed} closes first`, () => {
    const harness = makeHarness();
    const renderer = harness.mountRenderer();
    warmUp(harness, renderer);
    const snapshot = structuredClone(harness.state);
    harness.setPause('shell', true);
    harness.setPause('intel', true);
    renderer.frame(120);
    assert.deepEqual(harness.state, snapshot);
    harness.setPause(firstClosed, false);
    renderer.frame(320);
    assert.deepEqual(harness.state, snapshot, 'The remaining pause still owns the simulation');
    harness.setPause(firstClosed === 'shell' ? 'intel' : 'shell', false);
    assertResume(harness, renderer, 520, snapshot);
    renderer.dispose();
  });
}

test('Extinction renderer replacement keeps pause control attached to the current clock', () => {
  const harness = makeHarness();
  const previousRenderer = harness.mountRenderer();
  warmUp(harness, previousRenderer);
  const currentRenderer = harness.mountRenderer();
  currentRenderer.frame(100);
  currentRenderer.frame(120);
  // A stale cleanup cannot detach the replacement clock from later pauses.
  previousRenderer.dispose();
  const snapshot = structuredClone(harness.state);
  harness.setPause('shell', true);
  harness.setPause('shell', false);
  assertResume(harness, currentRenderer, 620, snapshot);
  currentRenderer.dispose();
});
