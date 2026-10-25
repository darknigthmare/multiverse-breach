import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {
  TACTICS_ENVIRONMENT_BIOMES, getTacticsEnvironmentProfile,
  drawTacticsEnvironment, drawTacticsScenery, getTacticsSceneryBounds
} from '../src/game/tacticsEnvironmentRenderer.js';
import {
  TACTICS_TERRAIN_MATERIALS, getTerrainDrawList, getSurfacePolygon, drawTerrainFace
} from '../src/game/tacticsTerrainRenderer.js';

// Command recordings exercise the actual renderer and its invariants. They do
// not stand in for a browser pixel review or a claim of source-art fidelity.
function recorder() {
  const calls = [], stack = [];
  const target = {
    canvas: { width: 1040, height: 460 },
    save() { stack.push(1); calls.push(['save']); },
    restore() { assert.ok(stack.length, 'Canvas restore without matching save'); stack.pop(); calls.push(['restore']); },
    createLinearGradient(...args) {
      const gradient = { addColorStop: (...stop) => calls.push(['gradient-stop', ...stop]) };
      calls.push(['gradient', ...args]); return gradient;
    }
  };
  const ctx = new Proxy(target, {
    get(object, key) {
      if (key in object) return object[key];
      if (['lineWidth', 'globalAlpha'].includes(key)) return 1;
      return (...args) => {
        for (const argument of args) if (typeof argument === 'number') assert.ok(Number.isFinite(argument), key + ': invalid number');
        calls.push([key, ...args]);
      };
    },
    set(object, key, value) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value), key + ': invalid style');
      object[key] = value;
      calls.push(['set', key, value && typeof value === 'object' ? 'gradient' : value]); return true;
    }
  });
  return { ctx, calls, stack };
}
const battlefield = (biome, extra = {}) => ({
  id: 'tactical-' + biome, layoutId: 'tactical-sector-' + biome,
  formatVersion: 2, modeExclusive: 'Tactics',
  source: { universe: 'Source universe', work: 'Selected source period', location: 'Selected sector' },
  tacticsPresentation: { biome, weather: biome === 'alpine' ? 'snow' : biome === 'volcanic' ? 'embers' : 'mist' },
  ...extra
});
function environment(field, options = {}) {
  const recording = recorder();
  const drawn = drawTacticsEnvironment(recording.ctx, { battlefield: field, width: 1040, height: 460, animTime: 165, ...options });
  assert.equal(recording.stack.length, 0);
  return { ...recording, drawn };
}

test('the eight source sectors have dedicated deterministic environments with distinct geometry and no image reuse', () => {
  assert.equal(TACTICS_ENVIRONMENT_BIOMES.length, 8);
  const fingerprints = new Set();
  for (const biome of TACTICS_ENVIRONMENT_BIOMES) {
    const field = battlefield(biome), original = structuredClone(field);
    const first = environment(field), second = environment(field);
    assert.equal(first.drawn, true);
    assert.deepEqual(first.calls, second.calls);
    assert.deepEqual(field, original, 'Painting must not mutate the map or its source');
    assert.ok(first.calls.some(call => call[0] === 'fillRect' && call.slice(1).join(',') === '0,0,1040,460'), 'Dedicated environment must cover the full old backdrop');
    assert.equal(first.calls.some(call => call[0] === 'drawImage'), false, 'Do not borrow a shared painted stage');
    assert.ok(first.calls.filter(call => call[0] === 'lineTo').length > 25, 'Landscape silhouette must have actual geometry');
    fingerprints.add(JSON.stringify(first.calls));
    const profile = getTacticsEnvironmentProfile(field);
    assert.equal(profile.id, field.layoutId);
    assert.equal(profile.universe, field.source.universe);
    assert.equal(profile.location, field.source.location);
    assert.equal(profile.usesSharedBackdrop, false); assert.equal(profile.source1to1Verified, false);
  }
  assert.equal(fingerprints.size, 8);
});

