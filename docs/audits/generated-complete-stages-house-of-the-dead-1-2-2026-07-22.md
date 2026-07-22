# Complete OpenAI Stage Packs: The House of the Dead 1 and 2 - 2026-07-22

## Scope

This audit covers two complete, original fan-made pixel-art stage packs made
with the built-in OpenAI ImageGen tool:

- `public/backgrounds/lore-stages/house-of-the-dead/`
- `public/backgrounds/lore-stages/house-of-the-dead-2/`

Each folder contains the seven required files. This task did not edit any
manifest, `openai-sprite-prompts`, `generatedStageAssets`, JavaScript, or other
universe. No commit was created.

All reference material was used to identify architecture, route landmarks,
palette, and the original arcade-era visual language. No screenshot, official
sprite, texture, or promotional image was copied into the generated assets.

## Canonical reference log

Research date: 2026-07-22. A reference check was completed before prompting
each of the fourteen targets.

### Primary official and archival sources

1. Sega arcade history, The House of the Dead:
   <https://www.sega.jp/history/arcade/product/9038/>
   - Official Sega identity, 1997 release, Model 2 era, horror-mansion setting,
     branching rescue route, and two-player arcade framing.
2. Sega arcade history, The House of the Dead 2:
   <https://www.sega.jp/history/arcade/product/8991/>
   - Official Sega identity, 1998 release, first-generation NAOMI rendering,
     detailed color treatment, branching routes, and two-player framing.
3. Sega arcade owner manual, The House of the Dead, manual 420-6292-03:
   <https://arcade.segakore.fr/en/manual_102.html>
   - Official cabinet/manual provenance and original arcade production lock.
4. The House of the Dead Official Guide, Sega Official Books:
   <https://segaretro.org/The_House_of_the_Dead_Official_Guide>
   - Official 1998 guide provenance for the Sega Saturn release.
5. Sega Japanese arcade flyer, The House of the Dead:
   <https://flyers.arcade-museum.com/videogames/show/483>
   - Mansion silhouette, storm palette, Gothic massing, and original arcade
     promotional atmosphere.
6. Sega Japanese arcade flyer, The House of the Dead 2:
   <https://flyers.arcade-museum.com/videogames/show/2901>
   - Original 1998 city atmosphere, color contrast, and arcade-era identity.
7. Sega Dreamcast manual, The House of the Dead 2:
   <https://oldgamesdownload.com/wp-content/uploads/The_House_of_the_Dead_2_Manual_Dreamcast_EN.pdf>
   - Official Sega manual text describing the old European city and route.

### Location and screenshot cross-checks

1. Curien Mansion location gallery:
   <https://thehouseofthedead.fandom.com/wiki/Curien_Mansion>
   - Entrance route, old mansion rooms, stone bridge, first research center,
     laboratory checkpoint, industrial hallways, and underground DBR complex.
2. Original The House of the Dead screenshot gallery:
   <https://www.mobygames.com/game/1218/the-house-of-the-dead/screenshots/>
   - Direct checks for Model 2 proportions, dark stone, grated walkways,
     corridor materials, and the mansion approach.
3. The House of the Dead 2 city reference:
   <https://thehouseofthedead.fandom.com/wiki/City>
   - Venetian-style canals, old-city architecture, bridge-connected districts,
     and the contrast between the historic town and modern city sector.
4. Caleb Goldman's headquarters reference:
   <https://thehouseofthedead.fandom.com/wiki/Caleb_Goldman%27s_headquarters>
   - Headquarters silhouette, Point A0063 bridge approach, front courtyard,
     and the old-city-to-high-rise route.
5. Dawn route reference:
   <https://thehouseofthedead.fandom.com/wiki/Dawn>
   - Chapter-five progression from the city square toward the bridge and
     Goldman's headquarters.
6. Original The House of the Dead 2 screenshot gallery:
   <https://www.mobygames.com/game/3588/the-house-of-the-dead-2/screenshots/>
   - Direct checks for alleys, worn stucco, wet streets, bridges, city-square
     massing, and the 1998 Dreamcast/NAOMI color language.

### Target-by-target research lock

