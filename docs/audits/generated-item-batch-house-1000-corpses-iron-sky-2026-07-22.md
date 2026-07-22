# Audit OpenAI ImageGen - objets House of 1000 Corpses et Iron Sky

Date : 2026-07-22

## Perimetre livre

Ce lot contient exactement huit icones d'objets originales fan-made :

- `House of 1000 Corpses` : 4 icones ;
- `Iron Sky` : 4 icones.

Chaque objet a ete genere independamment avec OpenAI ImageGen integre, apres
recherche de references visuelles et narratives. Huit generations valides ont
ete retenues. Une premiere tentative de l'unite de controle du Gotterdammerung
a produit un fichier vide a cause de la saturation du disque ; ce fichier a
ete rejete et l'objet a ete relance seul. Le lot totalise donc neuf tentatives,
dont huit sources exploitables et huit fichiers finaux.

Aucun manifest, registre, fichier de code, profil musical, commit ou
deploiement n'a ete modifie pour ce lot.

## Fichiers produits

### House of 1000 Corpses

- `public/sprites/generated/items/house-of-1000-corpses/captain-spaulding-mask.png`
- `public/sprites/generated/items/house-of-1000-corpses/murder-ride-ticket.png`
- `public/sprites/generated/items/house-of-1000-corpses/otis-revolver.png`
- `public/sprites/generated/items/house-of-1000-corpses/dr-satan-surgical-tool.png`

### Iron Sky

- `public/sprites/generated/items/iron-sky/command-smartphone.png`
- `public/sprites/generated/items/iron-sky/moon-helmet.png`
- `public/sprites/generated/items/iron-sky/flying-saucer-key.png`
- `public/sprites/generated/items/iron-sky/gotterdammerung-control-unit.png`

## References consultees

### House of 1000 Corpses

