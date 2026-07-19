# Pack ennemis / boss Alien (1979) - 2026-07-19

## Scope

Lot limite a quatre plaquettes canoniques du premier film `Alien` de 1979 :

| ID du manifeste inspecte | Representation canonique retenue | Sortie |
| --- | --- | --- |
| `alien-skittering-facehugger` | Facehugger de Kane | `public/sprites/generated/bosses/alien-1979/skittering-facehugger.png` |
| `alien-chestburster-larva` | Chestburster de Kane | `public/sprites/generated/bosses/alien-1979/chestburster-larva.png` |
| `alien-egg-chamber-sac` | Ovomorph / hero egg du Derelict | `public/sprites/generated/bosses/alien-1979/egg-chamber-sac.png` |
| `alien-synthetic-ash-protocol` | Ash revele comme synthetique | `public/sprites/generated/bosses/alien-1979/synthetic-ash-protocol.png` |

Le manifeste placait encore ces IDs sous le dossier historique
`/sprites/generated/bosses/alien/`, mais aucun de leurs PNG n'existait. Les
sorties de ce lot ont ete placees dans `alien-1979`, conformement au scope
demande, sans modifier le manifeste.

`alien-big-chap-stalker` n'a pas ete regenere : la representation canonique du
world boss existe deja sous
`public/sprites/generated/bosses/alien-1979/kane-s-son-big-chap.png`.
Ce fichier est reste strictement inchange :

`5D7C1306D97B2B71FBD903C5ADC23BD6955644CC2BCAF3E5B93169C569693822`

## References ouvertes avant generation

### Continuite commune

