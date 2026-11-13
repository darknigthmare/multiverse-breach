# Vérifications de la reprise

| Contrôle | Résultat réellement exécuté |
| --- | --- |
| Suite standard DLC | `npm run test:dlc` : sortie 0, groupes **113/113 puis 245/245**, 286,425 s. Les 4 365 fichiers de source runtime restent inchangés pendant le passage. [Reçu](dlc-standard-suite.json), `dlc-standard-suite.log`. |
| Contrats, sprites et éditions | **110/110** : trois cohortes de contrats, moteurs réels, signatures, PNG Pinky, exception Revan et fixtures d’édition W14/W15. [Commande et portée](source-and-sprite-contracts.json), `source-and-sprite-contracts.tap`. |
| Provider et reprise des lots | **31/31** : contrôles des sources Git/LFS, décodeur raster et reprise des plans figés avec le contrat des modules privés actualisé. [Reçu](batch-tests-current.json), `batch-tests-current.tap`. Aucun nouveau téléchargement de 15 Go n’est déduit de cette suite. |
| Application réelle | **5/5 compilations** : complète, base, Halo, quatre packs FF et quatre packs Unreal/Quake. [Matrice](app-bundle-matrix.json) et [continuité des fichiers](compiled-source-continuity.json). Pas de copie des médias ni de prébuild global. |
| Bibliothèque des missions | **18/18 parcours**, trois éditions, FR/EN, desktop/mobile/texte à 150 %, 33 captures finales. [Preuves](../mission-menu/README.md). |
| Pinky en contexte | **3/3 cas** de vrai GameCanvas ; PNG HTTP 200/SHA exact, 16 cellules vues par le renderer, contact et jauge exercés. Les deux 404 annexes restent documentés. [Rapport](../raster-lot-004/README.md). |
| Revan en contexte | Avant : placeholder ; après : seul atlas à sabre rouge exact, corps 72/108 px et HUD 64 px, cycle des 16 cellules. [Rapport](../p0-lot-004/README.md). |
| Lint du code runtime modifié | Sortie 0, zéro erreur ; un avertissement Fast Refresh sur le harness de test sans export. [Reçu](runtime-source-lint.json), `runtime-source-lint.log`. |
| Continuité des médias | Les **19 582 objets Git canoniques** de la passe v2 sont inchangés ; seul l’atlas Pinky s’ajoute, avec ses vérifications dédiées. [Preuve](asset-byte-lineage.json). Cela ne matérialise pas les sources dans le checkout. |
| Contrats CG courants | `npm run test:cg:metadata` : **81/81 tests, dont 56 principaux**, sortie 0 en 142,639 s, exécution séquentielle et mémoire bornée ; [reçu final](cg-metadata-final.json), `cg-metadata-final.tap`. Ancien plan complet et pins inchangés ; ce runner ne prétend pas vérifier tous les médias physiques. |
| CLI CG | `--check-metadata` passe ; le mode strict refuse toujours la CG absente. Les modes contradictoires sont refusés avant écriture. [Commandes, résultats et limites](../cg-runtime-correction/README.md). |
| Bible CG courante | Régénération puis `--check` intégral : 1 912 sujets et 28 680 emplacements décrits. `npm run test:cg:bible` vérifie les deux pilotes Halo dans le vrai JSON ; [reçu](cg-bible-pilots-final.json), `cg-bible-pilots-final.tap`. Ces emplacements ne sont pas des images livrées. |
| Lint des scripts CG | Sortie 0 sur les scripts modifiés, avec avertissement de regex de contrôle conservé. [Reçu](cg-source-lint.json), `cg-source-lint.log`. |

La première suite DLC, avant correction de l’adaptateur facultatif, est conservée dans `dlc-before-private-helper-fix/` avec ses six échecs. Le [contrat des helpers privés](dlc-private-helper-contract/REPORT.md) garde la régression avant/après et l’export réellement importé. Les attentes historiques ne sont pas supprimées pour obtenir un résultat vert.

Les logs, TAP et captures de code upstream sont conservés octet pour octet. Le contrôle d’espaces porte sur le code et la documentation écrits ; il exclut les logs/TAP et `raster-lot-004/references/p_enemy.c.txt`, dont les espaces appartiennent à la source id Software archivée et sont couverts par son SHA. Les CSV historiques gardent leurs fins de ligne CRLF.

Les [comparaisons indépendantes du checkpoint](../audit/checkpoint-b9e616b/README.md) recomptent les tâches et vérifient les profils préparés avec une sérialisation qui distingue aussi Infinity, -Infinity et NaN. Les constats de source ne sont pas des certifications graphiques ; les tests ciblés ne sont pas un parcours complet des campagnes.

La [continuité avec le commit CG 2a6911bdc](../audit/checkpoint-b9e616b/final-cg-continuity.json) vérifie les 3 862 entrées de source et cinq helpers d’audit sans changement d’octets ni d’OID. Le [contrôle des compilations](compiled-source-continuity.json) vérifie séparément leurs 4 371 entrées et reconstruit le SHA exact du package de compilation après inversion des seules quatre commandes CG.

Le vrai test historique `cgSourceEvidence.test.mjs` et son implémentation Git 5952 reproduisent les mêmes trois échecs physiques que le code courant : 18/21 dans ce checkout partiel. Les [labels, erreurs et empreintes](../audit/checkpoint-b9e616b/cg-source-evidence-baseline5952.json) sont comparés sans changer les attentes ni hydrater les portraits. Le contrôle complet des CG et le prébuild global ne sont donc pas présentés comme verts.
