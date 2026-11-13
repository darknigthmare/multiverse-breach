import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';

/** Isolate SSR tests whose source fixtures stay immutable until the server closes. */
export async function createServer(options = {}) {
  const cacheDir = await mkdtemp(path.join(tmpdir(), 'multiverse-ssr-test-'));
  let server;
  try {
    server = await createViteServer({
      ...options,
      cacheDir,
      server: {
        ...options.server,
        ws: false,
        hmr: false,
        // These tests do not edit source files. Ignore all watch targets to avoid
        // exhausting OS watchers while keeping Vite's module resolver cache.
        watch: { ...options.server?.watch, ignored: () => true }
      }
    });
  } catch (error) {
    await rm(cacheDir, { recursive: true, force: true });
    throw error;
  }

  const closeVite = server.close.bind(server);
  let closePromise;
  server.close = () => {
    closePromise ??= (async () => {
      try {
        await closeVite();
      } finally {
        await rm(cacheDir, { recursive: true, force: true });
      }
    })();
    return closePromise;
  };
  return server;
}
