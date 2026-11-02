// Wave 16 dedicated sectors. All earlier sector definitions remain immutable.
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

function inkwell() {
  const b = makeBoard('cuphead_inkwell_tactics', 16, 12, 'inkwell-grass');
  for (let y = 0; y < b.rows; y++) b.put(7, y, -.75, 'shallow-water', { walkable: false, opaque: false, solidBottom: -1 });
  for (const y of [3, 4, 9]) b.put(7, y, -.75, 'shallow-water', { opaque: false, moveCost: 2 });
  for (const y of [4, 9]) {
    b.slope(6, y, 0, -.75, 'east', 'inkwell-grass');
    b.slope(8, y, -.75, 0, 'east', 'inkwell-grass');
  }
  b.patch(3, 1, 6, 3, 1.5, 'inkwell-grass'); b.patch(8, 1, 10, 3, 1.5, 'inkwell-grass');
  b.slope(1, 3, 0, .75, 'east', 'inkwell-grass'); b.slope(2, 3, .75, 1.5, 'east', 'inkwell-grass');
  b.slope(11, 3, 1.5, .75, 'east', 'inkwell-grass'); b.slope(12, 3, .75, 0, 'east', 'inkwell-grass');
  b.bridge(7, 3, 1.5, 'inkwell-wood', { coverEdges: {} });
  Object.assign(b.get(7, 3), { type: 'artifact', label: 'Repère A.R.C.A. du gué' });
  Object.assign(b.extras[0], { type: 'artifact', label: 'Repère A.R.C.A. du pont' });
  return finish(b, {
    label: localized('Cuphead — Inkwell Isle One, ruisseau et pont', 'Cuphead — Inkwell Isle One Brook and Bridge'),
    objective: 'artifact', objectiveTarget: 2, tileTheme: 'inkwell',
    tags: ['vertical', 'cartoon', 'grassland', 'weightedFord', 'stackedRecovery'],
    source: source('Cuphead', 'Cuphead (2017)', 'Original Inkwell Isle One overworld, before The Delicious Last Course', 'Inkwell Isle One — grassy paths, brook banks and small wooden bridges', 'https://studiomdhr.com/cuphead/'),
    tacticsPresentation: nature('inkwell-cartoon', 'clear', 'inkwell-cottage', 'Inkwell Isle One grassy hills, white clouds and distant cottage'),
    scenario: { fr: 'Rejoindre deux repères du même ruisseau : un dans le gué lent et un sur le petit pont, sans traverser le plancher.', en: 'Reach two markers above the same brook: one in the slow ford and one on its bridge, without crossing through the deck.', features: ['stacked-recovery', 'two-bank-grass-terraces', 'south-ford', 'cartoon-wooden-bridge'] },
    extractionZone: [b.ref(13, 5)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 3), b.ref(7, 3, 'bridge'), b.ref(10, 9), b.ref(11, 4)],
    obstacles: [
      scenery(b, 'brook-tree', 2, 9, 'Arbre de la berge', 'tree', 'inkwell-wood', 2.7, { treeStyle: 'broadleaf', foliageColor: '#679744' }),
      scenery(b, 'rounded-stone', 4, 8, 'Pierre du sentier', 'boulder', 'weathered-stone', 1.1, { color: '#889286' }),
      scenery(b, 'milepost', 10, 7, 'Poteau du sentier', 'inkwell-milepost', 'inkwell-wood', 1.7, { color: '#b79460' })
    ]
  });
}

