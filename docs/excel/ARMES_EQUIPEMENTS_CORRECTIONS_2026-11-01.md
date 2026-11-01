# Armes et équipements : fidélité par incarnation — 1er novembre 2026

**Base GitHub vérifiée :** `master` `698975774df66c32a730cf00156c0ccbf5a28af5`. Correction de la PR #20 en cours : le **demi-sabre de Maul ne correspond PAS à son duel final contre Ahsoka**.

## Corrections réellement appliquées au code

| Acteur / édition | Dotation appliquée au jeu | Source | Ce qui ne doit pas être copié entre éditions |
|---|---|---|---|
| Ahsoka Tano, début Padawan | Un sabre vert | Star Wars Databank, Ahsoka's lightsabers | La seconde lame verte shoto apparaît plus tard |
| Ahsoka Tano, Siège de Mandalore S7 | Deux sabres bleus | StarWars.com, Old Friends Not Forgotten, 20 avril 2020 | Ne pas confondre avec la paire blanche de Rebels |
| Ahsoka Tano, Rebels/Fulcrum | Deux sabres blancs | Star Wars Databank, Ahsoka's lightsabers | Ne pas reprendre les sabres bleus de S7 |
| **Maul, S7E10, The Phantom Apprentice** | **Sabre rouge double lame + jambes humanoïdes mandaloriennes** | Guide S7E10 et étude officielle des prothèses 2026 | Le demi-sabre rouge est antérieur ; le Darksaber appartient à un autre contexte |

La précédente version de cette PR avait substitué **à tort** la demi-lame rouge à l'arme double de Maul en saison 7. La source spécifique à l'épisode prime sur la page Databank qui décrit l'étape antérieure du Shadow Collective. Le modèle exact de la poignée S7 ne peut pas être affirmé identique à la poignée intacte du film *The Phantom Menace*.

## Variantes historiques conservées sans les transformer en équipements permanents

- **Ahsoka, Padawan plus tardive :** deux lames vertes, dont un shoto plus court. C'est une variante historiquement documentée et non une mise à jour silencieuse de l'avatar Padawan précoce.
- **Maul, début Shadow Collective :** moitié de son ancien sabre rouge, à une seule lame. Référence distincte du duel S7.
- **Maul, après Shades of Reason :** le **Darksaber** n'est pas seulement décoratif ; Maul l'a effectivement utilisé au combat, mais ce n'est pas l'arme par défaut du duel final de S7.
- **Maul, Brothers (Lotho Minor)** : jambes mécaniques arachnéennes de récupération.
- **Maul, Revenge (Dathomir)** : jambes griffues refaites par Talzin.
- **Maul, Eminence et S7** : jambes humanoïdes mandaloriennes. Ces trois morphologies ne sont **pas interchangeables**.
- **Aayla Secura** : sabre laser conservé, brassards et comlink particuliers retirés du kit faute d'attribution primaire explicite ; la couleur et le modèle du sabre restent soumis à contrôle visuel.
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
- Maul, générations de jambes (art et descriptions officiels, mars 2026) : https://www.starwars.com/news/star-wars-maul-shadow-lord-leg-list
- Aayla Secura, fiche officielle (attributions limitées) : https://www.starwars.com/databank/aayla-secura

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

## Rendu de secours des sabres — correctif moteur

Le renderer natif ne possédait aucune branche pour `lightsaber`, `dual_lightsaber` et `double_lightsaber` lorsqu'un sprite généré était manquant. La PR ajoute un **fallback procédural** : une lame simple, deux sabres indépendants ou une poignée centrale à deux lames opposées, avec teinte d'énergie issue du personnage. Le sprite généré vérifié reste **prioritaire**, grâce à `drawGeneratedSpriteSheet` ; aucun PNG existant n'est remplacé. Trois tests dans `scripts/energyBladeFallback.test.mjs` contrôlent la géométrie et les instructions Canvas. La validation visuelle exacte du personnage **reste à faire**.

## Second lot : deux personnages Legends — Revan et Darth Talon (1er novembre 2026)

### Darth Revan : séparation des œuvres et des armes

- Profil jouable désormais documenté comme **preset Sith (Star Wars: The Old Republic, Legends)** avec **un seul sabre rouge**. L'accent d'interface reste violet, mais la lame de secours du renderer est rouge grâce au `weaponColor` spécifique.
- L'ancien duo rouge/violet fixe n'est plus attribué à SWTOR sans preuve. Dans l'entretien officiel de 2020 sur le sabre Force FX de Revan, la couleur **rouge ou violette** est présentée selon le côté Sith/Jedi ; cela décrit une alternative de teinte, pas deux poignées simultanées.
- La présence **simultanée** de sabres rouge et violet est explicitement rapportée en **2025** pour sa représentation dans `LEGO Star Wars: Rebuild the Galaxy — Pieces of the Past` : représentation **distincte**, référencée mais non automatiquement équipée au profil SWTOR.
- Le masque de Revan est désormais rangé dans `costumeParts` : il ne devient pas un objet de combat interchangeable ; le modèle exact reste à vérifier visuellement. Les techniques de combat du projet sont des adaptations et ne sont pas déclarées reproductions 1:1.

Sources : https://www.starwars.com/news/darth-revan-force-fx-elite-lightsaber ; https://www.starwars.com/news/lego-rebuild-the-galaxy-pieces-of-the-past-deep-cuts ; https://www.starwars.com/games-apps/knights-of-the-old-republic

### Darth Talon : protections distinctes et marquages corporels

- Arme portée : **sabre rouge**, poignée à allure organique selon la référence costume.
- Protections portées : **Forearm and Bicep Armor** et **Leg Armor** au lieu de l'ancien `One Sith Armor` générique.
- Tenue reconstruite sous `costumeParts` (bandeau, sangles, gants, ceinture, bottes) ; tatouages noirs sous `bodyMarkings` plutôt que dans `equipment[]`.
- **Important** : la référence `501st Costume Reference Library` est un guide communautaire approuvé pour le cosplay. Elle décrit des formes et pièces de costume, mais **n'est pas une validation Lucasfilm pixel-par-pixel des sprites du jeu ni une preuve de toutes les scènes des comics**.

Source : https://crls.501st.com/tfe/darth-talon

L'audit Excel CSV [matrice](equipment-incarnation-matrix-2026-11-01.csv) et [delta](equipment-continuity-locks-2026-11-01.csv) gagnent **10 dossiers** : la matrice couvre **23** cas (10 entrées actives, 10 références de variantes ou de tenues, 3 exclusions de dotation), tandis que le CSV correctif contient **28 constats**. Ces numéros sont les enregistrements du **lot ciblé**, pas l'état exhaustif des milliers de personnages du jeu. Les sprites, animations et poignées ne sont pas certifiés 1:1.
