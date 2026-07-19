# Generated Gears of War Boss Pack - 2026-07-19

## Scope

This batch adds exactly four OpenAI ImageGen boss sprite sheets:

| Boss | Output |
| --- | --- |
| Berserker Matriarch | `public/sprites/generated/bosses/gears-of-war/berserker-matriarch.png` |
| Karn, Locust General | `public/sprites/generated/bosses/gears-of-war/karn-locust-general.png` |
| Queen Myrrah | `public/sprites/generated/bosses/gears-of-war/queen-myrrah.png` |
| Corpser Burrower | `public/sprites/generated/bosses/gears-of-war/corpser-burrower.png` |

No manifest, prompt registry, source-code, package, or Git file was intentionally changed by this batch.

## Canonical visual research

- Matriarch: [P-o Levesque - Gears 5 Matriarch](https://olygraph.artstation.com/projects/3okNAo), a production character presentation credited to The Coalition's Gears 5 character team. The sheet preserves the original Berserker build, back quills, natural armor, blind Locust face, and exposed dorsal blister.
- Karn: [Mike Kime - Gears of War Judgment: Karn](https://pseudopod.artstation.com/projects/gVB5E), an Epic Games production model presentation. The sheet also follows the documented [Karn equipment and appearance](https://gearsofwar.fandom.com/wiki/Karn): twin Boltok pistols, pale Locust face, red eyes, spiked command armor, and the two long Judgment armor crests.
- Queen Myrrah: [Heber Alvarado - Gears of War Ultimate: Myrrah](https://heber.artstation.com/projects/Bwn36) and the Gears of War 3 battle-armor presentation associated with the original Epic character team. The sheet uses her pale human appearance, regal Locust armor, bronze/dark-silver plating, and muted red cloth. No unsupported handheld weapon was added.
- Corpser: the official [Gears Tactics boss breakdown](https://www.gearsofwar.com/en-us/news/dev-blog-bosses/) and the original-model collection [Gears of War Creatures](https://yemyam.artstation.com/projects/8EmrR). The sheet keeps the low spider-like silhouette, armored digging claws, pale flesh, orange eyes, head carapace, and adult multi-limb anatomy.

## Engine layout

- Canvas: `1024x1024`
- Format: PNG, RGBA
- Grid: 4 columns by 4 rows
- Frame: `256x256`
- Row 1: idle
- Row 2: run / locomotion
- Row 3: attack
- Row 4: hit / recovery
- View: consistent right-facing three-quarter side view
- Cell padding: at least 13 transparent pixels after per-frame normalization

The Matriarch uses charge, slam, and quill actions. Karn uses his two canonical Boltok pistols. Myrrah attacks through a commanding Hive-linked gesture instead of an invented weapon. The Corpser uses locomotion, claw slam, sweep, bite, and defensive leg-raise actions.

## Automated validation

| File | RGBA | Size | Occupied cells | Minimum cell margin | Visible chroma pixels | Hidden RGB under alpha 0 | Adjacent-frame difference min / avg |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `berserker-matriarch.png` | Yes | 1024x1024 | 16/16 | 13 px | 0 | 0 | 6.15 / 13.83 |
| `karn-locust-general.png` | Yes | 1024x1024 | 16/16 | 13 px | 0 | 0 | 11.58 / 13.39 |
| `queen-myrrah.png` | Yes | 1024x1024 | 16/16 | 13 px | 0 | 0 | 9.47 / 14.54 |
| `corpser-burrower.png` | Yes | 1024x1024 | 16/16 | 13 px | 0 | 0 | 8.24 / 13.17 |

All four sheets also passed:

- alpha range `0..255`;
- four fully transparent outer corners;
- all 64 expected cells occupied;
- no frame crossing a 256-pixel cell boundary;
- no visible magenta chroma-key residue;
- no text, label, number, logo, watermark, scenery, or extra character;
- visibly different frame progression within idle, run, attack, and hit rows.

## Visual inspection

Each final RGBA sheet was composited over a two-tone checkerboard and overlaid with exact 256-pixel grid boundaries. The inspection confirmed that bodies, clothing, weapons, quills, coat panels, claws, and attack effects remain inside their own frames without clipping or overlap.

Generation used the built-in OpenAI ImageGen path. Flat magenta generation backgrounds were removed locally, the sheets were resized to the engine canvas, and every frame was normalized independently before the final checkerboard and grid inspection.
