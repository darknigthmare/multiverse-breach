// Explicit action records are merged here; no name or ability is inferred from
// a character's genre, palette, index, or universe title.
import { ABILITIES_LOT_2 } from './abilitiesLot2.js';
import { ABILITIES_CANONICAL } from './abilitiesCanonical.js';
import { ABILITIES_LOT_4 } from './abilitiesLot4.js';
import { ABILITIES_LOT_1 } from './abilitiesLot1.js';
import { ABILITIES_ADDITIONAL } from './abilitiesAdditional.js';
import { ABILITIES_RESIDUAL } from './abilitiesResidual.js';
import { ABILITIES_LOT_3 } from './abilitiesLot3.js';
import { ABILITIES_CORRECTIONS } from './abilitiesCorrections.js';
import { ABILITIES_WAVE6 } from './abilitiesWave6.js';
import { ABILITIES_WAVE7, ABILITY_REVISIONS_WAVE7 } from './abilitiesWave7.js';
import { ABILITIES_WAVE8, ABILITY_REVISIONS_WAVE8 } from './abilitiesWave8.js';
import { ABILITIES_WAVE9, ABILITY_REVISIONS_WAVE9 } from './abilitiesWave9.js';

import { ABILITIES_WAVE10, ABILITY_REVISIONS_WAVE10 } from './abilitiesWave10.js';
import { ABILITIES_WAVE11, ABILITY_REVISIONS_WAVE11 } from './abilitiesWave11.js';

const entries = [ABILITIES_LOT_2, ABILITIES_CANONICAL, ABILITIES_LOT_4, ABILITIES_LOT_1, ABILITIES_ADDITIONAL, ABILITIES_RESIDUAL, ABILITIES_LOT_3, ABILITIES_CORRECTIONS, ABILITIES_WAVE6, ABILITIES_WAVE7, ABILITIES_WAVE8, ABILITIES_WAVE9, ABILITIES_WAVE10, ABILITIES_WAVE11].flatMap(lot => Object.entries(lot));
if (new Set(entries.map(([id]) => id)).size !== entries.length) throw new Error('Duplicate authored basic combat identity');
const revisionEntries = [
  ...Object.entries(ABILITY_REVISIONS_WAVE7).map(([id, fields]) => [id, { ...fields, revisionWave: 7 }]),
  ...Object.entries(ABILITY_REVISIONS_WAVE8).map(([id, fields]) => [id, { ...fields, revisionWave: 8 }]),
  ...Object.entries(ABILITY_REVISIONS_WAVE9).map(([id, fields]) => [id, { ...fields, revisionWave: 9 }]),
  ...Object.entries(ABILITY_REVISIONS_WAVE10).map(([id, fields]) => [id, { ...fields, revisionWave: 10 }]),
  ...Object.entries(ABILITY_REVISIONS_WAVE11).map(([id, fields]) => [id, { ...fields, revisionWave: 11 }])
];
if (new Set(revisionEntries.map(([id]) => id)).size !== revisionEntries.length) throw new Error('Duplicate source-version revision');
const revisions = new Map(revisionEntries);
const revised = entries.map(([id, entry]) => {
  const revision = revisions.get(id);
  if (!revision) return [id, entry];
  if (revision.universe !== entry.universe) throw new Error(`Cross-universe combat revision: ${id}`);
  revisions.delete(id);
  const { defenseName, versionNote, revisionWave, ...fields } = revision;
  return [id, Object.freeze({ ...entry, ...fields,
    sourceReference: `${entry.sourceReference} ${versionNote}`,
    defense: defenseName ? { ...entry.defense, name: defenseName } : entry.defense,
    versionRevision: `wave${revisionWave}-explicit-source-version`, priorSourceWork: entry.sourceWork })];
});
if (revisions.size) throw new Error(`Unknown combat revision IDs: ${[...revisions.keys()].join(', ')}`);
export const COMBAT_ABILITY_OVERRIDES = Object.freeze(Object.fromEntries(revised));
