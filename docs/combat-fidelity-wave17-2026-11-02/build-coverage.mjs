// Documentation is rendered only from a completed, still-current validation.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../../src/game/heroes.js';
import { COMBAT_ABILITY_OVERRIDES } from '../../src/game/combat/abilities/catalog.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from '../../src/game/combat/combatSourceDefinitionsWave17.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../../src/game/combatIdentity.js';
import { resolveSummonAnimationAsset } from '../../src/game/combat/summonAnimationCatalog.js';
import { prefix, json, effectiveBatchPlan, writeReports } from './closure-support.mjs';
import { assertValidatedArtifactsCurrent } from './validate-final-artifacts.mjs';

export function renderCoverage() {
  const validation = assertValidatedArtifactsCurrent(), audit = json(prefix + 'current.json'), delivery = json(prefix + 'deliverables.json'), plan = effectiveBatchPlan();
  const natives = new Set(audit.meleeBindings.nativePresentationEntries.map(r => r.heroId)), partial = new Map(audit.meleeBindings.nativePartialPresentationEntries.map(r => [r.heroId, r.frames]));
  const bases = new Set(audit.baseSpriteCorrections.entries.map(r => r.heroId)), full = new Set(audit.meleeBindings.fullDetailedMeleeManifestHeroes);
  const effective = new Set(Object.values(plan.parts).flat()), reviewed = new Set(plan.reviewedIds), withheld = new Map(plan.withheld.map(r => [r.withheldId, r]));
  const inventory = new Set(audit.assetInventory.sheets), before = json(prefix + 'baseline-authored-abilities.json');
  const allRows = HEROES_DB.map(hero => {
    const kit = COMBAT_ABILITY_OVERRIDES[hero.id], profile = resolveCombatAbility(hero, 'special'), summon = resolveUniverseSummon(hero), asset = resolveSummonAnimationAsset(summon);
    const authoredBasicSlots = ['simple', 'secondary', 'defense'].filter(slot => kit?.[slot]).length;
    return { id: hero.id, name: hero.name, universe: hero.universe, authoredBasicSlots, missingExplicitBasicSlots: 3 - authoredBasicSlots,
      specialName: profile.name, specialAuthored: profile.provenance.identityAuthored,
      native32: natives.has(hero.id), partialNativePoses: partial.get(hero.id) || 0, base16: bases.has(hero.id), full45: full.has(hero.id),
      partnerId: summon?.performer?.id || '', nativeRpg16: !!asset && inventory.has(asset.sheet), reviewedWave17: reviewed.has(hero.id),
      effectiveDrawingSlotWave17: effective.has(hero.id), withheldWave17: withheld.get(hero.id)?.nativeRequestStatus || '',
      source1to1Verified: false, baseActionTimingVerified: false };
  });
  assert.equal(allRows.length, 1911); assert.equal(allRows.reduce((n, r) => n + r.authoredBasicSlots, 0), 4911); assert.equal(allRows.reduce((n, r) => n + r.missingExplicitBasicSlots, 0), 822);
  const byId = new Map(allRows.map(r => [r.id, r]));
  const cohort = plan.heroes.map(({ hero, part, referenceAsset, referenceSha256 }) => {
    const row = byId.get(hero.id), source = COMBAT_SOURCE_DEFINITIONS_WAVE17[hero.id]; assert.ok(row && source, hero.id);
    const previous = before[hero.id], priorAuthoredBasicSlots = ['simple', 'secondary', 'defense'].filter(slot => previous?.[slot]).length;
    return { part, ...row, authoredBefore: !!previous, priorAuthoredBasicSlots, newlyAuthoredBasicSlots: row.authoredBasicSlots - priorAuthoredBasicSlots,
      sourceWork: source.sourceWork, sourceReference: source.sourceReference, appearance: source.appearance, weapon: source.weapon,
      namedSlots: ['simple', 'secondary', 'defense', 'special'].filter(slot => resolveCombatAbility(hero, slot).provenance.identityAuthored).length,
      referenceAssetBefore: referenceAsset || '', referenceSha256Before: referenceSha256 || '' };
  });
  assert.equal(cohort.length, 125); assert.equal(cohort.filter(r => r.effectiveDrawingSlotWave17).length, 120);
  assert.equal(cohort.filter(r => !r.authoredBefore).length, 80); assert.equal(cohort.filter(r => r.authoredBefore).length, 45);
  assert.equal(cohort.reduce((n, r) => n + r.newlyAuthoredBasicSlots, 0), 261);
  const csv = rows => { const fields = Object.keys(rows[0]), cell = value => '"' + String(value ?? '').replaceAll('"', '""') + '"'; return fields.map(cell).join(',') + '\n' + rows.map(r => fields.map(k => cell(r[k])).join(',')).join('\n') + '\n'; };
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(validation.verifiedAt));
  const markdown = `# Lot 17 — trois groupes parallèles de 40 personnages

**Livraison validée le ${date}.** Le véritable npm run build termine avec le code 0 : ${validation.testsPassed} tests dans ${validation.testSuites} groupes, dix domaines navigateur après gel, décodage et HTTP liés aux empreintes réelles.

Le [plan initial](batch-plan-before.json) reste immuable. Quatre annexes préalables aux générations correspondantes conservent **125 identités revues et 120 identités effectives**, réparties en trois groupes de 40. Les révisions comprennent 80 identités nouvellement rédigées et 45 identités déjà rédigées ; 261 emplacements simples, secondaires et défenses supplémentaires portent la couverture à 4 911 sur 5 733. Il reste 822 emplacements sans rédaction explicite ; le compteur strict de capacités génériques vaut 0 et mesure autre chose.

| Livraison W17 | Mesure réelle |
| --- | --- |
| Présentations32 | ${delivery.completeNative32.length} personnages ; huit phases de quatre dessins |
| Bases16 | ${delivery.base16.length} personnages ; quatre états de quatre dessins |
| Mêlée complète45 | Jade, 45 états et 180 poses dans six PNG |
| Renforts RPG16 | Jade, Rayman, Skye Autumn, Okarun, Melody et Medic : 96 poses |
| Action16 | Gyrodisk de Jade : 16 dessins supplémentaires |
| NPC autonome16 | Chaton au gilet rouge de Tail Concerto : 16 poses ; hors compteur RPG |
| Total nouveau | **${delivery.newPoses} poses distinctes dans ${delivery.newPngFiles} PNG et 11 nouveaux registres** |
| Préservation W1–W16 | 1 237 PNG, 138 registres et 13 197 rapports inchangés |

La [mesure de livraison](deliverables.json) décode les cellules effectivement utilisées, ignore les couleurs invisibles alpha0 et compare les silhouettes après retrait du seul padding transparent et orientation miroir canonique. Captures, références, sources rejetées, miroirs et remplissage ne constituent pas de nouvelles poses. Le Shield Pal et le Starburst Stream de Kirito restent des livraisons historiques.

Les cumuls sont 666 présentations complètes32 plus deux partielles, 614 bases16, 18 manifestes complets45, 68 atlas RPG16 et deux atlas d’action16. Le [tableau du lot](coverage.csv) garde les 125 identités ; la [couverture cumulative](coverage-all.csv) garde les 1 911 personnages et leurs manquants.

Jade est vérifiée dans 12 parcours clavier du vrai GameCanvas (six types dans les deux camps) et deux études contrôlées distinctes (360 dessins des 180 cellules complètes45, 8 prises contrôlées, 20 cas de rebord et 28 dessins attachés). Ces études ne sont pas comptées comme des parcours clavier. Medic construit sa charge pendant 40 secondes simulées de faisceau connecté et protège pendant 8 secondes ; il n’inflige aucun dégât offensif. Le chaton conserve ses PV, son altitude, son camp et ses commandes après capture non létale et libération dans les quatre moteurs.

Les trois moteurs autoritaires couvrent **720 situations : 718 actions engagées et deux refus conditionnels de Medic en Fighter**, un par camp. Sans allié visible distinct, le Medi Gun ne démarre pas, ne consomme aucune charge et ne modifie aucun PV. Les deux images correspondantes illustrent uniquement sa bibliothèque native ; elles ne sont pas des animations d’action exécutées. Les parcours du chaton comprennent quatre GameCanvas RPG/Smash, puis deux GameCanvas Tactics et deux FighterMode.

Les terrains Tactics totalisent 23 cartes verticales, 20 secteurs d’univers et 52 matériaux. Les quatre secteurs supplémentaires possèdent leurs topologies et environnements propres ; [guide et galerie](../tactics-universes-2026-11-02/README.md). Les scènes totalisent 445 définitions dans 220 univers ; les 525 univers possèdent leur ambiance par défaut.

G de The House of the Dead 1 a été réellement refusé ; G3 n’a pas été demandé après ce refus. Mai, Judy et Boris ont chacun un refus réel sans nouvelle tentative. Dana Barrett, Louis Tully, Shep, Stella et Hammond sont des identités distinctes et occupent les cinq emplacements effectifs de remplacement. Les anciennes références des identités suspendues restent préservées et ne comptent pas comme de nouveaux dessins.

**Reproduction officielle 1:1 certifiée : false.** Les apparences, armes, gestes et limites restent documentés dans [A](part-a/README.md), [B](part-b/README.md), [C](part-c/README.md), [Jade](jade-sources/STATUS.md) et les preuves RPG. Les dessins sont des adaptations générées et les tests ne certifient pas des frames originales.

[Validation](validation.json) · [Build réel](build-exit.json) · [Navigateur](browser-checks.json) · [PNG servis](browser/production-assets-http.json) · [Protocole](CLOSURE.md).
`;
  return { cohort, allRows, outputs: [[prefix + 'coverage.csv', csv(cohort)], [prefix + 'coverage-all.csv', csv(allRows)], [prefix + 'README.md', markdown]] };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv.includes('--after-final-validation')); const result = renderCoverage();
  if (!process.argv.includes('--check-only')) writeReports(result.outputs);
  console.log(JSON.stringify({ passed: true, checkOnly: process.argv.includes('--check-only'), cohortRows: result.cohort.length, cumulativeRows: result.allRows.length, source1to1Verified: false }));
}
