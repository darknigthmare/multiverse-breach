import { buildKartMesh, KART_MODEL_SCALE } from './kartModel.js';
import {
  addBox, addDisc, addSphere, addTriangle, buildKartEnvironmentMesh, buildRoadRibbon, meshBuilder, toMeshData
} from './kartEnvironment3D.js';
import {
  clamp, colorRgba, identity4, kartWorldMatrix, lookAt4, multiply4, perspective4,
  rotationX4, rotationY4, scale4, transformPoint4, translation4
} from './kart3DMath.js';

// WebGL 1 deliberately uses no runtime CDN or new application dependency. The
// renderer consumes the existing race state; it never moves racers or awards a
// checkpoint. Reference: https://registry.khronos.org/webgl/specs/latest/1.0/
const MESH_VERTEX = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 aColor;
uniform mat4 uViewProjection;
uniform mat4 uModel;
uniform vec4 uTint;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
  vec4 world = uModel * vec4(aPosition, 1.0);
  vWorld = world.xyz;
  vNormal = normalize((uModel * vec4(aNormal, 0.0)).xyz);
  vColor = aColor * uTint;
  gl_Position = uViewProjection * world;
}`;

const FRAGMENT_PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const MESH_FRAGMENT = FRAGMENT_PRECISION + `
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
uniform vec3 uEye;
uniform vec3 uFog;
uniform vec2 uFogRange;
uniform float uLightMix;
void main() {
  vec3 normal = normalize(vNormal);
  float sun = max(dot(normal, normalize(vec3(-0.35, 0.92, 0.4))), 0.0);
  float illumination = 0.48 + 0.42 * sun + 0.10 * max(normal.y, 0.0);
  vec3 color = vColor.rgb * mix(1.0, illumination, uLightMix);
  float distanceToEye = length((vWorld - uEye) / 512.0) * 512.0;
  float fog = smoothstep(uFogRange.x, uFogRange.y, distanceToEye);
  gl_FragColor = vec4(mix(color, uFog, fog), vColor.a);
}`;

const SPRITE_VERTEX = `
attribute vec2 aPosition;
attribute vec2 aUv;
uniform mat4 uViewProjection;
uniform vec3 uOrigin;
uniform vec3 uRight;
uniform vec2 uSize;
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vWorld = uOrigin + uRight * aPosition.x * uSize.x + vec3(0.0, aPosition.y * uSize.y, 0.0);
  vUv = aUv;
  gl_Position = uViewProjection * vec4(vWorld, 1.0);
}`;

const SPRITE_FRAGMENT = FRAGMENT_PRECISION + `
varying vec2 vUv;
varying vec3 vWorld;
uniform sampler2D uTexture;
uniform vec3 uEye;
uniform vec3 uFog;
uniform vec2 uFogRange;
void main() {
  vec4 color = texture2D(uTexture, vUv);
  if (color.a < 0.035) discard;
  float distanceToEye = length((vWorld - uEye) / 512.0) * 512.0;
  float fog = smoothstep(uFogRange.x, uFogRange.y, distanceToEye);
  gl_FragColor = vec4(mix(color.rgb, uFog, fog), color.a);
}`;

const SKY_VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() { vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition, 0.9999, 1.0); }
`;
const SKY_FRAGMENT = FRAGMENT_PRECISION + `
varying vec2 vUv;
uniform vec3 uSky;
uniform vec3 uFog;
uniform float uYaw;
void main() {
  vec3 color = mix(uFog, uSky, smoothstep(0.0, 0.9, vUv.y));
  float darkSky = 1.0 - smoothstep(0.12, 0.4, dot(uSky, vec3(0.21, 0.72, 0.07)));
  vec2 gridUv = vec2(vUv.x + uYaw / 6.28318, vUv.y) * vec2(110.0, 70.0);
  float seed = fract(sin(dot(floor(gridUv), vec2(12.9898, 78.233))) * 43758.5453);
  float point = 1.0 - smoothstep(0.04, 0.12, length(fract(gridUv) - vec2(0.5)));
  color += vec3(step(0.993, seed) * point * darkSky * smoothstep(0.35, 0.8, vUv.y) * 0.4);
  gl_FragColor = vec4(color, 1.0);
}`;

