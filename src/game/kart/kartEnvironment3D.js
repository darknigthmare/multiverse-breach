import { clamp, colorRgba, cross3, normalize3, tint } from './kart3DMath.js';
import { getKartTrackEnvironment } from './kartTracks.js';

// Small authored meshes, deliberately separate from the simulation/collision
// track. A landmark is scenery; adding one never silently adds a racing hazard.
export const KART_LANDMARK_KINDS = Object.freeze([
  'tower', 'clock-tower', 'spire', 'crystal', 'arch', 'gate', 'portal', 'hangar',
  'tree', 'palm', 'voxel-tree', 'rock', 'mountain', 'canyon', 'ruins', 'ring',
  'halo-ring', 'pipe', 'mushroom', 'temple', 'pyramid', 'industrial', 'reactor',
  'castle', 'house', 'checker-hill', 'frigate', 'ship', 'antenna', 'dish', 'block',
  'forerunner', 'bulkhead', 'sandstone-terrace'
]);

export function meshBuilder() {
  return { positions: [], normals: [], colors: [] };
}

export function addTriangle(mesh, a, b, c, value = '#ffffff') {
  const cross = cross3(b.map((n, i) => n - a[i]), c.map((n, i) => n - a[i]));
  if (Math.hypot(...cross) < 0.000001) return;
  const normal = normalize3(cross), color = colorRgba(value);
  mesh.positions.push(...a, ...b, ...c);
  for (let i = 0; i < 3; i += 1) { mesh.normals.push(...normal); mesh.colors.push(...color); }
}

export function addQuad(mesh, a, b, c, d, color) {
  addTriangle(mesh, a, b, c, color); addTriangle(mesh, a, c, d, color);
}

export function addBox(mesh, x, y, z, width, height, depth, color) {
  const a = x - width / 2, b = x + width / 2, c = z - depth / 2, d = z + depth / 2, top = y + height;
  addQuad(mesh, [a, top, c], [a, top, d], [b, top, d], [b, top, c], color);
  addQuad(mesh, [a, y, d], [a, y, c], [b, y, c], [b, y, d], color);
  addQuad(mesh, [a, y, c], [a, top, c], [b, top, c], [b, y, c], color);
  addQuad(mesh, [b, y, d], [b, top, d], [a, top, d], [a, y, d], color);
  addQuad(mesh, [a, y, d], [a, top, d], [a, top, c], [a, y, c], color);
  addQuad(mesh, [b, y, c], [b, top, c], [b, top, d], [b, y, d], color);
}

export function addCylinder(mesh, x, y, z, radius, height, color, sides = 12, topRadius = radius) {
  for (let index = 0; index < sides; index += 1) {
    const a = index / sides * Math.PI * 2, b = (index + 1) / sides * Math.PI * 2;
    const lowA = [x + Math.cos(a) * radius, y, z + Math.sin(a) * radius];
    const lowB = [x + Math.cos(b) * radius, y, z + Math.sin(b) * radius];
    const topA = [x + Math.cos(a) * topRadius, y + height, z + Math.sin(a) * topRadius];
    const topB = [x + Math.cos(b) * topRadius, y + height, z + Math.sin(b) * topRadius];
    addQuad(mesh, lowA, topA, topB, lowB, color);
    addTriangle(mesh, [x, y + height, z], topB, topA, color);
    addTriangle(mesh, [x, y, z], lowA, lowB, color);
  }
}

export function addSphere(mesh, x, y, z, rx, ry, rz, color, sides = 10, bands = 6) {
  const point = (longitude, latitude) => [
    x + Math.cos(longitude) * Math.sin(latitude) * rx,
    y + Math.cos(latitude) * ry,
    z + Math.sin(longitude) * Math.sin(latitude) * rz
  ];
  for (let row = 0; row < bands; row += 1) {
    for (let column = 0; column < sides; column += 1) {
      const a = column / sides * Math.PI * 2, b = (column + 1) / sides * Math.PI * 2;
      const c = row / bands * Math.PI, d = (row + 1) / bands * Math.PI;
      addQuad(mesh, point(a, c), point(a, d), point(b, d), point(b, c), color);
    }
  }
}

