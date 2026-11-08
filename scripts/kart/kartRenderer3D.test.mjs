import assert from 'node:assert/strict';
import test from 'node:test';
import { KartRenderer3D, getKartDriverCrop, getKartRenderSize } from '../../src/game/kart/kartRenderer3D.js';
import {
  KART_LANDMARK_KINDS, buildLandmarkMesh, buildRoadRibbon, buildKartEnvironmentMesh
} from '../../src/game/kart/kartEnvironment3D.js';
import { kartWorldMatrix, lookAt4, transformPoint4 } from '../../src/game/kart/kart3DMath.js';
import { getKartUniverseTracks } from '../../src/game/kart/kartTracks.js';

const close = (actual, expected, tolerance = 0.0001) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const basicTrack = () => ({
  id: 'renderer-lifecycle', roadWidth: 70, start: { x: 400, y: 420 },
  waypoints: [{ x: 400, y: 420 }, { x: 150, y: 280 }, { x: 400, y: 100 }, { x: 760, y: 280 }],
  boostPads: [{ x: 320, y: 375 }], itemBoxes: [{ x: 400, y: 100, respawn: 0 }],
  hazards: [{ x: 200, y: 300, r: 20 }], fragmentPickups: [{ x: 350, y: 120 }],
  surfaceZones: [{ x: 380, y: 410, r: 22, type: 'ice' }],
  environment: { sky: '#123456', ground: '#345678', road: '#345678', fog: '#123456', shoulder: '#47a8a1', landmarks: [] }
});
const raceFixture = (driver = false) => ({
  time: 4, track: basicTrack(), projectiles: [], particles: [], opponents: [],
  player: { id: 'test-racer', x: 400, y: 420, angle: 3.65, speed: 180, air: 0, boost: 0, shield: 0,
    kartSpec: { id: 'kart-test', heroId: 'hero-test', color: '#d28b43', accent: '#80d7c8',
      ...(driver ? { driverSprite: { candidates: [{ src: '/same-hero/source-a.png', columns: 4, rows: 8 }, { src: '/same-hero/source-b.png', columns: 1, rows: 1 }] } } : {}) } }
});

