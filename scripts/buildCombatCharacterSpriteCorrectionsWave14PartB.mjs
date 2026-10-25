import { buildPartB } from '../docs/combat-fidelity-wave14-2026-10-25/part-b/builder.mjs';
console.log(JSON.stringify(await buildPartB('base', { check: process.argv.includes('--check') })));
