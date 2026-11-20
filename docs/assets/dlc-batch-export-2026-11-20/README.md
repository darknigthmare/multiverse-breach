# Export des médias DLC par lots

L’exporteur conserve les 40 fichiers au maximum d’un lot dans un répertoire transportable. Chaque fichier reprend son chemin source sous `public/` ou `DLC/<pack>/assets/`. Le reçu donne aussi l’URL publique, la taille, le SHA-256 et l’identifiant du blob Git. Les médias privés sont copiés une seule fois. La distribution de l’édition intervient ensuite sur le volume de destination.

L’exporteur reprend le plan figé du vérificateur DLC. Il récupère un fichier de travail à la fois depuis Git ou LFS, contrôle ses octets, décode les rasters selon le plan et libère le fichier temporaire. Il publie le répertoire après comparaison de l’inventaire et des empreintes. Un lot indisponible échoue avant publication. Une sortie existante est protégée. `--allow-lfs` autorise le téléchargement vers le cache temporaire si nécessaire.

## Deux lots exportés

Les deux lots utilisent le commit `31c3639d86b67f1f6cb22659d46d06b5ed2016e5` et le profil Doom avec les médias communs. Le plan prévoit 317 lots. Les deux lots retenus couvrent les nouveaux atlas du précédent passage et la récupération d’images déjà disponibles en cache LFS.

| Lot | Fichiers exportés | Octets | Origine | Absents du checkout |
| --- | ---: | ---: | --- | ---: |
| [00245](batch-00245.json) | 36 PNG | 33 498 171 | 36 blobs Git, dont 7 privés Doom avec Imp, Pinky et Mancubus | 4 |
| [00022](batch-00022.json) | 8 PNG et 16 WebP | 31 179 057 | 8 payloads du cache LFS et 16 blobs Git | 24 |

Les **60 fichiers** ont été décodés et relus après export. La relecture indépendante compare les SHA-256, les identifiants de blobs natifs ou les pointeurs LFS du commit, puis redécode les images avec Pillow. Les deux reçus ont aussi été contrôlés hors du dépôt avec leurs SHA-256 d’origine. La suite `npm run test:dlc:batches` passe **34/34** sous Node 22.23.5. [Résultats](verification.json)

Les payloads restent sur le volume temporaire de ce traitement. Le dépôt conserve les reçus et la recette ci-dessous. La vérification couvre les octets et le décodage des deux lots. Le build d’une édition avec tous ses médias reste à effectuer.

## Reproduire

Choisir un volume de travail qui peut accueillir les fichiers du lot et les temporaires du fournisseur. Le répertoire parent de la sortie doit exister. L’exporteur refuse un chemin de sortie dans le dépôt. Une fois le lot transféré, comparer son reçu à l’empreinte communiquée à l’origine lors du contrôle.

```sh
node scripts/dlcAssetBatches.mjs plan \
  --revision 31c3639d86b67f1f6cb22659d46d06b5ed2016e5 \
  --profile doom --out /tmp/doom-plan.json \
  --max-assets 40 --max-batch-mib 32 --max-asset-mib 128

node scripts/exportDlcAssetBatch.mjs \
  --plan /tmp/doom-plan.json --batch 00245 --out /tmp/doom-batch-00245

node scripts/exportDlcAssetBatch.mjs \
  --check /tmp/doom-batch-00245 --expected-receipt-sha256 RECU_SHA256
```

Le décalage entre le commit source et le `HEAD` de l’outil modifie l’identité du plan nouvellement généré. Pour reproduire aussi l’empreinte du plan de cette vérification, l’API `createDlcAssetBatchPlan` permet d’indiquer `gitHeadAtPlanCreation` à la même révision que celle ci-dessus.
