# W17 — lot B : 40 personnages livrés

Le lot fournit **80 atlas PNG transparents et 1 920 poses distinctes** : 40 présentations de 32 poses et 40 animations de base de 16 poses. Les 43 fiches de capacités et de sources comprennent les trois identités écartées de la production visuelle, conservées dans l’historique. La cohorte effective reste exactement de 40 personnages et suit les annexes publiées avant chaque remplacement.

| Livraison | Contenu |
| --- | --- |
| Présentation native | Intro, outro, victoire et défaite de manche, action de fin, victoire et défaite finales, super : 4 poses par phase |
| Animation de base | Attente, course, action ordinaire, réaction : 4 poses par état |
| Capacités | 21 nouvelles identités rédigées et 22 fiches existantes révisées, dont 21 partielles complétées ; 84 nouveaux emplacements explicites `simple` / `secondary` / `defense` |
| Provenance | 57 requêtes réelles : 55 images retournées et 2 refus réels ; une autre identité retenue sans requête après le refus du même personnage |
| Dessins observés | 2 116 dessins complets : 1 920 retenus une seule fois et 196 exclus |

Les versions, tenues et équipements sélectionnés sont explicités personnage par personnage dans [delivery-review.json](delivery-review.json), [source-plan.json](source-plan.json), les plans complémentaires et les définitions du jeu. Les illustrations, les enchaînements de quatre poses et les paramètres d’équilibrage sont des adaptations documentées. `source1to1Verified`, `canonicalVerified` et `networkVerified` restent à `false` : une nouvelle illustration cohérente ne constitue pas une certification de reproduction officielle image par image.

## Choix de continuité appliqués

- **Team Fortress 2** : équipements RED de base. Scout utilise Scattergun / Pistol / Bat ; Soldier Rocket Launcher / Shotgun / Shovel ; Medic Syringe Gun / Medi Gun / Bonesaw. L’action ordinaire de Soldier montre réellement le Rocket Launcher ; le super de Medic montre réellement le Medi Gun avec buse, tuyau et sac. Les marqueurs de capacités relient les soins au faisceau continu et à ses conditions d’ÜberCharge dans les moteurs.
- **Crypt of the NecroDancer** : Cadence garde une dague, Melody le Golden Lute. Les actions de Melody portent le marqueur utilisé par la mécanique de déplacement cardinal et de contact ; les dessins ne lui attribuent pas un projectile sonore à distance.
- **Nemesis, boîte de base 2018** : le Scientist reste assis dans son fauteuil dans les 48 poses, y compris déplacement et défaites ; le Scout est une femme avec son fusil. Leurs analyses et reconnaissances de super restent des soutiens à 0 dégât.
- **Counter-Strike** : opérateurs de Global Offensive 2018. SAS conserve le M4A1-S complet ; SAS et Richter utilisent une petite trace grise au silencieux dans leurs nouveaux dessins d’action. Les roquettes TF2 et REX de Sanctum 2 ont une métadonnée de projectile explicite.
- **Absolver Downfall** : configurations de Prospect personnalisées et déclarées, associées aux styles Windfall, Kahlt et Forsaken ; aucune tenue personnalisée n’est présentée comme l’unique apparence officielle du style.
- **Bendy** : Henry affiche explicitement son incarnation visible de Dark Revival 2022 ; l’emploi de la hache est déclaré comme adaptation de son rôle de jeu. Allison conserve ses cornes et son épée ; son halo conditionnel du Seeing Tool n’apparaît pas comme équipement permanent.
- **Soutiens ordinaires** : Sophie, Dana Barrett et Louis Tully non possédés, Tereshkova et Hammond n’obtiennent ni soin, ni attaque magique, ni dégâts inventés. Hammond porte son uniforme de service USAF de SG-1 et donne des instructions humaines ; aucun iris ou portail portable n’est dessiné sur lui.

Les capacités secondaires et défensives des 21 fiches partielles préexistantes sont conservées, avec seulement les marqueurs nécessaires à l’admission des mécaniques source de Medic et Melody. Les tests comparent réellement ces emplacements à l’état initial.

## Corrections et exclusions vérifiables

