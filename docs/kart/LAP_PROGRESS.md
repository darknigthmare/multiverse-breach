# Progression des tours et transitions de circuit

La simulation reste celle d’`EngineRace` ; les vues 3D et 2D partagent les mêmes
positions, portes, tours et résultats. Le rendu ne valide jamais un tour.

## Continuité de route

Le premier ancrage choisit le segment le plus proche. Ensuite, la projection
d’un kart reste sur son segment ou sur ses deux voisins connectés. Une branche
du huit qui passe au même endroit n’est donc pas une destination possible par
simple proximité. Les lectures répétées du rendu et de la télémétrie réutilisent
l’ancrage tant que la position ne change pas.

Un miroir, une récupération et un portail appellent `reanchorKartRoute` pour
établir explicitement le segment et la nouvelle référence de progression. Le
miroir conserve les portes déjà gagnées par chaque pilote, sans transférer les
reçus de l’adversaire ni valider les portes sautées. Un miroir qui saute une
porte encore requise peut donc obliger à effectuer un nouveau passage complet.
La récupération suit la branche actuelle, même si une autre branche est plus
proche dans l’espace.

## Portes et portails

Les portes virtuelles sont réparties en ordre sur la longueur de la ligne
centrale. Un départ depuis la dernière portion du circuit ne donne aucun tour
gratuit : il faut d’abord gagner toutes les portes intermédiaires dans l’ordre.
Une marche arrière sur la ligne désarme les reçus du passage précédent.

- Un portail vers une progression supérieure peut créditer les portes sautées
  si le pilote entre dans le sens de la route. La transition est consommée une
  seule fois par `updateCheckpoints`.
- Un portail vers une progression inférieure réancre le pilote sans crédit de
  porte ni de tour. Chaque pilote peut l’utiliser une seule fois par tour ; il
  devient ensuite traversable jusqu’à la vraie ligne de départ. Cela permet de
  sortir de la boucle du portail rétrograde du huit.
- Un futur portail explicitement conçu pour franchir la ligne vers l’avant
  doit déclarer `crossesStart: true` sur sa zone. Il peut alors valider au plus
  un passage de ligne, uniquement après les portes antérieures déjà acquises.
  Aucun portail rétrograde historique ne reçoit automatiquement ce statut.
- Un portail ne s’active pas depuis l’autre branche d’un croisement : l’entrée
  doit correspondre à la progression de son propre segment de route.

Le mode accélération automatique conserve l’assistance de direction lorsqu’un
kart roule encore à faible vitesse hors piste. Il évite ainsi l’état où la
pénalité hors route maintenait la vitesse sous le seuil d’assistance, mais
au-dessus du seuil de récupération. Les commandes manuelles, vitesses et
adhérences sont inchangées.

## Vérification de simulation du 8 novembre 2026

Exécution Node avec images remplacées par un stub de chargement, pas de rendu
natif. Chaque course utilise `update(1 / 60)`, `autoAccel: true`, les trois
adversaires, objets et dangers habituels, sans action manuelle sur l’état.
Les durées sont le temps simulé après le compte à rebours, pour le pilote par
défaut sans améliorations de garage.

| Circuit historique | Tours terminés par le joueur | Temps simulé |
| --- | ---: | ---: |
| `nexus_archive_loop` | 3 | 28,78 s |
| `nexus_suture_eight` | 3 | 60,08 s |
| `anchor_market_dash` | 4 | 38,07 s |
| `fragment_frostway` | 3 | 28,98 s |
| `portal_hairpin_ritual` | 3 | 75,33 s |
| `overload_bossway` | 2 | 38,65 s |

Le huit valide ses tours à 21,80, 42,53 et 60,08 secondes. Le kart roule environ
8 610 unités, hors sauts de téléportation, pour une ligne centrale de 2 243 unités
par tour : le correctif ne transforme pas la petite boucle entrée/sortie en
machine à tours. Aucun saut entre branches non connectées n’a été observé dans
cette simulation. Les bandes larges aux épingles permettent encore les coupes
sur les deux segments adjacents de leur chaussée commune ; cette simulation
ne représente pas des barrières de piste ou des ponts en 3D.

`scripts/kart/kartLapProgress.test.mjs` vérifie les six arrivées réelles du joueur,
la continuité des deux branches du huit, miroir/récupération près de la ligne,
marche arrière puis avant, crédits de portail, refus de répétition rétrograde,
topologie explicite et séparation de l’assistance automatique/manuelle.
Il est inclus dans `npm run test:kart`.

Les captures de rendu WebGL et la validation visuelle des univers restent des
contrôles séparés. Ces simulations ne prouvent ni les performances GPU, ni la
fidélité 1:1 des décors.
