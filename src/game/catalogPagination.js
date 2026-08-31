export const CATALOG_PAGE_SIZES = Object.freeze([12, 24, 48]);
export const createCatalogView = () => ({ page: 1, pageSize: 24, query: '', category: 'all', status: 'all' });

export function normalizeCatalogQuery(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

const searchValue = value => value && typeof value === 'object'
  ? Object.values(value).map(searchValue).join(' ')
  : String(value ?? '');

export function catalogSearchText(item) {
  return searchValue([
    item.id, item.name, item.universe, item.category, item.type, item.tags,
    item.desc, item.description, item.simple?.name, item.secondary?.name, item.special?.name
  ]);
}

// Filtering the entire source before slicing keeps later pages searchable and
// never mutates source order, selected details, deployment or inventory state.
export function paginateCatalog(items, { page = 1, pageSize = 24, query = '', predicate = () => true, getSearchText = catalogSearchText } = {}) {
  const size = CATALOG_PAGE_SIZES.includes(Number(pageSize)) ? Number(pageSize) : 24;
  const words = normalizeCatalogQuery(query).split(/\s+/).filter(Boolean);
  const source = Array.isArray(items) ? items : [];
  const filtered = source.filter(item => {
    if (!predicate(item)) return false;
    if (!words.length) return true;
    const text = normalizeCatalogQuery(getSearchText(item));
    return words.every(word => text.includes(word));
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const requestedPage = Number.isFinite(Number(page)) ? Math.trunc(Number(page)) : 1;
  const safePage = Math.max(1, Math.min(pageCount, requestedPage));
  const start = (safePage - 1) * size;
  return {
    items: filtered.slice(start, start + size),
    page: safePage,
    pageSize: size,
    pageCount,
    total: filtered.length,
    sourceTotal: source.length,
    first: filtered.length ? start + 1 : 0,
    last: Math.min(start + size, filtered.length)
  };
}

export function updateCatalogView(views, key, changes) {
  const current = views[key] || createCatalogView();
  const resetsPage = ['query', 'pageSize', 'category', 'status'].some(field => Object.hasOwn(changes, field));
  return { ...views, [key]: { ...current, ...changes, ...(resetsPage ? { page: 1 } : {}) } };
}
