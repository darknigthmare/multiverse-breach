# OpenAI Stage Pack Audit - Frieren: Beyond Journey's End

Date: 2026-07-18

Scope: stage assets under
`public/backgrounds/lore-stages/frieren-beyond-journeys-end/`.

## Canon reference

- https://frieren-anime.jp/

The visual set uses quiet northern landscapes, old stone architecture, the
first-class mage exam ruins and gold-transmuted masonry as its main anchors.
The images remain original project art and do not copy official assets.

Gameplay composition:

- Combat: open Northern Plateau ruin with a stable continuous lane.
- Melee: enclosed mage-exam ruin with separate stone platform modules.
- RPG: bright journey road and ruined chapel overlooking a distant settlement.
- Tactics: gold-transmuted ruin in elevated three-quarter view.

No characters, creatures, readable text, logos or UI were included.

## Files

| File | Size | Mode | Use |
| --- | ---: | --- | --- |
| `combat.webp` | 1672 x 941 | RGB | Northern Plateau duel lane |
| `melee.webp` | 1672 x 941 | RGB | Mage-exam ruin arena |
| `melee-backdrop.webp` | 1672 x 941 | RGB | Matching ruin backdrop |
| `melee-platforms.webp` | 1254 x 1254 | RGBA | Six isolated stone platforms |
| `rpg.webp` | 1672 x 941 | RGB | Journey-road battle scene |
| `tactics.webp` | 1536 x 1024 | RGB | Elevated exact 8 x 6 battlefield |
| `tactics-tiles.webp` | 1254 x 1254 | RGBA | Eight isolated ruin tiles and props |

## Validation

- Exactly seven WebP files.
- Tactics terrain contains exactly 8 x 6 rectangular cells in elevated
  three-quarter perspective.
- Both atlases decode as RGBA with alpha spanning 0 to 255.
- Chroma enclosed by arches and bridge supports was removed.
- RGB is zero under every fully transparent atlas pixel.
- Dark foliage and purple flowers belonging to the ruin tiles were preserved.
- Visual inspection found no visible chroma residue, connected atlas objects,
  character, text, logo or UI contamination.
