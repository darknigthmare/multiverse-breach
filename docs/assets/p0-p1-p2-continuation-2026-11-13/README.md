# Reprise P0/P1/P2, personnages, menus et DLC — 13 novembre 2026

Cette reprise part du commit `5952da01c`, intégré avec GitHub `2333c2c0`. Cinq cohortes disjointes de 40 couvrent 200 dossiers : priorités visuelles, Final Fantasy, Halo/Half-Life/Mass Effect, arènes Unreal/Quake et rasters Crash/Croc/Dino Crisis/Doom. Un dossier peut conserver plusieurs tâches après un correctif ; aucun personnage entier n’est approuvé automatiquement.

## Changements livrés

- **Pinky classique 1993** : vrai nouvel atlas de 16 poses raccordé au chemin que le moteur résolvait mais ne trouvait pas. Les petites cornes grises et les yeux dorés sont corrigés après comparaison des sprites source. La morsure, le contact unique, la consommation de jauge et le nettoyage sont exécutés dans le vrai GameCanvas. Le nom historique et les identités projetées restent stables. [Lot raster004](raster-lot-004/README.md).
- **Revan KOTOR I** : un correctif de 16 poses déjà livré à sabre rouge unique peut enfin remplacer le placeholder. L’ancien atlas rouge/violet et les animations non revues restent bloqués. L’exception exige l’incarnation et la ressource exactes ; le cadrage HUD est corrigé pour ce seul atlas. [Lot P0/liaisons](p0-lot-004/README.md).
- **FF 40** : fiches individuelles sourcées, armes et rôles précis, noms de catalogue alignés sur les actions existantes. Les 21 kits préparés et 112 profils après préparation restent identiques ; 18 supers de héros sont exercés dans le moteur mêlée. Zolom et MT Trooper retrouvent leurs rôles tactiques, respectivement morsure et fusil. [Rapport FF](ff-lot-040/README.md).
- **Sci-fi 40** : les fiches rejoignent les kits effectifs déjà présents. Le fragment Cortana agit en soutien sans dégâts ; l’ancien Buck utilise une attaque ODST de 2009 ciblée. Eli et Kleiner utilisent leur terminal de laboratoire plutôt qu’une tablette attribuée par un override générique. Le contrôle d’Arbiter est restauré, avec refus des métadonnées/actions personnalisées qui ne correspondent pas au contrat exact. [Rapport](scifi-lot-040/REPORT.md).
- **Arènes 40** : 39 éditions/modèles déclarés individuellement, Sapphire Mercenary et Gladiator Quake II 1997 distingués. Le catalogue UT2004 expose les douze actions réellement résolues, sans prétendre les créer. Le repli RPG reconnaît cinq noms d’armes à distance : six adversaires auparavant traités comme mêlée passent à distance ; le septième l’était déjà. Les morsures et soutiens conservent leurs règles. [Rapport](arena-lot-040/README.md).
- **Bibliothèque des missions** : recherche, filtres de disponibilité, descriptions et titres complets, navigation clavier et focus visible. Les polices passent réellement de 15 à 22,5 px avec l’agrandissement à 150 %. Les missions, récompenses, sauvegardes et préférences de réserve sont préservées. [18 parcours sur trois éditions](mission-menu/README.md).
- **Distribution DLC** : les helpers privés des packs sont conservés dans l’export choisi et exclus avec leur pack. Leur adaptateur est facultatif, comme dans le registre ; les chemins et la fermeture des dépendances restent contrôlés. Le vrai export de fixture est importé après copie. [Régression et correction](validation/dlc-private-helper-contract/REPORT.md).
- **Métadonnées CG** : la sélection Revan courante est séparée du visuel rejeté ; 64 fiches, 88 entrées et 88 propositions de fond sont alignées sur leurs sources. Les deux pilotes Halo gardent leur propre édition CG, sans emprunter l’équipement runtime. Le lecteur exige un vrai décodage des images et distingue identité et support de costume. Le plan historique et ses 1 436 déclarations de livraison restent inchangés. [Contrats et limites](cg-runtime-correction/README.md).

## Comptage et preuves

Les [audits indépendants](audit/README.md) comparent des snapshots de sources et des identités exactes. Une URL ajoutée peut retirer REFERENCE_MISSING et créer REFERENCE_SCENE_REVIEW : la revue de la scène reste à effectuer. Les clôtures de données/catalogue et les corrections de comportement sont décrites séparément des dessins livrés.

L’[export global](audit/checkpoint-b9e616b/validation.json) est réellement exécuté depuis le checkpoint **`b9e616b331e4d93efcd63b607736ae6b6c59415b`**, avec arbre Git complet et 3 862 fichiers de source réhachés sans mutation. Il conserve les 4 937 identités et confirme le [delta exact par acteur/code](audit/checkpoint-b9e616b/actor-task-delta.json) :

| Mesure | Avant 5952 | Après b9e616b |
| --- | ---: | ---: |
| Constats P1 ouverts | 17258 | **16981** |
| Constats P2 ouverts | 13466 | **13506** |
| Acteurs avec raster absent | 1474 | **1473** |
| Fiches avec noms bruts génériques | 1363 | **1326** |
| P0 visuels historiques | 22 | **22**, non reclassés |

