# Quêtes vécues dans la Cité — 8 novembre 2026

## Problème traité

Les quêtes de Cité demandaient surtout de comparer des notices, transmettre des
dossiers et conserver des attributions. Ces préoccupations existent dans le
lore de Multiverse, mais elles occupaient la place des personnes, des dangers
et des gestes que le joueur devait rencontrer. La réécriture part des besoins
des personnages : rentrer, garder quelqu’un joignable, réparer une issue,
retrouver un outil, accueillir une conscience ou empêcher une porte de passer
outre un refus.

Les 24 récits Nexus sont définis dans
[`mosaicCharacterStories.js`](../../src/game/mosaicCharacterStories.js).
Le module fournit des textes FR/EN et des opérations localisées. Il conserve les
identifiants de mission, d’étape et de choix ; le moteur reste propriétaire de
la portée d’interaction, des sauvegardes et des changements visibles.

## Sources antérieures aux contrats

La référence de comparaison est `6f26ea5fcdf07f65b7088f2a7b08c72e7ee204ce`.
Les fondations ci-dessous existaient déjà indépendamment des contrats de Cité.
Les pannes et rencontres particulières des nouvelles quêtes sont des histoires
secondaires nouvelles, pas des événements prétendument cités mot pour mot dans
la bible.

| Source locale | Fondation utilisée |
| --- | --- |
| [`lore.js`, `CORE_CODEX_ENTRIES`](../../src/game/lore.js) | Le Voile sépare les Trames ; la Première Brèche laisse fuir leurs règles. Une Ancre tient plusieurs réalités sans perdre sa cohérence. A.R.C.A. conserve les continuités avant leur réécriture. Le Sans-Auteur retire origine, mémoire et choix. |
| [`characterPlaques.js`](../../src/game/characterPlaques.js) | Passé, outils, faute, doctrine et risque propres à Ancre, Bastion, Nova, Marrow, Sable, Loom, Tessera, Quillon, Nadir, Elyra et Oryn. |
| [`heroes.js`](../../src/game/heroes.js) | Mirelle : Fil de Résonance, Patch de Trame, Boucle de Sauvegarde, Suture du Voile. Bobine d’Ancre et Lentille de Signal déjà présentes dans le catalogue. |
| [`ocCampaign.js`, mission 8801](../../src/game/ocCampaign.js) | Balises de noms, Mirelle qui guide l’Ancre vers la lumière cyan, identités menacées dans l’Atrium. |
| [`ocCampaign.js`, mission 8807](../../src/game/ocCampaign.js) | Oryn retrouve son nom et refuse de parler à la place de toute la Route X. Les habitants restent des personnes distinctes du Sans-Auteur. |
| [`mosaicCityRuntime.js`, `MOSAIC_WELCOME`](../../src/game/mosaicCityRuntime.js) | Mirelle accueille les arrivants ; le Nexus relie leurs traces sans effacer leurs différences. |

Le Voile n’est pas une faction ennemie. La dixième route condamnée n’est pas
ressuscitée par une réparation locale. Ces quêtes ne terminent aucun acte de
campagne et ne distribuent aucun personnage, objet du catalogue ou récompense
de campagne.

## Douze arcs en deux épisodes

| Personnage | Premier épisode | Suite | Enjeu et gestes joués |
| --- | --- | --- | --- |
| Ancre | La lumière connaît mon nom | Le feu du retour | Une balise confond ses échos. Calibrer une bobine d’essai, séparer les signaux, boucler un retour, raccorder sa propre référence ou garder une lecture sans transfert. |
| Mirelle Suture | Deux voix dans le noir | Une réponse dans les parasites | Des appels de secours sont emmêlés. Démêler le relais, préserver sa boucle, éprouver une réponse ; raccorder un canal surveillé ou isoler le circuit. |
| Bastion Korr | La grille ne doit plus mentir | Les coups du Rempart | Une fausse flèche et un battant bloqué menacent le passage. Dégager le retour vers l’Atrium, caler le battant et laisser une veilleuse pour le témoignage sans inventer les noms perdus. |
| Nova Vey | Le sol a un temps de retard | Le battement qui revient | Les deux bords d’un passage reviennent à des instants différents. Poser les sondes, suivre une contre-pulsation, régler une lumière avec sa marge ou préparer une mesure encore à faire. |
| Sable Orison | Les flèches mènent au vide | Le détour dans la poussière | Une carte exacte hier devient dangereuse. Parcourir trois repères, mesurer la largeur, trouver un débouché, déplacer les flèches ou barrer l’accès en attente d’un second passage. |
| Loom Ivara | L’appel derrière le fil | Personne à l’autre bout | Un refuge imite une voix du drone. Attacher un fil, atteindre le relais, revenir avec sa marque, puis filtrer les instruments ou fermer le départ sans envoyer une conscience comme sonde. |
| Marrow Kade | La même voix, deux vies | Deux places à l’accueil | Un sceau retient deux consciences sous le même visage. Dégager leurs canaux, écouter leurs demandes, séparer les prises et préparer deux accueils ou suspendre la rencontre. |
| Tessera Vale | Une chambre pour Tessera | Son nom sur la porte | Un refuge projeté veut lui imposer la vie de l’agente qu’elle devait remplacer. Protéger les deux souvenirs, bloquer leur substitution, régler son nom choisi ou laisser la projection fermée. |
| Quillon Rusk | Une lampe pour ceux qui attendent | Le courant doit arriver ici | L’accueil manque de lumière tandis qu’un doublon de livraison fait croire à deux outils. Retrouver la clé unique Q-17, réparer le raccord puis l’alimentation, sans faire payer un absent. |
| Nadir Kest | La porte qui ne rend rien | La seconde porte | Une image de refuge attire sans garantir de retour. Attacher et récupérer une sonde usée, comparer le second seuil, poser un avertissement distinct ou arrêter la ligne avant lui. |
| Elyra Null | La porte a entendu non | Cette fois, je veux partir | Une porte réutilise un accord retiré. Rétablir son arrêt, isoler les anciens jetons, armer une nouvelle demande précise avec retrait possible ou maintenir l’attente. |
| Oryn Xile | Les mains derrière les noms | La voix qui voulait se taire | Des outils et des voix de voisins sont attribués à Oryn. Dégager leurs marques, retirer une voix qui refuse la diffusion, suivre un vieux raccord et débrancher la fuite ou toute la copie d’accueil. |

