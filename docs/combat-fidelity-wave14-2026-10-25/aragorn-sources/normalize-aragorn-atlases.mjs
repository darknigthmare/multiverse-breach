import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [
  'docs/combat-fidelity-wave14-2026-10-25/aragorn-sources/build-native-aragorn-atlases.mjs',
  '--config', 'docs/combat-fidelity-wave14-2026-10-25/aragorn-sources/packing-plan.json', ...process.argv.slice(2)
], { stdio: 'inherit' });
process.exit(result.status ?? 1);