- [Trick or Treat Studios - masque Captain Spaulding officiellement licence](https://trickortreatstudios.com/products/house-of-1-000-corpses-captain-spaulding-mask)
- [Filmsite - synopsis illustre du musee et du Murder Ride](https://www.filmsite.org/houseof1000corpses.html)
- [IMDb - synopsis du film et du Murder Ride](https://www.imdb.com/title/tt0251736/plotsummary/)
- [IMFDB - armes identifiees dans House of 1000 Corpses](https://www.imfdb.org/wiki/House_of_1000_Corpses)
- [Trick or Treat Studios - Driller Killer Doctor Satan et son foret](https://trickortreatstudios.com/products/house-of-1000-corpses-driller-killer-doctor-satan-figure)
- [Michael Crawford - inventaire detaille des quinze outils de Dr. Satan](https://www.mwctoys.com/REVIEW_040605b.htm)

Decisions de fidelite :

| Objet | Decision |
| --- | --- |
| Masque de Captain Spaulding | Le latex vide reprend le crane chauve, le maquillage blanc, les aplats bleus, les joues rouges, le sourire jauni, la barbe grise et le petit chapeau patriotique. Les orbites noires et la sangle laterale le font lire comme un masque, jamais comme une tete coupee. |
| Ticket Murder Ride | Le Murder Ride est canonique, mais aucun ticket de production distinct n'a ete trouve. Le papier perfore, la palette rouge/noir, le medaillon clown macabre et le wagonnet constituent une extrapolation originale de fete foraine rurale en 1977, sans texte. |
| Revolver d'Otis | L'IMFDB attribue a Otis un Colt M1911A1 dans le film, pas un revolver. Le nom et l'ancrage visuel demandes par le canon projet ont ete conserves sans pretendre reproduire un prop ecran : revolver americain d'epoque, acier bruni et crosse bois. Une future passe de donnees pourra renommer ou remplacer cet objet par le M1911A1 canonique. |
| Outil de Dr. Satan | Les sources licenciees documentent son foret rotatif et un kit de pinces, ciseaux, clamps, alenes et burins. L'icone fusionne ces indices en un trepan manuel articule original, medical et industriel, sans gore ni arme fantasy. |

### Iron Sky

- [Apple TV - fiche officielle du film et armada de soucoupes](https://tv.apple.com/us/movie/iron-sky/umc.cmc.43s8ordx4sru4e90moaru6lrm)
- [fxguide - fabrication VFX et concept art du pont du Gotterdammerung](https://www.fxguide.com/fxfeatured/space-nazis-the-making-of-iron-sky/)
- [Die Zeit - smartphone utilise pour rendre le Gotterdammerung operationnel](https://www.zeit.de/kultur/film/2012-02/iron-sky-berlinale)
- [taz - technologie retrofuturiste, smartphone et aspect industriel du vaisseau](https://taz.de/Trash-Film-Iron-Sky/!5096784/)
- [Apple - silhouette des appareils a bouton frontal de la periode](https://support.apple.com/de-de/102616)

Decisions de fidelite :

| Objet | Decision |
| --- | --- |
| Smartphone de commande | La fonction est canonique : le telephone de Washington fournit la puissance de calcul manquante. La silhouette noire a bande acier, bouton frontal et ecran bleu abstrait reste typique du debut des annees 2010, sans marque, texte ni copie d'interface. |
| Casque lunaire | Aucun casque isole correspondant exactement au nom du registre n'a ete documente. L'icone est une extrapolation du langage retrofuturiste lunaire du film : coque emaillee rivetee, visiere noire, col caoutchouc et port de tuyau, sans insigne. |
| Cle de soucoupe | Aucune cle de soucoupe n'est montree comme prop canonique. L'objet assume donc son statut de collectible projet : disque metallique a ailettes, lentille bleue et vraie lame d'allumage, dans les materiaux industriels des appareils lunaires. |
| Unite du Gotterdammerung | La fonction informatique et le pont analogique sont documentes, mais pas une boite amovible precise. L'icone extrapole un sous-systeme portable a lampes, radar, interrupteurs proteges et logement de smartphone, coherent avec le concept art du pont. |

## Prompts de generation

Socle commun applique a chaque appel :

```text
Use case: stylized-concept.
Asset type: 512x512 game inventory pickup icon.
Create exactly one complete centered object in highly detailed polished
32-bit pixel art, with crisp hand-placed pixel clusters and a silhouette
readable at 64 px. Original fan-made artwork informed by the researched
film/source, never a copied frame or merchandise sculpt. Entire object visible
in catalogue three-quarter view with generous padding. Perfectly flat uniform
solid #00FF00 chroma-key background. No person, character, hand, scenery,
floor, shadow, reflection, frame, HUD, readable text, letters, numbers, logo
or watermark. Do not use #00FF00 in the object.
```

Specifications distinctes passees aux huit generations valides :

| Fichier | Specification propre a l'appel |
| --- | --- |
| `captain-spaulding-mask.png` | Masque latex vide : calotte chauve, visage blanc sale, grandes formes bleues autour des ouvertures, joues rouges, sourire peint et dents jaunies, barbe grise et petit chapeau rouge/blanc/bleu ; orbites creuses et profondeur interieure obligatoires. |
| `murder-ride-ticket.png` | Ticket rural de 1977 en papier jauni, bord court perfore, coins coupes, ornement rouge/noir, medaillon clown-crane abstrait et minuscule wagonnet ; aucune inscription, chiffre ou code. |
| `otis-revolver.png` | Revolver double action a six coups, canon long, acier bleu sombre, tige d'ejection visible, crosse bois brun quadrillee, patine huileuse ; extrapolation projet explicitement demandee. |
| `dr-satan-surgical-tool.png` | Trepan mecanique non gore : corps de pince chirurgicale, anneaux articules, carter d'engrenage a manivelle, foret court entre machoires dentees et tissu sale autour d'une poignee. |
| `command-smartphone.png` | Telephone tactile noir du debut des annees 2010, bande acier, bouton frontal rond, ecran de controle bleu abstrait et batterie rouge faible ; aucune marque, application ou texte. |
| `moon-helmet.png` | Casque pressurise vide en metal blanc casse, plaques rivetees, large visiere noire, anneau de cou sombre, port de tuyau et verrous rouges ; aucune tete, tenue ou insigne. |
| `flying-saucer-key.png` | Une vraie cle mecanique : anneau en disque-soucoupe argente a six petites ailettes et lentille bleue, col Bakelite noir et lame acier courte a dents ; ni badge ni amulette. |
| `gotterdammerung-control-unit.png` | Boite de controle transportable gunmetal/vert-gris, poignee Bakelite, vis, interrupteurs cages, quatre lampes rouges, tube ambre, radar bleu et logement de smartphone ; aucun symbole ou etiquette. |

## Pipeline de transparence et normalisation

1. Generation de chaque source sur un fond chroma plat `#00FF00`.
2. Detourage avec le helper installe `remove_chroma_key.py` et les options
   `--auto-key border --soft-matte --transparent-threshold 12
   --opaque-threshold 220 --despill --edge-contract 1`.
3. Recadrage sur l'alpha utile, puis redimensionnement proportionnel dans une
   boite maximale de `448 x 448`.
4. Recentrage sur un canevas transparent `512 x 512`, garantissant au moins
   `32 px` de marge sur chaque cote.
5. Suppression des derniers pixels verts dominants de bord et normalisation de
   tous les pixels totalement transparents vers `(0, 0, 0, 0)`.
6. Inspection individuelle a `512 px`, inspection groupee sur damier clair et
   sombre, puis verification de la silhouette a `64 px`.

## Validation technique finale

| Fichier | Dimensions | Mode | Marges G/H/D/B | RGB sous alpha 0 | Chroma visible | Coins transparents |
| --- | --- | --- | --- | ---: | ---: | --- |
| `captain-spaulding-mask.png` | 512x512 | RGBA | 127/32/128/32 | 0 | 0 | oui |
| `murder-ride-ticket.png` | 512x512 | RGBA | 32/90/32/90 | 0 | 0 | oui |
| `otis-revolver.png` | 512x512 | RGBA | 32/38/32/38 | 0 | 0 | oui |
| `dr-satan-surgical-tool.png` | 512x512 | RGBA | 32/32/32/32 | 0 | 0 | oui |
| `command-smartphone.png` | 512x512 | RGBA | 145/32/145/32 | 0 | 0 | oui |
| `moon-helmet.png` | 512x512 | RGBA | 60/32/61/32 | 0 | 0 | oui |
| `flying-saucer-key.png` | 512x512 | RGBA | 34/32/35/32 | 0 | 0 | oui |
| `gotterdammerung-control-unit.png` | 512x512 | RGBA | 32/32/32/33 | 0 | 0 | oui |

Resultat global :

```json
{
  "files": 8,
  "successfulImageGenSources": 8,
  "failedZeroByteAttemptsDiscarded": 1,
  "dimensionsValid": 8,
  "rgbaValid": 8,
  "minimumMarginValid": 8,
  "transparentCornersValid": 8,
  "hiddenRgbViolations": 0,
  "visibleChromaPixels": 0,
  "visualReviewAt512Passed": 8,
  "visualReviewAt64Passed": 8
}
```

Les huit objets restent reconnaissables a petite taille et ne contiennent ni
personnage, main, decor, texte lisible, logo, cadre, HUD ou watermark. Les
extrapolations non visibles comme props a l'ecran sont signalees comme telles
afin de ne pas les presenter comme du canon filmique.
