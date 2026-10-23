import { buildNativeWave9PartC } from './buildCombatCharacterAnimationsWave9PartC.mjs';

console.log(JSON.stringify(await buildNativeWave9PartC({ base: true, check: process.argv.includes('--check') })));
