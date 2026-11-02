# Tactics W15 — secteurs propres aux univers

Quatre secteurs jouables s’ajoutent aux huit secteurs W14 et aux trois arènes Nexus : **quinze cartes verticales, dont douze secteurs d’univers**. Les cartes W15 comprennent **722 surfaces**, sept nouvelles matières et trois nouveaux décors physiques. Elles utilisent les vrais déplacements, volumes, hauteurs libres, attaques et objectifs du moteur.

| Secteur | Version retenue | Situation jouable |
| --- | --- | --- |
| Dollet, 172 surfaces | *Final Fantasy VIII* (1999) | Rue basse, coursives et deux postes de contrôle superposés, avec accès par pentes. |
| Cour du manoir Spencer, 174 surfaces | *Resident Evil* (1996) | Bassin impraticable, balcon et passage inférieur ; récupération de deux repères à des hauteurs différentes. |
| Red Rock Canyon, 193 surfaces | *Fallout: New Vegas* (2010), Mojave en 2281 | Mesa de grès à Z 3, ravine sèche à Z −1, détour plus coûteux et extraction de deux unités. |
| White Forest, 183 surfaces | *Half-Life 2: Episode Two* (2007) | Prairie, pins, ruisseau encaissé, deux gués et pont de service ; deux relais physiques à neutraliser. |

Les [définitions](../../src/game/tacticsUniverseBattlefieldsWave15.js) composent le catalogue en jeu sans réécrire les huit cartes historiques. Les [palettes, matières et silhouettes](../../src/game/tacticsUniversePresentationWave15.js) sont procédurales et réservées à Tactics. Les plans, distances et marqueurs A.R.C.A. sont des adaptations originales ; aucune reproduction officielle 1:1 n’est certifiée.

La [preuve de préservation](historical-preservation.json) compare au commit `d73b18b8` : huit définitions de cartes, vingt-sept matières, onze flux de dessin d’environnement et sept silhouettes de décors restent identiques. Le [helper reproductible](verify-historical-preservation.mjs) effectue cette comparaison sans modifier la production.

La [preuve navigateur préliminaire](preliminary/result.json) a réellement lancé les quatre nouvelles cartes, un pont Nexus et une grille plate : six lancements, dix-huit contrôles, dix captures et zéro erreur JavaScript. Chaque nouveau secteur a reçu une inspection, une coupe, un zoom/recentrage, un déplacement confirmé avec son coût PA et une vérification mobile à 375 pixels. Les [dix images ont été inspectées](preliminary/visual-review.json) et figurent dans la [galerie préliminaire](preliminary/index.html). Cette exécution précède le gel global ; la clôture produit séparément la [preuve finale](result.json), la [galerie finale](index.html) et sa [revue](visual-review-final.json).

Les suites W15 ajoutent trente-deux cas de données, rendu, routage et runtime. Elles vérifient les itinéraires depuis trois apparitions, les boss de 2 × 2 cases, les objectifs accessibles, les altitudes intermédiaires des pieds sur quatre rampes et le contrôle exact des deux étages de Dollet. Les [37 cas Phaselock](../../scripts/tacticsPhaselockWave15.test.mjs) et les [28 cas Healing Burst](../../scripts/tacticsValHealingWave15.test.mjs) couvrent aussi le terrain plat : application réelle des contrôles ou soins, portée, surfaces, pause, deux camps, coûts, refus et IA. La suite comporte **218 cas** ; les résultats datés figurent dans la [validation W15](../combat-fidelity-wave15-2026-10-26/validation.json).

[Guide complet, commandes et format des surfaces](../tactics-terrain-verticality.md) · [Tests W15](../../scripts/tacticsUniverseWave15.test.mjs) · [Runtime](../../scripts/tacticsUniverseWave15Runtime.test.mjs)
