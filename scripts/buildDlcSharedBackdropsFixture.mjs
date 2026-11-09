import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
import { readDlcSharedDependencies, REVIEWED_SHARED_POLICY } from './dlcSharedAssetDependencies.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const name = process.env.DLC_BACKDROP_PROFILE || 'base';
if (!['base', 'halo', 'consumers'].includes(name)) throw new Error('Unknown backdrop fixture profile');
const dependencies = readDlcSharedDependencies({ root, required: true });
const packIds = name === 'base' ? [] : name === 'halo' ? ['halo'] : [...new Set(dependencies.assets.flatMap(asset => asset.packIds))];
const profile = { schemaVersion: 1, mode: name === 'base' ? 'base' : 'selected', packIds, sharedPolicy: REVIEWED_SHARED_POLICY };
const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: new Set(packIds) });
await build({ root, configFile: false, publicDir: false, plugins: [{
  name: 'reviewed-backdrop-fixture', enforce: 'pre', transform(source, id) {
    if (id.split('?')[0] === root + '/DLC/distribution.json') return { code: JSON.stringify(profile), map: null };
    if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
    const result = transformer.transform(source, id);
    return result ? { code: result.code, map: null } : null;
  },
}], build: { outDir: path.resolve(root, '.tmp/dlc-backdrops-' + name), emptyOutDir: true,
  rolldownOptions: { input: path.resolve(root, 'scripts/fixtures/dlc-shared-backdrops.html') } } });
