import identities from '../../DLC/content-identities.json' with { type: 'json' };
import profile from '../../DLC/distribution.json' with { type: 'json' };

export function createDlcContentIdentity(data, { allowFallback = false } = {}) {
  if (data?.schemaVersion !== 1) throw new Error('Unsupported DLC content identity schema');
  const indexes = {};
  for (const kind of ['expandedUniverses', 'generatedCharacterArcs', 'universeArcs']) {
    const entries = Object.entries(data.indexes?.[kind] || {});
    const positions = new Set();
    for (const [key, index] of entries) {
      if (!key || !Number.isSafeInteger(index) || index < 0 || positions.has(index)) {
        throw new Error(`Invalid stable DLC index: ${kind}/${key}`);
      }
      positions.add(index);
    }
    indexes[kind] = new Map(entries);
  }
  const getStableContentIndex = (kind, key, fallbackIndex) => {
    const mapping = indexes[kind];
    if (!mapping) throw new Error(`Unknown DLC identity category: ${kind}`);
    if (mapping.has(key)) return mapping.get(key);
    if (allowFallback && Number.isSafeInteger(fallbackIndex) && fallbackIndex >= 0) return fallbackIndex;
    throw new Error(`Missing stable content identity: ${kind}/${key}. Regenerate identities from the complete catalogue.`);
  };
  return Object.freeze({
    getStableContentIndex,
    getStableUniverseArcStageId: (arcId, fallbackIndex) => 40000 + getStableContentIndex('universeArcs', arcId, fallbackIndex)
  });
}
const contentIdentity = createDlcContentIdentity(identities, { allowFallback: profile.mode === 'all' });
export const getStableContentIndex = contentIdentity.getStableContentIndex;
export const getStableUniverseArcStageId = contentIdentity.getStableUniverseArcStageId;
export const KNOWN_DLC_HERO_IDS = Object.freeze([...identities.knownHeroIds]);
export const OC_DLC_SAVE_METADATA = Object.freeze(identities.ocPacks.map(pack => Object.freeze({
  ...pack, missionIds: Object.freeze([...pack.missionIds])
})));
export const KNOWN_ARC_REPLAY_DEFINITIONS = Object.freeze(identities.arcReplayDefinitions.map(arc => Object.freeze({
  ...arc, finalStageIds: Object.freeze([...arc.finalStageIds])
})));
