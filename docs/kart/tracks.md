# Circuits kart 3D par univers

Cette livraison relie **525 univers du roster courant** à un circuit de kart. Le catalogue est calculé à partir des héros réellement inclus dans la distribution ; les univers retirés par l’installation ou masqués dans la sauvegarde ne sont pas sélectionnables.

## État de production

| Périmètre | État |
| --- | --- |
| 525 circuits liés aux univers | Géométrie, départ, tours, boîtes, accélérateurs, terrains et repères disponibles |
| 30 circuits définis individuellement | Lieu, palette, route et combinaison de repères rédigés pour l’univers |
| 20 univers originaux supplémentaires | Palette exacte et noms de lieux repris dans `originalUniversesManifest.json`, volumes de composition encore paramétriques |
| 475 autres circuits | Prototypes de conduite ; les décors spécifiques restent à produire et à comparer aux sources |
| 39 univers d’épreuves sans combat | Rallyes sans boîtes offensives ni pièges ; les attaques importées sont aussi refusées par le moteur |
| Fidélité graphique 1:1 validée | **0** : ni les maillages procéduraux ni la présence d’une référence ne valent une validation artistique |

Les 30 circuits conçus comprennent quatre univers OC (Nexus, Thalassa, Méridien Creux et Viridienne). Les 20 autres OC sont comptés séparément. Les six pistes Nexus historiques conservent leurs identifiants ; elles s’ajoutent aux 525 nouvelles pistes d’univers.

## Critères joueur appliqués

- Choisir un univers installé donne accès à son circuit ; retirer ou masquer ce DLC ne laisse pas de circuit orphelin.
- Les coordonnées de départ, les points de route et la largeur sont celles que lit réellement `EngineRace`. Le ruban 3D et la carte ne créent pas une trajectoire différente.
- La première traversée de la ligne en quittant une place située derrière la grille ne donne pas un tour gratuit. Un tour demande désormais les jalons intermédiaires ordonnés avant le retour à la ligne.
- Les décorations ont une empreinte dimensionnée et restent hors de la chaussée. Elles ne créent pas de collisions invisibles ; seuls les obstacles joués par le moteur affectent la course.
- Les univers d’épreuves pacifiques gardent ce contrat pendant la course.
- Les statuts de prototype et de fidélité à revoir restent consultables dans le catalogue de production.

## Premier lot de décors conçus

| Univers | Circuit / lieu retenu | Repères à l’écran |
| --- | --- | --- |
| Nexus de Convergence | Atrium — Tour des Ancres | Cœur de convergence, portique de suture, archives et console d’Ancre |
| Thalassa Mnémique | Récif des Registres | Corail-mémoire, sas en cuivre, moteur de marée, registre de verre |
| Méridien Creux | Grand Cadran — Chronobanque | Tour à cadran, Chronobanque, conduites de secondes cyan |
| Viridienne Ultime | Canopée des Orbites | Soleil-Racine, orbites de semences, graines-planètes |
| Halo | Installation 04 — Rivage du Cartographe | Anneau monumental, entrée Forerunner anguleuse, relief côtier |
| Alien | Nostromo — Pont de maintenance | Cloison nervurée, module technique pâle, conduites |
| Aliens | Hadley’s Hope — Complexe atmosphérique | Processeur, modules bas, voies de service |
| Star Wars | Mos Espa — Boucle du Boonta | Tribunes, roche érodée et arche de canyon |
| Stargate | Abydos — Parvis de la Porte | Pyramide, Porte circulaire, terrasse de grès |
| Stargate Atlantis | Atlantis — Digues de la Cité | Tours des Anciens et quais au-dessus de la mer |
| Stargate Universe | Destiny — Coursives anciennes | Noyau technique, nervures et conduites ambre |
| Sonic | Green Hill — Anneaux du littoral | Falaises à damier, herbe vive, palmiers, anneau doré |
| Minecraft | Overworld — Vallée des blocs | Terrasses et arbres cubiques, entrée de mine |
| Final Fantasy VII | Midgar — Anneau du réacteur | Réacteur Mako, conduites et piles industrielles |
| Naruto | Konoha — Tour des remparts | Toitures du village, porte et lisière, avant Shippuden |
| Naruto Shippuden | Amegakure — Sous la pluie | Tours métalliques et conduites, distinctes de Konoha |
| Dragon Ball Z | Namek — Rives du ciel vert | Ciel vert, eau bleue, buttes et arbres fins |
| The Lord of the Rings | Mordor — Au pied de Barad-dûr | Tour sombre, contreforts et roche volcanique |
| Half-Life | Cité 17 — Voies du Combine | Citadelle lointaine, immeubles usés, barrage |
| Portal | Aperture — Anneau de test | Chambre blanche et ouvertures orange/bleue décoratives |
| Resident Evil | Raccoon City — Autour du R.P.D. | Commissariat, porche et immeubles de rue |
| Silent Hill | Route du brouillard | Façades usées et ambiance de brouillard |
| Metal Gear | Shadow Moses — Périmètre du hangar | Hangar militaire, tour de garde et neige |
| Mass Effect | Citadelle — Promenade du Présidium | Architecture claire, courbe de station et jardin |
| Fallout | Terres désolées — Route de l’Abri | Entrée d’Abri, roche et récupération ; aucun numéro inventé |
| Doom | Mars — Circuit de la fonderie | Réacteur, conduites et roche martienne |
| The Matrix | Mégapole — Échangeur de la Matrice | Tours, béton et teinte verte |
| Predator | Jungle — Piste de l’extraction | Canopée, palmes et roches humides |
| Harry Potter | Poudlard — Cour de pierre | Tours, cour et arcade de pierre |
| Crash Bandicoot | Île N. Sanity — Sentier des ruines | Ruines, palmiers et caisses de décor |

