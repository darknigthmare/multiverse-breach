# Lot prioritaire ennemis et boss Cyberpunk: Edgerunners - 2026-07-22

## Perimetre livre

Cinq appels OpenAI ImageGen distincts ont produit cinq planches pixel art
originales fan-made. Les references de production ci-dessous ont uniquement
servi a verrouiller silhouettes, couleurs, equipements et identites. Aucun
asset officiel n'a ete copie ou trace.

Chaque sortie finale est un PNG `RGBA` transparent de `1024x1024`, en grille
stricte `4x4` de cellules `256x256` :

| Ligne | Fonction | Frames |
|---|---|---:|
| 1 | idle / veille | 4 |
| 2 | mouvement | 4 |
| 3 | attaque ou capacite | 4 |
| 4 | degats et mort / neutralisation | 4 |

| Sujet | Interpretation canonique retenue | Fichier final |
|---|---|---|
| Maelstrom Borg | un seul membre Maelstrom lourdement chrome, implant optique rouge multi-lentilles | `public/sprites/generated/bosses/cyberpunk-edgerunners/maelstrom-borg.png` |
| Arasaka Security Trooper | soldat de securite Arasaka 2077, armure noire, blanche et rouge, fusil smart | `public/sprites/generated/bosses/cyberpunk-edgerunners/arasaka-security-trooper.png` |
| Militech Combat Drone | modele canonique Militech Wyvern | `public/sprites/generated/bosses/cyberpunk-edgerunners/militech-combat-drone.png` |
| Militech Basilisk Convoy | un seul Basilisk comme vehicule de commandement de la rencontre, sans escorte dans les cellules | `public/sprites/generated/bosses/cyberpunk-edgerunners/militech-basilisk-convoy.png` |
| Adam Smasher Full Borg | chassis full-borg de la finale d'Arasaka Tower dans l'anime | `public/sprites/generated/bosses/cyberpunk-edgerunners/adam-smasher-full-borg.png` |

## References inspectees avant generation

Toutes les references ont ete consultees le 2026-07-22.

### Sources communes

