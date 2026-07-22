# Pack de stages OpenAI - Starship Troopers (1997) - 2026-07-22

## Perimetre

- Univers runtime : `Starship Troopers`
- Lieux directeurs : Klendathu, Tango Urilla et Whiskey Outpost sur Planet P
- Slug : `starship-troopers`
- Dossier final : `public/backgrounds/lore-stages/starship-troopers/`
- Generation : outil OpenAI ImageGen integre, un appel distinct par decor ou
  atlas final. Neuf appels ont ete effectues au total : sept appels initiaux,
  puis deux essais Tactics rejetes parce que leur grille contenait trop de
  cases. Aucun brouillon rejete n'est conserve dans le depot.
- Direction : decors pixel-art 32-bit originaux et fan-made, guides par les
  marqueurs visuels du film de 1997, sans reutiliser ni copier un plan, une
  texture ou un asset officiel.

## References visuelles et lore

Les sources ont ete consultees avant la generation. Elles ont servi uniquement
a verifier les lieux, la geologie, l'architecture et la lumiere.

- [Sony Pictures - Starship Troopers](https://www.sonypictures.com/movies/starshiptroopers)
  : page officielle confirmant le terrain desole de Klendathu, la flotte
  federale et le film de 1997.
- [American Society of Cinematographers - Interstellar Exterminators](https://theasc.com/article/starship-troopers-interstellar-exterminators/)
  : Hell's Half Acre et les Badlands ont fourni les canyons, formations
  rocheuses et couleurs sableuses ; l'article documente aussi le command center
  humain construit au fond des crevasses, la poussiere et les prises de vue
  propres destinees au compositing.
- [American Society of Cinematographers - Pest Control](https://theasc.com/article/pest-control-on-starship-troopers/)
  : reference du Fourth Brigade Compound de Planet P, de ses murs defensifs et
  de son exposition en plein jour.
- [Tippett Studio - Starship Troopers](https://www.tippett.com/portfolio/starship-troopers/)
  : confirmation de la production creature/VFX du film et des responsables
  artistiques, utilisee pour ne pas melanger le film avec les suites ou jeux.
- [AFI Catalog - Starship Troopers (1997)](https://catalog.afi.com/Catalog/moviedetails/61484)
  : identification du film, de Paul Verhoeven et du production designer Allan
  Cameron.
- [IMDb - lieux de tournage](https://www.imdb.com/title/tt0120201/locations/)
  : recoupement de Hell's Half Acre comme lieu de Whiskey Outpost.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 519116 | `69ff0ad6c023848c13f33f264412300df0207fa2f76e2e8113a433f9ae24e538` |
| `melee.webp` | 1672x941 | RGB | 581924 | `9773c48534b29eda25d510426f29aed87affc2c2dd9e2226b87004e19d07c81a` |
| `melee-backdrop.webp` | 1672x941 | RGB | 276738 | `456c9e18a49b0a7193662ffdedf31625b36f389982328e5fdf62933520ad3298` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 921748 | `6799e3fc1dfd14370a13c630e93570d6478f7f2d5238986ca5f00ab8b5194e58` |
| `rpg.webp` | 1672x941 | RGB | 569856 | `211d58c0cce26faae7df9aa4f750629c690cbd18c30471a5bc33a40465b7db4b` |
| `tactics.webp` | 1448x1086 | RGB | 458270 | `e8b07054f8c70f5923769b36adc588eef0d072e82b088056125e028a07024380` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 938064 | `52124f1a493254d75ae6ffd6b15b631cc1ab22a7621addbde03ec4d7d019110c` |

## Set final de prompts

Tous les appels imposaient un pixel-art 32-bit detaille, une composition
originale, la geologie brune aride, les fortifications utilitaires gris-vert
de la Mobile Infantry, ainsi que l'absence de personnage, Bug, corps, texte,
logo, HUD, drapeau lisible, watermark ou asset officiel copie.

1. `combat.webp` : cour de tir vide de Whiskey Outpost, sol horizontal continu,
   murs bas, gabions et caisses repousses aux bords, falaises et tunnels au fond.
2. `melee.webp` : coupe laterale d'un ravin de Klendathu, fortifications
   endommagees, sol bas continu et espaces negatifs pour les plateformes moteur.
3. `melee-backdrop.webp` : six plans de parallaxe a travers une vaste vallee,
   mesas, cretes volcaniques et avant-postes federaux tres lointains ; partie
   basse volontairement calme pour le compositing.
4. `melee-platforms.webp` : exactement huit plateformes laterales completes et
   separees, melant roche, rampes, passerelles, bunker et metal renforce, sur
   chroma plat `#FF00FF`.
5. `rpg.webp` : command-and-evacuation yard en vue trois-quarts laterale, deux
   bandes de combat naturelles et une grande zone centrale vide.
6. `tactics.webp` : environnement Tactics en vraie perspective trois-quarts,
   genere d'abord comme plateau entierement vierge afin de ne conserver aucune
   subdivision hallucinee. Une grille deterministe a ensuite ajoute exactement
   neuf limites de colonnes et sept limites de rangees : 8 x 6, soit 48 cases.
7. `tactics-tiles.webp` : exactement seize sols et obstacles en matrice 4 x 4,
   tous au meme angle tactique : sols roche/acier, tranchee, murs, caisses,
   barricade, bobine, projecteur, ventilation, tunnel, pont, mur detruit et zone
   d'extraction sans symbole, sur chroma plat `#FF00FF`.

## Post-traitement

1. Les quatre decors larges ont ete encodes en WebP RGB qualite 96 sans
   redimensionnement.
2. Le plateau Tactics final est issu d'une generation OpenAI vierge. Sa source
   de 1449x1086 a ete recadree d'un pixel a droite vers 1448x1086, puis la
   grille perspective exacte a ete tracee localement. Les deux premieres
   generations avec un mauvais compte de cases ont ete ecartees.
3. Les deux atlas ont ete detoures avec le helper installe
   `remove_chroma_key.py`, echantillonnage automatique du bord, soft matte,
   despill et contraction d'un pixel.
4. Les RGB sous alpha nul ont ete forces a `0,0,0`.
5. Les atlas ont ete encodes en WebP lossless avec `exact` pour conserver le
   nettoyage des pixels transparents.
6. Tous les WebP ont ete rouverts apres encodage et verifies aux dimensions et
   modes finaux demandes.

## QA structurelle

| Controle | `melee-platforms.webp` | `tactics-tiles.webp` |
| --- | ---: | ---: |
| Pixels transparents | 1018601 | 1054508 |
| Pixels partiellement transparents | 20291 | 16991 |
| Pixels opaques | 533624 | 501017 |
| Coins transparents | 4/4 | 4/4 |
| Pixels magenta visibles | 0 | 0 |
| RGB non nul sous alpha 0 | 0 | 0 |
| Composants visibles de plus de 100 px | 8 | 16 |
| Cellules 4x4 occupees | sans objet supplementaire | 16/16 |
| Couverture minimale d'une cellule 4x4 | n/a | 18313 px |

- Les huit plateformes sont huit composants alpha separes, entiers et non
  coupes ; aucun fragment parasite de plus de 100 pixels n'est present.
- Les seize tuiles sont seize composants alpha separes, avec exactement une
  piece dans chacune des seize cellules de l'atlas.
- `tactics.webp` contient neuf limites continues dans l'axe des colonnes et
  sept dans l'axe des rangees, bordures comprises : exactement 8 x 6. Les
  espaces arriere sont plus courts que les espaces avant, ce qui maintient la
  profondeur trois-quarts.

## QA visuelle

- `combat.webp` : sol continu et central libre, lecture immediate du fortin et
  de la roche aride.
- `melee.webp` : vue strictement laterale, plancher accessible et profondeur
  suffisante pour les plateformes separees du moteur.
- `melee-backdrop.webp` : six plans lisibles, aucun premier plan jouable et
  aucune silhouette cachee.
- `melee-platforms.webp` : huit silhouettes distinctes, sommets praticables,
  aucune frange chroma.
- `rpg.webp` : angle trois-quarts lateral, deux plans de placement et accessoires
  maintenus hors des zones d'unites.
- `tactics.webp` : vraie vue tactique trois-quarts, quatre coins visibles,
  48 cases vides, aucun obstacle sur le plateau.
- `tactics-tiles.webp` : seize pieces coherentes en echelle, perspective,
  lumiere et palette, sans chevauchement.
- Aucun personnage, soldat, creature, Arachnide, texte lisible, logo, HUD, UI,
  watermark, signature ou drapeau lisible n'apparait dans les sept fichiers.

## Integrite du depot

Cette passe ajoute uniquement les sept fichiers du dossier
`public/backgrounds/lore-stages/starship-troopers/` et le present rapport.
Aucun manifest, registre, fichier de code, profil musical ou fichier d'un autre
agent n'a ete modifie. Aucun commit n'a ete cree.
