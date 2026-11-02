# W15 — lot B, 40 personnages

Ce lot remplace les quatre commandes génériques de chaque personnage par des gestes nommés et une version explicitement choisie. Il fournit 40 planches de présentation de 32 dessins et 40 planches de combat de base de 16 dessins : **1 920 dessins distincts retenus**, issus de **57 vrais appels `image_gen`**. Aucun corps, arme ou effet n’a été peint, recoloré ou symétrisé par le code. Les 268 dessins exclus restent archivés ; ils ne sont pas comptés comme livrés.

Les choix détaillés de jeu, année, tenue, équipement, geste, effet et partenaire figurent dans [source-plan-effective.json](source-plan-effective.json). Le plan initial est conservé sans réécriture dans [source-plan.json](source-plan.json) ; les corrections datées et leur chronologie sont dans [source-plan-errata.json](source-plan-errata.json). Les références historiques générées servent uniquement au suivi de l’identité et ne prouvent pas le canon. Les trois vraies images d’Adon N64 ont été inspectées séparément avant son dessin.

La fidélité officielle 1:1 n’est pas certifiée : `source1to1Verified`, `canonicalVerified` et `networkVerified` restent faux. Les animations sont des adaptations originales des versions déclarées, avec les limites du moteur. Les poses de présentation ne remplacent pas la machine de mouvement complète Mêlée ; Sir Daniel reçoit cette dernière dans un chantier indépendant sans partager ou recompter ses pixels.

## Comportement intégré

- 160 commandes personnalisées ; dégâts nuls pour les actions de soutien et de contrôle.
- 40 partenaires RPG du même univers, différents de l’invocateur.
- Huit séquences natives : introduction, sortie, victoire et défaite de manche, finition, victoire et défaite finales, super ; quatre dessins indépendants par séquence.
- Quatre états de base : attente, course, attaque, impact ; quatre dessins indépendants par état.
- 80 points d’émission physiques inspectés sur les quatre poses de super et de finition des dix tireurs. Les arcs restent en main après le lâcher ; les flèches volantes viennent du moteur.
- Maya utilise Phaselock sur un ennemi, sans dégâts directs ni bouclier inventé. Le moteur applique un contrôle borné et sa suspension visuelle ; les quatre moteurs disposent de tests dédiés.

Les corrections les plus visibles concernent Millia jaune, l’unique bras-vipère droit de True Ogre Tekken3, Majima Kiwami à cheveux courts et cache-œil gauche, Axel SoR2 et son uppercut, le kimono-pantalon violet de Yae, Kiya sans arme et Adon N64 gris-bleu/prune/or. Les supers violets magiques involontaires de Yae ont été rejetés ; quatre nouveaux gestes de katana physique les remplacent.

## Preuves et reproduction

[generation-records.json](generation-records.json) relie chaque rangée aux quatre dessins sources retenus. [source-exclusions.json](source-exclusions.json) distingue les corps réellement observés des composantes alpha, des effets isolés et des dessins écartés. Les prompts exacts, arguments, reçus et PNG originaux sont conservés dans `sources/`. [generation-observation-index.json](generation-observation-index.json) distingue l’heure de retour observée de l’outil des dates du système de fichiers ; aucune date de génération du fournisseur n’est inventée.

Le packing conserve chaque corps et ses fragments RGBA, ajoute dix pixels de marge transparente et applique une échelle commune par source. Une calibration tête-semelle explicite exclut la pointe d’arc pour les deux Turoks et le bâton levé du magicien bleu. La lunge physique de Yae a une vérification bornée à sa boîte source exacte, plus large que l’heuristique ordinaire ; elle ne change ni les marges ni les exigences d’unicité.

```sh
node docs/combat-fidelity-wave15-2026-10-26/part-b/create-records.mjs
node scripts/buildCombatCharacterAnimationsWave15PartB.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave15PartB.mjs --check
node docs/combat-fidelity-wave15-2026-10-26/part-b/anchor-review/verify-measurements.mjs --require-all-ten
node docs/combat-fidelity-wave15-2026-10-26/part-b/verify-delivery.mjs --check
```

[verification.json](verification.json) vérifie les 80 PNG, les 1 920 cellules distinctes en RGBA et avec alpha fort, les marges, les commandes et partenaires réels, les points d’émission et leur projection P1/P2, ainsi que la préservation des 730 PNG et 118 registres historiques W1–14. Les planches de contrôle finales se trouvent dans [final-review/index.json](final-review/index.json) ; elles ne sont pas comptées comme de nouveaux dessins.