export function addDisc(mesh, x, y, z, radius, color, sides = 24) {
  for (let index = 0; index < sides; index += 1) {
    const a = index / sides * Math.PI * 2, b = (index + 1) / sides * Math.PI * 2;
    addTriangle(mesh, [x, y, z], [x + Math.cos(b) * radius, y, z + Math.sin(b) * radius],
      [x + Math.cos(a) * radius, y, z + Math.sin(a) * radius], color);
  }
}

function addRing(mesh, width, height, depth, color, accent, centerY = height / 2) {
  const tube = Math.min(width * 0.16, height * 0.16, depth / 2);
  const rx = width / 2 - tube, ry = height / 2 - tube;
  const segments = width > 500 ? 64 : 28, sides = 8;
  const point = (angle, around) => [
    Math.cos(angle) * (rx + Math.cos(around) * tube),
    centerY + Math.sin(angle) * (ry + Math.cos(around) * tube),
    Math.sin(around) * tube
  ];
  for (let i = 0; i < segments; i += 1) {
    for (let j = 0; j < sides; j += 1) {
      const a = i / segments * Math.PI * 2, b = (i + 1) / segments * Math.PI * 2;
      const c = j / sides * Math.PI * 2, d = (j + 1) / sides * Math.PI * 2;
      addQuad(mesh, point(a, c), point(a, d), point(b, d), point(b, c), i % 7 === 0 ? accent : color);
    }
  }
}

function addRoof(mesh, width, y, height, depth, color) {
  const a = -width / 2, b = width / 2, c = -depth / 2, d = depth / 2;
  addQuad(mesh, [a, y, c], [a, y, d], [0, y + height, d], [0, y + height, c], color);
  addQuad(mesh, [0, y + height, c], [0, y + height, d], [b, y, d], [b, y, c], color);
  addTriangle(mesh, [a, y, c], [0, y + height, c], [b, y, c], color);
  addTriangle(mesh, [b, y, d], [0, y + height, d], [a, y, d], color);
}

function addTaperedBlock(mesh, x, y, z, width, height, depth, taper, color) {
  const a = [x - width / 2, y, z - depth / 2], b = [x + width / 2, y, z - depth / 2];
  const c = [x + width / 2, y, z + depth / 2], d = [x - width / 2, y, z + depth / 2];
  const p = [x - width * taper / 2, y + height, z - depth * taper / 2];
  const q = [x + width * taper / 2, y + height, z - depth * taper / 2];
  const r = [x + width * taper / 2, y + height, z + depth * taper / 2];
  const s = [x - width * taper / 2, y + height, z + depth * taper / 2];
  addQuad(mesh, a, p, q, b, color); addQuad(mesh, b, q, r, c, color);
  addQuad(mesh, c, r, s, d, color); addQuad(mesh, d, s, p, a, color);
  addQuad(mesh, p, s, r, q, color); addQuad(mesh, a, b, c, d, color);
}

function mergePlaced(destination, source, x, y, z, yaw = 0, scale = 1) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  for (let i = 0; i < source.positions.length; i += 3) {
    const a = source.positions[i], b = source.positions[i + 1], d = source.positions[i + 2];
    destination.positions.push(x + (a * c + d * s) * scale, y + b * scale, z + (-a * s + d * c) * scale);
    const nx = source.normals[i], ny = source.normals[i + 1], nz = source.normals[i + 2];
    destination.normals.push(nx * c + nz * s, ny, -nx * s + nz * c);
  }
  // The meshes are small but the full scenery may exceed the spread call limit.
  for (const component of source.colors) destination.colors.push(component);
}

