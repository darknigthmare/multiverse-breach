import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PROJECT_ROOT, readDlcManifests } from './buildDlcRegistry.mjs';

/** Read an adapter together with only the DLC definitions registered for it. */
export function createDlcSourceReader({ root = PROJECT_ROOT, manifests = readDlcManifests(root) } = {}) {
  const modulesByAdapter = new Map();
  for (const manifest of manifests) {
    for (const module of manifest.modules) {
      if (!module.runtimeAdapter) continue;
      if (!modulesByAdapter.has(module.runtimeAdapter)) modulesByAdapter.set(module.runtimeAdapter, new Set());
      modulesByAdapter.get(module.runtimeAdapter).add(`${manifest.directory}/${module.path}`);
    }
  }
  return adapter => [adapter, ...(modulesByAdapter.get(adapter) || [])]
    .map(relative => readFileSync(path.join(root, relative), 'utf8'))
    .join('\n');
}
