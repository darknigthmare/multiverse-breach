# Matérialisation des DLC — mesure et précontrôle

Les **9 007 sources DLC absentes** sont toutes référencées par des objets Git disponibles localement. Elles ne sont toutefois pas toutes des images contenues directement dans ces objets : **468 sont des pointeurs LFS**. La restauration complète réclame **4 437 414 094 octets de médias**, dont 1 012 152 764 octets pour 266 payloads LFS qui ne sont pas dans le cache local. Aucune restauration, publication, suppression ou requête réseau n’a été effectuée par ce diagnostic.

Le commit source mesuré est `632d8bb9fab5e8dedb3e97abb6f8d979b8cb8ab0`. Les relevés initiaux et les appels du nouvel outil sont datés séparément. Entre les deux, `public/favicon.png` a été restauré par un autre travail ; cela explique exactement une source publique supplémentaire disponible. Le nombre de sources DLC absentes reste 9 007.

## Contenu réellement disponible

| Parmi les 9 007 sources DLC absentes | Fichiers | Octets de médias |
| --- | ---: | ---: |
| Blobs natifs Git présents localement | 8 539 | 2 904 862 494 |
| Payloads LFS en cache, tous vérifiés SHA-256 | 202 | 520 398 836 |
| Payloads LFS absents du cache | 266 | 1 012 152 764 |
| Total | 9 007 | 4 437 414 094 |

Les 9 007 chemins utilisent 8 400 objets Git distincts. Leurs tailles Git seules, qui incluent le petit texte des pointeurs LFS, totalisent 2 904 924 270 octets : ce nombre **sous-estime les médias hydratés** et ne sert donc pas de budget de restauration.

Le corpus entier déclare 19 581 médias pour 15 276 185 811 octets. La déduplication par OID Git natif ou SHA-256 de payload LFS donne 18 933 identités et **15 234 292 099 octets** ; elle économise seulement 41 893 712 octets. Les identités Git et LFS sont explicitement séparées : un OID Git inclut l’en-tête de blob et n’est pas le SHA-256 brut du média. L’égalité de contenu entre ces deux familles n’est pas supposée.

L’inventaire partagé ajoute, au relevé initial, 4 097 fichiers absents et deux pointeurs LFS présents mais non hydratés. Ces deux fichiers sont `aether_crown_foundry.png` et `roman_forum_four_eras.png`. Les 1 483 payloads LFS partagés manquent au cache et représentent 5 198 713 531 octets. Résoudre les seules absences DLC ne termine donc pas le jeu complet.

## Stockage et profils réels

Au relevé initial, `/workspace` disposait de 340 873 216 octets et `/tmp` de 8 668 803 072 octets. Les deux volumes ont des périphériques différents ; `/tmp` est un `tmpfs`. Aucun reflink ou hardlink entre ces volumes n’est présumé. Les rapports plus récents contiennent les octets libres au moment précis de leur exécution.

Les quatre profils existants ont été résolus et vérifiés avec `readDlcDistributionManifests`, `resolveDlcSelection` et `buildDlcDistributionPlan`, sans ouvrir d’export ni lancer de build.

| Profil | Médias retenus | Médias, octets logiques | LFS non cachés | Téléchargements nécessaires, octets |
| --- | ---: | ---: | ---: | ---: |
| `base` | 7 613 | 8 489 429 032 | 1 483 | 5 198 713 531 |
| `base-reviewed` | 7 599 | 8 450 954 568 | 1 483 | 5 198 713 531 |
| `halo` | 7 834 | 8 727 055 258 | 1 509 | 5 303 935 406 |
| `halo-reviewed` | 7 820 | 8 688 580 794 | 1 509 | 5 303 935 406 |

La politique reviewed actuelle exclut 14 backdrops qualifiés et conserve les ressources partagées dont les dépendances sont inconnues. Elle n’autorise pas à supprimer arbitrairement les autres ressources pour faire rentrer le profil sur disque.

Avant l’amélioration de clôture documentaire menée en parallèle, `exportDlcDistribution.collectSourceFiles` copiait 3 743 860 807 octets de JSON documentaires, plus environ 102 Mo de code et de métadonnées. Les budgets de cette version étaient au minimum **20 747 903 885 octets pour base-reviewed** et **21 460 914 623 pour Halo-reviewed** après export et build par copie, hors dépendances, JS compilé, reçus et traces. Ces mesures datées sont dans `profile-code-overhead.json` et `source-export-overhead-breakdown.json` ; une modification du pipeline documentaire impose un nouveau relevé.

