# Denji / Chainsaw Man - OpenAI sprite audit

Date: 2026-07-22

## Asset

- Runtime path: `/sprites/generated/heroes/chainsaw-man/denji-chainsaw.png`
- Sheet: 1024 x 1024 px, RGBA, 4 columns x 4 rows
- States: idle, run, attack, hit/death progression
- Direction: side-view, facing right

## Lore reference

The generated sheet uses the official *Chainsaw Man* TV character visual as the appearance anchor for Denji's hair, white shirt, black tie, dark trousers, and red trainers. The combat form keeps the canon chainsaw head and both forearm blades while remaining an original pixel-art interpretation.

Reference: <https://chainsawman.dog/tvseries/>

## Technical QA

- Green chroma removed with soft matte, despill, and edge contraction.
- Normalized with `--strict-cells` to isolate each 4 x 4 source cell before scaling.
- No neighboring animation frame is visible inside another cell.
- Transparent padding is retained around every pose for runtime cropping.
