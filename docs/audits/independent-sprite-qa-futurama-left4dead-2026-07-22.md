# QA visuelle independante des planches Futurama et Left 4 Dead - 2026-07-22

## Verdict global

**PASS - 28/28 fichiers.**

- Futurama : `12/12 PASS`.
- Left 4 Dead : `16/16 PASS`.
- Defaut bloquant : aucun.
- Fichier regenere : aucun.
- Correction appliquee aux PNG : aucune.

Le seul fichier cree par cette QA est le present rapport. Aucun fichier JS,
JSON, manifeste ou PNG n'a ete modifie.

## Methode independante

Chaque PNG final a ete ouvert directement avec `view_image` en detail
`original`. Le verdict ne reprend pas le statut des rapports de production :
il repose sur une nouvelle lecture visuelle des 448 cases et sur une nouvelle
mesure des pixels des fichiers finaux.

Controles appliques a chaque planche :

1. identite, silhouette, tenue et equipement de la cible ;
2. absence de confusion avec un autre personnage du roster ;
3. coherence du meme sujet dans les 16 cases ;
4. vraie grille `4x4` de cellules `256x256` dans un PNG `1024x1024` ;
5. sujet et effets entierement cadres, avec une marge interne d'au moins
   `12 px` au seuil `alpha > 12` ;
6. absence de contenu dans les bandes de garde des cellules et absence de
   debordement d'une case dans une autre ;
7. mode `RGBA`, coins transparents, bords externes vides, alpha exploitable,
   contours propres et absence de chroma parasite ;
8. absence de texte, logo, watermark, UI, decor ou grille visible.

