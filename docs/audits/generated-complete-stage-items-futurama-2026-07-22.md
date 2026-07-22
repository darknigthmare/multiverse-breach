# Pack complet OpenAI - Futurama

Date: 2026-07-22
Univers: Futurama
Lieu verrouille: hangar Planet Express et baie de livraison de New New York
Generation: OpenAI ImageGen integre, conversion locale Pillow et retrait de chroma
Perimetre: decors de stage et quatre objets d'inventaire uniquement

## Resultat

### Stage

Le dossier `public/backgrounds/lore-stages/futurama/` contient exactement les sept
fichiers demandes:

| Fichier | Dimensions | Mode Pillow | Usage |
| --- | ---: | --- | --- |
| `combat.webp` | 1672x941 | RGB | Combat lateral, sol continu et centre libre |
| `melee.webp` | 1672x941 | RGB | Decor Melee sans plateforme jouable integree |
| `melee-backdrop.webp` | 1672x941 | RGB | Fond Melee identique a `melee.webp` |
| `melee-platforms.webp` | 1254x1254 | RGBA | Six plateformes separees et transparentes |
| `rpg.webp` | 1672x941 | RGB | Vue RPG 2.5D et large voie centrale |
| `tactics.webp` | 1448x1086 | RGB | Plateau 8x6 complet en perspective trois-quarts |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Huit modules tactiques separes et transparents |

`melee.webp` et `melee-backdrop.webp` proviennent volontairement de la meme image.
Le moteur peut poser `melee-platforms.webp` au-dessus du fond sans doubler la
geometrie jouable.

### Objets

Le dossier `public/sprites/generated/items/futurama/` contient exactement les quatre
sorties declarees par le manifeste existant:

| Objet | Fichier | Dimensions | Mode Pillow |
| --- | --- | ---: | --- |
| Slurm Can | `slurm-can.png` | 512x512 | RGBA |
| Planet Express Badge | `planet-express-badge.png` | 512x512 | RGBA |
| Holophonor | `holophonor.png` | 512x512 | RGBA |
| Dark-matter Pellet | `dark-matter-pellet.png` | 512x512 | RGBA |

## References canoniques notees

Les sources ont servi uniquement a verrouiller le lieu, les silhouettes, les usages,
les materiaux et la palette. Aucun fichier officiel n'a ete copie dans le projet.

1. Hulu, page officielle de la serie et reference generale de production:
   https://www.hulu.com/series/futurama
2. The Infosphere, `Planet Express headquarters`:
   https://theinfosphere.org/Planet_Express_headquarters
   - Le siege se trouve sur la 57e rue, cote ouest de Manhattan, a New New York.
   - Le batiment comprend une tour, un hangar et une installation en bord de mer.
   - Le hangar est la piece principale, conserve le vaisseau Planet Express et peut
     incliner son sol pour aider au decollage.
   - Le hangar communique avec le laboratoire et la salle de conference.
3. The Infosphere, `Slurm`:
   https://theinfosphere.org/Slurm
   - Boisson gazeuse numero un du futur, verte et hautement addictive.
   - Premiere apparition dans `Space Pilot 3000`; episode central `Fry and the Slurm
     Factory`.
   - Le texte publicitaire et le logo canonique ont volontairement ete omis de
     l'icone.
4. The Infosphere, `Holophonor`:
   https://theinfosphere.org/Holophonor
   - Instrument du XXXIe siecle combinant un instrument a vent et un projecteur
     holographique.
   - Premiere apparition dans `Parasites Lost`.
5. The Infosphere, transcription de `Parasites Lost`:
   https://theinfosphere.org/Transcript%3AParasites_Lost
   - Le projecteur emet une lumiere bleu-vert depuis l'extremite de l'instrument.
6. The Infosphere, `Dark matter`:
   https://theinfosphere.org/Dark_matter
   - Carburant spatial produit par les Nibbloniens et utilise par les moteurs du
     vaisseau Planet Express.
   - Forme canonique: petite boule noire tres dense, d'environ un pouce de rayon.
7. SYFY, recap officiel de `Love's Labours Lost in Space`:
   https://www.syfy.com/futurama/season-1/blogs/episode-recap-loves-labours-lost-in-space
   - Confirme l'apparence de sphere noire brillante dans la litiere de Nibbler.
8. Wikimedia Commons, geometrie de l'embleme Planet Express:
   https://commons.wikimedia.org/wiki/File:Planet_Express_Logo.svg
   - Reference secondaire pour le cercle rouge, l'anneau creme et la fusee.
   - Le badge final est un objet original sans le lettrage ni une copie pixel pour
     pixel du logo.

## Verrou visuel commun

- Grand hangar industriel courbe, conduites apparentes, machines turquoise, grue
  orange et lampes de maintenance ambre.
- Fusee de livraison en retrait: coque vert menthe, nez creme, ailerons rouges et
  hublots ronds, sans logo ni texte.
