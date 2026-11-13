# Lot science-fiction : quarante identités conservées

Le lot est réservé avant modification dans `reservation-040.json`, avec le commit et l’empreinte du backlog utilisé. Il comprend les 25 héros existants des trois univers et quinze adversaires déjà identifiés par leur clé de backlog : Halo 15, Half-Life 13, Mass Effect 12. Aucun ID, nom de roster ou adversaire supplémentaire n’est créé.

## Résultat et portée des clôtures

La correction fournit des contrats individuels d’incarnation, silhouette, équipement et référence. Le delta mesuré sur les mêmes sondes raster Git ferme 128 paires acteur/tâche P1 pour 39 acteurs : 38 incarnations manquantes, 39 contrats visuels manquants, 38 références manquantes et treize catalogues de techniques brutes génériques. Freeman disposait déjà de ces informations ; il ne compte pas comme une nouvelle clôture de ces tâches.

Ces chiffres décrivent les contrats de source et la cohérence du catalogue brut. Ils ne signifient pas 128 pouvoirs nouvellement implémentés : vingt-trois héros avaient déjà des actions effectives documentées dans les résolveurs. Leurs quatre objets d’action sont désormais exposés correctement dans le catalogue, avec types, effets, ciblage et paramètres réels. Les kits effectifs correspondants restent identiques.

La présence des 38 nouvelles références fait également apparaître **38 tâches P2 ouvertes `REFERENCE_SCENE_REVIEW`**. Aucune tâche P2 n’est déclarée close. Les recherches de costumes, images absentes, planches statiques, animations, visages, mains FPS, kart et comparaisons visuelles individuelles restent à traiter. `artApproved` et `source1to1Verified` restent faux.

## Corrections de comportement bornées

- Le fragment de Cortana abandonne ses dégâts laser/de zone fictifs : ses commandes deviennent un soutien d’IA, avec buffs/protection, zéro multiplicateur de dégâts et cibles alliées/personnelles.
- L’entrée historique `buck` conserve son ID et adopte la même incarnation ODST 2009 que `buck_odst`, avec M7S, armure balistique et tir ciblé. Aucun renfort orbital ou corps de Spartan n’est inventé.
- Le Collector Drone ordinaire utilise le dispatch d’une arme à feu pour son fusil Collector ; il n’emprunte plus le Particle Beam lourd.
- Eli et Kleiner conservent leurs actions non offensives. Deux corrections coordonnées par le parent dans les overrides communs remplacent la famille de rendu arbitraire `tablet` par `terminal`. Ce champ ne certifie ni une console transportable ni une animation de prop en main ; le contrat décrit les scientifiques et leur laboratoire.

Les familles communes `gun` de Garrus, Tali et Wrex sont conservées pour compatibilité du rendu ; leurs armes de source sont précisées dans `equipment` et le contrat. Le M-92 Mantis de Garrus est documenté. Les modèles individuels des shotguns de Tali et Wrex restent des questions d’illustration/modèle ouvertes ; aucune certitude supplémentaire n’est déduite de la seule famille d’arme.

Les contraintes de classes sont conservées : Shepard est le Soldier de ME2, avec Adrenaline Rush personnelle et Concussive Shot ordinaire ; Garrus conserve son Overload technique ; Liara porte le M-3 Predator de son DLC ME2 et utilise Warp/Singularity ; Wrex conserve sa Barrier personnelle de ME1 ; le drone de Tali n’est pas transformé en explosion collective. Alyx HL2 n’emprunte pas les Gravity Gloves de 2020. Cortana, Eli et Kleiner ne reçoivent pas de tir magique.

## Préparation de combat et partenaires

La revue indépendante a détecté une régression d’Arbiter que la première validation des profils non préparés ne couvrait pas. Le renommage brut empêchait la préparation de la signature historique. Une déclaration de sept champs est maintenant liée à son identité, univers, incarnation et révision exacts ; le propriétaire du fichier partagé ajoute la compatibilité bornée. Les quatre anciennes propriétés de `special` restent conservées, sauf le libellé courant. La signature préparée complète et son profil RPG sont comparés à l’ancien clone ; les acteurs étrangers et actions personnalisées doivent être refusés.

Les identités de partenaires et leurs planches livrées ne sont pas remplacées. Cela ne ferme aucune obligation de fidélité des invocations. Le cas **Wrex ME1 → Shepard Soldier ME2** est explicitement ouvert : l’association existante nécessite une décision de version séparée. La fixation des métadonnées rend ce manque visible ; elle n’autorise pas à fusionner les éditions ou transférer les classes.

## Références et preuves

Les références déjà livrées sont réutilisées : catalogues d’actions des vagues 9/10/14/15, dossiers `docs/combat-fidelity-wave9-2026-10-22/part-b-source-facts.json` et `docs/combat-fidelity-wave10-2026-10-23/part-b-source-facts.json`, définitions de source, pages Halopedia/Combine OverWiki et sources Valve indiquées par les contrats. Aucune nouvelle consultation externe ni approbation artistique n’est revendiquée.

`source-task-delta-040.json` conserve les changements individuels de corps/équipement, actions brutes, tâches closes et restantes, invocations actuelles et empreintes source. `closed-source-task-pairs-040.json` fournit les paires exactes à réconcilier. Les sondes raster sont celles du backlog gelé, sans confondre checkout sparse et fichier Git absent.

La première validation et la première préparation restent archivées. Les tests existants W14/W15 gardent leurs deux échecs historiques de catalogue brut dans `existing-wave14-wave15.tap` : Ardyn du lot FF et Shephard de ce lot. Leurs assertions effectives passent ; l’acceptation d’une nouvelle édition de catalogue doit être ajoutée explicitement par le propriétaire des fixtures, avec ses identités et contrats exacts. Aucune assertion historique n’a été supprimée ici.

Les vérifications de ce lot sont des imports et résolveurs de production en Node pur, sans SSR/Vite, parcours navigateur, rendu de sprites ou nouveau média. Les neuf modules DLC et le test ciblé sont les seuls fichiers de code possédés par ce lot ; les exceptions partagées `heroes.js` et `signatureSourceKits.js` sont coordonnées avec leurs propriétaires.

La validation finale ciblée passe **71/71 tests**, sans échec ni test ignoré, en 2,571 s sous Node 22 avec une limite de heap de 2 Go. Elle couvre notamment les 25 préparations locales de combat, l’égalité profonde de la signature préparée d’Arbiter et le refus des identités, déclarations ou actions personnalisées altérées. L’ajout d’un `targeting` personnalisé à Arbiter a d’abord révélé un défaut de garde ; l’alias exige désormais exactement les quatre propriétés propres attendues. L’ancien chemin de nom historique reste accepté.

La revue isolée indépendante conserve les comparaisons des quarante identités contre Git `5952…` avec les overlays explicitement recensés. Elle confirme les 128 retraits P1, les 38 ajouts P2, sept kits préparés strictement identiques et 23 héros/92 slots effectifs préparés inchangés ; les deux corrections de héros sont examinées séparément. Le reçu principal est `../audit/scifi-final-independent-review.json`. La validation propre à ce lot et ses empreintes finales sont dans `validation-final.json` et `.tap`.
