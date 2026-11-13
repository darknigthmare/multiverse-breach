import assert from 'node:assert/strict';
import test from 'node:test';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcInstallation } from '../src/game/dlcInstallation.js';
import { getDlcInstallationCatalogPage, getDlcPackContentKinds } from '../src/game/dlcInstallationCatalog.js';

const pack = (id, universe, catalogOrder, registration = 'runtime', modules = []) => ({ id, universe, catalogOrder, registration, modules });
const manifests = [pack('halo', 'Halo', 0), pack('meridien-creux', 'Méridien Creux', 1), pack('gallery', 'Gallery', 2, 'artwork-only')];
const installation = (mode, packIds = []) => createDlcInstallation({
  manifests,
  profile: { schemaVersion: 1, mode, packIds, sharedPolicy: 'preserve-all' }
});
const view = (api, changes) => getDlcInstallationCatalogPage(manifests, { isPackIncluded: api.isDlcPackInstalled, ...changes });

test('base, full and selected editions filter the actual installation API without changing inclusion', () => {
  for (const [mode, selected, expectedIncluded] of [
    ['base', [], []], ['all', [], ['halo', 'meridien-creux', 'gallery']],
    ['selected', ['halo'], ['halo']], ['selected', ['gallery'], ['gallery']]
  ]) {
    const api = installation(mode, selected);
    const included = view(api, { filter: 'installed' });
    const missing = view(api, { filter: 'missing' });
    assert.deepEqual(included.items.map(item => item.id), expectedIncluded);
    assert.deepEqual(missing.items.map(item => item.id), manifests.filter(item => !expectedIncluded.includes(item.id)).map(item => item.id));
    assert.equal(included.total + missing.total, manifests.length);
    assert.deepEqual(view(api, { filter: 'artwork' }).items.map(item => item.id), ['gallery']);
    assert.deepEqual(api.getInstalledDlcPackIds(), expectedIncluded);
  }
});

test('accent-insensitive search sees the full register and clamps a stale page after filtering', () => {
  const source = Array.from({ length: 29 }, (_, index) => pack(`pack-${index}`, `Universe ${index}`, index));
  source[28] = manifests[1];
  for (const query of ['meridien creux', 'MÉRIDIEN CREUX', 'meridien-creux', 'creux meridien']) {
    const result = getDlcInstallationCatalogPage(source, { query, page: 9 });
    assert.deepEqual(result.items, [manifests[1]]);
    assert.equal(result.page, 0);
    assert.equal(result.start, 1);
    assert.equal(result.end, 1);
  }
  const reset = getDlcInstallationCatalogPage(source, { query: '', filter: 'all', page: 0 });
  assert.equal(reset.total, 29);
  assert.equal(reset.items.length, 12);
});

test('twelve-item pages preserve source order, references and immutable inputs', () => {
  const source = Object.freeze(Array.from({ length: 29 }, (_, index) => Object.freeze(pack(`pack-${index}`, `Universe ${index}`, index))));
  const before = JSON.stringify(source);
  const first = getDlcInstallationCatalogPage(source);
  assert.deepEqual(first.items, source.slice(0, 12));
  assert.equal(first.items[0], source[0]);
  assert.deepEqual({ page: first.page, pageCount: first.pageCount, start: first.start, end: first.end }, { page: 0, pageCount: 3, start: 1, end: 12 });
  const middle = getDlcInstallationCatalogPage(source, { page: 1 });
  assert.deepEqual(middle.items, source.slice(12, 24));
  assert.equal(middle.start, 13);
  assert.equal(middle.end, 24);
  const last = getDlcInstallationCatalogPage(source, { page: 99 });
  assert.deepEqual(last.items, source.slice(24));
  assert.equal(last.page, 2);
  assert.equal(last.start, 25);
  assert.equal(last.end, 29);
  assert.equal(JSON.stringify(source), before);
});

test('empty results and invalid saved pages expose bounded, explicit ranges', () => {
  const empty = getDlcInstallationCatalogPage(manifests, { query: 'no such universe', page: 8 });
  assert.deepEqual(empty, { items: [], total: 0, page: 0, pageCount: 1, start: 0, end: 0 });
  for (const page of [-10, NaN, Infinity, 'bad']) assert.equal(getDlcInstallationCatalogPage(manifests, { page }).page, 0);
  assert.deepEqual(getDlcInstallationCatalogPage(null).items, []);
});

test('content families come only from known declarations and never make artwork-only packs playable', () => {
  const declared = pack('declared', 'Declared', 0, 'runtime', [
    { path: 'data/wardrobeOriginals.js' }, { runtimeAdapter: 'src/game/battleItems.js' },
    { path: 'data/lore.js' }, { path: 'data/sourceSceneStages.js' },
    { path: 'data/heroes.js' }, { path: 'data/enemies.js' }, { path: 'data/heroes.js' }
  ]);
  const before = structuredClone(declared);
  assert.deepEqual(getDlcPackContentKinds(declared), ['heroes', 'enemies', 'stages', 'lore', 'items', 'wardrobe']);
  assert.deepEqual(declared, before);
  assert.deepEqual(getDlcPackContentKinds({ ...declared, registration: 'artwork-only' }), []);
  assert.deepEqual(getDlcPackContentKinds(pack('unknown', 'Unknown', 0, 'runtime', [
    { path: 'data/unknownHeroes.js' }, { path: 'data/stageMusicProfiles.js' },
    { path: 'data/wardrobeFuture.js' }, { path: 'assets/heroes.png' }
  ])), []);
  assert.deepEqual(getDlcPackContentKinds(null), []);
});

test('the real Halo manifest declares its content families while artwork-only stays distinct', () => {
  const halo = DLC_PACK_MANIFESTS.find(item => item.id === 'halo');
  const gallery = DLC_PACK_MANIFESTS.find(item => item.registration === 'artwork-only');
  assert.ok(halo && gallery);
  assert.deepEqual(getDlcPackContentKinds(halo), ['heroes', 'enemies', 'stages', 'lore', 'items', 'wardrobe']);
  assert.deepEqual(getDlcPackContentKinds(gallery), []);
});
