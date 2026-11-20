// Squares, heights and routes authored for the original campaign's Tactics mode.
// The campaign manifest supplies the setting and objective. The board is a
// playable interpretation of that setting with its own geometry and materials.
import { KHIPU_WITNESS_ACTOR, KHIPU_WITNESS_ID } from './tacticsKhipuWitness.js';
import { TACTICS_IRON_ASHLINE_BATTLEFIELD } from './tacticsIronAshlineBattlefield.js';

const frEn = (fr, en) => ({ fr, en });
const reference = 'src/game/originalUniversesManifest.json';

const materialNames = {
  'greywake-causeway': frEn('Dalles de l’Observatoire', 'Observatory flagstones'),
  'greywake-crypt': frEn('Schiste humide de la crypte', 'Wet crypt slate'),
  'greywake-gallery': frEn('Cuivre gravé de la galerie', 'Etched gallery copper'),
  'greywake-amethyst': frEn('Passage d’angle · Améthyste', 'Angle passage · Amethyst'),
  'greywake-verdigris': frEn('Passage d’angle · Vert-de-gris', 'Angle passage · Verdigris'),
  'valedor-commonway': frEn('Pavés de la voie commune', 'Commonway cobbles'),
  'valedor-garden': frEn('Herbe du jardin elfique', 'Elven garden grass'),
  'valedor-forge': frEn('Grès du quartier des forges', 'Forges district sandstone'),
  'valedor-basalt': frEn('Basalte de la place orque', 'Orc square basalt'),
  'valedor-market': frEn('Bois du marché humain', 'Human market timber'),
  'qhapaq-trail': frEn('Terre ocre du sentier bas', 'Ochre soil of the low trail'),
  'qhapaq-wall': frEn('Maçonnerie à sec de la terrasse', 'Dry-stone terrace masonry'),
  'qhapaq-crag': frEn('Roche feuilletée de la corniche', 'Layered ridge rock'),
  'qhapaq-pampa': frEn('Herbe sèche du col', 'Dry pass grass'),
  'infernum-clinker': frEn('Scories du greffe', 'Clinker from the clerk’s floor'),
  'infernum-iron': frEn('Fer riveté des coursives', 'Riveted catwalk iron'),
  'infernum-obsidian': frEn('Obsidienne de la fosse', 'Trench obsidian'),
  'infernum-lava': frEn('Lave du canal fiscal', 'Fiscal channel lava')
};

function makeBoard(id, cols, rows, baseMaterial, upperLayer = 'gallery') {
  const ground = new Map(), upper = new Map();
  const key = (x, y) => `${x}:${y}`;
  function put(x, y, z, materialId, options = {}) {
    const layerId = options.layerId || 'ground';
    const surface = {
      id: `${id}:${layerId}:${x}:${y}`, x, y, z, cornerZ: [z, z, z, z], layerId,
      materialId, materialLabel: materialNames[materialId], solidBottom: -2.5,
      shape: 'flat', type: 'normal', walkable: true, ...options
    };
    (layerId === upperLayer ? upper : ground).set(key(x, y), surface);
    return surface;
  }
  const area = (x0, y0, x1, y1, z, material, options) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, z, material, options);
  };
  area(0, 0, cols - 1, rows - 1, 0, baseMaterial);
  const get = (x, y, gallery = false) => (gallery ? upper : ground).get(key(x, y));
  return {
    id, cols, rows, put, area, get,
    ref(x, y, gallery = false) {
      const { id: surfaceId, z } = get(x, y, gallery);
      return { x, y, z, surfaceId };
    },
    incline(x, y, low, high, direction, material, shape = 'ramp') {
      const cornerZ = {
        east: [low, high, high, low], west: [high, low, low, high],
        north: [high, high, low, low], south: [low, low, high, high]
      }[direction];
      return put(x, y, (low + high) / 2, material, {
        cornerZ, shape, direction, moveCost: 2,
        ...(shape === 'stairs' ? { stepCount: Math.ceil((high - low) * 2) } : {})
      });
    },
    surfaces: () => [...ground.values(), ...upper.values()]
  };
}

const obstacle = (board, name, x, y, sceneryKind, extra = {}) => ({
  ...board.ref(x, y), gridX: x, gridY: y, id: `${board.id}:cover:${x}:${y}`,
  name, sceneryKind, type: 'barrier', hp: 100, maxHp: 100, tacticsHeight: 1.4, ...extra
});
const refs = (board, coordinates) => coordinates.map(point => board.ref(...point));

