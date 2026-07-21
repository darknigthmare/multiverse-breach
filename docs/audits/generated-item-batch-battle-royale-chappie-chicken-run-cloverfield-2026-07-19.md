# Audit OpenAI ImageGen - objets Battle Royale, Chappie, Chicken Run et Cloverfield

Date : 2026-07-19

## Périmètre

Ce lot contient exactement 16 icônes d'objets originales fan-made :

- Battle Royale : 4
- Chappie : 4
- Chicken Run : 4
- Cloverfield : 4

Aucun fichier de code, manifeste, registre d'assets, configuration, package,
musique ou stage n'a été modifié. Le lot ne contient que les 16 PNG demandés et
ce rapport.

## Méthode

- Recherche préalable de références officielles ou réputées pour chaque film.
- Une génération OpenAI ImageGen distincte par objet.
- Pixel art détaillé conçu pour rester lisible comme pickup et dans un HUD.
- Source générée sur fond chroma uniforme `#FF00FF`.
- Suppression locale du chroma avec matte douce, despill et contraction d'un
  pixel.
- Redimensionnement alpha-correct, centrage dans une boîte maximale de
  `420 x 420`, puis export `512 x 512`.
- Normalisation de tous les pixels totalement transparents vers
  `(0, 0, 0, 0)`.
- Inspection visuelle de chaque icône sur damier gris.

La première inspection a déclenché deux corrections ciblées :

- `tunnel-spoon.png` : remplacement du rendu trop réaliste par un pixel art à
  clusters nettement visibles ;
- `evacuation-badge.png` : suppression des pictogrammes humains et médicaux,
  puis remplacement du bord translucide contaminé par le chroma par un bord
  gris neutre.

Les deux corrections ont été retraitées, réinspectées et revalidées.

## Références visuelles et lore

### Battle Royale

