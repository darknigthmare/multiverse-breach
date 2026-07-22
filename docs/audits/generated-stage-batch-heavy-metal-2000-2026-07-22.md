# Heavy Metal 2000 Stage Asset Audit - 2026-07-22

## Scope

Generated one original, lore-informed pixel-art stage pack for `Heavy Metal 2000` with the built-in OpenAI image generator. Each distinct deliverable used its own generation call. Official material was used only as visual research; no frame, screenshot, logo, character, or production asset was copied into the output.

The requested direction deliberately combines two separate story anchors into one coherent game-stage family:

- the industrial devastation left on Eden after Tyler's attack;
- the desert/citadel approach associated with Odin and Uroboris, reinterpreted as a heavy mining-fortress perimeter.

## Visual References

Primary and contemporary references reviewed before generation:

- Sony Pictures official film page and synopsis: https://www.sonypictures.com/movies/heavymetal2000
- Sony Pictures official banner image: https://www.sonypictures.com/sites/default/files/styles/max_360x390/public/banner-images/2022-03/heavymetal2000_banner_2572x1100_copyright.jpg?h=abc6acbe&itok=QcmlKNFr
- Rotten Tomatoes film page with official clips: https://www.rottentomatoes.com/m/heavy_metal_2000
- Application Systems Heidelberg licensed `Heavy Metal: F.A.K.K. 2` screenshot gallery: https://www.application-systems.de/fakk2/screenshots.php
- GameSpot's contemporary 2000 preview and screenshot context: https://www.gamespot.com/articles/heavy-metal-fakk-2-impressions/1100-2610649/

Reference takeaways used in the original fan-made designs: scorched alien terrain, dense industrial-fantasy machinery, black iron and oxidized copper, volcanic orange light, violet/red skies, monumental citadel architecture, ribbed pipes, chains, ore lifts, and highly readable action-game traversal space.

## Prompt Set

All prompts requested highly detailed handcrafted 16-bit/32-bit pixel art, a cohesive charcoal/copper/plum/cyan palette, original fan-made architecture, and no characters, text, logo, HUD, watermark, or copied official asset.

- `combat.webp`: strict side-view mining-fortress approach with a continuous flat lower combat plane and an open center.
- `melee.webp`: strict side-view platform-brawler base with an unobstructed full-width floor and open space for composited platforms.
- `melee-backdrop.webp`: deep panoramic Eden/Uroboris canyon and distant citadel, without a close playable floor.
- `melee-platforms.webp`: exactly eight isolated side-view iron, basalt, copper-pipe, conveyor, grate, and fortress platforms on a removable flat chroma key.
- `rpg.webp`: three-quarter side battle angle at the fortress gate with a broad clear lower battlefield.
- `tactics.webp`: complete three-quarter tactical deck with exactly 8 columns by 6 rows and forty-eight unobstructed walkable cells.
- `tactics-tiles.webp`: exactly sixteen isolated matching isometric floor, cover, hazard, node, objective, and machinery tiles on a removable flat chroma key.

## Deliverables

| File | Dimensions | Mode | Gameplay QA |
| --- | ---: | --- | --- |
| `combat.webp` | 1672x941 | RGB | Side-view; continuous floor; central duel space clear |
| `melee.webp` | 1672x941 | RGB | Side-view; full-width base floor; platform layer remains independent |
| `melee-backdrop.webp` | 1672x941 | RGB | Deep backdrop only; no close playable obstruction |
| `melee-platforms.webp` | 1254x1254 | RGBA | Eight isolated horizontal platform groups; all sheet edges transparent |
| `rpg.webp` | 1672x941 | RGB | Three-quarter side angle; lower battlefield clear |
| `tactics.webp` | 1448x1086 | RGB | Three-quarter tactical view; visually counted 8x6 grid; no blocked cells |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Sixteen isolated 4x4 tile groups; consistent perspective and scale |

## Technical Validation

- Exact output count in the assigned directory: `7` files.
- All five opaque backgrounds decode as `RGB` WebP at their required dimensions.
- Both element sheets decode as `RGBA` WebP at `1254x1254`.
- `melee-platforms.webp`: `1,058,544` fully transparent pixels, `16,565` partial edge pixels, `0` non-transparent outer-edge pixels, and all eight 2x4 regions occupied.
- `tactics-tiles.webp`: `1,003,893` fully transparent pixels, `15,374` partial edge pixels, `0` non-transparent outer-edge pixels, and all sixteen 4x4 regions occupied.
- Chroma-fringe scan: `0` strong green fringe candidates on either RGBA sheet.
- Visual inspection confirmed no characters, text, logo, HUD, watermark, crop, overlap, accidental top-down tactics view, or unusable traversal geometry.
- Intermediate chroma-key PNG files were removed after lossless WebP conversion.

## Result

PASS. The seven assets form one coherent Heavy Metal 2000-inspired stage family while preserving the distinct camera and readability requirements of combat, melee, RPG, and tactics gameplay.
