# Chainsaw Man enemy asset audit - 2026-07-22

## Output

- `public/sprites/generated/bosses/chainsaw-man/zombie-devil-horde.png`
- 1024 x 1024 RGBA, 4 columns x 4 rows, 16 animation cells
- OpenAI-generated original pixel art, with local chroma removal and cell-group normalization

## Lore reference

- Official *Chainsaw Man* anime site: https://chainsawman.dog/tvseries/

The enemy is represented as a persistent three-zombie cluster in contemporary street clothing. It intentionally avoids named characters, hero equipment, chainsaws, and explicit gore while preserving the Zombie Devil horde identity.

## Animation rows

1. Four idle/shamble poses.
2. Four locomotion poses.
3. Four coordinated grasp, swarm, pile, and rush attacks.
4. Four recoil, stagger, collapse, and defeat poses.

## Runtime QA

- 16/16 occupied cells.
- Minimum transparent guard: 12 px in every cell.
- All four sheet corners transparent.
- No green chroma fringe detected.
- Fully transparent pixels have zeroed RGB channels.
- The three-zombie group is preserved as one runtime entity in every frame.
