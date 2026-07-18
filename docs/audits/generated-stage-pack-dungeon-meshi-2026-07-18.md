# Pack de stage OpenAI - Dungeon Meshi

Date: 2026-07-18
Univers: Dungeon Meshi / Delicious in Dungeon
Lieu verrouille: Golden Kingdom dungeon / Red Dragon chamber / improvised camp kitchen
Generation: OpenAI ImageGen integre, puis conversion WebP et validation locale avec Pillow
Perimetre: images de stage uniquement

## Resultat

Le dossier `public/backgrounds/lore-stages/dungeon-meshi/` contient exactement les
sept fichiers demandes:

| Fichier | Dimensions | Mode Pillow | Usage |
| --- | ---: | --- | --- |
| `combat.webp` | 1672x941 | RGB | Combat lateral, sol continu et centre libre |
| `melee.webp` | 1672x941 | RGB | Decor Melee sans plateforme integree |
| `melee-backdrop.webp` | 1672x941 | RGB | Fond Melee partage avec `melee.webp` |
| `melee-platforms.webp` | 1254x1254 | RGBA | Six plateformes separees sur fond transparent |
| `rpg.webp` | 1672x941 | RGB | Vue RPG laterale 2.5D, voie centrale libre |
| `tactics.webp` | 1448x1086 | RGB | Vue trois-quarts elevee, grille rectangulaire 8x6 |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Huit tiles, obstacles et objectifs separes |

`melee.webp` et `melee-backdrop.webp` sont volontairement identiques. Le moteur peut
poser les plateformes de `melee-platforms.webp` au-dessus du decor sans qu'une seconde
geometrie soit cuite dans l'image.

## References officielles

Les images officielles n'ont servi que de references de lieu, de materiaux, de palette
et d'eclairage. Aucun asset officiel n'est copie dans le jeu.

1. Site officiel de l'anime, introduction et equipe artistique:
   https://delicious-in-dungeon.com/en/
2. Site officiel de l'anime, episode 11, reference de la rue pavee et de la chambre
   du Dragon Rouge:
   https://delicious-in-dungeon.com/assets/story/11/4.webp?v3
3. Site officiel de l'anime, episode 21, interieur bois/pierre du Royaume d'Or:
   https://delicious-in-dungeon.com/assets/story/21/3.webp?v3
4. Site officiel de l'anime, episode 21, foyer improvise et ustensiles de Senshi:
   https://delicious-in-dungeon.com/assets/story/21/6.webp?v3
5. Site officiel de l'anime, recette du repas du Dragon Rouge, utilisee uniquement
   pour les accents rouge-or et les materiaux de cuisine:
   https://delicious-in-dungeon.com/assets/recipe/21b.webp
6. Encyclopedie officielle des monstres, entree Red Dragon: ecailles dures, souffle
   de feu et ecaille inversee sous le cou:
   https://delicious-in-dungeon.com/monster.html
7. KADOKAWA, fiche officielle du tome 4 et confrontation du cinquieme sous-sol:
   https://www.kadokawa.co.jp/product/321609000644/

## Verrou visuel commun

- Ruines souterraines du cinquieme etage du Royaume d'Or.
- Paves irreguliers bleu-gris, murs de blocs fissures et facades medievales a
  colombages.
- Passages sombres, arches, racines retenues et traces de suie.
- Petit foyer pratique en bord de scene avec marmite noire, poele, louche, planche,
  bois et provisions modestes.
- Lumiere froide de donjon equilibree par un foyer ambre discret.
- Pixel art 32-bit detaille, amas de pixels nets et aucune finition 3D ou floue.
- Aucun personnage, monstre, dragon, animal, logo, texte lisible, UI ou crossover.
- Aucun reste de dragon, viande ou gore dans les decors.

## Prompts finaux

