# Dix scènes localisées W17

Les dix nouvelles études portent le catalogue à **445 définitions dans 220 univers du roster**. Les 435 définitions antérieures et **1 740 traces de rendu résolues dans les quatre modes** sont conservées par une baseline prise avant le code.

Le [plan de source](source-plan-before.json) distingue les faits de lieu des adaptations de dessin et de timing. Les scènes exigent une localisation précise, sa version et le détail décrit ; elles n’ajoutent aucun choix général par univers.

| Univers et version | Étude vide |
| --- | --- |
| Tomba!, 1997 | Entrée en bois et auvent du Dwarf Village |
| Spyro Reignited Trilogy, 2018 | Berge et remous du bassin de Summer Forest |
| Rayman Legends, 2013 | Créneaux, cordages et fanions de Castle Rock, sans bande sonore importée |
| Beyond Good & Evil, 2003 | Baie d’entretien et ventilation du garage Mammago, distinctes du phare |
| Sanctum 2: Ruins of Brightholme, DLC de 2013 | Paroi technique et baie de ventilation |
| The House of the Dead, arcade Model 2 original | Vestibule et draperies hautes du manoir Curien |
| BioShock, 2007 | Fenêtre d’arrivée à Welcome to Rapture et reflets de l’eau |
| Nemesis, boîte de base de 2018 | Compartiment moteur nº2 et accès technique, interprétation architecturale déclarée |
| DAN DA DAN, saison1 de 2024 | Portail vide de la résidence Ayase et papiers attachés dans le vent ordinaire |
| Zootopia, 2016 | Verrière et végétation lointaine de Savanna Central Station |

Le temps vient des secondes de simulation. Chaque cycle finit à son point de départ ; conserver le même temps garde les mêmes pixels, et le mouvement réduit fige le temps zéro. Ces couches ne créent ni acteur, son enregistré, accès, collision, danger ou dégât. Aucun atlas ou dessin officiel supplémentaire n’est compté.

Le [test W17](../../../scripts/stageAnimationWave17.test.mjs) contrôle les lieux, les exclusions de versions, les cycles, l’état Canvas et la préservation de toute la baseline. Le [parcours Chromium](../browser/stages-wave17.mjs) exerce le véritable renderer et ses pixels RGBA : dix études, quatre instants affichés par étude, deux planches de contrôle. Il ne prétend pas constituer un combat complet. Un passage final séparé est prévu après le gel de production de la vague.
