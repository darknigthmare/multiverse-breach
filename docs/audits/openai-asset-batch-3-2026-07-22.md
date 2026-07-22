# OpenAI lore asset batch 3 - 2026-07-22

## Delivered coverage

This batch adds 71 runtime image files and six new original procedural music
profiles. Every visual is an original OpenAI-generated project asset informed by
primary or official franchise references; no official asset file or protected
music recording is embedded.

| Category | New runtime files | Manifest gain |
| --- | ---: | ---: |
| Heroes | 12 | +12 |
| Enemies | 1 | +1 |
| Bosses | 8 | +8 |
| World bosses | 4 | +4 |
| Lore items | 16 | +16 |
| Finale kits | 2 | +2 |
| Stage packs | 28 files across 4 universes | +16 mode entries |
| **Total** | **71** | **+59 available entries** |

The generated manifest moves from 974 to 1,033 available entries:

```text
heroes   365 -> 377
enemies  130 -> 131
bosses   125 -> 137
items    218 -> 234
finales    0 -> 2
stages   136 -> 152
```

## Characters and threats

- Chainsaw Man: Denji, Power, Zombie Devil Horde, Katana Man.
- Cyberpunk: Edgerunners: David Martinez, Lucy, Maine Cyberpsychosis.
- Demon Slayer: Tanjiro, Nezuko, Akaza.
- Parasyte: Shinichi and Migi, Satomi Murano, Reiko Tamura.
- Predator / Predator 2: Anna, Billy, Mac, Harrigan.
- Bosses: Cyber-Godzilla, The Violator, Makaku, Trigon.
- World bosses: GLaDOS Central Core, Gigahorse, Mrs Tweedy with the Pie
  Machine, Boros.

## Stages

Four complete seven-file packs are registered for all supported modes:

- Spy x Family.
- War of the Worlds (2005).
- Ghostbusters.
- Tremors.

Each pack contains Combat, Melee, Melee backdrop, Melee platform atlas, RPG,
Tactics 8x6, and Tactics tile atlas assets.

## Items and finales

- H2G2: towel, electronic guide, Babel fish bowl, point-of-view gun.
- The Thing: blood-test dish, heated copper wire, flamethrower, whisky bottle.
- Starship Troopers: citizenship pamphlet, Mobile Infantry helmet, Morita rifle,
  tactical mini-nuke.
- Voyage de Chihiro: bath token, herbal dumpling, purple hair tie, train ticket.
- Finale kits: Exit 8 and Uzumaki.

## Music

New original procedural profiles: Spy x Family, War of the Worlds,
Ghostbusters, Tremors, Parasyte, and Uzumaki. Existing Cyberpunk: Edgerunners,
Chainsaw Man, and Demon Slayer profiles are now explicit regression cases. The
runtime remains `original-procedural-only` and embeds no canonical melody,
sample, lyric, score, or recording.

## Validation

- 71/71 image files pass dimension, color mode, alpha, and hidden-RGB checks.
- 25 animated sheets expose 16/16 occupied cells with at least 12 px guard.
- 16/16 item icons are 512x512 RGBA.
- 20/20 stage backdrops and 8/8 companion atlases match runtime dimensions.
- 27/27 targeted character, threat, boss, world-boss, and finale paths are
  `available: true` after manifest generation.
- 16/16 targeted item paths are `available: true`.
- Lint, progression, item, and procedural music audits pass.

## Next verified gaps

The global manifest still contains 4,067 unavailable entries. The next useful
wave should prioritize complete stage packs for Chainsaw Man, Cyberpunk:
Edgerunners, Demon Slayer, and Parasyte; regular enemies for those universes;
then the item-audit queue beginning with Heavy Metal 2000. Finale coverage is
2/55, so non-combat and set-piece finales remain the largest proportional gap.
