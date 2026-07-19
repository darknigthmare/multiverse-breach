# Pack world boss Alien 1979 / Silent Hill 1999 - 2026-07-19

## Scope

Production strictement limitee aux deux planches world boss suivantes :

| Univers | Boss | Sortie |
| --- | --- | --- |
| `Alien (1979)` | Kane's Son / Big Chap | `public/sprites/generated/bosses/alien-1979/kane-s-son-big-chap.png` |
| `Silent Hill (1999)` | Incubus | `public/sprites/generated/bosses/silent-hill/incubus.png` |

Aucun manifeste, registre de prompts, prompt global, fichier source, package, autre
asset ou fichier Git n'a ete modifie pendant ce lot.

Les deux planches sont du fan-art original genere avec l'outil OpenAI ImageGen
integre. Elles synthetisent des traits canoniques documentes sans copier, tracer,
decouper ou reutiliser un sprite, screenshot, modele, jouet, artwork ou asset
officiel.

## References ouvertes avant generation

### Kane's Son / Big Chap

- Reference principale demandee :
  [Xenopedia - Kane's Son](https://avp.fandom.com/wiki/Kane%27s_Son)
- Article canonique actuellement retourne par la recherche Xenopedia :
  [Xenopedia - The Alien (Xenomorph)](https://avp.fandom.com/wiki/The_Alien_%28Xenomorph%29)
- Reference de silhouette et de matiere :
  [Julien's Auctions - prototype translucent Big Chap](https://www.juliensauctions.com/en/items/71217/h-r-giger-s-original-prototype-translucent-big-chap-xenomorph-costume-display-from-alien)

Verrous retenus :

- Drone unique ne a bord du Nostromo, surnomme Kane's Son / Big Chap ;
- proportions humaines tres elancees du costume de 1979 ;
- dome cranien long, lisse et legerement translucide ;
- visage sans yeux, dents metalliques et inner jaw compacte ;
- cage thoracique, tuyaux et membres biomecaniques longs ;
- quatre tubes dorsaux fins et queue longue segmentee ;
- aucune crete Warrior, couronne de Queen, masse Praetorian ou anatomie
  Predalien.

### Incubus

- Reference principale demandee :
  [Silent Hill Wiki - Incubus](https://silenthill.fandom.com/wiki/Incubus)
- Galerie de controle :
  [Silent Hill Wiki - Incubus images](https://silenthill.fandom.com/wiki/Category%3AIncubus_images)
- Reference visuelle PS1 secondaire :
  [Silent Hill Memories - Silent Hill walkthrough](https://www.silenthillmemories.net/sh1/walkthrough_ru.htm)

Verrous retenus :

- boss final des fins Good / Good+ du premier `Silent Hill` ;
- tete aveugle de bouc ou taureau, deux longues cornes et petit bouc noir ;
- grandes ailes sombres plumees, bras minces et sabots caprins ;
- abdomen incomplet avec colonne exposee ;
- vol et foudre rouge comme capacites principales ;
- demon suspendu au-dessus d'un autel de pierre en feu ;
- aucune machine, armure, cable, arme, core, reacteur, forme Incubator ou
  anatomie du God de `Silent Hill 3`.

## Prompts OpenAI ImageGen

Mode utilise : outil OpenAI ImageGen integre, une generation distincte par boss.

### Prompt Kane's Son / Big Chap

```text
Use case: stylized-concept
Asset type: production world-boss sprite sheet for an existing pixel-art game engine
Primary request: Create one original fan-art 4 by 4 animation sprite sheet inspired by the creature called Kane's Son / Big Chap from Alien (1979). This must be a newly drawn interpretation based only on general canonical traits, not a copy or tracing of any official sprite, screenshot, promotional image, model sheet, toy pose, or existing artwork.
Canvas and grid: exactly 1024 x 1024. Conceptual grid is exactly 4 equal columns by 4 equal rows, each cell exactly 256 x 256, but DO NOT draw grid lines, borders, separators, guides, boxes, labels, numbers, text, logos, or UI. Place exactly one complete character pose centered in each of the 16 conceptual cells. Every pose and every attached effect must remain entirely inside its own 256 x 256 cell with at least 18 pixels of flat background padding on all four sides. Do not let tails, fingers, jaws, particles, or limbs cross cell boundaries. Keep all 16 sprites visually separate.
Backdrop: perfectly flat, solid #FF00FF chroma-key background over the entire canvas for later removal. One uniform color only: no floor, no cast shadow, no contact shadow, no reflection, no scenery, no vignette, no texture, no lighting variation. Do not use #FF00FF anywhere on the creature.
Subject lock: the same single Big Chap design in all 16 frames. Tall, unnaturally slender humanoid proportions matching the 1979 Nostromo creature; very long thin arms and legs; narrow shoulders and waist; black and gunmetal biomechanical exoskeleton with ribbed torso, organic hoses and sinews; one smooth elongated translucent smoky dome with subtle skull structure beneath; eyeless face; metallic teeth; compact secondary inner jaw; four slim dorsal tubes; long articulated hands; long segmented tapering tail with a small blade tip. Graceful, stalking, eerie silhouette. Keep identical anatomy, dome length, dorsal tubes, rib cage, hands, feet, tail segmentation, colors, and scale in every frame.
Strict exclusions: no ridged Warrior head, no Alien Queen crown, no Praetorian bulk, no Predalien mandibles or dreadlocks, no digitigrade monster bulk, no armor, no clothes, no weapons, no extra limbs, no egg, no facehugger, no gore, no crew member, no environment. It must read specifically as the elegant 1979 Big Chap, not any later Xenomorph caste.
Style and view: detailed handcrafted pixel art, semi-realistic 32-bit game sprite aesthetic, crisp hard pixel clusters, controlled limited palette, no painterly blur, no 3D render, no smooth vector art. Consistent right-facing three-quarter side view and consistent camera/scale across all cells. Full body visible in every frame, including tail tip.
Animation rows, with four genuinely different sequential frames per row:
Row 1, idle / ambush hover: 1 tall listening stillness, 2 slow inhale and slight dome tilt, 3 predatory lean with fingers flexing, 4 low shadow-like crouch ready to spring.
Row 2, stalking movement: 1 first long creeping step, 2 weight transfer with tail counterbalance, 3 second long step, 4 low accelerated stalk. Keep feet and tail clearly changing while preserving design.
Row 3, canonical lore attacks: 1 sudden ambush lunge, 2 inner jaw beginning to extend, 3 inner jaw fully striking but still inside the cell, 4 two-handed grab posture with coiling tail. No invented projectile or weapon.
Row 4, hit / defeat: 1 light recoil, 2 stronger torso impact reaction, 3 collapsing to one knee with tail slackening, 4 defeated curled fall, entire body and tail still visible and non-gory.
Quality constraints: exactly 16 occupied cells and no empty cell; real pose progression, not near-duplicates; no duplicate character within a cell; no cropped anatomy; no overlap between cells; no visual inconsistency; no words or symbols; no watermark.
```

### Prompt Incubus

```text
Use case: stylized-concept
Asset type: production world-boss sprite sheet for an existing pixel-art game engine
Primary request: Create one original fan-art 4 by 4 animation sprite sheet inspired specifically by the Incubus final boss from the original Silent Hill (1999) PlayStation game. This must be a newly drawn interpretation based only on general canonical traits, not a copy or tracing of any official sprite, screenshot, promotional image, model sheet, later-game artwork, or existing fan art.
Canvas and grid: exactly 1024 x 1024. Conceptual grid is exactly 4 equal columns by 4 equal rows, each cell exactly 256 x 256, but DO NOT draw grid lines, borders, separators, guides, boxes, labels, numbers, text, logos, or UI. Place exactly one complete boss pose centered in each of the 16 conceptual cells. Every pose, wings, horns, altar, flame and attack effect must remain entirely inside its own 256 x 256 cell with at least 18 pixels of flat background padding on all four sides. Keep all 16 sprites visually separate and never cross a cell boundary.
Backdrop: perfectly flat, solid #FF00FF chroma-key background over the entire canvas for later removal. One uniform color only: no room, no floor, no cast shadow, no reflection, no fog, no wall, no scenery, no vignette, no texture, no lighting variation. Do not use #FF00FF anywhere in the subject.
Subject lock: the same single Incubus design in all 16 frames, hovering immediately above the same compact low ritual altar/brazier with orange-red fire as one inseparable sprite unit. Dark emaciated baphomet-like winged demon; bull/goat-like eyeless head; exactly two long upward demonic horns; small black goatee; large paired dark feathered wings; thin humanoid arms with clawed hands; goat-like cloven hooves; decayed incomplete abdomen with the spine visibly bridging upper torso and pelvis; withered dark gray-brown flesh, black feathers, muted blood-red accents. Keep identical horns, eyeless head, goatee, wings, torso, exposed spine, arms, hooves, altar design, palette and scale in all 16 frames. The demon remains airborne above the flame altar except while falling in defeat.
Strict exclusions: no machinery, no mechanical parts, no cables, no armor, no weapon, no glowing chest core, no circular reactor, no Seal of Metatron object, no halo, no robes, no human face, no Incubator girl, no Pyramid Head, no Silent Hill 3 God anatomy, no pregnant belly, no giant female humanoid, no extra arms, no extra wings, no scenery. It must read as the original 1999 PS1 Incubus, not any Silent Hill 3 form or generic armored devil.
Style and view: detailed handcrafted pixel art, grim late-1990s survival-horror palette, semi-realistic 32-bit game sprite aesthetic, crisp hard pixel clusters and selective dithering, no painterly blur, no 3D render, no smooth vector art. Consistent right-facing three-quarter front view and consistent camera/scale across all cells. Full demon, both wing tips, both horns, both hooves and complete compact altar visible in every frame.
Animation rows, with four genuinely different sequential frames per row:
Row 1, idle / hover: 1 wings held wide in ominous hover, 2 slight upward bob with feathers lifting, 3 downward bob with arms tensing, 4 wings partially folding while altar flame flickers. Preserve the same altar and anatomy.
Row 2, flight / movement: 1 wings rising into upstroke, 2 powerful downstroke, 3 forward hover drift, 4 braking hover with hooves drawn back. Keep the altar directly beneath as a compact supernatural anchor and keep everything inside each cell.
Row 3, lore attacks: 1 red lightning charging between raised claws, 2 one compact jagged red lightning bolt cast downward and fully contained, 3 orange-red altar fire surging upward around the demon without obscuring its anatomy, 4 forceful wing blast shown with a few short dark-red air streaks. No machine-like energy, no core, no projectile launcher.
Row 4, hit / defeat: 1 light aerial recoil with feathers disturbed, 2 stronger hit with wings losing symmetry, 3 descending toward the altar with wings sagging, 4 defeated collapsed demon beside/over the dying altar flame, complete non-gory silhouette still visible.
Quality constraints: exactly 16 occupied cells and no empty cell; real pose progression, not near-duplicates; no duplicate demon within a cell; no cropped anatomy or wings; no overlap between cells; no visual inconsistency; no words, wing lettering, runes, symbols or watermark.
```

### Edition ciblee Incubus

Une edition ImageGen supplementaire a demande de remplacer les marques ambigues
des braisiers par de la pierre nue :

```text
Edit the most recent Incubus 4x4 sprite sheet only. Preserve the exact 1024x1024 layout, all 16 Incubus poses, anatomy, horns, wings, exposed spine, hooves, animation progression, lightning, fire, hit reactions, scale, cell placement, pixel-art style, and perfectly flat solid #FF00FF chroma background. Make one targeted correction only: on every one of the 16 compact altar/brazier bases, remove all red marks, inscriptions, runes, letters, logos, panel-like details, buttons, machinery cues, and decorative symbols. Replace each base with the same simple rough unadorned charred black stone altar/brazier, with only plain stone block texture and the existing orange-red flame. No text, no symbols, no mechanical panel, no machine, no core. Do not add grid lines, borders, shadows, scenery, or any new object. Keep every sprite and effect fully inside its own conceptual 256x256 cell.
```

Les marques residuelles ont ensuite ete neutralisees localement sur la seule bande
frontale de chaque autel, avec une texture de pierre sombre non figurative. La
silhouette du demon, les flammes vives, la grille d'animation et les effets ont ete
preserves.

## Pipeline de sortie

1. ImageGen a produit deux sources RGB carrees sur chroma magenta.
2. Le helper officiel
   `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
   a ete execute avec `--auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill`.
3. Les sources RGBA ont ete normalisees cellule par cellule vers `1024x1024`.
4. Les composants detaches utiles, dont les queues, impacts, eclairs, flammes et
   autels, ont ete rattaches a leur frame avant recentrage.
5. Chaque frame a ete redimensionnee au pixel le plus proche avec une marge
   finale minimale de 12 px.
6. Les pixels totalement transparents ont ete remis a RGB `0,0,0`.

## Layout d'animation

### Kane's Son / Big Chap

- Ligne 1 : idle, ecoute, respiration et embuscade basse ;
- ligne 2 : deplacement furtif et course basse ;
- ligne 3 : bond d'embuscade, sortie de l'inner jaw et saisie ;
- ligne 4 : hit leger, hit lourd, chute a genou et defeat.

### Incubus

- Ligne 1 : idle / hover avec battements retenus ;
- ligne 2 : montee d'aile, battement, vol et freinage ;
- ligne 3 : charge de foudre, eclair, feu d'autel et souffle d'ailes ;
- ligne 4 : hit leger, hit lourd, descente et defeat sur l'autel.

## Validation automatisee

| Controle | Kane's Son / Big Chap | Incubus |
| --- | ---: | ---: |
| Dimensions | 1024 x 1024 | 1024 x 1024 |
| Mode | RGBA | RGBA |
| Grille | 4 x 4 | 4 x 4 |
| Taille de cellule | 256 x 256 | 256 x 256 |
| Cellules occupees | 16 / 16 | 16 / 16 |
| Marge minimale | 12 px | 12 px |
| Plage alpha | 0..255 | 0..255 |
| Pixels alpha partiel | 87 223 | 92 735 |
| Coins transparents | 4 / 4 | 4 / 4 |
| Pixels visibles sur separateurs | 0 | 0 |
| Chroma magenta visible | 0 px | 0 px |
| RGB cache sous alpha 0 | 0 px | 0 px |
| Difference frames adjacentes min. | 8,56 | 9,91 |
| Difference frames adjacentes moy. | 11,72 | 15,15 |

SHA-256 :

- Kane's Son / Big Chap :
  `5D7C1306D97B2B71FBD903C5ADC23BD6955644CC2BCAF3E5B93169C569693822`
- Incubus :
  `0AA0397778EC225A6D9F5AE1F3A444DDB661418A89670AF612AFF9F079832E43`

## Inspection visuelle finale

Les deux PNG ont ete inspectes en transparence native, puis composites sur un
damier sombre avec les limites exactes des cellules superposees uniquement dans
l'image temporaire de controle.

Kane's Son / Big Chap :

- les seize frames montrent le meme Drone elance, sans changement d'anatomie ;
- le dome reste long, lisse et translucide, sans crete Warrior ;
- les membres, tubes dorsaux et la queue segmentee restent complets ;
- l'inner jaw et la saisie sont lisibles sans arme ou projectile invente ;
- aucune anatomie de Queen, Praetorian ou Predalien n'est presente.

Incubus :

- les seize frames conservent les memes deux cornes, ailes, sabots et colonne
  exposee ;
- le boss reste suspendu au-dessus du meme autel de pierre en feu ;
- la foudre, le feu et le souffle d'ailes restent dans leurs cellules ;
- la derniere frame montre une defeat non gore sur l'autel ;
- aucun texte, rune, logo, machine, cable, core, reacteur, armure ou forme de
  `Silent Hill 3` n'est present.

Controle commun :

- aucune ligne de grille, bordure, legende, numero, texte, logo ou watermark ;
- aucun decor de scene, sol, ombre portee ou second personnage ;
- aucune fuite de silhouette ou d'effet entre deux cellules ;
- variations reelles dans les quatre frames de chaque ligne.
