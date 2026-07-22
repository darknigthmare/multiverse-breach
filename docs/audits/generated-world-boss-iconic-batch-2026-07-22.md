# Lot world boss iconiques - OpenAI ImageGen - 2026-07-22

## Perimetre livre

Production strictement limitee aux cinq planches suivantes :

| Univers | Entite | Fichier final |
| --- | --- | --- |
| `Ghostbusters` | Stay Puft Marshmallow Man | `public/sprites/generated/bosses/ghostbusters/stay-puft-marshmallow-man.png` |
| `Ghostbusters` | Gozer the Gozerian | `public/sprites/generated/bosses/ghostbusters/gozer-the-gozerian.png` |
| `Tremors` | Perfection Graboid Trio | `public/sprites/generated/bosses/tremors/perfection-graboid-trio.png` |
| `War of the Worlds` | Fighting Machine / Tripod | `public/sprites/generated/bosses/war-of-the-worlds/fighting-machine-tripod.png` |
| `SPY x FAMILY` | Keith Kepler | `public/sprites/generated/bosses/spy-x-family/keith-kepler.png` |

Les cinq planches sont des fan-arts originaux generes par cinq appels OpenAI
ImageGen independants. Les references ci-dessous ont uniquement servi a fixer
la continuite, la silhouette, les couleurs, l'equipement et les actions. Aucun
photogramme, sprite, modele, jouet, texture ou autre asset officiel n'a ete
copie, trace, decoupe ou integre aux PNG.

Aucun manifeste, registre, code, fichier musical, configuration ou fichier
d'un autre agent n'a ete modifie. Aucun commit, push ou deploiement n'a ete
effectue.

## References consultees avant chaque generation

### Stay Puft Marshmallow Man

