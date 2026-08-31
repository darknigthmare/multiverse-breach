import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createFixedStepClock } from '../src/game/fixedStepClock.js';

const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const extinction = hub.slice(hub.indexOf('function ExtinctionRoyale('));
const loopStart = extinction.indexOf('for (let step = 0; step < simulationSteps');
const simulationSource = extinction.slice(loopStart, extinction.indexOf('      ctx.save();', loopStart));
assert.ok(loopStart >= 0 && simulationSource.includes('state.t += 1;'));
// Execute the actual simulation block from the component; rendering is excluded.
const update = new Function('state', 'simulationSteps', 'finishRun', `
  const runMode = 'extraction', lang = 'en';
  const selectedHero = { stats: { spd: 6 }, category: 'marine' };
  const EXTINCTION_BEACON_TARGET = 3, EXTINCTION_INFESTATION_TARGET_FRAMES = 5400;
  const sound = { playSfx() {} };
  const setRunSnapshot = () => {}, buildRunSnapshot = () => ({});
  const buildEnemies = () => [], buildLoot = () => [], triggerEnemyDrop = () => {};
  const projectWorld = (enemy, current) => ({ dist: Math.hypot(enemy.wx - current.px, enemy.wy - current.py) });
  ${simulationSource}
`);

const makeState = () => ({
  phase: 'running', t: 0, hp: 10000, armor: 0, wave: 1, zone: 1,
  muzzle: 12, reloadPulse: 18, dash: 30, scan: 0, turret: 0,
  skillCooldown: 180, hitMarkerTimer: 8, screenShake: 6,
  px: 0, py: 0, vx: 0, vy: 0, angle: 0, turnVel: 0,
  moveKeys: { forward: true }, loot: [], glitchZones: [],
  enemies: [{ kind: 'Traqueur', wx: 30, wy: 30, hp: 100, maxHp: 100, dmg: 0, speed: 0 }]
});

const simulate = hz => {
  const clock = createFixedStepClock();
  const state = makeState();
  clock.advance(0);
  for (let frame = 1; frame <= hz * 3; frame++) {
    update(state, clock.advance(frame * 1000 / hz), result => { state.phase = 'ended'; state.result = result; });
  }
  return state;
};

test('actual Extinction movement, zone and cooldowns are identical at 30/60/120/144 Hz', () => {
  const expected = simulate(60);
  assert.equal(expected.t, 180);
  assert.equal(expected.skillCooldown, 0);
  assert.equal(expected.reloadPulse, 0);
  for (const hz of [30, 120, 144]) assert.deepEqual(simulate(hz), expected, `${hz} Hz`);
});

test('pause and tab visibility reset never advance Extinction damage or cooldowns', () => {
  const clock = createFixedStepClock();
  const state = makeState();
  clock.advance(0);
  update(state, clock.advance(20), () => {});
  const snapshot = structuredClone(state);
  update(state, clock.advance(800, { paused: true }), () => {});
  clock.reset();
  update(state, clock.advance(45000), () => {});
  assert.deepEqual(state, snapshot);
  assert.match(extinction, /const paused = sessionPausedRef\.current \|\| document\.hidden/);
  assert.match(extinction, /onClockVisibilityChange = \(\) => clock\.reset\(\)/);
});

test('simultaneous lethal damage and last-enemy death resolves defeat, with no extra catch-up ticks', () => {
  const state = makeState();
  state.hp = 0;
  state.enemies = [{ kind: 'Champion de Trame', hp: 0 }];
  let finishes = 0;
  update(state, 6, result => { finishes++; state.phase = 'ended'; state.result = result; });
  assert.equal(state.t, 1);
  assert.equal(state.result, 'defeat');
  assert.equal(finishes, 1);
});

test('dead enemies remain fixed and visibility/focus loss releases movement and aim', () => {
  const state = makeState();
  state.enemies.push({ kind: 'Traqueur', hp: 0, wx: 20, wy: 20, speed: 2 });
  update(state, 3, () => {});
  assert.equal(state.enemies[1].wx, 20);
  assert.equal(state.enemies[1].wy, 20);
  assert.match(extinction, /addEventListener\('blur', clearMovement\)/);
  assert.match(extinction, /const onVisibilityChange = \(\) => \{ if \(document.hidden\) clearMovement\(\); \}/);
  assert.match(extinction, /state\.moveKeys = \{\};[\s\S]*state\.vx = 0;[\s\S]*state\.turnVel = 0;/);
});
