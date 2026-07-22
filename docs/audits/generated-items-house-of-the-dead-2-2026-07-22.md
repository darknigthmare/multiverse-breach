# House of the Dead 2 - OpenAI item icons

Date: 2026-07-22

## Scope

Four independent item icons were generated with the integrated OpenAI ImageGen tool for `House of the Dead 2` (1998). No JavaScript, JSON, manifest, or registry file was changed in this task.

Lore references:

- SEGA arcade history: https://www.sega.jp/history/arcade/product/8991/
- Dreamcast manual: https://www.digitpress.com/library/manuals/dreamcast/house_dead_2.pdf

## Delivered assets

| Asset | Lore anchor | Final QA |
| --- | --- | --- |
| `cougar-inox-handgun.png` | Compact stainless-steel semiautomatic handgun with dark grip | PASS |
| `first-aid-kit.png` | Compact white/red arcade medical case | PASS |
| `chamber-plus-2.png` | Original Mode capacity module; two added chambers represented without text | PASS |
| `original-mode-shotgun.png` | Short pump-action shotgun with dark wood and blued steel | PASS |

Output directory:

`public/sprites/generated/items/house-of-the-dead-2/`

## Generation method

- One separate OpenAI ImageGen generation per object.
- Original fan-made late-1990s 32-bit arcade pixel-art rendering.
- Three-quarter view from slightly above.
- Exactly one complete object per image.
- Flat green chroma-key source with no scene, character, UI, text, brand, or watermark.
- Chroma removed with the installed `remove_chroma_key.py` helper using border auto-key sampling, soft matte, and despill.
- Final nearest-neighbor normalization to `512x512` RGBA.
- Fully transparent pixels normalized to `(0, 0, 0, 0)`.

## Technical QA

| File | Size | Mode | Visible alpha bbox | Minimum transparent margin | Hidden RGB under alpha 0 | Green residue |
| --- | --- | --- | --- | ---: | ---: | ---: |
| `cougar-inox-handgun.png` | 512x512 | RGBA | 82,76 - 428,416 | 76 px | 0 | 0 |
| `first-aid-kit.png` | 512x512 | RGBA | 84,84 - 437,424 | 75 px | 0 | 0 |
| `chamber-plus-2.png` | 512x512 | RGBA | 136,111 - 376,385 | 111 px | 0 | 0 |
| `original-mode-shotgun.png` | 512x512 | RGBA | 36,101 - 476,413 | 36 px | 0 | 0 |

All four files have transparent corners, alpha extrema `0..255`, complete silhouettes, no cropping, no duplicate object, and no visible chroma fringe.

## Visual verdict

- `Cougar Inox Handgun`: readable compact stainless-steel pistol silhouette and dark grip; no markings.
- `First Aid Kit`: clear arcade pickup silhouette with white shell, red reinforcements, and a plain medical cross.
- `Chamber +2`: two emphasized chamber wells and two indicators communicate the upgrade without a written `+2`.
- `Original Mode Shotgun`: complete short pump-action weapon with coherent wood and steel materials.

Final result: **4 PASS / 0 FAIL**.