- Baie ouverte sur des tours retro-futuristes colorees et des tubes de transport de
  New New York.
- Pixel art 32-bit detaille, amas de pixels nets, aucune finition 3D ou floue.
- Sols et plateformes lisibles pour le gameplay, avec les accessoires rejetes vers
  l'arriere ou les bords.
- Aucun personnage, silhouette, alien, robot, animal, texte lisible, logo copie,
  HUD, UI, watermark ou crossover.

## Prompts finaux

Les prompts ci-dessous consignent le contrat de production final. Les corrections
Tactics sont documentees separement car le comptage exact a ete valide par iteration.

### Combat

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop, Futurama Combat mode
Primary request: original canon-faithful high-detail pixel-art environment of the
Planet Express headquarters hangar opening onto a New New York delivery bay.
Scene: mint-green and red delivery rocket in a rear maintenance berth, curved steel
ribs, pipes, overhead crane, amber work lamps, teal machinery, unmarked parcels and
a glimpse of New New York tube transit and stacked towers.
Style: extremely detailed authentic 32-bit cinematic pixel art, crisp hand-placed
pixel clusters and nearest-neighbor edges.
Composition: strict side-view 16:9 camera, one continuous flat steel duel floor,
wide empty central 1v1 lane, props and ship kept in the rear plane or far edges.
Constraints: environment only; no character, text, logo, UI, watermark, baked
platform, damage, gore, smoke or explosion.
```

### Melee et Melee backdrop

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop, Futurama Melee mode
Primary request: matching Planet Express hangar backdrop with open vertical space
for separately rendered platforms.
Composition: strict side-view 16:9 platform-fighter camera, panoramic open center,
one thin continuous ground line only. No freestanding platform, floating ledge,
collision shelf, bridge, stair, ladder or ramp in the image.
Continuity: same hangar, rocket, skyline, palette, pixel density and lighting as the
Combat scene.
Constraints: environment only; no character, text, logo, UI or watermark.
```

### Plateformes Melee

```text
Use case: stylized-concept
Asset type: removable-chroma modular platform atlas, Futurama Melee mode
Primary request: exactly six separate side-view Planet Express platform modules in
a 3x2 atlas: riveted steel service deck, mint maintenance platform, locked cargo
conveyor, tube-transit maintenance deck, curved hangar-rib platform and reinforced
delivery loading platform.
Geometry: every module has a flat horizontal walkable top, distinct vertical front
edge, hard collision silhouette, generous padding and no overlap or crop.
Backdrop: one uniform solid #ff00ff chroma key, no shadow or reflection.
Constraints: platform assets only; no scene, character, vehicle, text, logo, UI or
watermark.
```

### RPG

```text
Use case: stylized-concept
Asset type: final 2D game environment backdrop, Futurama RPG mode
Primary request: matching Planet Express hangar and New New York delivery bay.
Composition: wide side-view 2.5D camera about 20 degrees above the floor, broad steel
battle lane, clear foreground/midground/background depth, unobstructed center for a
party on the left and enemies on the right, props behind combat positions.
Continuity: same rocket, curved hangar, machinery, city, palette and pixel-art style.
Constraints: environment only; no character, text, logo, grid, UI or watermark.
```

### Tactics

```text
Use case: stylized-concept
Asset type: final 2D game battlefield, Futurama Tactics mode
Primary request: Planet Express hangar battlefield with an exact rectangular 8x6
cell board in elevated three-quarter perspective.
Geometry: exactly nine longitudinal boundaries define eight columns; exactly seven
transverse boundaries define six rows. All 48 cells and the full trapezoidal board
perimeter remain visible with margins. Rear cells are smaller, front cells larger;
never top-down and never diamond-isometric.
Cover: a few outer-cell modules only: unmarked crates, low tool cabinet, pipe
manifold and raised service pad, without hiding boundary intersections.
Style: detailed crisp 32-bit pixel art with physical steel seams, no glowing overlay.
Constraints: environment only; no character, text, logo, coordinate, UI or watermark.
```

Corrections de comptage appliquees avec ImageGen:

1. Reduction du premier jet trop dense de dix vers huit colonnes.
2. Compression du plateau dans un trapeze entierement visible avec marges.
3. Conservation des huit colonnes et ajout d'une seule couture transversale dans la
   grande rangee avant, afin d'obtenir exactement six rangees.

### Tiles Tactics

```text
Use case: stylized-concept
Asset type: removable-chroma modular tile and cover atlas, Futurama Tactics mode
Primary request: exactly eight separate modules in a 4x2 atlas: steel floor cell,
worn service cell, amber conduit hazard, raised service pad, mint tool cabinet,
unmarked cargo stack, silver pipe manifold and turquoise delivery beacon.
Geometry: every base matches one rectangular cell in three-quarter perspective;
all modules are isolated, padded, uncropped and non-overlapping.
Backdrop: one uniform solid #ff00ff chroma key, no shadow or reflection.
Constraints: modules only; no scene, character, vehicle, text, logo, UI or watermark.
```

