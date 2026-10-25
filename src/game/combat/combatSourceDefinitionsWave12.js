import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_A } from './combatSourceDefinitionsWave12PartA.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_B } from './combatSourceDefinitionsWave12PartB.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_C } from './combatSourceDefinitionsWave12PartC.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_D } from './combatSourceDefinitionsWave12PartD.js';

const parts = [COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_A, COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_B,
  COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_C, COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_D];
const entries = parts.flatMap(part => Object.entries(part));
if (entries.length !== 40 || new Set(entries.map(([id]) => id)).size !== 40)
  throw new Error('Wave 12 requires forty distinct, explicitly curated source identities');
export const COMBAT_SOURCE_DEFINITIONS_WAVE12 = Object.freeze(Object.fromEntries(entries));
