# Lot9 — 20 personnages, 22 octobre2026

Gears of War2 : Marcus, Dom, Cole, Baird, Hoffman. Mass Effect : Shepard Soldat ME2, Garrus ME2, Liara Lair of the Shadow Broker, Tali ME2, Wrex ME1. Ghost in the Shell : Motoko, Batou, Togusa, Aramaki et Saito, tous SAC saison1. Resident Evil : Chris RE5, Claire RE2 2019, Ada Separate Ways2005, Barry RE2002, Carlos RE3 2020.

Livré et mesuré : **20 atlas complets32**, **20 bases16**, **1 manifeste complet45 états** et **4 renforts16**. Cela représente **1204 poses natives dans 50 PNG supplémentaires**, sans compter les dessins rejetés ni les supports de contrôle comme assets. Vingt recettes de présentation et vingt projections de super sont enregistrées.

Les actions utilisent l’équipement et les rôles des versions choisies : Concussive Shot quitte une arme, le Mako et les capacités de classes étrangères sont retirés de Shepard ; les slogans de Gears ne deviennent plus des pouvoirs. Les attaques de Motoko, Batou, Togusa et Saito restent physiques. Aramaki et Hoffman commandent, Baird entretient le matériel, Wrex protège son propre corps. Le drone Attack Drone de Tali frappe une seule cible. Les frappes Hammer of Dawn et Satellite Laser viennent de l’extérieur, distinctes de leurs désignateurs portables.

| Couverture cumulative | Mesure réelle |
| --- | --- |
| Actions simples, secondaires, défenses | 1458 héros, 4270 actions explicites |
| Libellés strictement génériques effectifs | 0 |
| Atlas natifs complets32 | 116/1911 ; 1795 encore manquants |
| Atlas partiels | 1 ; conservés séparément |
| Mêlée complète45 états | 8/1911 ; 1903 encore manquants |
| Bases corrigées16 | 64 héros |
| Recettes de présentation | 123 héros, 861 paires héros/phase |
| Invocations et renforts16 | 15 atlas |
| Décors | 241 mécanismes, 124/525 univers ; 401 avec ambiance de base seule |

Les quatre nouveaux renforts sont Dom (appel de Marcus), Garrus (Shepard), Batou (Motoko) et Leon (Chris). Leon est un partenaire déjà présent dans le roster, distinct des vingt nouveaux personnages traités. Les cellules512×256 préservent la portée des armes et la stature commune190. Le renderer n’ajoute ni corps procédural ni dégâts supplémentaires. [Provenance des renforts](summon-provenance.json).

Les [décors](stage-coverage.md) ajoutent quarante mécanismes pour vingt univers auparavant limités à une ambiance de base. Les201 mécanismes et402 signatures Canvas précédents restent contrôlés. Les525 univers gardent leur ambiance configurée.

Les poses ont été générées nativement puis segmentées, calibrées et emballées. Les sources originales, prompts exacts, arguments, références et corrections sont conservés : [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json), [D](part-d-provenance.json). Les anciens refus ne sont ni retentés sous un alias ni marqués livrés. Les animations et la mécanique sont des adaptations ; **aucune fidélité source1:1 n’est certifiée**.

Build complet réussi (code0), 1294 tests. Validation de distribution des PNG et preuves navigateur : [validation.json](validation.json).

[Mesures](current.json) · [Lecture](current.md) · [Couverture des1911 héros](coverage.csv) · [Preuves navigateur](browser-checks.json) · [Référence W8](baseline.json). Les nombres de poses, cellules, dessins Canvas et parcours sont suivis séparément.

Reproduire : `node scripts/combatFidelityAudit.mjs --check`, puis `node docs/combat-fidelity-wave9-2026-10-22/build-coverage.mjs`.
