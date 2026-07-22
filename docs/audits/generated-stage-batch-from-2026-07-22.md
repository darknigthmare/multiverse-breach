# Pack de stage From - OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Ce lot ajoute exactement sept WebP originaux fan-made pour l'univers `From` :

- `public/backgrounds/lore-stages/from/combat.webp`
- `public/backgrounds/lore-stages/from/melee.webp`
- `public/backgrounds/lore-stages/from/melee-backdrop.webp`
- `public/backgrounds/lore-stages/from/melee-platforms.webp`
- `public/backgrounds/lore-stages/from/rpg.webp`
- `public/backgrounds/lore-stages/from/tactics.webp`
- `public/backgrounds/lore-stages/from/tactics-tiles.webp`

Chaque fichier final provient de son propre appel OpenAI ImageGen integre :
sept fichiers, sept appels distincts, aucune regeneration et aucune reutilisation
d'une meme source entre deux sorties.

Aucun photogramme, texture, logo, sprite ou asset officiel n'a ete copie dans
le depot. Aucun manifest, registre, fichier de code, package, musique ou fichier
d'un autre univers n'a ete modifie par cette passe.

## References visuelles verrouillees

La recherche a ete arretee des que les trois ancrages demandes etaient fixes :
Colony House, les talismans et la route en boucle.

