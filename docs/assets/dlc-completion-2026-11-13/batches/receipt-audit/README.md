# Audit indépendant des reçus v2

`audit_receipts.py` utilise Python et les objets Git figés ; il n’exécute aucun
des huit modules du producteur. Il ne modifie ni le plan, ni les reçus, ni les
scripts de production, et ne télécharge aucun payload LFS.

## Contrôles

- Recomposition du SHA-256 canonique du plan, de chaque lot et de chaque reçu.
- Vérification exhaustive des inventaires et références UI attendus dans le
  commit, pour détecter aussi l’omission d’un manifeste ou d’un pack.
- Reconstruction de la sélection depuis les manifestes et inventaires Git ;
  comparaison des chemins publics/canoniques, propriétaires et déclarants.
- Contrôle des OID Git, tailles de blobs et pointeurs LFS, dont le SHA-256 et
  la longueur du payload attendu.
- Contrôle de l’identité des huit fichiers du runner, du profil, du layout,
  des IDs, limites et statuts par asset et par lot.
- Distinction des images effectivement décodées dans les reçus et des formats
  explicitement limités à l’intégrité des octets. Aucune seconde décompression
  des images n’est réalisée par l’audit.
- Comparaison finale exacte avec les compteurs et octets de `run-summary.json`.
  Un échantillon partiel peut naturellement précéder ou suivre sa dernière mise
  à jour ; cette différence est affichée, sans considérer les lots en attente
  comme validés.

## Utilisation

```sh
python docs/assets/dlc-completion-2026-11-13/batches/receipt-audit/audit_receipts.py --self-test
python docs/assets/dlc-completion-2026-11-13/batches/receipt-audit/audit_receipts.py \
  --run-dir docs/assets/dlc-completion-2026-11-13/batches/verified-v2 \
  --out docs/assets/dlc-completion-2026-11-13/batches/receipt-audit/partial-audit.json
```

Après la fin du run et de ses éventuelles reprises, effectuer la vérification
indépendante des SHA-256 natifs :

```sh
python docs/assets/dlc-completion-2026-11-13/batches/receipt-audit/audit_receipts.py \
  --run-dir docs/assets/dlc-completion-2026-11-13/batches/verified-v2 \
  --require-complete --hash-raw-git \
  --out docs/assets/dlc-completion-2026-11-13/batches/receipt-audit/final-audit.json
```

Cette dernière étape streame une fois les 16 983 blobs Git natifs uniques,
soit 8 502 875 611 octets pour le plan v2 actuel. Le buffer est limité à 1 Mio ;
aucun média n’est persisté. Un index compact des OID, tailles et SHA-256 est
enregistré dans `native-git-sha256-index.json.gz`. Pour les payloads LFS, le
SHA-256 du reçu est comparé au pointeur Git canonique, sans retéléchargement.

Un rapport partiel indique explicitement combien de SHA-256 natifs restent à
relire indépendamment. Les SHA lient les données et reçus au plan : ils ne sont
pas une signature d’authentification. Cet audit ne certifie ni la fidélité
artistique 1:1, ni un build assemblé, une installation ou un déploiement.
