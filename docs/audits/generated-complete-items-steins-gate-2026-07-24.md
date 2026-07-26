# Steins;Gate item icon completion - 2026-07-24

## Scope

Four OpenAI-generated item icons were added for the Steins;Gate runtime pack:

| Item | Final asset |
| --- | --- |
| PhoneWave (name subject to change) | `public/sprites/generated/items/steins-gate/phonewave-name-subject-to-change.png` |
| IBN 5100 | `public/sprites/generated/items/steins-gate/ibn-5100.png` |
| Divergence Meter | `public/sprites/generated/items/steins-gate/divergence-meter.png` |
| Metal Upa | `public/sprites/generated/items/steins-gate/metal-upa.png` |

## Canon references

- Official original-game overview, D-Mail, PhoneWave and IBN 5100:
  <https://steinsgate.jp/sgflash.html>
- Official fifth-anniversary Divergence Meter product page:
  <https://steinsgate.jp/5th/result.html>
- Official Steins;Gate RE:BOOT story and character registry:
  <https://steinsgate.jp/reboot/ja-jp/>

The icons retain the source identities:

- the PhoneWave remains a visibly improvised domestic microwave and phone
  apparatus, not a polished portal;
- the IBN 5100 is one self-contained cream portable terminal with CRT,
  integrated keyboard and cassette unit;
- the Divergence Meter has exactly eight exposed Nixie tubes on an improvised
  electronics base;
- the Metal Upa is a single rare silver capsule-toy figure, not a living
  creature or combat robot.

The first Divergence Meter draft was rejected because it contained nine tubes.
The final icon was regenerated and visually counted at exactly eight.

## QA

All four final assets pass the item-icon contract:

- `512 x 512` RGBA PNG;
- one complete item only;
- minimum transparent guard: 36 px;
- hidden RGB under fully transparent pixels: 0;
- opaque chroma residue: 0;
- no character, embedded UI, label, logo or watermark.

## Generation path

- Image generation: built-in OpenAI ImageGen, one call per final item.
- Transparency: flat green chroma source, `remove_chroma_key.py`, soft matte,
  despill and one-pixel edge contraction.
- Final fit: proportional resize inside a `440 x 440` safe region, centered on
  the `512 x 512` canvas.
