import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { register } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = new URL('../../', import.meta.url);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => fs.readFile(new URL(path, root));
const json = async path => JSON.parse(await read(path));
const validators = {
  13: {
    path: 'docs/combat-fidelity-wave13-2026-10-24/summon-runtime-validation.mjs',
    sha256: '2cd767856e0d3c0455218576cbf4c80fba2868265920ad797f2a7f344faf1b43',
    countExpression: 'getAssets().filter(asset => !wave14AssetIds.has(asset.id)).length',
  },
  14: {
    path: 'docs/combat-fidelity-wave14-2026-10-25/summon-runtime-validation.mjs',
    sha256: '477c3eb393d9426ce5ba6755d83ae4b2c79eeeba98a0b9c8603bd3185e2ec346',
    countExpression: 'getAssets().length',
  },
  15: {
    path: 'docs/combat-fidelity-wave15-2026-10-26/summon-runtime-validation.mjs',
    sha256: 'd958b05520b4158869fc17a14e5f28883272e99eb3c54326b2888fc0ee5e5281',
    countExpression: 'getAssets().length',
  },
};
const wave15Identities = [
  ['hexen_baratus-wave15', 'Hexen::Baratus::Taille de Timon’s Axe de Baratus'],
  ['quake_franchise_ranger-wave15', 'Quake::Ranger::Taille de la hache de Ranger'],
  ['sir_daniel_fortesque-wave15', 'MediEvil::Sir Daniel Fortesque::Taille de l’épée de Sir Daniel'],
  ['axel_sor-wave15', 'Streets of Rage::Axel Stone::Grand Upper d’Axel'],
  ['dog_hl2-wave15', 'Half-Life::Dog::Coup du bras mécanique de Dog'],
  ['kendra_daniels-wave15', 'Dead Space::Kendra Daniels::Relais technique de Kendra Daniels'],
];

