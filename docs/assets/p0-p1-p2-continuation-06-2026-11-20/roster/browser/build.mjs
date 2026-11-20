import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

await build({
  root: fileURLToPath(new URL('.', import.meta.url)),
  configFile: false,
  publicDir: false,
  plugins: [react()],
  base: './',
  build: { outDir: path.resolve(process.argv[2]), emptyOutDir: false }
});
