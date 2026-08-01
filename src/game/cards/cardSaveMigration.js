import {
  PORTAL_HISTORY_LIMIT,
  normalizeCollectionEntry,
  normalizePortalHistory
} from './cardCollectionEngine.js';
import { SET_COMPLETION_MILESTONES } from './cardSchema.js';

export const CARD_COLLECTION_SAVE_VERSION = 9;

export const LEGACY_COLLECTION_FIELD_BY_REWARD_KIND = Object.freeze({
  archive: 'archives',
  hud: 'hudThemes',
  kart: 'karts',
  battleMusic: 'battleMusic',
  stageMusic: 'stageMusic',
  fieldSuper: 'fieldSupers',
  npcAssist: 'npcAssists',
  koEffect: 'koEffects',
  portalEffect: 'portalEffects',
  introPose: 'introPoses',
  victoryPose: 'victoryPoses',
  profileBanner: 'profileBanners',
  profileTitle: 'profileTitles'
});

const asDefinitions = (options) => {
  const source = options.cardDefinitions || options.cardCatalog || [];
  if (Array.isArray(source)) return source;
  if (Array.isArray(source.definitions)) return source.definitions;
  if (Array.isArray(source.cards)) return source.cards;
  return Object.values(source || {});
};

const makeDiagnostic = (code, details = {}) => Object.freeze({
  code,
  severity: code.startsWith('ambiguous') ? 'warning' : 'error',
  ...details
});

const normalizeCardsRecord = (value, migratedAt) => Object.freeze(
  Object.fromEntries(
    Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})
      .map(([cardId, entry]) => [
        cardId,
        normalizeCollectionEntry(entry, cardId, migratedAt)
      ])
  )
);

const normalizeSetProgress = (value) => Object.freeze(
  Object.fromEntries(
    Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})
      .map(([setId, progress]) => {
        const claimedMilestones = Object.freeze([
          ...new Set(
            (Array.isArray(progress?.claimedMilestones) ? progress.claimedMilestones : [])
              .map(Number)
              .filter((milestone) => SET_COMPLETION_MILESTONES.includes(milestone))
          )
        ].sort((left, right) => left - right));
        return [setId, Object.freeze({ ...(progress || {}), claimedMilestones })];
      })
  )
);

const toOwnershipEntries = (items) => (
  (Array.isArray(items) ? items : [])
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return { id: String(item), universe: null };
      }
      if (!item || item.id === undefined || item.id === null) return null;
      return {
        id: String(item.id),
        universe: item.universe ? String(item.universe) : null
      };
    })
    .filter(Boolean)
);

const getLegacyOwnershipEntries = (save, rewardKind) => {
  if (rewardKind === 'hero') return toOwnershipEntries(save.unlockedHeroes);
  if (['equipment', 'event', 'skin'].includes(rewardKind)) {
    return toOwnershipEntries(save.inventory);
  }
  const field = LEGACY_COLLECTION_FIELD_BY_REWARD_KIND[rewardKind];
  return field ? toOwnershipEntries(save.portalCollection?.[field]) : [];
};

