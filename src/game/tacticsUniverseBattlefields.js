// Dedicated, authored Tactics sectors grounded in a named work and location.
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

function nibelCrags() {
  const b = makeBoard('ff7_mt_nibel_tactics', 14, 11, 'nibel-rock');
  for (const [x, y] of [[0, 0], [1, 0], [1, 1], [5, 0], [6, 0], [7, 0]]) b.remove(x, y);
  b.patch(6, 3, 8, 4, 3, 'nibel-rock');
  b.patch(8, 6, 9, 6, 3, 'mako-metal');
  for (let x = 3; x <= 5; x++) b.slope(x, 4, x - 3, x - 2, 'east');
  for (let y = 7; y <= 9; y++) b.slope(8, y, 9 - y, 10 - y, 'north');
  b.bridge(8, 5, 3, 'mako-metal');
  b.put(7, 4, 3, 'nibel-rock', { type: 'objective', label: 'Poste de crête' });
  b.put(6, 2, 4.5, 'nibel-rock', { walkable: false, type: 'blocked' });
  b.put(5, 6, 2.5, 'nibel-rock', { walkable: false, type: 'blocked' });
  b.put(7, 7, 0, 'nibel-rock', { moveCost: 2, type: 'lightCover' });
  return finish(b, {
    label: localized('FFVII — crêtes du mont Nibel', 'FFVII — Mt. Nibel Crags'),
    objective: 'control', objectiveTarget: 3, tileTheme: 'nibel',
    tags: ['vertical', 'mountain', 'naturalSlopes', 'highGround', 'lineOfSight', 'objective'],
    source: source('Final Fantasy VII', 'Final Fantasy VII (1997)', 'Original 1997 continuity, Mt. Nibel exterior', 'Mt. Nibel — rocky trails below the Nibel Reactor', 'https://finalfantasy.fandom.com/wiki/Mt._Nibel_(Final_Fantasy_VII)'),
    tacticsPresentation: nature('nibel-crags', 'mist', 'mako-industrial', 'Nibel mountain spires and distant reactor pipes'),
    scenario: {
      fr: 'Tenir une crête par le sentier ou le passage de maintenance ; le sol sous la passerelle reste une autre surface.',
      en: 'Hold the ridge using a natural trail or the maintenance approach; the underpass stays a separate surface.',
      features: ['two-ridge-approaches', 'rock-masses-block-sight', 'maintenance-overpass', 'lower-underpass']
    },
    extractionZone: [b.ref(9, 7)],
    pickupSpawns: [b.ref(1, 6), b.ref(4, 7), b.ref(7, 3), b.ref(8, 5), b.ref(8, 5, 'bridge')],
    obstacles: [
      scenery(b, 'rock-west', 2, 2, 'Bloc du mont Nibel', 'boulder', 'nibel-rock', 1.4),
      scenery(b, 'reactor-conduit', 9, 6, 'Conduite de maintenance', 'mako-conduit', 'mako-metal', 1.5)
    ]
  });
}

