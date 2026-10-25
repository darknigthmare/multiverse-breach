// Original Nexus arenas. They exercise real multi-surface combat rather than
// claiming to reproduce the architecture or textures of a licensed location.
const surface = (id, x, y, z = 0, materialId = 'nexus-floor', extra = {}) => ({
  id, x, y, z, cornerZ: [z, z, z, z], materialId, layerId: z === 0 ? 'ground' : 'upper',
  shape: 'flat', type: 'normal', solidBottom: -1, walkable: true, ...extra
});
const ground = (cols, rows, materialId) => Array.from({ length: cols * rows }, (_, index) =>
  surface(`ground:${index % cols}:${Math.floor(index / cols)}`, index % cols, Math.floor(index / cols), 0, materialId)
);
const ref = (surfaceId, x, y) => ({ surfaceId, x, y });
const replace = (surfaces, replacement) => {
  const index = surfaces.findIndex(item => item.x === replacement.x && item.y === replacement.y && item.shape !== 'slab');
  if (index < 0) throw new Error(`No ground to replace at ${replacement.x},${replacement.y}`);
  surfaces.splice(index, 1, replacement);
};
const incline = (id, x, y, low, high, direction, materialId, shape = 'stairs') => {
  const corners = direction === 'east' ? [low, high, high, low]
    : direction === 'west' ? [high, low, low, high]
      : direction === 'north' ? [high, high, low, low] : [low, low, high, high];
  return surface(id, x, y, (low + high) / 2, materialId, {
    cornerZ: corners, layerId: 'access', shape, direction, stepCount: 4, moveCost: 2
  });
};
const barrier = (id, surfaceId, x, y, name, materialId, color = '#708aa2') => ({
  id, surfaceId, gridX: x, gridY: y, name, materialId, type: 'barrier',
  hp: 80, maxHp: 80, tacticsHeight: 1.35, color
});
const source = location => ({
  universe: 'Nexus de Convergence', work: 'Multiverse Breach, original tactical arenas',
  location, source1to1Verified: false, adaptation: 'Original gameplay geometry and material families; no official source location.'
});
const tilesFrom = surfaces => surfaces.filter(item => item.type !== 'normal').map(item => ({
  surfaceId: item.id, x: item.x, y: item.y, type: item.type, label: item.label
}));

function makeSkybridge() {
  const surfaces = ground(9, 7, 'nexus-floor');
  for (let x = 1; x <= 3; x++) replace(surfaces, incline(`stairs:${x}:3`, x, 3, x - 1, x, 'east', 'nexus-metal'));
  for (let x = 4; x <= 7; x++) surfaces.push(surface(`bridge:${x}:3`, x, 3, 3, 'nexus-metal', {
    shape: 'slab', layerId: 'bridge', solidBottom: 2.72, thickness: 0.28,
    type: x === 5 ? 'objective' : 'normal',
    coverEdges: { north: { height: 0.7, reduction: 0.2 }, south: { height: 0.7, reduction: 0.2 } }
  }));
  replace(surfaces, surface('ground:2:5', 2, 5, 0, 'nexus-floor', { type: 'heal' }));
  return {
    id: 'nexus_skybridge', formatVersion: 2, label: { fr: 'Nexus — pont et passage inférieur', en: 'Nexus — Skybridge and Underpass' },
    rows: 7, cols: 9, objective: 'control', objectiveTarget: 3,
    tags: ['vertical', 'highGround', 'lineOfSight', 'objective'], tileTheme: 'nexus',
    source: source('Skybridge training court'), surfaces, tiles: tilesFrom(surfaces),
    links: [
      { from: 'ground:0:3', to: 'stairs:1:3', kind: 'stairs', cost: 2 },
      { from: 'stairs:1:3', to: 'stairs:2:3', kind: 'stairs', cost: 2 },
      { from: 'stairs:2:3', to: 'stairs:3:3', kind: 'stairs', cost: 2 },
      { from: 'stairs:3:3', to: 'bridge:4:3', kind: 'stairs', cost: 1 }
    ],
    heroSpawns: [ref('ground:0:2', 0, 2), ref('ground:0:3', 0, 3), ref('ground:0:4', 0, 4)],
    monsterSpawns: [ref('bridge:6:3', 6, 3), ref('ground:7:2', 7, 2), ref('ground:7:4', 7, 4)],
    bossSpawns: [ref('ground:7:0', 7, 0), ref('ground:4:4', 4, 4)],
    worldBossSpawn: ref('ground:8:5', 8, 5),
    extractionZone: [ref('bridge:7:3', 7, 3)],
    pickupSpawns: [ref('ground:1:4', 1, 4), ref('ground:4:3', 4, 3), ref('bridge:4:3', 4, 3), ref('ground:6:4', 6, 4), ref('ground:3:5', 3, 5)],
    obstacles: [
      barrier('skybridge_conduit_n', 'ground:5:1', 5, 1, 'Nexus Conduit', 'nexus-metal', '#39c5bb'),
      barrier('skybridge_conduit_s', 'ground:6:6', 6, 6, 'Nexus Conduit', 'nexus-metal', '#39c5bb')
    ]
  };
}

