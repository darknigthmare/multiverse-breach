# Pack de stages Tremors 1990 - OpenAI ImageGen QA final

Date : 2026-07-22

## Perimetre

Ce lot contient exactement sept decors originaux fan-made en pixel art 32-bit :

- `public/backgrounds/lore-stages/tremors/combat.webp`
- `public/backgrounds/lore-stages/tremors/melee.webp`
- `public/backgrounds/lore-stages/tremors/melee-backdrop.webp`
- `public/backgrounds/lore-stages/tremors/melee-platforms.webp`
- `public/backgrounds/lore-stages/tremors/rpg.webp`
- `public/backgrounds/lore-stages/tremors/tactics.webp`
- `public/backgrounds/lore-stages/tremors/tactics-tiles.webp`

Les sept images ont ete produites par sept appels distincts au mode integre
OpenAI ImageGen. Les references officielles ont servi a verrouiller le lieu,
la geographie, les materiaux et la mise en scene du film de 1990. Aucun
photogramme, personnage, Graboid ou asset officiel n'a ete copie.

Aucun manifeste, registre, fichier de code, package ou metadata Git n'a ete
modifie. Aucun audit global, commit, push ou deploiement n'a ete effectue.

## References Universal et Stampede

- [Universal Pictures At Home - Tremors](https://www.universalpicturesathome.com/movies/tremors)
- [Stampede Entertainment - Tremors (1990)](https://stampede-entertainment.com/site/store/tremors/tremors-1990/)
- [Stampede Entertainment - lieux de tournage](https://stampede-entertainment.com/site/ufaqs/where-were-the-tremors-films-shot/)
- [Stampede Entertainment - orientation de Perfection Valley](https://stampede-entertainment.com/site/ufaqs/which-way-does-perfection-valley-run/)
- [Stampede Entertainment - rochers et lieux de Tremors](https://stampede-entertainment.com/site/ufaqs/we-want-to-go-to-the-tremors-locations-can-you-help-us/)

Universal confirme Perfection comme une ville deserte du Nevada menacee par
des mouvements souterrains et la necessite de gagner les hauteurs. Stampede
precise le tournage aride autour de Lone Pine, les Sierra derriere Perfection,
les falaises au nord, les montagnes laterales, Chang's Market au bord de la
rue principale et l'usage de rochers reels ou construits comme refuges.

## Direction visuelle originale

- epoque : petite ville rurale americaine de 1990, sans element moderne ;
- architecture : facade de market en bois rouge use, baraques isolees,
  toitures en tole, chateau d'eau et poteaux telephoniques ;
- terrain : sable ocre, hardpan fissure, granite pale, falaises seches et
  traces discretes de secousses sous le sol ;
- lumiere : soleil sec et dur de fin de matinee, ombres courtes, ciel bleu ;
- palette : ocre, ambre poussiereux, bois rouge-brun, acier galvanise,
  rouille, sauge sourde et granite clair ;
- interdits globaux : Graboid, tentacule, personnage, silhouette, animal,
  texte lisible, logo, branding, UI, HUD, watermark et cadre.

Les panneaux de facade restent volontairement vierges pour conserver la
silhouette de Chang's Market sans introduire de texte dans les assets.

## Verrous ImageGen par fichier

| Fichier | Verrou final |
| --- | --- |
| `combat.webp` | Camera laterale stricte a hauteur humaine, rue continue sur toute la largeur et centre de duel libre. |
| `melee.webp` | Vue laterale distincte de Perfection, espace central et 40 % inferieurs ouverts pour les plateformes runtime, sans plateforme flottante integree. |
| `melee-backdrop.webp` | Panorama parallax distant uniquement, sans rebord, toit, rocher ou plateforme jouable au premier plan. |
| `melee-platforms.webp` | Huit plateformes laterales isolees en grille 2x4 : rochers, toits, porche, catwalk, dalle et plaque routiere. |
| `rpg.webp` | Perspective 2.5D peu plongeante a environ 20 degres, avec une grande aire centrale et inferieure jouable. |
| `tactics.webp` | Vraie perspective elevee frontale trois-quarts a 30-35 degres, grille exacte de 8 colonnes par 6 rangees. |
| `tactics-tiles.webp` | Seize tuiles et couvertures isolees en grille 4x4, avec angle, echelle et lumiere coherents. |

## Traitement des sorties

1. sept generations independantes avec OpenAI ImageGen integre ;
2. inspection visuelle de chaque source avant integration ;
3. livraison ImageGen directe aux dimensions finales, sans redimensionnement ;
4. export WebP lossless en RGB strict pour les cinq decors opaques ;
5. generation des deux atlas sur chroma magenta uniforme ;
6. detourage avec le helper OpenAI ImageGen `remove_chroma_key.py`,
   echantillon de bord, soft matte, seuil transparent 12, seuil opaque 220 et
   despill ;
7. remise a zero du RGB sous alpha nul et reexport WebP lossless avec
   preservation `exact` des couleurs transparentes ;
8. reouverture et inspection des sept WebP depuis leur chemin projet.

Couleurs chroma detectees par le helper :

- `melee-platforms.webp` : `#F903F9` ;
- `tactics-tiles.webp` : `#F902F9`.

Aucune source ImageGen, image de reference, matte intermediaire, grille-guide
ou planche contact n'est conservee dans le depot.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 2 020 506 | `315a5cbe05d0288914725c4e8f7b02a15bc32c2682baf55ed8965d6ce8c38bef` |
| `melee.webp` | 1672x941 | RGB | 2 084 368 | `b867face3d98d60b72d2d381fdf461b839e22850ca995d9d5802873090c8be29` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 862 728 | `08c567f88298a26660bd0509dab7581fc276466e750f332c4cdc52d9ead41c33` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 836 638 | `593308d52515e9d935ed81848417c9e03bb3a9eb6ebf0ae8a14cda4332378ea9` |
| `rpg.webp` | 1672x941 | RGB | 2 378 762 | `4cdd1e81131f4e1e6bf8f221a1c3f46afc781acd067ca5d4e807408c808a7d05` |
| `tactics.webp` | 1448x1086 | RGB | 2 215 780 | `aa286970b910c77991f7a6f5b7f17be23c44184d947a098e5570ef94364b1d7a` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1 294 752 | `2ead5c864c0fb4ad1221a1d03b0f283ab7b133bed3ef9da49e98db91952a3eaa` |

## Validation alpha et cellules

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB sous alpha 0 | Magenta visible | Coins transparents | Cellules non vides |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 102 787 | 24 801 | 444 928 | 0 | 0 | 4 / 4 | 8 / 8 |
| `tactics-tiles.webp` | 926 163 | 21 007 | 625 346 | 0 | 0 | 4 / 4 | 16 / 16 |

Occupation alpha par cellule :

- Melee : `61995, 57234, 58091, 62591, 66144, 40592, 61909, 61173` ;
- Tactics : `44559, 44058, 44816, 44680, 39169, 40901, 47559, 36893, 40520, 38551, 43729, 43580, 29747, 35534, 29559, 42498`.

Les atlas possedent un alpha compris entre 0 et 255, quatre coins totalement
transparents, aucun cache RGB sous alpha nul, aucune contamination magenta
visible et aucune cellule vide.

## Validation de la grille tactics

- quatre coins du plateau visibles ;
- neuf limites verticales continues, soit huit colonnes ;
- sept limites horizontales continues, soit six rangees ;
- quarante-huit cellules vides et comptables ;
- aucune subdivision, diagonale ou ligne supplementaire ;
- les deux rangees basses occupent le premier plan et sont plus profondes que
  les rangees eloignees ;
- perspective frontale trois-quarts, ni vue du dessus ni vue isometrique ;
- marquage physique en petits cailloux, sans aspect de surcouche UI.

## Inspection visuelle finale

- `combat.webp` conserve une surface de duel laterale continue et libre ;
- `melee.webp` laisse l'air central et le sol ouverts pour les plateformes
  separees du runtime ;
- `melee-backdrop.webp` ne contient aucune plateforme jouable integree ;
- les huit plateformes sont entieres, horizontales, separees et sans frange
  magenta ;
- `rpg.webp` preserve une grande aire 2.5D pour les placements avant/arriere
  et gauche/centre/droite ;
- `tactics.webp` montre exactement la grille 8x6 demandee avec les rangees
  proches au premier plan ;
- les seize modules tactiques sont complets, separes et coherents avec la
  camera du plateau ;
- les sept images montrent Perfection Valley, la facade de market, le sol
  fissure, les rochers-refuges, le chateau d'eau, les poteaux ou les baraques
  selon leur fonction de gameplay ;
- aucune sortie ne contient de Graboid visible, personnage, silhouette,
  texte, logo, UI, HUD, watermark ou bordure parasite.

Resultat : `TREMORS_1990_STAGE_BATCH_QA_VALID`

## Integrite du depot

Seuls les chemins demandes ont ete ecrits par cette implementation :

- `public/backgrounds/lore-stages/tremors/`
- `docs/audits/generated-stage-batch-tremors-2026-07-22.md`

Les modifications concurrentes deja presentes dans le worktree ont ete
laissees intactes.