Les dialogues ont une demande personnelle et une voix attribuée. Par exemple,
Mirelle demande de tenir une boucle pendant qu’elle démêle les appels ; Marrow
explique pourquoi il garde la main loin de sa lame ; Quillon répare la lampe
avant de terminer ses comptes. Les sources et détails de production ne sont
pas des répliques adressées au joueur.

## Choix, causalité et gestes visibles

`request` porte la demande du personnage, `location` le lieu, `premise` la
situation et `steps` les changements par identifiant stable. Les opérations
déclarent un type parmi `repair`, `scan`, `recover`, `secure`, `beacon` et
`route`, un objet local, un libellé d’action et le constat après exécution.
Ces objets ne sont pas des ajouts à l’inventaire de reliques : une bobine
d’essai peut être calibrée sans prendre ou détruire la relique de la vitrine.

Les 12 suites suivent le choix de leur premier épisode. Leurs deux sorties
restent différentes : `apply` conduit au raccord, au balisage ou à l’accueil
choisi ; `hold` conduit à un arrêt, une protection ou une attente explicite.
Le choix ne remplace pas le geste sur place : la conséquence matérielle de la
suite passe par l’étape `verify-intervention` et son opération.

Points de continuité relus :

- Mirelle ne retrouve pas un relais réparé si le joueur l’avait isolé. Une
  nouvelle isolation coupe réellement un circuit précédemment rouvert.
- Nova n’annonce aucune mesure supplémentaire avant que cette mesure soit
  faite. Sa prudence ne devient pas une prédiction de l’avenir.
- Bastion reconnaît la fermeture et garde les noms inconnus ; des coups de
  battant ne deviennent pas la preuve que les victimes ont été retrouvées.
- Les voix de Loom restent dans son drone dans toutes les branches. Une
  réception de température ne prouve pas l’accueil d’une conscience.
- Marrow ne transforme pas l’attente d’une empreinte en culpabilité. Les
  demandes indépendantes et le dialogue restent deux situations différentes.
- Le projet de Tessera exige de conserver ses deux mémoires et son nom choisi.
  Une projection laissée en attente n’est pas supposée avoir été publiée.
- Q-17 avait déjà été livré à la Galerie même lorsque le compte était resté
  provisoire. Aucun doublon de reçu ne produit une autre clé ou une autre dette.
- Nadir conserve le premier départ fermé si la répétition était restée à faire.
  Aucun état du premier trajet n’est transmis automatiquement au second seuil.
- Elyra demande un accord neuf et précis, conserve l’arrêt et ne réactive pas
  les anciens retraits. Armer la commande ne simule pas une traversée humaine.
- Oryn peut supprimer le raccord d’une voix retirée sans fusionner les autres
  voix ni les signer à sa place. Une copie suspendue reste suspendue.

## Sauvegardes et intégration

Les 24 identifiants de mission, les 136 identifiants d’étape, les choix valides
et invalides et les prérequis sont conservés. Le module ne modifie ni les types
d’étape, ni les coordonnées, ni les cibles ou règles de validité.

Les anciennes parties ne sont pas des preuves de nouvelles réparations. Les
textes déjà joués doivent rester historiques ; les reçus d’intervention ne
doivent apparaître qu’après un nouveau geste accepté par le moteur. Aucun état
matériel nouveau ne doit être déduit d’un simple ancien `completedStepIds`.

Les effets requis par ces textes sont des accessoires localisés dont l’état
change après l’interaction, et une restitution de l’opération exécutée. Aucune
évacuation de foule, aucun combat supplémentaire et aucune traversée de PNJ ne
sont prétendus simulés par ce module de contenu.

## Vérification effectuée pendant la rédaction

Un contrôle de données a comparé le module aux définitions Git de la révision
de référence, en dehors des fichiers moteur en cours d’intégration :

