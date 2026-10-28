// Use the native Node test runner for renderer imports. Transform JSX only so
// verification does not depend on a dev server, websocket or writable cache.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { transformWithOxc } from 'vite';
import { load as loadSourceModule } from './sourceSceneTestLoader.mjs';

export { resolve } from './sourceSceneTestLoader.mjs';

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && new URL(url).pathname.endsWith('.jsx')) {
    const source = await readFile(new URL(url), 'utf8');
    const { code } = await transformWithOxc(source, fileURLToPath(url));
    return { format: 'module', shortCircuit: true, source: code };
  }
  return loadSourceModule(url, context, nextLoad);
}
