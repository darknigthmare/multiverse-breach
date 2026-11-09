import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from './combatSourceDefinitionsWave17.js';
import { WAVE_17_IDS } from './cohortWave17.js';

// Physical poses come from the delivered native atlas. The finale slot keeps
// the character's actual source action; it does not invent an execution.
export const WAVE_17_PRESENTATION_DEFINITIONS = Object.freeze(WAVE_17_IDS.map(id => {
  const source = COMBAT_SOURCE_DEFINITIONS_WAVE17[id];
  return [id, source.universe,
    `${source.sourceWork}. ${source.sourceReference}. Generated adaptation; original source animation frames are not certified.`,
    source.actionName || source.name,
    [`Préparation de ${source.weapon}`, `Départ dans la tenue de ${source.sourceWork}`,
      `${source.actionName || source.name}, finale adaptée`,
      `Victoire dans la tenue de ${source.sourceWork}`, `Récupération après défaite dans ${source.sourceWork}`,
      'Préparation de la prochaine manche', 'Récupération entre les manches'],
    Array(7).fill('nativeWave17Scene'), source.kind, []];
}));
