// The two western climbs, the stream and the eastern descent are separate
// routes on the height map. The rock arch is an extra surface over the stream.
const id = 'nexus_highgrass_pass';
const cols = 13;
const rows = 9;
const labels = {
  'meadow-grass': { fr: 'Herbes du vallon', en: 'Valley grass' },
  'pine-earth': { fr: 'Terre du sentier', en: 'Trail soil' },
  'alpine-rock': { fr: 'Roche de la crête', en: 'Ridge rock' },
  'shallow-water': { fr: 'Eau peu profonde', en: 'Shallow water' },
  'nexus-metal': { fr: 'Métal du relais A.R.C.A.', en: 'A.R.C.A. relay metal' }
};
const groundId = (x, y) => `${id}:ground:${x}:${y}`;
const surface = (x, y, z, materialId, extra = {}) => ({
  id: groundId(x, y), x, y, z, cornerZ: [z, z, z, z], materialId,
  materialLabel: labels[materialId], layerId: 'valley', shape: 'flat',
  solidBottom: -1.5, type: 'normal', walkable: true, ...extra
});
const flat = (x, y, z, materialId, extra) => {
  ground[y * cols + x] = surface(x, y, z, materialId, extra);
};
const ground = Array.from({ length: cols * rows }, (_, index) =>
  surface(index % cols, Math.floor(index / cols), 0, 'meadow-grass'));

for (let y = 2; y <= 6; y += 1) {
  flat(3, y, -0.5, 'shallow-water', { layerId: 'stream', moveCost: 2 });
  for (let x = 4; x <= 9; x += 1) {
    const material = x === 4 || x === 9 || y === 2 ? 'alpine-rock' : 'meadow-grass';
    flat(x, y, 3, material, { layerId: 'ridge' });
  }
}

const slope = (x, y, west, east, shape, materialId) => flat(x, y, (west + east) / 2, materialId, {
  layerId: 'trail', shape, direction: west < east ? 'east' : 'west',
  cornerZ: [west, east, east, west], moveCost: 2,
  ...(shape === 'stairs' ? { stepCount: 4 } : {})
});

slope(3, 1, 0, 1.5, 'stairs', 'alpine-rock');
slope(4, 1, 1.5, 3, 'stairs', 'alpine-rock');
for (let x = 5; x <= 7; x += 1) flat(x, 1, 3, 'alpine-rock', { layerId: 'ridge' });

for (let x = 4; x <= 6; x += 1) slope(x, 7, x - 4, x - 3, 'ramp', 'pine-earth');
for (let x = 7; x <= 9; x += 1) flat(x, 7, 3, 'pine-earth', { layerId: 'ridge' });

slope(10, 4, 3, 1.5, 'stairs', 'alpine-rock');
slope(11, 4, 1.5, 0, 'stairs', 'alpine-rock');
flat(7, 4, 3, 'nexus-metal', {
  layerId: 'ridge', type: 'objective',
  coverEdges: { north: { height: 0.55, reduction: 0.18 } }
});

const arch = surface(3, 4, 3, 'alpine-rock', {
  id: `${id}:arch:3:4`, shape: 'slab', layerId: 'arch', solidBottom: 2.3
});
const surfaces = [...ground, arch];
const ref = (x, y) => ({ x, y, surfaceId: groundId(x, y) });
const scenery = (key, x, y, name, sceneryKind, tacticsHeight, color) => ({
  id: `${id}:${key}`, surfaceId: groundId(x, y), gridX: x, gridY: y,
  name, sceneryKind, tacticsHeight, color, type: 'barrier', hp: 90, maxHp: 90,
  ...(sceneryKind === 'tree' ? { treeStyle: 'conifer', foliageColor: color } : {})
});

export const TACTICS_NEXUS_HIGHGRASS_BATTLEFIELD = {
  id, cols, rows, formatVersion: 2, modeExclusive: 'Tactics', layoutId: `${id}:v1`,
  label: { fr: 'Nexus — Col des Hautes-Herbes', en: 'Nexus — Highgrass Pass' },
  objective: 'control', objectiveTarget: 3, tileTheme: 'grass',
  tags: ['vertical', 'highGround', 'lineOfSight', 'objective', 'mountain'],
  source: {
    universe: 'Nexus de Convergence', work: 'Multiverse Breach',
    location: 'Col des Hautes-Herbes', source1to1Verified: false
  },
  tacticsPresentation: {
    id, biome: 'alpine', architecture: 'none', weather: 'clear', skyline: 'Highgrass ridge',
    palette: { ground: '#607453', near: '#526950', far: '#889889', haze: '#c7d4bc', accent: '#d4d593' }
  },
  scenario: {
    fr: 'Atteins le relais de la crête par les marches au nord ou le sentier au sud. Contrôle le relais à la fin de trois tours.',
    en: 'Reach the ridge relay by the northern steps or the southern trail. Control the relay at the end of three turns.'
  },
  surfaces, tiles: [{ ...ref(7, 4), type: 'objective' }],
  heroSpawns: [ref(0, 4), ref(0, 3), ref(0, 5)],
  monsterSpawns: [ref(9, 4), ref(11, 5), ref(12, 3)],
  bossSpawns: [ref(10, 0), ref(8, 2)], worldBossSpawn: ref(10, 7),
  pickupSpawns: [ref(2, 3), ref(3, 5), ref(5, 1), ref(6, 6), ref(12, 6)],
  obstacles: [
    scenery('valley-pine', 1, 5, 'Pin du vallon', 'tree', 2.1, '#395c48'),
    scenery('ridge-boulder-west', 5, 3, 'Bloc du versant ouest', 'boulder', 1.4, '#7d857e'),
    scenery('ridge-boulder-east', 8, 5, 'Bloc du versant est', 'boulder', 1.6, '#727e77')
  ]
};
