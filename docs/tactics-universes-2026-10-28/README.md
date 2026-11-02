# Tactics W16 — quatre secteurs jouables supplémentaires

Les quatre nouveaux secteurs portent la sélection à **19 terrains verticaux** : seize secteurs adaptés aux univers et trois arènes Nexus. Les quinze définitions précédentes sont conservées. Ces plateaux possèdent leurs propres surfaces, reliefs, matières et environnements Tactics ; les autres moteurs gardent leurs niveaux et leurs images.

Le [plan de source antérieur aux éditions](source-plan-before.json) fixe les œuvres, périodes, lieux et objectifs retenus. Les grilles, distances et marqueurs A.R.C.A. sont des adaptations de gameplay ; elles ne constituent pas des plans officiels reproduits à l’identique.

## Choisir et parcourir un secteur

Ouvrir **Combat custom → TACTIQUE → TERRAIN TACTIQUE**. Le choix **Auto** sélectionne un secteur de l’univers lorsqu’un secteur dédié existe ; un choix explicite affiche son œuvre, son lieu et son objectif avant le lancement.

| Nouveau secteur | Version retenue | Situations jouables et objectif |
| --- | --- | --- |
| Inkwell Isle One | Cuphead, 2017 | Berges en pente, ruisseau, gué lent et petit pont. Deux repères occupent la même position horizontale, l’un dans le gué et l’autre sur le pont. |
| IMC World Foundry | Titanfall 2, 2016, mission Into the Abyss | Fosse de maintenance, deux hauteurs de passerelle et passage inférieur bas. Neutraliser un relais en hauteur et un relais dans la fosse. |
| Gare de Central | Fullmetal Alchemist: Brotherhood, 2009 | Parvis de pierre, escaliers et tranchée ferroviaire. Contrôler les postes du passage supérieur et de la voie basse sans tirer à travers leur plancher. |
| Royaume Sadida | Série Wakfu, saison 1, 2008–2010 | Racines en pente, canopée, creux humide et bassins impraticables. Deux sorties offrent un parcours haut ou un sentier bas. |

Cliquer une surface ou employer les flèches du plateau pour l’inspecter, puis confirmer avec **ALLER / CIBLER CETTE CASE** ou **Entrée**. L’inspection seule ne dépense pas de points d’action. La liste des surfaces, la coupe de vue et les touches `[` / `]` distinguent les étages ; les boutons de zoom et de recadrage complètent le glissement de caméra et la molette.

Les déplacements suivent le chemin et son coût réel. Les rampes de berge rendent les gués accessibles ; un dénivelé isolé ne devient pas un raccourci gratuit. Un personnage ne peut pas entrer sous un plancher trop bas pour sa taille, et une grande empreinte exige plusieurs surfaces de soutien. Les arbres, piliers et volumes opaques bloquent réellement les lignes de vue. La coupe change l’affichage, sans autoriser un déplacement ou un tir à travers une dalle.

## Une texture par surface et par face

La carte ne se réduit pas à une grille plate. Chaque surface possède un identifiant, une matière et quatre hauteurs de coin. Un pont et son passage inférieur conservent donc des supports distincts à la même coordonnée ; un pan incliné garde ses vraies arêtes d’entrée et de sortie.

Le moteur projette les détails dans le polygone de chaque face. Le dessus suit les quatre coins de la surface ; les flancs utilisent la profondeur du sol ou de la structure ; le dessous des plateformes reste une face séparée. Les lignes des planches, pavés, plaques et strates sont ainsi attachées au relief, au lieu de flotter dans un rectangle d’écran. Les personnages se placent sur leur surface occupée et se masquent selon les volumes environnants.

| Famille nouvelle | Dessus | Flancs et dessous |
| --- | --- | --- |
| Inkwell | Herbe des berges et planches du pont | Terre stratifiée et bois du tablier |
| World Foundry | Plaques industrielles et caillebotis | Métal sombre et épaisseur des plateformes |
| Central | Pavés du parvis et surface ferroviaire | Pierre du soutènement et structure de la voie basse |
| Sadida | Sol végétal et grandes racines | Terre du creux et bois des passages hauts |

Ces huit matières s’ajoutent aux 34 existantes, soit **42 profils de matière**. Elles sont procédurales et ne sont pas certifiées comme textures officielles des œuvres. Les horizons et silhouettes architecturales sont également propres à Tactics, sans image d’arène empruntée au Combat, au RPG ou à la Mêlée.

## Scènes animées

Dix études localisées s’ajoutent aux 425 mécanismes précédents : salle Time Twister, New Junk City, quais de Mêlée, ruisseau d’Inkwell, ligne aérienne de Tokyo-to, convoyeur de RuptureFarms, atrium de Willamette, rideaux de Carnegie Hall, ventilation du Bebop et feuilles du royaume Sadida. Deux univers supplémentaires, Earthworm Jim et Wakfu, possèdent ainsi un premier mécanisme localisé : **435 définitions dans 216 univers**.

Ces cycles représentent des architectures ou paysages vides. Ils ne créent ni personnage, collision, danger ou dégât. Leur temps vient de la simulation ; le mouvement réduit fige le début du cycle. Leurs géométries et timings sont des adaptations documentées, pas des images ou animations officielles.

## Code et vérification

Les [secteurs](../../src/game/tacticsUniverseBattlefieldsWave16.js), [matières et environnements](../../src/game/tacticsUniversePresentationWave16.js), [projection des faces](../../src/game/tacticsTerrainRenderer.js) et [scènes](../../src/game/melee/stageAnimationCatalogWave16.js) sont intégrés aux sélecteurs et moteurs communs.

Les tests ciblés vérifient les chemins, les objectifs, les empreintes, la hauteur libre, les lignes de vue, les textures et la préservation des anciennes définitions. Les parcours navigateur vérifient séparément les vrais lancements depuis Combat custom, les déplacements confirmés, leurs coûts, le choix des étages et les vues mobiles. Un test Node ne remplace pas ces parcours ni une inspection des captures.

```bash
node --test scripts/tacticsUniverseWave16.test.mjs scripts/tacticsUniversePresentationWave16.test.mjs scripts/tacticsUniverseRoutingWave16.test.mjs scripts/tacticsUniverseRuntimeWave16.test.mjs scripts/stageAnimationWave16.test.mjs
```

Le [guide historique W15](../tactics-terrain-verticality.md) reste conservé dans son état de validation. Les preuves préliminaires et finales de cette vague gardent leurs dates et leurs rapports distincts ; la présence de ce guide n’attribue pas de résultat à un parcours qui n’a pas été exécuté.
