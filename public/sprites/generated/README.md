# Generated sprite sheets

The game automatically looks for OpenAI-generated animation sheets here.

Expected layout:

- `heroes/<universe-slug>/<hero-id-slug>.png`
- `bosses/<universe-slug>/<boss-name-slug>.png`

Sheet format:

- 4 columns x 4 rows
- 256x256 pixels per frame recommended for OpenAI outputs
- the renderer detects the real cell size from the image dimensions
- rows: `idle`, `run`, `attack`, `hit`
- transparent PNG preferred; flat `#00ff00` chroma-key source is accepted

If a sheet is missing, the canvas renderer keeps using the existing procedural pixel sprite.
