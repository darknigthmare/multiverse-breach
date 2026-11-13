import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = resolve(process.env.HUB_WORKSPACES_OUT || '/tmp/multiverse-hub-workspaces');
await build({ root, configFile: false, publicDir: false, plugins: [react()], build: {
  outDir, emptyOutDir: true,
  rollupOptions: { input: resolve(root, 'scripts/fixtures/hub-workspaces.html') }
} });
