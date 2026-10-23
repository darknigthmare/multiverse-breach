import { buildNativeWave11PartC } from './buildCombatCharacterAnimationsWave11PartC.mjs';
console.log(JSON.stringify(await buildNativeWave11PartC({ base: true, check: process.argv.includes('--check'), draft: process.argv.includes('--draft') })));
