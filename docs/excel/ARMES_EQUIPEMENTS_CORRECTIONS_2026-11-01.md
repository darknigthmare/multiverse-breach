# Armes et équipements : fidélité par incarnation — 1er novembre 2026

**Base GitHub vérifiée :** `master` `698975774df66c32a730cf00156c0ccbf5a28af5`. Correction de la PR #20 en cours : le **demi-sabre de Maul ne correspond PAS à son duel final contre Ahsoka**.

## Corrections réellement appliquées au code

| Acteur / édition | Dotation appliquée au jeu | Source | Ce qui ne doit pas être copié entre éditions |
|---|---|---|---|
| Ahsoka Tano, début Padawan | Un sabre vert | Star Wars Databank, Ahsoka's lightsabers | La seconde lame verte shoto apparaît plus tard |
| Ahsoka Tano, Siège de Mandalore S7 | Deux sabres bleus | StarWars.com, Old Friends Not Forgotten, 20 avril 2020 | Ne pas confondre avec la paire blanche de Rebels |
| Ahsoka Tano, Rebels/Fulcrum | Deux sabres blancs | Star Wars Databank, Ahsoka's lightsabers | Ne pas reprendre les sabres bleus de S7 |
| **Maul, S7E10, The Phantom Apprentice** | **Sabre rouge double lame + jambes cybernétiques** | Guide et récapitulatif officiel S7E10 | Le demi-sabre rouge est antérieur ; le Darksaber appartient à un autre contexte |

La précédente version de cette PR avait substitué **à tort** la demi-lame rouge à l'arme double de Maul en saison 7. La source spécifique à l'épisode prime sur la page Databank qui décrit l'étape antérieure du Shadow Collective. Le modèle exact de la poignée S7 ne peut pas être affirmé identique à la poignée intacte du film *The Phantom Menace*.

## Variantes historiques conservées sans les transformer en équipements permanents

- **Ahsoka, Padawan plus tardive :** deux lames vertes, dont un shoto plus court. C'est une variante historiquement documentée et non une mise à jour silencieuse de l'avatar Padawan précoce.
- **Maul, début Shadow Collective :** moitié de son ancien sabre rouge, à une seule lame. Référence distincte du duel S7.
- **Maul, après Shades of Reason :** le **Darksaber** n'est pas seulement décoratif ; Maul l'a effectivement utilisé au combat, mais ce n'est pas l'arme par défaut du duel final de S7.
- Les jambes cybernétiques sont des **prothèses** du personnage, pas une arme amovible ni un loot universel.

Chaque ligne est fixée par œuvre, période, nature, source et statut (en jeu / référence seulement) dans [la matrice de chronologie importable dans Excel](equipment-incarnation-matrix-2026-11-01.csv). Le [delta correctif 11+ lignes](equipment-continuity-locks-2026-11-01.csv) conserve l'historique des retraits de dotations non étayées.

## Sources primaires contrôlées

- Ahsoka, sabres verts/shoto et blancs : https://www.starwars.com/databank/ahsokas-lightsabers
- Ahsoka, doubles sabres bleus rendus par Anakin, S7E9 : https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-old-friends-not-forgotten
- Maul, sabre rouge double lors du duel S7E10 : https://www.starwars.com/series/clone-wars/the-phantom-apprentice-episode-guide
- Maul, duel S7E10 et lame double : https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-the-phantom-apprentice
- Maul, ancienne demi-lame et Shadow Collective : https://www.starwars.com/databank/darth-mauls-lightsaber
- Maul, usage effectif du Darksaber : https://www.starwars.com/news/what-is-the-darksaber
- Dave Filoni, préférence pour les deux lames plutôt que le Darksaber : https://www.starwars.com/news/dave-filoni-interview-star-wars-rebels-season-three

## Contrôles reproductibles

- `node --test scripts/canonicalEquipmentIncarnations.test.mjs` : incarnations, dotations, références, exclusions historiques, URLs sécurisées, correspondance CSV.
- `node scripts/exportCanonicalEquipmentChronology.mjs --check` : garantit que la matrice Excel CSV a été produite à partir de la même chronologie que les tests.
- `npm run test:conversation` intègre ce test ; la chaîne `prebuild` l'invoque aussi.

**Limites :** pas de certification pixel à pixel des sprites, effets, silhouettes, modèles de poignées, costumes ou animations ; aucun nouveau PNG authentifié dans cette PR. L'Excel historique de 4 936 acteurs, 169 références et 10 346 dossiers provenant de la PR #10 est **préservé** comme relevé d'une ancienne version du code. Ne pas le remplacer sans régénération complète à partir du commit cible et vérification des statuts par IDs stables. Les références historiques ne constituent pas de nouvelles dotations automatiques.

## Backlog prioritaire

1. Valider les silhouettes et sprites Ahsoka / Maul par édition (sabre, longueur de poignée, prothèses, tenue) ; produire des visuels distincts si la version active du sprite est incompatible.
2. Contrôler le rendu effectif des actions double-lame et des parades (les champs moteur d'arme ne prouvent pas les animations).
3. Régénérer l'Excel exhaustif contre le dernier code, puis recalculer les lacunes de chaque personnage, les icônes et les éditions ; ne pas utiliser les chiffres historiques comme état courant.
4. Étendre cette matrice aux autres personnages source-lockés, sans fusionner des éditions différentes et sans inventer de propriétés hors scène.
