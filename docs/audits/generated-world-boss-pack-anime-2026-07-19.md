# Pack world boss anime OpenAI - 2026-07-19

## Perimetre

Production strictement limitee aux huit plaquettes boss / world boss suivantes :

| Univers | Boss | Sortie |
| --- | --- | --- |
| `Chainsaw Man` | Gun Devil - 20 Percent Manifestation | `public/sprites/generated/bosses/chainsaw-man/gun-devil-20-percent-manifestation.png` |
| `Demon Slayer` | Muzan Kibutsuji | `public/sprites/generated/bosses/demon-slayer/muzan-kibutsuji.png` |
| `Parasyte` | Gotou | `public/sprites/generated/bosses/parasyte/gotou.png` |
| `Tokyo Ghoul` | Eto, One-Eyed Owl | `public/sprites/generated/bosses/tokyo-ghoul/one-eyed-owl.png` |
| `Cowboy Bebop` | Vicious | `public/sprites/generated/bosses/cowboy-bebop/vicious.png` |
| `Dragon Ball Z` | Kid Buu | `public/sprites/generated/bosses/dragon-ball-z/kid-buu.png` |
| `Fullmetal Alchemist: Brotherhood` | Father | `public/sprites/generated/bosses/fullmetal-alchemist/father.png` |
| `Gantz` | Nurarihyon | `public/sprites/generated/bosses/gantz/nurarihyon.png` |

Les huit planches sont des fan-arts originaux generes avec l'outil OpenAI
ImageGen integre. Aucun sprite, screenshot, panneau de manga, artwork, modele,
figurine ou asset officiel n'a ete copie, trace, decoupe ou integre aux PNG.

Aucun fichier de code, manifeste, registre, package, configuration Git ou
deploiement n'a ete modifie pour ce lot.

## References visuelles consultees

### Gun Devil - 20 Percent Manifestation

