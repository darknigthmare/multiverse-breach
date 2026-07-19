# Predator modern stage batch A - OpenAI ImageGen audit

Date: 2026-07-19

## Scope

This batch adds two complete original pixel-art stage packs:

- `public/backgrounds/lore-stages/the-predator/`
- `public/backgrounds/lore-stages/predator-killer-of-killers/`

Each pack contains the seven established runtime assets:

- `combat.webp`
- `melee.webp`
- `melee-backdrop.webp`
- `melee-platforms.webp`
- `rpg.webp`
- `tactics.webp`
- `tactics-tiles.webp`

The images were produced with OpenAI ImageGen after visual-reference research.
They are original fan-made environment compositions. No official still,
character, creature, logo, text, UI, or extracted film bitmap is included in
the final files.

## References consulted

### The Predator (2018)

- [20th Century Studios - The Predator](https://www.20thcenturystudios.com/movies/the-predator)
  - Official synopsis, trailer gallery, production imagery, Yautja ship
    architecture, and the film's cold cyan, black, and red visual language.
- [British Cinematographer - Larry Fong ASC / The Predator](https://britishcinematographer.co.uk/larry-fong-asc-the-predator/)
  - Confirms the laboratory, spaceship interior and exterior, swamp, and other
    major sets; also documents the nighttime third act and the production's
    deliberately raw visual approach.
- [Den of Geek - Visiting the set of The Predator](https://www.denofgeek.com/movies/visiting-the-set-of-the-predator/)
  - Describes the wet woodland and swamp set, the alien ship structure, school
    interiors, mud, pine trees, and practical environment construction.
- [Screen Global Production - Vancouver locations for The Predator](https://www.screenglobalproduction.com/news/2018/9/11/vancouver-locations-for-shane-blacks-the-predator)
  - Confirms the Stargazer laboratory sets, dam and treatment-plant exteriors,
    wet nocturnal locations, and late-fall Halloween setting.

### Predator: Killer of Killers (2025)

- [Disney UK Press - Official poster and still gallery](https://press.disney.co.uk/gallery/predator-killer-of-killers-poster-stills-images)
  - Official visual references for the snowbound Viking settlement, feudal
    Japanese interiors, 1942 aviation chapter, painterly animated rendering,
    and Yautja technology palette.
- [Disney+ - Predator: Killer of Killers](https://www.disneyplus.com/browse/entity-5ded19e6-73f5-4c65-a4f8-759bce8d1114)
  - Official synopsis confirming the Viking raider, feudal-Japan ninja and
    samurai conflict, and WWII pilot anthology structure.
- [Aletta Wenas - Predator: Killer of Killers environment concepts](https://www.alettawenas.com/predator-killer-of-killers2)
  - Production environment references for the medieval Viking and feudal
    Japanese chapters, including settlement eaves, gates, and daimyo quarters.
- [Neon Splatter - Micho Rutare interview](https://www.neonsplatter.com/editorials/the-neon-splatter-interview-micho-rutare-of-predator-killer-of-killers)
  - Confirms the three historical concepts and that the final arena was part of
    the project from its initial story design.

## Visual direction

### The Predator

| Asset | Lore and gameplay direction |
| --- | --- |
| `combat.webp` | Strict side-view Project Stargazer containment laboratory with one continuous sterile floor and an empty central duel lane. |
| `melee.webp` | Rainy nighttime forest crash site with Yautja scout-ship fragments at the edges, continuous mud floor, and no baked platform. |
| `melee-backdrop.webp` | Distant rain forest, cliffs, mist, and crashed ship silhouette only; no foreground collision surface. |
| `melee-platforms.webp` | Eight isolated side-view platforms combining Stargazer steel, concrete, wet forest material, military decking, and Yautja hull segments. |
| `rpg.webp` | Late-autumn suburban school neighborhood at Halloween with a broad, clear wet-asphalt 2.5D battle lane. |
| `tactics.webp` | Elevated three-quarter Stargazer dam facility yard with a fully visible rectangular 8-column by 6-row battlefield. |
| `tactics-tiles.webp` | Eight isolated three-quarter facility, drainage, forest, wreck, and alien-containment terrain pieces. |

### Predator: Killer of Killers

| Asset | Lore and gameplay direction |
| --- | --- |
| `combat.webp` | Strict side-view snowbound Viking village gate with a continuous packed-snow fighting floor. |
| `melee.webp` | Rainy early-1600s Japanese fortress hall and courtyard with a continuous wood-and-stone floor and no baked platform. |
| `melee-backdrop.webp` | Layered mountain castle, pine forest, rain, mist, and moonlight only; no foreground collision surface. |
| `melee-platforms.webp` | Eight isolated side-view platforms representing Viking, Japanese, 1942 naval-airbase, and Yautja-arena materials. |
| `rpg.webp` | 1942 coastal Allied airbase with a broad unobstructed 2.5D runway battle lane. |
| `tactics.webp` | Empty Yautja arena in elevated three-quarter view with a fully visible rectangular 8-column by 6-row battlefield. |
| `tactics-tiles.webp` | Eight isolated three-quarter basalt, gunmetal, energy-channel, containment, cover, gate, and objective tiles. |

## File validation

| Pack | File | Dimensions | Mode | Alpha |
| --- | --- | ---: | --- | --- |
| The Predator | `combat.webp` | 1672x941 | RGB | Opaque |
| The Predator | `melee.webp` | 1672x941 | RGB | Opaque |
| The Predator | `melee-backdrop.webp` | 1672x941 | RGB | Opaque |
| The Predator | `melee-platforms.webp` | 1254x1254 | RGBA | 0-255 |
| The Predator | `rpg.webp` | 1672x941 | RGB | Opaque |
| The Predator | `tactics.webp` | 1448x1086 | RGB | Opaque |
| The Predator | `tactics-tiles.webp` | 1254x1254 | RGBA | 0-255 |
| Killer of Killers | `combat.webp` | 1672x941 | RGB | Opaque |
| Killer of Killers | `melee.webp` | 1672x941 | RGB | Opaque |
| Killer of Killers | `melee-backdrop.webp` | 1672x941 | RGB | Opaque |
| Killer of Killers | `melee-platforms.webp` | 1254x1254 | RGBA | 0-255 |
| Killer of Killers | `rpg.webp` | 1672x941 | RGB | Opaque |
| Killer of Killers | `tactics.webp` | 1448x1086 | RGB | Opaque |
| Killer of Killers | `tactics-tiles.webp` | 1254x1254 | RGBA | 0-255 |

Automated RGBA checks:

| File | Fully transparent pixels | Partial-alpha pixels | Visible magenta pixels | RGB components under alpha 0 | Corner alpha |
| --- | ---: | ---: | ---: | ---: | --- |
| `the-predator/melee-platforms.webp` | 1,035,958 | 28,225 | 0 | 0 | 0 / 0 / 0 / 0 |
| `the-predator/tactics-tiles.webp` | 757,455 | 24,090 | 0 | 0 | 0 / 0 / 0 / 0 |
| `predator-killer-of-killers/melee-platforms.webp` | 955,600 | 33,230 | 0 | 0 | 0 / 0 / 0 / 0 |
| `predator-killer-of-killers/tactics-tiles.webp` | 654,678 | 21,238 | 0 | 0 | 0 / 0 / 0 / 0 |

## Visual review

- Exactly seven final WebP files are present in each pack.
- Combat scenes use strict lateral composition and one continuous floor.
- Melee environments contain no baked floating platform; platform geometry is
  isolated in the corresponding transparent atlas.
- RPG scenes use a shallow 2.5D angle and preserve a wide unobstructed battle
  lane.
- Both Tactics scenes use an elevated three-quarter view, never a flat
  top-down view, and visibly retain an 8x6 rectangular board.
- Both tactical atlases use a coherent three-quarter angle matching their
  battlefield.
- All four RGBA atlases have transparent corners, valid partial alpha, no
  visible chroma residue, and zero hidden RGB values beneath fully transparent
  pixels.
- All fourteen final files were reopened successfully from their final project
  paths and inspected on contact sheets.
- No character, enemy, body, readable text, logo, watermark, UI, or HUD was
  found during visual inspection.

## Repository boundaries

This asset-only batch did not modify `generatedStageAssets.json`, the sprite
manifest, prompt registries, application code, `package.json`, or Git state.
Other concurrent workspace changes were intentionally left untouched.
