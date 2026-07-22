# Pack de stage Ghostbusters 1984 - OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Ce lot contient exactement sept WebP originaux fan-made ancres sur le climax de
`Ghostbusters` (1984), au temple du rooftop de 55 Central Park West :

- `public/backgrounds/lore-stages/ghostbusters/combat.webp`
- `public/backgrounds/lore-stages/ghostbusters/melee.webp`
- `public/backgrounds/lore-stages/ghostbusters/melee-backdrop.webp`
- `public/backgrounds/lore-stages/ghostbusters/melee-platforms.webp`
- `public/backgrounds/lore-stages/ghostbusters/rpg.webp`
- `public/backgrounds/lore-stages/ghostbusters/tactics.webp`
- `public/backgrounds/lore-stages/ghostbusters/tactics-tiles.webp`

Chaque fichier a recu sa propre passe OpenAI ImageGen integree. Les references
Sony ont servi a verrouiller le lieu, la pierre gris-vert, les blocs monumentaux,
les parapets bas, la brume froide, la skyline nocturne et l'eclairage du rooftop.
Aucun photogramme ou asset officiel n'a ete copie dans le depot.

Aucun manifest, registre, fichier de code, audit global ou metadata Git n'a ete
modifie. Aucun commit, push ou deploiement n'a ete effectue.

## References Sony officielles inspectees

