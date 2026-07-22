# Audit OpenAI ImageGen - objets Kazaam et La Cite de la Peur

Date : 2026-07-22

## Perimetre livre

Ce lot contient exactement huit icones d'objets originales fan-made :

- `Kazaam` : 4 icones ;
- `La Cite de la Peur` : 4 icones.

Chaque objet a ete genere independamment avec OpenAI ImageGen integre. Les
huit sources retenues ont ete controlees visuellement avant detourage, puis les
huit PNG finaux ont ete controles a `512 px` et a `64 px`.

Ce lot n'a modifie aucun fichier de code, manifest, registre ou musique et n'a
cree aucun commit.

## Fichiers produits

### Kazaam

- `public/sprites/generated/items/kazaam/battered-boombox.png`
- `public/sprites/generated/items/kazaam/magic-lamp.png`
- `public/sprites/generated/items/kazaam/basketball.png`
- `public/sprites/generated/items/kazaam/stolen-cassette.png`

### La Cite de la Peur

- `public/sprites/generated/items/la-cite-de-la-peur/red-is-dead-sickle.png`
- `public/sprites/generated/items/la-cite-de-la-peur/hammer.png`
- `public/sprites/generated/items/la-cite-de-la-peur/cannes-festival-badge.png`
- `public/sprites/generated/items/la-cite-de-la-peur/film-reel.png`

## References consultees

### Kazaam

