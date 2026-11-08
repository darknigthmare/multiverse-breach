import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseAst } from 'rolldown/parseAst';
import * as directives from '../src/game/extinctionFieldDirectives.js';
import { createExtinctionRelayOperation, interactExtinctionRelayOperation, tickExtinctionRelayOperation } from '../src/game/extinctionRelayOperation.js';
import { damageExtinctionEnemy, clearExtinctionProtocolEffects } from '../src/game/extinctionSignatures.js';
import { clearNexusFieldOperation, getNexusFieldRunProof } from '../src/game/nexusFieldOperation.js';
import { applyExtinctionReport } from '../src/game/immersiveHubState.js';
import { emptySceneAim } from '../src/game/sceneInputs.js';

const make = (mode = 'last_signal', enabled = true) => {
  const state = { runId: 'field-test', heroId: 'arca_mirelle', runMode: mode, phase: 'running', lang: 'fr',
    t: 0, px: 0, py: 0, angle: 0, hp: 100, maxHp: 100, wave: 1, kills: 0,
    enemies: [], loot: [], beaconsStabilized: 0, ammo: 24, reserveAmmo: 72, rewards: null };
  state.fieldDirective = directives.createExtinctionFieldDirective(state, { enabled, mode }); return state;
};
const tick = (state, count) => { for (let i = 0; i < count; i++) { state.t += 1; directives.tickExtinctionFieldDirective(state); } };
const secure = (state, index) => {
  const marker = state.fieldDirective.markers[index];
  state.px = marker.wx; state.py = marker.wy;
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'started');
  tick(state, 120);
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'secured');
};
const boss = (wx = 0, wy = 5) => ({ id: 'champion', kind: 'Champion de Trame', wx, wy, hp: 500, maxHp: 500, size: 1.55 });

test('disabled rules leave all four legacy modes unchanged and never create rewards or consume randomness', () => {
  for (const mode of ['extraction', 'last_signal', 'infestation', 'hunt']) {
    const state = make(mode, false), before = structuredClone(state);
    directives.tickExtinctionFieldDirective(state);
    assert.equal(directives.getExtinctionDirectiveTarget(state), null);
    assert.equal(directives.getExtinctionFieldDirectiveStatus(state), null);
    assert.equal(directives.canAdvanceExtinctionDirectiveWave(state), true);
    assert.equal(directives.canCompleteExtinctionFieldDirective(state), true);
    assert.equal(directives.canDamageExtinctionDirectiveEnemy(state, boss()), true);
    assert.deepEqual(state, before);
  }
});

test('Extraction keeps its actual three-second relay rule and gains the same radar bearing as other modes', () => {
  const state = make('extraction');
  state.loot = [{ id: 'beacon-1', wave: 1, type: 'beacon', wx: 0, wy: 5 }]; state.py = 5;
  let operation = createExtinctionRelayOperation({ enabled: true, runId: state.runId, mode: 'extraction' });
  operation = interactExtinctionRelayOperation(operation, state, state.loot[0]).operation;
  for (let i = 0; i < 180; i++) { state.t++; operation = tickExtinctionRelayOperation(operation, state); }
  assert.equal(interactExtinctionRelayOperation(operation, state, state.loot[0]).allowCollect, true);
  assert.equal(state.rewards, null); assert.equal(state.beaconsStabilized, 0);
  const point = directives.getExtinctionRadarPoint({ px: 0, py: 0, angle: 0 }, state.loot[0], 42);
  assert.equal(point.x, 0); assert.ok(point.y < 0);
});

test('Last Signal needs one real terminal per wave, 120 distinct ticks and final confirmation before advancing', () => {
  const state = make();
  assert.equal(directives.canCompleteExtinctionFieldDirective(state), false);
  for (let wave = 1; wave <= 4; wave++) {
    state.wave = wave;
    assert.equal(directives.canAdvanceExtinctionDirectiveWave(state), false);
    secure(state, wave - 1);
    assert.equal(directives.canAdvanceExtinctionDirectiveWave(state), true);
    assert.equal(directives.getExtinctionFieldDirectiveStatus(state).completed, wave);
  }
  assert.equal(directives.canCompleteExtinctionFieldDirective(state), false, 'four signals do not replace the actual Champion fight');
  state.wave = 5; state.enemies = [boss()]; damageExtinctionEnemy(state, state.enemies[0], 1000);
  assert.equal(directives.canCompleteExtinctionFieldDirective(state), true);
  assert.equal(state.kills, 1); assert.equal(state.ammo, 24); assert.equal(state.rewards, null);
});

