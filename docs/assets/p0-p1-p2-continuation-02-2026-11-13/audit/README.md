# Audit indépendant — continuation 02

L’export réel unique du checkpoint **`82a1f0035af46b85aac479a8a530963a28cfb219`** conserve **4 937 acteurs** et compte **16 734 constats P1 ouverts et 13 582 P2 ouverts**. Par rapport à la base `98991b161d0116dd9fa8d52d42f2337a243f2091`, **248 paires acteur/constat P1 sont retirées**, **76 revues P2 sont ajoutées** et **un nouveau P1 protège Batman d’un atlas incorrect**. Aucun acteur complet ni visuel 1:1 n’est déclaré terminé.

Les [deltas exacts](checkpoint-82a1f003/actor-task-delta.json), le [résumé](checkpoint-82a1f003/summary.json), le [ledger gzip](checkpoint-82a1f003/actor-tasks.json.gz) et les [commandes réellement exécutées](checkpoint-82a1f003/validation.json) gardent leur source réelle `82a` ; ils ne sont pas renommés comme s’ils avaient été réexécutés après le correctif FPS.

| Réservation | Acteurs | P1 retirés | P2 ajoutés | P1 ajoutés |
| --- | ---: | ---: | ---: | ---: |
| Gears of War / Dead Space | 40 | 122 | 38 | 0 |
| Portal / Left 4 Dead | 40 | 118 | 36 | 0 |
| Reprise raster Doom | 40 | 8 | 2 | 0 |
| Présentations | 40 | 0 | 0 | 1 |
| Total | 160 | 248 | 76 | 1 |

Les retraits portent sur 77 incarnations, 76 références, 76 contrats visuels déclaratifs, 17 libellés génériques du catalogue et deux rasters manquants. Aucun P2 n’est retiré ou reclassé. Les 17 noms bruts étaient déjà résolus par les kits effectifs : leur correction ne représente pas 17 nouveaux pouvoirs. Les deux atlas Doom font passer les acteurs avec raster manquant de 1 473 à **1 471**. Les périmètres de raster non résolus passent de deux à **trois**, dont la clé exacte `["The Dark Knight","id:batman_tdk"]` ; cette protection reste comptée comme travail ouvert.

## Continuité après le correctif FPS

Le checkpoint **`5667556bfb3d00e2cf9959c3d22c3038712cd5a2`** change exactement **un** fichier `src/DLC/public` depuis l’export : `src/game/extinctionFighterProfiles.js`, SHA-256 `4ffe9ec65bd4ceb0997fe954d58542c5a19b50532c16cdb9e09f593570dae6fc`. La [continuité bornée](checkpoint-82a1f003/final-core-continuity-5667556.json) vérifie **3 872 sources inchangées et cette exception explicite**, avec OID Git et SHA des fichiers de travail. Elle ne prétend pas que les 3 873 fichiers sont tous inchangés.

La [vérification finale vers `3b892a7ec9eb1dbebf24af040cd8283311178f85`](checkpoint-82a1f003/final-continuity-3b892a7.json) conserve exactement ce résultat. Le commit supplémentaire touche 39 chemins de Bible CG, métadonnées, tests, fixtures et commandes `package.json`, sans nouveau changement `src/DLC/public` et sans modification d’un module de la fermeture acteur. Il est distinct de l’exécution réelle du ledger ; les quatre helpers pinés et le runner du refresh restent inchangés.

La [fermeture des imports](checkpoint-82a1f003/actor-import-closure.json) du véritable exporteur et des résolveurs natifs contient **1 974 modules et 2 151 arêtes**, sans référence non résolue. Le consumer FPS en est absent ; tous les modules de cette fermeture sont identiques entre `82a`, `5667` et les fichiers de travail. Le Git-tree `DLC/public` et les helpers restent aussi inchangés. Les résultats de l’export et des quatre sondes sont ainsi réutilisés sans second export. Les **17 fichiers source des 31 pins héros CG** restent identiques depuis `5baaae27bf23b845a5056eeab3c95fbe7b0d234e`.

La [revue native indépendante FPS](fps-freeze3-independent-review.json) valide les 16 bindings précis par 16 activations consommant 24→23 munitions, puis refuse **384 mutations**. Le scan de classification des **7 244 actions** ne trouve ni binding énergie/roquette accidentel ni soutien consommant des munitions. Ce scan ne simule pas 7 244 activations. Les paramètres FPS de garde exposent maintenant des réglages de la source sélectionnée ; ce contrôle ne certifie pas les durées officielles ni l’égalité des anciens profils FPS.

