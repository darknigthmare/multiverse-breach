# Naruto item icon completion - 2026-07-24

## Scope

Four OpenAI-generated item icons were added to the original-series Naruto
runtime pack:

| Item | Final asset |
| --- | --- |
| Konoha Forehead Protector | `public/sprites/generated/items/naruto/konoha-forehead-protector.png` |
| Shinobi Kunai | `public/sprites/generated/items/naruto/shinobi-kunai.png` |
| Scroll of Seals | `public/sprites/generated/items/naruto/scroll-of-seals.png` |
| Kakashi Bell Test Bells | `public/sprites/generated/items/naruto/kakashi-bell-test-bells.png` |

## Canon references

- Official Naruto episode 1, including the ancient Scroll of Seals:
  <https://naruto-official.com/en/anime/naruto1/list/01_225>
- Official Naruto episode 4, introducing Kakashi's survival test:
  <https://naruto-official.com/en/anime/naruto1/list/01_228>
- Official Kakashi retrospective, including the original Team 7 bell test:
  <https://naruto-official.com/en/news/01_1903>

The pack deliberately remains in the pre-Shippuden Naruto continuity:

- the forehead protector uses the original dark navy cloth and Konoha plate;
- the kunai is the plain standard shinobi tool, not a fantasy dagger;
- the sealed scroll is the oversized forbidden-technique scroll from episode 1;
- the event item contains exactly the two bells used in Team 7's test.

## QA

All four final assets pass the item-icon contract:

- `512 x 512` RGBA PNG;
- one complete pickup concept per file;
- minimum transparent guard: 36 px;
- hidden RGB under fully transparent pixels: 0;
- visible chroma residue: 0;
- no character, embedded UI, frame, caption or watermark.

## Generation path

- Image generation: built-in OpenAI ImageGen, one call per final item.
- Transparency: flat green chroma source, `remove_chroma_key.py`, soft matte and
  despill.
- Final fit: proportional resize inside a `440 x 440` safe region, centered on
  the `512 x 512` canvas.