function makeRuinedTerraces() {
  const surfaces = ground(9, 7, 'grass').filter(item => !((item.x === 3 || item.x === 4) && item.y === 0));
  for (let y = 1; y <= 4; y++) {
    for (let x = 4; x <= 7; x++) replace(surfaces, surface(`terrace:${x}:${y}`, x, y, 2, 'ancient-stone', {
      type: x === 5 && y === 2 ? 'objective' : 'normal', layerId: 'terrace',
      coverEdges: y === 1 ? { north: { height: 0.75, reduction: 0.2 } } : {}
    }));
  }
  replace(surfaces, incline('ramp:2:3', 2, 3, 0, 1, 'east', 'earth', 'ramp'));
  replace(surfaces, incline('ramp:3:3', 3, 3, 1, 2, 'east', 'weathered-stone', 'ramp'));
  replace(surfaces, incline('stairs:6:5', 6, 5, 0, 1, 'north', 'weathered-stone'));
  replace(surfaces, incline('stairs:6:4', 6, 4, 1, 2, 'north', 'weathered-stone'));
  return {
    id: 'ruined_terraces', formatVersion: 2, label: { fr: 'Nexus — terrasses des ruines', en: 'Nexus — Ruined Terraces' },
    rows: 7, cols: 9, objective: 'control', objectiveTarget: 3,
    tags: ['vertical', 'highGround', 'objective', 'loreArena'], tileTheme: 'stone',
    source: source('Ruined terrace training arena'), surfaces, tiles: tilesFrom(surfaces),
    links: [
      { from: 'ground:1:3', to: 'ramp:2:3', kind: 'ramp', cost: 2 },
      { from: 'ramp:2:3', to: 'ramp:3:3', kind: 'ramp', cost: 2 },
      { from: 'ramp:3:3', to: 'terrace:4:3', kind: 'ramp', cost: 1 },
      { from: 'ground:6:6', to: 'stairs:6:5', kind: 'stairs', cost: 2 },
      { from: 'stairs:6:5', to: 'stairs:6:4', kind: 'stairs', cost: 2 },
      { from: 'stairs:6:4', to: 'terrace:6:3', kind: 'stairs', cost: 1 }
    ],
    heroSpawns: [ref('ground:0:2', 0, 2), ref('ground:0:3', 0, 3), ref('ground:0:4', 0, 4)],
    monsterSpawns: [ref('terrace:7:3', 7, 3), ref('ground:4:6', 4, 6), ref('ground:1:1', 1, 1)],
    bossSpawns: [ref('terrace:4:1', 4, 1), ref('terrace:6:1', 6, 1)],
    worldBossSpawn: ref('ground:8:5', 8, 5),
    extractionZone: [ref('terrace:7:4', 7, 4)],
    pickupSpawns: [ref('ground:1:4', 1, 4), ref('terrace:4:3', 4, 3), ref('terrace:6:3', 6, 3), ref('ground:5:6', 5, 6), ref('ground:2:5', 2, 5)],
    obstacles: [
      barrier('terrace_pillar', 'terrace:4:4', 4, 4, 'Broken Stone Pillar', 'ancient-stone', '#8d7a58'),
      barrier('terrace_wall', 'ground:2:1', 2, 1, 'Ruined Wall', 'weathered-stone', '#8d7a58')
    ]
  };
}

