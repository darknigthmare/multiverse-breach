# Lot de boss ImageGen - Cyber-Godzilla, Violator, Makaku et Trigon - 2026-07-22

## Perimetre livre

Quatre generations OpenAI ImageGen distinctes ont produit quatre feuilles de
sprites originales fan-made. Chaque sortie finale est un PNG `RGBA` transparent
de `1024x1024`, decoupe en grille exacte `4x4` de cellules `256x256` :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | idle | 4 |
| 2 | deplacement | 4 |
| 3 | attaques et pouvoirs lore | 4 |
| 4 | blessures et defaite | 4 |

| Boss | Continuite verrouillee | Fichier final |
|---|---|---|
| Cyber-Godzilla | `Godzilla: The Series` (1998), episode `Monster Wars: Part 2` | `public/sprites/generated/bosses/godzilla-the-animated-series/cyber-godzilla.png` |
| The Violator | `Spawn`, formes Clown et demon | `public/sprites/generated/bosses/spawn/the-violator.png` |
| Makaku | `Gunnm` / `Battle Angel Alita`, Maggot Body et Power Body de Kinuba | `public/sprites/generated/bosses/gunnm/makaku.png` |
| Trigon | `Teen Titans` (2003), arc `The End` | `public/sprites/generated/bosses/teen-titans/trigon.png` |

Les references ci-dessous ont uniquement servi a verrouiller les silhouettes,
matieres, couleurs et pouvoirs. Aucun pixel officiel n'est copie dans les PNG
livres.

## References inspectees avant generation

### Cyber-Godzilla

