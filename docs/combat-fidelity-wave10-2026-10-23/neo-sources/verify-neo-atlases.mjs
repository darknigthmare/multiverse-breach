import { spawnSync } from 'node:child_process';
const r=spawnSync(process.execPath,['docs/combat-fidelity-wave10-2026-10-23/melee-tooling/verify-native-melee-atlases.mjs','neo',...process.argv.slice(2)],{stdio:'inherit'});process.exit(r.status??1);
