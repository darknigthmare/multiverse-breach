# David Martinez - OpenAI sprite audit

Date: 2026-07-22

## Asset

- Runtime path: `/sprites/generated/heroes/cyberpunk-edgerunners/david-martinez.png`
- Sheet: 1024 x 1024 px, RGBA, 4 columns x 4 rows
- States: idle, Sandevistan run, lore attacks, damage and defeat

## Lore reference

The official CD PROJEKT RED character visual locks David's black undercut, turquoise shaved pattern, facial cyberware, cross necklace, yellow jacket with cyan and white panels, dark shirt, blue-grey trousers, and trainers.

Reference: <https://www.cyberpunk.net/en/edgerunners>

The sheet represents mid-series David. It deliberately avoids the final over-chromed body and uses a compact pistol, cyberware-assisted punch, and Sandevistan movement as his combat vocabulary.

## Technical QA

- Generated with OpenAI ImageGen from the official visual reference.
- Green chroma removed with soft matte, despill, and edge contraction.
- Normalized through `--strict-cells`.
- 16 non-empty cells, 12 px minimum internal margin.
- Transparent sheet edges and no hidden RGB under alpha 0.
- Visual inspection confirms stable costume, scale, anatomy, and cell isolation.