export async function installHistoricalRpgSummonCohort({ wave }) {
  const validator = validators[wave];
  assert.ok(validator, 'Only the frozen W13/W14/W15 RPG validators are supported');
  assert.equal(process.env[`W${wave}_RPG_WRITE_REPORT`], '0', 'Historical reports must remain read-only');
  assert.equal(sha(await read(validator.path)), validator.sha256, 'Frozen validator changed');

  const baselinePath = 'docs/combat-fidelity-wave15-2026-10-26/current.json';
  const baselineBytes = await read(baselinePath);
  assert.equal(sha(baselineBytes), 'd13914f9cf8a2175ca71d0b6c1fa8ca4b3ad04f98595a7314636531ec00dd5a2');
  const baseline = JSON.parse(baselineBytes);
  const registryPaths = baseline.assetInventory.registries.filter(path => /\/summonAnimationsWave\d+\.generated\.json$/.test(path));
  const registries = await Promise.all(registryPaths.map(async path => {
    const bytes = await read(path);
    assert.equal(sha(bytes), baseline.inputHashes[path], path);
    return JSON.parse(bytes);
  }));
  const expected = registries.flatMap(registry => registry.entries);
  const historical = registries.slice(0, -1).flatMap(registry => registry.entries);
  const current = registries.at(-1).entries;
  assert.equal(expected.length, 55);
  assert.equal(historical.length, 49);
  assert.equal(new Set(expected.map(asset => asset.key)).size, 55);
  assert.equal(new Set(expected.map(asset => asset.id)).size, 55);
  assert.deepEqual(current.map(asset => [asset.id, asset.key]), wave15Identities,
    'Exclude exactly the six declared W15 identities, never a suffix/prefix guess');
  assert.equal(expected.length, baseline.entities.nativeAnimationAtlases);
  assert.deepEqual(expected.map(asset => asset.id).sort(), baseline.entities.nativeAnimationEntries.map(asset => asset.id).sort());
  const additionsPath = 'src/game/combat/summonAnimationsWave16.generated.json';
  const additionsBytes = await read(additionsPath);
  assert.equal(sha(additionsBytes), '78f439f96ee0be5ffe6fa2cfe1cdf5941cc2c3f2ca1e88669609a6abce353f6a');
  const additions = JSON.parse(additionsBytes).entries;
  const expectedLive = [...expected, ...additions];
  assert.equal(new Set(expectedLive.map(asset => asset.key)).size, expectedLive.length);
  assert.equal(new Set(expectedLive.map(asset => asset.id)).size, expectedLive.length);
  const baselineKeys = new Set(expected.map(asset => asset.key));
  assert.ok(additions.every(asset => !baselineKeys.has(asset.key)), 'W16 additions must not replace historical objects');
  const historicalView = registries.flatMap((registry, index) => Number(registryPaths[index].match(/Wave(\d+)\./)[1]) <= wave ? registry.entries : []);

  const snapshotPath = 'docs/combat-fidelity-wave14-2026-10-25/rpg-historical-assets-before.json';
  const snapshotBytes = await read(snapshotPath);
  assert.equal(sha(snapshotBytes), 'f28bbe04686dc0eee5778e99796b2d395edea23233e39fa0cceb0d065e90f83f');
  const snapshot = JSON.parse(snapshotBytes);
  assert.equal(snapshot.count, 43);
  assert.equal(snapshot.entries.length, 43);
  assert.equal(sha(await read('src/game/combat/summonAnimationsWave14.generated.json')),
    '25407b7735b42599a2c4c2c38f12785d17a46077af3ba333dd35547508976f5f');

  // Load the real production catalog through Vite before registering any loader.
  // The SUT remains the complete live catalog for every real RPG flow.
  const vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent',
    server: { middlewareMode: true, watch: null } });
  try {
    const { getSummonAnimationAssets } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js');
    const actual = getSummonAnimationAssets();
    assert.equal(actual.length, expectedLive.length);
    assert.deepEqual([...actual].sort((a, b) => a.key.localeCompare(b.key)),
      [...expectedLive].sort((a, b) => a.key.localeCompare(b.key)));
    // This is a real historical list of complete objects, not a replacement
    // numeric count. Exactly the hash-pinned W16 objects are excluded from W15.
    assert.deepEqual(actual.filter(asset => baselineKeys.has(asset.key)), expected);
    assert.deepEqual(actual.filter(asset => !baselineKeys.has(asset.key)), additions);
    for (const record of snapshot.entries) {
      const asset = actual.find(asset => asset.key === record.key);
      assert.ok(asset, record.key);
      assert.equal(sha(JSON.stringify(asset)), record.recordSha256, record.key);
      assert.equal(sha(await read('public' + record.sheet)), record.sha256, record.sheet);
    }
    // Verify every historical public atlas and its original source drawing,
    // including all six W15 objects and the earlier W14 additions.
    for (const asset of expected) {
      assert.equal(sha(await read('public' + asset.sheet)), asset.sha256, asset.id);
      assert.equal(sha(await read(asset.sourceImage)), asset.sourceImageSha256, asset.sourceImage);
    }
  } finally {
    await vite.close();
  }

  const historicalViewKeys = historicalView.map(asset => asset.key);
  const viewKeys = new Set(historicalViewKeys);
  const excludedKeys = expectedLive.filter(asset => !viewKeys.has(asset.key)).map(asset => asset.key);
  register(new URL('./historicalRpgSummonCohortLoader.mjs', import.meta.url), import.meta.url, {
    data: { targetUrl: new URL(validator.path, root).href, validatorSha256: validator.sha256,
      countExpression: validator.countExpression, excludedKeys, historicalViewKeys,
      historicalViewCount: historicalView.length, liveCount: expectedLive.length,
      postBaselineKeys: additions.map(asset => asset.key) },
  });
  const summary = { wave, realCatalogAssets: expectedLive.length, unchangedHistoricalAssets: expected.length,
    checkedHistoricalSourcePngs: expected.length, checkedHistoricalAtlasPngs: expected.length,
    historicalViewAssets: historicalView.length, excludedExactPostBaselineKeys: additions.length,
    excludedExactKeys: excludedKeys.length, validatorSha256: validator.sha256,
    historicalCountLiteralUnchanged: ({ 13: 43, 14: 49, 15: 55 })[wave], historicalReportWrites: 0 };
  console.log(JSON.stringify({ historicalRpgCohortPreflight: summary }));
  return summary;
}
