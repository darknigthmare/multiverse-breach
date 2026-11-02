// Human-readable coverage is derived from delivered files. It does not turn a
// prepared renderer, a generated source or a passing subset into a full build.
import assert from 'node:assert/strict';
import { measureCombatFidelity } from '../../scripts/combatFidelityAudit.mjs';
import { HEROES_DB } from '../../src/game/heroes.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from '../../src/game/combat/combatSourceDefinitionsWave15.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../../src/game/combatIdentity.js';
import { resolveSummonAnimationAsset } from '../../src/game/combat/summonAnimationCatalog.js';
import { validateFreeze, historicalBaseline, validateInventory, json, exists, prefix, writeReports, read, sha } from './closure-support.mjs';

assert.ok(process.argv.includes('--after-production-freeze'));
validateFreeze(); historicalBaseline();
const audit = measureCombatFidelity(); validateInventory(audit);
const plan = json(prefix + 'batch-plan-before.json'), delivery = json(prefix + 'deliverables.json');
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const rows = plan.heroes.map(row => {
  const id = row.hero.id, hero = roster.get(id), source = COMBAT_SOURCE_DEFINITIONS_WAVE15[id];
  const action = resolveCombatAbility(hero, 'special'), summon = resolveUniverseSummon(hero);
  const measured = audit.presentations.wave15Delivery.entries.find(entry => entry.id === id);
  assert.ok(measured);
  return { part: row.part, id, name: hero.name, universe: hero.universe, sourceWork: source.sourceWork,
    sourceReference: source.sourceReference, appearance: source.appearance, weapon: source.weapon,
    authoredKind: row.alreadyAuthored ? 'explicit-source-revision' : 'new-authored-identity',
    namedActionSlots: measured.namedSlots, superName: action.name, effect: action.effect, delivery: action.delivery,
    native32: measured.nativeAnimationDelivered, base16: measured.baseCorrectionDelivered,
    full45: audit.batch.native45CharacterIds.includes(id), partnerId: summon?.performer?.id || null,
    nativeRpg16: !!resolveSummonAnimationAsset(summon),
    source1to1Verified: false, baseActionTimingVerified: false };
});
assert.equal(rows.length, 120);
const fields = Object.keys(rows[0]), cell = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
const csv = fields.map(cell).join(',') + '\n' + rows.map(row => fields.map(key => cell(row[key])).join(',')).join('\n') + '\n';
const tally = rows.reduce((counts, row) => ({ ...counts, [row.effect]: (counts[row.effect] || 0) + 1 }), {});
const candidate = exists(prefix + 'validation.json') ? json(prefix + 'validation.json') : null;
const validated = candidate?.passed === true && candidate.build?.exitCode === 0
  && exists(prefix + 'current.json') && candidate.currentAuditSha256 === sha(read(prefix + 'current.json')) ? candidate : null;
const validationText = validated?.passed === true && validated.build?.exitCode === 0
  ? `Clôture validée : build complet avec code de sortie 0, ${validated.testsPassed} tests réussis dans ${validated.testSuites} groupes. Les ${audit.assetInventory.deliveredUniquePngFiles} PNG suivis ont été vérifiés dans public, dist et les réponses HTTP, puis décodés en libvips et Chromium.`
  : 'Les fichiers et la couverture sont mesurés ci-dessous. La clôture complète reste en attente des dernières preuves navigateur, du build réellement terminé et de la validation finale ; ce rapport intermédiaire ne prétend pas qu’ils ont réussi.';
