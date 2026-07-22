# Shinichi Izumi and Migi - OpenAI sprite audit

Date: 2026-07-22

## Asset

- Runtime path: `/sprites/generated/heroes/parasyte/shinichi-migi.png`
- Sheet: 1024 x 1024 px, RGBA, 4 columns x 4 rows
- States: idle/sensing, movement, Migi transformations, protection and defeat

## Lore references

- Shinichi official VAP page: <https://www.vap.co.jp/kiseiju/sp/chara/shinichi.html>
- Migi official VAP page: <https://www.vap.co.jp/kiseiju/sp/chara/migi.html>

The late-series school uniform and face are locked to Shinichi's official visual. Migi remains attached to the right hand and forearm in every frame; blade, parry, shield and spear states do not replace Shinichi's head or whole body.

## Technical QA

- Generated with OpenAI ImageGen from both official references.
- Magenta chroma removed with soft matte, despill and edge contraction.
- Normalized with `--strict-cells`.
- 16 non-empty cells, 12 px minimum internal margin.
- Transparent outer edges and no hidden RGB under alpha 0.
- Visual inspection confirms consistent uniform, anatomy, right-hand placement and isolated cells.
