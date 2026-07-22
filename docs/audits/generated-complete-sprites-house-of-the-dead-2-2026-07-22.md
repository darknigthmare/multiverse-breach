# The House of the Dead 2 (1998) - complete OpenAI sprite audit

Date: 2026-07-22

## Scope

This batch is limited to nine House of the Dead 2 sprite sheets:

- Heroes: James Taylor, Gary Stewart, and Amy Crystal.
- Enemies: David, Ebitan, and Devilon.
- Bosses: Judgment (Kuarl and Zeal), Tower, and Emperor Type Alpha.

All final assets are newly generated pixel-art interpretations made with the
built-in OpenAI ImageGen tool. They use the 1998 Sega arcade and 1999 Sega
Dreamcast designs as identity references without copying source artwork.

This task wrote only the nine PNGs listed below and this audit. It did not edit
JavaScript, JSON, manifests, `openai-sprite-prompts`, `generatedStageAssets`,
stages, music, package files, or other universes.

## Runtime contract

Every final file is a 1024 x 1024 RGBA PNG with a strict invisible 4 columns x
4 rows layout of 256 x 256 cells:

- Row 1: idle or hover.
- Row 2: run, crawl, flight, or lore-appropriate locomotion.
- Row 3: attack.
- Row 4: hit or recoil.

Every sheet contains 16 occupied and bytewise-distinct frames. Each cell keeps
at least 12 px of transparent guard space. No visible element crosses a cell
boundary.

## Online references

### Primary Sega, manual, and guide material

