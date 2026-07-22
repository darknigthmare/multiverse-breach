# Complete OpenAI Stage Pack: The House of the Dead III - 2026-07-22

## Scope

This audit covers one complete, original fan-made stage pack generated with the
built-in OpenAI ImageGen tool:

- `public/backgrounds/lore-stages/house-of-the-dead-3/`

The pack contains the seven requested files. No JavaScript, JSON, asset
registry, sprite manifest, `openai-sprite-prompts`, or other universe was
modified. No commit was created.

Every target received a separate online visual-reference pass before its
ImageGen call. The reference material locked the facility, architecture,
palette, route landmarks, and laboratory machinery. No source frame, official
sprite, texture, or guide illustration was copied into the project.

## Canonical lock

The location is the abandoned EFI Research Facility in post-collapse 2019,
specifically its once-green entrance/lobby and the route descending toward the
Level 4 laboratory, BioReactor, and Wheel of Fate incubation chamber.

The pack consistently uses:

- brutalist concrete, dark steel, catwalks, ducts, pipes, laboratory glazing,
  test-tube banks, and partially working industrial systems;
- restrained vines and roots reclaiming a facility that was previously rich
  in greenery and water;
- cold green laboratory/reactor light with sparse amber emergency fixtures;
- an empty ring-like reactor cradle and empty incubation machinery as distant
  landmarks, never a character or creature;
- science-industrial decay specific to HOTD III, not a mansion, police station,
  hospital, Silent Hill location, or Resident Evil laboratory.

## Canonical reference log

Research date: 2026-07-22.

Primary Sega/manual/guide-derived references:

1. The House of the Dead III Perfect Guide:
   <https://thehouseofthedead.fandom.com/wiki/The_House_of_the_Dead_III_Perfect_Guide>
   - Used for the official guide's entrance coverage on page 29, the facility
     areas, and the Level 4 Lab and Wheel of Fate material on page 74.
2. EFI Research Facility:
   <https://thehouseofthedead.fandom.com/wiki/EFI_Research_Facility>
   - Used for the Xbox-manual and archived Sega-story citations, the abandoned
     2019 status, the formerly green entrance, the central BIO Lab atrium, the
     partially working security systems, and the Level 4 Lab test tubes.
3. The House of the Dead III official artwork index:
   <https://thehouseofthedead.fandom.com/wiki/Category%3AThe_House_of_the_Dead_III_official_artwork>
   - Used to cross-check the `EFIEntrance1-6`, `BIOLab1-6`, `Level4Lab1-6`,
     `SystemsDept1-6`, and `EFI facility` Sega artwork sets.
4. The House of the Dead III official guide PDF index:
   <https://retrocdn.net/images/9/9d/The_House_of_the_Dead_3_Perfect_Guide_JP.pdf>
   - Used as the source identity for the 98-page Enterbrain/Famitsu Xbox guide.

Supplementary screenshot and route references:

5. MobyGames, Sega/PlayStation promotional image:
   <https://www.mobygames.com/game/7694/the-house-of-the-dead-iii/promo/group-10962/image-125189/>
   - Used to check the original game's green-lit industrial chamber materials.
6. MobyGames screenshot gallery:
   <https://www.mobygames.com/game/7694/the-house-of-the-dead-iii/screenshots/>
   - Used to cross-check corridors, containment equipment, and the early-2000s
     visual density without importing any screenshot.
7. HOTD III route-map index:
   <https://thehouseofthedead.fandom.com/wiki/Category%3AThe_House_of_the_Dead_III_route_maps>
   - Used for the entrance, BIO facilities, Information Systems Department,
     and final-stage progression.
8. Wheel of Fate chapter and incubation context:
   <https://thehouseofthedead.fandom.com/wiki/Wheel_of_Fate_%28chapter%29>
   - Used to lock the final approach and incubation-laboratory destination.

## Per-target research trace

| Target | Reference focus checked before generation |
| --- | --- |
| `combat.webp` | Perfect Guide entrance, EFI lobby decay, green industrial chamber screenshots |
| `melee.webp` | Official `EFIEntrance1-6` set, once-green shared entrance, freight/elevator route |
| `melee-backdrop.webp` | `EFIBuildingNight`, official EFI facility art, distant atrium and ruined shared space |
| `melee-platforms.webp` | Sega catwalk screenshots, `Level4Lab1-6`, steel galleries and reactor access decks |
| `rpg.webp` | Perfect Guide page 74, Level 4 Lab test tubes, Wheel of Fate incubation laboratory |
| `tactics.webp` | Official route maps, final-stage approach, Level 4 deck and BioReactor axis |
| `tactics-tiles.webp` | `BIOLab1-6`, `Level4Lab1-6`, `SystemsDept1-6`, pipes and partial security systems |

