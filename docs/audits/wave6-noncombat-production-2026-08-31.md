# Vague 6 — Outpost et dix défis non combattants

## Périmètre effectivement intégré

Onze nouveaux dossiers sont installés : 34441, 34480, 34481, 34510, 34511, 34540, 34541, 34550, 34551, 34560 et 34561.

- Vague fixe : **15/500 terminés**, **485 restants** (471 images absentes, 14 remplacements historiques).
- Registre global : **1 009/3 199 disponibles**, **2 190 en attente**.
- Les 500 identités, leur ordre, leurs sorties et leur baseline initiale restent inchangés.
- Les révisions explicites `0001-outpost-01` et `0002-noncombat-01` archivent les anciens manifestes et prompts. Les quatre générations déjà publiées ne sont pas réétiquetées.

Les compteurs ci-dessus décrivent ce lot local ; ils ne signifient pas que les 485 dossiers suivants, les 14 remplacements ou toutes les demandes historiques sont terminés.

## Images et provenance

Production par l'outil OpenAI imagegen intégré, une génération par image. Les onze WebP finaux sont RGB, sans alpha, en 640 × 360 ; leurs empreintes correspondent aux résultats des installateurs. Les PNG bruts restent conservés hors runtime.

- Prompts courants et références : `docs/rift-dossiers/references/wave6-production-prompts.json`.
- Décisions sujet/scène et raster, horodatages réels, identifiants de génération et SHA-256 : `docs/openai-generation-prompts-2026-08-31/asset-batch-500-wave-6-visual-reviews.json`.
- Preuves runtime : `public/images/rift-dossiers/openai/openai-prompts.jsonl`.
- Contrats et résultats : `wave6-install-outpost-01*.json` et `wave6-install-noncombat-01*.json`, dans le dossier de production du 31 août.

Outpost représente une installation arctique unique, avec le Patriarch à droite orienté vers l'espace de combat gauche. Les autres scènes utilisent la caméra latérale Smash et leurs interactions non combattantes ; elles ne contiennent pas de boss issu par erreur de la liste du même univers.

La première génération Strode `exec-49e09623-51a6-4def-be29-88b1164f1ff9` est rejetée (pointes et porte de coffre fantaisistes) et n'est pas installée. Le chargement de cette image pour retouche a échoué dans le bac à sable Windows avant toute génération. Une nouvelle génération indépendante `exec-80b6776f-25c7-4784-baf8-2adde4532ba0` remplace ces éléments par des portes domestiques renforcées, grilles planes et volets. Le journal conserve les décisions des deux prompts, sans assimiler l'échec technique à une image produite.

## Corrections gameplay

Les dix définitions de stage évitent désormais la détection approximative de langue/type et l'héritage du boss indexé. Les objectifs FR/EN sont explicites :

| Dossiers | Interaction corrigée |
|---|---|
| 34480, 34551 | Trois collectes et destinations associées ; pas de cibles à frapper |
| 34481 | Ouverture de route, passage supérieur atteignable au saut puis sortie |
| 34510 | Ouverture des passages par mécanismes |
| 34511 | Trois artefacts avant l'extraction |
| 34540 | Portes de slalom ordonnées |
| 34541 | Couvert stable atteignable depuis le départ ; 900 frames et 90 % de présence, attaques désactivées |
| 34550 | Protocole de cour en 1695, pas d'inspection impériale |
| 34560 | Activation des trois mécanismes dans l'ordre |
| 34561 | Balises à franchir en maintenant Garde ; détections et échec bornés ; garde respectée en automatique |

La projection des 1 165 autres stages a été comparée avant/après : empreinte inchangée `aeefe45bae02d5c0293417be00f8db5c4affcefb4e0925b8693df751a3a622d0`.

## Vérification

- Onze nouveaux tests gameplay et 49 tests non combattants existants : 60/60 réussis. Les dix parcours réussissent en 640 × 360 et 1040 × 460 avec des déplacements, sauts et interactions réels, sans téléportation.
- Le test de survie vérifie aussi que le mode automatique ne remplace pas le temps requis par des interactions artificielles : victoire exactement à la frame 900.
- Suite dossiers : 71/71 réussis, dont dix tests de révision et douze tests de corrections de prompts.
- Contrôle des onze WebP installés (hash, dimensions, format, alpha) : réussi.
- Lint et `git diff --check` : réussis.
- La vérification navigateur n'a pas pu démarrer : `windows sandbox failed: apply deny-read ACLs`. Aucune validation visuelle du runtime dans le navigateur n'est revendiquée.
- Le refus d'archives divergentes compare maintenant les octets sans construire une différence textuelle gigantesque. Les fixtures de 500 prompts sont libérées après chaque test, ce qui borne leur occupation disque.
- L'ancien dossier de compilation `dist` a été supprimé pour libérer C:, saturé pendant les vérifications. Il ne contenait aucun fichier suivi ; les sources, les images et les archives de provenance sont conservées. La nouvelle compilation est dirigée vers `W:/Codex-Temp/lively-darwin-wave6-noncombat-20260831/dist`.

Ce rapport ne déclare pas une mise en production : celle-ci doit être confirmée séparément par le déploiement READY et les contrôles HTTP.
