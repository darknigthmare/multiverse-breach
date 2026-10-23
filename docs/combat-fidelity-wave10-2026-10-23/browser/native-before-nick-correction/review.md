Les deux parcours W10 du véritable renderer dans Chromium sont PASS. Ils chargent les URL compilées exactes de GameCanvas sur le serveur existant 5188, sans démarrer un autre serveur ni modifier la production.

| Preuve | Couverture observée | Conservation historique |
| --- | --- | --- |
| Présentations natives | 157 entrées : 155 atlas complets de 32 poses, Beast Boy partiel de 8 poses, Janine partielle de 24 poses ; 1 248 phases et 9 984 dessins P1/P2 | 117 anciennes entrées/PNG et 7 440 géométries identiques |
| Bases dédiées | 103 personnages : 39 nouveaux et 64 anciens ; 3 296 dessins des quatre états sur les deux côtés | 64 anciens PNG/metadata, 18 SHA de registres complets et 2 048 géométries conservés |
| Repli Beast Boy | 48 dessins de la vraie base gorille pour les six scènes humaines absentes |Les 24 dessins humains non retenus restent exclus |
| Réutilisation Janine | 16 dessins des super/finale absentes et 64 dessins des huit états ordinaires, depuis les cellules de présentation déclarées |Aucun PNG/base de 16 poses/super/finale dédié ajouté aux compteurs |

Les 8 anciens manifestes sont identiques à la baseline parmi les 10 actuels. Les 15 anciennes invocations et leurs PNG sont conservés parmi les 23 actuelles. Les cellules source sont entières de 256 × 256 ; les baselines 244 et facteurs de rangée calibrés passent, tandis que les sept anciennes bases pré-W6 conservent leur géométrie historique 232. Les acteurs, le roster, les layouts et les registres restent non mutés. Les 9 984 sélections à progrès autoritaire figé restent identiques malgré une autre heure cosmétique ; cela vérifie le rendu figé, et non toute la pause de simulation.

Quarante captures de présentations,39 de bases et la capture de réutilisation de Janine sont conservées. Les 16 planches réunissant les deux camps ont été inspectées : les silhouettes Matrix/SG-1, Half-Life/Fallout, Aliens/Payday et Ghostbusters/Left4Dead restent distinctes, avec corps/armes/équipements entiers et miroirs P2. Dogmeat reste quadrupède et Ripley montre un véritable Power Loader ; les soutiens utilisent des gestes d’observation, d’outil ou de radio. Janine ne reçoit pas de pose de tir ou de fausse planche de 32 poses.

L’essai initial bases s’est arrêté sur une mauvaise hypothèse du harness : la baseline contient une projection des entrées, comparée à tort aux objets complets. Cet essai et son explication sont archivés dans `base-attempt-1/`. Le harness compare maintenant exactement les champs figés, les 18 SHA des fichiers complets et les vrais appels de dessin. Aucune donnée de production n’a été changée pour résoudre cet arrêt.

La revue indépendante des ancres a aussi trouvé sept coordonnées A sur une frange transparente ou hors du canon. Elles ont été remesurées sur les cellules finales dans la fenêtre coordonnée ; la table, les mesures, la provenance et le builder sont corrigés. Les 22 points actifs ont un centre alpha > 24 et au moins 8 pixels visibles dans leur voisinage 9 × 9. Les 20 PNG du lot A et les deux registres de corps n’ont pas changé. Les traces de corps restent celles du gel précédent cette correction ; elles ne constituent pas un nouveau parcours des correctifs moteur appliqués par la racine dans cette fenêtre.

Les seules requêtes en échec concernent Google Fonts (`ERR_TUNNEL_CONNECTION_FAILED`). Aucun module ou sprite local n’échoue. Les anciens rapports W9 ont été lus uniquement ; leurs SHA correspondent à l’évidence W9 figée. Le lint ciblé des trois scripts navigateur est PASS.

Les bases de 16 poses fournissent quatre états généraux et ne certifient pas chaque capacité. Seuls Neo et Freeman reçoivent 45 états dédiés dans cette vague ; le changement P90→zat d’O’Neill reste sans animation propre. Les manques/refus historiques et ceux de Janine sont conservés explicitement. Aucune fidélité visuelle ou animation officielle 1:1 n’est certifiée.

[Preuves et SHA](./evidence.json) · [Résultats natifs](./native-presentations.json) · [Résultats bases](./base-corrections.json) · [Source de réutilisation Janine](./janine-base-reuse.png)
