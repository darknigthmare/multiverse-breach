// Original Iron Tempest campaign setting, authored as a Tactics-only board.
// The manifest supplies the trench/radio setting, not this new map geometry.
const id = 'iron_ashline_radio_ridge_tactics';
const cols = 14, rows = 10;
const names = {
  'ashline-grass': { fr: 'Herbe du talus', en: 'Embankment grass' },
  'ashline-mud': { fr: 'Boue de la tranchée', en: 'Trench mud' },
  'ashline-gravel': { fr: 'Gravier de liaison', en: 'Service-route gravel' },
  'ashline-rock': { fr: 'Schiste du parapet', en: 'Parapet shale' },
  'ashline-planks': { fr: 'Planches du franchissement', en: 'Crossing planks' }
};
const groundId = (x, y) => `${id}:ground:${x}:${y}`;
const ground = new Map(), deck = [];
const put = (x, y, z, materialId, extra = {}) => {
  const surface = { id: groundId(x, y), x, y, z, cornerZ: [z, z, z, z],
    layerId: 'ground', shape: 'flat', solidBottom: -2.5,
    materialId, materialLabel: names[materialId], moveCost: 1,
    type: 'normal', walkable: true, ...extra };
  ground.set(`${x}:${y}`, surface);
  return surface;
};
const area = (x0, y0, x1, y1, z, material, extra) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, z, material, extra);
};
const slope = (x, y, low, high, direction, material, shape = 'stairs') => put(x, y, (low + high) / 2, material, {
  cornerZ: { east: [low, high, high, low], west: [high, low, low, high],
    north: [high, high, low, low], south: [low, low, high, high] }[direction],
  shape, direction, moveCost: 2, ...(shape === 'stairs' ? { stepCount: 4 } : {})
});
area(0, 0, cols - 1, rows - 1, 0, 'ashline-grass');
area(3, 4, 9, 6, -1, 'ashline-mud', { layerId: 'trench', moveCost: 2 });
area(7, 0, 13, 2, 2, 'ashline-grass', { layerId: 'ridge' });
area(8, 3, 10, 3, 2, 'ashline-rock', { layerId: 'ridge' });
area(1, 8, 12, 8, 0, 'ashline-gravel');
area(10, 6, 11, 7, 0, 'ashline-gravel');

// Two independent ascents to the high radio, without jump/teleport links.
slope(5, 2, 0, 1, 'east', 'ashline-gravel', 'ramp');
slope(6, 2, 1, 2, 'east', 'ashline-rock');
slope(12, 3, 1, 2, 'north', 'ashline-rock');
slope(12, 4, 0, 1, 'north', 'ashline-gravel', 'ramp');
// Three entrances to the slow, sheltered trench floor.
slope(2, 5, -1, 0, 'west', 'ashline-rock');
slope(10, 5, -1, 0, 'east', 'ashline-rock');
slope(5, 7, -1, 0, 'south', 'ashline-gravel', 'ramp');
slope(4, 3, -1, 0, 'north', 'ashline-gravel', 'ramp');

// The short crossing has a distinct support above the trench. Its underside
// leaves 1.75 height units: a normal 1.6-high unit fits below; a 3-high unit does not.
slope(1, 4, 0, 1, 'east', 'ashline-planks');
for (let x = 2; x <= 9; x++) deck.push({
  ...ground.get(`${x}:4`), id: `${id}:crossing:${x}:4`, z: 1, cornerZ: [1, 1, 1, 1],
  shape: 'slab', layerId: 'crossing', solidBottom: 0.75,
  materialId: 'ashline-planks', materialLabel: names['ashline-planks'], moveCost: 1
});
slope(10, 4, 0, 1, 'west', 'ashline-planks');

const ref = (x, y, onDeck = false) => {
  const s = onDeck ? deck.find(surface => surface.x === x && surface.y === y) : ground.get(`${x}:${y}`);
  return { x, y, z: s.z, surfaceId: s.id };
};
for (const [x, y, fr, en, edge] of [
  [5, 5, 'Radio du boyau', 'Trench radio', 'north'],
  [10, 1, 'Radio de la crête', 'Ridge radio', 'south'],
  [11, 8, 'Radio du ravitaillement', 'Supply radio', 'east']
]) Object.assign(ground.get(`${x}:${y}`), { type: 'objective', label: { fr, en },
  coverEdges: { [edge]: { height: 0.55, reduction: 0.18 } } });
const surfaces = [...ground.values(), ...deck];
const obstacle = (key, x, y, name, color, tacticsHeight) => ({
  ...ref(x, y), gridX: x, gridY: y, id: `${id}:${key}`, name,
  sceneryKind: 'boulder', color, tacticsHeight, type: 'barrier', hp: 100, maxHp: 100
});
const directive = {
  fr: 'Cumulez six transmissions en fin de tour : chaque radio tenue sans adversaire rapporte un point. Le boyau protège la traversée mais sa boue coûte deux ; le pont et le gravier accélèrent les liaisons.',
  en: 'Earn six transmissions at turn end: each uncontested radio scores one. The trench shelters movement but mud costs two; the crossing and gravel connect positions faster.'
};

export const TACTICS_IRON_ASHLINE_BATTLEFIELD = {
  id, cols, rows, formatVersion: 2, modeExclusive: 'Tactics', layoutId: `${id}:v1`,
  label: { fr: 'Ligne-Cendre — Crête des trois radios', en: 'Ashline — Three-Radio Ridge' },
  objective: 'control', objectiveTarget: 6, scenario: directive, objectiveText: { control: directive },
  tags: ['vertical', 'universeSector', 'trenches', 'control', 'supplyCrossing'],
  source: { universe: 'Iron Tempest', work: 'Multiverse Breach',
    stageKey: 'iron_ashline_trenches', location: 'Tranchées de la Ligne-Cendre',
    sourceReference: 'src/game/originalUniversesManifest.json', source1to1Verified: false,
    geometry: 'Original Tactics interpretation; no reconstruction of a pre-existing specific map.' },
  tacticsPresentation: { biome: 'iron-ashline', architecture: 'none', weather: 'clear', skyline: 'Ashline shale embankments' },
  surfaces, tiles: surfaces.filter(surface => surface.type === 'objective')
    .map(({ id: surfaceId, x, y, z, type, label }) => ({ surfaceId, x, y, z, type, label })),
  heroSpawns: [ref(0, 5), ref(0, 6), ref(0, 7)],
  monsterSpawns: [ref(12, 5), ref(12, 6), ref(10, 9)],
  bossSpawns: [ref(0, 0), ref(12, 0)], worldBossSpawn: ref(7, 8),
  pickupSpawns: [ref(2, 6), ref(4, 6), ref(8, 4, true), ref(8, 1), ref(12, 8)],
  obstacles: [
    obstacle('west-parapet', 7, 3, 'Éperon de schiste', '#716b61', 1.7),
    obstacle('trench-collapse', 6, 6, 'Éboulis du boyau', '#635d52', 1.2),
    obstacle('ridge-outcrop', 9, 1, 'Rocher de la crête', '#7b7a6d', 1.5),
    obstacle('supply-outcrop', 10, 7, 'Bloc du ravitaillement', '#797569', 1.2)
  ]
};