function archylteSteppe() {
  const b = makeBoard('ff13_archylte_steppe_tactics', 16, 11, 'steppe-grass');
  b.patch(6, 0, 8, 10, -1, 'earth');
  b.patch(7, 1, 7, 9, -1, 'shallow-water', { moveCost: 2, opaque: false });
  for (const y of [3, 7]) {
    b.slope(5, y, 0, -1, 'east', 'earth');
    b.slope(9, y, -1, 0, 'east', 'earth');
  }
  b.patch(10, 2, 11, 3, 2, 'alpine-rock');
  b.slope(10, 5, 0, 1, 'north', 'earth'); b.slope(10, 4, 1, 2, 'north', 'earth');
  b.patch(3, 8, 4, 9, 1, 'steppe-grass');
  b.slope(2, 8, 0, 1, 'east', 'earth');
  b.put(4, 8, 1, 'steppe-grass', { type: 'objective', label: 'Promontoire occidental' });
  b.put(11, 2, 2, 'alpine-rock', { type: 'objective', label: 'Promontoire oriental' });
  return finish(b, {
    label: localized('FFXIII — steppe d’Archylte, ravin et plateaux', 'FFXIII — Archylte Gully and Plateaus'),
    objective: 'control', objectiveTarget: 4, tileTheme: 'grass',
    tags: ['vertical', 'grassland', 'negativeElevation', 'naturalSlopes', 'flanking', 'objective'],
    source: source('Final Fantasy XIII', 'Final Fantasy XIII (2009)', 'Gran Pulse, original game continuity', 'Archylte Steppe — eroded grassland and rocky knolls', 'https://finalfantasy.fandom.com/wiki/Archylte_Steppe_(Final_Fantasy_XIII)'),
    tacticsPresentation: nature('archylte', 'clear', 'none', 'Gran Pulse grasslands, immense distant stone formations'),
    scenario: {
      fr: 'Descendre dans le ravin ou prendre les deux gués, puis répartir l’escouade entre deux promontoires.',
      en: 'Descend into the gully or use either ford, then split the squad between two heights.',
      features: ['below-zero-gully', 'two-weighted-fords', 'two-control-heights', 'open-flanks']
    },
    extractionZone: [b.ref(13, 5)],
    pickupSpawns: [b.ref(2, 5), b.ref(4, 8), b.ref(7, 7), b.ref(10, 3), b.ref(11, 7)],
    obstacles: [
      scenery(b, 'stone-knoll-n', 4, 2, 'Affleurement de Gran Pulse', 'boulder', 'alpine-rock', 1.4),
      scenery(b, 'stone-knoll-s', 10, 8, 'Bloc érodé de la steppe', 'boulder', 'alpine-rock', 1.3)
    ]
  });
}

function vesperpool() {
  const b = makeBoard('ff15_vesperpool_tactics', 14, 12, 'meadow-grass');
  b.patch(5, 0, 8, 11, -0.5, 'shallow-water', { walkable: false, opaque: false, solidBottom: -0.65 });
  b.patch(5, 8, 8, 10, 0, 'shallow-water', { moveCost: 3, opaque: false, solidBottom: -0.3 });
  b.patch(3, 7, 4, 10, 0, 'swamp-mud', { moveCost: 2 });
  b.patch(9, 8, 10, 10, 0, 'swamp-mud', { moveCost: 2 });
  b.slope(3, 3, 0, 1, 'east', 'wood'); b.slope(4, 3, 1, 2, 'east', 'wood');
  for (let x = 5; x <= 8; x++) b.bridge(x, 3, 2, 'wood', { coverEdges: {} });
  b.slope(9, 3, 2, 1, 'east', 'wood'); b.slope(10, 3, 1, 0, 'east', 'wood');
  return finish(b, {
    label: localized('FFXV — marais du Vesper, gué et pontons', 'FFXV — Vesperpool Ford and Boardwalks'),
    objective: 'extract', objectiveTarget: 2, tileTheme: 'wetland',
    tags: ['vertical', 'wetland', 'weightedFords', 'narrowBridge', 'extraction'],
    source: source('Final Fantasy XV', 'Final Fantasy XV (2016)', 'Lucis before the ten-year time skip', 'The Vesperpool — wetland shore and wooden fishing approaches', 'https://finalfantasy.fandom.com/wiki/The_Vesperpool'),
    tacticsPresentation: nature('wetlands', 'mist', 'wooden-boardwalk', 'Vesperpool shallows, reeds and wooded wetland shore'),
    scenario: {
      fr: 'Choisir les pontons étroits surélevés ou le large gué boueux ; l’eau profonde n’est pas un sol praticable.',
      en: 'Choose the narrow raised boardwalk or the broad muddy ford; deep water is not a walkable floor.',
      features: ['deep-water-barrier', 'narrow-raised-boardwalk', 'wide-costly-ford', 'dry-extraction-bank']
    },
    extractionZone: [b.ref(11, 5), b.ref(11, 6)],
    pickupSpawns: [b.ref(2, 7), b.ref(4, 3), b.ref(6, 3, 'bridge'), b.ref(7, 9), b.ref(11, 8)],
    obstacles: [
      scenery(b, 'wetland-tree', 2, 2, 'Arbre de rive', 'tree', 'wood', 3.1, { treeStyle: 'broadleaf', foliageColor: '#435e45' }),
      scenery(b, 'fishing-crates', 11, 2, 'Caisses du ponton', 'wooden-crate', 'wood', 1.1)
    ]
  });
}

