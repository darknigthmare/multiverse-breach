# Continuation Bible et CG — état du 9 novembre 2026

La branche `codex/cg-bible-continuation-2026-11-09` reprend la base amont `057646da62061e9d37724f431cdc0278661432eb`, incluant les trois derniers commits Kart et située 60 commits devant `master` (`3036cd02…`). Les médias nécessaires sont hydratés. Cette livraison ajoute les deux séries CG, leurs atlas et leurs références au dépôt.

## Livraison et couverture

**30 nouvelles CG sont intégrées : quinze pour Hicks et quinze pour Feral Predator.** Deux atlas de seize poses sont activés ; les anciens sprites restent accessibles comme variantes `original`. Les anciens CG, révisions, essais et preuves sont conservés.

| Identifiant et classement conservés | Incarnation précise | CG13 exclusive | CG15 |
| --- | --- | --- | --- |
| `hicks`, univers historique `Alien` | Michael Biehn dans *Aliens* (1986), Colonial Marine intact | `genderSwap` | `futureExperienced` |
| `feral_predator`, univers `Prey` | Feral Predator masqué de *Prey* (2022) | `iconicOutfitSwap` USCM | `futureExperienced` |

Hicks conserve son identifiant et son propriétaire DLC historique. *Prey* désigne le film de 2022, sans mélange avec le jeu de 2006.

Chaque série suit les quinze thèmes : Canon pour CG01–04 et CG06–08, Nexus pour CG05, Fan Art familial pour CG09–11, What If pour CG12–15. Les décors et compositions sont distincts ; les scènes avec personnage varient les poses. CG02 présente l'équipement seul, CG03 un décor vide. Les adaptations Nexus, Fan Art et What If ne deviennent pas des faits du film.

| Mesure actuelle | Total |
| --- | ---: |
| CG courantes / versions conservées / médias | 1436 / 1530 / 4590 |
| Personnages avec sprite corrigé sélectionné | 62 |
| Personnages Alien et associés complets | 6, soit 90 CG |
| Personnages Alien et associés restant à traiter | 60, soit 900 CG prévues |

Le découpage en lots de quarante reste un cadre d'organisation. Cette vague livre deux personnages ; elle ne termine ni un lot entier de quarante ni le roster.

## Sources, fidélité et conservation

Les [sources Hicks](hicks-reference-evidence-wave13-2026-11-09.json) et [sources Feral](feral-predator-reference-evidence-wave13-2026-11-09.json) séparent les vues filmées du visage ou du masque des supports NECA de corps, tenue, pieds et équipement. Ces figurines restent `usedForIdentity: false` ; leurs articulations, visages alternatifs et détails cachés ne sont pas des références filmées. Les graines générées servent à la cohésion, sans constituer une source indépendante.

**La fidélité 1:1 est l'objectif de comparaison ; aucune fidélité absolue n'est certifiée.** `canonicalFidelityApproved` reste faux. Les revues [Hicks](reviews/wave13-2026-11-09/hicks-independent-review.json), [Feral](reviews/wave13-2026-11-09/feral-predator-independent-review.json) et [atlas](reviews/wave13-2026-11-09/atlas-independent-review.json) précisent les limites visibles.

La [restauration du stockage des sources historiques](reviews/wave13-2026-11-09/historical-source-storage-review.json) conserve quinze reçus déclaratifs, 29 références historiques, vingt téléchargements aux URL exactes et 23 fichiers natifs uniques vérifiés par SHA. Ce sont les mêmes sources, sans nouvelle inspection ni qualification implicite. Le chargement de secours JavaScript exige un alias déclaré et la correspondance exacte de l'empreinte et de la taille ; un alias ne peut pas servir à blanchir une source différente. Quatre références Predator sont retrouvées par ce secours, sans doubler Bishop.

Cinq anciens bitmaps candidats indisponibles restent non qualifiés ; une vignette ne vaut pas preuve canonique. Les deux références Steam de Mistral restent `viewed: false`, et les restrictions historiques de Teal'c et Liquid Snake sont conservées. Les documents d'alias sans champ d'incarnation ne changent pas les anciennes incarnations : cette vague précise seulement les cibles Hicks/*Aliens* 1986 et Feral/*Prey* 2022.

Pour Ash, l'[erratum](ASH_REFERENCE_ZONE_CORRECTION_2026-11-09.md) corrige deux zones montrant Kane/John Hurt. Le [reçu](ash-reference-zone-correction-wave13-2026-11-09.json) reste `needs-reference`, `usedForIdentity: false`, `excludedFromGeneration: true`. Les deux copies des mêmes photos n'ajoutent aucune source indépendante et n'autorisent pas à inventer un corps.

