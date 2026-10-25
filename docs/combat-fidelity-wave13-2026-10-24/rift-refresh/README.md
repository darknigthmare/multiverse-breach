# Rafraîchissement Rift — lot 13

Les cinq commandes normales ont terminé avec le code de sortie `0`, dans l’ordre prévu. Les étapes 1 et 2 ont réellement terminé le 24 octobre 2026. Après remplacement de l’environnement, la reprise contrôlée du 25 octobre a conservé ces deux reçus et leurs horaires. Les étapes 3 à 5 ont attendu le signal root et la fermeture de tous les navigateurs finaux.

| Étape | Commande exécutée | Début UTC | Fin UTC | Code | Journal |
| --- | --- | --- | --- | --- | --- |
| 01-catalog-refresh | `node scripts/buildRiftDossierCatalog.mjs --refresh-character-reference-audit` | 2026-10-24T03:01:08.868070+00:00 | 2026-10-24T03:01:14.000579+00:00 | 0 | [01-catalog-refresh.log](01-catalog-refresh.log) |
| 02-character-reference-audit | `python scripts/auditCharacterReferenceQuality.py` | 2026-10-24T03:01:14.016191+00:00 | 2026-10-24T03:07:58.223596+00:00 | 0 | [02-character-reference-audit.log](02-character-reference-audit.log) |
| 03-catalog-build | `node scripts/buildRiftDossierCatalog.mjs` | 2026-10-25T06:29:49.012023+00:00 | 2026-10-25T06:29:54.595991+00:00 | 0 | [03-catalog-build.log](03-catalog-build.log) |
| 04-asset-registry-build | `node scripts/buildRiftDossierAssetRegistry.mjs` | 2026-10-25T06:29:54.612288+00:00 | 2026-10-25T06:29:55.531757+00:00 | 0 | [04-asset-registry-build.log](04-asset-registry-build.log) |
| 05-rift-audit | `npm run rift:audit` | 2026-10-25T06:29:55.548085+00:00 | 2026-10-25T06:30:02.017208+00:00 | 0 | [05-rift-audit.log](05-rift-audit.log) |

La reprise est enregistrée à `2026-10-25T06:22:08.413842+00:00`. Le [résultat interrompu exact](interrupted-after-reference-audit-20261025T062208413861Z/result.json) conserve les octets originaux, SHA-256 `d84ac931dc031cc764c6faf20abecc9d6b6964f1041b94233eeadac096d7ab37`. Le `startedAt` initial et les deux premiers objets `steps` sont inchangés ; aucun succès ni horaire n’a été reconstitué.

La gate root a été créée à `2026-10-25T06:29:44.742Z`, après sept rapports finaux réussis et zéro processus Chromium vivant. Le runner a vérifié les références figées et les entrées du gel avant la troisième commande.

## Mesures

- Catalogue : **3 199 entrées**, dont **1 912 arcs de personnages** ; aucun ajout de stage.
- Références : **35 chemins modifiés**, tous approuvés avec leurs SHA-256 actuels ; **5 références historiques conservées** pour Vader, Ahsoka, Obi-Wan, Yoda et Darth Maul.
- Audit global des références : **1 912 approuvées sur 1 912**, aucun fichier manquant, aucun rejet ni cas à revoir.
- Registre de disponibilité : **1 030 disponibles et 2 169 pending**, identique au relevé précédent ; aucun statut restauré ou forcé.
- **24 prompts de personnages révisés**, tous déjà `pending` et toujours `pending` après le rafraîchissement.

Les scripts historiques de catalogue, de registre et d’audit ainsi que `package.json` sont inchangés. Le Python historique conserve le SHA-256 `de13d252fb7675b3715be22c6c0bcf5d51d02675ae35c62be622a6606db14edb`. Ses seuils, cas connus et empreintes approuvées manuellement restent identiques.

Une référence de personnage approuvée ne certifie pas la disponibilité d’une image de dossier. Les cinq dessins historiques réutilisés ne comptent comme aucune nouvelle pose native. Aucune certification visuelle 1:1 n’est déclarée.

[Résultat des commandes](result.json) · [Synthèse mesurée](summary.json) · [Deltas de disponibilité et prompts](registry-availability-delta.json) · [Vérification finale des empreintes](final-integrity.json) · [Autorisation des références](authorization.json) · [Gate root](allow-final-writes.json)
