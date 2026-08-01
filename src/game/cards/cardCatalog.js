import { getHeroSpriteSheetSrc, getItemSpriteSrc } from '../spriteAssets.js';
import {
  buildCardId,
  buildCardSetId,
  createCardDefinition,
  normalizeCardRarityId
} from './cardSchema.js';

/** Portal reward kinds are translated without changing their runtime identity. */
export const PORTAL_REWARD_KIND_TO_CARD_KIND = Object.freeze({
  hero: 'character',
  equipment: 'weapon',
  event: 'archive',
  skin: 'fanArt',
  archive: 'decor',
  kart: 'archive',
  battleMusic: 'archive',
  stageMusic: 'archive',
  fieldSuper: 'action',
  npcAssist: 'action',
  koEffect: 'ko',
  portalEffect: 'portal',
  introPose: 'intro',
  victoryPose: 'victory',
  profileBanner: 'archive',
  profileTitle: 'archive',
  hud: 'hud'
});

const NON_UNLOCKABLE_REWARD_KINDS = new Set([
  'hero', 'equipment', 'event', 'skin', 'archive', 'hud'
]);

const encodeSegment = (value) => encodeURIComponent(String(value));

export const buildCardArtId = ({ universe, rewardKind, rewardId }) => (
  `art:${encodeSegment(universe)}:${encodeSegment(rewardKind)}:${encodeSegment(rewardId)}`
);

export const buildCardUnlockableId = ({ universe, rewardKind, rewardId }) => (
  `unlockable:${encodeSegment(universe)}:${encodeSegment(rewardKind)}:${encodeSegment(rewardId)}`
);

const getCandidateRarityId = (candidate) => normalizeCardRarityId(
  candidate.rarityId ?? candidate.rarity?.id
);

