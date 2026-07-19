# Pack de heros Halo genere - 2026-07-19

## Perimetre

Production de sept feuilles de sprites Halo avec OpenAI ImageGen. Le pack contient
six generations uniques; `buck.png` est une copie binaire volontaire de
`buck-odst.png`, car les deux identifiants utilisent la meme incarnation d'Edward
Buck.

Fichiers livres :

- `public/sprites/generated/heroes/halo/cortana.png`
- `public/sprites/generated/heroes/halo/noble-six.png`
- `public/sprites/generated/heroes/halo/buck-odst.png`
- `public/sprites/generated/heroes/halo/buck.png`
- `public/sprites/generated/heroes/halo/kelly-087.png`
- `public/sprites/generated/heroes/halo/linda-058.png`
- `public/sprites/generated/heroes/halo/cortana-fragment.png`

Aucun manifeste, registre, prompt global, fichier de code, `package.json` ou
element Git n'a ete modifie pour ce pack.

## Incarnations verrouillees

| ID | Incarnation retenue | Verrous visuels et gameplay |
| --- | --- | --- |
| `cortana` | Cortana, design canonique de *Halo 4* | Visage et silhouette de cette incarnation, carre indigo court avec raie laterale, hologramme cyan/cobalt, aucun armement. |
| `noble-six` | SPARTAN-B312, apparence promotionnelle masculine par defaut de *Halo: Reach* | MJOLNIR Mark V[B] gris graphite, casque Mark V[B], visiere ambre, M392 DMR. La personnalisation joueur de Reach n'est pas melangee a cette feuille. |
| `buck-odst` / `buck` | Edward Buck, Alpha-Nine, *Halo 3: ODST* (2552) | Armure ODST sombre, casque/VISR ODST, M7S SMG silencieux. Il ne s'agit pas de Buck Spartan-IV de *Halo 5*. |
| `kelly-087` | Kelly-087, *Halo 5: Guardians* | MJOLNIR GEN2 HERMES bleu-gris, grande visiere ambre, accents jaunes, shotgun Oathsworn et animation de vitesse. |
| `linda-058` | Linda-058, *Halo 5: Guardians* | MJOLNIR GEN2 ARGUS gris clair, casque multi-optiques ambre, Nornfang SRS99-S5 AM. |
| `cortana-fragment` | La meme Cortana de *Halo 4*, sous forme de fragment Nexus A.R.C.A. | Identite, visage, cheveux et proportions conserves; seuls les scan breaks, fragments geometriques et ruptures cyan sont originaux au lore A.R.C.A. |

## References visuelles

### Cortana et Cortana Fragment

- Halo Waypoint, *Halo 4 Tenth Anniversary* :
  https://www.halowaypoint.com/news/halo-4-tenth-anniversary
- Illustration officielle Halo 4, John Wallin Liberto :
  https://wpassets.halowaypoint.com/wp-content/2022/10/Halo-4-Anniversary-Header.jpg
- Halo Waypoint, *Women's History Month 2024* :
  https://www.halowaypoint.com/news/womens-history-month-2024
- Portrait officiel Cortana :
  https://wpassets.halowaypoint.com/wp-content/2024/02/Cortana.jpg
- Kyle Hefley, modele de production Cortana Halo 4; textures creditees a Matt
  Aldridge et shader a Howard Coulby :
  https://sortadone.artstation.com/projects/Z5lZ

### Noble Six

- Halo Waypoint, *Canon Fodder: Feet First Into Fall* :
  https://www.halowaypoint.com/news/canon-fodder-feet-first-into-fall
- Visuel officiel SPARTAN-B312 :
  https://wpassets.halowaypoint.com/wp-content/2025/09/CF165.jpg
- Halo Waypoint, *Welcome to Reach* :
  https://www.halowaypoint.com/news/welcome-to-reach
- Key art officiel Reach :
  https://wpassets.halowaypoint.com/wp-content/2021/08/WelcomeToReach_MCC_Thumbnail_12.3.2019_542x305.jpg
- Lee R. Wilson, carnets de production cinematographique Reach :
  https://dangerousonion.artstation.com/projects/nJ5xD4

### Edward Buck

- Halo Waypoint, *Feet First Into Fall* :
  https://www.halowaypoint.com/news/feet-first-into-fall
- Statue officielle Buck avec M7S Silenced SMG :
  https://wpassets.halowaypoint.com/wp-content/2024/09/ODST_Buck.jpg
