# Spirited Away, Chicken Run and Psycho-Pass - generated sprite lot

Date: 2026-07-26

## Scope

This lot adds 20 original fan-made OpenAI sprite sheets:

- Spirited Away: Chihiro, Haku, Lin, Paper Bird, Yubaba and the Kashira Trio.
- Chicken Run: Ginger, Rocky, Fowler, a Tweedy Farm Guard Dog, Mrs. Tweedy
  and Mr. Tweedy.
- Psycho-Pass: Akane Tsunemori, Shinya Kogami, Nobuchika Ginoza, Helmet
  Rioter, the hacked military drone, an anonymous Public Safety Enforcer,
  Shogo Makishima and Kirito Kamui.

The existing Chicken Run pie-machine sheet was not overwritten.

## Continuity locks

### Spirited Away

The only selected continuity is Hayao Miyazaki's 2001 film. Chihiro and Lin
use their bathhouse worker appearances. Haku remains human for idle,
movement and damage states; his canonical wingless white dragon form is
limited to the action row. The Paper Bird remains folded white paper. Yubaba
keeps her tiny body and oversized head. Every Kashira frame contains exactly
three disembodied heads and never the transformed baby.

Primary references:

- https://www.ghibli.jp/works/chihiro/
- https://www.ghibli.jp/info/013344/

### Chicken Run

The selected continuity is Aardman's original 2000 film, not the sequel.
Ginger keeps her blue scarf, Rocky his circus/American accent, and Fowler
his RAF cap and medal. The Guard Dog remains a quadruped farm animal.
Mrs. Tweedy uses the tall angular farm-owner design and axe; Mr. Tweedy uses
the short broad farmer design with net and farm tools.

Primary references:

- https://www.aardman.com/film-tv-games/chicken-run/
- https://www.dreamworks.com/movies/chicken-run

### Psycho-Pass

Each sheet is locked to one incarnation:

- Akane and Ginoza use their Psycho-Pass 2 designs.
- Kogami and Makishima use season 1 designs.
- Kamui, the military drone and the anonymous Enforcer use Psycho-Pass 2.
- Helmet Rioter uses the season 1 episode 14 anti-scan helmet.

The two generic registry labels are represented by canon-compatible
entities. `Crime Coefficient Drone` is the hacked Ministry of Defense
military drone from Psycho-Pass 2 episodes 5-7; it does not scan crime
coefficients. `Sibyl Security Enforcer` is a human latent-criminal Enforcer
working for Public Safety, not a robot or armored Sibyl soldier.

Official design and episode references:

- https://psycho-pass.com/archive/character/tv1.php
- https://psycho-pass.com/archive/character/tv2.php
- https://psycho-pass.com/archive/sp/story/
- https://psycho-pass.com/archive/sp/character/tv2_dia.php

Official full-body references were downloaded to the temporary generation
workspace and supplied directly to ImageGen for Akane, Kogami, Ginoza,
Makishima and Kamui. Official episode stills were supplied for the helmet
and military drone.

## Generation and normalization

Accepted sources were created with the built-in OpenAI image generation tool
as detailed pixel art on a removable flat chroma background. The installed
OpenAI chroma helper produced alpha sources, and the project normalizer
rebuilt every runtime atlas cell:

```text
1024 x 1024 RGBA
4 columns x 4 rows
16 frames of 256 x 256
rows: idle, movement, attack/action, hit/defeat
minimum transparent guard: 12 px
```

Sources containing a second body in an action cell were rejected or edited
before integration. Haku's yellow key was processed without color despill
and with a one-pixel alpha contraction to preserve natural skin colors
without a yellow fringe. Mr. Tweedy's magenta key used a protected matte so
the purple catching net remained visible.

## QA

Automated and visual checks passed for all 20 sheets:

- 320 / 320 occupied cells;
- 320 / 320 exact-distinct frame hashes;
- minimum 12 px transparent guard in every runtime cell;
- zero visible source chroma pixels under the selected key tolerance;
- zero non-black hidden RGB where alpha is zero;
- no adjacent-frame leakage, superposed sprite or cropped equipment;
- all reviewed identities, forms and equipment respect their continuity lock.

Result: **PASS - 20 / 20 sheets.**
