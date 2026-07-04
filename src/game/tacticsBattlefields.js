import { EXPANDED_UNIVERSE_SIGNATURES } from './expandedUniverses';

const tile = (x, y, type, label = null) => ({ x, y, type, label });
const obstacle = (id, name, gridX, gridY, type = 'barrier', hp = 80, color = '#4a4e52') => ({
  id,
  name,
  hp,
  maxHp: hp,
  gridX,
  gridY,
  type,
  color
});

export const TACTICS_BATTLEFIELDS = {
  training_grid: {
    id: 'training_grid',
    label: { fr: 'Grille d instruction Nexus', en: 'Nexus Drill Grid' },
    objective: 'rout',
    objectiveTarget: 1,
    rows: 5,
    cols: 8,
    tags: ['starter', 'balanced'],
    tiles: [],
    heroSpawns: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    monsterSpawns: [{ x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }],
    bossSpawns: [{ x: 6, y: 1 }, { x: 6, y: 3 }],
    worldBossSpawn: { x: 7, y: 2 },
    obstacles: [
      obstacle('nexus_cover_a', 'A.R.C.A. Cover', 4, 1),
      obstacle('nexus_cover_b', 'A.R.C.A. Cover', 4, 3),
      obstacle('nexus_barrel_a', 'Nexus Conduit', 3, 2, 'barrel', 30, '#39c5bb'),
      obstacle('nexus_barrel_b', 'Nexus Conduit', 4, 2, 'barrel', 30, '#39c5bb')
    ]
  },
  urban_crossfire: {
    id: 'urban_crossfire',
    label: { fr: 'Carrefour sous tirs croises', en: 'Urban Crossfire' },
    objective: 'extract',
    objectiveTarget: 2,
    extractionZone: [{ x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }],
    rows: 6,
    cols: 8,
    tags: ['coverHeavy', 'lineOfSight'],
    tiles: [
      tile(2, 1, 'lightCover'), tile(3, 1, 'high'),
      tile(5, 2, 'heavyCover'), tile(6, 4, 'lightCover'),
      tile(1, 4, 'high')
    ],
    heroSpawns: [{ x: 0, y: 2 }, { x: 1, y: 3 }, { x: 0, y: 4 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 6, y: 3 }, { x: 5, y: 4 }],
    bossSpawns: [{ x: 7, y: 2 }, { x: 7, y: 4 }],
    worldBossSpawn: { x: 7, y: 3 },
    obstacles: [
      obstacle('urban_van', 'Rupture Van', 4, 2, 'barrier', 90, '#59656f'),
      obstacle('urban_kiosk', 'Signal Kiosk', 2, 4, 'barrier', 70, '#4fd7ff'),
      obstacle('urban_fuel', 'Fuel Cell', 5, 3, 'barrel', 35, '#ff9f43')
    ]
  },
  facility_lockdown: {
    id: 'facility_lockdown',
    label: { fr: 'Confinement de complexe', en: 'Facility Lockdown' },
    objective: 'disable',
    objectiveTarget: 2,
    rows: 5,
    cols: 9,
    tags: ['hazard', 'lineOfSight'],
    tiles: [
      tile(3, 0, 'blocked'), tile(3, 1, 'blocked'), tile(3, 3, 'blocked'), tile(3, 4, 'blocked'),
      tile(5, 2, 'hazard'), tile(6, 2, 'hazard'),
      tile(1, 2, 'heal')
    ],
    heroSpawns: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 7, y: 2 }, { x: 6, y: 3 }],
    bossSpawns: [{ x: 8, y: 1 }, { x: 8, y: 3 }],
    worldBossSpawn: { x: 8, y: 2 },
    obstacles: [
      obstacle('lab_door_a', 'Blast Door', 4, 1, 'objective', 110, '#c8d3d8'),
      obstacle('lab_door_b', 'Blast Door', 4, 3, 'objective', 110, '#c8d3d8'),
      obstacle('lab_tank', 'Volatile Tank', 5, 1, 'barrel', 40, '#61ff59')
    ]
  },
  ruined_highground: {
    id: 'ruined_highground',
    label: { fr: 'Ruines a hauteur dominante', en: 'Ruined High Ground' },
    objective: 'control',
    objectiveTarget: 3,
    rows: 6,
    cols: 7,
    tags: ['vertical', 'highGround'],
    tiles: [
      tile(2, 1, 'high'), tile(3, 1, 'high'), tile(4, 1, 'high'),
      tile(3, 2, 'objective'), tile(1, 4, 'lightCover'), tile(5, 4, 'lightCover')
    ],
    heroSpawns: [{ x: 0, y: 3 }, { x: 1, y: 4 }, { x: 0, y: 5 }],
    monsterSpawns: [{ x: 5, y: 1 }, { x: 5, y: 3 }, { x: 4, y: 4 }],
    bossSpawns: [{ x: 6, y: 2 }, { x: 6, y: 4 }],
    worldBossSpawn: { x: 6, y: 3 },
    obstacles: [
      obstacle('ruin_pillar_a', 'Broken Pillar', 2, 3, 'barrier', 85, '#8d7a58'),
      obstacle('ruin_pillar_b', 'Broken Pillar', 4, 3, 'barrier', 85, '#8d7a58')
    ]
  },
  war_frontline: {
    id: 'war_frontline',
    label: { fr: 'Ligne de front tactique', en: 'Tactical Frontline' },
    objective: 'commander',
    objectiveTarget: 2,
    rows: 6,
    cols: 9,
    tags: ['wide', 'coverHeavy', 'war'],
    tiles: [
      tile(2, 2, 'heavyCover'), tile(3, 2, 'lightCover'), tile(5, 2, 'lightCover'), tile(6, 2, 'heavyCover'),
      tile(4, 3, 'hazard'), tile(4, 4, 'hazard')
    ],
    heroSpawns: [{ x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 4 }],
    monsterSpawns: [{ x: 7, y: 1 }, { x: 7, y: 3 }, { x: 7, y: 5 }],
    bossSpawns: [{ x: 8, y: 2 }, { x: 8, y: 4 }],
    worldBossSpawn: { x: 8, y: 3 },
    obstacles: [
      obstacle('front_bunker_a', 'Field Bunker', 3, 1, 'barrier', 120, '#58616a'),
      obstacle('front_bunker_b', 'Field Bunker', 5, 4, 'barrier', 120, '#58616a'),
      obstacle('front_shell', 'Unstable Shell', 4, 2, 'barrel', 45, '#ff9f43')
    ]
  },
  horror_chokepoint: {
    id: 'horror_chokepoint',
    label: { fr: 'Goulet de cauchemar', en: 'Nightmare Chokepoint' },
    objective: 'survive',
    objectiveTarget: 14,
    rows: 5,
    cols: 7,
    tags: ['horror', 'chokepoint', 'hazard'],
    tiles: [
      tile(2, 0, 'blocked'), tile(2, 4, 'blocked'), tile(3, 2, 'hazard'), tile(4, 2, 'hazard')
    ],
    heroSpawns: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    monsterSpawns: [{ x: 4, y: 1 }, { x: 5, y: 2 }, { x: 4, y: 3 }],
    bossSpawns: [{ x: 6, y: 1 }, { x: 6, y: 3 }],
    worldBossSpawn: { x: 6, y: 2 },
    obstacles: [
      obstacle('horror_door', 'Sealed Door', 3, 1, 'barrier', 100, '#7a241f'),
      obstacle('horror_radio', 'Static Beacon', 3, 3, 'barrel', 35, '#b9b09d')
    ]
  },
  cyber_vertical_node: {
    id: 'cyber_vertical_node',
    label: { fr: 'Noeud vertical cyber', en: 'Cyber Vertical Node' },
    objective: 'extract',
    objectiveTarget: 2,
    extractionZone: [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }],
    rows: 6,
    cols: 8,
    tags: ['vertical', 'lineOfSight', 'cyber'],
    tiles: [
      tile(2, 1, 'high'), tile(3, 1, 'high'), tile(4, 1, 'high'),
      tile(3, 3, 'high'), tile(5, 4, 'lightCover'), tile(1, 4, 'heal')
    ],
    heroSpawns: [{ x: 0, y: 3 }, { x: 1, y: 4 }, { x: 0, y: 5 }],
    monsterSpawns: [{ x: 5, y: 1 }, { x: 6, y: 3 }, { x: 5, y: 4 }],
    bossSpawns: [{ x: 7, y: 1 }, { x: 7, y: 4 }],
    worldBossSpawn: { x: 7, y: 2 },
    obstacles: [
      obstacle('cyber_node_a', 'Signal Firewall', 4, 2, 'barrier', 90, '#39c5bb'),
      obstacle('cyber_node_b', 'Glitch Battery', 2, 4, 'barrel', 35, '#00ff66')
    ]
  },
  boss_command_zone: {
    id: 'boss_command_zone',
    label: { fr: 'Zone de commandement boss', en: 'Boss Command Zone' },
    objective: 'control',
    objectiveTarget: 4,
    rows: 6,
    cols: 9,
    tags: ['bossArena', 'objective'],
    tiles: [
      tile(4, 2, 'objective'), tile(4, 3, 'objective'),
      tile(2, 1, 'lightCover'), tile(6, 1, 'lightCover'),
      tile(2, 4, 'lightCover'), tile(6, 4, 'lightCover')
    ],
    heroSpawns: [{ x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 4 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 6, y: 3 }, { x: 6, y: 5 }],
    bossSpawns: [{ x: 7, y: 2 }, { x: 7, y: 4 }],
    worldBossSpawn: { x: 8, y: 3 },
    obstacles: [
      obstacle('boss_cover_a', 'Command Cover', 3, 2, 'barrier', 95, '#8fb3ff'),
      obstacle('boss_cover_b', 'Command Cover', 5, 3, 'barrier', 95, '#8fb3ff')
    ]
  }
};

