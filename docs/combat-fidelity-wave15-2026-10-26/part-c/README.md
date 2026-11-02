# W15 — Lot C de 40 personnages

Ce lot conserve les quarante identités sélectionnées avant édition dans le [plan W15](../batch-plan-before.json). Il livre **40 présentations natives de 32 poses et 40 bases de 16 poses : 80 PNG, 1 920 dessins retenus distincts**, également distincts après exclusion des pixels de faible alpha pour le contrôle d’identité. Les 160 emplacements de capacité sont rédigés par personnage, avec sept nouveaux profils et trente-trois révisions de sources existantes. Les manifestes Mêlée de 45 états restent suivis séparément dans l’audit global.

Le [plan de versions initial](source-plan.json), son [erratum](source-plan-errata.json) et le [plan effectif](source-plan-effective.json) précisent œuvre, période, costume, équipement, geste et stature. Le Marine classique de *Doom* utilise le fusil de 1993 ; l’habitant de l’Abri 13 conserve son 10 mm de *Fallout* (1997), sans Fat Man anachronique ; Wesker est le capitaine S.T.A.R.S. de 1996, sans mutation Uroboros. Les apparences et équipements sélectionnables sont déclarés comme des choix. Hellfire et Kenny restent des rôles de soutien du roster d’anthologie, sans identité personnelle ou costume officiel prétendument attestés.

Les supers comprennent vingt-neuf actions offensives : vingt-quatre projectiles, un arc de Lightning Gun et quatre contacts physiques (Sentinel, Betrayer, Dog et Alec Mason). Les onze soutiens ne causent aucun dégât. VEGA est représenté par un terminal diagnostique ; Cortana utilise son interface holographique ; Rick, Kendra, Kirk, Bravura et Eos conservent leurs outils de communication ou d’analyse. Val emploie son véritable **Healing Burst**, soin proche du groupe et d’elle-même, borné à 220 unités, avec déclenchement du pack médical. Le Medgun, qui vise normalement un seul allié, ne sert pas de nom à ce soin collectif.

La première image Medgun de Val était déjà en cours lorsque la correction a été reçue. L’erratum conserve donc honnêtement `beforeAnyGenerationForAffectedHero:false` et `beforeCorrectiveGenerationForAffectedHero:true`. Les quarante-huit dessins initiaux restent archivés et entièrement exclus. Les autres sources de Val apportent le pack médical, les postures calmes et les dessins supplémentaires nécessaires pour éviter les deux silhouettes reliées verticalement dans le correctif initial.

## Dessins, normalisation et corrections

Les [sélections de génération](generation-records.json) lient 61 sources à leurs prompts exacts, reçus, empreintes et références archivées. La [liste des exclusions](source-exclusions.json) conserve le comptage conservateur de 2 273 dessins/composantes observés et 353 écartés. Les silhouettes jointes ou incomplètes ne comptent jamais comme une pose livrée. Chaque dessin retenu est sélectionné une seule fois ; les vingt-cinq supers à émission et les quatre contacts disposent de véritables gestes natifs.

Les corrections courtes réparent les figures absentes, les pieds tronqués, les croisements d’équipement et les flashes placés avant le relâchement. Les douze poses offensives du Sentinel montrent maintenant un estoc horizontal physique : armement, visée de la lance, extension visible de la pointe en troisième pose, retour. Dog conserve ses mains mécaniques ; l’Exosuit garde ses deux canons intégrés. Les séquences calmes ne gagnent pas de tir, de rayon ou de pouvoir emprunté.

Le découpage technique préserve les RGBA des régions natives retenues avant un unique redimensionnement au plus proche voisin. Une même échelle de source conserve les rapports de posture. Les [étalons du Sentinel](stature-calibration/sentinel-reference-review.json) distinguent la hauteur du casque au pied de la boîte de composante qui comprend la pointe de la lance ; les grilles brutes ne montrent pas la compensation `renderScale` appliquée en jeu.

Deux [ROI techniques](native-foot-roi-corrections.json) corrigent uniquement les cellules `fatality/c2` de Foster et Ana : une frange d’alpha 1 sous les pieds faisait flotter leur corps. Les rectangles englobent tous les pixels d’alpha supérieur à 24 et conservent exactement les RGBA internes, y compris les alphas plus faibles. L’échelle d’origine reste gelée ; seule la marge extérieure est exclue et les pieds sont placés au niveau des poses voisines. La [preuve de reconstruction](normalization-review/verified-native-foot-rois.json) vérifie les deux cellules modifiées, les 62 autres cellules identiques des deux PNG et les bases inchangées. Cette correction ajoute zéro dessin.

## Émission et vérification

Les [200 points mesurés](anchor-review/native-muzzle-review.json) couvrent les vingt-cinq émetteurs, quatre poses de super et quatre de présentation finale chacun. Ils utilisent un pixel existant du vrai canon, de l’émetteur du Shock Rifle ou des paumes du Vortigaunt. La flamme et l’extrémité d’un arc ne servent pas de bouche. Les marqueurs jaunes restent des images d’inspection et ne sont pas publiés comme sprites. La simulation conserve la propriété des tirs, cibles, coûts et contacts.

Deux revues indépendantes, [B : 12 émetteurs / 96 points](independent-anchor-review-b.json) et [root : 13 émetteurs / 104 points](independent-anchor-review-root.json), couvrent les 200 points sans recouvrement. Elles relient les grilles finales au registre public, aux RGBA et aux sources réelles. La [vérification du lot](delivery-check.json) contrôle les 80 PNG, les 1 920 cellules, les 40 références, les 730 PNG et les 118 registres historiques conservés. Les preuves navigateur et le build complet sont réunis au niveau de la livraison W15.

```bash
node scripts/buildCombatCharacterAnimationsWave15PartC.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave15PartC.mjs --check
node docs/combat-fidelity-wave15-2026-10-26/part-c/verify-native-foot-rois.mjs
node docs/combat-fidelity-wave15-2026-10-26/part-c/verify-delivery.mjs
```

Les versions, dessins générés et adaptations de mécaniques sont documentés ; ils ne sont pas des frames officielles ni une certification de fidélité 1:1. Les drapeaux de certification restent faux.
