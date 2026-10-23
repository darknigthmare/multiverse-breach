import { buildNativeWave10PartC } from './buildCombatCharacterAnimationsWave10PartC.mjs';
console.log(JSON.stringify(await buildNativeWave10PartC({ base: true, check: process.argv.includes('--check') })));
