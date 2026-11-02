import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from './combatSourceDefinitionsWave16.js';
import { WAVE_16_EFFECTIVE_IDS } from './cohortWave16.js';

// Native artwork supplies the pose. These recipes retain source identities and
// make the adapted finale explicit without inventing a second actor or power.
export const WAVE_16_PRESENTATION_DEFINITIONS = Object.freeze(WAVE_16_EFFECTIVE_IDS
  .filter(id => COMBAT_SOURCE_DEFINITIONS_WAVE16[id]).map(id => [id, COMBAT_SOURCE_DEFINITIONS_WAVE16[id]])
  .map(([id, source]) => [id, source.universe,
    `${source.sourceWork}. ${source.sourceReference}. Generated adaptation; original source animation frames are not certified.`,
    source.actionName || source.name,
    [`Préparation de ${source.weapon}`, `Départ dans la tenue de ${source.sourceWork}`,
      `${source.actionName || source.name}, finale adaptée sans adversaire ajouté`,
      `Victoire dans la tenue de ${source.sourceWork}`, `Reprise après défaite dans ${source.sourceWork}`,
      `Préparation de la prochaine manche`, `Récupération entre les manches`],
    Array(7).fill('nativeWave16Scene'), source.kind, []]));