- [Disney D23 - fiche officielle Kazaam](https://d23.com/a-to-z/kazaam-film/)
- [ZekeFilm - images et rappel de la lampe puis de la boombox](https://www.zekefilm.org/2018/10/21/kazaam-1996-blu-ray-review/)
- [Roger Ebert - boombox et intrigue des enregistrements pirates](https://www.rogerebert.com/reviews/kazaam-1996)
- [IMDb - galerie et synopsis du film](https://www.imdb.com/title/tt0116756/)

Decisions de fidelite :

| Objet | Decision |
| --- | --- |
| Boombox abimee | Le boombox abime qui libere et heberge Kazaam est canonique et confirme par Disney D23. Aucun modele commercial exact n'a ete identifie avec certitude : l'icone reprend donc une silhouette noire a deux haut-parleurs, cassette centrale, poignee et commandes analogiques typiques du debut des annees 1990, sans marque. |
| Lampe magique | Une lampe antique apparait dans la mise en place initiale avant le transfert vers le boombox. Les references disponibles ne documentent pas assez le prop pour une reproduction exacte : la lampe en laiton use, basse et allongee est une extrapolation visuelle prudente, avec seulement quelques pixels magiques violets. |
| Ballon de basket | Le basket est lie a la vedette et intervient directement dans le denouement avec Malik transforme en ballon. L'icone reste un ballon orange non marque, use et periodiquement credible plutot qu'un produit NBA copie. |
| Cassette volee | L'intrigue de Nick et Malik repose sur un enregistrement pirate. Le boitier exact et son etiquette ne sont pas documentes : la coque transparente, les moyeux rouges et l'etiquette vierge constituent une extrapolation fidele aux cassettes audio des annees 1990. |

### La Cite de la Peur

- [AlloCine - fiche, synopsis et galerie du film de 1994](https://www.allocine.fr/film/fichefilm_gen_cfilm=9400.html)
- [Nestflix - Red Is Dead et photogrammes du tueur](https://nestflix.fun/red-is-dead/)
- [La Cite de la peur - synopsis detaille](https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_%28film%2C_1994%29)
- [Red Is Dead - synopsis du film dans le film](https://redisdead.eu/)

Decisions de fidelite :

| Objet | Decision |
| --- | --- |
| Faucille Red Is Dead | La faucille est l'une des deux armes canoniques du tueur. L'icone conserve une lame d'outil agricole tres courbee, un manche bois court et une usure de prop a petit budget, sans sang ni symbolique ajoutee. |
| Marteau | Le marteau est l'autre arme canonique du tueur. La silhouette retenue est volontairement celle d'un marteau de charpentier ordinaire et use, sans taille excessive, ornement fantasy ou gore. |
| Badge du Festival de Cannes | Le Festival de Cannes et les coulisses de projection sont canoniques, mais aucun badge isole precis n'a ete documente dans les references consultees. Le pass lamine creme, rouge et bleu est donc un collectible original de 1994, sans Palme, logo, texte ni numero copie. |
| Bobine du film | La projection de `Red Is Dead` et ses projectionnistes sont au coeur de l'intrigue. Aucun prop de bobine isole n'a ete retrouve : l'icone utilise une bobine 35 mm en aluminium fonctionnelle et periodiquement credible, avec une courte amorce de pellicule. |

## Prompts de generation

Socle commun passe aux huit appels distincts :

```text
Use case: stylized-concept.
Asset type: 512x512 collectible game item icon.
Create exactly one complete centered object in highly detailed crisp 32-bit
pixel art, with deliberate pixel clusters and a silhouette readable at 64 px.
Original fan-made artwork informed by researched film references. Keep at
least 12.5 percent padding. Perfectly flat uniform solid #00FF00 chroma-key
background. No character, hand, scenery, floor, shadow, reflection, frame,
HUD, logo, watermark, letters, numbers or readable text. Do not use #00FF00
inside the object.
```

Specifications propres a chaque generation :

| Fichier | Specification propre a l'appel |
| --- | --- |
| `battered-boombox.png` | Grand boombox noir/charbon du milieu des annees 1990, poignee integree, deux haut-parleurs circulaires, cassette centrale, tuner analogique, gros boutons et coins rayes. |
| `magic-lamp.png` | Lampe ancienne basse en laiton martele, reservoir rond, long bec courbe, petit couvercle articule, anse et quelques etincelles violettes opaques au bec. |
| `basketball.png` | Un ballon orange en cuir granule, huit rainures noires et usure moderee, sans marque, equipe, signature ou texte. |
| `stolen-cassette.png` | Cassette audio en plastique fume transparent, deux moyeux rouges, bande brune, etiquette beige vierge et une courte boucle de bande sortie. |
| `red-is-dead-sickle.png` | Faucille theatrale pratique, manche bois sombre court et une lame acier tres courbee, usee mais sans sang. |
| `hammer.png` | Marteau de charpentier banal des annees 1990, manche bois sombre, tete acier simple, face plate et griffe courbee, sans gore. |
| `cannes-festival-badge.png` | Pass 1994 creme sous pochette transparente, blocs geometriques rouge et bleu, emplacement photo vide, lignes vierges, crochet metal et laniere bleu nuit. |
| `film-reel.png` | Une bobine 35 mm en aluminium a cinq branches, pellicule noire enroulee et courte amorce perforee, materiel de cinema sans magie. |

## Pipeline de transparence et normalisation

1. Generation des huit sources sur un fond chroma plat `#00FF00`.
2. Detourage avec `remove_chroma_key.py` et les options
   `--auto-key border --soft-matte --transparent-threshold 12
   --opaque-threshold 220 --despill --edge-contract 1`.
3. Suppression des pixels de chroma residuels, recadrage sur l'alpha utile et
   redimensionnement proportionnel dans une boite maximale de `448 x 448`.
4. Recentrage sur un canevas transparent `512 x 512`, garantissant au moins
   `32 px` de marge sur chaque cote.
5. Normalisation des pixels totalement transparents vers `(0, 0, 0, 0)`.
6. Inspection individuelle et groupee a `512 px`, puis verification des huit
   silhouettes a `64 px`.

## Validation technique finale

| Fichier | Dimensions | Mode | Marges G/H/D/B | RGB sous alpha 0 | Chroma visible | Coins transparents |
| --- | --- | --- | --- | ---: | ---: | --- |
| `battered-boombox.png` | 512x512 | RGBA | 32/86/32/87 | 0 | 0 | oui |
| `magic-lamp.png` | 512x512 | RGBA | 32/89/32/89 | 0 | 0 | oui |
| `basketball.png` | 512x512 | RGBA | 32/33/32/34 | 0 | 0 | oui |
| `stolen-cassette.png` | 512x512 | RGBA | 32/69/32/70 | 0 | 0 | oui |
| `red-is-dead-sickle.png` | 512x512 | RGBA | 50/32/50/32 | 0 | 0 | oui |
| `hammer.png` | 512x512 | RGBA | 88/32/89/32 | 0 | 0 | oui |
| `cannes-festival-badge.png` | 512x512 | RGBA | 145/32/146/32 | 0 | 0 | oui |
| `film-reel.png` | 512x512 | RGBA | 32/33/32/34 | 0 | 0 | oui |

Resultat global :

```json
{
  "files": 8,
  "distinctImageGenCalls": 8,
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

Les huit objets sont entiers, centres, sans personnage, main, decor, cadre,
HUD, logo, watermark ou texte lisible. Les elements non documentes comme props
isoles a l'ecran sont explicitement signales comme extrapolations.
