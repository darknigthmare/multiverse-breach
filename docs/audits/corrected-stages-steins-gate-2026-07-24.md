# Steins;Gate stage contract correction - 2026-07-24

## Finding

The existing Steins;Gate background set was visually coherent, but three files
still used the previous stage contract:

- `tactics.webp` was a perspective laboratory room without a countable combat
  grid and used `1672 x 941`;
- `tactics-tiles.webp` used `1448 x 1086` instead of the square transparent
  atlas contract;
- `melee-platforms.webp` used `1536 x 1024` and contained an obsolete strip
  layout.

The valid Combat, Melee, Melee backdrop and RPG scenes were preserved.

## Corrected assets

| Asset | Contract | Result |
| --- | --- | --- |
| `public/backgrounds/lore-stages/steins-gate/tactics.webp` | `1448 x 1086` RGB, high 3/4 camera, exact `8 x 6` board | PASS |
| `public/backgrounds/lore-stages/steins-gate/tactics-tiles.webp` | `1254 x 1254` RGBA, exact `4 x 2` atlas | PASS |
| `public/backgrounds/lore-stages/steins-gate/melee-platforms.webp` | `1254 x 1254` RGBA, exact `3 x 2` atlas | PASS |

## Canon references

- Official original Steins;Gate overview and Future Gadget Laboratory context:
  <https://steinsgate.jp/sgflash.html>
- Official Steins;Gate character and setting registry:
  <https://steinsgate.jp/reboot/ja-jp/>
- Official Rounder context:
  <https://steinsgate.jp/phenogram/story/kiryu.html>

The replacement Tactics board stays grounded in the 2010 Akihabara laboratory:
worn brown flooring, CRT stacks, mixed student-lab furniture, visible component
shelves, the modified domestic appliance and warm practical lights. It does not
introduce a spaceship, military laboratory or generic cyberpunk decor.

## Gameplay review

- all 48 Tactics cells remain countable and unobstructed;
- the camera is high three-quarter, not top-down;
- unit scale and depth remain coherent from the front row to the back row;
- the Melee atlas exposes six independent pieces with flat collision tops;
- the Tactics atlas exposes three walkable floor variants, one objective tile
  and four pieces of cover/transition geometry;
- no character, UI, text, logo or watermark is baked into any replacement.

## Image QA

- OpenAI ImageGen was used separately for all three replacements;
- atlas transparency was produced from flat magenta chroma with soft matte,
  despill and one-pixel edge contraction;
- hidden RGB under fully transparent pixels: `0`;
- residual magenta key pixels: `0`;
- final visual contact-sheet review: PASS.