function reclamation() {
  const b = makeBoard('titanfall_reclamation_tactics', 16, 12, 'imc-deck');
  b.patch(6, 0, 8, 11, -1.5, 'imc-grate');
  b.patch(4, 2, 5, 4, 2.5, 'imc-deck'); b.patch(9, 4, 11, 6, 2.5, 'imc-deck');
  for (const [x, low, high] of [[1, 0, 1], [2, 1, 2], [3, 2, 2.5]]) b.slope(x, 3, low, high, 'east', 'imc-grate');
  for (const [x, low, high] of [[12, 2.5, 1.5], [13, 1.5, .5], [14, .5, 0]]) b.slope(x, 5, low, high, 'east', 'imc-grate');
  for (let x = 6; x <= 8; x++) b.bridge(x, 4, 2.5, 'imc-grate', { coverEdges: {} });
  for (let y = 3; y <= 7; y++) if (y !== 4) b.bridge(8, y, 2.5, 'imc-grate', { coverEdges: {} });
  b.slope(4, 9, 0, -.75, 'east', 'imc-grate'); b.slope(5, 9, -.75, -1.5, 'east', 'imc-grate');
  b.slope(9, 9, -1.5, -.75, 'east', 'imc-grate'); b.slope(10, 9, -.75, 0, 'east', 'imc-grate');
  b.slope(5, 8, 0, 1, 'east', 'imc-grate'); b.slope(9, 8, 1, 0, 'east', 'imc-grate');
  for (let x = 6; x <= 8; x++) b.bridge(x, 8, 1, 'imc-deck', { coverEdges: {} });
  return finish(b, {
    label: localized('Titanfall 2 — Into the Abyss, usine World Foundry', 'Titanfall 2 — Into the Abyss, World Foundry Assembly'),
    objective: 'disable', objectiveTarget: 2, tileTheme: 'imc-foundry',
    tags: ['vertical', 'industrial', 'catwalks', 'negativeElevation', 'headroom', 'objective'],
    source: source('Titanfall 2', 'Titanfall 2 (2016)', 'Campaign mission Into the Abyss; IMC World Foundry fabrication complex', 'IMC World Foundry — service floor, assembly trench and industrial catwalks', 'https://www.ea.com/games/titanfall/titanfall-2'),
    tacticsPresentation: nature('imc-foundry', 'clear', 'imc-assembly', 'World Foundry fabrication gantries, service lamps and distant structural frames'),
    scenario: { fr: 'Neutraliser un relais sur la passerelle et un dans la fosse ; le passage inférieur bas refuse les unités trop hautes.', en: 'Disable one relay on the catwalk and one in the trench; the low underpass excludes units without enough headroom.', features: ['two-deck-catwalks', 'lower-assembly-trench', 'human-only-low-underpass', 'two-relay-levels'] },
    monsterSpawns: [b.ref(12, 7), b.ref(12, 8), b.ref(12, 9)],
    extractionZone: [b.ref(13, 7)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 3), b.ref(8, 4, 'bridge'), b.ref(7, 8), b.ref(11, 8)],
    obstacles: [
      scenery(b, 'upper-relay', 10, 4, 'Relais A.R.C.A. de la passerelle', 'imc-service-pylon', 'imc-deck', 1.9, { type: 'objective', hp: 110, maxHp: 110, color: '#a9b9ba' }),
      scenery(b, 'trench-relay', 7, 10, 'Relais A.R.C.A. de la fosse', 'imc-service-pylon', 'imc-deck', 1.9, { type: 'objective', hp: 110, maxHp: 110, color: '#a9b9ba' }),
      scenery(b, 'machine-crate', 3, 7, 'Caisse de maintenance', 'wooden-crate', 'imc-deck', 1.2, { color: '#687b83' })
    ]
  });
}

function centralStation() {
  const b = makeBoard('fma_central_station_tactics', 14, 12, 'central-stone');
  b.patch(3, 6, 9, 7, -1, 'central-rail');
  b.patch(4, 2, 8, 3, 2, 'central-stone');
  b.slope(2, 3, 0, 1, 'east', 'central-stone'); b.slope(3, 3, 1, 2, 'east', 'central-stone');
  b.slope(9, 3, 2, 1, 'east', 'central-stone'); b.slope(10, 3, 1, 0, 'east', 'central-stone');
  for (let y = 4; y <= 8; y++) b.bridge(6, y, 2, 'central-stone', { coverEdges: {} });
  b.slope(6, 9, 1, 2, 'north', 'central-stone'); b.slope(6, 10, 0, 1, 'north', 'central-stone');
  b.slope(2, 6, 0, -1, 'east', 'central-rail'); b.slope(10, 7, -1, 0, 'east', 'central-rail');
  Object.assign(b.get(6, 6), { type: 'objective', label: 'Poste de la voie basse' });
  Object.assign(b.extras.find(s => s.x === 6 && s.y === 6), { type: 'objective', label: 'Poste du passage de gare' });
  return finish(b, {
    label: localized('Fullmetal Alchemist — Central, gare et voies basses', 'Fullmetal Alchemist — Central Station and Lower Tracks'),
    objective: 'control', objectiveTarget: 3, tileTheme: 'central-station',
    tags: ['vertical', 'city', 'railway', 'stairs', 'stackedControl', 'objective'],
    source: source('Fullmetal Alchemist', 'Fullmetal Alchemist: Brotherhood (2009)', 'Amestris, Central City railway district, before the Promised Day battle', 'Central City — stone station approach, raised concourse and rail cutting', 'https://www.fullmetalalchemistusa.com/'),
    tacticsPresentation: nature('central-railway', 'clear', 'amestrian-station', 'Central stone railway buildings, iron station canopy and distant city blocks'),
    scenario: { fr: 'Tenir les postes des deux niveaux du quartier ferroviaire ; escaliers et tranchée ne donnent pas la même ligne de vue.', en: 'Hold posts on both levels of the railway district; stairs and the cutting expose different sight lines.', features: ['stacked-railway-control', 'station-stone-stairs', 'sunken-rail-cutting', 'south-concourse-access'] },
    extractionZone: [b.ref(11, 5)],
    pickupSpawns: [b.ref(1, 8), b.ref(5, 3), b.ref(6, 6, 'bridge'), b.ref(7, 7), b.ref(10, 9)],
    obstacles: [
      scenery(b, 'station-clock', 3, 2, 'Horloge de la gare', 'central-station-clock', 'central-stone', 2.8, { color: '#c0b99f' }),
      scenery(b, 'station-pillar', 8, 2, 'Pilier du parvis', 'ruin-wall', 'central-stone', 1.7, { color: '#9b9a8e' }),
      scenery(b, 'street-lamp', 4, 9, 'Réverbère du quartier', 'dollet-lamppost', 'central-stone', 2.7, { color: '#6a706b' })
    ]
  });
}