- [Sega arcade history - The House of the Dead 2](https://www.sega.jp/history/arcade/product/8991/)
- [Japanese Sega arcade flyer](https://flyers.arcade-museum.com/videogames/show/2901)
- [US Sega arcade flyer](https://flyers.arcade-museum.com/videogames/show/482)
- [Sega Dreamcast manual scan archive](https://archive.org/download/SEGADreamcastManuals_201812/House%20of%20the%20Dead%202%2C%20The%20%28USA%29.pdf)
- [Dreamcast packaging and manual scans](https://www.vgmuseum.com/scans/dc.html)
- [1999 Prima official strategy guide index](https://thehouseofthedead.fandom.com/wiki/The_House_of_the_Dead_2:_Prima%E2%80%99s_Official_Strategy_Guide)
- [Original Sega and guide artwork index](https://thehouseofthedead.fandom.com/wiki/Category:The_House_of_the_Dead_2_official_artwork)

### Target-specific cross-checks

- James Taylor: [original gallery](https://thehouseofthedead.fandom.com/wiki/James_Taylor/Gallery) and [original weapon reference](https://www.imfdb.org/wiki/The_House_of_the_Dead_2).
- Gary Stewart: [original appearance](https://thehouseofthedead.fandom.com/wiki/Gary_Stewart) and [original gallery](https://thehouseofthedead.fandom.com/wiki/Gary_Stewart/Gallery).
- Amy Crystal: [manual and perfect-guide references](https://thehouseofthedead.fandom.com/wiki/Amy_Crystal) and [original weapon reference](https://www.imfdb.org/wiki/The_House_of_the_Dead_2).
- David: [Japanese Perfect Guide artwork and original appearance](https://thehouseofthedead.fandom.com/wiki/David).
- Ebitan: [original green, brown, and black variants](https://thehouseofthedead.fandom.com/wiki/Ebitan).
- Devilon: [Japanese Perfect Guide artwork and original appearance](https://thehouseofthedead.fandom.com/wiki/Devilon).
- Judgment: [Kuarl and Zeal boss reference](https://thehouseofthedead.fandom.com/wiki/Judgment) and [original gallery](https://thehouseofthedead.fandom.com/wiki/Judgment/Gallery).
- Tower: [Type-8000 anatomy and colors](https://thehouseofthedead.fandom.com/wiki/Tower) and [original gallery](https://thehouseofthedead.fandom.com/wiki/Tower/Gallery).
- Emperor: [Type-alpha anatomy and attacks](https://thehouseofthedead.fandom.com/wiki/Emperor) and [original gallery](https://thehouseofthedead.fandom.com/wiki/Emperor/Gallery).

The official Sega history page anchored the release, developer, platform, and
1998 arcade presentation. The manual, flyers, Perfect Guide art, G's File,
Boss Mode art, and original screenshots supplied the target-specific clothing,
weapons, anatomy, palette, weak-point, and silhouette checks.

## Canon decisions

- James uses the original light gray-blue suit, white shirt, gray-silver tie,
  black shoes, short brown-black hair, and silver service pistol.
- Gary stays distinct from James through his dirty-blond curtain haircut,
  saturated blue suit, gray tie, brown shoes, and silver service pistol.
- Amy uses the scarlet in-game jacket rather than the cream-colored guide-print
  variant. She keeps the gray turtleneck, black skirt, belt, boots, earrings,
  and chrome handgun.
- David is the original shirtless, weaponless common creature with torn blue
  jeans, a bulging eye, and restrained damage to the face and chest.
- Ebitan uses the iconic green House of the Dead 2 variant: eyeless, moss-like
  surface growth, yellowed teeth, and the ochre torso section. It is not a later
  sequel or remake design.
- Devilon keeps the 1998 brown hairy body, large outward ears, gray leathery
  wings, large pink nose, toothed mouth, and small hind legs.
- Judgment contains both boss members in all 16 frames. Kuarl is always a
  headless, spiked, axe-bearing armored behemoth; Zeal is always the smaller
  winged imp beside him. No frame contains only one member.
- Tower is never architecture. Every frame is the connected aquatic Type-8000
  entity with four reddish-bronze eyeless serpents and one larger light-blue
  eyeless serpent. The blue head retains its rear crest.
- Emperor is never a generic robot. Every frame keeps the horned, levitating,
  translucent silver-blue water-like humanoid, its red heart-like chest core,
  and its close-orbiting silver-blue spheres. Attack frames include its fluid
  lance form without mechanical armor or joints.

## Prompt contract

Every accepted generation used the following shared constraints:

- exactly 16 complete frames in an invisible 4 x 4 layout;
- one complete character or boss entity per 256 x 256 cell;
- stable identity, anatomy, equipment, palette, scale, and silhouette;
- full containment and generous source clearance around every cell;
- crisp hand-pixeled late-1990s 32-bit Sega arcade presentation;
- flat removable chroma backdrop, green by default and magenta for Ebitan;
- no text, logo, watermark, UI, border, printed grid, floor, cast shadow,
  scenery, unrelated character, clipping, mixing, or excessive gore.

Tower received targeted ImageGen corrections so all 16 frames preserve its
canonical four bronze heads plus one blue head. No source asset was copied or
composited into the final sheet.

## Alpha processing and normalization

Built-in ImageGen returned 1254 x 1254 chroma sources. Every accepted source
was processed with the installed imagegen helper:

```text
python.exe %CODEX_HOME%/skills/.system/imagegen/scripts/remove_chroma_key.py \
  --input <source.png> --out <alpha.png> --auto-key border --soft-matte \
  --transparent-threshold 12 --opaque-threshold 220 \
  --edge-contract 1 --despill --force
```

The project normalizer then reconstructed a fixed 1024 x 1024 runtime sheet:

```text
python.exe scripts/normalizeGeneratedSpriteSheet.py \
  --input <alpha.png> --output <runtime.png>
```

The global component mode was used for James, Gary, Amy, David, Judgment, and
Emperor. It preserves complete poses that straddle an imperfect source-grid
boundary, keeps Kuarl and Zeal together, and retains Emperor's orbiting orbs.
The strict-cell mode was used for Ebitan, Devilon, and Tower, whose complete
entities were already contained in their source cells:

```text
python.exe scripts/normalizeGeneratedSpriteSheet.py \
  --input <alpha.png> --output <runtime.png> --strict-cells
```

Both modes output the same strict 4 x 4 runtime contract, use nearest-neighbor
scaling, zero hidden RGB, and enforce at least 12 px of transparent guard space.

## Deliverables and measured QA

Alpha values are fully transparent / partially transparent / fully opaque.

| Asset | Runtime path | Bytes | Alpha T / P / O | Cells | Min margin | Key |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| James Taylor | `/sprites/generated/heroes/house-of-the-dead-2/james-taylor-hotd2.png` | 536,386 | 841,822 / 39,570 / 167,184 | 16/16 | 12 px | `#0ff60e` |
| Gary Stewart | `/sprites/generated/heroes/house-of-the-dead-2/gary-stewart-hotd2.png` | 594,968 | 829,393 / 39,435 / 179,748 | 16/16 | 12 px | `#05f805` |
| Amy Crystal | `/sprites/generated/heroes/house-of-the-dead-2/amy-crystal-hotd2.png` | 436,608 | 879,541 / 41,256 / 127,779 | 16/16 | 12 px | `#0bf70f` |
| David | `/sprites/generated/bosses/house-of-the-dead-2/david.png` | 580,230 | 835,821 / 48,711 / 164,044 | 16/16 | 12 px | `#09f80c` |
| Ebitan | `/sprites/generated/bosses/house-of-the-dead-2/ebitan.png` | 798,657 | 790,084 / 28,617 / 229,875 | 16/16 | 12 px | `#fa02fa` |
| Devilon | `/sprites/generated/bosses/house-of-the-dead-2/devilon.png` | 772,716 | 776,981 / 21,995 / 249,600 | 16/16 | 12 px | `#03f906` |
| Judgment | `/sprites/generated/bosses/house-of-the-dead-2/judgment-kuarl-zeal.png` | 1,057,692 | 710,979 / 83,795 / 253,802 | 16/16 | 12 px | `#07f60a` |
| Tower | `/sprites/generated/bosses/house-of-the-dead-2/tower.png` | 1,271,502 | 613,243 / 23,008 / 412,325 | 16/16 | 12 px | `#03ce1e` |
| Emperor Type Alpha | `/sprites/generated/bosses/house-of-the-dead-2/emperor-type-alpha.png` | 527,741 | 879,731 / 56,233 / 112,612 | 16/16 | 12 px | `#0df10f` |

All nine files passed the common structural checks:

- PNG, exactly 1024 x 1024, mode RGBA, alpha extrema 0-255;
- 144 / 144 occupied cells and 16 / 16 exact-distinct frames per sheet;
- minimum 12 px transparent guard inside every cell;
- fully transparent outer sheet border (`borderAlphaMax = 0`);
- zero non-black hidden RGB pixels where alpha is zero;
- zero visible pixels within RGB distance 48 of either green or magenta chroma;
- no visible cross-cell leakage, clipping, text, UI, scenery, or excess gore.

## Visual inspection

- All three agents retain their original 1998 clothing, hair, proportions, and
  handguns. Their idle, movement, firing, and recoil rows remain readable.
- David, Ebitan, and Devilon retain the original guide silhouettes and attacks
  without later-game redesign details.
- Judgment visibly includes both complete members in every frame. Kuarl remains
  headless and retains one axe; Zeal remains independently visible nearby.
- Tower visibly retains five heads in every frame: four bronze and one blue.
  No frame reads as a building or loses the shared aquatic serpent identity.
- Emperor remains a fluid silver-blue humanoid in every frame, with a red core
  and orbiting spheres. No frame introduces robotic armor or machinery.

QA result: **PASS - 9 / 9 sheets, 144 / 144 occupied cells.**
