# Pack d'ennemis Halo genere par OpenAI ImageGen - 2026-07-19

## Perimetre

Ce lot ajoute exactement six planches de sprites et le present audit :

| Ennemi | Sortie |
| --- | --- |
| Paire de Mgalekgolo | `public/sprites/generated/bosses/halo/hunter-bond-pair.png` |
| Jiralhanae Captain | `public/sprites/generated/bosses/halo/brute-captain.png` |
| Groupe de Yanme'e | `public/sprites/generated/bosses/halo/yanme-drone-swarm.png` |
| Flood Carrier Form | `public/sprites/generated/bosses/halo/flood-carrier-form.png` |
| Promethean Knight | `public/sprites/generated/bosses/halo/promethean-knight.png` |
| Mgalekgolo isole | `public/sprites/generated/bosses/halo/hunter-bond-brother.png` |

Aucun manifeste, registre de prompts, fichier source, package, lockfile ou fichier Git n'a ete modifie par ce lot.

## Contrat commun

- Generation : OpenAI ImageGen integre, une production distincte par ennemi.
- Sortie finale : PNG RGBA transparent, `1024x1024`.
- Decoupage : 4 colonnes x 4 lignes, soit 16 cellules de `256x256`.
- Vue : trois-quarts RPG, orientee vers la droite.
- Ligne 1 : idle.
- Ligne 2 : locomotion ou hover.
- Ligne 3 : attaque propre au lore.
- Ligne 4 : hit puis recovery.
- Interdits : grille dessinee, texte, nombre, logo, filigrane, decor, ombre externe, chroma visible, magie ou equipement hors Halo.
- Contrainte de cadre : corps, armes et effets restent integralement dans leur cellule.

## Recherche et incarnations verrouillees

### `hunter-bond-pair.png`

Incarnation verrouillee : Mgalekgolo Covenant de `Halo 4`, armure bleu cobalt, Lekgolo orange, bouclier-pavois au bras gauche et canon d'assaut a combustible au bras droit.

References :

