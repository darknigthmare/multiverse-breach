# Woodruff OpenAI Stage Pack Audit

Date: 2026-07-18

Scope: only the `Woodruff` stage pack under
`public/backgrounds/lore-stages/woodruff/`.

No JavaScript, JSON, manifest, runtime mapping, commit, push, or deployment was
performed as part of this task.

## Canon references

- Internet Archive preservation item:
  https://archive.org/details/woodruff-and-the-schnibble-of-azimuth
  - The item metadata identifies the French IBM PC CD-ROM release and Coktel
    Vision as creator.
  - Its downloadable visual files are cover/disc scans rather than gameplay
    captures, so it was used as a preservation and edition reference.
- MobyGames game and screenshot archive:
  https://www.mobygames.com/game/2871/the-bizarre-adventures-of-woodruff-and-the-schnibble/
  https://www.mobygames.com/game/2871/the-bizarre-adventures-of-woodruff-and-the-schnibble/screenshots/
- GamesNostalgia screenshot gallery:
  https://gamesnostalgia.com/screenshots/the-bizarre-adventures-of-woodruff-and-the-schnibble
  - The complete 32-image Windows 3.x gallery was inspected locally as a
    contact sheet.

## Visual findings

The original game does not depict a generic fantasy or Victorian steampunk
city. Its visual identity is built from:

- a vertical post-atomic city embedded into red and orange rock;
- oppressed Boozook lower levels beneath dense human authority structures;
- asymmetrical petrol-blue and dirty-yellow machine housings;
- oversized red and blue pipe networks, pneumatic tubes, conveyors, shutters,
  levers, lamps, booths, and inspection windows;
- absurd administration spaces, permit counters, queue rails, and machinery
  that treats bureaucracy as architecture;
- hard cartoon contours, irregular perspective, and painted 1990s French
  adventure-game shapes.

The first generated Melee backdrop was rejected because it drifted toward a
rounded fantasy canyon town. The accepted second pass makes machinery dominate
the image and removes the fantasy-town reading.

## Final prompt set

All generations used the built-in OpenAI image generation tool with original
game screenshots as visual references.

### Combat

```text
Create an original, lore-faithful Woodruff combat arena in the lower levels of
the vertical dystopian city Vlurxtrznbnaxl, combining a Boozook workers'
district with the Administration factory gate. Use highly detailed hand-painted
32-bit pixel art, irregular angular 1990s French adventure-game machinery,
saturated ochre and red rock, petrol-blue machinery, dirty-yellow industrial
housings, red indicator lights, black outlines, and caricatural proportions.
Use a strict 16:9 side view with dense pipes, conveyors, pneumatic tubes,
Transportozon-like booths, absurd permit machinery, suspended passages, and
deep vertical city layers. Keep one continuous flat duel floor across the lower
22 percent and a clear central 1v1 lane. No characters, creatures, fantasy
castle, Victorian steampunk, generic cyberpunk, modern sci-fi, readable text,
logos, UI, watermark, or black bars.
```

### Melee backdrop

```text
Create an original lore-faithful Vlurxtrznbnaxl city-machine panorama above the
oppressed Boozook lower levels. Machinery must dominate at least 70 percent of
the image: giant asymmetrical petrol-blue and dirty-yellow carters bolted into
red ochre rock, oversized pipes, pneumatic tubes, inspection windows, lever
banks, crooked lifts, spherical lamps, and Transportozon-like booths. Place a
dark red authority tower covered by blank permit plates and pipework in the
distance. Use highly detailed hand-painted 32-bit pixel art with black cartoon
contours and awkward French 1990s adventure-game perspective. Exact 16:9,
strict side-view platform camera, deep central shaft, layered parallax, and an
open middle. Backdrop only: no gameplay floor, platforms, or collision ledges.
Absolutely no fantasy canyon town, steampunk village, cute domed houses,
medieval architecture, characters, creatures, readable text, logos, UI, or
watermark.
```

### Melee platform atlas

```text
Create exactly six separate horizontal platform modules for a Woodruff
Vlurxtrznbnaxl arena: two long main platforms, two medium permit-counter
bridges, and two short risky pipe-and-rock platforms. Use crooked ochre slabs,
dark teal industrial carters, red pipes, bolts, blank indicator housings, and
rough Boozook repairs. Highly detailed hand-painted 32-bit pixel art, crisp
clusters, angular 1990s French adventure-game machinery. Arrange three rows of
two isolated platforms with generous spacing, no overlap or crop, strict side
view and readable horizontal tops. Perfectly flat #ff00ff chroma background;
no scene, floor, shadows, characters, text, logos, UI, or transparent effects.
```

### RPG

