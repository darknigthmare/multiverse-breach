import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const name = process.env.SYSTEM_PROFILE || 'all';
const selections = { all: null, base: [], halo: ['halo'], pirates: ['pirates-of-the-caribbean'] };
if (!Object.hasOwn(selections, name)) throw new Error('Unknown DLC edition fixture profile: ' + name);
const packIds = selections[name] || DLC_PACK_MANIFESTS.map(pack => pack.id);
const profile = { schemaVersion: 1, mode: name === 'all' ? 'all' : name === 'base' ? 'base' : 'selected', packIds: ['all', 'base'].includes(name) ? [] : packIds, sharedPolicy: 'preserve-all' };
const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: new Set(packIds) });
const outDir = resolve(process.env.DLC_EDITION_FIXTURE_ROOT || '/tmp/dlc-edition-fixture-matrix', name);
await build({ root, configFile: false, publicDir: false, plugins: [{
  name: 'dlc-edition-fixture-profile', enforce: 'pre',
  transform(source, id) {
    if (id.split('?')[0] === root + '/DLC/distribution.json') return { code: JSON.stringify(profile), map: null };
    if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
    const result = transformer.transform(source, id);
    return result ? { code: result.code, map: null } : null;
  }
}, react()], build: { outDir, emptyOutDir: true, rollupOptions: { input: resolve(root, 'scripts/fixtures/system-sections.html') } } });
const sourceSha256 = {};
for (const source of ['src/components/GameSystemMenu.jsx', 'src/components/GameSystemSections.jsx', 'src/components/DlcInstallationPanel.jsx', 'src/components/DlcInstallationPanel.css', 'src/game/dlcInstallation.js']) {
  try { sourceSha256[source] = createHash('sha256').update(await readFile(resolve(root, source))).digest('hex'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'fixture-profile.json'), JSON.stringify({ name, profile, expectedIncludedPackIds: packIds, sourceSha256, scope: 'Production system/DLC menu with production profile transformer and prepared parent draft; no distribution export, complete game or save-file validation.' }, null, 2) + '\n');
