# Révision des identités de kart — catalogue B

Date : 9 novembre 2026.

Le fichier `src/game/kart/kartIdentityCatalogB.js` décrit les 262 univers de
« Marilyn Manson » à « Zorro » dans le tri anglais du catalogue des héros.
Il contient aussi 273 exceptions de personnages. Ce sont des choix de véhicules
et de formes pour des adaptations kart ; aucun statut de fidélité artistique
1:1 n’est accordé par ce fichier.

## Décisions de cohérence

- Les personnages humains de Predator et Prey disposent de véhicules de terrain,
  de chariots ou de véhicules de police adaptés à leur contexte. Les navettes
  Yautja restent attribuées aux chasseurs extraterrestres.
- Luke reçoit le X-wing ; Vader le TIE Advanced aux panneaux coudés ; Han le
  Faucon. Les incarnations d’Ahsoka, les Jedi et les Sith ont des choix distincts.
  Les ailes et moteurs déjà construits par le châssis ne sont pas doublés par
  des accessoires supplémentaires.
- Le Mako reste le véhicule de référence du groupe Mass Effect, avec des modules
  de reconnaissance, d’atelier ou d’étude selon le personnage.
- Pour Stargate, le F-302 terrien, le Jumper atlante, la navette du Destiny et le
  planeur Jaffa sont distingués. Le planeur Jaffa ne réutilise pas le Banshee de
  Halo : sa variante propre possède la silhouette en croissant.
- La moto-sidecar de Wallace, l’aéronef de Gromit et le fourgon de laine de
  Wendolene sont séparés. La fusée de Tintin dispose d’une variante fuselée à
  damier, au lieu d’un simple avion renommé.
- Les robots Portal et les optiques mécaniques utilisent le motif `optic`.
  Les deux yeux de cartoon sont réservés aux sujets qui leur correspondent.
  L’œil stylisé de Yu-Gi-Oh utilise `eye-sigil` et le kart de Yugi la variante
  `duel-disk`, avec des emplacements de cartes réellement modélisés.
- Les véhicules de Twisted Metal distinguent le camion de Sweet Tooth, la
  patrouille Outlaw et la voiture de récupération Roadkill.
- Will Turner et Elizabeth Swann restent rattachés au film de 2003 verrouillé
  par leurs ancres : Interceptor avec outils de forgeron pour Will ; Black Pearl
  d’évasion avec lanterne de pont pour Elizabeth. Les repères de capitaine du
  Hollandais volant et de reine des pirates ont été supprimés.
- Le biplan de Tails est le Tornado rouge et blanc, piloté par Tails. Le nom
  Whirlwind, qui désigne une voiture de Sonic Drift, n’est plus associé à ce
  châssis d’avion.
- Le Grim Knight de 2019 reçoit un blindé tactique original, distinct du Tumbler
  de Nolan. Alicia Pris reçoit une nacelle corsaire Felineko originale ; elle
  n’hérite plus du Police Robo ni du badge de Waffle.
- Les créations propres aux univers originaux conservent leurs thèmes de lore :
  horlogerie, archives sous-marines, graines-planètes, navigation corsaire ou
  convergence. Mirelle reste traitée séparément par l’intégration du roster.

## Références consultées pour les choix majeurs

Ces références établissent l’objet de départ et ses signes visuels. Elles ne
valident ni les proportions du kart, ni sa ressemblance complète.

| Objet | Source |
| --- | --- |
| M35 Mako | [Electronic Arts — Gameplay Calibrations](https://www.ea.com/ea-play/news/gameplay-calibrations) |
| Vader, TIE Advanced | [Star Wars Databank — Darth Vader](https://www.starwars.com/databank/darth-vader) |
| Faucon Millenium | [Star Wars Databank — Millennium Falcon](https://www.starwars.com/databank/Millennium-Falcon) |
| Cyclone de Sonic Drift | [SEGA — manuel Sonic Origins Plus, sections Sonic Drift](https://manuals.sega.com/origins/en/index.html) |
| Tornado piloté par Tails | [SEGA — Sonic Channel, Classic Tails](https://sonic.sega.jp/SonicChannel/character/classic-tails.html) |
| Sweet Tooth, Outlaw et Roadkill | [PlayStation — manuel original de Twisted Metal](https://secure.cdn.us.playstation.com/manuals/classic/games/twisted-metal-manual-en.pdf) |
| Moto et sidecar de Wallace et Gromit | [Science Museum Group — modèle réalisé par Aardman](https://collection.sciencemuseumgroup.org.uk/objects/co8180636/model-motorcycle-and-sidecar-used-in-animated-film-a-close-shave-1995) |
| Fusée lunaire de Tintin | [Tintin.com — Destination Moon](https://www.tintin.com/en/albums/destination-moon) |
| Planeur de la mort | [Master Replicas — modèle Eaglemoss du Death Glider](https://www.masterreplicas.com/en-us/products/death-glider) |

Les autres entrées sont des choix de conception à confronter aux références
existantes du personnage et aux captures. Une URL de catalogue de personnages,
une appellation canonique ou la présence d’un accessoire ne suffit pas pour
annoncer une reproduction vérifiée.

## Contrôles effectués sur ces données

- Couverture exacte des 262 univers confiés, sans entrée manquante ou excédentaire.
- Les 273 identifiants de personnages existent et appartiennent au périmètre B.
- Trois repères visuels par entrée et de deux à cinq motifs tous reconnus par
  le constructeur de géométrie.
- Construction initiale en mémoire des 534 profils (262 bases et 272 exceptions) avec
  sommets finis, géométrie non vide et présence des parties de modèle et motifs.
- Relecture des 185 personnages B portant une incarnation ou une ancre explicite,
  puis contrôle ciblé des cinq profils corrigés ou ajoutés à la suite de cette
  relecture. Les images de galerie et de comparaison ont été inspectées ; ce
  contrôle ne constitue pas une partie jouée dans le navigateur.
- Aucun doublon exact de combinaison modèle, variante et motifs entre les
  262 profils univers B. Les répétitions volontaires d’un véhicule au sein d’une
  même faction sont autorisées ; des couleurs différentes ne constituent pas
  à elles seules une nouvelle identité.

Ces contrôles portent sur les données et la géométrie. L’inspection des sprites
et du rendu en course reste une étape distincte, conduite dans la validation
commune du changement.
