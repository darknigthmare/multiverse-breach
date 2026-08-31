export const normalizePortalSearch = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/gu, '')
  .toLowerCase()
  .trim();

const textValues = value => typeof value === 'string'
  ? value
  : Object.values(value || {}).filter(item => typeof item === 'string').join(' ');

export const buildBoosterCatalogGroups = ({ banners, heroes, originalUniverses, query = '' }) => {
  const search = normalizePortalSearch(query);
  const groups = [
    { id: 'original', banners: [] },
    { id: 'franchise', banners: [] }
  ];
  for (const banner of banners) {
    // Search every matching signature, not just the three names in pack copy.
    const roster = search ? heroes.filter(hero => banner.match(hero)).map(hero => hero.name).join(' ') : '';
    const searchable = `${banner.universe} ${textValues(banner.label)} ${textValues(banner.desc)} ${banner.searchText || ''} ${roster}`;
    if (search && !normalizePortalSearch(searchable).includes(search)) continue;
    const original = banner.scope === 'core'
      || banner.universe === 'Nexus de Convergence'
      || originalUniverses.has(banner.universe);
    groups[original ? 0 : 1].banners.push(banner);
  }
  return groups;
};

export const getRewardCatalogPage = (candidates, { query = '', kind = 'all', page = 0, pageSize = 12 } = {}) => {
  const search = normalizePortalSearch(query);
  const filtered = candidates.filter(reward => (
    (kind === 'all' || reward.kind === kind)
    && (!search || normalizePortalSearch(`${textValues(reward.name)} ${reward.universe} ${reward.kind} ${textValues(reward.desc)}`).includes(search))
  ));
  const size = Math.max(1, Math.min(48, Math.floor(Number(pageSize) || 12)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.max(0, Math.min(pageCount - 1, Math.floor(Number(page) || 0)));
  return {
    items: filtered.slice(safePage * size, (safePage + 1) * size),
    total: filtered.length,
    page: safePage,
    pageCount,
    start: filtered.length ? safePage * size + 1 : 0,
    end: Math.min(filtered.length, (safePage + 1) * size)
  };
};