test('holding suspends outside the perimeter or near live enemies, and confirmation cannot skip a tick', () => {
  const state = make(), marker = state.fieldDirective.markers[0];
  state.px = marker.wx; state.py = marker.wy;
  state.enemies = [{ ...boss(marker.wx, marker.wy), kind: 'Traqueur' }];
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'contested');
  state.enemies[0].hp = 0;
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'started');
  tick(state, 119); assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'holding');
  const before = marker.ticks; directives.tickExtinctionFieldDirective(state); assert.equal(marker.ticks, before);
  state.py += 2; tick(state, 80); assert.equal(marker.ticks, 119);
  state.py = marker.wy; state.enemies[0].hp = 20; tick(state, 80); assert.equal(marker.ticks, 119);
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'contested');
  state.enemies[0].hp = 0; tick(state, 1); assert.equal(marker.status, 'ready');
  assert.equal(directives.canAdvanceExtinctionDirectiveWave(state), false);
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'secured');
  assert.equal(directives.interactExtinctionFieldDirective(state).activated, false);
});

test('a skipped time value earns one tick only; paused, ended, dead and foreign owners cannot progress or interact', () => {
  const state = make(), marker = state.fieldDirective.markers[0]; state.px = marker.wx; state.py = marker.wy;
  directives.interactExtinctionFieldDirective(state); state.t += 600; directives.tickExtinctionFieldDirective(state);
  assert.equal(marker.ticks, 1);
  for (const patch of [{ paused: true }, { phase: 'ended' }, { hp: 0 }, { heroId: 'foreign' }, { runId: 'foreign' }, { runMode: 'hunt' }]) {
    const copy = structuredClone(state); Object.assign(copy, patch); const before = structuredClone(copy.fieldDirective);
    tick(copy, 240); assert.deepEqual(copy.fieldDirective, before);
    assert.equal(directives.interactExtinctionFieldDirective(copy).activated, false);
    assert.equal(directives.canCompleteExtinctionFieldDirective(copy), false);
  }
});

test('Infestation opens three distinct vents at 10/25/40 seconds and requires all three at the 60-second exit', () => {
  const state = make('infestation'), points = state.fieldDirective.markers;
  state.px = points[0].wx; state.py = points[0].wy;
  assert.equal(directives.getExtinctionDirectiveTarget(state), null); tick(state, 599);
  assert.equal(directives.interactExtinctionFieldDirective(state).reason, 'out_of_range');
  tick(state, 1); secure(state, 0);
  assert.equal(directives.getExtinctionDirectiveSpeedFactor(state, { wx: points[0].wx, wy: points[0].wy }), 0.65);
  assert.equal(directives.getExtinctionDirectiveSpeedFactor(state, { wx: 30, wy: 30 }), 1);
  assert.equal(directives.canCompleteExtinctionFieldDirective(state), false);
  tick(state, 1500 - state.t); secure(state, 1);
  tick(state, 3600 - state.t);
  assert.equal(directives.canCompleteExtinctionFieldDirective(state), false, '60 seconds alone cannot bypass the optional directive');
  secure(state, 2); assert.equal(directives.canCompleteExtinctionFieldDirective(state), true);
  assert.equal(directives.getExtinctionFieldDirectiveStatus(state).completed, 3);
});

test('Hunt marking requires aim and range; only four active seconds expose the exact Champion, never its drones shield', () => {
  const state = make('hunt'), target = boss(); state.enemies = [target];
  assert.equal(damageExtinctionEnemy(state, target, 50), 0);
  state.angle = Math.PI; assert.equal(directives.markExtinctionHuntTarget(state).reason, 'aim_required');
  state.angle = 0; state.py = -8; assert.equal(directives.markExtinctionHuntTarget(state).reason, 'aim_required');
  state.py = 0; assert.equal(directives.markExtinctionHuntTarget(state).reason, 'marked');
  assert.equal(damageExtinctionEnemy(state, target, 50), 50);
  tick(state, 120); assert.equal(directives.markExtinctionHuntTarget(state).reason, 'already_marked');
  assert.equal(state.fieldDirective.markTicks, 120);
  state.paused = true; tick(state, 500); assert.equal(state.fieldDirective.markTicks, 120);
  state.paused = false; tick(state, 120); assert.equal(damageExtinctionEnemy(state, target, 50), 0);
  assert.equal(directives.markExtinctionHuntTarget(state).reason, 'marked');
  target.shieldActive = true; const drone = { ...boss(2, 3), id: 'drone', kind: 'Drone Protecteur', hp: 24 }; state.enemies.push(drone);
  assert.equal(damageExtinctionEnemy(state, target, 900), 0);
  damageExtinctionEnemy(state, drone, 24); assert.ok(damageExtinctionEnemy(state, target, 900) > 0);
  assert.equal(state.kills, 2); assert.equal(damageExtinctionEnemy(state, target, 900), 0);
});

