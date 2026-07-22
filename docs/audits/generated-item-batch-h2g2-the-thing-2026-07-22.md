# Audit OpenAI ImageGen - objets H2G2 et The Thing

Date : 2026-07-22

## Perimetre

Ce lot contient exactement huit icones d'objets originales fan-made :

- H2G2 : 4 icones ;
- The Thing (1982) : 4 icones.

Une generation OpenAI ImageGen distincte a ete executee pour chaque objet. Aucun
manifest, fichier de code, registre d'assets, stage, profil musical ou fichier de
configuration n'a ete modifie par ce lot.

## Fichiers produits

### H2G2

- `public/sprites/generated/items/h2g2/towel.png`
- `public/sprites/generated/items/h2g2/electronic-guide.png`
- `public/sprites/generated/items/h2g2/babel-fish-bowl.png`
- `public/sprites/generated/items/h2g2/point-of-view-gun.png`

### The Thing (1982)

- `public/sprites/generated/items/the-thing/blood-test-petri-dish.png`
- `public/sprites/generated/items/the-thing/heated-copper-wire.png`
- `public/sprites/generated/items/the-thing/flamethrower.png`
- `public/sprites/generated/items/the-thing/whisky-bottle.png`

## Methode

1. Verification des references lore et visuelles avant generation.
2. Un appel OpenAI ImageGen par icone, sans planche multi-objets.
3. Generation en pixel art detaille sur fond chroma parfaitement plat :
   `#FF00FF` pour H2G2 et `#00FF00` pour The Thing.
4. Suppression locale du chroma avec
   `remove_chroma_key.py --auto-key border --soft-matte --despill`.
5. Redimensionnement final en `512 x 512`, mode `RGBA`.
6. Normalisation de chaque pixel totalement transparent vers `(0, 0, 0, 0)`.
7. Verification automatique des dimensions, du canal alpha, des quatre coins,
   des marges, du RGB cache et des residus de chroma.
8. Inspection visuelle des huit icones sur un damier neutre.

Le premier controle a detecte une marge horizontale trop faible sur
`flamethrower.png` (6 et 8 px). L'objet etait complet et reconnaissable : il a ete
recentre et reduit sans nouvelle generation. Ses marges finales sont de 26 px a
gauche et a droite.

## References

### H2G2