const status = validated?.passed === true ? 'validée' : 'en cours de clôture';
const nf = value => Number(value).toLocaleString('fr-FR');
const markdown = `# Lot 15 — trois groupes de 40 personnages

La sélection de [120 personnages](batch-plan-before.json), répartie entre trois agents, est antérieure aux éditions. Elle couvre 43 univers : 42 nouvelles identités de capacité et 78 révisions explicitement séparées. La livraison est **${status}**. ${validationText}

Chaque groupe conserve ses sources, demandes image_gen, images originales, corrections, exclusions et mesures : [A](part-a/README.md), [B](part-b/README.md), [C](part-c/README.md). La [couverture par personnage](coverage.csv) reprend les versions et les fichiers effectivement livrés.

## Dessins livrés

| Couverture du lot | Mesure réelle |
| --- | --- |
| Présentations complètes32 | ${delivery.completeNative32.length} personnages, ${nf(delivery.completeNative32.length * 32)} poses |
| Bases16 | ${delivery.base16.length} personnages, ${nf(delivery.base16.length * 16)} poses |
| Mêlée complète45 | Sir Daniel Fortesque, 45 états et 180 poses dans six PNG |
| Renforts RPG natifs16 | ${delivery.rosterReinforcement16.length} partenaires, ${nf(delivery.rosterReinforcement16.length * 16)} poses |
| Total nouveau | **${nf(delivery.newPoses)} poses distinctes dans ${delivery.newPngFiles} PNG** |
| Personnages encore sans native32 dans ce lot | ${audit.batch.remainingNativeCharacterIds.join(', ') || 'aucun'} |
| Personnages encore sans base16 dans ce lot | ${audit.batch.remainingBaseCharacterIds.join(', ') || 'aucun'} |

Les miroirs, captures, planches rejetées et cellules non utilisées ne comptent pas comme nouvelles poses. Les [livraisons](deliverables.json) mesurent les cellules RGBA réellement conservées. Les 730 PNG et 118 registres historiques restent identiques ; l’inventaire cumulé suit ${audit.assetInventory.deliveredUniquePngFiles} PNG dans ${audit.assetInventory.registryFiles} registres.

## Capacités et mécaniques

Les 480 emplacements simple, secondaire, défense et super sont nommés. Les supers comprennent ${tally.damage || 0} actions offensives, ${tally.control || 0} contrôle et ${(tally.buff || 0) + (tally.guard || 0) + (tally.heal || 0)} soutiens : ${tally.buff || 0} améliorations, ${tally.guard || 0} gardes et ${tally.heal || 0} soin.

Maya utilise un **Phaselock sur un ennemi**, sans dégâts ni protection d’allié inventée : interruption d’action, suspension et libération. Le spécial dure 2,4 secondes, le secondaire 1,2 seconde ; Tactics saute un tour de la cible. Les cibles mortes, déjà liées, immunisées, invulnérables ou boss sont refusées. La portée reste bornée, avec revalidation et ligne de vue selon le moteur.

Val utilise son **Healing Burst** : soin de proximité des alliés blessés et d’elle-même, sans rayon de Medgun ni dégâts. Sa portée est de 220 pixels, convertie en deux cases Tactics avec distance euclidienne en trois dimensions, obstacles et étages. Les coûts, plafonds de PV et règles de cible sont partagés par l’interface et la résolution ; les CPU utilisent le vrai soin de leur équipe.

Les six renforts dédiés sont Baratus, Ranger, Sir Daniel, Axel, Dog et Kendra. Les douze parcours des deux camps comprennent dix actions au contact et deux améliorations de Kendra. Les 120 appelants gardent un partenaire du même univers, différent d’eux-mêmes. Un renfort de gameplay ne prouve ni une invocation officielle ni une alliance narrative.

Les sources initiales restent consultables après correction : les errata de [B](part-b/source-plan-errata.json) et [C](part-c/source-plan-errata.json) distinguent les corrections faites avant une première génération et celles faites avant une génération corrective. Le premier Medgun de Val, les apparences rejetées et les poses contaminées ne deviennent pas des livraisons.

## Tactics et décors

Quatre nouveaux secteurs jouables s’ajoutent aux huit précédents et aux trois Nexus : **Dollet** (FFVIII, 1999), **cour du manoir Spencer** (Resident Evil, 1996), **Red Rock Canyon** (Fallout: New Vegas, 2010) et **White Forest** (Half-Life 2: Episode Two, 2007). Les géométries sont propres à Tactics, avec matériaux, environnements, hauteurs, rampes, passages superposés, couverts et objectifs accessibles. Ce sont des adaptations de lieux, sans copie certifiée de leur plan officiel.

La [galerie W15](../tactics-universes-2026-10-26/index.html) contient les vrais parcours de sélection et de déplacement. Le [guide](../tactics-terrain-verticality.md) décrit les 15 terrains verticaux et leurs commandes. Dix études supplémentaires de mécanismes localisés complètent les décors : Hexen, MDK, Soldier of Fortune, GTFO, Like a Dragon, Killer Instinct, Magicka, Goemon, Evolve et Killing Floor 2. Leur géométrie et leurs cycles sont des animations architecturales adaptées, séparées des dessins natifs des personnages.

## Couverture cumulée

| Périmètre | Mesure |
| --- | --- |
| Catalogue | ${nf(audit.scope.heroes)} personnages, ${audit.scope.universes} univers |
| Capacités rédigées | ${nf(audit.abilities.authoredHeroes)} personnages, ${nf(audit.abilities.authoredSlots)} actions simples/secondaires/défenses |
| Kits complets3 | ${nf(audit.abilities.completeThreeSlotKits)} ; ${audit.abilities.partialSlotKits} partiels |
| Présentations complètes32 | ${audit.meleeBindings.nativePresentationHeroes} ; ${nf(audit.scope.heroes - audit.meleeBindings.nativePresentationHeroes)} manquantes |
| Présentations partielles hors complets | ${audit.meleeBindings.nativePartialPresentationHeroes} |
| Mêlée complète45 | ${audit.meleeBindings.fullDetailedMeleeManifestHeroes.length} ; ${nf(audit.scope.heroes - audit.meleeBindings.fullDetailedMeleeManifestHeroes.length)} manquantes |
| Bases16 corrigées | ${audit.baseSpriteCorrections.heroes} |
| Recettes du roster | ${audit.presentations.scriptedHeroes}, ${nf(audit.presentations.scriptedPairs)} paires personnage/phase |
| Renforts et invocations natifs16 | ${audit.entities.nativeAnimationAtlases} atlas |
| Mécanismes de scène | ${audit.stages.sceneMechanismDefinitions} dans ${audit.stages.rosterUniversesWithSceneMechanismDefinition} univers |
| Terrains Tactics | ${audit.tacticsTerrain.selectableVerticalBattlefields}, dont ${audit.tacticsTerrain.universeBattlefields} secteurs d’univers |

## Fidélité et vérification

Les générations et mécaniques adaptées **ne sont pas certifiées 1:1**. Les versions choisies, appareils, armes et rôles sont documentés ; des sources d’anthologie et apparences non fixes restent déclarées comme telles. Les supers utilisent leurs poses de relâchement et leurs points physiques mesurés. Les bases16 couvrent quatre états de quatre dessins ; la synchronisation de toutes les attaques ordinaires sur leurs frames source n’est pas certifiée, et ces bases ne valent pas un manifeste Mêlée45.

Les preuves finales restent distinctes des tentatives préliminaires : [validation](validation.json), [audit](current.json), [parcours navigateur](browser-checks.json), [ressources servies](browser/production-assets-http.json), [journal du build](build.log). Le [protocole de clôture](CLOSURE.md) décrit les commandes réelles, le gel des entrées et les contrôles de préservation. Un test Node ou une entrée JSON ne remplace pas une image décodée ni une revue visuelle.
`;
const fragment = `Lot 15 : ${rows.length} personnages en trois groupes de 40, ${delivery.completeNative32.length} native32, ${delivery.base16.length} bases16, Sir Daniel180 et six renforts16. ${nf(delivery.newPoses)} poses dans ${delivery.newPngFiles} PNG ; inventaire ${audit.assetInventory.deliveredUniquePngFiles}/${audit.assetInventory.registryFiles}. ${validationText}\n`;
writeReports([[prefix + 'coverage.csv', csv], [prefix + 'README.md', markdown], [prefix + 'readme-fragment.md', fragment]]);
console.log(JSON.stringify({ characters: rows.length, parts: Object.keys(plan.parts), status, poses: delivery.newPoses, png: delivery.newPngFiles }));
