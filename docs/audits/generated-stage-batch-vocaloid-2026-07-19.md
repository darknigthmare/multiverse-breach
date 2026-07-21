# Pack de stages Vocaloid - 19 juillet 2026

## Perimetre

Pack complet de sept stages produit avec le mode integre OpenAI ImageGen pour
le profil `Vocaloid`.

Les fichiers finaux sont des compositions originales fan-made en pixel art
32-bit. Les references ont uniquement servi a etablir le langage de scene,
l'usage de la projection et l'organisation d'un quartier nocturne a grands
ecrans. Aucun decor officiel, photogramme, logo, personnage ou asset de scene
n'a ete copie dans le projet.

Chemin final :

`public/backgrounds/lore-stages/vocaloid/`

## References visuelles

- [Magical Mirai 2025 - After report](https://magicalmirai.com/2025/special_afterreport_en.html) :
  galerie officielle des concerts de Sendai, Osaka et Tokyo. Elle a servi de
  reference pour les structures de scene, les truss suspendus, les murs de
  lumiere, la profondeur de salle et la relation entre projection et eclairage.
- [Magical Mirai 2026 Tokyo - Ticket](https://magicalmirai.com/2026/tokyo_ticket_en.html) :
  la page officielle precise que des ecrans LED sont utilises pour la
  projection des virtual singers. Cette source a verrouille le principe d'un
  volume de projection central entoure d'ecrans et de projecteurs.
- [Shibuya City - DIG SHIBUYA 2024](https://www.city.shibuya.tokyo.jp/kusei/hodo/hodo-2023/20231219.html) :
  source municipale decrivant le programme `Shibuya Crossing Night Art`, avec
  diffusion synchronisee sur les grands ecrans autour du Scramble Crossing.
- [DIG SHIBUYA 2026 - SCREENS CONTEXTUALIZED](https://digshibuya.com/en/program/2807) :
  programme officiel de projection mapping sur les murs du PARCO Shibuya,
  utilise comme reference pour l'integration de lumiere abstraite dans une
  architecture urbaine nocturne.
- [GO TOKYO - Qfront](https://www.gotokyo.org/en/spot/366/index.html) :
  guide touristique officiel confirmant le role du grand ecran Q's Eye dans le
  paysage du Scramble Crossing. Seule l'idee d'un carrefour encadre de grands
  ecrans a ete retenue ; aucun batiment reel n'a ete reproduit.

## Direction originale

- Place de projection urbaine inventee, apres la pluie.
- Volume de projection cyan vide et central.
- Truss noirs, projecteurs, enceintes, cables et ecrans abstraits.
- Palette charbon, cyan, turquoise, rose vif retenu, blanc et ambre.
- Architecture japonaise metropolitaine suggerant Shibuya sans reproduire un
  lieu, une facade ou un panneau existant.
- Aucun personnage, chanteur, silhouette, visage, public ou instrument.
- Aucun texte lisible, pseudo-texte, lettre, nombre, glyphe, logo, UI ou HUD.

## Methode ImageGen

1. generation d'un Combat servant d'ancre de palette et de materiaux ;
2. generations distinctes pour Melee, backdrop, RPG et Tactics avec l'ancre
   uniquement comme reference de continuite ;
3. generation separee des deux atlas sur chroma uniforme `#00FF00` ;
4. detourage avec le helper officiel `remove_chroma_key.py`, matte adouci et
   despill ;
5. export WebP lossless avec l'option exacte de preservation RGBA ;
6. remise a zero du RGB sous chaque pixel totalement transparent ;
7. suppression de toutes les sources ImageGen et de la planche de controle.

Deux premiers essais de sauvegarde ont produit des fichiers locaux a zero octet
pendant une saturation disque. Ils ont ete rejetes et supprimes avant toute
utilisation. Aucun fichier vide ou intermediaire n'est conserve dans le pack.

## Prompts ImageGen finaux

### Combat

```text
Use case: stylized-concept
Asset type: 2D fighting-game stage background, Vocaloid universe, COMBAT master environment
Primary request: Create an original fan-made high-detail 32-bit pixel-art night environment inspired only by the visual language of Magical Mirai concert staging and Shibuya projection-mapping / synchronized giant-screen cityscapes. Do not recreate any real venue, photograph, stage, billboard, building facade, logo, or official asset.
Scene/backdrop: an empty futuristic urban projection plaza at night, where a broad concert stage merges into an invented scramble-crossing district. Center a large transparent cyan projection prism with no projected performer inside it. Surround it with black steel trusses, suspended moving lights, stacked speaker walls, cable bridges, compact laser housings, abstract waveform light bars, rain-darkened glass towers, elevated rail silhouettes, and multiple giant city screens showing only abstract cyan, magenta, white and warm-yellow geometric pulses. Wet pavement reflects the lights. The architecture feels recognizably Japanese metropolitan and virtual-music focused, yet entirely original.
Style/medium: polished cinematic 32-bit pixel art, crisp hand-placed pixel clusters, deliberate limited-color ramps, readable hard-surface detail, subtle bloom that does not blur the pixel structure.
Composition/framing: wide 16:9 landscape, strict side-on 1v1 fighting-game camera. One continuous flat playable duel floor spans the full bottom 22 percent from left edge to right edge. Keep the central 60 percent unobstructed. No step, pit, rail, prop, crowd barrier or platform interrupts the floor. Keep the full projection prism and major screens visible.
Lighting/mood: energetic virtual concert after rain, deep charcoal city, cyan and turquoise projection light, restrained hot pink accents, white strobes and small amber street lights.
Constraints: empty environment only. No human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, shadow shaped like a person, instrument, readable text, pseudo-text, letter, number, Japanese glyph, logo, trademark, emblem, UI, HUD, watermark, border. Screens contain unlabeled abstract geometry only. Do not include a cyan-haired figure or any recognizable Vocaloid character. No official Magical Mirai or Shibuya asset copied.
```

### Melee

```text
Use case: stylized-concept
Asset type: side-view platform-fighter stage background, Vocaloid universe, MELEE environment
Input image: the provided Combat environment is a visual-continuity reference only for its original urban projection plaza, transparent cyan projection prism, invented night-city architecture, black concert trusses, abstract screens, wet materials, cyan/hot-pink/amber palette, and polished 32-bit pixel-art finish. Create a new wider composition; do not copy the exact layout.
Primary request: Build an empty fan-made Melee arena in the same original Vocaloid-inspired projection district, merging Magical Mirai-like concert technology with a Shibuya-like city projection plaza while copying no official place or asset.
Scene/backdrop: show the projection prism farther back and slightly higher, framed by deep city towers, elevated rail structures, hanging light rigs, speaker columns, compact projector housings, rain haze, and giant screens with only abstract waveform bars and geometric pulses. The plaza must feel broader and deeper than Combat.
Style/medium: polished high-detail 32-bit pixel art with crisp pixel clusters and controlled bloom.
Composition/framing: wide 16:9 strict side-on platform-fighter camera. Keep at least 72 percent of the central airspace and the entire lower 44 percent visually open for runtime platforms. A thin dark floor strip may touch only the bottom edge. Paint no floating platform, ledge, balcony, stair, bridge, catwalk, ramp, riser, railing, obstacle, gameplay prop or collision shelf in the central/lower playable area. Background architecture stays distant and cannot read as a platform.
Lighting/mood: energetic night concert after rain; deep charcoal, cyan/turquoise, restrained hot pink, white and amber.
Constraints: empty environment only. No human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, person-shaped shadow, instrument, readable text, pseudo-text, letters, numbers, Japanese glyphs, logo, trademark, emblem, UI, HUD, watermark, border. No recognizable Vocaloid character and no copied Magical Mirai or Shibuya asset.
```

### Melee backdrop

```text
Use case: stylized-concept
Asset type: distant parallax backdrop for a side-view platform-fighter stage, Vocaloid universe, MELEE BACKDROP
Input image: use the provided Melee environment only to preserve the original invented projection district, cyan prism, rain-lit city materials, black stage trusses, abstract giant screens, cyan/hot-pink/amber palette and 32-bit pixel-art rendering. Create a distinct deeper panorama, not the same composition.
Primary request: Create an original fan-made distant city-concert backdrop inspired by Magical Mirai stage technology and Shibuya nighttime projection culture, without reproducing any official site or photograph.
Scene/backdrop: the empty transparent projection prism is much farther away in the upper-middle distance, nested between invented high-rise facades, elevated rail lines, suspended trusses, cable bundles, small projector banks, speaker arrays and giant digital walls that display only abstract waveform bands, equalizer columns, grids and geometric light pulses. Add rain haze and layered depth.
Style/medium: polished cinematic high-detail 32-bit pixel art, crisp clusters, controlled glow, deep atmospheric perspective.
Composition/framing: exact wide 16:9 landscape, strict side view. Backdrop only. No foreground floor, no stage lip, no playable platform, no floating ledge, no balcony, no catwalk, no stair, no ramp, no bridge, no obstacle and no collision silhouette. Leave the entire lower 38 percent dark, atmospheric, low-contrast and visually quiet for runtime foreground layers. Keep major architecture above that zone.
Lighting/mood: nocturnal electronic concert city after rain; charcoal, cyan, turquoise, restrained hot pink, white pin lights and small amber lamps.
Constraints: no human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, person-shaped shadow, instrument, readable text, pseudo-text, letter, number, Japanese glyph, logo, trademark, emblem, UI, HUD, watermark or border. No copied Magical Mirai or Shibuya asset.
```

### Melee platforms

```text
Use case: stylized-concept
Asset type: transparent sprite atlas of platform-fighter collision platforms, Vocaloid universe, MELEE PLATFORMS
Input image: use the provided Combat environment only for the original invented projection-plaza materials, black concert trusses, speaker housings, cyan/turquoise light, hot-pink accents, white strobes, small amber lights and crisp 32-bit pixel-art finish. Do not include the city scene.
Primary request: Create exactly eight separate side-view platform modules for this original fan-made virtual-music city stage: two long black steel-truss decks with cyan light seams, two medium translucent projection-glass decks with hard metal frames, two short speaker-array decks, one narrow suspended cable-light bridge, and one compact projector-riser platform. Every module has a straight horizontal playable top and a clearly readable hard underside.
Style/medium: polished high-detail 32-bit pixel-art sprite atlas, strict orthographic side view, crisp pixel clusters, no soft illustration.
Composition/framing: exact square 1254 x 1254. Arrange exactly four horizontal rows of two isolated platforms, with generous equal gutters. Every platform must be fully visible, uncropped, non-overlapping and separated from all others by a wide band of background. No platform may touch an image edge. No connected scene and no floor.
Background: perfectly flat solid pure #00FF00 chroma green across every background pixel. No gradient, texture, lighting variation, reflection, cast shadow, contact shadow, floor, border, transparency or antialias halo in the green field. Do not use green anywhere in the platform objects.
Constraints: no human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, instrument, readable text, pseudo-text, letters, numbers, Japanese glyphs, logo, trademark, emblem, UI, HUD, watermark. Abstract unlabeled waveform-light details are allowed. No copied official asset.
```

### RPG

```text
Use case: stylized-concept
Asset type: 2.5D RPG battle background, Vocaloid universe, RPG environment
Input image: use the provided Combat image only to preserve the original invented urban projection plaza, empty cyan projection prism, black concert trusses, speaker towers, abstract giant screens, rainy city materials, cyan/hot-pink/amber palette and polished 32-bit pixel-art finish. Create a new RPG layout, not the same camera or composition.
Primary request: Create an original fan-made virtual-music battle plaza inspired by Magical Mirai concert technology and Shibuya nighttime projection culture, with no official asset copied.
Scene/backdrop: a broad modular wet stage deck occupies the foreground and middle ground. The empty transparent projection prism stands centered far behind it, surrounded by invented high-rise facades, suspended trusses, projector banks, cable bundles, speaker walls, abstract waveform light strips and giant screens with unlabeled geometric pulses. The city recedes in rain haze.
Style/medium: polished cinematic high-detail 32-bit pixel art, crisp clusters, readable hard surfaces and controlled glow.
Composition/framing: wide 16:9 landscape with a shallow elevated frontal three-quarter 2.5D RPG camera, looking down about 15 to 20 degrees; never top-down and never diamond-isometric. The dark modular battle deck fills about the lower 48 percent and recedes gently toward the prism. It is one broad uninterrupted playable floor with clear placement zones at left, center, right, front and rear. Keep the central 72 percent free. No visible gameplay grid, platform, step, pit, rail, barrier or prop crosses the battle floor. Preserve a clean low-contrast zone along the bottom for combatants and effects.
Lighting/mood: energetic electronic night after rain, charcoal, cyan/turquoise, restrained hot pink, white strobe accents and small amber lamps.
Constraints: empty environment only. No human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, person-shaped shadow, instrument, readable text, pseudo-text, letter, number, Japanese glyph, logo, trademark, emblem, UI, HUD, watermark or border. No recognizable Vocaloid character and no copied Magical Mirai or Shibuya asset.
```

### Tactics

```text
Use case: stylized-concept
Asset type: tactical battle map background, Vocaloid universe, TACTICS environment
Input image: use the provided RPG environment only to preserve the original invented projection plaza, empty cyan projection prism, rain-dark modular deck, black concert trusses, abstract screens, cyan/hot-pink/amber palette and crisp 32-bit pixel-art materials. Generate a new tactical board and camera.
Primary request: Create an original fan-made tactical battlefield inspired by Magical Mirai concert technology and Shibuya nighttime projection culture, without copying any official stage, photograph, city facade, logo or asset.
Scene/backdrop: a broad rectangular modular concert deck sits in front of the distant empty projection prism. Around it are invented city towers, speaker columns, suspended trusses, projector housings, cable banks and abstract digital screens. Keep all background architecture behind the playable board.
Style/medium: polished high-detail 32-bit pixel art, crisp clusters, readable rectangular cells, controlled glow.
Composition/framing: exact 1448 x 1086 landscape. Elevated frontal three-quarter tactical camera looking down about 30 to 35 degrees. Never top-down and never diamond-isometric. One large rectangular board fills the lower two-thirds and remains fully visible with all four corners in frame. The board contains approximately 8 columns by 6 rows of rectangular quadrilateral cells: nine continuous left-to-right boundaries and seven continuous near-to-far boundaries, about 48 cells total. The near row is visibly closer and larger than the far row. Cell seams are thin cyan lines with restrained hot-pink and amber junction lights. Keep most cells empty. Place only four low black equipment-cover blocks on outer-edge cells, never in the center.
Lighting/mood: nocturnal electronic projection plaza after rain, charcoal, cyan/turquoise, restrained hot pink, white and amber accents.
Constraints: no hex cell, no diamond cell, no diagonal chessboard. No human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, person-shaped shadow, instrument, readable text, pseudo-text, letter, number, Japanese glyph, logo, trademark, emblem, UI, HUD, watermark or border. No copied Magical Mirai or Shibuya asset.
```

### Tactics tiles

```text
Use case: stylized-concept
Asset type: transparent sprite atlas of tactical floor tiles, covers and objective props, Vocaloid universe, TACTICS TILES
Input image: use the provided Tactics environment only for its elevated frontal three-quarter rectangular-board camera, rain-dark stage-deck materials, black truss construction, cyan/hot-pink/amber light seams and crisp 32-bit pixel-art finish. Do not include the full board or city scene.
Primary request: Create exactly twelve separate tactical elements for this original fan-made virtual-music projection plaza: four dark rectangular deck-floor tiles with distinct abstract cyan and hot-pink light-seam patterns; one reinforced amber objective tile without symbol; one cyan power-routing tile without symbol; two low black truss-cover barriers; one tall compact speaker/equipment-rack cover; one coiled cable hazard on a rectangular base; one dormant projector housing on a rectangular base; and one short access-ramp tile.
Style/medium: polished high-detail 32-bit pixel-art atlas. Every piece uses the same elevated frontal three-quarter perspective and coherent rectangular footprint; never top-down, never diamond-isometric.
Composition/framing: exact square 1254 x 1254. Arrange exactly three horizontal rows of four isolated pieces, with generous equal gutters. Every piece is fully visible, uncropped, non-overlapping and separated from every other piece by a wide background band. No connected board and no floor behind the pieces.
Background: perfectly flat solid pure #00FF00 chroma green across every background pixel. No gradient, texture, lighting variation, reflection, cast shadow, contact shadow, floor, border, transparency or green halo. Do not use green anywhere in the tactical elements.
Constraints: no hexagon, no diamond tile, no text label, no symbol that resembles a letter or number. No human, singer, musician, performer, character, mascot, audience, face, body, silhouette, hologram person, instrument, readable text, pseudo-text, letter, number, Japanese glyph, logo, trademark, emblem, UI, HUD, watermark. No copied official asset.
```

## Fichiers finaux

| Fichier | Dimensions | Mode | SHA256 |
| --- | ---: | --- | --- |
| `combat.webp` | 1672 x 941 | RGB | `8a9eff8da8b7cf2a6771b2a32b8d52d8f6b995ffeaac51b4a92f14537f6ab645` |
| `melee.webp` | 1672 x 941 | RGB | `b6886287c812642904eee81697e9a52220d7ffe52b37ff1b2570b15451243085` |
| `melee-backdrop.webp` | 1672 x 941 | RGB | `56b55391e2a77ba58e7fa044d9de1c12b608bf78493ef42096444cc7f88bbd74` |
| `melee-platforms.webp` | 1254 x 1254 | RGBA | `0b8092e0cc7db0c59d377a0324054080697c446b6c31ff30ef32b26227d06712` |
| `rpg.webp` | 1672 x 941 | RGB | `a320e6c7d8de106646ee439fe1a50bf7e7c92a6900e34bfc448492cc5cb0a7ff` |
| `tactics.webp` | 1448 x 1086 | RGB | `449c7c31b1a679c16e1b2da9cc82e75937d407c0504113296932b8c5d1b3629a` |
| `tactics-tiles.webp` | 1254 x 1254 | RGBA | `1ebd45f1abec7756690d656c84ecd521623afa90db58b01324f2c04bd4b908e6` |

## Controle final

- sept noms attendus et aucun fichier supplementaire dans le pack ;
- aucun fichier a zero octet ;
- cinq decors RGB aux dimensions exactes ;
- deux atlas RGBA aux dimensions exactes ;
- huit cellules de l'atlas Melee non vides ;
- douze cellules de l'atlas Tactics non vides ;
- alpha nul sur toutes les bordures des atlas ;
- RGB transparent nul sur tous les pixels dont l'alpha vaut zero ;
- aucun personnage, chanteur, visage, silhouette, texte, logo, UI ou watermark
  detecte lors du controle visuel ;
- sol Combat continu, espace Melee libre, zone basse RPG degagee et grille
  Tactics rectangulaire proche de 8 x 6 en vue trois-quarts.
