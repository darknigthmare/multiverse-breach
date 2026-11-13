# Révision des identités de kart — catalogue A

Révision du 9 novembre 2026. Ce catalogue couvre les 263 univers de **28 Days Later**
à **Marble Hornets**, dans l’ordre anglais du catalogue courant, et comporte
155 exceptions de personnage. Les 418 fiches sont écrites explicitement dans
`src/game/kart/kartIdentityCatalogA.js`.

## Règle de conception

La silhouette vient d’un véhicule identifiable lorsque la continuité le permet.
Les autres fiches proposent un véhicule de course original, associé aux matériaux,
objets et formes de son univers. Les identités ne sont plus choisies à partir du
rôle de combat, de la place dans le tableau ou d’un hash.

Le catalogue contient 75 familles inspirées d’un véhicule nommé, 178 inventions
pour un univers existant et 10 créations pour des univers originaux du projet.
Une référence canonique désigne l’inspiration : elle ne certifie pas que le modèle
de course reproduit exactement les proportions ou tous les détails de l’objet.
Tous les champs `visualReviewStatus` restent `pending-game-scale-review` jusqu’à
une revue visuelle séparée. Les formes adaptées conservent un cockpit ouvert pour
le sprite du personnage.

## Corrections de continuité

| Personnage ou famille | Choix appliqué |
| --- | --- |
| Ripley, `ripley` | Narcissus blanc et gris d’**Alien (1979)**, avec deux moteurs arrière. Aucun chargeur P-5000, fusil des Marines ou M577 hérité d’Aliens. |
| Ripley d’Aliens, `ripley_aliens` | Cheyenne d’évacuation de LV-426 ; fiche distincte de celle de Ripley 1979. |
| Hicks et Marines d’Aliens | M577, en reprenant la silhouette basse du transport blindé. |
| Bishop | Cheyenne et équipement de navigation. |
| Amanda Ripley | Adaptation du Torrens et équipement de maintenance d’Alien: Isolation. |
| Master Chief et personnages UNSC | Warthog, avec accessoires de reconnaissance ou de liaison précisés par personnage. |
| Arbiter | Banshee violet sangheili ; il ne reçoit pas le véhicule UNSC par défaut. |
| Humains d’Alien vs Predator | Transport d’expédition polaire ; les chasseurs yautjas gardent leurs formes et capteurs extraterrestres. |
| Humains d’AVP: Requiem | Jeeps de secours ; aucun équipement yautja hérité du profil de Wolf. |
| Freeman | Scout Car de Half-Life 2 avec pied-de-biche et lambda ; continuité HL2 conservée. |
| Shephard | Jeep HECU sans lambda de la Résistance. |
| Kassandra / Desmond | Adrestia antique / transport moderne de l’Animus, séparés du profil Renaissance. |
| Cloud / Aerith / Barret | Hardy-Daytona / charrette de fleurs / train de Corel. |
| Personnages de Final Fantasy XIII | Gestalts respectifs, avec fiches de Snow, Lightning, Fang, Sazh, Hope et Vanille. |
| Max / Furiosa / Nux | Interceptor / War Rig avec citernes / Nux Car. |
| Harry et Ron / Hermione / Sirius / Rogue | Anglia / bibliothèque de cinquième année avec notes de sortilèges / moto avec sidecar / chaudron de potions. |
| Joker / Batman New 52 | Bolide violet à cartes / Batmobile. |
| Lilo / Nani / Stitch | Kart de plage rouge à caméra et fleurs / plateforme bleue de plage / croiseur extraterrestre. Les personnages humains n’héritent plus automatiquement du croiseur de Stitch. |
| Biker de Hotline Miami | Moto cyan, distincte de la DeLorean de Jacket. |
| Défenseur S’pht’Kr de Marathon | Plateforme extraterrestre à lentille et anneau de résonance, sans identité UESC. |
| Les trois pilotes Happy Wheels | Fauteuil motorisé / transporteur individuel à deux roues / bicyclette avec petit siège enfant arrière. |
| Tralalero / Lirilì / Cappuccina | Requin bleu avec baskets / éléphant avec cactus et chaussons beige / coque de tasse ivoire à anses. |
| Tall Goat / Tony Shark / Pilgor | Girafe à long cou et taches / requin-marteau sur plateforme / coque de chèvre. |

Une relecture finale a comparé les 257 fiches du lot qui possèdent une incarnation
ou un ancrage visuel. Elle a notamment retiré le Retourneur de Temps du kart
d’Hermione : la version retenue est celle de cinquième année, et son ancrage exclut
explicitement le pendentif permanent de troisième année. Les deux identifiants
d’Hermione partagent désormais ce verrou. Les corrections de véhicule personnel,
d’espèce et de faction ci-dessus sont des exceptions explicites, pas de nouveaux
tirages automatiques à partir d’une catégorie.

