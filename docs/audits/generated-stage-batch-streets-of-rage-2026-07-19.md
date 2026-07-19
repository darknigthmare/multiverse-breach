# Streets of Rage stage batch - OpenAI ImageGen audit

Date: 2026-07-19

## Perimetre

Ce lot ajoute exactement un pack de sept decors originaux :

- `public/backgrounds/lore-stages/streets-of-rage/combat.webp`
- `public/backgrounds/lore-stages/streets-of-rage/melee.webp`
- `public/backgrounds/lore-stages/streets-of-rage/melee-backdrop.webp`
- `public/backgrounds/lore-stages/streets-of-rage/melee-platforms.webp`
- `public/backgrounds/lore-stages/streets-of-rage/rpg.webp`
- `public/backgrounds/lore-stages/streets-of-rage/tactics.webp`
- `public/backgrounds/lore-stages/streets-of-rage/tactics-tiles.webp`

Les images ont ete generees avec OpenAI ImageGen apres recherche sur les
pages, captures et manuels officiels SEGA. Les compositions sont des decors
originaux de fan art. Aucun bitmap, sprite, personnage, logo, texte ou HUD
officiel n'est integre aux sorties finales.

Aucun manifeste, registre de prompts global, fichier source, package ou etat
Git n'a ete modifie.

## References officielles consultees

