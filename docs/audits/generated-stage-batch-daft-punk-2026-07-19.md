# Pack de stages Daft Punk / Alive 2007 - 19 juillet 2026

## Perimetre

Pack complet de sept stages produit avec le mode integre OpenAI ImageGen pour
le profil `Daft Punk`, avec une direction visuelle fondee sur la production
scenique d'Alive 2007.

Les assets finaux sont des compositions originales en pixel art 32-bit. Les
references ont servi a verrouiller la silhouette, les proportions, les
materiaux et le langage lumineux du concert. Aucun photogramme, logo, texte ou
asset officiel n'a ete copie dans le projet.

Chemin final :

`public/backgrounds/lore-stages/daft-punk/`

## References officielles et techniques

- [Daft Punk - Alive 2007](https://www.daftpunk.com/alive2007/) :
  page officielle de l'album, datee du 19 novembre 2007, avec la video live
  officielle `Around the World / Harder Better Faster Stronger`. La video et
  les visuels de la page ont servi de reference directe pour la pyramide
  centrale, la salle sombre et les sequences rouges, ambrees et cyan.
- [Interview Daft Punk par Pitchfork, octobre 2007](https://pitchfork.com/features/interview/6701-daft-punk/) :
  Thomas Bangalter explique que le duo a concu le concept multimedia avec
  Cedric Hervet et Paul Hahn, puis avec le light designer Martin Phillips. La
  production a commence debut 2006 pour Coachella et a ete amelioree en 2007.
- [Live Design - One More Time With Daft Punk](https://www.livedesignonline.com/concerts/one-more-time-daft-punk) :
  source technique contemporaine de la production. Elle decrit une pyramide de
  16 pieds de large composee de plus de 1 600 blocs Barco O-Lite, deux reseaux
  geometriques lateraux de 18 x 18 pieds et un rideau pixel de 48 x 16 pieds.
- [Live Design - Daft Punk Alive 2006-07](https://www.livedesignonline.com/projects/daft-punk-alive-2006-07-top-concert-tour-design-all-time) :
  retrospective de design avec les plans de lumiere et de rigging de Martin
  Phillips. Elle confirme la pyramide video-mappee, les graphismes wireframe et
  l'organisation des structures autour du dispositif central.
- [Rhino Media - Alive 2007](https://media.rhino.com/press-release/alive-2007) :
  source officielle de l'editeur confirmant que l'album provient du concert de
  Bercy du 14 juin 2007 et que l'edition physique inclut un livret de photos de
  la tournee.

## Verrous visuels

- Grande pyramide LED tronquee, vide et centree.
- Rideau pixel large, deux ailes geometriques lumineuses, truss noirs, cables,
  projecteurs et racks techniques.
- Palette charbon, rouge, ambre et cyan avec reflets controles.
- Ecrans limites a des grilles, impulsions et geometries abstraites.
- Aucun musicien, personnage, public, robot, casque, visage ou silhouette.
- Aucun texte lisible, lettre, nombre, logo, embleme, HUD, UI ou watermark.

## Methode ImageGen

Le pack utilise exclusivement le mode integre OpenAI ImageGen :

1. generation d'un Combat servant d'ancre de palette et d'architecture ;
2. generations distinctes pour Melee, backdrop, RPG et Tactics en utilisant
   l'ancre uniquement comme reference de continuite visuelle ;
3. generation separee des deux atlas sur chroma uniforme `#FF00FF` ;
4. detourage local avec le helper officiel
   `remove_chroma_key.py`, matte adouci et despill ;
5. export WebP lossless, avec preservation exacte de l'alpha et remise a zero
   du RGB sous les pixels totalement transparents.

La source Tactics mesurait `1449 x 1086`. La seule normalisation geometrique a
ete le retrait de sa derniere colonne exterieure pour obtenir exactement
`1448 x 1086`, sans toucher au plateau ou a sa grille.

## Prompts ImageGen finaux

### Combat

```text
Create an original high-detail 32-bit pixel-art concert arena environment
inspired by the verified production language of Daft Punk's Alive 2007 tour,
without reproducing a specific photograph. Center one huge empty truncated LED
pyramid in the rear of the stage, built from small video-light modules; no
performers or booth occupants anywhere.

Use a dark indoor concert structure with black steel trusses, a wide
pixel-light curtain, two large geometric lattice lighting wings, suspended
spotlights, rigging, visible cables and haze. Use disciplined red, amber and
cyan light sequences. Screens show only abstract grids, pulses, bars and
wireframe-like geometry.

Polished original cinematic 32-bit pixel art, crisp hand-placed pixel clusters,
rich material detail and controlled glow. Strict side-on 1v1 fighting-game
view, wide 16:9. Keep the full pyramid and both wings visible. One continuous
flat dark stage floor spans the entire bottom 22 percent. Keep the central
60 percent unobstructed. No platform, stair, railing, prop or gap interrupts
the duel floor.

No crowd, human, musician, performer, character, robot, helmet, face,
silhouette, instrument, readable text, letter, number, logo, emblem, HUD, UI,
watermark, border or chroma field. Do not turn the pyramid into a character or
helmet.
```

### Melee

```text
Use the Combat image only as a visual-continuity reference for the original LED
pyramid architecture, black concert trusses, red/amber/cyan palette, pixel-art
finish and materials. Create a new coherent scene; do not copy its exact
composition.

Create a wide side-view Melee environment based on the same empty concert
production. Preserve the central truncated LED pyramid in the middle distance,
geometric LED lattice wings, pixel curtain, rigging, spotlights, haze and
cables. Use polished cinematic high-detail 32-bit pixel art.

Strict side-on platform-fighter camera, wide 16:9, slightly farther back than
Combat. Keep at least 70 percent of the central airspace and the lower
42 percent visually open for runtime platforms. A narrow stage base may touch
the bottom edge, but paint no floating platform, ledge, balcony, stair, catwalk,
ramp, riser, collision shelf or gameplay prop.

No crowd, human, musician, performer, character, robot, helmet, face,
silhouette, instrument, readable text, letter, number, logo, emblem, HUD, UI,
watermark or border. Screens contain abstract unlabeled geometry only.
```

### Melee backdrop

```text
Use the Combat image only as a visual-continuity reference for the original
central LED pyramid, rigging, geometric lighting wings, palette and 32-bit
pixel-art materials. Generate a distinct deeper backdrop, not the same
composition.

Create a distant empty concert-stage panorama. Show the complete central
truncated LED pyramid farther away, the broad pixel curtain wrapping the rear,
two geometric LED lattice wings, overhead truss layers, cable bundles, dormant
projectors, haze and abstract red/amber/cyan light grids.

Strict side-view, exact wide 1672 x 941 landscape. Backdrop only: no foreground
floor, stage lip, playable platform, floating ledge, catwalk, stair, ramp,
obstacle or collision silhouette. Leave the lower 38 percent dark, atmospheric
and visually quiet for runtime layers.

No direct photograph recreation, crowd, human, musician, performer, character,
robot, helmet, face, silhouette, instrument, readable text, letter, number,
logo, emblem, HUD, UI, watermark or border.
```

### Melee platforms

```text
Create exactly eight separate side-view LED concert-stage platform modules:
two long steel-truss platforms, two medium LED deck platforms, two short
suspended lighting-grid platforms, one narrow cable-bridge platform and one
compact projector-riser platform. Give every module a straight horizontal
playable top, black-steel underside, bolts, cable sockets, abstract red and
amber LED grids, and restrained cyan trim.

Original high-detail 32-bit pixel-art sprite atlas, strict orthographic side
view. Exact square 1254 x 1254. Arrange exactly four rows of two isolated
platforms with generous equal spacing. Every platform is fully visible,
uncropped, non-overlapping and separated by a wide background band.

Use a perfectly flat solid #FF00FF chroma background with no gradient, texture,
lighting variation, reflection, floor, shadow or border. Do not use magenta or
purple in the objects. No character, human, musician, performer, robot, helmet,
face, silhouette, instrument, readable text, letter, number, logo, emblem, HUD,
UI, watermark, transparent effect, crop or overlap.
```

### RPG

```text
Use the Combat image only as a visual-continuity reference for the original
empty LED pyramid, geometric lighting wings, black trusses, red/amber/cyan
palette, cables and 32-bit pixel-art finish. Create a new RPG layout.

Build a broad empty 2.5D RPG battle floor inside the concert stage. The
monumental truncated LED pyramid stands centered far behind the playable plane,
with lattice lighting wings, pixel curtain, rigging, projectors, cable bundles,
haze and abstract pulse grids.

Wide 16:9 landscape with a shallow elevated three-quarter 2.5D camera, never
top-down. The dark modular stage deck occupies about the lower 48 percent and
recedes gently toward the pyramid. It is one broad uninterrupted floor with
free placement positions at left, center, right, front and rear. Keep the
central 70 percent clear. No grid line, platform, step, pit or rail crosses the
playable floor.

No crowd, human, musician, performer, character, robot, helmet, face,
silhouette, instrument, readable text, letter, number, logo, emblem, HUD, UI,
watermark or border.
```

### Tactics

```text
Use the RPG image only as a visual-continuity reference for the original empty
LED pyramid, black concert construction, red/amber/cyan palette, cables,
projectors and 32-bit pixel-art treatment. Generate a new tactical board.

Create a tactical battlefield on a broad modular concert stage deck in front
of the central truncated LED pyramid. Retain geometric LED lattice wings,
pixel curtain, steel trusses, suspended projectors, cable banks, haze and
abstract red/amber/cyan light grids.

Exact 1448 x 1086 landscape, elevated frontal three-quarter camera looking down
about 30 to 35 degrees. Never top-down and never diamond-isometric. One large
rectangular board fills the lower two-thirds. It contains exactly 8 columns and
6 rows of rectangular quadrilateral cells, 48 cells total: nine continuous
left-to-right boundaries and seven continuous near-to-far boundaries. The near
row is visibly closer and larger than the far row. Keep the entire board and
its four corners in frame. Use thin amber-red LED seams with sparse cyan
accents. Place only four low equipment-cover blocks on outer edge cells.

No hex cell, diamond cell, diagonal chessboard, character, crowd, human,
musician, performer, robot, helmet, face, silhouette, readable text, letter,
number, logo, emblem, HUD, UI, watermark or border.
```

### Tactics tiles

```text
Create exactly twelve separate tactical elements from the same elevated
frontal three-quarter rectangular-board camera: four dark deck-floor tiles with
different abstract LED seams, one reinforced amber objective tile without a
symbol, one cyan power-routing tile without a symbol, two low black truss-cover
barriers, one tall equipment-rack cover, one coiled cable hazard on a
rectangular base, one dormant projector housing on a rectangular base and one
short ramp tile.

Original high-detail 32-bit pixel-art atlas with coherent rectangular
footprints. Exact square 1254 x 1254. Arrange exactly three rows of four
isolated pieces with generous equal gutters. Every piece is fully visible,
uncropped, non-overlapping and separated from every other piece.

Use a perfectly flat solid #FF00FF chroma background with no gradient, texture,
lighting variation, reflection, floor, shadow or border. Do not use magenta or
purple in the objects. No connected board, hexagon, diamond tile, character,
human, musician, performer, robot, helmet, face, silhouette, readable text,
letter, number, logo, emblem, HUD, UI, watermark, transparent effect, crop or
overlap.
```

## Fichiers produits

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672 x 941 | RGB | 2 072 208 | `559a40736effc2ab` |
| `melee.webp` | 1672 x 941 | RGB | 1 900 470 | `854c6d6163bee347` |
| `melee-backdrop.webp` | 1672 x 941 | RGB | 1 712 320 | `6d86117d35ae31ff` |
| `melee-platforms.webp` | 1254 x 1254 | RGBA | 602 568 | `13e58cfd31fd1e94` |
| `rpg.webp` | 1672 x 941 | RGB | 2 086 116 | `eaa1481b5a21abcf` |
| `tactics.webp` | 1448 x 1086 | RGB | 2 223 464 | `0bd231483b9cf620` |
| `tactics-tiles.webp` | 1254 x 1254 | RGBA | 912 168 | `0661a6228397a36b` |

Les prefixes SHA-256 sont calcules sur les WebP finaux.

## Validation alpha et separation

| Fichier | Transparence | Alpha partiel | Opaque | Magenta visible | RGB sous alpha 0 | Composantes utiles | Coins |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `melee-platforms.webp` | 1 201 337 | 34 836 | 336 343 | 0 | 0 | 8 | 0 / 0 / 0 / 0 |
| `tactics-tiles.webp` | 995 409 | 14 756 | 562 351 | 0 | 0 | 12 | 0 / 0 / 0 / 0 |

- Les deux atlas reouvrent en `RGBA` avec un alpha de `0..255`.
- Les huit plateformes forment exactement huit composantes connexes utiles.
- Les douze pieces Tactics forment exactement douze composantes connexes
  utiles.
- Aucun objet ne touche, ne chevauche ou ne recadre un autre objet.
- Les deux atlas ont ete inspectes sur damier apres l'export WebP final.
- Aucun residu chroma magenta n'est visible.

## Inspection visuelle finale

- Les sept WebP finaux ont ete ouverts et inspectes depuis leurs chemins projet.
- Combat : camera laterale, sol continu bord a bord et centre 1v1 libre.
- Melee : camera laterale, scene ouverte et aucune plateforme flottante cuite.
- Backdrop : couche distante distincte, sans plancher ou collision au premier
  plan.
- RPG : perspective 2.5D faible, large sol continu et positions libres sur tout
  le plan de jeu.
- Tactics : camera frontale trois-quarts elevee, jamais top-down ; neuf limites
  verticales et sept limites horizontales delimitent exactement 8 x 6 cases.
- Tactics : quatre couvertures basses restent sur les cellules de bord et ne
  masquent ni les intersections centrales ni les voies principales.
- Atlas Melee : huit plateformes laterales avec dessus horizontaux lisibles.
- Atlas Tactics : douze pieces rectangulaires partageant le meme angle.
- Aucun personnage, public, musicien, robot, casque, visage, texte lisible,
  logo, HUD, UI, watermark ou chroma visible n'a ete trouve.

## Limites du depot

Seuls les chemins suivants ont ete ajoutes :

- `public/backgrounds/lore-stages/daft-punk/`
- `docs/audits/generated-stage-batch-daft-punk-2026-07-19.md`

Aucun manifeste, prompt global, fichier source, package ou metadata Git n'a ete
modifie. Aucun commit, push ou deploiement n'a ete effectue. Les changements
concurrents deja presents dans le worktree ont ete laisses intacts.
