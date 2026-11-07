import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginateCatalog } from '../src/game/catalogPagination.js';
import { resolveCustomThreatCandidate } from '../src/game/customLobbySelection.js';

const catalog = Object.freeze(Array.from({ length: 330 }, (_, index) => Object.freeze({
  id: `threat-${index}`, name: index === 329 ? 'Émissaire final' : `Sentinelle ${index}`,
  universe: index % 2 ? 'Quartier rouge' : 'Quartier bleu'
})));

test('a filtered-out threat cannot be added through the previous select value', () => {
  const page = paginateCatalog(catalog, { query: 'emissaire final' });
  const candidate = resolveCustomThreatCandidate(page.items, 'threat-10');
  assert.equal(candidate.id, 'threat-329');
  assert.ok(page.items.includes(candidate));
});

test('changing pages selects an available candidate without resurrecting an earlier-page choice', () => {
  const page = paginateCatalog(catalog, { page: 2 });
  assert.equal(resolveCustomThreatCandidate(page.items, 'threat-10').id, 'threat-24');
  assert.equal(resolveCustomThreatCandidate(page.items, 'threat-35').id, 'threat-35');
});

test('a selected enemy disappears from candidates and cannot be added twice', () => {
  const chosen = Object.freeze(['threat-24', 'threat-25']);
  const page = paginateCatalog(catalog, { query: 'Sentinelle 2', predicate: entry => !chosen.includes(entry.id) });
  const candidate = resolveCustomThreatCandidate(page.items, 'threat-24');
  assert.ok(candidate);
  assert.equal(chosen.includes(candidate.id), false);
  assert.deepEqual(chosen, ['threat-24', 'threat-25']);
});

test('empty results expose no actionable candidate', () => {
  const page = paginateCatalog(catalog, { query: 'absent-universe' });
  assert.equal(resolveCustomThreatCandidate(page.items, 'threat-10'), null);
});

test('all threats remain reachable beyond the former 250 entry cutoff', () => {
  const discovered = [];
  const first = paginateCatalog(catalog);
  for (let page = 1; page <= first.pageCount; page++) {
    discovered.push(...paginateCatalog(catalog, { page }).items.map(entry => entry.id));
  }
  assert.deepEqual(discovered, catalog.map(entry => entry.id));
  assert.equal(new Set(discovered).size, catalog.length);
});
