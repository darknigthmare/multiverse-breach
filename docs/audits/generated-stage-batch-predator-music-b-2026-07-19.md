# Predator: Badlands OpenAI stage pack audit

Date: 2026-07-19

## Revised scope

Following the delivery-priority reduction, this batch contains only the
complete `Predator: Badlands` stage pack:

- `public/backgrounds/lore-stages/predator-badlands/`

The planned Daft Punk pack was not generated and
`public/backgrounds/lore-stages/daft-punk/` was not created.

No manifest, registry, source-code, package, or Git operation is part of this
asset-only batch.

## Visual references

The final environments are original fan-made pixel-art compositions produced
with OpenAI ImageGen. Reference research was used to lock the film's
environmental language, not to reproduce an existing frame.

- [20th Century Studios - Predator: Badlands](https://www.20thcenturystudios.com/movies/predator-badlands)
  - Official film page, synopsis, trailer imagery, Genna wilderness, and the
    austere Badlands palette.
- [Disney+ - Predator: Badlands](https://www.disneyplus.com/explore/articles/predator-badlands-movie)
  - Official waterfall and river imagery for the planet Genna.
- [The Art of VFX - Olivier Dumont interview](https://www.artofvfx.com/predator-badlands-olivier-dumont-production-vfx-supervisor/)
  - Production VFX reference distinguishing harsh, arid Yautja Prime from
    lush, water-dominated Genna. It also identifies tilted tectonic plates,
    exposed faults, sand-falls, sweeping rivers, dangerous vegetation, and
    crescent-shaped rock formations as core visual motifs.
- [Benjamin Last - Predator: Badlands concept design](https://www.benjaminlast.com/work/predator-badlands)
  - Production design reference for the angular Kwei ship and unmarked
    industrial technology materials.
- [Karl Sisson - Planet Genna approach concept art](https://www.artstation.com/artwork/ZlAnAX)
  - Production environment reference for the remote hostile planet's scale,
    cloud cover, water systems, and geological silhouettes.

## OpenAI ImageGen direction

Shared constraints for all seven assets:

- original polished cinematic 32-bit pixel art;
- no character, Yautja, human, synthetic, creature, animal, enemy, body, or
  weapon;
- no readable text, glyph, logo, watermark, UI, HUD, or frame;
- no direct recreation of a film frame;
- collision-readable composition appropriate to each gameplay mode.

| File | Lore and gameplay direction |
| --- | --- |
| `combat.webp` | Strict side-view Genna waterfall arena with crescent rocks, dangerous vegetation, and one continuous wet-stone duel floor. |
| `melee.webp` | Side-view Genna razor-grass plain with shallow water and open airspace; no baked floating platform. |
| `melee-backdrop.webp` | Distant Genna rivers, waterfalls, crescent cliffs, fog, and remote unmarked wreck silhouette; no foreground collision surface. |
| `melee-platforms.webp` | Eight isolated side-view platforms using Genna stone, roots, wet rock, Yautja Prime slabs, dark ship alloy, pale synthetic alloy, and wreckage. |
| `rpg.webp` | Yautja Prime geological badlands with tilted plates, exposed faults, sand-falls, and a broad shallow 2.5D battle lane. |
| `tactics.webp` | Elevated frontal three-quarter Genna battlefield with a fully visible rectangular 8-column by 6-row board; never top-down or diamond-isometric. |
| `tactics-tiles.webp` | Twelve isolated matching three-quarter terrain pieces covering river, moss, crescent rock, razor grass, cover, alloy, objective, and ramp roles. |

## Exact output files

| File | Dimensions | Mode | Bytes | SHA-256 prefix |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 489490 | `fad0b304fe3df1c5` |
| `melee.webp` | 1672x941 | RGB | 435638 | `f30345afc59d5eb4` |
| `melee-backdrop.webp` | 1672x941 | RGB | 359046 | `c9b39bac1b82be46` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 550644 | `d820aa2b3093adde` |
| `rpg.webp` | 1672x941 | RGB | 612160 | `9b4bc4cf314cd5ab` |
| `tactics.webp` | 1448x1086 | RGB | 664846 | `d078e6a7a37f5533` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 764086 | `92c4e714ac03c3c2` |

The directory contains exactly these seven files and no additional asset.

## Alpha and chroma validation

| File | Transparent pixels | Partial-alpha pixels | Visible magenta pixels | RGB under alpha 0 | Corner alpha |
| --- | ---: | ---: | ---: | ---: | --- |
| `melee-platforms.webp` | 1268639 | 33933 | 0 | 0 | 0 / 0 / 0 / 0 |
| `tactics-tiles.webp` | 1144790 | 25181 | 0 | 0 | 0 / 0 / 0 / 0 |

Both atlases were reviewed over a checkerboard after their final lossless WebP
export. Chroma residue from the first matte pass was detected during review,
removed, and revalidated before delivery.

## Final visual review

- All seven final WebP files reopen successfully from their project paths.
- Combat uses a strict lateral camera, continuous floor, and empty duel center.
- Melee contains no baked floating platform.
- The melee backdrop is limited to distant parallax scenery.
- RPG uses a stable shallow three-quarter lane with an unobstructed lower
  battle area.
- Tactics uses an elevated frontal three-quarter camera and visibly presents
  exactly 8 columns by 6 rows.
- Platform and tactics atlases have separated, non-overlapping assets with
  coherent mode-specific angles.
- No character, performer, enemy, creature, readable text, logo, watermark,
  UI, or HUD was found during final inspection.

## Repository boundaries

Only the following project paths were written:

- `public/backgrounds/lore-stages/predator-badlands/`
- `docs/audits/generated-stage-batch-predator-music-b-2026-07-19.md`

Concurrent workspace changes outside these paths were left untouched.