### Objets

```text
Slurm Can: exactly one unopened acidic-green retro-futurist can with silver pull tab,
abstract darker-green slime swirls, cream oval and red accent bands; no word, logo,
mascot, shadow or duplicate; solid #ff00ff chroma background.

Planet Express Badge: exactly one round physical enamel badge with burgundy center,
blank cream ring, charcoal rim and mint rocket with amber speed streaks; no lettering,
copied logo, shadow or duplicate; solid #ff00ff chroma background.

Holophonor: exactly one complete plum, brass and silver wind instrument/projector,
with keywork, mouthpiece, aqua dome, internal spiral and pink emitter lenses; no
external hologram, case, shadow or duplicate; solid #00ff00 chroma background.

Dark-matter Pellet: exactly one primarily black, compact spherical fuel pellet with
slightly irregular facets and restrained violet internal glints; not a gem, bomb,
planet or magic orb; no aura, container, shadow or duplicate; solid #00ff00 chroma
background.
```

## Pipeline chroma-key

Les deux atlas, Slurm Can et le badge ont ete generes sur `#ff00ff`. Le Holophonor et
la matiere noire ont ete generes sur `#00ff00` pour eviter les couleurs principales
des sujets.

Le retrait a utilise le helper installe:

```text
C:\Users\chuck\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py
--auto-key border
--soft-matte
--transparent-threshold 12
--opaque-threshold 220
--despill
```

Les sorties WebP RGBA ont ensuite ete reencodees en lossless avec conservation exacte
des pixels transparents. Les PNG d'items ont ete ramenes a 512x512 en RGBA, puis les
valeurs RGB sous alpha zero ont ete forcees a zero.

## Validation Pillow

Controle automatise final: `PASS (11/11 assets)`.

| Fichier | Alpha | Transparents | Partiels | Opaques | RGB sous alpha 0 | Chroma visible |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 0..255 | 1 142 818 | 10 377 | 419 321 | 0 | 0 |
| `tactics-tiles.webp` | 0..255 | 1 188 947 | 9 701 | 373 868 | 0 | 0 |
| `slurm-can.png` | 0..255 | 162 658 | 4 124 | 95 362 | 0 | 0 |
| `planet-express-badge.png` | 0..255 | 151 040 | 5 530 | 105 574 | 0 | 0 |
| `holophonor.png` | 0..255 | 216 737 | 15 760 | 29 647 | 0 | 0 |
| `dark-matter-pellet.png` | 0..255 | 170 378 | 3 833 | 87 933 | 0 | 0 |

- Les sept noms de stage attendus sont les seuls fichiers du dossier Futurama.
- Les quatre noms d'items attendus sont les seuls fichiers du dossier d'items.
- Les cinq scenes s'ouvrent en RGB aux dimensions demandees.
- Les deux companions s'ouvrent en RGBA 1254x1254.
- Les quatre items s'ouvrent en PNG RGBA 512x512.
- Le Holophonor a ete normalise a 32 px de garde minimale sans modifier son dessin.
- Les quatre coins de chaque image RGBA ont un alpha de zero.
- Aucun pixel de la couleur chroma correspondante n'est visible avec alpha superieur
  a 8.
- Aucun RGB non nul ne subsiste sous les pixels totalement transparents.
- `melee.webp` et `melee-backdrop.webp` ont le meme SHA-256:
  `6384dff1032b2e9db03fd8b8ff9a977ccf907cfe4db01e002d071c602bdf70d0`.

## Inspection visuelle

- Combat: sol continu, voie centrale large, accessoires aux bords et fusee en fond.
- Melee: centre et hauteur libres, aucune plateforme jouable cuite dans le decor.
- Plateformes Melee: six silhouettes separees, non rognees et a sommet marchable.
- RPG: perspective 2.5D, grande voie centrale et avant-plan bas.
- Tactics: plateau entierement dans le cadre, huit colonnes et six rangees, soit 48
  cellules, perspective trois-quarts rectangulaire et non isometrique en losanges.
- Tiles Tactics: huit modules separes en 4x2 et sans frange chroma visible.
- Slurm Can: objet unique, canette verte lisible, aucun texte ni logo copie.
- Badge: objet unique, cercle rouge/creme et fusee, anneau sans lettrage.
- Holophonor: objet unique, silhouette instrument/projecteur lisible et complete.
- Matiere noire: objet unique, sphere noire dense avec accents violets contenus.
- Aucun personnage, silhouette, alien, robot, animal, texte lisible, HUD, UI ou
  watermark observe.

## Integrite du perimetre

Aucun fichier JavaScript, JSX, JSON, manifeste, registre, configuration ou autre
univers n'a ete modifie par cette tache. Les changements preexistants du worktree ont
ete laisses intacts. Aucun commit, push ou deploiement n'a ete effectue.
