// Publish measured documentation only after the real final validation exists.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root, prefix, read, json, sha, validateFreeze } from './closure-support.mjs';

assert.ok(process.argv.includes('--after-final-validation'));
validateFreeze();
const audit = json(prefix + 'current.json'), validation = json(prefix + 'validation.json');
const delivery = json(prefix + 'deliverables.json');
assert.equal(validation.passed, true); assert.equal(validation.build.exitCode, 0);
assert.equal(validation.currentAuditSha256, sha(read(prefix + 'current.json')));
assert.equal(delivery.completeNative32.length, 120); assert.equal(delivery.base16.length, 120);
const nf = value => Number(value).toLocaleString('fr-FR');
let markdown = read('README.md').toString();
const replace = (before, after) => { assert.equal(markdown.split(before).length, 2, before); markdown = markdown.replace(before, after); };
const between = (start, end, body) => {
  const first = markdown.indexOf(start), last = markdown.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start);
  markdown = markdown.slice(0, first) + body + markdown.slice(last);
};
replace('**État de référence : lot 14 validé le 25 octobre 2026.**', '**État de référence : lot 15 validé le 26 octobre 2026.**');
replace('onze terrains verticaux, dont huit secteurs d’univers', 'quinze terrains verticaux, dont douze secteurs d’univers');
between('Une entrée dans le catalogue,', '### Fidélité des personnages et des univers', `Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les compteurs proviennent de l’[audit figé du lot 15](${prefix}current.json) et de sa [couverture par personnage](${prefix}coverage.csv).

| Périmètre au terme du lot 15 | Mesure vérifiée |
| --- | --- |
| Catalogue | **${nf(audit.scope.heroes)} personnages**, **${audit.scope.universes} univers** |
| Capacités explicitement rédigées | ${nf(audit.abilities.authoredHeroes)} personnages, ${nf(audit.abilities.authoredSlots)} actions simples, secondaires et défenses ; ${nf(audit.abilities.completeThreeSlotKits)} kits complets et ${audit.abilities.partialSlotKits} partiels |
| Présentations complètes32 | **${audit.meleeBindings.nativePresentationHeroes} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.nativePresentationHeroes)} manquantes |
| Présentations partielles | ${audit.meleeBindings.nativePartialPresentationHeroes}, suivies séparément |
| Animation Mêlée complète45 | **${audit.meleeBindings.fullDetailedMeleeManifestHeroes.length} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.fullDetailedMeleeManifestHeroes.length)} manquantes |
| Bases de combat16 corrigées | ${audit.baseSpriteCorrections.heroes} personnages |
| Recettes de présentation | ${audit.presentations.scriptedHeroes} personnages du catalogue, ${nf(audit.presentations.scriptedPairs)} associations personnage/phase |
| Invocations et renforts natifs16 | ${audit.entities.nativeAnimationAtlases} planches |
| Terrains Tactics verticaux | ${audit.tacticsTerrain.selectableVerticalBattlefields} : douze secteurs d’univers et trois Nexus |
| Décors animés | ${audit.stages.sceneMechanismDefinitions} mécanismes dans ${audit.stages.rosterUniversesWithSceneMechanismDefinition} univers ; ${audit.scope.universes - audit.stages.rosterUniversesWithSceneMechanismDefinition} univers sans mécanisme localisé |
| Ressources suivies par cet audit combat | ${audit.assetInventory.deliveredUniquePngFiles} PNG dans ${audit.assetInventory.registryFiles} registres ; les 730 PNG et 118 registres antérieurs sont préservés |

Cet inventaire combat ne comprend pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations possèdent leurs propres catalogues. Les 525 univers ont une ambiance par défaut ; un mécanisme animé lié à une scène précise constitue une couverture supplémentaire.

Le **lot 15** couvre **120 personnages en trois groupes parallèles de 40** : 120 planches de présentation32, 120 bases16, Sir Daniel Fortesque avec 45 états et 180 poses, et six renforts RPG16. La livraison contient **${nf(delivery.newPoses)} poses distinctes dans ${delivery.newPngFiles} nouveaux PNG**. Les 480 emplacements nommés comprennent 42 nouvelles identités et 78 révisions documentées ; chaque personnage possède un partenaire distinct du même univers. Les [sources et exclusions](${prefix}README.md) distinguent dessins retenus, corrections et vrais manquants cumulés.

Une présentation32 réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Une base16 couvre quatre états ; elle ne remplace pas les 45 états physiques du manifeste Mêlée.

Maya utilise un Phaselock sans dégâts : interruption et suspension d’un ennemi pendant 2,4 secondes, 1,2 seconde pour le secondaire, ou un tour Tactics. Val soigne les alliés blessés proches et elle-même avec Healing Burst. Portée, cibles, coûts et obstacles sont vérifiés par les moteurs. Ces actions ne créent pas de dégâts ou de protections étrangères à leur fonction.

`);
replace('Les dessins générés et les adaptations de mécaniques **ne constituent pas une reproduction 1:1 certifiée**.', 'Les dessins générés et les adaptations de mécaniques **ne constituent pas une reproduction 1:1 certifiée**. Les supers suivent leurs poses de relâchement et leurs points mesurés ; la synchronisation de toutes les attaques ordinaires des bases16 avec leurs frames source reste non certifiée.');
replace('| Valhalla | Halo 3, 2007 | Prairie, ruisseau et structures Forerunner |', '| Valhalla | Halo 3, 2007 | Prairie, ruisseau et structures Forerunner |\n| Dollet | Final Fantasy VIII, 1999 | Rues en pente, escaliers et passages superposés |\n| Cour du manoir Spencer | Resident Evil, 1996 | Jardin, fontaine, murs et dénivelés |\n| Red Rock Canyon | Fallout: New Vegas, 2010 | Grès, corniches et chemins de canyon |\n| White Forest | Half-Life 2: Episode Two, 2007 | Forêt, reliefs et ouvrages du complexe |');
replace('Les onze terrains distinguent', 'Les quinze terrains distinguent');
replace('Dans les huit nouveaux secteurs,', 'Dans les douze secteurs d’univers,');
replace('Les seize nouvelles matières complètent les matériaux Nexus', 'Les 34 matières configurées couvrent les secteurs d’univers et les arènes Nexus');
replace('La [galerie des huit secteurs](docs/tactics-universes-2026-10-25/index.html) montre les captures desktop/mobile et les contrôles réels.', 'La [galerie des huit secteurs W14](docs/tactics-universes-2026-10-25/index.html) et celle des [quatre secteurs W15](docs/tactics-universes-2026-10-26/index.html) montrent les captures desktop/mobile et les contrôles réels.');
between('La clôture du lot 14 a exécuté', 'Les captures et parcours navigateur', `La clôture du lot 15 a exécuté le véritable build complet avec un **code de sortie 0** et **${nf(validation.testsPassed)} tests réussis dans ${validation.testSuites} groupes**. Sa preuve de production vérifie les ${audit.assetInventory.deliveredUniquePngFiles} PNG dans public, dist et les réponses HTTP, avec décodage libvips et Chromium. Les résultats sont datés et liés aux entrées figées.

[Validation du lot 15](${prefix}validation.json) · [Preuves navigateur](${prefix}browser-checks.json) · [Contrôle des ressources servies](${prefix}browser/production-assets-http.json)

`);
replace('[Dernier lot combat clôturé — W14](docs/combat-fidelity-wave14-2026-10-25/README.md) : détails des 40 personnages et de la livraison.', '[Dernier lot combat clôturé — W15](' + prefix + 'README.md) : détails des trois groupes de 40 personnages et de la livraison.');
replace('[Couverture par personnage — W14](docs/combat-fidelity-wave14-2026-10-25/coverage.csv)', '[Couverture par personnage — W15](' + prefix + 'coverage.csv)');
replace('guide des onze terrains jouables', 'guide des quinze terrains jouables');
fs.writeFileSync(path.resolve(root, 'README.md'), markdown);
console.log(JSON.stringify({ readme: 'README.md', validatedWave: 15, tests: validation.testsPassed, png: audit.assetInventory.deliveredUniquePngFiles }));
