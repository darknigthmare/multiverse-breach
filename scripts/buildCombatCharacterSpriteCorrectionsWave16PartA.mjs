import {buildPartA} from '../docs/combat-fidelity-wave16-2026-10-28/part-a/builder.mjs';
console.log(JSON.stringify(await buildPartA('base',{check:process.argv.includes('--check')})));
