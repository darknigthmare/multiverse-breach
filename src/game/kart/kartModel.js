import { buildKartIdentityGeometry } from './kartIdentityGeometry.js';

/**
 * A small, engine-independent kart modeller. Positions use metres: +Y is up,
 * -Z forward and +X the driver's right. Render it at 12 race units per metre.
 * No driver geometry is generated: the existing character sprite is a layer
 * anchored at driverAnchor. Models and exported 2D views use these same faces.
 */
const TAU = Math.PI * 2;
const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

export const KART_MODEL_SCALE = 12;
export const KART_BODY_STYLES = Object.freeze([
  'classic', 'suture', 'suture-disc', 'military', 'armored', 'aero', 'industrial',
  'science', 'rally', 'salvage', 'hunter', 'gothic', 'arcane', 'medieval', 'stage'
]);

export function kartColor(color, fallback = '#39c5bb') {
  const value = /^#[0-9a-f]{6}$/i.test(String(color)) ? color : fallback;
  return [parseInt(value.slice(1, 3), 16) / 255, parseInt(value.slice(3, 5), 16) / 255,
    parseInt(value.slice(5, 7), 16) / 255, 1];
}

const mix = (a, b, t) => a.map((value, index) => index === 3 ? 1 : value * (1 - t) + b[index] * t);
const normalize = ([x, y, z]) => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};
const rotate = ([x, y, z], [rx = 0, ry = 0, rz = 0]) => {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
  const yy = y * cx - z * sx, zz = y * sx + z * cx;
  const xx = x * cy + zz * sy, zzz = -x * sy + zz * cy;
  return [xx * cz - yy * sz, xx * sz + yy * cz, zzz];
};