Les identites principales ont ete recoupees avec le
[guide officiel Futurama de Hulu](https://www.hulu.com/guides/futurama), les
[survivants L4D1 de Valve](https://www.l4d.com/l4d/survivors.htm), les
[Infected L4D1 de Valve](https://www.l4d.com/l4d/infected.htm), et les fiches
Valve de [Ellis](https://www.l4d.com/survivors/ellis/index.htm),
[Coach](https://www.l4d.com/survivors/coach/index.htm),
[Rochelle](https://www.l4d.com/survivors/rochelle/index.htm),
[Nick](https://www.l4d.com/survivors/nick/index.htm) et de la
[Spitter](https://www.l4d.com/infected/spitter/index.htm). Les cibles Futurama
secondaires ont ete controlees avec les fiches de continuite du
[Hypnotoad](https://theinfosphere.org/Hypnotoad), de la
[Robot Mafia](https://theinfosphere.org/Robot_Mafia) et des
[killbots MomCorp](https://futurama.fandom.com/wiki/Kill-bot).

## Mesures techniques communes

Les 28 fichiers partagent les resultats suivants :

- dimensions `1024x1024`, mode source `RGBA`, plage alpha `0..255` ;
- `16/16` cellules occupees par fichier, soit `448/448` cases inspectees ;
- marge interne minimale mesuree : `12 px` ;
- pixels visibles dans les bandes de garde de 12 px : `0` ;
- pixels visibles sur le bord externe : `0` ;
- alpha des quatre coins : `0 / 0 / 0 / 0` ;
- pixels RGB non nuls sous `alpha=0` : `0` ;
- aucune frange de chroma observee sur les contours.

Le detecteur de teintes proches des chromas standards a seulement retrouve des
couleurs voulues dans quatre planches : le tir cyan d'Amy (`110` pixels), le
tir cyan de Fry (`69`), et le vert des yeux du Hypnotoad dans `broadcast`
(`2`) et `delivery-singularity` (`42`). Leur position dans les effets ou les
yeux, leur opacite et la lecture avec `view_image` confirment qu'il ne s'agit
pas de fond residuel.

## Futurama - 12 fichiers

| Fichier | Controle visuel independant | Grille, cadrage et alpha | Verdict | Correction |
|---|---|---|---|---|
| `public/sprites/generated/heroes/futurama/fry-futurama.png` | Fry reste identifiable dans les 16 cases : cheveux orange, veste rouge, tee-shirt blanc, jean bleu et ray gun compact. Aucune confusion de visage ou de tenue. | `4x4`, 16 cases, corps et tir complets, marge `>=12 px`, aucun bleed ni chroma parasite. | **PASS** | Aucune |
| `public/sprites/generated/heroes/futurama/leela-futurama.png` | Leela conserve son oeil unique, sa queue-de-cheval violette, sa tenue blanche/noire, ses bottes et son wrist device. Les coups et kicks restent coherents. | `4x4`, 16 cases, poses et meche completes, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/futurama/bender-futurama.png` | Corps cylindrique gris, antenne, yeux jaunes, bouche-grille, trappe et membres segmentes constants. Bras extensible et action de trappe restent lisibles sans confusion avec un killbot. | `4x4`, 16 cases, antenne et extensions completes, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/futurama/amy-futurama.png` | Amy conserve cheveux noirs, ensemble rose, ventre apparent, bottes brunes et ray gun compact. Le cyan detecte appartient au tir. | `4x4`, 16 cases, corps et tir complets, marge `>=12 px`, aucun bleed ni frange cyan. | **PASS** | Aucune |
| `public/sprites/generated/heroes/futurama/hermes-futurama.png` | Hermes reste trapu, peau sombre, lunettes, cheveux courts, costume olive et clipboard. La barre de limbo est limitee a l'action speciale. | `4x4`, 16 cases, sujet et barre complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/futurama/zoidberg-futurama.png` | Zoidberg conserve corps rouge, yeux pedoncules, tentacules faciaux, pinces, blouse blanche et sandales. Scuttle, pinces et encre sont coherents. | `4x4`, 16 cases, corps, pinces et encre complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/robot-mafia-enforcer.png` | Enforcer original de faction coherent : robot bronze, fedora, tenue noire, chaine et mitraillette ancienne. Il n'est presente ni comme Donbot, ni comme Clamps, ni comme Joey Mousepad. | `4x4`, 16 cases, arme et flash complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/brain-slug-host.png` | Hermes reste le meme hote dans chaque case et porte un unique brain slug vert, a un oeil et deux feelers. Aucun changement d'hote. | `4x4`, 16 cases, hote et slug complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/momcorp-killbot.png` | Killbot MomCorp conforme : chassis jaune-orange, chenilles, deux miniguns, viseur rouge et grille dentee. Equipement constant. | `4x4`, 16 cases, chenilles, canons, fumee et tirs complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/roberto-knife-bot.png` | Roberto conserve chassis rouille rectangulaire, grands yeux pales, bandeau sombre, dents et couteau argente. Aucun pistolet ni confusion avec Bender. | `4x4`, 16 cases, tete, couteau et arcs complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/hypnotoad-broadcast.png` | Meme grand crapaud brun-olive tachete, collier et medaillon, avec yeux oscillants multicolores. Les variations d'yeux expriment le broadcast sans creer une autre creature. | `4x4`, 16 cases, corps et hypnowaves complets, marge `>=12 px`, aucun bleed; le vert detecte appartient aux yeux. | **PASS** | Aucune |
| `public/sprites/generated/bosses/futurama/hypnotoad-delivery-singularity.png` | Le sujet reste le meme Hypnotoad canonique. La singularite noire-violette est un effet de rencontre compact et non une mutation ou un equipement ajoute. | `4x4`, 16 cases, crapaud et singularite complets, marge `>=12 px`, aucun bleed; vert limite aux yeux. | **PASS** | Aucune |

## Left 4 Dead - 16 fichiers

| Fichier | Controle visuel independant | Grille, cadrage et alpha | Verdict | Correction |
|---|---|---|---|---|
| `public/sprites/generated/heroes/left-4-dead/zoey-l4d.png` | Zoey conserve queue-de-cheval, veste rouge, haut clair, jean sombre et doubles pistolets. Aucun glissement vers Rochelle. | `4x4`, 16 cases, corps, armes et flash complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/left-4-dead/bill-l4d.png` | Bill reste un veteran age a barbe grise, beret et tenue olive, avec M16. Silhouette et arme constantes. | `4x4`, 16 cases, corps, fusil et tirs complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/left-4-dead/ellis-l4d.png` | Ellis conserve casquette, tee-shirt jaune, workwear bleu et lance-grenades. Aucune confusion avec Nick ou un soldat generique. | `4x4`, 16 cases, corps, arme, tir et fumee complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/left-4-dead/coach-l4d.png` | Coach conserve carrure massive, polo violet/jaune, pantalon kaki et tronconneuse a deux mains. | `4x4`, 16 cases, corps, lame et arcs complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/left-4-dead/rochelle-l4d.png` | Rochelle conserve cheveux attaches, boucles dorees, tee-shirt rose, jean sombre et hache d'incendie. | `4x4`, 16 cases, corps, hache et arcs complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/heroes/left-4-dead/nick-l4d.png` | Nick conserve cheveux sombres, costume blanc, chemise bleue et Magnum argente. Aucun glissement vers Bill ou Ellis. | `4x4`, 16 cases, corps, Magnum et tir complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/common-infected.png` | Meme civil recemment infecte dans les 16 cases, chemise et cravate dechirees, sans devenir un Special Infected. | `4x4`, 16 cases, sprint, griffes et hit complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/smoker.png` | Smoker grand et voute, visage couvert de tumeurs, veste sombre et langue de capture unique. Aucune confusion avec le Boomer. | `4x4`, 16 cases, corps et langue complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/hunter.png` | Hunter conserve hoodie sombre, visage masque, bandages et griffes. Les lignes course et bond restent lisibles. | `4x4`, 16 cases, poses basses et membres complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/boomer-bile-host.png` | Boomer male L4D1 constant : ventre hypertrophie, peau pustuleuse, pantalon dechire et bile jaune-verte. | `4x4`, 16 cases, corps et jets de bile complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/hunter-pounce.png` | Meme Hunter canonique que la planche standard, plus bas et comprime; coil, launch, vol et landing sans victime ajoutee. | `4x4`, 16 cases, trajectoires corporelles completes, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/spitter-acid-pool.png` | Spitter grande et maigre, cou allonge, haut rose et acidite verte. Projectile et flaque correspondent a sa capacite Valve. | `4x4`, 16 cases, corps, projectile et flaques complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/tank.png` | Tank standard constant : enorme haut du corps, petit crane, bras hypertrophies et jean dechire; punch, slam et beton. | `4x4`, 16 cases, corps, debris et bloc de beton complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/witch.png` | Witch standard pale et blonde, tenue blanche dechiree et longues griffes; pleurs, startle, sprint et slash restent distincts. | `4x4`, 16 cases, corps, cheveux et griffes complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/witch-crying-corner.png` | Meme Witch standard, sans mur ni variante bride; pleurs assis, reveil puis attaque, sans changement d'identite. | `4x4`, 16 cases, poses accroupies et griffes completes, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |
| `public/sprites/generated/bosses/left-4-dead/tank-horde-breaker.png` | Meme Tank standard, sans armure ni mutation inventee; charge, backhand, bulldoze et ground slam restent coherents. | `4x4`, 16 cases, corps, bras et debris complets, marge `>=12 px`, aucun bleed. | **PASS** | Aucune |

## Corrections

Aucune correction n'est necessaire. Le seuil de regeneration ciblee n'a ete
atteint par aucun fichier; `image_gen` n'a donc pas ete appele et les 28 PNG
ont ete laisses strictement intacts.
