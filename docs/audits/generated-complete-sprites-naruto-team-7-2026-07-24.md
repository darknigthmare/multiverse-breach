# Young Team 7 sprite completion - 2026-07-24

## Scope

The three playable members of the original-series Team 7 now have production
OpenAI sprite sheets:

- `public/sprites/generated/heroes/naruto/naruto-uzumaki-young.png`
- `public/sprites/generated/heroes/naruto/sasuke-uchiha-young.png`
- `public/sprites/generated/heroes/naruto/sakura-haruno-young.png`

The `4 x 4` sheet provides:

| Row | Animation |
| --- | --- |
| 1 | four-frame idle cycle |
| 2 | four-frame ninja run cycle |
| 3 | four lore-specific combat frames for each character |
| 4 | light hit, heavy stagger, kneel and prone defeat |

## Canon references

- Official original-series overview and key visual:
  <https://naruto-official.com/en/anime/naruto1>
- Official Naruto character retrospective:
  <https://naruto-official.com/en/news/01_1610>
- Official young Naruto game reference:
  <https://naruto-official.com/en/news/01_2186>
- Official young Sasuke retrospective:
  <https://naruto-official.com/en/news/01_1856?nolangsuggestion=1>
- Official young Sakura visual reference:
  <https://naruto-official.com/en/news/01_2225>

All three sheets stay before the Shippuden time skip:

- Naruto uses young proportions, his original orange and navy jumpsuit, kunai
  and compact Rasengan;
- Sasuke uses the original high-collar navy shirt, white shorts, Uchiha crest,
  shuriken, Great Fireball and early Chidori;
- Sakura uses the original red qipao tunic, dark shorts, kunai, shuriken and
  tagged kunai without later medical or super-strength techniques.

## QA

- `1024 x 1024` RGBA PNG;
- each sheet contains 16 occupied cells and 16 unique frame hashes;
- minimum 12 px transparent guard in every `256 x 256` cell;
- no frame crosses into another cell;
- hidden RGB under fully transparent pixels: 0;
- visible chroma residue: 0;
- no labels, embedded UI, scenery or watermark in any sheet.

## Generation path

- Image generation: built-in OpenAI ImageGen, one call per character.
- Transparency: flat green chroma source, `remove_chroma_key.py`, soft matte and
  despill.
- Frame recovery: the 16 global character components were assigned to the
  nearest logical grid cell, scaled proportionally into a 232 px safe region
  and bottom-aligned consistently.
