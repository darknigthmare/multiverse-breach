# Lot world boss Portal / Mad Max / Chicken Run / One-Punch Man - 2026-07-22

## Perimetre

Production strictement limitee aux quatre planches world boss suivantes :

| Univers | Entite | Sortie |
| --- | --- | --- |
| `Portal` | GLaDOS Central Core | `public/sprites/generated/bosses/portal/glados-central-core.png` |
| `Mad Max: Fury Road` | The Gigahorse | `public/sprites/generated/bosses/mad-max/the-gigahorse-interceptor-rig.png` |
| `Chicken Run` | Mrs Tweedy and the Pie Machine | `public/sprites/generated/bosses/chicken-run/mrs-tweedy-and-the-pie-machine.png` |
| `One Punch Man` | Boros | `public/sprites/generated/bosses/one-punch-man/boros.png` |

Les quatre planches sont des fan-arts originaux generes avec OpenAI ImageGen.
Aucun screenshot, photogramme, panneau, sprite, modele, texture, figurine ou
asset officiel n'a ete copie, trace, decoupe ou integre aux PNG.

Aucun manifeste, JavaScript, registre, audit global, package, configuration,
fichier Git ou deploiement n'a ete modifie. Aucun commit, push ou deploiement
n'a ete effectue.

## References officielles et primaires consultees avant generation

### GLaDOS Central Core

