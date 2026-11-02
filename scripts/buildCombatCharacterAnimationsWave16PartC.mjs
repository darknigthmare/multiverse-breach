import { buildPartC } from '../docs/combat-fidelity-wave16-2026-10-28/part-c/builder.mjs';
console.log(JSON.stringify(await buildPartC('native', { check: process.argv.includes('--check') })));
