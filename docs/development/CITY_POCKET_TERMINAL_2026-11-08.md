# Retrouver son aventure dans le terminal de poche

## Problème rencontré

Dans la version `48197dc4`, **Ouvrir mon carnet** depuis une conversation
appelait le même callback que la transmission résumée du HUD. Ce callback
descendait jusqu'au dernier message de Trame, en bas du terminal. Il ignorait
aussi l'identifiant de mission transmis par le personnage : sans aventure déjà
suivie, le lecteur pouvait afficher la première entrée du catalogue.

Le terminal réunissait ensuite carnet, reconnaissance, habitants, destinations,
reliques et aide dans une seule longue page. Retrouver la demande que l'on venait
d'entendre exigeait de remonter cette page et de chercher la bonne aventure.

## Comportement attendu et intégré

Une rencontre doit ouvrir la bonne page du carnet en une action. La navigation
du terminal doit rester une lecture, conserver la progression, le personnage,
les objets portés et le contrôle de la pause, et fonctionner au clavier comme
au pointeur. Aucun panneau supplémentaire n'est ajouté sur la scène.

Le terminal possède maintenant quatre rubriques :

| Rubrique | Contenu |
| --- | --- |
| **Carnet** | Demandes des personnages, aventure suivie, choix, étapes et souvenirs du quartier. |
| **Quartier** | Habitants, passages accessibles, vitrines et services proches. |
| **Messages** | Dernière transmission complète, reconnaissance, témoignages conservés et briefing de terrain existant. |
| **Guide** | Repères de la Cité, accueil, commandes et pause ou reprise de l'aide. |

Le premier accès ouvre le Carnet. Pendant une visite de la Cité, le bouton général
du terminal retrouve la dernière rubrique consultée. Les entrées contextuelles
ont leur propre destination :

- **Ouvrir mon carnet** depuis un habitant ouvre sa mission et place le focus
  sur le titre de cette aventure. Lire une autre demande ne remplace pas
  l'aventure actuellement suivie ; son acceptation reste explicite.
- **Lire la transmission complète** ouvre Messages et le texte de Trame.
- L'ouverture du guide complet rejoint Guide ; une interaction avec une
  vitrine rejoint Quartier et la fiche concernée.

`MosaicCharacterMissions` accepte un `initialMissionId` facultatif. Si cette
mission n'est pas disponible dans le catalogue courant, le lecteur conserve
son repli existant vers l'aventure suivie ou une entrée disponible. Aucun pack
absent n'est réintroduit par ce paramètre.

## Lecture, clavier et cycle de vie

`MosaicPocketTerminal` présente de vrais onglets avec `aria-selected`,
`aria-controls` et leurs panneaux associés. Gauche et droite changent de
rubrique ; Début et Fin rejoignent les extrémités. Tab entre dans le panneau
actif. Une seule rubrique est visible et les panneaux masqués sont exclus
du parcours clavier par le garde de fenêtre existant.

Les panneaux restent montés tant que le terminal est ouvert : changer de
rubrique conserve la mission lue, la recherche, les filtres, la pagination
et les dépliants. Cette conservation concerne la consultation en cours ; elle
n'ajoute aucun champ de sauvegarde et ne promet pas de mémoriser ces filtres
après la fermeture ou le démontage de la Cité.

Les onglets s'organisent sur deux lignes en portrait étroit et une ligne sur
les formats plus larges. Leur texte utilise la taille de lecture choisie.
La navigation reste disponible pendant le défilement. Sa hauteur réellement
mesurée réserve l'espace nécessaire aux titres focalisés ; un changement
de taille ou de police recalcule cet espace. L'observateur et la valeur
temporaire de défilement sont nettoyés au démontage.

Un changement manuel de rubrique annule toute ancienne demande de focus
différé. La fermeture annule aussi ces demandes immédiatement, avant le prochain
effet React. Le callback différé relit leur état avant de focaliser : s'il a été
annulé entre sa programmation et son exécution, il ne retombe pas sur le titre
du Carnet masqué. Le cycle de fenêtre existant
continue de posséder Échap, le piège de focus, le retour au déclencheur et
la suspension des commandes de la scène.

La fermeture par le fond du terminal annule aussi le comportement par défaut
du pointeur : le clic souris compatible ne reprend plus le focus après son
retour au déclencheur. C'est le même correctif que celui déjà appliqué au
panneau de conversation. Il est porté par le composant partagé
`ImmersiveDrawer`, sans changer ses boutons, sa pause ou son action Échap.

## Approcher un repère déjà proche

La relecture du parcours au sol a révélé une différence entre les portées :
à 65–72 px du prochain repère, le clic essayait une interaction immédiate alors
que son passage exige encore de marcher à moins de 64 px. Le résultat était
un refus `walk_pending`, sans destination. Une reprise au centre du repère
présentait la même difficulté.

Le clic Canvas sur le repère d'un parcours actif incomplet et le bouton
**REJOINDRE** du carnet demandent désormais la même approche. S'il est déjà
dans le rayon, le jeu cherche un petit point distinct au pied ou sur le côté.
`getMosaicMissionWalkApproach` utilise les obstacles,
les corps des habitants, les bornes du quartier et le planificateur ordinaires.
Le point retenu reste dans le rayon de 64 px après bornage. Si le passage est
entièrement fermé, le joueur reçoit un retour local et aucune progression.

