# Pack d'items Cool Spot - 2026-07-17

## Perimetre

Pack complet des quatre objets ramassables declares pour `Cool Spot` dans
`src/game/loreItemOverrides.js`.

| Objet | Fichier |
| --- | --- |
| 7UP Bottle | `public/sprites/generated/items/cool-spot/7up-bottle.png` |
| Cool Point Token | `public/sprites/generated/items/cool-spot/cool-point-token.png` |
| Health Beaker | `public/sprites/generated/items/cool-spot/health-beaker.png` |
| Cage Key | `public/sprites/generated/items/cool-spot/cage-key.png` |

## References visuelles et lore

### Source principale des objets

- The Spriters Resource, feuille `Items` extraite de la version SNES :
  https://www.spriters-resource.com/snes/coolspot/asset/46611/
- StrategyWiki, fonctionnement des Cool Points, de la fiole de sante et de la
  cage :
  https://strategywiki.org/wiki/Cool_Spot/Gameplay
- Guide SNES GameFAQs, description de l'Uncola Glass et des Cool Points :
  https://gamefaqs.gamespot.com/snes/588262-cool-spot/faqs/13563

La feuille SNES a ete telechargee comme reference locale, puis les silhouettes
du Cool Point, de la fiole et de la cle ont ete isolees sans etre integrees
directement aux fichiers finaux.

### Bouteille

- Capture de l'introduction montrant Cool Spot surfant sur la bouteille :
  https://stoneagegamer.com/blog/why-i-love-cool-spot
- Article de contexte sur la bouteille verte sans marque des versions
  europeennes :
  https://www.retrogamingplanet.it/cool-spot-1993/

Points conserves : bouteille en verre vert emeraude, corps large et court,
epaulement arrondi, col court et capsule metal blanc-argent. L'etiquette
finale est volontairement abstraite : panneau creme et simple disque rouge,
sans nom, lettres, chiffres ni logo lisible.

### Cool Point Token

La forme suit le premier angle de rotation de la feuille SNES : disque rouge
compact, reflet clair en haut a gauche, coeur cramoisi et bord sombre en bas a
droite. Aucun visage, membre ou accessoire de Cool Spot n'a ete ajoute.

### Health Beaker

La fiole reprend le pickup SNES et non une fiole de laboratoire generique :
verre transparent au col rectangulaire et a la base evasee, contour sombre,
liquide rouge dans le fond et trois bulles d'effervescence.

### Cage Key

La couleur et la silhouette suivent le sprite du jeu : petite cle massive
blanc-argent, contour gris sombre, axe court et insert carre rouge. La version
finale n'utilise donc pas une cle medievale en laiton, qui aurait ete moins
fidele a la reference visuelle.

## Generation OpenAI

Mode utilise : OpenAI ImageGen integre, avec une generation distincte pour
chaque objet et une image de reference locale par generation.

### Prompt final - 7UP Bottle

> Icone de ramassage pixel art detaillee d'une seule bouteille Cool Spot.
> Conserver la bouteille courte en verre vert emeraude, les epaules arrondies,
> le col court et la capsule blanc-argent de la capture du jeu. Etiquette creme
> avec un simple disque rouge abstrait, sans marque, lettres ni chiffres.
> Bouteille entiere, centree, sans personnage, decor, ombre, texte, logo,
> doublon ou recadrage, sur fond chroma magenta parfaitement uniforme.

### Prompt final - Cool Point Token

> Icone de ramassage pixel art detaillee d'un seul Cool Point. Disque rouge
> compact fidele au sprite SNES, reflet corail en haut a gauche, centre
> cramoisi et bord rouge sombre en bas a droite. Aucun visage, membre,
> lunettes, nombre, marque ou texte. Objet entier et centre sur fond chroma
> vert parfaitement uniforme.

### Prompt final - Health Beaker

> Icone de ramassage pixel art detaillee d'une seule fiole de sante Cool Spot.
> Verre transparent au col rectangulaire et a la base evasee, contours
> blanc-gris et noir, liquide rouge vif dans le fond et exactement trois
> bulles au-dessus. Aucun personnage, etiquette, marque, texte ou objet
> supplementaire. Fiole entiere sur fond chroma vert parfaitement uniforme.

### Prompt final - Cage Key

> Icone de ramassage pixel art detaillee d'une seule cle de cage Cool Spot,
> fidele au sprite SNES : metal blanc-argent, contour gris sombre, petite
> poignee verticale arrondie, axe horizontal court vers la droite, dent
> arcade massive et petit insert carre rouge. Aucun personnage, cage,
> cadenas, texte, symbole, doublon ou recadrage, sur fond chroma vert
> parfaitement uniforme.

## Normalisation

- Extraction du fond avec
  `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Cle magenta pour la bouteille verte et cle verte pour les trois autres
  objets.
- Matte adouci, despill et contraction de bord de 1 px.
- Redimensionnement final en `512x512` avec echantillonnage nearest-neighbor.
- Conservation du canevas carre et des marges genereuses pour eviter tout
  recadrage dans l'interface.

## Validation

| Fichier | Format | Boite alpha | Marges G/H/D/B | Alpha partiel | Chroma residuel |
| --- | --- | --- | --- | ---: | ---: |
| `7up-bottle.png` | 512x512 RGBA | 43,163 - 469,361 | 43 / 163 / 43 / 151 | 544 px | 0 px |
| `cool-point-token.png` | 512x512 RGBA | 112,98 - 416,400 | 112 / 98 / 96 / 112 | 420 px | 0 px |
| `health-beaker.png` | 512x512 RGBA | 149,55 - 367,447 | 149 / 55 / 145 / 65 | 916 px | 0 px |
| `cage-key.png` | 512x512 RGBA | 106,99 - 417,371 | 106 / 99 / 95 / 141 | 664 px | 0 px |

Controles effectues :

- quatre coins entierement transparents pour chaque fichier ;
- aucune fuite verte ou magenta parmi les pixels visibles ;
- un seul objet par image, hormis les trois bulles fonctionnelles de la fiole ;
- aucun element coupe, personnage, texte, logo lisible, cadre ou watermark ;
- silhouettes encore lisibles dans une previsualisation nearest-neighbor a
  `64x64` ;
- `node scripts/itemAssetAudit.mjs` valide les quatre chemins, le format
  `512x512` et l'alpha ; `Cool Spot` est compte comme pack complet.

## Fichiers exclus

Ce lot ne modifie aucun fichier JavaScript, manifeste, registre partage ou
prompt pack. Aucun commit, push ou deploiement n'a ete effectue.
