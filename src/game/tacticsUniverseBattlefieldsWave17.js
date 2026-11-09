// Wave 17 dedicated sectors. All nineteen earlier sector definitions remain immutable.
// They do not reuse another engine's level geometry or its painted backdrop.
// Scale, routes and mission devices are gameplay adaptations, never a claim
// that the official location has this exact grid or these A.R.C.A. objectives.
const corners = z => [z, z, z, z];
const localized = (fr, en) => ({ fr, en });
const materialLabels = {
  'hillys-grass': localized('Herbe de l’île du phare', 'Lighthouse Island grass'),
  'hillys-stone': localized('Pierre du littoral de Hillys', 'Hillys coastal stone'),
  'hillys-dock': localized('Planches du débarcadère', 'Landing planks'),
  'legends-moss': localized('Mousse de la forêt des Ptizêtres', 'Teensie forest moss'),
  'legends-root': localized('Grandes racines de la forêt', 'Great forest roots'),
  'vdnh-marble': localized('Pierre claire de la galerie VDNH', 'VDNH light gallery stone'),
  'vdnh-inlay': localized('Dalles et incrustations du hall VDNH', 'VDNH hall tiles and inlays'),
  'vdnh-grate': localized('Caillebotis du niveau technique', 'Service-level metal grating'),
  'rainforest-fern': localized('Sol végétal de Rainforest District', 'Rainforest District fern soil'),
  'rainforest-boardwalk': localized('Passerelle humide du quartier', 'District wet boardwalk')
};

function makeBoard(id, cols, rows, materialId, defaults = {}) {
  const surfaces = new Map();
  const key = (x, y) => `${x}:${y}`;
  const surfaceId = (x, y, layer = 'ground') => `${id}:${layer}:${x}:${y}`;
  const put = (x, y, z = 0, material = materialId, extra = {}) => {
    const value = {
      id: surfaceId(x, y), x, y, z, cornerZ: corners(z), materialId: material,
      layerId: 'ground', shape: 'flat', type: 'normal', solidBottom: -2,
      walkable: true, ...defaults, ...extra
    };
    surfaces.set(key(x, y), value);
    return value;
  };
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) put(x, y);
  const extras = [];
  return {
    id, cols, rows, materialId, surfaces, extras,
    put,
    get: (x, y) => surfaces.get(key(x, y)),
    remove: (x, y) => surfaces.delete(key(x, y)),
    patch(x0, y0, x1, y1, z, material = materialId, spec = {}) {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, z, material, spec);
    },
    slope(x, y, low, high, direction, material = materialId, spec = {}) {
      const height = direction === 'east' ? [low, high, high, low]
        : direction === 'west' ? [high, low, low, high]
          : direction === 'north' ? [high, high, low, low] : [low, low, high, high];
      return put(x, y, (low + high) / 2, material, {
        cornerZ: height, shape: 'ramp', direction, layerId: 'slope', moveCost: 2, ...spec
      });
    },
    bridge(x, y, z, material, spec = {}) {
      const value = {
        id: surfaceId(x, y, 'bridge'), x, y, z, cornerZ: corners(z),
        materialId: material, layerId: 'bridge', shape: 'slab', type: 'normal',
        solidBottom: z - 0.28, thickness: 0.28, walkable: true,
        coverEdges: { east: { height: 0.65, reduction: 0.2 }, west: { height: 0.65, reduction: 0.2 } }, ...spec
      };
      extras.push(value); return value;
    },
    ref(x, y, layer = 'ground') {
      const surface = layer === 'ground' ? surfaces.get(key(x, y)) : extras.find(value => value.id === surfaceId(x, y, layer));
      if (!surface) throw new Error(`${id}: missing surface ${x},${y}/${layer}`);
      return { surfaceId: surface.id, x, y, z: surface.cornerZ.reduce((sum, v) => sum + v, 0) / 4 };
    }
  };
}

