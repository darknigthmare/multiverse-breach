# Mesures des combats — vague9, 22 octobre2026

Le lot compte vingt identités : Gears of War2, Mass Effect (versions individuelles), Ghost in the Shell SAC2002 et Resident Evil (versions individuelles). Les [mesures précédentes](baseline.json) et [métadonnées précédentes](runtime-baseline.json) restent conservées.

| Domaine | Mesure cumulative réelle |
| --- | --- |
| Actions de base explicites | 1458 héros, 4270 slots, 1385 kits complets |
| Libellés strictement génériques effectifs | 0 |
| Atlas de présentation complets32 | 116/1911, 3712 poses |
| Atlas partiels | 1, 8 poses ; exclus des complets |
| Mêlée complète45 | 8/1911 |
| Bases corrigées16 | 64 |
| Recettes de présentation | 123 héros, 861 paires |
| Invocations/renforts natifs16 | 15 atlas |
| Mécanismes de décor | 241, 124/525 univers |
| PNG suivis | 273 images, 67 registres |

Manquants : 1795 héros sans atlas complet32, 1903 sans manifeste complet45 ; 401 univers gardent seulement leur ambiance de base. Les 525 univers possèdent une ambiance configurée.

Les tableaux distinguent des actions documentées, des dessins natifs générés et des adaptations de mécanique. Aucun résultat ne certifie une fidélité source1:1. Les anciens refus restent bloqués ; aucune pose rejetée n'est comptée comme livrée. Source1to1Verified=false.

Reproduire : `node scripts/combatFidelityAudit.mjs --write`, puis `node scripts/combatFidelityAudit.mjs --check`. La validation du build et des parcours est conservée séparément dans [validation.json](validation.json) et [browser-checks.json](browser-checks.json).