| Pack | Target | Reference focus before generation |
| --- | --- | --- |
| HOTD1 | `combat` | Sega history, mansion approach, entrance hall, DBR route transition |
| HOTD1 | `melee` | Stone bridge/courtyard, Gothic atrium, tall mansion volumes |
| HOTD1 | `melee-backdrop` | Sega flyer mansion silhouette, distant facade, underground glow |
| HOTD1 | `melee-platforms` | Bridge parapets, carved galleries, grates, laboratory catwalks |
| HOTD1 | `rpg` | First research center, laboratory halls, final underground route |
| HOTD1 | `tactics` | Laboratory security checkpoint and mansion/lab junction |
| HOTD1 | `tactics-tiles` | Flagstone, checker stone, grates, pipes, riveted thresholds |
| HOTD2 | `combat` | Canal-side plaza, arched stone bridge, alleys, distant tower |
| HOTD2 | `melee` | Wet city square, twin canals, bridges, old-city facades |
| HOTD2 | `melee-backdrop` | City panorama, bridge sequence, official Goldman headquarters view |
| HOTD2 | `melee-platforms` | Bridge coping, canal walls, balconies, timber and iron walkways |
| HOTD2 | `rpg` | Rescue-route plaza, side canals, central bridge, Goldman alignment |
| HOTD2 | `tactics` | Old-city plaza leading toward Point A0063 and headquarters |
| HOTD2 | `tactics-tiles` | Wet limestone, brick, cobble, storm grate, rail and canal edge |

Canonical locks:

- HOTD1 uses the original 1997 mansion and underground DBR research route,
  not the remake. Gothic stone, dark carved wood, old amber lamps, chunky
  riveted machinery, pipes, and restrained cyan-green laboratory light define
  the pack.
- HOTD2 uses the original 1998 Venetian-style unnamed city, not a modern
  remake. Wet pale stone, ochre and faded-red stucco, terracotta roofs, dark
  iron, teal canal water, stone bridges, narrow alleys, and the distant Goldman
  high-rise define the pack.

## Final prompt set

All fourteen prompts used the `stylized-concept` or `background-extraction`
ImageGen use case. Shared locks were:

- original fan-made, highly detailed late-1990s 32-bit arcade pixel art;
- crisp intentional pixel clusters with no painterly blur or photorealism;
- one coherent location and palette per universe;
- no direct recreation of a copyrighted screenshot or official asset;
- no person, agent, scientist, citizen, character, enemy, creature, corpse,
  silhouette, human-shaped statue, gore, blood, body part, weapon, text,
  number, letter, readable sign, poster, logo, UI, HUD, crosshair, border,
  frame, or watermark;
- stable gameplay composition with clear center and lower play areas.

The unique prompt directions were:

| Target | HOTD1 prompt lock | HOTD2 prompt lock |
| --- | --- | --- |
| `combat` | Side-view entrance hall exposing the underground DBR portal; continuous stone/metal floor | Side-view canal plaza, bridge and tower behind a continuous stone quay |
| `melee` | Ruined Gothic atrium, open airspace, lab portal, no baked platform | Open wet canal square, twin bridges, tower, no baked platform |
| `melee-backdrop` | Distant mansion on ridge above subterranean lab windows; no foreground floor | Layered canals and old roofs leading to Goldman headquarters; no foreground floor |
| `melee-platforms` | Exactly six side-view Gothic stone, wood and lab-metal platforms on flat magenta | Exactly six bridge, dock, balcony and canal-wall platforms on flat magenta |
| `rpg` | Frontal three-quarter underground lab battle plane below a Gothic arch | Frontal three-quarter plaza battle plane between side canals and bridge route |
| `tactics` | Unmarked trapezoidal laboratory checkpoint board | Unmarked trapezoidal wet canal-plaza board |
| `tactics-tiles` | Exactly eight equal-footprint Gothic/laboratory cells on flat magenta | Exactly eight equal-footprint wet city/canal cells on flat magenta |

## Outputs

The following contract is identical for both universe folders:

| File | Dimensions | Mode | Alpha | Gameplay lock |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | No | Side-view duel floor with clear center lane |
| `melee.webp` | 1672x941 | RGB | No | Open arena without baked floating platforms |
| `melee-backdrop.webp` | 1672x941 | RGB | No | Distant parallax scenery without collision floor |
| `melee-platforms.webp` | 1254x1254 | RGBA | 0-255 | Six separated side-view platform sprites |
| `rpg.webp` | 1672x941 | RGB | No | Broad frontal three-quarter RPG battle plane |
| `tactics.webp` | 1448x1086 | RGB | No | Frontal three-quarter board with exact 8x6 grid |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 0-255 | Eight separated equal-footprint tactical cells |