function scenery(board, key, x, y, name, kind, materialId, height = 1.4, extra = {}) {
  const ref = board.ref(x, y);
  return {
    id: `${board.id}:${key}`, surfaceId: ref.surfaceId, gridX: x, gridY: y,
    name, type: 'barrier', sceneryKind: kind, materialId, tacticsHeight: height,
    hp: 100, maxHp: 100, color: '#81877b', ...extra
  };
}
const nature = (biome, weather, architecture, skyline) => ({ biome, weather, architecture, skyline });
function source(universe, work, period, location, reference) {
  return {
    universe, work, period, location, reference, sourceReference: reference,
    source1to1Verified: false, canonicalLayoutVerified: false, networkVerified: false,
    adaptation: 'Dedicated Tactics sector: original grid, distances, paths and A.R.C.A. mission markers adapted to the named location. No official map, texture or other engine level is copied.'
  };
}
function finish(board, spec) {
  const middle = Math.floor(board.rows / 2);
  const heroSpawns = spec.heroSpawns || [board.ref(0, middle - 1), board.ref(0, middle), board.ref(0, middle + 1)];
  const monsterSpawns = spec.monsterSpawns || [board.ref(board.cols - 4, middle - 1), board.ref(board.cols - 4, middle), board.ref(board.cols - 4, middle + 1)];
  const bossSpawns = spec.bossSpawns || [board.ref(board.cols - 2, 1), board.ref(board.cols - 2, board.rows - 3)];
  const worldBossSpawn = spec.worldBossSpawn || board.ref(board.cols - 2, middle);
  const surfaces = [...board.surfaces.values(), ...board.extras].map(surface => ({
    ...surface, ...(materialLabels[surface.materialId] ? { materialLabel: materialLabels[surface.materialId] } : {})
  }));
  return {
    id: board.id, formatVersion: 2, modeExclusive: 'Tactics',
    layoutId: `${board.id}:authored-sector-v1`, rows: board.rows, cols: board.cols,
    objectiveTarget: 3, links: [], tags: ['vertical', 'universeSector', 'modeExclusive'],
    source: spec.source, sourceUniverse: spec.source.universe,
    ...spec,
    tacticsPresentation: { id: board.id, ...spec.tacticsPresentation },
    surfaces, heroSpawns, monsterSpawns, bossSpawns, worldBossSpawn,
    tiles: surfaces.filter(surface => surface.type !== 'normal').map(surface => ({
      surfaceId: surface.id, x: surface.x, y: surface.y, type: surface.type, label: surface.label
    }))
  };
}

function lighthouseIsland() {
  const b = makeBoard('bge_lighthouse_tactics', 16, 12, 'hillys-grass');
  b.patch(5, 0, 9, 3, -1.5, 'water', { walkable: false, opaque: false, solidBottom: -2 });
  b.patch(5, 4, 9, 5, -1, 'hillys-dock', { solidBottom: -1.35, moveCost: 1.5 });
  b.patch(3, 4, 4, 5, 2, 'hillys-stone');
  b.patch(10, 4, 11, 5, 2, 'hillys-stone');
  b.slope(1, 5, 0, 1, 'east', 'hillys-stone', { shape: 'stairs', stepCount: 4 });
  b.slope(2, 5, 1, 2, 'east', 'hillys-stone', { shape: 'stairs', stepCount: 4 });
  b.slope(12, 5, 2, 1, 'east', 'hillys-stone', { shape: 'stairs', stepCount: 4 });
  b.slope(13, 5, 1, 0, 'east', 'hillys-stone', { shape: 'stairs', stepCount: 4 });
  b.slope(5, 6, -1, 0, 'south', 'hillys-dock');
  b.slope(9, 6, -1, 0, 'south', 'hillys-dock');
  for (let x = 5; x <= 9; x++) b.bridge(x, 5, 2, 'hillys-dock', { coverEdges: {} });
  Object.assign(b.get(7, 5), { type: 'artifact', label: 'Repère A.R.C.A. du débarcadère' });
  Object.assign(b.extras.find(s => s.x === 7), { type: 'artifact', label: 'Repère A.R.C.A. de la terrasse' });
  return finish(b, {
    label: localized('Beyond Good & Evil — île du phare, terrasse et débarcadère', 'Beyond Good & Evil — Lighthouse Island Terrace and Landing'),
    objective: 'artifact', objectiveTarget: 2, tileTheme: 'hillys-lighthouse',
    tags: ['vertical', 'island', 'stairs', 'deepWater', 'stackedRecovery'],
    source: source('Beyond Good & Evil', 'Beyond Good & Evil (2003)', 'Original Lighthouse Island on Hillys; no Anniversary treasure-hunt additions', 'Lighthouse Island — grassy terrace, rocky stairs and lower wooden landing', 'https://www.ubisoft.com/en-us/games/beyond-good-and-evil'),
    tacticsPresentation: nature('hillys-coast', 'clear', 'hillys-lighthouse', 'Hillys coastal cliffs, island greenery and Jade’s white lighthouse'),
    scenario: { fr: 'Rejoindre les deux repères du phare, au-dessus et au-dessous du même tablier. Les escaliers de pierre conduisent à la terrasse ; la rampe du quai descend à la mer.', en: 'Recover both lighthouse markers, above and below the same deck. Stone stairs reach the terrace; the dock ramp descends towards the sea.', features: ['two-storey-landing', 'stone-stair-access', 'deep-water-edge', 'lower-dock-recovery'] },
    monsterSpawns: [b.ref(12, 7), b.ref(12, 8), b.ref(12, 9)],
    worldBossSpawn: b.ref(14, 6),
    extractionZone: [b.ref(12, 6)],
    pickupSpawns: [b.ref(1, 9), b.ref(3, 4), b.ref(7, 5, 'bridge'), b.ref(6, 4), b.ref(11, 8)],
    obstacles: [
      scenery(b, 'lighthouse-beacon', 3, 3, 'Balise du phare', 'hillys-beacon', 'hillys-stone', 2.4, { color: '#e5d9b6' }),
      scenery(b, 'island-tree', 3, 8, 'Arbre de l’île', 'tree', 'hillys-dock', 2.5, { foliageColor: '#4a8753' }),
      scenery(b, 'coastal-rock', 10, 2, 'Rocher du littoral', 'boulder', 'hillys-stone', 1.5, { color: '#a29b80' })
    ]
  });
}

