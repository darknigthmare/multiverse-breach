import{buildPartA}from'../docs/combat-fidelity-wave12-2026-10-23/part-a-builder-lib.mjs';
console.log(JSON.stringify(await buildPartA('native',{check:process.argv.includes('--check')})));
