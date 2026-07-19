# Splatterhouse stage batch - OpenAI ImageGen audit

Date: 2026-07-19

## Scope

This asset-only batch adds one complete original stage pack under:

`public/backgrounds/lore-stages/splatterhouse/`

The pack contains exactly the seven requested runtime assets:

- `combat.webp`
- `melee.webp`
- `melee-backdrop.webp`
- `melee-platforms.webp`
- `rpg.webp`
- `tactics.webp`
- `tactics-tiles.webp`

The visual anchor is West Mansion from the first 1988 arcade game and its
1990 PC Engine/TurboGrafx-16 conversion. The generated work is an original
fan-made environment interpretation. No official bitmap, manual illustration,
game screenshot, character, creature, logo, text, or UI element is embedded in
the final files.

## Source and rights context

Splatterhouse is a Namco property. Konami is relevant here because it published
the PC Engine mini product, its official game lineup, and the digitalized
TurboGrafx-16 manual. The official Konami manual itself retains the original
1988/1990 Namco copyright notice, while the current PC Engine mini lineup
attributes the game to Bandai Namco Entertainment.

## References consulted

### Official and licensed sources

- [Konami PC Engine mini - official Splatterhouse digital manual](https://dds.konami.com/games/manual/pcemini/en_Splatter.pdf)
  - Preserves the original TurboGrafx-16 manual.
  - Defines West Mansion as the abandoned home and research laboratory of
    parapsychologist Dr. West.
  - Establishes the storm approach with rain, darkness, lightning, and entry
    into the mansion.
  - Lists the seven-stage progression: Underground Dungeon, Sewage Canal,
    Forest Ambush, Forbidden Room, Rendezvous, Womb, and Finale.
  - The final art direction retained only architecture, weather, materials,
    route progression, and the underground destination. All explicit monster
    and gore content was excluded.
- [Konami PC Engine mini - official game lineup](https://www.konami.com/games/pcemini/lineup/jp/en/)
  - Lists the 1990 Splatterhouse release and its licensed Bandai Namco
    attribution.
  - Confirms the horror-action structure and area-specific weapons.
- [Konami Europe - PC Engine CoreGrafx mini Splatterhouse announcement](https://www.konami.com/games/eu/en/topics/15230/)
  - Confirms Splatterhouse in the licensed mini-console catalog and Konami's
    M2 emulation partnership.
- [Bandai Namco - Namco Museum official site](https://www.bandainamcoent.com/games/namco-museum)
  - Confirms the original Splatterhouse arcade game in Bandai Namco's licensed
    classic catalog.

### Archival visual sources

- [The PC Engine Software Bible - Splatterhouse](https://pcengine.co.uk/HTML_Games/Splatterhouse.htm)
  - Hosts a scan of the original Japanese Namcot PC Engine manual.
  - The manual art establishes a compact, symmetrical two-storey West Mansion,
    central entrance, upper dormer, tall windows, chimneys, wooded approach,
    and storm framing.
  - Stage thumbnails were used only to identify period color and material
    language: dark timber, cracked masonry, wet forest ground, cellar stone,
    and lateral arcade framing.
- [West Mansion archive - Namco artwork index](https://splatterhouse.kontek.net/artwork.html)
  - Identifies the archived official Namco West Mansion illustration and other
    period artwork.
  - Used as a secondary catalog reference for the mansion silhouette, not as a
    source bitmap.

## Shared art direction

- Original high-detail 32-bit arcade pixel art.
- Crisp, deliberate pixel clusters rather than photorealism or a 3D render.
- Shared palette: blue-black storm, mold green, wet walnut brown, cold
  limestone gray, and restrained candle amber.
- Shared route: ruined mansion entrance, storm-lit inner gallery, cellar
  descent, and subterranean altar chamber.
- Environment only. No character, mask, enemy, creature, corpse, bones, blood,
  gore, body part, weapon, readable text, logo, HUD, UI, or watermark.
- No Crystal Lake camp/cabin language and no Resident Evil or Spencer Mansion
  architecture.

## Per-asset direction

| File | Direction |
| --- | --- |
| `combat.webp` | Strict side view of the ruined entrance hall with one uninterrupted 1v1 floor, storm windows, wet timber, and a cellar passage at the far edge. |
| `melee.webp` | Strict side-view inner gallery, wide clear center, continuous base floor, and no baked floating platform. |
| `melee-backdrop.webp` | Matching gallery architecture with the lower quarter subdued as parallax depth and no foreground collision surface. |
| `melee-platforms.webp` | Eight isolated side-view platforms in a 2-column by 4-row transparent atlas, using wet wood, stone, masonry, balcony, and cellar materials. |
| `rpg.webp` | Shallow elevated 2.5D foyer route from the rain-soaked entrance toward the cellar and distant altar, with a broad unobstructed lane. |
| `tactics.webp` | Elevated three-quarter underground altar chamber with a complete rectangular 8-column by 6-row board, readable cover, drainage, gates, and side passages. |
| `tactics-tiles.webp` | Eight isolated three-quarter floor, drainage, cover, pillar, gate, stair, altar, and barricade pieces in a 2-column by 4-row transparent atlas. |

## OpenAI ImageGen prompts

The built-in OpenAI ImageGen path was used once per requested asset. The two
atlas sources were generated on a flat magenta background and converted to
alpha locally with the installed OpenAI ImageGen chroma-removal helper.

### `combat.webp`

```text
Use case: stylized-concept
Asset type: original game-stage background, combat.webp, final target 1672x941 landscape
Primary request: Create a strict side-view 1v1 combat stage set inside the ruined entrance hall of West Mansion from the first 1988/1990 Splatterhouse era. This must be an original fan-made environment interpretation grounded in the canonical modest two-storey West Mansion, not copied official art.
Scene/backdrop: abandoned parapsychologist's manor entrance, battered central doors, cracked plaster over old masonry, damp walnut wall panels, two tall storm windows with rain and lightning outside, subtle open cellar passage descending at one far edge toward a subterranean ritual chamber. Wet wood and stone, sparse broken furnishings only at extreme edges.
Style/medium: high-detail 32-bit arcade pixel art, crisp deliberate pixel clusters, richly hand-pixelled materials, readable silhouettes, no painterly blur, no photorealism, no 3D render.
Composition/framing: exact orthographic lateral side view, wide 16:9 framing, one single uninterrupted horizontal wooden-and-stone fighting floor across the entire lower quarter, flat readable collision line, large empty center lane for two fighters, no floating or raised platforms.
Lighting/mood: dark arcade horror, cold blue storm light through windows plus restrained amber candle light, damp reflections, ominous but readable.
Color palette: blue-black storm, mold green, wet walnut brown, cold limestone gray, muted amber.
Constraints: environment only; maintain a clean playable center; architectural identity should read as West Mansion and not a summer camp cabin or an ornate police-station mansion.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, explicit violence, weapon, text, letters, numbers, logo, HUD, UI, border, watermark, chroma-key background; no Crystal Lake, Friday the 13th, Resident Evil, Spencer Mansion, laboratory technology, modern furniture.
```

### `melee.webp`

```text
Use case: stylized-concept
Asset type: original game-stage background, melee.webp, final target 1672x941 landscape
Input image: use the immediately preceding generated combat stage only as the architectural, palette, pixel-art, and material continuity reference; create a distinct composition in the same West Mansion.
Primary request: Create a strict side-view melee environment in the ruined inner gallery of West Mansion from the first Splatterhouse era, immediately beyond the entrance hall and leading toward the underground altar passage.
Scene/backdrop: damp walnut gallery, cracked plaster exposing cold stone, three storm windows with rain and lightning, damaged stair landing and a shadowed cellar arch at one edge, hints of old parapsychology study shelves but no readable books or labels, sparse broken wood only at extreme edges.
Style/medium: high-detail 32-bit arcade pixel art matching the reference, crisp deliberate pixel clusters, richly hand-pixelled wood and stone, no painterly blur, no photorealism, no 3D.
Composition/framing: exact orthographic lateral side view, wide 16:9, environment and continuous base floor only; wide clean center arena; absolutely no floating platform, no raised gameplay ledge, no isolated collision slab baked into the scene. Keep foreground simple enough for separate runtime platforms.
Lighting/mood: storm-blue window light, restrained candle amber, wet surfaces, ominous arcade horror, readable low contrast behind future fighters.
Constraints: same canonical modest West Mansion identity as the reference, original fan-made composition, no copied official bitmap.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, explicit violence, weapon, text, letters, numbers, logo, HUD, UI, border, watermark, chroma; no Crystal Lake cabin, Friday the 13th, Resident Evil or Spencer Mansion, no grand marble police-station lobby, no modern technology.
```

### `melee-backdrop.webp`

```text
Use case: precise-object-edit
Asset type: original background-only parallax layer, melee-backdrop.webp, final target 1672x941 landscape
Input image: the immediately preceding West Mansion melee stage is the continuity reference.
Primary request: Recompose that same ruined West Mansion gallery as a clean background-only parallax layer. Preserve its storm windows, damp walnut paneling, cracked stone-and-plaster walls, candle palette, and shadowed descent toward the cellar, while removing all foreground gameplay floor emphasis and all possible collision-looking ledges.
Style/medium: matching high-detail 32-bit arcade pixel art, crisp pixel clusters, same palette and material language, no painterly blur, no photorealism, no 3D.
Composition/framing: strict orthographic side view, wide 16:9. Show only distant architecture: upper wall, windows, rear stair, far cellar arch, recessed doorway and deep shadows. The lower quarter should be subdued dark recess/parallax depth, not a platform, slab, shelf, walkway or playable floor. Keep the center visually quiet for runtime platforms and fighters.
Lighting/mood: cold storm-blue light, restrained amber candles, wet masonry, dark arcade horror.
Constraints: environment only, same canonical modest West Mansion, original fan-made composition, no copied official bitmap.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, weapon, text, letters, numbers, logo, HUD, UI, watermark, chroma; no floating platform or foreground collision surface; no Crystal Lake, Friday the 13th, Resident Evil or Spencer Mansion.
```

### `melee-platforms.webp`

```text
Use case: background-extraction
Asset type: melee-platforms.webp source atlas, final target 1254x1254 square RGBA after chroma removal
Input images: use the two immediately preceding West Mansion melee images only as palette, wood, stone, pixel-art and architectural continuity references.
Primary request: Create exactly eight separate, reusable side-view platform elements for a Splatterhouse West Mansion melee stage: (1) long soaked walnut floorboard platform, (2) long cracked limestone-and-brick ledge, (3) medium iron-bound timber beam platform, (4) medium cellar stone bridge, (5) short broken balcony segment, (6) short altar-step slab, (7) narrow mossy masonry ledge, (8) narrow reinforced wood-and-stone platform.
Style/medium: high-detail 32-bit arcade pixel art matching the reference, crisp deliberate pixel clusters, readable top surfaces and dark undersides, original fan-made designs.
Composition/framing: square atlas, exactly eight complete isolated horizontal platform silhouettes arranged in a clean 2-column by 4-row layout, all pieces fully inside canvas, generous uniform empty spacing between every piece, no overlap, no touching, no cropping, no shared base, no labels. Strict side elevation, not isometric.
Background: perfectly flat solid #FF00FF chroma-key background covering every pixel outside the objects. One uniform color only, no shadows, gradients, texture, reflections, floor plane or lighting variation. Do not use #FF00FF anywhere in the objects.
Lighting/mood: restrained storm-blue rim light and candle-amber accents, damp wood and cold stone.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, weapon, text, letters, numbers, logo, HUD, UI, watermark; no cast shadow, contact shadow or reflection on the magenta background; no Crystal Lake, Friday the 13th, Resident Evil, modern materials, sci-fi parts.
```

### `rpg.webp`

```text
Use case: stylized-concept
Asset type: original game-stage background, rpg.webp, final target 1672x941 landscape
Input images: use the preceding West Mansion combat, melee, backdrop, and platform atlas only as architectural, material, palette, and pixel-art continuity references.
Primary request: Create a broad 2.5D RPG exploration-and-battle lane through the ruined entrance of West Mansion from the first Splatterhouse era, connecting the rain-soaked exterior approach to the inner foyer and its descent toward a subterranean altar.
Scene/backdrop: modest two-storey West Mansion entrance visible through broken doors and storm windows, wet overgrown approach at the far rear, cracked limestone threshold, soaked walnut floorboards, damp stone foundation, a wide central foyer route that bends gently toward a shadowed cellar stair and distant candlelit altar arch. No grand palace scale.
Style/medium: high-detail original 32-bit arcade pixel art matching the references, crisp deliberate pixel clusters, hand-pixelled wet wood and stone, no painterly blur, no photorealism, no 3D render.
Composition/framing: wide 16:9, shallow elevated three-quarter 2.5D camera, clearly visible depth but never top-down, a very broad uninterrupted walkable lane occupying the center and lower middle, open enough for a party and enemies, obstacles confined to outer edges, readable entrances and path progression.
Lighting/mood: cold lightning through rain and windows, sparse candle amber down the cellar route, dark arcade horror yet gameplay-readable.
Color palette: blue-black storm, mold green, wet walnut brown, cold limestone gray, muted amber.
Constraints: environment only; canonical modest West Mansion identity; original fan-made composition; the route should feel like entrance-to-underground progression from the first game.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, explicit violence, weapon, text, letters, numbers, logo, HUD, UI, border, watermark, chroma; no Crystal Lake or summer camp, Friday the 13th, Resident Evil or Spencer Mansion, modern lab, police station, ornate marble ballroom.
```

### `tactics.webp`

```text
Use case: stylized-concept
Asset type: original tactics battlefield background, tactics.webp, final target 1448x1086 RGB, 4:3 landscape
Input images: use the preceding West Mansion stage assets only for architectural, material, palette, and high-detail pixel-art continuity.
Primary request: Create an elevated three-quarter tactical battlefield in the subterranean altar chamber beneath West Mansion from the first Splatterhouse era.
Scene/backdrop: damp vaulted limestone cellar, soaked timber supports, shallow drainage channels, stormwater seepage, an ancient plain stone altar on a raised dais at the far rear, candle niches and iron cellar gates, ruined steps and two clear side passages. Ominous arcade horror without gore or occult text.
Style/medium: original high-detail 32-bit arcade pixel art, crisp deliberate pixel clusters, hand-pixelled wet stone and wood, no painterly blur, no photorealism, no 3D render.
Composition/framing: 4:3. Elevated three-quarter camera around 30-35 degrees above ground, never top-down and never flat side-view. At the center, show one complete rectangular tactical board of exactly 8 columns by 6 rows, all 48 cells visible and countable. Straight rectangular outer boundary, rows recede in perspective, not a diamond isometric grid. Keep the entire 8x6 board inside the frame with generous margin. Grid seams must be crisp and unambiguous. Place low broken pew-like timber cover, two cracked pillar bases and drainage gaps only along selected cell edges so lanes and passages remain readable; do not obscure grid intersections. Altar and gates sit beyond the far edge, not on top of the board.
Lighting/mood: cold blue damp reflections with restrained amber candle light; dark but every cell and passage readable.
Color palette: blue-black shadow, cold limestone gray, mold green, wet walnut brown, muted amber.
Constraints: environment only; exact 8x6 rectangular grid; original fan-made West Mansion interpretation.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, explicit violence, weapon, text, letters, numbers, logo, HUD, UI, watermark, chroma; no top-down view, no diamond board, no hex grid, no missing/cropped cells, no overlapping scenery hiding the grid; no Crystal Lake, Friday the 13th, Resident Evil, Spencer Mansion, sci-fi machinery.
```

### `tactics-tiles.webp`

```text
Use case: background-extraction
Asset type: tactics-tiles.webp source atlas, final target 1254x1254 square RGBA after chroma removal
Input image: use the immediately preceding West Mansion subterranean 8x6 tactics battlefield as the exact perspective, stone, wood, lighting, palette, and pixel-art continuity reference.
Primary request: Create exactly eight separate reusable elevated three-quarter tactical terrain pieces from that chamber: (1) plain wet cracked limestone floor tile, (2) moss-edged drainage floor tile, (3) broken walnut timber low-cover tile, (4) cracked round pillar-base cover tile, (5) short iron cellar-gate cover tile, (6) collapsed stone stair/passage tile, (7) low candleless altar-dais objective tile, (8) ruined wood-and-stone barricade tile.
Style/medium: original high-detail 32-bit arcade pixel art matching the tactics background, crisp deliberate pixel clusters, readable damp materials, no painterly blur, no photorealism, no 3D render.
Composition/framing: square atlas, exactly eight complete isolated pieces arranged in a clean 2-column by 4-row layout. Every piece uses the same elevated three-quarter perspective and rectangular footprint as the battlefield grid. All pieces fully inside canvas with generous uniform empty spacing, no overlap, no touching, no cropping, no shared board, no labels. Each silhouette must be individually extractable.
Background: perfectly flat solid #FF00FF chroma-key background covering every pixel outside the pieces. One uniform color only, no shadows, gradients, texture, reflections, floor plane or lighting variation. Do not use #FF00FF anywhere in the pieces.
Lighting/mood: cold blue damp rim light with restrained amber highlights, consistent with the chamber.
Avoid: any person, character, figure, silhouette, face, mask, enemy, monster, creature, corpse, bones, gore, blood, body parts, weapon, text, letters, numbers, logo, HUD, UI, watermark; no cast shadow, contact shadow or reflection on the magenta background; no top-down tiles, no diamond isometric tiles, no hexes, no overlap; no Crystal Lake, Friday the 13th, Resident Evil, sci-fi parts.
```

## Post-processing

- All seven source images were created with the built-in OpenAI ImageGen tool.
- The opaque sources were encoded as lossless RGB WebP.
- `melee-platforms.webp` and `tactics-tiles.webp` were generated on flat
  magenta, processed with the installed
  `remove_chroma_key.py` OpenAI ImageGen helper using border key sampling,
  soft matte, threshold `12..220`, and despill, then encoded as lossless RGBA
  WebP.
- The ImageGen `tactics` source was `1447x1087`. It was normalized to the
  required `1448x1086` without resampling the board: one bottom edge row was
  cropped and one dark right-edge column was duplicated.
- Fully transparent pixels were normalized to RGB `(0, 0, 0)`.

## File validation

| File | Dimensions | Mode | Bytes | SHA-256 prefix |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1,797,492 | `02104dd6187a204c` |
| `melee.webp` | 1672x941 | RGB | 1,813,786 | `5f9f8b4d10c0f877` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1,428,578 | `facc6d7a8653d00f` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 731,336 | `348b5a92b29f9cb0` |
| `rpg.webp` | 1672x941 | RGB | 2,040,466 | `feab1bd25d1b5389` |
| `tactics.webp` | 1448x1086 | RGB | 2,241,624 | `dcc65ebe2a685ed9` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 1,249,254 | `b948b0c55bd759cd` |

Final directory checks:

- Expected WebP files: `7`
- Present WebP files: `7`
- Missing files: `0`
- Extra files: `0`
- All seven files reopen successfully from their final project paths.

## Alpha and atlas validation

| File | Alpha range | Transparent | Partial alpha | Opaque | Hidden RGB under alpha 0 | Visible magenta | Corner alpha |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `melee-platforms.webp` | 0..255 | 1,114,122 | 15,760 | 442,634 | 0 | 0 | 0 / 0 / 0 / 0 |
| `tactics-tiles.webp` | 0..255 | 815,926 | 15,512 | 741,078 | 0 | 0 | 0 / 0 / 0 / 0 |

Separation checks:

- Both atlases contain visible alpha content in every cell of the intended
  2-column by 4-row layout.
- `melee-platforms.webp` has a 14-pixel fully transparent central gutter and
  transparent row gaps between 112 and 144 pixels.
- `tactics-tiles.webp` has a 114-pixel fully transparent central gutter and
  transparent row gaps between 44 and 55 pixels.
- No element overlaps or touches another element, and none is cropped.

## Visual review

- `combat.webp` is a strict side view with one continuous horizontal 1v1 floor
  and an open center.
- `melee.webp` is a strict side view with no baked floating platform.
- `melee-backdrop.webp` keeps the same gallery identity while removing
  foreground collision emphasis.
- `melee-platforms.webp` contains eight readable, separate wood/stone platform
  silhouettes in lateral view.
- `rpg.webp` uses a shallow elevated 2.5D angle, a broad unobstructed route, and
  a clear entrance-to-cellar progression.
- `tactics.webp` uses an elevated three-quarter view, never a top-down view.
  The rectangular board was manually counted as 8 columns by 6 rows, with all
  48 cells visible and the cover aligned to readable lanes.
- `tactics-tiles.webp` contains eight non-overlapping pieces matching the
  battlefield's three-quarter perspective and materials.
- The seven files share the same storm-blue, wet-walnut, cold-limestone, mold,
  and candle-amber language.
- Visual inspection found no person, character, mask, enemy, monster, body,
  gore, blood, readable text, logo, HUD, UI, or watermark.
- The architecture remains a compact ruined West Mansion environment and does
  not read as Crystal Lake, a summer camp, Resident Evil, or Spencer Mansion.

## Repository boundaries

This batch did not modify a stage manifest, generated asset registry, global
prompt, source code, package file, lockfile, or Git state. Pre-existing
workspace changes were left untouched.