function createProgram(gl, vertexSource, fragmentSource, attributes, uniforms) {
  const shaders = [];
  let program = null;
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('WebGL could not allocate a kart shader.');
      shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`Kart shader: ${gl.getShaderInfoLog(shader) || 'compilation failed'}`);
    }
    program = gl.createProgram();
    if (!program) throw new Error('WebGL could not allocate the kart shader program.');
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Kart program: ${gl.getProgramInfoLog(program) || 'link failed'}`);
    return {
      program,
      attributes: Object.fromEntries(attributes.map(name => [name, gl.getAttribLocation(program, name)])),
      uniforms: Object.fromEntries(uniforms.map(name => [name, gl.getUniformLocation(program, name)]))
    };
  } catch (error) {
    if (program) gl.deleteProgram(program);
    throw error;
  } finally {
    shaders.forEach(shader => gl.deleteShader(shader));
  }
}

/** Pixel crop from the atlas registry, before optional alpha-border trimming. */
export function getKartDriverCrop(imageWidth, imageHeight, descriptor = {}) {
  if (!(imageWidth > 0 && imageHeight > 0)) return null;
  const columns = Math.max(1, Math.floor(Number(descriptor.columns) || 1));
  const rows = Math.max(1, Math.floor(Number(descriptor.rows) || 1));
  const width = imageWidth / columns, height = imageHeight / rows;
  const col = clamp(Math.floor(Number(descriptor.col) || 0), 0, columns - 1);
  const row = clamp(Math.floor(Number(descriptor.row) || 0), 0, rows - 1);
  const trim = descriptor.trim || {};
  const left = clamp(Number(trim.left) || 0, 0, width - 1), right = clamp(Number(trim.right) || 0, 0, width - left - 1);
  const top = clamp(Number(trim.top) || 0, 0, height - 1), bottom = clamp(Number(trim.bottom) || 0, 0, height - top - 1);
  return { x: col * width + left, y: row * height + top, width: width - left - right, height: height - top - bottom };
}

/** A bounded backing buffer, independent of the 960×540 simulation space. */
export function getKartRenderSize(cssWidth, cssHeight, pixelRatio = 1, maxPixelRatio = 1.5) {
  const ratio = clamp(Number(pixelRatio) || 1, 1, clamp(Number(maxPixelRatio) || 1.5, 1, 2));
  const width = Math.max(1, Math.round(Number(cssWidth) || 960)), height = Math.max(1, Math.round(Number(cssHeight) || 540));
  const scale = Math.min(ratio, 1920 / width, 1440 / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)), pixelRatio: scale };
}

function fitOverviewCamera(track, aspect, fov) {
  // Fit the drivable course, including mitered road edges and the starting
  // grid. Distant scenery (e.g. Halo's ring) must not shrink the course itself.
  const roadWidth = Number(track.roadWidth) || 100;
  const outline = buildRoadRibbon(track.waypoints, roadWidth + 15).flatMap(row => [row.left, row.right]);
  if (!outline.length) outline.push(...track.waypoints.map(point => [point.x, point.y]));
  const start = track.start || track.waypoints[0];
  const gridRadius = Math.max(80, (roadWidth + 46) / 2);
  outline.push([start.x - gridRadius, start.y - gridRadius], [start.x + gridRadius, start.y + gridRadius]);
  const minX = Math.min(...outline.map(point => point[0])), maxX = Math.max(...outline.map(point => point[0]));
  const minZ = Math.min(...outline.map(point => point[1])), maxZ = Math.max(...outline.map(point => point[1]));
  const target = [(minX + maxX) / 2, 39, (minZ + maxZ) / 2];
  const backY = Math.sqrt(3) / 2, backZ = 0.5; // Fixed 60-degree elevation; north stays up.
  const margin = 0.84, tanY = Math.tan(fov / 2) * margin, tanX = tanY * Math.max(0.01, aspect);
  let distance = 100;
  for (const x of [minX, maxX]) {
    for (const y of [0, 78]) {
      for (const z of [minZ, maxZ]) {
        const dx = x - target[0], dy = y - target[1], dz = z - target[2];
        const towardEye = dy * backY + dz * backZ;
        const up = dy * backZ - dz * backY;
        // Perspective depth matters: corners nearer the eye need more room.
        distance = Math.max(distance, towardEye + Math.abs(dx) / tanX, towardEye + Math.abs(up) / tanY);
      }
    }
  }
  return {
    eye: [target[0], target[1] + backY * distance, target[2] + backZ * distance],
    target, yaw: -Math.PI / 2,
    far: Math.max(6500, distance + Math.hypot(maxX - minX, 78, maxZ - minZ) + 100)
  };
}

export class KartRenderer3D {
  constructor(canvas, options = {}) {
    if (!canvas?.getContext) throw new Error('A separate canvas is required for the 3D kart renderer.');
    this.canvas = canvas;
    this.options = options;
    this.cameraMode = options.cameraMode === 'overview' ? 'overview' : 'chase';
    this.disposed = false;
    this.contextLost = false;
    this.frames = 0;
    this.drawCalls = 0;
    this.triangles = 0;
    this.camera = null;
    this.track = null;
    this.sceneMesh = null;
    this.scene = null;
    this.buffers = new Set();
    this.programs = new Set();
    this.enabledAttributes = new Set();
    this.kartMeshes = new Map();
    this.driverTextures = new Map();
    this.wheelAngles = new Map();
    this.primitives = new Map();
    this.identity = identity4();
    this.gl = canvas.getContext('webgl', {
      alpha: false, antialias: true, depth: true, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'high-performance'
    });
    if (!this.gl) throw new Error('WebGL is unavailable. Select the explicit 2D kart view to continue.');
    this._onContextLost = event => {
      event.preventDefault();
      this.contextLost = true;
      for (const record of this.driverTextures.values()) record.texture = null;
      this.options.onContextLost?.();
    };
    this._onContextRestored = () => {
      if (this.disposed) return;
      try {
        this.contextLost = false;
        this._dropInvalidResources();
        this._initializeGpu();
        this.track = null;
        for (const record of this.driverTextures.values()) {
          record.texture = null;
          if (record.bitmap) this._uploadDriver(record);
        }
        this.options.onContextRestored?.();
      } catch (error) {
        this.contextLost = true;
        this._releaseGpu();
        this.options.onError?.(error);
      }
    };
    try {
      this._initializeGpu();
      canvas.addEventListener('webglcontextlost', this._onContextLost, false);
      canvas.addEventListener('webglcontextrestored', this._onContextRestored, false);
      this.resize();
    } catch (error) {
      this._releaseGpu();
      throw error;
    }
  }

  _initializeGpu() {
    const gl = this.gl;
    this.meshProgram = createProgram(gl, MESH_VERTEX, MESH_FRAGMENT,
      ['aPosition', 'aNormal', 'aColor'], ['uViewProjection', 'uModel', 'uTint', 'uEye', 'uFog', 'uFogRange', 'uLightMix']);
    this.programs.add(this.meshProgram.program);
    this.spriteProgram = createProgram(gl, SPRITE_VERTEX, SPRITE_FRAGMENT,
      ['aPosition', 'aUv'], ['uViewProjection', 'uOrigin', 'uRight', 'uSize', 'uTexture', 'uEye', 'uFog', 'uFogRange']);
    this.programs.add(this.spriteProgram.program);
    this.skyProgram = createProgram(gl, SKY_VERTEX, SKY_FRAGMENT, ['aPosition'], ['uSky', 'uFog', 'uYaw']);
    this.programs.add(this.skyProgram.program);
    this.skyBuffer = this._buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
    this.spriteBuffer = this._buffer(new Float32Array([
      -0.5, 0, 0, 0, 0.5, 0, 1, 0, 0.5, 1, 1, 1,
      -0.5, 0, 0, 0, 0.5, 1, 1, 1, -0.5, 1, 0, 1
    ]));
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  _buffer(data) {
    const gl = this.gl, buffer = gl.createBuffer();
    if (!buffer) throw new Error('WebGL could not allocate a kart vertex buffer.');
    this.buffers.add(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  }

  _uploadMesh(data) {
    const count = data.positions.length / 3;
    if (count % 3 !== 0 || data.normals.length !== count * 3 || data.colors.length !== count * 4) throw new Error('Invalid kart triangle mesh.');
    const packed = new Float32Array(count * 10);
    for (let index = 0; index < count; index += 1) {
      packed.set(data.positions.subarray ? data.positions.subarray(index * 3, index * 3 + 3) : data.positions.slice(index * 3, index * 3 + 3), index * 10);
      packed.set(data.normals.subarray ? data.normals.subarray(index * 3, index * 3 + 3) : data.normals.slice(index * 3, index * 3 + 3), index * 10 + 3);
      packed.set(data.colors.subarray ? data.colors.subarray(index * 4, index * 4 + 4) : data.colors.slice(index * 4, index * 4 + 4), index * 10 + 6);
    }
    return { buffer: this._buffer(packed), count, parts: data.parts || [], driverAnchor: data.driverAnchor || [0, 0.78, 0.18] };
  }

  _setTrack(track) {
    if (this.track === track) return;
    const scene = buildKartEnvironmentMesh(track);
    const replacement = this._uploadMesh(scene);
    if (this.sceneMesh) { this.gl.deleteBuffer(this.sceneMesh.buffer); this.buffers.delete(this.sceneMesh.buffer); }
    this.sceneMesh = replacement;
    this.scene = scene;
    this.track = track;
    this.camera = null;
    this.checkFirstFrame = true;
  }

  resize(width, height, pixelRatio) {
    if (this.disposed) return;
    const rect = this.canvas.getBoundingClientRect?.();
    const size = getKartRenderSize(width || rect?.width || this.canvas.clientWidth || 960,
      height || rect?.height || this.canvas.clientHeight || 540,
      pixelRatio || globalThis.devicePixelRatio || 1, this.options.maxPixelRatio);
    if (this.canvas.width !== size.width) this.canvas.width = size.width;
    if (this.canvas.height !== size.height) this.canvas.height = size.height;
    this.renderSize = size;
    this.gl.viewport(0, 0, size.width, size.height);
  }

  setCameraMode(mode) {
    const next = mode === 'overview' ? 'overview' : 'chase';
    if (this.cameraMode !== next) { this.cameraMode = next; this.camera = null; }
  }

  _updateCamera(engine, dt) {
    const player = engine.player;
    const previous = this.camera;
    let yaw = player.angle;
    if (previous && this.cameraMode === 'chase') {
      const delta = Math.atan2(Math.sin(yaw - previous.yaw), Math.cos(yaw - previous.yaw));
      yaw = previous.yaw + delta * (1 - Math.exp(-dt * 9));
    }
    const speed = Math.abs(player.speed || 0);
    const aspect = this.canvas.width / this.canvas.height;
    const fov = (this.cameraMode === 'overview' ? 52 : 58 + Math.min(4, speed / 110) + (player.boost > 0 ? 3 : 0)) * Math.PI / 180;
    const desired = this.cameraMode === 'overview'
      ? fitOverviewCamera(engine.track, aspect, fov)
      : { eye: [player.x - Math.cos(yaw) * 106, 58, player.y - Math.sin(yaw) * 106],
        target: [player.x + Math.cos(yaw) * 70, 9, player.y + Math.sin(yaw) * 70], yaw };
    const snap = this.cameraMode === 'overview' || !previous || Math.hypot(player.x - previous.playerX, player.y - previous.playerZ) > 180;
    const blend = snap ? 1 : 1 - Math.exp(-dt * 14);
    const eye = desired.eye.map((value, index) => previous && !snap ? previous.eye[index] + (value - previous.eye[index]) * blend : value);
    // Camera movement is presentation-only. Snap after a portal/recovery instead
    // of carrying a long, disorienting interpolation through scenery. Overview
    // also reframes immediately on resize; smoothing could leave corners cut.
    this.camera = { eye, target: desired.target, yaw: desired.yaw, playerX: player.x, playerZ: player.y, fov };
    this.viewProjection = multiply4(perspective4(fov, aspect, 1, desired.far || 6500), lookAt4(eye, desired.target));
  }

  _attribute(location, size, stride, offset) {
    if (location < 0) return;
    const gl = this.gl;
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
    this.enabledAttributes.add(location);
  }

  _sharedUniforms(program) {
    const gl = this.gl, u = program.uniforms, environment = this.scene.environment;
    gl.uniformMatrix4fv(u.uViewProjection, false, this.viewProjection);
    gl.uniform3fv(u.uEye, this.camera.eye);
    gl.uniform3fv(u.uFog, colorRgba(environment.fog).slice(0, 3));
    gl.uniform2f(u.uFogRange, Number(environment.fogNear) || 700, Number(environment.fogFar) || 3200);
  }

  _drawSky() {
    const gl = this.gl, program = this.skyProgram;
    gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.disable(gl.BLEND);
    gl.useProgram(program.program); gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBuffer);
    this._attribute(program.attributes.aPosition, 2, 8, 0);
    gl.uniform3fv(program.uniforms.uSky, colorRgba(this.scene.environment.sky).slice(0, 3));
    gl.uniform3fv(program.uniforms.uFog, colorRgba(this.scene.environment.fog).slice(0, 3));
    gl.uniform1f(program.uniforms.uYaw, this.camera.yaw);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.drawCalls += 1; this.triangles += 2;
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.enable(gl.BLEND);
  }

  _drawMesh(mesh, model = this.identity, color = [1, 1, 1, 1], lightMix = 1, range = null) {
    const gl = this.gl, program = this.meshProgram;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    this._attribute(program.attributes.aPosition, 3, 40, 0);
    this._attribute(program.attributes.aNormal, 3, 40, 12);
    this._attribute(program.attributes.aColor, 4, 40, 24);
    gl.uniformMatrix4fv(program.uniforms.uModel, false, model);
    gl.uniform4fv(program.uniforms.uTint, colorRgba(color));
    gl.uniform1f(program.uniforms.uLightMix, lightMix);
    const count = range?.count ?? mesh.count;
    gl.drawArrays(gl.TRIANGLES, range?.start || 0, count);
    this.drawCalls += 1; this.triangles += count / 3;
  }

  _primitive(id) {
    if (this.primitives.has(id)) return this.primitives.get(id);
    const mesh = meshBuilder();
    if (id === 'cube') addBox(mesh, 0, -0.5, 0, 1, 1, 1, '#ffffff');
    else if (id === 'disc') addDisc(mesh, 0, 0, 0, 1, '#ffffff');
    else if (id === 'sphere') addSphere(mesh, 0, 0, 0, 1, 1, 1, '#ffffff', 10, 6);
    else {
      const ring = [[1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1]];
      for (let i = 0; i < 4; i += 1) {
        addTriangle(mesh, ring[i], [0, 1, 0], ring[(i + 1) % 4], '#ffffff');
        addTriangle(mesh, ring[(i + 1) % 4], [0, -1, 0], ring[i], '#ffffff');
      }
    }
    const result = this._uploadMesh(toMeshData(mesh));
    this.primitives.set(id, result);
    return result;
  }

  _drawRaceObjects(engine) {
    const cube = this._primitive('cube'), diamond = this._primitive('diamond'), sphere = this._primitive('sphere'), disc = this._primitive('disc');
    const time = Number(engine.time) || 0;
    for (const box of engine.track.itemBoxes || []) {
      if (box.respawn > 0) continue;
      const pose = multiply4(translation4(box.x, 12 + Math.sin(time * 2.7 + box.x) * 2, box.y), rotationY4(time * 1.2));
      this._drawMesh(cube, multiply4(pose, scale4(12)), '#78dcd0', 0.4);
      this._drawMesh(diamond, multiply4(pose, scale4(4, 8, 4)), '#f1ffe7', 0);
    }
    for (const fragment of engine.track.fragmentPickups || []) {
      if (fragment.collected) continue;
      const pose = multiply4(translation4(fragment.x, 11 + Math.sin(time * 3 + fragment.x) * 2, fragment.y), rotationY4(time));
      this._drawMesh(diamond, multiply4(pose, scale4(5, 9, 5)), '#f4d88c', 0.3);
    }
    for (const hazard of engine.track.hazards || []) {
      const radius = clamp((Number(hazard.r) || 16) * 0.42, 7, 18);
      const pose = translation4(hazard.x, radius * 0.45, hazard.y);
      this._drawMesh(sphere, multiply4(pose, scale4(radius, radius * 0.55, radius)), '#c04c56', 1);
      this._drawMesh(diamond, multiply4(translation4(hazard.x, radius + 5, hazard.y), scale4(3, 4, 3)), '#ffb0a2', 0);
    }
    for (const marker of engine.track.objective?.markers || []) {
      if (marker.collected) continue;
      this._drawMesh(diamond, multiply4(translation4(marker.x, 24 + Math.sin(time * 2) * 3, marker.y), scale4(7, 12, 7)), '#b4a0f4', 0);
    }
    for (const projectile of engine.projectiles || []) {
      this._drawMesh(diamond, multiply4(translation4(projectile.x, 9, projectile.y), scale4(5, 5, 5)), '#f7aef4', 0);
    }
    for (const particle of (engine.particles || []).slice(-80)) {
      const alpha = clamp((Number(particle.life) || 0) * 2.4, 0, 1);
      this._drawMesh(diamond, multiply4(translation4(particle.x, 4 + alpha * 7, particle.y), scale4(1.5)), colorRgba(particle.color, alpha), 0);
    }
    // Ground cues use depth testing and transparent surfaces; the collision
    // radii and timings still belong to the actual EngineRace surface zones.
    this.gl.depthMask(false);
    for (const zone of engine.track.surfaceZones || []) {
      const colors = { ice: [0.5, 0.8, 1, 0.58], slow: [0.39, 0.24, 0.2, 0.65], jump: [0.94, 0.65, 0.21, 0.72], portal: [0.64, 0.4, 0.93, 0.55] };
      this._drawMesh(disc, multiply4(translation4(zone.x, 0.75, zone.y), scale4(zone.r || 25)), colors[zone.type] || [0.6, 0.7, 0.8, 0.3], 0);
    }
    this.gl.depthMask(true);
  }

  _kartMesh(spec, racer) {
    const key = `${spec?.id || racer.id}:${spec?.color || racer.color}:${spec?.accent || ''}:${spec?.detailColor || ''}:${spec?.modelVersion || ''}`;
    if (!this.kartMeshes.has(key)) this.kartMeshes.set(key, this._uploadMesh(buildKartMesh(spec || { color: racer.color })));
    return this.kartMeshes.get(key);
  }

  _drawKarts(engine, dt) {
    const racers = [engine.player, ...(engine.opponents || [])], drivers = [], disc = this._primitive('disc');
    const time = Number(engine.time) || 0;
    for (const racer of racers) {
      const spec = racer.kartSpec;
      const mesh = this._kartMesh(spec, racer);
      const altitude = racer.air > 0 ? Math.sin(clamp(racer.air / 0.56, 0, 1) * Math.PI) * 16 : 0;
      const shadowScale = 1 - altitude / 80;
      this.gl.depthMask(false);
      this._drawMesh(disc, multiply4(translation4(racer.x, 0.83, racer.y), scale4(20 * shadowScale, 1, 16 * shadowScale)), [0.015, 0.025, 0.03, 0.35], 0);
      this.gl.depthMask(true);
      const pose = kartWorldMatrix(racer, KART_MODEL_SCALE, altitude + 0.85);
      const bodyTint = racer.hitCooldown > 0 && Math.floor(time * 18) % 2 ? [1, 0.75, 0.7, 1] : [1, 1, 1, 1];
      const wheelRadius = mesh.parts.find(part => part.kind === 'wheel')?.radius || 0.33;
      const wheelAngle = (this.wheelAngles.get(racer.id) || 0) + (racer.speed || 0) * dt / (KART_MODEL_SCALE * wheelRadius);
      this.wheelAngles.set(racer.id, wheelAngle % (Math.PI * 2));
      if (!mesh.parts.length) this._drawMesh(mesh, pose, bodyTint);
      for (const part of mesh.parts) {
        if (part.kind !== 'wheel') { this._drawMesh(mesh, pose, bodyTint, 1, part); continue; }
        const pivot = part.pivot || [0, 0, 0];
        const steering = part.steering ? -(Number(racer.steerInput) || 0) * 0.4 : 0;
        const rotation = multiply4(rotationY4(steering), rotationX4(wheelAngle));
        const aroundPivot = multiply4(multiply4(translation4(...pivot), rotation), translation4(...pivot.map(n => -n)));
        this._drawMesh(mesh, multiply4(pose, aroundPivot), bodyTint, 1, part);
      }
      if (racer.boost > 0) {
        const flame = transformPoint4(pose, [0, 0.4, 1.8]);
        const shape = multiply4(translation4(...flame), rotationY4(-racer.angle - Math.PI / 2));
        this._drawMesh(this._primitive('diamond'), multiply4(shape, scale4(4, 3, 10 + Math.sin(time * 33) * 2)), '#86dfff', 0);
      }
      if (racer.shield > 0) {
        this.gl.depthMask(false);
        this._drawMesh(this._primitive('sphere'), multiply4(translation4(racer.x, 15 + altitude, racer.y), scale4(25, 20, 25)), [0.3, 0.85, 1, 0.15], 0);
        this.gl.depthMask(true);
      }
      if (spec?.driverSprite?.candidates?.length || spec?.driverSprite?.src) {
        drivers.push({ racer, spec, origin: transformPoint4(pose, spec.driverAnchor || mesh.driverAnchor) });
      }
    }
    return drivers;
  }

  _makeCanvas(width, height) {
    const canvas = this.options.canvasFactory?.(width, height)
      || this.canvas.ownerDocument?.createElement('canvas')
      || (typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(width, height) : null);
    if (!canvas) throw new Error('No canvas is available for the character atlas crop.');
    canvas.width = width; canvas.height = height;
    return canvas;
  }

  _cropDriver(image, descriptor) {
    const crop = getKartDriverCrop(image.naturalWidth || image.width, image.naturalHeight || image.height, descriptor);
    if (!crop) throw new Error('The character atlas has no usable dimensions.');
    const ratio = Math.min(1, 512 / Math.max(crop.width, crop.height));
    const full = this._makeCanvas(Math.max(1, Math.round(crop.width * ratio)), Math.max(1, Math.round(crop.height * ratio)));
    const context = full.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('The character atlas crop could not be initialized.');
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, full.width, full.height);
    const pixels = context.getImageData(0, 0, full.width, full.height).data;
    let left = full.width, right = -1, top = full.height, bottom = -1;
    for (let y = 0; y < full.height; y += 1) {
      for (let x = 0; x < full.width; x += 1) {
        if (pixels[(y * full.width + x) * 4 + 3] < 20) continue;
        left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
    if (right < left || bottom < top) throw new Error('The selected character atlas frame is transparent.');
    const upperBodyRatio = clamp(Number(descriptor.upperBodyRatio) || 0.68, 0.25, 1);
    const width = right - left + 1, height = Math.max(1, Math.round((bottom - top + 1) * upperBodyRatio));
    const result = this._makeCanvas(width, height), resultContext = result.getContext('2d');
    if (!resultContext) throw new Error('The driver sprite could not be cropped.');
    resultContext.drawImage(full, left, top, width, height, 0, 0, width, height);
    return result;
  }

  _uploadDriver(record) {
    if (this.disposed || this.contextLost || !record.bitmap) return;
    const gl = this.gl, texture = gl.createTexture();
    if (!texture) throw new Error('WebGL could not allocate the driver texture.');
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, record.bitmap);
      if (record.texture) gl.deleteTexture(record.texture);
      record.texture = texture;
      record.status = 'ready';
    } catch (error) {
      gl.deleteTexture(texture);
      throw error;
    }
  }

  _driver(spec) {
    const driver = spec.driverSprite;
    const key = `${spec.heroId || spec.id}:${driver.candidates?.map(candidate => candidate.src).join('|') || driver.src}`;
    if (this.driverTextures.has(key)) return this.driverTextures.get(key);
    const record = { heroId: spec.heroId || spec.id, status: 'loading', source: null, texture: null, bitmap: null, failedSources: [], image: null };
    this.driverTextures.set(key, record);
    const candidates = driver.candidates?.length ? driver.candidates : [driver];
    const trySource = index => {
      if (this.disposed) return;
      if (index >= candidates.length) { record.status = 'missing'; return; }
      const descriptor = candidates[index];
      if (!descriptor.src) { trySource(index + 1); return; }
      const image = this.options.imageFactory?.() || new Image();
      record.image = image;
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (this.disposed) return;
        try {
          record.bitmap = this._cropDriver(image, descriptor);
          record.source = descriptor.src;
          record.aspect = record.bitmap.width / record.bitmap.height;
          this._uploadDriver(record);
        } catch {
          record.failedSources.push(descriptor.src);
          record.bitmap = null;
          trySource(index + 1);
        }
      };
      image.onerror = () => {
        if (this.disposed) return;
        record.failedSources.push(descriptor.src);
        trySource(index + 1);
      };
      image.src = descriptor.src;
    };
    trySource(0);
    return record;
  }

  _drawDrivers(drivers) {
    const gl = this.gl, program = this.spriteProgram, eye = this.camera.eye;
    gl.useProgram(program.program); this._sharedUniforms(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteBuffer);
    this._attribute(program.attributes.aPosition, 2, 16, 0);
    this._attribute(program.attributes.aUv, 2, 16, 8);
    gl.uniform1i(program.uniforms.uTexture, 0);
    gl.activeTexture(gl.TEXTURE0);
    drivers.sort((a, b) => Math.hypot(...b.origin.map((value, index) => value - eye[index])) - Math.hypot(...a.origin.map((value, index) => value - eye[index])));
    for (const driver of drivers) {
      const texture = this._driver(driver.spec);
      if (texture.status !== 'ready' || !texture.texture) continue;
      const dx = eye[0] - driver.origin[0], dz = eye[2] - driver.origin[2], length = Math.hypot(dx, dz) || 1;
      const height = Math.min(28, 35 / texture.aspect), width = height * texture.aspect;
      gl.uniform3fv(program.uniforms.uOrigin, driver.origin);
      gl.uniform3fv(program.uniforms.uRight, [dz / length, 0, -dx / length]);
      gl.uniform2f(program.uniforms.uSize, width, height);
      gl.bindTexture(gl.TEXTURE_2D, texture.texture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      this.drawCalls += 1; this.triangles += 2;
    }
  }

  draw(engine, elapsed = 1 / 60) {
    if (this.disposed) return false;
    if (this.contextLost || this.gl.isContextLost()) throw new Error('The 3D kart graphics context was lost. Restart the race or select 2D.');
    if (!engine?.player || !engine.track) throw new Error('The 3D kart renderer needs a live race state.');
    const start = globalThis.performance?.now?.() || 0;
    const dt = clamp(Number(elapsed) || 0, 0, 0.05);
    this._setTrack(engine.track);
    this.resize();
    this._updateCamera(engine, dt);
    const gl = this.gl;
    this.drawCalls = 0; this.triangles = 0;
    gl.depthMask(true); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this._drawSky();
    gl.useProgram(this.meshProgram.program); this._sharedUniforms(this.meshProgram);
    this._drawMesh(this.sceneMesh);
    this._drawRaceObjects(engine);
    const drivers = this._drawKarts(engine, dt);
    this._drawDrivers(drivers);
    if (this.checkFirstFrame) {
      this.checkFirstFrame = false;
      const error = gl.getError?.();
      if (error) throw new Error(`Kart WebGL draw failed (0x${error.toString(16)}).`);
    }
    this.frames += 1;
    this.lastCpuMs = Math.max(0, (globalThis.performance?.now?.() || start) - start);
    return true;
  }

  getTelemetry() {
    return {
      renderer: 'webgl-3d', contextLost: this.contextLost, disposed: this.disposed,
      cameraMode: this.cameraMode, frames: this.frames, drawCalls: this.drawCalls, triangles: this.triangles,
      staticTriangles: (this.sceneMesh?.count || 0) / 3, kartModels: this.kartMeshes.size,
      landmarks: this.scene?.landmarkCount || 0, unhandledLandmarks: this.scene?.unhandledLandmarks || [],
      backingWidth: this.canvas.width, backingHeight: this.canvas.height, frameCpuMs: this.lastCpuMs || 0,
      drivers: [...this.driverTextures.values()].map(({ heroId, status, source, failedSources }) => ({ heroId, status, source, failedSources: [...failedSources] })),
      camera: this.camera ? { eye: [...this.camera.eye], target: [...this.camera.target], fov: this.camera.fov } : null
    };
  }

  _dropInvalidResources() {
    this.buffers.clear(); this.programs.clear(); this.kartMeshes.clear(); this.primitives.clear();
    this.enabledAttributes.clear();
    this.sceneMesh = null;
  }

  _releaseGpu() {
    if (!this.gl) return;
    // deleteBuffer detaches its attribute pointers without disabling them.
    // A later renderer on this canvas must be able to draw its sky first.
    for (const location of this.enabledAttributes) this.gl.disableVertexAttribArray(location);
    for (const buffer of this.buffers) this.gl.deleteBuffer(buffer);
    for (const program of this.programs) this.gl.deleteProgram(program);
    for (const record of this.driverTextures.values()) if (record.texture) this.gl.deleteTexture(record.texture);
    this._dropInvalidResources();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.canvas.removeEventListener('webglcontextlost', this._onContextLost, false);
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    for (const record of this.driverTextures.values()) {
      if (record.image) { record.image.onload = null; record.image.onerror = null; }
    }
    this._releaseGpu();
    this.driverTextures.clear(); this.wheelAngles.clear();
    this.scene = null; this.track = null; this.camera = null;
    // Do not loseContext(): React StrictMode may immediately reuse this canvas.
  }
}