```text
Create an original lore-faithful RPG battle scene at a Vlurxtrznbnaxl
Administration transfer court where the factory, Transportozon network, and
Boozook lower district intersect. Use highly detailed hand-painted 32-bit pixel
art with angular machinery, black cartoon outlines, red ochre stone, petrol-blue
industrial panels, and absurd civic technology. Place a crooked factory mouth
and conveyor housings on the left, a cylindrical transfer booth and pneumatic
routing machinery on the right, dense stacked pipes behind, and empty permit
windows and queue rails around the perimeter. Exact 16:9 side-view 2.5D RPG
camera with a broad unobstructed central lane for a party versus enemies.
No fantasy city, Victorian steampunk, generic cyberpunk, modern factory,
characters, creatures, readable text, logos, UI, or watermark.
```

### Tactics

```text
Create an original lore-faithful tactical battlefield inside a combined
Vlurxtrznbnaxl factory-permit hall. Match the original game's angular painted
machinery, ochre and teal palette, red and blue pipes, conveyors, shutters,
pneumatic tubes, permit counters, and absurd Administration apparatus. Exact
16:9 landscape with an elevated three-quarter camera looking about 30 degrees
down across one wide rectangular floor plane. The plane must contain exactly
8 columns and exactly 6 rows of quadrilateral cells, 48 cells total. Perspective
must make lower rows visually closer than upper rows; never use top-down,
diamond-isometric, hex, or diamond cells. Keep all cells readable and
traversable. No characters, creatures, readable text, logos, UI, or watermark.
```

### Tactics tile atlas

```text
Create exactly eight isolated Woodruff battlefield pieces from the same
elevated three-quarter rectangular-grid camera: a dirty-teal factory floor tile,
a cracked Boozook red-rock tile, low petrol-blue pipe cover, tall dirty-yellow
permit-cabinet cover, pneumatic portal housing, hazardous green drain tile,
blank permit-stamp objective with spherical lamp, and a destructible conveyor
barrier. Use highly detailed hand-painted 32-bit pixel art with angular 1990s
French adventure-game machinery. Arrange two rows of four pieces with equal
spacing, no overlap or crop, and matching tile footprints. Perfectly flat
#ff00ff chroma background; no characters, creatures, text, logos, UI, shadows,
smoke, glass, or semi-transparent effects.
```

`melee.webp` was composed from the accepted OpenAI Melee backdrop and two
modules from the accepted OpenAI platform atlas. No additional generated or
generic platform art was introduced.

## Output table

| File | Dimensions | Mode | Bytes | Purpose |
|---|---:|---|---:|---|
| `combat.webp` | 1536x864 | RGB | 348616 | Strict lateral duel floor and factory gate |
| `melee.webp` | 1536x864 | RGB | 331842 | Standalone Melee scene using the generated platform texture |
| `melee-backdrop.webp` | 1536x864 | RGB | 299706 | Platform-free vertical city-machine backdrop |
| `melee-platforms.webp` | 1536x1024 | RGBA | 776144 | Six isolated side-view platform modules |
| `rpg.webp` | 1536x864 | RGB | 327026 | 2.5D transfer court with a clear central lane |
| `tactics.webp` | 1536x864 | RGB | 335648 | Elevated 3/4 factory-permit hall, exactly 8x6 |
| `tactics-tiles.webp` | 1536x1024 | RGBA | 940048 | Eight isolated tiles, covers, hazards, and objectives |

## Validation

- Exactly seven files are present in the final Woodruff folder.
- Pillow opens every WebP successfully.
- All scene files are exactly `1536x864`.
- Both atlas files are exactly `1536x1024` and decode as RGBA.
- `melee-platforms.webp` alpha extrema: `(0, 255)`.
- `tactics-tiles.webp` alpha extrema: `(0, 255)`.
- Fully transparent pixels in both final WebP atlases have RGB `(0, 0, 0)`.
- Non-zero hidden RGB pixel count under alpha zero: `0` for both atlases.
- No magenta chroma residue remains in transparent regions.
- Combat has a continuous floor and clear central lane.
- Melee backdrop contains no baked gameplay platforms.
- Melee atlas contains six separated, uncropped platform silhouettes.
- RPG uses a side-view 2.5D lane rather than a top-down camera.
- Tactics uses an elevated three-quarter rectangular plane.
- Tactics grid was visually counted as nine vertical boundaries and seven
  horizontal boundaries: exactly `8x6` cells.
- Tactics atlas contains eight separated pieces sharing one camera angle.
- Every final file was visually inspected for crop, angle, generic design,
  characters, creatures, logos, readable text, and UI.

Validation result: `WOODRUFF_STAGE_PACK_VALID`.
