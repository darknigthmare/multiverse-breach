# Lot 15 — trois groupes de 40 personnages

La sélection de [120 personnages](batch-plan-before.json), répartie entre trois agents, est antérieure aux éditions. Elle couvre 43 univers : 42 nouvelles identités de capacité et 78 révisions explicitement séparées. La livraison est **validée**. Clôture validée : build complet avec code de sortie 0, 1885 tests réussis dans 18 groupes. Les 982 PNG suivis ont été vérifiés dans public, dist et les réponses HTTP, puis décodés en libvips et Chromium.

Chaque groupe conserve ses sources, demandes image_gen, images originales, corrections, exclusions et mesures : [A](part-a/README.md), [B](part-b/README.md), [C](part-c/README.md). La [couverture par personnage](coverage.csv) reprend les versions, rôles et couvertures livrées ; les [livraisons mesurées](deliverables.json) donnent les chemins des fichiers retenus.

## Dessins livrés

| Couverture du lot | Mesure réelle |
| --- | --- |
| Présentations complètes32 | 120 personnages, 3 840 poses |
| Bases16 | 120 personnages, 1 920 poses |
| Mêlée complète45 | Sir Daniel Fortesque, 45 états et 180 poses dans six PNG |
| Renforts RPG natifs16 | 6 partenaires, 96 poses |
| Total nouveau | **6 036 poses distinctes dans 252 PNG** |
| Personnages encore sans native32 dans ce lot | aucun |
| Personnages encore sans base16 dans ce lot | aucun |

Les miroirs, captures, planches rejetées et cellules non utilisées ne comptent pas comme nouvelles poses. Les [livraisons](deliverables.json) mesurent les cellules RGBA réellement conservées. Les 730 PNG et 118 registres historiques restent identiques ; l’inventaire cumulé suit 982 PNG dans 127 registres.

## Capacités et mécaniques

Les 480 emplacements simple, secondaire, défense et super sont nommés. Les supers comprennent 99 actions offensives, 1 contrôle et 20 soutiens : 16 améliorations, 3 gardes et 1 soin.

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
| Catalogue | 1 911 personnages, 525 univers |
| Capacités rédigées | 1 582 personnages, 4 650 actions simples/secondaires/défenses |
| Kits complets3 | 1 517 ; 65 partiels |
| Présentations complètes32 | 426 ; 1 485 manquantes |
| Présentations partielles hors complets | 2 |
| Mêlée complète45 | 16 ; 1 895 manquantes |
| Bases16 corrigées | 374 |
| Recettes du roster | 440, 3 080 paires personnage/phase |
| Renforts et invocations natifs16 | 55 atlas |
| Mécanismes de scène | 425 dans 214 univers |
| Terrains Tactics | 15, dont 12 secteurs d’univers |

## Fidélité et vérification

Les générations et mécaniques adaptées **ne sont pas certifiées 1:1**. Les versions choisies, appareils, armes et rôles sont documentés ; des sources d’anthologie et apparences non fixes restent déclarées comme telles. Les supers utilisent leurs poses de relâchement et leurs points physiques mesurés. Les bases16 couvrent quatre états de quatre dessins ; la synchronisation de toutes les attaques ordinaires sur leurs frames source n’est pas certifiée, et ces bases ne valent pas un manifeste Mêlée45.

Les preuves finales restent distinctes des tentatives préliminaires : [validation](validation.json), [audit](current.json), [parcours navigateur](browser-checks.json), [ressources servies](browser/production-assets-http.json), [journal du build](build.log). Le [protocole de clôture](CLOSURE.md) décrit les commandes réelles, le gel des entrées et les contrôles de préservation. Un test Node ou une entrée JSON ne remplace pas une image décodée ni une revue visuelle.