- [Sony Pictures US - Ghostbusters (1984)](https://www.sonypictures.com/movies/ghostbusters)
- [Sony Pictures Japan - Ghostbusters (1984), galerie officielle](https://www.sonypictures.jp/he/1271)
- [Sony Pictures Japan - photogramme rooftop officiel 1](https://www.sonypictures.jp/sites/default/files/2019-03/1271_photo_1.jpg)
- [Sony Pictures Japan - photogramme rooftop officiel 3](https://www.sonypictures.jp/sites/default/files/2019-03/1271_photo_3.jpg)
- [Sony Pictures - edition anniversaire et synopsis Central Park West](https://www.sonypictures.com/corp/press_releases/2014/06_14/060514_ghostbusters.html)

Les deux photogrammes rooftop montrent les gradins et parapets de pierre, la
skyline noire ponctuee de fenetres, la brume au sol et la lumiere froide du
climax. Le numero 55 et la direction sumero-art-deco viennent du brief canon du
lot; la page Sony confirme le portail dans l'immeuble de Central Park West.

## Direction visuelle commune

- environnement : temple sumero-art-deco au sommet du gratte-ciel, sans entite ;
- materiaux : pierre sombre gris-vert, cuivre oxyde, rainures geometriques ;
- profondeur : Manhattan nocturne et nuages d'orage derriere le rooftop ;
- lumiere : foudre bleu-blanc froide, cuivre chaud tres limite, brume pale ;
- medium : pixel art 32-bit detaille, net et original ;
- interdits : personnage, silhouette, Stay Puft, Gozer, Terror Dog, fantome,
  pack ou flux proton, texte, logo, UI, HUD, watermark et cadre.

## Prompts resumes par fichier

| Fichier | Verrou ImageGen principal |
| --- | --- |
| `combat.webp` | Camera frontale strictement laterale, temple symetrique, sol horizontal continu et centre de duel libre. |
| `melee.webp` | Vue laterale de plateforme avec une base large et exactement trois plateformes surelevees separees. |
| `melee-backdrop.webp` | Meme rooftop en panorama lointain, sans plateforme, passerelle, rebord de collision ni sol de premier plan. |
| `melee-platforms.webp` | Huit corniches jouables en vue laterale, quatre rangees de deux, sur chroma `#FF00FF` uniforme. |
| `rpg.webp` | Camera 2.5D peu plongeante, grande cour de combat libre sur les 55 % inferieurs et architecture en bordure. |
| `tactics.webp` | Vraie perspective elevee frontale trois-quarts, plateau entier, huit colonnes et six rangees, bas au premier plan. |
| `tactics-tiles.webp` | Seize tuiles et covers en perspective tactique coherente, grille 4x4 sur chroma `#FF00FF` uniforme. |

## Traitement des sorties

1. Les sept sources ont ete produites par des appels ImageGen distincts.
2. Les quatre decors RGB hors tactique etaient deja aux dimensions finales et
   ont ete encodes en WebP lossless sans redimensionnement ni delta de pixel.
3. Les deux atlas ont ete detoures avec le helper OpenAI ImageGen
   `remove_chroma_key.py`, echantillonnage de bord, soft matte, seuil transparent
   12, seuil opaque 220 et despill.
4. Les couleurs de cle mesurees etaient `#f703f6` pour les plateformes et
   `#f803f6` pour les tuiles tactiques.
5. Le RGB de chaque pixel dont l'alpha vaut zero a ete force a `0,0,0`, puis les
   atlas ont ete reencodes en WebP RGBA lossless avec preservation exacte.
6. La premiere tactique ImageGen avait 8x7 et a ete rejetee. Une correction
   ImageGen a fourni une base propre 8x5. Une seconde tentative a fourni 7x6 et
   a aussi ete rejetee. La base 8x5 a donc recu une seule rainure cuivre physique
   entre ses deux limites hautes, aux lignes `y=309..317`, pour garantir de facon
   deterministe le contrat final 8x6 sans toucher au decor ou aux colonnes.
7. Tous les WebP ont ete reouverts depuis leur chemin final avant la QA.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 620 162 | `01a88c29f2a972206b5e0be4043857bb0874a0f947d2e388ad7df9a7f5dc4928` |
| `melee.webp` | 1672x941 | RGB | 1 809 578 | `34af477df21e326c511d78e32851b610546561bc86fc5ed4ec87633c1060cb21` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 825 590 | `f6a2fbe6a24158f36f601c0fe3cd244219dc8466e582332487691507bbdbb2c3` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 637 980 | `93caf39c5a295aa1a8c9a5966ed66a16909904cf3a128ec12c52d7bb226e1281` |
| `rpg.webp` | 1672x941 | RGB | 1 962 010 | `179a92bd086be2c26befbd8db81f3a65ac8841b4e248aa2377b3ee589324e3c1` |
| `tactics.webp` | 1448x1086 | RGB | 2 041 540 | `c724466e79d3c6347847cde7111a06ddee1d7be9ce7b874b3a9b404ba7e82624` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 902 666 | `7954ac98ba4723cfa32801fa6dd985bb4ee0c56bf2017f47e894e5241761fb99` |

## QA alpha et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB non nul sous alpha 0 | Magenta visible | Coins transparents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 136 290 | 11 998 | 424 228 | 0 | 0 | 4 / 4 |
| `tactics-tiles.webp` | 1 070 175 | 17 338 | 485 003 | 0 | 0 | 4 / 4 |

Segmentation par bandes alpha reelles :

- `melee-platforms.webp` : 4 rangees, `2,2,2,2` elements, soit 8/8 ;
- gouttiere horizontale minimale plateformes : 81 px ; verticale : 125 px ;
- `tactics-tiles.webp` : 4 rangees, `4,4,4,4` elements, soit 16/16 ;
- gouttiere horizontale minimale tactique : 46 px ; verticale : 81 px ;
- les deux WebP RGBA sont bit-identiques aux mattes PNG normalisees apres
  remise a zero du RGB cache (`max delta = 0`).

Occupation alpha par element :

- plateformes : `57569,45396,48635,62931,40299,55049,84902,41445` ;
- tactique : `43578,40191,29306,29077,32142,30752,29680,30261,24020,24336,19612,21499,33241,39448,33518,41680`.

## QA grille tactique

- limites horizontales detectees : 7, donc exactement 6 rangees ;
- centres des limites : `266.5,313.0,364.0,465.0,580.0,706.0,865.0` ;
- hauteurs apparentes des rangees : `46.5,51.0,101.0,115.0,126.0,159.0` ;
- croissance vers le premier plan : valide ;
- separateurs verticaux internes detectes : 7, donc exactement 8 colonnes ;
- centres des separateurs : `270.0,412.0,549.0,689.0,826.0,961.5,1094.0` ;
- quatre coins du plateau visibles, 48 cellules libres et comptables, aucune
  couverture ou architecture sur une cellule.

## QA visuelle

- `combat.webp` : lecture frontale laterale, sol continu, centre 1v1 libre ;
- `melee.webp` : base et trois plateformes surelevees completement lisibles ;
- `melee-backdrop.webp` : profondeur skyline/brume sans plateforme jouable ;
- `rpg.webp` : vraie profondeur 2.5D et grande surface de placement libre ;
- `tactics.webp` : perspective elevee trois-quarts, rangees basses au premier plan ;
- atlas : silhouettes completes, bords propres, aucune frange magenta visible ;
- lot entier : aucun contenu interdit, texte, logo, UI ou watermark detecte.

## Integrite du depot

Le dossier `public/backgrounds/lore-stages/ghostbusters/` contient exactement
les sept fichiers attendus. Cette passe ajoute uniquement ces sept WebP et le
present rapport, en preservant tous les changements concurrents du depot.
