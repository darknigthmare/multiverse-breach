import { WAVE_15_PART_A_PRESENTATION_DEFINITIONS as partA } from './presentationCatalogWave15PartA.js';
import { WAVE_15_PART_B_PRESENTATION_DEFINITIONS as partB } from './presentationCatalogWave15PartB.js';
import { WAVE_15_PART_C_PRESENTATION_DEFINITIONS as partC } from './presentationCatalogWave15PartC.js';

const parts = [partA, partB, partC];
const entries = parts.flat();
if (parts.some(part => part.length !== 40) || entries.length !== 120 || new Set(entries.map(entry => entry[0])).size !== 120)
  throw new Error('W15 presentation recipes require three disjoint groups of 40');
export const WAVE_15_PRESENTATION_DEFINITIONS = Object.freeze(entries);
