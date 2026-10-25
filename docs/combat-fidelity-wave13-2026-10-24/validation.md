# Validation finale du lot 13

Le build réel npm run build s’est terminé avec le code **0**, suivi du contrôle HTTP de tous les PNG de production.

- **1569 tests dans 18 groupes** ; aucun échec, test ignoré ou annulé. Lint et contrôle des espaces réussis.
- **35 atlas de 32 poses**, **35 bases de 16 poses**, Ripley en **45 états et 180 poses** et **6 renforts RPG de 16 poses** : **1956 poses et 82 nouveaux PNG** livrés.
- **638 PNG et 111 registres** vérifiés ; les 556 PNG et 104 registres historiques sont préservés.
- **12 flux RPG SSR et 12 flux GameCanvas**, dix impacts offensifs uniques, deux soutiens sans dégât et 192 vérifications de réflexion des pixels.
- **Trois terrains Tactics verticaux réellement jouables** dans Combat custom : pont, terrasses et passerelles. Les déplacements, escaliers, rampes, occupations, lignes de vue, objectifs et coupes visuelles utilisent les étages. Trois lancements réels et seize contrôles UI passent ; les 66 tests de terrain font partie du build requis.
- Les cinq commandes Rift ont réussi dans l’ordre, avec les 40 références liées à leur SHA actuel. Le Python et ses seuils historiques restent inchangés ; les statuts pending réellement observés sont conservés.
- **2501 entrées gelées** correspondent encore à l’audit ; le finaliseur était gelé avant le build.

Atlas manquants : **vader, obi_wan, yoda, darth_maul, ahsoka_adult** après refus explicites ; les sources invalides et anciennes poses réutilisées ne comptent pas comme livraison. Les nouvelles images sont des adaptations générées et revues : **la fidélité officielle 1:1 n’est pas certifiée**.

Détails : [validation.json](validation.json), [deliverables.json](deliverables.json), [preuves navigateur](browser-checks.json), [reçu du build](build-exit.json), [contrôle HTTP](browser/production-assets-http.json), [bilan Rift](rift-refresh/summary.json) et [guide du moteur Tactics](../tactics-terrain-verticality.md).
