# Delta du backlog — continuités structurées

L’export réel sur le snapshot immuable `de22d79e903b9995766e5a9628c3ec22198da561` a été comparé au backlog
historique `daca0f002eaa94cf16b06d5ad366b0423ea294d2`. Le comparateur a terminé avec un
code de sortie 0 ; il n’a réécrit aucun fichier de la baseline.

| Observation | Avant | Après |
| --- | ---: | ---: |
| Acteurs runtime | 4937 | 4937 |
| Tâches P1 | 17318 | 17258 |
| Tâches P2 | 13406 | 13466 |
| Tâches totales | 30724 | 30724 |
| Acteurs ayant encore une P1 | 4935 | 4935 |
| Acteurs avec raster manquant | 1474 | 1474 |
| Acteurs avec revue de planche statique | 11 | 11 |
| Continuités récupérées par pack | 1440 | 1440 |

Les 62 remplacements de tâches sont exactement ceux du correctif borné :
60 déclarations déjà présentes deviennent `ACTOR_CONTINUITY_PRECISION` P2 ;
les deux contrats manga/anime deviennent `ACTOR_CONTINUITY_AMBIGUOUS` P1.
Les 60 tâches P1 redondantes cessent ainsi d’être signalées comme absence de
métadonnées. La production et la revue des modèles, tenues et scènes restent
ouvertes. Aucun dossier acteur n’est entièrement clos.

Les autres tâches et leurs détails restent strictement identiques. Tous les
autres champs acteur, les `rasterProbes`, `rasterPaths`, `missingRasterPaths`
et `staticGameplayPaths` restent égaux. Aucun PNG nouvellement généré mais non
raccordé n’a été compté comme réparation d’un raster manquant. Aucune fermeture
P0, approbation artistique ou fidélité 1:1 n’est revendiquée.

Les empreintes des fichiers historiques `actors.json`, `summary.json` et
`audit.json` sont identiques avant/après la comparaison. Les cinq fichiers du
correctif et de ses tests correspondent au snapshot immuable de l’export.

- [Delta complet par identité et code](global-source-findings-delta.json)
- [Reçu du processus de comparaison](global-source-findings-delta-exit.json)
- [Vérification des sources du snapshot](locked-continuity-source-snapshot-proof.json)
- [Comparateur archivé](compare-locked-continuity-backlogs.py)
- [Lot de 40, sources relues et validation 99/99](../locked-continuity/README.md)

Le script archivé accepte le répertoire du nouvel export puis le répertoire de
sortie. La baseline historique et la fixture du lot sont épinglées dans ce
script. Il conserve un rapport d’écarts et échoue si des changements inattendus
apparaissent ; il ne modifie aucun acteur, asset ou historique.
