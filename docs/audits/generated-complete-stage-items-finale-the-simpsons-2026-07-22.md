# The Simpsons - decors, objets et finale OpenAI ImageGen - QA final

Date : 2026-07-22

## Perimetre

Cette passe est limitee aux decors, objets et finale non-combat de
`The Simpsons`. Elle livre douze assets :

- sept fichiers sous `public/backgrounds/lore-stages/the-simpsons/` ;
- quatre objets sous `public/sprites/generated/items/the-simpsons/` ;
- une finale sous
  `public/sprites/generated/finals/the-simpsons/noncombatfinal.png`.

`combat.webp` et `melee.webp` existaient deja. Ils ont ete reouverts, inspectes
a taille native et conserves sans modification car ils satisfaisaient le
contrat. Les cinq autres fichiers de stage, les quatre objets et la finale ont
ete produits avec le built-in OpenAI ImageGen, puis sauvegardes un par un apres
validation.

Aucun JS, JSON, manifest, registre, asset d'un autre univers ou metadata Git
n'a ete modifie. Aucun commit, push ou deploiement n'a ete effectue.

## References de continuite consultees

- [Disney+ - The Simpsons](https://www.disneyplus.com/series/the-simpsons/3ZoBZ52QHb4x)
- [Wikisimpsons - Sector 7-G](https://simpsonswiki.com/wiki/Sector_7-G)
- [Wikisimpsons - Donuts](https://simpsonswiki.com/wiki/Donuts)
- [Wikisimpsons - Duff Beer](https://simpsonswiki.com/wiki/Duff_Beer)
- [Wikisimpsons - Bart Simpson](https://simpsonswiki.com/wiki/Bart_Simpson)
- [Wikisimpsons - Bart's skateboard in the opening sequence](https://simpsonswiki.com/wiki/File%3ABart_Skateboard_Swoop_%28Opening_sequence%2C_Seasons_2-20%29.png)
- [Wikisimpsons - Clown Without Pity](https://simpsonswiki.com/wiki/Clown_Without_Pity)
- [Wikisimpsons - Evil Krusty Doll](https://simpsonswiki.com/wiki/Evil_Krusty_Doll)

Verrous retenus :

- la centrale de Springfield a deux tours de refroidissement ;
- le secteur 7-G contient le poste d'Homer, la console de securite T-437, les
  controles de temperature du coeur et des portes d'urgence vers les conduites
  d'eau lourde ;
- les donuts recurrents sont des anneaux au glacage rose et vermicelles colores ;
- Duff est associee a une canette rouge, mais l'asset reste volontairement sans
  marque, mot ni logo copie ;
- Bart est associe au skateboard ; le verrou du manifest local impose ici une
  planche rouge-orange, des roues jaunes et un deck raye ;
- la poupee Krusty maudite vient de `Clown Without Pity` et son interrupteur
  dorsal est la cle de lecture canonique.

Ces pages ont uniquement servi au verrouillage visuel. Tous les pixels livres
sont originaux et aucun photogramme, logo ou asset officiel n'a ete copie.

## Decision sur les deux fichiers existants

| Fichier | Decision | Motif |
| --- | --- | --- |
| `combat.webp` | Conserve tel quel | `1672x941 RGB`, salle de reacteur frontale, sol continu, centre de duel libre, aucun personnage, texte, UI ou watermark. |
| `melee.webp` | Conserve tel quel | `1672x941 RGB`, lecture laterale nette, large aire jouable, tuyauterie et portes jaunes coherentes, aucun contenu interdit. |

## Direction commune et prompts finaux

Bloc commun ImageGen : pixel art original tres detaille, pixels nets, volumes
lisibles en jeu, interieur industriel du Springfield Nuclear Power Plant,
palette violet/vert radioactif/jaune securite, tuyaux teal, acier sombre, aucune
personne ou silhouette, aucun texte, logo, UI, HUD, watermark ou signature.

| Asset | Verrou de prompt final |
| --- | --- |
| `melee-backdrop.webp` | Panorama profond du secteur 7-G et de la salle du reacteur, coeur vert central, passerelles et conduites en arriere-plan, sans plateforme jouable ni premier plan de collision. |
| `melee-platforms.webp` | Exactement huit plateformes laterales detachees en grille `4x2`, variantes acier, garde-corps et securite jaune, fond chroma magenta uniforme. |
| `rpg.webp` | Camera 2.5D peu plongeante, grande surface libre dans les 55 % inferieurs, reacteur visible au fond, portes jaunes et consoles violettes en peripherie. |
| `tactics.webp` | Perspective elevee trois-quarts, plateau complet strictement `8x6`, quatre coins visibles, rangees grandissant vers le premier plan, aucune couverture sur les 48 cellules. |
| `tactics-tiles.webp` | Exactement seize props/covers de centrale en grille `4x4`, perspective coherente avec le plateau, fond chroma magenta uniforme. |
| `pink-donut.png` | Un seul donut annulaire, glacage rose coulant, vermicelles rouges, jaunes, bleus et blancs, fond chroma vert. |
| `duff-beer-can.png` | Une seule canette rouge, dessus aluminium, ovale blanc vierge et bandes bleu-violet, aucun mot ou logo, fond chroma vert. |
| `bart-s-skateboard.png` | Une seule planche rouge-orange rayee, trucks metalliques et quatre roues jaunes, aucun personnage ou marquage, fond chroma vert. |
| `cursed-krusty-doll.png` | Une petite poupee clown vue de dos trois-quarts, cheveux bleu-vert, chemise verte, pantalon violet, chaussures jaunes, interrupteur clairement fixe au haut du dos et anneau de traction separe, fond chroma magenta. |
| `noncombatfinal.png` | Atlas carre : panorama du reacteur en haut, puis preuves, dossier a schemas non linguistiques, camera, cles, joint brise, enregistreur, barres de controle, consoles stable/alerte, portes fermee/ouverte, vannes, reacteurs stable/surchauffe/arret, fuite, effets, vignette de succes et vignette d'echec. Aucun acteur ni portrait. |

Correction finale du dossier : toute pseudo-ecriture a ete effacee et remplacee
par un quadrillage pale avec uniquement de grands cercles, rectangles, conduites
et connecteurs abstraits. La premiere poupee avec commande frontale et la
premiere finale avec pseudo-ecriture ont ete rejetees et ne sont pas dans le
workspace.

## Appels et traitement des sorties

1. Douze appels built-in ImageGen ont ete effectues : cinq stages, cinq appels
   pour quatre objets dont une correction de la poupee, et deux appels pour la
   finale dont une correction du dossier.
2. `melee-backdrop.webp` et `rpg.webp` sont sortis directement en `1672x941 RGB`.
3. La source tactique etait `1449x1086 RGB`; un seul pixel a ete retire du bord
   droit pour obtenir `1448x1086`, sans redimensionnement de la grille.
4. Les deux atlas de stage etaient des PNG `1254x1254 RGB` sur chroma magenta.
   `remove_chroma_key.py` a utilise l'echantillonnage de bord, soft matte,
   seuils 12/220, despill et contraction d'un pixel.
5. Les trois premiers objets ont utilise un chroma vert et le meme helper. Ils
   ont ete recadres sur leur alpha, ajustes proportionnellement dans une boite
   maximale de `448x448`, centres sur `512x512`, puis enregistres en PNG RGBA.
6. La poupee et la finale contiennent du violet legitime. Pour ne pas le
   detruire, le helper a utilise un matte dur avec tolerance 32, despill et
   contraction d'un pixel sur le chroma magenta.
7. La finale a conserve toute sa composition carree, puis a ete redimensionnee
   de `1254x1254` vers `1024x1024` avec alpha premultiplie.
8. Le RGB de tous les pixels a alpha zero a ete force a `0,0,0`. Les derniers
   pixels chroma quasi transparents ont ete retires. Tous les fichiers ont ete
   reouverts depuis leur chemin final.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 508 254 | `7d7a8a21bcaac45f7dc213faa7625d61db18498ebf1e2fe20e18aaafa2893138` |
| `melee.webp` | 1672x941 | RGB | 375 758 | `dc60a324dda2b0918c3af5fc266cdc1b48de6b978acf2fb7e1331eb34e37a17e` |
| `melee-backdrop.webp` | 1672x941 | RGB | 569 428 | `22fa1d3df99e5d7eff00291201d0a9d577c2205a1ddf921014c6ecea81b8fae4` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 614 684 | `5eb41d9c9309f5a9120a279a88d2bbfcf1b52f73455c302b1aa5d39713a405db` |
| `rpg.webp` | 1672x941 | RGB | 623 712 | `7223f29010d3b01585183c99eb7d2df455aabc19405550c7ecbc27a909e55cef` |
| `tactics.webp` | 1448x1086 | RGB | 607 278 | `2f9186be58168afda463e155a2d538eba4b516fdb66b54c629d3cd05d578433c` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 918 680 | `5e1879e06965982ae5727c128472bb40ae097d2193190786fafc384f39c0845a` |
| `pink-donut.png` | 512x512 | RGBA | 181 521 | `ac2c131400c53f3b4e1dda10911c68facd95064389f7c24061ed35063554adc5` |
| `duff-beer-can.png` | 512x512 | RGBA | 165 315 | `46cb7ffebecb3bd7428e77b68b4f7a716745711e2395f03fa474b155fbae6237` |
| `bart-s-skateboard.png` | 512x512 | RGBA | 166 973 | `80c1e2a48048b2c65cb8fa836d9b0e569dc7a2ed8002a2241da79b5d1e12e0f7` |
| `cursed-krusty-doll.png` | 512x512 | RGBA | 175 124 | `a528f4e52d76e4b019b3b0da188d1cd9ce6ea8082ecdd6289901be00224c6ccc` |
| `noncombatfinal.png` | 1024x1024 | RGBA | 1 524 010 | `dbc9f35319f05185d15983273d435192322dbd49ef388446b557f9d431810cb4` |

## QA alpha et chroma

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB cache | Chroma visible | Coins transparents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 199 044 | 143 786 | 229 686 | 0 | 0 | 4 / 4 |
| `tactics-tiles.webp` | 1 084 415 | 173 542 | 314 559 | 0 | 0 | 4 / 4 |
| `pink-donut.png` | 130 249 | 5 206 | 126 689 | 0 | 0 | 4 / 4 |
| `duff-beer-can.png` | 160 639 | 3 045 | 98 460 | 0 | 0 | 4 / 4 |
| `bart-s-skateboard.png` | 175 251 | 3 909 | 82 984 | 0 | 0 | 4 / 4 |
| `cursed-krusty-doll.png` | 189 015 | 5 851 | 67 278 | 0 | 0 | 4 / 4 |
| `noncombatfinal.png` | 322 252 | 42 624 | 683 700 | 0 | 0 | 4 / 4 |

Occupation alpha par cellule :

- plateformes `4x2` : `44662,46346,51399,46775,34200,35255,62200,52635` ;
- tuiles tactiques `4x4` :
  `34215,34187,34405,33785,25836,28138,24870,29574,37637,35091,33227,34192,15366,26177,27908,33493` ;
- toutes les 8 plateformes et les 16 tuiles occupent leur cellule ;
- aucune frange magenta ou verte visible sur les damiers de controle.

## QA grille tactique

- comptage visuel a taille native : neuf limites longitudinales, soit huit
  colonnes ;
- sept limites transversales, soit six rangees ;
- les 48 cellules sont vides, continues et comptables ;
- les quatre coins du plateau sont visibles ;
- les rangees s'agrandissent regulierement vers le premier plan ;
- aucun prop, mur ou console ne masque une cellule.

## QA visuelle finale

- les sept decors forment un meme secteur 7-G sans repetition de cadrage ;
- `combat`, `melee`, `rpg` et `melee-backdrop` offrent des zones centrales
  libres adaptees a leur usage ;
- les objets sont uniques, centres, entiers et lisibles a petite taille ;
- le donut possede un trou reellement transparent ;
- la canette ne contient aucun mot, lettre ou logo ;
- la planche montre exactement quatre roues jaunes ;
- l'interrupteur de la poupee est bien sur le haut du dos ;
- la finale separe clairement panorama, preuves, objectifs, etats, succes et
  echec sur transparence ;
- aucun personnage, texte, logo, UI, HUD, watermark ou signature n'a ete
  detecte dans le lot livre.

## Resultat

`PASS` : les douze assets existent aux chemins attendus, respectent leurs
dimensions et modes, passent les controles alpha/chroma et ont ete inspectes
visuellement a taille native ainsi que sur planches-contact temporaires.
