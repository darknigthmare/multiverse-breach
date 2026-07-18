# OpenAI Stage Pack Audit - Steins;Gate

Date: 2026-07-18

Scope: stage assets under
`public/backgrounds/lore-stages/steins-gate/`.

## Canon references

- https://steinsgate.jp/
- https://steinsgate.tv/

The pack keeps the locations separated by gameplay use:

- Combat: Radio Kaikan rooftop with concrete, antennas and damaged satellite
  equipment.
- Melee: Akihabara electronics rooftops and service alleys.
- RPG: Future Gadget Lab interior, worn wood floor, improvised electronics and
  CRT equipment.
- Tactics: Future Gadget Lab and apartment raid route, viewed from an elevated
  three-quarter camera.

No characters, logos, readable signs or UI were included.

## Files

| File | Size | Mode | Use |
| --- | ---: | --- | --- |
| `combat.webp` | 1672 x 941 | RGB | Continuous duel floor |
| `melee.webp` | 1672 x 941 | RGB | Side-view arena |
| `melee-backdrop.webp` | 1672 x 941 | RGB | Akihabara parallax backdrop |
| `melee-platforms.webp` | 1536 x 1024 | RGBA | Isolated rooftop platforms |
| `rpg.webp` | 1672 x 941 | RGB | Future Gadget Lab battle lane |
| `tactics.webp` | 1672 x 941 | RGB | Elevated exact 8 x 6 battlefield |
| `tactics-tiles.webp` | 1448 x 1086 | RGBA | Lab floors, cover and electronics |

## Validation

- Exactly seven WebP files.
- Tactics grid has nine vertical boundaries and seven horizontal boundaries,
  giving exactly 8 x 6 cells.
- Tactics camera is elevated three-quarter perspective, not top-down or diamond
  isometric.
- Both atlases decode as RGBA with alpha spanning 0 to 255.
- RGB is zero under every fully transparent atlas pixel.
- Visual inspection found no chroma residue, connected atlas objects, character,
  text, logo or UI contamination.
