# Heavy Metal 2000 Character, Enemy and Boss Sprite Audit - 2026-07-22

## Scope

This batch contains eight original fan-made pixel-art sprite sheets generated with OpenAI ImageGen. Official material and identifiable film captures were used only as visual research. No official frame, logo, texture, sprite or production asset was copied into a deliverable.

Final scope:

- heroes: Julie / FAKK2, Odin disguised as the masked sage, and Zeek;
- enemies: one Cortez-type space pirate, one Uroboris reptilian gladiator, and one three-member citadel assault squad;
- bosses: Tyler as the Loc-Nar tyrant and Odin in his revealed Arakacian form.

No manifest, registry, runtime code, music file or unrelated asset was edited. In particular, `src/game/loreBossOverrides.js` was not modified by this work.

## Lore Correction

The initial assignment listed Zeek both as a hero and as a boss. That interpretation was corrected before finalization:

- Zeek is Odin's rock-like ally who ultimately removes the crystal key, seals the last Arakacian inside the chamber and carries the key away;
- `public/sprites/generated/heroes/heavy-metal-2000/zeek-hm2000.png` remains the playable/allied Zeek sheet;
- the generated boss sheet `public/sprites/generated/bosses/heavy-metal-2000/zeek.png` and its temporary source were deleted;
- the replacement boss is `public/sprites/generated/bosses/heavy-metal-2000/odin-arakacian-revealed.png`.

This matches the ending described by the film synopsis and the identifiable final-scene capture listed below.

## Visual References

References reviewed on 2026-07-22:

- Sony Pictures official film page and synopsis: https://www.sonypictures.com/movies/heavymetal2000
- Sony Pictures official banner, used for Julie's face, hair and combat palette: https://www.sonypictures.com/sites/default/files/banner-images/2022-03/heavymetal2000_banner_2572x1100_copyright.jpg
- TMDB film page and film-frame backdrops, used to cross-check Julie, Odin, Zeek, Tyler and Uroboris: https://www.themoviedb.org/movie/16225-heavy-metal-2000 and https://www.themoviedb.org/movie/16225-heavy-metal-2000/images/backdrops
- Rotten Tomatoes official clip index, used to identify the canonical action beats: https://www.rottentomatoes.com/m/heavy_metal_2000/videos
- SF-Fan.de contemporary review and Helkon Filmverleih stills: https://sf-fan.de/filmkritik/heavy-metal-f-a-k-k-2.html
- Julie combat still: https://sf-fan.de/images/stories/film/kino/heavy_metal_fakk2/julie3.jpg
- Julie weapon still: https://sf-fan.de/images/stories/film/kino/heavy_metal_fakk2/julie.jpg
- Odin masked still: https://sf-fan.de/images/stories/film/kino/heavy_metal_fakk2/2.jpg
- Tyler and the key: https://sf-fan.de/images/stories/film/kino/heavy_metal_fakk2/tyler_und_schluessel.jpg
- IMDb final-film capture of revealed Odin (`rm2116957184`): https://www.imdb.com/title/tt0119273/mediaviewer/rm2116957184/
- IMDb ending synopsis, used for the Zeek/Odin correction: https://www.imdb.com/title/tt0119273/plotsummary/

The revealed Arakacian reference establishes Odin's long blue-gray/lavender face, six yellow eyes in three pairs, blue forehead crystal, angular black head silhouette and four pale chin prongs. The final sprite keeps those identifiers instead of inventing a generic demon or fantasy wizard.

## ImageGen Calls

Every sheet was generated in a distinct ImageGen call. Ten calls were made in total:

1. Julie, accepted.
2. Odin masked, accepted.
3. Zeek hero, accepted.
4. Tyler's space pirate, accepted.
5. Uroboris reptilian gladiator, superseded after visual QA found one clipped axe.
6. Tyler's citadel assault squad, accepted.
7. Zeek boss, deleted after the lore correction.
8. Tyler Loc-Nar tyrant, accepted.
9. Odin Arakacian revealed, generated as the corrected boss.
10. Uroboris reptilian gladiator revision, accepted with complete weapon and tail margins.