### Combat

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop for Multiverse Breach, Combat mode
Input images: official Delicious in Dungeon anime frames used ONLY as visual reference for the dungeon's stone paving, Golden Kingdom timber-and-stone interiors, hearth masonry, cookware materials, palette and lighting. Remove every person from the composition and do not copy any character.
Primary request: create an original, canon-faithful Dungeon Meshi environment combining the Golden Kingdom dungeon's Red Dragon chamber and a small improvised camp kitchen at the chamber edge.
Scene/backdrop: ancient fifth-floor underground Golden Kingdom street-chamber, broad blue-gray irregular cobblestone floor, cracked block walls and ruined medieval house facades receding into darkness; at the far side only, a compact practical camp hearth with black iron pot, pan, ladle, chopping board, bundled firewood and modest provisions. A few warm embers and traces of soot suggest the Red Dragon battle aftermath, but NO dragon, body parts, meat or gore.
Style/medium: extremely detailed authentic 32-bit cinematic pixel art, crisp hand-placed pixel clusters, nearest-neighbor edges, rich material texture, anime-fantasy color design, no painterly blur, no 3D render.
Composition/framing: strict side-view 16:9 combat camera; one continuous flat traversable stone floor across the entire bottom third; clear empty central 1v1 fighting lane; shallow parallax; architecture and cooking props kept to the far edges; no baked platforms, stairs or obstacles crossing the combat lane.
Lighting/mood: cool subterranean blue-gray ambient light balanced by restrained amber hearth light, adventurous and lived-in rather than horror.
Color palette: blue-gray stone, aged warm oak, muted moss olive, charcoal iron, ember orange and restrained antique gold.
Constraints: environment only; no character, person, silhouette, face, body, monster, Red Dragon, animal, weapon, readable text, letter, number, logo, sign, HUD, UI, border, watermark or crossover element. No school, modern kitchen, castle throne room, lava cave or generic tavern. Keep all important content inside a safe 16:9 crop.
```

### Melee et Melee backdrop

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop for Multiverse Breach, Melee mode
Input images: Image 1 is the approved generated Dungeon Meshi Combat environment and is the continuity anchor for architecture, palette, pixel density and lighting. Images 2 and 3 are official anime references used only for stonework, the underground chamber and improvised cooking materials. Do not copy or include any figures.
Primary request: create the matching Dungeon Meshi Melee BACKDROP for the same Golden Kingdom fifth-floor Red Dragon chamber and improvised camp kitchen.
Scene/backdrop: ruined underground Golden Kingdom street-chamber with blue-gray cobbles, broken block walls, timber-framed facades, arches and dark passages; a compact camp hearth and black cookware remain at the far right edge. Add layered background balconies, ruined wall openings and hanging roots for depth, but these are scenery only.
Style/medium: extremely detailed authentic 32-bit cinematic pixel art, crisp hand-placed pixel clusters, nearest-neighbor edges, no painterly blur, no smooth vector art and no 3D render. Match Image 1 closely.
Composition/framing: strict side-view 16:9 platform-fighter camera; panoramic background with an open readable center and ample vertical negative space for separately rendered gameplay platforms. The image itself must contain NO freestanding platforms, floating ledges, collision shelves, bridges, stairs, ladders or gameplay geometry. Only the continuous ground line may occupy the bottom edge. Keep all key scenery inside a safe 16:9 crop.
Lighting/mood: cool dungeon moon-blue ambient light with restrained amber camp-hearth glow, adventurous and lived-in.
Color palette: blue-gray stone, aged oak, charcoal iron, muted olive moss, ember orange and subtle antique gold.
Constraints: environment only; no character, person, silhouette, face, body, monster, Red Dragon, animal, weapon, readable text, letter, number, logo, sign, HUD, UI, border, watermark or crossover element. No baked gameplay platforms. No modern kitchen, generic tavern, throne room, school or lava cave.
```

### Plateformes Melee

