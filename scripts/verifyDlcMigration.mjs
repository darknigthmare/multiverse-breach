import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
import { PROJECT_ROOT } from './buildDlcRegistry.mjs';
import { readStaticStages } from './riftDossierStaticStages.mjs';

// An opt-in migration receipt, not a permanent freeze on authored game content.
// Deliberate later content changes are expected to differ from this snapshot.
const baseline = JSON.parse(readFileSync(new URL('../docs/development/dlc-migration-baseline-2026-11-06.json', import.meta.url), 'utf8'));
const digest = value => createHash('sha256').update(value).digest('hex');
const vite = await createServer({ configFile: false, root: PROJECT_ROOT, logLevel: 'silent', server: { middlewareMode: true } });
const differences = [];

try {
  for (const [name, expected] of Object.entries(baseline.modules)) {
    const module = await vite.ssrLoadModule(`/src/game/${name}.js`);
    const exports = Object.keys(module).sort();
    const data = Object.fromEntries(exports.filter(key => typeof module[key] !== 'function').map(key => [key, module[key]]));
    const actual = digest(JSON.stringify(data));
    if (actual !== expected.sha256 || JSON.stringify(exports) !== JSON.stringify(expected.exports)) {
      differences.push({ module: name, expectedSha256: expected.sha256, actualSha256: actual, exportsChanged: JSON.stringify(exports) !== JSON.stringify(expected.exports) });
    }
  }
  const expanded = await vite.ssrLoadModule('/src/game/expandedUniverses.js');
  const dlc = await vite.ssrLoadModule('/src/game/dlcConfig.js');
  const derived = digest(JSON.stringify({ stages: expanded.getExpandedStages(), dlc: dlc.getDlcUniverseKeys(), hidden: dlc.DEFAULT_HIDDEN_UNIVERSES }));
  if (derived !== baseline.derivedCatalogsSha256) differences.push({ module: 'derived stages, DLC order and default hidden universes', expectedSha256: baseline.derivedCatalogsSha256, actualSha256: derived });
  const legacy = await vite.ssrLoadModule('/src/game/legacyStageCatalog.js');
  const modifiers = await vite.ssrLoadModule('/src/game/universeModifiers.js');
  const staticStages = readStaticStages(readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8'));
  for (const [name, value] of [
    ['legacyStageCatalog', legacy.createLegacyStageCatalog()],
    ['universeModifiers', modifiers.createUniverseModifiers()],
    ['staticDossierStages', staticStages]
  ]) {
    const actual = digest(JSON.stringify(value));
    const expected = baseline[`${name}Sha256`];
    if (actual !== expected) differences.push({ module: name, expectedSha256: expected, actualSha256: actual });
  }
  console.log(JSON.stringify({ referenceCommit: baseline.referenceCommit, modules: Object.keys(baseline.modules).length, differences }, null, 2));
  if (differences.length) process.exitCode = 1;
} finally {
  await vite.close();
}
