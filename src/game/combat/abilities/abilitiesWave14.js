import { ABILITIES_WAVE14_DEFINITIONS } from './abilitiesWave14Definitions.js';
// Membership fixed before editing: 12 new identities and 28 explicit source revisions.
const revisionIds = new Set(["aragorn_lotr","gandalf_lotr","legolas_lotr","gimli_lotr","dark_souls_chosen_undead","dark_souls_solaire","dark_souls_siegmeyer","lara_croft_tr","jonah_tr","noble_six","buck_odst","kelly_087","linda_058","ashley_williams","mordin","anya_stroud","carmine_cog","kait_diaz","ezio_auditore_ac","desmond_miles_ac","kassandra_ac","no_mans_sky_traveller","no_mans_sky_nada","no_mans_sky_polo","deus_ex_adam_jensen","deus_ex_faridah_malik","deus_ex_alex_vega","boone_fnv"]);
const entries = Object.entries(ABILITIES_WAVE14_DEFINITIONS);
if (entries.length !== 40 || revisionIds.size !== 28) throw new Error('W14 requires exactly 40 identities and 28 revisions');
export const ABILITIES_WAVE14 = Object.freeze(Object.fromEntries(entries.filter(([id]) => !revisionIds.has(id))));
export const ABILITY_REVISIONS_WAVE14 = Object.freeze(Object.fromEntries(entries.filter(([id]) => revisionIds.has(id)).map(([id, entry]) => [id, { ...entry, versionNote: 'Wave 14 selected source curation: ' + entry.sourceReference }])));
