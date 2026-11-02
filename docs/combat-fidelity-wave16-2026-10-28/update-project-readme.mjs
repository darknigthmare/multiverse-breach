// Deterministic documentation update from the protected, validated W15 README.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, prefix, read, json, sha, validateFreeze, verifyHashes } from './closure-support.mjs';

export function renderProjectReadmeWave16(audit, delivery, baselineMarkdown, validation) {
let markdown = baselineMarkdown;
const nf = value => Number(value).toLocaleString('fr-FR');
assert.ok(Number.isFinite(Date.parse(validation.verifiedAt)), 'Observed validation date is required');
const validationDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(validation.verifiedAt));
const replace = (before, after) => {
  assert.equal(markdown.split(before).length, 2, 'README baseline marker: ' + before);
  markdown = markdown.replace(before, after);
};
const between = (start, end, body) => {
  const first = markdown.indexOf(start), last = markdown.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, start); markdown = markdown.slice(0, first) + body + markdown.slice(last);
};
replace('**État de référence : lot 15 validé le 28 octobre 2026.**', `**État de référence : lot 16 validé le ${validationDate}.**`);
replace('quinze terrains verticaux, dont douze secteurs d’univers', 'dix-neuf terrains verticaux, dont seize secteurs d’univers');
between('Une entrée dans le catalogue,', '### Fidélité des personnages et des univers', `Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les compteurs proviennent de l’[audit figé du lot 16](${prefix}current.json). La [couverture cumulative](${prefix}coverage-all.csv) comprend chaque personnage ; le [tableau du lot](${prefix}coverage.csv) conserve les versions revues et les quatre identités suspendues.

| Périmètre au terme du lot 16 | Mesure vérifiée |
| --- | --- |
| Catalogue | **${nf(audit.scope.heroes)} personnages**, **${audit.scope.universes} univers** |
| Capacités explicitement rédigées | ${nf(audit.abilities.authoredHeroes)} personnages, ${nf(audit.abilities.authoredSlots)} actions simples, secondaires et défenses ; ${nf(audit.abilities.completeThreeSlotKits)} kits complets et ${audit.abilities.partialSlotKits} partiels |
| Présentations complètes32 | **${audit.meleeBindings.nativePresentationHeroes} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.nativePresentationHeroes)} manquantes |
| Présentations partielles | ${audit.meleeBindings.nativePartialPresentationHeroes}, suivies séparément |
| Animation Mêlée complète45 | **${audit.meleeBindings.fullDetailedMeleeManifestHeroes.length} personnages** ; ${nf(audit.scope.heroes - audit.meleeBindings.fullDetailedMeleeManifestHeroes.length)} manquantes |
| Bases de combat16 corrigées | ${audit.baseSpriteCorrections.heroes} personnages |
| Recettes de présentation | ${audit.presentations.scriptedHeroes} personnages, ${nf(audit.presentations.scriptedPairs)} associations personnage/phase |
| Invocations et renforts natifs16 | ${audit.entities.nativeAnimationAtlases} planches |
| Actions supplémentaires16 | ${audit.actions.nativeAction16Atlases} planche, ${audit.actions.nativeActionPoses} poses |
| Familier de protection autonome16 | ${audit.entities.wave16PersistentProtection16Atlases} planche, distincte des invocations RPG |
| Terrains Tactics verticaux | ${audit.tacticsTerrain.selectableVerticalBattlefields} : seize secteurs d’univers et trois Nexus |
| Décors animés | ${audit.stages.sceneMechanismDefinitions} mécanismes dans ${audit.stages.rosterUniversesWithSceneMechanismDefinition} univers ; ${audit.scope.universes - audit.stages.rosterUniversesWithSceneMechanismDefinition} univers sans mécanisme localisé |
| Ressources de cet audit combat | ${nf(audit.assetInventory.deliveredUniquePngFiles)} PNG dans ${audit.assetInventory.registryFiles} registres ; 982 PNG et 127 registres antérieurs préservés |

Cet inventaire combat ne comprend pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations possèdent leurs propres catalogues. Les 525 univers ont une ambiance par défaut ; les mécanismes liés à des scènes précises constituent une couverture supplémentaire.

Le **lot 16** livre **120 personnages en trois groupes parallèles de 40** : 120 présentations32 et 120 bases16, Senua avec 45 états/180 poses, six renforts RPG16, le Fox Devil16,16 dessins supplémentaires pour Starburst Stream de Kirito et un Shield Pal autonome16. Cela représente **${nf(delivery.newPoses)} poses distinctes dans ${delivery.newPngFiles} nouveaux PNG**. Les 124 identités revues possédaient déjà leurs trois actions de base ; ces révisions n’augmentent pas le nombre de kits rédigés. Les [sources et exclusions](${prefix}README.md) distinguent les dessins retenus, les corrections et les manquants cumulés.

Une présentation32 réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Une base16 couvre quatre états ; elle ne remplace pas les 45 états physiques du manifeste Mêlée.

Abe canalise puis contrôle un vrai Slig admissible ; ses commandes utilisent le corps, le fusil et la ressource du Slig. Akane utilise un Paralyzer explicitement autorisé, sans dégâts ni élévation. Les renforts d’Abe appelés par Munch ou l’Étranger et ceux d’Akane appelés par Shinya ou Ginoza respectent les mêmes cibles admissibles ; le contrôle persiste après la cinématique et reste lié à son véritable invocateur. Mugman possède une invulnérabilité de 4,85 secondes simulées ; le Shield Pal de Chalice absorbe un coup positif et persiste jusque-là. Yukikaze de Hakumen prépare une riposte dont le contact doit être réellement atteint. Kirito, Aya et BT déclenchent16, 7 et 14 événements temporisés, avec pause, interruption et dépense unique de la jauge. Maya et Val conservent leur contrôle et leur soin de proximité précédemment validés.

John Wick, Robin, Raven et Starfire restent sans nouveaux native32/base16, avec les refus et périmètres exacts archivés. Tank, MEIKO, KAITO et l’Oracle sont quatre ajouts distincts aux lots effectifs. Le Starfire RPG16, produit avant son refus native48 séparé, garde sa propre provenance et son rôle RPG.

`);
replace('| White Forest | Half-Life 2: Episode Two, 2007 | Forêt, reliefs et ouvrages du complexe |', `| White Forest | Half-Life 2: Episode Two, 2007 | Forêt, reliefs et ouvrages du complexe |
| Inkwell Isle One | Cuphead, 2017 | Prairie de dessin animé, chemins et ponts en bois |
| Chaîne de fabrication IMC | Titanfall2, 2016, Into the Abyss | Plateformes de production, coursives et passages superposés |
| Central City | Fullmetal Alchemist: Brotherhood, 2009 | Place, voies ferrées, escaliers et maçonnerie |
| Royaume Sadida | Wakfu, saison1 | Racines, sous-bois, canopée et passages naturels |`);
replace('Les quinze terrains distinguent', 'Les dix-neuf terrains distinguent');
replace('Dans les douze secteurs d’univers,', 'Dans les seize secteurs d’univers,');
replace('Les **34 matières configurées**', 'Les **42 matières configurées**');
replace('Les [matériaux W15](src/game/tacticsUniversePresentationWave15.js) et les [quatre secteurs dédiés](src/game/tacticsUniverseBattlefieldsWave15.js)', 'Les [matériaux W16](src/game/tacticsUniversePresentationWave16.js) et les [quatre secteurs supplémentaires](src/game/tacticsUniverseBattlefieldsWave16.js)');
replace('Le **[guide Tactics jouable](docs/tactics-terrain-verticality.md)**', 'Le **[guide Tactics W16 jouable](docs/tactics-universes-2026-10-28/README.md)**');
replace('montrent les captures desktop/mobile et les contrôles réels.', 'conservent leurs captures historiques. La [galerie W16](docs/tactics-universes-2026-10-28/index.html) montre les nouveaux secteurs desktop/mobile et les contrôles réels.');
between('La clôture du lot 15 a exécuté', 'Les captures et parcours navigateur', `La clôture du lot 16 a exécuté le véritable build complet avec un **code de sortie 0** et **${nf(validation.testsPassed)} tests réussis dans ${validation.testSuites} groupes**. Sa preuve de production vérifie les ${nf(audit.assetInventory.deliveredUniquePngFiles)} PNG dans public, dist et les réponses HTTP, avec décodage libvips et Chromium. Les preuves navigateur couvrent les présentations, les bases, les quatre moteurs, les commandes particulières, les invocations, Senua, les terrains et les scènes. Les résultats sont datés et liés aux entrées figées ; les cinq étapes Rift précèdent le gel de production.

[Validation du lot 16](${prefix}validation.json) · [Preuves navigateur](${prefix}browser-checks.json) · [Ressources servies](${prefix}browser/production-assets-http.json)

`);
replace('Le [plan du lot 15](docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json)', 'Le [plan du lot 16](docs/combat-fidelity-wave16-2026-10-28/batch-plan-before.json), complété par ses deux annexes préalables aux générations correspondantes,');
replace('[définitions des personnages](src/game/combat/combatSourceDefinitionsWave15.js)', '[définitions des personnages](src/game/combat/combatSourceDefinitionsWave16.js)');
replace('- [Dernier lot combat clôturé — W15](docs/combat-fidelity-wave15-2026-10-26/README.md)', '- [Dernier lot combat clôturé — W16](docs/combat-fidelity-wave16-2026-10-28/README.md)');
replace('- [Couverture par personnage — W15](docs/combat-fidelity-wave15-2026-10-26/coverage.csv) : tableau exploitable des couvertures complètes, partielles et manquantes.', '- [Couverture cumulative par personnage — W16](docs/combat-fidelity-wave16-2026-10-28/coverage-all.csv) : couvertures complètes, partielles et manquantes pour les 1 911 personnages.');
replace('- [Terrain Tactics et verticalité](docs/tactics-terrain-verticality.md) : guide des quinze terrains jouables, des objectifs, des commandes et des matériaux par face et étage.', '- [Terrain Tactics et verticalité — W16](docs/tactics-universes-2026-10-28/README.md) : nouveaux secteurs, commandes, objectifs et 42 matériaux par face et étage. Le [guide W15](docs/tactics-terrain-verticality.md) conserve son état historique.');
return markdown;
}

async function main() {
assert.ok(process.argv.includes('--after-final-validation'));
validateFreeze();
const audit = json(prefix + 'current.json'), validation = json(prefix + 'validation.json');
const delivery = json(prefix + 'deliverables.json');
assert.equal(validation.passed, true); assert.equal(validation.build.exitCode, 0);
assert.equal(validation.currentAuditSha256, sha(read(prefix + 'current.json'))); verifyHashes(audit.inputHashes);
const baselineMarkdown = read(prefix + 'baseline-project-readme-wave15.md').toString();
const markdown = renderProjectReadmeWave16(audit, delivery, baselineMarkdown, validation);
const currentMarkdown = read('README.md').toString();
assert.ok(currentMarkdown === baselineMarkdown || currentMarkdown === markdown,
  'README changed independently; preserve the new content before reconciling this update');
if (!process.argv.includes('--check-only')) fs.writeFileSync(path.resolve(root, 'README.md'), markdown);
console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'), bytes: Buffer.byteLength(markdown), file: 'README.md', validatedWave: 16 }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
