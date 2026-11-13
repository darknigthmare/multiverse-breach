import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { buildKartMesh } from '../../src/game/kart/kartModel.js';
import { KART_IDENTITY_MODELS, KART_IDENTITY_MOTIFS, KART_IDENTITY_VARIANTS } from '../../src/game/kart/kartIdentityGeometry.js';

const spec = (model, motifs = [], variant) => ({
  id: `test:${model}`, color: '#71818c', accent: '#bda14f', detailColor: '#b9d6dc',
  vehicleIdentity: { model, motifs, variant }
});
const hashPositions = mesh => createHash('sha256').update(Buffer.from(mesh.positions.buffer)).digest('hex');
const close = (actual, expected, note) => assert.ok(Math.abs(actual - expected) < 1e-5, `${note}: ${actual} != ${expected}`);

function verifyMesh(mesh, name) {
  const count = mesh.positions.length / 3;
  assert.equal(count % 3, 0, `${name}: complete triangles`);
  assert.equal(mesh.normals.length, mesh.positions.length, `${name}: normals`);
  assert.equal(mesh.colors.length, count * 4, `${name}: colours`);
  assert.ok(mesh.positions.every(Number.isFinite), `${name}: finite positions`);
  assert.ok(mesh.colors.every(n => Number.isFinite(n) && n >= 0 && n <= 1), `${name}: finite RGBA`);
  assert.ok(mesh.bounds.min[1] >= -1e-6, `${name}: wheels and body above ground`);
  assert.ok(mesh.bounds.max[0] - mesh.bounds.min[0] <= 3.6, `${name}: width within kart footprint`);
  assert.ok(mesh.bounds.max[2] - mesh.bounds.min[2] <= 3.6, `${name}: length within kart footprint`);
  assert.ok(mesh.bounds.max[1] <= 2.0, `${name}: ornaments below the portrait framing limit`);
  let cursor = 0;
  for (const part of mesh.parts) {
    assert.equal(part.start, cursor, `${name}: contiguous owned faces`);
    assert.ok(part.count > 0 && part.count % 3 === 0, `${name}: nonempty owned triangles`);
    cursor += part.count;
  }
  assert.equal(cursor, count, `${name}: every face owned exactly once`);
  for (let vertex = 0; vertex < count; vertex += 3) {
    const a = mesh.positions.subarray(vertex * 3, vertex * 3 + 3);
    const b = mesh.positions.subarray((vertex + 1) * 3, (vertex + 1) * 3 + 3);
    const c = mesh.positions.subarray((vertex + 2) * 3, (vertex + 2) * 3 + 3);
    const u = b.map((n, axis) => n - a[axis]), v = c.map((n, axis) => n - a[axis]);
    const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...cross);
    assert.ok(length > 1e-8, `${name}: no zero-area triangle at ${vertex}`);
    for (let corner = 0; corner < 3; corner += 1) {
      const normal = mesh.normals.subarray((vertex + corner) * 3, (vertex + corner) * 3 + 3);
      close(Math.hypot(...normal), 1, `${name}: unit normal`);
      for (let axis = 0; axis < 3; axis += 1) close(normal[axis], cross[axis] / length, `${name}: normal follows winding`);
    }
  }
  const wheels = mesh.parts.filter(p => p.kind === 'wheel');
  const wheelCounts = { mako: [6, 2], 'motorbike:segway': [2, 0], 'motorbike:bicycle': [2, 1] };
  const [wheelCount, steeringCount] = wheelCounts[name] || [4, 2];
  assert.equal(wheels.length, wheelCount, `${name}: all wheels animated`);
  assert.equal(wheels.filter(p => p.steering).length, steeringCount, `${name}: source vehicle steering layout`);
  for (const wheel of wheels) {
    assert.equal(wheel.steering, wheel.pivot[2] < 0);
    assert.equal(wheel.rollAxis, 'x');
    close(wheel.pivot[1], wheel.radius, `${name}: wheel contacts ground`);
  }
}

