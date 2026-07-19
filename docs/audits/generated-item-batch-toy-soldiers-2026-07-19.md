# OpenAI Item Batch - Toy Soldiers - 2026-07-19

## Scope

This batch adds exactly four original OpenAI ImageGen item icons for
`Toy Soldiers` (the 2010 video game, not the 1991 film):

- `public/sprites/generated/items/toy-soldiers/wind-up-key.png`
- `public/sprites/generated/items/toy-soldiers/tin-soldier-rifle.png`
- `public/sprites/generated/items/toy-soldiers/toy-artillery-shell.png`
- `public/sprites/generated/items/toy-soldiers/ration-tin.png`

No official sprite was copied or traced. The images are original fan-art
interpretations of antique WWI toy accessories.

## References

- Steam store page and screenshot gallery:
  <https://store.steampowered.com/app/98300/Toy_Soldiers/>
- Official Toy Soldiers site, including the 2010 game overview:
  <https://www.toysoldiersgame.com/>
- Official Toy Soldiers HD gallery, used only as a higher-resolution visual
  reference for the original game's miniature material language:
  <https://www.toysoldiersgame.com/toy-soldiers-hd/>
- Signal Studios' official Toy Soldiers page:
  <https://www.signalstudios.net/games/toy-soldiers-invasion-dlc>

The Steam and official references establish the key visual direction: antique
WWI toy soldiers, guns and artillery staged as vintage trench dioramas, with
painted miniature metal, muted military colors, exposed tin, brass details and
clearly toy-like proportions.

## Generation

- Generator: OpenAI built-in ImageGen.
- Generation count: exactly four calls, one per requested icon.
- Source size and mode: `1254x1254`, RGB.
- Source background: flat magenta chroma key requested as `#ff00ff`.
- Final style: high-detail 32-bit pixel art.
- Composition: one complete centered object with empty padding.

### Wind-up key prompt

```text
Use case: stylized-concept
Asset type: square video-game inventory item icon, final will be normalized to 512x512 PNG RGBA
Primary request: Create one original fan-art wind-up key inspired by the antique miniature WWI toy-diorama material language of Signal Studios' 2010 video game Toy Soldiers, not the 1991 film. Do not copy, trace, or reproduce any official sprite or logo.
Subject: exactly one complete mechanical toy winding key, unmistakably a wind-up mechanism key rather than a door key; compact steel shaft and broad double-lobed winding bow, small round brass-colored hub, painted dark military olive with chipped edges exposing silvery tin metal; subtle cast seam, tiny rivet and slightly chunky toy proportions make the miniature scale obvious.
Style/medium: high-detail crisp 32-bit pixel art, deliberately pixel-clustered edges and highlights, polished game inventory sprite, no smooth vector look, no photorealism.
Composition/framing: one object only, centered, fully visible, slight three-quarter view, diagonal but balanced, generous empty padding on every side; no cropping.
Lighting/materials: restrained cool studio-style pixel highlights only on the object; painted tin, worn enamel and small brass detail clearly readable.
Scene/backdrop: perfectly flat solid #ff00ff magenta chroma-key background for removal. The background must be one uniform color with no shadow, gradient, texture, reflection, floor plane, halo, vignette, or lighting variation. Do not use #ff00ff or magenta anywhere in the object.
Constraints: exactly one object; no person, soldier, character, hand, arm, key ring, lock, text, letters, numbers, insignia, logo, trademark, border, frame, cast shadow, contact shadow, scenery, extra parts, duplicate object, watermark, or chromatic aberration.
```

### Tin-soldier rifle prompt

