# Prometheus - OpenAI stage pack audit

Date: 2026-07-17

## Scope

Complete OpenAI ImageGen stage pack for the `Prometheus` profile in
`src/game/stageLoreProfiles.js`.

Canonical anchor:

- LV-223
- Pyramid Dome
- Ampule Room
- giant Engineer head chamber

The pack uses original fan-made compositions. No official bitmap, texture, set
photograph, logo, or production artwork was copied into the deliverables.

## References consulted

- [Walt Disney Archives - Prometheus 10th Anniversary](https://d23.com/prometheus-10th-anniversary-celebration/)
  - official wide Ampoule Room concept art by Steve Messing
  - official Pyramid Dome concept art by Steve Messing
- [CBS News - Designing Prometheus](https://www.cbsnews.com/pictures/designing-prometheus/)
  - 20th Century Fox views of the Pyramid compound and giant-head chamber
- [MPC - Creating an alien universe](https://www.mpcvfx.com/en/filmography/prometheus-ridley-scott/)
  - barren LV-223 valley, hostile terrain, dome placement, and landscape scale
- [Rob Sollis Ceramics - Ampules design and development](https://www.robsollisceramics.co.uk/ampules-design-development)
  - steatite/Raku ampule proportions, rows, material, and practical-set role

## Visual rules

- Premium detailed 32-bit pixel art.
- Charcoal basalt, dark steatite, blue-grey mist, and restrained pale-cyan light.
- Ancient Engineer mineral/biomechanical ribs rather than human ship machinery.
- No Dead Space styling, industrial crates, yellow hazard stripes, bright neon,
  human colony structures, xenomorph eggs, or generic fantasy architecture.
- No character, creature, corpse, vehicle, weapon, text, logo, watermark, HUD,
  or baked UI.

## Deliverables

| File | Size | Alpha | Gameplay composition |
| --- | ---: | --- | --- |
| `combat.webp` | 1920x1080 | No | Strict lateral 16:9 view, continuous flat floor, central duel lane kept clear, giant head and ampules behind the fighters. |
| `melee.webp` | 1920x1080 | No | Clean LV-223 Pyramid Dome backdrop. Intentionally matches the dedicated backdrop so no collision platform is baked into either fallback. |
| `melee-backdrop.webp` | 1920x1080 | No | Strict lateral storm panorama, dome in the middle distance, no gameplay platform, ledge, rail, or bridge. |
| `melee-platforms.webp` | 1024x1024 | Yes | Transparent 4x4 atlas with 16 strict-side-view platform, ramp, support, hazard, bridge, and spawn-plinth pieces. |
| `rpg.webp` | 1920x1080 | No | Side-view 2.5D Ampule Room, broad foreground party lane, low foreground lip, layered depth. |
| `tactics.webp` | 1920x1080 | No | Elevated three-quarter battlefield with an 8-column by 6-row rectangular board; lower rows are visually in front; never top-down or diamond-isometric. |
| `tactics-tiles.webp` | 1024x1024 | Yes | Transparent 4x4 atlas with 16 rectangular floor, cover, height, hazard, anchor, objective, and spawn pieces in matching three-quarter perspective. |

## ImageGen prompt matrix

### Combat

Original Prometheus-inspired Engineer head chamber in detailed 32-bit pixel
art; strict lateral 16:9 camera; one continuous flat duel floor across the
lower frame; open central lane; ampules and monumental head behind gameplay;
no characters, readable glyphs, UI, gaps, stairs, or Dead Space styling.

### Melee backdrop

Original LV-223 basalt valley and mound-like Pyramid Dome under an electrical
storm; strict lateral platform-game camera; atmospheric ground only; no baked
platform, ramp, rail, bridge, collision silhouette, character, ship, or rover.

### RPG

Original Ampule Room and giant-head sanctuary in detailed 32-bit pixel art;
side-view 2.5D camera; broad trapezoidal lane for parties; ampules behind the
playable floor; low foreground; no grid, platform, UI, or character.

### Tactics

Original Engineer chamber battlefield; elevated three-quarter camera; one
bounded rectangular board with exactly 8 columns and 6 rows; readable outer
cover and open central lanes; lower rows in front of upper rows; never
top-down, diamond-isometric, hexagonal, or chessboard-styled.

### Melee platform atlas

Exact 4x4 atlas on a flat chroma background; 16 isolated strict-side-view
Engineer pieces with pixel-aligned horizontal collision tops: four platform
lengths, two caps, cracked and ribbed variants, two ramps, two supports, an
ampule ledge, black-liquid basin, broken bridge, and spawn plinth.

### Tactics tile atlas

Exact 4x4 atlas on a flat chroma background; 16 isolated three-quarter
rectangular-grid pieces: four floor variants, four half-cover variants, two
full-cover forms, two height tiles, black-liquid hazard, pale anchor, objective
plinth, and spawn aperture.

## Inspection and corrections

- Every generated background was visually inspected after conversion.
- Both atlas sources received a targeted OpenAI ImageGen correction pass that
  changed only the matte to a uniform chroma color and removed generated
  shadows or colored panels from empty cells.
- Chroma removal used border auto-sampling, soft matte, despill, and a
  one-pixel edge contraction.
- Both final atlases were composited over a neutral checkerboard for visual QA.
- `melee-platforms.webp`: 826,505 fully transparent pixels, transparent
  corners, zero detected green-dominant residual pixel.
- `tactics-tiles.webp`: 699,810 fully transparent pixels, transparent corners,
  zero detected green-dominant residual pixel.
- All seven files decode successfully as WebP.
- No source code, JSON, prompt manifest, sprite manifest, commit, push, or
  deployment was changed as part of this pack.
