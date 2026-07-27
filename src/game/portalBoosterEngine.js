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

const getCardWeight = (candidate) => {
  const weight = Number(candidate.dropWeight);
  return Number.isFinite(weight) && weight > 0 ? weight : 1;
};

const weightedPickBy = (pool, rng, getItemWeight) => {
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce(
    (total, item) => total + getItemWeight(item),
    0
  );
  if (totalWeight <= 0) {
    return pool[Math.floor(getRoll(rng) * pool.length)];
  }

  let roll = getRoll(rng) * totalWeight;
  for (const item of pool) {
    roll -= getItemWeight(item);
    if (roll < 0) return item;
  }

  return pool[pool.length - 1];
};

const makeRarityGroups = (pool) => {
  const groups = new Map();
  pool.forEach(candidate => {
    const rarityId = String(candidate.rarity?.id || 'unrated').toLowerCase();
    if (!groups.has(rarityId)) {
      groups.set(rarityId, {
        id: rarityId,
        weight: getWeight(candidate),
        candidates: []
      });
    }
    const group = groups.get(rarityId);
    group.weight = Math.max(group.weight, getWeight(candidate));
    group.candidates.push(candidate);
  });
  return [...groups.values()];
};

const weightedPick = (pool, rng) => {
  if (pool.length === 0) return null;
  const rarityGroups = makeRarityGroups(pool);
  const rarityGroup = weightedPickBy(rarityGroups, rng, group => group.weight);
  if (!rarityGroup || rarityGroup.weight <= 0) {
    return weightedPickBy(pool, rng, getCardWeight);
  }
  return weightedPickBy(rarityGroup.candidates, rng, getCardWeight);
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
 * Returns the exact probability of each card during an unconstrained draw.
 * Guarantee slots and pity intentionally remain separate, explicit modifiers.
 */
export const getBoosterFreeDrawRates = (candidates) => {
  if (!Array.isArray(candidates)) {
    throw new TypeError('candidates must be an array.');
  }
  const scopedCandidates = uniqueById(candidates);
  const rarityGroups = makeRarityGroups(scopedCandidates);
  const totalRarityWeight = rarityGroups.reduce(
    (total, group) => total + group.weight,
    0
  );
  const rates = new Map();

  if (totalRarityWeight <= 0) {
    const totalCardWeight = scopedCandidates.reduce(
      (total, candidate) => total + getCardWeight(candidate),
      0
    );
    scopedCandidates.forEach(candidate => {
      rates.set(candidate.id, getCardWeight(candidate) / totalCardWeight);
    });
    return rates;
  }

  rarityGroups.forEach(group => {
    const rarityRate = group.weight / totalRarityWeight;
    const totalCardWeight = group.candidates.reduce(
      (total, candidate) => total + getCardWeight(candidate),
      0
    );
    group.candidates.forEach(candidate => {
      rates.set(
        candidate.id,
        rarityRate * (getCardWeight(candidate) / totalCardWeight)
      );
    });
  });
  return rates;
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
  preferUniverseSpread = false,
  guaranteeNonHeroRare = false
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

  const nonHeroRareOrBetter = scopedCandidates.filter(candidate => (
    !isHero(candidate) && isRareOrBetter(candidate)
  ));
  if (guaranteeNonHeroRare && nonHeroRareOrBetter.length > 0) {
    addCandidate(pickUnusedFirst(nonHeroRareOrBetter));
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
