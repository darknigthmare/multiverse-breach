const asArray = value => Array.isArray(value) ? value : [];

/** Project a playable squad without replacing the player's saved selection. */
export const projectPlayableTeam = (savedTeam, {
  heroes = [],
  unlockedHeroIds = [],
  playerHeroId = 'player_anchor',
  hiddenUniverses = [],
  disabledHeroIds = [],
  isUniverseInstalled = () => true
} = {}) => {
  const heroById = new Map(heroes.map(hero => [hero.id, hero]));
  const owned = new Set([playerHeroId, ...asArray(unlockedHeroIds)]);
  const hidden = new Set(asArray(hiddenUniverses));
  const disabled = new Set(asArray(disabledHeroIds));
  const playable = [...new Set(asArray(savedTeam))].filter(id => {
    if (id === playerHeroId) return true;
    const hero = heroById.get(id);
    return hero && owned.has(id) && !disabled.has(id)
      && isUniverseInstalled(hero.universe) && !hidden.has(hero.universe);
  });
  return (playable.includes(playerHeroId) ? playable : [playerHeroId, ...playable]).slice(0, 3);
};

/** Availability is local to a distribution; this union must never enter a save. */
export const getRuntimeHiddenUniverses = (hiddenUniverses, knownUniverses, isUniverseInstalled) => (
  [...new Set([
    ...asArray(hiddenUniverses),
    ...asArray(knownUniverses).filter(universe => !isUniverseInstalled(universe))
  ])]
);

/** Bulk visibility commands leave preferences for absent content untouched. */
export const updateInstalledUniverseVisibility = (
  hiddenUniverses, universes, hidden, isUniverseInstalled = () => true
) => {
  const next = new Set(asArray(hiddenUniverses));
  for (const universe of asArray(universes)) {
    if (!isUniverseInstalled(universe)) continue;
    if (hidden) next.add(universe);
    else next.delete(universe);
  }
  return [...next];
};

/** Cross-universe missions require the whole arc, including earlier phases. */
export const isStageContentAvailable = (stage, {
  isUniverseInstalled = () => true,
  hiddenUniverses = []
} = {}) => {
  if (!stage || typeof stage !== 'object') return false;
  const hidden = new Set(asArray(hiddenUniverses));
  const requiredUniverses = new Set([
    stage.universe,
    ...asArray(stage.sourceUniverses),
    ...asArray(stage.allSourceUniverses),
    ...asArray(stage.universeArc?.universes),
    ...asArray(stage.fusionMission?.universes)
  ].filter(universe => typeof universe === 'string' && universe));
  return [...requiredUniverses].every(universe => (
    isUniverseInstalled(universe) && !hidden.has(universe)
  ));
};

/** Keep progress for dormant and future packs while refreshing known missions. */
export const mergeDlcCampaignProgress = (completedStages, existingProgress, packs) => {
  const stored = existingProgress && typeof existingProgress === 'object' && !Array.isArray(existingProgress)
    ? existingProgress : {};
  const safeEntries = Object.entries(stored).filter(([id, progress]) => (
    !['__proto__', 'constructor', 'prototype'].includes(id)
    && progress && typeof progress === 'object' && !Array.isArray(progress)
  ));
  const progress = Object.fromEntries(safeEntries);
  const completed = new Set(asArray(completedStages).map(String));
  for (const pack of packs) {
    progress[pack.id] = {
      ...progress[pack.id],
      missionIds: pack.missionIds.filter(id => completed.has(String(id)))
    };
  }
  return progress;
};