const getSignature = (universe) => EXPANDED_UNIVERSE_SIGNATURES[universe] || null;
const textIncludes = (text, terms) => terms.some(term => text.includes(term));
const difficultyRank = (difficulty = 'Medium') => ({
  Personal: 0,
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Fusion: 2,
  Trio: 2,
  'Very Hard': 3,
  Expert: 3
}[difficulty] ?? 1);

export function getTacticsMissionProfile(stage = {}, battlefield = null) {
  const rank = difficultyRank(stage.difficulty);
  const tags = battlefield?.tags || [];
  const hasHazards = tags.includes('hazard') || (battlefield?.tiles || []).some(cell => cell.type === 'hazard');
  const bossPressure = tags.includes('bossArena') || stage.worldBoss || stage.id === 38;
  if (stage.forceBaseArena || stage.dlcSuppressedArena || rank <= 0) {
    return {
      tier: 'initiation',
      label: { fr: 'Protocole lisible', en: 'Readable Protocol' },
      reinforcementEvery: 0,
      hazardPulseEvery: 0,
      hazardRadius: 0,
      pressure: 0
    };
  }
  if (rank === 1) {
    return {
      tier: 'field',
      label: { fr: 'Pression de terrain', en: 'Field Pressure' },
      reinforcementEvery: 0,
      hazardPulseEvery: hasHazards ? 8 : 0,
      hazardRadius: 0,
      pressure: 1
    };
  }
  if (rank === 2) {
    return {
      tier: 'escalation',
      label: { fr: 'Escalade A.R.C.A.', en: 'A.R.C.A. Escalation' },
      reinforcementEvery: bossPressure ? 5 : 7,
      hazardPulseEvery: hasHazards ? 6 : 0,
      hazardRadius: 0,
      pressure: 2
    };
  }
  return {
    tier: 'collapse',
    label: { fr: 'Effondrement tactique', en: 'Tactical Collapse' },
    reinforcementEvery: bossPressure ? 4 : 6,
    hazardPulseEvery: hasHazards ? 5 : 0,
    hazardRadius: 1,
    pressure: 3
  };
}

