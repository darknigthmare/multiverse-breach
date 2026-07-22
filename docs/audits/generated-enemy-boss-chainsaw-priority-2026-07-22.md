# Lot prioritaire de boss Chainsaw Man genere par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Trois appels OpenAI ImageGen integres et independants ont produit trois
plaquettes originales fan-made. Les visuels officiels cites ci-dessous ont
servi uniquement a verrouiller les silhouettes, anatomies, palettes et attaques.
Aucun pixel officiel n'est copie dans les fichiers livres.

Chaque sortie finale est un PNG `RGBA` transparent de `1024x1024`, decoupe en
grille exacte `4x4` de cellules `256x256` :

| Ligne | Fonction | Frames |
|---|---|---:|
| 1 | idle et menace | 4 |
| 2 | locomotion | 4 |
| 3 | attaques et special lore | 4 |
| 4 | hit, stagger et defaite | 4 |

| Entite | Continuite retenue | Fichier final |
|---|---|---|
| Bat Devil | anime TV 2022, affrontement des episodes 3 et 4 | `public/sprites/generated/bosses/chainsaw-man/bat-devil.png` |
| Eternity Devil | anime TV 2022, manifestation de l'hotel Morin des episodes 6 et 7 | `public/sprites/generated/bosses/chainsaw-man/eternity-devil.png` |
| Bomb Devil Reze | film *Chainsaw Man - The Movie: Reze Arc*, forme hybride Bomb | `public/sprites/generated/bosses/chainsaw-man/bomb-devil-reze.png` |

## References officielles inspectees

### Bat Devil

