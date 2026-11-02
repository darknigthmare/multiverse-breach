// Wave 15 dedicated sectors. Historical Wave 14 definitions remain immutable.
// They do not reuse another engine's level geometry or its painted backdrop.
// Scale, routes and mission devices are gameplay adaptations, never a claim
// that the official location has this exact grid or these A.R.C.A. objectives.
const corners = z => [z, z, z, z];
const localized = (fr, en) => ({ fr, en });

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
  const surfaces = [...board.surfaces.values(), ...board.extras];
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

function dollet() {
  const b = makeBoard('ff8_dollet_tactics', 14, 12, 'dollet-cobble');
  b.patch(4, 2, 8, 3, 2, 'dollet-plaster');
  b.patch(5, 8, 8, 9, 2, 'dollet-plaster');
  b.slope(2, 3, 0, 1, 'east', 'dollet-cobble'); b.slope(3, 3, 1, 2, 'east', 'dollet-cobble');
  b.slope(9, 3, 2, 1, 'east', 'dollet-cobble'); b.slope(10, 3, 1, 0, 'east', 'dollet-cobble');
  b.slope(6, 10, 1, 2, 'north', 'dollet-cobble'); b.slope(6, 11, 0, 1, 'north', 'dollet-cobble');
  for (let y = 4; y <= 7; y++) b.bridge(6, y, 2, 'dollet-plaster', { coverEdges: {} });
  b.put(6, 6, 0, 'dollet-cobble', { type: 'objective', label: 'Poste de la rue basse' });
  const upper = b.extras.find(surface => surface.x === 6 && surface.y === 6);
  Object.assign(upper, { type: 'objective', label: 'Poste de la coursive' });
  b.patch(4, 4, 4, 5, 3.5, 'dollet-plaster', { walkable: false, type: 'blocked' });
  b.patch(8, 4, 8, 5, 3.5, 'dollet-plaster', { walkable: false, type: 'blocked' });
  return finish(b, {
    label: localized('FFVIII — Dollet, rue et coursives', 'FFVIII — Dollet Street and Galleries'),
    objective: 'control', objectiveTarget: 3, tileTheme: 'dollet',
    tags: ['vertical', 'city', 'street', 'overpass', 'lineOfSight', 'objective'],
    source: source('Final Fantasy VIII', 'Final Fantasy VIII (1999)', 'Original PlayStation game; SeeD field examination in Dollet', 'Dollet — coastal town streets and pale stone balconies', 'https://finalfantasy.fandom.com/wiki/Dollet'),
    tacticsPresentation: nature('dollet-coast', 'clear', 'dollet-roofs', 'Dollet pale coastal façades, terracotta roofs and distant sea'),
    scenario: {
      fr: 'Tenir deux postes à la même coordonnée mais sur deux étages ; la rue passe réellement sous la coursive.',
      en: 'Hold two posts at the same coordinates on separate storeys; the street physically passes below the gallery.',
      features: ['stacked-control-posts', 'north-terrace', 'southern-stairs', 'opaque-building-volumes']
    },
    extractionZone: [b.ref(11, 5)],
    pickupSpawns: [b.ref(1, 8), b.ref(5, 3), b.ref(6, 5), b.ref(6, 5, 'bridge'), b.ref(9, 8)],
    obstacles: [
      scenery(b, 'lamp', 3, 8, 'Réverbère de Dollet', 'dollet-lamppost', 'dollet-cobble', 2.7, { color: '#5d625e' }),
      scenery(b, 'street-crate', 8, 7, 'Caisse de la rue', 'wooden-crate', 'wood', 1.1),
      scenery(b, 'parapet', 8, 2, 'Parapet de la terrasse', 'ruin-wall', 'dollet-plaster', 1.2, { color: '#c7b99d' })
    ]
  });
}

