# Aliens vs Predator: Requiem OpenAI Stage Pack - 2026-07-18

## Scope

Complete OpenAI ImageGen environment pack for the
`Aliens vs Predator: Requiem` profile in `src/game/stageLoreProfiles.js`.

Canonical location lock:

> Gunnison hospital rooftop and the rain-flooded Colorado town during the
> final outbreak night.

All images are original fan-made game assets. Reference material was used to
lock the location, weather, architecture and palette, not to copy a film frame.

## References

1. 20th Century Studios official film page:
   https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem
   - Confirms the 2007 film continuity and its Earth-based suburban setting.
2. 20th Century Studios Japan Blu-ray page:
   https://www.20thcenturystudios.jp/movies/avp2
   - Lists the official rooftop, sewer and hive behind-the-scenes still
     galleries included with the release.
3. AvP Galaxy production-still and behind-the-scenes indexes:
   https://www.avpgalaxy.net/avp-movies/avp-requiem/gallery/production-stills/
   https://www.avpgalaxy.net/avp-movies/avp-requiem/gallery/behind-the-scenes/
   - Used only to cross-check rooftop proportions, rain, hospital materials
     and the Gunnison night palette.

## Outputs

| File | Dimensions | Mode | Alpha | Gameplay use |
| --- | ---: | --- | --- | --- |
| `combat.webp` | 1672x941 | RGB | No | Strict side-view duel rooftop |
| `melee.webp` | 1672x941 | RGB | No | Open side-view platform arena |
| `melee-backdrop.webp` | 1672x941 | RGB | No | Distant Gunnison parallax layer |
| `melee-platforms.webp` | 1536x1024 | RGBA | 0-255 | Modular wet-rooftop platforms |
| `rpg.webp` | 1672x941 | RGB | No | Side-view 2.5D rooftop battle lane |
| `tactics.webp` | 1672x941 | RGB | No | Elevated three-quarter 8x6 battlefield |
| `tactics-tiles.webp` | 1448x1086 | RGBA | 0-255 | Modular cells, cover and hazards |

Main scenes were exported as WebP quality 94. The two chroma-key atlases were
converted to lossless exact-alpha WebP after soft matte, despill, one-pixel
edge contraction and residual-magenta cleanup.

## Prompt locks

All seven prompts used these shared constraints:

- original highly detailed 32-bit pixel art;
- Gunnison hospital rooftop, powerless town, mountains, rain and wet
  blue-green surfaces;
- no characters, Aliens, Predators, soldiers, bodies, gore, logos, readable
  text, watermark or baked UI;
- no direct recreation of a film frame.

Mode-specific locks:

- Combat: continuous edge-to-edge rooftop floor and open duel center.
- Melee: no baked floating platform; runtime platforms stay in a separate
  atlas.
- Melee backdrop: distant panorama only, with no collision surface.
- RPG: broad lateral 2.5D battle plane and unobstructed center lane.
- Tactics: elevated frontal three-quarter camera, never overhead or
  diamond-isometric.
- Melee atlas: horizontal collision-readable roof and maintenance pieces on a
  flat magenta chroma key.
- Tactics atlas: twelve matching trapezoidal cells, covers and hazards on a
  flat magenta chroma key.

## Tactics grid

The OpenAI battlefield was generated without cell lines. A deterministic
overlay then added:

- 9 vertical boundaries;
- 7 horizontal boundaries;
- exactly 8 columns by 6 rows;
- a frontal trapezoidal perspective with lower rows visibly nearer and wider.

## Validation

- All seven required files exist and decode successfully with Pillow.
- Combat has a continuous floor and no center obstruction.
- Melee contains no baked floating platform.
- RPG keeps the party and enemy lane clear.
- Tactics visibly contains exactly 48 cells and preserves the requested
  three-quarter camera.
- Both atlases contain transparent and fully opaque pixels.
- Transparent WebP pixels have zeroed RGB data to prevent texture-edge
  bleeding.
- No magenta chroma residue remains.
- Every final image was visually inspected after WebP export.
