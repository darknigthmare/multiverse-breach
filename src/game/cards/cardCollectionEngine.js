import {
  CARD_RARITIES,
  SET_COMPLETION_MILESTONES,
  normalizeCardRarityId
} from './cardSchema.js';
import { getSetCompletionReward } from './cardSetCatalog.js';

export const DUPLICATE_MODES = Object.freeze({
  AUTO_CONVERT: 'autoConvert',
  KEEP: 'keep'
});

export const AUTO_CONVERT_COPY_LIMIT = 4;
export const KEEP_COPY_LIMIT = 9;
export const PORTAL_HISTORY_LIMIT = 100;

export const CARD_DUST_BY_RARITY = Object.freeze({
  stable: 1,
  rare: 3,
  epic: 8,
  anomaly: 20
});

const MASTERY_FINISHES = Object.freeze([
  'standard',
  'holo-thread',
  'portal-foil',
  'negative-archive'
]);

const toNonNegativeInteger = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
};

export const getCardMasteryLevel = (copies) => Math.min(
  3,
  Math.max(0, toNonNegativeInteger(copies) - 1)
);

const getFinishesForMastery = (finishesOwned, masteryLevel, hasCopy) => {
  const finishes = Array.isArray(finishesOwned) ? finishesOwned.map(String) : [];
  if (hasCopy && !finishes.includes('standard')) finishes.unshift('standard');
  for (let level = 1; level <= masteryLevel; level += 1) {
    const finish = MASTERY_FINISHES[level];
    if (!finishes.includes(finish)) finishes.push(finish);
  }
  return Object.freeze(finishes);
};

export const normalizeCollectionEntry = (entry = {}, cardId, fallbackObtainedAt = null) => {
  const copies = toNonNegativeInteger(entry.copies);
  const masteryLevel = getCardMasteryLevel(copies);
  const firstObtainedAt = entry.firstObtainedAt || (copies > 0 ? fallbackObtainedAt : null);
  const lastObtainedAt = entry.lastObtainedAt || firstObtainedAt;
  return Object.freeze({
    ...entry,
    cardId: String(cardId ?? entry.cardId ?? ''),
    copies,
    finishesOwned: getFinishesForMastery(entry.finishesOwned, masteryLevel, copies > 0),
    firstObtainedAt,
    lastObtainedAt,
    favorite: Boolean(entry.favorite),
    seen: Boolean(entry.seen),
    masteryLevel
  });
};

const resolveDuplicateMode = (options) => {
  if (options.duplicateMode === DUPLICATE_MODES.KEEP || options.autoConvert === false) {
    return DUPLICATE_MODES.KEEP;
  }
  return DUPLICATE_MODES.AUTO_CONVERT;
};

const getDustValue = (rarityId, dustByRarity) => {
  const rarity = normalizeCardRarityId(rarityId);
  const configured = Number(dustByRarity?.[rarity]);
  return Number.isFinite(configured) && configured >= 0
    ? configured
    : CARD_DUST_BY_RARITY[rarity];
};

/**
 * Adds copies to portalCollection.cards and returns an immutable transaction.
 * Fragment refunds are intentionally absent: portalBoosterEconomy remains the
 * sole owner of that balance and must settle them exactly once.
 */
