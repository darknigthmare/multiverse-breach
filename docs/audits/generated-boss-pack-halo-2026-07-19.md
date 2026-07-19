# Audit - pack de boss Halo genere

Date : 2026-07-19

## Perimetre

Quatre planches originales ont ete generees avec OpenAI ImageGen, puis
normalisees et controlees pour le renderer du projet :

- `public/sprites/generated/bosses/halo/gravemind-tendril.png`
- `public/sprites/generated/bosses/halo/ur-didact-echo.png`
- `public/sprites/generated/bosses/halo/gravemind-tendril-node.png`
- `public/sprites/generated/bosses/halo/warden-eternal-fragment.png`

Le format final de chaque fichier est un PNG RGBA transparent de
`1024 x 1024`, decoupe logiquement en `4 x 4` cellules de `256 x 256`.
Les lignes sont, dans l'ordre : idle, mouvement/repositionnement, attaques
lore, hit/recovery.

Aucun manifeste, prompt global, fichier de code, package ou element Git n'a
ete modifie. Les fonds chroma ont uniquement servi d'etape temporaire hors du
depot et ne sont pas presents dans les PNG finaux.

## Recherche visuelle et versions retenues

Les sources ci-dessous ont servi de references visuelles et anatomiques. Les
PNG livres sont des creations originales generees pour le projet : aucun
modele, texture ou rendu officiel n'a ete copie dans les fichiers finaux.

### Gravemind Tendril

Version retenue : appendice du Gravemind de `Halo 2: Anniversary`, recoupe avec
la representation du Gravemind dans `Halo Encyclopedia (2022)`. Il s'agit
d'une excroissance de biomasse Flood du Gravemind, et non d'un
Proto-Gravemind, d'une plante ou d'une creature humanoide.

References :

