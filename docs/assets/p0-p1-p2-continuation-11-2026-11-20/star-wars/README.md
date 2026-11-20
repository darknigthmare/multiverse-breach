# Dark Vador de Bespin en Tactics et Mêlée

Les terrains Tactics à étages reprenaient les attaques au sabre du lot W13. Le combattant de Bespin y retrouve les quatre commandes du plateau plat, dont le lancer de débris à trois cases et l’étranglement de Force à cinq cases. Les deux attaques ciblent une seule victime et suivent la ligne de vue du terrain. Leurs effets se dessinent depuis la surface occupée par cette victime, après une perte de PV confirmée. [Contrat des commandes](../../../../src/game/starWarsBespinVader.js) · [Tests du moteur](../../../../scripts/canonSourceKitRuntime.test.mjs)

Sur le pont Nexus, les huit scénarios Chromium couvrent les deux commandes, les deux camps et les cas avec ou sans bouclier d’objet. Les relevés distinguent le tablier à une hauteur de trois et le sol à la même coordonnée. Seule la cible du tablier perd des PV et reçoit le repère d’étranglement ou les fragments de débris lorsque son bouclier n’absorbe pas le coup. [Traces Canvas et placements](browser.json)

En Mêlée, les déclenchements direct et temporisé de l’étranglement affichent le contact après des dégâts effectifs. Un bouclier complet absorbe le coup sans afficher de faux étranglement. Le Duel conserve sa taille au sabre rouge W13 au contact, mesurée à 180 pixels de portée pour 100 points de jauge dans le moteur. Les 33 tests des suites RPG, Tactics et Mêlée passent. [Régressions avant et après](review.json) · [Tests Mêlée](../../../../scripts/smashCanonAbilityProfiles.test.mjs)

Le P0 artistique demeure ouvert. Le corps de jeu continue d’utiliser le repère neutre, et le dossier de Bespin attend une planche appropriée. [Revue des planches et routes des boss](../../p0-p1-p2-continuation-10-2026-11-20/star-wars/README.md)