function makeCyberCatwalks() {
  const surfaces = ground(10, 7, 'cyber-floor');
  for (let y = 3; y <= 5; y++) replace(surfaces, incline(`stairs:2:${y}`, 2, y, 5 - y, 6 - y, 'north', 'cyber-metal'));
  const upper = Array.from({ length: 7 }, (_, index) => ({ x: index + 2, y: 2 }));
  for (let y = 3; y <= 5; y++) upper.push({ x: 8, y });
  for (const { x, y } of upper) surfaces.push(surface(`catwalk:${x}:${y}`, x, y, 3, 'cyber-grate', {
    shape: 'slab', layerId: 'catwalk', solidBottom: 2.72, thickness: 0.28,
    coverEdges: y === 2 ? { north: { height: 0.65, reduction: 0.2 } } : { east: { height: 0.65, reduction: 0.2 } }
  }));
  replace(surfaces, surface('ground:5:3', 5, 3, 0, 'cyber-floor', { type: 'hazard' }));
  return {
    id: 'cyber_catwalks', formatVersion: 2, label: { fr: 'Nexus — passerelles du réseau', en: 'Nexus — Network Catwalks' },
    rows: 7, cols: 10, objective: 'extract', objectiveTarget: 2,
    tags: ['vertical', 'cyber', 'lineOfSight', 'hazard'], tileTheme: 'cyber',
    source: source('Network catwalk training chamber'), surfaces, tiles: tilesFrom(surfaces),
    links: [
      { from: 'ground:2:6', to: 'stairs:2:5', kind: 'stairs', cost: 2 },
      { from: 'stairs:2:5', to: 'stairs:2:4', kind: 'stairs', cost: 2 },
      { from: 'stairs:2:4', to: 'stairs:2:3', kind: 'stairs', cost: 2 },
      { from: 'stairs:2:3', to: 'catwalk:2:2', kind: 'stairs', cost: 1 }
    ],
    heroSpawns: [ref('ground:0:3', 0, 3), ref('ground:0:4', 0, 4), ref('ground:0:5', 0, 5)],
    monsterSpawns: [ref('catwalk:5:2', 5, 2), ref('catwalk:8:4', 8, 4), ref('ground:8:6', 8, 6)],
    bossSpawns: [ref('ground:7:0', 7, 0), ref('ground:4:3', 4, 3)],
    worldBossSpawn: ref('ground:6:6', 6, 6),
    extractionZone: [ref('catwalk:8:5', 8, 5), ref('catwalk:8:4', 8, 4)],
    pickupSpawns: [ref('ground:1:4', 1, 4), ref('ground:4:2', 4, 2), ref('catwalk:4:2', 4, 2), ref('ground:7:4', 7, 4), ref('catwalk:7:2', 7, 2)],
    obstacles: [
      barrier('network_server_n', 'ground:4:1', 4, 1, 'Network Server', 'cyber-metal', '#39c5bb'),
      barrier('network_server_s', 'ground:4:6', 4, 6, 'Network Server', 'cyber-metal', '#39c5bb')
    ]
  };
}

export const TACTICS_VERTICAL_BATTLEFIELDS = {
  nexus_skybridge: makeSkybridge(),
  ruined_terraces: makeRuinedTerraces(),
  cyber_catwalks: makeCyberCatwalks()
};
