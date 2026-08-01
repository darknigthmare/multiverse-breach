const stableHash = value => {
  let hash = 2166136261;
  for (const character of String(value || '')) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const getLocalDayKey = (date = new Date()) => {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const buildTitleRotationRoster = ({
  unlockedHeroIds = [],
  heroes = [],
  hiddenUniverses = [],
  disabledHeroIds = [],
  dayKey = '',
  maxItems = 6
} = {}) => {
  const heroById = new Map(heroes.map(hero => [hero.id, hero]));
  const hiddenUniverseSet = new Set(hiddenUniverses);
  const disabledHeroSet = new Set(disabledHeroIds);
  const groups = new Map();

  [...new Set(unlockedHeroIds)].forEach(heroId => {
    if (disabledHeroSet.has(heroId)) return;
    const hero = heroById.get(heroId);
    if (!hero?.universe || hiddenUniverseSet.has(hero.universe)) return;
    if (!groups.has(hero.universe)) groups.set(hero.universe, []);
    groups.get(hero.universe).push({ id: hero.id, name: hero.name || hero.id });
  });

  const entries = [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([universe, ownedHeroes]) => Object.freeze({
      id: `title-rotation-${universe.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stableHash(universe).toString(36)}`,
      universe,
      ownedHeroes: Object.freeze(ownedHeroes.sort((left, right) => left.name.localeCompare(right.name)))
    }));
  if (!entries.length) return Object.freeze([]);

  const safeLimit = Math.max(1, Math.floor(Number(maxItems) || 1));
  const offset = stableHash(dayKey) % entries.length;
  const rotated = [...entries.slice(offset), ...entries.slice(0, offset)].slice(0, safeLimit);
  return Object.freeze(rotated);
};

export const buildUnlockedAttractStages = ({
  completedStageIds = [],
  journal = [],
  unlockedFallbackStages = [],
  hiddenUniverses = [],
  disabledStageIds = [],
  maxItems = 6
} = {}) => {
  const completedStageSet = new Set(completedStageIds.map(stageId => String(stageId)));
  const hiddenUniverseSet = new Set(hiddenUniverses);
  const disabledStageSet = new Set(disabledStageIds.map(stageId => String(stageId)));
  const seen = new Set();
  const safeLimit = Math.max(0, Math.floor(Number(maxItems) || 0));
  const candidates = [
    ...(Array.isArray(journal) ? journal : [])
      .filter(entry => entry?.result === 'victory' && completedStageSet.has(String(entry.stageId))),
    ...(Array.isArray(unlockedFallbackStages) ? unlockedFallbackStages : [])
  ];

  return Object.freeze(candidates
    .filter(entry => {
      const stageId = String(entry?.stageId ?? entry?.id ?? '');
      const sourceUniverses = Array.isArray(entry?.sourceUniverses)
        ? entry.sourceUniverses
        : String(entry?.source || entry?.universe || '').split(' / ').filter(Boolean);
      if (!stageId || seen.has(stageId) || disabledStageSet.has(stageId)) return false;
      if (sourceUniverses.some(universe => hiddenUniverseSet.has(universe))) return false;
      seen.add(stageId);
      return true;
    })
    .slice(0, safeLimit)
    .map(entry => Object.freeze({
      id: `title-attract-stage-${String(entry.stageId ?? entry.id)}`,
      stageId: entry.stageId ?? entry.id,
      title: entry.title || entry.name || entry.universe || 'A.R.C.A.',
      universe: entry.universe || 'Nexus de Convergence',
      mode: ['RPG', 'Tactics', 'Smash', 'Fighter'].includes(entry.mode) ? entry.mode : 'RPG'
    })));
};

export const buildUnlockedAttractCards = ({
  history = [],
  cards = {},
  hiddenUniverses = [],
  maxItems = 6
} = {}) => {
  const ownedCardIds = new Set(
    Object.entries(cards || {})
      .filter(([, entry]) => Number(entry?.copies) > 0)
      .map(([cardId]) => cardId)
  );
  const hiddenUniverseSet = new Set(hiddenUniverses);
  const seen = new Set();
  const safeLimit = Math.max(0, Math.floor(Number(maxItems) || 0));

  return Object.freeze((Array.isArray(history) ? history : [])
    .filter(entry => {
      if (
        !entry?.cardId
        || !ownedCardIds.has(entry.cardId)
        || seen.has(entry.cardId)
        || hiddenUniverseSet.has(entry.universe)
      ) return false;
      seen.add(entry.cardId);
      return true;
    })
    .slice(0, safeLimit)
    .map(entry => Object.freeze({
      id: entry.cardId,
      name: entry.name || entry.cardId,
      universe: entry.universe || 'Nexus de Convergence',
      rarityLabel: entry.rarityLabel || entry.rarity || 'Stable'
    })));
};
