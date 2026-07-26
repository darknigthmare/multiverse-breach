# Steins;Gate procedural music profile - 2026-07-24

## Scope

A dedicated `mus-steins-gate` runtime profile was added for the `Steins;Gate`
universe. It contains six original procedural arrangements:

| Runtime context | Arrangement | Lore direction |
| --- | --- | --- |
| Combat / Fighter | `combat` | Rounder breach, laboratory countermeasure, time-leap reversal |
| Melee / Smash | `melee` | Radio Kaikan rooftop motion, divergence rebounds, rapid escape |
| RPG | `rpg` | Future Gadget Lab routine, D-Mail observation, Reading Steiner afterimage |
| Tactics | `tactics` | SERN signal tracing, Rounder route analysis, IBN access window |
| Boss | `boss` | Human SERN / Rounder pressure and forced convergence |
| World boss | `worldBoss` | Attractor Field escalation and Operation Skuld resolution |

`Fighter` resolves to the `combat` arrangement and `Smash` resolves to the
`melee` arrangement through the existing runtime alias contract.

## Official references

- Series portal and original-work overview:
  <https://steinsgate.jp/>
- Original game story, Future Gadget Laboratory, D-Mail, SERN, IBN 5100 and
  world-line context:
  <https://steinsgate.jp/sgflash.html>
- Official SERN / Rounder infiltration context:
  <https://steinsgate.jp/phenogram/story/kiryu.html>
- Official product page confirming the Operation Skuld narrative/music label
  and Takeshi Abo credit:
  <https://steinsgate.jp/octet/spec.html>
- Official RE:BOOT story and character registry:
  <https://steinsgate.jp/reboot/ja-jp/>

The references were used only to identify narrative context and broad dramatic
functions. No melody, harmony transcription, recording, sample, stem, lyric or
protected audio was copied.

## Original generative language

- Analog laboratory identity: cathode hum, relay clicks, worn electric piano,
  tape texture and synthetic clock pulses.
- World-line identity: uneven pulse groups, divergence counterpulses, restrained
  chromatic tension and changing metric accents.
- SERN identity: dry modem clicks, surveillance drones, gated industrial
  percussion and low analog ostinatos.
- Operation Skuld identity: denser layered oscillators, observed-history feint,
  phase displacement and a final original convergence-release form.

All instrument labels describe synthesizer or noise-generator roles. They do not
reference or embed a canonical score asset.

## Runtime assertions

`scripts/stageMusicAudit.mjs` verifies:

- exact profile ID and `original-procedural-only` policy;
- punctuation-free `Steins Gate` universe normalization;
- distinct Combat, Melee, RPG and Tactics palettes, forms and cache keys;
- `Fighter -> combat` and `Smash -> melee` aliases;
- non-empty procedural sequences and complete instrument palettes;
- distinct boss and Attractor Field arrangements;
- denser world-boss escalation;
- explicit `attractor-field-phase-pulse` instrumentation;
- explicit `operation-skuld` finale section.

## Validation commands

```text
node --check src/game/stageMusicProfiles.js
node --check scripts/stageMusicAudit.mjs
npm run music:audit
```

All three commands passed on 2026-07-24. The audit resolved:

- Combat: 256 procedural steps;
- Melee: 126 procedural steps;
- RPG: 240 procedural steps;
- Tactics: 200 procedural steps;
- Boss: `boss` encounter variant with density `1.196`;
- Attractor Field: `worldBoss` encounter variant with density `1.25`;
- all 293 lore profiles, 1,172 mode views and 1,172 runtime keys.
