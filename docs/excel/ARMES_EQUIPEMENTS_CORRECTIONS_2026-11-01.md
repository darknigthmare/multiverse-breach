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

## Second lot : Darth Revan et Darth Talon (1er novembre 2026)

### Darth Revan : verrou d'édition KOTOR I, sans supprimer les autres variantes

**Correction de recherche (après vérification supplémentaire)** : le duo rouge/violet ne vient PAS exclusivement de LEGO. La 501st Costume Reference Library distingue explicitement :

- **KOTOR I, Darth Revan masqué :** **un sabre rouge** ; c'est désormais le preset jouable de `darth_revan`. Le guide fournit les critères de masque graphite/rouille avec double pointe au menton, casque/capuchon et cuirasse. Les hilts SWTOR ne doivent pas être réutilisés dans cette édition.
- **KOTOR II: The Sith Lords (représentation de costume) :** **deux sabres rouge et violet** ; conservés comme variante historique distincte non attribuée par défaut au kit KOTOR I.
- **SWTOR** : les armes `Fallen Revan's Lightsaber` (rouge) et `Redeemed Revan's Lightsaber` (violet) existent séparément dans la mise à jour officielle 6.2 ; ce sont des modèles SWTOR distincts des équipements KOTOR.
- **LEGO Star Wars: Rebuild the Galaxy (2025) :** l'apparition avec deux sabres rouge/violet est aussi attestée, dans sa propre continuité visuelle.

Le jeu utilise `weaponType: 'lightsaber'` et une lame de secours rouge pour **KOTOR I** ; le masque, la cape et la cuirasse sont des références de tenue, pas des armes de poche. Cette séparation ne certifie pas le sprite, le modèle du sabre, la cinématique ou le gameplay à 1:1.

Références : https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii ; https://www.starwars.com/games-apps/knights-of-the-old-republic ; https://www.swtor.com/info/news/article/20201209-0 ; https://www.starwars.com/news/lego-rebuild-the-galaxy-pieces-of-the-past-deep-cuts

### Darth Talon : protections distinctes et marquages corporels

- Arme portée : **sabre rouge**, poignée à allure organique selon la référence costume.
- Protections portées : **Forearm and Bicep Armor** et **Leg Armor** au lieu de l'ancien `One Sith Armor` générique.
- Tenue reconstruite sous `costumeParts` (bandeau, sangles, gants, ceinture, bottes) ; tatouages noirs sous `bodyMarkings` plutôt que dans `equipment[]`.
- **Important** : la référence `501st Costume Reference Library` est un guide communautaire approuvé pour le cosplay. Elle décrit des formes et pièces de costume, mais **n'est pas une validation Lucasfilm pixel-par-pixel des sprites du jeu ni une preuve de toutes les scènes des comics**.

Source : https://crls.501st.com/tfe/darth-talon

L'audit Excel CSV [matrice](equipment-incarnation-matrix-2026-11-01.csv) et [delta](equipment-continuity-locks-2026-11-01.csv) gagnent **10 dossiers** : la matrice couvre **25** cas (10 entrées actives, 12 références de variantes ou de tenues, 3 exclusions de dotation), tandis que le CSV correctif contient **30 constats**. Ces numéros sont les enregistrements du **lot ciblé**, pas l'état exhaustif des milliers de personnages du jeu. Les sprites, animations et poignées ne sont pas certifiés 1:1.

### Consistance des fiches descriptives Revan (01/11/2026)

Le même verrou **KOTOR I / sabre rouge unique** est désormais reporté dans `SOLAR_OPPOSITES_SIREN_STAR_WARS_CHARACTER_PLAQUES.darth_revan` : rang, dossier français et anglais et doctrine de combat. La narration générale peut évoquer l'amnésie, le destin du personnage et ses variantes, mais elle ne présente plus le duo rouge/violet comme kit physique de l'édition jouable KOTOR I. Le test canonique vérifie maintenant la concordance entre fiche narrative et inventaire.

## Lot supplémentaire — actions Rebels, anatomie de Maul et rendu de secours (01/11/2026)