// A GL call recorder exercises allocation, real draw dispatch, restoration and
// cleanup. It does not claim to compile GLSL or to replace the native browser run.
function fakeSurface({ failProgramAt = -1 } = {}) {
  let id = 0, programCount = 0;
  const liveBuffers = new Set(), livePrograms = new Set(), liveTextures = new Set(), liveShaders = new Set();
  const enabledAttributes = new Set(), attributeBuffers = new Map();
  const calls = [], listeners = new Map(), images = [];
  const allocated = (kind, live) => { const object = { kind, id: ++id }; live.add(object); return object; };
  const deleted = (object, live) => { if (object) { assert.ok(live.has(object), `double-delete ${object.kind} ${object.id}`); live.delete(object); } };
  const gl = {
    ARRAY_BUFFER: 1, STATIC_DRAW: 2, VERTEX_SHADER: 3, FRAGMENT_SHADER: 4, COMPILE_STATUS: 5, LINK_STATUS: 6,
    DEPTH_TEST: 7, CULL_FACE: 8, LEQUAL: 9, BLEND: 10, SRC_ALPHA: 11, ONE_MINUS_SRC_ALPHA: 12,
    FLOAT: 13, TRIANGLES: 14, TRIANGLE_STRIP: 15, COLOR_BUFFER_BIT: 16, DEPTH_BUFFER_BIT: 32,
    TEXTURE_2D: 40, TEXTURE_WRAP_S: 41, TEXTURE_WRAP_T: 42, TEXTURE_MIN_FILTER: 43, TEXTURE_MAG_FILTER: 44,
    CLAMP_TO_EDGE: 45, LINEAR: 46, RGBA: 47, UNSIGNED_BYTE: 48, TEXTURE0: 49,
    UNPACK_FLIP_Y_WEBGL: 50, UNPACK_PREMULTIPLY_ALPHA_WEBGL: 51,
    INVALID_OPERATION: 0x0502, error: 0,
    lost: false, viewport() {}, enable() {}, disable() {}, depthFunc() {}, depthMask() {}, blendFunc() {}, clear() {},
    shaderSource() {}, compileShader() {}, attachShader() {}, linkProgram() {},
    createShader() { return allocated('shader', liveShaders); },
    deleteShader(shader) { deleted(shader, liveShaders); },
    getShaderParameter() { return true; }, getShaderInfoLog() { return ''; },
    createProgram() { const program = allocated('program', livePrograms); program.ordinal = ++programCount; return program; },
    getProgramParameter(program) { return program.ordinal !== failProgramAt; }, getProgramInfoLog() { return 'injected link failure'; },
    deleteProgram(program) { deleted(program, livePrograms); },
    getAttribLocation(program, name) { return ({ aPosition: 0, aNormal: 1, aColor: 2, aUv: 1 })[name]; },
    getUniformLocation(program, name) { return { program, name }; },
    createBuffer() { return allocated('buffer', liveBuffers); },
    deleteBuffer(buffer) {
      deleted(buffer, liveBuffers);
      if (this.boundBuffer === buffer) this.boundBuffer = null;
      // WebGL detaches a deleted buffer, but leaves the attribute enabled.
      for (const [index, bound] of attributeBuffers) if (bound === buffer) attributeBuffers.set(index, null);
    },
    bindBuffer(target, buffer) { this.boundBuffer = buffer; },
    bufferData(target, data) { assert.ok(data.every(Number.isFinite)); this.boundBuffer.length = data.length; },
    enableVertexAttribArray(index) { enabledAttributes.add(index); },
    disableVertexAttribArray(index) { enabledAttributes.delete(index); },
    vertexAttribPointer(index) { attributeBuffers.set(index, this.boundBuffer); },
    uniformMatrix4fv(location, transpose, values) { assert.equal(transpose, false); assert.ok([...values].every(Number.isFinite)); },
    uniform1f() {}, uniform1i() {}, uniform2f() {}, uniform3fv() {}, uniform4fv() {},
    useProgram(program) { assert.ok(livePrograms.has(program)); this.currentProgram = program; },
    drawArrays(mode, start, count) {
      // The no-client-arrays rule applies even to enabled attributes unused
      // by the current shader, e.g. normals left behind when drawing the sky.
      if ([...enabledAttributes].some(index => !liveBuffers.has(attributeBuffers.get(index)))) {
        this.error ||= this.INVALID_OPERATION;
        return;
      }
      calls.push({ mode, start, count, program: this.currentProgram });
    },
    getError() { const error = this.error; this.error = 0; return error; },
    isContextLost() { return this.lost; },
    createTexture() { return allocated('texture', liveTextures); },
    deleteTexture(texture) { deleted(texture, liveTextures); },
    bindTexture() {}, pixelStorei() {}, texParameteri() {}, texImage2D() {}, activeTexture() {}
  };
  const canvas = {
    width: 960, height: 540,
    getContext(kind) { assert.equal(kind, 'webgl', '3D must not masquerade as a 2D canvas'); return gl; },
    getBoundingClientRect: () => ({ width: 960, height: 540 }),
    addEventListener(name, fn) { listeners.set(name, fn); },
    removeEventListener(name, fn) { assert.equal(listeners.get(name), fn); listeners.delete(name); }
  };
  const imageFactory = () => { const image = {}; images.push(image); return image; };
  return { canvas, gl, liveBuffers, livePrograms, liveTextures, liveShaders, enabledAttributes, calls, listeners, images, imageFactory,
    lose() { gl.lost = true; let prevented = false; listeners.get('webglcontextlost')({ preventDefault() { prevented = true; } });
      assert.equal(prevented, true); liveBuffers.clear(); livePrograms.clear(); liveTextures.clear(); },
    restore() {
      gl.lost = false; gl.error = 0; gl.boundBuffer = null; gl.currentProgram = null;
      enabledAttributes.clear(); attributeBuffers.clear();
      listeners.get('webglcontextrestored')();
    } };
}

