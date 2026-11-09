// Frozen before execution; project README changes only after real validation.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prefix, root, read, json, sha, validateFreeze, writeReports } from './closure-support.mjs';
import { assertValidatedArtifactsCurrent } from './validate-final-artifacts.mjs';

export function renderProjectReadmeWave17(audit, delivery, baselineMarkdown, validation) {
  let markdown = baselineMarkdown;
  const nf = n => Number(n).toLocaleString('fr-FR'), date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(validation.verifiedAt));
  const replace = (before, after) => { assert.equal(markdown.split(before).length, 2, 'README baseline marker: ' + before); markdown = markdown.replace(before, after); };
  const between = (start, end, body) => { const first = markdown.indexOf(start), last = markdown.indexOf(end, first + start.length); assert.ok(first >= 0 && last > first, start); markdown = markdown.slice(0, first) + body + markdown.slice(last); };
  const reference = markdown.match(/\*\*État de référence : lot 16 validé le [^.]+\.\*\*/)?.[0]; assert.ok(reference);
  replace(reference, `**État de référence : lot 17 validé le ${date}.**`);
  replace('dix-neuf terrains verticaux, dont seize secteurs d’univers', 'vingt-trois terrains verticaux, dont vingt secteurs d’univers');
  between('Une entrée dans le catalogue,', '### Fidélité des personnages et des univers', `Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les compteurs proviennent de l’[audit figé du lot 17](${prefix}current.json). La [couverture cumulative](${prefix}coverage-all.csv) comprend chaque personnage ; le [tableau du lot](${prefix}coverage.csv) conserve les 125 identités revues, dont cinq identités suspendues et 120 emplacements effectifs de dessin.

| Périmètre au terme du lot 17 | Mesure vérifiée |
| --- | --- |
| Catalogue | **${nf(audit.scope.heroes)} personnages**, **${audit.scope.universes} univers** |
| Capacités explicitement rédigées | ${nf(audit.abilities.authoredHeroes)} personnages, ${nf(audit.abilities.authoredSlots)} actions simples, secondaires et défenses ; ${nf(audit.abilities.completeThreeSlotKits)} kits complets et ${audit.abilities.partialSlotKits} partiels |
| Emplacements de base sans rédaction explicite | **${nf(audit.scope.abilitySlots - audit.abilities.authoredSlots)} sur ${nf(audit.scope.abilitySlots)}** ; mesure distincte des capacités strictement génériques (0) |
| Présentations complètes32 | **${audit.meleeBindings.nativePresentationHeroes} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.nativePresentationHeroes)} manquantes |
| Présentations partielles | ${audit.meleeBindings.nativePartialPresentationHeroes}, suivies séparément |
| Animation Mêlée complète45 | **${audit.meleeBindings.fullDetailedMeleeManifestHeroes.length} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.fullDetailedMeleeManifestHeroes.length)} manquantes |
| Bases de combat16 corrigées | ${audit.baseSpriteCorrections.heroes} personnages |
| Recettes de présentation | ${audit.presentations.scriptedHeroes} personnages, ${nf(audit.presentations.scriptedPairs)} associations personnage/phase |
| Invocations et renforts natifs16 | ${audit.entities.nativeAnimationAtlases} planches |
| Actions supplémentaires16 | ${audit.actions.nativeAction16Atlases} planches, ${audit.actions.nativeActionPoses} poses |
| NPC autonome16 W17 | Un chaton de Tail Concerto, hors compteur RPG |
| Familier de protection autonome16 historique | Shield Pal, distinct des invocations RPG et des nouveaux dessins W17 |
| Terrains Tactics verticaux | ${audit.tacticsTerrain.selectableVerticalBattlefields} : vingt secteurs d’univers et trois Nexus ; ${audit.tacticsTerrain.materials} matériaux |
| Décors animés | ${audit.stages.sceneMechanismDefinitions} mécanismes dans ${audit.stages.rosterUniversesWithSceneMechanismDefinition} univers ; ${audit.scope.universes - audit.stages.rosterUniversesWithSceneMechanismDefinition} univers sans mécanisme localisé |
| Ressources de cet audit combat | ${nf(audit.assetInventory.deliveredUniquePngFiles)} PNG dans ${audit.assetInventory.registryFiles} registres ; 1 237 PNG et 138 registres antérieurs préservés |

Cet inventaire combat ne comprend pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations possèdent leurs propres catalogues. Les 525 univers ont une ambiance par défaut ; les mécanismes liés à des scènes précises constituent une couverture supplémentaire.

Le **lot 17** livre **120 personnages en trois groupes parallèles de 40** : 120 présentations32, 120 bases16, Jade avec 45 états et 180 poses, six renforts RPG16, 16 dessins supplémentaires pour son Gyrodisk et un chaton NPC16 autonome. Cela représente **${nf(delivery.newPoses)} poses distinctes dans ${delivery.newPngFiles} nouveaux PNG**. Les 125 identités revues comprennent 80 identités nouvellement rédigées et 45 révisions ; 261 actions de base supplémentaires sont explicites. Les [sources et exclusions](${prefix}README.md) gardent les manquants cumulés et les refus réels.

Une présentation32 réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Une base16 couvre quatre états ; elle ne remplace pas les 45 états physiques du manifeste Mêlée. Captures, remplissage, miroirs et images historiques ne comptent pas comme nouvelles poses.

Les six renforts RPG sont Jade, Rayman, Skye Autumn, Okarun, Melody et Medic. Le faisceau connecté du Medi Gun stock construit une charge en 40 secondes simulées, puis l’ÜberCharge protège pendant 8 secondes ; Medic n’inflige pas de dégâts offensifs. Jade possède six types de parcours clavier dans chaque camp, avec contact réel du bâton et lancer depuis le gant mesuré. Le chaton de Tail Concerto conserve ses PV, son altitude, son camp et ses commandes pendant la capture non létale et la libération dans les quatre moteurs.

Les preuves des trois moteurs autoritaires comptent **720 situations : 718 actions engagées et deux refus conditionnels de Medic en Fighter**, un dans chaque camp. Sans allié visible distinct, le Medi Gun garde sa charge et ne lance aucun faisceau ; ses deux poses de bibliothèque ne sont pas comptées comme des actions exécutées. Les preuves du chaton couvrent quatre parcours GameCanvas RPG/Smash, deux GameCanvas Tactics et deux FighterMode.

Les contrôles historiques d’Abe, d’Akane, de Mugman, de Chalice et de Hakumen, les séquences de Kirito, Aya et BT ainsi que les effets de Maya et Val restent préservés par les tests et les preuves antérieures. Leurs dessins ne sont pas recomptés dans cette livraison.

G de The House of the Dead1 a été réellement refusé ; G3 n’a pas été demandé après ce refus. Mai, Judy et Boris ont chacun un refus réel sans nouvelle tentative. Dana Barrett, Louis Tully, Shep, Stella et Hammond occupent cinq emplacements distincts de remplacement. Les références historiques des identités suspendues restent accessibles et ne deviennent pas des dessins livrés W17.

`);
  replace('| Royaume Sadida | Wakfu, saison1 | Racines, sous-bois, canopée et passages naturels |', `| Royaume Sadida | Wakfu, saison1 | Racines, sous-bois, canopée et passages naturels |
| Île du phare de Hillys | Beyond Good & Evil, 2003 | Terrasse herbeuse, escaliers rocheux et débarcadère inférieur |
| Forêt des Ptizêtres | Rayman Legends, 2013 | Racines, sous-bois et passage supérieur brisé |
| Exposition VDNH | Atomic Heart, 2023 | Galerie de pierre, tranchée technique et passerelle |
| Rainforest District | Zootopia, 2016 | Canopée, passerelles humides et berge |`);
  replace('Les dix-neuf terrains distinguent', 'Les vingt-trois terrains distinguent');
  replace('Dans les seize secteurs d’univers,', 'Dans les vingt secteurs d’univers,');
  replace('Les **42 matières configurées**', 'Les **52 matières configurées**');
  replace('Les [matériaux W16](src/game/tacticsUniversePresentationWave16.js) et les [quatre secteurs supplémentaires](src/game/tacticsUniverseBattlefieldsWave16.js)', 'Les [matériaux W17](src/game/tacticsUniversePresentationWave17.js) et les [quatre secteurs supplémentaires](src/game/tacticsUniverseBattlefieldsWave17.js)');
  replace('Le **[guide Tactics W16 jouable](docs/tactics-universes-2026-10-28/README.md)**', 'Le **[guide Tactics W17 jouable](docs/tactics-universes-2026-11-02/README.md)**');
  replace('La [galerie W16](docs/tactics-universes-2026-10-28/index.html) montre les nouveaux secteurs desktop/mobile et les contrôles réels.', 'La [galerie W16](docs/tactics-universes-2026-10-28/index.html) conserve ses captures historiques. La [galerie W17](docs/tactics-universes-2026-11-02/index.html) montre les quatre nouveaux secteurs desktop/mobile et les deux terrains de contrôle.');
  between('La clôture du lot 16 a exécuté', 'Les captures et parcours navigateur', `La clôture du lot 17 a exécuté le véritable build complet avec un **code de sortie 0** et **${nf(validation.testsPassed)} tests réussis dans ${validation.testSuites} groupes**. Sa preuve de production vérifie les ${nf(audit.assetInventory.deliveredUniquePngFiles)} PNG dans public, dist, les réponses HTTP Node et Chromium, avec décodage complet dans les deux bibliothèques. Dix domaines de preuves couvrent les présentations, les bases, les trois moteurs autoritaires, Tactics, ses parcours UI, les scènes, Jade, les renforts RPG et les deux ensembles NPC. Chaque exécution finale suit le gel et garde les mêmes entrées avant et après ; les cinq vraies commandes Rift précèdent le gel. Les captures inspectées sont liées aux rapports et à leurs empreintes.

[Validation du lot 17](${prefix}validation.json) · [Preuves navigateur](${prefix}browser-checks.json) · [Ressources servies](${prefix}browser/production-assets-http.json)

`);
  replace('Le [plan du lot 16](docs/combat-fidelity-wave16-2026-10-28/batch-plan-before.json), complété par ses deux annexes préalables aux générations correspondantes,', 'Le [plan du lot 17](docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json), complété par ses quatre annexes préalables aux générations correspondantes,');
  replace('[définitions des personnages](src/game/combat/combatSourceDefinitionsWave16.js)', '[définitions des personnages](src/game/combat/combatSourceDefinitionsWave17.js)');
  replace('- [Dernier lot combat clôturé — W16](docs/combat-fidelity-wave16-2026-10-28/README.md)', '- [Dernier lot combat clôturé — W17](docs/combat-fidelity-wave17-2026-11-02/README.md)');
  replace('- [Couverture cumulative par personnage — W16](docs/combat-fidelity-wave16-2026-10-28/coverage-all.csv)', '- [Couverture cumulative par personnage — W17](docs/combat-fidelity-wave17-2026-11-02/coverage-all.csv)');
  replace('- [Terrain Tactics et verticalité — W16](docs/tactics-universes-2026-10-28/README.md) : nouveaux secteurs, commandes, objectifs et 42 matériaux par face et étage.', '- [Terrain Tactics et verticalité — W17](docs/tactics-universes-2026-11-02/README.md) : nouveaux secteurs, commandes, objectifs et 52 matériaux par face et étage.');
  return markdown;
}
async function main() {
  assert.ok(process.argv.includes('--after-final-validation')); const validation = assertValidatedArtifactsCurrent(), freeze = validateFreeze();
  const baselinePath = prefix + 'baseline-project-readme-wave16.md', baselineBytes = read(baselinePath);
  assert.equal(freeze.files[baselinePath], sha(baselineBytes), 'Freeze the exact pre-W17 project README snapshot');
  const markdown = renderProjectReadmeWave17(json(prefix + 'current.json'), json(prefix + 'deliverables.json'), baselineBytes.toString(), validation);
  const current = read('README.md').toString(); assert.ok(current === baselineBytes.toString() || current === markdown, 'Project README changed independently; preserve its edits before reconciliation');
  if (!process.argv.includes('--check-only')) writeReports([['README.md', markdown]]);
  console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'), validatedWave: 17, file: path.resolve(root, 'README.md'), bytes: Buffer.byteLength(markdown) }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