function caradhras() {
  const b = makeBoard('lotr_caradhras_tactics', 12, 12, 'snow', { moveCost: 2 });
  b.patch(2, 0, 8, 3, 4, 'snow', { walkable: false, type: 'blocked' });
  b.patch(2, 9, 8, 11, 5, 'alpine-rock', { walkable: false, type: 'blocked' });
  b.patch(4, 4, 6, 4, 2, 'snow');
  b.slope(2, 4, 0, 1, 'east', 'snow'); b.slope(3, 4, 1, 2, 'east', 'snow');
  b.slope(7, 4, 2, 1, 'east', 'snow'); b.slope(8, 4, 1, 0, 'east', 'snow');
  b.put(4, 5, 2.8, 'alpine-rock', { walkable: false, type: 'blocked' });
  b.put(7, 8, 2.5, 'snow', { walkable: false, type: 'blocked' });
  return finish(b, {
    label: localized('LOTR — Caradhras, col et corniche neigeuse', 'LOTR — Caradhras Pass and Snow Ledge'),
    objective: 'extract', objectiveTarget: 2, tileTheme: 'snow',
    tags: ['vertical', 'snow', 'mountainPass', 'naturalSlopes', 'lineOfSight', 'extraction'],
    source: source('The Lord of the Rings', 'The Lord of the Rings: The Fellowship of the Ring (2001, Peter Jackson)', 'The Fellowship approach to the Redhorn Pass before Moria', 'Caradhras — snowbound pass and sheltered ridge', 'https://lotr.fandom.com/wiki/Caradhras'),
    tacticsPresentation: nature('alpine', 'snow', 'none', 'Caradhras snow faces and the Redhorn Pass'),
    scenario: {
      fr: 'Traverser le col enneigé à deux unités de front ou gagner la corniche étroite pour contrôler la ligne de vue.',
      en: 'Cross the snow pass two units abreast or climb the narrow ledge to control sight.',
      features: ['snow-movement-cost', 'two-cell-pass', 'narrow-high-ledge', 'opaque-mountain-walls']
    },
    monsterSpawns: [b.ref(9, 3), b.ref(9, 5), b.ref(9, 9)],
    extractionZone: [b.ref(11, 5), b.ref(11, 6), b.ref(11, 7)],
    pickupSpawns: [b.ref(1, 7), b.ref(3, 6), b.ref(5, 4), b.ref(8, 6), b.ref(10, 8)],
    obstacles: [
      scenery(b, 'pass-boulder', 3, 8, 'Bloc de schiste enneigé', 'boulder', 'alpine-rock', 1.4),
      scenery(b, 'ridge-boulder', 6, 4, 'Affleurement de corniche', 'boulder', 'alpine-rock', 1.2)
    ]
  });
}

