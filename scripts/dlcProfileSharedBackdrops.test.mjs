import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createServer } from 'vite';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
import { buildDlcDistributionPlan, resolveDlcSelection } from './dlcDistribution.mjs';
import { readDlcSharedDependencies, REVIEWED_SHARED_POLICY } from './dlcSharedAssetDependencies.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const dependencies = readDlcSharedDependencies({ root, required: true });
const optional = new Set(dependencies.assets.map(asset => asset.publicPath));
const consumers = [...new Set(dependencies.assets.flatMap(asset => asset.packIds))];
const byUniverse = new Map(DLC_PACK_MANIFESTS.map(pack => [pack.universe, pack]));
const modes = ['RPG', 'Tactics', 'Smash', 'Combat', 'Fighter', 'Melee'];
const campaign = JSON.parse(readFileSync(root + '/src/game/originalUniversesManifest.json')).universes.map(value => value.universe);

test('real transformed renderer keeps backdrop closure for all, base, Halo and every reviewed consumer', async t => {
  let complete;
  for (const [label, mode, packIds] of [['all', 'all', []], ['base', 'base', []],
    ['halo', 'selected', ['halo']], ['consumers', 'selected', consumers]]) {
    await t.test(label, async context => {
      const profile = { schemaVersion: 1, mode, packIds, sharedPolicy: REVIEWED_SHARED_POLICY };
      const selection = resolveDlcSelection({ manifests: DLC_PACK_MANIFESTS, profile });
      const installed = new Set(selection.packIds);
      const plan = buildDlcDistributionPlan({ root, selection });
      const delivered = new Set(plan.assets.map(asset => asset.publicPath));
      const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: installed });
      const server = await createServer({ root, configFile: false, logLevel: 'silent', plugins: [{
        name: 'reviewed-shared-backdrop-profile', enforce: 'pre', transform(source, id) {
          if (id.split('?')[0] === root + '/DLC/distribution.json') return { code: JSON.stringify(profile), map: null };
          if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
          const result = transformer.transform(source, id);
          return result ? { code: result.code, map: null } : null;
        },
      }], server: { middlewareMode: true, watch: null }, appType: 'custom' });
      try {
        const renderer = await server.ssrLoadModule('/src/game/renderer.js');
        const installation = await server.ssrLoadModule('/src/game/dlcInstallation.js');
        assert.deepEqual(installation.getInstalledDlcPackIds(), selection.packIds);
        const universes = ['Nexus de Convergence', 'Matrix', ...campaign, ...DLC_PACK_MANIFESTS.map(pack => pack.universe)];
        const resolved = Object.fromEntries(universes.map(universe => [universe,
          Object.fromEntries(modes.map(mode => [mode, renderer.getOpenAiBackdropSrc(universe, mode)]))]));
        if (label === 'all') complete = resolved;
        let checkedModes = 0, optionalEntries = 0;
        for (const [universe, values] of Object.entries(resolved)) {
          const pack = byUniverse.get(universe);
          for (const [mode, src] of Object.entries(values)) {
            if (optional.has(src)) assert.ok(delivered.has(src), label + ': absent backdrop requested by ' + universe + '/' + mode);
            if (!pack || installed.has(pack.id)) {
              assert.equal(src, complete[universe][mode], 'installed backdrop choice remains identical: ' + universe + '/' + mode);
              checkedModes++;
            }
          }
        }
        for (const values of Object.values(renderer.OPENAI_BACKDROPS)) {
          for (const [universe, src] of Object.entries(values)) if (optional.has(src)) {
            optionalEntries++;
            assert.ok(installed.has(byUniverse.get(universe).id));
            assert.ok(delivered.has(src));
          }
        }
        for (const asset of dependencies.assets) {
          assert.equal(delivered.has(asset.publicPath), asset.packIds.some(id => installed.has(id)));
        }
        assert.ok(delivered.has('/backgrounds/halo-tactics-openai.png'));
        assert.ok(delivered.has('/backgrounds/stargate-rpg-openai.png'));
        if (label === 'base' || label === 'halo') assert.equal(optionalEntries, 0);
        if (label === 'consumers') assert.equal(optionalEntries, 38);
        context.diagnostic(JSON.stringify({ label, installedPacks: installed.size, checkedModes, optionalEntries,
          excludedShared: plan.excludedSharedAssets.length, publicAssets: plan.publicAssets.length }));
      } finally { await server.close(); }
    });
  }
});