function finish(board, { objectiveText, ...spec }) {
  const surfaces = board.surfaces();
  return {
    id: board.id, cols: board.cols, rows: board.rows, formatVersion: 2,
    modeExclusive: 'Tactics', layoutId: `${board.id}:v1`,
    scenario: objectiveText, objectiveText: { [spec.objective]: objectiveText },
    surfaces, tiles: surfaces.filter(surface => surface.type !== 'normal')
      .map(({ id: surfaceId, x, y, z, type, label }) => ({ surfaceId, x, y, z, type, label })),
    ...spec
  };
}

function observatory() {
  const stone = 'greywake-causeway', slate = 'greywake-crypt', copper = 'greywake-gallery';
  const b = makeBoard('drowned_observatory_angles_tactics', 11, 9, stone);
  b.area(3, 2, 7, 6, -1, slate);
  b.incline(2, 4, -1, 0, 'west', slate);
  b.incline(8, 4, -1, 0, 'east', slate);
  b.incline(4, 7, -1, 0, 'south', slate);

  const gallery = { layerId: 'gallery', shape: 'slab', solidBottom: 2.16 };
  b.area(4, 4, 7, 4, 2.5, copper, gallery);
  b.area(6, 3, 7, 5, 2.5, copper, gallery);
  b.incline(8, 3, 1.25, 2.5, 'west', copper, 'stairs');
  b.incline(9, 3, 0, 1.25, 'west', stone, 'stairs');

  b.put(1, 4, 0, 'greywake-amethyst', { anglePassage: true });
  b.put(5, 4, 2.5, 'greywake-amethyst', { ...gallery, anglePassage: true });
  b.put(4, 6, -1, 'greywake-verdigris', { anglePassage: true });
  b.put(7, 5, 2.5, 'greywake-verdigris', { ...gallery, anglePassage: true });
  const passage = (from, to) => ({
    kind: 'teleport', cost: 2, from: b.ref(...from).surfaceId, to: b.ref(...to).surfaceId
  });

  for (const [x, y, upper, label] of [
    [6, 4, false, 'Carte de la crypte'],
    [6, 4, true, 'Carte de la galerie'],
    [7, 3, true, 'Carte de la lentille']
  ]) Object.assign(b.get(x, y, upper), { type: 'artifact', label });
  b.get(6, 3, true).coverEdges = { north: { height: 0.65, reduction: 0.24 } };

  return finish(b, {
    label: frEn('Observatoire des Angles Impossibles', 'Observatory of Impossible Angles'),
    objective: 'artifact', objectiveTarget: 3,
    objectiveText: frEn('Récupérer les trois cartes sur leur niveau. Les passages d’angle relient les dalles de même couleur.',
      'Recover the three charts on their own levels. Angle passages connect matching floor markings.'),
    tags: ['vertical', 'universeSector', 'stackedRecovery', 'teleport'],
    source: {
      universe: 'The Drowned Testament', work: 'Multiverse Breach',
      stageKey: 'lovecraft_impossible_observatory', location: 'Observatoire des Angles Impossibles',
      sourceReference: reference, source1to1Verified: false
    },
    tacticsPresentation: { biome: 'greywake-observatory', weather: 'mist', skyline: 'Greywake observatory lenses' },
    links: [passage([1, 4], [5, 4, true]), passage([4, 6], [7, 5, true])],
    heroSpawns: refs(b, [[0, 4], [0, 3], [0, 5]]),
    monsterSpawns: refs(b, [[9, 2], [10, 6], [8, 5]]),
    bossSpawns: refs(b, [[9, 0], [9, 7]]),
    worldBossSpawn: b.ref(9, 4),
    pickupSpawns: refs(b, [[1, 5], [4, 3], [3, 5], [7, 4, true], [8, 6]]),
    obstacles: [
      obstacle(b, 'Contrefort de la crypte', 5, 5, 'boulder', { color: '#465463', tacticsHeight: 1.9 }),
      obstacle(b, 'Socle de l’Observatoire', 8, 1, 'boulder', { color: '#667286' }),
      obstacle(b, 'Bloc du registre', 2, 2, 'boulder', { color: '#4b6370' })
    ]
  });
}

