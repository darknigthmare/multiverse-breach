/**
 * Logical contracts for collectible cards.
 *
 * Card definitions only keep references to runtime art and unlockables. The
 * actual assets/objects live in the catalogs produced by cardCatalog.js.
 */

export const CARD_KINDS = Object.freeze([
  'character',
  'weapon',
  'decor',
  'scene',
  'action',
  'fanArt',
  'whatIf',
  'portal',
  'ko',
  'intro',
  'victory',
  'defeat',
  'hud',
  'archive'
]);

export const CARD_CANON_STATUSES = Object.freeze([
  'canon',
  'canon-inspired',
  'nexus-variant',
  'what-if'
]);

export const CARD_RARITIES = Object.freeze([
  'stable',
  'rare',
  'epic',
  'anomaly'
]);

export const CARD_AGE_GATES = Object.freeze([
  'family',
  'teen',
  'adultNonExplicit'
]);

export const CARD_RARITY_DEFINITIONS = Object.freeze({
  stable: Object.freeze({ id: 'stable', dropWeight: 58, color: '#9fb6bb' }),
  rare: Object.freeze({ id: 'rare', dropWeight: 28, color: '#3498db' }),
  epic: Object.freeze({ id: 'epic', dropWeight: 11, color: '#9b59b6' }),
  anomaly: Object.freeze({ id: 'anomaly', dropWeight: 3, color: '#ffb000' })
});

const CARD_KIND_SET = new Set(CARD_KINDS);
const CARD_CANON_STATUS_SET = new Set(CARD_CANON_STATUSES);
const CARD_RARITY_SET = new Set(CARD_RARITIES);
const CARD_AGE_GATE_SET = new Set(CARD_AGE_GATES);

const requireText = (value, fieldName) => {
  const text = String(value ?? '').trim();
  if (!text) throw new TypeError(`${fieldName} must be a non-empty string.`);
  return text;
};

const optionalText = (value) => {
  if (value === null || value === undefined || value === '') return null;
  return requireText(value, 'value');
};

const encodeIdSegment = (value, fieldName) => encodeURIComponent(requireText(value, fieldName));

export const normalizeCardRarityId = (rarityId) => {
  const normalized = String(rarityId ?? '').trim().toLowerCase();
  if (normalized === 'common') return 'stable';
  if (normalized === 'epique' || normalized === 'épique') return 'epic';
  if (normalized === 'anomalie') return 'anomaly';
  return CARD_RARITY_SET.has(normalized) ? normalized : 'stable';
};

/**
 * Universe and reward kind are deliberately part of the identity. Some source
 * databases reuse a hero id in more than one continuity.
 */
export const buildCardId = ({ universe, kind, rewardId }) => (
  `card:${encodeIdSegment(universe, 'universe')}:${encodeIdSegment(kind, 'kind')}:${encodeIdSegment(rewardId, 'rewardId')}`
);

export const buildCardSetId = ({ universe, edition = 'base-01' }) => (
  `set:${encodeIdSegment(universe, 'universe')}:${encodeIdSegment(edition, 'edition')}`
);

const freezeTextMap = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value ?? null;
  return Object.freeze({ ...value });
};

export const createCardDefinition = (input = {}) => {
  const universe = requireText(input.universe, 'universe');
  const kind = requireText(input.kind, 'kind');
  if (!CARD_KIND_SET.has(kind)) throw new TypeError(`Unsupported card kind: ${kind}.`);

  const rewardKind = requireText(input.rewardKind ?? kind, 'rewardKind');
  const rewardId = requireText(input.rewardId, 'rewardId');
  const rarityId = normalizeCardRarityId(input.rarityId);
  const canonStatus = input.canonStatus ?? 'canon-inspired';
  if (!CARD_CANON_STATUS_SET.has(canonStatus)) {
    throw new TypeError(`Unsupported canonStatus: ${canonStatus}.`);
  }

  const ageGate = input.ageGate ?? 'family';
  if (!CARD_AGE_GATE_SET.has(ageGate)) throw new TypeError(`Unsupported ageGate: ${ageGate}.`);

  const number = Number(input.number);
  if (!Number.isInteger(number) || number < 1) {
    throw new TypeError('number must be a positive integer.');
  }

  const rarity = CARD_RARITY_DEFINITIONS[rarityId];
  const dropWeight = Number(input.dropWeight ?? rarity.dropWeight);
  if (!Number.isFinite(dropWeight) || dropWeight < 0) {
    throw new TypeError('dropWeight must be a finite non-negative number.');
  }

  const id = input.id || buildCardId({ universe, kind: rewardKind, rewardId });
  const definition = {
    id: requireText(id, 'id'),
    setId: requireText(input.setId, 'setId'),
    number,
    universe,
    characterId: optionalText(input.characterId),
    kind,
    rewardKind,
    rewardId,
    canonStatus,
    rarityId,
    dropWeight,
    color: input.color || rarity.color,
    tags: Object.freeze(Array.isArray(input.tags) ? [...new Set(input.tags.map(String))] : []),
    name: freezeTextMap(input.name),
    lore: freezeTextMap(input.lore),
    artId: optionalText(input.artId),
    unlockableId: optionalText(input.unlockableId),
    credits: input.credits ?? null,
    sourceRefs: Object.freeze(Array.isArray(input.sourceRefs) ? [...input.sourceRefs] : []),
    contentWarnings: Object.freeze(Array.isArray(input.contentWarnings) ? [...input.contentWarnings] : []),
    ageGate
  };

  return Object.freeze(definition);
};

export const SET_COMPLETION_MILESTONES = Object.freeze([10, 25, 50, 75, 90, 100]);

export const createCardSetDefinition = (input = {}) => {
  const id = requireText(input.id, 'id');
  const universe = requireText(input.universe, 'universe');
  const edition = requireText(input.edition ?? 'base-01', 'edition');
  const cardIds = Array.isArray(input.cardIds) ? [...new Set(input.cardIds.map(String))] : [];
  const chaseCardIds = Array.isArray(input.chaseCardIds)
    ? [...new Set(input.chaseCardIds.map(String))]
    : [];
  const pageSize = Number(input.pageSize ?? 9);
  if (![9, 12].includes(pageSize)) throw new TypeError('pageSize must be 9 or 12.');

  const completionRewards = Array.isArray(input.completionRewards)
    ? input.completionRewards.map((reward) => Object.freeze({ ...reward }))
    : [];

  return Object.freeze({
    id,
    universe,
    edition,
    releaseDate: optionalText(input.releaseDate),
    cardIds: Object.freeze(cardIds),
    chaseCardIds: Object.freeze(chaseCardIds),
    pageSize,
    coverArtId: optionalText(input.coverArtId),
    palette: input.palette && typeof input.palette === 'object'
      ? Object.freeze({ ...input.palette })
      : null,
    completionRewards: Object.freeze(completionRewards)
  });
};

export const validateCardDefinition = (definition) => {
  try {
    createCardDefinition(definition);
    return Object.freeze({ valid: true, errors: Object.freeze([]) });
  } catch (error) {
    return Object.freeze({ valid: false, errors: Object.freeze([error.message]) });
  }
};

export const validateCardSetDefinition = (definition) => {
  try {
    createCardSetDefinition(definition);
    return Object.freeze({ valid: true, errors: Object.freeze([]) });
  } catch (error) {
    return Object.freeze({ valid: false, errors: Object.freeze([error.message]) });
  }
};
