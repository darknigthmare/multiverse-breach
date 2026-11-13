import { paginateCatalog } from './catalogPagination.js';

const contentModules = [
  ['heroes', new Set(['heroes.js'])],
  ['enemies', new Set(['enemies.js'])],
  ['stages', new Set(['stages.js', 'legacyStages.js', 'sourceSceneStages.js', 'canonPriorityStages.js', 'expandedUniverses.js', 'ocDlcPacks.js'])],
  ['lore', new Set(['lore.js', 'loreDescriptions.js', 'canonicalArchiveLore.js'])],
  ['items', new Set(['battleItems.js'])],
  ['wardrobe', new Set([
    'wardrobe.js', 'wardrobeExpansion.js', 'wardrobeOriginals.js', 'wardrobeOfficial.js',
    'wardrobeOfficialR7.js', 'wardrobeOfficialR9.js', 'wardrobeOfficialR10.js',
    'wardrobeOfficialR11.js', 'wardrobeOfficialR12.js', 'wardrobeOfficialR13.js', 'wardrobeOfficialR14.js'
  ])]
];

/** Describe declared content families, never the number of actors or media files. */
export function getDlcPackContentKinds(pack) {
  if (pack?.registration !== 'runtime') return [];
  const declared = new Set((Array.isArray(pack.modules) ? pack.modules : []).flatMap(module => (
    [module?.path, module?.runtimeAdapter].filter(path => typeof path === 'string').map(path => path.split('/').at(-1))
  )));
  return contentModules.filter(([, names]) => [...names].some(name => declared.has(name))).map(([kind]) => kind);
}

/** Read-only projection of the installation register; page indexes are zero-based. */
export function getDlcInstallationCatalogPage(manifests, {
  query = '', filter = 'all', page = 0, isPackIncluded = () => false
} = {}) {
  const requestedPage = Number.isFinite(Number(page)) ? Math.trunc(Number(page)) : 0;
  const result = paginateCatalog(manifests, {
    page: requestedPage + 1,
    pageSize: 12,
    query,
    getSearchText: pack => `${pack.universe} ${pack.id}`,
    predicate: pack => {
      if (filter === 'installed') return Boolean(isPackIncluded(pack.id));
      if (filter === 'missing') return !isPackIncluded(pack.id);
      if (filter === 'artwork') return pack.registration === 'artwork-only';
      return true;
    }
  });
  return {
    items: result.items,
    total: result.total,
    page: result.page - 1,
    pageCount: result.pageCount,
    start: result.first,
    end: result.last
  };
}
