import { ENEMIES_DB } from './enemies';

export const CUSTOM_BATTLE_MODES = Object.freeze(['RPG', 'Tactics', 'Smash', 'Fighter']);
export const CUSTOM_OPPONENT_CONTROLS = Object.freeze(['cpu', 'p2']);

export const DEFAULT_CUSTOM_BATTLE_PRESET = Object.freeze({
  mode: 'RPG',
  opponentControl: 'cpu',
  playerTeamIds: [],
  opponentTeamIds: [],
  enemyIds: [],
  stageArchiveId: null,
  battleMusicId: null,
  stageMusicId: null,
  fieldSuperId: null,
  difficulty: 'standard',
  items: true,
  hazards: true
});

const uniqueIds = (value, limit = Infinity) => (
  [...new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string' && id.trim()) : [])]
    .slice(0, limit)
);

const optionalId = value => (typeof value === 'string' && value.trim() ? value : null);

export const normalizeCustomBattlePreset = (preset = {}, options = {}) => {
  const merged = { ...DEFAULT_CUSTOM_BATTLE_PRESET, ...(preset || {}) };
  const mode = CUSTOM_BATTLE_MODES.includes(merged.mode)
    ? merged.mode
    : DEFAULT_CUSTOM_BATTLE_PRESET.mode;
  const allowedHeroIds = options.allowedHeroIds ? new Set(options.allowedHeroIds) : null;
  const allowedEnemyIds = options.allowedEnemyIds ? new Set(options.allowedEnemyIds) : null;
  const filterAllowed = (ids, allowed) => (allowed ? ids.filter(id => allowed.has(id)) : ids);
  const playerTeamIds = filterAllowed(uniqueIds(merged.playerTeamIds, 3), allowedHeroIds);
  const opponentTeamIds = filterAllowed(uniqueIds(merged.opponentTeamIds, 3), allowedHeroIds);
  const enemyLimit = mode === 'Tactics' ? 6 : 3;
  const enemyIds = filterAllowed(uniqueIds(merged.enemyIds, enemyLimit), allowedEnemyIds);

  return {
    mode,
    opponentControl: CUSTOM_OPPONENT_CONTROLS.includes(merged.opponentControl)
      ? merged.opponentControl
      : DEFAULT_CUSTOM_BATTLE_PRESET.opponentControl,
    playerTeamIds,
    opponentTeamIds,
    enemyIds,
    stageArchiveId: optionalId(merged.stageArchiveId),
    battleMusicId: optionalId(merged.battleMusicId),
    stageMusicId: optionalId(merged.stageMusicId),
    fieldSuperId: optionalId(merged.fieldSuperId),
    difficulty: ['training', 'standard', 'expert'].includes(merged.difficulty)
      ? merged.difficulty
      : DEFAULT_CUSTOM_BATTLE_PRESET.difficulty,
    items: merged.items !== false,
    hazards: merged.hazards !== false
  };
};

export const makeCustomEnemyId = (universe, kind, name) => `${universe}::${kind}::${name}`;

export const buildCustomEnemyCatalog = ({
  hiddenUniverses = [],
  disabledEnemyIds = []
} = {}) => {
  const hiddenSet = new Set(hiddenUniverses);
  const disabledSet = new Set(disabledEnemyIds);
  return Object.entries(ENEMIES_DB).flatMap(([universe, roster]) => {
    if (hiddenSet.has(universe)) return [];
    const entries = [
      ...(roster?.monsters || []).map(enemy => ({ enemy, kind: 'monster' })),
      ...(roster?.bosses || []).map(enemy => ({ enemy, kind: 'boss' })),
      ...(roster?.worldBoss ? [{ enemy: roster.worldBoss, kind: 'worldBoss' }] : [])
    ];
    return entries
      .filter(({ enemy }) => enemy?.name && !disabledSet.has(`${universe}::${enemy.name}`))
      .map(({ enemy, kind }) => ({
        id: makeCustomEnemyId(universe, kind, enemy.name),
        universe,
        kind,
        name: enemy.name,
        data: { ...enemy, universe }
      }));
  });
};

const fallbackThreat = Object.freeze({
  id: 'custom-fallback',
  universe: 'Nexus de Convergence',
  kind: 'monster',
  name: 'Echo d entrainement A.R.C.A.',
  data: {
    name: 'Echo d entrainement A.R.C.A.',
    universe: 'Nexus de Convergence',
    hp: 90,
    atk: 9,
    def: 5,
    spd: 6,
    color: '#39c5bb',
    weapon: 'rift_blade'
  }
});

export const resolveCustomEnemies = (enemyIds, catalog) => {
  const byId = new Map((catalog || []).map(entry => [entry.id, entry]));
  const resolved = uniqueIds(enemyIds, 6).map(id => byId.get(id)).filter(Boolean);
  return resolved.length ? resolved : [(catalog || [])[0] || fallbackThreat];
};

export const buildCustomEnemyData = (enemyIds, catalog) => {
  const selected = resolveCustomEnemies(enemyIds, catalog);
  const threats = selected.map(entry => ({
    ...entry.data,
    universe: entry.universe,
    customKind: entry.kind,
    isBoss: entry.kind !== 'monster',
    isWorldBoss: entry.kind === 'worldBoss'
  }));
  const monsters = threats.filter(enemy => enemy.customKind === 'monster');
  const bosses = threats.filter(enemy => enemy.customKind === 'boss');
  const worldBoss = threats.find(enemy => enemy.customKind === 'worldBoss') || null;

  return {
    monsters,
    bosses,
    worldBoss,
    customRoster: threats,
    selectedEnemyIds: selected.map(entry => entry.id)
  };
};

export const buildCustomRuntimeStage = ({
  preset,
  archive = null,
  enemyData,
  battleMusic = null,
  stageMusic = null,
  fieldSuper = null,
  cosmetics = {},
  nonce = 0
}) => {
  const universe = archive?.universe || 'Nexus de Convergence';
  const cpuDifficulty = preset.opponentControl === 'cpu'
    ? {
        training: { hp: 0.82, atk: 0.78, spd: 0.86 },
        expert: { hp: 1.24, atk: 1.18, spd: 1.12 }
      }[preset.difficulty]
    : null;
  const scaleThreat = enemy => {
    if (!enemy || !cpuDifficulty) return enemy;
    return {
      ...enemy,
      hp: Math.max(1, Math.round((enemy.hp || 90) * cpuDifficulty.hp)),
      atk: Math.max(1, Math.round((enemy.atk || 9) * cpuDifficulty.atk)),
      spd: Math.max(1, Math.round((enemy.spd || 5) * cpuDifficulty.spd))
    };
  };
  const runtimeEnemyData = cpuDifficulty
    ? {
        ...enemyData,
        monsters: (enemyData?.monsters || []).map(scaleThreat),
        bosses: (enemyData?.bosses || []).map(scaleThreat),
        worldBoss: scaleThreat(enemyData?.worldBoss),
        customRoster: (enemyData?.customRoster || []).map(scaleThreat)
      }
    : enemyData;
  const modeVariant = {
    RPG: 'rpg',
    Tactics: 'tactics',
    Smash: 'melee',
    Fighter: 'combat'
  }[preset.mode] || 'combat';
  const adaptMusicToMode = music => (
    music?.musicStage
      ? {
          ...music,
          musicStage: {
            ...music.musicStage,
            mode: preset.mode,
            modeVariant
          }
        }
      : music
  );
  return {
    id: `custom-${preset.mode}-${universe}-${nonce}`,
    name: `Simulation Custom - ${universe}`,
    universe,
    mode: preset.mode,
    difficulty: 'Custom',
    bossName: enemyData?.customRoster?.[0]?.name || '',
    goldPrize: 0,
    shardPrize: 0,
    tokenPrize: 0,
    image: archive?.image || null,
    isCustomBattle: true,
    disableItems: !preset.items,
    disableHazards: !preset.hazards,
    customBattle: {
      opponentControl: preset.opponentControl,
      difficulty: preset.difficulty,
      singleRoster: true,
      enemyData: runtimeEnemyData,
      battleMusic: adaptMusicToMode(battleMusic),
      stageMusic: adaptMusicToMode(stageMusic),
      fieldSuper,
      cosmetics: { ...(cosmetics || {}) }
    }
  };
};