export const addCardToCollection = (portalCollection = {}, cardDefinition, options = {}) => {
  if (!cardDefinition?.id) throw new TypeError('cardDefinition.id is required.');

  const cardId = String(cardDefinition.id);
  const requestedCopies = Math.max(1, toNonNegativeInteger(options.copies, 1));
  const obtainedAt = options.obtainedAt || new Date().toISOString();
  const duplicateMode = resolveDuplicateMode(options);
  const cards = portalCollection.cards && typeof portalCollection.cards === 'object'
    && !Array.isArray(portalCollection.cards)
    ? portalCollection.cards
    : {};
  const previousEntry = normalizeCollectionEntry(cards[cardId] || {}, cardId, null);
  const masteryBefore = previousEntry.masteryLevel;
  let copies = previousEntry.copies;
  let keptCopies = 0;
  let convertedCopies = 0;

  for (let copyIndex = 0; copyIndex < requestedCopies; copyIndex += 1) {
    const masteryCopiesStillNeeded = copies < AUTO_CONVERT_COPY_LIMIT;
    const keepTradeCopy = duplicateMode === DUPLICATE_MODES.KEEP && copies < KEEP_COPY_LIMIT;
    if (masteryCopiesStillNeeded || keepTradeCopy) {
      copies += 1;
      keptCopies += 1;
    } else {
      convertedCopies += 1;
    }
  }

  const masteryLevel = getCardMasteryLevel(copies);
  const dustPerCopy = getDustValue(cardDefinition.rarityId, options.dustByRarity);
  const dustGained = convertedCopies * dustPerCopy;
  const nextEntry = Object.freeze({
    ...previousEntry,
    cardId,
    copies,
    finishesOwned: getFinishesForMastery(
      previousEntry.finishesOwned,
      masteryLevel,
      copies > 0
    ),
    firstObtainedAt: previousEntry.firstObtainedAt || obtainedAt,
    lastObtainedAt: obtainedAt,
    masteryLevel
  });
  const nextCards = Object.freeze({ ...cards, [cardId]: nextEntry });
  const previousDust = Number(portalCollection.threadDust);
  const threadDust = (Number.isFinite(previousDust) && previousDust >= 0 ? previousDust : 0)
    + dustGained;
  const nextCollection = Object.freeze({
    ...portalCollection,
    cards: nextCards,
    setProgress: portalCollection.setProgress && typeof portalCollection.setProgress === 'object'
      ? portalCollection.setProgress
      : {},
    threadDust,
    duplicateMode
  });

  return Object.freeze({
    portalCollection: nextCollection,
    collection: nextCollection,
    entry: nextEntry,
    cardId,
    isNew: previousEntry.copies === 0,
    requestedCopies,
    keptCopies,
    convertedCopies,
    dustPerCopy,
    dustGained,
    masteryBefore,
    masteryAfter: masteryLevel,
    duplicateMode
  });
};

export const collectCard = ({
  portalCollection = {},
  cardDefinition,
  card,
  ...options
} = {}) => addCardToCollection(portalCollection, cardDefinition || card, options);

export const addCardsToCollection = (portalCollection = {}, cardDefinitions = [], options = {}) => {
  if (!Array.isArray(cardDefinitions)) throw new TypeError('cardDefinitions must be an array.');
  let nextCollection = portalCollection;
  const transactions = [];
  cardDefinitions.forEach((cardDefinition) => {
    const transaction = addCardToCollection(nextCollection, cardDefinition, options);
    nextCollection = transaction.portalCollection;
    transactions.push(transaction);
  });
  return Object.freeze({
    portalCollection: nextCollection,
    collection: nextCollection,
    transactions: Object.freeze(transactions),
    dustGained: transactions.reduce((total, transaction) => total + transaction.dustGained, 0)
  });
};

const normalizeClaimedMilestones = (value) => Object.freeze(
  [...new Set(
    (Array.isArray(value) ? value : [])
      .map(Number)
      .filter((milestone) => SET_COMPLETION_MILESTONES.includes(milestone))
  )].sort((left, right) => left - right)
);

const getCardsRecord = (portalCollectionOrCards) => {
  if (portalCollectionOrCards?.cards && typeof portalCollectionOrCards.cards === 'object') {
    return portalCollectionOrCards.cards;
  }
  return portalCollectionOrCards && typeof portalCollectionOrCards === 'object'
    ? portalCollectionOrCards
    : {};
};

export const getCardSetCompletion = (setDefinition, portalCollectionOrCards = {}) => {
  if (!setDefinition?.id || !Array.isArray(setDefinition.cardIds)) {
    throw new TypeError('A CardSetDefinition with cardIds is required.');
  }
  const cards = getCardsRecord(portalCollectionOrCards);
  const cardIds = [...new Set(setDefinition.cardIds.map(String))];
  const obtained = cardIds.reduce((total, cardId) => (
    total + (toNonNegativeInteger(cards[cardId]?.copies) > 0 ? 1 : 0)
  ), 0);
  const total = cardIds.length;
  const percentage = total > 0 ? (obtained / total) * 100 : 0;
  return Object.freeze({ setId: setDefinition.id, obtained, total, percentage });
};

