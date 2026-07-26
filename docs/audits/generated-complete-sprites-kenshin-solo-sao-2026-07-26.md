# Rurouni Kenshin, Solo Leveling and Sword Art Online - generated sprite lot

Date: 2026-07-26

## Scope

This lot adds 15 original fan-made OpenAI sprite sheets:

- Rurouni Kenshin: Kenshin Himura, Kaoru Kamiya, Sanosuke Sagara, Cho
  Sawagejo, Hannya, Takeda Kanryu, Aoshi Shinomori, Soujiro Seta and
  Makoto Shishio.
- Solo Leveling: Sung Jinwoo, Cha Hae-In and Yoo Jinho.
- Sword Art Online: Kirito, Asuna and Klein.

No existing sheet was overwritten. Registry IDs and output paths remain
unchanged, including the three generic Rurouni Kenshin IDs.

## Continuity locks

### Rurouni Kenshin

The selected continuity is the 2023 anime Kyoto arc. Kenshin uses the red
kimono, white hakama and reverse-blade sakabato. Kaoru uses a wooden bokuto.
Sanosuke is post-Anji and remains unarmed. Generic registry names are mapped
visually to canon entities without changing their IDs:

- `Juppongatana Swordsman`: Cho Sawagejo with Hakujin no Tachi.
- `Oniwabanshu Shinobi`: Hannya with his striped forearms and demon mask.
- `Gatling Gun Guard`: Takeda Kanryu operating a carriage-mounted period
  Gatling gun, never a portable modern minigun.

Aoshi uses two kodachi, Soujiro uses Kikuichimonji Norimune, and Shishio uses
Mugenjin with attack-only friction flame.

Primary references:

- https://rurouni-kenshin.com/character/
- https://rurouni-kenshin.com/assets/img/chara/img_chara01.png
- https://rurouni-kenshin.com/assets/img/chara/img_chara02.png
- https://rurouni-kenshin.com/assets/img/chara/img_chara04.png
- https://rurouni-kenshin.com/assets/img/chara/img_chara06.png
- https://rurouni-kenshin.com/assets2/img/chara/img_chara10.png
- https://rurouni-kenshin.com/assets2/img/chara/img_chara11.png

### Solo Leveling

The selected continuity is the TV anime. Jinwoo uses his Season 2 dark
hoodie and two Demon King's Daggers, before late Shadow Monarch armor. Cha
uses her standard red, white and gold raid armor with one straight sword.
Jinho uses his first expensive white, gold and red raid armor, a dominant
heater shield and a short sword.

Primary references:

- https://sololeveling-anime.net/
- https://sololeveling-anime.net/character/?chara=shun
- https://sololeveling-anime.net/1st/character/?chara=shizuku
- https://sololeveling-anime.net/1st/character/?chara=kenta
- https://sololeveling-anime.net/1st/story/?id=05

### Sword Art Online

The selected continuity is the original 2012 Aincrad arc. Kirito uses his
Black Swordsman coat, Elucidator and attack-only Dark Repulser. Asuna uses
her Knights of the Blood Oath uniform and Lambent Light. Klein uses his red
samurai-inspired armor and one katana. ALO, GGO and Alicization designs are
excluded.

Primary references:

- https://www.swordart-online.net/aincrad/
- https://www.swordart-online.net/sp/aincrad/character/
- https://www.swordart-online.net/SAOA/en/

## Generation and normalization

Every accepted source was generated with the built-in OpenAI image tool as
detailed pixel art on a flat chroma background. Official model sheets and
episode stills were passed as visual references where equipment required a
second source.

The installed OpenAI chroma helper removed the temporary background. The
project strict-cell normalizer then rebuilt every runtime atlas:

```text
1024 x 1024 RGBA
4 columns x 4 rows
16 frames of 256 x 256
rows: idle, movement, attack/action, hit/defeat
minimum transparent guard: 12 px
```

## QA

Automated and visual checks passed for all 15 sheets:

- 240 / 240 occupied cells;
- 240 / 240 exact-distinct frame hashes;
- minimum 12 px transparent guard in every runtime cell;
- zero visible chroma pixels;
- zero non-black hidden RGB where alpha is zero;
- no adjacent-frame leakage, cropped equipment or superposed sprite;
- Rurouni Kenshin is now complete at 9 / 9 combat sheets.

Result: **PASS - 15 / 15 sheets.**