Thus every final file has its own source call; the reptilian sheet additionally has one documented layout revision. Superseded and rejected outputs are not present in the repository.

## Prompt Contract

Each production prompt was the combination of the shared contract below and the relevant subject lock. The reptilian revision is documented separately.

### Shared contract

```text
Create one original fan-made game-ready 2D pixel-art animation sprite sheet inspired by Heavy Metal 2000 without copying any official frame or asset. Output one strict implicit 4x4 grid in a 1024x1024 composition: sixteen equal 256x256 cells, no visible dividers. Put exactly one complete full-body subject or the explicitly requested three-person squad in each cell. Keep identity, costume, equipment, palette, proportions, scale and three-quarter side-facing-right camera coherent in all sixteen frames. Leave at least 20 px of flat chroma background around every pose and keep all effects inside their own cell. Use crisp deliberate pixel clusters, a limited palette and a readable game silhouette; no painterly, vector or 3D rendering. Rows are idle, movement, canonical attack, then damage/death. No scenery, floor, cast shadow, text, letters, numbers, logo, signature, UI or watermark.
```

### Julie / FAKK2

```text
Tall athletic Julie from the film: tan skin, angular face, blue-violet eyes, red lips and long thick black hair with blue highlights. Near-black and deep-burgundy fitted combat suit, slate-gray shoulder/chest armor, bracers and shin armor, cartridge bandolier, two blocky black pistols and a broad sword. Attacks progress from dual-pistol fire to the canonical sword slash. Never turn her into a generic fantasy heroine. Flat #00FF00 chroma background.
```

### Odin, masked sage

```text
The film's tall robed Uroboris sage: black/midnight floor-length robes, restrained blue-gray piping and crossed straps, pale geometric mask, small blue forehead lens, and a twisted staff ending in an oval blue crystal. No Viking, armored knight, exposed human wizard face or generic fantasy redesign. The attack row uses the staff and a focused blue pulse. Flat #00FF00 chroma background.
```

### Zeek, ally

```text
The film's small squat orange-brown living-rock alien: knee-high proportions, pale cream/gray stone plates, huge forearms, short legs, small dark eyes and a crag-like mouth. No armor, weapon, glowing rune or generic golem redesign. Movement is a compact run; attacks are jab, shove/charge and ground punch; damage ends in a compact rock collapse. Flat #00FF00 chroma background.
```

### Tyler's space pirate

```text
One ordinary Cortez crew pirate, not Tyler: lean weathered tan-gray human male, black skullcap/tied hair, horseshoe moustache and goatee, charcoal undersuit, blue-gray harness, one steel shoulder plate and a rectangular industrial rifle. Rifle bursts form the canonical attack row. Flat #FF00FF chroma background.
```

### Uroboris reptilian gladiator

```text
Muscular green Uroboris reptilian with pale olive segmented belly, flat crocodilian snout, small horn nubs, yellow eyes, teeth, long tail, black harness, large metal rings and a complete double-headed poleaxe. Keep the film's desert gladiator silhouette; no dragon wings, heavy plate armor or generic fantasy lizard. Poleaxe wind-up, overhead strike, sweep and lunge form the attack row. Flat #FF00FF chroma background.
```

Revision prompt:

```text
Preserve the same generated identity, palette, harness, rings, poleaxe, camera and pixel-art finish, but rebuild the strict 4x4 sheet at about 12 percent smaller internal scale. Every tail, hand, foot and complete double-headed poleaxe must remain inside its own cell with at least 24 px source margin. Remove all clipped axe heads, crossed boundaries and detached neighboring fragments. This is a layout correction, not a redesign.
```

### Tyler's citadel assault squad

```text
Exactly the same three-person compact squad in every cell, never two or four: a human pirate rifle leader, a thin blue-gray alien rifleman with red goggles and respirator, and a short stocky pale breacher. Preserve identities, weapons and formation across all frames. The group moves, fires and falls together without adding background troops. Flat #FF00FF chroma background.
```

