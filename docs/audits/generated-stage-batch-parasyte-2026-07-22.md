# Pack de stages OpenAI - Parasyte - 2026-07-22

## Perimetre

- Univers runtime : `Parasyte`
- Slug : `parasyte`
- Dossier final : `public/backgrounds/lore-stages/parasyte/`
- Generation : outil OpenAI ImageGen integre, avec un appel distinct pour chacun
  des sept assets.
- Direction : decors pixel-art originaux et fan-made, sans copie d'un plan ou
  d'un asset officiel.
- Ancres : lycee Higashi/East Fukuyama, operation de l'hotel de ville et
  poursuite de Gotou dans la foret.

## References visuelles et lore

Les pages suivantes ont ete consultees avant la generation. Elles servent a
verifier les lieux, les evenements et l'ambiance ; les images finales restent
des compositions originales.

- [Site officiel VAP de Parasyte: The Maxim](https://www.vap.co.jp/kiseiju/index.html)
  : direction generale de la serie et navigation officielle.
- [Introduction officielle VAP](https://www.vap.co.jp/kiseiju/intro/)
  : cadre urbain, vie lyceenne de Shinichi et menace parasite dissimulee.
- [Episode 10 officiel VAP](https://www.vap.co.jp/kiseiju/story/10.html)
  : attaque de Shimada et transformation du lycee en zone de crise.
- [Episode 20 officiel VAP](https://www.vap.co.jp/kiseiju/sp/story/20.html)
  : debut de l'operation policiere et militaire contre le groupe de Hirokawa.
- [Episode 21 officiel VAP](https://www.vap.co.jp/kiseiju/sp/story/21.html)
  : fin de l'assaut de l'hotel de ville et intervention de Gotou.
- [Episode 22 officiel VAP](https://www.vap.co.jp/kiseiju/sp/story/22.html)
  : affrontement et fuite de Shinichi dans la montagne.
- [Episode 23 officiel VAP](https://www.vap.co.jp/kiseiju/sp/story/23.html)
  : retour dans la foret sombre pour le combat final contre Gotou.
- [Page officielle Kodansha du manga Parasyte](https://kodansha.us/series/parasyte/)
  : formes organiques, dissimulation des parasites et contraste entre quotidien
  humain et horreur biologique.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 465976 | `354896044c74a575709b8af2e21ceeb48e1001b279ef4094f93e7aa5efad8e16` |
| `melee.webp` | 1672x941 | RGB | 419378 | `9f6ff16b3e106341819aaea8511f5b7dfd1ecb0f64023706279d189e85d1998b` |
| `melee-backdrop.webp` | 1672x941 | RGB | 346450 | `5082bfba139e3b1303511bf854967be8d9dc7ec76d1e721dd8a5f74591df8e9e` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 777728 | `87f303bc4ee5972d5f2a99d6d74342375ece382d78557ffe01e417c99077d85b` |
| `rpg.webp` | 1672x941 | RGB | 693886 | `fef4db4ffd34134b76eb75323bf431769ffb0f87f67e4248caa35b8a019e7373` |
| `tactics.webp` | 1448x1086 | RGB | 554852 | `47215b6aabaad0ee332fca94fc18fa4838ce2c66f148310895ca9f884c7280c4` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 954460 | `83a18ae09903a7d161826302c3404443ea044baaf38938b395d6ef43d6668f6c` |

## Set final de prompts

Chaque prompt imposait un pixel-art 32-bit detaille, des silhouettes et materiaux
lisibles, ainsi que l'absence de personnage, texte, logo, HUD, watermark ou asset
officiel copie.

1. `combat.webp` : entree et atrium de l'hotel de ville apres l'evacuation,
   architecture civique japonaise en beton et verre, vue laterale, sol continu
   sur toute la largeur et centre libre pour un duel.
2. `melee.webp` : cour du lycee Higashi Fukuyama, facade en beton, passerelle,
   grillage de toit et vitres endommagees, vue strictement laterale, grande zone
   de deplacement sans plateforme dessinee dans le fond.
3. `melee-backdrop.webp` : panorama urbain de Fukuyama depuis le toit du lycee,
   quartiers residentiels, batiments civiques et montagne de Gotou en plusieurs
   plans de parallaxe, bande basse volontairement calme.
4. `melee-platforms.webp` : exactement huit plateformes laterales en quatre
   rangees de deux, combinant balcon scolaire, corniche civique, passerelle
   metallique, roche moussue, tronc, poutre technique et matiere parasite
   restraint, sur chroma plat `#FF00FF`.
5. `rpg.webp` : clairiere forestiere de la poursuite finale de Gotou, depot
   sauvage et abri en tole en retrait, angle trois-quarts lateral et vaste sol
   inferieur libre pour les positions avant/arriere du combat RPG.
6. `tactics.webp` : atrium et parvis civique en perspective tactique basse,
   plateau integral de huit colonnes sur six rangees, 48 cases comptables, quatre
   couvertures basses en bordure et quatre coins visibles.
7. `tactics-tiles.webp` : exactement seize modules en grille 4x4, meme perspective
   et meme eclairage que le plateau, avec sols civiques, couvertures, escalier,
   hauteur, seuil vitre, caisse, debris, hazard organique et drain, sur chroma
   plat `#FF00FF`.

## Post-traitement

1. Les sept generations OpenAI sont sorties directement aux dimensions finales ;
   aucun recadrage ni redimensionnement n'a ete necessaire.
2. Les deux atlas chroma ont ete detoures avec le helper installe
   `remove_chroma_key.py`, echantillonnage automatique du bord, soft matte,
   despill et contraction d'un pixel.
3. Les RGB sous alpha nul ont ete forces a `0,0,0`.
4. Les atlas ont ete encodes en WebP lossless avec l'option `exact`, afin de
   conserver ce nettoyage sous les pixels transparents.
5. Les cinq decors opaques ont ete encodes en WebP RGB qualite 96.
6. Tous les fichiers ont ete rouverts apres encodage pour verifier leur taille,
   leur mode et leur alpha reels.

## QA structurelle

| Controle | `melee-platforms.webp` | `tactics-tiles.webp` |
| --- | ---: | ---: |
| Pixels transparents | 1104720 | 1055701 |
| Pixels partiellement transparents | 30710 | 27573 |
| Pixels opaques | 437086 | 489242 |
| Coins transparents | 4/4 | 4/4 |
| Pixels magenta visibles | 0 | 0 |
| RGB non nul sous alpha 0 | 0 | 0 |
| Cellules occupees | 8/8 | 16/16 |
| Composants significatifs isoles | 8 | 16 |
| Couverture visible minimale par cellule | 40772 px | 19633 px |

Les sept fichiers correspondent exactement a leurs dimensions et modes demandes.
La carte Tactics montre neuf lignes de separation verticales pour huit colonnes
et sept lignes horizontales pour six rangees ; les 48 cases et les quatre coins
sont visibles.

## QA visuelle

- `combat.webp` : sol lateral continu, entree civique immediatement identifiable,
  zone centrale lisible et aucun obstacle de premier plan.
- `melee.webp` : grande cour traversable, fond distinct du plan de collision et
  aucune plateforme parasite integree au decor.
- `melee-backdrop.webp` : profondeur en couches et bande basse compatible avec
  les plateformes ajoutees par le moteur.
- `melee-platforms.webp` : huit silhouettes entieres, tops jouables lisibles,
  separations nettes et aucune frange chroma.
- `rpg.webp` : angle trois-quarts lateral, profondeur avant/arriere claire et
  plus d'un tiers inferieur disponible pour les combattants.
- `tactics.webp` : perspective isometrique basse, jamais top-down, grille 8x6
  comptable et couvertures limitees aux cases exterieures.
- `tactics-tiles.webp` : seize pieces completes, meme angle, meme echelle et meme
  palette que le plateau, sans chevauchement.
- Aucun personnage, monstre, silhouette, texte lisible, logo, HUD, UI, watermark
  ou cadre n'a ete detecte dans les sept sorties.

## Integrite du depot

Cette passe ajoute uniquement les sept fichiers du dossier Parasyte et ce rapport.
Elle ne modifie aucun manifest, prompt global, fichier de code, profil musical ou
package partage.
