import { EXPANDED_UNIVERSE_SIGNATURES } from './expandedUniverses';
import { getRecentUniverseLevelProfile } from './recentUniverseLevels';

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
    tags: ['starter', 'balanced', 'defense'],
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
    tags: ['coverHeavy', 'lineOfSight', 'escort'],
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
    tags: ['hazard', 'lineOfSight', 'portalSpawn'],
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
    tags: ['vertical', 'highGround', 'artifact', 'loreArena'],
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
    tags: ['wide', 'coverHeavy', 'war', 'defense'],
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
    tags: ['horror', 'chokepoint', 'hazard', 'survival'],
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
    tags: ['vertical', 'lineOfSight', 'cyber', 'artifact'],
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
    tags: ['bossArena', 'objective', 'loreArena'],
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
  },
  artifact_bastion: {
    id: 'artifact_bastion',
    label: { fr: 'Bastion d artefact Nexus', en: 'Nexus Artifact Bastion' },
    objective: 'protect',
    objectiveTarget: 10,
    rows: 6,
    cols: 8,
    tags: ['defense', 'artifact', 'coverHeavy', 'loreArena'],
    tiles: [
      tile(3, 2, 'artifact', 'Origin Shard'),
      tile(3, 3, 'artifact', 'Origin Shard'),
      tile(2, 1, 'heavyCover'), tile(4, 1, 'heavyCover'),
      tile(2, 4, 'lightCover'), tile(5, 4, 'hazard')
    ],
    heroSpawns: [{ x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 4 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 6, y: 3 }, { x: 6, y: 5 }],
    bossSpawns: [{ x: 7, y: 2 }, { x: 7, y: 4 }],
    worldBossSpawn: { x: 7, y: 3 },
    obstacles: [
      obstacle('artifact_bulwark_a', 'Anchor Bulwark', 2, 2, 'barrier', 130, '#39c5bb'),
      obstacle('artifact_bulwark_b', 'Anchor Bulwark', 4, 3, 'barrier', 130, '#39c5bb')
    ]
  },
  portal_lockdown: {
    id: 'portal_lockdown',
    label: { fr: 'Verrouillage des portails', en: 'Portal Lockdown' },
    objective: 'portals',
    objectiveTarget: 3,
    rows: 5,
    cols: 9,
    tags: ['portalSpawn', 'hazard', 'lineOfSight'],
    tiles: [
      tile(6, 1, 'portalSpawn'), tile(7, 2, 'portalSpawn'), tile(6, 3, 'portalSpawn'),
      tile(4, 2, 'hazard'), tile(2, 1, 'lightCover'), tile(2, 3, 'lightCover')
    ],
    heroSpawns: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 7, y: 2 }, { x: 6, y: 3 }],
    bossSpawns: [{ x: 8, y: 1 }, { x: 8, y: 3 }],
    worldBossSpawn: { x: 8, y: 2 },
    obstacles: [
      obstacle('portal_relay_a', 'Rift Relay', 5, 1, 'objective', 85, '#b56dff'),
      obstacle('portal_relay_b', 'Rift Relay', 5, 3, 'objective', 85, '#b56dff')
    ]
  },
  nexus_escort_route: {
    id: 'nexus_escort_route',
    label: { fr: 'Route d escorte Nexus', en: 'Nexus Escort Route' },
    objective: 'escort',
    objectiveTarget: 1,
    extractionZone: [{ x: 8, y: 2 }, { x: 8, y: 3 }],
    escortSpawn: { x: 1, y: 2 },
    rows: 6,
    cols: 9,
    tags: ['escort', 'defense', 'lineOfSight'],
    tiles: [
      tile(2, 2, 'artifact'), tile(5, 2, 'lightCover'), tile(5, 3, 'lightCover'),
      tile(3, 1, 'blocked'), tile(3, 4, 'blocked'), tile(7, 2, 'heal')
    ],
    heroSpawns: [{ x: 0, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 4 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 6, y: 4 }, { x: 7, y: 3 }],
    bossSpawns: [{ x: 8, y: 1 }, { x: 8, y: 4 }],
    worldBossSpawn: { x: 8, y: 3 },
    obstacles: [
      obstacle('escort_cover_a', 'Escort Cover', 4, 2, 'barrier', 90, '#4fc3f7'),
      obstacle('escort_cover_b', 'Escort Cover', 4, 3, 'barrier', 90, '#4fc3f7')
    ]
  },
  boss_overload_zone: {
    id: 'boss_overload_zone',
    label: { fr: 'Surcharge de boss', en: 'Boss Overload Zone' },
    objective: 'overload',
    objectiveTarget: 8,
    rows: 6,
    cols: 9,
    tags: ['bossArena', 'hazard', 'wide', 'loreArena'],
    tiles: [
      tile(4, 2, 'hazard'), tile(4, 3, 'hazard'),
      tile(3, 1, 'high'), tile(5, 1, 'high'),
      tile(2, 4, 'lightCover'), tile(6, 4, 'lightCover')
    ],
    heroSpawns: [{ x: 0, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 4 }],
    monsterSpawns: [{ x: 6, y: 1 }, { x: 6, y: 5 }, { x: 7, y: 3 }],
    bossSpawns: [{ x: 7, y: 2 }, { x: 7, y: 4 }],
    worldBossSpawn: { x: 8, y: 3 },
    obstacles: [
      obstacle('overload_core_a', 'Overload Core', 4, 1, 'barrel', 45, '#ff5b5b'),
      obstacle('overload_core_b', 'Overload Core', 4, 4, 'barrel', 45, '#ff5b5b')
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
  const hasPortals = tags.includes('portalSpawn') || (battlefield?.tiles || []).some(cell => cell.type === 'portalSpawn');
  const bossPressure = tags.includes('bossArena') || stage.worldBoss || stage.finalGameBoss;
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
      reinforcementEvery: hasPortals ? 5 : bossPressure ? 5 : 7,
      hazardPulseEvery: hasHazards ? 6 : 0,
      hazardRadius: 0,
      pressure: 2
    };
  }
  return {
    tier: 'collapse',
    label: { fr: 'Effondrement tactique', en: 'Tactical Collapse' },
    reinforcementEvery: hasPortals ? 4 : bossPressure ? 4 : 6,
    hazardPulseEvery: hasHazards ? 5 : 0,
    hazardRadius: 1,
    pressure: 3
  };
}

