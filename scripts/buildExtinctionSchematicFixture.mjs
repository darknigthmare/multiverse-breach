import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
await build({ root, configFile: false, publicDir: false, base: './',
  build: { outDir: resolve(root, '.tmp/extinction-schematic'), emptyOutDir: true,
    rolldownOptions: { input: resolve(root, 'scripts/fixtures/extinction-schematic.html') } } });
