// Pure measured fragment for the README owner; this module writes nothing.
import assert from 'node:assert/strict';
import { COMBAT_SOURCE_DEFINITIONS_WAVE14 } from '../../src/game/combat/combatSourceDefinitionsWave14.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS } from '../../src/game/tacticsUniverseBattlefields.js';

export function wave14Readme({ current, baseline, newNative, newPartial, newBases, newFull, newSummons, newSheets, poses, validationText, batch }) {
  const names = new Map(batch.heroes.map(row => [row.hero.id, row.hero.name]));
  const sources = Object.values(COMBAT_SOURCE_DEFINITIONS_WAVE14);
  assert.equal(sources.length, 40); assert.equal(batch.wave, 14);
  const fields = Object.values(TACTICS_UNIVERSE_BATTLEFIELDS); assert.equal(fields.length, 8);
  assert.equal(current.tacticsTerrain.universeBattlefields, fields.length);
  const parts = Object.entries(batch.parts).map(([part, ids]) => '- ' + part + ' : ' + ids.map(id => names.get(id) || id).join(', ') + '.').join('\n');
  const places = fields.map(field => '- ' + field.source.location + ' — ' + field.source.work + '.').join('\n');
  const missing = current.batch.remainingNativeCharacterIds;
  return '# Fragment mesuré du lot 14\n\n'
    + 'Ce fragment est destiné au responsable du README ; il ne remplace aucun README automatiquement.\n\n'
    + parts + '\n\n'
    + 'Livraison : **' + newNative.length + ' atlas de 32 poses**, **' + newBases.length + ' bases de 16 poses**, **' + newFull.length + ' manifeste Mêlée de 45 états** (' + newFull.map(entry => names.get(entry.id) || entry.id).join(', ') + '), **' + newSummons.length + ' renforts RPG de 16 poses**. Les ' + newPartial.length + ' planches partielles restent distinctes des complètes. Total : **' + poses + ' cellules natives dans ' + newSheets.size + ' nouveaux PNG**, avec les cellules inutilisées, miroirs et réemplois exclus.\n\n'
    + 'Manquants du lot : ' + (missing.length ? missing.join(', ') : 'aucun atlas32 ni base16 manquant parmi les 40 identités retenues') + '. Les exclusions des vagues précédentes ne sont pas comptées comme refus nouveaux.\n\n'
    + 'Le RPG livre six partenaires du même univers que leur appelant, avec dix parcours offensifs et deux parcours de protection sur les deux camps. Une adaptation de renfort ne certifie pas une invocation narrative officielle.\n\n'
    + 'Huit terrains propres à Tactics étendent les trois terrains verticaux Nexus :\n\n' + places + '\n\n'
    + 'Chaque plateau possède sa topologie jouable, ses matières de dessus et de flanc, son environnement procédural dédié et ses décors physiques. Les cartes plates et les anciens Nexus utilisent aussi un fond propre à Tactics. Le rendu ne réutilise aucun fond RPG, Combat ou Mêlée. Les niveaux sont des secteurs originaux adaptés à ces lieux ; leur grille ne reproduit pas un plan officiel à l’identique.\n\n'
    + '| Couverture cumulée | Mesure |\n| --- | --- |\n'
    + '| Catalogue | ' + current.scope.heroes + ' personnages, ' + current.scope.universes + ' univers |\n'
    + '| Présentations32 | ' + current.meleeBindings.nativePresentationHeroes + ' |\n'
    + '| Bases16 | ' + current.baseSpriteCorrections.heroes + ' |\n'
    + '| Mêlée45 | ' + current.meleeBindings.fullDetailedMeleeManifestHeroes.length + ' |\n'
    + '| Atlas de renforts natifs16 | ' + current.entities.nativeAnimationAtlases + ' |\n'
    + '| Terrains Tactics verticaux | ' + current.tacticsTerrain.selectableVerticalBattlefields + ', dont huit secteurs d’univers |\n'
    + '| Inventaire suivi | ' + current.assetInventory.deliveredUniquePngFiles + ' PNG et ' + current.assetInventory.registryFiles + ' registres |\n\n'
    + 'Les **' + baseline.assetInventory.deliveredUniquePngFiles + ' PNG et ' + baseline.assetInventory.registryFiles + ' registres W13** restent immuables. Les ' + current.stages.sceneMechanismDefinitions + ' mécanismes de scène antérieurs restent suivis séparément des nouvelles cartes Tactics.\n\n'
    + validationText + '\n\n'
    + '**Fidélité officielle 1:1 certifiée : false.** Les périodes, gestes, armes et environnements sont documentés et contrôlés ; les dessins et secteurs de jeu restent des adaptations.\n';
}
