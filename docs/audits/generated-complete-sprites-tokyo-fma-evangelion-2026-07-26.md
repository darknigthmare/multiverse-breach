# Tokyo Ghoul, Fullmetal Alchemist and Evangelion - generated sprite lot

Date: 2026-07-26

## Scope

This lot adds 19 original fan-made OpenAI sprite sheets:

- Tokyo Ghoul: Ken Kaneki, Touka Kirishima, Koutarou Amon, Yamori / Jason
  and Eto in her humanoid Aogiri form.
- Fullmetal Alchemist: Edward Elric, Alphonse Elric, Roy Mustang, Pride /
  Selim Bradley, King Bradley / Wrath and a Mannequin Soldier.
- Neon Genesis Evangelion: EVA-01, EVA-02, EVA-00 Kai, Sachiel, Ramiel,
  Zeruel, Kaworu / Tabris and a Mass Production Evangelion.

Existing One-Eyed Owl and Father sheets were not overwritten.

## Continuity locks

### Tokyo Ghoul

The selected continuity is the original series before `Tokyo Ghoul :re`.
Kaneki uses his post-Yamori white-haired form. Touka uses her Anteiku-era
appearance and Rabbit equipment. Amon remains a human CCG investigator.
Yamori uses his Aogiri-era cream suit and rinkaku. Eto's sheet is limited to
her bandaged humanoid Aogiri form and partial kagune growth.

Primary references:

- https://youngjump.jp/tokyoghoul/tg/chara/kaneki_ken/
- https://youngjump.jp/tokyoghoul/tg/chara/kirishima_toka/
- https://youngjump.jp/tokyoghoul/tg/chara/amon_kotaro/
- https://youngjump.jp/tokyoghoul/tg/chara/yamori/
- https://youngjump.jp/tokyoghoul/tg/chara/eto/
- https://www.marv.jp/special/tokyoghoul/first/images/chara/kaneki2_02.png
- https://www.marv.jp/special/tokyoghoul/first/images/chara/kirishima_02.png
- https://www.marv.jp/special/tokyoghoul/first/images/chara/amon_02.png
- https://www.marv.jp/special/tokyoghoul/first/images/chara/yamori_02.png

### Fullmetal Alchemist

The selected continuity is the manga / Brotherhood Promised Day, not the
2003 anime. Edward keeps automail on the right arm and left leg. Alphonse is
the hollow horned armor. Roy is generated before forced transmutation and
uses marked ignition gloves. Pride remains Selim with attached eye-filled
shadows. Bradley uses sabers and the Ultimate Eye without alchemy. The
Mannequin Soldier is unarmed and uses the Brotherhood forehead-eye design.

Primary references:

- https://fullmetalalchemistusa.com/character/
- https://fullmetalalchemistusa.com/img/in/character/cha_01.png
- https://fullmetalalchemistusa.com/img/in/character/cha_02.png
- https://fullmetalalchemistusa.com/img/in/character/cha_05.png
- https://fullmetalalchemistusa.com/img/in/character/cha_14.png
- https://fullmetalalchemistusa.com/img/in/character/cha_41.png
- https://fullmetalalchemistusa.com/story/51.html
- https://fullmetalalchemistusa.com/story/53.html
- https://fullmetalalchemistusa.com/story/56.html

### Neon Genesis Evangelion

The selected continuity is the 1995-1996 TV series and `The End of
Evangelion`. Rebuild designs are excluded. EVA-01 uses purple and green TV
armor, EVA-02 uses the red four-eyed design, and Rei pilots the repaired blue
EVA-00 Kai rather than the orange prototype. Sachiel, Ramiel and Zeruel use
their original TV forms. Tabris remains human. The production unit uses the
white EoE body, wings, smile and Heavy Spear.

Primary reference:

- https://www.evangelion.jp/

## Generation and normalization

All accepted sources were created with the built-in OpenAI image generation
tool as detailed pixel art on a flat green or magenta chroma background.
Each source was reviewed before integration. A first generic Touka source,
the lettered EVA-00 shield and a multi-faced Sachiel source were rejected or
corrected.

The installed OpenAI chroma helper removed the temporary background. The
project normalizer then rebuilt each runtime atlas cell by cell:

```text
1024 x 1024 RGBA
4 columns x 4 rows
16 frames of 256 x 256
rows: idle, movement, attack/action, hit/defeat
minimum transparent guard: 12 px
```

Wide ImageGen sources used strict-cell normalization to preserve proportions.
EVA-01 required hard magenta keying so its canonical purple armor was not
desaturated by despill.

## QA

Automated and visual checks passed for all 19 sheets:

- 304 / 304 occupied cells;
- 304 / 304 exact-distinct frame hashes;
- minimum 12 px transparent guard in every runtime cell;
- zero visible source chroma pixels under the selected tolerance;
- zero non-black hidden RGB where alpha is zero;
- no adjacent-frame leakage, cropped equipment or superposed sprite;
- no continuity mixing between original anime and later redesigns.

Result: **PASS - 19 / 19 sheets.**