export function buildLandmarkMesh(landmark) {
  const mesh = meshBuilder();
  const w = Math.max(2, Number(landmark.width) || 40), h = Math.max(2, Number(landmark.height) || 70);
  const d = Math.max(2, Number(landmark.depth) || 36);
  const color = landmark.color || '#657785', accent = landmark.accent || '#8ad8d3';
  const kind = landmark.kind || 'rock';
  if (kind === 'block') {
    addBox(mesh, 0, 0, 0, w, h, d, color);
    addBox(mesh, 0, h, 0, w, Math.max(1, h * 0.025), d, accent);
  } else if (kind === 'forerunner') {
    addBox(mesh, 0, 0, 0, w, h * 0.08, d, tint(color, 0.75));
    for (const side of [-1, 1]) {
      addTaperedBlock(mesh, side * w * 0.33, h * 0.08, 0, w * 0.33, h * 0.78, d, 0.48, color);
      addBox(mesh, side * w * 0.33, h * 0.14, -d * 0.505, w * 0.035, h * 0.46, 1, accent);
      addTaperedBlock(mesh, side * w * 0.43, 0, -d * 0.18, w * 0.14, h * 0.5, d * 0.7, 0.42, tint(color, 0.8));
    }
    addTaperedBlock(mesh, 0, h * 0.72, 0, w * 0.75, h * 0.28, d * 0.58, 0.56, color);
    addBox(mesh, 0, h * 0.75, -d * 0.3, w * 0.28, h * 0.03, 1, accent);
  } else if (kind === 'sandstone-terrace') {
    for (let i = 0; i < 4; i += 1) addBox(mesh, 0, i * h * 0.06, 0, w * (1 - i * 0.07), h * 0.06, d * (1 - i * 0.07), color);
    for (const side of [-1, 1]) {
      addTaperedBlock(mesh, side * w * 0.3, h * 0.24, 0, w * 0.29, h * 0.76, d * 0.58, 0.75, color);
      addBox(mesh, side * w * 0.3, h * 0.9, -d * 0.3, w * 0.23, h * 0.045, 1, accent);
    }
  } else if (kind === 'bulkhead') {
    for (const side of [-1, 1]) addBox(mesh, side * w * 0.44, 0, 0, w * 0.12, h, d, color);
    addBox(mesh, 0, h * 0.88, 0, w, h * 0.12, d, color);
    for (let i = 0; i < 5; i += 1) {
      for (const side of [-1, 1]) addBox(mesh, side * w * 0.37, i * h * 0.17, -d * 0.05, w * 0.06, h * 0.035, d * 1.2, tint(color, 0.65));
      addBox(mesh, -w * 0.34 + i * w * 0.17, h * 0.82, -d * 0.05, w * 0.03, h * 0.05, d * 1.2, tint(color, 0.65));
    }
    addBox(mesh, 0, h * 0.9, -d * 0.51, w * 0.48, h * 0.025, 1, accent);
  } else if (['ring', 'halo-ring', 'portal'].includes(kind)) {
    addRing(mesh, w, h, d, color, accent);
    if (kind !== 'halo-ring') addBox(mesh, 0, 0, 0, w * 0.65, h * 0.06, d * 1.6, tint(color, 0.7));
  } else if (['arch', 'gate'].includes(kind)) {
    addBox(mesh, -w * 0.42, 0, 0, w * 0.16, h, d, color);
    addBox(mesh, w * 0.42, 0, 0, w * 0.16, h, d, color);
    addBox(mesh, 0, h * 0.84, 0, w, h * 0.16, d, color);
    addBox(mesh, 0, h * 0.89, -d * 0.51, w * 0.7, h * 0.035, 1, accent);
  } else if (['tower', 'clock-tower'].includes(kind)) {
    addBox(mesh, 0, 0, 0, w, h * 0.84, d, color);
    addBox(mesh, 0, 0, 0, w * 1.15, h * 0.06, d * 1.15, tint(color, 0.75));
    addBox(mesh, 0, h * 0.78, 0, w * 1.12, h * 0.07, d * 1.12, tint(color, 1.25));
    addCylinder(mesh, 0, h * 0.85, 0, w * 0.64, h * 0.15, tint(color, 0.7), 4, 0);
    if (kind === 'clock-tower') {
      const face = meshBuilder();
      addRing(face, w * 0.62, w * 0.62, 2, accent, accent, h * 0.63);
      mergePlaced(mesh, face, 0, 0, -d * 0.52);
      addBox(mesh, w * 0.09, h * 0.63, -d * 0.56, w * 0.21, w * 0.04, 2, accent);
      addBox(mesh, 0, h * 0.63, -d * 0.56, w * 0.04, w * 0.23, 2, accent);
    } else {
      for (let i = 1; i <= 4; i += 1) {
        addBox(mesh, 0, h * (0.1 + i * 0.12), -d * 0.505, w * 0.7, h * 0.035, 0.8, accent);
        addBox(mesh, w * 0.505, h * (0.1 + i * 0.12), 0, 0.8, h * 0.035, d * 0.7, accent);
      }
    }
  } else if (['spire', 'crystal'].includes(kind)) {
    addCylinder(mesh, 0, 0, 0, w * 0.28, h * 0.25, tint(color, 0.65), 6, w * 0.5);
    addCylinder(mesh, 0, h * 0.25, 0, w * 0.5, h * 0.75, color, 6, 0);
    addCylinder(mesh, w * 0.45, 0, d * 0.2, w * 0.22, h * 0.45, accent, 5, 0);
  } else if (kind === 'hangar') {
    addBox(mesh, -w * 0.46, 0, 0, w * 0.08, h, d, color);
    addBox(mesh, w * 0.46, 0, 0, w * 0.08, h, d, color);
    addBox(mesh, 0, 0, d * 0.46, w, h, d * 0.08, tint(color, 0.7));
    addBox(mesh, 0, h, 0, w * 1.03, h * 0.08, d * 1.03, color);
    for (let i = 0; i < 4; i += 1) addBox(mesh, 0, h * 1.08, -d * 0.42 + i * d * 0.28, w, h * 0.025, 2, accent);
    addBox(mesh, 0, h * 0.83, -d * 0.51, w, h * 0.06, 2, accent);
  } else if (kind === 'tree') {
    addCylinder(mesh, 0, 0, 0, w * 0.1, h * 0.6, '#675140', 7, w * 0.055);
    for (let i = 0; i < 3; i += 1) addCylinder(mesh, 0, h * (0.22 + i * 0.19), 0, w * (0.5 - i * 0.12), h * 0.4, tint(color, 0.85 + i * 0.1), 9, 0);
  } else if (kind === 'voxel-tree') {
    addBox(mesh, 0, 0, 0, w * 0.22, h * 0.72, d * 0.22, '#6f5036');
    addBox(mesh, 0, h * 0.48, 0, w, h * 0.3, d, color);
    addBox(mesh, 0, h * 0.78, 0, w * 0.72, h * 0.22, d * 0.72, tint(color, 1.1));
  } else if (kind === 'palm') {
    addCylinder(mesh, 0, 0, 0, w * 0.075, h * 0.82, '#816247', 7, w * 0.05);
    for (let i = 0; i < 7; i += 1) {
      const a = i / 7 * Math.PI * 2, right = [Math.cos(a + 0.25), Math.sin(a + 0.25)];
      addQuad(mesh, [0, h * 0.85, 0], [right[0] * w * 0.38, h, right[1] * d * 0.38],
        [Math.cos(a) * w * 0.65, h * 0.67, Math.sin(a) * d * 0.65],
        [Math.cos(a - 0.25) * w * 0.38, h, Math.sin(a - 0.25) * d * 0.38], tint(color, 0.86 + (i % 3) * 0.1));
    }
  } else if (kind === 'mushroom') {
    addCylinder(mesh, 0, 0, 0, w * 0.12, h * 0.66, '#e6dcc2', 10);
    addSphere(mesh, 0, h * 0.67, 0, w * 0.5, h * 0.33, d * 0.5, color, 12, 6);
    for (let i = 0; i < 5; i += 1) {
      const angle = i / 5 * Math.PI * 2;
      addSphere(mesh, Math.cos(angle) * w * 0.32, h * 0.86, Math.sin(angle) * d * 0.32,
        w * 0.065, h * 0.025, d * 0.065, '#fff2dd', 6, 3);
    }
  } else if (kind === 'pipe') {
    const radius = w * 0.44, inner = radius * 0.74;
    for (let i = 0; i < 16; i += 1) {
      const a = i / 16 * Math.PI * 2, b = (i + 1) / 16 * Math.PI * 2;
      const p = (r, y, angle) => [Math.cos(angle) * r, y, Math.sin(angle) * r];
      addQuad(mesh, p(radius, 0, a), p(radius, h, a), p(radius, h, b), p(radius, 0, b), color);
      addQuad(mesh, p(inner, h * 0.5, b), p(inner, h, b), p(inner, h, a), p(inner, h * 0.5, a), tint(color, 0.5));
      addQuad(mesh, p(radius, h, a), p(inner, h, a), p(inner, h, b), p(radius, h, b), accent);
    }
    addDisc(mesh, 0, h * 0.5, 0, inner, '#10201b');
  } else if (['temple', 'pyramid'].includes(kind)) {
    if (kind === 'pyramid') {
      const base = [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
      for (let i = 0; i < 4; i += 1) addTriangle(mesh, base[i], [0, h, 0], base[(i + 1) % 4], i % 2 ? tint(color, 0.85) : color);
    } else {
      for (let i = 0; i < 3; i += 1) addBox(mesh, 0, i * h * 0.04, 0, w * (1.12 - i * 0.07), h * 0.04, d * (1.12 - i * 0.07), tint(color, 0.8 + i * 0.1));
      for (const x of [-0.38, -0.13, 0.13, 0.38]) {
        for (const z of [-0.36, 0.36]) addCylinder(mesh, x * w, h * 0.12, z * d, w * 0.045, h * 0.6, color, 8);
      }
      addBox(mesh, 0, h * 0.71, 0, w * 1.02, h * 0.08, d * 1.02, color);
      addRoof(mesh, w * 1.06, h * 0.79, h * 0.21, d * 1.06, accent);
    }
  } else if (['industrial', 'reactor'].includes(kind)) {
    addBox(mesh, 0, 0, 0, w, h * 0.13, d, tint(color, 0.65));
    addCylinder(mesh, 0, h * 0.13, 0, w * 0.35, h * 0.7, color, 12, w * 0.28);
    for (const level of [0.26, 0.5, 0.74]) addCylinder(mesh, 0, h * level, 0, w * 0.37, h * 0.05, accent, 12);
    addCylinder(mesh, -w * 0.32, h * 0.13, -d * 0.31, w * 0.1, h * 0.87, tint(color, 0.8), 8);
    addCylinder(mesh, w * 0.32, h * 0.13, d * 0.31, w * 0.1, h * 0.67, tint(color, 0.8), 8);
  } else if (kind === 'castle') {
    addBox(mesh, 0, 0, 0, w, h * 0.52, d, color);
    for (const x of [-0.4, 0.4]) {
      for (const z of [-0.4, 0.4]) {
        addCylinder(mesh, x * w, 0, z * d, Math.min(w, d) * 0.16, h * 0.8, tint(color, 1.05), 8);
        addCylinder(mesh, x * w, h * 0.8, z * d, Math.min(w, d) * 0.19, h * 0.2, accent, 8, 0);
      }
    }
    for (let i = 0; i < 7; i += 1) {
      addBox(mesh, -w * 0.43 + i * w * 0.143, h * 0.52, -d * 0.48, w * 0.075, h * 0.08, d * 0.12, color);
    }
    addBox(mesh, 0, 0, -d * 0.505, w * 0.17, h * 0.35, 1, tint(color, 0.23));
  } else if (kind === 'house') {
    addBox(mesh, 0, 0, 0, w, h * 0.67, d, color);
    addRoof(mesh, w * 1.14, h * 0.67, h * 0.33, d * 1.15, accent);
    addBox(mesh, 0, 0, -d * 0.505, w * 0.16, h * 0.36, 1, tint(color, 0.36));
    for (const x of [-0.29, 0.29]) addBox(mesh, w * x, h * 0.31, -d * 0.51, w * 0.18, h * 0.2, 1, '#b8dfe0');
  } else if (kind === 'checker-hill') {
    addBox(mesh, 0, 0, 0, w, h, d, color);
    const dark = tint(color, 0.65), light = tint(color, 1.18), n = 5;
    for (let row = 0; row < n; row += 1) {
      for (let column = 0; column < n; column += 1) {
        const shade = (row + column) % 2 ? light : dark;
        const x0 = -w / 2 + column * w / n, x1 = x0 + w / n;
        const z0 = -d / 2 + column * d / n, z1 = z0 + d / n;
        const y0 = row * h / n, y1 = y0 + h / n;
        for (const z of [-d / 2 - 0.1, d / 2 + 0.1]) addQuad(mesh, [x0, y0, z], [x0, y1, z], [x1, y1, z], [x1, y0, z], shade);
        for (const x of [-w / 2 - 0.1, w / 2 + 0.1]) addQuad(mesh, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], shade);
      }
    }
    addBox(mesh, 0, h, 0, w * 1.02, Math.min(5, h * 0.06), d * 1.02, accent || '#5baf34');
  } else if (['ship', 'frigate'].includes(kind)) {
    addBox(mesh, 0, h * 0.34, 0, w * 0.3, h * 0.28, d, color);
    addBox(mesh, 0, h * 0.28, d * 0.22, w, h * 0.12, d * 0.3, color);
    addBox(mesh, 0, h * 0.62, d * 0.2, w * 0.22, h * 0.25, d * 0.2, tint(color, 0.8));
    addBox(mesh, 0, h * 0.38, d * 0.505, w * 0.25, h * 0.18, 2, accent);
    addCylinder(mesh, 0, 0, 0, w * 0.04, h * 0.28, tint(color, 0.6), 6);
  } else if (['antenna', 'dish'].includes(kind)) {
    addCylinder(mesh, 0, 0, 0, w * 0.08, h * 0.78, color, 8, w * 0.035);
    if (kind === 'dish') addSphere(mesh, 0, h * 0.78, 0, w * 0.5, h * 0.17, d * 0.14, accent, 12, 5);
    else addBox(mesh, 0, h * 0.7, 0, w, h * 0.05, d * 0.18, accent);
    addCylinder(mesh, 0, h * 0.78, 0, w * 0.025, h * 0.22, accent, 6);
  } else if (kind === 'ruins') {
    for (const x of [-0.36, 0.3]) addBox(mesh, w * x, 0, 0, w * 0.18, h * (x < 0 ? 0.85 : 0.65), d * 0.45, color);
    addBox(mesh, 0, h * 0.52, 0, w, h * 0.12, d * 0.5, tint(color, 0.85));
    addSphere(mesh, -w * 0.3, h * 0.12, d * 0.4, w * 0.22, h * 0.12, d * 0.23, color, 6, 3);
  } else if (['rock', 'mountain', 'canyon'].includes(kind)) {
    addSphere(mesh, 0, h * 0.35, 0, w * 0.5, h * 0.65, d * 0.5, color, 7, 4);
    addSphere(mesh, -w * 0.3, h * 0.15, d * 0.25, w * 0.35, h * 0.25, d * 0.33, tint(color, 0.84), 6, 3);
  }
  // Prop footprints are a contract with the course planner. Roof overhangs,
  // palm fronds and an arch's plinth must not grow into the drivable corridor.
  let maxX = 0, maxZ = 0, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < mesh.positions.length; i += 3) {
    maxX = Math.max(maxX, Math.abs(mesh.positions[i])); maxZ = Math.max(maxZ, Math.abs(mesh.positions[i + 2]));
    minY = Math.min(minY, mesh.positions[i + 1]); maxY = Math.max(maxY, mesh.positions[i + 1]);
  }
  const sx = Math.min(1, w / (maxX * 2 || 1)), sz = Math.min(1, d / (maxZ * 2 || 1));
  const sy = Math.min(1, h / (maxY - minY || 1));
  for (let i = 0; i < mesh.positions.length; i += 3) {
    mesh.positions[i] *= sx; mesh.positions[i + 1] = (mesh.positions[i + 1] - minY) * sy; mesh.positions[i + 2] *= sz;
    const normal = normalize3([mesh.normals[i] / sx, mesh.normals[i + 1] / sy, mesh.normals[i + 2] / sz]);
    mesh.normals[i] = normal[0]; mesh.normals[i + 1] = normal[1]; mesh.normals[i + 2] = normal[2];
  }
  return mesh;
}

