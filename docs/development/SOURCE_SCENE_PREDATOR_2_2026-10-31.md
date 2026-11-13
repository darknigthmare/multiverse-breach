# Mission 50105 — Predator 2 (1990), vaisseau du clan perdu

## Version jouable livrée

Une cinquième mission de type **Tactics source-locked** s'ajoute aux 39
missions statiques historiques et aux quatre scènes précédentes.
**ID stable 50105** ; seul `harrigan_predator` peut y entrer. Les autres héros
restent dans la collection, sans pouvoir remplacer Harrigan dans ce scénario.
Les règles de mission refusent le mode custom, l'édition erronée, les bonus
crossover et la victoire obtenue simplement en épuisant les PV d'un adversaire.

La mission se déroule **uniquement dans le vaisseau souterrain sous Los Angeles**.
Le combat du toit, le bras sectionné avec le Smart Disc et l'autodestruction
**désamorcée** du City Hunter sont déjà passés. Ils n'ont pas été transformés
en un nouveau minuteur au milieu du vaisseau.

Séquence : franchir le sas, observer la chambre des trophées, subir l'embuscade
au filet, couper ce filet avec le disque conservé depuis le toit, vaincre
le City Hunter avec son disque, laisser le clan venir récupérer le corps,
recevoir de l'Ancien un pistolet à silex portant le nom **Raphael Adolini 1715**,
repérer le démarrage du vaisseau et sortir de la caverne avant le souffle
de décollage.

**Contrat du gameplay (adaptations explicites) :**
- Carte abstraite 9×7 ; 9 commandes de source avec prérequis et positions ;
  aucun téléport, récompense automatique ni utilisation des objets crossover.
- L'embuscade au filet immobilise réellement Harrigan, jusqu'à l'action
  `cut_net` autorisée à sa propre case. La restriction s'applique également
  à l'IA et aux clics de grille.
- Le City Hunter reste une menace de scène jusqu'au duel au Smart Disc.
  Sa simple disparition ou son KO numérique ne donne pas la victoire.
- Le clan perdu et l'Ancien ne sont **jamais** convertis en une vague d'ennemis.
  La zone devient paisible après la défaite du chasseur.
- Le « pistolet Adolini 1715 » apparaît comme **preuve narrative** dans le
  rapport de mission **uniquement après extraction réussie**, sans créditer
  l'inventaire du joueur ou inventer des statistiques d'arme.
- Après démarrage des moteurs : **8 fins de tour** pour rejoindre la sortie.
  La pression provient des réacteurs, pas d'un nouveau poignet explosif.
  Expiration : défaite `ship_takeoff_blast`. Durée totale maximale : 38 tours.
- Fin unique, historique de commandes et résumé sérialisable par le moteur
  tactique existant ; pas de changement aux migrations ou récompenses du jeu.

## Références pour l'identité et les scènes

1. [20th Century Studios — Predator 2 (1990)](https://www.20thcenturystudios.com/movies/predator-2)
   : film, réalisateur, Harrigan et identité de l'univers.
2. [AFI Catalog — Predator 2](https://catalog.afi.com/Film/58654-PREDATOR-2)
   : synopsis du rooftop, disque, vaisseau sous Los Angeles, trophées,
   remise du pistolet par les autres chasseurs, fuite pendant le décollage.
3. [Synopsis francophone — Predator 2](https://fr.wikipedia.org/wiki/Predator_2)
   : appui secondaire pour le marqueur **Raphael Adolini 1715** et le
   rôle du clan ; ne remplace pas le film comme référence visuelle.

Les scènes du toit, de l'abattoir et du métro constituent d'autres tronçons
narratifs **non jouables dans ce niveau**. Le vaisseau et le témoignage du
clan sont une adaptation condensée, pas une carte architecturale 1:1.

## Différence déterminante avec Predator (1987)

| Épisode | Protagoniste | Chasseur | Sort du dispositif au poignet | Épreuve finale |
| --- | --- | --- | --- | --- |
| Predator (1987), 50104 | Dutch | Jungle Hunter | S'active après la bûche | Fuir et survivre à l'explosion |
| Predator 2 (1990), 50105 | Mike Harrigan | City Hunter | **Désarmé sur le toit avant le vaisseau** | Smart Disc, respect du clan, cadeau 1715, fuite au décollage |

Ces différences sont exécutées dans le contrôleur de scénario et visibles
dans le panneau tactique, pas seulement dans les textes de lore.

## État de la production visuelle

La composition actuelle du vaisseau est un **schéma procédural Canvas** :
poutres sombres, paroi de trophées simplifiée, sas et effet de propulsion.
Le City Hunter utilise la base de sprites existante ; l'Ancien réutilise
un personnage déjà enregistré. Aucune pose, taille ou couleur ne reçoit
automatiquement une certification de fidélité 1:1.

Restent en **revue et fabrication ouvertes** : tenues exactes de Harrigan
en 1990 ; masque et peau du City Hunter, son bras sectionné et le disque ;
filet déployé en animation ; vaisseau et salle des trophées ;
l'Ancien Greyback ; pistolet Adolini 1715 ; tirages d'effet de propulsion ;
mouvements, sons originaux non extraits et mise en scène de sortie.

Le [backlog graphique source-locké](../assets/PREDATOR_SOURCE_SCENE_ART_BACKLOG_2026-10-31.json)
décrit ces contrats. Le nombre de sprites généraux « disponibles » ne sert
pas de preuve d'apparence approuvée. Aucun nouveau PNG n'est installé
par ce lot.

## Vérifications attendues

`npm run test:reaudit` inclut `scripts/reauditSourceScenes.test.mjs` :
parcours manuel et auto du vrai EngineTactics, déblocage du filet, historique,
seuil de décollage et de défaite, rapport de victoire unique, résistance aux
changements de personnage, refus des actions prématurées, pause et reprise.

`npm run build` comporte le prébuild intégral, vérifications d'assets,
fichiers et classeurs historiques. Les retours CI doivent être lus jusqu'à leur
conclusion avant toute fusion. Le contenu reste en PR tant que ces
contrôles ne sont pas tous verts.
