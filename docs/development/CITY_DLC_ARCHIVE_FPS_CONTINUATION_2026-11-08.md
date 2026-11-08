# Suite Cité, DLC, archive Univers et vues FPS

Cette passe prolonge la PR #27 à partir de `f2b9e973eee5bf6d897643f3558e60332f8986b5`.
Elle ajoute neuf contrats de Cité, raccorde les quatre contrats invités aux packs Halo et Alien,
modernise le lecteur d’univers et différencie les vues schématiques FPS selon la technique tenue.

## Contrats ajoutés

| Personnage | Quartier | Contrat | Activité et conclusion |
| --- | --- | --- | --- |
| Tessera Vale | Nexus | La vitrine à deux récits | Comparer deux notices et conserver les souvenirs avec leur attribution. |
| Quillon Rusk | Nexus | Le reçu et le témoin | Suivre une remise, identifier sa copie et refuser une double restitution. |
| Nadir Kest | Nexus | L’autre côté du seuil | Mesurer départ, relais distant et retour physique à la sonde. |
| Elyra Null | Nexus | La porte consentie | Vérifier acceptation, refus et retrait d’autorisation. |
| Oryn Xile | Nexus | Le manifeste des voix | Séparer les signatures et respecter le retrait d’une contribution. |
| Master Chief | Halo | La trace UNSC retrouvée | Distinguer un relevé d’Installation 04 d’un raccourci non vérifié. |
| Master Chief | Halo | Le couloir de retour | Vérifier un exercice de repli A.R.C.A. par un aller-retour. |
| Ellen Ripley | Alien | La route du Narcissus | Séparer signal de danger et destination dans une reconstitution documentaire. |
| Ellen Ripley | Alien | L’alarme et la sortie | Relever une signalétique d’exercice et vérifier l’issue puis le retour. |

Le catalogue contient désormais 16 contrats pour 14 identités : les 12 identités du Nexus
(Ancre comprise), Master Chief et l’incarnation de Ripley d’*Alien* (1979).
Chaque contrat conserve deux conclusions recevables, une proposition refusée avec explication,
et la transmission finale à l’ancre du quartier. Les sept contrats précédents conservent leurs IDs
et leur séquence. La progression exige une interaction résolue à portée du bon personnage,
de la bonne vitrine ou de la bonne borne. Les résultats restent des dossiers sauvegardés.