La [preuve de continuité finale](audit/checkpoint-b9e616b/final-cg-continuity.json) confirme les mêmes sources et les cinq helpers d’audit au commit CG **`2a6911bdc155e0b36eea465f3a05fbf32f70bf2b`** : aucun changement dans `src`, `DLC` ou `public`, ni dans les dépendances. Les quatre commandes de test/contrôle CG du package sont les seuls changements de configuration.

Les **277 P1 retirés** comprennent 141 du lot FF, 128 du lot sci-fi, trois projections de catalogue UT2004, les quatre manques Pinky et le défaut de liaison Revan. **39 P2 de précision sont retirés**, tandis que **79 revues de scène P2 apparaissent** après déclaration des références. Le solde P2 augmente donc de 40 ; ces nouvelles revues ne sont pas masquées pour faire baisser le compteur.

Le [ledger courant compressé](audit/checkpoint-b9e616b/actor-tasks.json.gz) est conservé sans perte, avec sa [preuve de rétention](audit/checkpoint-b9e616b/retention.json). Les champs `newSpriteFiles:0` et `newArtApprovals:0` du résumé R14 décrivent l’exporteur, qui ne produit ni dessin ni approbation ; l’atlas Pinky réellement livré a sa provenance et ses contrôles dans son lot. Les [contrôles historiques](audit/checkpoint-b9e616b/historical-controls.json) gardent les 22 P0 et les six identités exclues des retries automatiques. Aucun dossier acteur entier n’est déclaré clos.

Le [suivi des cinq lots de 40](audit/checkpoint-b9e616b/work-batches-40.json) conserve leurs 200 identités disjointes : 120 acteurs ont des constats retirés, Necris a une correction de ciblage et 79 réservés restent non corrigés ce tour. Les codes encore ouverts sont conservés pour poursuivre les lots sans les compter comme terminés.

## Vérification et limites

Les suites ciblées, comparaisons de kits et profils, passages navigateur et compilations sont consignés dans les rapports. Les premières erreurs de préparation ont été corrigées avant gel ; leurs traces restent archivées. Les plans historiques W14/W15 gardent leurs octets et leurs compteurs ; les éditions actuelles ont des fixtures de catalogue explicites.

- Suite DLC complète finale : **113/113 puis 245/245**, sortie 0 ; 4 365 fichiers de source runtime inchangés pendant le passage. Les groupes ne sont pas additionnés comme un nombre de tests uniques.
- Contrats source, signatures, PNG, quarantaine et éditions historiques : **110/110**, sortie 0.
- Application réelle : cinq compilations réussies, complète/base/Halo/FF quatre packs/arènes quatre packs. Elles ne copient pas les médias et ne lancent pas le prébuild global.
- Bibliothèque des missions : **18/18** cas navigateur dans trois éditions, 33 captures finales et 6 avant, clavier/mobile à 150 % ; zéro erreur HTTP, page ou débordement dans ce périmètre.
- Profils après préparation : 48/48 arènes, 112/112 FF et 92/92 sci-fi conservés dans les sondes sans perte numérique ; aucun kit de source perdu. Deux corrections sci-fi intentionnelles sont isolées de ces comparaisons.
- Contrats CG courants : **81/81 tests**, dont 56 principaux, sortie 0 ; producteur metadata réel, projections fermées, décodage d’images et refus des mutations hors périmètre.

La suite historique W3 a 27 succès et 35 échecs aussi bien dans le vrai snapshot `5952` que dans les sources courantes. Les 62 libellés/statuts sont comparés et les quatre cas Pinky passent. Cela ne transforme pas les autres échecs historiques en succès. Les deux 404 annexes du fixture Pinky restent enregistrés.

Le contrôle CG courant `--check-metadata` passe avec `physicalMediaChecked:false`. Les 58 portraits privés concernés restent absents ; aucune CG n’est ajoutée. La [comparaison réelle avec Git 5952](audit/checkpoint-b9e616b/cg-source-evidence-baseline5952.json) retrouve exactement les trois échecs de la suite historique liés à Elara, Jax et Seyra : 18/21 dans les deux versions du checkout partiel. Le mode strict `--check` continue de refuser un média absent et ne se rabat pas sur les métadonnées.

L’audit des 19 582 médias du tour précédent reste lié à sa révision 9e690725 ; le nouvel atlas Pinky et la liaison Revan ont leurs vérifications propres. La distribution actuelle inventorie 19 583 ressources. Aucun export monolithique de tous les médias ni build complet avec prébuild n’est déduit des compilations de code.

Les 22 P0 visuels historiques, les costumes, les états d’animation non livrés et les invocations dont les versions ne correspondent pas restent suivis. L’appel Wrex ME1 vers Shepard ME2 reste notamment ouvert. Le slot Necris UT2004 n’est pas réattribué sans modèle de source établi. Les images adaptées ne sont pas une copie pixel pour pixel et aucune fidélité globale 1:1 n’est certifiée.
