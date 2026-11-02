import { ROSTER_REINFORCEMENTS_WAVE15_PART_A as partA } from './rosterReinforcementsWave15PartA.js';
import { ROSTER_REINFORCEMENTS_WAVE15_PART_B as partB } from './rosterReinforcementsWave15PartB.js';
import { ROSTER_REINFORCEMENTS_WAVE15_PART_C as partC } from './rosterReinforcementsWave15PartC.js';

const parts = [partA, partB, partC];
const entries = parts.flatMap(part => Object.entries(part));
if (parts.some(part => Object.keys(part).length !== 40) || entries.length !== 120 || new Set(entries.map(([id]) => id)).size !== 120)
  throw new Error('W15 reinforcements require three disjoint groups of 40');
export const ROSTER_REINFORCEMENTS_WAVE15 = Object.freeze(Object.fromEntries(entries));
