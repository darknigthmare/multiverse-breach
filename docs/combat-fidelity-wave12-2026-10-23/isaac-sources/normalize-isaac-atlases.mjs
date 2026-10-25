import { spawnSync } from 'node:child_process';
const result=spawnSync(process.execPath,['docs/combat-fidelity-wave12-2026-10-23/isaac-sources/build-native-isaac-atlases.mjs','--config','docs/combat-fidelity-wave12-2026-10-23/isaac-sources/packing-plan.json',...process.argv.slice(2)],{stdio:'inherit'});
process.exit(result.status??1);
