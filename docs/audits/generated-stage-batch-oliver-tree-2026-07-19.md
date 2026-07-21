# Pack de stages Oliver Tree - OpenAI ImageGen QA final

Date : 2026-07-19

## Perimetre

Ce lot contient exactement sept decors originaux fan-made en pixel art 32-bit :

- `public/backgrounds/lore-stages/oliver-tree/combat.webp`
- `public/backgrounds/lore-stages/oliver-tree/melee.webp`
- `public/backgrounds/lore-stages/oliver-tree/melee-backdrop.webp`
- `public/backgrounds/lore-stages/oliver-tree/melee-platforms.webp`
- `public/backgrounds/lore-stages/oliver-tree/rpg.webp`
- `public/backgrounds/lore-stages/oliver-tree/tactics.webp`
- `public/backgrounds/lore-stages/oliver-tree/tactics-tiles.webp`

Les sept images ont ete produites avec le mode integre OpenAI ImageGen. Les
references ont servi a verrouiller le langage visuel de l'ere `Hurt`, sans
copier un photogramme, un lieu exact, un costume, un personnage, un logo ou un
asset officiel.

Aucun code, manifeste, registre global, package ou metadata Git n'a ete
modifie. Aucun commit, push ou deploiement n'a ete effectue.

## Correction QA Melee

Les premieres versions de `melee.webp` et `melee-backdrop.webp` ont ete
rejetees : environ 70 a 80 % de leur surface etait occupee par un champ
gris-brume uniforme. Les cinq autres fichiers avaient passe le QA et ont ete
figes avant la correction.

Les deux couches Melee finales ont ete regenerees avec :

- des volumes de chantier sur toute la hauteur utile ;
- une skyline brutaliste et la rampe geante toujours identifiables ;
- un puits de demolition rempli de murs de soutenement, rebar, echafaudages,
  cables, filets de securite et textures de beton ;
- un centre plus calme par baisse de contraste, mais jamais vide ou uni ;
- aucune plateforme de collision autonome fusionnee dans les images ;
- aucun obstacle de premier plan traversant la zone des combattants.

Controle de densite sur la zone centrale basse :

| Fichier | Ecart-type gris | Energie de contours | Couleurs echantillonnees |
| --- | ---: | ---: | ---: |
| `melee.webp` | 29.735 | 33.916 | 12 746 |
| `melee-backdrop.webp` | 20.646 | 32.681 | 8 009 |

Ces mesures completent l'inspection visuelle et confirment que les anciennes
plages uniformes ne sont plus presentes.

## References visuelles

