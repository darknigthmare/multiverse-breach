import { buildPartB } from '../docs/combat-fidelity-wave13-2026-10-24/part-b/builder.mjs';
console.log(JSON.stringify(await buildPartB('base', { check: process.argv.includes('--check') })));