test('source-specific routes remain Tactics-only and malformed explicit source profiles are rejected', () => {
  for (const mode of ['RPG', 'Smash', 'Fighter', 'Kart']) {
    const result = environment(battlefield('alpine'), { mode });
    assert.equal(result.drawn, false); assert.deepEqual(result.calls, []);
  }
  for (const field of [
    battlefield('unknown'), battlefield('alpine', { modeExclusive: undefined }),
    battlefield('alpine', { formatVersion: 1 }),
    null
  ]) {
    const result = environment(field);
    assert.equal(result.drawn, false); assert.deepEqual(result.calls, []);
  }
});

test('legacy and Nexus Tactics boards receive honest original environments without changing their geometry', () => {
  const original = { id: 'urban_crossfire', rows: 6, cols: 8, tileTheme: { base: '#355547', mid: '#244433', detail: '#98ab76', pattern: 'steel' } };
  const before = structuredClone(original);
  const profile = getTacticsEnvironmentProfile(original, 'Tactics', { universe: 'Named source universe' });
  assert.equal(profile.sourceSpecific, false); assert.equal(profile.source1to1Verified, false);
  assert.equal(profile.universe, 'Named source universe'); assert.equal(profile.ground, original.tileTheme.base);
  assert.equal(profile.near, original.tileTheme.mid); assert.match(profile.adaptation, /no exact source location/);
  const recording = environment(original, { universe: 'Named source universe' });
  assert.equal(recording.drawn, true); assert.equal(recording.calls.some(call => call[0] === 'drawImage'), false);
  assert.deepEqual(original, before);
  for (const id of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
    const result = environment({ id, formatVersion: 2 });
    assert.equal(result.drawn, true); assert.equal(getTacticsEnvironmentProfile({ id, formatVersion: 2 }).sourceSpecific, false);
  }
});

test('legacy cell art uses standalone Tactics tile atlases, with no shared full scene or other-engine tile path', () => {
  const registry = JSON.parse(fs.readFileSync(new URL('../src/game/generatedStageAssets.json', import.meta.url)));
  let checked = 0;
  for (const profile of Object.values(registry.byProfile)) {
    const tiles = profile.Tactics?.tileTexturePath;
    if (!tiles) continue;
    checked += 1;
    assert.notEqual(tiles, profile.Tactics.assetPath); assert.notEqual(tiles, profile.Tactics.backdropPath);
    for (const [mode, entry] of Object.entries(profile)) {
      if (mode === 'Tactics') continue;
      for (const key of ['assetPath', 'backdropPath', 'tileTexturePath', 'platformTexturePath']) assert.notEqual(tiles, entry[key]);
    }
  }
  assert.ok(checked > 0);
});

test('forced base and suppressed DLC environments use only the Nexus profile and deterministic source-free scenery', () => {
  const fields = [battlefield('volcanic'), {
    id: 'private_source_industrial', tileTheme: { base: '#ff0000', mid: '#00ff00', detail: '#0000ff', pattern: 'lava' },
    sourceUniverse: 'Disabled source universe'
  }];
  const commands = [];
  for (const flag of ['forceBaseArena', 'dlcSuppressedArena']) for (const field of fields) {
    const options = { [flag]: true, universe: 'Disabled source universe' };
    const profile = getTacticsEnvironmentProfile(field, 'Tactics', options);
    assert.equal(profile.universe, 'Nexus de Convergence'); assert.equal(profile.sourceSpecific, false);
    assert.equal(profile.biome, 'tactical-nexus'); assert.equal(profile.architecture, 'none');
    assert.equal(profile.id, 'tactics:nexus-base'); assert.equal(profile.usesSharedBackdrop, false);
    const recording = environment(field, options);
    assert.equal(recording.drawn, true); assert.equal(recording.calls.some(call => call[0] === 'drawImage'), false);
    commands.push(recording.calls);
  }
  for (const recording of commands) assert.deepEqual(recording, commands[0], 'Suppressed sources cannot affect geometry, palette or motif');
});

