# Pack de stages OpenAI - Alien: Romulus

Date : 2026-07-17

## Perimetre

Pack complet genere avec OpenAI ImageGen pour les modes Combat, Melee, RPG et
Tactics de l'univers `Alien: Romulus`. Les images sont des creations originales
en pixel art 32-bit detaille. Aucun personnage, ennemi, logo, texte lisible,
interface ou visuel officiel n'est integre dans les assets.

Dossier final :

`public/backgrounds/lore-stages/alien-romulus/`

## References web

- Fede Alvarez, entretien de realisation et contexte de la station Renaissance :
  https://www.avpgalaxy.net/website/interviews/fede-alvarez/
- Entretien du chef decorateur Naaman Marshall, repris avec attribution a
  Dezeen, sur l'approche utilitaire, les modules Remus/Romulus, les couloirs,
  les ascenseurs et le laboratoire :
  https://topcoreidea.com/production-designer-naaman-marshall-adopted-utilitarian-approach-for-alien-romulus/
- Dossier de reference sur le laboratoire Romulus, le stockage cryogenique, les
  Facehuggers et le compose Z-01 :
  https://www.avpcentral.com/romulus-lab-research
- Presentation de la British Film Designers Guild sur les decors de la station,
  le cargo bay et l'elevator set :
  https://awards.britishfilmdesigners.com/wp-content/uploads/2024/11/Alien-Romulus-PRESENTATION-2024-compressed-b795ad0445bd8ddf5cf2b003acd1fc54.pdf

Ces references ont guide les choix visuels suivants :

- Renaissance est traitee comme une station de recherche Weyland-Yutani
  abandonnee, composee des modules Remus et Romulus ;
- Remus apporte la patine industrielle sombre et retrofuturiste, tandis que
  Romulus apporte des equipements de recherche plus recents ;
- les environnements utilisent des couloirs longs, une architecture de
  maintenance, des portes et bulkheads lourds, des cryopods et des lumieres
  d'urgence rouges/cyan ;
- les scenes de gameplay reprennent le cargo bay, les puits d'ascenseur en
  apesanteur et le laboratoire cryo sans afficher de creature ou de personnage.

## Fichiers finaux

| Fichier | Dimensions | Mode | Alpha |
|---|---:|---|---|
| `combat.webp` | 1672 x 941 | Combat lateral 16:9, sol continu, centre libre | Non |
| `melee.webp` | 1672 x 941 | Melee lateral, decor sans plateformes bakees | Non |
| `melee-backdrop.webp` | 1672 x 941 | Fond Melee seul, bande basse reservee au moteur | Non |
| `melee-platforms.webp` | 1254 x 1254 | Atlas de plateformes laterales | Oui |
| `rpg.webp` | 1672 x 941 | RPG lateral 2.5D, lane centrale libre | Non |
| `tactics.webp` | 1536 x 1024 | Tactics sureleve trois-quarts, plateau rectangulaire | Non |
| `tactics-tiles.webp` | 1254 x 1254 | Atlas de tuiles/couvertures Tactics | Oui |

## Composition des prompts

### Combat

Hangar cargo et couloir industriel de Renaissance en vue strictement laterale,
sol continu sur toute la largeur, grand centre libre pour un duel, cryo-bank et
machines lourdes repoussees vers les bords, lumiere froide et alarmes rouges.

### Melee

Long corridor de transit Remus/Romulus vu de profil, forte profondeur de
perspective, detail mural et tuyauterie dans le fond, plancher bas continu et
aucune plateforme, rampe, escalier ou pont integre dans la zone jouable.

### Melee backdrop

Backdrop non collisionnel de couloir cryogenique sombre, details concentres au
fond, bande inferieure simple et sombre pour le plancher du moteur, sans rebord
de premier plan interpretable comme une plateforme.

### Melee platforms

Atlas sur fond chroma uniforme, avec modules separes de catwalk, plateforme
metallique, ledge de maintenance, dalle cryo, embouts gauche/droit, bord grille
endommage et ledge de bulkhead. Les surfaces sont laterales et lisibles pour la
collision.

### RPG

Couloir cryo de Romulus en vue laterale 2.5D, banques de cryopods et passerelles
releguees au decor, voie centrale continue et deux zones de formation libres,
sans obstacle dans la lane.

### Tactics

Chambre de recherche Romulus vue a environ 30-35 degres, avec surfaces
superieures et faces avant visibles. Le plateau central reste rectangulaire,
lisible et vide pour la grille orthogonale 8 x 6 du moteur. Les lignes visibles
sur le sol sont des joints de dalles industriels, pas une grille HUD ou des
losanges isometriques.

### Tactics tiles

Atlas sur fond chroma uniforme avec dalles industrielles rectangulaires, dalle
cryo, grille de maintenance, dalle gelee, caisse de couverture, bulkhead,
couverture basse de tuyaux, console cryo, porte, conduites et barriere de
quarantaine. Chaque module est separe et concu pour la vue trois-quarts
orthogonale, jamais en losange isometrique.

## Traitement

- Les cinq scenes opaques ont ete recadrees aux dimensions standard du moteur et
  encodees en WebP lossless RGB.
- Les deux atlas ont ete detoures localement depuis le chroma-key jaune, avec
  suppression des franges de chroma et encodage WebP RGBA lossless.
- Aucun JS, JSON, manifeste ou fichier de configuration n'a ete modifie.
- Aucun commit n'a ete cree.

## Validation

- Les sept fichiers demandes sont presents dans le dossier final.
- Le dossier contient exactement ces sept fichiers et aucun supplementaire.
- Combat, melee, backdrop et RPG sont en 1672 x 941, ratio 16:9.
- Tactics est en 1536 x 1024, avec une composition surelevee trois-quarts et un
  plateau central rectangulaire reserve a la grille 8 x 6.
- Les deux atlas sont en 1254 x 1254 avec alpha `(0, 255)`.
- Alpha des quatre coins de `melee-platforms.webp` : `0, 0, 0, 0`.
- Alpha des quatre coins de `tactics-tiles.webp` : `0, 0, 0, 0`.
- Pixels totalement transparents : `1 141 860` pour l'atlas melee et
  `1 012 283` pour l'atlas Tactics.
- Pixels opaques : `430 656` pour l'atlas melee et `560 233` pour l'atlas
  Tactics.
- Pixels jaune de chroma-key dans les zones opaques : `0` pour les deux atlas.
- Inspection visuelle realisee sur les sept fichiers : aucun personnage,
  ennemi, creature, silhouette humaine, texte, logo, watermark ou UI detecte.
- Les plateformes et tuiles sont separees, lisibles et ne se chevauchent pas.