export function getTacticsBattlefield(stage = {}) {
  const universe = stage.universe || '';
  const signature = getSignature(universe);
  const text = [
    universe,
    stage.name,
    stage.bossName,
    signature?.faction,
    signature?.mediaType,
    signature?.theme,
    signature?.stageName
  ].filter(Boolean).join(' ').toLowerCase();

  if (stage.forceBaseArena || stage.dlcSuppressedArena) return TACTICS_BATTLEFIELDS.training_grid;
  if (stage.id === 38 || stage.worldBoss || /final|world boss|singularity/i.test(stage.difficulty || '')) return TACTICS_BATTLEFIELDS.boss_command_zone;
  if (textIncludes(text, ['halo', 'war', 'marine', 'trooper', 'front', 'battle', 'borderlands', 'stargate'])) return TACTICS_BATTLEFIELDS.war_frontline;
  if (textIncludes(text, ['lab', 'facility', 'infection', 'virus', 'biohazard', 'aperture', 'black mesa'])) return TACTICS_BATTLEFIELDS.facility_lockdown;
  if (textIncludes(text, ['silent hill', 'saw', 'horror', 'nightmare', 'curse', 'haunt', 'hell'])) return TACTICS_BATTLEFIELDS.horror_chokepoint;
  if (textIncludes(text, ['cyber', 'matrix', 'ghost in the shell', 'digital', 'network', 'gunnm'])) return TACTICS_BATTLEFIELDS.cyber_vertical_node;
  if (textIncludes(text, ['magic', 'arcane', 'ruin', 'castle', 'dungeon', 'academy', 'discworld'])) return TACTICS_BATTLEFIELDS.ruined_highground;
  if (textIncludes(text, ['city', 'gotham', 'office', 'urban', 'police', 'street'])) return TACTICS_BATTLEFIELDS.urban_crossfire;
  if (stage.difficulty === 'Very Hard' || stage.difficulty === 'Hard') return TACTICS_BATTLEFIELDS.boss_command_zone;
  return TACTICS_BATTLEFIELDS.training_grid;
}