function crossroads() {
  const common = 'valedor-commonway', grass = 'valedor-garden', sandstone = 'valedor-forge';
  const basalt = 'valedor-basalt', market = 'valedor-market';
  const b = makeBoard('valedor_free_city_crossroads_tactics', 12, 9, common);
  b.area(0, 0, 4, 3, 1.5, grass);
  b.area(7, 0, 11, 3, 2, sandstone);
  b.area(7, 5, 11, 8, -1, basalt);
  b.area(0, 5, 4, 8, 0, market);
  b.incline(5, 2, 0, 1.5, 'west', common, 'stairs');
  b.incline(2, 4, 0, 1.5, 'north', common);
  b.incline(7, 2, 0, 1, 'east', sandstone);
  b.incline(8, 2, 1, 2, 'east', sandstone);
  b.incline(7, 6, -1, 0, 'west', basalt, 'stairs');
  b.incline(10, 4, -1, 2, 'north', sandstone, 'stairs');

  for (const [x, y, label, coverEdges] of [
    [3, 2, 'Place du Jardin elfique', { north: { height: 0.55, reduction: 0.18 } }],
    [9, 2, 'Place des Forges', { north: { height: 0.55, reduction: 0.18 } }],
    [8, 6, 'Place du Serment orque', { south: { height: 0.55, reduction: 0.18 } }],
    [3, 6, 'Place du Marché humain', { south: { height: 0.55, reduction: 0.18 } }]
  ]) Object.assign(b.get(x, y), { type: 'objective', label, coverEdges });

  return finish(b, {
    label: frEn('Carrefour de la Cité Libre', 'Crossroads of the Free City'),
    objective: 'control', objectiveTarget: 8,
    objectiveText: frEn('Tenir les places des quatre quartiers. Chaque place libre de l’adversaire rapporte un ancrage en fin de tour.',
      'Hold the four district squares. Each uncontested square earns an anchor at the end of a turn.'),
    tags: ['vertical', 'universeSector', 'districts', 'control', 'lineOfSight'],
    source: {
      universe: 'Valedor: The Shattered Crown', work: 'Multiverse Breach',
      stageKey: 'fantasy_crossroads_free_city', location: 'Carrefour de la Cité Libre',
      sourceReference: reference, source1to1Verified: false
    },
    tacticsPresentation: { biome: 'valedor-crossroads', skyline: 'Free City walls and district roofs' },
    heroSpawns: refs(b, [[0, 4], [1, 4], [0, 6]]),
    monsterSpawns: refs(b, [[8, 4], [10, 5], [8, 1]]),
    bossSpawns: refs(b, [[10, 0], [10, 6]]),
    worldBossSpawn: b.ref(7, 7),
    pickupSpawns: refs(b, [[2, 5], [1, 2], [5, 3], [9, 1], [9, 8]]),
    obstacles: [
      obstacle(b, 'Arbre du jardin', 2, 2, 'tree', { color: '#617b52', foliageColor: '#7fa46d', treeStyle: 'broadleaf', tacticsHeight: 2.2 }),
      obstacle(b, 'Bloc de la forge', 9, 3, 'boulder', { color: '#9d7963' }),
      obstacle(b, 'Pierre du Serment', 9, 6, 'boulder', { color: '#776454' }),
      obstacle(b, 'Chariot du marché', 4, 6, 'barrier', { color: '#936549' })
    ]
  });
}

function qhapaqNan() {
  const trail = 'qhapaq-trail', wall = 'qhapaq-wall', crag = 'qhapaq-crag', pampa = 'qhapaq-pampa';
  const b = makeBoard('tawantinsuyu_qhapaq_nan_tactics', 12, 9, trail);
  b.area(3, 0, 5, 8, 1, wall);
  b.area(6, 0, 8, 8, 2.5, crag);
  b.area(9, 0, 11, 8, 3.5, pampa);
  for (const y of [6, 7]) b.incline(3, y, 0, 1, 'east', trail);
  for (const y of [2, 3]) b.incline(6, y, 1, 2.5, 'east', wall, 'stairs');
  for (const y of [5, 6]) b.incline(9, y, 2.5, 3.5, 'east', crag);
  b.get(4, 5).coverEdges = { north: { height: 0.55, reduction: 0.16 } };
  b.get(7, 4).coverEdges = { south: { height: 0.58, reduction: 0.18 } };
  const extractionZone = refs(b, [[11, 5], [11, 6]]);
  for (const { x, y } of extractionZone) Object.assign(b.get(x, y), { type: 'objective', label: 'Col de passage du khipu' });
  return finish(b, {
    label: frEn('Qhapaq Ñan des Falaises', 'Cliff Qhapaq Nan'),
    objective: 'escort', objectiveTarget: 1,
    objectiveText: frEn('Restez à portée du témoin du khipu. Suivez les trois lacets jusqu’au passage haut.',
      'Stay alongside the khipu witness. Follow three switchbacks to the high pass.'),
    tags: ['vertical', 'universeSector', 'escort', 'switchbacks', 'cliffs'],
    source: {
      universe: 'Tawantinsuyu: The Split Sun', work: 'Multiverse Breach',
      stageKey: 'inca_qhapaq_nan_cliffs', location: 'Qhapaq Ñan des Falaises',
      sourceReference: reference, source1to1Verified: false
    },
    tacticsPresentation: { biome: 'qhapaq-terraces', skyline: 'Andean cliff terraces' },
    escort: {
      id: KHIPU_WITNESS_ID,
      universe: KHIPU_WITNESS_ACTOR.universe,
      name: frEn('Témoin du khipu', 'Khipu witness'),
      role: frEn('Porte le khipu de mémoire au passage haut', 'Carries the memory khipu to the high pass')
    },
    extractionZone, escortSpawn: b.ref(1, 7),
    heroSpawns: refs(b, [[0, 7], [0, 5], [0, 8]]),
    monsterSpawns: refs(b, [[7, 0], [8, 7], [10, 2]]),
    bossSpawns: refs(b, [[10, 0], [10, 7]]),
    worldBossSpawn: b.ref(10, 3),
    pickupSpawns: refs(b, [[1, 5], [4, 6], [4, 2], [7, 3], [10, 6]]),
    obstacles: [
      obstacle(b, 'Bloc de soutènement du premier lacet', 5, 5, 'boulder', { color: '#97775a', tacticsHeight: 1.8 }),
      obstacle(b, 'Rocher de la corniche', 8, 3, 'boulder', { color: '#77757b', tacticsHeight: 2 }),
      obstacle(b, 'Muret du versant', 9, 4, 'ruin-wall', { color: '#8a7e64' })
    ]
  });
}