## Résultats runtime des cohortes

Les sondes finales réelles utilisent les acteurs et résolveurs après overrides, avec encodage explicite des nombres non finis et conservation gzip. Les **60 slots RPG préparés des 15 héros Gears/Dead Space** restent inchangés. Les **56 slots des 14 autres héros Portal/L4D** restent inchangés ; PotatOS et l’écho de Cave Johnson perdent leurs dégâts fictifs au profit d’actions de soutien. Aucun kit source sélectionné n’est perdu.

Les [contrats d’invocation Portal/L4D](checkpoint-82a1f003/portal-l4d-040-summon-delta.json) changent réellement pour quatre appelants : Cave, Caroline, PotatOS et l’écho. Chell était déjà leur performer et le reste. L’identifiant technique, le nom d’entité, l’ancien atlas forcé de tourelle et l’effet offensif sont corrigés ; ces renforts Nexus traversant plusieurs époques ne deviennent pas des invocations canoniques 1:1. Les différences des autres objets projetés sont distinguées des quatre contrats modifiés.

Deux nouveaux rasters concernent Imp Fireballer et Mancubus Flame Tank. Pinky était déjà livré et n’est pas recompté : **37 acteurs avec raster manquant restent dans cette cohorte de 40**. Les captures et revues des propriétaires portent sur un raccord borné ; elles ne ferment pas toutes les animations, costumes ou revues de scène.

La [revue Revan](revan-presentation-independent-review.json) confirme par imports natifs le défaut dynamique W13 et le correctif de trois clips sur le base16 exact. Le témoin avant/après exécute aussi le vrai moteur Fighter : l’adversaire à zéro HP utilisait l’outro et continuait à bouger ; il conserve maintenant le dernier échantillon de défaite, sans changement de HP. Les deux chemins de normalisation d’alias découverts pendant la revue sont corrigés. Aucun nouvel atlas ou constat global d’animation n’est approuvé par ce raccord.

## Preuve des anciens tests Extinction

La [baseline 9899](extinction-14-baseline9899.json) exécute les vrais tests et modules Git historiques à leurs URL d’origine, avec les lectures physiques réelles. Les 14 labels échouaient déjà, mais [quatre messages différaient](extinction-14-error-comparison.json) après les nouvelles données : les actions exécutables passaient notamment de 7 182 à 7 137. Les labels rouges seuls ne permettaient donc pas d’écarter une régression.

Après correctif, les **mêmes octets de tests Git 9899** exécutés contre les implémentations courantes donnent [**11 PASS et trois FAIL**](extinction-14-original-tests-current.json), sans modification d’attendus et sans démarrer le test SSR/Vite distinct. Les trois échecs restants sont uniquement les inventaires historiques : `genericSourceReview` 1 633→1 576 avec **7 244 actions conservées**, neuf→onze kinds avec `buff/guard`, et neuf→dix styles avec 17 soutiens. Les onze tests comportementaux originaux passent ; les suites courantes complètes et leurs amendements d’inventaire sont documentés séparément par le propriétaire.

## Reprise des manquants

Le nouveau [suivi des quatre lots de 40](checkpoint-82a1f003/work-batches-40.json) conserve **160 clés disjointes dans leur ordre réservé**, les paires réellement retirées/ajoutées et les codes encore ouverts pour chaque acteur. Il permet de poursuivre les manquants sans refaire les métadonnées corrigées. L’ancienne queue de **124 lots**, ses **22 P0 historiques** et ses **six contrôles interdisant les retries automatiques** restent octet pour octet identiques à 9899. Aucun droit de génération n’est déduit de ce nouveau suivi.

La base précédente b9e616b a été réutilisée à 9899 après comparaison Git/OID/SHA, sans modifier ses anciennes valeurs `sourceCommit` : [adoption](baseline-adoption.json), [continuité](baseline-continuity-98991b161.json), [sondes initiales](runtime-baselines.json). Le refresh unique est reproductible avec [refresh_core_checkpoint.py](refresh_core_checkpoint.py) vers un nouveau dossier, en utilisant le SHA complet `82a1f0035af46b85aac479a8a530963a28cfb219`. L’exporteur et le classificateur n’ont pas été modifiés par l’audit. Les données brutes et snapshots temporaires restent sous `/tmp` ; seuls les artefacts compacts sont conservés ici. Aucune hydratation massive, nouvelle compilation Vite ou suite globale n’a été exécutée par cet audit. Les contrôles Tactics et les menus sont hors de ce ledger d’acteurs.
