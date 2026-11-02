import { buildPartCAnchors } from '../docs/combat-fidelity-wave16-2026-10-28/part-c/build-anchors.mjs';
console.log(JSON.stringify(await buildPartCAnchors({ check: process.argv.includes('--check') })));
