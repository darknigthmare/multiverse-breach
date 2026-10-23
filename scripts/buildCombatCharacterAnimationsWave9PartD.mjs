import { buildPartD } from '../docs/combat-fidelity-wave9-2026-10-22/part-d-builder-lib.mjs';
console.log(JSON.stringify(await buildPartD('native',{check:process.argv.includes('--check')})));
