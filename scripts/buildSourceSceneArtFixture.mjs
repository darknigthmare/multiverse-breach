import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
// Full production modules, no catalogue mocks. The media are served separately
// from the ordinary checkout/index by the loopback-only QA server.
await build({
  root, configFile: false, plugins: [react()], publicDir: false,
  build: { outDir: resolve(root, '.tmp/source-scene-art'), emptyOutDir: true,
    rollupOptions: { input: resolve(root, 'scripts/fixtures/source-scene-art.html') } }
});
