# Mesures des combats — vague11, 23 octobre2026

Le lot compte quarante identités : Buffy saison7, Harry Potter et le Prince de sang-mêlé, Stargate Atlantis saison3, Stargate Universe saison1, Borderlands2009, Mad Max FuryRoad2015, Le Cinquième Élément1997 et Kaamelott LivreIII. Harry, Hermione et Rogue restent explicitement en repli : aucun nouveau32, base16 ou renfort16 refusé n’est compté comme livré. Les [mesures précédentes](baseline.json) et [métadonnées précédentes](runtime-baseline.json) restent conservées.

| Domaine | Mesure cumulative réelle |
| --- | --- |
| Actions de base explicites | 1491 héros, 4369 slots, 1418 kits complets |
| Libellés strictement génériques effectifs | 0 |
| Atlas de présentation complets32 | 192/1911, 6144 poses |
| Atlas partiels | 2, 32 poses ; exclus des complets |
| Mêlée complète45 | 12/1911 |
| Bases corrigées16 | 140 |
| Recettes de présentation | 203 héros, 1421 paires |
| Invocations/renforts natifs16 | 30 atlas |
| Mécanismes de décor | 401, 204/525 univers |
| PNG suivis | 465 images, 93 registres |

Manquants : 1719 héros sans atlas complet32, 1899 sans manifeste complet45 ; 321 univers gardent seulement leur ambiance de base. Les 525 univers possèdent une ambiance configurée.

Les tableaux distinguent des actions documentées, des dessins natifs générés et des adaptations de mécanique. Aucun résultat ne certifie une fidélité source1:1. Les anciens refus restent bloqués ; aucune pose rejetée n'est comptée comme livrée. Source1to1Verified=false.

Reproduire : `node scripts/combatFidelityAudit.mjs --write`, puis `node scripts/combatFidelityAudit.mjs --check`. La validation du build et des parcours est conservée séparément dans [validation.json](validation.json) et [browser-checks.json](browser-checks.json).