function ithilien() {
  const b = makeBoard('lotr_ithilien_tactics', 15, 11, 'pine-earth');
  b.patch(3, 2, 10, 3, 1, 'meadow-grass');
  b.patch(6, 4, 9, 6, -1, 'pine-earth');
  b.patch(6, 6, 9, 6, -1, 'shallow-water', { moveCost: 2, opaque: false });
  b.slope(5, 6, 0, -1, 'east', 'pine-earth'); b.slope(10, 6, -1, 0, 'east', 'pine-earth');
  b.slope(2, 3, 0, 1, 'east', 'pine-earth'); b.slope(11, 3, 1, 0, 'east', 'pine-earth');
  b.patch(6, 7, 8, 7, 1, 'meadow-grass');
  for (let y = 4; y <= 6; y++) b.bridge(7, y, 1, 'ancient-stone', { solidBottom: 0.72, coverEdges: {} });
  b.slope(7, 8, 0, 1, 'north', 'pine-earth');
  b.put(10, 2, 1, 'meadow-grass', { type: 'objective', label: 'Poste du versant boisé' });
  b.put(6, 7, 1, 'meadow-grass', { type: 'objective', label: 'Poste du ravin' });
  return finish(b, {
    label: localized('LOTR — Ithilien, sous-bois et ravin', 'LOTR — Ithilien Woodland and Ravine'),
    objective: 'control', objectiveTarget: 4, tileTheme: 'forest',
    tags: ['vertical', 'forest', 'ravine', 'negativeElevation', 'flanking', 'objective'],
    source: source('The Lord of the Rings', 'The Lord of the Rings: The Two Towers (2002, Peter Jackson)', 'Ithilien woodland during the Rangers of Gondor sequence', 'Ithilien — wooded banks and a reconnaissance ravine', 'https://lotr.fandom.com/wiki/Ithilien'),
    tacticsPresentation: nature('woodland', 'clear', 'gondorian-ruins', 'Ithilien broadleaf woodland and mossy Gondorian stonework'),
    scenario: {
      fr: 'Exploiter les arbres de couvert, le fond du ravin et ses deux berges ; tenir deux postes à des altitudes différentes.',
      en: 'Use tree cover, the ravine floor and both banks; hold posts at different elevations.',
      features: ['tree-cover', 'below-zero-stream', 'stone-overpass', 'two-separated-banks']
    },
    extractionZone: [b.ref(12, 7)],
    pickupSpawns: [b.ref(2, 6), b.ref(4, 3), b.ref(7, 6), b.ref(7, 5, 'bridge'), b.ref(8, 7)],
    obstacles: [
      scenery(b, 'tree-west', 3, 5, 'Chêne d’Ithilien', 'tree', 'wood', 3.1, { treeStyle: 'broadleaf', foliageColor: '#607749' }),
      scenery(b, 'tree-south', 5, 8, 'Arbre du sous-bois', 'tree', 'wood', 2.9, { treeStyle: 'broadleaf', foliageColor: '#6b8051' }),
      scenery(b, 'ruin-remnant', 9, 3, 'Muret gondorien moussu', 'ruin-wall', 'ancient-stone', 1.8)
    ]
  });
}

function darkrootGarden() {
  const b = makeBoard('darksouls_darkroot_tactics', 13, 12, 'darkroot-moss');
  b.patch(4, 3, 8, 7, 2, 'darkroot-stone');
  b.patch(5, 4, 7, 6, 0, 'darkroot-moss');
  b.slope(2, 5, 0, 1, 'east', 'darkroot-stone'); b.slope(3, 5, 1, 2, 'east', 'darkroot-stone');
  b.slope(6, 4, 1, 2, 'north', 'darkroot-stone'); b.slope(6, 5, 0, 1, 'north', 'darkroot-stone');
  b.slope(9, 5, 2, 1, 'east', 'darkroot-stone'); b.slope(10, 5, 1, 0, 'east', 'darkroot-stone');
  b.put(5, 4, 0, 'darkroot-moss', { type: 'artifact', label: 'Repère de reconnaissance A.R.C.A.' });
  b.put(8, 3, 2, 'darkroot-stone', { type: 'artifact', label: 'Repère de reconnaissance A.R.C.A.' });
  return finish(b, {
    label: localized('Dark Souls — Noiresouche, cour encaissée', 'Dark Souls — Darkroot Sunken Courtyard'),
    objective: 'artifact', objectiveTarget: 2, tileTheme: 'dark-forest',
    tags: ['vertical', 'forest', 'ruins', 'sunkenCourtyard', 'lineOfSight', 'artifact'],
    source: source('Dark Souls', 'Dark Souls (2011)', 'Original Lordran continuity, Darkroot Garden exterior', 'Darkroot Garden — overgrown stone terraces and woodland courtyard', 'https://darksouls.fandom.com/wiki/Darkroot_Garden'),
    tacticsPresentation: nature('enchanted-forest', 'mist', 'old-stone', 'Darkroot old-growth forest, roots and overgrown stone arches'),
    scenario: {
      fr: 'Descendre dans la cour puis remonter aux remparts moussus ; les deux repères A.R.C.A. sont des objectifs originaux du crossover.',
      en: 'Descend into the courtyard and return to the mossy rim; both A.R.C.A. markers are original crossover objectives.',
      features: ['sunken-courtyard', 'perimeter-loop', 'inner-access-slope', 'two-altitude-recovery']
    },
    monsterSpawns: [b.ref(10, 4), b.ref(10, 6), b.ref(10, 8)],
    extractionZone: [b.ref(10, 7)],
    pickupSpawns: [b.ref(1, 7), b.ref(4, 6), b.ref(6, 6), b.ref(7, 3), b.ref(9, 8)],
    obstacles: [
      scenery(b, 'old-tree-west', 2, 2, 'Vieil arbre de Noiresouche', 'tree', 'wood', 3.5, { treeStyle: 'old-forest', foliageColor: '#324d42' }),
      scenery(b, 'old-tree-south', 3, 9, 'Racines et tronc ancien', 'tree', 'wood', 3.2, { treeStyle: 'old-forest', foliageColor: '#36594b' }),
      scenery(b, 'ruin-wall-n', 4, 4, 'Pan de mur de la cour', 'ruin-wall', 'darkroot-stone', 2.1),
      scenery(b, 'ruin-wall-s', 8, 6, 'Pan de mur moussu', 'ruin-wall', 'darkroot-stone', 1.8)
    ]
  });
}