```text
Use case: stylized-concept
Asset type: square video-game inventory item icon, final will be normalized to 512x512 PNG RGBA
Primary request: Create one original fan-art miniature WWI toy-soldier rifle inspired by the antique trench-diorama material language of Signal Studios' 2010 video game Toy Soldiers, not the 1991 film. Do not copy, trace, or reproduce any official sprite, named weapon model, or logo.
Subject: exactly one complete generic WWI-era bolt-action rifle made as a small cast-metal soldier toy accessory; long single barrel, simple front sight, bolt and trigger guard, chunky molded stock painted muted dark brown to imitate wood, blued gunmetal receiver and barrel, tiny cast seam and rubbed paint chips exposing silver-colored tin; visibly miniature toy proportions. No bayonet and no ammunition.
Style/medium: high-detail crisp 32-bit pixel art, deliberate pixel clusters and stepped edges, polished game inventory sprite, no smooth vector look, no photorealism.
Composition/framing: one rifle only, centered, fully visible from butt to muzzle, slight three-quarter side view, rising diagonal from lower left to upper right, generous empty padding on every side; no cropping.
Lighting/materials: restrained cool pixel highlights on painted tin metal; miniature molded construction and worn enamel clearly readable.
Scene/backdrop: perfectly flat solid #ff00ff magenta chroma-key background for removal. The background must be one uniform color with no shadow, gradient, texture, reflection, floor plane, halo, vignette, or lighting variation. Do not use #ff00ff or magenta anywhere in the rifle.
Constraints: exactly one object; no person, soldier, character, hand, arm, sling, bayonet, bullet, ammunition, text, letters, numbers, insignia, logo, trademark, border, frame, cast shadow, contact shadow, scenery, extra parts, duplicate object, watermark, or chromatic aberration.
```

### Toy artillery shell prompt

```text
Use case: stylized-concept
Asset type: square video-game inventory item icon, final will be normalized to 512x512 PNG RGBA
Primary request: Create one original fan-art miniature trench-artillery shell inspired by the antique WWI toy-diorama material language of Signal Studios' 2010 video game Toy Soldiers, not the 1991 film. Do not copy, trace, or reproduce any official sprite or logo.
Subject: exactly one complete stout WWI-era artillery projectile rendered unmistakably as a small painted metal toy accessory; pointed ogive nose, cylindrical body, narrow copper-brass driving band near the base, flat closed base, muted olive-drab and charcoal enamel, tiny cast seam, miniature rivet-like manufacturing details, rubbed chips exposing silver-colored tin; clearly a toy-scale shell, not a modern missile, rocket, bullet, cartridge, or explosive scene.
Style/medium: high-detail crisp 32-bit pixel art, deliberate pixel clusters and stepped edges, polished game inventory sprite, no smooth vector look, no photorealism.
Composition/framing: one shell only, centered, fully visible, slight three-quarter view, diagonal from lower left to upper right, generous empty padding on every side; no cropping.
Lighting/materials: restrained cool pixel highlights on painted metal, aged enamel and small brass/copper band clearly readable.
Scene/backdrop: perfectly flat solid #ff00ff magenta chroma-key background for removal. The background must be one uniform color with no shadow, gradient, texture, reflection, floor plane, halo, vignette, smoke, sparks, or lighting variation. Do not use #ff00ff or magenta anywhere in the shell.
Constraints: exactly one object; no person, soldier, character, hand, arm, weapon, gun, launcher, flame, smoke, explosion, fuse cord, text, letters, numbers, insignia, warning symbol, logo, trademark, border, frame, cast shadow, contact shadow, scenery, extra parts, duplicate object, watermark, or chromatic aberration.
```

### Ration tin prompt

```text
Use case: stylized-concept
Asset type: square video-game inventory item icon, final will be normalized to 512x512 PNG RGBA
Primary request: Create one original fan-art miniature military ration tin inspired by the antique WWI toy-diorama material language of Signal Studios' 2010 video game Toy Soldiers, not the 1991 film. Do not copy, trace, or reproduce any official sprite, package design, label, or logo.
Subject: exactly one small closed rectangular ration tin made as a painted metal toy accessory; shallow rounded rectangle with a pressed lid, rolled rim, tiny hinge and simple clasp, muted olive-green enamel with a few worn chips exposing silvery tin, subtle stamped ridges and cast seam; chunky miniature proportions clearly communicate toy scale. Absolutely no writing or label.
Style/medium: high-detail crisp 32-bit pixel art, deliberate pixel clusters and stepped edges, polished game inventory sprite, no smooth vector look, no photorealism.
Composition/framing: one tin only, centered, fully visible, slight top-down three-quarter view, balanced diagonal orientation, generous empty padding on every side; no cropping; lid remains closed.
Lighting/materials: restrained cool pixel highlights on painted tin metal, rolled edges and miniature construction clearly readable.
Scene/backdrop: perfectly flat solid #ff00ff magenta chroma-key background for removal. The background must be one uniform color with no shadow, gradient, texture, reflection, floor plane, halo, vignette, or lighting variation. Do not use #ff00ff or magenta anywhere in the tin.
Constraints: exactly one object; no food, utensils, person, soldier, character, hand, arm, text, letters, numbers, label, insignia, logo, trademark, border, frame, cast shadow, contact shadow, scenery, extra parts, duplicate object, watermark, or chromatic aberration.
```