- [Oliver Tree - site officiel](https://www.olivertreemusic.com/) :
  index officiel de la discographie et des videos.
- [Oliver Tree - Hurt](https://www.olivertreemusic.com/video/hurt) :
  page officielle du clip utilisee pour verrouiller l'ere visuelle.
- [Atlantic Records Press - Oliver Tree](https://press.atlanticrecords.com/oliver-tree) :
  archive officielle des visuels, communiques et videos de l'artiste.
- [Clipped - Hurt, entretien avec Brendan Vaughan](https://clipped.tv/feature-oliver-tree-hurt-dir-brendan-vaughan/) :
  source de production decrivant le decor post-sovietique, les cascades
  pratiques et la trottinette geante construite a une echelle volontairement
  absurde.
- [Making of Hurt - 23/32 Films](https://www.behance.net/gallery/78836015/Making-off-Oliver-Tree-Hurt) :
  galerie de production documentant le tournage a Kyiv par Snow Beach et
  23/32 Films.
- [WTBU - interview Oliver Tree](https://sites.bu.edu/wtbu/2024/01/27/interview-oliver-tree/) :
  entretien sur l'Oliverse, la persona Turbo et la place de la trottinette dans
  cet univers.
- [Vogue - Oliver Tree, JNCO Jeans, and Me](https://www.vogue.com/article/oliver-tree-jnco-jeans-1990s-nostalgia) :
  reference editoriale pour la palette Turbo rose, violette, rouge et denim.

## Direction originale

- Lieu : terrain de demolition et de tests de cascades invente.
- Architecture : tours brutalistes, squelettes de beton, grues, murs de
  soutenement, echafaudages, rebar, cables et puits d'excavation.
- Motif principal : rampe geante rouge-orange construite comme une
  trottinette, sans reproduire l'accessoire exact du clip.
- Palette : gris beton, bleu nuageux, acier charbon, rouge-orange, rose,
  violet, cyan et petites flammes ambrees.
- Ton : proportions absurdes et humour visuel impassible, sans basculer vers
  l'horreur ou la science-fiction.
- Interdits : personnage, visage, silhouette humaine, foule, animal, vehicule,
  texte, pseudo-texte, graffiti, lettre, nombre, logo, UI, HUD et watermark.

## Verrous ImageGen par mode

| Fichier | Verrou final |
| --- | --- |
| `combat.webp` | Camera laterale stricte, sol continu bord a bord, centre 1v1 libre, rampe geante en arriere-plan. |
| `melee.webp` | Camera laterale orthographique, chantier riche sur toute la hauteur, sol frontal mince et lisible, aucune plateforme de collision integree. |
| `melee-backdrop.webp` | Panorama parallax profond raccord avec Melee, excavation et echafaudages en couches, aucune plage de brouillard uniforme. |
| `melee-platforms.webp` | Huit modules lateraux opaques et isoles, quatre rangees de deux, dessus horizontaux et silhouettes de collision lisibles. |
| `rpg.webp` | Camera 2.5D trois-quarts peu plongeante, grand sol continu, profondeur laterale et centre libre. |
| `tactics.webp` | Camera tactique frontale trois-quarts, grille reguliere de 7 colonnes par 6 rangees, 42 cases lisibles et couvertures en bordure. |
| `tactics-tiles.webp` | Douze pieces isolees, trois rangees de quatre, empreintes rectangulaires dans le meme angle que le plateau. |

## Traitement des sorties

1. generation de Combat comme ancre de palette et de materiaux ;
2. generations distinctes de Melee, backdrop, RPG et Tactics ;
3. rejet puis regeneration des deux couches Melee apres le QA de densite ;
4. generation des deux atlas sur chroma vert uniforme ;
5. detourage avec le helper officiel `remove_chroma_key.py`, matte adouci,
   despill et contraction d'un pixel ;
6. export WebP lossless avec preservation RGBA exacte ;
7. remise a zero du RGB sous chaque pixel dont l'alpha vaut zero.

ImageGen a livre Combat et RPG en `1671x941`. Une unique colonne de bord droit
a ete prolongee d'un pixel pour atteindre `1672x941`, sans crop ni
redimensionnement du contenu. Les deux couches Melee corrigees ont ete livrees
directement en `1672x941`.

Couleurs chroma echantillonnees :

- `melee-platforms.webp` : `#06F905` ;
- `tactics-tiles.webp` : `#05F90A`.

Aucune source ImageGen, image de reference, grille-guide, matte intermediaire
ou planche contact n'est conservee dans le depot.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 808 810 | `30213de5dcee8a7cd40e4402d217951975166a07550d6b983bad5311b97a57af` |
| `melee.webp` | 1672x941 | RGB | 2 181 066 | `8b95b6cd6b43c93593550d9c4bd201c0f35d37af9b2b5cec9f1207e577104000` |
| `melee-backdrop.webp` | 1672x941 | RGB | 2 201 684 | `c3caf37c27d460c634a26a4a6fc33aca50daa4724e22cc2dac9740d3c40907ac` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 675 314 | `8a132c841200b2e9c5ec2eba2637074f78e6caf0f57d9ef26b186c2432b80de1` |
| `rpg.webp` | 1672x941 | RGB | 1 995 340 | `64128dd6052216a8c2ce79a17713727a0258662d077aff17083aa609c79f7232` |
| `tactics.webp` | 1448x1086 | RGB | 2 057 156 | `037a061881a730733c70ce5eaa8fa3eaf4fdffc9b181c4e68ab430ca0081b45d` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 874 318 | `f7597496646f9a791a6f7806c619425ff91d04b03c2631fd334f34f9863c1432` |

## Validation alpha et separation

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB sous alpha 0 | Vert visible | Bord opaque |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 195 050 | 32 982 | 344 484 | 0 | 0 | 0 |
| `tactics-tiles.webp` | 1 060 754 | 18 625 | 493 137 | 0 | 0 | 0 |

- alpha nul dans les quatre coins des deux atlas ;
- huit cellules Melee non vides, une plateforme par cellule ;
- douze cellules Tactics non vides, une piece par cellule ;
- aucune piece ne touche une autre piece ou un bord de toile ;
- aucun residu chroma vert visible ;
- RGB exactement nul pour tous les pixels totalement transparents.

## Inspection visuelle finale

- les sept WebP ont ete rouverts depuis leurs chemins projet ;
- Combat conserve une camera laterale et un sol 1v1 continu ;
- Melee et son backdrop utilisent maintenant toute la hauteur utile, sans
  champ gris uniforme ni zone vide dominante ;
- la zone centrale Melee reste lisible et le sol frontal n'est pas masque ;
- les plateformes de collision sont uniquement presentes dans l'atlas RGBA ;
- RPG utilise une profondeur 2.5D stable et une grande aire libre ;
- Tactics est une vraie vue frontale trois-quarts, jamais top-down ni
  isometrique en losanges ;
- les 42 cases Tactics sont regulieres, continues et lisibles ;
- les huit plateformes et douze pieces tactiques sont separees et coherentes
  avec leurs cameras respectives ;
- aucun personnage, visage, silhouette, texte, logo, UI, HUD ou watermark n'a
  ete trouve.

Les SHA-256 des cinq fichiers declares valides avant la correction Melee sont
restes strictement identiques :

- `combat.webp`
- `melee-platforms.webp`
- `rpg.webp`
- `tactics.webp`
- `tactics-tiles.webp`

Resultat : `OLIVER_TREE_STAGE_BATCH_QA_VALID`

## Limites du depot

Seuls les chemins demandes ont ete ecrits :

- `public/backgrounds/lore-stages/oliver-tree/`
- `docs/audits/generated-stage-batch-oliver-tree-2026-07-19.md`

Les modifications concurrentes deja presentes dans le worktree ont ete
laissees intactes.