function therum() {
  const b = makeBoard('masseffect_therum_tactics', 16, 10, 'basalt');
  b.patch(6, 0, 8, 9, -0.5, 'lava', { type: 'hazard', walkable: false, opaque: false, solidBottom: -0.7 });
  b.patch(6, 2, 8, 2, 1, 'basalt');
  b.slope(5, 2, 0, 1, 'east', 'basalt'); b.slope(9, 2, 1, 0, 'east', 'basalt');
  b.slope(4, 7, 0, 1, 'east', 'prothean-concrete'); b.slope(5, 7, 1, 2, 'east', 'prothean-concrete');
  for (let x = 6; x <= 8; x++) b.bridge(x, 7, 2, 'prothean-concrete', { coverEdges: { north: { height: 0.7, reduction: 0.2 }, south: { height: 0.7, reduction: 0.2 } } });
  b.slope(9, 7, 2, 1, 'east', 'prothean-concrete'); b.slope(10, 7, 1, 0, 'east', 'prothean-concrete');
  b.put(5, 4, 0, 'basalt', { type: 'hazard', moveCost: 2, label: 'Bord surchauffé' });
  b.put(9, 8, 0, 'basalt', { type: 'hazard', moveCost: 2, label: 'Bord surchauffé' });
  return finish(b, {
    label: localized('Mass Effect — Therum, faille et chantier', 'Mass Effect — Therum Fissure and Excavation'),
    objective: 'disable', objectiveTarget: 2, tileTheme: 'volcanic',
    tags: ['vertical', 'volcanic', 'hazard', 'twoCrossings', 'lineOfSight', 'objective'],
    source: source('Mass Effect', 'Mass Effect (2007)', '2183, Therum archaeological mining facility approach', 'Therum — volcanic approach to the Prothean excavation', 'https://masseffect.fandom.com/wiki/Therum'),
    tacticsPresentation: nature('volcanic', 'embers', 'prothean-industrial', 'Therum basalt ridges, molten channels and excavation structures'),
    scenario: {
      fr: 'Traverser par l’îlot basaltique ou la passerelle de chantier, puis neutraliser deux relais de mission ; la lave reste infranchissable.',
      en: 'Cross the basalt island or the excavation catwalk, then disable two mission relays; lava remains impassable.',
      features: ['impassable-lava', 'natural-island-crossing', 'industrial-upper-crossing', 'heat-rims', 'two-relay-targets']
    },
    extractionZone: [b.ref(13, 5)],
    pickupSpawns: [b.ref(2, 6), b.ref(5, 2), b.ref(7, 2), b.ref(7, 7, 'bridge'), b.ref(11, 8)],
    obstacles: [
      scenery(b, 'relay-n', 12, 2, 'Relais de chantier nord', 'prothean-generator', 'prothean-concrete', 2.1, { type: 'objective', hp: 110, maxHp: 110 }),
      scenery(b, 'relay-s', 12, 7, 'Relais de chantier sud', 'prothean-generator', 'prothean-concrete', 2.1, { type: 'objective', hp: 110, maxHp: 110 }),
      scenery(b, 'basalt-block', 10, 4, 'Bloc basaltique', 'boulder', 'basalt', 1.4)
    ]
  });
}

