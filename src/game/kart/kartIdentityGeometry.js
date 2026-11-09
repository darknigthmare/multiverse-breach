/**
 * Recognisable vehicle silhouettes for the crossover kart catalogue.
 *
 * These are deliberately compact, open-cockpit adaptations, not source-asset
 * replicas. The same faces feed WebGL, GLB and the eight-direction atlas. Named
 * landmarks own real vertex ranges, so a reference cannot be satisfied merely
 * by putting its name into metadata. Nothing is picked from a hash or role.
 */
export const KART_IDENTITY_MODELS = Object.freeze([
  'warthog', 'narcissus', 'ghost', 'banshee', 'mako', 'x-wing', 'tie-fighter',
  'falcon', 'puddle-jumper', 'lightcycle', 'delorean', 'ecto-wagon', 'batmobile',
  'tumbler', 'interceptor', 'saucer', 'gunship', 'dropship', 'starfighter',
  'shuttle', 'podracer', 'speeder', 'hoverboard', 'tank', 'apc', 'jeep', 'buggy',
  'motorbike', 'sports-car', 'muscle-car', 'sedan', 'police-car', 'van', 'truck',
  'bus', 'train', 'minecart', 'ship', 'submarine', 'biplane', 'dragon', 'beast',
  'carriage', 'wagon', 'cauldron', 'pumpkin', 'mushroom', 'food-cart', 'toy-car',
  'mech', 'clockwork', 'reliquary', 'stage', 'camera-rig', 'lab-pod', 'book',
  'crystal', 'nature', 'suture'
]);

/** Nonempty variants are explicit contracts, never silently ignored hints. */
export const KART_IDENTITY_VARIANTS = Object.freeze({
  'tie-fighter': Object.freeze(['advanced-x1']),
  motorbike: Object.freeze(['sidecar', 'gantz-cycle', 'wheelchair', 'segway', 'bicycle']),
  starfighter: Object.freeze(['death-glider']),
  shuttle: Object.freeze(['lunar-rocket']),
  hoverboard: Object.freeze(['duel-disk']),
  biplane: Object.freeze(['monoplane']),
  mech: Object.freeze(['tachikoma']),
  beast: Object.freeze(['shark', 'hammerhead', 'elephant', 'giraffe'])
});

export const KART_IDENTITY_MOTIFS = Object.freeze([
  'armor', 'antenna', 'radar', 'thrusters', 'plasma', 'wings', 'solar-panels',
  's-foils', 'engine-pods', 'flux-coils', 'ghost-trap', 'bat-fins', 'blower',
  'exhaust', 'tracks', 'rollbar', 'tools', 'tanks', 'pipes', 'hazard-stripes',
  'scanner', 'portal-rings', 'gate-ring', 'lambda', 'crowbar', 'umbrella', 'dna',
  'tentacles', 'ribs', 'spines', 'claws', 'tusks', 'skull', 'horns', 'chains',
  'swords', 'shield', 'runes', 'scrolls', 'books', 'candles', 'lanterns',
  'crystals', 'gems', 'vines', 'leaves', 'flowers', 'mushrooms', 'wings-feather',
  'dragon-wings', 'sail', 'anchor', 'helm', 'treasure', 'steam', 'gears', 'clock',
  'speakers', 'guitar', 'drums', 'equalizer', 'vinyl', 'microphone', 'camera',
  'film', 'television', 'neon', 'circuit', 'matrix', 'blocks', 'pixel', 'ring',
  'star', 'heart', 'cards', 'dice', 'chess', 'ball', 'food', 'sweets', 'bottles',
  'medical', 'bow', 'quiver', 'fishing', 'basket', 'rocket', 'moon', 'sun',
  'snow', 'fire', 'water', 'electric', 'rainbow', 'smoke', 'eyes', 'ears',
  'tail', 'feathers', 'badge', 'flag', 'suture', 'mask', 'chainsaw', 'optic', 'eye-sigil',
  'cactus', 'sneakers', 'slippers'
]);

const TAU = Math.PI * 2;
const SIDES = [-1, 1];
const MODEL_SET = new Set(KART_IDENTITY_MODELS);
const MOTIF_SET = new Set(KART_IDENTITY_MOTIFS);

