const DEFAULT_FALLBACK_MONSTER = {
  name: 'Nexus Residue',
  hp: 80,
  atk: 10,
  def: 5,
  spd: 8,
  color: '#39c5bb'
};

const DEFAULT_FALLBACK_BOSS = {
  name: 'Nexus Residue Sentinel',
  hp: 420,
  atk: 22,
  def: 12,
  spd: 6,
  color: '#39c5bb'
};

const cloneEnemy = enemy => (enemy ? { ...enemy } : null);
const cloneList = list => (Array.isArray(list) ? list.filter(Boolean).map(cloneEnemy) : []);

const getRosterNames = stage => (
  Array.isArray(stage?.enemyRoster)
    ? [...new Set(stage.enemyRoster.filter(name => typeof name === 'string' && name.trim()).map(name => name.trim()))]
    : []
);

const findExact = (list, name) => list.find(enemy => enemy?.name === name) || null;

const prioritizeExactMonsters = (monsters, rosterNames) => {
  const selected = rosterNames.map(name => findExact(monsters, name)).filter(Boolean);
  const selectedNames = new Set(selected.map(enemy => enemy.name));
  return [
    ...selected,
    ...monsters.filter(enemy => !selectedNames.has(enemy.name))
  ];
};

const makeFallback = (
  fallback,
  defaults,
  requestedName,
  universe,
  { isBoss = false, isWorldBoss = false } = {}
) => ({
  ...defaults,
  ...(fallback || {}),
  name: requestedName || fallback?.name || defaults.name,
  universe: fallback?.universe || universe,
  ...(isBoss ? { isBoss: true } : {}),
  ...(isWorldBoss ? { isWorldBoss: true } : {})
});

/**
 * Resolve an explicit stage roster without consulting global state.
 *
 * Stages without an enemy roster retain the regular universe pools. Explicit
 * rosters select monsters by exact name and expose one canonical boss only:
 * either a local boss or the world boss named by `stage.bossName`.
 */
export function resolveStageEnemyData({
  stage = {},
  monsters = [],
  bosses = [],
  worldBoss = null,
  fallbackMonster = null,
  fallbackBoss = null
} = {}) {
  const availableMonsters = cloneList(monsters);
  const availableBosses = cloneList(bosses);
  const availableWorldBoss = cloneEnemy(worldBoss);
  const rosterNames = getRosterNames(stage);
  const hasExplicitRoster = Array.isArray(stage.enemyRoster) || stage.enemyRosterExclusive === true;

  if (!hasExplicitRoster) {
    return {
      monsters: availableMonsters.length
        ? availableMonsters
        : [makeFallback(fallbackMonster, DEFAULT_FALLBACK_MONSTER, null, stage.universe)],
      bosses: availableBosses,
      worldBoss: availableWorldBoss
    };
  }

  const exactMonsters = rosterNames.map(name => findExact(availableMonsters, name)).filter(Boolean);
  const resolvedMonsters = stage.enemyRosterExclusive
    ? exactMonsters
    : prioritizeExactMonsters(availableMonsters, rosterNames);
  const safeMonsters = resolvedMonsters.length
    ? resolvedMonsters
    : [makeFallback(fallbackMonster, DEFAULT_FALLBACK_MONSTER, null, stage.universe)];

  const requestedBossName = typeof stage.bossName === 'string' && stage.bossName.trim()
    ? stage.bossName.trim()
    : null;
  const rosterBossName = rosterNames.find(name => (
    findExact(availableBosses, name) || availableWorldBoss?.name === name
  )) || null;
  const canonicalBossName = requestedBossName || rosterBossName;
  const localBoss = canonicalBossName ? findExact(availableBosses, canonicalBossName) : null;
  const isNamedWorldBoss = Boolean(
    canonicalBossName
    && availableWorldBoss
    && availableWorldBoss.name === canonicalBossName
  );

  if (localBoss) {
    return {
      monsters: safeMonsters,
      bosses: [{ ...localBoss, isBoss: true }],
      worldBoss: null
    };
  }

  if (isNamedWorldBoss) {
    return {
      monsters: safeMonsters,
      bosses: [],
      worldBoss: { ...availableWorldBoss, isBoss: true, isWorldBoss: true }
    };
  }

  if (!canonicalBossName && availableBosses.length) {
    return {
      monsters: safeMonsters,
      bosses: [{ ...availableBosses[0], isBoss: true }],
      worldBoss: null
    };
  }

  if (!canonicalBossName && availableWorldBoss) {
    return {
      monsters: safeMonsters,
      bosses: [],
      worldBoss: { ...availableWorldBoss, isBoss: true, isWorldBoss: true }
    };
  }

  // A disabled or missing canonical boss must not make a campaign stage empty
  // or silently substitute another named character.
  return {
    monsters: safeMonsters,
    bosses: [
      makeFallback(
        fallbackBoss,
        DEFAULT_FALLBACK_BOSS,
        canonicalBossName,
        stage.universe,
        { isBoss: true }
      )
    ],
    worldBoss: null
  };
}
