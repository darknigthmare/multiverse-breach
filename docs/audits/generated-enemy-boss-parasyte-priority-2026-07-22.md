# Lot prioritaire ennemis et boss Parasyte genere par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Ce lot contient quatre planches originales fan-made produites avec exactement
quatre appels OpenAI ImageGen distincts, un appel par planche. Les references
officielles ont uniquement servi a verrouiller les silhouettes, les couleurs,
les vetements et la logique des mutations. Aucun frame d'anime, screenshot,
dessin de production ou asset officiel n'a ete copie dans les PNG livres.

| Role | Sujet | Fichier final | Taille |
|---|---|---|---:|
| Ennemi | Split-Head Parasite | `public/sprites/generated/bosses/parasyte/split-head-parasite.png` | 636624 octets |
| Ennemi | Parasite Dog | `public/sprites/generated/bosses/parasyte/parasite-dog.png` | 747309 octets |
| Ennemi | City Hall Parasite Host | `public/sprites/generated/bosses/parasyte/city-hall-parasite-host.png` | 630966 octets |
| Boss | Hideo Shimada | `public/sprites/generated/bosses/parasyte/hideo-shimada.png` | 586156 octets |

Chaque sortie finale est un PNG `RGBA` de `1024x1024`, organise en grille
stricte `4x4` de cellules `256x256` :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | idle et detection | 4 |
| 2 | marche, course et deplacement offensif | 4 |
| 3 | attaques et mutations canoniques | 4 |
| 4 | degats, effondrement et mort | 4 |

## References inspectees avant generation

### Sources officielles communes

