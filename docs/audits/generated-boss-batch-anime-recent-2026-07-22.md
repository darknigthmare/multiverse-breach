# Lot de boss anime recents genere par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Quatre appels OpenAI ImageGen independants ont produit quatre feuilles de
sprites originales fan-made. Les images officielles citees ci-dessous ont servi
uniquement de references de silhouette, costume, couleurs et pouvoirs. Aucun
pixel officiel n'est copie dans les fichiers livres.

Chaque sortie finale est un PNG `RGBA` transparent de `1024x1024`, decoupe en
grille exacte `4x4` de cellules `256x256` :

| Ligne | Fonction | Frames |
|---|---|---:|
| 1 | idle et menace | 4 |
| 2 | locomotion | 4 |
| 3 | attaques et special lore | 4 |
| 4 | hit, stagger et defaite | 4 |

| Boss | Continuite retenue | Fichier final |
|---|---|---|
| Katana Man / Samurai Sword | anime TV *Chainsaw Man*, forme hybride transformee | `public/sprites/generated/bosses/chainsaw-man/katana-man.png` |
| Maine Cyberpsychosis | *Cyberpunk: Edgerunners*, Maine lourdement chrome pendant sa rupture cyberpsychotique | `public/sprites/generated/bosses/cyberpunk-edgerunners/maine-cyberpsychosis.png` |
| Akaza Upper Three | *Demon Slayer: Kimetsu no Yaiba*, apparence Mugen Train | `public/sprites/generated/bosses/demon-slayer/akaza-upper-three.png` |
| Reiko Tamura | anime *Parasyte -the maxim-*, identite Reiko Tamura | `public/sprites/generated/bosses/parasyte/reiko-tamura.png` |

## References inspectees avant generation

### Katana Man

