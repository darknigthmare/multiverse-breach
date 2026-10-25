import { ABILITIES_WAVE13_DEFINITIONS } from './abilitiesWave13Definitions.js';

// Exact prior membership measured before integration; these are revisions of
// existing authored basic kits and must not inflate newly covered identities.
const revisionIds = new Set([
  'dallas_alien', 'parker_alien', 'lambert_alien', 'ash_alien', 'glados', 'wheatley',
  'rincewind_dw', 'vimes_dw', 'granny_dw', 'twoflower_dw', 'death_dw', 'nanny_ogg_dw',
  'meryl_mgs', 'liquid_snake', 'the_boss_mgs', 'ocelot_mgs', 'luke', 'vader',
  'obi_wan', 'yoda', 'joel_tlou', 'tess_tlou'
]);
const entries = Object.entries(ABILITIES_WAVE13_DEFINITIONS);
if (entries.length !== 40 || new Set(entries.map(([id]) => id)).size !== 40)
  throw new Error('W13 requires exactly forty distinct source identities');
export const ABILITIES_WAVE13 = Object.freeze(Object.fromEntries(entries.filter(([id]) => !revisionIds.has(id))));
export const ABILITY_REVISIONS_WAVE13 = Object.freeze(Object.fromEntries(entries.filter(([id]) => revisionIds.has(id))
  .map(([id, entry]) => [id, { ...entry, versionNote: 'Wave 13 selected source curation: ' + entry.sourceReference }])));