Même sans ces archives JSON, le pipeline par copie conserve les médias de l’export puis les recopie dans `dist`. Cela réclame 16 901 909 136 octets de médias pour base-reviewed et 17 614 787 814 pour Halo-reviewed. Faire les profils l’un après l’autre ne résout donc pas le manque d’espace actuel. Une stratégie de hardlinks à l’intérieur d’un nouvel artefact doit être explicitement conçue, attestée et testée pour l’indépendance des sorties ; elle n’est ni activée ni supposée ici.

## Outil de précontrôle utilisable

`scripts/auditDlcMaterialization.mjs` inspecte les manifestes, l’index Git local, les objets Git et les fichiers réguliers. `GIT_NO_LAZY_FETCH=1` est imposé sur chaque lecture d’objet. Les caches LFS et les payloads LFS courants sont vérifiés avec SHA-256. Les pointeurs ne comptent jamais comme des médias matérialisés. Les sources en symlink sont bloquées. L’outil ne lance ni checkout, ni téléchargement, ni publisher.

```sh
node scripts/auditDlcMaterialization.mjs --profile config/dlc-profiles/all.json --strict
node scripts/auditDlcMaterialization.mjs --profile config/dlc-profiles/base-reviewed.json --strict
node scripts/auditDlcMaterialization.mjs --mode selected --pack halo --shared-policy reviewed-dependencies --strict
```

Une sortie JSON complète peut être demandée avec `--json NOUVEAU_FICHIER.json`. Le fichier doit être nouveau ; l’outil refuse d’écraser un rapport existant. **La CLI est stricte par défaut**, même sans écrire `--strict` : elle termine avec un code non nul tant que des sources sont absentes, non hydratées, invalides ou que le budget demandé n’est pas établi. L’API retourne le diagnostic et son `strictPass` sans rien matérialiser.

Les opérations de budget sont distinctes :

- `canonical-hydration` mesure les fichiers manquants sur le volume du dépôt ; `--storage-root` ne permet pas de prétendre que ces écritures canoniques se feront sur un autre volume.
- `source-cache` estime un cache frais de payloads distincts sur `--storage-root`.
- `export` et `export-build` mesurent les copies de médias du pipeline courant. `--extra-bytes` doit déclarer les coûts non médias avant que le budget complet puisse être considéré connu. Une réserve par défaut de 256 Mio est ajoutée.

```sh
node scripts/auditDlcMaterialization.mjs --profile config/dlc-profiles/halo-reviewed.json --operation export-build --storage-root /volume-externe --extra-bytes 1073741824 --strict
```

Le nombre d’extra-octets de cet exemple est une entrée explicite, pas une mesure automatique de la clôture documentaire. Il doit être remplacé par le coût constaté après la modification du pipeline. Un cache LFS externe déjà existant peut être inspecté avec `--lfs-cache /volume-externe/lfs/objects` ; cette option ne télécharge rien.

## Exécution possible après coordination

La voie qui conserve le pipeline de copie exige un runner ou un volume externe assez grand pour le profil, le cache LFS, les sources et les sorties. Pour un clone complet et un build normal complet conservant aussi les objets Git et le cache LFS, réserver **au moins 80 Gio libres** évite de compter uniquement les 15,3 Go de médias. Cette réserve opérationnelle ne remplace pas le contrôle d’espace du runner.

Sur cet environnement isolé, reprendre le commit exact, récupérer les objets LFS du profil, matérialiser leurs payloads et vérifier leurs SHA-256, puis exécuter le précontrôle strict. Ensuite seulement lancer l’export canonique avec `exportDlcDistribution.mjs`, son audit, le build dédié `buildDlcDistribution.mjs` et la vérification navigateur des parcours réels de l’édition. Le dépôt et les ressources canoniques de cette session restent en place ; aucune ressource PG ou privée n’a besoin d’être supprimée.

Le cache absent n’a pas encore été testé contre le serveur LFS distant. La disponibilité des 1 749 payloads manquants du corpus complet n’est donc pas affirmée. Le téléchargement ciblé et la création de l’environnement isolé restent à coordonner ; aucun de ces transferts n’a été lancé pendant ce diagnostic.

### Commandes de restauration ciblée, non exécutées

Ces commandes s’appliquent uniquement à un checkout isolé, figé à la révision validée, sur un volume disposant de la place mesurée. Le checkout doit déjà contenir les sources, modules et manifestes ; `public/` et les répertoires `DLC/*/assets/` peuvent rester sparse. Le précontrôle écrit son rapport puis échoue normalement tant que les médias sont absents : il faut lire ce rapport avant la suite.