- Illustration *Halo Mythos* creditee a Leonid Kozienko :
  https://wpassets.halowaypoint.com/wp-content/2024/09/Mythos_LeonidKozienko_ODST_CU_Cover.jpg

### Kelly-087

- Halo Waypoint, *Women's History Month 2024* :
  https://www.halowaypoint.com/news/womens-history-month-2024
- Portrait officiel Kelly-087 :
  https://wpassets.halowaypoint.com/wp-content/2024/02/Kelly-087.jpg
- Halo Waypoint, *Blue Team Operation Launch* :
  https://www.halowaypoint.com/news/blue-team-operation-launch
- Visuel officiel HERMES :
  https://wpassets.halowaypoint.com/wp-content/2025/03/blueteam_502.jpg

### Linda-058

- Halo Waypoint, *Women's History Month 2024* :
  https://www.halowaypoint.com/news/womens-history-month-2024
- Portrait officiel Linda-058 :
  https://wpassets.halowaypoint.com/wp-content/2024/02/Linda-058.jpg
- Halo Waypoint, *Blue Team Operation Launch* :
  https://www.halowaypoint.com/news/blue-team-operation-launch
- Gabriel Garza, exploration de production Linda pour *Halo 5* :
  https://www.artstation.com/artwork/1n95Y8
- Eric Will, interieur du casque Linda :
  https://www.artstation.com/artwork/JDd90

Les references ont servi a verrouiller l'incarnation, la silhouette, l'armure,
le casque et l'arme. Les PNG livres sont des interpretations pixel-art
originales generees pour le projet; aucun fichier visuel officiel n'est
redistribue dans le pack.

## Contrat d'animation

Chaque feuille utilise une grille logique stricte de 4 colonnes x 4 lignes,
soit seize cellules de 256 x 256 pixels :

| Ligne | Contenu |
| --- | --- |
| 1 | Quatre phases d'idle. |
| 2 | Quatre phases de course, marche tactique ou mouvement holographique. |
| 3 | Quatre phases d'attaque ou de pouvoir fidele au personnage. |
| 4 | Impact, recul, stabilisation et recovery. |

Toutes les poses sont en corps entier, en vue RPG trois-quarts vers la droite.
Cortana et son fragment n'inventent aucune arme. Les effets du fragment restent
des ruptures de donnees cyan rattachees a la meme Cortana.

## Pipeline

1. Recherche et inspection des references officielles Halo Waypoint et des
   pages ArtStation de production creditees.
2. Generation de six feuilles uniques avec OpenAI ImageGen sur fond uniforme
   `#ff00ff`.
3. Suppression du chroma avec matte progressif, despill et contraction de bord.
4. Normalisation en `1024x1024`, repartition 4x4 et marge interne minimale.
5. Copie binaire de Buck vers les deux identifiants demandes.
6. Inspection visuelle des six feuilles uniques et controle automatise des sept
   sorties.

## Prompts exacts de la lignee finale

Les essais rejetes et non incorpores aux fichiers livres ne font pas partie de
cette lignee.

### Cortana - generation

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is the canonical Halo 4 Cortana visual identity reference. Image 2 is ONLY a reference for the 4x4 sprite-sheet layout, consistent scale, three-quarter RPG angle, and detailed pixel-art density; do not copy its man, armor, gun, palette, or poses.

Create one square 1024x1024 high-detail pixel-art sprite sheet of canonical HALO 4 CORTANA. Lock the same recognizable adult AI identity in all 16 frames: the Halo 4 face and slim human silhouette, chin-length dark indigo-blue bob haircut with the same side part and shape, luminous cyan/cobalt holographic body with intricate pale-blue circuitry and scan-line patterns. Tasteful, nonsexualized, body-suit-like holographic treatment with no explicit anatomy. She is Cortana, not the Weapon, not Halo 5 Cortana, not a generic blue woman.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells in row-major order. The cell grid is alignment only: render NO grid lines, borders, separators, labels, numbers, guides, UI, or panels. Every cell contains exactly one complete full-body Cortana, consistently sized and grounded, seen in three-quarter RPG view facing screen-right. Keep head, hair, hands, feet, glow and all effects fully inside each cell with at least 16 pixels of clearance. Never crop. Never let one frame or effect cross into another cell. No missing frame, no extra person, no detached duplicate body parts.

