import { buildNativeWave7PartC } from './buildCombatCharacterAnimationsWave7PartC.mjs';

console.log(JSON.stringify(await buildNativeWave7PartC({ base: true, check: process.argv.includes('--check') })));
