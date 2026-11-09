import { buildPartC } from '../docs/combat-fidelity-wave17-2026-11-02/part-c/builder.mjs';
console.log(JSON.stringify(await buildPartC('base', { check: process.argv.includes('--check') })));
