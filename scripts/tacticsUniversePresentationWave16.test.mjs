import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 as fields } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS as oldFields } from '../src/game/tacticsUniverseBattlefields.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as recentFields } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_VERTICAL_BATTLEFIELDS as nexusFields } from '../src/game/tacticsVerticalBattlefields.js';
import { TACTICS_TERRAIN_MATERIALS_WAVE16 as materials } from '../src/game/tacticsUniversePresentationWave16.js';
import { TACTICS_TERRAIN_MATERIALS, getTerrainDrawList, getSurfacePolygon, drawTerrainFace } from '../src/game/tacticsTerrainRenderer.js';
import { drawTacticsEnvironment, getTacticsEnvironmentProfile, drawTacticsScenery } from '../src/game/tacticsEnvironmentRenderer.js';

const root = new URL('../', import.meta.url);
const baseline = JSON.parse(fs.readFileSync(new URL('docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json', root)));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function recorder() {
  const calls = [], stack = [], initial = { globalAlpha: .73, lineWidth: 2, strokeStyle: '#abcdef', fillStyle: '#fedcba' };
  let styles = { ...initial };
  const target = {
    canvas: { width: 1040, height: 460 },
    save() { stack.push({ ...styles }); calls.push(['save']); },
    restore() { assert.ok(stack.length); styles = stack.pop(); calls.push(['restore']); },
    createLinearGradient(...args) { calls.push(['gradient', ...args]); return { addColorStop: (...stop) => calls.push(['gradient-stop', ...stop]) }; }
  };
  const ctx = new Proxy(target, {
    get(object, key) {
      if (key in object) return object[key]; if (key in styles) return styles[key];
      return (...args) => { for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), key + ': invalid coordinate'); calls.push([key, ...args]); };
    },
    set(_, key, value) { if (typeof value === 'number') assert.ok(Number.isFinite(value)); styles[key] = value; calls.push(['set', key, value && typeof value === 'object' ? 'gradient' : value]); return true; }
  });
  return { ctx, calls, assertRestored() { assert.equal(stack.length, 0); assert.deepEqual(styles, initial); } };
}

test('all15 previous topologies and34 material definitions remain exact while eight new material profiles are added', () => {
  const previous = { ...nexusFields, ...oldFields, ...recentFields };
  assert.equal(Object.keys(previous).length, 15); assert.equal(Object.keys(materials).length, 8);
  assert.equal(Object.keys(TACTICS_TERRAIN_MATERIALS).length, 42);
  for (const [id, expected] of Object.entries(baseline.fields)) assert.equal(hash(previous[id]), expected, id);
  for (const [id, expected] of Object.entries(baseline.materialDefinitions)) assert.equal(hash(TACTICS_TERRAIN_MATERIALS[id]), expected, id);
});

test('W16 environment geometry is deterministic, source-addressed and dedicated to Tactics without a shared backdrop', () => {
  const signatures = new Set();
  for (const field of Object.values(fields)) {
    const before = structuredClone(field), profile = getTacticsEnvironmentProfile(field);
    assert.equal(profile.sourceSpecific, true); assert.equal(profile.universe, field.source.universe);
    assert.equal(profile.work, field.source.work); assert.equal(profile.usesSharedBackdrop, false);
    assert.equal(profile.source1to1Verified, false);
    const render = () => { const r = recorder(); assert.equal(drawTacticsEnvironment(r.ctx, { battlefield: field, width: 1040, height: 460, animTime: 90 }), true); r.assertRestored(); return r.calls; };
    const first = render(); assert.deepEqual(render(), first); assert.deepEqual(field, before);
    assert.equal(first.some(call => call[0] === 'drawImage'), false);
    assert.ok(first.some(call => call[0] === 'fillRect' && call.slice(1).join(',') === '0,0,1040,460'));
    signatures.add(hash(first));
    for (const mode of ['RPG', 'Smash', 'Fighter', 'Kart']) {
      const r = recorder(); assert.equal(drawTacticsEnvironment(r.ctx, { battlefield: field, width: 1040, height: 460, mode }), false);
      assert.deepEqual(r.calls, []); r.assertRestored();
    }
  }
  assert.equal(signatures.size, 4);
});

test('new materials texture the true ramp, sides and platform undersides without changing its polygon or support geometry', () => {
  const project = (x, y, z) => ({ x: 180 + x * 44, y: 220 + y * 26 - z * 24 });
  const polygons = new Set(), signatures = new Set();
  for (const materialId of Object.keys(materials)) {
    const surface = { id: materialId, x: 1, y: 2, z: 2.5, cornerZ: [2, 3, 3, 2], shape: 'ramp', direction: 'east', materialId, solidBottom: 1.5 };
    const before = structuredClone(surface); polygons.add(hash(getSurfacePolygon(surface, project)));
    const faces = getTerrainDrawList({ surfaces: [surface] }, { project });
    for (const kind of ['top', 'side', 'underside']) assert.ok(faces.some(face => face.kind === kind), materialId + ': missing ' + kind);
    const r = recorder(); for (const face of faces) drawTerrainFace(r.ctx, face, { animTime: 84 });
    r.assertRestored(); assert.deepEqual(surface, before); signatures.add(hash(r.calls));
  }
  assert.equal(polygons.size, 1); assert.equal(signatures.size, 8);
});

test('four new scenery types keep the actual floor anchor, physical volume, HP and canvas state', () => {
  const signatures = new Set();
  for (const kind of ['inkwell-milepost', 'imc-service-pylon', 'central-station-clock', 'sadida-root-buttress']) {
    const obstacle = { id: kind, sceneryKind: kind, hp: 110, maxHp: 110, surfaceId: 'upper:3:4', gridX: 3, gridY: 4, tacticsHeight: 2.5 };
    const before = structuredClone(obstacle), r = recorder();
    assert.equal(drawTacticsScenery(r.ctx, { obstacle, point: { x: 310, y: 265 }, width: 37, height: 55 }), true);
    r.assertRestored(); assert.deepEqual(obstacle, before); assert.equal(r.calls.some(call => call[0] === 'drawImage'), false);
    signatures.add(hash(r.calls));
  }
  assert.equal(signatures.size, 4);
});