function teensiesForest() {
  const b = makeBoard('rayman_teensies_forest_tactics', 15, 12, 'legends-moss');
  b.patch(6, 2, 8, 9, -1.5, 'earth', { moveCost: 2 });
  b.patch(7, 5, 7, 7, -2, 'water', { walkable: false, opaque: false, solidBottom: -2.3 });
  b.patch(4, 2, 5, 4, 3, 'legends-root');
  b.patch(9, 5, 10, 7, 3, 'legends-root');
  for (const [x, low, high] of [[1, 0, 1], [2, 1, 2], [3, 2, 3]]) b.slope(x, 3, low, high, 'east', 'legends-root');
  for (const [x, low, high] of [[11, 3, 2], [12, 2, 1], [13, 1, 0]]) b.slope(x, 6, low, high, 'east', 'legends-root');
  for (const [x, y] of [[6, 3], [7, 3], [8, 3], [8, 4], [8, 5]]) b.bridge(x, y, 3, 'legends-root', { coverEdges: {} });
  b.slope(5, 8, 0, -1.5, 'east', 'legends-moss');
  b.slope(9, 9, -1.5, 0, 'east', 'legends-moss');
  Object.assign(b.get(6, 8), { type: 'objective', label: 'Poste A.R.C.A. du creux forestier' });
  Object.assign(b.extras.find(s => s.x === 7 && s.y === 3), { type: 'objective', label: 'Poste A.R.C.A. des grandes racines' });
  return finish(b, {
    label: localized('Rayman Legends — Ptizêtres en détresse, grandes racines', 'Rayman Legends — Teensies in Trouble, Great Roots'),
    objective: 'control', objectiveTarget: 3, tileTheme: 'legends-forest',
    tags: ['vertical', 'forest', 'rootSlopes', 'brokenUpperRoute', 'slowRavine'],
    source: source('Rayman', 'Rayman Legends (2013)', 'Original Teensies in Trouble forest world; no Rayman 2 Fairy Glade substituted', 'Teensies in Trouble — enchanted forest roots and broken upper route', 'https://dlassets-ssl.xboxlive.com/public/content/b1613d47-2330-459a-a99f-4cc84a481db9/GameManual/e96fd3f2-bfa7-4c10-9437-7fb79f597d52/en-NZ/index.html'),
    tacticsPresentation: nature('legends-dream-forest', 'mist', 'legends-great-roots', 'Teensies in Trouble towering trees, curling roots and distant stone towers'),
    scenario: { fr: 'Tenir le poste des racines et celui du ravin. Le passage haut tourne entre les arbres ; sa portion interrompue impose le détour racinaire.', en: 'Hold the root and ravine posts. The upper crossing bends between trees; its broken section requires the root detour.', features: ['curved-root-crossing', 'lower-slow-ravine', 'separate-control-heights', 'interrupted-canopy-route'] },
    worldBossSpawn: b.ref(13, 5),
    extractionZone: [b.ref(11, 8)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 3), b.ref(7, 3, 'bridge'), b.ref(6, 9), b.ref(10, 7)],
    obstacles: [
      scenery(b, 'great-tree', 3, 7, 'Grand arbre de la forêt', 'legends-root-trunk', 'legends-root', 3.4, { color: '#80634b' }),
      scenery(b, 'forest-stone', 11, 3, 'Pierre moussue', 'boulder', 'legends-moss', 1.7, { color: '#64896a' }),
      scenery(b, 'root-tree', 9, 2, 'Arbre du sentier', 'tree', 'legends-root', 3, { foliageColor: '#719b63' })
    ]
  });
}

