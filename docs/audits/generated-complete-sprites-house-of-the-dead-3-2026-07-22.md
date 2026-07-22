# Complete House of the Dead III sprite generation audit - 2026-07-22

## Scope

- Built-in OpenAI `image_gen` was used for every source atlas and for the targeted canonical palette correction to G.
- Exactly nine final runtime sprite sheets were added: three heroes and six enemy/boss sheets.
- The final assets are original project pixel art informed by canonical 2002 arcade/Xbox references. No official sprite, render, screenshot, scan, or model texture was copied into the runtime files.
- Only the nine requested PNG files and this audit were added. No manifest, `openai-sprite-prompts`, `generatedStageAssets`, JavaScript, or other universe file was edited for this task.
- No commit was created.

## Reference research

Primary official material and mirrors used before generation:

- Sega Xbox manual mirror, including story and character pages for Lisa and G: https://manualmachine.com/sega/houseofthedeadiii/10241552-user-manual/
- The House of the Dead III Perfect Guide record and scan index: https://thehouseofthedead.fandom.com/wiki/The_House_of_the_Dead_III_Perfect_Guide
- Official artwork index, including Lisa, G, Dan, Mark, Cain, Death, Fool, and Wheel of Fate: https://thehouseofthedead.fandom.com/wiki/Category:The_House_of_the_Dead_III_official_artwork
- Original character-model index, including all requested creatures and bosses: https://thehouseofthedead.fandom.com/wiki/Category:The_House_of_the_Dead_III_character_models

Target-specific cross-checks:

- Lisa official art and Perfect Guide scans: https://thehouseofthedead.fandom.com/wiki/Lisa_Rogan/Gallery
- G's HOTD3 age, gray hair, light-gray suit, blue shirt, and yellow tie: https://thehouseofthedead.fandom.com/wiki/G
- Dan's official art, model, prologue screenshots, and Perfect Guide page 47: https://thehouseofthedead.fandom.com/wiki/Dan_Taylor
- Mark official art and Perfect Guide creature listing: https://thehouseofthedead.fandom.com/wiki/List_of_creatures_in_The_House_of_the_Dead_III
- Japanese enemy guide with Sega-attributed Mark imagery: https://www.k-triggerhappy.com/hod3/enemy.html
- Rogan Commando uniform, dual knives, kicks, and reanimated role: https://thehouseofthedead.fandom.com/wiki/Rogan_Commandos
- Cain's plant-fusion and vine-whip behavior: https://gamefaqs.gamespot.com/ps3/649286-the-house-of-the-dead-iii/faqs/52102
- Death's security-guard silhouette, chain, cap, and skull-studded club: https://thehouseofthedead.fandom.com/wiki/Death
- Fool's giant sloth form, dark fur, pale face, orange paws, and climbing behavior: https://thehouseofthedead.fandom.com/wiki/Fool
- Wheel of Fate's pale metallic body, spiked wheel, chest core, and electrical attacks: https://thehouseofthedead.fandom.com/wiki/Wheel_of_Fate
- Final-game short SPAS-12-style shotgun identification: https://www.imfdb.org/wiki/The_House_of_the_Dead_III

The fan-maintained pages were used as indexes to official Sega/manual/Perfect Guide images and to corroborate animation behavior. The visual locks favored the official manual, promotional art, guide scans, and game models.

## Canon anchors

| Target | Reference-informed game-art lock |
|---|---|
| Lisa Rogan | Short blonde hair, orange sleeveless vest, black top, charcoal cargo trousers, boots, ID lanyard, short stockless pump shotgun. |
| G | Veteran gray-haired agent, light-gray waistcoat and trousers, blue shirt, yellow tie, black gloves and shoes, short stockless pump shotgun. |
| Dan Taylor | Living prologue commando in white-gray field uniform, black cap/vest/knee pads/thigh straps, radio, short stockless pump shotgun. |
| Mark | Shirtless bald common creature, gaunt pale body, red eyes, torn blue work trousers, claw and lunge attacks. |
| Rogan Commando | Reanimated private-division soldier, white-gray uniform and black tactical gear, dual combat knives, sprint/slash/kick actions. |
| Cain | Human-sized plant hybrid, bark armor, olive growths, root legs, pale face, one long thorny vine-whip arm. |
| Death | Massive facility security guard, pale rough body, cap, torn blue overalls, chest chain, oversized skull-studded club. |
| Fool | Giant dark-furred sloth/ape ceiling climber, pale cracked face, four long limbs, orange-brown three-clawed paws. |
| Wheel of Fate | Pale silver humanoid integrated with a segmented spiked mechanical wheel, horn-like head fins, cyan chest core and electricity. |

## Final prompt set

Every atlas used this shared production lock:

