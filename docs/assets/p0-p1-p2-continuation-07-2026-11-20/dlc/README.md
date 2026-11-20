# Deux tranches pour l’assemblage Doom

Doom atteint **152 lots sur 317** et **4 808 médias sur 7 693**. Les deux tranches ajoutent **28 lots et 514 médias décodés**, soit 849 076 491 octets dans le dossier d’assemblage. [Reçu, empreintes et lots restants](coverage.json)

| Tranche | Lots | Nouveaux médias | Octets LFS transférés | Octets assemblés |
| --- | ---: | ---: | ---: | ---: |
| Reprise à 124 lots | 16 | 294 | 361 193 133 | 480 138 791 |
| Reprise à 140 lots | 12 | 220 | 285 652 452 | 368 937 700 |

Les lots ont été choisis selon le volume LFS à récupérer. Deux exports ont pu fonctionner en parallèle, avec une seule application à la fois. Le journal et les médias occupent un seul dossier dans `/tmp/mvb-pass06-doom/assembly`. Le reçu à 140 lots est identifié par son SHA-256 dans le rapport. [Plan et reçu initial](../../p0-p1-p2-continuation-06-2026-11-20/dlc/README.md) · [Reçu de couverture](coverage.json)

Un arrêt contrôlé a laissé l’assemblage à **134 lots**. La reprise a confirmé les dix nouveaux reçus posés et poursuivi avec les six lots restants de la première tranche. Le contrôle indépendant final a recalculé les empreintes des **4 808 fichiers** et relu les **152 reçus** du journal. Les **84 tests DLC** passent avec Node 22.23.5. [Preuves de reprise et résultats de tests](coverage.json)

Il reste **165 lots et 2 885 fichiers** à assembler, pour 5 350 406 045 octets. Le contrôle strict de couverture et l’export de la distribution complète ont refusé la sortie tant que ces lots manquent. Les vérifications portent sur les octets et le décodage des images. [Contrôle strict](coverage.json)
