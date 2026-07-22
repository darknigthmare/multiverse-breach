# Audit OpenAI ImageGen - objets Starship Troopers et Voyage de Chihiro

Date : 2026-07-22

## Perimetre

Ce lot contient exactement huit icones d'objets originales fan-made :

- Starship Troopers (1997) : 4 icones ;
- Voyage de Chihiro / Spirited Away (2001) : 4 icones.

Chaque objet a fait l'objet d'un appel OpenAI ImageGen distinct. Aucun appel
n'a produit une planche multi-objets. Le dango medicinal a recu un second appel
correctif : la premiere proposition etait trop plissee et sa silhouette pouvait
etre lue comme plusieurs morceaux. Seule la version continue et arrondie a ete
integree.

Aucun manifest, fichier JavaScript, registre d'assets, audit global, commit ou
deploiement n'a ete modifie ou execute pour ce lot.

## Fichiers produits

### Starship Troopers

- `public/sprites/generated/items/starship-troopers/morita-mk-i-rifle.png`
- `public/sprites/generated/items/starship-troopers/mobile-infantry-helmet.png`
- `public/sprites/generated/items/starship-troopers/tactical-mini-nuke.png`
- `public/sprites/generated/items/starship-troopers/citizenship-pamphlet.png`

### Voyage de Chihiro

- `public/sprites/generated/items/voyage-de-chihiro/bath-token.png`
- `public/sprites/generated/items/voyage-de-chihiro/herbal-dumpling.png`
- `public/sprites/generated/items/voyage-de-chihiro/purple-hair-tie.png`
- `public/sprites/generated/items/voyage-de-chihiro/train-ticket.png`

## Methode

1. Recherche de references officielles ou d'accessoires de production primaires
   avant chaque univers.
2. Un appel OpenAI ImageGen independant par objet, sans reutilisation d'une
   planche commune.
3. Generation en pixel art detaille sur fond chroma parfaitement uni :
   `#FF00FF` pour les quatre objets Starship Troopers et le dango, `#00FF00`
   pour le jeton, le lien pour cheveux et le billet.
4. Suppression locale du chroma avec
   `remove_chroma_key.py --auto-key border --soft-matte --despill`.
5. Second passage avec `--edge-contract 1` apres detection de 2 a 73 pixels de
   chroma situes uniquement dans les franges d'alpha faible. Aucun de ces pixels
   n'avait un alpha superieur ou egal a 128.
6. Redimensionnement premultiplie, recentrage dans une boite maximale de
   `448 x 448`, puis export final en `512 x 512`, mode `RGBA`.
7. Normalisation de chaque pixel totalement transparent vers `(0, 0, 0, 0)` et
   suppression finale des residus de cle de tres faible alpha.
8. Verification automatique des dimensions, du canal alpha, des coins, des
   marges, du RGB cache et des residus de chroma.
9. Inspection visuelle des huit icones sur damier clair et sombre, puis controle
   individuel a l'echelle native des surfaces imprimees et du casque.

## References

### Starship Troopers (1997)

