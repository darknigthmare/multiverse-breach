# Modules privés DLC : contrat d’adaptateur facultatif

Les helpers internes déclarés par un pack restent des modules possédés et exportés avec ce pack. Leur absence d’adaptateur public ne bloque plus la validation de distribution. Une édition de base reste exécutable sans les répertoires exclus.

`scripts/dlcDistribution.mjs` accepte désormais un `runtimeAdapter` absent ou `null`, conformément au contrat existant du registre. Une valeur non nulle doit toujours être une chaîne et passer le même contrôle de chemin relatif sûr. Les valeurs numériques, booléennes, les objets, les chaînes vides et les chemins absolus ou contenant une traversée restent refusés. Aucun faux adaptateur n’est ajouté.

Le transformateur productif n’a pas changé : il possède déjà les modules par leur chemin dans le pack. Le test d’assemblage des agrégats énumère désormais seulement les déclarations d’adaptateur non nulles, en conservant tous les modules privés dans les manifestes et le graphe source.

Les nouvelles régressions vérifient un helper réellement importé et exécuté dans une édition choisie, sa présence exacte dans l’export audité et son absence physique dans une édition de base. Elles vérifient aussi le refus d’un point d’entrée appartenant à un pack exclu. Elles utilisent les vrais transformateur, sélectionneur, exporteur et auditeur.

| Vérification exécutée avec Node 22, concurrence 1 | Résultat | Preuve |
| --- | --- | --- |
| Nouveaux cas ciblés avant le correctif | 2 réussites, 3 échecs sur 5 | `targeted-before.tap` |
| Mêmes cas ciblés après le correctif | 5/5, aucun échec ou skip | `targeted-after.tap` |
| `dlcProfileTransform.test.mjs` et `dlcProfileSharedBackdrops.test.mjs`, heap 8192 MiB | 23/23, aucun échec ou skip, 99,063 s | `previously-failing-suites.{tap,json}` |
| `dlcDistribution.test.mjs` et `dlcDistributionExport.test.mjs`, heap 2048 MiB | 90/90, aucun échec ou skip, 2,063 s | `distribution-export-standard.{tap,json}` |
| `git diff --check` sur les quatre fichiers modifiés | Réussi | Revue du diff final |

Les reçus JSON enregistrent les commandes exactes et les empreintes des sources avant exécution ; les sources sont restées identiques pendant chaque passage. Les échecs ciblés initiaux sont conservés. L’échec antérieur de la suite DLC complète reste documenté dans le journal parent ; cette intervention n’a pas réécrit ce journal.

Le périmètre est limité à `dlcDistribution.mjs` et trois fichiers de tests. Aucun fichier sous `DLC/` ou `src/`, manifeste, média, registre, adaptateur, paquet npm ou autre script de vérification de lots n’a changé dans cette intervention. La suite DLC complète finale est coordonnée par l’agent principal. Ces tests ne certifient ni un export complet de médias de production ni leur fidélité artistique.

Le changement du code de distribution modifie légitimement son empreinte : les anciens plans de lots figés sous un autre code restent des preuves historiques. Aucun reçu antérieur n’a été rendu compatible en affaiblissant les contrôles ou en changeant rétroactivement ses empreintes.

La revue indépendante en lecture seule de `/root/menus_logistics/review_dormant_saves` n’a trouvé aucun défaut concret. Elle confirme que la collecte des sources, leur transformation et l’audit des imports parcourent toujours les helpers déclarés avant publication. Limites des nouveaux cas : `runtimeAdapter: null` est testé au niveau sélection, tandis que l’export positif utilise un champ absent ; aucun nouveau cas ne vise précisément un helper privé sélectionné qui importe un pack exclu. Aucun média ni nouveau test lourd n’a été exécuté pour cette revue.
