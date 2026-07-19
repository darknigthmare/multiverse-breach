# OpenAI Item Batch - Classic Action - 2026-07-19

## Scope delivered

The interrupted 12-item batch was reduced to the four requested Splatterhouse
items. Streets of Rage and Toy Soldiers were stopped before project integration.
No PNG from those two universes was added to the repository.

Final project assets:

- `public/sprites/generated/items/splatterhouse/terror-mask.png`
- `public/sprites/generated/items/splatterhouse/shotgun.png`
- `public/sprites/generated/items/splatterhouse/two-by-four-plank.png`
- `public/sprites/generated/items/splatterhouse/meat-cleaver.png`

## Canon references

- Project lore definitions:
  `src/game/loreItemOverrides.js`, Splatterhouse item pack.
- Konami PC Engine mini digitized Splatterhouse manual:
  <https://dds.konami.com/games/manual/pcemini/en_Splatter.pdf>
- Konami PC Engine mini Splatterhouse presentation:
  <https://www.konami.com/games/pcemini/lineup/jp/en/>
- Konami product archive, including the Hellmask, cleaver and shotgun:
  <https://www.konami.com/games/jp/ja/products/dl_pspps3vita_splatterhouse_arch/>

The references were used for object identity, proportions, materials and the
retro horror palette. Every icon is an original OpenAI-generated bitmap rather
than a copied official sprite.

## Generation and processing

- Generator: OpenAI built-in ImageGen.
- Source style: detailed crisp 16-bit pixel art.
- Generation background: flat magenta chroma key.
- Background removal: local chroma-key removal with soft matte and despill.
- Final normalization: premultiplied-alpha resize to `512 x 512`.
- Final format: PNG, RGBA.
- Transparent pixels have zeroed hidden RGB values.

## Visual inspection

The four final PNGs were composited onto a checkerboard and inspected together.

- All objects are complete and centered.
- No character, hand, text, logo or watermark is present.
- No visible chroma-key fringe remains.
- The Terror Mask retains its cracked off-white surface, narrow eye openings,
  restrained red marks and aged straps.
- The shotgun is a worn wood-and-blued-steel pump action without modern
  attachments.
- The two-by-four is one rough, splintered construction plank.
- The meat cleaver keeps the warm golden cast documented by the manual while
  remaining a practical butcher cleaver.

## Automated validation

| File | Size | Mode | Alpha | Visible magenta | Hidden RGB |
| --- | --- | --- | --- | ---: | ---: |
| `terror-mask.png` | 512 x 512 | RGBA | 0-255 | 0 | 0 |
| `shotgun.png` | 512 x 512 | RGBA | 0-255 | 0 | 0 |
| `two-by-four-plank.png` | 512 x 512 | RGBA | 0-255 | 0 | 0 |
| `meat-cleaver.png` | 512 x 512 | RGBA | 0-255 | 0 | 0 |

All four corner alpha values are zero for every file. No manifest, prompt
registry, package file, source code or Git state was modified as part of this
reduced delivery.
