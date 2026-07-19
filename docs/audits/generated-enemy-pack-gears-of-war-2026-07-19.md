# Production ennemis Gears of War - 2026-07-19

## Perimetre livre

Ce lot contient les sept feuilles ennemies Gears of War demandees :

| Ennemi | Fichier final |
|---|---|
| Locust Drone | `public/sprites/generated/bosses/gears-of-war/locust-drone.png` |
| Locust Wretch | `public/sprites/generated/bosses/gears-of-war/locust-wretch.png` |
| Explosive Ticker | `public/sprites/generated/bosses/gears-of-war/explosive-ticker.png` |
| Theron Guard | `public/sprites/generated/bosses/gears-of-war/theron-guard.png` |
| Boomer Locust | `public/sprites/generated/bosses/gears-of-war/boomer-locust.png` |
| Kantus Priest | `public/sprites/generated/bosses/gears-of-war/kantus-priest.png` |
| Corpser Hatchling | `public/sprites/generated/bosses/gears-of-war/corpser-hatchling.png` |

Le lot n'a modifie aucun manifeste, fichier de code, `package.json` ou etat Git.

## References canoniques inspectees

Source officielle principale :

- The Coalition, `Developer Blog: Enemies` : https://www.gearsofwar.com/en-us/news/dev-blog-enemies/

References visuelles utilisees :

- Locust Drone, rendu officiel The Coalition : https://live.cdn.gearsofwar.com/gearsofwar/sites/3/2020/04/d4a11e785681d9e7376959a177e1d0513d88e70a-69cb0d08e93ed.png
- Wretch, modele standard Gears of War : https://static.wikia.nocookie.net/gearsofwar/images/2/2d/Wretch.png/revision/latest?cb=20110713224628
- Ticker, rendu officiel The Coalition : https://live.cdn.gearsofwar.com/gearsofwar/sites/3/2020/04/65882521661405ced2f556a3bfd3ddfade7d8bd1-69cb0d8a43e08.png
- Theron, rendu officiel The Coalition : https://live.cdn.gearsofwar.com/gearsofwar/sites/3/2020/04/c2fcd853880fcada1996def87bfd8bea45d0ee83-69cb0ddd936f3.png
- Boomer, rendu officiel The Coalition : https://live.cdn.gearsofwar.com/gearsofwar/sites/3/2020/04/5d759df3e06b637607e82f6db322f84fc21a6c3d-69cb0da52c84e.jpg
- Kantus, rendu officiel The Coalition : https://live.cdn.gearsofwar.com/gearsofwar/sites/3/2020/04/1d472a9f0c9baffd47ef408ea7a825f0ab0dffc7-63f7f49218bac-69cb0d6f650f3.jpg
- Corpser Hatchling, reference Gears of War 3 : https://static.wikia.nocookie.net/gearsofwar/images/9/99/Corpser_Hatchling.jpg/revision/latest?cb=20121028211925
- Theron Guard, verification de l'armure et de l'equipement : https://gearsofwar.fandom.com/wiki/Theron_Guard
- Wretch, verification de l'anatomie et du comportement : https://gearsofwar.fandom.com/wiki/Wretch
- Kantus, verification du cri de soin, du Gorgon Pistol et de l'Ink Grenade : https://gearsofwar.fandom.com/wiki/Kantus
- Corpser, verification du Hatchling et de son anatomie juvenile : https://gearsofwar.fandom.com/wiki/Corpser

Les images finales sont des interpretations pixel art originales guidees par ces references. Aucun fichier officiel n'est redistribue comme asset du jeu.

## Verrous lore et visuels

### Locust Drone

- Drone standard, peau gris-blanc rocheuse, machoire dentee et armure Locuste sombre.
- Hammerburst stable dans les seize frames.
- Exclusion explicite du Lancer CGU, du col Theron et de la masse corporelle du Boomer.

### Locust Wretch

- Forme standard non Lambent et non Deviant.
- Silhouette basse de creature `monkey-dog`, longs bras, machoire surdimensionnee, griffes et harnais dorsal.
- Aucun fusil, aucune armure humanoide et aucun membre supplementaire.

### Explosive Ticker

- Petite creature organique basse avec tete en coin et membres griffus.
- Reservoir explosif d'Imulsion orange fixe sur le dos, avec sangles, tuyaux et detonateur coherents.
- Aucun melange avec un Wild Ticker, un Wretch ou un Corpser.

### Theron Guard

- Elite Locuste a peau grise, armure rouge et noire, grand col rouge nervure et pans de manteau.
- Torque Bow mecanique stable dans toutes les frames, avec carreau explosif orange.
- Aucun Hammerburst, Boomshot, arc medieval ou equipement CGU.

### Boomer Locust

- Forme standard massive, chauve, a peau grise, ventre partiellement expose et armure Locuste rouge sombre.
- Boomshot canonique stable avec canon central et quatre segments lumineux autour de la bouche.
- Aucune confusion avec Grinder, Mauler, Butcher, Flame Boomer ou Scion.

### Kantus Priest

- Kantus standard, grand et svelte, peau grise, coiffe pointue et vetements rituels sombres a bordures bronze.
- Gorgon Pistol documente conserve comme seule arme de la ligne d'attaque.
- Le cri de soin est represente par la posture et la voix, sans aura magique, projectile mystique ou pouvoir invente.
- Aucun staff tronconneuse de Skorge et aucune armure d'Armored Kantus.

### Corpser Hatchling

- Petit Hatchling pale et aveugle de Gears of War 3, sans armure ni equipement Locuste.
- Anatomie arachnoide basse, bouche circulaire rouge et pattes articulees coherentes entre les frames.
- Attaque par griffe et mouvement de scuttlement ; aucun reservoir de Ticker, Imulsion ou anatomie humanoide.

## Contrat d'animation

Chaque feuille suit exactement le meme contrat moteur :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | `idle` | 4 |
| 2 | `run` | 4 |
| 3 | `attack` | 4 |
| 4 | `hit` | 4 |

Toutes les poses utilisent une vue RPG trois-quarts orientee vers la droite. Les seize cellules ont une taille exacte de `256x256` dans une feuille `1024x1024`.

## Production et post-traitement

- Generation separee par ennemi avec OpenAI ImageGen et une reference visuelle dediee.
- Source generee sur fond uniforme magenta uniquement pour permettre le detourage local.
- Suppression du chroma avec matte douce et despill.
- Reconstruction cellule par cellule avec `scripts/normalizeGeneratedSpriteSheet.py`.
- Sortie finale PNG `RGBA`, transparente, sans grille visible, texte, logo, decor ou watermark.

## Validation technique

| Fichier | Format | Cellules non vides | Cellules distinctes | Marge min. | Pixels opaques sur bord | Pixels magenta visibles | RGB sous alpha 0 |
|---|---|---:|---:|---:|---:|---:|---:|
| `locust-drone.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `locust-wretch.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `explosive-ticker.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `theron-guard.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `boomer-locust.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `kantus-priest.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `corpser-hatchling.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |

## Controle visuel final

- aucun sprite voisin visible dans une cellule ;
- aucune partie importante coupee par les limites de cellule ;
- proportions, visage, anatomie et equipement coherents sur les quatre lignes ;
- mouvements, attaques et reactions aux degats visuellement distincts ;
- Hammerburst, reservoir du Ticker, Torque Bow, Boomshot et Gorgon Pistol lisibles et stables ;
- cri de soin du Kantus rendu sans magie inventee ;
- anatomie et pattes du Corpser Hatchling coherentes sur les quatre lignes ;
- aucune identite melangee entre les sept ennemis ;
- transparence propre sans chroma residuel.
