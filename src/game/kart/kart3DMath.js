// Column-major matrices for the kart's WebGL presentation. Simulation coordinates
// remain EngineRace x/y; presentation uses x/z with +Y up and -Z model forward.
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function normalize3(value) {
  const length = Math.hypot(...value) || 1;
  return value.map(component => component / length);
}

export function cross3(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

export function identity4() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function multiply4(a, b) {
  const result = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      result[column * 4 + row] = a[row] * b[column * 4]
        + a[4 + row] * b[column * 4 + 1]
        + a[8 + row] * b[column * 4 + 2]
        + a[12 + row] * b[column * 4 + 3];
    }
  }
  return result;
}

export function translation4(x = 0, y = 0, z = 0) {
  const result = identity4();
  result[12] = x; result[13] = y; result[14] = z;
  return result;
}

export function scale4(x = 1, y = x, z = x) {
  const result = identity4();
  result[0] = x; result[5] = y; result[10] = z;
  return result;
}

export function rotationX4(angle = 0) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

export function rotationY4(angle = 0) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

export function rotationZ4(angle = 0) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function transformPoint4(matrix, point) {
  const [x, y, z] = point;
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]
  ];
}

export function perspective4(fovY, aspect, near = 1, far = 6000) {
  const f = 1 / Math.tan(fovY / 2);
  const range = 1 / (near - far);
  return new Float32Array([
    f / Math.max(0.01, aspect), 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * range, -1,
    0, 0, 2 * far * near * range, 0
  ]);
}

export function lookAt4(eye, target, up = [0, 1, 0]) {
  let z = normalize3(eye.map((component, index) => component - target[index]));
  if (Math.hypot(...z) < 0.5) z = [0, 0, 1];
  let x = normalize3(cross3(up, z));
  if (Math.hypot(...x) < 0.5) x = [1, 0, 0];
  const y = cross3(z, x);
  const dotEye = vector => -(vector[0] * eye[0] + vector[1] * eye[1] + vector[2] * eye[2]);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    dotEye(x), dotEye(y), dotEye(z), 1
  ]);
}

export function kartWorldMatrix(kart, scale = 12, altitude = 0) {
  const pose = multiply4(translation4(kart.x, altitude, kart.y), rotationY4(-kart.angle - Math.PI / 2));
  return multiply4(pose, scale4(scale));
}

export function colorRgba(value, alpha = 1) {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) return [value[0], value[1], value[2], value[3] ?? alpha];
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value));
  if (!match) return [0.3, 0.55, 0.58, alpha];
  const hex = match[1].length === 3 ? [...match[1]].map(character => character + character).join('') : match[1];
  return [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).concat(alpha);
}

export function tint(value, amount) {
  const color = colorRgba(value);
  return color.map((component, index) => index === 3 ? component : clamp(component * amount, 0, 1));
}
