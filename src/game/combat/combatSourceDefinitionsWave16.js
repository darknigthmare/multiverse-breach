import { COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_A as partA } from './combatSourceDefinitionsWave16PartA.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_B as partB } from './combatSourceDefinitionsWave16PartB.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_C as partC } from './combatSourceDefinitionsWave16PartC.js';
import { WAVE_16_REVIEWED_IDS } from './cohortWave16.js';

const parts = [partA, partB, partC], entries = parts.flatMap(part => Object.entries(part));
const reviewed = new Set(WAVE_16_REVIEWED_IDS);
if (parts.some((part, index) => Object.keys(part).length < 40 || Object.keys(part).length > [40, 41, 43][index])
  || entries.length < 120 || entries.length > 124 || new Set(entries.map(([id]) => id)).size !== entries.length
  || entries.some(([id]) => !reviewed.has(id))) throw new Error('W16 source revisions differ from the initial plan and its append-only amendment');
export const COMBAT_SOURCE_DEFINITIONS_WAVE16 = Object.freeze(Object.fromEntries(entries));
