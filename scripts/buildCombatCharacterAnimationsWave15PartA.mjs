import { buildPartA } from '../docs/combat-fidelity-wave15-2026-10-26/part-a/builder.mjs';
console.log(JSON.stringify(await buildPartA('native', { check: process.argv.includes('--check') })));
