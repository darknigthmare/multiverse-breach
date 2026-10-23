import { buildNativeWave8PartC } from './buildCombatCharacterAnimationsWave8PartC.mjs';

console.log(JSON.stringify(await buildNativeWave8PartC({ base: true, check: process.argv.includes('--check') })));
