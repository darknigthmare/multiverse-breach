import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = resolve(process.env.MISSION_DIRECTORY_OUT || '/tmp/multiverse-mission-directory');
const profile = { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' };
const transformer = createDlcProfileTransformer({ root, manifests: DLC_PACK_MANIFESTS,
  installedPackIds: new Set(DLC_PACK_MANIFESTS.map(pack => pack.id)) });
await build({ root, configFile: false, publicDir: false, plugins: [{ name: 'mission-directory-actual-all-edition', enforce: 'pre',
  transform(source, id) {
    if (id.split('?')[0] === resolve(root, 'DLC/distribution.json')) return { code: JSON.stringify(profile), map: null };
    if (!id.startsWith(resolve(root, 'src') + '/') && !id.startsWith(resolve(root, 'DLC') + '/')) return null;
    const result = transformer.transform(source, id);
    return result ? { code: result.code, map: null } : null;
  }
}, react()], build: { outDir, emptyOutDir: true,
  rollupOptions: { input: resolve(root, 'scripts/fixtures/mission-directory.html') } } });
const sources = ['src/components/HubScreen.jsx', 'src/components/MissionDirectory.jsx', 'src/components/MissionDirectory.css',
  'src/game/missionDirectoryView.js', 'scripts/fixtures/missionDirectoryHarness.jsx'];
const sourceSha256 = Object.fromEntries(await Promise.all(sources.map(async file => [file,
  createHash('sha256').update(await readFile(resolve(root, file))).digest('hex')])));
await writeFile(resolve(outDir, 'fixture-profile.json'), JSON.stringify({ profile, sourceSha256,
  scope: 'Actual production Hub and mission directory with prepared parent state, ordinary deployment/briefing callbacks and actual all-DLC source transformation. Code-only fixture; no campaign, save-file or media-distribution export.' }, null, 2) + '\n');
