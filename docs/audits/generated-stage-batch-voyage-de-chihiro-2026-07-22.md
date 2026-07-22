# Pack de stage Voyage de Chihiro - OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Cette passe produit exactement sept WebP originaux fan-made pour le stage
`voyage-de-chihiro`, centre sur les bains Aburaya et l'acces a la chaufferie :

- `public/backgrounds/lore-stages/voyage-de-chihiro/combat.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/melee.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/melee-backdrop.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/melee-platforms.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/rpg.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/tactics.webp`
- `public/backgrounds/lore-stages/voyage-de-chihiro/tactics-tiles.webp`

Chaque fichier a recu exactement un appel OpenAI ImageGen integre distinct,
soit sept appels pour sept fichiers. Les references officielles ont uniquement
servi a verrouiller l'identite des lieux. Aucun photogramme, sprite, texture ou
asset officiel n'a ete copie dans le depot.

Aucun manifest, registre, fichier de code, package, musique ou fichier produit
par un autre agent n'a ete modifie par cette passe.

## References officielles Studio Ghibli inspectees

- [Page officielle du film et galerie de 50 photogrammes](https://www.ghibli.jp/works/chihiro/)
- [Annonce officielle de la mise a disposition des photogrammes](https://www.ghibli.jp/info/013344/)
- [Aburaya nocturne et ses galeries](https://www.ghibli.jp/gallery/chihiro011.jpg)
- [Pont vermillon et tablier en bois](https://www.ghibli.jp/gallery/chihiro020.jpg)
- [Atelier bas et sol de la chaufferie](https://www.ghibli.jp/gallery/chihiro037.jpg)
- [Rails immerges et traverses](https://www.ghibli.jp/gallery/chihiro041.jpg)
- [Interieur du train sur l'eau](https://www.ghibli.jp/gallery/chihiro042.jpg)
- [Train et plaine inondee](https://www.ghibli.jp/gallery/chihiro043.jpg)
- [Pont, coursives et entree des bains](https://www.ghibli.jp/gallery/chihiro048.jpg)
- [Journal officiel sur le bain public Aburaya et ses inspirations](https://www.ghibli.jp/storage/diary/000060/)

Les photogrammes `011`, `020` et `048` verrouillent la masse verticale des
bains, les garde-corps vermillon, le bois sombre, les toits et les lanternes
chaudes. Le photogramme `037` confirme l'echelle basse, les planchers et
l'encombrement technique de la chaufferie. Les photogrammes `041` a `043`
fixent les rails, l'eau miroir et la silhouette du train.

Le journal officiel precise qu'Aburaya ne vient pas d'un modele unique :
plusieurs bains ont nourri sa conception, avec notamment Kodakarayu et une
part de Dogo Onsen. Le pack conserve donc ces marqueurs sans reproduire un
plan du film ni un batiment reel a l'identique.

## Direction visuelle commune

- medium : pixel art 32-bit detaille, net et original ;
- palette : vermillon, bois brun-noir, ambre, cuivre vieilli, charbon et bleu
  sarcelle nocturne ;
- architecture : pont et coursives d'Aburaya, galeries de service, conduites,
  chaudieres, grilles et cheminees ;
- lumiere : lanternes chaudes et foyers de chaufferie contre une nuit humide ;
- gameplay : surfaces de collision lisibles, centre degage et profondeurs
  avant/arriere separees ;
- interdits : personnage, esprit, creature, visage, silhouette, texte lisible,
  glyphe, sigle, logo, HUD, UI, bordure, watermark et plan officiel copie.

## Verrou par fichier

| Fichier | Verrou ImageGen et gameplay |
| --- | --- |
| `combat.webp` | Vue laterale stricte de l'entree nocturne, pont et plancher continu sur toute la largeur, centre 1v1 libre. |
| `melee.webp` | Cour de service laterale, sol continu et exactement trois surfaces integrees accessibles par echelles ou escaliers. |
| `melee-backdrop.webp` | Panorama profond des bains, plomberie et voie ferree sur l'eau, sans geometrie jouable proche. |
| `melee-platforms.webp` | Exactement huit plateformes laterales isolees, deux colonnes par quatre rangees, sur chroma magenta uniforme. |
| `rpg.webp` | Acces chaufferie en vraie perspective trois-quarts, premier plan large, milieu transversal et chaudieres en arriere-plan. |
| `tactics.webp` | Deck de service au-dessus de l'eau en perspective tactique trois-quarts, exactement huit colonnes par six rangees. |
| `tactics-tiles.webp` | Exactement seize tuiles ou obstacles connectes a leur base, quatre colonnes par quatre rangees, sur chroma magenta uniforme. |

## Traitement des sorties

1. Les sept sources ont ete creees par sept appels ImageGen separes, un appel
   par fichier et sans regeneration.
2. Les quatre decors larges `combat`, `melee`, `melee-backdrop` et `rpg`
   etaient directement en `1672x941`.
3. La source tactique etait en `1449x1086`. Une seule colonne a droite a ete
   retiree pour atteindre `1448x1086`, sans redimensionnement ni filtrage.
4. Les cinq decors ont ete encodes en WebP RGB lossless.
5. Les deux atlas etaient directement en `1254x1254`. Le helper officiel du
   skill ImageGen a applique auto-key sur le bord, soft matte, seuil transparent
   12, seuil opaque 220, despill et contraction de bord de 1 px.
6. Les cles mesurees etaient `#F903F9` pour les plateformes et `#F902F9` pour
   les tuiles tactiques.
7. Le RGB cache sous alpha 0 a ete force a `0,0,0`, puis les atlas ont ete
   encodes en WebP RGBA lossless avec conservation exacte des pixels.
8. Tous les controles ci-dessous ont ete relances depuis les sept chemins
   WebP finaux.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 831 874 | `f9e43202c624b7fa3dfbe143709bc7d079894bff71c0943eb7a050c6e271c8a8` |
| `melee.webp` | 1672x941 | RGB | 1 823 480 | `9f00eb46ca911dec03b1931a263b4c65378a2184212fe61b4937222f710b7484` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 416 114 | `ddc843d85a6ffcad4ced116c9a0983235a8af85dfcab185d39e4a194e6a139a4` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 802 496 | `5b4e4fe514c30ec3c57c4e2fd6c33e5c73f36f33ecd6e5268a67fd87b5d240b5` |
| `rpg.webp` | 1672x941 | RGB | 2 021 508 | `7af69c0bfdd5ff4f90c0ba876e1567faefae0263c708e5aaba7d5bf19f22ccdd` |
| `tactics.webp` | 1448x1086 | RGB | 2 049 494 | `f2d55e68220a9146a5dd3661762f8c5a5deb319f4291290965b3eadb041dee29` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1 246 668 | `9b3173631d434bb084fdefbdfde4a3e5aefdd7f9e6187cf663c34a9a6ced938e` |

## QA alpha et chroma

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB non nul sous alpha 0 | Magenta visible | Bord visible | Coins transparents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 079 638 | 40 222 | 452 656 | 0 | 0 | 0 | 4 / 4 |
| `tactics-tiles.webp` | 897 949 | 20 771 | 653 796 | 0 | 0 | 0 | 4 / 4 |

Segmentation par projections alpha reelles, avec seuil `alpha > 32` :

- plateformes : 4 rangees, `2,2,2,2` groupes, soit 8/8 ;
- cellules d'atlas occupees : 8/8 ;
- gouttiere horizontale minimale des plateformes : 74 px ;
- gouttiere verticale minimale des plateformes : 77 px ;
- tuiles tactiques : 4 rangees, `4,4,4,4` groupes, soit 16/16 ;
- cellules d'atlas occupees : 16/16 ;
- gouttiere horizontale minimale des tuiles : 14 px ;
- gouttiere verticale minimale des tuiles : 12 px.

## QA grille tactique

- camera : vue elevee trois-quarts, jamais top-down ;
- empreinte : trapeze rectangulaire oriente vers l'ecran, quatre coins visibles ;
- axe long : 9 limites convergentes, donc exactement 8 colonnes ;
- axe court : 7 limites transversales, donc exactement 6 rangees ;
- total : 48 cases vides, distinctes et comptables ;
- profondeur : les cases proches sont plus grandes que les cases lointaines ;
- obstruction : aucune conduite, lanterne, architecture, voie ou train ne
  chevauche une case.

## QA visuelle

- `combat.webp` : sol continu bord a bord, centre libre et lecture laterale ;
- `melee.webp` : base continue, trois passerelles accessibles et horizontales ;
- `melee-backdrop.webp` : profondeur de bains et train lointain sans surface
  de collision parasite au premier plan ;
- `rpg.webp` : premier plan, plan median et fond de chaufferie nettement separes ;
- `tactics.webp` : perspective trois-quarts et grille 8x6 lisible sans zoom ;
- atlas : huit plateformes et seize groupes tactiques complets, aucun contact
  avec un bord et aucune frange magenta ;
- lot entier : aucun personnage, esprit, creature, silhouette, texte lisible,
  logo, sigle, HUD, UI ou watermark detecte.

## Integrite du depot

Le dossier `public/backgrounds/lore-stages/voyage-de-chihiro/` contient
exactement les sept WebP demandes. Cette passe ajoute uniquement ces sept
assets et le present audit. Les sources ImageGen, chromas detoures, planches de
controle et references temporaires ont ete supprimes apres validation. Aucun
commit n'a ete cree.
