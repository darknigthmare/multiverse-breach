import { COMBAT_SOURCE_DEFINITIONS_WAVE13 } from './combatSourceDefinitionsWave13.js';
import { HEROES_DB } from '../heroes.js';

const names = Object.fromEntries(HEROES_DB.map(hero => [hero.id, hero.name]));
const blockedNative = new Set(['vader', 'obi_wan', 'yoda', 'darth_maul', 'ahsoka_adult']);
// Native coverage comes from the generated registry. This catalogue records
// the authored seven-phase recipe; it never certifies a missing native image.
export const WAVE_13_PRESENTATION_DEFINITIONS = Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE13)
  .map(([id, source]) => [id, source.universe,
    `${source.sourceWork}. ${source.sourceReference}. Native drawings and bounded engine mechanics are adaptations; source 1:1 is not certified.`,
    source.name, [
      `${names[id]} : préparation de ${source.name}`,
      `${names[id]} : relâchement de la posture`,
      source.effect === 'damage' ? `${source.name}, geste physique local` : `${source.name}, consigne sans dégât`,
      `${names[id]} : retour au calme après victoire`,
      `${names[id]} : reprise d’appui après défaite`,
      `${names[id]} : préparation de la manche suivante`,
      `${names[id]} : récupération entre deux manches`
    ], Array(7).fill('nativeWave13Scene'), source.kind,
    blockedNative.has(id) ? ['native-all-phase-artwork', 'native-base16-artwork'] : []]);
