import { buildPartA } from '../docs/combat-fidelity-wave14-2026-10-25/part-a/builder.mjs';
console.log(JSON.stringify(await buildPartA('native', { check: process.argv.includes('--check') })));
