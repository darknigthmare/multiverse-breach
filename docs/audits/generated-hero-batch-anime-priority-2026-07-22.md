# Anime priority heroes - OpenAI sprite audit

Date: 2026-07-22

## Scope

Four original hero sheets were generated with four separate built-in OpenAI
ImageGen calls. Each final asset is a 1024 x 1024 RGBA PNG containing a strict
4 columns x 4 rows layout of 256 x 256 cells:

- Row 1: idle
- Row 2: run
- Row 3: lore-faithful attack
- Row 4: hit progression

Every cell contains one character, or one fused Mamoru/Jaw entity. The final
art is an original pixel-art interpretation; official images were used only to
lock identity, costume, equipment, proportions, and attack vocabulary.

## Authoritative visual references

### Aki Hayakawa - Chainsaw Man

- MAPPA official character page:
  <https://www.chainsawman.dog/tvseries/character/>
- Official standing visual:
  <https://www.chainsawman.dog/tvseries/assets/img/chara/chara_4_stand.png>

The reference locks Aki's dark topknot, black Public Safety suit, white shirt,
black tie, sword harness, and sheathed nail sword. His attack row uses a draw,
two controlled slashes, and the Kon hand gesture without adding a second
visible creature.

### Rebecca - Cyberpunk: Edgerunners

- CD PROJEKT RED official series and character page:
  <https://www.cyberpunk.net/en/edgerunners>
- Official Rebecca standing visual:
  <https://www.cyberpunk.net/build/images/edgerunners/characters/rebecca%401x-b8bc9202.png>

The reference locks Rebecca's short adult proportions, pale cyan skin,
red-orange cyber-eyes, aqua hair with vivid accents, oversized dark jacket,
compact combat outfit, cyberware, and neon color blocking. Her attack row uses
one large pink-and-teal shotgun, including an attached muzzle flash and recoil.

### Zenitsu Agatsuma - Demon Slayer

- Aniplex/ufotable official character page:
  <https://demonslayer-anime.com/mugentrainarc/character/?chara=03>
- Official character image:
  <https://demonslayer-anime.com/mugentrainarc/assets/img/character/img_cha_03.jpg>

The reference locks Zenitsu's orange-yellow hair, black Corps uniform, white
belt, triangle-patterned yellow haori, leg wraps, sandals, and Nichirin sword.
The attack row is a four-frame Thunder Breathing First Form sequence with
compact lightning attached to the acting character and sword.

### Mamoru Uda and Jaw - Parasyte -the maxim-

- VAP official Mamoru Uda character page:
  <https://www.vap.co.jp/kiseiju/sp/chara/uda.html>
- Official standing visual:
  <https://www.vap.co.jp/kiseiju/images/chara/uda_img01.png>

The reference locks Mamoru's stocky middle-aged build, short dark hair,
grey hooded jacket with yellow-green chest panels, olive trousers, and dark
shoes. Jaw emerges only from the lower face, neck, and upper chest; the parasite
never becomes a detached entity or a right-hand Migi variant.

## Prompt contract

Each generation prompt required:

- exactly 16 full-body frames in an invisible 4 x 4 layout;
- one subject per cell, stable identity, scale, costume, and right-facing
  gameplay direction;
- four genuinely sequential frames for each requested state;
- no grid, text, logo, watermark, UI, floor, cast shadow, or cell leakage;
- a flat removable chroma backdrop with no chroma color in the subject;
- the official reference as the identity anchor and an existing sibling sheet
  only as the project pixel-density and layout reference.

Aki, Rebecca, and Zenitsu used green chroma. Mamoru used magenta chroma to
protect the muted green panels and trousers in his official costume.

## Processing

The four generated sources were 1254 x 1254 PNG files. Each source was handled
independently:

1. Remove flat chroma with the installed `remove_chroma_key.py` helper using
   border auto-sampling, soft matte, despill, and one-pixel edge contraction.
2. Reconstruct the sheet cell by cell with:

   `python scripts/normalizeGeneratedSpriteSheet.py --input <alpha-source> --output <runtime-path> --strict-cells`

3. Scale with nearest-neighbour sampling into a 1024 x 1024 RGBA runtime sheet
   while retaining at least 12 px of transparent padding in every cell.

Sampled source keys were `#0ef70c` for Aki, `#11f614` for Rebecca,
`#0bf711` for Zenitsu, and `#fa03f7` for Mamoru.

## Deliverables and measured QA

| Character | Runtime path | PNG bytes | Alpha pixels: transparent / partial / opaque | Cells | Minimum cell margin |
| --- | --- | ---: | ---: | ---: | ---: |
| Aki Hayakawa | `/sprites/generated/heroes/chainsaw-man/aki-hayakawa.png` | 533,937 | 857,017 / 21,779 / 169,780 | 16 / 16 | 12 px |
| Rebecca | `/sprites/generated/heroes/cyberpunk-edgerunners/rebecca-edgerunners.png` | 691,309 | 810,715 / 37,628 / 200,233 | 16 / 16 | 12 px |
| Zenitsu Agatsuma | `/sprites/generated/heroes/demon-slayer/zenitsu-agatsuma.png` | 940,530 | 731,037 / 20,522 / 297,017 | 16 / 16 | 12 px |
| Mamoru Uda and Jaw | `/sprites/generated/heroes/parasyte/mamoru-uda.png` | 651,163 | 805,466 / 21,414 / 221,696 | 16 / 16 | 12 px |

All four files passed the required structural checks:

- PNG, exactly 1024 x 1024, mode RGBA, alpha extrema 0-255;
- exactly 16 occupied 256 x 256 cells;
- at least 12 px transparent guard inside every cell;
- fully transparent outer sheet border;
- zero non-black hidden RGB pixels where alpha is zero;
- zero visible pixels within RGB distance 48 of the sampled chroma key.

## Visual inspection

- **Aki:** stable topknot, face, Public Safety suit, harness, sword, run cycle,
  attack progression, and Kon finish; no Denji or chainsaw contamination.
- **Rebecca:** stable cyan skin, hair, cyber-eyes, jacket, compact silhouette,
  shotgun handling, muzzle flash, and hit progression; no Lucy, David, yellow
  jacket, or monowire contamination.
- **Zenitsu:** stable hair, triangle haori, Corps uniform, sword, low trance
  stances, Thunderclap sequence, and fall; no Tanjiro checks, water, or flame.
- **Mamoru/Jaw:** stable official outdoor clothing and stocky proportions;
  Jaw remains attached below the nose through the neck/chest during every
  transformation and never becomes a separate character or hand parasite.

QA result: **PASS - 4 / 4 sheets, 64 / 64 occupied cells.**

No manifest, stage folder, music file, package file, or shared runtime code was
edited for this isolated batch.
