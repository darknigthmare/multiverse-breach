# R4 — Sulaco, Narcissus et Blast Pit jouables dans Tactics

## Livraison réelle

Code publié : `4c8f4b7f220a7808e7b849357deaf5771057344f`, parent `f6fe60f8742cb17772af8a9b4a228d24e7abc899`, arbre `5d42ff842d4ffe5fda1d95f16fb0fe41786f0821`.

Les seize fichiers de code/tests correspondent octet par octet aux fichiers locaux testés. La publication conserve l'arbre complet du parent et les travaux R1–R3. Les fichiers de préparation ne font partie ni du diff ni de l'ascendance de cette livraison. Aucune sauvegarde utilisateur, aucun compte ni aucune production n'est modifié.

Trois stages ajoutés, sans remplacer les 39 scènes statiques existantes. Le total projeté de la branche passe de 3 203 à 3 206 ID uniques. Aucun nouvel acteur du catalogue n'est créé. Les trois scènes sont intégrées au hub, au résolveur d'adversaires, au moteur tactique et au panneau React de commandes.

## 50101 — Sulaco : sas du hangar, Aliens (1986)

Ripley Aliens est requise ; les équipiers restent hors scène. Le sauvetage de Newt dans le processeur, mission 3, reste un préalable. Séquence native : rejoindre et sangler le chargeur, saisir la Reine, l'amener au sas, ouvrir la trappe intérieure, se dégager, ouvrir le sas extérieur, remonter et refermer.

Sept commandes, cellules de danger annoncées, limite adaptée de 32 tours. La Reine n'est pas un sac de PV à éliminer ; Newt et Bishop sont des repères protégés. Le hangar ne reprend plus le décor de la ruche de LV-426.

**Reste à faire :** géométrie et proportions exactes du hangar, nouveaux sprites du chargeur et des protagonistes, animation du duel, cinématique, décompression physique et interaction réelle de Bishop/Newt. Les opérations du sas sont condensées en commandes de grille. Ce n'est pas la chorégraphie exacte du film.

## 50102 — Narcissus : dernière fuite, Alien (1979)

Ripley 1979 seule. Huit commandes : combinaison, lance-grappin, harnais, purge, sas, grappin, fermeture et propulseurs. Une fois attachée, elle ne peut plus se déplacer mais conserve l'accès aux commandes du siège. Jones est déjà à l'abri. Ni Reine ni fusil à impulsions ; aucune victoire par élimination ordinaire.

Limite adaptée de 24 tours ; cabine, casier, siège, sas et refuge distingués dans le dessin procédural.

**Reste à faire :** combinaison animée dédiée, architecture exacte, poses et animation du harpon, éclairage et cadrage film. Le scénario de tournage de juin 1978 comporte des différences avec le film terminé ; il ne certifie pas chaque détail de cette reconstruction.

## 50103 — Blast Pit : silo d'essai, Half-Life (1998)

Freeman seul. Oxygène, carburant et alimentation peuvent être rétablis dans plusieurs ordres ; ensuite protection du poste, mise à feu puis passage libéré. Trois tentacules procéduraux restent une menace environnementale, sans armée Combine ni PV de boss générique.

Six commandes de progression et une diversion répétable, limitée à trois grenades de mission. Chaque diversion change les cases menacées pendant deux fins de tour. Limite adaptée de 48 tours.

**Reste à faire :** IA acoustique complète, traversée et verticalité de l'ensemble du chapitre, modèle/animation GoldSrc, rendu du moteur et de la combustion. Le sprite existant de Freeman n'est pas certifié HEV Mark IV ; son équipement HL2 est bloqué dans cette mission, mais son sprite n'a pas été remplacé.

## Intégration commune

- Garde stricte par ID, univers, mode et incarnation. Les variantes custom, mode P2 personnalisé et arènes neutralisées ne reçoivent pas ce contrôleur.
- Un seul protagoniste canon requis, vérifié avant clonage. Aucune substitution accordée et aucune mutation du roster global ou de l'équipe sauvegardée.
- Menaces hors de la file de combattants : absence d'ennemis ne vaut pas victoire. Armes ordinaires, objets et événements crossover ne contournent pas les commandes de mission.
- Chaque commande valide consomme un tour natif, avec contrôle de la position, des prérequis et du token de tour. Doublons et événements périmés refusés.
- Identité, camp, génération de vie et incarnation revalidés. KO/résurrection, remplacement ou retrait rendent l'ancienne rencontre invalide.
- Pause et fermeture natives respectées ; aucune minuterie murale, aucun stockage supplémentaire. Déplacements soumis aux points de mouvement et aux obstacles existants.
- L'automatique utilise un vrai parcours de grille et les mêmes commandes que le joueur. Les dangers sont annoncés et résolus une fois par fin de tour via le répartiteur de dégâts natif.
- Panneau FR/EN avec boutons positionnels, étapes, budget de tours, raisons de refus et limites artistiques lisibles.