- [Sony Pictures - Starship Troopers](https://www.sonypictures.com/movies/starshiptroopers)
  constitue la reference studio officielle de l'incarnation de 1997.
- [Propstore - coque de Morita MK I utilisee en production](https://usm.propstoreauction.com/lot-details/index/catalog/267/lot/62880/Lot-772-STARSHIP-TROOPERS-1997-Morita-MK-I-Rifle-Casing)
  documente la coque en fibre de verre olive, le chargeur et la bouche noirs.
- [Propstore - casque de Mobile Infantry](https://propstoreauction.com/lot-details/index/catalog/508/lot/197734/374-Mobile-Infantry-Helmet-STARSHIP-TROOPERS-1997)
  documente le casque gris sombre en fibre de verre et sa jugulaire.
- [Heritage Auctions - lanceur nucleaire tactique MK55 de production](https://entertainment.ha.com/itm/movie-tv-memorabilia/props/starship-troopers-tri-star-1997-mk55-tactical-nuclear-launcher/a/7356-90526.s)
  documente la construction olive/noire, les munitions amovibles et les
  composants pratiques du lanceur.
- [Scenario de Starship Troopers](https://cemp.ac.uk/scriptzone/script.php?id=571&type=download)
  sert de source primaire pour la propagande de recrutement, la citoyennete et
  l'emploi des charges nucleaires tactiques dans le recit.

Choix de fidelite :

- le Morita reprend la longue coque olive, la poignee-cadre noire et le fusil a
  pompe inferieur, sans numero, marquage ni sangle ;
- le casque reste vide, gris sombre, ouvert et utilitaire, sans tete, visiere ou
  insigne ;
- le mini-nuke represente une seule munition frontale compacte, pas un second
  lanceur ni une caisse de projectiles ;
- le pamphlet est une extrapolation originale de la propagande civique de la
  Federation, avec seulement des disques, chevrons et barres abstraites. Il ne
  pretend pas reproduire un accessoire ecran precis.

### Voyage de Chihiro / Spirited Away (2001)

- [Studio Ghibli - page officielle de l'oeuvre et 50 photogrammes](https://www.ghibli.jp/works/chihiro/)
  fournit la reference visuelle primaire du film, de l'Aburaya et du voyage en
  train.
- [Studio Ghibli - mise a disposition officielle des photogrammes](https://www.ghibli.jp/info/013344/)
  confirme l'origine Studio Ghibli des 50 vues consultees.
- [Studio Ghibli - The Art of Spirited Away](https://www.ghibli.jp/shuppan/old/books/data/the_sen.html)
  documente l'existence des image boards, decors et materiaux de conception du
  film.

Choix de fidelite :

- le jeton est une plaquette de bois laque rouge avec une marque jaune
  geometrique non linguistique, sans recopier de kanji ;
- le remede du dieu de la riviere reste un seul dango vert-brun, dense, amer et
  entier, sans assiette ni portion mordue ;
- le lien protecteur est une boucle tressee violette avec quelques fils rose et
  indigo, sans cheveux, perle ou pendentif ;
- le billet reprend un papier creme-orange ancien, un bord perfore et des
  tampons rouges abstraits, sans caractere japonais, lettre ou chiffre lisible.

## Prompts finaux

Le socle commun applique a chaque appel etait :

```text
Create exactly one complete, centered inventory item in polished detailed
32-bit pixel art. Original fan-made artwork informed by official film stills
and authenticated production-prop references, never a copied official frame or
asset. Use a three-quarter catalogue view with generous padding and a complete
HUD-readable silhouette. Place it on one perfectly flat chroma-key background
with no floor, shadow, reflection, gradient or texture. No person, hand,
character, readable text, letters, numbers, logo, UI, border or watermark.
```

Specifications propres a chaque objet :

| Fichier | Specification ajoutee au prompt |
| --- | --- |
| `morita-mk-i-rifle.png` | Long Morita olive en fibre de verre, poignee-cadre et mecanique noires, pompe inferieure nervuree, bouche metallique. |
| `mobile-infantry-helmet.png` | Casque vide gris charbon, dome compact, arcade angulaire, protections laterales, nuque evasee et jugulaire noire. |
| `tactical-mini-nuke.png` | Une munition nucleaire compacte assemblee, corps olive, nez et colliers noirs, ailettes courtes, surete rouge. |
| `citizenship-pamphlet.png` | Un depliant civique trois volets creme, bleu acier et rouge sombre, uniquement decore de formes abstraites. |
| `bath-token.png` | Une plaquette de bois vermillon usee, trou rond et marque geometrique jaune non linguistique. |
| `herbal-dumpling.png` | Un seul dango medicinal continu, spheroide, vert olive-brun, mat, legerement irregulier et non mordu. |
| `purple-hair-tie.png` | Une boucle ovale de fil violet et lavande tressee, quelques fils rose et indigo, noeud de jonction compact. |
| `train-ticket.png` | Un billet ferroviaire creme-orange, bord perfore, cadres noirs et tampons rouges composes uniquement de barres et points. |

## Validation technique

Toutes les validations passent :

| Fichier | Dimensions | Mode | Marges G/H/D/B | RGB sous alpha 0 | Chroma visible |
| --- | --- | --- | --- | ---: | ---: |
| `morita-mk-i-rifle.png` | 512x512 | RGBA | 32/91/32/91 | 0 | 0 |
| `mobile-infantry-helmet.png` | 512x512 | RGBA | 36/32/37/32 | 0 | 0 |
| `tactical-mini-nuke.png` | 512x512 | RGBA | 32/105/32/105 | 0 | 0 |
| `citizenship-pamphlet.png` | 512x512 | RGBA | 32/39/32/40 | 0 | 0 |
| `bath-token.png` | 512x512 | RGBA | 169/32/169/32 | 0 | 0 |
| `herbal-dumpling.png` | 512x512 | RGBA | 32/46/32/46 | 0 | 0 |
| `purple-hair-tie.png` | 512x512 | RGBA | 32/73/32/73 | 0 | 0 |
| `train-ticket.png` | 512x512 | RGBA | 32/99/32/99 | 0 | 0 |

Resultat global :

```json
{
  "files": 8,
  "dimensionsValid": 8,
  "rgbaValid": 8,
  "transparentCornersValid": 8,
  "minimumMarginValid": 8,
  "hiddenRgbViolations": 0,
  "visibleChromaPixels": 0,
  "visualReviewPassed": 8
}
```

## Inspection visuelle

Les huit objets sont entiers, centres, distincts et reconnaissables a l'echelle
d'un pickup ou d'un HUD. Les angles montrent a la fois la face principale et
l'epaisseur des accessoires. Aucun sprite ne contient de main, personnage,
creature, accessoire parasite, texte lisible, logo ou watermark. Les quatre
surfaces imprimees ou peintes utilisent uniquement des formes abstraites.

Les bords alpha restent propres sur damier clair et sombre apres le passage
`--edge-contract 1`. Aucun liseret vert ou magenta n'est visible. Le controle
final a ete effectue sur les huit PNG effectivement ecrits dans le depot, et non
sur les sources ImageGen temporaires.
