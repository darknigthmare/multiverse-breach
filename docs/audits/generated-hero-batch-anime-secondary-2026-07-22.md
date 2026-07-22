# Anime secondary heroes - OpenAI sprite audit

Date: 2026-07-22

## Scope

Four original sprite sheets were generated in four distinct OpenAI ImageGen calls. Each final asset is a 1024 x 1024 RGBA PNG organized as 4 columns x 4 rows of 256 x 256 cells:

- Row 1: idle
- Row 2: run
- Row 3: attack or lore-faithful action
- Row 4: hit progression

The official visuals controlled character identity and costume. Existing project sheets for Denji, David, Tanjiro, and Shinichi/Migi were supplied only as pixel-density, scale, and layout references.

## Official visual references

### Power - Chainsaw Man

- MAPPA official TV character page: <https://chainsawman.dog/tvseries/character/>
- Official standing visual used as the appearance anchor: <https://chainsawman.dog/tvseries/assets/img/chara/chara_3_stand.png>

The reference locks Power's long strawberry-blonde hair, red horns, fiend eyes and teeth, loose Public Safety shirt and tie, blue jacket, cropped dark trousers, and red-accented trainers. Her third row uses compact blood hammer and blood spear actions.

### Lucy - Cyberpunk: Edgerunners

- CD PROJEKT RED official character page: <https://www.cyberpunk.net/en/edgerunners>
- Official Lucy standing visual used as the appearance anchor: <https://www.cyberpunk.net/build/images/edgerunners/characters/lucy%401x-03385e8a.png>

The reference locks Lucy's asymmetrical white hair with cyan/lilac accents, facial cyberware, black netrunner suit, off-shoulder white jacket, shorts, cyber leggings, and boots. Her third row uses wrist-anchored monowire and a compact netrunning gesture.

### Nezuko Kamado - Demon Slayer

- Aniplex/ufotable official character page: <https://demonslayer-anime.com/hta/character/>
- SEGA official character page and full-costume action visual: <https://asia.sega.com/kimetsu_hinokami/en/character/>

The references lock Nezuko's standard form: black-to-orange hair, pink demon eyes, bamboo muzzle, pink geometric kimono, obi, dark haori, leg wraps, tabi, and sandals. The generation excludes her advanced horned form. Her third row uses claws, kicks, and pink-red Exploding Blood attached to the acting hand or foot.

### Satomi Murano - Parasyte -the maxim-

- VAP official Satomi character page: <https://www.vap.co.jp/kiseiju/sp/chara/satomi.html>
- Nippon TV official series page: <https://www.ntv.co.jp/english/pc/2014/07/parasyte--the-maxim-.html>

The VAP visual locks Satomi's short brown hair, gentle face, navy school blazer, white shirt, red bow, grey pleated skirt, black knee socks, and loafers. Her third row is deliberately a non-combat lore action: brace, call out without text, reach, and protect. She has no weapon, parasite, mutation, or invented power.

## Prompt summaries

- **Common contract:** exactly 16 full-body frames; one character per cell; stable identity, costume, scale, baseline, and right-facing gameplay direction; no text, grid, border, watermark, second character, cast shadow, or cell leakage.
- **Power:** idle breathing, four-phase run, blood-weapon sequence, then recoil through side fall; flat green chroma background.
- **Lucy:** controlled idle, four-phase sprint, compact monowire/netrunning sequence, then recoil through side fall; flat green chroma background.
- **Nezuko:** protective idle, four-phase run, claw/kick/Exploding Blood sequence, then recoil through side fall; flat cyan chroma background to preserve both the green bamboo and pink-red flames.
- **Satomi:** natural idle, four-phase run, human courage/support sequence, then non-graphic danger reactions; flat green chroma background.

## Processing

The built-in OpenAI ImageGen outputs were 1254 x 1254 source PNGs. Each source was processed independently:

1. Chroma removal with the installed `remove_chroma_key.py` helper using border auto-sampling, soft matte, despill, and one-pixel edge contraction.
2. Final reconstruction with:

   `python scripts/normalizeGeneratedSpriteSheet.py --input <alpha-source> --output <runtime-path> --strict-cells`

3. Nearest-neighbour cell scaling into a clean 1024 x 1024 RGBA sheet with transparent padding.

Sampled source keys were `#0af512` for Power, `#0df013` for Lucy, `#02fbfd` for Nezuko, and `#0ff80e` for Satomi.

## Deliverables and measured QA

| Character | Runtime path | PNG bytes | Alpha pixels: transparent / partial / opaque | Cells | Minimum cell margin |
| --- | --- | ---: | ---: | ---: | ---: |
| Power | `/sprites/generated/heroes/chainsaw-man/power-blood-fiend.png` | 725,380 | 809,652 / 21,332 / 217,592 | 16 / 16 | 12 px |
| Lucy | `/sprites/generated/heroes/cyberpunk-edgerunners/lucy-edgerunners.png` | 500,397 | 893,579 / 17,633 / 137,364 | 16 / 16 | 12 px |
| Nezuko | `/sprites/generated/heroes/demon-slayer/nezuko-kamado.png` | 1,013,193 | 672,556 / 26,156 / 349,864 | 16 / 16 | 12 px |
| Satomi | `/sprites/generated/heroes/parasyte/satomi-murano.png` | 469,382 | 890,273 / 16,237 / 142,066 | 16 / 16 | 12 px |

All four files passed the same structural checks:

- PNG, exactly 1024 x 1024, mode RGBA, alpha extrema 0-255.
- Exactly 16 non-empty 256 x 256 cells.
- Exactly one connected visible component per final cell.
- At least 12 px transparent padding inside every cell; no frame crosses a cell boundary.
- Fully transparent outer border.
- Zero non-black hidden RGB pixels where alpha is 0.
- Zero visible pixels within RGB distance 48 of the sampled chroma key.

## Visual inspection

- **Power:** stable horns, hair, uniform, body scale, blood weapons, and hit progression; no Denji or chainsaw contamination.
- **Lucy:** stable hair gradient, netrunner outfit, anatomy, monowire anchor, and damage poses; detached holographic glyphs from the source were excluded by strict-cell isolation.
- **Nezuko:** stable standard-form face, bamboo muzzle, kimono layers, long hair, kicks, and attached Exploding Blood; no horn, sword, Tanjiro, or second character.
- **Satomi:** stable official school uniform and human proportions; narrative action remains non-supernatural and contains no Shinichi, Migi, parasite appendage, weapon, or text.

QA result: **PASS - 4 / 4 sheets, 64 / 64 cells.**

No code or manifest file was edited. No commit, push, or deployment was performed.
