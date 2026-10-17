# Signatures — vague 2, 17 octobre 2026

Base : PR #2, `b619e30f1182273f000b850dc8888d31022a3541`. Ce lot ne fusionne pas la PR et ne modifie aucune sauvegarde, configuration serveur ou image.

## 49 associations explicites : 19 héros et 30 entrées ennemies/boss

- Star Wars (22) : trois incarnations d’Ahsoka, Aayla, deux Obi-Wan, Yoda, Maul, deux Leia ; trois entrées Stormtrooper, deux Droideka, Tusken, Inquisiteur, deux Maul, Dooku, Sidious et Vader. Sabres, tirs personnels et éclairs ; aucun appui orbital ou nouveau pouvoir accordé à toute une franchise.
- Hexen (8) : Quietus pour Baratus/Zedek, Wraithverge pour Parias/Traductus, Bloodscourge pour Daedolon/Menelkir, masse de l’Ettin, missiles du Dark Bishop. Wraithverge a quatre contacts de spectres ; Bloodscourge trois projectiles ; Quietus cinq contacts de feu répartis. Ce sont des budgets d’impacts adaptés, pas des acteurs invoqués autonomes.
- Quake (5) : Thunderbolt de Ranger (Quake 1996), BFG10K de Bitterman (Quake II), grenade de l’Ogre, attaque rapprochée du Berserker, railgun du Gladiator. L’identité de catalogue et la continuité requise sont vérifiées ; pas de mouvement du remake ajouté à la version 1997.
- Team Fortress 2 (7) : Scout/Robot Scout au scattergun, Soldier/Robot Soldier/Sergeant Crits aux roquettes, Robot Heavy à la mitrailleuse et Giant Demoman aux grenades. Le nom Sergeant Crits n’octroie pas un multiplicateur critique supplémentaire. Le Medic et sa véritable mécanique de soutien ne deviennent pas une attaque de dégâts.
- Half-Life (5) : Vortigaunt allié, soldat Overwatch, Hunter, Gunship et Strider lourd. Décharge, rafale, fléchettes, canon et canon à distorsion. Pas de simulation complète de projectile collant, visée aérienne ou interaction physique de Dog.
- Doom (2) : fusil plasma du Marine classique et mitrailleuse du Spider Mastermind Core, sans leur attribuer des armes d’Eternal.

Les références primaires sont conservées dans `signatureSourceWave2.js` : Databank officiel Star Wars, SDK Valve et Source, code original id Software, implémentation Hexen de Raven maintenue par Chocolate Doom. Elles étayent des armes et familles d’attaque, pas les noms descriptifs de combos ni leur fidélité graphique.

## Runtime et interface

La zone trop proche du railgun du Gladiator est filtrée AVANT le tri des cibles ; un adversaire proche invalide ne cache donc pas un adversaire valable plus loin. Le contrôle est refait à chaque contact. Une cible devenue trop proche est manquée, sans transfert à une autre. La valeur de 42 pixels est un réglage Nexus, pas l’unité spatiale du jeu source. Le RPG conserve son ciblage abstrait et ne reçoit pas cette contrainte spatiale.

Une fiche dans le ciblage RPG montre l’action effectivement préparée, son univers, sa continuité, l’invocation associée le cas échéant, sa référence et son coût. La consulter ne consomme ni ATB ni jauge. Le soin conserve l’aperçu natif de PV récupérables. Cette fiche n’est pas encore une réécriture de tout le codex statique du hub.

Les 39 profils précédents, actions personnalisées, non-combattants, verrous des boss et capacités déjà écrites à la main sont conservés. Aucune modification du catalogue partagé : la préparation reste locale au combat.

## Vérifications

Le lot ajoute 196 sous-tests de profils (49 identités × deux moteurs × deux côtés) et dix tests supplémentaires de contrat/sécurité. La suite d’extension locale compte 373 succès et les tests vague 2 dix succès : **383/383**, sans ignorés. Cette copie locale est partielle et ne certifie pas l’ensemble du dépôt ou de ses bitmaps. Lint local : zéro erreur, zéro avertissement.

La CI permanente conserve les anciens scénarios et exécute les nouveaux tests. Le script navigateur source passe de huit à dix-huit recettes : dix ajouts utilisent de vrais GameCanvas/commandes et états initiaux synthétiques, en 390/1280 pixels, français/anglais. RPG/P2, invocation Hexen, Ahsoka adulte, Droideka, Gladiator, Scout et Gunship sont représentés. Les recettes inspectent aussi la nouvelle fiche avant confirmation. Les résultats du commit publié sont à lire dans ses artefacts GitHub ; ces recettes ne constituent pas un téléphone physique ni une campagne entière.

## Couverture mesurée localement, à recalculer en CI

4 936 entrées / 525 univers ; 88 profils source au lieu de 39 ; 118 supers profilés au lieu de 69 ; 26 invocations natives au lieu de 24 ; 31 associations d’artefacts inchangées ; 101 non-combattants préservés. **4 676 entrées sans signature dédiée**, contre 4 725. 159 entrées ont au moins un contrat ; les catégories se recoupent.

Zéro certification 1:1 : aucune nouvelle planche animée ou chorégraphie exacte n’est livrée. Les cases manquantes ne sont pas cachées par une règle générique. Les boss à énigme, transformations, boucliers particuliers et soins non implémentés restent des travaux distincts, pas des dégâts de zone de remplacement.
