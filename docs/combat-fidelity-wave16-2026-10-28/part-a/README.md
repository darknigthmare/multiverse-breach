# W16 — lot A, 40 personnages

Les 40 identités du plan figé disposent de 40 nouvelles planches de présentation à 32 poses et de 40 nouvelles bases à 16 poses : **80 PNG, 1 920 poses retenues**. Les huit présentations sont intro, outro, victoire/défaite de manche, finale, victoire/défaite du match et super. Les quatre états de base sont idle, run, action ordinaire et réaction. Chaque séquence utilise quatre dessins distincts. Le format final est une cellule de 256 px, quatre colonnes, baseline 244 et calibration commune entre sources d’un personnage.

Le [plan initial](source-plan.json) et son [reçu SHA](source-plan-receipt.json) précèdent toute génération. Ils restent immuables. Les corrections de faits et de mécanique figurent dans [les errata chronologiques](source-plan-errata.json), notamment Sybil, Bozo, Abe, Mugman, Chalice et le Techno Trousers. Les anciens sprites archivés dans `references/` servent uniquement à comparer les révisions.

## Sources réellement produites et exclusions

L’[inventaire complet](generation-inventory-complete.json) contient **55 appels réels image_gen** : 40 sources initiales et 15 essais correctifs. Les demandes effectives, horaires, reçus, chemins originaux et PNG bruts sont conservés dans `sources/`. Les demandes préparées ne sont pas des preuves d’exécution. Aucun refus de l’outil n’a été observé.

Les [sélections finales](generation-records.json) retiennent 1 920 poses et excluent **205 candidats**, sans suppression des sources rejetées :

- Aku utilise les 48 masques de sa source initiale. Le correctif de 48 poses est entièrement exclu car l’aura protectrice apparaît dans la mauvaise phase. Une plume détachée reste un composant de sa cellule, pas une pose supplémentaire.
- Jim et Cuphead remplacent leurs groupes initialement incomplets. Le premier correctif Jim à double tête est exclu ; le dernier conserve une seule tête de ver et le col vide quand le ver est manié. Le premier correctif Cuphead ambigu bouche/tête est exclu ; le dernier montre le bord ouvert de la tête tourné vers la droite.
- Peter réattribue la seconde transformation complète au super ; sa victoire de match dispose de quatre nouveaux dessins de chiot.
- Rufus, Beat et Corn avaient reçu cinq lignes, soit 40 dessins. Deux groupes correctifs apportent les huit poses manquantes de défaite du match et super.
- Sam remplace sa victoire tronquée et son groupe de cinq super-gestes. Gromit remplace une victoire de manche à trois figures.
- Chalice remplace les deux incantations pour faire apparaître le Shield Pal seulement au troisième dessin ; le familier persiste ensuite.
- CommandGirl remplace son action ordinaire avec projectile inventé par une action physique rythmée.
- Les 48 premières figures de Sybil et les 48 premières figures de Bozo sont rejetées pour apparence incorrecte. Sybil corrigée possède le chignon, les lunettes rouges et le costume bordeaux. Son correctif contient 52 figures complètes : quatre extras sont exclus, sans fusion de corps.
- Xtra conserve quatre des cinq gestes ordinaires indépendants. Le geste supplémentaire reste exclu. Crash et Max réordonnent uniquement quatre poses existantes pour placer la libération en colonne 2.

Les frontières d’import sont mesurées dans les pixels alpha, sans recoloration. Les contrôles exigent zéro coupure de pixels visibles, la propriété complète des composants retenus et l’égalité RGBA avec la source dans les régions importées. Crop, redimensionnement nearest-neighbor et packing sont les seules transformations graphiques. Le RGB caché sous alpha nul des sources n’est pas un fond opaque à effacer.

## Mécaniques et ancrages

Les deux exports de 40 entrées sont `COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_A` et `ABILITIES_WAVE16_PART_A`. Chaque kit révise explicitement les quatre actions ; les anciennes références restent consultables. Abe possède un ciblage `control` conditionné par une cible explicitement admissible Slig. Le chant adapté dure 1,1 s avant la possession de 2 s ou d’un tour Tactics ; ces durées ne sont pas des timings certifiés du jeu source. Mugman reçoit son invulnérabilité propre de Super Art II pendant 4,85 s après activation. Chalice reçoit un unique Shield Pal persistant qui absorbe un coup. Aucun soutien ordinaire n’obtient une arme ou un pouvoir offensif inventé.

Les [24 points mesurés](native-muzzle-review.json) couvrent les quatre dessins des phases finale/super de Max, Cuphead et Stranger. Ils utilisent respectivement le Luger, le bord supérieur ouvert de la tête et l’avant de l’arbalète au poignet. Chaque point est lié au SHA de la planche, à son crop de cellule et à son pixel RGBA. Le déplacement vers un pixel visible ne dépasse pas un pixel. La revue indépendante de l’intégration a accepté les 24 points après ouverture de la grille réelle ; elle figure dans `independent-emitter-review.json` et reste distincte de cette mesure par l’auteur.

## Vérification et limites

Les deux builders acceptent `--check` pour reconstruire les résultats et comparer exactement PNG, registres et provenance. `verify-final.mjs` contrôle les 80 planches, les 1 920 cellules distinctes, leurs SHA, les marges transparentes, les 40 kits complets et les 24 ancrages. Les contacts normalisés sont dans `contacts/` ; les cinq vues d’ensemble ont été ouvertes réellement. Le correctif final Cuphead possède une grille de revue séparée.

Cette livraison est une adaptation pixel art des incarnations choisies, **sans certification de fidélité 1:1**, sans extraction d’assets des jeux et sans reproduction certifiée de leurs frames ou textures. La recherche ciblée a corrigé des erreurs réelles ; elle ne signifie pas que toutes les URL ont été vérifiées par réseau. Les téléchargements d’images de référence Bozo ont été refusés par le proxy ; l’apparence détaillée de sa tenue n’est donc pas certifiée. Le grand Toggle utilise une personnalisation textile explicitement choisie ; Xtra une tenue pratique stylisée explicitement adaptée. Ces limites restent déclarées dans les métadonnées et ne disparaissent pas avec la validation technique.