- [Site officiel TV Chainsaw Man - personnages](https://www.chainsawman.dog/tvseries/character/), visuel officiel de `Samurai Sword` ;
- [Site officiel TV Chainsaw Man - episodes](https://www.chainsawman.dog/tvseries/episodes/), episode 12 `Katana vs. Chainsaw` utilise pour la posture de duel et la charge tranchee.

Verrou visuel : long manteau anthracite, costume et casquette sombres, machoire
metallique dentee, lame frontale horizontale et deux longues lames sortant des
avant-bras. Les seize frames conservent la forme hybride complete.

### Maine Cyberpsychosis

- [CD PROJEKT RED - Cyberpunk: Edgerunners](https://www.cyberpunk.net/en/edgerunners), galerie officielle contenant les vues de Maine ;
- [Portrait officiel de Maine](https://www.cyberpunk.net/build/images/edgerunners/characters/maine%401x-e8477e91.png), reference directe de proportions, cyberware et palette.

Verrou visuel : col rouge, gilet tactique noir, torse expose, cheveux blond
platine, tres grande carrure, cyberbras massifs, lance-projectiles integre,
cyberjambes et indicateurs rouges. La psychose est rendue par les yeux rouges,
les erreurs lumineuses plaquees au corps et la degradation des postures, sans
ajouter un second personnage.

### Akaza Upper Three

- [Site officiel du film Mugen Train - Akaza](https://kimetsu.com/anime/mugenresshahen_movie/character/?chara=c10), visuel anime officiel ;
- [SEGA / Aniplex - fiche officielle Akaza](https://asia.sega.com/kimetsu_hinokami/en/character/update.html), silhouette plein pied et rang Upper Three ;
- [SEGA - notes de combat officielles](https://manuals.sega.com/hinokami-v130-uk/), noms des techniques `Air Type`, `Disorder` et `Compass Needle`.

Verrou visuel : cheveux rose vif, peau pale, rayures bleu cobalt symetriques,
yeux jaunes, gilet magenta, pantalon blanc, cordon turquoise, pompons rouges et
bracelets de cheville rose-blanc. Akaza reste strictement un combattant a mains
nues.

### Reiko Tamura

- [VAP - fiche officielle de Reiko Tamura](https://www.vap.co.jp/kiseiju/sp/chara/ryoko.html), portrait et vues officielles ;
- [VAP - episode 17](https://www.vap.co.jp/kiseiju/story/17.html), reference canonique de sa confrontation contre plusieurs parasites et de son choix final de proteger son enfant.

Verrou visuel : longs cheveux noir charbon, visage calme, tailleur jupe rose
poudre, blouse blanche, collants brun sombre et escarpins noirs. Seule la tete
se transforme en tendrils et lames organiques durcies, toujours relies au
corps humain unique.

## Prompts de production resumes

Le socle commun demandait une vue jeu de combat orientee vers la droite, une
grille implicite `4x4`, un seul corps entier par cellule, au moins 18 px de
degagement source, un fond uniforme `#00FF00`, aucun trait de grille, texte,
logo, watermark, decor, sol, ombre portee ou contenu d'une cellule voisine.

| Boss | Ligne 3, attaques et special |
|---|---|
| Katana Man | slash horizontal, double slash croise, charge iaijutsu ultra-rapide, coupe descendante |
| Maine | crochet de cyberbras, tir du lance-projectiles integre, double impact au sol, barrage de psychose |
| Akaza | `Air Type`, `Disorder`, `Compass Needle`, `Annihilation Type` |
| Reiko Tamura | doubles lames de tete, lances tentaculaires, eventail defensif, feinte multi-angle |

Les effets ont ete demandes compacts et physiquement relies au boss afin que le
mode strict conserve l'animation utile avec le composant alpha principal.

## Post-traitement

1. Generation separee de chaque boss avec OpenAI ImageGen integre.
2. Inspection des quatre sources `1254x1254` sur fond vert uniforme.
3. Detourage avec le helper OpenAI ImageGen `remove_chroma_key.py`,
   `--auto-key border --soft-matte --transparent-threshold 12
   --opaque-threshold 220 --despill --edge-contract 1`.
4. Reconstruction finale avec
   `scripts/normalizeGeneratedSpriteSheet.py --strict-cells`.
5. Maine seulement : une reconstruction globale intermediaire a recale deux
   tetes qui depassaient leur cellule source ; le fichier final a ensuite ete
   repasse explicitement par `--strict-cells`.
6. Controle automatique independant puis inspection visuelle des quatre PNG
   finaux sur damier clair/sombre avec limites exactes des cellules.

## Validation technique

Seuil d'occupation et de marge : `alpha > 12`. Les quatre fichiers passent le
meme contrat : PNG `RGBA`, `1024x1024`, alpha `0..255`, `16/16` cellules
occupees, `16/16` cellules distinctes, marge interne minimale `12 px`, zero
pixel dans les gardes de 12 px, zero pixel sur le bord externe, quatre coins
`[0,0,0,0]`, zero RGB cache sous `alpha=0` et zero residu visible proche de
`#00FF00`.

| Fichier | Cellules | Uniques | Marge | Garde | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `katana-man.png` | 16 | 16 | 12 px | 0 | 766970 / 27083 / 254523 | 0 | 0 | `093aba0df0f6ae689ebc795044831a910f9f1825b489233e45bad7689902a12f` |
| `maine-cyberpsychosis.png` | 16 | 16 | 12 px | 0 | 646931 / 49236 / 352409 | 0 | 0 | `e46c53b1e2327796c37f927f2618a92d2ff21ae5bcad95c34c3f68ed794920e5` |
| `akaza-upper-three.png` | 16 | 16 | 12 px | 0 | 772712 / 24361 / 251503 | 0 | 0 | `4f7e24c71a09d40d437ccd3b03b0305bea5a87bdb87acd0e5f508fddc93ab127` |
| `reiko-tamura.png` | 16 | 16 | 12 px | 0 | 876948 / 22319 / 149309 | 0 | 0 | `49195c9bed9accd7a8a5131cb8c2f79efb760897c9048cdec48f7fa762b30e0e` |

## Controle visuel final

- les 64 cellules contiennent exactement un boss entier et une pose lisible ;
- aucune silhouette, lame, cyberprothese, tendril ou effet utile ne franchit une limite ;
- Katana Man conserve ses trois lames, son manteau et sa tete hybride dans les seize frames ;
- Maine conserve ses deux cyberbras, son lance-projectiles et une tete complete apres le recalage cible ;
- Akaza conserve ses marquages, son costume et ses bracelets, sans arme inventee ;
- Reiko conserve le meme tailleur et un seul corps, avec toutes les lames organiques reliees a la tete ;
- les lignes idle, locomotion, attaques et defaite sont visuellement distinctes ;
- aucun texte, logo, watermark, decor, sol, grille ou second personnage n'apparait dans les PNG finaux.

## Hors perimetre confirme

Ce lot n'a edite aucun fichier de code, manifeste, registre de sprites, audit
global, configuration, dependance ou metadonnee Git. Le depot contenait deja
d'autres modifications hors perimetre ; elles ont ete laissees intactes. Aucun
commit, push ou deploiement n'a ete execute.