test('all authored vehicle bodies have distinct geometry, bounded size and complete GLB part ownership', () => {
  const geometry = new Set();
  for (const model of KART_IDENTITY_MODELS) {
    const mesh = buildKartMesh(spec(model));
    verifyMesh(mesh, model);
    assert.ok(mesh.features.includes(`identity:${model}`));
    assert.ok(mesh.features.some(f => f.startsWith('landmark:')), `${model}: genuine body landmark`);
    assert.ok(mesh.positions.length / 9 <= 2200, `${model}: base triangle budget`);
    const hash = hashPositions(mesh);
    assert.ok(!geometry.has(hash), `${model}: not another body's recolour`);
    geometry.add(hash);
  }
  assert.equal(geometry.size, KART_IDENTITY_MODELS.length);
});

test('every named motif adds real finite faces without entering the driver head opening', () => {
  const bare = buildKartMesh(spec('jeep')), geometry = new Set();
  for (const motif of KART_IDENTITY_MOTIFS) {
    const mesh = buildKartMesh(spec('jeep', [motif]));
    verifyMesh(mesh, motif);
    const part = mesh.parts.find(p => p.id === `identity-jeep-motif-${motif}`);
    assert.ok(part && part.count > 0, `${motif}: owns actual geometry`);
    assert.ok(mesh.positions.length > bare.positions.length, `${motif}: not metadata only`);
    assert.ok(mesh.features.includes(`motif:${motif}`));
    for (let vertex = part.start; vertex < part.start + part.count; vertex += 1) {
      const [x, y, z] = mesh.positions.subarray(vertex * 3, vertex * 3 + 3);
      assert.ok(!(Math.abs(x) < 0.3 && y > 1.05 && z > -0.1 && z < 0.5), `${motif}: driver's central head opening remains clear`);
    }
    const motifPositions = mesh.positions.subarray(part.start * 3, (part.start + part.count) * 3);
    const hash = createHash('sha256').update(Buffer.from(motifPositions.buffer, motifPositions.byteOffset, motifPositions.byteLength)).digest('hex');
    assert.ok(!geometry.has(hash), `${motif}: distinct ornament geometry`);
    geometry.add(hash);
  }
});

test('Ripley shuttle and Warthog expose their structural references and exclude the old generic body', () => {
  const narcissus = buildKartMesh(spec('narcissus'));
  assert.ok(narcissus.features.includes('landmark:narcissus-chamfered-shuttle-wedge'));
  assert.ok(narcissus.features.includes('landmark:narcissus-paired-rounded-aft-thrusters-and-docking-hatch'));
  assert.ok(!narcissus.features.some(name => /loader|exposed-engine|classic-fairing/.test(name)));
  const nacelles = narcissus.parts.find(part => part.id.includes('paired-rounded-aft-thrusters'));
  assert.ok(nacelles.count > 200);
  const warthog = buildKartMesh(spec('warthog'));
  assert.ok(warthog.features.includes('landmark:warthog-sloped-armored-bonnet'));
  assert.ok(warthog.features.includes('landmark:warthog-open-cage-and-cargo-bed'));
  assert.ok(!warthog.features.includes('classic-fairing'));
  assert.ok(warthog.parts.filter(part => part.kind === 'wheel').every(part => part.radius >= 0.37));
  assert.notEqual(hashPositions(warthog), hashPositions(narcissus));
});

test('source-specific vehicle variants change structural faces within the common kart footprint', () => {
  for (const [model, variant, landmark] of [
    ['tie-fighter', 'advanced-x1', 'tie-advanced-bent-solar-panels'],
    ['motorbike', 'sidecar', 'motorcycle-sidecar'],
    ['starfighter', 'death-glider', 'death-glider-crescent-wings-and-central-pod'],
    ['shuttle', 'lunar-rocket', 'lunar-rocket-red-white-checkers-and-fins'],
    ['hoverboard', 'duel-disk', 'duel-disk-half-arc-and-five-card-zones'],
    ['biplane', 'monoplane', 'monoplane-single-wing-and-propeller'],
    ['mech', 'tachikoma', 'tachikoma-rounded-pod-and-four-articulated-legs'],
    ['motorbike', 'gantz-cycle', 'gantz-cycle-open-monowheel-hoop'],
    ['motorbike', 'wheelchair', 'wheelchair-tubular-frame-armrests-and-footrests'],
    ['motorbike', 'segway', 'segway-two-wheel-platform-and-upright-handlebar'],
    ['motorbike', 'bicycle', 'bicycle-diamond-frame-and-empty-rear-child-seat'],
    ['beast', 'shark', 'shark-blunt-head-dorsal-fin-and-forked-tail'],
    ['beast', 'hammerhead', 'hammerhead-wide-head-dorsal-fin-and-forked-tail'],
    ['beast', 'elephant', 'elephant-broad-ears-curled-trunk-and-tusks'],
    ['beast', 'giraffe', 'giraffe-offset-long-neck-ossicones-and-spots']
  ]) {
    const normal = buildKartMesh(spec(model)), changed = buildKartMesh(spec(model, [], variant));
    assert.notEqual(hashPositions(normal), hashPositions(changed));
    assert.ok(changed.features.includes(`landmark:${landmark}`));
    verifyMesh(changed, `${model}:${variant}`);
  }
});

