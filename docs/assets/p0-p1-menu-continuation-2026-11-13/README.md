# Reprise des menus et des P0/P1 — 13 novembre 2026

La reprise part du commit `fc8a57f795b7d1e68c7f1f7ff82593c7cef8916b`, qui intègre GitHub `2333c2c0`. Le remote master a été consulté au début du travail : même révision. Les P0/P1 ne sont pas tous terminés ; aucune fidélité 1:1 globale ni certification AAA n’est annoncée.

## Menus jouables

Les sept espaces utilisent une même présentation A.R.C.A., des titres lisibles, des états explicites et des commandes accessibles au clavier. Le travail complète les fenêtres Système/Pause, Portail, Collection et lecteurs d’univers déjà remaniés.

| Espace | Changement visible |
| --- | --- |
| Équipement | Choix du héros lisible, emplacements équipés/libres, effets avant le récit complet, comparaison et compatibilité conservées. |
| Boutique | Illustrations existantes conservées, prix en jetons événement cohérent avec le solde, quantité manquante explicite, achat unique et état possédé. |
| Résonance | Sélection et déploiement identifiables, progression avec coût et ressources disponibles. |
| Équipe | Cartes actives et réserves avec boutons natifs ; équipe pleine et dernier membre protégés ; propositions prévisualisées avant application. |
| Dossier de l’Ancre | Identité et visibilité distinctes, recherche des récompenses possédées et sélection équipée persistante ; aucun matchmaking fictif. |
| Archives | Indicateurs d’ouverture, texte verrouillé lisible, recherche et pagination des groupes, personnages, fusions et univers ; mêmes filtres d’accès. |
| Régulation | Recherche étiquetée, commandes d’univers accessibles, diagnostics dans un volet ouvrable ; mise en réserve et préférences de packs absents conservées. |

À 390 px, les soldes restent lisibles, les cinq rubriques principales sont disponibles et le panneau héros ne coupe plus les noms derrière le panneau d’équipement. Les filtres avancés se replient et les nouvelles commandes visent au moins 44 px. Le réglage de taille de texte respecte une seule application de son facteur ; le contrôle à 150 % a détecté puis corrigé un double agrandissement des rem. Les rubriques mobiles se répartissent sur plusieurs rangées pour garder les mots entiers à 150 %. Le défilement demeure nécessaire pour les longs dossiers.

Les fonctions d’achat, d’équipement et de fusion gardent leur code et leurs règles : aucun nouveau coût, ID, bonus ou récompense. Les données de fixture préparent des possessions et des soldes pour tester l’interface ; elles ne simulent pas une campagne réellement terminée.

## Dessins réellement produits

- [Médaillon aztèque de 2003](art/aztec-medallion/README.md) : un PNG RGBA 256×256, référence officielle D23, original, prompt, normaliseur et SHA conservés. Affiché à 64 px avec son nom et le compteur natif, exclusivement dans le panneau RPG de la scène canonique 269. Le total de 882 pièces, les obligations de Will/Jack et les commandes restent identiques. L’image n’est pas une certification du personnage Jack ou des reliefs exacts du film.
- [Lot raster 002 : 40 acteurs](../p0-p1-continuation-2026-11-13/raster-lot-002/README.md) : sept univers, sans chevauchement avec le premier lot. Un atlas Neff sorcier de 16 cellules a été généré, normalisé et revu indépendamment. Il reste candidat, sans raccord au boss rhinocéros et sans fermeture P1 ; le timing et la comparaison en moteur restent à vérifier. Les ressources homonymes incompatibles ont été rejetées.

Les deux PNG canoniques sont inventoriés dans leurs DLC et la publication est régénérée par l’outil du dépôt. Leur présence dans cet inventaire ne certifie ni leur ressemblance ni leur consommation par un moteur. Les refus de génération historiques sont préservés, sans nouvelle tentative sur ces identités.

## Backlog relu

