export const normalizeCollectionSearch = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase();

/** Shared by the library and binder: a visible filter always has the same scope. */
export function matchesCollectionCard(definition, cards = {}, filters = {}) {
  const entry = cards[definition.id];
  if (filters.selectedUniverse && filters.selectedUniverse !== 'all' && definition.universe !== filters.selectedUniverse) return false;
  if (filters.rarity && filters.rarity !== 'all' && definition.rarityId !== filters.rarity) return false;
  if (filters.kind && filters.kind !== 'all' && definition.kind !== filters.kind) return false;
  if (filters.canonStatus && filters.canonStatus !== 'all' && definition.canonStatus !== filters.canonStatus) return false;
  if (filters.ownedOnly && !entry) return false;
  if (filters.favoritesOnly && !entry?.favorite) return false;
  const query = normalizeCollectionSearch(filters.query).trim();
  return !query || normalizeCollectionSearch(definition.searchText || definition.universe).includes(query);
}

/** Completion stays based on the entire set, while matches describe the active filters. */
export function buildCollectionUniverseSummaries(definitions, cards = {}, filters = {}, lang = 'fr') {
  const byUniverse = new Map();
  for (const definition of definitions) {
    const summary = byUniverse.get(definition.universe) || {
      universe: definition.universe, total: 0, owned: 0, anomalies: 0,
      favorites: 0, pilot: false, matching: 0, matchingOwned: 0
    };
    const entry = cards[definition.id];
    summary.total += 1;
    summary.owned += Number(Boolean(entry));
    summary.anomalies += Number(Boolean(entry && definition.rarityId === 'anomaly'));
    summary.favorites += Number(Boolean(entry?.favorite));
    summary.pilot ||= definition.visualStatus === 'pilot';
    if (matchesCollectionCard(definition, cards, filters)) {
      summary.matching += 1;
      summary.matchingOwned += Number(Boolean(entry));
    }
    byUniverse.set(definition.universe, summary);
  }
  return [...byUniverse.values()].sort((a, b) => b.favorites - a.favorites || b.owned - a.owned || a.universe.localeCompare(b.universe, lang));
}