```sh
node scripts/auditDlcMaterialization.mjs --profile config/dlc-profiles/halo-reviewed.json --json /volume-externe/halo-preflight-before.json --strict
```

Créer une liste NUL des seules sources absentes dont le blob Git local existe ; les fichiers existants, les sources symlinkées et les objets Git introuvables n’y entrent pas. Le garde de budget doit réussir avant d’écrire la liste.

```python
import json
from pathlib import Path

report = json.loads(Path('/volume-externe/halo-preflight-before.json').read_text())
assert report['sizes']['allSizesKnown']
assert report['budget']['mediaLowerBoundFits']
assert not any(e['localState'] == 'unsafe-path' for e in report['entries'])
paths = [e['sourcePath'] for e in report['entries']
         if e['localState'] == 'absent' and e['gitObjectState'] == 'blob']
with Path('/volume-externe/halo-missing.paths0').open('xb') as stream:
    stream.write(('\0'.join(paths) + ('\0' if paths else '')).encode())
```

Depuis ce checkout isolé, vérifier que son `HEAD` est toujours le `sourceGitHead` du rapport, puis restaurer exactement ces chemins, sans changer l’index ni les motifs sparse. La restauration conserve les pointeurs LFS en texte ; le fetch et le checkout LFS qui suivent fournissent leurs payloads.

```sh
GIT_LFS_SKIP_SMUDGE=1 git restore --source=HEAD --worktree --ignore-skip-worktree-bits --pathspec-from-file=/volume-externe/halo-missing.paths0 --pathspec-file-nul
git lfs fetch --include='public/**,DLC/Halo/assets/**' --exclude='' origin HEAD
git lfs checkout 'public/**' 'DLC/Halo/assets/**'
node scripts/auditDlcMaterialization.mjs --profile config/dlc-profiles/halo-reviewed.json --json /volume-externe/halo-preflight-after.json --strict
```

Pour base-reviewed, le filtre LFS et le checkout deviennent seulement `public/**`. Pour le corpus complet, utiliser `public/**,DLC/*/assets/**` au fetch et les deux globs correspondants au checkout. Les filtres LFS ont été comparés aux trois profils mesurés ; les 14 backdrops exclus de reviewed sont des fichiers natifs, donc aucun payload LFS du profil n’est omis par ces filtres. Ces opérations ne doivent pas être lancées sur le checkout contraint actuel.

Après précontrôle strict réussi, validation du mode de clôture documentaire `runtime` développé en parallèle et contrôle du budget d’export/build complet, l’export et son audit/build peuvent être exécutés sur ce même environnement isolé. Le flag documentaire est explicite ; il ne supprime aucune archive du dépôt canonique.

```sh
node scripts/exportDlcDistribution.mjs --profile config/dlc-profiles/halo-reviewed.json --documentation runtime --out /volume-externe/halo-edition --source-revision "$(git rev-parse HEAD)"
npm --prefix /volume-externe/halo-edition ci
node /volume-externe/halo-edition/scripts/auditDlcDistribution.mjs --root /volume-externe/halo-edition
node /volume-externe/halo-edition/scripts/buildDlcDistribution.mjs --root /volume-externe/halo-edition
node /volume-externe/halo-edition/scripts/browserDlcDistribution.mjs --root /volume-externe/halo-edition --output /volume-externe/halo-browser-evidence
```

La dernière commande utilise le script navigateur existant et exige un Playwright/Chromium disponible dans l’environnement du runner. Un échec réseau/LFS, un hash différent ou une source manquante reste un blocage ; aucune commande `--available` n’est introduite pour le masquer. La vérification navigateur de l’édition réelle reste nécessaire après le build.

## Résultats vérifiés

Les **9 tests ciblés** passent, notamment un remote helper factice qui prouve l’absence de lazy fetch pour un objet promisor manquant, les caches corrompus de taille correcte, les payloads LFS invalides, les pointeurs tronqués à EOF ou incomplets, les sources symlinkées et les rapports non écrasables. Un PNG de contrôle reste reconnu comme fichier. Le comportement strict par défaut est testé. Les TAP et reçus sont conservés dans `materialization-cli-tests.*`.

Les trois vrais appels stricts ont terminé avec code **1**, conformément aux blocages mesurés : corpus complet 13 105 sources inutilisables, base-reviewed 4 098, Halo-reviewed 4 303. Les résumés, rapports complets compressés et empreintes sont dans `materialization-cli-real-profiles.json` et `materialization-preflight-*.json.gz`. Aucun rapport ne déclare un build, une disponibilité de production ou une fidélité 1:1 approuvés.