- [Chainsaw Man Wiki - Gun Devil](https://chainsaw-man.fandom.com/wiki/Gun_Devil)

Verrou retenu : manifestation americaine a 20 %, corps flottant tronque,
squelette et chair seche, tete-barillet de pistolet, bras composes de fusils,
petites tetes incrustees dans le torse et masse de munitions sous la taille.
La forme Aki / Gun Fiend, le Gun Gauntlet, la Statue of Liberty et les autres
pourcentages sont exclus.

### Muzan Kibutsuji

- [Demon Slayer, site anime officiel - Muzan Kibutsuji](https://demonslayer-anime.com/risshihen/character/?chara=muzan)
- [Kimetsu no Yaiba Wiki - Muzan Kibutsuji](https://kimetsu-no-yaiba.fandom.com/wiki/Muzan_Kibutsuji)

Verrou retenu : forme de combat finale du Sunrise Countdown, cheveux blancs,
corps pale marque, bouches et fouets de chair a pointes noires. Les deguisements
au fedora, feminin ou enfantin et la forme nourrisson geante sont exclus.

### Gotou

- [Nippon TV - Parasyte -the maxim-](https://www.ntv.co.jp/english/pc/2014/07/parasyte--the-maxim-.html)
- [Kiseijuu Wiki - Gotou](https://parasyte.fandom.com/wiki/Gotou)

Verrou retenu : corps composite stabilise des cinq Parasites, grand humanoide
musculaire a surface gris-rose, quatre yeux, quatre bras, jambes digitigrades
et queue en faux. Les lames et le bouclier restent des transformations
organiques de ses propres membres.

### Eto, One-Eyed Owl

- [Weekly Young Jump, site officiel Tokyo Ghoul - personnages](https://youngjump.jp/tokyoghoul/tg/chara/)
- [Tokyo Ghoul Wiki - Eto Yoshimura](https://tokyoghoul.fandom.com/wiki/Eto_Yoshimura)

Verrou retenu : Eto uniquement, sous une meme forme kakuja ukaku evoluee,
masque osseux, un kakugan rouge dominant, gueule dentee, armure rouge-noir
plumee et quatre appendices dorsaux fixes. Yoshimura, le Non-Killing Owl, le
Taxidermied Owl et les autres porteurs sont exclus.

### Vicious

- [Sunrise - Cowboy Bebop](https://www.sunrise-inc.co.jp/international/work/detail.php?cid=41)
- [Cowboy Bebop Wiki - Vicious](https://cowboybebop.fandom.com/wiki/Vicious)
- [Artwork Sunrise reference - Vicious](https://www.zerochan.net/120212)

Verrou retenu : continuite anime 1998, homme grand et mince, cheveux gris,
manteau et costume noirs, chemise blanche, cravate noire, katana et fourreau.
La version live action, Spike, les gardes et tout boss Syndicate abstrait sont
exclus.

### Kid Buu

- [Dragon Ball Official Site - Kid Buu et Planet Burst](https://en.dragon-ball-official.com/news/01_3039.html)
- [Dragon Ball Wiki - galerie Kid Buu](https://dragonball.fandom.com/wiki/Kid_Buu/Gallery)

Verrou retenu : forme pure Kid Buu, petit corps rose maigre et muscle, antenne
unique, pantalon blanc, ceinture et accessoires noirs et or. Fat Buu, Super
Buu, Buuhan, Buutenks et toute absorption sont exclus.

### Father

- [Fullmetal Alchemist: Brotherhood USA - Story 28: Father](https://fullmetalalchemistusa.com/story/28.html)
- [Fullmetal Alchemist Wiki - Father](https://fma.fandom.com/wiki/Father)

Verrou final apres correction QA : homme adulte nettement masculin, visage et
carrure proches de Hohenheim sans lunettes, longs cheveux blond-or, barbe et
moustache, longue robe blanche fermee de Father. Les pouvoirs de Pierre
Philosophale et l'aura noire, blanche et or de l'etat apres absorption de God
restent des effets autour de cette meme incarnation. Toute anatomie feminine,
robe feminine, aile, halo, ange ou personnage d'un autre anime est exclu.

### Nurarihyon

- [Gantz Wiki - Nurarihyon Alien Boss](https://gantz.fandom.com/wiki/Nurarihyon_Alien_Boss)
- [FIELDS - reference officielle GANTZ:O](https://www.tsuburaya-fields.co.jp/ir/j/files/press/2017/press_20171109he.pdf)

Verrou retenu : forme demon finale squelettique de la mission d'Osaka, visage
en crane, yeux clairs, plaques osseuses, muscles sombres, longues griffes et
rangee fixe de lames dorsales. Les formes vieillard, enfant, femme, tete
detachee, geant chauve, masse feminine, behemoth et copie de Hard Suit sont
exclues.

## Jeu de prompts ImageGen

Les blocs suivants sont la version normalisee du jeu de prompts envoye a
ImageGen.

### Contrat commun

```text
Use case: stylized-concept.
Asset type: production boss/world-boss animation sheet for a pixel-art RPG.

Create one original fan-made square sprite sheet. The final target is exactly
1024x1024, conceptually divided into four columns and four rows of 256x256.
Do not draw the grid, guides, labels, numbers, text, logo, UI or watermark.
Place one complete pose in each of the sixteen cells. Keep the complete body,
weapons, appendages and effects inside their own cell with generous source
padding. No frame bleed, crop, empty cell or second character.

Use a perfectly flat solid chroma backdrop with no floor, shadow, scenery,
gradient or texture. Use #FF00FF for every subject except pink Kid Buu, which
uses #00FF00. Never use the selected key color in the subject.

Detailed handcrafted 32-bit pixel art, crisp hard pixel clusters, selective
dithering, consistent camera, lighting, anatomy, clothing and palette.
Full-body right-facing RPG three-quarter view at a readable boss scale.

Row 1: four idle frames.
Row 2: four locomotion frames.
Row 3: four signature-attack frames.
Row 4: four hit/defeat frames.
```

### Verrous specifiques

```text
Gun Devil 20%: same floating truncated skeletal manifestation in every frame;
pistol barrel/slide face, symmetrical rifle-cluster arms, embedded heads and
ammunition mass. Idle recoil, high-speed hover, gunstorm/facial shot, then
manifestation collapse. Never show Aki or another percentage.

Muzan: same white-haired Sunrise Countdown combat body, marked pale torso,
fixed flesh-whip origins and mouths. Predatory idle, dash, whip barrage/sweep,
then regeneration strain and collapse. Never show the infant or disguise
forms.

Gotou: same four-eyed, four-armed, digitigrade five-Parasite composite with one
scythe tail. Hunt movement, organic blade/shield/cross slash/tail sweep, then
desynchronization and collapse. No generic split-head Parasite.

One-Eyed Owl: Eto only, one fixed evolved kakuja with one dominant red eye,
bone mask, red-black plumage armor and four fixed back appendages. Heavy
locomotion, ukaku shards/claw/maw strike, then armor recoil and collapse.
Never use Yoshimura or another kakuja bearer.

Vicious: original 1998 anime design, silver-gray hair, black coat and suit,
white shirt, black tie, katana and scabbard. Measured movement, draw cut,
reverse cut and thrust, then non-gory defeat. No live-action design, gun,
guard or second character.

Kid Buu: pure pink form only, one antenna, pores, white trousers and black-gold
accessories. Elastic movement, compact ki charge, contained Planet Burst,
palm blast and long-arm strike, then elastic hit/recovery and fall. Never mix
another Buu form.

Nurarihyon: same final skeletal demon form, skull face, two long arms,
digitigrade legs, fixed back spines and forearm blades. Predatory movement,
cross slash, eye laser and regeneration counter, then fragmentation and
collapse. Never show any earlier Osaka transformation.
```

### Correction QA Father

La premiere generation de Father a ete rejetee avant livraison finale : elle
etait trop jeune, glabre et angelique, avec une lecture feminine. Les sept
autres PNG ont ete geles. Une nouvelle generation ImageGen a remplace
uniquement `father.png` avec le verrou suivant :

```text
Father must be the same unmistakably adult male in all sixteen frames:
broad shoulders, thick neck, large hands, angular Hohenheim-like masculine
face, heavy brow, straight nose, square jaw, long golden-blond hair, full
golden-blond beard and moustache, no glasses.

He wears Father's severe long white robe: high closed neckline, wide straight
sleeves, simple layered fabric to the ankles, flat male chest, masculine
monastic silhouette and dark sandals. No exposed chest, cleavage, feminine
tailoring or gown.

Power effects use controlled crimson Philosopher's Stone energy and restrained
black-white-gold post-absorption aura around the same bearded robed Father.
No woman, breasts, feminine waist, angel, goddess, wings, halo, feathers,
bridal dress, elf, youthful clean-shaven body, other anime character, Dwarf in
the Flask, Pride shadow, cyclopean giant or alternate incarnation.

Row 1: imposing idle and alchemical control.
Row 2: deliberate step, robe stride, short hover and landing.
Row 3: Philosopher's Stone charge, red force shield, contained miniature dark
sun and focused alchemical burst.
Row 4: light hit, heavy stagger, kneeling containment strain and complete
non-gory collapse.
```

Inspection de la correction : le resultat final montre un homme adulte barbu,
large d'epaules, constamment vetu de la meme robe blanche fermee. Aucun
element feminin, aile, halo ou changement de personnage n'est present.

## Pipeline de sortie

1. Une generation distincte par boss a ete effectuee avec OpenAI ImageGen,
   puis Father a fait l'objet d'une regeneration QA ciblee.
2. Les sources ImageGen carrees de `1254x1254` ont utilise un chroma magenta,
   sauf Kid Buu sur chroma vert pour proteger son corps rose.
3. Le helper officiel
   `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
   a ete execute avec `--auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill`.
4. `scripts/normalizeGeneratedSpriteSheet.py` a redimensionne chaque source a
   `1024x1024`, detecte les seize corps, rattache les effets utiles, recentre
   chaque frame et impose une zone utile maximale de `232x232`.
5. Le redimensionnement final des sprites utilise le pixel le plus proche.
6. Les canaux RGB des pixels totalement transparents sont a `0,0,0`.
7. La correction QA de Father a repete les etapes 1 a 6 uniquement pour
   `public/sprites/generated/bosses/fullmetal-alchemist/father.png`.

## Validation automatisee

Seuil d'occupation et de marge : `alpha > 12`. La garde controle les douze
premiers pixels internes de chaque cote de chaque cellule.

| Boss | Format | Cellules | Marge min. | Pixels dans garde | Chroma visible | RGB sous alpha 0 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Gun Devil 20 % | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Muzan Kibutsuji | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Gotou | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| One-Eyed Owl | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Vicious | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Kid Buu | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Father, corrige QA | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |
| Nurarihyon | PNG RGBA 1024x1024 | 16/16 | 12 px | 0 | 0 | 0 |

| Boss | Pixels visibles min./cellule | BBox min. L/H | Difference adjacente min. | Moyenne |
| --- | ---: | ---: | ---: | ---: |
| Gun Devil 20 % | 12 353 | 221 / 133 | 12.949 | 23.497 |
| Muzan Kibutsuji | 13 181 | 215 / 104 | 29.535 | 37.013 |
| Gotou | 12 200 | 197 / 152 | 26.219 | 35.763 |
| One-Eyed Owl | 15 536 | 219 / 130 | 15.624 | 20.780 |
| Vicious | 9 148 | 112 / 71 | 9.532 | 20.114 |
| Kid Buu | 13 096 | 136 / 124 | 23.651 | 46.198 |
| Father, corrige QA | 13 081 | 142 / 119 | 22.731 | 40.007 |
| Nurarihyon | 12 006 | 185 / 152 | 11.882 | 32.360 |

Les faibles hauteurs minimales de Vicious et des poses de chute correspondent
aux frames de defeat horizontales. Toutes les cellules restent nettement
occupees et lisibles.

| Boss | Alpha 0 | Alpha partiel | Alpha 255 | Coins transparents |
| --- | ---: | ---: | ---: | ---: |
| Gun Devil 20 % | 681 101 | 108 202 | 259 273 | 4/4 |
| Muzan Kibutsuji | 742 652 | 164 330 | 141 594 | 4/4 |
| Gotou | 744 352 | 141 810 | 162 414 | 4/4 |
| One-Eyed Owl | 667 921 | 187 764 | 192 891 | 4/4 |
| Vicious | 789 654 | 49 938 | 208 984 | 4/4 |
| Kid Buu | 726 583 | 51 207 | 270 786 | 4/4 |
| Father, corrige QA | 657 945 | 75 730 | 314 901 | 4/4 |
| Nurarihyon | 752 666 | 125 277 | 170 633 | 4/4 |

Empreintes SHA-256 finales :

```text
4F64A45291D15D614EE542F219F9A04E6A99F8E028FA6F5135B518DC40AAC6B1  gun-devil-20-percent-manifestation.png
628CEFE5CF3D0F3E38023BA9814BCEC19B7665940B7F3FB4F56EBDAF56B45E36  muzan-kibutsuji.png
73A992901F7BBB71A55A0828C7B71AA3D795486F8CF1301125E1CC6ED7DBA97A  gotou.png
31D99AAFB631205030A67057EF186DB4E95DF18F911BA4D0166418AF77D5FFEE  one-eyed-owl.png
A31DFDEC1921735BD7171D5C1B7EFDF22B44D6573A6284F75AB67E759CCEC4E6  vicious.png
137FA09FDA26606D4409233E643F2AC89BC7ADECF171D66C607EA68E51FAE401  kid-buu.png
AF743946A2E2F8D508B2EAD9EB8AFFAE3A12E6815C26853E568BF9DF9FF3D091  father.png
0805CABE758230FE810BE68D1E58E0D412F74259C44D8380AF0807393130AD36  nurarihyon.png
```

Les sept empreintes hors Father sont restees identiques pendant la correction
QA ciblee.

## Inspection visuelle finale

- Gun Devil : meme torse flottant et meme architecture d'armes sur les seize
  frames; aucune forme Aki ou membre d'une autre incarnation.
- Muzan : cheveux blancs, marques, bouches et fouets constants; aucune forme
  nourrisson ou deguisement.
- Gotou : quatre bras, quatre yeux, queue et jambes digitigrades constants;
  les armes restent organiques.
- One-Eyed Owl : Eto reste le seul porteur; masque, kakugan dominant et
  armure ukaku rouge-noir restent constants.
- Vicious : silhouette anime 1998, manteau, costume, katana et fourreau
  constants; aucun element live action.
- Kid Buu : forme pure rose et tenue noire, blanche et or constantes; aucun
  element de Super Buu ou d'une absorption.
- Father corrige : homme adulte barbu, traits Hohenheim, cheveux blond-or,
  carrure masculine et robe blanche fermee dans les seize cellules; aucune
  femme, aile, anatomie feminine ou personnage parasite.
- Nurarihyon : meme forme squelettique finale; aucune transformation Osaka
  precedente n'apparait.
- Les huit planches ont ete inspectees en transparence native. Aucun corps,
  effet, projectile, arme, cheveu, robe ou appendice ne traverse une limite
  de cellule.

## Nettoyage et etat

Les sources chroma, PNG RGBA intermediaires, dependances Python temporaires et
images de controle du depot sont supprimes apres validation. Seuls les huit
PNG finaux et ce rapport appartiennent a ce lot.

Aucun commit, push ou deploiement n'a ete effectue.
