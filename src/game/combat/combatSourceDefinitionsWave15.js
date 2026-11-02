import { COMBAT_SOURCE_DEFINITIONS_WAVE15_PART_A as partA } from './combatSourceDefinitionsWave15PartA.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15_PART_B as partB } from './combatSourceDefinitionsWave15PartB.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15_PART_C as partC } from './combatSourceDefinitionsWave15PartC.js';

// Disjoint, explicitly curated source versions; original source frames are not certified.
const parts = [partA, partB, partC];
const entries = parts.flatMap(part => Object.entries(part));
if (parts.some(part => Object.keys(part).length !== 40) || entries.length !== 120 || new Set(entries.map(([id]) => id)).size !== 120)
  throw new Error('W15 requires three disjoint batches of exactly 40 source identities');
export const COMBAT_SOURCE_DEFINITIONS_WAVE15 = Object.freeze(Object.fromEntries(entries));