## Chroma and normalization

The installed ImageGen helper was used for every source:

```text
remove_chroma_key.py
  --auto-key border
  --soft-matte
  --transparent-threshold 12
  --opaque-threshold 220
  --despill
```

The auto-sampled source keys were:

| File | Sampled key |
| --- | --- |
| `wind-up-key.png` | `#fa04e8` |
| `tin-soldier-rifle.png` | `#fc03fa` |
| `toy-artillery-shell.png` | `#fb03f9` |
| `ration-tin.png` | `#fb04f9` |

The key required the helper's documented `--edge-contract 1` retry to remove a
thin purple fringe around the winding holes and shaft. All helper outputs were
resized with premultiplied alpha to `512x512`. Pixels at or below alpha 24
created by the final resampling pass were cleared, and RGB values under fully
transparent pixels were zeroed.

## Visual inspection

The four final PNGs were composited at final resolution on a dark checkerboard
and inspected together.

- Each file contains one complete, centered object.
- Painted metal, exposed tin, brass/copper and molded miniature construction
  make the toy scale visible.
- There is no character, soldier, hand, arm, text, logo, mark or readable label.
- There is no border, frame, cast shadow, contact shadow, scenery or decoration.
- There is no visible magenta residue, halo or edge fringe.
- The rifle is a single generic WWI bolt-action toy rifle without a hand,
  bayonet or ammunition.
- The ration tin is closed and has no readable text.

## Automated validation

| File | Size | Mode | Alpha | Corners | Border px | Hidden RGB | Chroma | Fringe | Components |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `wind-up-key.png` | 512x512 | RGBA | 0-255 | 0/0/0/0 | 0 | 0 | 0 | 0 | 1 |
| `tin-soldier-rifle.png` | 512x512 | RGBA | 0-255 | 0/0/0/0 | 0 | 0 | 0 | 0 | 1 |
| `toy-artillery-shell.png` | 512x512 | RGBA | 0-255 | 0/0/0/0 | 0 | 0 | 0 | 0 | 1 |
| `ration-tin.png` | 512x512 | RGBA | 0-255 | 0/0/0/0 | 0 | 0 | 0 | 0 | 1 |

Alpha bounding boxes and transparent margins:

| File | Alpha bbox | Margins L/T/R/B |
| --- | --- | --- |
| `wind-up-key.png` | 91, 70, 432, 421 | 91, 70, 80, 91 |
| `tin-soldier-rifle.png` | 20, 104, 493, 391 | 20, 104, 19, 121 |
| `toy-artillery-shell.png` | 92, 50, 434, 443 | 92, 50, 78, 69 |
| `ration-tin.png` | 52, 90, 460, 425 | 52, 90, 52, 87 |

SHA-256:

| File | SHA-256 |
| --- | --- |
| `wind-up-key.png` | `95bb5584073e7aac19b534c3fc293ec1affdaeb52855d4da0f68db0010a150cf` |
| `tin-soldier-rifle.png` | `d81a2741031a6873cfa615e5406b38df9a2c2dd8578942597225620ef87e8815` |
| `toy-artillery-shell.png` | `7a2fa888d78587dd6611f2a156e801b74eff9f11b617d54fde2cefe76b453b95` |
| `ration-tin.png` | `05c3e00d5ac2284bd841118f4ab76066cd17387630e74c67dc321696bdebc3c4` |

No manifest, global prompt file, source code, package file or Git metadata was
modified for this batch.