function vdnhGallery() {
  const b = makeBoard('atomic_vdnh_gallery_tactics', 16, 12, 'vdnh-inlay');
  b.patch(5, 4, 10, 8, -1.5, 'vdnh-grate');
  b.patch(3, 2, 11, 3, 3, 'vdnh-marble');
  for (const y of [2, 3]) {
    b.slope(1, y, 0, 1.5, 'east', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
    b.slope(2, y, 1.5, 3, 'east', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
    b.slope(12, y, 3, 1.5, 'east', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
    b.slope(13, y, 1.5, 0, 'east', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
  }
  for (let y = 4; y <= 8; y++) b.bridge(7, y, 3, 'vdnh-marble', { coverEdges: {} });
  b.patch(7, 9, 9, 9, 3, 'vdnh-marble');
  b.slope(7, 10, 1.5, 3, 'north', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
  b.slope(7, 11, 0, 1.5, 'north', 'vdnh-marble', { shape: 'stairs', stepCount: 5 });
  b.slope(4, 7, 0, -1.5, 'east', 'vdnh-grate');
  b.slope(11, 7, -1.5, 0, 'east', 'vdnh-grate');
  b.slope(4, 8, 0, .75, 'east', 'vdnh-grate');
  b.slope(10, 8, .75, 0, 'east', 'vdnh-grate');
  for (let x = 5; x <= 9; x++) if (x !== 7) b.bridge(x, 8, .75, 'vdnh-grate', { coverEdges: {} });
  // The high gallery is not connected to the low slab merely by sharing XY.
  b.bridge(7, 8, .75, 'vdnh-grate', { id: `${b.id}:service-slab:7:8`, layerId: 'service-slab', coverEdges: {} });
  return finish(b, {
    label: localized('Atomic Heart — VDNH, galerie et coursive technique', 'Atomic Heart — VDNH Gallery and Service Walkway'),
    objective: 'disable', objectiveTarget: 2, tileTheme: 'vdnh-gallery',
    tags: ['vertical', 'exhibition', 'broadStairs', 'threeDecks', 'headroom', 'pillars'],
    source: source('Atomic Heart', 'Atomic Heart (2023)', 'Base-game VDNH complex, Facility 3826, alternate 1955; no contemporary Moscow museum or DLC plan', 'VDNH Exhibition — stone gallery, service trench and low maintenance crossing', 'https://store.steampowered.com/app/668580/Atomic_Heart/'),
    tacticsPresentation: nature('vdnh-exhibition', 'clear', 'vdnh-gallery', 'Facility 3826 exhibition stone columns, circular gallery and red geometric inlays'),
    scenario: { fr: 'Neutraliser les relais de la galerie et de la fosse. Un escalier large monte au balcon ; la dalle technique basse limite la hauteur libre du trajet inférieur.', en: 'Disable the gallery and trench relays. Broad stairs reach the balcony; a low technical slab limits the lower route headroom.', features: ['wide-stone-stairs', 'three-layer-maintenance-crossing', 'height-limited-underpass', 'opaque-gallery-columns'] },
    monsterSpawns: [b.ref(12, 6), b.ref(12, 7), b.ref(12, 8)],
    worldBossSpawn: b.ref(14, 5),
    extractionZone: [b.ref(12, 9)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 3), b.ref(7, 6, 'bridge'), b.ref(6, 8), b.ref(11, 10)],
    obstacles: [
      scenery(b, 'gallery-relay', 10, 3, 'Relais A.R.C.A. de la galerie', 'vdnh-terminal', 'vdnh-marble', 1.8, { type: 'objective', hp: 110, maxHp: 110, color: '#d7d5bf' }),
      scenery(b, 'service-relay', 8, 6, 'Relais A.R.C.A. du niveau technique', 'vdnh-terminal', 'vdnh-grate', 1.8, { type: 'objective', hp: 110, maxHp: 110, color: '#aeb7af' }),
      scenery(b, 'gallery-column', 5, 2, 'Colonne de la galerie', 'vdnh-column', 'vdnh-marble', 3.2, { color: '#c3bfa9' }),
      scenery(b, 'ground-column', 3, 8, 'Pilier du hall', 'vdnh-column', 'vdnh-marble', 3.2, { color: '#c3bfa9' })
    ]
  });
}

function rainforestDistrict() {
  const b = makeBoard('zootopia_rainforest_tactics', 14, 12, 'rainforest-fern');
  b.patch(4, 6, 8, 9, -1, 'swamp-mud', { moveCost: 2 });
  b.patch(5, 7, 7, 8, -1.3, 'shallow-water', { walkable: false, opaque: false, solidBottom: -1.6 });
  b.patch(4, 5, 8, 5, -1, 'rainforest-boardwalk', { solidBottom: -1.3 });
  b.slope(3, 5, 0, -1, 'east', 'rainforest-boardwalk');
  b.slope(9, 5, -1, 0, 'east', 'rainforest-boardwalk');
  b.patch(3, 2, 5, 2, 3.5, 'rainforest-boardwalk');
  b.slope(1, 2, 0, 1.75, 'east', 'rainforest-boardwalk');
  b.slope(2, 2, 1.75, 3.5, 'east', 'rainforest-boardwalk');
  for (let y = 3; y <= 9; y++) b.bridge(5, y, 3.5, 'rainforest-boardwalk', { coverEdges: {} });
  b.patch(5, 10, 6, 10, 3.5, 'rainforest-boardwalk');
  b.slope(7, 10, 3.5, 1.75, 'east', 'rainforest-boardwalk');
  b.slope(8, 10, 1.75, 0, 'east', 'rainforest-boardwalk');
  b.slope(4, 10, -1, 0, 'south', 'rainforest-fern');
  return finish(b, {
    label: localized('Zootopia — Rainforest District, passerelles et rive', 'Zootopia — Rainforest District Walkways and Riverbank'),
    objective: 'extract', objectiveTarget: 2, tileTheme: 'rainforest-district',
    tags: ['vertical', 'rainforest', 'canopy', 'mud', 'wideLowerRoute', 'extraction'],
    source: source('Zootopia', 'Zootopia (2016)', 'Original film Rainforest District; no sequel Marsh Market or theme-park layout', 'Rainforest District — canopy walkways, wet lower path and riverbank', 'https://disneyanimation.com/films/zootopia/'),
    tacticsPresentation: nature('zootopia-rainforest', 'mist', 'rainforest-canopy', 'Rainforest District giant foliage, elevated pedestrian bridges and mist above the river'),
    scenario: { fr: 'Évacuer deux unités par la passerelle haute et la rive. Le trajet bas reste large autour du bassin ; la boue coûte davantage et le tablier ne se traverse pas verticalement.', en: 'Extract two units through the high walkway and riverbank. The lower route stays wide around the pool; mud costs more and the deck cannot be crossed vertically.', features: ['upper-and-lower-extraction', 'canopy-walkway', 'large-footprint-lower-path', 'slow-wet-ground'] },
    monsterSpawns: [b.ref(10, 6), b.ref(10, 7), b.ref(10, 8)],
    worldBossSpawn: b.ref(12, 5),
    extractionZone: [b.ref(5, 10), b.ref(10, 9)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 2), b.ref(5, 5, 'bridge'), b.ref(4, 8), b.ref(9, 9)],
    obstacles: [
      scenery(b, 'canopy-steamer', 3, 7, 'Grand arbre à vapeur du quartier', 'rainforest-steamer-tree', 'rainforest-boardwalk', 3.8, { color: '#638260' }),
      scenery(b, 'river-tree', 8, 2, 'Arbre de la rive', 'tree', 'rainforest-boardwalk', 3.5, { foliageColor: '#477d61' }),
      scenery(b, 'river-stone', 9, 3, 'Rocher humide', 'boulder', 'rainforest-fern', 1.3, { color: '#6b8679' })
    ]
  });
}

const deepFreeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze); return Object.freeze(value);
};
export const TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 = deepFreeze(Object.fromEntries([
  lighthouseIsland(), teensiesForest(), vdnhGallery(), rainforestDistrict()
].map(field => [field.id, field])));

export const TACTICS_SOURCE_LOCATION_MATCHERS_WAVE17 = Object.freeze({
  bge_lighthouse_tactics: /lighthouse.*(?:island|landing)|(?:île|ile).*phare|phare.*(?:terrasse|débarcadère)/i,
  rayman_teensies_forest_tactics: /teensies.*(?:trouble|forest)|ptizêtres.*détresse|legends.*(?:enchanted|forêt|racines)/i,
  atomic_vdnh_gallery_tactics: /\bvdn[kh]{1,2}\b|exhibition.*(?:gallery|service)|galerie.*vdnh/i,
  zootopia_rainforest_tactics: /rain\s?forest.*(?:district|walkway)|district.*(?:pluvial|tropical)/i
});

