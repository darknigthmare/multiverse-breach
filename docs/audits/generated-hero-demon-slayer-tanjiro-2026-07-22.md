# Tanjiro Kamado - OpenAI sprite audit

Date: 2026-07-22

## Asset

- Runtime path: `/sprites/generated/heroes/demon-slayer/tanjiro-kamado.png`
- Sheet: 1024 x 1024 px, RGBA, 4 columns x 4 rows
- States: idle, run, Water Breathing / Hinokami Kagura attacks, damage and defeat

## Lore references

- Ufotable / Aniplex official character page: <https://demonslayer-anime.com/hta/character/>
- SEGA official character page: <https://asia.sega.com/kimetsu_hinokami/en/character/>

The references lock Tanjiro's burgundy hair, forehead scar, hanafuda earrings, Corps uniform, leg wraps, sandals, checkered haori, and black Nichirin katana. Water Breathing and Hinokami Kagura stay distinct and attached to their attack frames.

## Technical QA

- Generated with OpenAI ImageGen from both official references.
- Magenta chroma selected to preserve the green haori.
- Normalized with `--strict-cells`.
- 16 non-empty cells and a 12 px minimum internal margin.
- Transparent outer edges and no hidden RGB under alpha 0.
- Visual inspection confirms consistent costume, sword, anatomy, effects, and cell isolation.
