# Pack de stage Demon Slayer - OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Ce lot contient exactement sept WebP originaux fan-made pour l'univers
`Demon Slayer`, construits autour de trois ancrages visuels canoniques :

- l'architecture impossible de l'Infinity Castle ;
- la foret nocturne du mont Natagumo ;
- les toits et batiments Taisho du quartier des plaisirs.

Fichiers produits :

- `public/backgrounds/lore-stages/demon-slayer/combat.webp`
- `public/backgrounds/lore-stages/demon-slayer/melee.webp`
- `public/backgrounds/lore-stages/demon-slayer/melee-backdrop.webp`
- `public/backgrounds/lore-stages/demon-slayer/melee-platforms.webp`
- `public/backgrounds/lore-stages/demon-slayer/rpg.webp`
- `public/backgrounds/lore-stages/demon-slayer/tactics.webp`
- `public/backgrounds/lore-stages/demon-slayer/tactics-tiles.webp`

Chaque fichier a ete genere par un appel OpenAI ImageGen distinct. Les sources
officielles ont uniquement servi de references de direction artistique. Aucun
photogramme, sprite, texture ou asset officiel n'a ete copie dans le depot.

Aucun manifest, registre, prompt global, package, musique ou fichier de code
partage n'a ete modifie par cette passe.

## References officielles inspectees

### Infinity Castle

