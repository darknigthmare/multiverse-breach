# Identité des véhicules de kart

Révision du 9 novembre 2026.

## Règle de conception

Le véhicule doit évoquer son univers par sa silhouette, ses matériaux, sa
palette et ses accessoires visibles à la taille du jeu. Le choix suit cet ordre :

1. Adapter un véhicule emblématique compatible avec le personnage et son
   incarnation : Narcissus pour Ripley de 1979, Warthog pour le Major,
   Banshee pour l’Arbiter, X-wing pour Luke et TIE Advanced pour Vador.
2. Distinguer les factions, périodes et véhicules personnels. Un humain de
   Predator n’hérite pas d’une navette Yautja ; un personnage du premier
   Pirates des Caraïbes n’hérite pas de son statut dans les suites.
3. Quand il n’existe pas de véhicule approprié, construire un kart original
   avec des éléments identifiables de l’univers et du personnage. Le catalogue
   distingue ces inventions des adaptations de véhicules canoniques.

Les proportions sont adaptées à une course à un seul pilote et le cockpit
reste ouvert pour le sprite. Une silhouette ou un accessoire ne devient pas
une reproduction 1:1 simplement parce que son nom est renseigné.

## Ce qui remplace les anciens prototypes

Les 525 univers ont maintenant une fiche explicite. Le rôle de combat et le
hash du personnage ne choisissent plus une carrosserie générique et ne
déforment plus les proportions du véhicule. Les exceptions par personnage
prennent la priorité sur leur famille d’univers. Les comptes exacts de cette
révision sont calculés dans [le rapport de revue](kart-identity-review.json).

Les différences sont des volumes : carénages, ailes, capots, cages, coques,
roues, réacteurs, accessoires et variantes. Les modèles ne se distinguent pas
uniquement par un nom ou une couleur. Des membres d’une même faction peuvent
partager un véhicule ; ce partage est décrit comme tel dans le catalogue.
Les réemplois de famille entre Ghostbusters/Extreme Ghostbusters et
Evil Dead/Ash vs Evil Dead correspondent volontairement au même véhicule.

### Exemples de silhouettes et d’accessoires

| Pilote | Véhicule ou création | Repères réellement modélisés |
| --- | --- | --- |
| Ripley, Alien (1979) | Narcissus | Coque claire chanfreinée, fenêtres sombres, deux gros propulseurs arrière arrondis et panneaux techniques. |
| Master Chief | Warthog | Capot blindé incliné, grandes roues découvertes, cage ouverte et benne. |
| Arbiter | Banshee | Ailes courbes larges, lobes violets arrondis, plasma et petits rouleaux rentrés sous la coque. |
| Luke | X-wing | Nez fin, quatre plans séparés et quatre moteurs ; aucun deuxième jeu d’ailes ajouté. |
| Vador | TIE Advanced | Cockpit arrondi, panneaux repliés et partie arrière élargie. |
| Han Solo | Faucon Millenium | Coque en disque, deux mandibules, cockpit latéral, antenne et bande moteur arrière. |
| Shepard | Mako | Coque de rover blanche et rouge, six roues animées et module latéral. |
| Tails | Tornado | Biplan rouge et blanc, hélice et équipement de mécanicien ; le nom Whirlwind n’est plus associé au biplan. |
| Chell | Création Aperture | Coque blanche, portails orange/bleu et appareillage de laboratoire. |
| Mirelle | Disque de Suture conservé | Disque noir/or, garde-corps et cartes holographiques cyan de sa référence existante. |

Les véhicules propres aux personnages Happy Wheels, les optiques des robots,
les masques, la tronçonneuse, le disque de duel, le planeur Jaffa et les formes
animales disposent également de géométries ou variantes explicites.

## Source unique pour les trois sorties

`getKartVehicleIdentity(hero)` résout la fiche d’univers, l’exception du
personnage, les références et les proportions. `buildKartIdentityGeometry`
produit des parties possédant de véritables plages de sommets. Cette même
géométrie alimente :

- le renderer WebGL du jeu ;
- le modèle GLB autonome, avec les références dans ses métadonnées ;
- les huit directions de l’atlas PNG 2D.

La peinture de collection change les couleurs de carrosserie. Elle conserve
les formes, les accessoires, les couleurs réservées aux détails et le sprite
du personnage. Le sprite conducteur reste séparé du kart et conserve sa
source d’identité ; aucune nouvelle pose assise n’est revendiquée.

Un univers futur sans fiche retourne explicitement une identité manquante.
La construction du roster échoue avec le personnage concerné, au lieu de
réintroduire silencieusement un prototype de rôle.

## Revue et limites

La [comparaison avant/après](kart-identities-before-after.png) utilise le même
angle et une taille de 128 px pour les deux versions. La [galerie de 24
exemples](kart-identities-gallery.png) montre deux angles des modèles réels.
Ce sont des projections de géométrie, pas des illustrations conceptuelles.

La revue des fiches internes a également vérifié les incarnations/ancrages
disponibles. Elle a corrigé notamment Ripley, Will et Elizabeth de 2003,
Hermione en cinquième année, le Biker de Hotline Miami et les factions S’pht,
Felineko et Yautja. Les [notes A](identity-catalog-a-notes.md) et [B](identity-catalog-b-notes.md)
précisent les sources consultées et le périmètre de ces vérifications.

Les tests contrôlent la couverture, les volumes, les normales, les plages de
parties, les cadres alpha et les références d’incarnation. Les captures
natives contrôlent l’intégration et la visibilité du pilote. Ces preuves ne
valident pas à elles seules tous les détails artistiques des 1 912 karts :
les matériaux fins, proportions exactes et poses dédiées restent ouverts dans
le classeur. La physique de conduite et les circuits ne changent pas dans
cette révision de véhicules.

## Reproduire les sorties

```bash
npm run test:kart
node scripts/kart/buildKartAssets.mjs --all
node scripts/kart/buildKartAssets.mjs --check
node scripts/kart/buildKartIdentityReview.mjs
node scripts/buildDlcAssetManifests.mjs --write
```

La comparaison avant/après lit les atlas de la révision
`e2a48558aa8e174b21e331b65298bdf0e3c23415` ; cet objet Git doit être disponible
dans le clone utilisé pour reconstruire les planches.
