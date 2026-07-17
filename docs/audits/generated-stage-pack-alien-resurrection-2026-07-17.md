# Alien Resurrection - USM Auriga stage pack

Generated with OpenAI ImageGen on 2026-07-17. These are original fan-made pixel-art environments for the Multiverse Breach project; no official image was copied into the game.

## Files

| Asset | Format | Dimensions | Gameplay role |
| --- | --- | ---: | --- |
| `public/backgrounds/lore-stages/alien-resurrection/combat.webp` | WebP RGB | 1536x864 | Continuous 16:9 side-view Combat lane |
| `public/backgrounds/lore-stages/alien-resurrection/melee.webp` | WebP RGB | 1536x864 | Complete Melee arena with uneven reachable platforms |
| `public/backgrounds/lore-stages/alien-resurrection/melee-backdrop.webp` | WebP RGB | 1536x864 | Mêlée backdrop with no baked gameplay platforms |
| `public/backgrounds/lore-stages/alien-resurrection/melee-platforms.webp` | WebP RGBA | 1536x1024 | Separated catwalk/platform atlas |
| `public/backgrounds/lore-stages/alien-resurrection/rpg.webp` | WebP RGB | 1536x864 | 2.5D RPG lane with foreground/midground/background depth |
| `public/backgrounds/lore-stages/alien-resurrection/tactics.webp` | WebP RGB | 1536x864 | Elevated three-quarter Tactics battlefield, rectangular 8x6 layout |
| `public/backgrounds/lore-stages/alien-resurrection/tactics-tiles.webp` | WebP RGBA | 1536x1024 | Separated rectangular tactical tile atlas |

## Lore and visual direction

The pack uses the `Alien Resurrection` profile from `src/game/stageLoreProfiles.js`: the USM Auriga cloning laboratory and the flooded containment deck. The scenes keep the film's late-1990s military-biomedical production design: ribbed gunmetal bulkheads, copper pipework, surgical amber lighting, medical glass, condensation, warning red and wet steel. The design intentionally avoids a Dead Space necromorph language.

Reference sources consulted:

- [20th Century Studios - Alien Resurrection](https://www.20thcenturystudios.com/movies/alien-resurrection): USM military scientists, cloning project, Ripley clone and lab ship context.
- [Alien Resurrection production design overview](https://www.filmmining101.com/production-design/alien-resurrection): Auriga's techno-gothic biomedical interior direction.
- [AVP Galaxy - Alien Resurrection production facts](https://www.avpgalaxy.net/alien-movies/alien-resurrection/): Auriga design development and the final streamlined ship language.
- [USM Auriga flooded-set documentation](https://weyland.fandom.com/wiki/USM_Auriga): flooded kitchen/containment-set and water-stage context used only as visual research.

## Validation

- All seven requested files exist under the requested `alien-resurrection` directory.
- Five scene files are RGB WebP at `1536x864`.
- Both atlas files are RGBA WebP at `1536x1024`.
- Atlas corners are fully transparent and the alpha inspection shows no visible chroma-key background on a checkerboard composite.
- Combat is a continuous side-view lane with no characters, creatures or text.
- Mêlée has separate platform assets; the complete arena uses an uneven low/medium/high platform arrangement rather than a uniform staircase.
- RPG preserves a free side-facing lane with readable depth layers.
- Tactics uses an elevated three-quarter view with rectangular floor cells and an 8x6 battlefield read; it is not top-down and does not use diamond-shaped tiles.
- No JavaScript, JSON, sprite manifest or runtime mapping was changed for this asset-only task.

