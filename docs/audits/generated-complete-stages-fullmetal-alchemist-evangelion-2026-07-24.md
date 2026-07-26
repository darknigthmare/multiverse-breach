# Complete OpenAI Stage Packs: Fullmetal Alchemist and Neon Genesis Evangelion - 2026-07-24

## Scope

This audit covers two complete original fan-made pixel-art stage packs made
with one distinct built-in OpenAI ImageGen call per final resource:

- `public/backgrounds/lore-stages/fullmetal-alchemist/`
- `public/backgrounds/lore-stages/neon-genesis-evangelion/`

Each universe contains the seven files required by the current House of the
Dead stage contract. This task did not edit JavaScript, regenerate
`generatedStageAssets.json`, `sprite-manifest.json`, or
`openai-sprite-prompts.jsonl`, and did not commit, push, or deploy.

Official and documented visual references were consulted before generation.
They were used to identify canon locations, architectural massing, materials,
palette, and continuity. No screenshot, production background, official
texture, logo, or game-ready asset was copied into the project.

## Continuity Locks

### Fullmetal Alchemist

- Continuity: Hiromu Arakawa manga and the 2009 `Fullmetal Alchemist:
  Brotherhood` adaptation.
- Primary locations: Central Command, Research Laboratory Five, and Fort
  Briggs.
- Excluded: location changes and Laboratory Five chimera material specific to
  the 2003 anime.
- Visual language: early-20th-century European military masonry, iron, riveted
  industrial machinery, restrained alchemical geometry, and the severe
  snowbound construction of Briggs.

### Neon Genesis Evangelion

- Continuity: the original 1995 TV series and `The End of Evangelion` (1997).
- Primary locations: fortified Tokyo-3, the GeoFront, NERV headquarters, and
  the Terminal Dogma access levels.
- Excluded: every Rebuild-specific structure, machine, costume, color system,
  and post-Near-Third-Impact design.
- Visual language: retractable armored city towers, Hakone mountains,
  mid-1990s concrete megastructures, the subterranean GeoFront, amber mirror
  light, analog-industrial service decks, and dark Terminal Dogma construction.

## Canonical Reference Log

Research date: 2026-07-24.

### Fullmetal Alchemist official sources

1. Brotherhood Japanese official site:
   <https://www.hagaren.jp/fa/>
   - Official continuity and production identity.
2. Official Brotherhood story section, Briggs and Central underground:
   <https://www.hagaren.jp/fa/about/story03.html>
   - Briggs Fortress, its northern setting, and the Central Command
     underground continuity.
3. Official Brotherhood Promised Day story section:
   <https://www.hagaren.jp/fa/about/story05.html>
   - Central Command assault and Briggs forces at the headquarters.
4. Official Brotherhood character/location context:
   <https://www.hagaren.jp/fa/characters/index01.html>
   - Briggs as an elite northern fortress beyond Northern Command.
5. Fullmetal Alchemist Brotherhood USA official episode 8 page:
   <https://fullmetalalchemistusa.com/story/08.html>
   - Official Laboratory Five episode context.

### Fullmetal Alchemist documented visual cross-checks

1. Central Command:
   <https://fma.fandom.com/wiki/Central_Command>
   - Symmetrical pale-stone headquarters, walls, moat, courtyard, and Central
     City relationship.
2. Laboratory Five:
   <https://fma.fandom.com/wiki/Laboratory_5>
   - Perimeter walls, prison adjacency, dim interior, traps, and abandoned
     military-laboratory construction.
3. Fort Briggs:
   <https://fma.fandom.com/wiki/Fort_Briggs>
   - Mountain-wall silhouette, dark fortress materials, snow, and Drachman
     border orientation.

### Evangelion official sources

1. Evangelion official original TV-series announcement:
   <https://www.evangelion.jp/news/neongenesis_tv/>
   - Explicit original `Neon Genesis Evangelion` TV continuity lock.
2. GKIDS official `The End of Evangelion` page:
   <https://gkids.com/films/end-of-evangelion/>
   - Official 1997 film identity and its relationship to the original TV
     ending.
3. Evangelion official franchise site:
   <https://www.evangelion.jp/>
   - Official franchise provenance used only to separate TV/EoE material from
     Rebuild material.

### Evangelion documented visual cross-checks

1. Tokyo-3:
   <https://evangelion.fandom.com/wiki/Tokyo-3>
   - Fortified city, retractable buildings, deserted streets, and Hakone
     geography.
