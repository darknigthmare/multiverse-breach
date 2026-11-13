# Reçus de validation — 13 novembre 2026

Les [commandes](commands/manifest.json) conservent leurs vraies sorties et codes de retour. Les tentatives échouées ne sont jamais réétiquetées.

| Étape | Résultat et portée |
| --- | --- |
| integration-attempt-1 | 73/81 ; anciennes fixtures, registre tactique manquant dans le harness et deux limites de heap 4 Go. |
| integration-attempt-2 | 234/234, heap 8 Go et exécution séquentielle ; intégration et profils DLC intermédiaires. |
| final-source-targeted | 282/284 ; deux sons de tir verticaux Feral erronés, ensuite corrigés. |
| feral-post-sfx-tests | 31/31, dont ces deux branches et contrôle du tireur ordinaire. |
| new-art-and-bindings-tests | 29/29 ; sources, fichiers, identités, chargement et rôles. |
| rift-pixel-quality | 1 909 bitmaps mesurés et trois quarantaines explicites, sortie 0. Le premier catalogue de refresh est volontairement intermédiaire ; le deuxième incorpore ces mesures et rift-final-check sort 0. |
| completion-final-write/check, fidelity-final-write/check | 0 ; rapports courants synchronisés sur master 2333c2c0. |
| app-code-only-bundle | 0, 6,55 s ; Vite direct, prebuild contourné et public non recopié. 5 171 entrées inchangées. |
| normal-build-attempt | 1 ; premier prébuild assets:prepare bloqué par 9 007 sources DLC non matérialisées. Aucun cycle complet revendiqué. |
| final-lint, guidance-check | 0 ; les avertissements existants et de fixture restent dans le log. |
| reference-quarantine-negative-tests | 8/8 ; les absences non déclarées et fausses approbations sont rejetées. |

La [capture CG](cg-metadata/manifest.json) est explicitement limitée aux métadonnées, avec l’essai négatif et les 14 tests finaux. Les 1 436 déclarations de livraison et les snapshots publiés restent exacts ; leurs bitmaps historiques ne sont pas physiquement revalidés ici.

Les parcours navigateur sont conservés séparément sous [browser](../browser/README.md) : RUN1–4 gardent leurs découvertes initiales, RUN5 contrôle les portraits et deux rôles du masque, puis l’absence d’événements crossover après 26 s et plus de 1 560 mises à jour natives.

Les reçus d’export dans [backlog](../backlog/README.md) fixent par empreinte le graphe acteur et l’arbre Git projeté. Ce contrôle distingue vraie absence de raster, quarantaine et simple checkout partiel. Il ne certifie pas une fidélité 1:1 ni une livraison statique complète.

La [vérification Git](git-integrity/manifest.json) confirme la connectivité, les 1 491 PNG de combat antérieurs sans changement de blob, les packs persistants sans lien temporaire et les snapshots d’audit. Le contrôle de blancs exclut les logs/stdout bruts immuables et accepte les fins de ligne CRLF des CSV.