test('variant catalogue rejects typos and cross-model variants instead of drawing a default vehicle', () => {
  for (const [model, variants] of Object.entries(KART_IDENTITY_VARIANTS)) {
    assert.ok(KART_IDENTITY_MODELS.includes(model));
    assert.ok(Object.isFrozen(variants));
    for (const variant of variants) assert.doesNotThrow(() => buildKartMesh(spec(model, [], variant)));
  }
  assert.throws(() => buildKartMesh(spec('tie-fighter', [], 'advanced-xI')), /Unknown kart identity variant/);
  assert.throws(() => buildKartMesh(spec('motorbike', [], 'wheel-chair')), /Unknown kart identity variant/);
  assert.throws(() => buildKartMesh(spec('jeep', [], 'wheelchair')), /Unknown kart identity variant/);
});

test('mask, chainsaw, robotic optic and engraved eye remain materially different from cartoon eyes', () => {
  const cartoon = buildKartMesh(spec('jeep', ['eyes']));
  for (const motif of ['mask', 'chainsaw', 'optic', 'eye-sigil']) {
    const mesh = buildKartMesh(spec('jeep', [motif]));
    assert.notEqual(hashPositions(mesh), hashPositions(cartoon));
    const part = mesh.parts.find(p => p.id === `identity-jeep-motif-${motif}`);
    const palette = new Set();
    for (let vertex = part.start; vertex < part.start + part.count; vertex += 1) {
      palette.add([...mesh.colors.subarray(vertex * 4, vertex * 4 + 3)].map(c => c.toFixed(3)).join(','));
    }
    assert.ok(palette.size >= 2, `${motif}: cutouts/teeth/lens/engraving have real material contrast`);
    assert.ok(part.count >= 200, `${motif}: substantial recognisable geometry`);
  }
});

test('painting every new body preserves positions, normals, parts and source ornaments', () => {
  for (const model of KART_IDENTITY_MODELS) {
    const original = spec(model, ['tools', 'crystals']);
    const before = buildKartMesh(original), after = buildKartMesh({ ...original, color: '#ce375a' });
    assert.deepEqual(after.positions, before.positions, `${model}: shape unchanged`);
    assert.deepEqual(after.normals, before.normals, `${model}: normals unchanged`);
    assert.deepEqual(after.parts, before.parts, `${model}: part layout unchanged`);
    assert.notDeepEqual(after.colors, before.colors, `${model}: paint actually changes`);
    const tools = before.parts.find(p => p.id === `identity-${model}-motif-tools`);
    assert.deepEqual(after.colors.subarray(tools.start * 4, (tools.start + tools.count) * 4),
      before.colors.subarray(tools.start * 4, (tools.start + tools.count) * 4), `${model}: metal/wood tools keep material colour`);
  }
});

test('duplicate motifs do not duplicate geometry and unknown new identities fail visibly', () => {
  assert.deepEqual(buildKartMesh(spec('jeep', ['tools', 'tools'])).positions, buildKartMesh(spec('jeep', ['tools'])).positions);
  assert.throws(() => buildKartMesh(spec('unregistered-vehicle')), /Unknown kart identity model/);
  assert.throws(() => buildKartMesh(spec('jeep', ['unimplemented-logo'])), /Unknown kart identity motif/);
  const legacy = buildKartMesh({ color: '#789abc', bodyStyle: 'rally' });
  assert.ok(legacy.features.includes('rally-equipment'));
  const mirelle = buildKartMesh({ color: '#17272a', bodyStyle: 'suture-disc', vehicleIdentity: { model: 'suture-disc', motifs: ['cards'] } });
  assert.ok(mirelle.features.includes('source-mirelle-hover-disc'));
  assert.equal(mirelle.parts.filter(p => p.kind === 'wheel').length, 0);
});
