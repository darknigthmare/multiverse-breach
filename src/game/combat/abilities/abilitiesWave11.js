import * as partA from './abilitiesWave11PartA.js';
import * as partB from './abilitiesWave11PartB.js';
import * as partC from './abilitiesWave11PartC.js';
import * as partD from './abilitiesWave11PartD.js';

const all = {
  ...partA.ABILITIES_WAVE11_PART_A, ...partA.ABILITY_REVISIONS_WAVE11_PART_A,
  ...partB.ABILITIES_WAVE11_PART_B, ...partB.ABILITY_REVISIONS_WAVE11_PART_B,
  ...partC.ABILITIES_WAVE11_PART_C, ...partC.ABILITY_REVISIONS_WAVE11_PART_C,
  ...partD.ABILITIES_WAVE11_PART_D, ...partD.ABILITY_REVISIONS_WAVE11_PART_D,
};
const revisionIds = new Set(["buffy_summers","willow_rosenberg","giles_buffy","xander_buffy","harry_potter","hermione_granger","ron_weasley","dumbledore","snape","sheppard_sga","mckay_sga","teyla_sga","rush_sgu","young_sgu","greer_sgu","lilith_borderlands","mordecai_borderlands","claptrap_borderlands","toast_mm","capable_mm","zorg","cornelius","leodagan_kaamelott","lancelot_kaamelott"]);
export const ABILITIES_WAVE11 = Object.freeze(Object.fromEntries(Object.entries(all).filter(([id]) => !revisionIds.has(id))));
export const ABILITY_REVISIONS_WAVE11 = Object.freeze(Object.fromEntries(Object.entries(all).filter(([id]) => revisionIds.has(id)).map(([id, entry]) => [id, { ...entry, versionNote: 'Wave11 source curation: ' + entry.sourceReference }])));
