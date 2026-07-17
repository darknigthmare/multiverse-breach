# Aliens 1986 Hadley's Hope Stage Pack - 2026-07-17

## Scope

Complete OpenAI ImageGen environment pack for the `Aliens` profile in
`src/game/stageLoreProfiles.js`.

Canonical location lock:

> Hadley's Hope Operations and Atmosphere Processor access.

This pack is deliberately separated from `Alien` (1979): it uses LV-426
colony modules, Operations architecture, service gantries, storm-wall density
and the Atmosphere Processor. It does not reuse the Nostromo visual language.

All outputs are original fan-made game backgrounds. References were used to
identify the location, production-design language and industrial layout, not
to copy official frames, concept art, logos or source assets.

## References

1. [20th Century Studios - Aliens](https://www.20thcenturystudios.com/movies/aliens)
   - Official film identity, 1986 setting and production context.
2. [Hadley's Hope reference and production notes](https://avp.fandom.com/wiki/Hadley%27s_Hope)
   - Colony modularity, Operations/interior continuity, storm-wall layout and
     the relationship between the colony and the Atmosphere Processor.
3. [Atmosphere Processor production reference](https://weyland.fandom.com/wiki/Atmosphere_Processor)
   - Processor scale, cooling pipes, gantries and industrial service structures.
4. [Aliens production-design auction catalogue](https://content.propstore.com/auction/EMLA%20LA/EMLA-LA2020_Catalog_OnlineView_B2.pdf)
   - Operations concept and Atmosphere Processor production-design references.

## Outputs

| File | Dimensions | Format | Alpha | Gameplay use |
| --- | ---: | --- | --- | --- |
| `public/backgrounds/lore-stages/aliens/combat.webp` | 1536x864 | WebP | No | Strict side-view duel floor |
| `public/backgrounds/lore-stages/aliens/melee.webp` | 1536x864 | WebP | No | Side-view platform-arena environment |
| `public/backgrounds/lore-stages/aliens/melee-backdrop.webp` | 1536x864 | WebP | No | Distant Melee parallax layer |
| `public/backgrounds/lore-stages/aliens/melee-platforms.webp` | 1536x1024 | WebP RGBA | Yes | Modular platform tops, faces, caps and damage variants |
| `public/backgrounds/lore-stages/aliens/rpg.webp` | 1536x864 | WebP | No | Side-view 2.5D RPG battle lane |
| `public/backgrounds/lore-stages/aliens/tactics.webp` | 1536x864 | WebP | No | Elevated three-quarter tactical battlefield |
| `public/backgrounds/lore-stages/aliens/tactics-tiles.webp` | 1536x1024 | WebP RGBA | Yes | Modular Tactics cells, cover, vents and rubble |

Scene images were exported as WebP quality 94. Atlas backgrounds were removed
with the local chroma-key helper, then saved with real alpha.

## Final prompt set

### Combat

```text
Original, lore-faithful 32-bit pixel-art environment for Aliens (1986),
Hadley's Hope on LV-426, specifically the exterior Operations complex opening
toward the Atmosphere Processor access route. Use modular colony blocks,
brutalist industrial corridors, storm wall, heavy processor ducting, gantries,
maintenance structures, wet metal and dusty gray-brown LV-426 weather. Strict
side-view 16:9. One continuous flat heavy-metal industrial floor spans the
bottom 22 percent edge to edge. Keep the central 55 percent open and low
contrast for a 1v1 duel. Push props and major architecture to the far sides or
the distant background. Detailed hand-clustered 32-bit pixel art. No
characters, xenomorphs, creatures, human silhouettes, vehicles, weapons,
text, logos, watermark, UI, grid, floating platforms, holes or stairs in the
center. Never use the Nostromo from Alien 1979.
```

### Melee

```text
Original, lore-faithful 32-bit pixel-art Hadley's Hope Operations and
Atmosphere Processor access corridor from Aliens (1986). Strict side-view
platform-brawler environment. Keep only a low uninterrupted base floor in the
bottom 12 percent and leave the central two-thirds open for runtime platforms
and fighters. Frame the extreme left and right with Operations walls, airlocks,
processor machinery and service gantries. Put colony modules and processor
structures in the distant layer. No baked floating platforms, suspended
ledges, center bridges, stairs, holes, collision blocks or gameplay geometry.
No characters, xenomorphs, creatures, silhouettes, vehicles, weapons, text,
logos, watermark, UI or grid. Never use the Nostromo.
```

### Melee backdrop

```text
Original, lore-faithful 32-bit pixel-art distant panorama of Hadley's Hope on
LV-426 from Aliens (1986), across Operations toward the Atmosphere Processor.
Strict side-view 16:9 distant parallax only. Show modular colony blocks,
storm wall, repeating industrial structures, processor heat exchangers, pipe
bridges and overcast LV-426 dust clouds. Keep the central 60 percent subdued;
place nearest structures only in the outer 12 percent on both sides. No
playable floor, walkway, ledge, center bridge, platform or collision surface.
No characters, xenomorphs, creatures, silhouettes, vehicles, weapons, text,
logo, watermark, UI or grid.
```

### Melee platform atlas

```text
Clean modular side-view 32-bit pixel-art platform atlas matching Aliens (1986)
Hadley's Hope Operations and Atmosphere Processor construction: dark gunmetal,
worn wet steel grating, orange hazard paint kept abstract, riveted edges,
hydraulic trim and pale maintenance-light strips. Include isolated long,
medium and short perfectly level platforms, repeating top strips, front faces,
left/right end caps, undersides, corner braces, grated catwalk edge and damage
variants. Arrange with generous spacing on a perfectly flat #ff00ff chroma-key
background for local removal. No scenery, characters, xenomorphs, vehicles,
text, labels, logos, watermark or UI.
```

### RPG

```text
Original, lore-faithful 32-bit pixel-art RPG battlefield for Aliens (1986),
Hadley's Hope, using the Operations building access and Atmosphere Processor
service approach. Wide 16:9 side-view 2.5D camera. Broad shallow battle plane
in the lower 32 percent, one unobstructed central horizontal lane across at
least 70 percent of the width, low foreground lip and four readable depth
bands: foreground grating, open battle lane, Operations/processor boundary,
distant colony machinery and storm. Keep large props at the edges or distant
back line. No characters, xenomorphs, creatures, silhouettes, vehicles,
weapons, readable text, logos, watermark, UI, grid, platforms, high foreground
objects, stairs or holes in the lane.
```

### Tactics

```text
Original, lore-faithful 32-bit pixel-art tactical battlefield for Aliens
(1986), Hadley's Hope, at the elevated Operations-to-Atmosphere-Processor
service approach. Wide 16:9 elevated three-quarter front view, never overhead
and never diamond-isometric. A frontal rectangular/trapezoidal industrial yard
occupies the lower 65 percent; lower rows are visibly nearer and wider. Keep a
broad central traversal lane. Add only low side/rear cover: equipment crates,
a low service barrier and a pipe junction. Do not draw any grid, cell lines,
diamonds, coordinates or UI; the exact 8x6 grid is composited by the game.
No characters, xenomorphs, creatures, silhouettes, vehicles, weapons,
readable text, logos or watermark.
```

### Tactics tile atlas

```text
Clean 4-column by 3-row modular atlas of Aliens (1986) Hadley's Hope
Operations and Atmosphere Processor tiles in detailed 32-bit pixel art. Use
worn gunmetal floor, grated service steel, pale maintenance-light strips,
pipe-junction cover, low processor barriers, abstract hazard stripes, damaged
grating, vents, hatches and power conduits. Every tile uses the same elevated
three-quarter front-view trapezoidal perspective, never top-down square and
never 45-degree diamond. Include intact, cracked and wet metal cells, cover,
pipe junction, low crate, processor vent, hatch, damaged vent, conduit corner
and rubble variants. Isolate assets with generous spacing on flat #ff00ff
chroma-key. No characters, creatures, xenomorphs, text, labels, guide lines,
logos, watermark, UI or scenery.
```

## Validation

- All seven requested files exist under the `aliens` stage directory.
- Scene dimensions are exactly `1536x864`.
- Atlas dimensions are exactly `1536x1024`.
- Combat has an edge-to-edge continuous floor and a clear central duel lane.
- Melee has no baked floating platforms; its modular collision pieces are in
  the separate atlas.
- Melee backdrop contains no playable floor or collision surface.
- RPG keeps the central battle lane free and readable.
- Tactics uses elevated three-quarter perspective and leaves the exact grid to
  runtime compositing.
- Both atlases have real RGBA alpha with transparent pixels and no visible
  magenta residue after inspection.
- Visual inspection found no characters, xenomorphs, readable text, logos,
  watermark or baked UI.

## Repository scope

Only the seven requested background assets and this audit report were added.
No JavaScript, JSON, prompt manifest, gameplay registry, commit, push or deploy
was performed for this stage pack.
