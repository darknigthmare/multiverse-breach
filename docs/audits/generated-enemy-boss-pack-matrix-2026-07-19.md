# The Matrix enemy and boss OpenAI pack - 2026-07-19

## Scope

This batch adds six previously missing OpenAI sprite sheets without replacing
the existing Matrix alternates:

| Kind | Output |
| --- | --- |
| Enemy | `public/sprites/generated/bosses/the-matrix/machine-sentinel-swarm.png` |
| Enemy | `public/sprites/generated/bosses/the-matrix/merovingian-twin-ghost.png` |
| Enemy | `public/sprites/generated/bosses/the-matrix/twin-exile-ghost.png` |
| Enemy | `public/sprites/generated/bosses/the-matrix/agent-possessed-host.png` |
| Enemy | `public/sprites/generated/bosses/the-matrix/agent-upgrade-program.png` |
| World boss | `public/sprites/generated/bosses/the-matrix/deus-ex-machina-source-core.png` |

The existing `sentinel-squid-drone.png`, `twin-ghost-exile.png`, and
`deus-ex-machina-core.png` files were preserved.

## Visual references

- The user-provided Sentinel production render was used directly for the
  gunmetal shell, red sensor cluster, articulated claw tentacles, and stable
  small-swarm silhouette.
- The user-provided Twins production image was used directly for the albino
  complexion, white dreadlocks, narrow sunglasses, pearly-white coats, suits,
  and blade-based combat.
- Agent costume and sequel context were checked against the official
  [Warner Bros. Matrix Reloaded page](https://www.warnerbros.it/scheda-film/genere-fantascienza/matrix-reloaded/)
  and the production credits and imagery listed by the
  [Festival de Cannes](https://www.festival-cannes.com/en/f/the-matrix-reloaded/).
- The Machine City and machine-god design were checked against the VFX account
  in [Computer Graphics World](https://www.cgw.com/Publications/CGW/2003/Volume-26-Issue-12-December-2003-/The-Matrix-Resolution.aspx)
  and production designer George Hull's
  [Matrix Revolutions portfolio](https://www.ghull.com/matrix-revolutions/).

All outputs are original fan-made pixel art generated with OpenAI ImageGen.
No official production asset was copied into the repository.

## Lore and animation decisions

- `Machine Sentinel Swarm`: exactly two complete Sentinels remain visible in
  every cell. The rows cover hover, synchronized flight, tentacle strike, and
  damaged formation.
- `Merovingian Twin Ghost`: exactly one Twin per cell, right-hand blade
  emphasis, then an icy-white spectral phase.
- `Twin Exile Ghost`: exactly one Twin per cell, alternate blade stance and
  distinct dreadlock fall, then an icy-white spectral phase.
- `Agent Possessed Host`: one black-suited Agent body whose hit frames briefly
  reveal the overwritten host through green code instability.
- `Agent Upgrade Program`: a Reloaded-style upgraded Agent with rigid idle,
  superhuman sprint, heavy melee and pistol attacks, and code destabilization.
- `Deus Ex Machina Source Core`: the baby-like face formed by a swarm of
  insect machines over a spined hemispherical Machine City mass. It is not a
  generic reactor, metal mask, humanoid robot, or Sentinel.

Every sheet uses the manifest animation order:

1. `idle`
2. `run`
3. `attack`
4. `hit`

## Image processing

- OpenAI ImageGen source sheets were generated on flat removable chroma.
- Green was used for the mechanical swarm, blue for the white spectral Twins,
  and magenta for the Agents and Deus Ex Machina.
- The installed `remove_chroma_key.py` helper was run with soft matte,
  despill, and one-pixel edge contraction.
- Each source was normalized to `1024x1024` RGBA.
- Each logical cell is `256x256` with a final internal safety margin of at
  least 12 pixels.
- A final component pass reattached a detached Agent foot to its own attack
  frame instead of leaving it in the preceding cell.
- Fully transparent pixels have zeroed RGB channels.

## Validation

| Output | Size | Mode | Non-empty cells | Minimum margin | Key fringe |
| --- | --- | --- | ---: | ---: | ---: |
| `machine-sentinel-swarm.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |
| `merovingian-twin-ghost.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |
| `twin-exile-ghost.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |
| `agent-possessed-host.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |
| `agent-upgrade-program.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |
| `deus-ex-machina-source-core.png` | 1024x1024 | RGBA | 16 | 12 px | 0 |

Visual review additionally confirmed:

- one character only in every Twin and Agent cell;
- two recognizable Sentinels in every swarm cell;
- no visible grid, labels, HUD, scenery, watermark, or mixed entity;
- no sprite or attack effect crosses a logical cell boundary;
- no generic-core substitution for Deus Ex Machina.

## SHA-256

```text
machine-sentinel-swarm.png        2F3741BD0BDE9DFF24110303D439CFA18FAB4CEB667A11B1679960FE1458F47C
merovingian-twin-ghost.png        ED078DF72371126A5EA9705A8C298B922F7176670FDB27120C9E744E799D1A39
twin-exile-ghost.png              8011C2A8DB3BA8D09D825A19E512100EFB3B430BEA4C3E08114980C9A15C63F5
agent-possessed-host.png          29BD1C83094B8C31A97B2F8FE5EFB570D9E90DAA3E51E8AA785A617DCC73C48A
agent-upgrade-program.png         7CE4AD0989FCB0685483839C80E61D286EACF230E5E9001DDC66C5A30883893B
deus-ex-machina-source-core.png   FD23B789C3D54BB47CBB960E6BD3A133B13FDF0B7FAC8CF3065A62C50FED0E10
```

The sprite manifest, project code, package files, and Git state were not
modified by this Matrix-only batch. The manifest entries remain pending until
the main asset-regeneration workflow is run separately.
