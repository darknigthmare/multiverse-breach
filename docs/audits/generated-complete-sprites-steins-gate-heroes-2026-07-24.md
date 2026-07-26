# Steins;Gate hero sprite completion - 2026-07-24

## Scope

Three missing hero sheets were generated with the built-in OpenAI ImageGen
workflow, chroma-keyed locally, normalized cell by cell and integrated at the
runtime paths expected by the sprite manifest:

| Runtime hero | Final asset |
| --- | --- |
| Rintaro Okabe | `public/sprites/generated/heroes/steins-gate/rintaro-okabe.png` |
| Kurisu Makise | `public/sprites/generated/heroes/steins-gate/kurisu-makise.png` |
| Itaru Hashida | `public/sprites/generated/heroes/steins-gate/itaru-hashida.png` |

## Canon references

- Official Steins;Gate RE:BOOT character registry:
  <https://steinsgate.jp/reboot/ja-jp/>
- Official Steins;Gate character page:
  <https://steinsgate.jp/darling/character.html>
- Official Steins;Gate 0 cast registry:
  <https://steinsgate0.jp/cast/>

The original-series silhouettes and clothing were used instead of the darker
Steins;Gate 0 variants:

- Okabe: tall build, messy black hair, open white laboratory coat, olive shirt,
  beige trousers and black flip phone.
- Kurisu: long auburn hair, white blouse, loose red tie, tan strapped jacket,
  black shorts, opaque tights and brown boots.
- Daru: heavyset build, olive cap, rectangular glasses, mustard shirt, dark
  olive jacket, blue jeans and compact laptop.

## Animation contract

Every final file follows the common runtime contract:

- `1024 x 1024` RGBA PNG;
- `4 x 4` cells of `256 x 256`;
- row 1: four distinct idle/support poses;
- row 2: four distinct movement poses;
- row 3: four distinct lore-compatible support/combat poses;
- row 4: four distinct hit/downed/recovery poses;
- full body contained in each cell with a minimum transparent guard of 12 px.

Kurisu's first generation was rejected because the first row cropped her lower
legs. The final generation was rebuilt with a strict full-body constraint.
Global connected-component extraction was then used for all three sheets so a
pose from the following row could not leak across a cell boundary.

## QA

| Asset | Occupied cells | Unique cell hashes | Minimum guard | Hidden RGB | Chroma residue |
| --- | ---: | ---: | ---: | ---: | ---: |
| Rintaro Okabe | 16 | 16 | 12 px | 0 | 0 |
| Kurisu Makise | 16 | 16 | 12 px | 0 | 0 |
| Itaru Hashida | 16 | 16 | 12 px | 0 | 0 |

The final three-sheet contact review confirmed:

- no adjacent-row parasite;
- no cropped character or prop;
- no text, logo, watermark or embedded UI;
- consistent identity, clothing and proportions across all 16 frames;
- no accidental second character.

## Generation path

- Image generation: built-in OpenAI ImageGen.
- Transparency: flat green or magenta chroma source plus
  `remove_chroma_key.py`, soft matte, despill and one-pixel edge contraction.
- Final normalization: connected-component assignment to the nearest of the 16
  character poses, proportional fit inside a `232 x 232` safe region and
  hidden-RGB cleanup.
