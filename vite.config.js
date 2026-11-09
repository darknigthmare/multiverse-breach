import { getBuildIdentity, buildIdentityPlugin } from './scripts/buildIdentity.mjs';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const identity = getBuildIdentity();

// SSR tests read a fixed source snapshot. Watching the archived asset corpus
// exhausts inotify without helping those tests; normal development keeps HMR.
const testServerLifecycle = {
  name: 'multiverse-isolated-test-server',
  configResolved(config) {
    if (process.env.NODE_TEST_CONTEXT || process.env.MULTIVERSE_TEST_SERVER === '1') {
      config.server.watch = null;
      config.server.hmr = false;
    }
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildIdentityPlugin(identity), testServerLifecycle],
  define: { __MULTIVERSE_BUILD__: JSON.stringify(identity) },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('/src/game/expandedUniverses')) return 'game-expanded-universes';
          if (id.includes('/src/game/lore') || id.includes('/src/game/enemies') || id.includes('/src/game/heroes')) return 'game-data';
          if (id.includes('/src/game/narrativeSystems')) return 'game-narrative';
        }
      }
    }
  },
  server: {
    port: 5188
  }
})
