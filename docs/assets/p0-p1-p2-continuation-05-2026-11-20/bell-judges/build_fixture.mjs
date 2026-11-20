import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
await build({
  root,
  configFile: false,
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: '/tmp/mb-bell-judges-20261120/fixture',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./game-canvas.html', import.meta.url)) },
  },
});
