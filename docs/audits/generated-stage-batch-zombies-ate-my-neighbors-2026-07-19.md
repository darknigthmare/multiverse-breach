# Zombies Ate My Neighbors stage batch - OpenAI ImageGen audit

Date: 2026-07-19

## Scope

This asset-only batch adds one complete original stage pack under:

`public/backgrounds/lore-stages/zombies-ate-my-neighbors/`

The pack contains exactly the seven requested runtime assets:

- `combat.webp`
- `melee.webp`
- `melee-backdrop.webp`
- `melee-platforms.webp`
- `rpg.webp`
- `tactics.webp`
- `tactics-tiles.webp`

No source code, generated manifest, package file, or Git state was modified as
part of this batch.

## Canon and visual references

### Official and licensed sources

- [Nintendo - Zombies Ate My Neighbors and Ghoul Patrol](https://www.nintendo.com/US/store/products/zombies-ate-my-neighbors-and-ghoul-patrol-switch/)
  - Current licensed product page published by Disney Electronic Content.
  - Confirms the colorful 16-bit horror-comedy direction, the suburban premise,
    the backyard setting, the broad B-movie bestiary, and the 2021 Lucasfilm
    Classic Games rerelease.
- [Official Sega Genesis instruction manual scan](https://segaretro.org/images/e/ed/Zombies_Ate_My_Neighbors_MD_US_Manual.pdf)
  - Preserves the original Konami and LucasArts manual.
  - Used for the period palette, suburban rescue premise, doors, pools,
    barriers, victims, and environmental navigation language.

### Archival visual references

- [The Spriters Resource - Level 01: Zombie Panic](https://www.spriters-resource.com/snes/zombiesneighbours/asset/4008/)
  - Used only to identify the first level's environmental vocabulary:
    saturated lawns, clipped hedge corridors, brick garden walls, pools,
    suburban doors, fences, and separated backyard spaces.
- [VGMaps - Zombies Ate My Neighbors SNES Level 1 map](https://vgmaps.de/maps/view.php?m=13691)
  - Used only to understand the level's broad navigational rhythm and recurring
    materials.
- [World of Nintendo - manual transcript](https://www.world-of-nintendo.com/manuals/super_nes/zombies_ate_my_neighbors.shtml)
  - Secondary archival check for doors, exits, victims, weapons, and stage
    progression terminology.

The final images are original fan-made environment interpretations. No
official screenshot, map, sprite, manual bitmap, character, logo, text, or UI
element is embedded in the generated assets.

## Shared art direction

- Original high-detail 32-bit arcade pixel art.
- Crisp pixel clusters and saturated SNES/Genesis-era color language.
- Early-1990s American suburbia at purple-orange twilight.
- Emerald lawns, clipped hedges, coral brick, pastel teal houses, purple roofs,
  white fences, cyan pools, sheds, back doors, and garden props.
- Campy B-movie danger suggested only by crooked gates, abandoned tools,
  disturbed soil, and empty environmental details.
- No character, victim, zombie, monster, creature, humanoid silhouette, face,
  body part, corpse, gore, blood, weapon, readable text, logo, HUD, or
  watermark.

## Per-asset direction

| File | Runtime direction |
| --- | --- |
| `combat.webp` | Strict side-view suburban backyard with one uninterrupted lawn-and-sidewalk 1v1 floor and a clean central lane. |
| `melee.webp` | Strict side-view hedge maze backyard with a continuous base floor and no baked floating platform. |
| `melee-backdrop.webp` | Matching parallax-only neighborhood depth with a subdued lower quarter and no collision-looking ledge. |
| `melee-platforms.webp` | Eight isolated side-view suburban platforms in a 2-column by 4-row transparent atlas. |
| `rpg.webp` | Shallow elevated 2.5D route through connected yards, pool, hedges, gates, and an empty cemetery corner. |
| `tactics.webp` | Elevated frontal three-quarter battlefield with one complete rectangular 8-column by 6-row board. |
| `tactics-tiles.webp` | Eight isolated frontal three-quarter lawn, patio, hedge, brick, pool, gate, trampoline, and disturbed-soil pieces. |

## Generation and post-processing

- All seven source images were created with the built-in OpenAI ImageGen tool.
- The first combat image established the original palette and architecture.
- The other six generations used that original output, or the matching
  generated gameplay view, only as an internal continuity reference.
- Opaque outputs were encoded as lossless RGB WebP.
- Both atlases were generated on a magenta key, inspected, converted to
  binary alpha, contracted by one pixel for a crisp pixel-art edge, and encoded
  as lossless RGBA WebP with exact transparent RGB preservation.
- Fully transparent pixels contain black RGB values, preventing hidden chroma
  colors from leaking in browser or GPU sampling.

## QA

Visual inspection confirmed:

- coherent palette and architecture across all seven files;
- no copied official bitmap or visible official sprite;
- no character, victim, monster, creature, text, logo, HUD, or watermark;
- a clean 1v1 floor in `combat.webp`;
- no baked floating platform in `melee.webp`;
- a background-only lower quarter in `melee-backdrop.webp`;
- a broad and readable party lane in `rpg.webp`;
- a complete, frontal three-quarter 8x6 rectangular board in `tactics.webp`;
- exactly eight separated, uncropped pieces in each atlas;
- no visible chroma fringe after final alpha cleanup.

| File | Dimensions | Mode | SHA-256 |
| --- | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | `8292104a1cf6e1b1a5097a2089eae83ad6ab09c39a6536b2dad38ad04a285433` |
| `melee.webp` | 1672x941 | RGB | `3d845bfcfaec7dc57114e540e52ac0f45ae64715a3ce8ac528f87ff20807b318` |
| `melee-backdrop.webp` | 1672x941 | RGB | `bd1fa3fa6712b4eca2f817874f6ce6c75ed6ee7f9a03641b765af6a275f573c6` |
| `melee-platforms.webp` | 1254x1254 | RGBA | `695626b11f27a2d4cf1f9e12de8ca75bee42b1fa5559866f53cbeef3342a2d31` |
| `rpg.webp` | 1672x941 | RGB | `639da277eeb8b56aa403aea157added116dbd5010867214be42cec8ff7c57cd5` |
| `tactics.webp` | 1448x1086 | RGB | `8bb4073b3d2916b92bfa887840222606f22182ded31c155019c105957609d217` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | `99653f75e33970e723bd5ca98eee3e387f1be3f3b39196450a954b2b97e501ad` |

Additional alpha checks:

- `melee-platforms.webp`: alpha range `0..255`, 1,213,209 fully
  transparent pixels, 0 non-black hidden RGB pixels, 0 visible magenta-key
  pixels.
- `tactics-tiles.webp`: alpha range `0..255`, 821,263 fully transparent
  pixels, 0 non-black hidden RGB pixels, 0 visible magenta-key pixels.