- [20th Century Studios - Alien (1979)](https://www.20thcenturystudios.com/movies/alien)
- [AvP Galaxy - galerie de production Alien (1979)](https://www.avpgalaxy.net/alien-movies/alien/gallery/production-stills/)

La page officielle 20th Century confirme le film, le Nostromo, les organismes
ovoides et le casting incluant Ian Holm. Sa galerie officielle contient aussi
les plans du Facehugger sur Kane.

### Facehugger

- [Propstore - Alien Lifeforms, entretien avec Roger Dicken](https://propstore.com/blog/alienlifeforms/)
- [Propstore / Invaluable - Special Effects Facehugger 1979](https://www.invaluable.com/auction-lot/alien-1979-special-effects-facehugger-11-c-0ef4509b53)

Verrous visuels :

- petit corps central aplati ;
- huit longs doigts osseux de type humain ;
- peau latex chair pale, veines, rides et ligaments ;
- sacs inferieurs et longue queue souple ;
- aucune carapace royale, epine, armure ou morphologie adulte.

### Chestburster

- [Propstore - Alien Lifeforms, entretien avec Roger Dicken](https://propstore.com/blog/alienlifeforms/)
- [The Guardian - fabrication de la scene du Chestburster](https://www.theguardian.com/film/2009/oct/13/making-of-alien-chestburster)
- [AvP Galaxy - production stills 145 et 146](https://www.avpgalaxy.net/alien-movies/alien/gallery/production-stills/)

Verrous visuels :

- forme larvaire serpentine courte ;
- tete lisse et globuleuse, petits yeux absents et dents metalliques ;
- peau chair pale et rouge humide ;
- petites excroissances laterales non developpees ;
- aucun bras ou jambe articule de la version `Aliens` de 1986.

### Ovomorph

- [Science Museum Group - modele d'oeuf utilise dans Alien](https://collection.sciencemuseumgroup.org.uk/objects/co8407739/model-of-egg-used-in-the-film-alien)
- [Science and Industry Museum - conservation de l'oeuf original](https://blog.scienceandindustrymuseum.org.uk/faqs-about-our-alien-egg/)
- [Christie's - prop Alien egg 1979](https://www.christies.com/en/lot/lot-3839517)

Verrous visuels :

- silhouette ovoide haute, plus large a la base ;
- peau organique gris-brun, humide, poreuse et veinee ;
- quatre petales charnus formant une croix au sommet ;
- animation d'ouverture du hero egg ;
- aucune Reine, resine de ruche de 1986 ou creature separee dans la case.

Le nom de donnees `Egg Chamber Sac` est donc interprete visuellement comme
l'Ovomorph canonique, et non comme un sac de ruche invente.

### Ash

- [20th Century Studios - Alien (1979)](https://www.20thcenturystudios.com/movies/alien)
- [AvP Galaxy - production stills d'Ash et de l'attaque](https://www.avpgalaxy.net/alien-movies/alien/gallery/production-stills/)
- [Alien Explorations - references Blu-ray de la revelation d'Ash](https://alienexplorations.blogspot.com/1979/10/unravelling-of-ash.html)

Verrous visuels :

- apparence d'Ian Holm en 1979, silhouette mince et ligne de cheveux reculee ;
- combinaison utilitaire bleu-gris pale du science officer du Nostromo ;
- attaque par saisie, poussee et magazine roule ;
- fluide blanc, fibres et cables organiques lors de la revelation ;
- aucun Rook, Bishop, David, soldat de recuperation ou sang humain rouge.

## Exclusions de continuite

Les elements suivants ont ete volontairement exclus :

- Colonial Marines, pulse rifles et equipements de `Aliens` ;
- Warrior a crane nervure, Alien Queen et Facehugger Nest ;
- Runner de `Alien 3` ;
- Praetorian de jeux/comics ;
- Predalien et toute variante `Alien vs Predator` ;
- creatures de `Covenant`, `Romulus` ou `Alien Resurrection`.

## Specification commune ImageGen

Les quatre sources ont ete generees separement avec l'outil OpenAI ImageGen
integre. Les images de production ont servi de references de sujet. La planche
existante de Kane's Son / Big Chap a servi uniquement de reference de rendu
pixel-art, d'angle RPG et de qualite de grille.

Contraintes communes des prompts :

- une seule entite coherente par plaquette ;
- grille conceptuelle exacte `4 x 4`, sans trait visible ;
- `16` poses, une par cellule ;
- angle RPG trois-quarts side-view oriente vers la droite ;
- corps ou creature complet, accessoires et effets inclus ;
- lignes `idle`, `mouvement`, `attaque/interact`, `hit/defeat` ;
- fond uni `#FF00FF` sans sol, ombre, decor, texte, logo ou UI ;
- fan-art original, sans copie ou reutilisation d'un sprite officiel.

## Pipeline de transparence et de normalisation

1. ImageGen a produit quatre sources RGB `1254 x 1254` sur chroma magenta.
2. Le helper officiel
   `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
   a ete execute avec auto-key border, soft matte, despill et edge-contract.
3. Ash a necessite une seconde extraction plus serree avec la cle
   `#EC08DC`, car le fond source comportait une faible variation de magenta.
4. Les composantes connexes des seize poses ont ete identifiees avant la
   decoupe. Cela a permis de recuperer les queues, doigts, effets et positions
   qui depassaient legerement la grille conceptuelle de la source.
5. Chaque pose a ete redimensionnee avec une echelle commune a sa plaquette,
   recentree dans une cellule `256 x 256` et contrainte a une marge de `12 px`.
6. Les residus de chroma ont ete supprimes et les pixels totalement
   transparents ont ete remis a RGB `0,0,0`.

## Layout des animations

### Facehugger

- ligne 1 : repos, flexion des doigts et tension de la queue ;
- ligne 2 : cycle de course basse ;
- ligne 3 : preparation, saut, pose de saisie et reception ;
- ligne 4 : recul, roulade, affaiblissement et defeat.

### Chestburster

- ligne 1 : redressement et oscillation ;
- ligne 2 : progression serpentine sans membres ;
- ligne 3 : recul, bond, morsure et cri ;
- ligne 4 : hit leger, hit lourd, repli et defeat.

### Ovomorph

- ligne 1 : dormance et pulsation legere ;
- ligne 2 : activation et separation de la couture ;
- ligne 3 : ouverture progressive des quatre petales puis fermeture ;
- ligne 4 : impact, deformation, affaissement et coque inerte.

### Ash

- ligne 1 : idle clinique ;
- ligne 2 : marche precise ;
- ligne 3 : saisie, poussee et magazine roule ;
- ligne 4 : reaction, revelation synthetique et defeat.

## Validation automatisee finale

| Fichier | Dimensions | Mode | Cellules | Marge min. | Separateurs | Chroma visible | Alpha partiel | Difference adjacente min./moy. |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `skittering-facehugger.png` | 1024 x 1024 | RGBA | 16 / 16 | 12 px | 0 px | 0 px | 53 853 px | 10,93 / 20,06 |
| `chestburster-larva.png` | 1024 x 1024 | RGBA | 16 / 16 | 12 px | 0 px | 0 px | 34 194 px | 8,82 / 19,94 |
| `egg-chamber-sac.png` | 1024 x 1024 | RGBA | 16 / 16 | 12 px | 0 px | 0 px | 16 557 px | 20,77 / 28,81 |
| `synthetic-ash-protocol.png` | 1024 x 1024 | RGBA | 16 / 16 | 12 px | 0 px | 0 px | 49 696 px | 5,63 / 29,51 |

Controles communs :

- plage alpha `0..255` ;
- quatre coins transparents ;
- aucune pose vide ;
- aucun pixel visible sur les doubles lignes separant les cellules ;
- aucun residu magenta visible ;
- aucun texte, logo, watermark, grille ou decor ;
- aucune pose ne deborde dans la cellule voisine.

SHA-256 :

- `skittering-facehugger.png` :
  `D308FDA440C5B1F9E5AAA7F2251345D8DC0E7F1324CD4F06ABD97BB9BB878756`
- `chestburster-larva.png` :
  `8D990DD806E32E5DC82EBD4C9FC21AC8E7B1216D488B2F9EE74ABA0243C896EB`
- `egg-chamber-sac.png` :
  `8D33D6198736EEC02BD6A099A81014EA33F7BD59C2088FF3426A09039B6E39C4`
- `synthetic-ash-protocol.png` :
  `A306CE4F242D4751211A8FD721FF8CF69DD488C89C333B8C473042202931447D`

## Inspection visuelle finale

- Facehugger : huit doigts lisibles, corps central aplati, queue complete et
  cycle de course/saut coherent sans victime ajoutee.
- Chestburster : anatomie larvaire sans bras de 1986, deplacement serpentin et
  attaque de proximite sans projectile invente.
- Ovomorph : meme coque et quatre petales dans les seize poses, ouverture
  progressive sans Reine ou Facehugger separe.
- Ash : meme uniforme, meme visage et meme morphologie dans chaque frame,
  magazine roule identifiable et effets synthetiques blancs.

## Fichiers non modifies

Ce lot n'a modifie aucun fichier de code, manifeste, registre de prompts global,
package, configuration ou asset hors de :

- `public/sprites/generated/bosses/alien-1979/`
- `docs/audits/generated-enemy-pack-alien-1979-2026-07-19.md`

Aucun commit n'a ete cree.
