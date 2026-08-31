import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { CATALOG_PAGE_SIZES, catalogSearchText, createCatalogView, normalizeCatalogQuery, paginateCatalog, updateCatalogView } from '../src/game/catalogPagination.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = Array.from({ length: 501 }, (_, index) => ({ id: 'hero-' + index, name: 'Hero ' + index, universe: index % 2 ? 'Nexus' : 'Alien', category: index % 3 ? 'marine' : 'hacker' }));
let vite;
let CatalogPagination;

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: CatalogPagination } = await vite.ssrLoadModule('/src/components/CatalogPagination.jsx?catalog-pagination-tests'));
});
after(async () => { await vite?.close(); });

test('catalog pages default to 24 and offer only bounded 12/24/48 sizes', () => {
  assert.deepEqual(CATALOG_PAGE_SIZES, [12, 24, 48]);
  assert.equal(createCatalogView().pageSize, 24);
  for (const pageSize of [12, 24, 48, 10000, -1, 'bad']) {
    const result = paginateCatalog(source, { pageSize });
    assert.equal(result.items.length, CATALOG_PAGE_SIZES.includes(pageSize) ? pageSize : 24);
    assert.ok(result.items.length <= 48);
  }
});

test('search sees the full catalog before pagination, including its final entry', () => {
  const page = paginateCatalog(source, { page: 20, query: 'Hero 500' });
  assert.equal(page.page, 1);
  assert.equal(page.total, 1);
  assert.equal(page.sourceTotal, 501);
  assert.equal(page.items[0].id, 'hero-500');
});

test('query normalizes accents and case across localized names, universes and abilities', () => {
  assert.equal(normalizeCatalogQuery('  RÉSERVE '), 'reserve');
  const item = { id: 'mirelle', name: { fr: 'Mémoire de Trame', en: 'Thread Memory' }, universe: 'Nexus de Convergence', category: 'hacker', secondary: { name: 'Patch de Trame' } };
  assert.match(catalogSearchText(item), /Thread Memory/);
  assert.equal(paginateCatalog([item], { query: 'memoire NEXUS' }).total, 1);
  assert.equal(paginateCatalog([item], { query: 'thread patch' }).total, 1);
  assert.equal(paginateCatalog([item], { query: 'memoire absent' }).total, 0);
});

test('filters are applied before page size so complete matching pages stay reachable', () => {
  const page = paginateCatalog(source, { page: 2, pageSize: 12, query: 'Alien', predicate: item => item.category === 'hacker' });
  const expected = source.filter(item => item.universe === 'Alien' && item.category === 'hacker');
  assert.equal(page.total, expected.length);
  assert.deepEqual(page.items, expected.slice(12, 24));
  assert.equal(page.first, 13);
  assert.equal(page.last, 24);
});

test('page bounds survive empty/shrinking catalogs and invalid saved cursors', () => {
  const last = paginateCatalog(source, { page: 999 });
  assert.equal(last.page, 21);
  assert.equal(last.items.length, 21);
  assert.equal(last.last, 501);
  const shrunk = paginateCatalog(source.slice(0, 26), { page: last.page });
  assert.equal(shrunk.page, 2);
  assert.equal(shrunk.items.length, 2);
  for (const page of [-1, 0, Number.NaN, 'bad', Infinity]) assert.equal(paginateCatalog(source, { page }).page, 1);
  const empty = paginateCatalog([], { page: 44 });
  assert.equal(empty.page, 1);
  assert.equal(empty.pageCount, 1);
  assert.equal(empty.first, 0);
  assert.equal(empty.last, 0);
});

test('changing a catalog only resets its page and never another view or selected details', () => {
  const views = {
    roster: { ...createCatalogView(), page: 4 },
    inventory: { ...createCatalogView(), page: 7, query: 'Nexus' },
    selectedHeroId: 'mirelle'
  };
  const original = structuredClone(views);
  for (const changes of [{ query: 'Alien' }, { pageSize: 48 }, { category: 'hacker' }, { status: 'reserve' }]) {
    const updated = updateCatalogView(views, 'roster', changes);
    assert.equal(updated.roster.page, 1);
    assert.equal(updated.inventory, views.inventory);
    assert.equal(updated.selectedHeroId, 'mirelle');
  }
  assert.equal(updateCatalogView(views, 'roster', { page: 5 }).roster.page, 5);
  assert.deepEqual(views, original, 'state helper mutated its caller');
});

test('catalog slicing preserves source identity and order', () => {
  const originalIds = source.map(item => item.id);
  const page = paginateCatalog(source, { page: 2 });
  assert.equal(page.items[0], source[24]);
  assert.deepEqual(source.map(item => item.id), originalIds);
});

test('pagination renders labeled search, page size, explicit ranges and bounded buttons', () => {
  const props = { catalogId: 'roster', title: 'Résonance', lang: 'fr', page: paginateCatalog(source), query: '', onQueryChange() {}, onPageChange() {}, onPageSizeChange() {} };
  const html = renderToStaticMarkup(React.createElement(CatalogPagination, props));
  assert.match(html, /type="search"/);
  assert.match(html, /<label[^>]*for="[^"]+"/);
  assert.match(html, /1–24 \/ 501/);
  assert.match(html, /aria-label="Première page"/);
  assert.match(html, /<option value="24" selected="">24/);
  assert.match(html, /aria-live="polite"/);
  assert.equal((html.match(/disabled=""/g) || []).length, 2);
  const empty = renderToStaticMarkup(React.createElement(CatalogPagination, { ...props, page: paginateCatalog([]) }));
  assert.match(empty, /Aucun résultat/);
  assert.equal((empty.match(/disabled=""/g) || []).length, 4);
});

test('Hub wires independent roster/reserve/armory/shop pagination without replacing selected details', async () => {
  const hub = readFileSync(path.join(root, 'src/components/HubScreen.jsx'), 'utf8');
  for (const key of ['roster', 'reserve', 'arsenalHeroes', 'inventory', 'shop']) assert.match(hub, new RegExp("getCatalogControlsProps\\('" + key + "'"));
  for (const key of ['rosterPage', 'reservePage', 'arsenalHeroesPage', 'inventoryPage', 'shopPage']) assert.match(hub, new RegExp(key + '\\.items'));
  assert.match(hub, /const selectedHero = HEROES_DB\.find\(h => h\.id === selectedHeroId\)/);
  assert.doesNotMatch(hub, /setSelectedHeroId\((?:rosterPage|arsenalHeroesPage)/);
  const transformed = await vite.transformRequest('/src/components/HubScreen.jsx');
  assert.ok(transformed?.code.includes('CatalogPagination'), 'Hub JSX failed to compile');
});
