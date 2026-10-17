# Signature source expansion — 17 October 2026

Base: PR #2 at `da68f7a207c8dc5e1bf3529a7ce16727470b1769`.

## Delivered scope

39 exact identities: 22 heroes and 17 enemy/boss entries. Source actions are
prepared on battle-local copies in RPG and Smash, not in saves or the shared
catalog. Existing explicitly authored profiles and non-combat characters are
preserved. The hub's legacy static descriptions are not comprehensively rewritten.

- FFVII: Cloud/Omnislash (15 distributed contacts), Tifa/Beat Rush,
  Barret/Catastrophe (10 distributed contacts), Aerith/Healing Wind (party healing),
  Red XIII/Cosmo Memory and Yuffie/All Creation.
- FFVIII: Squall/Renzokuken (eight-contact adaptation), Rinoa/Angelo Cannon
  (group attack) and Quistis/Laser Eye. No invented guaranteed Lion Heart finisher.
- FFXIII: Lightning/Odin, Fang/Bahamut, Vanille/Hecatoncheir, Snow/Stiria and Nix,
  Sazh/Brynhildr, Hope/Alexander. These are staged finisher actions, not a complete
  controllable Gestalt phase or a TP/learning/progression replacement.
- Dragon Ball Z: Goku/Kamehameha, Vegeta/Final Flash, Piccolo/Special Beam Cannon;
  Frieza/Death Ball, Perfect Cell/Kamehameha, Kid Buu/Planet Burst.
- Naruto and Shippuden: Rasengan and Chidori bound to four explicit incarnations.
  No eye-state inference for Kakashi and no new transformation granted.
- Half-Life: Bullsquid spit, Vortigaunt discharge, Houndeye sonic attack,
  Gonarch mortar. These do not add the complete creature AI or immunity matrix.
- Doom: three Imp records, two Cacodemons, Revenant, two Mancubi,
  Cyberdemon and Spider Mastermind. Their projectile/salvo families are explicit;
  burst timing, damage and board distances remain game adaptations.

## Runtime and safety

One reservation of 100 special charge (and full ATB in RPG). A whole multi-hit
plan is fixed before execution. Missing/dead/moved targets cannot transfer their
reserved contacts to a newly spawned target. Damage goes through the native
engine dispatcher and its encounter protection rules. Intermediate melee hits
do not knock the target out of their own contact sequence.

Healing Wind targets living allies with recoverable HP, uses the existing
radiation cap and never resurrects or cleanses an unrelated status. Full-health
parties cannot spend a healing super. Preview sums per-contact mitigation and
shield depletion without mutating the target. Random distribution is labelled
as a per-target range rather than full budget on every opponent.

Prepared action identity is checked throughout the sequence. KO, interruption,
actor replacement, pause, end of combat and disposal keep the prior protections.
The seven previously unhandled `summon_aoe` actions now enter the native summon
presentation path without replacing their existing executor/effect.

CPU Smash actors with a listed source action charge on simulation time; P2 does
not get automatic charging. A global recovery interval separates CPU sequences.
`stage.disableSignatureAI` disables this added AI. Unlisted enemies receive no
new action. This is not a full combat-AI rewrite or a complete boss moveset.

## Presentation and provenance

Beam, spiral, slash, barrage, ice, fire, acid, lightning, radial, orb, summon-ring
and healing staging now differ. Rendering is read-only and supports reduced
motion. Source enemies use the enemy sprite path, not a fabricated hero sprite.

No new creature/vehicle animation sheet is supplied. Existing images and
stylized effects are not a source-exact animation, camera or timing certificate.
No source entry has `canonicalFidelityApproved=true`.

Evidence URLs are stored beside each identity in `signatureSourceKits.js`.
Identity references include the official Dragon Ball and Naruto articles,
Square Enix's FFXIII discussions, the id Software DOOM source and Valve Half-Life
SDK. FF mechanical tables are secondary references and not author approvals:

- https://guides.gamercorner.net/ffvii/limit-breaks/
- https://guides.gamercorner.net/ffviii/limit-breaks/
- https://finalfantasy.fandom.com/wiki/Angelo_Cannon_(Final_Fantasy_VIII)
- https://guides.gamercorner.net/ffxiii/eidolons/
- https://eu.finalfantasy.com/topics/6
- https://na.finalfantasy.com/topics/139
- https://na.finalfantasy.com/topics/366
- https://en.dragon-ball-official.com/news/01_3039.html
- https://en.dragon-ball-official.com/news/01_1257.html
- https://naruto-official.com/en/news/01_1287
- https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c
- https://github.com/ValveSoftware/halflife/blob/master/dlls/bullsquid.cpp
- https://github.com/ValveSoftware/halflife/blob/master/dlls/islave.cpp
- https://github.com/ValveSoftware/halflife/blob/master/dlls/houndeye.cpp
- https://github.com/ValveSoftware/halflife/blob/master/dlls/bigmomma.cpp

## Reproduction

```
node --test --test-concurrency=1 scripts/signatureCombat.test.mjs scripts/signatureSafety.test.mjs scripts/signatureExpansion.test.mjs
node scripts/signatureCoverage.mjs /tmp/signature-coverage.json
npx oxlint --max-warnings 0 src/game/signature*.js src/components/RpgTargetingPanel.jsx scripts/signature*.mjs scripts/fixtures/signatureSourceHarness.jsx
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
AUDIT_OUTPUT_DIR=/tmp/source-browser python scripts/browserSignatureSources.py
```

The existing unprofiled-super regression now uses Vincent rather than Cloud,
whose source kit is implemented by this lot. The assertion is kept, not removed.
The eight new browser cases use real GameCanvas controls and synthetic initial
states; they do not represent full campaigns or physical phone tests. The local
browser was blocked by its environment; GitHub CI artifacts are the authoritative
browser result for the published commit. Source snapshots used for local unit
checks are not a complete artwork checkout or a full Vercel prebuild.

## Coverage and remaining work

Coverage script v2: 4,936 records / 525 universes; 24 native summon records,
31 equipped invocation associations, 69 profiled melee supers, 39 new source
bindings, 101 non-combat entries, **4,725 records without a dedicated signature**.
Categories overlap; these are not an additive count of completed characters.
The remaining full movesets, source animations, transformations, complete boss
mechanics, other modes and static codex consistency remain open.
