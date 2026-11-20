# Quarante supers de héros originaux en Mêlée

Quarante héros du manifeste original disposent de portées, fenêtres d’impact et effets définis pour la Mêlée. Le lot couvre 13 trios complets et Numa Corvinus d’Imperium Aeternum. Il conserve les noms et couleurs de leurs supers. Les dégâts des supers offensifs restent fondés sur leur puissance de fiche. Les 60 profils partagés et les 60 invocations RPG comparés reproduisent la version de départ. [Contrats des 40 héros](actors-reviewed.json) · [Manifeste](../../../../src/game/originalUniversesManifest.json)

| Effet | Nombre | Exemple |
| --- | ---: | --- |
| Dégâts | 25 | Le phare de Jonas vise une ligne. L’Enclume de Brokk frappe autour de lui. |
| Protection | 7 | Doros protège les alliés proches. Morcant porte ses chaînes seul et reçoit sa propre protection. |
| Purification | 4 | Aoi coupe l’affliction qui ralentit ses alliés proches en Mêlée. |
| Renforcement | 2 | Le message de Killa renforce l’attaque du groupe proche. |
| Soin | 2 | Mei rend des PV aux membres blessés à portée. |

Le moteur valide les 40 supers dans chaque camp. Les 44 tests contrôlent la dépense unique de la jauge, la fenêtre d’impact, les cibles, les effets temporaires et le respect des kits fournis. Le test de Doros mesure la réduction des dégâts jusqu’à l’expiration. Le CPU d’Aoi emploie la purification en présence du Glitch. Une zone de Numa rate lorsque les cibles sortent de portée avant l’impact. [Tests moteur](../../../../scripts/originalMeleeSupers.test.mjs)

Dans Chromium, le clavier déclenche le rempart de Doros sur lui et un allié avec 44 % de protection. Le tactile déclenche l’Enclume de Brokk, dont l’onde tracée par le Canvas touche un adversaire devant et un autre derrière lui. Les sprites du lanceur sont dessinés dans les deux parcours. Dix visuels d’objets du checkout et les images des mannequins de test ont répondu 404. [Résultats des parcours](verification.json)

La chorégraphie utilise les sprites et le rendu d’effets déjà disponibles dans le jeu. Les animations raster propres aux 40 supers, la résolution de rituels complets ou l’apparition d’entités comme le Chœur Nym demeurent des chantiers distincts. [Registre Mêlée](../../../../src/game/originalMeleeSupers.js)
