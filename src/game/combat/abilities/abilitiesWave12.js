import { ABILITIES_WAVE12_PART_A } from './abilitiesWave12PartA.js';
import { ABILITIES_WAVE12_PART_B } from './abilitiesWave12PartB.js';
import { ABILITIES_WAVE12_PART_C } from './abilitiesWave12PartC.js';
import { ABILITIES_WAVE12_PART_D } from './abilitiesWave12PartD.js';

const entries = [ABILITIES_WAVE12_PART_A, ABILITIES_WAVE12_PART_B,
  ABILITIES_WAVE12_PART_C, ABILITIES_WAVE12_PART_D].flatMap(part => Object.entries(part));
if (entries.length !== 40 || new Set(entries.map(([id]) => id)).size !== 40)
  throw new Error('Wave 12 action definitions must cover exactly forty distinct characters');
// Frozen before authoring: these twenty-one identities already had authored
// basic slots. They are explicit version revisions, not new coverage.
const revisionIds = new Set(['harry_mason', 'alessa_gillespie', 'maria_sh2', 'cybil_bennett', 'claudia_wolf',
  'anna_predator', 'billy_predator', 'mac_predator', 'harrigan_predator', 'greyback_yautja',
  'ash_williams', 'annie_knowby', 'henry_red_ed', 'nicole_brennan', 'fry_futurama',
  'leela_futurama', 'bender_futurama', 'amy_futurama', 'hermes_futurama', 'zoidberg_futurama', 'birdperson']);
export const ABILITIES_WAVE12 = Object.freeze(Object.fromEntries(entries.filter(([id]) => !revisionIds.has(id))));
export const ABILITY_REVISIONS_WAVE12 = Object.freeze(Object.fromEntries(entries.filter(([id]) => revisionIds.has(id))
  .map(([id, entry]) => [id, { ...entry, versionNote: 'Wave 12 source curation: ' + entry.sourceReference }])));
