# Combat et animations — vague 7, 20 octobre 2026

Cette vague livre **932 poses utilisées dans 38 PNG** : 15 atlas de présentation × 32 poses, 14 corrections de base × 16, 1 nouveau manifeste complet de Mêlée (180 poses) et 3 entités × 16. Le bilan repose sur les fichiers réellement livrés, leurs empreintes et leur raccord au runtime. **La fidélité source 1:1 reste non certifiée.**

| Couverture cumulée | Livraison réelle | Lacune distincte |
| --- | --- | --- |
| Présentations natives | 80 héros, 2560 poses | 1831 héros sans atlas de présentation dédié |
| Manifestes complets de Mêlée | 6 héros, 45 états × 4 cellules par héros | 1905 héros sans manifeste complet |
| Corrections de base | 27 héros, 432 poses | Comptage séparé des présentations et des 45 états |
| Invocations et renforts natifs | 7 atlas, 112 poses | Les 28 feuilles historiques à quatre poses restent conservées |
| Présentations scriptées | 84 recettes, 83 héros du roster, 581 paires héros/phase | 12796 paires utilisent les présentations communes |
| Mécanismes de décor | 161 profils, 84 univers ; 80 couverts dans les quatre modes | 441 univers ont seulement leur ambiance de base |
| Capacités documentées | 1444 héros, 4228 slots, 1371 kits complets et 73 correctifs partiels | 0 libellé générique strict dans la résolution ; cela ne certifie pas la fidélité visuelle |
| Inventaire des fichiers | 179 PNG distincts dans 45 registres d’assets | Les fichiers partagés ne sont comptés qu’une fois ; aucun fichier refusé n’est livré |

Les 1911 héros et 525 univers restent sans certification source 1:1, y compris les contenus natifs. Les huit rangées d’un atlas de présentation et les sept phases de script sont deux couvertures différentes ; un atlas de 32 poses ne prouve pas un manifeste de 45 états.

## Personnages, versions et refus

Les nouveaux atlas de présentation effectivement livrés concernent : Ragna the Bloodedge, Jin Kisaragi, Noel Vermillion, Rachel Alucard, Hazama, Han Solo, Leia Organa, Kenshin Himura, Sanosuke Sagara, Kaoru Kamiya, May, Dizzy, Millia Rage, Axl Low, Baiken. Les scripts W7 comprennent 18 recettes enregistrées ; leurs 18 helpers acceptent les capacités réellement résolues.

BlazBlue suit Continuum Shift Extend ; Guilty Gear suit Xrd REV 2. Les variantes de tenue, d’équipement et d’action restent explicites. Les [révisions de rôle et de source](role-and-source-revisions.json) documentent notamment les sabres de Luke et Vader, le DL-44 de Han, Sickle Storm d’Axl et Azami de Baiken. Elles ne donnent pas de dégâts à une musique ou au Kessel Run. Les costumes et armes des remplacements Kenshin, Sanosuke et Kaoru sont référencés dans leurs provenances.

Les présentations natives de **Luke et Vader ont été refusées** ; leurs bases n’ont pas été tentées après l’arrêt de leur production. La présentation native **et la base d’Obi-Wan ont été refusées**. La **base de Leia a été refusée deux fois** ; sa présentation acceptée est comptée séparément. Aucune image refusée ou non tentée n’est livrée. Les anciens sprites fournissent les poses disponibles aux emplacements sans nouvel asset. Les [tentatives B](part-b-attempts.json) et [la livraison B](part-b-delivery.json) distinguent précisément ces états, sans les convertir en succès ou en image source certifiée.

## Sources et preuves

Les [provenances A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et les corrections [de base A](base-part-a-provenance.json), [B](base-part-b-provenance.json), [C](base-part-c-provenance.json) relient prompts, sorties natives, sources locales, normalisations, empreintes et limites de version. Une URL indexée ou refusée n’est pas présentée comme une page intégralement lue. Les anciennes sources et registres restent des références immuables.

Ragna dispose du nouveau manifeste complet : [mouvement](ragna-sources/provenance-motion.json), [combat](ragna-sources/provenance-combat.json), [prise et contacts](ragna-sources/grip-pixel-checks-combat.json). Les preuves Chromium couvrent [les états et prises aux rebords](browser/ragna-core-result.json), [le déplacement au clavier et la pause](browser/ragna-movement-result.json), puis [Carnage Scissors à froid](browser/ragna-super-result.json) et [le bilan consolidé de Ragna](browser/ragna-evidence.json). Ces contrôles portent sur les images et les coordonnées effectivement utilisées ; ils ne certifient pas les frames du jeu original.

Les [trois nouvelles entités](README-invocations.md) sont Bahamut FFVII original, la baleine rose Yamada et les Black Egrets modernes sans brassards rouges. Les 48 poses natives ont été contrôlées dans les deux orientations et dans les vrais parcours GameCanvas. L’inspection a trouvé puis fait corriger une surcouche Megaflare décalée ; le diagnostic avant correction reste archivé.

Les [24 mécanismes de décor supplémentaires](stage-coverage.md) couvrent douze univers auparavant absents. Les [137 anciennes définitions et 274 signatures Canvas](stage-baseline.json) restent identiques. Les géométries sont des adaptations de machines ou de lieux précis, avec exclusions de continuité, temps de simulation et pause/mouvement réduit. Aucun danger, dégât, déplacement jouable ou frame officielle n’est ajouté.

Le [CSV de couverture](coverage.csv) conserve exactement 1911 lignes de héros dans l’ordre précédent : atlas natif, manifeste complet, base corrigée, script, ambiance et mécanisme par mode, avec statut source toujours non certifié. Le [générateur](build-coverage.mjs) lit les registres et vérifie les routes réelles avant d’écrire ce fichier ; il refuse de compter les images refusées. L’[agrégat des preuves Chromium](browser-checks.json) garde les compteurs de dessin, cellules et parcours séparés, ainsi que la panne externe Google Fonts observée par certains harnesses. Les [mesures JSON](current.json) et [leur lecture](current.md) conservent les détails et les empreintes d’entrée. Les [baselines](baseline.json) et [métadonnées avant intégration](runtime-baseline.json) ne sont pas réécrites.

## Validation

Les [tests des supers W7](../../scripts/nativeSuperRuntimeWave7.test.mjs) et [des contacts W6/W7](../../scripts/combatContactVisualWave6.test.mjs) restent distincts des preuves d’assets et de présentation. Les contrôles ciblés des décors et des invocations passent ; les preuves détaillées figurent dans leurs rapports et harness Chromium. Les huit tests d’invocation W7 et quarante tests historiques W5/W6 passent ensemble après correction de Bahamut. Le parcours navigateur enregistre 48 cellules J1, 48 J2, 48 miroirs RGBA exacts et un impact par entité sans erreur de page.

**La compilation complète est passée (code 0). La validation consigne 1171 tests réussis dans 17 suites, sans échec.** Voir [validation.json](validation.json), le [journal de compilation](build.log) et les [preuves Chromium](browser-checks.json). Ces résultats ne certifient pas la fidélité source 1:1.

Reproduction depuis la racine :

```sh
node scripts/combatFidelityAudit.mjs --check
node docs/combat-fidelity-wave7-2026-10-20/build-coverage.mjs
```