ANIMATION ORDER:
Row 1, idle: four distinct subtle holographic idle phases, calm alert stance, small breathing/weight shift and gentle data shimmer.
Row 2, movement: four readable rightward holographic movement phases, graceful forward step/glide cycle with alternating legs and arms, no teleporting and no weapon.
Row 3, lore power: four progressive frames of Cortana interfacing with a system using only her hands and holographic nature: raise hand and focus; gather cyan data filaments; release a compact circular cyan data pulse; settle after the pulse. No firearm, blade, staff, or invented weapon.
Row 4, hit/recovery: four progressive frames: digital impact glitch; recoil with briefly fragmented silhouette; stabilize while reassembling scan lines; return to ready idle.

Style: polished 32-bit-era RPG pixel art, crisp deliberate pixel clusters, detailed but readable at game scale, strong silhouette, controlled cyan/indigo palette, subtle emissive highlights, consistent face/hair/proportions and consistent right-facing camera angle across all frames. Motion must change pose, not identity.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas, including gaps between frames. No floor plane, no cast shadow, no ambient glow cloud, no scenery, no gradient, no texture, no reflection. Do not use #ff00ff on Cortana or her effects.
Avoid: text, Halo logo, watermark, visible grid, cell border, checkerboard, scenery, UI, more than one Cortana per cell, weapons, armor, Master Chief, The Weapon, painterly blur, antialiased vector style, cropped feet or hair.
```

### Cortana - correction de continuite

```text
Use case: precise-object-edit.
Edit target: Image 1, the existing 4x4 Halo 4 Cortana sprite sheet on flat magenta.

Preserve the exact same square canvas, flat uniform #ff00ff background, invisible 4x4 layout, pixel-art style, canonical Halo 4 Cortana identity, face, chin-length indigo bob, circuitry, palette, viewpoint, and every existing frame. Change ONLY cell row 3 column 3 (the data-pulse attack frame).

In row 3 column 3, keep the same upright right-facing Cortana pose and the same circular cyan data pulse, but make Cortana's full-body height and proportions match the adjacent row 3 Cortana bodies exactly. Her head-to-feet size must be consistent with the other fifteen frames, approximately 70-75 percent of the cell height. Reduce and tighten the circular data pulse and shorten its horizontal trail so the complete full-size Cortana plus compact pulse fit inside that one cell with generous empty magenta margin. Keep her complete hair, hands and feet visible. Do not scale down Cortana to fit the effect.

Do not change any other cell. Do not add a grid, border, text, logo, scenery, weapon, extra person, duplicate body, shadow, or gradient. Keep all content inside its own cell and keep the background perfectly flat #ff00ff.
```

### Noble Six

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is an official Halo: Reach Noble Six reference. Image 2 is ONLY a reference for the clean 4x4 layout, consistent scale, three-quarter RPG angle, and detailed pixel-art density; do not copy its character or weapon.

Create one square 1024x1024 high-detail pixel-art sprite sheet of NOBLE SIX, SPARTAN-B312, locked to the canonical default masculine-presenting Halo: Reach incarnation. Same fully helmeted Spartan in all 16 frames: dark charcoal/graphite MJOLNIR Mark V[B] armor, canonical Mark V[B] helmet silhouette with compact amber-gold visor, black technical undersuit, practical Reach-era layered plates, subtle worn edges, muted UNSC military finish, no bright team color. He carries the canonical M392 DMR in every frame. Do not make Master Chief: no olive-green Mark VI armor. No Emile skull helmet, no Carter blue, no Jorge heavy armor, no exposed face.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells in row-major order. The grid is alignment only: render NO grid lines, borders, separators, labels, numbers, UI, or panels. Every cell contains exactly one complete full-body Noble Six at one consistent scale and ground line, seen in three-quarter RPG view facing screen-right. Keep helmet, boots, DMR, muzzle flash and shield sparks fully inside each cell with at least 16 pixels clearance. Never crop or cross cell boundaries.

ANIMATION ORDER:
Row 1 idle: four distinct guarded idle phases with the DMR held low-ready, subtle breathing and weight shifts.
Row 2 movement: four distinct rightward run phases, alternating foot contacts and arm/DMR motion, readable loop.
Row 3 attack: progressive DMR sequence: raise and acquire target; aimed shot with compact muzzle flash; controlled recoil with a single casing; recover aim. Keep the whole Spartan and complete DMR visible in all four.
Row 4 hit/recovery: energy-shield impact sparks; armored recoil; braced recovery; return to low-ready.

Style: polished detailed 32-bit-era RPG pixel art, crisp deliberate pixel clusters, strong silhouette, realistic Halo: Reach proportions, coherent armor geometry and the exact same helmet/visor/DMR in all frames. Subtle blue-white shield sparks only where relevant.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas and between every frame. No floor, cast shadow, scenery, gradient, texture, reflection, glow cloud. Do not use #ff00ff on the subject.
Avoid: visible grid, text, numbers, UNSC/Halo logos, watermark, scenery, extra person, detached weapon, weapon substitution, assault rifle, pistol, energy sword, bright green Master Chief armor, cropped body, painterly blur, vector art.
```