const getCandidateDropWeight = (candidate) => {
  const value = Number(candidate.dropWeight ?? candidate.rarity?.weight);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

const getCandidateRewardId = (candidate) => {
  const value = candidate?.rewardId ?? candidate?.id;
  return String(value ?? '').trim();
};

const getCandidateCanonStatus = (candidate, cardKind) => {
  if (candidate.canonStatus) return candidate.canonStatus;
  if (cardKind === 'whatIf') return 'what-if';
  if (['fanArt', 'portal', 'ko', 'intro', 'victory', 'defeat', 'hud'].includes(cardKind)) {
    return 'nexus-variant';
  }
  return 'canon-inspired';
};

const freezeAsset = (asset) => {
  if (!asset) return null;
  return Object.freeze({
    ...asset,
    focalPoint: asset.focalPoint && typeof asset.focalPoint === 'object'
      ? Object.freeze({ ...asset.focalPoint })
      : null,
    safeArea: asset.safeArea && typeof asset.safeArea === 'object'
      ? Object.freeze({ ...asset.safeArea })
      : null
  });
};

const getBackdropFallback = (candidate, options) => {
  const universe = candidate.universe;
  const configured = options.backdropByUniverse?.[universe];
  if (configured) return configured;
  return candidate.backdrop || options.defaultBackdrop || null;
};

/**
 * Resolves the same project-backed art families already used by PortalScreen:
 * portraits, item sprites, stage backdrops and OpenAI cosmetic atlases.
 */
export const getPortalCandidateArtAsset = (candidate, options = {}) => {
  const rewardKind = String(candidate?.kind ?? '');
  const rewardId = getCandidateRewardId(candidate);
  const universe = String(candidate?.universe ?? '').trim();
  const data = candidate?.data || {};
  const explicitArt = candidate?.art && typeof candidate.art === 'object'
    ? candidate.art
    : null;
  const artId = buildCardArtId({ universe, rewardKind, rewardId });

  if (explicitArt?.image || explicitArt?.sheet) {
    return freezeAsset({ id: artId, family: explicitArt.family || 'project', ...explicitArt });
  }

  if (rewardKind === 'hero' || rewardKind === 'skin') {
    const hero = data.hero || {};
    const skin = data.skin || {};
    const image = skin.portrait || skin.image || hero.portrait || hero.collectionPortrait
      || hero.image || getHeroSpriteSheetSrc(hero, 'collection');
    return image
      ? freezeAsset({
          id: artId,
          family: 'portrait',
          image,
          source: hero.portrait || skin.portrait ? 'project-portrait' : 'project-sprite',
          focalPoint: candidate.focalPoint || null,
          safeArea: candidate.safeArea || null
        })
      : null;
  }

  if (rewardKind === 'equipment' || rewardKind === 'event') {
    const item = data.item || {};
    const image = item.icon || item.image || item.sprite || getItemSpriteSrc(item);
    return image
      ? freezeAsset({ id: artId, family: 'item', image, source: 'project-item' })
      : null;
  }

  if (rewardKind === 'archive') {
    const image = data.image || candidate.backdrop || getBackdropFallback(candidate, options);
    return image
      ? freezeAsset({ id: artId, family: 'backdrop', image, source: data.source || 'project-backdrop' })
      : null;
  }

  if (rewardKind === 'hud') {
    const image = data.frame || data.image || getBackdropFallback(candidate, options);
    return image
      ? freezeAsset({
          id: artId,
          family: 'cosmetic',
          image,
          backdrop: data.image && data.image !== image ? data.image : null,
          source: data.source || 'project-cosmetic'
        })
      : null;
  }

  const unlockable = data.unlockable || data;
  const visual = unlockable.visual || unlockable.animation || {};
  const image = visual.image || visual.sheet || unlockable.image;
  if (image) {
    return freezeAsset({
      id: artId,
      family: 'cosmetic',
      image: visual.image || null,
      sheet: visual.sheet || null,
      source: visual.source || unlockable.source || 'project-cosmetic',
      columns: visual.columns,
      rows: visual.rows,
      frames: visual.frames,
      row: visual.row
    });
  }

  const backdrop = getBackdropFallback(candidate, options);
  return backdrop
    ? freezeAsset({ id: artId, family: 'backdrop', image: backdrop, source: 'project-backdrop' })
    : null;
};

const makeDiagnostic = (code, severity, details = {}) => Object.freeze({
  code,
  severity,
  ...details
});

/** Converts one PortalScreen candidate while keeping asset objects separate. */
export const createCardDefinitionFromPortalCandidate = (candidate, options = {}) => {
  const diagnostics = [];
  const rewardKind = String(candidate?.kind ?? '').trim();
  const cardKind = PORTAL_REWARD_KIND_TO_CARD_KIND[rewardKind];
  const rewardId = getCandidateRewardId(candidate);
  const universe = String(candidate?.universe ?? options.universe ?? '').trim();
  const number = Number(options.number ?? 1);

  if (!cardKind) {
    diagnostics.push(makeDiagnostic('unsupported-portal-reward-kind', 'error', {
      rewardKind,
      rewardId,
      universe
    }));
    return Object.freeze({
      definition: null,
      artAsset: null,
      unlockableEntry: null,
      diagnostics: Object.freeze(diagnostics)
    });
  }

  if (!rewardId || !universe) {
    diagnostics.push(makeDiagnostic('invalid-portal-candidate-identity', 'error', {
      rewardKind,
      rewardId,
      universe
    }));
    return Object.freeze({
      definition: null,
      artAsset: null,
      unlockableEntry: null,
      diagnostics: Object.freeze(diagnostics)
    });
  }

  const setId = options.setId
    || options.setIdByUniverse?.[universe]
    || buildCardSetId({ universe, edition: options.edition || 'base-01' });
  const artAsset = getPortalCandidateArtAsset({ ...candidate, universe }, options);
  if (!artAsset) {
    diagnostics.push(makeDiagnostic('missing-project-card-art', 'warning', {
      rewardKind,
      rewardId,
      universe
    }));
  }

  const unlockable = NON_UNLOCKABLE_REWARD_KINDS.has(rewardKind)
    ? null
    : candidate.data?.unlockable || null;
  const unlockableId = unlockable
    ? buildCardUnlockableId({ universe, rewardKind, rewardId })
    : null;
  const hero = candidate.data?.hero;
  const skin = candidate.data?.skin;

  try {
    const definition = createCardDefinition({
      id: buildCardId({ universe, kind: rewardKind, rewardId }),
      setId,
      number,
      universe,
      characterId: rewardKind === 'hero'
        ? rewardId
        : rewardKind === 'skin'
          ? skin?.heroId || hero?.id || null
          : candidate.characterId || null,
      kind: cardKind,
      rewardKind,
      rewardId,
      canonStatus: getCandidateCanonStatus(candidate, cardKind),
      rarityId: getCandidateRarityId(candidate),
      dropWeight: getCandidateDropWeight(candidate),
      color: candidate.color || candidate.rarity?.color,
      tags: candidate.tags,
      name: candidate.name,
      lore: candidate.lore || candidate.data?.lore,
      artId: artAsset?.id || null,
      unlockableId,
      credits: candidate.credits,
      sourceRefs: candidate.sourceRefs,
      contentWarnings: candidate.contentWarnings,
      ageGate: candidate.ageGate
    });

    const unlockableEntry = unlockable
      ? Object.freeze({ id: unlockableId, rewardKind, rewardId, universe, value: unlockable })
      : null;
    return Object.freeze({
      definition,
      artAsset,
      unlockableEntry,
      diagnostics: Object.freeze(diagnostics)
    });
  } catch (error) {
    diagnostics.push(makeDiagnostic('invalid-card-definition', 'error', {
      rewardKind,
      rewardId,
      universe,
      message: error.message
    }));
    return Object.freeze({
      definition: null,
      artAsset,
      unlockableEntry: null,
      diagnostics: Object.freeze(diagnostics)
    });
  }
};

/**
 * Builds deterministic card/art/unlockable records from PortalScreen candidates.
 * A true identity collision is reported and skipped; no suffix id is invented.
 */
export const createCardCatalogFromPortalCandidates = (candidates, options = {}) => {
  if (!Array.isArray(candidates)) throw new TypeError('candidates must be an array.');

  const definitions = [];
  const cardsById = {};
  const artById = {};
  const unlockablesById = {};
  const diagnostics = [];
  const nextNumberBySet = new Map();

  candidates.forEach((candidate, candidateIndex) => {
    const universe = String(candidate?.universe ?? options.universe ?? '').trim();
    const setId = options.setId
      || options.setIdByUniverse?.[universe]
      || (universe ? buildCardSetId({ universe, edition: options.edition || 'base-01' }) : null);
    const number = setId ? (nextNumberBySet.get(setId) || 1) : 1;
    const converted = createCardDefinitionFromPortalCandidate(candidate, {
      ...options,
      setId,
      number
    });
    diagnostics.push(...converted.diagnostics.map((diagnostic) => Object.freeze({
      ...diagnostic,
      candidateIndex
    })));

    const definition = converted.definition;
    if (!definition) return;
    if (cardsById[definition.id]) {
      diagnostics.push(makeDiagnostic('card-id-collision', 'error', {
        candidateIndex,
        cardId: definition.id,
        universe: definition.universe,
        rewardKind: definition.rewardKind,
        rewardId: definition.rewardId
      }));
      return;
    }

    definitions.push(definition);
    cardsById[definition.id] = definition;
    nextNumberBySet.set(definition.setId, number + 1);
    if (converted.artAsset) artById[converted.artAsset.id] = converted.artAsset;
    if (converted.unlockableEntry) {
      unlockablesById[converted.unlockableEntry.id] = converted.unlockableEntry;
    }
  });

  const frozenDefinitions = Object.freeze(definitions);
  const frozenCardsById = Object.freeze(cardsById);
  const frozenArtById = Object.freeze(artById);
  const frozenUnlockablesById = Object.freeze(unlockablesById);
  return Object.freeze({
    definitions: frozenDefinitions,
    cards: frozenDefinitions,
    cardsById: frozenCardsById,
    byId: frozenCardsById,
    artById: frozenArtById,
    unlockablesById: frozenUnlockablesById,
    diagnostics: Object.freeze(diagnostics)
  });
};

export const buildCardCatalogFromPortalCandidates = createCardCatalogFromPortalCandidates;

export const findCardDefinitionsByReward = (catalog, rewardKind, rewardId) => {
  const definitions = Array.isArray(catalog)
    ? catalog
    : catalog?.definitions || catalog?.cards || Object.values(catalog || {});
  return definitions.filter((definition) => (
    definition?.rewardKind === rewardKind && definition?.rewardId === rewardId
  ));
};

// Runtime integration can replace this empty base with generated pilot catalogs.
export const CARD_CATALOG = Object.freeze({});
