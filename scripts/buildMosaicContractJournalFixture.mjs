import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
await build({ root, configFile: false, publicDir: false, base: './', plugins: [react()],
  build: { outDir: resolve(root, '.tmp/mosaic-contract-journal'), emptyOutDir: true,
    rollupOptions: { input: resolve(root, 'scripts/fixtures/mosaic-contract-journal.html') }
  }
});