### Edward Buck

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is the official Halo 3: ODST Edward Buck statue reference and defines his ODST armor and M7S suppressed SMG. Image 2 is ONLY a reference for the clean 4x4 sprite-sheet layout, consistent scale, three-quarter RPG angle, and detailed pixel-art density; do not copy its man, armor, goggles, or weapon.

Create one square 1024x1024 high-detail pixel-art sprite sheet of EDWARD BUCK locked to his canonical HALO 3: ODST / Alpha-Nine incarnation. Same fully helmeted Buck in all 16 frames: dark charcoal and gunmetal ODST armor, black undersuit, canonical rounded ODST helmet with dark blue-black VISR visor, compact squad-leader communications detail, layered chest and shoulder plates, tactical pouches and thigh armor, realistic worn military surfaces. He uses the canonical M7S suppressed SMG in every frame. No exposed Nathan Fillion face is needed; identity is the exact Buck ODST kit. Do not turn him into Spartan-IV Buck and do not use Halo 5 armor.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells, row-major order. The grid is alignment only: render NO lines, borders, separators, labels, numbers, UI, or panels. Every cell contains exactly one complete full-body Buck at consistent scale and ground line, three-quarter RPG view facing screen-right. Keep helmet, boots, SMG, suppressor, muzzle flash and impact effects fully inside each cell with at least 16 pixels clearance. Never crop and never cross cell boundaries.

ANIMATION ORDER:
Row 1 idle: four distinct alert idle phases, M7S held low-ready, subtle breathing and weight shifts.
Row 2 movement: four distinct rightward tactical run phases with alternating legs and controlled SMG carry.
Row 3 attack: raise suppressed SMG; fire compact controlled burst; recoil with small restrained muzzle flash and one casing; recover aim.
Row 4 hit/recovery: shieldless armor impact spark; hard recoil; crouched brace; return to ready.

Style: polished detailed 32-bit-era RPG pixel art, crisp pixel clusters, strong readable silhouette, gritty Halo 3: ODST military design, identical helmet/armor/SMG in all frames. Compact effects only.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas and all gaps. No floor, shadow, scenery, gradient, texture, reflection, glow cloud. Do not use #ff00ff on Buck.
Avoid: visible grid, text, numbers, Halo/UNSC/Xbox logos, watermark, scenery, extra people, Spartan armor, exposed face, rifle, shotgun, pistol, cropped body, detached gun, painterly blur, vector art.
```

### Kelly-087

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is the official Halo 5: Guardians Kelly-087 visual reference and defines her HERMES armor and shotgun. Image 2 is ONLY a reference for the clean 4x4 layout, consistent scale, three-quarter RPG angle, and detailed pixel-art density; do not copy its character or weapon.

Create one square 1024x1024 high-detail pixel-art sprite sheet of SPARTAN KELLY-087 locked to her canonical HALO 5: GUARDIANS incarnation. Same fully helmeted adult Spartan-II in all 16 frames: sleek pale blue-gray HERMES-class MJOLNIR GEN2 armor, distinctive aerodynamic armor silhouette, canonical large rounded amber-gold HERMES visor and helmet shape, black undersuit, fine yellow accent lines, realistic athletic proportions without sexualization. She carries Oathsworn, her custom Halo 5 shotgun, in every frame. Do not substitute generic Mark VI, ARGUS, EVA, or Master Chief armor.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells in row-major order. The grid is alignment only: render NO grid lines, borders, separators, labels, numbers, UI, or panels. Every cell contains exactly one complete full-body Kelly at consistent scale and ground line, three-quarter RPG view facing screen-right. Keep helmet, boots, full shotgun, speed accents and shield sparks fully within each cell with at least 16 pixels clearance. Never crop or cross cells.

ANIMATION ORDER:
Row 1 idle: four distinct agile guarded idle phases with Oathsworn low-ready and subtle weight shifts.
Row 2 movement: four clearly different rightward sprint phases emphasizing Kelly's canonical speed, alternating strides and weapon carry; only short connected cyan-white motion accents, no duplicate afterimages.
Row 3 attack: shoulder Oathsworn; fire one close-range shotgun blast with compact muzzle flash; strong controlled recoil; pump/recover to aim.
Row 4 hit/recovery: energy-shield impact; fast recoil; low agile brace; snap back to ready.

Style: polished detailed 32-bit-era RPG pixel art, crisp deliberate pixel clusters, strong silhouette, exact same HERMES helmet/armor/Oathsworn in every frame, cool blue-gray metal plus amber visor and restrained yellow details.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas and all gaps. No floor, cast shadow, scenery, gradient, texture, reflection, ambient glow cloud. Do not use #ff00ff on Kelly.
Avoid: visible grid, text, service numbers, Halo/UNSC logos, watermark, extra people, unhelmeted face, sniper rifle, assault rifle, generic female sci-fi armor, cropped feet or shotgun, painterly blur, vector art.
```