- [VAP - introduction officielle de l'anime](https://www.vap.co.jp/kiseiju/intro/) : principe canonique des parasites qui prennent le cerveau et la tete de leur hote, opposition avec Shinichi et Migi ;
- [Nippon TV - Parasyte -the maxim-](https://www.ntv.co.jp/english/pc/2014/07/parasyte--the-maxim-.html) : continuite de la serie animee 2014 retenue pour tout le lot ;
- [VAP - episode 1](https://www.vap.co.jp/kiseiju/sp/story/01.html) : galerie officielle de la premiere apparition et du parasite canin ;
- [VAP - actualites officielles](https://www.vap.co.jp/kiseiju/news/) : la piste `I AM` y est explicitement associee au combat contre le `parasite dog` de l'episode 1.

### Split-Head Parasite

La fiche est volontairement un ennemi generique, pas un personnage nomme. La
morphologie reprend le langage visuel officiel de l'anime : hote humain banal,
mutation limitee a la tete, chair fibreuse rose-beige, lobes portant yeux et
dents, bords organiques durcis en lames. L'homme en costume anthracite est une
identite originale creee pour le jeu.

### Parasite Dog

L'episode 1 et sa galerie officielle fixent le petit chien tricolore, son pull
vert et sa mutation de tete. La planche conserve le meme corps canin, les quatre
pattes, le collier rouge et les membranes organiques de vol issues de la tete ;
elle n'invente ni loup geant, ni corps humanoide.

### City Hall Parasite Host

- [VAP - episode 20, operation de l'hotel de ville](https://www.vap.co.jp/kiseiju/story/20.html) : galerie et contexte officiels de l'assaut contre le groupe de parasites de Hirokawa.

Le sujet est un employe municipal anonyme original afin de ne pas usurper
Hirokawa, Gotou, Miki ou Hideo. Le costume taupe, le badge sans texte et la
mutation exclusivement cephalique le distinguent des personnages nommes et du
corps multi-parasite de Gotou.

### Hideo Shimada

- [VAP - fiche officielle de Hideo Shimada](https://www.vap.co.jp/kiseiju/sp/chara/shimada.html) : visage, cheveux, proportions et uniforme ;
- [VAP - episode 10](https://www.vap.co.jp/kiseiju/story/10.html) : perte de controle et massacre de l'ecole ;
- [Comic Natalie - feuille de modele creditee](https://natalie.mu/comic/gallery/news/130480/300896) : vues de production publiees avec les credits Iwaaki/Kodansha/VAP/NTV/4cast.

Verrou visuel : adolescent japonais fin, cheveux brun chataigne a meche
centrale, blazer bleu marine, chemise blanche, cravate rouge, pantalon gris et
mocassins noirs. Les degats finaux evoquent l'acide, les impacts et la blessure
au coeur sans montrer Yuko, la police, Shinichi ou un projectile detache.

## Prompts exacts de production

### Split-Head Parasite

```text
Use case: stylized-concept
Asset type: original fan-made transparent-game sprite sheet source for a 2D RPG/Tactics battle game
Primary request: create ONE coherent 4 columns x 4 rows pixel-art animation sheet for one canonical Parasyte -the maxim- generic Split-Head Parasite host. This must be an original fan-made interpretation, not a copied anime frame or official asset.
Canonical subject lock: the exact same adult Japanese male host appears in all 16 cells, lean average human build, charcoal business suit, white shirt, muted dark red tie, black office shoes, short black hair. In calm states he looks almost human and emotionally blank. His parasite has replaced only the head: pale pink-beige fibrous flesh beneath the hair and face, wet crimson folds, small displaced eyes, narrow rows of ivory teeth, and hardened ivory-silver organic scythe edges. Never mutate the torso into a demon, never add extra arms, tail, horns, armor, claws, or alien clothing.
Layout: strict implicit 4x4 grid, exactly 16 equal logical cells, four poses per row. Do NOT draw grid lines, gutters, borders, labels, letters or numbers. Exactly one complete full-body host in every cell. Keep all hair, flesh lobes, teeth, blades, legs and shoes fully inside its own cell with generous source padding. No pose may touch or overlap another cell. No detached parts, no duplicates, no extra creatures. Same scale, outfit, face identity, proportions, battle angle and palette in all frames. Three-quarter side battle view facing right.
Animation:
Row 1 idle: neutral human disguise; wary breathing; a thin vertical facial seam opening; controlled four-lobed split-head threat pose.
Row 2 movement: fast stalking step; running stride; low evasive dash; forward lunge with only a compact partial head split.
Row 3 attacks/mutations: four fleshy head petals open around one central toothed maw; one connected hardened blade lashes forward; two connected scythe tendrils cross-slash; compact snapping-maw finishing strike. Every mutated lobe and blade remains visibly connected to the neck/head of that single host.
Row 4 damage/death: torso recoil with head closing badly; stagger with one head lobe drooping; kneeling collapse; final side fall with parasite tissue slack and still attached. Keep the whole body visible.
Style/medium: highly detailed hand-crafted anime pixel art matching the repository's Parasyte sheets: crisp pixel clusters, sharp dark outline, controlled selective highlights, game-readable silhouette, approximately 16-bit/32-bit fighting-game sprite density, no smooth vector art, no 3D render, no painterly blur.
Lighting/palette: neutral studio-like sprite lighting; charcoal, off-white and muted red clothing; parasite flesh in pale salmon, beige-pink, crimson and ivory. Avoid green in the subject.
Scene/backdrop: perfectly flat uniform solid #00FF00 chroma-key across the entire canvas. No floor plane, scenery, vignette, texture, gradient, glow, halo, contact shadow, cast shadow, reflection or lighting variation. No #00FF00 on the subject.
Constraints: one subject per cell; 16 genuinely distinct poses; no text, logo, watermark, UI, weapon, projectile, blood spray, severed body part, second person, duplicated head, accidental fusion, cropping, grid marks or chromatic aberration.
```

### Parasite Dog

```text
Use case: stylized-concept
Asset type: original fan-made transparent-game sprite sheet source for a 2D RPG/Tactics battle game
Primary request: create ONE coherent 4 columns x 4 rows pixel-art animation sheet for the canonical Parasite Dog encountered early in Parasyte -the maxim-. This must be an original fan-made interpretation, not a copied anime frame or official asset.
Canonical subject lock: the exact same small low-set tricolor corgi-like dog host appears in all 16 cells: black saddle fur, warm tan face and legs, white muzzle/chest/paws, compact body, short legs, red collar, and the same fitted muted moss-green dog sweater in every frame. Its parasite has replaced only the head. In disguise the dog head remains recognizable; during transformation the skull unfolds into pale salmon fibrous lobes, a central toothed maw, eye nodules, ivory hardened cutting edges, and the characteristic two broad organic wing-like membranes used for a brief flight. Keep the original canine torso and all four dog legs; never turn it into a wolf, hound, humanoid, insect, dragon or giant monster. No tail mutation, extra legs, horns or armor.
Layout: strict implicit 4x4 grid, exactly 16 equal logical cells, four poses per row. Do NOT draw grid lines, gutters, borders, labels, letters or numbers. Exactly one complete dog in every cell. Keep ears, collar, sweater, paws, tail, head tissue, wing membranes and blades fully inside its own cell with generous source padding. No pose may touch or overlap another cell. No detached parts, duplicates, extra animals or humans. Same scale, fur markings, sweater, collar and parasite anatomy in all frames. Three-quarter side battle view facing right.
Animation:
Row 1 idle: wary dog stance; sniff and listen; neck tension with a thin head seam; compact partial head opening.
Row 2 movement: walk/trot; low run; full sprint; leap/takeoff with small connected head membranes beginning to spread.
Row 3 attacks/mutations: head opens into a connected toothed flower-maw bite; broad paired fleshy head-wings spread while the whole dog is airborne; one connected hardened blade lashes forward from the open head; compact diving strike with the wing-head folded back. Preserve all four legs and the same dog body in every attack.
Row 4 damage/death: airborne recoil with wings folding; staggering landing; crouched collapse with head tissue drooping; final whole-body side fall with parasite head still attached. No severed pieces.
Style/medium: highly detailed hand-crafted anime pixel art matching the repository's existing Parasyte sheets: crisp pixel clusters, sharp dark outline, controlled highlights, game-readable silhouette, approximately 16-bit/32-bit fighting-game sprite density, no smooth vector art, no 3D render, no painterly blur.
Lighting/palette: neutral sprite lighting; natural black/tan/white fur; muted moss-green sweater; dark red collar; parasite flesh in pale salmon, dusty pink, deep crimson and ivory. Do not use pure magenta on the subject.
Scene/backdrop: perfectly flat uniform solid #FF00FF chroma-key across the entire canvas. No floor plane, scenery, vignette, texture, gradient, glow, halo, contact shadow, cast shadow, reflection or lighting variation. No #FF00FF on the subject.
Constraints: one subject per cell; 16 genuinely distinct poses; no text, logo, watermark, UI, leash, projectile, blood spray, severed part, second creature, duplicated head, accidental fusion, cropping, grid marks or chromatic aberration.
```

### City Hall Parasite Host

```text
Use case: stylized-concept
Asset type: original fan-made transparent-game sprite sheet source for a 2D RPG/Tactics battle game
Primary request: create ONE coherent 4 columns x 4 rows pixel-art animation sheet for one anonymous City Hall Parasite Host from the City Hall extermination operation in Parasyte -the maxim-. This must be an original fan-made interpretation, not a copied anime frame or official asset.
Canonical subject lock: the exact same middle-aged Japanese male municipal-office host appears in all 16 cells, lean average build, tidy short dark-brown hair, blank restrained expression, muted taupe-brown two-piece business suit, pale blue-gray shirt, narrow burgundy tie, brown office shoes, and a small plain clipped ID badge with NO readable text. He looks like an ordinary civil servant in disguise. His parasite has replaced only the head: pale beige-pink fibrous tissue, dusty salmon folds, dark crimson inner flesh, small displaced eyes, narrow ivory teeth and hardened ivory-silver blades. Never identify him as Mayor Hirokawa, Gotou, Miki, Hideo or Shinichi. Never give him Gotou's muscular multi-parasite body. No body mutation, extra arms, tail, horns, armor, claws or supernatural effects.
Layout: strict implicit 4x4 grid, exactly 16 equal logical cells, four poses per row. Do NOT draw grid lines, gutters, borders, labels, letters or numbers. Exactly one complete full-body host in every cell. Keep all hair, flesh tendrils, blades, hands, legs, shoes and badge fully inside its own cell with generous source padding. No pose may touch or overlap another cell. No detached parts, duplicates, squad members or victims. Same scale, outfit, host identity, parasite anatomy, battle angle and palette in all frames. Three-quarter side battle view facing right.
Animation:
Row 1 idle: composed office posture; alert parasite sensing; shoulders tense as one facial seam appears; compact three-lobed head opening.
Row 2 movement: brisk office-shoe stride; hurried run; low evasive dash; aggressive forward lunge with a compact partial head split.
Row 3 attacks/mutations: one connected head blade sweeps horizontally; two connected hardened tendrils form a defensive crossed guard; three connected head scythes thrust in different angles; compact open-maw and blade finishing strike. All organic weapons remain visibly attached to the neck/head of the one host and fit wholly inside each cell.
Row 4 damage/death: recoil as if hit by gunfire but show no shooter/projectile; stagger with one lobe slack; kneeling collapse with suit rumpled; final complete side fall with parasite tissue limp and still attached. Mild dark-red garment damage only, no gore cloud.
Style/medium: highly detailed hand-crafted anime pixel art matching the repository's existing Parasyte sheets: crisp pixel clusters, sharp dark outline, controlled selective highlights, game-readable silhouette, approximately 16-bit/32-bit fighting-game sprite density, no smooth vector art, no 3D render, no painterly blur.
Lighting/palette: neutral sprite lighting; taupe, pale blue-gray and burgundy clothing; parasite flesh in pale beige-pink, salmon, crimson and ivory. Avoid green in the subject.
Scene/backdrop: perfectly flat uniform solid #00FF00 chroma-key across the entire canvas. No floor plane, city hall interior, scenery, vignette, texture, gradient, glow, halo, contact shadow, cast shadow, reflection or lighting variation. No #00FF00 on the subject.
Constraints: one subject per cell; 16 genuinely distinct poses; no text, logo, watermark, UI, firearm, bullet, projectile, blood spray, severed body part, second person, helmeted soldier, duplicated head, accidental fusion, cropping, grid marks or chromatic aberration.
```

### Hideo Shimada

```text
Use case: stylized-concept
Asset type: original fan-made transparent-game boss sprite sheet source for a 2D RPG/Tactics battle game
Primary request: create ONE coherent 4 columns x 4 rows pixel-art animation sheet for Hideo Shimada from the 2014 anime Parasyte -the maxim-. This must be an original fan-made interpretation with new game-animation poses, not a copied anime frame, screenshot, production drawing or official asset.
Official anime identity lock: the exact same late-teen Japanese male Hideo Shimada appears in all 16 cells, slim-lanky but sturdy build, medium-short tousled chestnut-brown hair with a pointed fringe centered on the forehead, light brown eyes, calm attractive face. He wears the exact anime school uniform consistently: fitted dark navy-blue blazer, white dress shirt, narrow deep-red tie, straight medium-gray trousers and black school loafers. No sweater, coat, armor or weapon. In calm states he is controlled and blank. In mutations, only his parasite head transforms: pink-beige fibrous flesh, crimson interior, displaced small eyes, rows of ivory teeth and long hardened ivory-silver blade tendrils. His school-uniform torso, two human arms and two human legs remain intact. During late damage the head becomes asymmetrical and unstable after acid exposure, but remains recognizably the same Hideo host. No extra arms, tail, horns, wings, full-body demon form or Gotou anatomy.
Layout: strict implicit 4x4 grid, exactly 16 equal logical cells, four poses per row. Do NOT draw grid lines, gutters, borders, labels, letters or numbers. Exactly one complete full-body Hideo in every cell. Keep all hair, head tendrils, blades, hands, trousers and shoes fully inside its own cell with generous source padding. No pose may touch or overlap another cell. No detached parts, duplicates, students, police or victims. Same scale, face identity, uniform, proportions, battle angle and palette in all frames. Three-quarter side battle view facing right.
Animation:
Row 1 idle: composed transfer-student stance; subtle parasite sensing; guarded stance with a narrow cheek/forehead seam; controlled compact partial head opening.
Row 2 movement: measured school-hall stride; fast run; low evasive dash; feral forward lunge with a compact asymmetric face split.
Row 3 attacks/mutations: one connected head scythe sweeps horizontally; two connected hardened head blades cross-slash; three connected tendrils fan into an asymmetric school-massacre attack; compact snapping-maw and blade finisher. Every tendril and blade remains visibly attached to Hideo's head/neck and fits fully in its cell.
Row 4 damage/death: acid-destabilized asymmetrical face recoil; bullet-damaged stagger with small dark tears in blazer but no projectile; chest-impact collapse echoing his canonical heart wound without showing the attacker or projectile; final complete side fall with deformed parasite head slack and attached. Keep entire body visible and gore restrained.
Style/medium: highly detailed hand-crafted anime pixel art matching the repository's existing Parasyte sheets: crisp pixel clusters, sharp dark outline, controlled selective highlights, game-readable silhouette, approximately 16-bit/32-bit fighting-game sprite density, no smooth vector art, no 3D render, no painterly blur.
Lighting/palette: neutral sprite lighting; navy blazer, clean white shirt, deep-red tie, gray trousers, chestnut hair; parasite flesh in pale salmon, beige-pink, crimson and ivory. Avoid green in the subject.
Scene/backdrop: perfectly flat uniform solid #00FF00 chroma-key across the entire canvas. No floor plane, school corridor, scenery, vignette, texture, gradient, glow, halo, contact shadow, cast shadow, reflection or lighting variation. No #00FF00 on the subject.
Constraints: one subject per cell; 16 genuinely distinct poses; no text, logo, watermark, UI, firearm, projectile, acid bottle, blood spray, severed body part, second person, duplicated head, accidental fusion, cropping, grid marks or chromatic aberration.
```

## Post-traitement et correction

1. OpenAI ImageGen a produit quatre sources RGB independantes de `1254x1254`.
2. Les trois humains utilisaient un chroma vert ; le chien au pull vert utilisait
   un chroma magenta afin de proteger la couleur canonique du vetement.
3. Chaque fond a ete retire avec le helper OpenAI ImageGen
   `remove_chroma_key.py --auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill
   --edge-contract 1`.
4. Un premier passage `--strict-cells` a confirme les 16 cellules, mais a
   coupe quelques extremites de tetes qui depassaient leur cellule source dans
   les poses de degats.
5. Le mode global du pipeline existant
   `scripts/normalizeGeneratedSpriteSheet.py` a alors rattache chaque composante
   a son corps, redimensionne au pixel le plus proche et recentre les sujets.
   Les quatre reconstructions finales ont `16` corps dans `16` cellules et une
   marge minimale de `12 px`.
6. Une inspection finale a ete faite sur transparence noire puis sur damier
   clair/sombre avec limites de cellules. Les apercus et sources intermediaires
   ne sont pas conserves.

## QA technique finale

Seuil d'occupation, de garde et de chroma : `alpha > 12`. Un residu chroma est
un pixel visible a distance RGB inferieure ou egale a `40` de la cle source.

| Fichier | Cellules | Uniques | Marge min. | Garde 12 px | Bord externe | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `split-head-parasite.png` | 16 | 16 | 12 px | 0 | 0 | 812293 / 46574 / 189709 | 0 | 0 | `c2d3003cf33f910d6150b1a881488397db1d870746cf4a54bb5e91d301a45250` |
| `parasite-dog.png` | 16 | 16 | 12 px | 0 | 0 | 761060 / 77221 / 210295 | 0 | 0 | `41e2b8e5b6cbcc82eaa535202a37a75e96ee9dbb80f7e74226557ee186559803` |
| `city-hall-parasite-host.png` | 16 | 16 | 12 px | 0 | 0 | 830633 / 43352 / 174591 | 0 | 0 | `f8b327ebff42a3dac3ea43a977b6e00e122859e55bf8779a0f2c2c077cca8345` |
| `hideo-shimada.png` | 16 | 16 | 12 px | 0 | 0 | 842303 / 45351 / 160922 | 0 | 0 | `24710ae97dd4cc87ace6ea0ab4c7ef5866907c8f6fd1a0feb5eb7bc30bd729b6` |

Les quatre PNG passent aussi les controles suivants :

- mode `RGBA`, dimensions exactes `1024x1024`, alpha `0..255` ;
- quatre coins `[0,0,0,0]` ;
- zero pixel visible sur le bord externe ;
- zero pixel dans les douze pixels de garde de chaque cellule ;
- zero RGB non nul lorsque `alpha=0` ;
- zero residue vert ou magenta visible ;
- seize cellules non vides et seize contenus binaires distincts.

## Controle visuel final

- les 64 cellules contiennent exactement un sujet entier et lisible ;
- aucun corps, membre, lobe, membrane, tendril ou lame ne traverse une limite ;
- le Split-Head Parasite conserve le meme costume anthracite et une mutation
  limitee a la tete ;
- le Parasite Dog conserve le meme chien tricolore, son pull vert, son collier,
  ses quatre pattes et ses membranes cephaliques ;
- l'hote de l'hotel de ville reste le meme fonctionnaire en costume taupe et ne
  ressemble ni a Hirokawa ni au corps multi-parasite de Gotou ;
- Hideo conserve son visage, ses cheveux et son uniforme officiel bleu, blanc,
  rouge et gris sur les seize poses ;
- les quatre lignes idle, mouvement, attaques/mutations et degats/mort sont
  visuellement distinctes ;
- aucun texte, logo, watermark, decor, sol, grille, second personnage ou
  projectile detache n'apparait dans les fichiers finaux.

## Hors perimetre confirme

Aucun manifeste, registre de sprites, fichier de code, fichier musical,
configuration, dependance ou metadonnee Git n'a ete modifie pour ce lot. Aucun
commit, push ou deploiement n'a ete execute.
