# Stage Music Runtime Batch - 2026-07-19

## Scope

This pass validates the active procedural music runtime instead of duplicating
the older static lore-gap catalogue.

- Every generated plan is original and procedural. No canonical melody,
  recording, sample, lyric, or protected score data is embedded.
- Gears of War and Daft Punk keep their detailed profiles.
- All modern Predator labels resolve to the Predator hunting profile.
- Splatterhouse, Streets of Rage, Toy Soldiers, Stargate, and Zombies Ate My
  Neighbors now have dedicated profiles.
- Hidden DLC arenas resolve to the Nexus profile, preventing disabled franchise
  music language from leaking into the OC base game.
- RPG, Tactics, Smash, Fighter, FPS, and Race mode modifiers are checked.
- Grid, battle, boss, race, last-lap, and victory states are checked.
- Fusion stages are checked for a deterministic two-universe blend.
- All 293 lore profiles and their four gameplay views are checked for a
  deterministic, non-empty, original procedural plan with a unique runtime key.

## Dedicated directions

| Universe | Runtime profile | Original direction |
| --- | --- | --- |
| Gears of War | `mus-gears-of-war` | Low synthetic brass, military percussion, squad pressure |
| Predator variants | `mus-predator` | Tuned tom hunt pulse, dry brass, thermal clicks |
| Daft Punk | `mus-daft-punk` | Original filtered electronic pulse and synthetic stage build |
| Splatterhouse | `mus-splatterhouse` | Detuned organ, prepared piano, chain noise, arcade horror toms |
| Streets of Rage | `mus-streets-of-rage` | Original FM-style bass, pulse lead, urban brawler rhythm |
| Toy Soldiers | `mus-toy-soldiers` | Miniature brass, tin drums, toy piano, clockwork rhythm |
| Stargate | `mus-stargate` | Original frame-drum pulse, low synthetic brass, gate-metal resonance |
| Zombies Ate My Neighbors | `mus-zombies-ate-my-neighbors` | Original cartoon organ, chip bass, theremin-style pulse and B-movie stabs |

## Reproduction

Run:

```powershell
cmd /c npm run music:audit
```

The command fails on missing profiles, empty sequences, invalid tempo,
non-original source policy, undifferentiated states/modes, fusion loss, or
hidden-DLC leakage.

Validated result:

| Metric | Result |
| --- | ---: |
| Lore profiles | 293 |
| Gameplay views | 1,172 |
| Unique deterministic runtime keys | 1,172 |
| Dedicated-profile views | 144 |
| Fusion-profile views | 56 |
| Family fallback views | 972 |