```text
Use case: stylized-concept
Asset type: removable-chroma modular platform sprite atlas for Multiverse Breach Melee mode
Input images: Image 1 is the approved Dungeon Meshi Melee backdrop and fixes the exact blue-gray stone, aged oak, pixel density and lighting. Image 2 is an official anime reference used only for Golden Kingdom cobblestone and masonry. Do not include its characters.
Primary request: create exactly SIX separate lore-faithful Dungeon Meshi platform pieces for the Golden Kingdom Red Dragon chamber, all fully visible and non-overlapping.
Subjects: six horizontal side-view platform modules arranged cleanly in a 3-column x 2-row atlas: (1) long thick irregular cobblestone ledge with dark block-stone edge, (2) medium timber-supported stone balcony, (3) narrow broken masonry shelf, (4) long aged-oak scaffold deck with heavy beams, (5) compact arch-stone ledge with iron brace, (6) short hearth-brick service platform. Every module needs a perfectly readable flat walkable top and a vertical front edge for collision readability. Vary widths and thicknesses, but keep all platforms horizontally level and usable.
Style/medium: extremely detailed authentic 32-bit pixel art matching the backdrop, crisp hand-placed pixel clusters, nearest-neighbor edges, hard readable silhouettes, no painterly blur, no 3D render.
Composition/framing: square atlas, six isolated pieces with generous empty padding between them and around the canvas; no piece may touch another or be cropped. No labels, frames, gutters or grid lines.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background for local removal. It must be one uniform magenta color with no shadows, gradients, texture, reflections, floor plane or lighting variation. Do not use #ff00ff anywhere in the platforms.
Lighting/mood: neutral side lighting consistent across all pieces; no cast shadows outside the silhouettes.
Constraints: platform assets only; no full background scene, character, person, monster, dragon, animal, weapon, food, cookware, flame, smoke, readable text, letter, number, logo, UI, watermark or green-screen spill. Crisp closed silhouettes, generous padding, no contact shadow.
```