function sadidaKingdom() {
  const b = makeBoard('wakfu_sadida_tactics', 15, 12, 'sadida-grass');
  b.patch(5, 4, 8, 9, -1, 'earth', { moveCost: 2 });
  b.patch(6, 5, 7, 8, -1.3, 'shallow-water', { walkable: false, opaque: false, solidBottom: -1.5 });
  b.patch(4, 2, 9, 3, 3, 'sadida-root'); b.patch(6, 10, 8, 11, 3, 'sadida-root');
  for (const [x, low, high] of [[1, 0, 1], [2, 1, 2], [3, 2, 3]]) b.slope(x, 3, low, high, 'east', 'sadida-root');
  for (const [x, low, high] of [[10, 3, 2], [11, 2, 1], [12, 1, 0]]) b.slope(x, 3, low, high, 'east', 'sadida-root');
  for (let y = 4; y <= 9; y++) b.bridge(7, y, 3, 'sadida-root', { coverEdges: {} });
  for (const [x, low, high] of [[3, 0, 1], [4, 1, 2], [5, 2, 3], [9, 3, 2], [10, 2, 1], [11, 1, 0]]) b.slope(x, 11, low, high, 'east', 'sadida-root');
  b.slope(4, 8, 0, -1, 'east', 'sadida-root'); b.slope(9, 8, -1, 0, 'east', 'sadida-root');
  return finish(b, {
    label: localized('Wakfu — royaume Sadida, saison 1, racines et canopée', 'Wakfu — Sadida Kingdom, Season 1, Roots and Canopy'),
    objective: 'extract', objectiveTarget: 2, tileTheme: 'sadida',
    tags: ['vertical', 'forest', 'roots', 'negativeElevation', 'canopy', 'extraction'],
    source: source('Wakfu', 'Wakfu animated series, Season 1 (2008–2010)', 'Sadida Kingdom during the Brotherhood first visit, before the battle with Nox', 'Sadida Kingdom — forest root terraces and canopy access', 'https://www.ankama.com/en/animations/wakfu'),
    tacticsPresentation: nature('sadida-canopy', 'clear', 'sadida-tree', 'Sadida forest canopy, great roots and broad green leaves, before the attack of Nox'),
    scenario: { fr: 'Évacuer deux unités par une sortie de canopée ou par le sentier bas ; les racines conduisent aux deux niveaux sans traverser les bassins.', en: 'Extract two units using the canopy exit or lower path; root ramps reach both levels without crossing the pools.', features: ['two-elevation-extraction', 'canopy-root-crossing', 'wet-forest-hollow', 'natural-root-ramps'] },
    extractionZone: [b.ref(7, 11), b.ref(12, 9)],
    pickupSpawns: [b.ref(1, 8), b.ref(4, 3), b.ref(7, 6, 'bridge'), b.ref(5, 9), b.ref(11, 9)],
    obstacles: [
      scenery(b, 'great-root', 10, 2, 'Contrefort racinaire', 'sadida-root-buttress', 'sadida-root', 3.2, { color: '#74694a' }),
      scenery(b, 'forest-tree', 2, 9, 'Arbre du royaume', 'tree', 'sadida-root', 3.3, { treeStyle: 'broadleaf', foliageColor: '#487e49' }),
      scenery(b, 'canopy-tree', 10, 6, 'Arbre de la clairière', 'tree', 'sadida-root', 3.8, { treeStyle: 'broadleaf', foliageColor: '#64974e' })
    ]
  });
}

const deepFreeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};
export const TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 = deepFreeze(Object.fromEntries([
  inkwell(), reclamation(), centralStation(), sadidaKingdom()
].map(field => [field.id, field])));

export const TACTICS_SOURCE_LOCATION_MATCHERS_WAVE16 = Object.freeze({
  cuphead_inkwell_tactics: /inkwell.*(?:isle|brook|pont)|(?:île|ile).*inkwell/i,
  titanfall_reclamation_tactics: /world foundry|into the abyss|(?:imc|titanfall).*fabrication|usine.*imc/i,
  fma_central_station_tactics: /central.*(?:station|gare|railway|ferroviaire)|amestris.*gare/i,
  wakfu_sadida_tactics: /sadida.*(?:kingdom|royaume|canop)|royaume.*sadida/i
});

