# File de reprise par 40 — sources et activités

[actor-batches-40.json](actor-batches-40.json) conserve les **4 935 identités et
leur ordre exact** de la file historique : **124 lots, dont 123 de 40 et un
dernier de 15**. Les identifiants `actors-001` à `actors-124`, leurs statuts et
leurs membres ne changent pas. La priorité héritée est conservée ; aucun nouveau
classement n’est revendiqué. `riskOrder` et `riskReason` décrivent ce classement
historique. Les `openP1Codes` actualisés décrivent les tâches courantes.

La source de départ est
`docs/assets/p0-p1-continuation-2026-11-13/backlog/actor-batches-40.json`, commit
`daca0f002eaa94cf16b06d5ad366b0423ea294d2`. Les codes P1, incarnations et références
sont relus dans l’export courant, snapshot immuable
`de22d79e903b9995766e5a9628c3ec22198da561`. Cela actualise les codes de 62 acteurs
et les incarnations de 60 ; les références étaient déjà identiques. Les chemins
de raster et toutes les autres données restent conservés.

Les 22 priorités P0 historiques et les trois quarantaines de sprites Star Wars
restent ouvertes. Les cinq identités avec un refus enregistré dans la file
héritée gardent exactement leurs contrôles. Une preuve historique supplémentaire
concerne uniquement `jack_sparrow_potc`, Jack Sparrow du premier film **2003** :
[reçu CG01](../../../cg/reviews/wave3-2026-10-20/jack-sparrow-generation-attempts.json),
requête `73e8ffbe-83c1-42e8-bead-73905e33f31c`. Son prompt désigne explicitement
*The Curse of the Black Pearl (2003)*. Cet overlay documentaire fixe
`SOURCE_REVIEW_ONLY` et interdit le retry automatique pour cette identité exacte.
Il n’élargit pas la preuve aux incarnations des films suivants et ne constitue
pas une nouvelle tentative de génération. Il y a donc **six identités avec
contrôle de refus effectif**, dont les cinq héritées.

[actor-activities-40-progress.json](actor-activities-40-progress.json) distingue
deux activités effectuées en parallèle :

| Activité | Acteurs examinés | Résultat borné |
| --- | ---: | --- |
| Métadonnées de continuité | 40 | Déclarations existantes récupérées ; précision et revue visuelle toujours ouvertes. Le correctif général récupère 60 déclarations et garde deux cibles manga/anime ambiguës en P1. |
| Raster `raster-lot-002` | 40 | Audit de réutilisation et une sous-forme de Neff générée, 16 cellules ; aucun raccord runtime ni signalement raster clos. |

Ces activités se recoupent pour **The Offspring, Alien Queen et Predalien** :
elles couvrent **77 identités distinctes**, sans revendiquer 80 dossiers séparés.
Le lot raster-002 est une sélection de tâches `RASTER_MISSING` après exclusion
du raster-lot-001. Il contient 21 membres du lot global `actors-002`, neuf de
`actors-003` et dix de `actors-034` : **il n’est pas le lot global actors-002**.
Les deux sélections et leur rattachement aux lots globaux sont enregistrés par
clé acteur exacte. Les statuts des lots globaux restent ouverts.

La génération et son contrôle de reproduction ont terminé avec un code de
sortie 0. La validation vérifie les doublons, les identités exactes, l’égalité
avec l’ensemble des acteurs P1 courants, l’ordre, les politiques, les quarantaines
et les empreintes des fichiers d’entrée. Aucun fichier historique n’est réécrit.

Depuis la racine du dépôt :

```sh
python docs/assets/p0-p1-menu-continuation-2026-11-13/backlog/refresh-inherited-actor-batches-40.py
python docs/assets/p0-p1-menu-continuation-2026-11-13/backlog/refresh-inherited-actor-batches-40.py --check
```

Les preuves se trouvent dans
[actor-batches-40-validation.json](actor-batches-40-validation.json) et
[actor-batches-40-refresh-exit.json](actor-batches-40-refresh-exit.json).
Aucun dossier acteur ou P0 n’est clos ; `source1to1Verified` reste `false`.