export function buildKartMesh(spec = {}) {
  const positions = [], normals = [], colors = [], parts = [], features = [];
  const primary = kartColor(spec.color), accent = kartColor(spec.accent, '#e1b95b');
  const detail = kartColor(spec.detailColor, '#e4eef1');
  const metal = kartColor('#7c929c'), dark = kartColor('#151c24'), rubber = kartColor('#12161d');
  const shade = mix(primary, dark, 0.42), light = mix(primary, [1, 1, 1, 1], 0.22);
  const dimensions = spec.dimensions || {};
  const wheelbase = clamp(finite(dimensions.wheelbase, 2.0), 1.5, 2.5);
  const width = clamp(finite(dimensions.width, 1.66), 1.35, 2.0);
  const nose = clamp(finite(dimensions.nose, 0.75), 0.5, 1.1);
  const wheelRadius = clamp(finite(dimensions.wheelRadius, 0.32), 0.25, 0.4);
  const fin = clamp(finite(dimensions.fin, 0.4), 0.25, 0.6);
  const family = KART_BODY_STYLES.includes(spec.bodyStyle) ? spec.bodyStyle : 'classic';

  const triangle = (a, b, c, color) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const normal = normalize([uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx]);
    for (const point of [a, b, c]) {
      positions.push(...point); normals.push(...normal); colors.push(...color);
    }
  };
  const quad = (a, b, c, d, color) => { triangle(a, b, c, color); triangle(a, c, d, color); };
  const transform = (point, location, rotation) => {
    const result = rotate(point, rotation);
    return result.map((value, axis) => value + location[axis]);
  };
  const box = (location, size, color, rotation = [0, 0, 0]) => {
    const [x, y, z] = size.map(value => value / 2);
    const points = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z],
      [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]].map(point => transform(point, location, rotation));
    for (const face of [[0, 3, 2, 1], [4, 5, 6, 7], [0, 4, 7, 3], [1, 2, 6, 5], [3, 7, 6, 2], [0, 1, 5, 4]]) {
      quad(...face.map(index => points[index]), color);
    }
  };
  const hull = (location, size, color, taper = 0.58) => {
    const [x, y, z] = size.map(value => value / 2);
    const points = [[-x * taper, -y, -z], [x * taper, -y, -z], [x, -y, z], [-x, -y, z],
      [-x * taper * 0.86, y * 0.45, -z * 0.87], [x * taper * 0.86, y * 0.45, -z * 0.87],
      [x * 0.88, y, z * 0.86], [-x * 0.88, y, z * 0.86]]
      .map(point => point.map((value, axis) => value + location[axis]));
    for (const face of [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]) {
      quad(...face.map(index => points[index]), color);
    }
  };
  const cylinder = (location, radius, length, color, axis = 'y', segments = 10, radiusTop = radius) => {
    const align = (x, y, z) => axis === 'x' ? [y, x, z] : axis === 'z' ? [x, z, y] : [x, y, z];
    const point = (angle, height, rad) => align(Math.cos(angle) * rad, height, Math.sin(angle) * rad)
      .map((value, i) => value + location[i]);
    const low = align(0, -length / 2, 0).map((value, i) => value + location[i]);
    const high = align(0, length / 2, 0).map((value, i) => value + location[i]);
    // Swapping coordinate axes reverses winding. Keep normals outward.
    const winding = axis === 'y' ? 1 : -1;
    for (let index = 0; index < segments; index += 1) {
      const a = winding * TAU * index / segments, b = winding * TAU * (index + 1) / segments;
      const p0 = point(a, -length / 2, radius), p1 = point(b, -length / 2, radius);
      const p2 = point(b, length / 2, radiusTop), p3 = point(a, length / 2, radiusTop);
      quad(p0, p3, p2, p1, color);
      triangle(low, p0, p1, color);
      triangle(high, p2, p3, color);
    }
  };
  const ring = (location, radius, thickness, color, axis = 'z', segments = 12) => {
    // A hexagonal tube around a ring, kept flat-shaded for the established style.
    const point = (a, b) => {
      const radial = radius + thickness * Math.cos(b);
      const p = [Math.cos(a) * radial, Math.sin(a) * radial, thickness * Math.sin(b)];
      const aligned = axis === 'x' ? [p[2], p[0], p[1]] : axis === 'y' ? [p[0], p[2], -p[1]] : p;
      return aligned.map((value, index) => value + location[index]);
    };
    for (let segment = 0; segment < segments; segment += 1) {
      const a = TAU * segment / segments, aa = TAU * (segment + 1) / segments;
      for (let tube = 0; tube < 4; tube += 1) {
        const b = TAU * tube / 4, bb = TAU * (tube + 1) / 4;
        quad(point(a, b), point(aa, b), point(aa, bb), point(a, bb), color);
      }
    }
  };
  const strut = (a, b, thickness, color) => {
    const delta = b.map((value, index) => value - a[index]);
    const length = Math.hypot(...delta);
    const center = a.map((value, index) => (value + b[index]) / 2);
    const angleY = Math.atan2(delta[0], delta[2]);
    const angleX = -Math.atan2(delta[1], Math.hypot(delta[0], delta[2]));
    box(center, [thickness, thickness, length], color, [angleX, angleY, 0]);
  };
  const feature = (name, draw) => { features.push(name); draw(); };

  const identityBuilt = family !== 'suture-disc' && buildKartIdentityGeometry(spec, {
    box, hull, cylinder, ring, strut, triangle, quad, positions, parts, features,
    primary, accent, detail, metal, dark, rubber, shade, light, kartColor
  });

  if (identityBuilt) {
    // The identity module owns every body, motif, cockpit and wheel vertex.
  } else if (family === 'suture-disc') {
    // The existing Mirelle kart atlas establishes a hovering black/gold disc,
    // cyan hologram cards, a circular guard rail and no exposed road wheels.
    // This is a new mesh interpretation of that asset, still awaiting 1:1 review.
    feature('source-mirelle-hover-disc', () => {
      cylinder([0, 0.35, 0], 1.09, 0.22, primary, 'y', 20);
      cylinder([0, 0.46, 0], 1.04, 0.06, accent, 'y', 20);
      cylinder([0, 0.5, 0], 0.91, 0.05, dark, 'y', 20);
      ring([0, 0.32, 0], 1.095, 0.025, detail, 'y', 20);
      ring([0, 0.71, 0], 1.03, 0.042, accent, 'y', 20);
      ring([0, 0.54, 0], 1.06, 0.038, accent, 'y', 20);
      for (let i = 0; i < 12; i += 1) {
        const a = TAU * i / 12;
        const x = Math.sin(a), z = Math.cos(a);
        box([x * 1.025, 0.63, z * 1.025], [0.065, 0.2, 0.065], accent);
        box([x * 1.073, 0.47, z * 1.073], [0.34, 0.2, 0.047], shade, [0, a, 0]);
        box([x * 1.102, 0.47, z * 1.102], [0.26, 0.055, 0.027], detail, [0, a, 0]);
      }
      box([0, 0.7, 0.1], [0.66, 0.14, 0.66], dark);
      box([0, 0.97, 0.49], [0.68, 0.62, 0.14], accent, [-0.1, 0, 0]);
      box([0, 1.0, 0.42], [0.55, 0.49, 0.12], primary, [-0.1, 0, 0]);
      box([0, 1.08, 0.59], [0.17, 0.17, 0.045], detail, [0, 0, Math.PI / 4]);
      for (const side of [-1, 1]) {
        box([side * 0.45, 0.86, -0.06], [0.09, 0.075, 0.61], accent);
        box([side * 0.45, 0.75, 0.12], [0.06, 0.25, 0.06], metal);
      }
    });
    feature('floating-hologram-cards', () => {
      for (let i = 0; i < 8; i += 1) {
        const a = TAU * i / 8;
        const radial = [Math.sin(a), 0, Math.cos(a)];
        const y = 0.98 + (i % 2) * 0.15;
        const card = distance => [radial[0] * distance, y, radial[2] * distance];
        box(card(1.12), [0.35, 0.42, 0.032], detail, [0, a, 0]);
        box(card(1.144), [0.29, 0.36, 0.022], kartColor('#215765'), [0, a, 0]);
        box(card(1.16), [0.045, 0.25, 0.014], detail, [0, a, 0]);
        box(card(1.16), [0.18, 0.04, 0.014], detail, [0, a, 0]);
      }
      for (let i = 0; i < 4; i += 1) {
        const a = Math.PI / 4 + i * Math.PI / 2;
        cylinder([Math.sin(a) * 0.72, 0.19, Math.cos(a) * 0.72], 0.15, 0.09, metal, 'y', 10);
        cylinder([Math.sin(a) * 0.72, 0.13, Math.cos(a) * 0.72], 0.13, 0.025, detail, 'y', 10);
      }
    });
    parts.push({ id: 'hover-disc', kind: 'body', start: 0, count: positions.length / 3, pivot: [0, 0, 0] });
  } else {
  const bodyStart = positions.length / 3;
  // The cockpit stays open. Full character bodies are never modelled or hidden
  // behind an opaque roof, allowing the separate seated sprite to remain clear.
  box([0, 0.31, 0], [width * 0.88, 0.15, wheelbase + 0.8], dark);
  hull([0, 0.46, -0.72], [width * 0.84, 0.38, nose + 0.77], primary, family === 'armored' ? 0.9 : 0.54);
  box([0, 0.56, 0.6], [width * 0.77, 0.29, 0.92], shade);
  for (const sign of [-1, 1]) {
    hull([sign * width * 0.43, 0.59, 0.03], [0.32, 0.39, 1.58], primary, 0.7);
    box([sign * width * 0.43, 0.8, -0.12], [0.16, 0.055, 1.05], accent);
    box([sign * width * 0.29, 0.62, -1.29], [0.25, 0.075, 0.055], detail);
    box([sign * width * 0.29, 0.72, 1.08], [0.22, 0.065, 0.05], kartColor('#ed594c'));
  }
  box([0, 0.48, -1.52], [width * 0.95, 0.11, 0.16], metal);
  box([0, 0.51, 1.25], [width * 0.94, 0.12, 0.15], dark);
  box([0, 0.74, 0.12], [0.7, 0.13, 0.72], dark);
  box([0, 0.97, 0.49], [0.73, 0.64, 0.14], dark, [-0.1, 0, 0]);
  box([0, 1.16, 0.47], [0.5, 0.16, 0.17], shade);
  strut([0, 0.48, -0.85], [0, 0.97, -0.43], 0.06, metal);
  ring([0, 0.99, -0.43], 0.2, 0.035, dark);
  box([0, 0.99, -0.43], [0.32, 0.035, 0.035], metal);
  for (const z of [-wheelbase / 2, wheelbase / 2]) cylinder([0, wheelRadius, z], 0.045, width + 0.3, metal, 'x', 6);

  switch (family) {
    case 'military':
    case 'armored':
      feature('armor-panels', () => {
        for (const sign of [-1, 1]) {
          box([sign * width * 0.47, 0.77, -0.8], [0.49, 0.12, 0.76], primary);
          box([sign * width * 0.47, 0.8, 0.84], [0.5, 0.14, 0.81], primary);
          box([sign * width * 0.46, 0.6, 0], [0.12, family === 'armored' ? 0.58 : 0.32, 1.57], shade);
        }
        for (let i = -2; i <= 2; i += 1) box([i * 0.15, 0.58, -1.4], [0.065, 0.25, 0.07], dark);
      });
      break;
    case 'aero':
      feature('split-rear-wing', () => {
        for (const sign of [-1, 1]) {
          box([sign * 0.55, 0.95, 0.98], [0.06, 0.55, 0.08], metal);
          box([sign * 0.55, 1.23, 1.05], [0.91, 0.085, 0.4], primary, [0.08, 0, sign * -0.08]);
          box([sign * 0.98, 1.3, 1.06], [0.055, fin, 0.43], accent);
        }
        hull([0, 0.63, -1.15], [0.47, 0.15, 1.02], light, 0.24);
      });
      break;
    case 'industrial':
    case 'salvage':
      feature('exposed-engine', () => {
        box([0, 0.95, 0.92], [0.66, 0.34, 0.49], metal);
        for (let i = -2; i <= 2; i += 1) box([i * 0.12, 1.14, 0.92], [0.045, 0.07, 0.46], dark);
        for (const sign of [-1, 1]) {
          cylinder([sign * 0.53, 0.9, 1.05], 0.08, 0.72, metal, 'y', 8);
          cylinder([sign * 0.53, 1.28, 1.05], 0.095, 0.08, dark, 'y', 8);
          for (let i = 0; i < 3; i += 1) box([sign * width * 0.43, 0.812, -0.4 + i * 0.24], [0.19, 0.035, 0.08], dark, [0, -0.4, 0]);
        }
      });
      break;
    case 'science':
      feature('laboratory-pods', () => {
        for (const sign of [-1, 1]) {
          cylinder([sign * width * 0.4, 0.69, 0.51], 0.19, 0.84, light, 'z');
          cylinder([sign * width * 0.4, 0.69, 0.96], 0.15, 0.055, accent, 'z');
        }
        box([0, 0.72, -0.93], [0.38, 0.045, 0.42], dark);
        box([0, 0.75, -0.94], [0.28, 0.025, 0.3], accent);
      });
      break;
    case 'rally':
      feature('rally-equipment', () => {
        for (const sign of [-1, 1]) {
          cylinder([sign * 0.45, 0.8, -1.32], 0.17, 0.13, metal, 'z');
          cylinder([sign * 0.45, 0.8, -1.4], 0.12, 0.03, detail, 'z');
        }
        cylinder([0, 0.88, 1.15], 0.3, 0.18, rubber, 'z', 12);
        cylinder([0, 0.88, 1.26], 0.15, 0.04, metal, 'z', 8);
      });
      break;
    case 'hunter':
      feature('hunter-ridges', () => {
        for (const sign of [-1, 1]) {
          for (let i = 0; i < 3; i += 1) box([sign * width * 0.45, 0.73 + i * 0.04, -0.42 + i * 0.31], [0.35, 0.09, 0.48], metal, [0.23, 0, sign * -0.22]);
          strut([sign * 0.59, 0.64, -1.11], [sign * 0.66, 0.89, -1.61], 0.085, detail);
        }
      });
      break;
    case 'gothic':
      feature('gothic-plates', () => {
        for (const sign of [-1, 1]) {
          hull([sign * 0.7, 0.89, 0.45], [0.26, 0.61, 0.92], shade, 0.12);
          for (let i = 0; i < 3; i += 1) cylinder([sign * width * 0.45, 0.91, -0.45 + i * 0.32], 0.06, 0.3, accent, 'y', 5, 0.012);
        }
      });
      break;
    case 'arcane':
    case 'medieval':
      feature('wood-and-bronze-frame', () => {
        for (const sign of [-1, 1]) {
          box([sign * width * 0.4, 0.68, 0.05], [0.3, 0.2, 1.72], mix(primary, kartColor('#725135'), 0.4));
          for (const z of [-0.57, 0.54]) box([sign * width * 0.4, 0.68, z], [0.34, 0.25, 0.06], accent);
        }
        for (let i = -2; i <= 2; i += 1) box([i * 0.16, 0.64, -0.92], [0.13, 0.055, 0.44], light);
      });
      break;
    case 'stage':
      feature('stage-deck', () => {
        box([0, 0.6, 0.91], [width * 0.93, 0.16, 0.76], dark);
        for (const sign of [-1, 1]) box([sign * width * 0.44, 0.85, -0.03], [0.07, 0.06, 1.44], accent);
      });
      break;
    case 'suture':
      feature('suture-stitching', () => {
        for (let i = 0; i < 6; i += 1) {
          box([0, 0.65 - i * 0.013, -0.73 - i * 0.12], [0.07, 0.028, 0.075], accent, [0, 0.65, 0]);
        }
        for (const sign of [-1, 1]) box([sign * width * 0.4, 0.84, 0.22], [0.06, 0.07, 1.07], accent);
      });
      break;
    default:
      feature('classic-fairing', () => {
        for (const sign of [-1, 1]) hull([sign * width * 0.41, 0.68, 0.25], [0.34, 0.25, 1.38], light, 0.42);
      });
  }

  const signature = spec.signature || 'badge';
  feature(`signature:${signature}`, () => {
    switch (signature) {
      case 'spool':
      case 'coil':
      case 'clock':
      case 'gear':
      case 'gate':
        ring([0, 1.21, 1.0], signature === 'gate' ? 0.45 : 0.36, 0.055, accent);
        if (signature !== 'gate') {
          cylinder([0, 1.21, 1.0], 0.09, 0.19, metal, 'z');
          box([0, 1.21, 1.0], [0.56, 0.045, 0.055], detail);
          box([0, 1.21, 1.0], [0.045, 0.56, 0.055], detail);
        }
        break;
      case 'beacon':
      case 'antenna':
      case 'probe':
      case 'relay':
        box([0.65, 1.15, 0.87], [0.055, 0.95, 0.055], metal);
        cylinder([0.65, 1.65, 0.87], 0.105, 0.13, accent, 'y', 8);
        if (signature === 'probe' || signature === 'relay') box([0.65, 1.53, 0.87], [0.38, 0.055, 0.07], detail);
        break;
      case 'rollbar':
      case 'loader':
        for (const sign of [-1, 1]) box([sign * 0.53, 1.13, 0.65], [0.1, 0.95, 0.1], signature === 'loader' ? accent : metal);
        box([0, 1.62, 0.65], [1.17, 0.1, 0.1], signature === 'loader' ? accent : metal);
        if (signature === 'loader') for (const sign of [-1, 1]) {
          strut([sign * 0.75, 0.7, -0.36], [sign * 0.82, 0.82, -1.13], 0.16, primary);
          box([sign * 0.82, 0.54, -1.44], [0.12, 0.12, 0.52], metal);
        }
        break;
      case 'shield':
        hull([0, 0.91, -1.06], [0.71, 0.15, 0.7], accent, 0.35);
        box([0, 1.0, -1.03], [0.08, 0.055, 0.39], primary);
        box([0, 1.0, -1.03], [0.35, 0.055, 0.075], primary);
        break;
      case 'mirrors':
      case 'wings':
      case 'twin-panels':
        for (const sign of [-1, 1]) {
          box([sign * (width * 0.5 + 0.13), 0.96, 0.58], [0.08, signature === 'twin-panels' ? 0.82 : 0.48, 0.83], accent, [0, sign * 0.18, sign * -0.2]);
          box([sign * (width * 0.5 + 0.17), 0.97, 0.58], [0.035, signature === 'twin-panels' ? 0.62 : 0.3, 0.65], signature === 'mirrors' ? detail : shade, [0, sign * 0.18, sign * -0.2]);
        }
        break;
      case 'tanks':
      case 'exhaust':
      case 'vents':
        for (const sign of [-1, 1]) {
          cylinder([sign * 0.43, 1.0, 1.0], signature === 'tanks' ? 0.17 : 0.09, 0.71, metal, 'y');
          cylinder([sign * 0.43, 1.37, 1.0], signature === 'tanks' ? 0.14 : 0.095, 0.065, accent, 'y');
        }
        break;
      case 'plasma':
      case 'portals':
        for (const sign of [-1, 1]) ring([sign * width * 0.47, 0.75, 0.47], 0.23, 0.04,
          signature === 'portals' ? kartColor(sign < 0 ? '#4fc1ee' : '#ef953b') : accent, 'x', 10);
        break;
      case 'speakers':
      case 'amplifier':
      case 'equalizer':
        for (const sign of [-1, 1]) {
          box([sign * 0.53, 1.05, 0.96], [0.35, 0.61, 0.3], dark);
          cylinder([sign * 0.53, 1.05, 1.13], 0.13, 0.025, accent, 'z');
          cylinder([sign * 0.53, 1.24, 1.13], 0.055, 0.026, metal, 'z', 8);
        }
        if (signature === 'equalizer') for (let i = -2; i <= 2; i += 1) box([i * 0.13, 0.7, -0.97], [0.06, 0.045, 0.12 + Math.abs(i) * 0.07], accent);
        break;
      case 'tusks':
      case 'trophies':
      case 'hooks':
      case 'blades':
        for (const sign of [-1, 1]) {
          strut([sign * 0.75, 0.75, 0.65], [sign * 0.85, 1.21, 1.0], 0.09, detail);
          strut([sign * 0.85, 1.21, 1.0], [sign * 0.71, 1.36, 0.86], 0.06, accent);
          if (signature === 'blades') hull([sign * 0.89, 0.62, -1.03], [0.1, 0.09, 0.91], metal, 0.1);
        }
        break;
      case 'prism':
      case 'lantern':
        cylinder([0, 1.12, 1.05], 0.22, 0.35, accent, 'y', 4, 0.03);
        cylinder([0, 0.92, 1.05], 0.03, 0.05, metal, 'y', 6);
        break;
      case 'compass':
      case 'scanner':
      case 'matrix':
        box([0, 0.83, -0.92], [0.52, 0.12, 0.36], dark, [-0.18, 0, 0]);
        box([0, 0.9, -0.92], [0.39, 0.035, 0.26], accent, [-0.18, 0, 0]);
        break;
      default:
        cylinder([0, 0.72, -1.1], 0.13, 0.04, accent, 'y', 6);
    }
  });
  parts.push({ id: 'chassis', kind: 'body', start: bodyStart, count: positions.length / 3 - bodyStart, pivot: [0, 0, 0] });

  for (const side of [-1, 1]) for (const front of [-1, 1]) {
    const pivot = [side * (width / 2 + 0.08), wheelRadius, front * wheelbase / 2];
    const start = positions.length / 3;
    cylinder(pivot, wheelRadius, 0.27, rubber, 'x', 12);
    // Fine outer edge and a five-spoke hub give an observable rolling motion.
    cylinder([pivot[0] + side * 0.146, pivot[1], pivot[2]], wheelRadius * 0.7, 0.025, metal, 'x', 12);
    cylinder([pivot[0] + side * 0.168, pivot[1], pivot[2]], wheelRadius * 0.52, 0.026, dark, 'x', 10);
    for (let spoke = 0; spoke < 5; spoke += 1) {
      const a = TAU * spoke / 5;
      box([pivot[0] + side * 0.187, pivot[1] + Math.cos(a) * wheelRadius * 0.28, pivot[2] + Math.sin(a) * wheelRadius * 0.28],
        [0.026, wheelRadius * 0.52, 0.035], accent, [a, 0, 0]);
    }
    cylinder([pivot[0] + side * 0.203, pivot[1], pivot[2]], 0.063, 0.035, metal, 'x', 8);
    parts.push({ id: `wheel-${front < 0 ? 'front' : 'rear'}-${side < 0 ? 'left' : 'right'}`,
      kind: 'wheel', start, count: positions.length / 3 - start, pivot,
      steering: front < 0, rollAxis: 'x', radius: wheelRadius });
  }
  }

  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) for (let axis = 0; axis < 3; axis += 1) {
    min[axis] = Math.min(min[axis], positions[i + axis]); max[axis] = Math.max(max[axis], positions[i + axis]);
  }
  return {
    id: spec.id || 'kart-prototype', heroId: spec.heroId || null,
    positions: new Float32Array(positions), normals: new Float32Array(normals), colors: new Float32Array(colors),
    indices: null, parts, features,
    bounds: { min, max }, driverAnchor: [...(spec.driverAnchor || [0, 0.78, 0.18])],
    forwardAxis: '-z', upAxis: 'y', units: 'metres', worldScale: KART_MODEL_SCALE,
    fidelityStatus: spec.fidelityStatus || 'unreviewed-original-kart-adaptation'
  };
}
