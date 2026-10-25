import { buildPartC } from '../docs/combat-fidelity-wave12-2026-10-23/part-c-builder-lib.mjs';
console.log(JSON.stringify(await buildPartC('native', { check: process.argv.includes('--check') })));
