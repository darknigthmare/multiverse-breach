import { buildPartB } from '../docs/combat-fidelity-wave12-2026-10-23/part-b-atlas-builder.mjs';
console.log(JSON.stringify(await buildPartB('native', { check: process.argv.includes('--check') })));
