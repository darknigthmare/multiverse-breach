# Stage Music Runtime Batch - 2026-07-19

## Scope

This pass validates the active procedural music runtime instead of duplicating
the older static lore-gap catalogue.

- Every generated plan is original and procedural. No canonical melody,
  recording, sample, lyric, or protected score data is embedded.
- Gears of War and Daft Punk keep their detailed profiles.
- Oliver Tree, Hazbin Hotel, and Vocaloid now have distinct original profiles.
- All modern Predator labels resolve to the Predator hunting profile.
- Splatterhouse, Streets of Rage, Toy Soldiers, Stargate, and Zombies Ate My
  Neighbors now have dedicated profiles.
- Spy x Family, War of the Worlds, Ghostbusters, and Tremors now replace their
  family fallbacks with four distinct original procedural profiles.
- Parasyte and Uzumaki now have dedicated original procedural profiles;
  Chainsaw Man, Demon Slayer, and Cyberpunk: Edgerunners are regression-tested.
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
| Oliver Tree | `mus-oliver-tree` | Original compressed alt-pop pulse, demolition impacts and scooter-bell accents |
| Hazbin Hotel | `mus-hazbin-hotel` | Original infernal cabaret pulse, piano, muted brass and theater organ |
| Vocaloid | `mus-vocaloid` | Original bright digital-stage pulse, arpeggiator and wordless formant pad |
| Splatterhouse | `mus-splatterhouse` | Detuned organ, prepared piano, chain noise, arcade horror toms |
| Streets of Rage | `mus-streets-of-rage` | Original FM-style bass, pulse lead, urban brawler rhythm |
| Toy Soldiers | `mus-toy-soldiers` | Miniature brass, tin drums, toy piano, clockwork rhythm |
| Stargate | `mus-stargate` | Original frame-drum pulse, low synthetic brass, gate-metal resonance |
| Zombies Ate My Neighbors | `mus-zombies-ate-my-neighbors` | Original cartoon organ, chip bass, theremin-style pulse and B-movie stabs |
| Spy x Family | `mus-spy-x-family` | Pizzicato chamber pulse, brushed percussion, covert clockwork and warm family pad |
| War of the Worlds | `mus-war-of-the-worlds` | Uneven invasion pressure, bowed metal, storm noise and subsonic machine resonance |
| Ghostbusters | `mus-ghostbusters` | Original paranormal electro-comedy pulse, elastic bass, organ and dry brass |
| Tremors | `mus-tremors` | Dry desert suspense, ground rumble, corrugated impacts and survival rhythm |
| Cyberpunk: Edgerunners | `mus-cyberpunk-edgerunners` | Modular bass, breakbeat noise, glass pads and network clicks |
| Chainsaw Man | `mus-chainsaw-man` | Asymmetric industrial pulse, chainsaw-like oscillator and fragile memory pad |
| Demon Slayer | `mus-demon-slayer` | Taiko-like pulse, plucked strings, breath shimmer and restrained heroic release |
| Parasyte | `mus-parasyte` | Uneven heartbeat, elastic strings, cold piano and organic percussion |
| Uzumaki | `mus-uzumaki` | Slow whole-tone spiral, bowed metal, sea noise and subterranean pressure |

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
| Dedicated-profile views | 180 |
| Fusion-profile views | 56 |
| Family fallback views | 936 |
