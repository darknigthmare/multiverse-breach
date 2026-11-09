import {buildPartB} from '../docs/combat-fidelity-wave17-2026-11-02/part-b/builder.mjs';
console.log(JSON.stringify(await buildPartB('base',{check:process.argv.includes('--check')})));
