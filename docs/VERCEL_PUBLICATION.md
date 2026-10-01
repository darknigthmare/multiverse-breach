# Publication Vercel avec les assets complets

Le déploiement automatique Git du 31 août 2026 a échoué avec
`GIT_LFS_BUDGET_EXCEEDED`, avant compilation. La production suivante, au commit
`6fd4fd24d690e84f6dfbfc022cd844d0def116ec`, a été publiée le 1 septembre via
un envoi direct depuis une copie locale complète. Ce blocage de quota ne se
corrige pas en modifiant le gameplay ou en supprimant les images.

Le 1 octobre 2026, la récupération `git lfs pull` a réussi dans le checkout de
correction. Les 500 fichiers LFS ont été comparés aux SHA-256 des pointeurs Git,
sans divergence, et les 9 177 fichiers publics suivis passent le contrôle local.
Le quota d'août décrit donc un échec historique, pas une indisponibilité LFS
constatée aujourd'hui. Cela ne garantit pas un futur déploiement automatique.

Un checkout avec `GIT_LFS_SKIP_SMUDGE=1` contient des fichiers texte de quelques
octets à la place de certaines images. Leur présence et leurs noms ne prouvent
pas que les assets sont prêts. Les audits refusent désormais ces pointeurs,
les fichiers manquants, et les chemins passant par des symlinks/jonctions.

## Vérifications locales avant publication

Utiliser un checkout qui contient les fichiers binaires réels. `git lfs pull`
permet de les récupérer lorsque le service LFS est disponible. Si le quota
bloque la récupération, restaurer les fichiers depuis une copie locale
complète déjà disponible. Les scripts ne modifient ni facturation ni quota et
n'effacent aucun asset.

Depuis la racine du dépôt :

```sh
node scripts/auditLocalPublicAssets.mjs
npm run build
vercel deploy --dry --json > /tmp/multiverse-vercel-upload.json
node scripts/auditVercelUploadManifest.mjs < /tmp/multiverse-vercel-upload.json
```

Le premier audit vérifie tous les fichiers `public/` suivis par Git. Le second
contrôle à nouveau leur contenu local et leur présence dans le manifeste
d'envoi Vercel. Le `--dry` et ces audits ne créent aucun déploiement.
Après réussite de ces contrôles, un envoi direct Vercel peut être effectué selon
le processus de publication du projet, depuis cette même copie complète.

## Vérification pendant le build

`node scripts/auditLocalPublicAssets.mjs --build` utilise les chemins suivis
par Git lorsque `.git` est présent. Dans un build distant provenant d'un envoi
direct, Vercel omet généralement `.git` : ce mode inspecte alors tous les
fichiers effectivement présents dans `public/`, sans suivre les symlinks.
Il refuse toujours les pointeurs LFS. Il indique explicitement que ce scan ne
prouve pas la couverture des fichiers Git absents ; l'audit du manifeste local
reste nécessaire avant l'envoi.
