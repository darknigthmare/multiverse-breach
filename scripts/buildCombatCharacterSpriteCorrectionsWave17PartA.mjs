import {buildPartA} from '../docs/combat-fidelity-wave17-2026-11-02/part-a/builder.mjs';
console.log(JSON.stringify(await buildPartA('base',{check:process.argv.includes('--check')})));
