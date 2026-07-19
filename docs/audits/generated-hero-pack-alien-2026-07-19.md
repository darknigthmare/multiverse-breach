# Production visuelle heros Alien - 2026-07-19

## Perimetre

Ce lot ajoute exactement six sprite sheets OpenAI ImageGen :

| Heros | Incarnation verrouillee | Sortie |
| --- | --- | --- |
| Captain Arthur Dallas | `Alien` (1979) | `public/sprites/generated/heroes/alien/dallas-alien.png` |
| Dennis Parker | `Alien` (1979) | `public/sprites/generated/heroes/alien/parker-alien.png` |
| Joan Lambert | `Alien` (1979) | `public/sprites/generated/heroes/alien/lambert-alien.png` |
| Rebecca "Newt" Jorden | `Aliens` (1986) | `public/sprites/generated/heroes/alien/newt-aliens.png` |
| Ash | `Alien` (1979) | `public/sprites/generated/heroes/alien/ash-alien.png` |
| Amanda Ripley | `Alien: Isolation` (2014) | `public/sprites/generated/heroes/alien/amanda-ripley.png` |

Aucun manifeste, registre de sprites, prompt global, fichier JavaScript,
package, lockfile ou fichier Git n'a ete modifie.

## References

### Sources officielles de continuite

- `Alien` (1979), page officielle 20th Century Studios :
  https://www.20thcenturystudios.com/movies/alien
- `Aliens` (1986), page officielle 20th Century Studios :
  https://www.20thcenturystudios.com/movies/aliens
- `Alien: Isolation`, site officiel SEGA :
  https://alienisolation.sega.jp/summary.html
- Gameplay et equipement de survie, site officiel SEGA :
  https://alienisolation.sega.jp/battle.html
- Galerie officielle `Alien: Isolation` de Creative Assembly :
  https://creativeassembly.artstation.com/albums/842094
- Presentation officielle PlayStation d'Amanda Ripley :
  https://www.playstation.com/en-us/games/alien-isolation/
- Manuel de `Alien: Isolation - The Collection`, edition Feral/SEGA :
  https://www.feralinteractive.com/en/manuals/alienisolation/latest/steam/

### Costumes, accessoires et photogrammes

- Galerie de photogrammes de production `Alien` :
  https://www.avpgalaxy.net/alien-movies/alien/gallery/production-stills/
- Veste d'equipage Nostromo, prototype de production documente par Propstore :
  https://propstore.com/product/alien-1979/womens-uscss-nostromo-crew-jacket-prototype/
- Combinaison de vol Nostromo portee par Ash, Propstore :
  https://propstore.com/product/alien-1979/lot-6-ashs-ian-holm-nostromo-flight-suit/
- Veste verte matelassee de Lambert, catalogue Profiles in History :
  https://profilesinhistory.com/flipbooks/Hollywood65/files/basic-html/page430.html
- Details de chemises, couleurs, insignes et coupe Nostromo mesures sur
  costumes de production, RPF Costume and Prop Maker Community :
  https://www.therpf.com/forums/threads/1979-alien-nostromo-crew-uniform-now-taking-orders.338013/
- Incinerator unit de `Alien` (1979), Propstore :
  https://propstore.com/product/alien-1979/ripley-s-sigourney-weaver-flamethrower/
- Reproduction licenciee de Newt fondee sur son apparence de `Aliens`, NECA :
  https://necaonline.com/2016/08/aliens-30th-anniversary-rescuing-newt-deluxe-action-figure-2-pack/

Les sources de vente et de reproduction n'ont servi qu'a verifier les
matieres, les coupes, les couleurs et les accessoires. Aucun visuel officiel
n'est redistribue dans le projet.

## Verrous d'incarnation

### Captain Dallas

- Ressemblance stylisee de Tom Skerritt : visage burine, moustache brune,
  cheveux bruns courts et silhouette de capitaine civil.
- Veste Nostromo bleu-gris sombre, passepoils rouge-rose, chemise claire,
  pantalon utilitaire et bottes de travail.
- Incinerator unit gris de 1979 visible uniquement en ligne 3.
- Aucun casque, spacesuit, pulse rifle ou element de Colonial Marine.

### Dennis Parker

- Ressemblance stylisee de Yaphet Kotto : carrure forte, cheveux courts,
  moustache et bandeau bleu.
- Workwear Nostromo civil : chemise ivoire ouverte, sous-couche olive,
  pantalon de travail bleu et ceinture d'outils.
