# Predator 2 - OpenAI stage pack

Date: 2026-07-17
Asset type: original fan-made 32-bit pixel-art stage backgrounds
Target folder: `public/backgrounds/lore-stages/predator-2/`

## Lore reference pass

The pack is based on the film's urban-hunt identity rather than the jungle setting of the first film:

- Los Angeles in the imagined year 1997, during an oppressive heat wave and widespread urban violence.
- Dense downtown streets and alleys treated as an urban jungle, with heat haze, concrete, fencing, rooftops and industrial service areas.
- Subway and tunnel spaces used for the night pursuit and close-quarters hunt.
- Slaughterhouse / meat-locker industrial spaces used as the Predator's feeding and investigation location.
- Rooftop skyline and elevated city routes used for the final urban chase atmosphere.
- Cold industrial blue, sodium amber, rust, concrete and green/red equipment accents; no character, enemy, logo or readable text is baked into any image.

References consulted:

- 20th Century Studios official film page: https://www.20thcenturystudios.com/movies/predator-2
- AFI Catalog synopsis and production notes: https://catalog.afi.com/Film/58654-PREDATOR-2
- Los Angeles Times contemporary review describing the 1997 downtown urban-jungle setting: https://www.latimes.com/archives/la-xpm-1990-11-21-ca-4467-story.html
- AVP Galaxy production-design / ship history and subway context: https://www.avpgalaxy.net/predator-movies/predator-2/designing-the-unknown-the-story-behind-the-lost-predators-ship/
- AVP Galaxy production trivia covering the slaughterhouse and subway material: https://www.avpgalaxy.net/predator-movies/predator-2/trivia/

The generated images are original project assets. The references were used for environment, period, palette and scene vocabulary, not as source-image copies.

## Gameplay composition

- `combat.webp`: lateral 16:9 combat arena with a continuous asphalt floor and a free central lane.
- `melee.webp`: lateral platform-fighter decor without baked platforms.
- `melee-backdrop.webp`: background plate only, with rooftop skyline depth and no usable foreground platform.
- `melee-platforms.webp`: separate RGBA atlas of eight side-profile platform pieces for runtime placement.
- `rpg.webp`: lateral 2.5D battle lane with layered depth and central space reserved for combatants.
- `tactics.webp`: elevated three-quarter tactical map, orthogonal rectangular 8x6 grid, never top-down and never diamond isometric.
- `tactics-tiles.webp`: separate RGBA atlas of rectangular three-quarter tiles and cover/material pieces for an 8x6 tactical board.

## Validation

Required files: 7
Files found: 7
Extra files in target folder: 0

| File | Dimensions | Mode | Alpha |
| --- | ---: | --- | --- |
| `combat.webp` | 1672x941 | RGB | n/a |
| `melee.webp` | 1672x941 | RGB | n/a |
| `melee-backdrop.webp` | 1672x941 | RGB | n/a |
| `melee-platforms.webp` | 1254x1254 | RGBA | extrema 0..255 |
| `rpg.webp` | 1672x941 | RGB | n/a |
| `tactics.webp` | 1536x1024 | RGB | n/a |
| `tactics-tiles.webp` | 1254x1254 | RGBA | extrema 0..255 |

The two atlas files were generated on a flat chroma key and locally converted to alpha. Both contain transparent pixels and opaque sprite regions. No JavaScript, JSON, sprite manifest or runtime mapping was modified for this asset-only request.