- [Arrow Films - Battle Royale](https://www.arrowfilms.com/p/blu-ray/battle-royale/14844601/) :
  restauration approuvée par Kenta Fukasaku, collier explosif, armes et paquetage
  attribués aux élèves.
- [BFI - Battle Royale](https://www.bfi.org.uk/film/16be7003-2979-5dfd-8830-682cde584b01/battle-royale) :
  identification du film et de son incarnation de 2000.
- [IMDb - image du collier et du sac](https://www.imdb.com/title/tt0266308/mediaviewer/rm3737290753/) :
  silhouette portée du collier et paquetage visible dans le film.
- [PR Times / Filmarks - cartes d'armes du 25e anniversaire](https://prtimes.jp/main/html/rd/p/000000550.000008641.html) :
  référence officielle des 42 cartes d'armes distribuées lors de la reprise
  japonaise de 2025.

Choix de fidélité :

- le collier reprend une construction segmentée en acier, un verrou mécanique et
  un voyant rouge, sans cou, porteur ni violence ;
- la carte conserve la côte insulaire, la grille, les routes, le relief central
  et le repère rouge de l'école, sans noms ni coordonnées lisibles ;
- le sac est un paquetage en toile olive de période, sans numéro d'élève ;
- la carte d'arme est une interprétation de pickup inspirée du langage graphique
  officiel de 2025. Elle n'est pas présentée comme un prop distribué dans le film
  et ne reproduit ni texte, nom, logo ni mise en page officielle.

### Chappie

- [Sony Pictures - CHAPPiE](https://www.sonypictures.com/movies/chappie) :
  source studio pour le film, le Scout conscient et le contexte technologique.
- [Weta Workshop - Chappie](https://www.wetaworkshop.com/projects/chappie) :
  design et fabrication des robots, technologies, accessoires et MOOSE.
- [The Prop Tank - Original Guard Key Prop & Case](https://theproptank.com/original-guard-key-prop-case/) :
  forme et palette rouge-or de la Guard Key originale.
- [YourProps - Screenmatched Prototype Neurohelmet](https://yourprops.com/screenmatched-prototype-neurohelmet-original-movie-props-chappie-2015-yp836730) :
  casque prototype, visière bleue, câbles orange et construction asymétrique.
- [IMDb - résumé de Chappie](https://www.imdb.com/title/tt1823672/plotsummary/) :
  rôle de la Guard Key, du casque neural, du livre et de la sauvegarde de
  conscience.
- [IMDb - scène du mouton noir](https://www.imdb.com/title/tt1823672/characters/nm4375497/) :
  le récit d'Abel, mouton noir différent des autres.

Choix de fidélité :

- la clé USB reste un support improvisé et précieux, identifié par deux languettes
  colorées mais sans étiquette lisible ;
- la Guard Key reprend le rouge, l'or, la prise industrielle et les contacts du
  prop, sans sa boîte afin de conserver un seul objet ;
- la couverture du livre est une illustration originale du mouton noir, sans
  titre ni copie d'un livre publié ;
- le casque MOOSE reprend la visière bleue, la coque gris-bleu, les électrodes et
  les câbles orange, sans stencil, mannequin ni station de contrôle.

### Chicken Run

- [Aardman - Chicken Run](https://www.aardman.com/film-tv-games/chicken-run/) :
  source studio et galerie de la production en stop-motion de 2000.
- [Netflix Tudum - fin de Chicken Run](https://www.netflix.com/tudum/articles/chicken-run-ending-explained) :
  construction de l'avion de fortune à partir de bois et d'éléments des poulaillers.
- [MoMA - Chicken Run: Poultry in Motion](https://www.moma.org/explore/inside_out/2016/03/02/chicken-run-poultry-in-motion/) :
  plans d'évasion, rôle d'ingénieure de Mac, passé RAF de Fowler et avion artisanal.
- [Eye Filmmuseum - Chicken Run](https://www.eyefilm.nl/en/whats-on/chicken-run/800371) :
  plan d'évasion dessiné et matériaux visuels de l'atelier.
- [Royal Air Force - Great Escape 75](https://www.raf.mod.uk/news/articles/great-escape-75/) :
  référence historique de l'inspiration du film et usage de couverts comme outils
  de creusement.

Choix de fidélité :

- la cuillère est tordue, usée, couverte de terre et renforcée par un ruban rouge ;
- le plan bleu combine poulailler, clôture, tunnel et Old Crate avec uniquement
  des schémas et pictogrammes non lisibles ;
- la médaille de Fowler emploie une palette RAF et un motif original aile-hélice,
  sans chiffre, couronne, texte ni insigne officiel copié ;
- l'hélice est faite de bois de récupération, de plaques rapportées et de boulons
  dépareillés, cohérente avec l'Old Crate.

### Cloverfield

- [Paramount Pictures - Cloverfield](https://www.paramountpictures.com/movies/cloverfield) :
  source studio du film de 2008 et identification de Hud, Rob et Beth.
- [AFI Catalog - Cloverfield](https://catalog.afi.com/Film/64610-CLOVERFIELD) :
  référence institutionnelle du film et de sa production.
- [IMDb - Cloverfield FAQ](https://www.imdb.com/title/tt1060277/faq/) :
  caméscope tenu par Hud, matériel de tournage de période et ambiguïté
  caméscope/carte numérique.
- [Scénario de Drew Goddard](https://assets.scriptslug.com/live/pdf/scripts/cloverfield-2008.pdf) :
  photographie de remise de diplôme de Rob et Beth, caméra, évacuation militaire
  et extraction par hélicoptère.

Choix de fidélité :

- le caméscope reste un modèle grand public compact de 2008 sans marque ni image
  parasite sur l'écran ;
- la carte mémoire suit le carton d'ouverture qui décrit le support récupéré
  comme une carte numérique, malgré les dialogues parlant aussi de bande ;
- la photo est une composition originale reliant la remise de diplôme du scénario
  au souvenir de Coney Island, avec deux bustes sans visage identifiable et aucun
  personnage complet ;
- le badge d'évacuation n'est pas attesté comme prop isolé à l'écran. Il est
  explicitement traité comme un pickup fan-made cohérent avec l'hôpital de
  campagne et l'extraction militaire, sans faux sceau officiel.

## Contraintes communes des prompts

```text
Create exactly one complete collectible item icon.
Original fan-made art informed by reliable film references, never a copied
official asset. Highly detailed 32-bit pixel art with crisp deliberate pixel
clusters and a strong readable HUD silhouette. Keep the entire object centered
with generous padding. Perfectly flat #FF00FF chroma background with no shadow,
floor, gradient, halo or reflection. No complete character, hand, readable text,
letters, numbers, logo, watermark, UI frame, duplicate object or generic Nexus
relic.
```

Chaque prompt ajoutait la silhouette, les matériaux, la période et les détails
lore propres à l'objet concerné. Les documents, cartes et badges utilisent
uniquement des traits, blocs vides et pictogrammes abstraits non lisibles.

## Validation finale

- 16/16 fichiers présents aux chemins exacts.
- 16/16 en `512 x 512`, mode `RGBA`.
- 16/16 avec une plage alpha réelle de `0` à `255`.
- 16/16 avec les quatre coins à alpha `0`.
- 16/16 avec `0` pixel RGB non nul sous alpha `0`.
- 16/16 avec `0` pixel visible proche de `#FF00FF`.
- Marge minimale observée : `46 px`, supérieure aux `32 px` demandés.
- 16/16 avec un seul composant alpha significatif.
- Aucun objet, câble, sangle, feuille, ruban, clip ou pointe n'est tronqué.
- Aucun personnage complet, visage identifiable, texte lisible, logo, filigrane
  ou objet Nexus générique n'est présent.

`Marge` correspond au rectangle de tous les pixels dont l'alpha est non nul.
L'ordre est gauche/haut/droite/bas.

| Fichier | Marge | RGB sous alpha 0 | Proche #FF00FF | SHA-256 |
|---|---:|---:|---:|---|
| `battle-royale/explosive-collar.png` | 46/127/46/127 | 0 | 0 | `23bea6a51cce598e63f6b414b0d3f579d93cd08eb6b646ae682f810fc3eb0fa6` |
| `battle-royale/island-map.png` | 46/56/46/57 | 0 | 0 | `28b6c845a0bfa8b7a1b14b1054d9c09fb4cf5e8d36046432407c1f0d65caa564` |
| `battle-royale/survival-bag.png` | 51/46/52/46 | 0 | 0 | `071ea8f9df52e58a20ebc54f2187511acbd6182fc193ea1851fddf7c0b50ceaf` |
| `battle-royale/assigned-weapon-card.png` | 115/46/116/46 | 0 | 0 | `fb6f9bc0c3650b5d49beac099acee9c953b071be8fb40a9573415f31d68f4b04` |
| `chappie/consciousness-usb.png` | 46/80/46/80 | 0 | 0 | `83f2b5537285c683e2aad348dd1ed10dcd5d65fcaf5d42a8e2d76c2fadd278ea` |
| `chappie/guard-key.png` | 52/46/53/46 | 0 | 0 | `66e7ce035411bb6d94283f77b575219b619f9aadd5b4661fcad682d49884870b` |
| `chappie/children-s-book.png` | 61/46/62/46 | 0 | 0 | `900343bf4b62f242bf476d96a9546bd89128cba7b1bbf2762710e84eae83906b` |
| `chappie/moose-control-helmet.png` | 46/60/46/61 | 0 | 0 | `8bb23eef252ef3e13b525d8e1e0a1ab5c8b33208c6b4b405a88b8beb7cf5e01b` |
| `chicken-run/tunnel-spoon.png` | 67/46/67/46 | 0 | 0 | `54937c023db95639e7936b670a456cedb2f3fe1011218ceb556b56f25e3b902a` |
| `chicken-run/escape-blueprint.png` | 46/108/46/109 | 0 | 0 | `930808a151b9ab07ba82211e7d6bcb7a268050ead7e7e61b0cc31604efb21fb6` |
| `chicken-run/fowler-s-raf-medal.png` | 164/46/164/46 | 0 | 0 | `62ecbb526f2774338cb4459de66a161606347ad3b321efe0d63f706239527ce9` |
| `chicken-run/crate-plane-propeller.png` | 46/56/46/57 | 0 | 0 | `580a2a9eaae79fe6bdc2dae31b2bcab8128ed599449d63f3624c9235f7270e81` |
| `cloverfield/hud-s-camcorder.png` | 46/101/46/102 | 0 | 0 | `bede461759273ee237052dbc6791131d6930e1ac493c9889bad4b21a103222fe` |
| `cloverfield/memory-card.png` | 114/46/115/46 | 0 | 0 | `f855113b6f538d6492710744aa74c332bd7a4312555e41e6079e1041f8cf2032` |
| `cloverfield/rob-and-beth-photo.png` | 55/46/55/46 | 0 | 0 | `1963e78d457d679c4a2247d2a5ab5bd93a7105af8355c5158ad3f15d807933cb` |
| `cloverfield/evacuation-badge.png` | 119/46/120/46 | 0 | 0 | `1b41f46036287b0e3462a8fcabc4fbcb9f360b64628d25a0a20fe4af8f840c87` |

## Fichiers du lot

- `public/sprites/generated/items/battle-royale/explosive-collar.png`
- `public/sprites/generated/items/battle-royale/island-map.png`
- `public/sprites/generated/items/battle-royale/survival-bag.png`
- `public/sprites/generated/items/battle-royale/assigned-weapon-card.png`
- `public/sprites/generated/items/chappie/consciousness-usb.png`
- `public/sprites/generated/items/chappie/guard-key.png`
- `public/sprites/generated/items/chappie/children-s-book.png`
- `public/sprites/generated/items/chappie/moose-control-helmet.png`
- `public/sprites/generated/items/chicken-run/tunnel-spoon.png`
- `public/sprites/generated/items/chicken-run/escape-blueprint.png`
- `public/sprites/generated/items/chicken-run/fowler-s-raf-medal.png`
- `public/sprites/generated/items/chicken-run/crate-plane-propeller.png`
- `public/sprites/generated/items/cloverfield/hud-s-camcorder.png`
- `public/sprites/generated/items/cloverfield/memory-card.png`
- `public/sprites/generated/items/cloverfield/rob-and-beth-photo.png`
- `public/sprites/generated/items/cloverfield/evacuation-badge.png`
- `docs/audits/generated-item-batch-battle-royale-chappie-chicken-run-cloverfield-2026-07-19.md`

Les sources ImageGen et planches de contrôle n'ont jamais été placées dans le
dépôt. Les fichiers temporaires locaux de chroma et de contact sheet ont été
supprimés après validation.