test('kart model forward matches simulation movement at every cardinal heading', () => {
  for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2, 0.83]) {
    const matrix = kartWorldMatrix({ x: 321, y: 123, angle }, 12, 8);
    const forward = transformPoint4(matrix, [0, 0, -1]);
    close(forward[0], 321 + Math.cos(angle) * 12); close(forward[2], 123 + Math.sin(angle) * 12); close(forward[1], 8);
    close(transformPoint4(matrix, [0, 1, 0])[1], 20);
  }
});

test('look-at centers the target and handles a vertical overview without NaN', () => {
  for (const [eye, target] of [[[10, 30, 100], [10, 0, 0]], [[0, 200, 0], [0, 0, 0]]]) {
    const matrix = lookAt4(eye, target);
    assert.ok([...matrix].every(Number.isFinite));
    const projected = transformPoint4(matrix, target);
    close(projected[0], 0); close(projected[1], 0); assert.ok(projected[2] < 0);
  }
});

test('road ribbon closes on the exact simulation centerline instead of smoothing corners', () => {
  const points = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
  const unchanged = structuredClone(points), ribbon = buildRoadRibbon(points, 20);
  assert.deepEqual(points, unchanged); assert.equal(ribbon.length, points.length);
  for (const [index, row] of ribbon.entries()) {
    close((row.left[0] + row.right[0]) / 2, points[index].x);
    close((row.left[1] + row.right[1]) / 2, points[index].y);
    close(Math.abs(row.left[0] - points[index].x), 10);
    close(Math.abs(row.left[1] - points[index].y), 10);
  }
});

test('all landmark meshes stay inside their declared corridor clearance footprints', () => {
  for (const kind of KART_LANDMARK_KINDS) {
    const mesh = buildLandmarkMesh({ kind, width: 43, height: 119, depth: 27, color: '#577c5a', accent: '#cc9d67' });
    assert.ok(mesh.positions.length > 0, kind); assert.equal(mesh.positions.length % 9, 0, kind);
    for (let index = 0; index < mesh.positions.length; index += 3) {
      assert.ok(Math.abs(mesh.positions[index]) <= 21.50001, `${kind} width`);
      assert.ok(mesh.positions[index + 1] >= -0.00001 && mesh.positions[index + 1] <= 119.00001, `${kind} height`);
      assert.ok(Math.abs(mesh.positions[index + 2]) <= 13.50001, `${kind} depth`);
      close(Math.hypot(...mesh.normals.slice(index, index + 3)), 1);
    }
  }
});

test('the complete circuit catalogue only requests implemented 3D landmark kinds', () => {
  for (const track of Object.values(getKartUniverseTracks())) {
    for (const landmark of track.environment.landmarks) assert.ok(KART_LANDMARK_KINDS.includes(landmark.kind), `${track.universe}: ${landmark.kind}`);
  }
});

test('Nexus, Halo, Alien, Sonic and Minecraft scenery produces real finite triangles', () => {
  const selected = new Set(['Nexus de Convergence', 'Halo', 'Alien', 'Sonic', 'Minecraft']);
  const tracks = Object.values(getKartUniverseTracks()).filter(track => selected.has(track.universe));
  assert.equal(tracks.length, selected.size);
  for (const track of tracks) {
    const before = JSON.stringify(track), mesh = buildKartEnvironmentMesh(track);
    assert.ok(mesh.positions.length > 1000); assert.ok(mesh.positions.every(Number.isFinite));
    assert.equal(mesh.normals.length, mesh.positions.length); assert.equal(mesh.colors.length, mesh.positions.length / 3 * 4);
    assert.deepEqual(mesh.unhandledLandmarks, []); assert.equal(JSON.stringify(track), before);
  }
});

