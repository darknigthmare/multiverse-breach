# Missions statiques : corrections de fidélité du 1er octobre 2026

Quatre missions mélangeaient un lieu et des adversaires appartenant à des périodes ou œuvres différentes. Leur identité de sauvegarde, mode, difficulté et récompenses restent inchangés. Les scènes sélectionnées correspondent maintenant à des confrontations documentées et utilisent uniquement les ennemis déjà présents dans le jeu ; aucun boss de substitution n'a été inventé.

| ID | Ancienne association incohérente | Source et confrontation retenues | Roster effectivement résolu |
| --- | --- | --- | --- |
| 1 | Aspho Fields, guerre du Pendule, avec Locust/Brumak | **Gears of War (2006)** : train de la bombe Lightmass et General RAAM | Locust Drone, Theron Guard, General RAAM |
| 2 | Installation 04 de **Halo CE** avec un Scarab de jeu ultérieur | **Halo 2 (2004)** : Metropolis, New Mombasa, abordage du Scarab **Protos** | Covenant Grunt, Jackal Sniper, Elite Minor, Covenant Scarab Mech |
| 3 | Ruche LV-426 de **Aliens (1986)** avec un Predalien de **AVP: Requiem (2007)** | **Aliens (1986)** : ruche du processeur atmosphérique de Hadley's Hope et Reine Alien | Warrior Xenomorph, Skittering Facehugger, Egg Chamber Sac, Alien Queen |
| 10 | Laboratoire Anomalous Materials de **Half-Life (1998)** avec un Strider Combine de **Half-Life 2** | **Half-Life (1998)** : chambre du Nihilanth sur Xen | Vortigaunt Shock Trooper, Alien Nihilanth Core |

Les clés historiques des univers, les noms des templates et leurs chemins de sprites sont conservés. Pour l'ID 3, la clé `Alien` est maintenue pour les sauvegardes et sprites, tandis que l'incarnation indique explicitement `Aliens (1986)`. Les rosters exclusifs empêchent les boss mondiaux d'un autre épisode de revenir dans ces combats.

Les fiches des quatre adversaires sont aussi verrouillées sur leur source. RAAM utilise le tir de sa Troika et conserve sa technique Kryll ; la Reine de 1986 utilise son attaque de mâchoire interne plutôt que le crachat acide ajouté par l'ancienne fiche. Le Scarab est explicitement un Protos de Halo 2, et Nihilanth n'est plus présenté comme un noyau Combine.

Les objectifs sont vérifiés dans les moteurs. Le RPG atteint la vague RAAM et attend sa défaite. Le champ tactique Metropolis exige un seul commandant vaincu, le Scarab. Les deux arènes Smash dédiées au processeur de Hadley et à Xen progressent jusqu'à la Reine ou Nihilanth et attendent leur défaite. Ni l'élimination des soldats ni l'attente ne permettent de contourner ces boss.

Cette correction verrouille les **personnages, époque, lieu, roster et objectif de combat**. Elle ne certifie pas une reproduction 1:1 de tous les systèmes originaux. Les adaptations et manques suivants restent indiqués directement dans les données et doivent être repris lors des prochains travaux :

- **RAAM** : immunité procurée par les Kryll, zones éclairées et combat à couvert du jeu original ; les vagues RPG condensent la séquence du train.
- **Scarab** : l'objectif de commandant représente la neutralisation du véhicule et de son équipage par abordage. La carte tactique ne reproduit pas tout le trajet urbain de Metropolis et n'utilise pas le réacteur arrière de Halo 3.
- **Reine Alien** : sauvetage de Newt et fuite du processeur, puis combat distinct dans le Sulaco avec le Power Loader. Le combat de boss actuel dans la ruche est une adaptation, pas le déroulement du film.
- **Nihilanth** : destruction des trois cristaux, salles de téléportation, invocations des Alien Controllers et phase de vulnérabilité du cerveau ; le duel actuel repose encore sur les PV.

Les quatre scènes et leurs sprites restent `visualReviewStatus: pending`. Les anciens bitmaps et preuves de génération n'ont pas été modifiés par cette correction. Le générateur des dossiers doit actualiser leurs prompts et remettre en attente les vignettes historiques qui représentent les anciens lieux ou adversaires ; une présence de fichier n'est jamais une validation de fidélité.

Références consultées le 1er octobre 2026 :

- [Gears of War: Reloaded, Microsoft/The Coalition](https://www.gearsofwar.com/en-us/games/gears-reloaded/) : confirmation de la campagne du jeu original ; [Gears of War (2006), synopsis référencé](https://en.wikipedia.org/wiki/Gears_of_War_(video_game)) : train Lightmass et combat final contre RAAM. La seconde référence décrit la scène précise.
- [Halo: The Master Chief Collection, Halo Waypoint](https://www.halowaypoint.com/halo-the-master-chief-collection) : collection officielle ; [Metropolis](https://www.halopedia.org/Metropolis) et [Protos-pattern Scarab](https://www.halopedia.org/Protos-pattern_Scarab) : transcription, lieu, abordage, modèle et armement.
- [Aliens, 20th Century Studios](https://www.20thcenturystudios.com/movies/aliens) : identification officielle du film ; [Aliens, synopsis référencé](https://en.wikipedia.org/wiki/Aliens_(film)) : LV-426, processeur, ruche et confrontation distincte à bord du Sulaco.
- [Half-Life, Valve](https://store.steampowered.com/app/70/HalfLife/) : jeu original ; [Nihilanth](https://combineoverwiki.net/wiki/Nihilanth) et [déroulement de Half-Life](https://combineoverwiki.net/wiki/Half-Life_storyline) : chambre de Xen, cristaux, attaques, invocations et faiblesse du cerveau.

Validation locale : `node --test scripts/canonPriorityCorrections.test.mjs` : **14 tests réussis**, dont sept nouveaux tests sur ces quatre missions. Les tests invoquent les véritables résolveurs et moteurs RPG/Tactics/Smash, et vérifient aussi les 39 IDs statiques ainsi que les récompenses historiques. Le lint ciblé `oxlint` et la vérification du diff ont réussi.
