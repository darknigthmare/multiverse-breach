La revue indépendante W10 passe **16 domaines sur 16**, après le dernier gel des corrections. Le [rapport détaillé](independent-review.json) contient les résultats et les SHA de 22 entrées utilisées. Reproduction depuis la racine du projet :

```sh
node docs/combat-fidelity-wave10-2026-10-23/independent-review.mjs
```

Le script charge la production par Vite SSR et exécute réellement `EngineRpg` et `EngineFighter`. Les dégâts, collisions, boucliers, cibles et coûts restent décidés par ces moteurs. Un contexte Canvas enregistre les coordonnées effectivement dessinées, vérifie les nombres finis et contrôle la restauration du contexte.

| Contrôle observé | Résultat |
| --- | ---: |
| Identités et projections pures | 160 cas, 40 héros |
| Ancres actives au centre d’un pixel visible du PNG natif | 103 points |
| Projections d’ancres, deux camps et deux tailles | 412 |
| Projections après impact, avec contact accepté ou refusé | 204 |
| Supers RPG sur cible protégée, morte, retirée ou acceptée | 200 actions |
| Supers de soutien avec effet allié et aucun dégât ennemi | 30 actions |
| Projectiles Fighter depuis la bouche native mesurée | 34 parcours |
| Renforts offensifs protégés / déplacés après KO / cibles mixtes | 12 / 12 / 36 actions |
| Egon et Coach : soutien sans tir ni perte de PV | 4 actions |
| Annulation, coût unique, pause et interruption de l’appelant | 48 commandes interrompues |
| Ancres et fin du trajet des huit renforts | 64 projections |

Les 15 anciennes invocations conservent leurs métadonnées complètes et leurs PNG. Les 11 premières gardent leur contrat historique de coordonnées courantes ; les quatre W9 gardent leurs contacts figés. Les 28 anciens PNG et les 280 échantillons de géométrie des 28 chorégraphies sont préservés. Les 72 anciens liens d’appelants restent identiques ; les dix remplacements Half-Life/Payday du lot sont explicites. Adrian Shephard conserve Dog.

Le [premier essai](independent-review-fixture-attempt-1.json) archive trois hypothèses du harnais corrigées : une colonne préparatoire non tirante de Teal’c, la sérialisation JSON de `-0`, et les soutiens sans table d’ancres. Ces corrections de tests ne représentent aucun correctif de production. Le [passage avant remesure](independent-review-before-anchor-remesurement.json) conserve les contrôles de comportement antérieurs à la lecture des pixels centraux. Les remesures A et C et la correction native de Nick sont documentées dans leurs propres preuves.

Les pixels contrôlés proviennent des atlas générés locaux. La visibilité d’une ancre et la cohérence de sa projection ne certifient pas une animation officielle à l’échelle 1:1 : `source1to1Verified` reste `false`. Les [preuves navigateur](browser-checks.json), la compilation et la distribution HTTP ont leurs validations séparées.