export function toMeshData(mesh) {
  return { positions: new Float32Array(mesh.positions), normals: new Float32Array(mesh.normals), colors: new Float32Array(mesh.colors), indices: null };
}

export function getKartEnvironment(track) {
  return {
    sky: '#101a35', fog: '#496278', ground: '#263d41', road: '#26313c', shoulder: '#7cbdb5',
    accent: '#7be5d5', fogNear: 700, fogFar: 3200,
    ...getKartTrackEnvironment(track)
  };
}

// A bevel-free mitered ribbon follows the real centreline. Only the render join
// is clamped at acute corners; no smoothing or new simulation path is invented.
export function buildRoadRibbon(points, width) {
  if (!Array.isArray(points) || points.length < 3) return [];
  return points.map((point, index) => {
    const before = points[(index + points.length - 1) % points.length], after = points[(index + 1) % points.length];
    const aLength = Math.hypot(point.x - before.x, point.y - before.y) || 1;
    const bLength = Math.hypot(after.x - point.x, after.y - point.y) || 1;
    const a = { x: -(point.y - before.y) / aLength, y: (point.x - before.x) / aLength };
    const b = { x: -(after.y - point.y) / bLength, y: (after.x - point.x) / bLength };
    const magnitude = Math.hypot(a.x + b.x, a.y + b.y);
    const nx = magnitude > 0.001 ? (a.x + b.x) / magnitude : b.x;
    const nz = magnitude > 0.001 ? (a.y + b.y) / magnitude : b.y;
    const miter = Math.min(width, width / 2 / Math.max(0.25, nx * b.x + nz * b.y));
    return { left: [point.x + nx * miter, point.y + nz * miter], right: [point.x - nx * miter, point.y - nz * miter] };
  });
}

