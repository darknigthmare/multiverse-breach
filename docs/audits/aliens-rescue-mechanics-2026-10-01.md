# Aliens (1986) — sauvetage de Newt dans le processeur

Le stage historique **3**, ses récompenses **45 or / 15 éclats**, son casting exclusif et les statistiques de ses ennemis sont conservés. Son objectif joué devient **libérer Newt puis évacuer avec son porteur vivant**, au lieu de tuer la Reine dans sa ruche. Les illustrations existantes restent en attente de validation ; cette correction ne certifie aucune fidélité visuelle 1:1.

Les trois premières vagues existantes mènent au nid. À l'arrivée réelle de la Reine, un héros vivant doit rejoindre le repère **NEWT** et utiliser **Libérer Newt**. Newt accompagne ce porteur sans HP, acteur de combat ou cible attaquable. Le porteur doit ensuite rejoindre le repère **ÉVACUATION** et évacuer. Sa mort termine la mission en défaite, même si un autre héros atteint la sortie. La réussite laisse la Reine vivante.

Les attaques ordinaires et les effets externes peuvent diminuer les HP de la Reine, avec un minimum de 1 HP. Les dégâts externes fixes conservent exactement leur montant et n'absorbent un bouclier d'objet que sur demande. Le moteur empêche une victoire par élimination de la Reine ou par éjection Smash : une chute de la Reine la repositionne dans l'arène. La pause, le pré-match et les verrous d'action bloquent les interactions. Le combat automatique traverse les vagues et marche réellement jusqu'aux deux repères, sans téléportation ni changement des statistiques.

Les règles sont réservées à l'incarnation exacte du stage 3, mode Smash, nid du processeur, Reine canonique et casting exclusif. Les autres incarnations, modes, stages et combats personnalisés conservent leurs règles.

Dans ce contexte seulement, la copie de combat de **Ripley Aliens** utilise le **M41A**, le **M240**, **Hive Cover** et une **M41A Grenade**. La défense et le spécial power loader du Sulaco sont remplacés tout en conservant leurs paramètres numériques. Le M41A délivre un tir directionnel, le M240 un court jet de flammes et la grenade un projectile local ; les entrées Melee utilisent aussi ces profils. Les données originales du héros, les autres incarnations et les autres lieux conservent leurs équipements. Les distances, les limites de cibles et ces effets procéduraux restent des adaptations de combat.

## Sources et limites

- [20th Century Studios — Aliens](https://www.20thcenturystudios.com/movies/aliens) : source officielle pour l'identité du film de 1986, James Cameron et le casting. La fiche ne documente pas à elle seule les mécanismes détaillés du sauvetage.
- [Scénario de James Cameron hébergé par IMSDb](https://imsdb.com/scripts/Aliens.html) : scènes 173–185, libération de Newt, départ de la ruche, poursuite de la Reine et sortie du processeur ; le cargo lock du Sulaco et le power loader apparaissent ensuite. **Il s'agit d'un scénario comportant des différences avec le montage final.** Les drones albinos et le nombre exact de grenades décrits dans ce brouillon ne sont pas ajoutés au jeu.
- [Wikipedia — Aliens, Plot](https://en.wikipedia.org/wiki/Aliens_(film)) : source secondaire qui recoupe le sauvetage de Newt, l'évacuation du processeur et la confrontation ultérieure à bord du Sulaco.

Les positions, le rayon de 42 pixels, les plateformes 2D, les trois vagues préalables, l'interaction instantanée, la règle du porteur et les HP non létaux sont des adaptations de jeu. Une seule arène compresse le nid, les ascenseurs, les escaliers et la plateforme d'évacuation. La géométrie exacte du film, les ascenseurs chronométrés, l'incendie des œufs, la chorégraphie facehugger/warrior, la destruction complète du processeur et le duel power loader du Sulaco ne sont pas reproduits. Le correctif contextuel concerne Ripley Aliens ; ce changement ne valide pas tous les équipements génériques de chaque héros pour chaque lieu.

Le rapport JSON associé enregistre les URL et empreintes des références consultées, les empreintes du code et les limites. Aucun scénario intégral ni image de référence n'est ajouté au dépôt.

## Vérification

**24 nouveaux tests du moteur réel passent**, avec secours et évacuation manuels, distance, acteur valide, pause et pré-match, porteur perdu, Reine non létale, dégâts externes fixes et bouclier explicite, chute, absence d'enfant ciblable, affichage canvas, campagne automatique complète avec statistiques originales, isolation des autres scènes et finale Nihilanth par cristaux puis cerveau exposé. Trois cas vérifient aussi le contexte de l'équipement, l'absence de mutation des données même gelées, et la livraison réelle des tirs, flammes et grenades dans les deux pipelines d'action. **39 tests de régression** des objectifs Smash, profils canoniques, mouvements Melee et événements de stage passent. Oxlint ciblé et `git diff --check` passent.
