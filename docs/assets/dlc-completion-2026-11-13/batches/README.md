# Validation DLC par lots bornés

Les payloads canoniques restent dans Git/LFS. Cette commande traite un lot
temporaire, vérifie ses octets, décode les images prises en charge, puis supprime
les fichiers temporaires appartenant au provider. Seuls le plan et les reçus
JSON doivent être conservés ; aucun export global des médias n’est nécessaire.

## Plan figé

Le snapshot d’assets utilisé ici est
`3fb49277809f28d11d4886c847558fca6ee91f21`. Le plan lit ses inventaires et ses
références UI depuis ce commit dans un petit snapshot temporaire ; les
inventaires du working tree ne peuvent pas les remplacer. Le catalogue annoncé
contient 19 582 assets, répartis entre DLC et ressources communes.

```sh
node scripts/dlcAssetBatches.mjs plan \
  --revision 3fb49277809f28d11d4886c847558fca6ee91f21 \
  --profile all \
  --out /tmp/dlc-all-final-plan.json \
  --max-assets 40 --max-batch-mib 128 --max-asset-mib 256
```

`--profile` accepte aussi `base`, un ou plusieurs identifiants séparés par une
virgule, ou un fichier de profil JSON. Les profils sont résolus par les API de
distribution existantes. La limite ordinaire est 40 assets et 128 Mio par lot ;
un objet plus gros reste isolé et doit respecter `maxAssetBytes`, au plus
256 Mio. Un objet dépassant ce plafond reçoit `UNAVAILABLE` sans être matérialisé.
Une source absente garde une taille inconnue explicite et ne bloque pas les
autres lots.

Le plan distingue le commit des assets, le HEAD enregistré au moment de sa
création et les SHA-256 réels du runner, du provider, du décodeur et de leurs
contrats de distribution. Il ne prétend pas que du code non committé appartient
au HEAD : chaque fichier indique s’il correspond à son blob Git enregistré.

## Exécution et reprise

Créer le dossier parent des reçus, puis commencer par un lot :

```sh
mkdir -p docs/assets/dlc-completion-2026-11-13/batches
node scripts/dlcAssetBatches.mjs validate \
  --plan /tmp/dlc-all-final-plan.json \
  --receipts docs/assets/dlc-completion-2026-11-13/batches/all \
  --batch 00000 --allow-lfs
```

Une passe bornée reprend les lots qui n’ont pas encore de reçu :

```sh
node scripts/dlcAssetBatches.mjs validate \
  --plan /tmp/dlc-all-final-plan.json \
  --receipts docs/assets/dlc-completion-2026-11-13/batches/all \
  --batch all --max-batches 5 --allow-lfs
```

Les reçus `PASSED` sont réutilisés si leur intégrité, leur plan et les SHA du
code restent cohérents. Les lots déjà `UNAVAILABLE` ne sont pas retentés dans
une passe ordinaire ; ajouter `--retry-unavailable` après avoir rétabli une
source ou le réseau. À l’intérieur d’un lot retenté, les assets déjà vérifiés
sont conservés dans le reçu et seuls les autres sont retraités. Un échec réseau
n’efface donc pas les résultats natifs acquis.

Sans `--allow-lfs`, seuls Git, le cache LFS local et les éventuelles correspondances
historiques vérifiées sont utilisés. `--historical-lfs-map FILE.json` accepte
l’index historique qualifié : le provider contrôle encore le SHA et la longueur
exacte du payload. Les téléchargements réseau utilisent un cache LFS temporaire
isolé et ne remplissent pas le cache principal du dépôt.

## Bornes et portée des reçus

La réservation temporaire maximale est 512 Mio par provider, cache réseau et
payload compris. Quatre providers ne réservent donc pas plus de 2 Gio de stockage
temporaire. Cette borne de disque ne constitue pas une mesure de mémoire vive.
La validation traite les assets d’un lot successivement et nettoie chaque
payload après contrôle. Le décodage raster possède aussi un plafond de pixels.

Les résultats par asset et par lot restent `PASSED` ou `UNAVAILABLE`, avec des
codes d’erreur bornés. Le bilan distingue lots réussis, indisponibles et encore
en attente ; il ne comporte pas de drapeau de préparation globale à la production.
Pour les formats non raster, `NOT_APPLICABLE` signifie uniquement que le SHA,
l’OID et la longueur ont été contrôlés, sans prétendre décoder ce format.

Les reçus sont publiés par renommage atomique sous verrou de lot. Un manifeste
modifié, un changement des options du plan, une corruption des reçus ou une
modification des scripts de validation bloque la reprise. Les SHA assurent une
liaison d’intégrité au plan et au commit, sans prétendre être une signature
d’authentification. Un dossier contenant des fichiers utilisateur non reconnus
est refusé ; les gardes du provider refusent de nettoyer un arbre temporaire
altéré ou contenant des fichiers étrangers.

La première vérification d’un plan chargé reconstruit son identité canonique.
Une `WeakMap` privée évite ensuite de réextraire les 505 manifestes à chaque lot,
tout en revérifiant le contenu du plan et les SHA actuels du code. Pour quatre
providers dans un même processus, vérifier le plan une fois, puis répartir ses
IDs de lots entre quatre boucles appelant `validateDlcAssetBatch`.

## Vérification du runner v1

28 tests passent sous Node 22 avec un heap de 1 Gio : fixtures Git réelles,
payloads PNG, pointeurs LFS, reprise après indisponibilité, limites, corruption,
fichiers étrangers, CLI complète, cache canonique et mutation du runner. Les
tests de décodage couvrent PNG/WebP/JPEG et GIF multi-pages, ainsi que des données
corrompues malgré un en-tête lisible. Ils ne certifient ni la fidélité artistique,
ni un build ou déploiement de production.

```sh
node --max-old-space-size=1024 --test --test-concurrency=1 \
  scripts/dlcAssetBatches.test.mjs \
  scripts/dlcAssetBatchDecode.test.mjs \
  scripts/dlcBatchAssetSource.test.mjs
```
