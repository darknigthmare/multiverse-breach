# Naruto hostile sprite completion - 2026-07-24

## Scope

Three original-series hostile slots received production OpenAI sprite sheets:

| Runtime role | Lore anchor | Final asset |
| --- | --- | --- |
| Enemy | Sound Ninja Genin, represented by Dosu Kinuta | `public/sprites/generated/bosses/naruto/sound-ninja-genin.png` |
| Boss | Young Gaara during the Shukaku awakening | `public/sprites/generated/bosses/naruto/gaara-shukaku.png` |
| Finale boss | Orochimaru during the Konoha Crush | `public/sprites/generated/bosses/naruto/orochimaru-konoha-crush.png` |

Each sheet supplies four idle, four movement, four lore-specific attack and four
damage/defeat frames.

## Canon references

- Official original-series Naruto registry:
  <https://naruto-official.com/en/anime/naruto1>
- Official Gaara and Shukaku retrospective:
  <https://naruto-official.com/en/news/01_1688>
- Official young Gaara combat reference:
  <https://naruto-official.com/en/news/01_1695>
- Official Orochimaru and Konoha Crush retrospective:
  <https://naruto-official.com/en/news/01_1629>
- Dosu appearance and Melody Arm cross-check:
  <https://naruto.fandom.com/wiki/Dosu_Kinuta>

The hostile identities remain tied to the original pack:

- Dosu keeps the bandaged face, hunched stance and oversized Melody Arm;
- Gaara keeps his young costume and gourd, with Shukaku limited to a partial
  sand-arm awakening instead of a later form;
- Orochimaru keeps the Konoha Crush tunic, purple rope belt, Kusanagi, snake
  techniques and early-series appearance.

## QA

All three final assets pass the sprite-sheet contract:

- `1024 x 1024` RGBA PNG;
- 16 occupied cells and 16 unique hashes per sheet;
- minimum 12 px transparent guard in every `256 x 256` frame;
- hidden RGB under fully transparent pixels: 0;
- visible chroma residue: 0;
- no frame leakage, captions, embedded UI, scenery or watermark.

## Generation path

- Image generation: built-in OpenAI ImageGen, one call per entity.
- Transparency: flat green chroma source, `remove_chroma_key.py`, soft matte and
  despill.
- Frame recovery: globally detected entity and effect components were assigned
  to their logical cell, isolated from adjacent frames and fitted into a 232 px
  safe region.
