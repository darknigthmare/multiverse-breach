# Reprise des médias Doom

Le profil Doom avec la politique `preserve-all` atteint **224 lots sur 317** et **6 032 médias sur 7 693**. Cette reprise installe **11 lots et 161 médias**, soit 355 563 750 octets. Les contrôles ont décodé 161 rasters. Git LFS a fourni 115 sources. [Lots et empreintes](coverage.json)

Les **80 médias propres à Doom** figurent tous dans l’assemblage vérifié. Il reste **93 lots de ressources partagées**, soit **1 661 médias et 3,07 Go**. Le contrôle strict refuse l’export complet avant la création du dossier de sortie. [État de l’export](coverage.json)

L’audit indépendant relit les 6 032 empreintes et les 224 reçus du plan épinglé à `31c3639d86b67f1f6cb22659d46d06b5ed2016e5`. Le journal compte zéro lot en attente. Les 1 011 manifestes et inventaires correspondent au plan gelé dans le commit de code de cette passe. Les 84 tests du sous-système DLC passent sous Node 22.23.5. [Détail des contrôles](coverage.json) · [Comparaison Git du plan](frozen-inputs.json)

Les 1 661 médias partagés à assembler correspondent à 78 reçus historiques après comparaison des routes, longueurs et empreintes Git et LFS. Ces reçus attestent les vérifications effectuées lors de cette passe historique. [Correspondance des reçus](historical-receipt-match.json)

Les compilations de test historiques ont libéré **434 Mio** de JS et CSS régénérables sous `/tmp`. Les PNG, captures, scripts, reçus, données et archives ont été conservés. L’installation native procède un lot à la fois et garde une réserve de 270 Mio pendant les autres vérifications. L’assemblage de travail est `/tmp/mvb-pass06-doom/assembly`. [Reprise précédente](../../p0-p1-p2-continuation-11-2026-11-20/dlc/README.md)
