# Lot 10 — 40 personnages, 23 octobre 2026

Matrix Reloaded : Neo, Trinity, Morpheus, Smith et Seraph. Stargate SG-1 saison 4 : O’Neill, Teal’c, Carter, Daniel et Hammond. Half-Life 2 : Freeman, Barney, Alyx, Eli et Kleiner. Fallout 4 : Danse, Nick Valentine, Dogmeat, Piper et Preston. Aliens : Hicks, Vasquez, Bishop, Ripley et Hudson. PAYDAY 2 : Dallas, Wolf, Hoxton, Chains et Clover. Ghostbusters 1984 : Venkman, Ray, Winston, Egon et Janine. Left 4 Dead : Bill du premier jeu ; Ellis, Coach, Rochelle et Nick du second.

Livré et mesuré : **39 atlas complets de 32 poses**, **1 atlas partiel (24 poses)**, **39 bases de 16 poses**, **2 manifestes Mêlée de 45 états** et **8 renforts de 16 poses**. Ces assets représentent **2384 poses natives dans 99 nouveaux PNG**. Les dessins rejetés et les supports de contrôle sont exclus. Quarante recettes donnent à chaque personnage sept scènes de combat ; leurs clocks sélectionnent les gestes natifs sans déformer leur corps.

Les bases de 16 poses couvrent quatre états généraux ; elles ne constituent pas une animation distincte de chaque capacité. Par exemple, le secondaire au zat d’O’Neill n’a pas de planche dédiée dans ce lot. Les 45 états complets ajoutés concernent Neo et Freeman.

Les attaques utilisent les gestes et équipements de la version choisie. Neo et Smith combattent physiquement ; les répliques et réécritures du code ne deviennent pas des pouvoirs. Freeman distingue le Gravity Gun orange et la version bleue surchargée qui relance une sphère Combine. Carter tire avec son P90. Nick Valentine emploie son revolver artisanal. Dogmeat reste quadrupède. Ripley pilote le véritable P-5000 dessiné dans son atlas. Les informations d’Egon, Daniel, Janine ou Coach soutiennent les alliés sans attaque de scanner, téléphone ou voix. Les impacts et coûts restent décidés une seule fois par le moteur.

| Couverture cumulative | Mesure réelle |
| --- | --- |
| Actions simples, secondaires et défenses explicites | 1475 héros, 4321 actions |
| Libellés strictement génériques effectifs | 0 |
| Atlas natifs complets de 32 poses | 155/1911 ; 1756 encore manquants |
| Atlas partiels | 2, suivis séparément |
| Mêlée complète de 45 états | 10/1911 ; 1901 encore manquants |
| Bases corrigées de 16 poses | 103 héros |
| Présentations | 163 héros, 1141 paires héros/phase |
| Invocations et renforts natifs de 16 poses | 23 atlas |
| Décors | 321 mécanismes dans 164/525 univers |
| Univers avec ambiance de base seule | 361 |

Les nouveaux renforts sont Trinity, Teal’c, Alyx, Nick Valentine, Hicks, Chains, Egon et Coach. Les huit paires principales et les 32 appelants servis par ces atlas restent dans leur univers ; huit autres appelants choisissent un partenaire réel différent pour éviter l’auto-appel. Les cellules 512×256 conservent la portée des armes et la stature humaine commune. Les anciens PNG et registres restent vérifiés. Dix appels historiques du lot Half-Life/PAYDAY passent explicitement de Dog/Sentry à un partenaire, tandis que les autres anciens bindings sont préservés. [Sources et corrections des renforts](summon-provenance.json).

Les [décors](stage-coverage.md) ajoutent 80 mécanismes à 40 univers auparavant limités à l’ambiance de base. Les 241 définitions et 482 signatures Canvas précédentes restent contrôlées. Les 525 univers conservent leur ambiance configurée.

Les sources originales, prompts exacts, arguments, références, corrections et incidents techniques sont conservés dans les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json). Janine conserve six phases natives (24 poses) ; la correction des phases super/finale a reçu un refus explicite de l’outil et ces deux phases et les actions ordinaires réutilisent explicitement les poses acceptées, sans les compter comme nouvelles phases ni base16. Aucune nouvelle base16 de Janine n’est livrée. [Refus conservé](part-d-sources/janine_gb-phone-correction-refusal.json). Les anciens refus ne sont pas retentés sous un alias. **Les dessins générés et les mécaniques sont des adaptations ; aucune fidélité source 1:1 n’est certifiée.**

L’audit des références contrôle toujours les 1912 chemins courants et mesure aussi l’ancien PNG de Freeman comme cas historique de calibration. Ce correctif conserve tous les seuils, attentes et fonctions de classification ; une référence historique absente ou dégradée échoue encore. [Correctif et cinq tests de régression](rift-refresh/retired-known-case-regression.json).

Build complet réussi (code0), 1368 tests. Validation de distribution des PNG et preuves navigateur : [validation.json](validation.json).

[Mesures](current.json) · [Couverture des 1911 héros](coverage.csv) · [Preuves navigateur](browser-checks.json) · [État W9 conservé](baseline.json).

Reproduire : `node scripts/combatFidelityAudit.mjs --check`, puis `node docs/combat-fidelity-wave10-2026-10-23/build-coverage.mjs`.
