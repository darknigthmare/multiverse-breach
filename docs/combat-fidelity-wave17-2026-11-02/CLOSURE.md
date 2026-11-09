# Clôture W17 — protocole et barrières

Ce document décrit le protocole. Il ne constitue pas une validation finale. Les générations, intégrations et preuves préliminaires restent en cours jusqu’à l’existence d’une validation réelle datée.

Les cinq programmes de clôture sont préparés avant le gel : collecte navigateur, vérification finale, contrôles statiques, couverture et mise à jour du README projet. Aucun code de vérification ne doit être réparé après un navigateur final. Une modification d’entrée exige d’archiver le gel et les essais concernés, puis de reprendre le cycle complet ; aucune transition de SHA après navigateur n’est autorisée.

1. Terminer les trois lots effectifs A40/B40/C40, Jade, les six renforts RPG16, le chaton NPC16, les quatre cartes et les dix scènes. Conserver le plan initial et ses quatre annexes, les refus effectifs et chaque source native.
2. Exécuter les vérifications d’intégration. Copier le README projet encore W16 dans `baseline-project-readme-wave16.md`. Exécuter les cinq vraies commandes Rift par `node docs/combat-fidelity-wave17-2026-11-02/run-rift-refresh.mjs --all-reference-owners-finished` et vérifier leurs journaux.
3. Calculer l’union des entrées par `node docs/combat-fidelity-wave17-2026-11-02/build-browser-checks.mjs --source-union-before-freeze`. Le gel doit inclure chaque chemin et SHA de `proof-source-union.json`, puis le manifeste lui-même. Les CSS, sources PNG, JSON, références et tous les helpers JS/MJS sont concernés. Le README projet est une sortie après validation ; sa copie W16 est gelée.
4. Créer le gel par `node docs/combat-fidelity-wave17-2026-11-02/freeze-production.mjs --after-art-and-runtime-checks`. Ne plus changer ses entrées.
5. Exécuter les dix domaines ci-dessous après ce gel. Fermer tous les navigateurs. Pour chaque rapport final, inspecter réellement ses captures avec `view_image`, directement ou via des contacts liés à chaque capture. Conserver les empreintes, heures et observations précises.
6. Mesurer les livraisons avec `node docs/combat-fidelity-wave17-2026-11-02/collect-deliverables.mjs --after-production-freeze`, puis agréger avec `node docs/combat-fidelity-wave17-2026-11-02/build-browser-checks.mjs --after-final-browser-reviews`. Écrire les deux audits réels avec `node scripts/combatCompletionAudit.mjs` et `node scripts/combatFidelityAudit.mjs`.
7. Exécuter `node docs/combat-fidelity-wave17-2026-11-02/run-static-checks.mjs --after-production-freeze`, puis `node docs/combat-fidelity-wave17-2026-11-02/run-final-build.mjs --after-final-browser-and-audits`. Les codes de sortie proviennent des événements réels de fermeture des processus ; le build inclut tout `prebuild`.
8. Démarrer une nouvelle prévisualisation de ce dist sur 5191, puis exécuter `node docs/combat-fidelity-wave17-2026-11-02/browser/production-assets-http.mjs --after-build-exit-0`. Les 1 491 PNG et 149 registres doivent être liés aux octets source, dist, HTTP Node et HTTP Chromium et se décoder entièrement.
9. Exécuter `node docs/combat-fidelity-wave17-2026-11-02/validate-final-artifacts.mjs --after-build-exit-0`. L’option `--check-only` vérifie sans publier de rapport. Après succès réel seulement, exécuter `build-coverage.mjs --after-final-validation`, puis `update-project-readme.mjs --after-final-validation` dans ce dossier. Le README projet reste au dernier lot validé tant que cette barrière échoue.