- **Ahsoka Rebels/Fulcrum** : l'étiquette `World Between Worlds Step` confondait **l'intervention d'Ezra qui la sauve** avec un pouvoir de déplacement temporel utilisable par Ahsoka. Le mouvement de défense devient `Fulcrum Evasive Guard`. `Ahsoka the White` était une confusion de costume/époque avec la version Fulcrum et devient `Fulcrum Twin-Saber Sweep`, explicitement une **adaptation de gameplay**, pas une chorégraphie canon reproduite à 1:1. La fiche bilingue est ramenée à l'époque Rebels, tandis que l'action future du Monde entre les Mondes reste mentionnée comme événement, pas comme attaque. Sources : https://www.starwars.com/databank/ahsoka-tano et https://www.starwars.com/databank/malachor-sith-temple .
- **Maul Saison 7** : sa seule arme de l'inventaire est le sabre double rouge ; les **jambes humanoïdes mandaloriennes** deviennent `bodyProsthetics[]` (non transférables et non revendables). L'entrée `SW-MAUL-LEGS` reste active mais possède désormais `runtimeField: bodyProsthetics` et la matrice CSV donne cette colonne explicitement. Source : https://www.starwars.com/news/star-wars-maul-shadow-lord-leg-list .
- **Rendu de secours** : la factory `fighter` fournit désormais `primaryColor: color` car `drawPixelSprite` consomme `primaryColor` lors du fallback. Le sabre garde une teinte indépendante via `weaponColor`. Le test vérifie la couleur de corps des sept éditions suivies et protège la lame rouge de Revan.
- **Suivi** : chronologie toujours à **25 cas** ; delta de corrections désormais **33 constats**. Les visuels PNG, silhouettes, poignées et animations restent en attente de validation par comparaison directe à la source. Les changements d'actions et de fiche déclenchent une régénération reproductible du catalogue de 3 199 dossiers de failles, qui doit être exécutée et vérifiée avant fusion.

## QA des sept planches de personnages Star Wars (statut structural seulement)

Le contrôle de fidélité n'est pas limité aux noms d'objets. `scripts/auditCanonicalStarWarsSprites.mjs` inspecte les **sept fichiers PNG distincts** actuellement associés à Ahsoka (trois éditions), Aayla, Maul, Revan et Talon : existence, empreinte SHA‑256, dimensions natives, grille 4×4 attendue par le fallback et cohérence de l'ID d'incarnation. Le [CSV versionné](star-wars-edition-sprite-review-2026-11-01.csv) apporte les sources, les armes, les prothèses et trois colonnes de validation séparées pour silhouette, arme et animation. Le workflow `Canonical equipment chronology` régénère le contrôle à partir des assets et vérifie le CSV sans modifier les PNG.

**Limite impérative :** présence de PNG, unicité des empreintes et grille entière ne prouvent absolument **pas** que le dessin correspond au costume, à la poignée du sabre, à la longueur des lekku, aux membres mécaniques de Maul ni à une animation 1:1. Les états restent `PENDING_HUMAN_SOURCE_COMPARISON` et `PENDING_PLAYABLE_CAPTURE` jusqu'à revue de captures réelles. Aucun asset n'est marqué « certifié » sur la base de cette analyse technique seule.

## Inspection humaine des PNG — trois incompatibilités avérées (01/11/2026)

Les sept planches PNG 1024×1024 ont été **récupérées depuis la branche GitHub réelle**, puis inspectées visuellement : [archive de captures des sept sprites](https://github.com/darknigthmare/multiverse-breach/actions/runs/41356930988/artifacts/13103845643). Les empreintes SHA‑256 dans `star-wars-edition-sprite-review-2026-11-01.csv` sont la preuve d'identité exacte des fichiers observés.

1. **`ahsoka-padawan.png`** : la plupart des animations sont celles d'une mage en longues robes brunes avec bâton, orbe et livre. **Aucun sabre laser vert conforme** à l'édition Padawan précoce n'est visible. **Bloquant 1:1** : régénérer les 16 cases avec sa morphologie de jeune Togruta, tenue Clone Wars du début et lame verte.
2. **`ahsoka.png` (Siège de Mandalore S7)** : la planche utilise des robes fantastiques bleues, un bâton et un livre. Les **deux sabres bleus** et la tenue de Mandalore ne sont pas représentés comme prévu. **Bloquant 1:1**.
3. **`darth-revan.png` (KOTOR I)** : les 16 animations présentent les lames **rouge et violette simultanément**, alors que le kit jouable KOTOR I est explicitement limité à **un rouge**. Le motif visuel du masque demande également une comparaison à sa référence KOTOR I, distincte de SWTOR. **Bloquant 1:1**.

Les feuilles d'Ahsoka Rebels, d'Aayla, de Maul et de Talon présentent davantage d'éléments attendus (sabres blancs/bleu/rouge, Togruta/Twi'lek, tatouages et sabre double) **mais ne sont pas certifiées** : silhouette, tenue, longueur des lames, prothèses de Maul et fuites graphiques entre cases nécessitent une comparaison scène par scène.

Le contrôle technique `auditCanonicalStarWarsSprites.mjs` garde ces **trois verdicts négatifs verrouillés à leur empreinte SHA**. Si un PNG est remplacé, son état retourne automatiquement à `PENDING_HUMAN_SOURCE_COMPARISON`, et non à « approuvé ». L'ancienne image est conservée dans l'historique du dépôt ; aucune fausse promesse de validation pixel à pixel. Le nouveau champ `observedDefect` documente les éléments manquants.

Pour l'édition Ahsoka Rebels, le **guide officiel de Dave Filoni** fournit les couleurs et silhouettes des sabres, ainsi que les guides de costume : https://www.starwars.com/news/star-wars-rebels-costume-and-lightsaber-color-guide-for-ahsoka-tano . Ce guide devient la référence supplémentaire de revue de l'actuelle planche, indépendamment de la source historique des sabres blancs.
