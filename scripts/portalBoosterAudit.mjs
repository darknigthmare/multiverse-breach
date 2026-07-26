import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

import {
  BOOSTER_ART_BY_UNIVERSE,
  BOOSTER_ART_UNIVERSES,
  MULTIVERSE_CONVERGENCE_BOOSTER_ART
} from '../src/game/portalBoosterCatalog.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const errors = [];
const paths = new Set();
let totalBytes = 0;

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true }
});

let runtimeUniverses;
try {
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  runtimeUniverses = [...new Set(
    HEROES_DB.map((hero) => hero?.universe).filter(Boolean)
  )];
} finally {
  await vite.close();
}

const runtimeUniverseSet = new Set(runtimeUniverses);
const missingUniverses = runtimeUniverses.filter(
  (universe) => universe !== 'Nexus de Convergence' && !BOOSTER_ART_BY_UNIVERSE[universe]
);
const orphanUniverses = BOOSTER_ART_UNIVERSES.filter(
  (universe) => !runtimeUniverseSet.has(universe)
);

if (missingUniverses.length > 0) {
  errors.push(`Missing runtime universes: ${missingUniverses.join(', ')}`);
}
if (orphanUniverses.length > 0) {
  errors.push(`Orphan catalogue universes: ${orphanUniverses.join(', ')}`);
}

for (const universe of BOOSTER_ART_UNIVERSES) {
  const publicPath = BOOSTER_ART_BY_UNIVERSE[universe];

  if (!publicPath?.startsWith('/boosters/') || !publicPath.endsWith('.webp')) {
    errors.push(`${universe}: invalid public path "${publicPath}"`);
    continue;
  }

  if (paths.has(publicPath)) {
    errors.push(`${universe}: duplicate public path "${publicPath}"`);
  }
  paths.add(publicPath);

  const localPath = path.join(projectRoot, 'public', ...publicPath.split('/').filter(Boolean));
  try {
    const fileStats = await stat(localPath);
    totalBytes += fileStats.size;
    if (!fileStats.isFile() || fileStats.size < 50_000) {
      errors.push(`${universe}: suspicious booster asset (${fileStats.size} bytes)`);
    }
  } catch (error) {
    errors.push(`${universe}: missing asset (${error.code || error.message})`);
  }
}

const multiverseAssetPath = path.join(
  projectRoot,
  'public',
  ...MULTIVERSE_CONVERGENCE_BOOSTER_ART.split('/').filter(Boolean)
);
try {
  const fileStats = await stat(multiverseAssetPath);
  totalBytes += fileStats.size;
  if (!fileStats.isFile() || fileStats.size < 50_000) {
    errors.push(`Multiverse convergence: suspicious booster asset (${fileStats.size} bytes)`);
  }
} catch (error) {
  errors.push(`Multiverse convergence: missing asset (${error.code || error.message})`);
}

console.log(JSON.stringify({
  runtimeUniverses: runtimeUniverses.length,
  catalogUniverses: BOOSTER_ART_UNIVERSES.length,
  uniqueAssets: paths.size + 1,
  totalBytes,
  missingUniverses,
  orphanUniverses,
  errors
}, null, 2));

if (errors.length > 0) {
  process.exitCode = 1;
}
