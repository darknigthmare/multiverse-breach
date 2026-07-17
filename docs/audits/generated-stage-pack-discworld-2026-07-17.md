# Discworld OpenAI Stage Pack - 2026-07-17

## Scope

Complete OpenAI ImageGen environment pack for the `Discworld` profile in
`src/game/stageLoreProfiles.js`.

Canonical location lock:

> Ankh-Morpork, Unseen University courtyard opening toward the River Ankh and
> the Shades.

All images are original fan-made game assets. The official references were used
to identify locations, architecture and city density, not as source images to
copy.

## References

1. Profile reference:
   https://www.discworldemporium.com/product/the-compleat-ankh-morpork/
   - Confirms the dense streets, cuts and alleys of Ankh-Morpork.
   - Confirms the guilds and institutions, the Shades and the city map.
2. Supplemental official location reference:
   https://www.discworldemporium.com/product/the-unreal-guide-to-unseen-university/
   - Confirms Unseen University as the city's magical college.
   - Confirms Sator Square, the Tower of Art, the university buildings and
     grounds, and the definitive campus model used by the licensed map.

## Outputs

| File | Dimensions | Format | Alpha | Gameplay use |
| --- | ---: | --- | --- | --- |
| `public/backgrounds/lore-stages/discworld/combat.webp` | 1536x864 | WebP | No | Strict side-view duel floor |
| `public/backgrounds/lore-stages/discworld/melee.webp` | 1536x864 | WebP | No | Side-view platform arena environment |
| `public/backgrounds/lore-stages/discworld/melee-backdrop.webp` | 1536x864 | WebP | No | Distant Melee parallax layer |
| `public/backgrounds/lore-stages/discworld/melee-platforms.webp` | 1536x1024 | WebP RGBA | Yes, 0-255 | Modular platform tops, faces and edges |
| `public/backgrounds/lore-stages/discworld/rpg.webp` | 1536x864 | WebP | No | Side-view 2.5D RPG battle lane |
| `public/backgrounds/lore-stages/discworld/tactics.webp` | 1536x864 | WebP | No | Elevated three-quarter 8x6 battlefield |
| `public/backgrounds/lore-stages/discworld/tactics-tiles.webp` | 1536x1024 | WebP RGBA | Yes, 0-255 | Modular Tactics cells and cover |

Main scenes were exported at WebP quality 94. Atlas chroma backgrounds were
removed with a soft matte and despill pass.

## Final prompts

### Combat

```text
Create an original lore-faithful, highly detailed 32-bit pixel-art environment
of Ankh-Morpork: an open courtyard of Unseen University looking toward the
River Ankh and the cramped Shades. Use eccentric university masonry, octiron
details, mismatched towers and domes, crooked chimneys, magical observatory
apparatus, dense leaning timber-and-stone rooftops and a distant murky River
Ankh. Strict side-view 16:9. One continuous flat stone duel floor must span the
lower 22% from edge to edge. Keep the central 55% open and low contrast. Place
props and focal architecture only at the far edges or in distant layers.
Crisp hand-clustered 32-bit pixel art, warm late-afternoon light, smoky violet
clouds. No characters, creatures, silhouettes, humanoid statues, readable
text, logos, watermark, UI, grid, holes, steps or foreground obstruction.
```

### Melee

```text
Create an original lore-faithful, highly detailed 32-bit pixel-art Unseen
University courtyard in Ankh-Morpork opening toward the River Ankh and the
Shades. Strict side-view 16:9 platform-brawler environment. Keep a low,
uninterrupted base floor only in the bottom 12% and leave the central
two-thirds open for runtime platforms and fighters. Frame only the extreme
left and right with university masonry, domes and observatory equipment.
Layer the river, crooked roofs and smoky sky in the distance. Absolutely no
floating platforms, suspended ledges, center bridges, stairs, gameplay blocks
or baked collision shapes. Crisp hand-clustered 32-bit pixel art. No people,
creatures, silhouettes, humanoid statues, readable text, logos, watermark, UI
or grid.
```

### Melee backdrop

