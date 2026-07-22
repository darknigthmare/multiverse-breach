# Pack de stages OpenAI - Chainsaw Man - 2026-07-22

## Perimetre

- Univers runtime : `Chainsaw Man`
- Slug : `chainsaw-man`
- Sorties : sept WebP originaux fan-made, un asset distinct par usage gameplay.
- Generation : outil OpenAI ImageGen integre, avec un appel dedie par sortie finale.
- Integrite : aucun photogramme, sprite, texture ou asset officiel n'a ete copie dans le depot.

## References officielles inspectees

- [Site officiel TV Chainsaw Man](https://www.chainsawman.dog/tvseries/)
- [Introduction officielle](https://www.chainsawman.dog/tvseries/introduction/)
- [Episodes officiels](https://www.chainsawman.dog/tvseries/episodes/)
- [Bibliotheque video officielle](https://www.chainsawman.dog/movie/)
- [Personnages et rattachement a la Securite publique](https://www.chainsawman.dog/tvseries/character/)

La page des episodes et la bibliotheque video officielles ont servi a verifier les
ancrages suivants : arrivee a Tokyo et architecture urbaine de l'episode 2,
menace du Demon-Flingue de l'episode 5, hotel boucle des episodes 6 et 7, et
atmosphere froide et traumatique de l'episode 8. Ces references ont uniquement
guide la direction artistique d'environnements originaux.

## Direction visuelle

- `combat` : rue de Tokyo humide apres une intervention de devil hunters ;
- `melee` : atrium d'hotel a repetitions impossibles, avec base et trois niveaux ;
- `melee-backdrop` : profondeur infinie de couloirs, balcons et escaliers boucles ;
- `rpg` : banlieue enneigee endommagee, inspiree du traumatisme du Demon-Flingue ;
- `tactics` : place civique de Tokyo convertie en plateau operationnel 8x6 ;
- atlas : beton, asphalte, hotel, garde-corps, neige et impacts surnaturels coherents.

Palette commune : beton gris, vert administratif sale, charbon, laiton, bordeaux,
ambre sodium limite et neige bleu-gris. Le medium est un pixel-art 32-bit net,
detaille et lisible, sans photorealisme ni flou pictural.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 730 156 | `1480a0b942b812d4696f27f761ed1f4311ee4676622a4ce8c0652ffb23b76aab` |
| `melee.webp` | 1672x941 | RGB | 1 821 858 | `6f01a9cb8d6da386ee12e90a37d290718160f57ade25ed731d35e347d2bacab1` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 519 978 | `42f7f62385b1691ecdf2980e2eaf28371bd20ec3a7a7c91d54ab75b1538f0ca5` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 677 128 | `ea2657b059f04920e3f0475a684306f32b58c1fa9e418bcb7d9a4c94fa5277cd` |
| `rpg.webp` | 1672x941 | RGB | 1 963 978 | `1532115efe71ffbc6826b8769675a1fcd40833db62a8c36fdeee19172b1b727e` |
| `tactics.webp` | 1448x1086 | RGB | 2 106 408 | `e11c214b546c93c8b3a6a74538deb6e24159f5c4b5783638ef48e85ceafc133e` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 875 466 | `69c7cf7d33071489e076e4914d4536fc2e154eee2b60a948df1192586fb46731` |

## Contraintes ImageGen

Chaque prompt a impose : environnement seul, composition originale, pixel-art
detaille, aucun personnage, silhouette, creature, corps, gore, texte, numero,
logo, HUD, UI, cadre ou watermark. Les decors RGB ont recu un cadrage dedie a
leur mode. Les atlas ont ete produits sur un chroma magenta plat et sans ombre.

## Post-traitement

1. Les sources RGB ont ete recadrees sans ajout de contenu, puis encodees aux
   dimensions contractuelles en WebP RGB lossless.
2. Les deux atlas ont ete detoures avec le helper officiel de la skill ImageGen :
   echantillonnage automatique de bord, soft matte, seuil transparent 12,
   seuil opaque 220 et despill.
3. Un seul composant physique principal a ete conserve dans chacune des cellules
   attendues afin d'eliminer toute poussiere chroma : `2x4` et `4x4`.
4. Les sorties atlas utilisent un alpha pixel-art dur, sans frange partielle.
5. Le RGB de tous les pixels totalement transparents a ete force a `0,0,0` et
   preserve avec l'encodage WebP exact.
6. Toutes les sorties ont ete reouvertes depuis leur chemin final apres encodage.

## QA alpha et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | Composants significatifs | Cellule minimale | Coins transparents | RGB cache | Magenta visible |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 189 354 | 0 | 383 162 | 8 | 35 858 px | 4/4 | 0 | 0 |
| `tactics-tiles.webp` | 1 077 759 | 0 | 494 757 | 16 | 19 628 px | 4/4 | 0 | 0 |

Surfaces des huit plateformes :
`59000, 50698, 49931, 49097, 48501, 45993, 44074, 35832` pixels.

Surfaces des seize modules tactiques :
`46280, 36378, 32847, 32032, 31244, 31169, 30440, 30364, 30307, 30260, 29726, 29596, 28829, 28625, 27032, 19628` pixels.

## QA visuelle et gameplay

- `combat.webp` : camera strictement laterale, sol continu et centre 1v1 libre ;
- `melee.webp` : base large, trois plateformes surelevees separees et air central lisible ;
- `melee-backdrop.webp` : architecture impossible distincte, sombre et sans HUD ;
- `melee-platforms.webp` : huit silhouettes completes, horizontales et non superposees ;
- `rpg.webp` : vraie vue trois-quarts laterale, sol inferieur libre et profondeur avant/arriere ;
- `tactics.webp` : camera tactique frontale trois-quarts, quatre coins visibles,
  exactement 8 colonnes par 6 rangees et 48 cellules vides ;
- `tactics-tiles.webp` : seize modules complets dans une grille 4x4, meme angle,
  meme echelle et meme eclairage que le plateau ;
- aucune personne, entite, chaine de texte, logo, interface ou watermark detecte.

## Integrite du depot

Cette passe ajoute uniquement les sept fichiers du dossier
`public/backgrounds/lore-stages/chainsaw-man/` et le present rapport. Aucun
manifest, fichier de code, profil musical, fichier de package ou autre univers
n'a ete modifie.
