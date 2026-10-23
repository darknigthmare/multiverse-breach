# Combat et animations — vague 5, 20 octobre 2026

**724 nouvelles poses utilisées dans 25 PNG, et 24 mécanismes de décor supplémentaires.** Compilation complète vérifiée : **1 024 tests réussis dans 17 groupes**, lint sans avertissement et diff propre. Les **111 PNG gérés** sont présents dans `dist`, comparés octet par octet aux sources puis chargés depuis la prévisualisation de production sans erreur JavaScript.

| Ajout de cette vague | Poses utilisées | PNG |
| --- | ---: | ---: |
| Présentations et supers de 15 personnages : huit phases de quatre poses | 480 | 15 |
| Manifeste Mêlée de Vegeta adulte DBZ : 45 états de quatre poses | 180 | 6 |
| Invocation Ifrit de FFVII (1997) : arrivée, préparation, Hellfire, retrait | 16 | 1 |
| Bases corrigées de Leon, Sol Badguy et Ky Kiske : quatre états de quatre poses | 48 | 3 |
| **Total ajouté** | **724** | **25** |

Les quinze personnages sont Master Chief, l’Arbiter, Johnson, Doom Slayer, le Marine de Doom classique, Sol Badguy, Ky Kiske, Boruto, Sarada, Mitsuki, Leon, Jill, Rebecca Chambers, Mirelle Suture et Bastion Korr. Les huit phases sont l’introduction, la sortie, la victoire et la défaite de manche, la finale, la victoire, la défaite et le super. Les finales restent des mises en scène adaptées, sans violence graphique ajoutée.

Vegeta conserve sa tenue adulte DBZ aux cheveux noirs et au haut bleu sans plastron. Le Galick Gun violet et le Final Flash jaune ont des préparations distinctes ; les prises de corniche disposent de repères mesurés sur les gants dessinés. Les nouvelles bases accordent Leon à sa version agent de RE4 (2005), Sol et Ky à leurs tenues Strive et à leurs armes respectives. Les anciennes branches Mêlée et Tactique n’ajoutent plus arbitrairement une infection aux tirs de Leon ; les statuts explicitement portés par une capacité restent distincts.

| Couverture cumulée sur 1 911 personnages et 525 univers | Livré | Manque restant |
| --- | ---: | ---: |
| Atlas dédiés aux huit phases de présentation et de super | 50 personnages, 1 600 poses | 1 861 personnages |
| Manifeste Mêlée illustré complet de 45 états | 4 personnages : Cloud, Tifa, Goku, Vegeta | 1 907 personnages |
| Bases corrigées | 7 personnages, 112 poses | Ce compteur ne mesure pas les manifestes complets |
| Mécanismes ciblés de décor | 113 mécanismes pour 60 univers | 465 univers ont seulement l’ambiance de base |
| Ambiances de base configurées | 525 univers | 0 univers |

Les décors ajoutent deux mécanismes dans chacun de douze univers : The Lord of the Rings, Harry Potter, Fallout, Ghostbusters, Tomb Raider, Oddworld, Legacy of Kain, The Thing, Evil Dead, The Mummy, Fullmetal Alchemist et MediEvil. Chaque définition choisit une scène et une version précises, avec exclusions de continuité. Les 60 univers sont couverts dans au moins un mode ; 56 le sont dans les quatre modes. Les animations suivent le temps de simulation, respectent pause et mouvement réduit, et ne changent aucun PV, aucune collision ni aucun danger.

**La fidélité visuelle 1:1 n’est pas certifiée.** Les nouvelles poses sont des illustrations natives générées puis découpées et normalisées ; les mécanismes sont des géométries et des mouvements créés pour le projet. Les sources ne constituent pas des frames officielles reproduites. Les timings, dimensions et chorégraphies restent des adaptations. Les identifiants de modèle, génération ou tâche non fournis sont laissés à `null`.

Les anciennes sources sont conservées sans réécriture. Les nouvelles générations, références, prompts exacts, corrections retenues ou rejetées et SHA sont archivés séparément. Les 89 anciennes définitions de décor et leurs 178 empreintes de commandes de dessin sont inchangées ; ces empreintes ne prétendent pas comparer les pixels d’assets officiels.