Deux familles partagent volontairement la même structure entre des continuités
proches : la Delta 88 pour **Evil Dead** et **Ash vs Evil Dead**, et l’Ecto-1 pour
**Ghostbusters** et **Extreme Ghostbusters**. Les autres lignes univers A ont une
combinaison de modèle, variante et accessoires distincte.

Les variantes structurelles `mech/tachikoma` et `motorbike/gantz-cycle` évitent de
réduire un véhicule emblématique à une couleur sur un châssis générique. Les
accessoires `mask`, `chainsaw` et `optic` servent respectivement aux masques,
tronçonneuses et lentilles mécaniques réellement construits par le modeleur.
Les variantes `motorbike/wheelchair`, `motorbike/segway`, `motorbike/bicycle` et
`beast/shark`, `beast/elephant`, `beast/giraffe`, `beast/hammerhead` conservent les
structures distinctives relevées par l’audit. Les motifs `cactus`, `sneakers` et
`slippers` ajoutent de vraies formes au modèle : baskets bleues à lacets pour
Tralalero, chaussons beige ouverts à l’arrière pour Lirilì, sans marque.
Le siège enfant de la bicyclette est une pièce du véhicule, sans personnage 3D
supplémentaire inventé.

## Provenance consultée

Les URL ci-dessous ont servi à vérifier des noms, silhouettes ou associations de
personnages. Elles restent des références de conception ; aucune image ou maille
issue de ces pages n’est incorporée au jeu. Les autres fiches conservent leurs
ancrages de personnage/univers existants via le résolveur. Elles n’ont pas toutes
fait l’objet d’une vérification documentaire indépendante de leur véhicule.

| Référence | Source |
| --- | --- |
| Narcissus, modèle original de production | [Science Fiction Archives](https://www.sciencefictionarchives.com/en/collections/60/narcissus-shuttlecraft-model) |
| Warthog, Banshee, Ghost et factions | [Inventaire officiel Halo](https://support.halowaypoint.com/hc/en-us/articles/6882880281364-Halo-Infinite-Weapon-Equipment-and-Vehicle-Inventory) |
| DeLorean et association à Marty/Doc | [Back to the Future, site officiel](https://www.backtothefuture.com/movies/backtothefuture1/) |
| Ecto-1 | [Boutique officielle Ghostbusters](https://shop.ghostbusters.com/collections/ecto-1) |
| Regalia | [Square Enix — Final Fantasy XV](https://eu.store.square-enix-games.com/final-fantasy-xv) |
| Hardy-Daytona, carrosserie noire et pneus massifs | [Square Enix — Cloud et Hardy-Daytona](https://eu.store.square-enix-games.com/final-fantasy-vii-bring-arts-action-figure---cloud-strife-_-hardy-daytona) |
| Swordfish II de Spike | [Good Smile Company, modèle sous supervision du designer mécanique](https://www.goodsmile.com/en/product/6253/1%2B48%2BScale%2BSwordfish%2BII) |
| Porsche de Johnny Silverhand | [Annonce CD Projekt RED](https://www.cdprojekt.com/en/media/news/porsche-rides-into-the-dark-future-of-cyberpunk-2077/) |
| Dodge Charger de la série Defiance et Challenger du jeu | [Communiqué Dodge publié par PR Newswire](https://www.prnewswire.com/news-releases/dodge-brand-partners-with-syfy-and-trion-worlds-for-defiance-first-ever-convergence-of-television-programming-and-online-gaming-203050851.html) |
| Tachikoma | [Good Smile Company, modèle licencié](https://www.goodsmile.com/en/product/113/GOODSMILE%2BAlloy%2BTachikoma) |
| Monocycle de Gantz | [Good Smile Company, Gantz Bike](https://www.goodsmile.info/en/product/3160/) |
| Freeman, continuité HL2 | [Valve — Half-Life 2](https://www.half-life.com/en/halflife2) |

Les dix univers originaux de ce lot utilisent le lore et les palettes de
`src/game/originalUniversesManifest.json`, notamment les fils du destin d’Aegea,
le Moteur chronal d’Aevum, les fusées publicitaires d’Helios 56, les machines
diesel d’Iron Tempest, la Barque solaire de Kemet et les pétitions célestes du
Mandat des Neuf Cieux.

## Contrôles de ce lot

- Syntaxe JavaScript et lint ciblé réussis.
- 263 clés d’univers exactes, aucune omission ou clé supplémentaire.
- 155 identifiants de personnage existants et appartenant à ces univers.
- 418 fiches avec modèle connu, deux à cinq accessoires connus et sans doublon,
  trois indices de reconnaissance, couleurs hexadécimales valides, URL HTTPS et
  tableaux de métadonnées gelés.
- Deux combinaisons univers identiques seulement, les réemplois de franchise
  documentés ci-dessus.

Ces contrôles portent sur la cohérence des fiches et leur compatibilité avec le
modeleur. Ils ne constituent pas une revue artistique de 418 modèles rendus ni
une validation de fidélité 1:1. Les exports 3D/2D, contrôles de géométrie et
captures en jeu sont suivis par la recette commune du kart.