function pitOfAuditors() {
  const clinker = 'infernum-clinker', iron = 'infernum-iron', obsidian = 'infernum-obsidian', lava = 'infernum-lava';
  const b = makeBoard('infernum_pit_of_auditors_tactics', 12, 9, clinker, 'catwalk');
  b.area(5, 0, 5, 8, -1.25, lava, { walkable: false, opaque: false, solidBottom: -1.45 });
  b.area(6, 0, 6, 8, -1.25, obsidian);
  b.area(4, 2, 4, 5, 2.5, iron);
  b.area(7, 2, 8, 5, 2.5, iron);
  b.incline(3, 4, 0, 2.5, 'east', obsidian, 'stairs');
  b.incline(9, 4, 0, 2.5, 'west', obsidian, 'stairs');
  b.area(5, 4, 6, 4, 2.5, iron, { layerId: 'catwalk', shape: 'slab', solidBottom: 2.18 });
  b.incline(4, 7, -1.25, 0, 'west', obsidian);
  b.put(5, 7, -1.25, obsidian, { type: 'hazard', moveCost: 2, label: 'Passage chaud de la fosse' });
  b.incline(7, 7, -1.25, 0, 'east', obsidian);
  b.get(5, 4, true).coverEdges = { north: { height: 0.65, reduction: 0.22 } };
  const ledger = (x, y, name) => obstacle(b, name, x, y, 'infernum-ledger', {
    type: 'objective', tacticsHeight: 0.9, hp: 32, maxHp: 32
  });
  return finish(b, {
    label: frEn('Gouffre des Auditeurs', 'Pit of Auditors'),
    objective: 'disable', objectiveTarget: 3, objectiveTurnLimit: 24,
    objectiveText: frEn('Détruisez les trois registres avant la clôture, sur la coursive, dans la fosse et au greffe.',
      'Destroy the three ledgers before closing, on the catwalk, in the trench and at the clerk’s office.'),
    tags: ['vertical', 'universeSector', 'disable', 'hazard', 'ledgerDeadline'],
    source: {
      universe: 'Infernum: Nine Pits', work: 'Multiverse Breach',
      stageKey: 'hell_pit_auditors', location: 'Gouffre des Auditeurs',
      sourceReference: reference, source1to1Verified: false
    },
    tacticsPresentation: { biome: 'infernum-auditors', weather: 'embers', skyline: 'Infernal archive towers' },
    heroSpawns: refs(b, [[0, 4], [0, 3], [0, 5]]),
    monsterSpawns: refs(b, [[8, 3], [9, 2], [9, 7]]),
    bossSpawns: refs(b, [[10, 0], [10, 7]]),
    worldBossSpawn: b.ref(10, 4),
    pickupSpawns: refs(b, [[2, 5], [4, 5], [6, 4, true], [6, 6], [10, 6]]),
    obstacles: [
      ledger(4, 2, 'Registre des Condamnations'),
      ledger(6, 4, 'Registre des Dettes'),
      ledger(9, 6, 'Registre du Greffe'),
      obstacle(b, 'Éperon de scories', 2, 2, 'boulder', { color: '#5d4a51', tacticsHeight: 2 })
    ]
  });
}

export const TACTICS_ORIGINAL_BATTLEFIELDS = Object.freeze(Object.fromEntries(
  [observatory(), crossroads(), qhapaqNan(), pitOfAuditors(), TACTICS_IRON_ASHLINE_BATTLEFIELD].map(field => [field.id, field])
));
