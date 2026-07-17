# Pack d'items Secret of Monkey Island - 2026-07-17

## Perimetre

Lot limite aux quatre objets declares dans `src/game/loreItemOverrides.js` pour
`Secret of Monkey Island`.

| Objet | Fichier |
| --- | --- |
| Rubber Chicken with Pulley | `public/sprites/generated/items/secret-of-monkey-island/rubber-chicken-with-pulley.png` |
| Grog Mug | `public/sprites/generated/items/secret-of-monkey-island/grog-mug.png` |
| Voodoo Doll | `public/sprites/generated/items/secret-of-monkey-island/voodoo-doll.png` |
| Treasure Map | `public/sprites/generated/items/secret-of-monkey-island/treasure-map.png` |

## References visuelles et lore

### Rubber Chicken with Pulley

- Monkey Island Wiki, page de l'objet et capture du sprite du jeu :
  https://monkeyisland.fandom.com/wiki/Rubber_Chicken_With_A_Pulley_In_The_Middle
- Capture directe utilisee comme reference de forme :
  https://static.wikia.nocookie.net/monkeyisland/images/3/31/Rubber_chicken_with_pulley.png/revision/latest?cb=20120430133133
- DVG, inventaire illustre de la version Amiga :
  https://www.dizionariovideogiochi.it/doku.php?id=secret_of_monkey_island_the_amiga

Points conserves : corps de poulet en caoutchouc jaune-orange, pose longue et
molle, bec ouvert et poulie metallique placee exactement au milieu du corps.

### Grog Mug

- DVG, sprite de la tasse de grog et ses trois stades de dissolution :
  https://www.dizionariovideogiochi.it/doku.php?id=secret_of_monkey_island_the_amiga
- GameFAQs, catalogue d'objets illustre a partir de la version CD :
  https://gamefaqs.gamespot.com/pc/562681-the-secret-of-monkey-island/faqs/81610/items

Points conserves : chope en etain compacte, liquide vert vif visible, metal
cabosse et legerement attaque par l'acide. La chope reste complete pour rester
lisible comme objet ramassable.

### Voodoo Doll

- Monkey Island Wiki, historique et captures des poupees de `Monkey Island 2` :
  https://monkeyisland.fandom.com/wiki/Voodoo_Doll
- Sprite de la poupee et de ses epingles utilise comme reference :
  https://static.wikia.nocookie.net/monkeyisland/images/c/c7/Doll-pins-mi2.png/revision/latest?cb=20120424143025
- Hintbook original de `Monkey Island 2`, contexte de fabrication de la poupee :
  https://www.mocagh.org/lucasfilm/mi2-hintbook.pdf

La poupee vaudou n'apparait pas dans le premier episode. Le registre local la
classe dans ce pack de franchise : l'icone suit donc son apparence canonique de
`Monkey Island 2`, avec tissu gris, coutures, fils colores et une seule epingle,
comme l'exige la description locale.

### Treasure Map

- Monkey Island Wiki, carte du tresor de Melee Island :
  https://monkeyisland.fandom.com/wiki/M%C3%AAl%C3%A9e_Island_Treasure_Map
- Gros plan du parchemin du jeu utilise comme reference visuelle :
  https://static.wikia.nocookie.net/monkeyisland/images/1/1d/Map_to_treasure_close.gif/revision/latest?cb=20120430132638
- StrategyWiki, contexte de la carte achetee et de son itineraire dans la foret :
  https://strategywiki.org/wiki/The_Secret_of_Monkey_Island/Part_One%3A_The_Three_Trials

Points conserves : parchemin use, bords irreguliers, symboles de foret et rose
des vents. Les instructions textuelles du jeu sont volontairement remplacees
par une route rouge en pointilles et un X, sans aucun mot lisible, conformement
a `loreItemOverrides.js`.

## Generation OpenAI

Mode utilise : OpenAI ImageGen integre, une generation distincte par objet.
Chaque capture du jeu a servi de reference visuelle pour verrouiller la
silhouette sans copier son fond, son interface ou sa presentation.

### Prompt final - Rubber Chicken

> Icone de ramassage en pixel art detaille du poulet en caoutchouc avec poulie
> de The Secret of Monkey Island. Un seul poulet jaune-orange complet, allonge
> et mou, bec ouvert, avec une petite poulie metallique lisible montee exactement
> au centre du torse. Aucun personnage, cable, texte, cadre, logo ou recadrage,
> sur fond chroma vert uniforme.

### Prompt final - Grog Mug

> Icone de ramassage en pixel art detaille de la chope de grog de The Secret of
> Monkey Island. Une seule chope en etain cabossee, vue legerement du dessus,
> remplie de grog vert emeraude corrosif avec une vapeur discrete et un bas de
> chope legerement attaque. Aucun personnage, texte, decor ou recadrage, sur fond
> chroma magenta uniforme afin de conserver le liquide vert.

### Prompt final - Voodoo Doll

> Icone de ramassage en pixel art detaille d'une poupee vaudou de Monkey Island.
> Une seule petite poupee pirate en tissu gris et beige, raccommodee, avec yeux
> boutons, fils rouge, bleu et jaune, et exactement une longue epingle dans le
> torse. Aucune main, deuxieme poupee, epingle supplementaire, texte, decor ou
> recadrage, sur fond chroma vert uniforme.

### Prompt final - Treasure Map

> Icone d'objet evenementiel en pixel art detaille de la carte au tresor de
> Melee Island. Un seul parchemin ancien partiellement ouvert, bords dechires,
> symboles discrets d'ile et de foret, rose des vents, route rouge en pointilles
> terminee par un petit X. Aucun mot, lettre, chiffre, personnage, accessoire,
> texte ajoute, logo ou recadrage, sur fond chroma vert uniforme.

## Normalisation

- Extraction du chroma avec
  `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Cle detectee automatiquement sur la bordure de chaque image.
- Matte adouci, despill et contraction de bord de 1 px.
- Recadrage sur la boite alpha, puis redimensionnement nearest-neighbor dans une
  zone maximale de `464x464`.
- Centrage final sur un canevas transparent `512x512 RGBA`, avec au moins 24 px
  de marge sur l'axe le plus contraint.

## Validation

| Fichier | Format | Boite alpha | Marges G/H/D/B | Alpha partiel | Chroma residuel |
| --- | --- | --- | --- | ---: | ---: |
| `rubber-chicken-with-pulley.png` | 512x512 RGBA | 24,114 - 488,398 | 24 / 114 / 24 / 114 | 514 px | 0 px |
| `grog-mug.png` | 512x512 RGBA | 44,24 - 468,488 | 44 / 24 / 44 / 24 | 2145 px | 0 px |
| `voodoo-doll.png` | 512x512 RGBA | 35,24 - 476,488 | 35 / 24 / 36 / 24 | 2082 px | 0 px |
| `treasure-map.png` | 512x512 RGBA | 24,113 - 488,399 | 24 / 113 / 24 / 113 | 367 px | 0 px |

Controle visuel final :

- un seul objet complet par image ;
- aucun element coupe ;
- quatre coins entierement transparents ;
- aucune frange chroma detectee ;
- poulie centrale lisible ;
- liquide vert visible sans suppression par le chroma ;
- une seule epingle sur la poupee ;
- route rouge et aucun mot lisible sur la carte ;
- aucune main, personnage, interface, logo, watermark ou decor parasite.

## Fichiers exclus

Aucun fichier JS, manifeste, registre, commit, push ou deploiement n'a ete
modifie ou execute pour ce lot.
