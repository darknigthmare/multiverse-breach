import {
  SET_COMPLETION_MILESTONES,
  createCardSetDefinition
} from './cardSchema.js';

/** Reward descriptors stay logical; runtime unlockable objects live elsewhere. */
export const DEFAULT_SET_COMPLETION_REWARDS = Object.freeze([
  Object.freeze({ milestone: 10, rewardType: 'universe-booster', amount: 1 }),
  Object.freeze({ milestone: 25, rewardType: 'profile-title' }),
  Object.freeze({ milestone: 50, rewardType: 'profile-banner' }),
  Object.freeze({ milestone: 75, rewardType: 'portal-or-ko-effect' }),
  Object.freeze({ milestone: 90, rewardType: 'hud-theme' }),
  Object.freeze({ milestone: 100, rewardType: 'completion-anomaly-and-master-frame' })
]);

const makeDiagnostic = (code, details = {}) => Object.freeze({
  code,
  severity: 'error',
  ...details
});

const asCardDefinitions = (catalogOrDefinitions) => {
  if (Array.isArray(catalogOrDefinitions)) return catalogOrDefinitions;
  if (Array.isArray(catalogOrDefinitions?.definitions)) return catalogOrDefinitions.definitions;
  if (Array.isArray(catalogOrDefinitions?.cards)) return catalogOrDefinitions.cards;
  return Object.values(catalogOrDefinitions || {});
};

/** Creates set definitions from cards without embedding card or cover-art data. */
export const createCardSetCatalog = (catalogOrDefinitions, options = {}) => {
  const cardDefinitions = asCardDefinitions(catalogOrDefinitions);
  const groups = new Map();
  const diagnostics = [];

  cardDefinitions.forEach((card, cardIndex) => {
    if (!card?.setId || !card?.id || !card?.universe) {
      diagnostics.push(makeDiagnostic('invalid-card-set-membership', {
        cardIndex,
        cardId: card?.id || null,
        setId: card?.setId || null
      }));
      return;
    }

    const existing = groups.get(card.setId);
    if (existing && existing.universe !== card.universe) {
      diagnostics.push(makeDiagnostic('set-id-collision', {
        cardIndex,
        cardId: card.id,
        setId: card.setId,
        firstUniverse: existing.universe,
        conflictingUniverse: card.universe
      }));
      return;
    }

    if (!existing) groups.set(card.setId, { universe: card.universe, cards: [] });
    groups.get(card.setId).cards.push(card);
  });

  const definitions = [];
  const setsById = {};
  groups.forEach((group, setId) => {
    const sortedCards = group.cards.slice().sort((left, right) => (
      Number(left.number) - Number(right.number) || left.id.localeCompare(right.id)
    ));
    const seenNumbers = new Set();
    sortedCards.forEach((card) => {
      if (seenNumbers.has(card.number)) {
        diagnostics.push(makeDiagnostic('card-number-collision', {
          setId,
          cardId: card.id,
          number: card.number
        }));
      }
      seenNumbers.add(card.number);
    });

    const completionRewards = options.completionRewardsBySetId?.[setId]
      || options.completionRewards
      || DEFAULT_SET_COMPLETION_REWARDS;
    const setDefinition = createCardSetDefinition({
      id: setId,
      universe: group.universe,
      edition: options.editionBySetId?.[setId] || options.edition || 'base-01',
      releaseDate: options.releaseDateBySetId?.[setId] || options.releaseDate || null,
      cardIds: sortedCards.map((card) => card.id),
      chaseCardIds: sortedCards
        .filter((card) => card.rarityId === 'anomaly')
        .map((card) => card.id),
      pageSize: options.pageSizeBySetId?.[setId] || options.pageSize || 9,
      coverArtId: options.coverArtIdBySetId?.[setId] || null,
      palette: options.paletteByUniverse?.[group.universe] || null,
      completionRewards
    });
    definitions.push(setDefinition);
    setsById[setId] = setDefinition;
  });

  definitions.sort((left, right) => left.id.localeCompare(right.id));
  const frozenDefinitions = Object.freeze(definitions);
  const frozenSetsById = Object.freeze(setsById);
  return Object.freeze({
    definitions: frozenDefinitions,
    sets: frozenDefinitions,
    setsById: frozenSetsById,
    byId: frozenSetsById,
    diagnostics: Object.freeze(diagnostics)
  });
};

export const buildCardSetCatalog = createCardSetCatalog;

export const getSetCompletionReward = (setDefinition, milestone) => (
  setDefinition?.completionRewards?.find((reward) => Number(reward.milestone) === Number(milestone))
  || null
);

export const isSetCompletionMilestone = (milestone) => (
  SET_COMPLETION_MILESTONES.includes(Number(milestone))
);

export const CARD_SET_CATALOG = Object.freeze({});
