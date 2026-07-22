# Sprites Left 4 Dead complets generes par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Ce lot contient seize planches pixel art originales fan-made produites avec le
`built-in image_gen`, un appel distinct par sortie unique du manifeste. Aucun
sprite, modele, photogramme ou autre asset Valve n'a ete copie dans les PNG.

Le manifeste contient deux entrees identiques pour le Tank principal, avec le
meme identifiant et le meme chemin `tank.png`. Une seule planche principale a
donc ete produite pour ce chemin. `Tank Horde Breaker` reste une planche de
phase distincte, comme le demande son chemin unique.

| Role | Sujet | Fichier final | Octets |
|---|---|---|---:|
| Heros | Zoey | `public/sprites/generated/heroes/left-4-dead/zoey-l4d.png` | 506975 |
| Heros | Bill | `public/sprites/generated/heroes/left-4-dead/bill-l4d.png` | 655673 |
| Heros | Ellis | `public/sprites/generated/heroes/left-4-dead/ellis-l4d.png` | 652539 |
| Heros | Coach | `public/sprites/generated/heroes/left-4-dead/coach-l4d.png` | 738115 |
| Heros | Rochelle | `public/sprites/generated/heroes/left-4-dead/rochelle-l4d.png` | 548010 |
| Heros | Nick | `public/sprites/generated/heroes/left-4-dead/nick-l4d.png` | 674028 |
| Ennemi | Common Infected | `public/sprites/generated/bosses/left-4-dead/common-infected.png` | 645624 |
| Ennemi | Smoker | `public/sprites/generated/bosses/left-4-dead/smoker.png` | 720415 |
| Ennemi | Hunter | `public/sprites/generated/bosses/left-4-dead/hunter.png` | 647107 |
| Ennemi | Boomer Bile Host | `public/sprites/generated/bosses/left-4-dead/boomer-bile-host.png` | 909603 |
| Ennemi | Hunter Pounce | `public/sprites/generated/bosses/left-4-dead/hunter-pounce.png` | 659735 |
| Ennemi | Spitter Acid Pool | `public/sprites/generated/bosses/left-4-dead/spitter-acid-pool.png` | 512439 |
| Boss | Tank | `public/sprites/generated/bosses/left-4-dead/tank.png` | 999121 |
| Boss | Witch | `public/sprites/generated/bosses/left-4-dead/witch.png` | 756068 |
| Boss | Witch Crying Corner | `public/sprites/generated/bosses/left-4-dead/witch-crying-corner.png` | 946288 |
| Boss | Tank Horde Breaker | `public/sprites/generated/bosses/left-4-dead/tank-horde-breaker.png` | 1024260 |

Chaque fichier final est un PNG `RGBA` de `1024x1024`, decoupe en grille
stricte `4x4` de cellules `256x256` :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | idle | 4 |
| 2 | run | 4 |
| 3 | attack | 4 |
| 4 | hit | 4 |

## References Valve inspectees et URLs consignees

### Continuite et distribution officielles

