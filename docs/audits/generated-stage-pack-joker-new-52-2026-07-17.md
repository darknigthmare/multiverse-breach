# Pack de stages OpenAI - Joker New 52

Date : 2026-07-17

## Perimetre

Pack complet genere avec OpenAI ImageGen pour les modes Combat, Melee, RPG et
Tactics. Les images sont des creations originales en pixel art 32-bit. Aucun
asset officiel, panneau de comic, screenshot, logo ou personnage DC n'a ete
reutilise.

Profil projet :

- `src/game/stageLoreProfiles.js`
- Univers : `Joker New 52`
- Lieu : `Jokerized Gotham streets around the parade route and ruined GCPD barricades`
- Priorite : `P0`
- Statut avant generation : `FALLBACK`

Entrees du prompt pack :

- `joker-new-52-combat`
- `joker-new-52-melee`
- `joker-new-52-rpg`
- `joker-new-52-tactics`

## References

Source canon principale :

- DC, *The Joker: Endgame* :
  https://www.dc.com/graphic-novels/endgame-2015/the-joker-endgame

La page DC etablit que Gotham est envahie par des victimes jokerisees et que le
Joker parcourt les rues. Le pack traduit ce contexte avec une route de parade
abandonnee, des barricades de police rendues anonymes, une architecture
gothique, une contamination vert maladif et un eclairage de carnaval violet.
Ces elements sont recomposes dans des scenes originales adaptees au gameplay.

## Fichiers finaux

| Fichier | Dimensions | Mode | Alpha |
|---|---:|---|---|
| `combat.webp` | 1672 x 941 | Combat lateral 16:9 | Non |
| `melee.webp` | 1672 x 941 | Melee lateral, base sans plateforme flottante cuite | Non |
| `melee-backdrop.webp` | 1672 x 941 | Backdrop Melee sans collision cuite | Non |
| `melee-platforms.webp` | 1254 x 1254 | Atlas de plateformes, chants et rebords | Oui |
| `rpg.webp` | 1672 x 941 | RPG lateral 2.5D | Non |
| `tactics.webp` | 1536 x 1024 | Tactics trois-quarts, grille 8 x 6 | Non |
| `tactics-tiles.webp` | 1254 x 1254 | Atlas de tiles, hazards et couvertures | Oui |

Tous les fichiers se trouvent dans :

`public/backgrounds/lore-stages/joker-new-52/`

## Prompts finaux

### Combat

Creation originale en pixel art 32-bit d'une rue de Gotham jokerisee autour
d'une route de parade et de barricades anonymes detruites. Camera de combat
strictement laterale 16:9, sol continu et plat, centre libre pour un duel 1v1,
vehicules et debris aux extremites, parallax peu profond. Nuit pluvieuse,
architecture gothique, reflets violets, brume toxique verte et faibles lueurs
rouges. Aucun personnage, visage, texte, logo, UI, plateforme, fosse ou obstacle
au centre.

### Melee

Creation originale en pixel art 32-bit d'une avenue de parade jokerisee vue de
profil. Grand volume aerien libre et rue uniquement au niveau du sol. Aucun
plateau flottant, escalier, rampe, rail ou bloc de collision integre. Les
batiments, barricades et debris restent au fond ou sur les bords afin que les
plateformes du moteur puissent etre superposees.

### Melee backdrop

Backdrop non collisionnel en pixel art 32-bit montrant la skyline gothique de
Gotham, des fanions vierges, la pluie et une brume toxique. Camera strictement
laterale. La bande inferieure reste sombre et simple. Aucun toit, pont, rebord,
escalier ou objet de premier plan pouvant etre interprete comme une plateforme.

### Melee platforms

Atlas carre sur fond chroma uniforme `#ffff00`, compose de huit modules separes :
long dessus en asphalte, dessus moyen en beton, catwalk metallique, chant
d'asphalte et maconnerie, chant de beton tache de violet, bord mural gothique,
angle gauche et angle droit. Perspective laterale, surfaces superieures presque
horizontales, silhouettes de collision lisibles, aucune scene complete.

### RPG

Creation originale en pixel art 32-bit d'une route de parade de Gotham
jokerisee en vue RPG laterale 2.5D. Le sol de combat occupe la partie basse avec
deux zones de formation ouvertes, une voie centrale continue et un premier plan
bas. Les voitures, barricades et debris sont relegues aux bords et au fond.
Aucun personnage, texte, UI, grille, anneau ou obstacle dans la lane.

### Tactics

Creation originale en pixel art 32-bit d'une place tactique de Gotham vue a
environ 30-35 degres au-dessus du sol. Une dalle d'asphalte rectangulaire vide
occupe le centre, avec les quatre coins visibles. Aucun quadrillage, obstacle,
couverture ou hazard n'est cuit dans la base generee. Une grille orthogonale
deterministe de neuf limites verticales et sept limites horizontales a ensuite
ete appliquee, soit exactement huit colonnes par six rangees. Les rangees
inferieures sont plus grandes et visuellement devant les rangees superieures.

### Tactics tiles

Atlas carre sur fond chroma uniforme `#ffff00`, compose de douze modules
separes : six surfaces rectangulaires, une barricade legere, une barricade
lourde, un amas de debris, une cloture gothique, un pied de lampadaire et une
bordure de pierre. Perspective trois-quarts compatible avec une grille
orthogonale rectangulaire, jamais en losanges isometriques.

Contraintes communes aux sept prompts :

- pixel art 32-bit detaille et lisible en jeu ;
- aucun personnage, ennemi, silhouette humaine, visage ou clown ;
- aucun texte lisible, lettre, nombre, logo, watermark ou UI ;
- aucun symbole Batman ou Joker ;
- creation originale, sans reproduction d'un visuel officiel.

## Corrections et traitement

- Le premier rendu Combat n'a pas ete conserve car son fichier source ImageGen
  etait vide malgre un apercu valide. Le rendu a ete regenere.
- Le premier rendu Tactics n'a pas ete conserve : ImageGen avait produit plus
  de 8 x 6 cases.
- La version Tactics finale utilise une base ImageGen sans lignes, puis une
  grille 8 x 6 exacte a ete appliquee en perspective.
- Les images opaques ont ete encodees en WebP lossless.
- Les deux atlas ont ete detoures avec matte douce et despill depuis leur fond
  `#ffff00`, puis encodes en WebP RGBA.

## Validation

- Sept fichiers demandes presents, aucun fichier supplementaire dans le pack.
- Combat, Melee, backdrop et RPG : `1672 x 941`, ratio 16:9.
- Tactics : `1536 x 1024`, angle sureleve trois-quarts.
- Tactics : exactement 8 colonnes et 6 rangees.
- Melee platforms : `773277` pixels totalement transparents et `16404`
  pixels de bord partiellement transparents.
- Tactics tiles : `929925` pixels totalement transparents et `56297`
  pixels de bord partiellement transparents.
- Alpha des quatre coins des deux atlas : `0`.
- Pixels chroma jaunes encore visibles dans les zones opaques : `0`.
- Aucun module coupe, superpose ou colle a un autre.
- Aucun personnage, ennemi, texte lisible, logo ou UI detecte lors de
  l'inspection visuelle.
- Aucun fichier JS, JSON ou manifeste modifie par cette generation.
