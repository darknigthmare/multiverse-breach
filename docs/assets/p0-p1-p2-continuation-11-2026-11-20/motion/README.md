# Cuirassé Nul « Oblique »

Dans le RPG du Concordat d’Ilyr, les deux panneaux de l’armure se déploient pendant la préparation d’**Écrans obliques**, puis s’ouvrent entièrement à l’impact de la garde. Ils restent ouverts durant la protection et se replient pendant les 30 derniers ticks. Le corps, les deux découpes et leurs textures proviennent du PNG original. Chaque panneau conserve sa propre charnière. La préférence de mouvement réduit du jeu ou du système rétablit immédiatement la planche fixe.

Le contrôle Chromium a chargé **Treillis de l’Architecte Pâle** dans `GameCanvas` avec Seyra Tal et trois adversaires du Concordat. Après sélection d’Oblique avec **7**, **I** ouvre l’aperçu P2 et **Confirmer les cibles** lance l’action. Le contrôle fournit la charge initiale, place les unités aux distances de garde et avance la simulation tick par tick. À l’impact, Oblique et le Drone Nul paléen à portée obtiennent la garde. L’Archonte Sevrix, plus éloigné, reste hors de l’effet. Les PV sont stables dans le scénario.

Les deux tailles d’écran (1 280 × 800 et 390 × 844) ont confirmé les mêmes poses, la disponibilité du PNG et les réglages de réduction en cours de partie. Les vérifications automatisées comportent 24 tests ciblés, dont le contrôle de réduction des dégâts et de fin de garde dans le moteur RPG.

- [Mesures Chromium et empreinte du PNG](verification.json)
- [Capture au moment de l’impact](oblique-deploiement.jpg)