test('reduced motion freezes snow, mist and embers while simulation time owns animated scenery', () => {
  for (const biome of ['alpine', 'wetlands', 'volcanic']) {
    const field = battlefield(biome);
    assert.deepEqual(environment(field, { reducedMotion: true, animTime: 0 }).calls,
      environment(field, { reducedMotion: true, animTime: 9876 }).calls);
    assert.notDeepEqual(environment(field, { animTime: 0 }).calls, environment(field, { animTime: 9876 }).calls);
  }
});

test('source material families keep natural cliff strata distinct from architecture and preserve tile geometry', () => {
  const project = (x, y, z) => ({ x: 120 + x * 44, y: 180 + y * 26 - z * 24 });
  const natural = ['nibel-rock', 'steppe-grass', 'swamp-mud', 'shallow-water', 'snow', 'alpine-rock', 'pine-earth',
    'meadow-grass', 'darkroot-moss', 'darkroot-stone', 'basalt', 'lava', 'halo-grass'];
  const art = ['mako-metal', 'prothean-concrete', 'forerunner-alloy'];
  const polygons = new Set(), samples = new Set();
  for (const id of [...natural, ...art]) {
    const material = TACTICS_TERRAIN_MATERIALS[id]; assert.ok(material, id);
    const surface = { id: id + ':cliff', x: 1, y: 1, z: 3, cornerZ: [3, 3, 3, 3], materialId: id, solidBottom: -1 };
    polygons.add(JSON.stringify(getSurfacePolygon(surface, project)));
    const faces = getTerrainDrawList({ surfaces: [surface] }, { project });
    assert.ok(faces.some(face => face.kind === 'side'), id);
    const recording = recorder();
    for (const face of faces) drawTerrainFace(recording.ctx, face, { animTime: 48 });
    assert.equal(recording.stack.length, 0);
    samples.add(JSON.stringify(recording.calls));
    if (['nibel-rock', 'alpine-rock', 'darkroot-stone', 'basalt'].includes(id)) assert.equal(material.family, 'rock', id + ': natural rock cannot be brick masonry');
    if (['steppe-grass', 'darkroot-moss', 'halo-grass'].includes(id)) assert.equal(material.sideFamily, 'strata');
  }
  assert.equal(polygons.size, 1, 'Textures must not alter the reachable surface');
  assert.equal(samples.size, natural.length + art.length);
});

test('trees, boulders and source architecture draw at their real support without changing collision or HP', () => {
  const point = { x: 310, y: 265 }, silhouettes = new Set();
  for (const kind of ['tree', 'boulder', 'ruin-wall', 'mako-conduit', 'prothean-generator', 'forerunner-pylon', 'wooden-crate']) {
    const obstacle = { id: kind, sceneryKind: kind, hp: 80, maxHp: 80, tacticsHeight: 2.5, surfaceId: 'upper:3:4', gridX: 3, gridY: 4 };
    const before = structuredClone(obstacle), recording = recorder();
    assert.equal(drawTacticsScenery(recording.ctx, { obstacle, point, width: 37, height: 55 }), true);
    assert.deepEqual(obstacle, before); assert.equal(recording.stack.length, 0);
    assert.ok(recording.calls.some(call => call[0] === 'translate' && call[1] === point.x && call[2] === point.y));
    assert.equal(recording.calls.some(call => call[0] === 'drawImage'), false);
    silhouettes.add(JSON.stringify(recording.calls));
    const bounds = getTacticsSceneryBounds(obstacle, point, 37, 55);
    assert.ok(bounds.left < point.x && bounds.right > point.x);
    assert.ok(bounds.top <= point.y - 55 && bounds.bottom >= point.y);
    if (kind === 'tree') assert.ok(getTacticsSceneryBounds(obstacle, point, 110, 150).top <= point.y - 150 * 1.09,
      'Zoomed tree sorting bounds must contain the whole canopy');
  }
  assert.equal(silhouettes.size, 7);
  const recording = recorder();
  assert.equal(drawTacticsScenery(recording.ctx, { obstacle: { sceneryKind: 'legacy' }, point, width: 37, height: 55 }), false);
  assert.deepEqual(recording.calls, []);
});