test('driver atlas crops use the source frame and pixel trims, including a different fallback grid', () => {
  assert.deepEqual(getKartDriverCrop(480, 640, { columns: 4, rows: 8, col: 2, row: 3, trim: { left: 10, right: 20, top: 2, bottom: 8 } }),
    { x: 250, y: 242, width: 90, height: 70 });
  assert.deepEqual(getKartDriverCrop(256, 512, { columns: 1, rows: 1 }), { x: 0, y: 0, width: 256, height: 512 });
  assert.equal(getKartDriverCrop(0, 100), null);
});

test('mobile and very large canvases respect the actual pixel budget', () => {
  assert.deepEqual(getKartRenderSize(320, 180, 3), { width: 480, height: 270, pixelRatio: 1.5 });
  assert.deepEqual(getKartRenderSize(2560, 1440, 2), { width: 1920, height: 1080, pixelRatio: 0.75 });
  const portrait = getKartRenderSize(1400, 3000, 3);
  assert.ok(portrait.height <= 1440); assert.ok(portrait.width <= 1920);
});

function assertOverviewContains(renderer, point, label) {
  const matrix = renderer.viewProjection;
  const w = matrix[3] * point[0] + matrix[7] * point[1] + matrix[11] * point[2] + matrix[15];
  assert.ok(w > 0, `${label}: behind the overview camera`);
  const ndc = transformPoint4(matrix, point).map(component => component / w);
  assert.ok(Math.abs(ndc[0]) <= 0.84001, `${label}: horizontal crop or missing margin (${ndc[0]})`);
  assert.ok(Math.abs(ndc[1]) <= 0.84001, `${label}: vertical crop or missing margin (${ndc[1]})`);
  assert.ok(ndc[2] >= -1 && ndc[2] <= 1, `${label}: clipped by the depth range`);
}

test('overview contains the entire course and starting grid with margin in landscape, portrait and square viewports', () => {
  const surface = fakeSurface(), renderer = new KartRenderer3D(surface.canvas, { cameraMode: 'overview' });
  const engine = raceFixture();
  for (const track of Object.values(getKartUniverseTracks())) {
    engine.track = track;
    Object.assign(engine.player, { x: track.waypoints[3].x, y: track.waypoints[3].y, angle: 1.7 });
    const road = buildRoadRibbon(track.waypoints, track.roadWidth + 15);
    for (const [width, height] of [[1368, 844], [844, 390], [390, 784], [540, 540]]) {
      surface.canvas.width = width; surface.canvas.height = height;
      renderer._updateCamera(engine, 1 / 60);
      for (const row of road) {
        for (const [x, z] of [row.left, row.right]) assertOverviewContains(renderer, [x, 0, z], track.id);
      }
      for (const [dx, dz] of [[0, 0], [-40, 28], [42, 30], [0, 58]]) {
        for (const side of [-20, 20]) {
          assertOverviewContains(renderer, [track.start.x + dx + side, 30, track.start.y + dz + side], `${track.id} grid`);
        }
      }
    }
  }
  renderer.dispose();
});

test('overview stays centered on the track as racers move and fits a portrait resize immediately', () => {
  const surface = fakeSurface();
  let width = 1368, height = 844;
  surface.canvas.getBoundingClientRect = () => ({ width, height });
  const renderer = new KartRenderer3D(surface.canvas, { cameraMode: 'overview' }), engine = raceFixture();
  renderer.draw(engine);
  const before = renderer.getTelemetry().camera;
  Object.assign(engine.player, { x: 760, y: 100, angle: -1.2, speed: 310, boost: 2 });
  renderer.draw(engine);
  assert.deepEqual(renderer.getTelemetry().camera, before, 'overview is a complete track view, independent of player position and boost');
  width = 390; height = 784;
  renderer.draw(engine, 0);
  assert.notDeepEqual(renderer.getTelemetry().camera.eye, before.eye);
  for (const row of buildRoadRibbon(engine.track.waypoints, engine.track.roadWidth + 15)) {
    for (const [x, z] of [row.left, row.right]) assertOverviewContains(renderer, [x, 0, z], 'portrait resize');
  }
  renderer.dispose();
});

