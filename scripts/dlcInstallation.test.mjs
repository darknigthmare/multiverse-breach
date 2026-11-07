import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDlcInstallation } from '../src/game/dlcInstallation.js';
import { createDlcContentIdentity } from '../src/game/dlcContentIdentity.js';
import { appendStableIndexes, mergeReplayIdentities } from './buildDlcContentIdentities.mjs';
import { renderDlcRegistry } from './buildDlcRegistry.mjs';

const manifests = [
  { id: 'halo', universe: 'Halo', registration: 'runtime', catalogOrder: 2, directory: 'DLC/Halo', modules: [{ path: 'data/heroes.js' }] },
  { id: 'aliens', universe: 'Aliens', registration: 'runtime', catalogOrder: 1, directory: 'DLC/Aliens', modules: [{ path: 'data/heroes.js' }] },
  { id: 'gallery', universe: 'Gallery', registration: 'artwork-only', catalogOrder: 3, directory: 'DLC/Gallery', modules: [{ path: 'data/gallery.js' }] }
];
const profile = (mode, packIds = []) => ({ schemaVersion: 1, mode, packIds, sharedPolicy: 'preserve-all' });

test('base keeps campaign availability separate from installation, including artwork-only packs', () => {
  const api = createDlcInstallation({ manifests, profile: profile('base') });
  assert.equal(api.isUniverseInstalled('Nexus'), true);
  assert.equal(api.isUniverseInstalled('Halo'), false);
  assert.equal(api.isUniverseInstalled('Gallery'), false);
  assert.equal(api.isDlcPackInstalled('unknown'), false);
  assert.deepEqual(api.getInstalledDlcPackIds(), []);
});

test('selected installation has canonical order and immutable snapshots', () => {
  const supplied = profile('selected', ['halo', 'aliens', 'gallery']);
  const api = createDlcInstallation({ manifests, profile: supplied });
  supplied.packIds.length = 0;
  const output = api.getInstalledDlcPackIds();
  output.length = 0;
  assert.deepEqual(api.getInstalledDlcPackIds(), ['aliens', 'halo', 'gallery']);
  assert.deepEqual(api.getInstalledDlcUniverseKeys(), ['Aliens', 'Halo']);
  assert.equal(api.getDlcInstallationSummary().installedCount, 3);
  assert.equal(api.getDlcInstallationSummary().availableCount, 3);
  assert.throws(() => api.getDlcInstallationSummary().installedPackIds.push('other'), TypeError);
});

test('installation rejects ambiguous, unknown, duplicate and misspelled profiles', () => {
  for (const bad of [
    profile('selected'), profile('selected', ['HALO']), profile('selected', ['unknown']),
    profile('selected', ['halo', 'halo']), profile('all', ['halo']),
    { ...profile('base'), downloaded: true }, { ...profile('base'), schemaVersion: 2 }
  ]) assert.throws(() => createDlcInstallation({ manifests, profile: bad }));
  assert.throws(() => createDlcInstallation({ manifests: [...manifests, manifests[0]], profile: profile('all') }), /Duplicate/);
});

test('complete registry can be imported with every package directory physically absent', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'dlc-registry-independent-'));
  try {
    const file = path.join(root, 'index.mjs');
    writeFileSync(file, renderDlcRegistry(manifests));
    const imported = await import(pathToFileURL(file).href);
    assert.deepEqual(imported.DLC_UNIVERSE_KEYS, ['Halo', 'Aliens']);
    assert.equal(imported.getDlcManifest('Gallery').registration, 'artwork-only');
    assert.throws(() => imported.DLC_PACK_MANIFESTS[0].modules.push({}), TypeError);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('stable indexes retain removed identities and append without reusing their numbers', () => {
  const original = { halo: 0, aliens: 1, gallery: 2 };
  assert.deepEqual(appendStableIndexes(original, ['gallery', 'halo', 'new-pack']), { ...original, 'new-pack': 3 });
  assert.deepEqual(original, { halo: 0, aliens: 1, gallery: 2 });
  assert.throws(() => appendStableIndexes({ a: 0, b: 0 }, []));
  assert.throws(() => appendStableIndexes({}, ['a', 'a']));
});

test('partial profiles never derive mission numbers from reduced array positions', () => {
  const data = { schemaVersion: 1, indexes: {
    expandedUniverses: { Halo: 1, Aliens: 12 },
    generatedCharacterArcs: { ripley: 8 },
    universeArcs: { hive: 40 }
  } };
  const strict = createDlcContentIdentity(data);
  assert.equal(strict.getStableContentIndex('expandedUniverses', 'Aliens', 0), 12);
  assert.equal(strict.getStableContentIndex('generatedCharacterArcs', 'ripley', 0), 8);
  assert.equal(strict.getStableUniverseArcStageId('hive', 0), 40040);
  assert.throws(() => strict.getStableContentIndex('universeArcs', 'unknown', 0), /Missing stable/);
  const development = createDlcContentIdentity(data, { allowFallback: true });
  assert.equal(development.getStableContentIndex('universeArcs', 'new', 41), 41);
  assert.throws(() => development.getStableContentIndex('typo', 'new', 0), /Unknown/);
});

test('replay identity history preserves completed stages after authored catalogue removal', () => {
  const old = [{ arcId: 'hive', finalStageIds: [40040], rewardItemId: 'universe_arc_hive' }];
  const merged = mergeReplayIdentities(old, [{ arcId: 'new', finalStageIds: [40041] }, { arcId: 'hive', finalStageIds: [40040] }]);
  assert.deepEqual(merged, [old[0], { arcId: 'new', finalStageIds: [40041] }]);
  assert.deepEqual(old[0].finalStageIds, [40040]);
});