- [Provenance du lot A](part-a-provenance.json), [lot B](part-b-provenance.json), [lot C](part-c-provenance.json) ; [faits et limites du lot B](part-b-source-facts.json) et [du lot C](part-c-source-facts.json).
- [Vegeta : mouvements](vegeta-sources/provenance-motion.json), [combat et corniche](vegeta-sources/provenance-combat.json), [archives des sources](vegeta-sources/source-archive-manifest.json) et [revue technique](vegeta-sources/technical-review.json).
- [Ifrit](ifrit-provenance.json) et [bases Leon, Sol, Ky](base-provenance.json).
- [Couverture des 525 univers](stage-coverage.md), [données détaillées](stage-coverage.json), [sources réellement consultées et limites](stage-source-checks.json), [référence historique des dessins](stage-baseline.json).
- [État initial global](baseline.json) et [état initial des runtimes](runtime-baseline.json).

Les vérifications ciblées des décors sont terminées : **15 tests réussis**, lint sans avertissement et Chromium sur les 24 mécanismes avec 72 formats supplémentaires. Elles contrôlent notamment coordonnées, géométries distinctes, temps de simulation, pause, mouvement réduit, miroirs, découpe et absence de mutation du stage. [La preuve navigateur](stage-browser.json) et [la planche de contrôle](stage-browser.png) sont conservées. Les projectiles de Boruto et Leon suivent maintenant leur position et leur collision réelles dans le mode Combat. Dix régressions ciblées et quatre parcours clavier J1/J2 vérifient charge, vol, invisibilité de Boruto, pause et impact unique. Le préchargement des présentations évite aussi que la préparation Galick Gun apparaisse brièvement avant Final Flash au premier lancement.

Les grandes armes et les effets avaient réduit la stature de14 personnages dans28 rangées finale/super. Des mesures visuelles du corps et des ratios entre poses natives corrigent cette échelle au rendu autour de la ligne de base244, avec conservation des flexions. Aucun PNG n’a été modifié par cette correction ; Rebecca conserve son agenouillement médical. Les35 anciens atlas gardent leur échelle exacte. Les ROI sont des mesures visuelles documentées, sans segmentation anatomique certifiée ; de petits écarts natifs de reprise peuvent encore rester au-dessus du pivot.

Ifrit dispose d’un nouvel atlas16 poses, sélectionné sur les ticks de la scène existante avec contact sur impactTick. Les28 atlas historiques d’entité à quatre poses restent conservés, ainsi que les82 profils qui les appellent. Les16 poses nouvelles ne sont pas additionnées à l’ancien atlas pour prétendre constituer une séquence de20 poses.

- [Mesures courantes](current.md), [JSON reproductible](current.json) et [inventaire des1911 personnages](character-coverage.csv).
- [Validation globale et fichiers distribués](validation.json), [journal de compilation](build.log), [contrôles navigateur](browser-checks.json).
- [Vegeta en jeu](browser/vegeta-evidence.json), [RPG/Combat](browser/regression-readme.md), [projectiles réels](browser/fighter-projectile-result.json), [stature au rendu](browser/stature.png).
- [Mesures de stature A](part-a-stature-review.json), [revue indépendante B/C](presentation-stature-bc-review.json), [mesures B](part-b-stature-review.json), [mesures C](part-c-stature-review.json).

L’audit des références a été recalculé sur1912 images après les trois nouvelles bases. Son premier passage a signalé une attente de contrôle encore liée à l’ancien chemin Leon ; les trois nouvelles références sont désormais exigées comme images détaillées avec les mêmes seuils de qualité. Le [diagnostic initial](reference-quality-initial-legacy-path.log) et le [recalcul réussi](reference-quality-refresh.log) sont conservés. Le test historique de soutien exige maintenant la vraie présentation médicale de Rebecca et garde un scénario sans atlas pour vérifier le repli sans attaque.

La validation globale conserve les86 PNG historiques et leurs SHA, les35 anciens atlas natifs, les trois manifestes complets antérieurs et les51 recettes de présentation. Les contrôles navigateur couvrent3200 sélections natives, les45 états Vegeta, la pause, Final Flash, Ifrit à 16 poses et le déroulement Combat en deux manches. Le seul échec réseau attendu concerne la police Google Fonts bloquée par le proxy. La compilation conserve son avertissement de taille de certains chunks, déjà présent auparavant.