export const getSetMilestoneState = (portalCollection = {}, setDefinition) => {
  const completion = getCardSetCompletion(setDefinition, portalCollection);
  const claimedMilestones = normalizeClaimedMilestones(
    portalCollection.setProgress?.[setDefinition.id]?.claimedMilestones
  );
  const unlockedMilestones = Object.freeze(SET_COMPLETION_MILESTONES.filter(
    (milestone) => completion.percentage >= milestone
  ));
  const claimableMilestones = Object.freeze(unlockedMilestones.filter(
    (milestone) => !claimedMilestones.includes(milestone)
  ));
  return Object.freeze({
    ...completion,
    claimedMilestones,
    unlockedMilestones,
    claimableMilestones
  });
};

export const getClaimableSetMilestones = (portalCollection, setDefinition) => (
  getSetMilestoneState(portalCollection, setDefinition).claimableMilestones
);

export const claimSetMilestone = ({ portalCollection = {}, setDefinition, milestone } = {}) => {
  const target = Number(milestone);
  if (!SET_COMPLETION_MILESTONES.includes(target)) {
    return Object.freeze({
      portalCollection,
      collection: portalCollection,
      claimed: false,
      reason: 'unknown-milestone',
      reward: null
    });
  }

  const state = getSetMilestoneState(portalCollection, setDefinition);
  if (state.claimedMilestones.includes(target)) {
    return Object.freeze({
      portalCollection,
      collection: portalCollection,
      claimed: false,
      reason: 'already-claimed',
      reward: null
    });
  }
  if (!state.unlockedMilestones.includes(target)) {
    return Object.freeze({
      portalCollection,
      collection: portalCollection,
      claimed: false,
      reason: 'not-reached',
      reward: null
    });
  }

  const previousProgress = portalCollection.setProgress?.[setDefinition.id] || {};
  const claimedMilestones = normalizeClaimedMilestones([
    ...state.claimedMilestones,
    target
  ]);
  const setProgress = Object.freeze({
    ...(portalCollection.setProgress || {}),
    [setDefinition.id]: Object.freeze({
      ...previousProgress,
      claimedMilestones
    })
  });
  const nextCollection = Object.freeze({ ...portalCollection, setProgress });
  return Object.freeze({
    portalCollection: nextCollection,
    collection: nextCollection,
    claimed: true,
    reason: null,
    milestone: target,
    reward: getSetCompletionReward(setDefinition, target)
  });
};

const HISTORY_FIELDS = Object.freeze([
  'rewardId', 'cardId', 'kind', 'name', 'universe', 'rarity', 'rarityLabel',
  'rarityColor', 'pack', 'packId', 'duplicate', 'copies', 'dustGained',
  'rawShardsReturned', 'shardsReturned', 'pricePaid', 'netCost', 'at'
]);

export const compactOpeningHistoryEntry = (entry = {}) => Object.freeze(
  Object.fromEntries(HISTORY_FIELDS
    .filter((field) => entry[field] !== undefined)
    .map((field) => [field, entry[field]]))
);

/** History belongs to portalStats, never portalCollection. */
export const appendOpeningHistory = (portalStats = {}, entries = []) => {
  const additions = (Array.isArray(entries) ? entries : [entries])
    .map(compactOpeningHistoryEntry);
  return Object.freeze({
    ...portalStats,
    history: Object.freeze([
      ...additions,
      ...(Array.isArray(portalStats.history) ? portalStats.history : [])
    ].slice(0, PORTAL_HISTORY_LIMIT))
  });
};

export const normalizePortalHistory = (portalStats = {}) => Object.freeze({
  ...portalStats,
  history: Object.freeze(
    (Array.isArray(portalStats.history) ? portalStats.history : [])
      .slice(0, PORTAL_HISTORY_LIMIT)
      .map(compactOpeningHistoryEntry)
  )
});

export const isSupportedCardRarity = (rarityId) => CARD_RARITIES.includes(
  normalizeCardRarityId(rarityId)
);