test('radar uses forward-up and player heading, clamps distant objectives and drawing changes no gameplay', () => {
  const state = make('infestation'); state.t = 600;
  const front = directives.getExtinctionRadarPoint(state, { wx: 0, wy: 10 }, 42);
  assert.equal(front.x, 0); assert.ok(front.y < 0);
  state.angle = Math.PI / 2;
  const turned = directives.getExtinctionRadarPoint(state, { wx: 10, wy: 0 }, 42);
  assert.ok(Math.abs(turned.x) < 1e-10); assert.ok(turned.y < 0);
  const far = directives.getExtinctionRadarPoint(state, { wx: 100, wy: 0 }, 42);
  assert.equal(far.clamped, true); assert.ok(Math.hypot(far.x, far.y) <= 35);
  const before = structuredClone(state); let rectangles = 0;
  const ctx = new Proxy({ fillRect() { rectangles++; } }, { get: (object, key) => object[key] || (() => {}), set: () => true });
  directives.drawExtinctionDirectiveMarkers(ctx, state, 840, 430, () => ({ camZ: 3, aim: 0 }), { x: 760, y: 80, radius: 42 });
  assert.ok(rectangles > 0); assert.deepEqual(state, before);
});

const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
const component = parseAst(hub, { lang: 'jsx' }).body.find(node => node.type === 'FunctionDeclaration' && node.id?.name === 'ExtinctionRoyale');
const finishNode = component.body.body.flatMap(node => node.type === 'VariableDeclaration' ? node.declarations : []).find(node => node.id?.name === 'finishRun').init.arguments[0];
function finishHarness(state) {
  const reports = [];
  const env = { ...directives, stateRef: { current: state }, sceneInputsRef: { current: { clear() {} } }, aimPointerRef: { current: null },
    emptySceneAim, lang: 'fr', runMode: state.runMode, getNexusFieldRunProof, clearNexusFieldOperation, clearExtinctionProtocolEffects,
    buildRunSnapshot: value => ({ phase: value.phase }), setRunSnapshot() {}, sound: { playSfx() {} }, onSessionEnd: report => reports.push(report) };
  return { reports, finish: new Function(...Object.keys(env), `return (${hub.slice(finishNode.start, finishNode.end)});`)(...Object.values(env)) };
}

test('the actual finish callback rejects incomplete directives, preserves ordinary rewards, and emits only one receipt', () => {
  for (const mode of ['last_signal', 'infestation', 'hunt']) {
    const state = make(mode), { reports, finish } = finishHarness(state);
    finish('victory'); assert.equal(reports.length, 0, mode); assert.equal(state.phase, 'running');
    if (mode === 'hunt') { state.enemies = [boss()]; directives.markExtinctionHuntTarget(state); damageExtinctionEnemy(state, state.enemies[0], 1000); }
    else for (let index = 0; index < state.fieldDirective.markers.length; index++) {
      state.wave = index + 1; tick(state, Math.max(0, state.fieldDirective.markers[index].opensAt - state.t)); secure(state, index);
    }
    if (mode === 'infestation') tick(state, Math.max(0, 3600 - state.t));
    if (mode === 'last_signal') { state.wave = 5; state.enemies = [boss()]; damageExtinctionEnemy(state, state.enemies[0], 1000); }
    finish('victory'); finish('victory'); finish('defeat');
    assert.equal(reports.length, 1, mode);
    assert.equal(reports[0].rewards.gold, 70 + state.wave * 22 + state.kills * 3);
    assert.equal(reports[0].rewards.shards, 24 + state.wave * 7);
    assert.equal(reports[0].rewards.modeXp, 120 + state.wave * 30);
    assert.equal(state.fieldDirective, null);
    const progress = applyExtinctionReport({}, reports[0]);
    assert.equal(progress.extinctionCareer.runs, 1); assert.equal(applyExtinctionReport(progress, reports[0]), progress);
  }
});

test('an unfinished directive still allows the actual defeat path and never grants a victory title', () => {
  const state = make('infestation'), { reports, finish } = finishHarness(state); state.kills = 2; state.hp = 0;
  finish('defeat'); assert.equal(reports.length, 1); assert.equal(reports[0].result, 'defeat');
  assert.equal(reports[0].rewards.gold, 20); assert.equal(state.fieldDirective, null);
  assert.equal(state.directiveSummary.completed, 0);
});