- [Sony Pictures - Ghostbusters (1984)](https://www.sonypictures.com/movies/ghostbusters)
- [Ghostbusters - site officiel Sony](https://www.ghostbusters.com/?np=true)
- [Ghostbusters Shop - collection Stay Puft officielle](https://shop.ghostbusters.com/collections/stay-puft)
- [Sony Pictures Brazil - Ghostbusters, visuel officiel du film](https://www.sonypictures.com.br/filmes/os-caca-fantasmas)

Continuite retenue : climax du film live action de 1984. Le verrou visuel est
le geant blanc tres rond, a membres segmentes, bonnet et col marins bleu-blanc,
foulard rouge et visage de mascotte devenant furieux. La derniere ligne reprend
les brulures des flux de protons, la carbonisation et la fonte en marshmallow.
Les Mini-Pufts, les variantes animees et toute inscription sur le bonnet sont
exclus.

### Gozer the Gozerian

- [Sony Pictures - Ghostbusters (1984)](https://www.sonypictures.com/movies/ghostbusters)
- [Hasbro Pulse - gamme Ghostbusters Plasma Series inspiree du film](https://old.uk.hasbropulse.com/blogs/unboxed/the-ghostbusters-plasma-series-collect-more-than-just-spores-molds-and-fungus-copy)
- [Hasbro Pulse - annonce officielle de la figurine Gozer](https://old.uk.hasbropulse.com/blogs/unboxed/nytf-2020-entertainment-brand-preview-event-product-launches)

Continuite retenue : manifestation humanoide androgyne du film de 1984. Gozer
garde la peau pale, les yeux rouges, les levres sombres, la coiffure noire
anguleuse et la combinaison organique nacree couverte de reliefs bulleux. Les
poses de combat reprennent l'esquive acrobatique et les decharges d'energie des
mains. Dana possedee, les Terror Dogs, Stay Puft et la version d'`Afterlife`
sont exclus.

### Perfection Graboid Trio

- [Universal Pictures At Home - Tremors (1990)](https://www.universalpicturesathome.com/movies/tremors)
- [Stampede Entertainment - origine du design des creatures](https://stampede-entertainment.com/site/ufaqs/what-was-the-design-inspiration-for-the-tremors-creatures/)
- [Stampede Entertainment - Tremors FAQ](https://stampede-entertainment.com/site/fan-extras/tremors-faq/?include_category=tremors)

Continuite retenue : Graboids du premier film, a Perfection en 1990. Le design
reprend le corps de ver geant profile brun-ocre, la peau cuirassee, les epines
laterales orientees vers l'arriere, la bouche s'ouvrant comme une fleur et les
trois tentacules prehensiles a petites gueules. Chaque cellule contient
explicitement trois Graboids complets formant un boss collectif. Aucun Shrieker,
Ass Blaster, El Blanco ou Graboid africain n'apparait.

### Fighting Machine / Tripod

- [Paramount Pictures - War of the Worlds (2005)](https://www.paramountpictures.com/movies/war-of-the-worlds-2005)
- [Amblin - War of the Worlds](https://amblin.com/movie/war-of-the-worlds/)
- [Industrial Light & Magic - War of the Worlds VFX](https://www.ilm.com/vfx/war-of-the-worlds/)
- [War of the Worlds Wiki - Fighting Machine, controle secondaire des fonctions](https://waroftheworlds.fandom.com/wiki/Fighting-Machine)

Continuite retenue : film de Steven Spielberg de 2005. La machine conserve le
capot organique de meduse, trois jambes tres longues avec pieds a trois doigts,
phares bleu-blanc, doubles rayons thermiques, tentacules de capture, cages et
bouclier. La machine complete reste lisible dans chaque cellule, y compris dans
l'effondrement biologique final. Les versions de 1953, Jeff Wayne, steampunk et
les autres adaptations sont exclues.

### Keith Kepler

- [SPY x FAMILY officiel - MISSION:13 Project Apple](https://spy-family.net/episodes/episode13.php)
- [SPY x FAMILY officiel - MISSION:14 Disarm the Time Bomb](https://spy-family.net/episodes/episode14.php)
- [SPY x FAMILY officiel - MISSION:15 A New Family](https://spy-family.net/episodes/episode15.php)
- [SPY x FAMILY Wiki - Keith Kepler, controle secondaire des actions](https://spy-x-family.fandom.com/wiki/Keith_Kepler)

Les dix-huit captures officielles des trois pages d'episode ont ete inspectees
localement avant l'appel ImageGen, puis supprimees avec les autres fichiers
temporaires. Le verrou visuel est un jeune homme grand et mince, cheveux brun
tres sombre en bataille, manteau beige, gilet sombre, chemise blanche et
pantalon noir. Ses actions sont limitees au couteau, a la grenade et au
detonateur de l'arc Doggy Crisis. Aucun chien piege, vehicule, Forger, agent
WISE, complice ou second personnage n'apparait.

## Contrat commun des planches

- PNG final `RGBA`, exactement `1024x1024`.
- Grille implicite stricte `4 x 4`, soit seize cellules de `256x256`.
- Garde interne transparente de `12 px` sur chaque cote de chaque cellule.
- Une pose coherente et entierement contenue par cellule ; le trio de Graboids
  est la seule composition multi-entites autorisee.
- Camera de combat trois-quarts orientee vers la droite et proportions stables.
- Pixel art 32-bit detaille, amas de pixels nets et dithering controle.
- Aucun texte, lettre, nombre, logo, watermark, grille, bordure, decor, sol,
  ombre portee ou contenu traversant une cellule voisine.

| Ligne | Fonction | Frames |
| --- | --- | ---: |
| 1 | idle et menace | 4 |
| 2 | mouvement adapte | 4 |
| 3 | attaque canonique | 4 |
| 4 | degats et destruction/defaite | 4 |

## Prompts de production

Les cinq appels ont utilise le socle commun suivant, complete par le verrou et
le plan d'actions propres a chaque entite :

```text
Use case: stylized-concept
Asset type: production-ready 2D fighting-game or world-boss sprite sheet

Create ONE square sprite sheet containing EXACTLY 16 original fan-made
pixel-art frames. This is an original interpretation based only on canonical
visual reference, never a copy, trace, crop, screenshot, model render,
existing sprite, or official asset.

STRICT SHEET LAYOUT:
- Exact implicit 4 columns x 4 rows, 16 equal logical cells.
- Preserve at least 18 pixels of flat background around every source cell.
- No body part, prop, projectile, glow, debris or effect may touch or cross a
  cell boundary.
- One coherent pose per cell with consistent identity, anatomy, palette,
  scale, lighting and three-quarter side-facing-right game camera.
- No panel borders, drawn grid or separators.

STYLE:
- Highly detailed polished 32-bit arcade pixel art, deliberately crisp
  clustered square pixels, strong readable silhouette and controlled
  dithering.
- No painterly brushwork, vector look, 3D render or photorealism.
- Full subject visible in every frame; no cropping.

BACKGROUND FOR EXTRACTION:
- Perfectly flat uniform solid #00FF00 chroma-key background.
- Do not use #00FF00 or green spill in the subject or effects.
- No shadow, floor, scenery, gradient, texture, reflection, UI, text, letters,
  numbers, logo, watermark, signature or title.
```

### Prompt Stay Puft

```text
Subject: the same single colossal Stay Puft Marshmallow Man from the 1984
live-action Ghostbusters film in all 16 cells. Huge rounded white marshmallow
body, short thick legs, puffy segmented arms, mitten hands, small dark eyes,
classic sailor cap with plain blue band and red ribbon shape, blue sailor
collar and vivid red neckerchief. No readable hat writing, Mini-Puft, human or
alternate cartoon design. Keep him large but fully contained, about 190-220 px
tall in each final cell.

Row 1: neutral towering idle; cheerful heavy sway; looming arms raised; angry
clenched-fist roar.
Row 2: right-foot walk; left-foot walk; heavy march; crushing stomp prep.
Row 3: foot lifted; downward stomp with compact impact; broad arm swat;
two-handed downward slam.
Row 4: compact proton burns; localized flames and scorching; charred melting
marshmallow silhouette; contained collapse into marshmallow foam. Non-gory.
```

### Prompt Gozer

```text
Subject: the same single androgynous humanoid Gozer from Ghostbusters (1984).
Tall lean pale supernatural body, angular face, dark eye makeup, glowing red
eyes, black lips, rigid swept-back black hair and fitted pearly organic
bubble-textured suit. Violet-white energy comes only from Gozer. No Dana,
Terror Dog, Stay Puft, Ghostbuster, weapon, cape, crown or Afterlife version.
Keep the full body about 185-218 px tall in each final cell.

Row 1: regal idle; poised sway; contemptuous raised hand; both hands charged.
Row 2: deliberate step; second stalking step; short hover; compact evasive
backflip inspired by the proton-stream dodge.
Row 3: right-hand charge; left-hand charge; branching twin-palm lightning;
two-handed telekinetic blast.
Row 4: proton recoil; scorched stagger; full body dissolving into spectral
particles; complete fading silhouette collapsing around a compact energy core.
```

### Prompt Perfection Graboid Trio

```text
Subject: exactly three classic Graboids from Tremors (1990) in every cell,
never one, two, four or an extra creature. Each has a full streamlined mottled
brown/ochre/charcoal armored worm body, backward side spikes, no eyes or legs,
a flower-like armored mouth and exactly three orange-red grabber tentacles.
Keep the three individuals separate, in a compact triangular formation, never
fused into a hydra. No Shrieker, Ass Blaster, El Blanco, African variant,
human, vehicle or weapon. Formation target: 218-226 px wide and 175-215 px
high per final cell.

Row 1: coiled listening trio; three heads raised; mouths opening; full menace.
Row 2: coordinated S-curve; alternate body wave; compact breach; tunneling
lunge.
Row 3: all grabbers reaching; foreground flower-mouth bite; triple snap;
compact triple eruption.
Row 4: bullet recoil; one blunt crushed head with two staggered; localized
dynamite damage; all three collapsed together with cracked armor and contained
orange residue. All three remain identifiable; creature damage only.
```

### Prompt Fighting Machine / Tripod

```text
Subject: the same single Fighting Machine from Spielberg's War of the Worlds
(2005), fully visible from hood to all three feet. Broad squid/jellyfish-like
organic gunmetal hood, ribbed biomechanical plating, central blue-white lamp,
smaller frontal lights, exactly three extremely long articulated legs with
three-toed feet, twin heat rays, attached capture tentacles and organic cages.
No 1953 craft, Jeff Wayne tripod, steampunk design, wheel, probe, second tripod
or alien pilot. Keep it readable but contained at about 216-228 px tall.

Row 1: neutral tower; scanning hood; tentacles unfurling; lamps and shield.
Row 2: first tripod stride; alternate stride; stalking step; braced turn.
Row 3: twin heat-ray charge; contained twin beam; capture sweep; harvesting
pose with compact red mist.
Row 4: artillery on shield; shield failure; broken heat ray and buckling leg;
biologically disabled machine collapsed intact with all three legs folded.
```

### Prompt Keith Kepler

```text
Subject: the same single Keith Kepler from SPY x FAMILY Missions 13-15 in all
cells. Tall slim young man, pale-light skin, severe eyes, messy dark
brown-black hair, light beige long coat, charcoal vest, white tucked shirt,
black trousers and dark shoes. Canonical props only: silver switchblade, olive
stick grenade and compact detonator. No dog, bomb vest, car, gun, uniform, hat,
tie, Forger, WISE agent, accomplice or second person. Keep him 180-216 px tall
when standing.

Row 1: guarded idle; arrogant smirk; switchblade low; knife threat.
Row 2: brisk step; second step with coat swing; low sprint; desperate run.
Row 3: knife slash; knife thrust; grenade throw; detonator with compact blast.
Row 4: hit recoil; stagger and dropped knife; knocked backward; complete body
lying unconscious on his side. No gore.
```

## Pipeline de normalisation

1. Un appel OpenAI ImageGen distinct a produit chaque planche source carree
   `1254x1254` sur fond chroma vert uniforme.
2. Le helper OpenAI
   `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
   a ete execute avec `--auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill
   --edge-contract 1`.
3. `scripts/normalizeGeneratedSpriteSheet.py` a reconstruit les seize cellules
   en mode multi-composants. Ce mode conserve les rayons, particules,
   tentacules, grenade et les trois Graboids que `--strict-cells` aurait pu
   supprimer.
4. Le normaliseur a limite chaque zone utile a `232x232`, l'a centree dans une
   cellule `256x256` et a impose la garde transparente de `12 px`.
5. Au total, 34 pixels de fringe chroma a alpha tres faible (`13..64`) ont ete
   retires : trois sur Stay Puft, dix-huit sur Gozer, six sur le Graboid Trio et
   sept sur le Tripod. Aucun pixel opaque du sujet n'a ete modifie.
6. La derniere cellule de Gozer a recu une recomposition locale pixel-nearest
   des deux derniers etats ImageGen : silhouette complete en dissolution autour
   du noyau spectral. Aucun visuel externe n'a ete ajoute.
7. Tous les canaux RGB des pixels totalement transparents ont ete remis a
   `0,0,0`.

## Validation automatisee finale

Seuil de presence et de marge : `alpha > 12`. Le controle chroma complementaire
couvre tous les pixels visibles avec `G > 180`, `G > 1.35R` et `G > 1.25B`.
La garde couvre les douze premiers pixels internes de chaque cote de chaque
cellule.

| Planche | Taille / mode | Cellules / uniques | Marge | Garde | Alpha partiel | Chroma | RGB cache | Visible min..max | BBox min. L x H | Diff. adj. min. / moy. |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Stay Puft | 1024x1024 / RGBA | 16 / 16 | 12 px | 0 | 36 666 | 0 | 0 | 11 008..26 533 | 156x136 | 8.448 / 37.281 |
| Gozer | 1024x1024 / RGBA | 16 / 16 | 12 px | 0 | 64 366 | 0 | 0 | 6 141..17 917 | 83x175 | 8.682 / 33.478 |
| Graboid Trio | 1024x1024 / RGBA | 16 / 16 | 12 px | 0 | 63 844 | 0 | 0 | 19 061..30 681 | 232x150 | 14.371 / 23.533 |
| Fighting Machine | 1024x1024 / RGBA | 16 / 16 | 12 px | 0 | 89 345 | 0 | 0 | 9 482..17 063 | 222x116 | 18.087 / 24.592 |
| Keith Kepler | 1024x1024 / RGBA | 16 / 16 | 12 px | 0 | 40 764 | 0 | 0 | 9 295..18 772 | 103x62 | 10.191 / 25.309 |

Controles communs supplementaires :

- plage alpha `0..255` sur les cinq fichiers ;
- quatre coins exactement `[0,0,0,0]` sur les cinq fichiers ;
- zero pixel visible dans les bandes de garde ;
- zero vert chroma visible et zero RGB non nul sous `alpha=0` ;
- seize cellules non vides et seize hashes de cellule distincts par planche.

SHA-256 :

- Stay Puft : `9E739F9DD420462770938BC1304ED0EA14DF78240680AD0B9ADEF39A7B2E0C7A`
- Gozer : `223E4DE1B45066C4D81B21200019C3388AECD8CBD62219972332A9D292C8987F`
- Graboid Trio : `EB9437749A490A047E96A5907C95935C3B32837534A3453EC81B371A2671FBC2`
- Fighting Machine : `B86187A481A69FAB2D27462B1EAE43106C199B4A353972B437D0CCBA3DD000B8`
- Keith Kepler : `9EDF6F86383243F2CE65D6D3E1C73FEB450C866EA02D2B0B90565188EACB079B`

## Inspection visuelle finale

Les cinq PNG ont ete inspectes a leur resolution native, puis sur damier
clair/sombre avec les limites exactes des cellules superposees temporairement.

- Stay Puft conserve sa silhouette geante lisible, son costume marin et ses
  pieds complets dans les seize cellules. Les brulures et la fonte restent
  contenues.
- Gozer garde la meme anatomie, le meme visage et la meme combinaison nacree.
  Les eclairs restent dans leur cellule et la destruction finale conserve une
  silhouette complete autour du noyau spectral.
- Le Graboid Trio contient exactement trois creatures lisibles dans chaque
  cellule. Les neuf grabbers, impacts, debris et fluides restent groupes sans
  traverser les limites.
- Le Tripod conserve le capot, les trois jambes et les trois pieds dans chaque
  frame. Les rayons, tentacules, cages, bouclier et effondrement restent
  entierement contenus.
- Keith reste le seul personnage dans chaque cellule, avec manteau, jambes et
  chaussures complets. Le couteau, la grenade, le detonateur et la chute finale
  restent lisibles et sans gore.
- Aucun texte, logo, watermark, grille, bordure, decor ou silhouette additionnelle
  n'apparait dans les PNG finaux.
