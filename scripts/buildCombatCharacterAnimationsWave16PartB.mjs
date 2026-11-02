import { buildPartB } from '../docs/combat-fidelity-wave16-2026-10-28/part-b/builder.mjs';
console.log(JSON.stringify(await buildPartB('native', { check: process.argv.includes('--check') })));
