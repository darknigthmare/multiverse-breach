# Archives : scènes et adversaires verrouillés sur leur source

La vérification du navigateur a montré que la mission **Metropolis / Scarab** conservait un paragraphe « Installation 04 », et que la mission **RAAM** affichait le Brumak comme menace dans son texte. Deux secours de franchise causaient ces contradictions : le résolveur de boss privilégiait le world boss hors DLC original, et les descriptions remplaçaient le lieu de la mission par la signature générale de l’univers.

`canonicalArchiveLore.js` fournit six notices de scènes et seize notices d’adversaires, en français et en anglais. `loreDescriptions.js` les utilise avant les descriptions de franchise. Le résolveur `resolveStageArchiveBoss(stage, universeEnemies)` privilégie le nom explicite, puis son alias canon ; un adversaire explicite absent ne devient pas un autre world boss. Le Hub utilise ce résolveur pour les renseignements de mission.

| Stage | Source de la notice | Adversaires couverts |
| --- | --- | --- |
| 1 | Gears of War, 2006 — train de la bombe Lightmass | Locust Drone, Theron Guard, General RAAM |
| 2 | Halo 2, 2004 — Metropolis / New Mombasa | Covenant Grunt, Jackal Sniper, Elite Minor, Scarab Protos |
| 3 | Aliens, 1986 — processeur atmosphérique de Hadley’s Hope | Warrior Xenomorph, Facehugger, œuf, Reine |
| 10 | Half-Life, 1998 — chambre du Nihilanth sur Xen | Vortigaunt asservi, Nihilanth |
| 12 | Metal Gear Solid, 1998 — hangar de Shadow Moses | Genome Soldier, Metal Gear REX |
| 22 | Fallout: New Vegas, 2010 — camp du Légat, seconde bataille de Hoover Dam | Lanius |

Les notices distinguent le récit de la source et l’**Adaptation Breach**. La Reine n’est pas décrite comme définitivement vaincue au processeur : le sauvetage de Newt précède le duel au power loader du Sulaco. Le Scarab conserve l’abordage et la neutralisation de l’équipage de Halo 2. Lanius garde la possibilité de résolution par le dialogue du jeu original ; la mission Smash sélectionne le duel. Les données de combat et les chemins des sprites restent distincts de ces descriptions.

Les references des scènes déjà examinées dans [le rapport des quatre missions](static-mission-fidelity-followup-2026-10-01.md) et [la reprise initiale](project-corrections-2026-10-01.md) sont réutilisées. Les notices portent leurs URL de référence spécifiques : Halopedia pour les rangs et équipements Covenant, Combine OverWiki pour Vortigaunt/Nihilanth, le film officiel et le script pour Aliens, Konami pour Metal Gear Solid, et les encyclopédies dédiées pour RAAM, Theron, les Genome Soldiers et Lanius. L’enregistrement d’une URL dans une notice ne constitue pas une certification indépendante de tout son contenu ou des anciens bitmaps.

Un contrôle HTTP supplémentaire du [Sangheili Minor sur Halopedia](https://www.halopedia.org/Sangheili_Minor) confirme le défaut de couleur signalé au parent : la page décrit l’armure du rang Minor comme bleue et précise « The color scheme of Minors' armor was changed to sky blue in Halo 2 ». Réponse HTTP **200**, SHA-256 du HTML reçu : `c21e8aac86a9f453bcafe8d1704cadfd503ee937dbd6d0635bbacb2df96328ed`. Le parent a corrigé la couleur du fallback de combat de cet ennemi et ajouté son incarnation Halo 2 ; les PV, attaque et vitesse ne changent pas. Le sprite historique demeure à revoir.

Validation : **18 tests réussis** dans `scripts/canonicalArchiveLore.test.mjs`, dont chargement des véritables tables `ENEMIES_DB` / `LORE_DB` via Vite, résolution des six boss, descriptions des six scènes en deux langues malgré un renseignement générique contradictoire, couverture des seize ennemis, absence de substitution d’un boss manquant et refus d’appliquer une notice à une autre incarnation. Lint ciblé et contrôle du diff réussis.

La correction ne certifie aucun sprite 1:1 et n’ajoute aucune image. Les autres épisodes et ennemis des six franchises ne sont pas audités par ce lot : les notices héritées de Tartarus, du Didact, des Prométhéens, du Strider, de Liberty Prime et des autres variantes demandent encore une attribution de source individuelle. La signature de franchise et les mécanismes génériques de leurs archives restent inchangés hors des notices listées ici.
