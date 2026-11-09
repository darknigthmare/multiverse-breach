# Suivi des contrôles navigateur — 28 octobre 2026

Cette reprise conserve exactement les mécaniques, sources de catalogue et deux Excel publiés dans b3ff9b213f1a17bb531f308310d62d7d42639510. Elle corrige les pilotes et assertions de test, sans diminuer les dégâts ennemis, augmenter les statistiques de l'Ancre, forcer une victoire ou changer un statut de production artistique.

## Échecs conservés

- Run 40725686541 : 13/14 parcours, les dix scénarios FPS réussis, échec de l'assertion de déplacement de la vitrine en 2560×1080. Le seuil fixe de 20 unités comparait deux observations séparées par un clic Playwright, des attentes et une avance d'horloge sans relever le temps de simulation écoulé.
- Run 40725686511 : 10/10 anciens scénarios d'interface et 4/4 parcours des neuf services réussis ; le pilote de session complète perd Dernier Signal et Infestation. Il utilisait encore la boucle de tir à distance précédente pour l'Ancre, sans tenir compte de sa nouvelle action primaire de mêlée ni de ses trois protocoles.

## Vérifications plus précises

Le clic vers une vitrine est observé avant le gestionnaire React et après propagation native. Les coordonnées, vitesse et temps doivent rester inchangés au clic. Chaque image échantillonnée du trajet doit ensuite respecter la distance maximale calculée à partir des vrais ticks de simulation et de la vitesse ; un détour, un arrêt et une observation retardée restent possibles. Le test ultralarge retarde explicitement l'observation. Douze tests du validateur rejettent notamment les téléportations immédiates et différées, les déplacements pendant le gel d'horloge, les excès diagonaux, les changements de vitesse et les preuves manquantes ou invalides. Aucune écriture dans l'état du joueur par ce relevé.

Le pilote de session complète lit désormais portée, délai, charge et disponibilité dans le kit actif. Il se rapproche avec W pour une action de mêlée et utilise C/F/X uniquement par les commandes natives lorsque les conditions sont réunies. Les assertions de victoire, des trois balises d'Extraction, des 3600 ticks d'Infestation et du rapport unique restent obligatoires.

## Relecture locale

- Validateur de mouvement : 12/12 tests réussis.
- Approche de vitrine : quatre formats réussis, 41 échantillons de marche, 91,65 unités parcourues ; chaque déplacement respecte le budget, aucun déplacement instantané au clic.
- Quatre sessions FPS complètes par commandes : Extraction, Dernier Signal, Infestation et Champion réussies. Infestation atteint exactement 3600 ticks. Le relevé conserve le nombre réel d'actions par slot.

Ces relectures utilisent un bundle local, les images requises du dépôt, une progression préparée et une horloge virtuelle. Elles ne remplacent pas le contrôle HTTP/Vite du nouveau commit dans GitHub Actions. Les résultats antérieurs de staging demeurent historiques, et les résultats définitifs sont consignés dans la PR nº 13 avec leurs identifiants d'exécution.

Les exports Excel restent identiques aux octets vérifiés par 40725181635 : 17 741 lignes de production, 170 vérifications UI, 156 anciennes lignes conservées. Leur provenance de mécanique reste 849ae4eea0b761df0b518a815132a458ecfca2c7 ; cette reprise de tests n'ajoute aucun kit ni asset et ne réécrit pas leur historique.