- [SEGA Mega Drive Mini - Bare Knuckle II / Streets of Rage 2](https://www.sega.jp/mdmini/soft/streets-of-rage2.html)
  - Page officielle du titre, date Mega Drive, genre belt-scroll et prise en
    charge de deux joueurs.
  - Les captures officielles confirment la lecture laterale, le rythme de
    beat'em-up et la palette urbaine nocturne.
- [Manuel japonais officiel SEGA Mega Drive Mini](https://www.sega.jp/mdmini/manual/pdf/m_jp_streets-of-rage2.pdf)
  - La double page des stages montre Downtown, Bridge, Amusement Park,
    Stadium, Ship et Jungle.
  - Downtown, Bridge et Ship ont guide le melange de briques, quais,
    rambardes, eau noire, acier et lumieres urbaines.
- [SEGA 3D Archives - Bare Knuckle II](https://archives.sega.jp/3d/bk2/)
  - Les captures officielles `ss02`, `ss03` et `ss04` ont ete inspectees.
  - Elles montrent le pont metallique et sa skyline nocturne, un toit urbain
    borde de rambardes, puis un interieur de bar en briques et bois.
- [SEGA Virtual Console - Bare Knuckle II](https://vc.sega.jp/vc_bknuckle2/)
  - Page officielle avec synopsis, captures et presentation des variations
    de stages du jeu original.
- [SEGA Genesis Mini - index officiel des manuels](https://manuals.sega.com/genesismini/)
  - L'index officiel reference Streets of Rage 2 et son manuel.
- [SEGA Mega Drive Classics - manuel Streets of Rage 2](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71165/manuals/04%20SOR2_PC_MG_EFIGS_US_v6.pdf?t=1733765070)
  - Le manuel decrit le jeu comme un brawler a un ou deux joueurs, le
    deplacement de zone en zone et le choix d'un stage pour le mode Duel.

## Direction visuelle retenue

- Une meme portion de Wood Oak City relie les sept assets : pont levant en
  acier, fleuve, quais, entrepots en briques, fire escapes, bar strip et
  skyline rectangulaire.
- L'architecture reste credible pour le debut des annees 1990 : rideaux
  metalliques, lampadaires, palettes, caisses, futs, armoires techniques,
  rambardes et enseignes geometriques abstraites.
- La palette commune utilise bleu nuit, charbon, rouille, ambre, cyan,
  magenta et petits feux rouges.
- Les enseignes sont volontairement abstraites et sans lettres.
- Aucun gratte-ciel futuriste, hologramme, vehicule volant, robot ou
  technologie de cyber-city n'a ete introduit.

## Prompts OpenAI ImageGen

### Combat

```text
Use case: stylized-concept
Asset type: original landscape combat-stage background for a 2D beat'em-up game
Input images: Image 1 and Image 2 are official SEGA Streets of Rage 2 screenshots; Image 3 is the stage page from the official SEGA manual. Use them only as visual research for authentic early-1990s Mega Drive era, lateral belt-scroll camera, night palette, concrete, steel railings, city lights, bridge and waterfront mood. Do not copy any exact scene layout, sprite pixels, character, HUD, logo, or text from them.
Primary request: Create a completely original, lore-faithful Wood Oak City waterfront combat arena inspired by the urban pier, bridge and neon bar-strip identity of Streets of Rage 2.
Scene/backdrop: Night beside the river in a believable 1990s North American/Japanese arcade-city district: a steel truss or lift bridge in the middle distance, dark water and dock pilings, brick warehouse-bar facades, fire escapes, utility boxes, concrete quay, metal safety railings, stacked crates only at far edges, abstract colored neon panels with no letters, warm amber windows, deep navy sky and distant boxy skyline. No futuristic towers or cyber-city technology.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, deliberate crisp square pixel clusters, layered parallax, limited but rich arcade palette, readable silhouettes and handcrafted dithering; not smooth vector art, not painterly, not 3D render.
Composition/framing: wide 16:9 landscape, strict side-on orthographic beat'em-up camera. One continuous level concrete/asphalt fighting floor spans the full width across the lower 23 percent. Keep the central 60 percent empty and readable for a 1v1 duel. Architecture and props remain behind the play lane or at extreme edges. Strong horizontal rhythm, no perspective vanishing into the screen, no stairs crossing the arena, no gaps, no floating platforms.
Lighting/mood: midnight blue river and sky, cyan and magenta accent neon, sodium amber windows, restrained red bridge lights, wet pavement highlights without mirror-like reflections.
Constraints: environment only, original fan-made composition, no copied official pixel art. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, readable text, letters, numbers, logo, SEGA mark, HUD, health bar, icon, watermark, border, black bars, chroma background, futuristic cyberpunk megacity, hologram, flying car, spaceship, robot, or weapon.
```

### Melee

```text
Use case: stylized-concept
Asset type: original landscape Melee-stage base scene for a 2D platform-brawler game
Input images: Image 1 is the accepted original Wood Oak City combat background and is the binding style, palette, pixel-density and architecture anchor. Image 2 and Image 3 are official SEGA Streets of Rage 2 research references only for 1990s bar-interior and stage identity. Do not copy their layouts, sprites, characters, HUD, text or pixels.
Primary request: Create a new original Wood Oak City dockside neon bar-strip Melee environment that clearly belongs to the same waterfront district as Image 1.
Scene/backdrop: Strict lateral view through a wide open-front brick warehouse bar beside the pier. Exposed red-brown brick, dark steel beams, old fire escape and service doors, scuffed wood and concrete, metal waterfront railing, a glimpse of dark river and the same lift bridge through broad openings, warm amber practical lights, cyan and magenta abstract neon tubes and blank geometric sign panels, a simple bar counter and stools pushed to extreme edges, old arcade-era speaker cabinets and utility fixtures with no screens or lettering. Believable early-1990s urban architecture, not futuristic.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp deliberate square pixel clusters, handcrafted dithering, layered parallax and a rich limited arcade palette matching Image 1; not smooth vector, not painterly, not 3D render.
Composition/framing: exact wide 16:9 landscape, strict side-view orthographic platform-brawler camera. Platform-free base scene: absolutely no floating platform, suspended ledge, jump pad, isolated collision island or baked gameplay platform. Preserve a broad empty lower arena of continuous worn wood transitioning to concrete across the full width, with no obstruction in the center 65 percent. No exaggerated vanishing-point depth.
Lighting/mood: midnight navy exterior, restrained cyan/magenta neon, amber bulbs, wet dock glints, moody but fully readable gameplay contrast.
Constraints: environment only, original fan-made composition. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, readable text, letters, numbers, logo, SEGA mark, HUD, health bar, icon, watermark, border, black bars, chroma background, futuristic cyber-city, hologram, flying car, spaceship, robot, weapon, or copied official pixels.
```

### Melee backdrop

```text
Use case: stylized-concept
Asset type: original parallax backdrop layer for the same 2D platform-brawler Melee stage
Input images: Images 1 and 2 are the accepted original Wood Oak City combat and Melee scenes. Preserve their exact late-16/early-32-bit pixel density, palette, bridge design, brick-and-steel 1990s architecture and lighting language. Image 3 is official SEGA manual research only; do not copy any exact pixel, stage layout, text, HUD, or character.
Primary request: Create the separate platform-free distant backdrop for this Wood Oak City waterfront Melee stage.
Scene/backdrop: A wide nocturnal panorama across the river: the same lift bridge, layered boxy 1980s/1990s skyline, distant brick warehouses and a long dockside bar strip with blank cyan, magenta and amber geometric neon panels, fire escapes, rooftop water tanks, utility poles, pier pilings, dark water and restrained reflections. The city must feel gritty, practical and period-authentic, never futuristic.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp intentional square pixel clusters, limited rich arcade palette, layered atmospheric parallax, handcrafted dithering matching Images 1 and 2; not smooth vector art, not painterly, not 3D render.
Composition/framing: exact wide 16:9 landscape, strict lateral side-view panorama. Backdrop layer only: no foreground gameplay floor, no close concrete apron, no close wood floor, no collidable railing, no floating platform, no ledge, no bridge deck crossing the lower play area, no isolated gameplay object. Keep the lower 25 percent as dark river, shadowed pier pilings and atmospheric depth so transparent platform modules can be overlaid cleanly. Open central composition with landmarks pushed into layered distance.
Lighting/mood: deep navy midnight, amber window rhythm, restrained cyan/magenta neon, red bridge safety lamps, wet river glints.
Constraints: empty original environment only. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, boat, readable text, letters, numbers, logo, SEGA mark, HUD, health bar, icon, watermark, border, black bars, chroma background, futuristic cyber-city, hologram, flying car, spaceship, robot, weapon, or copied official pixels.
```

### Melee platform atlas

```text
Use case: stylized-concept
Asset type: square side-view platform-module atlas for the accepted Wood Oak City Melee stage
Input images: Images 1 and 2 are the accepted original Melee and combat environments. Match their late-16/early-32-bit pixel density, navy/charcoal/rust palette, concrete, steel, brick, timber, wear, cyan/magenta accents and 1990s waterfront material language. Do not reproduce the full scene.
Primary request: Create exactly eight separate opaque side-view platform modules for a Wood Oak City dockside platform-brawler atlas.
Subjects: 1) long worn concrete quay slab with steel fascia and a short safety-rail section only at one end; 2) long riveted dark-steel bridge catwalk with truss underside; 3) medium timber pier deck with heavy pilings and rope wraps; 4) medium corrugated dock-loading platform with steel frame; 5) medium brick-and-concrete warehouse service ledge with fire-escape braces; 6) short reinforced concrete block platform with chipped corners; 7) short riveted I-beam platform with amber hazard reflectors but no stripes or text; 8) short bar-awning/service-canopy platform with restrained cyan and magenta tube accents and no signage.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp deliberate square pixel clusters, handcrafted dithering, strong gameplay silhouettes; no smooth vector, no painterly rendering, no 3D render.
Composition/framing: square atlas. Arrange exactly four rows by two columns, one isolated horizontal platform per slot, eight total. Every module fully visible, separated by generous uniform chroma space, no overlap, no touching, no crop. Strict orthographic side view. Each has one clean, nearly horizontal walkable top edge and a readable underside. Keep all modules inside generous canvas margins. No connected scene, no continuous floor, no platform behind another, no perspective angle.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later removal. The background must be one uniform color with no gradient, texture, floor plane, lighting variation, shadows or reflections. Do not use green anywhere in the platform modules.
Constraints: original fan-made modules only. No person, character, fighter, enemy, gang, silhouette, body, vehicle, motorcycle, weapon, readable text, letters, numbers, logo, SEGA mark, HUD, icon, watermark, border, frame, cast shadow, contact shadow, glow spill, smoke, transparent material, scenery, futuristic cyber-city technology, or copied official pixels.
```

### RPG

```text
Use case: stylized-concept
Asset type: original landscape RPG battle background
Input images: Images 1 and 2 are the accepted original Wood Oak City waterfront combat and Melee scenes and are the binding style, palette, pixel-density and architecture anchors. Image 3 is an official SEGA Streets of Rage 2 manual reference used only for the authentic belt-scroll stage language. Do not copy official layouts, pixels, characters, text or HUD.
Primary request: Create a lore-faithful original Wood Oak City RPG battle street beside the waterfront and neon bar strip, preserving the gritty 1990s beat'em-up identity.
Scene/backdrop: A broad wet asphalt service avenue running parallel to the river. On the far side, 1990s brick warehouses converted into bars with fire escapes, blank cyan/magenta geometric neon panels, roll-up service doors, utility boxes and warm amber windows. On the river side, concrete quay, metal railings, bollards, dock pilings and the same lift bridge receding in the middle distance. A narrow cross street and alley mouths add depth, but remain empty. Period street lamps and old boxy industrial fixtures only; no modern glass towers or futuristic technology.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp intentional square pixel clusters, handcrafted dithering, rich limited arcade palette and layered parallax matching Images 1 and 2; not smooth vector, not painterly, not 3D render.
Composition/framing: exact wide 16:9 landscape. Shallow elevated three-quarter 2.5D JRPG/beat'em-up battle camera, looking roughly 18 to 22 degrees down, never top-down and never strict side-on. The central lower and middle 65 percent is one very broad unobstructed traversable road lane, large enough for a party and enemies, with clear foreground-to-background depth bands. Keep props, railings, parked objects and cover at perimeter only. No grid, no floating platforms, no steep isometric diamonds.
Lighting/mood: midnight navy, wet asphalt, sodium amber pools, restrained cyan and magenta neon, red bridge safety lights, readable silhouettes and floor values.
Constraints: empty original environment only. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, readable text, letters, numbers, logo, SEGA mark, HUD, health bar, icon, watermark, border, black bars, chroma background, futuristic cyber-city, hologram, flying car, spaceship, robot, weapon, or copied official pixels.
```

### Tactics - generation initiale

```text
Use case: stylized-concept
Asset type: original 4:3 tactical battlefield background with an exact rectangular grid
Input images: Image 1 is the accepted original Wood Oak City RPG waterfront avenue and is the binding camera-material-palette anchor. Image 2 is the accepted side-view combat stage and binds the bridge, skyline and 1990s dock architecture. Image 3 is official SEGA manual research only. Do not copy official layouts, pixels, characters, text or HUD.
Primary request: Create a new original Wood Oak City tactical battle map in a waterfront loading yard behind the neon bar strip, clearly the same gritty 1990s district.
Scene/backdrop: Wet concrete and asphalt loading court between brick warehouses and the river. Use the same lift bridge, dark water, dock pilings, steel safety railings, fire escapes, roll-up service doors, blank cyan/magenta neon panels, amber lamps, pallets, low concrete blocks, metal crowd-control rails, dumpsters and utility cabinets. All architecture and objects must be plausible in 1992. No futuristic technology.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp deliberate square pixel clusters, limited rich arcade palette, handcrafted dithering and readable tactical silhouettes matching the input images; not smooth vector, not painterly, not 3D render.
Composition/framing: 4:3 landscape, elevated three-quarter camera looking about 30 degrees downward across one single wide rectangular battlefield plane. NEVER top-down, NEVER flat overhead, NEVER diamond-isometric. The complete board must be fully visible with generous margin on every side. Draw exactly 8 columns and exactly 6 rows of perspective quadrilateral cells: 48 cells total, made by exactly 9 left-to-right longitudinal boundary lines and exactly 7 near-to-far cross boundary lines. The grid outer boundary is a clear rectangle in world space; lower cells visibly larger than upper cells. Use thin worn painted seams and subtle metal inlays integrated into the concrete, no glowing holographic grid.
Gameplay readability: Keep at least three continuous passages across the board. Place only a small number of low cover props on selected edge or corner cells, never across boundary intersections and never hiding the central routes. Every cell boundary remains countable; doors and routes are visibly reachable. No floating platforms.
Lighting/mood: midnight navy, wet asphalt, sodium amber pools, restrained cyan/magenta neon, red bridge safety lamps; floor and grid remain clearly readable.
Constraints: empty original environment only. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, readable text, letters, numbers, logo, SEGA mark, HUD, health bar, icon, watermark, border, black bars, chroma background, futuristic cyber-city, hologram, flying car, spaceship, robot, weapon, hex grid, diamond cells, or copied official pixels.
```

La generation initiale a ete rejetee pendant l'inspection parce qu'elle
contenait plus de six rangees. Un guide temporaire exact, compose de neuf
limites longitudinales et sept limites transversales, a ete cree uniquement
pour contraindre la geometrie des deux corrections ImageGen suivantes. Le
guide temporaire n'est pas un asset du depot et n'est pas inclus dans la
sortie finale.

### Tactics - correction guidee

```text
Use case: precise-object-edit
Asset type: corrected 4:3 tactical battlefield background
Input images: Image 1 is a mandatory exact geometry guide containing exactly 9 yellow longitudinal boundary lines and exactly 7 cyan cross-boundary lines, which define exactly 8 columns by 6 rows, 48 cells. Image 2 is the edit target: the accepted Wood Oak City tactical loading-yard scene whose current grid has too many rows. Image 3 is a supporting palette and architecture reference for the same original stage pack.
Primary request: Edit Image 2 by replacing only its battlefield-grid geometry so the final board follows Image 1 exactly: exactly 8 columns and exactly 6 rows, no more and no fewer.
Mandatory grid correction: erase every existing grid seam from Image 2 first. Then redraw one and only one perspective grid with exactly 9 near-to-far longitudinal boundary lines and exactly 7 left-to-right cross-boundary lines, including outer boundaries. This creates exactly 48 cells. Copy the line count, spacing logic and trapezoidal three-quarter arrangement of Image 1, but render the lines as thin worn brass/paint seams integrated into wet concrete rather than yellow/cyan guide colors. Do not subdivide any cell. Do not add decorative parallel seams, double grids, partial grid lines, extra rows, extra columns or tiny cells around the perimeter.
Preserve from Image 2: the original high-detail late-16/early-32-bit pixel-art rendering, 4:3 framing, elevated three-quarter camera around 30 degrees, brick warehouse bar strip, same lift bridge, river, railings, dock pilings, crates, low cover, dumpsters, amber lamps, cyan/magenta blank neon panels, navy/charcoal/rust palette and three clear traversal passages.
Gameplay readability: the complete 8x6 board remains fully visible with margin on all sides; lower rows visibly larger than upper rows; every cell boundary countable; sparse low cover stays on edge cells and does not hide intersections. Never top-down, never flat overhead, never diamond-isometric, never hexagonal.
Constraints: change the grid count and spacing only as needed; preserve the empty environment. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, motorcycle, readable text, letters, numbers, logo, SEGA mark, HUD, icon, watermark, border, black bars, futuristic cyber-city, hologram, robot, weapon, or copied official pixels.
```

Cette premiere correction avait les huit colonnes attendues, mais conservait
sept rangees. Elle a egalement ete rejetee.

### Tactics - correction finale d'une rangee

```text
Use case: precise-object-edit
Asset type: final corrected Wood Oak City tactical battlefield
Input images: Image 1 is the edit target. It already has the correct scene, elevated three-quarter camera and exactly 8 columns, but visual inspection found 7 rows because it has 8 cross-boundary lines. Image 2 is the exact 8-column by 6-row geometry guide with only 7 cross-boundary lines.
Primary request: Make one surgical grid correction to Image 1: reduce the board from 7 rows to exactly 6 rows.
Exact edit: remove exactly one internal left-to-right cross-boundary seam from the current grid, preferably the central extra seam, and retouch the exposed strip as matching wet asphalt. Then redistribute or redraw the remaining cross-boundary seams so there are exactly 7 total cross-boundary lines including the far outer edge and near outer edge. Seven cross lines produce exactly 6 rows. Preserve all 9 existing near-to-far longitudinal boundary lines unchanged, because they already produce exactly 8 columns. Final result: 9 longitudinal lines crossed by 7 cross lines, exactly 48 cells.
Do not add a replacement decorative seam. Do not double any line. Do not subdivide any cell. Do not create a thin seventh row at the far or near edge. Use Image 2 as the binding count and spacing guide.
Preserve everything else from Image 1: original 1448x1086 4:3 framing, high-detail late-16/early-32-bit pixel art, elevated three-quarter camera, waterfront loading yard, brick neon bar strip, lift bridge, river, dock railings, sparse edge cover, empty passages, palette and lighting.
Constraints: modify only the cross-row grid count and the asphalt immediately around the removed line. No person, character, fighter, enemy, gang, silhouette, body, portrait, vehicle, readable text, letters, numbers, logo, HUD, icon, watermark, futuristic technology, top-down camera, diamond-isometric board, hex grid, extra row, extra column, or copied official pixels.
```

### Tactics tile atlas

```text
Use case: stylized-concept
Asset type: square tactical terrain-and-cover atlas for the accepted Wood Oak City 8x6 battlefield
Input images: Image 1 is the accepted original Wood Oak City tactics map and is the binding elevated three-quarter camera, grid footprint, pixel density, material and palette anchor. Image 2 reinforces the same waterfront road materials and 1990s architecture. Do not reproduce the full scenes.
Primary request: Create exactly eight separate opaque tactical terrain pieces for the same Wood Oak City dockside battlefield.
Subjects: 1) plain wet dark-asphalt quadrilateral tile with subtle worn seam; 2) cracked concrete loading-yard quadrilateral tile with a round drain; 3) timber pier-deck quadrilateral tile with steel edge; 4) brick bar-threshold quadrilateral tile with restrained cyan/magenta tube accents but no sign; 5) asphalt tile carrying one low chipped concrete cover barrier; 6) concrete tile carrying one short riveted steel safety-rail cover; 7) dock tile carrying a compact stack of two wooden crates and one low pallet; 8) asphalt tile carrying one squat 1990s metal utility cabinet and a small bollard. No more than the listed objects.
Style/medium: original high-detail late-16-bit / early-32-bit pixel art, crisp deliberate square pixel clusters, handcrafted dithering, rich limited navy/charcoal/rust/amber/cyan/magenta arcade palette matching the input images; no smooth vector, no painterly rendering, no 3D render.
Camera and footprints: every piece uses the exact same elevated three-quarter rectangular-grid camera as Image 1, looking about 30 degrees down. Rectangular world-space footprints become shallow perspective quadrilaterals, with near edges visibly deeper than far edges. Never top-down, never flat overhead, never diamond-isometric, never hexagonal.
Composition/framing: square atlas arranged exactly two rows by four columns, one isolated piece centered in each slot, eight total. Equal generous spacing, no overlap, no touching, no crop, no connected terrain, no piece behind another. Keep all pieces fully inside large canvas margins. Cover silhouettes must be readable and leave most of each tile footprint visible.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later removal. The background must be one uniform color with no gradient, texture, floor plane, lighting variation, shadows or reflections. Do not use green anywhere in any piece.
Constraints: original fan-made pieces only. No person, character, fighter, enemy, gang, silhouette, body, vehicle, motorcycle, weapon, readable text, letters, numbers, logo, SEGA mark, HUD, icon, watermark, border, frame, cast shadow outside the tile footprint, glow spill, smoke, glass, semi-transparent material, scenery, futuristic cyber-city technology, or copied official pixels.
```

## Traitement des sorties

- Outil de generation : OpenAI ImageGen integre.
- Les cinq scenes ont ete produites directement aux dimensions finales :
  - `1672x941` pour Combat, Melee, Melee backdrop et RPG ;
  - `1448x1086` pour Tactics.
- Les deux atlas ont ete produits directement en `1254x1254` sur chroma vert.
- Couleurs chroma echantillonnees automatiquement :
  - `melee-platforms.webp` : `#05f903` ;
  - `tactics-tiles.webp` : `#03f904`.
- Detourage :
  - `remove_chroma_key.py --auto-key border --soft-matte`
  - `--transparent-threshold 12 --opaque-threshold 96`
  - `--despill --edge-contract 1`
- Le RGB a ete force a zero sous alpha nul.
- Les sept sorties finales sont des WebP lossless.
- Aucun redimensionnement, crop ou dessin de grille n'a ete applique aux
  assets finaux apres ImageGen.

## Validation des fichiers

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1754136 | `B65903E0FE18907F963BBC93C999B0DA45A755530FBDB4E0F50A6B4E47A27AD0` |
| `melee.webp` | 1672x941 | RGB | 1779278 | `A1E9BA18C78440560FA0C2EDD62FEB753F198331C45705D8E8CD14072CCA2AFA` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1656732 | `BD5750F3E28AACD72C8A881C2542BE824FC23A3030D8B75E3AEEFE7936515FB2` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 724752 | `FB2D2B170EC063EE4C9479D12F8EEE8D00FC0BA0E8B1F0BBF45B29BF6F808E29` |
| `rpg.webp` | 1672x941 | RGB | 1895018 | `A20E9DF27874F802FB2ED79F9AC7F2DD51D1548CBF4AF5A15158A961A327240D` |
| `tactics.webp` | 1448x1086 | RGB | 2256232 | `96DC408B2C9C2DB104BD3B79573328B1A4157C80F8D2E916D3F300E37E532410` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 540414 | `BC4BC4168D41B88126D4E678C1268056A3A7E6E0373CABB9590529BE9F101C4B` |

## Validation alpha

| Fichier | Alpha | Pixels transparents | Alpha partiel | Chroma visible | RGB sous alpha 0 | Bord opaque | Composantes principales |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 0..255 | 1085518 | 21258 | 0 | 0 | 0 | 8 |
| `tactics-tiles.webp` | 0..255 | 1287269 | 7177 | 0 | 0 | 0 | 8 |

Pour les deux atlas :

- alpha nul dans les quatre coins ;
- aucun pixel opaque ou partiel ne touche le bord de la toile ;
- aucune frange verte detectee avec le seuil
  `G - max(R, B) >= 16` pour les pixels visibles ;
- huit grandes composantes separees detectees ;
- aucun chevauchement ou crop constate sur la planche contact.

## Inspection visuelle

- Exactement sept WebP finaux sont presents dans le dossier.
- `combat.webp` est une vue laterale stricte avec un sol continu sur toute la
  largeur et une voie centrale 1v1 degagee.
- `melee.webp` est une vue laterale sans plateforme flottante bakee.
- `melee-backdrop.webp` est une couche distante de skyline, fleuve, pont et
  bar strip, sans sol ou geometrie de collision au premier plan.
- `melee-platforms.webp` contient huit modules lateraux separes, non
  superposes, avec des dessus praticables lisibles en beton, acier, brique et
  bois de quai.
- `rpg.webp` utilise une vue 2.5D peu plongeante et conserve une large voie
  centrale vide.
- `tactics.webp` utilise une perspective elevee trois-quarts, jamais
  top-down. Neuf limites longitudinales et sept limites transversales ont ete
  comptees : exactement 8 colonnes par 6 rangees, soit 48 cases.
- Les couvertures tactiques restent en bordure ; le centre et plusieurs
  passages transversaux sont degages.
- `tactics-tiles.webp` contient huit pieces non superposees en deux rangees
  de quatre, toutes dans le meme angle trois-quarts que le plateau.
- Les sept assets partagent le meme pont, la meme skyline, le meme bar strip,
  les memes materiaux et la meme palette.
- Aucun personnage, ennemi, gang, silhouette humaine, texte lisible, lettre,
  nombre, logo, HUD, watermark ou chroma n'a ete trouve.
- Aucun element ne fait basculer le district vers une cyber-city futuriste.
- Chaque WebP final a ete rouvert depuis son chemin de projet et inspecte
  individuellement puis sur une planche contact.

Resultat : `STREETS_OF_RAGE_STAGE_BATCH_VALID`

## Limites du depot

Cette tache n'a pas modifie :

- `src/game/generatedStageAssets.json` ;
- un manifeste de sprites ou de decors ;
- un prompt global ;
- le code applicatif ;
- `package.json` ;
- l'etat Git.

Les autres modifications deja presentes dans le workspace ont ete laissees
intactes.
