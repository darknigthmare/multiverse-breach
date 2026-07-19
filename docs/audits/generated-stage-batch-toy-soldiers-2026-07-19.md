# Toy Soldiers OpenAI stage pack audit

Date: 2026-07-19

## Scope

This asset-only batch adds the complete seven-file stage pack for:

- `public/backgrounds/lore-stages/toy-soldiers/`

No source code, manifest, registry, package file, or Git state was changed as
part of this batch.

## Official visual references

The final environments are original fan-made pixel-art compositions generated
with OpenAI ImageGen. Official material was used to identify the franchise's
visual language and gameplay scale, not to reproduce an existing screenshot.

- [Toy Soldiers HD official game page](https://www.toysoldiersgame.com/toy-soldiers-hd/)
  - Signal Studios' official description and gallery establish antique WWI toy
    armies, European trench dioramas, direct-control emplacements, and the
    surrounding tabletop presentation.
- [Toy Soldiers: HD on Steam](https://store.steampowered.com/app/1446160/Toy_Soldiers_HD/)
  - Official publisher screenshots and copy confirm the combination of muddy
    trenches, artillery sockets, tanks, planes, painted miniatures, and a
    vintage toy-diorama scale.
- [Toy Soldiers HD on PlayStation Store](https://store.playstation.com/en-us/concept/10001327/)
  - Official Accelerate Games gallery references were used for circular turret
    bases, timber-and-sandbag fortifications, painted wood, riveted toy metal,
    ruined miniature villages, and oversized room furniture.

Four full-resolution PlayStation Store gallery images were inspected locally
during generation. They were used only as temporary visual references and are
not included in the delivered pack.

## OpenAI ImageGen direction

Shared constraints for all seven assets:

- original polished, detailed 32-bit pixel art;
- unmistakable miniature WWI diorama on an antique walnut table;
- painted timber, tin, brass, plaster, mud, sandbags, barbed wire, shell
  craters, and empty emplacement sockets;
- no character, soldier, creature, animal, body, or active vehicle;
- no readable text, number, logo, watermark, UI, HUD, or border;
- mode-specific camera and collision readability.

| File | Lore and gameplay direction |
| --- | --- |
| `combat.webp` | Strict lateral duel arena with one continuous trench-top floor, open center, empty turret sockets, and oversized study furniture. |
| `melee.webp` | Side-view platform-fighter base with a continuous lower floor, open airspace, layered trenches, and no baked floating platform. |
| `melee-backdrop.webp` | Distant parallax-only WWI diorama and antique study, without a close collision ledge or foreground obstruction. |
| `melee-platforms.webp` | Eight isolated side-view platforms covering timber, sandbags, riveted tin, walnut, ruins, mud, brass, and a reinforced bridge. |
| `rpg.webp` | Readable lateral 2.5D party lane with a broad empty duckboard walkway and recessed trench scenery. |
| `tactics.webp` | Elevated frontal three-quarter battlefield with one fully visible rectangular board of exactly 8 columns by 6 rows; not top-down. |
| `tactics-tiles.webp` | Exactly 48 isolated three-quarter assets in 8 columns by 6 rows: walkable tiles, covers, obstacles, sockets, ramps, and bridges. |

The first tactics generation was rejected because ImageGen reduced the board to
six columns. A dedicated 8-by-6 perspective guide was then supplied to ImageGen
and the final compliant 48-cell board was regenerated.

## Exact output files

| File | Dimensions | Mode | Bytes | SHA-256 prefix |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 329840 | `36eedfc31c494d58` |
| `melee.webp` | 1672x941 | RGB | 421932 | `34b113d314a36cad` |
| `melee-backdrop.webp` | 1672x941 | RGB | 376674 | `e68f3b83cf8f4782` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 735888 | `4383c694b2a9a0c2` |
| `rpg.webp` | 1672x941 | RGB | 472932 | `7fb4a52e41af4bd6` |
| `tactics.webp` | 1448x1086 | RGB | 644442 | `553aedc0100ecb25` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 606208 | `c9bcd8e245e7ec9b` |

The target directory contains exactly these seven files.

## Alpha and chroma QA

Both atlases were generated on a uniform chroma-green background, processed
with the ImageGen skill's `remove_chroma_key.py` helper using a soft matte,
one-pixel edge contraction, and despill, then exported as lossless RGBA WebP.

| File | Transparent pixels | Partial-alpha pixels | Visible green pixels | Non-zero RGB under alpha 0 | Corner alpha |
| --- | ---: | ---: | ---: | ---: | --- |
| `melee-platforms.webp` | 1173747 | 41812 | 0 | 0 | `0 / 0 / 0 / 0` |
| `tactics-tiles.webp` | 1300959 | 20323 | 0 | 0 | `0 / 0 / 0 / 0` |

The final atlases were inspected over a light/dark checkerboard. No green
fringe, opaque chroma field, clipped asset, or overlap remained.

Atlas separation checks:

- `melee-platforms.webp`: 4 occupied row bands and 2 occupied column bands,
  matching 8 separated pieces;
- `tactics-tiles.webp`: 6 occupied row bands and 8 occupied column bands,
  matching 48 separated assets.

## Final visual review

- All seven final WebP files reopen successfully from their project paths.
- Combat and RPG have stable, unobstructed lateral gameplay lanes.
- Melee preserves open aerial space and contains no baked floating platform.
- The melee backdrop contains only distant parallax scenery.
- Tactics uses visible board thickness and converging perspective, so it reads
  as elevated frontal three-quarter rather than top-down.
- The tactics board contains exactly 8 columns, 6 rows, and 48 readable cells.
- All obstacles remain aligned inside individual tactics cells.
- Platform tops are horizontal, separated, and usable for collision placement.
- No character, soldier, creature, readable text, logo, watermark, UI, or HUD
  was found during final inspection.

## Repository boundaries

Only the following project paths were written:

- `public/backgrounds/lore-stages/toy-soldiers/`
- `docs/audits/generated-stage-batch-toy-soldiers-2026-07-19.md`

Concurrent workspace changes outside these paths were left untouched. No commit
was created.