- Cle de maintenance lourde conservee avec le personnage.
- Cle puis incinerator d'urgence en ligne 3, sans armure militaire.

### Joan Lambert

- Ressemblance stylisee de Veronica Cartwright : visage expressif et cheveux
  bruns courts et ondules.
- Veste Nostromo verte matelassee avec passepoils clairs, gilet brun,
  pantalon utilitaire olive et bottes western de travail.
- Lampe/scanner portable et mouvement d'esquive seulement.
- Aucune arme, magie, armure ou tenue de Ripley.

### Rebecca "Newt" Jorden

- Enfant d'environ dix ans avec proportions enfantines, cheveux blond fonce
  ou brun clair sales et visage inspire respectueusement de Carrie Henn.
- Chemise tan usee, salopette denim bleue dechiree aux genoux, une bretelle
  lache et petites chaussures claires.
- Lampe et locator/transpondeur au poignet.
- Aucune arme a feu, militarisation, sexualisation ou violence graphique.

### Ash

- Ash de 1979, ressemblance stylisee de Ian Holm : homme pale d'age moyen,
  cheveux courts degarnis, visage calme et compact.
- Uniforme Nostromo bleu-vert clair de science officer, pantalon assorti,
  poches zippees, chaussures claires et scanner compact.
- Force synthetique representee par la torsion physique d'une barre
  metallique, sans aura, magie, electricite ou liquide blanc.
- Aucun visage de Lance Henriksen, uniforme Sulaco ou melange avec Bishop.

### Amanda Ripley

- Amanda du jeu `Alien: Isolation`, distincte d'Ellen et de Sigourney Weaver.
- Tenue Sevastopol : combinaison utilitaire olive-charbon a poches et epaules
  matelassees, sous-chemise claire, montre retro, cle, sangle et chaussures
  de travail claires.
- Maintenance jack, revolver et flamethrower uniquement en ligne 3.
- Aucun pulse rifle, power loader, uniforme Colonial Marine ou arme futuriste.

## Generation OpenAI

- Outil : OpenAI ImageGen integre, un appel distinct par heros.
- Style : pixel art retro semi-realiste detaille, ressemblance stylisee sans
  photorealisme.
- References locales :
  `public/sprites/generated/heroes/alien/ripley.png` pour Dallas, Parker,
  Lambert, Newt et Amanda ; `bishop.png` pour Ash.
- Usage des references locales : densite de pixel art, echelle de silhouette,
  angle RPG trois-quarts vers la droite et geometrie 4 x 4 uniquement.
- Masters ImageGen : RGB `1254 x 1254` sur chroma magenta uniforme.
- Detourage : helper OpenAI `remove_chroma_key.py`, echantillonnage de bord,
  matte adouci, despill et contraction de bord de 1 px.
- Reconstruction : decoupe des 16 cellules, filtrage des composants
  `alpha > 12`, echelle uniforme par heros et recentrage avec garde de 12 px.
- La passe finale rattache aussi les petits composants de tete ou d'equipement
  places par ImageGen juste au-dessus ou a cote de leur corps, afin qu'aucune
  partie de la ligne suivante n'apparaisse dans la frame courante.
- Nettoyage : RGB mis a zero sous alpha nul et suppression de deux pixels de
  frange chroma semi-transparente sur Ash.
- Sorties : PNG RGBA transparent `1024 x 1024`.

## Contrat commun des prompts

Le contrat suivant a ete applique aux six appels :

```text
Use case: stylized-concept.
Asset type: production animation sprite sheet for a 2D RPG.

Create exactly one square 1024x1024 detailed pixel-art sprite sheet.
Conceptually divide the canvas into exactly 4 columns by 4 rows of equal
256x256 cells, but do not draw any grid, border, separator, guide, label,
text, logo or cell background. Place exactly one complete full-body pose
inside every cell, sixteen poses total. Keep the body, hair, footwear,
equipment and every effect inside its own cell. Use a stable full-body scale,
stable foot baseline and a right-facing three-quarter RPG view.

Row 1: four subtle idle phases.
Row 2: four distinct rightward run or movement phases.
Row 3: four lore-grounded action or attack phases.
Row 4: four non-graphic hit and recovery phases.

Keep the same face, age, body, costume, palette and permitted equipment in
all sixteen frames. Use a respectful recognizable stylized likeness without
photorealism. High-quality semi-realistic retro pixel art, crisp deliberate
pixel clusters and readable silhouettes.

Background: perfectly flat solid #FF00FF chroma key. No shadow, gradient,
floor, texture, reflection, scenery or lighting variation. Do not use
magenta in the subject.

Avoid extra people, duplicate frames, merged limbs, cropped feet, cut-off
effects, readable text, watermark, visible grid, checkerboard, scenery,
chroma spill and any franchise-incarnation mixing.
```

