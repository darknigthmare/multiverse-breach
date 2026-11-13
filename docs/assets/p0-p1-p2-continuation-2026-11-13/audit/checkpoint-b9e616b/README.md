# Export réel du checkpoint b9e616b

L’audit charge les sources du commit **`b9e616b331e4d93efcd63b607736ae6b6c59415b`**, puis recherche les rasters dans son arbre Git complet. Les neuf commandes terminent avec un code zéro. Les **3 862 fichiers de l’inventaire source** sont réhachés sans changement ; aucun média n’est copié ou décodé par ce refresh. Le checkout partiel n’est pas utilisé pour conclure qu’un raster manque.

| Mesure | Git 5952 avant travaux | Checkpoint b9e616b | Delta |
| --- | ---: | ---: | ---: |
| Acteurs | 4 937 | 4 937 | 0 |
| Constats P1 | 17 258 | 16 981 | −277 |
| Constats P2 | 13 466 | 13 506 | +40 net |
| Acteurs avec raster manquant | 1 474 | 1 473 | −1 |
| Portées de raster non résolues | 3 | 2 | −1 |
| Noms de techniques bruts génériques | 1 363 | 1 326 | −37 |

Les P1 retirés sont exactement **79 incarnations non précisées, 80 contrats visuels manquants, 79 références absentes, 37 noms génériques, un raster absent et une portée de raster non résolue**. Les P2 comprennent **39 précisions de continuité retirées et 79 revues de scène ajoutées** : renseigner une référence ne termine pas sa revue.

Les trois cohortes contribuent 272 retraits P1. Hors cohortes, le delta se limite à **quatre constats P1 Pinky** et **un constat P1 Revan**, plus **une nouvelle revue P2 Pinky**. Aucune identité n’est ajoutée, supprimée ou renommée et aucune priorité de constat restant n’est changée. Le Git contient un seul nouveau média runtime : le PNG Pinky. Revan réutilise un PNG existant ; le champ conservateur `newSpriteFiles: 0` du résumé d’export n’est pas un compteur du diff Git.

## Contrôles des profils après préparation

- **Arènes** : 48 profils des douze héros inchangés. Aucun kit perdu ; Gladiator conserve sa clé avec la seule précision de continuité Quake II. Les six tirs de PNJ corrigés en distance restent distincts de la projection des libellés du catalogue.
- **Final Fantasy** : 112 profils des 28 héros et 21 kits sélectionnés strictement conservés.
- **Halo / Half-Life / Mass Effect** : 92 profils des 23 héros conservés et sept kits sélectionnés identiques. Les changements de Cortana Fragment et de l’ancien Buck restent intentionnels.

Les sondes utilisent des nombres JSON explicitement marqués pour `Infinity`, `-Infinity` et `NaN`. Aucun nom brut/effectif ne diverge sur les héros FF et science-fiction ; les douze actions des trois héros UT2004 concordent aussi. Les 36 écarts de libellés des neuf autres héros arènes restent présents et ne sont pas présentés comme corrigés. Ces comparaisons de résolveurs ne constituent pas une campagne jouée, une animation officielle reproduite ou une approbation artistique globale.

## P0 et contrôles historiques

La queue historique est identique octet par octet entre Git 5952, le checkpoint b9e616b et le fichier de travail. Les **22 identités P0 historiques** sont toujours présentes dans l’export. Les **six contrôles interdisant les nouvelles tentatives automatiques** restent identiques, y compris l’overlay du Jack Sparrow de 2003. Le nouvel export P1/P2 ne les reclassifie pas et ne termine aucun dossier complet.

## Preuves et rétention

[Validation des commandes et sources](validation.json) · [Résumé](summary.json) · [Delta exact des acteurs et codes](actor-task-delta.json) · [Contrôles historiques](historical-controls.json) · [Diff des médias runtime](runtime-media-delta.json).

[Arènes](arena-review.json) · [Final Fantasy](ff-review.json) · [Science-fiction](scifi-review.json).

Le nouveau [suivi de cinq lots de 40](work-batches-40.json) conserve **200 clés disjointes** et les codes encore ouverts de chaque acteur. Les 316 paires retirées y sont couvertes exactement une fois : 120 acteurs ont des constats retirés, Necris a seulement sa correction de ciblage et 79 réservés restent non corrigés ce tour. Le périmètre corrigé est décrit par activité, avec les références d’entrée et les contrôles historiques conservés. Ce suivi ne remplace pas l’ancienne queue de 124 lots et permet de reprendre les manquants sans répéter les métadonnées déjà corrigées.

Le ledger après audit est conservé dans [actor-tasks.json.gz](actor-tasks.json.gz). Sa décompression rend exactement les octets et le SHA-256 utilisés par le delta et la validation ; [retention.json](retention.json) documente le chemin initial, la compression et les deux empreintes. L’export brut complet et ses CSV restent sous `/tmp/p0-p1-p2-final-b9e616b-export/`. Le dossier `audit/`, y compris les étapes antérieures, occupe environ 40,4 Mo.

Les dossiers Revan, Pinky, costumes, animations et références conservent leurs limites documentées. **Zéro acteur complet, zéro approbation d’art globale et zéro certification 1:1 ne sont déduits de ces chiffres.**

## Continuité avec le commit CG final

Le commit **`2a6911bdc155e0b36eea465f3a05fbf32f70bf2b`** conserve les OID des **3 862 fichiers de l’inventaire source** et leurs SHA-256 dans les fichiers de travail. Les cinq helpers effectivement utilisés par le refresh gardent aussi leurs empreintes. Aucun chemin sous `src/`, `DLC/` ou `public/` ne change ; la présence Git des rasters reste donc celle du bilan exporté.

Le commit actualise les producteurs, amendements, décodeur, tests et Bible CG, ainsi que quatre commandes de test/check dans `package.json`. Aucun autre champ du package, dépendance ou commande de build/runtime n’est modifié. Le bilan conserve la provenance exacte du checkpoint runtime b9e616b ; il n’est pas artificiellement réétiqueté comme un nouvel export du commit CG. [Reçu final Git/OID/SHA et fichiers de travail](final-cg-continuity.json).

## Limite reproduite de la suite historique CG

Le vrai `cgSourceEvidence.test.mjs` et son implémentation Git 5952 ont été exécutés avec les URL de modules et la racine réelles du dépôt, contre les mêmes documents et médias. Les 21 labels/statuts et les trois erreurs correspondent exactement au passage courant de comparaison : **18 succès, trois échecs** concernant Elara V2, le portrait absent de Jax Rook et Seyra V2. Au moment de cette comparaison, aucun document sous `docs/cg` ni image sous `public/images` n’avait changé depuis la base. La Bible CG a ensuite été actualisée par le commit final, qui ajoute aussi ses propres contrôles ; cette preuve garde le périmètre du passage comparé.

Cette comparaison prouve une limite préexistante du checkout partiellement matérialisé ; elle ne prédit pas un échec avec les médias originaux tous disponibles. Aucun attendu n’est changé, aucune donnée de remplacement n’est introduite par l’audit et les fixtures originales du test restent celles du code historique. [Commande, empreintes, causes et interprétation](cg-source-evidence-baseline5952.json) · [TAP baseline](cg-source-evidence-baseline5952.tap) · [Loader effectivement utilisé, conservé à l’identique](cg5952-preserved-root-loader.mjs).
