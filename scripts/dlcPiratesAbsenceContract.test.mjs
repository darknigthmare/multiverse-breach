import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const packId = DLC_PACK_MANIFESTS.find(pack => pack.directory === 'DLC/PiratesOfTheCaribbean').id;
for (const [label, installedPackIds, expectedPirates] of [
  ['base', [], false], ['Halo', ['halo'], false],
  ['Pirates', [packId], true], ['all', DLC_PACK_MANIFESTS.map(pack => pack.id), true]
]) {
  test(`${label}: the real Pirates panel bundles with a complete optional API and only selected source modules`, async () => {
    const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: new Set(installedPackIds) });
    const result = await build({
      root, configFile: false, publicDir: false, logLevel: 'silent',
      plugins: [{
        name: 'pirates-profile-regression', enforce: 'pre',
        transform(source, id) {
          if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
          const transformed = transformer.transform(source, id);
          return transformed ? { code: transformed.code, map: null } : null;
        }
      }, react()],
      build: { write: false, minify: false, rollupOptions: { input: path.join(root, 'src/components/PiratesCursePanel.jsx'), preserveEntrySignatures: 'strict' } }
    });
    const chunks = result.output.filter(item => item.type === 'chunk');
    const modules = chunks.flatMap(chunk => Object.keys(chunk.modules));
    const pirates = modules.filter(id => id.includes('/DLC/PiratesOfTheCaribbean/'));
    assert.equal(pirates.length > 0, expectedPirates);
    assert.ok(modules.filter(id => id.includes('/DLC/')).every(id => id.includes('/DLC/PiratesOfTheCaribbean/')));
    const code = chunks.map(chunk => chunk.code).join('\n');
    assert.equal(code.includes('aztec-medallion-front-20261113.png'), expectedPirates);
  });
}
