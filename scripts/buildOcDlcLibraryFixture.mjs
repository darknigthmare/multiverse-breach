import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const name = process.env.OC_DLC_LIBRARY_PROFILE || 'all';
const selections = { all: null, base: [], thalassa: ['thalassa-mnemique'] };
if (!Object.hasOwn(selections, name)) throw new Error('Unknown OC library fixture profile.');
const selected = selections[name] || DLC_PACK_MANIFESTS.map(pack => pack.id);
const profile = { schemaVersion: 1, mode: name === 'all' ? 'all' : name === 'base' ? 'base' : 'selected', packIds: name === 'all' ? [] : selected, sharedPolicy: 'preserve-all' };
const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS, installedPackIds: new Set(selected) });
const outDir = resolve(process.env.OC_DLC_LIBRARY_OUT || `/tmp/multiverse-oc-dlc-library${name === 'all' ? '' : '-' + name}`);
await build({ root, configFile: false, publicDir: false, plugins: [{ name: 'oc-library-edition-profile', enforce: 'pre',
  transform(source, id) {
    if (id.split('?')[0] === root + '/DLC/distribution.json') return { code: JSON.stringify(profile), map: null };
    if (!id.startsWith(root + '/src/') && !id.startsWith(root + '/DLC/')) return null;
    const result = transformer.transform(source, id);
    return result ? { code: result.code, map: null } : null;
  }
}, react()], build: {
  outDir, emptyOutDir: true,
  rollupOptions: { input: resolve(root, 'scripts/fixtures/oc-dlc-library.html') }
} });
const sources = ['src/components/HubScreen.jsx', 'src/components/OcDlcLibrary.jsx', 'src/components/OcDlcLibrary.css',
  'src/game/ocDlcLibraryView.js', 'scripts/fixtures/ocDlcLibraryHarness.jsx'];
const sourceSha256 = Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash('sha256').update(await readFile(resolve(root, file))).digest('hex')])));
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'fixture-profile.json'), JSON.stringify({ name, profile, sourceSha256,
  scope: 'Production Hub and actual DLC source transformation with prepared parent state; code-only fixture, no assembled distribution or campaign playthrough.' }, null, 2) + '\n');