- [Cyberpunk: Edgerunners - site officiel CD PROJEKT RED](https://www.cyberpunk.net/en/edgerunners), continuite de l'anime et galerie officielle des personnages, dont Adam Smasher ;
- [The Official Digital Artbook of Cyberpunk 2077](https://www.cyberpunk.net/artbook/en/), direction visuelle officielle commune au jeu et a l'anime.

### Maelstrom Borg

- [Cyberpunk 2077: Maelstrom - Michal Dziekan](https://www.artstation.com/artwork/8eZOKE), poster officiel realise avec CD PROJEKT RED Gear a partir des personnages et concepts de production du gang.

Verrou visuel : peau residuelle pale et scarifiee, implant facial rouge en
grappe, cybermembres industriels noirs, cables rouges, cuir noir use et
construction asymetrique. Le sprite represente un membre original unique, pas
Royce, Brick, Maine ou Adam Smasher.

### Arasaka Security Trooper

- [Arasaka Soldier - Ben Andrews](https://benandrewsart.artstation.com/projects/8exZOO), concept de production Cyberpunk 2077 cree avec Jan Marek sous la direction artistique de Pawel Mielniczuk ;
- [Cyberpunk 2077 - Arasaka Soldier - Grzegorz Chojnacki](https://grzegorzchojnacki.artstation.com/projects/Vg44Q8), modele personnage final realise chez CD PROJEKT RED.

Verrou visuel : soldat humain casque, sous-combinaison noire, plaques blanches
anguleuses, accents rouges et fusil corporate compact. La silhouette reste
humaine et distincte du full-borg Smasher.

### Militech Combat Drone

- [Cyberpunk 2077 - Wyvern - Marek Madej](https://banditpencil.artstation.com/projects/Qr5B9E), concept de production du drone developpe a partir des sketches de Robert Adler sous la direction artistique de Pawel Mielniczuk.

Verrou visuel : fuselage central compact, deux ailes pliantes anguleuses, deux
optiques rouges, canon ventral et propulseurs. La palette olive, noire et jaune
reprend le langage neomilitariste Militech sans inventer un autre modele.

### Militech Basilisk Convoy

- [Militech Basilisk - Ben Andrews](https://benandrewsart.artstation.com/projects/8e3YqE), concept de production officiel Cyberpunk 2077 ;
- [Cyberpunk 2077 - Basilisk - Paul Dalessi](https://neuro.artstation.com/projects/d8Wzn3), modele 3D de production du hovertank ;
- [Cyberpunk 2077 - Militech Basilisk, texturing et polish - Csaba Szilagyi](https://csabaszilagyi.artstation.com/projects/Vg4zdg), rendus moteur et materiaux finaux.

Verrou visuel : coque basse en coin, deux pods lateraux de poussee vectorielle,
blindage olive et gunmetal, tourelle basse, canon long, capteurs rouges et
propulsion cyan-blanche. `Convoy` reste le nom de la rencontre : chaque case
contient exactement un Basilisk et aucune escorte.

### Adam Smasher Full Borg

- [Cyberpunk: Edgerunners - galerie officielle Adam Smasher](https://www.cyberpunk.net/en/edgerunners), proportions, chassis, visage et presence dans la finale anime ;
- [Cyberpunk 2077 - Adam Smasher - Grzegorz Chojnacki](https://grzegorzchojnacki.artstation.com/projects/ykyym9), modele de production CD PROJEKT RED utilise pour recouper les composants mecaniques ;
- [Cyberpunk 2077 Adam Smasher Design - Marek Madej](https://www.artstation.com/artwork/48qwO1), recherches de production du chassis 2077.

Verrou visuel : proportions anime tres massives, torse et epaules noirs, petite
face pale encastree, optiques rouges, cables, poings lourds, missiles d'epaule
et canon integre. Aucun melange avec son apparence humaine de 2020, Maine ou le
cybersquelette de David.

## Prompts de production

### Maelstrom Borg

```text
Use case: stylized-concept.
Create one original fan-made production sprite sheet, not a copy or trace of any official artwork.

OUTPUT AND LAYOUT
- Exactly one square 1024 x 1024 image.
- An implicit strict 4 columns x 4 rows grid: 16 equal 256 x 256 cells, read left-to-right and top-to-bottom.
- Do not draw grid lines, borders, labels, numbers, text, logos, signatures, or watermarks.
- Each cell contains exactly one complete full-body view of the SAME single Maelstrom borg. No second person, no detached duplicate head, no alternate character.
- Three-quarter side combat view facing screen-right in every cell.
- Keep every body part, weapon, and compact effect at least 20 pixels inside its own cell. Nothing may cross a 256-pixel cell boundary.
- Same identity, scale, anatomy, facial cyberware, clothes, weapon, and palette in all 16 frames.

CANON VISUAL LOCK
A heavily augmented Maelstrom gang borg from Cyberpunk 2077 / the shared Cyberpunk: Edgerunners Night City continuity. Tall, lean-muscular masculine silhouette; corpse-pale scarred remaining skin; shaved scalp with a short dirty-red crest; unmistakable bright red multi-lens spider-eye facial implant replacing both natural eyes and spanning the brow; exposed cheek and jaw metal; black gunmetal cyberarms and cyberlegs with crude industrial pistons and visible red cabling; battered black leather tactical vest and straps with dark red panels; torn charcoal cargo trousers around the cyberlegs; heavy black boots. Menacing improvised industrial construction, asymmetrical and brutal, not sleek corporate armor. Carry the same compact black-and-red tech pistol in the right hand throughout. Do not resemble Adam Smasher, Maine, David, an Arasaka soldier, or a generic robot.

PIXEL ART DIRECTION
Detailed hand-authored 2D pixel art suitable for a dark action RPG, coherent with high-quality existing game boss sprites. Crisp 1-pixel clusters, hard readable dark outline, deliberate limited shading, restrained red emissive highlights, no smooth 3D render, no vector art, no painterly blur, no anti-pixel texture. Strong silhouette readable at 256 x 256.

ANIMATION ROWS
- Row 1, idle: four subtle frames of a threatening ready stance, breathing and red optics pulsing; pistol remains present.
- Row 2, movement: four connected frames of a heavy aggressive walk/run to the right; full body visible and feet never cropped.
- Row 3, attacks/capability: cyberarm wind-up, brutal cyberarm punch, aimed charged tech-pistol shot with compact connected muzzle energy, berserk forward lunge with compact red motion streaks. Only this same borg.
- Row 4, damage/death: recoil from hit, stagger with sparks from cyberarm, dropping to one knee, final collapsed defeated pose fully contained and still recognizable.

BACKGROUND FOR REMOVAL
Perfectly flat uniform solid #00FF00 chroma-key background filling every transparent-intended pixel. No floor plane, horizon, scenery, vignette, gradient, lighting variation, texture, shadow, contact shadow, reflection, green spill, or green color anywhere on the subject.
```

### Arasaka Security Trooper

```text
Use case: stylized-concept.
Create one original fan-made production sprite sheet, not a copy or trace of any official artwork.

OUTPUT AND LAYOUT
- Exactly one square 1024 x 1024 image.
- An implicit strict 4 columns x 4 rows grid: 16 equal 256 x 256 cells, read left-to-right and top-to-bottom.
- Do not draw grid lines, borders, labels, numbers, readable text, signatures, or watermarks.
- Each cell contains exactly one complete full-body view of the SAME single Arasaka security trooper. No second soldier, no duplicate body or head, no other character.
- Three-quarter side combat view facing screen-right in every cell.
- Keep helmet, rifle, feet, limbs, and compact effects at least 20 pixels inside their own cell. Nothing may cross a 256-pixel cell boundary.
- Same identity, scale, anatomy, armor set, helmet, rifle, and palette in all 16 frames.

CANON VISUAL LOCK
A regular elite Arasaka corporate security trooper from Cyberpunk 2077 / the shared Cyberpunk: Edgerunners Night City continuity, based on the production Arasaka soldier language. Human-proportioned adult inside sleek layered tactical armor: matte black and charcoal ballistic undersuit; clean angular white armor panels on chest, shoulders, forearms, thighs and shins; restrained deep-red corporate accents and small abstract Arasaka-style crest shapes with no readable lettering; sealed black helmet with a smooth narrow red optical visor and lower-face respirator; compact black utility belt; reinforced black gloves and boots. Carry the SAME compact black Arasaka smart assault rifle with white shell panels and red status lights in every frame. Disciplined, precise corporate military silhouette, cleaner and less improvised than Maelstrom. Do not resemble Adam Smasher, MaxTac, Trauma Team, a samurai, or a generic space marine. No exposed face.

PIXEL ART DIRECTION
Detailed hand-authored 2D pixel art suitable for a dark action RPG, coherent with high-quality existing game enemy sprites. Crisp pixel clusters, hard readable dark outline, deliberate limited shading, controlled red emissive accents, no smooth 3D render, no vector art, no painterly blur. Strong readable silhouette at 256 x 256.

ANIMATION ROWS
- Row 1, idle: four subtle disciplined rifle-ready breathing and scanning frames.
- Row 2, movement: four connected tactical advance/run frames toward the right with the rifle retained; full body and boots visible.
- Row 3, attack: raise and aim rifle, controlled muzzle burst with compact flash, recoil frame, final follow-through/short underbarrel shock pulse. Keep all effects attached and inside the cell; no projectile extending to another cell.
- Row 4, damage/death: armor impact recoil with compact sparks, stagger, fall to one knee while holding rifle, final defeated collapsed pose fully contained.

BACKGROUND FOR REMOVAL
Perfectly flat uniform solid #FF00FF chroma-key background filling every transparent-intended pixel. No floor plane, horizon, scenery, vignette, gradient, lighting variation, texture, shadow, contact shadow, reflection, magenta spill, or magenta color anywhere on the subject.
```

### Militech Combat Drone

```text
Use case: stylized-concept.
Create one original fan-made production sprite sheet, not a copy or trace of any official artwork.

OUTPUT AND LAYOUT
- Exactly one square 1024 x 1024 image.
- An implicit strict 4 columns x 4 rows grid: 16 equal 256 x 256 cells, read left-to-right and top-to-bottom.
- Do not draw grid lines, borders, labels, numbers, readable text, logos, signatures, or watermarks.
- Each cell contains exactly one complete view of the SAME single Militech Wyvern combat drone. No pilot, soldier, extra drone, swarm, duplicate body, detached camera, or alternate model.
- Three-quarter side combat view facing screen-right in every cell.
- Keep the whole drone, all wing tips, gun, thrusters, and compact effects at least 20 pixels inside its own cell. Nothing may cross a 256-pixel cell boundary.
- Same model, scale, wing count, camera arrangement, weapon, panel layout, and palette in all 16 frames.

CANON VISUAL LOCK
Interpret "Militech Combat Drone" specifically as the canonical Militech Wyvern from Cyberpunk 2077, also present in Cyberpunk: Edgerunners continuity. A compact foldable airborne combat drone with a broad angular moth/wyvern silhouette: one central armored fuselage, exactly two swept folding wing assemblies, short articulated stabilizer vanes, two forward red optical cameras, a compact underbody machine-gun pod, exposed hinge mechanics, and small rear/underside thruster nozzles. Hard-surface neomilitarist design in matte dark olive drab, gunmetal and black, with restrained off-white stencil-like geometric marks and yellow hazard tabs but NO readable lettering. Red sensors, pale cyan-white thruster glow. It must always be a flying machine, not a humanoid robot, bird, insect, helicopter, quadcopter, or Basilisk tank.

PIXEL ART DIRECTION
Detailed hand-authored 2D pixel art suitable for a dark action RPG, coherent with high-quality existing boss sprites. Crisp pixel clusters, hard readable outline, deliberate limited shading, compact emissive accents, no smooth 3D render, no vector art, no painterly blur. Strong mechanical silhouette readable at 256 x 256.

ANIMATION ROWS
- Row 1, idle/hover: four subtle connected frames of stable hovering, wing servo adjustments and red cameras scanning.
- Row 2, movement: four connected rightward strafe/dash frames with changing wing pitch and compact thruster flames; entire drone visible.
- Row 3, attacks/capability: gun pod acquiring target, compact muzzle burst, two tiny micro-missiles launching from the same drone, aggressive dive-fire pose. Effects must remain compact and connected to the drone.
- Row 4, damage/death: impact recoil with sparks, cracked panel and smoke attached to hull, failing tilted hover, final disabled drone falling but fully visible inside the cell. Preserve the same drone identity and do not turn it into loose debris.

BACKGROUND FOR REMOVAL
Perfectly flat uniform solid #FF00FF chroma-key background filling every transparent-intended pixel. No floor plane, horizon, scenery, vignette, gradient, lighting variation, texture, shadow, contact shadow, reflection, magenta spill, or magenta color anywhere on the subject.
```

### Militech Basilisk Convoy

```text
Use case: stylized-concept.
Create one original fan-made production sprite sheet, not a copy or trace of any official artwork.

OUTPUT AND LAYOUT
- Exactly one square 1024 x 1024 image.
- An implicit strict 4 columns x 4 rows grid: 16 equal 256 x 256 cells, read left-to-right and top-to-bottom.
- Do not draw grid lines, borders, labels, numbers, readable text, logos, signatures, or watermarks.
- Each cell contains exactly one complete view of the SAME single Militech Basilisk hover-tank used as a convoy command vehicle. "Convoy" is the encounter name only: do NOT add escort trucks, soldiers, pilots, other tanks, or a second vehicle.
- Three-quarter side combat view facing screen-right in every cell.
- Keep the entire hull, side pods, cannon, antennae, thruster effects, and damage effects at least 20 pixels inside their own cell. Nothing may cross a 256-pixel cell boundary.
- Same vehicle identity, scale, hull geometry, armor layout, turret, weapons, and palette in all 16 frames.

CANON VISUAL LOCK
The canonical Militech Basilisk from Cyberpunk 2077 and the climactic Cyberpunk: Edgerunners convoy sequence. A low, very wide, heavily armored military hover-tank: flattened wedge-shaped central hull and cockpit; dark olive-drab and gunmetal angular reactive armor; two broad articulated wing-like side propulsion pods with vector-thrust nozzles; exposed black hydraulic pivots; low dorsal turret with one long 20 mm autocannon barrel; compact sensor mast and red optical modules; rear engine vents; restrained off-white geometric military markings, small red panels, and yellow hazard tabs with NO readable lettering. Weathered utilitarian neomilitarist construction. Pale cyan-white hover exhaust. It must not have wheels or tracks, must not become a normal tank, aircraft, car, robot, or Adam Smasher. No visible occupants.

PIXEL ART DIRECTION
Detailed hand-authored 2D pixel art suitable for a dark action RPG boss, coherent with high-quality existing game boss sprites. Crisp pixel clusters, hard readable outline, deliberate limited shading, compact emissive accents, no smooth 3D render, no vector art, no painterly blur. Strong wide silhouette readable at 256 x 256.

ANIMATION ROWS
- Row 1, idle/hover: four subtle connected frames of the same Basilisk hovering, side pods and sensor mast adjusting.
- Row 2, movement: four connected rightward acceleration and banking frames, side pods vectoring with compact thruster flames; whole vehicle visible.
- Row 3, attacks/capability: turret tracking, compact autocannon muzzle burst, small paired missile launch, armored ramming/breach posture with compact exhaust flare. Effects stay attached and inside the cell.
- Row 4, damage/death: armor impact with sparks, cracked side pod with compact smoke, failing tilted hover, final disabled wreck settled at an angle but entirely visible and still unmistakably the same Basilisk. Do not split it into unrelated debris.

BACKGROUND FOR REMOVAL
Perfectly flat uniform solid #FF00FF chroma-key background filling every transparent-intended pixel. No ground plane, desert, road, horizon, scenery, vignette, gradient, lighting variation, texture, shadow, contact shadow, reflection, magenta spill, or magenta color anywhere on the subject.
```

### Adam Smasher Full Borg

```text
Use case: stylized-concept.
Create one original fan-made production sprite sheet, not a copy or trace of any official artwork.

OUTPUT AND LAYOUT
- Exactly one square 1024 x 1024 image.
- An implicit strict 4 columns x 4 rows grid: 16 equal 256 x 256 cells, read left-to-right and top-to-bottom.
- Do not draw grid lines, borders, labels, numbers, readable text, logos, signatures, or watermarks.
- Each cell contains exactly one complete full-body view of the SAME single Adam Smasher in his full-borg Cyberpunk: Edgerunners finale body. No David, Rebecca, soldiers, alternate Smasher design, duplicate body, detached duplicate head, or second character.
- Three-quarter side combat view facing screen-right in every cell.
- Keep the complete head, shoulder weapon mounts, hands, feet, and compact effects at least 20 pixels inside their own cell. Nothing may cross a 256-pixel cell boundary.
- Same identity, scale, anatomy, chassis design, faceplate, weapon mounts, and palette in all 16 frames except progressive battle damage in row 4.

CANON VISUAL LOCK
Adam Smasher specifically as seen in the Cyberpunk: Edgerunners Arasaka Tower finale, not his 2020 human tactical suit and not another generic cyborg. Enormous top-heavy full-borg silhouette with extremely broad armored shoulders, barrel chest, long heavy mechanical arms, thick reinforced legs and compact skull-like head recessed between the shoulders. Nearly all-machine black, charcoal and dark gunmetal chassis with angular layered armor, exposed hydraulic pistons and dense black cables. Small pale gray bone-like facial plate with a brutal mechanical jaw and bright red optical sensors; no hair and almost no visible human flesh. Red chest/shoulder status lights. Integrated shoulder missile pod, compact heavy arm cannon and massive articulated fists are permanent parts of the same chassis. Intimidating anime proportions and crisp angular Edgerunners styling. Do not resemble Maine, David's cyberskeleton, a Maelstrom borg, Arasaka infantry, a mech suit with a human inside, or the old blond 2020 Adam Smasher.

PIXEL ART DIRECTION
Detailed hand-authored 2D pixel art suitable for a major dark action RPG boss, coherent with high-quality existing boss sprites. Crisp pixel clusters, hard readable dark outline, deliberate limited shading, restrained red emissive accents, no smooth 3D render, no vector art, no painterly blur. Massive silhouette must remain readable at 256 x 256.

ANIMATION ROWS
- Row 1, idle: four subtle frames of the same towering borg braced and scanning, fists and weapon mounts ready.
- Row 2, movement: four connected heavy advance frames ending in a compact Sandevistan-assisted dash; use only attached red/cyan speed streaks, never duplicate afterimage bodies.
- Row 3, attacks/capability: crushing cyberfist wind-up, shoulder missile launch with compact trails, integrated arm-cannon shot with compact flash, brutal full-borg charge/punch. Same Smasher and all effects remain inside the cell.
- Row 4, damage/death: armor impact and sparks, shoulder plate broken with cables exposed, one-knee stagger with damaged arm, final collapsed/kneeling defeated pose fully contained. Keep the skull face and overall identity recognizable; no gore and no scattered body duplicates.

BACKGROUND FOR REMOVAL
Perfectly flat uniform solid #00FF00 chroma-key background filling every transparent-intended pixel. No floor plane, Arasaka Tower, scenery, vignette, gradient, lighting variation, texture, shadow, contact shadow, reflection, green spill, or green color anywhere on the subject.
```

## Post-traitement

1. Cinq generations ImageGen separees, une seule par planche, ont produit des sources RGB `1254x1254`.
2. Le fond a ete retire avec le helper OpenAI ImageGen `remove_chroma_key.py` et les options `--auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill --edge-contract 1`.
3. Cles detectees : Maelstrom `#0cf30a`, Arasaka `#f903f8`, Wyvern `#fb02fa`, Basilisk `#fa02f9`, Smasher `#0af80a`.
4. `scripts/normalizeGeneratedSpriteSheet.py --strict-cells` a reconstruit Maelstrom, Arasaka, Basilisk et Smasher.
5. Le mode global du meme script a ete retenu pour le Wyvern afin de conserver ses deux micro-missiles comme composants relies a la frame d'attaque.
6. Les cinq planches finales ont ete forcees en `RGBA`, redimensionnees par la reconstruction a `1024x1024`, et tous les canaux RGB sous `alpha=0` ont ete remis a zero.
7. Les variantes de travail et planches de controle ont ete supprimees apres validation.

## Validation technique

Seuil de contenu : `alpha > 12`. La garde verifiee couvre les douze premiers
et douze derniers pixels de chaque cellule. `Chroma` compte les pixels visibles
a une distance RGB inferieure ou egale a 80 de la cle demandee.

| Fichier | Cellules | Uniques | Marge min. | Garde | Bord | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `maelstrom-borg.png` | 16 | 16 | 12 px | 0 | 0 | 781992 / 29359 / 237225 | 0 | 0 | `97ae6c9918b177dfebebc6e46a95840e5c8b80f43b260c1d0914ee617d9a697f` |
| `arasaka-security-trooper.png` | 16 | 16 | 12 px | 0 | 0 | 787637 / 23708 / 237231 | 0 | 0 | `efc102e4035a9480253d6b14bccb2eca1916ee1098d2a2db1d0a090738a671e2` |
| `militech-combat-drone.png` | 16 | 16 | 12 px | 0 | 0 | 817682 / 45929 / 184965 | 0 | 0 | `60b6b631eaa86c88b77dd47ab5c9bdae1ea28ddaef1edaa513aa27ad51a6bd6a` |
| `militech-basilisk-convoy.png` | 16 | 16 | 12 px | 0 | 0 | 784543 / 23208 / 240825 | 0 | 0 | `8060afe01dbce3a0b613b508604632efa273dc2c32fab3b6c43fe4686780cceb` |
| `adam-smasher-full-borg.png` | 16 | 16 | 12 px | 0 | 0 | 683353 / 25907 / 339316 | 0 | 0 | `fd84216065044790c7a5be262265439e5820eab7912e1728af9e39139d3b7a05` |

Les cinq fichiers ont egalement : format PNG, mode `RGBA`, dimensions
`1024x1024`, alpha `0..255`, quatre coins `[0,0,0,0]`, `16/16` cellules
occupees et aucune fuite entre cellules.

## Controle visuel final

- Maelstrom conserve la meme crete, la meme grappe optique rouge, le meme pistolet et les memes cybermembres dans les seize poses ;
- le trooper Arasaka conserve son casque ferme, son armure noire-blanche-rouge et son fusil dans toutes les frames ;
- le Wyvern conserve un seul fuselage, deux ailes, deux optiques et le canon ventral ; les deux missiles de la frame speciale restent dans sa cellule ;
- le Basilisk reste un seul hovertank sans roue, chenille, pilote ou vehicule d'escorte ; ses pods lateraux, sa tourelle et son canon restent entiers ;
- Adam Smasher garde le meme chassis full-borg anime, sa face pale, son pod de missiles, ses poings et ses proportions massives ;
- les lignes idle, mouvement, attaque/capacite et degats-mort sont distinctes pour les cinq sujets ;
- les sprites restent lisibles sur damier clair et sombre, sans halo chroma, decor, sol, ombre, texte, watermark ou contenu d'une cellule voisine.

## Hors perimetre confirme

Aucun manifeste, registre, fichier de code, fichier musical, audit global,
configuration, dependance ou fichier appartenant a un autre agent n'a ete
modifie. Aucun commit, push ou deploiement n'a ete execute.