function spencerCourtyard() {
  const b = makeBoard('re_spencer_courtyard_tactics', 14, 12, 'spencer-limestone');
  b.patch(4, 1, 8, 2, 2, 'spencer-marble');
  b.patch(5, 9, 8, 9, 2, 'spencer-marble');
  b.patch(5, 4, 7, 7, -0.5, 'water', { walkable: false, opaque: false, solidBottom: -0.7 });
  b.slope(2, 2, 0, 1, 'east', 'spencer-limestone'); b.slope(3, 2, 1, 2, 'east', 'spencer-limestone');
  b.slope(3, 9, 0, 1, 'east', 'spencer-limestone'); b.slope(4, 9, 1, 2, 'east', 'spencer-limestone');
  for (let y = 3; y <= 8; y++) b.bridge(6, y, 2, 'spencer-marble', { coverEdges: {} });
  b.put(6, 2, 2, 'spencer-marble', { type: 'artifact', label: 'Repère A.R.C.A. du balcon' });
  b.put(8, 10, 0, 'spencer-limestone', { type: 'artifact', label: 'Repère A.R.C.A. de la cour' });
  return finish(b, {
    label: localized('Resident Evil — manoir Spencer, cour et balcon', 'Resident Evil — Spencer Courtyard and Balcony'),
    objective: 'artifact', objectiveTarget: 2, tileTheme: 'spencer',
    tags: ['vertical', 'ruins', 'courtyard', 'pool', 'overpass', 'artifact'],
    source: source('Resident Evil', 'Resident Evil (1996)', 'Original 1996 Spencer Mansion estate; exterior courtyard material language, before the estate destruction', 'Spencer Mansion — stone courtyard and elevated estate passage', 'https://residentevil.fandom.com/wiki/Courtyard'),
    tacticsPresentation: nature('spencer-courtyard', 'mist', 'spencer-manor', 'Night woodland, pale mansion masonry and enclosed estate roofs'),
    scenario: {
      fr: 'Contourner le bassin impraticable ou rejoindre le passage haut ; le repère de la cour reste sous le niveau du balcon.',
      en: 'Go around the impassable basin or reach the upper passage; the courtyard marker remains below the balcony.',
      features: ['impassable-basin', 'two-altitude-recovery', 'northern-stairs', 'lower-stone-underpass']
    },
    extractionZone: [b.ref(11, 5)],
    pickupSpawns: [b.ref(1, 8), b.ref(5, 2), b.ref(6, 5, 'bridge'), b.ref(8, 8), b.ref(9, 10)],
    obstacles: [
      scenery(b, 'courtyard-statue', 3, 6, 'Statue de la cour', 'spencer-statue', 'spencer-marble', 2.1, { color: '#aaa99d' }),
      scenery(b, 'courtyard-wall', 8, 4, 'Muret du jardin clos', 'ruin-wall', 'spencer-limestone', 1.8, { color: '#827f70' }),
      scenery(b, 'estate-tree', 2, 8, 'Arbre du domaine', 'tree', 'wood', 3, { treeStyle: 'broadleaf', foliageColor: '#354b3b' })
    ]
  });
}

function redRockCanyon() {
  const b = makeBoard('fallout_red_rock_tactics', 16, 12, 'red-rock-sandstone');
  b.patch(4, 1, 8, 3, 3, 'red-rock-sandstone');
  for (let x = 1; x <= 3; x++) b.slope(x, 3, x - 1, x, 'east', 'red-rock-sandstone');
  for (let x = 9; x <= 11; x++) b.slope(x, 3, 12 - x, 11 - x, 'east', 'red-rock-sandstone');
  b.patch(5, 5, 8, 9, -1, 'earth', { moveCost: 2 });
  b.slope(4, 7, 0, -1, 'east', 'red-rock-sandstone'); b.slope(9, 7, -1, 0, 'east', 'red-rock-sandstone');
  b.bridge(6, 4, 3, 'red-rock-sandstone', { coverEdges: {} });
  b.put(10, 1, 4, 'red-rock-sandstone', { walkable: false, type: 'blocked' });
  b.put(4, 9, 2.5, 'red-rock-sandstone', { walkable: false, type: 'blocked' });
  return finish(b, {
    label: localized('Fallout — Red Rock Canyon, mesas et ravine', 'Fallout — Red Rock Canyon Mesas and Gully'),
    objective: 'extract', objectiveTarget: 2, tileTheme: 'red-rock',
    tags: ['vertical', 'desert', 'mountain', 'negativeElevation', 'naturalSlopes', 'extraction'],
    source: source('Fallout', 'Fallout: New Vegas (2010)', 'Mojave Wasteland, 2281; Red Rock Canyon sandstone environment', 'Red Rock Canyon — sandstone ledges and eroded wash', 'https://fallout.fandom.com/wiki/Red_Rock_Canyon'),
    tacticsPresentation: nature('red-rock-canyon', 'clear', 'canyon-camp', 'Mojave red sandstone buttes, dry scrub and a distant canvas camp'),
    scenario: {
      fr: 'Choisir les terrasses du canyon ou la ravine sèche plus lente ; deux unités doivent rejoindre la sortie à l’est.',
      en: 'Choose the canyon ledges or the slower dry wash; two units must reach the eastern exit.',
      features: ['three-level-mesa', 'below-zero-dry-wash', 'natural-stone-overhang', 'two-unit-extraction']
    },
    extractionZone: [b.ref(13, 5), b.ref(13, 6)],
    pickupSpawns: [b.ref(2, 7), b.ref(5, 3), b.ref(6, 4, 'bridge'), b.ref(7, 8), b.ref(11, 8)],
    obstacles: [
      scenery(b, 'mesa-boulder', 5, 2, 'Bloc de grès rouge', 'boulder', 'red-rock-sandstone', 1.8, { color: '#a26642' }),
      scenery(b, 'wash-boulder', 10, 8, 'Rocher du chenal sec', 'boulder', 'red-rock-sandstone', 1.5, { color: '#8f5b42' }),
      scenery(b, 'camp-crate', 11, 2, 'Caisse de campement', 'wooden-crate', 'wood', 1.1)
    ]
  });
}

