import { spawnSync } from 'node:child_process';
const result=spawnSync(process.execPath,['docs/combat-fidelity-wave11-2026-10-23/melee-tooling/build-native-melee-atlases.mjs','--config','docs/combat-fidelity-wave11-2026-10-23/arthur-sources/packing-plan.json',...process.argv.slice(2)],{stdio:'inherit'});
process.exit(result.status??1);
