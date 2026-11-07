import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';
import { PORTAL_FALLBACK_VISUAL } from '../src/game/visuals/portalVisualManifest.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = resolve(root, '.tmp/menu-accessibility');
await build({ root, configFile: false, publicDir: false, plugins: [react()], build: {
  outDir, emptyOutDir: true, rollupOptions: { input: resolve(root, 'scripts/fixtures/menu-accessibility.html') }
} });
const asset = PORTAL_FALLBACK_VISUAL.atlas.sheet;
const target = resolve(outDir, '.' + asset);
await mkdir(dirname(target), { recursive: true });
await copyFile(resolve(root, 'public', '.' + asset), target);
