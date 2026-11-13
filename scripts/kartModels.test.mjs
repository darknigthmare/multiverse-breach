import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { getHeroSpriteSheetSources, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { KART_ROSTER, getKartRoster, getKartForHero, getKartDriverFrame } from '../src/game/kart/kartRoster.js';
import { buildKartMesh } from '../src/game/kart/kartModel.js';
import { exportKartGlb, exportKartAtlas, scanAlphaBounds } from './kart/buildKartAssets.mjs';

test('every character and the Anchor has a stable individual kart and original driver identity', () => {
  assert.equal(KART_ROSTER.length, HEROES_DB.length + 1);
  assert.equal(new Set(KART_ROSTER.map(kart => kart.id)).size, KART_ROSTER.length);
  assert.equal(new Set(KART_ROSTER.map(kart => kart.modelAsset)).size, KART_ROSTER.length);
  assert.equal(new Set(KART_ROSTER.map(kart => kart.sprite2D.src)).size, KART_ROSTER.length);
  for (const hero of HEROES_DB) {
    const kart = getKartForHero(hero.id);
    assert.equal(kart.heroId, hero.id);
    assert.equal(kart.name, hero.name);
    assert.deepEqual(kart.driverSprite.sources, getHeroSpriteSheetSources(hero, 'rpg'));
    assert.equal(kart.driverSprite.identity, hero.id);
    assert.equal(kart.fidelityStatus, 'unreviewed-original-kart-adaptation');
    assert.equal(kart.statsPolicy, 'existing-race-and-garage-stats');
    for (const candidate of kart.driverSprite.candidates) {
      const layout = getSpriteSheetLayout(candidate.src);
      assert.equal(candidate.columns, layout.columns);
      assert.equal(candidate.rows, layout.rows);
      assert.ok(candidate.col >= 0 && candidate.col < candidate.columns);
      assert.ok(candidate.row >= 0 && candidate.row < candidate.rows);
    }
  }
  assert.equal(getKartForHero('unknown-character'), null);
});

test('DLC availability and hiding project the roster without deleting dormant identities', () => {
  const before = KART_ROSTER.length;
  const base = getKartRoster({ installed: universe => universe === 'Nexus de Convergence' });
  assert.ok(base.every(kart => kart.universe === 'Nexus de Convergence'));
  assert.ok(base.some(kart => kart.heroId === 'player_anchor'));
  const hidden = getKartRoster({ hiddenUniverses: ['Halo', 'Alien', 'Nexus de Convergence'] });
  assert.ok(hidden.every(kart => kart.heroId === 'player_anchor' || !['Halo', 'Alien', 'Nexus de Convergence'].includes(kart.universe)));
  assert.equal(KART_ROSTER.length, before);
  assert.equal(getKartForHero('masterchief').universe, 'Halo');
  assert.equal(getKartRoster().length, before);
});

test('Anchor customization keeps the Anchor sprite, and candidate frames preserve their own atlas layout', () => {
  const anchor = getKartRoster({ playerProfile: { name: 'Darknigthmare' } }).find(kart => kart.heroId === 'player_anchor');
  assert.equal(anchor.name, 'Darknigthmare');
  assert.match(anchor.driverSprite.src, /player-anchor.*movement/);
  assert.doesNotMatch(anchor.driverSprite.src, /mirelle/);
  const chief = getKartForHero('masterchief');
  assert.equal(getKartDriverFrame(chief).rows, 8);
  assert.equal(getKartDriverFrame(getKartForHero('arca_mirelle')).rows, 12);
  assert.equal(getKartDriverFrame(null), null);
});

test('the mesh is volumetric, finite, flat-shaded and partitions every face into owned parts', () => {
  for (const id of ['player_anchor', 'arca_bastion', 'arca_mirelle', 'arca_nova', 'masterchief', 'ripley', 'predator', 'vader']) {
    const mesh = buildKartMesh(getKartForHero(id));
    const vertices = mesh.positions.length / 3;
    assert.equal(mesh.normals.length, mesh.positions.length);
    assert.equal(mesh.colors.length, vertices * 4);
    assert.equal(vertices % 3, 0);
    assert.ok(mesh.positions.every(Number.isFinite));
    assert.ok(mesh.colors.every(value => Number.isFinite(value) && value >= 0 && value <= 1));
    assert.ok(mesh.bounds.max.every((value, axis) => value > mesh.bounds.min[axis] + 0.5));
    assert.ok(mesh.bounds.min[1] >= -0.00001);
    let cursor = 0;
    for (const part of mesh.parts) {
      assert.equal(part.start, cursor); cursor += part.count;
      assert.ok(part.count > 0 && part.count % 3 === 0);
    }
    assert.equal(cursor, vertices);
    for (let i = 0; i < mesh.normals.length; i += 3) assert.ok(Math.abs(Math.hypot(...mesh.normals.subarray(i, i + 3)) - 1) < 1e-5);
    if (id !== 'arca_mirelle') {
      const wheels = mesh.parts.filter(part => part.kind === 'wheel');
      assert.equal(wheels.length, 4);
      assert.equal(wheels.filter(part => part.steering).length, 2);
      assert.ok(wheels.filter(part => part.steering).every(part => part.pivot[2] < 0));
    } else {
      assert.equal(mesh.parts.filter(part => part.kind === 'wheel').length, 0);
      assert.ok(mesh.features.includes('floating-hologram-cards'));
      assert.match(getKartForHero(id).referenceAsset, /arca-mirelle-kart-directions/);
    }
  }
});

test('GLB round-trip has bounded binary accessors, valid triangle indices and animated wheel pivots', () => {
  const spec = getKartForHero('masterchief'), mesh = buildKartMesh(spec), bytes = exportKartGlb(spec, mesh);
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLength = bytes.readUInt32LE(12);
  assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
  const document = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8'));
  const binStart = 20 + jsonLength;
  assert.equal(bytes.readUInt32LE(binStart + 4), 0x004e4942);
  const bin = bytes.subarray(binStart + 8);
  assert.equal(document.buffers[0].byteLength, bin.length);
  assert.equal(document.nodes.filter(node => node.extras?.kind === 'wheel').length, 4);
  assert.equal(document.nodes.find(node => node.name === 'DriverSpriteAnchor').extras.heroId, 'masterchief');
  let triangles = 0;
  for (const gltfMesh of document.meshes) for (const primitive of gltfMesh.primitives) {
    const positions = document.accessors[primitive.attributes.POSITION];
    const indices = document.accessors[primitive.indices];
    const view = document.bufferViews[indices.bufferView];
    assert.equal(indices.componentType, 5123);
    assert.equal(indices.count % 3, 0);
    triangles += indices.count / 3;
    for (let i = 0; i < indices.count; i += 1) assert.ok(bin.readUInt16LE(view.byteOffset + i * 2) < positions.count);
  }
  assert.equal(triangles, mesh.positions.length / 9);
  for (const view of document.bufferViews) {
    assert.equal(view.byteOffset % 4, 0);
    assert.ok(view.byteOffset + view.byteLength <= bin.length);
  }
  assert.deepEqual(exportKartGlb(spec, mesh), bytes);
});

test('the eight-view RGBA atlas contains unclipped, distinct projections of the same mesh', async () => {
  for (const id of ['arca_mirelle', 'masterchief', 'ripley']) {
    const mesh = buildKartMesh(getKartForHero(id)), atlas = await exportKartAtlas(mesh);
    const { data, info } = await sharp(atlas.png).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 1024); assert.equal(info.height, 128); assert.equal(info.channels, 4);
    const views = new Set();
    for (let view = 0; view < 8; view += 1) {
      const frame = Buffer.alloc(128 * 128 * 4);
      for (let y = 0; y < 128; y += 1) data.copy(frame, y * 128 * 4, (y * 1024 + view * 128) * 4, (y * 1024 + (view + 1) * 128) * 4);
      const bounds = scanAlphaBounds(frame, 128, 128);
      assert.deepEqual(bounds, atlas.frames[view].bounds);
      assert.ok(bounds.left > 1 && bounds.right < 126 && bounds.top > 1 && bounds.bottom < 126);
      assert.ok(bounds.transparentPixels > 128 * 128 / 3);
      assert.ok(bounds.opaquePixels > 100);
      views.add(createHash('sha256').update(frame).digest('hex'));
    }
    assert.equal(views.size, 8);
    assert.deepEqual((await exportKartAtlas(mesh)).png, atlas.png);
  }
});
