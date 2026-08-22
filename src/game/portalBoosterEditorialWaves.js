import { BOOSTER_CARD_COUNT } from './portalBoosterEngine.js';

export const PORTAL_EDITORIAL_WAVE_ID = 'universe-editorial-wave-01';
export const PORTAL_EDITORIAL_WAVE_VERSION = '1.0';
export const PORTAL_EDITORIAL_WAVE_RELEASED_AT = '2026-08-22';

const EDITORIAL_LANES = Object.freeze([
  Object.freeze(['hero', 'character', 'perso']),
  Object.freeze(['equipment', 'event', 'skin', 'kart']),
  Object.freeze(['archive', 'hud', 'portalEffect', 'profileBanner', 'profileTitle']),
  Object.freeze(['fieldSuper', 'npcAssist', 'koEffect']),
  Object.freeze(['battleMusic', 'stageMusic', 'introPose', 'victoryPose'])
]);

const hashText = (value) => String(value).split('').reduce(
  (hash, character) => ((hash * 33) + character.charCodeAt(0)) >>> 0,
  5381
);

const deterministicCandidateSort = (universe, laneIndex) => (candidateA, candidateB) => {
  const hashA = hashText(`${universe}:${laneIndex}:${candidateA.id}`);
  const hashB = hashText(`${universe}:${laneIndex}:${candidateB.id}`);
  return hashA - hashB || String(candidateA.id).localeCompare(String(candidateB.id));
};

const freezeLocalizedSummary = (universe) => Object.freeze({
  fr: `Cinq cartes existantes de ${universe}, sélectionnées exclusivement dans son pool runtime.`,
  en: `Five existing ${universe} cards selected exclusively from its runtime pool.`
});

/**
 * Builds the deterministic five-card editorial spotlight used by standard
 * universe boosters. It never creates rewards: every selected id must already
 * belong to the supplied runtime candidate pool.
 */
export const createUniverseBoosterEditorialWave = ({
  packId,
  universe,
  candidates
}) => {
  if (!packId || !universe || !Array.isArray(candidates)) return null;

  const exclusiveCandidates = candidates.filter(candidate => (
    candidate
    && candidate.id !== undefined
    && candidate.id !== null
    && candidate.universe === universe
  ));
  const candidatesById = new Map();
  exclusiveCandidates.forEach(candidate => {
    if (!candidatesById.has(candidate.id)) candidatesById.set(candidate.id, candidate);
  });
  const uniqueCandidates = [...candidatesById.values()];
  if (uniqueCandidates.length < BOOSTER_CARD_COUNT) return null;

  const selected = [];
  const selectedIds = new Set();
  const addFirstAvailable = (pool) => {
    const candidate = pool.find(entry => !selectedIds.has(entry.id));
    if (!candidate) return;
    selected.push(candidate);
    selectedIds.add(candidate.id);
  };

  EDITORIAL_LANES.forEach((kinds, laneIndex) => {
    const kindSet = new Set(kinds);
    addFirstAvailable(
      uniqueCandidates
        .filter(candidate => kindSet.has(candidate.kind))
        .sort(deterministicCandidateSort(universe, laneIndex))
    );
  });

  const fallbackPool = [...uniqueCandidates].sort(
    deterministicCandidateSort(universe, EDITORIAL_LANES.length)
  );
  while (selected.length < BOOSTER_CARD_COUNT) addFirstAvailable(fallbackPool);

  const featuredCardIds = Object.freeze(selected.map(candidate => candidate.id));
  return Object.freeze({
    id: PORTAL_EDITORIAL_WAVE_ID,
    packId,
    waveId: PORTAL_EDITORIAL_WAVE_ID,
    version: PORTAL_EDITORIAL_WAVE_VERSION,
    releasedAt: PORTAL_EDITORIAL_WAVE_RELEASED_AT,
    type: 'editorial-wave',
    source: 'existing-runtime-candidates',
    universe,
    summary: freezeLocalizedSummary(universe),
    changelog: Object.freeze({
      fr: 'Sélection éditoriale déterministe, sans nouvelle carte ni asset de remplacement.',
      en: 'Deterministic editorial selection with no new card or replacement asset.'
    }),
    featuredCardIds,
    // Compatibility with the established content-update presentation contract.
    newCardIds: featuredCardIds,
    cards: Object.freeze([])
  });
};

export const resolvePortalBoosterEditorialWave = ({
  packId,
  universe,
  candidates,
  authoredUpdate = null
}) => authoredUpdate || createUniverseBoosterEditorialWave({
  packId,
  universe,
  candidates
});
