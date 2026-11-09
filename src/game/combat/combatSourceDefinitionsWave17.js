import { COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_A as partA } from './combatSourceDefinitionsWave17PartA.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_B as partB } from './combatSourceDefinitionsWave17PartB.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_C as partC } from './combatSourceDefinitionsWave17PartC.js';
import { WAVE_17_REVIEWED_PARTS } from './cohortWave17.js';
const parts = { A: partA, B: partB, C: partC };
for (const [part, entries] of Object.entries(parts)) {
  if (JSON.stringify(Object.keys(entries).sort()) !== JSON.stringify([...WAVE_17_REVIEWED_PARTS[part]].sort())) throw new Error('W17 source membership differs from its pre-generation plan: ' + part);
}
export const COMBAT_SOURCE_DEFINITIONS_WAVE17 = Object.freeze({ ...partA, ...partB, ...partC });
