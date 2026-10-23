# Mesures des combats — vague10, 23 octobre2026

Le lot compte quarante identités : The Matrix Reloaded, Stargate SG-1 saison4, Half-Life2, Fallout4, Aliens1986, PAYDAY2, Ghostbusters1984 et Left4Dead (versions individuelles). Les [mesures précédentes](baseline.json) et [métadonnées précédentes](runtime-baseline.json) restent conservées.

| Domaine | Mesure cumulative réelle |
| --- | --- |
| Actions de base explicites | 1475 héros, 4321 slots, 1402 kits complets |
| Libellés strictement génériques effectifs | 0 |
| Atlas de présentation complets32 | 155/1911, 4960 poses |
| Atlas partiels | 2, 32 poses ; exclus des complets |
| Mêlée complète45 | 10/1911 |
| Bases corrigées16 | 103 |
| Recettes de présentation | 163 héros, 1141 paires |
| Invocations/renforts natifs16 | 23 atlas |
| Mécanismes de décor | 321, 164/525 univers |
| PNG suivis | 372 images, 80 registres |

Manquants : 1756 héros sans atlas complet32, 1901 sans manifeste complet45 ; 361 univers gardent seulement leur ambiance de base. Les 525 univers possèdent une ambiance configurée.

Les tableaux distinguent des actions documentées, des dessins natifs générés et des adaptations de mécanique. Aucun résultat ne certifie une fidélité source1:1. Les anciens refus restent bloqués ; aucune pose rejetée n'est comptée comme livrée. Source1to1Verified=false.

Reproduire : `node scripts/combatFidelityAudit.mjs --write`, puis `node scripts/combatFidelityAudit.mjs --check`. La validation du build et des parcours est conservée séparément dans [validation.json](validation.json) et [browser-checks.json](browser-checks.json).
