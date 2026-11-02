import { buildPartB } from '../docs/combat-fidelity-wave15-2026-10-26/part-b/builder.mjs';
console.log(JSON.stringify(await buildPartB('native', { check: process.argv.includes('--check') })));
