export const BOOSTER_CARD_COUNT = 5;

const HERO_KINDS = new Set(['hero', 'character', 'perso']);
const RARITY_RANKS = {
  common: 0,
  stable: 0,
  uncommon: 0,
  rare: 1,
  epic: 2,
  anomaly: 3,
  legendary: 4,
  mythic: 5
};

const isHero = (candidate) => HERO_KINDS.has(candidate.kind);

const isRareOrBetter = (candidate) => {
  const rarityId = String(candidate.rarity?.id || '').toLowerCase();
  return (RARITY_RANKS[rarityId] || 0) >= RARITY_RANKS.rare;
};

const getRoll = (rng) => {
  const roll = Number(rng());
  if (!Number.isFinite(roll) || roll <= 0) return 0;
  if (roll >= 1) return 1 - Number.EPSILON;
  return roll;
};

const getWeight = (candidate) => {
  const weight = Number(candidate.rarity?.weight);
  return Number.isFinite(weight) && weight > 0 ? weight : 0;
};

const weightedPick = (pool, rng) => {
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((total, candidate) => total + getWeight(candidate), 0);
  if (totalWeight <= 0) {
    return pool[Math.floor(getRoll(rng) * pool.length)];
  }

  let roll = getRoll(rng) * totalWeight;
  for (const candidate of pool) {
    roll -= getWeight(candidate);
    if (roll < 0) return candidate;
  }

  return pool[pool.length - 1];
};

const uniqueById = (candidates) => {
  const seenIds = new Set();
  return candidates.filter(candidate => {
    if (!candidate || candidate.id === undefined || candidate.id === null) {
      throw new TypeError('Each booster candidate must have an id.');
    }
    if (seenIds.has(candidate.id)) return false;
    seenIds.add(candidate.id);
    return true;
  });
};

const toOwnedSet = (ownedIds) => {
  if (ownedIds === undefined || ownedIds === null) return new Set();
  if (typeof ownedIds[Symbol.iterator] !== 'function') {
    throw new TypeError('ownedIds must be an iterable.');
  }
  return new Set(ownedIds);
};

const getDuplicateRefund = (candidate) => {
  const refund = Number(candidate.rarity?.duplicateRefund);
  return Number.isFinite(refund) && refund > 0 ? refund : 0;
};

/**
 * Selects five rewards exclusively from the supplied candidate scope.
 * Guarantees that depend on a reward type or rarity apply when a matching
 * candidate exists in that scope.
 */
export const createBoosterRewards = ({
  candidates,
  ownedIds = [],
  pityReady = false,
  rng = Math.random,
  preferUniverseSpread = false
}) => {
  if (!Array.isArray(candidates)) {
    throw new TypeError('candidates must be an array.');
  }
  if (typeof rng !== 'function') {
    throw new TypeError('rng must be a function.');
  }

  const scopedCandidates = uniqueById(candidates);
  if (scopedCandidates.length === 0) return [];

  const ownedSet = toOwnedSet(ownedIds);
  const selected = [];
  const selectedIds = new Set();

  const pickUnusedFirst = (pool) => {
    const unusedPool = pool.filter(candidate => !selectedIds.has(candidate.id));
    return weightedPick(unusedPool.length > 0 ? unusedPool : pool, rng);
  };

  const addCandidate = (candidate) => {
    if (!candidate || selected.length >= BOOSTER_CARD_COUNT) return;
    selected.push(candidate);
    selectedIds.add(candidate.id);
  };

  const heroes = scopedCandidates.filter(isHero);
  if (heroes.length > 0) {
    const unownedHeroes = heroes.filter(hero => !ownedSet.has(hero.id));
    const heroPool = pityReady && unownedHeroes.length > 0 ? unownedHeroes : heroes;
    addCandidate(weightedPick(heroPool, rng));
  }

  const rareOrBetter = scopedCandidates.filter(isRareOrBetter);
  if (rareOrBetter.length > 0 && !selected.some(isRareOrBetter)) {
    addCandidate(pickUnusedFirst(rareOrBetter));
  }

  const availableUniverses = new Set(
    scopedCandidates
      .map(candidate => candidate.universe)
      .filter(universe => universe !== undefined && universe !== null && universe !== '')
  );
  if (preferUniverseSpread && availableUniverses.size >= 2) {
    const selectedUniverses = () => new Set(
      selected
        .map(candidate => candidate.universe)
        .filter(universe => universe !== undefined && universe !== null && universe !== '')
    );

    while (selected.length < BOOSTER_CARD_COUNT && selectedUniverses().size < 2) {
      const currentUniverses = selectedUniverses();
      const otherUniversePool = scopedCandidates.filter(candidate => (
        candidate.universe !== undefined
        && candidate.universe !== null
        && candidate.universe !== ''
        && !currentUniverses.has(candidate.universe)
      ));
      if (otherUniversePool.length === 0) break;
      addCandidate(pickUnusedFirst(otherUniversePool));
    }
  }

  while (selected.length < BOOSTER_CARD_COUNT) {
    addCandidate(pickUnusedFirst(scopedCandidates));
  }

  const ownedDuringOpening = new Set(ownedSet);
  return selected.map((candidate, cardIndex) => {
    const wasDuplicate = ownedDuringOpening.has(candidate.id);
    ownedDuringOpening.add(candidate.id);
    return {
      ...candidate,
      wasDuplicate,
      shardsReturned: wasDuplicate ? getDuplicateRefund(candidate) : 0,
      cardIndex
    };
  });
};
