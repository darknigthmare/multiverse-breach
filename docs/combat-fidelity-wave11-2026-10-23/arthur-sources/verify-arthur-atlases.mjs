import { spawnSync } from 'node:child_process';
const result=spawnSync(process.execPath,['docs/combat-fidelity-wave11-2026-10-23/melee-tooling/verify-native-melee-atlases.mjs','arthur',...process.argv.slice(2)],{stdio:'inherit'});
process.exit(result.status??1);