- Halo Waypoint, [Canon Fodder: High-Value Histories](https://www.halowaypoint.com/news/canon-fodder-high-value-histories), section `Igido Nosa Hurru & Ogada Nosa Fasu` : deux colonies Mgalekgolo distinctes formant une paire liee.
- Archive officielle Bungie, [Halo 3: ODST Field Guide - Enemies](https://www.halopedia.org/Archive%3ABungie.net/Halo_3%3A_ODST%3A_Field_Guide#Enemies) : Hunters lourdement blindes, deploiement en paire et discipline de combat.
- Modele de production credite, [Halo 4 high-poly Hunter render](https://www.halopedia.org/File%3AH4-Render-Hunter.jpg) : artiste Furio Tedeschi, fichier source `Hunter_HiresModel.jpg`.
- Reference d'armement, [Assault cannon](https://www.halopedia.org/Assault_cannon) : arme lourde a combustible montee au bras droit des Mgalekgolo.

Verrou de lecture : exactement deux corps complets et separes dans chacune des 16 cellules, avec un espace transparent visible entre eux. Aucun corps fusionne et aucune cellule a un seul Hunter.

### `brute-captain.png`

Incarnation verrouillee : Jiralhanae Captain standard de la version commerciale de `Halo 3`, et non le prototype rouge de production ni une variante Banished. L'armure de commandement est violet irise, avec des reflets bleu-violet et rouge-pourpre. L'arme est le Jovokada Workshop Brute Shot.

References :

- Portfolio de production credite d'Isaac Hannaford, [Halo 3 Brute permutations, and experiments](https://isaachannaford.artstation.com/projects/3E84B).
- Reference de rang, [Captain (Covenant)](https://www.halopedia.org/Captain_%28Covenant%29) : le Captain regulier de la Grande Schisme porte l'armure de puissance irisee pourpre-rouge.
- Reference de version finale, [Leader power armor](https://www.halopedia.org/Leader_power_armor) : violet pour le Captain standard; le rouge pur appartient a un essai ancien.
- Reference d'armement, [Jovokada Workshop Brute Shot](https://www.halopedia.org/Jovokada_Workshop_Brute_Shot) et [Brute Captain](https://www.halopedia.org/Brute_Captain) : lance-grenades lourd et armement caracteristique du Captain.

Verrou de lecture : un seul Jiralhanae par cellule, meme armure et meme Brute Shot dans les 16 poses. L'attaque est une sequence lever, viser, tirer une grenade explosive orange, absorber le recul.

### `yanme-drone-swarm.png`

Incarnation verrouillee : exactement quatre Yanme'e communs de `Halo 3: ODST`, carapaces vert-brun, ailes translucides, anatomie arthropode et Eos'Mak-pattern Plasma Pistols. La formation reste un losange lisible.

References :

- Archive officielle Bungie, [Halo 3: ODST Field Guide - Drone](https://www.halopedia.org/Archive%3ABungie.net/Halo_3%3A_ODST%3A_Field_Guide#Enemies) : arthropodes volants multi-membres, deployes par groupes de quatre ou plus.
- Halo Waypoint, [Canon Fodder: High-Value Histories](https://www.halowaypoint.com/news/canon-fodder-high-value-histories), section `Yanme'e Hiveward` : castes de ruche et defense coordonnee.
- Visuel Waypoint archive, [HODST Yanme'e - Waypoint Universe](https://wiki.halo.fr/Fichier%3AHODST-Yanme%27e_%28Way_square%29.jpg), media source `Halo 3: ODST`.
- Reference d'armement, [Eos'Mak-pattern Plasma Pistol](https://www.halopedia.org/Plasma_Pistol) : arme Covenant couramment utilisee par les Yanme'e et montree sur les essaims de `Halo 3`.

Verrou de lecture : quatre silhouettes distinctes dans chaque cellule, jamais trois ou cinq. Les quatre armes sont conservees et les tirs bleus-blancs restent limites a la ligne d'attaque.

### `flood-carrier-form.png`

Incarnation verrouillee : Carrier Form standard de `Halo: Combat Evolved Anniversary`, corps bulbeux et gonfle, jambes atrophiees et appendices tentaculaires. Ce n'est ni un Combat Form, ni un zombie humain reconnaissable, ni un Bomber, Burster ou Spawner specialise.

References :

- Reference de synthese sourcee, [Flood carrier form](https://www.halopedia.org/Flood_carrier_form) : morphologie, incubation, approche de la cible puis rupture du sac.
- `Halo Encyclopedia` (edition 2022), page 409, source principale citee pour le comportement du Carrier Form.
- `Halo: Official Spartan Field Manual`, page 174, source citee pour la conversion des hotes inaptes au combat.
- Visuel officiel archive, [HCEA Flood - Waypoint Universe](https://wiki.halo.fr/Fichier%3AHCEA-Flood_%28Way_square%29.jpg), complete par la galerie `Halo: Combat Evolved Anniversary` de la reference ci-dessus.

Verrou de lecture : une seule Carrier Form par cellule. Les Infection Forms n'apparaissent que pendant la rupture d'attaque, ligne 3, puis disparaissent totalement de la ligne hit/recovery.

### `promethean-knight.png`

Incarnation verrouillee : Promethean Knight standard mineur de `Halo 4`, sans melange avec un Commander, Lancer, Warden, Watcher ou Crawler. Carapace Forerunner anthracite flottante, noyau et jointures hard-light orange, arme unique Z-250 LightRifle.

References :

- Halo Waypoint, [Canon Fodder: Decennial Delights](https://www.halowaypoint.com/news/canon-fodder-decennial-delights) : origine des Knights et captures directes de `Halo 4`.
- Reference editoriale officielle, [Awakening: The Art of Halo 4](https://www.penguinrandomhouse.com/books/223050/awakening-the-art-of-halo-4-by-paul-davies/), art book de production avec commentaires de l'equipe 343 Industries.
- [Promethean Knight](https://www.halopedia.org/Promethean_Knight), dont les sources principales sont `Halo Encyclopedia` (2022), pages 322-333, et `Halo 4: The Essential Visual Guide`, pages 54-57.
- Reference d'armement, [Promethean Knight gameplay](https://www.halopedia.org/Promethean_Knight/Gameplay) : LightRifle parmi les armements Forerunner par defaut.

Verrou de lecture : un seul Knight et un seul LightRifle par cellule. Le deplacement emploie le pas/hover mecanique propre au Knight; l'attaque est un tir de LightRifle orange, sans sort invente.

### `hunter-bond-brother.png`

Incarnation verrouillee : le meme Mgalekgolo `Halo 4` que la paire, isole pour le slot de gameplay solo. La morphologie de bond brother, l'armure bleue, le bouclier gauche et le canon d'assaut droit sont conserves.

References : les quatre references Mgalekgolo de `hunter-bond-pair.png`, notamment le modele de production de Furio Tedeschi et la section `Bond brothers` de [Mgalekgolo](https://www.halopedia.org/Mgalekgolo).

Verrou de lecture : exactement un corps dans chacune des 16 cellules, sans second Hunter partiel, silhouette distante ou membre fusionne.

## Prompts de production

Chaque appel ImageGen a recu le bloc commun suivant, suivi du verrou propre a l'ennemi.

```text
OpenAI ImageGen. Create one square sprite sheet targeting 1024x1024 in polished,
dark, high-detail pixel art consistent with an RPG combat game. Use an invisible
4 columns x 4 rows layout. Every conceptual cell is one 256x256 frame and must
contain the complete subject, complete weapon and complete effect with safe empty
padding. Three-quarter RPG view facing right in all frames. Row 1: four distinct
idle frames. Row 2: four distinct locomotion or hover frames. Row 3: four-frame
canonical attack sequence. Row 4: four-frame hit and recovery sequence. Keep
identity, anatomy, armor, weapon, count, camera, palette and scale stable across
all 16 genuinely different frames. Use a perfectly flat #FF00FF chroma background
for later transparency. No grid lines, borders, text, numbers, logo, watermark,
scenery, floor, external cast shadow or extra character. No magic or equipment
outside Halo canon.
```

Prompt propre a `hunter-bond-pair.png` :

```text
Exactly TWO separate Halo 4-era Covenant Mgalekgolo Hunters in EVERY frame,
never one, never three and never merged. Keep a visible transparent gap between
both complete bodies. Stagger the bond brothers rear-left and front-right.
Both have cobalt-blue Covenant armor, exposed orange Lekgolo worms, a large left
pavise shield and a right-arm fuel-gel assault cannon. Idle: guarded breathing
and small independent weight shifts. Locomotion: synchronized heavy advance.
Attack: brace, charge green incendiary gel, rear Hunter fires while front guards,
then front Hunter fires while rear covers. Hit/recovery: separate reactions,
never collapsing into one silhouette.
```

Prompt propre a `brute-captain.png` :

```text
Exactly ONE retail Halo 3 standard Jiralhanae Captain in every frame. Massive
ape-like build, canonical leader power armor with iridescent violet-blue and
red-purple panels, not gold, cyan, pure prototype red or Banished armor. Keep one
canonical Jovokada Workshop Brute Shot with curved bayonet in every frame.
Locomotion is a heavy rightward march. Attack: raise the Brute Shot, aim, fire
one orange explosive grenade, absorb recoil. Hit/recovery keeps armor and weapon.
```

Prompt propre a `yanme-drone-swarm.png` :

```text
Exactly FOUR Halo 3: ODST Yanme'e Drones in EVERY frame, never three or five.
Keep the same four green-brown insectoid Covenant bodies, translucent paired
wings, multi-limbed silhouettes and one purple Eos'Mak-pattern Plasma Pistol per
Drone. Maintain a readable diamond formation and stable scale. Idle: wing beats.
Locomotion: coordinated hover-flight to the right. Attack: all four aim and fire
blue-white plasma bolts. Hit/recovery: four separate staggered reactions while
all four remain visible.
```

Prompt propre a `flood-carrier-form.png` :

```text
Exactly ONE standard Halo: Combat Evolved Anniversary Flood Carrier Form in every
frame: canonical huge bloated upper sac, mottled Flood biomass, two tentacular
appendages and short withered legs. No recognizable human head, uniform, armor,
handheld weapon or combat-form zombie anatomy. Idle: sac pulse. Locomotion:
awkward rightward waddle. Attack: swelling pressure, rupture, then release small
Pod Infection Forms only in attack frames 3 and 4. No Infection Forms anywhere
in idle, locomotion or hit/recovery. Recovery returns to the same Carrier Form.
```

Prompt propre a `promethean-knight.png` :

```text
Exactly ONE Halo 4 standard minor Promethean Knight in every frame, with one
canonical Z-250 LightRifle. Preserve the charcoal/gunmetal floating Forerunner
carapace, angular helmet, orange luminous core and orange hard-light seams.
No Watcher, Crawler, Warden, Commander ornament, Covenant armor or magic.
Locomotion: mechanical hover-step and short phase reposition. Attack: raise,
charge and fire the LightRifle with restrained orange Forerunner muzzle energy,
then recoil. Hit/recovery exposes the same orange core without changing identity.
```

Prompt propre a `hunter-bond-brother.png` :

```text
Exactly ONE Halo 4-era Covenant Mgalekgolo Hunter in every frame, never a pair
and never a partial second body. Match the pair sheet: cobalt-blue armor, orange
Lekgolo worms, complete left pavise shield and complete right-arm fuel-gel
assault cannon. Idle: guarded breathing. Locomotion: heavy rightward advance.
Attack: brace, charge green incendiary gel, fire, recoil. Hit/recovery: shield
dip, exposed-worm flinch and return to guard. Keep the lone body complete.
```

## Post-traitement

1. Le fond magenta uniforme a ete detoure localement avec le script OpenAI ImageGen `remove_chroma_key.py`, en soft matte et despill.
2. Les sorties natives ImageGen ont ete converties en PNG RGBA.
3. Les planches ont ete ramenees a `1024x1024`.
4. Cinq planches ont ete normalisees cellule par cellule avec `scripts/normalizeGeneratedSpriteSheet.py`.
5. La planche Yanme'e a conserve un redimensionnement global uniforme, puis un inset identique de 12 px par cellule, afin de maintenir exactement la meme echelle de groupe dans les 16 frames.
6. Les pixels RGB entierement transparents ont ete remis a zero.

## Validation automatisee

| Fichier | Format | Cellules occupees | Cellules uniques | Marge min. | Chroma visible | RGB cache sous alpha 0 | Difference adjacente min. / moy. | SHA-256 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `hunter-bond-pair.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 13.258 / 18.831 | `89979811045f6f8cb4f01629055ba54450707daa63ace40576ccf84158c42212` |
| `brute-captain.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 5.889 / 18.937 | `3fb09a042e15f8bab1946a3b36a167be24f534bbb22d3d629f25f168fa2e4bb0` |
| `yanme-drone-swarm.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 11.562 / 15.656 | `6634d41b17680645ad5d109c3b93d712a7c3b51d8dcf755d13233017b662b803` |
| `flood-carrier-form.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 14.611 / 26.683 | `29144cde697e062866a13be0b2b0c173d972d5faac65e94ffb34011d3ed0c26b` |
| `promethean-knight.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 8.536 / 18.180 | `e06971e736428e8e41defe54061c2aed8a596c06aebcf10fe9ce672bbeb896c2` |
| `hunter-bond-brother.png` | 1024x1024 RGBA | 16/16 | 16/16 | 12 px | 0 | 0 | 17.890 / 28.643 | `680c003b2c32baf20e740d06384bf6b6d5f3f934e53daea0abf38eec7a602a0e` |

Tous les fichiers ont egalement passe les controles suivants :

- mode reel `RGBA`, plage alpha `0..255`;
- 96 cellules attendues occupees et 96 cellules bit-a-bit uniques;
- aucun pixel de sujet ne franchit une limite de cellule de 256 px;
- aucun residu magenta visible et aucun RGB cache sous alpha nul;
- aucun texte, grille, logo, decor, ombre externe ou personnage supplementaire;
- poses distinctes et progression lisible pour idle, mouvement, attaque et hit/recovery.

## Validation visuelle

Les six PNG finaux ont ete inspectes a leur resolution native, cellule par cellule.

- Paire Hunter : comptage manuel `2,2,2,2` sur chaque ligne; deux corps distincts dans les 16 frames.
- Hunter solo : comptage manuel `1,1,1,1` sur chaque ligne; aucun morceau de second Hunter.
- Yanme'e : comptage manuel `4,4,4,4` sur chaque ligne; quatre Drones stables dans les 16 frames.
- Carrier Form : une seule forme gonflee; Infection Forms uniquement pendant la rupture de la ligne 3; aucune silhouette humaine zombie.
- Brute Captain : armure, casque et Brute Shot constants; projectile uniquement pendant l'attaque.
- Promethean Knight : une carapace, un noyau et un LightRifle constants; aucun Watcher ou Crawler ajoute.
- Les corps, boucliers, armes, ailes et effets sont complets, avec au moins 12 px transparents avant chaque bord de cellule.
- La palette, l'echelle et l'orientation restent coherentes entre les quatre lignes de chaque planche.

Ces sprites sont des interpretations pixel art originales guidees par les references; aucun asset de production officiel n'a ete integre ou recopie dans le depot.