## Outputs

| File | Dimensions | Mode | Alpha | Gameplay lock |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | No | Side-view duel floor and clear center lane |
| `melee.webp` | 1672x941 | RGB | No | Open side-view arena without baked platforms |
| `melee-backdrop.webp` | 1672x941 | RGB | No | Distant parallax layer without a collision floor |
| `melee-platforms.webp` | 1254x1254 | RGBA | 0-255 | Exactly six isolated side-view platform sprites |
| `rpg.webp` | 1672x941 | RGB | No | Broad three-quarter party-versus-enemy plane |
| `tactics.webp` | 1448x1086 | RGB | No | Elevated three-quarter board with an exact 8x6 grid |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 0-255 | Exactly eight isolated cells, covers, and hazards |

The five RGB scenes were exported as WebP quality 94. The two companion atlases
were exported as lossless exact-alpha WebP. ImageGen returned `melee` and `rpg`
at 1671x941; the missing rightmost column was restored by duplicating only the
existing right edge, with no resampling or composition change.

## Final prompt set

All seven built-in ImageGen prompts shared these locks:

- original, highly detailed 32-bit-era pixel art with crisp pixel clusters;
- the abandoned EFI lobby and Level 4/BioReactor route as one coherent setting;
- dirty concrete and steel, green laboratory light, restrained overgrowth, and
  sparse amber emergency lighting;
- environment and empty machinery only;
- no character, creature, zombie, humanoid silhouette, body, skeleton, gore,
  blood, weapon, hand, text, sign, logo, UI, HUD, crosshair, border, or watermark;
- no direct reconstruction of a copyrighted screenshot or official art asset;
- explicit exclusion of Resident Evil, Umbrella, Silent Hill, hospital, police
  station, mansion, and generic gothic-horror motifs.

Mode-specific prompt locks:

- Combat: strict side view, continuous edge-to-edge floor, clear center lane.
- Melee: strict side view, open airspace, no baked floating platform.
- Melee backdrop: distant scenery only, no foreground floor or collision ledge.
- Melee platforms: exactly six separated sprites in a 2x3 atlas, straight tops.
- RPG: elevated three-quarter side view with clear lower-left and lower-right
  party positions and an empty Level 4 incubation landmark.
- Tactics: elevated frontal three-quarter view with one empty trapezoidal deck;
  no model-generated grid or surface obstacles.
- Tactics tiles: exactly eight separated 4x2 sprites with one shared footprint,
  scale, and perspective.

## Tactics grid

ImageGen produced an unmarked trapezoidal deck. A deterministic pixel overlay
then added:

- 9 straight perspective-correct vertical boundaries;
- 7 perspective-compressed horizontal boundaries;
- exactly 8 columns by 6 rows, producing 48 readable cells;
- far corners at `(455, 470)` and `(993, 470)`;
- near corners at `(55, 1040)` and `(1393, 1040)`;
- row interpolation positions `0, 0.10, 0.23, 0.39, 0.57, 0.77, 1.0` so near
  cells are taller and the board remains a frontal three-quarter view.

The final board was visually inspected at its native 1448x1086 size. All 48
cells are unobstructed and readable.

## Alpha and chroma processing

Both companion atlases were generated on a flat magenta key and processed with
the installed `remove_chroma_key.py` helper using border auto-key sampling, a
soft matte, despill, and one-pixel edge contraction.

Final alpha validation:

| File | Transparent px | Partial-alpha px | Hidden RGB under alpha 0 | Visible magenta-key px |
| --- | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1,115,080 | 33,036 | 0 | 0 |
| `tactics-tiles.webp` | 926,673 | 36,706 | 0 | 0 |

Both atlases are exactly 1254x1254 RGBA, have alpha extrema 0-255, have four
fully transparent corners, and preserve zero RGB values for every fully
transparent pixel. The six platform sprites and eight tactical sprites are
visibly separated, uncropped, and free of key-color fringe.

## Validation result

Pillow decoded every final WebP and verified the exact file set, dimensions,
modes, alpha ranges, transparent corners, chroma cleanup, and hidden RGB rule.
All seven assets were then inspected visually at native resolution.

| Pack | Files | Decode | Dimensions/modes | Alpha/chroma | Grid | Visual inspection |
| --- | ---: | --- | --- | --- | --- | --- |
| House of the Dead III | 7/7 | Pass | Pass | Pass | 8x6, 48/48 | Pass |

Final result: 7/7 assets pass. The pack contains no character, creature, gore,
text, UI, logo, or watermark, and remains visually specific to the abandoned
HOTD III EFI Research Facility rather than adjacent survival-horror franchises.