> Create one original 1024x1024 production pixel-art sprite atlas inspired by canonical HOTD3 visual attributes without copying an official asset. Use exactly four columns and four rows with sixteen logical cells, one complete consistent entity per cell, right-facing three-quarter presentation, coherent rows for idle, locomotion, attack/action, and hit/recovery, at least 24 px requested source padding, a perfectly flat removable chroma background, and no text, UI, scenery, grid, watermark, clipping, cross-cell content, detached props, or excess gore.

Target prompts then locked the appearance and row actions listed in the canon table. Heroes used shotgun-ready, run, aim/fire/recoil/pump, and reaction rows. Mark used shamble/lunge/claw actions; the commando used sprint, dual-knife slashes, and kick/recovery; Cain used stalking and vine-whip actions; Death used charge and club attacks; Fool used suspended climbing and claw attacks; Wheel of Fate used wheel motion, core charge, electrical attacks, shield, overload, and recovery.

Green chroma was used for every target except green/brown Cain, which used magenta. G received one built-in image edit that changed only the waistcoat/trousers to light gray and the tie to yellow while preserving the sixteen generated poses.

## Post-processing

1. Built-in `image_gen` returned square 1254x1254 chroma sources even though 1024x1024 was requested.
2. `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py` sampled each border key, applied a soft matte, and despilled the edges.
3. `scripts/normalizeGeneratedSpriteSheet.py` rebuilt every runtime atlas as 1024x1024 RGBA with sixteen 256x256 cells and a 12 px minimum transparent guard.
4. Strict-cell normalization was used for Lisa, Cain, Death, Fool, and Wheel of Fate. Component-aware normalization was used for G, Dan, Mark, and Rogan Commando to recover complete connected poses that crossed a source-cell boundary before recentering.
5. The normalizer rebuilt transparent pixels on zeroed RGBA canvases, removing source chroma and hidden RGB.

## Runtime QA

| Asset | Output | RGBA | Cells | Guard | Unique | Min frame diff | Key px | Hidden RGB | Partial alpha | SHA-256 prefix |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Lisa Rogan | `public/sprites/generated/heroes/house-of-the-dead-3/lisa-rogan-hotd3.png` | 1024x1024 | 16/16 | 12 px | 16 | 9.840 | 0 | 0 | 16258 | `9d4dbc884698` |
| G | `public/sprites/generated/heroes/house-of-the-dead-3/g-hotd3.png` | 1024x1024 | 16/16 | 12 px | 16 | 11.526 | 0 | 0 | 39588 | `07ae7c2dadeb` |
| Dan Taylor | `public/sprites/generated/heroes/house-of-the-dead-3/dan-taylor-hotd3.png` | 1024x1024 | 16/16 | 12 px | 16 | 11.330 | 0 | 0 | 47231 | `871ba6bce981` |
| Mark | `public/sprites/generated/bosses/house-of-the-dead-3/mark.png` | 1024x1024 | 16/16 | 12 px | 16 | 16.106 | 0 | 0 | 53165 | `8627989e49cb` |
| Rogan Commando | `public/sprites/generated/bosses/house-of-the-dead-3/rogan-commando.png` | 1024x1024 | 16/16 | 12 px | 16 | 15.761 | 0 | 0 | 55135 | `e4a387f04616` |
| Cain | `public/sprites/generated/bosses/house-of-the-dead-3/cain.png` | 1024x1024 | 16/16 | 12 px | 16 | 14.466 | 0 | 0 | 37418 | `f2f79d908750` |
| Death | `public/sprites/generated/bosses/house-of-the-dead-3/death.png` | 1024x1024 | 16/16 | 12 px | 16 | 16.000 | 0 | 0 | 20655 | `fa07077ed7b6` |
| Fool | `public/sprites/generated/bosses/house-of-the-dead-3/fool.png` | 1024x1024 | 16/16 | 12 px | 16 | 12.874 | 0 | 0 | 21856 | `cec44d3b9997` |
| Wheel of Fate | `public/sprites/generated/bosses/house-of-the-dead-3/wheel-of-fate.png` | 1024x1024 | 16/16 | 12 px | 16 | 16.262 | 0 | 0 | 47187 | `fd6060419bc2` |

QA interpretation:

- `144/144` logical cells are occupied.
- Every file is PNG RGBA, exactly 1024x1024, with alpha range 0-255.
- Every cell has at least 12 px transparent guard; no visible pixel touches or crosses a neighboring cell.
- All four corners are transparent in every atlas.
- Visible pixels matching the sampled source chroma within a 12-value per-channel tolerance: 0.
- Fully transparent pixels with non-zero hidden RGB: 0.
- Every atlas contains sixteen unique cell hashes, and every adjacent frame differs.
- Visual inspection confirmed complete silhouettes, stable identity and palette, readable animation progression, no text/UI/watermark/scenery, no mixed characters, and no excess gore.

## Result

PASS - exactly nine requested HOTD3 runtime sprite sheets generated, integrated, and verified. No commit was created.
