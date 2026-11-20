import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

await build({
  root: fileURLToPath(new URL('../../../../', import.meta.url)),
  configFile: false,
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: '/tmp/mvb-pass07-media/fixture',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./game-canvas.html', import.meta.url)) },
  },
});