- [Halo Waypoint - Halo 2: Twentieth Anniversary](https://www.halowaypoint.com/news/halo-2-twentieth-anniversary)
- [Halopedia - Gravemind](https://www.halopedia.org/Gravemind)
- [Halopedia - Gravemind, Halo Encyclopedia 2022 artwork by Guy Warley](https://www.halopedia.org/File%3AGravemind_Enc_22.png)
- [James Ku Art - Halo 2 Anniversary production portfolio](https://www.jameskuart.com/halo2/)
- [WikiHalo - H2A Gravemind production render credited to David Munoz Velazquez and James Ku](https://wiki.halo.fr/Fichier%3AH2A-Gravemind_render_%28James_Ku%29.jpg)

Points verrouilles : masse amorphe Flood, peau gris-brun/olive, faisceaux
musculaires rouges, nodules, tendons et cils osseux. L'extremite est
prehensile, sans visage et sans anatomie vegetale.

### Ur-Didact Echo

Version retenue : l'Ur-Didact, Shadow-of-Sundered-Star, tel qu'il apparait
physiquement dans `Halo 4`. Le visage Forerunner reste expose. L'armure est
sombre, graphite et bronze, avec hardlight orange. Ce n'est ni le Warden
Eternal, ni un sorcier.

References :

- [Halo Waypoint - The Story So Far: The Didact](https://www.halowaypoint.com/news/the-story-so-far-the-didact)
- [Halopedia - Didact](https://www.halopedia.org/Didact)
- [Halopedia - Halo 4 Didact production render by Kolby Jukes](https://www.halopedia.org/File%3AH4_Didact_Crop_1.png)
- [Kolby Jukes - Halo 4 Didact credits](https://kolbyjukes.tumblr.com/post/39975899443/screencap-from-an-ingame-cinematic-from-halo-4-of)
- [Kolby Jukes - Halo 4 and Halo 5 assets](https://www.artstation.com/artwork/RnY4D)
- [John Edwards - Halo 4 Didact Energy Beam VFX](https://jestrange.artstation.com/projects/0XRrdw)

Credits de production repris depuis les pages artistes : modele, textures et
materiaux du Didact par Kolby Jukes; concept par Gabriel Garza et Kenneth
Scott; shaders par Howard Coulby; effets et textures du rayon d'energie par
John Edwards.

### Gravemind Tendril Node

Version retenue : noeud original de biomasse Flood, derive du langage
organique du Gravemind `Halo 2: Anniversary` et de l'illustration
`Halo Encyclopedia (2022)`. Le noeud est bas, large et ancre, avec un bulbe
neural et plusieurs racines. Sa silhouette est volontairement distincte du
simple tendril. Il ne represente ni un Proto-Gravemind, ni une machine.

References :

- [Halo Waypoint - The New Halo Encyclopedia is Out Today](https://www.halowaypoint.com/news/the-new-halo-encyclopedia-is-out-today)
- [Halopedia - Gravemind](https://www.halopedia.org/Gravemind)
- [Halopedia - Gravemind, Halo Encyclopedia 2022 artwork by Guy Warley](https://www.halopedia.org/File%3AGravemind_Enc_22.png)
- [James Ku Art - Halo 2 Anniversary production portfolio](https://www.jameskuart.com/halo2/)

### Warden Eternal Fragment

Version retenue : Warden Eternal de `Halo 5: Guardians`, sous forme de
fragment de construction Prometheenne/Forerunner. Les plaques sont
physiquement separees et reliees par le hardlight. Le visage lumineux, le
torse flottant et l'arme a deux lames restent ceux du Warden, sans element de
chevalier medieval et sans confusion avec le Didact.

References :

- [Halopedia - Warden Eternal](https://www.halopedia.org/Warden_Eternal)
- [Halopedia - Halo 5 Warden Eternal production render by Jaemus Wurzbach](https://www.halopedia.org/File%3AH5G_WardenEternal_Render_2.jpg)
- [Jaemus Wurzbach - Halo 5 Warden Eternal](https://www.artstation.com/artwork/Bwqbm)
- [Halo Waypoint - The New Halo Encyclopedia is Out Today](https://www.halowaypoint.com/news/the-new-halo-encyclopedia-is-out-today)

Credit de production repris depuis la page artiste : Jaemus Wurzbach a cree
le high-res, le game-res et les textures du personnage. Les capacites
retenues suivent le Warden de Halo 5 : arme hardlight a deux lames, rayon
frontal et projectile gravitationnel.

## Prompts de production

Les blocs suivants reproduisent les consignes envoyees a ImageGen; seule la
mise en forme a ete normalisee pour cet audit.

### Contrat commun

```text
USE CASE: stylized-concept, production boss animation sprite sheet.

Create exactly one square 1024x1024 sprite sheet, conceptually divided into a
strict 4-column by 4-row grid of sixteen 256x256 cells. Do not draw the grid.
Place exactly one complete, distinct pose in every cell. Keep every body part,
particle and hardlight or organic effect inside its own cell with at least
18 px of source padding. Use a readable three-quarter RPG view facing right,
or a readable arena angle for large tentacles.

Detailed handcrafted 32-bit pixel art, crisp clustered pixels, consistent
lighting, constant anatomy, armor, materials, palette and equipment across all
sixteen frames. No text, logo, UI, frame numbers, floor, cast shadow, scenery,
border or decoration.

Use only a perfectly flat solid #FF00FF temporary background. No gradient,
texture, glow haze or color spill in the background.

ROW 1: four idle frames.
ROW 2: four movement or repositioning frames.
ROW 3: four lore-authentic attack frames.
ROW 4: four hit or recovery frames.
```

### `gravemind-tendril.png`

```text
SUBJECT: one immense organic Flood appendage grown from the Halo 2 Anniversary
Gravemind. It is only a tendril, never a humanoid, creature torso, generic
plant, tree, vine or Proto-Gravemind. Build a huge thick tapered appendage
rising from a compact torn biomass anchor near the lower-left or lower-center.
Use gray-brown and desaturated olive Flood flesh, exposed dark-red
longitudinal muscle bundles, rope-like tendons, vascular knots, amber
blisters, ivory hooks and short sensory cilia. Its blunt prehensile end splits
into several short gripping lobes; it has no face, eyes, jaw or flower.

ROW 1: four distinct breathing/tensing idle curls.
ROW 2: low drag, rising reach, lateral reposition and guarded withdrawal.
ROW 3: grasping coil, violent downward slam, horizontal arena sweep and
spear-like lash.
ROW 4: ballistic-impact recoil, damaged curl, low exhausted collapse and
guarded re-extension.

Keep the same tissue layers, anchor anatomy, thickness and hooked terminal
lobes in all frames. No machinery, armor, weapon, magic, foliage, leaves,
petals, pot, soil patch, humanoid limbs or mouth.
```

### `ur-didact-echo.png`

```text
SUBJECT: the physical Ur-Didact from Halo 4, not a generic Forerunner, Warden,
Promethean Knight, wizard or spectral mage. Show his exposed Forerunner face:
elongated cranium, crown ridges, layered brow, stern alien features and
ember-orange eyes. Reproduce his massive canonical Halo 4 armor silhouette:
dark graphite and gunmetal interlocking plates, bronze/copper trim, enormous
angular shoulders, high armored collar, heavy forearms and digitigrade
armored legs. Orange hardlight glows only through engineered armor channels.
No helmet, cape, robe, staff, sword or medieval ornament.

ROW 1: four controlled command idles.
ROW 2: heavy step, forward stride, combat pivot and braced reposition.
ROW 3: constraint-field lattice, focused forearm energy beam, gravity/
constraint slam and hardlight repulsion fan.
ROW 4: armor impact stagger, chest-channel hit, low crouched recovery and
guarded reset.

Keep the same face, body proportions, shoulder profile, armor plate map,
bronze trim and orange channels in every frame. Effects must look like
Forerunner technology, never spells, runes, fire magic or sorcery.
```

### `gravemind-tendril-node.png`

```text
SUBJECT: a low, broad, rooted Flood tendril node belonging to the Gravemind's
biomass network. It must be visibly different from a single tendril. Build one
compact anchored mass with a central neural bulb, six to eight fleshy root
lobes, exactly three main active tendrils, one translucent amber infection sac,
dark-red nerve folds, gray-brown/olive skin, veins, cilia and small ivory
hooks. It has no eyes, mouth, face or mechanical parts. It is not a
Proto-Gravemind, plant bulb, flower, turret, machine or vehicle.

ROW 1: four pulsing neural idle states.
ROW 2: root crawl, mass shift, low heave and anchored brace.
ROW 3: tendril lash, hooked grasp, root slam and contained spore burst.
ROW 4: whole-body hit shudder, ruptured nerve/ichor recoil, flattened stunned
state and re-anchoring recovery.

Keep the same bulb, amber sac, root count language, three principal tendrils,
materials and palette across all sixteen cells. Organic effects and spores
must remain inside their source cell.
```

### `warden-eternal-fragment.png`

```text
SUBJECT: the exact Halo 5 Warden Eternal visual language, represented as a
smaller but recognizable fragment of the same Promethean/Forerunner
construction. Use a tall floating body made from physically disconnected
graphite, dark-silver and bronze armor plates linked by orange hardlight.
Include the angular crown and side fins, glowing skull-like orange face
recessed in the head cavity, bright chest core, broad asymmetric shoulders,
separated lower-body plates and the canonical right-side dual-bladed
hardlight weapon. The body has no ordinary human legs and remains visibly
floating.

ROW 1: four hovering command idles.
ROW 2: diagonal hover, hardlight dash, plate-phase reposition and guarded
float.
ROW 3: dual-blade raise/thrust, broad hardlight slash, focused head beam and
contained gravity bomb.
ROW 4: impact stagger, exposed-core recoil, controlled plate fragmentation and
hardlight reassembly/recovery.

Keep the same face, crown, floating plate architecture, chest core, weapon and
orange hardlight color in all frames. Never depict the Ur-Didact, a
Promethean Knight, medieval knight, samurai, human soldier, sorcerer, magic
armor, cape, shield or horse.
```

## Traitement final

1. Generation separee de chaque sujet avec OpenAI ImageGen.
2. Suppression du chroma temporaire par cle de couleur de bord, matte adouci
   et despill.
3. Redimensionnement de la source vers `1024 x 1024`, puis extraction exacte
   des seize cellules de `256 x 256`.
4. Normalisation cellule par cellule dans une zone utile maximale de
   `232 x 232`, centrage horizontal, alignement de base et marge minimale de
   `12 px`.
5. Suppression ciblee des rares fragments isoles provenant d'une cellule
   source voisine, sans retirer les particules d'attaque intentionnelles.
6. Mise a zero des canaux RGB lorsque alpha vaut zero, puis sauvegarde PNG RGBA
   optimisee.

## Validation automatisee

Seuil d'occupation utilise pour les cellules et les marges : `alpha > 12`.
La garde controlee couvre les douze pixels internes de chaque cote de chaque
cellule.

| Fichier | PNG/RGBA | Dimensions | Cellules occupees | Frames distinctes | Marge min. | Pixels dans garde | Magenta visible |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `gravemind-tendril.png` | oui | 1024 x 1024 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `ur-didact-echo.png` | oui | 1024 x 1024 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `gravemind-tendril-node.png` | oui | 1024 x 1024 | 16/16 | 16/16 | 12 px | 0 | 0 |
| `warden-eternal-fragment.png` | oui | 1024 x 1024 | 16/16 | 16/16 | 12 px | 0 | 0 |

| Fichier | Alpha min/max | Pixels transparents | Alpha partiel | Pixels opaques | RGB non nul sous alpha 0 |
| --- | --- | ---: | ---: | ---: | ---: |
| `gravemind-tendril.png` | 0 / 255 | 772390 | 74892 | 201294 | 0 |
| `ur-didact-echo.png` | 0 / 255 | 726991 | 98356 | 223229 | 0 |
| `gravemind-tendril-node.png` | 0 / 255 | 756247 | 78078 | 214251 | 0 |
| `warden-eternal-fragment.png` | 0 / 255 | 774086 | 127115 | 147375 | 0 |

La difference moyenne absolue entre frames adjacentes d'une meme ligne
confirme que les poses ne sont pas des duplications :

| Fichier | Difference min. | Moyenne | Max. |
| --- | ---: | ---: | ---: |
| `gravemind-tendril.png` | 13.389 | 26.343 | 41.213 |
| `ur-didact-echo.png` | 14.351 | 29.778 | 45.380 |
| `gravemind-tendril-node.png` | 11.615 | 17.611 | 31.375 |
| `warden-eternal-fragment.png` | 23.438 | 29.844 | 41.313 |

Empreintes SHA-256 finales :

```text
e33aea39d78298a56fa19190f3e5f31cd0f08ca0b7b2529110b0f4a70f76df86  gravemind-tendril.png
cec128b2b12a4360ec0d78146a3f5e472ed1f93fdeb15b6b3214a0841bee1cc7  ur-didact-echo.png
833c72b8e64c97d8052fc2a05793a1f8102efd6056f559474b52cdfcee984136  gravemind-tendril-node.png
496a8d5e712eca80d6729430315d77ad6f59c6c0ccfed81395966cdb8b9dfea0  warden-eternal-fragment.png
```

## Validation visuelle

- `gravemind-tendril.png` : appendice Flood massif et exclusivement
  organique; silhouette non humanoide; aucune feuille, fleur ou machine;
  quatre attaques lisibles; les fragments parasites de bord ont ete retires.
- `ur-didact-echo.png` : visage de l'Ur-Didact visible, armure Halo 4
  graphite/bronze constante et hardlight orange technologique; aucune robe,
  magie ou silhouette du Warden.
- `gravemind-tendril-node.png` : masse basse et ancree, bulbe, sac et racines
  constants; silhouette distincte du tendril simple; aucune machine et aucun
  Proto-Gravemind.
- `warden-eternal-fragment.png` : face, couronne, plaques flottantes, noyau et
  double lame coherents avec le Warden de Halo 5; aucune armure medievale et
  aucune confusion avec le Didact.
- Les quatre planches ont ete inspectees sur damier avec limites de cellules.
  Aucun corps, effet ou particule visible ne traverse une limite de cellule.
