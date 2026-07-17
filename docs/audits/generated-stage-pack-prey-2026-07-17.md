# Prey (Predator, 2022) - generated stage pack audit

Date: 2026-07-17
Generator: OpenAI image generation, then local PNG-to-WebP conversion and chroma-key removal for the two RGBA atlases.

## Scope

This pack represents the 1719 Great Plains setting of *Prey* without characters or enemies: mixed-grass prairie, cottonwood/willow river margins, muddy bog or river-trap terrain, a Comanche-region camp landscape cue, open wilderness, and a distant burned forest edge. The camp cue is architectural/environmental only; no people, animals, weapons, logos, or text are included.

## References

- National Park Service, “Prairies and Grasslands” at Wind Cave National Park: prairie ecology, grassland diversity, and the role of fire in maintaining the prairie/forest balance: https://www.nps.gov/wica/learn/nature/prairies.htm
- National Park Service, “Comanche National Grassland”: Great Plains grassland setting and river/trail landscape context: https://www.nps.gov/places/comanche-national-grassland.htm
- National Park Service, “Grasses” at Niobrara National Scenic River: mixed-grass prairie, river-bottom tallgrass, and riparian plant cues: https://www.nps.gov/niob/learn/nature/grasses.htm
- Library of Congress, “Comanche Indian camp”: historical tipi/camp reference used only for environmental silhouette and spacing, not copied into the art: https://www.loc.gov/item/00650194/
- *Prey* (2022) setting reference: 1719 Great Plains / Comanche context, cross-checked against the film setting summary: https://en.wikipedia.org/wiki/Prey_(2022_film)

## Files

| File | Dimensions | Mode | Intended use | Validation |
|---|---:|---|---|---|
| `combat.webp` | 1672x941 | RGB | Lateral 16:9 combat scene, continuous center ground | pass |
| `melee.webp` | 1672x941 | RGB | Lateral melee environment, no baked platforms | pass |
| `melee-backdrop.webp` | 1672x941 | RGB | Background/parallax layer only | pass |
| `melee-platforms.webp` | 1774x887 | RGBA | Transparent side-view platform atlas | pass; alpha range 0-255 |
| `rpg.webp` | 1672x941 | RGB | 2.5D lateral RPG lane with a clear center | pass |
| `tactics.webp` | 1672x941 | RGB | Elevated shallow 3/4 tactical battlefield with readable rectangular 8x6 grid | pass |
| `tactics-tiles.webp` | 1448x1086 | RGBA | Transparent rectangular terrain tile atlas for the 8x6 tactical map | pass; alpha range 0-255 |

## Validation

- Exactly seven requested files are present in `public/backgrounds/lore-stages/prey/`.
- Scene files are opaque RGB WebP images; no accidental transparency is used for gameplay backdrops.
- `melee-platforms.webp` and `tactics-tiles.webp` are RGBA and contain transparent pixels at the atlas background/corners.
- Visual review completed for all seven images.
- No character, enemy, creature, logo, watermark, UI, or text was intentionally included.
- No JS, JSON, generated manifest, or runtime registry was modified for this asset-only request.
- No Git commit was created.
