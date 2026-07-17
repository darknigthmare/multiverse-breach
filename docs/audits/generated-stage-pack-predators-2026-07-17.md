# Predators (2010) - OpenAI stage pack audit

Date: 2026-07-17

## Scope

Complete OpenAI-generated stage pack for the `Predators (2010)` profile in
`public/backgrounds/lore-stages/predators/`.

The visual direction is based on the film's alien Game Preserve Planet:
hostile jungle, hunting camp, trophy totems, clearings, traps, watch
structures, and a sky with multiple visible planets. The deliverables are
original fan-made pixel-art compositions. No official bitmap, film still,
logo, text, character, or enemy asset was copied into the files.

## References consulted

- [20th Century Studios - Predators](https://www.20thcenturystudios.com/movies/predators)
  - official synopsis of Royce's group being dropped onto an alien planet and
    hunted as prey.
- [Designing Sound - Predators: Paula Fairfield and Carla Murray](https://designingsound.org/2010/07/30/predators-exclusive-interview-with-paula-fairfield-carla-murray/)
  - jungle atmosphere, prey falling from the sky, traps, death camp, totem
    display, and the hunting-ground sound identity.
- [Wired - Predators at SXSW](https://www.wired.com/2010/03/sxsw-predators/)
  - Game Preserve Planet context, jungle planet geography, surveillance and
    hunting technology, and the Super Predators' preserve.
- [AVP Central - Predator Game Preserve Planet](https://www.avpcentral.com/predator-game-preserve-planet)
  - camp structures, hunting tools, surveillance elements, trophy displays,
    and the preserve as a controlled hunting ground.
- [Predators (2010) plot summary](https://en.wikipedia.org/wiki/Predators_%282010_film%29)
  - alien jungle, strange monument, cages, traps, camp, captive Predator,
    and the visible moons/planets used as visual anchors.

## Visual and gameplay rules

- Detailed 32-bit pixel art with a restrained jungle palette and alien blue
  bioluminescence.
- No characters, enemies, logos, readable text, watermark, HUD, or UI.
- Combat: strict lateral 16:9 composition, continuous floor, open central
  combat lane.
- Melee: lateral environment only; no baked gameplay platforms.
- Melee backdrop: atmospheric background layer only.
- Melee platforms: separate transparent atlas for runtime platform placement.
- RPG: lateral 2.5D composition with a clear central party lane.
- Tactics: elevated 3/4 view with a readable rectangular 8-column by 6-row
  board; never top-down and never diamond-isometric.
- Tactics tiles: separate transparent atlas for runtime tile composition.

## Deliverables and validation

| File | Dimensions | Mode | Alpha | Gameplay role |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | No | Lateral 16:9 preserve clearing with a continuous floor and free center. |
| `melee.webp` | 1672x941 | RGB | No | Lateral melee environment with one continuous ground plane and no baked platform. |
| `melee-backdrop.webp` | 1672x941 | RGB | No | Background-only jungle, camp, totems, and planet sky layer. |
| `melee-platforms.webp` | 1254x1254 | RGBA | Yes, 0-255 | Four isolated runtime platform pieces on transparent background. |
| `rpg.webp` | 1672x941 | RGB | No | Side-view 2.5D hunting-ground lane with open center. |
| `tactics.webp` | 1448x1086 | RGB | No | Elevated 3/4 hunting camp battlefield with readable rectangular 8x6 grid. |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Yes, 0-255 | Eight isolated 3/4 rectangular terrain and objective tile variants. |

Alpha validation for both atlas files confirmed an alpha range of `(0, 255)`;
the chroma-key background was removed and the result was written as a real
RGBA WebP. All seven deliverables were reopened from their final `.webp`
paths after conversion and rendered successfully for visual inspection.

## Generation notes

The scene images were generated with OpenAI image generation and then encoded
as WebP. The platform and tile atlases were generated on a flat chroma-key
background, processed with the local chroma-key removal utility, checked for
transparent pixels, and encoded as lossless RGBA WebP.

No JavaScript, TypeScript, CSS, JSON, manifest, or sprite registry was changed.
No Git commit was created.