The five RGB scene files in each pack were exported as WebP quality 94. The
two RGBA atlases in each pack were exported as lossless exact-alpha WebP.

The HOTD2 RPG source returned at 1671x941. It was normalized without scaling by
replicating only its final edge column, producing the required 1672x941 RGB
resource without changing the gameplay composition.

## Tactics grid

ImageGen produced each tactics environment as an unmarked trapezoidal board. A
deterministic pixel overlay then added nine vertical boundaries and seven
perspective-compressed horizontal boundaries. This creates exactly eight
columns by six rows, or 48 cells.

Grid quadrilaterals in final 1448x1086 pixel coordinates:

- HOTD1: top-left `(266,451)`, top-right `(1182,451)`, bottom-right
  `(1406,940)`, bottom-left `(28,940)`.
- HOTD2: top-left `(405,413)`, top-right `(1043,413)`, bottom-right
  `(1386,996)`, bottom-left `(61,996)`.

Horizontal boundaries use normalized depth values `0.00`, `0.10`, `0.22`,
`0.36`, `0.53`, `0.74`, and `1.00`, so near rows are visibly deeper than far
rows. Both boards remain frontal three-quarter views, not top-down or
diamond-isometric.

## Alpha and chroma processing

The four companion atlases were generated on a flat magenta key and processed
with the installed ImageGen `remove_chroma_key.py` helper using:

- border auto-key sampling;
- soft matte;
- transparent threshold 12;
- opaque threshold 220;
- despill;
- one-pixel edge contraction.

After removal, every pixel with alpha zero was explicitly normalized to RGB
`0,0,0` before lossless WebP export.

Final alpha validation for all four atlases:

- dimensions are exactly 1254x1254;
- decoded mode is RGBA and alpha extrema are exactly 0-255;
- all four corner pixels are fully transparent;
- transparent pixels with non-zero RGB: zero;
- no visible magenta fringe remains;
- connected-component checks find exactly six large platform components and
  eight large tactical-tile components in each universe;
- sprites are separated, non-overlapping, and uncropped.

## File-by-file visual inspection

| Pack | File | Visual result |
| --- | --- | --- |
| HOTD1 | `combat.webp` | Pass: level lower floor, mansion-to-lab transition, clear center |
| HOTD1 | `melee.webp` | Pass: open atrium, no baked platform, clear lower floor |
| HOTD1 | `melee-backdrop.webp` | Pass: distant mansion/lab depth, no foreground collision floor |
| HOTD1 | `melee-platforms.webp` | Pass: exactly six isolated side-view platforms |
| HOTD1 | `rpg.webp` | Pass: frontal three-quarter lab plane, clear left/right positions |
| HOTD1 | `tactics.webp` | Pass: exact readable 8x6 grid, 48 cells, non-top-down perspective |
| HOTD1 | `tactics-tiles.webp` | Pass: exactly eight isolated equal-footprint tiles |
| HOTD2 | `combat.webp` | Pass: level quay, bridge/water behind play lane, tower visible |
| HOTD2 | `melee.webp` | Pass: open plaza, canals behind ground, no baked platform |
| HOTD2 | `melee-backdrop.webp` | Pass: deep canal panorama, corrected roof finial, no text or floor |
| HOTD2 | `melee-platforms.webp` | Pass: exactly six isolated side-view platforms |
| HOTD2 | `rpg.webp` | Pass: frontal three-quarter plaza plane, clear left/right positions |
| HOTD2 | `tactics.webp` | Pass: exact readable 8x6 grid, 48 cells, non-top-down perspective |
| HOTD2 | `tactics-tiles.webp` | Pass: exactly eight isolated equal-footprint tiles |

Every final asset was opened and inspected at final resolution. No final image
contains a character, enemy, body, gore, weapon, readable text, logo, UI, HUD,
crosshair, or watermark.

## Validation result

Pillow decoded every final WebP and verified the exact file set, dimensions,
modes, alpha range, transparent corners, and hidden RGB condition.

| Pack | Files | Decode | Dimensions/modes | Alpha/components | Visual inspection |
| --- | ---: | --- | --- | --- | --- |
| The House of the Dead | 7/7 | Pass | Pass | Pass | Pass |
| The House of the Dead 2 | 7/7 | Pass | Pass | Pass | Pass |

Final result: 14/14 assets pass. Both tactical boards visibly contain exactly
48 cells, all four transparent atlases are clean and separated, and every
scene keeps its required gameplay-safe ground or parallax role.