2. GeoFront:
   <https://evangelion.fandom.com/wiki/GeoFront>
   - Hemispherical cavern, artificial lake and forest, NERV pyramid, armored
     ceiling, and the inverted city structures.
3. Terminal Dogma:
   <https://evangelion.fandom.com/wiki/Terminal_Dogma>
   - Deepest restricted level and its relationship to NERV headquarters.
4. NERV:
   <https://evangelion.fandom.com/wiki/NERV>
   - Headquarters position at the bottom of the GeoFront.
5. GeoFront construction cross-check:
   <https://wiki.evageeks.org/Gehirn>
   - Original-series organization responsible for NERV headquarters and
     Tokyo-3 construction.
6. Artificial Evolution Laboratory:
   <https://wiki.evageeks.org/Artificial_Evolution_Laboratory>
   - Pre-NERV research-complex and GeoFront construction context.

## Target-by-Target Research Lock

| Universe | Target | Canon visual focus |
| --- | --- | --- |
| Fullmetal Alchemist | `combat` | Central Command facade, moat, walls, lamps, and uninterrupted courtyard lane |
| Fullmetal Alchemist | `melee` | Open Fort Briggs defense yard, steel, stone, mountain breach, and clear lower floor |
| Fullmetal Alchemist | `melee-backdrop` | Distant snowbound Briggs massing and layered Drachman mountains |
| Fullmetal Alchemist | `melee-platforms` | Central masonry, Laboratory Five catwalks, and Briggs steel platforms |
| Fullmetal Alchemist | `rpg` | Laboratory Five stone-and-pipe interior with restrained alchemical floor glow |
| Fullmetal Alchemist | `tactics` | Central Command courtyard, low cover, frontal three-quarter 8x6 board |
| Fullmetal Alchemist | `tactics-tiles` | Central stone, Lab Five metal, Briggs snow/armor, and alchemical hazard cells |
| Neon Genesis Evangelion | `combat` | Tokyo-3 retractable towers, Hakone mountains, sunset, and level armored road |
| Neon Genesis Evangelion | `melee` | GeoFront service deck, pyramid, lake, forest, ceiling armor, and open airspace |
| Neon Genesis Evangelion | `melee-backdrop` | Distant GeoFront panorama, inverted city, mirror shafts, lake, and pyramid |
| Neon Genesis Evangelion | `melee-platforms` | Tokyo-3 roadway, launch rails, GeoFront catwalks, and Terminal Dogma armor |
| Neon Genesis Evangelion | `rpg` | Deep Terminal Dogma access chamber, dry deck, cables, shafts, and recessed orange liquid |
| Neon Genesis Evangelion | `tactics` | Tokyo-3 armored defense district with exact frontal three-quarter 8x6 board |
| Neon Genesis Evangelion | `tactics-tiles` | Road armor, cable hatch, launch ceramic, low cover, Dogma floor, and orange hazard |

## Shared Prompt and Safety Locks

All fourteen built-in ImageGen prompts specified:

- original fan-made, highly detailed 32-bit pixel art;
- intentional pixel clusters and readable gameplay materials;
- one mode-specific camera and composition per target;
- no direct recreation of an official screenshot or production asset;
- no character, person, soldier, pilot, Evangelion, Angel, creature, body,
  blood, weapon, readable text, letter, number, logo, UI, HUD, border, or
  watermark;
- clear lower gameplay lanes for Combat, Melee, and RPG;
- no baked floating platforms in `melee.webp`;
- no foreground collision surface in `melee-backdrop.webp`;
- strict original continuity locks for each universe.

The two transparent atlases per universe were generated against perfectly flat
solid magenta, with exact object counts and generous separation:

- `melee-platforms`: exactly six side-view, reachable platform sprites;
- `tactics-tiles`: exactly eight isolated floor, cover, or hazard assets.

## Output Contract

The following contract is identical for both universe folders:

| File | Dimensions | Mode | Gameplay role |
| --- | ---: | --- | --- |
| `combat.webp` | 1672x941 | RGB | Strict side-view duel floor with clear center lane |
| `melee.webp` | 1672x941 | RGB | Open arena with continuous lower floor and no baked platforms |
| `melee-backdrop.webp` | 1672x941 | RGB | Distant parallax scenery without collision floor |
| `melee-platforms.webp` | 1254x1254 | RGBA | Six separated side-view reachable platforms |
| `rpg.webp` | 1672x941 | RGB | Broad side-view/2.5D battle plane with left/right positions |
| `tactics.webp` | 1448x1086 | RGB | Frontal three-quarter board with exact 8x6 grid |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Eight separated tactical cells/covers/hazards |

