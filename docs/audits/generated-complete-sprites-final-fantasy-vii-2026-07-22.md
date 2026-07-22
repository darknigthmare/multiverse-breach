# Final Fantasy VII (1997) - complete OpenAI sprite audit

Date: 2026-07-22

## Scope

This batch is limited to Final Fantasy VII sprites. Seventeen unique runtime
sheets were generated with the built-in OpenAI ImageGen tool, processed to
alpha PNG, inspected, and saved in the paths already declared by the manifest.

Every final file is a 1024 x 1024 RGBA PNG with a strict invisible 4 x 4
layout of 256 x 256 cells:

- Row 1: `idle`
- Row 2: `run` or lore-appropriate locomotion
- Row 3: `attack`
- Row 4: `hit`

No JavaScript, JSON, manifest, prompt registry, stage, music, package file, or
other universe was edited for this batch.

## Manifest reconciliation

The manifest contains 18 Final Fantasy VII hero/enemy/boss records but only 17
unique output paths. `Safer Sephiroth` is duplicated with the same id and the
same output path. Only one file was generated:

`/sprites/generated/bosses/final-fantasy-vii/safer-sephiroth.png`

## Online reference URLs

### Official Square Enix sources

- Original Final Fantasy VII title and character portal:
  <https://na.finalfantasy.com/titles/finalfantasy7>
- Official legacy PC edition page and character roster:
  <https://finalfantasyviipc.square-enix-games.com/en>
- Official comparison article identifying the 1997 original design:
  <https://na.finalfantasy.com/topics/158>
- Official Cloud design chronology, including the 1997 appearance:
  <https://na.finalfantasy.com/topics/575>

These sources anchor Cloud, Tifa, Aerith, Barret, Red XIII, Yuffie, Vincent,
Sephiroth, the 1997 release, and the original costume vocabulary.

### Canon and game-data cross-checks

- SOLDIER and original rank colors:
  <https://finalfantasy.fandom.com/wiki/SOLDIER>
- SOLDIER:3rd enemy:
  <https://finalfantasy.fandom.com/wiki/SOLDIER%3A3rd>
- Guard Scorpion:
  <https://finalfantasy.fandom.com/wiki/Guard_Scorpion_%28Final_Fantasy_VII%29>
- Midgar Zolom:
  <https://finalfantasy.fandom.com/wiki/Midgar_Zolom>
- Grunt combatant:
  <https://finalfantasy.fandom.com/wiki/Grunt_%28Final_Fantasy_VII%29>
- Sweeper:
  <https://finalfantasy.fandom.com/wiki/Sweeper_%28Final_Fantasy_VII%29>
- Tonberry:
  <https://finalfantasy.fandom.com/wiki/Tonberry_%28Final_Fantasy_VII%29>
- Safer Sephiroth:
  <https://finalfantasy.fandom.com/wiki/Safer%E2%88%99Sephiroth>
- Jenova BIRTH:
  <https://finalfantasy.fandom.com/wiki/Jenova%E2%88%99BIRTH>
- Original final human Sephiroth battle:
  <https://finalfantasy.fandom.com/wiki/Sephiroth_%28Final_Fantasy_VII_boss%29>
- Jenova Synthesis:
  <https://finalfantasy.fandom.com/wiki/Jenova%E2%88%99SYNTHESIS>

## Local visual references

The supplied `.codex-ff7-refs/` set was inspected as a contact sheet and as
individual source files. It contains the seven 1997 character illustrations,
the original Sephiroth illustration, original PS1 battle renders for all six
enemy entries and three transformed bosses, plus alternate raised-tail and
standing poses for Guard Scorpion and Midgar Zolom.

The local files were used only as identity, equipment, anatomy, palette, and
silhouette references. The delivered sheets are newly generated pixel-art
interpretations and do not copy source backgrounds or UI.

## Canon decisions

- `Shinra SOLDIER` follows the supplied blue-uniform, broad-sword
  `SOLDIER:3rd` battle model.
- `Guard Scorpion Drone` keeps the original Guard Scorpion boss anatomy despite
  the manifest's `Drone` suffix.
