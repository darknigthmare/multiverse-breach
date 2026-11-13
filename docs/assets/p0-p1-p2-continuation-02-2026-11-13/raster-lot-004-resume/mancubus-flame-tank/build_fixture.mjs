// Existing real GameCanvas/signature-support fixture; public media is not copied.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../../../../../', import.meta.url));
await build({ root, configFile: false, publicDir: false, plugins: [react()], build: {
  outDir: '/tmp/multiverse-doom-raster02-final-20261113', emptyOutDir: true,
  rollupOptions: { input: resolve(root, 'scripts/fixtures/signature-support.html') }
} });