- [SciFi Japan - The Ultimate Guide to GODZILLA: THE SERIES](https://www.scifijapan.com/anime-animation/godzilla-the-series), guide de production attribue a Sony Pictures Family Entertainment, avec model sheet et images Adelaide Productions ;
- [Wikizilla - Cyber Godzilla Gallery](https://wikizilla.org/wiki/Cyber_Godzilla/Gallery), galerie secondaire utilisee pour recouper les vues et details de l'episode.

Verrou retenu : silhouette du Godzilla de 1998 ressuscite, peau brun-violet,
torse et membre cybernetiques bleu acier, optiques rouges, missiles, modules
circulaires lumineux et souffle atomique bleu.

### The Violator

- [Image Comics - Spawn #4](https://imagecomics.com/comics/releases/spawn-4), source primaire du recit et de la punition sous forme de Clown ;
- [McFarlane Toys - The Violator](https://mcfarlane.com/toys/the-violator/), reference officielle de la forme demoniaque ;
- [McFarlane Toys - The Clown](https://mcfarlane.com/toys/the-clown/), reference officielle de la forme humaine ;
- [McFarlane Toys - Spawn Series 1](https://mcfarlane.com/toys/series/spawn-series-1/), planches produit officielles des deux formes.

Verrou retenu : Clown corpulent au crane chauve et cheveux blancs, maquillage
bleu-rouge, veste noire, maillot raye et pantalon vert ; transformation en
demon gris osseux, tete tres allongee, yeux rouges, gueule demesuree, griffes
et langue extensible.

### Makaku

- [Kodansha - Battle Angel Alita, Volume 1](https://kodansha.us/series/battle-angel-alita/volume-1/), edition officielle contenant l'arc Makaku ;
- [Kodansha - How to Read Battle Angel Alita](https://archive.kodansha.us/2018/01/22/how-to-read-battle-angel-alita/index.html), guide officiel de la serie ;
- [Battle Angel Alita Wiki - Makaku](https://battleangel.fandom.com/wiki/Makaku), galerie secondaire donnant acces aux planches primaires de Yukito Kishiro inspectees pour le Maggot Body et le Power Body.

Verrou retenu : Power Body vole a Kinuba, masse de cyborg gladiateur, casque
cornu, ordinateur ventral Boarhead et cinq grind-cutters cables ; noyau original
reduit a une grande tete reliee a un corps vermiforme.

### Trigon

- [DC - Trigon](https://www.dc.com/characters/trigon), fiche officielle des pouvoirs ;
- [DC - Teen Titans (2003-2005)](https://www.dc.com/tv/teen-titans-2003-2005), page officielle de la continuite animee ;
- [Apple TV - Teen Titans, The End](https://tv.apple.com/au/episode/the-end/umc.cmc.em5nndgr144yepohww5ht20?showId=umc.cmc.5prgtzgxxlkqkzp6kdpeoawuu), visuel licencie de l'apparence geante utilise comme reference directe.

Verrou retenu : peau rouge sombre, quatre yeux, bois ramifies, cheveux et barbe
blancs, deux bras, brassards et ceinture noirs. Les attaques utilisent les
rayons oculaires, l'energie demoniaque, le portail et la manipulation d'ame ;
la defaite evoque les liens d'Azarath puis l'effondrement mineral.

## Prompts resumes

Toutes les generations demandaient un pixel art detaille coherent avec les
boss existants, un fond chroma magenta uniforme, une grille `4x4` sans traits
de grille, un seul sujet entier par cellule, une vue de combat orientee vers la
droite, aucun decor, texte, logo, ombre portee ou contenu d'une cellule voisine.

| Boss | Resume specifique des 16 poses |
|---|---|
| Cyber-Godzilla | Quatre idles de surveillance cybernetique, quatre deplacements lourds, puis missiles, onde sonique, souffle atomique bleu et charge de griffe ; dommages du blindage, cables exposes et defaite mecanique. |
| The Violator | Forme Clown pour les idles et la locomotion ; transformation complete en Violator pour griffes, morsure, bond et souffle infernal ; blessures demon et effondrement final. |
| Makaku | Power Body stable pour idle et locomotion ; poing, grind-cutters cables et ecrasement ; armure rompue, extraction puis defaite du noyau vermiforme. |
| Trigon | Idles et avance du geant a quatre yeux ; rayons oculaires, projection d'energie, portail et emprise d'ame ; blessures, liens d'Azarath et corps reduit en debris. |

## Post-traitement

1. Generation ImageGen separee pour chaque boss apres inspection de ses references.
2. Suppression du fond avec `remove_chroma_key.py --auto-key border`.
3. Cyber-Godzilla, Violator et Makaku : matte douce, seuils `12/220` et `--despill`.
4. Trigon : cle dure `--tolerance 64`, sans despill, car le rouge canonique est proche du magenta et devait rester pleinement opaque.
5. Reconstruction cellule par cellule avec `scripts/normalizeGeneratedSpriteSheet.py --strict-cells`.
6. Nettoyage du RGB sous `alpha=0`, controle automatique independant et inspection visuelle finale sur damier.

## Validation technique

Les quatre fichiers passent le meme contrat : format PNG, mode `RGBA`, taille
`1024x1024`, alpha `0..255`, `16/16` cellules occupees, `16/16` cellules
distinctes, marge interne minimale `12 px`, aucun pixel visible dans les gardes
de 12 px, quatre coins `[0,0,0,0]`, aucun RGB cache sous `alpha=0` et aucun
residu visible proche de la cle chroma.

| Fichier | Cellules | Uniques | Marge | Garde | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `cyber-godzilla.png` | 16 | 16 | 12 px | 0 | 755486 / 46251 / 246839 | 0 | 0 | `bc1d70387be0dd1c01954e2868a403a67531063a9b5affa04f0693c689f826dc` |
| `the-violator.png` | 16 | 16 | 12 px | 0 | 671141 / 41083 / 336352 | 0 | 0 | `10e9ffd84b5354abfbfed5dfe6d9218a06afd7aa1ae7310927f5311ff3a6c88d` |
| `makaku.png` | 16 | 16 | 12 px | 0 | 640583 / 31708 / 376285 | 0 | 0 | `0095983b6c724476b06ef6b3265372843fb3ce1986ab01ee816a84a747027b7b` |
| `trigon.png` | 16 | 16 | 12 px | 0 | 759087 / 0 / 289489 | 0 | 0 | `79824a9c9fc3ca061512f9098a1fa80ab3ae8cdeb05b586387c4c3008a56c9d3` |

## Controle visuel final

- les quatre feuilles restent lisibles sur damier clair et sombre ;
- les seize sujets de chaque feuille sont entiers et isoles dans leur cellule ;
- aucune partie importante ne franchit une limite et aucune case voisine n'est visible ;
- les quatre lignes ont des silhouettes et effets differencies conformes a leur fonction ;
- Cyber-Godzilla conserve son anatomie reptilienne, ses implants rouges et son arsenal ;
- Violator separe sans ambiguite la phase Clown de la phase demoniaque ;
- Makaku conserve le Power Body jusqu'a la rupture qui revele le noyau vermiforme ;
- Trigon conserve quatre yeux, deux bras, ses bois et sa barbe blanche sans frange chroma ;
- aucun texte, logo, watermark, decor, sol ou grille n'apparait dans les cellules.

## Hors perimetre confirme

Aucun manifeste, registre de sprites, fichier JavaScript, audit global, fichier
concurrent, etat Git, commit, push ou deploiement n'a ete modifie. Les seules
sorties ecrites dans le depot sont les quatre PNG listes plus haut et ce rapport.