- `Shinra Guard` follows the supplied original `Grunt` combatant model: blue
  body, one-eyed silver helmet, and two clawed weapon forearms. It is not
  replaced with a Remake infantry trooper.
- `Tonberry Stalker` follows the original 1997 Tonberry model with one lantern
  and one knife.
- `Jenova Synthesis Core` represents the visible central original model and
  does not add detached tentacle enemies.
- In the 1997 game, the literal winged final form is Safer Sephiroth. The
  separate manifest output `Sephiroth One-Winged` is therefore treated as the
  original human Sephiroth design with one requested black wing. It keeps the
  1997 black coat, silver pauldrons, long hair, and Masamune and deliberately
  avoids Safer anatomy and later ornate costume redesigns.

## Prompt contract

Every final generation used the following shared contract:

- exactly 16 full-body frames in an invisible 4 columns x 4 rows layout;
- one complete subject per 256 x 256 cell with no overlap or leakage;
- stable identity, anatomy, equipment, palette, scale, and silhouette;
- four sequential frames for `idle`, `run`, `attack`, and `hit`;
- crisp hand-pixeled 32-bit-era art anchored to the original 1997 design;
- no text, logo, watermark, UI, border, printed grid, floor, cast shadow, or
  unrelated subject;
- a perfectly flat removable chroma backdrop, green by default and magenta for
  green subjects or clothing.

Subject-specific attack prompts used the Buster Sword, martial arts, staff,
gun-arm, claws and fangs, giant shuriken, handgun, SOLDIER sword, Guard
Scorpion raised tail, Zolom bite, Grunt claw-arms, Sweeper blades/cannon,
Tonberry knife, Safer wing/spell, Jenova tendrils/laser, Masamune, and Synthesis
core discharge respectively.

Yuffie was regenerated once so the shuriken remains held in all 16 cells.
Sephiroth One-Winged was corrected once so the Masamune remains visible in all
four hit frames. These corrected sources are the ones used for the runtime
files.

## Alpha processing

Built-in ImageGen returned 1254 x 1254 chroma sources. Each accepted source was
processed independently with the installed helper:

```text
python.exe %CODEX_HOME%/skills/.system/imagegen/scripts/remove_chroma_key.py \
  --input <source.png> --out <alpha.png> --auto-key border --soft-matte \
  --transparent-threshold 12 --opaque-threshold 220 \
  --edge-contract 1 --despill --force
```

Each alpha source was then reconstructed cell by cell with nearest-neighbour
runtime scaling:

```text
python.exe scripts/normalizeGeneratedSpriteSheet.py \
  --input <alpha.png> --output <runtime.png> --strict-cells
```

This produced a fixed 1024 x 1024 sheet, retained the dominant connected
subject in each source cell, prevented cross-cell leakage, zeroed hidden RGB,
and enforced at least 12 px of transparent guard space in every runtime cell.

## Deliverables and measured QA

Alpha values are listed as fully transparent / partial / fully opaque pixels.

