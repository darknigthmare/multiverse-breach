import {buildPartC} from '../docs/combat-fidelity-wave15-2026-10-26/part-c/builder.mjs';
console.log(JSON.stringify(await buildPartC('native',{check:process.argv.includes('--check')})));
