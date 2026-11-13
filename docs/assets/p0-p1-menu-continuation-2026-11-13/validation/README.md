# Reçus de la reprise menus/P0/P1

Les fichiers gardent chaque commande, code de sortie et périmètre. Les passages successifs ne sont pas additionnés comme des tests uniques.

| Preuve | Résultat et portée |
| --- | --- |
| [Interface finale](hub-ui-standard-final.json) · [TAP](hub-ui-standard-final.tap) | 72 tests, huit suites Node/SSR ordinaires ; source et CSS épinglés. Le dernier amendement de répartition mobile CSS est vérifié séparément par Chromium et la compilation. |
| [Continuités](../locked-continuity/validation-exit.json) | 99 tests, lecture exacte des contrats, refus des faux contrats, export et non-mutation. Deux attentes R9 périmées ont d’abord été reproduites sur HEAD ; logs conservés. |
| [Pirates](../art/aztec-medallion/runtime-validation.json) | 25 tests SSR/contrat pour le panneau, ses gardes et sa publication, aucun combat de finale complet. |
| [Publication finale](dlc-publication-final.json) · [TAP](dlc-publication-final.tap) | 85 tests ; 508 manifests/ignores identiques avant/après. |
| [Portée des deux PNG](dlc-new-assets-publication-scope.json) | Médaillon connecté au panneau exact ; atlas Neff candidat sans raccord ni clôture de boss. |
| [Navigateur](../browser/manifest.json) | Captures de sept espaces, dix groupes d’actions natifs avec parent préparé, contrôle français/anglais et texte 150 %. |
| [Compilation finale](code-build-final.json) · [log](code-build-final.log) | Application entière, sortie 0, Vite direct, sans prébuild/public. 5 227 sources identiques pendant le passage ; seul HubWorkspaceFrame.css diffère du passage précédent. |
| [Cycle de build tenté](build-source-receipts.json) · [échec normal](normal-build.log) | Build normal sortie 1, assets:prepare arrête sur 9 007 sources non matérialisées ; aucun test ultérieur du prébuild ne s’est exécuté dans cette commande. |
| [Lint ciblé](changed-source-lint.json) · [log](changed-source-lint.log) | Sortie 0, zéro erreur, avertissement Fast Refresh limité à la fixture de test. |
| [Export réel](actor-export-exit.json) · [empreintes](../backlog/source-inputs.json) | Sortie 0 ; 1 784 sources chargées correspondent à l’arbre immuable de l’audit. |
| [Comparaison de backlog](../backlog/global-source-findings-delta-exit.json) | Sortie 0, anciennes baselines conservées, seuls les 62 remplacements attendus de tâches. |

Les données déclarées, la présence d’un PNG et un test de rendu ne certifient pas une fidélité 1:1. Les fontes Google sont bloquées dans la fixture pour reproductibilité ; le monospace système apparaît dans les captures. Les sauvegardes réelles, comptes, cloud et toute la progression ne sont pas couverts par ce parcours de menus.
