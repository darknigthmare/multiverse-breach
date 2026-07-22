# Uzumaki finale asset audit - 2026-07-22

## Output

- `public/sprites/generated/finals/uzumaki/stagesetpiece.png`
- 1024 x 1024 RGBA, 4 columns x 4 rows, 16 environment cells
- OpenAI-generated original pixel art; chroma-key background removed locally

## Lore references

- Adult Swim, official *Uzumaki* series page: https://www.adultswim.com/videos/uzumaki
- VIZ, official *Uzumaki* deluxe edition page: https://www.viz.com/manga-books/manga/junji-ito/product/3382

The sequence follows the official Kurouzu-cho premise: a fogbound Japanese coastal town progressively consumed by spiral patterns. The cells move from recognizable streets and coastline through warped architecture, concentric paths, a spiral well, the buried spiral city, collapse, and the ruined coast.

## Runtime QA

- 16/16 cells contain visible scenery.
- All four outer corners are transparent.
- Fully transparent pixels have zeroed RGB channels.
- No labels, logos, watermarks, UI, copied manga panels, or cell-crossing elements.
- The second matte pass uses a one-pixel edge contraction to remove the chroma fringe.