- [Site officiel TV - episode 3, Nyako no Yukue](https://www.chainsawman.dog/news/221025_01/), avec bande-annonce et images d'avant-premiere ;
- [Index officiel des episodes TV](https://chainsawman.dog/tvseries/episodes/), utilise pour conserver la continuite des episodes 3 et 4 ;
- [Site officiel TV - staff et conception des demons](https://chainsawman.dog/tvseries/staffcast/), qui attribue le design des demons a Kiyotaka Oshiyama.

Verrou visuel : immense demon chauve-souris humanoide, corps massif de chair
gris-brun, fourrure pale a la nuque, longues oreilles pointues, petits yeux
rouges, gueule demesuree, griffes et grandes ailes membraneuses sombres. Les
attaques restent le coup de griffe, la morsure, le battement d'ailes et l'onde
sonique emise par la bouche.

### Eternity Devil

- [Site officiel TV - episode 6, Denji wo Korose](https://chainsawman.dog/news/221115_01/), avec bande-annonce et images de l'hotel boucle ;
- [Site officiel TV - episode 7, Kiss no Aji](https://www.chainsawman.dog/news/221122_01/), conclusion de l'affrontement ;
- [Blu-ray officiel volume 2](https://www.chainsawman.dog/tvseries/bddvd/), qui confirme le regroupement canonique des episodes 4 a 6.

Verrou visuel : une seule masse recursive connectee de membres, visages, yeux,
bouches et plis de chair rose, rouge-brun et violet meurtri, organisee autour
d'un coeur sombre lisible. Les frames de mouvement ondulent ou se replient ; les
attaques utilisent les bras, les machoires et l'engloutissement sans inventer
de forme humanoide ou d'arme.

### Bomb Devil Reze

- [Site officiel du film Reze Arc](https://www.chainsawman.dog/movie_reze/), affiches et bandes-annonces officielles ;
- [Fiche officielle des personnages du film](https://www.chainsawman.dog/movie_reze/character/), reference de Reze et de la continuite du film ;
- [Calendrier officiel Shonen Jump Chainsaw Man](https://www.shonenjump.com/j/jumpcalendar/sakuhin/chainsaw/), qui reference notamment les visuels produits `BOMB` et `MAXIMATIC-BOMB` de Bandai Spirits.

Verrou visuel : forme hybride complete dans les seize cellules, tete en bombe
aerienne noire avec bouche dentee et meche, bras sombres a texture de fusee,
tenue noire a col blanc, tablier de charges cylindriques, bas noirs et chaussures
sombres. Les attaques sont une frappe explosive, une explosion de paume, un
coup de pied en arc et une detonation centree ; aucune tete humaine ou tronconneuse
n'est ajoutee.

## Prompts de production resumes

Le socle commun demandait une vue de combat laterale orientee vers la droite,
une grille implicite `4x4`, exactement une entite complete par cellule, un fond
uniforme `#00FF00`, des frames distinctes et aucune ligne de grille, texte, logo,
HUD, decor, ombre portee ou contenu d'une cellule voisine.

| Entite | Ligne 2 | Ligne 3 |
|---|---|---|
| Bat Devil | decollage puis vol lourd avec battements coherents | griffe, morsure, souffle d'aile, onde sonique |
| Eternity Devil | reptation, roulis, contraction et expansion | bras multiples, machoires, ecrasement replie, engloutissement |
| Bomb Devil Reze | sprint, dash, saut et propulsion explosive | poing explosif, paume, coup de pied, detonation centree |

Les effets ont ete demandes compacts et physiquement relies au sujet afin que
la normalisation stricte conserve l'animation utile dans sa cellule.

## Post-traitement

1. Generation separee des trois sources `1254x1254` avec OpenAI ImageGen integre.
2. Detourage local avec le helper officiel `remove_chroma_key.py`, echantillonnage
   automatique du bord, soft matte, seuils `12/220`, despill et contraction de
   bord d'un pixel.
3. Reconstruction avec `scripts/normalizeGeneratedSpriteSheet.py --strict-cells`.
4. Controle automatise de chaque cellule puis inspection visuelle des trois
   PNG finaux a leur resolution originale.

## Validation technique

Seuil d'occupation et de marge : `alpha > 12`. Les trois fichiers passent le
meme contrat : PNG `RGBA`, `1024x1024`, `16/16` cellules occupees et distinctes,
marge interne minimale `12 px`, zero pixel dans les gardes de 12 px, quatre
coins transparents, zero RGB cache sous `alpha=0` et zero residu chroma visible.

| Fichier | Cellules | Uniques | Marge | Garde | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `bat-devil.png` | 16 | 16 | 12 px | 0 | 671837 / 32296 / 344443 | 0 | 0 | `cf5b47d345b54307d093fc9da69c209788ee1af91f561fbf28dcd0befc63fa31` |
| `eternity-devil.png` | 16 | 16 | 12 px | 0 | 547562 / 21194 / 479820 | 0 | 0 | `ad253e3be0495cfd1fc4fc3a78ce01cbb8f1351f2aac206243244cf9a386ed8e` |
| `bomb-devil-reze.png` | 16 | 16 | 12 px | 0 | 840431 / 24631 / 183514 | 0 | 0 | `befa7c0423b42b8b6f0923d02045d721378d88ea1bb89619f8619946cacfbec4` |

## Controle visuel final

- les 48 cellules contiennent une entite complete, lisible et correctement
  separee des cellules voisines ;
- le Bat Devil conserve visage, fourrure, ailes, griffes et proportions dans les
  quatre lignes, sans aile ou onde sonique coupee ;
- l'Eternity Devil reste une masse connectee et reconnaissable autour du meme
  coeur, sans fragment parasite ni personnage secondaire ;
- Bomb Devil Reze conserve son casque-bombe, sa meche, ses bras-fusees, son
  tablier explosif et sa tenue dans toutes les poses ;
- les quatre lignes ont des fonctions visuellement distinctes et aucun texte,
  logo, watermark, decor, sol ou grille n'apparait dans les sorties finales.

## Hors perimetre confirme

Ce lot n'a edite aucun manifeste, repertoire de stage, profil musical, fichier
de code partage, dependance ou metadonnee Git. Les modifications concurrentes
deja presentes dans le depot ont ete laissees intactes. Aucun commit, push ou
deploiement n'a ete execute pour ce sous-lot.