## Prompts specifiques

### `dallas-alien.png`

```text
Captain Arthur Dallas as played by Tom Skerritt in Alien (1979): rugged
middle-aged white man, weathered angular face, thick brown moustache, short
brown hair, lean working-captain build. Dark slate blue-gray Nostromo crew
jacket with red-pink piping, practical zipped pockets and utility lacing,
off-white crew shirt, blue-gray cargo trousers, work belt, brown-black boots
and retro dual digital wristwatch.

Row 1 idle and row 2 run with empty hands. Row 3: raise, aim, fire one
controlled orange-yellow burst from the 1979 emergency incinerator, then
recover. The incinerator appears only in row 3. Row 4: flinch, recoil,
crouched brace and regain stance.

Never use an EVA suit, Colonial Marine armor, helmet, pulse rifle, smartgun
or modern tactical gear.
```

### `parker-alien.png`

```text
Dennis Parker as played by Yaphet Kotto in Alien (1979): strong stocky
middle-aged Black man, close-cropped hair, broad face, short moustache and
iconic blue cloth headband. Worn ivory short-sleeve Nostromo work shirt open
over an olive undershirt, blue-gray work trousers, tool belt, scuffed boots
and retro watch. Civilian engineer, never a soldier.

Row 1 idle with one heavy maintenance wrench. Row 2 run with the wrench
secured close. Row 3: wrench wind-up, heavy wrench swing, raise the 1979
emergency incinerator, then one short controlled flame burst. Row 4:
non-graphic hit and recovery with the wrench, no incinerator.

Never use Colonial Marine armor, helmet, pulse rifle, smartgun or tactical
vest.
```

### `lambert-alien.png`

```text
Joan Lambert as played by Veronica Cartwright in Alien (1979): pale adult
white woman, expressive worried face, short tousled wavy brown bob and slim
practical build. Muted green quilted Nostromo jacket with white piping,
brown work vest, off-white shirt, olive cargo trousers and scuffed brown
western-style work boots.

Keep one practical handheld lamp/scanner. Row 3: raise the lamp, sweep a
narrow pale-amber beam, duck sharply and perform an evasive side-step or low
roll. No weapon, attack projectile, magic or energy power.

Never use Colonial Marine armor, firearm, flamethrower, EVA suit or Ripley
features.
```

### `newt-aliens.png`

```text
Rebecca "Newt" Jorden as played by Carrie Henn in Aliens (1986):
approximately ten-year-old white girl, small natural child anatomy, dirty
light-brown to dark-blonde shoulder-length hair, youthful face and alert
eyes. Worn tan-brown shirt under faded blue denim bib overalls, one strap
loose, torn knees and plain gray-white lace-up shoes.

Her only equipment is a small flashlight and wrist locator/transponder.
Row 3: check locator, sweep a narrow flashlight beam, duck low and make a
quick evasive scramble. Child-safe survival action only.

Never use a firearm, knife, flamethrower, military armor, adult anatomy,
sexualization, gore, facehugger or graphic injury.
```

### `ash-alien.png`

```text
Science Officer Ash as played by Ian Holm in Alien (1979): pale middle-aged
white man, compact build, receding short light-brown hair, narrow calm face,
watchful eyes and clean-shaven. Seafoam blue to faded blue-gray Nostromo
science-officer uniform with zipped pockets, matching trousers, dark belt,
off-white work shoes, retro watch and compact boxy scanner.

Row 3: set the scanner at the belt, seize a thick charcoal steel maintenance
bar, bend it with bare hands, wrench it apart and recover. Physical synthetic
strength only, with tiny neutral metal flecks.

Never use Bishop's face, Sulaco uniform, Colonial Marine equipment, firearm,
magic, aura, glowing hands, electricity, decapitation, white android fluid or
exposed machinery.
```

### `amanda-ripley.png`