- [Polaris Productions - FROM Season 1](https://www.polaris.tv/from-season1) :
  page de production avec les volets `THE TOWN`, `THE TALISMAN` et
  `BUILDING A TOWN` ;
- [Paramount+ Canada - From](https://www.intl.paramountplus.com/ca/shows/video/lp_tMg159Ag7Fp_AenE2hCuXtTZYZylP/) :
  descriptions officielles de la petite ville pastorale impossible a quitter,
  de Colony House et du choix entre les deux communautes ;
- [SFX - A Town Called Mallice](https://pocketmags.com/sfx-magazine/may-2026/articles/a-town-called-mallice) :
  reportage sur le decor de Beaver Bank et la construction de l'enveloppe
  exterieure de Colony House ;
- [Entretien avec le createur John Griffin](https://www.tvgoodness.com/2022/04/21/john-griffin-talks-from/) :
  confirmation du travail de production design, du poste de sheriff installe
  dans un ancien bureau de poste et de la clinique installee dans une ancienne
  ecole.

Ces sources ont uniquement guide une direction artistique originale. Aucun plan
de camera officiel n'a ete reproduit.

## Continuite visuelle commune

- ancre : grande demeure victorienne Colony House sur sa colline, facade de
  pierre et bardage gris-brun, pignons, lucarnes, cheminees, grand porche,
  serre et jardins rustiques ;
- ville : maisons modestes usees, petit diner turquoise aux enseignes vierges,
  anciens batiments civiques, poteaux electriques et vegetation envahissante ;
- route : asphalte fissure a deux voies qui traverse la ville, disparait dans
  la foret puis revient visuellement vers le meme point ;
- talismans : petites pierres ovales sombres liees par une ficelle brute,
  accrochees pres de portes et traitees comme des props minuscules sans glyphe
  lisible ;
- palette : bleu petrole, vert pin, charbon, pierre grise, bois brun delave,
  peinture bleu-vert et ambre limite aux fenetres ;
- lumiere : fin de jour glissant vers la nuit, avec une mince lueur rouille a
  l'horizon et aucune menace visible ;
- medium : pixel art 32-bit net, detaille et lisible, sans photorealisme ni
  flou pictural.

## Verrous des sept prompts ImageGen

Bloc commun : environnement vide, composition fan-made originale, continuite
ci-dessus, aucun personnage, creature, monstre, silhouette humanoide, visage,
corps, animal, gore, arme, texte lisible, lettre, nombre, logo, enseigne de
marque, rune lisible, HUD, UI, watermark ou cadre.

| Fichier | Verrou propre au prompt final |
| --- | --- |
| `combat.webp` | Camera 2D strictement laterale, bande d'asphalte continue sur toute la largeur, centre de duel libre, Colony House et route en boucle en profondeur. |
| `melee.webp` | Base de porche continue et exactement trois structures surelevees accessibles : deux courtes laterales et un long balcon central. |
| `melee-backdrop.webp` | Panorama de parallaxe avec ville, route et Colony House, sans sol jouable ni plateforme au premier plan. |
| `melee-platforms.webp` | Exactement huit plateformes laterales, une par cellule, en deux colonnes et quatre rangees, sur chroma `#00FF00`. |
| `rpg.webp` | Vue trois-quarts laterale 2.5D, jamais top-down, avec les 55 % inferieurs libres et une profondeur avant/milieu/arriere immediate. |
| `tactics.webp` | Camera tactique frontale trois-quarts, quatre coins visibles, exactement 8 colonnes par 6 rangees et 48 cellules vides. |
| `tactics-tiles.webp` | Exactement seize tuiles ou obstacles en quatre colonnes et quatre rangees, meme angle et meme echelle que le plateau, sur chroma `#00FF00`. |

## Generation et post-traitement

1. Les sept sources ont ete produites par sept appels OpenAI ImageGen integre
   independants.
2. Les quatre decors larges etaient directement en `1672x941`, le plateau en
   `1448x1086` et les deux atlas en `1254x1254`.
3. Les sorties RGB ont ete encodees en WebP lossless sans redimensionnement.
4. Trois marquages parasites pouvant etre lus comme enseigne ou embleme ont ete
   neutralises localement en bardage ou panneau vierge dans `combat`,
   `melee-backdrop` et `rpg`.
5. Les deux atlas ont ete detoures avec le helper officiel ImageGen
   `remove_chroma_key.py`, avec echantillonnage du bord, soft matte, seuil
   transparent 12, seuil opaque 220, despill et contraction de bord de 1 px.
6. Les cles mesurees etaient `#03F804` pour les plateformes et `#04F909` pour
   les tuiles tactiques.
7. Le plus grand composant physique de chaque cellule `2x4` ou `4x4` a ete
   conserve afin d'eliminer les poussiere chroma sans fusionner les sprites.
8. Le RGB de tous les pixels totalement transparents a ete force a `0,0,0`,
   puis les atlas ont ete encodes en WebP RGBA lossless avec `exact=True`.
9. La source tactique ImageGen possedait six rangees mais neuf colonnes. Ses
   huit premieres colonnes originales ont ete remappees horizontalement sur le
   quadrilatere complet. Le decor, les six rangees, les quatre bords et l'angle
   de camera ont ete conserves ; le resultat expose exactement `8x6` cellules.
10. Les sept PNG ImageGen, les deux PNG de detourage et tous les apercus
    temporaires ont ete supprimes apres reouverture des WebP finaux.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 659 098 | `3b0590e9dcd28b5a449796682fd50718c18b2e9d9f277bbefb6f8c9cb30b6a85` |
| `melee.webp` | 1672x941 | RGB | 1 558 726 | `b13a9bd323a08cbc933b5b0e26ec71155ae8b5f985773bfbde5cf43ad3459748` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 782 878 | `3ad9f6add2c5a95f6c152aa572651e9a4d5e25ea48bc6f369f141c25b97bf8d7` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 832 790 | `e21b128f2f5683b0b8c14d34bafe9e69ba0c14da26e49f135c0c997e0b95e7fc` |
| `rpg.webp` | 1672x941 | RGB | 1 935 264 | `0eab8d8f3dee85e251934e29defc65d13c4353d00f1888f627dc30827c1d1817` |
| `tactics.webp` | 1448x1086 | RGB | 1 860 658 | `4ced901006b9aa83ce18a9c68834959d44b3e3eae03fc875cec4ebb4658ce861` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1 096 928 | `0002d845bee8c2dd24c4e314f34d6cc11b00e69857c75b3b09419e02094294ee` |

## QA alpha, chroma et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB cache | Chroma vert visible | Coins transparents | Composants |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 032 839 | 35 934 | 503 743 | 0 | 0 | 4/4 | 8 |
| `tactics-tiles.webp` | 982 897 | 31 942 | 557 677 | 0 | 0 | 4/4 | 16 |

Surfaces des huit plateformes :
`85001, 82557, 77620, 70097, 64112, 60496, 53681, 46113` pixels.

Surfaces des seize modules tactiques :
`47665, 42236, 40649, 39883, 39870, 39097, 37707, 36114, 34796, 34720, 34564, 34555, 34258, 33916, 30236, 29353` pixels.

- plateformes : quatre rangees `2,2,2,2`, gouttiere horizontale minimale
  `59 px`, gouttiere verticale minimale `98 px` ;
- modules tactiques : quatre rangees `4,4,4,4` et quatre colonnes
  `4,4,4,4`, gouttiere horizontale minimale `19 px`, gouttiere verticale
  minimale `43 px` ;
- aucun sprite ne touche un voisin ni un bord du canevas.

## QA grille tactique

- perspective frontale trois-quarts elevee, jamais top-down ;
- quatre coins et epaisseur du bord avant visibles ;
- axe gauche-droite : exactement huit cellules ;
- axe fond-avant : exactement six cellules ;
- total : exactement 48 cellules vides ;
- sept separateurs verticaux internes et cinq separateurs horizontaux internes ;
- limites superieures verticales : `391, 506, 621, 736, 852, 967, 1082` ;
- limites inferieures verticales : `234, 399, 563, 728, 892, 1056, 1221` ;
- limites horizontales completes : `370, 429, 493, 565, 644, 736, 859` ;
- aucune couverture, plante, architecture ou decoration ne chevauche une case.

## QA visuelle et gameplay

- `combat.webp` : camera laterale, sol continu bord a bord, centre 1v1 libre ;
- `melee.webp` : grande base traversante et exactement trois plateformes
  surelevees accessibles ;
- `melee-backdrop.webp` : profondeur de ville sans surface de collision
  parasite au premier plan ;
- `melee-platforms.webp` : huit silhouettes completes, horizontales et
  non superposees ;
- `rpg.webp` : profondeur avant/arriere explicite, grande aire inferieure libre
  et route qui remonte vers Colony House ;
- `tactics.webp` : plateau entier, lisible et denombrable en `8x6` ;
- `tactics-tiles.webp` : seize modules complets, meme perspective, meme echelle
  et meme lumiere que le plateau ;
- la maison, la ville, la route en boucle, les porches et les petits talismans
  restent coherents d'une scene a l'autre ;
- aucune personne, creature, menace humanoide, chaine de texte lisible, logo,
  HUD, UI ou watermark n'a ete retenu dans les fichiers finaux.

## Integrite du depot

Cette passe ajoute uniquement les sept WebP du dossier
`public/backgrounds/lore-stages/from/` et le present audit. Les changements
concurrents d'autres agents ont ete laisses intacts. Aucun commit n'a ete cree.
