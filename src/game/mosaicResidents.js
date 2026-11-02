/** Bounded resident groups, not unlocks. Non-combat identities stay welcome. */
export const MOSAIC_RESIDENT_GROUP_SIZE = 17;
const normalize = value => String(value || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const pageIndex = (value, count) => Math.max(0, Math.min(count - 1, Number.isFinite(value) ? Math.floor(value) : 0));

export function getMosaicResidentCatalog(heroes = [], unlockedIds = [], universe = null) {
  const owned = new Set(Array.isArray(unlockedIds) ? unlockedIds : []);
  const seen = new Set();
  const residents = (Array.isArray(heroes) ? heroes : []).filter(hero => {
    if (!hero?.id || hero.id === 'player_anchor' || !owned.has(hero.id) || seen.has(hero.id)) return false;
    seen.add(hero.id);
    return true;
  });
  return universe ? [...residents.filter(hero => hero.universe === universe), ...residents.filter(hero => hero.universe !== universe)] : residents;
}

export function getMosaicResidentView(residents = [], { group = 0, guideId = null, query = '', page = 0 } = {}) {
  const population = residents.filter(hero => hero.id !== guideId);
  const groupCount = Math.max(1, Math.ceil(population.length / MOSAIC_RESIDENT_GROUP_SIZE));
  const currentGroup = pageIndex(group, groupCount);
  const groups = new Map(population.map((hero, index) => [hero.id, Math.floor(index / MOSAIC_RESIDENT_GROUP_SIZE)]));
  const needle = normalize(query).trim();
  const matches = residents.filter(hero => normalize(`${hero.name} ${hero.universe} ${hero.id}`).includes(needle));
  const pageCount = Math.max(1, Math.ceil(matches.length / 9));
  const currentPage = pageIndex(page, pageCount);
  return {
    group: currentGroup, groupCount,
    groupItems: population.slice(currentGroup * MOSAIC_RESIDENT_GROUP_SIZE, (currentGroup + 1) * MOSAIC_RESIDENT_GROUP_SIZE),
    items: matches.slice(currentPage * 9, (currentPage + 1) * 9).map(hero => ({ hero, group: groups.get(hero.id) ?? currentGroup })),
    total: residents.length, matching: matches.length, page: currentPage, pageCount
  };
}
