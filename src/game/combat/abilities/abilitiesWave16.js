import { ABILITIES_WAVE16_PART_A as partA } from './abilitiesWave16PartA.js';
import { ABILITIES_WAVE16_PART_B as partB } from './abilitiesWave16PartB.js';
import { ABILITIES_WAVE16_PART_C as partC } from './abilitiesWave16PartC.js';
import { WAVE_16_REVIEWED_IDS } from '../cohortWave16.js';

// Membership and prior completeness were captured before production in
// batch-plan-before.json SHAea8800d8e9ecde3b9cd47a8da9dab3493a41e0ff092e9d62b9c7e6682b162bf6.
// No W16 revision is counted as a newly authored identity.
const parts = [partA, partB, partC], entries = parts.flatMap(part => Object.entries(part));
const reviewed = new Set(WAVE_16_REVIEWED_IDS);
if (parts.some((part, index) => Object.keys(part).length < 40 || Object.keys(part).length > [40, 41, 43][index])
  || entries.length < 120 || entries.length > 124 || new Set(entries.map(([id]) => id)).size !== entries.length
  || entries.some(([id]) => !reviewed.has(id))) throw new Error('W16 kits differ from the initial plan and its append-only amendment');
export const ABILITIES_WAVE16 = Object.freeze({});
export const ABILITY_REVISIONS_WAVE16 = Object.freeze(Object.fromEntries(entries.map(([id, fields]) => [id, {
  ...fields, versionNote: 'Wave16 explicit source version: ' + fields.sourceReference
}])));