function addRoad(mesh, points, width, y, color) {
  const ribbon = buildRoadRibbon(points, width);
  ribbon.forEach((row, index) => {
    const next = ribbon[(index + 1) % ribbon.length];
    addQuad(mesh, [row.left[0], y, row.left[1]], [next.left[0], y, next.left[1]],
      [next.right[0], y, next.right[1]], [row.right[0], y, row.right[1]], color);
  });
}

function addRoadDecor(mesh, track, environment) {
  const points = track.waypoints, half = track.roadWidth / 2;
  const c1 = colorRgba(environment.shoulder), c2 = tint(environment.shoulder, 0.45);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const dx = next.x - point.x, dz = next.y - point.y, length = Math.hypot(dx, dz) || 1;
    const tx = dx / length, tz = dz / length, nx = -tz, nz = tx;
    for (let distance = 9; distance < length - 9; distance += 20) {
      const end = Math.min(length - 6, distance + 14), color = Math.floor(distance / 20) % 2 ? c1 : c2;
      for (const side of [-1, 1]) {
        const inner = half * side, outer = (half + 4) * side;
        addQuad(mesh,
          [point.x + tx * distance + nx * inner, 0.31, point.y + tz * distance + nz * inner],
          [point.x + tx * end + nx * inner, 0.31, point.y + tz * end + nz * inner],
          [point.x + tx * end + nx * outer, 0.31, point.y + tz * end + nz * outer],
          [point.x + tx * distance + nx * outer, 0.31, point.y + tz * distance + nz * outer], color);
      }
    }
  });
  for (const pad of track.boostPads || []) {
    const road = points.reduce((best, point, index) => {
      const next = points[(index + 1) % points.length], dx = next.x - point.x, dz = next.y - point.y;
      const t = clamp(((pad.x - point.x) * dx + (pad.y - point.y) * dz) / (dx * dx + dz * dz || 1), 0, 1);
      const distance = Math.hypot(pad.x - point.x - dx * t, pad.y - point.y - dz * t);
      return distance < best.distance ? { distance, angle: Math.atan2(dz, dx) } : best;
    }, { distance: Infinity, angle: 0 });
    const local = meshBuilder();
    addBox(local, 0, 0.3, 0, 27, 0.18, 42, '#b3f2e1');
    for (const z of [-12, 0, 12]) {
      addTriangle(local, [-10, 0.55, z + 6], [10, 0.55, z + 6], [0, 0.55, z - 6], environment.accent);
    }
    mergePlaced(mesh, local, pad.x, 0, pad.y, -road.angle - Math.PI / 2);
  }
  const start = track.start || points[0], next = points[1], angle = Math.atan2(next.y - points[0].y, next.x - points[0].x);
  const tx = Math.cos(angle), tz = Math.sin(angle), nx = -tz, nz = tx;
  for (let x = 0; x < 12; x += 1) {
    for (let z = 0; z < 2; z += 1) {
      const a = -half + track.roadWidth * x / 12, b = -half + track.roadWidth * (x + 1) / 12;
      const c = (z - 1) * 9, d = c + 9;
      const point = (s, t) => [start.x + nx * s + tx * t, 0.7, start.y + nz * s + tz * t];
      addQuad(mesh, point(a, c), point(a, d), point(b, d), point(b, c), (x + z) % 2 ? '#111827' : '#dce9e7');
    }
  }
  const gate = buildLandmarkMesh({ kind: 'gate', width: track.roadWidth + 38, height: 68, depth: 8, color: '#263942', accent: environment.accent });
  mergePlaced(mesh, gate, start.x, 0, start.y, -angle - Math.PI / 2);
}

