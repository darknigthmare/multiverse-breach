import { buildPartD } from '../docs/combat-fidelity-wave11-2026-10-23/part-d-builder-lib.mjs';
console.log(JSON.stringify(await buildPartD('native',{check:process.argv.includes('--check')})));