| Domaine | Commande et sortie finales |
| --- | --- |
| Présentations | `browser/native-presentations.mjs --after-production-freeze` → `browser/native-presentations.json` |
| Bases | `browser/base-corrections.mjs --after-production-freeze` → `browser/base-corrections.json` |
| Trois moteurs autoritaires | `browser/native-super-runtime.browser.mjs --after-production-freeze` → `browser/native-super-runtime.json` ; 720 situations, dont 718 actions engagées et deux refus conditionnels Medic Fighter sans allié visible |
| Tactics moteur | `browser/tactics-engine.browser.mjs --after-production-freeze` → `browser/tactics-engine-contracts.json` ; 240 cas |
| Tactics UI | `TACTICS_UNIVERSE_PROOF_DIR=docs/tactics-universes-2026-11-02 node scripts/tacticsUniverseWave17Ui.browser.mjs --after-integration-freeze` ; six parcours et dix captures |
| Scènes | `browser/stages-wave17.mjs --after-production-freeze` → `browser/stages-wave17.json` ; dix études, 40 frames RGBA et deux contacts |
| Jade | `jade-sources/browser/run-jade-browser-checks.mjs --after-production-freeze` → `jade-sources/browser/jade-evidence.json` ; douze parcours clavier et deux études contrôlées exécutés ensemble |
| Renforts RPG | `summon-wave17-browser.mjs --after-production-freeze` → `summon-wave17-result.json` ; douze vraies invocations GameCanvas |
| NPC RPG/Smash | `capture-npc/rpg-smash.browser.mjs --after-production-freeze` → `capture-npc/rpg-smash-final-result.json` ; quatre parcours GameCanvas |
| NPC Tactics/Fighter | `capture-npc/tactics-fighter.browser.mjs --after-production-freeze` → `capture-npc/tactics-fighter-final-result.json` ; deux parcours GameCanvas Tactics et deux FighterMode. Vérifier aussi avec `capture-npc/verify-tactics-fighter-report.mjs` |

Les chemins de programmes sont relatifs au dossier W17 sauf les commandes commençant par `scripts/`. Les noms des dix domaines et des revues sont exposés par `build-browser-checks.mjs`.

Les deux refus Medic Fighter sont strictement les cas `team_fortress_2_medic:fighter:player` et `team_fortress_2_medic:fighter:opponent`. Le validateur exige `no-visible-ally`, zéro patient visible, une charge 100→100, aucun faisceau, aucun projectile et aucun changement de PV. La pose de bibliothèque dessinée dans ces deux captures reste marquée `libraryOnly:true` et `actionExecuted:false`. Les 718 autres cas exigent un vrai engagement et un corps natif ; aucun refus supplémentaire ne passe la clôture. Les métriques `committedCastCases` et `conditionallyUnavailableCases` restent séparées dans les preuves et la validation.

Une revue se nomme `browser/<domain>-visual-review-final.json` et contient `passed:true`, `preliminary:false`, `reviewedAt`, `report:{path,sha256,bytes}` et `artifacts:[{path,sha256,bytes,inspected:true,inspectionMethod:"view_image",inspectedAt,observation}]`. `actualCapturesInspected` compte uniquement les images réellement vues. Un contact doit ajouter `sourceCaptures:[{path,sha256,bytes,inspectedViaContactSheet,tile:{x,y,width,height}}]`. Aucun programme ne remplit automatiquement `inspected` ou les observations.

La livraison cible comprend 6 068 poses réellement distinctes dans 254 nouveaux PNG : 120×(32+16), Jade45/180, six RPG16, un Gyrodisk16 et un NPC16. Les 1 237 PNG, 138 registres et 13 197 rapports antérieurs sont préservés. Les 125 identités revues comprennent 80 rédactions nouvelles et 45 révisions ; les cinq identités suspendues restent distinctes des 120 dessins effectifs. Les 822 emplacements simples, secondaires et défenses encore sans rédaction explicite ne sont pas le compteur strict de capacités génériques (0).

**Fidélité officielle 1:1 certifiée : false.** Les contrôles certifient la livraison, la cohérence et les contrats observés du moteur ; les dessins restent des adaptations générées.