## Bible, Rift et classeurs

L'autorité de production reste le [plan JSON](roster-production-2026-10-18.json), la [Bible JSON](roster-fidelity-bible-2026-10-18.json), le [manifeste global courant](roster-global-batch-wave11-2026-10-26.json), les reçus et les métadonnées DLC [Hicks](../../DLC/Alien/data/heroes.js) / [Feral](../../DLC/Prey/data/expandedUniverses.js). Les anciens guides et gels historiques restent intacts.

Les deux arcs Rift existants de Hicks (`9352`) et Feral (`9675`) ont été raccordés aux nouveaux atlas ; les 3197 autres arcs restent inchangés. Le catalogue compte 3199 arcs, dont 1021 disponibles et 2178 en attente. Les deux nouveaux verrous restent en attente, sans approbation automatique de références de source. La qualité technique d'un bitmap ne certifie pas son identité ni sa fidélité canonique.

La passe finale du [classeur CG](Multiverse_Breach_Fidelite_CG.xlsx) suit les corrections de portabilité des sources historiques et les deux raccordements Rift. Son SHA256 est `bda4014fab60c350d7dd3200624ca903e3f7f7e353aef38ee375e58174496937`. Le [résumé](Multiverse_Breach_Fidelite_CG.summary.json) et la [validation](Multiverse_Breach_Fidelite_CG.validation.json) couvrent quatorze onglets, 28680 emplacements, 1912 sujets, 525 univers et 1436 CG livrées. Le classeur reporte 43 sujets avec références externes d'identité, sept avec références limitées aux costumes et 155 vignettes de sources indépendantes ; ces compteurs ne sont pas des certifications artistiques.

Les valeurs manuelles réellement renseignées sont préservées : zéro avant, zéro après. Cinq tests Python comprennent une preuve synthétique de reprise des seize champs manuels ; ils ne prouvent pas l'existence de seize valeurs utilisateur renseignées.

Les trois classeurs gameplay restent byte-identiques à leurs versions de référence :

| Classeur | Octets | SHA256 |
| --- | ---: | --- |
| [Kart — 8 novembre](../excel/Multiverse_Breach_Kart_3D_2026-11-08.xlsx) | 351578 | `ea28ceb8fcba488d72c46ea7e2aaa85a31d4b5a9bd7ff421b0485c56f59a60ad` |
| [Missions Cité — 8 novembre](../excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx) | 1197519 | `245144e422a3fa89bed4ed4b0e1e994c4563b2cfc33798efe5fa9e4f02832e66` |
| [Kart — 9 novembre](../excel/Multiverse_Breach_Kart_3D_2026-11-09.xlsx) | 481945 | `11689070517eed35a4b87c866ec5d6eb0b077535f557d3ab859dcf2ece1996f9` |

## Vérifications

Les contrôles ciblés passent : 21 tests JavaScript de sources, cinq tests Python de classeur et 87 tests Rift. La chaîne plan–Bible–global et l'intégration des trente CG sont vérifiées.

La [revue navigateur](reviews/wave13-2026-11-09/browser-integration-review.json) passe sur deux tailles d'écran : trente CG, 32 images de poses des deux atlas, 90 médias HTTP comparés aux empreintes natives et deux anciens atlas HTTP identiques à la dernière base Git. Aucune erreur HTTP ou console n'est relevée. Les captures [Hicks](reviews/wave13-2026-11-09/screenshots/1365x900-hicks-all15-contact.png) et [Feral](reviews/wave13-2026-11-09/screenshots/1365x900-feral_predator-all15-contact.png) accompagnent la preuve publique. Ce contrôle local n'est pas une publication externe ni une certification artistique.

Le build complet `npm run build` passe sous Node 22.23.4, avec toute la chaîne de prébuild et la copie native des médias. Les 90 nouveaux fichiers CG et les quatre fichiers atlas/références exportés correspondent aux empreintes attendues. Les contrôles navigateur, Excel, CG, DLC, Rift et Kart sont documentés dans le [reçu final de livraison](fidelity-delivery-wave13-2026-11-09.json).

Les profils Kart de Hicks et Feral pointent également vers leurs nouveaux sprites. Le manifeste conserve les 1 912 véhicules ; seuls deux profils de conducteur et les métadonnées de leurs GLB sont actualisés. Les géométries binaires et les atlas de véhicule sont identiques à la révision GitHub ; les deux anciens GLB sont archivés. Le contrôle du catalogue Kart et ses 121 tests passent. Voir [le reçu de raccordement Kart](../kart/driver-reference-refresh-wave13-2026-11-09.json).