```text
Create an original lore-faithful 32-bit pixel-art distant panorama from Unseen
University across Ankh-Morpork toward the River Ankh and the Shades. Strict
side-view 16:9 distant parallax backdrop only. Show tightly packed crooked
roofs, chimneys, guild towers, the murky river and restrained magical glints.
Keep the central 60% lower contrast and place nearest architecture only in the
outer 12% on each side. No playable floor, foreground walkway, ledge, bridge
across the center or gameplay platform. No characters, creatures, silhouettes,
humanoid statues, readable text, logo, watermark, UI or grid.
```

### Melee platform atlas

```text
Create a clean modular side-view platform texture atlas matching soot-stained
Unseen University masonry. Include isolated long, medium and short platforms,
two repeating pale worn flagstone top strips, two repeating dark front-face
strips, left and right end caps, two octiron corner pieces, underside trim,
a pillar support and three cracked-edge variants. All tops must be perfectly
level and collision-readable. Crisp detailed 32-bit pixel art. Arrange all
pieces with generous spacing on a perfectly flat solid #ff00ff chroma-key
background. No room, building, scenery, people, text, labels, shadows, logos
or watermark.
```

### RPG

```text
Create an original lore-faithful 32-bit pixel-art RPG battlefield in the open
courtyard of Unseen University, looking toward the River Ankh and the Shades.
Wide 16:9 side-view 2.5D camera. A broad shallow stone battle plane occupies
the lower 32%, with one unobstructed central horizontal lane across at least
70% of the width. Keep the foreground lip low and place all props at the outer
edges or far back line. Use four readable depth bands: foreground lip, open
battle lane, university boundary, distant river/city/sky. No people,
creatures, silhouettes, humanoid statues, text, logos, watermark, UI, grid,
floating platforms, high foreground objects, stairs or holes in the lane.
```

### Tactics base

```text
Create an original lore-faithful 32-bit pixel-art tactical courtyard at Unseen
University in Ankh-Morpork, looking toward the River Ankh and the Shades.
Wide 16:9 elevated three-quarter front view, never overhead and never
diamond-isometric. A frontal rectangular/trapezoidal stone courtyard occupies
the lower 65%, with the lower floor visibly nearer and wider. Preserve a broad
central lane. Add only two low bookcases, two octiron plinths and one broken
wall away from that lane. Draw no grid, cell lines, white lines, diamonds,
coordinates or UI because the exact grid will be composited later. No people,
creatures, silhouettes, humanoid statues, readable text, logos or watermark.
```

### Tactics tile atlas

```text
Create a 4-column by 3-row modular tactical tile atlas matching Unseen
University. Include intact, cracked and mossy flagstone cells, an
octiron-inlay objective cell, broken-wall cover, bookcase cover, octiron
plinth, magical ward ring, raised dais, damaged dais, rubble and a thaumic
hazard vent. Every tile uses the same elevated three-quarter front-view
trapezoidal perspective, never a top-down square or 45-degree diamond. Crisp
high-detail 32-bit pixel art. Arrange isolated assets on a perfectly flat
solid #ff00ff chroma-key background. No people, text, labels, guide lines,
logos, watermark, UI or scenery.
```

## Tactics grid correction

The first direct ImageGen Tactics attempt produced more than eight columns, so
it was rejected. A clean gridless ImageGen battlefield was generated instead.
The final gameplay grid was then composited with deterministic coordinates:

- 8 columns: 9 vertical boundaries.
- 6 rows: 7 horizontal boundaries.
- Mild frontal perspective convergence.
- Lower rows are larger and visually in front of upper rows.
- No 45-degree diamond cells and no top-down camera.

This guarantees exactly 48 visible gameplay cells while retaining the generated
pixel-art environment.

## Validation

- Visually inspected all seven final files at full resolution.
- Combat has a continuous edge-to-edge floor and an open duel center.
- Melee has no baked floating platforms; the base floor remains continuous.
- Melee backdrop contains no collision surface or playable platform.
- RPG keeps the central party/enemy lane free and the foreground below feet.
- Tactics uses an elevated three-quarter front camera and exactly 8x6 cells.
- All files contain no characters, enemies, readable text, logos or baked UI.
- Both atlases retain real transparency:
  - `melee-platforms.webp`: alpha minimum 0, maximum 255.
  - `tactics-tiles.webp`: alpha minimum 0, maximum 255.
- No magenta chroma residue is visible on inspected atlas edges.
- No asset is cropped and all final files are non-empty.

## Repository scope

No JavaScript, JSON, prompt manifest, gameplay registry, commit, push or
deployment was performed for this pack.
