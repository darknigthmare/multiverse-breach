# Pack de stages OpenAI - Death Note Yellow Box Warehouse - 2026-07-22

## Perimetre

- Univers runtime : `Death Note`
- Lieu : Yellow Box Warehouse, quai de Daikoku, Yokohama
- Slug : `death-note`
- Dossier final : `public/backgrounds/lore-stages/death-note/`
- Generation : outil OpenAI ImageGen integre, exactement un appel distinct pour
  chacun des sept fichiers, sans variante ni relance.
- Direction : decors pixel-art originaux et fan-made, fideles aux marqueurs du
  lieu sans copier un plan, une case, un asset ou un cadrage officiel.

## References visuelles et lore

Les sources ont ete consultees avant la generation. Elles servent a verifier le
lieu, la confrontation et les marqueurs architecturaux ; aucune image officielle
n'a ete reutilisee dans les fichiers finaux.

- [Nippon TV - histoires officielles des episodes 20 a 37](https://www.ntv.co.jp/deathnote/static/story2.html)
  : les episodes 35 et 36 fixent le rendez-vous final dans un entrepot du quai
  de Daikoku a Yokohama, puis l'episode 37 y conclut la confrontation.
- [Nippon TV - catalogue officiel Death Note](https://www.ntv.co.jp/english/pc/2011/03/death-note-1.html)
  : source officielle de la serie animee Madhouse en 37 episodes et de sa
  direction de thriller.
- [VIZ - Death Note, volume 12](https://www.viz.com/manga-books/manga/death-note-volume-12-0/product/1093)
  : edition officielle anglaise du volume qui conclut l'affrontement.
- [Death Note Wiki - Yellow Box Warehouse](https://deathnote.fandom.com/wiki/Yellow_Box_Warehouse)
  : recoupement secondaire de l'apparence, avec grande salle abandonnee,
  briques jaunies, caisses, futs, escalier et passerelle, toiture percee,
  pluie, flaques et entree unique ; la page renvoie au chapitre 98.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 633638 | `7d1113c8dd10284451356f040364b73d5cca3efe9ce3c745fed01bb11d5ec44a` |
| `melee.webp` | 1672x941 | RGB | 651806 | `5579fe536fab13af38a41e33e7381418eb0440374713f14338fe446c124fdb2f` |
| `melee-backdrop.webp` | 1672x941 | RGB | 460938 | `40c30ac10b7daca2701d6cf4b942072dad251d972e80b8ab33e9349d8d558d86` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 695962 | `bf09781225e82ff18be45c13850f137d65fc5742ce832d0217c6c4b7b56588c5` |
| `rpg.webp` | 1672x941 | RGB | 677346 | `b1d8b008b352a3dc52b7c79a47d056c9c858e36fffded6672108414ae599de8b` |
| `tactics.webp` | 1448x1086 | RGB | 668490 | `2bbc31cf4d65fb0620afffa5cc9e7230819e431154300a1337be154dc3253ef0` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1103648 | `e13d42b3f09f875d34df5f266bebfa96eadd8b1c297b8558649ed31d29ffa49d` |

## Set final de prompts

Tous les prompts imposaient un pixel-art 32-bit detaille, une composition
originale, la palette jaune/noire froide de l'entrepot et l'absence de
personnage, texte lisible, logo, HUD, UI, watermark ou asset officiel copie.

1. `combat.webp` : vaste nef laterale, briques jaunes usees, charpente noire,
   passerelle, toiture percee, pluie et flaques ; sol continu et libre sur toute
   la largeur, caisses et futs repousses vers les murs.
2. `melee.webp` : coupe laterale profonde de l'entrepot avec un sol bas continu,
   plusieurs plans de profondeur et des zones negatives lisibles pour les
   plateformes ajoutees par le moteur.
3. `melee-backdrop.webp` : perspective en six plans a travers les baies de
   l'entrepot vers le port pluvieux de Yokohama, grues lointaines et partie basse
   calme pour le compositing.
4. `melee-platforms.webp` : exactement huit plateformes laterales en matrice
   invisible 2x4, chacune complete et separee, sur chroma plat `#FF00FF`.
5. `rpg.webp` : vue trois-quarts laterale diagonale, vaste sol central, deux
   bandes naturelles de profondeur pour rendre les positions avant et arriere
   immediatement lisibles.
6. `tactics.webp` : plateau en perspective tactique trois-quarts basse, jamais
   top-down, exactement huit colonnes par six rangees, 48 cases et quatre coins
   visibles, sans obstacle dans la grille.
7. `tactics-tiles.webp` : exactement seize tuiles et obstacles en matrice
   invisible 4x4, meme angle et meme lumiere que le plateau, sur chroma plat
   `#FF00FF`.

Les carnets et preuves demandes sont representes uniquement par des dossiers
noirs fermes et des formes de papier creme sans lettre, ligne ou marque lisible.

## Post-traitement

1. Les sept sorties ImageGen ont ete produites directement aux dimensions
   finales ; aucun recadrage ni redimensionnement n'a ete applique.
2. Les deux atlas chroma ont ete detoures avec le helper installe
   `remove_chroma_key.py`, echantillonnage automatique du bord, soft matte,
   despill et contraction d'un pixel.
3. Les RGB sous alpha nul ont ete forces a `0,0,0`.
4. Les atlas ont ete encodes en WebP lossless avec `exact` pour conserver le
   nettoyage sous les pixels transparents.
5. Les cinq decors opaques ont ete encodes en WebP RGB qualite 96.
6. Tous les WebP ont ete rouverts apres encodage pour verifier taille, mode,
   alpha et integrite du contenu.

## QA structurelle

| Controle | `melee-platforms.webp` | `tactics-tiles.webp` |
| --- | ---: | ---: |
| Pixels transparents | 1151804 | 993093 |
| Pixels partiellement transparents | 23673 | 21839 |
| Pixels opaques | 397039 | 557584 |
| Coins transparents | 4/4 | 4/4 |
| Pixels magenta visibles | 0 | 0 |
| RGB non nul sous alpha 0 | 0 | 0 |
| Cellules occupees | 8/8 | 16/16 |
| Couverture visible minimale par cellule | 39804 px | 27764 px |

- `tactics.webp` presente neuf separateurs continus dans l'axe des colonnes et
  sept dans l'axe des rangees, bordures comprises : exactement 8 x 6, soit 48
  cases comptables.
- Les quatre coins du plateau sont visibles. Les cases arriere sont plus petites
  que les cases avant et la paroi du fond reste visible, ce qui confirme une
  perspective trois-quarts non top-down.
- Le masque alpha et l'inspection visuelle confirment une seule plateforme dans
  chacune des huit cellules de l'atlas Melee et une seule tuile ou un seul
  obstacle dans chacune des seize cellules de l'atlas Tactics.

## QA visuelle

- `combat.webp` : grande aire continue sans obstacle central, sol jouable sur
  toute la largeur et silhouette industrielle immediate.
- `melee.webp` : profondeur en couches, plancher bas stable et zones libres pour
  des plateformes de plusieurs hauteurs.
- `melee-backdrop.webp` : entrepot et port en parallaxe, sans geometrie de jeu au
  premier plan.
- `melee-platforms.webp` : huit silhouettes entieres, tops horizontaux lisibles,
  espacements nets et aucune frange chroma.
- `rpg.webp` : angle trois-quarts lateral, axe gauche-droite et positions
  avant/arriere clairement separees par la perspective du sol.
- `tactics.webp` : vraie perspective tactique basse, grille 8x6 non coupee,
  aucun obstacle dans les 48 cases.
- `tactics-tiles.webp` : seize pieces completes, coherentes en echelle, angle,
  lumiere et palette, sans chevauchement.
- Aucun personnage, silhouette humaine, creature, texte lisible, logo, HUD, UI,
  watermark, signature ou cadre n'est present dans les sept sorties.

## Integrite du depot

Cette passe ajoute uniquement les sept fichiers du dossier `death-note` et ce
rapport. Aucun manifest, registre, fichier de code, profil musical ou fichier
d'un autre agent n'a ete modifie. Aucun commit n'a ete cree.