- [Valve / Steam - Portal (2007)](https://store.steampowered.com/app/400/Portal/)

Verrou retenu : rencontre finale du premier `Portal`, dans la Central AI
Chamber. GLaDOS reste suspendue a son raccord de plafond avec coque blanche,
structure et cables noirs, oeil jaune et quatre personality cores. Les actions
restent la redirection de roquette, la neurotoxine, le detachement des cores et
la degradation de la chambre. Toute jambe, marche, corps humanoide, Wheatley,
potato form ou reconstruction de `Portal 2` est exclu.

### The Gigahorse

- [Warner Bros. - Mad Max: Fury Road](https://www.warnerbros.co.jp/home_entertainment/d3x5y5zhf/)
- [Motion Picture Association - infographic vehicules publiee par Warner Bros.](https://www.motionpictures.org/2015/09/killer-cars-check-out-this-mad-max-fury-road-infographic/)

Verrou retenu : vehicule personnel d'Immortan Joe compose de deux carrosseries
de Cadillac 1959 superposees, chrome noirci, double motorisation exposee,
echappements verticaux, roues arriere geantes et chassis de charge. Le PNG ne
fusionne ni l'Interceptor, ni le War Rig, ni le Doof Wagon. Le vehicule reste
entier dans chaque cellule et ses degats progressent sans changer de modele.

### Mrs Tweedy and the Pie Machine

- [Aardman - Chicken Run](https://www.aardman.com/film-tv-games/chicken-run/)
- [DreamWorks - Chicken Run](https://www.dreamworks.com/movies/chicken-run)

Verrou retenu : continuite du film de 2000. Mrs Tweedy conserve sa silhouette
humaine Aardman, son chignon severe, sa robe de ferme bordeaux-violet, ses
bottes et sa hache. Elle reste visuellement et anatomiquement separee de la
machine. Le convoyeur, les rouleaux, les bras de preparation, les tuyaux et le
four forment des modules fixes coordonnes, jamais un robot humanoide. Le costume
blanc et l'usine de `Dawn of the Nugget` sont exclus.

### Boros

- [Site anime officiel - Blu-ray/DVD volume 6, episodes 11 et 12](https://onepunchman-anime.net/goods/bd/bd_6.php)
- [Site anime officiel - annonce du casting de Boros](https://onepunchman-anime.net/news/archives/570)
- [Kaiyodo - Boros deuxieme forme sous licence officielle](https://kaiyodo.co.jp/items/revoltech/nr122/)

Verrou retenu : meme alien cyclope dans trois etats successifs. La premiere
ligne garde l'armure qui scelle sa puissance. La rupture revele la seconde
forme musculaire, son oeil unique, ses dents, ses marques lumineuses et l'oeil
du torse. Meteoric Burst surcharge ensuite cette meme anatomie avant le
Collapsing Star Roaring Cannon et l'extinction finale. Aucun second personnage,
forme humaine, deuxieme oeil ou silhouette sans lien n'est introduit.

## Contrat des planches

- Canvas final : `1024x1024`, PNG `RGBA`.
- Grille conceptuelle : `4 x 4`, cellules de `256x256`.
- Une pose ou un etat autonome par cellule, sans ligne de grille.
- Aucun membre, module, cable, projectile, aura ou debris ne traverse une
  frontiere de cellule.
- Pixel art 32-bit detaille, amas de pixels nets, dithering controle et angle
  trois-quarts coherent.
- Aucun texte, numero, logo, UI, watermark, decor, sol ou ombre portee.

### Lecture des lignes

| Entite | Ligne 1 | Ligne 2 | Ligne 3 | Ligne 4 |
| --- | --- | --- | --- | --- |
| GLaDOS | idle et balancement suspendu | roquette, recul et neurotoxine | detachement progressif des quatre cores | coque fissuree, cables rompus et effondrement |
| Gigahorse | ralenti et montee en regime | acceleration, charge et freinage | ram, harpon, pneu et moteurs | degats progressifs jusqu'a l'immobilisation |
| Mrs Tweedy + machine | ordres et activation | convoyeur, rouleaux, bras et four | sabotage progressif des modules | poursuite a la hache puis chute non gore |
| Boros | armure scellee | rupture d'armure et forme liberee | regeneration, kick et activation Meteoric Burst | vitesse, kick, canon final et extinction |

## Pipeline ImageGen et alpha

1. Une generation OpenAI ImageGen distincte a ete realisee par entite.
2. Les sources RGB carrees de `1254x1254` ont utilise un fond chroma plat :
   `#FF00FF` pour GLaDOS et le Gigahorse, `#00FF00` pour Mrs Tweedy et Boros.
3. Les exports locaux du Gigahorse et de Mrs Tweedy ont ete reemis par une
   edition de preservation ImageGen, sans changement de composition, apres que
   les premiers handles locaux sont restes vides.
4. Le helper officiel
   `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
   a ete execute avec `--auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill`.
5. GLaDOS et Boros ont recu la passe recommandee `--edge-contract 1`, puis une
   suppression ciblee de respectivement 1 et 20 pixels de fringe chroma a tres
   faible alpha. Aucun pixel opaque du sujet n'a ete touche.
6. `scripts/normalizeGeneratedSpriteSheet.py` a redimensionne les sources,
   detecte les seize corps, rattache les composants utiles et recentre chaque
   cellule avec une zone utile maximale de `232x232` et 12 px de marge.
7. Le mode `--strict-cells` n'etait pas adapte : il aurait supprime les cores
   detaches, Mrs Tweedy separee des modules, le harpon ou les effets de Boros.
   La normalisation par composants conserve ces elements tout en imposant une
   grille finale stricte et sans fuite.
8. Les canaux RGB de tous les pixels totalement transparents ont ete remis a
   `0,0,0`.

## Validation automatisee finale

Le seuil de presence utilise pour les cellules, marges et residus est
`alpha > 12`. La garde couvre les douze premiers pixels internes de chaque cote
de chaque cellule.

| Controle | GLaDOS | Gigahorse | Mrs Tweedy + machine | Boros |
| --- | ---: | ---: | ---: | ---: |
| Dimensions | 1024x1024 | 1024x1024 | 1024x1024 | 1024x1024 |
| Mode | RGBA | RGBA | RGBA | RGBA |
| Cellules non vides | 16/16 | 16/16 | 16/16 | 16/16 |
| Marge minimale | 12 px | 12 px | 12 px | 12 px |
| Pixels dans les gardes | 0 | 0 | 0 | 0 |
| Plage alpha | 0..255 | 0..255 | 0..255 | 0..255 |
| Pixels alpha partiel | 81 647 | 65 313 | 68 061 | 62 206 |
| Coins transparents | 4/4 | 4/4 | 4/4 | 4/4 |
| Chroma visible | 0 px | 0 px | 0 px | 0 px |
| RGB non nul sous alpha 0 | 0 px | 0 px | 0 px | 0 px |
| Pixels visibles min./cellule | 17 216 | 18 448 | 18 330 | 15 239 |
| BBox minimale L x H | 144x205 | 232x158 | 232x151 | 131x168 |
| Difference adjacente min. | 16.846 | 10.477 | 13.725 | 33.327 |
| Difference adjacente moyenne | 25.277 | 19.276 | 18.230 | 44.164 |

Les minima d'occupation et de bounding box confirment que les seize cellules de
chaque planche sont lisibles. Les differences adjacentes confirment des etats
distincts plutot que seize duplications.

SHA-256 :

- GLaDOS : `73ED57083CBE18F3C51A08413E1625DF0F25E586E1A6AB19CF417738231618F3`
- Gigahorse : `6EB6B5A63A0A7BCB6395D5768CB0ED67EA2A3A19C9438B0DDB1FCDA86A4221A2`
- Mrs Tweedy + Pie Machine : `B8C7A104BE6CF2032143A4D233CEEF2961B5EAEFDA8AD0784C22921910CC6EC7`
- Boros : `9F7EDA0EB23F988ED1B266BA59603FEB3E2DF44101B09A568AADBACAF4710F50`

## Inspection visuelle finale

Les quatre PNG ont ete inspectes en transparence native a leur resolution
finale.

- GLaDOS reste suspendue dans les seize cellules. Les cores se detachent
  progressivement, la neurotoxine et la roquette restent contenues, puis la
  coque et les cables cedent sans apparition de jambes ou de forme mobile.
- Le Gigahorse montre toujours les deux Cadillac empilees, les moteurs et les
  roues completes. Le harpon, les flammes et les debris restent dans leur
  cellule et la derniere ligne lit clairement les degats croissants.
- Mrs Tweedy reste une humaine complete distincte des modules dans chaque
  cellule. Le convoyeur, les rouleaux, les bras et le four restent fixes ; la
  hache n'apparait qu'apres la panne de la machine.
- Boros conserve le meme visage cyclope, les memes proportions et la meme
  chevelure entre armure, forme liberee et Meteoric Burst. Le beam final ne
  traverse pas la cellule et la derniere pose montre une extinction non gore.
- Aucun sprite ne touche une cellule voisine. Aucun texte, grille, bordure,
  decor, personnage additionnel ou watermark n'est present.
