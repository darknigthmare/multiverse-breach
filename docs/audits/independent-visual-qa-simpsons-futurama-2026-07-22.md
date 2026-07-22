# QA visuelle independante - The Simpsons et Futurama

Date : 2026-07-22

## Perimetre et methode

Cette passe couvre uniquement les 23 assets deja termines demandes :

- 14 fichiers de stage, soit sept pour `The Simpsons` et sept pour `Futurama` ;
- huit objets, soit quatre par univers ;
- la finale non-combat `The Simpsons`.

Les rapports de production existants ont seulement servi a confirmer le perimetre
et les contrats de dimensions. Chaque verdict ci-dessous a ete refait depuis les
fichiers actuels :

1. ouverture individuelle des 23 images avec `view_image` en detail natif ;
2. agrandissement des zones de consoles, de ville et du carnet de finale pour
   rechercher texte, pseudo-ecriture, personnage ou UI parasite ;
3. recomposition de chaque RGBA sur damier gris pour controler les bords, l'alpha
   et les franges chroma ;
4. reouverture Pillow pour les dimensions, le mode, les histogrammes alpha, les
   quatre coins, le RGB cache sous alpha zero et les pixels chroma visibles ;
5. comptage visuel independant des limites des deux plateaux Tactics.

`PASS` signifie qu'aucun defaut bloquant n'a ete trouve pour l'usage reel du
fichier. Aucun asset n'a ete regenere.

## Reperes de continuite recoupes