### Linda-058

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is the official Halo 5: Guardians Linda-058 visual reference and defines her ARGUS armor and Nornfang sniper rifle. Image 2 is ONLY a reference for the clean 4x4 layout, consistent scale, three-quarter RPG angle, and detailed pixel-art density; do not copy its character or weapon.

Create one square 1024x1024 high-detail pixel-art sprite sheet of SPARTAN LINDA-058 locked to her canonical HALO 5: GUARDIANS incarnation. Same fully helmeted adult Spartan-II in all 16 frames: pale gray/white ARGUS-class MJOLNIR GEN2 armor, black undersuit, canonical high rectangular ARGUS helmet crown with its distinctive array of multiple amber-yellow optical sensor lenses and dark faceplate, angular sniper-specialist plating, realistic athletic proportions without sexualization. She carries the complete Nornfang customized SRS99-S5 AM sniper rifle in every frame. Do not substitute HERMES, generic Mark VI, Master Chief armor, or a generic rifle.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells in row-major order. The grid is alignment only: render NO grid lines, borders, separators, labels, numbers, UI, or panels. Every cell contains exactly one complete full-body Linda at consistent scale and ground line, three-quarter RPG view facing screen-right. Keep helmet sensors, boots, the entire long Nornfang barrel and all effects inside each cell with at least 16 pixels clearance. Use diagonal rifle poses where needed. Never crop or cross cells.

ANIMATION ORDER:
Row 1 idle: four distinct precise idle phases, Nornfang carried at guarded low-ready, subtle breathing and stance shifts.
Row 2 movement: four distinct rightward tactical run phases with alternating steps and controlled long-rifle carry.
Row 3 attack: raise Nornfang and acquire target; steady aimed shot with compact muzzle flash; recoil with one casing; recover precise aim. Whole body and complete rifle visible in all frames.
Row 4 hit/recovery: energy-shield impact; armored recoil; kneeling or low brace while retaining Nornfang; return to ready.

Style: polished detailed 32-bit-era RPG pixel art, crisp deliberate pixel clusters, strong readable silhouette, exact same ARGUS helmet/armor/Nornfang in every frame, controlled pale gray, black and amber palette.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas and all gaps. No floor, cast shadow, scenery, gradient, texture, reflection, ambient glow cloud. Do not use #ff00ff on Linda.
Avoid: visible grid, text, service numbers, Halo/UNSC logos, watermark, extra people, unhelmeted face, shotgun, DMR, generic armor, cropped rifle or body, painterly blur, vector art.
```

### Cortana Fragment - generation

```text
Use case: stylized-concept.
Asset type: production RPG hero sprite sheet for a 2D game.
Input images: Image 1 is the approved canonical Halo 4 Cortana pixel-art sprite sheet and is the strict identity, face, hair, silhouette, palette, scale, layout and style reference. Image 2 is the official Halo 4 Cortana production identity reference. Create the SAME woman as Image 1, not a new or similar woman.