### Odin, Arakacian revealed

```text
Odin after the final-film reveal: very tall gaunt Arakacian with cool blue-gray/lavender skin, an extremely long narrow rectangular face, six small yellow-gold eyes arranged in three horizontal pairs, small mouth, black angular swept-back head silhouette, one vertical oval blue crystal above the forehead, four long pale tapered chin prongs and long blue-gray hands. Keep torn/open black and midnight-blue priest robes, blue-gray piping, twisted staff and blue crystal. No horns, wings, mandibles, tentacles, bulky armor, human face or generic demon. The attack row uses the staff, the canonical betrayal whip/energy lash and a focused blue pulse. Flat #FF00FF chroma background.
```

### Tyler, Loc-Nar tyrant

```text
Late-film Tyler remains recognizably human: huge pale gray-olive man, square jaw, swept black hair, teal-gray torso armor, giant charcoal spiked shoulder plates, dark clothing, glowing green Loc-Nar crystal at the chest/waist and a broad industrial cleaver. No demon, robot or anonymous armored brute. Attacks combine cleaver strikes, armored punches and controlled green crystal energy. Flat #FF00FF chroma background.
```

## Post-Processing

ImageGen returned RGB source sheets at `1254x1254` despite the requested composition size. The final files were reconstructed deterministically:

- split each source proportionally into four columns and four rows;
- remove green or magenta chroma and despill key-dominant pixels;
- remove isolated neighboring-cell fragments while retaining the main subject, attacks and all three squad members;
- use one sheet-wide nearest-neighbor scale so identity and pixel clusters remain coherent;
- center horizontally and bottom-align inside each final `256x256` cell;
- cap the occupied bounds at `232x232`, producing a minimum 12 px guard;
- write RGBA8 PNG and explicitly zero RGB wherever alpha is zero.

The final pixel-art edge model is binary alpha: visible pixels are alpha 255 and empty pixels are alpha 0. This avoids semi-transparent chroma fringes and hidden RGB.

## Deliverables And Automated QA

| File | Size/mode | Cells | Unique | Min guard | Hidden RGB | Chroma residue |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `heroes/heavy-metal-2000/julie-hm2000.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `heroes/heavy-metal-2000/odin-hm2000.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `heroes/heavy-metal-2000/zeek-hm2000.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `bosses/heavy-metal-2000/tyler-s-space-pirate.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `bosses/heavy-metal-2000/uroboris-reptilian-gladiator.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `bosses/heavy-metal-2000/tyler-s-citadel-assault-squad.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `bosses/heavy-metal-2000/odin-arakacian-revealed.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `bosses/heavy-metal-2000/tyler-loc-nar-tyrant.png` | 1024x1024 RGBA8 | 16/16 | 16/16 | 12 px | 0 | 0 |

Automated checks also confirmed four transparent corners, no PNG text chunks, no empty frame, no duplicate frame, no exact key pixels and no strongly saturated key-color residue in visible pixels.

## Manual Visual QA

- Julie retains the film-specific face, long dark hair, burgundy/black combat suit, gray armor, bandolier, pistols and sword.
- Odin remains the masked Uroboris sage rather than a Viking or generic wizard.
- Zeek remains the small orange-brown stone ally and is absent from the boss directory.
- The pirate is a single regular crewman; Tyler remains reserved for the boss sheet.
- The revised reptilian has a complete tail and complete poleaxe in every applicable frame.
- The squad contains exactly the same three members in every cell.
- Revealed Odin retains six eyes, blue forehead crystal, four chin prongs, gaunt alien anatomy, robe remnants, staff and whip.
- Tyler remains human and recognizable under the spiked armor, cleaver and green Loc-Nar energy.
- All rows read as idle, movement, attack and damage/death; no text, logo, watermark, scenery or visible grid remains.

## Result

PASS. The corrected final pack contains three heroes, three enemies and two lore-valid bosses. Zeek is preserved only as an ally; Odin's revealed Arakacian form is the replacement boss. All temporary generation, reference and normalization files were removed after verification.