## Vérifications réalisées

**83/83 tests Node**, localement et sur [GitHub, run 40109876096](https://github.com/darknigthmare/multiverse-breach/actions/runs/40109876096). Zéro échec, annulé ou ignoré. Les 83 tests se recouvrent entre local et GitHub : ne pas les additionner en 166 tests distincts.

Le run GitHub prépare les sources exactes, vérifie les empreintes avant/après, exécute les 83 tests sans credential de publication dans leur environnement, puis publie les seize fichiers vérifiés. L'artefact `12566620534` a été téléchargé et vérifié : SHA-256 `d9c84d2c5c06aeb7ba4d5db9f37bef1ceb4122f9cd18b80e937f2bccf5f36db6`. Les seize blobs Git concordent avec les fichiers locaux.

**6/6 parcours Chromium locaux isolés** : trois missions en 1280×800 FR et 390×844 EN. Clics sur le vrai canvas, commandes DOM reliées au vrai EngineTactics, pause et victoire. Aucune erreur JavaScript observée et aucun débordement horizontal dans cette fixture. Sulaco 10 tours, Narcissus 9, Blast Pit 13 sur ces routes. Ce n'est ni l'application React complète ni un parcours de production ou un téléphone physique. Les PNG absents du snapshot utilisent les rendus de secours ; les captures ne valident pas l'art final. La recette de pointeur initiale a été corrigée pour employer `screenToGrid` et faire défiler le canvas avant les clics ; aucun changement du moteur pour faire passer la recette.

La syntaxe JSX des trois composants concernés a été vérifiée par transpilation. L'installation locale des dépendances a échoué faute d'accès DNS ; Vite et certains scripts non collectés manquent. Le groupe complet `test:reaudit` a donc échoué au chargement de ces dépendances : **aucun build Vite complet ni groupe global local réussi revendiqué**. Les checks standards de la tête de PR sont distincts du run spécifique ci-dessus.

## Excel et état des manquants

Les classeurs R4 complets sont livrés dans la conversation : audit 20 onglets, suivi combats 8 onglets. Les trois scènes sont ajoutées au catalogue, le nombre de stages est calculé et les priorités passent à **22 P0 / 3 564 P1 / 4 072 P2 / 484 P3**. Ces trois P1 ne constituent pas trois erreurs canoniques avérées : ils demandent une revue artistique.

| Fichier R4 | SHA-256 |
|---|---|
| Multiverse_Breach_Audit_Fidelite_1a1_Priorites_R4_2026-10-24.xlsx | 2f3221771257d8870e2739eaeb02d51780b36fa610810b5bf9e40238e0866ad8 |
| Multiverse_Breach_Suivi_Combats_RECONSTITUE_R4_2026-10-24.xlsx | 5f0432d25574dc986d33a800ea164a5d8d35d31dfec92a997492cb33356c424b |

**Les XLSX binaires de la PR restent R1.** Les évolutions R4 sont publiées ici en rapport, preuves et CSV, sans annoncer un remplacement binaire inexistant. Les 22 P0 visuels, les 1 477 rasters adverses manquants et les autres chantiers R3 ne sont pas clôturés. Aucun nouveau PNG, aucune note artistique inventée, aucune certification globale 1:1.

## Références

- Aliens : https://www.20thcenturystudios.com/movies/aliens
- Alien : https://www.20thcenturystudios.com/movies/alien
- Scénario de tournage Alien, juin 1978, à distinguer du film : https://www.dailyscript.com/scripts/alien_shooting.html
- Half-Life : https://www.half-life.com/en/halflife/25th
- Logique source des tentacules : https://github.com/ValveSoftware/halflife/blob/master/dlls/tentacle.cpp

Les distances, tours, positions, budgets et suites de commandes de ce portage sont des adaptations documentées ; aucun lien général n'est utilisé comme preuve d'une reproduction graphique exacte.