test('rendering submits perspective meshes without changing race state, rewards or checkpoints', () => {
  const surface = fakeSurface(), renderer = new KartRenderer3D(surface.canvas), engine = raceFixture();
  const before = JSON.stringify(engine);
  renderer.draw(engine, 1 / 60); renderer.draw(engine, 1 / 60);
  const info = renderer.getTelemetry();
  assert.equal(JSON.stringify(engine), before);
  assert.equal(info.renderer, 'webgl-3d'); assert.equal(info.frames, 2);
  assert.ok(info.triangles > 1000); assert.ok(info.drawCalls > 8); assert.equal(info.kartModels, 1);
  renderer.setCameraMode('overview'); renderer.draw(engine, 1 / 60);
  assert.equal(renderer.getTelemetry().cameraMode, 'overview');
  renderer.dispose();
  assert.equal(surface.liveBuffers.size + surface.livePrograms.size + surface.liveShaders.size, 0);
});

test('driver failure retries only the same character and reports an empty seat', () => {
  const surface = fakeSurface(), renderer = new KartRenderer3D(surface.canvas, { imageFactory: surface.imageFactory });
  renderer.draw(raceFixture(true), 1 / 60);
  assert.equal(surface.images[0].src, '/same-hero/source-a.png'); surface.images[0].onerror();
  assert.equal(surface.images[1].src, '/same-hero/source-b.png'); surface.images[1].onerror();
  const [driver] = renderer.getTelemetry().drivers;
  assert.equal(driver.heroId, 'hero-test'); assert.equal(driver.status, 'missing'); assert.equal(driver.source, null);
  assert.deepEqual(driver.failedSources, ['/same-hero/source-a.png', '/same-hero/source-b.png']);
  renderer.dispose();
});

test('disposal cancels late image callbacks and leaves the canvas usable for StrictMode remount', () => {
  const surface = fakeSurface(), renderer = new KartRenderer3D(surface.canvas, { imageFactory: surface.imageFactory });
  renderer.draw(raceFixture(true));
  assert.ok(surface.enabledAttributes.size > 0, 'exercise cleanup after drawing, not only construction');
  const oldCallback = surface.images[0].onload;
  renderer.dispose(); renderer.dispose(); oldCallback();
  assert.equal(surface.listeners.size, 0); assert.equal(surface.images[0].onload, null);
  assert.equal(surface.enabledAttributes.size, 0);
  assert.equal(surface.liveBuffers.size + surface.livePrograms.size + surface.liveTextures.size + surface.liveShaders.size, 0);
  const remounted = new KartRenderer3D(surface.canvas); remounted.draw(raceFixture()); remounted.dispose();
  assert.equal(surface.liveBuffers.size + surface.livePrograms.size, 0);
  assert.equal(surface.enabledAttributes.size, 0);
  assert.equal(surface.gl.getError(), 0);
});

test('context loss stops drawing and restoration recreates resources on the same simulation', () => {
  const surface = fakeSurface(), renderer = new KartRenderer3D(surface.canvas), engine = raceFixture();
  renderer.draw(engine); const before = JSON.stringify(engine);
  surface.lose(); assert.equal(renderer.getTelemetry().contextLost, true);
  assert.throws(() => renderer.draw(engine), /context was lost/);
  surface.restore(); renderer.draw(engine);
  assert.equal(renderer.getTelemetry().contextLost, false); assert.equal(JSON.stringify(engine), before);
  renderer.dispose(); assert.equal(surface.liveBuffers.size + surface.livePrograms.size, 0);
});

test('unsupported WebGL and shader link failure are explicit and do not leak partial resources', () => {
  assert.throws(() => new KartRenderer3D({ getContext: () => null }), /WebGL is unavailable/);
  const surface = fakeSurface({ failProgramAt: 2 });
  assert.throws(() => new KartRenderer3D(surface.canvas), /injected link failure/);
  assert.equal(surface.liveBuffers.size + surface.livePrograms.size + surface.liveTextures.size + surface.liveShaders.size, 0);
});