| Asset | Runtime path | Bytes | Alpha T / P / O | Cells | Min margin | Sampled key |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Cloud Strife | `/sprites/generated/heroes/final-fantasy-vii/cloud-ff7.png` | 715,428 | 779,524 / 31,924 / 237,128 | 16/16 | 12 px | `#0df30e` |
| Tifa Lockhart | `/sprites/generated/heroes/final-fantasy-vii/tifa-ff7.png` | 725,785 | 796,536 / 24,595 / 227,445 | 16/16 | 12 px | `#0af809` |
| Aerith Gainsborough | `/sprites/generated/heroes/final-fantasy-vii/aerith-ff7.png` | 709,070 | 804,994 / 25,509 / 218,073 | 16/16 | 12 px | `#09f50f` |
| Barret Wallace | `/sprites/generated/heroes/final-fantasy-vii/barret-ff7.png` | 1,023,882 | 658,484 / 29,988 / 360,104 | 16/16 | 12 px | `#f802f8` |
| Red XIII | `/sprites/generated/heroes/final-fantasy-vii/redxiii-ff7.png` | 593,546 | 862,304 / 22,933 / 163,339 | 16/16 | 12 px | `#0df80d` |
| Yuffie Kisaragi | `/sprites/generated/heroes/final-fantasy-vii/yuffie-ff7.png` | 775,604 | 787,596 / 60,689 / 200,291 | 16/16 | 12 px | `#f903f7` |
| Vincent Valentine | `/sprites/generated/heroes/final-fantasy-vii/vincent-ff7.png` | 874,525 | 720,587 / 27,589 / 300,400 | 16/16 | 12 px | `#0ff80e` |
| Shinra SOLDIER | `/sprites/generated/bosses/final-fantasy-vii/shinra-soldier.png` | 606,080 | 797,464 / 19,526 / 231,586 | 16/16 | 12 px | `#07f808` |
| Guard Scorpion Drone | `/sprites/generated/bosses/final-fantasy-vii/guard-scorpion-drone.png` | 854,450 | 744,163 / 56,139 / 248,274 | 16/16 | 12 px | `#f403f6` |
| Midgar Zolom | `/sprites/generated/bosses/final-fantasy-vii/midgar-zolom.png` | 675,808 | 772,396 / 26,455 / 249,725 | 16/16 | 12 px | `#fb03fa` |
| Shinra Guard | `/sprites/generated/bosses/final-fantasy-vii/shinra-guard.png` | 841,919 | 739,158 / 27,952 / 281,466 | 16/16 | 12 px | `#07f802` |
| Sweeper Machine | `/sprites/generated/bosses/final-fantasy-vii/sweeper-machine.png` | 1,050,263 | 638,419 / 26,963 / 383,194 | 16/16 | 12 px | `#0af80a` |
| Tonberry Stalker | `/sprites/generated/bosses/final-fantasy-vii/tonberry-stalker.png` | 976,996 | 562,335 / 26,336 / 459,905 | 16/16 | 12 px | `#fb03fa` |
| Safer Sephiroth | `/sprites/generated/bosses/final-fantasy-vii/safer-sephiroth.png` | 691,130 | 852,309 / 60,836 / 135,431 | 16/16 | 12 px | `#0bf50e` |
| Jenova BIRTH | `/sprites/generated/bosses/final-fantasy-vii/jenova-birth.png` | 1,051,356 | 696,661 / 36,988 / 314,927 | 16/16 | 12 px | `#04f905` |
| Sephiroth One-Winged | `/sprites/generated/bosses/final-fantasy-vii/sephiroth-one-winged.png` | 709,468 | 808,048 / 27,013 / 213,515 | 16/16 | 12 px | `#12e715` |
| Jenova Synthesis Core | `/sprites/generated/bosses/final-fantasy-vii/jenova-synthesis-core.png` | 807,248 | 750,767 / 20,389 / 277,420 | 16/16 | 12 px | `#06f904` |

All 17 files passed the common structural checks:

- PNG, exactly 1024 x 1024, mode RGBA, alpha extrema 0-255;
- 272 / 272 occupied cells;
- minimum 12 px transparent guard inside every cell;
- fully transparent outer sheet border (`borderAlphaMax = 0`);
- zero non-black hidden RGB pixels where alpha is zero;
- zero visible pixels within RGB distance 48 of the sampled chroma key.

## Visual inspection

- All seven heroes retain the supplied 1997 clothing, colors, proportions, and
  signature equipment. Run, attack, and hit rows are sequential and readable.
- SOLDIER, Guard Scorpion, Grunt/Shinra Guard, and Sweeper preserve their
  original PS1 mechanical silhouettes and stable limb or weapon counts.
- Red XIII, Midgar Zolom, and Tonberry retain their defining anatomy and carried
  items without extra creatures or later redesigns.
- Safer Sephiroth keeps the halo, one dark upper wing, and white-lavender lower
  wings; it is visually distinct from the separate human one-wing variant.
- Jenova BIRTH and Synthesis Core remain distinct original forms with stable
  organic structures, tendrils, and palettes.
- No sheet contains text, UI, a printed grid, a second subject, cell overlap,
  cropped anatomy, or visible chroma fringe.

QA result: **PASS - 17 / 17 unique sheets, 272 / 272 occupied cells.**
