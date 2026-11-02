import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [
  'docs/combat-fidelity-wave15-2026-10-26/sir-daniel-sources/build-native-sir-daniel-atlases.mjs',
  '--config', 'docs/combat-fidelity-wave15-2026-10-26/sir-daniel-sources/packing-plan.json', ...process.argv.slice(2)
], { stdio: 'inherit' });
process.exit(result.status ?? 1);