Create one square 1024x1024 high-detail pixel-art sprite sheet for CORTANA FRAGMENT, an original A.R.C.A. Nexus fragment of the exact same canonical Halo 4 Cortana. Lock all identity traits across all 16 frames: identical recognizable face, identical chin-length dark indigo bob with the same side part, identical adult proportions and body-suit-like cyan/cobalt holographic circuitry. The only new design layer is clearly original A.R.C.A. fragmentation: restrained cyan data shards, short horizontal scan breaks, duplicated edge pixels, and small luminous geometric gaps passing through her hologram. These effects must read as a damaged/partitioned Cortana data fragment, never as another person, costume, weapon, or Halo 5 form. Tasteful, nonsexualized, no explicit anatomy.

LAYOUT CONTRACT: exactly 4 columns by 4 rows, sixteen equal invisible 256x256 cells in row-major order. The grid is alignment only: render NO grid lines, borders, separators, labels, numbers, guides, UI, or panels. Every cell contains exactly one complete full-body Cortana Fragment at consistent scale and ground line, three-quarter RPG view facing screen-right. Keep hair, hands, feet, data shards, glitches and pulse effects fully inside each cell with at least 16 pixels clearance. Never crop, cross cells, or create extra faces/bodies.

ANIMATION ORDER:
Row 1 idle: four distinct calm fragment-idle phases, subtle breathing/weight shifts while small cyan scan breaks travel vertically through the same body.
Row 2 movement: four distinct rightward holographic step/glide phases, alternating legs and arms, with a short connected trail of cyan data shards that never becomes an afterimage or second body.
Row 3 A.R.C.A. fragment power: focus with one hand; gather small cyan polygonal data shards; project a compact fragmented cyan Nexus pulse; settle as shards reconnect. No weapon of any kind.
Row 4 hit/recovery: severe digital impact; partial horizontal fragmentation while the whole silhouette remains readable; reassembly from cyan data shards; return to stable ready idle.

Style: match Image 1 exactly: polished detailed 32-bit-era RPG pixel art, crisp deliberate pixel clusters, strong silhouette, controlled cyan/indigo palette, consistent face/hair/proportions, same right-facing camera. Fragment effects are original to A.R.C.A. but integrated into the same Cortana.

Background: perfectly flat uniform solid #ff00ff chroma-key across the entire canvas and all gaps. No floor, cast shadow, scenery, gradient, texture, reflection, ambient glow cloud. Do not use #ff00ff on the subject or effects.
Avoid: another woman, changed face, longer hair, The Weapon, Halo 5 Cortana, armor, clothing redesign, weapons, extra people, duplicated full bodies, visible grid, text, logo, watermark, scenery, cropped effects, painterly blur, vector art.
```

### Cortana Fragment - corrections de continuite

```text
Use case: precise-object-edit.
Edit target: Image 1, the existing 4x4 Cortana Fragment sprite sheet on flat magenta.

Preserve the exact same square canvas, flat uniform #ff00ff background, invisible 4x4 layout, pixel-art style, canonical Halo 4 Cortana identity, face, chin-length indigo bob, circuitry, A.R.C.A. cyan fragmentation effects, palette, viewpoint, and every existing frame. Change ONLY cell row 3 column 3 (the fragmented Nexus-pulse attack frame).

In row 3 column 3, keep the same upright right-facing Cortana Fragment pose and fragmented cyan Nexus pulse, but make Cortana's full-body height and proportions match the adjacent row 3 Cortana bodies exactly. Her head-to-feet size must be consistent with the other fifteen frames, approximately 70-75 percent of the cell height. Reduce and tighten the fragmented circular pulse and shorten its horizontal data trail so the complete full-size Cortana plus compact pulse fit inside that one cell with generous empty magenta margin. Keep her complete hair, hands and feet visible. Do not scale down Cortana to fit the effect. She must remain the exact same Cortana, not another woman.

Do not change any other cell. Do not add a grid, border, text, logo, scenery, weapon, extra person, duplicate body, shadow, or gradient. Keep all content inside its own cell and keep the background perfectly flat #ff00ff.
```

```text
Use case: precise-object-edit.
Edit target: Image 1, the existing 4x4 Cortana Fragment sprite sheet on flat magenta.

Preserve the entire image exactly except for the single character-and-pulse content inside cell row 3 column 3. Do not alter any pixel-art identity, face, hair, clothing-like holographic circuitry, palette, fragmentation style, viewpoint, canvas, background, layout, or any of the other fifteen cells.

