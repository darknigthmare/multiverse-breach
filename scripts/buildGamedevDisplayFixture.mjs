import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = resolve(root, '.tmp/gamedev-display');

// Compile only the real display controls and their Canvas fixture. The public
// asset library and the application's production prebuild are separate checks.
await build({
  root,
  configFile: false,
  plugins: [react()],
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: { input: resolve(root, 'scripts/fixtures/gamedev-display.html') }
  }
});