const groupDefinitionsByReward = (definitions, diagnostics) => {
  const groups = new Map();
  definitions.forEach((definition, definitionIndex) => {
    if (!definition?.id || !definition?.rewardKind || !definition?.rewardId || !definition?.universe) {
      diagnostics.push(makeDiagnostic('invalid-migration-card-definition', {
        definitionIndex,
        cardId: definition?.id || null
      }));
      return;
    }
    const key = `${definition.rewardKind}\u0000${definition.rewardId}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(definition);
  });
  return groups;
};

const addRetroactiveEntry = (cards, definition, migratedAt, migratedCardIds) => {
  if (cards[definition.id]?.copies > 0) return cards;
  const entry = normalizeCollectionEntry({
    cardId: definition.id,
    copies: 1,
    finishesOwned: ['standard'],
    firstObtainedAt: migratedAt,
    lastObtainedAt: migratedAt,
    favorite: false,
    seen: false,
    masteryLevel: 0
  }, definition.id, migratedAt);
  migratedCardIds.push(definition.id);
  return { ...cards, [definition.id]: entry };
};

/**
 * Detailed migration API. Legacy rewards create cards but are never removed or
 * re-granted, making the operation safe to run on every local/cloud load.
 */
export const migrateCardSaveWithDiagnostics = (inputSave = {}, options = {}) => {
  const migratedAt = options.migratedAt || new Date().toISOString();
  const sourceSave = inputSave && typeof inputSave === 'object' ? inputSave : {};
  const sourceCollection = sourceSave.portalCollection
    && typeof sourceSave.portalCollection === 'object'
    ? sourceSave.portalCollection
    : {};
  const misplacedHistory = Array.isArray(sourceCollection.history)
    ? sourceCollection.history
    : [];
  const { history: _misplacedHistory, ...collectionWithoutHistory } = sourceCollection;
  const diagnostics = [];
  const migratedCardIds = [];
  let cards = { ...normalizeCardsRecord(sourceCollection.cards, migratedAt) };
  const definitions = asDefinitions(options);
  const groups = groupDefinitionsByReward(definitions, diagnostics);

  groups.forEach((rewardDefinitions) => {
    const firstDefinition = rewardDefinitions[0];
    const ownershipEntries = getLegacyOwnershipEntries(sourceSave, firstDefinition.rewardKind)
      .filter((entry) => entry.id === firstDefinition.rewardId);
    if (ownershipEntries.length === 0) return;

    if (rewardDefinitions.length === 1) {
      cards = addRetroactiveEntry(cards, firstDefinition, migratedAt, migratedCardIds);
      return;
    }

    const universeSpecificEntries = ownershipEntries.filter((entry) => entry.universe);
    const matchedDefinitions = rewardDefinitions.filter((definition) => (
      universeSpecificEntries.some((entry) => entry.universe === definition.universe)
    ));
    if (matchedDefinitions.length > 0 && universeSpecificEntries.length === ownershipEntries.length) {
      matchedDefinitions.forEach((definition) => {
        cards = addRetroactiveEntry(cards, definition, migratedAt, migratedCardIds);
      });
      return;
    }

    // A legacy string id cannot identify which continuity owned the duplicate.
    diagnostics.push(makeDiagnostic('ambiguous-legacy-reward', {
      rewardKind: firstDefinition.rewardKind,
      rewardId: firstDefinition.rewardId,
      candidateCardIds: Object.freeze(rewardDefinitions.map((definition) => definition.id))
    }));
  });

  const portalCollection = Object.freeze({
    ...collectionWithoutHistory,
    cards: Object.freeze(cards),
    setProgress: normalizeSetProgress(sourceCollection.setProgress),
    threadDust: Math.max(0, Number(sourceCollection.threadDust) || 0),
    duplicateMode: sourceCollection.duplicateMode === 'keep' ? 'keep' : 'autoConvert'
  });
  const sourcePortalHistory = Array.isArray(sourceSave.portalStats?.history)
    ? sourceSave.portalStats.history
    : [];
  const portalStats = normalizePortalHistory({
    ...(sourceSave.portalStats || {}),
    history: [...sourcePortalHistory, ...misplacedHistory].slice(0, PORTAL_HISTORY_LIMIT)
  });
  const currentVersion = Number(sourceSave.saveVersion) || 0;
  const save = Object.freeze({
    ...sourceSave,
    saveVersion: Math.max(currentVersion, options.targetVersion || CARD_COLLECTION_SAVE_VERSION),
    portalStats,
    portalCollection
  });

  return Object.freeze({
    save,
    diagnostics: Object.freeze(diagnostics),
    migratedCardIds: Object.freeze(migratedCardIds)
  });
};

/** Simple migration API for App/cloud integration. */
export const migrateCardCollectionSave = (save, options = {}) => (
  migrateCardSaveWithDiagnostics(save, options).save
);

export const migrateCardSave = migrateCardCollectionSave;
export const migratePortalCollectionCards = migrateCardCollectionSave;