- [Site officiel US du film Infinity Castle](https://demonslayer-anime.com/infinitycastle/)
- [Introduction officielle et contexte de l'Infinity Castle](https://demonslayer-anime.com/infinitycastle/intro/)
- [Annonce officielle du trailer et du second visuel](https://demonslayer-anime.com/sva/news/?id=68226)
- [Visuel officiel direct, version web](https://demonslayer-anime.com/sva/news/SYS/CONTENTS/5e9e6131-0c65-4920-9280-c0b71f270b3b/w300)

Ces sources verrouillent les empilements verticaux de pieces en bois sombre,
les escaliers suspendus, les piliers rouges, les lanternes et la profondeur
spatiale impossible. Les compositions finales restent entierement originales.

### Mont Natagumo

- [Episode 15 officiel US - Mount Natagumo](https://demonslayer-anime.com/risshihen/story/15.html)
- [Episode 15 officiel japonais - Mont Natagumo](https://kimetsu.com/anime/risshihen/story/?story=15)
- [Photogramme officiel direct 1](https://kimetsu.com/anime/risshihen/assets/img/story/15/01.jpg)
- [Photogramme officiel direct 2](https://kimetsu.com/anime/risshihen/assets/img/story/15/02.jpg)
- [Photogramme officiel direct 3](https://kimetsu.com/anime/risshihen/assets/img/story/15/03.jpg)
- [Photogramme officiel direct 4](https://kimetsu.com/anime/risshihen/assets/img/story/15/04.jpg)

Ces references confirment la masse de cedres, la nuit bleue, la brume de
montagne et la menace organique. Les fils d'araignee n'ont pas ete places sur
les voies jouables afin de conserver une lecture de collision propre.

### Quartier des plaisirs

- [Introduction officielle Entertainment District Arc](https://demonslayer-anime.com/eda/intro/)
- [Episode 2 officiel - Infiltrating the Entertainment District](https://demonslayer-anime.com/eda/story/ep2.html)
- [Photogramme officiel direct 1](https://demonslayer-anime.com/eda/story/SYS/CONTENTS/story_2155_photo_163913010528959462)
- [Photogramme officiel direct 2](https://demonslayer-anime.com/eda/story/SYS/CONTENTS/story_2155_photo_1639130106009828372)
- [Photogramme officiel direct 3](https://demonslayer-anime.com/eda/story/SYS/CONTENTS/story_2155_photo_163913010651415008)
- [Photogramme officiel direct 4](https://demonslayer-anime.com/eda/story/SYS/CONTENTS/story_2155_photo_1639130107147763783)
- [Photogramme officiel direct 5](https://demonslayer-anime.com/eda/story/SYS/CONTENTS/story_2155_photo_1639130107829614820)

Ces pages valident la ville nocturne lumineuse, les facades en bois, les toits
de tuiles, les lanternes et le contraste chaud/froid du quartier Taisho.

## Direction visuelle commune

- medium : pixel art 32-bit detaille et net ;
- palette : indigo nocturne, vermillon, ambre, bois sombre et glycine violette ;
- architecture : Taisho japonaise et geometrie impossible de l'Infinity Castle ;
- profondeur : mont Natagumo et couches de ville dans la brume ;
- gameplay : surfaces de collision lisibles et zones centrales degagees ;
- interdits : personnage, demon, silhouette, animal, arme, sang, texte, logo,
  signaletique lisible, UI, HUD, watermark et asset officiel copie.

## Prompts resumes par fichier

| Fichier | Verrou ImageGen principal |
| --- | --- |
| `combat.webp` | Vue strictement laterale, terrasse continue, centre 1v1 libre, district nocturne et Infinity Castle au loin. |
| `melee.webp` | Toit principal continu et exactement trois plateformes elevees : deux auvents courts et un balcon central. |
| `melee-backdrop.webp` | Panorama de ville, montagne, brume et chateau suspendu, sans aucune geometrie jouable au premier plan. |
| `melee-platforms.webp` | Exactement huit plateformes laterales en deux colonnes sur quatre rangees, fond chroma `#00FF00`. |
| `rpg.webp` | Chambre de l'Infinity Castle en trois-quarts, avec les 55 % inferieurs libres pour le placement des combattants. |
| `tactics.webp` | Plateau complet en perspective elevee trois-quarts, exactement 8 colonnes par 6 rangees, quatre coins visibles. |
| `tactics-tiles.webp` | Exactement seize tuiles isometriques assorties en grille 4x4, fond chroma `#00FF00`. |

## Traitement des sorties

1. Les sept sources ont ete creees par sept appels OpenAI ImageGen separes.
2. Les quatre decors larges ont ete encodes en WebP RGB lossless.
3. Les sources `combat` et `melee`, livrees en 1670x941, ont recu une extension
   deterministe de deux colonnes par repetition des pixels de bord.
4. La source `melee-backdrop`, livree en 1671x941, a recu une seule colonne de
   bord supplementaire. Aucun redimensionnement filtrant n'a ete applique.
5. La source `tactics`, livree en 1449x1086, a ete recadree d'un pixel a droite
   pour atteindre exactement 1448x1086 sans deformer la grille.
6. Les deux atlas ont ete detoures avec le helper officiel du skill ImageGen :
   echantillonnage de bord, soft matte, seuil transparent 12, seuil opaque 220
   et despill.
7. Les cles mesurees etaient `#05f807` pour les plateformes et `#04f905` pour
   les tuiles tactiques.
8. Le RGB cache sous alpha 0 a ete force a `0,0,0`, puis les atlas ont ete
   encodes en WebP RGBA lossless.
9. Tous les fichiers ont ete reouverts depuis leurs chemins finaux pour la QA.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 854 234 | `6446b568705d4a3b267f504ed25e3594af009ba0f5ad8bfed669b74334b397b5` |
| `melee.webp` | 1672x941 | RGB | 1 969 572 | `0fe14425d924706b62b79621ce581f6f849c6f1b60b757024d505483353a5262` |
| `melee-backdrop.webp` | 1672x941 | RGB | 2 056 704 | `849b01ece4b9b7f7d77afaba0f5ceb74a033ac75afb155ae71d1c1b5a4d530b6` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 947 748 | `e135991c68fe4850bdcd11bbdeb9aaa3725fa2a5b822b5652a3ea4fd76fd99b9` |
| `rpg.webp` | 1672x941 | RGB | 2 122 536 | `611eb55602ba6c31b81e895ab2ea094983f01db503f1442f68f6ffe2bade3197` |
| `tactics.webp` | 1448x1086 | RGB | 2 295 648 | `75a280818820d7c92dfdd00b3232097f69e5971892ef50fd95b04371fc0a090a` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1 251 066 | `9ffcc01687b9e1436d0b0d2c3eeffb92055c16ffb8351e5333b5cd06d53ab5c4` |

## QA alpha et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB non nul sous alpha 0 | Chroma vert visible | Coins transparents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 047 703 | 30 241 | 494 572 | 0 | 0 | 4 / 4 |
| `tactics-tiles.webp` | 926 927 | 23 769 | 621 820 | 0 | 0 | 4 / 4 |

Segmentation par bandes alpha reelles :

- plateformes : 4 rangees, `2,2,2,2` elements, soit 8/8 ;
- gouttiere horizontale minimale des plateformes : 38 px ;
- gouttiere verticale minimale des plateformes : 95 px ;
- tuiles tactiques : 4 rangees, `4,4,4,4` elements, soit 16/16 ;
- gouttiere horizontale minimale des tuiles : 13 px ;
- gouttiere verticale minimale des tuiles : 14 px.

## QA grille tactique

- perspective : elevee trois-quarts/isometrique, jamais top-down ;
- axe long : 8 subdivisions jouables ;
- axe court : 6 subdivisions jouables ;
- total : 48 cases vides et comptables ;
- les quatre coins du plateau sont visibles ;
- les cases proches sont plus grandes que les cases lointaines ;
- aucun pilier, decor, cover ou accessoire ne chevauche une case.

## QA visuelle

- `combat.webp` : lecture laterale immediate, sol continu et centre libre ;
- `melee.webp` : sol principal et trois plateformes completement lisibles ;
- `melee-backdrop.webp` : profondeur de ville sans surface de collision parasite ;
- `rpg.webp` : profondeur 2.5D et grande zone basse de placement libre ;
- `tactics.webp` : plateau entier, 8x6, avec profondeur croissante vers l'avant ;
- atlas : 8 et 16 silhouettes completes, bords propres, aucune frange verte ;
- lot entier : aucun personnage, texte, logo, HUD, UI ou watermark detecte.

## Integrite du depot

Le dossier `public/backgrounds/lore-stages/demon-slayer/` contient exactement
les sept WebP demandes. Cette passe ajoute uniquement ces sept assets et le
present rapport d'audit, sans modifier les registres ou fichiers partages.