Ces circuits sont des **adaptations de course créées pour Multiverse**. Le parcours routier n’est pas présenté comme un événement ni comme un plan canonique des œuvres. Les anneaux de Sonic, d’Aperture et de Stargate présents dans les décors n’ajoutent ni looping jouable ni téléportation traversant les contrôles de tour.

## Références et validation artistique

Les URLs de chaque circuit figurent dans `kart-tracks.json` et dans `track.environment.references`. Les pages suivantes ont été consultées pour cette passe :

- [Halo Studios — rivage du Silent Cartographer](https://www.halowaypoint.com/news/silent-cartographer-third-person-gameplay-halo-campaign-evolved).
- [Lucasfilm — Mos Espa Grand Arena](https://www.starwars.com/databank/mos-espa-grand-arena) et [Boonta Eve Classic](https://www.starwars.com/databank/boonta-eve-classic-podracer-pilots).
- [20th Century Studios — Alien (1979), galerie officielle](https://www.20thcenturystudios.com/movies/alien).
- [SEGA — Sonic Mania, section Green Hill](https://www.sega.jp/game/detail/sonicmania/).
- [Mojang — présentation de Minecraft](https://www.minecraft.net/en-us/about-minecraft).
- [Square Enix — Final Fantasy VII](https://na.finalfantasy.com/en/titles/finalfantasy7/) et [entretien officiel sur la reconstruction de Midgar](https://blog.fr.playstation.com/2020/03/06/rinventer-midgar-les-crateurs-de-final-fantasy-vii-remake-racontent-la-reconstruction-de-la-ville-emblmatique-sur-ps4/).
- [Naruto — présentation officielle de la première série](https://naruto-official.com/en/anime/naruto1).

Les autres références proviennent des profils de lieux, des descriptions et des dossiers DLC déjà présents dans le projet. Elles sont conservées comme provenance héritée, sans déclaration de nouvelle vérification externe. Les 24 univers originaux utilisent le canon local du projet.

La prochaine validation 1:1 demande des captures de référence identifiées par version, des textures et modèles spécifiques, puis une comparaison au même cadrage. Les proportions, matériaux, silhouettes secondaires et détails d’architecture restent ouverts. Aucun statut « validé » n’est attribué automatiquement.

## Contrat technique

`getKartUniverseTracks({ hiddenUniverses })` renvoie un objet indexé par identifiant de circuit. L’identifiant dérive du nom stable d’univers et d’un hash indépendant de sa place dans le catalogue. Il ne change pas quand un autre DLC est ajouté ou retiré.

`createKartUniverseTracks({ heroes, hiddenUniverses, isInstalled })` permet de vérifier une distribution réduite sans modifier le fichier d’installation. Le module consomme les adaptateurs publics du projet ; il n’importe aucun module de pack directement.

Chaque circuit expose les champs déjà lus par le moteur : `start`, `waypoints`, `checkpoints`, `laps`, `roadWidth`, `boostPads`, `itemBoxes`, `surfaceZones`, `hazards`, `objective`. Les champs `environment`, `fidelityStatus`, `sourceLocation` et `raceRules` portent la présentation et la provenance.

Les repères 3D ont un centre au sol `(x, z)`, des dimensions `width/height/depth`, une rotation autour de l’axe vertical et des couleurs. L’axe horizontal du moteur correspond à X ; son Y de déplacement correspond à Z. Le renderer est responsable de garder les maillages dans l’empreinte déclarée. Le filtre de placement teste le rectangle orienté avec la largeur de route réservée, plus 20 unités pour laisser passer la carrosserie lorsqu’un kart longe le bord de la chaussée.

Les 30 briefs conçus restent dans `src/game/kart/kartTrackDesigns.js`. Le filtrage d’installation et de visibilité est fonctionnel ; ces métadonnées centrales ne constituent pas encore 30 modules de contenu exportables séparément dans `DLC/<Univers>/data`.

## Vérifications exécutées

Commande : `node --test scripts/kart/kartTracks.test.mjs`.

**14 tests réussis**, dont : couverture des univers installés, exclusion DLC/visibilité, stabilité des IDs, chemins fermés sans intersection, coordonnées bornées, contrôles ordonnés, objets ancrés sur la vraie route, empreintes de décor, provenance, palettes exactes des 20 OC, contraintes sans combat, départ depuis l’arrière de la grille et isolation des états entre courses.

Le test de simulation parcourt les **525 circuits** avec le vrai `EngineRace`, ses quatre pilotes et ses objets habituels. Au moins un pilote termine réellement trois tours sur chacun, sans affecter directement les champs `lap` ou `finished`. Le sondage de recette a observé des courses entre **15,47 et 21,35 secondes de simulation**. Cela vérifie l’accessibilité du parcours pour l’IA actuelle ; ce n’est ni une mesure FPS, ni une validation de difficulté humaine, ni un essai navigateur des 525 décors.

La régression de grille a été observée avant correction : un pilote placé derrière la ligne recevait un tour après environ 52 unités sur une piste de 1 593 unités. La vérification permanente exige désormais zéro tour après le compte à rebours et les premiers mouvements de départ.

La validation visuelle WebGL, les commandes tactiles et le rendu des pilotes relèvent des recettes du renderer et de `RaceMode`, documentées séparément dans le dossier kart.

## Suivi de production

Le classeur `docs/excel/Multiverse_Breach_Kart_3D_2026-11-08.xlsx` contient deux tableaux filtrables : **1 912 pilotes** et **525 circuits**. Les fichiers GLB, atlas de kart, sources des conducteurs, lieux et références restent associés à leurs identifiants stables. Les compteurs du haut sont calculés depuis les lignes détaillées.

Les cellules jaunes de revue sont manuelles. Elles démarrent toutes à « À faire » ou « Non vérifiée ». Le travail restant et le nombre de revues terminées évoluent lorsque les champs de revue sont renseignés ; valider une étape ne masque pas les autres étapes ouvertes. La présence d’un sprite reprend la disponibilité déclarée dans le manifeste, fondée sur l’arbre Git. Elle ne vaut pas vérification visuelle du pilote dans son kart.

Le builder `scripts/kart/buildKartWorkbook.mjs` utilise les deux manifestes `docs/kart/kart-assets.json` et `docs/kart/kart-tracks.json`. Il doit être exécuté depuis un répertoire temporaire avec le runtime primaire et `@oai/artifact-tool`, puis copie le résultat dans `docs/excel`. Une reconstruction repart des statuts de source et réinitialise les champs de revue manuelle ; conserver les revues saisies avant une nouvelle génération.

La recette du classeur a recalculé les compteurs, testé des modifications de revue puis restauré les valeurs initiales, recherché les erreurs de formule, vérifié les filtres et volets figés dans le fichier exporté, et inspecté les rendus des deux onglets. Les **2 453 formules** ne contiennent aucune erreur détectée et aucune validation artistique n’est attribuée automatiquement.