RGB scenes were exported as WebP quality 94. RGBA atlases were exported as
lossless exact-alpha WebP.

## Tactics Grid Validation

Both final tactics boards were inspected at their native 1448x1086 resolution.

- Fullmetal Alchemist: the ImageGen scene returned eight columns and seven
  depth rows. Only the extra far row band was removed, then the scene was
  normalized back to 1448x1086. The final board has nine converging vertical
  boundaries and seven depth-compressed horizontal boundaries: exactly eight
  columns by six rows, or 48 cells.
- Neon Genesis Evangelion: the ImageGen scene returned the requested board
  directly. It visibly contains nine converging vertical boundaries and seven
  depth-compressed horizontal boundaries: exactly eight columns by six rows,
  or 48 cells.

Both boards remain frontal three-quarter views. They are neither top-down nor
diamond-isometric, and the larger near rows provide correct front/back unit
layering.

## Chroma and Alpha Processing

The four atlas sources were processed with the installed ImageGen
`remove_chroma_key.py` helper using:

- border auto-key sampling;
- soft matte;
- transparent threshold 12;
- opaque threshold 220;
- despill;
- one-pixel edge contraction.

Every fully transparent pixel was then normalized to RGB `0,0,0` before
lossless WebP export.

Final validation for all four RGBA atlases:

- dimensions: exactly 1254x1254;
- decoded mode: RGBA;
- alpha extrema: exactly 0-255;
- all four corners: alpha 0;
- transparent pixels with non-zero RGB: zero;
- opaque magenta pixels: zero;
- every expected atlas region contains substantial opaque content;
- no sprite is cropped, connected to another slot, or outside its assigned
  2x3 or 4x2 region.

## File-by-File Visual Inspection

| Universe | File | Result |
| --- | --- | --- |
| Fullmetal Alchemist | `combat.webp` | Pass: Central Command identity, strict side view, clear level lane |
| Fullmetal Alchemist | `melee.webp` | Pass: Briggs yard, open airspace, continuous reachable lower floor |
| Fullmetal Alchemist | `melee-backdrop.webp` | Pass: distant snowbound fortress depth, no collision floor |
| Fullmetal Alchemist | `melee-platforms.webp` | Pass: six isolated, physically reachable side-view platforms |
| Fullmetal Alchemist | `rpg.webp` | Pass: Laboratory Five identity and clear 2.5D battle positions |
| Fullmetal Alchemist | `tactics.webp` | Pass: Central courtyard, exact 8x6 grid, correct 3/4 layering |
| Fullmetal Alchemist | `tactics-tiles.webp` | Pass: eight isolated lore-aligned tiles/covers/hazard assets |
| Neon Genesis Evangelion | `combat.webp` | Pass: original-series Tokyo-3, strict side view, clear roadway |
| Neon Genesis Evangelion | `melee.webp` | Pass: GeoFront arena, open airspace, continuous service deck |
| Neon Genesis Evangelion | `melee-backdrop.webp` | Pass: deep GeoFront parallax and no foreground collision plane |
| Neon Genesis Evangelion | `melee-platforms.webp` | Pass: six isolated TV/EoE industrial platforms |
| Neon Genesis Evangelion | `rpg.webp` | Pass: Terminal Dogma access identity and clear battle plane |
| Neon Genesis Evangelion | `tactics.webp` | Pass: Tokyo-3 defense board, exact 8x6 grid, correct 3/4 layering |
| Neon Genesis Evangelion | `tactics-tiles.webp` | Pass: eight isolated TV/EoE-aligned tiles/covers/hazard assets |

No final asset contains readable text, a logo, UI, character, creature, body,
or watermark.

## Final Validation Result

Pillow decoded every final resource and verified the exact file set,
dimensions, modes, alpha range, transparent corners, hidden RGB condition, and
atlas-region occupancy.

| Universe | Files | Decode | Dimensions/modes | Alpha/chroma | Visual inspection |
| --- | ---: | --- | --- | --- | --- |
| Fullmetal Alchemist | 7/7 | Pass | Pass | Pass | Pass |
| Neon Genesis Evangelion | 7/7 | Pass | Pass | Pass | Pass |

Final result: **14/14 assets pass**. The work remains deliberately unregistered
for the parent integration task, as required by this assigned write scope.
