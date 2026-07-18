# Pack de stages OpenAI - Rob Zombie

Date : 2026-07-18
Univers : Rob Zombie
Périmètre : images de stages uniquement

## Direction visuelle et lore

Le pack repose exclusivement sur l'univers musical de Rob Zombie, en particulier
l'ère `Hellbilly Deluxe` et l'imagerie du clip `Dragula` :

- tunnel industriel sombre, tuyauteries, grilles, chaînes et éclairage rouge ;
- fête foraine horrifique et décrépite, sans personnage ni créature ;
- route hot-rod, traces de pneus, métal riveté et machines de course ;
- palette noire, bronze, rouge incandescent et vert toxique ;
- pixel art détaillé de type 32-bit.

Le pack exclut volontairement les lieux, personnages et motifs propres au film
`House of 1000 Corpses`. Il ne contient donc ni maison Firefly, ni station-service
de Captain Spaulding, ni Murder Ride, ni Dr. Satan.

## Références consultées

- Discographie officielle Rob Zombie : https://www.robzombie.com/music/
- Clip officiel `Dragula` publié par RobZombieVEVO :
  https://www.youtube.com/watch?v=EqQuihD0hoI
- Article Grammy consacré à `Dragula` et à son imagerie hot-rod :
  https://www.grammy.com/news/digging-through-the-ditches-with-rob-zombie/

Les références téléchargées pour guider la génération ont été conservées
uniquement comme fichiers temporaires de travail et ne sont pas livrées dans le
projet.

## Fichiers générés

| Fichier | Dimensions | Mode | Fonction |
| --- | ---: | --- | --- |
| `combat.webp` | 1536 x 864 | RGB | Arène de combat 1 contre 1, sol continu et centre dégagé |
| `melee.webp` | 1536 x 864 | RGB | Décor Melee sans plateformes intégrées |
| `melee-backdrop.webp` | 1536 x 864 | RGB | Arrière-plan Melee propre, conçu pour recevoir les modules RGBA |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | Atlas de 8 plateformes, props et hazards indépendants |
| `rpg.webp` | 1536 x 864 | RGB | Scène RPG latérale avec voie de combat dégagée |
| `tactics.webp` | 1536 x 1024 | RGB | Vue 3/4 élevée, grille rectangulaire exacte de 8 x 6 cases |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | Atlas de 12 cases, obstacles, props et hazards modulaires |

Le dossier cible contient exactement ces sept fichiers.

## Prompt set final

Règles partagées :

- detailed 32-bit pixel art, crisp clusters, readable game background ;
- Rob Zombie music-era horror-industrial and hot-rod imagery ;
- rusted tunnel, carnival structures, riveted machinery, tire-marked roadway ;
- no musician, person, character, creature, face, logo, readable text or UI ;
- no imagery or location from `House of 1000 Corpses`.

Variantes :

- `combat` : arène frontale symétrique, sol plat continu, centre libre ;
- `melee` : scène large à plusieurs profondeurs, aucun élément jouable déjà
  incrusté ;
- `melee-backdrop` : même langage visuel, silhouettes et contrastes réduits
  derrière la zone de jeu ;
- `melee-platforms` : atlas 4 x 2 sur chroma uni, huit modules sans contact,
  passerelles, stand, tuyaux, plateforme suspendue et hazards mécaniques ;
- `rpg` : vue latérale, grande bande de sol stable pour les combattants ;
- `tactics` : caméra 3/4 élevée, plateau rectangulaire non isométrique de huit
  colonnes par six lignes ;
- `tactics-tiles` : atlas 4 x 3 sur chroma uni, douze modules indépendants,
  cases de sol, grilles dangereuses, barrière, stand et machines.

## Corrections visuelles

1. Le premier rendu `combat` contenait un motif mécanique assimilable à un
   crâne. Il a été remplacé par une bouche d'aération circulaire neutre.
2. Le premier rendu `tactics` comportait neuf colonnes. Le plateau a été
   corrigé pour afficher exactement huit colonnes et six lignes.
3. Les deux atlas ont été détourés depuis un chroma magenta, avec nettoyage des
   franges.
4. Les résidus RGB cachés sous les pixels entièrement transparents ont été mis
   à zéro. Les rectangles rose et gris ainsi que les traits parasites ne sont
   plus présents, même dans un lecteur qui ignore l'alpha.

## Validation Pillow

- les sept fichiers WebP s'ouvrent et se décodent correctement ;
- dimensions et modes conformes au tableau ;
- `melee-platforms.webp` : alpha de 0 à 255, coins transparents,
  865034 pixels transparents, 26372 pixels semi-transparents,
  157170 pixels opaques ;
- `tactics-tiles.webp` : alpha de 0 à 255, coins transparents,
  630908 pixels transparents, 35816 pixels semi-transparents,
  381852 pixels opaques ;
- pixels avec `alpha = 0` et RGB non nul : 0 sur les deux atlas ;
- pixels magenta ou rose visibles : 0 sur les deux atlas ;
- inspection sur fond en damier : contours propres et modules séparés ;
- inspection RGB brute : aucun rectangle ou trait chroma résiduel.

## Périmètre technique

Aucun fichier JavaScript, JSON ou manifeste n'a été modifié. Aucun commit,
push GitHub ou déploiement Vercel n'a été effectué.
