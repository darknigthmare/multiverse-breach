# Generated Stage Pack Audit - Alien vs Predator (2004)

Date: 2026-07-17
Universe slug: `alien-vs-predator`
Generator: OpenAI ImageGen, then local crop/resize and chroma-key alpha cleanup for the two atlases.

## Files created

| File | Dimensions | Mode | Alpha | Role |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1536 x 864 | RGB | none | Lateral combat scene with a continuous floor and open center lane. |
| `melee.webp` | 1536 x 864 | RGB | none | Lateral melee background; platforms are supplied separately. |
| `melee-backdrop.webp` | 1536 x 864 | RGB | none | Background-only melee layer. |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | `(0,255)` | Transparent atlas of side-view basalt, bronze and ice platforms. |
| `rpg.webp` | 1536 x 864 | RGB | none | Lateral 2.5D RPG lane with the central combat space left clear. |
| `tactics.webp` | 1536 x 1024 | RGB | none | Elevated three-quarter tactics scene with a rectangular 8 x 6 board. |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | `(0,255)` | Transparent atlas of rectangular elevated three-quarter tactics tiles. |

All files are located in:

`public/backgrounds/lore-stages/alien-vs-predator/`

## Lore and visual references

The pack uses the 2004 film's Bouvetoya setting and its buried automated pyramid as the visual anchor. The pyramid combines ancient architectural influences, cold Antarctic ice, ritual spaces and a reconfiguring internal layout. Glyphs are deliberately abstract and non-readable so the assets do not introduce invented UI text or copied lettering.

- [20th Century Studios - Alien vs. Predator](https://www.20thcenturystudios.com/movies/alien-vs-predator): Bouvetoya, the ancient automated pyramid and the hunting rite premise.
- [Alien vs. Predator Central - 2004 plot and pyramid overview](https://www.avpcentral.com/alien-vs-predator-2004): sacrificial chamber, pyramid architecture and shifting walls.
- [Animation World Network - Alien Vs. Predator visual effects production](https://www.awn.com/vfxworld/alien-vs-predator-battle-merge-practical-effects-and-cgi): Antarctic ice cliff, pyramid interiors and the Queen chamber as production references.
- [ComingSoon - John Bruno interview](https://www.comingsoon.net/?p=3321): the pyramid's periodic reconfiguration and changing exits.

## Constraint validation

- Pixel-art treatment: detailed 32-bit-inspired pixel clusters and a controlled dark basalt, oxidized bronze and glacial cyan palette.
- No characters, enemies, weapons, logos, UI or readable text are present in the generated scene briefs.
- `combat.webp`: lateral 16:9 scene, continuous floor and playable center kept open.
- `melee.webp`: lateral backdrop with no baked platform layer.
- `melee-backdrop.webp`: separate background-only layer.
- `melee-platforms.webp`: separate RGBA atlas; transparent outside platform silhouettes.
- `rpg.webp`: lateral 2.5D lane with no central foreground obstruction.
- `tactics.webp`: elevated 3/4 view with rectangular 8 x 6 slab layout; not top-down and not diamond isometric.
- `tactics-tiles.webp`: separate RGBA atlas of rectangular elevated tiles.

## Local validation

Validated on 2026-07-17 with Pillow:

```text
7 expected files present
7 images load successfully
combat.webp           1536x864   RGB
melee.webp            1536x864   RGB
melee-backdrop.webp   1536x864   RGB
melee-platforms.webp  1024x1024  RGBA  alpha extrema (0,255)
rpg.webp              1536x864   RGB
tactics.webp          1536x1024  RGB
tactics-tiles.webp    1024x1024  RGBA  alpha extrema (0,255)
0 opaque green-like pixels remaining in either atlas
```

No JavaScript, JSON, sprite manifest or other runtime registry was modified for this pack.
