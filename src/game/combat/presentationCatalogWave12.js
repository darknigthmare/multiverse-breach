import { COMBAT_SOURCE_DEFINITIONS_WAVE12 } from './combatSourceDefinitionsWave12.js';
import { HEROES_DB } from '../heroes.js';

const names = Object.fromEntries(HEROES_DB.map(hero => [hero.id, hero.name]));
const blockedNative = new Set(['morty']);

// Recipes name the selected character and source action. Actual dedicated
// coverage is determined from the native registry, never from this list alone.
export const WAVE_12_PRESENTATION_DEFINITIONS = Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE12)
  .map(([id, source]) => [id, source.universe,
    `${source.sourceWork}. ${source.sourceReference}. Generated poses and bounded engine mechanics are adaptations; source 1:1 is not certified.`,
    source.name, [
      `${names[id]} : préparation de ${source.name}`,
      `${names[id]} : relâchement de la posture`,
      source.name,
      `${names[id]} : retour au calme après victoire`,
      `${names[id]} : reprise d’appui après défaite`,
      `${names[id]} : préparation de la manche suivante`,
      `${names[id]} : récupération entre deux manches`
    ], Array(7).fill('nativeWave12Scene'), source.kind,
    blockedNative.has(id) ? ['native-all-phase-artwork', 'native-base16-artwork'] : []]);