```text
Amanda Ripley from Creative Assembly and SEGA's Alien: Isolation (2014):
adult white woman in her late twenties, determined official-game-inspired
face, medium-brown hair in a loose low ponytail and lean engineer build.
Canonical Sevastopol outfit: dark olive-green to charcoal utility jumpsuit
with functional zip pockets and quilted shoulders, pale undershirt, utility
belt, key necklace, retro dual-face watch, satchel strap and pale high-top
work shoes.

Rows 1 and 2 use empty hands. Row 3 uses only canonical equipment: frame 1
maintenance-jack wind-up, frame 2 jack swing, frame 3 compact revolver shot,
frame 4 short controlled industrial flamethrower burst. Row 4 uses empty
hands for non-graphic recovery.

Never use Ellen Ripley's face, Sigourney Weaver's likeness, Colonial Marine
armor, pulse rifle, smartgun, power loader or futuristic energy weapons.
```

## Contrat des animations

| Ligne | Animation | Frames |
| --- | --- | ---: |
| 1 | Idle, respiration et vigilance | 4 |
| 2 | Course ou mouvement vers la droite | 4 |
| 3 | Action ou attaque conforme au lore | 4 |
| 4 | Hit, recul, appui et reprise | 4 |

## Validation technique

Seuil d'occupation et de garde : `alpha > 12`.

| Fichier | Format | Cellules | Distinctes | Marge min. | Pixels dans garde | Chroma visible | RGB sous alpha 0 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `dallas-alien.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `parker-alien.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `lambert-alien.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `newt-aliens.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `ash-alien.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |
| `amanda-ripley.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 0 |

La bande de garde mesure 12 px sur chacun des quatre bords de chaque cellule.
Le compteur `Pixels dans garde` couvre donc les pixels visibles situes dans
ces bandes.

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | Difference min. / moyenne entre frames |
| --- | ---: | ---: | ---: | ---: |
| `dallas-alien.png` | 861257 | 44744 | 142575 | 11475 / 16852.0 px |
| `parker-alien.png` | 835493 | 44632 | 168451 | 13024 / 18650.8 px |
| `lambert-alien.png` | 854916 | 40886 | 152774 | 12292 / 17218.6 px |
| `newt-aliens.png` | 881897 | 38835 | 127844 | 10032 / 15103.0 px |
| `ash-alien.png` | 880642 | 70244 | 97690 | 10317 / 14494.3 px |
| `amanda-ripley.png` | 858346 | 49190 | 141040 | 11556 / 17478.9 px |

## Validation visuelle

Les six planches ont ete inspectees en taille native, sur transparence et sur
damier avec les limites exactes des cellules :

- les 96 cellules contiennent un personnage entier et une pose lisible ;
- aucun corps, pied, outil, arme, flamme, faisceau ou particule ne traverse
  une limite de cellule ;
- aucune grille, bordure, etiquette, texte, logo lisible, decor ou watermark
  n'est present dans les PNG finaux ;
- les visages, ages, morphologies, costumes et palettes restent stables sur
  les seize frames de chaque personnage ;
- les quatre frames de course ou mouvement sont distinctes ;
- les actions restent limitees aux accessoires autorises pour chaque
  incarnation ;
- Dallas, Parker, Lambert et Ash restent des civils du Nostromo de 1979 ;
- Newt reste une enfant non armee de `Aliens` (1986) ;
- Amanda reste la protagoniste de `Alien: Isolation`, sans melange avec Ellen
  Ripley ou les Colonial Marines ;
- aucune violence graphique, magie ou effet surnaturel non canonique n'est
  visible.

## Empreintes SHA-256

| Fichier | SHA-256 |
| --- | --- |
| `dallas-alien.png` | `12251CE533D766E64421EB56BA506F6FBA3388EB0A6318A6D887DA36C2BA6D37` |
| `parker-alien.png` | `68BECC54C29B70EBD631B15C09308A1EDA5257F7A7BB456DC7E6FB30AA5A0751` |
| `lambert-alien.png` | `EA557F71A3F3F4C38D9A1038803482AF0491233245AA2D779F280906C9125DB8` |
| `newt-aliens.png` | `454398ECA71585FC04963CF268114AE9DCE5B9F98EDD74F6828AF6FBBF1C776F` |
| `ash-alien.png` | `29CA36FA23D05ECBEBA23A0FF58A62E8E682F35B2F4BBF4CC837EF5C3D250269` |
| `amanda-ripley.png` | `7184A0A5F9E9A687C2AE31A4B56349CC0558F7CD8975CB7AB60F8262442E2D90` |

Les images sont des interpretations pixel art originales guidees par les
references. Aucun fichier visuel officiel n'est inclus dans le pack.