- [Left 4 Dead - page Steam Valve](https://store.steampowered.com/app/500/Left_4_Dead/) : jeu original, horde, survivants et Special Infected ;
- [Left 4 Dead 2 - page Steam Valve](https://store.steampowered.com/app/550/Left_4_Dead_2/) : suite, quatre survivants du Sud et Spitter ;
- [L4D Team - campagnes, rosters et continuite](https://www.l4d.com/blog/post.php?id=9208) : Coach, Nick, Ellis et Rochelle pour L4D2, puis Bill, Zoey, Francis et Louis pour L4D1 ;
- [L4D Team - The Sacrifice](https://www.l4d.com/sacrifice/index3.html) : continuite L4D1 dans L4D2 et pounces du Hunter.

### Survivants

- [Valve L4D1 - Survivors](https://www.l4d.com/l4d/survivors.htm) : biographies et silhouettes de Zoey et Bill ;
- [media officiel Zoey](https://www.l4d.com/l4d/images/g_zoey.gif) ;
- [media officiel Bill](https://www.l4d.com/l4d/images/g_bill.gif) ;
- [Valve L4D2 - Ellis](https://www.l4d.com/survivors/ellis/index.htm) ;
- [Valve L4D2 - Coach](https://www.l4d.com/survivors/coach/index.htm) ;
- [Valve L4D2 - Rochelle](https://www.l4d.com/survivors/rochelle/index.htm) ;
- [Valve L4D2 - Nick](https://www.l4d.com/survivors/nick/index.htm).

### Infected et boss

- [Valve L4D1 - Infected](https://www.l4d.com/l4d/infected.htm) : horde, Witch, Boomer, Smoker, Hunter et Tank, avec leurs comportements canoniques ;
- [media officiel horde](https://www.l4d.com/l4d/images/g_horde.gif) ;
- [media officiel Witch](https://www.l4d.com/l4d/images/g_witch.gif) ;
- [media officiel Boomer](https://www.l4d.com/l4d/images/g_boomer.gif) ;
- [media officiel Smoker](https://www.l4d.com/l4d/images/g_smoker.gif) ;
- [media officiel Hunter](https://www.l4d.com/l4d/images/g_hunter.gif) ;
- [media officiel Tank](https://www.l4d.com/l4d/images/g_tank.gif) ;
- [Valve L4D2 - Spitter](https://www.l4d.com/infected/spitter/index.htm) : projectile corrosif et flaque d'acide ;
- [L4D Team - nouveaux Special Infected L4D2](https://www.l4d.com/blog/post.php?id=3119) : contexte officiel de la Spitter.

Les pages et medias officiels ont servi de references de silhouette, de tenue,
d'equipement et de comportement. Les planches restent des interpretations
pixel art originales, sans reutilisation d'image source.

## Contrat de generation commun

Le prompt commun a impose les points suivants a chaque appel :

- composition carree `1024x1024`, grille implicite stricte `4x4`, seize
  cellules logiques egales et aucune ligne de grille visible ;
- exactement un sujet complet par cellule, vue de combat trois-quarts vers la
  droite, echelle et identite coherentes dans les seize frames ;
- au moins `24 px` de chroma demande autour des poses source, sans membre,
  arme, projectile ou effet traversant une limite de cellule ;
- pixel art detaille par amas de pixels nets, palette limitee, silhouette de
  jeu lisible, sans rendu peint, vectoriel ou 3D ;
- lignes `idle`, `run`, `attack`, `hit`, avec quatre phases distinctes et
  consecutives par ligne ;
- fond plat uniforme `#00ff00` ou `#ff00ff`, sans sol, ombre portee, decor,
  texture, gradient, texte, logo, UI, signature ou watermark.

## Verrous lore par planche

| Sujet | Silhouette et tenue verrouillees | Attaque / pose verrouillee |
|---|---|---|
| Zoey | queue-de-cheval, veste de sport rouge, haut clair, jean sombre | doubles pistolets |
| Bill | veteran age, barbe grise, beret et tenue militaire olive | rafale au fusil M16 |
| Ellis | jeune mecanicien, casquette, tee-shirt jaune, workwear bleu | lance-grenades et recul |
| Coach | carrure d'ancien lineman, polo violet/jaune, pantalon kaki | tronconneuse a deux mains |
| Rochelle | cheveux attaches, boucles, tee-shirt rose, jean sombre | hache d'incendie |
| Nick | cheveux sombres, costume blanc, chemise bleue | Magnum argente |
| Common Infected | un meme civil recemment infecte, chemise et cravate dechirees | sprint, griffe, saisie et morsure |
| Smoker | corps grand et voute, tumeurs faciales, veste sombre | langue de capture unique |
| Hunter | hoodie sombre, visage masque, mains bandees | griffes et bond court |
| Boomer Bile Host | Boomer male L4D1, ventre hypertrophie et pantalon dechire | vomissement de bile jaune-verte |
| Hunter Pounce | meme Hunter canonique, posture plus basse et comprimee | coil, launch, vol, landing sans victime |
| Spitter Acid Pool | Spitter L4D2 grande et maigre, cou allonge, haut rose | projectile corrosif et flaque contenue |
| Tank | Tank standard, enorme haut du corps, petit crane, jean dechire | punch, slam et lancer de beton |
| Witch | peau pale, cheveux blond platine, tenue blanche dechiree, longues griffes | startle, sprint et double slash |
| Witch Crying Corner | meme Witch standard, sans mur ni variante bride | pleurs assis, reveil puis charge |
| Tank Horde Breaker | meme Tank standard, aucune armure ni nouvelle mutation | charge, backhand, bulldoze et ground slam |

## Generation et post-traitement

1. Seize appels independants au `built-in image_gen` ont produit des sources
   RGB de `1254x1254` sur chroma vert ou magenta uniforme.
2. Chaque asset visuellement valide a ete enregistre dans le workspace des
   qu'il etait pret, avant de poursuivre le lot suivant.
3. Le fond a ete retire avec le helper installe :
   `remove_chroma_key.py --auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill
   --edge-contract 1`.
4. `scripts/normalizeGeneratedSpriteSheet.py` a reconstruit les seize sujets
   et leurs effets associes sur une grille finale `1024x1024`, en les recentrant
   par cellule avec une marge minimale de `12 px`.
5. Tout RGB cache sous un alpha nul a ete remis a zero. Aucun source, apercu ou
   intermediaire n'a ete ajoute au depot.

## QA technique finale

Seuil d'occupation et de marge : `alpha > 12`.

Les seize fichiers partagent les resultats suivants :

- dimensions exactes `1024x1024` et mode `RGBA` ;
- plage alpha `0..255` et coins transparents ;
- `16/16` cellules occupees ;
- marge transparente minimale de `12 px` dans chaque cellule ;
- `0` pixel visible sur les doubles bandes des frontieres internes ;
- `0` pixel visible correspondant encore au chroma vert ou magenta utilise ;
- `0` pixel RGB non nul sous `alpha=0` ;
- aucun texte, logo, UI, watermark, decor ou second personnage apres
  inspection a la resolution originale.

| Fichier | SHA-256 |
|---|---|
| `bill-l4d.png` | `ac332da92da6585c2699a1db970c96b839faccd484d737a2898e5abf5cd1f607` |
| `coach-l4d.png` | `7b4ba6d7d9a9a51b49d47f9aa68cf0c243a8d4e9fa35cc76e6ef8ede527e788e` |
| `ellis-l4d.png` | `aca40dc3eac7b48f2933e219eeb26626a80ceebd5721dd806eedbeba942a1aca` |
| `nick-l4d.png` | `681b44ec6a52e0e36057848476edc4e842ab873351e8541cb10ffed4a274df49` |
| `rochelle-l4d.png` | `f76022d79b3e0dff71938f4fb637325e02a2989618d354873e67df7568a5c7fa` |
| `zoey-l4d.png` | `302837669936a0f116ff0f873091e65d8c4d0d575fa865d14789290182152c15` |
| `boomer-bile-host.png` | `8f2bd50cebe44aeeb49367bf3f4bf2a135504d7b021010d876ef1f4ac420859b` |
| `common-infected.png` | `46d184f67fc647c2b2556c39b5c858f2a81c06032ae0305222632b2c6e647d58` |
| `hunter-pounce.png` | `e36c06e6b3acfefb4fb321d5ba88e0defc1c4147070853948624c4f1f3640517` |
| `hunter.png` | `be077391bbc3aa3071f987ced0c1c2821f4c8a98a57017d7117b6ad0c5c3d0bc` |
| `smoker.png` | `54a89d93b25feaa19375099225f2f05aee154f33d1e9a7ebb380f6e9dacd381c` |
| `spitter-acid-pool.png` | `2b9e0e5bd9e7b9aaa1a0c16e273eff9ea3479701c2d63b031b97231e80be0714` |
| `tank-horde-breaker.png` | `5912337baa2fe6f4c8888b0a0c32836f643a6ec0b89d0ad0ff65c1a3d5c5a846` |
| `tank.png` | `ca7d9e52e940305fb7f6036d90f21651e30ca5d593c2c284698cde7d2eaa8335` |
| `witch-crying-corner.png` | `f17ba3c84be7f13de9dee39662bf0eb0e8cdb4eb7b21d90a1b73002699a87842` |
| `witch.png` | `d8f845cbfe1fd4eb44f3f6447be96f1e94e5f778024d7ab0681c8e9cdc19757b` |

## Controle visuel final

Chaque PNG a ete inspecte apres le detourage et la reconstruction, a sa
resolution finale sur fond sombre. Les seize poses de chaque planche sont
completes et distinctes, les quatre lignes restent lisibles et les variations
specialisees conservent la meme creature canonique : Hunter Pounce reste un
Hunter, Witch Crying Corner reste la Witch standard et Tank Horde Breaker reste
le Tank standard.

Les effets de gameplay importants sont conserves sans debordement : langue du
Smoker, bile du Boomer, pounce du Hunter, acide de la Spitter, griffes de la
Witch, debris et lancer de beton du Tank.

## Hors perimetre confirme

Aucun fichier JavaScript, JSON, manifeste, registre, asset d'un autre univers,
musique, configuration, dependance ou metadonnee Git n'a ete modifie pour ce
lot. Aucun commit, push ou deploiement n'a ete execute.