- 24 missions et 136 étapes présentes, dans le même ordre et avec les mêmes
  identifiants ; tous les identifiants de choix conservés ;
- 24 variantes héritées du premier choix et 24 variantes du nouveau choix ;
- 65 étapes possédant une opération sur un parcours donné, soit 89 variantes
  distinctes lorsque toutes les alternatives de contenu sont dépliées ;
- champs FR/EN non vides, types d’opération autorisés, constats concordant avec
  les textes de fin d’opération ;
- références de source présentes dans les fichiers de la révision comparée.

Ce contrôle établit la couverture et la forme du contenu. Les tests du moteur,
les interactions en navigateur et les preuves du classeur sont suivis
séparément ; les anciens runs verts de la PR ne valident pas cette réécriture.

## Périmètre de mise à jour du classeur

Le classeur conserve ses six onglets et son suivi manuel. `Contrats jouables`
doit afficher les 28 récits courants, dont les quatre quêtes invitées maintenues
dans leurs modules DLC, avec demande, lieu, gestes, conséquences et sources.
Les deux propositions de chacun des douze personnages Nexus sont réalignées
avec ces récits sans terminer automatiquement le backlog. Les canevas ou
adaptations génériques encore concernés sont explicitement signalés comme
nécessitant une réécriture diégétique ; les propositions individualisées hors
de ce périmètre ne sont pas déclassées.

Les onglets `Personnages`, `Profils FPS`, `Modes FPS`, les formules et les états
manuels restent conservés. Aucun résultat de navigateur non exécuté n’est ajouté
au suivi.

## Classeur livré après gel des sources

Le [classeur de la PR](../excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx)
est édité depuis sa version précédente avec le runtime primaire Artifact Tool.
Les 28 lignes jouables exposent la demande personnelle, le lieu, la cause de
l’incident, chaque geste et son effet. Les choix sont présentés comme des
décisions ; leurs interventions restent explicitement à accomplir sur place.
Les 24 trajets hérités et les 24 suites du nouveau choix sont détaillés, avec
leurs prérequis, coordonnées et conséquences.

Les 24 propositions Nexus deviennent des prolongements futurs des récits
jouables : relève de Bastion, brancard de Loom, pompe de Quillon, levier d’arrêt
d’Elyra, notamment. Elles gardent leurs IDs et leur statut de proposition. Les
20 autres propositions individualisées sont conservées, soit 44 au total.
La mention « réécriture diégétique requise » s’applique uniquement aux
1 598 canevas de recherche, 848 adaptations d’objectif source et 1 334
adaptations de famille. Ces 3 780 lignes restent un travail de conception ;
aucune des 3 824 propositions n’est automatiquement déclarée terminée.

Vérifications effectuées sur la livraison :

- **20/20 tests** combinés de planification et de catalogue, y compris les
  sources locales citées sans import direct ;
- recalcul des **3 840 formules**, aucune cellule d’erreur trouvée ; preuve
  de dépendance du total des contrats et trois états du suivi, puis restauration
  des valeurs initiales avant export ;
- lecture OpenXML indépendante : **28 contrats**, **103 variantes
  d’intervention**, **12 chapitres deux**, **24 branches héritées** et
  **24 branches de décision**, texte et effets concordants avec le catalogue ;
- six onglets, cinq tables natives filtrées, cinq plages de listes déroulantes,
  volets figés et mises en forme préservés ;
- valeurs, formules et styles inchangés dans `Personnages`, `Profils FPS` et
  `Modes FPS` ; suivi manuel `M/N/O/P/Q/S/T/U` conservé pour les 3 824 lignes ;
- rendus des zones modifiées générés ; relecture visuelle de la synthèse, des
  suites Nexus, des quêtes Chief/Ripley, des prolongements et des sources.

La synthèse indique « Révision initiale du catalogue » pour `4ca3b2b…`.
Les empreintes de 17 sources runtime et de lore décrivent les fichiers
effectivement utilisés, dont `mosaicCharacterStories.js`,
`mosaicMissionOperations.js` et le chapitre Narcissus cité par Ripley. La
révision de départ de ce lot est `6f26ea5fcdf07f65b7088f2a7b08c72e7ee204ce` ;
elle ne prétend pas contenir les modifications encore à publier.

Les reçus versionnés sont
[le reçu de production](../extinction-city/character-mission-workbook-receipt-2026-11-08.json),
[la lecture indépendante](../extinction-city/character-mission-workbook-readback-2026-11-08.json)
et [la couverture du catalogue](../extinction-city/mission-planning-coverage-2026-11-08.json).
Le SHA-256 du classeur livré est
`3be59508c4d9f9d76751b89d66e3f3fe426611837b13e91d30233a4cf7d8d391`.
Le SHA-256 des données de planification est
`7d277f3dc8f43f6b4357b32c7442e69c5fa56368631b9c8b53cf61d15e1dde0d`.

Ces contrôles couvrent le contenu, les dépendances et le format du fichier.
L’application Excel native n’a pas été exécutée ; les recettes de jeu en
navigateur restent des preuves distinctes dans la PR.
