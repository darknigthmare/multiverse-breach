# Bibliothèque des actes annexes OC

Le parcours ciblé est **Missions → Actes annexes → Bibliothèque**. Il reste distinct de la campagne principale et du panneau système des packs DLC.

Avant modification, `OcDlcLibrary` est un bloc inline dans `HubScreen.jsx`. Les trois actes ne justifient pas de pagination. Les textes secondaires sont fixés entre 8 et 11 pixels, les titres des missions sont tronqués et les actions principales viennent après toute la liste des missions. La branche documentaire des packs absents affichait déjà « non inclus » : la distinction des nouveaux filtres ne sera pas présentée comme la clôture d’un défaut d’installation reproduit.

Critères joueur :

- Les titres et raisons de verrouillage se lisent entièrement sur mobile et avec texte à 150 %.
- Les actes inclus actifs, inclus en réserve et non inclus restent distincts. Filtrer ou rechercher ne modifie pas la progression ni la visibilité.
- L’action de reprise et le placement en réserve sont accessibles avant les détails. Le détail des trois missions se déplie au clavier ; les contrôles gardent un focus visible.
- Les identifiants, l’ordre des missions, les prérequis, les récompenses et les callbacks du Hub restent la référence. Une mission verrouillée n’ouvre pas de briefing.
- L’état vide explique comment retrouver les actes et permet de réinitialiser la recherche sans perdre le focus.

Le guide `game-ui-ux` du dépôt est appliqué aux composants React existants. La fixture monte le vrai Hub et ses catalogues ; elle prépare seulement l’état parent avant le montage. Les captures et callbacks ne constituent pas un parcours de campagne ni une vérification des sauvegardes sur disque. Aucun résultat « AAA » ou artistique 1:1 n’en découle.
