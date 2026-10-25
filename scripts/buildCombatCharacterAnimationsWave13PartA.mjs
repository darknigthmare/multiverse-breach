import { buildPartA } from '../docs/combat-fidelity-wave13-2026-10-24/part-a/builder.mjs';
console.log(JSON.stringify(await buildPartA('native', { check: process.argv.includes('--check') })));
