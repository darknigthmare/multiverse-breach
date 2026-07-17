# Alien: Covenant - generated stage pack audit

Date: 2026-07-17
Universe: Alien: Covenant (2017)
Generator: OpenAI image generation, followed by local chroma-key removal for transparent atlases
Scope: stage images only; no JS, JSON, sprite manifest, or game registry changes

## Files created

All files are in `public/backgrounds/lore-stages/alien-covenant/`:

| File | Use | Dimensions | Mode | Alpha |
| --- | --- | ---: | --- | --- |
| `combat.webp` | lateral combat background, continuous floor | 1672x941 | RGB | n/a |
| `melee.webp` | lateral melee decor, no baked platforms | 1672x941 | RGB | n/a |
| `melee-backdrop.webp` | decor-only melee backdrop | 1672x941 | RGB | n/a |
| `melee-platforms.webp` | modular melee platform atlas | 1536x1024 | RGBA | min 0, max 255 |
| `rpg.webp` | 2.5D lateral RPG lane | 1536x1024 | RGB | n/a |
| `tactics.webp` | elevated 3/4 rectangular tactics board, 8x6 readable cells | 1448x1086 | RGB | n/a |
| `tactics-tiles.webp` | modular tactics tile atlas | 1536x1024 | RGBA | min 0, max 255 |

## Visual and gameplay checks

- No characters, enemies, logos, UI, readable text, or watermark are present in the generated stage scenes and atlases.
- `combat.webp` has a continuous lateral floor and an open center lane.
- `melee.webp` and `melee-backdrop.webp` contain decor only; platforms are kept in `melee-platforms.webp`.
- `rpg.webp` uses a lateral 2.5D cathedral/laboratory composition with a clear central battle lane.
- `tactics.webp` uses an elevated three-quarter view with orthogonal rectangular cells. It is not top-down and does not use diamond isometric geometry.
- Both atlases have transparent corners and opaque platform/tile content. Chroma-key removal reported both transparent and opaque pixels.
- All seven required files exist and open successfully through Pillow/WebP decoding.

## Lore references used

1. The Art of VFX interview with Ferran Domenech, MPC VFX Supervisor, 2017:
   https://www.artofvfx.com/alien-covenant-ferran-domenech-vfx-supervisor-mpc/
   The interview describes the Engineer city as a large valley city with a 2 km plaza and a 500 m cathedral dome, and identifies Soviet brutalism, monolithic stone, and Egyptian, Greek, and Roman references in the architecture.
2. Roger Ebert review of Alien: Covenant, 2017:
   https://www.rogerebert.com/reviews/alien-covenant-2017
   The review describes David's city of the dead as a medieval-looking place carved from volcanic rock and discusses the film's dark-fairy-tale visual language.
3. Alien: Covenant press dossier, 20th Century Fox / Scott Free / Brandywine:
   https://digitalcine.fr/wp-content/uploads/2017/05/alien-covenant-dossier-presse.pdf
   Used as a production-era reference for the film context and visual setting.

## Result

The requested Alien: Covenant stage pack is complete with exactly seven files. No source-code, JSON, manifest, or Git operation was performed for this asset-only task.