export function getTacticsPickupPositions(stage = {}) {
  const field = getTacticsBattlefield(stage);
  const safeTiles = [];
  for (let y = 0; y < field.rows; y++) {
    for (let x = 0; x < field.cols; x++) {
      const key = `${x},${y}`;
      const blocked = field.tiles.some(cell => cell.x === x && cell.y === y && cell.type === 'blocked');
      const occupied = [
        ...(field.heroSpawns || []),
        ...(field.monsterSpawns || []),
        ...(field.bossSpawns || []),
        field.worldBossSpawn
      ].filter(Boolean).some(pos => pos.x === x && pos.y === y);
      const hasObstacle = (field.obstacles || []).some(item => item.gridX === x && item.gridY === y);
      if (!blocked && !occupied && !hasObstacle) safeTiles.push({ key, gridX: x, gridY: y });
    }
  }
  const preferred = [
    safeTiles.find(cell => cell.gridX <= 2 && cell.gridY === 2),
    safeTiles.find(cell => cell.gridX <= 3 && cell.gridY >= 2),
    safeTiles.find(cell => cell.gridX >= 3 && cell.gridX <= 5),
    safeTiles.find(cell => cell.gridX >= Math.floor(field.cols / 2)),
    safeTiles.find(cell => cell.gridX >= field.cols - 3)
  ].filter(Boolean);
  return [...preferred, ...safeTiles].filter((cell, index, list) => list.findIndex(other => other.key === cell.key) === index).slice(0, 5);
}
