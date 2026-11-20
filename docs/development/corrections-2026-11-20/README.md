# Corrections de combat et reprise des médias

- Les légendes du duel et des invocations RPG suivent la taille de texte réglée. En RPG, une légende de 4,125 px a été mesurée sur mobile avant correction. À 150 %, le nouveau texte atteint 22,5 px en RPG et 25,5 px en duel. Le lobby du duel ne déborde plus du petit écran. [RPG](rpg-captions/README.md) · [Duel](duel-captions/README.md).
- Une unité Tactics ramasse un objet à l’arrivée sur son étage. Une interruption avant l’arrivée laisse la ressource en place. Le clavier et le panneau de terrain empruntent la même logique. [Ramassage](tactics-pickups/README.md).
- La commande Spécial de J2 peut lancer la technique nommée du Greffier et des autres ennemis du Nexus concernés. Elle conserve son seuil et sa résolution. [Mêlée](melee-nexus/README.md).
- Les arènes personnalisées reprennent le mouvement prévu par le fond du mode. Un lieu explicitement déclaré garde la priorité, et le réglage de mouvement réduit garde la pose fixe. [Ambiances](custom-ambience/README.md).
- Deux lots Doom ont été réunis dans un arbre de 60 médias. Un conflit provoqué a arrêté la copie. La reprise a réutilisé les 35 fichiers du lot déjà présents et copié celui qui manquait. [Assemblage DLC](../../assets/dlc-batch-export-2026-11-20/ASSEMBLY.md).

La suite d’interface a passé 580 tests pendant l’intégration. Les parcours Chromium ont ensuite vérifié le dernier rendu des légendes. Les autres suites passent avec 160 tests de contrats, 116 contrôles Tactics, 47 tests RPG et 20 sur les ambiances. Les éditions complète et de base compilent pour le code. Quatre petits WebP du dépôt ont été matérialisés temporairement pour le contrôle physique, puis retirés après vérification de leurs octets. [Tests](validation/tests.json) · [Compilations](validation/bundles.json) · [Miroirs de test](validation/ambience-mirrors.json).

L’assemblage DLC complet et les revues visuelles de l’inventaire restent ouverts. Le démonstrateur DLC vit sur le volume temporaire. Les instructions et reçus permettent de le reconstruire sur un volume de destination compatible.
