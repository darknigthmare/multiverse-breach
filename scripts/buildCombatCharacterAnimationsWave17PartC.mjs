import { buildPartC } from '../docs/combat-fidelity-wave17-2026-11-02/part-c/builder.mjs';
console.log(JSON.stringify(await buildPartC('native', { check: process.argv.includes('--check') })));
