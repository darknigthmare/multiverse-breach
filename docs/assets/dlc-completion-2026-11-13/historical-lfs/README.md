# Payloads LFS retrouvés dans les blobs Git locaux

**Trois payloads exacts sont réutilisables sans téléchargement ni copie de
média : 7 579 714 octets.** Le scan concerne les 1 951 pointeurs LFS du preflight
`all`, dont 1 749 étaient absents du cache LFS. Les 1 951 OIDs de pointeur ont
été vérifiés dans l’arbre d’assets immuable
`3fb49277809f28d11d4886c847558fca6ee91f21`.

`git cat-file --batch-all-objects --batch-check` a énuméré 80 221 objets locaux,
dont 58 295 blobs et 18 424 316 899 octets de contenu décompressé déclaré. Seuls
trois blobs avaient une taille appartenant aux 1 950 tailles LFS recherchées.
Ces trois candidats ont été lus en flux, avec recalcul du SHA-256 du payload,
de sa longueur et du SHA-1 canonique du blob Git. Les trois correspondent
exactement ; aucune correspondance par nom de fichier n’a été acceptée.

| Payload attendu | Octets | Blob Git exact |
| --- | ---: | --- |
| `public/images/oc-worlds/v2/neon_requiem/heroes/jax_rook.png` | 2 412 928 | `ff787a5e6db1801d372d97f4f2f05c3a5652f0bb` |
| `public/images/oc-worlds/v2/neon_requiem/heroes/nyra_vale.png` | 2 544 671 | `4c0ac1e3ddd69df587d60e7375fc78360371379b` |
| `public/images/oc-worlds/v2/aether_crown/heroes/elara_voss.png` | 2 622 115 | `33176834de62a64bd42f1a9a7db7bdd50d016ded` |

La [map vérifiée](verified-historical-lfs-map.json) fournit les SHA-256 complets,
les tailles, OIDs, chemins, états du cache, provenance et absence d’ambiguïté.
Son format `{ "entries": [{ "sha256", "gitBlobOid", "bytes", "verified" }] }`
est accepté par l’option `verifiedHistoricalLfsMap` du provider. **Le provider
doit revalider SHA-256, longueur et OID Git pendant chaque lecture** contre le
pointeur du snapshot figé ; la map seule ne valide jamais les octets lus.

## Disponibilité dans un clone

Ces objets ne sont pas seulement des objets locaux orphelins. Les trois sont
présents dans l’arbre exact du snapshot, dans l’arbre de HEAD et dans celui de
`refs/remotes/origin/master` observé au commit
`2333c2c0c524414c6c7ab84ca86d7e3e40c187ac`. Ils sont également atteignables par
`rev-list --objects` depuis le snapshot et les refs locales.

Les copies Git natives se trouvent dans :

- `docs/cg/references/wave4-2026-10-20/elara/canonical-v2-portrait.png`
- `docs/cg/references/wave4-2026-10-20/nyra/canonical-selected-portrait-v2.png`
- `docs/cg/references/wave5-2026-10-22/jax-rook/canonical-selected-portrait-v2.png`

Les trois ont été ajoutées par
`d8aca0d799c734a56fc9eadecf366255ebecd8bd`, le 23 octobre 2026. La recherche de
commit était limitée à ces trois chemins, sans nouveau parcours de 80 000 noms.
[reachability.json](reachability.json) et [path-history.txt](path-history.txt)
conservent les commandes et résultats.

Un clone complet **sans filtre de blobs**, contenant cet arbre de référence,
possède donc ces trois blobs Git ordinaires. Cette preuve locale ne certifie
pas l’état futur du serveur distant, qui n’a pas été contacté. Un clone partiel
doit prouver la présence locale ; un export de code qui omet `.git` et ces
documents ne reçoit pas ces payloads par la seule présence de la map.

## Limite réelle du résultat

Les 1 948 autres cibles n’ont aucun candidat de même taille dans la base Git
locale examinée. Ce nombre comprend 202 payloads déjà vérifiés dans le cache LFS
séparé par le preflight. Après les trois récupérations Git, **1 746 payloads non
cachés restent sans source locale vérifiée**, soit **6 203 286 581 octets**.
L’hypothèse d’une récupération locale des six gigaoctets entiers n’est donc pas
confirmée. Une absence dans cette recherche locale n’est pas une preuve
d’absence sur le stockage LFS distant.

Aucun checkout, fetch, accès réseau, lazy fetch ou fichier média n’a été écrit.
La lecture utilise des blocs d’au plus 1 Mio et un cache de base delta Git fixé
à 16 Mio ; aucun cache de médias n’est constitué. Ce contrôle d’octets ne
certifie ni gameplay ni fidélité visuelle et ne clôt aucun dossier acteur.

## Reproduction

Depuis la racine du dépôt, avec le preflight épinglé :

```sh
taskset --cpu-list 0 python docs/assets/dlc-completion-2026-11-13/historical-lfs/index_historical_lfs.py --repo . --output /tmp/historical-lfs-recheck --asset-snapshot 3fb49277809f28d11d4886c847558fca6ee91f21
```

Le script impose `GIT_NO_LAZY_FETCH=1`, filtre d’abord les tailles puis lit les
candidats avec `git cat-file --batch`. Son répertoire de sortie contient
uniquement des métadonnées et journaux. L’index persisté ici retire la liste
redondante des 1 948 cibles non trouvées ; elle se reconstruit depuis le preflight
dont le SHA-256 est conservé.

[process-exit.json](process-exit.json), [scan-receipt.json](scan-receipt.json),
[candidate-metadata.json](candidate-metadata.json) et [scan.log](scan.log)
conservent le passage du script reproductible, terminé avec un code de sortie 0.
