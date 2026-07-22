# Complete OpenAI Stage Packs: Final Fantasy VII and Left 4 Dead - 2026-07-22

## Scope

This audit covers two complete, original fan-made stage packs generated with
the built-in OpenAI ImageGen tool:

- `public/backgrounds/lore-stages/final-fantasy-vii/`
- `public/backgrounds/lore-stages/left-4-dead/`

Each pack contains the seven required files. The task did not modify any
JavaScript, JSON, asset registry, sprite manifest, or other universe. No commit
was created.

Reference material was used to lock locations, architecture, palette, weather,
and gameplay landmarks. No source frame was copied directly.

## Canonical reference log

Research date: 2026-07-22.

### Final Fantasy VII (1997): Mako Reactor 1 core chamber

1. Final Fantasy Wiki, Mako Reactor 1:
   <https://finalfantasy.fandom.com/wiki/Mako_Reactor_1>
   - Used to lock the original interior's brown tint, the immense pipes and
     fans, the scaffolding descent, and the core's two platforms connected by
     a walkway above Mako.
2. Final Fantasy Wiki, original No. 1 Reactor field:
   <https://finalfantasy.fandom.com/wiki/No._1_Reactor_(Final_Fantasy_VII_field)>
   - Used to separate the 1997 field layout from the expanded Remake layout
     and to confirm the elevator, stairs, ladders, and core progression.
3. MobyGames, original Windows screenshot inside the reactor:
   <https://www.mobygames.com/game/858/final-fantasy-vii/screenshots/windows/11753/>
   - Used as a direct visual check for the original pre-rendered industrial
     chamber, catwalk scale, and muted metal palette.
4. Final Fantasy VII HD Field Scenes Database, Midgar Reactor 1:
   <https://finalfantasy.german-syslinux-blog.de/FF7/index.php?db=2&loc=29>
   - Used to cross-check the original field-scene composition and depth.

Canonical lock: the 1997 Reactor 1 Mako storage/core, not the Remake. The pack
uses rusted brown metal, dense pipes, ladders and scaffolds, sparse white lamps,
and emerald Mako underlight.

### Left 4 Dead: No Mercy hospital rooftop finale

1. Left 4 Dead Wiki, Rooftop Finale:
   <https://left4dead.fandom.com/wiki/Rooftop_Finale>
   - Used to lock the radio-room holdout, rooftop access, helipad ramp, broken
     helipad structure, defensive rooftop geometry, and dark city setting.
2. Steam Community, Mercy Hospital rooftop screenshot:
   <https://steamcommunity.com/sharedfiles/filedetails/?id=655826336>
   - Used as a direct visual check for concrete parapets, rooftop machinery,
     searchlights, fog, and the distant skyline.
3. Left 4 Dead Map Database, Chapter 5 Rooftop Finale:
   <https://l4dmapdb.wikidot.com/m%3A138>
   - Used to cross-check the open holdout area, raised structures, and the
     route across the roof to the helipad.
4. Official Steam store page:
   <https://store.steampowered.com/app/500/Left_4_Dead/>
   - Used to anchor the pack to the original Left 4 Dead release identity.

Canonical lock: Mercy Hospital's No Mercy finale at stormy night. The pack uses
rain-dark concrete, rooftop HVAC and pipes, the radio-room silhouette, red
obstruction beacons, searchlights, the damaged helipad ramp, and a foggy city
skyline. It omits survivors, infected, weapons, supplies, and the rescue
helicopter so every mode remains gameplay-safe.

## Outputs

The following contract is identical for both universe folders:

| File | Dimensions | Mode | Alpha | Gameplay lock |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | No | Side-view duel floor with a clear center lane |
| `melee.webp` | 1672x941 | RGB | No | Open side-view arena without baked platforms |
| `melee-backdrop.webp` | 1672x941 | RGB | No | Distant parallax layer without a collision floor |
| `melee-platforms.webp` | 1254x1254 | RGBA | 0-255 | Six isolated side-view platform sprites |
| `rpg.webp` | 1672x941 | RGB | No | Broad 2.5D party-versus-enemy battle plane |
| `tactics.webp` | 1448x1086 | RGB | No | Elevated three-quarter board with an exact 8x6 grid |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 0-255 | Eight isolated cells, covers, and hazards |

The four RGB scene types were exported as WebP quality 94. The two companion
atlases in each pack were exported as lossless exact-alpha WebP.

## Prompt locks

All fourteen built-in ImageGen prompts shared these constraints:

- original, highly detailed 32-bit-style pixel art with crisp pixel clusters;
- one canon-locked location and coherent palette per universe;
- no character, survivor, infected, enemy, body, gore, weapon, text, logo,
  readable sign, UI, HUD, border, or watermark;
- no direct recreation of a copyrighted screenshot;
- stable gameplay composition with center and lower play areas kept clear.

Mode-specific locks:

- Combat: strict side view and a continuous edge-to-edge floor.
- Melee: open airspace and no baked floating platform.
- Melee backdrop: distant scenery only, with no foreground floor.
- Melee platforms: exactly six separated sprites in a 2x3 atlas, each with a
  straight collision-readable top edge.
- RPG: slightly elevated three-quarter side view with clear left and right
  party positions.
- Tactics: elevated frontal three-quarter view, never top-down or
  diamond-isometric, with a large empty trapezoidal board.
- Tactics tiles: exactly eight separated sprites in a 4x2 atlas, all sharing
  one footprint, scale, and perspective.

## Tactics grid

ImageGen produced each tactics environment as an unmarked trapezoidal board.
A deterministic pixel overlay then added:

- 9 perspective-correct vertical boundaries;
- 7 perspective-compressed horizontal boundaries;
- exactly 8 columns by 6 rows, for 48 readable cells;
- wider and taller near rows to preserve the frontal three-quarter camera.

The two final boards were visually inspected at their native 1448x1086 size.

## Alpha and chroma processing

The four companion atlases were generated on a flat magenta key, copied out of
the built-in ImageGen output location, and processed with the installed
`remove_chroma_key.py` helper using border auto-key sampling, a soft matte,
despill, and one-pixel edge contraction.

Final alpha validation for all four atlases:

- dimensions are exactly 1254x1254;
- mode is RGBA and alpha extrema are exactly 0-255;
- all four corner pixels are fully transparent;
- transparent pixels have zero RGB values to prevent texture-edge bleeding;
- no visible magenta-key pixel remains;
- platform and tile sprites are visibly separated and uncropped.

## Validation result

Pillow decoded every final WebP after export and verified the exact file set,
dimensions, and modes.

| Pack | Files | Decode | Dimensions/modes | Alpha/chroma | Visual inspection |
| --- | ---: | --- | --- | --- | --- |
| Final Fantasy VII | 7/7 | Pass | Pass | Pass | Pass |
| Left 4 Dead | 7/7 | Pass | Pass | Pass | Pass |

Final result: 14/14 assets pass. Both tactics boards visibly contain exactly
48 cells, all four transparent atlases are clean, and no generated asset
contains a character, enemy, readable text, UI, or watermark.