STRICT SIZE FIX FOR ROW 3 COLUMN 3: redraw the Cortana Fragment body in row 3 column 3 at the SAME head-to-feet height as the Cortana body in row 3 column 1. Use row 3 column 1 inside this same image as the exact size guide: align the top of her hair and bottom of her feet to approximately the same vertical positions within their respective cells. Her body must be full-size and visually equal to row 3 columns 1 and 2, not smaller. Keep her upright, full-body, three-quarter view facing screen-right, one hand projecting the effect, and preserve the exact same canonical Halo 4 Cortana face and chin-length indigo bob.

Make the fragmented cyan Nexus pulse a SMALL compact hand-sized effect, no more than about one quarter of the cell width, immediately in front of her raised hand. Remove the long horizontal trail. The effect must fit around the full-size body, never force the body smaller, never obscure her face, and never cross the cell boundary.

Keep the background perfectly flat uniform #ff00ff. No grid, border, text, logo, scenery, weapon, extra person, duplicate body, shadow, gradient, crop, or cell-boundary crossing.
```

```text
Use case: precise-object-edit.
Edit target: Image 1, the existing 4x4 Cortana Fragment sprite sheet on flat magenta.

Preserve all pixels and all fifteen other cells. Edit ONLY row 3 column 3.

ROW 3 COLUMN 3 MUST MATCH BODY SCALE: make the Cortana Fragment body exactly the same head-to-feet height as row 3 column 1, with hair top and feet bottom at the same relative vertical coordinates inside the cell. Her body must be about 80 percent of the cell height, matching the neighboring attack frames. Keep the exact same canonical Halo 4 Cortana face, chin-length indigo bob, body proportions, circuitry, right-facing three-quarter pose and full-body visibility.

The Nexus effect must be tiny and must not widen the frame: render only a palm-sized cyan fragmented ring, about one eighth of the cell width, overlapping the empty space immediately around and just beyond her raised hand. Its far-right edge should extend no more than one tenth of the cell width beyond her fingertips. Remove every horizontal trail line. The full-size body is the priority; do not shrink her for the effect.

Keep the square canvas, invisible 4x4 layout and perfectly flat uniform #ff00ff background unchanged. No changes outside row 3 column 3. No grid, text, logo, scenery, weapon, extra person, duplicate body, shadow, gradient, crop, or crossing into another cell.
```

## Validations finales

Controle automatise effectue sur les fichiers livres :

| Fichier | PNG | Alpha | Cellules | Marge min. | Hauteur bbox visible | Chroma visible | Cellules identiques |
| --- | --- | --- | ---: | ---: | --- | ---: | ---: |
| `cortana.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 202-232 px | 0 px | 0 |
| `noble-six.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 198-232 px | 0 px | 0 |
| `buck-odst.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 197-232 px | 0 px | 0 |
| `buck.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 197-232 px | 0 px | 0 |
| `kelly-087.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 181-232 px | 0 px | 0 |
| `linda-058.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 178-230 px | 0 px | 0 |
| `cortana-fragment.png` | 1024x1024 RGBA, 8 bits, type 6 | 0-255 | 16/16 | 12 px | 213-225 px | 0 px | 0 |

Controles communs :

- quatre coins totalement transparents sur chaque fichier;
- aucun RGB residuel sous les pixels d'alpha zero;
- aucune cellule vide et aucune frame dupliquee au sein d'une feuille;
- aucun texte, logo, grille, decor ou chroma visible;
- corps entier et effets confines a leur cellule;
- sequences idle, mouvement, attaque/pouvoir et hit/recovery lisibles;
- `buck.png` et `buck-odst.png` sont strictement identiques, comme autorise.

## Empreintes SHA-256

```text
BB8A90FC557BDAB2F5214D67BEF95F2A21745A5BBEDCC3885E7061B5B023324D  cortana.png
CA02F0444FDB61C9A4CD4F7CA16668A7F9005E80D1C1E99CE510DDDFE74B218D  noble-six.png
022755AE8D50300D8C67550E825668CA3C0B5433C699B9C6A9348B1A9B1EA3D4  buck-odst.png
022755AE8D50300D8C67550E825668CA3C0B5433C699B9C6A9348B1A9B1EA3D4  buck.png
EB05435412212EA0661913C54727E88112678E6FDEA8AE3BE16EE594AFFB7A68  kelly-087.png
2B56C3598B33859392D240076059AA344B152C2511548ADE9C8F0BB751A9C747  linda-058.png
67B44900FE2B10B9C8D61337C7881E8E00E2C2DB7CA947AF84722629348CEB81  cortana-fragment.png
```
