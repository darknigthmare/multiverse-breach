# Reprise P0, P1 et P2 du 20 novembre 2026 — passe 08

Cette passe traite un nouveau lot de 40 adversaires RPG, les animations de trois boss, l’escorte du khipu, les tirs sur les grandes unités, deux planches retrouvées et la navigation du registre DLC. Les scènes du Narcissus et de *Predators* réemploient leurs ressources existantes. Le témoin est un personnage original de la campagne. [Révision du code et écart de l’audit](actor-task-delta.json)

| Domaine | Résultat vérifié |
| --- | --- |
| RPG | 40 nouveaux secondaires en huit univers originaux, soit 80 acteurs sur les deux lots. Le navigateur vérifie le renfort de l’Oni et le Glitch de la Gorgone. [Commandes et mesures](roster/README.md) |
| Tactics | Le témoin du khipu utilise sa planche de 16 poses jusqu’à l’extraction. Les coups bloquants respectent l’ensemble des cases d’un boss 2×2. [Escorte](witness/README.md) · [Ligne de vue](tactics/README.md) |
| Mêlée et animations | Les Twelve Bell Judges, Lord Pneuma et Vaelgor animent leur propre planche contre J2 ou le CPU en combat custom. L’Atelier de l’Astrarium applique immédiatement la préférence de mouvement. [Scènes et tests](motion/README.md) |
| Médias d’acteurs | Le Narcissus dessine la planche existante de Kane’s Son. Le module *Predators* contient les octets du Falconer Drone de 2010 et les sert dans l’édition dédiée. [Planches et captures](media/README.md) |
| Menus | La pagination du registre DLC conserve la recherche et le filtre et place le focus sur la première fiche accessible. [Parcours et capture](menus/README.md) |
| Doom | 20 lots ajoutent 365 médias décodés. Le plan historique atteint 172 lots sur 317 et 5 173 médias sur 7 693. Il reste 145 lots, soit 4,73 Go. [Assemblage et contrôle strict](dlc/README.md) |

L’audit de 4 937 acteurs retire **trois P1**. L’incarnation de Big Chap Stalker et celle du Falconer Drone sont renseignées et le raster du Falconer est retrouvé. Le suivi conserve **22 P0 historiques, 16 347 P1 et 13 582 P2**. Les validations ciblées des planches et des mécaniques laissent ouverte la revue exhaustive de fidélité visuelle et des autres moteurs. [Écart entrée par entrée](actor-task-delta.json)

Les suites comptent **322 tests Tactics**, **582 tests d’interface**, **261 contrats de source** et **21 tests ciblés de médias et d’animation** sans échec. Les profils complet, base, Mass Effect seul et Predators seul passent la compilation du code et la vérification de leurs modules. L’export complet Doom attend le reste de ses médias. [Suites et reçus](validation/tests.json) · [Profils compilés](validation/bundles.json)

L’ancienne sortie locale `dist` de `66f86917` a été déplacée pour libérer l’espace du checkout. `dist` pointe vers la copie de travail et `.tmp/dist-66f86917.tar.gz` en conserve les 57 fichiers. Les empreintes de ces fichiers ont été comparées après le déplacement et dans l’archive.