function valhalla() {
  const b = makeBoard('halo_valhalla_tactics', 16, 12, 'halo-grass');
  b.patch(3, 0, 11, 2, 2, 'halo-grass');
  b.patch(3, 9, 10, 11, 1.5, 'halo-grass');
  b.slope(2, 2, 0, 1, 'east', 'halo-grass'); b.slope(3, 2, 1, 2, 'east', 'halo-grass');
  b.slope(2, 9, 0, 0.75, 'east', 'halo-grass'); b.slope(3, 9, 0.75, 1.5, 'east', 'halo-grass');
  for (let y = 0; y < b.rows; y++) {
    const x = 7 + Math.floor(y / 4);
    b.put(x, y, -0.5, 'shallow-water', { moveCost: 2, opaque: false, solidBottom: -0.8 });
  }
  b.patch(9, 2, 11, 3, 2.5, 'forerunner-alloy');
  b.slope(9, 6, 0, 0.75, 'north', 'halo-grass');
  b.slope(9, 5, 0.75, 1.5, 'north', 'halo-grass');
  b.slope(9, 4, 1.5, 2.5, 'north', 'forerunner-alloy');
  b.put(10, 2, 2.5, 'forerunner-alloy', { type: 'objective', label: 'Poste de crête' });
  b.put(5, 8, 0, 'halo-grass', { type: 'objective', label: 'Poste de rive' });
  return finish(b, {
    label: localized('Halo 3 — Valhalla, rive et crête latérale', 'Halo 3 — Valhalla Riverbank and Side Ridge'),
    objective: 'control', objectiveTarget: 4, tileTheme: 'grass',
    tags: ['vertical', 'grassland', 'river', 'naturalSlopes', 'highGround', 'objective'],
    source: source('Halo', 'Halo 3 (2007)', 'Halo 3 Valhalla environment, original multiplayer-era art direction', 'Valhalla — dedicated riverbank sector below a Forerunner ridge', 'https://www.halopedia.org/Valhalla'),
    tacticsPresentation: nature('forerunner-valley', 'clear', 'forerunner', 'Valhalla conifer valley, rock walls and Forerunner geometry'),
    scenario: {
      fr: 'Passer par la rivière peu profonde ou gagner la crête forerunner ; ce secteur ne reproduit pas le plan multijoueur de Valhalla.',
      en: 'Use the shallow river or climb the Forerunner ridge; this sector does not reproduce Valhalla’s multiplayer layout.',
      features: ['shallow-river-cost', 'side-ridge-control', 'natural-rock-cover', 'two-altitude-control']
    },
    extractionZone: [b.ref(13, 6)],
    pickupSpawns: [b.ref(2, 6), b.ref(4, 2), b.ref(7, 3), b.ref(10, 3), b.ref(6, 9)],
    obstacles: [
      scenery(b, 'valley-boulder', 6, 4, 'Rocher du vallon', 'boulder', 'basalt', 1.4),
      scenery(b, 'river-boulder', 10, 8, 'Bloc de rive', 'boulder', 'basalt', 1.3),
      scenery(b, 'forerunner-pylon', 11, 3, 'Pylône forerunner', 'forerunner-pylon', 'forerunner-alloy', 3),
      scenery(b, 'conifer-west', 3, 6, 'Conifère du vallon', 'tree', 'wood', 3.3, { treeStyle: 'conifer', foliageColor: '#47634b' })
    ]
  });
}

const deepFreeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};
export const TACTICS_UNIVERSE_BATTLEFIELDS = deepFreeze(Object.fromEntries([
  nibelCrags(), archylteSteppe(), vesperpool(), caradhras(),
  ithilien(), darkrootGarden(), therum(), valhalla()
].map(field => [field.id, field])));
