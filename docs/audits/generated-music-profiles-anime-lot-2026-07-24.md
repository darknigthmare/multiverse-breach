# Generated stage music profiles - anime lot - 2026-07-24

## Scope

This lot completes dedicated procedural stage music for:

| Universe | Runtime profile |
| --- | --- |
| Dragon Ball Z | `mus-dragon-ball-z` |
| Tokyo Ghoul | `mus-tokyo-ghoul` |
| Fullmetal Alchemist | `mus-fullmetal-alchemist` |
| Neon Genesis Evangelion | `mus-neon-genesis-evangelion` |

Each profile now has four universe-specific gameplay arrangements:

- `combat`, selected by Combat or Fighter stages;
- `melee`, selected by Melee or Smash stages;
- `rpg`;
- `tactics`.

Each profile also has separate `boss` and `worldBoss` arrangements. World-boss plans use a denser palette, a distinct musical form and a distinct runtime cache key.

## Reference sources

Only official or publisher-controlled pages were used to establish the broad musical language and canonical dramatic context:

- Dragon Ball official franchise scope: <https://en.dragon-ball-official.com/about/>
- Toei Animation press release crediting Shunsuke Kikuchi and the orchestral Dragon Ball concert repertoire: <https://www.toei-animation-usa.com/press-releases/DBSymphonicAdventure.pdf>
- Tokyo Ghoul official music page crediting Yutaka Yamada and the original soundtrack: <https://www.marv.jp/special/tokyoghoul/first/music.html>
- Fullmetal Alchemist: Brotherhood official soundtrack page crediting Akira Senju and the Warsaw Philharmonic: <https://www.hagaren.jp/fa/products/cd3.html>
- Neon Genesis Evangelion official soundtrack anniversary page and TV-series music history: <https://www.evangelion.jp/news/sd25thbox-finally/>
- Neon Genesis Evangelion official TV and film edition page crediting Shiro Sagisu: <https://www.evangelion.jp/news/eva_bdboxse/>

These references informed only high-level palette decisions such as orchestral scale, martial or military percussion, chamber colors, electronic tension, organ, piano and nonlexical choir.

## Copyright policy

All four profiles declare `sourcePolicy: original-procedural-only`.

No audio file, recording, sample, canonical melody, chord transcription, theme title sequence or protected score data is included. The runtime generates deterministic original note sequences from scales, abstract chord degrees, probability patterns, original forms and synthetic instrument descriptions.

## Gameplay direction

### Dragon Ball Z

- Combat: martial brass, string ostinato, arena toms and short ki impacts.
- Melee: faster aerial pursuit, launch impacts and ring-out pressure.
- RPG: warm travel palette, training passages and distant energy shimmer.
- Tactics: measured five-beat planning, scouter clicks and formation pulses.
- Boss: villain transformation and overwhelming-power escalation.
- World boss: planetary-cataclysm scale followed by a united counterattack.

### Tokyo Ghoul

- Combat: distorted oscillator guitar, urgent strings, broken beats and kagune impacts.
- Melee: faster rooftop pursuit and vertical platform pressure.
- RPG: fragile piano, solo cello synth, city room tone and internal conflict.
- Tactics: clinical CCG pulse, radio clicks and quinque charge accents.
- Boss: chromatic kakuja pressure and fractured-will tension.
- World boss: ward-wide calamity, mass strings and nonlexical tragedy choir.

### Fullmetal Alchemist

- Combat: heroic brass, military snare, piano attacks and transmutation impacts.
- Melee: agile compound meter, automail hits and reconstructed arena movement.
- RPG: chamber travel colors, research, memory and restrained resolve.
- Tactics: command-room ostinato, map-table piano and transmutation-grid pulses.
- Boss: harmonic-minor homunculus pressure and Philosopher's Stone ritual weight.
- World boss: nationwide-circle scale, organ, mass choir and human counterattack.

### Neon Genesis Evangelion

- Combat: NERV operational brass, urgent strings, warning signals and servo impacts.
- Melee: unstable seven-beat urban motion and A.T. Field pressure.
- RPG: sparse piano, cello, room tone, train ambience and emotional distance.
- Tactics: MAGI analysis, countdown ostinato, command snare and Geofront pulse.
- Boss: angular orchestra, organ, choir cluster and A.T. Field inversion.
- World boss: apocalyptic orchestra, ego-boundary collapse and End of Evangelion scale.

The Evangelion profile is scoped to the original TV series and The End of Evangelion. It does not mix Rebuild-specific narrative material into this universe profile.

## Runtime changes

`stageMusicProfiles.js` now:

- preserves optional `modeProfiles` and `encounterProfiles` while merging profiles;
- maps Fighter to `combat` and Smash to `melee`;
- applies mode arrangements before boss/world-boss arrangements;
- exposes `modeVariant` and `encounterVariant` in resolved plans;
- activates the boss layer for explicit world-boss stages;
- includes both arrangement variants in the runtime cache key.

## Validation

The targeted assertions in `scripts/stageMusicAudit.mjs` cover:

- four stable dedicated profile IDs;
- 16 mode-specific arrangements;
- four boss arrangements;
- four world-boss arrangements;
- original-only source policy;
- non-empty deterministic sequences;
- distinct mode palettes and forms;
- distinct boss/world-boss palettes and cache keys;
- higher world-boss density;
- hidden-DLC Nexus fallback and fusion behavior.

Commands:

```text
node --check src/game/stageMusicProfiles.js
node --check scripts/stageMusicAudit.mjs
cmd /c npm run music:audit
```

The full music audit passes with 293 lore profiles, 1172 stage views and 1172 unique runtime keys.