- [Sector 7-G](https://simpsonswiki.com/wiki/Sector_7-G) : poste de controle,
  temperature du coeur, portes d'urgence et conduites d'eau lourde ;
- [Clown Without Pity](https://simpsonswiki.com/wiki/Clown_Without_Pity) et
  [Evil Krusty Doll](https://simpsonswiki.com/wiki/Evil_Krusty_Doll) : poupee
  Krusty et interrupteur `Good/Evil` place dans le dos ;
- [Planet Express headquarters](https://theinfosphere.org/Planet_Express_headquarters) :
  grand hangar abritant le vaisseau Planet Express a New New York ;
- [Slurm](https://theinfosphere.org/Slurm),
  [Holophonor](https://www.theinfosphere.org/Holophonor) et
  [Dark matter](https://theinfosphere.org/Dark_matter) : boisson verte,
  instrument a vent avec projection holographique et carburant sous forme de
  petite boule noire dense.

Ces references servent uniquement au controle de continuite. Les images auditees
restent des assets originaux sans logo ou photogramme copie.

## Stages - verdict par fichier

| Fichier | Dimensions / mode | Controle visuel independant | Verdict |
| --- | --- | --- | --- |
| `public/backgrounds/lore-stages/the-simpsons/combat.webp` | `1672x941 RGB` | Salle de reacteur Springfield lisible, coeur vert, consoles violettes, portes jaunes et sol de duel continu. Centre libre, textures industrielles coherentes, aucun personnage, texte lisible, HUD ou watermark. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/melee.webp` | `1672x941 RGB` | Lecture laterale immediate, grande hauteur et large sol libre. La tuyauterie, les portes et le reacteur restent au fond ; aucune plateforme jouable n'est cuite dans le decor. Aucun contenu interdit. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/melee-backdrop.webp` | `1672x941 RGB` | Panorama profond du meme secteur, centre ouvert et plans bien separes. Aucun rebord flottant de collision, personnage, texte ou UI. Palette et matieres concordent avec le reste du pack. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/melee-platforms.webp` | `1254x1254 RGBA` | Exactement huit plateformes detachees en `4x2`, toutes entieres, espacees et pourvues d'un sommet horizontal lisible. Acier, tuyaux, garde-corps et securite jaune concordent avec le decor. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/rpg.webp` | `1672x941 RGB` | Camera 2.5D elevee et peu plongeante ; avant-plan et milieu du sol largement libres pour les deux camps. Profondeur claire, reacteur et accessoires repousses au fond ou aux coins. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/tactics.webp` | `1448x1086 RGB` | Plateau rectangulaire complet en trois-quarts, quatre coins visibles, neuf limites longitudinales et sept transversales : exactement `8x6`, soit 48 cellules. Toutes les intersections restent lisibles. | **PASS** |
| `public/backgrounds/lore-stages/the-simpsons/tactics-tiles.webp` | `1254x1254 RGBA` | Exactement seize modules en `4x4`, separes et non rognes. Bases, couvertures et accessoires utilisent la meme perspective trois-quarts et les memes textures que le plateau. | **PASS** |
| `public/backgrounds/lore-stages/futurama/combat.webp` | `1672x941 RGB` | Hangar Planet Express identifiable par le vaisseau menthe/creme/rouge, la baie sur New New York et les tubes de transport. Sol continu et centre de combat tres lisible ; aucun texte, logo, personnage ou UI. | **PASS** |
| `public/backgrounds/lore-stages/futurama/melee.webp` | `1672x941 RGB` | Camera laterale, volume vertical ouvert et fine ligne de sol continue. Le vaisseau reste dans le plan arriere et aucune plateforme jouable n'est integree. | **PASS** |
| `public/backgrounds/lore-stages/futurama/melee-backdrop.webp` | `1672x941 RGB` | Image volontairement identique au fond `melee.webp`, ce qui est conforme a son usage de couche de fond sous les plateformes separees. Aucun parasite visuel. | **PASS** |
| `public/backgrounds/lore-stages/futurama/melee-platforms.webp` | `1254x1254 RGBA` | Exactement six plateformes en `3x2`, entieres, non superposees et a sommet horizontal. Materiaux de hangar et palette menthe/acier coherents ; silhouettes de collision nettes. | **PASS** |
| `public/backgrounds/lore-stages/futurama/rpg.webp` | `1672x941 RGB` | Vue 2.5D legerement elevee, large voie centrale et profondeur avant/milieu/fond nette. Vaisseau et skyline restent hors des positions de combat. Aucun texte ou personnage. | **PASS** |
| `public/backgrounds/lore-stages/futurama/tactics.webp` | `1448x1086 RGB` | Plateau trapezoidal rectangulaire en trois-quarts, quatre coins visibles, neuf limites longitudinales et sept transversales : exactement `8x6`. Les quatre couvertures ne cassent ni le comptage ni les intersections. | **PASS** |
| `public/backgrounds/lore-stages/futurama/tactics-tiles.webp` | `1254x1254 RGBA` | Exactement huit modules en `4x2`, isoles, entiers et alignes sur une cellule trois-quarts. Acier, caisses, conduites et beacon restent coherents avec le hangar. | **PASS** |

## Objets et finale - verdict par fichier

| Fichier | Dimensions / mode | Controle visuel independant | Verdict |
| --- | --- | --- | --- |
| `public/sprites/generated/items/the-simpsons/pink-donut.png` | `512x512 RGBA` | Un donut entier, glacage rose, vermicelles colores et trou central reellement transparent. Lecture immediate a petite taille, aucun texte ou doublon. | **PASS** |
| `public/sprites/generated/items/the-simpsons/duff-beer-can.png` | `512x512 RGBA` | Une canette rouge avec dessus aluminium, bandes bleu-violet et ovale vierge. Evocation Duff sans mot, lettre ou logo copie. | **PASS** |
| `public/sprites/generated/items/the-simpsons/bart-s-skateboard.png` | `512x512 RGBA` | Une planche rouge-orange rayee, deux trucks et exactement quatre roues jaunes. Silhouette complete et lisible, aucun personnage ni marquage. | **PASS** |
| `public/sprites/generated/items/the-simpsons/cursed-krusty-doll.png` | `512x512 RGBA` | La poupee demandee est seule, vue de dos trois-quarts, avec cheveux bleu-vert, tenue verte/violette, chaussures jaunes, interrupteur dorsal et anneau de traction. Aucun personnage additionnel ni texte. | **PASS** |
| `public/sprites/generated/items/futurama/slurm-can.png` | `512x512 RGBA` | Une canette verte acide avec motifs organiques, accents rouges et ovale vierge. Identite Slurm claire sans nom, mascotte ou logo copie. | **PASS** |
| `public/sprites/generated/items/futurama/planet-express-badge.png` | `512x512 RGBA` | Un badge physique circulaire, anneau creme vierge, centre rouge et fusee menthe. Forme entiere, aucune lettre ni duplication. | **PASS** |
| `public/sprites/generated/items/futurama/holophonor.png` | `512x512 RGBA` | Instrument a vent/projecteur complet avec cles, corps prune et laiton, dome aqua et spirale lumineuse interne. Silhouette canonique lisible, sans hologramme externe parasite. | **PASS** |
| `public/sprites/generated/items/futurama/dark-matter-pellet.png` | `512x512 RGBA` | Une petite boule noire dense et irreguliere avec reflets violets contenus. Elle ne se lit ni comme une bombe, ni comme une planete, ni comme un cristal magique. | **PASS** |
| `public/sprites/generated/finals/the-simpsons/noncombatfinal.png` | `1024x1024 RGBA` | Atlas complet et separe : panorama du reacteur, preuves, cles, camera, enregistreur, barres, consoles, portes, vannes, etats du coeur, fuites et vignettes de resolution. Le carnet ne porte que des schemas abstraits ; aucun acteur, portrait, texte lisible, HUD ou UI superposee. | **PASS** |

## Dimensions, alpha et chroma

Les dix fonds RGB opaques sont conformes a leur usage et ne doivent pas avoir de
canal alpha. Les treize fichiers transparents ont tous une plage alpha `0..255`,
quatre coins a alpha zero, aucun RGB non nul sous alpha zero et aucun pixel de la
couleur chroma de production visible avec alpha superieur a 8.

| Fichier transparent | Alpha 0 | Alpha partiel | Alpha 255 | RGB cache | Chroma visible | Coins alpha 0 | Verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `the-simpsons/melee-platforms.webp` | 1 199 044 | 143 786 | 229 686 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/tactics-tiles.webp` | 1 084 415 | 173 542 | 314 559 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/pink-donut.png` | 130 249 | 5 206 | 126 689 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/duff-beer-can.png` | 160 639 | 3 045 | 98 460 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/bart-s-skateboard.png` | 175 251 | 3 909 | 82 984 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/cursed-krusty-doll.png` | 189 015 | 5 851 | 67 278 | 0 | 0 | 4/4 | **PASS** |
| `futurama/melee-platforms.webp` | 1 142 818 | 10 377 | 419 321 | 0 | 0 | 4/4 | **PASS** |
| `futurama/tactics-tiles.webp` | 1 188 947 | 9 701 | 373 868 | 0 | 0 | 4/4 | **PASS** |
| `futurama/slurm-can.png` | 162 658 | 4 124 | 95 362 | 0 | 0 | 4/4 | **PASS** |
| `futurama/planet-express-badge.png` | 151 040 | 5 530 | 105 574 | 0 | 0 | 4/4 | **PASS** |
| `futurama/holophonor.png` | 216 737 | 15 760 | 29 647 | 0 | 0 | 4/4 | **PASS** |
| `futurama/dark-matter-pellet.png` | 170 378 | 3 833 | 87 933 | 0 | 0 | 4/4 | **PASS** |
| `the-simpsons/noncombatfinal.png` | 322 252 | 42 624 | 683 700 | 0 | 0 | 4/4 | **PASS** |

La recomposition sur damier ne montre ni frange verte/magenta, ni trou alpha
accidentel, ni sujet coupe. Les transparences internes voulues, notamment le trou
du donut et les espaces entre modules, restent propres.

## Verdict global et corrections

**PASS 23/23.**

- Defaut bloquant : aucun.
- Fichier regenere via ImageGen : aucun.
- Asset modifie par cette passe : aucun.
- JS, JSX, JSON, manifeste ou registre modifie par cette passe : aucun.
- Commit, push ou deploiement : aucun.
