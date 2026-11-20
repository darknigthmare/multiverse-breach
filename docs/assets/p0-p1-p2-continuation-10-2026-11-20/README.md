# Reprise parallèle des P0 et de Doom

Cette passe corrige des commandes, des portraits et des animations liés aux dossiers P0. Les **20 dossiers artistiques** restants gardent leur statut dans le suivi. Les deux clôtures précédentes de Han Solo et Luke Skywalker restent rattachées au défaut d’ancienne substitution. [Registre des 22 décisions](../p0-p1-p2-continuation-09-2026-11-20/p0-status.json)

| Chantier | Résultat en jeu et preuves |
| --- | --- |
| Duel | Jack dispose d’une balle de silex par duel. Une interruption avant la libération conserve la balle. Le compteur s’affiche aussi sur mobile. Lilo utilise un flash à portée et Roger applique sa feinte au contact. [Clavier, tactile et simulation](iconic/README.md) |
| RPG Vader | L’étranglement de Force et les débris de Bespin déclenchent leur propre effet à l’impact. Les essais J1 et J2 vérifient la cible réelle et le remplacement de cible. [Essais et planches historiques](star-wars/README.md) |
| RPG original | 40 ennemis reçoivent un secondaire spécifique, pour 120 commandes dans le registre. Le Troll se soigne. Le Glitch sans dégâts annonce son ralentissement d’ATB. Le Pollen cible uniquement son groupe à portée. [Les 40 profils et trois parcours de jeu](roster/README.md) |
| Portraits | Raven et Starfire disposent de cadrages de la série de 2003 dans le Nexus, le Duel, les archives et la frise Tactics. Les deux portraits réutilisent des pixels existants. [Captures et essais de repli](dc/README.md) |
| Animation originale | Trois aigrettes de l’Amas des Huit Orochi s’animent indépendamment en Mêlée. Les préférences de mouvement réduit s’appliquent pendant le combat. [Comparaison CPU et J2](orochi-motion/README.md) |
| Doom | 17 lots ajoutent 257 rasters décodés. L’assemblage gelé atteint 209 lots sur 317 et 5 799 médias sur 7 693. Il reste 108 lots, soit 3,56 Go. [Assemblage et contrôle strict](dlc/README.md) |

Le catalogue Rift reprend les **3 199 dossiers** dans leur ordre et conserve les identifiants et les chemins de destination. Il expose 20 quarantaines et écarte les images rejetées du choix des références. Le dossier de Gordon Freeman reprend le repère du HEV Mark V et du Gravity Gun bleu de la Citadelle. La reconstruction CG historique utilise les valeurs exactes de son entrée de référence pour les champs modifiés. Les données de génération et le rapport historique de remédiation conservent leurs empreintes. [Catalogue Rift](../../rift-dossiers/catalog.json) · [Suivi de Gordon](../../rift-dossiers/character-source-followup-2026-11-20.json)

Les **58 PNG Rift** manquants dans le checkout ont été récupérés, décodés et comparés à leurs pointeurs Git LFS dans une copie isolée. Les 92 tests Rift y passent. Le checkout principal garde ses 58 absences locales. [Reçu des médias et périmètre du test](rift/README.md)

L’export R14 consigne 19 quarantaines avec une tâche de remplacement ouverte par planche. Le dossier reste identifié quand aucun raster jouable n’est servi. L’audit courant de combat mesure 1 911 supers résolus, zéro capacité générique résolue, zéro profil sans asset d’entité et une ambiance de repli pour chacun des 525 univers. Les résultats historiques de la Wave 17 restent archivés. [Reçu R14](validation/r14.json) · [Mesure courante de combat](../../combat-completion-2026-10-18/current.md) · [Vérifications et compilations](validation/checks.json)

Deux sorties de tests Chromium reproductibles de passes précédentes ont été retirées de `/tmp`. Elles occupaient environ 82 Mio. Les scripts, les captures et les reçus ont été conservés. L’espace libéré a permis de terminer les deux derniers lots Doom de cette passe.