- [Douglas Adams - The Hitchhiker's Guide to the Galaxy](https://www.douglasadams.com/creations/hhgg.html)
  confirme notamment la serviette comme element essentiel de la serie.
- [D23 - The Hitchhiker's Guide to the Galaxy](https://d23.com/a-to-z/hitchhikers-guide-to-the-galaxy/)
  decrit la serviette et le Guide comme livre electronique central au film de
  2005.
- [The Prop Gallery - Babel Fish](https://www.thepropgallery.com/the-hitchhikers-guide-to-the-galaxy-babel-fish)
  documente le petit poisson jaune, sa queue prononcee, sa bouche et ses
  branchies.
- [Heritage Auctions - Point-of-View weapon replica](https://entertainment.ha.com/itm/movie-tv-memorabilia/memorabilia/limited-edition-replica-pov-sci-fi-weapon-from-hitchhiker-s-guide-to-the-galaxy-touchstone-/a/7269-89768.s)
  sert de reference pour la silhouette metallique courbe de l'arme du film.

Choix de fidelite :

- la serviette est un objet textile bleu-gris distinct, sans personnage ;
- le Guide est un terminal noir epais a ecran vert abstrait, sans texte ;
- le poisson Babel conserve une silhouette jaune etrangere dans un bocal cyan ;
- l'arme Point-of-View reprend une construction courbe en laiton, cuivre et
  acier, sans reproduire un prop officiel pixel par pixel.

### The Thing (1982)

- [SYFY - John Carpenter et la scene du test sanguin](https://www.syfy.com/syfy-wire/john-carpenter-reveals-pivotal-scene-that-convinced-him-to-direct-the-thing)
  confirme la boite de Petri, le sang, le fil surchauffe et l'usage du
  lance-flammes par MacReady.
- [Universal Pictures At Home - The Thing (1982)](https://www.universalpicturesathome.com/movies/the-thing-1982)
  constitue la reference studio pour l'incarnation de 1982 et sa direction
  visuelle.

Choix de fidelite :

- la boite de Petri contient uniquement un echantillon de sang rouge sombre ;
- le testeur est un fil de cuivre chauffe relie a une poignee isolee ;
- le lance-flammes est un equipement analogique use, avec reservoir, tuyau et
  lance connectes, sans technologie futuriste ;
- la bouteille est carree, remplie de whisky ambre et porte une etiquette creme
  vierge afin de ne pas reproduire une marque reelle.

## Prompts finaux

Le socle commun applique a chaque appel etait :

```text
Create exactly one complete, centered inventory item in polished detailed
32-bit pixel art. Original fan-made artwork informed by reliable lore and prop
references, never a copied official frame or asset. Keep the complete silhouette
readable at HUD size with generous padding. Use one perfectly flat chroma-key
background with no floor, shadow, reflection, gradient or texture. No person,
hand, character, readable text, letters, numbers, logo, UI, border or watermark.
```

Specifications propres a chaque objet :

| Fichier | Specification ajoutee au prompt |
| --- | --- |
| `towel.png` | Serviette de voyage pliee, coton bleu-gris, lisiere beige discrete. |
| `electronic-guide.png` | Terminal portatif noir epais, ecran vert a blocs abstraits et commandes acier. |
| `babel-fish-bowl.png` | Bocal cyan spherique contenant un seul petit poisson Babel jaune a queue prononcee. |
| `point-of-view-gun.png` | Arme retrofuturiste courbe en laiton, cuivre et acier, emetteur evase et poignee bouclee. |
| `blood-test-petri-dish.png` | Boite de Petri en verre bleu glace contenant un seul echantillon rouge sombre. |
| `heated-copper-wire.png` | Poignee isolee, boucle de cuivre et extremite orange-blanc chauffee. |
| `flamethrower.png` | Reservoir acier, tuyau noir, commande simple et longue lance analogique connectee. |
| `whisky-bottle.png` | Bouteille carree des annees 1980, verre clair, whisky ambre et etiquette creme vierge. |

## Validation technique

Toutes les validations passent :

| Fichier | Dimensions | Mode | Marges G/H/D/B | RGB sous alpha 0 | Chroma visible |
| --- | --- | --- | --- | ---: | ---: |
| `babel-fish-bowl.png` | 512x512 | RGBA | 48/46/53/44 | 0 | 0 |
| `electronic-guide.png` | 512x512 | RGBA | 82/46/63/57 | 0 | 0 |
| `point-of-view-gun.png` | 512x512 | RGBA | 59/30/50/41 | 0 | 0 |
| `towel.png` | 512x512 | RGBA | 26/53/23/88 | 0 | 0 |
| `blood-test-petri-dish.png` | 512x512 | RGBA | 50/68/50/83 | 0 | 0 |
| `flamethrower.png` | 512x512 | RGBA | 26/63/26/64 | 0 | 0 |
| `heated-copper-wire.png` | 512x512 | RGBA | 34/77/32/86 | 0 | 0 |
| `whisky-bottle.png` | 512x512 | RGBA | 129/35/130/36 | 0 | 0 |

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

Les huit silhouettes sont distinctes et reconnaissables a l'echelle d'un pickup
ou d'un HUD. Aucun objet n'est coupe, duplique ou accompagne d'un accessoire
parasite. Les bords alpha sont propres sur damier clair et sombre. Aucune
regeneration corrective n'a ete necessaire ; seul le cadrage du lance-flammes a
ete normalise apres le premier controle de marge.