Les sources originales, prompts exacts, réponses réelles et SHA restent dans `sources/`. Les nouveaux dessins corrigent notamment le dispositif inventé de Sophie, les effets d’Electro Bolt avant/après émission, les traînées persistantes du Bouncer, les corps absents de certaines planches, les grandes flammes de silencieux, le Shotgun utilisé à la place du Rocket Launcher, le super de Cadence avec bombe et le SHOK de P-3 pendant une victoire calme.

`G` et Boris ont reçu deux refus réels. Aucune nouvelle version de ces personnages n’a été demandée pour contourner ces refus. La seconde incarnation de G a été retenue sans nouvelle requête ; ce cas est distingué d’un refus réellement retourné. Les remplacements prévus avant génération sont Dana Barrett, Louis Tully et Hammond. Janine n’a pas été ajoutée au lot, car elle possédait déjà des poses natives historiques.

Une première lecture de trois images RGBA très larges suggérait à tort une coupure de leur quatrième arme. La revue aplatie ultérieure confirme leurs quatre dessins complets. Les sources restent exclues au profit des correctifs suivants, mais les compteurs ont été corrigés : **aucun de ces trois dessins n’est déclaré incomplet**. Le plan préparatoire original est conservé ; [observation-erratum-first-correctives.json](observation-erratum-first-correctives.json) expose la rectification et son image de contrôle.

Le second correctif de Medic contient huit dessins complets observés. Sa rangée inférieure inutilisée comporte deux silhouettes réunies dans une composante alpha par les effets ; le détecteur compte donc 4 / 3 composantes et l’observation visuelle 8 dessins. Les quatre silhouettes indépendantes de la rangée supérieure sont les seules utilisées pour son super. Cette différence est explicite dans les enregistrements et ne crée aucune pose de remplacement artificielle.

## Construction et revue

Le traitement segmente les pixels RGBA existants, associe les fragments à leur dessin et effectue un redimensionnement au plus proche voisin. Il ne peint, ne recolore, ne réfléchit et ne répare aucun membre. Chaque pixel non transparent de chaque source segmentée est assigné exactement une fois. Les cadres de sortie ont une marge transparente et les 48 empreintes d’un personnage sont toutes différentes. Une calibration commune par source conserve les proportions des postures ; celle du Scientist mesure explicitement le corps assis avec son fauteuil.

[generation-records.json](generation-records.json) décrit les sélections exactes, exclusions, sources et calibrations. [native-provenance.json](native-provenance.json) et [base-provenance.json](base-provenance.json) relient les atlas aux PNG, prompts et reçus réels. Les ressources historiques sont archivées pour leur provenance ; l’archivage seul ne revendique pas leur inspection visuelle.

Les sources retenues ont été vues avec `view_image`. Les six planches [packed-contact-review-groups.json](packed-contact-review-groups.json) regroupent les 18 derniers personnages, avec leurs 32 poses natives et 16 poses de base, et ont été inspectées après leur assemblage. Les 22 premiers atlas natifs disposent aussi de la revue anatomique séparée du responsable des ancrages. Les contacts aplatis servent uniquement à la QA ; les PNG de production conservent leur transparence.

Commandes de vérification du lot :

```sh
node --test scripts/combatFidelityWave17PartB.test.mjs
node scripts/buildCombatCharacterAnimationsWave17PartB.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave17PartB.mjs --check
node docs/combat-fidelity-wave17-2026-11-02/part-b/write-delivery-review.mjs
```

Résultats enregistrés dans [validation-results.json](validation-results.json) : les trois tests passent, et les deux reconstructions `--check` correspondent aux 80 PNG et aux registres livrés.

Les scripts `prepare-*` sont les traces de préparation des plans préalables à la génération ; les réexécuter changerait cet historique. Pour reconstruire les atlas à partir des sources archivées, utiliser les deux scripts `buildCombatCharacter*Wave17PartB.mjs` sans `--check`.

Cette revue décrit la livraison réelle du lot B. Les ancrages anatomiques supplémentaires, la vérification navigateur des quatre moteurs, le build global, le gel final et la publication sont enregistrés séparément par leurs responsables ; leur réussite n’est pas déduite de la présence de ces atlas.