La dernière relecture a retrouvé un cas distinct dans l'approche différée du
carnet : le joueur pouvait déjà se trouver au pied accessible d'un repère,
à neuf unités sous son centre. Viser le centre ramenait le planificateur sur
ce même pied ; trente mises à jour actives restaient sans mouvement et sans
reçu. L'approche différée utilise maintenant le même point distinct que le clic
Canvas, seulement après la fermeture du terminal. Les destinations des autres
services et de l'interaction finale d'un parcours terminé restent ordinaires.

Le clic ne change jamais la position du joueur et ne produit aucun reçu.
Seul un déplacement réel dans la boucle peut valider le repère ; le budget
de vitesse, les collisions et le premier frame immobile de reprise sont
conservés. Le suivi existant peut ensuite conduire aux repères suivants.
Les autres services et l'interaction finale d'un trajet déjà parcouru gardent
leur comportement.

## Vérifications locales

Sous Node 22.23.4 :

- **37/37 tests** de `mosaicContractJournal.test.mjs` et
  `scenePresentation.test.mjs`. Deux rendus réels du lecteur vérifient FR/EN :
  consulter une demande précise garde l'autre aventure suivie et ne l'accepte
  pas. Les callbacks réels du hub distinguent Carnet, Messages et Guide.
- **41/41 tests** de `mosaicCityRuntime.test.mjs` lors de la vérification
  ciblée de cette intégration, notamment la conservation des commandes,
  de la position et de l'aide différée.
- La revue finale ajoute trois régressions du vrai callback de focus : changement
  manuel de rubrique avant le frame programmé, fermeture avant le prochain effet,
  et destination correcte des trois demandes encore actives. Les demandes
  annulées ne déplacent ni le focus ni le défilement, même si le cleanup React
  n'a pas encore été exécuté.
- Après la correction des clics proches, **147/147 tests** de
  `scenePresentation.test.mjs`, `mosaicCameraFraming.test.mjs` et
  `mosaicCharacterMissions.test.mjs` passent. Les trois nouvelles régressions
  exécutent la vraie callback `moveToPointer`, puis le mouvement et les reçus
  de production : centre restauré, pied déjà occupé, écarts de 30, 64, 65, 70,
  72 et 73 px, habitant sur l'approche, bords du monde et mur infranchissable.
  Elles contrôlent aussi l'absence de reçu au clic et à 0 ms, le budget de
  mouvement, les services voisins et l'interaction finale conservée.
- Deux régressions supplémentaires exécutent l'effet d'approche différée du
  carnet : attente de fermeture, reprise au pied accessible, centre, écarts
  de 30 à 73 px, refus du mur fermé et conservation d'une destination de service.
  Elles suivent ensuite le vrai moteur et la collecte de reçus ; aucun point
  n'est attribué à la fermeture ni à 0 ms, et aucun reçu d'opération n'est créé.
- Oxlint ciblé, incluant `HubScreen.jsx`, les composants, les recettes JS
  et la fixture : aucune alerte. Le helper d'approche et ses régressions ont
  également été contrôlés sans alerte. Les sept recettes Python concernées compilent.
- La fixture du carnet compile avec Vite. Il s'agit de cette fixture,
  pas de la chaîne complète `npm run build`.

Le lancement local de Chromium a été tenté. Il échoue avant la création d'une
page dans `process_singleton_posix.cc` : `socket() failed: Operation not
permitted (1)`. Cette vérification locale ne constitue donc pas une preuve
native de disposition, de navigation ou de focus.

## Recettes natives à lire sur la révision publiée

La recette du carnet conserve ses six contextes FR/EN en 390×844, 844×390 et
1365×900. Elle vérifie désormais les quatre rubriques à texte 150 %, leurs
cibles tactiles, l'ordre clavier, le piège de focus et la conservation des
recherches et de la mission consultée. Son contenu de quartier et d'aide est
préparé ; elle n'est pas une simulation de déplacement dans la ville.
Les deux cas de bureau vérifient également la fermeture par le fond visible
et le retour du focus. Le terminal occupe toute la largeur des deux formats
mobiles : ces cas n'inventent pas un fond cliquable qui n'y existe pas.

La recette des missions ajoute la lecture des quatre vraies rubriques de la
Cité, dans les six contextes Nexus principaux. Elle compare l'état observé
avant et après navigation : scène, progression, objets portés et objets
d'intervention. Les deux rencontres natives avec Mirelle ouvrent aussi sa
demande depuis la conversation, contrôlent la page et le focus, puis reviennent
à la rencontre avant l'acceptation réelle.

Les parcours existants vers les habitants, les vitrines, les services et le
briefing FPS choisissent maintenant explicitement leur rubrique. Les actions,
trajets, critères de mouvement, graines et exigences de fin de partie restent
ceux des recettes existantes. Les contrôles supplémentaires doivent être
confirmés dans les artefacts de la nouvelle révision avant d'être annoncés
comme réussis.