export function buildKartEnvironmentMesh(track) {
  if (!track?.waypoints?.length) throw new Error('A 3D race needs the simulation track waypoints.');
  const mesh = meshBuilder(), environment = getKartEnvironment(track);
  const center = track.waypoints.reduce((sum, point) => [sum[0] + point.x / track.waypoints.length, sum[1] + point.y / track.waypoints.length], [0, 0]);
  addBox(mesh, center[0], -12, center[1], 6500, 11.6, 6500, environment.ground);
  addRoad(mesh, track.waypoints, track.roadWidth + 15, 0.05, tint(environment.ground, 0.75));
  addRoad(mesh, track.waypoints, track.roadWidth + 8, 0.13, environment.shoulder);
  addRoad(mesh, track.waypoints, track.roadWidth, 0.22, environment.road);
  addRoadDecor(mesh, track, environment);
  const landmarks = environment.landmarks || [];
  const unhandledLandmarks = [];
  for (const landmark of landmarks) {
    if (!KART_LANDMARK_KINDS.includes(landmark.kind)) { unhandledLandmarks.push(landmark.kind); continue; }
    mergePlaced(mesh, buildLandmarkMesh(landmark), Number(landmark.x) || 0, Number(landmark.y) || 0,
      Number(landmark.z) || 0, Number(landmark.rotation) || 0, Number(landmark.scale) || 1);
  }
  return { ...toMeshData(mesh), environment, landmarkCount: landmarks.length - unhandledLandmarks.length, unhandledLandmarks };
}