export function getTacticsBattlefield(stage = {}) {
  const universe = stage.universe || '';
  const signature = getSignature(universe);
  const recentProfile = stage.forceBaseArena || stage.dlcSuppressedArena
    ? null
    : getRecentUniverseLevelProfile(universe);
  const missionText = [
    stage.name,
    stage.bossName,
    stage.difficulty
  ].filter(Boolean).join(' ').toLowerCase();
  const loreText = [
    universe,
    signature?.faction,
    signature?.mediaType,
    signature?.theme,
    signature?.stageName
  ].filter(Boolean).join(' ').toLowerCase();

  let battlefield = TACTICS_BATTLEFIELDS.training_grid;
  if (stage.forceBaseArena || stage.dlcSuppressedArena) battlefield = TACTICS_BATTLEFIELDS.training_grid;
  else if (stage.tacticsBattlefieldId && TACTICS_BATTLEFIELDS[stage.tacticsBattlefieldId]) battlefield = TACTICS_BATTLEFIELDS[stage.tacticsBattlefieldId];
  else if (stage.finalGameBoss || stage.worldBoss || /final|world boss|singularity/i.test(stage.difficulty || '')) battlefield = TACTICS_BATTLEFIELDS.boss_command_zone;
  else if (textIncludes(missionText, ['overload', 'surcharge', 'timer', 'core'])) battlefield = TACTICS_BATTLEFIELDS.boss_overload_zone;
  else if (textIncludes(missionText, ['escort', 'convoi', 'civilian', 'nexus agent'])) battlefield = TACTICS_BATTLEFIELDS.nexus_escort_route;
  else if (textIncludes(missionText, ['portal', 'rift', 'breach', 'faille'])) battlefield = TACTICS_BATTLEFIELDS.portal_lockdown;
  else if (textIncludes(missionText, ['artifact', 'artefact', 'relic', 'shard', 'origin'])) battlefield = TACTICS_BATTLEFIELDS.artifact_bastion;
  else if (recentProfile?.tactics?.battlefieldId) battlefield = TACTICS_BATTLEFIELDS[recentProfile.tactics.battlefieldId] || battlefield;
  else if (textIncludes(loreText, ['halo', 'war', 'marine', 'trooper', 'front', 'battle', 'borderlands', 'stargate'])) battlefield = TACTICS_BATTLEFIELDS.war_frontline;
  else if (textIncludes(loreText, ['lab', 'facility', 'infection', 'virus', 'biohazard', 'aperture', 'black mesa'])) battlefield = TACTICS_BATTLEFIELDS.facility_lockdown;
  else if (textIncludes(loreText, ['silent hill', 'saw', 'horror', 'nightmare', 'curse', 'haunt', 'hell'])) battlefield = TACTICS_BATTLEFIELDS.horror_chokepoint;
  else if (textIncludes(loreText, ['cyber', 'matrix', 'ghost in the shell', 'digital', 'network', 'gunnm'])) battlefield = TACTICS_BATTLEFIELDS.cyber_vertical_node;
  else if (textIncludes(loreText, ['magic', 'arcane', 'ruin', 'castle', 'dungeon', 'academy', 'discworld'])) battlefield = TACTICS_BATTLEFIELDS.ruined_highground;
  else if (textIncludes(loreText, ['city', 'gotham', 'office', 'urban', 'police', 'street'])) battlefield = TACTICS_BATTLEFIELDS.urban_crossfire;
  else if (stage.difficulty === 'Very Hard' || stage.difficulty === 'Hard') battlefield = TACTICS_BATTLEFIELDS.boss_command_zone;

  if (!recentProfile) return battlefield;
  return {
    ...battlefield,
    levelProfile: recentProfile.tactics,
    tileTheme: recentProfile.material,
    tileTexture: recentProfile.tactics.tileTexture
  };
}

export function getTacticsPickupPositions(stage = {}) {
  const field = getTacticsBattlefield(stage);
  const safeTiles = [];
  for (let y = 0; y < field.rows; y++) {
    for (let x = 0; x < field.cols; x++) {
      const key = `${x},${y}`;
      const blocked = field.tiles.some(cell => cell.x === x && cell.y === y && ['blocked', 'portalSpawn', 'artifact'].includes(cell.type));
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
