# Contrôler la couverture des médias avant publication

Le contrôle d’un arbre assemblé distingue maintenant les lots terminés, les lots interrompus et les lots du plan jamais reçus. Fournir le plan d’origine et l’empreinte communiquée à sa création. Le contrôle vérifie chaque reçu contre sa liste de fichiers figée. Il recalcule l’identité des blobs Git natifs et la somme SHA-256 des médias LFS sur les octets assemblés. Cette étape fonctionne sur le volume de destination avec le plan, le journal et les médias locaux. [Recette d’assemblage](../../../assets/dlc-batch-export-2026-11-20/ASSEMBLY.md)

```sh
node scripts/applyDlcAssetBatch.mjs --check /volume/medias-doom \
  --plan /volume/doom-plan.json \
  --expected-plan-sha256 03442fc32a3f538a95ed9f63f11aefea741ad4b114f0c348f9ab0c5677607e16 \
  --require-complete
```

`coverage.missingBatchIds` indique les lots jamais reçus. `pendingBatches` continue à désigner les lots inscrits dans le journal dont la copie reste incomplète. Avec `--require-complete`, la commande rend son rapport et renvoie le code `1` si des médias prévus restent à fournir. Un reçu, un plan ou un média altéré fait échouer le contrôle. Une fois les médias complets, l’export et la compilation de l’édition suivent leurs commandes habituelles.

Le contrôle strict du vrai plan Doom vérifie **60 médias** et **2 lots complets**. Il signale **315 lots manquants** sur 317, soit 7 633 médias à fournir sur 7 693. La commande a renvoyé le code `1` malgré l’absence de copie locale en cours. Les exemples réels restent sur un volume temporaire. [Rapport du plan Doom](doom-strict.json)

Une petite édition synthétique avec un pack sélectionné a passé le contrôle complet, l’export et la compilation Vite. Le build inclut le module du pack et publie les deux PNG assemblés. La diffusion de l’édition Doom complète reste ouverte. [Vérification](verification.json)
