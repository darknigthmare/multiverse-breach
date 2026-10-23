# Combat et animations — vague 4, 18 octobre 2026

**484 poses natives et 24 mécanismes de stage ajoutés en parallèle.** Compilation complète vérifiée : **960 tests réussis dans 17 groupes**, lint sans avertissement, diff propre. Les **86 PNG gérés** sont présents dans `dist`, comparés octet par octet aux fichiers sources et chargés depuis la prévisualisation de production sans erreur JavaScript.

| Ajout de cette vague | Livraison réelle |
| --- | --- |
| Présentations et supers | 8 personnages × 8 phases × 4 poses = 256 poses : Red XIII, Yuffie, Vincent, Naruto jeune, Sasuke jeune, Sakura jeune, Piccolo et Kakashi de la guerre, avant son double Mangekyo |
| Mouvements de Goku DBZ adulte | 45 états × 4 poses = 180 poses, six atlas ; Kikoha à une paume distinct du Kamehameha |
| Corps Chaos de Vincent | 16 poses, quatre états natifs ; remplace le corps humain pendant le buff source dans Mêlée, Combat et RPG |
| Sprites de base corrigés | 16 poses pour Red XIII et 16 pour Vincent : orientation/queue conservée et pistolet porté par la main humaine droite |
| Stages | 24 mécanismes propres à des scènes de 12 nouveaux univers ; 65 profils précédents et leurs 130 empreintes de dessin préservés |

Les armes brutes de Goku, Piccolo, Red XIII, Yuffie, Vincent, Sakura jeune et Kakashi ont été corrigées après les couches d’expansion du catalogue. Le Bunshin de Sakura cible seulement Sakura ; les clones restent illusoires, sans dégâts ni guérison. Les recettes des 51 profils de présentation précédents restent identiques ; seules les notes de livraison et les listes d’assets manquants de Vincent/Sakura ont été actualisées.

La revue indépendante a aussi corrigé deux défauts de rendu : les nouveaux effets Mêlée reçoivent maintenant la cible réelle et conservent le point d’impact confirmé ; la copie visuelle d’un adversaire RPG conserve l’horloge du combattant, ce qui évite que Chaos reste figé en première pose. Ces corrections sont couvertes par des régressions J1/J2.

| Couverture actuelle | Livré | Manque restant |
| --- | ---: | ---: |
| Atlas dédiés aux huit phases de présentation/super | 35 héros, 280 phases, 1120 poses | 1876 héros |
| Manifeste Mêlée illustré complet de 45 états | 3 héros : Cloud, Tifa, Goku | 1908 héros |
| Mécanismes de scènes propres à l’univers | 89 mécanismes pour 48 univers | 477 univers n’ont que l’ambiance de base |
| Ambiances de base | 525 univers | 0 univers |
| Profils d’entités sans atlas | 82 profils reliés à 28 atlas | 0 des 82 manques initiaux |

Les noms génériques stricts effectifs restent à **0**. Cela décrit les identités des capacités ; cela ne remplace pas les animations qui manquent encore. Les 50 personnages ayant des scènes scriptées (350 paires personnage/phase) ne doivent pas être confondus avec des personnages ayant les 45 états illustrés.

Les contrôles navigateur couvrent 2 240 sélections réelles de poses de présentation, 360 rendus des états de Goku et huit prises de rebord, les commandes clavier/saut/atterrissage/demi-tour et une vraie pause, le Kamehameha à impact unique, la transformation puis le retour humain de Vincent, une invocation annulée/confirmée puis mise en pause et le déroulement complet Combat en deux manches avec un seul résultat final. Les 24 nouveaux décors sont vérifiés à trois formats supplémentaires chacun. Aucun de ces parcours n’a produit d’erreur JavaScript ; le seul échec réseau attendu est la police Google Fonts bloquée par le proxy.

**La fidélité visuelle 1:1 n’est pas certifiée.** Les dessins sont des créations natives adaptées, avec les références, prompts, sources, corrections, SHA et identifiants non fournis laissés à `null`. Les timings, échelles et trajectoires restent adaptés au jeu. Vincent conserve notamment le contrôle manuel, les attaques existantes et un buff de cinq secondes ; Berserk, Chaos Saber, Satan Slam et les règles de transformation de FFVII ne sont pas reproduits. Aucune mort instantanée n’a été inventée. Les 1 911 héros restent donc sans comparaison source validée 1:1.

- [Mesures reproductibles et limites](current.md) · [JSON complet](current.json)
- [Inventaire des 1 911 personnages](character-coverage.csv) · [Couverture des 525 univers](stage-coverage.md)
- [Tests, compilation et SHA des fichiers distribués](validation.json) · [Journal complet](build.log)
- [Preuves navigateur](browser-checks.json) · [Goku](browser/goku-evidence.json) · [Vincent/Chaos](browser/vincent-super-result.json) · [RPG/Combat](browser/regression-readme.md)
- [Sources des décors](stage-source-checks.json) · [Sources et limites de Chaos](chaos-source-facts.json)

Une première compilation s’est arrêtée sur un ancien compteur de test global resté à65 après l’ajout des24mécanismes. Le test vérifie maintenant strictement le sous-ensemble historique de65, tandis que les tests Wave4 exigent89profils uniques ; le [journal initial](build-initial-stale-stage-count.log) est conservé.

Le renouvellement des deux références de base a ensuite nécessité le recalcul de l’audit des images et la régénération du catalogue ; le [journal de ce contrôle](build-reference-refresh-required.log) est également conservé.

Les références [baseline.json](baseline.json) et [runtime-baseline.json](runtime-baseline.json) conservent l’état précédant cette vague. Les rapports historiques des vagues précédentes sont conservés. La première tentative de harness de pause Goku, qui bloquait avant toute commande clavier, est également conservée avec son diagnostic ; seul le harness a été corrigé avant le passage final.