Le [nouvel export](backlog/summary.json) est lié au snapshot d’audit immuable `de22d79e903b9995766e5a9628c3ec22198da561`, parent de travail `fc8a57f7`. Il ne s’agit pas du commit de livraison. Les 1 784 entrées réellement chargées par l’exporteur correspondent byte pour byte à son arbre ; [empreintes](backlog/source-inputs.json).

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Acteurs | 4 937 | 4 937 |
| Constats P1 | 17 318 | 17 258 |
| Constats P2 | 13 406 | 13 466 |
| Acteurs conservant un P1 | 4 935 | 4 935 |
| Acteurs avec raster absent de l’arbre projeté | 1 474 | 1 474 |
| Continuités récupérées par pack | 1 440 | 1 440 |

Le [correctif de lecture](locked-continuity/README.md) reconnaît uniquement un contrat structuré verrouillé appartenant au boss mondial exact du registre. Quarante contrats ont été relus dans un lot ; vingt autres satisfont le même contrat. Les deux activités de 40 (continuités et raster) couvrent 77 identités distinctes, avec trois intersections ; leurs identités et leur rattachement à la file globale sont consignés dans le [suivi des lots](backlog/actor-activities-40-progress.json). Deux déclarations manga/anime gardent une ambiguïté P1. Soixante faux constats d’absence deviennent une précision P2 de modèle/tenue, sans approbation du dessin. Aucun dossier acteur n’est clos. La [file de travail par 40](backlog/actor-batches-40.json) garde les 4 935 dossiers ouverts et leurs politiques de refus, avec les codes actualisés. Toutes les autres tâches et probes sont identiques : [delta vérifié](backlog/locked-continuity-delta.md).

Les 22 P0 visuels historiques, les rasters manquants, les costumes et les animations non revues restent ouverts. Un checkout partiel ne constitue pas une preuve de ressource absente du dépôt.

## Vérifications

- 99/99 tests des continuités et de la suite R9, après reproduction sur HEAD de deux attentes historiques périmées ; fixtures et reçus conservés dans [locked-continuity](locked-continuity/).
- 72/72 tests finaux sur huit suites : équipement, équipe, pagination, archives, filtres, focus, état du Hub et campagne, avec fixtures SSR ordinaires. Les passages précédents 28/28 puis 44/44 sont conservés séparément.
- 25/25 tests du panneau Pirates et de sa publication : gardes de scène/édition/custom, compteur, commandes, pause/ciblage et repli d’image. Il s’agit de tests SSR/contrat ; aucun combat de finale complet n’est revendiqué.
- 85/85 tests de publication et de chemins DLC ; 505 inventaires, 19 581 chemins, 11 968 attribués aux DLC. Les 508 fichiers d’inventaire/ignore restent identiques pendant le contrôle.
- [Chromium](browser/manifest.json) : sept routes desktop/mobile en français et en anglais à 150 %, dix groupes d’actions réussis. Le dernier ajustement concerne uniquement la répartition mobile des rubriques ; sa revalidation est conservée distinctement. Les états parent sont préparés en mémoire, les médias proviennent du checkout/index ; aucun parcours complet de campagne/cloud n’est revendiqué.
- [Compilation finale de l’application](validation/code-build-final.json) : sortie 0, 7,77 s, 5 227 entrées source identiques pendant le build. Invocation directe de Vite, sans prébuild ni copie de `public/`.
- Le [build normal](validation/normal-build.log) a été tenté et échoue au premier prébuild `assets:prepare` : 9 007 sources DLC non matérialisées dans ce checkout partiel. Aucun build complet de production n’est déclaré réussi.
- Lint des sources modifiées : sortie 0, zéro erreur ; un avertissement Fast Refresh concerne le point d’entrée de fixture uniquement. [Reçus détaillés](validation/README.md).

Les preuves de la [reprise précédente](../p0-p1-continuation-2026-11-13/README.md) restent datées et distinctes. Le profil direct de compilation ne remplace pas le prébuild normal ni une livraison de tous les médias.