Les intrigues sont des créations de Cité. Les contrats Halo portent sur un relevé et un exercice,
sans ajouter d’événement à la campagne ni imposer le Bubble Shield ou le Spartan Laser à
Installation 04. Les contrats de Ripley ne lui transfèrent ni les équipements ni les souvenirs
de son incarnation d’*Aliens*. Références de continuité consultées :
[chronologie officielle Halo](https://www.halowaypoint.com/en-us/news/thats-so-raven) et
[fiche officielle Alien (1979)](https://www.20thcenturystudios.com/movies/alien).
Les cinq dossiers originaux du Nexus sont dans `src/game/characterPlaques.js`.

## Séparation des packs

Les fichiers `DLC/Halo/data/mosaicCharacterMissions.js` et
`DLC/Alien/data/mosaicCharacterMissions.js` portent le contenu invité.
Leur déclaration dans les manifests et le registre généré suit le même mécanisme que les
autres modules de packs. Les builders communs sont injectés dans les factories ; aucun
module DLC ne réimporte l’agrégateur.

Le profil base conserve 12 contrats. Halo seul et Alien seul en conservent chacun 14 ;
leur combinaison en conserve 16. Les tests importent la source transformée avec les dossiers
exclus physiquement absents. Les checkpoints Halo et Alien traversent une sauvegarde App,
une sélection base et le rétablissement de leur pack sans être réattribués à un autre univers.
Les sélections Kaamelott seul, System of a Down seul et combinées ont également été examinées
avec les imports réels App/Hub : aucun module d’un pack exclu n’entre dans leur graphe SSR.

## Archive Univers

Le lecteur extrait de `HubScreen.jsx` conserve les cartes et informations existantes.
Son en-tête se limite à la fermeture ; le titre, le contexte repliable, les compteurs et les
chapitres partagent un seul défilement. Huit catalogues disposent d’une recherche complète
avant pagination à 12, 24 ou 48 entrées. Le chapitre et les filtres sont conservés par univers
pendant l’ouverture. Les contrôles, le texte agrandi et le focus clavier sont couverts par
les tests du lecteur et sa recette navigateur.

Voir [la portée du lecteur d’archive](UNIVERSE_ARCHIVE_READER_2026-11-08.md).

## Vues FPS

Le nouveau renderer schématique lit la technique principale du profil et l’arme tenue.
Neuf géométries couvrent les 1 811 profils combattants : contact, projectile, tir direct,
cône, rayon, dispersion, contrôle, focalisation et déplacement. Les ramassages shotgun,
rocket et plasma gardent leurs propres représentations. Le rendu vérifie le personnage,
le propriétaire du protocole et la partie courante ; un protocole incompatible donne
un schéma neutre. Tir, récupération, recharge et stock vide utilisent l’état de simulation.
Les trois planches personnelles existantes conservent leur priorité.

Ce sont des schémas de technique, sans nouvelle validation artistique des mains ou des armes.
Les quatre modes, leurs directives, les profils de combat et les règles de récompense restent
pilotés par leurs moteurs existants. La recette de terrain et les tests de signatures continuent
à vérifier ces intégrations ; aucune mesure de gain de fréquence d’image n’est revendiquée.

### Placement des vues par rapport au HUD réel

Les quinze workflows de la révision `0108b7ce76b74002da127cfbf6d2eb632196dcc0`
ont réussi. La relecture des captures intégrées du
[run Cité/FPS 42468199074](https://github.com/darknigthmare/multiverse-breach/actions/runs/42468199074)
a néanmoins révélé une composition incorrecte : les commandes HTML recouvraient les
schémas de Lilo et Long Horse et la planche personnelle de Serj en portrait, ainsi que
certaines vues sur ordinateur. Le banc schématique isolé ne contenait pas ce dock.

`useExtinctionViewLayout` mesure désormais séparément les statistiques, les commandes
et la directive. Un `ResizeObserver` et les événements d’affichage actualisent une ref
de présentation ; aucune lecture DOM n’est ajoutée à la boucle de rendu. Le helper
`extinctionViewLayout` convertit ces rectangles dans le repère du canvas, réserve le
radar, le viseur et les marges choisies, puis contient la vue dans une bande basse utile
ou dans un espace latéral. Les ratios et le mouvement latéral restent contenus dans
ce rectangle. La translation de secousse ne s’applique plus à la vue tenue ; le monde,
le viseur et les effets visés conservent leur projection.

La recette intégrée observe les tracés Canvas et les appels `drawImage` réels, puis
compare leurs bornes aux rectangles HTML. Elle capture la fiche de capacités elle-même,
contrôle les rotations et les réglages agrandis, et commence par un parcours court de
chasse qui obtient puis ramasse une arme avec les commandes natives. Ce parcours
affiche ensemble **KIT PERSONNEL** et **MARQUER** en paysage ; il vérifie la place de la
vue, le viseur libre, les cibles tactiles et la conservation des stocks au retour au kit.
Il s’arrête avec rapport et capture dès un échec, avant les parcours de modes plus longs.

Le premier passage sur `072e647819e548102bbe664d6791130b3398cfe7`
([run 42470776814](https://github.com/darknigthmare/multiverse-breach/actions/runs/42470776814))
a obtenu le ramassage par les actions natives, puis a révélé deux points précis. Le HUD
publie son instantané périodiquement : la recette avance maintenant son horloge contrôlée
jusqu’à l’apparition du bouton de retour au kit, au lieu d’attendre en temps réel avec
la simulation arrêtée. La capture a également montré que MARQUER créait une quatrième
rangée de commandes, devant le viseur. En paysage court, la grille réserve désormais
six emplacements sur une seule rangée primaire lorsque KIT ou MARQUER est présent.
Les libellés visibles KIT et LOOT sont raccourcis dans ce seul format, avec leur texte
complet conservé dans le nom accessible et l’infobulle. Les contrôles gardent leur taille
tactile minimale de 44 px et la police choisie ; les assertions de géométrie restent intactes.

Le contrôle court de `846b242b1e7a88fc58e2f50213a1eb90f2e9ef74`
([run 42471486426](https://github.com/darknigthmare/multiverse-breach/actions/runs/42471486426))
a confirmé KIT et MARQUER simultanés, les commandes de 44 px et la vue latérale dégagée.
Il a isolé un autre chevauchement : le panneau de directive descendait de 68 à 199,36 px
sur un écran de 844 × 390, traversant le carré réservé au viseur. La présentation courte
de la directive reste maintenant dans la partie supérieure gauche, avec objectif, compteur
et barre de progression, en libérant l’espace latéral droit pour la vue. La consigne complète et le détail de progression restent consultables
dans « Directive et commandes ». La recette contrôle cette lecture, la pause de simulation
pendant l’ouverture et le retour au jeu, en plus des rectangles réels à 380, 390 et 500 px
de hauteur. Tous les boutons d’ouverture de ce panneau gardent au moins 44 px en paysage court.

Les résultats de cette correction et ses captures doivent être rattachés au nouveau
commit testé dans le compte rendu de PR. La réussite de `0108b7ce` constitue le diagnostic
de départ, pas la validation visuelle de ce nouveau placement.

Sur cette correction, les 374 tests d’interface et les 45 tests FPS ciblés passent
localement, ainsi que le lint, la validation de la recette et la compilation de sa
fixture réelle. Les 44 étapes de production et le navigateur restent contrôlés en CI.

## Excel du PR

[Le classeur](../excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx)
conserve les 1 912 identités et 3 824 propositions de missions, soit une proposition univers
et une proposition Multiverse pour chaque identité. Les 16 contrats réellement intégrés sont
listés séparément avec leurs étapes, conclusions, conditions de quartier/DLC et sources.

La mise à jour importe le classeur existant avec `--existing` au lieu de recréer les onglets
de suivi. Seules la table des contrats et sa synthèse évoluent. La comparaison OpenXML avec
le fichier précédent contrôle les valeurs, formules, validations, mises en forme conditionnelles
et volets des quatre autres feuilles. Les propositions ne sont pas déclarées terminées par
la présence d’un contrat distinct au titre proche.

## Vérification et reproduction

Contrôles locaux du lot initial : 38 tests de contrats et sauvegardes, avec les 32 conclusions
recevables parcourues par le moteur de déplacement ; 373 tests de la suite d’interface ;
12 tests du catalogue de planification et 178 tests de la suite des profils DLC. Les tests
ciblés d’archive, de profils et de vues complètent ces contrôles. La chaîne `prebuild` conserve ses 44
commandes dans le même ordre.

Le navigateur de ce poste refuse la création de son socket au démarrage. Les preuves
navigateur sont donc produites par les workflows de la PR, et leurs résultats sont reportés
dans la description du PR après exécution :

- `character-city-fps.yml` : 18 cas Cité, 56 parcours, FR/EN et trois formats d’écran,
  avec déplacements réels, choix refusés, checkpoints et retour à l’ancre du bon univers ;
- `universe-archive.yml` : six variantes de lecture, texte à 150 %, HUD à 140 %, marge de 32 px,
  recherche, pagination, focus, univers voisins et absence de mutation de progression ;
- `extinction-schematic.yml` : 12 cas, cinq états et trois formats avec mesures raster ;
- workflows existants de production, distribution et parcours FPS pour les régressions.

Les captures de banc d’essai de l’archive utilisent des données et médias synthétiques déclarés.
Les parcours Cité emploient les scènes et atlas réels. Les preuves schématiques emploient le
renderer et les profils réels avec des états préparés, sans prétendre constituer 1 811 parties jouées.
