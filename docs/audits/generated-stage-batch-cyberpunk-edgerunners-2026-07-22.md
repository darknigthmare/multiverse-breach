# Pack de stage Cyberpunk: Edgerunners - OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Ce lot ajoute exactement sept WebP originaux fan-made pour l'univers
`Cyberpunk: Edgerunners` :

- `public/backgrounds/lore-stages/cyberpunk-edgerunners/combat.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/melee.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/melee-backdrop.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/melee-platforms.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/rpg.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/tactics.webp`
- `public/backgrounds/lore-stages/cyberpunk-edgerunners/tactics-tiles.webp`

Chaque asset a recu son propre appel OpenAI ImageGen integre. Le pack reste
centre sur Night City, l'autoroute industrielle de Santo Domingo et la route
du convoi final vers Corpo Plaza, avec Arasaka Tower comme ancrage lointain.
Aucun photogramme, texture ou asset officiel n'a ete copie dans le depot.

Aucun manifest, registre, prompt global, fichier de musique, package ou code
partage n'a ete modifie.

## References officielles inspectees

- [CD PROJEKT RED - Cyberpunk: Edgerunners](https://www.cyberpunk.net/en/edgerunners)
- [CD PROJEKT RED - Edgerunners Update 1.6](https://www.cyberpunk.net/en/news/45280/edgerunners-update-patch-1-6-list-of-changes)
- [Netflix Media Center - Cyberpunk: Edgerunners](https://media.netflix.com/en/only-on-netflix/81054853)
- [Netflix Tudum - bande-annonce Cyberpunk: Edgerunners](https://www.netflix.com/tudum/articles/cyberpunk-edgerunners-trailer)
- [Netflix - episodes officiels Cyberpunk: Edgerunners](https://www.netflix.com/title/81054853)

La page CD PROJEKT RED fixe l'identite Night City et la collaboration avec
TRIGGER. La mise a jour officielle confirme Santo Domingo et Arroyo comme
lieux Edgerunners exploitables. Netflix confirme la ville futuriste obsede par
les implants, l'escalade Arasaka des episodes 9 et 10, ainsi que l'energie
urbaine neon de la serie. Ces pages ont servi de references visuelles et
narratives; les compositions finales sont originales.

## Direction visuelle commune

- environnement : autoroutes surelevees de Santo Domingo vers Corpo Plaza ;
- silhouette : Arasaka Tower lointaine, megabuildings et usines empilees ;
- materiaux : asphalte mouille, acier blinde, beton, conduites et garde-corps ;
- palette : cyan, cobalt, rouge limite et jaune de securite industriel ;
- medium : pixel art 32-bit detaille, net et original ;
- interdits : personnage, silhouette, vehicule, arme, texte, logo, UI, HUD,
  watermark, bordure et copie de photogramme.

## Prompts resumes par fichier

| Fichier | Verrou ImageGen principal |
| --- | --- |
| `combat.webp` | Vue strictement laterale, autoroute continue et centre 1v1 libre devant Night City. |
| `melee.webp` | Base d'autoroute large et exactement trois plateformes surelevees separees. |
| `melee-backdrop.webp` | Panorama de parallaxe lointain sans sol ni plateforme jouable au premier plan. |
| `melee-platforms.webp` | Huit plateformes industrielles, quatre rangees de deux, sur chroma vert uniforme. |
| `rpg.webp` | Angle trois-quarts lateral peu plongeant et grande aire de combat libre dans les 55 % inferieurs. |
| `tactics.webp` | Vue tactique trois-quarts elevee, plateau complet de huit colonnes et six rangees. |
| `tactics-tiles.webp` | Seize tuiles et couvertures compatibles, grille 4x4 sur chroma vert uniforme. |

## Traitement des sorties

1. Les sept sources ont ete produites par sept appels ImageGen distincts.
2. Les quatre decors RGB 16:9 etaient directement en `1672x941` et ont ete
   encodes en WebP lossless sans redimensionnement.
3. Les deux atlas etaient directement en `1254x1254`. Leur chroma a ete retire
   avec le helper OpenAI `remove_chroma_key.py`, soft matte, seuil transparent
   12, seuil opaque 220, despill et contraction de bord de 1 px.
4. Les couleurs de cle mesurees etaient `#05f805` pour les plateformes et
   `#06f602` pour les tuiles tactiques.
5. Le RGB cache de chaque pixel totalement transparent a ete remis a `0,0,0`,
   puis les atlas ont ete encodes en WebP RGBA lossless avec `exact=True`.
6. La source tactique etait deja en vraie vue trois-quarts et possedait huit
   colonnes, mais huit rangees. Le decor OpenAI a ete conserve; l'interieur du
   plateau a ete remappe par homographie depuis les six rangees source
   `y=437..960` vers le quadrilatere final `y=330..960`. Le resultat expose
   exactement 8x6 cellules, sans changer la skyline, les rails ou l'angle.
7. Tous les fichiers ont ete reouverts depuis leur chemin final avant la QA.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 808 836 | `27ffa9311318fd6b9b3cc3a462e8f816d99bc55e10ee1671099816998c9c2a73` |
| `melee.webp` | 1672x941 | RGB | 1 710 806 | `51ddf843b2a03d1383051dcc54115130c5e12af330b313314ee3540af10e8821` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 386 842 | `533502fdf1771f4213f268d5e7059a10bdc5546cf29ad907372ee7417a329b7a` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 754 934 | `c385ce5c9fec91508e638153484d9bef2a29c5434e9b7e0a39f5025a4d7690c7` |
| `rpg.webp` | 1672x941 | RGB | 2 011 370 | `face5b50269a3640a7b2cf6a61614e1951b6b929e836227aeff1776d2988b3e5` |
| `tactics.webp` | 1448x1086 | RGB | 2 047 156 | `20709812317a3a4c95752dc7bd5bffbb937c683085967822100a7f54f257bca6` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 906 118 | `34169b208ff71ea47257341b364bed6c4042f88ebc25bb5db76122e2b0dfac31` |

## QA alpha et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB non nul sous alpha 0 | Chroma vert visible | Coins transparents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 132 012 | 31 408 | 409 096 | 0 | 0 | 4 / 4 |
| `tactics-tiles.webp` | 1 083 669 | 16 755 | 472 092 | 0 | 0 | 4 / 4 |

Segmentation par bandes alpha reelles :

- plateformes : 4 rangees, `2,2,2,2` elements, soit 8/8 ;
- gouttieres verticales plateformes : `175,156,158` px ;
- gouttieres horizontales plateformes : `69,66,85,96` px ;
- tactique : 4 rangees, `4,4,4,4` elements, soit 16/16 ;
- gouttieres verticales tactiques : `45,50,57` px ;
- gouttiere horizontale tactique minimale : 21 px ;
- aucun element ne touche, ne chevauche ou ne sort du canevas.

## QA grille tactique

- perspective elevee frontale trois-quarts, jamais top-down ;
- quadrilatere jouable entier et quatre coins visibles ;
- 8 colonnes conservees et 6 rangees remappees, soit 48 cellules ;
- cinq separateurs horizontaux internes et sept verticaux internes ;
- taille apparente des rangees croissante vers le premier plan ;
- aucune couverture, architecture ou decoration sur les cellules ;
- tous les elements de couverture restent dans `tactics-tiles.webp`.

## QA visuelle

- `combat.webp` : lecture laterale, sol continu et centre de duel vide ;
- `melee.webp` : base et trois plateformes completement accessibles ;
- `melee-backdrop.webp` : profondeur Night City sans collision visuelle ;
- `rpg.webp` : vraie profondeur 2.5D et grande aire inferieure exploitable ;
- `tactics.webp` : grille lisible, perspective logique et premier plan large ;
- atlas : silhouettes completes, bords propres et aucune frange verte visible ;
- lot entier : aucun personnage, texte, logo, HUD, watermark ou asset officiel.

## Integrite du depot

Le dossier `public/backgrounds/lore-stages/cyberpunk-edgerunners/` contient
exactement les sept fichiers attendus. Cette passe ajoute uniquement ces sept
WebP et le present rapport, sans modifier les registres ou fichiers partages.
