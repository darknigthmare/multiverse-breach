# Independent Stage QA: Final Fantasy VII and Left 4 Dead - 2026-07-22

## Result

**PASS: 14/14 assets. No blocking flaw found.**

Every file was opened individually with `view_image` at original detail. Pillow
then decoded the same files for native dimensions, color mode, alpha extrema,
transparent-pixel RGB, edge contact, chroma residue, and atlas separation.

No asset was regenerated or edited. No JavaScript, JSON, manifest, or registry
file was changed. Since there is no blocking flaw, no parent escalation is
required.

## Scope

- `public/backgrounds/lore-stages/final-fantasy-vii/` (7 files)
- `public/backgrounds/lore-stages/left-4-dead/` (7 files)
- Visual review: composition, playable geometry, perspective, clipping,
  characters, UI, text, logos, and location continuity.
- Pixel review: dimensions, Pillow mode, alpha range, transparent RGB, visible
  magenta-key residue, edge contact, and fully transparent atlas gutters.
- Tactics review: manual count of all grid boundaries and cells at native
  `1448x1086` resolution.

The SHA-256 values below are 16-character prefixes identifying the exact files
that were inspected.

## Official reference baseline

### Final Fantasy VII

1. [Square Enix, FINAL FANTASY VII - Digital](https://fr.store.square-enix-games.com/final-fantasy-vii---digital)
   identifies Midgar, Shinra, Mako extraction, and the destruction of Mako
   Reactor No. 1. Its official classic-game gallery shows the reactor as a
   circular industrial complex with dense machinery, stacks, steam, and green
   Mako illumination.
2. [Square Enix, FINAL FANTASY VII REMAKE](https://www.square-enix.com/ffvii/en-us/games/remake/)
   explicitly anchors the opening operation to Mako Reactor 1 and describes
   Mako as the life force exploited by Shinra to power Midgar.

Continuity verdict: all seven assets consistently read as Mako Reactor 1. The
rust-brown steel, pipes, pressure vessels, catwalks, point lamps, steam, deep
reactor shaft, and emerald Mako underlight remain coherent across modes. The
pack does not introduce unrelated Midgar streets, characters, or signage.

### Left 4 Dead

1. [Valve, Left 4 Dead campaigns](https://www.l4d.com/l4d/campaigns.htm)
   identifies No Mercy as beginning on a Fairfield rooftop and culminating in
   an escape from the roof of nearby Mercy Hospital.
2. [Valve, official Left 4 Dead media](https://www.l4d.com/l4d/media.htm)
   provides the original visual baseline for rain, high rooftops, a dark city
   skyline, cold blue-gray lighting, and sparse practical illumination.

Continuity verdict: all seven assets consistently read as the No Mercy Mercy
Hospital rooftop finale. Rain-dark concrete, parapets, service/radio rooms,
HVAC units, pipes, antennae, red obstruction beacons, searchlights, a damaged
helipad ramp, and the dense Fairfield skyline recur without visual drift. The
absence of survivors, infected, weapons, supplies, and the rescue helicopter is
appropriate for reusable gameplay backgrounds.

## Per-file visual QA

### Final Fantasy VII

| Asset | Pixel contract | Visual and gameplay inspection | SHA-256 | Result |
| --- | --- | --- | --- | --- |
| `combat.webp` | `1672x941 RGB` | Strict side-view catwalk, continuous edge-to-edge combat floor, clear center lane, no baked actor or interface. | `8721843613dce7f8` | PASS |
| `melee.webp` | `1672x941 RGB` | Wide side arena with clear airspace and a stable base floor; no baked floating platform or foreground obstruction. | `3f07fdeecb0e9bc8` | PASS |
| `melee-backdrop.webp` | `1672x941 RGB` | Distant reactor shaft and scaffolding only; no collision-readable foreground floor. Framing is complete at all edges. | `efe136b0e171edf5` | PASS |
| `rpg.webp` | `1672x941 RGB` | Elevated three-quarter view with a broad lower battle plane and unobstructed left/right party zones. | `8026bb67ef3c91c9` | PASS |
| `tactics.webp` | `1448x1086 RGB` | Elevated frontal three-quarter board; exactly 8 columns by 6 rows, all 48 cells unobscured and readable. | `bf70edc0ca470aa6` | PASS |
| `melee-platforms.webp` | `1254x1254 RGBA` | Exactly 6 isolated platforms in a 2x3 layout; straight collision-readable tops, transparent gutters, no sprite clipping. | `f59560da18be5877` | PASS |
| `tactics-tiles.webp` | `1254x1254 RGBA` | Exactly 8 isolated tiles in a 4x2 layout; consistent trapezoidal footprint and perspective, with distinct floor/cover/hazard variants. | `7e78f1c1578bb362` | PASS |

### Left 4 Dead

| Asset | Pixel contract | Visual and gameplay inspection | SHA-256 | Result |
| --- | --- | --- | --- | --- |
| `combat.webp` | `1672x941 RGB` | Strict side-view rooftop with a continuous wet combat floor and a clear center lane; background structures remain behind play. | `5d5bf61dd4e43355` | PASS |
| `melee.webp` | `1672x941 RGB` | Broad open rooftop arena, stable base floor, clear jump space, and no baked floating platform. | `b297667026f2a3a2` | PASS |
| `melee-backdrop.webp` | `1672x941 RGB` | Distant skyline, rooftop silhouettes, and helipad structure only; no foreground collision floor or clipped gameplay object. | `d2a3109bb7329ef8` | PASS |
| `rpg.webp` | `1672x941 RGB` | Elevated three-quarter rooftop with a broad lower battle plane, clear party positions, radio/service room, and damaged helipad ramp. | `fb189dc552d0286c` | PASS |
| `tactics.webp` | `1448x1086 RGB` | Elevated frontal three-quarter board; exactly 8 columns by 6 rows, all 48 cells clear despite wet-surface reflections. | `2d2da483a761878d` | PASS |
| `melee-platforms.webp` | `1254x1254 RGBA` | Exactly 6 isolated rooftop platforms in a 2x3 layout; flat tops, transparent gutters, and no clipped beacon or support. | `bf28f6cd2d2369fa` | PASS |
| `tactics-tiles.webp` | `1254x1254 RGBA` | Exactly 8 isolated tiles in a 4x2 layout; matching trapezoidal footprints with concrete, grate, HVAC, duct, light, and breach variants. | `eaf877118e5d8351` | PASS |

Across all 14 images, the visual pass found no character, creature, corpse,
weapon, UI/HUD element, border, readable text, logo, or watermark. Environmental
cropping at scene edges is deliberate framing; no playable floor, grid, atlas
sprite, or collision-readable top is clipped.

## Tactics grid verification

Each board was counted directly at native resolution:

| Board | Longitudinal boundaries | Cross-board boundaries | Cells | Perspective | Result |
| --- | ---: | ---: | ---: | --- | --- |
| Final Fantasy VII | 9 | 7 | `8x6 = 48` | Far edge narrower; rows widen and deepen toward the foreground. | PASS |
| Left 4 Dead | 9 | 7 | `8x6 = 48` | Far edge narrower; rows widen and deepen toward the foreground. | PASS |

Both grids are frontal three-quarter trapezoids rather than top-down or
diamond-isometric boards. Their perimeter and every internal separator remain
continuous enough to identify all 48 playable cells. No scenery intrudes into
either grid.

## Alpha and atlas measurements

`Hidden RGB` counts pixels where alpha is zero but at least one RGB channel is
nonzero. `Axis runs` count separated occupied bands after projecting the alpha
mask onto each axis; 2 by 3 proves six separated platform slots, and 4 by 2
proves eight separated tile slots.

| Atlas | Alpha | Fully transparent | Partial alpha | Hidden RGB | Visible magenta | Visible edge pixels | Axis runs | Result |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| FFVII `melee-platforms.webp` | `0-255` | 1,096,223 | 30,358 | 0 | 0 | 0 | `2 x 3` | PASS |
| FFVII `tactics-tiles.webp` | `0-255` | 1,031,924 | 12,864 | 0 | 0 | 0 | `4 x 2` | PASS |
| L4D `melee-platforms.webp` | `0-255` | 1,231,076 | 13,768 | 0 | 0 | 0 | `2 x 3` | PASS |
| L4D `tactics-tiles.webp` | `0-255` | 923,175 | 11,330 | 0 | 0 | 0 | `4 x 2` | PASS |

All four atlas corner pixels are exactly `(0, 0, 0, 0)`. Every atlas has an
alpha range of exactly `0-255`, zero nonblack RGB under fully transparent
pixels, zero visible magenta-key pixels, zero visible pixels on the image
boundary, and uninterrupted transparent gutters between slots.

## Final disposition

- File set: **14/14 present and decoded**.
- Dimensions and modes: **14/14 exact**.
- Tactics geometry: **2/2 exact 8x6 boards**.
- Transparent atlases: **4/4 clean and separated**.
- Visual contamination: **none found**.
- Canon/location continuity: **pass for both packs**.
- Blocking defects: **none**.

The stage assets are accepted as-is. No regeneration or asset edit is
recommended from this independent visual/pixel QA.