/** Return false only for an old spec without an identity; malformed new specs fail. */
export function buildKartIdentityGeometry(spec, context) {
  const identity = spec.vehicleIdentity;
  if (!identity) return false;
  if (!MODEL_SET.has(identity.model)) throw new Error(`Unknown kart identity model: ${identity.model}`);
  if (identity.variant != null && identity.variant !== ''
    && !KART_IDENTITY_VARIANTS[identity.model]?.includes(identity.variant)) {
    throw new Error(`Unknown kart identity variant: ${identity.model}/${identity.variant}`);
  }
  const motifs = [...new Set(identity.motifs || [])];
  for (const motif of motifs) if (!MOTIF_SET.has(motif)) throw new Error(`Unknown kart identity motif: ${motif}`);
  const { box, hull, cylinder, ring, strut, triangle, quad, positions, parts, features,
    primary, accent, detail, metal, dark, rubber, shade, light, kartColor } = context;
  const model = identity.model;
  const white = kartColor('#e2e6de'), glass = kartColor('#4b8898');
  const red = kartColor('#bd3b30'), amber = kartColor('#e8ab38'), blue = kartColor('#54c6e1');
  const wood = kartColor('#76513a'), bone = kartColor('#d8cfa7'), green = kartColor('#48845b');
  const part = (name, draw, kind = 'body') => {
    const start = positions.length / 3;
    draw();
    const count = positions.length / 3 - start;
    if (!count) throw new Error(`Empty kart identity landmark: ${name}`);
    parts.push({ id: `identity-${model}-${name}`, kind, start, count, pivot: [0, 0, 0] });
  };
  const landmark = (name, draw) => { features.push(`landmark:${name}`); part(name, draw); };
  const sphere = (location, size, color, segments = 10, bands = 5) => {
    const point = (a, b) => [location[0] + Math.sin(b) * Math.cos(a) * size[0],
      location[1] + Math.cos(b) * size[1], location[2] + Math.sin(b) * Math.sin(a) * size[2]];
    for (let band = 0; band < bands; band += 1) for (let segment = 0; segment < segments; segment += 1) {
      const a = TAU * segment / segments, aa = TAU * (segment + 1) / segments;
      const b = Math.PI * band / bands, bb = Math.PI * (band + 1) / bands;
      if (band === 0) triangle(point(a, b), point(aa, bb), point(a, bb), color);
      else if (band === bands - 1) triangle(point(a, b), point(aa, b), point(a, bb), color);
      else quad(point(a, b), point(aa, b), point(aa, bb), point(a, bb), color);
    }
  };
  // Horizontal polygon extruded in Y, for wings, hulls, books and shields.
  const slab = (outline, bottom, top, color) => {
    const center = outline.reduce((sum, p) => [sum[0] + p[0] / outline.length, sum[1] + p[1] / outline.length], [0, 0]);
    const area = outline.reduce((sum, p, i) => { const q = outline[(i + 1) % outline.length]; return sum + p[0] * q[1] - q[0] * p[1]; }, 0);
    const points = area > 0 ? [...outline].reverse() : outline;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i], b = points[(i + 1) % points.length];
      triangle([center[0], top, center[1]], [a[0], top, a[1]], [b[0], top, b[1]], color);
      triangle([center[0], bottom, center[1]], [b[0], bottom, b[1]], [a[0], bottom, a[1]], color);
      quad([a[0], bottom, a[1]], [b[0], bottom, b[1]], [b[0], top, b[1]], [a[0], top, a[1]], color);
    }
  };
  const pin = (x, y, z, color = detail, height = 0.25, radius = 0.09) => cylinder([x, y, z], radius, height, color, 'y', 6, 0.025);
  const rearJets = (x = 0.52, y = 0.59, z = 1.27, radius = 0.18) => {
    for (const side of SIDES) {
      cylinder([side * x, y, z], radius, 0.2, dark, 'z', 10);
      cylinder([side * x, y, z + 0.115], radius * 0.72, 0.035, detail, 'z', 10);
    }
  };
  const grill = (x, y, z, width = 0.8, height = 0.2, color = dark) => {
    box([x, y, z], [width, height, 0.05], color);
    for (let i = -2; i <= 2; i += 1) box([x + i * width / 5.8, y, z - 0.035], [0.035, height * 0.82, 0.025], metal);
  };
  const lamps = (z = -1.4, y = 0.56, x = 0.6, color = detail) => {
    for (const side of SIDES) box([side * x, y, z], [0.24, 0.11, 0.035], color);
  };
  const sideSills = (x = 0.73, top = 0.68, length = 2.28) => {
    for (const side of SIDES) hull([side * x, top - 0.14, 0], [0.27, 0.28, length], primary, 0.8);
  };
  const car = ({ long = false, width = 1.6, hood = 0.59, rear = 0.55 } = {}) => {
    box([0, 0.35, 0], [width, 0.2, long ? 2.95 : 2.65], shade);
    hull([0, hood, -0.98], [width, 0.34, 0.96], primary, 0.88);
    box([0, rear, 0.98], [width, 0.3, 0.75], primary);
    sideSills(width / 2 - 0.1, 0.7, long ? 2.9 : 2.55);
    box([0, hood + 0.2, -0.68], [width * 0.75, 0.17, 0.05], glass, [-0.3, 0, 0]);
    box([0, 0.37, -1.43], [width * 1.04, 0.12, 0.11], metal);
    lamps(-1.47, hood - 0.02, width * 0.35);
    lamps(1.37, rear, width * 0.36, red);
  };
  const boat = ({ point = 0.22, beam = 1.02, length = 1.5, color = primary } = {}) => {
    slab([[0, -length], [beam * 0.78, -length * 0.65], [beam, 0.45], [beam * 0.8, length * 0.8],
      [-beam * 0.8, length * 0.8], [-beam, 0.45], [-beam * 0.78, -length * 0.65]], 0.26, 0.48, shade);
    for (const side of SIDES) {
      hull([side * beam * 0.76, 0.55, 0.12], [beam * 0.35, 0.43, length * 1.5], color, point);
      strut([side * beam * 0.72, 0.76, 0.98], [side * beam * 0.6, 0.76, -0.9], 0.055, accent);
    }
    hull([0, 0.52, -0.95], [beam * 1.4, 0.34, 0.95], color, 0.08);
    box([0, 0.5, 1.0], [beam * 1.55, 0.35, 0.44], color);
  };
  const wingPair = (z = 0.25, span = 1.6, color = primary, height = 0.58) => {
    for (const side of SIDES) slab([[side * 0.43, z - 0.58], [side * span, z + 0.05],
      [side * (span - 0.13), z + 0.5], [side * 0.44, z + 0.28]], height, height + 0.07, color);
  };
  let wheelX = 0.89, wheelZ = 0.98, radius = 0.3, wheelWidth = 0.25;
  let wheelLayout = null;
  let hiddenRollers = false;
  features.push(`identity:${model}`);

  // The reference silhouettes below are authored independently of driver role.
  switch (model) {
    case 'warthog':
      wheelX = 0.95; wheelZ = 1.0; radius = 0.38; wheelWidth = 0.35;
      landmark('warthog-sloped-armored-bonnet', () => {
        box([0, 0.4, 0], [1.58, 0.22, 2.7], dark);
        hull([0, 0.6, -0.96], [1.6, 0.56, 1.12], primary, 0.77);
        for (const side of SIDES) {
          box([side * 0.74, 0.72, -0.98], [0.45, 0.12, 0.97], primary, [0, 0, side * 0.08]);
          box([side * 0.74, 0.69, 1.0], [0.45, 0.15, 0.9], primary);
          box([side * 0.78, 0.5, 0.05], [0.19, 0.27, 1.45], primary);
          strut([side * 0.7, 0.35, -1.37], [side * 0.77, 0.69, -1.48], 0.09, metal);
        }
        grill(0, 0.48, -1.49, 0.77, 0.21); lamps(-1.49, 0.68, 0.58);
        box([0, 0.38, -1.56], [1.8, 0.11, 0.1], metal);
        for (let i = -2; i <= 2; i += 1) box([i * 0.14, 0.91, -0.67], [0.06, 0.025, 0.32], dark);
      });
      landmark('warthog-open-cage-and-cargo-bed', () => {
        for (const side of SIDES) {
          strut([side * 0.63, 0.63, -0.63], [side * 0.57, 1.23, -0.35], 0.055, dark);
          strut([side * 0.68, 0.57, 0.72], [side * 0.57, 1.33, 0.48], 0.07, dark);
          strut([side * 0.57, 1.33, 0.48], [side * 0.76, 0.74, 1.22], 0.06, metal);
        }
        box([0, 1.24, -0.35], [1.18, 0.055, 0.055], dark);
        box([0, 1.34, 0.48], [1.22, 0.07, 0.07], dark);
        box([0, 0.55, 1.02], [1.27, 0.13, 0.69], primary);
        ring([0, 0.66, 1.0], 0.3, 0.055, dark, 'y', 12);
        box([0.54, 0.83, 1.05], [0.23, 0.28, 0.38], dark);
        box([0.54, 0.99, 0.85], [0.12, 0.1, 0.61], metal);
      });
      break;
    case 'narcissus':
      wheelX = 0.78; wheelZ = 0.96; radius = 0.25; hiddenRollers = true;
      landmark('narcissus-chamfered-shuttle-wedge', () => {
        slab([[-0.5, -1.62], [0.5, -1.62], [1.11, -0.44], [1.03, 1.27], [-1.03, 1.27], [-1.11, -0.44]], 0.28, 0.48, shade);
        hull([0, 0.57, -1.01], [1.75, 0.45, 1.22], primary, 0.55);
        for (const side of SIDES) {
          hull([side * 0.83, 0.62, 0.12], [0.43, 0.45, 2.02], primary, 0.7);
          box([side * 0.29, 0.73, -1.19], [0.42, 0.045, 0.43], dark, [0.22, 0, 0]);
          box([side * 0.92, 0.65, 0.0], [0.035, 0.09, 1.09], red);
          box([side * 1.075, 0.5, 0.46], [0.12, 0.22, 0.89], metal);
          for (let i = 0; i < 5; i += 1) box([side * 1.14, 0.5, 0.17 + i * 0.14], [0.02, 0.12, 0.045], dark);
        }
        box([0, 0.59, 0.96], [1.91, 0.38, 0.65], primary);
        box([0, 0.87, 0.96], [0.53, 0.22, 0.43], shade);
        box([0, 1.0, 0.99], [0.41, 0.055, 0.29], primary);
      });
      landmark('narcissus-paired-rounded-aft-thrusters-and-docking-hatch', () => {
        for (const side of SIDES) {
          cylinder([side * 0.64, 0.76, 0.97], 0.32, 0.73, primary, 'z', 12, 0.28);
          cylinder([side * 0.64, 0.76, 1.37], 0.26, 0.09, metal, 'z', 12);
          cylinder([side * 0.64, 0.76, 1.43], 0.2, 0.035, dark, 'z', 12);
          ring([side * 0.64, 0.76, 0.86], 0.325, 0.025, shade, 'z', 12);
          box([side * 0.64, 1.09, 0.91], [0.22, 0.025, 0.35], shade);
        }
        box([0, 0.64, -1.57], [0.49, 0.24, 0.045], shade);
        box([0, 0.64, -1.6], [0.36, 0.15, 0.023], primary);
        box([0.12, 0.65, -1.616], [0.035, 0.04, 0.015], red);
      });
      break;
    case 'ghost':
      hiddenRollers = true; wheelX = 0.58; radius = 0.25;
      landmark('ghost-twin-swept-pontoons', () => {
        box([0, 0.47, 0.2], [0.93, 0.22, 1.44], shade);
        for (const side of SIDES) {
          hull([side * 0.82, 0.54, -0.4], [0.64, 0.44, 2.16], primary, 0.28);
          hull([side * 0.61, 0.54, 0.92], [0.36, 0.3, 0.8], primary, 0.72);
          box([side * 0.9, 0.55, -1.42], [0.2, 0.055, 0.04], detail);
          ring([side * 0.84, 0.59, 0.44], 0.13, 0.035, detail, 'x', 8);
        }
        sphere([0, 0.64, -0.55], [0.55, 0.26, 0.53], primary);
      });
      break;
    case 'banshee':
      hiddenRollers = true; wheelX = 0.37; wheelZ = 0.76; radius = 0.25;
      landmark('banshee-curved-body-and-drooping-wings', () => {
        slab([[-0.35, -1.07], [0.35, -1.07], [0.68, -0.37], [0.6, 1.08], [-0.6, 1.08], [-0.68, -0.37]], 0.26, 0.45, shade);
        sphere([0, 0.71, -0.72], [0.54, 0.34, 0.57], primary, 14, 6);
        sphere([0, 0.69, 0.93], [0.51, 0.32, 0.43], primary, 12, 5);
        for (const side of SIDES) {
          sphere([side * 0.52, 0.62, 0.14], [0.25, 0.3, 0.78], primary, 12, 5);
          // A thick compound wing sweeps forward from the rear of the shell;
          // its outer lobe droops below the cockpit instead of resembling a fin.
          const outline = [[0.45, 0.76, -0.38], [0.82, 0.73, -1.01], [1.4, 0.5, -1.19],
            [1.69, 0.35, -0.63], [1.42, 0.41, 0.47], [0.63, 0.73, 0.86]];
          const top = outline.map(([x, y, z]) => [side * x, y, z]);
          if (side > 0) top.reverse();
          const bottom = top.map(([x, y, z]) => [x, y - 0.13, z]);
          for (let i = 0; i < top.length; i += 1) {
            const next = (i + 1) % top.length;
            triangle([side * 1.04, 0.78, -0.17], top[i], top[next], primary);
            triangle([side * 1.04, 0.52, -0.17], bottom[next], bottom[i], shade);
            quad(bottom[i], bottom[next], top[next], top[i], primary);
          }
          hull([side * 1.35, 0.33, -0.43], [0.25, 0.2, 0.97], shade, 0.25);
          cylinder([side * 1.35, 0.33, -0.94], 0.075, 0.08, detail, 'z', 8);
          box([side * 0.57, 0.89, 0.32], [0.06, 0.04, 0.52], accent, [-0.07, 0, 0]);
        }
      });
      break;
    case 'mako':
      wheelX = 0.85; wheelZ = 1.04; radius = 0.33;
      landmark('mako-wedge-rover', () => {
        hull([0, 0.6, -0.62], [1.55, 0.58, 1.7], primary, 0.63);
        box([0, 0.53, 0.71], [1.5, 0.36, 1.02], primary);
        sideSills(0.77, 0.8);
        for (const side of SIDES) {
          box([side * 0.7, 0.79, 0.04], [0.16, 0.08, 2.35], red);
        }
        box([0.47, 1.03, 0.87], [0.54, 0.3, 0.55], primary);
        cylinder([0.47, 1.12, 0.38], 0.07, 0.81, dark, 'z', 8);
        lamps(-1.48, 0.53, 0.47);
      });
      break;
    case 'x-wing':
      hiddenRollers = true; wheelX = 0.45; radius = 0.25;
      landmark('x-wing-needle-nose', () => {
        hull([0, 0.5, -0.73], [0.78, 0.34, 1.91], primary, 0.21);
        sideSills(0.46, 0.68, 1.47);
        box([0, 0.48, 0.69], [0.88, 0.3, 1.05], primary);
        box([0, 0.68, -1.0], [0.12, 0.025, 0.82], accent);
      });
      landmark('x-wing-four-separated-s-foils', () => {
        for (const side of SIDES) for (const high of SIDES) {
          box([side * 1.05, 0.64 + high * 0.24, 0.43], [1.11, 0.07, 0.4], primary, [0, 0, side * high * 0.26]);
          cylinder([side * 1.52, 0.64 + high * 0.38, 0.07], 0.035, 1.12, dark, 'z', 6);
          cylinder([side * 0.64, 0.64 + high * 0.18, 0.76], 0.145, 0.85, shade, 'z', 10);
          cylinder([side * 0.64, 0.64 + high * 0.18, 1.2], 0.1, 0.035, red, 'z', 8);
        }
      });
      break;
    case 'tie-fighter':
      hiddenRollers = true; wheelX = 0.5; radius = 0.25;
      landmark('tie-central-cockpit-sphere', () => {
        sphere([0, 0.56, -0.58], [0.66, 0.5, 0.66], primary);
        cylinder([0, 0.6, -1.19], 0.35, 0.06, dark, 'z', 8);
        for (let spoke = 0; spoke < 8; spoke += 1) {
          const a = TAU * spoke / 8;
          strut([0, 0.6, -1.227], [Math.cos(a) * 0.34, 0.6 + Math.sin(a) * 0.34, -1.227], 0.024, metal);
        }
        box([0, 0.43, 0.31], [0.83, 0.23, 1.64], shade);
        if (identity.variant === 'advanced-x1') box([0, 0.58, 0.96], [1.11, 0.37, 0.78], primary);
      });
      landmark(identity.variant === 'advanced-x1' ? 'tie-advanced-bent-solar-panels' : 'tie-hexagonal-solar-wings', () => {
        for (const side of SIDES) {
          box([side * 0.89, 0.65, 0.0], [0.76, 0.13, 0.15], metal);
          if (identity.variant === 'advanced-x1') {
            const levels = [[1.0, 0.18], [1.27, 0.53], [1.27, 1.13], [1.0, 1.5]];
            for (let i = 0; i < levels.length - 1; i += 1) {
              const [x1, y1] = levels[i], [x2, y2] = levels[i + 1];
              const a = [side * x1, y1, -0.91], b = [side * x1, y1, 0.91];
              const c = [side * x2, y2, 0.91], d = [side * x2, y2, -0.91];
              quad(a, b, c, d, dark); quad(d, c, b, a, dark);
              strut(a, d, 0.06, metal); strut(b, c, 0.06, metal);
              strut(a, b, 0.045, metal);
              for (const z of [-0.46, 0, 0.46]) strut([side * x1, y1, z], [side * x2, y2, z], 0.022, shade);
            }
            strut([side, 1.5, -0.91], [side, 1.5, 0.91], 0.06, metal);
            continue;
          }
          const outline = [[-0.71, -0.1], [-0.98, 0.56], [-0.71, 1.22], [0.71, 1.22], [0.98, 0.56], [0.71, -0.1]];
          // Polygon lies in Y/Z, leaving the cockpit open along its fore/aft axis.
          for (let i = 0; i < outline.length; i += 1) {
            const [z1, y1] = outline[i], [z2, y2] = outline[(i + 1) % outline.length];
            triangle([side * 1.27, 0.56, 0], [side * 1.27, y1 + 0.28, z1], [side * 1.27, y2 + 0.28, z2], dark);
            triangle([side * 1.27, 0.56, 0], [side * 1.27, y2 + 0.28, z2], [side * 1.27, y1 + 0.28, z1], dark);
            strut([side * 1.27, y1 + 0.28, z1], [side * 1.27, y2 + 0.28, z2], 0.06, metal);
            strut([side * 1.28, 0.84, 0], [side * 1.28, y1 + 0.28, z1], 0.024, shade);
          }
        }
      });
      break;
    case 'falcon':
      hiddenRollers = true; wheelX = 0.73; radius = 0.25;
      landmark('falcon-saucer-and-split-mandibles', () => {
        cylinder([0, 0.44, 0.16], 1.19, 0.28, primary, 'y', 16);
        for (const side of SIDES) {
          hull([side * 0.48, 0.5, -1.05], [0.61, 0.27, 1.22], primary, 0.7);
          box([side * 0.48, 0.65, -1.06], [0.31, 0.035, 0.57], shade);
        }
        cylinder([0.88, 0.58, -0.39], 0.23, 0.86, primary, 'z', 10);
        cylinder([0.88, 0.58, -0.84], 0.16, 0.035, dark, 'z', 8);
        for (let i = -2; i <= 2; i += 1) cylinder([i * 0.29, 0.61, 0.8], 0.12, 0.045, dark, 'y', 8);
        for (let i = -2; i <= 2; i += 1) box([i * 0.27, 0.45, 1.21 - Math.abs(i) * 0.045], [0.24, 0.09, 0.04], blue);
      });
      break;
    case 'puddle-jumper':
      hiddenRollers = true; wheelX = 0.74; radius = 0.25;
      landmark('jumper-barrel-hull-and-retractable-pods', () => {
        hull([0, 0.5, -0.96], [1.3, 0.46, 0.91], primary, 0.73);
        box([0, 0.47, 0.81], [1.31, 0.48, 0.88], primary);
        sideSills(0.56, 0.72, 2.42);
        for (const side of SIDES) {
          box([side * 0.29, 0.69, -1.17], [0.5, 0.07, 0.32], glass, [0.28, 0, 0]);
          cylinder([side * 0.96, 0.55, 0.3], 0.22, 1.49, primary, 'z', 8);
          cylinder([side * 0.96, 0.55, 1.06], 0.15, 0.035, blue, 'z', 8);
          box([side * 0.73, 0.55, 0.3], [0.37, 0.12, 0.58], metal);
        }
        box([0, 0.59, 1.27], [0.69, 0.45, 0.04], shade);
        box([0, 0.59, 1.3], [0.5, 0.32, 0.025], metal);
      });
      break;
    case 'lightcycle':
      wheelX = 0.47; wheelZ = 1.02; radius = 0.35; wheelWidth = 0.19;
      landmark('lightcycle-enclosed-wheel-pods', () => {
        box([0, 0.4, 0], [0.7, 0.24, 2.31], dark);
        for (const z of [-1.04, 1.04]) {
          cylinder([0, 0.53, z], 0.48, 0.75, primary, 'x', 16);
          for (const side of SIDES) ring([side * 0.4, 0.53, z], 0.35, 0.045, accent, 'x', 16);
        }
        for (const side of SIDES) box([side * 0.37, 0.68, 0], [0.09, 0.12, 1.7], accent);
        hull([0, 0.69, -0.53], [0.65, 0.32, 0.58], primary, 0.66);
      });
      break;
    case 'delorean':
      wheelX = 0.8; wheelZ = 1.01;
      landmark('delorean-stainless-wedge', () => {
        car({ width: 1.59, hood: 0.5 });
        box([0, 0.51, -1.48], [1.5, 0.16, 0.04], dark);
        for (const x of [-0.66, -0.45, 0.45, 0.66]) box([x, 0.54, -1.51], [0.17, 0.09, 0.035], white);
        box([0, 0.34, -1.45], [1.64, 0.11, 0.12], dark);
        for (const side of SIDES) {
          hull([side * 0.68, 0.73, 0.02], [0.18, 0.35, 1.19], primary, 0.95);
          box([side * 0.8, 0.51, 0.0], [0.035, 0.055, 2.49], dark);
          box([side * 0.51, 0.95, 1.0], [0.38, 0.54, 0.45], dark, [-0.32, 0, 0]);
          for (let i = 0; i < 4; i += 1) box([side * 0.51, 0.83 + i * 0.12, 1.26 - i * 0.035], [0.3, 0.035, 0.035], metal);
          strut([side * 0.78, 0.63, -1.1], [side * 0.78, 0.75, 1.0], 0.035, blue);
        }
        box([0, 0.72, 1.05], [0.41, 0.19, 0.35], metal);
      });
      break;
    case 'ecto-wagon':
      wheelX = 0.84; wheelZ = 1.07;
      landmark('ecto-ambulance-fins-and-roof-rack', () => {
        car({ long: true, width: 1.65, hood: 0.61, rear: 0.83 });
        // Keep the rear ambulance compartment and its equipment, opening only
        // the driver's section rather than flattening the whole wagon to a car.
        box([0, 1.0, 1.1], [1.59, 0.56, 0.83], primary);
        box([0, 1.31, 1.03], [1.69, 0.11, 1.04], primary);
        box([0, 1.02, 1.53], [1.24, 0.28, 0.035], glass);
        for (const side of SIDES) {
          box([side * 0.82, 1.04, 1.02], [0.03, 0.3, 0.76], glass);
          box([side * 0.84, 0.99, 1.38], [0.095, 0.42, 0.37], primary, [-0.25, 0, 0]);
          box([side * 0.83, 0.58, 0.03], [0.025, 0.12, 2.6], red);
          box([side * 0.58, 1.43, 1.03], [0.07, 0.09, 0.91], metal);
          cylinder([side * 0.58, 0.78, 1.58], 0.07, 0.04, red, 'z', 8);
        }
        box([0, 1.4, 1.03], [1.2, 0.06, 0.86], metal);
        cylinder([-0.4, 1.61, 0.88], 0.12, 0.28, blue, 'y', 8);
        cylinder([0.4, 1.61, 0.88], 0.12, 0.28, blue, 'y', 8);
        cylinder([0.36, 1.56, 1.2], 0.12, 0.54, red, 'z', 8);
        box([-0.22, 1.56, 1.22], [0.34, 0.23, 0.31], dark);
        for (const y of [0.75, 0.95, 1.15, 1.35]) box([0.89, y, 0.73], [0.04, 0.035, 0.31], metal);
        for (const z of [0.56, 0.91]) box([0.89, 1.05, z], [0.04, 0.67, 0.035], metal);
      });
      break;
    case 'batmobile':
      wheelX = 0.86; wheelZ = 1.03;
      landmark('batmobile-turbine-nose', () => {
        car({ long: true, width: 1.59, hood: 0.48 });
        cylinder([0, 0.54, -1.45], 0.24, 0.3, shade, 'z', 12);
        cylinder([0, 0.54, -1.62], 0.17, 0.035, metal, 'z', 12);
        for (const side of SIDES) {
          hull([side * 0.73, 0.7, -0.62], [0.36, 0.31, 1.5], primary, 0.48);
          box([side * 0.79, 1.03, 0.99], [0.08, 0.78, 0.79], primary, [-0.37, 0, side * -0.2]);
        }
        rearJets(0.0, 0.5, 1.39, 0.21);
      });
      break;
    case 'tumbler':
      wheelX = 0.97; wheelZ = 0.99; radius = 0.39; wheelWidth = 0.35;
      landmark('tumbler-broken-armor-and-front-forks', () => {
        hull([0, 0.49, -0.87], [1.12, 0.41, 1.23], primary, 0.25);
        box([0, 0.47, 0.59], [1.68, 0.4, 1.4], primary);
        for (const side of SIDES) {
          box([side * 0.67, 0.68, -0.3], [0.42, 0.24, 1.07], primary, [-0.1, side * 0.15, side * -0.18]);
          strut([side * 0.47, 0.43, -0.44], [side * 0.9, 0.38, -1.07], 0.16, metal);
          box([side * 0.53, 0.99, 0.78], [0.78, 0.095, 0.66], shade, [0.32, side * -0.12, 0]);
          box([side * 0.77, 0.64, 1.05], [0.61, 0.14, 0.84], primary);
        }
        rearJets(0.48, 0.56, 1.35, 0.16);
      });
      break;
    case 'interceptor':
      wheelX = 0.85; wheelZ = 1.03; radius = 0.34;
      landmark('interceptor-fastback-and-supercharger', () => {
        car({ long: true, width: 1.64, hood: 0.55 });
        box([0, 0.84, -0.96], [0.44, 0.28, 0.47], metal);
        box([0, 1.0, -0.99], [0.56, 0.09, 0.35], dark);
        for (const side of SIDES) {
          box([side * 0.7, 0.73, 0.92], [0.12, 0.34, 0.72], primary, [-0.24, 0, 0]);
          for (let i = 0; i < 3; i += 1) cylinder([side * 0.84, 0.43, 0.45 + i * 0.19], 0.045, 0.28, metal, 'x', 6);
        }
        box([0, 0.87, 1.17], [1.62, 0.085, 0.27], primary);
      });
      break;
    case 'saucer':
      hiddenRollers = true; wheelX = 0.7; radius = 0.25;
      landmark('saucer-double-rim', () => {
        cylinder([0, 0.4, 0], 1.18, 0.22, primary, 'y', 20, 0.91);
        cylinder([0, 0.28, 0], 0.86, 0.12, shade, 'y', 20, 1.18);
        ring([0, 0.4, 0], 1.16, 0.05, accent, 'y', 20);
        ring([0, 0.68, 0], 0.67, 0.09, primary, 'y', 16);
        for (let i = 0; i < 8; i += 1) cylinder([Math.cos(i * TAU / 8) * 0.92, 0.53, Math.sin(i * TAU / 8) * 0.92], 0.07, 0.045, detail, 'y', 8);
      });
      break;
    case 'gunship':
    case 'dropship':
      hiddenRollers = true; wheelX = 0.76; radius = 0.25;
      landmark(`${model}-armored-cargo-fuselage`, () => {
        hull([0, 0.55, -0.81], [1.34, 0.53, 1.25], primary, 0.59);
        box([0, 0.5, 0.78], [1.4, 0.48, 0.89], primary);
        sideSills(0.59, 0.73, 2.48);
        for (const side of SIDES) {
          box([side * 0.3, 0.81, -0.96], [0.43, 0.045, 0.32], dark, [0.27, 0, 0]);
          box([side * 1.05, 0.59, model === 'gunship' ? 0.25 : 0.77], [0.6, 0.12, 0.53], shade);
          cylinder([side * 1.27, 0.61, model === 'gunship' ? 0.18 : 0.67], 0.23, model === 'gunship' ? 1.04 : 0.72, primary, 'z', 10);
          cylinder([side * 1.27, 0.61, model === 'gunship' ? 0.73 : 1.05], 0.16, 0.035, accent, 'z', 10);
        }
        if (model === 'gunship') {
          for (const side of SIDES) cylinder([side * 0.64, 0.42, -1.36], 0.055, 0.58, dark, 'z', 8);
        } else {
          box([0, 0.56, 1.26], [0.84, 0.45, 0.08], metal);
          for (let i = -2; i <= 2; i += 1) box([i * 0.15, 0.58, 1.31], [0.045, 0.35, 0.025], dark);
        }
      });
      break;
    case 'starfighter':
    case 'shuttle':
      hiddenRollers = true; wheelX = 0.59; radius = 0.25;
      if (model === 'starfighter' && identity.variant === 'death-glider') {
        landmark('death-glider-crescent-wings-and-central-pod', () => {
          sphere([0, 0.62, -0.66], [0.51, 0.31, 0.58], primary, 12, 5);
          box([0, 0.4, 0.26], [0.87, 0.22, 1.57], shade);
          for (const side of SIDES) {
            sphere([side * 0.46, 0.58, 0.21], [0.2, 0.22, 0.74], primary, 10, 4);
            // Thick curved sweeps, with a clean inner cutout around the pilot.
            const outline = [[side * 0.42, 0.55], [side * 0.65, -0.18], [side * 1.0, -0.75],
              [side * 1.58, -1.1], [side * 1.5, -0.4], [side * 1.12, 0.61], [side * 0.6, 1.04]];
            slab(outline, 0.42, 0.57, primary);
            for (let i = 0; i < 4; i += 1) {
              const x = side * (0.69 + i * 0.18), z = 0.51 - i * 0.36;
              box([x, 0.6, z], [0.055, 0.04, 0.51], accent, [0, side * 0.48, 0]);
            }
            cylinder([side * 0.71, 0.52, -1.01], 0.055, 0.7, metal, 'z', 8);
          }
          box([0, 0.88, -0.68], [0.44, 0.055, 0.33], dark);
          rearJets(0.34, 0.49, 1.1, 0.13);
        });
        break;
      }
      if (model === 'shuttle' && identity.variant === 'lunar-rocket') {
        landmark('lunar-rocket-red-white-checkers-and-fins', () => {
          cylinder([0, 0.55, -0.82], 0.43, 0.55, primary, 'z', 12);
          cylinder([0, 0.55, -1.44], 0.025, 0.69, primary, 'z', 12, 0.43);
          cylinder([0, 0.55, 0.92], 0.43, 0.8, primary, 'z', 12);
          for (const side of SIDES) box([side * 0.37, 0.57, -0.02], [0.13, 0.24, 1.23], primary);
          for (const z of [-0.96, -0.66, 0.72, 1.05]) {
            const offset = z < -0.9 || z > 0.9 ? 1 : 0;
            for (let i = 0; i < 12; i += 1) if ((i + offset) % 2 === 0) {
              const a = TAU * i / 12;
              box([Math.sin(a) * 0.425, 0.55 + Math.cos(a) * 0.425, z], [0.22, 0.025, 0.3], white, [0, 0, -a]);
            }
          }
          for (const side of SIDES) slab([[side * 0.3, 0.66], [side * 0.98, 1.04], [side * 1.11, 1.53], [side * 0.3, 1.18]], 0.35, 0.42, primary);
          box([0, 1.08, 1.12], [0.08, 0.68, 0.54], primary, [-0.3, 0, 0]);
          cylinder([0, 0.55, 1.39], 0.27, 0.13, metal, 'z', 12);
          cylinder([0, 0.55, 1.47], 0.2, 0.035, dark, 'z', 12);
        });
        break;
      }
      landmark(`${model}-flight-planform`, () => {
        hull([0, 0.48, -0.74], [model === 'shuttle' ? 1.16 : 0.79, 0.4, 1.82], primary, model === 'shuttle' ? 0.64 : 0.19);
        sideSills(model === 'shuttle' ? 0.58 : 0.43, 0.68, 1.59);
        box([0, 0.5, 0.77], [model === 'shuttle' ? 1.18 : 0.86, 0.36, 0.8], primary);
        wingPair(0.37, model === 'shuttle' ? 1.18 : 1.57);
        rearJets(0.38, 0.51, 1.21, 0.17);
        box([0.55, 0.96, 1.0], [0.065, model === 'shuttle' ? 0.54 : 0.34, 0.47], primary, [-0.23, 0, 0]);
        if (model === 'shuttle') box([0, 0.73, -1.07], [0.71, 0.04, 0.24], dark);
        else box([0, 0.69, -0.89], [0.11, 0.02, 0.81], accent);
      });
      break;
    case 'podracer':
      hiddenRollers = true; wheelX = 0.51; wheelZ = 0.69; radius = 0.25;
      landmark('podracer-twin-engines-and-tow-bars', () => {
        hull([0, 0.48, 0.37], [0.87, 0.36, 1.45], primary, 0.54);
        for (const side of SIDES) {
          cylinder([side * 0.97, 0.51, -0.65], 0.32, 1.77, primary, 'z', 12);
          cylinder([side * 0.97, 0.51, -1.56], 0.25, 0.09, dark, 'z', 12);
          cylinder([side * 0.97, 0.51, 0.27], 0.22, 0.09, accent, 'z', 10);
          strut([side * 0.34, 0.55, 0.55], [side * 0.96, 0.56, -0.35], 0.04, metal);
          box([side * 0.97, 0.86, -0.73], [0.11, 0.06, 0.93], accent);
        }
        strut([-0.66, 0.55, -0.78], [-0.19, 0.64, -0.78], 0.04, blue);
        strut([-0.19, 0.64, -0.78], [0.23, 0.49, -0.78], 0.04, blue);
        strut([0.23, 0.49, -0.78], [0.66, 0.55, -0.78], 0.04, blue);
      });
      break;
    case 'speeder':
      hiddenRollers = true; wheelX = 0.61; radius = 0.25;
      landmark('speeder-long-cowl-and-stern-turbines', () => {
        hull([0, 0.47, -0.58], [1.39, 0.35, 2.18], primary, 0.65);
        sideSills(0.62, 0.68, 1.74);
        for (const side of SIDES) {
          cylinder([side * 0.83, 0.61, 0.76], 0.22, 1.02, primary, 'z', 12);
          cylinder([side * 0.83, 0.61, 1.29], 0.17, 0.035, dark, 'z', 10);
        }
        box([0, 0.64, -1.1], [0.77, 0.055, 0.57], shade);
      });
      break;
    case 'hoverboard':
      hiddenRollers = true; wheelX = 0.45; radius = 0.25;
      if (identity.variant === 'duel-disk') {
        landmark('duel-disk-half-arc-and-five-card-zones', () => {
          box([0, 0.4, 0.12], [0.85, 0.18, 1.78], shade);
          // Card zones follow a wide half-arc; they remain individually legible
          // rather than merely adding a card icon to a normal kart bonnet.
          for (let i = -2; i <= 2; i += 1) {
            const a = i * 0.39, x = Math.sin(a) * 1.52, z = -Math.cos(a) * 1.28;
            box([x, 0.57, z], [0.52, 0.18, 0.73], primary, [0, -a, 0]);
            box([x, 0.675, z], [0.42, 0.035, 0.6], dark, [0, -a, 0]);
            box([x, 0.703, z], [0.33, 0.025, 0.48], accent, [0, -a, 0]);
            box([x, 0.721, z], [0.24, 0.015, 0.32], shade, [0, -a, 0]);
          }
          hull([-0.65, 0.65, 0.64], [0.46, 0.35, 0.82], primary, 0.74);
          for (let i = 0; i < 4; i += 1) box([-0.65, 0.84 + i * 0.035, 0.66], [0.29, 0.025, 0.43], bone, [0, i * 0.04, 0]);
          box([0.63, 0.59, 0.68], [0.35, 0.16, 0.48], primary);
          box([0.63, 0.69, 0.68], [0.23, 0.035, 0.3], detail);
        });
        break;
      }
      landmark('hoverboard-turned-up-deck', () => {
        slab([[-0.47, -1.45], [0.47, -1.45], [0.73, -0.93], [0.73, 0.93], [0.47, 1.45], [-0.47, 1.45], [-0.73, 0.93], [-0.73, -0.93]], 0.35, 0.48, primary);
        for (const z of [-1, 1]) box([0, 0.52, z * 1.21], [1.03, 0.09, 0.5], accent, [z * -0.22, 0, 0]);
        for (const side of SIDES) cylinder([side * 0.49, 0.28, 0.59], 0.2, 0.1, detail, 'y', 10);
      });
      break;
    case 'tank':
    case 'apc':
      wheelX = 0.82; wheelZ = 1.05; radius = 0.32;
      landmark(`${model}-armored-hull`, () => {
        hull([0, 0.57, -0.61], [1.66, 0.55, 1.73], primary, 0.8);
        box([0, 0.56, 0.76], [1.65, 0.49, 0.96], primary);
        for (const side of SIDES) {
          box([side * 0.76, 0.75, 0], [0.36, 0.11, 2.71], primary);
          for (let i = 0; i < 3; i += 1) box([side * 0.84, 0.63, -0.44 + i * 0.43], [0.05, 0.18, 0.25], shade);
        }
        lamps(-1.49, 0.59, 0.57);
        if (model === 'tank') {
          box([0.54, 1.0, 0.72], [0.62, 0.35, 0.78], primary);
          cylinder([0.54, 1.11, 0.02], 0.08, 1.05, metal, 'z', 8);
        } else {
          box([0.5, 0.96, 0.83], [0.5, 0.18, 0.58], primary);
          for (const side of SIDES) cylinder([side * 0.91, 0.32, 0], 0.3, 0.26, rubber, 'x', 12);
        }
      });
      if (model === 'tank') landmark('tank-full-length-tracks', () => {
        for (const side of SIDES) {
          box([side * 0.98, 0.34, 0], [0.38, 0.5, 2.52], rubber);
          for (let i = 0; i < 11; i += 1) box([side * 0.98, 0.615, -1.14 + i * 0.228], [0.42, 0.05, 0.13], metal);
        }
      });
      break;
    case 'jeep':
    case 'buggy':
      wheelX = model === 'buggy' ? 0.97 : 0.88; wheelZ = 0.96; radius = 0.36;
      landmark(`${model}-offroad-frame`, () => {
        box([0, 0.4, 0], [1.36, 0.23, 2.56], shade);
        hull([0, 0.67, -0.93], [model === 'buggy' ? 0.86 : 1.39, 0.38, 0.84], primary, model === 'buggy' ? 0.39 : 0.93);
        box([0, 0.58, 0.97], [1.38, 0.31, 0.55], primary);
        sideSills(0.67, 0.65, 2.39);
        for (const side of SIDES) {
          strut([side * 0.61, 0.6, 0.58], [side * 0.54, 1.36, 0.45], 0.065, dark);
          strut([side * 0.54, 1.36, 0.45], [side * 0.62, 0.69, 1.13], 0.065, dark);
          if (model === 'buggy') strut([side * 0.43, 0.48, -0.39], [side * 0.93, 0.35, -0.97], 0.08, metal);
          else box([side * 0.75, 0.75, -0.91], [0.37, 0.1, 0.94], primary);
        }
        box([0, 1.36, 0.45], [1.15, 0.065, 0.065], dark);
        grill(0, 0.65, -1.38, model === 'buggy' ? 0.49 : 0.8, 0.23);
        lamps(-1.39, 0.71, 0.54);
      });
      break;
    case 'motorbike':
      wheelX = 0.49; wheelZ = 0.87; radius = 0.25; wheelWidth = 0.14;
      if (identity.variant === 'wheelchair') {
        wheelLayout = SIDES.flatMap(side => [
          { id: `wheel-rear-${side < 0 ? 'left' : 'right'}`, pivot: [side * 0.68, 0.53, 0.35], radius: 0.53, width: 0.12, steering: false, wire: true },
          { id: `wheel-front-${side < 0 ? 'left' : 'right'}`, pivot: [side * 0.47, 0.16, -0.81], radius: 0.16, width: 0.1, steering: true }
        ]);
        landmark('wheelchair-tubular-frame-armrests-and-footrests', () => {
          for (const side of SIDES) {
            strut([side * 0.42, 0.35, -0.6], [side * 0.42, 0.84, 0.55], 0.065, primary);
            strut([side * 0.42, 0.43, 0.56], [side * 0.42, 0.43, -0.56], 0.065, metal);
            strut([side * 0.42, 0.43, -0.56], [side * 0.47, 0.21, -0.81], 0.055, metal);
            strut([side * 0.31, 0.62, -0.15], [side * 0.31, 0.27, -0.9], 0.06, primary);
            box([side * 0.25, 0.25, -0.97], [0.39, 0.07, 0.31], dark);
            box([side * 0.44, 0.99, 0.06], [0.15, 0.075, 0.82], dark);
            box([side * 0.44, 0.82, 0.29], [0.055, 0.34, 0.055], metal);
            box([side * 0.38, 1.02, 0.57], [0.055, 0.65, 0.055], primary);
            box([side * 0.38, 1.33, 0.66], [0.075, 0.075, 0.23], dark);
            ring([side * 0.77, 0.53, 0.35], 0.42, 0.025, metal, 'x', 20);
          }
          box([0, 1.03, 0.55], [0.69, 0.52, 0.11], dark);
          box([0, 0.38, 0.37], [0.55, 0.24, 0.42], primary);
          cylinder([0, 0.4, 0.65], 0.14, 0.37, metal, 'x', 10);
          cylinder([0.44, 1.09, -0.23], 0.025, 0.18, metal, 'y', 6);
          sphere([0.44, 1.19, -0.23], [0.055, 0.045, 0.055], dark, 8, 4);
        });
        break;
      }
      if (identity.variant === 'segway') {
        wheelLayout = SIDES.map(side => ({ id: `wheel-side-${side < 0 ? 'left' : 'right'}`,
          pivot: [side * 0.6, 0.43, 0], radius: 0.43, width: 0.22, steering: false }));
        landmark('segway-two-wheel-platform-and-upright-handlebar', () => {
          box([0, 0.5, 0.03], [1.04, 0.18, 0.95], primary);
          for (const side of SIDES) {
            box([side * 0.26, 0.61, 0.07], [0.37, 0.035, 0.64], dark);
            hull([side * 0.6, 0.83, 0], [0.31, 0.12, 0.73], primary, 0.85);
          }
          strut([0, 0.56, -0.37], [0, 1.6, -0.57], 0.09, metal);
          box([0, 1.63, -0.57], [0.93, 0.08, 0.09], dark);
          box([0, 1.57, -0.57], [0.23, 0.14, 0.15], primary);
          box([0, 1.66, -0.57], [0.15, 0.035, 0.11], detail);
          // Racing adaptation: a small seat is fixed to the deck, not a rider.
          box([0, 0.64, 0.38], [0.1, 0.28, 0.1], metal);
        });
        break;
      }
      if (identity.variant === 'bicycle') {
        wheelLayout = SIDES.map(front => ({ id: `wheel-${front < 0 ? 'front' : 'rear'}-center`,
          pivot: [0, 0.43, front * 1.09], radius: 0.43, width: 0.085, steering: front < 0, wire: true }));
        landmark('bicycle-diamond-frame-and-empty-rear-child-seat', () => {
          const pedal = [0, 0.35, 0.12], saddle = [0, 0.9, 0.34], headset = [0, 0.86, -0.71];
          strut(pedal, saddle, 0.065, primary);
          strut(saddle, headset, 0.055, primary);
          strut(headset, pedal, 0.065, primary);
          for (const side of SIDES) {
            const back = [side * 0.08, 0.43, 1.09], front = [side * 0.08, 0.43, -1.09];
            strut([side * 0.08, 0.9, 0.34], back, 0.045, primary);
            strut([side * 0.08, 0.35, 0.12], back, 0.045, primary);
            strut([side * 0.08, 0.86, -0.71], front, 0.045, metal);
            box([side * 0.22, 0.34, 0.12], [0.2, 0.055, 0.13], dark);
            strut([side * 0.23, 0.66, 1.1], [side * 0.23, 1.0, 0.87], 0.035, metal);
            box([side * 0.23, 1.03, 0.92], [0.055, 0.27, 0.37], accent);
          }
          cylinder([0, 0.35, 0.12], 0.14, 0.12, metal, 'x', 12);
          strut([0, 0.86, -0.71], [0, 1.16, -0.81], 0.045, metal);
          box([0, 1.17, -0.81], [0.76, 0.055, 0.065], dark);
          box([0, 0.98, 0.91], [0.42, 0.08, 0.38], accent);
          box([0, 1.22, 1.12], [0.44, 0.53, 0.07], accent, [-0.1, 0, 0]);
          box([0, 1.22, 1.07], [0.33, 0.39, 0.035], dark, [-0.1, 0, 0]);
        });
        break;
      }
      if (identity.variant === 'gantz-cycle') {
        wheelX = 0.45; wheelZ = 0.67;
        landmark('gantz-cycle-open-monowheel-hoop', () => {
          box([0, 0.43, 0.02], [0.76, 0.22, 1.59], dark);
          for (const side of SIDES) {
            ring([side * 0.42, 0.99, 0.02], 0.86, 0.1, primary, 'x', 24);
            ring([side * 0.53, 0.99, 0.02], 0.86, 0.026, accent, 'x', 24);
            box([side * 0.44, 0.62, 0.36], [0.14, 0.22, 0.64], shade);
          }
          for (const z of [-0.74, 0.78]) box([0, 0.56, z], [0.9, 0.11, 0.14], metal);
          hull([0, 0.61, -0.56], [0.6, 0.24, 0.53], primary, 0.74);
          box([0, 0.61, 0.73], [0.58, 0.25, 0.4], primary);
        });
        break;
      }
      landmark('motorbike-tank-and-fork', () => {
        box([0, 0.37, 0.0], [0.49, 0.18, 2.17], dark);
        sphere([0, 0.67, -0.55], [0.36, 0.29, 0.5], primary);
        hull([0, 0.66, 0.82], [0.52, 0.27, 0.79], primary, 0.73);
        for (const z of [-1.05, 1.05]) cylinder([0, 0.43, z], 0.42, 0.23, rubber, 'x', 12);
        for (const side of SIDES) {
          strut([side * 0.2, 1.03, -0.63], [side * 0.2, 0.43, -1.05], 0.06, metal);
          cylinder([side * 0.25, 0.41, 0.7], 0.07, 0.93, metal, 'z', 8);
        }
        cylinder([0, 0.96, -0.79], 0.14, 0.13, detail, 'z', 10);
        box([0, 1.05, -0.59], [0.78, 0.06, 0.06], metal);
      });
      if (identity.variant === 'sidecar') landmark('motorcycle-sidecar', () => {
        strut([0.3, 0.36, -0.39], [1.0, 0.36, -0.39], 0.08, metal);
        strut([0.3, 0.36, 0.58], [1.0, 0.36, 0.58], 0.08, metal);
        hull([0.98, 0.54, -0.34], [0.65, 0.4, 1.15], primary, 0.5);
        box([0.98, 0.55, 0.43], [0.64, 0.4, 0.45], primary);
        box([0.98, 0.63, 0.06], [0.42, 0.14, 0.45], dark);
        cylinder([1.35, 0.3, 0.35], 0.28, 0.15, rubber, 'x', 12);
        cylinder([1.44, 0.3, 0.35], 0.18, 0.025, metal, 'x', 10);
      });
      break;
    case 'sports-car':
    case 'muscle-car':
    case 'sedan':
    case 'police-car':
      wheelX = 0.85; wheelZ = 1.01;
      landmark(`${model}-road-car-body`, () => {
        car({ width: 1.64, long: model === 'muscle-car', hood: model === 'sports-car' ? 0.46 : 0.59 });
        if (model === 'sports-car') {
          for (const side of SIDES) box([side * 0.53, 0.83, 1.0], [0.07, 0.42, 0.08], dark);
          box([0, 1.06, 1.07], [1.76, 0.09, 0.33], primary);
          box([0, 0.65, -1.0], [0.18, 0.025, 0.67], accent);
        } else if (model === 'muscle-car') {
          box([0, 0.83, -0.98], [0.52, 0.18, 0.47], shade);
          for (const side of SIDES) box([side * 0.2, 0.78, -0.96], [0.13, 0.025, 0.86], accent);
        } else if (model === 'police-car') {
          box([0, 0.95, 0.89], [1.02, 0.12, 0.22], dark);
          for (const side of SIDES) box([side * 0.32, 1.05, 0.89], [0.39, 0.15, 0.22], side < 0 ? red : blue);
          for (const side of SIDES) box([side * 0.81, 0.69, 0.01], [0.025, 0.2, 0.72], white);
        } else {
          grill(0, 0.53, -1.48, 0.68, 0.2);
          box([0, 0.7, 1.02], [0.66, 0.045, 0.3], accent);
        }
      });
      break;
    case 'van':
    case 'bus':
    case 'truck':
      wheelX = 0.88; wheelZ = 1.06; radius = 0.34;
      landmark(`${model}-utility-body`, () => {
        box([0, 0.39, 0], [1.68, 0.23, 2.73], shade);
        box([0, 0.7, -1.0], [1.65, model === 'truck' ? 0.65 : 0.7, 0.62], primary);
        box([0, 1.04, -0.94], [1.32, 0.19, 0.04], glass);
        sideSills(0.76, 0.81, 2.5);
        if (model === 'truck') {
          box([0, 0.68, 1.06], [1.67, 0.53, 0.17], primary);
          for (const side of SIDES) box([side * 0.76, 0.69, 0.7], [0.17, 0.55, 0.86], primary);
          box([0, 0.49, 0.72], [1.36, 0.1, 0.78], wood);
        } else {
          box([0, 0.87, 1.0], [1.66, 0.91, 0.61], primary);
          for (const side of SIDES) {
            box([side * 0.82, 0.87, 0.57], [0.12, 0.92, 0.39], primary);
            box([side * 0.889, 1.07, 0.77], [0.025, 0.29, 0.73], glass);
          }
          box([0, 1.34, 0.92], [1.71, 0.09, 0.72], primary);
          if (model === 'bus') {
            for (const side of SIDES) box([side * 0.84, 0.76, 0.03], [0.03, 0.1, 2.6], dark);
            for (const side of SIDES) cylinder([side * 0.62, 1.13, -1.33], 0.06, 0.035, red, 'z', 8);
          }
        }
        grill(0, 0.63, -1.33); lamps(-1.34, 0.82, 0.58);
      });
      break;
    case 'train':
      wheelX = 0.72; wheelZ = 0.96; radius = 0.37;
      landmark('locomotive-boiler-and-cowcatcher', () => {
        box([0, 0.4, 0.0], [1.42, 0.2, 2.56], shade);
        cylinder([0, 0.73, -0.82], 0.44, 1.26, primary, 'z', 12);
        cylinder([0, 0.73, -1.48], 0.35, 0.06, metal, 'z', 12);
        cylinder([0, 1.24, -1.03], 0.17, 0.49, dark, 'y', 10, 0.24);
        for (const side of SIDES) {
          box([side * 0.64, 0.85, 0.9], [0.12, 0.95, 0.61], primary);
          strut([side * 0.86, 0.32, -0.9], [side * 0.86, 0.32, 0.9], 0.07, metal);
          strut([0, 0.29, -1.67], [side * 0.67, 0.6, -1.36], 0.07, metal);
        }
        box([0, 1.36, 1.02], [1.5, 0.12, 0.6], primary);
      });
      break;
    case 'minecart':
      wheelX = 0.81; wheelZ = 0.85; radius = 0.3;
      landmark('minecart-riveted-open-bin', () => {
        box([0, 0.36, 0], [1.48, 0.15, 2.17], dark);
        for (const side of SIDES) box([side * 0.74, 0.66, 0], [0.16, 0.64, 2.17], primary);
        for (const z of [-1, 1]) box([0, 0.65, z], [1.5, 0.64, 0.17], primary);
        for (const side of SIDES) for (const z of [-0.85, 0, 0.85]) {
          box([side * 0.84, 0.65, z], [0.035, 0.55, 0.09], metal);
          cylinder([side * 0.87, 0.84, z], 0.035, 0.04, metal, 'x', 6);
        }
        box([0, 0.4, -1.26], [0.39, 0.09, 0.35], metal);
      });
      break;
    case 'ship':
      wheelX = 0.72; wheelZ = 0.94;
      landmark('ship-pointed-bow-and-raised-stern', () => {
        boat({ beam: 1.0 });
        box([0, 0.85, 0.96], [1.41, 0.26, 0.62], primary);
        for (const side of SIDES) for (const z of [-0.46, 0.03, 0.52]) cylinder([side * 0.94, 0.54, z], 0.09, 0.07, accent, 'x', 10);
      });
      break;
    case 'submarine':
      hiddenRollers = true; wheelX = 0.58; radius = 0.25;
      landmark('submarine-rounded-bow-and-stern-propeller', () => {
        sphere([0, 0.55, -0.85], [0.73, 0.47, 0.68], primary, 12);
        sideSills(0.57, 0.74, 2.3);
        sphere([0, 0.54, 0.91], [0.69, 0.43, 0.56], primary, 12);
        for (const side of SIDES) {
          ring([side * 0.72, 0.62, -0.41], 0.13, 0.035, accent, 'x', 10);
          cylinder([side * 0.74, 0.62, -0.41], 0.1, 0.04, glass, 'x', 10);
        }
        box([0.49, 1.04, 0.68], [0.34, 0.63, 0.42], primary);
        cylinder([0, 0.55, 1.5], 0.07, 0.28, metal, 'z', 8);
        for (let i = 0; i < 3; i += 1) box([Math.sin(i * TAU / 3) * 0.14, 0.55 + Math.cos(i * TAU / 3) * 0.14, 1.65], [0.12, 0.4, 0.05], accent, [0, 0, -i * TAU / 3]);
      });
      break;
    case 'biplane':
      wheelX = 0.66; wheelZ = 0.96; radius = 0.3;
      landmark(identity.variant === 'monoplane' ? 'monoplane-single-wing-and-propeller' : 'biplane-dual-wings-and-propeller', () => {
        hull([0, 0.51, -0.53], [0.84, 0.43, 1.87], primary, 0.66);
        sideSills(0.39, 0.68, 1.48);
        hull([0, 0.51, 0.83], [0.59, 0.33, 0.81], primary, 0.9);
        for (const y of identity.variant === 'monoplane' ? [0.48] : [0.42, 1.03]) {
          box([0, y, -0.77], [3.04, 0.08, 0.65], primary);
          for (const side of SIDES) box([side * 1.28, y + 0.045, -0.77], [0.15, 0.025, 0.65], accent);
        }
        if (identity.variant !== 'monoplane') for (const side of SIDES) strut([side * 1.21, 0.48, -0.76], [side * 1.21, 0.97, -0.76], 0.04, metal);
        cylinder([0, 0.55, -1.56], 0.11, 0.18, metal, 'z', 8);
        box([0, 0.55, -1.67], [1.05, 0.1, 0.04], dark, [0, 0, 0.62]);
        box([0, 0.77, 1.06], [0.07, 0.52, 0.48], primary, [-0.2, 0, 0]);
      });
      break;
    case 'dragon':
    case 'beast':
      wheelX = 0.8; wheelZ = 0.91; radius = 0.32;
      if (model === 'beast' && ['shark', 'hammerhead'].includes(identity.variant)) {
        landmark(identity.variant === 'hammerhead' ? 'hammerhead-wide-head-dorsal-fin-and-forked-tail' : 'shark-blunt-head-dorsal-fin-and-forked-tail', () => {
          box([0, 0.4, 0.05], [1.04, 0.23, 2.1], shade);
          for (const side of SIDES) sphere([side * 0.48, 0.57, 0.14], [0.25, 0.26, 0.88], primary, 10, 5);
          sphere([0, 0.59, 0.98], [0.52, 0.29, 0.45], primary, 10, 5);
          if (identity.variant === 'hammerhead') {
            box([0, 0.68, -0.99], [1.39, 0.29, 0.45], primary);
            for (const side of SIDES) {
              sphere([side * 0.75, 0.68, -1.0], [0.27, 0.23, 0.34], primary, 10, 5);
              sphere([side * 0.91, 0.74, -1.16], [0.055, 0.055, 0.055], dark, 8, 4);
            }
          } else {
            sphere([0, 0.66, -0.96], [0.63, 0.36, 0.63], primary, 12, 5);
            for (const side of SIDES) sphere([side * 0.48, 0.81, -1.21], [0.07, 0.065, 0.06], dark, 8, 4);
          }
          box([0, 0.49, -1.39], [0.66, 0.11, 0.11], dark);
          for (let i = -2; i <= 2; i += 1) box([i * 0.11, 0.52, -1.455], [0.07, 0.07, 0.025], bone, [0, 0, i % 2 ? 0.16 : -0.16]);
          for (const side of SIDES) {
            slab([[side * 0.46, -0.52], [side * 1.13, 0.25], [side * 0.59, 0.53]], 0.44, 0.51, primary);
            for (let i = 0; i < 3; i += 1) box([side * 0.62, 0.66, -0.71 + i * 0.13], [0.025, 0.22, 0.035], shade, [0.2, 0, 0]);
          }
          // Raised dorsal fin stays beside the pilot, leaving the middle open.
          const a = [0.58, 0.71, 0.52], b = [0.58, 1.4, 0.86], c = [0.58, 0.74, 1.2];
          const aa = [0.68, 0.71, 0.52], bb = [0.68, 1.4, 0.86], cc = [0.68, 0.74, 1.2];
          triangle(a, b, c, primary); triangle(cc, bb, aa, primary);
          quad(a, aa, bb, b, primary); quad(b, bb, cc, c, primary); quad(c, cc, aa, a, primary);
          box([0, 0.95, 1.39], [0.08, 0.63, 0.25], primary, [-0.55, 0, 0]);
          box([0, 0.53, 1.4], [0.08, 0.45, 0.23], primary, [0.52, 0, 0]);
        });
        break;
      }
      if (model === 'beast' && identity.variant === 'elephant') {
        landmark('elephant-broad-ears-curled-trunk-and-tusks', () => {
          box([0, 0.4, 0.0], [1.14, 0.22, 2.06], shade);
          for (const side of SIDES) {
            sphere([side * 0.52, 0.58, 0.1], [0.31, 0.3, 0.92], primary, 10, 5);
            sphere([side * 0.66, 0.81, -0.81], [0.33, 0.39, 0.17], primary, 10, 5);
            strut([side * 0.3, 0.57, -1.15], [side * 0.38, 0.59, -1.47], 0.09, bone);
            strut([side * 0.38, 0.59, -1.47], [side * 0.3, 0.76, -1.58], 0.055, bone);
          }
          sphere([0, 0.76, -0.91], [0.52, 0.41, 0.49], primary, 12, 6);
          for (const side of SIDES) sphere([side * 0.35, 0.89, -1.22], [0.055, 0.055, 0.045], dark, 8, 4);
          strut([0, 0.75, -1.28], [0, 0.41, -1.41], 0.22, primary);
          strut([0, 0.41, -1.41], [0, 0.39, -1.61], 0.18, primary);
          strut([0, 0.39, -1.61], [0, 0.55, -1.7], 0.12, primary);
          sphere([0, 0.61, 0.9], [0.54, 0.29, 0.43], primary, 10, 5);
        });
        break;
      }
      if (model === 'beast' && identity.variant === 'giraffe') {
        landmark('giraffe-offset-long-neck-ossicones-and-spots', () => {
          box([0, 0.44, 0.03], [1.15, 0.25, 2.09], primary);
          for (const side of SIDES) {
            sphere([side * 0.52, 0.61, 0.1], [0.27, 0.26, 0.88], primary, 10, 5);
            for (let i = 0; i < 5; i += 1) box([side * 0.78, 0.62, -0.67 + i * 0.34], [0.025, 0.16 + (i % 2) * 0.06, 0.19], wood, [0.16, 0, 0]);
          }
          strut([-0.58, 0.6, -0.7], [-0.62, 1.61, -0.92], 0.23, primary);
          sphere([-0.62, 1.72, -1.07], [0.22, 0.19, 0.34], primary, 10, 5);
          sphere([-0.62, 1.67, -1.32], [0.19, 0.12, 0.17], light, 10, 4);
          for (const side of SIDES) {
            sphere([-0.62 + side * 0.18, 1.77, -1.15], [0.035, 0.04, 0.035], dark, 6, 3);
            box([-0.62 + side * 0.28, 1.79, -0.9], [0.24, 0.07, 0.13], primary, [0, side * 0.4, side * -0.16]);
            cylinder([-0.62 + side * 0.09, 1.91, -0.94], 0.035, 0.12, wood, 'y', 6);
            sphere([-0.62 + side * 0.09, 1.98, -0.94], [0.04, 0.018, 0.04], wood, 6, 3);
          }
          for (let i = 0; i < 4; i += 1) box([-0.743, 0.85 + i * 0.2, -0.75 - i * 0.04], [0.025, 0.1, 0.12], wood);
          strut([0.47, 0.64, 1.01], [0.56, 0.37, 1.4], 0.045, primary);
          sphere([0.56, 0.34, 1.41], [0.075, 0.12, 0.075], wood, 7, 4);
        });
        break;
      }
      landmark(`${model}-sculpted-prow-and-haunches`, () => {
        boat({ beam: 0.8, color: primary });
        sphere([0, 0.67, -1.02], [0.6, 0.36, 0.59], primary);
        hull([0, 0.55, -1.41], [0.59, 0.25, 0.49], shade, 0.74);
        for (const side of SIDES) {
          sphere([side * 0.68, 0.53, 0.83], [0.34, 0.36, 0.46], primary);
          sphere([side * 0.46, 0.88, -1.09], [0.11, 0.07, 0.1], detail, 8, 4);
          pin(side * 0.4, 1.0, -0.84, accent, model === 'dragon' ? 0.38 : 0.2, 0.11);
        }
        if (model === 'dragon') {
          for (const side of SIDES) slab([[side * 0.6, 0.38], [side * 1.5, -0.08], [side * 1.35, 0.86], [side * 0.69, 0.99]], 0.66, 0.73, accent);
          for (let i = 0; i < 3; i += 1) pin(0, 0.84 + i * 0.06, 0.75 + i * 0.21, accent, 0.22);
        } else {
          for (const side of SIDES) box([side * 0.53, 0.97, -0.71], [0.23, 0.32, 0.11], primary, [0, 0, side * -0.4]);
        }
      });
      break;
    case 'carriage':
    case 'wagon':
      wheelX = 0.85; wheelZ = 0.94; radius = model === 'carriage' ? 0.38 : 0.34;
      landmark(`${model}-timber-coach`, () => {
        box([0, 0.41, 0], [1.53, 0.2, 2.46], wood);
        for (const side of SIDES) {
          box([side * 0.69, 0.67, 0], [0.15, 0.38, 2.22], primary);
          for (const z of [-0.87, 0.0, 0.9]) box([side * 0.71, 0.71, z], [0.12, 0.69, 0.12], accent);
        }
        box([0, 0.7, -1.03], [1.4, 0.4, 0.16], primary);
        box([0, 0.79, 1.01], [1.4, 0.62, 0.16], primary);
        if (model === 'carriage') {
          for (const side of SIDES) {
            box([side * 0.65, 1.16, 0.87], [0.1, 0.75, 0.1], accent);
            box([side * 0.6, 0.93, -0.91], [0.19, 0.25, 0.19], detail);
          }
          hull([0, 1.55, 0.94], [1.53, 0.17, 0.64], primary, 0.86);
        } else {
          for (let i = -2; i <= 2; i += 1) box([i * 0.25, 0.53, 0.75], [0.21, 0.07, 0.46], wood);
        }
      });
      break;
    case 'cauldron':
      wheelX = 0.78; wheelZ = 0.79; radius = 0.3;
      landmark('cauldron-open-pot-and-handles', () => {
        cylinder([0, 0.43, 0], 0.71, 0.42, primary, 'y', 14, 0.98);
        ring([0, 0.67, 0], 0.9, 0.12, primary, 'y', 16);
        ring([0, 0.7, 0], 0.81, 0.035, accent, 'y', 16);
        for (const side of SIDES) ring([side * 1.0, 0.62, 0], 0.2, 0.055, metal, 'z', 10);
        for (const side of SIDES) sphere([side * 0.57, 0.76, 0.53], [0.11, 0.11, 0.11], detail, 8, 4);
      });
      break;
    case 'pumpkin':
      wheelX = 0.83; wheelZ = 0.86; radius = 0.3;
      landmark('pumpkin-lobed-carriage', () => {
        for (let i = 0; i < 10; i += 1) {
          const a = TAU * i / 10;
          sphere([Math.cos(a) * 0.68, 0.57, Math.sin(a) * 0.82], [0.34, 0.44, 0.4], i % 2 ? primary : shade, 8, 4);
        }
        ring([0, 0.77, 0], 0.6, 0.055, accent, 'y', 12);
        strut([0.5, 0.89, 0.81], [0.58, 1.2, 0.82], 0.14, green);
        box([0, 0.72, -1.16], [0.2, 0.13, 0.035], detail);
      });
      break;
    case 'mushroom':
      wheelX = 0.71; wheelZ = 0.83; radius = 0.29;
      landmark('mushroom-cap-fenders', () => {
        cylinder([0, 0.39, 0], 0.71, 0.3, bone, 'y', 12);
        ring([0, 0.64, 0], 0.75, 0.17, primary, 'y', 16);
        for (const side of SIDES) {
          sphere([side * 0.65, 0.57, 0.64], [0.53, 0.19, 0.57], primary, 12, 4);
          sphere([side * 0.56, 0.74, 0.65], [0.13, 0.035, 0.17], white, 8, 4);
          sphere([side * 0.85, 0.69, 0.84], [0.1, 0.035, 0.12], white, 8, 4);
        }
        hull([0, 0.5, -0.9], [1.23, 0.22, 0.73], primary, 0.63);
      });
      break;
    case 'food-cart':
      wheelX = 0.83; wheelZ = 0.89; radius = 0.3;
      landmark('food-cart-counter-and-awning', () => {
        box([0, 0.49, 0], [1.56, 0.45, 2.25], primary);
        box([0, 0.76, -0.91], [1.68, 0.09, 0.42], metal);
        for (const side of SIDES) {
          box([side * 0.69, 1.15, 0.99], [0.065, 1.0, 0.065], metal);
          box([side * 0.63, 0.8, -0.79], [0.24, 0.14, 0.31], accent);
        }
        box([0, 1.66, 0.96], [1.75, 0.1, 0.65], primary, [-0.13, 0, 0]);
        for (let i = -2; i <= 2; i += 1) box([i * 0.32, 1.71, 0.96], [0.16, 0.025, 0.65], white, [-0.13, 0, 0]);
      });
      break;
    case 'toy-car':
      wheelX = 0.88; wheelZ = 0.92; radius = 0.35;
      landmark('toy-rounded-body-and-wind-up-key', () => {
        car({ width: 1.56, hood: 0.57 });
        for (const side of SIDES) {
          sphere([side * 0.61, 0.64, -0.93], [0.3, 0.22, 0.48], primary);
          ring([side * 0.24, 1.16, 1.06], 0.22, 0.055, accent, 'z', 10);
        }
        box([0, 0.93, 1.06], [0.075, 0.34, 0.075], metal);
        box([0, 0.68, -1.46], [0.48, 0.07, 0.035], accent);
      });
      break;
    case 'mech':
      wheelX = 0.96; wheelZ = 0.94; radius = 0.35;
      if (identity.variant === 'tachikoma') {
        wheelX = 1.15; wheelZ = 0.98; radius = 0.28;
        landmark('tachikoma-rounded-pod-and-four-articulated-legs', () => {
          box([0, 0.41, 0.05], [0.99, 0.24, 1.69], shade);
          sphere([0, 0.77, -0.67], [0.58, 0.38, 0.52], primary, 14, 6);
          sphere([0, 0.78, 0.87], [0.65, 0.47, 0.52], primary, 14, 6);
          for (const side of SIDES) {
            sphere([side * 0.47, 0.66, 0.1], [0.22, 0.29, 0.66], primary, 10, 5);
            for (const front of SIDES) {
              sphere([side * 0.67, 0.69, front * 0.51], [0.2, 0.19, 0.21], primary, 8, 4);
              strut([side * 0.66, 0.7, front * 0.51], [side * 1.12, 0.82, front * 0.72], 0.16, primary);
              sphere([side * 1.12, 0.82, front * 0.72], [0.14, 0.14, 0.14], metal, 8, 4);
              strut([side * 1.12, 0.82, front * 0.72], [side * 1.15, 0.32, front * 0.98], 0.14, primary);
            }
            strut([side * 0.48, 0.6, -0.75], [side * 0.69, 0.46, -1.26], 0.095, metal);
            for (const finger of SIDES) strut([side * 0.69, 0.46, -1.26], [side * 0.69 + finger * 0.1, 0.46, -1.45], 0.055, dark);
            sphere([side * 0.46, 0.94, -0.69], [0.12, 0.12, 0.12], white, 10, 5);
          }
          cylinder([0, 0.75, 1.42], 0.19, 0.08, dark, 'z', 10);
        });
        break;
      }
      landmark('mech-articulated-limbs-and-open-harness', () => {
        box([0, 0.49, 0], [0.99, 0.29, 1.94], shade);
        for (const side of SIDES) {
          box([side * 0.71, 0.83, 0.29], [0.38, 0.64, 0.63], primary);
          cylinder([side * 0.87, 0.83, 0.29], 0.2, 0.2, metal, 'x', 10);
          strut([side * 0.78, 0.71, 0.28], [side * 0.94, 0.49, -0.75], 0.19, primary);
          box([side * 0.89, 0.44, -1.11], [0.48, 0.2, 0.64], primary);
          box([side * 0.56, 1.08, 0.71], [0.12, 0.62, 0.12], metal);
        }
        box([0, 1.38, 0.71], [1.2, 0.09, 0.1], primary);
        hull([0, 0.6, -0.83], [0.83, 0.26, 0.77], primary, 0.68);
      });
      break;
    case 'clockwork':
      wheelX = 0.81; wheelZ = 0.91; radius = 0.33;
      landmark('clockwork-brass-escapement', () => {
        box([0, 0.4, 0], [1.44, 0.23, 2.4], wood);
        sideSills(0.65, 0.67, 2.2);
        for (const side of SIDES) {
          cylinder([side * 0.74, 0.75, 0.74], 0.3, 0.1, accent, 'x', 12);
          for (let i = 0; i < 8; i += 1) {
            const a = TAU * i / 8;
            box([side * 0.74, 0.75 + Math.cos(a) * 0.29, 0.74 + Math.sin(a) * 0.29], [0.14, 0.13, 0.13], accent, [a, 0, 0]);
          }
        }
        cylinder([0, 0.69, -0.94], 0.38, 0.15, accent, 'y', 12);
        box([0, 0.78, -0.94], [0.46, 0.03, 0.035], dark, [0, 0.45, 0]);
        box([0, 0.78, -1.03], [0.035, 0.03, 0.23], dark);
      });
      break;
    case 'reliquary':
      wheelX = 0.8; wheelZ = 0.96; radius = 0.32;
      landmark('reliquary-arched-stone-chest', () => {
        box([0, 0.41, 0], [1.54, 0.26, 2.52], shade);
        for (const side of SIDES) {
          box([side * 0.68, 0.69, 0], [0.21, 0.44, 2.33], primary);
          for (const z of [-0.95, 0.95]) {
            box([side * 0.63, 1.0, z], [0.18, 0.63, 0.18], accent);
            pin(side * 0.63, 1.4, z, primary, 0.23, 0.16);
          }
        }
        hull([0, 0.71, -0.92], [1.21, 0.27, 0.52], primary, 0.64);
        box([0, 0.93, 1.0], [1.16, 0.62, 0.19], primary);
        box([0, 1.18, 1.12], [0.43, 0.06, 0.05], accent);
        box([0, 1.18, 1.12], [0.06, 0.43, 0.05], accent);
      });
      break;
    case 'stage':
      wheelX = 0.9; wheelZ = 0.93; radius = 0.31;
      landmark('stage-platform-and-pa-towers', () => {
        box([0, 0.4, 0], [1.82, 0.25, 2.5], dark);
        box([0, 0.55, 0], [1.68, 0.06, 2.38], primary);
        for (const side of SIDES) {
          box([side * 0.69, 0.92, 0.91], [0.39, 0.72, 0.35], dark);
          for (const y of [0.73, 1.1]) cylinder([side * 0.69, y, 1.1], 0.13, 0.035, metal, 'z', 10);
          box([side * 0.84, 0.59, -0.1], [0.055, 0.055, 2.09], accent);
        }
        box([0, 0.65, -0.97], [0.87, 0.13, 0.4], dark);
        for (let i = -2; i <= 2; i += 1) box([i * 0.15, 0.73, -0.98], [0.075, 0.035, 0.22], detail);
      });
      break;
    case 'camera-rig':
      wheelX = 0.85; wheelZ = 0.85; radius = 0.3;
      landmark('camera-dolly-and-lens', () => {
        box([0, 0.38, 0], [1.64, 0.2, 2.28], metal);
        sideSills(0.74, 0.61, 2.2);
        for (const side of SIDES) strut([side * 0.7, 0.48, -0.92], [side * 0.48, 1.04, -0.94], 0.08, metal);
        box([0, 0.91, -0.96], [0.67, 0.43, 0.59], primary);
        cylinder([0, 0.91, -1.36], 0.23, 0.3, dark, 'z', 12);
        cylinder([0, 0.91, -1.53], 0.17, 0.035, glass, 'z', 12);
        for (const side of SIDES) cylinder([side * 0.23, 1.23, -0.94], 0.23, 0.17, dark, 'z', 12);
      });
      break;
    case 'lab-pod':
      wheelX = 0.76; wheelZ = 0.96;
      landmark('lab-pod-segmented-shell', () => {
        hull([0, 0.48, -0.76], [1.4, 0.35, 1.42], primary, 0.64);
        sideSills(0.63, 0.71, 2.15);
        box([0, 0.57, 0.95], [1.31, 0.48, 0.62], primary);
        for (const side of SIDES) {
          cylinder([side * 0.8, 0.58, 0.63], 0.19, 1.07, metal, 'z', 10);
          cylinder([side * 0.8, 0.58, 1.19], 0.13, 0.035, detail, 'z', 8);
          box([side * 0.59, 0.71, -0.8], [0.1, 0.045, 0.66], accent);
        }
        box([0, 0.7, -0.93], [0.48, 0.055, 0.42], dark);
        box([0, 0.735, -0.95], [0.35, 0.025, 0.25], detail);
      });
      break;
    case 'book':
      wheelX = 0.82; wheelZ = 0.9; radius = 0.28;
      landmark('book-open-pages-and-spine', () => {
        box([0, 0.36, 0], [1.9, 0.15, 2.48], primary);
        for (const side of SIDES) {
          box([side * 0.47, 0.51, 0], [0.91, 0.24, 2.3], bone, [0, 0, side * 0.1]);
          box([side * 0.87, 0.67, 0], [0.12, 0.035, 2.16], accent);
          for (let i = 0; i < 4; i += 1) box([side * 0.49, 0.66, -1.0 + i * 0.12], [0.54, 0.02, 0.025], shade, [0, 0, side * 0.1]);
        }
        box([0, 0.41, 0], [0.15, 0.22, 2.55], shade);
        box([0.59, 0.35, 1.32], [0.18, 0.055, 0.38], accent);
      });
      break;
    case 'crystal':
      wheelX = 0.75; wheelZ = 0.87; radius = 0.29;
      landmark('crystal-faceted-platform', () => {
        slab([[-0.69, -1.27], [0.69, -1.27], [1.01, -0.41], [0.93, 0.99], [0, 1.36], [-0.93, 0.99], [-1.01, -0.41]], 0.26, 0.51, primary);
        for (const side of SIDES) {
          cylinder([side * 0.73, 0.73, 0.73], 0.29, 0.7, accent, 'y', 5, 0.025);
          cylinder([side * 0.64, 0.55, -0.86], 0.23, 0.43, light, 'y', 5, 0.025);
        }
      });
      break;
    case 'nature':
      wheelX = 0.79; wheelZ = 0.87; radius = 0.31;
      landmark('nature-root-cradle-and-leaf-bow', () => {
        boat({ beam: 0.85, color: wood });
        for (const side of SIDES) {
          strut([side * 0.73, 0.38, -1.05], [side * 0.79, 0.72, 0.77], 0.16, primary);
          slab([[side * 0.25, -0.95], [side * 0.91, -1.39], [side * 0.99, -0.56], [side * 0.4, -0.47]], 0.7, 0.76, green);
          sphere([side * 0.68, 0.73, 0.78], [0.32, 0.24, 0.36], primary, 8, 4);
        }
      });
      break;
    case 'suture':
      wheelX = 0.81; wheelZ = 0.94; radius = 0.3;
      landmark('suture-split-frame-and-anchor-relay', () => {
        hull([0, 0.49, -0.8], [1.53, 0.34, 1.34], primary, 0.44);
        sideSills(0.68, 0.7, 2.3);
        box([0, 0.59, 0.92], [1.42, 0.35, 0.7], shade);
        for (const side of SIDES) {
          box([side * 0.57, 0.77, -0.58], [0.07, 0.045, 1.22], detail);
          box([side * 0.59, 0.97, 0.9], [0.3, 0.48, 0.12], accent);
          box([side * 0.59, 1.0, 0.98], [0.22, 0.35, 0.035], detail);
        }
        for (let i = 0; i < 5; i += 1) box([0, 0.68, -0.69 - i * 0.14], [0.16, 0.025, 0.045], accent, [0, 0.7, 0]);
      });
      break;
  }

  // The pilot opening is intentionally shared at the stable sprite anchor.
  // A low seat back avoids hiding the bust in the rear camera and 2D rear view.
  part('driver-cockpit', () => {
    box([0, 0.64, 0.18], [0.6, 0.14, 0.61], dark);
    box([0, 0.81, 0.48], [0.59, 0.37, 0.11], dark, [-0.12, 0, 0]);
    box([0, 0.83, 0.41], [0.45, 0.26, 0.04], shade, [-0.12, 0, 0]);
    if (model !== 'motorbike' || !['wheelchair', 'segway', 'bicycle'].includes(identity.variant)) {
      strut([0, 0.47, -0.66], [0, 0.91, -0.4], 0.045, metal);
      ring([0, 0.91, -0.4], 0.16, 0.025, dark, 'z', 10);
      box([0, 0.91, -0.4], [0.25, 0.025, 0.025], metal);
    }
  });

  const drawMotif = motif => {
    switch (motif) {
      case 'armor':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) box([side * 0.78, 0.72, -0.52 + i * 0.5], [0.18, 0.23, 0.4], shade, [0, 0, side * -0.17]);
        break;
      case 'antenna':
        strut([0.71, 0.7, 0.93], [0.71, 1.65, 1.0], 0.035, metal);
        sphere([0.71, 1.65, 1.0], [0.065, 0.065, 0.065], detail, 6, 3);
        break;
      case 'radar':
        box([0.67, 1.04, 0.87], [0.07, 0.58, 0.07], metal);
        cylinder([0.67, 1.4, 0.87], 0.25, 0.08, shade, 'z', 12, 0.18);
        strut([0.67, 1.4, 0.88], [0.67, 1.4, 1.1], 0.035, accent);
        break;
      case 'thrusters': rearJets(0.67, 0.69, 1.31, 0.16); break;
      case 'plasma':
        for (const side of SIDES) {
          cylinder([side * 0.86, 0.62, -0.77], 0.13, 0.85, shade, 'z', 10);
          cylinder([side * 0.86, 0.62, -1.21], 0.09, 0.035, detail, 'z', 8);
          ring([side * 0.86, 0.62, -0.69], 0.14, 0.025, detail, 'z', 10);
        }
        break;
      case 'wings': wingPair(0.55, 1.46, accent, 0.71); break;
      case 'solar-panels':
        for (const side of SIDES) {
          box([side * 1.0, 0.94, 0.61], [0.055, 0.69, 0.91], dark, [0, 0, side * -0.18]);
          for (let i = -1; i <= 1; i += 1) box([side * 1.05, 0.94, 0.61 + i * 0.27], [0.02, 0.59, 0.02], metal, [0, 0, side * -0.18]);
        }
        break;
      case 's-foils':
        for (const side of SIDES) for (const high of SIDES) box([side * 0.99, 0.73 + high * 0.2, 0.74], [0.9, 0.055, 0.32], accent, [0, 0, side * high * 0.37]);
        break;
      case 'engine-pods':
        for (const side of SIDES) {
          cylinder([side * 0.95, 0.68, 0.6], 0.2, 1.05, primary, 'z', 10);
          cylinder([side * 0.95, 0.68, 1.15], 0.14, 0.035, accent, 'z', 10);
        }
        break;
      case 'flux-coils':
        for (const side of SIDES) {
          strut([side * 0.8, 0.61, -1.06], [side * 0.8, 0.72, 0.94], 0.04, blue);
          for (let i = 0; i < 4; i += 1) box([side * 0.81, 0.67, -0.86 + i * 0.51], [0.12, 0.15, 0.085], metal);
        }
        box([0.64, 1.04, 0.95], [0.38, 0.43, 0.08], dark);
        for (const end of [[0.5, 1.18], [0.78, 1.18], [0.64, 0.87]]) strut([0.64, 1.03, 1.0], [end[0], end[1], 1.0], 0.035, detail);
        break;
      case 'ghost-trap':
        box([-0.62, 0.89, 0.91], [0.35, 0.29, 0.54], dark);
        for (let i = 0; i < 4; i += 1) box([-0.62, 1.05, 0.73 + i * 0.11], [0.32, 0.035, 0.045], amber);
        ring([-0.62, 1.14, 0.91], 0.12, 0.025, metal, 'z', 8);
        break;
      case 'bat-fins':
        for (const side of SIDES) {
          box([side * 0.76, 1.05, 0.91], [0.06, 0.7, 0.62], primary, [-0.3, 0, side * -0.2]);
          pin(side * 0.84, 1.42, 0.95, primary, 0.26, 0.08);
        }
        break;
      case 'blower':
        box([0, 0.89, -0.94], [0.4, 0.29, 0.44], metal);
        box([0, 1.06, -1.0], [0.54, 0.1, 0.35], dark);
        for (const side of SIDES) cylinder([side * 0.14, 1.05, -1.19], 0.075, 0.035, dark, 'z', 8);
        break;
      case 'exhaust':
        for (const side of SIDES) {
          cylinder([side * 0.82, 0.94, 0.98], 0.075, 0.72, metal, 'y', 8);
          cylinder([side * 0.82, 1.31, 0.98], 0.09, 0.045, dark, 'y', 8);
        }
        break;
      case 'tracks':
        for (const side of SIDES) {
          box([side * 0.96, 0.33, 0], [0.28, 0.38, 2.4], rubber);
          for (let i = 0; i < 9; i += 1) box([side * 0.96, 0.54, -1.06 + i * 0.265], [0.31, 0.045, 0.12], metal);
        }
        break;
      case 'rollbar':
        for (const side of SIDES) strut([side * 0.62, 0.65, 0.67], [side * 0.57, 1.39, 0.67], 0.065, dark);
        box([0, 1.4, 0.67], [1.2, 0.065, 0.065], dark);
        break;
      case 'tools':
        strut([-0.83, 0.75, -0.37], [-0.83, 0.75, 0.7], 0.065, wood);
        box([-0.83, 0.75, 0.8], [0.2, 0.1, 0.3], metal);
        strut([0.83, 0.75, -0.36], [0.83, 0.75, 0.7], 0.055, metal);
        ring([0.83, 0.75, 0.75], 0.11, 0.035, metal, 'y', 8);
        break;
      case 'tanks':
        for (const side of SIDES) {
          cylinder([side * 0.69, 0.94, 0.94], 0.16, 0.56, primary, 'y', 10);
          box([side * 0.69, 1.26, 0.94], [0.1, 0.08, 0.1], metal);
          ring([side * 0.69, 0.91, 0.94], 0.17, 0.025, accent, 'y', 10);
        }
        break;
      case 'pipes':
        for (const side of SIDES) {
          strut([side * 0.85, 0.7, -0.79], [side * 0.85, 0.7, 0.91], 0.09, metal);
          strut([side * 0.85, 0.7, 0.91], [side * 0.65, 1.07, 0.91], 0.09, metal);
          ring([side * 0.85, 0.7, -0.7], 0.095, 0.025, dark, 'z', 8);
        }
        break;
      case 'hazard-stripes':
        for (const side of SIDES) for (let i = 0; i < 5; i += 1) box([side * 0.79, 0.77, -0.81 + i * 0.32], [0.23, 0.035, 0.13], i % 2 ? dark : amber, [0, 0.43, 0]);
        break;
      case 'scanner':
        box([0, 0.79, -0.97], [0.47, 0.16, 0.36], dark, [-0.17, 0, 0]);
        box([0, 0.88, -0.97], [0.35, 0.025, 0.26], green, [-0.17, 0, 0]);
        ring([0, 0.9, -0.97], 0.08, 0.012, detail, 'y', 10);
        break;
      case 'portal-rings':
        for (const side of SIDES) {
          ring([side * 0.88, 0.83, 0.39], 0.28, 0.055, side < 0 ? blue : amber, 'x', 14);
          box([side * 0.86, 0.83, 0.39], [0.04, 0.37, 0.37], dark);
        }
        break;
      case 'gate-ring':
        ring([0.65, 1.13, 0.96], 0.34, 0.06, metal, 'z', 18);
        for (let i = 0; i < 7; i += 1) {
          const a = TAU * i / 7;
          box([0.65 + Math.sin(a) * 0.34, 1.13 + Math.cos(a) * 0.34, 1.04], [0.095, 0.09, 0.035], amber, [0, 0, -a]);
        }
        break;
      case 'lambda':
        ring([0, 0.77, -0.98], 0.25, 0.025, amber, 'y', 12);
        strut([-0.12, 0.8, -0.83], [0.04, 0.8, -1.14], 0.04, amber);
        strut([0.04, 0.8, -1.14], [0.15, 0.8, -0.82], 0.04, amber);
        break;
      case 'crowbar':
        strut([-0.85, 0.8, -0.69], [-0.85, 0.8, 0.83], 0.055, red);
        strut([-0.85, 0.8, 0.83], [-0.69, 0.88, 0.91], 0.055, metal);
        strut([-0.69, 0.88, 0.91], [-0.62, 0.82, 0.91], 0.045, metal);
        break;
      case 'umbrella':
        for (let i = 0; i < 8; i += 1) {
          const a = TAU * i / 8, b = TAU * (i + 1) / 8;
          triangle([0, 0.84, -0.97], [Math.cos(a) * 0.3, 0.79, -0.97 + Math.sin(a) * 0.3],
            [Math.cos(b) * 0.3, 0.79, -0.97 + Math.sin(b) * 0.3], i % 2 ? white : red);
          triangle([0, 0.84, -0.97], [Math.cos(b) * 0.3, 0.79, -0.97 + Math.sin(b) * 0.3],
            [Math.cos(a) * 0.3, 0.79, -0.97 + Math.sin(a) * 0.3], i % 2 ? white : red);
        }
        break;
      case 'dna':
        for (let i = 0; i < 7; i += 1) {
          const a = i * 0.9, b = (i + 1) * 0.9, y = 0.76 + i * 0.1;
          for (const side of SIDES) strut([0.69 + side * Math.cos(a) * 0.14, y, 0.92 + side * Math.sin(a) * 0.14], [0.69 + side * Math.cos(b) * 0.14, y + 0.1, 0.92 + side * Math.sin(b) * 0.14], 0.03, side < 0 ? accent : detail);
          strut([0.69 + Math.cos(a) * 0.14, y, 0.92 + Math.sin(a) * 0.14], [0.69 - Math.cos(a) * 0.14, y, 0.92 - Math.sin(a) * 0.14], 0.025, white);
        }
        break;
      case 'tentacles':
        for (const side of SIDES) {
          strut([side * 0.67, 0.66, 0.86], [side * 1.08, 0.86, 0.62], 0.13, primary);
          strut([side * 1.08, 0.86, 0.62], [side * 1.16, 0.86, 0.03], 0.1, primary);
          strut([side * 1.16, 0.86, 0.03], [side * 0.99, 1.01, -0.25], 0.06, accent);
          for (let i = 0; i < 3; i += 1) sphere([side * 1.19, 0.86, 0.45 - i * 0.15], [0.04, 0.055, 0.055], detail, 6, 3);
        }
        break;
      case 'ribs':
        for (const side of SIDES) for (let i = 0; i < 5; i += 1) {
          strut([side * 0.73, 0.57, -0.82 + i * 0.38], [side * 0.91, 0.79, -0.82 + i * 0.38], 0.07, bone);
          strut([side * 0.91, 0.79, -0.82 + i * 0.38], [side * 0.74, 0.96, -0.75 + i * 0.38], 0.06, bone);
        }
        break;
      case 'spines':
        for (const side of SIDES) for (let i = 0; i < 4; i += 1) pin(side * 0.74, 0.88 + i * 0.05, -0.67 + i * 0.53, accent, 0.35, 0.11);
        break;
      case 'claws':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) hull([side * (0.54 + i * 0.13), 0.59, -1.3], [0.08, 0.1, 0.68], metal, 0.1);
        break;
      case 'tusks':
        for (const side of SIDES) {
          strut([side * 0.64, 0.55, -1.04], [side * 0.74, 0.72, -1.35], 0.13, bone);
          strut([side * 0.74, 0.72, -1.35], [side * 0.61, 0.92, -1.44], 0.065, bone);
        }
        break;
      case 'skull':
        sphere([0, 0.85, -1.02], [0.23, 0.25, 0.17], bone, 10, 5);
        for (const side of SIDES) box([side * 0.09, 0.91, -1.17], [0.09, 0.1, 0.04], dark);
        box([0, 0.69, -1.09], [0.26, 0.13, 0.18], bone);
        for (let i = -1; i <= 1; i += 1) box([i * 0.07, 0.68, -1.19], [0.025, 0.09, 0.025], dark);
        break;
      case 'horns':
        for (const side of SIDES) {
          strut([side * 0.62, 0.72, -0.77], [side * 0.95, 0.97, -0.82], 0.12, bone);
          strut([side * 0.95, 0.97, -0.82], [side * 0.88, 1.28, -0.76], 0.075, bone);
        }
        break;
      case 'chains':
        for (const side of SIDES) for (let i = 0; i < 7; i += 1) ring([side * 0.9, 0.7 - Math.sin(i * Math.PI / 6) * 0.16, -0.68 + i * 0.23], 0.075, 0.022, metal, i % 2 ? 'y' : 'x', 8);
        break;
      case 'swords':
        for (const side of SIDES) {
          hull([side * 0.85, 0.77, -0.25], [0.12, 0.04, 1.45], metal, 0.05);
          box([side * 0.85, 0.77, 0.54], [0.34, 0.055, 0.075], accent);
          box([side * 0.85, 0.77, 0.75], [0.075, 0.07, 0.32], wood);
        }
        break;
      case 'shield':
        slab([[-0.33, -1.18], [0.33, -1.18], [0.28, -0.84], [0, -0.66], [-0.28, -0.84]], 0.77, 0.84, accent);
        box([0, 0.87, -0.99], [0.045, 0.025, 0.38], primary);
        box([0, 0.87, -1.03], [0.32, 0.025, 0.045], primary);
        break;
      case 'runes':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) {
          const z = -0.71 + i * 0.68;
          box([side * 0.72, 0.81, z], [0.035, 0.025, 0.26], accent);
          box([side * 0.77, 0.81, z - 0.04], [0.12, 0.025, 0.035], detail, [0, -0.6, 0]);
        }
        break;
      case 'scrolls':
        for (const side of SIDES) {
          cylinder([side * 0.69, 0.94, 0.92], 0.11, 0.55, bone, 'y', 10);
          for (const y of [0.65, 1.23]) cylinder([side * 0.69, y, 0.92], 0.14, 0.055, wood, 'y', 10);
          ring([side * 0.69, 0.93, 0.92], 0.12, 0.025, accent, 'y', 10);
        }
        break;
      case 'books':
        for (let i = 0; i < 3; i += 1) {
          box([-0.67, 0.77 + i * 0.14, 0.87], [0.39, 0.13, 0.46], i % 2 ? shade : accent, [0, i * 0.15, 0]);
          box([-0.67, 0.77 + i * 0.14, 0.88], [0.34, 0.075, 0.46], bone, [0, i * 0.15, 0]);
        }
        break;
      case 'candles':
        for (const side of SIDES) {
          cylinder([side * 0.7, 0.96, 0.86], 0.07, 0.42, bone, 'y', 8);
          pin(side * 0.7, 1.24, 0.86, amber, 0.17, 0.055);
          cylinder([side * 0.7, 0.74, 0.86], 0.14, 0.055, accent, 'y', 10);
        }
        break;
      case 'lanterns':
        for (const side of SIDES) {
          box([side * 0.72, 0.99, 0.88], [0.23, 0.31, 0.23], detail);
          for (const x of [-0.13, 0.13]) box([side * 0.72 + x, 0.99, 0.88], [0.035, 0.39, 0.28], metal);
          pin(side * 0.72, 1.23, 0.88, metal, 0.15, 0.19);
        }
        break;
      case 'crystals':
      case 'gems':
        for (const side of SIDES) {
          cylinder([side * 0.72, motif === 'gems' ? 0.85 : 1.04, 0.83], 0.18, motif === 'gems' ? 0.23 : 0.55, accent, 'y', motif === 'gems' ? 6 : 5, 0.025);
          if (motif === 'crystals') cylinder([side * 0.9, 0.87, 0.64], 0.11, 0.35, detail, 'y', 5, 0.025);
          else cylinder([side * 0.72, 0.7, 0.83], 0.025, 0.08, accent, 'y', 6, 0.18);
        }
        break;
      case 'vines':
        for (const side of SIDES) for (let i = 0; i < 6; i += 1) {
          const z = -0.89 + i * 0.34;
          strut([side * 0.81, 0.7 + Math.sin(i * 1.5) * 0.09, z], [side * 0.81, 0.7 + Math.sin((i + 1) * 1.5) * 0.09, z + 0.34], 0.045, green);
          sphere([side * 0.91, 0.73, z], [0.11, 0.035, 0.14], green, 6, 3);
        }
        break;
      case 'leaves':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) slab([[side * 0.65, -0.67 + i * 0.67], [side * 1.03, -0.88 + i * 0.67], [side * 1.15, -0.4 + i * 0.67]], 0.75, 0.8, green);
        break;
      case 'flowers':
        for (const side of SIDES) {
          strut([side * 0.7, 0.69, 0.87], [side * 0.7, 1.19, 0.87], 0.035, green);
          for (let i = 0; i < 6; i += 1) sphere([side * 0.7 + Math.cos(i * TAU / 6) * 0.17, 1.19 + Math.sin(i * TAU / 6) * 0.17, 0.87], [0.12, 0.12, 0.045], accent, 6, 3);
          sphere([side * 0.7, 1.19, 0.92], [0.09, 0.09, 0.055], amber, 8, 4);
        }
        break;
      case 'mushrooms':
        for (const side of SIDES) {
          cylinder([side * 0.73, 0.88, 0.82], 0.08, 0.34, bone, 'y', 8);
          sphere([side * 0.73, 1.07, 0.82], [0.28, 0.13, 0.28], red, 10, 4);
          sphere([side * 0.73, 1.19, 0.82], [0.09, 0.025, 0.09], white, 6, 3);
        }
        break;
      case 'wings-feather':
      case 'dragon-wings':
        for (const side of SIDES) {
          if (motif === 'dragon-wings') {
            slab([[side * 0.65, 0.85], [side * 1.48, -0.22], [side * 1.61, 0.67], [side * 1.27, 0.47], [side * 1.08, 1.01]], 0.88, 0.93, accent);
            strut([side * 0.65, 0.96, 0.85], [side * 1.48, 0.96, -0.22], 0.055, primary);
          } else for (let i = 0; i < 4; i += 1) hull([side * (0.84 + i * 0.16), 0.89, 0.54 - i * 0.16], [0.24, 0.075, 0.91 - i * 0.08], detail, 0.12);
        }
        break;
      case 'sail':
        strut([0.71, 0.71, 0.91], [0.71, 1.74, 0.91], 0.055, wood);
        triangle([0.73, 1.69, 0.91], [1.24, 0.94, 0.91], [0.73, 0.94, 0.91], bone);
        triangle([0.73, 1.69, 0.91], [0.73, 0.94, 0.91], [1.24, 0.94, 0.91], bone);
        break;
      case 'anchor':
        strut([-0.73, 0.76, 0.72], [-0.73, 1.24, 0.72], 0.065, metal);
        ring([-0.73, 1.29, 0.72], 0.09, 0.025, metal, 'z', 8);
        box([-0.73, 1.11, 0.72], [0.39, 0.055, 0.055], metal);
        for (const side of SIDES) strut([-0.73, 0.76, 0.72], [-0.73 + side * 0.22, 0.88, 0.72], 0.065, metal);
        break;
      case 'helm':
        ring([0.69, 1.08, 0.95], 0.25, 0.04, wood, 'z', 12);
        for (let i = 0; i < 6; i += 1) strut([0.69, 1.08, 0.95], [0.69 + Math.cos(i * TAU / 6) * 0.33, 1.08 + Math.sin(i * TAU / 6) * 0.33, 0.95], 0.035, accent);
        break;
      case 'treasure':
        box([-0.64, 0.88, 0.92], [0.53, 0.32, 0.41], wood);
        hull([-0.64, 1.08, 0.92], [0.56, 0.16, 0.44], accent, 0.85);
        for (const x of [-0.81, -0.47]) box([x, 0.91, 1.14], [0.05, 0.36, 0.025], accent);
        break;
      case 'steam':
        cylinder([0.7, 1.01, 0.93], 0.13, 0.55, dark, 'y', 10, 0.2);
        for (let i = 0; i < 3; i += 1) sphere([0.7 + i * 0.04, 1.36 + i * 0.1, 0.93 + i * 0.05], [0.09 + i * 0.025, 0.07, 0.08 + i * 0.025], light, 7, 3);
        break;
      case 'gears':
        for (const side of SIDES) {
          cylinder([side * 0.91, 0.91, 0.78], 0.24, 0.08, accent, 'x', 12);
          cylinder([side * 0.96, 0.91, 0.78], 0.08, 0.05, dark, 'x', 8);
          for (let i = 0; i < 8; i += 1) box([side * 0.91, 0.91 + Math.cos(i * TAU / 8) * 0.24, 0.78 + Math.sin(i * TAU / 8) * 0.24], [0.1, 0.1, 0.1], accent, [i * TAU / 8, 0, 0]);
        }
        break;
      case 'clock':
        cylinder([0.68, 1.07, 0.94], 0.28, 0.1, accent, 'z', 12);
        cylinder([0.68, 1.07, 1.0], 0.23, 0.025, bone, 'z', 12);
        strut([0.68, 1.07, 1.03], [0.68, 1.25, 1.03], 0.025, dark);
        strut([0.68, 1.07, 1.03], [0.81, 1.04, 1.03], 0.025, dark);
        break;
      case 'speakers':
        for (const side of SIDES) {
          box([side * 0.71, 1.03, 0.93], [0.36, 0.59, 0.3], dark);
          for (const y of [0.91, 1.18]) cylinder([side * 0.71, y, 1.1], y < 1 ? 0.12 : 0.075, 0.035, accent, 'z', 10);
        }
        break;
      case 'guitar':
        sphere([-0.71, 1.0, 0.94], [0.2, 0.24, 0.08], accent, 10, 4);
        sphere([-0.71, 1.2, 0.94], [0.15, 0.16, 0.075], primary, 10, 4);
        box([-0.71, 1.47, 0.94], [0.07, 0.48, 0.07], wood);
        box([-0.71, 1.73, 0.94], [0.13, 0.15, 0.08], accent);
        cylinder([-0.71, 1.11, 1.03], 0.075, 0.025, dark, 'z', 10);
        break;
      case 'drums':
        for (const side of SIDES) {
          cylinder([side * 0.69, 0.94, 0.91], 0.23, 0.32, primary, 'y', 12);
          cylinder([side * 0.69, 1.115, 0.91], 0.22, 0.035, bone, 'y', 12);
          ring([side * 0.69, 1.13, 0.91], 0.22, 0.022, metal, 'y', 12);
        }
        break;
      case 'equalizer':
        box([0, 0.78, -0.96], [0.81, 0.08, 0.41], dark);
        for (let i = -2; i <= 2; i += 1) box([i * 0.14, 0.84, -0.96], [0.07, 0.025, 0.12 + (2 - Math.abs(i)) * 0.08], accent);
        break;
      case 'vinyl':
        cylinder([-0.61, 0.83, 0.9], 0.29, 0.045, dark, 'y', 16);
        cylinder([-0.61, 0.86, 0.9], 0.1, 0.025, accent, 'y', 10);
        ring([-0.61, 0.86, 0.9], 0.22, 0.01, metal, 'y', 16);
        strut([-0.27, 0.88, 0.96], [-0.5, 0.88, 0.74], 0.025, metal);
        break;
      case 'microphone':
        strut([0.7, 0.75, 0.89], [0.7, 1.44, 0.89], 0.035, metal);
        cylinder([0.7, 1.47, 0.89], 0.075, 0.25, dark, 'z', 8);
        sphere([0.7, 1.47, 0.75], [0.095, 0.095, 0.08], metal, 8, 4);
        break;
      case 'camera':
        box([-0.68, 1.03, 0.92], [0.4, 0.31, 0.3], dark);
        cylinder([-0.68, 1.03, 0.7], 0.13, 0.19, metal, 'z', 10);
        cylinder([-0.68, 1.03, 0.59], 0.1, 0.025, glass, 'z', 10);
        break;
      case 'film':
        for (const side of SIDES) {
          cylinder([side * 0.67, 1.13, 0.95], 0.28, 0.08, metal, 'z', 12);
          for (let i = 0; i < 5; i += 1) cylinder([side * 0.67 + Math.cos(i * TAU / 5) * 0.15, 1.13 + Math.sin(i * TAU / 5) * 0.15, 1.0], 0.055, 0.025, dark, 'z', 6);
        }
        break;
      case 'television':
        box([-0.65, 1.03, 0.92], [0.48, 0.41, 0.32], wood);
        box([-0.65, 1.04, 1.1], [0.36, 0.28, 0.035], glass);
        for (const side of SIDES) strut([-0.65, 1.24, 0.92], [-0.65 + side * 0.2, 1.45, 0.92], 0.025, metal);
        break;
      case 'neon':
        for (const side of SIDES) {
          box([side * 0.83, 0.49, 0.0], [0.045, 0.055, 2.5], detail);
          ring([side * 1.03, 0.32, -0.98], 0.25, 0.035, accent, 'x', 12);
        }
        break;
      case 'circuit':
        for (const side of SIDES) {
          box([side * 0.71, 0.81, -0.42], [0.035, 0.025, 0.99], detail);
          for (let i = 0; i < 3; i += 1) {
            box([side * 0.64, 0.81, -0.73 + i * 0.3], [0.15, 0.025, 0.035], accent);
            cylinder([side * 0.56, 0.82, -0.73 + i * 0.3], 0.04, 0.025, detail, 'y', 6);
          }
        }
        break;
      case 'matrix':
        for (const side of SIDES) {
          box([side * 0.77, 0.85, 0.49], [0.1, 0.44, 0.77], dark);
          for (let r = 0; r < 4; r += 1) for (let c = 0; c < 3; c += 1) box([side * 0.831, 0.71 + r * 0.09, 0.25 + c * 0.2], [0.025, r % 2 ? 0.06 : 0.04, 0.055], green);
        }
        break;
      case 'blocks':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) box([side * 0.78, 0.74 + (i % 2) * 0.1, -0.75 + i * 0.73], [0.35, 0.35, 0.35], i % 2 ? accent : primary);
        break;
      case 'pixel':
        for (let x = -2; x <= 2; x += 1) for (let z = -2; z <= 2; z += 1) if ((Math.abs(x) + Math.abs(z)) % 2) box([x * 0.115, 0.81, -0.95 + z * 0.1], [0.1, 0.055, 0.085], accent);
        break;
      case 'ring':
        for (const side of SIDES) ring([side * 0.74, 1.12, 0.88], 0.25, 0.055, amber, 'z', 16);
        break;
      case 'star':
        slab(Array.from({ length: 10 }, (_, i) => {
          const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.14 : 0.32;
          return [Math.cos(a) * r, -0.96 + Math.sin(a) * r];
        }), 0.8, 0.87, accent);
        break;
      case 'heart':
        sphere([-0.1, 0.82, -1.03], [0.14, 0.045, 0.14], accent, 8, 4);
        sphere([0.1, 0.82, -1.03], [0.14, 0.045, 0.14], accent, 8, 4);
        slab([[-0.21, -1.02], [0.21, -1.02], [0, -0.66]], 0.8, 0.86, accent);
        break;
      case 'cards':
        for (const side of SIDES) {
          box([side * 0.7, 1.03, 0.91], [0.31, 0.45, 0.055], bone, [0, 0, side * -0.17]);
          box([side * 0.7, 1.03, 0.945], [0.14, 0.2, 0.025], accent, [0, 0, side * -0.17]);
        }
        break;
      case 'dice':
        for (const side of SIDES) {
          box([side * 0.68, 0.97, 0.9], [0.35, 0.35, 0.35], bone);
          for (let i = -1; i <= 1; i += 1) cylinder([side * 0.68 + i * 0.085, 0.97 + i * 0.085, 1.086], 0.03, 0.02, dark, 'z', 8);
        }
        break;
      case 'chess':
        for (const side of SIDES) {
          cylinder([side * 0.69, 0.84, 0.9], 0.17, 0.12, side < 0 ? bone : dark, 'y', 10);
          cylinder([side * 0.69, 1.02, 0.9], 0.1, 0.27, side < 0 ? bone : dark, 'y', 10, 0.06);
          sphere([side * 0.69, 1.24, 0.9], [0.13, 0.13, 0.13], side < 0 ? bone : dark, 8, 4);
        }
        break;
      case 'ball':
        sphere([-0.67, 1.0, 0.92], [0.27, 0.27, 0.27], detail, 12, 6);
        ring([-0.67, 1.0, 0.92], 0.27, 0.025, dark, 'y', 12);
        ring([-0.67, 1.0, 0.92], 0.27, 0.025, dark, 'z', 12);
        break;
      case 'food':
        cylinder([0.67, 0.85, 0.88], 0.28, 0.045, white, 'y', 12);
        cylinder([0.67, 0.95, 0.88], 0.23, 0.12, wood, 'y', 12);
        sphere([0.67, 1.06, 0.88], [0.25, 0.1, 0.25], amber, 10, 4);
        break;
      case 'sweets':
        for (const side of SIDES) {
          cylinder([side * 0.7, 1.0, 0.9], 0.025, 0.5, bone, 'y', 6);
          sphere([side * 0.7, 1.29, 0.9], [0.18, 0.18, 0.07], accent, 10, 5);
          ring([side * 0.7, 1.29, 0.98], 0.1, 0.025, white, 'z', 10);
        }
        break;
      case 'bottles':
        for (const side of SIDES) {
          cylinder([side * 0.7, 0.96, 0.89], 0.13, 0.35, glass, 'y', 8);
          cylinder([side * 0.7, 1.2, 0.89], 0.055, 0.15, glass, 'y', 8);
          box([side * 0.7, 0.97, 1.025], [0.17, 0.16, 0.025], bone);
        }
        break;
      case 'medical':
        box([-0.67, 0.97, 0.91], [0.44, 0.37, 0.3], white);
        box([-0.67, 0.97, 1.08], [0.25, 0.065, 0.025], red);
        box([-0.67, 0.97, 1.08], [0.065, 0.25, 0.025], red);
        break;
      case 'bow':
        for (let i = 0; i < 5; i += 1) {
          const a = -Math.PI / 2 + i * Math.PI / 5, b = a + Math.PI / 5;
          strut([-0.86 - Math.cos(a) * 0.21, 0.83, Math.sin(a) * 0.77], [-0.86 - Math.cos(b) * 0.21, 0.83, Math.sin(b) * 0.77], 0.045, wood);
        }
        strut([-0.86, 0.83, -0.77], [-0.86, 0.83, 0.77], 0.016, bone);
        break;
      case 'quiver':
        cylinder([0.73, 1.0, 0.88], 0.14, 0.44, wood, 'y', 9);
        for (let i = 0; i < 3; i += 1) {
          strut([0.66 + i * 0.07, 1.1, 0.88], [0.66 + i * 0.07, 1.53, 0.88], 0.025, bone);
          box([0.66 + i * 0.07, 1.47, 0.88], [0.06, 0.15, 0.035], accent);
        }
        break;
      case 'fishing':
        strut([0.71, 0.7, 0.75], [1.0, 1.72, 0.22], 0.03, wood);
        strut([1.0, 1.72, 0.22], [1.0, 1.16, 0.22], 0.012, bone);
        ring([0.76, 0.92, 0.64], 0.09, 0.025, metal, 'x', 8);
        break;
      case 'basket':
        box([-0.64, 0.92, 0.9], [0.49, 0.32, 0.44], wood);
        for (let i = 0; i < 4; i += 1) box([-0.82 + i * 0.12, 0.92, 1.135], [0.035, 0.29, 0.025], bone);
        ring([-0.64, 1.17, 0.9], 0.18, 0.03, wood, 'z', 10);
        break;
      case 'rocket':
        for (const side of SIDES) {
          cylinder([side * 0.82, 0.71, 0.44], 0.14, 0.86, primary, 'z', 10);
          cylinder([side * 0.82, 0.71, -0.05], 0.025, 0.12, accent, 'z', 10, 0.14);
          box([side * 0.82, 0.71, 0.77], [0.46, 0.055, 0.19], accent);
        }
        break;
      case 'moon':
        for (let i = 0; i < 6; i += 1) {
          const a = -Math.PI * 0.7 + i * Math.PI * 1.4 / 6, b = a + Math.PI * 1.4 / 6;
          strut([0.68 + Math.cos(a) * 0.25, 1.16 + Math.sin(a) * 0.25, 0.94], [0.68 + Math.cos(b) * 0.25, 1.16 + Math.sin(b) * 0.25, 0.94], 0.09, detail);
        }
        break;
      case 'sun':
        cylinder([0.68, 1.13, 0.93], 0.18, 0.06, amber, 'z', 12);
        for (let i = 0; i < 8; i += 1) strut([0.68 + Math.cos(i * TAU / 8) * 0.22, 1.13 + Math.sin(i * TAU / 8) * 0.22, 0.93], [0.68 + Math.cos(i * TAU / 8) * 0.34, 1.13 + Math.sin(i * TAU / 8) * 0.34, 0.93], 0.04, accent);
        break;
      case 'snow':
        for (let i = 0; i < 6; i += 1) {
          const a = TAU * i / 6;
          strut([0, 0.84, -0.96], [Math.cos(a) * 0.31, 0.84, -0.96 + Math.sin(a) * 0.31], 0.035, detail);
          for (const side of SIDES) strut([Math.cos(a) * 0.2, 0.84, -0.96 + Math.sin(a) * 0.2], [Math.cos(a + side * 0.28) * 0.26, 0.84, -0.96 + Math.sin(a + side * 0.28) * 0.26], 0.025, detail);
        }
        break;
      case 'fire':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) pin(side * (0.65 + i * 0.13), 0.99 + (i % 2) * 0.11, 0.91, i % 2 ? amber : red, 0.38 + (i % 2) * 0.17, 0.11);
        break;
      case 'water':
        for (const side of SIDES) for (let i = 0; i < 4; i += 1) ring([side * 0.83, 0.82, -0.72 + i * 0.5], 0.12, 0.035, blue, 'x', 10);
        break;
      case 'electric':
        for (const side of SIDES) {
          strut([side * 0.7, 1.48, 0.91], [side * 0.84, 1.15, 0.91], 0.075, accent);
          strut([side * 0.84, 1.15, 0.91], [side * 0.63, 1.15, 0.91], 0.075, accent);
          strut([side * 0.63, 1.15, 0.91], [side * 0.78, 0.82, 0.91], 0.075, accent);
        }
        break;
      case 'rainbow':
        for (const side of SIDES) for (let i = 0; i < 5; i += 1) box([side * 0.81, 0.83 + i * 0.036, 0.0], [0.07, 0.035, 1.88], [red, amber, green, blue, accent][i]);
        break;
      case 'smoke':
        for (const side of SIDES) {
          cylinder([side * 0.76, 0.9, 1.0], 0.09, 0.42, dark, 'y', 8);
          for (let i = 0; i < 3; i += 1) sphere([side * (0.76 + i * 0.04), 1.2 + i * 0.12, 1.0 + i * 0.04], [0.11 + i * 0.025, 0.09, 0.11 + i * 0.025], metal, 8, 4);
        }
        break;
      case 'eyes':
        for (const side of SIDES) {
          sphere([side * 0.48, 0.88, -1.05], [0.18, 0.16, 0.1], white, 10, 5);
          sphere([side * 0.48, 0.88, -1.14], [0.065, 0.085, 0.035], dark, 8, 4);
        }
        break;
      case 'ears':
        for (const side of SIDES) {
          box([side * 0.69, 1.17, 0.86], [0.19, 0.56, 0.12], primary, [0, 0, side * -0.22]);
          box([side * 0.69, 1.17, 0.93], [0.11, 0.41, 0.025], accent, [0, 0, side * -0.22]);
        }
        break;
      case 'tail':
        strut([0.53, 0.65, 1.14], [0.68, 0.83, 1.49], 0.14, primary);
        strut([0.68, 0.83, 1.49], [0.89, 1.09, 1.45], 0.1, primary);
        strut([0.89, 1.09, 1.45], [0.82, 1.28, 1.26], 0.06, accent);
        break;
      case 'feathers':
        for (const side of SIDES) for (let i = 0; i < 3; i += 1) box([side * (0.64 + i * 0.13), 1.05 + i * 0.09, 0.93], [0.1, 0.52, 0.055], i % 2 ? accent : detail, [0, 0, side * (-0.2 - i * 0.2)]);
        break;
      case 'badge':
        cylinder([0, 0.81, -0.98], 0.23, 0.045, accent, 'y', 6);
        cylinder([0, 0.845, -0.98], 0.12, 0.025, detail, 'y', 6);
        break;
      case 'flag':
        box([0.72, 1.2, 0.92], [0.035, 1.0, 0.035], metal);
        box([0.91, 1.53, 0.92], [0.4, 0.26, 0.035], accent);
        break;
      case 'suture':
        for (const side of SIDES) for (let i = 0; i < 5; i += 1) {
          box([side * 0.73, 0.8, -0.7 + i * 0.4], [0.2, 0.025, 0.045], detail, [0, side * 0.6, 0]);
          box([side * 0.73, 0.81, -0.72 + i * 0.4], [0.045, 0.025, 0.14], accent);
        }
        break;
      case 'mask':
        sphere([0, 0.98, -1.07], [0.25, 0.31, 0.095], white, 12, 6);
        for (const side of SIDES) {
          box([side * 0.1, 1.06, -1.165], [0.115, 0.065, 0.025], dark, [0, 0, side * 0.12]);
          strut([side * 0.22, 1.0, -1.04], [side * 0.38, 0.91, -0.94], 0.04, dark);
        }
        box([0, 0.96, -1.185], [0.045, 0.09, 0.055], bone);
        box([0, 0.81, -1.151], [0.1, 0.025, 0.035], dark);
        break;
      case 'chainsaw':
        box([-0.91, 0.83, -0.35], [0.14, 0.19, 1.48], metal);
        cylinder([-0.91, 0.83, -1.09], 0.095, 0.14, metal, 'x', 10);
        box([-0.99, 0.83, -0.35], [0.025, 0.075, 1.34], dark);
        for (let i = 0; i < 9; i += 1) for (const edge of SIDES) {
          box([-0.91, 0.83 + edge * 0.12, -1.03 + i * 0.16], [0.17, 0.07, 0.08], dark, [edge * -0.3, 0, 0]);
        }
        box([-0.87, 0.83, 0.67], [0.38, 0.39, 0.56], accent);
        box([-0.88, 1.08, 0.63], [0.34, 0.075, 0.43], dark);
        for (const x of [-1.03, -0.73]) box([x, 0.98, 0.63], [0.05, 0.19, 0.05], dark);
        for (let i = 0; i < 3; i += 1) box([-1.073, 0.72 + i * 0.095, 0.67], [0.025, 0.03, 0.31], dark);
        break;
      case 'optic':
        cylinder([0, 0.96, -1.08], 0.26, 0.18, metal, 'z', 12);
        cylinder([0, 0.96, -1.185], 0.205, 0.035, dark, 'z', 12);
        cylinder([0, 0.96, -1.21], 0.15, 0.035, detail, 'z', 12);
        cylinder([0, 0.96, -1.235], 0.065, 0.025, dark, 'z', 10);
        for (const side of SIDES) box([side * 0.28, 0.96, -1.11], [0.1, 0.15, 0.14], shade);
        break;
      case 'eye-sigil': {
        const outline = [[-0.31, -0.97], [-0.18, -1.1], [0, -1.14], [0.18, -1.1],
          [0.31, -0.97], [0.18, -0.84], [0, -0.8], [-0.18, -0.84]];
        for (let i = 0; i < outline.length; i += 1) {
          const a = outline[i], b = outline[(i + 1) % outline.length];
          strut([a[0], 0.84, a[1]], [b[0], 0.84, b[1]], 0.035, amber);
        }
        cylinder([0, 0.845, -0.97], 0.095, 0.045, amber, 'y', 12);
        cylinder([0, 0.875, -0.97], 0.043, 0.025, dark, 'y', 10);
        strut([0, 0.84, -0.8], [0, 0.84, -0.64], 0.035, amber);
        strut([0, 0.84, -0.64], [-0.18, 0.84, -0.7], 0.035, amber);
        strut([0.21, 0.84, -0.83], [0.29, 0.84, -0.61], 0.035, amber);
        break;
      }
      case 'cactus':
        cylinder([0.69, 1.08, 0.91], 0.13, 0.65, green, 'y', 10);
        sphere([0.69, 1.41, 0.91], [0.13, 0.13, 0.13], green, 10, 5);
        for (const side of SIDES) {
          strut([0.69, 1.09, 0.91], [0.69 + side * 0.27, 1.09, 0.91], 0.13, green);
          cylinder([0.69 + side * 0.27, 1.25, 0.91], 0.085, 0.32, green, 'y', 8);
          sphere([0.69 + side * 0.27, 1.42, 0.91], [0.085, 0.085, 0.085], green, 8, 4);
        }
        for (let i = 0; i < 5; i += 1) for (const side of SIDES) box([0.69 + side * 0.07, 0.9 + i * 0.11, 1.045], [0.018, 0.035, 0.04], bone, [0, side * 0.3, 0]);
        break;
      case 'sneakers':
      case 'slippers':
        for (const side of SIDES) {
          box([side * 0.79, 0.52, -0.87], [0.38, 0.09, 0.69], white);
          if (motif === 'slippers') {
            hull([side * 0.79, 0.63, -0.98], [0.36, 0.18, 0.45], accent, 0.84);
            box([side * 0.79, 0.59, -0.62], [0.23, 0.035, 0.16], shade);
          } else {
            hull([side * 0.79, 0.66, -0.85], [0.36, 0.23, 0.62], accent, 0.82);
            box([side * 0.79, 0.78, -0.67], [0.27, 0.16, 0.22], accent);
            box([side * 0.79, 0.87, -0.67], [0.18, 0.025, 0.13], dark);
            for (let i = 0; i < 3; i += 1) box([side * 0.79, 0.79 - i * 0.035, -0.79 - i * 0.09], [0.22, 0.025, 0.035], white, [-0.2, 0, 0]);
          }
        }
        break;
      default: throw new Error(`Unimplemented kart identity motif: ${motif}`);
    }
  };
  for (const motif of motifs) {
    features.push(`motif:${motif}`);
    part(`motif-${motif}`, () => drawMotif(motif));
  }

  // Even spacecraft adaptations are grounded karts. Their small dark rollers
  // sit beneath the hull instead of covering the iconic flight silhouette.
  const wheels = wheelLayout || SIDES.flatMap(side => (model === 'mako' ? [-1, 0, 1] : SIDES).map(front => ({
    id: `wheel-${front < 0 ? 'front' : front > 0 ? 'rear' : 'middle'}-${side < 0 ? 'left' : 'right'}`,
    pivot: [side * wheelX, radius, front * wheelZ], radius, width: wheelWidth, steering: front < 0
  })));
  for (const wheel of wheels) {
    const { pivot, radius: r, width: w, steering } = wheel, side = pivot[0] < 0 ? -1 : 1;
    const start = positions.length / 3;
    if (wheel.wire) {
      ring(pivot, r - 0.025, 0.025, rubber, 'x', 20);
      ring(pivot, r - 0.06, 0.015, metal, 'x', 20);
      cylinder(pivot, 0.065, w + 0.025, metal, 'x', 8);
      for (let spoke = 0; spoke < 10; spoke += 1) {
        const a = TAU * spoke / 10;
        strut(pivot, [pivot[0], pivot[1] + Math.cos(a) * (r - 0.06), pivot[2] + Math.sin(a) * (r - 0.06)], 0.013, metal);
      }
    } else {
      cylinder(pivot, r, w, rubber, 'x', 12);
      cylinder([pivot[0] + side * (w / 2 + 0.012), pivot[1], pivot[2]], r * 0.68, 0.024, metal, 'x', 12);
      cylinder([pivot[0] + side * (w / 2 + 0.028), pivot[1], pivot[2]], r * 0.45, 0.025, hiddenRollers ? dark : accent, 'x', 10);
      for (let spoke = 0; spoke < 5; spoke += 1) {
        const a = TAU * spoke / 5;
        box([pivot[0] + side * (w / 2 + 0.045), pivot[1] + Math.cos(a) * r * 0.25, pivot[2] + Math.sin(a) * r * 0.25],
          [0.025, r * 0.5, 0.03], hiddenRollers ? metal : dark, [a, 0, 0]);
      }
    }
    parts.push({ id: wheel.id, kind: 'wheel', start, count: positions.length / 3 - start,
      pivot, steering, rollAxis: 'x', radius: r });
  }
  return true;
}