function whiteForest() {
  const b = makeBoard('halflife_white_forest_tactics', 15, 12, 'white-forest-grass');
  b.patch(6, 0, 8, 11, -1, 'earth');
  b.patch(7, 0, 7, 11, -1, 'shallow-water', { walkable: false, opaque: false, solidBottom: -1.2 });
  for (const y of [2, 9]) {
    b.put(7, y, -1, 'shallow-water', { moveCost: 2, opaque: false });
    b.slope(5, y, 0, -1, 'east', 'earth'); b.slope(9, y, -1, 0, 'east', 'earth');
  }
  b.slope(4, 6, 0, 1, 'east', 'white-forest-concrete'); b.slope(5, 6, 1, 2, 'east', 'white-forest-concrete');
  for (let x = 6; x <= 8; x++) b.bridge(x, 6, 2, 'white-forest-concrete', { coverEdges: {} });
  b.slope(9, 6, 2, 1, 'east', 'white-forest-concrete'); b.slope(10, 6, 1, 0, 'east', 'white-forest-concrete');
  return finish(b, {
    label: localized('Half-Life — White Forest, gués et relais', 'Half-Life — White Forest Fords and Relays'),
    objective: 'disable', objectiveTarget: 2, tileTheme: 'white-forest',
    tags: ['vertical', 'forest', 'grassland', 'negativeElevation', 'weightedFords', 'objective'],
    source: source('Half-Life', 'Half-Life 2: Episode Two (2007)', 'Episode Two resistance forest region; abandoned industrial outpost approaches', 'White Forest — conifer valley, stream and service crossing', 'https://developer.valvesoftware.com/wiki/Half-Life_2:_Episode_Two'),
    tacticsPresentation: nature('white-forest', 'clear', 'resistance-outpost', 'White Forest conifers, distant Soviet industrial roofs and a communications mast'),
    scenario: {
      fr: 'Passer par deux gués ou par le pont de service puis neutraliser les deux relais A.R.C.A. de l’exercice.',
      en: 'Use either ford or the service bridge, then disable the two original A.R.C.A. exercise relays.',
      features: ['two-stream-fords', 'industrial-overpass', 'pine-cover', 'two-visible-relay-approaches']
    },
    extractionZone: [b.ref(12, 5)],
    pickupSpawns: [b.ref(2, 7), b.ref(5, 2), b.ref(7, 6, 'bridge'), b.ref(7, 9), b.ref(10, 8)],
    obstacles: [
      scenery(b, 'relay-n', 12, 3, 'Relais A.R.C.A. nord', 'radio-mast', 'white-forest-concrete', 2.6, { type: 'objective', hp: 110, maxHp: 110, color: '#798985' }),
      scenery(b, 'relay-s', 12, 8, 'Relais A.R.C.A. sud', 'radio-mast', 'white-forest-concrete', 2.6, { type: 'objective', hp: 110, maxHp: 110, color: '#798985' }),
      scenery(b, 'forest-pine', 3, 3, 'Pin de White Forest', 'tree', 'wood', 3.2, { treeStyle: 'conifer', foliageColor: '#3d5d43' }),
      scenery(b, 'forest-rock', 10, 4, 'Rocher de rive', 'boulder', 'weathered-stone', 1.3)
    ]
  });
}

const deepFreeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};
export const TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 = deepFreeze(Object.fromEntries([
  dollet(), spencerCourtyard(), redRockCanyon(), whiteForest()
].map(field => [field.id, field])));

export const TACTICS_SOURCE_LOCATION_MATCHERS_WAVE15 = Object.freeze({
  ff8_dollet_tactics: /\bdollet\b/i,
  re_spencer_courtyard_tactics: /spencer|manoir.*cour|mansion.*courtyard/i,
  fallout_red_rock_tactics: /red rock(?: canyon)?|canyon.*roche.*rouge/i,
  halflife_white_forest_tactics: /white forest|for[eê]t blanche/i
});