### RPG

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop for Multiverse Breach, RPG battle mode
Input images: Image 1 is the approved generated Dungeon Meshi Combat environment and fixes the same Golden Kingdom chamber, palette and pixel density. Image 2 is an official Golden Kingdom interior reference for wood, stone and hearth construction. Image 3 is an official Red Dragon meal reference used only for the restrained red-gold food/cookware color accent; do not copy its labels or layout.
Primary request: create a matching canon-faithful Dungeon Meshi RPG battle environment in the Golden Kingdom fifth-floor Red Dragon chamber with an improvised camp kitchen.
Scene/backdrop: underground ruined medieval Golden Kingdom street opens into the broad stone chamber; broken timber-framed houses, arches, dark corridors and irregular blue-gray paving. A practical low camp hearth, black iron pot, pan, ladle, cutting board, sacks and simple provisions sit behind the battle lane near one edge. Add subtle collapsed masonry and soot from the Red Dragon confrontation, but no dragon, remains, meat or gore.
Style/medium: extremely detailed authentic 32-bit cinematic pixel art, crisp hand-placed pixel clusters, nearest-neighbor edges, anime-fantasy color design, no painterly blur, no 3D render.
Composition/framing: wide side-view 2.5D RPG camera; broad perspective battle floor extending left to right; unobstructed central lane large enough for a player party on the left and enemies on the right; low foreground border only; clear foreground, midground and background depth; props stay behind or outside combat positions. Keep all important content inside a safe 16:9 crop.
Lighting/mood: cool dungeon blue-gray ambient light with warm hearth highlights and faint antique-gold reflections, adventurous, resourceful and lived-in.
Color palette: blue-gray stone, aged warm oak, charcoal iron, muted olive, ember orange, restrained red-gold accents.
Constraints: environment only; no character, person, silhouette, face, body, monster, Red Dragon, animal, weapon, readable text, letter, number, logo, sign, HUD, UI, grid, border, watermark or crossover element. No modern kitchen, school, throne room, tavern or lava cave.
```

### Tactics - prompt initial

```text
Use case: stylized-concept
Asset type: final 2D game battlefield for Multiverse Breach, Tactics mode
Input images: Image 1 is the approved generated Dungeon Meshi RPG environment and fixes the Golden Kingdom chamber, palette, pixel density and hearth. Images 2 and 3 are official anime references used only for irregular stone paving, timber-and-stone Golden Kingdom construction and warm hearth materials. Remove every figure and do not copy any character.
Primary request: create the same Dungeon Meshi Golden Kingdom fifth-floor Red Dragon chamber as a playable Tactics battlefield with an EXACT 8 columns x 6 rows rectangular cell layout.
Scene/backdrop: ruined underground medieval street-chamber, blue-gray cobblestones, broken block walls, timber-framed facade, dark archways, restrained hanging roots, and a compact improvised camp kitchen with black iron cookware at the far rear-right edge. Add a few low broken-wall cover segments, one timber crate stack and one raised stone landing, each aligned to cell boundaries; keep multiple traversable lanes.
Style/medium: extremely detailed authentic 32-bit cinematic pixel art, crisp hand-placed pixel clusters, nearest-neighbor edges, strong tile readability, no painterly blur, no 3D render.
Composition/framing: elevated THREE-QUARTER camera looking diagonally across the battlefield, approximately 35 degrees above ground, never bird's-eye and never top-down. The full board must be visible with margins. Draw EXACTLY 8 columns and EXACTLY 6 rows of orthogonal rectangular floor cells in the world plane. Front rows appear larger and visually in front of rear rows. Row boundaries run left-to-right; column boundaries recede toward the rear wall. Cells must remain rectangular/trapezoidal under perspective, NEVER 45-degree diamonds and NEVER a diamond-isometric checkerboard. Grid seams should be physical cobblestone joints, subtle but unambiguous, with no glowing UI overlay. Keep the front edge low so units on lower rows will occlude units behind them naturally.
Lighting/mood: cool dungeon blue-gray ambient light with restrained amber hearth glow; adventurous, practical and ancient.
Color palette: blue-gray stone, aged oak, charcoal iron, muted olive moss, ember orange and antique gold accents.
Constraints: environment only; no character, person, silhouette, face, body, monster, Red Dragon, animal, weapon, readable text, letter, number, logo, sign, HUD, UI marker, coordinate, border, watermark or crossover element. No modern kitchen, generic tavern, school, throne room or lava cave. Do not crop any grid row or column.
```

Le premier jet avait trop de colonnes. Il a ete refuse lors de l'inspection et corrige
avec le prompt cible suivant:

```text
Use case: precise-object-edit
Asset type: corrected final Dungeon Meshi Tactics battlefield
Input images: Image 1 is the edit target.
Primary request: change ONLY the playable floor grid in Image 1. Replace the current over-dense grid with one unmistakable EXACT 8 columns x 6 rows rectangular battlefield. Keep the Golden Kingdom ruins, timber facades, hearth, kitchen, lighting, palette, 32-bit pixel-art style, elevated three-quarter camera, cover props and framing otherwise unchanged.
Grid correction: create eight large cells across from left to right and six large cells from rear to front, so a viewer can count exactly 8 x 6. There must be exactly 9 longitudinal boundary seams defining 8 columns and exactly 7 transverse boundary seams defining 6 rows. Use broad orthogonal rectangular cobblestone slabs transformed by perspective: rear cells smaller, front cells larger. Row seams run horizontally across the board; column seams recede toward the rear wall. The grid is rectangular/trapezoidal in perspective, never 45-degree diamond isometric and never top-down. Keep all 48 cells inside frame with a visible margin.
Cover correction: align the existing low walls, crate stack and raised block to full cell boundaries without hiding the grid count; keep several open lanes.
Style/medium: preserve the exact detailed 32-bit pixel-art treatment and material texture of Image 1.
Constraints: no new objects except required cobblestone seams; no character, monster, dragon, readable text, number, letter, logo, HUD, glowing overlay, UI marker, border or watermark. Do not alter the background architecture or kitchen. Do not crop the board.
```

### Tiles Tactics

```text
Use case: stylized-concept
Asset type: removable-chroma modular tile and cover sprite atlas for Multiverse Breach Tactics mode
Input images: Image 1 is the approved corrected Dungeon Meshi 8x6 battlefield and fixes the exact cell perspective, blue-gray stone, aged oak, pixel density and lighting. Image 2 is an official Golden Kingdom interior reference used only for stone, brick, wood and cookware materials. Do not include its characters or documents.
Primary request: create exactly EIGHT separate lore-faithful Dungeon Meshi tactical modules for the Golden Kingdom Red Dragon chamber, all fully visible and non-overlapping.
Subjects: eight modules arranged cleanly in a 4-column x 2-row square atlas: (1) normal rectangular blue-gray cobblestone floor tile, (2) cracked/rubble floor tile, (3) soot-and-ember hazard tile with no open flame, (4) one-cell raised stone landing with readable height edge, (5) low broken-stone half-cover segment, (6) heavy aged-oak crate cover, (7) hearth-brick objective tile with cold iron trivet and no flame, (8) compact camp-supply tile with closed sack, wood bundle and black iron pot. Every base tile must match the approved battlefield's three-quarter perspective and fit one rectangular grid cell. Cover pieces must sit on their own matching base tile.
Style/medium: extremely detailed authentic 32-bit pixel art matching Image 1, crisp hand-placed pixel clusters, nearest-neighbor edges, readable silhouettes, no painterly blur, no 3D render.
Composition/framing: square atlas with exactly eight isolated modules, generous empty padding between modules and around the canvas; no module may touch another or be cropped. No labels, frames, gutters or grid lines outside each module.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background for local removal. It must be one uniform magenta color with no shadows, gradients, texture, reflections, floor plane or lighting variation. Do not use #ff00ff anywhere in the modules.
Lighting/mood: neutral consistent three-quarter lighting; no cast shadow outside each module silhouette.
Constraints: tactical environment modules only; no full background scene, character, person, monster, dragon, animal, weapon, food meat, readable text, letter, number, logo, HUD, UI, glowing marker, watermark or chroma spill. Crisp closed silhouettes, generous padding, no contact shadow beyond each tile base.
```

## Validation Pillow

Controle effectue apres conversion et retrait du chroma:

- Nombre de fichiers dans le dossier: `7`.
- Les sept noms attendus sont presents.
- Les cinq scenes s'ouvrent en `RGB`.
- `melee-platforms.webp` et `tactics-tiles.webp` s'ouvrent en `RGBA`.
- `melee-platforms.webp`: alpha `(0, 255)`, `1 159 005` pixels transparents,
  `12 942` partiellement transparents et `400 569` opaques.
- `tactics-tiles.webp`: alpha `(0, 255)`, `1 070 000` pixels transparents,
  `11 755` partiellement transparents et `490 761` opaques.
- Les quatre coins des deux atlas ont un alpha de `0`.
- Aucun pixel magenta visible n'a ete detecte parmi les pixels dont l'alpha est
  superieur a `8`.
- `melee.webp` et `melee-backdrop.webp` ont le meme hash, conformement au choix de
  conserver les plateformes hors du decor.

## Inspection visuelle

- Combat: sol lateral continu, centre libre, cuisine en bord de scene.
- Melee: aucune plateforme jouable integree au fond.
- Plateformes Melee: six silhouettes separees, non rognees et avec dessus marchable.
- RPG: large voie centrale, avant-plan bas et profondeur lisible.
- Tactics: angle trois-quarts eleve, jamais top-down ni diamond-isometric.
- Tactics: comptage visuel final de huit colonnes et six lignes, soit 48 cases.
- Tactics: les lignes basses sont au premier plan et peuvent masquer logiquement les
  unites placees plus haut.
- Tiles Tactics: huit modules separes et sans frange chroma visible sur fond quadrille.
- Aucun personnage, monstre, dragon, logo, texte lisible, HUD ou watermark observe.

## Integrite du perimetre

Aucun fichier JavaScript, JSX, JSON, manifeste, registre, script ou configuration n'a
ete modifie. Aucun commit, push ou deploiement n'a ete effectue.
