import { buildPartD } from '../docs/combat-fidelity-wave8-2026-10-20/part-d-builder-lib.mjs';
console.log(JSON.stringify(await buildPartD('base',{check:process.argv.includes('--check')})));
