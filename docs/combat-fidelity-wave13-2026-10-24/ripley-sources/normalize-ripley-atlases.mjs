import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [
  'docs/combat-fidelity-wave13-2026-10-24/ripley-sources/build-native-ripley-atlases.mjs',
  '--config', 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources/packing-plan.json', ...process.argv.slice(2)
], { stdio: 'inherit' });
process.exit(result.status ?? 1);
